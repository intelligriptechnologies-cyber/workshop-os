"""PostgreSQL/RLS acceptance coverage for issued financial records and delivery."""

from datetime import datetime, timezone
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine
    with get_engine().begin() as connection:
        # Finance shares the tenant-scoped operational graph with CRM and
        # procurement. Reset from its roots so later dependants cannot make a
        # finance fixture order-dependent.
        connection.execute(text("TRUNCATE TABLE tenants, platform_users RESTART IDENTITY CASCADE"))
        for table in (
            "refunds", "credit_notes", "financial_document_events", "delivery_acknowledgements", "payments", "invoice_lines", "active_invoice_claims", "invoices", "financial_documents", "document_sequences",
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


def _activate_owner(tenant_id: str, subject: str) -> dict[str, str]:
    from app.database import get_engine
    permissions = (
        "page.customers.read", "page.customers.write", "page.vehicles.read", "page.vehicles.write",
        "page.receive-vehicle.read", "page.receive-vehicle.write", "page.job-card.read", "page.job-card.write",
        "page.estimate.read", "page.estimate.write", "page.my-queue.read", "page.my-queue.write",
    )
    with get_engine().begin() as connection:
        member = connection.execute(text("SELECT id,user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": member["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject,active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": member["id"], "user_id": member["user_id"]})
        for permission in permissions:
            connection.execute(text("""INSERT INTO role_permissions (role_id,permission)
                SELECT id,:permission FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Owner/Admin'
                ON CONFLICT DO NOTHING"""), {"tenant_id": tenant_id, "permission": permission})
        branch_id = connection.execute(text("SELECT id FROM branches WHERE tenant_id=:tenant_id AND is_primary"), {"tenant_id": tenant_id}).scalar_one()
        connection.execute(text("INSERT INTO membership_branches (membership_id,tenant_id,branch_id) VALUES (:membership_id,:tenant_id,:branch_id) ON CONFLICT DO NOTHING"), {"membership_id": str(member["id"]), "tenant_id": tenant_id, "branch_id": str(branch_id)})
        connection.execute(text("UPDATE tenant_roles SET status='ACTIVE' WHERE tenant_id=:tenant_id AND system_key='service_manager'"), {"tenant_id": tenant_id})
        connection.execute(text("INSERT INTO membership_roles (membership_id,tenant_id,role_id) SELECT :membership_id,:tenant_id,id FROM tenant_roles WHERE tenant_id=:tenant_id AND system_key='service_manager' ON CONFLICT DO NOTHING"), {"membership_id": str(member["id"]), "tenant_id": tenant_id})
        department_id = uuid4()
        connection.execute(text("INSERT INTO service_departments (id,tenant_id,branch_id,name,created_by,updated_by) VALUES (:id,:tenant_id,:branch_id,'Mechanical',:user_id,:user_id)"), {"id": str(department_id), "tenant_id": tenant_id, "branch_id": str(branch_id), "user_id": str(member["user_id"])})
        connection.execute(text("INSERT INTO service_department_managers (tenant_id,branch_id,department_id,manager_membership_id,appointed_by) VALUES (:tenant_id,:branch_id,:department_id,:membership_id,:user_id)"), {"tenant_id": tenant_id, "branch_id": str(branch_id), "department_id": str(department_id), "membership_id": str(member["id"]), "user_id": str(member["user_id"])})
        assert connection.execute(text("""SELECT 1 FROM service_departments d JOIN service_department_managers dm ON dm.department_id=d.id
            JOIN tenant_memberships m ON m.id=dm.manager_membership_id AND m.status='ACTIVE'
            JOIN membership_branches mb ON mb.membership_id=m.id AND mb.branch_id=d.branch_id
            JOIN membership_roles mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id
            JOIN tenant_roles r ON r.id=mr.role_id AND r.system_key='service_manager' AND r.status='ACTIVE'
            WHERE d.id=:department_id AND m.user_id=:user_id"""), {"department_id": str(department_id), "user_id": str(member["user_id"])}).scalar()
        return {"department": str(department_id), "manager": str(member["user_id"])}


def _approved_job(client: TestClient, headers: dict[str, str], route: dict[str, str]) -> int:
    customer_response = client.post("/api/v1/customers", headers=headers, json={"name": "Asha", "mobile": "9000000000", "type": "Individual"})
    assert customer_response.status_code == 201, customer_response.text
    customer = customer_response.json()
    vehicle_response = client.post("/api/v1/vehicles", headers=headers, json={"customerId": customer["id"], "number": "KA01AB1234", "make": "Honda", "model": "City", "km": 100})
    assert vehicle_response.status_code == 201, vehicle_response.text
    vehicle = vehicle_response.json()
    visit_response = client.post("/api/v1/visits", headers=headers, json={"customerId": customer["id"], "vehicleId": vehicle["id"], "fuel": "half", "odoReading": 100, "requestedWork": "Service"})
    assert visit_response.status_code == 201, visit_response.text
    visit = visit_response.json()
    job_response = client.post("/api/v1/jobs", headers=headers, json={"visitId": visit["id"], "departmentId": route["department"], "responsibleManagerId": route["manager"]})
    assert job_response.status_code == 201, job_response.text
    job = job_response.json()
    estimate_response = client.post(f"/api/v1/jobs/{job['id']}/estimates", headers=headers, json={"lines": [{"kind": "labour", "description": "Service", "quantity": 1, "rate": 1000, "gstRate": 18}]})
    assert estimate_response.status_code == 201, estimate_response.text
    estimate = estimate_response.json()
    approved = client.post(f"/api/v1/estimates/{estimate['id']}/decision", headers=headers, json={"outcome": "approved", "channel": "in_person", "decidedAt": datetime.now(timezone.utc).isoformat()})
    assert approved.status_code == 200, approved.text
    return job["id"]


@pytest.mark.integration
def test_issued_invoice_payment_receipt_void_and_handover_are_scoped_and_immutable() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "north-finance"), _provision(client, "south-finance")
        north_route = _activate_owner(str(north["id"]), "north-finance-user")
        _activate_owner(str(south["id"]), "south-finance-user")
        headers = {"x-workshopos-identity": "north-finance-user"}
        job_id = _approved_job(client, headers, north_route)
        invoice = client.post(f"/api/v1/jobs/{job_id}/invoices", headers={**headers, "Idempotency-Key": "issue-1"}, json={"customerState": "Karnataka"})
        assert invoice.status_code == 201, invoice.text
        invoice = invoice.json()
        assert invoice["totalPaise"] == 118000 and invoice["status"] == "UNPAID"
        assert client.post(f"/api/v1/jobs/{job_id}/invoices", headers={**headers, "Idempotency-Key": "issue-1"}, json={}).json()["id"] == invoice["id"]
        hidden_invoices = client.get(f"/api/v1/jobs/{job_id}/invoices", headers={"x-workshopos-identity": "south-finance-user"})
        assert hidden_invoices.status_code == 404 and hidden_invoices.json()["code"] == "JOB_NOT_FOUND"
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
        assert content.headers["content-disposition"].startswith("attachment;")
        assert content.headers["x-content-type-options"] == "nosniff"
        assert "sandbox" in content.headers["content-security-policy"]
        with get_engine().begin() as connection:
            with pytest.raises(Exception):
                connection.execute(text("UPDATE financial_documents SET document_no='forged' WHERE id=:id"), {"id": invoice["documentId"]})


@pytest.mark.integration
def test_pre_payment_void_keeps_number_and_allows_numbered_replacement() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north = _provision(client, "void-finance")
        north_route = _activate_owner(str(north["id"]), "void-finance-user")
        headers = {"x-workshopos-identity": "void-finance-user"}
        job_id = _approved_job(client, headers, north_route)
        first = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={}).json()
        assert client.post(f"/api/v1/invoices/{first['id']}/void", headers=headers, json={"reason": "typo"}).json()["status"] == "VOID"
        assert client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={}).status_code == 422
        replacement = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={"replacesInvoiceId": first["id"]}).json()
        assert replacement["number"] != first["number"]


@pytest.mark.integration
def test_invoice_uses_approved_snapshot_and_paid_correction_is_credit_note_then_refund() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north = _provision(client, "credited-finance")
        north_route = _activate_owner(str(north["id"]), "credited-finance-user")
        headers = {"x-workshopos-identity": "credited-finance-user"}
        job_id = _approved_job(client, headers, north_route)
        issued = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={
            "lines": [{"description": "caller cannot bill this", "quantity": 1, "unitAmountPaise": 1}],
        })
        assert issued.status_code == 201, issued.text
        invoice = issued.json()
        assert invoice["lines"][0]["description"] == "Service"
        assert invoice["totalPaise"] == 118000
        assert client.post(f"/api/v1/invoices/{invoice['id']}/payments", headers=headers, json={"amountPaise": invoice["totalPaise"], "method": "upi"}).status_code == 201
        credit = client.post(f"/api/v1/invoices/{invoice['id']}/credit-notes", headers=headers, json={"amountPaise": invoice["totalPaise"], "reason": "Customer correction"})
        assert credit.status_code == 201, credit.text
        refund = client.post(f"/api/v1/credit-notes/{credit.json()['id']}/refunds", headers=headers, json={"amountPaise": invoice["totalPaise"], "method": "upi", "reference": "REV-1"})
        assert refund.status_code == 201, refund.text
        from app.database import get_engine
        with get_engine().begin() as connection:
            event = connection.execute(text("SELECT related_document_id FROM financial_document_events WHERE document_id=:document_id AND event_type='CREDITED'"), {"document_id": invoice["documentId"]}).scalar_one()
        assert event == credit.json()["documentId"]
        assert client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={}).status_code == 422
        replacement = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=headers, json={"replacesInvoiceId": invoice["id"]})
        assert replacement.status_code == 201, replacement.text
        assert replacement.json()["number"] != invoice["number"]


@pytest.mark.integration
def test_finance_commands_deny_unauthorised_users_and_cross_tenant_documents() -> None:
    _reset_database()
    from app.main import app
    with TestClient(app) as client:
        north, south = _provision(client, "finance-access-north"), _provision(client, "finance-access-south")
        north_route = _activate_owner(str(north["id"]), "finance-owner")
        _activate_owner(str(south["id"]), "finance-other-tenant")
        owner_headers = {"x-workshopos-identity": "finance-owner"}
        job_id = _approved_job(client, owner_headers, north_route)
        invoice = client.post(f"/api/v1/jobs/{job_id}/invoices", headers=owner_headers, json={}).json()

        from app.database import get_engine
        user_id, membership_id = uuid4(), uuid4()
        with get_engine().begin() as connection:
            connection.execute(text("INSERT INTO platform_users (id,cognito_subject,display_name,email) VALUES (:id,'finance-viewer','Finance Viewer','viewer@example.test')"), {"id": str(user_id)})
            connection.execute(text("INSERT INTO tenant_memberships (id,tenant_id,user_id,status) VALUES (:id,:tenant_id,:user_id,'ACTIVE')"), {"id": str(membership_id), "tenant_id": str(north["id"]), "user_id": str(user_id)})
            connection.execute(text("UPDATE platform_users SET active_membership_id=:membership_id WHERE id=:id"), {"membership_id": str(membership_id), "id": str(user_id)})
            connection.execute(text("INSERT INTO membership_roles (membership_id,role_id,tenant_id) SELECT :membership_id,id,:tenant_id FROM tenant_roles WHERE tenant_id=:tenant_id AND name='Service Advisor'"), {"membership_id": str(membership_id), "tenant_id": str(north["id"])})
            connection.execute(text("INSERT INTO membership_branches (membership_id,branch_id,tenant_id) VALUES (:membership_id,:branch_id,:tenant_id)"), {"membership_id": str(membership_id), "branch_id": str(north["primaryBranch"]["id"]), "tenant_id": str(north["id"])})

        denied = client.post(f"/api/v1/invoices/{invoice['id']}/payments", headers={"x-workshopos-identity": "finance-viewer"}, json={"amountPaise": 100, "method": "cash"})
        assert denied.status_code == 403 and denied.json()["code"] == "PERMISSION_DENIED"
        hidden = client.get(invoice["contentPath"], headers={"x-workshopos-identity": "finance-other-tenant"})
        assert hidden.status_code == 404 and hidden.json()["code"] == "FINANCIAL_DOCUMENT_NOT_FOUND"
