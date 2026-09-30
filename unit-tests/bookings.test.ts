import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import { bookingCapacityForDate, cancelBooking, checkInBooking, confirmBooking, createBooking, createSchema, markBookingNoShow, migrateSchema, readState, recordBookingCall, rescheduleBooking, setBookingCapacityForDate, updateBooking } from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'reception@test','Reception','reception','x')");
  return db;
}

const input = {
  customerName: "Asha Das", mobile: "9000000001", customerType: "Individual", vehicleNo: "od01a1001", make: "Kia", model: "Seltos", color: "Red", requestedWork: "Annual service", bookingDate: "2099-12-20", arrivalWindow: "Morning" as const,
};
const at = "2099-12-01T09:30:00.000Z";
const row = (db: Database, sql: string) => db.exec(sql)[0]?.values[0];

test("creating a Booking persists an independent future-arrival snapshot without creating a Visit or Job Card", async () => {
  const db = await database();
  const bookingId = createBooking(db, 2, input, at);

  assert.deepEqual(row(db, `select customer_name,mobile,vehicle_no,booking_date,arrival_window,status,created_by from bookings where id=${bookingId}`), ["Asha Das", "9000000001", "OD01A1001", "2099-12-20", "Morning", "Booked", 2]);
  assert.equal(row(db, "select count(*) from visits")[0], 0);
  assert.equal(row(db, "select count(*) from job_cards")[0], 0);
  assert.deepEqual(row(db, "select kind,actor_id,booking_date from booking_events"), ["Booked", 2, "2099-12-20"]);

  const state = readState(db);
  assert.equal(state.bookings.length, 1);
  assert.equal(state.booking_call_logs.length, 0);
  assert.equal(state.booking_events[0].kind, "Booked");
});

test("an operational Booking can be edited, confirmed and rescheduled with an auditable reason", async () => {
  const db = await database();
  const bookingId = createBooking(db, 2, input, at);
  updateBooking(db, bookingId, 2, { ...input, requestedWork: "Annual service and brake inspection", bookingDate: "2099-12-20", arrivalWindow: "Afternoon" }, "2099-12-02T09:30:00.000Z");
  confirmBooking(db, bookingId, 2, "2099-12-02T10:00:00.000Z");
  rescheduleBooking(db, bookingId, 2, "2099-12-22", "Customer travelling", "Evening", "2099-12-03T10:00:00.000Z");

  assert.deepEqual(row(db, `select requested_work,booking_date,arrival_window,status,reschedule_reason,confirmed_at,rescheduled_at from bookings where id=${bookingId}`), ["Annual service and brake inspection", "2099-12-22", "Evening", "Rescheduled", "Customer travelling", "2099-12-02T10:00:00.000Z", "2099-12-03T10:00:00.000Z"]);
  assert.deepEqual(row(db, `select kind,note,previous_booking_date,booking_date from booking_events where booking_id=${bookingId} order by id desc limit 1`), ["Rescheduled", "Customer travelling", "2099-12-20", "2099-12-22"]);
});

test("follow-up calls have their own timestamped history and terminal bookings cannot be changed", async () => {
  const db = await database();
  const bookingId = createBooking(db, 2, input, at);
  recordBookingCall(db, bookingId, 2, "Customer asked for a reminder at 4 PM", "2099-12-19T09:00:00.000Z");
  markBookingNoShow(db, bookingId, 2, "Unable to reach customer after follow-up", "2099-12-20T18:00:00.000Z");

  assert.deepEqual(row(db, `select note,called_by,called_at from booking_call_logs where booking_id=${bookingId}`), ["Customer asked for a reminder at 4 PM", 2, "2099-12-19T09:00:00.000Z"]);
  assert.deepEqual(row(db, `select status,no_show_reason,no_show_at from bookings where id=${bookingId}`), ["No-show", "Unable to reach customer after follow-up", "2099-12-20T18:00:00.000Z"]);
  assert.throws(() => recordBookingCall(db, bookingId, 2, "Late call"), /No-show booking cannot be changed/);
  assert.throws(() => updateBooking(db, bookingId, 2, input), /No-show booking cannot be changed/);
});

test("cancellation and lifecycle validation require meaningful reasons and legal transitions", async () => {
  const db = await database();
  assert.throws(() => createBooking(db, 2, { ...input, bookingDate: "2099-02-30" }, at), /valid booking date/);
  assert.throws(() => createBooking(db, 2, { ...input, bookingDate: "2099-11-30" }, at), /cannot be in the past/);
  const bookingId = createBooking(db, 2, input, at);
  assert.throws(() => cancelBooking(db, bookingId, 2, ""), /cancellation reason is required/);
  assert.throws(() => rescheduleBooking(db, bookingId, 2, input.bookingDate, "No change", input.arrivalWindow), /different date or arrival window/);
  cancelBooking(db, bookingId, 2, "Customer cancelled the trip", "2099-12-10T09:00:00.000Z");
  assert.deepEqual(row(db, `select status,cancellation_reason,cancelled_at from bookings where id=${bookingId}`), ["Cancelled", "Customer cancelled the trip", "2099-12-10T09:00:00.000Z"]);
  assert.throws(() => confirmBooking(db, bookingId, 2), /Cancelled booking cannot be changed/);
});

test("a daily capacity blocks Reception and records an Admin's reasoned over-capacity exception", async () => {
  const db = await database();
  setBookingCapacityForDate(db, 1, input.bookingDate, 1, at);
  assert.deepEqual(bookingCapacityForDate(db, input.bookingDate), {
    bookingDate: input.bookingDate, capacity: 1, count: 0, remaining: 1, configured: true,
  });
  createBooking(db, 2, input, at);
  assert.throws(() => createBooking(db, 2, { ...input, mobile: "9000000002", vehicleNo: "OD01A1002" }, "2099-12-01T10:00:00.000Z"), /fully booked/);
  assert.throws(() => createBooking(db, 1, { ...input, mobile: "9000000003", vehicleNo: "OD01A1003" }, "2099-12-01T10:00:00.000Z"), /override reason/);
  const overrideId = createBooking(db, 1, { ...input, mobile: "9000000004", vehicleNo: "OD01A1004", capacityOverrideReason: "Returning customer needs this date" }, "2099-12-01T10:00:00.000Z");
  assert.deepEqual(row(db, `select booking_id,booking_date,reason,approved_by from booking_capacity_overrides where booking_id=${overrideId}`), [overrideId, input.bookingDate, "Returning customer needs this date", 1]);
  assert.deepEqual(bookingCapacityForDate(db, input.bookingDate), {
    bookingDate: input.bookingDate, capacity: 1, count: 2, remaining: 0, configured: true,
  });
  assert.throws(() => setBookingCapacityForDate(db, 2, input.bookingDate, 9), /Only Admin/);
  const state = readState(db);
  assert.equal(state.booking_capacity_limits.length, 1);
  assert.equal(state.booking_capacity_overrides.length, 1);
});

test("checking in a Booking atomically creates an unassigned Visit and Job Card with an auditable link", async () => {
  const db = await database();
  const bookingId = createBooking(db, 2, input, at);
  const result = checkInBooking(db, bookingId, 2, {
    odoReading: 12345,
    fuelLevelValue: "3",
    fuelLevelUnit: "bars",
    keys: "One smart key",
    accessories: "Floor mats",
    requestedWork: "Annual service and brake inspection",
  }, "2099-12-20T09:30:00.000Z");

  assert.deepEqual(row(db, `select status,arrived_at,visit_id,job_card_id from bookings where id=${bookingId}`), ["Arrived", "2099-12-20T09:30:00.000Z", result.visitId, result.jobId]);
  assert.deepEqual(row(db, `select advisor_id,received_by,odo_reading,fuel,requested_work from visits where id=${result.visitId}`), [0, 2, 12345, "3 bars", "Annual service and brake inspection"]);
  assert.deepEqual(row(db, `select visit_id,advisor_id,work_list from job_cards where id=${result.jobId}`), [result.visitId, 0, "Annual service and brake inspection"]);
  assert.deepEqual(row(db, `select kind,note,actor_id from booking_events where booking_id=${bookingId} order by id desc limit 1`), ["Arrived", "Checked in at reception", 2]);
  assert.throws(() => checkInBooking(db, bookingId, 2, { odoReading: 1, fuelLevelValue: "2", fuelLevelUnit: "bars", keys: "", accessories: "", requestedWork: "Service" }), /Arrived booking cannot be changed/);
});

test("a failed Booking check-in leaves the Booking and workshop intake untouched", async () => {
  const db = await database();
  const bookingId = createBooking(db, 2, input, at);
  assert.throws(() => checkInBooking(db, bookingId, 2, {
    odoReading: -1, fuelLevelValue: "3", fuelLevelUnit: "bars", keys: "", accessories: "", requestedWork: "Service",
  }), /ODO meter reading/);
  assert.deepEqual(row(db, `select status,visit_id,job_card_id from bookings where id=${bookingId}`), ["Booked", null, null]);
  assert.equal(row(db, "select count(*) from visits")[0], 0);
  assert.equal(row(db, "select count(*) from job_cards")[0], 0);
});
