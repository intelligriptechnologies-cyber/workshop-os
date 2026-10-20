"""Shared service task catalogue and job task selections.

Revision ID: 20261018_0032
Revises: 20261018_0031
"""
from alembic import op

revision = "20261018_0032"
down_revision = "20261018_0031"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""ALTER TABLE service_task_catalog ADD COLUMN department_id uuid REFERENCES service_departments(id);
    ALTER TABLE service_task_catalog ADD COLUMN archive_reason text;
    ALTER TABLE service_task_catalog ADD COLUMN archived_at timestamptz;
    CREATE TABLE job_service_tasks (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
        job_card_id bigint NOT NULL REFERENCES job_cards(id),
        catalogue_item_id bigint REFERENCES service_task_catalog(id),
        name text NOT NULL CHECK (btrim(name) <> ''),
        base_rate numeric(14,2) NOT NULL CHECK (base_rate >= 0),
        gst_rate numeric(5,2) NOT NULL CHECK (gst_rate >= 0 AND gst_rate <= 100),
        done boolean NOT NULL DEFAULT false,
        archived_at timestamptz, archive_reason text,
        created_by uuid NOT NULL REFERENCES platform_users(id),
        updated_by uuid NOT NULL REFERENCES platform_users(id),
        created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
    );
    CREATE INDEX job_service_tasks_job_idx ON job_service_tasks(tenant_id, branch_id, job_card_id);
    """)
    for table in ("job_service_tasks",):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
        op.execute(f"""CREATE POLICY {table}_scope ON {table}
            USING (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
                AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]))
            WITH CHECK (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
                AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]))""")
    op.execute("GRANT SELECT, INSERT, UPDATE ON job_service_tasks TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS job_service_tasks")
    op.execute("ALTER TABLE service_task_catalog DROP COLUMN archived_at")
    op.execute("ALTER TABLE service_task_catalog DROP COLUMN archive_reason")
    op.execute("ALTER TABLE service_task_catalog DROP COLUMN department_id")
