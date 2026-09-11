BEGIN;

-- S15 owns Job/task demand and outcome evidence. S13 remains the only physical-stock ledger boundary.
CREATE TABLE workshopos.job_material_request (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''), status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, job_id) REFERENCES workshopos.reception_job_card(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, task_id) REFERENCES workshopos.work_task(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_material_request_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, request_id uuid NOT NULL, id uuid NOT NULL,
  item_id uuid NOT NULL, requested_quantity numeric(24, 6) NOT NULL CHECK (requested_quantity > 0),
  issued_quantity numeric(24, 6) NOT NULL DEFAULT 0 CHECK (issued_quantity >= 0 AND issued_quantity <= requested_quantity),
  uom text NOT NULL CHECK (btrim(uom) <> ''), recipe_version bigint NOT NULL CHECK (recipe_version > 0),
  approved_scope_line_id uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, request_id, id),
  FOREIGN KEY (tenant_id, branch_id, request_id) REFERENCES workshopos.job_material_request(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_material_substitution (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, request_id uuid NOT NULL, request_line_id uuid NOT NULL,
  original_item_id uuid NOT NULL, substitute_item_id uuid NOT NULL, quantity numeric(24, 6) NOT NULL CHECK (quantity > 0),
  issued_quantity numeric(24, 6) NOT NULL DEFAULT 0 CHECK (issued_quantity >= 0 AND issued_quantity <= quantity), uom text NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''), status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, request_id, request_line_id) REFERENCES workshopos.job_material_request_line(tenant_id, branch_id, request_id, id),
  FOREIGN KEY (tenant_id, branch_id, original_item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, substitute_item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK (original_item_id <> substitute_item_id)
);

CREATE TABLE workshopos.job_material_issue (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, request_id uuid NOT NULL, request_line_id uuid NOT NULL,
  substitution_id uuid, job_id uuid NOT NULL, task_id uuid NOT NULL, item_id uuid NOT NULL,
  quantity numeric(24, 6) NOT NULL CHECK (quantity > 0), quantity_base numeric(38, 6) NOT NULL CHECK (quantity_base > 0), uom text NOT NULL,
  warehouse_id uuid NOT NULL, bin_id uuid, lot_id uuid, remnant_id uuid, inventory_posting_batch_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''), actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, inventory_posting_batch_id),
  FOREIGN KEY (tenant_id, branch_id, request_id, request_line_id) REFERENCES workshopos.job_material_request_line(tenant_id, branch_id, request_id, id),
  FOREIGN KEY (tenant_id, branch_id, substitution_id) REFERENCES workshopos.job_material_substitution(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id, lot_id) REFERENCES workshopos.inventory_lot(tenant_id, branch_id, item_id, id)
);

CREATE TABLE workshopos.job_material_outcome (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, issue_id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL,
  item_id uuid NOT NULL, outcome_type text NOT NULL CHECK (outcome_type IN ('CONSUMED','WASTAGE','RETURN')),
  quantity numeric(24, 6) NOT NULL CHECK (quantity > 0), uom text NOT NULL, lot_id uuid, remnant_id uuid,
  reason text NOT NULL CHECK (btrim(reason) <> ''), status text NOT NULL CHECK (status IN ('POSTED','APPROVAL_PENDING','RETURN_PENDING','REJECTED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, issue_id) REFERENCES workshopos.job_material_issue(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_material_return_verification (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, outcome_id uuid NOT NULL,
  verifier_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  inventory_posting_batch_id uuid NOT NULL, reason text NOT NULL CHECK (btrim(reason) <> ''), audit_reference uuid NOT NULL,
  verified_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, outcome_id), UNIQUE (tenant_id, inventory_posting_batch_id),
  FOREIGN KEY (tenant_id, branch_id, outcome_id) REFERENCES workshopos.job_material_outcome(tenant_id, branch_id, id),
  CHECK (maker_membership_id <> verifier_membership_id)
);

CREATE TABLE workshopos.job_material_variance (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL, item_id uuid NOT NULL,
  quantity numeric(24, 6) NOT NULL CHECK (quantity > 0), uom text NOT NULL, reason text NOT NULL CHECK (btrim(reason) <> ''),
  status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, task_id) REFERENCES workshopos.work_task(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.authorized_stock_reason (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, item_id uuid NOT NULL,
  quantity numeric(24, 6) NOT NULL CHECK (quantity > 0), uom text NOT NULL, warehouse_id uuid NOT NULL, bin_id uuid, lot_id uuid, remnant_id uuid,
  reason text NOT NULL CHECK (btrim(reason) <> ''), status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED','REJECTED','ISSUED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), inventory_posting_batch_id uuid,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_material_approval (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('EXCESS_REQUEST','SUBSTITUTION','WASTAGE','VARIANCE','AUTHORIZED_STOCK_REASON')),
  entity_id uuid NOT NULL, maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  checker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), decision text NOT NULL CHECK (decision IN ('APPROVE','REJECT')),
  reason text NOT NULL CHECK (btrim(reason) <> ''), reauthenticated_at timestamptz NOT NULL, decided_at timestamptz NOT NULL,
  audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, entity_type, entity_id),
  CHECK (maker_membership_id <> checker_membership_id), CHECK (reauthenticated_at <= decided_at)
);

CREATE TABLE workshopos.job_material_reconciliation (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, job_id uuid NOT NULL, task_id uuid NOT NULL, item_id uuid NOT NULL,
  uom text NOT NULL, issued_quantity numeric(24, 6) NOT NULL CHECK (issued_quantity >= 0),
  consumed_quantity numeric(24, 6) NOT NULL CHECK (consumed_quantity >= 0),
  verified_return_quantity numeric(24, 6) NOT NULL CHECK (verified_return_quantity >= 0),
  wastage_quantity numeric(24, 6) NOT NULL CHECK (wastage_quantity >= 0),
  approved_variance_quantity numeric(24, 6) NOT NULL CHECK (approved_variance_quantity >= 0),
  reason text NOT NULL CHECK (btrim(reason) <> ''), actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  audit_reference uuid NOT NULL, reconciled_at timestamptz NOT NULL, PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, task_id, item_id, uom),
  CHECK (issued_quantity = consumed_quantity + verified_return_quantity + wastage_quantity + approved_variance_quantity),
  FOREIGN KEY (tenant_id, branch_id, task_id) REFERENCES workshopos.work_task(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_material_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, entity_type text NOT NULL, entity_id uuid NOT NULL,
  evidence_kind text NOT NULL, private_object_ref text NOT NULL CHECK (private_object_ref LIKE '%/private/material/%'),
  checksum_sha256 char(64) NOT NULL CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$'), scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), captured_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id)
);

CREATE TABLE workshopos.job_material_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('MATERIAL_REQUESTED','MATERIAL_ISSUED','RETURN_VERIFIED','MATERIAL_RECONCILED')),
  source_id uuid NOT NULL, aggregate_id uuid NOT NULL, aggregate_version bigint NOT NULL CHECK (aggregate_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'), audit_reference uuid NOT NULL, occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, event_type, source_id)
);

CREATE TABLE workshopos.job_material_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  payload_fingerprint char(64) NOT NULL CHECK (payload_fingerprint ~ '^[0-9a-f]{64}$'), response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'), audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

-- Authoritative commands lock the demand or reason before delegating to S13's exact balance reservation.
CREATE FUNCTION workshopos.post_inventory_withdrawal(
  p_tenant_id uuid, p_branch_id uuid, p_warehouse_id uuid, p_bin_id uuid, p_item_id uuid,
  p_lot_id uuid, p_remnant_id uuid, p_quantity_base numeric(38, 6)
) RETURNS workshopos.inventory_balance LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_balance workshopos.inventory_balance;
BEGIN
  PERFORM 1 FROM workshopos.inventory_item WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = p_item_id FOR UPDATE;
  v_balance := workshopos.reserve_inventory_balance(p_tenant_id, p_branch_id, p_warehouse_id, p_bin_id, p_item_id, p_lot_id, p_remnant_id, p_quantity_base);
  RETURN v_balance;
END $$;

CREATE FUNCTION workshopos.post_job_material_return(
  p_tenant_id uuid, p_branch_id uuid, p_warehouse_id uuid, p_bin_id uuid, p_item_id uuid,
  p_lot_id uuid, p_remnant_id uuid, p_quantity_base numeric(38, 6), p_value_minor bigint
) RETURNS workshopos.inventory_balance LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_balance workshopos.inventory_balance;
BEGIN
  SELECT * INTO v_balance FROM workshopos.inventory_balance
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND warehouse_id = p_warehouse_id
     AND bin_id IS NOT DISTINCT FROM p_bin_id AND item_id = p_item_id
     AND lot_id IS NOT DISTINCT FROM p_lot_id AND remnant_id IS NOT DISTINCT FROM p_remnant_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'return must restore its exact issued location and lot'; END IF;
  UPDATE workshopos.inventory_balance SET quantity_base = quantity_base + p_quantity_base,
    value_minor = value_minor + p_value_minor, resource_version = resource_version + 1
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND id = v_balance.id RETURNING * INTO v_balance;
  RETURN v_balance;
END $$;

CREATE FUNCTION workshopos.reject_job_material_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; post a compensating event', TG_TABLE_NAME; END $$;

CREATE TRIGGER job_material_issue_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_issue FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_outcome_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_outcome FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_return_verification_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_return_verification FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_approval_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_approval FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_reconciliation_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_reconciliation FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_event_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();
CREATE TRIGGER job_material_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.job_material_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_job_material_mutation();

ALTER TABLE workshopos.job_material_request ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_request FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_request_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_request_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_issue ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_issue FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_outcome ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_outcome FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_return_verification ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_return_verification FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_substitution ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_substitution FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_variance ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_variance FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.authorized_stock_reason ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.authorized_stock_reason FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_approval ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_approval FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_reconciliation ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_reconciliation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.job_material_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.job_material_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY job_material_request_isolation ON workshopos.job_material_request USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_request_line_isolation ON workshopos.job_material_request_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_issue_isolation ON workshopos.job_material_issue USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids()));
CREATE POLICY job_material_outcome_isolation ON workshopos.job_material_outcome USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_return_verification_isolation ON workshopos.job_material_return_verification USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_substitution_isolation ON workshopos.job_material_substitution USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_variance_isolation ON workshopos.job_material_variance USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY authorized_stock_reason_isolation ON workshopos.authorized_stock_reason USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids()));
CREATE POLICY job_material_approval_isolation ON workshopos.job_material_approval USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_reconciliation_isolation ON workshopos.job_material_reconciliation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_evidence_isolation ON workshopos.job_material_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_event_isolation ON workshopos.job_material_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY job_material_command_receipt_isolation ON workshopos.job_material_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
