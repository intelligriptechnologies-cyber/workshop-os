import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalOnboardingImportApi } from "../src/onboarding-import.js";

const NOW = "2026-09-12T12:00:00.000Z";

function makeApi() {
  return createLocalOnboardingImportApi({
    memberships: {
      importer: { identityId: "identity-a", membershipId: "member-a", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["onboarding.import"] },
      other: { identityId: "identity-b", membershipId: "member-b", tenantId: "tenant-b", branchIds: ["branch-b"], permissions: ["onboarding.import"] },
      viewer: { identityId: "identity-v", membershipId: "member-v", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["onboarding.read"] },
      checker: { identityId: "identity-checker", membershipId: "member-checker", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["onboarding.import", "onboarding.reconciliation.approve"] },
    },
    branches: [{ tenantId: "tenant-a", branchId: "branch-a" }, { tenantId: "tenant-b", branchId: "branch-b" }],
  });
}

test("dry-run maps every staged row to an accepted target or actionable rejection without operational effects", async () => {
  const api = makeApi();
  const rawExtract = "two local representative customer rows";
  const created = await api.client("importer").post("/api/v1/onboarding-imports", {
    branchId: "branch-a",
    source: { system: "LEGACY_ERP", extractId: "extract-001", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") },
    mappings: { CUSTOMER: { customerName: "name", phoneNumber: "phone" } },
    rows: [
      { rowNumber: 1, entityType: "CUSTOMER", sourceKey: " CUST-001 ", values: { customerName: "Asha Rao", phoneNumber: "9876543210" } },
      { rowNumber: 2, entityType: "CUSTOMER", sourceKey: "CUST-002", values: { phoneNumber: "9999999999" } },
    ],
  }, { idempotencyKey: "stage-001", ifMatch: 0, now: NOW });
  assert.equal(created.status, 201);

  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-001", ifMatch: 1, now: NOW });
  assert.equal(dryRun.status, 200);
  assert.deepEqual(dryRun.body.manifest.rows.map((row: Record<string, unknown>) => ({ rowNumber: row.rowNumber, sourceKey: row.sourceKey, result: row.result, code: row.code })), [
    { rowNumber: 1, sourceKey: "cust-001", result: "ACCEPTED", code: "READY_TO_CREATE" },
    { rowNumber: 2, sourceKey: "cust-002", result: "REJECTED", code: "REQUIRED_FIELD_MISSING:name" },
  ]);
  assert.match(dryRun.body.manifest.rows[0].targetId, /^customer-/);
  assert.equal(api.inspect().operationalEffects.length, 0);
});

test("workspace derives tenant and branch from membership and rejects untrusted or corrupt migration sources", async () => {
  const api = makeApi();
  const rawExtract = "customer_id,name\nC-1,Asha Rao";
  const source = { system: "LEGACY_ERP", extractId: "extract-safe", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") };
  const body = { branchId: "branch-a", tenantId: "tenant-b", source, mappings: { CUSTOMER: { name: "name" } }, rows: [{ rowNumber: 1, entityType: "CUSTOMER", sourceKey: "C-1", tenantId: "tenant-b", branchId: "branch-b", values: { name: "Asha Rao" } }] };
  assert.equal((await api.client("viewer").post("/api/v1/onboarding-imports", body, { idempotencyKey: "viewer", ifMatch: 0, now: NOW })).status, 403);
  assert.equal((await api.client("other").post("/api/v1/onboarding-imports", body, { idempotencyKey: "cross", ifMatch: 0, now: NOW })).status, 403);
  const created = await api.client("importer").post("/api/v1/onboarding-imports", body, { idempotencyKey: "safe", ifMatch: 0, now: NOW });
  assert.equal(created.status, 201);
  assert.equal(created.body.batch.tenantId, "tenant-a");
  assert.equal(created.body.batch.branchId, "branch-a");
  assert.equal(created.body.batch.rows[0].tenantId, undefined);
  const corrupt = await api.client("importer").post("/api/v1/onboarding-imports", { ...body, source: { ...source, extractId: "corrupt", sha256: "f".repeat(64) } }, { idempotencyKey: "corrupt", ifMatch: 0, now: NOW });
  assert.deepEqual(corrupt, { status: 422, body: { code: "SOURCE_CHECKSUM_MISMATCH" } });
  const demo = await api.client("importer").post("/api/v1/onboarding-imports", { ...body, source: { ...source, system: "DEMO_SQLITE", extractId: "demo" } }, { idempotencyKey: "demo", ifMatch: 0, now: NOW });
  assert.deepEqual(demo, { status: 422, body: { code: "DEMO_SQLITE_SOURCE_PROHIBITED" } });
});

test("dry-run rejects duplicate normalized source keys instead of planning duplicate effects", async () => {
  const api = makeApi();
  const rawExtract = "duplicate representative keys";
  const created = await api.client("importer").post("/api/v1/onboarding-imports", {
    branchId: "branch-a",
    source: { system: "LEGACY_ERP", extractId: "extract-duplicates", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") },
    mappings: { CUSTOMER: { customerName: "name" } },
    rows: [
      { rowNumber: 10, entityType: "CUSTOMER", sourceKey: "Customer-01", values: { customerName: "Asha" } },
      { rowNumber: 11, entityType: "CUSTOMER", sourceKey: " customer-01 ", values: { customerName: "Asha duplicate" } },
    ],
  }, { idempotencyKey: "stage-duplicates", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-duplicates", ifMatch: 1, now: NOW });
  assert.deepEqual(dryRun.body.manifest.rows.map((row: Record<string, unknown>) => ({ rowNumber: row.rowNumber, result: row.result, code: row.code })), [
    { rowNumber: 10, result: "ACCEPTED", code: "READY_TO_CREATE" },
    { rowNumber: 11, result: "REJECTED", code: "DUPLICATE_SOURCE_KEY:CUSTOMER:customer-01" },
  ]);
});

test("fingerprinted commit and safe rerun create each accepted source effect exactly once", async () => {
  const api = makeApi();
  const rawExtract = "one representative customer";
  const body = {
    branchId: "branch-a",
    source: { system: "LEGACY_ERP", extractId: "extract-commit", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") },
    mappings: { CUSTOMER: { legacyName: "name" } },
    rows: [{ rowNumber: 1, entityType: "CUSTOMER", sourceKey: "CUST-1", values: { legacyName: "Asha Rao" } }],
  };
  const created = await api.client("importer").post("/api/v1/onboarding-imports", body, { idempotencyKey: "stage-commit", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-commit", ifMatch: 1, now: NOW });
  const commitBody = { branchId: "branch-a", dryRunId: dryRun.body.manifest.id, manifestSha256: dryRun.body.manifest.sha256, batchFingerprint: created.body.batch.fingerprint };
  const committed = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, commitBody, { idempotencyKey: "commit-001", ifMatch: 1, now: NOW });
  assert.equal(committed.status, 200);
  assert.equal(committed.body.committedCount, 1);
  assert.equal(committed.body.resourceVersion, 2);
  const replay = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, commitBody, { idempotencyKey: "commit-001", ifMatch: 1, now: NOW });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.auditReference, committed.body.auditReference);
  assert.equal(api.inspect().operationalEffects.length, 1);
  const altered = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, { ...commitBody, manifestSha256: "0".repeat(64) }, { idempotencyKey: "commit-001", ifMatch: 1, now: NOW });
  assert.deepEqual(altered, { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD" } });
  const rerun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, commitBody, { idempotencyKey: "commit-rerun", ifMatch: 2, now: NOW });
  assert.equal(rerun.status, 200);
  assert.equal(rerun.body.committedCount, 0);
  assert.equal(api.inspect().operationalEffects.length, 1);
});

test("dry-run reports actionable row errors for unsupported entities and inexact financial or stock values", async () => {
  const api = makeApi();
  const rawExtract = "invalid representative exact values";
  const created = await api.client("importer").post("/api/v1/onboarding-imports", {
    branchId: "branch-a",
    source: { system: "LEGACY_ERP", extractId: "extract-invalid-values", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") },
    mappings: {
      OPENING_STOCK: { item: "itemSourceKey", qty: "quantity", unit: "uom", value: "valueMinor" },
      ADVANCE: { customer: "customerSourceKey", amount: "amountMinor", currency: "currency" },
    },
    rows: [
      { rowNumber: 1, entityType: "UNKNOWN", sourceKey: "unknown-1", values: {} },
      { rowNumber: 2, entityType: "OPENING_STOCK", sourceKey: "stock-1", values: { item: "item-1", qty: 1.25, unit: "L", value: "1000" } },
      { rowNumber: 3, entityType: "ADVANCE", sourceKey: "advance-1", values: { customer: "cust-1", amount: "12.50", currency: "INR" } },
    ],
  }, { idempotencyKey: "stage-invalid-values", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-invalid-values", ifMatch: 1, now: NOW });
  assert.equal(dryRun.status, 200);
  assert.deepEqual(dryRun.body.manifest.rows.map((row: Record<string, unknown>) => row.code), [
    "UNSUPPORTED_ENTITY_TYPE:UNKNOWN",
    "EXACT_QUANTITY_STRING_REQUIRED:quantity",
    "EXACT_MINOR_UNIT_STRING_REQUIRED:amountMinor",
  ]);
  assert.equal(dryRun.body.manifest.rows.every((row: Record<string, unknown>) => row.result === "REJECTED"), true);
});

test("dry-run covers the complete onboarding graph and resolves source references to intended target IDs", async () => {
  const api = makeApi();
  const rawExtract = "representative complete onboarding graph";
  const entities = [
    ["CUSTOMER", "cust-1", { name: "Asha" }],
    ["CONTACT", "contact-1", { customerSourceKey: "cust-1", name: "Asha", phone: "9876543210" }],
    ["VEHICLE", "vehicle-1", { registration: "MH12AB1234" }],
    ["OWNERSHIP", "ownership-1", { vehicleSourceKey: "vehicle-1", customerSourceKey: "cust-1", effectiveFrom: "2026-01-01" }],
    ["ITEM", "item-1", { sku: "OIL-1", name: "Oil", baseUom: "L" }],
    ["LOT", "lot-1", { itemSourceKey: "item-1", lotNumber: "LOT-001" }],
    ["OPENING_STOCK", "stock-1", { itemSourceKey: "item-1", lotSourceKey: "lot-1", quantity: "12.500", uom: "L", valueMinor: "187500" }],
    ["ADVANCE", "advance-1", { customerSourceKey: "cust-1", amountMinor: "50000", currency: "INR" }],
    ["OPEN_DOCUMENT", "document-1", { documentNumber: "INV-OLD-1", payerSourceKey: "cust-1", balanceMinor: "75000", currency: "INR" }],
    ["PAYMENT", "payment-1", { documentSourceKey: "document-1", amountMinor: "25000", currency: "INR" }],
    ["CREDIT", "credit-1", { customerSourceKey: "cust-1", amountMinor: "100000", currency: "INR" }],
  ] as const;
  const mappings = Object.fromEntries(entities.map(([entityType, , values]) => [entityType, Object.fromEntries(Object.keys(values).map((field) => [field, field]))]));
  const created = await api.client("importer").post("/api/v1/onboarding-imports", {
    branchId: "branch-a", source: { system: "LEGACY_ERP", extractId: "extract-complete", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") }, mappings,
    rows: entities.map(([entityType, sourceKey, values], index) => ({ rowNumber: index + 1, entityType, sourceKey, values })),
  }, { idempotencyKey: "stage-complete", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-complete", ifMatch: 1, now: NOW });
  assert.equal(dryRun.body.manifest.rows.length, 11);
  assert.equal(dryRun.body.manifest.rows.every((row: Record<string, unknown>) => row.result === "ACCEPTED"), true);
  const customer = dryRun.body.manifest.rows.find((row: Record<string, unknown>) => row.entityType === "CUSTOMER");
  const contact = dryRun.body.manifest.rows.find((row: Record<string, unknown>) => row.entityType === "CONTACT");
  const stock = dryRun.body.manifest.rows.find((row: Record<string, unknown>) => row.entityType === "OPENING_STOCK");
  const payment = dryRun.body.manifest.rows.find((row: Record<string, unknown>) => row.entityType === "PAYMENT");
  assert.equal(contact.intendedEffect.references.customerId, customer.targetId);
  assert.match(stock.intendedEffect.references.itemId, /^item-/);
  assert.match(stock.intendedEffect.references.lotId, /^lot-/);
  assert.match(payment.intendedEffect.references.documentId, /^open-document-/);
});

test("acceptance stays blocked until counts, duplicates, stock, finance, and document balances reconcile", async () => {
  const api = makeApi();
  const rawExtract = "representative reconciliation extract";
  const entities = [
    ["CUSTOMER", "cust-1", { name: "Asha" }],
    ["ITEM", "item-1", { sku: "OIL-1", name: "Oil", baseUom: "L" }],
    ["OPENING_STOCK", "stock-1", { itemSourceKey: "item-1", quantity: "12.500", uom: "L", valueMinor: "187500" }],
    ["ADVANCE", "advance-1", { customerSourceKey: "cust-1", amountMinor: "50000", currency: "INR" }],
    ["OPEN_DOCUMENT", "document-1", { documentNumber: "INV-OLD-1", payerSourceKey: "cust-1", balanceMinor: "75000", currency: "INR" }],
    ["PAYMENT", "payment-1", { documentSourceKey: "document-1", amountMinor: "25000", currency: "INR" }],
    ["CREDIT", "credit-1", { customerSourceKey: "cust-1", amountMinor: "100000", currency: "INR" }],
  ] as const;
  const mappings = Object.fromEntries(entities.map(([entityType, , values]) => [entityType, Object.fromEntries(Object.keys(values).map((field) => [field, field]))]));
  const created = await api.client("importer").post("/api/v1/onboarding-imports", { branchId: "branch-a", source: { system: "LEGACY_ERP", extractId: "extract-reconcile", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") }, mappings, rows: entities.map(([entityType, sourceKey, values], index) => ({ rowNumber: index + 1, entityType, sourceKey, values })) }, { idempotencyKey: "stage-reconcile", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-reconcile", ifMatch: 1, now: NOW });
  await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, { branchId: "branch-a", dryRunId: dryRun.body.manifest.id, manifestSha256: dryRun.body.manifest.sha256, batchFingerprint: created.body.batch.fingerprint }, { idempotencyKey: "commit-reconcile", ifMatch: 1, now: NOW });
  const expected = { entityCounts: { CUSTOMER: 2, ITEM: 1, OPENING_STOCK: 1, ADVANCE: 1, OPEN_DOCUMENT: 1, PAYMENT: 1, CREDIT: 1 }, duplicateCounts: { CUSTOMER: 0, VEHICLE: 0 }, openingStock: { quantitiesByUom: { L: "13.750" }, valueMinor: "187500" }, financial: { currency: "INR", advancesMinor: "50000", paymentsMinor: "25000", creditMinor: "100000", documentBalanceMinor: "75000" } };
  const mismatch = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/reconciliations`, { branchId: "branch-a", expected }, { idempotencyKey: "reconcile-mismatch", ifMatch: 2, now: NOW });
  assert.equal(mismatch.status, 200);
  assert.equal(mismatch.body.reconciliation.status, "BLOCKED");
  assert.deepEqual(mismatch.body.reconciliation.differences, [
    { code: "ENTITY_COUNT:CUSTOMER", expected: "2", actual: "1", difference: "-1", resolution: "CORRECT_SOURCE_MAPPING_OR_RECORD_APPROVAL" },
    { code: "OPENING_STOCK_QUANTITY:L", expected: "13.750", actual: "12.5", difference: "-1.25", resolution: "CORRECT_SOURCE_MAPPING_OR_RECORD_APPROVAL" },
  ]);
  const blocked = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/accept`, { branchId: "branch-a", reconciliationId: mismatch.body.reconciliation.id, reconciliationSha256: mismatch.body.reconciliation.sha256 }, { idempotencyKey: "accept-blocked", ifMatch: 3, now: NOW });
  assert.deepEqual(blocked, { status: 409, body: { code: "RECONCILIATION_DIFFERENCES_UNRESOLVED", differenceCodes: ["ENTITY_COUNT:CUSTOMER", "OPENING_STOCK_QUANTITY:L"] } });
  const exact = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/reconciliations`, { branchId: "branch-a", expected: { ...expected, entityCounts: { ...expected.entityCounts, CUSTOMER: 1 }, openingStock: { ...expected.openingStock, quantitiesByUom: { L: "12.500" } } } }, { idempotencyKey: "reconcile-exact", ifMatch: 3, now: NOW });
  assert.equal(exact.body.reconciliation.status, "MATCHED");
  const accepted = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/accept`, { branchId: "branch-a", reconciliationId: exact.body.reconciliation.id, reconciliationSha256: exact.body.reconciliation.sha256 }, { idempotencyKey: "accept-exact", ifMatch: 4, now: NOW });
  assert.equal(accepted.status, 200);
  assert.equal(accepted.body.accepted, true);
  assert.equal(accepted.body.resourceVersion, 5);
  const acceptedAgain = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/accept`, { branchId: "branch-a", reconciliationId: exact.body.reconciliation.id, reconciliationSha256: exact.body.reconciliation.sha256 }, { idempotencyKey: "accept-exact-again", ifMatch: 5, now: NOW });
  assert.deepEqual(acceptedAgain, { status: 409, body: { code: "IMPORT_ALREADY_ACCEPTED" } });
  assert.equal(api.inspect().batches[0].version, 5);
});

test("a separate authorized checker can approve configured reconciliation differences with evidence before acceptance", async () => {
  const api = makeApi();
  const rawExtract = "one customer variance rehearsal";
  const created = await api.client("importer").post("/api/v1/onboarding-imports", { branchId: "branch-a", source: { system: "LEGACY_ERP", extractId: "extract-approved-variance", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") }, mappings: { CUSTOMER: { name: "name" } }, rows: [{ rowNumber: 1, entityType: "CUSTOMER", sourceKey: "cust-1", values: { name: "Asha" } }] }, { idempotencyKey: "stage-approved-variance", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-approved-variance", ifMatch: 1, now: NOW });
  await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, { branchId: "branch-a", dryRunId: dryRun.body.manifest.id, manifestSha256: dryRun.body.manifest.sha256, batchFingerprint: created.body.batch.fingerprint }, { idempotencyKey: "commit-approved-variance", ifMatch: 1, now: NOW });
  const expected = { entityCounts: { CUSTOMER: 2 }, duplicateCounts: { CUSTOMER: 0 }, openingStock: { quantitiesByUom: {}, valueMinor: "0" }, financial: { currency: "INR", advancesMinor: "0", paymentsMinor: "0", creditMinor: "0", documentBalanceMinor: "0" } };
  const reconciliation = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/reconciliations`, { branchId: "branch-a", expected }, { idempotencyKey: "reconcile-approved-variance", ifMatch: 2, now: NOW });
  const approvalPath = `/api/v1/onboarding-imports/${created.body.batch.id}/reconciliations/${reconciliation.body.reconciliation.id}/approve-differences`;
  const selfApproval = await api.client("importer").post(approvalPath, { branchId: "branch-a", differenceCodes: ["ENTITY_COUNT:CUSTOMER"], reason: "Signed source count exception FIN-42" }, { idempotencyKey: "self-approve-variance", ifMatch: 3, now: NOW });
  assert.deepEqual(selfApproval, { status: 403, body: { code: "RECONCILIATION_APPROVER_REQUIRED" } });
  const approved = await api.client("checker").post(approvalPath, { branchId: "branch-a", differenceCodes: ["ENTITY_COUNT:CUSTOMER"], reason: "Signed source count exception FIN-42" }, { idempotencyKey: "checker-approve-variance", ifMatch: 3, now: NOW });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.reconciliation.status, "APPROVED_DIFFERENCES");
  assert.deepEqual(approved.body.reconciliation.approvedDifferences, [{ code: "ENTITY_COUNT:CUSTOMER", approvedByMembershipId: "member-checker", reason: "Signed source count exception FIN-42", approvedAt: NOW }]);
  const accepted = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/accept`, { branchId: "branch-a", reconciliationId: approved.body.reconciliation.id, reconciliationSha256: approved.body.reconciliation.sha256 }, { idempotencyKey: "accept-approved-variance", ifMatch: 4, now: NOW });
  assert.equal(accepted.status, 200);
  assert.equal(accepted.body.accepted, true);
});

test("dry-run surfaces tenant-scoped probable target duplicates as warnings requiring review", async () => {
  const api = createLocalOnboardingImportApi({
    memberships: { importer: { identityId: "identity-a", membershipId: "member-a", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["onboarding.import"] } },
    branches: [{ tenantId: "tenant-a", branchId: "branch-a" }],
    existingTargets: [
      { tenantId: "tenant-a", branchId: "branch-a", entityType: "VEHICLE", targetId: "vehicle-existing", matchField: "registration", matchValue: "MH12AB1234" },
      { tenantId: "tenant-b", branchId: "branch-b", entityType: "VEHICLE", targetId: "vehicle-other-tenant", matchField: "registration", matchValue: "MH12AB1234" },
    ],
  });
  const rawExtract = "possible duplicate vehicle";
  const created = await api.client("importer").post("/api/v1/onboarding-imports", { branchId: "branch-a", source: { system: "LEGACY_ERP", extractId: "extract-warning", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") }, mappings: { VEHICLE: { reg: "registration" } }, rows: [{ rowNumber: 1, entityType: "VEHICLE", sourceKey: "vehicle-old-1", values: { reg: "mh12ab1234" } }] }, { idempotencyKey: "stage-warning", ifMatch: 0, now: NOW });
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "dry-warning", ifMatch: 1, now: NOW });
  assert.deepEqual(dryRun.body.manifest.rows[0], {
    rowNumber: 1, entityType: "VEHICLE", sourceKey: "vehicle-old-1", result: "WARNING", code: "POSSIBLE_DUPLICATE:VEHICLE:vehicle-existing", targetId: "vehicle-existing",
    intendedEffect: { operation: "REVIEW_EXISTING", values: { registration: "mh12ab1234" }, references: {} },
  });
  assert.equal(api.inspect().operationalEffects.length, 0);
  const committed = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, { branchId: "branch-a", dryRunId: dryRun.body.manifest.id, manifestSha256: dryRun.body.manifest.sha256, batchFingerprint: created.body.batch.fingerprint }, { idempotencyKey: "commit-warning", ifMatch: 1, now: NOW });
  assert.equal(committed.body.resourceVersion, 2);
  const reconciliation = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/reconciliations`, { branchId: "branch-a", expected: { entityCounts: { VEHICLE: 0 }, duplicateCounts: { VEHICLE: 1 }, openingStock: { quantitiesByUom: {}, valueMinor: "0" }, financial: { currency: "INR", advancesMinor: "0", paymentsMinor: "0", creditMinor: "0", documentBalanceMinor: "0" } } }, { idempotencyKey: "reconcile-warning", ifMatch: 2, now: NOW });
  assert.equal(reconciliation.body.reconciliation.status, "MATCHED");
  assert.equal(reconciliation.body.reconciliation.actual.duplicateCounts.VEHICLE, 1);
});

test("the same source extract cannot be restaged under a new key with altered rows or mappings", async () => {
  const api = makeApi();
  const rawExtract = "immutable extract identity";
  const source = { system: "LEGACY_ERP", extractId: "extract-immutable", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") };
  const body = { branchId: "branch-a", source, mappings: { CUSTOMER: { legacyName: "name" } }, rows: [{ rowNumber: 1, entityType: "CUSTOMER", sourceKey: "cust-1", values: { legacyName: "Asha" } }] };
  const first = await api.client("importer").post("/api/v1/onboarding-imports", body, { idempotencyKey: "stage-immutable-a", ifMatch: 0, now: NOW });
  assert.equal(first.status, 201);
  const safeRerun = await api.client("importer").post("/api/v1/onboarding-imports", body, { idempotencyKey: "stage-immutable-b", ifMatch: 0, now: NOW });
  assert.equal(safeRerun.status, 200);
  assert.equal(safeRerun.body.batch.id, first.body.batch.id);
  const altered = await api.client("importer").post("/api/v1/onboarding-imports", { ...body, rows: [{ ...body.rows[0], sourceKey: "cust-2" }] }, { idempotencyKey: "stage-immutable-altered", ifMatch: 0, now: NOW });
  assert.deepEqual(altered, { status: 409, body: { code: "SOURCE_EXTRACT_PAYLOAD_CHANGED", existingBatchId: first.body.batch.id } });
  assert.equal(api.inspect().batches.length, 1);
});

test("invalid staging envelopes fail closed instead of throwing or persisting partial batches", async () => {
  const api = makeApi();
  const rawExtract = "malformed extract envelope";
  const response = await api.client("importer").post("/api/v1/onboarding-imports", { branchId: "branch-a", source: { system: "LEGACY_ERP", extractId: "extract-malformed", schema: "workshopos-onboarding", version: "1.0", rawExtract, sha256: createHash("sha256").update(rawExtract).digest("hex") } }, { idempotencyKey: "stage-malformed", ifMatch: 0, now: NOW });
  assert.deepEqual(response, { status: 422, body: { code: "INVALID_IMPORT_ENVELOPE" } });
  assert.equal(api.inspect().batches.length, 0);
});

test("PostgreSQL contract persists isolated exact append-only import, manifest, reconciliation, and command evidence", async () => {
  const migration = await readFile(new URL("../db/migrations/024_onboarding_import.sql", import.meta.url), "utf8");
  for (const table of ["onboarding_import_batch", "onboarding_import_mapping", "onboarding_import_staged_row", "onboarding_import_row_result", "onboarding_import_dry_run_manifest", "onboarding_import_reconciliation", "onboarding_import_reconciliation_difference", "onboarding_import_difference_approval", "onboarding_import_command_receipt", "onboarding_import_effect", "onboarding_import_acceptance"]) assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`));
  assert.match(migration, /source_sha256 char\(64\) NOT NULL/);
  assert.match(migration, /batch_fingerprint char\(64\) NOT NULL/);
  assert.match(migration, /quantity numeric\(24, 6\)/);
  assert.match(migration, /amount_minor bigint/);
  assert.match(migration, /ALTER TABLE workshopos\.onboarding_import_batch ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /ALTER TABLE workshopos\.onboarding_import_batch FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /current_tenant_id\(\)/);
  assert.match(migration, /authorized_branch_ids\(\)/);
  assert.match(migration, /FOR UPDATE/);
  assert.match(migration, /prevent_onboarding_import_evidence_mutation/);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, source_system, source_extract_id\)/);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, entity_type, normalized_source_key\)/);
});

test("versioned inert representative fixture completes repeatable dry-run, commit, and exact reconciliation rehearsal", async () => {
  const fixture = JSON.parse(await readFile(new URL("../fixtures/onboarding-import/representative-v1.json", import.meta.url), "utf8"));
  const api = makeApi();
  const created = await api.client("importer").post("/api/v1/onboarding-imports", fixture.import, { idempotencyKey: "fixture-stage", ifMatch: 0, now: NOW });
  assert.equal(created.status, 201);
  const dryRun = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/dry-runs`, { branchId: "branch-a" }, { idempotencyKey: "fixture-dry", ifMatch: 1, now: NOW });
  assert.equal(dryRun.body.manifest.rows.every((row: Record<string, unknown>) => row.result === "ACCEPTED"), true);
  const committed = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/commit`, { branchId: "branch-a", dryRunId: dryRun.body.manifest.id, manifestSha256: dryRun.body.manifest.sha256, batchFingerprint: created.body.batch.fingerprint }, { idempotencyKey: "fixture-commit", ifMatch: 1, now: NOW });
  const reconciled = await api.client("importer").post(`/api/v1/onboarding-imports/${created.body.batch.id}/reconciliations`, { branchId: "branch-a", expected: fixture.expected }, { idempotencyKey: "fixture-reconcile", ifMatch: committed.body.resourceVersion, now: NOW });
  assert.equal(reconciled.body.reconciliation.status, "MATCHED");
  assert.deepEqual(reconciled.body.reconciliation.differences, []);
});
