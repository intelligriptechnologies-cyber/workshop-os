# 45 — Invoices, Payments and Financial Workflows

Date: 2026-10-22. Branch: `Prem-dev-fbb-Go21`. Starting HEAD: `26adbd91b9c6b4376f69cc22c354812a7613a804`. Approved frontend: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`.

## Result and scope

Integrated the existing invoice editor, invoice void actions, full-payment forms, Payment Received checklist action, receipts, gate passes and financial document snapshots with the existing FastAPI/PostgreSQL slice. Existing financial lists, outstanding balances, dashboard summaries, exports and document views use the PostgreSQL projection. Invoice audit events now come from PostgreSQL as well.

The user explicitly confirmed **preserve the approved full-payment workflow**. Payment amount remains the server-derived invoice total. No partial-payment allocation, write-off, refund, credit-note or replacement UI was invented. Historical Partial statuses and allocations remain unchanged. Supported adjustments are the existing unpaid invoice line/discount edits and eligible void actions.

No commit, push, production/staging deployment, source SQLite modification, volume reset, replacement seed or persistence retirement occurred. The pre-existing untracked `.scratch` files remain. AGENTS.md, Graft, requirements and reports 40–44 were reviewed. Existing backend regressions ran before implementation and after integration.

## Loaded records and historical reconciliation

No import was repeated. Development retains:

| Entity | Records |
|---|---:|
| Invoices | 52 |
| Invoice lines | 105 |
| Payments | 27 |
| Receipts / gate passes | 27 / 27 |
| Customers / vehicles / jobs | 121 / 132 / 145 |
| Estimates / estimate lines / media metadata | 144 / 144 / 289 |
| Suppliers / inventory items / purchase orders | 2 / 4 / 2 |

All 103 original development business/custody tables match the preserved import rehearsal, excluding only additive compatibility columns. Imported financial row values also match exactly in the disposable test database. All 51 historical subtotal discrepancies retain their original subtotals, tax, totals, payment allocations and statuses. Reconciliation reports identify them without corrections or balancing entries. All eight original SQLite copies and 94 baseline screenshots retain their hashes.

**Imported financial records remain read-only.** Edit, void and settlement attempts against them fail with an explicit historical-preservation error. This is intentional: the user did not authorize historical financial corrections. New invoices/payments are fully operational. This batch must not be described as authorization to settle or modify historical invoices.

The 67 custody quarantines remain untouched. The prior seven-row historical stock compatibility bridge remains intact; native-ledger consolidation is not part of this batch. Missing historical image/PDF bytes remain unavailable, rather than fabricated.

## Backend, database and financial guarantees

New `financial_workflows.py` mounts under `/api/v1/financial`, using the existing persistent sessions, CSRF checks, tenant/branch scope, restricted runtime role, transaction advisory lock, row locks, optimistic versions, actor-bound idempotency keys and audit history.

- Create/edit preserve the approved per-line rounding, proportional flat discount, final-line rounding remainder, mixed GST and No GST behavior. Existing TypeScript calculation code is unchanged. Invoice numbering retains preferred `INV-` + `(8900 + job ID)` with five-digit padding and collision rollover. Receipt/gate numbers retain their respective `RCT-`/`GP-` rules.
- Owner and linked Advisor invoice permissions are retained. Accounts can create for completed jobs and record full payment, but cannot edit financial lines. Owner can void eligible unpaid nonterminal invoices; Accounts voiding is restricted to the completed-job surface. Payment void remains Owner-only and rejected for CLOSED/CANCELLED jobs, matching the approved terminal guard.
- Existing lines retain identifiers when edited; removed lines are archived. Issued material claims are same-job, cannot be duplicated, and are released on line removal or invoice void. Invoicing does not post stock a second time.
- Payment, invoice clearing, receipt, gate pass, delivery fields, lifecycle history, completed/closed checklists and three frozen documents commit in one transaction. An invalid snapshot rolls back the payment and closure. The complete current checklist and Google review reminder remain mandatory. Missing historical checklist steps are never synthesized.
- Payment Received uses the same financial command, retaining the approved default Cash mode. Existing N/A/undo behavior changes checklist state only and does not invent a payment or close the job.
- Client amounts are not accepted. Duplicate same-key requests replay one result; changed payloads using the same key fail. Competing payment identities produce one winner. Stale invoice versions fail before posting. Payment preview numbers are rechecked under the transaction lock.
- The original renderer prepares document snapshots; the server validates and stores them transactionally. Pending invoice output remains live, cleared invoice/receipt/gate output is frozen, and invoice void retains its document. Templates and print layouts are unchanged.

Additive migration **`20261022_0047`** is applied to existing dev/test volumes. It adds explicit `slice_finance` flags, scoped native-record uniqueness, a database full-payment guard, audited editable-field guards, exact invoice quantity precision and narrow financial/closure grants. Imported-history guards remain active. Slice-native records may use the approved frontend document renderer instead of requiring the older backend's alternate financial-document template. Original native financial records remain immutable. There are no new application tables and no historical amount/status updates.

The older `backend/app/finance.py` and Cognito-oriented `src/finance-api.ts` remain preserved and unmounted in this slice. They must not be enabled against these new records without their own compatibility review.

## Files changed

Backend: new `backend/customer-slice/financial_workflows.py` and `versions/20261022_0047_financial_workflows.py`; updated `api.py`, `operations.py`, `operational-mapping.json` and slice README.

| Frontend file | Necessary change |
|---|---|
| `src/billing-api.ts` (new) | Dedicated financial commands, version checks, retry identity and original-renderer snapshot preparation. |
| `src/billing-manager.tsx` (protected) | Existing create/edit/void/payment handlers call the adapter and wait for committed data refresh. Existing error surfaces and modal controls remain. |
| `src/App.tsx` (protected) | Existing Payment Received checkbox uses the same backend payment path; preserve the existing closure notification after refreshed PostgreSQL state. |
| `src/db.ts` (protected) | Project and guard invoice events; exclude integrated financial data from serialized browser cache. |
| `src/operations-api.ts` | Attach invoice/payment versions and dispatch the existing closure notification integration event. |

The new cache is `workshopos.sqlite.financial-api.v1`. Prior stock/estimate/operations/original keys remain preserved. SQL.js is a memory projection for integrated data, not a competing authority. Financial writes fail closed after serialization; no silent fallback or dual write was introduced.

Only **three protected frontend files changed in this batch**: App.tsx, billing-manager.tsx and db.ts. Seven protected files differ from the approved baseline overall; document-snapshots.ts, job-sheet-ui.tsx, materials-ui.tsx and vite.config.ts are retained earlier integrations, not changes from this batch. No styles, forms, field order, labels, navigation, document templates or calculation functions were redesigned.

New verification: `test_financial_workflows.py`, `test_financial_materials.py`, `test_financial_database.py`, `financial_test_support.py`, `test_financial_browser.mjs`, `test_financial_edges_browser.mjs`, `test_financial_storage.mjs`, `test_financial_visual.mjs`, `compare_financial_visual.py`, `verify_financial_preservation.py`. Four existing customer/vehicle/estimate/stock browser tests only update the current-cache lookup; behavioral assertions are retained.

## Verification

All mutating verification targets `slice_test` and isolated browser contexts. Development is used for read-only preservation and visual comparison.

| Verification | Result |
|---|---:|
| Financial API, calculations, role/validation gates, historical preservation, retries/concurrency, atomic settlement and N/A behavior | 49 passed |
| Invoice/material association, failed-claim rollback, line removal and no duplicate stock consumption | 10 passed |
| Independent PostgreSQL history/identity/delete/payment/RLS guards | 11 passed |
| Shared approved TypeScript/Python calculation cases | 503 exact matches |
| Invoice editor, full settlement, independent Accounts session, frozen print/PDF browser checks | 18 passed |
| Existing invoice-void dialog and Payment Received checklist browser paths | 5 passed |
| Financial cache preservation and write guards | 32 passed |
| Session/document/media persistence across API restart, including financial snapshots | 4 passed |
| Authentication/customer / vehicle / intake-job / lifecycle API regressions | 42 / 13 / 24 / 4 passed |
| Estimate/document/media / approval API regressions | 53 / 19 passed |
| Purchase/stock / purchase/stock edge API regressions | 41 / 20 passed |
| Customer / vehicle / intake-job / role browser regressions | 25 / 8 / 14 / 8 passed |
| Estimate/media / approval / purchase-stock / job-stock browser regressions | 19 / 7 / 13 / 3 passed |
| TypeScript and production build | Passed; prior bundle warnings remain |
| Existing unit suite | **241 passed, 3 failed**, unchanged template-category assertions (expected 6, actual 8) |

The 42 shared API assertions are imported by several suites and are counted once. A regression fixture was exhausted during repeated approval tests; two fresh eligible jobs/material requests were created through APIs in `slice_test`, and the original assertions then passed. No data reset or assertion weakening occurred. Initial browser failures were stopped-frontend and locator assumptions; product UI was not changed to accommodate them. Disposable test-created records remain in their test database.

### Visual and document comparison

**12 of 15 captured states are pixel-identical** to the approved build. Accounts Delivery, Invoice and Payment differ by 10, 19 and 12 pixels respectively, with maximum channel difference 1, confined to rounded edges. These were visually inspected as rasterization variance; the strict zero-difference check is recorded as failing, and no baseline was replaced.

Compared states include invoice list/search/detail/view/editor, payment dialog/Other mode, payments and delivery lists, three Accounts screens, and three document outputs. Invoice, Payment Receipt and Gate Pass HTML compare byte-for-byte; their rendered document screenshots have zero differing pixels. Actual new-record Print and Download PDF actions also pass. Full responsive/all-role/all-control visual coverage is not claimed.

## Backups, limitations and stopping point

Pre-migration dev/test dumps remain under `backend/customer-slice/artifacts/pre-finance-20261022-122301/`. Rollback restores a checkpoint into a **separate** database and reconciles later audited writes; destructive downgrade is refused. No restore rehearsal is claimed.

Remaining limits:

1. Historical financial edits/settlements are blocked pending explicit correction policy/approval. All 51 discrepancies remain untouched.
2. Partial-payment entry, write-offs/refunds/credit notes are absent from the approved workflow and were not introduced. The user explicitly reaffirmed full settlement.
3. Standard full payment immediately closes the job, so subsequent payment voiding remains blocked by the approved terminal guard. No reopening workflow was invented. Dormant manual-delivery helpers were not exposed through new screens.
4. Historical quarantines, missing original artifact bytes, unintegrated task/booking writes, production authentication/provisioning decisions and local-persistence retirement remain prior boundaries.
5. The three baseline unit failures and tiny strict screenshot differences remain explicit. Production readiness and exhaustive regression coverage are not claimed.

No approved UI layout or workflow sequence was intentionally changed. The explicit financial-preservation boundary blocks imported-record writes rather than silently correcting them. Review the report and remaining limits before authorizing another module or any historical correction. **Stop after this implementation and verification batch; no deployment or persistence retirement is implied.**

Verification results are summarized above. The generated `stage6-financial-evidence.json.md` summary is retained locally and excluded from the Git checkpoint. Raw logs, reconciliation, browser output, HTML/PDF and screenshot comparisons are retained under ignored `backend/customer-slice/artifacts/` and are also excluded.
