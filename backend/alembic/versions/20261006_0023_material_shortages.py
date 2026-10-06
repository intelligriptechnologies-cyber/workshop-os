"""Persist authoritative material shortages before procurement.

Revision ID: 20261006_0023
Revises: 20261006_0022
"""
from alembic import op

revision = "20261006_0023"
down_revision = "20261006_0022"
branch_labels = None
depends_on = None

TENANT = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH = f"({TENANT}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"

def upgrade() -> None:
    op.execute(f"""CREATE TABLE material_shortages (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
      item_id bigint NOT NULL, requested_qty numeric(14,3) NOT NULL CHECK(requested_qty>0), available_qty numeric(14,3) NOT NULL,
      shortage_qty numeric(14,3) NOT NULL CHECK(shortage_qty>0), status text NOT NULL CHECK(status IN ('OPEN','PROCURED','CANCELLED')),
      created_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(tenant_id,branch_id,id), FOREIGN KEY(tenant_id,branch_id) REFERENCES branches(tenant_id, id),
      FOREIGN KEY(tenant_id,branch_id,item_id) REFERENCES catalogue_items(tenant_id,branch_id,id));
      ALTER TABLE material_shortages ENABLE ROW LEVEL SECURITY; ALTER TABLE material_shortages FORCE ROW LEVEL SECURITY;
      CREATE POLICY material_shortages_branch_scope ON material_shortages USING ({BRANCH}) WITH CHECK ({BRANCH});
      ALTER TABLE purchase_request_lines ADD COLUMN material_shortage_id bigint;
      ALTER TABLE purchase_request_lines ADD CONSTRAINT purchase_request_lines_shortage_fk FOREIGN KEY(tenant_id,branch_id,material_shortage_id) REFERENCES material_shortages(tenant_id,branch_id,id);
      GRANT SELECT,INSERT,UPDATE ON material_shortages TO workshopos_runtime; GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;""")
def downgrade() -> None:
    op.execute("ALTER TABLE purchase_request_lines DROP CONSTRAINT IF EXISTS purchase_request_lines_shortage_fk; ALTER TABLE purchase_request_lines DROP COLUMN IF EXISTS material_shortage_id; DROP TABLE IF EXISTS material_shortages")
