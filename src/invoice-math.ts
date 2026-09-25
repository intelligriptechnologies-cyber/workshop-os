import type { JobView, MainStatus, User } from "./types";

export type BillingKind = "Service" | "Material";

/** Default GST rate per line kind (editable per line). No CGST/SGST split. */
export const DEFAULT_GST_BY_KIND: Record<BillingKind, number> = { Service: 18, Material: 18 };

export interface PricedLine { qty: number; rate: number; gst_rate: number }

export interface PricedLineTotals { amount: number; discount: number; taxable: number; gst: number; total: number }

export interface InvoiceTotals { lines: PricedLineTotals[]; subtotal: number; discount: number; taxable: number; gst: number; total: number }

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * One flat discount is spread across lines in proportion to each line's share of the subtotal
 * (the last line absorbs the rounding remainder); GST is computed per line on the reduced value.
 */
export function invoiceTotals(lines: readonly PricedLine[], flatDiscount: number): InvoiceTotals {
  const amounts = lines.map((line) => round2(line.qty * line.rate));
  const subtotal = round2(amounts.reduce((sum, amount) => sum + amount, 0));
  const discount = round2(Math.min(Math.max(flatDiscount || 0, 0), subtotal));
  let spread = 0;
  const rows = lines.map((line, index): PricedLineTotals => {
    const isLast = index === lines.length - 1;
    const share = isLast ? round2(discount - spread) : subtotal > 0 ? round2(discount * amounts[index] / subtotal) : 0;
    spread = round2(spread + share);
    const taxable = round2(amounts[index] - share);
    const gst = round2(taxable * (line.gst_rate || 0) / 100);
    return { amount: amounts[index], discount: share, taxable, gst, total: round2(taxable + gst) };
  });
  const taxable = round2(rows.reduce((sum, row) => sum + row.taxable, 0));
  const gst = round2(rows.reduce((sum, row) => sum + row.gst, 0));
  return { lines: rows, subtotal, discount, taxable, gst, total: round2(taxable + gst) };
}

export interface InvoiceDraftLine { kind: BillingKind; description: string; qty: number; rate: number; gst_rate: number; material_row_id?: number }

export interface InvoiceDraft { lines: InvoiceDraftLine[]; unissuedRows: number; discount: number }

/** Fresh-document pre-fill: the approved Estimate's Service lines plus Issued, not-yet-invoiced material rows. Prices stay to be typed. */
export function buildInvoiceDraft(view: Pick<JobView, "estimate" | "estimate_items" | "material_requests" | "inventory">): InvoiceDraft {
  const lines: InvoiceDraftLine[] = view.estimate_items.filter((item) => item.kind === "Service").map((item) => ({ kind: "Service", description: item.description, qty: item.qty, rate: item.rate, gst_rate: DEFAULT_GST_BY_KIND.Service }));
  let unissuedRows = 0;
  for (const row of view.material_requests) {
    if (row.archived_at || row.status === "Cancelled") continue;
    if (row.status === "Issued") {
      if (row.invoiced_in) continue;
      const item = view.inventory.find((candidate) => candidate.id === row.item_id);
      lines.push({ kind: "Material", description: item?.name ?? `Item ${row.item_id}`, qty: row.issued_qty || row.requested_qty, rate: 0, gst_rate: DEFAULT_GST_BY_KIND.Material, material_row_id: row.id });
    } else unissuedRows += 1;
  }
  return { lines, unissuedRows, discount: view.estimate?.discount ?? 0 };
}

/** Material rows that are Issued but not yet on an invoice (late materials to add through an invoice edit). */
export function pickableMaterialLines(view: Pick<JobView, "material_requests" | "inventory">): InvoiceDraftLine[] {
  return buildInvoiceDraft({ estimate: undefined, estimate_items: [], material_requests: view.material_requests, inventory: view.inventory }).lines;
}

export function unissuedWarning(count: number) {
  return count > 0 ? `${count} material row${count === 1 ? " is" : "s are"} not issued yet and will not be billed.` : undefined;
}

type Actor = Pick<User, "id" | "role">;
type JobRef = { advisor_id: number; main_status: MainStatus };

/** Owner and the linked Advisor from IN_PROGRESS; Owner and Accounts from COMPLETED (#22). */
export function canCreateInvoice(actor: Actor, job: JobRef) {
  if (job.main_status === "IN_PROGRESS") return actor.role === "admin" || (actor.role === "service" && actor.id === job.advisor_id);
  if (job.main_status === "COMPLETED") return actor.role === "admin" || actor.role === "accounts";
  return false;
}

/** Owner, Accounts and the linked Advisor may edit an unpaid invoice until the job is finished. */
export function canEditInvoice(actor: Actor, job: JobRef) {
  const who = actor.role === "admin" || actor.role === "accounts" || (actor.role === "service" && actor.id === job.advisor_id);
  return who && job.main_status !== "CLOSED" && job.main_status !== "CANCELLED" && job.main_status !== "NEW";
}

/** Completed is enabled only once a (non-voided) Invoice exists. */
export function canCompleteWithInvoice(view: Pick<JobView, "invoice">) {
  return Boolean(view.invoice && !view.invoice.voided_at);
}

export type PaymentListKind = "unpaid" | "received" | "void";
export interface PaymentListRow<V extends Pick<JobView, "invoice" | "payments">, P = V["payments"][number]> { key: string; kind: PaymentListKind; view: V; payment?: P }

/**
 * Payments screen mixed list (#31 Layout B): unpaid current invoices first (Record Payment on the row),
 * then received payments, then void payments. Voided invoices are not listed as unpaid.
 */
export function mixedPaymentRows<V extends Pick<JobView, "invoice" | "payments"> & Partial<Pick<JobView, "payment_history">>>(views: readonly V[], opts: { includeUnpaid: boolean } = { includeUnpaid: true }): PaymentListRow<V>[] {
  const unpaid: PaymentListRow<V>[] = [];
  const received: PaymentListRow<V>[] = [];
  const voided: PaymentListRow<V>[] = [];
  for (const view of views) {
    const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;
    if (opts.includeUnpaid && invoice && !view.payments.some((payment) => payment.invoice_id === invoice.id && !payment.voided_at)) unpaid.push({ key: `unpaid-${invoice.id}`, kind: "unpaid", view });
    for (const payment of view.payment_history ?? view.payments) (payment.voided_at ? voided : received).push({ key: `payment-${payment.id}`, kind: payment.voided_at ? "void" : "received", view, payment });
  }
  return [...unpaid, ...received, ...voided];
}

/** Recording or voiding a payment is Owner/Accounts only and blocked once the job is CLOSED or CANCELLED. */
export function canRecordOrVoidPayment(actor: Pick<User, "role">, job: Pick<JobRef, "main_status">) {
  return (actor.role === "admin" || actor.role === "accounts") && job.main_status !== "CLOSED" && job.main_status !== "CANCELLED";
}

/** An invoice may be voided (Owner/Accounts) only while unpaid and the job is not terminal. */
export function canVoidCurrentInvoice(actor: Pick<User, "role">, view: Pick<JobView, "invoice" | "payments"> & { job: Pick<JobRef, "main_status"> }) {
  const invoice = view.invoice;
  return Boolean(invoice && !invoice.voided_at) && canRecordOrVoidPayment(actor, view.job) && !view.payments.some((payment) => payment.invoice_id === invoice!.id && !payment.voided_at);
}
