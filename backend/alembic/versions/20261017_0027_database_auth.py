"""Tenant codes and revocable database login sessions.

Revision ID: 20261017_0027
Revises: 20261011_0026
"""
from alembic import op

revision = "20261017_0027"
down_revision = "20261011_0026"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE tenants ADD COLUMN code text")
    op.execute("CREATE UNIQUE INDEX tenants_code_unique ON tenants (lower(code)) WHERE code IS NOT NULL")
    op.execute("ALTER TABLE platform_users ADD COLUMN password_hash text")
    op.execute("""CREATE TABLE database_sessions (
        token_hash text PRIMARY KEY,
        csrf_hash text NOT NULL,
        tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
        membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE CASCADE,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id)
    )""")
    op.execute("CREATE INDEX database_sessions_expiry ON database_sessions (expires_at)")


def downgrade() -> None:
    op.execute("DROP TABLE database_sessions")
    op.execute("ALTER TABLE platform_users DROP COLUMN password_hash")
    op.execute("ALTER TABLE tenants DROP COLUMN code")
