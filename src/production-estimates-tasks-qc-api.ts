import { authenticatedFetch, type CognitoConfig } from "./auth";
export type OpsAuth =
  | { mode: "local"; identity: string }
  | { mode: "cognito"; config: CognitoConfig };
export class OpsApiError extends Error {
  constructor(
    readonly code: string,
    readonly traceId: string,
  ) {
    super(
      code === "VERSION_CONFLICT"
        ? "This record changed. Refresh and try again."
        : code === "PERMISSION_DENIED"
          ? "You do not have permission for this action."
          : code.replaceAll("_", " ").toLocaleLowerCase(),
    );
  }
}
export function createOperationalApi(
  auth: OpsAuth,
  fetcher: typeof fetch = fetch,
) {
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
    if (!response.ok) {
      const value = response.headers.get("content-type")?.includes("json")
        ? ((await response.json()) as any)
        : {};
      throw new OpsApiError(
        value.code ?? "INTERNAL_ERROR",
        value.traceId ?? response.headers.get("x-trace-id") ?? "unavailable",
      );
    }
    return (await response.json()) as T;
  };
  const post = <T>(path: string, value: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": crypto.randomUUID(),
      },
      body: JSON.stringify(value),
    });
  const download = async (id: string) => {
    const response =
      auth.mode === "cognito"
        ? await authenticatedFetch(
            auth.config,
            `/api/v1/estimates/${id}/document`,
          )
        : await fetcher(`/api/v1/estimates/${id}/document`, {
            headers: { "x-workshopos-identity": auth.identity },
          });
    if (!response.ok)
      throw new OpsApiError(
        "DOWNLOAD_FAILED",
        response.headers.get("x-trace-id") ?? "unavailable",
      );
    return {
      blob: await response.blob(),
      filename:
        response.headers
          .get("content-disposition")
          ?.match(/filename="([^"]+)"/)?.[1] ?? "estimate.pdf",
    };
  };
  return {
    session: () => request<any>("/api/v1/session"),
    estimates: (search = "", branchId = "") =>
      request<any>(
        `/api/v1/estimates?search=${encodeURIComponent(search)}&branchId=${encodeURIComponent(branchId)}`,
      ),
    createEstimate: (input: any) => post<any>("/api/v1/estimates", input),
    updateEstimate: (id: string, input: any) =>
      post<any>(`/api/v1/estimates/${id}/draft`, input),
    submitEstimate: (id: string, input: any) =>
      post<any>(`/api/v1/estimates/${id}/submit`, input),
    approveEstimate: (id: string, input: any) =>
      post<any>(`/api/v1/estimates/${id}/approve`, input),
    downloadEstimate: download,
    tasks: () => request<any>("/api/v1/tasks"),
    task: (id: string, action: string, input: any) =>
      post<any>(`/api/v1/tasks/${id}/${action.toLocaleLowerCase()}`, input),
    qc: () => request<any>("/api/v1/qc"),
    inspect: (id: string, input: any) =>
      post<any>(`/api/v1/tasks/${id}/qc-inspections`, input),
    rework: (
      id: string,
      action: "assign" | "completion" | "reinspection",
      input: any,
    ) => post<any>(`/api/v1/reworks/${id}/${action}`, input),
  };
}
