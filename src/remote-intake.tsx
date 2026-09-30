import { useEffect, useState, type FormEvent } from "react";
import { intakeApi, type RemoteCustomer, type RemoteVehicle, type RemoteVisit } from "./intake-api";
import type { CognitoConfig } from "./auth";

type IntakeManagerProps = { kind: "customers" | "vehicles"; config: CognitoConfig };
type CustomerDraft = { id?: number; name: string; mobile: string; type: string; address: string };
type VehicleDraft = { id?: number; customer_id: number; number: string; make: string; model: string; color: string; km: number; engine_no: string };
const emptyCustomer = (): CustomerDraft => ({ name: "", mobile: "", type: "Individual", address: "" });
const emptyVehicle = (customer_id = 0): VehicleDraft => ({ customer_id, number: "", make: "", model: "", color: "", km: 0, engine_no: "" });

/** API-backed editable master-data screens used only in Cognito mode. */
export function RemoteIntakeManager({ kind, config }: IntakeManagerProps) {
  const [customers, setCustomers] = useState<RemoteCustomer[]>([]);
  const [customerOptions, setCustomerOptions] = useState<RemoteCustomer[]>([]);
  const [vehicles, setVehicles] = useState<RemoteVehicle[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [customer, setCustomer] = useState<CustomerDraft>(emptyCustomer);
  const [vehicle, setVehicle] = useState<VehicleDraft>(emptyVehicle);
  const refresh = async (nextQuery = query) => {
    try {
      const [nextCustomers, nextVehicles, allCustomers] = await Promise.all([
        intakeApi.customers.list(config, { q: nextQuery }), intakeApi.vehicles.list(config, { q: nextQuery }), intakeApi.customers.list(config),
      ]);
      setCustomers(nextCustomers); setVehicles(nextVehicles); setCustomerOptions(allCustomers); setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); }
  };
  useEffect(() => { void refresh(""); }, [config]);
  const submitCustomer = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true);
    try { await intakeApi.customers.save(config, customer); setCustomer(emptyCustomer()); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  const submitVehicle = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true);
    try { await intakeApi.vehicles.save(config, vehicle); setVehicle(emptyVehicle(customerOptions[0]?.id ?? 0)); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  const archive = async (id: number) => {
    const reason = window.prompt("Why is this record being archived?");
    if (!reason?.trim()) return;
    setSaving(true);
    try { if (kind === "customers") await intakeApi.customers.archive(config, id, reason); else await intakeApi.vehicles.archive(config, id, reason); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); void refresh(query); };
  const rows = kind === "customers" ? customers : vehicles;
  return <section className="manager-panel" aria-label={`Remote ${kind}`}>
    <div className="panel-actions"><div><h3>{kind === "customers" ? "Customers" : "Vehicles"}</h3><span>Saved to the WorkshopOS API for the active tenant and permitted branch.</span></div></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    <form className="store-filter-grid" onSubmit={submitSearch}><label className="list-search">Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={kind === "customers" ? "Name or mobile" : "Registration, make or model"} /></label><button className="secondary-action">Search</button></form>
    {kind === "customers" ? <form className="form-grid" onSubmit={submitCustomer}>
      <label>Name<input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label><label>Mobile<input required value={customer.mobile} onChange={(event) => setCustomer({ ...customer, mobile: event.target.value })} /></label><label>Type<input required value={customer.type} onChange={(event) => setCustomer({ ...customer, type: event.target.value })} /></label><label>Address<input value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label><div className="action-row"><button className="primary-action" disabled={saving}>{customer.id ? "Save Customer" : "Add Customer"}</button>{customer.id && <button type="button" onClick={() => setCustomer(emptyCustomer())}>Cancel edit</button>}</div>
    </form> : <form className="form-grid" onSubmit={submitVehicle}>
      <label>Customer<select required value={vehicle.customer_id} onChange={(event) => setVehicle({ ...vehicle, customer_id: Number(event.target.value) })}><option value={0}>Select customer</option>{customerOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Registration<input required value={vehicle.number} onChange={(event) => setVehicle({ ...vehicle, number: event.target.value })} /></label><label>Make<input required value={vehicle.make} onChange={(event) => setVehicle({ ...vehicle, make: event.target.value })} /></label><label>Model<input required value={vehicle.model} onChange={(event) => setVehicle({ ...vehicle, model: event.target.value })} /></label><label>Colour<input value={vehicle.color} onChange={(event) => setVehicle({ ...vehicle, color: event.target.value })} /></label><label>KM<input required type="number" min="0" value={vehicle.km} onChange={(event) => setVehicle({ ...vehicle, km: Number(event.target.value) })} /></label><div className="action-row"><button className="primary-action" disabled={saving || !vehicle.customer_id}>{vehicle.id ? "Save Vehicle" : "Add Vehicle"}</button>{vehicle.id && <button type="button" onClick={() => setVehicle(emptyVehicle(customerOptions[0]?.id ?? 0))}>Cancel edit</button>}</div>
    </form>}
    <div className="table-wrap"><table><thead><tr>{kind === "customers" ? <><th>Name</th><th>Mobile</th><th>Type</th></> : <><th>Registration</th><th>Make / Model</th><th>KM</th></>}<th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{kind === "customers" ? <><td>{(row as RemoteCustomer).name}</td><td>{(row as RemoteCustomer).mobile}</td><td>{(row as RemoteCustomer).type}</td></> : <><td>{(row as RemoteVehicle).number}</td><td>{(row as RemoteVehicle).make} {(row as RemoteVehicle).model}</td><td>{(row as RemoteVehicle).km}</td></>}<td><div className="grid-actions"><button type="button" disabled={saving} onClick={() => kind === "customers" ? setCustomer({ id: (row as RemoteCustomer).id, name: (row as RemoteCustomer).name, mobile: (row as RemoteCustomer).mobile, type: (row as RemoteCustomer).type, address: (row as RemoteCustomer).address ?? "" }) : setVehicle({ id: (row as RemoteVehicle).id, customer_id: (row as RemoteVehicle).customer_id, number: (row as RemoteVehicle).number, make: (row as RemoteVehicle).make, model: (row as RemoteVehicle).model, color: (row as RemoteVehicle).color, km: (row as RemoteVehicle).km, engine_no: (row as RemoteVehicle).engine_no ?? "" })}>Edit</button><button type="button" className="grid-action-danger" disabled={saving} onClick={() => void archive(row.id)}>Archive</button></div></td></tr>)}</tbody></table></div>
  </section>;
}

type VisitDraft = { fuel: string; odoReading: number; fuelLevelValue: string; fuelLevelUnit: string; keys: string; accessories: string; requestedWork: string; photosNote: string; advisorId: string | null };
const toVisitDraft = (visit: RemoteVisit): VisitDraft => ({ fuel: visit.fuel, odoReading: visit.odoReading, fuelLevelValue: visit.fuelLevelValue, fuelLevelUnit: visit.fuelLevelUnit, keys: visit.keys, accessories: visit.accessories, requestedWork: visit.requestedWork, photosNote: visit.photosNote, advisorId: visit.advisorId });

/** Cognito-mode reception queue; refreshes remote state after every successful mutation. */
export function RemoteReceptionIntake({ config }: { config: CognitoConfig }) {
  const [customers, setCustomers] = useState<RemoteCustomer[]>([]);
  const [vehicles, setVehicles] = useState<RemoteVehicle[]>([]);
  const [visits, setVisits] = useState<RemoteVisit[]>([]);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<RemoteVisit>();
  const [draft, setDraft] = useState<VisitDraft>();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const refresh = async (nextQuery = query) => {
    try {
      const [nextVisits, nextCustomers, nextVehicles] = await Promise.all([intakeApi.visits.list(config, { q: nextQuery }), intakeApi.customers.list(config), intakeApi.vehicles.list(config)]);
      setVisits(nextVisits); setCustomers(nextCustomers); setVehicles(nextVehicles); setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); }
  };
  useEffect(() => { void refresh(""); }, [config]);
  const customerName = (id: number) => customers.find((item) => item.id === id)?.name ?? `Customer #${id}`;
  const vehicleName = (id: number) => vehicles.find((item) => item.id === id)?.number ?? `Vehicle #${id}`;
  const startEdit = (visit: RemoteVisit) => { setEditing(visit); setDraft(toVisitDraft(visit)); setCreating(false); };
  const saveEdit = async (event: FormEvent) => {
    event.preventDefault(); if (!editing || !draft) return; setSaving(true);
    try { await intakeApi.visits.update(config, editing.id, draft); setEditing(undefined); setDraft(undefined); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  const archive = async (visit: RemoteVisit) => {
    const reason = window.prompt(`Why is visit #${visit.id} being archived?`);
    if (!reason?.trim()) return;
    setSaving(true);
    try { await intakeApi.visits.archive(config, visit.id, reason); if (editing?.id === visit.id) { setEditing(undefined); setDraft(undefined); } await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  return <section className="workspace single-panel reception-queue" aria-label="Remote reception queue"><div className="desk-panel">
    <div className="queue-heading"><div><h2>Reception Queue</h2><p>API-backed visits for the active tenant and branch.</p></div><button className="primary-action" onClick={() => { setCreating(true); setEditing(undefined); }}>Create New Visit</button></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    <form className="store-filter-grid" onSubmit={(event) => { event.preventDefault(); void refresh(query); }}><label className="list-search">Search visits<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, vehicle, or requested work" /></label><button className="secondary-action">Search</button></form>
    {creating && <RemoteVisitIntakeForm config={config} onSaved={async () => { setCreating(false); await refresh(); }} />}
    {editing && draft && <form className="remote-visit-intake" onSubmit={saveEdit}><h3>Edit visit · {vehicleName(editing.vehicleId)} · {customerName(editing.customerId)}</h3><div className="form-grid"><label>Fuel<input required value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value })} /></label><label>ODO meter reading (km)<input required min="0" type="number" value={draft.odoReading} onChange={(event) => setDraft({ ...draft, odoReading: Number(event.target.value) })} /></label><label>Fuel level value<input value={draft.fuelLevelValue} onChange={(event) => setDraft({ ...draft, fuelLevelValue: event.target.value })} /></label><label>Fuel level unit<input value={draft.fuelLevelUnit} onChange={(event) => setDraft({ ...draft, fuelLevelUnit: event.target.value })} /></label><label>Keys<input value={draft.keys} onChange={(event) => setDraft({ ...draft, keys: event.target.value })} /></label><label>Accessories<input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value })} /></label></div><label>Requested work<textarea required rows={3} value={draft.requestedWork} onChange={(event) => setDraft({ ...draft, requestedWork: event.target.value })} /></label><label>Photo note<input value={draft.photosNote} onChange={(event) => setDraft({ ...draft, photosNote: event.target.value })} /></label><div className="action-row"><button className="primary-action" disabled={saving}>Save Visit</button><button type="button" onClick={() => { setEditing(undefined); setDraft(undefined); }}>Cancel</button></div></form>}
    <div className="table-wrap"><table aria-label="Remote reception visits"><thead><tr><th>Received</th><th>Customer</th><th>Vehicle</th><th>Requested work</th><th>Action</th></tr></thead><tbody>{visits.map((visit) => <tr key={visit.id}><td>{new Date(visit.receivedAt).toLocaleString()}</td><td>{customerName(visit.customerId)}</td><td>{vehicleName(visit.vehicleId)}</td><td>{visit.requestedWork}</td><td><div className="grid-actions"><button type="button" disabled={saving} onClick={() => startEdit(visit)}>Edit</button><button type="button" className="grid-action-danger" disabled={saving} onClick={() => void archive(visit)}>Archive</button></div></td></tr>)}</tbody></table></div>
    {!visits.length && <p className="empty-state">No matching reception visits.</p>}
  </div></section>;
}

/** The creation form is also embedded in the remote reception queue. */
export function RemoteVisitIntakeForm({ config, onSaved }: { config: CognitoConfig; onSaved: () => void | Promise<void> }) {
  const [draft, setDraft] = useState({ customerName: "", mobile: "", customerType: "Individual", vehicleNo: "", make: "", model: "", color: "", km: "", fuel: "", requestedWork: "", keys: "", accessories: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const customers = await intakeApi.customers.list(config, { q: draft.mobile });
      const customer = customers.find((item) => item.mobile === draft.mobile.trim()) ?? await intakeApi.customers.save(config, { name: draft.customerName, mobile: draft.mobile, type: draft.customerType });
      const vehicles = await intakeApi.vehicles.list(config, { q: draft.vehicleNo });
      const vehicle = vehicles.find((item) => item.number.toUpperCase() === draft.vehicleNo.trim().toUpperCase()) ?? await intakeApi.vehicles.save(config, { customer_id: customer.id, number: draft.vehicleNo, make: draft.make, model: draft.model, color: draft.color, km: Number(draft.km), engine_no: "" });
      await intakeApi.visits.create(config, { customerId: customer.id, vehicleId: vehicle.id, advisorId: null, fuel: draft.fuel, odoReading: Number(draft.km), fuelLevelValue: "", fuelLevelUnit: "", keys: draft.keys, accessories: draft.accessories, requestedWork: draft.requestedWork, photosNote: "Reception intake" });
      await onSaved();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  return <form className="remote-visit-intake" onSubmit={submit}><h3>Create API visit</h3><div className="form-grid"><label>Customer name<input required value={draft.customerName} onChange={(event) => setDraft({ ...draft, customerName: event.target.value })} /></label><label>Mobile<input required value={draft.mobile} onChange={(event) => setDraft({ ...draft, mobile: event.target.value })} /></label><label>Vehicle number<input required value={draft.vehicleNo} onChange={(event) => setDraft({ ...draft, vehicleNo: event.target.value })} /></label><label>Make<input required value={draft.make} onChange={(event) => setDraft({ ...draft, make: event.target.value })} /></label><label>Model<input required value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value })} /></label><label>Colour<input value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} /></label><label>ODO meter reading (km)<input required type="number" min="0" value={draft.km} onChange={(event) => setDraft({ ...draft, km: event.target.value })} /></label><label>Fuel / battery level<input required value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value })} /></label></div><label>Requested work<textarea required rows={3} value={draft.requestedWork} onChange={(event) => setDraft({ ...draft, requestedWork: event.target.value })} /></label><label>Keys<input value={draft.keys} onChange={(event) => setDraft({ ...draft, keys: event.target.value })} /></label><label>Accessories<input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value })} /></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="action-row"><button className="primary-action" disabled={saving}>{saving ? "Saving…" : "Create Visit"}</button></div></form>;
}
