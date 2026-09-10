BEGIN;

CREATE TABLE workshopos.appointment_capacity_resource (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  resource_kind text NOT NULL CHECK (resource_kind IN ('BAY', 'STAFF')),
  resource_name text NOT NULL CHECK (btrim(resource_name) <> ''),
  skill_codes text[] NOT NULL DEFAULT '{}'::text[],
  capacity_configuration_version_id uuid NOT NULL,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE workshopos.appointment_branch_closure (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  capacity_configuration_version_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  CHECK (ends_at > starts_at)
);

CREATE TABLE workshopos.appointment (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('BOOKED', 'ARRIVED', 'CANCELLED', 'NO_SHOW', 'CONVERTED')),
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  reserved_start timestamptz NOT NULL,
  reserved_end timestamptz NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  buffer_before_minutes integer NOT NULL CHECK (buffer_before_minutes >= 0),
  buffer_after_minutes integer NOT NULL CHECK (buffer_after_minutes >= 0),
  required_skills text[] NOT NULL DEFAULT '{}'::text[],
  required_bay_skills text[] NOT NULL DEFAULT '{}'::text[],
  capacity_configuration_version_id uuid NOT NULL,
  resource_version bigint NOT NULL CHECK (resource_version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id),
  CHECK (scheduled_end > scheduled_start),
  CHECK (reserved_end > reserved_start),
  CHECK (reserved_start <= scheduled_start AND reserved_end >= scheduled_end)
);

-- Each schedule version gets immutable BAY and STAFF reservations. Old versions remain
-- evidence; only reservations matching the appointment's current version consume capacity.
CREATE TABLE workshopos.appointment_resource_reservation (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  appointment_id uuid NOT NULL,
  appointment_version bigint NOT NULL CHECK (appointment_version > 0),
  resource_kind text NOT NULL CHECK (resource_kind IN ('BAY', 'STAFF')),
  resource_id uuid NOT NULL,
  reserved_start timestamptz NOT NULL,
  reserved_end timestamptz NOT NULL,
  overbooked boolean NOT NULL DEFAULT false,
  overbook_reason text,
  overbook_evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(overbook_evidence) = 'array'),
  overbook_authorized_by_membership_id uuid,
  audit_reference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, appointment_id, appointment_version, resource_kind),
  FOREIGN KEY (tenant_id, branch_id, appointment_id) REFERENCES workshopos.appointment(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, resource_id) REFERENCES workshopos.appointment_capacity_resource(tenant_id, branch_id, id),
  CHECK (reserved_end > reserved_start),
  CHECK (
    (NOT overbooked AND overbook_reason IS NULL AND overbook_authorized_by_membership_id IS NULL AND overbook_evidence = '[]'::jsonb)
    OR
    (overbooked AND btrim(overbook_reason) <> '' AND overbook_authorized_by_membership_id IS NOT NULL AND jsonb_array_length(overbook_evidence) > 0)
  )
);

CREATE TABLE workshopos.appointment_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  appointment_id uuid NOT NULL,
  sequence bigint NOT NULL CHECK (sequence > 0),
  appointment_version bigint NOT NULL CHECK (appointment_version > 0),
  action text NOT NULL CHECK (action IN ('CREATED', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW', 'ARRIVED', 'CONVERTED')),
  from_status text,
  to_status text NOT NULL,
  old_schedule jsonb,
  new_schedule jsonb,
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, appointment_id, sequence),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, appointment_id) REFERENCES workshopos.appointment(tenant_id, branch_id, id)
);

-- S07 owns consumption. S06 only commits this durable, idempotent handoff event.
CREATE TABLE workshopos.appointment_reception_outbox (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  appointment_id uuid NOT NULL,
  appointment_version bigint NOT NULL CHECK (appointment_version > 0),
  event_type text NOT NULL CHECK (event_type = 'RECEPTION_CHECK_IN_REQUESTED'),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, appointment_id, appointment_version),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, appointment_id) REFERENCES workshopos.appointment(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.appointment_audit (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  appointment_id uuid NOT NULL,
  resource_version bigint NOT NULL CHECK (resource_version > 0),
  action text NOT NULL,
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  request_id text,
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, appointment_id) REFERENCES workshopos.appointment(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.appointment_idempotency (
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  command_fingerprint text NOT NULL CHECK (btrim(command_fingerprint) <> ''),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE OR REPLACE FUNCTION workshopos.enforce_appointment_reservation_capacity() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  -- A transaction-level lock serializes the read/check/insert for one physical resource.
  PERFORM pg_advisory_xact_lock(hashtextextended(
    NEW.tenant_id::text || ':' || NEW.branch_id::text || ':' || NEW.resource_kind || ':' || NEW.resource_id::text, 0
  ));

  IF NEW.overbooked THEN
    IF NEW.overbook_authorized_by_membership_id IS NULL OR NEW.overbook_reason IS NULL OR btrim(NEW.overbook_reason) = '' OR jsonb_array_length(NEW.overbook_evidence) = 0 THEN
      RAISE EXCEPTION 'OVERBOOK_AUTHORIZATION_REQUIRED' USING ERRCODE = 'integrity_constraint_violation';
    END IF;
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM workshopos.appointment_resource_reservation existing
    JOIN workshopos.appointment booked
      ON booked.tenant_id = existing.tenant_id
     AND booked.branch_id = existing.branch_id
     AND booked.id = existing.appointment_id
     AND booked.resource_version = existing.appointment_version
    WHERE existing.tenant_id = NEW.tenant_id
      AND existing.branch_id = NEW.branch_id
      AND existing.resource_kind = NEW.resource_kind
      AND existing.resource_id = NEW.resource_id
      AND existing.appointment_id <> NEW.appointment_id
      AND booked.status IN ('BOOKED', 'ARRIVED')
      AND tstzrange(existing.reserved_start, existing.reserved_end, '[)') && tstzrange(NEW.reserved_start, NEW.reserved_end, '[)')
  ) THEN
    RAISE EXCEPTION 'APPOINTMENT_RESOURCE_CAPACITY_CONFLICT' USING ERRCODE = 'exclusion_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER appointment_reservation_capacity_guard
BEFORE INSERT ON workshopos.appointment_resource_reservation
FOR EACH ROW EXECUTE FUNCTION workshopos.enforce_appointment_reservation_capacity();

CREATE OR REPLACE FUNCTION workshopos.reject_appointment_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'appointment history, reservation, reception event, and audit ledgers are append-only'
    USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER appointment_reservation_append_only BEFORE UPDATE OR DELETE ON workshopos.appointment_resource_reservation
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_appointment_ledger_mutation();
CREATE TRIGGER appointment_history_append_only BEFORE UPDATE OR DELETE ON workshopos.appointment_history
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_appointment_ledger_mutation();
CREATE TRIGGER appointment_reception_outbox_append_only BEFORE UPDATE OR DELETE ON workshopos.appointment_reception_outbox
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_appointment_ledger_mutation();
CREATE TRIGGER appointment_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.appointment_audit
FOR EACH ROW EXECUTE FUNCTION workshopos.reject_appointment_ledger_mutation();

ALTER TABLE workshopos.appointment_capacity_resource ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_capacity_resource FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_branch_closure ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_branch_closure FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_resource_reservation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_resource_reservation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_reception_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_reception_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.appointment_idempotency FORCE ROW LEVEL SECURITY;

CREATE POLICY appointment_capacity_resource_tenant_isolation ON workshopos.appointment_capacity_resource
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_branch_closure_tenant_isolation ON workshopos.appointment_branch_closure
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_tenant_isolation ON workshopos.appointment
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_resource_reservation_tenant_isolation ON workshopos.appointment_resource_reservation
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_history_tenant_isolation ON workshopos.appointment_history
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_reception_outbox_tenant_isolation ON workshopos.appointment_reception_outbox
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_audit_tenant_isolation ON workshopos.appointment_audit
  USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))
  WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY appointment_idempotency_tenant_isolation ON workshopos.appointment_idempotency
  USING (tenant_id = workshopos.current_tenant_id())
  WITH CHECK (tenant_id = workshopos.current_tenant_id());

COMMIT;
