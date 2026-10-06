---
title: Check-in conversion from Booking to Visit and Job Card
parent: ../advance-bookings-map.md
labels: [wayfinder:grilling]
status: closed
assignee: implementation delegate
blocked_by: [001-booking-record-and-lifecycle, 003-reception-expected-today]
---

## Question

How does the existing reception intake form prefill and complete an arrived
Booking, atomically create the Visit and Job Card, retain the Booking audit
history, and avoid assigning an advisor until after check-in?

## Resolution

Implemented a transactional Booking check-in boundary. Reception now opens a
prefilled arrival dialog from Expected Today, captures required ODO and fuel
plus keys, accessories, requested work, and optional body marks, then creates
the normal Visit and Job Card as one SQLite operation. The Booking becomes
`Arrived`, stores its Visit and Job Card links, and records an `Arrived` audit
event. The check-in payload and UI deliberately contain no advisor field, so
advisor assignment remains a post-check-in workflow. Failed validation leaves
the Booking and workshop intake unchanged.
