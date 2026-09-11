BEGIN;

CREATE TABLE workshopos.work_planning_event (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  activation_id uuid NOT NULL,
  job_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type = 'APPROVED_SCOPE_WORK_PLANNING'),
  configuration_snapshot jsonb NOT NULL CHECK (configuration_snapshot ?& ARRAY['PRICE', 'TAX', 'WORKFLOW', 'RECIPE', 'CHECKLIST', 'POLICY']),
  approved_lines jsonb NOT NULL CHECK (jsonb_typeof(approved_lines) = 'array'),
  payload_fingerprint text NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, activation_id),
  FOREIGN KEY (tenant_id, branch_id, activation_id)
    REFERENCES workshopos.estimate_scope_activation(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id)
    REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.work_plan (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  job_id uuid NOT NULL,
  activation_id uuid NOT NULL,
  source_event_id uuid NOT NULL,
  configuration_snapshot jsonb NOT NULL CHECK (configuration_snapshot ?& ARRAY['PRICE', 'TAX', 'WORKFLOW', 'RECIPE', 'CHECKLIST', 'POLICY']),
  priority text NOT NULL CHECK (priority IN ('URGENT', 'HIGH', 'NORMAL', 'LOW')),
  promised_delivery_at timestamptz,
  projected_completion_at timestamptz NOT NULL,
  delivery_risk text NOT NULL CHECK (delivery_risk IN ('ON_TRACK', 'AT_RISK', 'NO_PROMISE')),
  delivery_risk_reasons jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(delivery_risk_reasons) = 'array'),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, activation_id),
  FOREIGN KEY (tenant_id, branch_id, source_event_id)
    REFERENCES workshopos.work_planning_event(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id)
    REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.work_task (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  id uuid NOT NULL,
  source_estimate_line_id uuid NOT NULL,
  template_key text NOT NULL CHECK (btrim(template_key) <> ''),
  title text NOT NULL CHECK (btrim(title) <> ''),
  required_skill_ids uuid[] NOT NULL CHECK (cardinality(required_skill_ids) > 0),
  bay_type_id uuid NOT NULL,
  estimated_minutes integer NOT NULL CHECK (estimated_minutes > 0),
  checklist_snapshot jsonb NOT NULL CHECK (jsonb_typeof(checklist_snapshot) = 'array'),
  material_snapshot jsonb NOT NULL CHECK (jsonb_typeof(material_snapshot) = 'array'),
  priority text NOT NULL CHECK (priority IN ('URGENT', 'HIGH', 'NORMAL', 'LOW')),
  technician_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  responsible_technician_id uuid,
  capacity_warnings jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(capacity_warnings) = 'array'),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, plan_id, id),
  UNIQUE (tenant_id, branch_id, plan_id, source_estimate_line_id, template_key),
  FOREIGN KEY (tenant_id, branch_id, plan_id)
    REFERENCES workshopos.work_plan(tenant_id, branch_id, id),
  CHECK (responsible_technician_id = ANY (technician_ids)),
  CHECK ((cardinality(technician_ids) = 0 AND responsible_technician_id IS NULL)
      OR (cardinality(technician_ids) > 0 AND responsible_technician_id IS NOT NULL))
);

CREATE TABLE workshopos.work_task_dependency (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  task_id uuid NOT NULL,
  depends_on_task_id uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, task_id, depends_on_task_id),
  FOREIGN KEY (tenant_id, branch_id, plan_id, task_id)
    REFERENCES workshopos.work_task(tenant_id, branch_id, plan_id, id),
  FOREIGN KEY (tenant_id, branch_id, plan_id, depends_on_task_id)
    REFERENCES workshopos.work_task(tenant_id, branch_id, plan_id, id),
  CHECK (task_id <> depends_on_task_id)
);

CREATE TABLE workshopos.work_task_assignment_history (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  job_id uuid NOT NULL,
  task_id uuid NOT NULL,
  task_version bigint NOT NULL CHECK (task_version > 1),
  technician_ids uuid[] NOT NULL CHECK (cardinality(technician_ids) > 0),
  responsible_technician_id uuid NOT NULL,
  previous_technician_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  previous_responsible_technician_id uuid,
  capacity_warnings jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(capacity_warnings) = 'array'),
  warnings_acknowledged boolean NOT NULL,
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, task_id, task_version),
  FOREIGN KEY (tenant_id, branch_id, task_id)
    REFERENCES workshopos.work_task(tenant_id, branch_id, id),
  CHECK (responsible_technician_id = ANY (technician_ids))
);

CREATE TABLE workshopos.job_timeline_event (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  job_id uuid NOT NULL,
  source_event_id text NOT NULL CHECK (btrim(source_event_id) <> ''),
  event_type text NOT NULL CHECK (btrim(event_type) <> ''),
  title text NOT NULL CHECK (btrim(title) <> ''),
  audience_roles text[] NOT NULL CHECK (cardinality(audience_roles) > 0),
  public_detail jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(public_detail) = 'object'),
  internal_detail_ciphertext text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  permitted_actions jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(permitted_actions) = 'array'),
  actor_membership_id uuid,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, source_event_id),
  FOREIGN KEY (tenant_id, branch_id, job_id)
    REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_planning_outbox (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  event_type text NOT NULL CHECK (event_type = 'S12_TASK_ASSIGNMENT_READY'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, aggregate_id, aggregate_version, event_type),
  FOREIGN KEY (tenant_id, branch_id, aggregate_id)
    REFERENCES workshopos.work_task(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_planning_command_receipt (
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

CREATE FUNCTION workshopos.reject_job_planning_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'job planning evidence is append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE FUNCTION workshopos.assert_work_task_dependency_acyclic() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    WITH RECURSIVE ancestors(task_id) AS (
      SELECT NEW.depends_on_task_id
      UNION
      SELECT dependency.depends_on_task_id
      FROM workshopos.work_task_dependency dependency
      JOIN ancestors ON dependency.task_id = ancestors.task_id
      WHERE dependency.tenant_id = NEW.tenant_id
        AND dependency.branch_id = NEW.branch_id
        AND dependency.plan_id = NEW.plan_id
    )
    SELECT 1 FROM ancestors WHERE task_id = NEW.task_id
  ) THEN
    RAISE EXCEPTION 'work task dependency graph must be acyclic'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE CONSTRAINT TRIGGER work_task_dependency_acyclic
AFTER INSERT OR UPDATE ON workshopos.work_task_dependency
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION workshopos.assert_work_task_dependency_acyclic();

CREATE TRIGGER work_planning_event_append_only BEFORE UPDATE OR DELETE ON workshopos.work_planning_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_planning_ledger_mutation();
CREATE TRIGGER work_plan_append_only BEFORE UPDATE OR DELETE ON workshopos.work_plan FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_planning_ledger_mutation();
CREATE TRIGGER work_task_assignment_history_append_only BEFORE UPDATE OR DELETE ON workshopos.work_task_assignment_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_planning_ledger_mutation();
CREATE TRIGGER job_timeline_event_append_only BEFORE UPDATE OR DELETE ON workshopos.job_timeline_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_planning_ledger_mutation();
CREATE TRIGGER job_planning_outbox_append_only BEFORE UPDATE OR DELETE ON workshopos.job_planning_outbox FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_planning_ledger_mutation();
CREATE TRIGGER job_planning_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.job_planning_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_planning_ledger_mutation();

ALTER TABLE workshopos.work_planning_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_planning_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_plan FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_task ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_task FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_task_dependency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_task_dependency FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_task_assignment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_task_assignment_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_timeline_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_timeline_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_planning_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_planning_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_planning_command_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_planning_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY work_planning_event_tenant_isolation ON workshopos.work_planning_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY work_plan_tenant_isolation ON workshopos.work_plan USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY work_task_tenant_isolation ON workshopos.work_task USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY work_task_dependency_tenant_isolation ON workshopos.work_task_dependency USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY work_task_assignment_history_tenant_isolation ON workshopos.work_task_assignment_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY job_timeline_event_tenant_isolation ON workshopos.job_timeline_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY job_planning_outbox_tenant_isolation ON workshopos.job_planning_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY job_planning_command_receipt_tenant_isolation ON workshopos.job_planning_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

COMMIT;
