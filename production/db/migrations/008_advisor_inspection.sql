BEGIN;

CREATE TABLE workshopos.advisor_job_accountability (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  advisor_identity_id text NOT NULL CHECK (btrim(advisor_identity_id) <> ''),
  promised_delivery_at timestamptz,
  projected_ready_at timestamptz,
  promised_delivery_risk text NOT NULL DEFAULT 'NOT_SET' CHECK (promised_delivery_risk IN ('NOT_SET', 'ON_TRACK', 'AT_RISK', 'OVERDUE')),
  last_inspection_id uuid,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, job_id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.advisor_action_queue (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  id uuid NOT NULL,
  owner_identity_id text NOT NULL CHECK (btrim(owner_identity_id) <> ''),
  action_kind text NOT NULL DEFAULT 'ADVISOR_JOB' CHECK (action_kind = 'ADVISOR_JOB'),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status = 'OPEN'),
  next_action text NOT NULL CHECK (btrim(next_action) <> ''),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, job_id),
  UNIQUE (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.advisor_job_accountability(tenant_id, branch_id, job_id)
);

CREATE TABLE workshopos.advisor_ownership_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  from_advisor_identity_id text NOT NULL CHECK (btrim(from_advisor_identity_id) <> ''),
  to_advisor_identity_id text NOT NULL CHECK (btrim(to_advisor_identity_id) <> ''),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  actor_identity_id text NOT NULL CHECK (btrim(actor_identity_id) <> ''),
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  changed_at timestamptz NOT NULL,
  audit_reference text NOT NULL CHECK (btrim(audit_reference) <> ''),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.advisor_job_accountability(tenant_id, branch_id, job_id),
  CHECK (from_advisor_identity_id <> to_advisor_identity_id)
);

CREATE TABLE workshopos.advisor_inspection (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  advisor_identity_id text NOT NULL CHECK (btrim(advisor_identity_id) <> ''),
  configuration_master_id uuid NOT NULL,
  configuration_version bigint NOT NULL CHECK (configuration_version > 0),
  free_text_findings text NOT NULL CHECK (btrim(free_text_findings) <> ''),
  customer_notes text,
  internal_notes text,
  recorded_at timestamptz NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version = 1),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.advisor_job_accountability(tenant_id, branch_id, job_id),
  FOREIGN KEY (tenant_id, branch_id, configuration_master_id, configuration_version)
    REFERENCES workshopos.configuration_master_version(tenant_id, branch_id, master_id, version),
  CHECK (customer_notes IS NULL OR btrim(customer_notes) <> ''),
  CHECK (internal_notes IS NULL OR btrim(internal_notes) <> '')
);

CREATE TABLE workshopos.advisor_inspection_finding (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  inspection_id uuid NOT NULL,
  field_id text NOT NULL CHECK (btrim(field_id) <> ''),
  field_label text NOT NULL CHECK (btrim(field_label) <> ''),
  field_kind text NOT NULL CHECK (field_kind IN ('TEXT', 'BOOLEAN', 'DECIMAL', 'CHOICE')),
  finding_value jsonb NOT NULL,
  result text NOT NULL CHECK (result IN ('OK', 'ATTENTION', 'CRITICAL', 'NOT_APPLICABLE')),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, inspection_id, field_id),
  FOREIGN KEY (tenant_id, branch_id, inspection_id) REFERENCES workshopos.advisor_inspection(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.advisor_inspection_evidence (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  inspection_id uuid NOT NULL,
  evidence_kind text NOT NULL CHECK (btrim(evidence_kind) <> ''),
  object_key text NOT NULL CHECK (object_key LIKE 'private/%'),
  checksum_sha256 text NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-fA-F]{64}$'),
  scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  recorded_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, inspection_id, evidence_kind, object_key),
  FOREIGN KEY (tenant_id, branch_id, inspection_id) REFERENCES workshopos.advisor_inspection(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.advisor_recommended_scope (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  inspection_id uuid NOT NULL,
  scope_code text NOT NULL CHECK (btrim(scope_code) <> ''),
  description text NOT NULL CHECK (btrim(description) <> ''),
  source_field_ids text[] NOT NULL CHECK (cardinality(source_field_ids) > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, inspection_id, scope_code),
  FOREIGN KEY (tenant_id, branch_id, inspection_id) REFERENCES workshopos.advisor_inspection(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.advisor_scope_handoff_outbox (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  inspection_id uuid NOT NULL,
  job_version bigint NOT NULL CHECK (job_version > 0),
  event_type text NOT NULL DEFAULT 'ADVISOR_SCOPE_RECOMMENDED' CHECK (event_type = 'ADVISOR_SCOPE_RECOMMENDED'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  occurred_at timestamptz NOT NULL,
  audit_reference text NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, inspection_id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.advisor_job_accountability(tenant_id, branch_id, job_id),
  FOREIGN KEY (tenant_id, branch_id, inspection_id) REFERENCES workshopos.advisor_inspection(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.advisor_follow_up (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  owner_identity_id text NOT NULL CHECK (btrim(owner_identity_id) <> ''),
  description text NOT NULL CHECK (btrim(description) <> ''),
  due_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'COMPLETED')),
  outcome text,
  completed_at timestamptz,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.advisor_job_accountability(tenant_id, branch_id, job_id),
  CHECK ((status = 'OPEN' AND outcome IS NULL AND completed_at IS NULL)
      OR (status = 'COMPLETED' AND btrim(outcome) <> '' AND completed_at IS NOT NULL))
);

CREATE TABLE workshopos.advisor_follow_up_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  follow_up_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('CREATED', 'COMPLETED')),
  owner_identity_id text NOT NULL,
  due_at timestamptz NOT NULL,
  outcome text,
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  occurred_at timestamptz NOT NULL,
  audit_reference text NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, follow_up_id) REFERENCES workshopos.advisor_follow_up(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.advisor_promised_delivery_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  job_id uuid NOT NULL,
  previous_promised_delivery_at timestamptz,
  promised_delivery_at timestamptz NOT NULL,
  projected_ready_at timestamptz NOT NULL,
  risk text NOT NULL CHECK (risk IN ('ON_TRACK', 'AT_RISK', 'OVERDUE')),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  changed_at timestamptz NOT NULL,
  audit_reference text NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.advisor_job_accountability(tenant_id, branch_id, job_id)
);

CREATE TABLE workshopos.advisor_audit (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('ADVISOR_JOB', 'INSPECTION', 'FOLLOW_UP', 'PROMISED_DELIVERY')),
  resource_id uuid NOT NULL,
  action text NOT NULL CHECK (btrim(action) <> ''),
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  request_id text,
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference)
);

CREATE TABLE workshopos.advisor_idempotency (
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  command_fingerprint text NOT NULL CHECK (btrim(command_fingerprint) <> ''),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, idempotency_key)
);

-- Existing S07 Jobs are backfilled, while the trigger makes the handoff atomic for all future check-ins.
INSERT INTO workshopos.advisor_job_accountability (tenant_id, branch_id, job_id, advisor_identity_id, resource_version)
SELECT tenant_id, branch_id, id, advisor_identity_id, resource_version FROM workshopos.reception_job_card;
INSERT INTO workshopos.advisor_action_queue (tenant_id, branch_id, job_id, id, owner_identity_id, next_action, resource_version)
SELECT tenant_id, branch_id, job_id, job_id, advisor_identity_id, 'Inspect vehicle and recommend scope', 1
FROM workshopos.advisor_job_accountability;

CREATE FUNCTION workshopos.initialize_advisor_accountability() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO workshopos.advisor_job_accountability (tenant_id, branch_id, job_id, advisor_identity_id, resource_version)
  VALUES (NEW.tenant_id, NEW.branch_id, NEW.id, NEW.advisor_identity_id, NEW.resource_version);
  INSERT INTO workshopos.advisor_action_queue (tenant_id, branch_id, job_id, id, owner_identity_id, next_action, resource_version)
  VALUES (NEW.tenant_id, NEW.branch_id, NEW.id, NEW.id, NEW.advisor_identity_id, 'Inspect vehicle and recommend scope', 1);
  RETURN NEW;
END $$;
CREATE TRIGGER reception_job_advisor_accountability
AFTER INSERT ON workshopos.reception_job_card FOR EACH ROW EXECUTE FUNCTION workshopos.initialize_advisor_accountability();

-- Ownership and both affected queues move in one statement-level transaction with a version guard.
CREATE FUNCTION workshopos.reassign_advisor_job(
  p_branch_id uuid, p_job_id uuid, p_expected_version bigint, p_new_advisor_identity_id text,
  p_reason text, p_history_id uuid, p_audit_id uuid, p_audit_reference text,
  p_actor_identity_id text, p_membership_id uuid, p_request_id text,
  p_changed_at timestamptz, p_idempotency_key text, p_command_fingerprint text
) RETURNS TABLE (job_id uuid, resource_version bigint, audit_reference text)
LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE
  v_tenant_id uuid := workshopos.current_tenant_id();
  v_old_advisor_identity_id text;
  v_next_version bigint;
BEGIN
  IF NOT p_branch_id = ANY (workshopos.authorized_branch_ids()) THEN
    RAISE EXCEPTION 'BRANCH_FORBIDDEN' USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF btrim(p_reason) = '' OR btrim(p_new_advisor_identity_id) = '' THEN
    RAISE EXCEPTION 'INVALID_REASSIGNMENT' USING ERRCODE = 'check_violation';
  END IF;

  SELECT advisor_identity_id INTO v_old_advisor_identity_id
  FROM workshopos.advisor_job_accountability
  WHERE tenant_id = v_tenant_id AND branch_id = p_branch_id AND job_id = p_job_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'JOB_NOT_FOUND' USING ERRCODE = 'no_data_found'; END IF;
  IF v_old_advisor_identity_id = p_new_advisor_identity_id THEN
    RAISE EXCEPTION 'INVALID_REASSIGNMENT' USING ERRCODE = 'check_violation';
  END IF;

  UPDATE workshopos.advisor_job_accountability
  SET advisor_identity_id = p_new_advisor_identity_id, resource_version = resource_version + 1
  WHERE tenant_id = v_tenant_id AND branch_id = p_branch_id AND job_id = p_job_id
    AND resource_version = p_expected_version
  RETURNING advisor_job_accountability.resource_version INTO v_next_version;
  IF NOT FOUND THEN RAISE EXCEPTION 'RESOURCE_VERSION_MISMATCH' USING ERRCODE = 'serialization_failure'; END IF;

  UPDATE workshopos.advisor_action_queue
  SET owner_identity_id = p_new_advisor_identity_id, resource_version = resource_version + 1
  WHERE tenant_id = v_tenant_id AND branch_id = p_branch_id AND advisor_action_queue.job_id = p_job_id;

  INSERT INTO workshopos.advisor_ownership_history (
    id, tenant_id, branch_id, job_id, from_advisor_identity_id, to_advisor_identity_id,
    reason, actor_identity_id, membership_id, changed_at, audit_reference
  ) VALUES (p_history_id, v_tenant_id, p_branch_id, p_job_id, v_old_advisor_identity_id,
    p_new_advisor_identity_id, p_reason, p_actor_identity_id, p_membership_id, p_changed_at, p_audit_reference);
  INSERT INTO workshopos.advisor_audit (
    id, tenant_id, branch_id, resource_type, resource_id, action, actor_identity_id,
    membership_id, request_id, audit_reference, occurred_at
  ) VALUES (p_audit_id, v_tenant_id, p_branch_id, 'ADVISOR_JOB', p_job_id, 'advisor-job.reassigned',
    p_actor_identity_id, p_membership_id, p_request_id, p_audit_reference, p_changed_at);
  INSERT INTO workshopos.advisor_idempotency (tenant_id, idempotency_key, command_fingerprint, response_status, response_body)
  VALUES (v_tenant_id, p_idempotency_key, p_command_fingerprint, 200,
    jsonb_build_object('jobId', p_job_id, 'resourceVersion', v_next_version, 'auditReference', p_audit_reference));
  RETURN QUERY SELECT p_job_id, v_next_version, p_audit_reference;
END $$;

CREATE OR REPLACE FUNCTION workshopos.reject_advisor_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'advisor ownership, inspection, evidence, scope handoff, follow-up, promised delivery, and audit history are append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER advisor_ownership_history_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_ownership_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_inspection_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_inspection FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_inspection_finding_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_inspection_finding FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_inspection_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_inspection_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_recommended_scope_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_recommended_scope FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_scope_handoff_outbox_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_scope_handoff_outbox FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_follow_up_history_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_follow_up_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_promised_delivery_history_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_promised_delivery_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();
CREATE TRIGGER advisor_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.advisor_audit FOR EACH ROW EXECUTE FUNCTION workshopos.reject_advisor_ledger_mutation();

ALTER TABLE workshopos.advisor_job_accountability ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_job_accountability FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_action_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_action_queue FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_ownership_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_ownership_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_inspection ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_inspection FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_inspection_finding ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_inspection_finding FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_inspection_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_inspection_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_recommended_scope ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_recommended_scope FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_scope_handoff_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_scope_handoff_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_follow_up ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_follow_up FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_follow_up_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_follow_up_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_promised_delivery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_promised_delivery_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.advisor_idempotency FORCE ROW LEVEL SECURITY;

CREATE POLICY advisor_job_accountability_tenant_isolation ON workshopos.advisor_job_accountability USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_action_queue_tenant_isolation ON workshopos.advisor_action_queue USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_ownership_history_tenant_isolation ON workshopos.advisor_ownership_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_inspection_tenant_isolation ON workshopos.advisor_inspection USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_inspection_finding_tenant_isolation ON workshopos.advisor_inspection_finding USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_inspection_evidence_tenant_isolation ON workshopos.advisor_inspection_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_recommended_scope_tenant_isolation ON workshopos.advisor_recommended_scope USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_scope_handoff_outbox_tenant_isolation ON workshopos.advisor_scope_handoff_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_follow_up_tenant_isolation ON workshopos.advisor_follow_up USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_follow_up_history_tenant_isolation ON workshopos.advisor_follow_up_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_promised_delivery_history_tenant_isolation ON workshopos.advisor_promised_delivery_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_audit_tenant_isolation ON workshopos.advisor_audit USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY advisor_idempotency_tenant_isolation ON workshopos.advisor_idempotency USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());

COMMIT;
