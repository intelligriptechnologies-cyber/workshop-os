BEGIN;

CREATE TABLE workshopos.technician_assignment_event (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  source_event_id uuid NOT NULL,
  task_id uuid NOT NULL,
  source_task_version bigint NOT NULL CHECK (source_task_version > 0),
  payload_fingerprint text NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, source_event_id),
  UNIQUE (tenant_id, source_event_id),
  UNIQUE (tenant_id, branch_id, task_id, source_task_version),
  FOREIGN KEY (tenant_id, branch_id, source_event_id)
    REFERENCES workshopos.job_planning_outbox(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.work_task(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.technician_task (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  task_id uuid NOT NULL,
  job_id uuid NOT NULL,
  source_event_id uuid NOT NULL,
  source_task_version bigint NOT NULL CHECK (source_task_version > 0),
  title text NOT NULL CHECK (btrim(title) <> ''),
  priority text NOT NULL CHECK (priority IN ('URGENT', 'HIGH', 'NORMAL', 'LOW')),
  estimated_minutes integer NOT NULL CHECK (estimated_minutes >= 0),
  technician_ids uuid[] NOT NULL CHECK (cardinality(technician_ids) > 0),
  responsible_technician_id uuid NOT NULL,
  checklist_snapshot jsonb NOT NULL CHECK (jsonb_typeof(checklist_snapshot) = 'array'),
  material_snapshot jsonb NOT NULL CHECK (jsonb_typeof(material_snapshot) = 'array'),
  dependency_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  status text NOT NULL CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'PAUSED', 'BLOCKED', 'HANDED_OFF', 'COMPLETED')),
  status_reason text,
  elapsed_seconds bigint NOT NULL DEFAULT 0 CHECK (elapsed_seconds >= 0),
  active_started_at timestamptz,
  resource_version bigint NOT NULL CHECK (resource_version > 0),
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, task_id),
  FOREIGN KEY (tenant_id, branch_id, source_event_id)
    REFERENCES workshopos.technician_assignment_event(tenant_id, branch_id, source_event_id),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.work_task(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id)
    REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id),
  CHECK (responsible_technician_id = ANY (technician_ids)),
  CHECK ((status = 'IN_PROGRESS' AND active_started_at IS NOT NULL) OR (status <> 'IN_PROGRESS' AND active_started_at IS NULL))
);

CREATE TABLE workshopos.technician_task_status_history (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  task_id uuid NOT NULL,
  task_version bigint NOT NULL CHECK (task_version > 0),
  prior_status text NOT NULL,
  new_status text NOT NULL,
  reason text,
  elapsed_seconds bigint NOT NULL CHECK (elapsed_seconds >= 0),
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, task_id, task_version),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.technician_task(tenant_id, branch_id, task_id),
  CHECK (prior_status <> new_status),
  CHECK (new_status NOT IN ('PAUSED', 'BLOCKED', 'HANDED_OFF') OR reason IS NOT NULL)
);

CREATE TABLE workshopos.technician_task_evidence (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  task_id uuid NOT NULL,
  checklist_key text NOT NULL CHECK (btrim(checklist_key) <> ''),
  evidence_kind text NOT NULL CHECK (evidence_kind = 'PHOTO'),
  private_object_ref text NOT NULL CHECK (btrim(private_object_ref) <> '' AND private_object_ref LIKE '%/private/tasks/%'),
  content_type text NOT NULL CHECK (content_type IN ('image/jpeg', 'image/png', 'image/webp')),
  checksum text NOT NULL CHECK (checksum ~ '^[0-9a-f]{64}$'),
  scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  size_bytes bigint NOT NULL CHECK (size_bytes BETWEEN 1 AND 10000000),
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  captured_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.technician_task(tenant_id, branch_id, task_id)
);

CREATE TABLE workshopos.technician_task_checklist_history (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  task_id uuid NOT NULL,
  task_version bigint NOT NULL CHECK (task_version > 0),
  checklist_key text NOT NULL CHECK (btrim(checklist_key) <> ''),
  checked boolean NOT NULL,
  evidence_id uuid,
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, task_id, task_version, checklist_key),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.technician_task(tenant_id, branch_id, task_id),
  FOREIGN KEY (tenant_id, branch_id, evidence_id)
    REFERENCES workshopos.technician_task_evidence(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.technician_completion_override (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  task_id uuid NOT NULL,
  task_version bigint NOT NULL CHECK (task_version > 0),
  technician_membership_id uuid NOT NULL,
  actor_membership_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  overridden_blockers jsonb NOT NULL CHECK (jsonb_typeof(overridden_blockers) = 'array' AND jsonb_array_length(overridden_blockers) > 0),
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, task_id, task_version),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.technician_task(tenant_id, branch_id, task_id),
  CHECK (technician_membership_id <> actor_membership_id)
);

CREATE TABLE workshopos.technician_scan_audit (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  actor_membership_id uuid NOT NULL,
  source text NOT NULL CHECK (source IN ('CAMERA', 'HARDWARE', 'MANUAL')),
  code_digest text NOT NULL CHECK (code_digest ~ '^[0-9a-f]{64}$'),
  object_type text NOT NULL CHECK (object_type IN ('TASK', 'ITEM', 'DOCUMENT')),
  object_id uuid NOT NULL,
  object_state text NOT NULL CHECK (btrim(object_state) <> ''),
  reason text,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  CHECK (source <> 'MANUAL' OR reason IS NOT NULL),
  CHECK (reason IS NULL OR btrim(reason) <> '')
);

CREATE TABLE workshopos.technician_execution_outbox (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  event_type text NOT NULL CHECK (event_type = 'S16_TASK_COMPLETION_READY'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND payload ->> 'qcStatus' = 'PENDING_INDEPENDENT_QC'),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, aggregate_id, aggregate_version, event_type),
  FOREIGN KEY (tenant_id, branch_id, aggregate_id)
    REFERENCES workshopos.technician_task(tenant_id, branch_id, task_id)
);

CREATE TABLE workshopos.technician_command_receipt (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  command_fingerprint text NOT NULL CHECK (command_fingerprint ~ '^[0-9a-f]{64}$'),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, idempotency_key),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE FUNCTION workshopos.reject_technician_execution_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'technician execution evidence is append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER technician_assignment_event_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_assignment_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_task_status_history_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_task_status_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_task_checklist_history_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_task_checklist_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_task_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_task_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_completion_override_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_completion_override FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_scan_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_scan_audit FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_execution_outbox_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_execution_outbox FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();
CREATE TRIGGER technician_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.technician_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_technician_execution_ledger_mutation();

ALTER TABLE workshopos.technician_assignment_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_assignment_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task_checklist_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task_checklist_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_task_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_completion_override ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_completion_override FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_scan_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_scan_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_execution_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_execution_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_command_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.technician_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY technician_assignment_event_tenant_isolation ON workshopos.technician_assignment_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_task_tenant_isolation ON workshopos.technician_task USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_task_status_history_tenant_isolation ON workshopos.technician_task_status_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_task_checklist_history_tenant_isolation ON workshopos.technician_task_checklist_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_task_evidence_tenant_isolation ON workshopos.technician_task_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_completion_override_tenant_isolation ON workshopos.technician_completion_override USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_scan_audit_tenant_isolation ON workshopos.technician_scan_audit USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_execution_outbox_tenant_isolation ON workshopos.technician_execution_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY technician_command_receipt_tenant_isolation ON workshopos.technician_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

COMMIT;
