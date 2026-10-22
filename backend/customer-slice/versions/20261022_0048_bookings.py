"""Snapshot bookings precede customer/vehicle creation in the approved workflow."""
from alembic import op
import sqlalchemy as sa
import json

revision = '20261022_0048'
down_revision = '20261022_0047'
branch_labels = depends_on = None


def upgrade():
    c = op.get_bind()
    op.execute('ALTER TABLE bookings ADD COLUMN slice_booking boolean NOT NULL DEFAULT false')
    for field in ('customer_id', 'vehicle_id'):
        op.execute(f'ALTER TABLE bookings ALTER COLUMN {field} DROP NOT NULL')
        op.execute(f'ALTER TABLE bookings ADD CONSTRAINT slice_booking_{field} CHECK({field} IS NOT NULL OR slice_booking)')
    op.execute("ALTER TABLE bookings ADD CONSTRAINT slice_booking_snapshot CHECK(NOT slice_booking OR (btrim(customer_name)<>'' AND btrim(mobile)<>'' AND btrim(vehicle_no)<>'' AND btrim(make)<>'' AND btrim(model)<>''))")
    op.execute("ALTER TABLE bookings ADD CONSTRAINT slice_booking_arrived CHECK(NOT slice_booking OR status<>'ARRIVED' OR (customer_id IS NOT NULL AND vehicle_id IS NOT NULL AND visit_id IS NOT NULL AND job_card_id IS NOT NULL AND arrived_at IS NOT NULL))")
    op.execute("ALTER TABLE bookings ADD CONSTRAINT slice_booking_window CHECK(NOT slice_booking OR arrival_window IN ('','Morning','Afternoon','Evening'))")
    for table, fields in {
        'bookings': 'customer_id,vehicle_id,customer_name,mobile,customer_type,vehicle_no,make,model,color,requested_work,service_type,booking_date,arrival_window,status,ui_status,visit_id,job_card_id,arrived_at,confirmed_at,rescheduled_at,cancelled_at,no_show_at,reschedule_reason,cancellation_reason,no_show_reason,updated_by,updated_at,version',
        'booking_events': '', 'booking_call_logs': '', 'booking_capacity_overrides': '',
    }.items():
        op.execute(f'GRANT SELECT,INSERT ON {table} TO workshopos_runtime')
        if fields: op.execute(f'GRANT UPDATE ON {table} TO workshopos_runtime')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{fields}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute('GRANT SELECT,INSERT,UPDATE ON booking_capacity_limits TO workshopos_runtime')
    # Custody is never rewritten. Unknown historical audit identity is not mapped to a login.
    op.execute('CREATE TABLE slice_historical_bookings(LIKE slice_historical_stock INCLUDING ALL)')
    scope = c.execute(sa.text('SELECT tenant_id,branch_id FROM customers LIMIT 1')).one()
    records = c.execute(sa.text("SELECT * FROM import_custody.records WHERE source_table IN ('bookings','booking_events')")).mappings().all()
    assert len(records) == 4, 'Review unexpected booking history before migration'
    for r in records:
        values = {k: None if v[0]=='null' else int(v[1]) if v[0]=='integer' else float.fromhex(v[1]) if v[0]=='real' else v[1] for k,v in r['payload'].items()}
        c.execute(sa.text('INSERT INTO slice_historical_bookings VALUES(:t,:b,:s,:n,:k,CAST(:v AS jsonb))'),dict(t=scope.tenant_id,b=scope.branch_id,s=r['source_sha'],n=r['source_table'],k=r['source_key'],v=json.dumps(values)))
    op.execute('ALTER TABLE slice_historical_bookings ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE slice_historical_bookings FORCE ROW LEVEL SECURITY')
    op.execute("CREATE POLICY booking_history_scope ON slice_historical_bookings USING(tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[]))")
    op.execute("CREATE TRIGGER booking_history_immutable BEFORE UPDATE OR DELETE ON slice_historical_bookings FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('')")
    op.execute('GRANT SELECT ON slice_historical_bookings TO workshopos_runtime')
    for table in ('bookings','booking_events'):
        op.execute(f"SELECT setval(pg_get_serial_sequence('{table}','id'),GREATEST((SELECT coalesce(max(id),0) FROM {table}),2),true)")
    op.execute('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime')


def downgrade():
    raise RuntimeError('Restore the checkpoint into a separate database; preserve later audited writes.')
