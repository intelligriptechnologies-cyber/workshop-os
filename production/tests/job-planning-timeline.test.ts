import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalJobPlanningApi } from "../src/job-planning-timeline.js";

const snapshot = {
  PRICE: { masterId: "price-v", version: 2 }, TAX: { masterId: "tax-v", version: 3 },
  WORKFLOW: { masterId: "workflow-detail", version: 7 }, RECIPE: { masterId: "recipe-detail", version: 4 },
  CHECKLIST: { masterId: "checklist-detail", version: 5 }, POLICY: { masterId: "policy-v", version: 1 },
};

const memberships = {
  manager: { identityId: "manager-1", membershipId: "membership-manager", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["MANAGER"], permissions: ["job.plan.read", "job.assignment.write", "job.timeline.read", "job.timeline.internal.read", "job.timeline.evidence.read", "job.timeline.assign"] },
  reception: { identityId: "reception-1", membershipId: "membership-reception", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["RECEPTION"], permissions: ["job.plan.read", "job.timeline.read"] },
  technician: { identityId: "tech-user-1", membershipId: "membership-tech-a", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["TECHNICIAN"], permissions: ["job.plan.read", "job.timeline.read", "job.timeline.evidence.read"] },
  store: { identityId: "store-1", membershipId: "membership-store", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["STORE"], permissions: ["job.timeline.read", "job.timeline.internal.read"] },
  advisor: { identityId: "advisor-1", membershipId: "membership-advisor", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["SERVICE_ADVISOR"], permissions: ["job.plan.read", "job.timeline.read"] },
  qc: { identityId: "qc-1", membershipId: "membership-qc", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["QC"], permissions: ["job.timeline.read"] },
  accounts: { identityId: "accounts-1", membershipId: "membership-accounts", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["ACCOUNTS"], permissions: ["job.timeline.read"] },
  gate: { identityId: "gate-1", membershipId: "membership-gate", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["GATE"], permissions: ["job.timeline.read"] },
  otherBranch: { identityId: "manager-2", membershipId: "membership-jaipur", tenantId: "tenant-north", branchIds: ["branch-jaipur"], roles: ["MANAGER"], permissions: ["job.plan.read", "job.assignment.write", "job.timeline.read"] },
  otherTenant: { identityId: "manager-3", membershipId: "membership-south", tenantId: "tenant-south", branchIds: ["branch-delhi"], roles: ["MANAGER"], permissions: ["job.plan.read", "job.assignment.write", "job.timeline.read"] },
};

const exactConfiguration = {
  tenantId: "tenant-north", branchId: "branch-delhi", snapshot,
  scopePlans: [{ scopeCode: "DETAIL", tasks: [
    { key: "wash", title: "Wash and prepare", requiredSkillIds: ["wash"], bayTypeId: "wash-bay", estimatedMinutes: 30, dependsOnKeys: [], checklist: [{ key: "prewash", label: "Confirm pre-wash condition", required: true, evidenceRequired: true }], materials: [{ itemId: "shampoo", quantity: "0.25", uom: "L" }], priority: "HIGH" as const },
    { key: "coat", title: "Apply coating", requiredSkillIds: ["coating"], bayTypeId: "detail-bay", estimatedMinutes: 90, dependsOnKeys: ["wash"], checklist: [{ key: "coverage", label: "Confirm complete coverage", required: true, evidenceRequired: false }], materials: [{ itemId: "ceramic-coat", quantity: "1.00", uom: "KIT" }], priority: "URGENT" as const },
  ] }],
};

const handoff = {
  id: "work-handoff-1", activationId: "scope-activation-1", eventType: "APPROVED_SCOPE_WORK_PLANNING" as const,
  tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", snapshot,
  promisedDeliveryAt: "2026-09-11T11:00:00.000Z", occurredAt: "2026-09-11T09:30:00.000Z",
  lines: [{ id: "estimate-line-1", configurationLineId: "service-detail", scopeCode: "DETAIL", kind: "SERVICE" as const, description: "Detail", uom: "EA", quantity: "1", unitPriceMinor: "100000", subtotalMinor: "100000", discountMinor: "0", taxableMinor: "100000", taxRateBps: "1800", taxMinor: "18000", totalMinor: "118000", partialApprovalAllowed: true, payerAllocations: [{ payerId: "customer-42", amountMinor: "118000" }] }],
};

function makeApi() {
  return createLocalJobPlanningApi({
    memberships,
    planningConfigurations: [
      exactConfiguration,
      { ...structuredClone(exactConfiguration), snapshot: { ...snapshot, WORKFLOW: { masterId: "workflow-detail", version: 8 } }, scopePlans: [{ scopeCode: "DETAIL", tasks: [{ ...exactConfiguration.scopePlans[0].tasks[0], title: "MUTABLE NEW TITLE" }] }] },
    ],
    technicians: [
      { id: "tech-a", membershipId: "membership-tech-a", tenantId: "tenant-north", branchId: "branch-delhi", displayName: "Asha", skillIds: ["wash", "coating"], active: true, capacityMinutes: 100, allocatedMinutes: 20 },
      { id: "tech-b", membershipId: "membership-tech-b", tenantId: "tenant-north", branchId: "branch-delhi", displayName: "Bharat", skillIds: ["coating"], active: true, capacityMinutes: 60, allocatedMinutes: 0 },
      { id: "tech-jaipur", membershipId: "membership-tech-j", tenantId: "tenant-north", branchId: "branch-jaipur", displayName: "Jai", skillIds: ["wash", "coating"], active: true, capacityMinutes: 480, allocatedMinutes: 0 },
    ],
    bays: [
      { id: "bay-wash-1", tenantId: "tenant-north", branchId: "branch-delhi", bayTypeId: "wash-bay", active: true },
      { id: "bay-detail-1", tenantId: "tenant-north", branchId: "branch-delhi", bayTypeId: "detail-bay", active: true },
    ],
  });
}

test("approved scope resolves its exact immutable snapshot into dependency-aware work", async () => {
  const api = makeApi();
  assert.equal(api.workPlanningEvents.ingest(handoff).status, 201);
  assert.equal(api.workPlanningEvents.ingest(structuredClone(handoff)).status, 200);

  const response = await api.signIn("manager").get("/api/v1/jobs/job-42/work-plan?branchId=branch-delhi");
  assert.equal(response.status, 200);
  assert.equal(response.body.plan?.snapshot.WORKFLOW.version, 7);
  assert.deepEqual(response.body.plan?.tasks.map((task) => task.title), ["Wash and prepare", "Apply coating"]);
  const [wash, coat] = response.body.plan!.tasks;
  assert.deepEqual(coat.dependsOnTaskIds, [wash.id]);
  assert.deepEqual(wash.requiredSkillIds, ["wash"]);
  assert.equal(coat.bayTypeId, "detail-bay");
  assert.equal(coat.estimatedMinutes, 90);
  assert.equal(coat.priority, "URGENT");
  assert.equal(coat.checklist[0].configurationVersion, 5);
  assert.deepEqual(coat.materials, [{ itemId: "ceramic-coat", quantity: "1.00", uom: "KIT", recipeVersion: 4 }]);
  assert.deepEqual(wash.warnings, []);
  assert.match(coat.warnings.join(" "), /eligible technicians are over capacity/);
  assert.equal(response.body.plan?.deliveryRisk.status, "AT_RISK");
  assert.equal(response.body.plan?.deliveryRisk.projectedCompletionAt, "2026-09-11T11:30:00.000Z");
  assert.equal(api.testing.plans().length, 1, "event replay does not duplicate the plan");
  assert.equal(api.workPlanningEvents.ingest({ ...structuredClone(handoff), id: "work-handoff-replayed-activation" }).body.code, "SCOPE_ACTIVATION_ALREADY_PLANNED");
});

test("planning rejects incomplete, cyclic, or non-approved scope atomically", () => {
  const incompleteSnapshot = structuredClone(handoff) as unknown as { snapshot: Partial<typeof snapshot> };
  delete incompleteSnapshot.snapshot.CHECKLIST;
  assert.equal(makeApi().workPlanningEvents.ingest(incompleteSnapshot as never).body.code, "PLANNING_SNAPSHOT_NOT_FOUND");
  assert.equal(makeApi().workPlanningEvents.ingest({ ...structuredClone(handoff), lines: [] }).body.code, "APPROVED_WORK_LINES_REQUIRED");
  const missingDependency = structuredClone(exactConfiguration);
  missingDependency.scopePlans[0].tasks[0].dependsOnKeys = ["not-a-task"];
  const cyclic = structuredClone(exactConfiguration);
  cyclic.scopePlans[0].tasks[0].dependsOnKeys = ["coat"];
  const api = createLocalJobPlanningApi({ memberships, planningConfigurations: [missingDependency], technicians: [], bays: [] });
  assert.equal(api.workPlanningEvents.ingest(handoff).body.code, "TASK_DEPENDENCY_NOT_FOUND");
  assert.equal(api.testing.plans().length, 0);

  const cycleApi = createLocalJobPlanningApi({ memberships, planningConfigurations: [cyclic], technicians: [], bays: [] });
  assert.equal(cycleApi.workPlanningEvents.ingest(handoff).body.code, "CYCLIC_TASK_DEPENDENCY");
  assert.equal(cycleApi.testing.plans().length, 0);

  const wrongEvent = { ...structuredClone(handoff), eventType: "ESTIMATE_REJECTED" as never };
  assert.equal(makeApi().workPlanningEvents.ingest(wrongEvent).body.code, "APPROVED_SCOPE_EVENT_REQUIRED");
});

test("multi-technician assignment is eligible, capacity-aware, idempotent, and concurrency-safe", async () => {
  const api = makeApi();
  const created = api.workPlanningEvents.ingest(handoff);
  const task = created.body.plan!.tasks[1];
  const manager = api.signIn("manager");
  const path = `/api/v1/tasks/${task.id}/assignments`;
  const body = { branchId: "branch-delhi", technicianIds: ["tech-b"], responsibleTechnicianId: "tech-b" };

  const warning = await manager.post(path, body, { ifMatch: 1, idempotencyKey: "assign-coat-1", now: "2026-09-11T09:35:00.000Z" });
  assert.equal(warning.status, 409);
  assert.equal(warning.body.code, "CAPACITY_WARNING_ACKNOWLEDGEMENT_REQUIRED");
  assert.match(String(warning.body.warnings?.[0]), /30 minutes over capacity/);
  assert.equal(api.testing.assignmentHistory().length, 0);

  const acknowledged = await manager.post(path, { ...body, acknowledgeCapacityWarnings: true }, { ifMatch: 1, idempotencyKey: "assign-coat-1", now: "2026-09-11T09:35:00.000Z" });
  assert.equal(acknowledged.status, 200);
  assert.equal(acknowledged.body.resourceVersion, 2);
  assert.equal(acknowledged.body.task?.responsibleTechnicianId, "tech-b");
  assert.deepEqual(acknowledged.body.task?.technicianIds, ["tech-b"]);
  assert.equal((await manager.post(path, { ...body, acknowledgeCapacityWarnings: true }, { ifMatch: 1, idempotencyKey: "assign-coat-1", now: "2026-09-11T09:35:00.000Z" })).body.resourceVersion, 2);
  assert.equal((await manager.post(path, { ...body, responsibleTechnicianId: "tech-a", acknowledgeCapacityWarnings: true }, { ifMatch: 1, idempotencyKey: "assign-coat-1" })).body.code, "IDEMPOTENCY_KEY_REUSED");
  assert.equal((await manager.post(path, { branchId: "branch-delhi", technicianIds: ["tech-a", "tech-b"], responsibleTechnicianId: "tech-a" }, { ifMatch: 1, idempotencyKey: "stale-assignment" })).body.code, "VERSION_MISMATCH");

  const reassigned = await manager.post(path, { branchId: "branch-delhi", technicianIds: ["tech-a", "tech-b"], responsibleTechnicianId: "tech-a" }, { ifMatch: 2, idempotencyKey: "reassign-coat", now: "2026-09-11T09:40:00.000Z" });
  assert.equal(reassigned.status, 200);
  assert.equal(reassigned.body.task?.responsibleTechnicianId, "tech-a");
  assert.equal(api.testing.assignmentHistory().length, 2);
  assert.equal(api.testing.assignmentHistory()[1].previousResponsibleTechnicianId, "tech-b");
  assert.equal(api.testing.outbox().filter((event) => event.type === "S12_TASK_ASSIGNMENT_READY").length, 2);
});

test("shared job timeline has stable chronology with role and field-level permission filtering", async () => {
  const api = makeApi();
  api.workPlanningEvents.ingest(handoff);
  assert.equal(api.timelineEvents.ingest({
    id: "timeline-b", tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42",
    type: "INSPECTION_RECORDED", title: "Inspection recorded", occurredAt: "2026-09-11T09:20:00.000Z",
    details: { summary: "Paint condition checked" }, internalDetails: { marginBand: "LOW" },
    evidence: [{ id: "evidence-7", kind: "PHOTO", privateObjectRef: "tenant-north/private/photo.jpg" }],
    actions: [{ label: "Assign task", href: "/jobs/job-42/plan", requiredPermission: "job.timeline.assign" }],
  }).status, 201);
  assert.equal(api.timelineEvents.ingest({
    id: "timeline-a", tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42",
    type: "VEHICLE_CHECKED_IN", title: "Vehicle checked in", occurredAt: "2026-09-11T09:10:00.000Z",
    details: { acknowledgement: "Captured" },
  }).status, 201);
  assert.equal(api.timelineEvents.ingest({
    id: "timeline-tech-only", tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42",
    type: "TECHNICAL_NOTE", title: "Technical note", occurredAt: "2026-09-11T09:25:00.000Z",
    audienceRoles: ["TECHNICIAN", "SERVICE_ADVISOR"], details: { summary: "Clay treatment required" },
  }).status, 201);

  const reception = await api.signIn("reception").get("/api/v1/jobs/job-42/timeline?branchId=branch-delhi");
  assert.equal(reception.status, 200);
  assert.deepEqual(reception.body.timeline?.map((event) => event.title), ["Vehicle checked in", "Inspection recorded", "Work plan created"]);
  const receptionInspection = reception.body.timeline?.find((event) => event.sourceEventId === "timeline-b")!;
  assert.equal(receptionInspection.internalDetails, undefined);
  assert.equal(receptionInspection.evidence, undefined);
  assert.deepEqual(receptionInspection.actions, []);
  assert.deepEqual(receptionInspection.redactedFields, ["internalDetails", "evidence", "actions"]);

  const manager = await api.signIn("manager").get("/api/v1/jobs/job-42/timeline?branchId=branch-delhi");
  const managerInspection = manager.body.timeline?.find((event) => event.sourceEventId === "timeline-b")!;
  assert.deepEqual(managerInspection.internalDetails, { marginBand: "LOW" });
  assert.equal(managerInspection.evidence?.[0].privateObjectRef, "tenant-north/private/photo.jpg");
  assert.equal(managerInspection.actions?.[0].label, "Assign task");
  assert.deepEqual(managerInspection.redactedFields, []);

  const technician = await api.signIn("technician").get("/api/v1/jobs/job-42/timeline?branchId=branch-delhi");
  assert.ok(technician.body.timeline?.some((event) => event.title === "Technical note"));
  assert.equal(technician.body.timeline?.find((event) => event.sourceEventId === "timeline-b")?.internalDetails, undefined);
  assert.equal(api.timelineEvents.ingest(structuredClone(api.testing.timelineSourceEvents()[0])).status, 200);
  for (const role of ["advisor", "technician", "store", "qc", "accounts", "gate"] as const) {
    assert.equal((await api.signIn(role).get("/api/v1/jobs/job-42/timeline?branchId=branch-delhi")).status, 200, `${role} receives the shared chronology`);
  }
});

test("plan and assignment APIs fail closed for permission, tenant, branch, responsibility, and skill", async () => {
  const api = makeApi();
  const task = api.workPlanningEvents.ingest(handoff).body.plan!.tasks[0];
  const path = `/api/v1/tasks/${task.id}/assignments`;
  assert.equal((await api.signIn("missing").get("/api/v1/jobs/job-42/work-plan?branchId=branch-delhi")).status, 401);
  assert.equal((await api.signIn("otherBranch").get("/api/v1/jobs/job-42/work-plan?branchId=branch-delhi")).body.code, "BRANCH_FORBIDDEN");
  assert.equal((await api.signIn("otherTenant").get("/api/v1/jobs/job-42/work-plan?branchId=branch-delhi")).body.code, "WORK_PLAN_NOT_FOUND");
  assert.equal((await api.signIn("store").get("/api/v1/jobs/job-42/work-plan?branchId=branch-delhi")).body.code, "PERMISSION_DENIED");
  assert.equal((await api.signIn("reception").post(path, { branchId: "branch-delhi", technicianIds: ["tech-a"], responsibleTechnicianId: "tech-a" }, { ifMatch: 1, idempotencyKey: "no-authority" })).body.code, "PERMISSION_DENIED");
  assert.equal((await api.signIn("manager").post(path, { branchId: "branch-delhi", technicianIds: ["tech-a"], responsibleTechnicianId: "tech-b" }, { ifMatch: 1, idempotencyKey: "bad-responsible" })).body.code, "ONE_RESPONSIBLE_ASSIGNED_TECHNICIAN_REQUIRED");
  assert.equal((await api.signIn("manager").post(path, { branchId: "branch-delhi", technicianIds: ["tech-b"], responsibleTechnicianId: "tech-b" }, { ifMatch: 1, idempotencyKey: "bad-skill" })).body.code, "TECHNICIAN_NOT_ELIGIBLE");
  assert.equal((await api.signIn("manager").post(path, { branchId: "branch-delhi", technicianIds: ["tech-jaipur"], responsibleTechnicianId: "tech-jaipur" }, { ifMatch: 1, idempotencyKey: "bad-branch" })).body.code, "TECHNICIAN_NOT_ELIGIBLE");
  assert.equal(api.testing.assignmentHistory().length, 0);
  assert.deepEqual([...new Set(api.testing.outbox().map((event) => event.type))], []);
});

test("PostgreSQL planning contract forces branch RLS, DAG and responsibility constraints, and append-only evidence", async () => {
  const migration = await readFile(new URL("../db/migrations/011_job_planning_timeline.sql", import.meta.url), "utf8");
  const tables = ["work_planning_event", "work_plan", "work_task", "work_task_dependency", "work_task_assignment_history", "job_timeline_event", "job_planning_outbox", "job_planning_command_receipt"];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, activation_id\)/i);
  assert.match(migration, /CHECK \(responsible_technician_id = ANY \(technician_ids\)\)/i);
  assert.match(migration, /CHECK \(task_id <> depends_on_task_id\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, branch_id, aggregate_id, aggregate_version, event_type\)/i);
  assert.match(migration, /CREATE CONSTRAINT TRIGGER work_task_dependency_acyclic/i);
  assert.match(migration, /CREATE FUNCTION workshopos\.reject_job_planning_ledger_mutation/i);
  for (const table of ["work_planning_event", "work_plan", "work_task_assignment_history", "job_timeline_event", "job_planning_outbox", "job_planning_command_receipt"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
});
