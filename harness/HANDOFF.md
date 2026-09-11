# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S13<br>
Next slice: S14 — Supplier, requisition, PO, GRN, and purchase-return workflow

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S13 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S12 establish the tenant-aware journey through technician task completion. S13 now owns the generic physical inventory ledger and location/lot/roll/transfer/count controls; Job material control remains S15, procurement documents remain S14, and independent QC remains S16.

## S13 evidence

- `production/src/inventory-ledger.ts` derives tenant, branch, warehouse, and bin authority from membership. Its item contract retains category, unique SKU/barcodes, base/stock/purchase/issue UOMs, exact conversion ratios, costing/tax/reorder metadata, active state, and lot/batch/serial/roll plus FEFO policy.
- Authorized receipts and reasoned generic withdrawals create exact balanced append-only quantity/value pairs with source, location, lot/remnant, actor, time, reason, audit, version, and tenant-scoped idempotency. Invalid precision/UOM, inactive item, expired/status-blocked lot, unauthorized location, changed-payload replay, and concurrent overspend fail before effects. Reasoned FEFO exceptions remain visible in ledger evidence.
- Roll stock validates exact area at receipt. Cuts retain parent/root lineage, proportionally allocate value, produce usable remnants only above the configured minimum, and record below-minimum residual as separately reasoned scrap without losing conservation.
- Stock transfers progress READY → IN_TRANSIT → RECEIVED or RECEIPT_DISCREPANCY. Dispatch, receipt, and discrepancy resolution preserve separate clean private evidence. Partial receipts keep missing quantity/value in transit until a distinct authorized checker returns it to source, so total stock is never double counted.
- Blind counts freeze a warehouse/bin/item/lot/remnant snapshot while hiding expected quantities from counting responses and blocking scoped movement. Mismatch requires recount, investigation evidence, and a distinct checker; approval posts a balanced compensating entry and preserves both observations and the approval chain.
- `013_inventory_ledger.sql` adds forced tenant/branch/warehouse RLS across inventory masters, projections, ledgers, transfers, counts, evidence, and command receipts. It uses exact numeric quantities, deferred quantity/value balance enforcement, atomic conditional availability reservation, scoped FKs, append-only evidence triggers, and unique fingerprinted idempotency.
- Focused S13 tests passed 7/7; the full production suite passed 89/89 and production typecheck passed. Final harness, demo build, Playwright, and diff results are recorded below. No deployment, provider enrollment, customer message, procurement posting, Job material posting, or other external/production action occurred.

## Verification

- `npm run test:production`: 89/89 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 14 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S14 first action

Read S14, R-057 through R-060, D-005/D-007/D-012/D-018/D-021/D-022, and the S13 posting contract. Begin with a failing GRN test proving one approved PO line can be partially received with inspection, lot/roll and discrepancy evidence and post its exact stock/value effect once. Then add supplier identity/duplicates, requisition/PO versioning and approval, landed cost, partial fulfilment/cancellation, and compensating purchase return.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production inventory or procurement source.
- Derive tenant/branch/supplier/location authority from verified membership and force PostgreSQL RLS. Client identifiers never establish authority.
- S14 owns procurement commercial documents and calls the S13 authoritative posting boundary idempotently. It must not bypass exact UOM, lot/roll, frozen-count, availability, audit, or append-only rules.
- S15 continues to own Job/task request, issue, consumption, return, waste, variance, and reconciliation; do not fold that flow into procurement.
- After S14 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S14 and do not push.
