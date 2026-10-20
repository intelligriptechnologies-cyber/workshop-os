import { useEffect, useState } from "react";
import type { CognitoConfig } from "./auth";
import { jobsApi, type RemoteJob } from "./jobs-api";
import { intakeApi } from "./intake-api";
import { salesApi } from "./sales-api";
import { inventoryApi } from "./inventory-api";
import { followupsApi } from "./followups-api";

type Summary = { jobs: RemoteJob[]; customers: number; vehicles: number; leads: number; stock: number; followups: number };

export function RemoteDashboard({ config, onNavigate }: { config: CognitoConfig; onNavigate: (label: string) => void }) {
  const [summary, setSummary] = useState<Summary>();
  const [error, setError] = useState("");
  const refresh = async () => {
    const [jobs, customers, vehicles, leads, stock, followups] = await Promise.all([
      jobsApi.list(config), intakeApi.customers.list(config), intakeApi.vehicles.list(config),
      salesApi.leads(config), inventoryApi.catalogue.list(config), followupsApi.list(config),
    ]);
    setSummary({ jobs, customers: customers.length, vehicles: vehicles.length, leads: leads.length,
      stock: stock.length, followups: followups.length }); setError("");
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "Dashboard could not be loaded.")); }, [config]);
  const cards = summary ? [
    ["Jobs", summary.jobs.length], ["Customers", summary.customers], ["Vehicles", summary.vehicles],
    ["Leads", summary.leads], ["Stock", summary.stock], ["Follow-ups", summary.followups],
  ] as const : [];
  return <section className="workspace single-panel"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Dashboard</h2><p>Current records from the shared workshop database</p></div><button onClick={() => void refresh()}>Refresh</button></div>
    {error && <p className="api-error" role="alert">{error}</p>}
    {!summary && !error && <p>Loading dashboard…</p>}
    {summary && <><div className="stock-summary">{cards.map(([label, count]) => <button key={label} onClick={() => onNavigate(label)}><strong>{count}</strong> {label}</button>)}</div>
      <h3>Recent job cards</h3><div className="table-wrap"><table><thead><tr><th>Job</th><th>Status</th><th>Work</th><th>Created</th></tr></thead>
        <tbody>{summary.jobs.slice(0, 15).map((job) => <tr key={job.id}><td>{job.jobNo}</td><td>{job.status}</td><td>{job.workList}</td><td>{job.createdAt.slice(0, 10)}</td></tr>)}</tbody></table></div></>}
  </div></section>;
}
