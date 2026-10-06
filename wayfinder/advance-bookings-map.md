---
title: Advance bookings for the WorkshopOS demo
labels: [wayfinder:map]
status: closed
---

## Destination

An approved, implementation-ready frontend and SQLite specification for future
customer Bookings: a shared Admin/Reception calendar, day-level booking limits,
and an arrival/follow-up workflow that creates a Visit and Job Card only when
the vehicle checks in.

## Notes

- Frontend demo only; persist locally in the existing SQLite database. No API,
  backend service, notification integration, or multi-branch support.
- One Admin and one branch. Reception and Admin can create, edit, reschedule,
  cancel, log calls, mark no-shows, and check customers in; Admin may override
  a full day's booking limit with a required reason.
- A Booking uses a date plus an optional `Morning`, `Afternoon`, or `Evening`
  arrival window. It has no advisor assignment.
- Capture customer, vehicle, mobile number, requested work, date, and optional
  window at booking. Capture ODO, fuel, keys, accessories, and damage marks at
  check-in.
- Booking lifecycle: `Booked` -> `Confirmed` -> `Arrived`, `Rescheduled`,
  `Cancelled`, or `No-show`. No-show is a manual end-of-day action.

## Decisions so far

<!-- Closed child tickets will be indexed here as they resolve. -->

- [Booking record and lifecycle](advance-bookings/001-booking-record-and-lifecycle.md): A future Booking is an independently persisted, audited record; it never creates a Visit or Job Card before arrival.
- [Calendar and daily capacity interaction](advance-bookings/002-calendar-and-daily-capacity.md): A shared month calendar applies SQLite-backed date capacity, blocks Reception when full, and records reasoned Admin exceptions.
- [Reception expected-today and follow-up workflow](advance-bookings/003-reception-expected-today.md): The operational-date list supports auditable calls, rescheduling, cancellation, manual no-shows, and arrival handling.
- [Check-in conversion from Booking to Visit and Job Card](advance-bookings/004-check-in-conversion.md): Booking arrival atomically creates the normal unassigned Visit and Job Card, then links and audits the Arrived Booking.
- [Shared Admin and Reception access model](advance-bookings/005-shared-role-access.md): Both roles operate Bookings from one Front Desk destination; Admin-only daily-limit and capacity-override controls remain visibly audited.

## Not yet specified

None. All five decision tickets are resolved and the delivered frontend/SQLite
demo satisfies this map's destination.

## Out of scope

- Multi-branch booking, advisor/bay scheduling, recurring bookings, automated
  SMS/WhatsApp/email reminders, live backend synchronisation, and capacity
  enforcement by time window.

## Tickets

- [Booking record and lifecycle](advance-bookings/001-booking-record-and-lifecycle.md)
- [Calendar and daily capacity interaction](advance-bookings/002-calendar-and-daily-capacity.md)
- [Reception expected-today and follow-up workflow](advance-bookings/003-reception-expected-today.md)
- [Check-in conversion from Booking to Visit and Job Card](advance-bookings/004-check-in-conversion.md)
- [Shared Admin and Reception access model](advance-bookings/005-shared-role-access.md)
