"""PostgreSQL/RLS acceptance coverage for technician work, media, and QC."""

import base64
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "qc_results", "job_attachments", "work_updates", "technician_tasks", "qc_checks",
            "stock_ledger", "material_ledger", "material_reservations", "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items",
            "job_events", "estimate_decisions", "estimate_lines", "estimates", "job_cards", "tenant_audit_events", "visits", "vehicles", "customers",
            "support_emulations", "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings", "membership_roles", "role_permissions",
            "tenant_roles", "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (gen_random_uuid(),'platform-superadmin','Platform','platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject='platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": "Main", "tenant_admin_name": "Owner", "tenant_admin_email": f"{name}@example.test",
        "plan": "Growth", "agreed_price": "1.00", "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-01", "payment_status": "pending", "internal_notes": "",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _activate_owner_and_technician(tenant_id: str, owner_subject: str, technician_subject: str) -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        owner = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": owner["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": owner_subject, "membership_id": owner["id"], "user_id": owner["user_id"]})
        technician_id, membership_id = uuid4(), uuid4()
        branch_id = connection.execute(text("SELECT primary_branch_id FROM tenants WHERE id=:tenant_id"), {"tenant_id": tenant_id}).scalar_one()
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email,active_membership_id) VALUES (:id,:subject,'Tech','tech@example.test',:membership_id)"), {"id": str(technician_id), "subject": technician_subject, "membership_id": str(membership_id)})
        connection.execute(text("INSERT INTO tenant_memberships (id,tenant_id,user_id,status) VALUES (:id,:tenant_id,:user_id,'ACTIVE')"), {"id": str(membership_id), "tenant_id": tenant_id, "user_id": str(technician_id)})
        connection.execute(text("INSERT INTO membership_branches (membership_id,branch_id,tenant_id) VALUES (:membership_id,:branch_id,:tenant_id)"), {"membership_id": str(membership_id), "branch_id": str(branch_id), "tenant_id": tenant_id})
        connection.execute(text("INSERT INTO membership_roles (membership_id,role_id,tenant_id) SELECT :membership_id,id,:tenant_id FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Technician'"), {"membership_id": str(membership_id), "tenant_id": tenant_id})
        for permission in ("page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write", "page.receive-vehicle.read", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write", "page.estimate.read", "page.estimate.write", "page.my-queue.read", "page.my-queue.write"):
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})


def _active_job(client: TestClient, headers: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha", "mobile": "9000000000", "type": "Individual"}).json()
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 100}).json()
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Service"}).json()
    job = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit["id"]}).json()
    assert client.post(f"/api/v1/jobs/{job['id']}/commands/start-work", headers=headers, json={}).status_code == 200
    return job["id"]


@pytest.mark.integration
def test_technician_evidence_qc_rework_and_media_are_routed_through_rls() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-execution"), _provision(client, "south-execution")
        _activate_owner_and_technician(str(north["id"]), "north-owner", "north-tech")
        _activate_owner_and_technician(str(south["id"]), "south-owner", "south-tech")
        owner_headers, tech_headers = {"x-workshopos-identity": "north-owner"}, {"x-workshopos-identity": "north-tech"}
        job_id = _active_job(client, owner_headers)
        from app.database import get_engine
        with get_engine().begin() as connection:
            tech_id = connection.execute(text("SELECT id FROM platform_users WHERE cognito_subject='north-tech'")).scalar_one()
        task = client.post(f"/api/v1/jobs/{job_id}/technician-tasks", headers=owner_headers, json={"technicianId": str(tech_id), "title": "Diagnose engine"})
        assert task.status_code == 201, task.text
        assert client.get("/api/v1/technician-tasks/mine", headers=tech_headers).json()[0]["id"] == task.json()["id"]
        assert client.post(f"/api/v1/technician-tasks/{task.json()['id']}/commands/start", headers=tech_headers, json={}).status_code == 200
        update = client.post(f"/api/v1/jobs/{job_id}/work-updates", headers=tech_headers, json={"taskId": task.json()["id"], "body": "Engine inspected", "kind": "progress"})
        assert update.status_code == 201, update.text
        attachment = client.post(f"/api/v1/jobs/{job_id}/attachments", headers=tech_headers, json={"category": "work_evidence", "filename": "engine.jpg", "contentType": "image/jpeg", "dataBase64": base64.b64encode(b"jpeg-bytes").decode(), "caption": "Engine bay"})
        assert attachment.status_code == 201, attachment.text
        content = client.get(attachment.json()["contentPath"], headers=tech_headers)
        assert content.status_code == 200 and content.content == b"jpeg-bytes"
        check = client.post(f"/api/v1/jobs/{job_id}/qc-checks", headers=tech_headers, json={"label": "Road test"})
        assert check.status_code == 201, check.text
        assert client.post(f"/api/v1/technician-tasks/{task.json()['id']}/commands/complete", headers=tech_headers, json={}).status_code == 200
        failed = client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "fail", "note": "Noise remains"})
        assert failed.status_code == 200 and failed.json()["reworkTask"], failed.text
        rework_id = failed.json()["reworkTask"]["id"]
        assert client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "pass"}).status_code == 422
        assert client.post(f"/api/v1/technician-tasks/{rework_id}/commands/start", headers=tech_headers, json={}).status_code == 200
        assert client.post(f"/api/v1/technician-tasks/{rework_id}/commands/complete", headers=tech_headers, json={}).status_code == 200
        assert client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "pass", "note": "Road test passed"}).status_code == 200
        assert client.get(f"/api/v1/jobs/{job_id}/execution", headers={"x-workshopos-identity": "south-tech"}).status_code == 404
