import { useMemo, useState, type FormEvent } from "react";
import type { Database } from "sql.js";
import {
  cancelBooking,
  DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY,
  DEFAULT_SERVICE_WORK_BOOKING_CAPACITY,
  markBookingNoShow,
  recordBookingCall,
  rescheduleBooking,
} from "./db";
import { BookingCheckInDialog } from "./booking-check-in";
import {
  expectedBookingsForDate,
  type ExpectedTodayFilter,
} from "./booking-followup";
import type { Booking, BookingArrivalWindow, User, WorkshopState } from "./types";
import { Dialog } from "./ui-kit";
import { advanceBookingRange, clampAdvanceBookingDate } from "./advance-booking-range";

type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
type Action = "call" | "reschedule" | "cancel" | "no-show" | "check-in";

const windowOptions: BookingArrivalWindow[] = ["", "Morning", "Afternoon", "Evening"];

export function ExpectedTodayBookings({ state, actor, mutate, operationalDate, onCheckedIn }: { state: WorkshopState; actor: User; mutate: Mutate; operationalDate: string; onCheckedIn?: (jobId: number, jobNo: string) => void }) {
  const range = useMemo(() => advanceBookingRange(), []);
  const [filter, setFilter] = useState<ExpectedTodayFilter>("ALL");
  const [selected, setSelected] = useState<{ booking: Booking; action: Action }>();
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState(operationalDate);
  const [arrivalWindow, setArrivalWindow] = useState<BookingArrivalWindow>("");
  const [capacityOverrideReason, setCapacityOverrideReason] = useState("");
  const rows = useMemo(
    () => expectedBookingsForDate(state.bookings, state.booking_call_logs, operationalDate, filter),
    [state.bookings, state.booking_call_logs, operationalDate, filter],
  );
  const allRows = useMemo(
    () => expectedBookingsForDate(state.bookings, state.booking_call_logs, operationalDate),
    [state.bookings, state.booking_call_logs, operationalDate],
  );
  const openAction = (booking: Booking, action: Action) => {
    setSelected({ booking, action });
    setError("");
    setNote("");
    setCapacityOverrideReason("");
    setRescheduleDate(clampAdvanceBookingDate(booking.booking_date, range));
    setArrivalWindow(booking.arrival_window);
  };
  const closeAction = () => { setSelected(undefined); setError(""); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || selected.action === "check-in") return;
    const success = mutate((db) => {
      if (selected.action === "call") recordBookingCall(db, selected.booking.id, actor.id, note);
      if (selected.action === "reschedule") rescheduleBooking(db, selected.booking.id, actor.id, rescheduleDate, note, arrivalWindow, new Date().toISOString(), capacityOverrideReason);
      if (selected.action === "cancel") cancelBooking(db, selected.booking.id, actor.id, note);
      if (selected.action === "no-show") markBookingNoShow(db, selected.booking.id, actor.id, note);
    }, setError);
    if (success) closeAction();
  };
  const title = selected?.action === "call" ? "Log follow-up call" : selected?.action === "reschedule" ? "Reschedule booking" : selected?.action === "cancel" ? "Cancel booking" : "Mark booking as no-show";
  const reschedulingBooking = selected?.action === "reschedule" ? selected.booking : undefined;
  const rescheduleQuotaFull = Boolean(reschedulingBooking && (() => {
    const configured = state.booking_capacity_limits.find((limit) => limit.booking_date === rescheduleDate);
    const limit = reschedulingBooking.service_type === "Service Work" ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
    const count = state.bookings.filter((booking) => booking.id !== reschedulingBooking.id && booking.booking_date === rescheduleDate && booking.service_type === reschedulingBooking.service_type && ["Booked", "Confirmed", "Rescheduled"].includes(booking.status)).length;
    return count >= limit;
  })());

  if (selected?.action === "check-in") return <BookingCheckInDialog booking={selected.booking} actor={actor} mutate={mutate} onClose={closeAction} onCreated={(jobId, jobNo) => { closeAction(); onCheckedIn?.(jobId, jobNo); }} />;

  return <section className="expected-today" aria-labelledby="expected-today-title">
    <div className="expected-today-heading">
      <div>
        <h2 id="expected-today-title">Expected Today</h2>
        <p>{operationalDate} · customers yet to arrive at reception</p>
      </div>
      <span className="expected-count" aria-label={`${allRows.length} expected customers`}>{allRows.length} expected</span>
    </div>
    <div className="expected-filter-bar" role="group" aria-label="Expected today filters">
      <label>Follow-up status<select aria-label="Expected today follow-up status" value={filter} onChange={(event) => setFilter(event.target.value as ExpectedTodayFilter)}>
        <option value="ALL">All expected</option><option value="NEEDS_FOLLOW_UP">Needs follow-up</option><option value="CALLED">Call logged</option>
      </select></label>
      <span>{rows.length} shown</span>
    </div>
    <div className="expected-booking-list">
      {rows.map(({ booking, calls, lastCall }) => <article className="expected-booking-row" key={booking.id}>
        <div className="expected-booking-identity"><strong>{booking.customer_name}</strong><span>{booking.vehicle_no} · {booking.make} {booking.model}</span><span>{booking.service_type} · {booking.mobile} · {booking.arrival_window || "Arrival time not set"}</span></div>
        <div className="expected-booking-work"><span className={`booking-status booking-status-${booking.status.toLowerCase()}`}>{booking.status}</span><p>{booking.requested_work}</p>{lastCall ? <small>Last call: {new Date(lastCall.called_at).toLocaleString("en-IN")} · {lastCall.note}</small> : <small className="needs-follow-up">No call logged yet</small>}</div>
        <div className="expected-booking-actions"><button type="button" className="primary-action" onClick={() => openAction(booking, "check-in")}>Check in</button><button type="button" onClick={() => openAction(booking, "call")}>Log call{calls.length ? ` (${calls.length})` : ""}</button><button type="button" onClick={() => openAction(booking, "reschedule")}>Reschedule</button><button type="button" className="danger-action" onClick={() => openAction(booking, "cancel")}>Cancel</button><button type="button" className="secondary-action" onClick={() => openAction(booking, "no-show")}>No-show</button></div>
      </article>)}
      {!rows.length && <div className="expected-empty"><strong>No customers match this filter.</strong><span>Bookings checked in, cancelled, rescheduled away, or marked no-show do not appear here.</span></div>}
    </div>
    {selected && <Dialog title={title} subtitle={`${selected.booking.customer_name} · ${selected.booking.vehicle_no}`} onClose={closeAction} footer={<button type="submit" form="booking-follow-up-form" className={selected.action === "cancel" ? "danger-action" : "primary-action"}>{selected.action === "call" ? "Save call note" : selected.action === "reschedule" ? "Save reschedule" : selected.action === "cancel" ? "Cancel booking" : "Mark no-show"}</button>}>
      <form id="booking-follow-up-form" className="booking-follow-up-form" onSubmit={submit}>
        {selected.action === "reschedule" && <><label>New booking date<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required /></label><label>Booked service type<input value={selected.booking.service_type} readOnly /></label><label>Arrival window<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>{windowOptions.map((window) => <option key={window} value={window}>{window || "Not set"}</option>)}</select></label>{rescheduleQuotaFull && actor.role === "admin" && <label>Admin override reason (recorded in the booking audit trail)<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} /></label>}</>}
        <label>{selected.action === "call" ? "Call note" : selected.action === "reschedule" ? "Reschedule reason" : selected.action === "cancel" ? "Cancellation reason" : "No-show reason"}<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required /></label>
        {selected.action === "no-show" && <p className="permission-note">Use this only after day-end follow-up. This is a manual status and cannot be undone from Expected Today.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
    </Dialog>}
  </section>;
}
