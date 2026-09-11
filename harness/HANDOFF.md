# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S12<br>
Next slice: S13 — Inventory location, lot, remnant, transfer, and count ledger

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S12 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S11 establish the tenant-aware journey through approved-scope work planning. S12 now owns technician execution through task completion and emits only an independent-QC-pending handoff; inventory posting remains owned by S13/S15 and QC by S16.

## S12 evidence

- `production/src/job-planning-timeline.ts` now declares the exact versioned `S12_TASK_ASSIGNMENT_READY` payload, including title, priority, effort, assignment, immutable checklist/material references, dependencies, and warnings. `production/src/technician-execution.ts` consumes every fingerprinted assignment event once and rejects stale, malformed, unknown, inactive, cross-tenant, or cross-branch technician assignment.
- `GET /api/v1/technician/tasks` derives tenant, branches, and technician from membership and returns only assigned work. Its Android-oriented My Tasks view provides plain blockers, one guided next action, 48px task/checklist/photo/material controls, scanning choices, an explicit offline notice, and committed/uncommitted language. Material requests are visibly online-only.
- Authorized technicians start, pause with reason, resume, block with reason, hand off to an eligible active branch technician, and complete through explicit transitions. Commands require `If-Match` plus tenant-scoped idempotency and preserve exact accumulated active seconds, actor, prior/new status, reason, time, version, and audit reference in append-only history.
- Snapshotted required checklist steps and clean, checksum-verified, allow-listed private photo evidence block completion. A different authorized manager can override outstanding completion blockers only with a recorded reason. Normal and override completion each emit one `S16_TASK_COMPLETION_READY` event whose QC state is `PENDING_INDEPENDENT_QC`; task completion never implies QC pass.
- Camera and hardware scans validate authenticated tenant, branch, expected object type/id, live state, and permission. Manual fallback uses the identical validation and additionally requires an audited reason. Audit retains only a digest of the submitted code.
- The tenant/branch/technician-scoped local draft store survives restart, holds stable retry idempotency, recovers interrupted sync, exposes uncommitted/retry/conflict/committed states, and requires explicit keep-mine/use-server/discard conflict recovery. Offline stock, approval, finance, QC override, closure, and gate postings are categorically rejected rather than queued.
- `012_technician_execution.sql` forces tenant/branch RLS on nine tables, uses scoped keys and FKs, and makes assignment receipts, task history, checklist/evidence, completion overrides, scan audit, outbox, and command receipts append-only. It constrains clean private evidence, reasoned manual scans, independent override, unique event/command/effect consumption, and pending-independent-QC output.
- Focused S12 tests passed 8/8; the full production suite passed 82/82 and production typecheck passed. Harness, demo build, and Playwright results are recorded below. No deployment, provider enrollment, customer message, stock posting, or other external/production action occurred.

## Verification

- `npm run test:production`: 82/82 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 13 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.

## S13 first action

Read S13, R-050 through R-056, D-005/D-009/D-010/D-012/D-017/D-018/D-021/D-024, and the S03 exact UOM contract. Begin with a failing ledger test proving one authorized receipt posts balanced exact quantity/value entries to one tenant/branch/warehouse/bin/lot and safely replays without duplication. Then add expiry/FEFO, rolls/cuts/remnants/scrap, double-entry transfers, frozen blind counts/recounts, and approved compensating variance.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production inventory source.
- Derive tenant, branch, warehouse, and location authority from verified membership and force PostgreSQL RLS. Client-supplied tenant/location identifiers never establish authority.
- Use fixed-decimal quantities and explicit published UOM conversions from S03. Every posted movement must conserve quantity/value and retain source, location, lot/remnant, actor, reason, version, and audit reference.
- Never destructively edit a posted stock entry. Corrections and approved count variance use balanced compensating entries; concurrent overspend has one winner.
- S13 supplies the generic inventory ledger. Job-specific request/issue/consume/return/waste/reconciliation and the technician-to-Store/Manager separation remain S15.
- After S13 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S13 and do not push.
