# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S08<br>
Next slice: S09 — Versioned estimates and customer approval

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S07 established the tenant-aware production vertical through reception custody. S08 consumes the S07 draft Job boundary and adds accountable advisor ownership and inspection without implementing S09 estimates.

## S08 evidence

- `production/src/advisor-inspection.ts` requires exactly one eligible accountable advisor for every inbound S07 Job and exposes owner-filtered advisor/action queues. Authorized reassignment is reasoned, resource-version checked, idempotent, audited, and atomically moves current Job/action ownership while retaining old/new history.
- Inspection submission validates the exact tenant/branch configuration version, typed/required structured fields, required free text, checksum-valid `CLEAN` private evidence, and scope recommendations linked to findings. Customer and internal notes have separate write controls; internal notes and evidence metadata are filtered unless explicitly readable.
- Each inspection appends one `ADVISOR_SCOPE_RECOMMENDED` event as the S09 handoff port. S08 contains no estimate pricing, versioning, sending, public tokens, or approval behavior.
- Owned follow-ups surface overdue/today/upcoming/completed states and require a versioned outcome to complete. Reasoned promised-delivery changes compare projected readiness and expose on-track/at-risk/overdue signals while retaining history.
- `production/db/migrations/008_advisor_inspection.sql` backfills existing S07 Jobs, initializes all future Jobs by trigger, forces tenant/branch RLS on 13 tables, version-guards atomic reassignment, and protects ownership, inspection/evidence/scope/outbox/follow-up/promised-delivery/audit ledgers from update/delete.
- S08 acceptance passed 7/7; the production regression passed 52/52. Production typecheck, harness (119 requirements/29 slices/9 contiguous complete/no orphans), demo build, Playwright 7/7, and diff check passed. No upload, provider call, customer message, deployment, push, or production action occurred.

## S09 first action

Read S09 plus R-032 through R-038 and decisions D-005, D-008, D-019, D-021, and D-024. Start with a failing public `/api/v1` test that consumes one S08 `ADVISOR_SCOPE_RECOMMENDED` event into an immutable numbered estimate draft/version, validates configured service/package/material/labour lines and payer totals in exact minor units, and prevents one handoff from producing duplicate estimate effects under retry.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and retain PostgreSQL RLS.
- Do not mutate S08 inspection, scope recommendation, evidence, ownership, follow-up, promise, or audit history. S09 may reference the handoff but must not rewrite it.
- Approved/sent estimate versions must become immutable; supplementary scope stays separate and only approved scope can activate work with configuration snapshots.
- Public customer actions need opaque expiring single-purpose replay-protected tokens; keep providers/local substitutes inert until explicitly authorized.
- After S09 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S09 and do not push.
