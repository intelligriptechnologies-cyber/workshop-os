---
title: Calendar and daily capacity interaction
parent: ../advance-bookings-map.md
labels: [wayfinder:prototype]
status: closed
assignee: unassigned
blocked_by: [001-booking-record-and-lifecycle]
---

## Question

How should the shared month calendar, selected-day detail panel, date-level
capacity count, full-day state, and Admin-only override reason work so that
Reception can schedule confidently without advisor or bay allocation?

## Resolution

The calendar is a shared month view with a selected-day detail panel. Each date
shows operational advance-booking count against its SQLite-persisted capacity,
defaulting to eight when no explicit date limit has been set. Reception is
blocked once the date is full. Admin can set the selected date's limit or add a
full-date booking only after supplying a reason; every such exception is stored
as a separate, immutable audit record. Capacity applies to Booked, Confirmed,
and Rescheduled bookings only, and is enforced for create, edit, and
reschedule operations.
