import { useEffect, useState, type FormEvent } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";

type Item = { id: number; name: string; baseRate: number; gstRate: number; archivedAt: string | null };
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string };
    throw new Error(body.code ?? `Service catalogue request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function RemoteServiceCatalog({ config }: { config: CognitoConfig }) {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<number>();
  const [name, setName] = useState("");
  const [rate, setRate] = useState("0");
  const [gst, setGst] = useState("18");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = async () => setItems(await request<Item[]>(config, "/api/v1/service-catalog"));
  useEffect(() => { void refresh().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load service catalogue.")); }, [config]);
  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await request(config, selected ? `/api/v1/service-catalog/${selected}` : "/api/v1/service-catalog", {
        method: selected ? "PUT" : "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), baseRate: Number(rate), gstRate: Number(gst) }),
      });
      await refresh(); setSelected(undefined); setName(""); setRate("0"); setGst("18");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save service task."); }
    finally { setBusy(false); }
  };
  return <section className="manager-panel" aria-label="Service Task Catalog">
    <h3>Service Task Catalog</h3>
    {error && <p role="alert" className="form-error">{error}</p>}
    <div className="table-wrap"><table><thead><tr><th>Task</th><th>Base rate</th><th>GST</th><th>Action</th></tr></thead><tbody>
      {items.filter((item) => !item.archivedAt).map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.baseRate}</td><td>{item.gstRate}%</td><td><button type="button" onClick={() => { setSelected(item.id); setName(item.name); setRate(String(item.baseRate)); setGst(String(item.gstRate)); }}>Edit</button></td></tr>)}
    </tbody></table></div>
    <form className="form-grid" onSubmit={(event) => void save(event)}>
      <h4>{selected ? "Edit task" : "New task"}</h4>
      <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
      <label>Base rate<input required type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(event.target.value)} /></label>
      <label>GST %<input required type="number" min="0" max="100" step="0.01" value={gst} onChange={(event) => setGst(event.target.value)} /></label>
      <div className="action-row"><button className="primary-action" disabled={busy}>{selected ? "Save task" : "Create task"}</button>
        {selected && <button type="button" onClick={() => { setSelected(undefined); setName(""); setRate("0"); setGst("18"); }}>Cancel</button>}</div>
    </form>
  </section>;
}
