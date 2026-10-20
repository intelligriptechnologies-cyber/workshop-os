import { useEffect, useState, type FormEvent } from "react";
import type { CognitoConfig } from "./auth";
import { intakeApi, type RemoteCustomer, type RemoteVehicle } from "./intake-api";

type Kind = "customers" | "vehicles";
type CustomerDraft = { id?: number; name: string; mobile: string; type: string; address: string };
type VehicleDraft = { id?: number; customer_id: number; number: string; make: string; model: string; color: string; km: number; engine_no: string };
const blankCustomer: CustomerDraft = { name: "", mobile: "", type: "Individual", address: "" };
const blankVehicle: VehicleDraft = { customer_id: 0, number: "", make: "", model: "", color: "", km: 0, engine_no: "" };

export function RemoteEntities({ config, kind }: { config: CognitoConfig; kind: Kind }) {
  const [customers, setCustomers] = useState<RemoteCustomer[]>([]);
  const [vehicles, setVehicles] = useState<RemoteVehicle[]>([]);
  const [query, setQuery] = useState("");
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft | null>(null);
  const [vehicleDraft, setVehicleDraft] = useState<VehicleDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refresh = async () => {
    const [nextCustomers, nextVehicles] = await Promise.all([intakeApi.customers.list(config), intakeApi.vehicles.list(config)]);
    setCustomers(nextCustomers); setVehicles(nextVehicles);
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "Records could not be loaded.")); }, [config]);
  const run = async (work: () => Promise<unknown>, close: () => void) => {
    setBusy(true); setError("");
    try { await work(); await refresh(); close(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Save failed."); }
    finally { setBusy(false); }
  };
  const saveCustomer = (event: FormEvent) => { event.preventDefault(); if (customerDraft) void run(() => intakeApi.customers.save(config, customerDraft), () => setCustomerDraft(null)); };
  const saveVehicle = (event: FormEvent) => { event.preventDefault(); if (vehicleDraft) void run(() => intakeApi.vehicles.save(config, vehicleDraft), () => setVehicleDraft(null)); };
  const archive = (id: number) => {
    const reason = window.prompt("Reason for archiving:");
    if (!reason?.trim()) return;
    void run(() => kind === "customers" ? intakeApi.customers.archive(config, id, reason) : intakeApi.vehicles.archive(config, id, reason), () => undefined);
  };
  const matchingCustomers = customers.filter((item) => `${item.name} ${item.mobile}`.toLowerCase().includes(query.toLowerCase()));
  const matchingVehicles = vehicles.filter((item) => `${item.number} ${item.make} ${item.model} ${customers.find((customer) => customer.id === item.customer_id)?.name ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="workspace single-panel"><div className="desk-panel">
    <div className="panel-actions"><div><h2>{kind === "customers" ? "Customers" : "Vehicles"}</h2><p>Shared workshop records</p></div>
      <button className="primary-action" onClick={() => kind === "customers" ? setCustomerDraft({ ...blankCustomer }) : setVehicleDraft({ ...blankVehicle, customer_id: customers[0]?.id ?? 0 })}>Add {kind === "customers" ? "Customer" : "Vehicle"}</button></div>
    {error && <p className="api-error" role="alert">{error} <button onClick={() => void refresh()}>Retry</button></p>}
    <label className="list-search">Search<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    {customerDraft && <form className="form-grid" onSubmit={saveCustomer}>
      <h3>{customerDraft.id ? "Edit Customer" : "Add Customer"}</h3>
      <label>Name<input required value={customerDraft.name} onChange={(event) => setCustomerDraft({ ...customerDraft, name: event.target.value })} /></label>
      <label>Mobile<input required value={customerDraft.mobile} onChange={(event) => setCustomerDraft({ ...customerDraft, mobile: event.target.value })} /></label>
      <label>Type<input required value={customerDraft.type} onChange={(event) => setCustomerDraft({ ...customerDraft, type: event.target.value })} /></label>
      <label>Address<input value={customerDraft.address} onChange={(event) => setCustomerDraft({ ...customerDraft, address: event.target.value })} /></label>
      <div className="action-row"><button className="primary-action" disabled={busy}>Save</button><button type="button" onClick={() => setCustomerDraft(null)}>Cancel</button></div>
    </form>}
    {vehicleDraft && <form className="form-grid" onSubmit={saveVehicle}>
      <h3>{vehicleDraft.id ? "Edit Vehicle" : "Add Vehicle"}</h3>
      <label>Customer<select required value={vehicleDraft.customer_id || ""} onChange={(event) => setVehicleDraft({ ...vehicleDraft, customer_id: Number(event.target.value) })}><option value="">Select customer</option>{customers.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.mobile}</option>)}</select></label>
      {(["number", "make", "model", "color", "engine_no"] as const).map((field) => <label key={field}>{field === "engine_no" ? "Engine number" : field}<input required={field === "number" || field === "make" || field === "model"} value={vehicleDraft[field] ?? ""} onChange={(event) => setVehicleDraft({ ...vehicleDraft, [field]: event.target.value })} /></label>)}
      <label>Kilometres<input type="number" min="0" value={vehicleDraft.km} onChange={(event) => setVehicleDraft({ ...vehicleDraft, km: Number(event.target.value) })} /></label>
      <div className="action-row"><button className="primary-action" disabled={busy}>Save</button><button type="button" onClick={() => setVehicleDraft(null)}>Cancel</button></div>
    </form>}
    <div className="table-wrap"><table><thead><tr>{kind === "customers" ? <><th>Name</th><th>Mobile</th><th>Type</th><th>Vehicles</th></> : <><th>Registration</th><th>Make / Model</th><th>Customer</th><th>KM</th></>}<th>Actions</th></tr></thead>
      <tbody>{kind === "customers" ? matchingCustomers.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.mobile}</td><td>{item.type}</td><td>{vehicles.filter((vehicle) => vehicle.customer_id === item.id).length}</td><td><button disabled={busy} onClick={() => setCustomerDraft({ id: item.id, name: item.name, mobile: item.mobile, type: item.type, address: item.address ?? "" })}>Edit</button><button disabled={busy} onClick={() => archive(item.id)}>Archive</button></td></tr>) : matchingVehicles.map((item) => <tr key={item.id}><td>{item.number}</td><td>{item.make} {item.model}</td><td>{customers.find((customer) => customer.id === item.customer_id)?.name ?? "—"}</td><td>{item.km}</td><td><button disabled={busy} onClick={() => setVehicleDraft({ id: item.id, customer_id: item.customer_id, number: item.number, make: item.make, model: item.model, color: item.color, km: item.km, engine_no: item.engine_no ?? "" })}>Edit</button><button disabled={busy} onClick={() => archive(item.id)}>Archive</button></td></tr>)}</tbody>
    </table></div>
  </div></section>;
}
