BEGIN;

-- S17 snapshots delivered warranty terms and creates linked operational work; it never reopens original finance.
CREATE TABLE workshopos.warranty_delivered_job_snapshot (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, original_job_id uuid NOT NULL,
  original_visit_id uuid NOT NULL, customer_id uuid NOT NULL, vehicle_id uuid NOT NULL,
  policy_master_id uuid NOT NULL, policy_version bigint NOT NULL CHECK (policy_version > 0),
  original_lifecycle_status text NOT NULL CHECK (original_lifecycle_status = 'CLOSED'),
  original_finance_status text NOT NULL CHECK (original_finance_status = 'CLOSED'),
  finalized_invoice_id uuid NOT NULL, delivered_at timestamptz NOT NULL, snapshotted_at timestamptz NOT NULL,
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, original_job_id),
  FOREIGN KEY (tenant_id, branch_id, original_job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.warranty_term_snapshot (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, original_job_id uuid NOT NULL, term_key text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('SERVICE','ITEM')), source_id uuid NOT NULL,
  description text NOT NULL CHECK (btrim(description) <> ''), duration_days integer NOT NULL CHECK (duration_days > 0),
  distance_km numeric(18,3) CHECK (distance_km IS NULL OR distance_km > 0), policy_version bigint NOT NULL CHECK (policy_version > 0),
  PRIMARY KEY (tenant_id, branch_id, original_job_id, term_key),
  FOREIGN KEY (tenant_id, branch_id, original_job_id) REFERENCES workshopos.warranty_delivered_job_snapshot(tenant_id, branch_id, original_job_id)
);

CREATE TABLE workshopos.warranty_claim (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, original_job_id uuid NOT NULL,
  linked_original_job_id uuid NOT NULL, linked_visit_id uuid NOT NULL, linked_job_id uuid NOT NULL,
  classification text NOT NULL CHECK (classification IN ('WARRANTY','COMEBACK','GOODWILL','CUSTOMER_PAY')),
  diagnosis text NOT NULL CHECK (btrim(diagnosis) <> ''),
  responsibility text NOT NULL CHECK (responsibility IN ('WORKSHOP','SUPPLIER','CUSTOMER','UNDETERMINED')),
  payer_type text NOT NULL CHECK (payer_type IN ('WORKSHOP','SUPPLIER','CUSTOMER','INSURER')), payer_id uuid NOT NULL,
  cost_owner_type text NOT NULL CHECK (cost_owner_type IN ('BRANCH','TENANT','SUPPLIER','CUSTOMER')), cost_owner_id uuid NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('REMEDIAL_WORK_REQUIRED','NO_FAULT_FOUND','CLAIM_REJECTED','GOODWILL_APPROVED')),
  status text NOT NULL CHECK (status IN ('OPEN','RESOLVED','REJECTED')), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), created_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, linked_visit_id), UNIQUE (tenant_id, linked_job_id),
  FOREIGN KEY (tenant_id, branch_id, original_job_id) REFERENCES workshopos.warranty_delivered_job_snapshot(tenant_id, branch_id, original_job_id),
  FOREIGN KEY (tenant_id, branch_id, linked_visit_id) REFERENCES workshopos.reception_visit(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, linked_job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id),
  CHECK (original_job_id = linked_original_job_id), CHECK (original_job_id <> linked_job_id)
);
CREATE UNIQUE INDEX warranty_one_open_claim_per_original_job
  ON workshopos.warranty_claim (tenant_id, original_job_id) WHERE status = 'OPEN';

CREATE TABLE workshopos.warranty_claim_scope (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, claim_id uuid NOT NULL, scope_key text NOT NULL,
  description text NOT NULL CHECK (btrim(description) <> ''), created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, claim_id, scope_key),
  FOREIGN KEY (tenant_id, branch_id, claim_id) REFERENCES workshopos.warranty_claim(tenant_id, branch_id, id)
);

-- S07 owns incident intake. S17 adds append-only escalation, resolution, acknowledgement, and retention control.
CREATE TABLE workshopos.custody_incident_escalation (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, incident_id uuid NOT NULL,
  prior_severity text NOT NULL, new_severity text NOT NULL CHECK (new_severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  owner_identity_id uuid NOT NULL, action_plan jsonb NOT NULL CHECK (jsonb_typeof(action_plan) = 'array'),
  reason text NOT NULL CHECK (btrim(reason) <> ''), actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  occurred_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, incident_id) REFERENCES workshopos.custody_incident(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.custody_incident_resolution (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, incident_id uuid NOT NULL,
  outcome text NOT NULL CHECK (btrim(outcome) <> ''), reason text NOT NULL CHECK (btrim(reason) <> ''),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resolved_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, incident_id),
  FOREIGN KEY (tenant_id, branch_id, incident_id) REFERENCES workshopos.custody_incident(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.custody_incident_acknowledgement (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, resolution_id uuid NOT NULL,
  signer_identity_id uuid NOT NULL, method text NOT NULL CHECK (method IN ('SIGNATURE','OTP','RECORDED_VERBAL')),
  accepted boolean NOT NULL CHECK (accepted), acknowledged_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, resolution_id),
  FOREIGN KEY (tenant_id, branch_id, resolution_id) REFERENCES workshopos.custody_incident_resolution(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.warranty_incident_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('INCIDENT_ESCALATION','INCIDENT_RESOLUTION','INCIDENT_ACKNOWLEDGEMENT','LEGAL_HOLD_RELEASE')),
  entity_id uuid NOT NULL, evidence_kind text NOT NULL CHECK (evidence_kind IN ('PHOTO','VIDEO','DOCUMENT')),
  private_object_ref text NOT NULL CHECK (private_object_ref LIKE 'private/%/incidents/%'),
  checksum_sha256 char(64) NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'), scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), captured_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.warranty_incident_notification_outbox (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, incident_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('INCIDENT_ESCALATED','INCIDENT_RESOLVED')),
  recipient_identity_ids uuid[] NOT NULL CHECK (cardinality(recipient_identity_ids) > 0), payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  status text NOT NULL CHECK (status IN ('PENDING','CLAIMED','SENT','FAILED')), available_at timestamptz NOT NULL,
  claimed_at timestamptz, completed_at timestamptz, attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, event_type, incident_id)
);

CREATE TABLE workshopos.warranty_incident_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('WARRANTY_CLAIM_CREATED','INCIDENT_ESCALATED','S17_INCIDENT_RESOLVED','LEGAL_HOLD_PLACED','LEGAL_HOLD_RELEASED')),
  source_id uuid NOT NULL, aggregate_id uuid NOT NULL, aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'), audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, event_type, source_id)
);

CREATE TABLE workshopos.legal_hold (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('CUSTODY_INCIDENT','WARRANTY_CLAIM')), target_id uuid NOT NULL,
  applies_to text[] NOT NULL CHECK (cardinality(applies_to) > 0 AND applies_to <@ ARRAY['RECORD','MEDIA']::text[]),
  reason text NOT NULL CHECK (btrim(reason) <> ''), status text NOT NULL CHECK (status IN ('ACTIVE','RELEASED')),
  placed_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), placed_at timestamptz NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id)
);
CREATE UNIQUE INDEX legal_hold_one_active_per_target ON workshopos.legal_hold (tenant_id, target_type, target_id) WHERE status = 'ACTIVE';

CREATE TABLE workshopos.legal_hold_release (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, legal_hold_id uuid NOT NULL,
  placed_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  released_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  reason text NOT NULL CHECK (btrim(reason) <> ''), reauthenticated_at timestamptz NOT NULL, released_at timestamptz NOT NULL,
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, legal_hold_id),
  FOREIGN KEY (tenant_id, branch_id, legal_hold_id) REFERENCES workshopos.legal_hold(tenant_id, branch_id, id),
  CHECK (placed_by_membership_id <> released_by_membership_id), CHECK (reauthenticated_at <= released_at)
);

CREATE TABLE workshopos.warranty_incident_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299), response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

-- Locking this immutable delivery snapshot serializes one open linked claim and proves the original finance remains closed.
CREATE FUNCTION workshopos.lock_delivered_job_for_claim(p_tenant_id uuid, p_branch_id uuid, p_original_job_id uuid)
RETURNS workshopos.warranty_delivered_job_snapshot LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_job workshopos.warranty_delivered_job_snapshot;
BEGIN
  SELECT * INTO v_job FROM workshopos.warranty_delivered_job_snapshot
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND original_job_id = p_original_job_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'delivered Job warranty snapshot not found'; END IF;
  IF v_job.original_lifecycle_status <> 'CLOSED' OR v_job.original_finance_status <> 'CLOSED' THEN
    RAISE EXCEPTION 'original Job lifecycle and finance must remain closed';
  END IF;
  RETURN v_job;
END $$;

-- Retention workers must call this under the same tenant/branch transaction before deleting a record or expiring media.
CREATE FUNCTION workshopos.assert_retention_not_held(
  p_tenant_id uuid, p_branch_id uuid, p_target_type text, p_target_id uuid, p_retention_class text
) RETURNS void LANGUAGE plpgsql STABLE AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM workshopos.legal_hold h WHERE h.tenant_id = p_tenant_id AND h.branch_id = p_branch_id
      AND h.target_type = p_target_type AND h.target_id = p_target_id AND h.status = 'ACTIVE'
      AND p_retention_class = ANY(h.applies_to)
  ) THEN RAISE EXCEPTION 'legal hold prevents record purge or media expiry'; END IF;
END $$;

CREATE FUNCTION workshopos.reject_warranty_incident_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; append a superseding event or authorized release', TG_TABLE_NAME; END $$;

CREATE TRIGGER warranty_delivered_job_snapshot_append_only BEFORE UPDATE OR DELETE ON workshopos.warranty_delivered_job_snapshot FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER warranty_term_snapshot_append_only BEFORE UPDATE OR DELETE ON workshopos.warranty_term_snapshot FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER warranty_claim_scope_append_only BEFORE UPDATE OR DELETE ON workshopos.warranty_claim_scope FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER custody_incident_escalation_append_only BEFORE UPDATE OR DELETE ON workshopos.custody_incident_escalation FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER custody_incident_resolution_append_only BEFORE UPDATE OR DELETE ON workshopos.custody_incident_resolution FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER custody_incident_acknowledgement_append_only BEFORE UPDATE OR DELETE ON workshopos.custody_incident_acknowledgement FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER warranty_incident_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.warranty_incident_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER warranty_incident_event_append_only BEFORE UPDATE OR DELETE ON workshopos.warranty_incident_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER legal_hold_release_append_only BEFORE UPDATE OR DELETE ON workshopos.legal_hold_release FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();
CREATE TRIGGER warranty_incident_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.warranty_incident_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_warranty_incident_append_only_mutation();

ALTER TABLE workshopos.warranty_delivered_job_snapshot ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_delivered_job_snapshot FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_term_snapshot ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_term_snapshot FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_claim ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_claim FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_claim_scope ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_claim_scope FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_escalation ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.custody_incident_escalation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_resolution ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.custody_incident_resolution FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.custody_incident_acknowledgement ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.custody_incident_acknowledgement FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_incident_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_incident_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_incident_notification_outbox ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_incident_notification_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_incident_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_incident_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.legal_hold ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.legal_hold FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.legal_hold_release ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.legal_hold_release FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.warranty_incident_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.warranty_incident_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY warranty_delivered_job_snapshot_isolation ON workshopos.warranty_delivered_job_snapshot USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_term_snapshot_isolation ON workshopos.warranty_term_snapshot USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_claim_isolation ON workshopos.warranty_claim USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_claim_scope_isolation ON workshopos.warranty_claim_scope USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_escalation_isolation ON workshopos.custody_incident_escalation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_resolution_isolation ON workshopos.custody_incident_resolution USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY custody_incident_acknowledgement_isolation ON workshopos.custody_incident_acknowledgement USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_incident_evidence_isolation ON workshopos.warranty_incident_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_incident_notification_outbox_isolation ON workshopos.warranty_incident_notification_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_incident_event_isolation ON workshopos.warranty_incident_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY legal_hold_isolation ON workshopos.legal_hold USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY legal_hold_release_isolation ON workshopos.legal_hold_release USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY warranty_incident_command_receipt_isolation ON workshopos.warranty_incident_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
