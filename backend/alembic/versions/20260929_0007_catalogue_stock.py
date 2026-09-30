"""Create branch catalogue, purchasing, inward, and immutable stock ledger.

Revision ID: 20260929_0007
Revises: 20260929_0006
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0007"
down_revision = "20260929_0006"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE catalogue_items (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            sku text NOT NULL CHECK (btrim(sku) <> ''),
            category text NOT NULL DEFAULT '', name text NOT NULL CHECK (btrim(name) <> ''),
            unit text NOT NULL CHECK (btrim(unit) <> ''),
            low_stock_qty numeric(14,3) NOT NULL DEFAULT 0 CHECK (low_stock_qty >= 0),
            selling_price numeric(14,2) NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
            archived_at timestamptz, archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text, created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX catalogue_items_active_sku ON catalogue_items(tenant_id, branch_id, upper(sku)) WHERE archived_at IS NULL;
        CREATE INDEX catalogue_items_scope_search ON catalogue_items(tenant_id, branch_id, archived_at, lower(name));

        CREATE TABLE suppliers (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, name text NOT NULL CHECK (btrim(name) <> ''),
            mobile text NOT NULL DEFAULT '', email text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '',
            archived_at timestamptz, archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text, created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX suppliers_active_name ON suppliers(tenant_id, branch_id, lower(name)) WHERE archived_at IS NULL;

        CREATE TABLE purchase_orders (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, supplier_id bigint NOT NULL,
            po_number text NOT NULL CHECK (btrim(po_number) <> ''), order_date date NOT NULL,
            status text NOT NULL CHECK (status IN ('DRAFT','SENT','PARTIALLY_RECEIVED','READY_TO_CLOSE','CLOSED','CANCELLED')),
            notes text NOT NULL DEFAULT '', created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, po_number),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES suppliers(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE purchase_order_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, purchase_order_id bigint NOT NULL, item_id bigint NOT NULL,
            line_no integer NOT NULL CHECK (line_no > 0), ordered_qty numeric(14,3) NOT NULL CHECK (ordered_qty > 0),
            unit_cost numeric(14,2) NOT NULL CHECK (unit_cost >= 0), discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
            gst_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (gst_rate >= 0 AND gst_rate <= 100),
            UNIQUE (purchase_order_id, line_no), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE stock_inwards (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT, branch_id uuid NOT NULL,
            item_id bigint NOT NULL, purchase_order_id bigint, purchase_order_line_id bigint,
            qty numeric(14,3) NOT NULL CHECK (qty > 0), unit_cost numeric(14,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
            note text NOT NULL DEFAULT '', received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            received_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE stock_ledger (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT, branch_id uuid NOT NULL,
            item_id bigint NOT NULL, inward_id bigint REFERENCES stock_inwards(id) ON DELETE RESTRICT,
            entry_type text NOT NULL CHECK (entry_type IN ('INWARD','ADJUSTMENT')),
            quantity numeric(14,3) NOT NULL CHECK (quantity <> 0), unit_cost numeric(14,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
            reason text NOT NULL CHECK (btrim(reason) <> ''), actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX stock_ledger_item_history ON stock_ledger(tenant_id, branch_id, item_id, created_at DESC);
        CREATE FUNCTION stock_ledger_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'stock_ledger_is_immutable'; END $$;
        CREATE TRIGGER stock_ledger_no_mutation BEFORE UPDATE OR DELETE ON stock_ledger FOR EACH ROW EXECUTE FUNCTION stock_ledger_immutable();
    """)
    for table in ("catalogue_items", "suppliers", "purchase_orders", "purchase_order_lines", "stock_inwards", "stock_ledger"):
        _scoped_table(table)
    op.execute("GRANT SELECT, INSERT, UPDATE ON catalogue_items, suppliers, purchase_orders, purchase_order_lines, stock_inwards, stock_ledger TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON catalogue_items, suppliers, purchase_orders, purchase_order_lines, stock_inwards, stock_ledger FROM workshopos_runtime")
    op.execute("DROP TRIGGER IF EXISTS stock_ledger_no_mutation ON stock_ledger")
    op.execute("DROP FUNCTION IF EXISTS stock_ledger_immutable")
    for table in ("stock_ledger", "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
