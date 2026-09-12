-- S26 operational assurance persistence. This contract does not claim that an AWS
-- load, restore, availability, or regional DR exercise has run.
CREATE TABLE workshopos.async_delivery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  effect_kind text NOT NULL CHECK (effect_kind IN ('NOTIFICATION','DOCUMENT','REPORT','TALLY','CASHFREE')),
  effect_key text NOT NULL, correlation_id uuid NOT NULL,
  payload jsonb NOT NULL, status text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0, next_attempt_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(), completed_at timestamptz,
  UNIQUE (tenant_id, effect_kind, effect_key)
);
CREATE TABLE workshopos.async_delivery_attempt (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  delivery_id uuid NOT NULL REFERENCES workshopos.async_delivery(id), correlation_id uuid NOT NULL,
  outcome text NOT NULL, safe_error_code text, occurred_at timestamptz NOT NULL
);
CREATE TABLE workshopos.async_dead_letter_replay (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  delivery_id uuid NOT NULL REFERENCES workshopos.async_delivery(id), correlation_id uuid NOT NULL,
  reason text NOT NULL, authorized_membership_id uuid NOT NULL, occurred_at timestamptz NOT NULL
);
CREATE TABLE workshopos.operational_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  correlation_id uuid NOT NULL, event_name text NOT NULL, resource_type text NOT NULL,
  resource_id_digest text NOT NULL, safe_dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL
);
CREATE TABLE workshopos.recovery_rehearsal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  evidence_class text NOT NULL, snapshot_checksum text NOT NULL, failure_at timestamptz NOT NULL,
  recovered_through timestamptz NOT NULL, completed_at timestamptz NOT NULL,
  rpo_seconds integer NOT NULL, rto_seconds integer NOT NULL, passed boolean NOT NULL,
  external_exercise_required boolean NOT NULL DEFAULT true
);
CREATE TABLE workshopos.slo_evaluation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  window_start timestamptz NOT NULL, window_end timestamptz NOT NULL,
  availability_basis_points integer NOT NULL, routine_p95_ms integer, authoritative_p95_ms integer,
  evidence_class text NOT NULL, passed boolean NOT NULL
);
CREATE TABLE workshopos.operational_alert (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, branch_id uuid NOT NULL,
  correlation_id uuid, code text NOT NULL, owner text NOT NULL, runbook text NOT NULL,
  status text NOT NULL, opened_at timestamptz NOT NULL, resolved_at timestamptz
);

CREATE OR REPLACE FUNCTION workshopos.claim_async_deliveries(p_limit integer)
RETURNS SETOF workshopos.async_delivery LANGUAGE sql SECURITY INVOKER AS $$
  SELECT * FROM workshopos.async_delivery
   WHERE status IN ('PENDING','RETRY') AND next_attempt_at <= clock_timestamp()
   ORDER BY next_attempt_at, created_at
   FOR UPDATE SKIP LOCKED LIMIT p_limit
$$;

CREATE OR REPLACE FUNCTION workshopos.prevent_release_assurance_evidence_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
  RAISE EXCEPTION 'release assurance evidence is append-only';
END $$;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['async_delivery_attempt','async_dead_letter_replay','operational_telemetry','recovery_rehearsal','slo_evaluation'] LOOP
    EXECUTE format('CREATE TRIGGER %I_immutable BEFORE UPDATE OR DELETE ON workshopos.%I FOR EACH ROW EXECUTE FUNCTION workshopos.prevent_release_assurance_evidence_mutation()', t, t);
  END LOOP;
END $$;

ALTER TABLE workshopos.async_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.async_delivery FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.async_delivery_attempt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.async_delivery_attempt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.async_dead_letter_replay ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.async_dead_letter_replay FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.operational_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.operational_telemetry FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.recovery_rehearsal ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.recovery_rehearsal FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.slo_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.slo_evaluation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.operational_alert ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.operational_alert FORCE ROW LEVEL SECURITY;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['async_delivery','async_delivery_attempt','async_dead_letter_replay','operational_telemetry','recovery_rehearsal','slo_evaluation','operational_alert'] LOOP
    EXECUTE format('CREATE POLICY %I_scope ON workshopos.%I USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()))', t, t);
  END LOOP;
END $$;
