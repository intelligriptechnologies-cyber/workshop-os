import { authenticatedFetch, type CognitoConfig } from "./auth";

export type RemoteEstimateLine = { id?: number; kind: string; description: string; quantity: number; rate: number; gstRate: number };
export type RemoteEstimate = { id: number; jobId: number; revision: number; status: "DRAFT" | "APPROVED" | "DECLINED"; discount: number; gstRate: number; note: string; supersededAt: string | null; approvedSnapshot: unknown; createdAt: string; updatedAt: string; lines: RemoteEstimateLine[] };
export type RemoteJob = { id: number; jobNo: string; visitId: number; branchId: string; advisorId: string | null; status: string; workList: string; promisedAt: string | null; createdAt: string; updatedAt: string; estimates: RemoteEstimate[]; events: Array<{ id: number; command: string; fromStatus: string; toStatus: string; reason: string; requestKey: string | null; at: string }> };

export class JobsApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new JobsApiError(body.code ?? body.detail?.code ?? "JOBS_API_FAILED");
  }
  return response.json() as Promise<T>;
}

const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const jobsApi = {
  list: (config: CognitoConfig) => request<RemoteJob[]>(config, "/api/v1/jobs"),
  create: (config: CognitoConfig, input: { visitId: number; workList?: string }) => request<RemoteJob>(config, "/api/v1/jobs", json(input)),
  createEstimate: (config: CognitoConfig, jobId: number, input: { discount?: number; gstRate?: number; note?: string; lines: RemoteEstimateLine[] }) => request<RemoteEstimate>(config, `/api/v1/jobs/${jobId}/estimates`, json(input)),
  decideEstimate: (config: CognitoConfig, estimateId: number, input: { outcome: "approved" | "declined"; channel: "in_person" | "phone" | "whatsapp" | "email" | "other"; decidedAt: string; note?: string }) => request<{ estimate: RemoteEstimate }>(config, `/api/v1/estimates/${estimateId}/decision`, json(input)),
  command: (config: CognitoConfig, jobId: number, command: "start-work" | "hold-job" | "resume-work" | "cancel-job" | "start-rework" | "complete-work", reason = "") => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/commands/${command}`, json({ reason })),
};
