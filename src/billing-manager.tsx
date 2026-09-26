import type { Database } from "sql.js";
import { Plus, Trash2 } from "lucide-react";
import { Fragment, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { JobPicker, jobMatchesPeriod, todayJobPeriod, type JobPeriod } from "./job-picker";
import {
  canMutateBilling,
  createInvoiceForActor,
  markJobDeliveredForActor,
  recordPaymentForActor,
  updateDeliveryForActor,
  saveInvoiceForActor,
  voidInvoiceForActor,
  voidPaymentForActor,
  type PaymentInput,
} from "./db";
import { resolveJobDocumentActions } from "./job-documents";
import { buildInvoiceDraft, canRecordOrVoidPayment, canVoidCurrentInvoice, DEFAULT_GST_BY_KIND, invoiceTotals, mixedPaymentRows, pickableMaterialLines, unissuedWarning, type PaymentListKind } from "./invoice-math";
import { activeFilterSummary, DEFAULT_PAGE_SIZE, normalizeSearch, paginate } from "./list-utils";
import type { ExportColumn } from "./export-utils";
import type { JobView, Payment, PaymentMode, User, WorkshopState } from "./types";
import { Dialog, DownloadMenu, ListSearchActions, PageSizeSelect } from "./ui-kit";

export type BillingMode = "Invoices" | "Payments" | "Delivery";
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
type BillingRecord = { key: string; view: JobView; payment?: Payment; kind?: PaymentListKind };
type Editor = { action: "view" | "edit" | "deliver"; record: BillingRecord };
type InvoiceItemDraft = { id?: number; kind: "Service" | "Material"; description: string; qty: number; rate: number; gst_rate: number; material_row_id?: number };

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function delivered(view: JobView) {
  return Boolean(view.checklist_items.find((item) => item.stage === "CLOSED" && item.label === "Delivered" && item.checked_at));
}

function recordsFor(mode: BillingMode, jobs: JobView[], includeUnpaid: boolean): BillingRecord[] {
  if (mode === "Invoices") return jobs.filter((view) => view.invoice).map((view) => ({ key: `invoice-${view.job.id}`, view }));
  if (mode === "Payments") return mixedPaymentRows(jobs, { includeUnpaid });
  return jobs.filter((view) => view.gate_pass || view.job.main_status === "CLOSED").map((view) => ({ key: `delivery-${view.job.id}`, view }));
}

function invoiceStatus(view: JobView) {
  return view.invoice ? (view.invoice.voided_at ? "Void" : view.invoice.status === "Open" ? "Unpaid" : view.invoice.status) : "Not created";
}

function paymentStatus(record: BillingRecord) {
  return record.kind === "unpaid" ? "Unpaid" : record.kind === "void" ? "Void" : "Received";
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
  const [editor, setEditor] = useState<Editor>();
  const [invoiceDialog, setInvoiceDialog] = useState<{ action: "create" | "view" | "edit"; view: JobView }>();
  const [jobId, setJobId] = useState<number>();
  const [jobPeriod, setJobPeriod] = useState<JobPeriod>(todayJobPeriod);
  const [expanded, setExpanded] = useState<string>();
  const editable = canMutateBilling(actor);
  // The Payments screen (panel) is the mixed list with unpaid rows; the Manage Payment tab lists payments only.
  const allRecords = useMemo(() => recordsFor(mode, state.jobs, panel), [mode, state.jobs, panel]);
  const recordStatus = (record: BillingRecord) => mode === "Invoices" ? invoiceStatus(record.view) : mode === "Payments" ? paymentStatus(record) : delivered(record.view) ? "Delivered" : "Pending";
  const filtered = allRecords.filter((record) => {
    const needle = normalizeSearch(search);
    return jobMatchesPeriod(record.view, jobPeriod) && (!needle || searchText(record).includes(needle)) && (status === "ALL" || recordStatus(record) === status);
  });
  const manage = !panel && mode !== "Delivery";
  const managePeriod = !panel;
  const pickedJob = state.jobs.find((view) => view.job.id === jobId);
  const paged = paginate(filtered, page, pageSize);
  const statusOptions = mode === "Invoices" ? ["Unpaid", "Cleared", "Void"] : mode === "Payments" ? (panel ? ["Unpaid", "Received", "Void"] : ["Received", "Void"]) : ["Pending", "Delivered"];
  const clear = () => { setSearch(""); setStatus("ALL"); setJobId(undefined); setJobPeriod(todayJobPeriod()); setPage(1); };
  const columns: ExportColumn<BillingRecord>[] = mode === "Invoices"
    ? [{ header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "Not created" }, { header: "Customer", value: (row) => row.view.customer.name }, { header: "Total", value: (row) => row.view.invoice?.total ?? 0 }, { header: "Status", value: (row) => invoiceStatus(row.view) }]
    : mode === "Payments"
      ? [{ header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "" }, { header: "Customer", value: (row) => row.view.customer.name }, { header: "Amount", value: (row) => row.payment?.amount ?? row.view.invoice?.total ?? 0 }, { header: "Mode", value: (row) => row.payment?.mode ?? "-" }, { header: "Reference", value: (row) => row.payment?.reference ?? "" }, { header: "Status", value: (row) => paymentStatus(row) }]
      : [{ header: "Job", value: (row) => row.view.job.job_no }, { header: "Vehicle", value: (row) => row.view.vehicle.number }, { header: "Gate pass", value: (row) => row.view.gate_pass?.gate_pass_no ?? "Pending" }, { header: "Delivery", value: (row) => delivered(row.view) ? "Delivered" : "Pending" }];
  const inline = mode !== "Delivery";
  const toggle = (key: string) => { setExpanded((current) => current === key ? undefined : key); const hit = allRecords.find((record) => record.key === key); if (manage && hit) setJobId(hit.view.job.id); };

  return (
    <section className={panel ? "workspace single-panel" : "billing-manager"} data-billing-manager={mode} role="tabpanel">
      <div className={panel ? "desk-panel" : "manager-panel"} role={panel ? undefined : "tabpanel"}>
        <div className="panel-actions"><div><h2>{mode}</h2><p>{mode === "Payments" && panel ? "Unpaid invoices first, then received and void payments" : "All workshop jobs"}</p></div></div>
        {!editable && <p className="permission-note">Read-only billing access. Owner/Admin or Accounts is required to make changes.</p>}
        {inline && <p className="permission-note" role="note">Click a row for lines, GST and totals.{manage ? "" : " Create or edit invoices from the Job Card."}</p>}
        {managePeriod && <JobPicker jobs={state.jobs} selectedJobId={jobId} onSelect={setJobId} label={manage ? `Job for ${mode.toLowerCase()}` : "Delivery period"} period={jobPeriod} onPeriodChange={(period) => { setJobPeriod(period); setPage(1); }} onClear={clear} showJobResults={manage} />}
        {manage && <>
          {pickedJob && <div className="action-row"><span className="result-summary">{pickedJob.invoice ? `${pickedJob.invoice.invoice_no} · ${invoiceStatus(pickedJob)}` : "No invoice yet"}</span>
            {pickedJob.invoice ? <><button onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}>View Invoice</button>{editable && pickedJob.invoice.status !== "Cleared" && !pickedJob.invoice.voided_at && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}>Edit Invoice</button>}</> : editable && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}>Create Invoice</button>}</div>}</>}
        <div className="store-filter-grid">
          <label className="list-search">Search {mode.toLowerCase()}<input aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, invoice, customer, vehicle or reference" /></label>
          <label>Status<select aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All</option>{statusOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <ListSearchActions onClear={clear} />
        </div>
        <div className="list-result-controls"><DownloadMenu report={{ title: mode, filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel={`${mode} records per page`} value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
        <BillingPagination page={paged.page} count={paged.pageCount} onChange={setPage} />
        <div className="table-wrap"><table aria-label={`${mode} manager`}><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}{(!inline || panel) && <th>{inline ? "" : "Actions"}</th>}</tr></thead><tbody>{paged.items.map((record) => {
          const open = expanded === record.key;
          const recordRow = record.kind === "unpaid" && canRecordOrVoidPayment(actor, record.view.job);
          return <Fragment key={record.key}>
            <tr className={[record.kind === "void" || (mode === "Invoices" && record.view.invoice?.voided_at) ? "billing-row-void" : "", inline ? "billing-row-click" : ""].filter(Boolean).join(" ") || undefined} {...(inline ? { tabIndex: 0, "aria-expanded": open, "aria-controls": `billing-detail-${record.key}`, onClick: () => toggle(record.key), onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); toggle(record.key); } } } : {})}>{columns.map((column) => <td key={column.header}>{String(column.value(record))}</td>)}{inline ? (panel && <td>{recordRow && <button type="button" className="primary-action" onClick={(event) => { event.stopPropagation(); setExpanded(record.key); }}>Record Payment</button>}</td>) : <td><div className="action-row">
              <button onClick={() => setEditor({ action: "view", record })}>View</button>{editable && <><button onClick={() => setEditor({ action: "edit", record })}>Edit</button>{!delivered(record.view) && <button className="primary-action" onClick={() => setEditor({ action: "deliver", record })}>Delivered</button>}</>}
            </div></td>}</tr>
            {inline && open && <tr className="billing-detail-row"><td colSpan={columns.length + (!inline || panel ? 1 : 0)} id={`billing-detail-${record.key}`}><BillingDetail record={record} actor={actor} mutate={mutate} /></td></tr>}
          </Fragment>;
        })}</tbody></table></div>
        {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={clear}>Clear filters</button></div>}
        <BillingPagination page={paged.page} count={paged.pageCount} onChange={setPage} />
        {invoiceDialog && <InvoiceDialog action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)} />}
        {editor && <DeliveryDialog editor={editor} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)} />}
      </div>
    </section>
  );
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
    {invoice && <div className="table-wrap"><table aria-label="Invoice lines"><thead><tr><th>Type</th><th>Description</th><th>Qty</th><th>Rate</th><th>GST %</th><th>Amount</th></tr></thead><tbody>{view.invoice_items.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.description}</td><td>{item.qty}</td><td>{money(item.rate)}</td><td>{item.gst_rate ?? invoice.gst_rate}%</td><td>{money(item.qty * item.rate)}</td></tr>)}</tbody></table></div>}
    {invoice && totals && <div className="invoice-totals" aria-label="Invoice summary"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(invoice.total)}</strong></span></div>}
    {invoice?.voided_at && <p className="permission-note">Invoice voided: {invoice.void_reason}</p>}
    {record.kind === "unpaid" && invoice && (canAct ? <RecordPaymentForm invoice={invoice} actor={actor} mutate={mutate} /> : <p className="permission-note">{terminal ? `This job is ${view.job.main_status} and read-only.` : "Only the Owner and Accounts can record payment."}</p>)}
    {payment && !payment.voided_at && canAct && <InlineVoid label="Void Payment" hint="Voiding reopens the Invoice and voids the Receipt." onVoid={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} mutate={mutate} />}
    {!payment && invoice && canVoidCurrentInvoice(actor, view) && <InlineVoid label="Void Invoice" hint="Voiding unlocks the material rows this invoice billed." onVoid={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} mutate={mutate} />}
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
  const [error, setError] = useState("");
  const record = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    mutate((db) => { recordPaymentForActor(db, invoice.id, actor.id, { mode, otherDetail, reference }); }, setError);
  };
  return <form className="billing-dialog-form" onSubmit={record} aria-label="Record payment">
    <div className="form-grid"><label>Amount<input aria-label="Payment amount" value={money(invoice.total)} disabled readOnly /></label><label>Mode<select aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>{mode === "Other" && <label>Other detail<input aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)} /></label>}<label>Reference<input aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)} /></label></div>
    {error && <p className="error-text" role="alert">{error}</p>}
    <div className="action-row"><button type="submit" className="primary-action">Record Payment</button></div>
  </form>;
}

function BillingPagination({ page, count, onChange }: { page: number; count: number; onChange: (page: number) => void }) {
  if (count <= 1) return null;
  return <nav className="result-pagination" aria-label="Billing results pagination"><button disabled={page === 1} onClick={() => onChange(page - 1)}>Previous page</button><span>Page {page} of {count}</span><button disabled={page === count} onClick={() => onChange(page + 1)}>Next page</button></nav>;
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
    ? source.invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? source.invoice!.gst_rate, material_row_id: item.material_row_id ?? undefined }))
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
  return <Dialog title={`${action[0].toUpperCase() + action.slice(1)} Invoice`} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide><form className="billing-dialog-form" onSubmit={submit}>
    {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>}
    {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>}
    <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div>
    <div className="estimate-items"><strong>Invoice items</strong><div className="invoice-item invoice-item-heading"><span>Type</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST %</span><span>Amount</span><span>Action</span></div>{items.map((item, index) => <div className="invoice-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => { const kind = event.target.value as InvoiceItemDraft["kind"]; updateItem(index, { kind, gst_rate: DEFAULT_GST_BY_KIND[kind] }); }}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} GST`} type="number" min="0" max="100" step="0.01" value={item.gst_rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_rate: Number(event.target.value) })} /><output aria-label={`Invoice item ${index + 1} amount`}>{money(item.qty * item.rate)}</output>{!lockFinancials && <button type="button" className="remove-icon" title="Remove item" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}><Trash2 size={16} /></button>}</div>)}{!lockFinancials && <button type="button" className="add-action add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_rate: DEFAULT_GST_BY_KIND.Service }])}><Plus size={16} />Add Line Item</button>}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div>
    <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div>
    <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label><label className="checkbox-line"><input type="checkbox" checked={documentAvailable} disabled={readOnly} onChange={(event) => setDocumentAvailable(event.target.checked)} /> Document available</label>
    {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>}
    {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference, notes, and document availability can still be updated.</p>}
    {error && <p className="error-text" role="alert">{error}</p>}
    {!readOnly && <div className="dialog-actions"><button type="button" className="back-action" onClick={onClose}>Go back</button><button className="primary-action" type="submit">{action === "edit" ? "Update Invoice" : "Save Invoice"}</button></div>}
  </form></Dialog>;
}


function DeliveryDialog({ editor, actor, mutate, onClose }: { editor: Editor; actor: User; mutate: Mutate; onClose: () => void }) {
  const selected = editor.record.view;
  const [deliveryBy, setDeliveryBy] = useState(selected.job.delivery_by || actor.name);
  const [finalKm, setFinalKm] = useState(selected.job.final_km ?? selected.vehicle.km);
  const [acknowledgement, setAcknowledgement] = useState(selected.job.acknowledgement || "Customer acknowledged delivery");
  const title = editor.action === "deliver" ? "Mark Delivery" : `${editor.action[0].toUpperCase() + editor.action.slice(1)} Delivery`;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const ok = mutate((db) => editor.action === "deliver" ? markJobDeliveredForActor(db, selected.job.id, actor.id, deliveryBy, finalKm, acknowledgement) : updateDeliveryForActor(db, selected.job.id, actor.id, deliveryBy, finalKm, acknowledgement));
    if (ok) onClose();
  };
  const readOnly = editor.action === "view";
  return <Dialog title={title} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide><form className="billing-dialog-form" onSubmit={submit}>
    <div className="linked-grid"><div><span>Gate Pass</span><strong>{selected.gate_pass?.gate_pass_no ?? "Not generated"}</strong></div><div><span>State</span><strong>{delivered(selected) ? "Delivered" : "Pending delivery"}</strong></div></div>
    <div className="form-grid"><label>Delivered by<input data-dialog-initial-focus value={deliveryBy} disabled={readOnly} onChange={(event) => setDeliveryBy(event.target.value)} /></label><label>Final KM<input type="number" value={finalKm} disabled={readOnly} onChange={(event) => setFinalKm(Number(event.target.value))} /></label><label>Acknowledgement<input value={acknowledgement} disabled={readOnly} onChange={(event) => setAcknowledgement(event.target.value)} /></label></div>
    {!readOnly && <div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary-action" type="submit">{editor.action === "deliver" ? "Mark Delivered" : "Save"}</button></div>}
  </form></Dialog>;
}

/** Job Card Invoice tab: current invoice with per-line GST and totals, or the next step towards creating one. */
export function JobInvoicePanel({ view, actor, mutate, onOpen, onEstimate }: { view: JobView; actor: User; mutate: Mutate; onOpen: () => void; onEstimate: () => void }) {
  const invoice = view.invoice;
  const [voiding, setVoiding] = useState(false);
  const canVoidInvoice = Boolean(invoice && !invoice.voided_at) && canMutateBilling(actor) && !view.payments.some((item) => item.invoice_id === invoice!.id && !item.voided_at) && view.job.main_status !== "CLOSED" && view.job.main_status !== "CANCELLED";
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
    <div className="table-wrap"><table aria-label="Invoice lines"><thead><tr><th>Type</th><th>Description</th><th>Qty</th><th>Rate</th><th>GST %</th><th>Amount</th></tr></thead><tbody>{view.invoice_items.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.description}</td><td>{item.qty}</td><td>{money(item.rate)}</td><td>{item.gst_rate ?? invoice.gst_rate}%</td><td>{money(item.qty * item.rate)}</td></tr>)}</tbody></table></div>
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
  return <Dialog title={title} subtitle={subtitle} onClose={onClose}><form className="billing-dialog-form" onSubmit={submit}>
    <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
    <div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button className="danger-action" type="submit">Void</button></div>
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
    <div className="panel-actions"><div><h3>{invoice.invoice_no}</h3><p>{invoice.status} · Total {money(invoice.total)}</p></div>{payment && canAct && <button type="button" className="danger-action" onClick={() => setVoiding(true)}>Void Payment</button>}</div>
    {payment ? <div className="table-wrap"><table aria-label="Payment"><thead><tr><th>Receipt</th><th>Mode</th><th>Reference</th><th>Amount</th></tr></thead><tbody><tr><td>{receipt?.receipt_no ?? "-"}</td><td>{payment.mode === "Other" ? `Other (${payment.other_detail})` : payment.mode}</td><td>{payment.reference || "-"}</td><td>{money(payment.amount)}</td></tr></tbody></table></div>
      : canAct ? <RecordPaymentForm invoice={invoice} actor={actor} mutate={mutate} />
        : <p className="permission-note">{terminal ? `This job is ${view.job.main_status} and read-only.` : "Only the Owner and Accounts can record payment."}</p>}
    {voided.length > 0 && <div className="table-wrap"><table aria-label="Voided payments"><thead><tr><th>Mode</th><th>Reference</th><th>Amount</th><th>Void reason</th></tr></thead><tbody>{voided.map((item) => <tr key={item.id}><td>{item.mode}</td><td>{item.reference || "-"}</td><td>{money(item.amount)}</td><td>{item.void_reason}</td></tr>)}</tbody></table></div>}
    {voiding && payment && <VoidReasonDialog title="Void Payment?" subtitle={`${view.job.job_no} · Reopens the Invoice and voids the Receipt`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} />}
  </section>;
}
