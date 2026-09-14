BEGIN;

CREATE FUNCTION workshopos.business_settings_values_valid(p_values jsonb, p_branch boolean) RETURNS boolean
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  v_allowed text[] := ARRAY['defaultLaborRateMinor','defaultJobDurationMinutes','customerUpdatesEnabled','invoiceFooter'];
BEGIN
  IF jsonb_typeof(p_values) <> 'object' OR EXISTS (SELECT 1 FROM jsonb_object_keys(p_values) key WHERE NOT key = ANY(v_allowed)) THEN RETURN false; END IF;
  IF NOT p_branch AND NOT (p_values ?& v_allowed) THEN RETURN false; END IF;
  IF p_values ? 'defaultLaborRateMinor' AND (jsonb_typeof(p_values->'defaultLaborRateMinor') <> 'number' OR (p_values->>'defaultLaborRateMinor') !~ '^\d+$' OR (p_values->>'defaultLaborRateMinor')::numeric > 100000000) THEN RETURN false; END IF;
  IF p_values ? 'defaultJobDurationMinutes' AND (jsonb_typeof(p_values->'defaultJobDurationMinutes') <> 'number' OR (p_values->>'defaultJobDurationMinutes') !~ '^\d+$' OR (p_values->>'defaultJobDurationMinutes')::numeric NOT BETWEEN 15 AND 1440) THEN RETURN false; END IF;
  IF p_values ? 'customerUpdatesEnabled' AND jsonb_typeof(p_values->'customerUpdatesEnabled') <> 'boolean' THEN RETURN false; END IF;
  IF p_values ? 'invoiceFooter' AND (jsonb_typeof(p_values->'invoiceFooter') <> 'string' OR length(p_values->>'invoiceFooter') > 240) THEN RETURN false; END IF;
  RETURN true;
EXCEPTION WHEN others THEN RETURN false;
END $$;

CREATE TABLE workshopos.business_settings_draft (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  scope_key uuid NOT NULL,
  branch_id uuid,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  base_published_version bigint NOT NULL DEFAULT 0 CHECK (base_published_version >= 0),
  values jsonb NOT NULL,
  updated_by_membership_id uuid REFERENCES workshopos.membership(id),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, scope_key),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  CHECK ((branch_id IS NULL AND scope_key = '00000000-0000-0000-0000-000000000000') OR branch_id = scope_key),
  CHECK (workshopos.business_settings_values_valid(values, branch_id IS NOT NULL))
);

CREATE TABLE workshopos.business_settings_version (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  scope_key uuid NOT NULL,
  branch_id uuid,
  version bigint NOT NULL CHECK (version > 0),
  values jsonb NOT NULL,
  published_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  published_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  UNIQUE (tenant_id, scope_key, version),
  CHECK ((branch_id IS NULL AND scope_key = '00000000-0000-0000-0000-000000000000') OR branch_id = scope_key),
  CHECK (workshopos.business_settings_values_valid(values, branch_id IS NOT NULL))
);

CREATE TABLE workshopos.business_settings_command (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  request_hash text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, idempotency_key)
);

ALTER TABLE workshopos.work_item
  ADD CONSTRAINT work_item_tenant_branch_id_unique UNIQUE (tenant_id, branch_id, id);

CREATE TABLE workshopos.work_item_settings_snapshot (
  work_item_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  tenant_version bigint NOT NULL CHECK (tenant_version > 0),
  branch_version bigint CHECK (branch_version > 0),
  values jsonb NOT NULL CHECK (workshopos.business_settings_values_valid(values, false)),
  captured_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  captured_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  FOREIGN KEY (tenant_id, branch_id, work_item_id)
    REFERENCES workshopos.work_item(tenant_id, branch_id, id)
);

CREATE FUNCTION workshopos.reject_business_settings_immutable_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'published settings and active-work snapshots are immutable'; END $$;
CREATE TRIGGER business_settings_version_immutable BEFORE UPDATE OR DELETE ON workshopos.business_settings_version FOR EACH ROW EXECUTE FUNCTION workshopos.reject_business_settings_immutable_mutation();
CREATE TRIGGER work_item_settings_snapshot_immutable BEFORE UPDATE OR DELETE ON workshopos.work_item_settings_snapshot FOR EACH ROW EXECUTE FUNCTION workshopos.reject_business_settings_immutable_mutation();
CREATE TRIGGER business_settings_command_immutable BEFORE UPDATE OR DELETE ON workshopos.business_settings_command FOR EACH ROW EXECUTE FUNCTION workshopos.reject_business_settings_immutable_mutation();

ALTER TABLE workshopos.business_settings_draft ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.business_settings_draft FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.business_settings_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.business_settings_version FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.business_settings_command ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.business_settings_command FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_item_settings_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_item_settings_snapshot FORCE ROW LEVEL SECURITY;

CREATE POLICY business_settings_draft_isolation ON workshopos.business_settings_draft
  USING (tenant_id=workshopos.current_tenant_id() AND (branch_id IS NULL OR branch_id=ANY(workshopos.authorized_branch_ids())))
  WITH CHECK (tenant_id=workshopos.current_tenant_id() AND (branch_id IS NULL OR branch_id=ANY(workshopos.authorized_branch_ids())));
CREATE POLICY business_settings_version_isolation ON workshopos.business_settings_version
  USING (tenant_id=workshopos.current_tenant_id() AND (branch_id IS NULL OR branch_id=ANY(workshopos.authorized_branch_ids())))
  WITH CHECK (tenant_id=workshopos.current_tenant_id() AND (branch_id IS NULL OR branch_id=ANY(workshopos.authorized_branch_ids())));
CREATE POLICY business_settings_command_isolation ON workshopos.business_settings_command
  USING (tenant_id=workshopos.current_tenant_id()) WITH CHECK (tenant_id=workshopos.current_tenant_id());
CREATE POLICY work_item_settings_snapshot_isolation ON workshopos.work_item_settings_snapshot
  USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));

CREATE INDEX business_settings_latest_idx ON workshopos.business_settings_version(tenant_id,scope_key,version DESC);
CREATE INDEX work_item_settings_snapshot_scope_idx ON workshopos.work_item_settings_snapshot(tenant_id,branch_id,captured_at DESC);

-- Protected templates remain immutable at runtime; this migration deliberately grants the new page/action pair.
ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
UPDATE workshopos.role_template
SET permissions = permissions || '["business-settings.page","business-settings.manage"]'::jsonb,
    version = version + 1,
    updated_at = transaction_timestamp()
WHERE system_template AND name = 'Business Owner/Admin' AND NOT permissions ? 'business-settings.manage';
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-06 Business Settings permission grant'
FROM workshopos.role_template r
WHERE system_template AND name='Business Owner/Admin'
  AND NOT EXISTS (SELECT 1 FROM workshopos.role_template_version v WHERE v.tenant_id=r.tenant_id AND v.role_id=r.id AND v.version=r.version);

COMMIT;
