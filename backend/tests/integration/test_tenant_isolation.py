"""PostgreSQL acceptance tests for the Tenant/Branch RLS boundary.

Run in the API container after Alembic has applied the tenancy migration.
"""

from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError

from app.tenancy import BranchScope, TenantScope, apply_rls_context


NORTH_TENANT = UUID("00000000-0000-4000-8000-000000000001")
JAIPUR_TENANT = UUID("00000000-0000-4000-8000-000000000002")
NORTH_BRANCH = UUID("00000000-0000-4000-8000-000000000011")
SOUTH_BRANCH = UUID("00000000-0000-4000-8000-000000000012")
JAIPUR_BRANCH = UUID("00000000-0000-4000-8000-000000000013")
NORTH_USER = UUID("00000000-0000-4000-8000-000000000021")
JAIPUR_USER = UUID("00000000-0000-4000-8000-000000000022")


def tenant_scope(actor_id: UUID, tenant_id: UUID, branches: tuple[UUID, ...]) -> TenantScope:
    return TenantScope(
        actor_id=actor_id,
        membership_id=UUID("00000000-0000-4000-8000-000000000041") if actor_id == NORTH_USER else UUID("00000000-0000-4000-8000-000000000042"),
        tenant_id=tenant_id,
        tenant_name="North" if tenant_id == NORTH_TENANT else "Jaipur",
        display_name="Test User",
        email="test@example.test",
        branch_ids=branches,
        branches=tuple(BranchScope(id=branch, name=str(branch)) for branch in branches),
        role_ids=(),
        roles=(),
        permissions=(),
        version=1,
    )


@pytest.mark.integration
def test_rls_fails_closed_and_blocks_cross_tenant_and_cross_branch_rows() -> None:
    from app.database import get_engine

    engine = get_engine()
    with engine.begin() as connection:
        # Integration scenarios add tenant-owned dependants over time. Reset
        # from the two roots so this RLS fixture remains order-independent.
        connection.execute(text("TRUNCATE TABLE tenants, platform_users RESTART IDENTITY CASCADE"))
        connection.execute(text("INSERT INTO tenants (id, name, lifecycle_state) VALUES (:id, :name, 'active'), (:jaipur, 'Jaipur', 'active')"), {"id": str(NORTH_TENANT), "name": "North", "jaipur": str(JAIPUR_TENANT)})
        connection.execute(text("INSERT INTO branches (id, tenant_id, name, is_primary) VALUES (:id, :tenant, 'North Main', true), (:south, :tenant, 'North South', false), (:jaipur_branch, :jaipur, 'Jaipur Main', true)"), {"id": str(NORTH_BRANCH), "south": str(SOUTH_BRANCH), "tenant": str(NORTH_TENANT), "jaipur_branch": str(JAIPUR_BRANCH), "jaipur": str(JAIPUR_TENANT)})
        connection.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, 'north-user', 'North', 'north@example.test'), (:jaipur, 'jaipur-user', 'Jaipur', 'jaipur@example.test')"), {"id": str(NORTH_USER), "jaipur": str(JAIPUR_USER)})
        connection.execute(text("INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant, :user, 'ACTIVE'), (:jaipur, :jaipur_tenant, :jaipur_user, 'ACTIVE')"), {"id": "00000000-0000-4000-8000-000000000041", "tenant": str(NORTH_TENANT), "user": str(NORTH_USER), "jaipur": "00000000-0000-4000-8000-000000000042", "jaipur_tenant": str(JAIPUR_TENANT), "jaipur_user": str(JAIPUR_USER)})
        connection.execute(text("UPDATE platform_users SET active_membership_id = CASE id WHEN :north_user THEN CAST(:north_membership AS uuid) WHEN :jaipur_user THEN CAST(:jaipur_membership AS uuid) END"), {"north_user": str(NORTH_USER), "north_membership": "00000000-0000-4000-8000-000000000041", "jaipur_user": str(JAIPUR_USER), "jaipur_membership": "00000000-0000-4000-8000-000000000042"})
        connection.execute(text("INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership, :branch, :tenant), (:jaipur_membership, :jaipur_branch, :jaipur_tenant)"), {"membership": "00000000-0000-4000-8000-000000000041", "branch": str(NORTH_BRANCH), "tenant": str(NORTH_TENANT), "jaipur_membership": "00000000-0000-4000-8000-000000000042", "jaipur_branch": str(JAIPUR_BRANCH), "jaipur_tenant": str(JAIPUR_TENANT)})
        connection.execute(text("INSERT INTO tenant_roles (id, tenant_id, name) VALUES (:north_role, :tenant, 'Owner'), (:jaipur_role, :jaipur, 'Owner')"), {"north_role": "00000000-0000-4000-8000-000000000031", "tenant": str(NORTH_TENANT), "jaipur_role": "00000000-0000-4000-8000-000000000032", "jaipur": str(JAIPUR_TENANT)})
        connection.execute(text("INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership, :north_role, :tenant), (:jaipur_membership, :jaipur_role, :jaipur_tenant)"), {"membership": "00000000-0000-4000-8000-000000000041", "north_role": "00000000-0000-4000-8000-000000000031", "tenant": str(NORTH_TENANT), "jaipur_membership": "00000000-0000-4000-8000-000000000042", "jaipur_role": "00000000-0000-4000-8000-000000000032", "jaipur_tenant": str(JAIPUR_TENANT)})
        connection.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:north_role, 'tenant.settings.read'), (:north_role, 'tenant.settings.write'), (:north_role, 'branch.settings.read'), (:jaipur_role, 'tenant.settings.read'), (:jaipur_role, 'tenant.settings.write')"), {"north_role": "00000000-0000-4000-8000-000000000031", "jaipur_role": "00000000-0000-4000-8000-000000000032"})
        connection.execute(text("INSERT INTO tenant_settings (tenant_id, settings, updated_by) VALUES (:tenant, '{\"name\": \"north\"}', :actor), (:jaipur, '{\"name\": \"jaipur\"}', :jaipur_actor)"), {"tenant": str(NORTH_TENANT), "jaipur": str(JAIPUR_TENANT), "actor": str(NORTH_USER), "jaipur_actor": str(JAIPUR_USER)})
        connection.execute(text("INSERT INTO branch_settings (tenant_id, branch_id, settings, updated_by) VALUES (:tenant, :branch, '{}', :actor), (:tenant, :south, '{}', :actor)"), {"tenant": str(NORTH_TENANT), "branch": str(NORTH_BRANCH), "south": str(SOUTH_BRANCH), "actor": str(NORTH_USER)})

    with engine.connect() as connection:
        transaction = connection.begin()
        apply_rls_context(connection, tenant_scope(NORTH_USER, NORTH_TENANT, (NORTH_BRANCH,)))
        assert connection.execute(text("SELECT tenant_id FROM tenant_settings ORDER BY tenant_id")).scalars().all() == [NORTH_TENANT]
        assert connection.execute(text("SELECT branch_id FROM branch_settings ORDER BY branch_id")).scalars().all() == [NORTH_BRANCH]
        hidden_write = connection.execute(text("UPDATE tenant_settings SET settings = '{\"name\": \"attack\"}' WHERE tenant_id = :tenant"), {"tenant": str(JAIPUR_TENANT)})
        assert hidden_write.rowcount == 0
        with pytest.raises(ProgrammingError, match="row-level security"):
            connection.execute(text("INSERT INTO branch_settings (tenant_id, branch_id, settings, updated_by) VALUES (:tenant, :branch, '{}', :actor)"), {"tenant": str(JAIPUR_TENANT), "branch": str(JAIPUR_BRANCH), "actor": str(NORTH_USER)})
        transaction.rollback()

    with engine.connect() as connection:
        transaction = connection.begin()
        connection.execute(text("SET LOCAL ROLE workshopos_runtime"))
        assert connection.execute(text("SELECT count(*) FROM tenant_settings")).scalar_one() == 0
        transaction.rollback()

    from app.main import app

    with TestClient(app) as client:
        north = {"x-workshopos-identity": "north-user"}
        session = client.get("/api/v1/session", headers=north)
        assert session.status_code == 200
        assert session.json()["tenant"]["id"] == str(NORTH_TENANT)
        # The tenant id is not part of the write contract; an attempted spoof
        # is ignored and the server context still updates only North.
        write = client.put("/api/v1/tenant/settings", headers=north, json={"tenantId": str(JAIPUR_TENANT), "settings": {"theme": "north"}})
        assert write.status_code == 200
        assert write.json()["settings"] == {"theme": "north"}
        assert client.get(f"/api/v1/branches/{SOUTH_BRANCH}/settings", headers=north).status_code == 403
        jaipur = client.get("/api/v1/tenant/settings", headers={"x-workshopos-identity": "jaipur-user"})
        assert jaipur.status_code == 200
        assert jaipur.json()["settings"] == {"name": "jaipur"}
        assert client.get("/api/v1/session", headers={"x-workshopos-identity": "unknown-user"}).status_code == 403
