import { authenticatedFetch, type CognitoConfig } from "./auth";

export type RemoteFinancialDocument = { id: number; jobId: number; type: "INVOICE" | "RECEIPT" | "GATE_PASS"; number: string; fiscalYear: string; templateVersion: string; issuedAt: string; voided: boolean; contentPath: string };
export type RemoteInvoiceLine = { lineNo: number; description: string; quantity: number; unitAmountPaise: number; gstRateBps: number; taxablePaise: number; taxPaise: number; totalPaise: number };
export type RemoteInvoice = { id: number; jobId: number; documentId: number; number: string; fiscalYear: string; subtotalPaise: number; discountPaise: number; taxPaise: number; totalPaise: number; paidPaise: number; creditedPaise: number; balancePaise: number; status: "UNPAID" | "PARTIAL" | "SETTLED" | "CREDITED" | "VOID"; voided: boolean; issuedAt: string; contentPath: string; lines: RemoteInvoiceLine[] };
export type RemotePayment = { id: number; invoiceId: number; receiptDocumentId: number; receiptNumber: string; amountPaise: number; method: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "OTHER"; reference: string; payer: string; receivedAt: string; contentPath: string; supportingAttachmentPath: string | null };
export type RemoteHandover = { id: number; jobId: number; invoiceId: number; gatePassDocumentId: number; gatePassNumber: string; deliveredBy: string; finalOdometer: number; acknowledgement: string; handoverAt: string; contentPath: string };
export type RemoteCreditNote = { id: number; invoiceId: number; documentId: number; number: string; amountPaise: number; reason: string; refundedPaise: number; issuedAt: string; contentPath: string };

export class FinanceApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new FinanceApiError(body.code ?? body.detail?.code ?? "FINANCE_API_FAILED");
  }
  return response.json() as Promise<T>;
}

const json = (body: unknown, requestKey?: string): RequestInit => ({ method: "POST", headers: { "content-type": "application/json", ...(requestKey ? { "idempotency-key": requestKey } : {}) }, body: JSON.stringify(body) });

/**
 * The online finance seam. Existing demo billing continues to use SQLite when
 * there is no authenticated remote session; callers must choose this client
 * only after the app's current online/session gate succeeds.
 */
export const financeApi = {
  invoices: (config: CognitoConfig, jobId: number) => request<RemoteInvoice[]>(config, `/api/v1/jobs/${jobId}/invoices`),
  issueInvoice: (config: CognitoConfig, jobId: number, input: { customerState?: string; replacesInvoiceId?: number } = {}, requestKey?: string) => request<RemoteInvoice>(config, `/api/v1/jobs/${jobId}/invoices`, json(input, requestKey)),
  voidInvoice: (config: CognitoConfig, invoiceId: number, reason: string, requestKey?: string) => request<RemoteInvoice>(config, `/api/v1/invoices/${invoiceId}/void`, json({ reason }, requestKey)),
  issueCreditNote: (config: CognitoConfig, invoiceId: number, input: { amountPaise: number; reason: string }, requestKey?: string) => request<RemoteCreditNote>(config, `/api/v1/invoices/${invoiceId}/credit-notes`, json(input, requestKey)),
  recordRefund: (config: CognitoConfig, creditNoteId: number, input: { amountPaise: number; method: "cash" | "card" | "upi" | "bank_transfer" | "other"; reference?: string }, requestKey?: string) => request<{ id: number; creditNoteId: number }>(config, `/api/v1/credit-notes/${creditNoteId}/refunds`, json(input, requestKey)),
  payments: (config: CognitoConfig, invoiceId: number) => request<RemotePayment[]>(config, `/api/v1/invoices/${invoiceId}/payments`),
  recordPayment: (config: CognitoConfig, invoiceId: number, input: { amountPaise: number; method: "cash" | "card" | "upi" | "bank_transfer" | "other"; reference?: string; payer?: string; receivedAt?: string; supportingAttachment?: { filename: string; contentType: "image/jpeg" | "image/png" | "application/pdf"; dataBase64: string } }, requestKey?: string) => request<RemotePayment>(config, `/api/v1/invoices/${invoiceId}/payments`, json(input, requestKey)),
  delivery: (config: CognitoConfig, jobId: number) => request<RemoteHandover | null>(config, `/api/v1/jobs/${jobId}/delivery`),
  completeHandover: (config: CognitoConfig, jobId: number, input: { deliveredBy: string; finalOdometer: number; acknowledgement: string }, requestKey?: string) => request<RemoteHandover>(config, `/api/v1/jobs/${jobId}/complete-handover`, json(input, requestKey)),
};
