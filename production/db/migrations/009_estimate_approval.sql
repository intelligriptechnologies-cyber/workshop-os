BEGIN;

CREATE TABLE workshopos.estimate_stream (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  job_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('PRIMARY', 'SUPPLEMENTARY')),
  scope_handoff_id uuid NOT NULL,
  base_approved_estimate_version_id uuid,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, scope_handoff_id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.estimate_version (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  estimate_stream_id uuid NOT NULL,
  revision bigint NOT NULL CHECK (revision > 0),
  prior_version_id uuid,
  configuration_version_id text NOT NULL,
  document_number text,
  financial_year char(7),
  status text NOT NULL CHECK (status IN ('DRAFT', 'SENT', 'APPROVED', 'PARTIALLY_APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED')),
  totals jsonb NOT NULL CHECK (jsonb_typeof(totals) = 'object'),
  payer_totals jsonb NOT NULL CHECK (jsonb_typeof(payer_totals) = 'array'),
  resource_version bigint NOT NULL CHECK (resource_version > 0),
  valid_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, estimate_stream_id, revision),
  UNIQUE (tenant_id, branch_id, document_number),
  FOREIGN KEY (tenant_id, branch_id, estimate_stream_id)
    REFERENCES workshopos.estimate_stream(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_line (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  estimate_version_id uuid NOT NULL,
  id uuid NOT NULL,
  configuration_line_id text NOT NULL,
  scope_code text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('SERVICE', 'PACKAGE', 'MATERIAL', 'LABOUR')),
  quantity numeric(28, 8) NOT NULL CHECK (quantity > 0),
  unit_price_minor bigint NOT NULL CHECK (unit_price_minor >= 0),
  discount_minor bigint NOT NULL CHECK (discount_minor >= 0),
  tax_rate_bps integer NOT NULL CHECK (tax_rate_bps BETWEEN 0 AND 10000),
  total_minor bigint NOT NULL CHECK (total_minor >= 0),
  partial_approval_allowed boolean NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, estimate_version_id, id),
  FOREIGN KEY (tenant_id, branch_id, estimate_version_id)
    REFERENCES workshopos.estimate_version(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_payer_allocation (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  estimate_version_id uuid NOT NULL,
  estimate_line_id uuid NOT NULL,
  payer_id uuid NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  PRIMARY KEY (tenant_id, branch_id, estimate_version_id, estimate_line_id, payer_id),
  FOREIGN KEY (tenant_id, branch_id, estimate_version_id, estimate_line_id)
    REFERENCES workshopos.estimate_line(tenant_id, branch_id, estimate_version_id, id)
);

CREATE TABLE workshopos.estimate_action_token (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  estimate_version_id uuid NOT NULL,
  token_digest text NOT NULL UNIQUE,
  purpose text NOT NULL CHECK (purpose = 'ESTIMATE_ACTION'),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, estimate_version_id)
    REFERENCES workshopos.estimate_version(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_approval_outcome (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  estimate_version_id uuid NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('APPROVE_ALL', 'APPROVE_PARTIAL', 'REJECT', 'CLARIFY')),
  selected_line_ids jsonb NOT NULL CHECK (jsonb_typeof(selected_line_ids) = 'array'),
  source text NOT NULL CHECK (source IN ('PUBLIC_LINK', 'MANUAL')),
  evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'object'),
  checker_membership_id uuid,
  receipt_reference text NOT NULL,
  recorded_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, estimate_version_id),
  FOREIGN KEY (tenant_id, branch_id, estimate_version_id)
    REFERENCES workshopos.estimate_version(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_scope_activation (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  estimate_version_id uuid NOT NULL,
  job_id uuid NOT NULL,
  approval_outcome_id uuid NOT NULL,
  approved_line_ids jsonb NOT NULL CHECK (jsonb_typeof(approved_line_ids) = 'array'),
  configuration_snapshot jsonb NOT NULL CHECK (
    configuration_snapshot ?& ARRAY['PRICE', 'TAX', 'WORKFLOW', 'RECIPE', 'CHECKLIST', 'POLICY']
  ),
  activated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, estimate_version_id),
  FOREIGN KEY (tenant_id, branch_id, estimate_version_id)
    REFERENCES workshopos.estimate_version(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, approval_outcome_id)
    REFERENCES workshopos.estimate_approval_outcome(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_manual_outcome_request (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  estimate_version_id uuid NOT NULL,
  outcome text NOT NULL,
  selected_line_ids jsonb NOT NULL CHECK (jsonb_typeof(selected_line_ids) = 'array'),
  evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'object'),
  maker_membership_id uuid NOT NULL,
  checker_membership_id uuid,
  status text NOT NULL CHECK (status IN ('PENDING_CHECK', 'APPROVED', 'REJECTED')),
  decision_reason text,
  created_at timestamptz NOT NULL,
  decided_at timestamptz,
  PRIMARY KEY (tenant_id, branch_id, id),
  CHECK (checker_membership_id IS NULL OR checker_membership_id <> maker_membership_id),
  FOREIGN KEY (tenant_id, branch_id, estimate_version_id)
    REFERENCES workshopos.estimate_version(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_outbox (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  activation_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('APPROVED_SCOPE_WORK_PLANNING', 'APPROVED_SCOPE_MATERIAL_CONTROL')),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  dispatched_at timestamptz,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, activation_id, event_type),
  FOREIGN KEY (tenant_id, branch_id, activation_id)
    REFERENCES workshopos.estimate_scope_activation(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.estimate_idempotency (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (idempotency_key <> ''),
  command_fingerprint text NOT NULL,
  response_status integer NOT NULL,
  response_body jsonb NOT NULL,
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, idempotency_key)
);

CREATE OR REPLACE FUNCTION workshopos.reject_estimate_evidence_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'estimate approval evidence and activation records are immutable'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER estimate_approval_outcome_append_only
BEFORE UPDATE OR DELETE ON workshopos.estimate_approval_outcome
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_estimate_evidence_mutation();
CREATE TRIGGER estimate_scope_activation_append_only
BEFORE UPDATE OR DELETE ON workshopos.estimate_scope_activation
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_estimate_evidence_mutation();
CREATE TRIGGER estimate_outbox_append_only
BEFORE UPDATE OR DELETE ON workshopos.estimate_outbox
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_estimate_evidence_mutation();

CREATE OR REPLACE FUNCTION workshopos.reject_final_estimate_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status <> 'DRAFT' THEN
    RAISE EXCEPTION 'sent and decided estimate versions are immutable'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER final_estimate_version_immutable
BEFORE UPDATE OR DELETE ON workshopos.estimate_version
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_final_estimate_mutation();

ALTER TABLE workshopos.estimate_stream ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_stream FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_version FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_line ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_payer_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_payer_allocation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_action_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_action_token FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_approval_outcome ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_approval_outcome FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_scope_activation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_scope_activation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_manual_outcome_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_manual_outcome_request FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.estimate_idempotency FORCE ROW LEVEL SECURITY;

CREATE POLICY estimate_stream_tenant_isolation ON workshopos.estimate_stream USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_version_tenant_isolation ON workshopos.estimate_version USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_line_tenant_isolation ON workshopos.estimate_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_payer_allocation_tenant_isolation ON workshopos.estimate_payer_allocation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_action_token_tenant_isolation ON workshopos.estimate_action_token USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_approval_outcome_tenant_isolation ON workshopos.estimate_approval_outcome USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_scope_activation_tenant_isolation ON workshopos.estimate_scope_activation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_manual_outcome_request_tenant_isolation ON workshopos.estimate_manual_outcome_request USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_outbox_tenant_isolation ON workshopos.estimate_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY estimate_idempotency_tenant_isolation ON workshopos.estimate_idempotency USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

COMMIT;
