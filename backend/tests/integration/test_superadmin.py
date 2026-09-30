"""PostgreSQL acceptance tests for the Superadmin control plane.

They intentionally use the local auth header only in the Compose test
environment. Production resolves exactly the same scopes from Cognito subjects.
"""

from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


SUPERADMIN_ID = UUID("00000000-0000-4000-8000-000000000101")
TENANT_USER_ID = UUID("00000000-0000-4000-8000-000000000102")


def _reset_database() -> None:
    from app.database import get_engine

    with get_engine().begin() as connection:
        for table in (
            "tenant_audit_events", "support_emulations", "tenant_admin_invitations", "platform_billing",
            "branch_settings", "tenant_settings", "membership_roles", "role_permissions", "tenant_roles",
            "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(
            text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, 'platform-superadmin', 'Platform Admin', 'platform@example.test')"),
            {"id": str(SUPERADMIN_ID)},
        )
        connection.execute(text("INSERT INTO superadmins (user_id) VALUES (:id)"), {"id": str(SUPERADMIN_ID)})


@pytest.mark.integration
def test_superadmin_provisions_defaults_and_readonly_emulation_without_demo_data() -> None:
    _reset_database()
    from app.database import get_engine
    from app.main import app

    headers = {"x-workshopos-identity": "platform-superadmin"}
    with TestClient(app) as client:
        denied = client.get("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "not-a-superadmin"})
        assert denied.status_code == 403
        provision = client.post(
            "/api/v1/superadmin/tenants",
            headers=headers,
            json={
                "tenant_name": "North Workshop", "primary_branch_name": "North Main",
                "tenant_admin_name": "Asha Admin", "tenant_admin_email": "asha@example.test",
                "plan": "Growth", "agreed_price": "2500.00", "currency": "INR",
                "billing_cycle": "monthly", "renewal_date": "2026-10-01", "due_date": "2026-10-05",
                "payment_status": "pending", "internal_notes": "Manual onboarding",
            },
        )
        assert provision.status_code == 201, provision.text
        payload = provision.json()
        tenant_id = payload["id"]
        assert payload["primaryBranch"]["name"] == "North Main"
        assert payload["tenantAdminInvitation"]["status"] == "PENDING"
        assert payload["platformBilling"]["plan"] == "Growth"

        emulation = client.post(f"/api/v1/superadmin/tenants/{tenant_id}/emulations", headers=headers, json={"reason": "Onboarding check"})
        assert emulation.status_code == 201, emulation.text
        emulation_headers = {**headers, "x-workshopos-emulation-id": emulation.json()["id"]}
        session = client.get("/api/v1/session", headers=emulation_headers)
        assert session.status_code == 200
        assert session.json()["actorType"] == "support_emulation"
        assert session.json()["emulation"]["readOnly"] is True
        assert client.put("/api/v1/tenant/settings", headers=emulation_headers, json={"settings": {"attack": True}}).status_code == 403

        suspended = client.post(f"/api/v1/superadmin/tenants/{tenant_id}/lifecycle", headers=headers, json={"lifecycle_state": "suspended", "reason": "Manual hold"})
        assert suspended.status_code == 200
        assert suspended.json()["lifecycleState"] == "suspended"
        ended = client.post(f"/api/v1/superadmin/emulations/{emulation.json()['id']}/end", headers=headers, json={"reason": "Check complete"})
        assert ended.status_code == 200

    with get_engine().connect() as connection:
        assert connection.execute(text("SELECT count(*) FROM branches WHERE tenant_id=:tenant_id AND is_primary"), {"tenant_id": tenant_id}).scalar_one() == 1
        assert connection.execute(text("SELECT count(*) FROM tenant_admin_invitations WHERE tenant_id=:tenant_id AND status='PENDING'"), {"tenant_id": tenant_id}).scalar_one() == 1
        assert connection.execute(text("SELECT settings->>'templateVersion' FROM tenant_settings WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).scalar_one() == "1"
        assert connection.execute(text("SELECT count(*) FROM tenant_audit_events WHERE tenant_id=:tenant_id"), {"tenant_id": tenant_id}).scalar_one() >= 4
