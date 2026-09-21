BEGIN;

CREATE TABLE workshopos.platform_identity (
  identity_id text PRIMARY KEY,
  display_name text NOT NULL CHECK (btrim(display_name) <> ''),
  permissions text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

ALTER TABLE workshopos.membership
  ADD CONSTRAINT membership_tenant_id_id_v12_uq UNIQUE (tenant_id, id);

ALTER TABLE workshopos.platform_support_grant
  ADD COLUMN approval_reason text,
  ADD COLUMN approval_authentication_context jsonb,
  ADD COLUMN approved_at timestamptz;

INSERT INTO workshopos.platform_identity(identity_id, display_name, permissions, active)
SELECT identity_id, 'Migrated platform identity', '{}', false
FROM (
  SELECT support_identity_id AS identity_id FROM workshopos.platform_support_grant
  UNION SELECT requested_by FROM workshopos.platform_support_grant
  UNION SELECT approved_by FROM workshopos.platform_support_grant WHERE approved_by IS NOT NULL
) legacy
ON CONFLICT (identity_id) DO NOTHING;

UPDATE workshopos.platform_support_grant
SET approval_reason = 'Migrated legacy approval evidence',
    approval_authentication_context = '{"migrated":true,"mfa":"unverified"}'::jsonb,
    approved_at = requested_at
WHERE status IN ('ACTIVE','REJECTED') AND approved_by IS NOT NULL;

UPDATE workshopos.platform_support_grant
SET status = 'REVOKED', version = version + 1
WHERE status IN ('ACTIVE','REJECTED') AND approved_by IS NULL;

ALTER TABLE workshopos.platform_support_grant
  ADD CONSTRAINT platform_support_identity_fk FOREIGN KEY (support_identity_id)
    REFERENCES workshopos.platform_identity(identity_id),
  ADD CONSTRAINT platform_support_requester_fk FOREIGN KEY (requested_by)
    REFERENCES workshopos.platform_identity(identity_id),
  ADD CONSTRAINT platform_support_approver_fk FOREIGN KEY (approved_by)
    REFERENCES workshopos.platform_identity(identity_id),
  ADD CONSTRAINT platform_support_permissions_v12_ck
    CHECK (cardinality(permissions) > 0 AND permissions <@ ARRAY['tenant.emulate']::text[]),
  ADD CONSTRAINT platform_support_expiry_v12_ck
    CHECK (expires_at <= requested_at + interval '24 hours'),
  ADD CONSTRAINT platform_support_approval_v12_ck CHECK (
    status NOT IN ('ACTIVE','REJECTED') OR
    (approved_by IS NOT NULL AND approved_at IS NOT NULL AND
     btrim(approval_reason) <> '' AND approval_authentication_context IS NOT NULL)
  );

CREATE FUNCTION workshopos.validate_platform_support_branches() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF cardinality(NEW.branch_ids) = 0 OR
     (SELECT count(DISTINCT b.id) FROM workshopos.branch b
       WHERE b.tenant_id = NEW.tenant_id AND b.id = ANY(NEW.branch_ids) AND b.active)
       <> cardinality(NEW.branch_ids) THEN
    RAISE EXCEPTION 'Support grant branches must be active and belong to its tenant';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER platform_support_branch_scope
  BEFORE INSERT OR UPDATE OF tenant_id, branch_ids ON workshopos.platform_support_grant
  FOR EACH ROW EXECUTE FUNCTION workshopos.validate_platform_support_branches();

CREATE TABLE workshopos.platform_daily_log (
  log_id uuid PRIMARY KEY,
  log_date date NOT NULL,
  object_key text NOT NULL UNIQUE,
  content bytea NOT NULL,
  content_type text NOT NULL DEFAULT 'application/x-ndjson',
  checksum_sha256 char(64) NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  online_until timestamptz NOT NULL,
  recoverable_until timestamptz NOT NULL,
  CHECK (online_until >= log_date::timestamptz + interval '30 days'),
  CHECK (recoverable_until >= log_date::timestamptz + interval '90 days'),
  CHECK (recoverable_until >= online_until)
);

CREATE TABLE workshopos.platform_log_access_audit (
  audit_id uuid PRIMARY KEY,
  log_id uuid NOT NULL REFERENCES workshopos.platform_daily_log(log_id),
  platform_actor_id text NOT NULL REFERENCES workshopos.platform_identity(identity_id),
  action text NOT NULL CHECK (action IN ('DOWNLOAD','RECOVERY_REQUESTED','RECOVERY_EXERCISED')),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  outcome text NOT NULL CHECK (outcome IN ('ALLOWED','DENIED','VERIFIED')),
  trace_id text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.platform_log_recovery (
  recovery_id uuid PRIMARY KEY,
  log_id uuid NOT NULL REFERENCES workshopos.platform_daily_log(log_id),
  requested_by text NOT NULL REFERENCES workshopos.platform_identity(identity_id),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  status text NOT NULL CHECK (status IN ('RESTORED','VERIFIED')),
  restored_checksum_sha256 char(64) NOT NULL,
  restored_until timestamptz NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  verified_at timestamptz,
  UNIQUE (log_id, recovery_id)
);

CREATE TABLE workshopos.platform_emulation (
  emulation_id uuid PRIMARY KEY,
  support_grant_id uuid NOT NULL REFERENCES workshopos.platform_support_grant(support_grant_id),
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  effective_membership_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  requested_by text NOT NULL REFERENCES workshopos.platform_identity(identity_id),
  approved_by text REFERENCES workshopos.platform_identity(identity_id),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  approval_reason text,
  status text NOT NULL CHECK (status IN ('PENDING','APPROVED','ACTIVE','EXPIRED','REVOKED','REJECTED')),
  request_authentication_context jsonb NOT NULL,
  approval_authentication_context jsonb,
  requested_at timestamptz NOT NULL,
  approved_at timestamptz,
  started_at timestamptz,
  expires_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK (approved_by IS NULL OR approved_by <> requested_by),
  CHECK (status NOT IN ('APPROVED','ACTIVE') OR
    (approved_by IS NOT NULL AND approved_at IS NOT NULL AND
     btrim(approval_reason) <> '' AND approval_authentication_context IS NOT NULL)),
  CHECK (expires_at IS NULL OR (started_at IS NOT NULL AND expires_at = started_at + interval '15 minutes')),
  UNIQUE (tenant_id, emulation_id),
  FOREIGN KEY (tenant_id, effective_membership_id)
    REFERENCES workshopos.membership(tenant_id, id),
  FOREIGN KEY (tenant_id, branch_id)
    REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.platform_emulated_action (
  action_id uuid PRIMARY KEY,
  emulation_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  platform_actor_id text NOT NULL REFERENCES workshopos.platform_identity(identity_id),
  effective_membership_id uuid NOT NULL,
  method text NOT NULL,
  route text NOT NULL,
  response_status integer NOT NULL,
  trace_id text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, emulation_id)
    REFERENCES workshopos.platform_emulation(tenant_id, emulation_id),
  FOREIGN KEY (tenant_id, branch_id)
    REFERENCES workshopos.branch(tenant_id, id),
  FOREIGN KEY (tenant_id, effective_membership_id)
    REFERENCES workshopos.membership(tenant_id, id)
);

CREATE FUNCTION workshopos.reject_platform_append_only_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Platform log and dual-attribution evidence is append-only'; END $$;
CREATE TRIGGER platform_daily_log_append_only BEFORE UPDATE OR DELETE ON workshopos.platform_daily_log FOR EACH ROW EXECUTE FUNCTION workshopos.reject_platform_append_only_mutation();
CREATE TRIGGER platform_log_access_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.platform_log_access_audit FOR EACH ROW EXECUTE FUNCTION workshopos.reject_platform_append_only_mutation();
CREATE TRIGGER platform_log_recovery_append_only BEFORE UPDATE OR DELETE ON workshopos.platform_log_recovery FOR EACH ROW EXECUTE FUNCTION workshopos.reject_platform_append_only_mutation();
CREATE TRIGGER platform_emulated_action_append_only BEFORE UPDATE OR DELETE ON workshopos.platform_emulated_action FOR EACH ROW EXECUTE FUNCTION workshopos.reject_platform_append_only_mutation();

CREATE FUNCTION workshopos.reject_platform_scope_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(OLD.support_grant_id, OLD.tenant_id, OLD.effective_membership_id,
         OLD.branch_id, OLD.requested_by, OLD.reason, OLD.request_authentication_context)
     IS DISTINCT FROM
     ROW(NEW.support_grant_id, NEW.tenant_id, NEW.effective_membership_id,
         NEW.branch_id, NEW.requested_by, NEW.reason, NEW.request_authentication_context) THEN
    RAISE EXCEPTION 'Emulation identity and scope are immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER platform_emulation_scope_immutable
  BEFORE UPDATE ON workshopos.platform_emulation FOR EACH ROW
  EXECUTE FUNCTION workshopos.reject_platform_scope_mutation();

CREATE INDEX platform_log_date_idx ON workshopos.platform_daily_log (log_date DESC);
CREATE INDEX platform_emulation_actor_status_idx ON workshopos.platform_emulation (requested_by, status, requested_at DESC);
CREATE INDEX platform_emulated_action_trace_idx ON workshopos.platform_emulated_action (trace_id);

ALTER TABLE workshopos.platform_identity ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_identity FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.platform_daily_log ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_daily_log FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.platform_log_access_audit ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_log_access_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.platform_log_recovery ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_log_recovery FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.platform_emulation ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_emulation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.platform_emulated_action ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.platform_emulated_action FORCE ROW LEVEL SECURITY;

CREATE POLICY platform_identity_self ON workshopos.platform_identity USING (identity_id=workshopos.current_platform_identity_id());
CREATE POLICY platform_identity_grant_read ON workshopos.platform_identity
  FOR SELECT USING (workshopos.has_platform_permission('platform.support.grant'));
CREATE POLICY platform_logs_read ON workshopos.platform_daily_log USING (workshopos.has_platform_permission('platform.logs.read') OR workshopos.has_platform_permission('platform.logs.recover'));
CREATE POLICY platform_log_audit_access ON workshopos.platform_log_access_audit USING (workshopos.has_platform_permission('platform.logs.read') OR workshopos.has_platform_permission('platform.logs.recover')) WITH CHECK (workshopos.has_platform_permission('platform.logs.read') OR workshopos.has_platform_permission('platform.logs.recover'));
CREATE POLICY platform_log_recovery_access ON workshopos.platform_log_recovery USING (workshopos.has_platform_permission('platform.logs.recover')) WITH CHECK (workshopos.has_platform_permission('platform.logs.recover'));
CREATE POLICY platform_emulation_access ON workshopos.platform_emulation USING (
  (workshopos.has_platform_permission('platform.emulation.request') AND requested_by=workshopos.current_platform_identity_id())
  OR workshopos.has_platform_permission('platform.emulation.approve')
  OR (workshopos.has_platform_permission('platform.emulation.use') AND requested_by=workshopos.current_platform_identity_id())
) WITH CHECK (workshopos.has_platform_permission('platform.emulation.request') OR workshopos.has_platform_permission('platform.emulation.approve') OR workshopos.has_platform_permission('platform.emulation.use'));
CREATE POLICY platform_emulated_action_access ON workshopos.platform_emulated_action USING (platform_actor_id=workshopos.current_platform_identity_id() OR workshopos.has_platform_permission('platform.emulation.approve')) WITH CHECK (platform_actor_id=workshopos.current_platform_identity_id());

CREATE POLICY tenant_platform_workspace_read ON workshopos.tenant USING (workshopos.has_platform_permission('platform.tenants.read') OR workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY branch_platform_workspace_read ON workshopos.branch USING (workshopos.has_platform_permission('platform.tenants.read') OR workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY membership_platform_workspace_read ON workshopos.membership USING (workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY membership_role_platform_workspace_read ON workshopos.membership_role USING (workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY membership_permission_platform_workspace_read ON workshopos.membership_permission USING (workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY role_template_platform_workspace_read ON workshopos.role_template USING (workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY membership_branch_platform_workspace_read ON workshopos.membership_branch USING (workshopos.has_platform_permission('platform.emulation.request'));
CREATE POLICY membership_warehouse_platform_workspace_read ON workshopos.membership_inventory_warehouse USING (workshopos.has_platform_permission('platform.emulation.request') OR workshopos.has_platform_permission('platform.emulation.use'));
CREATE POLICY support_grant_v12_platform_workspace ON workshopos.platform_support_grant USING (
  workshopos.has_platform_permission('platform.support.grant')
  OR workshopos.has_platform_permission('platform.support.approve')
  OR ((workshopos.has_platform_permission('platform.emulation.request') OR workshopos.has_platform_permission('platform.emulation.use')) AND support_identity_id=workshopos.current_platform_identity_id())
) WITH CHECK (workshopos.has_platform_permission('platform.support.grant') OR workshopos.has_platform_permission('platform.support.approve'));

COMMIT;
