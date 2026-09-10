# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S05<br>
Next slice: S06 — Appointment and capacity management

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S04 established the tenant-aware vertical, identity/access controls, versioned configuration, and lifecycle command engine. S05 adds customer and vehicle identity plus history without weakening those boundaries.

## S05 evidence

- `production/src/customer-vehicle-history.ts` owns tenant/branch-scoped customer contacts, communication consent/preference and payer relations; vehicle registration/VIN/attributes, odometer and service history; and configurable exact/probable duplicate signals across create/update/search.
- Effective-dated ownership changes reject overlap and snapshot the historical owner and payer onto service/job history, so later transfers and merges never rewrite prior work.
- Controlled customer/vehicle merges require explicit permission, optimistic source versions, idempotency, reason, and evidence; preserve aliases/history; reject contradictory canonical vehicle identities; and recover only through a separately permissioned, recently authenticated, audited compensating command.
- `production/db/migrations/005_customer_vehicle_history.sql` provides tenant keys, exact identity indexes, forced branch-aware RLS, immutable historical owner/payer snapshots, tenant idempotency, and append-only ownership/odometer/service/alias/merge-member/compensation/audit records.
- Production tests passed 31/31; production typecheck, harness (119 requirements/29 slices/6 contiguous complete/no orphans), demo build, Playwright 7/7, and diff check passed. No external call, deployment, push, or production action occurred.

## S06 first action

Read S06 and R-026 through R-027. Start with a failing public `/api/v1` test for idempotent appointment creation and reasoned reschedule/cancel/no-show/arrive/convert history, then add branch closures, bay/staff/skill duration and buffer capacity, concurrency, and permissioned overbooking.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and maintain PostgreSQL RLS.
- Reuse S01 authorization/idempotency and S04 optimistic command patterns; do not create a bypassing CRUD surface.
- Appointment conversion must feed reception's eventual atomic Visit/draft Job flow without implementing S07 early.
- Keep AWS/Cognito/provider activity local until explicitly authorized.
- After S06 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S06 and do not push.
