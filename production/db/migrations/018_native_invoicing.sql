BEGIN;

-- S18 projects only durable upstream readiness evidence. Application commands must lock the Job projection before drafting.
CREATE TABLE workshopos.billing_readiness_projection (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL,
  completion_event_type text CHECK (completion_event_type = 'S16_TASK_COMPLETION_READY'),
  material_event_type text CHECK (material_event_type = 'S15_MATERIAL_RECONCILED'),
  material_difference numeric(24,6) CHECK (material_difference IS NULL OR material_difference = 0),
  qc_event_type text CHECK (qc_event_type IN ('S16_QC_PASSED','S16_QC_OVERRIDDEN')),
  supplementary_scope_complete boolean NOT NULL DEFAULT false,
  invoice_authority text NOT NULL CHECK (invoice_authority IN ('WORKSHOPOS_NATIVE','TALLY_AUTHORITATIVE')),
  source_versions jsonb NOT NULL CHECK (jsonb_typeof(source_versions) = 'object'), projected_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, job_id, task_id)
);

CREATE TABLE workshopos.native_invoice (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, payer_id uuid NOT NULL,
  invoice_authority text NOT NULL CHECK (invoice_authority = 'WORKSHOPOS_NATIVE'),
  status text NOT NULL CHECK (status IN ('DRAFT','FINALIZED')),
  replaces_invoice_id uuid, document_number text, financial_year char(7), tenant_timezone text NOT NULL,
  currency char(3) NOT NULL CHECK (currency = 'INR'), supplier_gstin varchar(15) NOT NULL,
  supplier_state_code char(2) NOT NULL, place_of_supply_state_code char(2) NOT NULL,
  tax_treatment text NOT NULL CHECK (tax_treatment IN ('INTRASTATE','INTERSTATE')),
  tax_snapshot_id uuid NOT NULL, document_template_snapshot_id uuid NOT NULL,
  gross_minor bigint NOT NULL CHECK (gross_minor >= 0), discount_minor bigint NOT NULL CHECK (discount_minor >= 0),
  taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0), cgst_minor bigint NOT NULL CHECK (cgst_minor >= 0),
  sgst_minor bigint NOT NULL CHECK (sgst_minor >= 0), igst_minor bigint NOT NULL CHECK (igst_minor >= 0),
  rounding_adjustment_minor bigint NOT NULL DEFAULT 0, payable_minor bigint NOT NULL CHECK (payable_minor >= 0),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), drafted_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  drafted_at timestamptz NOT NULL, finalized_by_membership_id uuid REFERENCES workshopos.membership(id), finalized_at timestamptz,
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, document_number),
  FOREIGN KEY (tenant_id, branch_id, replaces_invoice_id) REFERENCES workshopos.native_invoice(tenant_id, branch_id, id),
  CHECK (discount_minor <= gross_minor), CHECK (taxable_minor = gross_minor - discount_minor),
  CHECK (payable_minor = taxable_minor + cgst_minor + sgst_minor + igst_minor + rounding_adjustment_minor),
  CHECK ((tax_treatment = 'INTRASTATE' AND igst_minor = 0) OR (tax_treatment = 'INTERSTATE' AND cgst_minor = 0 AND sgst_minor = 0)),
  CHECK ((status = 'DRAFT' AND document_number IS NULL AND financial_year IS NULL AND finalized_at IS NULL)
      OR (status = 'FINALIZED' AND document_number IS NOT NULL AND financial_year IS NOT NULL AND finalized_at IS NOT NULL))
);
CREATE UNIQUE INDEX native_invoice_one_final_per_job_payer
  ON workshopos.native_invoice (tenant_id, branch_id, job_id, payer_id) WHERE status = 'FINALIZED' AND replaces_invoice_id IS NULL;

-- Cancellation/reissue changes this serialized active pointer; the original finalized invoice itself never changes.
CREATE TABLE workshopos.native_invoice_payer_register (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, job_id uuid NOT NULL, payer_id uuid NOT NULL,
  active_invoice_id uuid, resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, job_id, payer_id),
  FOREIGN KEY (tenant_id, branch_id, active_invoice_id) REFERENCES workshopos.native_invoice(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.native_invoice_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, invoice_id uuid NOT NULL, source_estimate_line_id uuid NOT NULL,
  description text NOT NULL CHECK (btrim(description) <> ''), hsn_sac text NOT NULL CHECK (btrim(hsn_sac) <> ''),
  supply_type text NOT NULL CHECK (supply_type IN ('GOOD','SERVICE')), gst_rate_bps integer NOT NULL CHECK (gst_rate_bps BETWEEN 0 AND 10000),
  gross_minor bigint NOT NULL CHECK (gross_minor >= 0), discount_minor bigint NOT NULL CHECK (discount_minor >= 0),
  taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0), cgst_minor bigint NOT NULL CHECK (cgst_minor >= 0),
  sgst_minor bigint NOT NULL CHECK (sgst_minor >= 0), igst_minor bigint NOT NULL CHECK (igst_minor >= 0),
  total_minor bigint NOT NULL CHECK (total_minor >= 0), payer_id uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, invoice_id, source_estimate_line_id),
  UNIQUE (tenant_id, branch_id, source_estimate_line_id),
  FOREIGN KEY (tenant_id, branch_id, invoice_id) REFERENCES workshopos.native_invoice(tenant_id, branch_id, id),
  CHECK (discount_minor <= gross_minor), CHECK (taxable_minor = gross_minor - discount_minor),
  CHECK (total_minor = taxable_minor + cgst_minor + sgst_minor + igst_minor)
);

CREATE TABLE workshopos.native_invoice_adjustment (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, invoice_id uuid NOT NULL,
  adjustment_type text NOT NULL CHECK (adjustment_type IN ('CREDIT_NOTE','DEBIT_NOTE','CANCEL_REISSUE')),
  status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','FINALIZED','REJECTED')),
  reason text NOT NULL CHECK (btrim(reason) <> ''), taxable_minor bigint NOT NULL CHECK (taxable_minor > 0),
  tax_minor bigint NOT NULL CHECK (tax_minor >= 0), total_minor bigint NOT NULL CHECK (total_minor = taxable_minor + tax_minor),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), checker_membership_id uuid REFERENCES workshopos.membership(id),
  reauthenticated_at timestamptz, document_number text, financial_year char(7), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  requested_at timestamptz NOT NULL, finalized_at timestamptz, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, document_number),
  FOREIGN KEY (tenant_id, branch_id, invoice_id) REFERENCES workshopos.native_invoice(tenant_id, branch_id, id),
  CHECK (checker_membership_id IS NULL OR maker_membership_id <> checker_membership_id),
  CHECK ((status = 'APPROVAL_PENDING' AND checker_membership_id IS NULL AND document_number IS NULL)
      OR (status = 'FINALIZED' AND maker_membership_id <> checker_membership_id AND reauthenticated_at <= finalized_at AND document_number IS NOT NULL)
      OR status = 'REJECTED')
);

CREATE TABLE workshopos.native_invoice_adjustment_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, adjustment_id uuid NOT NULL, source_invoice_line_id uuid NOT NULL,
  taxable_adjustment_minor bigint NOT NULL CHECK (taxable_adjustment_minor > 0), gst_rate_bps integer NOT NULL CHECK (gst_rate_bps BETWEEN 0 AND 10000),
  tax_adjustment_minor bigint NOT NULL CHECK (tax_adjustment_minor >= 0), total_adjustment_minor bigint NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, adjustment_id, source_invoice_line_id),
  FOREIGN KEY (tenant_id, branch_id, adjustment_id) REFERENCES workshopos.native_invoice_adjustment(tenant_id, branch_id, id),
  CHECK (total_adjustment_minor = taxable_adjustment_minor + tax_adjustment_minor)
);

-- The document worker appends private rendering evidence; the API never exposes a public object URL.
CREATE TABLE workshopos.native_invoice_document (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, entity_type text NOT NULL CHECK (entity_type IN ('INVOICE','ADJUSTMENT')),
  entity_id uuid NOT NULL, render_format text NOT NULL CHECK (render_format IN ('PDF_A4','PDF_THERMAL')),
  private_object_ref text NOT NULL CHECK (private_object_ref LIKE 'private/%/finance/%'), checksum_sha256 char(64) NOT NULL,
  scan_status text NOT NULL CHECK (scan_status = 'CLEAN'), rendered_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, entity_type, entity_id, render_format)
);

CREATE TABLE workshopos.native_invoice_event_outbox (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('S18_INVOICE_FINALIZED','S18_INVOICE_ADJUSTED')),
  aggregate_id uuid NOT NULL, aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'), status text NOT NULL CHECK (status IN ('PENDING','CLAIMED','DELIVERED','FAILED')),
  occurred_at timestamptz NOT NULL, claimed_at timestamptz, delivered_at timestamptz, attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, event_type, aggregate_id, aggregate_version)
);

CREATE TABLE workshopos.native_invoice_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'), response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'), audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

CREATE FUNCTION workshopos.india_financial_year(p_instant timestamptz, tenant_timezone text) RETURNS char(7)
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE v_local timestamp := p_instant AT TIME ZONE tenant_timezone; v_year integer; financial_year char(7);
BEGIN
  v_year := EXTRACT(YEAR FROM v_local);
  IF EXTRACT(MONTH FROM v_local) <= 3 THEN v_year := v_year - 1; END IF;
  financial_year := format('%s-%s', v_year, lpad(((v_year + 1) % 100)::text, 2, '0'));
  RETURN financial_year;
END $$;

-- Caller holds one transaction for the lock, never-reused fiscal allocation, immutable final state, outbox, audit, and receipt.
CREATE FUNCTION workshopos.finalize_native_invoice(p_tenant_id uuid, p_branch_id uuid, p_invoice_id uuid, p_actor_membership_id uuid, p_finalized_at timestamptz)
RETURNS workshopos.native_invoice LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_invoice workshopos.native_invoice; v_financial_year char(7); v_number text;
BEGIN
  SELECT * INTO v_invoice FROM workshopos.native_invoice
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = p_invoice_id FOR UPDATE;
  IF NOT FOUND OR v_invoice.status <> 'DRAFT' THEN RAISE EXCEPTION 'draft invoice not found'; END IF;
  IF EXISTS (SELECT 1 FROM workshopos.billing_readiness_projection r WHERE r.tenant_id = p_tenant_id AND r.branch_id = p_branch_id
      AND r.job_id = v_invoice.job_id AND (r.completion_event_type IS NULL OR r.material_event_type IS NULL OR r.material_difference <> 0
      OR r.qc_event_type IS NULL OR NOT r.supplementary_scope_complete OR r.invoice_authority <> 'WORKSHOPOS_NATIVE'))
  THEN RAISE EXCEPTION 'billing readiness blocker remains'; END IF;
  v_financial_year := workshopos.india_financial_year(p_finalized_at, v_invoice.tenant_timezone);
  v_number := workshopos.allocate_document_number(p_tenant_id, p_branch_id, 'TAX_INVOICE', v_financial_year);
  UPDATE workshopos.native_invoice SET status = 'FINALIZED', document_number = v_number, financial_year = v_financial_year,
    finalized_by_membership_id = p_actor_membership_id, finalized_at = p_finalized_at, resource_version = resource_version + 1
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = p_invoice_id RETURNING * INTO v_invoice;
  RETURN v_invoice;
END $$;

CREATE FUNCTION workshopos.guard_native_invoice_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR OLD.status = 'FINALIZED' THEN
    RAISE EXCEPTION 'FINALIZED invoice is immutable; append a credit note, debit note, or approved cancellation/reissue';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER native_invoice_immutable BEFORE UPDATE OR DELETE ON workshopos.native_invoice FOR EACH ROW EXECUTE FUNCTION workshopos.guard_native_invoice_mutation();

CREATE FUNCTION workshopos.guard_native_adjustment_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR OLD.status <> 'APPROVAL_PENDING' OR NEW.status NOT IN ('FINALIZED','REJECTED') THEN
    RAISE EXCEPTION 'financial adjustment is append-only after its one approval decision';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER native_invoice_adjustment_immutable BEFORE UPDATE OR DELETE ON workshopos.native_invoice_adjustment FOR EACH ROW EXECUTE FUNCTION workshopos.guard_native_adjustment_mutation();

CREATE FUNCTION workshopos.reject_native_invoice_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; append a compensating finance record', TG_TABLE_NAME; END $$;
CREATE TRIGGER native_invoice_line_append_only BEFORE UPDATE OR DELETE ON workshopos.native_invoice_line FOR EACH ROW EXECUTE FUNCTION workshopos.reject_native_invoice_append_only_mutation();
CREATE TRIGGER native_invoice_adjustment_line_append_only BEFORE UPDATE OR DELETE ON workshopos.native_invoice_adjustment_line FOR EACH ROW EXECUTE FUNCTION workshopos.reject_native_invoice_append_only_mutation();
CREATE TRIGGER native_invoice_document_append_only BEFORE UPDATE OR DELETE ON workshopos.native_invoice_document FOR EACH ROW EXECUTE FUNCTION workshopos.reject_native_invoice_append_only_mutation();
CREATE TRIGGER native_invoice_event_outbox_append_only BEFORE UPDATE OR DELETE ON workshopos.native_invoice_event_outbox FOR EACH ROW EXECUTE FUNCTION workshopos.reject_native_invoice_append_only_mutation();
CREATE TRIGGER native_invoice_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.native_invoice_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_native_invoice_append_only_mutation();

ALTER TABLE workshopos.billing_readiness_projection ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.billing_readiness_projection FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_payer_register ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_payer_register FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_adjustment ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_adjustment FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_adjustment_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_adjustment_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_document ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_document FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_event_outbox ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_event_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.native_invoice_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.native_invoice_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY billing_readiness_projection_isolation ON workshopos.billing_readiness_projection USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_isolation ON workshopos.native_invoice USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_payer_register_isolation ON workshopos.native_invoice_payer_register USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_line_isolation ON workshopos.native_invoice_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_adjustment_isolation ON workshopos.native_invoice_adjustment USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_adjustment_line_isolation ON workshopos.native_invoice_adjustment_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_document_isolation ON workshopos.native_invoice_document USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_event_outbox_isolation ON workshopos.native_invoice_event_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY native_invoice_command_receipt_isolation ON workshopos.native_invoice_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
