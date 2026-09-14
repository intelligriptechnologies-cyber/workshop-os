import { authenticatedFetch, type CognitoConfig, type WorkshopSession } from "./auth";

export type BusinessSettings = { defaultLaborRateMinor: number; defaultJobDurationMinutes: number; customerUpdatesEnabled: boolean; invoiceFooter: string };
export type SettingsWorkspace = {
  scope: { kind: "TENANT" } | { kind: "BRANCH"; branchId: string; branchName: string };
  draftVersion: number; publishedVersion: number; inherited: BusinessSettings; overrides: Partial<BusinessSettings>;
  effective: BusinessSettings; updatedAt: string;
};
export type SettingsAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };

const messages: Record<string, string> = {
  VERSION_CONFLICT: "These settings changed since you opened them. Refresh and review the current draft.",
  SETTINGS_INVALID: "Correct the highlighted settings before saving.",
  BRANCH_FORBIDDEN: "You cannot manage settings for that branch.",
  PERMISSION_DENIED: "You do not have permission to manage Business Settings.",
  INTERNAL_ERROR: "WorkshopOS could not complete the request. Try again.",
};
export class SettingsApiError extends Error {
  constructor(readonly code: string, readonly traceId: string) { super(messages[code] ?? messages.INTERNAL_ERROR); this.name = "SettingsApiError"; }
}
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export function createProductionBusinessSettingsApi(auth: SettingsAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers); headers.set("accept", "application/json");
    const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path, { ...init, headers })
      : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } });
    const payload = response.headers.get("content-type")?.includes("application/json") ? await response.json() as T & { code?: string; traceId?: string } : {} as T & { code?: string; traceId?: string };
    if (!response.ok) throw new SettingsApiError(payload.code ?? "INTERNAL_ERROR", payload.traceId ?? response.headers.get("x-trace-id") ?? "unavailable");
    return payload;
  };
  return {
    session: () => request<WorkshopSession>("/api/v1/session"),
    get: (branchId?: string) => request<SettingsWorkspace>(`/api/v1/admin/business-settings${branchId ? `?${new URLSearchParams({ branchId })}` : ""}`),
    save: (workspace: SettingsWorkspace, values: Partial<BusinessSettings>) => request<SettingsWorkspace>("/api/v1/admin/business-settings", {
      method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ branchId: workspace.scope.kind === "BRANCH" ? workspace.scope.branchId : undefined, version: workspace.draftVersion, values }),
    }),
    publish: (workspace: SettingsWorkspace, key = crypto.randomUUID()) => request<SettingsWorkspace>("/api/v1/admin/business-settings/publish", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify({ branchId: workspace.scope.kind === "BRANCH" ? workspace.scope.branchId : undefined, version: workspace.draftVersion }),
    }),
  };
}
