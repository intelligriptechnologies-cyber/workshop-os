"""Persist technician tasks, work evidence, attachments, and QC history."""

from alembic import op


revision = "20261001_0002"
down_revision = "20260929_0008"
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
        CREATE TABLE technician_tasks (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), assigned_to uuid NOT NULL REFERENCES platform_users(id),
            title text NOT NULL CHECK (btrim(title) <> ''), notes text NOT NULL DEFAULT '',
            status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_PROGRESS','BLOCKED','COMPLETED','CANCELLED')),
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE INDEX technician_tasks_assignee ON technician_tasks(tenant_id, assigned_to, status, updated_at DESC);
        CREATE TABLE work_updates (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), task_id bigint REFERENCES technician_tasks(id),
            body text NOT NULL CHECK (btrim(body) <> ''), status text NOT NULL CHECK (status IN ('IN_PROGRESS','BLOCKED','COMPLETED')),
            actor_id uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE TABLE evidence_attachments (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), work_update_id bigint REFERENCES work_updates(id),
            filename text NOT NULL, content_type text NOT NULL, size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 10485760),
            sha256 text NOT NULL CHECK (length(sha256)=64), content bytea NOT NULL,
            uploaded_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE INDEX evidence_attachments_job ON evidence_attachments(tenant_id, branch_id, job_card_id, id);
        CREATE TABLE qc_checks (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), label text NOT NULL CHECK (btrim(label) <> ''),
            required boolean NOT NULL DEFAULT true, status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','FAILED','PASSED')),
            created_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE TABLE qc_results (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            qc_check_id bigint NOT NULL REFERENCES qc_checks(id), outcome text NOT NULL CHECK (outcome IN ('FAILED','PASSED')),
            note text NOT NULL DEFAULT '', actor_id uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE FUNCTION immutable_execution_record() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'execution_record_is_immutable'; END $$;
        CREATE TRIGGER work_updates_immutable BEFORE UPDATE OR DELETE ON work_updates FOR EACH ROW EXECUTE FUNCTION immutable_execution_record();
        CREATE TRIGGER evidence_attachments_immutable BEFORE UPDATE OR DELETE ON evidence_attachments FOR EACH ROW EXECUTE FUNCTION immutable_execution_record();
        CREATE TRIGGER qc_results_immutable BEFORE UPDATE OR DELETE ON qc_results FOR EACH ROW EXECUTE FUNCTION immutable_execution_record();
    """)
    for table in ("technician_tasks", "work_updates", "evidence_attachments", "qc_checks", "qc_results"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON technician_tasks, qc_checks TO workshopos_runtime;
        GRANT SELECT, INSERT ON work_updates, evidence_attachments, qc_results TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS qc_results, qc_checks, evidence_attachments, work_updates, technician_tasks CASCADE")
    op.execute("DROP FUNCTION IF EXISTS immutable_execution_record")
