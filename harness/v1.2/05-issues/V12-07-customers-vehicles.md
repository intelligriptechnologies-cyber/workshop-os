# Migrate Customers and Vehicles

Status: Complete
Implements: V12-R014  
Blocked by: V12-03, V12-05

## Outcome

Migrate Customer and Vehicle list/detail/create/edit experiences to production authority using standard dialogs, lists, exports, and responsive modes.

## Acceptance criteria

- [x] Authorized users create and edit Customers and Vehicles through dialogs and see PostgreSQL-backed results after reload.
- [x] Duplicate mobile/registration and ownership/association conflicts produce actionable outcomes without silently merging records.
- [x] Server filters, stable paging, grid/table preference, and full-result private exports satisfy V12-03.
- [x] Optimistic conflicts and cross-tenant/branch attempts fail safely.

## Evidence

RED: client, export, PostgreSQL, browser, and local-stack tests captured authenticated list/detail/create/edit behavior, duplicate identities, owner association, stale updates, tenant/branch denial, URL filters, paging, presentation preferences, complete exports, dialog errors, and persistence after reload.

GREEN: migration `036_customer_vehicle_production.sql` adds production list indexes and customer-mobile identity control while extending protected administrator permissions. `/production/customers` and `/production/vehicles` now use authenticated `/api/v1` and PostgreSQL for responsive lists, record details, accessible dialogs, writes, preferences, and private asynchronous PDF/XLSX exports.

REFACTOR: customer/vehicle artifact rendering is shared, API errors remain actionable inside dialogs, export status/download requests fail before revealing jobs to callers without either export permission, and the existing append-only ownership history remains authoritative.

Passing evidence (2026-09-14):

- Customer/vehicle export and existing identity-history contracts passed; full production suite passed 226/232 with six opt-in PostgreSQL suites skipped only when their URLs were absent.
- A fresh database applied migrations 001–036; V12-06 and V12-07 PostgreSQL integrations passed 2/2, covering RLS, idempotency, duplicates, owner association, optimistic conflicts, details, and the numeric settings-version regression through version 10.
- `npm run local:up` and `npm run local:test` passed repeatedly at 36 migrations with customer duplicate, vehicle owner, server-list, private-export, and all prior smoke checks.
- Focused Playwright passed 3/3, including real browser-to-HTTP-to-PostgreSQL create/reload; full `npm run test:e2e` passed 42/48 with six real-stack tests intentionally environment-gated.
- `npm run build`, 17/17 unit tests, production typecheck, both harness verifiers, and `git diff --check` passed.
