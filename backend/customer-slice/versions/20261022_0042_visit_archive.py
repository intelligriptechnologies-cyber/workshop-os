from alembic import op
revision='20261022_0042'
down_revision='20261022_0041'
branch_labels=depends_on=None

def upgrade():
    op.execute('DROP TRIGGER operational_guard ON visits')
    op.execute("CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON visits FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('advisor_id,fuel,accessories,photos_note,updated_at,version,archived_at,archived_by,archive_reason')")

def downgrade():
    raise RuntimeError('Restore the isolated checkpoint rather than remove archive history')
