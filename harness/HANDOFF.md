# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S15<br>
Next slice: S16 — Independent QC and rework

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S15 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S12 establish the tenant-aware journey through technician task completion. S13 owns generic physical inventory, S14 owns procurement commercial documents, and S15 now owns Job/task material demand and exact reconciliation while delegating physical postings to S13.

## S15 evidence

- `production/src/job-material-control.ts` consumes immutable S09/S11/S12 scope and assignment boundaries. It accepts only approved task demand, controls excess and substitutions independently, validates private evidence and scans, serializes partial Store issues, and calls S13 with tenant-derived identity and idempotency.
- Technicians record exact consumption, wastage, or proposed return. Store independently verifies and restores a return to its original location/lot/value through `production/src/inventory-ledger.ts`; Manager approval requires distinct identity and recent authentication above snapshotted excess, waste, and variance thresholds.
- Reconciliation emits one versioned S16/S18 event only when `Issued = Consumed + Verified Return + Wastage + Approved Variance`. Separately approved evidenced non-Job reasons are the only other S15 path for stock to leave Store.
- `015_job_material_control.sql` persists exact fixed-decimal demand and outcomes, forced scoped RLS, maker-checker evidence, the conservation check, append-only postings/evidence/events/receipts, unique effects, and S13 stock delegation with row locking.
- Focused S15 tests passed 9/9; the full production suite passed 105/105 and production typecheck passed. No deployment, provider enrollment, inventory movement, supplier/customer message, payment, or other external/production action occurred.

## Verification

- `npm run test:production`: 105/105 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 16 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S16 first action

Read S16, R-064 through R-068, D-005/D-011/D-012/D-024/D-025, and the S09/S11/S12/S15 immutable snapshot and reconciliation events. Begin with one failing end-to-end test proving that technician completion and material reconciliation create a pending-QC action but cannot produce a QC pass, then require an independently authorized QC actor to submit every snapshotted checklist item with readings, notes, clean evidence, actor, time, and an explicit result.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production source.
- Derive tenant/branch/Job/task authority from verified membership and force PostgreSQL RLS. Client identifiers never establish authority.
- QC is independent of technician completion. A failed item must create blocking linked rework; re-execution and reinspection append history and never erase the failed result.
- Emergency QC override needs recent authentication, configured distinct approval, reason and clean evidence, explicit customer/release visibility, and immutable audit history.
- After S16 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S16 and do not push.
