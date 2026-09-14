BEGIN;

ALTER TABLE workshopos.membership DROP CONSTRAINT membership_status_check;
ALTER TABLE workshopos.membership ADD CONSTRAINT membership_status_check
  CHECK (status IN ('INVITED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED'));

CREATE TABLE workshopos.membership_admin_audit (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  target_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  action text NOT NULL CHECK (action IN ('UPDATED', 'ACTIVATED', 'SUSPENDED', 'INVITE_RESENT', 'ARCHIVED')),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  resource_version bigint NOT NULL CHECK (resource_version > 0),
  occurred_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

ALTER TABLE workshopos.membership_admin_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.membership_admin_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY membership_admin_audit_isolation ON workshopos.membership_admin_audit
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

CREATE FUNCTION workshopos.reject_membership_admin_audit_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'membership administration audit is append-only';
END $$;

CREATE TRIGGER membership_admin_audit_append_only
  BEFORE UPDATE OR DELETE ON workshopos.membership_admin_audit
  FOR EACH ROW EXECUTE FUNCTION workshopos.reject_membership_admin_audit_mutation();

COMMIT;
