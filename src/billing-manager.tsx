import type { Database } from "sql.js";
import { Check, Eye, Plus } from "lucide-react";
import { Fragment, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { JobPicker, jobMatchesPeriod, todayJobPeriod, type JobPeriod } from "./job-picker";
import {
  canMutateBilling,
  createInvoiceForActor,
  recordPaymentForActor,
  saveInvoiceForActor,
  voidInvoiceForActor,
  voidPaymentForActor,
  type PaymentInput,
} from "./db";
import { resolveJobDocumentActions } from "./job-documents";
import { DocumentDownloadButton } from "./document-download";
import { billingReconciliation, buildInvoiceDraft, canCreateInvoice, canEditInvoice, canRecordOrVoidPayment, canVoidCurrentInvoice, GST_RATES, invoiceTotals, mixedPaymentRows, pickableMaterialLines, unissuedWarning, type GstType, type PaymentListKind } from "./invoice-math";
import { activeFilterSummary, DEFAULT_PAGE_SIZE, normalizeSearch, paginate } from "./list-utils";
import type { ExportColumn } from "./export-utils";
import type { JobView, Payment, PaymentMode, User, WorkshopState } from "./types";
import { Dialog, DownloadMenu, FilterClearButton, ListSearchActions, SearchSelect } from "./ui-kit";
import { PaginationToolbar, ResultPagination } from "./pagination-toolbar";

export type BillingMode = "Invoices" | "Payments" | "Delivery";
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
type BillingRecord = { key: string; view: JobView; payment?: Payment; kind?: PaymentListKind };
type InvoiceItemDraft = { id?: number; kind: "Service" | "Material"; description: string; qty: number; rate: number; gst_type: GstType; gst_rate: number; material_row_id?: number };
const GST_RATE_OPTIONS = GST_RATES.map((rate) => ({ value: rate, label: `${rate}%` }));

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function timestamp(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function delivered(view: JobView) {
  return Boolean(view.checklist_items.find((item) => item.stage === "CLOSED" && item.label === "Delivered" && item.checked_at));
}

function recordCreatedAt(mode: BillingMode, record: BillingRecord) {
  return mode === "Invoices" ? record.view.invoice?.created_at
    : mode === "Payments" ? record.payment?.created_at
      : record.view.gate_pass?.created_at;
}

function newestFirst(mode: BillingMode, left: BillingRecord, right: BillingRecord) {
  const leftTime = recordCreatedAt(mode, left) ?? "";
  const rightTime = recordCreatedAt(mode, right) ?? "";
  return rightTime.localeCompare(leftTime) || right.key.localeCompare(left.key);
}

function recordsFor(mode: BillingMode, jobs: JobView[], voidedOnly = false): BillingRecord[] {
  if (mode === "Invoices") {
    if (voidedOnly) return jobs.flatMap((view) => (view.invoice_history ?? []).filter((invoice) => invoice.voided_at).map((invoice) => ({
      key: `void-invoice-${invoice.id}`,
      view: { ...view, invoice, invoice_items: view.invoice_items.filter((item) => item.invoice_id === invoice.id), payments: view.payment_history?.filter((payment) => payment.invoice_id === invoice.id) ?? [] },
    })));
    return jobs.filter((view) => view.invoice && !view.invoice.voided_at && view.invoice.document_available !== 0).map((view) => ({ key: `invoice-${view.job.id}`, view }));
  }
  // Payments is a receipt register, not a work queue. Only show completed, active
  // payments so unpaid jobs and voided history never appear alongside receipts.
  if (mode === "Payments") return mixedPaymentRows(jobs, { includeUnpaid: false }).filter((record) => {
    const payment = record.payment;
    const receipt = record.view.receipt;
    if (!payment) return false;
    return record.kind === "received"
      && payment.invoice_id === record.view.invoice?.id
      && record.view.invoice?.status === "Cleared"
      && receipt?.invoice_id === payment.invoice_id
      && !receipt.voided_at;
  });
  return jobs.filter((view) => view.gate_pass && !view.gate_pass.voided_at).map((view) => ({ key: `delivery-${view.job.id}`, view }));
}

function invoiceStatus(view: JobView) {
  return view.invoice ? (view.invoice.voided_at ? "Void" : view.invoice.status) : "Not created";
}

function paymentStatus(record: BillingRecord) {
  return record.kind === "unpaid" ? "Unpaid" : record.kind === "void" ? "Void" : "Paid";
}

function accountsRowHighlight(mode: BillingMode, record: BillingRecord, enabled: boolean) {
  if (!enabled || record.kind === "void") return "";
  if (mode === "Invoices") {
    const status = invoiceStatus(record.view);
    return status === "Pending" ? "billing-row-invoice-pending" : status === "Cleared" ? "billing-row-invoice-cleared" : "";
  }
  if (mode !== "Payments" || !record.payment) return "";
  const paymentModeClass: Record<PaymentMode, string> = {
    Cash: "billing-row-payment-cash",
    UPI: "billing-row-payment-upi",
    Card: "billing-row-payment-card",
    "Bank transfer": "billing-row-payment-bank-transfer",
    Other: "billing-row-payment-other",
  };
  return paymentModeClass[record.payment.mode];
}

function searchText(record: BillingRecord) {
  const { view, payment } = record;
  return normalizeSearch([view.job.job_no, view.customer.name, view.customer.mobile, view.vehicle.number, view.invoice?.invoice_no, view.invoice?.tally_invoice_no, view.invoice?.status, payment?.amount, payment?.mode, payment?.other_detail, payment?.reference, view.gate_pass?.gate_pass_no, delivered(view) ? "delivered" : "pending", record.kind ? paymentStatus(record) : ""].join(" "));
}

/** Manage Invoice/Payment tabs and the Payments screen: one table each, rows expand inline (#31 Layout B). */
export function BillingManager({ mode, state, actor, mutate, panel = true }: { mode: BillingMode; state: WorkshopState; actor: User; mutate: Mutate; panel?: boolean }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [invoiceDialog, setInvoiceDialog] = useState<{ action: "create" | "view" | "edit"; view: JobView }>();
  const [paymentDialog, setPaymentDialog] = useState<JobView>();
  const [jobId, setJobId] = useState<number>();
  // The Accounts panel has no period picker, so it starts unscoped. Manage retains its received-date workflow.
  const [jobPeriod, setJobPeriod] = useState<JobPeriod>(() => panel ? { date: "", month: "ALL", year: "ALL" } : todayJobPeriod());
  const [expanded, setExpanded] = useState<string>();
  const [voidedOnly, setVoidedOnly] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"ALL" | PaymentMode>("ALL");
  const editable = actor.role === "admin" || actor.role === "service";
  const allRecords = useMemo(() => recordsFor(mode, state.jobs, voidedOnly), [mode, state.jobs, voidedOnly]);
  const recordStatus = (record: BillingRecord) => mode === "Invoices" ? invoiceStatus(record.view) : mode === "Payments" ? paymentStatus(record) : delivered(record.view) ? "Delivered" : "Pending";
  const showStatusFilter = mode === "Invoices" || (!panel && mode === "Delivery");
  const compactAccountsPanel = panel && actor.role === "accounts";
  const showPaymentModeFilter = compactAccountsPanel && mode === "Payments";
  const managePeriod = !panel;
  const filtered = allRecords.filter((record) => {
    const needle = normalizeSearch(search);
    return (!managePeriod || jobMatchesPeriod(record.view, jobPeriod)) && (!needle || searchText(record).includes(needle)) && (!showStatusFilter || status === "ALL" || recordStatus(record) === status) && (!showPaymentModeFilter || paymentMode === "ALL" || record.payment?.mode === paymentMode);
  }).sort((left, right) => newestFirst(mode, left, right));
  const manage = !panel && mode !== "Delivery";
  const pickedJob = state.jobs.find((view) => view.job.id === jobId);
  const paged = paginate(filtered, page, pageSize);
  const statusOptions = mode === "Invoices" ? ["Pending", "Partial", "Cleared"] : ["Delivered"];
  const clear = () => { setSearch(""); setStatus("ALL"); setPaymentMode("ALL"); setJobId(undefined); if (managePeriod) setJobPeriod(todayJobPeriod()); setPage(1); };
  const toggleVoidedOnly = (checked: boolean) => { setVoidedOnly(checked); setExpanded(undefined); setJobId(undefined); setPage(1); };
  const columns: ExportColumn<BillingRecord>[] = mode === "Invoices"
    ? [{ header: "Created", value: (row) => timestamp(row.view.invoice?.created_at) }, { header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "Not created" }, { header: "Customer", value: (row) => row.view.customer.name }, { header: "Total", value: (row) => row.view.invoice?.total ?? 0 }, { header: "Status", value: (row) => invoiceStatus(row.view) }]
    : mode === "Payments"
      ? [{ header: "Paid at", value: (row) => timestamp(row.payment?.created_at) }, { header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "" }, { header: "Customer", value: (row) => row.view.customer.name }, { header: "Amount", value: (row) => row.payment?.amount ?? row.view.invoice?.total ?? 0 }, { header: "Mode", value: (row) => row.payment?.mode ?? "-" }, { header: "Status", value: (row) => paymentStatus(row) }]
      : [{ header: "Created", value: (row) => timestamp(row.view.gate_pass?.created_at) }, { header: "Job", value: (row) => row.view.job.job_no }, { header: "Vehicle", value: (row) => row.view.vehicle.number }, { header: "Gate pass", value: (row) => row.view.gate_pass?.gate_pass_no ?? "Pending" }, { header: "Delivery", value: (row) => delivered(row.view) ? "Delivered" : "Pending" }];
  const inline = mode !== "Delivery";
  const toggle = (key: string) => { setExpanded((current) => current === key ? undefined : key); const hit = allRecords.find((record) => record.key === key); if (manage && hit) setJobId(hit.view.job.id); };

  return (
    <section className={panel ? "workspace single-panel" : "billing-manager"} data-billing-manager={mode} role="tabpanel">
      <div className={panel ? "desk-panel" : "manager-panel"} role={panel ? undefined : "tabpanel"}>
        {!compactAccountsPanel && <>
          <div className="panel-actions"><div><h2>{mode}</h2><p>{mode === "Payments" ? "Paid invoices with downloadable receipts" : "All workshop jobs"}</p></div></div>
          {actor.role === "accounts" && <p className="permission-note">Invoices are view/download-only. Use Quick Mark Paid to complete the handover.</p>}
          {actor.role === "accounts" && <AccountsReconciliationQueues jobs={state.jobs} />}
          {!editable && actor.role !== "accounts" && <p className="permission-note">Read-only billing access.</p>}
          {inline && <p className="permission-note" role="note">Click a row for lines, GST and totals.{manage ? "" : " Create or edit invoices from the Job Card."}</p>}
        </>}
        {managePeriod && <JobPicker jobs={state.jobs} selectedJobId={jobId} onSelect={setJobId} label={manage ? `Job for ${mode.toLowerCase()}` : "Delivery period"} period={jobPeriod} onPeriodChange={(period) => { setJobPeriod(period); setPage(1); }} onClear={clear} showJobResults={manage} />}
        {manage && !voidedOnly && <>
          {pickedJob && <div className="action-row"><span className="result-summary">{pickedJob.invoice ? `${pickedJob.invoice.invoice_no} · ${invoiceStatus(pickedJob)}` : "No invoice yet"}</span>
            {pickedJob.invoice ? <><button onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}>View Invoice</button>{canEditInvoice(actor, pickedJob.job) && pickedJob.invoice.status === "Pending" && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}>Edit Invoice</button>}</> : canCreateInvoice(actor, pickedJob.job) && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}>Create Invoice</button>}</div>}</>}
        <div className={compactAccountsPanel ? "store-filter-grid billing-panel-filter-grid" : "store-filter-grid"}>
          <label className="list-search">{!compactAccountsPanel && `Search ${mode.toLowerCase()}`}<input aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={compactAccountsPanel ? `Search ${mode.toLowerCase()}` : "Job, invoice, customer, vehicle or reference"} /></label>
          {showStatusFilter && <label>Status<select aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All</option>{statusOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
          {showPaymentModeFilter && <label>Payment mode<select aria-label="Payment mode filter" value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value as "ALL" | PaymentMode); setPage(1); }}><option value="ALL">All</option>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as PaymentMode[]).map((value) => <option key={value}>{value}</option>)}</select></label>}
          {mode === "Invoices" && actor.role === "admin" && <label className="checkbox-line"><input type="checkbox" aria-label="Show voided only" checked={voidedOnly} onChange={(event) => toggleVoidedOnly(event.target.checked)} /> Show voided only</label>}
          <ListSearchActions onClear={clear} />
        </div>
        <PaginationToolbar controls={<DownloadMenu report={{ title: mode, filters: activeFilterSummary({ Search: search.trim(), Status: status, "Payment mode": paymentMode, "Show voided only": voidedOnly ? "Yes" : "No" }), columns, rows: filtered }} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${mode} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
        <div className="table-wrap"><table aria-label={`${mode} manager`}><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}<th>Actions</th></tr></thead><tbody>{paged.items.map((record) => {
          const open = expanded === record.key;
          const quickPay = mode === "Invoices" && !voidedOnly && record.view.invoice?.status === "Pending" && canRecordOrVoidPayment(actor, record.view.job);
          const highlightClass = accountsRowHighlight(mode, record, compactAccountsPanel);
          return <Fragment key={record.key}>
            <tr className={[record.kind === "void" ? "billing-row-void" : "", highlightClass, inline ? "billing-row-click" : ""].filter(Boolean).join(" ") || undefined} {...(inline ? { tabIndex: 0, "aria-expanded": open, "aria-controls": `billing-detail-${record.key}`, onClick: () => toggle(record.key), onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); toggle(record.key); } } } : {})}>{columns.map((column) => <td key={column.header}>{String(column.value(record))}</td>)}<td><div className="grid-actions billing-table-actions">
              {mode === "Invoices" && <><button type="button" className="billing-table-action" onClick={(event) => { event.stopPropagation(); setInvoiceDialog({ action: "view", view: record.view }); }}><Eye size={15} />View</button><DocumentDownloadButton kind="invoice" view={record.view} label="Download" className="billing-table-action" />{quickPay && <button type="button" className="billing-table-action billing-table-action-primary" onClick={(event) => { event.stopPropagation(); setPaymentDialog(record.view); }}><Check size={15} />Quick Mark Paid</button>}</>}
              {mode === "Payments" && record.payment && <DocumentDownloadButton kind="payment-receipt" view={record.view} label="Receipt" className="billing-table-action" />}
              {mode === "Delivery" && <DocumentDownloadButton kind="gate-pass" view={record.view} label="Gate pass" className="billing-table-action" />}
            </div></td></tr>
            {inline && open && <tr className="billing-detail-row"><td colSpan={columns.length + 1} id={`billing-detail-${record.key}`}><BillingDetail record={record} actor={actor} mutate={mutate} /></td></tr>}
          </Fragment>;
        })}</tbody></table></div>
        {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><FilterClearButton onClick={clear} label="Clear filters" /></div>}
        <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
        {invoiceDialog && <InvoiceDialog action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)} />}
        {paymentDialog?.invoice && <PaymentDialog view={paymentDialog} actor={actor} mutate={mutate} onClose={() => setPaymentDialog(undefined)} />}
      </div>
    </section>
  );
}

export function AccountsReconciliationQueues({ jobs }: { jobs: JobView[] }) {
  const active = jobs.filter((view) => view.job.main_status !== "CANCELLED");
  const awaitingInvoice = active.filter((view) => view.job.main_status === "COMPLETED" && !billingReconciliation(view).invoice);
  const awaitingPayment = active.filter((view) => view.job.main_status === "COMPLETED" && Boolean(billingReconciliation(view).invoice) && !billingReconciliation(view).payment);
  const complete = active.filter((view) => view.job.main_status === "CLOSED" && billingReconciliation(view).complete);
  const exceptions = active.filter((view) => view.job.main_status === "CLOSED" && !billingReconciliation(view).complete);
  return <section className="editor-block" aria-label="Accounts reconciliation queues">
    <h3>Accounts reconciliation queues</h3>
    <div className="linked-grid"><div><span>Awaiting invoice</span><strong>{awaitingInvoice.length}</strong></div><div><span>Invoices awaiting payment</span><strong>{awaitingPayment.length}</strong></div><div><span>Completed handovers</span><strong>{complete.length}</strong></div><div><span>Closed exceptions</span><strong>{exceptions.length}</strong></div></div>
    {exceptions.length > 0 && <div className="table-wrap"><table aria-label="Closed exceptions"><thead><tr><th>Job</th><th>Customer</th><th>Missing records</th></tr></thead><tbody>{exceptions.map((view) => <tr key={view.job.id}><td>{view.job.job_no}</td><td>{view.customer.name}</td><td>{billingReconciliation(view).missing.join(", ")}</td></tr>)}</tbody></table></div>}
  </section>;
}

/** Inline expand: header + status, facts, lines with per-line GST, totals, then Record Payment / Void with a required reason. */
function BillingDetail({ record, actor, mutate }: { record: BillingRecord; actor: User; mutate: Mutate }) {
  const { view, payment } = record;
  const invoice = view.invoice;
  const canAct = canRecordOrVoidPayment(actor, view.job);
  const terminal = view.job.main_status === "CLOSED" || view.job.main_status === "CANCELLED";
  const receipt = view.receipt && payment && view.receipt.invoice_id === payment.invoice_id ? view.receipt : undefined;
  const totals = invoice ? invoiceTotals(view.invoice_items.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? invoice.gst_rate })), invoice.discount) : undefined;
  const status = payment ? (payment.voided_at ? "Void" : "Received") : invoiceStatus(view);
  return <div className="billing-detail" aria-label={`${view.job.job_no} detail`}>
    <div className="panel-actions"><div><h3>{payment ? "Payment" : "Invoice"} · {invoice?.invoice_no ?? view.job.job_no} <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span></h3><p>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}{invoice?.tally_invoice_no ? ` · Tally ${invoice.tally_invoice_no}` : ""}</p></div></div>
    {payment && <div className="linked-grid"><div><span>Invoice</span><strong>{invoice?.invoice_no ?? "-"}</strong></div><div><span>Mode</span><strong>{payment.mode === "Other" ? `Other (${payment.other_detail})` : payment.mode}</strong></div><div><span>Reference</span><strong>{payment.reference || "-"}</strong></div><div><span>Receipt</span><strong>{receipt?.receipt_no ?? "-"}</strong></div><div><span>Amount</span><strong>{money(payment.amount)}</strong></div>{payment.voided_at && <div><span>Void reason</span><strong>{payment.void_reason}</strong></div>}</div>}
    {invoice && <div className="table-wrap"><table aria-label="Invoice lines"><thead><tr><th>Type</th><th>Description</th><th>Qty</th><th>Rate</th><th>GST type</th><th>GST %</th><th>Amount</th></tr></thead><tbody>{view.invoice_items.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.description}</td><td>{item.qty}</td><td>{money(item.rate)}</td><td>{item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST")}</td><td>{item.gst_rate ?? invoice.gst_rate}%</td><td>{money(item.qty * item.rate)}</td></tr>)}</tbody></table></div>}
    {invoice && totals && <div className="invoice-totals" aria-label="Invoice summary"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(invoice.total)}</strong></span></div>}
    {invoice?.voided_at && <p className="permission-note">Invoice voided on {invoice.voided_at}: {invoice.void_reason}</p>}
    {payment?.voided_at && <p className="permission-note">Payment voided on {payment.voided_at}: {payment.void_reason}</p>}
    {record.kind === "unpaid" && invoice && (canAct ? <RecordPaymentForm invoice={invoice} actor={actor} mutate={mutate} /> : <p className="permission-note">Only the Owner and Accounts can record payment.</p>)}
    {payment && !payment.voided_at && actor.role === "admin" && <InlineVoid label="Void Payment" hint="Voiding reopens the Invoice and voids the Receipt." onVoid={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} mutate={mutate} />}
    {!payment && invoice && actor.role === "admin" && canVoidCurrentInvoice(actor, view) && <InlineVoid label="Void Invoice" hint="Voiding unlocks the material rows this invoice billed." onVoid={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} mutate={mutate} />}
  </div>;
}

function InlineVoid({ label, hint, onVoid, mutate }: { label: string; hint: string; onVoid: (db: Database, reason: string) => void; mutate: Mutate }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  if (!open) return <div className="action-row"><button type="button" className="danger-action" onClick={() => setOpen(true)}>{label}</button></div>;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!reason.trim()) { setError("A reason is required."); return; }
    mutate((db) => onVoid(db, reason), setError);
  };
  return <form className="billing-dialog-form" onSubmit={submit} aria-label={label}>
    <p className="permission-note">{hint}</p>
    <label>Void reason<textarea aria-label={`${label} reason`} required value={reason} onChange={(event) => setReason(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
    <div className="action-row"><button type="button" onClick={() => { setOpen(false); setReason(""); setError(""); }}>Cancel</button><button type="submit" className="danger-action">Confirm {label}</button></div>
  </form>;
}

/** Record Payment: mode + reference; the amount is always the invoice total. */
function RecordPaymentForm({ invoice, actor, mutate }: { invoice: { id: number; total: number }; actor: User; mutate: Mutate }) {
  const [mode, setMode] = useState<PaymentMode>("UPI");
  const [otherDetail, setOtherDetail] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const record = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    mutate((db) => { recordPaymentForActor(db, invoice.id, actor.id, { mode, otherDetail, reference, notes }); }, setError);
  };
  return <form className="billing-dialog-form" onSubmit={record} aria-label="Quick mark paid">
    <div className="form-grid"><label>Amount<input aria-label="Payment amount" value={money(invoice.total)} disabled readOnly /></label><label>Mode<select aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>{mode === "Other" && <label>Other detail<input aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)} /></label>}<label>Reference (optional)<input aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)} /></label></div><label>Notes (optional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
    <div className="action-row"><button type="submit" className="primary-action">Confirm Payment</button></div>
  </form>;
}

export interface InvoiceDialogProps {
  action: "create" | "view" | "edit";
  view: JobView;
  candidates?: JobView[];
  fixedJob?: boolean;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}

export function InvoiceDialog({ action, view, candidates = [], fixedJob = false, actor, mutate, onClose }: InvoiceDialogProps) {
  const [selected, setSelected] = useState(view);
  const invoice = selected.invoice;
  const draftFor = (source: JobView) => buildInvoiceDraft(source);
  const toDrafts = (source: JobView): InvoiceItemDraft[] => source.invoice
    ? source.invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_type: item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST"), gst_rate: item.gst_rate ?? source.invoice!.gst_rate, material_row_id: item.material_row_id ?? undefined }))
    : draftFor(source).lines;
  const [tally, setTally] = useState(invoice?.tally_invoice_no ?? "");
  const [discount, setDiscount] = useState(invoice?.discount ?? draftFor(selected).discount);
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [editNote, setEditNote] = useState("");
  const [documentAvailable, setDocumentAvailable] = useState(Boolean(invoice?.document_available ?? true));
  const [items, setItems] = useState<InvoiceItemDraft[]>(toDrafts(selected));
  const [error, setError] = useState("");
  const readOnly = action === "view";
  const financialLocked = Boolean(invoice && selected.payments.some((payment) => payment.invoice_id === invoice.id && !payment.voided_at));
  const lockFinancials = readOnly || financialLocked;
  const totals = invoiceTotals(items.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate })), discount);
  const warning = unissuedWarning(draftFor(selected).unissuedRows);
  const lateMaterials = invoice ? pickableMaterialLines(selected).filter((line) => !items.some((item) => item.material_row_id === line.material_row_id)) : [];
  const chooseJob = (jobId: number) => {
    const next = candidates.find((candidate) => candidate.job.id === jobId);
    if (!next) return;
    setSelected(next);
    setTally("");
    setDiscount(draftFor(next).discount);
    setNotes("");
    setDocumentAvailable(true);
    setItems(toDrafts(next));
  };
  const updateItem = (index: number, patch: Partial<InvoiceItemDraft>) => setItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const ok = mutate((db) => action === "create"
      ? createInvoiceForActor(db, selected.job.id, actor.id, { tallyInvoiceNo: tally, discount, notes, documentAvailable, items })
      : saveInvoiceForActor(db, invoice!.id, actor.id, { tallyInvoiceNo: tally, discount, notes, documentAvailable, items, note: editNote }), setError);
    if (ok) onClose();
  };
  return <Dialog title={`${action[0].toUpperCase() + action.slice(1)} Invoice`} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide className="dialog-document-editor" footer={!readOnly && <button className="primary-action" type="submit" form="invoice-dialog-form">{action === "edit" ? "Update Invoice" : "Save Invoice"}</button>}><form id="invoice-dialog-form" className="billing-dialog-form" onSubmit={submit}>
    {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>}
    {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>}
    <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div>
    <div className="estimate-items"><div className="line-items-header"><strong>Invoice items</strong>{!lockFinancials && <button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}><Plus size={16} />Add Item</button>}</div><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST type</span><span>GST rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate || 18 }) })}><option>CGST+SGST</option><option>IGST</option><option>No GST</option></select>{item.gst_type === "No GST" ? <span className="gst-no-rate">0%</span> : <SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />} {!lockFinancials && <button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div>
    <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div>
    <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label><label className="checkbox-line"><input type="checkbox" checked={documentAvailable} disabled={readOnly} onChange={(event) => setDocumentAvailable(event.target.checked)} /> Document available</label>
    {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>}
    {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference, notes, and document availability can still be updated.</p>}
    {error && <p className="error-text" role="alert">{error}</p>}
  </form></Dialog>;
}


function PaymentDialog({ view, actor, mutate, onClose }: { view: JobView; actor: User; mutate: Mutate; onClose: () => void }) {
  const invoice = view.invoice!;
  return <Dialog title="Quick Mark Paid" subtitle={`${view.job.job_no} · ${invoice.invoice_no}`} onClose={onClose} footer={null}><RecordPaymentForm invoice={invoice} actor={actor} mutate={(action, onError) => {
    const ok = mutate(action, onError);
    if (ok) onClose();
    return ok;
  }} /></Dialog>;
}

/** Job Card Invoice tab: current invoice with per-line GST and totals, or the next step towards creating one. */
export function JobInvoicePanel({ view, actor, mutate, onOpen, onEstimate }: { view: JobView; actor: User; mutate: Mutate; onOpen: () => void; onEstimate: () => void }) {
  const invoice = view.invoice;
  const [voiding, setVoiding] = useState(false);
  const canVoidInvoice = Boolean(invoice && !invoice.voided_at) && actor.role === "admin" && !view.payments.some((item) => item.invoice_id === invoice!.id && !item.voided_at) && view.job.main_status !== "CLOSED" && view.job.main_status !== "CANCELLED";
  const actions = resolveJobDocumentActions("invoice", view, actor);
  const estimateActions = resolveJobDocumentActions("estimate", view, actor);
  const warning = unissuedWarning(buildInvoiceDraft(view).unissuedRows);
  if (!invoice) {
    return <section className="editor-block job-card-invoice" aria-label="Job invoice">
      <p className="empty-state">No invoice yet.{view.estimate?.status === "Approved" ? "" : " Approve the Estimate first."}</p>
      {warning && <p className="permission-note" role="status">{warning}</p>}
      <div className="action-row">{estimateActions.includes("approve-estimate") && <button type="button" className="primary-action" onClick={onEstimate}>Approve Estimate</button>}{actions.includes("create-invoice") && <button type="button" className="primary-action" onClick={onOpen}>Create Invoice</button>}</div>
    </section>;
  }
  const totals = invoiceTotals(view.invoice_items.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? invoice.gst_rate })), invoice.discount);
  return <section className="editor-block job-card-invoice" aria-label="Job invoice">
    <div className="panel-actions"><div><h3>{invoice.invoice_no}</h3><p>{invoice.status}{invoice.tally_invoice_no ? ` · Tally ${invoice.tally_invoice_no}` : ""}</p></div><div className="action-row">{actions.includes("edit-invoice") && <button type="button" className="primary-action" onClick={onOpen}>Edit Invoice</button>}{canVoidInvoice && <button type="button" className="danger-action" onClick={() => setVoiding(true)}>Void Invoice</button>}</div></div>
    <div className="table-wrap"><table aria-label="Invoice lines"><thead><tr><th>Type</th><th>Description</th><th>Qty</th><th>Rate</th><th>GST type</th><th>GST %</th><th>Amount</th></tr></thead><tbody>{view.invoice_items.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.description}</td><td>{item.qty}</td><td>{money(item.rate)}</td><td>{item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST")}</td><td>{item.gst_rate ?? invoice.gst_rate}%</td><td>{money(item.qty * item.rate)}</td></tr>)}</tbody></table></div>
    {warning && <p className="permission-note" role="status">{warning}</p>}
    <div className="invoice-totals" aria-label="Invoice summary"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(invoice.total)}</strong></span></div>
    {voiding && <VoidReasonDialog title="Void Invoice?" subtitle={`${view.job.job_no} · Unlocks the material rows it billed`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} />}
  </section>;
}

function VoidReasonDialog({ title, subtitle, action, onClose, mutate }: { title: string; subtitle: string; action: (db: Database, reason: string) => void; onClose: () => void; mutate: Mutate }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!reason.trim()) { setError("A reason is required."); return; }
    if (mutate((db) => action(db, reason), setError)) onClose();
  };
  return <Dialog title={title} subtitle={subtitle} onClose={onClose} footer={<button className="danger-action" type="submit" form="void-reason-dialog-form">Void</button>}><form id="void-reason-dialog-form" className="billing-dialog-form" onSubmit={submit}>
    <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
  </form></Dialog>;
}

/** Payment tab: Record Payment (mode + reference) for an open Invoice; the full payment, its Receipt and voiding. */
export function JobPaymentPanel({ view, actor, mutate }: { view: JobView; actor: User; mutate: Mutate }) {
  const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;
  const payment = invoice ? view.payments.find((item) => item.invoice_id === invoice.id && !item.voided_at) : undefined;
  const receipt = view.receipt && !view.receipt.voided_at && invoice && view.receipt.invoice_id === invoice.id ? view.receipt : undefined;
  const [voiding, setVoiding] = useState(false);
  const terminal = view.job.main_status === "CLOSED" || view.job.main_status === "CANCELLED";
  const canAct = canMutateBilling(actor) && !terminal;
  if (!invoice) return <section className="editor-block job-card-payment" aria-label="Job payment"><p className="empty-state">No invoice yet. Create an Invoice before recording payment.</p></section>;
  const voided = (view.payment_history ?? view.payments).filter((item) => item.invoice_id === invoice.id && item.voided_at);
  return <section className="editor-block job-card-payment" aria-label="Job payment">
    <div className="panel-actions"><div><h3>{invoice.invoice_no}</h3><p>{invoice.status} · Total {money(invoice.total)}</p></div>{payment && actor.role === "admin" && <button type="button" className="danger-action" onClick={() => setVoiding(true)}>Void Payment</button>}</div>
    {payment ? <div className="table-wrap"><table aria-label="Payment"><thead><tr><th>Receipt</th><th>Mode</th><th>Reference</th><th>Amount</th></tr></thead><tbody><tr><td>{receipt?.receipt_no ?? "-"}</td><td>{payment.mode === "Other" ? `Other (${payment.other_detail})` : payment.mode}</td><td>{payment.reference || "-"}</td><td>{money(payment.amount)}</td></tr></tbody></table></div>
      : canAct ? <RecordPaymentForm invoice={invoice} actor={actor} mutate={mutate} />
        : <p className="permission-note">{terminal ? `This job is ${view.job.main_status} and read-only.` : "Only the Owner and Accounts can record payment."}</p>}
    {voided.length > 0 && <div className="table-wrap"><table aria-label="Voided payments"><thead><tr><th>Mode</th><th>Reference</th><th>Amount</th><th>Void reason</th></tr></thead><tbody>{voided.map((item) => <tr key={item.id}><td>{item.mode}</td><td>{item.reference || "-"}</td><td>{money(item.amount)}</td><td>{item.void_reason}</td></tr>)}</tbody></table></div>}
    {voiding && payment && <VoidReasonDialog title="Void Payment?" subtitle={`${view.job.job_no} · Reopens the Invoice and voids the Receipt`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} />}
  </section>;
}
