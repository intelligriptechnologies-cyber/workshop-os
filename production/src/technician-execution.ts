import { createHash } from "node:crypto";

export type TechnicianMembership = {
  identityId: string;
  membershipId: string;
  technicianId?: string;
  tenantId: string;
  branchIds: string[];
  roles: string[];
  permissions: string[];
};

export type TaskAssignmentReadyEvent = {
  id: string;
  type: "S12_TASK_ASSIGNMENT_READY";
  tenantId: string;
  branchId: string;
  aggregateId: string;
  aggregateVersion?: number;
  occurredAt: string;
  payload: {
    jobId: string;
    taskId: string;
    taskVersion: number;
    taskTitle?: string;
    priority?: string;
    estimatedMinutes?: number;
    technicianIds: string[];
    responsibleTechnicianId: string;
    checklist: Array<{ key: string; label: string; required: boolean; evidenceRequired: boolean; configurationVersion: number }>;
    materials: Array<{ itemId: string; quantity: string; uom: string; recipeVersion: number }>;
    dependencies: string[];
  };
};

export type TechnicianRecord = {
  id: string;
  membershipId: string;
  tenantId: string;
  branchId: string;
  active: boolean;
};

export type ScanTarget = {
  code: string;
  tenantId: string;
  branchId: string;
  objectType: "TASK" | "ITEM" | "DOCUMENT";
  objectId: string;
  state: string;
  allowedStates: string[];
  requiredPermission: string;
};

type TaskStatus = "ASSIGNED" | "IN_PROGRESS" | "PAUSED" | "BLOCKED" | "HANDED_OFF" | "COMPLETED";
type ChecklistState = TaskAssignmentReadyEvent["payload"]["checklist"][number] & { checked: boolean; evidenceId?: string };
type TaskEvidence = {
  id: string;
  checklistKey?: string;
  kind: "PHOTO" | "VIDEO" | "DOCUMENT";
  privateObjectRef: string;
  contentType: string;
  checksum: string;
  scanStatus: "CLEAN";
  sizeBytes: number;
  capturedAt: string;
  actorMembershipId: string;
};
type ExecutionTask = {
  id: string;
  sourceEventId: string;
  sourceEventVersion: number;
  tenantId: string;
  branchId: string;
  jobId: string;
  title: string;
  priority: string;
  estimatedMinutes: number;
  technicianIds: string[];
  responsibleTechnicianId: string;
  checklist: ChecklistState[];
  materials: TaskAssignmentReadyEvent["payload"]["materials"];
  dependencies: string[];
  status: TaskStatus;
  reason?: string;
  elapsedSeconds: number;
  activeStartedAt?: string;
  evidence: TaskEvidence[];
  resourceVersion: number;
  updatedAt: string;
};
type TaskView = ExecutionTask & {
  blockers: string[];
  nextAction: { action: string; label: string; enabled: boolean };
  controls: Array<{ action: string; label: string; minimumTouchTargetPx: 48; enabled: boolean; onlineRequired: boolean }>;
};
type TechnicianView = {
  title: "My Tasks";
  minimumTouchTargetPx: 48;
  online: boolean;
  committedStateLabel: string;
  offlineNotice?: string;
  tasks: TaskView[];
  scanActions: Array<{ source: string; label: string }>;
  blockedOfflinePostings: string[];
  uncommittedDraftCount: number;
};
type ApiBody = {
  code?: string;
  task?: TaskView;
  view?: TechnicianView;
  resourceVersion?: number;
  auditReference?: string;
  [key: string]: unknown;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { ifMatch?: number; idempotencyKey?: string; now?: string };
type StatusHistory = {
  id: string; tenantId: string; branchId: string; taskId: string;
  priorStatus: TaskStatus; newStatus: TaskStatus; reason?: string;
  actorMembershipId: string; occurredAt: string; elapsedSeconds: number; auditReference: string;
};
type EvidenceHistory = TaskEvidence & { tenantId: string; branchId: string; taskId: string; auditReference: string };
type ChecklistHistory = {
  id: string; tenantId: string; branchId: string; taskId: string; checklistKey: string; checked: boolean;
  evidenceId?: string; actorMembershipId: string; occurredAt: string; auditReference: string;
};
type CompletionOverride = {
  id: string; tenantId: string; branchId: string; taskId: string; technicianMembershipId: string;
  actorMembershipId: string; reason: string; overriddenBlockers: string[]; occurredAt: string; auditReference: string;
};
type CompletionOutbox = {
  id: string; tenantId: string; branchId: string; type: "S16_TASK_COMPLETION_READY"; aggregateId: string;
  aggregateVersion: number; payload: { jobId: string; taskId: string; qcStatus: "PENDING_INDEPENDENT_QC"; overrideId?: string }; occurredAt: string;
};
type ScanAudit = {
  id: string; tenantId: string; branchId: string; actorMembershipId: string; source: "CAMERA" | "HARDWARE" | "MANUAL";
  codeDigest: string; objectType: ScanTarget["objectType"]; objectId: string; state: string; reason?: string;
  occurredAt: string; auditReference: string;
};

const clone = <T>(value: T): T => structuredClone(value);
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const PRIORITY_ORDER = new Map([["URGENT", 0], ["HIGH", 1], ["NORMAL", 2], ["LOW", 3]]);

function taskBlockers(task: ExecutionTask, completedTaskIds: Set<string>): string[] {
  const blockers: string[] = [];
  for (const dependency of task.dependencies) if (!completedTaskIds.has(dependency)) blockers.push(`Waiting for task ${dependency} to be completed.`);
  for (const item of task.checklist) {
    if (item.required && !item.checked) blockers.push(`Complete checklist: ${item.label}.`);
    if (item.required && item.evidenceRequired && (!item.evidenceId || !task.evidence.some((evidence) => evidence.id === item.evidenceId))) {
      blockers.push(`Add clean private photo evidence for: ${item.label}.`);
    }
  }
  return blockers;
}

function nextAction(task: ExecutionTask, blockers: string[]): TaskView["nextAction"] {
  switch (task.status) {
    case "ASSIGNED": return { action: "START", label: "Start task", enabled: !blockers.some((blocker) => blocker.startsWith("Waiting for task ")) };
    case "IN_PROGRESS": return blockers.length ? { action: "RESOLVE_BLOCKERS", label: "Finish required steps", enabled: true } : { action: "COMPLETE", label: "Complete task", enabled: true };
    case "PAUSED": return { action: "RESUME", label: "Resume task", enabled: true };
    case "BLOCKED": return { action: "RESUME", label: "Resolve blocker and resume", enabled: true };
    case "HANDED_OFF": return { action: "START", label: "Accept and start", enabled: true };
    case "COMPLETED": return { action: "VIEW", label: "View completed work", enabled: true };
  }
}

export function createLocalTechnicianExecutionApi(input: {
  memberships: Record<string, TechnicianMembership>;
  technicians: TechnicianRecord[];
  scanTargets: ScanTarget[];
}) {
  const tasks = new Map<string, ExecutionTask>();
  const consumedAssignments = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const statusHistory: StatusHistory[] = [];
  const evidenceHistory: EvidenceHistory[] = [];
  const checklistHistory: ChecklistHistory[] = [];
  const completionOverrides: CompletionOverride[] = [];
  const completionOutbox: CompletionOutbox[] = [];
  const scanAudit: ScanAudit[] = [];
  let auditSequence = 0;

  const viewTask = (task: ExecutionTask, online = true): TaskView => {
    const completed = new Set([...tasks.values()].filter((candidate) => candidate.status === "COMPLETED").map((candidate) => candidate.id));
    const blockers = taskBlockers(task, completed);
    const guided = nextAction(task, blockers);
    const controls: TaskView["controls"] = [
      { ...guided, minimumTouchTargetPx: 48, enabled: guided.enabled && (online || guided.action === "VIEW"), onlineRequired: guided.action !== "VIEW" },
      ...task.checklist.map((item) => ({ action: `CHECKLIST:${item.key}`, label: item.label, minimumTouchTargetPx: 48 as const,
        enabled: task.status !== "COMPLETED", onlineRequired: false })),
      ...(task.checklist.some((item) => item.evidenceRequired) ? [{ action: "CAPTURE_PHOTO", label: "Take required photo", minimumTouchTargetPx: 48 as const,
        enabled: task.status !== "COMPLETED", onlineRequired: false }] : []),
      ...(task.materials.length ? [{ action: "REQUEST_MATERIAL", label: "Request material", minimumTouchTargetPx: 48 as const,
        enabled: online && task.status !== "COMPLETED", onlineRequired: true }] : []),
    ];
    return { ...clone(task), blockers, nextAction: guided, controls };
  };

  return {
    assignmentEvents: {
      ingest(event: TaskAssignmentReadyEvent): ApiResponse {
        if (event.type !== "S12_TASK_ASSIGNMENT_READY") return { status: 422, body: { code: "TASK_ASSIGNMENT_EVENT_REQUIRED" } };
        const key = `${event.tenantId}:${event.id}`;
        const fingerprint = digest(event);
        const prior = consumedAssignments.get(key);
        if (prior) return prior.fingerprint === fingerprint ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "ASSIGNMENT_EVENT_ID_REUSED" } };
        if (event.aggregateId !== event.payload.taskId || (event.aggregateVersion !== undefined && event.aggregateVersion !== event.payload.taskVersion) ||
            !event.payload.technicianIds.includes(event.payload.responsibleTechnicianId) || new Set(event.payload.technicianIds).size !== event.payload.technicianIds.length) {
          return { status: 422, body: { code: "INVALID_TASK_ASSIGNMENT" } };
        }
        const assignedTechnicians = event.payload.technicianIds.map((id) => input.technicians.find((candidate) => candidate.id === id));
        if (assignedTechnicians.some((technician) => !technician || !technician.active || technician.tenantId !== event.tenantId || technician.branchId !== event.branchId)) {
          return { status: 422, body: { code: "ASSIGNED_TECHNICIAN_NOT_ELIGIBLE" } };
        }
        const taskKey = `${event.tenantId}:${event.payload.taskId}`;
        const existing = tasks.get(taskKey);
        if (existing && event.payload.taskVersion <= existing.sourceEventVersion) return { status: 409, body: { code: "STALE_TASK_ASSIGNMENT" } };
        const task: ExecutionTask = existing ? {
          ...existing, sourceEventId: event.id, sourceEventVersion: event.payload.taskVersion,
          technicianIds: clone(event.payload.technicianIds), responsibleTechnicianId: event.payload.responsibleTechnicianId,
          resourceVersion: existing.resourceVersion + 1, updatedAt: event.occurredAt,
        } : {
          id: event.payload.taskId, sourceEventId: event.id, sourceEventVersion: event.payload.taskVersion,
          tenantId: event.tenantId, branchId: event.branchId, jobId: event.payload.jobId,
          title: event.payload.taskTitle ?? `Assigned task ${event.payload.taskId}`,
          priority: event.payload.priority ?? "NORMAL", estimatedMinutes: event.payload.estimatedMinutes ?? 0,
          technicianIds: clone(event.payload.technicianIds), responsibleTechnicianId: event.payload.responsibleTechnicianId,
          checklist: event.payload.checklist.map((item) => ({ ...clone(item), checked: false })),
          materials: clone(event.payload.materials), dependencies: clone(event.payload.dependencies),
          status: "ASSIGNED", elapsedSeconds: 0, evidence: [], resourceVersion: event.payload.taskVersion,
          updatedAt: event.occurredAt,
        };
        tasks.set(taskKey, task);
        const response: ApiResponse = { status: 201, body: { task: viewTask(task), resourceVersion: task.resourceVersion } };
        consumedAssignments.set(key, { fingerprint, response: clone(response) });
        return response;
      },
    },
    testing: {
      tasks: () => clone([...tasks.values()]), statusHistory: () => clone(statusHistory),
      evidenceHistory: () => clone(evidenceHistory), checklistHistory: () => clone(checklistHistory),
      completionOverrides: () => clone(completionOverrides), completionOutbox: () => clone(completionOutbox), scanAudit: () => clone(scanAudit),
    },
    signIn(token: string) {
      const member = input.memberships[token];
      return {
        async get(path: string): Promise<ApiResponse> {
          if (!member) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const url = new URL(path, "https://local.workshopos.test");
          if (url.pathname !== "/api/v1/technician/tasks") return { status: 404, body: { code: "NOT_FOUND" } };
          if (!member.permissions.includes("task.read") || !member.technicianId) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const branchId = url.searchParams.get("branchId");
          if (!branchId || !member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const online = url.searchParams.get("online") !== "false";
          const visible = [...tasks.values()]
            .filter((task) => task.tenantId === member.tenantId && task.branchId === branchId && task.technicianIds.includes(member.technicianId!))
            .sort((left, right) => (PRIORITY_ORDER.get(left.priority) ?? 4) - (PRIORITY_ORDER.get(right.priority) ?? 4) || left.updatedAt.localeCompare(right.updatedAt))
            .map((task) => viewTask(task, online));
          return { status: 200, body: { view: {
            title: "My Tasks", minimumTouchTargetPx: 48, online,
            committedStateLabel: online ? "Saved to WorkshopOS" : "Showing committed state; local drafts are marked separately",
            ...(!online ? { offlineNotice: "Offline: stock, approvals, finance, QC overrides, closure and gate postings are blocked." } : {}),
            tasks: visible, scanActions: [{ source: "CAMERA", label: "Scan with camera" }, { source: "HARDWARE", label: "Use barcode scanner" }, { source: "MANUAL", label: "Enter code manually" }],
            blockedOfflinePostings: ["STOCK", "APPROVAL", "FINANCE", "QC_OVERRIDE", "CLOSURE", "GATE"], uncommittedDraftCount: 0,
          } } };
        },
        async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
          if (!member) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          if (path === "/api/v1/technician/scans") {
            if (!member.permissions.includes("scan.use")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            const branchId = typeof body.branchId === "string" ? body.branchId : "";
            if (!member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
            if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const commandKey = `${member.tenantId}:${options.idempotencyKey}`;
            const fingerprint = digest({ path, body });
            const prior = commands.get(commandKey);
            if (prior) return prior.fingerprint === fingerprint ? clone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            const source = body.source;
            if (!["CAMERA", "HARDWARE", "MANUAL"].includes(String(source)) || typeof body.code !== "string" || !body.code.trim()) {
              return { status: 422, body: { code: "INVALID_SCAN" } };
            }
            const reason = typeof body.reason === "string" ? body.reason.trim() : "";
            if (source === "MANUAL" && !reason) return { status: 422, body: { code: "MANUAL_FALLBACK_REASON_REQUIRED" } };
            const target = input.scanTargets.find((candidate) => candidate.code === body.code && candidate.tenantId === member.tenantId && candidate.branchId === branchId);
            if (!target) return { status: 404, body: { code: "SCAN_NOT_FOUND" } };
            if (!member.permissions.includes(target.requiredPermission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            if (target.objectType !== body.expectedObjectType || (typeof body.expectedObjectId === "string" && target.objectId !== body.expectedObjectId)) {
              return { status: 409, body: { code: "SCAN_OBJECT_MISMATCH" } };
            }
            const liveTask = target.objectType === "TASK" ? tasks.get(`${member.tenantId}:${target.objectId}`) : undefined;
            const state = liveTask?.status ?? target.state;
            if (!target.allowedStates.includes(state)) return { status: 409, body: { code: "SCAN_STATE_NOT_ALLOWED" } };
            const now = options.now ?? new Date().toISOString();
            if (!Number.isFinite(Date.parse(now))) return { status: 422, body: { code: "INVALID_OCCURRED_AT" } };
            const auditReference = `audit-scan-${++auditSequence}`;
            scanAudit.push({ id: `scan-${scanAudit.length + 1}`, tenantId: member.tenantId, branchId, actorMembershipId: member.membershipId,
              source: source as ScanAudit["source"], codeDigest: digest(body.code), objectType: target.objectType, objectId: target.objectId,
              state, ...(reason ? { reason } : {}), occurredAt: now, auditReference });
            const response: ApiResponse = { status: 200, body: { objectType: target.objectType, objectId: target.objectId, state, auditReference } };
            commands.set(commandKey, { fingerprint, response: clone(response) });
            return response;
          }
          const commandMatch = path.match(/^\/api\/v1\/tasks\/([^/]+)\/commands$/);
          const evidenceMatch = path.match(/^\/api\/v1\/tasks\/([^/]+)\/evidence$/);
          const checklistMatch = path.match(/^\/api\/v1\/tasks\/([^/]+)\/checklist\/([^/]+)$/);
          const overrideMatch = path.match(/^\/api\/v1\/tasks\/([^/]+)\/completion-overrides$/);
          const taskId = commandMatch?.[1] ?? evidenceMatch?.[1] ?? checklistMatch?.[1] ?? overrideMatch?.[1];
          if (!taskId) return { status: 404, body: { code: "NOT_FOUND" } };
          if (overrideMatch && !member.permissions.includes("task.completion.override")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          if (evidenceMatch && !member.permissions.includes("task.evidence.write")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          if (checklistMatch && !member.permissions.includes("task.checklist.write")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          if (commandMatch && !member.permissions.includes("task.progress.write")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const branchId = typeof body.branchId === "string" ? body.branchId : "";
          if (!member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const task = tasks.get(`${member.tenantId}:${taskId}`);
          if (!task || task.branchId !== branchId) return { status: 404, body: { code: "TASK_NOT_FOUND" } };
          if (!overrideMatch && (!member.technicianId || !task.technicianIds.includes(member.technicianId))) return { status: 403, body: { code: "TASK_NOT_ASSIGNED" } };
          if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
          const commandKey = `${member.tenantId}:${options.idempotencyKey}`;
          const fingerprint = digest({ path, body, ifMatch: options.ifMatch });
          const prior = commands.get(commandKey);
          if (prior) return prior.fingerprint === fingerprint ? clone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
          if (!Number.isInteger(options.ifMatch) || options.ifMatch !== task.resourceVersion) {
            return { status: 412, body: { code: "VERSION_MISMATCH", resourceVersion: task.resourceVersion } };
          }
          const now = options.now ?? new Date().toISOString();
          if (!Number.isFinite(Date.parse(now))) return { status: 422, body: { code: "INVALID_OCCURRED_AT" } };

          if (overrideMatch) {
            const reason = typeof body.reason === "string" ? body.reason.trim() : "";
            if (!reason) return { status: 422, body: { code: "REASON_REQUIRED" } };
            if (task.status !== "IN_PROGRESS") return { status: 409, body: { code: "TASK_TRANSITION_NOT_ALLOWED" } };
            const completedIds = new Set([...tasks.values()].filter((candidate) => candidate.status === "COMPLETED").map((candidate) => candidate.id));
            const overriddenBlockers = taskBlockers(task, completedIds);
            if (overriddenBlockers.length === 0) return { status: 409, body: { code: "NO_COMPLETION_BLOCKERS_TO_OVERRIDE" } };
            const technician = input.technicians.find((candidate) => candidate.id === task.responsibleTechnicianId);
            if (!technician || technician.membershipId === member.membershipId) return { status: 409, body: { code: "INDEPENDENT_OVERRIDE_REQUIRED" } };
            if (task.activeStartedAt) {
              task.elapsedSeconds += Math.max(0, Math.floor((Date.parse(now) - Date.parse(task.activeStartedAt)) / 1000));
              delete task.activeStartedAt;
            }
            const priorStatus = task.status;
            task.status = "COMPLETED";
            task.reason = reason;
            task.updatedAt = now;
            task.resourceVersion += 1;
            const auditReference = `audit-task-override-${++auditSequence}`;
            const override: CompletionOverride = { id: `completion-override-${completionOverrides.length + 1}`, tenantId: task.tenantId,
              branchId: task.branchId, taskId: task.id, technicianMembershipId: technician.membershipId,
              actorMembershipId: member.membershipId, reason, overriddenBlockers: clone(overriddenBlockers), occurredAt: now, auditReference };
            completionOverrides.push(override);
            statusHistory.push({ id: `task-status-${statusHistory.length + 1}`, tenantId: task.tenantId, branchId: task.branchId, taskId: task.id,
              priorStatus, newStatus: task.status, reason, actorMembershipId: member.membershipId, occurredAt: now, elapsedSeconds: task.elapsedSeconds, auditReference });
            completionOutbox.push({ id: `completion-outbox-${completionOutbox.length + 1}`, tenantId: task.tenantId, branchId: task.branchId,
              type: "S16_TASK_COMPLETION_READY", aggregateId: task.id, aggregateVersion: task.resourceVersion,
              payload: { jobId: task.jobId, taskId: task.id, qcStatus: "PENDING_INDEPENDENT_QC", overrideId: override.id }, occurredAt: now });
            const response: ApiResponse = { status: 200, body: { task: viewTask(task), overriddenBlockers: clone(overriddenBlockers), resourceVersion: task.resourceVersion, auditReference } };
            commands.set(commandKey, { fingerprint, response: clone(response) });
            return response;
          }

          if (evidenceMatch) {
            const id = typeof body.id === "string" ? body.id.trim() : "";
            const checklistKey = typeof body.checklistKey === "string" ? body.checklistKey : undefined;
            if (!id || !checklistKey || !task.checklist.some((item) => item.key === checklistKey)) return { status: 422, body: { code: "INVALID_EVIDENCE_TARGET" } };
            const privateObjectRef = typeof body.privateObjectRef === "string" ? body.privateObjectRef : "";
            if (!privateObjectRef.startsWith(`${member.tenantId}/${branchId}/private/tasks/${task.id}/`)) return { status: 422, body: { code: "PRIVATE_EVIDENCE_REQUIRED" } };
            const valid = body.kind === "PHOTO" && ["image/jpeg", "image/png", "image/webp"].includes(String(body.contentType)) &&
              typeof body.checksum === "string" && /^[a-f0-9]{64}$/i.test(body.checksum) && body.scanStatus === "CLEAN" &&
              typeof body.sizeBytes === "number" && body.sizeBytes > 0 && body.sizeBytes <= 10_000_000 &&
              typeof body.capturedAt === "string" && Number.isFinite(Date.parse(body.capturedAt));
            if (!valid) return { status: 422, body: { code: "INVALID_OR_UNSAFE_EVIDENCE" } };
            if (task.evidence.some((item) => item.id === id)) return { status: 409, body: { code: "EVIDENCE_ID_REUSED" } };
            const auditReference = `audit-task-evidence-${++auditSequence}`;
            const evidence: TaskEvidence = { id, checklistKey, kind: "PHOTO", privateObjectRef, contentType: String(body.contentType),
              checksum: String(body.checksum), scanStatus: "CLEAN", sizeBytes: Number(body.sizeBytes), capturedAt: String(body.capturedAt), actorMembershipId: member.membershipId };
            task.evidence.push(evidence);
            task.updatedAt = now;
            task.resourceVersion += 1;
            evidenceHistory.push({ ...clone(evidence), tenantId: task.tenantId, branchId: task.branchId, taskId: task.id, auditReference });
            const response: ApiResponse = { status: 201, body: { task: viewTask(task), resourceVersion: task.resourceVersion, auditReference } };
            commands.set(commandKey, { fingerprint, response: clone(response) });
            return response;
          }

          if (checklistMatch) {
            const item = task.checklist.find((candidate) => candidate.key === checklistMatch[2]);
            if (!item || typeof body.checked !== "boolean") return { status: 422, body: { code: "INVALID_CHECKLIST_UPDATE" } };
            const evidenceId = typeof body.evidenceId === "string" ? body.evidenceId : undefined;
            if (body.checked && item.evidenceRequired && (!evidenceId || !task.evidence.some((evidence) => evidence.id === evidenceId && evidence.checklistKey === item.key))) {
              return { status: 409, body: { code: "CHECKLIST_EVIDENCE_REQUIRED" } };
            }
            item.checked = body.checked;
            item.evidenceId = body.checked ? evidenceId : undefined;
            task.updatedAt = now;
            task.resourceVersion += 1;
            const auditReference = `audit-task-checklist-${++auditSequence}`;
            checklistHistory.push({ id: `checklist-history-${checklistHistory.length + 1}`, tenantId: task.tenantId, branchId: task.branchId,
              taskId: task.id, checklistKey: item.key, checked: item.checked, ...(item.evidenceId ? { evidenceId: item.evidenceId } : {}),
              actorMembershipId: member.membershipId, occurredAt: now, auditReference });
            const response: ApiResponse = { status: 200, body: { task: viewTask(task), resourceVersion: task.resourceVersion, auditReference } };
            commands.set(commandKey, { fingerprint, response: clone(response) });
            return response;
          }

          if (!commandMatch) return { status: 404, body: { code: "NOT_FOUND" } };
          const action = body.action;
          if (!["START", "PAUSE", "RESUME", "BLOCK", "HANDOFF", "COMPLETE"].includes(String(action))) {
            return { status: 422, body: { code: "INVALID_TASK_ACTION" } };
          }
          const reason = typeof body.reason === "string" ? body.reason.trim() : "";
          if (["PAUSE", "BLOCK", "HANDOFF"].includes(String(action)) && !reason) return { status: 422, body: { code: "REASON_REQUIRED" } };
          const transitions: Record<string, { from: TaskStatus[]; to: TaskStatus }> = {
            START: { from: ["ASSIGNED", "HANDED_OFF"], to: "IN_PROGRESS" },
            PAUSE: { from: ["IN_PROGRESS"], to: "PAUSED" },
            RESUME: { from: ["PAUSED", "BLOCKED"], to: "IN_PROGRESS" },
            BLOCK: { from: ["IN_PROGRESS"], to: "BLOCKED" },
            HANDOFF: { from: ["IN_PROGRESS", "PAUSED", "BLOCKED"], to: "HANDED_OFF" },
            COMPLETE: { from: ["IN_PROGRESS"], to: "COMPLETED" },
          };
          const transition = transitions[String(action)];
          if (!transition.from.includes(task.status)) return { status: 409, body: { code: "TASK_TRANSITION_NOT_ALLOWED" } };
          const completed = new Set([...tasks.values()].filter((candidate) => candidate.status === "COMPLETED").map((candidate) => candidate.id));
          if (action === "START" && task.dependencies.some((dependency) => !completed.has(dependency))) {
            return { status: 409, body: { code: "TASK_DEPENDENCIES_INCOMPLETE" } };
          }
          if (action === "COMPLETE" && taskBlockers(task, completed).length) {
            return { status: 409, body: { code: "TASK_COMPLETION_BLOCKED", blockers: taskBlockers(task, completed) } };
          }
          let target: TechnicianRecord | undefined;
          if (action === "HANDOFF") {
            const targetId = typeof body.targetTechnicianId === "string" ? body.targetTechnicianId : "";
            target = input.technicians.find((candidate) => candidate.id === targetId && candidate.id !== member.technicianId && candidate.active &&
              candidate.tenantId === member.tenantId && candidate.branchId === branchId);
            if (!target) return { status: 422, body: { code: "HANDOFF_TECHNICIAN_NOT_ELIGIBLE" } };
          }
          const priorStatus = task.status;
          if (task.activeStartedAt && action !== "RESUME" && action !== "START") {
            task.elapsedSeconds += Math.max(0, Math.floor((Date.parse(now) - Date.parse(task.activeStartedAt)) / 1000));
            delete task.activeStartedAt;
          }
          if (action === "START" || action === "RESUME") task.activeStartedAt = now;
          if (target) {
            task.technicianIds = [target.id];
            task.responsibleTechnicianId = target.id;
          }
          task.status = transition.to;
          task.reason = reason || undefined;
          task.updatedAt = now;
          task.resourceVersion += 1;
          const auditReference = `audit-task-status-${++auditSequence}`;
          statusHistory.push({ id: `task-status-${statusHistory.length + 1}`, tenantId: task.tenantId, branchId: task.branchId,
            taskId: task.id, priorStatus, newStatus: task.status, ...(reason ? { reason } : {}), actorMembershipId: member.membershipId,
            occurredAt: now, elapsedSeconds: task.elapsedSeconds, auditReference });
          if (action === "COMPLETE") completionOutbox.push({ id: `completion-outbox-${completionOutbox.length + 1}`, tenantId: task.tenantId,
            branchId: task.branchId, type: "S16_TASK_COMPLETION_READY", aggregateId: task.id, aggregateVersion: task.resourceVersion,
            payload: { jobId: task.jobId, taskId: task.id, qcStatus: "PENDING_INDEPENDENT_QC" }, occurredAt: now });
          const response: ApiResponse = { status: 200, body: { task: viewTask(task), resourceVersion: task.resourceVersion, auditReference } };
          commands.set(commandKey, { fingerprint, response: clone(response) });
          return response;
        },
      };
    },
  };
}

export type DraftPersistence = { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void };

export function createMemoryDraftPersistence(): DraftPersistence {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
}

type DraftKind = "NOTES" | "CHECKLIST" | "EVIDENCE_METADATA" | "BLOCK_REASON" |
  "STOCK" | "APPROVAL" | "FINANCE" | "QC_OVERRIDE" | "CLOSURE" | "GATE";
type DraftSyncState = "PENDING" | "SYNCING" | "RETRY_PENDING" | "CONFLICT" | "COMMITTED" | "DISCARDED";
type TechnicianDraft = {
  id: string; tenantId: string; branchId: string; technicianId: string; taskId: string; kind: DraftKind;
  payload: Record<string, unknown>; baseVersion: number; generation: number; idempotencyKey: string;
  commitState: "UNCOMMITTED" | "COMMITTED"; syncState: DraftSyncState; stateLabel: string;
  retryCount: number; createdAt: string; updatedAt: string;
  conflict?: { currentVersion: number; serverState?: Record<string, unknown> };
};
type DraftResult = { ok: boolean; code?: string; message?: string; draft?: TechnicianDraft };
type DraftSyncRequest = {
  draftId: string; taskId: string; kind: DraftKind; payload: Record<string, unknown>; baseVersion: number; idempotencyKey: string;
};
type DraftTransportResponse = { status: number; resourceVersion?: number; serverState?: Record<string, unknown> };

const FORBIDDEN_OFFLINE_KINDS = new Set<DraftKind>(["STOCK", "APPROVAL", "FINANCE", "QC_OVERRIDE", "CLOSURE", "GATE"]);

export function createTechnicianDraftStore(
  persistence: DraftPersistence,
  scope: { tenantId: string; branchId: string; technicianId: string } = { tenantId: "local", branchId: "local", technicianId: "local" },
) {
  const storageKey = `workshopos:technician-drafts:${scope.tenantId}:${scope.branchId}:${scope.technicianId}`;
  const read = (): TechnicianDraft[] => {
    const raw = persistence.getItem(storageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as TechnicianDraft[];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((draft) => draft.tenantId === scope.tenantId && draft.branchId === scope.branchId && draft.technicianId === scope.technicianId);
    } catch {
      return [];
    }
  };
  let drafts = read().map((draft) => draft.syncState === "SYNCING"
    ? { ...draft, syncState: "RETRY_PENDING" as const, stateLabel: "Retry needed — not saved to WorkshopOS yet", retryCount: draft.retryCount + 1 }
    : draft);
  const persist = () => persistence.setItem(storageKey, JSON.stringify(drafts));
  persist();
  const keyFor = (id: string, generation: number) => `draft-${digest({ ...scope, id, generation }).slice(0, 32)}`;

  return {
    list(): TechnicianDraft[] { return clone(drafts.filter((draft) => draft.syncState !== "DISCARDED")); },
    save(input: { id: string; taskId: string; kind: DraftKind; payload: Record<string, unknown>; baseVersion: number; now?: string }): DraftResult {
      if (FORBIDDEN_OFFLINE_KINDS.has(input.kind)) {
        return { ok: false, code: "OFFLINE_AUTHORITATIVE_OPERATION_BLOCKED",
          message: `${input.kind.replace("_", " ")} posting needs a live connection and cannot be saved as a draft.` };
      }
      if (!input.id.trim() || !input.taskId.trim() || !Number.isInteger(input.baseVersion) || input.baseVersion < 1) {
        return { ok: false, code: "INVALID_DRAFT" };
      }
      const now = input.now ?? new Date().toISOString();
      const prior = drafts.find((draft) => draft.id === input.id);
      if (prior && digest({ taskId: input.taskId, kind: input.kind, payload: input.payload, baseVersion: input.baseVersion }) !==
          digest({ taskId: prior.taskId, kind: prior.kind, payload: prior.payload, baseVersion: prior.baseVersion })) {
        return { ok: false, code: "DRAFT_ID_REUSED", draft: clone(prior) };
      }
      if (prior) return { ok: true, draft: clone(prior) };
      const draft: TechnicianDraft = { id: input.id, ...scope, taskId: input.taskId, kind: input.kind, payload: clone(input.payload),
        baseVersion: input.baseVersion, generation: 1, idempotencyKey: keyFor(input.id, 1), commitState: "UNCOMMITTED",
        syncState: "PENDING", stateLabel: "Not saved to WorkshopOS yet", retryCount: 0, createdAt: now, updatedAt: now };
      drafts.push(draft);
      persist();
      return { ok: true, draft: clone(draft) };
    },
    async sync(id: string, transport: (request: DraftSyncRequest) => Promise<DraftTransportResponse>): Promise<DraftResult> {
      const draft = drafts.find((candidate) => candidate.id === id && candidate.syncState !== "DISCARDED");
      if (!draft) return { ok: false, code: "DRAFT_NOT_FOUND" };
      if (draft.syncState === "CONFLICT") return { ok: false, code: "USER_CONFLICT_DECISION_REQUIRED", draft: clone(draft) };
      if (draft.syncState === "COMMITTED") return { ok: true, code: "ALREADY_COMMITTED", draft: clone(draft) };
      draft.syncState = "SYNCING";
      draft.stateLabel = "Saving to WorkshopOS…";
      persist();
      try {
        const response = await transport({ draftId: draft.id, taskId: draft.taskId, kind: draft.kind, payload: clone(draft.payload),
          baseVersion: draft.baseVersion, idempotencyKey: draft.idempotencyKey });
        if (response.status === 409 || response.status === 412) {
          draft.syncState = "CONFLICT";
          draft.commitState = "UNCOMMITTED";
          draft.stateLabel = "Conflict — choose which changes to keep";
          draft.conflict = { currentVersion: response.resourceVersion ?? draft.baseVersion, ...(response.serverState ? { serverState: clone(response.serverState) } : {}) };
          persist();
          return { ok: false, code: "SYNC_CONFLICT", draft: clone(draft) };
        }
        if (response.status >= 200 && response.status < 300) {
          draft.syncState = "COMMITTED";
          draft.commitState = "COMMITTED";
          draft.stateLabel = "Saved to WorkshopOS";
          draft.baseVersion = response.resourceVersion ?? draft.baseVersion;
          delete draft.conflict;
          persist();
          return { ok: true, code: "SYNC_COMMITTED", draft: clone(draft) };
        }
        throw new Error(`sync failed with ${response.status}`);
      } catch {
        draft.syncState = "RETRY_PENDING";
        draft.commitState = "UNCOMMITTED";
        draft.stateLabel = "Retry needed — not saved to WorkshopOS yet";
        draft.retryCount += 1;
        persist();
        return { ok: false, code: "SYNC_RETRY_PENDING", draft: clone(draft) };
      }
    },
    resolveConflict(id: string, choice: "KEEP_MINE" | "USE_SERVER" | "DISCARD", options: { currentVersion?: number; serverState?: Record<string, unknown>; now?: string } = {}): DraftResult {
      const draft = drafts.find((candidate) => candidate.id === id && candidate.syncState === "CONFLICT");
      if (!draft) return { ok: false, code: "CONFLICT_NOT_FOUND" };
      if (choice === "DISCARD") {
        draft.syncState = "DISCARDED";
        draft.stateLabel = "Draft discarded";
        persist();
        return { ok: true, draft: clone(draft) };
      }
      const currentVersion = options.currentVersion ?? draft.conflict?.currentVersion;
      if (!Number.isInteger(currentVersion) || currentVersion! < 1) return { ok: false, code: "CURRENT_VERSION_REQUIRED", draft: clone(draft) };
      if (choice === "USE_SERVER") draft.payload = clone(options.serverState ?? draft.conflict?.serverState ?? {});
      draft.baseVersion = currentVersion!;
      draft.generation += 1;
      draft.idempotencyKey = keyFor(draft.id, draft.generation);
      draft.syncState = "PENDING";
      draft.commitState = "UNCOMMITTED";
      draft.stateLabel = "Not saved to WorkshopOS yet";
      draft.updatedAt = options.now ?? new Date().toISOString();
      delete draft.conflict;
      persist();
      return { ok: true, draft: clone(draft) };
    },
  };
}
