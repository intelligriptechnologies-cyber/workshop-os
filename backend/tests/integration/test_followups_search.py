"""PostgreSQL/RLS coverage for Follow-ups and cross-entity Search."""

from datetime import datetime, timezone
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        # Integration fixtures must reset immutable ledger tables through a
        # cascading TRUNCATE, rather than DELETE (which their invariants reject).
        connection.execute(text("TRUNCATE TABLE tenants, platform_users RESTART IDENTITY CASCADE"))
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (gen_random_uuid(),'platform-superadmin','Platform','platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject='platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": "Main", "tenant_admin_name": "Owner", "tenant_admin_email": f"{name}@example.test",
        "plan": "Growth", "agreed_price": "1.00", "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-01", "payment_status": "pending", "internal_notes": "",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _activate_owner(tenant_id: str, subject: str) -> dict[str, str]:
    from app.database import get_engine
    permissions = (
        "page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write",
        "page.receive-vehicle.read", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write",
        "page.estimate.read", "page.estimate.write", "page.invoice.read", "page.invoice.write",
        "page.follow-ups.read", "page.follow-ups.write", "page.search.read",
    )
    with get_engine().begin() as connection:
        member = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": member["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": member["id"], "user_id": member["user_id"]})
        for permission in permissions:
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})
        branch_id = connection.execute(text("SELECT id FROM branches WHERE tenant_id=:tenant_id AND is_primary"), {"tenant_id": tenant_id}).scalar_one()
        connection.execute(text("INSERT INTO membership_branches (membership_id,tenant_id,branch_id) VALUES (:membership_id,:tenant_id,:branch_id) ON CONFLICT DO NOTHING"), {"membership_id": str(member["id"]), "tenant_id": tenant_id, "branch_id": str(branch_id)})
        connection.execute(text("INSERT INTO membership_roles (membership_id,tenant_id,role_id) SELECT :membership_id,:tenant_id,id FROM tenant_roles WHERE tenant_id=:tenant_id AND system_key='service_manager' ON CONFLICT DO NOTHING"), {"membership_id": str(member["id"]), "tenant_id": tenant_id})
        department_id = uuid4()
        connection.execute(text("INSERT INTO service_departments (id,tenant_id,branch_id,name,created_by,updated_by) VALUES (:id,:tenant_id,:branch_id,'Mechanical',:user_id,:user_id)"), {"id": str(department_id), "tenant_id": tenant_id, "branch_id": str(branch_id), "user_id": str(member["user_id"])})
        connection.execute(text("INSERT INTO service_department_managers (tenant_id,branch_id,department_id,manager_membership_id,appointed_by) VALUES (:tenant_id,:branch_id,:department_id,:membership_id,:user_id)"), {"tenant_id": tenant_id, "branch_id": str(branch_id), "department_id": str(department_id), "membership_id": str(member["id"]), "user_id": str(member["user_id"])})
        return {"department": str(department_id), "manager": str(member["user_id"])}


def _job_and_invoice(client: TestClient, headers: dict[str, str], route: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha Search", "mobile": "9000000000", "type": "Individual"}).json()
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01SEARCH", "make": "Honda", "model": "City", "km": 100}).json()
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Search service"}).json()
    job = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit["id"], "departmentId": route["department"], "responsibleManagerId": route["manager"], "workList": "Annual service"}).json()
    estimate = client.post(f"/api/v1/jobs/{job['id']}/estimates", headers=headers, json={"lines": [{"kind": "labour", "description": "Service", "quantity": 1, "rate": 1000, "gstRate": 18}]}).json()
    approved = client.post(f"/api/v1/estimates/{estimate['id']}/decision", headers=headers, json={"outcome": "approved", "channel": "in_person", "decidedAt": datetime.now(timezone.utc).isoformat()})
    assert approved.status_code == 200, approved.text
    invoice = client.post(f"/api/v1/jobs/{job['id']}/invoices", headers=headers, json={})
    assert invoice.status_code == 201, invoice.text
    return int(job["id"])


@pytest.mark.integration
def test_followups_and_search_are_routed_by_permissions_tenant_and_branch() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-search"), _provision(client, "south-search")
        north_route = _activate_owner(str(north["id"]), "north-user")
        _activate_owner(str(south["id"]), "south-user")
        headers = {"x-workshopos-identity": "north-user"}
        job_id = _job_and_invoice(client, headers, north_route)

        created = client.post("/api/v1/follow-ups", headers=headers, json={"jobId": job_id, "note": "Call Asha", "dueAt": "2026-10-02"})
        assert created.status_code == 201, created.text
        followup = created.json()
        assert followup["status"] == "OPEN" and followup["customerName"] == "Asha Search"
        updated = client.put(f"/api/v1/follow-ups/{followup['id']}", headers=headers, json={"note": "Call Asha after estimate", "dueAt": "2026-10-03", "outcome": ""})
        assert updated.status_code == 200 and updated.json()["version"] == 2, updated.text
        completed = client.post(f"/api/v1/follow-ups/{followup['id']}/commands/complete", headers=headers, json={"outcome": "Customer confirmed"})
        assert completed.status_code == 200 and completed.json()["status"] == "COMPLETED", completed.text
        archived = client.post(f"/api/v1/follow-ups/{followup['id']}/archive", headers=headers, json={"reason": "History retained"})
        assert archived.status_code == 200 and archived.json()["archivedAt"], archived.text
        assert client.get("/api/v1/follow-ups", headers=headers).json() == []
        assert len(client.get("/api/v1/follow-ups?archived=true", headers=headers).json()) == 1

        search = client.get("/api/v1/search?q=Asha", headers=headers)
        assert search.status_code == 200, search.text
        assert {row["entity"] for row in search.json()["results"]} == {"customer", "vehicle", "job", "invoice"}
        assert client.get("/api/v1/follow-ups", headers={"x-workshopos-identity": "south-user"}).json() == []
        assert client.get("/api/v1/search?q=Asha", headers={"x-workshopos-identity": "south-user"}).json()["results"] == []
        denied_branch = client.get(f"/api/v1/search?q=Asha&branchId={south['primaryBranch']['id']}", headers=headers)
        assert denied_branch.status_code == 403 and denied_branch.json()["code"] == "BRANCH_ACCESS_DENIED"

        from app.database import get_engine
        with get_engine().begin() as connection:
            actions = connection.execute(text("SELECT action FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at"), {"tenant_id": str(north["id"])}).scalars().all()
        assert {"FOLLOWUP_CREATED", "FOLLOWUP_UPDATED", "FOLLOWUP_COMPLETED", "FOLLOWUP_ARCHIVED"} <= set(actions)
