"""Add a branch-scoped service-task catalogue for sales quotations.

Revision ID: 20261002_0016
Revises: 20261002_0015
"""

from alembic import op

revision = "20261002_0016"
down_revision = "20261002_0015"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"({TENANT_RLS}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"


def upgrade() -> None:
    op.execute(f"""
        CREATE TABLE service_task_catalog (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            name text NOT NULL CHECK (btrim(name) <> ''),
            description text NOT NULL DEFAULT '',
            rate numeric(14,2) NOT NULL CHECK (rate >= 0),
            gst_rate numeric(5,2) NOT NULL DEFAULT 18 CHECK (gst_rate >= 0 AND gst_rate <= 100),
            status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ARCHIVED')),
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX service_task_catalog_scope_idx ON service_task_catalog (tenant_id, branch_id, status, name);
        ALTER TABLE service_task_catalog ENABLE ROW LEVEL SECURITY;
        ALTER TABLE service_task_catalog FORCE ROW LEVEL SECURITY;
        CREATE POLICY service_task_catalog_branch_scope ON service_task_catalog USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS});
        GRANT SELECT, INSERT, UPDATE, DELETE ON service_task_catalog TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS service_task_catalog")
