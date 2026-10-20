import { useEffect, useState, type FormEvent } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";

type Task = { id: number; name: string; done: boolean; baseRate: number; catalogueItemId: number | null; archivedAt: string | null };
type CatalogueItem = { id: number; name: string; baseRate: number; gstRate: number; archivedAt: string | null };
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string };
    throw new Error(body.code ?? `Service task request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function RemoteJobServiceTasks({ config, jobId, jobStatus }: { config: CognitoConfig; jobId: number; jobStatus: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);
  const [catalogueId, setCatalogueId] = useState(0);
  const [customName, setCustomName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editable = jobStatus !== "CLOSED" && jobStatus !== "CANCELLED";
  useEffect(() => {
    let active = true; setTasks([]); setError("");
    void Promise.all([request<Task[]>(config, `/api/v1/service-catalog/job-tasks?jobId=${jobId}`),
      request<CatalogueItem[]>(config, "/api/v1/service-catalog")])
      .then(([nextTasks, nextCatalogue]) => { if (active) { setTasks(nextTasks); setCatalogue(nextCatalogue); } })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load job tasks."); });
    return () => { active = false; };
  }, [config, jobId]);
  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const item = catalogue.find((candidate) => candidate.id === catalogueId);
      const name = item?.name ?? customName.trim();
      await request(config, "/api/v1/service-catalog/job-tasks", { method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId, catalogueItemId: item?.id ?? null, name,
          baseRate: item?.baseRate ?? 0, gstRate: item?.gstRate ?? 18 }) });
      setTasks(await request<Task[]>(config, `/api/v1/service-catalog/job-tasks?jobId=${jobId}`));
      setCatalogueId(0); setCustomName("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save job task."); }
    finally { setBusy(false); }
  };
  const toggle = async (task: Task) => {
    setBusy(true); setError("");
    try {
      await request(config, `/api/v1/service-catalog/job-tasks/${task.id}/done`, { method: "PUT",
        headers: { "content-type": "application/json" }, body: JSON.stringify({ done: !task.done }) });
      setTasks(await request<Task[]>(config, `/api/v1/service-catalog/job-tasks?jobId=${jobId}`));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update job task."); }
    finally { setBusy(false); }
  };
  return <section className="record-view" aria-label="Job service tasks">
    <h4>Service tasks</h4>
    {error && <p role="alert" className="form-error">{error}</p>}
    {tasks.filter((task) => !task.archivedAt).map((task) => <div key={task.id} className="request-line">
      <span>{task.name} · {task.baseRate}</span><span>{task.done ? "Done" : "Open"}</span>
      <button type="button" disabled={busy || !editable} onClick={() => void toggle(task)}>{task.done ? "Reopen" : "Mark done"}</button>
    </div>)}
    {!tasks.length && !error && <p>No service tasks on this job.</p>}
    {editable && <form className="form-grid" onSubmit={(event) => void save(event)}>
      <label>Catalogue task<select value={catalogueId} onChange={(event) => setCatalogueId(Number(event.target.value))}>
        <option value={0}>Custom task</option>{catalogue.filter((item) => !item.archivedAt).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select></label>
      {!catalogueId && <label>Task name<input required value={customName} onChange={(event) => setCustomName(event.target.value)} /></label>}
      <button className="primary-action" disabled={busy}>Add service task</button>
    </form>}
  </section>;
}
