import { useEffect, useMemo, useState } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";
import { financeApi, type RemoteInvoice, type RemotePayment, type RemoteHandover } from "./finance-api";
import { canReplaceRemoteInvoice, canVoidRemoteInvoice, remoteDocumentFilename } from "./finance-ui";
import { jobsApi, type RemoteJob } from "./jobs-api";

type Mode = "invoice" | "payment" | "delivery";
const rupeesToPaise = (value: string) => Math.round(Number(value) * 100);
const money = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

/** Signed-in counterpart to the local billing demo. */
export function RemoteFinanceWorkspace({ config, mode }: { config: CognitoConfig; mode: Mode }) {
  const [jobs, setJobs] = useState<RemoteJob[]>([]); const [selectedId, setSelectedId] = useState<number>();
  const [invoices, setInvoices] = useState<RemoteInvoice[]>([]); const [payments, setPayments] = useState<RemotePayment[]>([]); const [delivery, setDelivery] = useState<RemoteHandover | null>();
  const [replacesInvoiceId, setReplacesInvoiceId] = useState<number>();
  const [payAmount, setPayAmount] = useState(""); const [method, setMethod] = useState<"cash" | "card" | "upi" | "bank_transfer" | "other">("upi"); const [reference, setReference] = useState("");
  const [deliveredBy, setDeliveredBy] = useState(""); const [finalOdometer, setFinalOdometer] = useState(""); const [acknowledgement, setAcknowledgement] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const selected = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);
  const active = invoices.find((invoice) => !invoice.voided);

  const refresh = async () => {
    const nextJobs = await jobsApi.list(config); setJobs(nextJobs);
    const job = nextJobs.find((item) => item.id === (selectedId && nextJobs.some((candidate) => candidate.id === selectedId) ? selectedId : nextJobs[0]?.id));
    setSelectedId(job?.id);
    if (!job) { setInvoices([]); setPayments([]); setDelivery(undefined); return; }
    const nextInvoices = await financeApi.invoices(config, job.id); setInvoices(nextInvoices);
    const current = nextInvoices.find((invoice) => !invoice.voided);
    setPayments(current ? await financeApi.payments(config, current.id) : []);
    setDelivery(await financeApi.delivery(config, job.id));
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")); }, [config]);
  useEffect(() => { if (selectedId) void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")); }, [selectedId]);
  const run = (action: () => Promise<unknown>, afterSuccess?: () => void) => { setBusy(true); setError(""); void action().then(() => { afterSuccess?.(); return refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")).finally(() => setBusy(false)); };
  const issue = () => {
    if (!selected) return;
    run(() => financeApi.issueInvoice(config, selected.id, { ...(replacesInvoiceId ? { replacesInvoiceId } : {}) }, crypto.randomUUID()), () => setReplacesInvoiceId(undefined));
  };
  const voidInvoice = (invoice: RemoteInvoice) => {
    const reason = window.prompt(`Why should ${invoice.number} be voided?`, "") ?? "";
    if (reason.trim()) run(() => financeApi.voidInvoice(config, invoice.id, reason.trim(), crypto.randomUUID()));
  };
  const prepareReplacement = (invoice: RemoteInvoice) => {
    setReplacesInvoiceId(invoice.id);
  };
  const creditAndRefund = (invoice: RemoteInvoice) => {
    const amount = Number(window.prompt(`Credit/refund amount for ${invoice.number} (₹):`, ""));
    const reason = window.prompt("Credit note reason:", "") ?? "";
    if (!(amount > 0) || !reason.trim()) return;
    run(async () => {
      const note = await financeApi.issueCreditNote(config, invoice.id, { amountPaise: rupeesToPaise(String(amount)), reason: reason.trim() }, crypto.randomUUID());
      await financeApi.recordRefund(config, note.id, { amountPaise: rupeesToPaise(String(amount)), method: "upi" }, crypto.randomUUID());
    });
  };
  const download = async (path: string, number: string) => {
    try {
      const response = await authenticatedFetch(config, path);
      if (!response.ok) throw new Error("FINANCIAL_DOCUMENT_DOWNLOAD_FAILED");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = remoteDocumentFilename(number); link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "FINANCIAL_DOCUMENT_DOWNLOAD_FAILED"); }
  };
  const pay = () => {
    if (!active || !(Number(payAmount) > 0)) return;
    run(() => financeApi.recordPayment(config, active.id, { amountPaise: rupeesToPaise(payAmount), method, reference }, crypto.randomUUID()));
  };
  const handover = () => {
    if (!selected || !deliveredBy.trim() || !(Number(finalOdometer) >= 0) || !acknowledgement.trim()) return;
    run(() => financeApi.completeHandover(config, selected.id, { deliveredBy, finalOdometer: Number(finalOdometer), acknowledgement }, crypto.randomUUID()));
  };
  const title = mode === "invoice" ? "Invoices" : mode === "payment" ? "Payments" : "Delivery";
  return <section className="manager-panel" aria-label={`Online ${title.toLowerCase()}`}>
    <div className="panel-actions"><div><h3>{title}</h3><span>Live tenant financial records. Signed-out mode retains the SQLite demo workspace.</span></div></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    <label>Job<select value={selected?.id ?? 0} onChange={(event) => setSelectedId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.status}</option>)}</select></label>
    {mode === "invoice" && <><div className="form-grid"><p className="permission-note">Invoices are issued only from the current approved estimate. Lines, rates, tax, and discount cannot be edited here.</p><div className="action-row"><button className="primary-action" disabled={busy || Boolean(active)} onClick={issue}>{replacesInvoiceId ? "Issue replacement invoice" : "Issue approved estimate"}</button>{replacesInvoiceId && <button disabled={busy} onClick={() => setReplacesInvoiceId(undefined)}>Cancel replacement</button>}</div></div>{replacesInvoiceId && <p className="permission-note">A replacement issues a new immutable number; it does not edit the corrected document.</p>}<InvoiceRows invoices={invoices} busy={busy} onDownload={download} onVoid={voidInvoice} onReplace={prepareReplacement} onCreditRefund={creditAndRefund} /></>}
    {mode === "payment" && <><InvoiceRows invoices={invoices} busy={busy} onDownload={download} />{active && <div className="form-grid"><label>Amount (₹)<input min="0.01" type="number" value={payAmount} onChange={(event) => setPayAmount(event.target.value)} /></label><label>Method<select value={method} onChange={(event) => setMethod(event.target.value as typeof method)}>{["upi", "cash", "card", "bank_transfer", "other"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Reference<input value={reference} onChange={(event) => setReference(event.target.value)} /></label><div className="action-row"><button className="primary-action" disabled={busy || active.status === "SETTLED"} onClick={pay}>Record payment</button></div></div>}<div className="table-wrap"><table><thead><tr><th>Receipt</th><th>Amount</th><th>Method</th><th>Reference</th><th>Document</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{payment.receiptNumber}</td><td>{money(payment.amountPaise)}</td><td>{payment.method}</td><td>{payment.reference || "—"}</td><td><button disabled={busy} onClick={() => void download(payment.contentPath, payment.receiptNumber)}>Download</button></td></tr>)}</tbody></table></div></>}
    {mode === "delivery" && <>{delivery ? <p><strong>{delivery.gatePassNumber}</strong> · Delivered by {delivery.deliveredBy} at {new Date(delivery.handoverAt).toLocaleString()}. <button disabled={busy} onClick={() => void download(delivery.contentPath, delivery.gatePassNumber)}>Download gate pass</button></p> : <><InvoiceRows invoices={invoices} busy={busy} onDownload={download} /><div className="form-grid"><label>Delivered by<input value={deliveredBy} onChange={(event) => setDeliveredBy(event.target.value)} /></label><label>Final odometer<input min="0" type="number" value={finalOdometer} onChange={(event) => setFinalOdometer(event.target.value)} /></label><label>Acknowledgement<input value={acknowledgement} onChange={(event) => setAcknowledgement(event.target.value)} /></label><div className="action-row"><button className="primary-action" disabled={busy || active?.status !== "SETTLED" || selected?.status !== "COMPLETED"} onClick={handover}>Issue gate pass & hand over</button></div></div></>}</>}
  </section>;
}

function InvoiceRows({ invoices, busy, onDownload, onVoid, onReplace, onCreditRefund }: { invoices: RemoteInvoice[]; busy: boolean; onDownload: (path: string, number: string) => Promise<void>; onVoid?: (invoice: RemoteInvoice) => void; onReplace?: (invoice: RemoteInvoice) => void; onCreditRefund?: (invoice: RemoteInvoice) => void }) {
  const activeExists = invoices.some((invoice) => !invoice.voided);
  return <div className="table-wrap"><table aria-label="Issued invoices"><thead><tr><th>Invoice</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Document</th>{(onVoid || onReplace || onCreditRefund) && <th>Correction</th>}</tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td>{invoice.number}</td><td>{money(invoice.totalPaise)}</td><td>{money(invoice.paidPaise)}</td><td>{money(invoice.balancePaise)}</td><td>{invoice.status}</td><td><button disabled={busy} onClick={() => void onDownload(invoice.contentPath, invoice.number)}>Download</button></td>{(onVoid || onReplace || onCreditRefund) && <td><div className="grid-actions">{onVoid && canVoidRemoteInvoice(invoice) && <button className="danger-action" disabled={busy} onClick={() => onVoid(invoice)}>Void with reason</button>}{onCreditRefund && (invoice.status === "PARTIAL" || invoice.status === "SETTLED") && <button className="danger-action" disabled={busy} onClick={() => onCreditRefund(invoice)}>Credit & refund</button>}{onReplace && canReplaceRemoteInvoice(invoice, activeExists) && <button disabled={busy} onClick={() => onReplace(invoice)}>Issue replacement</button>}</div></td>}</tr>)}</tbody></table></div>;
}
