BEGIN;

CREATE OR REPLACE FUNCTION workshopos.current_subject_id() RETURNS text
LANGUAGE sql STABLE PARALLEL SAFE
AS $$ SELECT nullif(current_setting('app.subject_id', true), '') $$;

CREATE TABLE workshopos.list_presentation_preference (
  tenant_id uuid NOT NULL,
  actor_id text NOT NULL,
  screen_key text NOT NULL,
  view_mode text NOT NULL CHECK (view_mode IN ('grid', 'table')),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, actor_id, screen_key)
);

CREATE TABLE workshopos.list_export_job (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  actor_id text NOT NULL,
  screen_key text NOT NULL,
  format text NOT NULL CHECK (format IN ('PDF', 'XLSX')),
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  query jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING', 'READY', 'FAILED')),
  row_count integer CHECK (row_count IS NULL OR row_count >= 0),
  filename text,
  mime_type text,
  content bytea,
  failure_code text,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  completed_at timestamptz,
  UNIQUE (tenant_id, actor_id, idempotency_key),
  CHECK (
    (status = 'PENDING' AND content IS NULL AND completed_at IS NULL)
    OR (status = 'READY' AND content IS NOT NULL AND row_count IS NOT NULL AND filename IS NOT NULL AND mime_type IS NOT NULL AND completed_at IS NOT NULL)
    OR (status = 'FAILED' AND content IS NULL AND failure_code IS NOT NULL AND completed_at IS NOT NULL)
  )
);

ALTER TABLE workshopos.list_presentation_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.list_presentation_preference FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.list_export_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.list_export_job FORCE ROW LEVEL SECURITY;

CREATE POLICY list_preference_private ON workshopos.list_presentation_preference
  USING (tenant_id = workshopos.current_tenant_id() AND actor_id = workshopos.current_subject_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND actor_id = workshopos.current_subject_id());
CREATE POLICY list_export_private ON workshopos.list_export_job
  USING (tenant_id = workshopos.current_tenant_id() AND actor_id = workshopos.current_subject_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND actor_id = workshopos.current_subject_id());

COMMIT;
