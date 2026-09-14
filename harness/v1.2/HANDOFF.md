# WorkshopOS v1.2 handoff

Updated: 2026-09-14
Completed slice: V12-07
Next slice: V12-08

## Requirement IDs implemented

V12-R001 through V12-R014 are implemented on the production tracer, shared dialogs/list/export contracts, tenant User Management, custom roles, authorized navigation/search, versioned Business Settings, and PostgreSQL-authoritative Customer and Vehicle experiences. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/036_customer_vehicle_production.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/customer-vehicle-export.ts`, `production/src/http-errors.ts`, `production/src/role-permissions.ts`, `production/tests/business-settings-postgres.integration.test.ts`, `production/tests/customer-vehicle-export.test.ts`, `production/tests/customers-vehicles-postgres.integration.test.ts`, `production/tests/role-permissions.test.ts`, `scripts/test-local.mjs`, `src/ProductionCustomersVehiclesApp.tsx`, `src/main.tsx`, `src/production-customers-vehicles-api.ts`, `src/production-navigation.tsx`, `tests/production-customers-vehicles.spec.ts`, `unit-tests/production-customers-vehicles-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- Customer/vehicle export and existing identity-history contracts passed; the full production suite passed 226/232 with six expected opt-in PostgreSQL skips.
- A fresh database applied all 36 migrations; focused V12-06/V12-07 PostgreSQL integrations passed 2/2, including RLS, duplicate and ownership rules, optimistic versions, details, and numeric settings ordering through version 10.
- `npm run local:up` and `npm run local:test` passed repeatedly at 36 migrations with Customer/Vehicle and all preceding HTTP/PostgreSQL checks; the stack was stopped after verification.
- Focused Playwright passed 3/3 including real Customer persistence; full Playwright passed 42/48 with six expected environment-gated real-stack tests.
- `npm run build` passed with the existing non-blocking bundle-size warning; `npm run test:unit` passed 17/17.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except Tenant User Management, Roles and Permissions, Business Settings, Customers, Vehicles, Global Search, and the isolated Work Item tracer.
- Production Cognito and deployed authorization behavior compile and have service/browser tests, but no live provider or deployed tenant was contacted; those remain external evidence.
- The local identity gateway and deterministic seed are explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- The immutable settings snapshot is connected to the production governed-work tracer; V12-09/V12-10 must call it from the canonical Job-start lifecycle. Numeric ordering is explicitly regressed through settings version 10.
- Existing bundle size, production identity/email semantics, deployment, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remain open for their owning slices or external certification.

## Next-slice dependencies

V12-08 implements production Inventory analytics/list operations and controlled staged import with validation, dry run, explicit commit, reconciliation, and downloadable error manifests. It must use migration 037 without changing migrations 001 through 036.
