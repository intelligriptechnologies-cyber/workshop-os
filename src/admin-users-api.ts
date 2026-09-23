import { frappeFetch } from "./auth";

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

// NOTE: these `/api/v1/admin/users*` paths are the old Cognito-era backend and do not exist on
// the Frappe site yet. Task 3 rewrites this module's endpoints against Frappe; this task only
// keeps the transport (frappeFetch, session-cookie based, no per-call config) compiling.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await frappeFetch(path, init);
  const payload = await response.json() as T & { code?: string };
  if (!response.ok) throw new AdminApiError(payload.code ?? "API_FAILED");
  return payload;
}

export const adminUsersApi = {
  list: () => request<AdminDirectory>("/api/v1/admin/users"),
  create: (input: { name: string; email: string; roleIds: string[]; branchIds: string[] }) =>
    request<{ user: AdminUser }>("/api/v1/admin/users", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify(input),
    }),
  update: (user: AdminUser) => request<{ user: AdminUser }>(`/api/v1/admin/users/${user.id}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: user.name, roleIds: user.roleIds, branchIds: user.branchIds, version: user.version }),
  }),
  archive: (id: string, reason: string) => request<{ user: AdminUser }>(`/api/v1/admin/users/${id}/archive`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason }),
  }),
  resend: (id: string) => request<{ user: AdminUser }>(`/api/v1/admin/users/${id}/resend-invite`, { method: "POST" }),
};
