-- S25 secure-media persistence boundary. Deployment and live penetration evidence remain S26/S28 concerns.
CREATE TABLE workshopos.secure_media_quota (
  tenant_id uuid PRIMARY KEY,
  quota_bytes bigint NOT NULL CHECK (quota_bytes > 0),
  reserved_bytes bigint NOT NULL DEFAULT 0 CHECK (reserved_bytes >= 0 AND reserved_bytes <= quota_bytes),
  version bigint NOT NULL DEFAULT 1
);

CREATE TABLE workshopos.secure_media_object (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  media_id uuid NOT NULL DEFAULT gen_random_uuid(),
  object_key text NOT NULL CHECK (object_key LIKE 'private/%'),
  file_name text NOT NULL,
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'application/pdf')),
  byte_length bigint NOT NULL CHECK (byte_length > 0),
  checksum_sha256 text NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'),
  scan_status text NOT NULL CHECK (scan_status IN ('PENDING', 'CLEAN', 'INFECTED', 'FAILED')),
  created_by_membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id, media_id),
  UNIQUE (tenant_id, object_key)
);

CREATE TABLE workshopos.secure_media_access_audit (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  audit_id uuid NOT NULL DEFAULT gen_random_uuid(),
  media_id uuid NOT NULL,
  actor_membership_id uuid NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('ALLOWED', 'DENIED')),
  reason_code text,
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id, audit_id)
);

ALTER TABLE workshopos.secure_media_object ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.secure_media_object FORCE ROW LEVEL SECURITY;
CREATE POLICY secure_media_object_scope ON workshopos.secure_media_object
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

ALTER TABLE workshopos.secure_media_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.secure_media_quota FORCE ROW LEVEL SECURITY;
CREATE POLICY secure_media_quota_scope ON workshopos.secure_media_quota
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

ALTER TABLE workshopos.secure_media_access_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.secure_media_access_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY secure_media_access_audit_scope ON workshopos.secure_media_access_audit
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

CREATE OR REPLACE FUNCTION workshopos.prevent_secure_media_audit_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'secure media access audit is append-only';
END;
$$;

CREATE TRIGGER secure_media_access_audit_immutable
BEFORE UPDATE OR DELETE ON workshopos.secure_media_access_audit
FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_secure_media_audit_mutation();

CREATE OR REPLACE FUNCTION workshopos.reserve_secure_media_upload(
  p_branch_id uuid,
  p_file_name text,
  p_mime_type text,
  p_byte_length bigint,
  p_checksum_sha256 text,
  p_membership_id uuid
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_tenant_id uuid := workshopos.current_tenant_id();
  v_quota workshopos.secure_media_quota%ROWTYPE;
  v_media_id uuid := gen_random_uuid();
  v_object_key text := format('private/%s/%s/media/%s', v_tenant_id, p_branch_id, v_media_id);
BEGIN
  IF NOT (p_branch_id = ANY (workshopos.authorized_branch_ids())) THEN
    RAISE EXCEPTION 'branch forbidden';
  END IF;
  SELECT * INTO STRICT v_quota
  FROM workshopos.secure_media_quota
  WHERE tenant_id = v_tenant_id
  FOR UPDATE;
  IF v_quota.reserved_bytes + p_byte_length > v_quota.quota_bytes THEN
    RAISE EXCEPTION 'media quota exceeded';
  END IF;
  UPDATE workshopos.secure_media_quota
  SET reserved_bytes = reserved_bytes + p_byte_length, version = version + 1
  WHERE tenant_id = v_tenant_id;
  INSERT INTO workshopos.secure_media_object
    (tenant_id, branch_id, media_id, object_key, file_name, mime_type, byte_length, checksum_sha256, scan_status, created_by_membership_id)
  VALUES
    (v_tenant_id, p_branch_id, v_media_id, v_object_key, p_file_name, p_mime_type, p_byte_length, p_checksum_sha256, 'PENDING', p_membership_id);
  RETURN v_media_id;
END;
$$;

-- Only CLEAN objects may be selected through the application-facing view.
CREATE VIEW workshopos.available_secure_media WITH (security_barrier = true, security_invoker = true) AS
SELECT tenant_id, branch_id, media_id, object_key, file_name, mime_type, byte_length, checksum_sha256, created_at
FROM workshopos.secure_media_object
WHERE scan_status = 'CLEAN';
