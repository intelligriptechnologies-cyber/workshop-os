import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalProductionVertical } from "../src/local-production-vertical.js";
import { createLocalSecureMediaVault } from "../src/security-release-gates.js";
import { createLocalIdentityAccessSystem } from "../src/identity-access.js";
import { createReceptionDraftStore, type OfflinePostingCategory } from "../src/reception-custody-offline.js";
import { cashfreeTestSignature, createLocalPaymentsApi } from "../src/payments-settlements.js";

test("release gate denies every persisted and side-channel view across tenants and branches", async () => {
  const vertical = createLocalProductionVertical();
  const created = await vertical.pwa.signIn("north-reception").post("/api/v1/work-items", {
    tenantId: "tenant-south",
    branchId: "north-delhi",
    summary: "Release isolation probe",
  }, { idempotencyKey: "s25-isolation-1" });
  await vertical.worker.drain();

  const target = {
    requestedTenantId: "tenant-north",
    requestedBranchId: "north-delhi",
    workItemId: String(created.body.workItem?.id),
    auditReference: String(created.body.auditReference),
  };
  const expected = {
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
  };
  assert.deepEqual(vertical.isolation.probe("south-reception", target), expected);
  assert.deepEqual(vertical.isolation.probe("north-jaipur-manager", target), expected);
  assert.ok(Object.values(vertical.isolation.probe("north-reception", target)).every(Boolean));
});

test("release gate rejects malicious or disallowed media before a private object becomes readable", async () => {
  const vault = createLocalSecureMediaVault({
    memberships: {
      north: { tenantId: "tenant-north", branchIds: ["north-delhi"], permissions: ["media.upload", "media.read"] },
    },
    tenantQuotaBytes: { "tenant-north": 1_000_000 },
    scannerToken: "scanner-secret",
  });
  const north = vault.signIn("north");
  const rejected = await north.upload({
    branchId: "north-delhi",
    fileName: "payload.svg",
    mimeType: "image/svg+xml",
    byteLength: 120,
    checksumSha256: "a".repeat(64),
    contentChecksumSha256: "a".repeat(64),
    malwareStatus: "INFECTED",
  });

  assert.equal(rejected.status, 422);
  assert.equal(rejected.body.code, "MEDIA_TYPE_NOT_ALLOWED");
  assert.deepEqual(vault.inspect().objects, []);
});

test("release gate admits media only after quota, checksum, malware and tenant access controls pass", async () => {
  const vault = createLocalSecureMediaVault({
    memberships: {
      north: { tenantId: "tenant-north", branchIds: ["north-delhi"], permissions: ["media.upload", "media.read"] },
      south: { tenantId: "tenant-south", branchIds: ["south-bengaluru"], permissions: ["media.read"] },
    },
    tenantQuotaBytes: { "tenant-north": 500, "tenant-south": 500 },
    scannerToken: "scanner-secret",
  });
  const north = vault.signIn("north");
  const base = { branchId: "north-delhi", fileName: "evidence.jpg", mimeType: "image/jpeg", byteLength: 200 };

  assert.equal((await north.upload({ ...base, checksumSha256: "a".repeat(64), contentChecksumSha256: "b".repeat(64), malwareStatus: "CLEAN" })).body.code, "MEDIA_CHECKSUM_MISMATCH");
  assert.equal((await north.upload({ ...base, checksumSha256: "a".repeat(64), contentChecksumSha256: "a".repeat(64), malwareStatus: "INFECTED" })).body.code, "MEDIA_MALWARE_REJECTED");
  const pending = await north.upload({ ...base, checksumSha256: "a".repeat(64), contentChecksumSha256: "a".repeat(64), malwareStatus: "PENDING" });
  assert.equal(pending.status, 201);
  const mediaId = String(pending.body.media.id);
  assert.equal((await north.get(mediaId)).body.code, "MEDIA_NOT_AVAILABLE");
  assert.equal((await vault.signIn("south").get(mediaId)).body.code, "MEDIA_NOT_FOUND");

  const clean = await north.upload({ ...base, checksumSha256: "b".repeat(64), contentChecksumSha256: "b".repeat(64), malwareStatus: "CLEAN" });
  assert.equal((await north.get(String(clean.body.media.id))).body.code, "MEDIA_NOT_AVAILABLE", "an uploader cannot self-declare a clean scan");
  assert.equal(vault.scanner.recordResult("wrong-scanner", String(clean.body.media.id), { status: "CLEAN", checksumSha256: "b".repeat(64) }).status, 403);
  assert.equal((await north.get(String(clean.body.media.id))).body.code, "MEDIA_NOT_AVAILABLE");
  assert.equal(vault.scanner.recordResult("scanner-secret", String(clean.body.media.id), { status: "CLEAN", checksumSha256: "b".repeat(64) }).status, 200);
  assert.equal((await north.get(String(clean.body.media.id))).status, 200);
  assert.equal((await north.upload({ ...base, checksumSha256: "c".repeat(64), contentChecksumSha256: "c".repeat(64), malwareStatus: "CLEAN" })).body.code, "MEDIA_QUOTA_EXCEEDED");
  assert.ok(vault.inspect().accessAudits.length >= 3);
});

test("PostgreSQL media boundary is private, tenant/branch scoped, append-only audited and status gated", async () => {
  const sql = await readFile(new URL("../db/migrations/025_security_release_gates.sql", import.meta.url), "utf8");
  for (const table of ["secure_media_quota", "secure_media_object", "secure_media_access_audit"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(sql, /tenant_id = workshopos\.current_tenant_id\(\)/i);
  assert.match(sql, /branch_id = ANY \(workshopos\.authorized_branch_ids\(\)\)/i);
  assert.match(sql, /object_key LIKE 'private\/%'/i);
  assert.match(sql, /mime_type IN \('image\/jpeg', 'image\/png', 'application\/pdf'\)/i);
  assert.match(sql, /scan_status = 'CLEAN'/i);
  assert.match(sql, /prevent_secure_media_audit_mutation/i);
  assert.match(sql, /reserve_secure_media_upload/i);
  assert.match(sql, /FOR UPDATE/i);
  assert.match(sql, /security_invoker\s*=\s*true/i);
  assert.match(sql, /format\('private\/%s\/%s\/media\/%s', v_tenant_id, p_branch_id, v_media_id\)/i);
  assert.doesNotMatch(sql, /p_object_key text/i);
});

test("release gate keeps shared-device abuse locked and attributes the recovered session to one employee", () => {
  const access = createLocalIdentityAccessSystem();
  const tenant = access.testing.provisionTenant("tenant-kiosk", "owner-kiosk", "branch-delhi");
  const technicianRole = tenant.roles.find((role) => role.name === "Technician")!;
  access.testing.seedMembership({ identityId: "tech-one", membershipId: "member-tech-one", tenantId: tenant.id, branchIds: ["branch-delhi"], roleIds: [technicianRole.id], permissions: ["task.execute"] });
  const owner = access.identityProvider.issueToken("owner-kiosk", { authenticatedAt: "2026-09-12T09:00:00.000Z", mfa: true });
  access.registerSharedDevice(owner, { deviceId: "bay-tablet", branchId: "branch-delhi", label: "Bay tablet" }, { requestId: "device", now: "2026-09-12T09:01:00.000Z" });
  access.setKioskPin(owner, { membershipId: "member-tech-one", pin: "4826" }, { requestId: "pin", now: "2026-09-12T09:02:00.000Z" });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    assert.equal(access.switchKioskUser({ deviceId: "bay-tablet", membershipId: "member-tech-one", pin: "0000", now: `2026-09-12T09:0${3 + attempt}:00.000Z`, requestId: `bad-${attempt}` }).status, 401);
  }
  assert.equal(access.switchKioskUser({ deviceId: "bay-tablet", membershipId: "member-tech-one", pin: "4826", now: "2026-09-12T09:06:00.000Z", requestId: "locked" }).status, 423);
  const switched = access.switchKioskUser({ deviceId: "bay-tablet", membershipId: "member-tech-one", pin: "4826", now: "2026-09-12T09:21:00.000Z", requestId: "recovered" });
  const decision = access.authorize(String(switched.body.token), { branchId: "branch-delhi", permission: "task.execute", now: "2026-09-12T09:22:00.000Z" });
  assert.equal(decision.allowed, true);
  if (decision.allowed) assert.deepEqual({ identityId: decision.identityId, membershipId: decision.membershipId }, { identityId: "tech-one", membershipId: "member-tech-one" });
});

test("release gate blocks every authoritative posting class while offline without an effect", () => {
  const values = new Map<string, string>();
  const drafts = createReceptionDraftStore({
    tenantId: "tenant-north", branchId: "branch-delhi", deviceId: "reception-tablet",
    storage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } },
  });
  const categories: OfflinePostingCategory[] = ["LIFECYCLE", "CUSTODY", "APPROVAL", "INVENTORY", "FINANCE", "QC_OVERRIDE", "CLOSURE", "GATE"];
  for (const category of categories) assert.deepEqual(drafts.attemptOfflinePosting(category), {
    status: 409, code: "ONLINE_REQUIRED", category, authoritative: false,
    message: `${category} actions cannot be posted offline. Reconnect to continue.`,
  });
  assert.deepEqual(drafts.list(), []);
});

test("release gate rejects invalid and duplicate signed webhooks without duplicate finance effects", async () => {
  const secret = "cashfree-local-secret";
  const api = createLocalPaymentsApi({
    memberships: {
      accounts: { identityId: "accounts", membershipId: "member-accounts", tenantId: "tenant-north", branchIds: ["branch-delhi"], permissions: ["payment.link"] },
      webhook: { identityId: "provider", membershipId: "member-provider", tenantId: "tenant-north", branchIds: ["branch-delhi"], permissions: ["payment.webhook"] },
    },
    invoices: [{ tenantId: "tenant-north", branchId: "branch-delhi", invoiceId: "invoice-1", customerId: "customer-1", visitId: "visit-1", jobId: "job-1", payerId: "payer-1", currency: "INR", payableMinor: "50000" }],
    cashfreeWebhookSecret: secret,
  });
  const link = await api.signIn("accounts").post("/api/v1/cashfree/payment-links", { branchId: "branch-delhi", invoiceId: "invoice-1", customerId: "customer-1", amountMinor: "50000", currency: "INR", expiresAt: "2026-09-13T10:00:00.000Z" }, { idempotencyKey: "link", now: "2026-09-12T10:00:00.000Z" });
  const rawBody = JSON.stringify({ eventId: "event-1", linkId: link.body.link.id, status: "SUCCESS", amountMinor: "50000", currency: "INR", providerPaymentId: "provider-payment-1", occurredAt: "2026-09-12T10:01:00.000Z" });
  const webhookBody = { branchId: "branch-delhi" };
  const invalid = await api.signIn("webhook").post("/api/v1/cashfree/webhooks", webhookBody, { idempotencyKey: "invalid", rawBody, signature: "invalid", now: "2026-09-12T10:02:00.000Z" });
  assert.equal(invalid.status, 401);
  assert.equal(api.inspect().financialEvents.length, 0);
  const valid = await api.signIn("webhook").post("/api/v1/cashfree/webhooks", webhookBody, { idempotencyKey: "valid", rawBody, signature: cashfreeTestSignature(secret, rawBody), now: "2026-09-12T10:03:00.000Z" });
  assert.equal(valid.status, 200);
  const duplicate = await api.signIn("webhook").post("/api/v1/cashfree/webhooks", webhookBody, { idempotencyKey: "duplicate", rawBody, signature: cashfreeTestSignature(secret, rawBody), now: "2026-09-12T10:04:00.000Z" });
  assert.equal(duplicate.body.code, "WEBHOOK_EVENT_ALREADY_PROCESSED");
  assert.equal(api.inspect().financialEvents.length, 1);
  assert.equal(api.inspect().webhookEvidence.length, 1);
});
