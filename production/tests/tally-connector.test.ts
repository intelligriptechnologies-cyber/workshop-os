import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createHash } from "node:crypto";

import { createLocalTallyConnectorApi, SUPPORTED_TALLY_RELEASES } from "../src/tally-connector.js";

const now = "2026-09-11T08:00:00.000Z";
const memberships = {
  accounts: { identityId: "identity-accounts", membershipId: "membership-accounts", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["tally.exchange", "tally.read", "tally.file", "tally.replay"] },
  reader: { identityId: "identity-reader", membershipId: "membership-reader", tenantId: "tenant-a", branchIds: ["branch-a"], permissions: ["tally.read"] },
  other: { identityId: "identity-other", membershipId: "membership-other", tenantId: "tenant-b", branchIds: ["branch-b"], permissions: ["tally.exchange", "tally.read", "tally.file", "tally.replay"] },
};

const invoice = {
  tenantId: "tenant-a", branchId: "branch-a", jobId: "job-19", payerId: "payer-1", billingSnapshotId: "billing-snapshot-19",
  currency: "INR", amountMinor: "118000", taxableMinor: "100000", cgstMinor: "9000", sgstMinor: "9000", igstMinor: "0",
  lines: [{ sourceLineId: "line-1", description: "Service", hsnSac: "998729", taxableMinor: "100000", gstRateBps: 1800 }],
};

function api(authority: "TALLY_AUTHORITATIVE" | "WORKSHOPOS_NATIVE" = "TALLY_AUTHORITATIVE") {
  return createLocalTallyConnectorApi({
    memberships,
    tenantConfigurations: [
      { tenantId: "tenant-a", invoiceAuthority: authority, tallyCompanyId: "company-a" },
      { tenantId: "tenant-b", invoiceAuthority: "TALLY_AUTHORITATIVE", tallyCompanyId: "company-b" },
    ],
    billingCandidates: [invoice],
    maxDeliveryAttempts: 3,
  });
}

test("RED/GREEN: all three supported release generations exchange one Tally-authoritative invoice under retry and reordered acknowledgement", async () => {
  assert.deepEqual(SUPPORTED_TALLY_RELEASES.map((release) => release.generation), ["CURRENT", "PRIOR_1", "PRIOR_2"]);
  for (const release of SUPPORTED_TALLY_RELEASES) {
    const connector = api();
    const client = connector.signIn("accounts");
    const path = "/api/v1/tally/exchanges";
    const request = { branchId: "branch-a", jobId: "job-19", payerId: "payer-1", releaseId: release.id, transport: "DIRECT" };
    const created = await client.post(path, request, { idempotencyKey: `export-${release.id}`, now });
    assert.equal(created.status, 201);
    assert.equal(created.body.exchange.authority, "TALLY_AUTHORITATIVE");
    assert.equal(created.body.nativeInvoiceCreated, false);

    // Provider acknowledgement may arrive before the delivery worker's success marker.
    const acknowledged = await client.post(`/api/v1/tally/exchanges/${created.body.exchange.id}/acknowledgements`, {
      branchId: "branch-a", releaseId: release.id, tallyCompanyId: "company-a", tallyVoucherId: `voucher-${release.id}`,
      postingStatus: "POSTED", payerId: "payer-1", amountMinor: "118000", taxableMinor: "100000",
      cgstMinor: "9000", sgstMinor: "9000", igstMinor: "0", acknowledgedAt: now,
    }, { idempotencyKey: `ack-${release.id}`, ifMatch: 1, now });
    assert.equal(acknowledged.status, 200);
    assert.equal(acknowledged.body.exchange.status, "RECONCILED");
    assert.deepEqual(acknowledged.body.reconciliation.mismatches, []);

    const delivered = await client.post(`/api/v1/tally/deliveries/${created.body.delivery.id}/deliver`, { branchId: "branch-a" },
      { idempotencyKey: `deliver-${release.id}`, ifMatch: 1, now });
    assert.equal(delivered.body.delivery.status, "DELIVERED");
    assert.equal((await client.get(`/api/v1/tally/exchanges/${created.body.exchange.id}?branchId=branch-a`)).body.exchange.status, "RECONCILED");

    assert.deepEqual(await client.post(path, request, { idempotencyKey: `export-${release.id}`, now }), created);
    assert.deepEqual(await client.post(`/api/v1/tally/exchanges/${created.body.exchange.id}/acknowledgements`, {
      branchId: "branch-a", releaseId: release.id, tallyCompanyId: "company-a", tallyVoucherId: `voucher-${release.id}`,
      postingStatus: "POSTED", payerId: "payer-1", amountMinor: "118000", taxableMinor: "100000",
      cgstMinor: "9000", sgstMinor: "9000", igstMinor: "0", acknowledgedAt: now,
    }, { idempotencyKey: `ack-${release.id}`, ifMatch: 1, now }), acknowledged);
    assert.equal(connector.inspect().exchanges.length, 1);
    assert.equal(connector.inspect().acknowledgements.length, 1);
  }
});

test("explicit authority boundary rejects native tenants and never creates a WorkshopOS-native final invoice", async () => {
  const connector = api("WORKSHOPOS_NATIVE");
  const response = await connector.signIn("accounts").post("/api/v1/tally/exchanges", {
    branchId: "branch-a", jobId: "job-19", payerId: "payer-1", releaseId: SUPPORTED_TALLY_RELEASES[0].id, transport: "DIRECT",
  }, { idempotencyKey: "wrong-authority", now });
  assert.equal(response.status, 409);
  assert.equal(response.body.code, "INVOICE_AUTHORITY_NOT_TALLY");
  assert.equal(response.body.authority, "WORKSHOPOS_NATIVE");
  assert.deepEqual(connector.inspect().nativeInvoices, []);
});

test("controlled file fallback emits an in-memory manifest and validates schema/checksum before one duplicate-safe import", async () => {
  const connector = api();
  const client = connector.signIn("accounts");
  const release = SUPPORTED_TALLY_RELEASES[1];
  const exported = await client.post("/api/v1/tally/exchanges", {
    branchId: "branch-a", jobId: "job-19", payerId: "payer-1", releaseId: release.id, transport: "CONTROLLED_FILE",
  }, { idempotencyKey: "file-export", now });
  assert.equal(exported.status, 201);
  assert.equal(exported.body.fileArtifact.persistedExternally, false);
  assert.equal(exported.body.fileArtifact.manifest.schemaVersion, release.schemaVersion);
  assert.equal(exported.body.fileArtifact.manifest.contentSha256, createHash("sha256").update(exported.body.fileArtifact.content).digest("hex"));

  const manifest = { ...exported.body.fileArtifact.manifest, direction: "IMPORT" };
  const content = JSON.stringify({ schemaVersion: release.schemaVersion, exchangeId: exported.body.exchange.id, tallyCompanyId: "company-a", tallyVoucherId: "file-voucher-1",
    postingStatus: "POSTED", payerId: "payer-1", amountMinor: "118000", taxableMinor: "100000", cgstMinor: "9000", sgstMinor: "9000", igstMinor: "0", acknowledgedAt: now });
  manifest.contentSha256 = createHash("sha256").update(content).digest("hex");
  const imported = await client.post("/api/v1/tally/files/imports", { branchId: "branch-a", releaseId: release.id, manifest, content }, { idempotencyKey: "file-import", now });
  assert.equal(imported.status, 200);
  assert.equal(imported.body.exchange.status, "RECONCILED");
  assert.deepEqual(await client.post("/api/v1/tally/files/imports", { branchId: "branch-a", releaseId: release.id, manifest, content }, { idempotencyKey: "file-import", now }), imported);
  assert.equal((await client.post("/api/v1/tally/files/imports", { branchId: "branch-a", releaseId: release.id, manifest, content }, { idempotencyKey: "file-import-duplicate", now })).body.code, "TALLY_VOUCHER_ALREADY_IMPORTED");

  const badChecksum = await client.post("/api/v1/tally/files/imports", { branchId: "branch-a", releaseId: release.id, manifest: { ...manifest, contentSha256: "0".repeat(64) }, content }, { idempotencyKey: "bad-checksum", now });
  assert.equal(badChecksum.body.code, "FILE_CHECKSUM_MISMATCH");
  const badSchemaContent = JSON.stringify({ ...JSON.parse(content), schemaVersion: "unsupported" });
  const badSchema = await client.post("/api/v1/tally/files/imports", { branchId: "branch-a", releaseId: release.id,
    manifest: { ...manifest, contentSha256: createHash("sha256").update(badSchemaContent).digest("hex") }, content: badSchemaContent }, { idempotencyKey: "bad-schema", now });
  assert.equal(badSchema.body.code, "FILE_SCHEMA_MISMATCH");
});

test("reconciliation retains Tally status/errors and exposes amount, tax, payer, and posting mismatches without changing authority", async () => {
  const connector = api(); const client = connector.signIn("accounts"); const release = SUPPORTED_TALLY_RELEASES[0];
  const created = await client.post("/api/v1/tally/exchanges", { branchId: "branch-a", jobId: "job-19", payerId: "payer-1", releaseId: release.id, transport: "DIRECT" }, { idempotencyKey: "mismatch-export", now });
  const result = await client.post(`/api/v1/tally/exchanges/${created.body.exchange.id}/acknowledgements`, {
    branchId: "branch-a", releaseId: release.id, tallyCompanyId: "company-a", tallyVoucherId: "voucher-bad", postingStatus: "REJECTED",
    errorCode: "LEDGER_NOT_FOUND", errorMessage: "Configured payer ledger is absent", payerId: "payer-x", amountMinor: "117000", taxableMinor: "99000",
    cgstMinor: "8000", sgstMinor: "8000", igstMinor: "1000", acknowledgedAt: now,
  }, { idempotencyKey: "mismatch-ack", ifMatch: 1, now });
  assert.equal(result.status, 200);
  assert.equal(result.body.exchange.status, "MISMATCH");
  assert.equal(result.body.exchange.authority, "TALLY_AUTHORITATIVE");
  assert.equal(result.body.acknowledgement.errorCode, "LEDGER_NOT_FOUND");
  assert.deepEqual(result.body.reconciliation.mismatches.map((m: any) => m.kind), ["AMOUNT", "TAX", "PAYER", "POSTING"]);
  const visible = await connector.signIn("reader").get(`/api/v1/tally/exchanges/${created.body.exchange.id}?branchId=branch-a`);
  assert.equal(visible.body.reconciliation.status, "UNRESOLVED");
});

test("tenant/branch authority, optimistic concurrency, idempotency fingerprints, and duplicate Tally vouchers fail closed", async () => {
  const connector = api(); const client = connector.signIn("accounts"); const releaseId = SUPPORTED_TALLY_RELEASES[0].id;
  const request = { branchId: "branch-a", jobId: "job-19", payerId: "payer-1", releaseId, transport: "DIRECT" };
  const created = await client.post("/api/v1/tally/exchanges", request, { idempotencyKey: "secure", now });
  assert.equal((await connector.signIn("other").get(`/api/v1/tally/exchanges/${created.body.exchange.id}?branchId=branch-a`)).status, 403);
  assert.equal((await connector.signIn("reader").post("/api/v1/tally/exchanges", request, { idempotencyKey: "denied", now })).status, 403);
  assert.equal((await client.post("/api/v1/tally/exchanges", { ...request, transport: "CONTROLLED_FILE" }, { idempotencyKey: "secure", now })).body.code, "IDEMPOTENCY_KEY_REUSED");
  assert.equal((await client.post(`/api/v1/tally/exchanges/${created.body.exchange.id}/acknowledgements`, { branchId: "branch-a", releaseId, tallyCompanyId: "company-a", tallyVoucherId: "dup", postingStatus: "POSTED", payerId: "payer-1", amountMinor: "118000", taxableMinor: "100000", cgstMinor: "9000", sgstMinor: "9000", igstMinor: "0", acknowledgedAt: now }, { idempotencyKey: "stale", ifMatch: 9, now })).body.code, "VERSION_MISMATCH");
  const ackBody = { branchId: "branch-a", releaseId, tallyCompanyId: "company-a", tallyVoucherId: "dup", postingStatus: "POSTED", payerId: "payer-1", amountMinor: "118000", taxableMinor: "100000", cgstMinor: "9000", sgstMinor: "9000", igstMinor: "0", acknowledgedAt: now };
  assert.equal((await client.post(`/api/v1/tally/exchanges/${created.body.exchange.id}/acknowledgements`, ackBody, { idempotencyKey: "ack-first", ifMatch: 1, now })).status, 200);
  const second = await client.post("/api/v1/tally/exchanges", { ...request, payerId: "payer-2" }, { idempotencyKey: "other-export", now });
  // No billing candidate exists for payer-2, so duplicate voucher cannot be smuggled into a different authority record.
  assert.equal(second.body.code, "BILLING_CANDIDATE_NOT_FOUND");
});

test("delivery failures reach dead letter and an authorized replay resumes the same effect without duplicate exchange", async () => {
  const connector = api(); const client = connector.signIn("accounts");
  const created = await client.post("/api/v1/tally/exchanges", { branchId: "branch-a", jobId: "job-19", payerId: "payer-1", releaseId: SUPPORTED_TALLY_RELEASES[2].id, transport: "DIRECT" }, { idempotencyKey: "queue-export", now });
  const deliveryId = created.body.delivery.id;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const failed = await client.post(`/api/v1/tally/deliveries/${deliveryId}/fail`, { branchId: "branch-a", error: `timeout-${attempt}` }, { idempotencyKey: `fail-${attempt}`, ifMatch: attempt, now });
    assert.equal(failed.status, 200);
  }
  assert.equal(connector.inspect().deliveries[0].status, "DEAD_LETTER");
  const replayed = await client.post(`/api/v1/tally/deliveries/${deliveryId}/replay`, { branchId: "branch-a", reason: "provider restored" }, { idempotencyKey: "replay", ifMatch: 4, now });
  assert.equal(replayed.status, 200);
  assert.equal(replayed.body.delivery.status, "PENDING");
  assert.equal(replayed.body.delivery.effectKey, created.body.delivery.effectKey);
  assert.equal(connector.inspect().exchanges.length, 1);
  assert.equal(connector.inspect().replayEvidence.length, 1);
});

test("migration 019 enforces scoped RLS, immutable evidence, serialization, exact money, and unique effects", async () => {
  const sql = await readFile(new URL("../db/migrations/019_tally_connector.sql", import.meta.url), "utf8");
  for (const table of ["tally_exchange", "tally_acknowledgement", "tally_reconciliation", "tally_file_artifact", "tally_delivery", "tally_replay_evidence", "tally_command_receipt"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(sql, new RegExp(`CREATE POLICY ${table}_isolation[\\s\\S]*tenant_id = workshopos\\.current_tenant_id\\(\\)[\\s\\S]*branch_id = ANY\\(workshopos\\.authorized_branch_ids\\(\\)\\)`, "i"));
  }
  assert.match(sql, /invoice_authority[\s\S]*CHECK \(invoice_authority = 'TALLY_AUTHORITATIVE'\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, branch_id, job_id, payer_id\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, tally_company_id, tally_voucher_id\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, effect_key\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(sql, /amount_minor bigint[\s\S]*taxable_minor bigint[\s\S]*cgst_minor bigint[\s\S]*sgst_minor bigint[\s\S]*igst_minor bigint/i);
  assert.match(sql, /SELECT[\s\S]*FROM workshopos\.tally_exchange[\s\S]*FOR UPDATE/i);
  assert.match(sql, /payload_fingerprint/i);
  assert.match(sql, /CURRENT[\s\S]*PRIOR_1[\s\S]*PRIOR_2/i);
  assert.match(sql, /PENDING[\s\S]*RETRY_WAIT[\s\S]*DEAD_LETTER/i);
  for (const table of ["tally_acknowledgement", "tally_reconciliation", "tally_file_artifact", "tally_replay_evidence", "tally_command_receipt"]) {
    assert.match(sql, new RegExp(`CREATE TRIGGER ${table}_append_only`, "i"));
  }
  assert.doesNotMatch(sql, /ON DELETE CASCADE/i);
});
