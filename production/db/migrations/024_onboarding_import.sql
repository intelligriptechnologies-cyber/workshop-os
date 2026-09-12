BEGIN;

CREATE TABLE workshopos.onboarding_import_batch (
  import_batch_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL REFERENCES workshopos.branch(id),
  source_system text NOT NULL CHECK (source_system NOT IN ('DEMO_SQLITE', 'BROWSER_LOCAL_SQLITE')),
  source_extract_id text NOT NULL,
  source_schema text NOT NULL CHECK (source_schema = 'workshopos-onboarding'),
  source_version text NOT NULL,
  source_sha256 char(64) NOT NULL,
  batch_fingerprint char(64) NOT NULL,
  status text NOT NULL CHECK (status IN ('STAGED', 'COMMITTED', 'RECONCILIATION_BLOCKED', 'RECONCILED', 'ACCEPTED')),
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, branch_id, source_system, source_extract_id),
  UNIQUE (tenant_id, branch_id, import_batch_id),
  UNIQUE (tenant_id, branch_id, batch_fingerprint)
);

CREATE TABLE workshopos.onboarding_import_mapping (
  import_mapping_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  import_batch_id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('CUSTOMER', 'CONTACT', 'VEHICLE', 'OWNERSHIP', 'ITEM', 'LOT', 'OPENING_STOCK', 'ADVANCE', 'PAYMENT', 'CREDIT', 'OPEN_DOCUMENT')),
  source_to_target_fields jsonb NOT NULL CHECK (jsonb_typeof(source_to_target_fields) = 'object'),
  mapping_sha256 char(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, import_batch_id) REFERENCES workshopos.onboarding_import_batch(tenant_id, branch_id, import_batch_id),
  UNIQUE (tenant_id, branch_id, import_batch_id, entity_type)
);

CREATE TABLE workshopos.onboarding_import_staged_row (
  staged_row_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  import_batch_id uuid NOT NULL,
  source_row_number bigint NOT NULL CHECK (source_row_number > 0),
  entity_type text NOT NULL,
  source_key text NOT NULL,
  normalized_source_key text NOT NULL CHECK (length(normalized_source_key) > 0),
  source_values jsonb NOT NULL CHECK (jsonb_typeof(source_values) = 'object'),
  source_row_sha256 char(64) NOT NULL,
  quantity numeric(24, 6),
  quantity_uom text,
  stock_value_minor bigint,
  amount_minor bigint,
  currency char(3),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, import_batch_id) REFERENCES workshopos.onboarding_import_batch(tenant_id, branch_id, import_batch_id),
  UNIQUE (tenant_id, branch_id, import_batch_id, source_row_number),
  CHECK (quantity IS NULL OR quantity >= 0),
  CHECK (stock_value_minor IS NULL OR stock_value_minor >= 0),
  CHECK (amount_minor IS NULL OR amount_minor >= 0)
);

CREATE TABLE workshopos.onboarding_import_dry_run_manifest (
  dry_run_manifest_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  import_batch_id uuid NOT NULL,
  batch_fingerprint char(64) NOT NULL,
  manifest_sha256 char(64) NOT NULL,
  accepted_count bigint NOT NULL CHECK (accepted_count >= 0),
  rejected_count bigint NOT NULL CHECK (rejected_count >= 0),
  warning_count bigint NOT NULL CHECK (warning_count >= 0),
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, import_batch_id) REFERENCES workshopos.onboarding_import_batch(tenant_id, branch_id, import_batch_id),
  UNIQUE (tenant_id, branch_id, dry_run_manifest_id),
  UNIQUE (tenant_id, branch_id, import_batch_id, manifest_sha256)
);

CREATE TABLE workshopos.onboarding_import_row_result (
  row_result_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  dry_run_manifest_id uuid NOT NULL,
  staged_row_id uuid NOT NULL REFERENCES workshopos.onboarding_import_staged_row(staged_row_id),
  result text NOT NULL CHECK (result IN ('ACCEPTED', 'REJECTED', 'WARNING')),
  actionable_code text NOT NULL,
  normalized_source_key text NOT NULL,
  intended_target_id text,
  intended_effect jsonb,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, dry_run_manifest_id) REFERENCES workshopos.onboarding_import_dry_run_manifest(tenant_id, branch_id, dry_run_manifest_id),
  UNIQUE (tenant_id, branch_id, dry_run_manifest_id, staged_row_id)
);

CREATE TABLE workshopos.onboarding_import_reconciliation (
  reconciliation_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  import_batch_id uuid NOT NULL,
  dry_run_manifest_id uuid NOT NULL,
  batch_fingerprint char(64) NOT NULL,
  manifest_sha256 char(64) NOT NULL,
  expected_summary jsonb NOT NULL,
  actual_summary jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('BLOCKED', 'MATCHED', 'APPROVED_DIFFERENCES')),
  reconciliation_sha256 char(64) NOT NULL,
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, import_batch_id) REFERENCES workshopos.onboarding_import_batch(tenant_id, branch_id, import_batch_id),
  FOREIGN KEY (tenant_id, branch_id, dry_run_manifest_id) REFERENCES workshopos.onboarding_import_dry_run_manifest(tenant_id, branch_id, dry_run_manifest_id),
  UNIQUE (tenant_id, branch_id, reconciliation_id),
  UNIQUE (tenant_id, branch_id, import_batch_id, reconciliation_sha256)
);

CREATE TABLE workshopos.onboarding_import_reconciliation_difference (
  reconciliation_difference_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  reconciliation_id uuid NOT NULL,
  difference_code text NOT NULL,
  expected_value text NOT NULL,
  actual_value text NOT NULL,
  exact_difference text NOT NULL,
  resolution text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, reconciliation_id) REFERENCES workshopos.onboarding_import_reconciliation(tenant_id, branch_id, reconciliation_id),
  UNIQUE (tenant_id, branch_id, reconciliation_id, difference_code),
  UNIQUE (tenant_id, branch_id, reconciliation_id, reconciliation_difference_id)
);

CREATE TABLE workshopos.onboarding_import_difference_approval (
  difference_approval_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  reconciliation_id uuid NOT NULL,
  reconciliation_difference_id uuid NOT NULL,
  approved_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  approval_reason text NOT NULL CHECK (length(btrim(approval_reason)) > 0),
  approval_evidence jsonb NOT NULL,
  audit_reference uuid NOT NULL,
  approved_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, reconciliation_id, reconciliation_difference_id) REFERENCES workshopos.onboarding_import_reconciliation_difference(tenant_id, branch_id, reconciliation_id, reconciliation_difference_id),
  UNIQUE (tenant_id, branch_id, reconciliation_difference_id)
);

CREATE TABLE workshopos.onboarding_import_command_receipt (
  command_receipt_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL REFERENCES workshopos.branch(id),
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  idempotency_key text NOT NULL,
  payload_fingerprint char(64) NOT NULL,
  committed_version bigint NOT NULL CHECK (committed_version >= 0),
  response_status integer NOT NULL,
  response_body jsonb NOT NULL,
  audit_reference uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, membership_id, idempotency_key)
);

CREATE TABLE workshopos.onboarding_import_effect (
  import_effect_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  import_batch_id uuid NOT NULL,
  dry_run_manifest_id uuid NOT NULL,
  entity_type text NOT NULL,
  normalized_source_key text NOT NULL,
  target_id text NOT NULL,
  effect_type text NOT NULL CHECK (effect_type IN ('CREATE', 'LINK_EXISTING')),
  effect_payload jsonb NOT NULL,
  audit_reference uuid NOT NULL,
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, import_batch_id) REFERENCES workshopos.onboarding_import_batch(tenant_id, branch_id, import_batch_id),
  FOREIGN KEY (tenant_id, branch_id, dry_run_manifest_id) REFERENCES workshopos.onboarding_import_dry_run_manifest(tenant_id, branch_id, dry_run_manifest_id),
  UNIQUE (tenant_id, branch_id, entity_type, normalized_source_key),
  UNIQUE (tenant_id, branch_id, target_id)
);

CREATE TABLE workshopos.onboarding_import_acceptance (
  import_acceptance_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  import_batch_id uuid NOT NULL,
  reconciliation_id uuid NOT NULL,
  reconciliation_sha256 char(64) NOT NULL,
  accepted_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  audit_reference uuid NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id, import_batch_id) REFERENCES workshopos.onboarding_import_batch(tenant_id, branch_id, import_batch_id),
  FOREIGN KEY (tenant_id, branch_id, reconciliation_id) REFERENCES workshopos.onboarding_import_reconciliation(tenant_id, branch_id, reconciliation_id),
  UNIQUE (tenant_id, branch_id, import_batch_id)
);

CREATE FUNCTION workshopos.lock_onboarding_import_batch(p_tenant_id uuid, p_branch_id uuid, p_import_batch_id uuid)
RETURNS workshopos.onboarding_import_batch
LANGUAGE sql SECURITY INVOKER SET search_path = workshopos, pg_temp AS $$
  SELECT batch.* FROM workshopos.onboarding_import_batch batch
  WHERE batch.tenant_id = p_tenant_id AND batch.branch_id = p_branch_id AND batch.import_batch_id = p_import_batch_id
  FOR UPDATE
$$;

CREATE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Onboarding import source, manifest, reconciliation, command, effect, and acceptance evidence is append-only';
END $$;

CREATE TRIGGER onboarding_import_mapping_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_mapping FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_staged_row_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_staged_row FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_row_result_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_row_result FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_manifest_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_dry_run_manifest FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_reconciliation_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_reconciliation FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_reconciliation_difference_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_reconciliation_difference FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_difference_approval_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_difference_approval FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_effect_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_effect FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();
CREATE TRIGGER onboarding_import_acceptance_append_only BEFORE UPDATE OR DELETE ON workshopos.onboarding_import_acceptance FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_onboarding_import_evidence_mutation();

ALTER TABLE workshopos.onboarding_import_batch ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_batch FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_mapping ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_mapping FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_staged_row ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_staged_row FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_row_result ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_row_result FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_dry_run_manifest ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_dry_run_manifest FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_reconciliation ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_reconciliation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_reconciliation_difference ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_reconciliation_difference FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_difference_approval ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_difference_approval FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_command_receipt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_effect ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_effect FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.onboarding_import_acceptance ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.onboarding_import_acceptance FORCE ROW LEVEL SECURITY;

CREATE POLICY onboarding_import_batch_isolation ON workshopos.onboarding_import_batch USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_mapping_isolation ON workshopos.onboarding_import_mapping USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_staged_row_isolation ON workshopos.onboarding_import_staged_row USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_row_result_isolation ON workshopos.onboarding_import_row_result USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_manifest_isolation ON workshopos.onboarding_import_dry_run_manifest USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_reconciliation_isolation ON workshopos.onboarding_import_reconciliation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_difference_isolation ON workshopos.onboarding_import_reconciliation_difference USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_difference_approval_isolation ON workshopos.onboarding_import_difference_approval USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_command_isolation ON workshopos.onboarding_import_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_effect_isolation ON workshopos.onboarding_import_effect USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY onboarding_import_acceptance_isolation ON workshopos.onboarding_import_acceptance USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
