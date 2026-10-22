"""Audited financial commands for the approved UI; imported finance stays immutable."""
from alembic import op

revision = '20261022_0047'
down_revision = '20261022_0046'
branch_labels = depends_on = None


def upgrade():
    op.execute('ALTER TABLE invoices ADD COLUMN slice_finance boolean NOT NULL DEFAULT false')
    op.execute('ALTER TABLE payments ADD COLUMN slice_finance boolean NOT NULL DEFAULT false')
    # The approved renderer generates documents from persisted business records.
    # It does not require the older backend\'s alternate financial-document template.
    for table, field in [('invoices','issued_document_id'), ('payments','receipt_document_id')]:
        op.execute(f'ALTER TABLE {table} DROP CONSTRAINT hist_native_{table}_{field}')
        op.execute(f'ALTER TABLE {table} ADD CONSTRAINT hist_native_{table}_{field} CHECK(history_source_sha IS NOT NULL OR {field} IS NOT NULL OR slice_finance)')
        op.execute(f'ALTER TABLE {table} ADD CONSTRAINT slice_native_{table} CHECK(NOT slice_finance OR history_source_sha IS NULL)')
    op.execute('ALTER TABLE invoice_lines ALTER COLUMN quantity TYPE numeric')
    op.execute('''CREATE FUNCTION slice_financial_guard() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE managed boolean;
    BEGIN
      IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Financial history cannot be deleted'; END IF;
      IF TG_TABLE_NAME='invoices' THEN managed:=OLD.slice_finance AND OLD.history_source_sha IS NULL;
      ELSIF TG_TABLE_NAME='payments' THEN managed:=OLD.slice_finance AND OLD.history_source_sha IS NULL;
      ELSE SELECT slice_finance AND history_source_sha IS NULL INTO managed FROM invoices WHERE id=OLD.invoice_id;
      END IF;
      IF NOT coalesce(managed,false) THEN RAISE EXCEPTION 'Historical financial records require explicit correction approval'; END IF;
      RETURN NEW;
    END $$''')
    fields = {
      'invoices':'tally_invoice_no,discount,subtotal,gst_amount,total,subtotal_paise,discount_paise,tax_paise,total_paise,status,notes,voided_at,void_reason,updated_at,version',
      'invoice_lines':'description,quantity,unit_amount_paise,gst_rate_bps,taxable_paise,tax_paise,total_paise,kind,rate,gst_type,gst_rate,archived_at,archived_reason,updated_at,version',
      'payments':'voided_at,void_reason,updated_at,version',
      'legacy_receipts':'voided_at,void_reason,version',
      'legacy_gate_passes':'voided_at,void_reason,version',
    }
    for table, allowed in fields.items():
        if table in ('invoices','invoice_lines','payments'):
            op.execute(f'DROP TRIGGER {table}_no_mutation ON {table}')
        op.execute(f'CREATE TRIGGER slice_financial_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION slice_financial_guard()')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{allowed}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
        op.execute(f'GRANT SELECT,INSERT,UPDATE ON {table} TO workshopos_runtime')
    op.execute('GRANT SELECT,INSERT ON legacy_invoice_events TO workshopos_runtime')
    op.execute("CREATE TRIGGER invoice_event_immutable BEFORE UPDATE OR DELETE ON legacy_invoice_events FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('')")
    op.execute('CREATE TRIGGER operational_audit AFTER INSERT ON legacy_invoice_events FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute("CREATE UNIQUE INDEX slice_current_invoice ON invoices(tenant_id,branch_id,job_card_id) WHERE slice_finance AND voided_at IS NULL")
    op.execute("CREATE UNIQUE INDEX slice_current_payment ON payments(tenant_id,branch_id,invoice_id) WHERE slice_finance AND voided_at IS NULL")
    op.execute('''CREATE FUNCTION slice_payment_integrity() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE inv invoices;
    BEGIN
      IF NOT NEW.slice_finance THEN RETURN NEW; END IF;
      SELECT * INTO inv FROM invoices WHERE id=NEW.invoice_id FOR UPDATE;
      IF NOT inv.slice_finance OR inv.voided_at IS NOT NULL OR inv.status<>'Pending'
        OR NEW.tenant_id<>inv.tenant_id OR NEW.branch_id<>inv.branch_id OR NEW.job_card_id<>inv.job_card_id
        OR NEW.amount IS DISTINCT FROM inv.total OR NEW.amount_paise<>inv.total_paise
        OR EXISTS(SELECT 1 FROM payments WHERE invoice_id=inv.id AND voided_at IS NULL)
        THEN RAISE EXCEPTION 'Payment must settle one current scoped invoice exactly once'; END IF;
      RETURN NEW;
    END $$''')
    op.execute('CREATE TRIGGER slice_payment_integrity BEFORE INSERT ON payments FOR EACH ROW EXECUTE FUNCTION slice_payment_integrity()')
    op.execute('DROP TRIGGER operational_guard ON job_cards')
    op.execute("CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON job_cards FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('advisor_id,status,sub_status,work_list,promised_at,promised_text,estimated_delivery,technician_id,service_type,pickup_drop,damage_marks,damage_marks_recorded_at,advisor_notes,customer_instructions,internal_instructions,updated_by,updated_at,version,archived_at,archived_reason,assignment_state,closed_at,delivery_by,final_km,acknowledgement')")
    op.execute('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime')


def downgrade():
    raise RuntimeError('Restore the checkpoint into a separate database and reconcile audited writes; no destructive downgrade')
