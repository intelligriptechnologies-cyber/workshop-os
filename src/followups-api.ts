import { authenticatedFetch, type CognitoConfig } from "./auth";

export type RemoteFollowup = {
  id: number; jobId: number; branchId: string; jobNo: string; customerName: string; vehicleNo: string;
  note: string; dueAt: string | null; status: "OPEN" | "COMPLETED"; outcome: string;
  completedAt: string | null; archivedAt: string | null; archiveReason: string | null; version: number;
  createdAt: string; updatedAt: string;
};
export type FollowupJob = { id: number; branchId: string; jobNo: string; status: string; customerName: string; vehicleNo: string };
export type SearchResult = { entity: "customer" | "vehicle" | "job" | "invoice"; id: number; branchId: string; title: string; subtitle: string; rank: number };

export class FollowupsApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new FollowupsApiError(body.code ?? body.detail?.code ?? "FOLLOWUPS_API_FAILED");
  }
  return response.json() as Promise<T>;
}

const json = (method: "POST" | "PUT", body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const followupsApi = {
  list: (config: CognitoConfig, options: { archived?: boolean; jobId?: number } = {}) => request<RemoteFollowup[]>(config, `/api/v1/follow-ups?archived=${options.archived ? "true" : "false"}${options.jobId ? `&jobId=${options.jobId}` : ""}`),
  jobs: (config: CognitoConfig) => request<FollowupJob[]>(config, "/api/v1/follow-ups/jobs"),
  create: (config: CognitoConfig, input: { jobId: number; note: string; dueAt?: string }) => request<RemoteFollowup>(config, "/api/v1/follow-ups", json("POST", input)),
  update: (config: CognitoConfig, id: number, input: { note: string; dueAt?: string; outcome?: string }) => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}`, json("PUT", input)),
  complete: (config: CognitoConfig, id: number, outcome = "") => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}/commands/complete`, json("POST", { outcome })),
  archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}/archive`, json("POST", { reason })),
  search: (config: CognitoConfig, q: string) => request<{ query: string; results: SearchResult[] }>(config, `/api/v1/search?q=${encodeURIComponent(q)}`),
};
