"""Operational edits preserve imported identity, provenance, finance and history."""
from alembic import op
revision='20261022_0041'
down_revision='20261022_0040'
branch_labels=depends_on=None

def upgrade():
    op.execute("ALTER TABLE job_cards ADD COLUMN promised_text text NOT NULL DEFAULT ''")
    editable={
      'job_cards':'advisor_id,status,sub_status,work_list,promised_at,promised_text,estimated_delivery,technician_id,service_type,pickup_drop,damage_marks,damage_marks_recorded_at,advisor_notes,customer_instructions,internal_instructions,updated_by,updated_at,version,archived_at,archived_reason,assignment_state',
      'visits':'advisor_id,fuel,accessories,photos_note,updated_at,version',
      'job_checklist_items':'checked_by,checked_at,started_at,completed_at,na_at,na_by,version',
    }
    for table,fields in editable.items():
        op.execute(f'DROP TRIGGER history_guard ON {table}')
        op.execute(f'CREATE TRIGGER history_guard BEFORE INSERT ON {table} FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{fields}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute("CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON job_checklist_cycles FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('completed_at,version')")
    op.execute('CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON job_checklist_cycles FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute('GRANT SELECT,INSERT,UPDATE ON job_cards,visits,job_checklist_items,job_checklist_cycles,advisor_attendance TO workshopos_runtime')
    op.execute('GRANT SELECT,INSERT ON technician_tasks,qc_checks,job_media,legacy_job_status_history TO workshopos_runtime')
    op.execute('GRANT SELECT ON estimates,invoices,material_requests,followups TO workshopos_runtime')
    op.execute('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime')

def downgrade():
    raise RuntimeError('Restore the preserved disposable checkpoint instead of erasing audit history')
