import assert from "node:assert/strict";
import test from "node:test";
import { expectedBookingsForDate } from "../src/booking-followup";
import type { Booking, BookingCallLog } from "../src/types";

const booking = (id: number, status: Booking["status"], booking_date = "2099-12-20"): Booking => ({ id, customer_name: `Customer ${id}`, mobile: "9000000000", customer_type: "Individual", vehicle_no: `OD01A${id}`, make: "Kia", model: "Seltos", color: "", requested_work: "Service", booking_date, arrival_window: id === 2 ? "Morning" : "Afternoon", status, created_by: 2, created_at: "2099-12-01T09:00:00.000Z", updated_at: "2099-12-01T09:00:00.000Z" });

test("Expected Today includes only operational arrival states for the selected date and exposes follow-up filters", () => {
  const bookings = [booking(1, "Booked"), booking(2, "Confirmed"), booking(3, "Rescheduled"), booking(4, "Cancelled"), booking(5, "No-show"), booking(6, "Booked", "2099-12-21")];
  const calls: BookingCallLog[] = [{ id: 1, booking_id: 1, note: "Will arrive at noon", called_by: 2, called_at: "2099-12-20T08:30:00.000Z" }];
  assert.deepEqual(expectedBookingsForDate(bookings, calls, "2099-12-20").map((row) => row.booking.id), [2, 1, 3]);
  assert.deepEqual(expectedBookingsForDate(bookings, calls, "2099-12-20", "NEEDS_FOLLOW_UP").map((row) => row.booking.id), [2, 3]);
  assert.deepEqual(expectedBookingsForDate(bookings, calls, "2099-12-20", "CALLED").map((row) => row.booking.id), [1]);
});
