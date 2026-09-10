# S19 — Tally connector and file fallback

Status: Approved  
Implements: R-079, R-080, R-081

## Outcome
Support Tally-authoritative invoice exchange, reconciliation, and controlled fallback for current plus two prior TallyPrime releases.

## Acceptance criteria
- [ ] Contract suites for all three supported release generations export/import without duplicate invoices under retry/reorder.
- [ ] File fallback validates, manifests, reconciles, and prevents duplicates.
- [ ] Tally IDs/status/errors and amount/tax/payer mismatches remain visible and never silently switch accounting authority.

