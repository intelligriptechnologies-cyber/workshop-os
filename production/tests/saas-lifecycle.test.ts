import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalSaasLifecycleApi } from "../src/saas-lifecycle.js";

const NOW = "2026-09-12T10:00:00.000Z";

function makeApi(options: { purgeReady?: boolean } = {}) {
  return createLocalSaasLifecycleApi({
    platformSessions: {
      platformAdmin: { identityId: "platform-admin", permissions: ["platform.tenant.provision", "platform.tenant.lifecycle", "platform.tenant.export", "platform.support.grant", "platform.purge.request"], authenticatedAt: "2026-09-12T09:55:00.000Z", mfa: true },
      platformChecker: { identityId: "platform-checker", permissions: ["platform.purge.approve", "platform.support.approve"], authenticatedAt: "2026-09-12T09:56:00.000Z", mfa: true },
      supportAgent: { identityId: "support-agent", permissions: ["platform.support.use"], authenticatedAt: "2026-09-12T09:57:00.000Z", mfa: true },
    },
    memberships: {
      owner: { identityId: "owner-a", membershipId: "member-owner-a", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["tenant.read", "tenant.command", "tenant.recovery.read"] },
      former: { identityId: "former-a", membershipId: "member-former-a", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["tenant.read", "tenant.command"], active: false },
    },
    tenants: [{ id: "tenant-a", legalName: "Garage A", planId: "growth", entitlements: ["workshop", "inventory"], baseCurrency: "INR", timezone: "Asia/Kolkata", branches: [{ id: "branch-a", name: "Main" }], ownerMembershipId: "member-owner-a", configurationTemplateId: "india-workshop-v1", quotas: { branches: 3, users: 30 }, status: "ACTIVE", version: 1, purgeEligibleAt: "2026-09-01T00:00:00.000Z" }],
    records: [
      { tenantId: "tenant-a", surface: "database", recordId: "job-a", kind: "LINKED_JOB", closedAt: "2017-03-31T00:00:00.000Z", checksum: "job-checksum" },
      { tenantId: "tenant-a", surface: "objects", recordId: "photo-a", kind: "PHOTO", closedAt: "2020-03-31T00:00:00.000Z", legalHoldId: options.purgeReady ? undefined : "hold-a", checksum: "photo-checksum" },
      { tenantId: "tenant-a", surface: "objects", recordId: "object-a", kind: "GENERAL", purgeEligibleAt: "2025-01-01T00:00:00.000Z", checksum: "object-checksum" },
      { tenantId: "tenant-a", surface: "caches", recordId: "cache-a", kind: "GENERAL", purgeEligibleAt: "2025-01-01T00:00:00.000Z", checksum: "cache-checksum" },
      { tenantId: "tenant-a", surface: "queues", recordId: "queue-a", kind: "GENERAL", purgeEligibleAt: "2025-01-01T00:00:00.000Z", checksum: "queue-checksum" },
      { tenantId: "tenant-a", surface: "exports", recordId: "export-a", kind: "GENERAL", purgeEligibleAt: "2025-01-01T00:00:00.000Z", checksum: "export-checksum" },
      { tenantId: "tenant-a", surface: "search", recordId: "search-a", kind: "GENERAL", purgeEligibleAt: "2025-01-01T00:00:00.000Z", checksum: "search-checksum" },
      { tenantId: "tenant-a", surface: "logs", recordId: "log-a", kind: "AUDIT", closedAt: "2017-03-31T00:00:00.000Z", checksum: "log-checksum" },
      { tenantId: "tenant-a", surface: "audit", recordId: "audit-a", kind: "AUDIT", closedAt: "2017-03-31T00:00:00.000Z", warrantyUntil: options.purgeReady ? "2025-01-01T00:00:00.000Z" : "2027-01-01T00:00:00.000Z", checksum: "audit-checksum" },
      { tenantId: "tenant-other", surface: "database", recordId: "other-job", kind: "LINKED_JOB", closedAt: "2010-01-01T00:00:00.000Z", checksum: "other-checksum" },
    ],
  });
}

test("platform suspension preserves tenant data while blocking configured tenant use except recovery", async () => {
  const api = makeApi();
  const suspended = await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/suspend", { reason: "Payment review", blockedCapabilities: ["ACCESS", "COMMAND"] }, { idempotencyKey: "suspend-a", ifMatch: 1, now: NOW });
  assert.equal(suspended.status, 200);
  assert.equal(suspended.body.tenant.status, "SUSPENDED");
  assert.equal(suspended.body.tenant.version, 2);
  assert.match(String(suspended.body.auditRef), /^audit-/);
  assert.equal((await api.tenant("owner").get("/api/v1/tenant/workspace")).status, 423);
  assert.equal((await api.tenant("owner").post("/api/v1/tenant/commands", {}, { idempotencyKey: "work-a", ifMatch: 0, now: NOW })).status, 423);
  const recovery = await api.tenant("owner").get("/api/v1/tenant/recovery");
  assert.equal(recovery.status, 200);
  assert.deepEqual(recovery.body, { tenantId: "tenant-a", status: "SUSPENDED", preservedRecordCount: 9 });
  assert.equal(api.testing.records().filter((record) => record.tenantId === "tenant-a").length, 9);
});

test("separately authorized platform provisioning creates the complete tenant contract exactly once", async () => {
  const api = makeApi();
  const body = { tenantId: "tenant-b", legalName: "Garage B", planId: "starter", entitlements: ["workshop"], baseCurrency: "INR", timezone: "Asia/Kolkata", branches: [{ id: "branch-b", name: "Pune" }], owner: { identityId: "owner-b", membershipId: "member-owner-b", email: "owner@example.test" }, configurationTemplateId: "india-workshop-v1", quotas: { branches: 1, users: 10 } };
  assert.equal((await api.platform("owner").post("/api/v1/platform/tenants", body, { idempotencyKey: "provision-b", ifMatch: 0, now: NOW })).status, 401);
  const created = await api.platform("platformAdmin").post("/api/v1/platform/tenants", body, { idempotencyKey: "provision-b", ifMatch: 0, now: NOW });
  assert.equal(created.status, 201);
  assert.deepEqual(created.body.tenant, { id: "tenant-b", legalName: "Garage B", planId: "starter", entitlements: ["workshop"], baseCurrency: "INR", timezone: "Asia/Kolkata", branches: [{ id: "branch-b", name: "Pune" }], ownerMembershipId: "member-owner-b", configurationTemplateId: "india-workshop-v1", quotas: { branches: 1, users: 10 }, status: "ACTIVE", version: 1 });
  assert.match(String(created.body.auditRef), /^audit-tenant-b-/);
  const replay = await api.platform("platformAdmin").post("/api/v1/platform/tenants", body, { idempotencyKey: "provision-b", ifMatch: 0, now: NOW });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.tenant.id, created.body.tenant.id);
  assert.equal(api.testing.tenants().filter((tenant) => tenant.id === "tenant-b").length, 1);
  assert.equal(api.testing.memberships().some((membership) => membership.membershipId === "member-owner-b" && membership.tenantId === "tenant-b"), true);
});

test("entitlement changes are versioned, audited, server-enforced, and preserve prior history", async () => {
  const api = makeApi();
  const changed = await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/entitlements", { planId: "finance", entitlements: ["workshop", "finance"], quotas: { branches: 3, users: 40 }, reason: "Approved plan change" }, { idempotencyKey: "entitlement-a", ifMatch: 1, now: NOW });
  assert.equal(changed.status, 200);
  assert.equal(changed.body.tenant.version, 2);
  assert.deepEqual(changed.body.tenant.entitlements, ["workshop", "finance"]);
  assert.match(String(changed.body.auditRef), /^audit-/);
  assert.equal((await api.tenant("owner").post("/api/v1/tenant/commands", { requiredEntitlement: "inventory" }, { idempotencyKey: "inventory-a", ifMatch: 0, now: NOW })).status, 403);
  assert.equal((await api.tenant("owner").post("/api/v1/tenant/commands", { requiredEntitlement: "finance" }, { idempotencyKey: "finance-a", ifMatch: 0, now: NOW })).status, 202);
  assert.deepEqual(api.testing.entitlementHistory().map((entry) => ({ version: entry.version, entitlements: entry.entitlements })), [{ version: 1, entitlements: ["workshop", "inventory"] }, { version: 2, entitlements: ["workshop", "finance"] }]);
});

test("reactivation restores only current memberships and current entitlements", async () => {
  const api = makeApi();
  await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/suspend", { reason: "Review", blockedCapabilities: ["ACCESS", "COMMAND"] }, { idempotencyKey: "suspend-reactivate", ifMatch: 1, now: NOW });
  await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/entitlements", { planId: "workshop-only", entitlements: ["workshop"], quotas: { branches: 2, users: 20 }, reason: "Current contract" }, { idempotencyKey: "current-contract", ifMatch: 2, now: NOW });
  const reactivated = await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/reactivate", { reason: "Review passed" }, { idempotencyKey: "reactivate-a", ifMatch: 3, now: "2026-09-12T10:05:00.000Z" });
  assert.equal(reactivated.status, 200);
  assert.equal(reactivated.body.tenant.status, "ACTIVE");
  assert.deepEqual(reactivated.body.tenant.entitlements, ["workshop"]);
  assert.equal((await api.tenant("owner").get("/api/v1/tenant/workspace")).status, 200);
  assert.equal((await api.tenant("former").get("/api/v1/tenant/workspace")).status, 401);
  assert.equal((await api.tenant("owner").post("/api/v1/tenant/commands", { requiredEntitlement: "inventory" }, { idempotencyKey: "old-inventory", ifMatch: 0, now: NOW })).status, 403);
});

test("support access is reasoned, maker-checker approved, reauthenticated, scoped, expiring, tenant-visible, and audited", async () => {
  const api = makeApi();
  const requested = await api.platform("platformAdmin").post("/api/v1/platform/support-grants", { tenantId: "tenant-a", supportIdentityId: "support-agent", branchIds: ["branch-a"], permissions: ["tenant.support.read"], reason: "Investigate export failure", expiresAt: "2026-09-12T10:20:00.000Z" }, { idempotencyKey: "support-request-a", ifMatch: 0, now: NOW });
  assert.equal(requested.status, 202);
  const grantId = String(requested.body.grant.id);
  assert.equal(requested.body.grant.status, "PENDING");
  const approved = await api.platform("platformChecker").post(`/api/v1/platform/support-grants/${grantId}/approve`, { reason: "Scope verified" }, { idempotencyKey: "support-approve-a", ifMatch: 1, now: "2026-09-12T10:01:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.grant.status, "ACTIVE");
  const approvalReplay = await api.platform("platformChecker").post(`/api/v1/platform/support-grants/${grantId}/approve`, { reason: "Scope verified" }, { idempotencyKey: "support-approve-a", ifMatch: 1, now: "2026-09-12T10:01:00.000Z" });
  assert.equal(approvalReplay.status, 200);
  assert.equal(approvalReplay.body.grant.version, 2);
  assert.equal((await api.platform("supportAgent").get(`/api/v1/platform/support/tenants/tenant-a?grantId=${grantId}&branchId=branch-a&permission=tenant.support.read&now=2026-09-12T10:05:00.000Z`)).status, 200);
  assert.equal((await api.platform("supportAgent").get(`/api/v1/platform/support/tenants/tenant-a?grantId=${grantId}&branchId=branch-other&permission=tenant.support.read&now=2026-09-12T10:05:00.000Z`)).status, 403);
  assert.equal((await api.platform("supportAgent").get(`/api/v1/platform/support/tenants/tenant-a?grantId=${grantId}&branchId=branch-a&permission=tenant.support.read&now=2026-09-12T10:21:00.000Z`)).status, 410);
  const visible = await api.tenant("owner").get("/api/v1/tenant/support-access");
  assert.equal(visible.status, 200);
  assert.equal(visible.body.grants[0].reason, "Investigate export failure");
  assert.equal(api.testing.audits().filter((entry) => String(entry.action).startsWith("support.")).length >= 3, true);
});

test("protected tenant export snapshots every scoped surface with a checksum manifest and retention-hold evidence", async () => {
  const api = makeApi();
  await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/suspend", { reason: "Prepare recovery export", blockedCapabilities: ["ACCESS", "COMMAND"] }, { idempotencyKey: "suspend-export", ifMatch: 1, now: NOW });
  const requested = await api.platform("platformAdmin").post("/api/v1/platform/tenant-exports", { tenantId: "tenant-a", reason: "Customer-authorized complete export", includeRetainedAndHeld: true }, { idempotencyKey: "tenant-export-a", ifMatch: 0, now: "2026-09-12T10:02:00.000Z" });
  assert.equal(requested.status, 202);
  assert.equal(requested.body.export.status, "PENDING");
  assert.equal((await api.worker.drain("2026-09-12T10:03:00.000Z")).processed, 1);
  const downloaded = await api.platform("platformAdmin").get(`/api/v1/platform/tenant-exports/${requested.body.export.id}/download?now=2026-09-12T10:04:00.000Z`);
  assert.equal(downloaded.status, 200);
  assert.match(downloaded.body.objectRef, /^private\/tenant-a\/tenant-exports\//);
  assert.match(downloaded.body.contentSha256, /^[a-f0-9]{64}$/);
  assert.match(downloaded.body.manifestSha256, /^[a-f0-9]{64}$/);
  const manifest = JSON.parse(downloaded.body.manifest);
  assert.deepEqual(manifest.surfaceInventory.map((entry: any) => entry.surface), ["database", "objects", "caches", "queues", "exports", "search", "logs", "audit"]);
  assert.equal(manifest.recordCount, 9);
  assert.equal(manifest.records.find((record: any) => record.recordId === "photo-a").legalHoldId, "hold-a");
  assert.equal(manifest.records.find((record: any) => record.recordId === "job-a").retentionUntil, "2025-03-31T00:00:00.000Z");
  assert.equal(manifest.records.find((record: any) => record.recordId === "photo-a").retentionUntil, "2023-03-31T00:00:00.000Z");
  assert.equal(api.testing.externalDeletes(), 0);
});

test("purge requires an exact clear dry-run and separate recent checker before tenant-scoped local deletion simulation", async () => {
  const blockedApi = makeApi();
  await blockedApi.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/suspend", { reason: "End of service", blockedCapabilities: ["ACCESS", "COMMAND"] }, { idempotencyKey: "suspend-purge-blocked", ifMatch: 1, now: NOW });
  const blockedDryRun = await blockedApi.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/purge-dry-runs", { reason: "Privacy expiry review" }, { idempotencyKey: "dry-blocked", ifMatch: 2, now: NOW });
  assert.equal(blockedDryRun.status, 200);
  assert.deepEqual(blockedDryRun.body.dryRun.blockers.map((blocker: any) => blocker.code).sort(), ["LEGAL_HOLD_ACTIVE", "WARRANTY_ACTIVE"]);
  assert.equal((await blockedApi.platform("platformAdmin").post("/api/v1/platform/purges", { tenantId: "tenant-a", dryRunId: blockedDryRun.body.dryRun.id, dryRunSha256: blockedDryRun.body.dryRun.sha256, reason: "Purge expired tenant" }, { idempotencyKey: "purge-blocked", ifMatch: 0, now: NOW })).status, 409);

  const api = makeApi({ purgeReady: true });
  await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/suspend", { reason: "End of service", blockedCapabilities: ["ACCESS", "COMMAND"] }, { idempotencyKey: "suspend-purge", ifMatch: 1, now: NOW });
  const dryRun = await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/purge-dry-runs", { reason: "Privacy expiry review" }, { idempotencyKey: "dry-clear", ifMatch: 2, now: NOW });
  assert.equal(dryRun.body.dryRun.blockers.length, 0);
  assert.deepEqual(dryRun.body.dryRun.surfaceInventory.map((surface: any) => surface.surface), ["database", "objects", "caches", "queues", "exports", "search", "logs", "audit"]);
  assert.match(dryRun.body.dryRun.sha256, /^[a-f0-9]{64}$/);
  const requested = await api.platform("platformAdmin").post("/api/v1/platform/purges", { tenantId: "tenant-a", dryRunId: dryRun.body.dryRun.id, dryRunSha256: dryRun.body.dryRun.sha256, reason: "Purge expired tenant" }, { idempotencyKey: "purge-clear", ifMatch: 0, now: "2026-09-12T10:05:00.000Z" });
  assert.equal(requested.status, 202);
  assert.equal((await api.platform("platformAdmin").post(`/api/v1/platform/purges/${requested.body.purge.id}/approve`, { reason: "Retention and scope independently verified" }, { idempotencyKey: "approve-own", ifMatch: 1, now: "2026-09-12T10:06:00.000Z" })).status, 403);
  const approved = await api.platform("platformChecker").post(`/api/v1/platform/purges/${requested.body.purge.id}/approve`, { reason: "Retention and scope independently verified" }, { idempotencyKey: "approve-purge", ifMatch: 1, now: "2026-09-12T10:06:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.purge.status, "SIMULATED_COMPLETE");
  assert.equal(approved.body.purge.deletedCount, 9);
  assert.equal(api.testing.records().some((record) => record.tenantId === "tenant-a"), false);
  assert.equal(api.testing.records().some((record) => record.tenantId === "tenant-other" && record.recordId === "other-job"), true);
  assert.equal(api.testing.externalDeletes(), 0);
  assert.equal(api.testing.purgeEvidence().filter((entry) => entry.tenantId === "tenant-a").length >= 3, true);
});

test("a new retention or legal-hold projection invalidates an already approved purge inventory", async () => {
  const api = makeApi({ purgeReady: true });
  await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/suspend", { reason: "End of service", blockedCapabilities: ["ACCESS", "COMMAND"] }, { idempotencyKey: "suspend-stale", ifMatch: 1, now: NOW });
  const dryRun = await api.platform("platformAdmin").post("/api/v1/platform/tenants/tenant-a/purge-dry-runs", { reason: "Initial clear inventory" }, { idempotencyKey: "dry-stale", ifMatch: 2, now: NOW });
  const requested = await api.platform("platformAdmin").post("/api/v1/platform/purges", { tenantId: "tenant-a", dryRunId: dryRun.body.dryRun.id, dryRunSha256: dryRun.body.dryRun.sha256, reason: "Purge expired tenant" }, { idempotencyKey: "purge-stale", ifMatch: 0, now: "2026-09-12T10:05:00.000Z" });
  assert.deepEqual(api.retention.consume({ effectKey: "hold-activated-a", tenantId: "tenant-a", recordId: "photo-a", legalHoldId: "new-hold-a" }), { consumed: true });
  const stale = await api.platform("platformChecker").post(`/api/v1/platform/purges/${requested.body.purge.id}/approve`, { reason: "Independent review" }, { idempotencyKey: "approve-stale", ifMatch: 1, now: "2026-09-12T10:06:00.000Z" });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.code, "PURGE_INVENTORY_CHANGED");
  assert.equal(api.testing.records().filter((record) => record.tenantId === "tenant-a").length, 9);
});

test("migration 023 forces tenant isolation and preserves authorized lifecycle, export, purge, command, and worker evidence", async () => {
  const sql = await readFile(new URL("../db/migrations/023_saas_lifecycle.sql", import.meta.url), "utf8");
  for (const table of ["tenant_lifecycle_event", "tenant_entitlement_version", "platform_support_grant", "tenant_export", "tenant_export_manifest", "tenant_retention_record", "tenant_purge_dry_run", "tenant_purge_approval", "tenant_purge_evidence", "saas_command_receipt", "saas_worker_effect"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(sql, /current_platform_identity_id\(\)/i);
  assert.match(sql, /has_platform_permission\('platform\.tenant\.lifecycle'\)/i);
  assert.match(sql, /CREATE POLICY tenant_platform_authorized ON workshopos\.tenant/i);
  assert.match(sql, /CREATE POLICY branch_platform_provision ON workshopos\.branch/i);
  assert.match(sql, /CREATE POLICY membership_platform_provision ON workshopos\.membership/i);
  assert.match(sql, /support_identity_id = workshopos\.current_platform_identity_id\(\)/i);
  assert.match(sql, /payload_fingerprint char\(64\)/i);
  assert.match(sql, /UNIQUE \(actor_identity_id, idempotency_key\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, effect_key\)/i);
  assert.match(sql, /FOR UPDATE SKIP LOCKED/i);
  assert.match(sql, /reject_saas_append_only_mutation/i);
  assert.match(sql, /INTERVAL '8 years'/i);
  assert.match(sql, /INTERVAL '3 years'/i);
  assert.match(sql, /legal_hold/i);
  assert.match(sql, /warranty_until/i);
});
