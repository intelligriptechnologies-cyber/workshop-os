import { authenticatedFetch, type CognitoConfig } from "./auth";
import type {
  JobMediaRecord,
  MediaCategory,
  MediaListQuery,
} from "../production/src/job-media";

export type MediaAuth =
  | { mode: "cognito"; config: CognitoConfig }
  | { mode: "local"; identity: string };
export type MediaJobOption = {
  id: string;
  branchId: string;
  jobNumber: string;
  visitDate: string;
  customerName: string;
  registration: string;
  stage: string;
  allowedCategories: MediaCategory[];
};
export class MediaApiError extends Error {
  constructor(
    readonly code: string,
    readonly traceId: string,
    message?: string,
  ) {
    super(message ?? "WorkshopOS could not complete the Media request.");
  }
}

export function mediaSearch(query: MediaListQuery) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (
      value !== "" &&
      value !== false &&
      !(key === "page" && value === 1) &&
      !(key === "pageSize" && value === 25)
    )
      params.set(key, String(value));
  }
  return params.toString();
}

export function createMediaApi(auth: MediaAuth, fetcher: typeof fetch = fetch) {
  const base64 = async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 32768)
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
    return btoa(binary);
  };
  const request = async <T>(url: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    const response =
      auth.mode === "cognito"
        ? await authenticatedFetch(auth.config, url, { ...init, headers })
        : await fetcher(url, {
            ...init,
            headers: {
              ...Object.fromEntries(headers),
              "x-workshopos-identity": auth.identity,
            },
          });
    const json = response.headers.get("content-type")?.includes("json")
      ? ((await response.json()) as any)
      : {};
    if (!response.ok)
      throw new MediaApiError(
        json.code ?? "INTERNAL_ERROR",
        json.traceId ?? response.headers.get("x-trace-id") ?? "unavailable",
        json.message,
      );
    return json as T;
  };
  const download = async (id: string, mode: "view" | "download") => {
    const response =
      auth.mode === "cognito"
        ? await authenticatedFetch(auth.config, `/api/v1/media/${id}/${mode}`)
        : await fetcher(`/api/v1/media/${id}/${mode}`, {
            headers: { "x-workshopos-identity": auth.identity },
          });
    if (!response.ok) {
      const json = response.headers.get("content-type")?.includes("json")
        ? ((await response.json()) as any)
        : {};
      throw new MediaApiError(
        json.code ?? "INTERNAL_ERROR",
        json.traceId ?? "unavailable",
        json.message,
      );
    }
    return {
      blob: await response.blob(),
      filename:
        response.headers
          .get("content-disposition")
          ?.match(/filename="([^"]+)"/)?.[1] ?? "job-media",
    };
  };
  return {
    session: () => request<any>("/api/v1/session"),
    list: (query: MediaListQuery) =>
      request<{
        media: JobMediaRecord[];
        page: any;
        query: MediaListQuery;
        timezone: string;
      }>(`/api/v1/media?${mediaSearch(query)}`.replace(/\?$/, "")),
    jobs: (visitDate: string, search: string, branchId = "") =>
      request<{ jobs: MediaJobOption[]; timezone: string }>(
        `/api/v1/media/jobs?${new URLSearchParams({ visitDate, search, ...(branchId ? { branchId } : {}) })}`,
      ),
    upload: async (input: {
      job: MediaJobOption;
      category: MediaCategory;
      label: string;
      file: File;
    }) => {
      const contentBase64 = await base64(input.file);
      return (
        await request<{ media: JobMediaRecord }>("/api/v1/media", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "idempotency-key": crypto.randomUUID(),
          },
          body: JSON.stringify({
            jobId: input.job.id,
            branchId: input.job.branchId,
            category: input.category,
            label: input.label,
            fileName: input.file.name,
            mimeType: input.file.type,
            contentBase64,
          }),
        })
      ).media;
    },
    archive: (id: string, version: number, reason: string) =>
      request(`/api/v1/media/${id}/archive`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": crypto.randomUUID(),
        },
        body: JSON.stringify({ version, reason }),
      }),
    view: (id: string) => download(id, "view"),
    download: (id: string) => download(id, "download"),
  };
}
