import { useEffect, useState } from "react";
import type { CognitoConfig } from "./auth";
import { inventoryApi, type RemoteCatalogueItem } from "./inventory-api";
import { jobsApi, type RemoteJob } from "./jobs-api";
import { materialsApi, type RemoteMaterialEvent, type RemoteMaterialReservation } from "./materials-api";

type Mode = "requests" | "issue" | "reconcile";

/** Authenticated material workspace. Signed-out users continue to use the SQLite demo Store Desk. */
export function RemoteMaterialsWorkspace({ config, mode }: { config: CognitoConfig; mode: Mode }) {
  const [reservations, setReservations] = useState<RemoteMaterialReservation[]>([]);
  const [events, setEvents] = useState<RemoteMaterialEvent[]>([]);
  const [jobs, setJobs] = useState<RemoteJob[]>([]); const [items, setItems] = useState<RemoteCatalogueItem[]>([]);
  const [jobId, setJobId] = useState(0); const [itemId, setItemId] = useState(0); const [quantity, setQuantity] = useState(1); const [note, setNote] = useState("");
  const [reservationKey, setReservationKey] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const refresh = async () => {
    const [nextReservations, nextEvents, nextJobs, nextItems] = await Promise.all([
      materialsApi.reservations(config), materialsApi.ledger(config), jobsApi.list(config), inventoryApi.catalogue.list(config),
    ]);
    setReservations(nextReservations); setEvents(nextEvents); setJobs(nextJobs); setItems(nextItems);
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "MATERIALS_API_FAILED")); }, [config]);
  const run = async (work: () => Promise<unknown>) => { setBusy(true); setError(""); try { await work(); await refresh(); } catch (caught) { setError(caught instanceof Error ? caught.message : "MATERIALS_API_FAILED"); } finally { setBusy(false); } };
  const command = (reservation: RemoteMaterialReservation, kind: "issue" | "return" | "waste" | "release" | "reverse-issue") => {
    const raw = window.prompt(`${kind.replace("-", " ")} quantity`, String(kind === "issue" ? reservation.availableToIssue || 1 : reservation.onJobQty || 1));
    const commandQuantity = Number(raw);
    if (!(commandQuantity > 0)) return;
    const reason = ["waste", "release", "reverse-issue"].includes(kind) ? window.prompt("Reason", "") ?? "" : "";
    if (["waste", "release", "reverse-issue"].includes(kind) && !reason.trim()) return;
    void run(() => materialsApi.command(config, reservation.id, kind, { quantity: commandQuantity, reason }));
  };
  const title = mode === "requests" ? "Material Reservations" : mode === "issue" ? "Issue Material" : "Material Reconciliation";
  return <section className="manager-panel" aria-label="Online job material ledger"><div className="panel-actions"><div><h3>{title}</h3><span>Live tenant and branch records. Reservation, issue, return and waste are separate immutable outcomes.</span></div></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    {mode === "requests" && <form className="form-grid" onSubmit={(event) => { event.preventDefault(); if (!jobId || !itemId || !(quantity > 0)) return; const requestKey = reservationKey || crypto.randomUUID(); setReservationKey(requestKey); void run(async () => { await materialsApi.reserve(config, { jobId, itemId, quantity, note }, requestKey); setNote(""); setReservationKey(""); }); }}>
      <label>Approved job<select required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.filter((job) => !["CANCELLED", "CLOSED"].includes(job.status)).map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.status}</option>)}</select></label>
      <label>Branch item<select required value={itemId} onChange={(event) => setItemId(Number(event.target.value))}><option value={0}>Select item</option>{items.map((item) => <option key={item.id} value={item.id}>{item.sku} · {item.name} ({item.onHand} {item.unit})</option>)}</select></label>
      <label>Reserve qty<input required min="0.001" step="0.001" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label><label>Request note<input value={note} onChange={(event) => setNote(event.target.value)} /></label><div className="action-row"><button type="submit" className="primary-action" disabled={busy}>Reserve stock</button></div>
    </form>}
    <div className="table-wrap"><table aria-label="Job material reservations"><thead><tr><th>Job</th><th>Item</th><th>Reserved</th><th>Available to reserve</th><th>Issued</th><th>On job</th><th>Status</th><th>Action</th></tr></thead><tbody>{reservations.map((reservation) => <tr key={reservation.id}><td>{reservation.jobId}</td><td>{items.find((item) => item.id === reservation.itemId)?.name ?? `Item #${reservation.itemId}`}</td><td>{reservation.reservedQty}</td><td>{reservation.availableToReserve}</td><td>{reservation.issuedQty}</td><td>{reservation.onJobQty}</td><td>{reservation.status}</td><td><div className="grid-actions">{mode === "issue" && reservation.availableToIssue > 0 && <button disabled={busy} onClick={() => command(reservation, "issue")}>Issue</button>}{mode === "reconcile" && <>{reservation.onJobQty > 0 && <><button disabled={busy} onClick={() => command(reservation, "return")}>Return</button><button className="grid-action-danger" disabled={busy} onClick={() => command(reservation, "waste")}>Waste</button><button disabled={busy} onClick={() => command(reservation, "reverse-issue")}>Reverse issue</button></>}{reservation.availableToIssue > 0 && <button disabled={busy} onClick={() => command(reservation, "release")}>Release</button>}</>}</div></td></tr>)}</tbody></table></div>
    {mode === "reconcile" && <><h4>Immutable material history</h4><div className="table-wrap"><table aria-label="Material ledger"><thead><tr><th>When</th><th>Job</th><th>Item</th><th>Outcome</th><th>Qty</th><th>Reason</th></tr></thead><tbody>{events.map((entry) => <tr key={entry.id}><td>{new Date(entry.createdAt).toLocaleString()}</td><td>{entry.jobId}</td><td>{items.find((item) => item.id === entry.itemId)?.name ?? `Item #${entry.itemId}`}</td><td>{entry.entryType}</td><td>{entry.quantity}</td><td>{entry.reason}</td></tr>)}</tbody></table></div></>}
  </section>;
}
