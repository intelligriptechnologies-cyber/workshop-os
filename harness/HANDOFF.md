# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S07<br>
Next slice: S08 — Advisor inspection and ownership

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S06 established the tenant-aware vertical, access/control boundaries, versioned configuration, lifecycle command engine, customer/vehicle history, and capacity-aware appointments. S07 adds reception custody without weakening those seams.

## S07 evidence

- `production/src/reception-custody-offline.ts` consumes an S06 `RECEPTION_CHECK_IN_REQUESTED` event or accepts an explicit walk-in. One authorized, idempotent online command validates the active reception configuration before atomically committing exactly one Visit and linked `DRAFT` Job with customer, vehicle, advisor, KM, fuel, keys, accessories, request, promised handoff, evidence, and acknowledgement snapshots.
- An appointment event has exactly one consumer even under a different idempotency key. Tenant input is never authority; appointment-event lookup, reads, and commands are constrained by authenticated tenant and branch membership.
- Custody incidents are separate case records, not Job notes. Intake validates Visit/Job/vehicle linkage, severity, category, private checksummed evidence, accountable owner/actions, and commits an idempotent notification-outbox reference. Resolution and legal hold remain owned by S17.
- The local PWA draft adapter is tenant/branch/device-namespaced and survives storage restart. It visibly labels drafts uncommitted, detects base/server version conflicts, supports explicit rebase or discard, and never queues authoritative postings. Lifecycle, custody, approval, inventory, finance, QC override, closure, and gate actions all require online service authority.
- `production/db/migrations/007_reception_custody_offline.sql` adds forced branch-aware RLS to every S07 table, one atomic Visit/Job/source-consumption/audit/idempotency function, private media/checksum/scan metadata, one-event/one-Visit constraints, custody actions/outbox, and append-only evidence/acknowledgement/consumption/audit ledgers.
- S07 production tests passed 45/45; production typecheck, harness (119 requirements/29 slices/8 contiguous complete/no orphans), demo build, Playwright 7/7, and diff check passed. No upload, provider call, customer message, deployment, push, or production action occurred.

## S08 first action

Read S08 plus R-030 and R-031. Start with a failing public `/api/v1` test proving every S07 draft Job has exactly one accountable advisor and that an authorized, version-checked reassignment atomically updates audited advisor queues; then add structured/free-text inspection findings, versioned required evidence, recommended scope, due follow-ups, and promised-delivery validation.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and maintain PostgreSQL RLS.
- Keep S07 Visit/custody snapshots and append-only evidence immutable. Advisor reassignment belongs in a separate audited history, never destructive rewriting of reception custody evidence.
- Continue to use only tenant-scoped private media metadata locally; do not upload or invoke providers without explicit authority.
- Keep AWS/Cognito/provider activity local until explicitly authorized.
- After S08 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S08 and do not push.
