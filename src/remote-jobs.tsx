import { useEffect, useMemo, useState } from "react";
import type { CognitoConfig } from "./auth";
import { jobsApi, type RemoteEstimate, type RemoteJob } from "./jobs-api";

type Props = { config: CognitoConfig; mode: "jobs" | "estimates" };

const currentEstimate = (job: RemoteJob) => [...job.estimates].reverse().find((estimate) => !estimate.supersededAt);

export function RemoteJobWorkflow({ config, mode }: Props) {
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [visitId, setVisitId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [responsibleManagerId, setResponsibleManagerId] = useState("");
  const [workList, setWorkList] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");
  const [channel, setChannel] = useState<"in_person" | "phone" | "whatsapp" | "email" | "other">("phone");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);

  const refresh = async () => {
    const next = await jobsApi.list(config);
    setJobs(next);
    setSelectedId((previous) => previous && next.some((job) => job.id === previous) ? previous : next[0]?.id);
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "JOBS_API_FAILED")); }, [config]);
  const run = async (work: () => Promise<unknown>) => {
    setBusy(true); setError("");
    try { await work(); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "JOBS_API_FAILED"); }
    finally { setBusy(false); }
  };
  const command = (kind: "start-work" | "hold-job" | "resume-work" | "cancel-job" | "start-rework" | "complete-work") => {
    if (!selected) return;
    const needsReason = kind !== "start-work" && kind !== "complete-work";
    const reason = needsReason ? window.prompt("Reason for this lifecycle command:") ?? "" : "";
    void run(() => jobsApi.command(config, selected.id, kind, reason));
  };
  const estimate = selected ? currentEstimate(selected) : undefined;
  return <section className="manager-panel" aria-label="Online job workflow">
    <div className="panel-actions"><div><h3>{mode === "jobs" ? "Job Cards" : "Estimates"}</h3><span>Live tenant and branch records. Demo data stays available when signed out.</span></div></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {mode === "jobs" && <form className="form-grid" onSubmit={(event) => { event.preventDefault(); void run(async () => { await jobsApi.create(config, { visitId: Number(visitId), departmentId, responsibleManagerId, workList }); setVisitId(""); setDepartmentId(""); setResponsibleManagerId(""); setWorkList(""); }); }}>
      <label>Visit ID<input required min="1" type="number" value={visitId} onChange={(event) => setVisitId(event.target.value)} /></label>
      <label>Service department ID<input required value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} /></label>
      <label>Responsible manager ID<input required value={responsibleManagerId} onChange={(event) => setResponsibleManagerId(event.target.value)} /></label>
      <label>Initial work list<input value={workList} onChange={(event) => setWorkList(event.target.value)} /></label>
      <div className="action-row"><button className="primary-action" disabled={busy}>Create Job Card</button></div>
    </form>}
    <div className="table-wrap"><table><thead><tr><th>Job</th><th>Visit</th><th>Status</th><th>Current estimate</th></tr></thead><tbody>{jobs.map((job) => { const item = currentEstimate(job); return <tr key={job.id} aria-selected={selected?.id === job.id} onClick={() => setSelectedId(job.id)}><td><button className="link-action" type="button" onClick={() => setSelectedId(job.id)}>{job.jobNo}</button></td><td>{job.visitId}</td><td>{job.status}</td><td>{item ? `${item.status} · rev ${item.revision}` : "None"}</td></tr>; })}</tbody></table></div>
    {selected && <section className="record-view"><h4>{selected.jobNo} · {selected.status}</h4>
      <div className="action-row">{selected.status === "NEW" && <button className="primary-action" disabled={busy} onClick={() => command("start-work")}>Start work</button>}{selected.status === "IN_PROGRESS" && <><button disabled={busy} onClick={() => command("hold-job")}>Place on hold</button><button className="primary-action" disabled={busy} title="Requires approved estimate, work evidence, resolved materials, passing QC, and a current invoice." onClick={() => command("complete-work")}>Complete work</button></>}{selected.status === "HOLD" && <button className="primary-action" disabled={busy} onClick={() => command("resume-work")}>Resume work</button>}{selected.status === "COMPLETED" && <button disabled={busy} onClick={() => command("start-rework")}>Start rework</button>}{["NEW", "IN_PROGRESS", "HOLD"].includes(selected.status) && <button className="danger-action" disabled={busy} onClick={() => command("cancel-job")}>Cancel job</button>}</div>
      <EstimatePanel estimate={estimate} busy={busy} onCreate={() => { if (!description.trim() || !Number(quantity) || Number(rate) < 0) { setError("Estimate description, quantity and rate are required."); return; } void run(async () => { await jobsApi.createEstimate(config, selected.id, { lines: [{ kind: "labour", description, quantity: Number(quantity), rate: Number(rate), gstRate: 18 }] }); setDescription(""); setRate(""); }); }} onDecision={(outcome) => { if (!estimate) return; void run(() => jobsApi.decideEstimate(config, estimate.id, { outcome, channel, decidedAt: new Date().toISOString(), note })); }} description={description} quantity={quantity} rate={rate} setDescription={setDescription} setQuantity={setQuantity} setRate={setRate} channel={channel} setChannel={setChannel} note={note} setNote={setNote} />
    </section>}
  </section>;
}

function EstimatePanel({ estimate, busy, onCreate, onDecision, description, quantity, rate, setDescription, setQuantity, setRate, channel, setChannel, note, setNote }: { estimate?: RemoteEstimate; busy: boolean; onCreate: () => void; onDecision: (outcome: "approved" | "declined") => void; description: string; quantity: string; rate: string; setDescription: (value: string) => void; setQuantity: (value: string) => void; setRate: (value: string) => void; channel: "in_person" | "phone" | "whatsapp" | "email" | "other"; setChannel: (value: "in_person" | "phone" | "whatsapp" | "email" | "other") => void; note: string; setNote: (value: string) => void }) {
  return <section><h4>Estimate {estimate ? `revision ${estimate.revision} · ${estimate.status}` : ""}</h4>{estimate?.lines.map((line, index) => <p key={line.id ?? index}>{line.description}: {line.quantity} × {line.rate}</p>)}
    {!estimate || estimate.status !== "DRAFT" ? <div className="form-grid"><label>Description<input value={description} onChange={(event) => setDescription(event.target.value)} /></label><label>Quantity<input type="number" min="0.001" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label>Rate<input type="number" min="0" value={rate} onChange={(event) => setRate(event.target.value)} /></label><div className="action-row"><button className="primary-action" disabled={busy} onClick={onCreate}>Create {estimate ? "revision" : "estimate"}</button></div></div> : <div className="form-grid"><label>Customer channel<select value={channel} onChange={(event) => setChannel(event.target.value as typeof channel)}>{["in_person", "phone", "whatsapp", "email", "other"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Decision note<input value={note} onChange={(event) => setNote(event.target.value)} /></label><div className="action-row"><button className="primary-action" disabled={busy} onClick={() => onDecision("approved")}>Record approval</button><button className="danger-action" disabled={busy} onClick={() => onDecision("declined")}>Record decline</button></div></div>}
  </section>;
}
