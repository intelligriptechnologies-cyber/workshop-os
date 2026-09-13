import { authenticatedFetch, type CognitoConfig } from "./auth";

export type AdminRole = { id: string; name: string; permissions: string[] };
export type AdminBranch = { id: string; name: string };
export type AdminUser = {
  id: string; name: string; email: string; status: "INVITED" | "ACTIVE" | "ARCHIVED";
  roleIds: string[]; roles: AdminRole[]; branchIds: string[]; branches: AdminBranch[];
  version: number; invitedAt?: string; lastInvitedAt?: string; createdAt: string; updatedAt: string;
};
export type AdminDirectory = { users: AdminUser[]; roles: AdminRole[]; branches: AdminBranch[] };

export class AdminApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  const payload = await response.json() as T & { code?: string };
  if (!response.ok) throw new AdminApiError(payload.code ?? "API_FAILED");
  return payload;
}

export const adminUsersApi = {
  list: (config: CognitoConfig) => request<AdminDirectory>(config, "/api/v1/admin/users"),
  create: (config: CognitoConfig, input: { name: string; email: string; roleIds: string[]; branchIds: string[] }) =>
    request<{ user: AdminUser }>(config, "/api/v1/admin/users", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify(input),
    }),
  update: (config: CognitoConfig, user: AdminUser) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${user.id}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: user.name, roleIds: user.roleIds, branchIds: user.branchIds, version: user.version }),
  }),
  archive: (config: CognitoConfig, id: string, reason: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/archive`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason }),
  }),
  resend: (config: CognitoConfig, id: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/resend-invite`, { method: "POST" }),
};
