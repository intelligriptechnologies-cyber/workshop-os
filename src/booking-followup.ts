import type { Booking, BookingCallLog, BookingStatus } from "./types";

export type ExpectedTodayFilter = "ALL" | "NEEDS_FOLLOW_UP" | "CALLED";

export interface ExpectedBookingRow {
  booking: Booking;
  calls: BookingCallLog[];
  lastCall?: BookingCallLog;
}

/** Bookings that are still waiting to arrive on an operational date. */
export function expectedBookingsForDate(
  bookings: readonly Booking[],
  callLogs: readonly BookingCallLog[],
  bookingDate: string,
  filter: ExpectedTodayFilter = "ALL",
): ExpectedBookingRow[] {
  const callsByBooking = new Map<number, BookingCallLog[]>();
  for (const call of callLogs) {
    const calls = callsByBooking.get(call.booking_id) ?? [];
    calls.push(call);
    callsByBooking.set(call.booking_id, calls);
  }

  const expectedStatuses: BookingStatus[] = [
    "Booked",
    "Confirmed",
    "Rescheduled",
  ];
  return bookings
    .filter(
      (booking) =>
        booking.booking_date === bookingDate &&
        expectedStatuses.includes(booking.status),
    )
    .map((booking) => {
      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>
        right.called_at.localeCompare(left.called_at),
      );
      return { booking, calls, lastCall: calls[0] };
    })
    .filter((row) =>
      filter === "ALL"
        ? true
        : filter === "CALLED"
          ? row.calls.length > 0
          : row.calls.length === 0,
    )
    .sort((left, right) => {
      const windowOrder = ["Morning", "Afternoon", "Evening", ""];
      const windowDifference =
        windowOrder.indexOf(left.booking.arrival_window) -
        windowOrder.indexOf(right.booking.arrival_window);
      return windowDifference || left.booking.customer_name.localeCompare(right.booking.customer_name);
    });
}
