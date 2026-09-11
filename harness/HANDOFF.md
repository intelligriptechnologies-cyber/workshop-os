# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S14<br>
Next slice: S15 — Material request, issue, consumption, return, waste, and reconciliation

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S14 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S12 establish the tenant-aware journey through technician task completion. S13 owns generic physical inventory and S14 now owns supplier/procurement commercial documents plus their exact S13 receipt/return boundary. S15 owns all Job/task-specific material control.

## S14 evidence

- `production/src/procurement-workflow.ts` derives tenant, branch, supplier, PO and warehouse authority from verified membership. Suppliers retain multiple contacts, tax identity/treatment, payment terms, registered/operational addresses, item relationships and controlled status. GSTIN/PAN/normalized-name duplicates are tenant-controlled; mutable supplier and draft document writes use versions.
- Requisition and PO draft lines are versioned and become immutable after submission. Exact six-decimal quantities and minor-unit line price, discount, GST, landed-cost, payable and inventory value remain distinct. Configurable thresholds, distinct maker-checker approval evidence, reasoned cancellation and partial fulfilment history are retained.
- GRN posting validates an approved remaining PO quantity, supplier document, received/rejected/accepted split, configured inspection, lot/roll, clean tenant-private documents and authorized location. It calls the S13 authoritative receipt exactly once per accepted line, retains rejected discrepancies separately, and uses PO-line reservations plus fingerprinted in-flight receipts to reject concurrent over-receipt and duplicate/reordered effects.
- Purchase returns reference eligible posted GRN stock including item/UOM/location/lot/remnant, reserve no more than the received remainder, require clean shipment evidence and independent approval, then create a compensating S13 stock movement plus expected-credit financial event. Posted history is never deleted.
- `014_procurement_workflow.sql` adds forced tenant/branch/warehouse RLS across 20 procurement tables, exact numeric and minor-unit constraints, composite scope FKs, tenant-unique supplier/document/idempotency controls, serialized PO-line locking, transactional S13 delegation, and append-only posting/evidence triggers.
- Focused S14 tests passed 7/7; the full production suite passed 96/96 and production typecheck passed. Final harness, demo build, Playwright, and diff results are recorded below. No deployment, provider enrollment, purchase order transmission, supplier/customer message, payment, or other external/production action occurred.

## Verification

- `npm run test:production`: 96/96 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 15 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed after final document normalization.

## S15 first action

Read S15, R-061 through R-063, D-005/D-009/D-010/D-012/D-018/D-021, and the S09/S11/S12/S13 contracts. Begin with a failing end-to-end material-reconciliation test proving that approved Job/task demand authorizes one exact Store issue and that the Job cannot reconcile until `Issued = Consumed + Verified Return + Wastage + Approved Variance`. Then add request/partial issue/substitution, technician consumption/waste, Store-verified physical return, manager threshold approval, scanning/evidence, concurrency and retry recovery.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production material source.
- Derive tenant/branch/Job/task/location authority from verified membership and force PostgreSQL RLS. Client identifiers never establish authority.
- S15 must call S13 postings idempotently and retain S14 procurement origins. It must not bypass exact UOM, lot/roll/remnant, FEFO, frozen-count, availability, audit, or append-only rules.
- Technician records consumption/waste, Store verifies returns, and Manager independently approves excess/variance above configured thresholds. Posted corrections use compensation, never mutation or deletion.
- After S15 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S15 and do not push.
