"""Scope bundled source archive to a tenant branch for audited reads.

Revision ID: 20261018_0033
Revises: 20261018_0032
"""
from alembic import op

revision = "20261018_0033"
down_revision = "20261018_0032"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE demo_import_rows ADD COLUMN branch_id uuid")
    op.execute("""UPDATE demo_import_rows r SET branch_id=b.id FROM branches b
        WHERE b.tenant_id=r.tenant_id AND b.is_primary""")
    op.execute("ALTER TABLE demo_import_rows ALTER COLUMN branch_id SET NOT NULL")
    op.execute("""ALTER TABLE demo_import_rows ADD CONSTRAINT demo_import_rows_branch_fk
        FOREIGN KEY (tenant_id,branch_id) REFERENCES branches(tenant_id,id)""")
    op.execute("ALTER TABLE demo_import_rows ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE demo_import_rows FORCE ROW LEVEL SECURITY")
    op.execute("""CREATE POLICY demo_import_rows_scope ON demo_import_rows
        USING (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
            AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{}')::uuid[]))
        WITH CHECK (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
            AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{}')::uuid[]))""")
    op.execute("GRANT SELECT ON demo_import_rows TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT ON demo_import_rows FROM workshopos_runtime")
    op.execute("DROP POLICY IF EXISTS demo_import_rows_scope ON demo_import_rows")
    op.execute("ALTER TABLE demo_import_rows DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE demo_import_rows DROP CONSTRAINT demo_import_rows_branch_fk")
    op.execute("ALTER TABLE demo_import_rows DROP COLUMN branch_id")
