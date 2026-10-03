import { authenticatedFetch, type CognitoConfig } from "./auth";

export type RemoteEstimateLine = { id?: number; kind: string; description: string; quantity: number; rate: number; gstRate: number };
export type RemoteEstimate = { id: number; jobId: number; revision: number; status: "DRAFT" | "APPROVED" | "DECLINED"; discount: number; gstRate: number; note: string; supersededAt: string | null; approvedSnapshot: unknown; createdAt: string; updatedAt: string; lines: RemoteEstimateLine[] };
export type RemoteAssignmentHistory = { id: number; action: "ROUTED_TO_MANAGER" | "ADVISOR_ASSIGNED" | "MANAGER_TRANSFERRED"; reason: string; at: string; actorId: string; departmentId: string | null; departmentName: string | null; managerId: string | null; managerName: string | null; advisorId: string | null; advisorName: string | null };
export type RemoteJob = { id: number; jobNo: string; visitId: number; branchId: string; departmentId: string | null; responsibleManagerId: string | null; advisorId: string | null; assignmentState: "LEGACY" | "AWAITING_ADVISOR_ASSIGNMENT" | "ASSIGNED_TO_ADVISOR"; department: { id: string; name: string } | null; responsibleManager: { id: string; name: string } | null; advisor: { id: string; name: string } | null; assignmentHistory: RemoteAssignmentHistory[]; status: string; workList: string; promisedAt: string | null; createdAt: string; updatedAt: string; estimates: RemoteEstimate[]; events: Array<{ id: number; command: string; fromStatus: string; toStatus: string; reason: string; requestKey: string | null; at: string }> };

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
  create: (config: CognitoConfig, input: { visitId: number; departmentId: string; responsibleManagerId: string; workList?: string; promisedAt?: string }) => request<RemoteJob>(config, "/api/v1/jobs", json(input)),
  assignAdvisor: (config: CognitoConfig, jobId: number, input: { advisorId: string; reason?: string }) => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/advisor`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
  transferManager: (config: CognitoConfig, jobId: number, input: { departmentId: string; responsibleManagerId: string; reason?: string }) => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/manager`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
  createEstimate: (config: CognitoConfig, jobId: number, input: { discount?: number; gstRate?: number; note?: string; lines: RemoteEstimateLine[] }) => request<RemoteEstimate>(config, `/api/v1/jobs/${jobId}/estimates`, json(input)),
  decideEstimate: (config: CognitoConfig, estimateId: number, input: { outcome: "approved" | "declined"; channel: "in_person" | "phone" | "whatsapp" | "email" | "other"; decidedAt: string; note?: string }) => request<{ estimate: RemoteEstimate }>(config, `/api/v1/estimates/${estimateId}/decision`, json(input)),
  command: (config: CognitoConfig, jobId: number, command: "start-work" | "hold-job" | "resume-work" | "cancel-job" | "start-rework" | "complete-work", reason = "") => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/commands/${command}`, json({ reason })),
};
