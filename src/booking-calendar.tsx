import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import {
  createBooking,
  DEFAULT_DAILY_BOOKING_CAPACITY,
  setBookingCapacityForDate,
} from "./db";
import type { Database } from "sql.js";
import type { Booking, BookingArrivalWindow, User, WorkshopState } from "./types";
import { Dialog } from "./ui-kit";
import {
  advanceBookingRange,
  clampAdvanceBookingDate,
  datesForCalendarMonth,
  isAdvanceBookingDate,
  shiftCalendarMonth,
} from "./advance-booking-range";

type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;

const windows: BookingArrivalWindow[] = ["", "Morning", "Afternoon", "Evening"];
const capacityStatuses = new Set<Booking["status"]>(["Booked", "Confirmed", "Rescheduled"]);

function dateLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function monthLabel(month: string) {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });
}

function capacityFor(state: WorkshopState, bookingDate: string) {
  const limit = state.booking_capacity_limits.find((row) => row.booking_date === bookingDate)?.capacity ?? DEFAULT_DAILY_BOOKING_CAPACITY;
  const count = state.bookings.filter((booking) => booking.booking_date === bookingDate && capacityStatuses.has(booking.status)).length;
  return { limit, count, remaining: Math.max(0, limit - count) };
}

type BookingDraft = {
  customerName: string; mobile: string; customerType: string; vehicleNo: string;
  make: string; model: string; color: string; requestedWork: string;
  bookingDate: string; arrivalWindow: BookingArrivalWindow; capacityOverrideReason: string;
};

const draftFor = (bookingDate: string): BookingDraft => ({
  customerName: "", mobile: "", customerType: "Individual", vehicleNo: "", make: "", model: "", color: "", requestedWork: "", bookingDate, arrivalWindow: "", capacityOverrideReason: "",
});

/** Shared monthly planner. It deliberately schedules a Booking, never an advisor, bay, Visit, or Job Card. */
export function BookingCalendar({ state, actor, mutate }: { state: WorkshopState; actor: User; mutate: Mutate }) {
  const range = useMemo(() => advanceBookingRange(), []);
  const [month, setMonth] = useState(range.firstMonth);
  const [selectedDate, setSelectedDate] = useState(range.min);
  const [creating, setCreating] = useState(false);
  const [editingCapacity, setEditingCapacity] = useState(false);
  const [capacityDraft, setCapacityDraft] = useState(String(capacityFor(state, selectedDate).limit));
  const [form, setForm] = useState<BookingDraft>(() => draftFor(range.min));
  const [error, setError] = useState("");

  const selectedCapacity = capacityFor(state, selectedDate);
  const selectedBookings = useMemo(
    () => state.bookings.filter((booking) => booking.booking_date === selectedDate).sort((left, right) => left.created_at.localeCompare(right.created_at)),
    [state.bookings, selectedDate],
  );
  const overrideByBooking = useMemo(
    () => new Map(state.booking_capacity_overrides.filter((row) => row.booking_date === selectedDate).map((row) => [row.booking_id, row])),
    [state.booking_capacity_overrides, selectedDate],
  );
  const full = selectedCapacity.count >= selectedCapacity.limit;
  const canOverride = actor.role === "admin";
  const changeMonth = (amount: -1 | 1) => {
    const nextMonth = shiftCalendarMonth(month, amount);
    if (nextMonth < range.firstMonth || nextMonth > range.lastMonth) return;
    setMonth(nextMonth);
    const nextDate = clampAdvanceBookingDate(`${nextMonth}-01`, range);
    setSelectedDate(nextDate);
    setCapacityDraft(String(capacityFor(state, nextDate).limit));
  };
  const openCreate = () => {
    setForm(draftFor(selectedDate));
    setError("");
    setCreating(true);
  };
  const submitBooking = (event: FormEvent) => {
    event.preventDefault();
    if (mutate((db) => createBooking(db, actor.id, form), setError)) setCreating(false);
  };
  const saveCapacity = (event: FormEvent) => {
    event.preventDefault();
    if (mutate((db) => setBookingCapacityForDate(db, actor.id, selectedDate, Number(capacityDraft)), setError)) setEditingCapacity(false);
  };

  return <section className="workspace booking-calendar-workspace" aria-label="Advance booking calendar">
    <div className="desk-panel">
      <div className="panel-actions">
        <div><h2>Advance Bookings</h2><p>Plan customer arrivals by date. Advisor assignment happens only after check-in.</p></div>
        <button className="primary-action" onClick={openCreate} disabled={full && !canOverride}><Plus size={16} /> Create Booking</button>
      </div>
      <div className="booking-calendar-layout">
        <section className="booking-month-panel" aria-label="Booking month calendar">
          <div className="booking-month-toolbar">
            <button type="button" aria-label="Previous month" disabled={month === range.firstMonth} onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
            <h3>{monthLabel(month)}</h3>
            <button type="button" aria-label="Next month" disabled={month === range.lastMonth} onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
          </div>
          <div className="booking-calendar-grid" role="grid" aria-label={`${monthLabel(month)} bookings`}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <strong key={day} role="columnheader">{day}</strong>)}
            {datesForCalendarMonth(month).map((date) => {
              const capacity = capacityFor(state, date);
              const outside = !date.startsWith(month);
              const unavailable = !isAdvanceBookingDate(date, range);
              const selected = date === selectedDate;
              const isFull = capacity.count >= capacity.limit;
              return <button type="button" key={date} role="gridcell" disabled={unavailable} onClick={() => { setSelectedDate(date); setCapacityDraft(String(capacity.limit)); }} className={`booking-calendar-day${outside ? " outside-month" : ""}${selected ? " selected" : ""}${isFull ? " full" : ""}`} aria-pressed={selected}>
                <span>{Number(date.slice(-2))}</span><small>{capacity.count}/{capacity.limit}</small>
              </button>;
            })}
          </div>
          <p className="booking-calendar-legend"><span className="calendar-full-dot" /> Full dates have reached their advance-booking limit.</p>
        </section>
        <section className="booking-day-detail" aria-live="polite">
          <div className="panel-actions"><div><h3>{dateLabel(selectedDate)}</h3><p><strong>{selectedCapacity.count}</strong> of <strong>{selectedCapacity.limit}</strong> advance bookings · {selectedCapacity.remaining} remaining</p></div>
            {canOverride && <button type="button" aria-label="Admin control: set daily booking limit" onClick={() => { setCapacityDraft(String(selectedCapacity.limit)); setError(""); setEditingCapacity(true); }}>Admin: Set limit</button>}
          </div>
          {full && <p className="booking-capacity-alert" role="status">This date is full. Reception cannot add another booking.{canOverride ? " Admin may add one with an override reason." : ""}</p>}
          <div className="booking-day-list">
            {selectedBookings.length === 0 ? <p className="empty-state">No advance bookings for this day.</p> : selectedBookings.map((booking) => {
              const override = overrideByBooking.get(booking.id);
              return <article className="booking-day-row" key={booking.id}>
                <div><strong>{booking.customer_name}</strong><span>{booking.vehicle_no} · {booking.make} {booking.model}</span><span>{booking.arrival_window || "Arrival window not set"} · {booking.status}</span></div>
                <div><span>{booking.mobile}</span>{override && <small>Admin override: {override.reason}</small>}</div>
              </article>;
            })}
          </div>
        </section>
      </div>
    </div>
    {creating && <Dialog title="Create advance booking" subtitle={`Booking for ${dateLabel(selectedDate)}`} onClose={() => setCreating(false)}>
      <form className="booking-form" onSubmit={submitBooking}>
        <label>Customer name<input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} /></label>
        <label>Mobile<input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} /></label>
        <label>Vehicle number<input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value.toUpperCase() })} /></label>
        <label>Make<input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value })} /></label>
        <label>Model<input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} /></label>
        <label>Color<input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} /></label>
        <label>Booking date<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(event) => setForm({ ...form, bookingDate: event.target.value })} /></label>
        <label>Arrival window<select value={form.arrivalWindow} onChange={(event) => setForm({ ...form, arrivalWindow: event.target.value as BookingArrivalWindow })}>{windows.map((window) => <option key={window} value={window}>{window || "Not set"}</option>)}</select></label>
        <label className="booking-form-wide">Requested work<textarea required value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value })} /></label>
        {capacityFor(state, form.bookingDate).count >= capacityFor(state, form.bookingDate).limit && canOverride && <label className="booking-form-wide">Admin override reason (recorded in the booking audit trail)<textarea required value={form.capacityOverrideReason} onChange={(event) => setForm({ ...form, capacityOverrideReason: event.target.value })} /></label>}
        {error && <p className="error-text booking-form-wide" role="alert">{error}</p>}
        <div className="action-row booking-form-wide"><button className="primary-action">Save Booking</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div>
      </form>
    </Dialog>}
    {editingCapacity && <Dialog title="Set daily booking limit" subtitle={dateLabel(selectedDate)} onClose={() => setEditingCapacity(false)}>
      <form onSubmit={saveCapacity}><label>Advance bookings allowed<input aria-label="Daily booking capacity" required type="number" min="0" step="1" value={capacityDraft} onChange={(event) => setCapacityDraft(event.target.value)} /></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="action-row"><button className="primary-action">Save limit</button><button type="button" onClick={() => setEditingCapacity(false)}>Cancel</button></div></form>
    </Dialog>}
  </section>;
}
