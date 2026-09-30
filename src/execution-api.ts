import { authenticatedFetch, type CognitoConfig } from "./auth";

export type RemoteTask = { id: number; jobId: number; branchId: string; technicianId: string; sourceQcCheckId: number | null; title: string; instructions: string; status: "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "CANCELLED"; startedAt: string | null; completedAt: string | null; createdAt: string; updatedAt: string };
export type RemoteWorkUpdate = { id: number; jobId: number; taskId: number; body: string; kind: "progress" | "blocker" | "completion" | "rework"; actorId: string; createdAt: string };
export type RemoteAttachment = { id: number; jobId: number; category: "before_work" | "after_work" | "work_evidence" | "qc_evidence"; filename: string; contentType: string; byteSize: number; caption: string; createdBy: string; createdAt: string; contentPath: string };
export type RemoteQcCheck = { id: number; jobId: number; label: string; required: boolean; status: "pending" | "passed" | "failed"; createdAt: string; updatedAt: string; results: Array<{ id: number; outcome: "pass" | "fail"; note: string; actorId: string; createdAt: string }> };
export type RemoteExecution = { job: { id: number; jobNo: string; status: string }; tasks: RemoteTask[]; updates: RemoteWorkUpdate[]; attachments: RemoteAttachment[]; qcChecks: RemoteQcCheck[] };

export class ExecutionApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new ExecutionApiError(body.code ?? body.detail?.code ?? "EXECUTION_API_FAILED");
  }
  return response.json() as Promise<T>;
}

const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export const executionApi = {
  myTasks: (config: CognitoConfig) => request<RemoteTask[]>(config, "/api/v1/technician-tasks/mine"),
  job: (config: CognitoConfig, jobId: number) => request<RemoteExecution>(config, `/api/v1/jobs/${jobId}/execution`),
  commandTask: (config: CognitoConfig, taskId: number, command: "start" | "pause" | "resume" | "complete" | "cancel", reason = "") => request<RemoteTask>(config, `/api/v1/technician-tasks/${taskId}/commands/${command}`, json({ reason })),
  updateWork: (config: CognitoConfig, jobId: number, input: { taskId: number; body: string; kind: "progress" | "blocker" | "completion" | "rework" }) => request<RemoteWorkUpdate>(config, `/api/v1/jobs/${jobId}/work-updates`, json(input)),
  addAttachment: (config: CognitoConfig, jobId: number, input: { category: RemoteAttachment["category"]; filename: string; contentType: string; dataBase64: string; caption?: string }) => request<RemoteAttachment>(config, `/api/v1/jobs/${jobId}/attachments`, json(input)),
  addQcCheck: (config: CognitoConfig, jobId: number, input: { label: string; required?: boolean }) => request<RemoteQcCheck>(config, `/api/v1/jobs/${jobId}/qc-checks`, json(input)),
  resultQc: (config: CognitoConfig, checkId: number, input: { outcome: "pass" | "fail"; note?: string }) => request<{ check: RemoteQcCheck }>(config, `/api/v1/qc-checks/${checkId}/result`, json(input)),
};
