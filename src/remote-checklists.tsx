import { useEffect, useState, type FormEvent } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";

type Item = { id: number; key: string; label: string; required: boolean; checkedAt: string | null; naAt: string | null };
type Cycle = { id: number; stage: string; cycleNumber: number; completedAt: string | null; items: Item[] };

async function request(config: CognitoConfig, path: string, init?: RequestInit): Promise<Cycle[]> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string };
    throw new Error(body.code ?? `Checklist request failed (${response.status})`);
  }
  return response.json() as Promise<Cycle[]>;
}

export function RemoteChecklists({ config, jobId, jobStatus }: { config: CognitoConfig; jobId: number; jobStatus: string }) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [stage, setStage] = useState("NEW");
  const [labels, setLabels] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editable = jobStatus !== "CLOSED" && jobStatus !== "CANCELLED";
  useEffect(() => {
    let active = true;
    setCycles([]); setError(""); setStage(jobStatus);
    void request(config, `/api/v1/checklists?jobId=${jobId}`).then((value) => { if (active) setCycles(value); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load checklist."); });
    return () => { active = false; };
  }, [config, jobId, jobStatus]);
  const run = async (path: string, body: unknown, method: "POST" | "PUT") => {
    setBusy(true); setError("");
    try {
      setCycles(await request(config, path, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Checklist save failed.");
      return false;
    } finally { setBusy(false); }
  };
  const create = async (event: FormEvent) => {
    event.preventDefault();
    const items = labels.split(/\r?\n/).map((label) => label.trim()).filter(Boolean)
      .map((label, index) => ({ key: `item-${index + 1}`, label, required: true }));
    if (!items.length) { setError("Enter at least one checklist item."); return; }
    if (await run("/api/v1/checklists", { jobId, stage: stage.trim(), items }, "POST")) setLabels("");
  };
  return <section className="record-view" aria-label="Job checklists">
    <h4>Job checklists</h4>
    {error && <p role="alert" className="form-error">{error}</p>}
    {cycles.map((cycle) => <section key={cycle.id}>
      <h5>{cycle.stage} · cycle {cycle.cycleNumber}{cycle.completedAt ? " · complete" : ""}</h5>
      {cycle.items.map((item) => <div key={item.id} className="request-line">
        <span>{item.label}{item.required ? " *" : ""}</span>
        <span>{item.checkedAt ? "Checked" : item.naAt ? "N/A" : "Open"}</span>
        <div className="action-row">
          <button type="button" disabled={busy || !editable || cycle.stage !== jobStatus || !!item.checkedAt} onClick={() => void run(`/api/v1/checklists/items/${item.id}`, { state: "checked" }, "PUT")}>Check</button>
          <button type="button" disabled={busy || !editable || cycle.stage !== jobStatus || item.required || !!item.naAt} onClick={() => void run(`/api/v1/checklists/items/${item.id}`, { state: "na" }, "PUT")}>N/A</button>
          {(item.checkedAt || item.naAt) && <button type="button" disabled={busy || !editable || cycle.stage !== jobStatus} onClick={() => void run(`/api/v1/checklists/items/${item.id}`, { state: "open" }, "PUT")}>Reopen</button>}
        </div>
      </div>)}
    </section>)}
    {!cycles.length && !error && <p>No checklist cycles for this job.</p>}
    {editable && <form className="form-grid" onSubmit={(event) => void create(event)}>
      <label>Stage<input required value={stage} onChange={(event) => setStage(event.target.value)} /></label>
      <label>New checklist items, one per line<textarea required value={labels} onChange={(event) => setLabels(event.target.value)} /></label>
      <button className="primary-action" disabled={busy}>Create checklist cycle</button>
    </form>}
  </section>;
}
