"""Tenant-scoped job media records.

Revision ID: 20261018_0030
Revises: 20261017_0029
"""
from alembic import op

revision = "20261018_0030"
down_revision = "20261017_0029"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""CREATE TABLE job_media (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
        branch_id uuid NOT NULL,
        job_card_id bigint NOT NULL,
        label text NOT NULL DEFAULT '',
        category text NOT NULL DEFAULT '',
        src text NOT NULL,
        archived_at timestamptz,
        archive_reason text,
        created_by uuid NOT NULL REFERENCES platform_users(id),
        updated_by uuid NOT NULL REFERENCES platform_users(id),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id),
        FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id)
    )""")
    op.execute("ALTER TABLE job_media ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE job_media FORCE ROW LEVEL SECURITY")
    op.execute("""CREATE POLICY job_media_scope ON job_media
        USING (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
          AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{}')::uuid[]))
        WITH CHECK (tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
          AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{}')::uuid[]))""")
    op.execute("GRANT SELECT, INSERT, UPDATE ON job_media TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("DROP TABLE job_media")
