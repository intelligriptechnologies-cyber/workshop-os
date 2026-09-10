import { createHash, timingSafeEqual } from "node:crypto";

export type Permission = string;

export type Membership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: Permission[];
  roleIds?: string[];
  active?: boolean;
};

export type AuthContext = {
  authenticatedAt: string;
  mfa: boolean;
};

export type VerifiedIdentity = AuthContext & {
  identityId: string;
};

export interface IdentityProviderPort {
  createIndividualIdentity(input: { identityId: string; email: string }): { identityId: string; created: boolean };
  issueToken(identityId: string, context: AuthContext): string;
  verifyToken(token: string): VerifiedIdentity | undefined;
}

class LocalCognitoCompatibleIdentityProvider implements IdentityProviderPort {
  private readonly identities = new Map<string, string>();
  private readonly tokens = new Map<string, VerifiedIdentity>();
  private sequence = 0;

  createIndividualIdentity(input: { identityId: string; email: string }) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = this.identities.get(normalizedEmail);
    if (existing && existing !== input.identityId) throw new Error("INDIVIDUAL_IDENTITY_REQUIRED");
    this.identities.set(normalizedEmail, input.identityId);
    return { identityId: input.identityId, created: !existing };
  }

  issueToken(identityId: string, context: AuthContext): string {
    const token = `local-cognito-token-${++this.sequence}`;
    this.tokens.set(token, { identityId, ...context });
    return token;
  }

  verifyToken(token: string): VerifiedIdentity | undefined {
    const verified = this.tokens.get(token);
    return verified ? { ...verified } : undefined;
  }
}

type AuthorizationRequest = {
  branchId: string;
  permission: Permission;
  now: string;
  sensitive?: boolean;
};

type AuthorizationDecision =
  | { allowed: true; identityId: string; membershipId: string; tenantId: string; branchId: string; authentication?: AuthContext }
  | { allowed: false; code: string };

type RoleTemplate = { id: string; name: string; permissions: Permission[] };
type TenantRecord = {
  id: string;
  legalName: string;
  planId: string;
  entitlements: string[];
  quotas: Record<string, number>;
  baseCurrency: string;
  timezone: string;
  configurationTemplateId: string;
  branches: Array<{ id: string; name: string }>;
  roles: RoleTemplate[];
  ownerMembership: Membership;
  version: number;
};

const DEFAULT_ROLE_TEMPLATES: ReadonlyArray<Omit<RoleTemplate, "id">> = [
  { name: "Platform Super Admin", permissions: ["platform.tenant.provision", "platform.support.request"] },
  { name: "Business Owner/Admin", permissions: ["tenant.manage", "membership.manage", "report.view", "approval.decide"] },
  { name: "Workshop/Branch Manager", permissions: ["visit.view", "job.manage", "approval.decide", "qc.perform"] },
  { name: "Reception", permissions: ["visit.create", "visit.view", "appointment.manage"] },
  { name: "Service Advisor", permissions: ["visit.view", "estimate.manage", "job.plan"] },
  { name: "Technician", permissions: ["task.execute", "material.consume"] },
  { name: "Store", permissions: ["inventory.issue", "inventory.return.verify", "procurement.manage"] },
  { name: "Accounts/Cashier", permissions: ["invoice.manage", "payment.record"] },
  { name: "Gate/Security", permissions: ["gate.verify"] },
];

export const CONTROLLED_ACTIONS = [
  "discount", "procurement", "stock.adjust", "excess.use", "waste", "invoice.reverse",
  "payment.reverse", "credit.exception", "job.cancel", "job.reopen", "closure.override",
] as const;
type ControlledAction = typeof CONTROLLED_ACTIONS[number];
type ApprovalRecord = {
  id: string;
  tenantId: string;
  branchId: string;
  action: ControlledAction;
  amountMinor: number;
  reason: string;
  subjectReference: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  makerMembershipId: string;
  approvalChain: Array<{ membershipId: string; identityId: string; decision: "SUBMIT" | "APPROVE" | "REJECT"; at: string; reason: string }>;
};

type SupportGrant = {
  id: string;
  tenantId: string;
  platformIdentityId: string;
  branchIds: string[];
  permissions: Permission[];
  reason: string;
  requestedAt: string;
  expiresAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvalChain: string[];
};

type AuditEvidence = {
  auditReference: string;
  tenantId: string;
  branchId?: string;
  actorIdentityId: string;
  membershipId: string;
  timestamp: string;
  action: string;
  reason: string;
  oldState?: unknown;
  newState?: unknown;
  ledgerReferences: string[];
  approvalChain: string[];
  requestId: string;
  authentication: AuthContext;
};

type ProvisionCommand = {
  tenantId: string;
  legalName: string;
  owner: { identityId: string; email: string };
  branch: { id: string; name: string };
  planId: string;
  entitlements: string[];
  quotas: Record<string, number>;
  baseCurrency: string;
  timezone: string;
  configurationTemplateId: string;
};

type ProvisionOptions = { idempotencyKey: string; requestId: string; now: string };

export function createLocalIdentityAccessSystem() {
  const identityProvider = new LocalCognitoCompatibleIdentityProvider();
  const memberships = new Map<string, Membership>();
  const platformIdentities = new Set<string>();
  const tenants = new Map<string, TenantRecord>();
  const provisioningResults = new Map<string, { tenant: TenantRecord; auditReference: string }>();
  const sharedDevices = new Map<string, { deviceId: string; tenantId: string; branchId: string; label: string; active: boolean }>();
  const kioskPins = new Map<string, { digest: string; failedAttempts: number; lockedUntil?: string }>();
  const securityPolicies = new Map<string, { requireStaffMfa: boolean; recentAuthenticationMinutes: number }>();
  const makerCheckerPolicies = new Map<string, Map<ControlledAction, number>>();
  const approvals = new Map<string, ApprovalRecord>();
  const supportGrants = new Map<string, SupportGrant>();
  const auditEntries: AuditEvidence[] = [];
  let auditSequence = 0;

  const pinDigest = (membershipId: string, pin: string) =>
    createHash("sha256").update(`workshopos-local:${membershipId}:${pin}`).digest("hex");
  const findMembershipById = (membershipId: string) =>
    [...memberships.values()].find((membership) => membership.membershipId === membershipId);
  const recordAudit = (input: Omit<AuditEvidence, "auditReference" | "ledgerReferences"> & { ledgerReferences?: string[] }) => {
    const entry: AuditEvidence = {
      ...input,
      auditReference: `audit-${input.tenantId}-${++auditSequence}`,
      ledgerReferences: input.ledgerReferences ?? [],
    };
    auditEntries.push(entry);
    return entry.auditReference;
  };

  const provisionForTest = (tenantId: string, ownerIdentityId: string, branchId: string): TenantRecord => {
    const roles = DEFAULT_ROLE_TEMPLATES.map((role, index) => ({
      id: `${tenantId}-role-${index + 1}`,
      name: role.name,
      permissions: [...role.permissions],
    }));
    const ownerRole = roles.find((role) => role.name === "Business Owner/Admin")!;
    const ownerMembership: Membership = {
      identityId: ownerIdentityId,
      membershipId: `${tenantId}-membership-owner`,
      tenantId,
      branchIds: [branchId],
      roleIds: [ownerRole.id],
      permissions: [...ownerRole.permissions],
      active: true,
    };
    identityProvider.createIndividualIdentity({ identityId: ownerIdentityId, email: `${ownerIdentityId}@local.test` });
    memberships.set(ownerIdentityId, ownerMembership);
    const tenant: TenantRecord = {
      id: tenantId,
      legalName: tenantId,
      planId: "test",
      entitlements: ["workshop"],
      quotas: { users: 100, branches: 10 },
      baseCurrency: "INR",
      timezone: "Asia/Kolkata",
      configurationTemplateId: "india-workshop-v1",
      branches: [{ id: branchId, name: branchId }],
      roles,
      ownerMembership,
      version: 1,
    };
    tenants.set(tenantId, tenant);
    return tenant;
  };

  return {
    identityProvider,
    provisionTenant(token: string, command: ProvisionCommand, options: ProvisionOptions) {
      const verified = identityProvider.verifyToken(token);
      if (!verified || !platformIdentities.has(verified.identityId)) {
        return { status: 403, body: { code: "PLATFORM_CREDENTIAL_REQUIRED" } };
      }
      if (!verified.mfa) return { status: 403, body: { code: "MFA_REQUIRED" } };
      const prior = provisioningResults.get(options.idempotencyKey);
      if (prior) return { status: 200, body: prior };
      if (tenants.has(command.tenantId)) return { status: 409, body: { code: "TENANT_ALREADY_EXISTS" } };

      identityProvider.createIndividualIdentity(command.owner);
      const roles = DEFAULT_ROLE_TEMPLATES.map((role, index) => ({
        id: `${command.tenantId}-role-${index + 1}`,
        name: role.name,
        permissions: [...role.permissions],
      }));
      const ownerRole = roles.find((role) => role.name === "Business Owner/Admin")!;
      const ownerMembership: Membership = {
        identityId: command.owner.identityId,
        membershipId: `${command.tenantId}-membership-owner`,
        tenantId: command.tenantId,
        branchIds: [command.branch.id],
        permissions: [...ownerRole.permissions],
        roleIds: [ownerRole.id],
        active: true,
      };
      const tenant: TenantRecord = {
        id: command.tenantId,
        legalName: command.legalName,
        planId: command.planId,
        entitlements: [...command.entitlements],
        quotas: { ...command.quotas },
        baseCurrency: command.baseCurrency,
        timezone: command.timezone,
        configurationTemplateId: command.configurationTemplateId,
        branches: [{ ...command.branch }],
        roles,
        ownerMembership,
        version: 1,
      };
      memberships.set(ownerMembership.identityId, ownerMembership);
      tenants.set(tenant.id, tenant);
      const auditReference = recordAudit({
        tenantId: tenant.id, branchId: command.branch.id, actorIdentityId: verified.identityId,
        membershipId: `platform:${verified.identityId}`, timestamp: options.now,
        action: "tenant.provisioned", reason: "Platform tenant provisioning", newState: tenant,
        approvalChain: [verified.identityId], requestId: options.requestId,
        authentication: { authenticatedAt: verified.authenticatedAt, mfa: verified.mfa },
      });
      const result = { tenant, auditReference };
      provisioningResults.set(options.idempotencyKey, result);
      return { status: 201, body: result };
    },
    addMembership(token: string, input: {
      identityId: string;
      email: string;
      branchIds: string[];
      roleIds: string[];
      additionalPermissions: Permission[];
    }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const actorMembership = verified ? memberships.get(verified.identityId) : undefined;
      if (!actorMembership?.permissions.includes("membership.manage")) {
        return { status: 403, body: { code: "PERMISSION_DENIED" } };
      }
      const tenant = tenants.get(actorMembership.tenantId)!;
      if (input.branchIds.some((id) => !actorMembership.branchIds.includes(id))) {
        return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
      }
      const selectedRoles = input.roleIds.map((id) => tenant.roles.find((role) => role.id === id));
      if (selectedRoles.some((role) => !role)) return { status: 400, body: { code: "ROLE_NOT_FOUND" } };
      try {
        identityProvider.createIndividualIdentity({ identityId: input.identityId, email: input.email });
      } catch (error) {
        if (error instanceof Error && error.message === "INDIVIDUAL_IDENTITY_REQUIRED") {
          return { status: 409, body: { code: error.message } };
        }
        throw error;
      }
      const permissions = [...new Set([
        ...selectedRoles.flatMap((role) => role!.permissions),
        ...input.additionalPermissions,
      ])];
      const membership: Membership = {
        identityId: input.identityId,
        membershipId: `${tenant.id}-membership-${memberships.size + 1}`,
        tenantId: tenant.id,
        branchIds: [...input.branchIds],
        roleIds: [...input.roleIds],
        permissions,
        active: true,
      };
      memberships.set(membership.identityId, membership);
      const auditReference = recordAudit({
        tenantId: tenant.id, branchId: membership.branchIds[0], actorIdentityId: actorMembership.identityId,
        membershipId: actorMembership.membershipId, timestamp: options.now, action: "membership.created",
        reason: "Individual staff membership", newState: membership, approvalChain: [actorMembership.identityId],
        requestId: options.requestId, authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 201, body: { membership, auditReference } };
    },
    configureSecurityPolicy(token: string, input: { requireStaffMfa: boolean; recentAuthenticationMinutes: number }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      if (!actor?.permissions.includes("tenant.manage")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
      if (input.recentAuthenticationMinutes < 1 || input.recentAuthenticationMinutes > 120) {
        return { status: 400, body: { code: "RECENT_AUTHENTICATION_WINDOW_INVALID" } };
      }
      const oldState = securityPolicies.get(actor.tenantId);
      securityPolicies.set(actor.tenantId, { ...input });
      const auditReference = recordAudit({
        tenantId: actor.tenantId, branchId: actor.branchIds[0], actorIdentityId: actor.identityId,
        membershipId: actor.membershipId, timestamp: options.now, action: "security-policy.changed",
        reason: "Tenant security policy configuration", oldState, newState: input,
        approvalChain: [actor.identityId], requestId: options.requestId,
        authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 200, body: { auditReference } };
    },
    configureMakerChecker(token: string, input: { action: ControlledAction; thresholdMinor: number }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      if (!actor?.permissions.includes("tenant.manage")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
      if (!CONTROLLED_ACTIONS.includes(input.action) || !Number.isSafeInteger(input.thresholdMinor) || input.thresholdMinor < 0) {
        return { status: 400, body: { code: "APPROVAL_POLICY_INVALID" } };
      }
      const policy = makerCheckerPolicies.get(actor.tenantId) ?? new Map<ControlledAction, number>();
      const oldState = policy.get(input.action);
      policy.set(input.action, input.thresholdMinor);
      makerCheckerPolicies.set(actor.tenantId, policy);
      const auditReference = recordAudit({
        tenantId: actor.tenantId, branchId: actor.branchIds[0], actorIdentityId: actor.identityId,
        membershipId: actor.membershipId, timestamp: options.now, action: "maker-checker-policy.changed",
        reason: input.action, oldState, newState: input.thresholdMinor, approvalChain: [actor.identityId],
        requestId: options.requestId, authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 200, body: { auditReference } };
    },
    submitControlledAction(token: string, input: {
      action: ControlledAction;
      amountMinor: number;
      branchId: string;
      reason: string;
      subjectReference: string;
    }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const maker = verified ? memberships.get(verified.identityId) : undefined;
      if (!maker?.permissions.includes(`${input.action}.request`)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
      if (!maker.branchIds.includes(input.branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
      const threshold = makerCheckerPolicies.get(maker.tenantId)?.get(input.action);
      const status: ApprovalRecord["status"] = threshold !== undefined && input.amountMinor >= threshold ? "PENDING" : "APPROVED";
      const approval: ApprovalRecord = {
        id: `approval-${approvals.size + 1}`,
        tenantId: maker.tenantId,
        branchId: input.branchId,
        action: input.action,
        amountMinor: input.amountMinor,
        reason: input.reason,
        subjectReference: input.subjectReference,
        status,
        makerMembershipId: maker.membershipId,
        approvalChain: [{
          membershipId: maker.membershipId,
          identityId: maker.identityId,
          decision: "SUBMIT",
          at: options.now,
          reason: input.reason,
        }],
      };
      approvals.set(approval.id, approval);
      const auditReference = recordAudit({
        tenantId: maker.tenantId, branchId: maker.branchIds[0], actorIdentityId: maker.identityId,
        membershipId: maker.membershipId, timestamp: options.now, action: "controlled-action.submitted",
        reason: input.reason, newState: status, ledgerReferences: [input.subjectReference],
        approvalChain: approval.approvalChain.map((step) => step.identityId), requestId: options.requestId,
        authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: status === "PENDING" ? 202 : 200, body: { approval, auditReference } };
    },
    decideApproval(token: string, input: { approvalId: string; decision: "APPROVE" | "REJECT"; reason: string }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const checker = verified ? memberships.get(verified.identityId) : undefined;
      const approval = approvals.get(input.approvalId);
      if (!checker || !approval || checker.tenantId !== approval.tenantId || !checker.branchIds.includes(approval.branchId)) {
        return { status: 404, body: { code: "APPROVAL_NOT_FOUND" } };
      }
      if (checker.membershipId === approval.makerMembershipId) return { status: 403, body: { code: "MAKER_CANNOT_CHECK" } };
      if (!checker.permissions.includes("approval.decide")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
      if (approval.status !== "PENDING") return { status: 409, body: { code: "APPROVAL_ALREADY_DECIDED" } };
      const security = securityPolicies.get(checker.tenantId) ?? { requireStaffMfa: false, recentAuthenticationMinutes: 15 };
      if (Date.parse(options.now) - Date.parse(verified!.authenticatedAt) > security.recentAuthenticationMinutes * 60_000) {
        return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
      }
      const oldState = approval.status;
      approval.status = input.decision === "APPROVE" ? "APPROVED" : "REJECTED";
      approval.approvalChain.push({
        membershipId: checker.membershipId,
        identityId: checker.identityId,
        decision: input.decision,
        at: options.now,
        reason: input.reason,
      });
      const auditReference = recordAudit({
        tenantId: checker.tenantId, branchId: approval.branchId, actorIdentityId: checker.identityId,
        membershipId: checker.membershipId, timestamp: options.now, action: "controlled-action.decided",
        reason: input.reason, oldState, newState: approval.status, ledgerReferences: [approval.subjectReference],
        approvalChain: approval.approvalChain.map((step) => step.identityId), requestId: options.requestId,
        authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 200, body: { approval, auditReference } };
    },
    requestSupportAccess(token: string, input: {
      tenantId: string;
      branchIds: string[];
      permissions: Permission[];
      reason: string;
      expiresAt: string;
    }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const tenant = tenants.get(input.tenantId);
      if (!verified || !platformIdentities.has(verified.identityId)) {
        return { status: 403, body: { code: "PLATFORM_CREDENTIAL_REQUIRED" } };
      }
      if (!verified.mfa) return { status: 403, body: { code: "MFA_REQUIRED" } };
      if (!tenant || input.branchIds.some((branchId) => !tenant.branches.some((branch) => branch.id === branchId))) {
        return { status: 404, body: { code: "TENANT_OR_BRANCH_NOT_FOUND" } };
      }
      if (!input.reason.trim() || Date.parse(input.expiresAt) <= Date.parse(options.now)) {
        return { status: 400, body: { code: "SUPPORT_ACCESS_WINDOW_INVALID" } };
      }
      const grant: SupportGrant = {
        id: `support-grant-${supportGrants.size + 1}`,
        tenantId: input.tenantId,
        platformIdentityId: verified.identityId,
        branchIds: [...input.branchIds],
        permissions: [...input.permissions],
        reason: input.reason,
        requestedAt: options.now,
        expiresAt: input.expiresAt,
        status: "PENDING",
        approvalChain: [verified.identityId],
      };
      supportGrants.set(grant.id, grant);
      const auditReference = recordAudit({
        tenantId: grant.tenantId,
        branchId: grant.branchIds[0],
        actorIdentityId: verified.identityId,
        membershipId: `platform:${verified.identityId}`,
        timestamp: options.now,
        action: "support-access.requested",
        reason: grant.reason,
        newState: "PENDING",
        approvalChain: [...grant.approvalChain],
        requestId: options.requestId,
        authentication: { authenticatedAt: verified.authenticatedAt, mfa: verified.mfa },
      });
      return { status: 202, body: { grant, auditReference } };
    },
    listSupportAccess(token: string) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      if (!actor) return { status: 403, body: { code: "MEMBERSHIP_REQUIRED" } };
      const grants = [...supportGrants.values()].filter((grant) => grant.tenantId === actor.tenantId);
      return { status: 200, body: { grants } };
    },
    decideSupportAccess(token: string, input: { grantId: string; decision: "APPROVE" | "REJECT"; reason: string }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      const grant = supportGrants.get(input.grantId);
      if (!actor?.permissions.includes("tenant.manage")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
      if (!grant || grant.tenantId !== actor.tenantId) return { status: 404, body: { code: "SUPPORT_ACCESS_NOT_FOUND" } };
      if (grant.status !== "PENDING") return { status: 409, body: { code: "SUPPORT_ACCESS_ALREADY_DECIDED" } };
      const prior = grant.status;
      grant.status = input.decision === "APPROVE" ? "APPROVED" : "REJECTED";
      grant.approvalChain.push(actor.identityId);
      const auditReference = recordAudit({
        tenantId: grant.tenantId,
        branchId: grant.branchIds[0],
        actorIdentityId: actor.identityId,
        membershipId: actor.membershipId,
        timestamp: options.now,
        action: `support-access.${grant.status.toLowerCase()}`,
        reason: input.reason,
        oldState: prior,
        newState: grant.status,
        approvalChain: [...grant.approvalChain],
        requestId: options.requestId,
        authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 200, body: { grant, auditReference } };
    },
    authorizeSupport(token: string, request: { grantId: string; branchId: string; permission: Permission; now: string }): AuthorizationDecision {
      const verified = identityProvider.verifyToken(token);
      const grant = supportGrants.get(request.grantId);
      if (!verified || !platformIdentities.has(verified.identityId) || !grant || grant.platformIdentityId !== verified.identityId || grant.status !== "APPROVED") {
        return { allowed: false, code: "SUPPORT_ACCESS_DENIED" };
      }
      if (Date.parse(request.now) >= Date.parse(grant.expiresAt)) return { allowed: false, code: "SUPPORT_ACCESS_EXPIRED" };
      if (!grant.branchIds.includes(request.branchId)) return { allowed: false, code: "BRANCH_FORBIDDEN" };
      if (!grant.permissions.includes(request.permission)) return { allowed: false, code: "PERMISSION_DENIED" };
      return {
        allowed: true,
        identityId: verified.identityId,
        membershipId: `support:${grant.id}`,
        tenantId: grant.tenantId,
        branchId: request.branchId,
        authentication: { authenticatedAt: verified.authenticatedAt, mfa: verified.mfa },
      };
    },
    listAudit(token: string) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      if (!actor) return { status: 403, body: { code: "MEMBERSHIP_REQUIRED" } };
      return { status: 200, body: { auditEntries: auditEntries.filter((entry) => entry.tenantId === actor.tenantId).map((entry) => ({ ...entry })) } };
    },
    registerSharedDevice(token: string, input: { deviceId: string; branchId: string; label: string }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      if (!actor?.permissions.includes("tenant.manage")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
      if (!actor.branchIds.includes(input.branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
      sharedDevices.set(input.deviceId, {
        deviceId: input.deviceId,
        tenantId: actor.tenantId,
        branchId: input.branchId,
        label: input.label,
        active: true,
      });
      const auditReference = recordAudit({
        tenantId: actor.tenantId, branchId: input.branchId, actorIdentityId: actor.identityId,
        membershipId: actor.membershipId, timestamp: options.now, action: "shared-device.registered",
        reason: input.label, newState: { deviceId: input.deviceId, active: true }, approvalChain: [actor.identityId],
        requestId: options.requestId, authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 201, body: { auditReference } };
    },
    setKioskPin(token: string, input: { membershipId: string; pin: string }, options: { requestId: string; now: string }) {
      const verified = identityProvider.verifyToken(token);
      const actor = verified ? memberships.get(verified.identityId) : undefined;
      const target = findMembershipById(input.membershipId);
      if (!actor?.permissions.includes("membership.manage") || !target || target.tenantId !== actor.tenantId) {
        return { status: 403, body: { code: "PERMISSION_DENIED" } };
      }
      if (!/^\d{4,8}$/.test(input.pin)) return { status: 400, body: { code: "PIN_POLICY_FAILED" } };
      kioskPins.set(target.membershipId, { digest: pinDigest(target.membershipId, input.pin), failedAttempts: 0 });
      const auditReference = recordAudit({
        tenantId: actor.tenantId, branchId: target.branchIds[0], actorIdentityId: actor.identityId,
        membershipId: actor.membershipId, timestamp: options.now, action: "kiosk-pin.changed",
        reason: "Kiosk credential rotation", newState: { membershipId: target.membershipId, credentialStored: true },
        approvalChain: [actor.identityId], requestId: options.requestId,
        authentication: { authenticatedAt: verified!.authenticatedAt, mfa: verified!.mfa },
      });
      return { status: 200, body: { auditReference } };
    },
    switchKioskUser(input: { deviceId: string; membershipId: string; pin: string; now: string; requestId: string }) {
      const device = sharedDevices.get(input.deviceId);
      const membership = findMembershipById(input.membershipId);
      const credential = kioskPins.get(input.membershipId);
      if (!device?.active || !membership || !credential || membership.active === false ||
          membership.tenantId !== device.tenantId || !membership.branchIds.includes(device.branchId)) {
        return { status: 401, body: { code: "KIOSK_CREDENTIAL_INVALID" } };
      }
      if (credential.lockedUntil && Date.parse(input.now) < Date.parse(credential.lockedUntil)) {
        return { status: 423, body: { code: "KIOSK_LOCKED" } };
      }
      const supplied = Buffer.from(pinDigest(membership.membershipId, input.pin), "hex");
      const expected = Buffer.from(credential.digest, "hex");
      if (!timingSafeEqual(supplied, expected)) {
        credential.failedAttempts += 1;
        if (credential.failedAttempts >= 3) {
          credential.lockedUntil = new Date(Date.parse(input.now) + 15 * 60_000).toISOString();
        }
        return { status: 401, body: { code: "KIOSK_CREDENTIAL_INVALID" } };
      }
      credential.failedAttempts = 0;
      credential.lockedUntil = undefined;
      const token = identityProvider.issueToken(membership.identityId, { authenticatedAt: input.now, mfa: false });
      const auditReference = recordAudit({
        tenantId: membership.tenantId, branchId: device.branchId, actorIdentityId: membership.identityId,
        membershipId: membership.membershipId, timestamp: input.now, action: "kiosk-session.switched",
        reason: device.label, newState: { deviceId: device.deviceId, identityId: membership.identityId },
        approvalChain: [membership.identityId], requestId: input.requestId,
        authentication: { authenticatedAt: input.now, mfa: false },
      });
      return { status: 201, body: { token, auditReference } };
    },
    authorize(token: string, request: AuthorizationRequest): AuthorizationDecision {
      const identity = identityProvider.verifyToken(token);
      if (!identity) return { allowed: false, code: "AUTHENTICATION_REQUIRED" };
      const membership = memberships.get(identity.identityId);
      if (!membership || membership.active === false) return { allowed: false, code: "MEMBERSHIP_REQUIRED" };
      if (!membership.branchIds.includes(request.branchId)) return { allowed: false, code: "BRANCH_FORBIDDEN" };
      if (!membership.permissions.includes(request.permission)) return { allowed: false, code: "PERMISSION_DENIED" };
      const policy = securityPolicies.get(membership.tenantId) ?? {
        requireStaffMfa: false,
        recentAuthenticationMinutes: 15,
      };
      if (policy.requireStaffMfa && !identity.mfa) return { allowed: false, code: "MFA_REQUIRED" };
      if (request.sensitive && Date.parse(request.now) - Date.parse(identity.authenticatedAt) > policy.recentAuthenticationMinutes * 60_000) {
        return { allowed: false, code: "RECENT_AUTHENTICATION_REQUIRED" };
      }
      return {
        allowed: true,
        identityId: membership.identityId,
        membershipId: membership.membershipId,
        tenantId: membership.tenantId,
        branchId: request.branchId,
        ...(request.sensitive ? { authentication: { authenticatedAt: identity.authenticatedAt, mfa: identity.mfa } } : {}),
      };
    },
    testing: {
      seedPlatformIdentity(identityId: string) {
        platformIdentities.add(identityId);
      },
      provisionTenant: provisionForTest,
      seedMembership(membership: Membership) {
        memberships.set(membership.identityId, { ...membership, branchIds: [...membership.branchIds], permissions: [...membership.permissions] });
      },
    },
  };
}
