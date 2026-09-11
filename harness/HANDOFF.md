# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S10<br>
Next slice: S11 — Job planning and shared timeline

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S09 establish the tenant-aware operational journey through approved scope. S10 consumes domain events once into shared role/owner actions and durable consent-aware notifications without invoking external providers.

## S10 evidence

- `production/src/action-notifications.ts` implements `/api/v1/actions` with authenticated tenant/branch/role/owner filtering, explicit team permission, priority ordering, due filters/state, plain blockers, and guided next actions.
- Fingerprinted domain events plan action/in-app/provider effects atomically and exactly once. Exact template versions and variables must resolve before any effect is recorded.
- The worker checks latest consent/opt-out, records in-app effects once, uses inert push/WhatsApp/SMS adapters, retains provider status/failure, retries with backoff, dead-letters terminal failures, creates one independently templated SMS fallback, and requires reasoned replay.
- `010_action_inbox_notifications.sql` provides forced tenant/branch RLS, append-only evidence, unique event/channel effects, encrypted payload/destination seams, scheduled retries, and `FOR UPDATE SKIP LOCKED` claiming.
- Production tests passed 68/68; production typecheck, harness (119 requirements/29 slices/11 contiguous complete/no orphans), demo build, and Playwright 7/7 passed. No customer message, provider call, deployment, enrollment, push, SMS, WhatsApp, or production action occurred.

## S11 first action

Read S11, R-041/R-042/R-045, D-007/D-017/D-018/D-024, and the approved-scope work-planning handoff in S09. Start with a failing test that converts one approved, snapshotted scope into dependency-, skill-, bay-, effort-, checklist-, and material-aware tasks without resolving mutable configuration. Then add concurrency-safe multi-technician responsibility and a permission-filtered shared timeline.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Derive tenant/branch/role authority from verified membership; never trust client context.
- Consume only the S09 `APPROVED_SCOPE_WORK_PLANNING` handoff once; do not plan rejected or unapproved estimate lines.
- Preserve snapshotted workflow/recipe/checklist/material references and record every responsibility/reassignment/timeline event with tenant and branch scope.
- Use optimistic concurrency/idempotency for assignments and make capacity warnings visible without silently overriding policy.
- After S11 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S11 and do not push.
