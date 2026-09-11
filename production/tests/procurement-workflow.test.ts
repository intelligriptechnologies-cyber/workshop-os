import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createLocalInventoryApi, type InventoryMembership } from "../src/inventory-ledger.js";
import { createLocalProcurementApi, type ProcurementMembership } from "../src/procurement-workflow.js";

const memberships: Record<string, ProcurementMembership & InventoryMembership> = {
  buyer: { identityId: "identity-buyer", membershipId: "membership-buyer", tenantId: "tenant-north", branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], permissions: ["supplier.manage", "procurement.request", "procurement.order", "procurement.receive", "procurement.return", "procurement.view", "procurement.approve", "inventory.master.manage", "inventory.receive", "inventory.move", "inventory.view"] },
  manager: { identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north", branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], permissions: ["procurement.approve", "procurement.return.approve", "procurement.view", "inventory.receive", "inventory.move", "inventory.view"] },
  restricted: { identityId: "identity-restricted", membershipId: "membership-restricted", tenantId: "tenant-north", branchIds: ["branch-delhi"], warehouseIds: [], permissions: ["procurement.receive", "procurement.view"] },
  foreign: { identityId: "identity-foreign", membershipId: "membership-foreign", tenantId: "tenant-south", branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], permissions: ["procurement.view", "procurement.receive", "inventory.view", "inventory.receive"] },
};
const warehouses = [{ id: "warehouse-main", tenantId: "tenant-north", branchId: "branch-delhi", name: "Main Store", binIds: ["bin-a"] }];

async function seeded() {
  const inventory = createLocalInventoryApi({ memberships, warehouses });
  const buyerInventory = inventory.signIn("buyer");
  assert.equal((await buyerInventory.post("/api/v1/inventory/items", {
    branchId: "branch-delhi", id: "item-oil", categoryId: "category-fluids", sku: "OIL-5W30", barcodes: ["890100000014"],
    baseUom: "ML", stockUom: "ML", purchaseUom: "CAN", issueUom: "ML", conversions: [{ fromUom: "CAN", toUom: "ML", numerator: "5000", denominator: "1" }],
    costingMethod: "FIFO", taxCode: "GST18", reorderPoint: "10000", active: true, tracking: "LOT", fefoRequired: true,
  }, { idempotencyKey: "seed-item-oil" })).status, 201);
  const api = createLocalProcurementApi({ memberships, inventory });
  const buyer = api.signIn("buyer");
  assert.equal((await buyer.post("/api/v1/procurement/suppliers", {
    branchId: "branch-delhi", id: "supplier-castrol", legalName: "Castrol India Limited", tradeName: "Castrol",
    gstin: "27AAACC4487C1Z7", pan: "AAACC4487C", taxTreatment: "REGISTERED", currency: "INR", paymentTermsDays: 30,
    contacts: [{ id: "contact-1", name: "Anita", phone: "+919810000001", email: "anita@example.in", primary: true }],
    addresses: [{ id: "address-1", type: "BILLING", line1: "Parel", city: "Mumbai", stateCode: "27", postalCode: "400012", countryCode: "IN" }],
    itemRelations: [{ itemId: "item-oil", supplierSku: "CAST-EDGE-5L", leadTimeDays: 3, minimumOrderQuantity: "1", purchaseUom: "CAN" }], status: "ACTIVE",
  }, { idempotencyKey: "supplier-create" })).status, 201);
  assert.equal((await buyer.post("/api/v1/procurement/requisitions", {
    branchId: "branch-delhi", id: "req-1", purpose: "September oil replenishment", lines: [{ id: "req-line-1", itemId: "item-oil", quantity: "10", uom: "CAN", requiredBy: "2026-09-20" }],
  }, { idempotencyKey: "req-create" })).status, 201);
  assert.equal((await buyer.post("/api/v1/procurement/requisitions/req-1/submit", { branchId: "branch-delhi", reason: "Stock below reorder" }, { ifMatch: 1, idempotencyKey: "req-submit" })).status, 202);
  assert.equal((await api.signIn("manager").post("/api/v1/procurement/requisitions/req-1/approval", { branchId: "branch-delhi", decision: "APPROVE", reason: "Requirement verified" }, { ifMatch: 2, idempotencyKey: "req-approve" })).status, 200);
  assert.equal((await buyer.post("/api/v1/procurement/purchase-orders", {
    branchId: "branch-delhi", id: "po-1", supplierId: "supplier-castrol", requisitionId: "req-1", currency: "INR",
    lines: [{ id: "po-line-1", requisitionLineId: "req-line-1", itemId: "item-oil", quantity: "10", uom: "CAN", unitPriceMinor: "100000", discountMinor: "50000", gstRateBps: 1800 }],
    landedCostInputs: [{ id: "freight", kind: "FREIGHT", amountMinor: "10000", recoverableTaxMinor: "1800" }], terms: "Delivery within seven days",
  }, { idempotencyKey: "po-create" })).status, 201);
  assert.equal((await buyer.post("/api/v1/procurement/purchase-orders/po-1/submit", { branchId: "branch-delhi", reason: "Best approved quote" }, { ifMatch: 1, idempotencyKey: "po-submit" })).status, 202);
  assert.equal((await api.signIn("manager").post("/api/v1/procurement/purchase-orders/po-1/approval", { branchId: "branch-delhi", decision: "APPROVE", reason: "Commercial terms verified" }, { ifMatch: 2, idempotencyKey: "po-approve" })).status, 200);
  return { api, inventory };
}

test("approved PO can be partially received once with inspected lot, document, exact discrepancy, GST and landed value", async () => {
  const { api, inventory } = await seeded();
  const buyer = api.signIn("buyer");
  const body = {
    branchId: "branch-delhi", id: "grn-1", purchaseOrderId: "po-1", supplierDocumentNumber: "INV-77", supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/grn/grn-1-invoice.pdf", checksum: "a".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T10:00:00.000Z", kind: "SUPPLIER_INVOICE" }],
    lines: [{ id: "grn-line-1", purchaseOrderLineId: "po-line-1", receivedQuantity: "4", rejectedQuantity: "1", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a",
      lot: { id: "lot-oil-sep", code: "OIL-SEP-26", manufacturedAt: "2026-08-01T00:00:00.000Z", expiresAt: "2028-08-01T00:00:00.000Z", status: "AVAILABLE" },
      inspection: { result: "PARTIALLY_ACCEPTED", checklistVersion: "oil-inward-v2", notes: "One can dented", inspectedByMembershipId: "membership-buyer" }, discrepancyReason: "One damaged can rejected at dock" }],
  };
  const first = await buyer.post("/api/v1/procurement/grns", body, { idempotencyKey: "grn-create-1", now: "2026-09-11T10:10:00.000Z" });
  assert.equal(first.status, 201);
  assert.deepEqual(first.body.grn.totals, { acceptedTaxableMinor: "285000", gstMinor: "51300", landedCostMinor: "3000", inventoryValueMinor: "288000" });
  assert.equal(first.body.grn.lines[0].acceptedQuantity, "3");
  assert.equal(first.body.grn.lines[0].rejectedQuantity, "1");
  assert.equal(first.body.grn.lines[0].discrepancy.status, "OPEN");
  assert.equal(first.body.purchaseOrder.status, "PARTIALLY_FULFILLED");
  assert.equal(first.body.purchaseOrder.lines[0].receivedQuantity, "3");
  assert.match(first.body.auditReference, /^audit-tenant-north-/);

  const replay = await buyer.post("/api/v1/procurement/grns", body, { idempotencyKey: "grn-create-1", now: "2026-09-11T10:10:00.000Z" });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.auditReference, first.body.auditReference);
  assert.deepEqual(inventory.testing.position("item-oil"), { locationQuantityBase: "15000", inTransitQuantityBase: "0", totalQuantityBase: "15000", totalValueMinor: "288000" });
  const ledger = inventory.testing.ledger().filter((entry) => entry.sourceType === "PURCHASE_GRN");
  assert.equal(ledger.length, 2);
  assert.ok(ledger.every((entry) => entry.sourceId === "grn-1:grn-line-1"));
});

test("supplier identity and status changes are versioned while GST, contacts, addresses, items and duplicates stay controlled", async () => {
  const { api } = await seeded();
  const buyer = api.signIn("buyer");
  const duplicate = await buyer.post("/api/v1/procurement/suppliers", {
    branchId: "branch-delhi", id: "supplier-duplicate", legalName: "Different Legal Name", gstin: "27AAACC4487C1Z7", pan: "AAACC4487C",
    taxTreatment: "REGISTERED", currency: "INR", paymentTermsDays: 15, contacts: [{ id: "c", name: "C", phone: "+911" , primary: true }],
    addresses: [{ id: "a", type: "REGISTERED", line1: "Mumbai", city: "Mumbai", stateCode: "27", countryCode: "IN" }], itemRelations: [], status: "ACTIVE",
  }, { idempotencyKey: "duplicate-supplier" });
  assert.equal(duplicate.status, 409);
  assert.deepEqual(duplicate.body, { code: "SUPPLIER_DUPLICATE", duplicateSupplierId: "supplier-castrol" });

  const stale = await buyer.patch("/api/v1/procurement/suppliers/supplier-castrol", { branchId: "branch-delhi", status: "ON_HOLD", reason: "Quality hold" }, { ifMatch: 9, idempotencyKey: "hold-stale" });
  assert.equal(stale.body.code, "VERSION_CONFLICT");
  const held = await buyer.patch("/api/v1/procurement/suppliers/supplier-castrol", { branchId: "branch-delhi", status: "ON_HOLD", reason: "Quality hold" }, { ifMatch: 1, idempotencyKey: "hold-supplier" });
  assert.equal(held.status, 200);
  assert.equal(held.body.supplier.status, "ON_HOLD");
  assert.equal(held.body.resourceVersion, 2);
  assert.equal((await buyer.post("/api/v1/procurement/purchase-orders", {
    branchId: "branch-delhi", id: "po-held", supplierId: "supplier-castrol", currency: "INR", terms: "None",
    lines: [{ id: "line", itemId: "item-oil", quantity: "1", uom: "CAN", unitPriceMinor: "1", discountMinor: "0", gstRateBps: 0 }], landedCostInputs: [],
  }, { idempotencyKey: "po-held" })).body.code, "SUPPLIER_NOT_ACTIVE");
  const entries = api.testing.history().filter((entry) => entry.entityType === "SUPPLIER");
  assert.deepEqual(entries.map((entry) => entry.action), ["CREATED", "UPDATED"]);
  assert.deepEqual(entries.map((entry) => entry.resourceVersion), [1, 2]);
});

test("requisition and PO draft lines use optimistic versions and submitted commercial snapshots become immutable", async () => {
  const { api } = await seeded();
  const buyer = api.signIn("buyer");
  assert.equal((await buyer.post("/api/v1/procurement/requisitions", {
    branchId: "branch-delhi", id: "req-edit", purpose: "Initial need", lines: [{ id: "req-edit-line", itemId: "item-oil", quantity: "2", uom: "CAN", requiredBy: "2026-09-24" }],
  }, { idempotencyKey: "req-edit-create" })).status, 201);
  const edited = await buyer.patch("/api/v1/procurement/requisitions/req-edit", {
    branchId: "branch-delhi", purpose: "Reforecast need", reason: "Updated consumption forecast", lines: [{ id: "req-edit-line", itemId: "item-oil", quantity: "3", uom: "CAN", requiredBy: "2026-09-23" }],
  }, { ifMatch: 1, idempotencyKey: "req-edit-patch" });
  assert.equal(edited.status, 200);
  assert.equal(edited.body.requisition.lines[0].quantity, "3");
  assert.equal((await buyer.patch("/api/v1/procurement/requisitions/req-edit", { branchId: "branch-delhi", purpose: "Stale", reason: "Stale", lines: [] }, { ifMatch: 1, idempotencyKey: "req-edit-stale" })).body.code, "VERSION_CONFLICT");

  const createdPo = await buyer.post("/api/v1/procurement/purchase-orders", {
    branchId: "branch-delhi", id: "po-edit", supplierId: "supplier-castrol", currency: "INR", terms: "Draft terms",
    lines: [{ id: "po-edit-line", itemId: "item-oil", quantity: "2", uom: "CAN", unitPriceMinor: "10000", discountMinor: "0", gstRateBps: 1800 }],
    landedCostInputs: [{ id: "freight-edit", kind: "FREIGHT", amountMinor: "1000", recoverableTaxMinor: "180" }],
  }, { idempotencyKey: "po-edit-create" });
  assert.equal(createdPo.status, 201);
  const editedPo = await buyer.patch("/api/v1/procurement/purchase-orders/po-edit", {
    branchId: "branch-delhi", reason: "Supplier quote revision", terms: "Revised terms",
    lines: [{ id: "po-edit-line", itemId: "item-oil", quantity: "3", uom: "CAN", unitPriceMinor: "10000", discountMinor: "3000", gstRateBps: 1800 }],
    landedCostInputs: [{ id: "freight-edit", kind: "FREIGHT", amountMinor: "1200", recoverableTaxMinor: "216" }],
  }, { ifMatch: 1, idempotencyKey: "po-edit-patch" });
  assert.equal(editedPo.status, 200);
  assert.deepEqual(editedPo.body.purchaseOrder.totals, { taxableMinor: "27000", gstMinor: "4860", landedCostMinor: "1200", recoverableTaxMinor: "216", payableMinor: "33276", inventoryValueMinor: "28200" });
  assert.equal((await buyer.post("/api/v1/procurement/purchase-orders/po-edit/submit", { branchId: "branch-delhi", reason: "Final quote" }, { ifMatch: 2, idempotencyKey: "po-edit-submit" })).status, 202);
  assert.equal((await buyer.patch("/api/v1/procurement/purchase-orders/po-edit", { branchId: "branch-delhi", reason: "Late edit", terms: "Changed", lines: [], landedCostInputs: [] }, { ifMatch: 3, idempotencyKey: "po-late-edit" })).body.code, "PURCHASE_ORDER_IMMUTABLE");
});

test("maker-checker, partial cancellation, over-receipt, reordered retries and scoped authority fail safely", async () => {
  const { api, inventory } = await seeded();
  const buyer = api.signIn("buyer");
  await buyer.post("/api/v1/procurement/requisitions", { branchId: "branch-delhi", id: "req-self", purpose: "Self approval control", lines: [{ id: "self-line", itemId: "item-oil", quantity: "1", uom: "CAN", requiredBy: "2026-09-30" }] }, { idempotencyKey: "req-self-create" });
  await buyer.post("/api/v1/procurement/requisitions/req-self/submit", { branchId: "branch-delhi", reason: "Submit" }, { ifMatch: 1, idempotencyKey: "req-self-submit" });
  assert.equal((await buyer.post("/api/v1/procurement/requisitions/req-self/approval", { branchId: "branch-delhi", decision: "APPROVE", reason: "Self approval" }, { ifMatch: 2, idempotencyKey: "req-self-approve" })).body.code, "MAKER_CANNOT_CHECK");
  const received = await buyer.post("/api/v1/procurement/grns", {
    branchId: "branch-delhi", id: "grn-safe", purchaseOrderId: "po-1", supplierDocumentNumber: "SAFE-1", supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/grn/grn-safe-invoice.pdf", checksum: "b".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T11:00:00.000Z" }],
    lines: [{ id: "grn-safe-line", purchaseOrderLineId: "po-line-1", receivedQuantity: "3", rejectedQuantity: "0", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a",
      lot: { id: "lot-safe", code: "SAFE", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" }, inspection: { result: "ACCEPTED", checklistVersion: "inward-v1", notes: "Accepted", inspectedByMembershipId: "membership-buyer" } }],
  }, { idempotencyKey: "grn-safe", now: "2026-09-11T11:00:00.000Z" });
  assert.equal(received.status, 201);
  const cancelled = await buyer.post("/api/v1/procurement/purchase-orders/po-1/cancel", { branchId: "branch-delhi", reason: "Demand reduced", lines: [{ lineId: "po-line-1", quantity: "2" }] }, { ifMatch: 4, idempotencyKey: "po-partial-cancel" });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.purchaseOrder.status, "PARTIALLY_CANCELLED");
  assert.equal(cancelled.body.purchaseOrder.lines[0].cancelledQuantity, "2");

  const before = inventory.testing.position("item-oil");
  const over = await buyer.post("/api/v1/procurement/grns", {
    branchId: "branch-delhi", id: "grn-over", purchaseOrderId: "po-1", supplierDocumentNumber: "OVER-1", supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/grn/grn-over.pdf", checksum: "c".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T11:10:00.000Z" }],
    lines: [{ id: "over-line", purchaseOrderLineId: "po-line-1", receivedQuantity: "6", rejectedQuantity: "0", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a",
      lot: { id: "lot-over", code: "OVER", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" }, inspection: { result: "ACCEPTED", checklistVersion: "inward-v1", notes: "Counted", inspectedByMembershipId: "membership-buyer" } }],
  }, { idempotencyKey: "grn-over" });
  assert.equal(over.body.code, "OVER_RECEIPT");
  assert.deepEqual(inventory.testing.position("item-oil"), before);

  const replayAfterCancel = await buyer.post("/api/v1/procurement/grns", {
    branchId: "branch-delhi", id: "grn-safe", purchaseOrderId: "po-1", supplierDocumentNumber: "SAFE-1", supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/grn/grn-safe-invoice.pdf", checksum: "b".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T11:00:00.000Z" }],
    lines: [{ id: "grn-safe-line", purchaseOrderLineId: "po-line-1", receivedQuantity: "3", rejectedQuantity: "0", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a",
      lot: { id: "lot-safe", code: "SAFE", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" }, inspection: { result: "ACCEPTED", checklistVersion: "inward-v1", notes: "Accepted", inspectedByMembershipId: "membership-buyer" } }],
  }, { idempotencyKey: "grn-safe", now: "2026-09-11T11:00:00.000Z" });
  assert.equal(replayAfterCancel.status, 200);
  assert.equal(replayAfterCancel.body.grn.id, "grn-safe");
  assert.deepEqual(inventory.testing.position("item-oil"), before);

  assert.equal((await api.signIn("restricted").post("/api/v1/procurement/grns", { branchId: "branch-delhi", lines: [{ warehouseId: "warehouse-main" }] }, { idempotencyKey: "restricted-grn" })).body.code, "WAREHOUSE_FORBIDDEN");
  assert.equal((await api.signIn("foreign").get("/api/v1/procurement/purchase-orders?branchId=branch-delhi")).body.items.length, 0);
});

test("authorized purchase return references eligible GRN stock and posts compensating stock and financial evidence once", async () => {
  const { api, inventory } = await seeded();
  const buyer = api.signIn("buyer");
  assert.equal((await buyer.post("/api/v1/procurement/grns", {
    branchId: "branch-delhi", id: "grn-return", purchaseOrderId: "po-1", supplierDocumentNumber: "RET-SOURCE", supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/grn/grn-return.pdf", checksum: "d".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T12:00:00.000Z" }],
    lines: [{ id: "grn-return-line", purchaseOrderLineId: "po-line-1", receivedQuantity: "3", rejectedQuantity: "0", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a",
      lot: { id: "lot-return", code: "RETURN", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" }, inspection: { result: "ACCEPTED", checklistVersion: "inward-v1", notes: "Accepted", inspectedByMembershipId: "membership-buyer" } }],
  }, { idempotencyKey: "grn-return", now: "2026-09-11T12:00:00.000Z" })).status, 201);
  const returnBody = {
    branchId: "branch-delhi", id: "return-1", purchaseOrderId: "po-1", reason: "One sealed can leaking after receipt",
    shipmentEvidence: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/returns/return-1-dispatch.jpg", checksum: "e".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T13:00:00.000Z", kind: "DISPATCH_PROOF" }],
    lines: [{ id: "return-line-1", grnLineId: "grn-return-line", itemId: "item-oil", quantity: "1", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-return" }],
  };
  const submitted = await buyer.post("/api/v1/procurement/purchase-returns", returnBody, { idempotencyKey: "return-create" });
  assert.equal(submitted.status, 202);
  assert.equal(submitted.body.purchaseReturn.status, "APPROVAL_PENDING");
  assert.deepEqual(submitted.body.purchaseReturn.totals, { taxableMinor: "95000", gstMinor: "17100", landedCostMinor: "1000", expectedCreditMinor: "113100" });
  assert.equal((await buyer.post("/api/v1/procurement/purchase-returns/return-1/approval", { branchId: "branch-delhi", decision: "APPROVE", reason: "Self" }, { ifMatch: 1, idempotencyKey: "return-self" })).body.code, "PERMISSION_DENIED");
  const approved = await api.signIn("manager").post("/api/v1/procurement/purchase-returns/return-1/approval", { branchId: "branch-delhi", decision: "APPROVE", reason: "Damage and dispatch verified" }, { ifMatch: 1, idempotencyKey: "return-approve", now: "2026-09-11T13:10:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.purchaseReturn.status, "APPROVED_POSTED");
  assert.deepEqual(approved.body.financialEvent, { type: "PURCHASE_RETURN_CREDIT_EXPECTED", amountMinor: "113100", gstMinor: "17100", sourceId: "return-1", compensating: true });
  assert.deepEqual(inventory.testing.position("item-oil"), { locationQuantityBase: "10000", inTransitQuantityBase: "0", totalQuantityBase: "10000", totalValueMinor: "192000" });
  const replay = await api.signIn("manager").post("/api/v1/procurement/purchase-returns/return-1/approval", { branchId: "branch-delhi", decision: "APPROVE", reason: "Damage and dispatch verified" }, { ifMatch: 1, idempotencyKey: "return-approve", now: "2026-09-11T13:10:00.000Z" });
  assert.equal(replay.status, 200);
  assert.equal(inventory.testing.ledger().filter((entry) => entry.sourceType === "PURCHASE_RETURN").length, 2);
  const excessive = await buyer.post("/api/v1/procurement/purchase-returns", { ...returnBody, id: "return-too-much", lines: [{ ...returnBody.lines[0], id: "too-much", quantity: "3" }], shipmentEvidence: [{ ...returnBody.shipmentEvidence[0], privateObjectRef: "tenant-north/branch-delhi/private/procurement/returns/return-too-much.jpg" }] }, { idempotencyKey: "return-too-much" });
  assert.equal(excessive.body.code, "RETURN_EXCEEDS_RECEIVED");
  assert.ok(api.testing.history().some((entry) => entry.entityType === "PURCHASE_RETURN" && entry.action === "APPROVED_AND_POSTED"));
  assert.deepEqual(api.testing.approvals().filter((entry) => entry.entityType === "PURCHASE_RETURN").map((entry) => ({ maker: entry.makerMembershipId, checker: entry.checkerMembershipId, decision: entry.decision })), [{ maker: "membership-buyer", checker: "membership-manager", decision: "APPROVE" }]);
  assert.deepEqual(api.testing.financialEvents().at(-1), { type: "PURCHASE_RETURN_CREDIT_EXPECTED", sourceId: "return-1", amountMinor: "113100", gstMinor: "17100", compensating: true, auditReference: approved.body.auditReference, occurredAt: "2026-09-11T13:10:00.000Z" });
});

test("concurrent GRNs serialize remaining PO quantity and duplicate in-flight commands have one procurement effect", async () => {
  const { api, inventory } = await seeded();
  const buyer = api.signIn("buyer");
  const grn = (id: string, lot: string, key: string) => buyer.post("/api/v1/procurement/grns", {
    branchId: "branch-delhi", id, purchaseOrderId: "po-1", supplierDocumentNumber: id.toUpperCase(), supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: `tenant-north/branch-delhi/private/procurement/grn/${id}.pdf`, checksum: "f".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T14:00:00.000Z" }],
    lines: [{ id: `${id}-line`, purchaseOrderLineId: "po-line-1", receivedQuantity: "6", rejectedQuantity: "0", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a",
      lot: { id: lot, code: lot, expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" }, inspection: { result: "ACCEPTED", checklistVersion: "inward-v1", notes: "Accepted", inspectedByMembershipId: "membership-buyer" } }],
  }, { idempotencyKey: key, now: "2026-09-11T14:00:00.000Z" });
  const competing = await Promise.all([grn("grn-concurrent-a", "lot-concurrent-a", "grn-concurrent-a"), grn("grn-concurrent-b", "lot-concurrent-b", "grn-concurrent-b")]);
  assert.deepEqual(competing.map((entry) => entry.status).sort(), [201, 409]);
  assert.equal(competing.find((entry) => entry.status === 409)?.body.code, "OVER_RECEIPT");
  assert.equal(inventory.testing.position("item-oil").totalQuantityBase, "30000");

  const fresh = await seeded();
  const same = (fresh.api.signIn("buyer") as any);
  const sameBody = { branchId: "branch-delhi", id: "grn-same", purchaseOrderId: "po-1", supplierDocumentNumber: "SAME", supplierDocumentDate: "2026-09-11",
    documents: [{ privateObjectRef: "tenant-north/branch-delhi/private/procurement/grn/grn-same.pdf", checksum: "1".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T14:00:00.000Z" }],
    lines: [{ id: "same-line", purchaseOrderLineId: "po-line-1", receivedQuantity: "1", rejectedQuantity: "0", uom: "CAN", warehouseId: "warehouse-main", binId: "bin-a", lot: { id: "lot-same", code: "SAME", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" }, inspection: { result: "ACCEPTED", checklistVersion: "inward-v1", notes: "Accepted", inspectedByMembershipId: "membership-buyer" } }],
  };
  const duplicates = await Promise.all([same.post("/api/v1/procurement/grns", sameBody, { idempotencyKey: "same-key" }), same.post("/api/v1/procurement/grns", sameBody, { idempotencyKey: "same-key" })]);
  assert.deepEqual(duplicates.map((entry: any) => entry.status).sort(), [200, 201]);
  assert.equal(fresh.api.testing.grns().filter((entry) => entry.id === "grn-same").length, 1);
  assert.equal(fresh.inventory.testing.position("item-oil").totalQuantityBase, "5000");
});

test("PostgreSQL procurement contract forces scoped RLS, exact constraints, serialized posting and append-only correction", () => {
  const sql = readFileSync(new URL("../db/migrations/014_procurement_workflow.sql", import.meta.url), "utf8");
  for (const table of ["supplier", "supplier_contact", "supplier_address", "supplier_item_relation", "purchase_requisition", "purchase_requisition_line", "purchase_order", "purchase_order_line", "purchase_order_landed_cost", "goods_receipt", "goods_receipt_line", "goods_receipt_document", "goods_receipt_discrepancy", "purchase_return", "purchase_return_line", "purchase_return_evidence", "procurement_history", "procurement_approval", "procurement_financial_event", "procurement_command_receipt"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
    assert.match(sql, new RegExp(`CREATE POLICY ${table}_isolation`));
  }
  assert.match(sql, /numeric\(24, 6\)/i);
  assert.match(sql, /amount_minor bigint/i);
  assert.match(sql, /accepted_quantity \+ rejected_quantity = received_quantity/i);
  assert.match(sql, /received_quantity \+ cancelled_quantity <= ordered_quantity/i);
  assert.match(sql, /FOR UPDATE/i);
  assert.match(sql, /workshopos\.post_procurement_grn/i);
  assert.match(sql, /workshopos\.post_inventory_receipt/i);
  assert.match(sql, /UNIQUE \(tenant_id, purchase_order_id, supplier_document_number\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(sql, /payload_fingerprint/i);
  assert.match(sql, /workshopos\.reject_append_only_mutation/i);
  assert.match(sql, /CREATE TRIGGER procurement_history_append_only/i);
  assert.match(sql, /CREATE TRIGGER procurement_financial_event_append_only/i);
  assert.match(sql, /CREATE TRIGGER goods_receipt_line_append_only/i);
  assert.match(sql, /CREATE TRIGGER purchase_return_line_append_only/i);
  assert.doesNotMatch(sql, /ON DELETE CASCADE/i);
});
