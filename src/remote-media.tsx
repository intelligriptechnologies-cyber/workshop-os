import { useEffect, useState, type FormEvent } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";
import { jobsApi, type RemoteJob } from "./jobs-api";

type Media = { id: number; jobId: number; jobNo: string; vehicleNo: string; label: string; category: string; src: string; createdAt: string };

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  const body = await response.json() as T & { code?: string };
  if (!response.ok) throw new Error(body.code ?? "MEDIA_API_FAILED");
  return body;
}

const json = (method: "POST" | "PUT", body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export function RemoteMedia({ config }: { config: CognitoConfig }) {
  const [media, setMedia] = useState<Media[]>([]);
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [jobId, setJobId] = useState(0);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("Before Work");
  const [file, setFile] = useState<File>();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refresh = async () => {
    const [nextMedia, nextJobs] = await Promise.all([request<Media[]>(config, "/api/v1/media"), jobsApi.list(config)]);
    setMedia(nextMedia); setJobs(nextJobs); setJobId((current) => current || nextJobs[0]?.id || 0);
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "MEDIA_API_FAILED")); }, [config]);
  const run = async (work: () => Promise<unknown>) => {
    setBusy(true); setError("");
    try { await work(); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "MEDIA_API_FAILED"); }
    finally { setBusy(false); }
  };
  const upload = (event: FormEvent) => {
    event.preventDefault();
    if (!file || !jobId) return;
    if (file.size > 10_000_000 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Choose a PNG, JPEG, or WebP image under 10 MB."); return;
    }
    void run(async () => {
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file);
      });
      await request(config, "/api/v1/media", json("POST", { jobId, label, category, src }));
      setFile(undefined); setLabel("");
    });
  };
  const edit = (item: Media) => {
    const next = window.prompt("Media label", item.label);
    if (next === null) return;
    void run(() => request(config, `/api/v1/media/${item.id}`, json("PUT", { label: next, category: item.category })));
  };
  const archive = (item: Media) => {
    const reason = window.prompt("Reason for archiving this image:");
    if (reason?.trim()) void run(() => request(config, `/api/v1/media/${item.id}/archive`, json("POST", { reason })));
  };
  const visible = media.filter((item) => `${item.label} ${item.category} ${item.jobNo} ${item.vehicleNo}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="workspace single-panel"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Media</h2><p>Shared job card images</p></div></div>
    {error && <p className="api-error" role="alert">{error} <button onClick={() => void refresh()}>Retry</button></p>}
    <form className="form-grid" onSubmit={upload}>
      <label>Job card<select required value={jobId || ""} onChange={(event) => setJobId(Number(event.target.value))}><option value="">Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo}</option>)}</select></label>
      <label>Label<input value={label} onChange={(event) => setLabel(event.target.value)} /></label>
      <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Before Work</option><option>After Work</option><option>Inspection</option><option>Progress</option><option>Reception</option></select></label>
      <label>Image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0])} required /></label>
      <button className="primary-action" disabled={busy || !jobId}>Upload</button>
    </form>
    <label className="list-search">Search media<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="table-wrap"><table><thead><tr><th>Preview</th><th>Label</th><th>Category</th><th>Job</th><th>Vehicle</th><th>Actions</th></tr></thead>
      <tbody>{visible.map((item) => <tr key={item.id}><td>{item.src ? <img src={item.src} alt={item.label || item.category} width="64" height="48" /> : "—"}</td><td>{item.label}</td><td>{item.category}</td><td>{item.jobNo}</td><td>{item.vehicleNo}</td><td><button disabled={busy} onClick={() => edit(item)}>Edit</button><button disabled={busy} onClick={() => archive(item)}>Archive</button></td></tr>)}</tbody></table></div>
  </div></section>;
}
