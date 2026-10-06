"""Add tenant/branch-scoped follow-ups and search support.

Revision ID: 20260929_0012
Revises: 20260929_0011
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0012"
down_revision = "20260929_0011"
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
        CREATE TABLE followups (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            note text NOT NULL CHECK (btrim(note) <> ''),
            due_at date,
            status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'COMPLETED')),
            outcome text NOT NULL DEFAULT '',
            completed_at timestamptz,
            completed_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            version integer NOT NULL DEFAULT 1 CHECK (version > 0),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX followups_scope_due_idx ON followups (tenant_id, branch_id, archived_at, status, due_at, id);
        CREATE INDEX followups_job_idx ON followups (tenant_id, branch_id, job_card_id, archived_at, id DESC);
    """)
    _scoped_table("followups")
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON followups TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON followups FROM workshopos_runtime")
    op.execute("DROP TABLE IF EXISTS followups")
