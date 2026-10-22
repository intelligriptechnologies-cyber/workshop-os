"""Versioned, audited vehicle commands; immutable source custody remains untouched."""
from alembic import op
revision='20261022_0040'
down_revision='20261021_0039'
branch_labels=depends_on=None

def upgrade():
    op.execute('''CREATE TABLE operational_changes(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL REFERENCES tenants(id), actor_id uuid NOT NULL REFERENCES platform_users(id),
      entity text NOT NULL, entity_id bigint NOT NULL, before_value jsonb, after_value jsonb NOT NULL,
      at timestamptz NOT NULL DEFAULT now())''')
    op.execute('ALTER TABLE operational_changes ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE operational_changes FORCE ROW LEVEL SECURITY')
    op.execute("CREATE POLICY operational_scope ON operational_changes USING (tenant_id::text=current_setting('workshopos.tenant_id',true)) WITH CHECK (tenant_id::text=current_setting('workshopos.tenant_id',true))")
    op.execute('''CREATE FUNCTION operational_edit_guard() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE allowed text[];
    BEGIN
      IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Archive; never delete operational history'; END IF;
      allowed:=string_to_array(TG_ARGV[0],',');
      IF (to_jsonb(NEW)-allowed) IS DISTINCT FROM (to_jsonb(OLD)-allowed) THEN
        RAISE EXCEPTION 'Operational identity or provenance is immutable'; END IF;
      RETURN NEW;
    END $$''')
    op.execute('''CREATE FUNCTION audit_operational_edit() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      INSERT INTO operational_changes(tenant_id,actor_id,entity,entity_id,before_value,after_value)
      VALUES(NEW.tenant_id,current_setting('workshopos.actor_id')::uuid,TG_TABLE_NAME,NEW.id,
        CASE WHEN TG_OP='UPDATE' THEN to_jsonb(OLD) ELSE NULL END,to_jsonb(NEW));
      RETURN NEW;
    END $$''')
    op.execute('DROP TRIGGER history_guard ON vehicles')
    op.execute('CREATE TRIGGER history_guard BEFORE INSERT ON vehicles FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()')
    op.execute("CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON vehicles FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('customer_id,number,make,model,color,km,engine_no,updated_by,updated_at,version,archived_at,archived_by,archive_reason')")
    op.execute('CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute('GRANT INSERT,UPDATE ON vehicles TO workshopos_runtime')
    op.execute('GRANT SELECT,INSERT ON operational_changes TO workshopos_runtime')
    op.execute('GRANT USAGE ON SEQUENCE operational_changes_id_seq TO workshopos_runtime')

def downgrade():
    raise RuntimeError('Restore the preserved disposable checkpoint instead of erasing audit history')
