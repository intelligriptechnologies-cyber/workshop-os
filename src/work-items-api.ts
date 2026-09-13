import { authenticatedFetch, type CognitoConfig } from "./auth";

export type WorkItem = {
  id: string;
  tenantId: string;
  branchId: string;
  summary: string;
  version: number;
};

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
    async list() {
      return (await request<{ workItems: WorkItem[] }>("/api/v1/work-items")).workItems;
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
  };
}
