import { createHash } from "node:crypto";

export type AdvisorMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

export type ReceptionJobPort = {
  id: string;
  tenantId: string;
  branchId: string;
  visitId: string;
  customerId: string;
  vehicleId: string;
  advisorIdentityId: string;
  customerRequest: string;
  promisedHandoffAt: string;
  status: "DRAFT";
  resourceVersion: number;
};

export type InspectionFieldConfiguration = {
  id: string;
  label: string;
  kind: "TEXT" | "BOOLEAN" | "DECIMAL" | "CHOICE";
  required: boolean;
  options?: string[];
};

export type InspectionConfiguration = {
  tenantId: string;
  branchId: string;
  versionId: string;
  fields: InspectionFieldConfiguration[];
  requiredEvidenceKinds: string[];
};

type AdvisorJob = ReceptionJobPort & {
  promisedDeliveryAt?: string;
  projectedReadyAt?: string;
  promisedDeliveryRisk: "NOT_SET" | "ON_TRACK" | "AT_RISK" | "OVERDUE";
  lastInspectionId?: string;
};
type PromisedDeliveryHistory = {
  jobId: string;
  previousPromisedDeliveryAt?: string;
  promisedDeliveryAt: string;
  projectedReadyAt: string;
  risk: "ON_TRACK" | "AT_RISK" | "OVERDUE";
  reason: string;
  actorIdentityId: string;
  membershipId: string;
  changedAt: string;
  auditReference: string;
};

type AdvisorAction = {
  id: string;
  jobId: string;
  tenantId: string;
  branchId: string;
  ownerIdentityId: string;
  kind: "ADVISOR_JOB";
  status: "OPEN";
  nextAction: string;
  resourceVersion: number;
};

type OwnershipHistory = {
  jobId: string;
  fromAdvisorIdentityId: string;
  toAdvisorIdentityId: string;
  reason: string;
  actorIdentityId: string;
  membershipId: string;
  changedAt: string;
  auditReference: string;
};

type MediaReference = {
  kind: string;
  objectKey: string;
  checksumSha256: string;
  scanStatus: "CLEAN";
};
type InspectionFinding = {
  fieldId: string;
  label: string;
  kind: InspectionFieldConfiguration["kind"];
  value: string | boolean;
  result: "OK" | "ATTENTION" | "CRITICAL" | "NOT_APPLICABLE";
};
type RecommendedScopeItem = { code: string; description: string; sourceFieldIds: string[] };
type AdvisorInspection = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  advisorIdentityId: string;
  configurationVersionId: string;
  findings: InspectionFinding[];
  freeTextFindings: string;
  evidence: MediaReference[];
  recommendedScope: RecommendedScopeItem[];
  customerNotes?: string;
  internalNotes?: string;
  recordedAt: string;
  resourceVersion: 1;
};
export type AdvisorScopeHandoff = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  inspectionId: string;
  jobVersion: number;
  eventType: "ADVISOR_SCOPE_RECOMMENDED";
  recommendedScope: RecommendedScopeItem[];
  occurredAt: string;
  auditReference: string;
};
type FollowUp = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  ownerIdentityId: string;
  description: string;
  dueAt: string;
  status: "OPEN" | "COMPLETED";
  dueState: "OVERDUE" | "DUE_TODAY" | "UPCOMING" | "COMPLETED";
  outcome?: string;
  completedAt?: string;
  createdAt: string;
  resourceVersion: number;
};

type AuditEntry = {
  auditReference: string;
  tenantId: string;
  branchId: string;
  action: string;
  actorIdentityId: string;
  membershipId: string;
  resourceType: "ADVISOR_JOB" | "INSPECTION" | "FOLLOW_UP" | "PROMISED_DELIVERY";
  resourceId: string;
  occurredAt: string;
  requestId?: string;
};

type ApiBody = {
  code?: string;
  message?: string;
  job?: AdvisorJob;
  jobs?: AdvisorJob[];
  actions?: AdvisorAction[];
  ownershipHistory?: OwnershipHistory[];
  auditEntries?: AuditEntry[];
  inspection?: AdvisorInspection;
  inspections?: AdvisorInspection[];
  scopeHandoff?: AdvisorScopeHandoff;
  scopeHandoffs?: AdvisorScopeHandoff[];
  followUp?: FollowUp;
  followUps?: FollowUp[];
  promisedDeliveryHistory?: PromisedDeliveryHistory[];
  resourceVersion?: number;
  auditReference?: string;
  [key: string]: unknown;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; requestId?: string };

const clone = <T>(value: T): T => structuredClone(value);
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const validInstant = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
const validMedia = (value: unknown, tenantId: string, branchId: string): value is MediaReference => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.kind === "string" && item.kind.trim().length > 0 &&
    typeof item.objectKey === "string" && item.objectKey.startsWith(`private/${tenantId}/${branchId}/`) &&
    typeof item.checksumSha256 === "string" && /^[a-f0-9]{64}$/i.test(item.checksumSha256) && item.scanStatus === "CLEAN";
};

export function createLocalAdvisorInspectionApi(input: {
  memberships: Record<string, AdvisorMembership>;
  receptionJobs: ReceptionJobPort[];
  inspectionConfigurations: InspectionConfiguration[];
}) {
  const jobs = new Map<string, AdvisorJob>();
  const actions = new Map<string, AdvisorAction>();
  const ownershipHistory: OwnershipHistory[] = [];
  const audits: AuditEntry[] = [];
  const inspections = new Map<string, AdvisorInspection>();
  const scopeHandoffs: AdvisorScopeHandoff[] = [];
  const followUps = new Map<string, FollowUp>();
  const promisedDeliveryHistory: PromisedDeliveryHistory[] = [];
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  let auditSequence = 0;
  let inspectionSequence = 0;
  let handoffSequence = 0;
  let followUpSequence = 0;

  const eligibleOwner = (tenantId: string, branchId: string, identityId: string) => Object.values(input.memberships).some(
    (membership) => membership.tenantId === tenantId && membership.identityId === identityId &&
      membership.branchIds.includes(branchId) && membership.permissions.includes("advisor.job.read"),
  );
  const eligibleFollowUpOwner = (tenantId: string, branchId: string, identityId: string) => Object.values(input.memberships).some(
    (membership) => membership.tenantId === tenantId && membership.identityId === identityId &&
      membership.branchIds.includes(branchId) && membership.permissions.includes("follow-up.read"),
  );
  const withDueState = (followUp: FollowUp, asOf: string): FollowUp => {
    if (followUp.status === "COMPLETED") return { ...followUp, dueState: "COMPLETED" };
    if (followUp.dueAt < asOf) return { ...followUp, dueState: "OVERDUE" };
    if (followUp.dueAt.slice(0, 10) === asOf.slice(0, 10)) return { ...followUp, dueState: "DUE_TODAY" };
    return { ...followUp, dueState: "UPCOMING" };
  };
  const withPromiseRisk = (job: AdvisorJob, asOf: string): AdvisorJob => {
    if (!job.promisedDeliveryAt) return { ...job, promisedDeliveryRisk: "NOT_SET" };
    if (asOf > job.promisedDeliveryAt) return { ...job, promisedDeliveryRisk: "OVERDUE" };
    return { ...job, promisedDeliveryRisk: job.projectedReadyAt && job.projectedReadyAt > job.promisedDeliveryAt ? "AT_RISK" : "ON_TRACK" };
  };
  for (const seed of input.receptionJobs) {
    const key = `${seed.tenantId}:${seed.id}`;
    if (jobs.has(key)) throw new Error(`Duplicate reception Job ${seed.id}`);
    if (!seed.advisorIdentityId.trim() || !eligibleOwner(seed.tenantId, seed.branchId, seed.advisorIdentityId)) {
      throw new Error(`Reception Job ${seed.id} requires exactly one eligible accountable advisor`);
    }
    const job: AdvisorJob = { ...clone(seed), promisedDeliveryRisk: "NOT_SET" };
    jobs.set(key, job);
    actions.set(key, { id: `advisor-action-${seed.id}`, jobId: seed.id, tenantId: seed.tenantId, branchId: seed.branchId,
      ownerIdentityId: seed.advisorIdentityId, kind: "ADVISOR_JOB", status: "OPEN", nextAction: "Inspect vehicle and recommend scope",
      resourceVersion: 1 });
  }

  const authorize = (token: string, branchId: unknown, permission: string): AdvisorMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
    if (!membership.permissions.includes(permission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
    return membership;
  };
  const visibleJob = (member: AdvisorMembership, branchId: string, id: string) => {
    const job = jobs.get(`${member.tenantId}:${id}`);
    return job?.branchId === branchId ? job : undefined;
  };
  const execute = (member: AdvisorMembership, path: string, body: Record<string, unknown>, options: CommandOptions, work: () => ApiResponse): ApiResponse => {
    if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const key = `${member.tenantId}:${options.idempotencyKey}`;
    const digest = fingerprint({ path, body, ifMatch: options.ifMatch });
    const prior = commands.get(key);
    if (prior) return prior.fingerprint === digest ? clone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
    const response = work();
    if (response.status >= 200 && response.status < 300) commands.set(key, { fingerprint: digest, response: clone(response) });
    return clone(response);
  };
  const audit = (member: AdvisorMembership, branchId: string, action: string, resourceType: AuditEntry["resourceType"], resourceId: string, now: string, requestId?: string) => {
    const auditReference = `audit-advisor-${++auditSequence}`;
    audits.push({ auditReference, tenantId: member.tenantId, branchId, action, actorIdentityId: member.identityId,
      membershipId: member.membershipId, resourceType, resourceId, occurredAt: now, ...(requestId ? { requestId } : {}) });
    return auditReference;
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const promisedDelivery = path.match(/^\/api\/v1\/advisor\/jobs\/([^/]+)\/promised-delivery$/);
      if (promisedDelivery) {
        const auth = authorize(this.token, body.branchId, "promised-delivery.manage");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const job = visibleJob(auth, branchId, promisedDelivery[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          if (job.advisorIdentityId !== auth.identityId && !auth.permissions.includes("promised-delivery.manage-any")) {
            return { status: 403, body: { code: "ACCOUNTABLE_ADVISOR_REQUIRED" } };
          }
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== job.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: job.resourceVersion } };
          const reason = String(body.reason ?? "").trim();
          if (!reason) return { status: 422, body: { code: "PROMISED_DELIVERY_REASON_REQUIRED" } };
          if (!validInstant(body.promisedDeliveryAt) || !validInstant(body.projectedReadyAt)) return { status: 422, body: { code: "INVALID_PROMISED_DELIVERY" } };
          const now = options.now ?? new Date().toISOString();
          const promisedDeliveryAt = String(body.promisedDeliveryAt);
          const projectedReadyAt = String(body.projectedReadyAt);
          if (promisedDeliveryAt <= now || promisedDeliveryAt === job.promisedDeliveryAt) return { status: 422, body: { code: "INVALID_PROMISED_DELIVERY" } };
          const risk = now > promisedDeliveryAt ? "OVERDUE" : projectedReadyAt > promisedDeliveryAt ? "AT_RISK" : "ON_TRACK";
          const next: AdvisorJob = { ...job, promisedDeliveryAt, projectedReadyAt, promisedDeliveryRisk: risk, resourceVersion: job.resourceVersion + 1 };
          const auditReference = audit(auth, branchId, "promised-delivery.changed", "PROMISED_DELIVERY", job.id, now, options.requestId);
          promisedDeliveryHistory.push({ jobId: job.id, ...(job.promisedDeliveryAt ? { previousPromisedDeliveryAt: job.promisedDeliveryAt } : {}),
            promisedDeliveryAt, projectedReadyAt, risk, reason, actorIdentityId: auth.identityId, membershipId: auth.membershipId, changedAt: now, auditReference });
          jobs.set(`${auth.tenantId}:${job.id}`, next);
          const action = actions.get(`${auth.tenantId}:${job.id}`)!;
          actions.set(`${auth.tenantId}:${job.id}`, { ...action,
            nextAction: risk === "AT_RISK" ? "Resolve promised-delivery risk with the customer" : action.nextAction,
            resourceVersion: action.resourceVersion + 1 });
          return { status: 200, body: { job: clone(next), resourceVersion: next.resourceVersion, auditReference } };
        });
      }
      const followUpCreation = path.match(/^\/api\/v1\/advisor\/jobs\/([^/]+)\/follow-ups$/);
      if (followUpCreation) {
        const auth = authorize(this.token, body.branchId, "follow-up.manage");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const job = visibleJob(auth, branchId, followUpCreation[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          const ownerIdentityId = String(body.ownerIdentityId ?? "").trim();
          const description = String(body.description ?? "").trim();
          if (!ownerIdentityId || !description || !validInstant(body.dueAt)) return { status: 422, body: { code: "INVALID_FOLLOW_UP" } };
          if (!eligibleFollowUpOwner(auth.tenantId, branchId, ownerIdentityId)) return { status: 422, body: { code: "FOLLOW_UP_OWNER_NOT_ELIGIBLE" } };
          const now = options.now ?? new Date().toISOString();
          const followUp: FollowUp = { id: `follow-up-${++followUpSequence}`, tenantId: auth.tenantId, branchId, jobId: job.id,
            ownerIdentityId, description, dueAt: String(body.dueAt), status: "OPEN", dueState: "UPCOMING", createdAt: now, resourceVersion: 1 };
          const auditReference = audit(auth, branchId, "advisor-follow-up.created", "FOLLOW_UP", followUp.id, now, options.requestId);
          followUps.set(`${auth.tenantId}:${followUp.id}`, followUp);
          return { status: 201, body: { followUp: clone(withDueState(followUp, now)), resourceVersion: 1, auditReference } };
        });
      }
      const followUpCompletion = path.match(/^\/api\/v1\/advisor\/follow-ups\/([^/]+)\/complete$/);
      if (followUpCompletion) {
        const auth = authorize(this.token, body.branchId, "follow-up.manage");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const followUp = followUps.get(`${auth.tenantId}:${followUpCompletion[1]}`);
          if (!followUp || followUp.branchId !== branchId) return { status: 404, body: { code: "FOLLOW_UP_NOT_FOUND" } };
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== followUp.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: followUp.resourceVersion } };
          if (followUp.status !== "OPEN") return { status: 409, body: { code: "FOLLOW_UP_ALREADY_COMPLETED" } };
          const outcome = String(body.outcome ?? "").trim();
          if (!outcome) return { status: 422, body: { code: "FOLLOW_UP_OUTCOME_REQUIRED" } };
          if (followUp.ownerIdentityId !== auth.identityId && !auth.permissions.includes("follow-up.manage-any")) {
            return { status: 403, body: { code: "FOLLOW_UP_OWNER_REQUIRED" } };
          }
          const now = options.now ?? new Date().toISOString();
          const next: FollowUp = { ...followUp, status: "COMPLETED", dueState: "COMPLETED", outcome, completedAt: now, resourceVersion: followUp.resourceVersion + 1 };
          const auditReference = audit(auth, branchId, "advisor-follow-up.completed", "FOLLOW_UP", followUp.id, now, options.requestId);
          followUps.set(`${auth.tenantId}:${followUp.id}`, next);
          return { status: 200, body: { followUp: clone(next), resourceVersion: next.resourceVersion, auditReference } };
        });
      }
      const inspectionSubmission = path.match(/^\/api\/v1\/advisor\/jobs\/([^/]+)\/inspections$/);
      if (inspectionSubmission) {
        const auth = authorize(this.token, body.branchId, "inspection.submit");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const job = visibleJob(auth, branchId, inspectionSubmission[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          if (job.advisorIdentityId !== auth.identityId && !auth.permissions.includes("inspection.submit-any")) {
            return { status: 403, body: { code: "ACCOUNTABLE_ADVISOR_REQUIRED" } };
          }
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== job.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: job.resourceVersion } };
          const configuration = input.inspectionConfigurations.find((item) => item.tenantId === auth.tenantId && item.branchId === branchId && item.versionId === body.configurationVersionId);
          if (!configuration) return { status: 422, body: { code: "INSPECTION_CONFIGURATION_NOT_FOUND" } };
          const rawFindings = Array.isArray(body.findings) ? body.findings : [];
          const findingIds = rawFindings.map((item) => item && typeof item === "object" ? String((item as Record<string, unknown>).fieldId ?? "") : "");
          const missingFieldIds = configuration.fields.filter((field) => field.required && !findingIds.includes(field.id)).map((field) => field.id);
          if (missingFieldIds.length) return { status: 422, body: { code: "REQUIRED_FINDINGS_MISSING", missingFieldIds } };
          if (new Set(findingIds).size !== findingIds.length || rawFindings.some((raw) => {
            if (!raw || typeof raw !== "object") return true;
            const item = raw as Record<string, unknown>;
            const field = configuration.fields.find((candidate) => candidate.id === item.fieldId);
            if (!field || !["OK", "ATTENTION", "CRITICAL", "NOT_APPLICABLE"].includes(String(item.result))) return true;
            if (field.kind === "BOOLEAN") return typeof item.value !== "boolean";
            if (typeof item.value !== "string" || !item.value.trim()) return true;
            if (field.kind === "DECIMAL") return !/^-?(0|[1-9]\d*)(\.\d+)?$/.test(item.value);
            if (field.kind === "CHOICE") return !field.options?.includes(item.value);
            return false;
          })) return { status: 422, body: { code: "INVALID_INSPECTION_FINDINGS" } };
          const rawEvidence = Array.isArray(body.evidence) ? body.evidence : [];
          if (!rawEvidence.every((item) => validMedia(item, auth.tenantId, branchId))) return { status: 422, body: { code: "INVALID_INSPECTION_EVIDENCE" } };
          const evidenceKinds = new Set(rawEvidence.map((item) => (item as MediaReference).kind));
          const missingEvidenceKinds = configuration.requiredEvidenceKinds.filter((kind) => !evidenceKinds.has(kind));
          if (missingEvidenceKinds.length) return { status: 422, body: { code: "REQUIRED_EVIDENCE_MISSING", missingEvidenceKinds } };
          const freeTextFindings = String(body.freeTextFindings ?? "").trim();
          const customerNotes = String(body.customerNotes ?? "").trim();
          const internalNotes = String(body.internalNotes ?? "").trim();
          if (!freeTextFindings) return { status: 422, body: { code: "FREE_TEXT_FINDINGS_REQUIRED" } };
          if (customerNotes && !auth.permissions.includes("inspection.customer-notes.write")) return { status: 403, body: { code: "CUSTOMER_NOTES_WRITE_DENIED" } };
          if (internalNotes && !auth.permissions.includes("inspection.internal-notes.write")) return { status: 403, body: { code: "INTERNAL_NOTES_WRITE_DENIED" } };
          const rawScope = Array.isArray(body.recommendedScope) ? body.recommendedScope : [];
          const scopeCodes = rawScope.map((item) => item && typeof item === "object" ? String((item as Record<string, unknown>).code ?? "").trim() : "");
          if (!rawScope.length || new Set(scopeCodes).size !== scopeCodes.length || rawScope.some((raw) => {
            if (!raw || typeof raw !== "object") return true;
            const item = raw as Record<string, unknown>;
            return !String(item.code ?? "").trim() || !String(item.description ?? "").trim() || !Array.isArray(item.sourceFieldIds) ||
              !item.sourceFieldIds.length || item.sourceFieldIds.some((fieldId) => !findingIds.includes(String(fieldId)));
          })) return { status: 422, body: { code: "INVALID_RECOMMENDED_SCOPE" } };
          const now = options.now ?? new Date().toISOString();
          const id = `inspection-${++inspectionSequence}`;
          const findingById = new Map(configuration.fields.map((field) => [field.id, field]));
          const findings: InspectionFinding[] = rawFindings.map((raw) => {
            const item = raw as Record<string, unknown>;
            const field = findingById.get(String(item.fieldId))!;
            return { fieldId: field.id, label: field.label, kind: field.kind, value: item.value as string | boolean, result: item.result as InspectionFinding["result"] };
          });
          const recommendedScope: RecommendedScopeItem[] = rawScope.map((raw) => {
            const item = raw as Record<string, unknown>;
            return { code: String(item.code).trim(), description: String(item.description).trim(), sourceFieldIds: (item.sourceFieldIds as unknown[]).map(String) };
          });
          const inspection: AdvisorInspection = { id, tenantId: auth.tenantId, branchId, jobId: job.id, advisorIdentityId: auth.identityId,
            configurationVersionId: configuration.versionId, findings, freeTextFindings, evidence: clone(rawEvidence) as MediaReference[], recommendedScope,
            ...(customerNotes ? { customerNotes } : {}), ...(internalNotes ? { internalNotes } : {}), recordedAt: now, resourceVersion: 1 };
          const next = { ...job, lastInspectionId: id, resourceVersion: job.resourceVersion + 1 };
          const action = actions.get(`${auth.tenantId}:${job.id}`)!;
          const auditReference = audit(auth, branchId, "advisor-inspection.submitted", "INSPECTION", id, now, options.requestId);
          const scopeHandoff: AdvisorScopeHandoff = { id: `scope-handoff-${++handoffSequence}`, tenantId: auth.tenantId, branchId, jobId: job.id,
            inspectionId: id, jobVersion: next.resourceVersion, eventType: "ADVISOR_SCOPE_RECOMMENDED", recommendedScope: clone(recommendedScope), occurredAt: now, auditReference };
          inspections.set(`${auth.tenantId}:${id}`, inspection);
          jobs.set(`${auth.tenantId}:${job.id}`, next);
          actions.set(`${auth.tenantId}:${job.id}`, { ...action, nextAction: "Prepare estimate from recommended scope", resourceVersion: action.resourceVersion + 1 });
          scopeHandoffs.push(scopeHandoff);
          return { status: 201, body: { inspection: clone(inspection), scopeHandoff: clone(scopeHandoff), job: clone(next), resourceVersion: next.resourceVersion, auditReference } };
        });
      }
      const reassignment = path.match(/^\/api\/v1\/advisor\/jobs\/([^/]+)\/reassign$/);
      if (reassignment) {
        const auth = authorize(this.token, body.branchId, "advisor.job.reassign");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const job = visibleJob(auth, branchId, reassignment[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== job.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: job.resourceVersion } };
          const nextOwner = String(body.advisorIdentityId ?? "").trim();
          const reason = String(body.reason ?? "").trim();
          if (!nextOwner || !reason || nextOwner === job.advisorIdentityId) return { status: 422, body: { code: "INVALID_REASSIGNMENT" } };
          if (!eligibleOwner(auth.tenantId, branchId, nextOwner)) return { status: 422, body: { code: "ADVISOR_NOT_ELIGIBLE" } };
          const now = options.now ?? new Date().toISOString();
          const oldOwner = job.advisorIdentityId;
          const next = { ...job, advisorIdentityId: nextOwner, resourceVersion: job.resourceVersion + 1 };
          const action = actions.get(`${auth.tenantId}:${job.id}`)!;
          const auditReference = audit(auth, branchId, "advisor-job.reassigned", "ADVISOR_JOB", job.id, now, options.requestId);
          jobs.set(`${auth.tenantId}:${job.id}`, next);
          actions.set(`${auth.tenantId}:${job.id}`, { ...action, ownerIdentityId: nextOwner, resourceVersion: action.resourceVersion + 1 });
          ownershipHistory.push({ jobId: job.id, fromAdvisorIdentityId: oldOwner, toAdvisorIdentityId: nextOwner, reason,
            actorIdentityId: auth.identityId, membershipId: auth.membershipId, changedAt: now, auditReference });
          return { status: 200, body: { job: clone(next), resourceVersion: next.resourceVersion, auditReference } };
        });
      }
      return { status: 404, body: { code: "ROUTE_NOT_FOUND" } };
    }

    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "http://local");
      const branchId = url.searchParams.get("branchId") ?? "";
      const auth = authorize(this.token, branchId, "advisor.job.read");
      if ("status" in auth) return auth;
      if (url.pathname === "/api/v1/advisor/jobs") {
        const requestedOwner = url.searchParams.get("owner");
        const owner = requestedOwner === "me" ? auth.identityId : requestedOwner;
        if (requestedOwner && requestedOwner !== "me" && requestedOwner !== auth.identityId && !auth.permissions.includes("advisor.queue.read-all")) {
          return { status: 403, body: { code: "QUEUE_OWNER_FORBIDDEN" } };
        }
        const asOf = url.searchParams.get("asOf") ?? new Date().toISOString();
        if (!validInstant(asOf)) return { status: 422, body: { code: "INVALID_AS_OF" } };
        const visible = [...jobs.values()].filter((job) => job.tenantId === auth.tenantId && job.branchId === branchId && (!owner || job.advisorIdentityId === owner))
          .map((job) => withPromiseRisk(job, asOf));
        const ids = new Set(visible.map((job) => job.id));
        return { status: 200, body: { jobs: clone(visible), actions: clone([...actions.values()].filter((action) => action.tenantId === auth.tenantId && action.branchId === branchId && ids.has(action.jobId))) } };
      }
      if (url.pathname === "/api/v1/advisor/follow-ups") {
        if (!auth.permissions.includes("follow-up.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
        const requestedOwner = url.searchParams.get("owner");
        const owner = requestedOwner === "me" ? auth.identityId : requestedOwner;
        if (requestedOwner && requestedOwner !== "me" && requestedOwner !== auth.identityId && !auth.permissions.includes("advisor.queue.read-all")) {
          return { status: 403, body: { code: "QUEUE_OWNER_FORBIDDEN" } };
        }
        const asOf = url.searchParams.get("asOf") ?? new Date().toISOString();
        if (!validInstant(asOf)) return { status: 422, body: { code: "INVALID_AS_OF" } };
        const visible = [...followUps.values()].filter((item) => item.tenantId === auth.tenantId && item.branchId === branchId && (!owner || item.ownerIdentityId === owner));
        return { status: 200, body: { followUps: clone(visible.map((item) => withDueState(item, asOf)).sort((left, right) => left.dueAt.localeCompare(right.dueAt))) } };
      }
      if (url.pathname === "/api/v1/advisor/scope-handoffs") {
        if (!auth.permissions.includes("inspection.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
        return { status: 200, body: { scopeHandoffs: clone(scopeHandoffs.filter((event) => event.tenantId === auth.tenantId && event.branchId === branchId)) } };
      }
      const inspectionList = url.pathname.match(/^\/api\/v1\/advisor\/jobs\/([^/]+)\/inspections$/);
      if (inspectionList) {
        if (!auth.permissions.includes("inspection.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
        const job = visibleJob(auth, branchId, inspectionList[1]);
        if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
        const visibleInspections = [...inspections.values()].filter((item) => item.tenantId === auth.tenantId && item.branchId === branchId && item.jobId === job.id)
          .map((item) => {
            const visible = clone(item) as Partial<AdvisorInspection>;
            if (!auth.permissions.includes("inspection.internal-notes.read")) delete visible.internalNotes;
            if (!auth.permissions.includes("inspection.evidence.read")) delete visible.evidence;
            return visible as AdvisorInspection;
          });
        return { status: 200, body: { inspections: visibleInspections } };
      }
      const match = url.pathname.match(/^\/api\/v1\/advisor\/jobs\/([^/]+)$/);
      if (match) {
        const job = visibleJob(auth, branchId, match[1]);
        return job ? { status: 200, body: { job: clone(job), ownershipHistory: clone(ownershipHistory.filter((item) => item.jobId === job.id)),
          promisedDeliveryHistory: clone(promisedDeliveryHistory.filter((item) => item.jobId === job.id)),
          auditEntries: clone(audits.filter((item) => item.tenantId === auth.tenantId && item.branchId === branchId && item.resourceId === job.id)) } }
          : { status: 404, body: { code: "JOB_NOT_FOUND" } };
      }
      return { status: 404, body: { code: "ROUTE_NOT_FOUND" } };
    }
  }

  return { signIn(token: string) { return new Session(token); } };
}
