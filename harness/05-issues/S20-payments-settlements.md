# S20 — Payments, advances, credit, refunds, and settlement

Status: Approved  
Implements: R-082, R-083, R-084, R-085, R-086, R-087, R-088

## Outcome
Post exact manual/Cashfree money events, formal credit, corrections, and settlement reconciliation.

## Acceptance criteria
- [ ] Advances and split/partial/manual payments allocate exactly and reject duplicate references; corrections are approved compensating events.
- [ ] Cashfree links are scoped/expiring; raw signed webhooks are authoritative, idempotent, and safe under invalid, duplicate, and reordered delivery.
- [ ] Credit exposure controls delivery; refunds/chargebacks and settlements reconcile gross, fees, tax, corrections, and net bank amounts with mismatches exposed.

