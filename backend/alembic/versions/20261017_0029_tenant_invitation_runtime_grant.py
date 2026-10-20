"""Repair tenant user visibility and invitation table privileges.

Revision ID: 20261017_0029
Revises: 20261017_0028
"""

from alembic import op


revision = "20261017_0029"
down_revision = "20261017_0028"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("GRANT SELECT, INSERT, UPDATE ON tenant_admin_invitations TO workshopos_runtime")
    op.execute("DROP POLICY platform_users_tenant_read ON platform_users")
    op.execute("DROP POLICY platform_users_tenant_update ON platform_users")
    op.execute("""CREATE POLICY platform_users_tenant_read ON platform_users FOR SELECT
        USING (EXISTS (SELECT 1 FROM tenant_memberships AS m
          WHERE m.user_id = platform_users.id
            AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid))""")
    op.execute("""CREATE POLICY platform_users_tenant_update ON platform_users FOR UPDATE
        USING (EXISTS (SELECT 1 FROM tenant_memberships AS m
          WHERE m.user_id = platform_users.id
            AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid))
        WITH CHECK (true)""")


def downgrade() -> None:
    op.execute("DROP POLICY platform_users_tenant_read ON platform_users")
    op.execute("DROP POLICY platform_users_tenant_update ON platform_users")
    op.execute("""CREATE POLICY platform_users_tenant_read ON platform_users FOR SELECT
        USING (EXISTS (SELECT 1 FROM tenant_memberships AS m
          WHERE m.user_id = id
            AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid))""")
    op.execute("""CREATE POLICY platform_users_tenant_update ON platform_users FOR UPDATE
        USING (EXISTS (SELECT 1 FROM tenant_memberships AS m
          WHERE m.user_id = id
            AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid))
        WITH CHECK (true)""")
    op.execute("REVOKE SELECT, INSERT, UPDATE ON tenant_admin_invitations FROM workshopos_runtime")
