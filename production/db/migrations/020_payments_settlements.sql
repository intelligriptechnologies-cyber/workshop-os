BEGIN;

CREATE TABLE workshopos.financial_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, event_kind text NOT NULL CHECK (event_kind IN ('ADVANCE_RECEIPT','PAYMENT_RECEIPT','ADVANCE_REVERSAL','PAYMENT_REVERSAL','REFUND','DISPUTE','CHARGEBACK')),
  original_financial_event_id uuid, customer_id uuid NOT NULL, visit_id uuid, job_id uuid, invoice_id uuid, payer_id uuid,
  currency char(3) NOT NULL CHECK (currency = 'INR'), amount_minor bigint NOT NULL CHECK (amount_minor > 0), liability_minor bigint CHECK (liability_minor >= 0),
  payment_mode text NOT NULL, external_reference text NOT NULL CHECK (btrim(external_reference) <> ''), evidence_ref text NOT NULL,
  reason text, occurred_at timestamptz NOT NULL, actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, external_reference),
  FOREIGN KEY (tenant_id, branch_id, original_financial_event_id) REFERENCES workshopos.financial_event(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.cashfree_payment_link (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, invoice_id uuid NOT NULL, customer_id uuid NOT NULL,
  currency char(3) NOT NULL CHECK (currency = 'INR'), amount_minor bigint NOT NULL CHECK (amount_minor > 0), expires_at timestamptz NOT NULL,
  provider_link_id text, provider_status text NOT NULL, resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, provider_link_id)
);

CREATE TABLE workshopos.cashfree_webhook_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, provider_event_id text NOT NULL, payment_link_id uuid NOT NULL,
  raw_body bytea NOT NULL, raw_body_sha256 char(64) NOT NULL CHECK (raw_body_sha256 ~ '^[0-9a-f]{64}$'), signature text NOT NULL,
  signature_verified boolean NOT NULL CHECK (signature_verified), received_at timestamptz NOT NULL, processed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, provider_event_id),
  FOREIGN KEY (tenant_id, branch_id, payment_link_id) REFERENCES workshopos.cashfree_payment_link(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.customer_credit_policy (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, customer_id uuid NOT NULL, currency char(3) NOT NULL CHECK (currency = 'INR'),
  limit_minor bigint NOT NULL CHECK (limit_minor >= 0), outstanding_exposure_minor bigint NOT NULL CHECK (outstanding_exposure_minor >= 0),
  terms_days integer NOT NULL CHECK (terms_days >= 0), approved_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), approved_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, customer_id), CHECK (outstanding_exposure_minor <= limit_minor)
);

CREATE TABLE workshopos.credit_exception (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, customer_id uuid NOT NULL, invoice_id uuid NOT NULL,
  currency char(3) NOT NULL CHECK (currency = 'INR'), amount_minor bigint NOT NULL CHECK (amount_minor > 0), reason text NOT NULL CHECK (btrim(reason) <> ''),
  status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')), maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  checker_membership_id uuid REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), CHECK (checker_membership_id IS NULL OR checker_membership_id <> maker_membership_id)
);

CREATE TABLE workshopos.payment_correction (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, original_financial_event_id uuid NOT NULL,
  correction_kind text NOT NULL CHECK (correction_kind IN ('ADVANCE_REVERSAL','PAYMENT_REVERSAL','REFUND','DISPUTE','CHARGEBACK')),
  currency char(3) NOT NULL CHECK (currency = 'INR'), amount_minor bigint NOT NULL CHECK (amount_minor > 0), reason text NOT NULL CHECK (btrim(reason) <> ''), evidence_ref text NOT NULL,
  status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')), maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), checker_membership_id uuid REFERENCES workshopos.membership(id),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), FOREIGN KEY (tenant_id, branch_id, original_financial_event_id) REFERENCES workshopos.financial_event(tenant_id, branch_id, id),
  CHECK (checker_membership_id IS NULL OR checker_membership_id <> maker_membership_id)
);

CREATE TABLE workshopos.payment_settlement (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, provider text NOT NULL, settlement_reference text NOT NULL,
  currency char(3) NOT NULL CHECK (currency = 'INR'), gross_minor bigint NOT NULL CHECK (gross_minor >= 0), fees_minor bigint NOT NULL CHECK (fees_minor >= 0),
  tax_minor bigint NOT NULL CHECK (tax_minor >= 0), refunds_minor bigint NOT NULL CHECK (refunds_minor >= 0), chargebacks_minor bigint NOT NULL CHECK (chargebacks_minor >= 0),
  expected_net_minor bigint NOT NULL, bank_net_minor bigint NOT NULL, reconciliation_status text NOT NULL CHECK (reconciliation_status IN ('MATCHED','UNRESOLVED')),
  entries jsonb NOT NULL CHECK (jsonb_typeof(entries) = 'array'), issues jsonb NOT NULL CHECK (jsonb_typeof(issues) = 'array'), reconciled_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, provider, settlement_reference),
  CHECK (expected_net_minor = gross_minor - fees_minor - tax_minor - refunds_minor - chargebacks_minor)
);

CREATE TABLE workshopos.payment_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'), response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'), audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE workshopos.payment_worker_effect (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, effect_key text NOT NULL CHECK (btrim(effect_key) <> ''), effect_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING','CLAIMED','RETRY_WAIT','DELIVERED','DEAD_LETTER')), attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  available_at timestamptz NOT NULL, claimed_at timestamptz, delivered_at timestamptz, last_error text, resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, effect_key)
);

CREATE FUNCTION workshopos.lock_payment_invoice(p_tenant_id uuid, p_branch_id uuid, p_invoice_id uuid) RETURNS void LANGUAGE plpgsql VOLATILE AS $$
BEGIN PERFORM pg_advisory_xact_lock(hashtextextended(p_tenant_id::text || ':' || p_branch_id::text || ':' || p_invoice_id::text, 0)); END $$;

CREATE FUNCTION workshopos.claim_payment_worker_effect(p_tenant_id uuid, p_branch_ids uuid[], p_now timestamptz)
RETURNS SETOF workshopos.payment_worker_effect LANGUAGE plpgsql VOLATILE AS $$
BEGIN
  RETURN QUERY UPDATE workshopos.payment_worker_effect e SET status = 'CLAIMED', claimed_at = p_now, resource_version = resource_version + 1
  WHERE (e.tenant_id, e.branch_id, e.id) IN (SELECT tenant_id, branch_id, id FROM workshopos.payment_worker_effect
    WHERE tenant_id = p_tenant_id AND branch_id = ANY(p_branch_ids) AND status IN ('PENDING','RETRY_WAIT') AND available_at <= p_now
    ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT 25) RETURNING e.*;
END $$;

CREATE FUNCTION workshopos.reject_payment_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; append a compensating financial event', TG_TABLE_NAME; END $$;
CREATE TRIGGER financial_event_append_only BEFORE UPDATE OR DELETE ON workshopos.financial_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_payment_append_only_mutation();
CREATE TRIGGER cashfree_webhook_append_only BEFORE UPDATE OR DELETE ON workshopos.cashfree_webhook_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_payment_append_only_mutation();
CREATE TRIGGER payment_settlement_append_only BEFORE UPDATE OR DELETE ON workshopos.payment_settlement FOR EACH ROW EXECUTE FUNCTION workshopos.reject_payment_append_only_mutation();
CREATE TRIGGER payment_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.payment_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_payment_append_only_mutation();

ALTER TABLE workshopos.financial_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.financial_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.cashfree_payment_link ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.cashfree_payment_link FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.cashfree_webhook_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.cashfree_webhook_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_credit_policy ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.customer_credit_policy FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.credit_exception ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.credit_exception FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.payment_correction ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.payment_correction FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.payment_settlement ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.payment_settlement FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.payment_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.payment_command_receipt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.payment_worker_effect ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.payment_worker_effect FORCE ROW LEVEL SECURITY;

CREATE POLICY financial_event_isolation ON workshopos.financial_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY cashfree_payment_link_isolation ON workshopos.cashfree_payment_link USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY cashfree_webhook_evidence_isolation ON workshopos.cashfree_webhook_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY customer_credit_policy_isolation ON workshopos.customer_credit_policy USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY credit_exception_isolation ON workshopos.credit_exception USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY payment_correction_isolation ON workshopos.payment_correction USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY payment_settlement_isolation ON workshopos.payment_settlement USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY payment_command_receipt_isolation ON workshopos.payment_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY payment_worker_effect_isolation ON workshopos.payment_worker_effect USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
