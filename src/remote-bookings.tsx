import { useEffect, useState, type FormEvent } from "react";
import type { CognitoConfig } from "./auth";
import { intakeApi, type RemoteBooking, type RemoteCustomer, type RemoteVehicle } from "./intake-api";

const today = () => new Date().toISOString().slice(0, 10);

/** Cognito-mode Booking desk. Its writes are commands to the API, never SQLite. */
export function RemoteBookingDesk({ config }: { config: CognitoConfig }) {
  const [bookings, setBookings] = useState<RemoteBooking[]>([]);
  const [customers, setCustomers] = useState<RemoteCustomer[]>([]);
  const [vehicles, setVehicles] = useState<RemoteVehicle[]>([]);
  const [draft, setDraft] = useState({ customerId: 0, vehicleId: 0, bookingDate: today(), serviceType: "Service Work" as RemoteBooking["serviceType"], arrivalWindow: "", requestedWork: "" });
  const [checkingIn, setCheckingIn] = useState<RemoteBooking>();
  const [intake, setIntake] = useState({ fuel: "", odoReading: "", fuelLevelValue: "", fuelLevelUnit: "bars", keys: "", accessories: "", requestedWork: "", photosNote: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const refresh = async () => {
    try {
      const [nextBookings, nextCustomers, nextVehicles] = await Promise.all([intakeApi.bookings.list(config), intakeApi.customers.list(config), intakeApi.vehicles.list(config)]);
      setBookings(nextBookings); setCustomers(nextCustomers); setVehicles(nextVehicles); setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); }
  };
  useEffect(() => { void refresh(); }, [config]);
  const submitBooking = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    try { await intakeApi.bookings.create(config, draft); setDraft({ ...draft, requestedWork: "" }); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  const submitCheckIn = async (event: FormEvent) => {
    event.preventDefault(); if (!checkingIn) return; setSaving(true); setError("");
    try {
      await intakeApi.bookings.checkIn(config, checkingIn.id, { ...intake, odoReading: Number(intake.odoReading) });
      setCheckingIn(undefined); await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "API_FAILED"); } finally { setSaving(false); }
  };
  const selectedVehicles = vehicles.filter((vehicle) => vehicle.customer_id === draft.customerId);
  return <section className="workspace" aria-label="API-backed advance bookings"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Advance Bookings</h2><p>Bookings and check-in are saved through the WorkshopOS API.</p></div></div>
    {error && <p className="api-error" role="alert">{error}</p>}
    <form className="form-grid" onSubmit={submitBooking}>
      <label>Customer<select required value={draft.customerId} onChange={(event) => setDraft({ ...draft, customerId: Number(event.target.value), vehicleId: 0 })}><option value={0}>Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.mobile}</option>)}</select></label>
      <label>Vehicle<select required value={draft.vehicleId} onChange={(event) => setDraft({ ...draft, vehicleId: Number(event.target.value) })}><option value={0}>Select vehicle</option>{selectedVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.number} · {vehicle.make} {vehicle.model}</option>)}</select></label>
      <label>Booking date<input required type="date" value={draft.bookingDate} onChange={(event) => setDraft({ ...draft, bookingDate: event.target.value })} /></label>
      <label>Service type<select value={draft.serviceType} onChange={(event) => setDraft({ ...draft, serviceType: event.target.value as RemoteBooking["serviceType"] })}><option>Service Work</option><option>General Checkup / Follow-up</option></select></label>
      <label>Arrival window<input value={draft.arrivalWindow} onChange={(event) => setDraft({ ...draft, arrivalWindow: event.target.value })} /></label>
      <label>Requested work<textarea required value={draft.requestedWork} onChange={(event) => setDraft({ ...draft, requestedWork: event.target.value })} /></label>
      <div className="action-row"><button className="primary-action" disabled={saving || !draft.customerId || !draft.vehicleId}>Create Booking</button></div>
    </form>
    <div className="table-wrap"><table aria-label="API bookings"><thead><tr><th>Date</th><th>Service</th><th>Work</th><th>Status</th><th>Action</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id}><td>{booking.bookingDate}</td><td>{booking.serviceType}</td><td>{booking.requestedWork}</td><td>{booking.status}</td><td>{["BOOKED", "CONFIRMED", "RESCHEDULED"].includes(booking.status) && <button type="button" disabled={saving} onClick={() => { setCheckingIn(booking); setIntake({ ...intake, requestedWork: booking.requestedWork }); }}>Check in</button>}</td></tr>)}</tbody></table></div>
    {!bookings.length && <p className="empty-state">No advance bookings.</p>}
    {checkingIn && <form className="remote-visit-intake" onSubmit={submitCheckIn}><h3>Check in booking</h3><div className="form-grid"><label>Fuel / battery level<input required value={intake.fuel} onChange={(event) => setIntake({ ...intake, fuel: event.target.value })} /></label><label>ODO meter reading (km)<input required min="0" type="number" value={intake.odoReading} onChange={(event) => setIntake({ ...intake, odoReading: event.target.value })} /></label><label>Fuel value<input value={intake.fuelLevelValue} onChange={(event) => setIntake({ ...intake, fuelLevelValue: event.target.value })} /></label><label>Fuel unit<input value={intake.fuelLevelUnit} onChange={(event) => setIntake({ ...intake, fuelLevelUnit: event.target.value })} /></label><label>Keys<input value={intake.keys} onChange={(event) => setIntake({ ...intake, keys: event.target.value })} /></label><label>Accessories<input value={intake.accessories} onChange={(event) => setIntake({ ...intake, accessories: event.target.value })} /></label></div><label>Requested work<textarea required value={intake.requestedWork} onChange={(event) => setIntake({ ...intake, requestedWork: event.target.value })} /></label><label>Arrival note<input value={intake.photosNote} onChange={(event) => setIntake({ ...intake, photosNote: event.target.value })} /></label><div className="action-row"><button className="primary-action" disabled={saving}>Create Visit and Job Card</button><button type="button" onClick={() => setCheckingIn(undefined)}>Cancel</button></div></form>}
  </div></section>;
}
