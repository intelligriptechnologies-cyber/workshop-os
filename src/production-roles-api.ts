import { authenticatedFetch, type CognitoConfig } from "./auth";
import type { WorkshopSession } from "./auth";

export type PermissionAction = { key: string; label: string; description: string };
export type PermissionPage = { key: string; label: string; description: string; actions: PermissionAction[] };
export type PermissionGroup = { key: string; label: string; pages: PermissionPage[] };
export type ManagedRole = { id: string; name: string; description: string; permissions: string[]; protected: boolean; active: boolean; version: number; updatedAt: string };
export type RoleDirectory = { roles: ManagedRole[]; catalog: PermissionGroup[] };
export type RolesAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };
export type RoleDraft = Pick<ManagedRole, "name" | "description" | "permissions">;

const messages: Record<string, string> = {
  VERSION_CONFLICT: "This role changed since you opened it. Refresh and review the latest version.",
  PROTECTED_ROLE: "Protected role templates cannot be changed or archived.",
  ROLE_IN_USE: "Remove this role from every user before archiving it.",
  ROLE_NAME_EXISTS: "A role with that name already exists.",
  PERMISSION_DENIED: "You do not have permission to manage roles.",
  PERMISSION_INVALID: "Choose permissions from the current catalog.",
  PAGE_PERMISSION_REQUIRED: "Select the page before selecting one of its actions.",
  INTERNAL_ERROR: "WorkshopOS could not complete the request. Try again.",
};

export class RolesApiError extends Error {
  constructor(readonly code: string, readonly traceId: string) {
    super(messages[code] ?? messages.INTERNAL_ERROR); this.name = "RolesApiError";
  }
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export function createProductionRolesApi(auth: RolesAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers); headers.set("accept", "application/json");
    const response = auth.mode === "cognito"
      ? await authenticatedFetch(auth.config, path, { ...init, headers })
      : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } });
    const payload = response.headers.get("content-type")?.includes("application/json")
      ? await response.json() as T & { code?: string; traceId?: string }
      : {} as T & { code?: string; traceId?: string };
    if (!response.ok) throw new RolesApiError(payload.code ?? "INTERNAL_ERROR", payload.traceId ?? response.headers.get("x-trace-id") ?? "unavailable");
    return payload;
  };
  return {
    session: () => request<WorkshopSession>("/api/v1/session"),
    list: (search = "") => request<RoleDirectory>(`/api/v1/admin/roles${search ? `?${new URLSearchParams({ search })}` : ""}`),
    create: (input: RoleDraft, key = crypto.randomUUID()) => request<{ role: ManagedRole }>("/api/v1/admin/roles", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(input),
    }).then((result) => result.role),
    update: (role: RoleDraft & Pick<ManagedRole, "id" | "version">) => request<{ role: ManagedRole }>(`/api/v1/admin/roles/${role.id}`, {
      method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(role),
    }).then((result) => result.role),
    archive: (role: Pick<ManagedRole, "id" | "version">, reason: string, key = crypto.randomUUID()) => request<{ role: ManagedRole }>(`/api/v1/admin/roles/${role.id}/archive`, {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify({ version: role.version, reason }),
    }).then((result) => result.role),
  };
}
