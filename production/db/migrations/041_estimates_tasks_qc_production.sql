BEGIN;

-- The original S09/S12/S16 ledgers remain authoritative. This migration only
-- adds the production-screen metadata and retry boundary needed to expose them.
ALTER TABLE workshopos.estimate_version
  ADD COLUMN notes text NOT NULL DEFAULT '',
  ADD COLUMN supersedes_version_id uuid,
  ADD CONSTRAINT estimate_supersedes_fk FOREIGN KEY (tenant_id,branch_id,supersedes_version_id)
    REFERENCES workshopos.estimate_version(tenant_id,branch_id,id);

DROP TRIGGER final_estimate_version_immutable ON workshopos.estimate_version;
CREATE OR REPLACE FUNCTION workshopos.protect_estimate_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='DELETE' THEN RAISE EXCEPTION 'estimate versions cannot be deleted' USING ERRCODE='integrity_constraint_violation'; END IF;
  IF OLD.status='DRAFT' AND NEW.status='DRAFT' AND NEW.resource_version=OLD.resource_version+1 AND
     (OLD.tenant_id,OLD.branch_id,OLD.id,OLD.estimate_stream_id,OLD.revision,OLD.prior_version_id,
      OLD.configuration_version_id,OLD.document_number,OLD.financial_year,OLD.valid_until,OLD.sent_at,
      OLD.created_at,OLD.supersedes_version_id)
     IS NOT DISTINCT FROM
     (NEW.tenant_id,NEW.branch_id,NEW.id,NEW.estimate_stream_id,NEW.revision,NEW.prior_version_id,
      NEW.configuration_version_id,NEW.document_number,NEW.financial_year,NEW.valid_until,NEW.sent_at,
      NEW.created_at,NEW.supersedes_version_id) THEN RETURN NEW; END IF;
  IF OLD.status='DRAFT' AND NEW.status='SENT' AND
     (OLD.tenant_id,OLD.branch_id,OLD.id,OLD.estimate_stream_id,OLD.revision,OLD.prior_version_id,
      OLD.configuration_version_id,OLD.totals,OLD.payer_totals,OLD.created_at,OLD.notes,OLD.supersedes_version_id)
     IS NOT DISTINCT FROM
     (NEW.tenant_id,NEW.branch_id,NEW.id,NEW.estimate_stream_id,NEW.revision,NEW.prior_version_id,
      NEW.configuration_version_id,NEW.totals,NEW.payer_totals,NEW.created_at,NEW.notes,NEW.supersedes_version_id) THEN RETURN NEW; END IF;
  IF OLD.status='SENT' AND NEW.status IN ('APPROVED','PARTIALLY_APPROVED','REJECTED','CLARIFICATION_REQUESTED') AND
     (OLD.tenant_id,OLD.branch_id,OLD.id,OLD.estimate_stream_id,OLD.revision,OLD.prior_version_id,
      OLD.configuration_version_id,OLD.document_number,OLD.financial_year,OLD.totals,OLD.payer_totals,
      OLD.valid_until,OLD.sent_at,OLD.created_at,OLD.notes,OLD.supersedes_version_id)
     IS NOT DISTINCT FROM
     (NEW.tenant_id,NEW.branch_id,NEW.id,NEW.estimate_stream_id,NEW.revision,NEW.prior_version_id,
      NEW.configuration_version_id,NEW.document_number,NEW.financial_year,NEW.totals,NEW.payer_totals,
      NEW.valid_until,NEW.sent_at,NEW.created_at,NEW.notes,NEW.supersedes_version_id) THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'estimate version content is immutable; create a new version' USING ERRCODE='integrity_constraint_violation';
END $$;
CREATE TRIGGER estimate_version_immutable BEFORE UPDATE OR DELETE ON workshopos.estimate_version
FOR EACH ROW EXECUTE FUNCTION workshopos.protect_estimate_version();

CREATE TABLE workshopos.v12_operational_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key)<>''),
  request_hash char(64) NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'),
  response jsonb NOT NULL CHECK (jsonb_typeof(response)='object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY(tenant_id,branch_id,idempotency_key), UNIQUE(tenant_id,idempotency_key)
);
CREATE TRIGGER v12_operational_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.v12_operational_command_receipt
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation();
ALTER TABLE workshopos.v12_operational_command_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.v12_operational_command_receipt FORCE ROW LEVEL SECURITY;
CREATE POLICY v12_operational_receipt_isolation ON workshopos.v12_operational_command_receipt
USING(tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()))
WITH CHECK(tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));

-- Keep assignment/execution evidence mutable only through versioned commands;
-- every transition itself remains append-only in the historical ledgers.
CREATE INDEX estimate_production_list_idx ON workshopos.estimate_version(tenant_id,branch_id,created_at DESC,id);
CREATE INDEX technician_task_production_list_idx ON workshopos.technician_task(tenant_id,branch_id,updated_at DESC,task_id);
CREATE INDEX qc_task_production_list_idx ON workshopos.qc_task_state(tenant_id,branch_id,updated_at DESC,task_id);

CREATE FUNCTION workshopos.enforce_production_task_command() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_stage text; v_held boolean;
BEGIN
  SELECT lr.stage,coalesce((SELECT event_kind='HOLD' FROM workshopos.job_lifecycle_overlay_event o
    WHERE o.job_id=NEW.job_id ORDER BY o.occurred_at DESC,o.id DESC LIMIT 1),false)
  INTO v_stage,v_held FROM workshopos.lifecycle_resources lr WHERE lr.id=NEW.job_id AND lr.resource_type='JOB';
  IF v_stage IS DISTINCT FROM 'ACTIVE' OR v_held THEN RAISE EXCEPTION 'TASK_LIFECYCLE_BLOCKED'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER production_task_lifecycle_gate BEFORE UPDATE ON workshopos.technician_task
FOR EACH ROW EXECUTE FUNCTION workshopos.enforce_production_task_command();

CREATE FUNCTION workshopos.verify_production_task_evidence() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_task workshopos.technician_task; v_media_id uuid;
BEGIN
  SELECT * INTO STRICT v_task FROM workshopos.technician_task WHERE tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id AND task_id=NEW.task_id;
  IF NOT (v_task.technician_ids @> ARRAY[NEW.actor_membership_id]) THEN RAISE EXCEPTION 'TASK_ASSIGNEE_REQUIRED'; END IF;
  BEGIN v_media_id:=split_part(NEW.private_object_ref,'/',array_length(string_to_array(NEW.private_object_ref,'/'),1))::uuid;
  EXCEPTION WHEN invalid_text_representation THEN RAISE EXCEPTION 'VERIFIED_CLEAN_EVIDENCE_REQUIRED'; END;
  IF NOT EXISTS(SELECT 1 FROM workshopos.secure_media_object m WHERE m.media_id=v_media_id AND m.job_id=v_task.job_id
      AND m.scan_status='CLEAN' AND m.archived_at IS NULL AND m.checksum_sha256=NEW.checksum) THEN
    RAISE EXCEPTION 'VERIFIED_CLEAN_EVIDENCE_REQUIRED';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER production_task_evidence_gate BEFORE INSERT ON workshopos.technician_task_evidence
FOR EACH ROW EXECUTE FUNCTION workshopos.verify_production_task_evidence();

CREATE FUNCTION workshopos.enforce_production_qc_inspection() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_state workshopos.qc_task_state; v_stage text; v_held boolean;
BEGIN
  SELECT * INTO STRICT v_state FROM workshopos.qc_task_state WHERE tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id AND task_id=NEW.task_id;
  IF v_state.technician_membership_ids @> ARRAY[NEW.actor_membership_id] THEN RAISE EXCEPTION 'INDEPENDENT_QC_REQUIRED'; END IF;
  SELECT lr.stage,coalesce((SELECT event_kind='HOLD' FROM workshopos.job_lifecycle_overlay_event o
    WHERE o.job_id=NEW.job_id ORDER BY o.occurred_at DESC,o.id DESC LIMIT 1),false)
    INTO v_stage,v_held FROM workshopos.lifecycle_resources lr WHERE lr.id=NEW.job_id AND lr.resource_type='JOB';
  IF v_stage IS DISTINCT FROM 'QC' OR v_held THEN RAISE EXCEPTION 'QC_LIFECYCLE_BLOCKED'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER production_qc_lifecycle_independence_gate BEFORE INSERT ON workshopos.qc_inspection
FOR EACH ROW EXECUTE FUNCTION workshopos.enforce_production_qc_inspection();

CREATE FUNCTION workshopos.verify_production_rework_evidence() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_media_id uuid; v_job_id uuid;
BEGIN
  IF NEW.entity_type<>'REWORK' THEN RETURN NEW; END IF;
  SELECT job_id INTO STRICT v_job_id FROM workshopos.qc_rework WHERE id=NEW.entity_id AND tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id;
  BEGIN v_media_id:=split_part(NEW.private_object_ref,'/',array_length(string_to_array(NEW.private_object_ref,'/'),1))::uuid;
  EXCEPTION WHEN invalid_text_representation THEN RAISE EXCEPTION 'VERIFIED_CLEAN_EVIDENCE_REQUIRED'; END;
  IF NOT EXISTS(SELECT 1 FROM workshopos.secure_media_object m WHERE m.media_id=v_media_id AND m.job_id=v_job_id
      AND m.scan_status='CLEAN' AND m.archived_at IS NULL AND m.checksum_sha256=NEW.checksum_sha256) THEN
    RAISE EXCEPTION 'VERIFIED_CLEAN_EVIDENCE_REQUIRED';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER production_rework_evidence_gate BEFORE INSERT ON workshopos.qc_evidence
FOR EACH ROW EXECUTE FUNCTION workshopos.verify_production_rework_evidence();

ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH changed AS (
  UPDATE workshopos.role_template SET permissions=permissions ||
    '["estimates.page","estimate.read","estimate.manage","estimate.submit","estimate.approve","estimate.document.download","tasks.page","task.read","task.assign","task.execute","task.evidence.write","qc.page","qc.read","qc.inspect","rework.assign","rework.execute"]'::jsonb,
    version=version+1,updated_at=transaction_timestamp()
  WHERE system_template AND name='Business Owner/Admin' AND NOT permissions ?&
    ARRAY['estimates.page','estimate.read','estimate.manage','estimate.submit','estimate.approve','estimate.document.download','tasks.page','task.read','task.assign','task.execute','task.evidence.write','qc.page','qc.read','qc.inspect','rework.assign','rework.execute']
  RETURNING *)
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-12 Estimates, Tasks, and QC permissions' FROM changed;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
