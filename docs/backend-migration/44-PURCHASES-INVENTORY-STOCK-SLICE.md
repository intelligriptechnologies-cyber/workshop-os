# 44 - Purchases, Inventory and Stock PostgreSQL integration

Date: 2026-10-22. Branch: `Prem-dev-fbb-Go21`; HEAD remains `ac687e81e984b81e67b27c05f0329e65fba7b886`. Approved UI reference: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`.

## Result

Implemented the existing supplier, purchase-request/order, delivery/confirmation/closure, inventory master, stock, job-material and receipt/revision commands in the isolated FastAPI/PostgreSQL slice. Existing controls call a dedicated adapter. No screens, navigation, styles, labels or approved calculation functions were replaced. No commit, push, production/staging deployment, original SQLite modification or volume reset occurred. Previous uncommitted work remains present.

The reachable supplier, PO/new-SKU, inventory-edit and job-request/release workflows pass browser tests. Backend tests also cover manual stock adjustments, supplier splits, inward receipts/revisions and durable invoice scans. Full acceptance has the explicit historical-native-ledger and dormant-screen limits below; this is not a production or persistence-retirement signoff.

AGENTS.md, migration documentation/reports 40-43 and Graft were consulted before implementation. Completed-module checks ran before changes and regression suites ran afterward. Changes were scoped to the existing slice, versioned migrations, data adapters and existing handlers. Tests use `slice_test` and isolated browser contexts; development/source records were not used as destructive fixtures.

## Records loaded and stock reconciliation

No repeat import or replacement seed was performed. Development APIs now expose the preserved PostgreSQL records:

| Entity | Records |
|---|---:|
| Suppliers / inventory items | 2 / 4 |
| Purchase orders / order lines | 2 / 3 |
| Delivery receipts / receipt lines / confirmations | 2 / 3 / 3 |
| Supplier quotations | 3 |
| Job material requests / material events | 117 / 1 |
| Existing material movements | 3 |
| Historical signed stock ledger / stock inwards, compatibility projection | 4 / 3 |
| Inward-purchase records | 0; none fabricated |

All **103 original development business/custody tables retain their original row values**. Comparison excludes only newly added nullable compatibility columns, separately introduced by migrations. All eight original SQLite copies and 94 baseline screenshots retain their hashes. Previously integrated development counts remain 121 customers, 132 vehicles, 145 jobs, 144 estimates, 144 estimate lines and 289 media metadata records. Financial and custody records are unchanged.

The four source balances reconcile exactly using the approved rule, opening quantity minus signed outward ledger:

| Source inventory ID | On hand |
|---|---:|
| 1 | 500 |
| 2 | 79 |
| 3 | 60 |
| 4 | 3 |

### Seven historical stock records

All seven rows have deterministic compatibility mappings. `slice_historical_stock` stores their exact decoded source fields and source SHA/table/key, with immutable scoped read access. Their original IDs, quantities/signs, zero sentinels, text timestamps, actor references, PO links and job/material links are retained. The four signed ledger rows and three inward rows compare exactly with the untouched SQLite source. The API projects these rows alongside new native records; new IDs start beyond the historical range.

**No stock event was replayed, no opening balance changed, and no native actor UUID, timezone or valuation was invented.** The original custody records remain quarantined and unchanged: total custody quarantine is still 67. Seven are now usable through this verified PostgreSQL compatibility representation, not falsely reported as native ledger promotion. Full native-ledger consolidation remains pending an explicit historical audit/valuation representation. Other unintegrated native services must not assume that `sum(stock_ledger.quantity)` alone represents opening/history stock; the integrated slice includes opening quantities and this bridge.

## Transactions, calculations and permissions

- Store creates/amends/cancels its unreviewed requests. Admin performs commercial approval, supplier splits, SKU creation, issue, receipt, confirmation and closure. Supplier administration remains Admin-only. Existing Store inventory edits and job release permissions are retained.
- Delivery records physical receipt without posting inventory. Confirmation accounts for accepted, returned, damaged and wasted quantities. Closure atomically posts **accepted quantities only** and closes the PO. Repeat closure cannot repost stock.
- New SKU approval starts at zero stock. Numbering retains `PO-WOS-<letters>-<five digits>`, including rollover after 99,999. Split orders retain their source request/line references; replaced lines are archived rather than erasing history.
- Job Draft ? Requested/Re-requested ? Issued behavior, approval HOLD gates, issued-row edits and reconciliation use scoped server commands. Release reduces stock; returned-quantity changes reverse only the delta. Stock cannot go negative. Cancellation of an unissued request changes no stock; legacy PO cancellation cancels the remaining commitment and does not invent a reversal of previously received goods.
- The approved UI permits over-stock requests and allocates demand for display; it does **not** make a hard reservation at request time. That behavior is retained. Availability is locked and checked at actual release; no alternative reservation screen or invented reservation deduction was added.
- Inward receipt posting, associated lines/files, stock updates and events share a transaction. Admin receipt revisions preserve original receipt lines and record delta movements. An unsafe return/revision rolls back its entire transaction. Repeated legacy item lines in a revision require review rather than silently applying the old ambiguous per-item calculation.
- Mutations use the existing tenant transaction advisory lock, row locks, optimistic versions and actor-bound idempotency keys. The database ledger guard independently locks the item and rejects negative stock. Ledger writes also advance the item version, protecting absolute stock adjustments from stale clients. This deliberately prioritizes correctness over high-throughput parallel posting.
- Fractional quantities are retained without inherited three-decimal rounding. A 0.1234567 stock-in case is verified. Purchase discount/tax arithmetic remains the approved unrounded line calculation; existing estimate math is unchanged.
- New PDF/JPG receipt scans are validated and stored as immutable PostgreSQL bytes with authenticated branch-scoped retrieval. No uploaded scan is authoritative only in browser memory. Historical files are not fabricated.

Migrations `20261022_0045` and `20261022_0046` are applied to dev/test. They add narrow audited write grants, draft-compatible nullable supplier/item references, archived replacement lines, the immutable historical stock bridge and receipt-file storage, and compatible ledger precision/negative-stock enforcement. Existing native history remains protected.

## Files changed in this batch

Backend: new `backend/customer-slice/purchase_stock.py`, `versions/20261022_0045_purchase_stock.py`, `versions/20261022_0046_stock_precision.py`; updated `api.py`, `operations.py`, `operational-mapping.json` and slice README.

Frontend integration:

| File | Reason |
|---|---|
| `src/stock-api.ts` (new) | Dedicated command adapter using existing authentication, idempotency and refresh handling. |
| `src/App.tsx` (protected) | Minimal async branches in existing supplier/PO/stock/material/receipt handlers; existing controls retained. |
| `src/materials-ui.tsx` (protected) | Existing add/request/edit/cancel/delete/new-item handlers use PostgreSQL; existing error surfaces retained. |
| `src/db.ts` (protected) | Read-only purchase/stock projections and cache exclusion; preserve previous browser snapshots under their original keys. |
| `src/operations-api.ts` | Attach server versions to projected masters and job material rows. |

The new cache key is `workshopos.sqlite.stock-api.v1`. Operations/estimates/original keys are retained. Integrated rows are excluded from serialized browser caches and local writes fail closed after SQL.js export. No SQLite fallback or dual write was added.

New verification: `test_purchase_stock.py`, `test_purchase_stock_edges.py`, `test_stock_browser.mjs`, `test_stock_job_browser.mjs`, `test_stock_storage.mjs`, `test_stock_visual.mjs`, `compare_stock_visual.py`, `verify_stock_preservation.py`. Customer/vehicle/estimate-storage tests only update the current-cache lookup; their existing behavior assertions remain intact. Documentation: this report, migration/slice READMEs and `stage6-stock-evidence.json.md`. Earlier estimate/media files remain from the previous batch; they were not recreated.

## Tests and visual results

| Executed verification | Final result |
|---|---|
| Purchase/stock transaction API | 41 passed |
| Splits, quotations, numbering, permissions, fractional-stock edge API | 20 passed |
| Supplier/PO/new-SKU/receipt/stock-edit browser | 13 passed |
| Job request and Store release browser | 3 passed |
| Storage preservation and write guards | 30 passed |
| Auth/customer / vehicle / intake-job / lifecycle API regressions | 42 / 13 / 24 / 4 passed |
| Estimate/document/media / material-approval API regressions | 53 / 19 passed |
| Customer / vehicle / intake-job / role browser regressions | 25 / 8 / 14 / 8 passed |
| Estimate/document/media / approval browser regressions | 19 / 7 passed |
| Persistent session/document/media after API restart | 4 passed |
| TypeScript / production build / diff whitespace checks | Passed |
| Existing unit suite | **241 passed, 3 failed**, same pre-existing report-template count assertions: expected 6, actual 8 |

The shared 42 API assertions are counted once, not again for each feature-suite import. Concurrency tests verify one winner for competing releases, nonnegative final balance, concurrent same-key inward replay with one posting, and payload/key conflict rejection. Receipt retries, duplicate issue, over-delivery, stale stock versions and failed-revision rollback are covered. Independent sessions verify records and invoice bytes. There are no unresolved new test failures in the final runs; initial schema/locator/startup failures were investigated and corrected or rerun, not hidden by changing product behavior.

**Visual comparison: 9 states have zero differing pixels.** The Store inventory list has 59 differing pixels, maximum channel difference 1, recorded as minor rasterization variance rather than an updated baseline. Captured states cover supplier list/add/edit, purchase list/request form, stock search/list/low-stock, stock edit and movement history. A missing general-stock movement projection was found by comparison and fixed by mapping absent job links to the renderer's existing zero sentinel; stored data was unchanged. No approved appearance or workflow sequence was intentionally changed. Full responsive/all-role/all-control visual coverage is not claimed.

## Remaining limits and stopping point

1. Seven original stock rows remain in custody quarantine while their exact compatibility projection supplies authoritative history/balances. Native ledger consolidation and persistence retirement are not complete.
2. Standalone `InwardPurchasesWorkspace` and `InventoryMaterialsManager` exist in approved source but have no mounted callers. Receipt/revision/absolute-adjustment service paths and existing handlers are implemented and API-tested; no new route was introduced to expose dormant forms. Browser coverage is limited to reachable approved screens. Legacy direct free-text purchase/stock/issue remains disabled as in the approved application; unrelated financial/task writes remain blocked.
3. The three old template unit failures, other historical quarantine, unavailable historical media/PDF bytes and prior financial discrepancies remain. No silent correction occurred.
4. Real pre-existing user browser profiles were not modified; preservation was tested in isolated profiles. This local fixture environment is not a production deployment.

Backups and pre-batch copies remain under ignored `backend/customer-slice/artifacts/pre-stock-20261022-105741/`. Rollback must restore a checkpoint into a **separate** database and reconcile later audited writes; destructive downgrades are refused. No restore rehearsal is claimed. Raw logs/screenshots/JSON are in `backend/customer-slice/artifacts/`; a credential-free summary is in [stock evidence](stage6-stock-evidence.json.md).

This implementation/verification batch stops here. Review the explicit limits before authorizing native-history consolidation, dormant-screen routing changes or another module.
