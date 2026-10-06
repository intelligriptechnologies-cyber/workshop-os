---
title: Booking record and lifecycle
parent: ../advance-bookings-map.md
labels: [wayfinder:grilling]
status: closed
assignee: implementation delegate
---

## Question

What is the minimal SQLite Booking record, including statuses, timestamps,
reschedule/cancellation/no-show reasons, and call-log history, that supports
the agreed demo without turning a future Booking into a Visit or Job Card?

## Resolution

Implemented an independently persisted Booking snapshot with optional links to
existing customer/vehicle masters, but no Visit or Job Card creation. The
lifecycle records `Booked`, `Confirmed`, `Rescheduled`, `Cancelled`, and
`No-show` events with actor/timestamp/reason audit data; call logs are separate
timestamped records. `Arrived` remains reserved for the later transactional
check-in conversion slice.
