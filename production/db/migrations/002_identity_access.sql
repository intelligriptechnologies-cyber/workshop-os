BEGIN;

CREATE TABLE workshopos.tenant (
  tenant_id uuid PRIMARY KEY,
  legal_name text NOT NULL,
  plan_id text NOT NULL,
  entitlements jsonb NOT NULL,
  quotas jsonb NOT NULL,
  base_currency char(3) NOT NULL,
  timezone text NOT NULL,
  configuration_template_id text NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0)
);

CREATE TABLE workshopos.branch (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  UNIQUE (tenant_id, id)
);

CREATE TABLE workshopos.role_template (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  name text NOT NULL,
  permissions jsonb NOT NULL,
  system_template boolean NOT NULL DEFAULT false,
  UNIQUE (tenant_id, name)
);

CREATE TABLE workshopos.membership (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  identity_subject text NOT NULL,
  email text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  UNIQUE (tenant_id, identity_subject),
  UNIQUE (tenant_id, email)
);

CREATE TABLE workshopos.membership_role (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  role_id uuid NOT NULL REFERENCES workshopos.role_template(id),
  PRIMARY KEY (tenant_id, membership_id, role_id)
);

CREATE TABLE workshopos.membership_permission (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  permission text NOT NULL,
  effect text NOT NULL CHECK (effect IN ('ALLOW', 'DENY')),
  PRIMARY KEY (tenant_id, membership_id, permission)
);

CREATE TABLE workshopos.shared_device (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL REFERENCES workshopos.branch(id),
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE workshopos.kiosk_pin_credential (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  membership_id uuid PRIMARY KEY REFERENCES workshopos.membership(id),
  pin_digest text NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
  locked_until timestamptz,
  changed_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.security_policy (
  tenant_id uuid PRIMARY KEY REFERENCES workshopos.tenant(tenant_id),
  require_staff_mfa boolean NOT NULL DEFAULT false,
  recent_authentication_minutes integer NOT NULL DEFAULT 15 CHECK (recent_authentication_minutes BETWEEN 1 AND 120),
  version bigint NOT NULL DEFAULT 1
);

CREATE TABLE workshopos.maker_checker_policy (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  action text NOT NULL,
  threshold_minor bigint NOT NULL CHECK (threshold_minor >= 0),
  version bigint NOT NULL DEFAULT 1,
  PRIMARY KEY (tenant_id, action)
);

CREATE TABLE workshopos.approval_request (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL REFERENCES workshopos.branch(id),
  action text NOT NULL,
  subject_reference text NOT NULL,
  amount_minor bigint NOT NULL,
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  status text NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  approval_chain jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.support_access_grant (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  platform_identity_subject text NOT NULL,
  branch_ids uuid[] NOT NULL,
  permissions text[] NOT NULL,
  reason text NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  requested_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL CHECK (expires_at > requested_at),
  approval_chain jsonb NOT NULL
);

ALTER TABLE workshopos.audit_entry
  ADD COLUMN membership_id text,
  ADD COLUMN request_id text,
  ADD COLUMN reason text,
  ADD COLUMN old_state jsonb,
  ADD COLUMN new_state jsonb,
  ADD COLUMN ledger_references jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN approval_chain jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN authentication_context jsonb;

ALTER TABLE workshopos.tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tenant FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.branch FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.role_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.role_template FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_role FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_permission ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_permission FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.shared_device ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.shared_device FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.kiosk_pin_credential ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.kiosk_pin_credential FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.security_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.security_policy FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.maker_checker_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.maker_checker_policy FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.approval_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.approval_request FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.support_access_grant ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.support_access_grant FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON workshopos.tenant
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY branch_isolation ON workshopos.branch
  USING (tenant_id = workshopos.current_tenant_id() AND id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY role_template_isolation ON workshopos.role_template
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY membership_isolation ON workshopos.membership
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY membership_role_isolation ON workshopos.membership_role
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY membership_permission_isolation ON workshopos.membership_permission
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY shared_device_isolation ON workshopos.shared_device
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY kiosk_pin_isolation ON workshopos.kiosk_pin_credential
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY security_policy_isolation ON workshopos.security_policy
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY maker_checker_policy_isolation ON workshopos.maker_checker_policy
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY approval_request_isolation ON workshopos.approval_request
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY support_access_grant_tenant_guard ON workshopos.support_access_grant
  USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY support_access_grant_platform_guard ON workshopos.support_access_grant
  USING (
    current_setting('app.platform_identity_subject', true) = platform_identity_subject
    AND current_setting('app.support_grant_id', true)::uuid = id
    AND status = 'APPROVED'
    AND transaction_timestamp() < expires_at
  );

COMMIT;
