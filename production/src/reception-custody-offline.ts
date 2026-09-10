import { createHash } from "node:crypto";

export type ReceptionMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

export type ReceptionCheckInRequest = {
  id: string;
  tenantId: string;
  branchId: string;
  appointmentId: string;
  appointmentVersion: number;
  customerId: string;
  vehicleId: string;
  assignedBayId: string;
  assignedStaffId: string;
  requestedAt: string;
  auditReference: string;
  eventType: "RECEPTION_CHECK_IN_REQUESTED";
};

export type ReceptionConfiguration = {
  tenantId: string;
  branchId: string;
  versionId: string;
  requiredPhotoKinds: string[];
  acknowledgementTextVersion: string;
};

type MediaReference = {
  kind: string;
  objectKey: string;
  checksumSha256: string;
  scanStatus: "PENDING" | "CLEAN" | "REJECTED";
};

type Acknowledgement = {
  accepted: true;
  textVersion: string;
  signerName: string;
  method: "SIGNATURE" | "OTP" | "RECORDED_VERBAL";
  evidence: MediaReference;
};

type Visit = {
  id: string;
  tenantId: string;
  branchId: string;
  appointmentId?: string;
  sourceEventId?: string;
  sourceEventVersion?: number;
  customerId: string;
  vehicleId: string;
  advisorIdentityId: string;
  odometerKm: number;
  fuelLevelEighths: number;
  keyCount: number;
  accessories: string[];
  customerRequest: string;
  promisedHandoffAt: string;
  evidence: MediaReference[];
  acknowledgement: Acknowledgement;
  receptionConfigurationVersionId: string;
  checkedInAt: string;
  resourceVersion: number;
};

type Job = {
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

type IncidentAction = { description: string; ownerIdentityId: string; dueAt?: string; status: "OPEN" };
type CustodyIncident = {
  id: string;
  tenantId: string;
  branchId: string;
  visitId: string;
  jobId: string;
  vehicleId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: "DAMAGE" | "LOSS" | "SAFETY" | "OTHER";
  description: string;
  evidence: MediaReference[];
  ownerIdentityId: string;
  actions: IncidentAction[];
  notification: { recipientIdentityIds: string[]; status: "QUEUED"; outboxEventId: string };
  status: "OPEN";
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
  resourceType: "VISIT" | "CUSTODY_INCIDENT";
  resourceId: string;
  occurredAt: string;
  requestId?: string;
};

type ApiBody = {
  code?: string;
  message?: string;
  missingEvidenceKinds?: string[];
  visit?: Visit;
  visits?: Visit[];
  job?: Job;
  jobs?: Job[];
  incident?: CustodyIncident;
  incidents?: CustodyIncident[];
  auditEntries?: AuditEntry[];
  resourceVersion?: number;
  auditReference?: string;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; now?: string; requestId?: string };

const clone = <T>(value: T): T => structuredClone(value);
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const validInstant = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
const validMedia = (value: unknown, tenantId: string, branchId: string): value is MediaReference => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const prefix = `private/${tenantId}/${branchId}/`;
  return typeof item.kind === "string" && item.kind.trim().length > 0 &&
    typeof item.objectKey === "string" && item.objectKey.startsWith(prefix) &&
    typeof item.checksumSha256 === "string" && /^[a-f0-9]{64}$/i.test(item.checksumSha256) &&
    ["PENDING", "CLEAN", "REJECTED"].includes(String(item.scanStatus));
};

export function createLocalReceptionApi(input: {
  memberships: Record<string, ReceptionMembership>;
  receptionConfigurations: ReceptionConfiguration[];
  appointmentEvents?: ReceptionCheckInRequest[];
}) {
  const visits = new Map<string, Visit>();
  const jobs = new Map<string, Job>();
  const incidents = new Map<string, CustodyIncident>();
  const eventConsumers = new Map<string, string>();
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const audits: AuditEntry[] = [];
  let visitSequence = 0;
  let jobSequence = 0;
  let incidentSequence = 0;
  let auditSequence = 0;
  let outboxSequence = 0;

  const authorize = (token: string, branchId: unknown, permission: string): ReceptionMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
    if (!membership.permissions.includes(permission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
    return membership;
  };
  const configurationFor = (member: ReceptionMembership, branchId: string) => input.receptionConfigurations.find(
    (configuration) => configuration.tenantId === member.tenantId && configuration.branchId === branchId,
  );
  const visibleVisit = (member: ReceptionMembership, branchId: string, id: string) => {
    const visit = visits.get(`${member.tenantId}:${id}`);
    return visit?.branchId === branchId ? visit : undefined;
  };
  const execute = (member: ReceptionMembership, path: string, body: Record<string, unknown>, options: CommandOptions, work: () => ApiResponse) => {
    if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const key = `${member.tenantId}:${options.idempotencyKey}`;
    const digest = fingerprint({ path, body });
    const prior = commands.get(key);
    if (prior) return prior.fingerprint === digest
      ? clone({ ...prior.response, status: prior.response.status === 201 || prior.response.status === 202 ? 200 : prior.response.status })
      : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
    const response = work();
    if (response.status >= 200 && response.status < 300) commands.set(key, { fingerprint: digest, response: clone(response) });
    return clone(response);
  };
  const recordAudit = (member: ReceptionMembership, branchId: string, action: string, resourceType: AuditEntry["resourceType"], resourceId: string, now: string, requestId?: string) => {
    const auditReference = `audit-reception-${++auditSequence}`;
    audits.push({ auditReference, tenantId: member.tenantId, branchId, action, actorIdentityId: member.identityId,
      membershipId: member.membershipId, resourceType, resourceId, occurredAt: now, ...(requestId ? { requestId } : {}) });
    return auditReference;
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      if (path === "/api/v1/reception/check-ins") {
        const auth = authorize(this.token, body.branchId, "reception.check-in");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const config = configurationFor(auth, branchId);
        if (!config) return { status: 422, body: { code: "RECEPTION_CONFIGURATION_REQUIRED" } };
        return execute(auth, path, body, options, () => {
          const source = body.source && typeof body.source === "object" ? body.source as Record<string, unknown> : undefined;
          if (!source || !["APPOINTMENT", "WALK_IN"].includes(String(source.type))) return { status: 422, body: { code: "INVALID_CHECK_IN_SOURCE" } };
          let customerId = String(body.customerId ?? "").trim();
          let vehicleId = String(body.vehicleId ?? "").trim();
          let appointment: ReceptionCheckInRequest | undefined;
          if (source.type === "APPOINTMENT") {
            appointment = input.appointmentEvents?.find((event) => event.id === source.receptionRequestId &&
              event.tenantId === auth.tenantId && event.branchId === branchId);
            if (!appointment) return { status: 404, body: { code: "RECEPTION_REQUEST_NOT_FOUND" } };
            const alreadyConsumedBy = eventConsumers.get(`${auth.tenantId}:${appointment.id}`);
            if (alreadyConsumedBy) return { status: 409, body: { code: "RECEPTION_REQUEST_ALREADY_CONSUMED" } };
            customerId = appointment.customerId;
            vehicleId = appointment.vehicleId;
          }
          const advisorIdentityId = String(body.advisorIdentityId ?? "").trim();
          const customerRequest = String(body.customerRequest ?? "").trim();
          const odometerKm = Number(body.odometerKm);
          const fuelLevelEighths = Number(body.fuelLevelEighths);
          const keyCount = Number(body.keyCount);
          const accessories = Array.isArray(body.accessories) && body.accessories.every((value) => typeof value === "string" && value.trim())
            ? [...new Set(body.accessories.map((value) => String(value).trim()))] : undefined;
          const evidence = Array.isArray(body.evidence) && body.evidence.every((value) => validMedia(value, auth.tenantId, branchId))
            ? body.evidence as MediaReference[] : undefined;
          const acknowledgement = body.acknowledgement && typeof body.acknowledgement === "object" ? body.acknowledgement as Record<string, unknown> : undefined;
          if (!customerId || !vehicleId || !advisorIdentityId || !customerRequest || !validInstant(body.promisedHandoffAt) ||
              !Number.isSafeInteger(odometerKm) || odometerKm < 0 || !Number.isSafeInteger(fuelLevelEighths) || fuelLevelEighths < 0 || fuelLevelEighths > 8 ||
              !Number.isSafeInteger(keyCount) || keyCount < 0 || !accessories || !evidence) return { status: 422, body: { code: "INVALID_CHECK_IN" } };
          const evidenceKinds = new Set(evidence.filter((item) => item.scanStatus !== "REJECTED").map((item) => item.kind));
          const missingEvidenceKinds = config.requiredPhotoKinds.filter((kind) => !evidenceKinds.has(kind));
          if (missingEvidenceKinds.length) return { status: 422, body: { code: "REQUIRED_EVIDENCE_MISSING", missingEvidenceKinds } };
          if (!acknowledgement || acknowledgement.accepted !== true || acknowledgement.textVersion !== config.acknowledgementTextVersion ||
              !String(acknowledgement.signerName ?? "").trim() || !["SIGNATURE", "OTP", "RECORDED_VERBAL"].includes(String(acknowledgement.method)) ||
              !validMedia(acknowledgement.evidence, auth.tenantId, branchId)) {
            return { status: 422, body: { code: "VALID_ACKNOWLEDGEMENT_REQUIRED" } };
          }
          const now = options.now ?? new Date().toISOString();
          const visit: Visit = {
            id: `visit-${++visitSequence}`, tenantId: auth.tenantId, branchId,
            ...(appointment ? { appointmentId: appointment.appointmentId, sourceEventId: appointment.id, sourceEventVersion: appointment.appointmentVersion } : {}),
            customerId, vehicleId, advisorIdentityId, odometerKm, fuelLevelEighths, keyCount, accessories,
            customerRequest, promisedHandoffAt: String(body.promisedHandoffAt), evidence: clone(evidence),
            acknowledgement: clone(acknowledgement) as Acknowledgement, receptionConfigurationVersionId: config.versionId,
            checkedInAt: now, resourceVersion: 1,
          };
          const job: Job = { id: `job-${++jobSequence}`, tenantId: auth.tenantId, branchId, visitId: visit.id,
            customerId, vehicleId, advisorIdentityId, customerRequest, promisedHandoffAt: visit.promisedHandoffAt, status: "DRAFT", resourceVersion: 1 };
          const auditReference = recordAudit(auth, branchId, "reception.checked-in", "VISIT", visit.id, now, options.requestId);
          visits.set(`${auth.tenantId}:${visit.id}`, visit);
          jobs.set(`${auth.tenantId}:${job.id}`, job);
          if (appointment) eventConsumers.set(`${auth.tenantId}:${appointment.id}`, visit.id);
          return { status: 201, body: { visit: clone(visit), job: clone(job), resourceVersion: 1, auditReference } };
        });
      }
      if (path === "/api/v1/custody-incidents") {
        const auth = authorize(this.token, body.branchId, "custody.incident.create");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const visitId = String(body.visitId ?? "");
          const jobId = String(body.jobId ?? "");
          const vehicleId = String(body.vehicleId ?? "");
          const visit = visibleVisit(auth, branchId, visitId);
          const job = jobs.get(`${auth.tenantId}:${jobId}`);
          if (!visit || !job || job.branchId !== branchId || job.visitId !== visit.id || visit.vehicleId !== vehicleId || job.vehicleId !== vehicleId) {
            return { status: 409, body: { code: "VISIT_JOB_LINK_INVALID" } };
          }
          const severity = String(body.severity) as CustodyIncident["severity"];
          const category = String(body.category) as CustodyIncident["category"];
          const description = String(body.description ?? "").trim();
          const ownerIdentityId = String(body.ownerIdentityId ?? "").trim();
          const evidence = Array.isArray(body.evidence) && body.evidence.length > 0 && body.evidence.every((item) => validMedia(item, auth.tenantId, branchId))
            ? body.evidence as MediaReference[] : undefined;
          const recipients = Array.isArray(body.notifyIdentityIds) && body.notifyIdentityIds.length > 0 &&
            body.notifyIdentityIds.every((item) => typeof item === "string" && item.trim())
            ? [...new Set(body.notifyIdentityIds.map((item) => String(item).trim()))].sort() : undefined;
          const rawActions = Array.isArray(body.actions) ? body.actions : [];
          const validActions = rawActions.length > 0 && rawActions.every((item) => {
            if (!item || typeof item !== "object") return false;
            const action = item as Record<string, unknown>;
            return Boolean(String(action.description ?? "").trim() && String(action.ownerIdentityId ?? "").trim() &&
              (action.dueAt === undefined || validInstant(action.dueAt)));
          });
          if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity) || !["DAMAGE", "LOSS", "SAFETY", "OTHER"].includes(category) ||
              !description || !ownerIdentityId || !evidence || !recipients || !validActions) {
            return { status: 422, body: { code: "INVALID_CUSTODY_INCIDENT" } };
          }
          const now = options.now ?? new Date().toISOString();
          const incident: CustodyIncident = {
            id: `custody-incident-${++incidentSequence}`, tenantId: auth.tenantId, branchId, visitId, jobId, vehicleId,
            severity, category, description, evidence: clone(evidence), ownerIdentityId,
            actions: rawActions.map((item) => {
              const action = item as Record<string, unknown>;
              return { description: String(action.description).trim(), ownerIdentityId: String(action.ownerIdentityId).trim(),
                ...(action.dueAt ? { dueAt: String(action.dueAt) } : {}), status: "OPEN" as const };
            }),
            notification: { recipientIdentityIds: recipients, status: "QUEUED", outboxEventId: `custody-notification-${++outboxSequence}` },
            status: "OPEN", createdAt: now, resourceVersion: 1,
          };
          const auditReference = recordAudit(auth, branchId, "custody-incident.created", "CUSTODY_INCIDENT", incident.id, now, options.requestId);
          incidents.set(`${auth.tenantId}:${incident.id}`, incident);
          return { status: 202, body: { incident: clone(incident), resourceVersion: 1, auditReference } };
        });
      }
      return { status: 404, body: { code: "ROUTE_NOT_FOUND" } };
    }

    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "http://local");
      const branchId = url.searchParams.get("branchId") ?? "";
      const auth = authorize(this.token, branchId, url.pathname.startsWith("/api/v1/custody-incidents") ? "custody.incident.read" : "reception.read");
      if ("status" in auth) return auth;
      if (url.pathname === "/api/v1/reception/visits") {
        const visibleVisits = [...visits.values()].filter((visit) => visit.tenantId === auth.tenantId && visit.branchId === branchId);
        const visibleVisitIds = new Set(visibleVisits.map((visit) => visit.id));
        return { status: 200, body: { visits: clone(visibleVisits), jobs: clone([...jobs.values()].filter((job) => job.tenantId === auth.tenantId && visibleVisitIds.has(job.visitId))) } };
      }
      if (url.pathname === "/api/v1/custody-incidents") {
        return { status: 200, body: { incidents: clone([...incidents.values()].filter((incident) => incident.tenantId === auth.tenantId && incident.branchId === branchId)) } };
      }
      const match = url.pathname.match(/^\/api\/v1\/reception\/visits\/([^/]+)$/);
      if (match) {
        const visit = visibleVisit(auth, branchId, match[1]);
        const job = visit ? [...jobs.values()].find((candidate) => candidate.tenantId === auth.tenantId && candidate.visitId === visit.id) : undefined;
        return visit && job ? { status: 200, body: { visit: clone(visit), job: clone(job), auditEntries: clone(audits.filter((audit) => audit.tenantId === auth.tenantId && audit.branchId === branchId && audit.resourceId === visit.id)) } }
          : { status: 404, body: { code: "VISIT_NOT_FOUND" } };
      }
      return { status: 404, body: { code: "ROUTE_NOT_FOUND" } };
    }
  }

  return { signIn(token: string) { return new Session(token); } };
}

export type ReceptionDraftStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type ReceptionDraft = {
  id: string;
  tenantId: string;
  branchId: string;
  deviceId: string;
  payload: Record<string, unknown>;
  baseResourceVersion?: number;
  localVersion: number;
  updatedAt: string;
  syncStatus: "UNCOMMITTED" | "CONFLICT";
  authoritative: false;
  statusLabel: "Draft — not submitted" | "Draft conflict — review required";
  conflict?: { baseResourceVersion?: number; serverResourceVersion: number };
};

export type OfflinePostingCategory = "LIFECYCLE" | "CUSTODY" | "APPROVAL" | "INVENTORY" | "FINANCE" | "QC_OVERRIDE" | "CLOSURE" | "GATE";

export function createReceptionDraftStore(input: { storage: ReceptionDraftStorage; tenantId: string; branchId: string; deviceId: string }) {
  if (!input.tenantId.trim() || !input.branchId.trim() || !input.deviceId.trim()) throw new Error("Draft storage scope is required");
  const storageKey = `workshopos:reception-drafts:${input.tenantId}:${input.branchId}:${input.deviceId}`;
  const load = (): ReceptionDraft[] => {
    const raw = input.storage.getItem(storageKey);
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is ReceptionDraft => Boolean(item && typeof item === "object" &&
        (item as ReceptionDraft).tenantId === input.tenantId && (item as ReceptionDraft).branchId === input.branchId &&
        (item as ReceptionDraft).deviceId === input.deviceId));
    } catch {
      return [];
    }
  };
  const persist = (drafts: ReceptionDraft[]) => {
    if (drafts.length) input.storage.setItem(storageKey, JSON.stringify(drafts));
    else input.storage.removeItem(storageKey);
  };
  const find = (id: string) => load().find((draft) => draft.id === id);
  const replace = (next: ReceptionDraft) => {
    const drafts = load();
    const index = drafts.findIndex((draft) => draft.id === next.id);
    if (index >= 0) drafts[index] = next;
    else drafts.push(next);
    persist(drafts);
    return clone(next);
  };

  return {
    save(id: string, payload: Record<string, unknown>, options: { baseResourceVersion?: number; updatedAt?: string } = {}): ReceptionDraft {
      if (!id.trim()) throw new Error("Draft id is required");
      const prior = find(id);
      const baseResourceVersion = options.baseResourceVersion ?? prior?.baseResourceVersion;
      return replace({
        id, tenantId: input.tenantId, branchId: input.branchId, deviceId: input.deviceId, payload: clone(payload),
        ...(baseResourceVersion !== undefined ? { baseResourceVersion } : {}), localVersion: (prior?.localVersion ?? 0) + 1,
        updatedAt: options.updatedAt ?? new Date().toISOString(), syncStatus: "UNCOMMITTED", authoritative: false,
        statusLabel: "Draft — not submitted",
      });
    },
    get(id: string): ReceptionDraft | undefined {
      const draft = find(id);
      return draft ? clone(draft) : undefined;
    },
    list(): ReceptionDraft[] {
      return clone(load().sort((left, right) => left.updatedAt.localeCompare(right.updatedAt)));
    },
    detectConflict(id: string, serverResourceVersion: number): ReceptionDraft | undefined {
      const draft = find(id);
      if (!draft) return undefined;
      if (draft.baseResourceVersion === undefined || draft.baseResourceVersion === serverResourceVersion) return clone(draft);
      return replace({ ...draft, syncStatus: "CONFLICT", statusLabel: "Draft conflict — review required",
        conflict: { ...(draft.baseResourceVersion !== undefined ? { baseResourceVersion: draft.baseResourceVersion } : {}), serverResourceVersion } });
    },
    resolveConflict(id: string, resolution: "REBASE" | "DISCARD_LOCAL", serverResourceVersion: number, updatedAt = new Date().toISOString()): ReceptionDraft | undefined {
      const draft = find(id);
      if (!draft || draft.syncStatus !== "CONFLICT") return undefined;
      if (resolution === "DISCARD_LOCAL") {
        const remaining = load().filter((item) => item.id !== id);
        persist(remaining);
        return undefined;
      }
      return replace({ ...draft, baseResourceVersion: serverResourceVersion, localVersion: draft.localVersion + 1,
        updatedAt, syncStatus: "UNCOMMITTED", authoritative: false, statusLabel: "Draft — not submitted", conflict: undefined });
    },
    remove(id: string): boolean {
      const drafts = load();
      const remaining = drafts.filter((draft) => draft.id !== id);
      if (remaining.length === drafts.length) return false;
      persist(remaining);
      return true;
    },
    attemptOfflinePosting(category: OfflinePostingCategory) {
      return { status: 409 as const, code: "ONLINE_REQUIRED" as const, category, authoritative: false as const,
        message: `${category} actions cannot be posted offline. Reconnect to continue.` };
    },
  };
}
