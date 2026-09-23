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

// Calls Frappe's whitelisted `workshop_os.workshopos.api_users.*` controller methods (Task 3),
// not raw `/api/resource/User` writes: the six custom Roles from Task 1 carry no Frappe doctype
// permissions of their own, so those methods self-check the caller holds the `admin` Role and
// perform the write with ignore_permissions=True server-side. See that module's docstring.
async function call<T>(method: string, args?: Record<string, unknown>): Promise<T> {
  const response = await frappeFetch(`/api/method/workshop_os.workshopos.api_users.${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args ?? {}),
  });
  const payload = await response.json().catch(() => ({})) as { message?: T; exc_type?: string };
  if (!response.ok) throw new AdminApiError(payload.exc_type ?? "API_FAILED");
  return payload.message as T;
}

export const adminUsersApi = {
  list: () => call<AdminDirectory>("list_users"),
  create: (input: { name: string; email: string; roleIds: string[]; branchIds: string[] }) =>
    call<{ user: AdminUser }>("create_user", input),
  update: (user: AdminUser) => call<{ user: AdminUser }>("update_user", {
    id: user.id, name: user.name, roleIds: user.roleIds, branchIds: user.branchIds,
  }),
  archive: (id: string, reason: string) => call<{ user: AdminUser }>("archive_user", { id, reason }),
};
