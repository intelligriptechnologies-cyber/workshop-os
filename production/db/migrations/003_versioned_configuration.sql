BEGIN;

CREATE TABLE workshopos.configuration_master (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  master_type text NOT NULL CHECK (master_type IN (
    'SERVICE', 'CATEGORY', 'PACKAGE', 'RECIPE', 'PRICE', 'TAX', 'WORKFLOW',
    'CHECKLIST', 'REASON', 'DOCUMENT_TEMPLATE', 'POLICY'
  )),
  master_key text NOT NULL CHECK (master_key <> ''),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, master_type, master_key),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.configuration_master_version (
  master_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  version bigint NOT NULL CHECK (version > 0),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  status text NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED')),
  effective_from timestamptz,
  value jsonb NOT NULL CHECK (jsonb_typeof(value) = 'object'),
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, master_id, version),
  UNIQUE (tenant_id, branch_id, master_id, effective_from),
  FOREIGN KEY (tenant_id, branch_id, master_id)
    REFERENCES workshopos.configuration_master(tenant_id, branch_id, id),
  CHECK ((status = 'DRAFT' AND effective_from IS NULL) OR (status = 'PUBLISHED' AND effective_from IS NOT NULL)),
  CHECK (NOT (value ?| ARRAY['coreLifecycle', 'lifecycleStages', 'coreStages'])),
  CHECK (
    NOT (value ? 'amountMinor') OR
    ((value->>'amountMinor') ~ '^-?(0|[1-9][0-9]*)$' AND (value->>'currency') ~ '^[A-Z]{3}$')
  )
);

CREATE TABLE workshopos.scope_configuration_snapshot (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  scope_id uuid NOT NULL,
  lifecycle_stage text NOT NULL CHECK (lifecycle_stage IN ('APPROVED', 'ACTIVE')),
  snapshot_type text NOT NULL CHECK (snapshot_type IN ('PRICE', 'TAX', 'WORKFLOW', 'RECIPE', 'CHECKLIST', 'POLICY')),
  master_id uuid NOT NULL,
  master_version bigint NOT NULL,
  master_key text NOT NULL,
  effective_from timestamptz NOT NULL,
  value jsonb NOT NULL,
  activated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, scope_id, snapshot_type),
  FOREIGN KEY (tenant_id, branch_id, master_id, master_version)
    REFERENCES workshopos.configuration_master_version(tenant_id, branch_id, master_id, version),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.uom_conversion (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  from_uom text NOT NULL CHECK (from_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  to_uom text NOT NULL CHECK (to_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  numerator numeric(38, 0) NOT NULL CHECK (numerator > 0),
  denominator numeric(38, 0) NOT NULL CHECK (denominator > 0),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, from_uom, to_uom),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  CHECK (from_uom <> to_uom)
);

CREATE TABLE workshopos.document_sequence (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  document_type text NOT NULL CHECK (document_type ~ '^[A-Z][A-Z0-9_]{1,31}$'),
  financial_year char(7) NOT NULL CHECK (financial_year ~ '^\d{4}-\d{2}$'),
  last_value bigint NOT NULL CHECK (last_value > 0),
  PRIMARY KEY (tenant_id, branch_id, document_type, financial_year),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE FUNCTION workshopos.prevent_published_master_version_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'PUBLISHED' THEN
    RAISE EXCEPTION 'published configuration versions are immutable' USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER prevent_published_master_version_mutation
BEFORE UPDATE OR DELETE ON workshopos.configuration_master_version
FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_published_master_version_mutation();

CREATE FUNCTION workshopos.prevent_scope_snapshot_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'active scope configuration snapshots are immutable' USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER prevent_scope_snapshot_mutation
BEFORE UPDATE OR DELETE ON workshopos.scope_configuration_snapshot
FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_scope_snapshot_mutation();

CREATE FUNCTION workshopos.allocate_document_number(
  p_tenant_id uuid, p_branch_id uuid, p_document_type text, p_financial_year char(7)
) RETURNS bigint
LANGUAGE sql VOLATILE
AS $$
  INSERT INTO workshopos.document_sequence (tenant_id, branch_id, document_type, financial_year, last_value)
  VALUES (p_tenant_id, p_branch_id, p_document_type, p_financial_year, 1)
  ON CONFLICT (tenant_id, branch_id, document_type, financial_year)
  DO UPDATE SET last_value = workshopos.document_sequence.last_value + 1
  RETURNING last_value
$$;

ALTER TABLE workshopos.configuration_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.configuration_master FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.configuration_master_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.configuration_master_version FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.scope_configuration_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.scope_configuration_snapshot FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.uom_conversion ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.uom_conversion FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.document_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.document_sequence FORCE ROW LEVEL SECURITY;

CREATE POLICY configuration_master_isolation ON workshopos.configuration_master
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY configuration_master_version_isolation ON workshopos.configuration_master_version
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY scope_configuration_snapshot_isolation ON workshopos.scope_configuration_snapshot
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY uom_conversion_isolation ON workshopos.uom_conversion
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY document_sequence_isolation ON workshopos.document_sequence
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

COMMIT;
