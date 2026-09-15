# WorkshopOS v1.2 handoff

Updated: 2026-09-15
Completed slice: V12-10
Next slice: V12-11

## Requirement IDs implemented

V12-R001 through V12-R022 are implemented on the production tracer, shared UI/list/export contracts, management screens completed through V12-08, the Job List/documents, and the server-authoritative Job lifecycle and Data Flow. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/039_job_lifecycle_projection.sql`, `production/src/job-lifecycle.ts`, `production/src/http-errors.ts`, `production/src/role-permissions.ts`, `production/local/database.ts`, `production/local/server.ts`, `production/local/seed-demo.ts`, `production/tests/job-lifecycle-projection.test.ts`, `production/tests/jobs-postgres.integration.test.ts`, `src/ProductionDataFlowApp.tsx`, `src/ProductionJobsApp.tsx`, `src/production-jobs-api.ts`, `src/production-navigation.tsx`, `src/production-work-items.css`, `src/main.tsx`, `tests/production-jobs.spec.ts`, `unit-tests/production-jobs-api.test.ts`, `scripts/test-local.mjs`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- A fresh database applied all 39 migrations; focused PostgreSQL integration passed 1/1, including historical Data Flow selection, blocker enforcement, distinct evidenced facts, Hold/resume, stale rejection, cancel/reopen/archive, RLS, and append-only evidence.
- `npm run local:up` succeeded and `npm run local:test` passed repeatedly at 39 migrations, including lifecycle command replay, same-stage Hold resume, record-specific Data Flow, exact authorization, and all earlier smoke checks.
- Focused projection/client tests passed 5/5. Focused Playwright passed 6/6 with one intended live-stack skip and 7/7 against Docker. Full Playwright passed 49/57 with eight expected environment-gated real-stack skips.
- The full production suite passed 236/244 with eight expected opt-in PostgreSQL skips.
- `npm run build` passed with the existing non-blocking bundle-size warning; unit passed 20/20; production typecheck and `git diff --check` passed.
- Both harness verifiers passed and reported V12-11 as the next contiguous slice.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except production-backed screens completed through V12-10; V12-14 owns the final static authority gate.
- V12-12 and V12-13 must connect their dedicated estimate, work-acceptance, and payment workflows to the V12-10 fact ledger rather than creating parallel approval concepts.
- Production Cognito, private object storage, deployed authorization, deployment, and manual certification were not contacted and remain external evidence for their owning slices.
- The local identity gateway and deterministic seed remain explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- Existing bundle size and later security, recovery, device/accessibility, migration, and pilot evidence remain open.

## Next-slice dependencies

V12-11 implements V12-R023 through V12-R025 using migration 040. It must require a valid Job for every media record, cascade Visit/check-in date to a searchable Job selector, enforce lifecycle category gates, store originals only in private object storage while PostgreSQL holds metadata/thumbnails, scan before access, support archive/view/download, and add upload entry points on both Media and Job details.
