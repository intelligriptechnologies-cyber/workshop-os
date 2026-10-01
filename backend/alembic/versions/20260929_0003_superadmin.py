"""Add the Superadmin control plane and read-only support emulation.

Revision ID: 20260929_0003
Revises: 20260929_0002
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0003"
down_revision = "20260929_0002"
branch_labels = None
depends_on = None


TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
WRITABLE_TENANT_RLS = f"({TENANT_RLS}) AND COALESCE(NULLIF(current_setting('workshopos.read_only', true), ''), 'false') <> 'true'"
BRANCH_RLS = f"({TENANT_RLS}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"
WRITABLE_BRANCH_RLS = f"({BRANCH_RLS}) AND COALESCE(NULLIF(current_setting('workshopos.read_only', true), ''), 'false') <> 'true'"


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE platform_users ALTER COLUMN cognito_subject DROP NOT NULL;
        CREATE TABLE superadmins (
            user_id uuid PRIMARY KEY REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE platform_billing (
            tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE RESTRICT,
            plan text NOT NULL,
            agreed_price numeric(12,2) NOT NULL CHECK (agreed_price >= 0),
            currency char(3) NOT NULL,
            billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
            renewal_date date NOT NULL,
            due_date date NOT NULL,
            payment_status text NOT NULL CHECK (payment_status IN ('pending', 'paid', 'overdue', 'waived')),
            internal_notes text NOT NULL DEFAULT '',
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE tenant_admin_invitations (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            email text NOT NULL,
            status text NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'CANCELLED')) DEFAULT 'PENDING',
            created_at timestamptz NOT NULL DEFAULT now(),
            accepted_at timestamptz,
            UNIQUE (membership_id)
        );
        CREATE UNIQUE INDEX tenant_admin_invitations_pending_email
            ON tenant_admin_invitations (tenant_id, email) WHERE status = 'PENDING';
        CREATE TABLE support_emulations (
            id uuid PRIMARY KEY,
            superadmin_id uuid NOT NULL REFERENCES superadmins(user_id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            status text NOT NULL CHECK (status IN ('ACTIVE', 'ENDED')) DEFAULT 'ACTIVE',
            reason text NOT NULL,
            started_at timestamptz NOT NULL DEFAULT now(),
            ended_at timestamptz,
            ended_reason text
        );
        CREATE UNIQUE INDEX support_emulations_one_active_per_actor_tenant
            ON support_emulations (superadmin_id, tenant_id) WHERE status = 'ACTIVE';
        CREATE TABLE tenant_audit_events (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            action text NOT NULL,
            reason text NOT NULL,
            before_value jsonb NOT NULL DEFAULT '{}'::jsonb,
            after_value jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX tenant_audit_events_tenant_created_idx ON tenant_audit_events (tenant_id, created_at DESC);
        """
    )
    for table, readable, writable in (("tenant_settings", TENANT_RLS, WRITABLE_TENANT_RLS), ("branch_settings", BRANCH_RLS, WRITABLE_BRANCH_RLS)):
        op.execute(f"DROP POLICY {table}_tenant_scope ON {table}")
        op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({readable}) WITH CHECK ({writable})")


def downgrade() -> None:
    for table, predicate in (("tenant_settings", TENANT_RLS), ("branch_settings", BRANCH_RLS)):
        op.execute(f"DROP POLICY IF EXISTS {table}_tenant_scope ON {table}")
        op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({predicate}) WITH CHECK ({predicate})")
    op.execute(
        """
        DROP TABLE IF EXISTS tenant_audit_events;
        DROP TABLE IF EXISTS support_emulations;
        DROP TABLE IF EXISTS tenant_admin_invitations;
        DROP TABLE IF EXISTS platform_billing;
        DROP TABLE IF EXISTS superadmins;
        ALTER TABLE platform_users ALTER COLUMN cognito_subject SET NOT NULL;
        """
    )
