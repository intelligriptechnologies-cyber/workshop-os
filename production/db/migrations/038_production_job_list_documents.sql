BEGIN;

CREATE TABLE workshopos.job_settings_snapshot (
  job_id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  tenant_version bigint NOT NULL CHECK (tenant_version > 0),
  branch_version bigint CHECK (branch_version > 0),
  values jsonb NOT NULL CHECK (workshopos.business_settings_values_valid(values, false)),
  captured_by_membership_id uuid REFERENCES workshopos.membership(id),
  capture_source text NOT NULL DEFAULT 'LIFECYCLE' CHECK (capture_source IN ('LIFECYCLE','V12_09_MIGRATION')),
  captured_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id,branch_id,job_id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id),
  CHECK ((capture_source='LIFECYCLE' AND captured_by_membership_id IS NOT NULL) OR (capture_source='V12_09_MIGRATION' AND captured_by_membership_id IS NULL))
);

-- Local production runtime keeps protected render bytes separate from discovery metadata.
CREATE TABLE workshopos.job_document_content (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  document_id uuid NOT NULL,
  content bytea NOT NULL,
  mime_type text NOT NULL CHECK (mime_type='application/pdf'),
  filename text NOT NULL CHECK (btrim(filename) <> ''),
  PRIMARY KEY (tenant_id,branch_id,document_id),
  FOREIGN KEY (tenant_id,branch_id,document_id) REFERENCES workshopos.rendered_document(tenant_id,branch_id,id)
);

-- URL-addressed resources are tenant-scoped UUIDs even though their original
-- primary keys include branch scope.
ALTER TABLE workshopos.reception_job_card ADD CONSTRAINT reception_job_card_tenant_id_unique UNIQUE (tenant_id,id);
ALTER TABLE workshopos.rendered_document ADD CONSTRAINT rendered_document_tenant_id_unique UNIQUE (tenant_id,id);

CREATE FUNCTION workshopos.reject_job_document_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Job settings snapshots and rendered documents are immutable'; END $$;
CREATE TRIGGER job_settings_snapshot_immutable BEFORE UPDATE OR DELETE ON workshopos.job_settings_snapshot
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_document_mutation();
CREATE TRIGGER rendered_document_immutable BEFORE UPDATE OR DELETE ON workshopos.rendered_document
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_document_mutation();
CREATE TRIGGER job_document_content_immutable BEFORE UPDATE OR DELETE ON workshopos.job_document_content
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_document_mutation();

ALTER TABLE workshopos.job_settings_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_settings_snapshot FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_document_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_document_content FORCE ROW LEVEL SECURITY;
CREATE POLICY job_settings_snapshot_isolation ON workshopos.job_settings_snapshot
  USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_document_content_isolation ON workshopos.job_document_content
  USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));

CREATE FUNCTION workshopos.capture_job_settings_on_active() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_tenant workshopos.business_settings_version; v_branch workshopos.business_settings_version;
  v_actor uuid; v_values jsonb;
BEGIN
  IF NEW.resource_type <> 'JOB' OR NEW.stage <> 'ACTIVE' OR (TG_OP='UPDATE' AND OLD.stage='ACTIVE') THEN RETURN NEW; END IF;
  SELECT * INTO v_tenant FROM workshopos.business_settings_version
    WHERE tenant_id=NEW.tenant_id AND scope_key='00000000-0000-0000-0000-000000000000' ORDER BY version DESC LIMIT 1;
  IF NOT FOUND THEN RAISE EXCEPTION 'tenant settings must be published before active work begins'; END IF;
  SELECT * INTO v_branch FROM workshopos.business_settings_version
    WHERE tenant_id=NEW.tenant_id AND scope_key=NEW.branch_id ORDER BY version DESC LIMIT 1;
  SELECT id INTO v_actor FROM workshopos.membership WHERE tenant_id=NEW.tenant_id
    AND identity_subject=current_setting('app.subject_id',true) AND active;
  IF v_actor IS NULL THEN RAISE EXCEPTION 'active-work settings snapshot requires an authenticated membership'; END IF;
  v_values := v_tenant.values || coalesce(v_branch.values,'{}'::jsonb);
  INSERT INTO workshopos.job_settings_snapshot(job_id,tenant_id,branch_id,tenant_version,branch_version,values,captured_by_membership_id)
  VALUES(NEW.id,NEW.tenant_id,NEW.branch_id,v_tenant.version,CASE WHEN v_branch.id IS NULL THEN NULL ELSE v_branch.version END,v_values,v_actor)
  ON CONFLICT (tenant_id,branch_id,job_id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER lifecycle_job_settings_snapshot AFTER INSERT OR UPDATE OF stage ON workshopos.lifecycle_resources
FOR EACH ROW EXECUTE FUNCTION workshopos.capture_job_settings_on_active();

-- Upgrade invariant: active Jobs that pre-date v1.2 get the settings effective at migration time,
-- explicitly attributed to the migration rather than to an invented human actor.
INSERT INTO workshopos.job_settings_snapshot(job_id,tenant_id,branch_id,tenant_version,branch_version,values,capture_source)
SELECT lr.id,lr.tenant_id,lr.branch_id,t.version,b.version,t.values || coalesce(b.values,'{}'::jsonb),'V12_09_MIGRATION'
FROM workshopos.lifecycle_resources lr
JOIN workshopos.reception_job_card j ON j.tenant_id=lr.tenant_id AND j.branch_id=lr.branch_id AND j.id=lr.id
JOIN LATERAL (SELECT version,values FROM workshopos.business_settings_version s WHERE s.tenant_id=lr.tenant_id AND s.scope_key='00000000-0000-0000-0000-000000000000' ORDER BY version DESC LIMIT 1) t ON true
LEFT JOIN LATERAL (SELECT version,values FROM workshopos.business_settings_version s WHERE s.tenant_id=lr.tenant_id AND s.scope_key=lr.branch_id ORDER BY version DESC LIMIT 1) b ON true
WHERE lr.resource_type='JOB' AND lr.stage='ACTIVE';

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM workshopos.lifecycle_resources lr
    JOIN workshopos.reception_job_card j ON j.tenant_id=lr.tenant_id AND j.branch_id=lr.branch_id AND j.id=lr.id
    LEFT JOIN workshopos.job_settings_snapshot s ON s.tenant_id=lr.tenant_id AND s.branch_id=lr.branch_id AND s.job_id=lr.id
    WHERE lr.resource_type='JOB' AND lr.stage='ACTIVE' AND s.job_id IS NULL
  ) THEN RAISE EXCEPTION 'active Jobs require published settings before V12-09 migration'; END IF;
END $$;

CREATE INDEX reception_visit_job_list_idx ON workshopos.reception_visit(tenant_id,branch_id,checked_in_at DESC,id);
CREATE INDEX lifecycle_job_list_idx ON workshopos.lifecycle_resources(tenant_id,branch_id,resource_type,stage,updated_at DESC,id);
CREATE INDEX rendered_document_job_discovery_idx ON workshopos.rendered_document(tenant_id,branch_id,document_type,source_id,rendered_at DESC);

ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH changed AS (
  UPDATE workshopos.role_template
  SET permissions = permissions || '["jobs.page","job.read","job.document.download","job.export"]'::jsonb,
      version = version + 1, updated_at = transaction_timestamp()
  WHERE system_template AND name='Business Owner/Admin' AND NOT permissions ? 'jobs.page'
  RETURNING *
)
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-09 Job List and document permissions' FROM changed;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
