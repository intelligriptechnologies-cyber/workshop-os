export type MembershipStatus = "INVITED" | "ACTIVE" | "ARCHIVED";

export type RoleOption = { id: string; name: string; permissions: string[] };
export type BranchOption = { id: string; name: string };

export type AuthenticatedMembership = {
  id: string;
  identitySubject: string;
  tenantId: string;
  displayName: string;
  email: string;
  status: MembershipStatus;
  roleIds: string[];
  roles: RoleOption[];
  branchIds: string[];
  branches: BranchOption[];
  permissions: string[];
  version: number;
};

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  status: MembershipStatus;
  roleIds: string[];
  roles: RoleOption[];
  branchIds: string[];
  branches: BranchOption[];
  version: number;
  invitedAt?: string;
  lastInvitedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserDirectory = {
  users: ManagedUser[];
  roles: RoleOption[];
  branches: BranchOption[];
};

export type CreateMembership = {
  name: string;
  email: string;
  roleIds: string[];
  branchIds: string[];
  identitySubject: string;
  cognitoUsername: string;
  status: MembershipStatus;
};

export type UpdateMembership = Pick<CreateMembership, "name" | "roleIds" | "branchIds"> & { version: number };

export class ApiError extends Error {
  constructor(readonly status: number, readonly code: string, message?: string) {
    super(message ?? code);
  }
}

export interface AdminUserRepository {
  directory(actor: AuthenticatedMembership): Promise<UserDirectory>;
  create(actor: AuthenticatedMembership, input: CreateMembership, idempotencyKey: string): Promise<{ user: ManagedUser; replay: boolean }>;
  update(actor: AuthenticatedMembership, id: string, input: UpdateMembership): Promise<ManagedUser>;
  archive(actor: AuthenticatedMembership, id: string, reason: string): Promise<{ user: ManagedUser; cognitoUsername: string }>;
  markInviteResent(actor: AuthenticatedMembership, id: string): Promise<{ user: ManagedUser; cognitoUsername: string }>;
}

export interface CognitoAdminPort {
  ensureUser(input: { email: string; name: string; tenantId: string }): Promise<{
    identitySubject: string;
    username: string;
    status: MembershipStatus;
  }>;
  disableUser(username: string): Promise<void>;
  resendInvitation(username: string): Promise<void>;
}

const normalizedIds = (values: unknown) =>
  Array.isArray(values) ? [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))] : [];

function requireManager(actor: AuthenticatedMembership) {
  if (!actor.permissions.includes("membership.manage")) throw new ApiError(403, "PERMISSION_DENIED");
}

function validateAssignments(actor: AuthenticatedMembership, directory: UserDirectory, roleIds: string[], branchIds: string[]) {
  if (!roleIds.length || roleIds.some((id) => !directory.roles.some((role) => role.id === id))) {
    throw new ApiError(400, "ROLE_NOT_FOUND");
  }
  if (!branchIds.length || branchIds.some((id) => !actor.branchIds.includes(id) || !directory.branches.some((branch) => branch.id === id))) {
    throw new ApiError(403, "BRANCH_FORBIDDEN");
  }
}

export class AdminUserService {
  constructor(private readonly repository: AdminUserRepository, private readonly cognito: CognitoAdminPort) {}

  async list(actor: AuthenticatedMembership) {
    requireManager(actor);
    return this.repository.directory(actor);
  }

  async create(actor: AuthenticatedMembership, raw: Record<string, unknown>, idempotencyKey: string) {
    requireManager(actor);
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    const name = String(raw.name ?? "").trim();
    const email = String(raw.email ?? "").trim().toLowerCase();
    const roleIds = normalizedIds(raw.roleIds);
    const branchIds = normalizedIds(raw.branchIds);
    if (!name) throw new ApiError(400, "NAME_REQUIRED");
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, "EMAIL_INVALID");
    const directory = await this.repository.directory(actor);
    validateAssignments(actor, directory, roleIds, branchIds);
    const identity = await this.cognito.ensureUser({ email, name, tenantId: actor.tenantId });
    return this.repository.create(actor, {
      name, email, roleIds, branchIds,
      identitySubject: identity.identitySubject,
      cognitoUsername: identity.username,
      status: identity.status,
    }, idempotencyKey);
  }

  async update(actor: AuthenticatedMembership, id: string, raw: Record<string, unknown>) {
    requireManager(actor);
    const name = String(raw.name ?? "").trim();
    const roleIds = normalizedIds(raw.roleIds);
    const branchIds = normalizedIds(raw.branchIds);
    const version = Number(raw.version);
    if (!name) throw new ApiError(400, "NAME_REQUIRED");
    if (!Number.isSafeInteger(version) || version < 1) throw new ApiError(400, "VERSION_REQUIRED");
    const directory = await this.repository.directory(actor);
    validateAssignments(actor, directory, roleIds, branchIds);
    return this.repository.update(actor, id, { name, roleIds, branchIds, version });
  }

  async archive(actor: AuthenticatedMembership, id: string, reason: string) {
    requireManager(actor);
    if (!reason.trim()) throw new ApiError(400, "ARCHIVE_REASON_REQUIRED");
    const archived = await this.repository.archive(actor, id, reason.trim());
    await this.cognito.disableUser(archived.cognitoUsername);
    return archived.user;
  }

  async resendInvite(actor: AuthenticatedMembership, id: string) {
    requireManager(actor);
    const pending = await this.repository.markInviteResent(actor, id);
    await this.cognito.resendInvitation(pending.cognitoUsername);
    return pending.user;
  }
}
