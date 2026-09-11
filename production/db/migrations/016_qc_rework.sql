BEGIN;

-- S16 consumes immutable S12 completion and S15 reconciliation signals. QC acceptance is a separate control.
CREATE TABLE workshopos.qc_task_state (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, task_id uuid NOT NULL, job_id uuid NOT NULL,
  checklist_master_id uuid NOT NULL, checklist_version bigint NOT NULL CHECK (checklist_version > 0),
  policy_version bigint NOT NULL CHECK (policy_version > 0), technician_membership_ids uuid[] NOT NULL CHECK (cardinality(technician_membership_ids) > 0),
  completion_event_id uuid NOT NULL, reconciliation_event_id uuid NOT NULL,
  qc_status text NOT NULL CHECK (qc_status IN ('PENDING_QC','FAILED','PASSED','OVERRIDDEN')),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), updated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, task_id),
  FOREIGN KEY (tenant_id, branch_id, task_id) REFERENCES workshopos.work_task(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.qc_consumed_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, source_event_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('S16_TASK_COMPLETION_READY','S15_MATERIAL_RECONCILED')),
  aggregate_id uuid NOT NULL, aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'), consumed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, source_event_id), UNIQUE (tenant_id, source_event_id)
);

CREATE TABLE workshopos.qc_inspection (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL,
  attempt integer NOT NULL CHECK (attempt > 0), checklist_master_id uuid NOT NULL, checklist_version bigint NOT NULL CHECK (checklist_version > 0),
  result text NOT NULL CHECK (result IN ('PASS','FAIL')), reason text NOT NULL CHECK (btrim(reason) <> ''),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), occurred_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, task_id, attempt),
  FOREIGN KEY (tenant_id, branch_id, task_id) REFERENCES workshopos.work_task(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.qc_inspection_item (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, inspection_id uuid NOT NULL, checklist_key text NOT NULL CHECK (btrim(checklist_key) <> ''),
  item_status text NOT NULL CHECK (item_status IN ('PASS','FAIL','NOT_APPLICABLE')), reading text, notes text NOT NULL CHECK (btrim(notes) <> ''),
  PRIMARY KEY (tenant_id, branch_id, inspection_id, checklist_key),
  FOREIGN KEY (tenant_id, branch_id, inspection_id) REFERENCES workshopos.qc_inspection(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.qc_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, entity_type text NOT NULL,
  entity_id uuid NOT NULL, checklist_key text, evidence_kind text NOT NULL CHECK (evidence_kind IN ('PHOTO','VIDEO','DOCUMENT')),
  private_object_ref text NOT NULL CHECK (private_object_ref LIKE '%/private/qc/%'),
  checksum_sha256 char(64) NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'), scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), captured_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.qc_rework (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL,
  failed_inspection_id uuid NOT NULL, failed_checklist_keys text[] NOT NULL CHECK (cardinality(failed_checklist_keys) > 0),
  status text NOT NULL CHECK (status IN ('BLOCKING','ASSIGNED','READY_FOR_REINSPECTION','PASSED')),
  assigned_technician_membership_id uuid REFERENCES workshopos.membership(id), reason text NOT NULL CHECK (btrim(reason) <> ''),
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, failed_inspection_id) REFERENCES workshopos.qc_inspection(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.qc_rework_history (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, rework_id uuid NOT NULL,
  prior_status text NOT NULL, new_status text NOT NULL, reason text NOT NULL CHECK (btrim(reason) <> ''),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), evidence_ids uuid[] NOT NULL DEFAULT '{}',
  occurred_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, rework_id) REFERENCES workshopos.qc_rework(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.qc_override_request (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL, rework_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''), customer_communication_note text NOT NULL CHECK (btrim(customer_communication_note) <> ''),
  policy_version bigint NOT NULL CHECK (policy_version > 0), maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  requested_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, rework_id) REFERENCES workshopos.qc_rework(tenant_id, branch_id, id)
);

CREATE UNIQUE INDEX qc_one_pending_override_per_task ON workshopos.qc_override_request (tenant_id, branch_id, task_id)
  WHERE status = 'APPROVAL_PENDING';

CREATE TABLE workshopos.qc_override_approval (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, override_request_id uuid NOT NULL,
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), checker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  decision text NOT NULL CHECK (decision IN ('APPROVE','REJECT')), reason text NOT NULL CHECK (btrim(reason) <> ''),
  reauthenticated_at timestamptz NOT NULL, decided_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, override_request_id),
  FOREIGN KEY (tenant_id, branch_id, override_request_id) REFERENCES workshopos.qc_override_request(tenant_id, branch_id, id),
  CHECK (maker_membership_id <> checker_membership_id), CHECK (reauthenticated_at <= decided_at)
);

CREATE TABLE workshopos.qc_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('QC_FAILED','REWORK_ASSIGNED','REWORK_COMPLETED','S16_QC_PASSED','S16_QC_OVERRIDDEN')),
  source_id uuid NOT NULL, aggregate_id uuid NOT NULL, aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'), audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, event_type, source_id)
);

CREATE TABLE workshopos.qc_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299), response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

-- The authoritative inspection command locks the task projection and rejects the technician cohort.
CREATE FUNCTION workshopos.lock_qc_task_for_inspection(
  p_tenant_id uuid, p_branch_id uuid, p_task_id uuid, p_actor_membership_id uuid
) RETURNS workshopos.qc_task_state LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_state workshopos.qc_task_state;
BEGIN
  SELECT * INTO v_state FROM workshopos.qc_task_state
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND task_id = p_task_id FOR UPDATE;
  IF NOT FOUND OR v_state.qc_status <> 'PENDING_QC' THEN RAISE EXCEPTION 'QC task is not actionable'; END IF;
  IF v_state.technician_membership_ids @> ARRAY[p_actor_membership_id] THEN RAISE EXCEPTION 'independent QC actor required'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM workshopos.qc_consumed_event c WHERE c.tenant_id = p_tenant_id AND c.branch_id = p_branch_id
      AND c.aggregate_id = p_task_id AND c.event_type = 'S16_TASK_COMPLETION_READY'
  ) OR NOT EXISTS (
    SELECT 1 FROM workshopos.qc_consumed_event c WHERE c.tenant_id = p_tenant_id AND c.branch_id = p_branch_id
      AND c.aggregate_id = p_task_id AND c.event_type = 'S15_MATERIAL_RECONCILED'
  ) THEN RAISE EXCEPTION 'completion and material reconciliation are both required'; END IF;
  RETURN v_state;
END $$;

CREATE FUNCTION workshopos.reject_qc_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; create a new inspection, history row, or compensating event', TG_TABLE_NAME; END $$;

CREATE TRIGGER qc_inspection_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_inspection FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_inspection_item_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_inspection_item FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_rework_history_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_rework_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_override_approval_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_override_approval FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_event_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_consumed_event_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_consumed_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();
CREATE TRIGGER qc_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.qc_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_qc_append_only_mutation();

ALTER TABLE workshopos.qc_task_state ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_task_state FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_consumed_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_consumed_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_inspection ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_inspection FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_inspection_item ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_inspection_item FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_rework ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_rework FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_rework_history ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_rework_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_override_request ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_override_request FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_override_approval ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_override_approval FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.qc_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.qc_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY qc_task_state_isolation ON workshopos.qc_task_state USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_consumed_event_isolation ON workshopos.qc_consumed_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_inspection_isolation ON workshopos.qc_inspection USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_inspection_item_isolation ON workshopos.qc_inspection_item USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_evidence_isolation ON workshopos.qc_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_rework_isolation ON workshopos.qc_rework USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_rework_history_isolation ON workshopos.qc_rework_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_override_request_isolation ON workshopos.qc_override_request USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_override_approval_isolation ON workshopos.qc_override_approval USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_event_isolation ON workshopos.qc_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY qc_command_receipt_isolation ON workshopos.qc_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
