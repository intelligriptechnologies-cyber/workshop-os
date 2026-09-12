import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalProductionVertical } from "../src/local-production-vertical.js";

test("authenticated membership defeats tenant spoofing and branch hopping", async () => {
  const vertical = createLocalProductionVertical();
  const northReception = vertical.pwa.signIn("north-reception");

  const created = await northReception.post("/api/v1/work-items", {
    branchId: "north-delhi",
    tenantId: "tenant-south",
    summary: "Inspect incoming vehicle",
  }, { idempotencyKey: "north-check-in-1" });

  assert.equal(created.status, 201);
  assert.equal(created.body.workItem!.tenantId, "tenant-north");

  const southView = await vertical.pwa.signIn("south-reception").get("/api/v1/work-items");
  assert.deepEqual(southView.body.workItems, []);

  const branchHop = await northReception.post("/api/v1/work-items", {
    branchId: "north-jaipur",
    summary: "Must not cross branches",
  }, { idempotencyKey: "north-branch-hop-1" });

  assert.equal(branchHop.status, 403);
  assert.equal(branchHop.body.code, "BRANCH_FORBIDDEN");
});

test("a retried command commits once and produces one correlated worker effect", async () => {
  const vertical = createLocalProductionVertical();
  const reception = vertical.pwa.signIn("north-reception");
  const command = {
    branchId: "north-delhi",
    summary: "Prepare private intake record",
  };

  const first = await reception.post("/api/v1/work-items", command, {
    idempotencyKey: "intake-private-record-1",
  });
  const retry = await reception.post("/api/v1/work-items", command, {
    idempotencyKey: "intake-private-record-1",
  });

  assert.equal(first.status, 201);
  assert.equal(retry.status, 200);
  assert.equal(retry.body.workItem!.id, first.body.workItem!.id);
  assert.equal(retry.body.auditReference, first.body.auditReference);
  assert.equal(first.body.resourceVersion, 1);

  assert.equal(await vertical.worker.drain(), 1);
  assert.equal(await vertical.worker.drain(), 0);

  const effect = await reception.get(`/api/v1/objects/${first.body.workItem!.id}`);
  assert.equal(effect.status, 200);
  assert.equal(effect.body.object!.tenantId, "tenant-north");
  assert.equal(effect.body.object!.auditReference, first.body.auditReference);

  const correlatedLogs = vertical.observability.forAudit("north-reception", String(first.body.auditReference));
  assert.ok(correlatedLogs.length >= 2);
  assert.ok(correlatedLogs.every((entry) => entry.tenantId === "tenant-north"));
  assert.ok(correlatedLogs.every((entry) => !JSON.stringify(entry).includes("Prepare private intake record")));
});

test("database and every side channel fail closed across tenants", async () => {
  const vertical = createLocalProductionVertical();
  const north = vertical.pwa.signIn("north-reception");
  const created = await north.post("/api/v1/work-items", {
    branchId: "north-delhi",
    summary: "Tenant boundary probe",
  }, { idempotencyKey: "boundary-probe-1" });
  await vertical.worker.drain();

  const workItemId = String(created.body.workItem!.id);
  const auditReference = String(created.body.auditReference);
  const denied = vertical.isolation.probe("south-reception", {
    requestedTenantId: "tenant-north",
    requestedBranchId: "north-delhi",
    workItemId,
    auditReference,
  });

  assert.deepEqual(denied, {
    api: false,
    database: false,
    object: false,
    queue: false,
    cache: false,
    export: false,
    search: false,
    report: false,
    metric: false,
    log: false,
  });
  const allowed = vertical.isolation.probe("north-reception", {
    requestedTenantId: "tenant-north",
    requestedBranchId: "north-delhi",
    workItemId,
    auditReference,
  });
  assert.ok(Object.values(allowed).every(Boolean));
  assert.deepEqual(vertical.observability.forAudit("south-reception", auditReference), []);
});

test("tenant credentials cannot call the separately authorized platform surface", async () => {
  const vertical = createLocalProductionVertical();
  const reception = vertical.pwa.signIn("north-reception");

  const platformAttempt = await reception.post("/api/platform/v1/tenants", {}, {
    idempotencyKey: "tenant-platform-attempt-1",
  });
  const unversionedAttempt = await reception.get("/api/work-items");

  assert.equal(platformAttempt.status, 403);
  assert.equal(platformAttempt.body.code, "PLATFORM_CREDENTIAL_REQUIRED");
  assert.equal(unversionedAttempt.status, 404);
});

test("side channels also deny a different branch inside the same tenant", async () => {
  const vertical = createLocalProductionVertical();
  const jaipur = vertical.pwa.signIn("north-jaipur-manager");
  const created = await jaipur.post("/api/v1/work-items", {
    branchId: "north-jaipur",
    summary: "Jaipur-only record",
  }, { idempotencyKey: "jaipur-boundary-1" });
  await vertical.worker.drain();

  const denied = vertical.isolation.probe("north-reception", {
    requestedTenantId: "tenant-north",
    requestedBranchId: "north-jaipur",
    workItemId: created.body.workItem!.id,
    auditReference: created.body.auditReference!,
  });

  assert.ok(Object.values(denied).every((allowed) => !allowed));
});

test("production contracts force PostgreSQL RLS and private durable AWS boundaries", async () => {
  const migration = await readFile(new URL("../db/migrations/001_tenant_vertical.sql", import.meta.url), "utf8");
  const infrastructure = await readFile(new URL("../infra/template.yaml", import.meta.url), "utf8");

  for (const table of ["work_item", "audit_entry", "outbox_event", "idempotency_result"]) {
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
  }
  assert.match(migration, /tenant_id = workshopos\.current_tenant_id\(\)/);
  assert.match(migration, /branch_id = ANY \(workshopos\.authorized_branch_ids\(\)\)/);
  assert.match(infrastructure, /BlockPublicPolicy:\s+true/);
  assert.match(infrastructure, /TenantWorkDeadLetterQueue/);
  assert.match(infrastructure, /Path: \/api\/v1\/\{proxy\+\}/);
});
