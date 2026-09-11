BEGIN;

CREATE TABLE workshopos.delivery_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, visit_id uuid NOT NULL, vehicle_id uuid NOT NULL,
  final_odometer_km bigint NOT NULL CHECK (final_odometer_km >= 0), delivered_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  delivered_to_name text NOT NULL CHECK (btrim(delivered_to_name) <> ''), delivered_to_identity_type text NOT NULL,
  delivered_to_identity_last4 char(4) NOT NULL, acknowledgement text NOT NULL CHECK (btrim(acknowledgement) <> ''),
  evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'array'), exceptions jsonb NOT NULL CHECK (jsonb_typeof(exceptions) = 'array'),
  recorded_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, job_id)
);

CREATE TABLE workshopos.closure_override (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, blocker_codes text[] NOT NULL CHECK (cardinality(blocker_codes) > 0),
  reason text NOT NULL CHECK (btrim(reason) <> ''), evidence_ref text NOT NULL CHECK (evidence_ref LIKE 'private/%'),
  status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')), maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  checker_membership_id uuid REFERENCES workshopos.membership(id), recent_reauthenticated_at timestamptz, requested_at timestamptz NOT NULL, approved_at timestamptz,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  CHECK (checker_membership_id IS NULL OR checker_membership_id <> maker_membership_id),
  CHECK ((status <> 'APPROVED') OR (checker_membership_id IS NOT NULL AND recent_reauthenticated_at IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE TABLE workshopos.rendered_document (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, document_type text NOT NULL CHECK (document_type IN ('ESTIMATE','JOB_CARD','MATERIAL_DOCUMENT','INVOICE','RECEIPT','GATE_PASS')),
  source_id uuid NOT NULL, public_reference text NOT NULL, template_version bigint NOT NULL CHECK (template_version > 0),
  artifacts jsonb NOT NULL CHECK (jsonb_typeof(artifacts) = 'array'), private_object_ref text NOT NULL CHECK (private_object_ref LIKE 'private/%'),
  content_sha256 char(64) NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'), rendered_at timestamptz NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, public_reference)
);

CREATE TABLE workshopos.document_qr_token (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, document_id uuid NOT NULL, token_digest char(64) NOT NULL CHECK (token_digest ~ '^[0-9a-f]{64}$'),
  purpose text NOT NULL CHECK (purpose = 'DOCUMENT_VERIFICATION'), expires_at timestamptz NOT NULL, revoked_at timestamptz, revoked_by_membership_id uuid REFERENCES workshopos.membership(id),
  revocation_reason text, created_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (token_digest),
  FOREIGN KEY (tenant_id, branch_id, document_id) REFERENCES workshopos.rendered_document(tenant_id, branch_id, id),
  CHECK ((revoked_at IS NULL) = (revoked_by_membership_id IS NULL)), CHECK (revoked_at IS NULL OR btrim(revocation_reason) <> '')
);

CREATE TABLE workshopos.gate_pass_sequence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, document_type text NOT NULL CHECK (document_type = 'GATE_PASS'), financial_year text NOT NULL,
  last_allocated_number bigint NOT NULL CHECK (last_allocated_number >= 0), PRIMARY KEY (tenant_id, branch_id, document_type, financial_year)
);

CREATE TABLE workshopos.gate_pass (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, visit_id uuid NOT NULL, vehicle_id uuid NOT NULL,
  registration_number text NOT NULL, document_type text NOT NULL DEFAULT 'GATE_PASS' CHECK (document_type = 'GATE_PASS'), financial_year text NOT NULL,
  allocated_number bigint NOT NULL CHECK (allocated_number > 0), document_number text NOT NULL, valid_from timestamptz NOT NULL, valid_until timestamptz NOT NULL,
  release_conditions jsonb NOT NULL CHECK (jsonb_typeof(release_conditions) = 'array'), issued_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  status text NOT NULL CHECK (status IN ('ISSUED','REVOKED','EXPIRED','RELEASED')), released_at timestamptz, resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, document_type, financial_year, allocated_number),
  UNIQUE (tenant_id, document_number), CHECK (valid_until > valid_from), CHECK ((status = 'RELEASED') = (released_at IS NOT NULL))
);
CREATE UNIQUE INDEX one_issued_gate_pass_per_job ON workshopos.gate_pass(tenant_id, branch_id, job_id) WHERE status = 'ISSUED';

CREATE TABLE workshopos.gate_release (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, gate_pass_id uuid NOT NULL, job_id uuid NOT NULL, vehicle_id uuid NOT NULL,
  registration_number text NOT NULL, issued_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), verified_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  verification_mode text NOT NULL CHECK (verification_mode IN ('CAMERA_SCANNER','HARDWARE_SCANNER','MANUAL')), verification_evidence text NOT NULL,
  operational_status text NOT NULL CHECK (operational_status = 'DELIVERED'), financial_record_status_snapshot text NOT NULL CHECK (financial_record_status_snapshot = 'CLOSED'),
  released_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, gate_pass_id), UNIQUE (tenant_id, branch_id, job_id),
  FOREIGN KEY (tenant_id, branch_id, gate_pass_id) REFERENCES workshopos.gate_pass(tenant_id, branch_id, id), CHECK (verified_by_membership_id <> issued_by_membership_id)
);

CREATE TABLE workshopos.delivery_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''), payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299), response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'), audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

CREATE FUNCTION workshopos.allocate_gate_pass_number(p_tenant_id uuid, p_branch_id uuid, p_financial_year text) RETURNS bigint LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_number bigint;
BEGIN
  INSERT INTO workshopos.gate_pass_sequence(tenant_id, branch_id, document_type, financial_year, last_allocated_number)
  VALUES (p_tenant_id, p_branch_id, 'GATE_PASS', p_financial_year, 0) ON CONFLICT DO NOTHING;
  SELECT last_allocated_number + 1 INTO v_number FROM workshopos.gate_pass_sequence
    WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND document_type = 'GATE_PASS' AND financial_year = p_financial_year FOR UPDATE;
  UPDATE workshopos.gate_pass_sequence SET last_allocated_number = v_number
    WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND document_type = 'GATE_PASS' AND financial_year = p_financial_year;
  RETURN v_number;
END $$;

CREATE FUNCTION workshopos.release_gate_pass_atomically(
  p_tenant_id uuid, p_branch_id uuid, p_gate_pass_id uuid, p_release_id uuid, p_verified_by_membership_id uuid,
  p_vehicle_id uuid, p_registration_number text, p_verification_mode text, p_verification_evidence text,
  p_verified_readiness boolean, p_released_at timestamptz, p_audit_reference uuid
) RETURNS workshopos.gate_release LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_pass workshopos.gate_pass; v_release workshopos.gate_release;
BEGIN
  SELECT * INTO v_pass FROM workshopos.gate_pass WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = p_gate_pass_id FOR UPDATE;
  IF NOT FOUND OR v_pass.status <> 'ISSUED' OR p_released_at < v_pass.valid_from OR p_released_at >= v_pass.valid_until THEN RAISE EXCEPTION 'gate pass is not currently valid'; END IF;
  IF NOT p_verified_readiness THEN RAISE EXCEPTION 'closure blockers remain'; END IF;
  IF v_pass.vehicle_id <> p_vehicle_id OR upper(v_pass.registration_number) <> upper(p_registration_number) THEN RAISE EXCEPTION 'vehicle identity mismatch'; END IF;
  IF v_pass.issued_by_membership_id = p_verified_by_membership_id THEN RAISE EXCEPTION 'independent gate verification required'; END IF;
  INSERT INTO workshopos.gate_release(tenant_id, branch_id, id, gate_pass_id, job_id, vehicle_id, registration_number, issued_by_membership_id,
    verified_by_membership_id, verification_mode, verification_evidence, operational_status, financial_record_status_snapshot, released_at, audit_reference)
  VALUES (p_tenant_id, p_branch_id, p_release_id, v_pass.id, v_pass.job_id, v_pass.vehicle_id, v_pass.registration_number, v_pass.issued_by_membership_id,
    p_verified_by_membership_id, p_verification_mode, p_verification_evidence, 'DELIVERED', 'CLOSED', p_released_at, p_audit_reference) RETURNING * INTO v_release;
  UPDATE workshopos.gate_pass SET status = 'RELEASED', released_at = p_released_at, resource_version = resource_version + 1
    WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = p_gate_pass_id;
  RETURN v_release;
END $$;

CREATE FUNCTION workshopos.reject_delivery_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; append compensating or revocation evidence', TG_TABLE_NAME; END $$;
CREATE TRIGGER delivery_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.delivery_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_delivery_append_only_mutation();
CREATE TRIGGER gate_release_append_only BEFORE UPDATE OR DELETE ON workshopos.gate_release FOR EACH ROW EXECUTE FUNCTION workshopos.reject_delivery_append_only_mutation();
CREATE TRIGGER delivery_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.delivery_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_delivery_append_only_mutation();

ALTER TABLE workshopos.delivery_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.delivery_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.closure_override ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.closure_override FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.rendered_document ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.rendered_document FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.document_qr_token ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.document_qr_token FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.gate_pass ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.gate_pass FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.gate_release ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.gate_release FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.delivery_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.delivery_command_receipt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.gate_pass_sequence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.gate_pass_sequence FORCE ROW LEVEL SECURITY;

CREATE POLICY delivery_evidence_isolation ON workshopos.delivery_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY closure_override_isolation ON workshopos.closure_override USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY rendered_document_isolation ON workshopos.rendered_document USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY document_qr_token_isolation ON workshopos.document_qr_token USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY gate_pass_isolation ON workshopos.gate_pass USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY gate_release_isolation ON workshopos.gate_release USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY delivery_command_receipt_isolation ON workshopos.delivery_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY gate_pass_sequence_isolation ON workshopos.gate_pass_sequence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
