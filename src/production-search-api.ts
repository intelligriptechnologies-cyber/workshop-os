import { authenticatedFetch, type CognitoConfig, type WorkshopSession } from "./auth";

export type SearchAuth = { mode: "cognito"; config: CognitoConfig } | { mode: "local"; identity: string };
export type SearchRecord = { kind: "work-item" | "tenant-user"; id: string; label: string };
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export function createProductionSearchApi(auth: SearchAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string) => {
    const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, path) : await fetcher(path, { headers: { "x-workshopos-identity": auth.identity, accept: "application/json" } });
    const payload = await response.json() as T & { message?: string; traceId?: string };
    if (!response.ok) throw new Error(`${payload.message ?? "Search could not be completed."} Reference: ${payload.traceId ?? "unavailable"}`);
    return payload;
  };
  return {
    session: () => request<WorkshopSession>("/api/v1/session"),
    search: (query: string) => request<{ records: SearchRecord[] }>(`/api/v1/search?${new URLSearchParams({ query })}`),
  };
}
