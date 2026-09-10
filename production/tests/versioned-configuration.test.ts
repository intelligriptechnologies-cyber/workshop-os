import assert from "node:assert/strict";
import test from "node:test";

import { createLocalConfigurationApi } from "../src/versioned-configuration.js";

const owner = {
  identityId: "owner-north",
  membershipId: "membership-owner-north",
  tenantId: "tenant-north",
  branchIds: ["branch-delhi"],
  permissions: ["tenant.manage"],
};

test("used published masters are immutable and replacement publication does not alter an active scope", async () => {
  const api = createLocalConfigurationApi({ memberships: { "owner-token": owner } });
  const session = api.signIn("owner-token");

  const masterTypes = ["PRICE", "TAX", "WORKFLOW", "RECIPE", "CHECKLIST", "POLICY"] as const;
  const masterIds: Record<string, string> = {};
  for (const type of masterTypes) {
    const created = await session.post("/api/v1/configuration/masters", {
      branchId: "branch-delhi",
      type,
      key: `standard-${type.toLowerCase()}`,
      value: type === "PRICE" ? { amountMinor: "125050", currency: "INR" } : { label: `${type} v1` },
    }, { idempotencyKey: `create-${type}` });
    assert.equal(created.status, 201);
    masterIds[type] = created.body.master!.id;

    const published = await session.post(
      `/api/v1/configuration/masters/${masterIds[type]}/versions/1/publish`,
      { branchId: "branch-delhi", effectiveFrom: "2026-04-01T00:00:00.000Z" },
      { idempotencyKey: `publish-${type}` },
    );
    assert.equal(published.status, 200);
  }

  const activated = await session.post("/api/v1/scopes/job-42/activate", {
    branchId: "branch-delhi",
    lifecycleStage: "APPROVED",
    effectiveAt: "2026-09-10T10:00:00.000Z",
    configuration: Object.fromEntries(masterTypes.map((type) => [type, masterIds[type]])),
  }, { idempotencyKey: "activate-job-42" });
  assert.equal(activated.status, 201);
  assert.equal(activated.body.scope!.snapshots.PRICE.version, 1);
  assert.equal(activated.body.scope!.snapshots.PRICE.value.amountMinor, "125050");

  const forbiddenEdit = await session.patch(
    `/api/v1/configuration/masters/${masterIds.PRICE}/versions/1`,
    { branchId: "branch-delhi", value: { amountMinor: "999999", currency: "INR" } },
    { ifMatch: 1 },
  );
  assert.equal(forbiddenEdit.status, 409);
  assert.equal(forbiddenEdit.body.code, "PUBLISHED_VERSION_IMMUTABLE");

  const replacement = await session.post(
    `/api/v1/configuration/masters/${masterIds.PRICE}/versions`,
    { branchId: "branch-delhi", value: { amountMinor: "130000", currency: "INR" } },
    { idempotencyKey: "replace-price" },
  );
  assert.equal(replacement.status, 201);
  assert.equal(replacement.body.masterVersion!.version, 2);
  await session.post(
    `/api/v1/configuration/masters/${masterIds.PRICE}/versions/2/publish`,
    { branchId: "branch-delhi", effectiveFrom: "2026-10-01T00:00:00.000Z" },
    { idempotencyKey: "publish-price-v2" },
  );

  const unchanged = await session.get("/api/v1/scopes/job-42?branchId=branch-delhi");
  assert.equal(unchanged.status, 200);
  assert.equal(unchanged.body.scope!.snapshots.PRICE.version, 1);
  assert.equal(unchanged.body.scope!.snapshots.PRICE.value.amountMinor, "125050");
});

test("draft masters support optimistic edits and reject stale writers", async () => {
  const api = createLocalConfigurationApi({ memberships: { "owner-token": owner } });
  const session = api.signIn("owner-token");
  const created = await session.post("/api/v1/configuration/masters", {
    branchId: "branch-delhi", type: "SERVICE", key: "paint-protection", value: { label: "Paint protection" },
  }, { idempotencyKey: "create-service" });
  const id = created.body.master!.id;

  const updated = await session.patch(`/api/v1/configuration/masters/${id}/versions/1`, {
    branchId: "branch-delhi", value: { label: "Paint protection film" },
  }, { ifMatch: 1 });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.resourceVersion, 2);

  const stale = await session.patch(`/api/v1/configuration/masters/${id}/versions/1`, {
    branchId: "branch-delhi", value: { label: "Stale overwrite" },
  }, { ifMatch: 1 });
  assert.equal(stale.status, 412);
  assert.equal(stale.body.code, "VERSION_CONFLICT");

  const removed = await session.delete(`/api/v1/configuration/masters/${id}/versions/1`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "remove-draft-service", ifMatch: 2 });
  assert.equal(removed.status, 204);
  const listed = await session.get("/api/v1/configuration/masters?branchId=branch-delhi");
  assert.deepEqual(listed.body.masters, []);
});

test("minor-unit money and fixed-decimal UOM conversion remain exact beyond floating-point precision", async () => {
  const api = createLocalConfigurationApi({ memberships: { "owner-token": owner } });
  const session = api.signIn("owner-token");
  const conversion = await session.post("/api/v1/configuration/uom-conversions", {
    branchId: "branch-delhi", fromUom: "ROLL", toUom: "MM", numerator: "100000", denominator: "1",
  }, { idempotencyKey: "roll-to-mm" });
  assert.equal(conversion.status, 201);

  const converted = await session.post("/api/v1/configuration/uom-conversions/convert", {
    branchId: "branch-delhi", fromUom: "ROLL", toUom: "MM", quantity: "9007199254740993.125",
  }, { idempotencyKey: "convert-large-roll" });
  assert.equal(converted.status, 200);
  assert.deepEqual(converted.body.quantity, { value: "900719925474099312500.000", uom: "MM" });

  await session.post("/api/v1/configuration/uom-conversions", {
    branchId: "branch-delhi", fromUom: "MM", toUom: "M", numerator: "1", denominator: "1000",
  }, { idempotencyKey: "mm-to-m" });
  const fractional = await session.post("/api/v1/configuration/uom-conversions/convert", {
    branchId: "branch-delhi", fromUom: "MM", toUom: "M", quantity: "1",
  }, { idempotencyKey: "convert-fractional" });
  assert.deepEqual(fractional.body.quantity, { value: "0.001", uom: "M" });

  const invalidMoney = await session.post("/api/v1/configuration/masters", {
    branchId: "branch-delhi", type: "PRICE", key: "floating-price", value: { amountMinor: 12.5, currency: "INR" },
  }, { idempotencyKey: "reject-floating-money" });
  assert.equal(invalidMoney.status, 422);
  assert.equal(invalidMoney.body.code, "MONEY_MINOR_UNITS_REQUIRED");
});

test("concurrent fiscal document allocation is scoped, unique, idempotent, and never reuses a number", async () => {
  const otherTenant = { ...owner, identityId: "owner-south", membershipId: "membership-owner-south", tenantId: "tenant-south" };
  const api = createLocalConfigurationApi({ memberships: { "north-token": owner, "south-token": otherTenant } });
  const north = api.signIn("north-token");
  const allocations = await Promise.all(Array.from({ length: 64 }, (_, index) =>
    north.post("/api/v1/document-numbers/allocate", {
      branchId: "branch-delhi", documentType: "INVOICE", financialYear: "2026-27",
    }, { idempotencyKey: `invoice-${index}` }),
  ));
  assert.ok(allocations.every((response) => response.status === 201));
  const numbers = allocations.map((response) => String(response.body.documentNumber));
  assert.equal(new Set(numbers).size, 64);
  assert.deepEqual([...numbers].sort(), Array.from({ length: 64 }, (_, index) => `INV/2026-27/${String(index + 1).padStart(6, "0")}`));

  const replay = await north.post("/api/v1/document-numbers/allocate", {
    branchId: "branch-delhi", documentType: "INVOICE", financialYear: "2026-27",
  }, { idempotencyKey: "invoice-0" });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.documentNumber, "INV/2026-27/000001");

  const next = await north.post("/api/v1/document-numbers/allocate", {
    branchId: "branch-delhi", documentType: "INVOICE", financialYear: "2026-27",
  }, { idempotencyKey: "invoice-next" });
  assert.equal(next.body.documentNumber, "INV/2026-27/000065");

  const south = await api.signIn("south-token").post("/api/v1/document-numbers/allocate", {
    branchId: "branch-delhi", documentType: "INVOICE", financialYear: "2026-27",
  }, { idempotencyKey: "south-invoice-1" });
  assert.equal(south.body.documentNumber, "INV/2026-27/000001");
});

test("tenant configuration cannot redefine lifecycle semantics or cross authenticated tenant and branch scope", async () => {
  const south = { ...owner, identityId: "owner-south", membershipId: "membership-owner-south", tenantId: "tenant-south" };
  const api = createLocalConfigurationApi({ memberships: { north: owner, south } });
  const north = api.signIn("north");
  const forbiddenWorkflow = await north.post("/api/v1/configuration/masters", {
    tenantId: "tenant-south", branchId: "branch-delhi", type: "WORKFLOW", key: "custom-lifecycle",
    value: { lifecycleStages: ["MY_NEW_STAGE"] },
  }, { idempotencyKey: "invalid-workflow" });
  assert.equal(forbiddenWorkflow.status, 422);
  assert.equal(forbiddenWorkflow.body.code, "CORE_LIFECYCLE_IS_PLATFORM_DEFINED");
  assert.ok(api.stableLifecycleStages.includes("CHECK_IN"));
  assert.ok(api.stableLifecycleStages.includes("GATE_VERIFICATION"));

  const created = await north.post("/api/v1/configuration/masters", {
    tenantId: "tenant-south", branchId: "branch-delhi", type: "REASON", key: "customer-declined", value: { label: "Customer declined" },
  }, { idempotencyKey: "north-reason" });
  assert.equal(created.body.master!.tenantId, "tenant-north");
  const southList = await api.signIn("south").get("/api/v1/configuration/masters?branchId=branch-delhi");
  assert.deepEqual(southList.body.masters, []);

  const branchHop = await north.post("/api/v1/configuration/masters", {
    branchId: "branch-jaipur", type: "REASON", key: "hop", value: { label: "Must fail" },
  }, { idempotencyKey: "branch-hop" });
  assert.equal(branchHop.status, 403);
  assert.equal(branchHop.body.code, "BRANCH_FORBIDDEN");
});

test("PostgreSQL contract enforces tenant RLS, immutable versions and snapshots, exact values, and atomic fiscal sequences", async () => {
  const { readFile } = await import("node:fs/promises");
  const migration = await readFile(new URL("../db/migrations/003_versioned_configuration.sql", import.meta.url), "utf8");
  for (const table of ["configuration_master", "configuration_master_version", "scope_configuration_snapshot", "uom_conversion", "document_sequence"]) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
  }
  assert.match(migration, /prevent_published_master_version_mutation/);
  assert.match(migration, /prevent_scope_snapshot_mutation/);
  assert.match(migration, /amountMinor/);
  assert.match(migration, /numerator numeric\(38, 0\)/);
  assert.match(migration, /denominator numeric\(38, 0\)/);
  assert.match(migration, /PRIMARY KEY \(tenant_id, branch_id, document_type, financial_year\)/);
  assert.match(migration, /ON CONFLICT \(tenant_id, branch_id, document_type, financial_year\)[\s\S]*DO UPDATE[\s\S]*last_value \+ 1[\s\S]*RETURNING/);
});
