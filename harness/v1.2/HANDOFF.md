# WorkshopOS v1.2 handoff

Updated: 2026-09-16
Completed slice: V12-12
Next slice: V12-13

## Requirement IDs implemented

V12-R001 through V12-R027 are implemented on the production tracer and production-backed screens completed through Estimates, Tasks, and QC. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/041_estimates_tasks_qc_production.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/estimate-task-qc.ts`, `production/src/http-errors.ts`, `production/src/role-permissions.ts`, `production/tests/estimates-tasks-qc-controls-postgres.integration.test.ts`, `production/tests/estimates-tasks-qc-postgres.integration.test.ts`, `production/tests/estimates-tasks-qc-production.test.ts`, `scripts/test-local.mjs`, `src/ProductionEstimatesTasksQcApp.tsx`, `src/main.tsx`, `src/production-estimates-tasks-qc-api.ts`, `src/production-navigation.tsx`, `tests/production-estimates-tasks-qc.spec.ts`, `unit-tests/production-estimates-tasks-qc-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- A fresh database applied all 41 migrations; focused PostgreSQL integration passed 2/2. The final Estimate integration rerun passed 1/1 after adding atomic document persistence and both downstream approval outbox events.
- `npm run local:up` rebuilt the app and `npm run local:test` passed 48 checks against the Docker HTTP/PostgreSQL runtime.
- Focused Playwright passed 4/4. Full mocked Playwright passed 55/64 with nine configured real-stack skips; full real-stack Playwright passed 64/64 serially.
- The full production suite passed 241/252 with 11 expected opt-in PostgreSQL skips.
- `npm run build` passed with the existing non-blocking bundle-size warning; unit passed 24/24; production typecheck and `git diff --check` passed.
- Both harness verifiers pass and identify V12-13 as the next contiguous slice.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- V12-14 owns final standard-list/query/export conformance for any operational Estimates, Tasks, or QC list still using a smaller screen-specific query surface, plus the static no-`sql.js` authority gate.
- Rich PWA screens remain `sql.js`-authoritative except production-backed screens completed through V12-12; V12-14 owns the final migration and static authority gate.
- Production object storage, trusted malware scanning, Cognito, deployed authorization, deployment, and manual certification remain external evidence; local Docker proves only the in-scope runtime boundaries.
- The non-sensitive local test directory `%TEMP%\WorkshopOS-v1211-private-agent` may remain because the earlier session's destructive-action policy rejected removal after its exact path was verified.
- Existing bundle size and later security, recovery, device/accessibility, migration, and pilot evidence remain open.

## Next-slice dependencies

V12-13 implements V12-R028 and V12-R029 using migration 042. It must migrate Billing, payments, receipts, pre-release gate passes, delivery, and closure to production screens and APIs while preserving immutable finalized finance, exact allocation, maker-checker corrections, canonical Work Accepted and Payment Cleared facts, protected documents, and vehicle-release blockers.
