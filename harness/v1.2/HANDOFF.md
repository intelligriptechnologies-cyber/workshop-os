# WorkshopOS v1.2 handoff

Updated: 2026-09-14
Completed slice: V12-08
Next slice: V12-09

## Requirement IDs implemented

V12-R001 through V12-R016 are implemented on the production tracer, shared dialogs/list/export contracts, tenant User Management, custom roles, authorized navigation/search, versioned Business Settings, PostgreSQL-authoritative Customer/Vehicle experiences, and production Inventory operations/import. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/037_inventory_operations_import.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/admin-users.ts`, `production/src/http-errors.ts`, `production/src/inventory-export.ts`, `production/src/inventory-operations.ts`, `production/src/role-permissions.ts`, `production/tests/inventory-import-contract.test.ts`, `production/tests/inventory-operations-postgres.integration.test.ts`, `production/tests/role-permissions.test.ts`, `scripts/test-local.mjs`, `src/ProductionInventoryApp.tsx`, `src/main.tsx`, `src/production-inventory-api.ts`, `src/production-navigation.tsx`, `tests/production-inventory.spec.ts`, `unit-tests/production-inventory-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- Five focused inventory contracts passed with the isolated PostgreSQL test run separately; the full production suite passed 231/238 with seven expected opt-in PostgreSQL skips.
- A fresh database applied all 37 migrations; focused V12-08 PostgreSQL integration passed 1/1, including full-filter analytics, warehouse RLS, dry-run isolation, idempotency, exact reconciliation, and append-only evidence.
- `npm run local:up` and `npm run local:test` passed repeatedly at 37 migrations with Inventory and all preceding HTTP/PostgreSQL checks; the stack was stopped after verification.
- Focused Playwright passed 2/2 including real Inventory persistence; full Playwright passed 43/50 with seven expected environment-gated real-stack tests.
- `npm run build` passed with the existing non-blocking bundle-size warning; `npm run test:unit` passed 18/18.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except Tenant User Management, Roles and Permissions, Business Settings, Customers, Vehicles, Inventory, Global Search, and the isolated Work Item tracer.
- Production Cognito and deployed authorization behavior compile and have service/browser tests, but no live provider or deployed tenant was contacted; those remain external evidence.
- The local identity gateway and deterministic seed are explicitly gated by `ALLOW_DEMO_LOGIN=true` and are not production identity authority.
- The immutable settings snapshot is connected to the production governed-work tracer; V12-09/V12-10 must call it from the canonical Job-start lifecycle. Numeric ordering is explicitly regressed through settings version 10.
- Production provisioning must assign permitted warehouses through `membership_inventory_warehouse`; local owner seeds include assignments, while warehouse-assignment administration remains for a later management surface.
- Existing bundle size, production identity/email semantics, deployment, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remain open for their owning slices or external certification.

## Next-slice dependencies

V12-09 implements the production Job List, current-local-date Visit/check-in default, explicit filters, orange `In Progress` state, Job Card PDF, and conditional immutable linked-document discovery/download. It must use migration 038 without changing migrations 001 through 037 and connect Jobs to immutable effective-settings snapshots where active work begins.
