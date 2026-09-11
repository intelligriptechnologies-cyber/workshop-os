# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S16<br>
Next slice: S17 — Warranty, comeback, and incident resolution

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S16 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S12 establish the tenant-aware journey through technician task completion. S13 owns physical inventory, S14 procurement, S15 exact Job material reconciliation, and S16 now owns independent quality acceptance, rework, reinspection, and emergency QC override.

## S16 evidence

- `production/src/qc-rework.ts` creates pending QC only after immutable S12 completion and S15 exact material reconciliation. A task technician cannot self-pass; an authorized independent QC actor must submit the complete snapshotted checklist with status, readings, notes, clean tenant-private evidence, actor, time, and explicit result.
- A failed item creates blocking evidence-linked rework. Authorized assignment, evidenced technician completion, and independent reinspection preserve every prior inspection and append transition history. Optimistic concurrency and idempotency allow one release effect under retries and races.
- Emergency override requires an evidenced request, customer communication note, snapshotted policy, distinct configured checker, recent authentication, reason, and an immutable customer/release-visible override event; it never erases the failed inspection.
- `016_qc_rework.sql` persists dual readiness signals, item evidence, rework history, maker-checker approvals, unique outbox effects and command receipts with row locking, append-only controls, and forced tenant/branch RLS.
- Six focused S16 tests passed; the full production suite passed 111/111 and production typecheck passed. No deployment, provider enrollment, customer/staff message, vehicle release, payment, or other external/production action occurred.

## Verification

- `npm run test:production`: 111/111 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 17 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S17 first action

Read S17, R-069 through R-072, D-014/D-015/D-024/D-029, and the S07 custody-incident plus S09/S16/S21 closure boundaries. Start with one failing end-to-end test proving claim intake shows immutable warranty terms snapshotted on the delivered original Job, then creates a classified linked new Visit/Job without reopening or changing the original financial record.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production source.
- Derive tenant/branch authority from verified membership and force PostgreSQL RLS. Client identifiers never establish authority.
- Warranty/comeback work always creates linked new operational records; original delivered Job and finalized finance remain immutable.
- Custody incident resolution needs authorized evidence and acknowledgement. A legal hold prevents media/record expiry and purge until a separately authorized release is appended.
- After S17 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S17 and do not push.
