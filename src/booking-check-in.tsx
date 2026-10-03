import { useState, type FormEvent } from "react";
import type { Database } from "sql.js";
import { checkInBooking } from "./db";
import { serializeDamageMarks, type DamageMark } from "./job-sheet";
import type { Booking, User } from "./types";
import { BodyMarkDiagram } from "./body-mark";
import { Dialog } from "./ui-kit";

type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
type FuelUnit = "bars" | "%" | "litres" | "Other";

export function BookingCheckInDialog({ booking, actor, mutate, onClose, onCreated }: {
  booking: Booking;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
  onCreated: (jobId: number, jobNo: string) => void;
}) {
  const [odoReading, setOdoReading] = useState("");
  const [fuelLevelValue, setFuelLevelValue] = useState("");
  const [fuelLevelUnit, setFuelLevelUnit] = useState<FuelUnit>("bars");
  const [keys, setKeys] = useState("");
  const [accessories, setAccessories] = useState("");
  const [requestedWork, setRequestedWork] = useState(booking.requested_work);
  const [marks, setMarks] = useState<DamageMark[]>([]);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const odo = Number(odoReading);
    if (!Number.isFinite(odo) || odo < 0) return setError("Enter the ODO meter reading in km.");
    let jobId = 0;
    let jobNo = "";
    if (mutate((db) => { jobId = checkInBooking(db, booking.id, actor.id, { odoReading: odo, fuelLevelValue, fuelLevelUnit, keys, accessories, requestedWork, damageMarks: serializeDamageMarks(marks) }).jobId; jobNo = String(db.exec("select job_no from job_cards where id=?", [jobId])[0]?.values[0]?.[0] ?? ""); }, setError)) onCreated(jobId, jobNo);
  };
  return <Dialog wide title="Check in advance booking" subtitle={`${booking.customer_name} · ${booking.vehicle_no}`} onClose={onClose} footer={<button className="primary-action" type="submit" form="booking-check-in-form">Create Visit and Job Card</button>}>
    <form id="booking-check-in-form" onSubmit={submit}>
      <p className="permission-note">Booking details are prefilled below. Capture actual arrival condition; advisor assignment happens after check-in.</p>
      <div className="form-grid">
        <label>Customer name<input value={booking.customer_name} readOnly /></label><label>Mobile<input value={booking.mobile} readOnly /></label>
        <label>Vehicle number<input value={booking.vehicle_no} readOnly /></label><label>Vehicle<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly /></label><label>Booked service type<input value={booking.service_type} readOnly /></label>
        <label>ODO meter reading (km)<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} /></label>
        <label>Fuel / battery level<div className="field-pair"><input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} /><select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}><option value="bars">bars</option><option value="%">%</option><option value="litres">litres</option><option value="Other">Other</option></select></div></label>
        <label>Keys<input value={keys} onChange={(event) => setKeys(event.target.value)} /></label><label>Accessories<input value={accessories} onChange={(event) => setAccessories(event.target.value)} /></label>
      </div>
      <label>Requested work<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} /></label>
      <div className="damage-capture"><strong>Arrival body marks (optional)</strong><BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} /></div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  </Dialog>;
}
