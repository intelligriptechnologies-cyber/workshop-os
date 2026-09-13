import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  AdminUserService, ApiError,
  type AdminUserRepository, type AuthenticatedMembership, type CognitoAdminPort,
  type CreateMembership, type ManagedUser, type UpdateMembership, type UserDirectory,
} from "../src/admin-users.js";

const roles = [
  { id: "role-admin", name: "Business Owner/Admin", permissions: ["membership.manage"] },
  { id: "role-advisor", name: "Service Advisor", permissions: ["visit.view"] },
];
const branches = [{ id: "branch-delhi", name: "Delhi" }, { id: "branch-jaipur", name: "Jaipur" }];
const actor: AuthenticatedMembership = {
  id: "user-admin", identitySubject: "subject-admin", tenantId: "tenant-north", displayName: "Admin",
  email: "admin@example.com", status: "ACTIVE", roleIds: ["role-admin"], roles: [roles[0]],
  branchIds: branches.map((item) => item.id), branches, permissions: ["membership.manage"], version: 1,
};

const now = () => "2026-09-13T12:00:00.000Z";

class MemoryRepository implements AdminUserRepository {
  users: ManagedUser[] = [{
    id: actor.id, name: actor.displayName, email: actor.email, status: "ACTIVE", roleIds: actor.roleIds,
    roles: actor.roles, branchIds: actor.branchIds, branches: actor.branches, version: 1, createdAt: now(), updatedAt: now(),
  }];
  commands = new Map<string, ManagedUser>();
  quota = 20;
  failNextCreate = false;

  async directory(): Promise<UserDirectory> { return { users: this.users.filter((item) => item.status !== "ARCHIVED"), roles, branches }; }
  async create(current: AuthenticatedMembership, input: CreateMembership, key: string) {
    const prior = this.commands.get(`${current.tenantId}:${key}`);
    if (prior) return { user: prior, replay: true };
    if (this.failNextCreate) { this.failNextCreate = false; throw new Error("database unavailable"); }
    if (this.users.some((item) => item.email === input.email)) throw new ApiError(409, "EMAIL_EXISTS");
    if (this.users.filter((item) => item.status !== "ARCHIVED").length >= this.quota) throw new ApiError(409, "QUOTA_EXCEEDED");
    const user = this.makeUser(input);
    this.users.push(user); this.commands.set(`${current.tenantId}:${key}`, user);
    return { user, replay: false };
  }
  async update(_current: AuthenticatedMembership, id: string, input: UpdateMembership) {
    const user = this.target(id);
    if (user.version !== input.version) throw new ApiError(409, "VERSION_CONFLICT");
    if (user.roleIds.includes("role-admin") && !input.roleIds.includes("role-admin") && this.adminCount() === 1) throw new ApiError(409, "FINAL_ADMIN_REQUIRED");
    Object.assign(user, { name: input.name, roleIds: input.roleIds, roles: roles.filter((item) => input.roleIds.includes(item.id)), branchIds: input.branchIds, branches: branches.filter((item) => input.branchIds.includes(item.id)), version: user.version + 1 });
    return user;
  }
  async archive(current: AuthenticatedMembership, id: string, _reason: string) {
    if (id === current.id) throw new ApiError(409, "SELF_ARCHIVE_FORBIDDEN");
    const user = this.target(id);
    if (user.roleIds.includes("role-admin") && this.adminCount() === 1) throw new ApiError(409, "FINAL_ADMIN_REQUIRED");
    user.status = "ARCHIVED"; user.version += 1;
    return { user, cognitoUsername: user.email };
  }
  async markInviteResent(_current: AuthenticatedMembership, id: string) {
    const user = this.target(id);
    if (user.status !== "INVITED") throw new ApiError(409, "INVITE_ALREADY_COMPLETED");
    user.lastInvitedAt = now(); user.version += 1;
    return { user, cognitoUsername: user.email };
  }
  private makeUser(input: CreateMembership): ManagedUser {
    return { id: `user-${this.users.length + 1}`, name: input.name, email: input.email, status: input.status,
      roleIds: input.roleIds, roles: roles.filter((item) => input.roleIds.includes(item.id)),
      branchIds: input.branchIds, branches: branches.filter((item) => input.branchIds.includes(item.id)),
      version: 1, invitedAt: now(), lastInvitedAt: now(), createdAt: now(), updatedAt: now() };
  }
  private target(id: string) { const user = this.users.find((item) => item.id === id); if (!user) throw new ApiError(404, "USER_NOT_FOUND"); return user; }
  private adminCount() { return this.users.filter((item) => item.status !== "ARCHIVED" && item.roleIds.includes("role-admin")).length; }
}

class MemoryCognito implements CognitoAdminPort {
  identities = new Map<string, { identitySubject: string; username: string; status: "INVITED" }>();
  disabled: string[] = [];
  resent: string[] = [];
  ensureCalls = 0;
  async ensureUser(input: { email: string; tenantId: string }) {
    this.ensureCalls += 1;
    const prior = this.identities.get(input.email);
    if (prior) return prior;
    const created = { identitySubject: `sub-${this.identities.size + 1}`, username: input.email, status: "INVITED" as const };
    this.identities.set(input.email, created); return created;
  }
  async disableUser(username: string) { this.disabled.push(username); }
  async resendInvitation(username: string) { this.resent.push(username); }
}

async function rejectsCode(action: () => Promise<unknown>, code: string) {
  await assert.rejects(action, (error: ApiError) => error instanceof ApiError && error.code === code);
}

test("admin API requires membership.manage and tenant-authorized role and branch assignments", async () => {
  const service = new AdminUserService(new MemoryRepository(), new MemoryCognito());
  await rejectsCode(() => service.list({ ...actor, permissions: [] }), "PERMISSION_DENIED");
  await rejectsCode(() => service.create(actor, { name: "A", email: "a@example.com", roleIds: ["missing"], branchIds: ["branch-delhi"] }, "one"), "ROLE_NOT_FOUND");
  await rejectsCode(() => service.create({ ...actor, branchIds: ["branch-delhi"] }, { name: "A", email: "a@example.com", roleIds: ["role-advisor"], branchIds: ["branch-jaipur"] }, "two"), "BRANCH_FORBIDDEN");
});

test("invitation is passwordless to WorkshopOS, normalizes email, and retries idempotently", async () => {
  const repository = new MemoryRepository(); const cognito = new MemoryCognito(); const service = new AdminUserService(repository, cognito);
  const input = { name: " Advisor ", email: "ADVISOR@EXAMPLE.COM ", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] };
  const first = await service.create(actor, input, "invite-1");
  const replay = await service.create(actor, input, "invite-1");
  assert.equal(first.user.email, "advisor@example.com"); assert.equal(first.user.status, "INVITED");
  assert.equal(replay.user.id, first.user.id); assert.equal(replay.replay, true);
  await rejectsCode(() => service.create(actor, input, "invite-2"), "EMAIL_EXISTS");
});

test("a Cognito-success/database-failure retry recovers the same identity", async () => {
  const repository = new MemoryRepository(); repository.failNextCreate = true;
  const cognito = new MemoryCognito(); const service = new AdminUserService(repository, cognito);
  const input = { name: "Advisor", email: "recover@example.com", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] };
  await assert.rejects(() => service.create(actor, input, "recover-1"), /database unavailable/);
  assert.equal(repository.users.some((item) => item.email === input.email), false);
  const recovered = await service.create(actor, input, "recover-1");
  assert.equal(recovered.user.email, input.email); assert.equal(cognito.identities.size, 1);
});

test("quota, optimistic edits, self/final-admin protection, resend, and archive are enforced", async () => {
  const repository = new MemoryRepository(); const cognito = new MemoryCognito(); const service = new AdminUserService(repository, cognito);
  repository.quota = 1;
  await rejectsCode(() => service.create(actor, { name: "A", email: "quota@example.com", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] }, "quota"), "QUOTA_EXCEEDED");
  repository.quota = 20;
  const invited = (await service.create(actor, { name: "A", email: "a@example.com", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] }, "a")).user;
  await rejectsCode(() => service.update(actor, invited.id, { name: "Changed", roleIds: invited.roleIds, branchIds: invited.branchIds, version: 99 }), "VERSION_CONFLICT");
  await rejectsCode(() => service.update(actor, actor.id, { name: "Admin", roleIds: ["role-advisor"], branchIds: actor.branchIds, version: 1 }), "FINAL_ADMIN_REQUIRED");
  await rejectsCode(() => service.archive(actor, actor.id, "no"), "SELF_ARCHIVE_FORBIDDEN");
  await service.resendInvite(actor, invited.id); assert.deepEqual(cognito.resent, [invited.email]);
  await service.archive(actor, invited.id, "Left business"); assert.deepEqual(cognito.disabled, [invited.email]);
});

test("identity migration adds lifecycle, branch mappings, RLS, and subject-only tenant resolution", async () => {
  const sql = await readFile(new URL("../db/migrations/029_global_user_management.sql", import.meta.url), "utf8");
  for (const column of ["display_name", "status", "cognito_username", "version", "invited_at", "updated_at", "archived_at"]) assert.match(sql, new RegExp(`ADD COLUMN ${column}`, "i"));
  assert.match(sql, /CREATE TABLE workshopos\.membership_branch/i);
  assert.match(sql, /membership_branch ENABLE ROW LEVEL SECURITY/i);
  assert.match(sql, /resolve_membership_tenant\(p_identity_subject text\)/i);
  assert.match(sql, /SECURITY DEFINER/i);
});
