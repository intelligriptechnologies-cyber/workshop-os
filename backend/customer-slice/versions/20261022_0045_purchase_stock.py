"""Approved purchase/stock commands; preserve historical signed quantities."""
from alembic import op
import sqlalchemy as sa
import json
revision='20261022_0045'
down_revision='20261022_0044'
branch_labels=depends_on=None

def upgrade():
    connection=op.get_bind()
    op.execute('ALTER TABLE inward_purchase_lines ADD COLUMN archived_at timestamptz')
    editable={
      'suppliers':'name,mobile,email,address,contact_name,phone,gstin,status,updated_by,updated_at,version',
      'catalogue_items':'sku,category,name,unit,low_stock_qty,selling_price,archived_at,archived_by,archive_reason,updated_by,updated_at,version',
      'purchase_orders':'supplier_id,order_date,notes,status,ui_status,subtotal,discount_total,gst_total,total,updated_by,updated_at,version',
      'purchase_order_lines':'item_id,unit_cost,discount,gst_rate,subtotal,gst_amount,total,archived_at,version',
    }
    op.execute('ALTER TABLE purchase_order_lines ADD COLUMN archived_at timestamptz')
    op.execute('ALTER TABLE purchase_orders ALTER COLUMN supplier_id DROP NOT NULL')
    op.execute('ALTER TABLE purchase_order_lines ALTER COLUMN item_id DROP NOT NULL')
    for table,fields in editable.items():
        op.execute(f'DROP TRIGGER history_guard ON {table}')
        op.execute(f'CREATE TRIGGER history_guard BEFORE INSERT ON {table} FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{fields}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
        op.execute(f'GRANT SELECT,INSERT,UPDATE ON {table} TO workshopos_runtime')
    op.execute("ALTER TABLE purchase_orders ADD CONSTRAINT supplier_required_after_request CHECK(supplier_id IS NOT NULL OR ui_status IN ('PO Request','Cancelled'))")
    op.execute("ALTER TABLE purchase_order_lines ADD CONSTRAINT named_pending_item CHECK(item_id IS NOT NULL OR (btrim(item_name)<>'' AND btrim(unit)<>''))")
    # Keep custody quarantines immutable. A separate read-only semantic bridge
    # makes the seven exact legacy rows usable without fake native audit fields.
    op.execute("CREATE TABLE slice_historical_stock(tenant_id uuid NOT NULL,branch_id uuid NOT NULL,source_sha text NOT NULL,source_table text NOT NULL,source_key text NOT NULL,values jsonb NOT NULL,PRIMARY KEY(source_sha,source_table,source_key))")
    records=connection.execute(sa.text("SELECT * FROM import_custody.records WHERE source_table IN ('stock_ledger','stock_inwards')")).mappings().all()
    scope=connection.execute(sa.text('SELECT tenant_id,branch_id FROM catalogue_items LIMIT 1')).one()
    assert len(records)==7,'Unexpected source stock inventory; review before migrating'
    for r in records:
        values={k:None if v[0]=='null' else int(v[1]) if v[0]=='integer' else float.fromhex(v[1]) if v[0]=='real' else v[1] for k,v in r['payload'].items()}
        assert connection.scalar(sa.text('SELECT EXISTS(SELECT 1 FROM catalogue_items WHERE id=:id)'),{'id':values['item_id']})
        connection.execute(sa.text('INSERT INTO slice_historical_stock VALUES(:t,:b,:s,:n,:k,CAST(:v AS jsonb))'),dict(t=scope.tenant_id,b=scope.branch_id,s=r['source_sha'],n=r['source_table'],k=r['source_key'],v=json.dumps(values)))
    op.execute('ALTER TABLE slice_historical_stock ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE slice_historical_stock FORCE ROW LEVEL SECURITY')
    op.execute("CREATE POLICY stock_scope ON slice_historical_stock USING(tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[]))")
    op.execute("CREATE TRIGGER stock_history_immutable BEFORE UPDATE OR DELETE ON slice_historical_stock FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('')")
    op.execute('GRANT SELECT ON slice_historical_stock TO workshopos_runtime')
    for table in ['stock_ledger','stock_inwards']:
        op.execute(f"SELECT setval(pg_get_serial_sequence('{table}','id'),GREATEST((SELECT coalesce(max(id),0) FROM {table}),4),true)")
    op.execute("""CREATE OR REPLACE FUNCTION stock_ledger_prevent_negative() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE running numeric;
    BEGIN
      PERFORM 1 FROM catalogue_items WHERE id=NEW.item_id FOR UPDATE;
      IF NEW.qty IS NULL OR NEW.quantity<>-NEW.qty THEN RAISE EXCEPTION 'Explicit signed stock parity required'; END IF;
      SELECT coalesce(i.stock_qty,0)-coalesce((SELECT sum(l.qty) FROM stock_ledger l WHERE l.item_id=i.id),0)
        -coalesce((SELECT sum((h.values->>'qty')::numeric) FROM slice_historical_stock h WHERE h.source_table='stock_ledger' AND (h.values->>'item_id')::bigint=i.id),0)
        INTO running FROM catalogue_items i WHERE id=NEW.item_id;
      IF running-NEW.qty<0 THEN RAISE EXCEPTION 'negative_stock_not_allowed'; END IF;
      RETURN NEW;
    END $$""")
    for table in ['material_requests','material_events','legacy_material_movements','purchase_order_quotations','inward_purchases','inward_purchase_lines','inward_purchase_attachments','inward_purchase_events','inward_purchase_revisions','inward_purchase_revision_lines','material_purchase_requests','local_purchases']:
        op.execute(f'GRANT SELECT,INSERT,UPDATE ON {table} TO workshopos_runtime')
        cols=[r[0] for r in connection.execute(sa.text("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=:t AND column_name NOT IN ('id','tenant_id','branch_id','created_at','created_by')"),{'t':table})]
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{','.join(cols)}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute('GRANT SELECT,INSERT ON stock_ledger,stock_inwards,purchase_order_delivery_receipts,purchase_order_delivery_receipt_lines,purchase_order_delivery_confirmations TO workshopos_runtime')
    op.execute('CREATE TABLE slice_purchase_files(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,tenant_id uuid NOT NULL,branch_id uuid NOT NULL,purchase_id bigint NOT NULL REFERENCES inward_purchases(id),content bytea NOT NULL CHECK(octet_length(content) BETWEEN 1 AND 10485760),mime_type text NOT NULL,sha256 text NOT NULL,created_by uuid NOT NULL REFERENCES platform_users(id),created_at timestamptz NOT NULL DEFAULT now())')
    op.execute('ALTER TABLE slice_purchase_files ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE slice_purchase_files FORCE ROW LEVEL SECURITY')
    op.execute("CREATE POLICY purchase_file_scope ON slice_purchase_files USING(tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[])) WITH CHECK(tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[]))")
    op.execute("CREATE TRIGGER purchase_file_immutable BEFORE UPDATE OR DELETE ON slice_purchase_files FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('')")
    op.execute('GRANT SELECT,INSERT ON slice_purchase_files TO workshopos_runtime')
    op.execute('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime')

def downgrade():
    raise RuntimeError('Restore a checkpoint into a separate database; do not erase operational history')
