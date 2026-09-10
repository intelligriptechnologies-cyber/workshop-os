import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ALLOWED_TRANSITIONS,
  LIFECYCLE_STAGES,
  createLocalLifecycleApi,
  evaluateLifecycleTransition,
} from "../src/lifecycle-command-engine.js";

const maker = {
  identityId: "advisor-1",
  membershipId: "membership-advisor-1",
  tenantId: "tenant-north",
  branchIds: ["branch-delhi"],
  permissions: ["lifecycle.manage", "approval.request"],
  authenticatedAt: "2026-09-10T09:55:00.000Z",
  mfa: true,
};

test("a valid lifecycle transition commits atomically once and safe replay returns its version and audit reference", async () => {
  const api = createLocalLifecycleApi({ memberships: { maker }, recentAuthenticationMinutes: 15 });
  const session = api.signIn("maker");
  const created = await session.post("/api/v1/lifecycle/resources", {
    branchId: "branch-delhi", resourceId: "job-42", resourceType: "JOB",
  }, { idempotencyKey: "create-job-42", now: "2026-09-10T10:00:00.000Z" });
  assert.equal(created.status, 201);

  const command = {
    branchId: "branch-delhi", toStage: "CHECK_IN", facts: {},
  };
  const options = {
    idempotencyKey: "check-in-job-42", ifMatch: 1, now: "2026-09-10T10:01:00.000Z",
  };
  const first = await session.post("/api/v1/lifecycle/resources/job-42/transitions", command, options);
  const replay = await Promise.resolve(session.post("/api/v1/lifecycle/resources/job-42/transitions", command, options));

  assert.equal(first.status, 200);
  assert.equal(first.body.resource?.stage, "CHECK_IN");
  assert.equal(first.body.resourceVersion, 2);
  assert.equal(replay.status, 200);
  assert.equal(replay.body.resourceVersion, first.body.resourceVersion);
  assert.equal(replay.body.auditReference, first.body.auditReference);

  const fetched = await session.get("/api/v1/lifecycle/resources/job-42?branchId=branch-delhi");
  assert.equal(fetched.body.resource?.resourceVersion, 2);
  assert.equal(fetched.body.resource?.history.length, 2);
  assert.equal(fetched.body.auditEntries?.length, 2);
});

test("the platform state table explicitly classifies every stage pair and reports actionable blockers", () => {
  for (const fromStage of LIFECYCLE_STAGES) {
    for (const toStage of LIFECYCLE_STAGES) {
      const decision = evaluateLifecycleTransition({ fromStage, toStage, facts: {} });
      assert.equal(decision.allowed, ALLOWED_TRANSITIONS[fromStage].includes(toStage as never), `${fromStage} -> ${toStage}`);
      if (!decision.allowed) assert.equal(decision.code, "TRANSITION_NOT_ALLOWED");
    }
  }

  assert.deepEqual(
    evaluateLifecycleTransition({ fromStage: "QC", toStage: "BILLING", facts: {} }),
    {
      allowed: true,
      blockers: [
        { code: "WORK_NOT_COMPLETE", message: "Complete all required work before billing.", overridable: false },
        { code: "QC_NOT_PASSED", message: "Record an independent passed QC before billing.", overridable: false },
        { code: "MATERIAL_NOT_RECONCILED", message: "Reconcile issued material before billing.", overridable: false },
        { code: "SUPPLEMENTARY_SCOPE_UNRESOLVED", message: "Resolve supplementary scope before billing.", overridable: false },
      ],
    },
  );
});

test("a threshold cancellation needs a distinct recently authenticated checker and preserves reason and evidence", async () => {
  const checker = {
    ...maker,
    identityId: "manager-1", membershipId: "membership-manager-1",
    permissions: ["approval.decide"], authenticatedAt: "2026-09-10T09:59:00.000Z",
  };
  const staleChecker = { ...checker, identityId: "manager-old", membershipId: "membership-manager-old", authenticatedAt: "2026-09-10T09:00:00.000Z" };
  const api = createLocalLifecycleApi({
    memberships: { maker, checker, staleChecker }, recentAuthenticationMinutes: 15,
    makerCheckerThresholds: { "job.cancel": 1000 },
  });
  const makerSession = api.signIn("maker");
  await makerSession.post("/api/v1/lifecycle/resources", {
    branchId: "branch-delhi", resourceId: "job-cancel", resourceType: "JOB",
  }, { idempotencyKey: "create-job-cancel", now: "2026-09-10T10:00:00.000Z" });

  const request = await makerSession.post("/api/v1/lifecycle/resources/job-cancel/approval-requests", {
    branchId: "branch-delhi", action: "job.cancel", targetStage: "CANCELLED", amountMinor: 2500,
    reason: "Customer asked to stop work", evidence: ["customer-call-recording-17"], overriddenBlockers: [],
  }, { idempotencyKey: "request-cancel", now: "2026-09-10T10:01:00.000Z" });
  assert.equal(request.status, 202);
  const approvalId = String(request.body.approval?.id);

  const selfCheck = await makerSession.post(`/api/v1/lifecycle/approvals/${approvalId}/decisions`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "self approval",
  }, { idempotencyKey: "self-check", now: "2026-09-10T10:02:00.000Z" });
  assert.equal(selfCheck.status, 403);
  assert.equal(selfCheck.body.code, "MAKER_CANNOT_CHECK");

  const stale = await api.signIn("staleChecker").post(`/api/v1/lifecycle/approvals/${approvalId}/decisions`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "approved",
  }, { idempotencyKey: "stale-check", now: "2026-09-10T10:02:00.000Z" });
  assert.equal(stale.status, 403);
  assert.equal(stale.body.code, "RECENT_AUTHENTICATION_REQUIRED");

  const approved = await api.signIn("checker").post(`/api/v1/lifecycle/approvals/${approvalId}/decisions`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Verified customer instruction",
  }, { idempotencyKey: "check-cancel", now: "2026-09-10T10:02:00.000Z" });
  assert.equal(approved.status, 200);

  const cancelled = await makerSession.post("/api/v1/lifecycle/resources/job-cancel/transitions", {
    branchId: "branch-delhi", toStage: "CANCELLED", facts: {}, amountMinor: 2500,
    reason: "Customer asked to stop work", evidence: ["customer-call-recording-17"], approvalId,
  }, { idempotencyKey: "cancel-job", ifMatch: 1, now: "2026-09-10T10:03:00.000Z" });
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.body.resource?.stage, "CANCELLED");
  assert.equal(cancelled.body.resource?.history.at(-1)?.reason, "Customer asked to stop work");
  assert.deepEqual(cancelled.body.resource?.history.at(-1)?.evidence, ["customer-call-recording-17"]);
});

test("stale, invalid, and blocked transitions are atomic no-ops while reopening restores only the prior stage", async () => {
  const api = createLocalLifecycleApi({ memberships: { maker }, recentAuthenticationMinutes: 15 });
  const session = api.signIn("maker");
  await session.post("/api/v1/lifecycle/resources", {
    branchId: "branch-delhi", resourceId: "job-atomic", resourceType: "JOB",
  }, { idempotencyKey: "create-job-atomic", now: "2026-09-10T10:00:00.000Z" });

  const stale = await session.post("/api/v1/lifecycle/resources/job-atomic/transitions", {
    branchId: "branch-delhi", toStage: "CHECK_IN", facts: {},
  }, { idempotencyKey: "stale-transition", ifMatch: 0, now: "2026-09-10T10:01:00.000Z" });
  assert.equal(stale.status, 412);

  const invalid = await session.post("/api/v1/lifecycle/resources/job-atomic/transitions", {
    branchId: "branch-delhi", toStage: "BILLING", facts: {},
  }, { idempotencyKey: "invalid-transition", ifMatch: 1, now: "2026-09-10T10:01:00.000Z" });
  assert.equal(invalid.status, 409);

  await session.post("/api/v1/lifecycle/resources/job-atomic/transitions", {
    branchId: "branch-delhi", toStage: "CHECK_IN", facts: {},
  }, { idempotencyKey: "check-in-atomic", ifMatch: 1, now: "2026-09-10T10:01:00.000Z" });
  const cancelled = await session.post("/api/v1/lifecycle/resources/job-atomic/transitions", {
    branchId: "branch-delhi", toStage: "CANCELLED", facts: {}, amountMinor: 0,
    reason: "Customer deferred the visit", evidence: ["call-note-88"],
  }, { idempotencyKey: "cancel-atomic", ifMatch: 2, now: "2026-09-10T10:02:00.000Z" });
  assert.equal(cancelled.status, 200);

  const wrongReopen = await session.post("/api/v1/lifecycle/resources/job-atomic/transitions", {
    branchId: "branch-delhi", toStage: "INSPECTION", facts: {}, amountMinor: 0,
    reason: "Customer returned", evidence: ["arrival-photo-1"],
  }, { idempotencyKey: "wrong-reopen", ifMatch: 3, now: "2026-09-10T10:03:00.000Z" });
  assert.equal(wrongReopen.status, 409);
  assert.equal(wrongReopen.body.code, "REOPEN_TARGET_MISMATCH");

  const reopened = await session.post("/api/v1/lifecycle/resources/job-atomic/transitions", {
    branchId: "branch-delhi", toStage: "CHECK_IN", facts: {}, amountMinor: 0,
    reason: "Customer returned", evidence: ["arrival-photo-1"],
  }, { idempotencyKey: "reopen-atomic", ifMatch: 3, now: "2026-09-10T10:04:00.000Z" });
  assert.equal(reopened.status, 200);
  assert.equal(reopened.body.resource?.stage, "CHECK_IN");
  assert.equal(reopened.body.resourceVersion, 4);

  const fetched = await session.get("/api/v1/lifecycle/resources/job-atomic?branchId=branch-delhi");
  assert.equal(fetched.body.resource?.history.length, 4);
  assert.equal(fetched.body.auditEntries?.length, 4);
});

test("PostgreSQL lifecycle contract forces tenant RLS and append-only command, history, approval, and audit records", async () => {
  const migration = await readFile(new URL("../db/migrations/004_lifecycle_command_engine.sql", import.meta.url), "utf8");
  for (const table of ["lifecycle_resources", "lifecycle_history", "lifecycle_approvals", "lifecycle_audit", "lifecycle_idempotency"]) {
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /CREATE OR REPLACE FUNCTION workshopos\.reject_lifecycle_ledger_mutation/i);
  assert.match(migration, /BEFORE UPDATE OR DELETE ON workshopos\.lifecycle_history/i);
  assert.match(migration, /BEFORE UPDATE OR DELETE ON workshopos\.lifecycle_audit/i);
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(migration, /resource_version bigint NOT NULL CHECK \(resource_version > 0\)/i);
});
