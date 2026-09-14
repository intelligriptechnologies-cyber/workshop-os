BEGIN;

CREATE TABLE workshopos.membership_inventory_warehouse (
  tenant_id uuid NOT NULL,
  membership_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  warehouse_id uuid NOT NULL,
  PRIMARY KEY (tenant_id, membership_id, warehouse_id),
  FOREIGN KEY (membership_id) REFERENCES workshopos.membership(id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.inventory_import (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  filename text NOT NULL CHECK (btrim(filename) <> ''),
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  request_hash text NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'),
  status text NOT NULL CHECK (status IN ('STAGED', 'COMMITTED')),
  rows jsonb NOT NULL CHECK (jsonb_typeof(rows) = 'array'),
  summary jsonb NOT NULL CHECK (jsonb_typeof(summary) = 'object'),
  error_manifest bytea,
  staged_by_membership_id uuid NOT NULL,
  committed_by_membership_id uuid,
  staged_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  committed_at timestamptz,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  UNIQUE (tenant_id, idempotency_key),
  CHECK ((status = 'STAGED' AND committed_at IS NULL AND committed_by_membership_id IS NULL) OR
         (status = 'COMMITTED' AND committed_at IS NOT NULL AND committed_by_membership_id IS NOT NULL))
);

CREATE TABLE workshopos.inventory_import_commit (
  tenant_id uuid NOT NULL,
  import_id uuid NOT NULL REFERENCES workshopos.inventory_import(id),
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  request_hash text NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'),
  response jsonb NOT NULL CHECK (jsonb_typeof(response) = 'object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, idempotency_key),
  UNIQUE (tenant_id, import_id)
);

CREATE FUNCTION workshopos.reject_inventory_import_commit_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN
  RAISE EXCEPTION 'inventory import reconciliation is append-only' USING ERRCODE = 'integrity_constraint_violation';
END $$;
CREATE TRIGGER inventory_import_commit_append_only BEFORE UPDATE OR DELETE ON workshopos.inventory_import_commit
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_import_commit_mutation();

CREATE FUNCTION workshopos.guard_inventory_import_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
  IF TG_OP = 'DELETE' OR OLD.status <> 'STAGED' OR NEW.status <> 'COMMITTED'
     OR NEW.id IS DISTINCT FROM OLD.id OR NEW.tenant_id IS DISTINCT FROM OLD.tenant_id
     OR NEW.branch_id IS DISTINCT FROM OLD.branch_id OR NEW.filename IS DISTINCT FROM OLD.filename
     OR NEW.idempotency_key IS DISTINCT FROM OLD.idempotency_key OR NEW.request_hash IS DISTINCT FROM OLD.request_hash
     OR NEW.rows IS DISTINCT FROM OLD.rows OR NEW.error_manifest IS DISTINCT FROM OLD.error_manifest
     OR NEW.staged_by_membership_id IS DISTINCT FROM OLD.staged_by_membership_id OR NEW.staged_at IS DISTINCT FROM OLD.staged_at
     OR NEW.resource_version <> OLD.resource_version + 1 OR NEW.committed_at IS NULL OR NEW.committed_by_membership_id IS NULL THEN
    RAISE EXCEPTION 'inventory import evidence is immutable outside explicit commit' USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER inventory_import_guard BEFORE UPDATE OR DELETE ON workshopos.inventory_import
FOR EACH ROW EXECUTE FUNCTION workshopos.guard_inventory_import_mutation();

ALTER TABLE workshopos.membership_inventory_warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_inventory_warehouse FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_import ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_import FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_import_commit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_import_commit FORCE ROW LEVEL SECURITY;

CREATE POLICY membership_inventory_warehouse_isolation ON workshopos.membership_inventory_warehouse
USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()))
WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY inventory_import_isolation ON workshopos.inventory_import
USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()))
WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY inventory_import_commit_isolation ON workshopos.inventory_import_commit
USING (tenant_id = workshopos.current_tenant_id() AND EXISTS (SELECT 1 FROM workshopos.inventory_import i WHERE i.id=import_id))
WITH CHECK (tenant_id = workshopos.current_tenant_id() AND EXISTS (SELECT 1 FROM workshopos.inventory_import i WHERE i.id=import_id));

ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH changed AS (
  UPDATE workshopos.role_template
  SET permissions = permissions || '["inventory.page","inventory.read","inventory.operate","inventory.export","inventory.import"]'::jsonb,
      version = version + 1, updated_at = transaction_timestamp()
  WHERE system_template AND name = 'Business Owner/Admin' AND NOT permissions ? 'inventory.page'
  RETURNING *
)
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-08 inventory operations and controlled import' FROM changed;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
