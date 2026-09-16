import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { DirtyFormDialog } from "./dialog-primitives";
import { ProductionNavigation } from "./ProductionNavigation";
import { createBillingApi, type BillingJob } from "./production-billing-api";

const message = (error: unknown) => error instanceof Error ? error.message : "Request failed";
type DialogKind = "ACCEPT" | "PAY" | "DELIVERY" | "GATE" | "INVOICE_CORRECTION" | "PAYMENT_CORRECTION";
type DialogState = { kind: DialogKind; targetId?: string };

function Screen({ session, auth }: { session: any; auth: any }) {
  const api = useMemo(() => createBillingApi(auth), [auth]);
  const permissions = new Set<string>(session.membership.permissions);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [jobId, setJobId] = useState("00000000-0000-4000-8000-000000000905");
  const [job, setJob] = useState<BillingJob>();
  const [failure, setFailure] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<DialogState>();
  const [errors, setErrors] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [acknowledgement, setAcknowledgement] = useState("");
  const [odometer, setOdometer] = useState("");
  const [identityType, setIdentityType] = useState("OTHER");
  const [identityLast4, setIdentityLast4] = useState("");
  const [mode, setMode] = useState("UPI");
  const [reference, setReference] = useState("");
  const [validUntil, setValidUntil] = useState("");

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setFailure("");
    try { setJob(await api.get(jobId.trim())); } catch (error) { setFailure(message(error)); }
  }

  async function run(action: () => Promise<unknown>, notice: string) {
    setFailure("");
    setBusy(true);
    try {
      await action();
      setStatus(notice);
      setDialog(undefined);
      setJob(await api.get(jobId.trim()));
    } catch (error) { setFailure(message(error)); }
    finally { setBusy(false); }
  }

  function openDialog(kind: DialogKind, targetId?: string) {
    setDialog({ kind, targetId });
    setErrors([]);
    setAmount(kind === "PAY" ? job?.balanceMinor ?? "" : "");
    setReason("");
    setCustomerName(job?.customerName ?? "");
    setAcknowledgement("");
    setOdometer("");
    setIdentityType("OTHER");
    setIdentityLast4("");
    setMode("UPI");
    setReference("");
    setValidUntil(new Date(Date.now() + 3_600_000).toISOString().slice(0, 16));
  }

  async function submitDialog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dialog || !job) return;
    const nextErrors: string[] = [];
    if (["PAY", "INVOICE_CORRECTION", "PAYMENT_CORRECTION"].includes(dialog.kind) && (!/^\d+$/.test(amount) || BigInt(amount) <= 0n)) nextErrors.push("Enter a positive amount in minor units.");
    if (["INVOICE_CORRECTION", "PAYMENT_CORRECTION"].includes(dialog.kind) && !reason.trim()) nextErrors.push("Enter a correction reason.");
    if (dialog.kind === "ACCEPT" && (!customerName.trim() || !acknowledgement.trim())) nextErrors.push("Enter customer name and acknowledgement.");
    if (dialog.kind === "PAY" && (!mode.trim() || !reference.trim())) nextErrors.push("Enter payment mode and reference.");
    if (dialog.kind === "DELIVERY" && (!/^\d+$/.test(odometer) || !customerName.trim() || !identityType.trim() || identityLast4.trim().length !== 4 || !acknowledgement.trim())) nextErrors.push("Enter odometer, recipient, identity details, and acknowledgement.");
    if (dialog.kind === "GATE" && !validUntil) nextErrors.push("Enter a gate-pass expiry.");
    setErrors(nextErrors);
    if (nextErrors.length) return;
    if (dialog.kind === "ACCEPT") await run(() => api.accept(job.id, { version: job.version, customerName, acknowledgement }), "Work Accepted recorded.");
    if (dialog.kind === "PAY") await run(() => api.pay(job.id, { version: job.version, amountMinor: amount, mode, reference }), "Payment and private receipt recorded.");
    if (dialog.kind === "DELIVERY") await run(() => api.delivery(job.id, { version: job.version, finalOdometerKm: Number(odometer), deliveredToName: customerName, identityType, identityLast4, acknowledgement }), "Delivery acknowledgement recorded.");
    if (dialog.kind === "GATE") await run(() => api.gate(job.id, { version: job.version, validUntil: new Date(validUntil).toISOString() }), "Protected gate pass generated.");
    if (dialog.kind === "INVOICE_CORRECTION" && job.invoice) await run(() => api.requestInvoiceCorrection(job.invoice!.id, { amountMinor: amount, reason }), "Invoice correction sent for independent approval.");
    if (dialog.kind === "PAYMENT_CORRECTION" && dialog.targetId) await run(() => api.requestPaymentCorrection(dialog.targetId!, { amountMinor: amount, reason }), "Payment correction sent for independent approval.");
  }

  const dialogTitle: Record<DialogKind, string> = { ACCEPT: "Record Work Accepted", PAY: "Record payment", DELIVERY: "Record delivery acknowledgement", GATE: "Generate gate pass", INVOICE_CORRECTION: "Request invoice correction", PAYMENT_CORRECTION: "Request payment correction" };

  return <>
    <ProductionNavigation permissions={session.membership.permissions} />
    <main>
      <h1>Billing, delivery and closure</h1>
      <p>Final finance and vehicle custody use immutable production records.</p>
      <form onSubmit={load}><label htmlFor="billing-job">Job ID</label><input id="billing-job" value={jobId} onChange={(event) => setJobId(event.target.value)} /><button>Open Job</button></form>
      {failure && <p role="alert">{failure}</p>}{status && <p role="status">{status}</p>}
      {job && <section aria-label="Billing Job">
        <h2>{job.jobNumber} · {job.registration}</h2>
        <p>Stage: <strong>{job.stage}</strong> · Resource version {job.version}</p>
        <dl>
          <dt>Final invoice</dt><dd>{job.invoice ? `${job.invoice.number} · INR ${job.invoice.originalPayableMinor} original - ${job.invoice.creditMinor} credits = ${job.invoice.payableMinor} due` : "Not finalized"}</dd>
          <dt>Paid / balance</dt><dd>{job.paidMinor} / {job.balanceMinor}</dd>
          <dt>Work Accepted</dt><dd>{job.workAccepted ? "Recorded" : "Required"}</dd>
          <dt>Payment Cleared</dt><dd>{job.paymentCleared ? "Recorded" : "Required"}</dd>
          <dt>Delivery acknowledgement</dt><dd>{job.deliveryRecorded ? "Recorded" : "Required"}</dd>
          <dt>Gate pass</dt><dd>{job.gatePass ? `${job.gatePass.number} · ${job.gatePass.status}` : "Not issued"}</dd>
        </dl>
        <div className="toolbar">
          {permissions.has("invoice.finalize") && !job.invoice && <button onClick={() => run(() => api.finalize(job.id, job.version), "Final invoice created.")}>Finalize invoice</button>}
          {permissions.has("invoice.correction.request") && job.invoice && !job.released && <button onClick={() => openDialog("INVOICE_CORRECTION")}>Request invoice correction</button>}
          {permissions.has("job.work-acceptance.record") && !job.workAccepted && <button onClick={() => openDialog("ACCEPT")}>Record Work Accepted</button>}
          {permissions.has("payment.record") && job.invoice && BigInt(job.balanceMinor) > 0n && <button onClick={() => openDialog("PAY")}>Record payment</button>}
          {permissions.has("delivery.record") && !job.deliveryRecorded && <button onClick={() => openDialog("DELIVERY")}>Record delivery acknowledgement</button>}
          {permissions.has("gate-pass.issue") && !job.gatePass && <button onClick={() => openDialog("GATE")}>Generate gate pass</button>}
          {permissions.has("gate-pass.verify") && job.gatePass?.status === "ISSUED" && job.stage === "GATE_VERIFICATION" && <button onClick={() => run(() => api.release(job.gatePass!.id, { version: job.gatePass!.version, registration: job.registration, verificationMode: "HARDWARE_SCANNER", evidence: `scanner:${crypto.randomUUID()}` }), "Vehicle release recorded.")}>Verify and release vehicle</button>}
          {permissions.has("job.close") && job.released && !job.closed && <button onClick={() => run(() => api.close(job.id, job.version), "Job closed.")}>Close Job</button>}
        </div>
        {job.invoiceCorrections?.length > 0 && <table><caption>Immutable invoice corrections</caption><thead><tr><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{job.invoiceCorrections.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.amountMinor}</td><td>{item.status}{item.documentNumber ? ` · ${item.documentNumber}` : ""}</td><td>{permissions.has("invoice.correction.approve") && item.status === "APPROVAL_PENDING" ? <button onClick={() => run(() => api.approveInvoiceCorrection(item.id, item.version), "Invoice correction approved and credit note issued.")}>Approve independently</button> : "—"}</td></tr>)}</tbody></table>}
        {job.payments.length > 0 && <table><caption>Immutable payment history</caption><thead><tr><th>Kind</th><th>Reference</th><th>Mode</th><th>Amount</th><th>Action</th></tr></thead><tbody>{job.payments.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.reference}</td><td>{item.mode}</td><td>{item.amountMinor}</td><td>{permissions.has("payment.correction.request") && item.kind === "PAYMENT_RECEIPT" && !job.released ? <button onClick={() => openDialog("PAYMENT_CORRECTION", item.id)}>Request correction</button> : "—"}</td></tr>)}</tbody></table>}
        {job.corrections.length > 0 && <table><caption>Payment correction approvals</caption><thead><tr><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{job.corrections.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.amountMinor}</td><td>{item.status}</td><td>{permissions.has("payment.correction.approve") && item.status === "APPROVAL_PENDING" ? <button onClick={() => run(() => api.approvePaymentCorrection(item.id, item.version), "Payment correction approved and compensating event posted.")}>Approve independently</button> : "—"}</td></tr>)}</tbody></table>}
      </section>}
    </main>
    {dialog && <DirtyFormDialog open title={dialogTitle[dialog.kind]} dirty={Boolean(amount || reason || acknowledgement || odometer || identityLast4 || reference)} errors={errors} busy={busy} initialFocusRef={firstFieldRef} submitLabel="Submit" onSubmit={submitDialog} onClose={() => setDialog(undefined)}>
      {["PAY", "INVOICE_CORRECTION", "PAYMENT_CORRECTION"].includes(dialog.kind) && <><label htmlFor="billing-amount">Amount (minor units)</label><input id="billing-amount" ref={firstFieldRef} inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} required /></>}
      {["INVOICE_CORRECTION", "PAYMENT_CORRECTION"].includes(dialog.kind) && <><label htmlFor="billing-reason">Reason</label><textarea id="billing-reason" value={reason} onChange={(event) => setReason(event.target.value)} required /></>}
      {["ACCEPT", "DELIVERY"].includes(dialog.kind) && <><label htmlFor="billing-customer">Customer / recipient</label><input id="billing-customer" ref={firstFieldRef} value={customerName} onChange={(event) => setCustomerName(event.target.value)} required /><label htmlFor="billing-ack">Acknowledgement</label><textarea id="billing-ack" value={acknowledgement} onChange={(event) => setAcknowledgement(event.target.value)} required /></>}
      {dialog.kind === "PAY" && <><label htmlFor="billing-mode">Payment mode</label><input id="billing-mode" value={mode} onChange={(event) => setMode(event.target.value)} required /><label htmlFor="billing-reference">External reference</label><input id="billing-reference" value={reference} onChange={(event) => setReference(event.target.value)} required /></>}
      {dialog.kind === "DELIVERY" && <><label htmlFor="billing-odometer">Final odometer (km)</label><input id="billing-odometer" inputMode="numeric" value={odometer} onChange={(event) => setOdometer(event.target.value)} required /><label htmlFor="billing-identity-type">Identity type</label><input id="billing-identity-type" value={identityType} onChange={(event) => setIdentityType(event.target.value)} required /><label htmlFor="billing-last4">Identity last four</label><input id="billing-last4" maxLength={4} value={identityLast4} onChange={(event) => setIdentityLast4(event.target.value)} required /></>}
      {dialog.kind === "GATE" && <><label htmlFor="billing-expiry">Valid until</label><input id="billing-expiry" ref={firstFieldRef} type="datetime-local" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} required /></>}
    </DirtyFormDialog>}
  </>;
}

export default function ProductionBillingApp() {
  const [state, setState] = useState<any>({ loading: true });
  useEffect(() => { void (async () => { try { const config = await loadAuthConfig(); if (config.mode === "local") { if (!config.allowDemo) throw new Error("Local demo is disabled"); const auth = { mode: "local" as const, identity: "north-admin" }; const response = await fetch("/api/v1/session", { headers: { "x-workshopos-identity": auth.identity } }); if (!response.ok) throw new Error("Session unavailable"); setState({ loading: false, session: await response.json(), auth }); } else { const session = await loadWorkshopSession(config); if (!session) throw new Error("Sign in required"); setState({ loading: false, session, auth: { mode: "cognito", config } }); } } catch (error) { setState({ loading: false, error: message(error) }); } })(); }, []);
  if (state.loading) return <main><p>Loading…</p></main>;
  if (state.error || !state.session) return <main><h1>Billing</h1><p role="alert">{state.error ?? "Sign in required"}</p></main>;
  return <Screen session={state.session} auth={state.auth} />;
}
