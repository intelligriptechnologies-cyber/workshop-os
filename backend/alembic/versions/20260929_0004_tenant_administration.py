"""Add tenant-admin directory metadata and RLS policies.

Revision ID: 20260929_0004
Revises: 20260929_0003
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0004"
down_revision = "20260929_0003"
branch_labels = None
depends_on = None


TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
ROLE_RLS = "EXISTS (SELECT 1 FROM tenant_roles AS r WHERE r.id = role_id AND r.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid)"


def _rls(table: str, predicate: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({predicate}) WITH CHECK ({predicate})")


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE platform_users ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        ALTER TABLE tenant_memberships ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        ALTER TABLE tenant_roles ADD COLUMN description text NOT NULL DEFAULT '';
        ALTER TABLE tenant_roles ADD COLUMN system_key text;
        ALTER TABLE tenant_roles ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
        ALTER TABLE tenant_roles ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        CREATE UNIQUE INDEX tenant_roles_system_key_unique ON tenant_roles (tenant_id, system_key) WHERE system_key IS NOT NULL;
        ALTER TABLE tenant_admin_invitations ADD COLUMN last_sent_at timestamptz;
        """
    )
    for table, predicate in (
        ("tenant_memberships", TENANT_RLS),
        ("membership_branches", TENANT_RLS),
        ("branches", TENANT_RLS),
        ("tenant_roles", TENANT_RLS),
        ("membership_roles", TENANT_RLS),
        ("role_permissions", ROLE_RLS),
        ("tenant_audit_events", TENANT_RLS),
    ):
        _rls(table, predicate)
    op.execute(
        """
        ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
        CREATE POLICY platform_users_tenant_read ON platform_users FOR SELECT
            USING (EXISTS (SELECT 1 FROM tenant_memberships AS m WHERE m.user_id = id AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid));
        CREATE POLICY platform_users_tenant_insert ON platform_users FOR INSERT WITH CHECK (true);
        CREATE POLICY platform_users_tenant_update ON platform_users FOR UPDATE
            USING (EXISTS (SELECT 1 FROM tenant_memberships AS m WHERE m.user_id = id AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid)) WITH CHECK (true);
        """
    )
    op.execute(
        """
        GRANT SELECT ON branches TO workshopos_runtime;
        GRANT SELECT, INSERT, UPDATE ON platform_users TO workshopos_runtime;
        GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_memberships, membership_branches,
            tenant_roles, membership_roles, role_permissions, tenant_audit_events TO workshopos_runtime;
        """
    )


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS platform_users_tenant_update ON platform_users")
    op.execute("DROP POLICY IF EXISTS platform_users_tenant_insert ON platform_users")
    op.execute("DROP POLICY IF EXISTS platform_users_tenant_read ON platform_users")
    op.execute("ALTER TABLE platform_users DISABLE ROW LEVEL SECURITY")
    for table in ("tenant_audit_events", "role_permissions", "membership_roles", "tenant_roles", "branches", "membership_branches", "tenant_memberships"):
        op.execute(f"DROP POLICY IF EXISTS {table}_tenant_scope ON {table}")
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")
    op.execute(
        """
        REVOKE SELECT ON branches FROM workshopos_runtime;
        REVOKE SELECT, INSERT, UPDATE ON platform_users FROM workshopos_runtime;
        REVOKE SELECT, INSERT, UPDATE, DELETE ON tenant_memberships, membership_branches,
            tenant_roles, membership_roles, role_permissions, tenant_audit_events FROM workshopos_runtime;
        ALTER TABLE tenant_admin_invitations DROP COLUMN last_sent_at;
        DROP INDEX tenant_roles_system_key_unique;
        ALTER TABLE tenant_roles DROP COLUMN updated_at;
        ALTER TABLE tenant_roles DROP COLUMN created_at;
        ALTER TABLE tenant_roles DROP COLUMN system_key;
        ALTER TABLE tenant_roles DROP COLUMN description;
        ALTER TABLE tenant_memberships DROP COLUMN updated_at;
        ALTER TABLE platform_users DROP COLUMN updated_at;
        """
    )
