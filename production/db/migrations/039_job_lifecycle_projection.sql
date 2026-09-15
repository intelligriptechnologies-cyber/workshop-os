BEGIN;

-- HOLD is deliberately an overlay event, never a replacement lifecycle stage.
CREATE TABLE workshopos.job_lifecycle_overlay_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL,
  event_kind text NOT NULL CHECK (event_kind IN ('HOLD','RESUME')),
  underlying_stage text NOT NULL CHECK (underlying_stage IN ('APPOINTMENT','CHECK_IN','INSPECTION','ESTIMATE','APPROVED','ACTIVE','QC','BILLING','GATE_VERIFICATION','DELIVERED')),
  reason text NOT NULL CHECK (btrim(reason) <> ''), actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp(), audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id,branch_id,id), UNIQUE (tenant_id,audit_reference),
  FOREIGN KEY (tenant_id,branch_id,job_id) REFERENCES workshopos.reception_job_card(tenant_id,branch_id,id)
);

CREATE TABLE workshopos.job_lifecycle_fact (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL,
  fact_kind text NOT NULL CHECK (fact_kind IN ('ESTIMATE_APPROVED','WORK_ACCEPTED','PAYMENT_CLEARED')),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(evidence)='object'),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id,branch_id,id),
  UNIQUE (tenant_id,branch_id,job_id,fact_kind), UNIQUE (tenant_id,audit_reference),
  FOREIGN KEY (tenant_id,branch_id,job_id) REFERENCES workshopos.reception_job_card(tenant_id,branch_id,id)
);

CREATE TABLE workshopos.job_archive_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''), actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp(), audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id,branch_id,id), UNIQUE (tenant_id,branch_id,job_id), UNIQUE (tenant_id,audit_reference),
  FOREIGN KEY (tenant_id,branch_id,job_id) REFERENCES workshopos.reception_job_card(tenant_id,branch_id,id)
);

CREATE TABLE workshopos.job_lifecycle_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key)<>''),
  request_hash char(64) NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'), response jsonb NOT NULL CHECK (jsonb_typeof(response)='object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id,branch_id,idempotency_key), UNIQUE (tenant_id,idempotency_key)
);

CREATE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Job lifecycle evidence is append-only' USING ERRCODE='integrity_constraint_violation'; END $$;
CREATE TRIGGER job_lifecycle_overlay_append_only BEFORE UPDATE OR DELETE ON workshopos.job_lifecycle_overlay_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation();
CREATE TRIGGER job_lifecycle_fact_append_only BEFORE UPDATE OR DELETE ON workshopos.job_lifecycle_fact FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation();
CREATE TRIGGER job_archive_event_append_only BEFORE UPDATE OR DELETE ON workshopos.job_archive_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation();
CREATE TRIGGER job_lifecycle_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.job_lifecycle_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation();

ALTER TABLE workshopos.job_lifecycle_overlay_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_lifecycle_overlay_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_lifecycle_fact ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_lifecycle_fact FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_archive_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_archive_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_lifecycle_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_lifecycle_command_receipt FORCE ROW LEVEL SECURITY;
CREATE POLICY job_lifecycle_overlay_isolation ON workshopos.job_lifecycle_overlay_event USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_lifecycle_fact_isolation ON workshopos.job_lifecycle_fact USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_archive_event_isolation ON workshopos.job_archive_event USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_lifecycle_receipt_isolation ON workshopos.job_lifecycle_command_receipt USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));

CREATE INDEX job_lifecycle_overlay_projection_idx ON workshopos.job_lifecycle_overlay_event(tenant_id,branch_id,job_id,occurred_at DESC,id DESC);
CREATE INDEX job_lifecycle_history_projection_idx ON workshopos.lifecycle_history(tenant_id,branch_id,resource_id,occurred_at DESC,id DESC);

ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH changed AS (
  UPDATE workshopos.role_template
  SET permissions=permissions || '["job.lifecycle.manage","job.estimate-approval.record","job.work-acceptance.record","job.payment-clearance.record","data-flow.page","job.data-flow.read"]'::jsonb,
      version=version+1,updated_at=transaction_timestamp()
  WHERE system_template AND name='Business Owner/Admin'
    AND NOT permissions ?& ARRAY['job.lifecycle.manage','job.estimate-approval.record','job.work-acceptance.record','job.payment-clearance.record','data-flow.page','job.data-flow.read']
  RETURNING *
)
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-10 lifecycle and Data Flow permissions' FROM changed;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
