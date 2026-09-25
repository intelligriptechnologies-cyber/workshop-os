import { jsPDF } from "jspdf";
import type { AdminDemoState, WorkshopBusinessSettings } from "./admin-demo-state";
import type { JobView, User } from "./types";
import { canCreateInvoice, canEditInvoice as mayEditInvoice, invoiceTotals } from "./invoice-math";
import { buildPrintDocument, buildReportValues, renderReportTemplate, reportAvailable, type ReportCategory } from "./report-templates";

export type DocumentKind = "estimate" | "invoice" | "gate-pass" | "job-card" | "payment-receipt";

export interface JobDocumentDescriptor {
  kind: DocumentKind;
  label: string;
  available: boolean;
  expected: boolean;
  message?: string;
}

export type JobDocumentAction = "create-estimate" | "edit-estimate" | "approve-estimate" | "create-invoice" | "edit-invoice" | "download";

export function resolveJobDocumentActions(kind: DocumentKind, view: JobView, actor: Pick<User, "id" | "role">): JobDocumentAction[] {
  const canEditEstimate = actor.role === "admin" || (actor.role === "service" && actor.id === view.job.advisor_id);
  if (kind === "estimate") {
    if (recordExists(kind, view)) return [...(canEditEstimate ? ["edit-estimate" as const, ...(view.estimate?.status === "Approved" ? [] : ["approve-estimate" as const])] : []), "download"];
    return canEditEstimate ? ["create-estimate"] : [];
  }
  if (kind === "invoice") {
    if (view.invoice && !view.invoice.voided_at) return [...(mayEditInvoice(actor, view.job) && view.invoice.status !== "Cleared" ? ["edit-invoice" as const] : []), ...(recordExists(kind, view) ? ["download" as const] : [])];
    return canCreateInvoice(actor, view.job) && view.estimate?.status === "Approved" && !view.estimate.archived_at ? ["create-invoice"] : [];
  }
  return recordExists(kind, view) ? ["download"] : [];
}

export interface JobDocumentLine {
  description: string;
  kind: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface JobDocumentModel {
  kind: DocumentKind;
  title: string;
  business: { name: string; legalName: string; address: string; phone: string; email: string; gstin: string };
  identifiers: { documentNumber: string; jobNumber: string; tallyReference?: string };
  customer: { name: string; mobile: string };
  vehicle: { registration: string; description: string; km: number };
  dates: { received: string; promised: string; validity?: string; delivered?: string };
  lines: JobDocumentLine[];
  totals?: { subtotal: number; discount: number; gst: number; total: number; paid: number; balance: number };
  details: Array<{ label: string; value: string }>;
}

const labels: Record<DocumentKind, string> = { estimate: "Estimate", invoice: "Invoice", "gate-pass": "Gate Pass", "job-card": "Job Card", "payment-receipt": "Payment Receipt" };
const currentInvoicePayment = (view: JobView) => Boolean(view.invoice && view.payments.some((payment) => payment.invoice_id === view.invoice!.id));
const recordExists = (kind: DocumentKind, view: JobView) => kind === "estimate" ? Boolean(view.estimate && !view.estimate.archived_at)
  : kind === "invoice" ? Boolean(view.invoice && !view.invoice.voided_at && view.invoice.document_available !== 0)
    : kind === "gate-pass" ? Boolean(view.gate_pass && view.invoice && view.gate_pass.invoice_id === view.invoice.id && !view.gate_pass.voided_at)
      : kind === "payment-receipt" ? Boolean(view.receipt && view.invoice && view.receipt.invoice_id === view.invoice.id && !view.receipt.voided_at && currentInvoicePayment(view))
        : Boolean(view.job);

export function resolveJobDocuments(view: JobView): JobDocumentDescriptor[] {
  const expected: DocumentKind[] = view.job.main_status === "IN_PROGRESS" ? ["job-card", "estimate", "invoice"]
    : view.job.main_status === "COMPLETED" ? ["job-card", "estimate", "invoice"]
      : view.job.main_status === "CLOSED" ? ["job-card", "estimate", "invoice", "payment-receipt", "gate-pass"] : ["job-card"];
  const extras = (["estimate", "invoice", "payment-receipt", "gate-pass"] as DocumentKind[]).filter((kind) => recordExists(kind, view) && !expected.includes(kind));
  const kinds = [...expected, ...extras];
  return kinds.map((kind) => {
    const available = recordExists(kind, view);
    return { kind, label: labels[kind], available, expected: expected.includes(kind), message: available ? undefined : `${labels[kind]} not created` };
  });
}

const fallback = (value: string | undefined, defaultValue: string) => value?.trim() || defaultValue;
const clean = (value: string | undefined) => value?.trim() || "—";

export function documentFilename(view: JobView, kind: DocumentKind) {
  const stem = view.job.job_no.trim().replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "job";
  return `${stem}-${kind}.pdf`;
}

export function buildJobDocumentModel(kind: DocumentKind, view: JobView, settings: WorkshopBusinessSettings): JobDocumentModel {
  const sourceItems = kind === "invoice" || kind === "payment-receipt" ? view.invoice_items ?? view.estimate_items : view.estimate_items;
  const lines = sourceItems.map((item) => ({ description: item.description, kind: item.kind, quantity: item.qty, rate: item.rate, amount: item.qty * item.rate }));
  const billed = kind === "invoice" || kind === "payment-receipt";
  const gstFallback = billed ? view.invoice?.gst_rate ?? settings.billing.defaultGstPercent : view.estimate?.gst_rate ?? settings.billing.defaultGstPercent;
  const priced = invoiceTotals(sourceItems.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: billed ? (item as { gst_rate?: number | null }).gst_rate ?? gstFallback : gstFallback })), billed ? view.invoice?.discount ?? 0 : view.estimate?.discount ?? 0);
  const { subtotal, discount, gst } = priced;
  const calculatedTotal = priced.total;
  const total = kind === "invoice" && view.invoice ? view.invoice.total : calculatedTotal;
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const received = clean(view.visit.received_at?.slice(0, 10));
  const promised = clean(view.job.promised_at?.slice(0, 10));
  const validityDate = new Date(`${view.visit.received_at.slice(0, 10)}T00:00:00`);
  validityDate.setDate(validityDate.getDate() + settings.pricing.estimateValidityDays);
  const documentNumber = kind === "estimate" ? `EST-${view.job.job_no}` : kind === "invoice" ? clean(view.invoice?.invoice_no) : kind === "gate-pass" ? clean(view.gate_pass?.gate_pass_no) : kind === "payment-receipt" ? clean(view.receipt?.receipt_no) : view.job.job_no;
  const details = kind === "estimate"
    ? [{ label: "Approval", value: view.estimate?.status ?? "Not created" }, { label: "Approval note", value: clean(view.estimate?.approval_note) }]
    : kind === "invoice"
      ? [{ label: "Invoice status", value: view.invoice?.status ?? "Not created" }, { label: "Payment status", value: paid >= total ? "Paid" : paid > 0 ? "Partial" : "Pending" }]
      : kind === "payment-receipt"
        ? view.payments.map((payment) => ({ label: `${payment.mode} · ${clean(payment.reference)}`, value: `${payment.amount.toFixed(2)}${payment.created_at ? ` · ${payment.created_at.slice(0, 10)}` : ""}` }))
        : [{ label: "Completed work", value: clean(view.job.work_list) }, { label: "QC", value: view.job.qc_status }, { label: "Payment", value: paid >= calculatedTotal ? "Paid" : paid > 0 ? "Partial" : "Pending" }, { label: "Acknowledgement", value: clean(view.job.acknowledgement) }, { label: "Customer signature", value: "____________________" }, { label: "Workshop signature", value: "____________________" }];
  return {
    kind, title: labels[kind],
    business: {
      name: fallback(settings.profile.businessName, "WorkshopOS"), legalName: fallback(settings.profile.legalName, "WorkshopOS Automotive Services"),
      address: fallback(settings.profile.address, "Workshop address"), phone: fallback(settings.profile.phone, "Not provided"),
      email: fallback(settings.profile.email, "Not provided"), gstin: fallback(settings.billing.gstin, "Not provided"),
    },
    identifiers: { documentNumber, jobNumber: view.job.job_no, tallyReference: kind === "invoice" ? clean(view.invoice?.tally_invoice_no) : undefined },
    customer: { name: view.customer.name, mobile: view.customer.mobile },
    vehicle: { registration: view.vehicle.number, description: `${view.vehicle.make} ${view.vehicle.model}`.trim(), km: view.job.final_km ?? view.vehicle.km },
    dates: { received, promised, validity: kind === "estimate" ? validityDate.toISOString().slice(0, 10) : undefined, delivered: kind === "gate-pass" ? clean(view.job.closed_at?.slice(0, 10) || view.job.delivery_by?.slice(0, 10)) : undefined },
    lines, totals: kind === "gate-pass" || kind === "job-card" ? undefined : { subtotal, discount, gst, total, paid, balance: Math.max(0, total - paid) }, details,
  };
}

export function downloadJobDocument(kind: DocumentKind, view: JobView, settings: WorkshopBusinessSettings) {
  if (!recordExists(kind, view)) return false;
  const model = buildJobDocumentModel(kind, view, settings);
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 42; let y = margin;
  const write = (text: string, size = 10, bold = false) => { pdf.setFont("helvetica", bold ? "bold" : "normal"); pdf.setFontSize(size); const rows = pdf.splitTextToSize(text.replace(/[^\x20-\x7E]/g, " "), 510); pdf.text(rows, margin, y); y += rows.length * (size + 4); };
  write(model.business.name, 18, true); write(`${model.business.legalName} | ${model.business.address}`); write(`Phone: ${model.business.phone} | Email: ${model.business.email} | GSTIN: ${model.business.gstin}`);
  y += 10; write(`${model.title.toUpperCase()}  ${model.identifiers.documentNumber}`, 15, true); write(`Job: ${model.identifiers.jobNumber}${model.identifiers.tallyReference ? ` | Tally: ${model.identifiers.tallyReference}` : ""}`);
  write(`Customer: ${model.customer.name} | ${model.customer.mobile}`); write(`Vehicle: ${model.vehicle.registration} | ${model.vehicle.description} | ${model.vehicle.km} km`); write(`Received: ${model.dates.received} | Promised: ${model.dates.promised}${model.dates.validity ? ` | Valid until: ${model.dates.validity}` : ""}${model.dates.delivered ? ` | Delivered: ${model.dates.delivered}` : ""}`);
  if (model.lines.length) { y += 8; write("ITEMS", 11, true); model.lines.forEach((line) => write(`${line.kind} | ${line.description} | ${line.quantity} x ${line.rate.toFixed(2)} | ${line.amount.toFixed(2)}`)); }
  if (model.totals) { y += 8; write(`Subtotal: ${model.totals.subtotal.toFixed(2)} | Discount: ${model.totals.discount.toFixed(2)} | GST: ${model.totals.gst.toFixed(2)} | Total: ${model.totals.total.toFixed(2)}`, 10, true); write(`Paid: ${model.totals.paid.toFixed(2)} | Balance: ${model.totals.balance.toFixed(2)}`); }
  y += 8; model.details.forEach((detail) => write(`${detail.label}: ${detail.value}`));
  pdf.save(documentFilename(view, kind)); return true;
}

export interface PrintJobDocumentResult { ok: boolean; error?: string }

export function printJobDocument(kind: Exclude<DocumentKind, "estimate">, view: JobView, adminState: AdminDemoState): PrintJobDocumentResult {
  const category = kind as ReportCategory;
  if (!reportAvailable(category, view)) return { ok: false, error: `${labels[kind]} is not available for this job.` };
  const template = adminState.reportTemplates.find((candidate) => candidate.category === category && candidate.active);
  if (!template) return { ok: false, error: `No active ${labels[kind]} template is configured.` };
  const printWindow = window.open("", "_blank", "width=900,height=720");
  if (!printWindow) return { ok: false, error: "Pop-up blocked. Allow pop-ups for WorkshopOS, then try Print / Save as PDF again." };
  try {
    printWindow.opener = null;
    const values = buildReportValues(category, view, adminState.businessSettings, adminState.companyAssets);
    const rendered = renderReportTemplate(template, values);
    printWindow.document.open();
    printWindow.document.write(buildPrintDocument(`${labels[kind]} ${values["report.number"]}`, rendered));
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 100);
    return { ok: true };
  } catch (error) {
    printWindow.close();
    return { ok: false, error: error instanceof Error ? error.message : "The report could not be rendered." };
  }
}
