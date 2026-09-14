import { authenticatedFetch, type CognitoConfig } from "./auth";

export type UserStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
export type ManagedRole = { id: string; name: string; permissions: string[] };
export type ManagedBranch = { id: string; name: string };
export type ManagedUser = { id: string; name: string; email: string; status: UserStatus; roleIds: string[]; roles: ManagedRole[]; branchIds: string[]; branches: ManagedBranch[]; version: number; invitedAt?: string; lastInvitedAt?: string; createdAt: string; updatedAt: string };
export type UserQuery = { search: string; status: "" | Exclude<UserStatus, "ARCHIVED">; roleId: string; branchId: string; sort: "updatedAt.desc" | "updatedAt.asc" | "name.asc" | "name.desc" | "email.asc" | "email.desc"; page: number; pageSize: 25 | 50 | 100 };
export const DEFAULT_USER_QUERY: UserQuery = { search: "", status: "", roleId: "", branchId: "", sort: "updatedAt.desc", page: 1, pageSize: 25 };
export type UserDirectory = { users: ManagedUser[]; roles: ManagedRole[]; branches: ManagedBranch[]; page: { page: number; pageSize: number; totalCount: number; pageCount: number }; query: UserQuery };
export type UserExport = { id: string; format: "PDF" | "XLSX"; status: "PENDING" | "READY" | "FAILED"; rowCount?: number };
export type UsersAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };
export type UsersSession = { membership: ManagedUser & { displayName: string; permissions: string[] }; tenant: { id: string; name: string } };

const messages: Record<string, string> = {
  VERSION_CONFLICT: "This user changed since you opened it. Refresh to review the latest version; your intended change is still available.",
  FINAL_ADMIN_REQUIRED: "Another active administrator is required before removing this access.", SELF_ACCESS_FORBIDDEN: "You cannot remove your own administrator access.",
  SELF_ARCHIVE_FORBIDDEN: "You cannot archive your own account.", STATUS_TRANSITION_INVALID: "That status change is not allowed.",
  EMAIL_EXISTS: "A user with that email already exists.", QUOTA_EXCEEDED: "Your tenant user limit has been reached.",
  PERMISSION_DENIED: "You do not have permission to manage tenant users.", INTERNAL_ERROR: "WorkshopOS could not complete the request. Try again.",
};

export class UsersApiError extends Error {
  constructor(readonly code: string, readonly traceId: string) { super(messages[code] ?? messages.INTERNAL_ERROR); this.name = "UsersApiError"; }
}

export function userListSearch(query: UserQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search); if (query.status) params.set("status", query.status);
  if (query.roleId) params.set("roleId", query.roleId); if (query.branchId) params.set("branchId", query.branchId);
  if (query.sort !== DEFAULT_USER_QUERY.sort) params.set("sort", query.sort); if (query.page !== 1) params.set("page", String(query.page));
  if (query.pageSize !== 25) params.set("pageSize", String(query.pageSize)); return params.toString();
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export function createProductionUsersApi(auth: UsersAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers); headers.set("accept", "application/json");
    const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path, { ...init, headers }) : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } });
    const payload = response.headers.get("content-type")?.includes("application/json") ? await response.json() as T & { code?: string; traceId?: string } : {} as T & { code?: string; traceId?: string };
    if (!response.ok) throw new UsersApiError(payload.code ?? "INTERNAL_ERROR", payload.traceId ?? response.headers.get("x-trace-id") ?? "unavailable"); return payload;
  };
  const command = (id: string, suffix: string, input: unknown, key: string = crypto.randomUUID()) => request<{ user: ManagedUser }>(`/api/v1/admin/users/${id}/${suffix}`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(input) }).then((result) => result.user);
  return {
    session: () => request<UsersSession>("/api/v1/session"),
    list: (query = DEFAULT_USER_QUERY) => { const search = userListSearch(query); return request<UserDirectory>(`/api/v1/admin/users${search ? `?${search}` : ""}`); },
    invite: (input: { name: string; email: string; roleIds: string[]; branchIds: string[] }, key = crypto.randomUUID()) => request<{ user: ManagedUser }>("/api/v1/admin/users", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(input) }).then((result) => result.user),
    update: (user: Pick<ManagedUser, "id" | "name" | "roleIds" | "branchIds" | "version">) => request<{ user: ManagedUser }>(`/api/v1/admin/users/${user.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(user) }).then((result) => result.user),
    status: (user: Pick<ManagedUser, "id" | "version">, status: "ACTIVE" | "SUSPENDED", reason: string, key?: string) => command(user.id, "status", { version: user.version, status, reason }, key),
    resend: (user: Pick<ManagedUser, "id" | "version">, key?: string) => command(user.id, "resend-invite", { version: user.version }, key),
    archive: (user: Pick<ManagedUser, "id" | "version">, reason: string, key?: string) => command(user.id, "archive", { version: user.version, reason }, key),
    getPreference: () => request<{ preference: { viewMode: "grid" | "table" } }>("/api/v1/list-preferences/admin-users").then((result) => result.preference),
    savePreference: (viewMode: "grid" | "table") => request<{ preference: { viewMode: "grid" | "table" } }>("/api/v1/list-preferences/admin-users", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ viewMode }) }).then((result) => result.preference),
    requestExport: (format: "PDF" | "XLSX", query: UserQuery, key = crypto.randomUUID()) => request<{ export: UserExport }>("/api/v1/admin/user-exports", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify({ format, query }) }).then((result) => result.export),
    getExport: (id: string) => request<{ export: UserExport }>(`/api/v1/admin/user-exports/${id}`).then((result) => result.export),
    async downloadExport(id: string) {
      const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, `/api/v1/admin/user-exports/${id}/download`) : await fetcher(`/api/v1/admin/user-exports/${id}/download`, { headers: { "x-workshopos-identity": auth.identity } });
      if (!response.ok) throw new UsersApiError("INTERNAL_ERROR", response.headers.get("x-trace-id") ?? "unavailable");
      return { blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "users-export" };
    },
  };
}
