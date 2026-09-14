BEGIN;

ALTER TABLE workshopos.role_template
  ADD COLUMN description text NOT NULL DEFAULT '',
  ADD COLUMN active boolean NOT NULL DEFAULT true,
  ADD COLUMN version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  ADD COLUMN created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT transaction_timestamp();

ALTER TABLE workshopos.role_template
  ADD CONSTRAINT role_template_permissions_array CHECK (jsonb_typeof(permissions) = 'array');

-- The protected owner template explicitly receives every currently shipped tenant permission.
-- Authorization code no longer treats membership.manage as a wildcard.
UPDATE workshopos.role_template
SET permissions = '["admin.users.page","membership.manage","admin.roles.page","role.manage","work-items.page","work-item.read","work-item.manage","work-item.export","global-search.page","global-search.use"]'::jsonb,
    updated_at = transaction_timestamp()
WHERE system_template AND name = 'Business Owner/Admin';

CREATE TABLE workshopos.role_template_version (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  role_id uuid NOT NULL REFERENCES workshopos.role_template(id),
  version bigint NOT NULL CHECK (version > 0),
  name text NOT NULL,
  description text NOT NULL,
  permissions jsonb NOT NULL CHECK (jsonb_typeof(permissions) = 'array'),
  active boolean NOT NULL,
  changed_by_membership_id uuid REFERENCES workshopos.membership(id),
  change_reason text NOT NULL CHECK (btrim(change_reason) <> ''),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, role_id, version)
);

CREATE TABLE workshopos.role_command (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, idempotency_key)
);

INSERT INTO workshopos.role_template_version(
  id, tenant_id, role_id, version, name, description, permissions, active, change_reason
)
SELECT gen_random_uuid(), tenant_id, id, version, name, description, permissions, active, 'Initial role version'
FROM workshopos.role_template;

CREATE FUNCTION workshopos.capture_protected_role_initial_version() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO workshopos.role_template_version(
    id, tenant_id, role_id, version, name, description, permissions, active, change_reason
  ) VALUES (
    gen_random_uuid(), NEW.tenant_id, NEW.id, NEW.version, NEW.name, NEW.description,
    NEW.permissions, NEW.active, 'Initial protected role version'
  );
  RETURN NEW;
END $$;

CREATE TRIGGER protected_role_initial_version
  AFTER INSERT ON workshopos.role_template
  FOR EACH ROW WHEN (NEW.system_template)
  EXECUTE FUNCTION workshopos.capture_protected_role_initial_version();

CREATE FUNCTION workshopos.protect_role_template() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'roles are archived, not deleted';
  END IF;
  IF OLD.system_template THEN
    RAISE EXCEPTION 'protected role templates cannot be changed';
  END IF;
  IF NEW.system_template IS DISTINCT FROM OLD.system_template THEN
    RAISE EXCEPTION 'role protection cannot be changed';
  END IF;
  IF NEW.version <> OLD.version + 1 THEN
    RAISE EXCEPTION 'role version must increase exactly once';
  END IF;
  IF OLD.active = false AND NEW.active = true THEN
    RAISE EXCEPTION 'archived roles cannot be reactivated';
  END IF;
  NEW.updated_at := transaction_timestamp();
  RETURN NEW;
END $$;

CREATE TRIGGER role_template_protection
  BEFORE UPDATE OR DELETE ON workshopos.role_template
  FOR EACH ROW EXECUTE FUNCTION workshopos.protect_role_template();

CREATE FUNCTION workshopos.reject_role_history_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'role version history is append-only';
END $$;

CREATE TRIGGER role_history_append_only
  BEFORE UPDATE OR DELETE ON workshopos.role_template_version
  FOR EACH ROW EXECUTE FUNCTION workshopos.reject_role_history_mutation();

ALTER TABLE workshopos.role_template_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.role_template_version FORCE ROW LEVEL SECURITY;
CREATE POLICY role_template_version_isolation ON workshopos.role_template_version
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

ALTER TABLE workshopos.role_command ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.role_command FORCE ROW LEVEL SECURITY;
CREATE POLICY role_command_isolation ON workshopos.role_command
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

CREATE INDEX role_template_active_name_idx ON workshopos.role_template(tenant_id, active, lower(name));
CREATE INDEX role_template_version_history_idx ON workshopos.role_template_version(tenant_id, role_id, version DESC);

COMMIT;
