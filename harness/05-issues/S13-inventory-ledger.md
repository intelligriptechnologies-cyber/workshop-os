# S13 — Inventory location, lot, remnant, transfer, and count ledger

Status: Complete
Implements: R-050, R-051, R-052, R-053, R-054, R-055, R-056

## Outcome
Provide exact append-only warehouse inventory across UOMs, lots/expiry, rolls/remnants, transfers, and blind counts.

## Acceptance criteria
- [x] Every receipt/move/cut/scrap/transfer/count adjustment conserves exact quantity/value and is traceable by location, lot/roll/remnant, source, actor, reason, and audit reference.
- [x] Invalid UOM conversions, expired/status-blocked stock, unusable remnants, unauthorized location access, and concurrent overspend are rejected.
- [x] Transfers avoid double counting; blind counts require frozen scope, recount/investigation, and approved compensating variance.

## Evidence

- `production/src/inventory-ledger.ts` exposes a tenant/branch/warehouse/bin-authorized `/api/v1` inventory seam. Items retain unique SKU/barcodes, category, base/stock/purchase/issue UOMs, exact rational conversions, costing/tax/reorder metadata, active state, and lot/batch/serial/roll/FEFO policy. Authoritative commands reject missing or conflicting idempotency, invalid precision/conversions, stale versions, unauthorized locations, inactive items, expired or blocked lots, and concurrent overspend.
- Receipts and reasoned non-Job withdrawals post append-only pairs whose quantity and minor-unit value sum exactly to zero. Every entry retains location, item, lot/remnant, source, actor, time, reason, and audit reference. FEFO requires an explicit retained exception reason when a later eligible lot is chosen. S15 retains ownership of Job/task material control.
- Roll receipt validates exact length × width area. Full-width cuts proportionally conserve exact area/value, move usable balance to a lineage-linked remnant, enforce minimum-use length, and require a separately reasoned scrap effect when the residual cannot be used.
- Transfers move stock from source location to in-transit and then destination without changing total stock. Dispatch and receipt require clean private evidence; partial receipt retains unresolved quantity/value in transit until an independent authorized checker resolves the discrepancy with separate evidence.
- Blind counts freeze an exact warehouse/bin/item/lot/remnant scope without revealing expected balances to counters. A mismatch requires recount, investigation evidence, and maker-checker approval; approval posts a balanced compensating count adjustment and releases the scope.
- `013_inventory_ledger.sql` persists scoped inventory masters, projections, balanced append-only ledgers, transfer/count evidence, and fingerprinted command receipts. All operational tables force RLS; deferred balance checks, exact `numeric(38,6)` quantities, atomic availability reservation, append-only triggers, and unique idempotency protect postings.
- Focused acceptance tests pass 7/7. Full production regression passes 89/89 with production typecheck; remaining gate evidence is recorded in the handoff.
