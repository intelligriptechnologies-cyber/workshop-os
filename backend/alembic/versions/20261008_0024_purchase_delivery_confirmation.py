"""Add immutable purchase delivery receipts and acceptance confirmations.

Revision ID: 20261008_0024
Revises: 20261006_0023
"""

from alembic import op


revision = "20261008_0024"
down_revision = "20261006_0023"
branch_labels = None
depends_on = None

TENANT = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH = f"({TENANT}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH}) WITH CHECK ({BRANCH})")


def upgrade() -> None:
    op.execute("""
    CREATE TABLE purchase_order_delivery_receipts (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
        branch_id uuid NOT NULL,
        purchase_order_id bigint NOT NULL,
        request_key text NOT NULL CHECK (btrim(request_key) <> ''),
        note text NOT NULL DEFAULT '',
        received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
        received_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (tenant_id, branch_id, id),
        UNIQUE (purchase_order_id, request_key),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
        FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT
    );
    CREATE TABLE purchase_order_delivery_receipt_lines (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
        branch_id uuid NOT NULL,
        receipt_id bigint NOT NULL,
        purchase_order_line_id bigint NOT NULL,
        delivered_qty numeric(14,3) NOT NULL CHECK (delivered_qty > 0),
        UNIQUE (receipt_id, purchase_order_line_id),
        UNIQUE (tenant_id, branch_id, id),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
        FOREIGN KEY (tenant_id, branch_id, receipt_id) REFERENCES purchase_order_delivery_receipts(tenant_id, branch_id, id) ON DELETE RESTRICT,
        FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT
    );
    CREATE TABLE purchase_order_delivery_confirmations (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
        branch_id uuid NOT NULL,
        purchase_order_id bigint NOT NULL,
        purchase_order_line_id bigint NOT NULL,
        request_key text NOT NULL CHECK (btrim(request_key) <> ''),
        accepted_qty numeric(14,3) NOT NULL CHECK (accepted_qty >= 0),
        rejected_qty numeric(14,3) NOT NULL CHECK (rejected_qty >= 0),
        rejection_reason text NOT NULL DEFAULT '',
        confirmed_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
        confirmed_at timestamptz NOT NULL DEFAULT now(),
        CHECK (accepted_qty + rejected_qty > 0),
        UNIQUE (purchase_order_id, purchase_order_line_id),
        UNIQUE (tenant_id, branch_id, id),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
        FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT,
        FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT
    );
    CREATE FUNCTION purchase_delivery_record_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN RAISE EXCEPTION 'purchase_delivery_record_is_immutable'; END $$;
    CREATE TRIGGER purchase_order_delivery_receipts_no_mutation BEFORE UPDATE OR DELETE ON purchase_order_delivery_receipts FOR EACH ROW EXECUTE FUNCTION purchase_delivery_record_immutable();
    CREATE TRIGGER purchase_order_delivery_receipt_lines_no_mutation BEFORE UPDATE OR DELETE ON purchase_order_delivery_receipt_lines FOR EACH ROW EXECUTE FUNCTION purchase_delivery_record_immutable();
    CREATE TRIGGER purchase_order_delivery_confirmations_no_mutation BEFORE UPDATE OR DELETE ON purchase_order_delivery_confirmations FOR EACH ROW EXECUTE FUNCTION purchase_delivery_record_immutable();
    """)
    for table in ("purchase_order_delivery_receipts", "purchase_order_delivery_receipt_lines", "purchase_order_delivery_confirmations"):
        _scoped(table)
    op.execute("GRANT SELECT, INSERT ON purchase_order_delivery_receipts, purchase_order_delivery_receipt_lines, purchase_order_delivery_confirmations TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT ON purchase_order_delivery_receipts, purchase_order_delivery_receipt_lines, purchase_order_delivery_confirmations FROM workshopos_runtime")
    for trigger, table in (
        ("purchase_order_delivery_confirmations_no_mutation", "purchase_order_delivery_confirmations"),
        ("purchase_order_delivery_receipt_lines_no_mutation", "purchase_order_delivery_receipt_lines"),
        ("purchase_order_delivery_receipts_no_mutation", "purchase_order_delivery_receipts"),
    ):
        op.execute(f"DROP TRIGGER IF EXISTS {trigger} ON {table}")
    op.execute("DROP FUNCTION IF EXISTS purchase_delivery_record_immutable")
    for table in ("purchase_order_delivery_confirmations", "purchase_order_delivery_receipt_lines", "purchase_order_delivery_receipts"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
