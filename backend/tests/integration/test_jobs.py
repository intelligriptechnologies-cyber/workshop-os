"""Docker/PostgreSQL acceptance coverage for Job Cards and Estimate commands."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "job_events", "estimate_decisions", "estimate_lines", "estimates", "job_cards",
            "tenant_audit_events", "visits", "vehicles", "customers", "support_emulations",
            "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings",
            "membership_roles", "role_permissions", "tenant_roles", "membership_branches",
            "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (gen_random_uuid(), 'platform-superadmin', 'Platform Admin', 'platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject = 'platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": f"{name} Main", "tenant_admin_name": "Tenant Admin",
        "tenant_admin_email": f"{name.lower()}@example.test", "plan": "Growth", "agreed_price": "2500.00",
        "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-05",
        "payment_status": "pending", "internal_notes": "job test",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _activate_owner(tenant_id: str, subject: str) -> None:
    from app.database import get_engine
    permissions = (
        "page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write",
        "page.receive-vehicle.read", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write",
        "page.estimate.read", "page.estimate.write", "page.my-queue.read", "page.my-queue.write",
    )
    with get_engine().begin() as connection:
        row = connection.execute(text("SELECT m.id AS membership_id, m.user_id FROM tenant_memberships m WHERE m.tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": row["membership_id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject, active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": row["membership_id"], "user_id": row["user_id"]})
        for permission in permissions:
            connection.execute(text("""
                INSERT INTO role_permissions (role_id, permission)
                SELECT id, :permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin'
                ON CONFLICT DO NOTHING
            """), {"tenant_id": tenant_id, "permission": permission})


def _intake(client: TestClient, headers: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Anika", "mobile": "9000000001", "type": "Individual"})
    assert customer.status_code == 201, customer.text
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer.json()["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 1200})
    assert vehicle.status_code == 201, vehicle.text
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer.json()["id"], "vehicleId": vehicle.json()["id"], "fuel": "3 bars", "odoReading": 1200, "requestedWork": "Service"})
    assert visit.status_code == 201, visit.text
    return visit.json()["id"]


@pytest.mark.integration
def test_job_estimate_decision_and_lifecycle_are_scoped_and_audited() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north"), _provision(client, "south")
        _activate_owner(str(north["id"]), "north-user")
        _activate_owner(str(south["id"]), "south-user")
        headers = {"x-workshopos-identity": "north-user"}
        visit_id = _intake(client, headers)
        job = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit_id, "workList": "Annual service"})
        assert job.status_code == 201, job.text
        assert job.json()["status"] == "NEW"
        assert client.post("/api/v1/jobs", headers=headers, json={"visitId": visit_id}).status_code == 409

        estimate = client.post(f"/api/v1/jobs/{job.json()['id']}/estimates", headers=headers, json={"lines": [{"kind": "labour", "description": "Annual service", "quantity": 1, "rate": 1000, "gstRate": 18}]})
        assert estimate.status_code == 201, estimate.text
        from app.database import get_engine
        with get_engine().begin() as connection:
            branch = connection.execute(text("SELECT primary_branch_id FROM tenants WHERE id=:tenant_id"), {"tenant_id": str(north["id"])}).scalar_one()
            owner = connection.execute(text("SELECT user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": str(north["id"])}).scalar_one()
            connection.execute(text("INSERT INTO branch_settings (tenant_id,branch_id,settings,updated_by) VALUES (:tenant_id,:branch_id,CAST(:settings AS jsonb),:owner) ON CONFLICT (tenant_id,branch_id) DO UPDATE SET settings=EXCLUDED.settings"), {"tenant_id": str(north["id"]), "branch_id": str(branch), "settings": '{\"requireEstimateApproval\": true}', "owner": str(owner)})
        blocked = client.post(f"/api/v1/jobs/{job.json()['id']}/commands/start-work", headers=headers, json={})
        assert blocked.status_code == 422 and blocked.json()["code"] == "ESTIMATE_APPROVAL_REQUIRED"
        decision = client.post(f"/api/v1/estimates/{estimate.json()['id']}/decision", headers=headers, json={"outcome": "approved", "channel": "whatsapp", "decidedAt": "2026-09-29T10:00:00Z", "note": "Customer accepted quote"})
        assert decision.status_code == 200, decision.text
        assert decision.json()["estimate"]["approvedSnapshot"]
        started = client.post(f"/api/v1/jobs/{job.json()['id']}/commands/start-work", headers=headers, json={})
        assert started.status_code == 200 and started.json()["status"] == "IN_PROGRESS"
        completion = client.post(f"/api/v1/jobs/{job.json()['id']}/commands/complete-work", headers=headers, json={})
        assert completion.status_code == 422 and completion.json()["code"] == "COMPLETION_PREREQUISITES_UNMET"
        assert client.post(f"/api/v1/jobs/{job.json()['id']}/commands/hold-job", headers=headers, json={}).status_code == 422
        held = client.post(f"/api/v1/jobs/{job.json()['id']}/commands/hold-job", headers=headers, json={"reason": "Awaiting customer part decision"})
        assert held.status_code == 200 and held.json()["status"] == "HOLD"
        assert client.get("/api/v1/jobs", headers={"x-workshopos-identity": "south-user"}).json() == []
