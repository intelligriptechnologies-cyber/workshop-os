import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalAdvisorInspectionApi } from "../src/advisor-inspection.js";

const advisor = {
  identityId: "advisor-1", membershipId: "membership-advisor-1", tenantId: "tenant-north",
  branchIds: ["branch-delhi"],
  permissions: ["advisor.job.read", "advisor.job.reassign", "inspection.submit", "inspection.read",
    "inspection.customer-notes.write", "inspection.internal-notes.write", "inspection.internal-notes.read",
    "follow-up.manage", "follow-up.read", "promised-delivery.manage"],
};
const nextAdvisor = { ...advisor, identityId: "advisor-2", membershipId: "membership-advisor-2", permissions: ["advisor.job.read", "inspection.submit", "inspection.read", "follow-up.read"] };
const observer = { ...advisor, identityId: "observer-1", membershipId: "membership-observer-1", permissions: ["advisor.job.read", "inspection.read", "follow-up.read"] };
const job = {
  id: "job-42", tenantId: "tenant-north", branchId: "branch-delhi", visitId: "visit-42",
  customerId: "customer-42", vehicleId: "vehicle-42", advisorIdentityId: "advisor-1",
  customerRequest: "Annual service and brake noise", promisedHandoffAt: "2026-09-11T05:00:00.000Z",
  status: "DRAFT" as const, resourceVersion: 1,
};
const configuration = {
  tenantId: "tenant-north", branchId: "branch-delhi", versionId: "inspection-config-v3",
  fields: [
    { id: "brake-pad-mm", label: "Brake pad thickness", kind: "DECIMAL" as const, required: true },
    { id: "battery-state", label: "Battery state", kind: "CHOICE" as const, required: true, options: ["GOOD", "WEAK", "REPLACE"] },
    { id: "underbody-note", label: "Underbody note", kind: "TEXT" as const, required: false },
  ],
  requiredEvidenceKinds: ["BRAKE", "UNDERBODY"],
};

const makeApi = () => createLocalAdvisorInspectionApi({
  memberships: { advisor, nextAdvisor, observer }, receptionJobs: [job], inspectionConfigurations: [configuration],
});

test("every reception Job starts in exactly one advisor queue and audited reassignment atomically moves ownership", async () => {
  const api = makeApi();
  const firstQueue = await api.signIn("advisor").get("/api/v1/advisor/jobs?branchId=branch-delhi&owner=me");
  assert.equal(firstQueue.status, 200);
  assert.deepEqual(firstQueue.body.jobs?.map((item) => item.id), ["job-42"]);
  assert.equal(firstQueue.body.actions?.[0].ownerIdentityId, "advisor-1");

  const reassigned = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/reassign", {
    branchId: "branch-delhi", advisorIdentityId: "advisor-2", reason: "Balance the morning workload",
  }, { idempotencyKey: "reassign-job-42", ifMatch: 1, now: "2026-09-11T05:15:00.000Z", requestId: "request-42" });
  assert.equal(reassigned.status, 200);
  assert.equal(reassigned.body.job?.advisorIdentityId, "advisor-2");
  assert.equal(reassigned.body.resourceVersion, 2);
  assert.match(String(reassigned.body.auditReference), /^audit-advisor-/);

  assert.deepEqual((await api.signIn("advisor").get("/api/v1/advisor/jobs?branchId=branch-delhi&owner=me")).body.jobs, []);
  const secondQueue = await api.signIn("nextAdvisor").get("/api/v1/advisor/jobs?branchId=branch-delhi&owner=me");
  assert.deepEqual(secondQueue.body.jobs?.map((item) => item.id), ["job-42"]);
  assert.equal(secondQueue.body.actions?.length, 1);
  assert.equal(secondQueue.body.actions?.[0].ownerIdentityId, "advisor-2");

  const replay = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/reassign", {
    branchId: "branch-delhi", advisorIdentityId: "advisor-2", reason: "Balance the morning workload",
  }, { idempotencyKey: "reassign-job-42", ifMatch: 1, now: "2026-09-11T05:16:00.000Z" });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.resourceVersion, 2);
  assert.equal(replay.body.auditReference, reassigned.body.auditReference);
});

test("advisor submits configured findings, clean private evidence, notes, and a durable S09 scope handoff", async () => {
  const api = makeApi();
  const submitted = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/inspections", {
    branchId: "branch-delhi", configurationVersionId: "inspection-config-v3",
    findings: [
      { fieldId: "brake-pad-mm", value: "2.50", result: "ATTENTION" },
      { fieldId: "battery-state", value: "WEAK", result: "ATTENTION" },
      { fieldId: "underbody-note", value: "No leak", result: "OK" },
    ],
    freeTextFindings: "Front brake pads should be replaced soon.",
    evidence: [
      { kind: "BRAKE", objectKey: "private/tenant-north/branch-delhi/inspection/brake.jpg", checksumSha256: "a".repeat(64), scanStatus: "CLEAN" },
      { kind: "UNDERBODY", objectKey: "private/tenant-north/branch-delhi/inspection/underbody.jpg", checksumSha256: "b".repeat(64), scanStatus: "CLEAN" },
    ],
    recommendedScope: [
      { code: "BRAKE_PAD_REPLACE", description: "Replace front brake pads", sourceFieldIds: ["brake-pad-mm"] },
      { code: "BATTERY_TEST", description: "Load-test battery", sourceFieldIds: ["battery-state"] },
    ],
    customerNotes: "Brake pads are nearing their wear limit.",
    internalNotes: "Confirm pad stock before estimate.",
  }, { idempotencyKey: "inspection-job-42-v1", ifMatch: 1, now: "2026-09-11T05:30:00.000Z" });

  assert.equal(submitted.status, 201);
  assert.equal(submitted.body.inspection?.configurationVersionId, "inspection-config-v3");
  assert.equal(submitted.body.inspection?.findings.length, 3);
  assert.equal(submitted.body.inspection?.freeTextFindings, "Front brake pads should be replaced soon.");
  assert.equal(submitted.body.job?.lastInspectionId, submitted.body.inspection?.id);
  assert.equal(submitted.body.resourceVersion, 2);
  assert.deepEqual(submitted.body.scopeHandoff?.recommendedScope.map((item) => item.code), ["BRAKE_PAD_REPLACE", "BATTERY_TEST"]);
  assert.equal(submitted.body.scopeHandoff?.eventType, "ADVISOR_SCOPE_RECOMMENDED");

  const handoffs = await api.signIn("advisor").get("/api/v1/advisor/scope-handoffs?branchId=branch-delhi");
  assert.equal(handoffs.body.scopeHandoffs?.length, 1);
  assert.equal(handoffs.body.scopeHandoffs?.[0].jobId, "job-42");
});

test("inspection blocks missing configured fields or unscanned evidence and filters internal notes by permission", async () => {
  const api = makeApi();
  const base = {
    branchId: "branch-delhi", configurationVersionId: "inspection-config-v3",
    findings: [
      { fieldId: "brake-pad-mm", value: "2.50", result: "ATTENTION" },
      { fieldId: "battery-state", value: "WEAK", result: "ATTENTION" },
    ],
    freeTextFindings: "Brake service is recommended.",
    evidence: [
      { kind: "BRAKE", objectKey: "private/tenant-north/branch-delhi/inspection/brake.jpg", checksumSha256: "a".repeat(64), scanStatus: "CLEAN" },
      { kind: "UNDERBODY", objectKey: "private/tenant-north/branch-delhi/inspection/underbody.jpg", checksumSha256: "b".repeat(64), scanStatus: "CLEAN" },
    ],
    recommendedScope: [{ code: "BRAKE_SERVICE", description: "Service brakes", sourceFieldIds: ["brake-pad-mm"] }],
    customerNotes: "Brake service recommended.", internalNotes: "Use preferred supplier.",
  };
  const missing = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/inspections", {
    ...base, findings: base.findings.slice(0, 1),
  }, { idempotencyKey: "missing-field", ifMatch: 1 });
  assert.equal(missing.status, 422);
  assert.equal(missing.body.code, "REQUIRED_FINDINGS_MISSING");
  assert.deepEqual(missing.body.missingFieldIds, ["battery-state"]);

  const pending = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/inspections", {
    ...base, evidence: [{ ...base.evidence[0], scanStatus: "PENDING" }, base.evidence[1]],
  }, { idempotencyKey: "pending-evidence", ifMatch: 1 });
  assert.equal(pending.status, 422);
  assert.equal(pending.body.code, "INVALID_INSPECTION_EVIDENCE");

  const saved = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/inspections", base,
    { idempotencyKey: "valid-notes", ifMatch: 1, now: "2026-09-11T05:30:00.000Z" });
  assert.equal(saved.status, 201);
  const privateView = await api.signIn("advisor").get("/api/v1/advisor/jobs/job-42/inspections?branchId=branch-delhi");
  assert.equal(privateView.body.inspections?.[0].internalNotes, "Use preferred supplier.");
  const filteredView = await api.signIn("observer").get("/api/v1/advisor/jobs/job-42/inspections?branchId=branch-delhi");
  assert.equal(filteredView.body.inspections?.[0].customerNotes, "Brake service recommended.");
  assert.equal(filteredView.body.inspections?.[0].internalNotes, undefined);
  assert.equal(filteredView.body.inspections?.[0].evidence, undefined, "private evidence metadata needs explicit evidence permission");
});

test("follow-ups surface by owner and due state, then preserve a reasoned outcome on completion", async () => {
  const api = makeApi();
  const overdue = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/follow-ups", {
    branchId: "branch-delhi", ownerIdentityId: "advisor-1", dueAt: "2026-09-10T12:00:00.000Z",
    description: "Call customer about brake recommendation",
  }, { idempotencyKey: "follow-up-overdue", now: "2026-09-10T05:00:00.000Z" });
  assert.equal(overdue.status, 201);
  const today = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/follow-ups", {
    branchId: "branch-delhi", ownerIdentityId: "advisor-2", dueAt: "2026-09-11T15:00:00.000Z",
    description: "Confirm vehicle pickup timing",
  }, { idempotencyKey: "follow-up-today", now: "2026-09-10T05:01:00.000Z" });
  assert.equal(today.status, 201);

  const mine = await api.signIn("advisor").get("/api/v1/advisor/follow-ups?branchId=branch-delhi&owner=me&asOf=2026-09-11T06:00:00.000Z");
  assert.equal(mine.body.followUps?.length, 1);
  assert.equal(mine.body.followUps?.[0].dueState, "OVERDUE");
  const theirs = await api.signIn("nextAdvisor").get("/api/v1/advisor/follow-ups?branchId=branch-delhi&owner=me&asOf=2026-09-11T06:00:00.000Z");
  assert.equal(theirs.body.followUps?.[0].dueState, "DUE_TODAY");

  const completed = await api.signIn("advisor").post(`/api/v1/advisor/follow-ups/${overdue.body.followUp?.id}/complete`, {
    branchId: "branch-delhi", outcome: "Customer approved a callback after lunch",
  }, { idempotencyKey: "complete-follow-up", ifMatch: 1, now: "2026-09-11T06:10:00.000Z" });
  assert.equal(completed.status, 200);
  assert.equal(completed.body.followUp?.status, "COMPLETED");
  assert.equal(completed.body.followUp?.outcome, "Customer approved a callback after lunch");
  assert.equal(completed.body.followUp?.dueState, "COMPLETED");
  assert.equal(completed.body.resourceVersion, 2);
});

test("promised delivery changes require a reason and expose a projected-readiness risk signal", async () => {
  const api = makeApi();
  const invalid = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/promised-delivery", {
    branchId: "branch-delhi", promisedDeliveryAt: "2026-09-11T10:00:00.000Z", projectedReadyAt: "2026-09-11T11:00:00.000Z",
  }, { idempotencyKey: "promise-without-reason", ifMatch: 1, now: "2026-09-11T06:00:00.000Z" });
  assert.equal(invalid.status, 422);
  assert.equal(invalid.body.code, "PROMISED_DELIVERY_REASON_REQUIRED");

  const atRisk = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/promised-delivery", {
    branchId: "branch-delhi", promisedDeliveryAt: "2026-09-11T10:00:00.000Z", projectedReadyAt: "2026-09-11T11:00:00.000Z",
    reason: "Customer needs the vehicle this morning",
  }, { idempotencyKey: "promise-at-risk", ifMatch: 1, now: "2026-09-11T06:00:00.000Z" });
  assert.equal(atRisk.status, 200);
  assert.equal(atRisk.body.job?.promisedDeliveryRisk, "AT_RISK");
  assert.equal(atRisk.body.job?.promisedDeliveryAt, "2026-09-11T10:00:00.000Z");

  const revised = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/promised-delivery", {
    branchId: "branch-delhi", promisedDeliveryAt: "2026-09-11T12:00:00.000Z", projectedReadyAt: "2026-09-11T11:00:00.000Z",
    reason: "Customer accepted a later delivery after inspection",
  }, { idempotencyKey: "promise-revised", ifMatch: 2, now: "2026-09-11T06:10:00.000Z" });
  assert.equal(revised.body.job?.promisedDeliveryRisk, "ON_TRACK");
  const detail = await api.signIn("advisor").get("/api/v1/advisor/jobs/job-42?branchId=branch-delhi");
  assert.equal(detail.body.promisedDeliveryHistory?.length, 2);
  assert.equal(detail.body.promisedDeliveryHistory?.[1].reason, "Customer accepted a later delivery after inspection");
  const overdue = await api.signIn("advisor").get("/api/v1/advisor/jobs?branchId=branch-delhi&owner=me&asOf=2026-09-11T12:30:00.000Z");
  assert.equal(overdue.body.jobs?.[0].promisedDeliveryRisk, "OVERDUE");
});

test("tenant, branch, permission, concurrency, and idempotency boundaries fail without advisor side effects", async () => {
  const southAdvisor = { ...advisor, identityId: "advisor-south", membershipId: "membership-south", tenantId: "tenant-south" };
  const otherBranch = { ...advisor, identityId: "advisor-jaipur", membershipId: "membership-jaipur", branchIds: ["branch-jaipur"] };
  const southJob = { ...job, tenantId: "tenant-south", advisorIdentityId: "advisor-south", customerId: "customer-south", vehicleId: "vehicle-south" };
  const api = createLocalAdvisorInspectionApi({
    memberships: { advisor, nextAdvisor, observer, southAdvisor, otherBranch }, receptionJobs: [job, southJob],
    inspectionConfigurations: [configuration, { ...configuration, tenantId: "tenant-south" }],
  });
  assert.equal((await api.signIn("otherBranch").get("/api/v1/advisor/jobs?branchId=branch-delhi&owner=me")).status, 403);
  assert.deepEqual((await api.signIn("advisor").get("/api/v1/advisor/jobs?branchId=branch-delhi&owner=me")).body.jobs?.map((item) => item.tenantId), ["tenant-north"]);
  assert.equal((await api.signIn("observer").post("/api/v1/advisor/jobs/job-42/reassign", {
    branchId: "branch-delhi", advisorIdentityId: "advisor-2", reason: "Unauthorized",
  }, { idempotencyKey: "denied", ifMatch: 1 })).status, 403);

  const stale = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/reassign", {
    branchId: "branch-delhi", tenantId: "tenant-south", advisorIdentityId: "advisor-2", reason: "Stale request",
  }, { idempotencyKey: "stale-reassignment", ifMatch: 9 });
  assert.equal(stale.status, 412);
  const unchanged = await api.signIn("advisor").get("/api/v1/advisor/jobs/job-42?branchId=branch-delhi");
  assert.equal(unchanged.body.job?.advisorIdentityId, "advisor-1");
  assert.deepEqual(unchanged.body.ownershipHistory, []);

  const first = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/reassign", {
    branchId: "branch-delhi", advisorIdentityId: "advisor-2", reason: "Approved workload move",
  }, { idempotencyKey: "shared-key", ifMatch: 1 });
  assert.equal(first.status, 200);
  const reused = await api.signIn("advisor").post("/api/v1/advisor/jobs/job-42/reassign", {
    branchId: "branch-delhi", advisorIdentityId: "advisor-1", reason: "Different command",
  }, { idempotencyKey: "shared-key", ifMatch: 2 });
  assert.equal(reused.status, 409);
  assert.equal(reused.body.code, "IDEMPOTENCY_KEY_REUSED");
});

test("PostgreSQL advisor contract forces branch RLS, one owner, atomic queue movement, and append-only evidence/history", async () => {
  const migration = await readFile(new URL("../db/migrations/008_advisor_inspection.sql", import.meta.url), "utf8");
  const tables = [
    "advisor_job_accountability", "advisor_action_queue", "advisor_ownership_history", "advisor_inspection",
    "advisor_inspection_finding", "advisor_inspection_evidence", "advisor_recommended_scope",
    "advisor_scope_handoff_outbox", "advisor_follow_up", "advisor_follow_up_history",
    "advisor_promised_delivery_history", "advisor_audit", "advisor_idempotency",
  ];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /PRIMARY KEY \(tenant_id, branch_id, job_id\)/i);
  assert.match(migration, /advisor_identity_id text NOT NULL CHECK \(btrim\(advisor_identity_id\) <> ''\)/i);
  assert.match(migration, /CREATE FUNCTION workshopos\.reassign_advisor_job/i);
  assert.match(migration, /UPDATE workshopos\.advisor_job_accountability/i);
  assert.match(migration, /UPDATE workshopos\.advisor_action_queue/i);
  assert.match(migration, /INSERT INTO workshopos\.advisor_ownership_history/i);
  assert.match(migration, /resource_version = p_expected_version/i);
  assert.match(migration, /scan_status text NOT NULL CHECK \(scan_status = 'CLEAN'\)/i);
  assert.match(migration, /event_type text NOT NULL DEFAULT 'ADVISOR_SCOPE_RECOMMENDED'/i);
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(migration, /reject_advisor_ledger_mutation/i);
  for (const table of ["advisor_ownership_history", "advisor_inspection", "advisor_inspection_finding", "advisor_inspection_evidence",
    "advisor_recommended_scope", "advisor_scope_handoff_outbox", "advisor_follow_up_history", "advisor_promised_delivery_history", "advisor_audit"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
});
