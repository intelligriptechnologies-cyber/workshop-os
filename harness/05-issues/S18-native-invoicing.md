# S18 — Native GST invoicing and adjustments

Status: Approved  
Implements: R-073, R-074, R-075, R-076, R-077, R-078

## Outcome
Enforce billing readiness and exact India GST invoices per payer with immutable documents, notes, cancellation rules, and fiscal rollover.

## Acceptance criteria
- [ ] Work/QC/material/supplement blockers prevent billing and tenant invoice authority is explicit.
- [ ] GST, discounts, rounding, payer allocation, and totals are exact from snapshots; one final invoice per payer cannot duplicate/omit lines.
- [ ] Final documents/numbers cannot be edited or reused; approved credit/debit/cancel-reissue paths work across financial-year rollover and concurrency.

