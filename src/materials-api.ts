import type { CognitoConfig } from "./auth";
import { authenticatedFetch } from "./auth";

export type RemoteMaterialReservation = {
  id: number; jobId: number; itemId: number; branchId: string; reservedQty: number; status: string; note: string;
  issuedQty: number; returnedQty: number; wastedQty: number; releasedQty: number; reversedQty: number;
  availableToIssue: number; availableToReserve: number; onJobQty: number; createdAt: string; updatedAt: string;
};
export type RemoteMaterialEvent = { id: number; reservationId: number; jobId: number; itemId: number; branchId: string; entryType: string; quantity: number; reason: string; actorId: string; createdAt: string };

export class MaterialsApiError extends Error { constructor(readonly code: string) { super(code); } }

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new MaterialsApiError(body.code ?? body.detail?.code ?? "MATERIALS_API_FAILED");
  }
  return response.json() as Promise<T>;
}

const post = (body: unknown, requestKey?: string): RequestInit => ({ method: "POST", headers: { "content-type": "application/json", ...(requestKey ? { "idempotency-key": requestKey } : {}) }, body: JSON.stringify(body) });

export const materialsApi = {
  reservations: (config: CognitoConfig, jobId?: number) => request<RemoteMaterialReservation[]>(config, `/api/v1/material-reservations${jobId ? `?jobId=${jobId}` : ""}`),
  ledger: (config: CognitoConfig, reservationId?: number) => request<RemoteMaterialEvent[]>(config, `/api/v1/material-ledger${reservationId ? `?reservationId=${reservationId}` : ""}`),
  reserve: (config: CognitoConfig, input: { jobId: number; itemId: number; quantity: number; note?: string }, requestKey: string) => request<RemoteMaterialReservation>(config, "/api/v1/material-reservations", post(input, requestKey)),
  command: (config: CognitoConfig, reservationId: number, command: "issue" | "return" | "waste" | "release" | "reverse-issue", input: { quantity: number; reason?: string }) => request<{ reservation: RemoteMaterialReservation; event: RemoteMaterialEvent }>(config, `/api/v1/material-reservations/${reservationId}/commands/${command}`, post(input)),
};
