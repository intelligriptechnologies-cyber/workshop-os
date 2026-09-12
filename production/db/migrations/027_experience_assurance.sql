-- S27 experience-assurance evidence. Automated rows are local contract evidence;
-- AUTHORIZED_EXTERNAL references must point to reviews performed outside this migration.
CREATE TABLE workshopos.accessibility_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  flow text NOT NULL, evidence_class text NOT NULL CHECK (evidence_class IN ('AUTOMATED','AUTHORIZED_EXTERNAL')),
  keyboard_passed boolean NOT NULL, focus_passed boolean NOT NULL, labels_errors_passed boolean NOT NULL,
  target_reflow_contrast_passed boolean NOT NULL, assistive_technology_passed boolean,
  artifact_reference text, recorded_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE workshopos.client_device_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  client text NOT NULL CHECK (client IN ('ANDROID_CHROME_PWA','DESKTOP_CHROME','DESKTOP_EDGE','IOS_SAFARI')),
  release_channel text NOT NULL CHECK (release_channel = 'CURRENT'),
  evidence_class text NOT NULL CHECK (evidence_class IN ('AUTOMATED','AUTHORIZED_EXTERNAL')),
  core_flows_passed boolean NOT NULL, camera_passed boolean NOT NULL, hardware_scanner_passed boolean NOT NULL,
  manual_fallback_passed boolean NOT NULL, artifact_reference text, recorded_at timestamptz NOT NULL
);
CREATE TABLE workshopos.rendered_document_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  document_type text NOT NULL, source_version integer NOT NULL CHECK (source_version > 0),
  format text NOT NULL CHECK (format IN ('PDF','A4','THERMAL')),
  evidence_class text NOT NULL CHECK (evidence_class IN ('AUTOMATED','AUTHORIZED_EXTERNAL')),
  checksum text NOT NULL, printer_model text, artifact_reference text, recorded_at timestamptz NOT NULL
);
CREATE TABLE workshopos.usability_study (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  evidence_class text NOT NULL CHECK (evidence_class IN ('AUTOMATED','AUTHORIZED_EXTERNAL')),
  protocol_version integer NOT NULL CHECK (protocol_version > 0), facilitator_identity_id uuid,
  artifact_reference text, conducted_at timestamptz NOT NULL,
  UNIQUE (tenant_id, branch_id, id)
);
CREATE TABLE workshopos.usability_result (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  study_id uuid NOT NULL, participant_reference text NOT NULL,
  staff_role text NOT NULL, training_minutes integer NOT NULL CHECK (training_minutes BETWEEN 0 AND 120),
  critical_scenario_completed_unaided boolean NOT NULL,
  critical_control_errors integer NOT NULL CHECK (critical_control_errors >= 0), recorded_at timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, branch_id, study_id) REFERENCES workshopos.usability_study (tenant_id, branch_id, id)
);
CREATE TABLE workshopos.experience_release_evaluation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('BLOCKED','EVIDENCE_COMPLETE')), missing_evidence text[] NOT NULL,
  evaluated_by_identity_id uuid NOT NULL, evaluated_at timestamptz NOT NULL
);

CREATE OR REPLACE FUNCTION workshopos.prevent_experience_evidence_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
  RAISE EXCEPTION 'experience assurance evidence is append-only';
END $$;
CREATE TRIGGER accessibility_evidence_immutable BEFORE UPDATE OR DELETE ON workshopos.accessibility_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_experience_evidence_mutation();
CREATE TRIGGER client_device_evidence_immutable BEFORE UPDATE OR DELETE ON workshopos.client_device_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_experience_evidence_mutation();
CREATE TRIGGER rendered_document_evidence_immutable BEFORE UPDATE OR DELETE ON workshopos.rendered_document_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_experience_evidence_mutation();
CREATE TRIGGER usability_study_immutable BEFORE UPDATE OR DELETE ON workshopos.usability_study FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_experience_evidence_mutation();
CREATE TRIGGER usability_result_immutable BEFORE UPDATE OR DELETE ON workshopos.usability_result FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_experience_evidence_mutation();
CREATE TRIGGER experience_release_evaluation_immutable BEFORE UPDATE OR DELETE ON workshopos.experience_release_evaluation FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_experience_evidence_mutation();

ALTER TABLE workshopos.accessibility_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.accessibility_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.client_device_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.client_device_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.rendered_document_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.rendered_document_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.usability_study ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.usability_study FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.usability_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.usability_result FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.experience_release_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.experience_release_evaluation FORCE ROW LEVEL SECURITY;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['accessibility_evidence','client_device_evidence','rendered_document_evidence','usability_study','usability_result','experience_release_evaluation'] LOOP
    EXECUTE format('CREATE POLICY %I_scope ON workshopos.%I USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))', t, t);
  END LOOP;
END $$;
