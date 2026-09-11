import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createLocalTechnicianExecutionApi,
  createMemoryDraftPersistence,
  createTechnicianDraftStore,
  type TaskAssignmentReadyEvent,
} from "../src/technician-execution.js";
import type { JobPlanningOutboxEvent } from "../src/job-planning-timeline.js";

const s11BoundaryIsConsumableByS12: JobPlanningOutboxEvent extends TaskAssignmentReadyEvent ? true : false = true;

const memberships = {
  asha: {
    identityId: "identity-asha", membershipId: "membership-tech-a", technicianId: "tech-a",
    tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["TECHNICIAN"],
    permissions: ["task.read", "task.progress.write", "task.checklist.write", "task.evidence.write", "scan.use"],
  },
  bharat: {
    identityId: "identity-bharat", membershipId: "membership-tech-b", technicianId: "tech-b",
    tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["TECHNICIAN"],
    permissions: ["task.read", "task.progress.write", "task.checklist.write", "task.evidence.write", "scan.use"],
  },
  jaipur: {
    identityId: "identity-jaipur", membershipId: "membership-tech-j", technicianId: "tech-j",
    tenantId: "tenant-north", branchIds: ["branch-jaipur"], roles: ["TECHNICIAN"],
    permissions: ["task.read", "task.progress.write", "task.checklist.write", "task.evidence.write", "scan.use"],
  },
  manager: {
    identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], roles: ["MANAGER"], permissions: ["task.read", "task.completion.override"],
  },
  outsider: {
    identityId: "identity-outsider", membershipId: "membership-outsider", technicianId: "tech-outsider",
    tenantId: "tenant-south", branchIds: ["branch-delhi"], roles: ["TECHNICIAN"],
    permissions: ["task.read", "task.progress.write", "task.checklist.write", "task.evidence.write", "scan.use"],
  },
};

const assignment = {
  id: "outbox-s12-1", type: "S12_TASK_ASSIGNMENT_READY" as const,
  tenantId: "tenant-north", branchId: "branch-delhi", aggregateId: "task-wash",
  aggregateVersion: 2, occurredAt: "2026-09-11T09:35:00.000Z",
  payload: {
    jobId: "job-42", taskId: "task-wash", taskVersion: 2, taskTitle: "Wash and prepare",
    priority: "HIGH", estimatedMinutes: 30, technicianIds: ["tech-a"], responsibleTechnicianId: "tech-a",
    checklist: [{ key: "prewash", label: "Confirm pre-wash condition", required: true, evidenceRequired: true, configurationVersion: 5 }],
    materials: [{ itemId: "shampoo", quantity: "0.25", uom: "L", recipeVersion: 4 }], dependencies: [],
  },
};

function makeApi() {
  return createLocalTechnicianExecutionApi({ memberships, technicians: [
    { id: "tech-a", membershipId: "membership-tech-a", tenantId: "tenant-north", branchId: "branch-delhi", active: true },
    { id: "tech-b", membershipId: "membership-tech-b", tenantId: "tenant-north", branchId: "branch-delhi", active: true },
  ], scanTargets: [] });
}

test("My Tasks consumes each S11 assignment once and shows only assigned branch work with a guided next action", async () => {
  assert.equal(s11BoundaryIsConsumableByS12, true);
  const api = makeApi();
  assert.equal(api.assignmentEvents.ingest(assignment).status, 201);
  assert.equal(api.assignmentEvents.ingest(structuredClone(assignment)).status, 200);

  const mine = await api.signIn("asha").get("/api/v1/technician/tasks?branchId=branch-delhi");
  assert.equal(mine.status, 200);
  assert.equal(mine.body.view?.title, "My Tasks");
  assert.equal(mine.body.view?.minimumTouchTargetPx, 48);
  assert.deepEqual(mine.body.view?.tasks.map((task) => task.title), ["Wash and prepare"]);
  assert.equal(mine.body.view?.tasks[0].nextAction.label, "Start task");
  assert.match(mine.body.view?.tasks[0].blockers.join(" "), /photo evidence/i);
  assert.ok(mine.body.view?.tasks[0].controls.some((control) => control.action === "CAPTURE_PHOTO"));
  assert.ok(mine.body.view?.tasks[0].controls.some((control) => control.action === "REQUEST_MATERIAL"));
  assert.ok(mine.body.view?.tasks[0].controls.every((control) => control.minimumTouchTargetPx >= 48));
  const offline = await api.signIn("asha").get("/api/v1/technician/tasks?branchId=branch-delhi&online=false");
  assert.match(offline.body.view?.offlineNotice ?? "", /stock.*blocked/i);
  assert.equal(offline.body.view?.tasks[0].controls.find((control) => control.action === "REQUEST_MATERIAL")?.enabled, false);
  assert.deepEqual((await api.signIn("bharat").get("/api/v1/technician/tasks?branchId=branch-delhi")).body.view?.tasks, []);
  assert.equal((await api.signIn("asha").get("/api/v1/technician/tasks?branchId=branch-jaipur")).body.code, "BRANCH_FORBIDDEN");
  assert.deepEqual((await api.signIn("outsider").get("/api/v1/technician/tasks?branchId=branch-delhi")).body.view?.tasks, []);
  assert.equal(api.testing.tasks().length, 1);
});

test("authorized progression preserves elapsed time and append-only status history through a technician handoff", async () => {
  const api = makeApi();
  api.assignmentEvents.ingest(assignment);
  const asha = api.signIn("asha");
  const path = "/api/v1/tasks/task-wash/commands";

  const started = await asha.post(path, { branchId: "branch-delhi", action: "START" }, { ifMatch: 2, idempotencyKey: "start-1", now: "2026-09-11T10:00:00.000Z" });
  assert.equal(started.status, 200);
  assert.equal(started.body.task?.status, "IN_PROGRESS");
  assert.equal((await asha.post(path, { branchId: "branch-delhi", action: "START" }, { ifMatch: 2, idempotencyKey: "start-1", now: "2026-09-11T10:00:00.000Z" })).body.resourceVersion, 3);
  assert.equal((await asha.post(path, { branchId: "branch-delhi", action: "PAUSE" }, { ifMatch: 3, idempotencyKey: "pause-no-reason" })).body.code, "REASON_REQUIRED");
  const paused = await asha.post(path, { branchId: "branch-delhi", action: "PAUSE", reason: "Waiting for bay" }, { ifMatch: 3, idempotencyKey: "pause-1", now: "2026-09-11T10:10:00.000Z" });
  assert.equal(paused.body.task?.elapsedSeconds, 600);
  assert.equal(paused.body.task?.status, "PAUSED");
  await asha.post(path, { branchId: "branch-delhi", action: "RESUME" }, { ifMatch: 4, idempotencyKey: "resume-1", now: "2026-09-11T10:15:00.000Z" });
  const blocked = await asha.post(path, { branchId: "branch-delhi", action: "BLOCK", reason: "Surface damage needs advisor" }, { ifMatch: 5, idempotencyKey: "block-1", now: "2026-09-11T10:20:00.000Z" });
  assert.equal(blocked.body.task?.elapsedSeconds, 900);
  assert.equal(blocked.body.task?.status, "BLOCKED");
  await asha.post(path, { branchId: "branch-delhi", action: "RESUME", reason: "Advisor cleared work" }, { ifMatch: 6, idempotencyKey: "resume-2", now: "2026-09-11T10:25:00.000Z" });
  const handed = await asha.post(path, { branchId: "branch-delhi", action: "HANDOFF", reason: "Shift ending", targetTechnicianId: "tech-b" }, { ifMatch: 7, idempotencyKey: "handoff-1", now: "2026-09-11T10:30:00.000Z" });
  assert.equal(handed.body.task?.status, "HANDED_OFF");
  assert.equal(handed.body.task?.elapsedSeconds, 1200);
  assert.deepEqual(handed.body.task?.technicianIds, ["tech-b"]);
  assert.deepEqual((await asha.get("/api/v1/technician/tasks?branchId=branch-delhi")).body.view?.tasks, []);
  assert.equal((await api.signIn("bharat").get("/api/v1/technician/tasks?branchId=branch-delhi")).body.view?.tasks[0].nextAction.label, "Accept and start");
  assert.equal((await asha.post(path, { branchId: "branch-delhi", action: "RESUME" }, { ifMatch: 8, idempotencyKey: "former-tech" })).body.code, "TASK_NOT_ASSIGNED");
  assert.equal((await api.signIn("bharat").post(path, { branchId: "branch-delhi", action: "START" }, { ifMatch: 7, idempotencyKey: "stale" })).body.code, "VERSION_MISMATCH");

  const history = api.testing.statusHistory();
  assert.deepEqual(history.map((entry) => [entry.priorStatus, entry.newStatus]), [
    ["ASSIGNED", "IN_PROGRESS"], ["IN_PROGRESS", "PAUSED"], ["PAUSED", "IN_PROGRESS"],
    ["IN_PROGRESS", "BLOCKED"], ["BLOCKED", "IN_PROGRESS"], ["IN_PROGRESS", "HANDED_OFF"],
  ]);
  assert.equal(history[5].actorMembershipId, "membership-tech-a");
  assert.equal(new Set(history.map((entry) => entry.auditReference)).size, 6);
});

test("snapshotted checklist and clean private evidence block completion until satisfied", async () => {
  const api = makeApi();
  api.assignmentEvents.ingest(assignment);
  const tech = api.signIn("asha");
  const commands = "/api/v1/tasks/task-wash/commands";
  await tech.post(commands, { branchId: "branch-delhi", action: "START" }, { ifMatch: 2, idempotencyKey: "evidence-start", now: "2026-09-11T11:00:00.000Z" });
  const blocked = await tech.post(commands, { branchId: "branch-delhi", action: "COMPLETE" }, { ifMatch: 3, idempotencyKey: "complete-too-soon", now: "2026-09-11T11:05:00.000Z" });
  assert.equal(blocked.body.code, "TASK_COMPLETION_BLOCKED");
  assert.match(String(blocked.body.blockers), /checklist/i);
  assert.match(String(blocked.body.blockers), /clean private photo evidence/i);

  const badEvidence = await tech.post("/api/v1/tasks/task-wash/evidence", {
    branchId: "branch-delhi", id: "evidence-prewash", checklistKey: "prewash", kind: "PHOTO",
    privateObjectRef: "public/photo.jpg", contentType: "image/jpeg", checksum: "a".repeat(64),
    scanStatus: "CLEAN", sizeBytes: 2048, capturedAt: "2026-09-11T11:03:00.000Z",
  }, { ifMatch: 3, idempotencyKey: "bad-evidence" });
  assert.equal(badEvidence.body.code, "PRIVATE_EVIDENCE_REQUIRED");
  const evidence = await tech.post("/api/v1/tasks/task-wash/evidence", {
    branchId: "branch-delhi", id: "evidence-prewash", checklistKey: "prewash", kind: "PHOTO",
    privateObjectRef: "tenant-north/branch-delhi/private/tasks/task-wash/evidence-prewash.jpg", contentType: "image/jpeg",
    checksum: "a".repeat(64), scanStatus: "CLEAN", sizeBytes: 2048, capturedAt: "2026-09-11T11:03:00.000Z",
  }, { ifMatch: 3, idempotencyKey: "good-evidence" });
  assert.equal(evidence.status, 201);
  assert.equal(evidence.body.resourceVersion, 4);
  const checked = await tech.post("/api/v1/tasks/task-wash/checklist/prewash", {
    branchId: "branch-delhi", checked: true, evidenceId: "evidence-prewash",
  }, { ifMatch: 4, idempotencyKey: "check-prewash", now: "2026-09-11T11:04:00.000Z" });
  assert.equal(checked.status, 200);
  assert.deepEqual(checked.body.task?.blockers, []);
  const completed = await tech.post(commands, { branchId: "branch-delhi", action: "COMPLETE" }, { ifMatch: 5, idempotencyKey: "complete-ready", now: "2026-09-11T11:10:00.000Z" });
  assert.equal(completed.body.task?.status, "COMPLETED");
  assert.equal(completed.body.task?.elapsedSeconds, 600);
  assert.equal(completed.body.task?.nextAction.label, "View completed work");
  assert.equal(api.testing.completionOutbox()[0].type, "S16_TASK_COMPLETION_READY");
  assert.equal(api.testing.completionOutbox()[0].payload.qcStatus, "PENDING_INDEPENDENT_QC");
  assert.equal(api.testing.evidenceHistory().length, 1);
  assert.equal(api.testing.checklistHistory().length, 1);
});

test("an independent authorized manager can explicitly override completion blockers with reasoned audit evidence", async () => {
  const api = makeApi();
  api.assignmentEvents.ingest(assignment);
  await api.signIn("asha").post("/api/v1/tasks/task-wash/commands", { branchId: "branch-delhi", action: "START" }, { ifMatch: 2, idempotencyKey: "override-start", now: "2026-09-11T12:00:00.000Z" });
  const response = await api.signIn("manager").post("/api/v1/tasks/task-wash/completion-overrides", {
    branchId: "branch-delhi", reason: "Emergency release approved after evidence device failure",
  }, { ifMatch: 3, idempotencyKey: "override-complete", now: "2026-09-11T12:05:00.000Z" });
  assert.equal(response.status, 200);
  assert.equal(response.body.task?.status, "COMPLETED");
  assert.match(String(response.body.overriddenBlockers), /pre-wash/i);
  assert.equal(api.testing.completionOverrides()[0].actorMembershipId, "membership-manager");
  assert.equal(api.testing.completionOutbox()[0].payload.qcStatus, "PENDING_INDEPENDENT_QC");
  assert.notEqual(api.testing.completionOverrides()[0].technicianMembershipId, "membership-manager");
});

test("camera and hardware scans validate scope, object and state while manual fallback requires audited reason", async () => {
  const api = createLocalTechnicianExecutionApi({ memberships, technicians: [
    { id: "tech-a", membershipId: "membership-tech-a", tenantId: "tenant-north", branchId: "branch-delhi", active: true },
  ], scanTargets: [
    { code: "QR-TASK-42", tenantId: "tenant-north", branchId: "branch-delhi", objectType: "TASK", objectId: "task-wash", state: "ASSIGNED", allowedStates: ["ASSIGNED", "IN_PROGRESS"], requiredPermission: "scan.use" },
    { code: "ITEM-SHAMP", tenantId: "tenant-north", branchId: "branch-delhi", objectType: "ITEM", objectId: "shampoo", state: "ACTIVE", allowedStates: ["ACTIVE"], requiredPermission: "scan.use" },
    { code: "DOC-VOID", tenantId: "tenant-north", branchId: "branch-delhi", objectType: "DOCUMENT", objectId: "gate-pass-old", state: "VOID", allowedStates: ["ISSUED"], requiredPermission: "scan.use" },
    { code: "FOREIGN", tenantId: "tenant-south", branchId: "branch-delhi", objectType: "ITEM", objectId: "other-item", state: "ACTIVE", allowedStates: ["ACTIVE"], requiredPermission: "scan.use" },
  ] });
  api.assignmentEvents.ingest(assignment);
  const tech = api.signIn("asha");
  const path = "/api/v1/technician/scans";
  const camera = await tech.post(path, { branchId: "branch-delhi", source: "CAMERA", code: "QR-TASK-42", expectedObjectType: "TASK", expectedObjectId: "task-wash" }, { idempotencyKey: "scan-camera", now: "2026-09-11T13:00:00.000Z" });
  assert.equal(camera.status, 200);
  assert.equal(camera.body.objectId, "task-wash");
  assert.equal((await tech.post(path, { branchId: "branch-delhi", source: "HARDWARE", code: "ITEM-SHAMP", expectedObjectType: "TASK" }, { idempotencyKey: "wrong-type" })).body.code, "SCAN_OBJECT_MISMATCH");
  assert.equal((await tech.post(path, { branchId: "branch-delhi", source: "HARDWARE", code: "DOC-VOID", expectedObjectType: "DOCUMENT" }, { idempotencyKey: "void-document" })).body.code, "SCAN_STATE_NOT_ALLOWED");
  assert.equal((await tech.post(path, { branchId: "branch-delhi", source: "CAMERA", code: "FOREIGN", expectedObjectType: "ITEM" }, { idempotencyKey: "foreign-scan" })).body.code, "SCAN_NOT_FOUND");
  assert.equal((await tech.post(path, { branchId: "branch-delhi", source: "MANUAL", code: "ITEM-SHAMP", expectedObjectType: "ITEM" }, { idempotencyKey: "manual-no-reason" })).body.code, "MANUAL_FALLBACK_REASON_REQUIRED");
  const manual = await tech.post(path, { branchId: "branch-delhi", source: "MANUAL", code: "ITEM-SHAMP", expectedObjectType: "ITEM", reason: "Camera lens damaged" }, { idempotencyKey: "manual-reason", now: "2026-09-11T13:01:00.000Z" });
  assert.equal(manual.status, 200);
  assert.equal(api.testing.scanAudit().length, 2);
  assert.equal(api.testing.scanAudit()[1].source, "MANUAL");
  assert.equal(api.testing.scanAudit()[1].reason, "Camera lens damaged");
  assert.equal((await api.signIn("manager").post(path, { branchId: "branch-delhi", source: "CAMERA", code: "ITEM-SHAMP", expectedObjectType: "ITEM" }, { idempotencyKey: "manager-no-scan" })).body.code, "PERMISSION_DENIED");
});

test("durable local drafts survive restart, retry with one key, expose conflicts, and require user-controlled recovery", async () => {
  const persistence = createMemoryDraftPersistence();
  const scope = { tenantId: "tenant-north", branchId: "branch-delhi", technicianId: "tech-a" };
  const first = createTechnicianDraftStore(persistence, scope);
  const saved = first.save({ id: "draft-note-1", taskId: "task-wash", kind: "NOTES", payload: { text: "Small scratch near mirror" }, baseVersion: 3, now: "2026-09-11T14:00:00.000Z" });
  assert.equal(saved.ok, true);
  assert.equal(saved.draft?.commitState, "UNCOMMITTED");
  assert.equal(saved.draft?.syncState, "PENDING");
  assert.equal(saved.draft?.stateLabel, "Not saved to WorkshopOS yet");
  const originalKey = saved.draft!.idempotencyKey;

  const afterRestart = createTechnicianDraftStore(persistence, scope);
  assert.equal(afterRestart.list()[0].payload.text, "Small scratch near mirror");
  const retry = await afterRestart.sync("draft-note-1", async (request) => {
    assert.equal(request.idempotencyKey, originalKey);
    throw new Error("network unavailable");
  });
  assert.equal(retry.code, "SYNC_RETRY_PENDING");
  assert.equal(afterRestart.list()[0].idempotencyKey, originalKey);
  assert.equal(afterRestart.list()[0].syncState, "RETRY_PENDING");

  const conflicted = await createTechnicianDraftStore(persistence, scope).sync("draft-note-1", async (request) => {
    assert.equal(request.idempotencyKey, originalKey);
    return { status: 412, resourceVersion: 6, serverState: { text: "Advisor note changed" } };
  });
  assert.equal(conflicted.code, "SYNC_CONFLICT");
  assert.equal(conflicted.draft?.syncState, "CONFLICT");
  assert.deepEqual(conflicted.draft?.conflict?.serverState, { text: "Advisor note changed" });
  const rebased = createTechnicianDraftStore(persistence, scope).resolveConflict("draft-note-1", "KEEP_MINE", { currentVersion: 6, now: "2026-09-11T14:05:00.000Z" });
  assert.equal(rebased.draft?.baseVersion, 6);
  assert.notEqual(rebased.draft?.idempotencyKey, originalKey);
  assert.equal(rebased.draft?.syncState, "PENDING");
  const committed = await createTechnicianDraftStore(persistence, scope).sync("draft-note-1", async () => ({ status: 200, resourceVersion: 7 }));
  assert.equal(committed.draft?.commitState, "COMMITTED");
  assert.equal(committed.draft?.stateLabel, "Saved to WorkshopOS");
});

test("offline draft storage categorically blocks every authoritative posting class", () => {
  const store = createTechnicianDraftStore(createMemoryDraftPersistence(), { tenantId: "tenant-north", branchId: "branch-delhi", technicianId: "tech-a" });
  for (const kind of ["STOCK", "APPROVAL", "FINANCE", "QC_OVERRIDE", "CLOSURE", "GATE"] as const) {
    const response = store.save({ id: `forbidden-${kind}`, taskId: "task-wash", kind, payload: { action: "POST" }, baseVersion: 3 });
    assert.equal(response.ok, false);
    assert.equal(response.code, "OFFLINE_AUTHORITATIVE_OPERATION_BLOCKED");
    assert.match(response.message!, new RegExp(kind.replace("_", " "), "i"));
  }
  assert.deepEqual(store.list(), []);
});

test("PostgreSQL technician execution contract forces scoped RLS, immutable evidence, and idempotent completion effects", async () => {
  const migration = await readFile(new URL("../db/migrations/012_technician_execution.sql", import.meta.url), "utf8");
  const tables = [
    "technician_assignment_event", "technician_task", "technician_task_status_history", "technician_task_checklist_history",
    "technician_task_evidence", "technician_completion_override", "technician_scan_audit", "technician_execution_outbox", "technician_command_receipt",
  ];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /UNIQUE \(tenant_id, source_event_id\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, aggregate_id, aggregate_version, event_type\)/i);
  assert.match(migration, /PENDING_INDEPENDENT_QC/i);
  assert.match(migration, /scan_status = 'CLEAN'/i);
  assert.match(migration, /source <> 'MANUAL' OR reason IS NOT NULL/i);
  assert.match(migration, /CREATE FUNCTION workshopos\.reject_technician_execution_ledger_mutation/i);
  for (const table of ["technician_assignment_event", "technician_task_status_history", "technician_task_checklist_history", "technician_task_evidence", "technician_completion_override", "technician_scan_audit", "technician_execution_outbox", "technician_command_receipt"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
});
