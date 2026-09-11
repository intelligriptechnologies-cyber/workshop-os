# S15 — Job material control and reconciliation

Status: Complete
Implements: R-061, R-062, R-063

## Outcome
Control request, Store issue, technician consumption/waste, verified return, and Manager-approved variance.

## Acceptance criteria
- [x] Store cannot issue without approved Job/task demand or separately approved reason, available authorized stock, and exact lot/UOM data.
- [x] Technician outcomes and Store return verification preserve evidence and separation of duties.
- [x] Reconciliation blocks until `Issued = Consumed + Verified Return + Wastage + Approved Variance`; excess/variance thresholds require Manager approval under concurrency.

## Evidence

- `production/src/job-material-control.ts` provides versioned, idempotent Job/task requests, partial issues, independently approved substitutions and non-Job stock reasons, technician outcomes, Store-verified exact-lot returns, threshold approvals, variance, and reconciliation events for S16/S18.
- `production/src/inventory-ledger.ts` adds the S13-controlled Job-return posting boundary so verified returns restore exact quantity and value without bypassing lot, UOM, location, frozen-count, permission, or balanced-ledger rules.
- `production/db/migrations/015_job_material_control.sql` persists exact fixed-decimal demand/outcomes, maker-checker evidence, the reconciliation equation, append-only postings/events/receipts, S13 stock delegates, and forced tenant/branch/warehouse RLS.
- Nine S15 behavior/contract tests pass, including concurrent issue/approval, idempotent retry, excess/waste/variance controls, substitution, independent return verification, authorized non-Job withdrawal, and exact conservation. The full production suite passes 105/105 with production typecheck.
