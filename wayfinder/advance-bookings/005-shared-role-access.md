---
title: Shared Admin and Reception access model
parent: ../advance-bookings-map.md
labels: [wayfinder:grilling]
status: closed
assignee: implementation delegate
blocked_by: [002-calendar-and-daily-capacity, 003-reception-expected-today, 004-check-in-conversion]
---

## Question

Where should Booking and Calendar appear in existing navigation, which actions
are shared by Admin and Reception, and how should the demo make the Admin-only
daily-capacity override visible and auditable?

## Resolution

Advance Bookings is a shared Front Desk navigation destination for both
Reception and Admin. It combines the month calendar with the operational-date
Expected Today panel, so both roles can create and manage Bookings, record
follow-up, reschedule, cancel, mark no-shows, and check customers in. The
normal Reception queue and Admin Manage screen no longer show booking tools
implicitly. Admin alone sees the clearly labelled daily-limit control and may
add a full-date Booking only with a required reason stored as the immutable
capacity-override audit record.
