"""Audited estimate parity commands and durable, scoped media content."""
from alembic import op

revision = '20261022_0043'
down_revision = '20261022_0042'
branch_labels = depends_on = None


def upgrade():
    # Existing approval snapshots remain immutable. Explicit edits retain source
    # identity and are audited, matching the approved local editor's behavior.
    for table, fields in {
        'estimates': 'discount,gst_rate,approval_note,status,approved_snapshot,updated_by,updated_at,version',
        'estimate_lines': 'archived_at,archived_reason,updated_at,version',
        'job_media': 'label,category,archived_at,archive_reason,updated_by,updated_at,version',
    }.items():
        op.execute(f'DROP TRIGGER history_guard ON {table}')
        op.execute(f'CREATE TRIGGER history_guard BEFORE INSERT ON {table} FOR EACH ROW EXECUTE FUNCTION import_custody.guard_history()')
        op.execute(f"CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('{fields}')")
        op.execute(f'CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON {table} FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
        op.execute(f'GRANT SELECT,INSERT,UPDATE ON {table} TO workshopos_runtime')
    op.execute('''CREATE OR REPLACE FUNCTION protect_approved_estimate() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        IF OLD.status='APPROVED' AND (NEW.status IS DISTINCT FROM OLD.status OR
          NEW.approved_snapshot IS DISTINCT FROM OLD.approved_snapshot) THEN
          RAISE EXCEPTION 'Approved decision and snapshot are immutable'; END IF;
        IF OLD.status='APPROVED' AND current_user<>'workshopos_runtime' AND
          (NEW.discount IS DISTINCT FROM OLD.discount OR NEW.gst_rate IS DISTINCT FROM OLD.gst_rate OR NEW.note IS DISTINCT FROM OLD.note)
          THEN RAISE EXCEPTION 'Approved estimate edits require audited application commands'; END IF;
        RETURN NEW;
      END $$''')
    # Retain the previous function for provenance; the slice uses its scoped guard.
    op.execute('ALTER FUNCTION protect_approved_estimate_lines() RENAME TO protect_approved_estimate_lines_before_slice')
    op.execute('''CREATE FUNCTION protect_approved_estimate_lines() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        IF current_user='workshopos_runtime' AND TG_OP IN ('INSERT','UPDATE') AND
          EXISTS(SELECT 1 FROM estimates e JOIN job_cards j ON j.id=e.job_card_id
            WHERE e.id=NEW.estimate_id AND e.archived_at IS NULL AND j.archived_at IS NULL
            AND j.status NOT IN ('CLOSED','CANCELLED') AND e.status IN ('DRAFT','APPROVED')) THEN RETURN NEW; END IF;
        RAISE EXCEPTION 'Estimate lines require an active scoped application command';
      END $$''')
    op.execute('DROP TRIGGER estimate_lines_immutable ON estimate_lines')
    op.execute('CREATE TRIGGER estimate_lines_immutable BEFORE INSERT OR UPDATE OR DELETE ON estimate_lines FOR EACH ROW EXECUTE FUNCTION protect_approved_estimate_lines()')
    op.execute('''CREATE TABLE slice_media_content (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      tenant_id uuid NOT NULL, branch_id uuid NOT NULL, job_card_id bigint NOT NULL,
      media_id bigint NOT NULL UNIQUE REFERENCES job_media(id),
      content bytea NOT NULL CHECK(octet_length(content) BETWEEN 1 AND 1000000),
      sha256 text NOT NULL CHECK(length(sha256)=64),
      created_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
      FOREIGN KEY(tenant_id,branch_id,job_card_id) REFERENCES job_cards(tenant_id,branch_id,id))''')
    op.execute('ALTER TABLE slice_media_content ENABLE ROW LEVEL SECURITY')
    op.execute('ALTER TABLE slice_media_content FORCE ROW LEVEL SECURITY')
    op.execute("CREATE POLICY media_scope ON slice_media_content USING (tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[])) WITH CHECK (tenant_id::text=current_setting('workshopos.tenant_id',true) AND branch_id=ANY(current_setting('workshopos.branch_ids')::uuid[]))")
    op.execute("CREATE TRIGGER media_immutable BEFORE UPDATE OR DELETE ON slice_media_content FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('')")
    op.execute('GRANT SELECT,INSERT ON slice_media_content,document_snapshots,estimate_decisions TO workshopos_runtime')
    op.execute('GRANT SELECT ON job_service_tasks TO workshopos_runtime')
    op.execute('GRANT SELECT ON invoice_lines,payments,legacy_receipts,legacy_gate_passes,material_requests,material_approval_events,material_approvals TO workshopos_runtime')
    op.execute('GRANT INSERT,UPDATE ON material_approvals TO workshopos_runtime')
    op.execute('GRANT INSERT ON material_approval_events TO workshopos_runtime')
    op.execute("CREATE TRIGGER operational_guard BEFORE UPDATE OR DELETE ON material_approvals FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('status,submitted_by,submitted_at,reviewed_by,reviewed_at,rejection_reason,revision,version')")
    op.execute('CREATE TRIGGER operational_audit AFTER INSERT OR UPDATE ON material_approvals FOR EACH ROW EXECUTE FUNCTION audit_operational_edit()')
    op.execute("CREATE TRIGGER approval_event_immutable BEFORE UPDATE OR DELETE ON material_approval_events FOR EACH ROW EXECUTE FUNCTION operational_edit_guard('')")
    op.execute('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime')


def downgrade():
    raise RuntimeError('Restore the pre-estimates checkpoint into a separate clone; never erase audit or media history')
