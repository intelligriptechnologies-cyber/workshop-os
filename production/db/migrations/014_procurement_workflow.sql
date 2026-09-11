BEGIN;

-- S14 procurement owns commercial documents; S13 remains the only stock posting boundary.
CREATE TABLE workshopos.supplier (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id), branch_id uuid NOT NULL, id uuid NOT NULL,
  legal_name text NOT NULL CHECK (btrim(legal_name) <> ''), legal_name_key text NOT NULL CHECK (btrim(legal_name_key) <> ''), trade_name text,
  gstin text, pan text, tax_treatment text NOT NULL CHECK (tax_treatment IN ('REGISTERED','COMPOSITION','UNREGISTERED','OVERSEAS')),
  currency char(3) NOT NULL, payment_terms_days integer NOT NULL CHECK (payment_terms_days BETWEEN 0 AND 3650),
  status text NOT NULL CHECK (status IN ('ACTIVE','ON_HOLD','INACTIVE')), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  created_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, legal_name_key), FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id),
  CHECK ((tax_treatment IN ('REGISTERED','COMPOSITION') AND gstin IS NOT NULL) OR tax_treatment NOT IN ('REGISTERED','COMPOSITION'))
);
CREATE UNIQUE INDEX supplier_gstin_unique ON workshopos.supplier(tenant_id, gstin) WHERE gstin IS NOT NULL;
CREATE UNIQUE INDEX supplier_pan_unique ON workshopos.supplier(tenant_id, pan) WHERE pan IS NOT NULL;

CREATE TABLE workshopos.supplier_contact (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, supplier_id uuid NOT NULL, id uuid NOT NULL,
  name text NOT NULL CHECK (btrim(name) <> ''), phone text, email text, is_primary boolean NOT NULL DEFAULT false,
  PRIMARY KEY (tenant_id, branch_id, supplier_id, id),
  FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES workshopos.supplier(tenant_id, branch_id, id),
  CHECK (phone IS NOT NULL OR email IS NOT NULL)
);
CREATE UNIQUE INDEX supplier_one_primary_contact ON workshopos.supplier_contact(tenant_id, branch_id, supplier_id) WHERE is_primary;

CREATE TABLE workshopos.supplier_address (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, supplier_id uuid NOT NULL, id uuid NOT NULL,
  address_type text NOT NULL CHECK (address_type IN ('BILLING','SHIPPING','REGISTERED','OTHER')),
  line1 text NOT NULL, line2 text, city text NOT NULL, state_code text, postal_code text, country_code char(2) NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, supplier_id, id),
  FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES workshopos.supplier(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.supplier_item_relation (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, supplier_id uuid NOT NULL, item_id uuid NOT NULL,
  supplier_sku text NOT NULL, purchase_uom text NOT NULL, minimum_order_quantity numeric(24, 6) NOT NULL CHECK (minimum_order_quantity > 0),
  lead_time_days integer NOT NULL CHECK (lead_time_days >= 0), active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (tenant_id, branch_id, supplier_id, item_id),
  FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES workshopos.supplier(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.purchase_requisition (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, purpose text NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT','APPROVAL_PENDING','APPROVED','PARTIALLY_ORDERED','ORDERED','PARTIALLY_CANCELLED','CANCELLED','REJECTED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id), FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);
CREATE TABLE workshopos.purchase_requisition_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, requisition_id uuid NOT NULL, id uuid NOT NULL, line_version bigint NOT NULL CHECK (line_version > 0),
  item_id uuid NOT NULL, ordered_quantity numeric(24, 6) NOT NULL CHECK (ordered_quantity > 0), cancelled_quantity numeric(24, 6) NOT NULL DEFAULT 0 CHECK (cancelled_quantity >= 0),
  fulfilled_quantity numeric(24, 6) NOT NULL DEFAULT 0 CHECK (fulfilled_quantity >= 0), uom text NOT NULL, required_by date NOT NULL,
  valid_from_version bigint NOT NULL, valid_to_version bigint,
  PRIMARY KEY (tenant_id, branch_id, requisition_id, id, line_version),
  FOREIGN KEY (tenant_id, branch_id, requisition_id) REFERENCES workshopos.purchase_requisition(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK (fulfilled_quantity + cancelled_quantity <= ordered_quantity), CHECK (valid_to_version IS NULL OR valid_to_version > valid_from_version)
);

CREATE TABLE workshopos.purchase_order (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, supplier_id uuid NOT NULL, requisition_id uuid,
  currency char(3) NOT NULL, terms text NOT NULL, status text NOT NULL CHECK (status IN ('DRAFT','APPROVAL_PENDING','APPROVED','PARTIALLY_FULFILLED','FULFILLED','PARTIALLY_CANCELLED','CANCELLED','REJECTED')),
  taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0), gst_minor bigint NOT NULL CHECK (gst_minor >= 0), landed_cost_minor bigint NOT NULL CHECK (landed_cost_minor >= 0),
  recoverable_tax_minor bigint NOT NULL CHECK (recoverable_tax_minor >= 0), payable_minor bigint NOT NULL CHECK (payable_minor >= 0), inventory_value_minor bigint NOT NULL CHECK (inventory_value_minor >= 0),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id), FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES workshopos.supplier(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, requisition_id) REFERENCES workshopos.purchase_requisition(tenant_id, branch_id, id),
  CHECK (payable_minor = taxable_minor + gst_minor + landed_cost_minor + recoverable_tax_minor),
  CHECK (inventory_value_minor = taxable_minor + landed_cost_minor)
);
CREATE TABLE workshopos.purchase_order_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, purchase_order_id uuid NOT NULL, id uuid NOT NULL, line_version bigint NOT NULL CHECK (line_version > 0),
  requisition_line_id uuid, item_id uuid NOT NULL, ordered_quantity numeric(24, 6) NOT NULL CHECK (ordered_quantity > 0), received_quantity numeric(24, 6) NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),
  cancelled_quantity numeric(24, 6) NOT NULL DEFAULT 0 CHECK (cancelled_quantity >= 0), uom text NOT NULL, unit_price_minor bigint NOT NULL CHECK (unit_price_minor >= 0),
  discount_minor bigint NOT NULL CHECK (discount_minor >= 0), gst_rate_bps integer NOT NULL CHECK (gst_rate_bps BETWEEN 0 AND 4000), taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0),
  gst_minor bigint NOT NULL CHECK (gst_minor >= 0), landed_cost_minor bigint NOT NULL CHECK (landed_cost_minor >= 0), inventory_value_minor bigint NOT NULL CHECK (inventory_value_minor >= 0),
  valid_from_version bigint NOT NULL, valid_to_version bigint,
  PRIMARY KEY (tenant_id, branch_id, purchase_order_id, id, line_version),
  FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES workshopos.purchase_order(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK (received_quantity + cancelled_quantity <= ordered_quantity), CHECK (inventory_value_minor = taxable_minor + landed_cost_minor),
  CHECK (valid_to_version IS NULL OR valid_to_version > valid_from_version)
);
CREATE UNIQUE INDEX purchase_order_current_line ON workshopos.purchase_order_line(tenant_id, branch_id, purchase_order_id, id) WHERE valid_to_version IS NULL;

CREATE TABLE workshopos.purchase_order_landed_cost (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, purchase_order_id uuid NOT NULL, id uuid NOT NULL,
  cost_kind text NOT NULL, amount_minor bigint NOT NULL CHECK (amount_minor >= 0), recoverable_tax_minor bigint NOT NULL CHECK (recoverable_tax_minor >= 0),
  allocation_basis text NOT NULL CHECK (allocation_basis IN ('TAXABLE_VALUE','QUANTITY','MANUAL')),
  PRIMARY KEY (tenant_id, branch_id, purchase_order_id, id),
  FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES workshopos.purchase_order(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.goods_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, purchase_order_id uuid NOT NULL,
  supplier_document_number text NOT NULL, supplier_document_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('POSTED','POSTED_WITH_DISCREPANCY','DISCREPANCY_RESOLVED')),
  accepted_taxable_minor bigint NOT NULL CHECK (accepted_taxable_minor >= 0), gst_minor bigint NOT NULL CHECK (gst_minor >= 0),
  landed_cost_minor bigint NOT NULL CHECK (landed_cost_minor >= 0), inventory_value_minor bigint NOT NULL CHECK (inventory_value_minor >= 0),
  actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0), posted_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, purchase_order_id, supplier_document_number),
  FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES workshopos.purchase_order(tenant_id, branch_id, id),
  CHECK (inventory_value_minor = accepted_taxable_minor + landed_cost_minor)
);
CREATE TABLE workshopos.goods_receipt_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, goods_receipt_id uuid NOT NULL, id uuid NOT NULL,
  purchase_order_id uuid NOT NULL, purchase_order_line_id uuid NOT NULL, purchase_order_line_version bigint NOT NULL,
  item_id uuid NOT NULL, received_quantity numeric(24, 6) NOT NULL CHECK (received_quantity > 0), rejected_quantity numeric(24, 6) NOT NULL CHECK (rejected_quantity >= 0),
  accepted_quantity numeric(24, 6) NOT NULL CHECK (accepted_quantity > 0), uom text NOT NULL, warehouse_id uuid NOT NULL, bin_id uuid,
  lot_id uuid, roll_id uuid, inspection_result text NOT NULL CHECK (inspection_result IN ('ACCEPTED','PARTIALLY_ACCEPTED')),
  checklist_version text NOT NULL, inspection_notes text NOT NULL, inspected_by_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0), gst_minor bigint NOT NULL CHECK (gst_minor >= 0), landed_cost_minor bigint NOT NULL CHECK (landed_cost_minor >= 0), inventory_value_minor bigint NOT NULL CHECK (inventory_value_minor >= 0),
  inventory_posting_batch_id uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, goods_receipt_id, id),
  FOREIGN KEY (tenant_id, branch_id, goods_receipt_id) REFERENCES workshopos.goods_receipt(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, purchase_order_id, purchase_order_line_id, purchase_order_line_version) REFERENCES workshopos.purchase_order_line(tenant_id, branch_id, purchase_order_id, id, line_version),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id, lot_id) REFERENCES workshopos.inventory_lot(tenant_id, branch_id, item_id, id),
  CHECK (accepted_quantity + rejected_quantity = received_quantity), CHECK (inventory_value_minor = taxable_minor + landed_cost_minor)
);
CREATE TABLE workshopos.goods_receipt_document (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, goods_receipt_id uuid NOT NULL, id uuid NOT NULL,
  document_kind text NOT NULL, private_object_ref text NOT NULL, checksum_sha256 char(64) NOT NULL, scan_status text NOT NULL CHECK (scan_status = 'CLEAN'), captured_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, goods_receipt_id, id), FOREIGN KEY (tenant_id, branch_id, goods_receipt_id) REFERENCES workshopos.goods_receipt(tenant_id, branch_id, id)
);
CREATE TABLE workshopos.goods_receipt_discrepancy (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, goods_receipt_id uuid NOT NULL, goods_receipt_line_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('OPEN','RESOLVED')), reason text NOT NULL, resolution text, resolved_by_membership_id uuid REFERENCES workshopos.membership(id), resolved_at timestamptz,
  PRIMARY KEY (tenant_id, branch_id, goods_receipt_id, goods_receipt_line_id),
  FOREIGN KEY (tenant_id, branch_id, goods_receipt_id, goods_receipt_line_id) REFERENCES workshopos.goods_receipt_line(tenant_id, branch_id, goods_receipt_id, id),
  CHECK ((status = 'OPEN' AND resolution IS NULL) OR (status = 'RESOLVED' AND resolution IS NOT NULL AND resolved_by_membership_id IS NOT NULL))
);

CREATE TABLE workshopos.purchase_return (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, purchase_order_id uuid NOT NULL, supplier_id uuid NOT NULL,
  reason text NOT NULL, status text NOT NULL CHECK (status IN ('APPROVAL_PENDING','APPROVED_POSTED','REJECTED')),
  maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id), FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES workshopos.purchase_order(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES workshopos.supplier(tenant_id, branch_id, id)
);
CREATE TABLE workshopos.purchase_return_line (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, purchase_return_id uuid NOT NULL, id uuid NOT NULL,
  goods_receipt_id uuid NOT NULL, goods_receipt_line_id uuid NOT NULL, item_id uuid NOT NULL, quantity numeric(24, 6) NOT NULL CHECK (quantity > 0), uom text NOT NULL,
  warehouse_id uuid NOT NULL, bin_id uuid, lot_id uuid, roll_id uuid, taxable_minor bigint NOT NULL CHECK (taxable_minor >= 0), gst_minor bigint NOT NULL CHECK (gst_minor >= 0),
  landed_cost_minor bigint NOT NULL CHECK (landed_cost_minor >= 0), inventory_value_minor bigint NOT NULL CHECK (inventory_value_minor >= 0), inventory_posting_batch_id uuid,
  PRIMARY KEY (tenant_id, branch_id, purchase_return_id, id), FOREIGN KEY (tenant_id, branch_id, purchase_return_id) REFERENCES workshopos.purchase_return(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, goods_receipt_id, goods_receipt_line_id) REFERENCES workshopos.goods_receipt_line(tenant_id, branch_id, goods_receipt_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  CHECK (inventory_value_minor = taxable_minor + landed_cost_minor)
);
CREATE TABLE workshopos.purchase_return_evidence (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, purchase_return_id uuid NOT NULL, id uuid NOT NULL,
  evidence_kind text NOT NULL, private_object_ref text NOT NULL, checksum_sha256 char(64) NOT NULL, scan_status text NOT NULL CHECK (scan_status = 'CLEAN'), captured_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, purchase_return_id, id), FOREIGN KEY (tenant_id, branch_id, purchase_return_id) REFERENCES workshopos.purchase_return(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.procurement_approval (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, entity_type text NOT NULL CHECK (entity_type IN ('REQUISITION','PURCHASE_ORDER','PURCHASE_RETURN')),
  entity_id uuid NOT NULL, threshold_minor bigint, decision text NOT NULL CHECK (decision IN ('APPROVE','REJECT')), maker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), checker_membership_id uuid NOT NULL REFERENCES workshopos.membership(id),
  reason text NOT NULL, decided_at timestamptz NOT NULL, audit_reference uuid NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id), CHECK (maker_membership_id <> checker_membership_id)
);
CREATE TABLE workshopos.procurement_history (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, entity_type text NOT NULL, entity_id uuid NOT NULL,
  action text NOT NULL, resource_version bigint NOT NULL, actor_membership_id uuid NOT NULL REFERENCES workshopos.membership(id), reason text NOT NULL, snapshot jsonb NOT NULL,
  occurred_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id)
);
CREATE TABLE workshopos.procurement_financial_event (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, id uuid NOT NULL, event_type text NOT NULL CHECK (event_type IN ('GRN_VALUE_POSTED','PURCHASE_RETURN_CREDIT_EXPECTED')),
  source_id uuid NOT NULL, amount_minor bigint NOT NULL, gst_minor bigint NOT NULL, compensating boolean NOT NULL,
  occurred_at timestamptz NOT NULL, audit_reference uuid NOT NULL, PRIMARY KEY (tenant_id, branch_id, id), UNIQUE (tenant_id, event_type, source_id)
);
CREATE TABLE workshopos.procurement_command_receipt (
  tenant_id uuid NOT NULL, branch_id uuid NOT NULL, idempotency_key text NOT NULL, payload_fingerprint char(64) NOT NULL,
  response_status integer NOT NULL, response_body jsonb NOT NULL, audit_reference uuid NOT NULL, committed_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, idempotency_key), UNIQUE (tenant_id, idempotency_key)
);

-- Application calls this in one transaction. Locking current PO lines makes competing GRNs serialize;
-- each accepted line delegates exactly once to S13's balanced append-only posting routine.
CREATE FUNCTION workshopos.post_procurement_grn(p_tenant_id uuid, p_branch_id uuid, p_grn_id uuid, p_payload jsonb, p_idempotency_key text, p_payload_fingerprint char(64)) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = workshopos, pg_temp AS $$
DECLARE v_existing workshopos.procurement_command_receipt%ROWTYPE; v_line record;
BEGIN
  SELECT * INTO v_existing FROM workshopos.procurement_command_receipt
   WHERE tenant_id = p_tenant_id AND idempotency_key = p_idempotency_key FOR UPDATE;
  IF FOUND THEN
    IF v_existing.payload_fingerprint <> p_payload_fingerprint THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REUSED'; END IF;
    RETURN v_existing.response_body;
  END IF;
  PERFORM 1 FROM workshopos.purchase_order_line pol
   WHERE pol.tenant_id = p_tenant_id AND pol.branch_id = p_branch_id
     AND pol.purchase_order_id = (p_payload->>'purchaseOrderId')::uuid AND pol.valid_to_version IS NULL
   ORDER BY pol.id FOR UPDATE;
  -- Validation and inserts happen before commit; any failure rolls back every procurement and stock effect.
  FOR v_line IN SELECT * FROM jsonb_array_elements(p_payload->'acceptedLines') LOOP
    PERFORM workshopos.post_inventory_receipt(
      p_tenant_id, p_branch_id, (v_line.value->>'warehouseId')::uuid, (v_line.value->>'itemId')::uuid,
      (v_line.value->>'acceptedQuantity')::numeric, (v_line.value->>'inventoryValueMinor')::bigint,
      'PURCHASE_GRN', p_grn_id::text || ':' || (v_line.value->>'id'), p_idempotency_key || ':' || (v_line.value->>'id'));
  END LOOP;
  RETURN jsonb_build_object('grnId', p_grn_id, 'committed', true);
END $$;

CREATE FUNCTION workshopos.reject_append_only_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; use a compensating event', TG_TABLE_NAME; END $$;
CREATE TRIGGER procurement_history_append_only BEFORE UPDATE OR DELETE ON workshopos.procurement_history FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();
CREATE TRIGGER procurement_approval_append_only BEFORE UPDATE OR DELETE ON workshopos.procurement_approval FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();
CREATE TRIGGER procurement_financial_event_append_only BEFORE UPDATE OR DELETE ON workshopos.procurement_financial_event FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();
CREATE TRIGGER goods_receipt_line_append_only BEFORE UPDATE OR DELETE ON workshopos.goods_receipt_line FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();
CREATE TRIGGER goods_receipt_document_append_only BEFORE UPDATE OR DELETE ON workshopos.goods_receipt_document FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();
CREATE TRIGGER purchase_return_line_append_only BEFORE UPDATE OR DELETE ON workshopos.purchase_return_line FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();
CREATE TRIGGER purchase_return_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.purchase_return_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_append_only_mutation();

ALTER TABLE workshopos.supplier ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.supplier FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.supplier_contact ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.supplier_contact FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.supplier_address ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.supplier_address FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.supplier_item_relation ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.supplier_item_relation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_requisition ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_requisition FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_requisition_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_requisition_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_order ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_order FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_order_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_order_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_order_landed_cost ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_order_landed_cost FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.goods_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.goods_receipt FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.goods_receipt_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.goods_receipt_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.goods_receipt_document ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.goods_receipt_document FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.goods_receipt_discrepancy ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.goods_receipt_discrepancy FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_return ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_return FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_return_line ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_return_line FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.purchase_return_evidence ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.purchase_return_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.procurement_history ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.procurement_history FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.procurement_approval ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.procurement_approval FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.procurement_financial_event ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.procurement_financial_event FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.procurement_command_receipt ENABLE ROW LEVEL SECURITY; ALTER TABLE workshopos.procurement_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY supplier_isolation ON workshopos.supplier USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY supplier_contact_isolation ON workshopos.supplier_contact USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY supplier_address_isolation ON workshopos.supplier_address USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY supplier_item_relation_isolation ON workshopos.supplier_item_relation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_requisition_isolation ON workshopos.purchase_requisition USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_requisition_line_isolation ON workshopos.purchase_requisition_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_order_isolation ON workshopos.purchase_order USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_order_line_isolation ON workshopos.purchase_order_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_order_landed_cost_isolation ON workshopos.purchase_order_landed_cost USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY goods_receipt_isolation ON workshopos.goods_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY goods_receipt_line_isolation ON workshopos.goods_receipt_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids()));
CREATE POLICY goods_receipt_document_isolation ON workshopos.goods_receipt_document USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY goods_receipt_discrepancy_isolation ON workshopos.goods_receipt_discrepancy USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_return_isolation ON workshopos.purchase_return USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY purchase_return_line_isolation ON workshopos.purchase_return_line USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()) AND warehouse_id = ANY(workshopos.authorized_warehouse_ids()));
CREATE POLICY purchase_return_evidence_isolation ON workshopos.purchase_return_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY procurement_history_isolation ON workshopos.procurement_history USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY procurement_approval_isolation ON workshopos.procurement_approval USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY procurement_financial_event_isolation ON workshopos.procurement_financial_event USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));
CREATE POLICY procurement_command_receipt_isolation ON workshopos.procurement_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY(workshopos.authorized_branch_ids()));

COMMIT;
