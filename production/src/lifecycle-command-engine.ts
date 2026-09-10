export const LIFECYCLE_STAGES = [
  "APPOINTMENT", "CHECK_IN", "INSPECTION", "ESTIMATE", "APPROVED", "ACTIVE",
  "QC", "BILLING", "GATE_VERIFICATION", "DELIVERED", "CLOSED", "CANCELLED",
] as const;

export type LifecycleStage = typeof LIFECYCLE_STAGES[number];

export type LifecycleMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
  authenticatedAt: string;
  mfa: boolean;
};

type HistoryEntry = {
  fromStage: LifecycleStage | null;
  toStage: LifecycleStage;
  at: string;
  actorIdentityId: string;
  auditReference: string;
  reason?: string;
  evidence?: string[];
};

type LifecycleResource = {
  id: string;
  resourceType: "VISIT" | "JOB";
  tenantId: string;
  branchId: string;
  stage: LifecycleStage;
  resourceVersion: number;
  history: HistoryEntry[];
  lastOperationalStage?: LifecycleStage;
};

type AuditEntry = {
  auditReference: string;
  tenantId: string;
  branchId: string;
  resourceId: string;
  actorIdentityId: string;
  membershipId: string;
  action: string;
  at: string;
  oldStage: LifecycleStage | null;
  newStage: LifecycleStage;
  requestId?: string;
  authentication: { authenticatedAt: string; mfa: boolean };
  reason?: string;
  evidence: string[];
  approvalId?: string;
  overriddenBlockers: string[];
};

type ApiBody = {
  code?: string;
  message?: string;
  resource?: LifecycleResource;
  resourceVersion?: number;
  auditReference?: string;
  auditEntries?: AuditEntry[];
  blockers?: Array<{ code: string; message: string; overridable: boolean }>;
  approval?: ApprovalRecord;
  [key: string]: unknown;
};

type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; requestId?: string };

const clone = <T>(value: T): T => structuredClone(value);

export const ALLOWED_TRANSITIONS: Readonly<Record<LifecycleStage, readonly LifecycleStage[]>> = {
  APPOINTMENT: ["CHECK_IN", "CANCELLED"],
  CHECK_IN: ["INSPECTION", "CANCELLED"],
  INSPECTION: ["ESTIMATE", "CANCELLED"],
  ESTIMATE: ["APPROVED", "CANCELLED"],
  APPROVED: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["QC", "CANCELLED"],
  QC: ["ACTIVE", "BILLING", "CANCELLED"],
  BILLING: ["GATE_VERIFICATION"],
  GATE_VERIFICATION: ["DELIVERED"],
  DELIVERED: ["CLOSED"],
  CLOSED: [],
  CANCELLED: ["APPOINTMENT", "CHECK_IN", "INSPECTION", "ESTIMATE", "APPROVED", "ACTIVE", "QC"],
};

type SensitiveAction = "job.cancel" | "job.reopen" | "closure.override";
type ApprovalRecord = {
  id: string;
  tenantId: string;
  branchId: string;
  resourceId: string;
  action: SensitiveAction;
  targetStage: LifecycleStage;
  amountMinor: number;
  reason: string;
  evidence: string[];
  overriddenBlockers: string[];
  makerMembershipId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  chain: Array<{ membershipId: string; identityId: string; decision: "SUBMIT" | "APPROVE" | "REJECT"; at: string; reason: string }>;
};

export type LifecycleFacts = Partial<Record<
  "approvedScope" | "workComplete" | "qcPassed" | "materialsReconciled" |
  "supplementaryScopeResolved" | "billingFinalized" | "paymentPolicySatisfied" |
  "incidentsResolved" | "deliveryEvidenceCaptured" | "validGatePass" |
  "gateVerified" | "vehicleReleased",
  boolean
>>;

type Blocker = { code: string; message: string; overridable: boolean };

const TARGET_BLOCKERS: Partial<Record<LifecycleStage, ReadonlyArray<{ fact: keyof LifecycleFacts; blocker: Blocker }>>> = {
  APPROVED: [
    { fact: "approvedScope", blocker: { code: "APPROVED_SCOPE_MISSING", message: "Record approved customer scope before approval.", overridable: false } },
  ],
  ACTIVE: [
    { fact: "approvedScope", blocker: { code: "APPROVED_SCOPE_MISSING", message: "Record approved customer scope before starting work.", overridable: false } },
  ],
  QC: [
    { fact: "workComplete", blocker: { code: "WORK_NOT_COMPLETE", message: "Complete all required work before QC.", overridable: false } },
  ],
  BILLING: [
    { fact: "workComplete", blocker: { code: "WORK_NOT_COMPLETE", message: "Complete all required work before billing.", overridable: false } },
    { fact: "qcPassed", blocker: { code: "QC_NOT_PASSED", message: "Record an independent passed QC before billing.", overridable: false } },
    { fact: "materialsReconciled", blocker: { code: "MATERIAL_NOT_RECONCILED", message: "Reconcile issued material before billing.", overridable: false } },
    { fact: "supplementaryScopeResolved", blocker: { code: "SUPPLEMENTARY_SCOPE_UNRESOLVED", message: "Resolve supplementary scope before billing.", overridable: false } },
  ],
  GATE_VERIFICATION: [
    { fact: "workComplete", blocker: { code: "WORK_NOT_COMPLETE", message: "Complete all required work before release.", overridable: true } },
    { fact: "qcPassed", blocker: { code: "QC_NOT_PASSED", message: "Record an independent passed QC before release.", overridable: true } },
    { fact: "materialsReconciled", blocker: { code: "MATERIAL_NOT_RECONCILED", message: "Reconcile issued material before release.", overridable: true } },
    { fact: "supplementaryScopeResolved", blocker: { code: "SUPPLEMENTARY_SCOPE_UNRESOLVED", message: "Resolve supplementary scope before release.", overridable: true } },
    { fact: "billingFinalized", blocker: { code: "BILLING_NOT_FINALIZED", message: "Finalize billing before release.", overridable: true } },
    { fact: "paymentPolicySatisfied", blocker: { code: "PAYMENT_POLICY_UNSATISFIED", message: "Satisfy payment or approved credit policy before release.", overridable: true } },
    { fact: "incidentsResolved", blocker: { code: "INCIDENT_UNRESOLVED", message: "Resolve custody incidents before release.", overridable: false } },
    { fact: "deliveryEvidenceCaptured", blocker: { code: "DELIVERY_EVIDENCE_MISSING", message: "Capture required delivery evidence before release.", overridable: true } },
  ],
  DELIVERED: [
    { fact: "validGatePass", blocker: { code: "VALID_GATE_PASS_MISSING", message: "Issue a valid gate pass before delivery.", overridable: false } },
    { fact: "gateVerified", blocker: { code: "GATE_NOT_VERIFIED", message: "Gate/Security must independently verify release.", overridable: false } },
  ],
  CLOSED: [
    { fact: "vehicleReleased", blocker: { code: "VEHICLE_NOT_RELEASED", message: "Record vehicle release before closure.", overridable: false } },
  ],
};

export function evaluateLifecycleTransition(input: {
  fromStage: LifecycleStage;
  toStage: LifecycleStage;
  facts: LifecycleFacts;
}): { allowed: false; code: "TRANSITION_NOT_ALLOWED" } | { allowed: true; blockers: Blocker[] } {
  if (!ALLOWED_TRANSITIONS[input.fromStage].includes(input.toStage as never)) {
    return { allowed: false, code: "TRANSITION_NOT_ALLOWED" };
  }
  const blockers = (TARGET_BLOCKERS[input.toStage] ?? [])
    .filter((requirement) => input.facts[requirement.fact] !== true)
    .map((requirement) => ({ ...requirement.blocker }));
  return { allowed: true, blockers };
}

export function createLocalLifecycleApi(input: {
  memberships: Record<string, LifecycleMembership>;
  recentAuthenticationMinutes?: number;
  makerCheckerThresholds?: Partial<Record<SensitiveAction, number>>;
}) {
  const resources = new Map<string, LifecycleResource>();
  const audits: AuditEntry[] = [];
  const commandResults = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const approvals = new Map<string, ApprovalRecord>();
  let auditSequence = 0;
  let approvalSequence = 0;

  const authorize = (token: string, branchId: unknown, permission: string): LifecycleMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) {
      return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
    }
    if (permission && !membership.permissions.includes(permission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
    return membership;
  };

  const execute = (
    membership: LifecycleMembership,
    path: string,
    body: Record<string, unknown>,
    options: CommandOptions,
    action: () => ApiResponse,
  ): ApiResponse => {
    if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const key = `${membership.tenantId}:${options.idempotencyKey}`;
    const fingerprint = JSON.stringify({ path, body });
    const replay = commandResults.get(key);
    if (replay) {
      if (replay.fingerprint !== fingerprint) return { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
      return { status: 200, body: clone(replay.response.body) };
    }
    const result = action();
    if (result.status >= 200 && result.status < 300) commandResults.set(key, { fingerprint, response: clone(result) });
    return clone(result);
  };

  const visible = (membership: LifecycleMembership, branchId: string, resourceId: string) => {
    const resource = resources.get(`${membership.tenantId}:${resourceId}`);
    return resource?.branchId === branchId ? resource : undefined;
  };

  const recentlyAuthenticated = (membership: LifecycleMembership, now: string) =>
    Number.isFinite(Date.parse(now)) && Number.isFinite(Date.parse(membership.authenticatedAt)) &&
    Date.parse(now) - Date.parse(membership.authenticatedAt) <= (input.recentAuthenticationMinutes ?? 15) * 60_000;

  const sensitiveActionFor = (fromStage: LifecycleStage, toStage: LifecycleStage, overriddenBlockers: string[]): SensitiveAction | undefined => {
    if (toStage === "CANCELLED") return "job.cancel";
    if (fromStage === "CANCELLED") return "job.reopen";
    if (toStage === "GATE_VERIFICATION" && overriddenBlockers.length > 0) return "closure.override";
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const approvalDecisionPath = path.match(/^\/api\/v1\/lifecycle\/approvals\/([^/]+)\/decisions$/);
      const approvalRequestPath = path.match(/^\/api\/v1\/lifecycle\/resources\/([^/]+)\/approval-requests$/);
      const requiredPermission = approvalDecisionPath ? "" : approvalRequestPath ? "approval.request" : "lifecycle.manage";
      const auth = authorize(this.token, body.branchId, requiredPermission);
      if ("status" in auth) return auth;
      const membership = auth;

      if (approvalDecisionPath) {
        const approval = approvals.get(approvalDecisionPath[1]);
        if (!approval || approval.tenantId !== membership.tenantId || approval.branchId !== body.branchId) {
          return { status: 404, body: { code: "APPROVAL_NOT_FOUND" } };
        }
        if (approval.makerMembershipId === membership.membershipId) return { status: 403, body: { code: "MAKER_CANNOT_CHECK" } };
        if (!membership.permissions.includes("approval.decide")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
        const now = options.now ?? new Date().toISOString();
        if (!recentlyAuthenticated(membership, now)) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
        return execute(membership, path, body, options, () => {
          if (approval.status !== "PENDING") return { status: 409, body: { code: "APPROVAL_ALREADY_DECIDED" } };
          if (!["APPROVE", "REJECT"].includes(String(body.decision)) || typeof body.reason !== "string" || !body.reason.trim()) {
            return { status: 400, body: { code: "INVALID_APPROVAL_DECISION" } };
          }
          approval.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
          approval.chain.push({
            membershipId: membership.membershipId, identityId: membership.identityId,
            decision: body.decision as "APPROVE" | "REJECT", at: now, reason: body.reason.trim(),
          });
          return { status: 200, body: { approval: clone(approval), auditReference: `audit-${membership.tenantId}-${++auditSequence}` } };
        });
      }

      if (approvalRequestPath) {
        const resource = visible(membership, String(body.branchId), approvalRequestPath[1]);
        if (!resource) return { status: 404, body: { code: "LIFECYCLE_RESOURCE_NOT_FOUND" } };
        const now = options.now ?? new Date().toISOString();
        if (!recentlyAuthenticated(membership, now)) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
        return execute(membership, path, body, options, () => {
          if (!isSensitiveAction(body.action) || !LIFECYCLE_STAGES.includes(body.targetStage as LifecycleStage) ||
              !Number.isSafeInteger(body.amountMinor) || Number(body.amountMinor) < 0 || !validReasonEvidence(body.reason, body.evidence) ||
              !validStringArray(body.overriddenBlockers)) {
            return { status: 400, body: { code: "INVALID_APPROVAL_REQUEST" } };
          }
          const expectedAction = sensitiveActionFor(resource.stage, body.targetStage as LifecycleStage, body.overriddenBlockers);
          if (expectedAction !== body.action) return { status: 422, body: { code: "APPROVAL_ACTION_MISMATCH" } };
          const threshold = input.makerCheckerThresholds?.[body.action];
          if (threshold === undefined || Number(body.amountMinor) < threshold) {
            return { status: 422, body: { code: "MAKER_CHECKER_NOT_REQUIRED" } };
          }
          const approval: ApprovalRecord = {
            id: `approval-${++approvalSequence}`, tenantId: membership.tenantId, branchId: resource.branchId,
            resourceId: resource.id, action: body.action, targetStage: body.targetStage as LifecycleStage,
            amountMinor: Number(body.amountMinor), reason: String(body.reason).trim(), evidence: [...body.evidence as string[]],
            overriddenBlockers: [...body.overriddenBlockers as string[]], makerMembershipId: membership.membershipId,
            status: "PENDING", chain: [{ membershipId: membership.membershipId, identityId: membership.identityId,
              decision: "SUBMIT", at: now, reason: String(body.reason).trim() }],
          };
          approvals.set(approval.id, approval);
          return { status: 202, body: { approval: clone(approval), auditReference: `audit-${membership.tenantId}-${++auditSequence}` } };
        });
      }

      if (path === "/api/v1/lifecycle/resources") {
        return execute(membership, path, body, options, () => {
          if (typeof body.resourceId !== "string" || !body.resourceId.trim() || !["VISIT", "JOB"].includes(String(body.resourceType))) {
            return { status: 400, body: { code: "INVALID_LIFECYCLE_RESOURCE" } };
          }
          const key = `${membership.tenantId}:${body.resourceId}`;
          if (resources.has(key)) return { status: 409, body: { code: "LIFECYCLE_RESOURCE_EXISTS" } };
          const now = options.now ?? new Date().toISOString();
          const auditReference = `audit-${membership.tenantId}-${++auditSequence}`;
          const history: HistoryEntry = {
            fromStage: null, toStage: "APPOINTMENT", at: now,
            actorIdentityId: membership.identityId, auditReference,
          };
          const resource: LifecycleResource = {
            id: body.resourceId, resourceType: body.resourceType as "VISIT" | "JOB",
            tenantId: membership.tenantId, branchId: String(body.branchId), stage: "APPOINTMENT",
            resourceVersion: 1, history: [history],
          };
          const audit: AuditEntry = {
            auditReference, tenantId: membership.tenantId, branchId: resource.branchId,
            resourceId: resource.id, actorIdentityId: membership.identityId,
            membershipId: membership.membershipId, action: "lifecycle.created", at: now,
            oldStage: null, newStage: "APPOINTMENT", requestId: options.requestId,
            authentication: { authenticatedAt: membership.authenticatedAt, mfa: membership.mfa },
            evidence: [], overriddenBlockers: [],
          };
          resources.set(key, resource);
          audits.push(audit);
          return { status: 201, body: { resource: clone(resource), resourceVersion: 1, auditReference } };
        });
      }

      const transition = path.match(/^\/api\/v1\/lifecycle\/resources\/([^/]+)\/transitions$/);
      if (transition) {
        return execute(membership, path, body, options, () => {
          const resource = visible(membership, String(body.branchId), transition[1]);
          if (!resource) return { status: 404, body: { code: "LIFECYCLE_RESOURCE_NOT_FOUND" } };
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== resource.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: resource.resourceVersion } };
          if (!LIFECYCLE_STAGES.includes(body.toStage as LifecycleStage)) {
            return { status: 409, body: { code: "TRANSITION_NOT_ALLOWED" } };
          }
          if (resource.stage === "CANCELLED" && body.toStage !== resource.lastOperationalStage) {
            return { status: 409, body: { code: "REOPEN_TARGET_MISMATCH" } };
          }
          const decision = evaluateLifecycleTransition({
            fromStage: resource.stage, toStage: body.toStage as LifecycleStage,
            facts: isRecord(body.facts) ? body.facts as LifecycleFacts : {},
          });
          if (!decision.allowed) return { status: 409, body: { code: decision.code } };
          const overriddenBlockers = validStringArray(body.overriddenBlockers) ? body.overriddenBlockers : [];
          const unknownOverrides = overriddenBlockers.filter((code) => !decision.blockers.some((blocker) => blocker.code === code && blocker.overridable));
          const remainingBlockers = decision.blockers.filter((blocker) => !overriddenBlockers.includes(blocker.code));
          if (unknownOverrides.length > 0) return { status: 422, body: { code: "BLOCKER_NOT_OVERRIDABLE", blockers: decision.blockers } };
          if (remainingBlockers.length > 0) return { status: 422, body: { code: "TRANSITION_BLOCKED", blockers: remainingBlockers } };
          const sensitiveAction = sensitiveActionFor(resource.stage, body.toStage as LifecycleStage, overriddenBlockers);
          let approval: ApprovalRecord | undefined;
          if (sensitiveAction) {
            if (!validReasonEvidence(body.reason, body.evidence)) return { status: 422, body: { code: "REASON_AND_EVIDENCE_REQUIRED" } };
            const now = options.now ?? new Date().toISOString();
            if (!recentlyAuthenticated(membership, now)) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            const amountMinor = Number(body.amountMinor ?? 0);
            if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) return { status: 400, body: { code: "INVALID_CONTROL_AMOUNT" } };
            const threshold = input.makerCheckerThresholds?.[sensitiveAction];
            if (threshold !== undefined && amountMinor >= threshold) {
              approval = typeof body.approvalId === "string" ? approvals.get(body.approvalId) : undefined;
              if (!approval || approval.status !== "APPROVED" || approval.tenantId !== membership.tenantId ||
                  approval.branchId !== resource.branchId || approval.resourceId !== resource.id ||
                  approval.makerMembershipId !== membership.membershipId || approval.action !== sensitiveAction ||
                  approval.targetStage !== body.toStage || approval.amountMinor !== amountMinor ||
                  approval.reason !== String(body.reason).trim() || JSON.stringify(approval.evidence) !== JSON.stringify(body.evidence) ||
                  JSON.stringify(approval.overriddenBlockers) !== JSON.stringify(overriddenBlockers)) {
                return { status: 403, body: { code: "APPROVED_CHECK_REQUIRED" } };
              }
            }
          }
          const now = options.now ?? new Date().toISOString();
          const oldStage = resource.stage;
          const auditReference = `audit-${membership.tenantId}-${++auditSequence}`;
          resource.stage = body.toStage as LifecycleStage;
          if (resource.stage === "CANCELLED") resource.lastOperationalStage = oldStage;
          else if (oldStage === "CANCELLED") delete resource.lastOperationalStage;
          resource.resourceVersion += 1;
          resource.history.push({
            fromStage: oldStage, toStage: resource.stage, at: now, actorIdentityId: membership.identityId, auditReference,
            reason: typeof body.reason === "string" ? body.reason.trim() : undefined,
            evidence: validStringArray(body.evidence) ? [...body.evidence] : undefined,
          });
          audits.push({
            auditReference, tenantId: membership.tenantId, branchId: resource.branchId, resourceId: resource.id,
            actorIdentityId: membership.identityId, membershipId: membership.membershipId,
            action: "lifecycle.transitioned", at: now, oldStage, newStage: resource.stage,
            requestId: options.requestId, authentication: { authenticatedAt: membership.authenticatedAt, mfa: membership.mfa },
            reason: typeof body.reason === "string" ? body.reason.trim() : undefined,
            evidence: validStringArray(body.evidence) ? [...body.evidence] : [],
            approvalId: approval?.id, overriddenBlockers: [...overriddenBlockers],
          });
          return { status: 200, body: { resource: clone(resource), resourceVersion: resource.resourceVersion, auditReference } };
        });
      }
      return { status: 404, body: { code: "NOT_FOUND" } };
    }

    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "https://local.workshopos.test");
      const branchId = url.searchParams.get("branchId");
      const auth = authorize(this.token, branchId, "lifecycle.manage");
      if ("status" in auth) return auth;
      const match = url.pathname.match(/^\/api\/v1\/lifecycle\/resources\/([^/]+)$/);
      if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
      const resource = visible(auth, String(branchId), match[1]);
      if (!resource) return { status: 404, body: { code: "LIFECYCLE_RESOURCE_NOT_FOUND" } };
      return { status: 200, body: { resource: clone(resource), auditEntries: audits.filter((entry) => entry.resourceId === resource.id).map(clone) } };
    }
  }

  return { signIn: (token: string) => new Session(token), lifecycleStages: [...LIFECYCLE_STAGES], allowedTransitions: clone(ALLOWED_TRANSITIONS) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function validReasonEvidence(reason: unknown, evidence: unknown): evidence is string[] {
  return typeof reason === "string" && reason.trim().length > 0 && validStringArray(evidence) && evidence.length > 0;
}

function isSensitiveAction(value: unknown): value is SensitiveAction {
  return value === "job.cancel" || value === "job.reopen" || value === "closure.override";
}
