# WorkshopOS v1.2 handoff

Updated: 2026-09-14
Completed slice: V12-04
Next slice: V12-05

## Requirement IDs implemented

V12-R001 through V12-R009 and V12-R011 are implemented on the production tracer, shared dialogs/list/export contracts, and tenant User Management. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`package.json`, `production/db/migrations/033_tenant_user_management.sql`, `production/local/cognito.ts`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/admin-users.ts`, `production/src/user-export.ts`, `production/src/user-list-contract.ts`, `production/tests/admin-user-management.test.ts`, `production/tests/admin-users-postgres.integration.test.ts`, `production/tests/user-management-contract.test.ts`, `scripts/test-local.mjs`, `src/ProductionUsersApp.tsx`, `src/admin-users-api.ts`, `src/auth.ts`, `src/main.tsx`, `src/production-users-api.ts`, `src/production-users.css`, `tests/production-users.spec.ts`, `unit-tests/production-users-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- User service/list/export/migration contract tests passed 9/9; API client tests passed 2/2.
- Fresh PostgreSQL integration passed 1/1 after all 33 migrations, including concurrent final-admin serialization, status/session denial, RLS, filtering, assignments, idempotency, and immutable audit evidence.
- `npm run local:up`; `npm run local:test`; `npm run local:down` passed with 33 migrations and tenant-admin HTTP authorization checks.
- Focused Playwright passed 3/3, including real browser to HTTP to PostgreSQL persistence and private XLSX download; full `npm run test:e2e` passed 36/36.
- `npm run build` passed with the existing non-blocking bundle-size warning.
- `npm run test:unit` passed 11/11.
- `npm run test:production` passed 221/224 with three expected opt-in PostgreSQL skips; V12-04's skipped integration suite passed separately against fresh PostgreSQL.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except tenant User Management and the isolated Work Item tracer.
- Production Cognito commands compile and have port/service tests, but no live provider was contacted; deployed Cognito invitation, enable/disable, and resend behavior remains external evidence.
- The local identity gateway and deterministic seed are explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- Existing bundle size, production identity/email semantics, deployment, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remain open for their owning slices or external certification.

## Next-slice dependencies

V12-05 implements custom roles, a searchable hierarchical page/action permission catalog, protected templates, authorized navigation, and matching API enforcement. It builds on the now-production User Management assignment flow and must use migration 034 without changing migrations 001 through 033.
