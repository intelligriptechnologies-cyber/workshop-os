# S06 — Appointment and capacity management

Status: Complete
Implements: R-026, R-027

## Outcome
Schedule resources and convert appointments safely into reception work.

## Acceptance criteria
- [x] Create/reschedule/cancel/no-show/arrive/convert transitions preserve reasoned history and safe retry behavior.
- [x] Availability honors branch closures, bay/staff/skill capacity, duration/buffers, and authorized overbooking under concurrency.

## Implementation evidence

- `production/src/appointment-capacity.ts` exposes the tenant/branch-authorized `/api/v1` appointment seam. Create and every follow-on command require tenant-scoped idempotency; mutable commands require the current resource version; safe retries return the originally committed version and audit reference without duplicating history or handoff events.
- Appointment creation, rescheduling, cancellation, no-show, arrival, and conversion preserve actor-attributed, reasoned append-only history. Invalid/stale commands are atomic no-ops, terminal states release appointment capacity, and conversion emits one durable `RECEPTION_CHECK_IN_REQUESTED` port event for S07 rather than creating reception records early.
- Availability evaluates the reserved interval including before/after buffers against effective branch closures and active overlapping appointments, then deterministically assigns an active bay and staff member that each satisfy their respective required skills. The capacity configuration version is snapshotted on every accepted schedule.
- Concurrent ordinary requests yield one winner for the last matching bay/staff pair. An overlap can be accepted only with the separate `appointment.overbook` permission plus a non-empty reason and evidence; branch closures and absence of qualified resources remain non-overridable.
- `production/db/migrations/006_appointment_capacity.sql` adds tenant-keyed capacity resources, closures, appointments, immutable per-version reservations/history/reception events/audit/idempotency, mandatory forced branch-aware RLS, appointment/schedule/version constraints, and an advisory-lock reservation guard that serializes overlap checks while retaining explicit overbooking authorization evidence.

## Verification

- TDD RED evidence was observed for the missing appointment module, then separately for lifecycle commands, availability/overbooking, the PostgreSQL contract, and the reception-event read port before each behavior was implemented.
- `npm run test:production`: 37/37 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed with 119 requirements, 29 slices, 7 contiguous complete, and no orphans.
- `npm run build`: passed.
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.
- No AWS/provider call, deployment, customer contact, GitHub push, or other external production action occurred.
