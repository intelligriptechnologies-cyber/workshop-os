# WorkshopOS v1.2 handoff

Updated: 2026-09-16
Completed slice: V12-13
Next slice: V12-14

## Requirement IDs implemented

V12-R001 through V12-R029 are implemented on the production tracer and production-backed screens completed through Billing, payments, delivery, gate verification, and closure. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/042_billing_delivery_production.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/billing-delivery.ts`, `production/src/http-errors.ts`, `production/src/role-permissions.ts`, `production/tests/billing-delivery-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/ProductionBillingApp.tsx`, `src/main.tsx`, `src/production-billing-api.ts`, `src/production-navigation.tsx`, `tests/production-billing.spec.ts`, `unit-tests/production-billing-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- A fresh database applied all 42 migrations; focused PostgreSQL acceptance passed 1/1 after root hardening. Coverage includes immutable invoices/payments, active payer registration, finalization/adjustment outboxes, economically effective credit notes, independent compensating corrections, exact payment clearance, protected documents, release ordering, and issuer/verifier separation.
- `npm run local:up` rebuilt the final image and `npm run local:test` passed 50 checks against the 42-migration Docker HTTP/PostgreSQL runtime.
- Focused Playwright passed 3/3, including the accessible reasoned correction dialog. Full Playwright passed 57/66 with nine configured real-stack skips.
- The full production suite passed 241/253 with 12 expected opt-in PostgreSQL skips.
- `npm run build` passed with the existing non-blocking bundle-size warning; unit passed 26/26; production typecheck and `git diff --check` passed.
- Both harness verifiers pass and identify V12-14 as the next contiguous slice.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits.

## Risks and blockers

- V12-14 owns inventory and migration of every remaining rich screen, final server-list/query/export conformance, and the static no-`sql.js` production-authority gate.
- Production object storage, trusted malware scanning, Cognito, deployed authorization, payment-provider/tax certification, deployment, and manual certification remain external evidence; local Docker proves only the in-scope runtime boundaries.
- The production Billing runtime uses the approved WorkshopOS-native invoice authority. Existing Tally-authoritative exchange remains governed by its separate connector and is not falsely represented as native authority.
- The non-sensitive local test directory `%TEMP%\WorkshopOS-v1211-private-agent` may remain because the earlier session's destructive-action policy rejected removal after its exact path was verified.
- Existing bundle size and later security, recovery, device/accessibility, migration, and pilot evidence remain open.

## Next-slice dependencies

V12-14 implements V12-R030 using migration 043 if required. It must inventory and migrate appointments, follow-ups, action inbox, material issue/reconciliation, reports, remaining masters, and every other rich list/grid to authenticated `/api/v1` PostgreSQL authority with the standard server query, URL state, view preferences, complete exports, responsive empty states, and a static gate proving no rich production screen retains `sql.js` authority.
