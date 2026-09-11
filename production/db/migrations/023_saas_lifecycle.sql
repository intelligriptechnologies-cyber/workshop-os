BEGIN;

-- The API sets these only after validating the separately issued platform token.
CREATE FUNCTION workshopos.current_platform_identity_id() RETURNS text
LANGUAGE sql STABLE PARALLEL SAFE
AS $$ SELECT nullif(current_setting('app.platform_identity_id', true), '') $$;

CREATE FUNCTION workshopos.has_platform_permission(permission_name text) RETURNS boolean
LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT workshopos.current_platform_identity_id() IS NOT NULL
    AND permission_name = ANY(string_to_array(coalesce(nullif(current_setting('app.platform_permissions', true), ''), ''), ','))
$$;

CREATE TABLE workshopos.tenant_lifecycle_event (
  event_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  event_type text NOT NULL CHECK (event_type IN ('PROVISIONED', 'SUSPENDED', 'REACTIVATED', 'PURGE_PENDING', 'PURGED')),
  tenant_version bigint NOT NULL CHECK (tenant_version > 0),
  actor_identity_id text NOT NULL,
  reason text NOT NULL CHECK (length(btrim(reason)) > 0),
  blocked_capabilities text[] NOT NULL DEFAULT '{}',
  authentication_context jsonb NOT NULL,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, tenant_version)
);

CREATE TABLE workshopos.tenant_entitlement_version (
  entitlement_version_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  version bigint NOT NULL CHECK (version > 0),
  plan_id text NOT NULL,
  entitlements text[] NOT NULL,
  quotas jsonb NOT NULL CHECK (jsonb_typeof(quotas) = 'object'),
  effective_at timestamptz NOT NULL,
  actor_identity_id text NOT NULL,
  reason text NOT NULL,
  audit_reference uuid NOT NULL,
  UNIQUE (tenant_id, version)
);

CREATE TABLE workshopos.platform_support_grant (
  support_grant_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  support_identity_id text NOT NULL,
  branch_ids uuid[] NOT NULL,
  permissions text[] NOT NULL,
  reason text NOT NULL CHECK (length(btrim(reason)) > 0),
  status text NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'REJECTED', 'REVOKED', 'EXPIRED')),
  requested_by text NOT NULL,
  approved_by text,
  authentication_context jsonb NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  requested_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL CHECK (expires_at > requested_at),
  CHECK (approved_by IS NULL OR approved_by <> requested_by)
);

CREATE TABLE workshopos.tenant_export (
  export_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  snapshot_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'READY', 'FAILED', 'EXPIRED', 'REVOKED')),
  reason text NOT NULL,
  requested_by text NOT NULL,
  private_object_ref text,
  content_sha256 char(64),
  manifest_sha256 char(64),
  expires_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.tenant_export_manifest (
  manifest_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  export_id uuid NOT NULL REFERENCES workshopos.tenant_export(export_id),
  surface_inventory jsonb NOT NULL,
  record_inventory jsonb NOT NULL,
  manifest_sha256 char(64) NOT NULL,
  content_sha256 char(64) NOT NULL,
  legal_hold_inventory jsonb NOT NULL DEFAULT '[]',
  retention_inventory jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, export_id)
);

CREATE TABLE workshopos.tenant_retention_record (
  retention_record_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  surface_name text NOT NULL CHECK (surface_name IN ('database', 'objects', 'caches', 'queues', 'exports', 'search', 'logs', 'audit')),
  record_reference text NOT NULL,
  record_class text NOT NULL CHECK (record_class IN ('STATUTORY', 'FINANCE', 'AUDIT', 'LINKED_JOB', 'PHOTO', 'GENERAL')),
  closed_at timestamptz,
  retention_until timestamptz,
  warranty_until timestamptz,
  legal_hold_id uuid,
  source_checksum char(64),
  UNIQUE (tenant_id, surface_name, record_reference)
);

CREATE FUNCTION workshopos.default_saas_retention_until(record_class text, closed_at timestamptz) RETURNS timestamptz
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT CASE
    WHEN record_class IN ('STATUTORY', 'FINANCE', 'AUDIT', 'LINKED_JOB') THEN closed_at + INTERVAL '8 years'
    WHEN record_class = 'PHOTO' THEN closed_at + INTERVAL '3 years'
    ELSE NULL
  END
$$;

COMMENT ON COLUMN workshopos.tenant_retention_record.retention_until IS
  'Defaults: closed_at + INTERVAL ''8 years'' for statutory, finance, audit, linked Job; closed_at + INTERVAL ''3 years'' for photos. Warranty and legal_hold extend eligibility.';

CREATE TABLE workshopos.tenant_purge_dry_run (
  dry_run_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  tenant_version bigint NOT NULL,
  snapshot_at timestamptz NOT NULL,
  surface_inventory jsonb NOT NULL,
  eligible_inventory jsonb NOT NULL,
  blocker_inventory jsonb NOT NULL,
  inventory_sha256 char(64) NOT NULL,
  requested_by text NOT NULL,
  reason text NOT NULL,
  audit_reference uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.tenant_purge_approval (
  purge_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  dry_run_id uuid NOT NULL REFERENCES workshopos.tenant_purge_dry_run(dry_run_id),
  dry_run_sha256 char(64) NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXECUTING', 'COMPLETE', 'FAILED')),
  requested_by text NOT NULL,
  approved_by text,
  request_authentication_context jsonb NOT NULL,
  approval_authentication_context jsonb,
  reason text NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK (approved_by IS NULL OR approved_by <> requested_by),
  UNIQUE (tenant_id, dry_run_id)
);

CREATE TABLE workshopos.tenant_purge_evidence (
  purge_evidence_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  purge_id uuid REFERENCES workshopos.tenant_purge_approval(purge_id),
  action text NOT NULL,
  surface_name text,
  affected_count bigint NOT NULL DEFAULT 0 CHECK (affected_count >= 0),
  dry_run_sha256 char(64) NOT NULL,
  evidence jsonb NOT NULL,
  actor_identity_id text NOT NULL,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.saas_command_receipt (
  command_receipt_id uuid PRIMARY KEY,
  tenant_id uuid REFERENCES workshopos.tenant(tenant_id),
  actor_identity_id text NOT NULL,
  idempotency_key text NOT NULL,
  payload_fingerprint char(64) NOT NULL,
  committed_version bigint NOT NULL CHECK (committed_version >= 0),
  response_status integer NOT NULL,
  response_body jsonb NOT NULL,
  audit_reference uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (actor_identity_id, idempotency_key)
);

CREATE TABLE workshopos.saas_worker_effect (
  worker_effect_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  effect_key text NOT NULL,
  effect_type text NOT NULL CHECK (effect_type IN ('TENANT_EXPORT', 'TENANT_PURGE')),
  status text NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'RETRY_SCHEDULED', 'COMPLETE', 'DEAD_LETTER')),
  available_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  claimed_at timestamptz,
  completed_at timestamptz,
  last_error text,
  UNIQUE (tenant_id, effect_key)
);

CREATE FUNCTION workshopos.reject_saas_append_only_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'SaaS lifecycle/export/purge evidence is append-only';
END $$;

CREATE TRIGGER tenant_lifecycle_event_append_only BEFORE UPDATE OR DELETE ON workshopos.tenant_lifecycle_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_saas_append_only_mutation();
CREATE TRIGGER tenant_entitlement_version_append_only BEFORE UPDATE OR DELETE ON workshopos.tenant_entitlement_version FOR EACH ROW EXECUTE FUNCTION workshopos.reject_saas_append_only_mutation();
CREATE TRIGGER tenant_export_manifest_append_only BEFORE UPDATE OR DELETE ON workshopos.tenant_export_manifest FOR EACH ROW EXECUTE FUNCTION workshopos.reject_saas_append_only_mutation();
CREATE TRIGGER tenant_purge_dry_run_append_only BEFORE UPDATE OR DELETE ON workshopos.tenant_purge_dry_run FOR EACH ROW EXECUTE FUNCTION workshopos.reject_saas_append_only_mutation();
CREATE TRIGGER tenant_purge_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.tenant_purge_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_saas_append_only_mutation();
CREATE TRIGGER saas_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.saas_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_saas_append_only_mutation();

ALTER TABLE workshopos.tenant_lifecycle_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_lifecycle_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_entitlement_version ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_entitlement_version FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.platform_support_grant ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_support_grant FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_export ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_export FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_export_manifest ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_export_manifest FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_retention_record ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_retention_record FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_purge_dry_run ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_purge_dry_run FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_purge_approval ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_purge_approval FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant_purge_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tenant_purge_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.saas_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.saas_command_receipt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.saas_worker_effect ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.saas_worker_effect FORCE ROW LEVEL SECURITY;

-- Extend the S02 tenant-owned tables with the independently authenticated platform path.
CREATE POLICY tenant_platform_authorized ON workshopos.tenant
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.tenant.lifecycle') OR workshopos.has_platform_permission('platform.tenant.export') OR workshopos.has_platform_permission('platform.purge.request') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.tenant.lifecycle') OR workshopos.has_platform_permission('platform.purge.approve'));
CREATE POLICY branch_platform_provision ON workshopos.branch
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.tenant.lifecycle') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision'));
CREATE POLICY role_template_platform_provision ON workshopos.role_template
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision'));
CREATE POLICY membership_platform_provision ON workshopos.membership
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.tenant.lifecycle') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision'));
CREATE POLICY membership_role_platform_provision ON workshopos.membership_role
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision'));
CREATE POLICY membership_permission_platform_provision ON workshopos.membership_permission
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision'));
CREATE POLICY security_policy_platform_provision ON workshopos.security_policy
  USING (workshopos.has_platform_permission('platform.tenant.provision') OR workshopos.has_platform_permission('platform.purge.approve'))
  WITH CHECK (workshopos.has_platform_permission('platform.tenant.provision'));

CREATE POLICY tenant_lifecycle_platform ON workshopos.tenant_lifecycle_event USING (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.tenant.lifecycle')) WITH CHECK (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.tenant.lifecycle'));
CREATE POLICY tenant_entitlement_platform ON workshopos.tenant_entitlement_version USING (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.tenant.lifecycle')) WITH CHECK (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.tenant.lifecycle'));
CREATE POLICY support_grant_platform ON workshopos.platform_support_grant USING (
  tenant_id = workshopos.current_tenant_id()
  OR (workshopos.has_platform_permission('platform.support.use') AND support_identity_id = workshopos.current_platform_identity_id())
  OR workshopos.has_platform_permission('platform.support.approve')
) WITH CHECK (workshopos.has_platform_permission('platform.support.grant') OR workshopos.has_platform_permission('platform.support.approve'));
CREATE POLICY tenant_export_platform ON workshopos.tenant_export USING (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.tenant.export')) WITH CHECK (workshopos.has_platform_permission('platform.tenant.export'));
CREATE POLICY tenant_export_manifest_platform ON workshopos.tenant_export_manifest USING (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.tenant.export')) WITH CHECK (workshopos.has_platform_permission('platform.tenant.export'));
CREATE POLICY tenant_retention_platform ON workshopos.tenant_retention_record USING (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.purge.request')) WITH CHECK (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.purge.request'));
CREATE POLICY tenant_purge_dry_run_platform ON workshopos.tenant_purge_dry_run USING (workshopos.has_platform_permission('platform.purge.request') OR workshopos.has_platform_permission('platform.purge.approve')) WITH CHECK (workshopos.has_platform_permission('platform.purge.request'));
CREATE POLICY tenant_purge_approval_platform ON workshopos.tenant_purge_approval USING (workshopos.has_platform_permission('platform.purge.request') OR workshopos.has_platform_permission('platform.purge.approve')) WITH CHECK (workshopos.has_platform_permission('platform.purge.request') OR workshopos.has_platform_permission('platform.purge.approve'));
CREATE POLICY tenant_purge_evidence_platform ON workshopos.tenant_purge_evidence USING (workshopos.has_platform_permission('platform.purge.request') OR workshopos.has_platform_permission('platform.purge.approve')) WITH CHECK (workshopos.has_platform_permission('platform.purge.request') OR workshopos.has_platform_permission('platform.purge.approve'));
CREATE POLICY saas_command_receipt_scope ON workshopos.saas_command_receipt USING (tenant_id = workshopos.current_tenant_id() OR actor_identity_id = workshopos.current_platform_identity_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id() OR actor_identity_id = workshopos.current_platform_identity_id());
CREATE POLICY saas_worker_effect_platform ON workshopos.saas_worker_effect USING (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.worker')) WITH CHECK (tenant_id = workshopos.current_tenant_id() OR workshopos.has_platform_permission('platform.worker'));

CREATE FUNCTION workshopos.claim_saas_worker_effects(batch_size integer)
RETURNS SETOF workshopos.saas_worker_effect
LANGUAGE sql SECURITY DEFINER SET search_path = workshopos, pg_temp AS $$
  WITH claimed AS (
    SELECT worker_effect_id FROM workshopos.saas_worker_effect
    WHERE status IN ('PENDING', 'RETRY_SCHEDULED') AND available_at <= transaction_timestamp()
    ORDER BY available_at, worker_effect_id
    FOR UPDATE SKIP LOCKED LIMIT batch_size
  )
  UPDATE workshopos.saas_worker_effect effect SET status = 'PROCESSING', claimed_at = transaction_timestamp(), attempt_count = effect.attempt_count + 1
  FROM claimed WHERE effect.worker_effect_id = claimed.worker_effect_id RETURNING effect.*
$$;

COMMIT;
