# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S06<br>
Next slice: S07 — Reception check-in, custody evidence, incidents, and offline drafts

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S05 established the tenant-aware vertical, access/control boundaries, versioned configuration, lifecycle command engine, and customer/vehicle history. S06 adds appointment and capacity planning without weakening those seams.

## S06 evidence

- `production/src/appointment-capacity.ts` owns tenant/branch-scoped create, reschedule, cancel, no-show, arrive, and convert commands with optimistic concurrency, tenant idempotency, safe replay, and actor-attributed reasoned history/audit.
- Availability accounts for branch closures, duration, before/after buffers, active overlapping reservations, and qualified bay/staff skill sets. Accepted schedules snapshot the capacity configuration version and deterministically reserve one matching bay/staff pair.
- Ordinary contention yields one winner. Overbooking requires the separate `appointment.overbook` permission, reason, and evidence; closures or missing qualified resources cannot be overridden. Reschedules use the same capacity and authorization rules.
- Conversion commits exactly one durable `RECEPTION_CHECK_IN_REQUESTED` event containing appointment/customer/vehicle/resource references. S07 consumes that event to atomically create the Visit and linked draft Job Card; S06 deliberately does not create either record.
- `production/db/migrations/006_appointment_capacity.sql` supplies tenant keys, forced branch-aware RLS, exact schedule constraints, immutable per-version reservation/history/reception-event/audit records, tenant idempotency, and advisory-lock serialized overlap enforcement with explicit overbooking evidence.
- Production tests passed 37/37; production typecheck, harness (119 requirements/29 slices/7 contiguous complete/no orphans), demo build, Playwright 7/7, and diff check passed. No external call, deployment, push, or production action occurred.

## S07 first action

Read S07 and R-028 through R-029 plus the R-071 custody-incident intake boundary. Start with a failing public `/api/v1` test proving an appointment reception event atomically creates one Visit and linked draft Job Card under safe replay; then add configurable KM/fuel/key/accessory/condition evidence, acknowledgement/advisor handoff, custody-incident intake, and conflict-aware offline drafts while keeping authoritative actions unavailable offline.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and maintain PostgreSQL RLS.
- Consume S06's durable reception event idempotently; do not reopen or mutate the converted appointment history.
- Reception check-in must be one transaction for the Visit and linked draft Job Card and must retain customer/vehicle/advisor/custody/request/promised-handoff snapshots.
- Offline storage is draft-only: it must expose conflicts and must never post lifecycle, custody-incident resolution, inventory, approval, financial, QC override, closure, or gate ledger actions.
- Keep AWS/Cognito/provider activity local until explicitly authorized.
- After S07 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S07 and do not push.
