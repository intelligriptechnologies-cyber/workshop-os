import { jsPDF } from "jspdf";

export const ESTIMATE_PERMISSIONS = [
  "estimates.page",
  "estimate.read",
  "estimate.manage",
  "estimate.submit",
  "estimate.approve",
  "estimate.document.download",
] as const;
export const TASK_PERMISSIONS = [
  "tasks.page",
  "task.read",
  "task.assign",
  "task.execute",
  "task.evidence.write",
] as const;
export const QC_PERMISSIONS = [
  "qc.page",
  "qc.read",
  "qc.inspect",
  "rework.assign",
  "rework.execute",
] as const;

export function createEstimateDocument(estimate: {
  id: string;
  jobNumber: string;
  revision: number;
  documentNumber?: string;
  status: string;
  notes: string;
  totalMinor: string;
  currency: string;
  validUntil?: string;
}) {
  const pdf = new jsPDF();
  pdf.setFontSize(18);
  pdf.text("WorkshopOS Estimate", 20, 22);
  pdf.setFontSize(11);
  const rows = [
    `Document: ${estimate.documentNumber ?? estimate.id}`,
    `Job: ${estimate.jobNumber}`,
    `Immutable version: ${estimate.revision}`,
    `Status: ${estimate.status}`,
    `Total: ${estimate.currency} ${(Number(estimate.totalMinor) / 100).toFixed(2)}`,
    `Valid until: ${estimate.validUntil ?? "Not submitted"}`,
    `Notes: ${estimate.notes || "None"}`,
  ];
  rows.forEach((line, index) => pdf.text(line, 20, 38 + index * 8));
  return {
    content: Buffer.from(pdf.output("arraybuffer")),
    mimeType: "application/pdf",
    filename: `estimate-${estimate.documentNumber ?? estimate.id}-v${estimate.revision}.pdf`,
  };
}

export function requiredIdempotencyKey(value: unknown): string {
  const key = String(value ?? "").trim();
  if (!key) throw new Error("IDEMPOTENCY_KEY_REQUIRED");
  return key;
}
