# WorkshopOS v1.2 handoff

Updated: 2026-09-15
Completed slice: V12-11
Next slice: V12-12

## Requirement IDs implemented

V12-R001 through V12-R025 are implemented on the production tracer, shared UI/list/export contracts, management screens completed through V12-08, Job List/documents, server-authoritative Job lifecycle/Data Flow, and private lifecycle-gated Job Media. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`compose.yaml`, `production/README.md`, `production/db/migrations/040_job_linked_media.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/http-errors.ts`, `production/src/job-media.ts`, `production/src/role-permissions.ts`, `production/tests/job-media-contract.test.ts`, `production/tests/job-media-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/ProductionJobsApp.tsx`, `src/ProductionMediaApp.tsx`, `src/main.tsx`, `src/production-media-api.ts`, `src/production-media.css`, `src/production-navigation.tsx`, `tests/production-jobs.spec.ts`, `tests/production-media.spec.ts`, `unit-tests/production-media-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- A fresh database applied all 40 migrations; focused PostgreSQL integration passed 4/4, including valid Job/date/category enforcement, scanner-only quarantine release, application-role denial, RLS, versioned archive, compatibility with generic secure-media reservations, and private-original separation.
- `npm run local:up` and `npm run local:test` passed after integration hardening, covering Visit-date Job selection, lifecycle-gated upload, trusted scanning, private download, archive/no-delete, exact authorization, and all earlier smoke checks.
- Focused Playwright passed 3/3 against Docker. Full real-stack Playwright passed 60/60 with one worker; three state-colliding parallel cases passed 12/12 in isolated reruns.
- The full production suite passed 239/248 with nine expected opt-in PostgreSQL skips.
- `npm run build` passed with the existing non-blocking bundle-size warning; unit passed 22/22; production typecheck and `git diff --check` passed.
- Both harness verifiers passed and reported V12-12 as the next contiguous slice.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except production-backed screens completed through V12-11; V12-14 owns the final static authority gate.
- V12-12 and V12-13 must connect estimate approval, work acceptance, and payment clearance to the V12-10 fact ledger rather than creating parallel approval concepts.
- Production object storage, its durable mounted path/service, and a trusted malware-scanner service/token remain external deployment work; local Docker proves the private boundary without claiming those systems are deployed.
- The non-sensitive local test directory `%TEMP%\WorkshopOS-v1211-private-agent` may remain because this session's destructive-action policy rejected its removal after the exact resolved path was verified.
- Production Cognito, deployed authorization, deployment, and manual certification were not contacted and remain external evidence for their owning slices.
- Existing bundle size and later security, recovery, device/accessibility, migration, and pilot evidence remain open.

## Next-slice dependencies

V12-12 implements V12-R026 and V12-R027 using the next migration. It must migrate Estimates, Tasks, and QC to production lists/dialogs while preserving immutable estimate versions and approval evidence, dependency-aware task assignment/execution evidence, independent QC, blocking rework, permissions, idempotency, optimistic concurrency, RLS, and the canonical V12-10 lifecycle facts.
