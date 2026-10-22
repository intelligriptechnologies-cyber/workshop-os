"""Strict compatibility columns and isolated source custody, no business relaxation."""
from alembic import op
import sqlalchemy as sa
revision = '20261021_0036'
down_revision = '20261021_0035'
branch_labels = None
depends_on = None
COLUMNS = [('booking_capacity_limits', 'capacity', 'bigint'), ('booking_capacity_limits', 'set_by', 'bigint'), ('bookings', 'customer_name', 'text'), ('bookings', 'mobile', 'text'), ('bookings', 'customer_type', 'text'), ('bookings', 'vehicle_no', 'text'), ('bookings', 'make', 'text'), ('bookings', 'model', 'text'), ('bookings', 'color', 'text'), ('bookings', 'ui_status', 'text'), ('job_checklist_items', 'stage', 'text'), ('job_checklist_items', 'cycle_number', 'bigint'), ('purchase_order_delivery_confirmations', 'returned_qty', 'numeric'), ('purchase_order_delivery_confirmations', 'damaged_qty', 'numeric'), ('purchase_order_delivery_confirmations', 'wasted_qty', 'numeric'), ('purchase_order_lines', 'subtotal', 'numeric'), ('purchase_order_lines', 'gst_amount', 'numeric'), ('purchase_order_lines', 'total', 'numeric'), ('purchase_order_lines', 'item_name', 'text'), ('purchase_order_lines', 'unit', 'text'), ('purchase_orders', 'ui_status', 'text'), ('purchase_orders', 'subtotal', 'numeric'), ('purchase_orders', 'discount_total', 'numeric'), ('purchase_orders', 'gst_total', 'numeric'), ('purchase_orders', 'total', 'numeric'), ('suppliers', 'status', 'text')]

def upgrade():
    # Never backfill invented historical values on an occupied deployment.
    for table in sorted({t for t,_,_ in COLUMNS}):
        if op.get_bind().scalar(sa.text(f'SELECT EXISTS (SELECT 1 FROM "{table}")')):
            raise RuntimeError('Compatibility upgrade requires empty affected tables')
    for table,column,kind in COLUMNS:
        typ={'bigint':sa.BigInteger,'numeric':sa.Numeric,'text':sa.Text}[kind]
        op.add_column(table,sa.Column(column,typ(),nullable=False))
    op.execute('CREATE SCHEMA import_custody')
    op.execute('REVOKE ALL ON SCHEMA import_custody FROM PUBLIC')
    op.execute("""CREATE TABLE import_custody.runs (
        source_sha text PRIMARY KEY, policy_sha text NOT NULL,
        source_count integer NOT NULL CHECK(source_count=3241),
        completed boolean NOT NULL DEFAULT false)""")
    op.execute("""CREATE TABLE import_custody.records (
        source_sha text NOT NULL REFERENCES import_custody.runs(source_sha),
        source_table text NOT NULL, source_key text NOT NULL,
        payload jsonb NOT NULL, payload_sha text NOT NULL,
        relationships jsonb NOT NULL, target_table text NOT NULL,
        target_key jsonb, target_snapshot jsonb,
        disposition text NOT NULL CHECK(disposition IN ('BUSINESS','QUARANTINE')),
        reasons jsonb NOT NULL,
        PRIMARY KEY(source_sha,source_table,source_key),
        CHECK ((disposition='BUSINESS') = (target_key IS NOT NULL)))""")
    op.execute('REVOKE ALL ON ALL TABLES IN SCHEMA import_custody FROM PUBLIC')

def downgrade():
    if op.get_bind().scalar(sa.text('SELECT EXISTS(SELECT 1 FROM import_custody.records)')):
        raise RuntimeError('Refusing to discard source custody')
    for table in sorted({t for t,_,_ in COLUMNS}):
        if op.get_bind().scalar(sa.text(f'SELECT EXISTS(SELECT 1 FROM "{table}")')):
            raise RuntimeError('Refusing populated compatibility rollback')
    op.drop_table('records',schema='import_custody')
    op.drop_table('runs',schema='import_custody')
    op.execute('DROP SCHEMA import_custody')
    for table,column,_ in reversed(COLUMNS): op.drop_column(table,column)
