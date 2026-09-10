# S05 — Customer and vehicle identity

Status: Complete
Implements: R-021, R-022, R-023, R-024, R-025

## Outcome
Deliver customer/contact and vehicle search, duplicate resolution, controlled merge, odometer/service data, and ownership history.

## Acceptance criteria
- [x] Search/create/update surfaces flag exact and probable duplicates without leaking another tenant.
- [x] A controlled merge preserves aliases, contacts, ownership/service history, and rejects conflicting canonical choices.
- [x] Ownership changes do not rewrite historic jobs/payers; compensating merge recovery is permissioned and audited.

## Evidence

- `production/tests/customer-vehicle-history.test.ts` exercises the public `/api/v1` surface for named typed contacts, consent/preference/payer relations, customer and vehicle identity search/create/update, configurable duplicate classification, optimistic concurrency, odometer/service snapshots, effective ownership, unsafe merge rejection, and authenticated compensating recovery.
- `production/src/customer-vehicle-history.ts` derives tenant/branch scope from membership, requires permissions and command idempotency, preserves registration/VIN and vehicle attributes, and retains aliases and historical job owner/payer identities through merge and compensation.
- `production/db/migrations/005_customer_vehicle_history.sql` defines tenant-keyed customer/vehicle records, exact identity indexes, effective histories, immutable service owner/payer snapshots, merge/alias/compensation/audit ledgers, tenant-scoped idempotency, forced RLS, and append-only history triggers.
- S05 completion gate: production tests 31/31, production typecheck, harness verification, demo build, Playwright 7/7, and diff check passed on 2026-09-11. No deployment, provider call, customer contact, push, or other external action occurred.
