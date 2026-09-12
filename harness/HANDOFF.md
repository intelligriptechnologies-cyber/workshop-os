# WorkshopOS implementation handoff

Updated: 2026-09-12
Current branch: `prem-dev`
Completed slice: S28
Next action: obtain and record the authorized external evidence required for production certification and pilot acceptance.

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain unchanged, traceability is CLEAN, and S00–S28 are complete locally.
- Local implementation is 29/29 slices complete. This means the application, persistence, infrastructure, assurance, migration-rehearsal, and rollout-control contracts are present and verified; it does not mean the real production launch or pilot has been accepted.
- The React/sql.js demo remains a behavioral reference and is never a production migration source. S24's representative import fixture and every S28 `fixture://`/simulated evidence reference are inert test data only.

## S28 evidence

- `production/src/pilot-cutover.ts` publishes an immutable maker-checker rollout playbook with mandatory stages and minimum 14-day parallel/28-day hypercare windows. Exact tolerances, valid distinct dates, optimistic versions, idempotency fingerprints, and append-only prerequisite evidence fail closed.
- Go/no-go requires exact operational, stock, invoice, payment, and custody reconciliation; all prior release evidence; and passed, data-reconciled cutover and rollback rehearsals with distinct authorities, communications, and artifacts.
- Hypercare exit requires 28 distinct measured days within availability and p95 thresholds with no excess open critical incidents. The second-tenant comparator requires the identical ordered playbook version/checksum and application release checksum without a code fork.
- `production/db/migrations/028_pilot_cutover.sql` persists composite tenant/branch playbook links, daily reconciliation, prerequisites, rehearsals, cutover authority, hypercare, onboarding stages, commands, forced RLS, and append-only evidence.
- Every local result explicitly states that it cannot prove a real pilot, cutover, hypercare window, or second-tenant acceptance.

## Final local verification

- `npm run test:production`: 208/208 passed.
- `npm run test:production:typecheck`: passed.
- S28 focused suite: 7/7 passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 29 contiguous complete, no orphans.
- `npm run build`: passed.
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## Production and pilot acceptance still pending

- Authorized AWS Mumbai deployment, DNS/Cognito/provider credentials, IAM/object-store review, penetration testing, malware-scanner integration, secret rotation, and operational approval.
- Qualified India finance/tax review; representative Tally/Cashfree/messaging certification and recovery evidence.
- Deployed target-load and ten-year query-plan evidence, production availability window, real backup restore, regional DR, queue/provider recovery, and alert/runbook exercises.
- Manual WCAG 2.2 AA/assistive-technology review; current Android Chrome PWA, desktop Chrome/Edge, and iOS Safari device runs; representative scanner/printer checks; and trained-staff usability acceptance.
- Authorized first-tenant source/mappings and migration rehearsal, 14 signed parallel-operation days, maker-checker cutover/rollback rehearsal and cutover, 28 measured hypercare days, then an authorized second tenant completing the identical playbook without a code fork.

## Guardrails for continuation

- Do not convert a local fixture, boolean, checksum, or automated result into `AUTHORIZED_EXTERNAL` evidence. Record only artifacts supplied or produced by an authorized real exercise and retain named ownership.
- Do not deploy, contact providers, import live data, message customers, execute cutover/purge, or push GitHub without explicit authority.
- After each external exercise, update the owning slice evidence, S28 prerequisite record, checklist, traceability narrative, and this handoff; rerun applicable regression and release gates.
- The active programme goal remains incomplete until all external production prerequisites, real migration rehearsal, first-tenant pilot acceptance, four-week hypercare exit, and repeatable second-tenant acceptance are evidenced.
