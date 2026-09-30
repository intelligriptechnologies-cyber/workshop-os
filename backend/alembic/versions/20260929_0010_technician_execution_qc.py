"""Create tenant-scoped technician tasks, durable evidence, and QC results.

Revision ID: 20260929_0010
Revises: 20260929_0009
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0010"
down_revision = "20260929_0009"
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
        CREATE TABLE technician_tasks (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            assigned_technician_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            source_qc_check_id bigint,
            title text NOT NULL CHECK (length(btrim(title)) > 0),
            instructions text NOT NULL DEFAULT '',
            status text NOT NULL CHECK (status IN ('PENDING','IN_PROGRESS','PAUSED','COMPLETED','CANCELLED')),
            started_at timestamptz,
            completed_at timestamptz,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX technician_tasks_assignee_idx ON technician_tasks(tenant_id, branch_id, assigned_technician_id, status, created_at DESC);
        CREATE INDEX technician_tasks_job_idx ON technician_tasks(tenant_id, branch_id, job_card_id, created_at DESC);

        CREATE TABLE work_updates (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            technician_task_id bigint REFERENCES technician_tasks(id) ON DELETE RESTRICT,
            body text NOT NULL CHECK (length(btrim(body)) > 0),
            kind text NOT NULL CHECK (kind IN ('PROGRESS','BLOCKER','COMPLETION','REWORK')),
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX work_updates_job_idx ON work_updates(tenant_id, branch_id, job_card_id, created_at DESC);

        CREATE TABLE job_attachments (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            category text NOT NULL CHECK (category IN ('BEFORE_WORK','AFTER_WORK','WORK_EVIDENCE','QC_EVIDENCE')),
            filename text NOT NULL CHECK (length(btrim(filename)) > 0),
            content_type text NOT NULL CHECK (content_type IN ('image/jpeg','image/png','image/webp','application/pdf')),
            byte_size integer NOT NULL CHECK (byte_size > 0 AND byte_size <= 10485760),
            sha256 text NOT NULL CHECK (length(sha256) = 64),
            caption text NOT NULL DEFAULT '',
            content bytea NOT NULL,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            UNIQUE (job_card_id, sha256),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX job_attachments_job_idx ON job_attachments(tenant_id, branch_id, job_card_id, created_at DESC);

        CREATE TABLE qc_checks (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            label text NOT NULL CHECK (length(btrim(label)) > 0),
            required boolean NOT NULL DEFAULT true,
            status text NOT NULL CHECK (status IN ('PENDING','PASSED','FAILED')),
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX qc_checks_job_idx ON qc_checks(tenant_id, branch_id, job_card_id, created_at DESC);

        ALTER TABLE technician_tasks ADD CONSTRAINT technician_tasks_source_qc_check_fk
            FOREIGN KEY (source_qc_check_id) REFERENCES qc_checks(id) ON DELETE RESTRICT;

        CREATE TABLE qc_results (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            qc_check_id bigint NOT NULL REFERENCES qc_checks(id) ON DELETE RESTRICT,
            outcome text NOT NULL CHECK (outcome IN ('PASS','FAIL')),
            note text NOT NULL DEFAULT '',
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX qc_results_check_idx ON qc_results(tenant_id, branch_id, qc_check_id, created_at DESC);

        CREATE FUNCTION execution_job_is_active() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE job_status text;
        BEGIN
            SELECT status INTO job_status FROM job_cards WHERE id=NEW.job_card_id;
            IF job_status NOT IN ('IN_PROGRESS','HOLD') THEN
                RAISE EXCEPTION 'execution_job_not_active';
            END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER technician_tasks_active_job BEFORE INSERT OR UPDATE ON technician_tasks
            FOR EACH ROW EXECUTE FUNCTION execution_job_is_active();
        CREATE TRIGGER work_updates_active_job BEFORE INSERT ON work_updates
            FOR EACH ROW EXECUTE FUNCTION execution_job_is_active();
        CREATE TRIGGER job_attachments_active_job BEFORE INSERT ON job_attachments
            FOR EACH ROW EXECUTE FUNCTION execution_job_is_active();
        CREATE TRIGGER qc_checks_active_job BEFORE INSERT OR UPDATE ON qc_checks
            FOR EACH ROW EXECUTE FUNCTION execution_job_is_active();
        CREATE TRIGGER qc_results_active_job BEFORE INSERT ON qc_results
            FOR EACH ROW EXECUTE FUNCTION execution_job_is_active();

        CREATE FUNCTION job_attachments_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'job_attachment_is_immutable'; END $$;
        CREATE TRIGGER job_attachments_no_mutation BEFORE UPDATE OR DELETE ON job_attachments
            FOR EACH ROW EXECUTE FUNCTION job_attachments_immutable();
        CREATE FUNCTION work_updates_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'work_update_is_immutable'; END $$;
        CREATE TRIGGER work_updates_no_mutation BEFORE UPDATE OR DELETE ON work_updates
            FOR EACH ROW EXECUTE FUNCTION work_updates_immutable();
        CREATE FUNCTION qc_results_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'qc_result_is_immutable'; END $$;
        CREATE TRIGGER qc_results_no_mutation BEFORE UPDATE OR DELETE ON qc_results
            FOR EACH ROW EXECUTE FUNCTION qc_results_immutable();
    """)
    for table in ("technician_tasks", "work_updates", "job_attachments", "qc_checks", "qc_results"):
        _scoped_table(table)
    # Append-only evidence/result tables never need runtime UPDATE/DELETE.
    # The only mutable operational records are task state and QC check status.
    op.execute("GRANT SELECT, INSERT, UPDATE ON technician_tasks, qc_checks TO workshopos_runtime")
    op.execute("GRANT SELECT, INSERT ON work_updates, job_attachments, qc_results TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON technician_tasks, qc_checks FROM workshopos_runtime")
    op.execute("REVOKE SELECT, INSERT ON work_updates, job_attachments, qc_results FROM workshopos_runtime")
    for trigger, table in (
        ("technician_tasks_active_job", "technician_tasks"), ("work_updates_active_job", "work_updates"),
        ("job_attachments_active_job", "job_attachments"), ("qc_checks_active_job", "qc_checks"),
        ("qc_results_active_job", "qc_results"), ("job_attachments_no_mutation", "job_attachments"),
        ("work_updates_no_mutation", "work_updates"), ("qc_results_no_mutation", "qc_results"),
    ):
        op.execute(f"DROP TRIGGER IF EXISTS {trigger} ON {table}")
    for function in ("job_attachments_immutable", "work_updates_immutable", "qc_results_immutable", "execution_job_is_active"):
        op.execute(f"DROP FUNCTION IF EXISTS {function}")
    for table in ("qc_results", "qc_checks", "job_attachments", "work_updates", "technician_tasks"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
