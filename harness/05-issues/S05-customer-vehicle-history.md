# S05 — Customer and vehicle identity

Status: Approved  
Implements: R-021, R-022, R-023, R-024, R-025

## Outcome
Deliver customer/contact and vehicle search, duplicate resolution, controlled merge, odometer/service data, and ownership history.

## Acceptance criteria
- [ ] Search/create/update surfaces flag exact and probable duplicates without leaking another tenant.
- [ ] A controlled merge preserves aliases, contacts, ownership/service history, and rejects conflicting canonical choices.
- [ ] Ownership changes do not rewrite historic jobs/payers; compensating merge recovery is permissioned and audited.

