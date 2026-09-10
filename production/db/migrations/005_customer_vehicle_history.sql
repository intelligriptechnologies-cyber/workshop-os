BEGIN;

CREATE TABLE workshopos.customer (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  display_name text NOT NULL CHECK (btrim(display_name) <> ''),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'MERGED')),
  canonical_customer_id uuid,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  FOREIGN KEY (tenant_id, branch_id, canonical_customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  CHECK ((status = 'ACTIVE' AND canonical_customer_id IS NULL) OR (status = 'MERGED' AND canonical_customer_id IS NOT NULL AND canonical_customer_id <> id))
);

CREATE TABLE workshopos.customer_contact (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  contact_name text NOT NULL CHECK (btrim(contact_name) <> ''),
  contact_type text NOT NULL CHECK (contact_type IN ('MOBILE', 'PHONE', 'EMAIL', 'WHATSAPP', 'ADDRESS')),
  contact_value text NOT NULL CHECK (btrim(contact_value) <> ''),
  normalized_value text NOT NULL CHECK (btrim(normalized_value) <> ''),
  consent_status text NOT NULL CHECK (consent_status IN ('OPTED_IN', 'OPTED_OUT', 'UNKNOWN')),
  preferred boolean NOT NULL DEFAULT false,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id)
);

CREATE UNIQUE INDEX customer_contact_exact_identity
  ON workshopos.customer_contact (tenant_id, branch_id, contact_type, normalized_value, customer_id);

CREATE TABLE workshopos.customer_payer_relation (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  payer_customer_id uuid NOT NULL,
  relationship text NOT NULL CHECK (btrim(relationship) <> ''),
  effective_from date NOT NULL,
  effective_to date,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, payer_customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE workshopos.vehicle (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  registration text,
  normalized_registration text,
  vin char(17),
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attributes) = 'object'),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'MERGED')),
  canonical_vehicle_id uuid,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  FOREIGN KEY (tenant_id, branch_id, canonical_vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id),
  CHECK (normalized_registration IS NOT NULL OR vin IS NOT NULL),
  CHECK (vin IS NULL OR vin ~ '^[A-HJ-NPR-Z0-9]{17}$'),
  CHECK ((status = 'ACTIVE' AND canonical_vehicle_id IS NULL) OR (status = 'MERGED' AND canonical_vehicle_id IS NOT NULL AND canonical_vehicle_id <> id))
);

CREATE UNIQUE INDEX vehicle_registration_identity
  ON workshopos.vehicle (tenant_id, branch_id, normalized_registration) WHERE normalized_registration IS NOT NULL AND status = 'ACTIVE';
CREATE UNIQUE INDEX vehicle_vin_identity
  ON workshopos.vehicle (tenant_id, branch_id, vin) WHERE vin IS NOT NULL AND status = 'ACTIVE';

CREATE TABLE workshopos.vehicle_ownership_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  effective_from date NOT NULL,
  supersedes_id uuid,
  reason text NOT NULL,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  audit_reference text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, supersedes_id) REFERENCES workshopos.vehicle_ownership_history(tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, vehicle_id, effective_from)
);

-- Period ends are projected from the next append-only assignment; prior events are never updated.
CREATE VIEW workshopos.vehicle_ownership_period WITH (security_barrier = true, security_invoker = true) AS
SELECT tenant_id, branch_id, vehicle_id, customer_id, effective_from,
       lead(effective_from) OVER (PARTITION BY tenant_id, branch_id, vehicle_id ORDER BY effective_from) AS effective_to,
       audit_reference, recorded_at
FROM workshopos.vehicle_ownership_history;

CREATE TABLE workshopos.vehicle_odometer_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  reading_km bigint NOT NULL CHECK (reading_km >= 0),
  reading_at timestamptz NOT NULL,
  source text NOT NULL,
  correction_of_id uuid,
  reason text,
  audit_reference text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, correction_of_id) REFERENCES workshopos.vehicle_odometer_history(tenant_id, branch_id, id),
  CHECK (correction_of_id IS NULL OR reason IS NOT NULL)
);

CREATE TABLE workshopos.vehicle_service_history (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  job_id uuid NOT NULL,
  serviced_at timestamptz NOT NULL,
  odometer_km bigint NOT NULL CHECK (odometer_km >= 0),
  summary text NOT NULL,
  historical_owner_customer_id uuid NOT NULL,
  historical_payer_customer_id uuid NOT NULL,
  audit_reference text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, job_id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES workshopos.vehicle(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, historical_owner_customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, historical_payer_customer_id) REFERENCES workshopos.customer(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.identity_merge (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('CUSTOMER', 'VEHICLE')),
  canonical_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('APPLIED', 'COMPENSATED')),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'array' AND jsonb_array_length(evidence) > 0),
  actor_membership_id uuid NOT NULL,
  audit_reference text NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.identity_merge_member (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  merge_id uuid NOT NULL,
  source_id uuid NOT NULL,
  source_version bigint NOT NULL CHECK (source_version > 0),
  source_snapshot jsonb NOT NULL CHECK (jsonb_typeof(source_snapshot) = 'object'),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, merge_id, source_id),
  FOREIGN KEY (tenant_id, branch_id, merge_id) REFERENCES workshopos.identity_merge(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.identity_alias (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('CUSTOMER', 'VEHICLE')),
  alias_id uuid NOT NULL,
  canonical_id uuid NOT NULL,
  merge_id uuid NOT NULL,
  operation text NOT NULL CHECK (operation IN ('APPLY', 'COMPENSATE')),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, merge_id) REFERENCES workshopos.identity_merge(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.identity_merge_compensation (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  merge_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'array' AND jsonb_array_length(evidence) > 0),
  actor_membership_id uuid NOT NULL,
  authentication_context jsonb NOT NULL CHECK (jsonb_typeof(authentication_context) = 'object'),
  audit_reference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, merge_id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id, merge_id) REFERENCES workshopos.identity_merge(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.customer_vehicle_audit (
  id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  actor_identity_id text NOT NULL,
  membership_id uuid NOT NULL,
  action text NOT NULL,
  resource_ids uuid[] NOT NULL,
  reason text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evidence) = 'array'),
  old_state jsonb,
  new_state jsonb,
  audit_reference text NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.customer_vehicle_idempotency (
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  command_fingerprint text NOT NULL,
  response_status integer NOT NULL,
  response_body jsonb NOT NULL,
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE FUNCTION workshopos.reject_customer_vehicle_history_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'customer and vehicle history is append-only' USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER vehicle_ownership_history_append_only BEFORE UPDATE OR DELETE ON workshopos.vehicle_ownership_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();
CREATE TRIGGER vehicle_odometer_history_append_only BEFORE UPDATE OR DELETE ON workshopos.vehicle_odometer_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();
CREATE TRIGGER vehicle_service_history_append_only BEFORE UPDATE OR DELETE ON workshopos.vehicle_service_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();
CREATE TRIGGER identity_alias_append_only BEFORE UPDATE OR DELETE ON workshopos.identity_alias FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();
CREATE TRIGGER identity_merge_member_append_only BEFORE UPDATE OR DELETE ON workshopos.identity_merge_member FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();
CREATE TRIGGER identity_merge_compensation_append_only BEFORE UPDATE OR DELETE ON workshopos.identity_merge_compensation FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();
CREATE TRIGGER customer_vehicle_audit_append_only BEFORE UPDATE OR DELETE ON workshopos.customer_vehicle_audit FOR EACH ROW EXECUTE FUNCTION workshopos.reject_customer_vehicle_history_mutation();

ALTER TABLE workshopos.customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_contact FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_payer_relation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_payer_relation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle_ownership_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle_ownership_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle_odometer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle_odometer_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle_service_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.vehicle_service_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_alias ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_alias FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_merge ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_merge FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_merge_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_merge_member FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_merge_compensation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.identity_merge_compensation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_vehicle_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_vehicle_audit FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_vehicle_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.customer_vehicle_idempotency FORCE ROW LEVEL SECURITY;

CREATE POLICY customer_tenant_isolation ON workshopos.customer USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY customer_contact_tenant_isolation ON workshopos.customer_contact USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY customer_payer_relation_tenant_isolation ON workshopos.customer_payer_relation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY vehicle_tenant_isolation ON workshopos.vehicle USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY vehicle_ownership_history_tenant_isolation ON workshopos.vehicle_ownership_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY vehicle_odometer_history_tenant_isolation ON workshopos.vehicle_odometer_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY vehicle_service_history_tenant_isolation ON workshopos.vehicle_service_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY identity_alias_tenant_isolation ON workshopos.identity_alias USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY identity_merge_tenant_isolation ON workshopos.identity_merge USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY identity_merge_member_tenant_isolation ON workshopos.identity_merge_member USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY identity_merge_compensation_tenant_isolation ON workshopos.identity_merge_compensation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY customer_vehicle_audit_tenant_isolation ON workshopos.customer_vehicle_audit USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY customer_vehicle_idempotency_tenant_isolation ON workshopos.customer_vehicle_idempotency USING (tenant_id = workshopos.current_tenant_id()) WITH CHECK (tenant_id = workshopos.current_tenant_id());

COMMIT;
