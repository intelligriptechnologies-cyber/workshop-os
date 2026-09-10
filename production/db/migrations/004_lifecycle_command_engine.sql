BEGIN;

CREATE TABLE workshopos.lifecycle_resources (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('VISIT', 'JOB')),
  stage text NOT NULL CHECK (stage IN (
    'APPOINTMENT', 'CHECK_IN', 'INSPECTION', 'ESTIMATE', 'APPROVED', 'ACTIVE',
    'QC', 'BILLING', 'GATE_VERIFICATION', 'DELIVERED', 'CLOSED', 'CANCELLED'
  )),
  last_operational_stage text,
  resource_version bigint NOT NULL CHECK (resource_version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.lifecycle_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  resource_id uuid NOT NULL,
  from_stage text,
  to_stage text NOT NULL,
  actor_identity_id text NOT NULL,
  reason text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, resource_id)
    REFERENCES workshopos.lifecycle_resources(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.lifecycle_approvals (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  resource_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('job.cancel', 'job.reopen', 'closure.override')),
  target_stage text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  reason text NOT NULL CHECK (reason <> ''),
  evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'array'),
  overridden_blockers jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(overridden_blockers) = 'array'),
  maker_membership_id uuid NOT NULL,
  checker_membership_id uuid,
  status text NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  decision_reason text,
  created_at timestamptz NOT NULL,
  decided_at timestamptz,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, resource_id)
    REFERENCES workshopos.lifecycle_resources(tenant_id, branch_id, id),
  CHECK (checker_membership_id IS NULL OR checker_membership_id <> maker_membership_id)
);

CREATE TABLE workshopos.lifecycle_audit (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  resource_id uuid NOT NULL,
  audit_reference text NOT NULL,
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL,
  action text NOT NULL,
  old_stage text,
  new_stage text NOT NULL,
  request_id text,
  authentication jsonb NOT NULL CHECK (jsonb_typeof(authentication) = 'object'),
  reason text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  approval_id uuid,
  overridden_blockers jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(overridden_blockers) = 'array'),
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, resource_id)
    REFERENCES workshopos.lifecycle_resources(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.lifecycle_idempotency (
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (idempotency_key <> ''),
  command_fingerprint text NOT NULL,
  response_status integer NOT NULL,
  response_body jsonb NOT NULL,
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE OR REPLACE FUNCTION workshopos.reject_lifecycle_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'lifecycle history and audit ledgers are append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER lifecycle_history_append_only
BEFORE UPDATE OR DELETE ON workshopos.lifecycle_history
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_lifecycle_ledger_mutation();

CREATE TRIGGER lifecycle_audit_append_only
BEFORE UPDATE OR DELETE ON workshopos.lifecycle_audit
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_lifecycle_ledger_mutation();

ALTER TABLE workshopos.lifecycle_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_resources FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_approvals FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.lifecycle_idempotency FORCE ROW LEVEL SECURITY;

CREATE POLICY lifecycle_resources_tenant_isolation ON workshopos.lifecycle_resources
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY lifecycle_history_tenant_isolation ON workshopos.lifecycle_history
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY lifecycle_approvals_tenant_isolation ON workshopos.lifecycle_approvals
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY lifecycle_audit_tenant_isolation ON workshopos.lifecycle_audit
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY lifecycle_idempotency_tenant_isolation ON workshopos.lifecycle_idempotency
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

COMMIT;
