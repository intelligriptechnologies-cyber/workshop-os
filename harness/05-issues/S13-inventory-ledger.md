# S13 — Inventory location, lot, remnant, transfer, and count ledger

Status: Approved  
Implements: R-050, R-051, R-052, R-053, R-054, R-055, R-056

## Outcome
Provide exact append-only warehouse inventory across UOMs, lots/expiry, rolls/remnants, transfers, and blind counts.

## Acceptance criteria
- [ ] Every receipt/move/cut/scrap/transfer/count adjustment conserves exact quantity/value and is traceable by location, lot/roll/remnant, source, actor, reason, and audit reference.
- [ ] Invalid UOM conversions, expired/status-blocked stock, unusable remnants, unauthorized location access, and concurrent overspend are rejected.
- [ ] Transfers avoid double counting; blind counts require frozen scope, recount/investigation, and approved compensating variance.

