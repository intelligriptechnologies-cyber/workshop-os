import { createHash } from "node:crypto";

export type WarrantyIncidentMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

type WarrantyTerm = {
  sourceType: "SERVICE" | "ITEM";
  sourceId: string;
  description: string;
  durationDays: number;
  distanceKm?: number;
};

type WarrantySnapshot = {
  policyMasterId: string;
  version: number;
  snapshottedAt: string;
  terms: WarrantyTerm[];
};

type DeliveredJob = {
  tenantId: string;
  branchId: string;
  jobId: string;
  visitId: string;
  customerId: string;
  vehicleId: string;
  deliveredAt: string;
  lifecycleStatus: "CLOSED";
  financeStatus: "CLOSED";
  finalizedInvoiceId: string;
  warrantySnapshot: WarrantySnapshot;
};

type Claim = {
  id: string;
  tenantId: string;
  branchId: string;
  originalJobId: string;
  classification: "WARRANTY" | "COMEBACK" | "GOODWILL" | "CUSTOMER_PAY";
  diagnosis: string;
  responsibility: "WORKSHOP" | "SUPPLIER" | "CUSTOMER" | "UNDETERMINED";
  payer: { type: "WORKSHOP" | "SUPPLIER" | "CUSTOMER" | "INSURER"; payerId: string };
  costOwner: { type: "BRANCH" | "TENANT" | "SUPPLIER" | "CUSTOMER"; ownerId: string };
  scope: Array<{ code: string; description: string }>;
  outcome: "REMEDIAL_WORK_REQUIRED" | "NO_FAULT_FOUND" | "CLAIM_REJECTED" | "GOODWILL_APPROVED";
  warrantySnapshot: WarrantySnapshot;
  status: "OPEN";
  resourceVersion: number;
  createdAt: string;
  auditReference: string;
};

type LinkedVisit = {
  id: string; tenantId: string; branchId: string; customerId: string; vehicleId: string;
  linkedOriginalVisitId: string; source: "WARRANTY_COMEBACK"; customerRequest: string; createdAt: string;
};
type LinkedJob = {
  id: string; tenantId: string; branchId: string; visitId: string; customerId: string; vehicleId: string;
  linkedOriginalJobId: string; jobType: "WARRANTY_COMEBACK"; status: "DRAFT"; resourceVersion: number;
};

type IncidentEvidence = {
  kind: "PHOTO" | "VIDEO" | "DOCUMENT";
  objectKey: string;
  checksumSha256: string;
  scanStatus: "PENDING" | "CLEAN" | "REJECTED";
};
type IncidentAction = { description: string; ownerIdentityId: string; status: "OPEN" };
type CustodyIncident = {
  id: string; tenantId: string; branchId: string; visitId: string; jobId: string; vehicleId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; category: "DAMAGE" | "LOSS" | "SAFETY" | "OTHER";
  description: string; evidence: IncidentEvidence[]; ownerIdentityId: string; actions: IncidentAction[];
  notification: { recipientIdentityIds: string[]; status: "QUEUED"; outboxEventId: string };
  status: "OPEN" | "ESCALATED" | "RESOLVED"; createdAt: string; resourceVersion: number;
};
type IncidentResolution = {
  incidentId: string; outcome: string; reason: string; evidence: IncidentEvidence[];
  acknowledgement: { accepted: true; signerIdentityId: string; method: "SIGNATURE" | "OTP" | "RECORDED_VERBAL"; evidence: IncidentEvidence };
  actorMembershipId: string; resolvedAt: string; auditReference: string;
};
type IncidentHistory = { incidentId: string; action: "ESCALATED" | "RESOLVED"; actorMembershipId: string; reason: string; occurredAt: string; auditReference: string };
type ReleaseEvent = { id: string; type: "S17_INCIDENT_RESOLVED"; tenantId: string; branchId: string; aggregateId: string; aggregateVersion: number; occurredAt: string; payload: { jobId: string; incidentId: string; status: "RESOLVED" } };
type LegalHold = {
  id: string; tenantId: string; branchId: string; targetType: "CUSTODY_INCIDENT" | "WARRANTY_CLAIM"; targetId: string;
  appliesTo: Array<"RECORD" | "MEDIA">; reason: string; status: "ACTIVE" | "RELEASED";
  placedByMembershipId: string; placedAt: string; resourceVersion: number; auditReference: string;
};
type LegalHoldRelease = {
  legalHoldId: string; releasedByMembershipId: string; reason: string; evidence: IncidentEvidence[];
  reauthenticatedAt: string; releasedAt: string; auditReference: string;
};
type RetentionState = { targetType: string; targetId: string; legalHoldActive: boolean; recordPurgeAllowed: boolean; mediaExpiryAllowed: boolean };

type ApiBody = {
  code?: string;
  message?: string;
  originalJob?: DeliveredJob;
  warrantySnapshot?: WarrantySnapshot;
  claim?: Claim;
  visit?: LinkedVisit;
  job?: LinkedJob;
  incident?: CustodyIncident;
  resolution?: IncidentResolution;
  legalHold?: LegalHold;
  legalHoldRelease?: LegalHoldRelease;
  retention?: RetentionState;
  resourceVersion?: number;
  auditReference?: string;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; reauthenticatedAt?: string };

const clone = <T>(value: T): T => structuredClone(value);
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const response = (status: number, code: string): ApiResponse => ({ status, body: { code } });
const nonBlank = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const validIncidentEvidence = (value: unknown, tenantId: string, branchId: string): value is IncidentEvidence => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ["PHOTO", "VIDEO", "DOCUMENT"].includes(String(item.kind)) && typeof item.objectKey === "string" &&
    item.objectKey.startsWith(`private/${tenantId}/${branchId}/incidents/`) &&
    typeof item.checksumSha256 === "string" && /^[0-9a-f]{64}$/i.test(item.checksumSha256) && item.scanStatus === "CLEAN";
};

export function createLocalWarrantyIncidentApi(input: {
  memberships: Record<string, WarrantyIncidentMembership>;
  deliveredJobs: DeliveredJob[];
  custodyIncidents?: CustodyIncident[];
}) {
  const deliveredJobs = input.deliveredJobs.map(clone);
  const claims: Claim[] = [];
  const visits: LinkedVisit[] = [];
  const jobs: LinkedJob[] = [];
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const incidents = (input.custodyIncidents ?? []).map(clone);
  const resolutions: IncidentResolution[] = [];
  const incidentHistory: IncidentHistory[] = [];
  const releaseEvents: ReleaseEvent[] = [];
  const legalHolds: LegalHold[] = [];
  const legalHoldReleases: LegalHoldRelease[] = [];
  let auditSequence = 0;

  const authorize = (token: string, branchId: unknown, permission: string): WarrantyIncidentMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return response(401, "AUTHENTICATION_REQUIRED");
    if (!nonBlank(branchId) || !membership.branchIds.includes(branchId)) return response(403, "BRANCH_FORBIDDEN");
    if (!membership.permissions.includes(permission)) return response(403, "PERMISSION_DENIED");
    return membership;
  };
  const originalFor = (membership: WarrantyIncidentMembership, branchId: string, jobId: string) => deliveredJobs.find(
    (job) => job.tenantId === membership.tenantId && job.branchId === branchId && job.jobId === jobId,
  );

  class Session {
    constructor(private readonly token: string) {}

    async get(rawPath: string): Promise<ApiResponse> {
      const url = new URL(rawPath, "https://workshopos.local");
      const retentionMatch = url.pathname.match(/^\/api\/v1\/retention\/(CUSTODY_INCIDENT|WARRANTY_CLAIM)\/([^/]+)$/);
      if (retentionMatch) {
        const branchId = url.searchParams.get("branchId");
        const auth = authorize(this.token, branchId, "legal-hold.read");
        if ("status" in auth) return auth;
        const targetExists = retentionMatch[1] === "CUSTODY_INCIDENT"
          ? incidents.some((incident) => incident.id === retentionMatch[2] && incident.tenantId === auth.tenantId && incident.branchId === branchId)
          : claims.some((claim) => claim.id === retentionMatch[2] && claim.tenantId === auth.tenantId && claim.branchId === branchId);
        if (!targetExists) return response(404, "RETENTION_TARGET_NOT_FOUND");
        const active = legalHolds.find((hold) => hold.tenantId === auth.tenantId && hold.targetType === retentionMatch[1] && hold.targetId === retentionMatch[2] && hold.status === "ACTIVE");
        return { status: 200, body: { retention: { targetType: retentionMatch[1], targetId: retentionMatch[2], legalHoldActive: Boolean(active),
          recordPurgeAllowed: !active?.appliesTo.includes("RECORD"), mediaExpiryAllowed: !active?.appliesTo.includes("MEDIA") } } };
      }
      const match = url.pathname.match(/^\/api\/v1\/jobs\/([^/]+)\/warranty-intake$/);
      if (!match) return response(404, "ROUTE_NOT_FOUND");
      const branchId = url.searchParams.get("branchId");
      const auth = authorize(this.token, branchId, "warranty.read");
      if ("status" in auth) return auth;
      const original = originalFor(auth, String(branchId), match[1]);
      if (!original) return response(404, "DELIVERED_JOB_NOT_FOUND");
      return { status: 200, body: { originalJob: clone(original), warrantySnapshot: clone(original.warrantySnapshot) } };
    }

    async post(path: string, body: Record<string, any>, options: CommandOptions = {}): Promise<ApiResponse> {
      const holdReleaseMatch = path.match(/^\/api\/v1\/legal-holds\/([^/]+)\/release$/);
      if (path === "/api/v1/legal-holds" || holdReleaseMatch) {
        const permission = holdReleaseMatch ? "legal-hold.release" : "legal-hold.create";
        const auth = authorize(this.token, body.branchId, permission);
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        if (!options.idempotencyKey?.trim()) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        const now = options.now ?? new Date().toISOString();
        if (!holdReleaseMatch) {
          const targetType = body.targetType as LegalHold["targetType"];
          const targetId = String(body.targetId ?? "");
          const incident = targetType === "CUSTODY_INCIDENT" ? incidents.find((item) => item.id === targetId && item.tenantId === auth.tenantId && item.branchId === branchId) : undefined;
          const claim = targetType === "WARRANTY_CLAIM" ? claims.find((item) => item.id === targetId && item.tenantId === auth.tenantId && item.branchId === branchId) : undefined;
          const targetVersion = incident?.resourceVersion ?? claim?.resourceVersion;
          if (!targetVersion) return response(404, "LEGAL_HOLD_TARGET_NOT_FOUND");
          if (options.ifMatch !== targetVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: targetVersion } };
          const appliesTo = Array.isArray(body.appliesTo) ? [...new Set(body.appliesTo)] : [];
          if (!nonBlank(body.reason) || appliesTo.length === 0 || !appliesTo.every((value) => value === "RECORD" || value === "MEDIA")) return response(422, "VALID_LEGAL_HOLD_REQUIRED");
          if (legalHolds.some((hold) => hold.tenantId === auth.tenantId && hold.targetType === targetType && hold.targetId === targetId && hold.status === "ACTIVE")) return response(409, "ACTIVE_LEGAL_HOLD_EXISTS");
          const auditReference = `audit-warranty-${++auditSequence}`;
          const legalHold: LegalHold = { id: `legal-hold-${legalHolds.length + 1}`, tenantId: auth.tenantId, branchId, targetType, targetId,
            appliesTo: appliesTo as LegalHold["appliesTo"], reason: body.reason.trim(), status: "ACTIVE", placedByMembershipId: auth.membershipId,
            placedAt: now, resourceVersion: 1, auditReference };
          legalHolds.push(legalHold);
          const committed: ApiResponse = { status: 201, body: { legalHold: clone(legalHold), resourceVersion: 1, auditReference } };
          commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
          return committed;
        }
        const legalHold = legalHolds.find((hold) => hold.id === holdReleaseMatch[1] && hold.tenantId === auth.tenantId && hold.branchId === branchId);
        if (!legalHold) return response(404, "LEGAL_HOLD_NOT_FOUND");
        if (legalHold.status !== "ACTIVE") return response(409, "LEGAL_HOLD_NOT_ACTIVE");
        if (options.ifMatch !== legalHold.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: legalHold.resourceVersion } };
        if (legalHold.placedByMembershipId === auth.membershipId) return response(409, "INDEPENDENT_HOLD_RELEASER_REQUIRED");
        const authAt = typeof options.reauthenticatedAt === "string" ? Date.parse(options.reauthenticatedAt) : Number.NaN;
        const ageSeconds = (Date.parse(now) - authAt) / 1000;
        if (!Number.isFinite(authAt) || ageSeconds < 0 || ageSeconds > 300) return response(403, "RECENT_AUTHENTICATION_REQUIRED");
        const evidence = Array.isArray(body.evidence) && body.evidence.length > 0 && body.evidence.every((item: unknown) => validIncidentEvidence(item, auth.tenantId, branchId))
          ? body.evidence as IncidentEvidence[] : undefined;
        if (!nonBlank(body.reason) || !evidence) return response(422, "LEGAL_HOLD_RELEASE_EVIDENCE_REQUIRED");
        const auditReference = `audit-warranty-${++auditSequence}`;
        const legalHoldRelease: LegalHoldRelease = { legalHoldId: legalHold.id, releasedByMembershipId: auth.membershipId,
          reason: body.reason.trim(), evidence: clone(evidence), reauthenticatedAt: options.reauthenticatedAt!, releasedAt: now, auditReference };
        legalHoldReleases.push(legalHoldRelease); legalHold.status = "RELEASED"; legalHold.resourceVersion += 1;
        const committed: ApiResponse = { status: 200, body: { legalHold: clone(legalHold), legalHoldRelease: clone(legalHoldRelease), resourceVersion: legalHold.resourceVersion, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }
      const escalationMatch = path.match(/^\/api\/v1\/custody-incidents\/([^/]+)\/escalations$/);
      const resolutionMatch = path.match(/^\/api\/v1\/custody-incidents\/([^/]+)\/resolution$/);
      if (escalationMatch || resolutionMatch) {
        const permission = escalationMatch ? "custody.incident.escalate" : "custody.incident.resolve";
        const auth = authorize(this.token, body.branchId, permission);
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const incidentId = (escalationMatch ?? resolutionMatch)![1];
        const incident = incidents.find((candidate) => candidate.id === incidentId && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
        if (!incident) return response(404, "CUSTODY_INCIDENT_NOT_FOUND");
        if (!options.idempotencyKey?.trim()) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
        const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
        const commandFingerprint = fingerprint({ path, body });
        const prior = commands.get(commandKey);
        if (prior) return prior.fingerprint === commandFingerprint ? { status: 200, body: clone(prior.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
        if (options.ifMatch !== incident.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: incident.resourceVersion } };
        if (incident.status === "RESOLVED") return response(409, "INCIDENT_NOT_ACTIONABLE");
        const now = options.now ?? new Date().toISOString();
        const reason = nonBlank(body.reason) ? body.reason.trim() : "";
        const evidence = Array.isArray(body.evidence) && body.evidence.length > 0 && body.evidence.every((item: unknown) => validIncidentEvidence(item, auth.tenantId, branchId))
          ? body.evidence as IncidentEvidence[] : undefined;
        if (!reason || !evidence) return response(422, "CLEAN_INCIDENT_EVIDENCE_REQUIRED");
        if (escalationMatch) {
          const severity = body.severity as CustodyIncident["severity"];
          const recipients = Array.isArray(body.notifyIdentityIds) && body.notifyIdentityIds.length > 0 && body.notifyIdentityIds.every(nonBlank)
            ? [...new Set(body.notifyIdentityIds as string[])].sort() : undefined;
          const actions = Array.isArray(body.actions) && body.actions.length > 0 && body.actions.every((item: any) => nonBlank(item?.description) && nonBlank(item?.ownerIdentityId))
            ? body.actions.map((item: any) => ({ description: item.description.trim(), ownerIdentityId: item.ownerIdentityId.trim(), status: "OPEN" as const })) : undefined;
          if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity) || !nonBlank(body.ownerIdentityId) || !recipients || !actions) {
            return response(422, "COMPLETE_INCIDENT_ESCALATION_REQUIRED");
          }
          const auditReference = `audit-warranty-${++auditSequence}`;
          incident.severity = severity; incident.ownerIdentityId = body.ownerIdentityId.trim(); incident.actions.push(...actions);
          incident.evidence.push(...clone(evidence)); incident.notification = { recipientIdentityIds: recipients, status: "QUEUED", outboxEventId: `incident-notification-${incidentHistory.length + 1}` };
          incident.status = "ESCALATED"; incident.resourceVersion += 1;
          incidentHistory.push({ incidentId, action: "ESCALATED", actorMembershipId: auth.membershipId, reason, occurredAt: now, auditReference });
          const committed: ApiResponse = { status: 200, body: { incident: clone(incident), resourceVersion: incident.resourceVersion, auditReference } };
          commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
          return committed;
        }
        const acknowledgement = body.acknowledgement as Record<string, unknown> | undefined;
        if (!nonBlank(body.outcome) || !acknowledgement || acknowledgement.accepted !== true || !nonBlank(acknowledgement.signerIdentityId) ||
            !["SIGNATURE", "OTP", "RECORDED_VERBAL"].includes(String(acknowledgement.method)) ||
            !validIncidentEvidence(acknowledgement.evidence, auth.tenantId, branchId)) return response(422, "INCIDENT_RESOLUTION_ACKNOWLEDGEMENT_REQUIRED");
        const auditReference = `audit-warranty-${++auditSequence}`;
        const resolution: IncidentResolution = { incidentId, outcome: body.outcome.trim(), reason, evidence: clone(evidence),
          acknowledgement: clone(acknowledgement) as IncidentResolution["acknowledgement"], actorMembershipId: auth.membershipId,
          resolvedAt: now, auditReference };
        resolutions.push(resolution); incident.evidence.push(...clone(evidence)); incident.status = "RESOLVED"; incident.resourceVersion += 1;
        incidentHistory.push({ incidentId, action: "RESOLVED", actorMembershipId: auth.membershipId, reason, occurredAt: now, auditReference });
        releaseEvents.push({ id: `incident-release-${releaseEvents.length + 1}`, type: "S17_INCIDENT_RESOLVED", tenantId: auth.tenantId,
          branchId, aggregateId: incidentId, aggregateVersion: incident.resourceVersion, occurredAt: now,
          payload: { jobId: incident.jobId, incidentId, status: "RESOLVED" } });
        const committed: ApiResponse = { status: 200, body: { incident: clone(incident), resolution: clone(resolution), resourceVersion: incident.resourceVersion, auditReference } };
        commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
        return committed;
      }
      if (path !== "/api/v1/warranty-claims") return response(404, "ROUTE_NOT_FOUND");
      const auth = authorize(this.token, body.branchId, "warranty.create");
      if ("status" in auth) return auth;
      const branchId = String(body.branchId);
      if (!options.idempotencyKey?.trim()) return response(422, "IDEMPOTENCY_KEY_REQUIRED");
      const commandKey = `${auth.tenantId}:${options.idempotencyKey}`;
      const commandFingerprint = fingerprint({ path, body });
      const prior = commands.get(commandKey);
      if (prior) return prior.fingerprint === commandFingerprint
        ? { status: 200, body: clone(prior.response.body) }
        : response(409, "IDEMPOTENCY_KEY_REUSED");
      const original = originalFor(auth, branchId, String(body.originalJobId));
      if (!original) return response(404, "DELIVERED_JOB_NOT_FOUND");
      if (options.ifMatch !== 1) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: 1 } };
      if (!["WARRANTY", "COMEBACK", "GOODWILL", "CUSTOMER_PAY"].includes(body.classification) ||
          !["WORKSHOP", "SUPPLIER", "CUSTOMER", "UNDETERMINED"].includes(body.responsibility) ||
          !["REMEDIAL_WORK_REQUIRED", "NO_FAULT_FOUND", "CLAIM_REJECTED", "GOODWILL_APPROVED"].includes(body.outcome) ||
          !nonBlank(body.diagnosis) || !nonBlank(body.customerRequest) || !body.payer || !nonBlank(body.payer.payerId) ||
          !["WORKSHOP", "SUPPLIER", "CUSTOMER", "INSURER"].includes(body.payer.type) || !body.costOwner ||
          !nonBlank(body.costOwner.ownerId) || !["BRANCH", "TENANT", "SUPPLIER", "CUSTOMER"].includes(body.costOwner.type) ||
          !Array.isArray(body.scope) || body.scope.length === 0 || !body.scope.every((item: any) => nonBlank(item?.code) && nonBlank(item?.description))) {
        return response(422, "COMPLETE_CLAIM_CLASSIFICATION_REQUIRED");
      }
      if (claims.some((claim) => claim.tenantId === auth.tenantId && claim.originalJobId === original.jobId && claim.status === "OPEN")) {
        return response(409, "OPEN_CLAIM_ALREADY_EXISTS");
      }
      const now = options.now ?? new Date().toISOString();
      const auditReference = `audit-warranty-${++auditSequence}`;
      const visit: LinkedVisit = { id: `warranty-visit-${visits.length + 1}`, tenantId: auth.tenantId, branchId,
        customerId: original.customerId, vehicleId: original.vehicleId, linkedOriginalVisitId: original.visitId,
        source: "WARRANTY_COMEBACK", customerRequest: body.customerRequest.trim(), createdAt: now };
      const job: LinkedJob = { id: `warranty-job-${jobs.length + 1}`, tenantId: auth.tenantId, branchId, visitId: visit.id,
        customerId: original.customerId, vehicleId: original.vehicleId, linkedOriginalJobId: original.jobId,
        jobType: "WARRANTY_COMEBACK", status: "DRAFT", resourceVersion: 1 };
      const claim: Claim = { id: `warranty-claim-${claims.length + 1}`, tenantId: auth.tenantId, branchId,
        originalJobId: original.jobId, classification: body.classification, diagnosis: body.diagnosis.trim(), responsibility: body.responsibility,
        payer: clone(body.payer), costOwner: clone(body.costOwner), scope: clone(body.scope), outcome: body.outcome,
        warrantySnapshot: clone(original.warrantySnapshot), status: "OPEN", resourceVersion: 1, createdAt: now, auditReference };
      visits.push(visit); jobs.push(job); claims.push(claim);
      const committed: ApiResponse = { status: 201, body: { claim: clone(claim), visit: clone(visit), job: clone(job),
        originalJob: clone(original), warrantySnapshot: clone(original.warrantySnapshot), resourceVersion: 1, auditReference } };
      commands.set(commandKey, { fingerprint: commandFingerprint, response: clone(committed) });
      return committed;
    }
  }

  return { signIn: (token: string) => new Session(token), testing: { claims: () => clone(claims), visits: () => clone(visits), jobs: () => clone(jobs),
    incidents: () => clone(incidents), resolutions: () => clone(resolutions), incidentHistory: () => clone(incidentHistory), releaseEvents: () => clone(releaseEvents),
    legalHolds: () => clone(legalHolds), legalHoldReleases: () => clone(legalHoldReleases) } };
}
