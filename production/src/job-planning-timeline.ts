import { createHash } from "node:crypto";

type Role = "RECEPTION" | "SERVICE_ADVISOR" | "TECHNICIAN" | "STORE" | "QC" | "ACCOUNTS" | "GATE" | "MANAGER";
type Priority = "URGENT" | "HIGH" | "NORMAL" | "LOW";
type SnapshotReference = { masterId: string; version: number };
type Snapshot = Record<"PRICE" | "TAX" | "WORKFLOW" | "RECIPE" | "CHECKLIST" | "POLICY", SnapshotReference>;

export type JobPlanningMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  roles: string[];
  permissions: string[];
};

export type WorkPlanningHandoff = {
  id: string;
  activationId: string;
  eventType: "APPROVED_SCOPE_WORK_PLANNING";
  tenantId: string;
  branchId: string;
  jobId: string;
  snapshot: Snapshot;
  promisedDeliveryAt?: string;
  occurredAt: string;
  lines: Array<{
    id: string;
    scopeCode: string;
    kind: "SERVICE" | "PACKAGE" | "LABOUR" | "MATERIAL";
    description: string;
    [key: string]: unknown;
  }>;
};

type TaskTemplate = {
  key: string;
  title: string;
  requiredSkillIds: string[];
  bayTypeId: string;
  estimatedMinutes: number;
  dependsOnKeys: string[];
  checklist: Array<{ key: string; label: string; required: boolean; evidenceRequired: boolean }>;
  materials: Array<{ itemId: string; quantity: string; uom: string }>;
  priority: Priority;
};

export type PlanningConfiguration = {
  tenantId: string;
  branchId: string;
  snapshot: Snapshot;
  scopePlans: Array<{ scopeCode: string; tasks: TaskTemplate[] }>;
};

export type PlanningTechnician = {
  id: string;
  membershipId: string;
  tenantId: string;
  branchId: string;
  displayName: string;
  skillIds: string[];
  active: boolean;
  capacityMinutes: number;
  allocatedMinutes: number;
};

export type PlanningBay = {
  id: string;
  tenantId: string;
  branchId: string;
  bayTypeId: string;
  active: boolean;
};

type WorkTask = {
  id: string;
  sourceLineId: string;
  templateKey: string;
  title: string;
  requiredSkillIds: string[];
  bayTypeId: string;
  estimatedMinutes: number;
  dependsOnTaskIds: string[];
  checklist: Array<{ key: string; label: string; required: boolean; evidenceRequired: boolean; configurationVersion: number }>;
  materials: Array<{ itemId: string; quantity: string; uom: string; recipeVersion: number }>;
  priority: Priority;
  technicianIds: string[];
  responsibleTechnicianId?: string;
  resourceVersion: number;
  warnings: string[];
};

type WorkPlan = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  activationId: string;
  sourceEventId: string;
  snapshot: Snapshot;
  tasks: WorkTask[];
  deliveryRisk: { status: "ON_TRACK" | "AT_RISK" | "NO_PROMISE"; projectedCompletionAt: string; promisedDeliveryAt?: string; reasons: string[] };
  resourceVersion: number;
  createdAt: string;
};

type AssignmentHistory = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  taskId: string;
  technicianIds: string[];
  responsibleTechnicianId: string;
  previousTechnicianIds: string[];
  previousResponsibleTechnicianId?: string;
  actorMembershipId: string;
  occurredAt: string;
  warnings: string[];
  warningsAcknowledged: boolean;
  auditReference: string;
};
export type JobPlanningOutboxEvent = {
  id: string;
  tenantId: string;
  branchId: string;
  aggregateId: string;
  aggregateVersion: number;
  type: "S12_TASK_ASSIGNMENT_READY";
  payload: {
    jobId: string;
    taskId: string;
    taskVersion: number;
    taskTitle: string;
    priority: Priority;
    estimatedMinutes: number;
    technicianIds: string[];
    responsibleTechnicianId: string;
    checklist: WorkTask["checklist"];
    materials: WorkTask["materials"];
    dependencies: string[];
    warnings: string[];
  };
  occurredAt: string;
};
type TimelineAction = { label: string; href: string; requiredPermission: string };
type TimelineSourceEvent = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  type: string;
  title: string;
  occurredAt: string;
  actorMembershipId?: string;
  details?: Record<string, unknown>;
  internalDetails?: Record<string, unknown>;
  evidence?: Array<{ id: string; kind: string; privateObjectRef: string }>;
  actions?: TimelineAction[];
  audienceRoles?: Role[];
};
type TimelineItem = TimelineSourceEvent & { sourceEventId: string; actions: TimelineAction[]; redactedFields: string[] };
type ApiBody = { code?: string; plan?: WorkPlan; task?: WorkTask; timeline?: TimelineItem[]; warnings?: string[]; resourceVersion?: number; auditReference?: string; [key: string]: unknown };
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { ifMatch?: number; idempotencyKey?: string; now?: string };

const clone = <T>(value: T): T => structuredClone(value);
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sameSnapshot = (left: Snapshot, right: Snapshot) =>
  (Object.keys(left) as Array<keyof Snapshot>).every((key) => Boolean(right?.[key]) && left[key].masterId === right[key].masterId && left[key].version === right[key].version);
const ALL_TIMELINE_ROLES: Role[] = ["RECEPTION", "SERVICE_ADVISOR", "TECHNICIAN", "STORE", "QC", "ACCOUNTS", "GATE", "MANAGER"];

function longestPathMinutes(tasks: WorkTask[]): number {
  const totals = new Map<string, number>();
  const visit = (task: WorkTask, visiting: Set<string>): number => {
    const prior = totals.get(task.id);
    if (prior !== undefined) return prior;
    if (visiting.has(task.id)) throw new Error("CYCLIC_TASK_DEPENDENCY");
    visiting.add(task.id);
    const dependencies = task.dependsOnTaskIds.map((id) => tasks.find((candidate) => candidate.id === id)!);
    const total = task.estimatedMinutes + Math.max(0, ...dependencies.map((dependency) => visit(dependency, visiting)));
    visiting.delete(task.id);
    totals.set(task.id, total);
    return total;
  };
  return Math.max(0, ...tasks.map((task) => visit(task, new Set())));
}

export function createLocalJobPlanningApi(input: {
  memberships: Record<string, JobPlanningMembership>;
  planningConfigurations: PlanningConfiguration[];
  technicians: PlanningTechnician[];
  bays: PlanningBay[];
}) {
  const plans = new Map<string, WorkPlan>();
  const consumedEvents = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const consumedActivations = new Set<string>();
  const assignmentHistory: AssignmentHistory[] = [];
  const outbox: JobPlanningOutboxEvent[] = [];
  const timeline = new Map<string, { fingerprint: string; event: TimelineSourceEvent }>();
  const externalTimelineEvents: TimelineSourceEvent[] = [];
  let planSequence = 0;
  let auditSequence = 0;

  const appendTimeline = (event: TimelineSourceEvent, external = false): ApiResponse => {
    const key = `${event.tenantId}:${event.id}`;
    const fingerprint = digest(event);
    const prior = timeline.get(key);
    if (prior) return prior.fingerprint === fingerprint ? { status: 200, body: {} } : { status: 409, body: { code: "TIMELINE_EVENT_ID_REUSED" } };
    timeline.set(key, { fingerprint, event: clone(event) });
    if (external) externalTimelineEvents.push(clone(event));
    return { status: 201, body: {} };
  };

  const ingest = (event: WorkPlanningHandoff): ApiResponse => {
    if (event.eventType !== "APPROVED_SCOPE_WORK_PLANNING") return { status: 422, body: { code: "APPROVED_SCOPE_EVENT_REQUIRED" } };
    if (!Array.isArray(event.lines) || event.lines.length === 0 || event.lines.some((line) => line.kind === "MATERIAL")) {
      return { status: 422, body: { code: "APPROVED_WORK_LINES_REQUIRED" } };
    }
    const eventKey = `${event.tenantId}:${event.id}`;
    const fingerprint = digest(event);
    const prior = consumedEvents.get(eventKey);
    if (prior) return prior.fingerprint === fingerprint ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "WORK_PLANNING_EVENT_ID_REUSED" } };
    if (consumedActivations.has(`${event.tenantId}:${event.activationId}`)) return { status: 409, body: { code: "SCOPE_ACTIVATION_ALREADY_PLANNED" } };
    const configuration = input.planningConfigurations.find((candidate) => candidate.tenantId === event.tenantId && candidate.branchId === event.branchId && sameSnapshot(candidate.snapshot, event.snapshot));
    if (!configuration) return { status: 422, body: { code: "PLANNING_SNAPSHOT_NOT_FOUND" } };
    for (const line of event.lines) {
      const scope = configuration.scopePlans.find((candidate) => candidate.scopeCode === line.scopeCode);
      if (!scope) return { status: 422, body: { code: "APPROVED_SCOPE_PLAN_NOT_FOUND" } };
      const keys = new Set(scope.tasks.map((task) => task.key));
      if (keys.size !== scope.tasks.length) return { status: 422, body: { code: "DUPLICATE_TASK_TEMPLATE_KEY" } };
      if (scope.tasks.some((task) => task.dependsOnKeys.some((key) => !keys.has(key)))) {
        return { status: 422, body: { code: "TASK_DEPENDENCY_NOT_FOUND" } };
      }
      const state = new Map<string, "VISITING" | "VISITED">();
      const byKey = new Map(scope.tasks.map((task) => [task.key, task]));
      const cyclic = (key: string): boolean => {
        if (state.get(key) === "VISITING") return true;
        if (state.get(key) === "VISITED") return false;
        state.set(key, "VISITING");
        if (byKey.get(key)!.dependsOnKeys.some(cyclic)) return true;
        state.set(key, "VISITED");
        return false;
      };
      if (scope.tasks.some((task) => cyclic(task.key))) return { status: 422, body: { code: "CYCLIC_TASK_DEPENDENCY" } };
    }
    const planId = `work-plan-${++planSequence}`;
    const tasks: WorkTask[] = [];
    for (const line of event.lines) {
      const scope = configuration.scopePlans.find((candidate) => candidate.scopeCode === line.scopeCode);
      if (!scope) return { status: 422, body: { code: "APPROVED_SCOPE_PLAN_NOT_FOUND" } };
      const ids = new Map(scope.tasks.map((template, index) => [template.key, `${planId}-task-${tasks.length + index + 1}`]));
      for (const template of scope.tasks) {
        const eligible = input.technicians.filter((technician) => technician.tenantId === event.tenantId && technician.branchId === event.branchId && technician.active &&
          template.requiredSkillIds.every((skill) => technician.skillIds.includes(skill)));
        const warnings = [
          ...(!input.bays.some((bay) => bay.tenantId === event.tenantId && bay.branchId === event.branchId && bay.active && bay.bayTypeId === template.bayTypeId)
            ? [`No active ${template.bayTypeId} bay is available in this branch.`] : []),
          ...(eligible.length === 0 ? ["No active branch technician has every required skill."] :
            eligible.every((technician) => technician.allocatedMinutes + template.estimatedMinutes > technician.capacityMinutes)
              ? ["All eligible technicians are over capacity for this task."] : []),
        ];
        tasks.push({
          id: ids.get(template.key)!, sourceLineId: line.id, templateKey: template.key, title: template.title,
          requiredSkillIds: clone(template.requiredSkillIds), bayTypeId: template.bayTypeId,
          estimatedMinutes: template.estimatedMinutes,
          dependsOnTaskIds: template.dependsOnKeys.map((key) => ids.get(key)!).filter(Boolean),
          checklist: template.checklist.map((item) => ({ ...clone(item), configurationVersion: event.snapshot.CHECKLIST.version })),
          materials: template.materials.map((material) => ({ ...clone(material), recipeVersion: event.snapshot.RECIPE.version })),
          priority: template.priority, technicianIds: [], resourceVersion: 1,
          warnings,
        });
      }
    }
    const pathMinutes = longestPathMinutes(tasks);
    const projectedCompletionAt = new Date(Date.parse(event.occurredAt) + pathMinutes * 60_000).toISOString();
    const reasons = event.promisedDeliveryAt && Date.parse(projectedCompletionAt) > Date.parse(event.promisedDeliveryAt)
      ? ["The planned critical path exceeds the promised delivery time."] : [];
    const plan: WorkPlan = {
      id: planId, tenantId: event.tenantId, branchId: event.branchId, jobId: event.jobId,
      activationId: event.activationId, sourceEventId: event.id, snapshot: clone(event.snapshot), tasks,
      deliveryRisk: { status: !event.promisedDeliveryAt ? "NO_PROMISE" : reasons.length ? "AT_RISK" : "ON_TRACK", projectedCompletionAt, ...(event.promisedDeliveryAt ? { promisedDeliveryAt: event.promisedDeliveryAt } : {}), reasons },
      resourceVersion: 1, createdAt: event.occurredAt,
    };
    plans.set(`${event.tenantId}:${event.jobId}`, plan);
    consumedActivations.add(`${event.tenantId}:${event.activationId}`);
    appendTimeline({ id: `plan:${event.id}`, tenantId: event.tenantId, branchId: event.branchId, jobId: event.jobId,
      type: "WORK_PLAN_CREATED", title: "Work plan created", occurredAt: event.occurredAt,
      details: { taskCount: tasks.length, deliveryRisk: plan.deliveryRisk.status } });
    const response = { status: 201, body: { plan: clone(plan) } };
    consumedEvents.set(eventKey, { fingerprint, response: clone(response) });
    return response;
  };

  return {
    workPlanningEvents: { ingest },
    timelineEvents: {
      ingest(event: TimelineSourceEvent): ApiResponse {
        const plan = plans.get(`${event.tenantId}:${event.jobId}`);
        if (!plan || plan.branchId !== event.branchId) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
        if (!event.id?.trim() || !event.type?.trim() || !event.title?.trim() || !Number.isFinite(Date.parse(event.occurredAt))) {
          return { status: 422, body: { code: "INVALID_TIMELINE_EVENT" } };
        }
        if (event.audienceRoles?.some((role) => !ALL_TIMELINE_ROLES.includes(role))) return { status: 422, body: { code: "INVALID_TIMELINE_AUDIENCE" } };
        return appendTimeline(event, true);
      },
    },
    testing: {
      plans: () => clone([...plans.values()]),
      assignmentHistory: () => clone(assignmentHistory),
      outbox: () => clone(outbox),
      timelineSourceEvents: () => clone(externalTimelineEvents),
    },
    signIn(token: string) {
      const member = input.memberships[token];
      return {
        async get(path: string): Promise<ApiResponse> {
          if (!member) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const url = new URL(path, "https://local.workshopos.test");
          const timelineMatch = url.pathname.match(/^\/api\/v1\/jobs\/([^/]+)\/timeline$/);
          if (timelineMatch) {
            if (!member.permissions.includes("job.timeline.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            const branchId = url.searchParams.get("branchId");
            if (!branchId || !member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
            const plan = plans.get(`${member.tenantId}:${timelineMatch[1]}`);
            if (!plan || plan.branchId !== branchId) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
            const visible = [...timeline.values()].map((stored) => stored.event)
              .filter((event) => event.tenantId === member.tenantId && event.branchId === branchId && event.jobId === plan.jobId)
              .filter((event) => (event.audienceRoles ?? ALL_TIMELINE_ROLES).some((role) => member.roles.includes(role)))
              .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt) || left.id.localeCompare(right.id))
              .map((event): TimelineItem => {
                const redactedFields: string[] = [];
                const canReadInternal = member.permissions.includes("job.timeline.internal.read");
                const canReadEvidence = member.permissions.includes("job.timeline.evidence.read");
                const actions = (event.actions ?? []).filter((action) => member.permissions.includes(action.requiredPermission));
                if (event.internalDetails && !canReadInternal) redactedFields.push("internalDetails");
                if (event.evidence && !canReadEvidence) redactedFields.push("evidence");
                if ((event.actions?.length ?? 0) !== actions.length) redactedFields.push("actions");
                return { id: event.id, sourceEventId: event.id, tenantId: event.tenantId, branchId: event.branchId,
                  jobId: event.jobId, type: event.type, title: event.title, occurredAt: event.occurredAt,
                  ...(event.actorMembershipId ? { actorMembershipId: event.actorMembershipId } : {}),
                  ...(event.details ? { details: clone(event.details) } : {}),
                  ...(canReadInternal && event.internalDetails ? { internalDetails: clone(event.internalDetails) } : {}),
                  ...(canReadEvidence && event.evidence ? { evidence: clone(event.evidence) } : {}),
                  ...(event.audienceRoles ? { audienceRoles: clone(event.audienceRoles) } : {}), actions: clone(actions), redactedFields };
              });
            return { status: 200, body: { timeline: visible } };
          }
          const match = url.pathname.match(/^\/api\/v1\/jobs\/([^/]+)\/work-plan$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          if (!member.permissions.includes("job.plan.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const branchId = url.searchParams.get("branchId");
          if (!branchId || !member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const plan = plans.get(`${member.tenantId}:${match[1]}`);
          if (!plan || plan.branchId !== branchId) return { status: 404, body: { code: "WORK_PLAN_NOT_FOUND" } };
          return { status: 200, body: { plan: clone(plan) } };
        },
        async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
          if (!member) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const match = path.match(/^\/api\/v1\/tasks\/([^/]+)\/assignments$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          if (!member.permissions.includes("job.assignment.write")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const branchId = typeof body.branchId === "string" ? body.branchId : "";
          if (!member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const located = [...plans.values()].map((plan) => ({ plan, task: plan.tasks.find((task) => task.id === match[1]) }))
            .find((candidate) => candidate.task && candidate.plan.tenantId === member.tenantId && candidate.plan.branchId === branchId);
          if (!located?.task) return { status: 404, body: { code: "TASK_NOT_FOUND" } };
          if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
          const commandKey = `${member.tenantId}:${options.idempotencyKey}`;
          const fingerprint = digest({ path, body, ifMatch: options.ifMatch });
          const prior = commands.get(commandKey);
          if (prior) return prior.fingerprint === fingerprint ? clone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
          if (!Number.isInteger(options.ifMatch) || options.ifMatch !== located.task.resourceVersion) {
            return { status: 412, body: { code: "VERSION_MISMATCH", resourceVersion: located.task.resourceVersion } };
          }
          if (!Array.isArray(body.technicianIds) || body.technicianIds.length === 0 ||
              body.technicianIds.some((id) => typeof id !== "string") || new Set(body.technicianIds).size !== body.technicianIds.length ||
              typeof body.responsibleTechnicianId !== "string" || !body.technicianIds.includes(body.responsibleTechnicianId)) {
            return { status: 422, body: { code: "ONE_RESPONSIBLE_ASSIGNED_TECHNICIAN_REQUIRED" } };
          }
          const technicianIds = body.technicianIds as string[];
          const selected = technicianIds.map((id) => input.technicians.find((technician) => technician.id === id));
          if (selected.some((technician) => !technician || !technician.active || technician.tenantId !== member.tenantId || technician.branchId !== branchId ||
              located.task!.requiredSkillIds.some((skill) => !technician.skillIds.includes(skill)))) {
            return { status: 422, body: { code: "TECHNICIAN_NOT_ELIGIBLE" } };
          }
          const share = Math.ceil(located.task.estimatedMinutes / technicianIds.length);
          const warnings = selected.flatMap((technician) => {
            const otherAssignedMinutes = [...plans.values()].filter((plan) => plan.tenantId === member.tenantId && plan.branchId === branchId)
              .flatMap((plan) => plan.tasks).filter((task) => task.id !== located.task!.id && task.technicianIds.includes(technician!.id))
              .reduce((total, task) => total + Math.ceil(task.estimatedMinutes / task.technicianIds.length), 0);
            const over = technician!.allocatedMinutes + otherAssignedMinutes + share - technician!.capacityMinutes;
            return over > 0 ? [`${technician!.displayName} would be ${over} minutes over capacity.`] : [];
          });
          if (warnings.length && body.acknowledgeCapacityWarnings !== true) {
            return { status: 409, body: { code: "CAPACITY_WARNING_ACKNOWLEDGEMENT_REQUIRED", warnings } };
          }
          const now = options.now ?? new Date().toISOString();
          const previousTechnicianIds = clone(located.task.technicianIds);
          const previousResponsibleTechnicianId = located.task.responsibleTechnicianId;
          located.task.technicianIds = clone(technicianIds);
          located.task.responsibleTechnicianId = body.responsibleTechnicianId;
          located.task.resourceVersion += 1;
          located.task.warnings = clone(warnings);
          const auditReference = `audit-work-assignment-${++auditSequence}`;
          assignmentHistory.push({ id: `assignment-${assignmentHistory.length + 1}`, tenantId: member.tenantId, branchId,
            jobId: located.plan.jobId, taskId: located.task.id, technicianIds: clone(technicianIds),
            responsibleTechnicianId: body.responsibleTechnicianId, previousTechnicianIds,
            ...(previousResponsibleTechnicianId ? { previousResponsibleTechnicianId } : {}), actorMembershipId: member.membershipId,
            occurredAt: now, warnings: clone(warnings), warningsAcknowledged: warnings.length === 0 || body.acknowledgeCapacityWarnings === true, auditReference });
          appendTimeline({ id: `assignment:${assignmentHistory.length}`, tenantId: member.tenantId, branchId,
            jobId: located.plan.jobId, type: previousTechnicianIds.length ? "TASK_REASSIGNED" : "TASK_ASSIGNED",
            title: previousTechnicianIds.length ? "Task reassigned" : "Task assigned", occurredAt: now,
            actorMembershipId: member.membershipId, details: { taskId: located.task.id, taskTitle: located.task.title },
            internalDetails: { previousTechnicianIds, technicianIds: clone(technicianIds), responsibleTechnicianId: body.responsibleTechnicianId,
              warnings: clone(warnings), auditReference }, actions: [{ label: "Open task", href: `/tasks/${located.task.id}`, requiredPermission: "job.plan.read" }] });
          outbox.push({ id: `outbox-s12-${outbox.length + 1}`, tenantId: member.tenantId, branchId,
            aggregateId: located.task.id, aggregateVersion: located.task.resourceVersion, type: "S12_TASK_ASSIGNMENT_READY",
            payload: { jobId: located.plan.jobId, taskId: located.task.id, taskVersion: located.task.resourceVersion,
              taskTitle: located.task.title, priority: located.task.priority, estimatedMinutes: located.task.estimatedMinutes,
              technicianIds: clone(technicianIds), responsibleTechnicianId: body.responsibleTechnicianId,
              checklist: clone(located.task.checklist), materials: clone(located.task.materials), dependencies: clone(located.task.dependsOnTaskIds),
              warnings: clone(located.task.warnings) }, occurredAt: now });
          const response: ApiResponse = { status: 200, body: { task: clone(located.task), warnings: clone(warnings), resourceVersion: located.task.resourceVersion, auditReference } };
          commands.set(commandKey, { fingerprint, response: clone(response) });
          return response;
        },
      };
    },
  };
}
