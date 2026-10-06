"""PostgreSQL/RLS acceptance coverage for technician work, media, and QC."""

import base64
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        tables = connection.execute(text("""
            SELECT quote_ident(tablename) FROM pg_tables
            WHERE schemaname = 'public' AND tablename <> 'alembic_version'
        """)).scalars().all()
        connection.execute(text(f"TRUNCATE TABLE {', '.join(tables)} RESTART IDENTITY CASCADE"))
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
        branch_id = connection.execute(text("SELECT id FROM branches WHERE tenant_id=:tenant_id AND is_primary"), {"tenant_id": tenant_id}).scalar_one()
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (:id,:subject,'Tech','tech@example.test')"), {"id": str(technician_id), "subject": technician_subject})
        connection.execute(text("INSERT INTO tenant_memberships (id,tenant_id,user_id,status) VALUES (:id,:tenant_id,:user_id,'ACTIVE')"), {"id": str(membership_id), "tenant_id": tenant_id, "user_id": str(technician_id)})
        connection.execute(text("UPDATE platform_users SET active_membership_id=:membership_id WHERE id=:id"), {"membership_id": str(membership_id), "id": str(technician_id)})
        connection.execute(text("INSERT INTO membership_branches (membership_id,branch_id,tenant_id) VALUES (:membership_id,:branch_id,:tenant_id)"), {"membership_id": str(membership_id), "branch_id": str(branch_id), "tenant_id": tenant_id})
        connection.execute(text("INSERT INTO membership_roles (membership_id,role_id,tenant_id) SELECT :membership_id,id,:tenant_id FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Technician'"), {"membership_id": str(membership_id), "tenant_id": tenant_id})
        for permission in ("page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write", "page.receive-vehicle.read", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write", "page.estimate.read", "page.estimate.write", "page.my-queue.read", "page.my-queue.write"):
            connection.execute(text("INSERT INTO role_permissions(role_id,permission) SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin' ON CONFLICT DO NOTHING"), {"permission": permission, "tenant_id": tenant_id})


def _active_job(client: TestClient, headers: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha", "mobile": "9000000000", "type": "Individual"}).json()
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 100}).json()
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Service"}).json()
    from app.database import get_engine
    with get_engine().begin() as connection:
        row = connection.execute(text("""
            INSERT INTO job_cards (tenant_id, branch_id, job_no, visit_id, status, work_list, created_by, updated_by)
            SELECT visit.tenant_id, visit.branch_id, 'EXECUTION-TEST', visit.id, 'IN_PROGRESS', 'Service', user_row.id, user_row.id
            FROM visits visit CROSS JOIN platform_users user_row
            WHERE visit.id=:visit_id AND user_row.cognito_subject=:subject
            RETURNING id
        """), {"visit_id": visit["id"], "subject": headers["x-workshopos-identity"]}).scalar_one()
    return int(row)


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
        paused = client.post(f"/api/v1/technician-tasks/{task.json()['id']}/commands/pause", headers=tech_headers, json={"reason": "Awaiting diagnostic tool"})
        assert paused.status_code == 200 and paused.json()["status"] == "PAUSED", paused.text
        assert client.post(f"/api/v1/technician-tasks/{task.json()['id']}/commands/resume", headers=tech_headers, json={}).status_code == 200
        update = client.post(f"/api/v1/jobs/{job_id}/work-updates", headers=tech_headers, json={"taskId": task.json()["id"], "body": "Engine inspected", "kind": "progress"})
        assert update.status_code == 201, update.text
        attachment = client.post(f"/api/v1/jobs/{job_id}/attachments", headers=tech_headers, json={"category": "work_evidence", "filename": "engine.jpg", "contentType": "image/jpeg", "dataBase64": base64.b64encode(b"jpeg-bytes").decode(), "caption": "Engine bay"})
        assert attachment.status_code == 201, attachment.text
        content = client.get(attachment.json()["contentPath"], headers=tech_headers)
        assert content.status_code == 200 and content.content == b"jpeg-bytes"
        assert client.get(attachment.json()["contentPath"], headers={"x-workshopos-identity": "south-tech"}).status_code == 404
        check = client.post(f"/api/v1/jobs/{job_id}/qc-checks", headers=tech_headers, json={"label": "Road test"})
        assert check.status_code == 201, check.text
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE job_cards SET status='COMPLETED' WHERE id=:id"), {"id": job_id})
        rejected_qc = client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "fail", "note": "must not alter a completed Job Card"})
        assert rejected_qc.status_code == 422
        assert rejected_qc.json()["code"] == "QC_NOT_AVAILABLE_FOR_JOB_STATUS"
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE job_cards SET status='IN_PROGRESS' WHERE id=:id"), {"id": job_id})
        assert client.post(f"/api/v1/technician-tasks/{task.json()['id']}/commands/complete", headers=tech_headers, json={}).status_code == 200
        failed = client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "fail", "note": "Noise remains"})
        assert failed.status_code == 200 and failed.json()["reworkTask"], failed.text
        rework_id = failed.json()["reworkTask"]["id"]
        assert client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "pass"}).status_code == 422
        assert client.post(f"/api/v1/technician-tasks/{rework_id}/commands/start", headers=tech_headers, json={}).status_code == 200
        assert client.post(f"/api/v1/technician-tasks/{rework_id}/commands/complete", headers=tech_headers, json={}).status_code == 200
        assert client.post(f"/api/v1/qc-checks/{check.json()['id']}/result", headers=tech_headers, json={"outcome": "pass", "note": "Road test passed"}).status_code == 200
        execution = client.get(f"/api/v1/jobs/{job_id}/execution", headers=tech_headers)
        assert execution.status_code == 200, execution.text
        payload = execution.json()
        assert payload["updates"][0]["actorId"] == str(tech_id)
        assert payload["updates"][0]["createdAt"]
        assert payload["attachments"][0]["createdBy"] == str(tech_id)
        assert payload["attachments"][0]["createdAt"]
        assert payload["qcChecks"][0]["results"][-1]["actorId"] == str(tech_id)
        assert payload["qcChecks"][0]["results"][-1]["createdAt"]
        with get_engine().begin() as connection:
            actions = set(connection.execute(text("SELECT action FROM tenant_audit_events")).scalars())
        assert {"WORK_UPDATE_RECORDED", "EVIDENCE_ATTACHED", "QC_CHECK_CREATED", "QC_RESULT_RECORDED"} <= actions
        assert client.get(f"/api/v1/jobs/{job_id}/execution", headers={"x-workshopos-identity": "south-tech"}).status_code == 404
