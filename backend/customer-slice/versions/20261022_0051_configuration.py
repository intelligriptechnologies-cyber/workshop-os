"""Versioned PostgreSQL authority for the approved administration editors."""
from alembic import op
from pathlib import Path
import sqlalchemy as sa
revision='20261022_0051'
down_revision='20261022_0050'
branch_labels=depends_on=None

def upgrade():
    op.execute('CREATE TABLE slice_admin_configuration(tenant_id uuid NOT NULL,branch_id uuid NOT NULL,id bigint NOT NULL DEFAULT 1 CHECK(id=1),values jsonb NOT NULL CHECK(jsonb_typeof(values)=\'object\'),version bigint NOT NULL DEFAULT 1 CHECK(version>0),updated_at timestamptz NOT NULL DEFAULT now(),updated_by uuid REFERENCES platform_users(id),PRIMARY KEY(tenant_id,branch_id),FOREIGN KEY(tenant_id,branch_id) REFERENCES branches(tenant_id,id))')
    c=op.get_bind()
    c.execute(sa.text('INSERT INTO slice_admin_configuration(tenant_id,branch_id,values) SELECT DISTINCT tenant_id,branch_id,CAST(:v AS jsonb) FROM customers'),{'v':(Path(__file__).parents[1]/'admin-defaults.json').read_text()})
    op.execute('ALTER TABLE slice_admin_configuration ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE slice_admin_configuration FORCE ROW LEVEL SECURITY')
    op.execute("CREATE POLICY configuration_scope ON slice_admin_configuration USING(tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[])) WITH CHECK(tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[]))")
    op.execute('GRANT SELECT,UPDATE ON slice_admin_configuration TO workshopos_runtime')
    op.execute('GRANT SELECT ON slice_admin_configuration TO slice_auth')
    op.execute("CREATE TRIGGER configuration_guard BEFORE UPDATE OR DELETE ON slice_admin_configuration FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('values,version,updated_at,updated_by')")
    op.execute('CREATE TRIGGER configuration_audit AFTER UPDATE ON slice_admin_configuration FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')

def downgrade():
    raise RuntimeError('Restore separately; retain settings and audit history.')
