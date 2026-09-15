# WorkshopOS v1.2 handoff

Updated: 2026-09-15
Completed slice: V12-09
Next slice: V12-10

## Requirement IDs implemented

V12-R001 through V12-R018 are implemented on the production tracer, shared dialogs/list/export contracts, tenant User Management, roles and permissions, Business Settings, Customers/Vehicles, Inventory, and the production Job List/document experience. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/038_production_job_list_documents.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/http-errors.ts`, `production/src/job-export.ts`, `production/src/job-list-contract.ts`, `production/src/role-permissions.ts`, `production/tests/job-list-contract.test.ts`, `production/tests/jobs-postgres.integration.test.ts`, `production/tests/role-permissions.test.ts`, `scripts/test-local.mjs`, `src/ProductionJobsApp.tsx`, `src/main.tsx`, `src/production-jobs-api.ts`, `src/production-navigation.tsx`, `src/production-work-items.css`, `tests/production-jobs.spec.ts`, `unit-tests/production-jobs-api.test.ts`, and the v1.2 checklist/issue/traceability/handoff.

## Focused and regression evidence

- A fresh database applied all 38 migrations; focused V12-09 PostgreSQL integration passed 1/1, covering branch-local dates, canonical lifecycle projection, settings snapshot capture and immutability, conditional documents, denial, and RLS.
- `npm run local:up` succeeded and `npm run local:test` passed twice at 38 migrations, including Job List, settings snapshot, document discovery, authorized Job Card, and all preceding production smoke checks.
- Focused Playwright passed 2/2 with the intended real-stack skip and 3/3 against Docker, including browser-to-HTTP-to-PostgreSQL Job List and Job Card behavior. Full Playwright passed 45/53 with eight expected environment-gated real-stack skips.
- The full production suite passed 233/241 with eight expected opt-in PostgreSQL skips; focused query/export and permission contracts passed.
- `npm run build` passed with the existing non-blocking bundle-size warning; `npm run test:unit` passed 19/19; production typecheck passed.
- Both harness verifiers and `git diff --check` passed before commit.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except the production-backed screens completed through V12-09; V12-14 owns the final static authority gate.
- V12-09 reads the canonical lifecycle and captures settings when active work begins, but lifecycle mutation, Hold/resume, cancellation/reopening/archive, Work Accepted, Payment Cleared, blockers, history, and explained Data Flow belong to V12-10.
- Production Cognito, private object storage, deployed authorization, deployment, and manual certification were not contacted and remain external evidence for their owning slices.
- The local identity gateway and deterministic seed remain explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- The existing bundle-size warning and later security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remain open.

## Next-slice dependencies

V12-10 implements V12-R019 through V12-R022 using migration 039. It must preserve canonical stages, model Hold as a pause overlay that resumes to the same underlying stage, keep Estimate Approved, Work Accepted, and Payment Cleared distinct, enforce valid next actions and blockers, preserve append-only history, support reasoned cancel/reopen/archive without hard deletion, and explain the selected Job's Data Flow from production state.
