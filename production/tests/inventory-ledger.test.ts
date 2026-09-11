import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createLocalInventoryApi, type InventoryMembership } from "../src/inventory-ledger.js";

const memberships: Record<string, InventoryMembership> = {
  store: {
    identityId: "identity-store", membershipId: "membership-store", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main", "warehouse-detail"],
    permissions: ["inventory.master.manage", "inventory.receive", "inventory.move", "inventory.count", "inventory.adjust.approve"],
  },
  manager: {
    identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main", "warehouse-detail"],
    permissions: ["inventory.view", "inventory.adjust.approve"],
  },
  restricted: {
    identityId: "identity-restricted", membershipId: "membership-restricted", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-detail"], permissions: ["inventory.receive", "inventory.view"],
  },
  foreign: {
    identityId: "identity-foreign", membershipId: "membership-foreign", tenantId: "tenant-south",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], permissions: ["inventory.view", "inventory.receive"],
  },
};

const warehouses = [
  { id: "warehouse-main", tenantId: "tenant-north", branchId: "branch-delhi", name: "Main Store", binIds: ["bin-a", "bin-b"] },
  { id: "warehouse-detail", tenantId: "tenant-north", branchId: "branch-delhi", name: "Detail Bay Store", binIds: ["bin-d"] },
];

async function seededApi() {
  const api = createLocalInventoryApi({ memberships, warehouses });
  const store = api.signIn("store");
  const item = await store.post("/api/v1/inventory/items", {
    branchId: "branch-delhi", id: "item-shampoo", categoryId: "category-consumables", sku: "SHAMP-5L",
    barcodes: ["890100000001"], baseUom: "ML", stockUom: "ML", purchaseUom: "CAN", issueUom: "ML",
    conversions: [{ fromUom: "CAN", toUom: "ML", numerator: "5000", denominator: "1" }],
    costingMethod: "MOVING_AVERAGE", taxCode: "GST18", reorderPoint: "1000", active: true,
    tracking: "LOT", fefoRequired: true,
  }, { idempotencyKey: "item-shampoo" });
  assert.equal(item.status, 201);
  return api;
}

test("authorized receipt posts balanced exact quantity/value once and returns auditable location and lot balance", async () => {
  const api = await seededApi();
  const store = api.signIn("store");
  const response = await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "opening-1", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: {
      id: "lot-shampoo-1", code: "SH-SEP-26", manufacturedAt: "2026-08-01T00:00:00.000Z",
      expiresAt: "2027-02-01T00:00:00.000Z", status: "AVAILABLE",
    }, quantity: "2", uom: "CAN", valueMinor: "300000", reason: "Verified opening stock",
  }, { idempotencyKey: "receipt-opening-1", now: "2026-09-11T09:00:00.000Z" });
  assert.equal(response.status, 201);
  assert.equal(response.body.quantityBase, "10000");
  assert.equal(response.body.valueMinor, "300000");
  assert.match(String(response.body.auditReference), /^audit-tenant-north-/);

  const replay = await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "opening-1", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: {
      id: "lot-shampoo-1", code: "SH-SEP-26", manufacturedAt: "2026-08-01T00:00:00.000Z",
      expiresAt: "2027-02-01T00:00:00.000Z", status: "AVAILABLE",
    }, quantity: "2", uom: "CAN", valueMinor: "300000", reason: "Verified opening stock",
  }, { idempotencyKey: "receipt-opening-1", now: "2026-09-11T09:00:00.000Z" });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.auditReference, response.body.auditReference);
  const conflictingReplay = await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "opening-1", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: {
      id: "lot-shampoo-1", code: "SH-SEP-26", manufacturedAt: "2026-08-01T00:00:00.000Z",
      expiresAt: "2027-02-01T00:00:00.000Z", status: "AVAILABLE",
    }, quantity: "3", uom: "CAN", valueMinor: "300000", reason: "Verified opening stock",
  }, { idempotencyKey: "receipt-opening-1", now: "2026-09-11T09:00:00.000Z" });
  assert.equal(conflictingReplay.status, 409);
  assert.equal(conflictingReplay.body.code, "IDEMPOTENCY_KEY_REUSED");

  const balance = await store.get("/api/v1/inventory/balances?branchId=branch-delhi&warehouseId=warehouse-main&itemId=item-shampoo");
  assert.equal(balance.status, 200);
  assert.deepEqual(balance.body.balances, [{
    tenantId: "tenant-north", branchId: "branch-delhi", warehouseId: "warehouse-main", binId: "bin-a",
    itemId: "item-shampoo", lotId: "lot-shampoo-1", remnantId: null, quantityBase: "10000", valueMinor: "300000",
  }]);
  const ledger = api.testing.ledger();
  assert.equal(ledger.length, 2);
  assert.equal(ledger.reduce((sum, entry) => sum + BigInt(entry.quantityBase), 0n), 0n);
  assert.equal(ledger.reduce((sum, entry) => sum + BigInt(entry.valueMinor), 0n), 0n);
  assert.deepEqual(ledger.map((entry) => entry.account), ["INVENTORY_CONTROL", "LOCATION_STOCK"]);
  assert.ok(ledger.every((entry) => entry.sourceId === "opening-1" && entry.actorMembershipId === "membership-store" && entry.reason === "Verified opening stock"));
});

test("item identity, exact UOM, location authority, lot status, expiry and FEFO are enforced", async () => {
  const api = await seededApi();
  const store = api.signIn("store");
  const restricted = api.signIn("restricted");
  const receipt = (key: string, overrides: Record<string, unknown> = {}) => store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: key, itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: { id: `lot-${key}`, code: key,
      manufacturedAt: "2026-01-01T00:00:00.000Z", expiresAt: "2027-01-01T00:00:00.000Z", status: "AVAILABLE" },
    quantity: "1", uom: "CAN", valueMinor: "100000", reason: "Opening receipt", ...overrides,
  }, { idempotencyKey: key, now: "2026-09-11T09:00:00.000Z" });

  assert.equal((await receipt("bad-uom", { uom: "BOX" })).body.code, "INVALID_UOM_CONVERSION");
  assert.equal((await receipt("fraction-not-exact", { quantity: "0.0000001" })).body.code, "INVALID_UOM_CONVERSION");
  assert.equal((await receipt("expired", { lot: { id: "lot-expired", code: "OLD", expiresAt: "2026-09-01T00:00:00.000Z", status: "AVAILABLE" } })).body.code, "LOT_EXPIRED");
  assert.equal((await receipt("blocked", { lot: { id: "lot-blocked", code: "HOLD", expiresAt: "2027-01-01T00:00:00.000Z", status: "QUARANTINED" } })).body.code, "LOT_STATUS_BLOCKED");
  assert.equal((await restricted.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "unauthorized", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", quantity: "1", uom: "CAN", valueMinor: "1", reason: "Should fail",
  }, { idempotencyKey: "unauthorized" })).body.code, "WAREHOUSE_FORBIDDEN");
  assert.equal((await api.signIn("foreign").get("/api/v1/inventory/balances?branchId=branch-delhi&warehouseId=warehouse-main")).body.code, "WAREHOUSE_NOT_FOUND");

  await receipt("early", { lot: { id: "lot-early", code: "EARLY", expiresAt: "2026-12-01T00:00:00.000Z", status: "AVAILABLE" } });
  await receipt("later", { lot: { id: "lot-later", code: "LATER", expiresAt: "2027-02-01T00:00:00.000Z", status: "AVAILABLE" } });
  const skipped = await store.post("/api/v1/inventory/withdrawals", {
    branchId: "branch-delhi", sourceType: "AUTHORIZED_STOCK_REASON", sourceId: "withdraw-1", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-later", quantity: "100", uom: "ML", reason: "Sample use",
  }, { idempotencyKey: "withdraw-later" });
  assert.equal(skipped.body.code, "FEFO_EXCEPTION_REASON_REQUIRED");
  const exception = await store.post("/api/v1/inventory/withdrawals", {
    branchId: "branch-delhi", sourceType: "AUTHORIZED_STOCK_REASON", sourceId: "withdraw-1", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-later", quantity: "100", uom: "ML", reason: "Sample use",
    fefoExceptionReason: "Earlier lot reserved for stability investigation",
  }, { idempotencyKey: "withdraw-later-reasoned" });
  assert.equal(exception.status, 201);
  assert.equal(exception.body.quantityBase, "-100");
  assert.equal(exception.body.valueMinor, "-2000");
  assert.equal(api.testing.ledger().at(-1)?.reason, "Sample use; FEFO exception: Earlier lot reserved for stability investigation");
});

test("concurrent withdrawals serialize exact availability so overspend has one winner", async () => {
  const api = await seededApi();
  const store = api.signIn("store");
  await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "single", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: { id: "lot-single", code: "ONE", expiresAt: "2027-01-01T00:00:00.000Z", status: "AVAILABLE" },
    quantity: "100", uom: "ML", valueMinor: "3000", reason: "Opening",
  }, { idempotencyKey: "one-receipt", now: "2026-09-11T09:00:00.000Z" });
  const withdraw = (id: string) => store.post("/api/v1/inventory/withdrawals", {
    branchId: "branch-delhi", sourceType: "AUTHORIZED_STOCK_REASON", sourceId: id, itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-single", quantity: "75", uom: "ML", reason: "Authorized sample",
  }, { idempotencyKey: id, now: "2026-09-11T09:01:00.000Z" });
  const results = await Promise.all([withdraw("take-a"), withdraw("take-b")]);
  assert.deepEqual(results.map((result) => result.status).sort(), [201, 409]);
  assert.equal(results.find((result) => result.status === 409)?.body.code, "INSUFFICIENT_STOCK");
});

test("roll cuts conserve area/value, create traceable usable remnants, and require reasoned scrap below minimum", async () => {
  const api = createLocalInventoryApi({ memberships, warehouses });
  const store = api.signIn("store");
  assert.equal((await store.post("/api/v1/inventory/items", {
    branchId: "branch-delhi", id: "item-film", categoryId: "category-film", sku: "PPF-100X20", barcodes: ["PPF10020"],
    baseUom: "MM2", stockUom: "MM2", purchaseUom: "MM2", issueUom: "MM2", conversions: [],
    costingMethod: "FIFO", taxCode: "GST18", reorderPoint: "500", active: true, tracking: "ROLL", fefoRequired: false,
  }, { idempotencyKey: "item-film" })).status, 201);
  assert.equal((await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "roll-open", itemId: "item-film",
    warehouseId: "warehouse-main", binId: "bin-b", lot: { id: "lot-film", code: "FILM-SEP", status: "AVAILABLE" },
    roll: { id: "roll-1", length: "100", width: "20", minimumUseLength: "10" },
    quantity: "2000", uom: "MM2", valueMinor: "10000", reason: "Measured opening roll",
  }, { idempotencyKey: "roll-receipt" })).status, 201);

  const cut = await store.post("/api/v1/inventory/rolls/roll-1/cuts", {
    branchId: "branch-delhi", warehouseId: "warehouse-main", binId: "bin-b", cutLength: "70",
    sourceType: "AUTHORIZED_STOCK_REASON", sourceId: "sample-cut", reason: "Training sample", remnantId: "remnant-1",
  }, { ifMatch: 1, idempotencyKey: "roll-cut-1", now: "2026-09-11T11:00:00.000Z" });
  assert.equal(cut.status, 201);
  assert.deepEqual(cut.body.cut, { quantityBase: "1400", valueMinor: "7000" });
  assert.deepEqual(cut.body.remnant, {
    id: "remnant-1", parentRollId: "roll-1", parentRemnantId: null, length: "30", width: "20",
    quantityBase: "600", valueMinor: "3000", usable: true, resourceVersion: 1,
  });

  const tooSmall = await store.post("/api/v1/inventory/rolls/remnant-1/cuts", {
    branchId: "branch-delhi", warehouseId: "warehouse-main", binId: "bin-b", cutLength: "25",
    sourceType: "AUTHORIZED_STOCK_REASON", sourceId: "second-cut", reason: "Patch", remnantId: "remnant-tiny",
  }, { ifMatch: 1, idempotencyKey: "roll-cut-small" });
  assert.equal(tooSmall.body.code, "SCRAP_REMAINDER_REASON_REQUIRED");
  const finalCut = await store.post("/api/v1/inventory/rolls/remnant-1/cuts", {
    branchId: "branch-delhi", warehouseId: "warehouse-main", binId: "bin-b", cutLength: "25",
    sourceType: "AUTHORIZED_STOCK_REASON", sourceId: "second-cut", reason: "Patch", remnantId: "remnant-tiny",
    scrapRemainderReason: "Remaining 5mm is below configured minimum",
  }, { ifMatch: 1, idempotencyKey: "roll-cut-small-reasoned", now: "2026-09-11T11:05:00.000Z" });
  assert.equal(finalCut.status, 201);
  assert.deepEqual(finalCut.body.cut, { quantityBase: "500", valueMinor: "2500" });
  assert.deepEqual(finalCut.body.scrap, { quantityBase: "100", valueMinor: "500", reason: "Remaining 5mm is below configured minimum" });
  assert.equal(finalCut.body.remnant, null);
  const lineage = api.testing.rolls();
  assert.equal(lineage.find((roll) => roll.id === "remnant-1")?.parentRollId, "roll-1");
  assert.equal(lineage.find((roll) => roll.id === "remnant-1")?.status, "CUT");
  const all = api.testing.ledger();
  assert.equal(all.reduce((sum, entry) => sum + BigInt(entry.quantityBase), 0n), 0n);
  assert.equal(all.reduce((sum, entry) => sum + BigInt(entry.valueMinor), 0n), 0n);
  assert.ok(all.some((entry) => entry.sourceType === "ROLL_REMNANT" && entry.remnantId === "remnant-1"));
  assert.ok(all.some((entry) => entry.sourceType === "ROLL_SCRAP" && /below configured minimum/.test(entry.reason)));
});

test("transfer dispatch, in-transit, discrepant receipt and independent resolution never double count stock", async () => {
  const api = await seededApi();
  const store = api.signIn("store");
  await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "transfer-stock", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: { id: "lot-transfer", code: "TRANSFER", expiresAt: "2027-01-01T00:00:00.000Z", status: "AVAILABLE" },
    quantity: "1000", uom: "ML", valueMinor: "20000", reason: "Opening transfer stock",
  }, { idempotencyKey: "transfer-stock", now: "2026-09-11T09:00:00.000Z" });
  const created = await store.post("/api/v1/inventory/transfers", {
    branchId: "branch-delhi", id: "transfer-1", sourceWarehouseId: "warehouse-main", sourceBinId: "bin-a",
    destinationWarehouseId: "warehouse-detail", destinationBinId: "bin-d", itemId: "item-shampoo", lotId: "lot-transfer",
    quantity: "500", uom: "ML", reason: "Replenish detailing store",
  }, { idempotencyKey: "transfer-create" });
  assert.equal(created.status, 201);
  const dispatch = await store.post("/api/v1/inventory/transfers/transfer-1/dispatch", {
    branchId: "branch-delhi", evidence: {
      privateObjectRef: "tenant-north/branch-delhi/private/inventory/transfers/transfer-1-dispatch.jpg",
      checksum: "a".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T10:00:00.000Z",
    }, reason: "Sealed and handed to runner",
  }, { ifMatch: 1, idempotencyKey: "transfer-dispatch", now: "2026-09-11T10:00:00.000Z" });
  assert.equal(dispatch.status, 200);
  assert.equal(dispatch.body.transfer.status, "IN_TRANSIT");
  assert.equal((await store.post("/api/v1/inventory/transfers/transfer-1/dispatch", {
    branchId: "branch-delhi", evidence: dispatch.body.transfer.dispatchEvidence, reason: "again",
  }, { ifMatch: 2, idempotencyKey: "transfer-dispatch-again" })).body.code, "TRANSFER_NOT_DISPATCHABLE");
  assert.deepEqual(api.testing.position("item-shampoo"), { locationQuantityBase: "500", inTransitQuantityBase: "500", totalQuantityBase: "1000", totalValueMinor: "20000" });

  const received = await store.post("/api/v1/inventory/transfers/transfer-1/receive", {
    branchId: "branch-delhi", receivedQuantity: "450", uom: "ML", reason: "Seal torn; measured short",
    evidence: { privateObjectRef: "tenant-north/branch-delhi/private/inventory/transfers/transfer-1-receipt.jpg",
      checksum: "b".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T10:20:00.000Z" },
  }, { ifMatch: 2, idempotencyKey: "transfer-receive", now: "2026-09-11T10:20:00.000Z" });
  assert.equal(received.status, 202);
  assert.equal(received.body.transfer.status, "RECEIPT_DISCREPANCY");
  assert.deepEqual(received.body.transfer.discrepancy, { quantityBase: "50", valueMinor: "1000", status: "OPEN", reason: "Seal torn; measured short" });
  assert.deepEqual(api.testing.position("item-shampoo"), { locationQuantityBase: "950", inTransitQuantityBase: "50", totalQuantityBase: "1000", totalValueMinor: "20000" });

  const selfResolve = await store.post("/api/v1/inventory/transfers/transfer-1/discrepancy-resolution", {
    branchId: "branch-delhi", action: "RETURN_TO_SOURCE", reason: "Runner returned short quantity",
    evidence: { privateObjectRef: "tenant-north/branch-delhi/private/inventory/transfers/transfer-1-return.jpg",
      checksum: "c".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T10:30:00.000Z" },
  }, { ifMatch: 3, idempotencyKey: "self-resolution" });
  assert.equal(selfResolve.body.code, "MAKER_CANNOT_CHECK");
  const resolved = await api.signIn("manager").post("/api/v1/inventory/transfers/transfer-1/discrepancy-resolution", {
    branchId: "branch-delhi", action: "RETURN_TO_SOURCE", reason: "Verified physical return to Main Store",
    evidence: { privateObjectRef: "tenant-north/branch-delhi/private/inventory/transfers/transfer-1-return.jpg",
      checksum: "c".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T10:30:00.000Z" },
  }, { ifMatch: 3, idempotencyKey: "manager-resolution", now: "2026-09-11T10:30:00.000Z" });
  assert.equal(resolved.status, 200);
  assert.equal(resolved.body.transfer.status, "COMPLETED_WITH_DISCREPANCY");
  assert.deepEqual(api.testing.position("item-shampoo"), { locationQuantityBase: "1000", inTransitQuantityBase: "0", totalQuantityBase: "1000", totalValueMinor: "20000" });
  assert.equal(resolved.body.transfer.dispatchEvidence.checksum, "a".repeat(64));
  assert.equal(resolved.body.transfer.receiptEvidence.checksum, "b".repeat(64));
  assert.equal(resolved.body.transfer.resolutionEvidence.checksum, "c".repeat(64));
});

test("blind count freezes scope, requires recount and investigation, then independent approval posts compensation", async () => {
  const api = await seededApi();
  const store = api.signIn("store");
  await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "count-stock", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: { id: "lot-count", code: "COUNT", expiresAt: "2027-01-01T00:00:00.000Z", status: "AVAILABLE" },
    quantity: "100", uom: "ML", valueMinor: "2000", reason: "Opening count stock",
  }, { idempotencyKey: "count-stock", now: "2026-09-11T09:00:00.000Z" });
  const created = await store.post("/api/v1/inventory/counts", {
    branchId: "branch-delhi", id: "count-1", warehouseId: "warehouse-main", binId: "bin-a",
    scope: [{ itemId: "item-shampoo", lotId: "lot-count", remnantId: null }], reason: "Weekly blind cycle count",
  }, { idempotencyKey: "count-create", now: "2026-09-11T12:00:00.000Z" });
  assert.equal(created.status, 201);
  assert.equal(created.body.count.status, "COUNTING");
  assert.equal("expectedQuantityBase" in created.body.count.lines[0], false);
  assert.equal((await store.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", sourceType: "OPENING_STOCK", sourceId: "frozen-attempt", itemId: "item-shampoo",
    warehouseId: "warehouse-main", binId: "bin-a", lot: { id: "lot-count", code: "COUNT", expiresAt: "2027-01-01T00:00:00.000Z", status: "AVAILABLE" },
    quantity: "1", uom: "ML", valueMinor: "20", reason: "Should be frozen",
  }, { idempotencyKey: "frozen-attempt" })).body.code, "COUNT_SCOPE_FROZEN");

  const first = await store.post("/api/v1/inventory/counts/count-1/entries", {
    branchId: "branch-delhi", itemId: "item-shampoo", lotId: "lot-count", remnantId: null,
    quantity: "90", uom: "ML",
  }, { ifMatch: 1, idempotencyKey: "count-entry-1" });
  assert.equal(first.status, 201);
  assert.equal("expectedQuantityBase" in first.body.entry, false);
  const submitted = await store.post("/api/v1/inventory/counts/count-1/submit", {
    branchId: "branch-delhi", reason: "First pass completed",
  }, { ifMatch: 2, idempotencyKey: "count-submit-1" });
  assert.equal(submitted.body.count.status, "RECOUNT_REQUIRED");
  const recount = await store.post("/api/v1/inventory/counts/count-1/recounts", {
    branchId: "branch-delhi", reason: "Variance exceeds zero tolerance",
  }, { ifMatch: 3, idempotencyKey: "count-recount" });
  assert.equal(recount.body.count.round, 2);
  await store.post("/api/v1/inventory/counts/count-1/entries", {
    branchId: "branch-delhi", itemId: "item-shampoo", lotId: "lot-count", remnantId: null,
    quantity: "92", uom: "ML",
  }, { ifMatch: 4, idempotencyKey: "count-entry-2" });
  const resubmitted = await store.post("/api/v1/inventory/counts/count-1/submit", {
    branchId: "branch-delhi", reason: "Independent physical recount completed",
  }, { ifMatch: 5, idempotencyKey: "count-submit-2" });
  assert.equal(resubmitted.body.count.status, "INVESTIGATION_REQUIRED");
  const investigated = await store.post("/api/v1/inventory/counts/count-1/investigation", {
    branchId: "branch-delhi", reason: "Eight ml likely lost during decanting; no unposted movement found",
    evidence: { privateObjectRef: "tenant-north/branch-delhi/private/inventory/counts/count-1-investigation.jpg",
      checksum: "d".repeat(64), scanStatus: "CLEAN", capturedAt: "2026-09-11T12:30:00.000Z" },
  }, { ifMatch: 6, idempotencyKey: "count-investigation" });
  assert.equal(investigated.body.count.status, "ADJUSTMENT_PENDING");
  assert.deepEqual(investigated.body.count.variance, { quantityBase: "-8", valueMinor: "-160" });
  assert.equal((await store.post("/api/v1/inventory/counts/count-1/adjustment-approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Self approval should fail",
  }, { ifMatch: 7, idempotencyKey: "count-self-approve" })).body.code, "MAKER_CANNOT_CHECK");
  const approved = await api.signIn("manager").post("/api/v1/inventory/counts/count-1/adjustment-approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Reviewed both counts and investigation evidence",
  }, { ifMatch: 7, idempotencyKey: "count-manager-approve", now: "2026-09-11T12:40:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.count.status, "RECONCILED");
  assert.equal(approved.body.count.approval.checkerMembershipId, "membership-manager");
  assert.deepEqual(api.testing.position("item-shampoo"), { locationQuantityBase: "92", inTransitQuantityBase: "0", totalQuantityBase: "92", totalValueMinor: "1840" });
  const adjustment = api.testing.ledger().filter((entry) => entry.sourceType === "STOCK_COUNT_ADJUSTMENT");
  assert.equal(adjustment.length, 2);
  assert.equal(adjustment.reduce((sum, entry) => sum + BigInt(entry.quantityBase), 0n), 0n);
  assert.ok(adjustment.every((entry) => entry.reason === "Reviewed both counts and investigation evidence"));
});

test("PostgreSQL contract forces scoped RLS, exact balanced posting, append-only evidence, concurrency and idempotency", () => {
  const sql = readFileSync(new URL("../db/migrations/013_inventory_ledger.sql", import.meta.url), "utf8");
  for (const table of ["inventory_warehouse", "inventory_bin", "inventory_item", "inventory_item_uom_conversion", "inventory_lot",
    "inventory_roll_piece", "inventory_balance", "inventory_ledger_batch", "inventory_ledger_entry", "stock_transfer",
    "stock_transfer_evidence", "stock_count", "stock_count_scope", "stock_count_entry", "inventory_command_receipt"]) {
    assert.match(sql, new RegExp(`CREATE TABLE workshopos\\.${table}`));
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
  }
  assert.match(sql, /numeric\(38, 6\)/);
  assert.match(sql, /quantity_base.*value_minor.*source_type.*source_id.*actor_membership_id.*reason.*audit_reference/is);
  assert.match(sql, /CREATE CONSTRAINT TRIGGER inventory_ledger_batch_balanced/is);
  assert.match(sql, /sum\(quantity_base\).*sum\(value_minor\)/is);
  assert.match(sql, /inventory ledger evidence is append-only/);
  assert.match(sql, /UPDATE workshopos\.inventory_balance[\s\S]*quantity_base >= p_quantity_base/);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/);
  assert.match(sql, /maker_membership_id <> checker_membership_id/);
  assert.match(sql, /status IN \('READY', 'IN_TRANSIT', 'RECEIVED', 'RECEIPT_DISCREPANCY', 'COMPLETED_WITH_DISCREPANCY'\)/);
});
