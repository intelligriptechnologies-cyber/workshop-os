"""Audited task, QC and follow-up edits; retain historical identity and custody."""
from alembic import op
revision='20261022_0049'
down_revision='20261022_0048'
branch_labels=depends_on=None

def upgrade():
    for table,fields in {
        'technician_tasks':'title,notes,status,ui_status,started_at,paused_at,completed_at,archived_at,archived_reason,updated_at,updated_by,version',
        'qc_checks':'passed,fail_reason,status,archived_at,version',
        'followups':'note,due_at,done,status,outcome,completed_at,completed_by,archived_at,archived_by,archive_reason,updated_at,updated_by,version',
    }.items():
        op.execute(f'DROP TRIGGER history_guard ON {table}')
        op.execute(f'CREATE TRIGGER history_guard BEFORE INSERT ON {table} FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{fields}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
        op.execute(f'GRANT SELECT,INSERT,UPDATE ON {table} TO workshopos_runtime')
    op.execute('DROP TRIGGER operational_guard ON job_cards')
    op.execute("CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON job_cards FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('advisor_id,status,sub_status,work_list,promised_at,promised_text,estimated_delivery,technician_id,service_type,pickup_drop,damage_marks,damage_marks_recorded_at,advisor_notes,customer_instructions,internal_instructions,updated_by,updated_at,version,archived_at,archived_reason,assignment_state,closed_at,delivery_by,final_km,acknowledgement,qc_status,washing_needed')")

def downgrade():
    raise RuntimeError('Restore a checkpoint into a separate database; preserve audited writes.')
