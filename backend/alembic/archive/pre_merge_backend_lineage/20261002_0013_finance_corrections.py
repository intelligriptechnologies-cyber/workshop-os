"""Add immutable post-payment credit notes, refunds, and invoice claims.

Revision ID: 20261002_0013
Revises: 20260929_0012
"""

from alembic import op


revision = "20261002_0013"
down_revision = "20261001_0006"
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
    op.execute("ALTER TABLE document_sequences DROP CONSTRAINT document_sequences_document_type_check")
    op.execute("ALTER TABLE document_sequences ADD CONSTRAINT document_sequences_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS','CREDIT_NOTE'))")
    op.execute("ALTER TABLE financial_documents DROP CONSTRAINT financial_documents_document_type_check")
    op.execute("ALTER TABLE financial_documents ADD CONSTRAINT financial_documents_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS','CREDIT_NOTE'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_event_type_check")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_event_type_check CHECK (event_type IN ('VOID','REPLACED','CREDITED'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_document_id_event_type_key")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_correction_link_key UNIQUE (document_id,event_type,related_document_id)")
    op.execute("""
        CREATE TABLE active_invoice_claims (
            job_card_id bigint PRIMARY KEY REFERENCES job_cards(id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        INSERT INTO active_invoice_claims (job_card_id,tenant_id,branch_id,invoice_id)
        SELECT DISTINCT ON (invoice.job_card_id) invoice.job_card_id,invoice.tenant_id,invoice.branch_id,invoice.id FROM invoices invoice
        WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=invoice.issued_document_id AND event.event_type='VOID')
        ORDER BY invoice.job_card_id,invoice.created_at DESC,invoice.id DESC;

        CREATE TABLE credit_notes (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            issued_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            reason text NOT NULL CHECK (btrim(reason) <> ''), request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (invoice_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX credit_notes_invoice_idx ON credit_notes (tenant_id, branch_id, invoice_id, created_at);
        CREATE TABLE refunds (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            credit_note_id bigint NOT NULL REFERENCES credit_notes(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            method text NOT NULL CHECK (method IN ('CASH','CARD','UPI','BANK_TRANSFER','OTHER')),
            reference text NOT NULL DEFAULT '', request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (credit_note_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX refunds_credit_note_idx ON refunds (tenant_id, branch_id, credit_note_id, created_at);
        CREATE FUNCTION immutable_finance_correction() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'finance_correction_is_immutable'; END $$;
        CREATE TRIGGER credit_notes_no_mutation BEFORE UPDATE OR DELETE ON credit_notes FOR EACH ROW EXECUTE FUNCTION immutable_finance_correction();
        CREATE TRIGGER refunds_no_mutation BEFORE UPDATE OR DELETE ON refunds FOR EACH ROW EXECUTE FUNCTION immutable_finance_correction();
    """)
    for table in ("active_invoice_claims", "credit_notes", "refunds"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, DELETE ON active_invoice_claims TO workshopos_runtime;
        GRANT SELECT, INSERT ON credit_notes, refunds TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("""DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM financial_documents WHERE document_type = 'CREDIT_NOTE')
           OR EXISTS (SELECT 1 FROM financial_document_events WHERE event_type = 'CREDITED') THEN
            RAISE EXCEPTION 'cannot downgrade finance corrections after issued credit records exist';
        END IF;
    END $$;""")
    op.execute("DROP TABLE IF EXISTS refunds, credit_notes, active_invoice_claims CASCADE")
    op.execute("DROP FUNCTION IF EXISTS immutable_finance_correction")
    op.execute("ALTER TABLE financial_documents DROP CONSTRAINT financial_documents_document_type_check")
    op.execute("ALTER TABLE financial_documents ADD CONSTRAINT financial_documents_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_event_type_check")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_event_type_check CHECK (event_type IN ('VOID','REPLACED'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_correction_link_key")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_document_id_event_type_key UNIQUE (document_id,event_type)")
    op.execute("ALTER TABLE document_sequences DROP CONSTRAINT document_sequences_document_type_check")
    op.execute("ALTER TABLE document_sequences ADD CONSTRAINT document_sequences_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS'))")
