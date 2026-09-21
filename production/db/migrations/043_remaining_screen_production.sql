BEGIN;

-- V12-14 exposes existing authoritative ledgers. These indexes serve the common
-- branch/search/list access paths without introducing replacement tables.
CREATE INDEX appointment_production_list_idx ON workshopos.appointment(tenant_id,branch_id,updated_at DESC,id);
CREATE INDEX advisor_follow_up_production_list_idx ON workshopos.advisor_follow_up(tenant_id,branch_id,created_at DESC,id);
CREATE INDEX action_inbox_production_list_idx ON workshopos.action_inbox(tenant_id,branch_id,created_at DESC,id);
CREATE INDEX material_request_production_list_idx ON workshopos.job_material_request(tenant_id,branch_id,created_at DESC,id);
CREATE INDEX report_fact_production_list_idx ON workshopos.report_fact(tenant_id,branch_id,recorded_at DESC,id);

-- Protected templates are immutable through ordinary commands. This controlled,
-- additive migration temporarily bypasses that command trigger and appends an
-- explicit version-history row so existing installations gain the new pages
-- without weakening or silently replacing any permission.
ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH updated AS (
  UPDATE workshopos.role_template
  SET permissions = permissions || '["appointments.page","appointment.read","appointment.manage","appointments.export","follow-ups.page","follow-up.read","follow-up.manage","follow-ups.export","action-inbox.page","action-inbox.read","action-inbox.manage","action-inbox.export","materials.page","material.read","material.manage","materials.export","reports.page","report.read","reports.export","masters.page","masters.read","masters.export"]'::jsonb,
      version = version + 1,
      updated_at = transaction_timestamp()
  WHERE system_template AND active
    AND permissions ? 'membership.manage'
    AND permissions ? 'role.manage'
  RETURNING *
)
INSERT INTO workshopos.role_template_version(
  id, tenant_id, role_id, version, name, description, permissions, active, change_reason
)
SELECT gen_random_uuid(), tenant_id, id, version, name, description, permissions, active,
       'V12-14 additive production-screen permissions'
FROM updated;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
