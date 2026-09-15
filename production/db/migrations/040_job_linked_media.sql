BEGIN;

-- V12-11 extends the existing private-media reservation boundary. Original bytes
-- remain in object storage; only metadata and deliberately small thumbnails live here.
ALTER TABLE workshopos.secure_media_object
  ADD COLUMN job_id uuid,
  ADD COLUMN category text,
  ADD COLUMN label text,
  ADD COLUMN thumbnail_bytes bytea,
  ADD COLUMN thumbnail_mime_type text,
  ADD COLUMN version bigint NOT NULL DEFAULT 1,
  ADD COLUMN archived_at timestamptz,
  ADD COLUMN archived_by_membership_id uuid REFERENCES workshopos.membership(id),
  ADD COLUMN archive_reason text,
  ADD COLUMN scanned_at timestamptz,
  ADD COLUMN scanner_reference text;

ALTER TABLE workshopos.secure_media_object
  ADD CONSTRAINT secure_media_job_fk FOREIGN KEY (tenant_id,branch_id,job_id)
    REFERENCES workshopos.reception_job_card(tenant_id,branch_id,id),
  ADD CONSTRAINT secure_media_category_check CHECK (category IN ('BEFORE','INSPECTION','PROGRESS','AFTER')),
  ADD CONSTRAINT secure_media_label_check CHECK (label IS NULL OR btrim(label) <> ''),
  ADD CONSTRAINT secure_media_thumbnail_check CHECK (
    (job_id IS NULL AND category IS NULL AND label IS NULL AND thumbnail_bytes IS NULL AND thumbnail_mime_type IS NULL)
    OR (job_id IS NOT NULL AND category IS NOT NULL AND label IS NOT NULL
      AND thumbnail_bytes IS NOT NULL AND octet_length(thumbnail_bytes) BETWEEN 1 AND 262144
      AND thumbnail_mime_type IN ('image/png','image/jpeg'))
  ),
  ADD CONSTRAINT secure_media_archive_check CHECK (
    (archived_at IS NULL AND archived_by_membership_id IS NULL AND archive_reason IS NULL)
    OR (archived_at IS NOT NULL AND archived_by_membership_id IS NOT NULL AND btrim(archive_reason) <> '')
  );

-- The original six-argument reservation function remains for non-Job secure-media
-- domains. This overload is the sole reservation path for Job Media.
CREATE FUNCTION workshopos.reserve_secure_media_upload(
  p_branch_id uuid,p_job_id uuid,p_category text,p_label text,p_file_name text,p_mime_type text,
  p_byte_length bigint,p_checksum_sha256 text,p_thumbnail_bytes bytea,p_thumbnail_mime_type text,p_membership_id uuid
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_tenant_id uuid := workshopos.current_tenant_id(); v_quota workshopos.secure_media_quota%ROWTYPE;
  v_media_id uuid := gen_random_uuid(); v_object_key text := format('private/%s/%s/media/%s',v_tenant_id,p_branch_id,v_media_id);
BEGIN
  IF NOT (p_branch_id=ANY(workshopos.authorized_branch_ids())) THEN RAISE EXCEPTION 'branch forbidden'; END IF;
  SELECT * INTO STRICT v_quota FROM workshopos.secure_media_quota WHERE tenant_id=v_tenant_id FOR UPDATE;
  IF v_quota.reserved_bytes+p_byte_length>v_quota.quota_bytes THEN RAISE EXCEPTION 'media quota exceeded'; END IF;
  UPDATE workshopos.secure_media_quota SET reserved_bytes=reserved_bytes+p_byte_length,version=version+1 WHERE tenant_id=v_tenant_id;
  INSERT INTO workshopos.secure_media_object
    (tenant_id,branch_id,media_id,job_id,object_key,file_name,mime_type,byte_length,checksum_sha256,scan_status,
     category,label,thumbnail_bytes,thumbnail_mime_type,created_by_membership_id)
  VALUES(v_tenant_id,p_branch_id,v_media_id,p_job_id,v_object_key,p_file_name,p_mime_type,p_byte_length,p_checksum_sha256,'PENDING',
     p_category,p_label,p_thumbnail_bytes,p_thumbnail_mime_type,p_membership_id);
  RETURN v_media_id;
END $$;

CREATE TABLE workshopos.job_media_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  request_hash char(64) NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'),
  response jsonb NOT NULL CHECK (jsonb_typeof(response)='object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id,branch_id,idempotency_key), UNIQUE (tenant_id,idempotency_key)
);

CREATE FUNCTION workshopos.enforce_job_media_category() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_stage text;
BEGIN
  IF NEW.job_id IS NULL THEN RETURN NEW; END IF;
  SELECT stage INTO v_stage FROM workshopos.lifecycle_resources
  WHERE tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id AND id=NEW.job_id AND resource_type='JOB';
  IF v_stage IS NULL THEN RAISE EXCEPTION 'MEDIA_JOB_NOT_FOUND'; END IF;
  IF NEW.category IN ('BEFORE','INSPECTION') AND v_stage NOT IN ('APPOINTMENT','CHECK_IN','INSPECTION','ESTIMATE','APPROVED') THEN
    RAISE EXCEPTION 'MEDIA_CATEGORY_STAGE_INVALID';
  ELSIF NEW.category='PROGRESS' AND v_stage NOT IN ('ACTIVE','QC') THEN
    RAISE EXCEPTION 'MEDIA_CATEGORY_STAGE_INVALID';
  ELSIF NEW.category='AFTER' AND v_stage NOT IN ('QC','BILLING','GATE_VERIFICATION','DELIVERED') THEN
    RAISE EXCEPTION 'MEDIA_CATEGORY_STAGE_INVALID';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER secure_media_job_category_gate BEFORE INSERT OR UPDATE OF job_id,category
ON workshopos.secure_media_object FOR EACH ROW EXECUTE FUNCTION workshopos.enforce_job_media_category();

CREATE FUNCTION workshopos.protect_job_media() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Job media cannot be hard deleted' USING ERRCODE='integrity_constraint_violation'; END IF;
  IF (OLD.tenant_id,OLD.branch_id,OLD.media_id,OLD.job_id,OLD.object_key,OLD.file_name,OLD.mime_type,OLD.byte_length,
      OLD.checksum_sha256,OLD.category,OLD.label,OLD.thumbnail_bytes,OLD.thumbnail_mime_type,OLD.created_by_membership_id,OLD.created_at)
     IS DISTINCT FROM
     (NEW.tenant_id,NEW.branch_id,NEW.media_id,NEW.job_id,NEW.object_key,NEW.file_name,NEW.mime_type,NEW.byte_length,
      NEW.checksum_sha256,NEW.category,NEW.label,NEW.thumbnail_bytes,NEW.thumbnail_mime_type,NEW.created_by_membership_id,NEW.created_at) THEN
    RAISE EXCEPTION 'Job media identity and content metadata are immutable' USING ERRCODE='integrity_constraint_violation';
  END IF;
  IF OLD.archived_at IS NOT NULL AND (NEW.archived_at,NEW.archived_by_membership_id,NEW.archive_reason) IS DISTINCT FROM (OLD.archived_at,OLD.archived_by_membership_id,OLD.archive_reason) THEN
    RAISE EXCEPTION 'Archived Job media is immutable' USING ERRCODE='integrity_constraint_violation';
  END IF;
  IF OLD.scan_status IS DISTINCT FROM NEW.scan_status AND current_setting('app.scanner_authority',true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Trusted scanner authority required' USING ERRCODE='insufficient_privilege';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER secure_job_media_protection BEFORE UPDATE OR DELETE ON workshopos.secure_media_object
FOR EACH ROW EXECUTE FUNCTION workshopos.protect_job_media();

CREATE FUNCTION workshopos.record_job_media_scan(p_media_id uuid,p_status text,p_scanner_reference text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF current_setting('app.scanner_authority',true) IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Trusted scanner authority required'; END IF;
  IF p_status NOT IN ('CLEAN','INFECTED','FAILED') OR btrim(p_scanner_reference)='' THEN RAISE EXCEPTION 'Invalid scan result'; END IF;
  UPDATE workshopos.secure_media_object SET scan_status=p_status,scanned_at=transaction_timestamp(),scanner_reference=p_scanner_reference,version=version+1
  WHERE tenant_id=workshopos.current_tenant_id() AND media_id=p_media_id AND scan_status='PENDING' AND archived_at IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'MEDIA_NOT_PENDING'; END IF;
END $$;

ALTER TABLE workshopos.job_media_command_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_media_command_receipt FORCE ROW LEVEL SECURITY;
CREATE POLICY job_media_receipt_isolation ON workshopos.job_media_command_receipt
  USING (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id=workshopos.current_tenant_id() AND branch_id=ANY(workshopos.authorized_branch_ids()));
CREATE TRIGGER job_media_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.job_media_command_receipt
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_lifecycle_evidence_mutation();

CREATE VIEW workshopos.available_job_media WITH (security_barrier=true,security_invoker=true) AS
SELECT tenant_id,branch_id,media_id,job_id,object_key,file_name,mime_type,byte_length,checksum_sha256,category,label,
       thumbnail_bytes,thumbnail_mime_type,version,created_at
FROM workshopos.secure_media_object WHERE job_id IS NOT NULL AND scan_status='CLEAN' AND archived_at IS NULL;

CREATE INDEX secure_media_job_list_idx ON workshopos.secure_media_object(tenant_id,branch_id,job_id,created_at DESC,media_id);
CREATE INDEX secure_media_scan_queue_idx ON workshopos.secure_media_object(scan_status,created_at) WHERE scan_status='PENDING' AND archived_at IS NULL;

INSERT INTO workshopos.secure_media_quota(tenant_id,quota_bytes)
SELECT tenant_id,1073741824 FROM workshopos.tenant ON CONFLICT (tenant_id) DO NOTHING;

ALTER TABLE workshopos.role_template DISABLE TRIGGER role_template_protection;
WITH changed AS (
  UPDATE workshopos.role_template SET permissions=permissions || '["media.page","media.read","media.upload","media.archive","media.download"]'::jsonb,
      version=version+1,updated_at=transaction_timestamp()
  WHERE system_template AND name='Business Owner/Admin'
    AND NOT permissions ?& ARRAY['media.page','media.read','media.upload','media.archive','media.download'] RETURNING *
)
INSERT INTO workshopos.role_template_version(id,tenant_id,role_id,version,name,description,permissions,active,change_reason)
SELECT gen_random_uuid(),tenant_id,id,version,name,description,permissions,active,'V12-11 Job-linked Media permissions' FROM changed;
ALTER TABLE workshopos.role_template ENABLE TRIGGER role_template_protection;

COMMIT;
