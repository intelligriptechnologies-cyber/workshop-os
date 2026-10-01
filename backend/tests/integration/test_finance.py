"""PostgreSQL/RLS acceptance coverage for issued financial records and delivery."""

from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        for table in (
            "financial_document_events", "delivery_acknowledgements", "payments", "invoice_lines", "invoices", "financial_documents", "document_sequences",
            "qc_results", "evidence_attachments", "work_updates", "technician_tasks", "qc_checks", "stock_ledger", "material_ledger", "material_reservations",
            "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items", "job_events", "estimate_decisions", "estimate_lines", "estimates", "job_cards",
            "tenant_audit_events", "visits", "vehicles", "customers", "support_emulations", "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings",
            "membership_roles", "role_permissions", "tenant_roles", "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (gen_random_uuid(),'platform-superadmin','Platform','platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject='platform-superadmin'"))


def _provision(client: TestClient, name: str) -> dict[str, object]:
    result = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": "Main", "tenant_admin_name": "Owner", "tenant_admin_email": f"{name}@example.test",
        "plan": "Growth", "agreed_price": "1.00", "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-01", "payment_status": "pending", "internal_notes": "",
    })
    assert result.status_code == 201, result.text
    return result.json()


def _activate_owner(tenant_id: str, subject: str) -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        member = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": member["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": member["id"], "user_id": member["user_id"]})


def _approved_job(client: TestClient, headers: dict[str, str]) -> int:
    customer = client.post("/api/v1/customers", headers=headers, json={"name": "Asha", "mobile": "9000000000", "type": "Individual"}).json()
    vehicle = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 100}).json()
    visit = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Service"}).json()
    job = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit["id"]}).json()
    estimate = client.post(f"/api/v1/jobs/{job['id']}/estimates", headers=headers, json={"lines": [{"kind": "labour", "description": "Service", "quantity": 1, "rate": 1000, "gstRate": 18}]}).json()
    approved = client.post(f"/api/v1/estimates/{estimate['id']}/decision", headers=headers, json={"outcome": "approved", "channel": "in_person", "decidedAt": datetime.now(timezone.utc).isoformat()})
    assert approved.status_code == 200, approved.text
    return job["id"]


@pytest.mark.integration
def test_issued_invoice_payment_receipt_void_and_handover_are_scoped_and_immutable() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-finance"), _provision(client, "south-finance")
        _activate_owner(str(north["id"]), "north-finance-user")
        _activate_owner(str(south["id"]), "south-finance-user")
        headers = {"x-workshopos-identity": "north-finance-user"}
        job_id = _approved_job(client, headers)
        invoice = client.post(f"/api/v1/jobs/{job_id}/invoices", headers={**headers, "Idempotency-Key": "issue-1"}, json={"lines": [{"description": "Annual service", "quantity": 1, "unitAmountPaise": 100000, "gstRateBps": 1800}], "customerState": "Karnataka"})
        assert invoice.status_code == 201, invoice.text
        invoice = invoice.json()
        assert invoice["totalPaise"] == 118000 and invoice["status"] == "UNPAID"
        assert client.post(f"/api/v1/jobs/{job_id}/invoices", headers={**headers, "Idempotency-Key": "issue-1"}, json={"lines": [{"description": "ignored", "quantity": 1, "unitAmountPaise": 1}]}).json()["id"] == invoice["id"]
        assert client.get(f"/api/v1/jobs/{job_id}/invoices", headers={"x-workshopos-identity": "south-finance-user"}).json() == []
        partial = client.post(f"/api/v1/invoices/{invoice['id']}/payments", headers={**headers, "Idempotency-Key": "pay-1"}, json={"amountPaise": 18000, "method": "upi", "reference": "UPI-1"})
        assert partial.status_code == 201, partial.text
        assert client.post(f"/api/v1/invoices/{invoice['id']}/payments", headers=headers, json={"amountPaise": 100001, "method": "cash"}).status_code == 409
        assert client.post(f"/api/v1/invoices/{invoice['id']}/void", headers=headers, json={"reason": "wrong rate"}).status_code == 422
        settled = client.post(f"/api/v1/invoices/{invoice['id']}/payments", headers=headers, json={"amountPaise": 100000, "method": "cash"})
        assert settled.status_code == 201, settled.text
        # The lifecycle tests exercise prerequisites. Finance owns the final
        # atomic release path once the work lifecycle has reached COMPLETED.
        from app.database import get_engine
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE job_cards SET status='COMPLETED' WHERE id=:job_id"), {"job_id": job_id})
        handover = client.post(f"/api/v1/jobs/{job_id}/complete-handover", headers={**headers, "Idempotency-Key": "handover-1"}, json={"deliveredBy": "Asha", "finalOdometer": 120, "acknowledgement": "Customer accepted"})
        assert handover.status_code == 200, handover.text
        content = client.get(handover.json()["contentPath"], headers=headers)
        assert content.status_code == 200 and b"GATE_PASS" in content.content
        with get_engine().begin() as connection:
            with pytest.raises(Exception):
                connection.execute(text("UPDATE financial_documents SET document_no='forged' WHERE id=:id"), {"id": invoice["documentId"]})


@pytest.mark.integration
def test_pre_payment_void_keeps_number_and_allows_numbered_replacement() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north = _provision(client, "void-finance")
        _activate_owner(str(north["id"]), "void-finance-user")
        headers = {"x-workshopos-identity": "void-finance-user"}
        job_id = _approved_job(client, headers)
        first = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={"lines": [{"description": "Old", "quantity": 1, "unitAmountPaise": 10000}]}).json()
        assert client.post(f"/api/v1/invoices/{first['id']}/void", headers=headers, json={"reason": "typo"}).json()["status"] == "VOID"
        replacement = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={"replacesInvoiceId": first["id"], "lines": [{"description": "Correct", "quantity": 1, "unitAmountPaise": 20000}]}).json()
        assert replacement["number"] != first["number"]
