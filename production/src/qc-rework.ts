import { createHash } from "node:crypto";

export type QcMembership = {
  identityId: string;
  membershipId: string;
  technicianId?: string;
  tenantId: string;
  branchIds: string[];
  roles: string[];
  permissions: string[];
};

type Evidence = {
  privateObjectRef: string;
  checksum: string;
  scanStatus: "CLEAN";
  capturedAt: string;
  kind: "PHOTO" | "VIDEO" | "DOCUMENT";
};
type ChecklistItem = { key: string; label: string; required: boolean; readingRequired: boolean; evidenceRequired: boolean };
type TaskContext = {
  tenantId: string; branchId: string; jobId: string; taskId: string; technicianMembershipIds: string[];
  checklist: { masterId: string; version: number; items: ChecklistItem[] };
  overridePolicy: { version: number; recentAuthenticationSeconds: number; checkerPermission: string };
};
type CompletionEvent = {
  id: string; type: "S16_TASK_COMPLETION_READY"; tenantId: string; branchId: string; aggregateId: string;
  aggregateVersion: number; occurredAt: string; actorMembershipId?: string;
  payload: { jobId: string; taskId: string; qcStatus: "PENDING_INDEPENDENT_QC"; overrideId?: string };
};
type ReconciliationEvent = {
  id: string; type: "S15_MATERIAL_RECONCILED"; tenantId: string; branchId: string; aggregateId: string;
  aggregateVersion: number; occurredAt: string;
  payload: { jobId: string; taskId: string; consumers: readonly ["S16_QC", "S18_BILLING"]; totals: Record<string, string> };
};
type InspectionItem = {
  checklistKey: string; label: string; status: "PASS" | "FAIL" | "NOT_APPLICABLE";
  reading?: string; notes?: string; evidence: Evidence[];
};
type Inspection = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; attempt: number;
  checklist: { masterId: string; version: number }; items: InspectionItem[]; result: "PASS" | "FAIL";
  reason: string; actorMembershipId: string; occurredAt: string; auditReference: string;
};
type ReleaseEvent = {
  id: string; type: "S16_QC_PASSED" | "S16_QC_OVERRIDDEN"; tenantId: string; branchId: string; aggregateId: string;
  aggregateVersion: number; occurredAt: string; payload: { jobId: string; taskId: string; inspectionId?: string;
    overrideId?: string; qcStatus: "PASSED" | "OVERRIDDEN"; customerVisible?: boolean; releaseVisible?: boolean };
};
type Rework = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; failedInspectionId: string;
  failedChecklistKeys: string[]; failureEvidence: Evidence[]; reason: string;
  status: "BLOCKING" | "ASSIGNED" | "READY_FOR_REINSPECTION" | "PASSED";
  assignedTechnicianMembershipId?: string; assignmentReason?: string; completionReason?: string; completionEvidence?: Evidence[];
  createdByMembershipId: string; occurredAt: string; auditReference: string; resourceVersion: number;
};
type QcOverride = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; reworkId: string;
  reason: string; evidence: Evidence[]; customerCommunicationNote: string; policyVersion: number;
  makerMembershipId: string; status: "APPROVAL_PENDING" | "APPROVED" | "REJECTED"; resourceVersion: number;
  requestedAt: string; requestAuditReference: string; checkerMembershipId?: string; checkerReason?: string;
  decidedAt?: string; approvalAuditReference?: string;
};
type QcState = { status: "PENDING_QC" | "PASSED" | "FAILED" | "OVERRIDDEN"; resourceVersion: number };
type ApiResponse = { status: number; body: Record<string, any> };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; reauthenticatedAt?: string };

const clone = <T>(value: T): T => structuredClone(value);
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const response = (status: number, code: string, extra: Record<string, unknown> = {}): ApiResponse => ({ status, body: { code, ...extra } });

function validEvidence(member: QcMembership, branchId: string, evidence: unknown): evidence is Evidence[] {
  if (!Array.isArray(evidence)) return false;
  const prefix = `${member.tenantId}/${branchId}/private/qc/`;
  return evidence.every((item) => item && typeof item.privateObjectRef === "string" && item.privateObjectRef.startsWith(prefix) &&
    typeof item.checksum === "string" && /^[0-9a-f]{64}$/.test(item.checksum) && item.scanStatus === "CLEAN" &&
    typeof item.capturedAt === "string" && Number.isFinite(Date.parse(item.capturedAt)) &&
    ["PHOTO", "VIDEO", "DOCUMENT"].includes(item.kind));
}

export function createLocalQcReworkApi(input: {
  memberships: Record<string, QcMembership>;
  taskCompletionEvents: CompletionEvent[];
  materialReconciliationEvents: ReconciliationEvent[];
  taskContexts: TaskContext[];
}) {
  const states = new Map<string, QcState>();
  const inspections: Inspection[] = [];
  const reworks: Rework[] = [];
  const reworkHistory: Array<{ reworkId: string; priorStatus: Rework["status"]; newStatus: Rework["status"]; actorMembershipId: string; reason: string; occurredAt: string; auditReference: string }> = [];
  const releaseEvents: ReleaseEvent[] = [];
  const overrides: QcOverride[] = [];
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  let auditSequence = 0;

  for (const context of input.taskContexts) {
    const completed = input.taskCompletionEvents.some((event) => event.tenantId === context.tenantId && event.branchId === context.branchId &&
      event.aggregateId === context.taskId && event.payload.jobId === context.jobId && event.payload.qcStatus === "PENDING_INDEPENDENT_QC");
    const reconciled = input.materialReconciliationEvents.some((event) => event.tenantId === context.tenantId && event.branchId === context.branchId &&
      event.aggregateId === context.taskId && event.payload.jobId === context.jobId && event.payload.consumers.includes("S16_QC") && event.payload.totals.difference === "0");
    if (completed && reconciled) states.set(`${context.tenantId}:${context.taskId}`, { status: "PENDING_QC", resourceVersion: 1 });
  }

  const authorize = (token: string, branchId: unknown, permission: string) => {
    const member = input.memberships[token];
    if (!member) return response(401, "AUTHENTICATION_REQUIRED");
    if (typeof branchId !== "string" || !member.branchIds.includes(branchId)) return response(403, "BRANCH_FORBIDDEN");
    if (!member.permissions.includes(permission)) return response(403, "PERMISSION_DENIED");
    return member;
  };
  const contextFor = (member: QcMembership, branchId: string, taskId: string) => input.taskContexts.find((candidate) =>
    candidate.tenantId === member.tenantId && candidate.branchId === branchId && candidate.taskId === taskId);

  class Session {
    constructor(private readonly token: string) {}

    async get(path: string): Promise<ApiResponse> {
      const match = path.match(/^\/api\/v1\/qc\/actions\?branchId=([^&]+)$/);
      if (!match) return response(404, "ROUTE_NOT_FOUND");
      const branchId = decodeURIComponent(match[1]);
      const auth = authorize(this.token, branchId, "qc.view");
      if ("status" in auth) return auth;
      const actions = input.taskContexts.filter((context) => context.tenantId === auth.tenantId && context.branchId === branchId)
        .flatMap((context) => {
          const state = states.get(`${auth.tenantId}:${context.taskId}`);
          return state?.status === "PENDING_QC" ? [{
            jobId: context.jobId, taskId: context.taskId, status: state.status,
            blocker: "An independent quality check must pass before release.", resourceVersion: state.resourceVersion,
          }] : [];
        });
      return { status: 200, body: { actions } };
    }

    async post(path: string, body: Record<string, any>, options: CommandOptions = {}): Promise<ApiResponse> {
      const overrideRequest = path.match(/^\/api\/v1\/tasks\/([^/]+)\/qc-override-requests$/);
      if (overrideRequest) {
        const auth = authorize(this.token, body.branchId, "qc.override.request");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const context = contextFor(auth, branchId, overrideRequest[1]);
        const state = states.get(`${auth.tenantId}:${overrideRequest[1]}`);
        const rework = reworks.find((candidate) => candidate.id === body.reworkId && candidate.tenantId === auth.tenantId &&
          candidate.branchId === branchId && candidate.taskId === overrideRequest[1]);
        if (!context || !state || !rework) return response(404, "QC_TASK_OR_REWORK_NOT_FOUND");
        if (state.status !== "FAILED" || rework.status !== "BLOCKING") return response(409, "QC_OVERRIDE_NOT_ACTIONABLE");
        if (options.ifMatch !== state.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: state.resourceVersion });
        if (!options.idempotencyKey) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";
        const customerCommunicationNote = typeof body.customerCommunicationNote === "string" ? body.customerCommunicationNote.trim() : "";
        if (!reason || !customerCommunicationNote || !validEvidence(auth, branchId, body.evidence) || body.evidence.length === 0) {
          return response(422, "QC_OVERRIDE_EVIDENCE_AND_VISIBILITY_REQUIRED");
        }
        if (overrides.some((candidate) => candidate.tenantId === auth.tenantId && candidate.taskId === context.taskId && candidate.status === "APPROVAL_PENDING")) {
          return response(409, "QC_OVERRIDE_ALREADY_PENDING");
        }
        const now = options.now ?? new Date().toISOString();
        const auditReference = `audit-qc-${++auditSequence}`;
        const override: QcOverride = { id: `qc-override-${overrides.length + 1}`, tenantId: auth.tenantId, branchId,
          jobId: context.jobId, taskId: context.taskId, reworkId: rework.id, reason, evidence: clone(body.evidence),
          customerCommunicationNote, policyVersion: context.overridePolicy.version, makerMembershipId: auth.membershipId,
          status: "APPROVAL_PENDING", resourceVersion: 1, requestedAt: now, requestAuditReference: auditReference };
        overrides.push(override);
        const committed: ApiResponse = { status: 202, body: { override: clone(override), resourceVersion: 1, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }

      const overrideApproval = path.match(/^\/api\/v1\/qc-overrides\/([^/]+)\/approval$/);
      if (overrideApproval) {
        const candidate = overrides.find((item) => item.id === overrideApproval[1]);
        const context = candidate ? input.taskContexts.find((item) => item.tenantId === candidate.tenantId && item.branchId === body.branchId && item.taskId === candidate.taskId) : undefined;
        const permission = context?.overridePolicy.checkerPermission ?? "qc.override.approve";
        const auth = authorize(this.token, body.branchId, permission);
        if ("status" in auth) return auth;
        const override = overrides.find((item) => item.id === overrideApproval[1] && item.tenantId === auth.tenantId && item.branchId === body.branchId);
        if (!override || !context) return response(404, "QC_OVERRIDE_NOT_FOUND");
        if (override.makerMembershipId === auth.membershipId) return response(409, "INDEPENDENT_CHECKER_REQUIRED");
        if (override.status !== "APPROVAL_PENDING") return response(409, "QC_OVERRIDE_NOT_ACTIONABLE");
        if (options.ifMatch !== override.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: override.resourceVersion });
        if (!options.idempotencyKey) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const now = options.now ?? new Date().toISOString();
        const authAt = typeof options.reauthenticatedAt === "string" ? Date.parse(options.reauthenticatedAt) : Number.NaN;
        const ageSeconds = (Date.parse(now) - authAt) / 1000;
        if (!Number.isFinite(authAt) || ageSeconds < 0 || ageSeconds > context.overridePolicy.recentAuthenticationSeconds) {
          return response(403, "RECENT_AUTHENTICATION_REQUIRED");
        }
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";
        if (!reason || !["APPROVE", "REJECT"].includes(body.decision)) return response(422, "VALID_OVERRIDE_DECISION_REQUIRED");
        const auditReference = `audit-qc-${++auditSequence}`;
        override.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED"; override.resourceVersion += 1;
        override.checkerMembershipId = auth.membershipId; override.checkerReason = reason; override.decidedAt = now; override.approvalAuditReference = auditReference;
        const state = states.get(`${auth.tenantId}:${override.taskId}`)!;
        if (override.status === "APPROVED") {
          state.status = "OVERRIDDEN"; state.resourceVersion += 1;
          releaseEvents.push({ id: `qc-release-${releaseEvents.length + 1}`, type: "S16_QC_OVERRIDDEN", tenantId: auth.tenantId,
            branchId: override.branchId, aggregateId: override.taskId, aggregateVersion: state.resourceVersion, occurredAt: now,
            payload: { jobId: override.jobId, taskId: override.taskId, overrideId: override.id, qcStatus: "OVERRIDDEN", customerVisible: true, releaseVisible: true } });
        }
        const committed: ApiResponse = { status: 200, body: { override: clone(override), qcStatus: state.status,
          resourceVersion: override.resourceVersion, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }

      const assignment = path.match(/^\/api\/v1\/reworks\/([^/]+)\/assignment$/);
      if (assignment) {
        const auth = authorize(this.token, body.branchId, "rework.assign");
        if ("status" in auth) return auth;
        const rework = reworks.find((candidate) => candidate.id === assignment[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
        if (!rework) return response(404, "REWORK_NOT_FOUND");
        if (rework.status !== "BLOCKING") return response(409, "REWORK_NOT_ASSIGNABLE");
        if (options.ifMatch !== rework.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: rework.resourceVersion });
        if (!options.idempotencyKey) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";
        const technician = Object.values(input.memberships).find((candidate) => candidate.tenantId === auth.tenantId &&
          candidate.branchIds.includes(body.branchId) && candidate.membershipId === body.technicianMembershipId && candidate.permissions.includes("rework.execute"));
        if (!reason || !technician) return response(422, "VALID_REWORK_ASSIGNMENT_REQUIRED");
        const now = options.now ?? new Date().toISOString();
        const auditReference = `audit-qc-${++auditSequence}`;
        const priorStatus = rework.status;
        rework.status = "ASSIGNED"; rework.assignedTechnicianMembershipId = technician.membershipId;
        rework.assignmentReason = reason; rework.resourceVersion += 1;
        reworkHistory.push({ reworkId: rework.id, priorStatus, newStatus: rework.status, actorMembershipId: auth.membershipId, reason, occurredAt: now, auditReference });
        const committed: ApiResponse = { status: 200, body: { rework: clone(rework), resourceVersion: rework.resourceVersion, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }

      const completion = path.match(/^\/api\/v1\/reworks\/([^/]+)\/completion$/);
      if (completion) {
        const auth = authorize(this.token, body.branchId, "rework.execute");
        if ("status" in auth) return auth;
        const rework = reworks.find((candidate) => candidate.id === completion[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
        if (!rework) return response(404, "REWORK_NOT_FOUND");
        if (rework.status !== "ASSIGNED" || rework.assignedTechnicianMembershipId !== auth.membershipId) return response(409, "REWORK_NOT_ASSIGNED_TO_ACTOR");
        if (options.ifMatch !== rework.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: rework.resourceVersion });
        if (!options.idempotencyKey) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";
        if (!reason || !validEvidence(auth, String(body.branchId), body.evidence) || body.evidence.length === 0) return response(422, "REWORK_EVIDENCE_REQUIRED");
        const now = options.now ?? new Date().toISOString();
        const auditReference = `audit-qc-${++auditSequence}`;
        const priorStatus = rework.status;
        rework.status = "READY_FOR_REINSPECTION"; rework.completionReason = reason; rework.completionEvidence = clone(body.evidence); rework.resourceVersion += 1;
        reworkHistory.push({ reworkId: rework.id, priorStatus, newStatus: rework.status, actorMembershipId: auth.membershipId, reason, occurredAt: now, auditReference });
        const committed: ApiResponse = { status: 200, body: { rework: clone(rework), resourceVersion: rework.resourceVersion, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }

      const reinspection = path.match(/^\/api\/v1\/reworks\/([^/]+)\/reinspection$/);
      if (reinspection) {
        const auth = authorize(this.token, body.branchId, "qc.inspect");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const rework = reworks.find((candidate) => candidate.id === reinspection[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
        if (!rework) return response(404, "REWORK_NOT_FOUND");
        if (rework.status !== "READY_FOR_REINSPECTION" || rework.assignedTechnicianMembershipId === auth.membershipId) return response(409, "INDEPENDENT_REINSPECTION_REQUIRED");
        if (options.ifMatch !== rework.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: rework.resourceVersion });
        if (!options.idempotencyKey) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        const context = contextFor(auth, branchId, rework.taskId)!;
        const state = states.get(`${auth.tenantId}:${rework.taskId}`)!;
        const reason = typeof body.reason === "string" ? body.reason.trim() : "";
        if (!reason || !Array.isArray(body.items) || body.items.length !== context.checklist.items.length) return response(422, "COMPLETE_QC_CHECKLIST_REQUIRED");
        const submitted = new Map(body.items.map((item: Record<string, unknown>) => [item.checklistKey, item]));
        const normalized: InspectionItem[] = [];
        for (const configured of context.checklist.items) {
          const raw = submitted.get(configured.key) as Record<string, any> | undefined;
          if (!raw || !["PASS", "FAIL", "NOT_APPLICABLE"].includes(raw.status) ||
            (configured.readingRequired && (typeof raw.reading !== "string" || !raw.reading.trim())) || typeof raw.notes !== "string" || !raw.notes.trim() ||
            !validEvidence(auth, branchId, raw.evidence) || (configured.evidenceRequired && raw.evidence.length === 0)) return response(422, "INVALID_QC_ITEM", { checklistKey: configured.key });
          normalized.push({ checklistKey: configured.key, label: configured.label, status: raw.status,
            ...(raw.reading?.trim() ? { reading: raw.reading.trim() } : {}), notes: raw.notes.trim(), evidence: clone(raw.evidence) });
        }
        const now = options.now ?? new Date().toISOString();
        const auditReference = `audit-qc-${++auditSequence}`;
        const result = normalized.some((item) => item.status === "FAIL") ? "FAIL" : "PASS";
        const inspection: Inspection = { id: `qc-inspection-${inspections.length + 1}`, tenantId: auth.tenantId, branchId,
          jobId: context.jobId, taskId: context.taskId, attempt: inspections.filter((item) => item.tenantId === auth.tenantId && item.taskId === context.taskId).length + 1,
          checklist: { masterId: context.checklist.masterId, version: context.checklist.version }, items: normalized, result, reason,
          actorMembershipId: auth.membershipId, occurredAt: now, auditReference };
        inspections.push(inspection);
        const priorStatus = rework.status;
        rework.status = result === "PASS" ? "PASSED" : "BLOCKING"; rework.resourceVersion += 1;
        reworkHistory.push({ reworkId: rework.id, priorStatus, newStatus: rework.status, actorMembershipId: auth.membershipId, reason, occurredAt: now, auditReference });
        state.status = result === "PASS" ? "PASSED" : "FAILED"; state.resourceVersion += 1;
        if (result === "PASS") releaseEvents.push({ id: `qc-release-${releaseEvents.length + 1}`, type: "S16_QC_PASSED", tenantId: auth.tenantId,
          branchId, aggregateId: context.taskId, aggregateVersion: state.resourceVersion, occurredAt: now,
          payload: { jobId: context.jobId, taskId: context.taskId, inspectionId: inspection.id, qcStatus: "PASSED" } });
        const committed: ApiResponse = { status: 201, body: { inspection: clone(inspection), rework: clone(rework), qcStatus: state.status,
          resourceVersion: rework.resourceVersion, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }

      const match = path.match(/^\/api\/v1\/tasks\/([^/]+)\/qc-inspections$/);
      if (!match) return response(404, "ROUTE_NOT_FOUND");
      const taskId = match[1];
      const auth = authorize(this.token, body.branchId, "qc.inspect");
      if ("status" in auth) return auth;
      const branchId = String(body.branchId);
      const context = contextFor(auth, branchId, taskId);
      const state = states.get(`${auth.tenantId}:${taskId}`);
      if (!context || !state) return response(404, "QC_TASK_NOT_FOUND");
      if (context.technicianMembershipIds.includes(auth.membershipId)) return response(409, "INDEPENDENT_QC_REQUIRED");
      if (!options.idempotencyKey) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
      const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
      const commandFingerprint = fingerprint({ path, body });
      const prior = commands.get(commandKey);
      if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
      if (state.status !== "PENDING_QC") return response(409, "QC_NOT_ACTIONABLE");
      if (options.ifMatch !== state.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: state.resourceVersion });
      const reason = typeof body.reason === "string" ? body.reason.trim() : "";
      if (!reason || !Array.isArray(body.items) || body.items.length !== context.checklist.items.length) return response(422, "COMPLETE_QC_CHECKLIST_REQUIRED");
      const submitted = new Map(body.items.map((item: Record<string, unknown>) => [item.checklistKey, item]));
      const normalized: InspectionItem[] = [];
      for (const configured of context.checklist.items) {
        const raw = submitted.get(configured.key) as Record<string, any> | undefined;
        if (!raw || !["PASS", "FAIL", "NOT_APPLICABLE"].includes(raw.status) ||
          (configured.readingRequired && (typeof raw.reading !== "string" || !raw.reading.trim())) ||
          typeof raw.notes !== "string" || !raw.notes.trim() || !validEvidence(auth, branchId, raw.evidence) ||
          (configured.evidenceRequired && raw.evidence.length === 0)) return response(422, "INVALID_QC_ITEM", { checklistKey: configured.key });
        normalized.push({ checklistKey: configured.key, label: configured.label, status: raw.status,
          ...(raw.reading?.trim() ? { reading: raw.reading.trim() } : {}), notes: raw.notes.trim(), evidence: clone(raw.evidence) });
      }
      const now = options.now ?? new Date().toISOString();
      const auditReference = `audit-qc-${++auditSequence}`;
      const result = normalized.some((item) => item.status === "FAIL") ? "FAIL" : "PASS";
      const inspection: Inspection = { id: `qc-inspection-${inspections.length + 1}`, tenantId: auth.tenantId, branchId,
        jobId: context.jobId, taskId, attempt: inspections.filter((item) => item.tenantId === auth.tenantId && item.taskId === taskId).length + 1,
        checklist: { masterId: context.checklist.masterId, version: context.checklist.version }, items: normalized, result, reason,
        actorMembershipId: auth.membershipId, occurredAt: now, auditReference };
      inspections.push(inspection);
      state.status = result === "PASS" ? "PASSED" : "FAILED";
      state.resourceVersion += 1;
      let rework: Rework | undefined;
      if (result === "FAIL") {
        const failedItems = normalized.filter((item) => item.status === "FAIL");
        rework = { id: `rework-${reworks.length + 1}`, tenantId: auth.tenantId, branchId, jobId: context.jobId, taskId,
          failedInspectionId: inspection.id, failedChecklistKeys: failedItems.map((item) => item.checklistKey),
          failureEvidence: failedItems.flatMap((item) => clone(item.evidence)), reason, status: "BLOCKING",
          createdByMembershipId: auth.membershipId, occurredAt: now, auditReference, resourceVersion: 1 };
        reworks.push(rework);
      }
      if (result === "PASS") releaseEvents.push({ id: `qc-release-${releaseEvents.length + 1}`, type: "S16_QC_PASSED",
        tenantId: auth.tenantId, branchId, aggregateId: taskId, aggregateVersion: state.resourceVersion, occurredAt: now,
        payload: { jobId: context.jobId, taskId, inspectionId: inspection.id, qcStatus: "PASSED" } });
      const committed: ApiResponse = { status: 201, body: { inspection: clone(inspection), qcStatus: state.status,
        ...(rework ? { rework: clone(rework) } : {}), resourceVersion: state.resourceVersion, auditReference } };
      commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
      return committed;
    }
  }

  return {
    signIn: (token: string) => new Session(token),
    testing: { inspections: () => clone(inspections), reworks: () => clone(reworks), reworkHistory: () => clone(reworkHistory),
      overrides: () => clone(overrides), releaseEvents: () => clone(releaseEvents) },
  };
}
