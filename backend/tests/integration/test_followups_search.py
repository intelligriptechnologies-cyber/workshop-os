"""PostgreSQL/RLS coverage for Follow-ups and cross-entity Search."""

from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "followups", "financial_document_events", "delivery_acknowledgements", "payments", "invoice_lines", "invoices", "financial_documents", "document_sequences",
            "qc_results", "job_attachments", "work_updates", "technician_tasks", "qc_checks", "stock_ledger", "material_ledger", "material_reservations",
            "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items", "job_events", "estimate_decisions", "estimate_lines", "estimates", "job_cards",
            "tenant_audit_events", "visits", "vehicles", "customers", "support_emulations", "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings",
            "membership_roles", "role_permissions", "tenant_roles", "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
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


def _activate_owner(tenant_id: str, subject: str) -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        member = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": member["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": member["id"], "user_id": member["user_id"]})


def _job_and_invoice(client: TestClient, headers: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha Search", "mobile": "9000000000", "type": "Individual"}).json()
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01SEARCH", "make": "Honda", "model": "City", "km": 100}).json()
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Search service"}).json()
    job = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit["id"], "workList": "Annual service"}).json()
    estimate = client.post(f"/api/v1/jobs/{job['id']}/estimates", headers=headers, json={"lines": [{"kind": "labour", "description": "Service", "quantity": 1, "rate": 1000, "gstRate": 18}]}).json()
    approved = client.post(f"/api/v1/estimates/{estimate['id']}/decision", headers=headers, json={"outcome": "approved", "channel": "in_person", "decidedAt": datetime.now(timezone.utc).isoformat()})
    assert approved.status_code == 200, approved.text
    invoice = client.post(f"/api/v1/jobs/{job['id']}/invoices", headers=headers, json={"lines": [{"description": "Annual service", "quantity": 1, "unitAmountPaise": 100000}]})
    assert invoice.status_code == 201, invoice.text
    return int(job["id"])


@pytest.mark.integration
def test_followups_and_search_are_routed_by_permissions_tenant_and_branch() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-search"), _provision(client, "south-search")
        _activate_owner(str(north["id"]), "north-user")
        _activate_owner(str(south["id"]), "south-user")
        headers = {"x-workshopos-identity": "north-user"}
        job_id = _job_and_invoice(client, headers)

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
