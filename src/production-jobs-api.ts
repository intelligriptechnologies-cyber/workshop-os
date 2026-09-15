import { authenticatedFetch, type CognitoConfig } from "./auth";
import type { JobListQuery } from "../production/src/job-list-contract";
export type JobDocument = {
  id: string;
  type: "ESTIMATE" | "INVOICE" | "RECEIPT" | "GATE_PASS";
  label: string;
};
export type Job = {
  id: string;
  branchId: string;
  jobNumber: string;
  visitDate: string;
  checkedInAt: string;
  customerName: string;
  registration: string;
  vehicleDescription: string;
  customerRequest: string;
  promisedHandoffAt: string;
  stage: string;
  statusLabel: string;
  version: number;
  updatedAt: string;
  documents: JobDocument[];
  settingsSnapshotCaptured: boolean;
};
export type JobLifecycle = {
  canonicalStage: string;
  canonicalStageLabel: string;
  displayStage: string;
  held: boolean;
  archived: boolean;
  version: number;
  resumeStage?: string;
  branchId: string;
  facts: {
    estimateApproved: boolean;
    workAccepted: boolean;
    paymentCleared: boolean;
  };
  validActions: Array<{
    command: string;
    label: string;
    targetStage?: string;
    reasonRequired: boolean;
    blockers: Array<{ code: string; message: string; resolution: string }>;
  }>;
  history: Array<{
    kind: string;
    label: string;
    at: string;
    actor: string;
    reason?: string;
    auditReference: string;
  }>;
};
export type JobDataFlow = {
  selectedJob: {
    id: string;
    jobNumber: string;
    visitId: string;
    customerName: string;
    registration: string;
  };
  lifecycle: JobLifecycle;
  sections: Array<{
    key: string;
    label: string;
    summary: string;
    recordCount: number;
    relevance: string;
  }>;
};
export type JobAuth =
  | { mode: "cognito"; config: CognitoConfig }
  | { mode: "local"; identity: string };
type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
export class JobApiError extends Error {
  constructor(
    readonly code: string,
    readonly traceId: string,
  ) {
    super(
      code === "PERMISSION_DENIED"
        ? "You do not have permission for this Job action."
        : code === "JOB_NOT_FOUND"
          ? "That Job is not available in your permitted branches."
          : code === "VERSION_CONFLICT"
            ? "This Job changed since you opened it. Refresh and review its valid actions."
            : code === "LIFECYCLE_BLOCKED"
              ? "Resolve the projected Job blockers before trying this action."
              : code === "LIFECYCLE_COMMAND_INVALID"
                ? "That action is no longer valid for this Job. Refresh and review the available actions."
                : "WorkshopOS could not complete the Job request.",
    );
  }
}
export function jobListSearch(q: JobListQuery) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q))
    if (
      v !== "" &&
      !(k === "page" && v === 1) &&
      !(k === "pageSize" && v === 25) &&
      !(k === "sort" && v === "visitDate.desc")
    )
      p.set(k, String(v));
  return p.toString();
}
export function createJobsApi(auth: JobAuth, fetcher: Fetcher = fetch) {
  const request = async <T>(path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    const response =
      auth.mode === "cognito"
        ? await authenticatedFetch(auth.config, path, { ...init, headers })
        : await fetcher(path, {
            ...init,
            headers: {
              ...Object.fromEntries(headers),
              "x-workshopos-identity": auth.identity,
            },
          });
    const value = response.headers.get("content-type")?.includes("json")
      ? ((await response.json()) as any)
      : {};
    if (!response.ok)
      throw new JobApiError(
        value.code ?? "INTERNAL_ERROR",
        value.traceId ?? response.headers.get("x-trace-id") ?? "unavailable",
      );
    return value as T;
  };
  const download = async (path: string, fallback: string) => {
    const response =
      auth.mode === "cognito"
        ? await authenticatedFetch(auth.config, path, {
            headers: { accept: "application/pdf" },
          })
        : await fetcher(path, {
            headers: {
              accept: "application/pdf",
              "x-workshopos-identity": auth.identity,
            },
          });
    if (!response.ok) {
      const value = response.headers.get("content-type")?.includes("json")
        ? ((await response.json()) as { code?: string; traceId?: string })
        : {};
      throw new JobApiError(
        value.code ?? "INTERNAL_ERROR",
        value.traceId ?? response.headers.get("x-trace-id") ?? "unavailable",
      );
    }
    return {
      blob: await response.blob(),
      filename:
        response.headers
          .get("content-disposition")
          ?.match(/filename="([^"]+)"/)?.[1] ?? fallback,
    };
  };
  const write = <T>(path: string, value: unknown, key?: string) =>
    request<T>(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(key ? { "idempotency-key": key } : {}),
      },
      body: JSON.stringify(value),
    });
  return {
    session: () => request<any>("/api/v1/session"),
    list: (q: JobListQuery) =>
      request<{
        jobs: Job[];
        page: any;
        query: JobListQuery;
        timezone: string;
      }>(`/api/v1/jobs?${jobListSearch(q)}`.replace(/\?$/, "")),
    get: async (id: string) =>
      (await request<{ job: Job }>(`/api/v1/jobs/${id}`)).job,
    lifecycle: async (id: string) =>
      (
        await request<{ lifecycle: JobLifecycle }>(
          `/api/v1/jobs/${id}/lifecycle`,
        )
      ).lifecycle,
    commandLifecycle: async (
      id: string,
      input: {
        command: string;
        version: number;
        reason: string;
        evidence?: Record<string, unknown>;
      },
    ) =>
      await write<{ lifecycle: JobLifecycle; auditReference: string }>(
        `/api/v1/jobs/${id}/lifecycle`,
        input,
        crypto.randomUUID(),
      ),
    dataFlow: async (id: string) =>
      (await request<{ dataFlow: JobDataFlow }>(`/api/v1/jobs/${id}/data-flow`))
        .dataFlow,
    dataFlowJobs: async (search = "") =>
      (
        await request<{
          jobs: Array<{
            id: string;
            jobNumber: string;
            checkedInAt: string;
            customerName: string;
            registration: string;
          }>;
        }>(
          `/api/v1/job-data-flow/jobs${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`,
        )
      ).jobs,
    getPreference: async () =>
      (
        await request<{ preference: { viewMode: "grid" | "table" } }>(
          "/api/v1/list-preferences/jobs",
        )
      ).preference,
    savePreference: (viewMode: "grid" | "table") =>
      request("/api/v1/list-preferences/jobs", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ viewMode }),
      }),
    jobCard: (id: string) =>
      download(`/api/v1/jobs/${id}/job-card`, "job-card.pdf"),
    document: (id: string) =>
      download(`/api/v1/job-documents/${id}/download`, "job-document.pdf"),
    requestExport: async (format: "PDF" | "XLSX", query: JobListQuery) =>
      (
        await write<{ export: any }>(
          "/api/v1/job-exports",
          { format, query },
          crypto.randomUUID(),
        )
      ).export,
    getExport: async (id: string) =>
      (await request<{ export: any }>(`/api/v1/job-exports/${id}`)).export,
    downloadExport: (id: string) =>
      download(`/api/v1/job-exports/${id}/download`, "jobs-export"),
  };
}
