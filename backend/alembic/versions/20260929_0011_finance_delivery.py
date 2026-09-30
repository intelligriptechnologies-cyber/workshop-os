"""Create RLS-backed immutable issued documents, payments, and handovers.

Revision ID: 20260929_0011
Revises: 20260929_0010
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0011"
down_revision = "20260929_0010"
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
        CREATE TABLE document_sequences (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            document_type text NOT NULL CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS')),
            fiscal_year text NOT NULL CHECK (fiscal_year ~ '^FY[0-9]{4}-[0-9]{2}$'),
            next_value integer NOT NULL CHECK (next_value > 0),
            PRIMARY KEY (tenant_id, branch_id, document_type, fiscal_year),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE financial_documents (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            document_type text NOT NULL CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS')),
            fiscal_year text NOT NULL,
            sequence_value integer NOT NULL CHECK (sequence_value > 0),
            document_no text NOT NULL,
            template_version text NOT NULL,
            snapshot jsonb NOT NULL,
            rendered_html text NOT NULL,
            artifact bytea NOT NULL CHECK (octet_length(artifact) > 0 AND octet_length(artifact) <= 10485760),
            content_type text NOT NULL DEFAULT 'text/html' CHECK (content_type IN ('text/html','application/pdf')),
            sha256 text NOT NULL CHECK (length(sha256) = 64),
            predecessor_document_id bigint REFERENCES financial_documents(id) ON DELETE RESTRICT,
            issued_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            issued_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, document_type, fiscal_year, sequence_value),
            UNIQUE (tenant_id, branch_id, document_no),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX financial_documents_job_idx ON financial_documents(tenant_id, branch_id, job_card_id, issued_at DESC);

        CREATE TABLE invoices (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            issued_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            replaces_invoice_id bigint REFERENCES invoices(id) ON DELETE RESTRICT,
            subtotal_paise bigint NOT NULL CHECK (subtotal_paise >= 0),
            discount_paise bigint NOT NULL CHECK (discount_paise >= 0),
            tax_paise bigint NOT NULL CHECK (tax_paise >= 0),
            total_paise bigint NOT NULL CHECK (total_paise >= 0),
            request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            UNIQUE (job_card_id, request_key),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX invoices_job_idx ON invoices(tenant_id, branch_id, job_card_id, created_at DESC);

        CREATE TABLE invoice_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            line_no integer NOT NULL CHECK (line_no > 0),
            description text NOT NULL CHECK (length(btrim(description)) > 0),
            quantity integer NOT NULL CHECK (quantity > 0),
            unit_amount_paise bigint NOT NULL CHECK (unit_amount_paise >= 0),
            gst_rate_bps integer NOT NULL CHECK (gst_rate_bps >= 0 AND gst_rate_bps <= 10000),
            taxable_paise bigint NOT NULL CHECK (taxable_paise >= 0),
            tax_paise bigint NOT NULL CHECK (tax_paise >= 0),
            total_paise bigint NOT NULL CHECK (total_paise >= 0),
            UNIQUE (invoice_id, line_no),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE payments (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            receipt_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            method text NOT NULL CHECK (method IN ('CASH','CARD','UPI','BANK_TRANSFER','OTHER')),
            reference text NOT NULL DEFAULT '',
            payer text NOT NULL DEFAULT '',
            supporting_filename text,
            supporting_content_type text CHECK (supporting_content_type IS NULL OR supporting_content_type IN ('image/jpeg','image/png','application/pdf')),
            supporting_artifact bytea CHECK (supporting_artifact IS NULL OR octet_length(supporting_artifact) <= 10485760),
            supporting_sha256 text CHECK (supporting_sha256 IS NULL OR length(supporting_sha256) = 64),
            received_at timestamptz NOT NULL,
            request_key text,
            received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (invoice_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX payments_invoice_idx ON payments(tenant_id, branch_id, invoice_id, created_at);

        CREATE TABLE delivery_acknowledgements (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL UNIQUE REFERENCES job_cards(id) ON DELETE RESTRICT,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            gate_pass_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            delivered_by text NOT NULL CHECK (length(btrim(delivered_by)) > 0),
            final_odometer integer NOT NULL CHECK (final_odometer >= 0),
            acknowledgement text NOT NULL CHECK (length(btrim(acknowledgement)) > 0),
            handover_at timestamptz NOT NULL DEFAULT now(),
            request_key text,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            UNIQUE (job_card_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE financial_document_events (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            document_id bigint NOT NULL REFERENCES financial_documents(id) ON DELETE RESTRICT,
            event_type text NOT NULL CHECK (event_type IN ('VOID','REPLACED')),
            reason text NOT NULL CHECK (length(btrim(reason)) > 0),
            related_document_id bigint REFERENCES financial_documents(id) ON DELETE RESTRICT,
            request_key text,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (document_id, event_type),
            UNIQUE (document_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX financial_document_events_document_idx ON financial_document_events(tenant_id, branch_id, document_id, created_at);

        CREATE FUNCTION immutable_financial_record() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'financial_record_is_immutable'; END $$;
        CREATE TRIGGER financial_documents_no_mutation BEFORE UPDATE OR DELETE ON financial_documents FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER invoices_no_mutation BEFORE UPDATE OR DELETE ON invoices FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER invoice_lines_no_mutation BEFORE UPDATE OR DELETE ON invoice_lines FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER payments_no_mutation BEFORE UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER delivery_acknowledgements_no_mutation BEFORE UPDATE OR DELETE ON delivery_acknowledgements FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER financial_document_events_no_mutation BEFORE UPDATE OR DELETE ON financial_document_events FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
    """)
    for table in ("document_sequences", "financial_documents", "invoices", "invoice_lines", "payments", "delivery_acknowledgements", "financial_document_events"):
        _scoped_table(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON document_sequences TO workshopos_runtime;
        GRANT SELECT, INSERT ON financial_documents, invoices, invoice_lines, payments,
            delivery_acknowledgements, financial_document_events TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON document_sequences FROM workshopos_runtime")
    op.execute("REVOKE SELECT, INSERT ON financial_documents, invoices, invoice_lines, payments, delivery_acknowledgements, financial_document_events FROM workshopos_runtime")
    for trigger, table in (
        ("financial_documents_no_mutation", "financial_documents"), ("invoices_no_mutation", "invoices"),
        ("invoice_lines_no_mutation", "invoice_lines"), ("payments_no_mutation", "payments"),
        ("delivery_acknowledgements_no_mutation", "delivery_acknowledgements"),
        ("financial_document_events_no_mutation", "financial_document_events"),
    ):
        op.execute(f"DROP TRIGGER IF EXISTS {trigger} ON {table}")
    op.execute("DROP FUNCTION IF EXISTS immutable_financial_record")
    for table in ("financial_document_events", "delivery_acknowledgements", "payments", "invoice_lines", "invoices", "financial_documents", "document_sequences"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
