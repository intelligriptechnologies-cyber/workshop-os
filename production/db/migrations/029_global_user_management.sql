BEGIN;

ALTER TABLE workshopos.membership
  ADD COLUMN display_name text NOT NULL DEFAULT '',
  ADD COLUMN status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('INVITED', 'ACTIVE', 'ARCHIVED')),
  ADD COLUMN cognito_username text,
  ADD COLUMN version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  ADD COLUMN invited_at timestamptz,
  ADD COLUMN last_invited_at timestamptz,
  ADD COLUMN created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  ADD COLUMN archived_at timestamptz,
  ADD COLUMN archived_reason text;

UPDATE workshopos.membership
SET display_name = split_part(email, '@', 1),
    status = CASE WHEN active THEN 'ACTIVE' ELSE 'ARCHIVED' END,
    cognito_username = identity_subject,
    invited_at = created_at,
    last_invited_at = created_at;

ALTER TABLE workshopos.membership
  ALTER COLUMN cognito_username SET NOT NULL;

CREATE UNIQUE INDEX membership_identity_subject_global_uq
  ON workshopos.membership (identity_subject);
CREATE UNIQUE INDEX membership_email_global_uq
  ON workshopos.membership (lower(email));

CREATE TABLE workshopos.membership_branch (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  branch_id uuid NOT NULL REFERENCES workshopos.branch(id),
  PRIMARY KEY (tenant_id, membership_id, branch_id)
);

CREATE TABLE workshopos.membership_command (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, idempotency_key)
);

ALTER TABLE workshopos.membership_branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_branch FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_command ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_command FORCE ROW LEVEL SECURITY;

CREATE POLICY membership_branch_isolation ON workshopos.membership_branch
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());
CREATE POLICY membership_command_isolation ON workshopos.membership_command
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

-- The application starts with only a verified Cognito subject. This narrowly
-- scoped definer function discovers the tenant before normal forced-RLS queries.
CREATE OR REPLACE FUNCTION workshopos.resolve_membership_tenant(p_identity_subject text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, workshopos
AS $$
  SELECT tenant_id
  FROM workshopos.membership
  WHERE identity_subject = p_identity_subject
    AND active
    AND status <> 'ARCHIVED'
$$;

REVOKE ALL ON FUNCTION workshopos.resolve_membership_tenant(text) FROM PUBLIC;

COMMIT;
