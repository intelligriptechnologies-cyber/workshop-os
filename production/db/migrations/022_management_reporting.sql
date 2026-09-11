BEGIN;

CREATE TABLE workshopos.report_definition (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, report_key text NOT NULL,
  definition_version text NOT NULL, category text NOT NULL CHECK (category IN ('OPERATIONAL','INVENTORY','PROFITABILITY','FINANCE','CUSTOMER','STAFF','QC_REWORK','AUDIT')),
  metric_definitions jsonb NOT NULL CHECK (jsonb_typeof(metric_definitions) = 'object'), protected_fields text[] NOT NULL DEFAULT '{}',
  effective_from timestamptz NOT NULL, retired_at timestamptz, PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, report_key, definition_version)
);

CREATE TABLE workshopos.report_fact (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, category text NOT NULL,
  metric_key text NOT NULL, metric_value numeric(30,6) NOT NULL, occurred_at timestamptz NOT NULL,
  source_ledger_ref text NOT NULL, drill_record jsonb NOT NULL CHECK (jsonb_typeof(drill_record) = 'object'),
  recorded_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, source_ledger_ref, metric_key)
);

CREATE TABLE workshopos.report_export (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, report_key text NOT NULL,
  definition_version text NOT NULL, requested_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  as_of timestamptz NOT NULL, filters jsonb NOT NULL CHECK (jsonb_typeof(filters) = 'object'), format text NOT NULL CHECK (format IN ('CSV','JSON')),
  status text NOT NULL CHECK (status IN ('PENDING','PROCESSING','READY','RETRY_SCHEDULED','DEAD_LETTER','REVOKED','EXPIRED')),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0), available_at timestamptz NOT NULL,
  expires_at timestamptz, revoked_at timestamptz, revocation_reason text, failure_reason text,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), requested_at timestamptz NOT NULL,
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  CHECK ((status <> 'READY') OR expires_at IS NOT NULL), CHECK ((status <> 'REVOKED') OR (revoked_at IS NOT NULL AND btrim(revocation_reason) <> ''))
);

CREATE TABLE workshopos.report_export_artifact (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, export_id uuid NOT NULL,
  private_object_ref text NOT NULL CHECK (private_object_ref LIKE 'private/%'),
  content_sha256 char(64) NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
  manifest_sha256 char(64) NOT NULL CHECK (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  watermark text NOT NULL, manifest jsonb NOT NULL CHECK (jsonb_typeof(manifest) = 'object'), expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, export_id),
  UNIQUE (tenant_id, private_object_ref), FOREIGN KEY (tenant_id, branch_id, export_id) REFERENCES workshopos.report_export(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.report_export_audit (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, export_id uuid NOT NULL,
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id), action text NOT NULL CHECK (action IN ('REQUESTED','GENERATED','DOWNLOADED','REVOKED','REPLAYED','FAILED')),
  reason text, occurred_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), FOREIGN KEY (tenant_id, branch_id, export_id) REFERENCES workshopos.report_export(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.report_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'), response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'), audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE workshopos.report_worker_effect (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, export_id uuid NOT NULL,
  effect_key text NOT NULL CHECK (btrim(effect_key) <> ''), status text NOT NULL CHECK (status IN ('PENDING','CLAIMED','RETRY_SCHEDULED','DELIVERED','DEAD_LETTER')),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0), available_at timestamptz NOT NULL,
  claimed_at timestamptz, delivered_at timestamptz, last_error text, resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, effect_key),
  FOREIGN KEY (tenant_id, branch_id, export_id) REFERENCES workshopos.report_export(tenant_id, branch_id, id)
);

CREATE FUNCTION workshopos.claim_report_worker_effect(p_tenant_id uuid, p_branch_ids uuid[], p_now timestamptz)
RETURNS SETOF workshopos.report_worker_effect LANGUAGE plpgsql VOLATILE AS $$
BEGIN
  RETURN QUERY UPDATE workshopos.report_worker_effect e
    SET status = 'CLAIMED', claimed_at = p_now, attempt_count = attempt_count + 1, resource_version = resource_version + 1
  WHERE (e.tenant_id, e.branch_id, e.id) IN (
    SELECT tenant_id, branch_id, id FROM workshopos.report_worker_effect
    WHERE tenant_id = p_tenant_id AND branch_id = ANY(p_branch_ids)
      AND status IN ('PENDING','RETRY_SCHEDULED') AND available_at <= p_now
    ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT 25
  ) RETURNING e.*;
END $$;

CREATE FUNCTION workshopos.reject_report_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only', TG_TABLE_NAME; END $$;
CREATE TRIGGER report_fact_append_only BEFORE UPDATE OR DELETE ON workshopos.report_fact FOR EACH ROW EXECUTE FUNCTION workshopos.reject_report_append_only_mutation();
CREATE TRIGGER report_export_artifact_append_only BEFORE UPDATE OR DELETE ON workshopos.report_export_artifact FOR EACH ROW EXECUTE FUNCTION workshopos.reject_report_append_only_mutation();
CREATE TRIGGER report_export_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.report_export_audit FOR EACH ROW EXECUTE FUNCTION workshopos.reject_report_append_only_mutation();
CREATE TRIGGER report_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.report_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_report_append_only_mutation();

ALTER TABLE workshopos.report_definition ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_definition FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.report_fact ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_fact FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.report_export ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_export FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.report_export_artifact ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_export_artifact FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.report_export_audit ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_export_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.report_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_command_receipt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.report_worker_effect ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.report_worker_effect FORCE ROW LEVEL SECURITY;

CREATE POLICY report_definition_isolation ON workshopos.report_definition USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY report_fact_isolation ON workshopos.report_fact USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY report_export_isolation ON workshopos.report_export USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY report_export_artifact_isolation ON workshopos.report_export_artifact USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY report_export_audit_isolation ON workshopos.report_export_audit USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY report_command_receipt_isolation ON workshopos.report_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY report_worker_effect_isolation ON workshopos.report_worker_effect USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
