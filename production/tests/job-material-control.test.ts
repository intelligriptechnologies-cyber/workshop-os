import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createLocalInventoryApi, type InventoryMembership } from "../src/inventory-ledger.js";
import {
  createLocalJobMaterialControlApi,
  type JobMaterialMembership,
} from "../src/job-material-control.js";

const memberships: Record<string, JobMaterialMembership & InventoryMembership> = {
  technician: {
    identityId: "identity-tech", membershipId: "membership-tech", technicianId: "tech-a", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], warehouseIds: [], roles: ["TECHNICIAN"],
    permissions: ["material.request", "material.outcome.record", "material.reconcile"],
  },
  store: {
    identityId: "identity-store", membershipId: "membership-store", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], roles: ["STORE"],
    permissions: ["material.issue", "material.return.verify", "material.view", "inventory.master.manage", "inventory.receive", "inventory.move", "inventory.view"],
  },
  manager: {
    identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], roles: ["MANAGER"],
    permissions: ["material.approve", "material.view", "inventory.receive", "inventory.view"],
  },
  foreign: {
    identityId: "identity-foreign", membershipId: "membership-foreign", tenantId: "tenant-south",
    branchIds: ["branch-delhi"], warehouseIds: ["warehouse-main"], roles: ["STORE"],
    permissions: ["material.issue", "material.view", "inventory.move", "inventory.view"],
  },
};

const approvedScope = {
  id: "material-handoff-1", activationId: "activation-1", eventType: "APPROVED_SCOPE_MATERIAL_CONTROL" as const,
  tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", jobState: "ACTIVE" as const,
  snapshot: { RECIPE: { masterId: "recipe-detail", version: 4 }, POLICY: { masterId: "material-policy", version: 2 } },
  lines: [{ id: "estimate-material-1", itemId: "item-oil", quantity: "2", uom: "L" }],
  occurredAt: "2026-09-11T08:00:00.000Z",
};

const taskAssignment = {
  id: "assignment-ready-1", type: "S12_TASK_ASSIGNMENT_READY" as const, tenantId: "tenant-north", branchId: "branch-delhi",
  aggregateId: "task-oil", aggregateVersion: 2, occurredAt: "2026-09-11T08:05:00.000Z",
  payload: {
    jobId: "job-42", taskId: "task-oil", taskVersion: 2, technicianIds: ["tech-a"], responsibleTechnicianId: "tech-a",
    checklist: [], dependencies: [], materials: [{ itemId: "item-oil", quantity: "2", uom: "L", recipeVersion: 4 }],
  },
};

const evidence = (name: string) => ({
  privateObjectRef: `tenant-north/branch-delhi/private/material/${name}.jpg`, checksum: "a".repeat(64),
  scanStatus: "CLEAN" as const, capturedAt: "2026-09-11T09:00:00.000Z", kind: "PHOTO" as const,
});

async function seeded() {
  const warehouses = [{ id: "warehouse-main", tenantId: "tenant-north", branchId: "branch-delhi", name: "Main Store", binIds: ["bin-a"] }];
  const inventory = createLocalInventoryApi({ memberships, warehouses });
  const storeInventory = inventory.signIn("store");
  assert.equal((await storeInventory.post("/api/v1/inventory/items", {
    branchId: "branch-delhi", id: "item-oil", categoryId: "fluids", sku: "OIL", barcodes: ["890100000015"],
    baseUom: "ML", stockUom: "L", purchaseUom: "L", issueUom: "L",
    conversions: [{ fromUom: "L", toUom: "ML", numerator: "1000", denominator: "1" }],
    costingMethod: "FIFO", taxCode: "GST18", reorderPoint: "1", active: true, tracking: "LOT", fefoRequired: false,
  }, { idempotencyKey: "seed-item" })).status, 201);
  assert.equal((await storeInventory.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", warehouseId: "warehouse-main", binId: "bin-a", itemId: "item-oil", quantity: "5", uom: "L",
    valueMinor: "50000", lot: { id: "lot-1", code: "LOT-1", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" },
    sourceType: "OPENING", sourceId: "opening-1", reason: "Opening stock",
  }, { idempotencyKey: "seed-stock", now: "2026-09-11T07:00:00.000Z" })).status, 201);
  const api = createLocalJobMaterialControlApi({
    memberships, inventory, approvedScopeEvents: [approvedScope], taskAssignmentEvents: [taskAssignment],
    policies: [{ tenantId: "tenant-north", branchId: "branch-delhi", policyVersion: 2, excessThresholdBps: 0, wasteThresholdBps: 1000, varianceThresholdQuantity: "0" }],
  });
  return { api, inventory };
}

test("approved task demand permits one exact Store issue and blocks reconciliation until every issued unit has an outcome", async () => {
  const { api, inventory } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  const request = await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-1", taskId: "task-oil", reason: "Planned oil service",
    lines: [{ id: "request-line-1", itemId: "item-oil", quantity: "2", uom: "L" }],
  }, { idempotencyKey: "request-1" });
  assert.equal(request.status, 201);
  assert.equal(request.body.request.status, "APPROVED");

  const issueBody = {
    branchId: "branch-delhi", id: "issue-1", requestId: "request-1", requestLineId: "request-line-1",
    taskId: "task-oil", itemId: "item-oil", quantity: "2", uom: "L", warehouseId: "warehouse-main", binId: "bin-a",
    lotId: "lot-1", reason: "Issue approved task material", evidence: [evidence("issue-1")],
    scan: { source: "HARDWARE", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE" },
  };
  const issued = await store.post("/api/v1/material-issues", issueBody, { idempotencyKey: "issue-1" });
  assert.equal(issued.status, 201);
  assert.equal(issued.body.issue.quantityBase, "2000");
  assert.equal((await store.post("/api/v1/material-issues", issueBody, { idempotencyKey: "issue-1" })).status, 200);
  assert.deepEqual(inventory.testing.position("item-oil"), { locationQuantityBase: "3000", inTransitQuantityBase: "0", totalQuantityBase: "3000", totalValueMinor: "30000" });

  const blocked = await technician.post("/api/v1/tasks/task-oil/material-reconciliation", {
    branchId: "branch-delhi", reason: "Attempt before outcomes",
  }, { idempotencyKey: "reconcile-too-soon", ifMatch: 2 });
  assert.equal(blocked.status, 409);
  assert.equal(blocked.body.code, "MATERIAL_NOT_BALANCED");
  assert.deepEqual(blocked.body.totals, { issued: "2", consumed: "0", verifiedReturn: "0", wastage: "0", approvedVariance: "0", difference: "2", uom: "L" });

  const consumed = await technician.post("/api/v1/material-outcomes", {
    branchId: "branch-delhi", id: "outcome-consumed", issueId: "issue-1", taskId: "task-oil", type: "CONSUMED",
    quantity: "2", uom: "L", itemId: "item-oil", lotId: "lot-1", reason: "Installed during service", evidence: [evidence("consumed")],
  }, { idempotencyKey: "consume-1" });
  assert.equal(consumed.status, 201);
  const reconciled = await technician.post("/api/v1/tasks/task-oil/material-reconciliation", {
    branchId: "branch-delhi", reason: "All issued material accounted",
  }, { idempotencyKey: "reconcile-1", ifMatch: 3 });
  assert.equal(reconciled.status, 200);
  assert.equal(reconciled.body.reconciliation.status, "RECONCILED");
  assert.equal(api.testing.reconciliationEvents().length, 1);
  assert.deepEqual(api.testing.reconciliationEvents()[0].payload.consumers, ["S16_QC", "S18_BILLING"]);
});

test("a technician-declared return is counted and restored to its exact S13 lot only after independent Store verification", async () => {
  const { api, inventory } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-return", taskId: "task-oil", reason: "Oil demand",
    lines: [{ id: "request-return-line", itemId: "item-oil", quantity: "2", uom: "L" }],
  }, { idempotencyKey: "request-return" });
  await store.post("/api/v1/material-issues", {
    branchId: "branch-delhi", id: "issue-return", requestId: "request-return", requestLineId: "request-return-line",
    taskId: "task-oil", itemId: "item-oil", quantity: "2", uom: "L", warehouseId: "warehouse-main", binId: "bin-a",
    lotId: "lot-1", reason: "Issue oil", evidence: [evidence("issue-return")],
    scan: { source: "CAMERA", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE" },
  }, { idempotencyKey: "issue-return" });
  const declared = await technician.post("/api/v1/material-outcomes", {
    branchId: "branch-delhi", id: "return-1", issueId: "issue-return", taskId: "task-oil", type: "RETURN",
    quantity: "0.5", uom: "L", itemId: "item-oil", lotId: "lot-1", reason: "Unused sealed oil", evidence: [evidence("return-declared")],
  }, { idempotencyKey: "return-declared" });
  assert.equal(declared.status, 201);
  assert.equal(declared.body.outcome.status, "RETURN_PENDING");
  assert.equal(inventory.testing.position("item-oil").locationQuantityBase, "3000");

  const beforeVerification = await technician.post("/api/v1/tasks/task-oil/material-reconciliation", {
    branchId: "branch-delhi", reason: "Return is not verified",
  }, { idempotencyKey: "reconcile-return-pending", ifMatch: 3 });
  assert.equal(beforeVerification.status, 409);
  assert.equal(beforeVerification.body.totals.verifiedReturn, "0");

  const verified = await store.post("/api/v1/material-outcomes/return-1/return-verification", {
    branchId: "branch-delhi", reason: "Counted and returned to exact bin", evidence: [evidence("return-verified")],
  }, { idempotencyKey: "return-verified", ifMatch: 1 });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.outcome.status, "POSTED");
  assert.equal(verified.body.outcome.verification.membershipId, "membership-store");
  assert.equal(inventory.testing.position("item-oil").locationQuantityBase, "3500");
  assert.equal(inventory.testing.ledger().at(-1)?.sourceType, "JOB_MATERIAL_RETURN");

  const duplicate = await store.post("/api/v1/material-outcomes/return-1/return-verification", {
    branchId: "branch-delhi", reason: "Counted and returned to exact bin", evidence: [evidence("return-verified")],
  }, { idempotencyKey: "return-verified", ifMatch: 1 });
  assert.equal(duplicate.status, 200);
  assert.equal(inventory.testing.position("item-oil").locationQuantityBase, "3500");
});

test("waste above the snapshotted threshold requires a recently authenticated, distinct Manager approval", async () => {
  const { api } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  const manager = api.signIn("manager");
  await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-waste", taskId: "task-oil", reason: "Oil demand",
    lines: [{ id: "request-waste-line", itemId: "item-oil", quantity: "2", uom: "L" }],
  }, { idempotencyKey: "request-waste" });
  await store.post("/api/v1/material-issues", {
    branchId: "branch-delhi", id: "issue-waste", requestId: "request-waste", requestLineId: "request-waste-line",
    taskId: "task-oil", itemId: "item-oil", quantity: "2", uom: "L", warehouseId: "warehouse-main", binId: "bin-a",
    lotId: "lot-1", reason: "Issue oil", evidence: [evidence("issue-waste")],
    scan: { source: "HARDWARE", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE" },
  }, { idempotencyKey: "issue-waste" });
  const pending = await technician.post("/api/v1/material-outcomes", {
    branchId: "branch-delhi", id: "waste-1", issueId: "issue-waste", taskId: "task-oil", type: "WASTAGE",
    quantity: "0.5", uom: "L", itemId: "item-oil", lotId: "lot-1", reason: "Container damaged during service",
    evidence: [evidence("waste")],
  }, { idempotencyKey: "waste-1", now: "2026-09-11T09:10:00.000Z" });
  assert.equal(pending.status, 202);
  assert.equal(pending.body.outcome.status, "APPROVAL_PENDING");

  const staleAuth = await manager.post("/api/v1/material-outcomes/waste-1/approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Evidence confirms unavoidable loss",
  }, { idempotencyKey: "approve-waste-stale", ifMatch: 1, now: "2026-09-11T09:20:00.000Z", reauthenticatedAt: "2026-09-11T08:00:00.000Z" });
  assert.equal(staleAuth.status, 403);
  assert.equal(staleAuth.body.code, "RECENT_AUTHENTICATION_REQUIRED");

  const approved = await manager.post("/api/v1/material-outcomes/waste-1/approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Evidence confirms unavoidable loss",
  }, { idempotencyKey: "approve-waste", ifMatch: 1, now: "2026-09-11T09:20:00.000Z", reauthenticatedAt: "2026-09-11T09:15:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.outcome.status, "POSTED");
  assert.equal(approved.body.outcome.approval.checkerMembershipId, "membership-manager");
  assert.equal(approved.body.outcome.evidence.length, 1);
});

test("excess demand cannot be issued until one distinct Manager wins the recent-auth approval race", async () => {
  const { api } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  const manager = api.signIn("manager");
  const requested = await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-excess", taskId: "task-oil", reason: "Engine requires additional flush",
    lines: [{ id: "request-excess-line", itemId: "item-oil", quantity: "2.5", uom: "L" }],
    excessEvidence: [evidence("excess-demand")],
  }, { idempotencyKey: "request-excess", now: "2026-09-11T09:00:00.000Z" });
  assert.equal(requested.status, 202);
  assert.equal(requested.body.request.status, "APPROVAL_PENDING");

  const blockedIssue = await store.post("/api/v1/material-issues", {
    branchId: "branch-delhi", id: "issue-excess-blocked", requestId: "request-excess", requestLineId: "request-excess-line",
    taskId: "task-oil", itemId: "item-oil", quantity: "0.5", uom: "L", warehouseId: "warehouse-main", binId: "bin-a",
    lotId: "lot-1", reason: "Try before approval", evidence: [evidence("issue-excess-blocked")],
    scan: { source: "MANUAL", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE", fallbackReason: "Scanner unavailable" },
  }, { idempotencyKey: "issue-excess-blocked" });
  assert.equal(blockedIssue.status, 422);
  assert.equal(blockedIssue.body.code, "AUTHORIZED_MATERIAL_DEMAND_REQUIRED");

  const approvalBody = { branchId: "branch-delhi", decision: "APPROVE", reason: "Flush evidence accepted" };
  const [left, right] = await Promise.all([
    manager.post("/api/v1/material-requests/request-excess/approval", approvalBody,
      { idempotencyKey: "approve-excess-left", ifMatch: 1, now: "2026-09-11T09:10:00.000Z", reauthenticatedAt: "2026-09-11T09:09:00.000Z" }),
    manager.post("/api/v1/material-requests/request-excess/approval", approvalBody,
      { idempotencyKey: "approve-excess-right", ifMatch: 1, now: "2026-09-11T09:10:00.000Z", reauthenticatedAt: "2026-09-11T09:09:00.000Z" }),
  ]);
  assert.deepEqual([left.status, right.status].sort(), [200, 409]);
  assert.equal([left, right].find((result) => result.status === 200)?.body.request.approval.checkerMembershipId, "membership-manager");
});

test("an unexplained balance reconciles only through an evidenced, recently authenticated Manager-approved variance", async () => {
  const { api } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  const manager = api.signIn("manager");
  await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-variance", taskId: "task-oil", reason: "Oil demand",
    lines: [{ id: "request-variance-line", itemId: "item-oil", quantity: "2", uom: "L" }],
  }, { idempotencyKey: "request-variance" });
  await store.post("/api/v1/material-issues", {
    branchId: "branch-delhi", id: "issue-variance", requestId: "request-variance", requestLineId: "request-variance-line",
    taskId: "task-oil", itemId: "item-oil", quantity: "2", uom: "L", warehouseId: "warehouse-main", binId: "bin-a",
    lotId: "lot-1", reason: "Issue oil", evidence: [evidence("issue-variance")],
    scan: { source: "HARDWARE", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE" },
  }, { idempotencyKey: "issue-variance" });
  await technician.post("/api/v1/material-outcomes", {
    branchId: "branch-delhi", id: "consume-variance", issueId: "issue-variance", taskId: "task-oil", type: "CONSUMED",
    quantity: "1.9", uom: "L", itemId: "item-oil", lotId: "lot-1", reason: "Measured installation", evidence: [evidence("consume-variance")],
  }, { idempotencyKey: "consume-variance" });

  const variance = await technician.post("/api/v1/tasks/task-oil/material-variance-requests", {
    branchId: "branch-delhi", id: "variance-1", itemId: "item-oil", quantity: "0.1", uom: "L",
    reason: "Measurement loss under investigation", evidence: [evidence("variance")],
  }, { idempotencyKey: "variance-1", now: "2026-09-11T09:20:00.000Z" });
  assert.equal(variance.status, 202);
  assert.equal(variance.body.variance.status, "APPROVAL_PENDING");

  const approved = await manager.post("/api/v1/material-variances/variance-1/approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Investigation and measurement evidence reviewed",
  }, { idempotencyKey: "approve-variance", ifMatch: 1, now: "2026-09-11T09:25:00.000Z", reauthenticatedAt: "2026-09-11T09:24:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.variance.status, "APPROVED");

  const reconciled = await technician.post("/api/v1/tasks/task-oil/material-reconciliation", {
    branchId: "branch-delhi", reason: "Variance closes exact balance",
  }, { idempotencyKey: "reconcile-variance", ifMatch: approved.body.taskResourceVersion });
  assert.equal(reconciled.status, 200);
  assert.deepEqual(reconciled.body.reconciliation.totals, {
    issued: "2", consumed: "1.9", verifiedReturn: "0", wastage: "0", approvedVariance: "0.1", difference: "0", uom: "L",
  });
});

test("concurrent Store issues cannot overdraw one approved demand and partial issues retain exact cumulative authorization", async () => {
  const { api, inventory } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-race", taskId: "task-oil", reason: "Oil demand",
    lines: [{ id: "request-race-line", itemId: "item-oil", quantity: "2", uom: "L" }],
  }, { idempotencyKey: "request-race" });
  const issue = (id: string) => store.post("/api/v1/material-issues", {
    branchId: "branch-delhi", id, requestId: "request-race", requestLineId: "request-race-line", taskId: "task-oil",
    itemId: "item-oil", quantity: "2", uom: "L", warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-1",
    reason: "Issue exact demand", evidence: [evidence(id)],
    scan: { source: "HARDWARE", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE" },
  }, { idempotencyKey: id });
  const [left, right] = await Promise.all([issue("issue-race-left"), issue("issue-race-right")]);
  assert.deepEqual([left.status, right.status].sort(), [201, 409]);
  assert.equal([left, right].find((result) => result.status === 409)?.body.code, "COMMAND_IN_PROGRESS");
  assert.equal(inventory.testing.position("item-oil").locationQuantityBase, "3000");
});

test("a scanned substitute lot needs an evidenced, distinct Manager approval and remains tied to the original demand", async () => {
  const { api, inventory } = await seeded();
  const technician = api.signIn("technician");
  const store = api.signIn("store");
  const manager = api.signIn("manager");
  const stock = inventory.signIn("store");
  assert.equal((await stock.post("/api/v1/inventory/items", {
    branchId: "branch-delhi", id: "item-oil-alt", categoryId: "fluids", sku: "OIL-ALT", barcodes: ["890100000022"],
    baseUom: "ML", stockUom: "L", purchaseUom: "L", issueUom: "L",
    conversions: [{ fromUom: "L", toUom: "ML", numerator: "1000", denominator: "1" }],
    costingMethod: "FIFO", taxCode: "GST18", reorderPoint: "1", active: true, tracking: "LOT", fefoRequired: false,
  }, { idempotencyKey: "seed-alt-item" })).status, 201);
  assert.equal((await stock.post("/api/v1/inventory/receipts", {
    branchId: "branch-delhi", warehouseId: "warehouse-main", binId: "bin-a", itemId: "item-oil-alt", quantity: "2", uom: "L",
    valueMinor: "24000", lot: { id: "lot-alt", code: "LOT-ALT", expiresAt: "2028-01-01T00:00:00.000Z", status: "AVAILABLE" },
    sourceType: "OPENING", sourceId: "opening-alt", reason: "Opening substitute stock",
  }, { idempotencyKey: "seed-alt-stock", now: "2026-09-11T07:00:00.000Z" })).status, 201);
  await technician.post("/api/v1/jobs/job-42/material-requests", {
    branchId: "branch-delhi", id: "request-substitute", taskId: "task-oil", reason: "Oil demand",
    lines: [{ id: "request-substitute-line", itemId: "item-oil", quantity: "2", uom: "L" }],
  }, { idempotencyKey: "request-substitute" });

  const proposed = await store.post("/api/v1/material-requests/request-substitute/substitutions", {
    branchId: "branch-delhi", id: "substitution-1", requestLineId: "request-substitute-line", substituteItemId: "item-oil-alt",
    quantity: "1", uom: "L", reason: "Approved grade unavailable in requested brand", evidence: [evidence("substitution")],
  }, { idempotencyKey: "substitution-1" });
  assert.equal(proposed.status, 202);
  const approved = await manager.post("/api/v1/material-substitutions/substitution-1/approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Equivalent grade and tax treatment verified",
  }, { idempotencyKey: "approve-substitution", ifMatch: 1, now: "2026-09-11T09:10:00.000Z", reauthenticatedAt: "2026-09-11T09:09:00.000Z" });
  assert.equal(approved.status, 200);

  const issued = await store.post("/api/v1/material-issues", {
    branchId: "branch-delhi", id: "issue-substitute", requestId: "request-substitute", requestLineId: "request-substitute-line",
    substitutionId: "substitution-1", taskId: "task-oil", itemId: "item-oil-alt", quantity: "1", uom: "L",
    warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-alt", reason: "Issue approved substitute",
    evidence: [evidence("issue-substitute")],
    scan: { source: "CAMERA", code: "890100000022", objectType: "ITEM", objectId: "item-oil-alt", state: "AVAILABLE" },
  }, { idempotencyKey: "issue-substitute" });
  assert.equal(issued.status, 201);
  assert.equal(issued.body.issue.originalDemandItemId, "item-oil");
  assert.equal(issued.body.issue.substitutionId, "substitution-1");
  assert.equal(inventory.testing.position("item-oil-alt").locationQuantityBase, "1000");
});

test("stock cannot leave Store for a non-job reason until that exact evidenced reason is independently approved", async () => {
  const { api, inventory } = await seeded();
  const store = api.signIn("store");
  const manager = api.signIn("manager");
  const proposed = await store.post("/api/v1/material-stock-reasons", {
    branchId: "branch-delhi", id: "stock-reason-1", itemId: "item-oil", quantity: "0.25", uom: "L",
    warehouseId: "warehouse-main", binId: "bin-a", lotId: "lot-1", reason: "Calibration of workshop dispensing equipment",
    evidence: [evidence("stock-reason")],
  }, { idempotencyKey: "stock-reason-1" });
  assert.equal(proposed.status, 202);

  const approved = await manager.post("/api/v1/material-stock-reasons/stock-reason-1/approval", {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Calibration plan and quantity checked",
  }, { idempotencyKey: "approve-stock-reason", ifMatch: 1, now: "2026-09-11T10:00:00.000Z", reauthenticatedAt: "2026-09-11T09:59:00.000Z" });
  assert.equal(approved.status, 200);

  const posted = await store.post("/api/v1/material-stock-reasons/stock-reason-1/issue", {
    branchId: "branch-delhi", reason: "Dispensed for approved calibration", evidence: [evidence("stock-reason-issue")],
    scan: { source: "MANUAL", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE", fallbackReason: "Camera permission denied" },
  }, { idempotencyKey: "issue-stock-reason", ifMatch: 2 });
  assert.equal(posted.status, 201);
  assert.equal(posted.body.stockReason.status, "ISSUED");
  assert.equal(inventory.testing.position("item-oil").locationQuantityBase, "4750");
  assert.equal(inventory.testing.ledger().at(-1)?.sourceType, "AUTHORIZED_STOCK_REASON");

  const replay = await store.post("/api/v1/material-stock-reasons/stock-reason-1/issue", {
    branchId: "branch-delhi", reason: "Dispensed for approved calibration", evidence: [evidence("stock-reason-issue")],
    scan: { source: "MANUAL", code: "890100000015", objectType: "ITEM", objectId: "item-oil", state: "AVAILABLE", fallbackReason: "Camera permission denied" },
  }, { idempotencyKey: "issue-stock-reason", ifMatch: 2 });
  assert.equal(replay.status, 200);
  assert.equal(inventory.testing.position("item-oil").locationQuantityBase, "4750");
});

test("PostgreSQL material-control contract forces scoped RLS, exact conservation, independent controls, and append-only posting", async () => {
  const sql = await readFile(new URL("../db/migrations/015_job_material_control.sql", import.meta.url), "utf8");
  for (const table of [
    "job_material_request", "job_material_request_line", "job_material_issue", "job_material_outcome",
    "job_material_return_verification", "job_material_substitution", "job_material_variance",
    "authorized_stock_reason", "job_material_approval", "job_material_reconciliation",
    "job_material_evidence", "job_material_event", "job_material_command_receipt",
  ]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
    assert.match(sql, new RegExp(`CREATE POLICY ${table}_isolation`));
  }
  assert.match(sql, /numeric\(24, 6\)/i);
  assert.match(sql, /issued_quantity = consumed_quantity \+ verified_return_quantity \+ wastage_quantity \+ approved_variance_quantity/i);
  assert.match(sql, /maker_membership_id <> checker_membership_id/i);
  assert.match(sql, /FOR UPDATE/i);
  assert.match(sql, /workshopos\.post_inventory_withdrawal/i);
  assert.match(sql, /workshopos\.post_job_material_return/i);
  assert.match(sql, /UNIQUE \(tenant_id, event_type, source_id\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(sql, /payload_fingerprint/i);
  assert.match(sql, /CREATE TRIGGER job_material_issue_append_only/i);
  assert.match(sql, /CREATE TRIGGER job_material_outcome_append_only/i);
  assert.match(sql, /CREATE TRIGGER job_material_reconciliation_append_only/i);
  assert.doesNotMatch(sql, /ON DELETE CASCADE/i);
});
