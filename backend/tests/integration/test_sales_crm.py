"""PostgreSQL/RLS acceptance coverage for sales lead contact states."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine

    with get_engine().begin() as connection:
        for table in (
            "quotation_lines", "quotations", "sales_leads", "tenant_audit_events", "support_emulations",
            "tenant_admin_invitations", "platform_billing", "branch_settings", "tenant_settings",
            "membership_roles", "role_permissions", "tenant_roles", "membership_branches",
            "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (gen_random_uuid(), 'platform-superadmin', 'Platform Admin', 'platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject = 'platform-superadmin'"))


def _provision(client: TestClient) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": "Sales CRM", "primary_branch_name": "Main", "tenant_admin_name": "Owner", "tenant_admin_email": "owner@sales.example.test",
        "plan": "Growth", "agreed_price": "1.00", "currency": "INR", "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-01", "payment_status": "pending", "internal_notes": "",
    })
    assert response.status_code == 201, response.text
    return response.json()


def _activate(tenant_id: str, subject: str) -> None:
    from app.database import get_engine

    with get_engine().begin() as connection:
        membership = connection.execute(text("SELECT id, user_id FROM tenant_memberships WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status='ACTIVE' WHERE id=:id"), {"id": membership["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject=:subject, active_membership_id=:membership_id WHERE id=:user_id"), {"subject": subject, "membership_id": membership["id"], "user_id": membership["user_id"]})


@pytest.mark.integration
def test_lead_not_entered_flags_round_trip_and_are_audited() -> None:
    _reset_database()
    from app.main import app

    with TestClient(app) as client:
        tenant = _provision(client)
        _activate(str(tenant["id"]), "sales-owner")
        headers = {"x-workshopos-identity": "sales-owner"}
        payload = {"displayName": "Asha", "phone": "9000000000", "company": "", "companyNotEntered": True, "email": "", "emailNotEntered": True}
        created = client.post("/api/v1/sales/leads", headers=headers, json=payload)
        assert created.status_code == 201, created.text
        assert created.json()["companyNotEntered"] is True
        assert created.json()["emailNotEntered"] is True

        updated_payload = {**payload, "company": "Workshop Co", "companyNotEntered": False, "email": "asha@example.test", "emailNotEntered": False}
        updated = client.put(f"/api/v1/sales/leads/{created.json()['id']}", headers=headers, json=updated_payload)
        assert updated.status_code == 200, updated.text
        assert updated.json()["companyNotEntered"] is False
        assert updated.json()["emailNotEntered"] is False

        from app.database import get_engine
        with get_engine().begin() as connection:
            snapshot = connection.execute(text("SELECT after_value FROM tenant_audit_events WHERE action='SALES_LEAD_UPDATED'")) .scalar_one()
        assert snapshot["companyNotEntered"] is False
        assert snapshot["emailNotEntered"] is False


@pytest.mark.integration
def test_quotation_created_date_filters_ignore_valid_until() -> None:
    _reset_database()
    from app.main import app

    with TestClient(app) as client:
        tenant = _provision(client)
        _activate(str(tenant["id"]), "sales-owner")
        headers = {"x-workshopos-identity": "sales-owner"}
        lead = client.post("/api/v1/sales/leads", headers=headers, json={"displayName": "Asha", "phone": "9000000000"})
        assert lead.status_code == 201, lead.text
        quotation_input = {
            "leadId": lead.json()["id"], "customerNotes": "", "discount": 0,
            "templateId": "quotation-default", "templateHtml": "<main>Quotation</main>",
            "lines": [{"kind": "Service", "description": "Wheel alignment", "quantity": 1, "rate": 1000, "gstRate": 18}],
        }
        first = client.post("/api/v1/sales/quotations", headers=headers, json={**quotation_input, "validUntil": "2026-09-01"})
        second = client.post("/api/v1/sales/quotations", headers=headers, json={**quotation_input, "validUntil": "2026-10-01"})
        assert first.status_code == 201, first.text
        assert second.status_code == 201, second.text

        from app.database import get_engine
        with get_engine().begin() as connection:
            connection.execute(text("UPDATE quotations SET created_at='2026-10-15T09:00:00Z' WHERE id=:id"), {"id": first.json()["id"]})
            connection.execute(text("UPDATE quotations SET created_at='2026-09-15T09:00:00Z' WHERE id=:id"), {"id": second.json()["id"]})

        exact = client.get("/api/v1/sales/quotations?exactDate=2026-10-15&month=2026-09", headers=headers)
        assert exact.status_code == 200, exact.text
        assert [item["id"] for item in exact.json()] == [first.json()["id"]]

        monthly = client.get("/api/v1/sales/quotations?month=2026-09", headers=headers)
        assert monthly.status_code == 200, monthly.text
        assert [item["id"] for item in monthly.json()] == [second.json()["id"]]


@pytest.mark.integration
def test_lead_follow_up_and_quotation_terminal_outcomes_follow_the_persisted_pipeline() -> None:
    _reset_database()
    from app.main import app

    with TestClient(app) as client:
        tenant = _provision(client)
        _activate(str(tenant["id"]), "sales-owner")
        headers = {"x-workshopos-identity": "sales-owner"}
        lead = client.post("/api/v1/sales/leads", headers=headers, json={
            "displayName": "Asha", "phone": "9000000000", "followUpDue": "2026-10-20",
        })
        assert lead.status_code == 201, lead.text
        assert [item["id"] for item in client.get("/api/v1/sales/leads?exactDate=2026-10-20", headers=headers).json()] == [lead.json()["id"]]

        quotation = client.post("/api/v1/sales/quotations", headers=headers, json={
            "leadId": lead.json()["id"], "templateId": "quotation-default", "templateHtml": "<main>Quotation</main>",
            "lines": [{"kind": "Service", "description": "Wheel alignment", "quantity": 1, "rate": 1000, "gstRate": 18}],
        })
        assert quotation.status_code == 201, quotation.text
        quotation_id = quotation.json()["id"]
        assert client.post(f"/api/v1/sales/quotations/{quotation_id}/status", headers=headers, json={"status": "ACCEPTED"}).json()["code"] == "QUOTATION_TRANSITION_INVALID"
        sent = client.post(f"/api/v1/sales/quotations/{quotation_id}/status", headers=headers, json={"status": "SENT"})
        assert sent.status_code == 200, sent.text
        rejected = client.post(f"/api/v1/sales/quotations/{quotation_id}/status", headers=headers, json={"status": "REJECTED"})
        assert rejected.status_code == 200, rejected.text
        assert client.get("/api/v1/sales/leads", headers=headers).json()[0]["stage"] == "LOST"
        terminal_edit = client.post(f"/api/v1/sales/quotations/{quotation_id}/status", headers=headers, json={"status": "SENT"})
        assert terminal_edit.status_code == 422
        assert terminal_edit.json()["code"] == "QUOTATION_FINAL"
