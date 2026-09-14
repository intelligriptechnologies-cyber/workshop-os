# WorkshopOS v1.2 handoff

Updated: 2026-09-14
Completed slice: V12-06
Next slice: V12-07

## Requirement IDs implemented

V12-R001 through V12-R013 are implemented on the production tracer, shared dialogs/list/export contracts, tenant User Management, custom roles, authorized navigation/search, and versioned inherited Business Settings with immutable work snapshots. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/035_business_settings.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/business-settings.ts`, `production/src/role-permissions.ts`, `production/tests/business-settings.test.ts`, `production/tests/business-settings-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/ProductionBusinessSettingsApp.tsx`, `src/main.tsx`, `src/production-business-settings-api.ts`, `src/production-business-settings.css`, `src/production-navigation.tsx`, `tests/production-business-settings.spec.ts`, `unit-tests/production-business-settings-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- Business Settings domain tests passed 2/2; the full production suite passed 225/230 with five expected opt-in PostgreSQL skips.
- A fresh database applied all 35 migrations and focused PostgreSQL integration passed 1/1, including RLS, validation, tenant inheritance, branch reset, stale publication, immutable version/snapshot evidence, and cross-scope foreign-key rejection.
- `npm run local:up` and `npm run local:test` passed at 35 migrations with HTTP publication and non-retroactive settings snapshots; the stack was stopped after verification.
- Focused Playwright passed 3/3, including the real browser-to-HTTP-to-PostgreSQL settings flow.
- `npm run build` passed with the existing non-blocking bundle-size warning; `npm run test:unit` passed 16/16.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except tenant User Management, Roles and Permissions, Business Settings, Global Search, and the isolated Work Item tracer.
- Production Cognito and deployed authorization behavior compile and have service/browser tests, but no live provider or deployed tenant was contacted; those remain external evidence.
- The local identity gateway and deterministic seed are explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- The immutable settings snapshot is connected to the production governed-work tracer; V12-09/V12-10 must call it from the canonical Job-start lifecycle.
- Existing bundle size, production identity/email semantics, deployment, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remain open for their owning slices or external certification.

## Next-slice dependencies

V12-07 migrates Customer and Vehicle lists, details, create/edit flows, duplicate and ownership controls, filters, exports, concurrency behavior, and responsive grid/table presentation to production `/api/v1` and PostgreSQL authority. It must use migration 036 without changing migrations 001 through 035.
