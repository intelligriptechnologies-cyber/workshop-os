-- S28 stores only references to authorized pilot evidence. This migration does not
-- claim a live pilot, cutover, hypercare window, or second-tenant acceptance occurred.
CREATE TABLE workshopos.pilot_playbook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  version integer NOT NULL CHECK (version > 0), checksum text NOT NULL CHECK (checksum ~ '^[a-f0-9]{64}$'),
  definition jsonb NOT NULL, published_at timestamptz NOT NULL,
  UNIQUE (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, version)
);
CREATE TABLE workshopos.tenant_pilot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  playbook_id uuid NOT NULL, playbook_version integer NOT NULL,
  playbook_checksum text NOT NULL, application_release_checksum text NOT NULL CHECK (application_release_checksum ~ '^[a-f0-9]{64}$'),
  status text NOT NULL, version integer NOT NULL DEFAULT 1 CHECK (version > 0), created_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, playbook_id) REFERENCES workshopos.pilot_playbook (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, playbook_version, application_release_checksum)
);
CREATE TABLE workshopos.parallel_reconciliation_day (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  operation_date date NOT NULL, operational_difference numeric(24,6) NOT NULL, stock_difference numeric(24,6) NOT NULL,
  invoice_difference_minor bigint NOT NULL, payment_difference_minor bigint NOT NULL, custody_difference numeric(24,6) NOT NULL,
  evidence_class text NOT NULL CHECK (evidence_class = 'AUTHORIZED_EXTERNAL'), artifact_reference text NOT NULL,
  recorded_by_identity_id uuid NOT NULL, recorded_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, pilot_id, operation_date)
);
CREATE TABLE workshopos.release_prerequisite_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  evidence_code text NOT NULL, evidence_class text NOT NULL CHECK (evidence_class = 'AUTHORIZED_EXTERNAL'),
  artifact_reference text NOT NULL, recorded_by_identity_id uuid NOT NULL, recorded_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, pilot_id, evidence_code)
);
CREATE TABLE workshopos.cutover_rollback_rehearsal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('CUTOVER','ROLLBACK')), maker_identity_id uuid NOT NULL, checker_identity_id uuid NOT NULL,
  artifact_reference text NOT NULL, communication_reference text NOT NULL, data_reconciled boolean NOT NULL, passed boolean NOT NULL,
  recorded_at timestamptz NOT NULL, CHECK (maker_identity_id <> checker_identity_id),
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id)
);
CREATE TABLE workshopos.cutover_authorization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  maker_identity_id uuid NOT NULL, checker_identity_id uuid NOT NULL, artifact_reference text NOT NULL,
  communication_reference text NOT NULL, data_reconciled boolean NOT NULL, authorized_at timestamptz NOT NULL,
  CHECK (maker_identity_id <> checker_identity_id),
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, pilot_id)
);
CREATE TABLE workshopos.hypercare_day (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  operation_date date NOT NULL, availability_basis_points integer NOT NULL CHECK (availability_basis_points BETWEEN 0 AND 10000),
  routine_p95_ms integer NOT NULL CHECK (routine_p95_ms >= 0), authoritative_p95_ms integer NOT NULL CHECK (authoritative_p95_ms >= 0),
  open_critical_incidents integer NOT NULL CHECK (open_critical_incidents >= 0), evidence_class text NOT NULL CHECK (evidence_class = 'AUTHORIZED_EXTERNAL'),
  artifact_reference text NOT NULL, recorded_by_identity_id uuid NOT NULL, recorded_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, pilot_id, operation_date)
);
CREATE TABLE workshopos.hypercare_incident (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  incident_reference text NOT NULL, severity text NOT NULL, status text NOT NULL,
  evidence_class text NOT NULL CHECK (evidence_class = 'AUTHORIZED_EXTERNAL'), artifact_reference text NOT NULL,
  recorded_by_identity_id uuid NOT NULL, recorded_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id)
);
CREATE TABLE workshopos.tenant_onboarding_stage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid NOT NULL,
  stage text NOT NULL, ordinal integer NOT NULL CHECK (ordinal > 0), playbook_version integer NOT NULL,
  playbook_checksum text NOT NULL, application_release_checksum text NOT NULL,
  evidence_class text NOT NULL CHECK (evidence_class = 'AUTHORIZED_EXTERNAL'), artifact_reference text NOT NULL,
  recorded_by_identity_id uuid NOT NULL, recorded_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, pilot_id) REFERENCES workshopos.tenant_pilot(tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, pilot_id, ordinal), UNIQUE (tenant_id, branch_id, pilot_id, stage)
);
CREATE TABLE workshopos.pilot_command (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL, pilot_id uuid,
  idempotency_key text NOT NULL, request_hash text NOT NULL, expected_version integer NOT NULL CHECK (expected_version >= 0),
  committed_version integer NOT NULL CHECK (committed_version > 0), result jsonb NOT NULL, committed_at timestamptz NOT NULL,
  UNIQUE (tenant_id, branch_id, idempotency_key)
);

CREATE OR REPLACE FUNCTION workshopos.lock_pilot_for_command(p_pilot_id uuid, p_expected_version integer)
RETURNS workshopos.tenant_pilot LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE locked workshopos.tenant_pilot;
BEGIN
  SELECT * INTO STRICT locked FROM workshopos.tenant_pilot WHERE id = p_pilot_id FOR UPDATE;
  IF locked.version <> p_expected_version THEN RAISE EXCEPTION 'pilot version conflict'; END IF;
  RETURN locked;
END $$;

CREATE OR REPLACE FUNCTION workshopos.prevent_pilot_evidence_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'pilot evidence is append-only'; END $$;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['pilot_playbook','parallel_reconciliation_day','release_prerequisite_evidence',
    'cutover_rollback_rehearsal','cutover_authorization','hypercare_day','hypercare_incident','tenant_onboarding_stage','pilot_command'] LOOP
    EXECUTE format('CREATE TRIGGER %I_immutable BEFORE UPDATE OR DELETE ON workshopos.%I FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_pilot_evidence_mutation()', t, t);
  END LOOP;
END $$;

ALTER TABLE workshopos.pilot_playbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.pilot_playbook FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_pilot ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_pilot FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.parallel_reconciliation_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.parallel_reconciliation_day FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.release_prerequisite_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.release_prerequisite_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.cutover_rollback_rehearsal ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.cutover_rollback_rehearsal FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.cutover_authorization ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.cutover_authorization FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.hypercare_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.hypercare_day FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.hypercare_incident ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.hypercare_incident FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_onboarding_stage ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_onboarding_stage FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.pilot_command ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.pilot_command FORCE ROW LEVEL SECURITY;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['pilot_playbook','tenant_pilot','parallel_reconciliation_day','release_prerequisite_evidence',
    'cutover_rollback_rehearsal','cutover_authorization','hypercare_day','hypercare_incident','tenant_onboarding_stage','pilot_command'] LOOP
    EXECUTE format('CREATE POLICY %I_scope ON workshopos.%I USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))', t, t);
  END LOOP;
END $$;
