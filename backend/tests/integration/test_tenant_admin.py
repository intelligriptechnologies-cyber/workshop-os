"""PostgreSQL acceptance coverage for the tenant user-administration HTTP seam."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text


def _reset_database() -> None:
    from app.database import get_engine

    with get_engine().begin() as connection:
        for table in (
            "tenant_audit_events", "support_emulations", "tenant_admin_invitations", "platform_billing",
            "branch_settings", "tenant_settings", "membership_roles", "role_permissions", "tenant_roles",
            "membership_branches", "tenant_memberships", "superadmins", "branches", "platform_users", "tenants",
        ):
            connection.execute(text(f"DELETE FROM {table}"))
        connection.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (gen_random_uuid(), 'platform-superadmin', 'Platform Admin', 'platform@example.test')"))
        connection.execute(text("INSERT INTO superadmins (user_id) SELECT id FROM platform_users WHERE cognito_subject = 'platform-superadmin'"))


def _activate_invited_membership(tenant_id: str, subject: str) -> None:
    from app.database import get_engine

    with get_engine().begin() as connection:
        row = connection.execute(text("SELECT id, user_id FROM tenant_memberships WHERE tenant_id = :tenant_id"), {"tenant_id": tenant_id}).mappings().one()
        connection.execute(text("UPDATE tenant_memberships SET status = 'ACTIVE' WHERE id = :id"), {"id": row["id"]})
        connection.execute(text("UPDATE platform_users SET cognito_subject = :subject, active_membership_id = :membership_id WHERE id = :user_id"), {"subject": subject, "membership_id": row["id"], "user_id": row["user_id"]})


def _provision(client: TestClient, name: str, email: str) -> dict[str, object]:
    response = client.post("/api/v1/superadmin/tenants", headers={"x-workshopos-identity": "platform-superadmin"}, json={
        "tenant_name": name, "primary_branch_name": f"{name} Main", "tenant_admin_name": "Tenant Admin", "tenant_admin_email": email,
        "plan": "Growth", "agreed_price": "2500.00", "currency": "INR", "billing_cycle": "monthly",
        "renewal_date": "2026-10-01", "due_date": "2026-10-05", "payment_status": "pending", "internal_notes": "Integration test",
    })
    assert response.status_code == 201, response.text
    return response.json()


@pytest.mark.integration
def test_tenant_admin_manages_only_own_directory_and_browser_bypass_is_rejected() -> None:
    _reset_database()
    from app.main import app

    with TestClient(app) as client:
        north = _provision(client, "North Workshop", "north-admin@example.test")
        other = _provision(client, "Other Workshop", "other-admin@example.test")
        _activate_invited_membership(str(north["id"]), "tenant-admin")

        admin_headers = {"x-workshopos-identity": "tenant-admin"}
        directory = client.get("/api/v1/admin/users", headers=admin_headers)
        assert directory.status_code == 200, directory.text
        owner = next(role for role in directory.json()["roles"] if role["name"] == "Owner/Admin")
        service = next(role for role in directory.json()["roles"] if role["name"] == "Service Advisor")
        branch_id = directory.json()["branches"][0]["id"]
        tenant_admin = directory.json()["users"][0]
        assert "tenant.users.manage" in owner["permissions"]

        owner_guard = client.patch(f"/api/v1/admin/roles/{owner['id']}", headers=admin_headers, json={
            "name": owner["name"], "description": owner.get("description", ""), "permissions": [], "version": owner["version"],
        })
        assert owner_guard.status_code == 422
        assert owner_guard.json()["code"] == "SYSTEM_ROLE_PERMISSION_REQUIRED"
        self_archive = client.post(f"/api/v1/admin/users/{tenant_admin['id']}/archive", headers=admin_headers, json={"reason": "must fail"})
        assert self_archive.status_code == 422
        assert self_archive.json()["code"] == "CANNOT_ARCHIVE_SELF"
        last_manager = client.patch(f"/api/v1/admin/users/{tenant_admin['id']}", headers=admin_headers, json={
            "name": tenant_admin["name"], "roleIds": [service["id"]], "branchIds": [branch_id], "version": tenant_admin["version"],
        })
        assert last_manager.status_code == 409
        assert last_manager.json()["code"] == "LAST_TENANT_ADMIN"

        forbidden_assignment = client.post("/api/v1/admin/users", headers=admin_headers, json={
            "name": "Cross Tenant", "email": "cross@example.test", "roleIds": [service["id"]],
            "branchIds": [other["primaryBranch"]["id"]],
        })
        assert forbidden_assignment.status_code == 422
        assert forbidden_assignment.json()["code"] == "BRANCH_NOT_IN_TENANT"

        created = client.post("/api/v1/admin/users", headers=admin_headers, json={
            "name": "Service User", "email": "service@example.test", "roleIds": [service["id"]], "branchIds": [branch_id],
        })
        assert created.status_code == 201, created.text
        invited = created.json()["user"]
        assert invited["status"] == "INVITED"
        assert client.post(f"/api/v1/admin/users/{invited['id']}/resend-invite", headers=admin_headers).status_code == 200

        # This local activation exists only to exercise the HTTP authorization
        # seam. Cognito invitation delivery is deliberately an integration task.
        from app.database import get_engine
        with get_engine().begin() as connection:
            user_id = connection.execute(text("SELECT user_id FROM tenant_memberships WHERE id = :id"), {"id": invited["id"]}).scalar_one()
            connection.execute(text("UPDATE tenant_memberships SET status = 'ACTIVE' WHERE id = :id"), {"id": invited["id"]})
            connection.execute(text("UPDATE platform_users SET cognito_subject = 'service-user', active_membership_id = :id WHERE id = :user_id"), {"id": invited["id"], "user_id": user_id})

        bypass = client.get("/api/v1/admin/users", headers={"x-workshopos-identity": "service-user"})
        assert bypass.status_code == 403
        assert bypass.json()["code"] == "PERMISSION_DENIED"
