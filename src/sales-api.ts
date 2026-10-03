import { authenticatedFetch, type CognitoConfig } from "./auth";

export type LeadStage = "NEW" | "QUALIFIED" | "QUOTATION_SENT" | "WON" | "LOST";
export type LeadTemperature = "HOT" | "WARM" | "COLD";
export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type Lead = { id: number; branchId: string; displayName: string; phone: string; company: string; email: string; address: string; serviceInterest: string; notes: string; stage: LeadStage; temperature: LeadTemperature; followUpDue: string | null; siteVisitCompleted: boolean; siteVisitDate: string | null; createdAt: string; updatedAt: string };
export type QuotationLine = { id?: number; kind: string; description: string; quantity: number; rate: number; gstRate: number };
export type Quotation = { id: number; branchId: string; leadId: number; quotationNo: string; status: QuotationStatus; validUntil: string | null; customerNotes: string; discount: number; subtotal: number; gstAmount: number; total: number; templateId: string; createdAt: string; updatedAt: string; lines: QuotationLine[] };

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> { const response = await authenticatedFetch(config, path, init); if (!response.ok) { const body = await response.json().catch(() => ({})) as { code?: string }; throw new Error(body.code ?? "SALES_CRM_API_FAILED"); } return response.json() as Promise<T>; }
const json = (method: "POST" | "PUT", body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
export const salesApi = {
  leads: (config: CognitoConfig, filters = "") => request<Lead[]>(config, `/api/v1/sales/leads${filters}`),
  createLead: (config: CognitoConfig, input: Omit<Lead, "id" | "branchId" | "createdAt" | "updatedAt">) => request<Lead>(config, "/api/v1/sales/leads", json("POST", input)),
  updateLead: (config: CognitoConfig, id: number, input: Omit<Lead, "id" | "branchId" | "createdAt" | "updatedAt">) => request<Lead>(config, `/api/v1/sales/leads/${id}`, json("PUT", input)),
  quotations: (config: CognitoConfig, filters = "") => request<Quotation[]>(config, `/api/v1/sales/quotations${filters}`),
  createQuotation: (config: CognitoConfig, input: { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] }) => request<Quotation>(config, "/api/v1/sales/quotations", json("POST", input)),
  updateQuotation: (config: CognitoConfig, id: number, input: { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] }) => request<Quotation>(config, `/api/v1/sales/quotations/${id}`, json("PUT", input)),
  status: (config: CognitoConfig, id: number, quotationStatus: QuotationStatus) => request<Quotation>(config, `/api/v1/sales/quotations/${id}/status`, json("POST", { status: quotationStatus })),
  document: (config: CognitoConfig, id: number) => request<{ quotationNo: string; snapshot: Record<string, unknown> }>(config, `/api/v1/sales/quotations/${id}/document`),
};
