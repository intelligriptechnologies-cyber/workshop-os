BEGIN;

CREATE TABLE workshopos.reception_visit (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  appointment_id uuid,
  source_event_id uuid,
  source_event_version bigint,
  customer_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  advisor_identity_id text NOT NULL CHECK (btrim(advisor_identity_id) <> ''),
  odometer_km bigint NOT NULL CHECK (odometer_km >= 0),
  fuel_level_eighths smallint NOT NULL CHECK (fuel_level_eighths BETWEEN 0 AND 8),
  key_count integer NOT NULL CHECK (key_count >= 0),
  accessories text[] NOT NULL DEFAULT '{}'::text[],
  customer_request text NOT NULL CHECK (btrim(customer_request) <> ''),
  promised_handoff_at timestamptz NOT NULL,
  reception_configuration_version_id uuid NOT NULL,
  checked_in_at timestamptz NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, appointment_id) REFERENCES workshopos.appointment(tenant_id, branch_id, id),
  CHECK ((source_event_id IS NULL AND source_event_version IS NULL AND appointment_id IS NULL)
      OR (source_event_id IS NOT NULL AND source_event_version > 0 AND appointment_id IS NOT NULL))
);

CREATE TABLE workshopos.reception_job_card (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  visit_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  advisor_identity_id text NOT NULL CHECK (btrim(advisor_identity_id) <> ''),
  customer_request text NOT NULL CHECK (btrim(customer_request) <> ''),
  promised_handoff_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status = 'DRAFT'),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, visit_id),
  FOREIGN KEY (tenant_id, branch_id, visit_id) REFERENCES workshopos.reception_visit(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.reception_evidence (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  visit_id uuid NOT NULL,
  evidence_kind text NOT NULL CHECK (btrim(evidence_kind) <> ''),
  object_key text NOT NULL CHECK (object_key LIKE 'private/%'),
  checksum_sha256 text NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-fA-F]{64}$'),
  scan_status text NOT NULL CHECK (scan_status IN ('PENDING', 'CLEAN', 'REJECTED')),
  captured_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, visit_id, evidence_kind, object_key),
  FOREIGN KEY (tenant_id, branch_id, visit_id) REFERENCES workshopos.reception_visit(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.reception_acknowledgement (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  visit_id uuid NOT NULL,
  accepted boolean NOT NULL CHECK (accepted),
  text_version text NOT NULL CHECK (btrim(text_version) <> ''),
  signer_name text NOT NULL CHECK (btrim(signer_name) <> ''),
  acknowledgement_method text NOT NULL CHECK (acknowledgement_method IN ('SIGNATURE', 'OTP', 'RECORDED_VERBAL')),
  evidence_object_key text NOT NULL CHECK (evidence_object_key LIKE 'private/%'),
  evidence_checksum_sha256 text NOT NULL CHECK (evidence_checksum_sha256 ~ '^[0-9a-fA-F]{64}$'),
  evidence_scan_status text NOT NULL CHECK (evidence_scan_status IN ('PENDING', 'CLEAN', 'REJECTED')),
  acknowledged_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, visit_id),
  FOREIGN KEY (tenant_id, branch_id, visit_id) REFERENCES workshopos.reception_visit(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.reception_event_consumption (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  source_event_id uuid NOT NULL,
  source_event_version bigint NOT NULL CHECK (source_event_version > 0),
  visit_id uuid NOT NULL,
  consumed_at timestamptz NOT NULL,
  audit_reference text NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, source_event_id),
  FOREIGN KEY (tenant_id, branch_id, source_event_id) REFERENCES workshopos.appointment_reception_outbox(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, visit_id) REFERENCES workshopos.reception_visit(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.custody_incident (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  visit_id uuid NOT NULL,
  job_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  severity text NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  category text NOT NULL CHECK (category IN ('DAMAGE', 'LOSS', 'SAFETY', 'OTHER')),
  description text NOT NULL CHECK (btrim(description) <> ''),
  owner_identity_id text NOT NULL CHECK (btrim(owner_identity_id) <> ''),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED')),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, visit_id) REFERENCES workshopos.reception_visit(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.custody_incident_evidence (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  incident_id uuid NOT NULL,
  evidence_kind text NOT NULL CHECK (btrim(evidence_kind) <> ''),
  object_key text NOT NULL CHECK (object_key LIKE 'private/%'),
  checksum_sha256 text NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-fA-F]{64}$'),
  scan_status text NOT NULL CHECK (scan_status IN ('PENDING', 'CLEAN', 'REJECTED')),
  recorded_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, incident_id) REFERENCES workshopos.custody_incident(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.custody_incident_action (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  incident_id uuid NOT NULL,
  description text NOT NULL CHECK (btrim(description) <> ''),
  owner_identity_id text NOT NULL CHECK (btrim(owner_identity_id) <> ''),
  due_at timestamptz,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'COMPLETED', 'CANCELLED')),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, incident_id) REFERENCES workshopos.custody_incident(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.custody_incident_notification_outbox (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  incident_id uuid NOT NULL,
  recipient_identity_ids text[] NOT NULL CHECK (cardinality(recipient_identity_ids) > 0),
  status text NOT NULL DEFAULT 'QUEUED' CHECK (status = 'QUEUED'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, incident_id) REFERENCES workshopos.custody_incident(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.reception_audit (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('VISIT', 'CUSTODY_INCIDENT')),
  resource_id uuid NOT NULL,
  action text NOT NULL CHECK (btrim(action) <> ''),
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL,
  request_id text,
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference)
);

CREATE TABLE workshopos.reception_idempotency (
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  command_fingerprint text NOT NULL CHECK (btrim(command_fingerprint) <> ''),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, idempotency_key)
);

-- This is a single PostgreSQL statement/transaction boundary: any validation or insert
-- failure rolls back the Visit, draft Job, source consumption, audit, and idempotency row.
CREATE FUNCTION workshopos.commit_reception_check_in(
  p_branch_id uuid, p_visit_id uuid, p_job_id uuid, p_customer_id uuid, p_vehicle_id uuid,
  p_advisor_identity_id text, p_odometer_km bigint, p_fuel_level_eighths smallint,
  p_key_count integer, p_accessories text[], p_customer_request text, p_promised_handoff_at timestamptz,
  p_reception_configuration_version_id uuid, p_checked_in_at timestamptz,
  p_appointment_id uuid, p_source_event_id uuid, p_source_event_version bigint,
  p_event_consumption_id uuid, p_audit_id uuid, p_audit_reference text,
  p_actor_identity_id text, p_membership_id uuid, p_request_id text,
  p_idempotency_key text, p_command_fingerprint text
) RETURNS TABLE (visit_id uuid, job_id uuid, resource_version bigint, audit_reference text)
LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE
  v_tenant_id uuid := workshopos.current_tenant_id();
BEGIN
  IF NOT p_branch_id = ANY (workshopos.authorized_branch_ids()) THEN
    RAISE EXCEPTION 'BRANCH_FORBIDDEN' USING ERRCODE = 'insufficient_privilege';
  END IF;

  INSERT INTO workshopos.reception_visit (
    id, tenant_id, branch_id, appointment_id, source_event_id, source_event_version, customer_id, vehicle_id,
    advisor_identity_id, odometer_km, fuel_level_eighths, key_count, accessories, customer_request,
    promised_handoff_at, reception_configuration_version_id, checked_in_at, resource_version
  ) VALUES (
    p_visit_id, v_tenant_id, p_branch_id, p_appointment_id, p_source_event_id, p_source_event_version,
    p_customer_id, p_vehicle_id, p_advisor_identity_id, p_odometer_km, p_fuel_level_eighths, p_key_count,
    p_accessories, p_customer_request, p_promised_handoff_at, p_reception_configuration_version_id, p_checked_in_at, 1
  );

  INSERT INTO workshopos.reception_job_card (
    id, tenant_id, branch_id, visit_id, customer_id, vehicle_id, advisor_identity_id,
    customer_request, promised_handoff_at, status, resource_version
  ) VALUES (
    p_job_id, v_tenant_id, p_branch_id, p_visit_id, p_customer_id, p_vehicle_id, p_advisor_identity_id,
    p_customer_request, p_promised_handoff_at, 'DRAFT', 1
  );

  IF p_source_event_id IS NOT NULL THEN
    INSERT INTO workshopos.reception_event_consumption (
      id, tenant_id, branch_id, source_event_id, source_event_version, visit_id, consumed_at, audit_reference
    ) VALUES (
      p_event_consumption_id, v_tenant_id, p_branch_id, p_source_event_id, p_source_event_version,
      p_visit_id, p_checked_in_at, p_audit_reference
    );
  END IF;

  INSERT INTO workshopos.reception_audit (
    id, tenant_id, branch_id, resource_type, resource_id, action, actor_identity_id,
    membership_id, request_id, audit_reference, occurred_at
  ) VALUES (
    p_audit_id, v_tenant_id, p_branch_id, 'VISIT', p_visit_id, 'reception.checked-in',
    p_actor_identity_id, p_membership_id, p_request_id, p_audit_reference, p_checked_in_at
  );

  INSERT INTO workshopos.reception_idempotency (
    tenant_id, idempotency_key, command_fingerprint, response_status, response_body
  ) VALUES (
    v_tenant_id, p_idempotency_key, p_command_fingerprint, 201,
    jsonb_build_object('visitId', p_visit_id, 'jobId', p_job_id, 'resourceVersion', 1, 'auditReference', p_audit_reference)
  );

  RETURN QUERY SELECT p_visit_id, p_job_id, 1::bigint, p_audit_reference;
END $$;

CREATE OR REPLACE FUNCTION workshopos.reject_reception_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'reception evidence, acknowledgement, source consumption, custody evidence/notifications, and audit are append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER reception_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.reception_evidence
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_reception_ledger_mutation();
CREATE TRIGGER reception_acknowledgement_append_only BEFORE UPDATE OR DELETE ON workshopos.reception_acknowledgement
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_reception_ledger_mutation();
CREATE TRIGGER reception_event_consumption_append_only BEFORE UPDATE OR DELETE ON workshopos.reception_event_consumption
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_reception_ledger_mutation();
CREATE TRIGGER custody_incident_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.custody_incident_evidence
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_reception_ledger_mutation();
CREATE TRIGGER custody_incident_notification_append_only BEFORE UPDATE OR DELETE ON workshopos.custody_incident_notification_outbox
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_reception_ledger_mutation();
CREATE TRIGGER reception_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.reception_audit
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_reception_ledger_mutation();

ALTER TABLE workshopos.reception_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_visit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_job_card ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_job_card FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_acknowledgement ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_acknowledgement FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_event_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_event_consumption FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_action ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_action FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_notification_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.reception_idempotency FORCE ROW LEVEL SECURITY;

CREATE POLICY reception_visit_tenant_isolation ON workshopos.reception_visit
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY reception_job_card_tenant_isolation ON workshopos.reception_job_card
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY reception_evidence_tenant_isolation ON workshopos.reception_evidence
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY reception_acknowledgement_tenant_isolation ON workshopos.reception_acknowledgement
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY reception_event_consumption_tenant_isolation ON workshopos.reception_event_consumption
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_tenant_isolation ON workshopos.custody_incident
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_evidence_tenant_isolation ON workshopos.custody_incident_evidence
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_action_tenant_isolation ON workshopos.custody_incident_action
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_notification_outbox_tenant_isolation ON workshopos.custody_incident_notification_outbox
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY reception_audit_tenant_isolation ON workshopos.reception_audit
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY reception_idempotency_tenant_isolation ON workshopos.reception_idempotency
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

COMMIT;
