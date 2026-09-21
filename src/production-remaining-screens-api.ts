import { authenticatedFetch, type CognitoConfig } from "./auth";
import { workItemListSearch, type WorkItemListQuery, type ListPreference, type WorkItemExport } from "./work-items-api";
import type { RemainingScreenKey, RemainingScreenRow } from "../production/src/remaining-screens";

export type RemainingAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export class RemainingScreenApiError extends Error { constructor(readonly code: string, readonly traceId: string) { super(code === "VERSION_CONFLICT" ? "This record changed. Refresh and try again." : code === "PERMISSION_DENIED" ? "You do not have permission for this action." : "WorkshopOS could not complete this request."); } }

export function createRemainingScreensApi(auth: RemainingAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers); headers.set("accept", "application/json");
    const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path, { ...init, headers }) : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } });
    const json = response.headers.get("content-type")?.includes("json") ? await response.json() as any : {};
    if (!response.ok) throw new RemainingScreenApiError(json.code ?? "INTERNAL_ERROR", json.traceId ?? response.headers.get("x-trace-id") ?? "unavailable");
    return json as T;
  };
  const download = async (path: string) => { const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path) : await fetcher(path, { headers: { "x-workshopos-identity": auth.identity } }); if (!response.ok) throw new RemainingScreenApiError("DOWNLOAD_FAILED", response.headers.get("x-trace-id") ?? "unavailable"); return { blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "workshopos-export" }; };
  return {
    session: () => request<any>("/api/v1/session"),
    list: (screen: RemainingScreenKey, query: WorkItemListQuery) => request<{ rows: RemainingScreenRow[]; page: { page: number; pageSize: number; totalCount: number; pageCount: number }; query: WorkItemListQuery }>(`/api/v1/operations/${screen}?${workItemListSearch(query)}`),
    getPreference: async (screen: RemainingScreenKey) => (await request<{ preference: ListPreference }>(`/api/v1/list-preferences/${screen}`)).preference,
    savePreference: async (screen: RemainingScreenKey, viewMode: ListPreference["viewMode"]) => (await request<{ preference: ListPreference }>(`/api/v1/list-preferences/${screen}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ viewMode }) })).preference,
    complete: (screen: "follow-ups" | "action-inbox", row: RemainingScreenRow, reason: string) => request<{ row: RemainingScreenRow }>(`/api/v1/operations/${screen}/${row.id}/complete`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ version: row.version, reason }) }),
    requestExport: async (screen: RemainingScreenKey, format: WorkItemExport["format"], query: WorkItemListQuery) => (await request<{ export: WorkItemExport }>("/api/v1/operation-exports", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ screen, format, query }) })).export,
    getExport: async (id: string) => (await request<{ export: WorkItemExport }>(`/api/v1/operation-exports/${id}`)).export,
    downloadExport: (id: string) => download(`/api/v1/operation-exports/${id}/download`),
  };
}
