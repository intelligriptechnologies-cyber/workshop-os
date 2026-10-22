"""Custody-bound historical metadata; native requirements and business FKs survive."""
from alembic import op
import sqlalchemy as sa
# Frozen revision contract; future policy changes require a new revision.
TABLES = ['catalogue_items', 'customers', 'estimate_lines', 'estimates', 'followups', 'invoice_lines', 'invoices', 'job_cards', 'job_checklist_items', 'job_media', 'job_service_tasks', 'legacy_material_movements', 'payments', 'purchase_order_delivery_confirmations', 'purchase_order_delivery_receipts', 'purchase_order_lines', 'purchase_orders', 'qc_checks', 'quotations', 'sales_leads', 'service_task_catalog', 'suppliers', 'technician_tasks', 'vehicles', 'visits']
NULLABLE = {'customers': ['created_by', 'updated_by', 'created_at', 'updated_at', 'address'], 'vehicles': ['created_by', 'updated_by', 'created_at', 'updated_at', 'engine_no'], 'visits': ['created_by', 'updated_by', 'created_at', 'updated_at', 'received_by', 'received_at', 'odo_reading', 'fuel_level_value', 'fuel_level_unit'], 'job_cards': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'estimates': ['created_by', 'updated_by', 'created_at', 'updated_at', 'revision'], 'catalogue_items': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'followups': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'job_service_tasks': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'invoices': ['created_by', 'updated_by', 'created_at', 'updated_at', 'issued_document_id'], 'payments': ['created_by', 'updated_by', 'created_at', 'updated_at', 'receipt_document_id', 'received_by', 'received_at'], 'job_media': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'purchase_orders': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'suppliers': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'qc_checks': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'technician_tasks': ['created_by', 'updated_by', 'created_at', 'updated_at', 'assigned_to'], 'sales_leads': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'quotations': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'service_task_catalog': ['created_by', 'updated_by', 'created_at', 'updated_at'], 'invoice_lines': ['taxable_paise', 'tax_paise', 'total_paise'], 'purchase_order_delivery_receipts': ['received_by', 'received_at', 'request_key'], 'purchase_order_delivery_confirmations': ['confirmed_by', 'confirmed_at', 'request_key', 'rejected_qty']}
ACTORS = {'visits': ['advisor_id', 'received_by'], 'job_cards': ['advisor_id'], 'technician_tasks': ['assigned_to'], 'job_checklist_items': ['checked_by', 'na_by'], 'purchase_orders': ['created_by'], 'suppliers': ['created_by'], 'purchase_order_delivery_receipts': ['received_by'], 'purchase_order_delivery_confirmations': ['confirmed_by']}

revision = '20261021_0037'
down_revision = '20261021_0036'
branch_labels = depends_on = None

def cn(value):
    import hashlib
    return value if len(value)<=63 else value[:42]+'_'+hashlib.sha256(value.encode()).hexdigest()[:16]

def upgrade():
    bind = op.get_bind()
    # This package is deliberately restricted to a fresh disposable rehearsal.
    if bind.scalar(sa.text('SELECT EXISTS(SELECT 1 FROM import_custody.records)')):
        raise RuntimeError('Historical policy requires fresh empty rehearsal')
    op.execute('''CREATE OR REPLACE FUNCTION public.protect_approved_estimate_lines()
    RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE protected_estimate_id bigint;
    BEGIN
      IF TG_OP = 'INSERT' AND current_user = 'stage4c_rehearsal_owner'
         AND NEW.history_source_sha IS NOT NULL AND EXISTS (
           SELECT 1 FROM import_custody.runs r JOIN import_custody.records s USING(source_sha)
           WHERE r.source_sha=NEW.history_source_sha AND NOT r.completed
             AND s.source_table=NEW.history_source_table AND s.source_key=NEW.history_source_key
             AND s.target_table='estimate_lines' AND s.disposition='QUARANTINE'
             AND (s.payload->'estimate_id'->>1)::bigint=NEW.estimate_id
             AND (s.payload->'id'->>1)::bigint=NEW.id
         ) THEN RETURN NEW; END IF;
      protected_estimate_id := CASE WHEN TG_OP='DELETE' THEN OLD.estimate_id ELSE NEW.estimate_id END;
      IF EXISTS(SELECT 1 FROM estimates WHERE id=protected_estimate_id AND status<>'DRAFT') THEN
        RAISE EXCEPTION 'approved_or_decided_estimate_is_immutable';
      END IF;
      IF TG_OP='DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END $$''')
    op.execute('''CREATE FUNCTION import_custody.guard_history() RETURNS trigger
    LANGUAGE plpgsql AS $$
    DECLARE evidence record;
    BEGIN
      IF TG_OP <> 'INSERT' THEN
        IF OLD.history_source_sha IS NOT NULL THEN
          RAISE EXCEPTION 'Imported history is immutable';
        END IF;
        IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      END IF;
      IF NEW.history_source_sha IS NOT NULL THEN
        IF current_user <> 'stage4c_rehearsal_owner' THEN
          RAISE EXCEPTION 'Historical import is owner-only';
        END IF;
        IF NOT EXISTS(SELECT 1 FROM import_custody.runs WHERE source_sha=NEW.history_source_sha AND NOT completed) THEN
          RAISE EXCEPTION 'Historical import run is closed';
        END IF;
        SELECT * INTO evidence FROM import_custody.records
          WHERE source_sha=NEW.history_source_sha AND source_table=NEW.history_source_table
          AND source_key=NEW.history_source_key;
        IF NOT FOUND OR evidence.target_table <> TG_TABLE_NAME
           OR (evidence.source_key::jsonb->>'id') IS DISTINCT FROM NEW.id::text
           OR NEW.tenant_id::text <> 'eb01f21c-09d1-5cb1-aadb-d15649568fd7'
           OR NEW.branch_id::text <> '12809bd1-d793-52d2-878d-7f0f8f1d6e09' THEN
          RAISE EXCEPTION 'History must match exact custody identity and scope';
        END IF;
      END IF;
      RETURN NEW;
    END $$''')
    for table in TABLES:
        columns = {c['name']:c for c in sa.inspect(bind).get_columns(table)}
        for name in ['history_source_sha', 'history_source_table', 'history_source_key']:
            op.add_column(table, sa.Column(name, sa.Text()))
        op.add_column(table, sa.Column('historical_values', sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")))
        op.create_foreign_key('hist_custody_'+table, table, 'records',
            ['history_source_sha','history_source_table','history_source_key'],
            ['source_sha','source_table','source_key'], referent_schema='import_custody', match='FULL')
        for field in NULLABLE.get(table, []):
            if field not in columns or columns[field]['nullable']: continue
            op.alter_column(table, field, nullable=True)
            op.create_check_constraint(cn('hist_native_'+table+'_'+field), table,
                f'history_source_sha IS NOT NULL OR "{field}" IS NOT NULL')
        for field in ACTORS.get(table, []):
            name = 'historical_'+field
            op.add_column(table, sa.Column(name, sa.BigInteger()))
            op.create_foreign_key(cn('hist_actor_'+table+'_'+field),table,'workshop_user_profiles',
                ['tenant_id','branch_id',name],['tenant_id','branch_id','id'])
            op.create_check_constraint(cn('hist_only_'+table+'_'+field),table,
                f'history_source_sha IS NOT NULL OR "{name}" IS NULL')
        op.execute(f'''CREATE TRIGGER history_guard BEFORE INSERT OR UPDATE OR DELETE ON "{table}"
                       FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()''')

def downgrade():
    bind = op.get_bind()
    for table in TABLES:
        if bind.scalar(sa.text(f'SELECT EXISTS(SELECT 1 FROM "{table}")')):
            raise RuntimeError('Refusing populated historical rollback')
    # Restore original nullability from the pinned 0035 catalog (0036 adds none here).
    import json
    from pathlib import Path
    catalog=json.loads(Path('/evidence/stage4b-test-catalog.json.md').read_text())
    required={(c['table_name'],c['column_name']) for c in catalog['columns'] if c['is_nullable']=='NO'}
    for table in reversed(TABLES):
        op.execute(f'DROP TRIGGER history_guard ON "{table}"')
        for field in ACTORS.get(table,[]):
            op.drop_column(table,'historical_'+field)
        for field in NULLABLE.get(table,[]):
            if (table,field) in required:
                op.drop_constraint(cn('hist_native_'+table+'_'+field),table,type_='check')
                op.alter_column(table,field,nullable=False)
        op.drop_constraint('hist_custody_'+table,table,type_='foreignkey')
        for name in ['historical_values','history_source_key','history_source_table','history_source_sha']:
            op.drop_column(table,name)
    op.execute('DROP FUNCTION import_custody.guard_history()')
    op.execute('''CREATE OR REPLACE FUNCTION public.protect_approved_estimate_lines()
    RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE protected_estimate_id bigint;
    BEGIN
      protected_estimate_id := CASE WHEN TG_OP='DELETE' THEN OLD.estimate_id ELSE NEW.estimate_id END;
      IF EXISTS(SELECT 1 FROM estimates WHERE id=protected_estimate_id AND status<>'DRAFT') THEN
        RAISE EXCEPTION 'approved_or_decided_estimate_is_immutable';
      END IF;
      IF TG_OP='DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END $$''')
