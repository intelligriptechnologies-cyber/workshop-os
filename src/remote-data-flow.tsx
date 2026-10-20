import { useEffect, useMemo, useState } from "react";
import type { CognitoConfig } from "./auth";
import { jobsApi, type RemoteJob } from "./jobs-api";

export function RemoteDataFlow({ config }: { config: CognitoConfig }) {
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const refresh = async () => { setJobs(await jobsApi.list(config)); setError(""); };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "Data flow could not be loaded.")); }, [config]);
  const rows = useMemo(() => jobs.flatMap((job) => job.events.map((event) => ({ job, event })))
    .filter(({ job, event }) => `${job.jobNo} ${job.workList} ${event.command} ${event.reason}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.event.at.localeCompare(a.event.at)), [jobs, query]);
  return <section className="workspace single-panel"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Data Flow</h2><p>Shared job lifecycle events</p></div><button onClick={() => void refresh()}>Refresh</button></div>
    {error && <p className="api-error" role="alert">{error}</p>}
    <label className="list-search">Search jobs and events<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="table-wrap"><table><thead><tr><th>Time</th><th>Job</th><th>From</th><th>To</th><th>Event</th><th>Reason</th></tr></thead>
      <tbody>{rows.map(({ job, event }) => <tr key={`${job.id}-${event.id}`}><td>{new Date(event.at).toLocaleString()}</td><td>{job.jobNo}</td><td>{event.fromStatus}</td><td>{event.toStatus}</td><td>{event.command}</td><td>{event.reason}</td></tr>)}</tbody></table></div>
  </div></section>;
}
