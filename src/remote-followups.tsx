import { useEffect, useState, type FormEvent } from "react";
import type { CognitoConfig } from "./auth";
import { followupsApi, type FollowupJob, type RemoteFollowup, type SearchResult } from "./followups-api";

type Mode = "followups" | "search";
const dateInput = (value: string | null) => value?.slice(0, 10) ?? "";

/** Authenticated Follow-ups and global Search; unauthenticated users retain SQLite demo screens. */
export function RemoteFollowupsWorkspace({ config, mode }: { config: CognitoConfig; mode: Mode }) {
  const [followups, setFollowups] = useState<RemoteFollowup[]>([]);
  const [jobs, setJobs] = useState<FollowupJob[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [jobId, setJobId] = useState(0);
  const [note, setNote] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [editing, setEditing] = useState<RemoteFollowup>();
  const [outcome, setOutcome] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    const [nextFollowups, nextJobs] = await Promise.all([followupsApi.list(config), followupsApi.jobs(config)]);
    setFollowups(nextFollowups); setJobs(nextJobs);
    setJobId((current) => current || nextJobs[0]?.id || 0);
  };
  useEffect(() => { if (mode === "followups") void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "FOLLOWUPS_API_FAILED")); }, [config, mode]);

  const run = (action: () => Promise<unknown>, after?: () => void) => {
    setBusy(true); setError("");
    void action().then(async () => { after?.(); await refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "FOLLOWUPS_API_FAILED")).finally(() => setBusy(false));
  };
  const create = (event: FormEvent) => {
    event.preventDefault(); if (!jobId || !note.trim()) return;
    run(() => followupsApi.create(config, { jobId, note: note.trim(), ...(dueAt ? { dueAt } : {}) }), () => { setNote(""); setDueAt(""); });
  };
  const beginEdit = (item: RemoteFollowup) => { setEditing(item); setNote(item.note); setDueAt(dateInput(item.dueAt)); setOutcome(item.outcome); };
  const saveEdit = (event: FormEvent) => {
    event.preventDefault(); if (!editing || !note.trim()) return;
    run(() => followupsApi.update(config, editing.id, { note: note.trim(), ...(dueAt ? { dueAt } : {}), outcome: outcome.trim() }), () => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); });
  };
  const complete = (item: RemoteFollowup) => run(() => followupsApi.complete(config, item.id, window.prompt("Completion outcome:", item.outcome) ?? item.outcome));
  const archive = (item: RemoteFollowup) => {
    const reason = window.prompt(`Why archive follow-up #${item.id}?`, "");
    if (reason?.trim()) run(() => followupsApi.archive(config, item.id, reason.trim()));
  };
  const search = (event: FormEvent) => {
    event.preventDefault(); if (query.trim().length < 2) { setError("Enter at least 2 characters to search."); return; }
    setBusy(true); setError("");
    void followupsApi.search(config, query.trim()).then((payload) => setResults(payload.results)).catch((caught) => setError(caught instanceof Error ? caught.message : "SEARCH_API_FAILED")).finally(() => setBusy(false));
  };

  if (mode === "search") return <section className="workspace single-panel" aria-label="Online global search"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Search</h2><p>Live, tenant- and branch-scoped customers, vehicles, jobs, and invoices.</p></div></div>
    {error && <div className="api-error" role="alert">{error}</div>}
    <form className="store-filter-grid" onSubmit={search}><label className="list-search">Search all records<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, registration, job card, or invoice" /></label><button className="primary-action" disabled={busy}>Search</button></form>
    <div className="table-wrap"><table aria-label="Global search results"><thead><tr><th>Type</th><th>Record</th><th>Context</th></tr></thead><tbody>{results.map((item) => <tr key={`${item.entity}-${item.id}`}><td>{item.entity}</td><td>{item.title}</td><td>{item.subtitle || "—"}</td></tr>)}</tbody></table></div>
    {query && !busy && !results.length && <p className="empty-state">No authorized records match this search.</p>}
  </div></section>;

  const formTitle = editing ? `Edit Follow-up #${editing.id}` : "New Follow-up";
  return <section className="workspace single-panel" aria-label="Online follow-ups"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Follow-ups</h2><p>Live tenant and permitted branch customer contact records.</p></div></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    <form className="form-grid" onSubmit={editing ? saveEdit : create}><h3>{formTitle}</h3>
      {!editing && <label>Job<select required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.vehicleNo} · {job.customerName}</option>)}</select></label>}
      <label>Due date<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label>
      <label>Note<textarea required rows={2} value={note} onChange={(event) => setNote(event.target.value)} /></label>
      {editing && <label>Outcome<textarea rows={2} value={outcome} onChange={(event) => setOutcome(event.target.value)} /></label>}
      <div className="action-row"><button className="primary-action" disabled={busy}>{editing ? "Save Follow-up" : "Create Follow-up"}</button>{editing && <button type="button" disabled={busy} onClick={() => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); }}>Cancel</button>}</div>
    </form>
    <div className="table-wrap"><table aria-label="Remote follow-ups"><thead><tr><th>Due</th><th>Job</th><th>Customer / Vehicle</th><th>Note</th><th>Status</th><th>Action</th></tr></thead><tbody>{followups.map((item) => <tr key={item.id}><td>{dateInput(item.dueAt) || "—"}</td><td>{item.jobNo}</td><td>{item.customerName} · {item.vehicleNo}</td><td>{item.note}</td><td>{item.status}</td><td><div className="grid-actions"><button disabled={busy} onClick={() => beginEdit(item)}>Edit</button>{item.status === "OPEN" && <button disabled={busy} onClick={() => complete(item)}>Complete</button>}<button className="grid-action-danger" disabled={busy} onClick={() => archive(item)}>Archive</button></div></td></tr>)}</tbody></table></div>
    {!followups.length && <p className="empty-state">No active follow-ups.</p>}
  </div></section>;
}
