# WorkshopOS v1.2 handoff

Updated: 2026-09-14
Completed slice: V12-03
Next slice: V12-04

## Requirement IDs implemented

V12-R001 through V12-R007 and V12-R011 are implemented on the representative production Work Item tracer and reusable HTTP/list/dialog/export contracts. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/032_server_lists_exports.sql`, `production/local/database.ts`, `production/local/server.ts`, `production/src/http-errors.ts`, `production/src/server-list-contract.ts`, `production/src/work-item-export.ts`, `production/tests/server-list-contract.test.ts`, `production/tests/server-list-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/ProductionWorkItemsApp.tsx`, `src/production-work-items.css`, `src/work-items-api.ts`, `tests/production-work-items-list.spec.ts`, `unit-tests/work-items-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- Contract tests passed 2/2, including real PDF and XLSX artifact signatures and complete row counts.
- Both Work Item PostgreSQL integration suites passed 2/2 on a fresh database after all 32 migrations.
- `npm run local:up`; `npm run local:test`; `npm run local:down` passed against the preserved stack with 32 unchanged migrations.
- Focused Playwright passed 8/8; full `npm run test:e2e` passed 33/33.
- `npm run build` passed with the existing non-blocking bundle-size warning.
- `npm run test:unit` passed 9/9.
- `npm run test:production` passed 217/220 with three expected opt-in PostgreSQL skips; the two affected Work Item suites passed separately against fresh PostgreSQL.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except Admin Users and the isolated Work Item tracer; production contract modules outside these paths are not yet wired screens.
- The Work Item list/export path proves the shared contract but does not substitute for the domain migrations assigned to V12-04 and V12-07 through V12-14.
- The tracer stores completed export artifacts privately in PostgreSQL. Later high-volume domains should assess private object storage while preserving this authorization and full-result contract.
- Existing global identity/email semantics and the bundle-size warning remain known risks for their owning slices.
- External deployment, provider, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remains unavailable and release-blocking.

## Next-slice dependencies

V12-04 migrates tenant User Management to the reusable production dialogs and list/export contract. It must add invitation/status/archive commands, filters, concurrency handling, and final-admin protections while preserving PostgreSQL authority and matching API permissions.
