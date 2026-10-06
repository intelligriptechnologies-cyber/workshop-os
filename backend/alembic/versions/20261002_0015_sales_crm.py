"""Add tenant-scoped sales leads and immutable quotation documents.

Revision ID: 20261002_0015
Revises: 20261002_0014
"""

from alembic import op

revision = "20261002_0015"
down_revision = "20261002_0014"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE sales_leads (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            display_name text NOT NULL CHECK (btrim(display_name) <> ''),
            phone text NOT NULL CHECK (btrim(phone) <> ''), company text NOT NULL DEFAULT '',
            email text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', service_interest text NOT NULL DEFAULT '', notes text NOT NULL DEFAULT '',
            stage text NOT NULL DEFAULT 'NEW' CHECK (stage IN ('NEW','QUALIFIED','QUOTATION_SENT','WON','LOST')),
            temperature text NOT NULL DEFAULT 'WARM' CHECK (temperature IN ('HOT','WARM','COLD')),
            follow_up_due date, site_visit_completed boolean NOT NULL DEFAULT false, site_visit_date date,
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX sales_leads_scope_idx ON sales_leads (tenant_id, branch_id, stage, temperature, created_at DESC);
        CREATE TABLE quotations (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT, branch_id uuid NOT NULL,
            lead_id bigint NOT NULL REFERENCES sales_leads(id) ON DELETE RESTRICT,
            quotation_no text NOT NULL, status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED')),
            valid_until date, customer_notes text NOT NULL DEFAULT '', discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
            subtotal numeric(14,2) NOT NULL DEFAULT 0, gst_amount numeric(14,2) NOT NULL DEFAULT 0, total numeric(14,2) NOT NULL DEFAULT 0,
            template_id text NOT NULL, template_html text NOT NULL, document_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, quotation_no), FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX quotations_scope_idx ON quotations (tenant_id, branch_id, status, valid_until, created_at DESC);
        CREATE TABLE quotation_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, quotation_id bigint NOT NULL REFERENCES quotations(id) ON DELETE RESTRICT,
            line_no integer NOT NULL CHECK (line_no > 0), kind text NOT NULL DEFAULT 'Service', description text NOT NULL CHECK (btrim(description) <> ''),
            quantity numeric(14,3) NOT NULL CHECK (quantity > 0), rate numeric(14,2) NOT NULL CHECK (rate >= 0), gst_rate numeric(5,2) NOT NULL CHECK (gst_rate >= 0 AND gst_rate <= 100),
            UNIQUE (quotation_id, line_no), FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
    """)
    for table in ("sales_leads", "quotations", "quotation_lines"):
        _scoped(table)
    op.execute("GRANT SELECT, INSERT, UPDATE, DELETE ON sales_leads, quotations, quotation_lines TO workshopos_runtime; GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS quotation_lines")
    op.execute("DROP TABLE IF EXISTS quotations")
    op.execute("DROP TABLE IF EXISTS sales_leads")
