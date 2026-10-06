"""Create RLS-backed job cards, estimates, decisions, and command evidence.

Revision ID: 20260929_0006
Revises: 20260929_0005
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0006"
down_revision = "20260929_0005"
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
        CREATE TABLE job_cards (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_no text NOT NULL,
            visit_id bigint NOT NULL REFERENCES visits(id) ON DELETE RESTRICT,
            advisor_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            status text NOT NULL CHECK (status IN ('NEW','IN_PROGRESS','HOLD','COMPLETED','CANCELLED','CLOSED')),
            work_list text NOT NULL DEFAULT '',
            promised_at timestamptz,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, job_no), UNIQUE (visit_id), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX job_cards_scope_idx ON job_cards (tenant_id, branch_id, status, created_at DESC);

        CREATE TABLE estimates (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            revision integer NOT NULL CHECK (revision > 0),
            status text NOT NULL CHECK (status IN ('DRAFT','APPROVED','DECLINED')),
            discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
            gst_rate numeric(5,2) NOT NULL DEFAULT 18 CHECK (gst_rate >= 0 AND gst_rate <= 100),
            note text NOT NULL DEFAULT '',
            approved_snapshot jsonb,
            superseded_at timestamptz,
            superseded_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (job_card_id, revision),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX estimates_one_current_per_job ON estimates (job_card_id) WHERE superseded_at IS NULL;

        CREATE TABLE estimate_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            estimate_id bigint NOT NULL REFERENCES estimates(id) ON DELETE RESTRICT,
            line_no integer NOT NULL CHECK (line_no > 0),
            kind text NOT NULL CHECK (btrim(kind) <> ''),
            description text NOT NULL CHECK (btrim(description) <> ''),
            quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
            rate numeric(14,2) NOT NULL CHECK (rate >= 0),
            gst_rate numeric(5,2) NOT NULL CHECK (gst_rate >= 0 AND gst_rate <= 100),
            UNIQUE (estimate_id, line_no),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE estimate_decisions (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            estimate_id bigint NOT NULL REFERENCES estimates(id) ON DELETE RESTRICT,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            outcome text NOT NULL CHECK (outcome IN ('approved','declined')),
            channel text NOT NULL CHECK (channel IN ('in_person','phone','whatsapp','email','other')),
            decided_at timestamptz NOT NULL,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            note text NOT NULL DEFAULT '',
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (estimate_id)
        );

        CREATE TABLE job_events (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            command text NOT NULL,
            from_status text NOT NULL,
            to_status text NOT NULL,
            reason text NOT NULL DEFAULT '',
            request_key text,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX job_events_idempotency_key ON job_events (tenant_id, job_card_id, request_key) WHERE request_key IS NOT NULL;

        CREATE FUNCTION protect_approved_estimate_lines() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE protected_estimate_id bigint;
        BEGIN
            protected_estimate_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.estimate_id ELSE NEW.estimate_id END;
            IF EXISTS (SELECT 1 FROM estimates WHERE id = protected_estimate_id AND status <> 'DRAFT') THEN
                RAISE EXCEPTION 'approved_or_decided_estimate_is_immutable';
            END IF;
            IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER estimate_lines_immutable BEFORE INSERT OR UPDATE OR DELETE ON estimate_lines
            FOR EACH ROW EXECUTE FUNCTION protect_approved_estimate_lines();
        CREATE FUNCTION protect_approved_estimate() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF OLD.status = 'APPROVED' AND (
                NEW.status IS DISTINCT FROM OLD.status OR NEW.discount IS DISTINCT FROM OLD.discount
                OR NEW.gst_rate IS DISTINCT FROM OLD.gst_rate OR NEW.note IS DISTINCT FROM OLD.note
                OR NEW.approved_snapshot IS DISTINCT FROM OLD.approved_snapshot
            ) THEN
                RAISE EXCEPTION 'approved_estimate_is_immutable';
            END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER estimates_approved_immutable BEFORE UPDATE ON estimates
            FOR EACH ROW EXECUTE FUNCTION protect_approved_estimate();
    """)
    for table in ("job_cards", "estimates", "estimate_lines", "estimate_decisions", "job_events"):
        _scoped_table(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON job_cards, estimates, estimate_lines, estimate_decisions, job_events TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON job_cards, estimates, estimate_lines, estimate_decisions, job_events FROM workshopos_runtime")
    op.execute("DROP TRIGGER IF EXISTS estimate_lines_immutable ON estimate_lines")
    op.execute("DROP TRIGGER IF EXISTS estimates_approved_immutable ON estimates")
    op.execute("DROP FUNCTION IF EXISTS protect_approved_estimate_lines")
    op.execute("DROP FUNCTION IF EXISTS protect_approved_estimate")
    op.execute("DROP TABLE IF EXISTS job_events")
    op.execute("DROP TABLE IF EXISTS estimate_decisions")
    op.execute("DROP TABLE IF EXISTS estimate_lines")
    op.execute("DROP TABLE IF EXISTS estimates")
    op.execute("DROP TABLE IF EXISTS job_cards")
