import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceBookingRange,
  datesForCalendarMonth,
  isAdvanceBookingDate,
  shiftCalendarMonth,
} from "../src/advance-booking-range";

test("advance bookings run from tomorrow through the next three calendar months", () => {
  const range = advanceBookingRange(new Date(2026, 8, 22, 12));
  assert.deepEqual(range, { min: "2026-09-23", max: "2026-12-31", firstMonth: "2026-09", lastMonth: "2026-12" });
  assert.equal(isAdvanceBookingDate("2026-09-22", range), false);
  assert.equal(isAdvanceBookingDate("2026-09-23", range), true);
  assert.equal(isAdvanceBookingDate("2026-12-31", range), true);
  assert.equal(isAdvanceBookingDate("2027-01-01", range), false);
});

test("advance bookings span a year boundary and begin tomorrow", () => {
  const range = advanceBookingRange(new Date(2026, 11, 31, 12));
  assert.deepEqual(range, { min: "2027-01-01", max: "2027-03-31", firstMonth: "2026-12", lastMonth: "2027-03" });
  assert.equal(isAdvanceBookingDate("2026-12-31", range), false);
  assert.equal(isAdvanceBookingDate("2027-01-01", range), true);
  assert.equal(isAdvanceBookingDate("2027-03-31", range), true);
});

test("calendar month navigation is date-only and spans year boundaries", () => {
  assert.equal(shiftCalendarMonth("2026-12", 1), "2027-01");
  assert.equal(shiftCalendarMonth("2027-01", -1), "2026-12");
  const dates = datesForCalendarMonth("2026-10");
  assert.equal(dates.length, 42);
  assert.equal(dates[0], "2026-09-27");
  assert.equal(dates.at(-1), "2026-11-07");
});
