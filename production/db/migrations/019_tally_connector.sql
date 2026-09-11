BEGIN;

-- S19 persists an inert integration boundary. Tally remains the sole invoice authority for these rows.
CREATE TABLE workshopos.tally_exchange (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, payer_id uuid NOT NULL,
  billing_snapshot_id uuid NOT NULL, invoice_authority text NOT NULL CHECK (invoice_authority = 'TALLY_AUTHORITATIVE'),
  release_generation text NOT NULL CHECK (release_generation IN ('CURRENT','PRIOR_1','PRIOR_2')),
  release_id text NOT NULL CHECK (btrim(release_id) <> ''), transport text NOT NULL CHECK (transport IN ('DIRECT','CONTROLLED_FILE')),
  tally_company_id text NOT NULL CHECK (btrim(tally_company_id) <> ''), currency char(3) NOT NULL CHECK (currency = 'INR'),
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0), taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0),
  cgst_minor bigint NOT NULL CHECK (cgst_minor >= 0), sgst_minor bigint NOT NULL CHECK (sgst_minor >= 0),
  igst_minor bigint NOT NULL CHECK (igst_minor >= 0), status text NOT NULL CHECK (status IN ('PENDING_ACK','RECONCILED','MISMATCH')),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  created_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, job_id, payer_id),
  CHECK (amount_minor = taxable_minor + cgst_minor + sgst_minor + igst_minor)
);

CREATE TABLE workshopos.tally_acknowledgement (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, exchange_id uuid NOT NULL,
  release_id text NOT NULL, tally_company_id text NOT NULL, tally_voucher_id text NOT NULL,
  posting_status text NOT NULL CHECK (posting_status IN ('POSTED','REJECTED','PENDING')),
  error_code text, error_message text, payer_id uuid NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0), taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0),
  cgst_minor bigint NOT NULL CHECK (cgst_minor >= 0), sgst_minor bigint NOT NULL CHECK (sgst_minor >= 0),
  igst_minor bigint NOT NULL CHECK (igst_minor >= 0), raw_evidence jsonb NOT NULL CHECK (jsonb_typeof(raw_evidence) = 'object'),
  acknowledged_at timestamptz NOT NULL, imported_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, exchange_id),
  UNIQUE (tenant_id, tally_company_id, tally_voucher_id),
  FOREIGN KEY (tenant_id, branch_id, exchange_id) REFERENCES workshopos.tally_exchange(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.tally_reconciliation (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, exchange_id uuid NOT NULL, acknowledgement_id uuid NOT NULL,
  reconciliation_status text NOT NULL CHECK (reconciliation_status IN ('MATCHED','UNRESOLVED')),
  invoice_authority text NOT NULL CHECK (invoice_authority = 'TALLY_AUTHORITATIVE'),
  mismatches jsonb NOT NULL CHECK (jsonb_typeof(mismatches) = 'array'), reconciled_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, exchange_id),
  FOREIGN KEY (tenant_id, branch_id, exchange_id) REFERENCES workshopos.tally_exchange(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, acknowledgement_id) REFERENCES workshopos.tally_acknowledgement(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.tally_file_artifact (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, exchange_id uuid NOT NULL,
  direction text NOT NULL CHECK (direction IN ('EXPORT','IMPORT')), release_generation text NOT NULL CHECK (release_generation IN ('CURRENT','PRIOR_1','PRIOR_2')),
  release_id text NOT NULL, schema_version text NOT NULL, record_count integer NOT NULL CHECK (record_count > 0),
  content_sha256 char(64) NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'), manifest jsonb NOT NULL CHECK (jsonb_typeof(manifest) = 'object'),
  private_object_ref text CHECK (private_object_ref IS NULL OR private_object_ref LIKE 'private/%/finance/tally/%'),
  validation_status text NOT NULL CHECK (validation_status IN ('VALID','REJECTED')), validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, direction, content_sha256),
  FOREIGN KEY (tenant_id, branch_id, exchange_id) REFERENCES workshopos.tally_exchange(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.tally_delivery (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, exchange_id uuid NOT NULL,
  effect_key text NOT NULL CHECK (btrim(effect_key) <> ''), status text NOT NULL CHECK (status IN ('PENDING','CLAIMED','RETRY_WAIT','DELIVERED','DEAD_LETTER')),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0), max_attempts integer NOT NULL CHECK (max_attempts > 0),
  available_at timestamptz NOT NULL, claimed_at timestamptz, delivered_at timestamptz, last_error text,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), created_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, effect_key),
  FOREIGN KEY (tenant_id, branch_id, exchange_id) REFERENCES workshopos.tally_exchange(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.tally_replay_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, delivery_id uuid NOT NULL,
  effect_key text NOT NULL, reason text NOT NULL CHECK (btrim(reason) <> ''), prior_attempt_count integer NOT NULL CHECK (prior_attempt_count > 0),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), replayed_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, delivery_id, prior_attempt_count),
  FOREIGN KEY (tenant_id, branch_id, delivery_id) REFERENCES workshopos.tally_delivery(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.tally_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299), response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

-- The command transaction locks the exchange before accepting one provider/file acknowledgement.
CREATE FUNCTION workshopos.lock_tally_exchange(p_tenant_id uuid, p_branch_id uuid, p_exchange_id uuid)
RETURNS workshopos.tally_exchange LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_exchange workshopos.tally_exchange;
BEGIN
  SELECT * INTO v_exchange FROM workshopos.tally_exchange
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = p_exchange_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Tally exchange not found'; END IF;
  RETURN v_exchange;
END $$;

-- Workers claim only due effects and retain the stable effect key over bounded retries and explicit replay.
CREATE FUNCTION workshopos.claim_tally_delivery(p_tenant_id uuid, p_branch_ids uuid[], p_now timestamptz)
RETURNS SETOF workshopos.tally_delivery LANGUAGE plpgsql VOLATILE AS $$
BEGIN
  RETURN QUERY
  UPDATE workshopos.tally_delivery d SET status = 'CLAIMED', claimed_at = p_now, resource_version = resource_version + 1
   WHERE (d.tenant_id, d.branch_id, d.id) IN (
     SELECT tenant_id, branch_id, id FROM workshopos.tally_delivery
      WHERE tenant_id = p_tenant_id AND branch_id = ANY(p_branch_ids) AND status IN ('PENDING','RETRY_WAIT') AND available_at <= p_now
      ORDER BY available_at, created_at FOR UPDATE SKIP LOCKED LIMIT 25
   ) RETURNING d.*;
END $$;

CREATE FUNCTION workshopos.reject_tally_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; append reconciliation or replay evidence', TG_TABLE_NAME; END $$;
CREATE TRIGGER tally_acknowledgement_append_only BEFORE UPDATE OR DELETE ON workshopos.tally_acknowledgement FOR EACH ROW EXECUTE FUNCTION workshopos.reject_tally_append_only_mutation();
CREATE TRIGGER tally_reconciliation_append_only BEFORE UPDATE OR DELETE ON workshopos.tally_reconciliation FOR EACH ROW EXECUTE FUNCTION workshopos.reject_tally_append_only_mutation();
CREATE TRIGGER tally_file_artifact_append_only BEFORE UPDATE OR DELETE ON workshopos.tally_file_artifact FOR EACH ROW EXECUTE FUNCTION workshopos.reject_tally_append_only_mutation();
CREATE TRIGGER tally_replay_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.tally_replay_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_tally_append_only_mutation();
CREATE TRIGGER tally_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.tally_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_tally_append_only_mutation();

CREATE FUNCTION workshopos.guard_tally_exchange_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR NEW.tenant_id <> OLD.tenant_id OR NEW.branch_id <> OLD.branch_id OR NEW.job_id <> OLD.job_id
    OR NEW.payer_id <> OLD.payer_id OR NEW.billing_snapshot_id <> OLD.billing_snapshot_id OR NEW.invoice_authority <> OLD.invoice_authority
    OR NEW.release_id <> OLD.release_id OR NEW.transport <> OLD.transport OR NEW.tally_company_id <> OLD.tally_company_id
    OR NEW.amount_minor <> OLD.amount_minor OR NEW.taxable_minor <> OLD.taxable_minor OR NEW.cgst_minor <> OLD.cgst_minor
    OR NEW.sgst_minor <> OLD.sgst_minor OR NEW.igst_minor <> OLD.igst_minor
  THEN RAISE EXCEPTION 'Tally exchange authority and billing snapshot are immutable'; END IF;
  IF NEW.resource_version <> OLD.resource_version + 1 THEN RAISE EXCEPTION 'Tally exchange version must advance exactly once'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER tally_exchange_controlled_mutation BEFORE UPDATE OR DELETE ON workshopos.tally_exchange FOR EACH ROW EXECUTE FUNCTION workshopos.guard_tally_exchange_mutation();

CREATE FUNCTION workshopos.guard_tally_delivery_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' OR NEW.effect_key <> OLD.effect_key OR NEW.exchange_id <> OLD.exchange_id THEN
    RAISE EXCEPTION 'Tally delivery identity is immutable';
  END IF;
  IF NEW.resource_version <> OLD.resource_version + 1 THEN RAISE EXCEPTION 'Tally delivery version must advance exactly once'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER tally_delivery_controlled_mutation BEFORE UPDATE OR DELETE ON workshopos.tally_delivery FOR EACH ROW EXECUTE FUNCTION workshopos.guard_tally_delivery_mutation();

ALTER TABLE workshopos.tally_exchange ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_exchange FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tally_acknowledgement ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_acknowledgement FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tally_reconciliation ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_reconciliation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tally_file_artifact ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_file_artifact FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tally_delivery ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_delivery FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tally_replay_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_replay_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.tally_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.tally_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY tally_exchange_isolation ON workshopos.tally_exchange USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY tally_acknowledgement_isolation ON workshopos.tally_acknowledgement USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY tally_reconciliation_isolation ON workshopos.tally_reconciliation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY tally_file_artifact_isolation ON workshopos.tally_file_artifact USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY tally_delivery_isolation ON workshopos.tally_delivery USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY tally_replay_evidence_isolation ON workshopos.tally_replay_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY tally_command_receipt_isolation ON workshopos.tally_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
