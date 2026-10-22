"""CRM and quotation commands; preserve imported quotation financial history."""
from alembic import op
revision='20261022_0053'
down_revision='20261022_0052'
branch_labels=depends_on=None

def upgrade():
    op.execute('ALTER TABLE quotation_lines ADD COLUMN archived_at timestamptz')
    op.execute('ALTER TABLE quotation_lines DROP CONSTRAINT quotation_lines_quotation_id_line_no_key')
    op.execute('CREATE UNIQUE INDEX quotation_active_line_number ON quotation_lines(quotation_id,line_no) WHERE archived_at IS NULL')
    op.execute("""CREATE FUNCTION slice_quotation_line_guard() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF EXISTS(SELECT 1 FROM quotations WHERE id=NEW.quotation_id AND (history_source_sha IS NOT NULL OR status<>'DRAFT')) THEN RAISE EXCEPTION 'Only native draft quotation lines may change'; END IF;
      RETURN NEW;
    END $$""")
    op.execute('CREATE TRIGGER quotation_line_guard BEFORE INSERT OR UPDATE ON quotation_lines FOR EACH ROW EXECUTE FUNCTION slice_quotation_line_guard()')
    for table,fields in {'sales_leads':'display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,updated_by,updated_at,version','quotations':'lead_id,status,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,document_snapshot,updated_by,updated_at,version','quotation_lines':'archived_at,version'}.items():
        if table=='sales_leads':
            op.execute('DROP TRIGGER history_guard ON sales_leads')
            op.execute('CREATE TRIGGER history_guard BEFORE INSERT ON sales_leads FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{fields}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
        op.execute(f'GRANT SELECT,INSERT,UPDATE ON {table} TO workshopos_runtime')
    op.execute('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime')

def downgrade():
    raise RuntimeError('Retain sales audit and archived lines; restore separately.')
