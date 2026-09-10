# S09 — Versioned estimates and customer approval

Status: Approved  
Implements: R-032, R-033, R-034, R-035, R-036, R-037, R-038

## Outcome
Support exact payer-aware estimates, immutable versions, partial/rejected/manual approval, supplementary scope, secure tokens, and atomic activation.

## Acceptance criteria
- [ ] Totals and payer allocations are exact; sent/approved versions are immutable and linked to revisions.
- [ ] Expiring single-use tokens safely record full/allowed-partial/reject/clarify outcomes and resist replay/tenant discovery; manual fallback requires complete evidence and policy.
- [ ] Additional work cannot activate without supplementary approval; activation snapshots configuration and creates no duplicate work/material under retries.

