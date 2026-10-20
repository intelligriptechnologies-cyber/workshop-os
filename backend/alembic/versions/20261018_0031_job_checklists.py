"""Tenant-scoped job checklist cycles and items.

Revision ID: 20261018_0031
Revises: 20261018_0030
"""
from alembic import op

revision = "20261018_0031"
down_revision = "20261018_0030"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""CREATE TABLE job_checklist_cycles (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id),
        branch_id uuid NOT NULL,
        job_card_id bigint NOT NULL REFERENCES job_cards(id),
        stage text NOT NULL,
        cycle_number integer NOT NULL CHECK (cycle_number > 0),
        started_at timestamptz NOT NULL,
        completed_at timestamptz,
        UNIQUE (tenant_id, branch_id, job_card_id, stage, cycle_number),
        UNIQUE (tenant_id, branch_id, id),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
    );
    CREATE TABLE job_checklist_items (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id),
        branch_id uuid NOT NULL,
        cycle_id bigint NOT NULL,
        job_card_id bigint NOT NULL REFERENCES job_cards(id),
        item_key text NOT NULL,
        label text NOT NULL,
        sort_order integer NOT NULL,
        required boolean NOT NULL DEFAULT true,
        checked_by uuid REFERENCES platform_users(id),
        checked_at timestamptz,
        na_by uuid REFERENCES platform_users(id),
        na_at timestamptz,
        started_at timestamptz,
        completed_at timestamptz,
        UNIQUE (cycle_id, item_key),
        FOREIGN KEY (tenant_id, branch_id, cycle_id)
            REFERENCES job_checklist_cycles(tenant_id, branch_id, id),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
    );
    CREATE INDEX job_checklist_cycles_job_idx ON job_checklist_cycles(tenant_id, branch_id, job_card_id);
    CREATE INDEX job_checklist_items_job_idx ON job_checklist_items(tenant_id, branch_id, job_card_id);
    """)
    for table in ("job_checklist_cycles", "job_checklist_items"):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
        op.execute(f"""CREATE POLICY {table}_branch_scope ON {table}
            USING (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
                AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]))
            WITH CHECK (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
                AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]))""")
    op.execute("GRANT SELECT, INSERT, UPDATE ON job_checklist_cycles, job_checklist_items TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS job_checklist_items")
    op.execute("DROP TABLE IF EXISTS job_checklist_cycles")
