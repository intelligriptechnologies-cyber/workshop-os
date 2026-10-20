"""Record bundled demo source rows and their canonical PostgreSQL mappings.

Revision ID: 20261017_0028
Revises: 20261017_0027
"""
from alembic import op

revision = "20261017_0028"
down_revision = "20261017_0027"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""CREATE TABLE demo_import_runs (
        tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE RESTRICT,
        source_sha256 text NOT NULL,
        import_version integer NOT NULL,
        source_counts jsonb NOT NULL,
        mapped_counts jsonb NOT NULL,
        imported_at timestamptz NOT NULL DEFAULT now()
    )""")
    op.execute("""CREATE TABLE demo_import_rows (
        tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
        source_table text NOT NULL,
        source_id text NOT NULL,
        target_id text,
        payload jsonb NOT NULL,
        PRIMARY KEY (tenant_id, source_table, source_id)
    )""")


def downgrade() -> None:
    op.execute("DROP TABLE demo_import_rows")
    op.execute("DROP TABLE demo_import_runs")
