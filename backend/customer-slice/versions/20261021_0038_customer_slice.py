"""Audited customer edits preserve immutable import custody and all other history."""
from alembic import op
revision='20261021_0038'
down_revision='20261021_0037'
branch_labels=depends_on=None

def upgrade():
    op.execute('''CREATE TABLE customer_changes (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL REFERENCES branches(id),
      customer_id bigint NOT NULL REFERENCES customers(id), actor_id uuid NOT NULL REFERENCES platform_users(id),
      before_value jsonb, after_value jsonb NOT NULL, at timestamptz NOT NULL DEFAULT now())''')
    op.execute('''CREATE TABLE slice_auth_events (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, event text NOT NULL,
      user_id uuid REFERENCES platform_users(id), at timestamptz NOT NULL DEFAULT now())''')
    op.execute('''CREATE TABLE customer_commands (
      tenant_id uuid NOT NULL, actor_id uuid NOT NULL, request_key uuid NOT NULL,
      fingerprint text NOT NULL, result jsonb NOT NULL,
      PRIMARY KEY(tenant_id,actor_id,request_key))''')
    op.execute('''CREATE FUNCTION guard_customer_edit() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Archive customers; do not delete'; END IF;
      IF (to_jsonb(NEW)-ARRAY['name','mobile','type','address','updated_at','updated_by','version','archived_at','archived_by','archive_reason'])
        IS DISTINCT FROM (to_jsonb(OLD)-ARRAY['name','mobile','type','address','updated_at','updated_by','version','archived_at','archived_by','archive_reason']) THEN
        RAISE EXCEPTION 'Customer identity and import provenance are immutable';
      END IF;
      RETURN NEW;
    END $$''')
    op.execute('DROP TRIGGER history_guard ON customers')
    op.execute('''CREATE TRIGGER history_guard BEFORE INSERT ON customers FOR EACH ROW
      EXECUTE FUNCTION import_custody.guard_history()''')
    op.execute('''CREATE TRIGGER customer_edit_guard BEFORE UPDATE OR DELETE ON customers
      FOR EACH ROW EXECUTE FUNCTION guard_customer_edit()''')
    op.execute('''CREATE FUNCTION audit_customer_edit() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      INSERT INTO customer_changes(tenant_id,branch_id,customer_id,actor_id,before_value,after_value)
      VALUES(NEW.tenant_id,NEW.branch_id,NEW.id,NEW.updated_by,
        CASE WHEN TG_OP='UPDATE' THEN to_jsonb(OLD) ELSE NULL END,to_jsonb(NEW));
      RETURN NEW;
    END $$''')
    op.execute('''CREATE TRIGGER customer_audit AFTER INSERT OR UPDATE ON customers
      FOR EACH ROW EXECUTE FUNCTION audit_customer_edit()''')
    for table in ['customer_changes','customer_commands']:
        op.execute(f'ALTER TABLE {table} ENABLE ROW LEVEL SECURITY')
        op.execute(f'ALTER TABLE {table} FORCE ROW LEVEL SECURITY')
        op.execute(f'''CREATE POLICY slice_scope ON {table} USING
          (tenant_id::text=current_setting('workshopos.tenant_id',true))
          WITH CHECK(tenant_id::text=current_setting('workshopos.tenant_id',true))''')

def downgrade():
    raise RuntimeError('Use preserved disposable backup; populated slice downgrade is not supported')
