import type { AdminDemoState } from "./admin-demo-state";
import type { JobView, User } from "./types";
import { canCreateInvoice, canEditInvoice as mayEditInvoice } from "./invoice-math";
import { buildPrintDocument, buildReportLines, buildReportValues, renderReportTemplate, type ReportCategory } from "./report-templates";
import { DAMAGE_SLOT, parseDamageMarks, staticDamageDiagramSvg } from "./job-sheet";
import type { DocumentSnapshot } from "./document-snapshots";

export type DocumentKind = "estimate" | "invoice" | "gate-pass" | "job-card" | "payment-receipt";

export type JobDocumentAction = "create-estimate" | "edit-estimate" | "approve-estimate" | "create-invoice" | "edit-invoice" | "download";

export function resolveJobDocumentActions(kind: DocumentKind, view: JobView, actor: Pick<User, "id" | "role">): JobDocumentAction[] {
  // CLOSED and CANCELLED jobs are terminal and read-only: documents can only be downloaded.
  const readOnly = view.job.main_status === "CANCELLED" || view.job.main_status === "CLOSED";
  const canEditEstimate = !readOnly && (actor.role === "admin" || (actor.role === "service" && actor.id === view.job.advisor_id));
  if (kind === "estimate") {
    if (recordExists(kind, view)) return [...(canEditEstimate ? ["edit-estimate" as const, ...(view.estimate?.status === "Approved" ? [] : ["approve-estimate" as const])] : []), "download"];
    return canEditEstimate ? ["create-estimate"] : [];
  }
  if (kind === "invoice") {
    if (view.invoice && !view.invoice.voided_at) return [...(!readOnly && mayEditInvoice(actor, view.job) && view.invoice.status !== "Cleared" ? ["edit-invoice" as const] : []), ...(recordExists(kind, view) ? ["download" as const] : [])];
    return !readOnly && canCreateInvoice(actor, view.job) && view.estimate?.status === "Approved" && !view.estimate.archived_at ? ["create-invoice"] : [];
  }
  return recordExists(kind, view) ? ["download"] : [];
}

const labels: Record<DocumentKind, string> = { estimate: "Estimate", invoice: "Invoice", "gate-pass": "Gate Pass", "job-card": "Job Card", "payment-receipt": "Payment Receipt" };
export const DOCUMENT_LABELS = labels;
export const SLOT_KINDS: DocumentKind[] = ["estimate", "invoice", "payment-receipt", "gate-pass"];

const currentInvoicePayment = (view: JobView) => Boolean(view.invoice && view.payments.some((payment) => payment.invoice_id === view.invoice!.id));
export const recordExists = (kind: DocumentKind, view: JobView) => kind === "estimate" ? Boolean(view.estimate && !view.estimate.archived_at)
  : kind === "invoice" ? Boolean(view.invoice && !view.invoice.voided_at && view.invoice.document_available !== 0)
    : kind === "gate-pass" ? Boolean(view.gate_pass && view.invoice && view.gate_pass.invoice_id === view.invoice.id && !view.gate_pass.voided_at)
      : kind === "payment-receipt" ? Boolean(view.receipt && view.invoice && view.receipt.invoice_id === view.invoice.id && !view.receipt.voided_at && currentInvoicePayment(view))
        : Boolean(view.job);

/** Number of a live document and whether it is frozen (estimate Approved, invoice Cleared, receipt and gate pass on creation). */
export function documentInfo(kind: DocumentKind, view: JobView): { number: string; frozen: boolean } | undefined {
  if (!recordExists(kind, view)) return undefined;
  if (kind === "estimate") return { number: `EST-${view.job.job_no}`, frozen: view.estimate?.status === "Approved" };
  if (kind === "invoice") return { number: view.invoice!.invoice_no, frozen: view.invoice!.status === "Cleared" };
  if (kind === "payment-receipt") return { number: view.receipt!.receipt_no, frozen: true };
  if (kind === "gate-pass") return { number: view.gate_pass!.gate_pass_no, frozen: true };
  return { number: view.job.job_no, frozen: false };
}

export type DocumentSlotState = "ready" | "frozen" | "void" | "missing";

export interface JobDocumentDescriptor {
  kind: DocumentKind;
  label: string;
  available: boolean;
  expected: boolean;
  state: DocumentSlotState;
  number?: string;
  message?: string;
  /** Set on a void document listed from its frozen snapshot. */
  snapshotId?: string;
}

function missingReason(kind: DocumentKind, view: JobView): string {
  if (view.job.main_status === "CANCELLED") return `${labels[kind]} not created - job cancelled`;
  if (kind === "estimate") return "Estimate not created";
  if (kind === "invoice") return view.estimate?.status === "Approved" && !view.estimate.archived_at ? "Invoice not created" : "Invoice not created - approve an estimate first";
  if (kind === "payment-receipt") return "Payment Receipt not created - created when a payment is recorded";
  return "Gate Pass not created - created when the job is closed";
}

/** Job Card sheet (always available), the four numbered slots, then void documents (kept listed). */
export function resolveJobDocuments(view: JobView, snapshots: readonly DocumentSnapshot[] = []): JobDocumentDescriptor[] {
  const rows: JobDocumentDescriptor[] = [{ kind: "job-card", label: labels["job-card"], available: true, expected: true, state: "ready", number: view.job.job_no }];
  for (const kind of SLOT_KINDS) {
    const info = documentInfo(kind, view);
    rows.push(info
      ? { kind, label: labels[kind], available: true, expected: true, state: info.frozen ? "frozen" : "ready", number: info.number }
      : { kind, label: labels[kind], available: false, expected: true, state: "missing", message: missingReason(kind, view) });
  }
  for (const snap of snapshots.filter((item) => item.jobId === view.job.id && item.jobNo === view.job.job_no && item.state === "void")) {
    rows.push({ kind: snap.kind, label: labels[snap.kind], available: true, expected: false, state: "void", number: snap.number, snapshotId: snap.id, message: `${labels[snap.kind]} ${snap.number} - void` });
  }
  return rows;
}

export function documentFilename(view: JobView, kind: DocumentKind) {
  const stem = view.job.job_no.trim().replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "job";
  return `${stem}-${kind}.pdf`;
}

export interface RenderedDocument { html: string; title: string; number: string; filename: string; frozen: boolean }

/** Merge the Active template of the kind's category with Company Settings and assets. */
const DAMAGE_PLACEHOLDER = /{{\s*blocks\.damage_diagram\s*}}/;
/** Returns the template with the damage diagram block injected (before Tasks, else before </main>, else appended) when it is missing. */
export function withDamageDiagram<T extends { html: string }>(template: T): T {
  if (DAMAGE_PLACEHOLDER.test(template.html)) return template;
  const block = "<h3>Vehicle damage</h3>{{blocks.damage_diagram}}";
  const html = template.html.replace(/{{\s*blocks\.tasks\s*}}/, (m) => `${block}${m}`);
  if (html !== template.html) return { ...template, html };
  const close = template.html.lastIndexOf("</main>");
  return { ...template, html: close >= 0 ? template.html.slice(0, close) + block + template.html.slice(close) : template.html + block };
}

export function renderLive(kind: DocumentKind, view: JobView, adminState: Pick<AdminDemoState, "reportTemplates" | "businessSettings" | "companyAssets">): string {
  const category = kind as ReportCategory;
  const template = adminState.reportTemplates.find((candidate) => candidate.category === category && candidate.active);
  if (!template) throw new Error(`No active ${labels[kind]} template is configured.`);
  const values = buildReportValues(category, view, adminState.businessSettings, adminState.companyAssets);
  // Templates saved before {{blocks.damage_diagram}} existed lack it; the Job Card sheet always embeds the diagram.
  const source = kind === "job-card" ? withDamageDiagram(template) : template;
  const html = renderReportTemplate(source, values, buildReportLines(category, view));
  return kind === "job-card" ? html.replace(DAMAGE_SLOT, staticDamageDiagramSvg(parseDamageMarks(view.job.damage_marks))) : html;
}

/** Frozen snapshot when one exists for the live document, otherwise a render from the Active template and Company Settings. */
export function renderJobDocument(kind: DocumentKind, view: JobView, adminState: Pick<AdminDemoState, "reportTemplates" | "businessSettings" | "companyAssets">, snapshots: readonly DocumentSnapshot[] = []): RenderedDocument {
  const info = documentInfo(kind, view);
  if (!info) throw new Error(`${labels[kind]} is not available for this job.`);
  const snap = !info.frozen ? undefined : snapshots.find((item) => item.jobId === view.job.id && item.jobNo === view.job.job_no && item.kind === kind && item.number === info.number && item.state === "frozen");
  const filename = documentFilename(view, kind);
  if (snap) return { html: snap.html, title: `${labels[kind]} ${snap.number}`, number: snap.number, filename, frozen: true };
  return { html: renderLive(kind, view, adminState), title: `${labels[kind]} ${info.number}`, number: info.number, filename, frozen: false };
}

export function renderSnapshotDocument(snap: DocumentSnapshot): RenderedDocument {
  const stem = snap.jobNo.trim().replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "job";
  return { html: snap.html, title: `${labels[snap.kind]} ${snap.number} (void)`, number: snap.number, filename: `${stem}-${snap.kind}-${snap.number}-void.pdf`, frozen: true };
}

export interface PrintJobDocumentResult { ok: boolean; error?: string }

/** Print fallback: opens the rendered document in a print window (Save as PDF). */
export function printRenderedDocument(doc: Pick<RenderedDocument, "html" | "title">): PrintJobDocumentResult {
  const printWindow = window.open("", "_blank", "width=900,height=720");
  if (!printWindow) return { ok: false, error: "Pop-up blocked. Allow pop-ups for WorkshopOS, then try Print again." };
  try {
    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(buildPrintDocument(doc.title, doc.html));
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 100);
    return { ok: true };
  } catch (error) {
    printWindow.close();
    return { ok: false, error: error instanceof Error ? error.message : "The report could not be rendered." };
  }
}
