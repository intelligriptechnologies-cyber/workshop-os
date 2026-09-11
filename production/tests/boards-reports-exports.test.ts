import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createLocalManagementReportingApi } from "../src/management-reporting.js";

const memberships = {
  advisor: { identityId: "identity-a", membershipId: "member-a", tenantId: "tenant-a", branchIds: ["branch-a"], roles: ["SERVICE_ADVISOR"], permissions: ["board.read"] },
  manager: { identityId: "identity-m", membershipId: "member-m", tenantId: "tenant-a", branchIds: ["branch-a"], roles: ["WORKSHOP_MANAGER"], permissions: ["board.read", "report.read", "report.financial.read", "report.export"] },
  reporter: { identityId: "identity-r", membershipId: "member-r", tenantId: "tenant-a", branchIds: ["branch-a"], roles: ["WORKSHOP_MANAGER"], permissions: ["report.read"] },
  otherBranch: { identityId: "identity-b", membershipId: "member-b", tenantId: "tenant-a", branchIds: ["branch-b"], roles: ["SERVICE_ADVISOR"], permissions: ["board.read"] },
  otherTenant: { identityId: "identity-x", membershipId: "member-x", tenantId: "tenant-b", branchIds: ["branch-a"], roles: ["SERVICE_ADVISOR"], permissions: ["board.read", "report.read", "report.export"] },
};

const makeApi = () => createLocalManagementReportingApi({
  memberships,
  boardItems: [
    { id: "work-a", tenantId: "tenant-a", branchId: "branch-a", roles: ["SERVICE_ADVISOR"], queue: "Approval follow-up", responsibilityMembershipId: "member-a", urgency: "URGENT", dueAt: "2026-09-11T09:00:00.000Z", blocker: "Customer approval is still needed.", nextAction: "Call the customer and record their decision.", protectedFinancialMinor: "900000" },
    { id: "forbidden-action", tenantId: "tenant-a", branchId: "branch-a", roles: ["SERVICE_ADVISOR"], queue: "Payment reversal", responsibilityMembershipId: "member-a", urgency: "HIGH", nextAction: "Reverse the payment.", requiredPermission: "payment.reverse" },
    { id: "manager-a", tenantId: "tenant-a", branchId: "branch-a", roles: ["WORKSHOP_MANAGER"], queue: "Workshop exception", responsibilityMembershipId: "member-m", urgency: "HIGH", nextAction: "Review the exception." },
    { id: "work-b", tenantId: "tenant-a", branchId: "branch-b", roles: ["SERVICE_ADVISOR"], queue: "Other branch", responsibilityMembershipId: "member-b", urgency: "NORMAL", nextAction: "Do other branch work." },
    { id: "work-x", tenantId: "tenant-b", branchId: "branch-a", roles: ["SERVICE_ADVISOR"], queue: "Other tenant", responsibilityMembershipId: "member-x", urgency: "NORMAL", nextAction: "Do other tenant work." },
  ],
  capacities: [
    { tenantId: "tenant-a", branchId: "branch-a", role: "SERVICE_ADVISOR", available: 1, planned: 4, delayed: 2 },
    { tenantId: "tenant-b", branchId: "branch-a", role: "SERVICE_ADVISOR", available: 99, planned: 99, delayed: 99 },
  ],
  reportFacts: [
    { id: "fact-1", tenantId: "tenant-a", branchId: "branch-a", category: "OPERATIONAL", metric: "jobs_completed", value: "2", occurredAt: "2026-09-10T10:00:00.000Z", sourceLedgerRef: "job-ledger/1", drillRecord: { jobId: "job-1", label: "Completed service", payerName: "Protected payer", amountMinor: "50000" } },
    { id: "fact-2", tenantId: "tenant-a", branchId: "branch-a", category: "OPERATIONAL", metric: "jobs_completed", value: "3", occurredAt: "2026-09-11T10:00:00.000Z", sourceLedgerRef: "job-ledger/2", drillRecord: { jobId: "job-2", label: "Completed repair", payerName: "Protected payer", amountMinor: "70000" } },
    { id: "quantity-1", tenantId: "tenant-a", branchId: "branch-a", category: "INVENTORY", metric: "stock_quantity", value: "1.25", occurredAt: "2026-09-11T10:00:00.000Z", sourceLedgerRef: "stock-ledger/1", drillRecord: { itemId: "item-1" } },
    { id: "quantity-2", tenantId: "tenant-a", branchId: "branch-a", category: "INVENTORY", metric: "stock_quantity", value: "2.5", occurredAt: "2026-09-11T11:00:00.000Z", sourceLedgerRef: "stock-ledger/2", drillRecord: { itemId: "item-2" } },
    { id: "future", tenantId: "tenant-a", branchId: "branch-a", category: "OPERATIONAL", metric: "jobs_completed", value: "99", occurredAt: "2026-09-12T10:00:00.000Z", sourceLedgerRef: "job-ledger/future", drillRecord: { jobId: "future" } },
    { id: "other", tenantId: "tenant-b", branchId: "branch-a", category: "OPERATIONAL", metric: "jobs_completed", value: "100", occurredAt: "2026-09-10T10:00:00.000Z", sourceLedgerRef: "job-ledger/other", drillRecord: { jobId: "other" } },
  ],
});

test("curated report reconciles defined metrics to immutable facts and safely drills through as of a snapshot", async () => {
  const api = makeApi();
  const summary = await api.signIn("manager").get("/api/v1/reports/operational?branchId=branch-a&asOf=2026-09-11T23:59:59.000Z");
  assert.equal(summary.status, 200);
  assert.deepEqual(summary.body.metrics, [{ key: "jobs_completed", label: "Jobs completed", unit: "COUNT", value: "5", sourceCount: 2 }]);
  assert.equal(summary.body.asOf, "2026-09-11T23:59:59.000Z");
  assert.match(String(summary.body.definitionVersion), /^operational-v1$/);

  const drill = await api.signIn("advisor").get("/api/v1/reports/operational/drill-through?branchId=branch-a&metric=jobs_completed&asOf=2026-09-11T23:59:59.000Z");
  assert.equal(drill.status, 403);
  const permitted = await api.signIn("manager").get("/api/v1/reports/operational/drill-through?branchId=branch-a&metric=jobs_completed&asOf=2026-09-11T23:59:59.000Z");
  assert.equal(permitted.status, 200);
  assert.equal(JSON.stringify(permitted.body).includes("other"), false);
  assert.equal((permitted.body.records as unknown[]).length, 2);
});

test("report catalog defines all eight management domains and protects financial reports and drill fields", async () => {
  const api = makeApi();
  const catalog = await api.signIn("reporter").get("/api/v1/reports?branchId=branch-a");
  assert.equal(catalog.status, 200);
  assert.deepEqual((catalog.body.reports as { key: string }[]).map((report) => report.key), ["operational", "inventory", "profitability", "finance", "customer", "staff", "qc-rework", "audit"]);
  assert.equal((catalog.body.reports as { key: string; available: boolean }[]).find((report) => report.key === "finance")?.available, false);
  assert.equal((await api.signIn("reporter").get("/api/v1/reports/finance?branchId=branch-a&asOf=2026-09-11T23:59:59.000Z")).status, 403);
  const drill = await api.signIn("reporter").get("/api/v1/reports/operational/drill-through?branchId=branch-a&metric=jobs_completed&asOf=2026-09-11T23:59:59.000Z");
  assert.equal(drill.status, 200);
  assert.equal(JSON.stringify(drill.body).includes("payerName"), false);
  assert.equal(JSON.stringify(drill.body).includes("amountMinor"), false);
});

test("inventory reports aggregate fixed-decimal quantities exactly", async () => {
  const report = await makeApi().signIn("manager").get("/api/v1/reports/inventory?branchId=branch-a&asOf=2026-09-11T23:59:59.000Z");
  assert.equal(report.status, 200);
  assert.deepEqual(report.body.metrics.find((metric: any) => metric.key === "stock_quantity"), { key: "stock_quantity", label: "Stock quantity", unit: "QUANTITY", value: "3.75", sourceCount: 2 });
});

test("authorized export request is asynchronous, snapshot-bound, audited, and idempotent", async () => {
  const api = makeApi(); const manager = api.signIn("manager");
  const command = { idempotencyKey: "export-operational-1", ifMatch: 0, now: "2026-09-11T12:00:00.000Z" };
  const requested = await manager.post("/api/v1/report-exports", { branchId: "branch-a", reportKey: "operational", asOf: "2026-09-11T11:59:59.000Z", format: "CSV", filters: { metric: "jobs_completed" } }, command);
  assert.equal(requested.status, 202);
  assert.equal(requested.body.export.status, "PENDING");
  assert.equal(requested.body.export.version, 1);
  assert.equal(requested.body.export.definitionVersion, "operational-v1");
  assert.equal(requested.body.export.asOf, "2026-09-11T11:59:59.000Z");
  assert.match(String(requested.body.auditRef), /^audit-/);
  const replay = await manager.post("/api/v1/report-exports", { branchId: "branch-a", reportKey: "operational", asOf: "2026-09-11T11:59:59.000Z", format: "CSV", filters: { metric: "jobs_completed" } }, command);
  assert.equal(replay.status, 200);
  assert.equal(replay.body.export.id, requested.body.export.id);
  assert.equal(api.testing.exports().length, 1);
});

test("worker creates one private watermarked artifact with snapshot manifest, SHA-256, and expiry", async () => {
  const api = makeApi();
  const requested = await api.signIn("manager").post("/api/v1/report-exports", { branchId: "branch-a", reportKey: "operational", asOf: "2026-09-11T11:59:59.000Z", format: "CSV", filters: { metric: "jobs_completed" } }, { idempotencyKey: "artifact-1", ifMatch: 0, now: "2026-09-11T12:00:00.000Z" });
  const first = await api.worker.drain("2026-09-11T12:01:00.000Z");
  const second = await api.worker.drain("2026-09-11T12:02:00.000Z");
  assert.deepEqual(first, { processed: 1, artifactsCreated: 1 });
  assert.deepEqual(second, { processed: 0, artifactsCreated: 0 });
  const ready = api.testing.exports()[0];
  assert.equal(ready.status, "READY");
  assert.equal(ready.version, 2);
  assert.match(String(ready.objectRef), /^private\/tenant-a\/branch-a\/report-exports\//);
  assert.match(String(ready.sha256), /^[a-f0-9]{64}$/);
  assert.match(String(ready.manifestSha256), /^[a-f0-9]{64}$/);
  assert.equal(ready.watermark, "WorkshopOS • tenant-a • branch-a • member-m • 2026-09-11T11:59:59.000Z");
  assert.equal(ready.expiresAt, "2026-09-12T12:01:00.000Z");
  assert.equal(api.testing.artifacts().length, 1);
  assert.equal(requested.status, 202);
});

test("status and download reauthorize tenant and branch, verify integrity, and honor revocation", async () => {
  const api = makeApi(); const manager = api.signIn("manager");
  const requested = await manager.post("/api/v1/report-exports", { branchId: "branch-a", reportKey: "operational", asOf: "2026-09-11T11:59:59.000Z", format: "JSON", filters: {} }, { idempotencyKey: "download-1", ifMatch: 0, now: "2026-09-11T12:00:00.000Z" });
  const id = String(requested.body.export.id); await api.worker.drain("2026-09-11T12:01:00.000Z");
  assert.equal((await api.signIn("otherTenant").get(`/api/v1/report-exports/${id}?branchId=branch-a`)).status, 404);
  const status = await manager.get(`/api/v1/report-exports/${id}?branchId=branch-a`);
  assert.equal(status.status, 200); assert.equal(JSON.stringify(status.body).includes("content"), false);
  const download = await manager.get(`/api/v1/report-exports/${id}/download?branchId=branch-a&now=2026-09-11T12:02:00.000Z`);
  assert.equal(download.status, 200); assert.match(String(download.body.content), /job-ledger\/1/); assert.equal(String(download.body.content).includes("job-ledger/other"), false);
  const revoked = await manager.post(`/api/v1/report-exports/${id}/revoke`, { branchId: "branch-a", reason: "Superseded export" }, { idempotencyKey: "revoke-1", ifMatch: 2, now: "2026-09-11T12:03:00.000Z" });
  assert.equal(revoked.status, 200); assert.equal(revoked.body.export.status, "REVOKED");
  assert.equal((await manager.get(`/api/v1/report-exports/${id}/download?branchId=branch-a&now=2026-09-11T12:04:00.000Z`)).status, 410);
});

test("role board explains permitted live work and capacity without protected or cross-scope data", async () => {
  const response = await makeApi().signIn("advisor").get("/api/v1/boards/my-work?branchId=branch-a&asOf=2026-09-11T12:00:00.000Z");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.capacity, { available: 1, planned: 4, delayed: 2, message: "2 jobs need attention because they are delayed." });
  assert.deepEqual(response.body.items, [{ id: "work-a", queue: "Approval follow-up", responsibility: "You", urgency: "URGENT", delay: "Overdue", blocker: "Customer approval is still needed.", nextAction: "Call the customer and record their decision." }]);
  assert.equal(JSON.stringify(response.body).includes("900000"), false);
  assert.equal(JSON.stringify(response.body).includes("Other tenant"), false);
  assert.equal(JSON.stringify(response.body).includes("Other branch"), false);
});

test("migration 022 enforces scoped reports, private expiring exports, idempotent commands, and durable worker claims", async () => {
  const sql = await readFile(new URL("../db/migrations/022_management_reporting.sql", import.meta.url), "utf8");
  for (const table of ["report_definition", "report_fact", "report_export", "report_export_artifact", "report_export_audit", "report_command_receipt", "report_worker_effect"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(sql, /tenant_id = workshopos\.current_tenant_id\(\)/i);
  assert.match(sql, /branch_id = ANY\(workshopos\.authorized_branch_ids\(\)\)/i);
  assert.match(sql, /private_object_ref/i);
  assert.match(sql, /content_sha256 char\(64\)/i);
  assert.match(sql, /manifest_sha256 char\(64\)/i);
  assert.match(sql, /expires_at timestamptz/i);
  assert.match(sql, /payload_fingerprint char\(64\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, effect_key\)/i);
  assert.match(sql, /FOR UPDATE SKIP LOCKED/i);
  assert.match(sql, /append-only/i);
});
