# WorkshopOS v1.2 handoff

Updated: 2026-09-14
Completed slice: V12-05
Next slice: V12-06

## Requirement IDs implemented

V12-R001 through V12-R011 are implemented on the production tracer, shared dialogs/list/export contracts, tenant User Management, custom roles, authorized navigation, and permission-filtered global search. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/034_roles_permissions.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/http-errors.ts`, `production/src/role-permissions.ts`, `production/tests/role-permissions.test.ts`, `production/tests/roles-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/ProductionNavigation.tsx`, `src/ProductionRolesApp.tsx`, `src/ProductionSearchApp.tsx`, `src/ProductionUsersApp.tsx`, `src/ProductionWorkItemsApp.tsx`, `src/main.tsx`, `src/production-navigation.tsx`, `src/production-roles-api.ts`, `src/production-roles.css`, `src/production-search-api.ts`, `tests/production-roles.spec.ts`, `tests/production-search.spec.ts`, `tests/production-users.spec.ts`, `unit-tests/production-navigation.test.ts`, `unit-tests/production-roles-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- Role service and migration contracts passed within `npm run test:production`; the full suite passed 223/227 with four expected opt-in PostgreSQL skips.
- Focused PostgreSQL integration passed 1/1 after all 34 migrations, including RLS, protected and versioned roles, permission refresh, denied search leakage, and serialized protection against removing the final effective administrator through a role edit.
- `npm run local:up` and `npm run local:test` passed with 34 migrations and 21 HTTP/PostgreSQL authorization checks; the stack was stopped after verification.
- Focused Playwright passed 9/9, including real browser-to-HTTP-to-PostgreSQL role, search, and user flows.
- `npm run build` passed with the existing non-blocking bundle-size warning; `npm run test:unit` passed 14/14.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except tenant User Management, Roles and Permissions, Global Search, and the isolated Work Item tracer.
- Production Cognito and deployed authorization behavior compile and have service/browser tests, but no live provider or deployed tenant was contacted; those remain external evidence.
- The local identity gateway and deterministic seed are explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- Existing bundle size, production identity/email semantics, deployment, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remain open for their owning slices or external certification.

## Next-slice dependencies

V12-06 implements versioned, tabbed Business Settings with tenant defaults, branch overrides, inherited-value display, validation, reset, publication, and immutable effective-settings snapshots for active work. It must use migration 035 without changing migrations 001 through 034.
