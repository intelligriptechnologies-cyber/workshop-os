"""Add auditable Store Purchase Requests and supplier comparisons.

Revision ID: 20261006_0022
Revises: 20261006_0021
"""

from alembic import op


revision = "20261006_0022"
down_revision = "20261006_0021"
branch_labels = None
depends_on = None

TENANT = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH = f"({TENANT}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"


def upgrade() -> None:
    op.execute(f"""
    CREATE TABLE purchase_requests (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
      request_number text NOT NULL CHECK (btrim(request_number) <> ''), source_reference text NOT NULL DEFAULT '', notes text NOT NULL DEFAULT '',
      status text NOT NULL CHECK (status IN ('REQUESTED','APPROVED','ISSUED','CANCELLED')),
      requested_by uuid NOT NULL REFERENCES platform_users(id), approved_by uuid REFERENCES platform_users(id),
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (tenant_id,branch_id,id), UNIQUE (tenant_id,branch_id,request_number),
      FOREIGN KEY (tenant_id,branch_id) REFERENCES branches(tenant_id,id)
    );
    CREATE TABLE purchase_request_lines (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL, purchase_request_id bigint NOT NULL,
      line_no integer NOT NULL CHECK(line_no > 0), item_id bigint REFERENCES catalogue_items(id),
      new_item_name text, unit text NOT NULL CHECK (btrim(unit) <> ''), ordered_qty numeric(14,3) NOT NULL CHECK(ordered_qty > 0),
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (purchase_request_id,line_no), UNIQUE(tenant_id,branch_id,id),
      CHECK ((item_id IS NOT NULL AND new_item_name IS NULL) OR (item_id IS NULL AND btrim(new_item_name) <> '')),
      FOREIGN KEY (tenant_id,branch_id) REFERENCES branches(tenant_id,id),
      FOREIGN KEY (tenant_id,branch_id,purchase_request_id) REFERENCES purchase_requests(tenant_id,branch_id,id),
      FOREIGN KEY (tenant_id,branch_id,item_id) REFERENCES catalogue_items(tenant_id,branch_id,id)
    );
    CREATE TABLE purchase_request_quotes (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL, purchase_request_line_id bigint NOT NULL, supplier_id bigint NOT NULL,
      unit_cost numeric(14,2) NOT NULL CHECK(unit_cost >= 0), note text NOT NULL DEFAULT '', created_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(purchase_request_line_id,supplier_id), UNIQUE(tenant_id,branch_id,id),
      FOREIGN KEY (tenant_id,branch_id) REFERENCES branches(tenant_id,id),
      FOREIGN KEY (tenant_id,branch_id,purchase_request_line_id) REFERENCES purchase_request_lines(tenant_id,branch_id,id),
      FOREIGN KEY (tenant_id,branch_id,supplier_id) REFERENCES suppliers(tenant_id,branch_id,id)
    );
    CREATE TABLE purchase_request_events (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL, purchase_request_id bigint NOT NULL,
      command text NOT NULL, reason text NOT NULL DEFAULT '', actor_id uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(tenant_id,branch_id,id), FOREIGN KEY(tenant_id,branch_id) REFERENCES branches(tenant_id,id),
      FOREIGN KEY(tenant_id,branch_id,purchase_request_id) REFERENCES purchase_requests(tenant_id,branch_id,id)
    );
    CREATE TABLE purchase_request_purchase_orders (
      tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL, purchase_request_id bigint NOT NULL, purchase_order_id bigint NOT NULL,
      PRIMARY KEY(purchase_request_id,purchase_order_id),
      FOREIGN KEY(tenant_id,branch_id) REFERENCES branches(tenant_id,id),
      FOREIGN KEY(tenant_id,branch_id,purchase_request_id) REFERENCES purchase_requests(tenant_id,branch_id,id),
      FOREIGN KEY(tenant_id,branch_id,purchase_order_id) REFERENCES purchase_orders(tenant_id,branch_id,id)
    );
    """)
    for table in ("purchase_requests", "purchase_request_lines", "purchase_request_quotes", "purchase_request_events", "purchase_request_purchase_orders"):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
        op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH}) WITH CHECK ({BRANCH})")
    op.execute("GRANT SELECT, INSERT, UPDATE ON purchase_requests, purchase_request_lines, purchase_request_quotes, purchase_request_events, purchase_request_purchase_orders TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    for table in ("purchase_request_purchase_orders", "purchase_request_events", "purchase_request_quotes", "purchase_request_lines", "purchase_requests"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
