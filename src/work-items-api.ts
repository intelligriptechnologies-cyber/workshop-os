import { authenticatedFetch, type CognitoConfig } from "./auth";

export type WorkItem = {
  id: string;
  tenantId: string;
  branchId: string;
  summary: string;
  version: number;
  updatedAt?: string;
};

export type WorkItemListQuery = { search: string; branchId: string; sort: "updatedAt.desc" | "updatedAt.asc" | "summary.asc" | "summary.desc"; page: number; pageSize: 25 | 50 | 100 };
export type WorkItemListResult = { workItems: WorkItem[]; page: { page: number; pageSize: number; totalCount: number; pageCount: number }; query: WorkItemListQuery };
export type ListPreference = { viewMode: "grid" | "table"; version: number };
export type WorkItemExport = { id: string; screenKey: string; format: "PDF" | "XLSX"; status: "PENDING" | "READY" | "FAILED"; rowCount?: number; filename?: string; mimeType?: string };

export const DEFAULT_WORK_ITEM_LIST_QUERY: WorkItemListQuery = { search: "", branchId: "", sort: "updatedAt.desc", page: 1, pageSize: 25 };

export function workItemListSearch(query: WorkItemListQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.branchId) params.set("branchId", query.branchId);
  if (query.sort !== DEFAULT_WORK_ITEM_LIST_QUERY.sort) params.set("sort", query.sort);
  if (query.page !== 1) params.set("page", String(query.page));
  if (query.pageSize !== 25) params.set("pageSize", String(query.pageSize));
  return params.toString();
}

export type WorkItemAuth =
  | { mode: "cognito"; config: CognitoConfig }
  | { mode: "local"; identity: string };

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const fallbackMessages: Record<string, string> = {
  AUTHENTICATION_REQUIRED: "Your session has expired. Sign in and try again.",
  BRANCH_FORBIDDEN: "You do not have access to that branch.",
  IDEMPOTENCY_KEY_REQUIRED: "The request could not be retried safely. Try again.",
  IDEMPOTENCY_KEY_REUSED: "This retry belongs to a different change. Try again.",
  SUMMARY_REQUIRED: "Enter a work item summary.",
  REASON_REQUIRED: "Enter a reason for this command.",
  VERSION_CONFLICT: "This work item changed since you opened it. Refresh and try again.",
  EXPORT_NOT_READY: "The export is still being prepared. Try again shortly.",
  EXPORT_NOT_FOUND: "The export was not found or is no longer available.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  WORK_ITEM_NOT_FOUND: "The work item was not found or is no longer available.",
  NOT_FOUND: "The work item was not found or is no longer available.",
  INTERNAL_ERROR: "WorkshopOS could not complete the request. Try again.",
};

export class WorkItemsApiError extends Error {
  constructor(readonly code: string, readonly traceId: string, message?: string) {
    super(message ?? fallbackMessages[code] ?? fallbackMessages.INTERNAL_ERROR);
    this.name = "WorkItemsApiError";
  }
}

async function parse<T>(response: Response): Promise<T> {
  const payload = response.headers.get("content-type")?.includes("application/json")
    ? await response.json() as T & { code?: string; message?: string; traceId?: string }
    : {} as T & { code?: string; message?: string; traceId?: string };
  if (!response.ok) {
    const code = payload.code ?? "INTERNAL_ERROR";
    const traceId = payload.traceId ?? response.headers.get("x-trace-id") ?? "unavailable";
    throw new WorkItemsApiError(code, traceId, fallbackMessages[code]);
  }
  return payload;
}

export function createWorkItemsApi(auth: WorkItemAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    const response = auth.mode === "cognito"
      ? await authenticatedFetch(auth.config, path, { ...init, headers })
      : await fetcher(path, { ...init, headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } });
    return parse<T>(response);
  };

  return {
    async list(query: WorkItemListQuery = DEFAULT_WORK_ITEM_LIST_QUERY) {
      const search = workItemListSearch(query);
      const result = await request<Partial<WorkItemListResult> & { workItems: WorkItem[] }>(`/api/v1/work-items${search ? `?${search}` : ""}`);
      return { workItems: result.workItems, query: result.query ?? query, page: result.page ?? { page: query.page, pageSize: query.pageSize, totalCount: result.workItems.length, pageCount: 1 } };
    },
    async create(input: { branchId: string; summary: string }, idempotencyKey: string = crypto.randomUUID()) {
      return (await request<{ workItem: WorkItem }>("/api/v1/work-items", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
        body: JSON.stringify(input),
      })).workItem;
    },
    async update(input: Pick<WorkItem, "id" | "summary" | "version">) {
      return (await request<{ workItem: WorkItem }>(`/api/v1/work-items/${input.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ summary: input.summary, version: input.version }),
      })).workItem;
    },
    async archive(input: Pick<WorkItem, "id" | "version"> & { reason: string }, idempotencyKey: string = crypto.randomUUID()) {
      return (await request<{ workItem: WorkItem }>(`/api/v1/work-items/${input.id}/archive`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
        body: JSON.stringify({ version: input.version, reason: input.reason }),
      })).workItem;
    },
    async getPreference() {
      return (await request<{ preference: ListPreference }>("/api/v1/list-preferences/work-items")).preference;
    },
    async savePreference(viewMode: ListPreference["viewMode"]) {
      return (await request<{ preference: ListPreference }>("/api/v1/list-preferences/work-items", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ viewMode }) })).preference;
    },
    async requestExport(format: WorkItemExport["format"], query: WorkItemListQuery, idempotencyKey: string = crypto.randomUUID()) {
      return (await request<{ export: WorkItemExport }>("/api/v1/work-item-exports", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": idempotencyKey }, body: JSON.stringify({ format, query }) })).export;
    },
    async getExport(id: string) { return (await request<{ export: WorkItemExport }>(`/api/v1/work-item-exports/${id}`)).export; },
    async downloadExport(id: string) {
      const headers = new Headers({ accept: "application/octet-stream" });
      const response = auth.mode === "cognito" ? await authenticatedFetch(auth.config, `/api/v1/work-item-exports/${id}/download`, { headers }) : await fetcher(`/api/v1/work-item-exports/${id}/download`, { headers: { ...Object.fromEntries(headers), "x-workshopos-identity": auth.identity } });
      if (!response.ok) return parse<never>(response);
      return { blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "work-items-export" };
    },
  };
}
