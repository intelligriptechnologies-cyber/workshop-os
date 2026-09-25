import type { Database } from "sql.js";
import { useMemo, useState, type FormEvent } from "react";
import {
  canMutateBilling,
  createInvoiceForActor,
  editPaymentForActor,
  markJobDeliveredForActor,
  recordPaymentForActor,
  updateDeliveryForActor,
  saveInvoiceForActor,
  voidInvoiceForActor,
  voidPaymentForActor,
  type PaymentInput,
} from "./db";
import { activeFilterSummary, DEFAULT_PAGE_SIZE, normalizeSearch, paginate } from "./list-utils";
import type { ExportColumn } from "./export-utils";
import type { JobView, Payment, PaymentMode, User, WorkshopState } from "./types";
import { Dialog, DownloadMenu, ListSearchActions, PageSizeSelect } from "./ui-kit";

export type BillingMode = "Invoices" | "Payments" | "Delivery";
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
type BillingRecord = { key: string; view: JobView; payment?: Payment };
type Editor = { action: "create" | "view" | "edit" | "void" | "deliver"; record: BillingRecord };
type InvoiceItemDraft = { id?: number; kind: "Service" | "Material"; description: string; qty: number; rate: number };

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function delivered(view: JobView) {
  return Boolean(view.checklist_items.find((item) => item.stage === "CLOSED" && item.label === "Delivered" && item.checked_at));
}

function recordsFor(mode: BillingMode, jobs: JobView[]): BillingRecord[] {
  if (mode === "Invoices") return jobs.filter((view) => view.invoice || view.job.main_status === "COMPLETED").map((view) => ({ key: `invoice-${view.job.id}`, view }));
  if (mode === "Payments") return jobs.flatMap((view) => view.payments.map((payment) => ({ key: `payment-${payment.id}`, view, payment })));
  return jobs.filter((view) => view.gate_pass || view.job.main_status === "CLOSED").map((view) => ({ key: `delivery-${view.job.id}`, view }));
}

function searchText(record: BillingRecord) {
  const { view, payment } = record;
  return normalizeSearch([view.job.job_no, view.customer.name, view.customer.mobile, view.vehicle.number, view.invoice?.invoice_no, view.invoice?.tally_invoice_no, view.invoice?.status, payment?.amount, payment?.mode, payment?.other_detail, payment?.reference, view.gate_pass?.gate_pass_no, delivered(view) ? "delivered" : "pending"].join(" "));
}

export function BillingManager({ mode, state, actor, mutate, panel = true }: { mode: BillingMode; state: WorkshopState; actor: User; mutate: Mutate; panel?: boolean }) {
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [statusDraft, setStatusDraft] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [editor, setEditor] = useState<Editor>();
  const editable = canMutateBilling(actor);
  const allRecords = useMemo(() => recordsFor(mode, state.jobs), [mode, state.jobs]);
  const filtered = allRecords.filter((record) => {
    const needle = normalizeSearch(search);
    const recordStatus = mode === "Invoices" ? record.view.invoice?.status ?? "Not created" : mode === "Payments" ? record.payment?.mode ?? "" : delivered(record.view) ? "Delivered" : "Pending";
    return (!needle || searchText(record).includes(needle)) && (status === "ALL" || recordStatus === status);
  });
  const paged = paginate(filtered, page, pageSize);
  const statusOptions = mode === "Invoices" ? ["Not created", "Open", "Partial", "Cleared"] : mode === "Payments" ? ["UPI", "Cash", "Card", "Other"] : ["Pending", "Delivered"];
  const clear = () => { setSearchDraft(""); setSearch(""); setStatusDraft("ALL"); setStatus("ALL"); setPage(1); };
  const apply = () => { setSearch(searchDraft); setStatus(statusDraft); setPage(1); };
  const columns: ExportColumn<BillingRecord>[] = mode === "Invoices"
    ? [{ header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "Not created" }, { header: "Customer", value: (row) => row.view.customer.name }, { header: "Total", value: (row) => row.view.invoice?.total ?? 0 }, { header: "Status", value: (row) => row.view.invoice?.status ?? "Not created" }]
    : mode === "Payments"
      ? [{ header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "" }, { header: "Amount", value: (row) => row.payment?.amount ?? 0 }, { header: "Mode", value: (row) => row.payment?.mode ?? "" }, { header: "Reference", value: (row) => row.payment?.reference ?? "" }]
      : [{ header: "Job", value: (row) => row.view.job.job_no }, { header: "Vehicle", value: (row) => row.view.vehicle.number }, { header: "Gate pass", value: (row) => row.view.gate_pass?.gate_pass_no ?? "Pending" }, { header: "Delivery", value: (row) => delivered(row.view) ? "Delivered" : "Pending" }];
  const creatable = mode === "Invoices"
    ? state.jobs.filter((view) => view.job.main_status === "COMPLETED" && !view.invoice)
    : mode === "Payments" ? state.jobs.filter((view) => view.invoice && view.invoice.status !== "Cleared") : [];

  return (
    <section className={panel ? "workspace single-panel" : "billing-manager"} data-billing-manager={mode} role="tabpanel">
      <div className={panel ? "desk-panel" : "manager-panel"} role={panel ? undefined : "tabpanel"}>
        <div className="panel-actions"><div><h2>{mode}</h2><p>All workshop jobs</p></div>{editable && creatable.length > 0 && <button className="primary-action" onClick={() => setEditor({ action: "create", record: { key: `create-${creatable[0].job.id}`, view: creatable[0] } })}>Create {mode === "Invoices" ? "Invoice" : "Payment"}</button>}</div>
        {!editable && <p className="permission-note">Read-only billing access. Owner/Admin or Accounts is required to make changes.</p>}
        <div className="store-filter-grid" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); apply(); } }}>
          <label className="list-search">Search {mode.toLowerCase()}<input aria-label={`Search ${mode.toLowerCase()}`} value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Job, invoice, customer, vehicle or reference" /></label>
          <label>Status<select aria-label={`${mode} status filter`} value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}><option value="ALL">All</option>{statusOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <ListSearchActions onClear={clear} onSearch={apply} />
        </div>
        <div className="list-result-controls"><DownloadMenu report={{ title: mode, filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel={`${mode} records per page`} value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div>
        <BillingPagination page={paged.page} count={paged.pageCount} onChange={setPage} />
        <div className="table-wrap"><table aria-label={`${mode} manager`}><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}<th>Actions</th></tr></thead><tbody>{paged.items.map((record) => <tr key={record.key}>{columns.map((column) => <td key={column.header}>{String(column.value(record))}</td>)}<td><div className="action-row"><button onClick={() => setEditor({ action: "view", record })}>View</button>{editable && <><button onClick={() => setEditor({ action: "edit", record })}>Edit</button>{mode !== "Delivery" && <button className="danger-action" onClick={() => setEditor({ action: "void", record })}>Void</button>}{mode === "Delivery" && !delivered(record.view) && <button className="primary-action" onClick={() => setEditor({ action: "deliver", record })}>Delivered</button>}</>}</div></td></tr>)}</tbody></table></div>
        {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><button onClick={clear}>Clear filters</button></div>}
        <BillingPagination page={paged.page} count={paged.pageCount} onChange={setPage} />
        {editor && mode === "Invoices" && (editor.action === "create" || editor.action === "view" || editor.action === "edit")
          ? <InvoiceDialog action={editor.action} view={editor.record.view} candidates={creatable} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)} />
          : editor && <BillingDialog mode={mode} editor={editor} candidates={creatable} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)} />}
      </div>
    </section>
  );
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
  const initialItems = (invoice ? selected.invoice_items : selected.estimate_items).map((item) => ({ id: invoice ? item.id : undefined, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate }));
  const [tally, setTally] = useState(invoice?.tally_invoice_no ?? "");
  const [discount, setDiscount] = useState(invoice?.discount ?? selected.estimate?.discount ?? 0);
  const [gstRate, setGstRate] = useState(invoice?.gst_rate ?? selected.estimate?.gst_rate ?? 18);
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [documentAvailable, setDocumentAvailable] = useState(Boolean(invoice?.document_available ?? true));
  const [items, setItems] = useState<InvoiceItemDraft[]>(initialItems);
  const [error, setError] = useState("");
  const readOnly = action === "view";
  const financialLocked = Boolean(invoice && selected.payments.some((payment) => payment.invoice_id === invoice.id));
  const lockFinancials = readOnly || financialLocked;
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxable = Math.max(0, subtotal - discount);
  const gstAmount = Math.round(taxable * gstRate) / 100;
  const total = Math.round((taxable + gstAmount) * 100) / 100;
  const chooseJob = (jobId: number) => {
    const next = candidates.find((candidate) => candidate.job.id === jobId);
    if (!next) return;
    setSelected(next);
    setTally("");
    setDiscount(next.estimate?.discount ?? 0);
    setGstRate(next.estimate?.gst_rate ?? 18);
    setNotes("");
    setDocumentAvailable(true);
    setItems(next.estimate_items.map((item) => ({ kind: item.kind, description: item.description, qty: item.qty, rate: item.rate })));
  };
  const updateItem = (index: number, patch: Partial<InvoiceItemDraft>) => setItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const ok = mutate((db) => action === "create"
      ? createInvoiceForActor(db, selected.job.id, actor.id, { tallyInvoiceNo: tally, discount, gstRate, notes, documentAvailable, items })
      : saveInvoiceForActor(db, invoice!.id, actor.id, { tallyInvoiceNo: tally, discount, gstRate, notes, documentAvailable, items }), setError);
    if (ok) onClose();
  };
  return <Dialog title={`${action[0].toUpperCase() + action.slice(1)} Invoice`} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide><form className="billing-dialog-form" onSubmit={submit}>
    {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>}
    <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Discount<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label><label>GST %<input aria-label="Invoice GST" type="number" min="0" max="100" step="0.01" value={gstRate} disabled={lockFinancials} onChange={(event) => setGstRate(Number(event.target.value))} /></label></div>
    <div className="estimate-items"><strong>Invoice items</strong><div className="invoice-item invoice-item-heading"><span>Type</span><span>Description</span><span>Quantity</span><span>Rate</span><span>Amount</span><span>Action</span></div>{items.map((item, index) => <div className="invoice-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><output aria-label={`Invoice item ${index + 1} amount`}>{money(item.qty * item.rate)}</output>{!lockFinancials && <button type="button" className="danger-action" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && <button type="button" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0 }])}>Add Invoice Item</button>}</div>
    <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(subtotal)}</strong></span><span>Discount <strong>{money(discount)}</strong></span><span>GST <strong>{money(gstAmount)}</strong></span><span>Total <strong>{money(total)}</strong></span></div>
    <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label><label className="checkbox-line"><input type="checkbox" checked={documentAvailable} disabled={readOnly} onChange={(event) => setDocumentAvailable(event.target.checked)} /> Document available</label>
    {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference, notes, and document availability can still be updated.</p>}
    {error && <p className="error-text" role="alert">{error}</p>}
    {!readOnly && <div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button className="primary-action" type="submit">Save Invoice</button></div>}
  </form></Dialog>;
}

function BillingDialog({ mode, editor, candidates, actor, mutate, onClose }: { mode: BillingMode; editor: Editor; candidates: JobView[]; actor: User; mutate: Mutate; onClose: () => void }) {
  const [jobId, setJobId] = useState(editor.record.view.job.id);
  const selected = candidates.find((view) => view.job.id === jobId) ?? editor.record.view;
  const invoice = editor.record.view.invoice;
  const payment = editor.record.payment;
  const [tally, setTally] = useState(invoice?.tally_invoice_no ?? "");
  const [discount, setDiscount] = useState(invoice?.discount ?? selected.estimate?.discount ?? 0);
  const [gstRate, setGstRate] = useState(invoice?.gst_rate ?? selected.estimate?.gst_rate ?? 18);
  const [notes, setNotes] = useState(payment?.notes ?? invoice?.notes ?? "");
  const [documentAvailable, setDocumentAvailable] = useState(Boolean(invoice?.document_available ?? true));
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemDraft[]>(editor.record.view.invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate })));
  const [amount, setAmount] = useState(payment?.amount ?? Math.max(0, (selected.invoice?.total ?? 0) - selected.payments.reduce((sum, item) => sum + item.amount, 0)));
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(payment?.mode ?? "UPI");
  const [otherDetail, setOtherDetail] = useState(payment?.other_detail ?? "");
  const [reference, setReference] = useState(payment?.reference ?? "");
  const [reason, setReason] = useState("");
  const [deliveryBy, setDeliveryBy] = useState(editor.record.view.job.delivery_by || actor.name);
  const [finalKm, setFinalKm] = useState(editor.record.view.job.final_km ?? editor.record.view.vehicle.km);
  const [acknowledgement, setAcknowledgement] = useState(editor.record.view.job.acknowledgement || "Customer acknowledged delivery");
  const selectCandidate = (nextJobId: number) => {
    setJobId(nextJobId);
    if (editor.action !== "create") return;
    const next = candidates.find((view) => view.job.id === nextJobId);
    if (!next) return;
    if (mode === "Payments") {
      setAmount(Math.max(0, (next.invoice?.total ?? 0) - next.payments.reduce((sum, item) => sum + item.amount, 0)));
      setPaymentMode("UPI");
      setOtherDetail("");
      setReference("");
      setNotes("");
    } else if (mode === "Invoices") {
      setTally("");
      setDiscount(next.estimate?.discount ?? 0);
      setGstRate(next.estimate?.gst_rate ?? 18);
      setNotes("");
      setDocumentAvailable(true);
    }
  };
  const title = `${editor.action === "deliver" ? "Mark" : editor.action[0].toUpperCase() + editor.action.slice(1)} ${mode === "Invoices" ? "Invoice" : mode === "Payments" ? "Payment" : "Delivery"}`;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    let ok = false;
    if (editor.action === "void") ok = mutate((db) => mode === "Invoices" ? voidInvoiceForActor(db, invoice!.id, actor.id, reason) : voidPaymentForActor(db, payment!.id, actor.id, reason));
    else if (mode === "Invoices") ok = mutate((db) => editor.action === "create" ? createInvoiceForActor(db, selected.job.id, actor.id, { tallyInvoiceNo: tally, notes, documentAvailable }) : saveInvoiceForActor(db, invoice!.id, actor.id, { tallyInvoiceNo: tally, discount, gstRate, notes, documentAvailable, items: invoiceItems }));
    else if (mode === "Payments") {
      const input: PaymentInput = { amount, mode: paymentMode, otherDetail, reference, notes };
      ok = mutate((db) => editor.action === "create" ? recordPaymentForActor(db, selected.invoice!.id, actor.id, input) : editPaymentForActor(db, payment!.id, actor.id, input));
    } else ok = mutate((db) => editor.action === "deliver" ? markJobDeliveredForActor(db, selected.job.id, actor.id, deliveryBy, finalKm, acknowledgement) : updateDeliveryForActor(db, selected.job.id, actor.id, deliveryBy, finalKm, acknowledgement));
    if (ok) onClose();
  };
  const readOnly = editor.action === "view";
  return <Dialog title={title} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide><form className="billing-dialog-form" onSubmit={submit}>
    {editor.action === "create" && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={jobId} onChange={(event) => selectCandidate(Number(event.target.value))}>{candidates.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no} · {view.vehicle.number}</option>)}</select></label>}
    {mode === "Invoices" && editor.action !== "void" && <><div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Discount<input type="number" value={discount} disabled={readOnly || editor.action === "create"} onChange={(event) => setDiscount(Number(event.target.value))} /></label><label>GST %<input type="number" value={gstRate} disabled={readOnly || editor.action === "create"} onChange={(event) => setGstRate(Number(event.target.value))} /></label></div>{editor.action !== "create" && <div className="estimate-items"><strong>Invoice items</strong>{invoiceItems.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={readOnly} onChange={(event) => setInvoiceItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, kind: event.target.value as "Service" | "Material" } : row))}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={readOnly} onChange={(event) => setInvoiceItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, description: event.target.value } : row))} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={readOnly} onChange={(event) => setInvoiceItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, qty: Number(event.target.value) } : row))} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={readOnly} onChange={(event) => setInvoiceItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, rate: Number(event.target.value) } : row))} />{!readOnly && <button type="button" className="danger-action" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setInvoiceItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!readOnly && <button type="button" onClick={() => setInvoiceItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0 }])}>Add Invoice Item</button>}</div>}<label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label><label className="checkbox-line"><input type="checkbox" checked={documentAvailable} disabled={readOnly} onChange={(event) => setDocumentAvailable(event.target.checked)} /> Document available</label><p>Invoice items are copied once from the estimate. Financial fields lock after the first active payment.</p></>}
    {mode === "Payments" && editor.action !== "void" && <><div className="form-grid"><label>Amount<input data-dialog-initial-focus type="number" min="0.01" step="0.01" value={amount} disabled={readOnly} onChange={(event) => setAmount(Number(event.target.value))} /></label><label>Mode<select value={paymentMode} disabled={readOnly} onChange={(event) => setPaymentMode(event.target.value as PaymentMode)}>{(["UPI", "Cash", "Card", "Other"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>{paymentMode === "Other" && <label>Other detail<input value={otherDetail} disabled={readOnly} onChange={(event) => setOtherDetail(event.target.value)} /></label>}<label>Reference<input value={reference} disabled={readOnly} onChange={(event) => setReference(event.target.value)} /></label></div><label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label></>}
    {mode === "Delivery" && <><div className="linked-grid"><div><span>Gate Pass</span><strong>{selected.gate_pass?.gate_pass_no ?? "Not generated"}</strong></div><div><span>State</span><strong>{delivered(selected) ? "Delivered" : "Pending delivery"}</strong></div></div><div className="form-grid"><label>Delivered by<input data-dialog-initial-focus value={deliveryBy} disabled={readOnly} onChange={(event) => setDeliveryBy(event.target.value)} /></label><label>Final KM<input type="number" value={finalKm} disabled={readOnly} onChange={(event) => setFinalKm(Number(event.target.value))} /></label><label>Acknowledgement<input value={acknowledgement} disabled={readOnly} onChange={(event) => setAcknowledgement(event.target.value)} /></label></div></>}
    {editor.action === "void" && <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label>}
    {!readOnly && <div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button className={editor.action === "void" ? "danger-action" : "primary-action"} type="submit">{editor.action === "deliver" ? "Mark Delivered" : editor.action === "void" ? "Void" : "Save"}</button></div>}
  </form></Dialog>;
}
