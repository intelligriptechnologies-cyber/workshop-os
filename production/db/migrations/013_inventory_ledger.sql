BEGIN;

CREATE FUNCTION workshopos.authorized_warehouse_ids() RETURNS uuid[]
LANGUAGE sql STABLE AS $$
  SELECT CASE
    WHEN current_setting('app.warehouse_ids', true) IS NULL OR current_setting('app.warehouse_ids', true) = '' THEN '{}'::uuid[]
    ELSE string_to_array(current_setting('app.warehouse_ids', true), ',')::uuid[]
  END
$$;

CREATE TABLE workshopos.inventory_warehouse (
  tenant_id uuid NOT NULL REFERENCES workshopos.tenant(tenant_id),
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  name text NOT NULL CHECK (btrim(name) <> ''),
  active boolean NOT NULL DEFAULT true,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.inventory_bin (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  warehouse_id uuid NOT NULL,
  id uuid NOT NULL,
  code text NOT NULL CHECK (btrim(code) <> ''),
  active boolean NOT NULL DEFAULT true,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, warehouse_id, id),
  UNIQUE (tenant_id, branch_id, warehouse_id, code),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.inventory_item (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  category_id uuid NOT NULL,
  sku text NOT NULL CHECK (btrim(sku) <> ''),
  barcodes text[] NOT NULL DEFAULT '{}',
  base_uom text NOT NULL CHECK (base_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  stock_uom text NOT NULL CHECK (stock_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  purchase_uom text NOT NULL CHECK (purchase_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  issue_uom text NOT NULL CHECK (issue_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  costing_method text NOT NULL CHECK (costing_method IN ('MOVING_AVERAGE', 'FIFO', 'STANDARD')),
  tax_code text NOT NULL CHECK (btrim(tax_code) <> ''),
  reorder_point numeric(38, 6) NOT NULL CHECK (reorder_point >= 0),
  tracking text NOT NULL CHECK (tracking IN ('NONE', 'LOT', 'BATCH', 'SERIAL', 'ROLL')),
  fefo_required boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, branch_id, sku),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.inventory_item_barcode (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  barcode text NOT NULL CHECK (btrim(barcode) <> ''),
  PRIMARY KEY (tenant_id, branch_id, barcode),
  UNIQUE (tenant_id, branch_id, item_id, barcode),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.inventory_item_uom_conversion (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  from_uom text NOT NULL CHECK (from_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  to_uom text NOT NULL CHECK (to_uom ~ '^[A-Z][A-Z0-9_-]{0,15}$'),
  numerator numeric(38, 0) NOT NULL CHECK (numerator > 0),
  denominator numeric(38, 0) NOT NULL CHECK (denominator > 0),
  PRIMARY KEY (tenant_id, branch_id, item_id, from_uom, to_uom),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK (from_uom <> to_uom)
);

CREATE TABLE workshopos.inventory_lot (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  id uuid NOT NULL,
  lot_code text NOT NULL CHECK (btrim(lot_code) <> ''),
  serial_number text,
  manufactured_at timestamptz,
  expires_at timestamptz,
  status text NOT NULL CHECK (status IN ('AVAILABLE', 'QUARANTINED', 'BLOCKED', 'RECALLED')),
  status_reason text,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, item_id, id),
  UNIQUE (tenant_id, branch_id, item_id, lot_code),
  UNIQUE (tenant_id, branch_id, item_id, serial_number),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK (manufactured_at IS NULL OR expires_at IS NULL OR manufactured_at < expires_at),
  CHECK (status = 'AVAILABLE' OR status_reason IS NOT NULL)
);

CREATE TABLE workshopos.inventory_roll_piece (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  lot_id uuid NOT NULL,
  id uuid NOT NULL,
  root_roll_id uuid NOT NULL,
  parent_roll_id uuid,
  parent_remnant_id uuid,
  warehouse_id uuid NOT NULL,
  bin_id uuid,
  length_base numeric(38, 6) NOT NULL CHECK (length_base > 0),
  width_base numeric(38, 6) NOT NULL CHECK (width_base > 0),
  minimum_use_length_base numeric(38, 6) NOT NULL CHECK (minimum_use_length_base > 0),
  quantity_base numeric(38, 6) NOT NULL CHECK (quantity_base = length_base * width_base),
  value_minor bigint NOT NULL CHECK (value_minor >= 0),
  usable boolean NOT NULL,
  status text NOT NULL CHECK (status IN ('AVAILABLE', 'CUT', 'SCRAPPED')),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id, lot_id) REFERENCES workshopos.inventory_lot(tenant_id, branch_id, item_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id, bin_id) REFERENCES workshopos.inventory_bin(tenant_id, branch_id, warehouse_id, id),
  FOREIGN KEY (tenant_id, branch_id, root_roll_id) REFERENCES workshopos.inventory_roll_piece(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, parent_remnant_id) REFERENCES workshopos.inventory_roll_piece(tenant_id, branch_id, id),
  CHECK (minimum_use_length_base <= length_base),
  CHECK (parent_remnant_id IS NULL OR parent_remnant_id <> id)
);

CREATE TABLE workshopos.inventory_balance (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  warehouse_id uuid NOT NULL,
  bin_id uuid,
  item_id uuid NOT NULL,
  lot_id uuid,
  remnant_id uuid,
  quantity_base numeric(38, 6) NOT NULL DEFAULT 0 CHECK (quantity_base >= 0),
  value_minor bigint NOT NULL DEFAULT 0 CHECK (value_minor >= 0),
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE NULLS NOT DISTINCT (tenant_id, branch_id, warehouse_id, bin_id, item_id, lot_id, remnant_id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id, bin_id) REFERENCES workshopos.inventory_bin(tenant_id, branch_id, warehouse_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id, lot_id) REFERENCES workshopos.inventory_lot(tenant_id, branch_id, item_id, id),
  FOREIGN KEY (tenant_id, branch_id, remnant_id) REFERENCES workshopos.inventory_roll_piece(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.inventory_ledger_batch (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  source_type text NOT NULL CHECK (btrim(source_type) <> ''),
  source_id text NOT NULL CHECK (btrim(source_id) <> ''),
  actor_membership_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE (tenant_id, audit_reference),
  FOREIGN KEY (tenant_id, branch_id) REFERENCES workshopos.branch(tenant_id, id)
);

CREATE TABLE workshopos.inventory_ledger_entry (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  batch_id uuid NOT NULL,
  sequence smallint NOT NULL CHECK (sequence > 0),
  account text NOT NULL CHECK (account IN ('INVENTORY_CONTROL', 'LOCATION_STOCK', 'IN_TRANSIT')),
  warehouse_id uuid,
  bin_id uuid,
  item_id uuid NOT NULL,
  lot_id uuid,
  remnant_id uuid,
  quantity_base numeric(38, 6) NOT NULL,
  value_minor bigint NOT NULL,
  source_type text NOT NULL CHECK (btrim(source_type) <> ''),
  source_id text NOT NULL CHECK (btrim(source_id) <> ''),
  actor_membership_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, batch_id, sequence),
  FOREIGN KEY (tenant_id, branch_id, batch_id) REFERENCES workshopos.inventory_ledger_batch(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK ((account = 'LOCATION_STOCK') = (warehouse_id IS NOT NULL))
);

CREATE TABLE workshopos.stock_transfer (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  source_warehouse_id uuid NOT NULL,
  source_bin_id uuid,
  destination_warehouse_id uuid NOT NULL,
  destination_bin_id uuid,
  item_id uuid NOT NULL,
  lot_id uuid,
  remnant_id uuid,
  quantity_base numeric(38, 6) NOT NULL CHECK (quantity_base > 0),
  value_minor bigint NOT NULL DEFAULT 0 CHECK (value_minor >= 0),
  in_transit_quantity_base numeric(38, 6) NOT NULL DEFAULT 0 CHECK (in_transit_quantity_base >= 0),
  in_transit_value_minor bigint NOT NULL DEFAULT 0 CHECK (in_transit_value_minor >= 0),
  status text NOT NULL CHECK (status IN ('READY', 'IN_TRANSIT', 'RECEIVED', 'RECEIPT_DISCREPANCY', 'COMPLETED_WITH_DISCREPANCY')),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  maker_membership_id uuid NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, source_warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, destination_warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES workshopos.inventory_item(tenant_id, branch_id, id),
  CHECK (source_warehouse_id <> destination_warehouse_id OR source_bin_id IS DISTINCT FROM destination_bin_id)
);

CREATE TABLE workshopos.stock_transfer_evidence (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  transfer_id uuid NOT NULL,
  evidence_type text NOT NULL CHECK (evidence_type IN ('DISPATCH', 'RECEIPT', 'DISCREPANCY_RESOLUTION')),
  private_object_ref text NOT NULL CHECK (private_object_ref LIKE '%/private/inventory/transfers/%'),
  checksum text NOT NULL CHECK (checksum ~ '^[0-9a-f]{64}$'),
  scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  captured_at timestamptz NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  PRIMARY KEY (tenant_id, branch_id, transfer_id, evidence_type),
  FOREIGN KEY (tenant_id, branch_id, transfer_id) REFERENCES workshopos.stock_transfer(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.stock_count (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  warehouse_id uuid NOT NULL,
  bin_id uuid,
  status text NOT NULL CHECK (status IN ('COUNTING', 'RECOUNT_REQUIRED', 'RECOUNTING', 'INVESTIGATION_REQUIRED', 'ADJUSTMENT_PENDING', 'RECONCILED', 'ADJUSTMENT_REJECTED')),
  round integer NOT NULL DEFAULT 1 CHECK (round > 0),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  maker_membership_id uuid NOT NULL,
  frozen_at timestamptz NOT NULL,
  resource_version bigint NOT NULL DEFAULT 1 CHECK (resource_version > 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  FOREIGN KEY (tenant_id, branch_id, warehouse_id) REFERENCES workshopos.inventory_warehouse(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.stock_count_scope (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  id uuid NOT NULL,
  count_id uuid NOT NULL,
  item_id uuid NOT NULL,
  lot_id uuid,
  remnant_id uuid,
  expected_quantity_base numeric(38, 6) NOT NULL CHECK (expected_quantity_base >= 0),
  expected_value_minor bigint NOT NULL CHECK (expected_value_minor >= 0),
  PRIMARY KEY (tenant_id, branch_id, id),
  UNIQUE NULLS NOT DISTINCT (tenant_id, branch_id, count_id, item_id, lot_id, remnant_id),
  FOREIGN KEY (tenant_id, branch_id, count_id) REFERENCES workshopos.stock_count(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.stock_count_entry (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  count_id uuid NOT NULL,
  scope_id uuid NOT NULL,
  item_id uuid NOT NULL,
  lot_id uuid,
  remnant_id uuid,
  round integer NOT NULL CHECK (round > 0),
  counted_quantity_base numeric(38, 6) NOT NULL CHECK (counted_quantity_base >= 0),
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, count_id, scope_id, round),
  FOREIGN KEY (tenant_id, branch_id, scope_id) REFERENCES workshopos.stock_count_scope(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.stock_count_investigation (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  count_id uuid NOT NULL,
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  private_object_ref text NOT NULL CHECK (private_object_ref LIKE '%/private/inventory/counts/%'),
  checksum text NOT NULL CHECK (checksum ~ '^[0-9a-f]{64}$'),
  scan_status text NOT NULL CHECK (scan_status = 'CLEAN'),
  actor_membership_id uuid NOT NULL,
  audit_reference uuid NOT NULL,
  investigated_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, count_id),
  FOREIGN KEY (tenant_id, branch_id, count_id) REFERENCES workshopos.stock_count(tenant_id, branch_id, id)
);

CREATE TABLE workshopos.stock_count_adjustment_approval (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  count_id uuid NOT NULL,
  maker_membership_id uuid NOT NULL,
  checker_membership_id uuid NOT NULL,
  decision text NOT NULL CHECK (decision IN ('APPROVE', 'REJECT')),
  reason text NOT NULL CHECK (btrim(reason) <> ''),
  audit_reference uuid NOT NULL,
  decided_at timestamptz NOT NULL,
  PRIMARY KEY (tenant_id, branch_id, count_id),
  FOREIGN KEY (tenant_id, branch_id, count_id) REFERENCES workshopos.stock_count(tenant_id, branch_id, id),
  CHECK (maker_membership_id <> checker_membership_id)
);

CREATE TABLE workshopos.inventory_command_receipt (
  tenant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (btrim(idempotency_key) <> ''),
  command_fingerprint text NOT NULL CHECK (command_fingerprint ~ '^[0-9a-f]{64}$'),
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_body jsonb NOT NULL CHECK (jsonb_typeof(response_body) = 'object'),
  committed_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  PRIMARY KEY (tenant_id, branch_id, idempotency_key),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE FUNCTION workshopos.assert_inventory_ledger_batch_balanced() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_tenant_id uuid := COALESCE(NEW.tenant_id, OLD.tenant_id);
  v_branch_id uuid := COALESCE(NEW.branch_id, OLD.branch_id);
  v_batch_id uuid := COALESCE(NEW.batch_id, OLD.batch_id);
  v_quantity numeric(38, 6);
  v_value numeric;
  v_entries bigint;
BEGIN
  SELECT COALESCE(sum(quantity_base), 0), COALESCE(sum(value_minor), 0), count(*)
    INTO v_quantity, v_value, v_entries
    FROM workshopos.inventory_ledger_entry
   WHERE tenant_id = v_tenant_id AND branch_id = v_branch_id AND batch_id = v_batch_id;
  IF v_entries < 2 OR v_quantity <> 0 OR v_value <> 0 THEN
    RAISE EXCEPTION 'inventory ledger batch must balance exact quantity and value'
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NULL;
END $$;

CREATE CONSTRAINT TRIGGER inventory_ledger_batch_balanced
AFTER INSERT OR UPDATE OR DELETE ON workshopos.inventory_ledger_entry
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
EXECUTE FUNCTION workshopos.assert_inventory_ledger_batch_balanced();

CREATE FUNCTION workshopos.reserve_inventory_balance(
  p_tenant_id uuid, p_branch_id uuid, p_warehouse_id uuid, p_bin_id uuid,
  p_item_id uuid, p_lot_id uuid, p_remnant_id uuid, p_quantity_base numeric(38, 6)
) RETURNS workshopos.inventory_balance
LANGUAGE plpgsql VOLATILE AS $$
DECLARE v_balance workshopos.inventory_balance;
BEGIN
  IF p_quantity_base <= 0 THEN RAISE EXCEPTION 'reserved quantity must be positive'; END IF;
  UPDATE workshopos.inventory_balance
     SET quantity_base = quantity_base - p_quantity_base,
         value_minor = CASE WHEN quantity_base = p_quantity_base THEN 0
           ELSE value_minor - floor(value_minor * p_quantity_base / quantity_base)::bigint END,
         resource_version = resource_version + 1
   WHERE tenant_id = p_tenant_id AND branch_id = p_branch_id AND warehouse_id = p_warehouse_id
     AND bin_id IS NOT DISTINCT FROM p_bin_id AND item_id = p_item_id
     AND lot_id IS NOT DISTINCT FROM p_lot_id AND remnant_id IS NOT DISTINCT FROM p_remnant_id
     AND quantity_base >= p_quantity_base
   RETURNING * INTO v_balance;
  IF NOT FOUND THEN RAISE EXCEPTION 'insufficient stock or concurrent overspend' USING ERRCODE = 'serialization_failure'; END IF;
  RETURN v_balance;
END $$;

CREATE FUNCTION workshopos.reject_inventory_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'inventory ledger evidence is append-only' USING ERRCODE = 'integrity_constraint_violation';
END $$;

CREATE TRIGGER inventory_ledger_batch_append_only BEFORE UPDATE OR DELETE ON workshopos.inventory_ledger_batch FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER inventory_ledger_entry_append_only BEFORE UPDATE OR DELETE ON workshopos.inventory_ledger_entry FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER stock_transfer_evidence_append_only BEFORE UPDATE OR DELETE ON workshopos.stock_transfer_evidence FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER stock_count_scope_append_only BEFORE UPDATE OR DELETE ON workshopos.stock_count_scope FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER stock_count_entry_append_only BEFORE UPDATE OR DELETE ON workshopos.stock_count_entry FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER stock_count_investigation_append_only BEFORE UPDATE OR DELETE ON workshopos.stock_count_investigation FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER stock_count_adjustment_approval_append_only BEFORE UPDATE OR DELETE ON workshopos.stock_count_adjustment_approval FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();
CREATE TRIGGER inventory_command_receipt_append_only BEFORE UPDATE OR DELETE ON workshopos.inventory_command_receipt FOR EACH ROW EXECUTE FUNCTION workshopos.reject_inventory_ledger_mutation();

ALTER TABLE workshopos.inventory_warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_warehouse FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_bin ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_bin FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_item FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_item_barcode ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_item_barcode FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_item_uom_conversion ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_item_uom_conversion FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_lot ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_lot FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_roll_piece ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_roll_piece FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_balance FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_ledger_batch ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_ledger_batch FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_ledger_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_ledger_entry FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_transfer ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_transfer FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_transfer_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_transfer_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_scope ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_scope FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_entry FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_investigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_investigation FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_adjustment_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.stock_count_adjustment_approval FORCE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_command_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshopos.inventory_command_receipt FORCE ROW LEVEL SECURITY;

CREATE POLICY inventory_warehouse_isolation ON workshopos.inventory_warehouse USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND id = ANY (workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND id = ANY (workshopos.authorized_warehouse_ids()));
CREATE POLICY inventory_bin_isolation ON workshopos.inventory_bin USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids()));
CREATE POLICY inventory_item_isolation ON workshopos.inventory_item USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY inventory_item_barcode_isolation ON workshopos.inventory_item_barcode USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY inventory_item_uom_conversion_isolation ON workshopos.inventory_item_uom_conversion USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY inventory_lot_isolation ON workshopos.inventory_lot USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY inventory_roll_piece_isolation ON workshopos.inventory_roll_piece USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids()));
CREATE POLICY inventory_balance_isolation ON workshopos.inventory_balance USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids()));
CREATE POLICY inventory_ledger_batch_isolation ON workshopos.inventory_ledger_batch USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY inventory_ledger_entry_isolation ON workshopos.inventory_ledger_entry USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND (warehouse_id IS NULL OR warehouse_id = ANY (workshopos.authorized_warehouse_ids()))) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND (warehouse_id IS NULL OR warehouse_id = ANY (workshopos.authorized_warehouse_ids())));
CREATE POLICY stock_transfer_isolation ON workshopos.stock_transfer USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND source_warehouse_id = ANY (workshopos.authorized_warehouse_ids()) AND destination_warehouse_id = ANY (workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND source_warehouse_id = ANY (workshopos.authorized_warehouse_ids()) AND destination_warehouse_id = ANY (workshopos.authorized_warehouse_ids()));
CREATE POLICY stock_transfer_evidence_isolation ON workshopos.stock_transfer_evidence USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY stock_count_isolation ON workshopos.stock_count USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()) AND warehouse_id = ANY (workshopos.authorized_warehouse_ids()));
CREATE POLICY stock_count_scope_isolation ON workshopos.stock_count_scope USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY stock_count_entry_isolation ON workshopos.stock_count_entry USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY stock_count_investigation_isolation ON workshopos.stock_count_investigation USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY stock_count_adjustment_approval_isolation ON workshopos.stock_count_adjustment_approval USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));
CREATE POLICY inventory_command_receipt_isolation ON workshopos.inventory_command_receipt USING (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids())) WITH CHECK (tenant_id = workshopos.current_tenant_id() AND branch_id = ANY (workshopos.authorized_branch_ids()));

COMMIT;
