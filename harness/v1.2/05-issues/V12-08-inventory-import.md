# Deliver Inventory analytics and controlled import

Status: Planned  
Implements: V12-R015, V12-R016  
Blocked by: V12-03, V12-05

## Outcome

Migrate Inventory views and operational commands, then add a staged dry-run/commit import that reconciles without rewriting ledger history.

## Acceptance criteria

- [ ] Production analytics and lists expose authorized stock position, movement, ageing/reorder indicators, search, paging, and exports.
- [ ] Operational commands append valid ledger effects and cannot edit or delete prior stock-ledger entries.
- [ ] An import can be staged and dry-run without stock mutation; invalid rows appear in a downloadable error manifest.
- [ ] Explicit authorized commit is idempotent and its reconciliation totals equal the committed ledger effects.

## Evidence

Pending.

