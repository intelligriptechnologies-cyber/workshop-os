# S20 — Payments, advances, credit, refunds, and settlement

Status: Complete
Implements: R-082, R-083, R-084, R-085, R-086, R-087, R-088

## Outcome
Post exact manual/Cashfree money events, formal credit, corrections, and settlement reconciliation.

## Acceptance criteria
- [x] Advances and split/partial/manual payments allocate exactly and reject duplicate references; corrections are approved compensating events.
- [x] Cashfree links are scoped/expiring; raw signed webhooks are authoritative, idempotent, and safe under invalid, duplicate, and reordered delivery.
- [x] Credit exposure controls delivery; refunds/chargebacks and settlements reconcile gross, fees, tax, corrections, and net bank amounts with mismatches exposed.

## Evidence

- `production/src/payments-settlements.ts` provides tenant/branch-authorized exact advance and payment events, split rail allocation, inert scoped Cashfree links, redirect-proof separation, signature-verified raw webhook processing, formal credit/exception control, approved corrections, and visible settlement reconciliation.
- `production/db/migrations/020_payments_settlements.sql` persists exact append-only financial and webhook evidence, credit/correction approval state, settlement evidence, fingerprinted command receipts, unique worker effects, serialized invoice posting, durable worker claims, and forced tenant/branch RLS.
- `production/tests/payments-settlements.test.ts` proves eight public behaviors through RED/GREEN cycles, including advance and reordered-webhook over-allocation rejection, invalid/duplicate webhook handling, maker-checker compensation, credit delivery eligibility, settlement mismatches, and storage isolation contracts.
- Focused tests and production typecheck pass locally. No Cashfree/provider call, external file write, deployment, money movement, or customer message occurred. Cashfree credentials/enrollment/webhook registration, representative bank settlement data, qualified India finance review, and authorized deployment remain external prerequisites.
