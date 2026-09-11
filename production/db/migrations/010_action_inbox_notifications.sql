BEGIN;

CREATE TABLE workshopos.notification_domain_event (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id text NOT NULL,
  event_type text NOT NULL CHECK (btrim(event_type) <> ''),
  occurred_at timestamptz NOT NULL,
  payload jsonb NOT NULL,
  payload_fingerprint text NOT NULL CHECK (length(payload_fingerprint) = 64),
  received_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.action_inbox (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id text NOT NULL,
  source_event_id text NOT NULL,
  action_key text NOT NULL,
  role_codes text[] NOT NULL CHECK (cardinality(role_codes) > 0),
  owner_membership_id text,
  priority text NOT NULL CHECK (priority IN ('URGENT', 'HIGH', 'NORMAL', 'LOW')),
  title text NOT NULL CHECK (btrim(title) <> ''),
  blocker text,
  next_action text NOT NULL CHECK (btrim(next_action) <> ''),
  href text NOT NULL CHECK (btrim(href) <> ''),
  due_at timestamptz,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'COMPLETED')),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL,
  completed_at timestamptz,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, source_event_id, action_key),
  FOREIGN KEY (tenant_id, branch_id, source_event_id)
    REFERENCES workshopos.notification_domain_event (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.notification_template (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  template_key text NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  channel text NOT NULL CHECK (channel IN ('IN_APP', 'PUSH', 'WHATSAPP', 'SMS')),
  body text NOT NULL CHECK (btrim(body) <> ''),
  max_attempts integer NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 10),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, template_key, version, channel)
);

CREATE TABLE workshopos.notification_recipient (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id text NOT NULL,
  recipient_kind text NOT NULL CHECK (recipient_kind IN ('STAFF', 'CUSTOMER')),
  membership_id text,
  push_destination_ciphertext text,
  whatsapp_destination_ciphertext text,
  sms_destination_ciphertext text,
  consent jsonb NOT NULL DEFAULT '{}'::jsonb,
  opt_out jsonb NOT NULL DEFAULT '{}'::jsonb,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  CHECK ((recipient_kind = 'STAFF' AND membership_id IS NOT NULL) OR recipient_kind = 'CUSTOMER')
);

CREATE TABLE workshopos.notification_preference_history (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY,
  recipient_id text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('IN_APP', 'PUSH', 'WHATSAPP', 'SMS')),
  action text NOT NULL CHECK (action IN ('CONSENT_GRANTED', 'CONSENT_REVOKED', 'OPT_OUT', 'OPT_IN')),
  source text NOT NULL CHECK (btrim(source) <> ''),
  occurred_at timestamptz NOT NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, recipient_id)
    REFERENCES workshopos.notification_recipient (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.notification_outbox (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id text NOT NULL,
  source_event_id text NOT NULL,
  recipient_id text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('IN_APP', 'PUSH', 'WHATSAPP', 'SMS')),
  template_key text NOT NULL,
  template_version integer NOT NULL,
  rendered_body_ciphertext text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN (
    'PENDING', 'CLAIMED', 'RETRY_SCHEDULED', 'PROVIDER_ACCEPTED', 'DELIVERED',
    'SKIPPED_NO_CONSENT', 'SKIPPED_OPT_OUT', 'SKIPPED_NO_DESTINATION', 'DEAD_LETTER'
  )),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts integer NOT NULL CHECK (max_attempts BETWEEN 1 AND 10),
  next_attempt_at timestamptz NOT NULL,
  claim_token uuid,
  claim_expires_at timestamptz,
  provider_message_id text,
  failure_reason text,
  fallback_of_delivery_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, source_event_id, recipient_id, channel),
  FOREIGN KEY (tenant_id, branch_id, source_event_id)
    REFERENCES workshopos.notification_domain_event (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, recipient_id)
    REFERENCES workshopos.notification_recipient (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, template_key, template_version, channel)
    REFERENCES workshopos.notification_template (tenant_id, branch_id, template_key, version, channel)
);

CREATE INDEX notification_outbox_claimable
  ON workshopos.notification_outbox (tenant_id, status, next_attempt_at)
  WHERE status IN ('PENDING', 'RETRY_SCHEDULED');

CREATE TABLE workshopos.in_app_notification (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id text NOT NULL,
  delivery_id text NOT NULL,
  source_event_id text NOT NULL,
  membership_id text NOT NULL,
  template_key text NOT NULL,
  template_version integer NOT NULL,
  body_ciphertext text NOT NULL,
  created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, delivery_id),
  FOREIGN KEY (tenant_id, branch_id, delivery_id)
    REFERENCES workshopos.notification_outbox (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.notification_delivery_attempt (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY,
  delivery_id text NOT NULL,
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  attempted_at timestamptz NOT NULL,
  provider_result text NOT NULL CHECK (provider_result IN ('ACCEPTED', 'TRANSIENT_FAILURE', 'PERMANENT_FAILURE')),
  provider_message_id text,
  failure_reason text,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, delivery_id, attempt_number),
  FOREIGN KEY (tenant_id, branch_id, delivery_id)
    REFERENCES workshopos.notification_outbox (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.provider_status_event (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  provider_event_id text NOT NULL,
  delivery_id text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('PUSH', 'WHATSAPP', 'SMS')),
  provider_message_id text NOT NULL,
  delivery_status text NOT NULL CHECK (delivery_status IN ('SENT', 'DELIVERED', 'FAILED')),
  failure_reason text,
  payload_fingerprint text NOT NULL CHECK (length(payload_fingerprint) = 64),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, provider_event_id),
  UNIQUE (tenant_id, provider_event_id),
  FOREIGN KEY (tenant_id, branch_id, delivery_id)
    REFERENCES workshopos.notification_outbox (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.notification_dead_letter_replay (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY,
  delivery_id text NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  actor_membership_id text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, delivery_id)
    REFERENCES workshopos.notification_outbox (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.notification_audit (
  tenant_id text NOT NULL,
  branch_id text NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY,
  action text NOT NULL,
  subject_reference text NOT NULL,
  actor_membership_id text,
  reason text,
  occurred_at timestamptz NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (tenant_id, branch_id, id)
);

CREATE FUNCTION workshopos.claim_notification_outbox(
  p_now timestamptz,
  p_claim_token uuid,
  p_limit integer DEFAULT 100
) RETURNS SETOF workshopos.notification_outbox
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT tenant_id, branch_id, id
    FROM workshopos.notification_outbox
    WHERE tenant_id = workshopos.current_tenant_id()
      AND branch_id = ANY (workshopos.authorized_branch_ids())
      AND status IN ('PENDING', 'RETRY_SCHEDULED')
      AND next_attempt_at <= p_now
      AND (claim_expires_at IS NULL OR claim_expires_at <= p_now)
    ORDER BY next_attempt_at, created_at
    FOR UPDATE SKIP LOCKED
    LIMIT p_limit
  )
  UPDATE workshopos.notification_outbox AS outbox
  SET status = 'CLAIMED', claim_token = p_claim_token,
      claim_expires_at = p_now + interval '5 minutes', updated_at = p_now
  FROM candidates
  WHERE outbox.tenant_id = candidates.tenant_id
    AND outbox.branch_id = candidates.branch_id
    AND outbox.id = candidates.id
  RETURNING outbox.*;
END $$;

CREATE FUNCTION workshopos.reject_notification_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'notification evidence is append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER notification_domain_event_append_only BEFORE UPDATE OR DELETE ON workshopos.notification_domain_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER notification_template_append_only BEFORE UPDATE OR DELETE ON workshopos.notification_template FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER notification_preference_history_append_only BEFORE UPDATE OR DELETE ON workshopos.notification_preference_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER in_app_notification_append_only BEFORE UPDATE OR DELETE ON workshopos.in_app_notification FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER notification_delivery_attempt_append_only BEFORE UPDATE OR DELETE ON workshopos.notification_delivery_attempt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER provider_status_event_append_only BEFORE UPDATE OR DELETE ON workshopos.provider_status_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER notification_dead_letter_replay_append_only BEFORE UPDATE OR DELETE ON workshopos.notification_dead_letter_replay FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();
CREATE TRIGGER notification_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.notification_audit FOR EACH ROW EXECUTE FUNCTION workshopos.reject_notification_ledger_mutation();

ALTER TABLE workshopos.notification_domain_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_domain_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.action_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.action_inbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_template FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_recipient ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_recipient FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_preference_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_preference_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.in_app_notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.in_app_notification FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_delivery_attempt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_delivery_attempt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.provider_status_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.provider_status_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_dead_letter_replay ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_dead_letter_replay FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.notification_audit FORCE ROW LEVEL SECURITY;

CREATE POLICY notification_domain_event_tenant_isolation ON workshopos.notification_domain_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY action_inbox_tenant_isolation ON workshopos.action_inbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_template_tenant_isolation ON workshopos.notification_template USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_recipient_tenant_isolation ON workshopos.notification_recipient USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_preference_history_tenant_isolation ON workshopos.notification_preference_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_outbox_tenant_isolation ON workshopos.notification_outbox USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY in_app_notification_tenant_isolation ON workshopos.in_app_notification USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_delivery_attempt_tenant_isolation ON workshopos.notification_delivery_attempt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY provider_status_event_tenant_isolation ON workshopos.provider_status_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_dead_letter_replay_tenant_isolation ON workshopos.notification_dead_letter_replay USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY notification_audit_tenant_isolation ON workshopos.notification_audit USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

COMMIT;
