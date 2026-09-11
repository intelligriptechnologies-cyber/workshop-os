import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createLocalQcReworkApi,
  type QcMembership,
} from "../src/qc-rework.js";

const memberships: Record<string, QcMembership> = {
  technician: {
    identityId: "identity-tech", membershipId: "membership-tech", technicianId: "tech-a", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["TECHNICIAN"], permissions: ["qc.view", "rework.execute"],
  },
  qc: {
    identityId: "identity-qc", membershipId: "membership-qc", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["QC"], permissions: ["qc.view", "qc.inspect", "rework.assign", "qc.override.request", "qc.override.approve"],
  },
  manager: {
    identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["MANAGER"], permissions: ["qc.view", "qc.override.approve"],
  },
};

const completion = {
  id: "completion-1", type: "S16_TASK_COMPLETION_READY" as const, tenantId: "tenant-north", branchId: "branch-delhi",
  aggregateId: "task-oil", aggregateVersion: 6, occurredAt: "2026-09-11T09:20:00.000Z",
  actorMembershipId: "membership-tech",
  payload: { jobId: "job-42", taskId: "task-oil", qcStatus: "PENDING_INDEPENDENT_QC" as const },
};

const reconciliation = {
  id: "material-reconciled-1", type: "S15_MATERIAL_RECONCILED" as const, tenantId: "tenant-north", branchId: "branch-delhi",
  aggregateId: "task-oil", aggregateVersion: 7, occurredAt: "2026-09-11T09:25:00.000Z",
  payload: { jobId: "job-42", taskId: "task-oil", consumers: ["S16_QC", "S18_BILLING"] as const,
    totals: { issued: "2", consumed: "2", verifiedReturn: "0", wastage: "0", approvedVariance: "0", difference: "0", uom: "L" } },
};

const cleanEvidence = (name: string) => ({
  privateObjectRef: `tenant-north/branch-delhi/private/qc/${name}.jpg`, checksum: "b".repeat(64),
  scanStatus: "CLEAN" as const, capturedAt: "2026-09-11T09:30:00.000Z", kind: "PHOTO" as const,
});

function makeApi() {
  return createLocalQcReworkApi({
    memberships,
    taskCompletionEvents: [completion],
    materialReconciliationEvents: [reconciliation],
    taskContexts: [{
      tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil",
      technicianMembershipIds: ["membership-tech"],
      checklist: { masterId: "qc-oil-service", version: 4, items: [
        { key: "oil-level", label: "Oil level", required: true, readingRequired: true, evidenceRequired: true },
        { key: "leak-check", label: "Leak check", required: true, readingRequired: false, evidenceRequired: false },
      ] },
      overridePolicy: { version: 2, recentAuthenticationSeconds: 300, checkerPermission: "qc.override.approve" },
    }],
  });
}

test("completed and reconciled work remains pending until an independent QC actor submits the entire snapshotted checklist", async () => {
  const api = makeApi();
  const technician = api.signIn("technician");
  const pending = await technician.get("/api/v1/qc/actions?branchId=branch-delhi");
  assert.equal(pending.status, 200);
  assert.equal(pending.body.actions[0].status, "PENDING_QC");
  assert.match(pending.body.actions[0].blocker, /independent quality check/i);

  const forbidden = await technician.post("/api/v1/tasks/task-oil/qc-inspections", {
    branchId: "branch-delhi", items: [], reason: "Technician self-check",
  }, { idempotencyKey: "self-qc", ifMatch: 1 });
  assert.equal(forbidden.status, 403);

  const inspected = await api.signIn("qc").post("/api/v1/tasks/task-oil/qc-inspections", {
    branchId: "branch-delhi", reason: "Independent final inspection",
    items: [
      { checklistKey: "oil-level", status: "PASS", reading: "MAX", notes: "Level stable", evidence: [cleanEvidence("oil-level")] },
      { checklistKey: "leak-check", status: "PASS", notes: "Dry after idle test", evidence: [] },
    ],
  }, { idempotencyKey: "qc-pass-1", ifMatch: 1, now: "2026-09-11T09:35:00.000Z" });
  assert.equal(inspected.status, 201);
  assert.equal(inspected.body.inspection.result, "PASS");
  assert.equal(inspected.body.inspection.checklist.version, 4);
  assert.equal(inspected.body.inspection.actorMembershipId, "membership-qc");
  assert.equal(inspected.body.qcStatus, "PASSED");
  assert.equal(api.testing.releaseEvents()[0].type, "S16_QC_PASSED");
});

test("a failed QC item creates blocking rework linked to immutable failure evidence and cannot release the Job", async () => {
  const api = makeApi();
  const failed = await api.signIn("qc").post("/api/v1/tasks/task-oil/qc-inspections", {
    branchId: "branch-delhi", reason: "Leak found during pressure test",
    items: [
      { checklistKey: "oil-level", status: "PASS", reading: "MAX", notes: "Level correct", evidence: [cleanEvidence("level-pass")] },
      { checklistKey: "leak-check", status: "FAIL", notes: "Fresh seep at drain plug", evidence: [cleanEvidence("leak-fail")] },
    ],
  }, { idempotencyKey: "qc-fail-1", ifMatch: 1, now: "2026-09-11T10:00:00.000Z" });
  assert.equal(failed.status, 201);
  assert.equal(failed.body.inspection.result, "FAIL");
  assert.equal(failed.body.qcStatus, "FAILED");
  assert.equal(failed.body.rework.status, "BLOCKING");
  assert.equal(failed.body.rework.failedInspectionId, failed.body.inspection.id);
  assert.deepEqual(failed.body.rework.failedChecklistKeys, ["leak-check"]);
  assert.equal(failed.body.rework.failureEvidence[0].privateObjectRef.endsWith("leak-fail.jpg"), true);
  assert.equal(api.testing.releaseEvents().length, 0);
});

test("assigned rework is evidenced by its technician and independently re-inspected without erasing the failed attempt", async () => {
  const api = makeApi();
  const first = await api.signIn("qc").post("/api/v1/tasks/task-oil/qc-inspections", {
    branchId: "branch-delhi", reason: "Leak found",
    items: [
      { checklistKey: "oil-level", status: "PASS", reading: "MAX", notes: "Level correct", evidence: [cleanEvidence("first-level")] },
      { checklistKey: "leak-check", status: "FAIL", notes: "Drain plug seep", evidence: [cleanEvidence("first-leak")] },
    ],
  }, { idempotencyKey: "first-fail", ifMatch: 1, now: "2026-09-11T10:00:00.000Z" });
  const reworkId = first.body.rework.id;

  const assigned = await api.signIn("qc").post(`/api/v1/reworks/${reworkId}/assignment`, {
    branchId: "branch-delhi", technicianMembershipId: "membership-tech", reason: "Replace drain washer and retorque",
  }, { idempotencyKey: "assign-rework", ifMatch: 1, now: "2026-09-11T10:05:00.000Z" });
  assert.equal(assigned.status, 200);
  assert.equal(assigned.body.rework.status, "ASSIGNED");

  const completed = await api.signIn("technician").post(`/api/v1/reworks/${reworkId}/completion`, {
    branchId: "branch-delhi", reason: "Washer replaced and plug torqued", evidence: [cleanEvidence("rework-complete")],
  }, { idempotencyKey: "complete-rework", ifMatch: 2, now: "2026-09-11T10:20:00.000Z" });
  assert.equal(completed.status, 200);
  assert.equal(completed.body.rework.status, "READY_FOR_REINSPECTION");

  const reinspected = await api.signIn("qc").post(`/api/v1/reworks/${reworkId}/reinspection`, {
    branchId: "branch-delhi", reason: "Independent leak retest",
    items: [
      { checklistKey: "oil-level", status: "PASS", reading: "MAX", notes: "Level remains correct", evidence: [cleanEvidence("recheck-level")] },
      { checklistKey: "leak-check", status: "PASS", notes: "Dry after pressure retest", evidence: [cleanEvidence("recheck-leak")] },
    ],
  }, { idempotencyKey: "reinspect-rework", ifMatch: 3, now: "2026-09-11T10:30:00.000Z" });
  assert.equal(reinspected.status, 201);
  assert.equal(reinspected.body.rework.status, "PASSED");
  assert.equal(reinspected.body.qcStatus, "PASSED");
  assert.deepEqual(api.testing.inspections().map((item) => item.result), ["FAIL", "PASS"]);
  assert.equal(api.testing.inspections()[1].attempt, 2);
  assert.equal(api.testing.reworkHistory().length, 3);
  assert.equal(api.testing.releaseEvents().length, 1);
});

test("emergency QC override needs clean evidence, recent re-authentication, and a distinct configured checker with release visibility", async () => {
  const api = makeApi();
  const failed = await api.signIn("qc").post("/api/v1/tasks/task-oil/qc-inspections", {
    branchId: "branch-delhi", reason: "Non-critical leak-check sensor unavailable",
    items: [
      { checklistKey: "oil-level", status: "PASS", reading: "MAX", notes: "Level verified", evidence: [cleanEvidence("override-level")] },
      { checklistKey: "leak-check", status: "FAIL", notes: "Sensor cannot complete automated test", evidence: [cleanEvidence("sensor-fail")] },
    ],
  }, { idempotencyKey: "override-fail", ifMatch: 1, now: "2026-09-11T11:00:00.000Z" });
  const requested = await api.signIn("qc").post("/api/v1/tasks/task-oil/qc-override-requests", {
    branchId: "branch-delhi", reworkId: failed.body.rework.id,
    reason: "Customer must evacuate vehicle before flood warning; manual leak inspection passed",
    evidence: [cleanEvidence("manual-leak-check")], customerCommunicationNote: "Emergency release exception explained to customer",
  }, { idempotencyKey: "request-qc-override", ifMatch: 2, now: "2026-09-11T11:05:00.000Z" });
  assert.equal(requested.status, 202);
  assert.equal(requested.body.override.status, "APPROVAL_PENDING");

  const selfApproval = await api.signIn("qc").post(`/api/v1/qc-overrides/${requested.body.override.id}/approval`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Self approve",
  }, { idempotencyKey: "self-approve-override", ifMatch: 1, now: "2026-09-11T11:06:00.000Z", reauthenticatedAt: "2026-09-11T11:05:30.000Z" });
  assert.equal(selfApproval.status, 409);
  assert.equal(selfApproval.body.code, "INDEPENDENT_CHECKER_REQUIRED");

  const stale = await api.signIn("manager").post(`/api/v1/qc-overrides/${requested.body.override.id}/approval`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Emergency condition and manual evidence reviewed",
  }, { idempotencyKey: "stale-approve-override", ifMatch: 1, now: "2026-09-11T11:10:00.000Z", reauthenticatedAt: "2026-09-11T10:00:00.000Z" });
  assert.equal(stale.status, 403);
  assert.equal(stale.body.code, "RECENT_AUTHENTICATION_REQUIRED");

  const approved = await api.signIn("manager").post(`/api/v1/qc-overrides/${requested.body.override.id}/approval`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Emergency condition and manual evidence reviewed",
  }, { idempotencyKey: "approve-qc-override", ifMatch: 1, now: "2026-09-11T11:10:00.000Z", reauthenticatedAt: "2026-09-11T11:09:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.override.status, "APPROVED");
  assert.equal(approved.body.override.checkerMembershipId, "membership-manager");
  assert.equal(approved.body.qcStatus, "OVERRIDDEN");
  const event = api.testing.releaseEvents()[0];
  assert.equal(event.type, "S16_QC_OVERRIDDEN");
  assert.equal(event.payload.customerVisible, true);
  assert.equal(event.payload.releaseVisible, true);
  assert.equal(api.testing.inspections()[0].result, "FAIL");
});

test("QC completion safely replays one command and serializes concurrent inspectors to one release effect", async () => {
  const body = {
    branchId: "branch-delhi", reason: "Independent final inspection",
    items: [
      { checklistKey: "oil-level", status: "PASS", reading: "MAX", notes: "Level stable", evidence: [cleanEvidence("race-level")] },
      { checklistKey: "leak-check", status: "PASS", notes: "No leak", evidence: [] },
    ],
  };
  const replayApi = makeApi();
  const qc = replayApi.signIn("qc");
  const first = await qc.post("/api/v1/tasks/task-oil/qc-inspections", body,
    { idempotencyKey: "replay-qc", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });
  const replay = await qc.post("/api/v1/tasks/task-oil/qc-inspections", body,
    { idempotencyKey: "replay-qc", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(first.status, 201);
  assert.equal(replay.status, 200);
  assert.equal(replay.body.auditReference, first.body.auditReference);
  assert.equal(replayApi.testing.inspections().length, 1);
  assert.equal(replayApi.testing.releaseEvents().length, 1);

  const raceApi = makeApi();
  const inspect = (key: string) => raceApi.signIn("qc").post("/api/v1/tasks/task-oil/qc-inspections", body,
    { idempotencyKey: key, ifMatch: 1, now: "2026-09-11T12:05:00.000Z" });
  const [left, right] = await Promise.all([inspect("race-left"), inspect("race-right")]);
  assert.deepEqual([left.status, right.status].sort(), [201, 409]);
  assert.equal(raceApi.testing.inspections().length, 1);
  assert.equal(raceApi.testing.releaseEvents().length, 1);
});

test("PostgreSQL QC contract forces scoped RLS, independent append-only evidence, serialized rework, and unique effects", async () => {
  const sql = await readFile(new URL("../db/migrations/016_qc_rework.sql", import.meta.url), "utf8");
  for (const table of [
    "qc_task_state", "qc_consumed_event", "qc_inspection", "qc_inspection_item", "qc_evidence",
    "qc_rework", "qc_rework_history", "qc_override_request", "qc_override_approval", "qc_event", "qc_command_receipt",
  ]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
    assert.match(sql, new RegExp(`CREATE POLICY ${table}_isolation`));
  }
  assert.match(sql, /S16_TASK_COMPLETION_READY/);
  assert.match(sql, /S15_MATERIAL_RECONCILED/);
  assert.match(sql, /technician_membership_ids @> ARRAY\[p_actor_membership_id\]/i);
  assert.match(sql, /maker_membership_id <> checker_membership_id/i);
  assert.match(sql, /FOR UPDATE/i);
  assert.match(sql, /UNIQUE \(tenant_id, source_event_id\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, event_type, source_id\)/i);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(sql, /payload_fingerprint/i);
  for (const table of ["qc_inspection", "qc_inspection_item", "qc_evidence", "qc_rework_history", "qc_override_approval", "qc_event"]) {
    assert.match(sql, new RegExp(`CREATE TRIGGER ${table}_append_only`));
  }
  assert.doesNotMatch(sql, /ON DELETE CASCADE/i);
});
