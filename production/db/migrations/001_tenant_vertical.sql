BEGIN;

CREATE SCHEMA IF NOT EXISTS workshopos;

CREATE TABLE workshopos.work_item (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  summary text NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.audit_entry (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  subject_id text NOT NULL,
  action text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.outbox_event (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  kind text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE TABLE workshopos.idempotency_result (
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, idempotency_key)
);

ALTER TABLE workshopos.work_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.work_item FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.audit_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.audit_entry FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.outbox_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.outbox_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.idempotency_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.idempotency_result FORCE ROW LEVEL SECURITY;

CREATE FUNCTION workshopos.current_tenant_id() RETURNS uuid
LANGUAGE sql STABLE PARALLEL SAFE
AS $$ SELECT nullif(current_setting('app.tenant_id', true), '')::uuid $$;

CREATE FUNCTION workshopos.authorized_branch_ids() RETURNS uuid[]
LANGUAGE sql STABLE PARALLEL SAFE
AS $$ SELECT string_to_array(nullif(current_setting('app.branch_ids', true), ''), ',')::uuid[] $$;

CREATE POLICY work_item_tenant_branch ON workshopos.work_item
USING (
  tenant_id = workshopos.current_tenant_id()
  AND branch_id = ANY (workshopos.authorized_branch_ids())
)
WITH CHECK (
  tenant_id = workshopos.current_tenant_id()
  AND branch_id = ANY (workshopos.authorized_branch_ids())
);

CREATE POLICY audit_tenant_branch ON workshopos.audit_entry
USING (
  tenant_id = workshopos.current_tenant_id()
  AND branch_id = ANY (workshopos.authorized_branch_ids())
)
WITH CHECK (
  tenant_id = workshopos.current_tenant_id()
  AND branch_id = ANY (workshopos.authorized_branch_ids())
);

CREATE POLICY outbox_tenant_branch ON workshopos.outbox_event
USING (
  tenant_id = workshopos.current_tenant_id()
  AND branch_id = ANY (workshopos.authorized_branch_ids())
)
WITH CHECK (
  tenant_id = workshopos.current_tenant_id()
  AND branch_id = ANY (workshopos.authorized_branch_ids())
);

CREATE POLICY idempotency_tenant ON workshopos.idempotency_result
USING (tenant_id = workshopos.current_tenant_id())
WITH CHECK (tenant_id = workshopos.current_tenant_id());

COMMIT;
