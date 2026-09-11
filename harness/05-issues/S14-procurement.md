# S14 — Supplier and procurement workflow

Status: Complete
Implements: R-057, R-058, R-059, R-060

## Outcome
Manage suppliers, requisitions, POs, GRNs, landed cost, discrepancies, partials, and purchase returns.

## Acceptance criteria
- [x] Supplier duplicates/status/tax/terms are controlled; requisition and PO versions follow thresholds and retain cancellation/partial history.
- [x] Idempotent GRN posts accepted lots/rolls/value once and preserves rejected/discrepant evidence.
- [x] Purchase returns reference eligible receipt stock and create approved compensating stock/value entries without destructive edits.

## Evidence

- `production/src/procurement-workflow.ts` exposes a membership-derived tenant/branch procurement seam. Supplier masters retain contacts, registered/billing/shipping addresses, GST/PAN/tax treatment, terms, currency, item relationships, active/hold/inactive state, normalized duplicate controls, optimistic versions, and immutable history snapshots.
- Requisitions and POs preserve versioned draft lines, exact six-decimal quantities, minor-unit prices/discount/GST/landed-cost allocations, configurable approval thresholds, distinct maker-checker evidence, partial fulfilment, reasoned partial/full cancellation, immutable submitted commercial state, fingerprinted idempotency, and stale-write rejection.
- An inspected GRN validates its approved PO remainder, supplier document, clean tenant-private evidence, received/rejected/accepted quantities, lot/roll and warehouse authority before calling the S13 receipt boundary exactly once per accepted line. Exact taxable, GST, landed, and inventory values are prorated; rejected quantity creates a separately resolvable discrepancy without entering stock. PO-line reservations serialize concurrent GRNs and prevent over-receipt.
- Purchase returns can reserve only eligible received stock by GRN line, item, UOM, warehouse, lot/remnant and remaining quantity. Independent authorization posts one compensating S13 withdrawal and an append-only expected-credit financial event; retry/reordering cannot duplicate either effect and no posted record is deleted.
- `014_procurement_workflow.sql` persists tenant-keyed suppliers, contacts/addresses/items, current and historical requisition/PO lines, approvals, GRNs/documents/inspection/discrepancies, returns/shipment evidence, procurement history/financial events, and fingerprinted command receipts. All 20 tables force RLS. Exact checks, composite foreign keys, append-only triggers, unique supplier documents, row locking and the transactional S13 posting call protect the invariants.
- Focused S14 acceptance tests pass 7/7. Full production regression passes 96/96 and production typecheck passes; remaining gate evidence is recorded in the handoff.
