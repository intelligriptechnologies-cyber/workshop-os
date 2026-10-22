# 18 - Backend parity and test baseline matrix

Stage 1.6, 2026-10-21. The approved **local** application is the provisional reference. These are proposed acceptance tests, not implemented or executed tests. No existing frontend/backend/test/database/configuration was changed. Candidate means the 152-route source pinned in [16](16-BACKEND-BASELINE-RECONCILIATION.md), not the older109-route checkout. Known differences are separated from unresolved equivalence and source-data ambiguity.

Each PAR identifier carries an AT identifier with the same number. Link exact local fields/validations through the OP/WF/ACT evidence in 03/06 rather than inferring new forms from backend endpoints. Tests must preserve approval/state/role errors and navigation, not merely compare final row counts. Every integration acceptance scenario runs in ADR-09's later approved disposable environment.

## Parity acceptance register

### PAR-01 / AT-01 - UI selection and async command completion

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local approved components use synchronous mutate boolean; auth-mode routing selects alternate remote workspaces and mixed local/remote ownership.
- **Evidence:** App RoleWorkspace; 06; 12/16.
- **Migration acceptance test:** For each existing save/cancel command, inject pending, success, validation, permission and network failure. Same fields/dialog/navigation remain; failed save retains draft; success closes only after commit; no duplicate submit or new page. Compare matching role/state screenshots.
- **Approval / gate:** ADR-03; all UI integration.

### PAR-02 / AT-02 - Invoice discount and tax arithmetic

- **Status:** REPRODUCED DIFFERENCE.
- **Difference / risk:** Local proportional flat discount versus candidate finance first-line discount allocation. Unit-rate rounding order also differs.
- **Evidence:** invoice-math:23-45; finance:239-266; financial probe.
- **Migration acceptance test:** Two quantity-1 INR100 lines at GST18/0 with INR100 discount must yield local line discounts50/50, tax9, total109; candidate currently returns100. Extend golden cases to fractional quantities/rates, zero/excess discounts and rounding boundaries.
- **Approval / gate:** FIN-02; blocks financial posting.

### PAR-03 / AT-03 - Historic invoice header/line disagreement

- **Status:** VERIFIED DATA AMBIGUITY.
- **Difference / risk:** 51 raw invoice headers differ from sum(qty*rate); neither source header nor recomputation can be silently declared correct.
- **Evidence:** stage16-legacy-invoice-discrepancies.json.md; importer diagnostics.
- **Migration acceptance test:** For all52 invoices retain original header,105 lines and provenance. Approval chooses expected operational/display totals and settled/unpaid treatment. Reconcile every exception; retry/import may not silently normalize or overwrite original values.
- **Approval / gate:** FIN-01; blocks financial import acceptance.

### PAR-04 / AT-04 - GST type, money precision and currency

- **Status:** KNOWN POLICY DIFFERENCE / EDGE CASES UNVERIFIED.
- **Difference / risk:** Local line GST type/rate versus backend branch/customer-state split selection; paise and decimal conversion may alter fractional behavior.
- **Evidence:** invoice-math; finance.issue_invoice; 05 date/money contracts.
- **Migration acceptance test:** Approve per-line CGST+SGST and IGST cases, missing state, odd-paise split, fractional rates/quantities and all configured currency cases actually supported. Assert stored lines/header, displayed totals and PDF values agree with chosen local examples.
- **Approval / gate:** FIN-02; do not infer legal correctness.

### PAR-05 / AT-05 - Payment posting and delivery closure

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local one full payment requires completed job/reminder and creates receipt, gate pass, acknowledgement, CLOSED atomically. Candidate accepts partial amounts and separates handover.
- **Evidence:** db.recordPayment:6384-6530; finance.record_payment/complete_handover.
- **Migration acceptance test:** Completed eligible job: one approved UI action yields full settlement, one receipt/gatepass/ack and CLOSED. Missing reminder/ineligible status/active payment rejects unchanged. Fail each write step: no partial effects. Concurrent identical retries return same result.
- **Approval / gate:** ADR-07/FIN-03; blocks payment integration.

### PAR-06 / AT-06 - Voids, refunds, credits and replacements

- **Status:** KNOWN DIFFERENCE / POLICY AMBIGUITY.
- **Difference / risk:** Backend exposes credit/refund/correction operations beyond approved local terminal restrictions; stale browser payment test assumes job stays open.
- **Evidence:** 13 TX-05; 15A VFA document flow; billing-domain tests.
- **Migration acceptance test:** Exercise local allowed/forbidden void states, reasons and replacement linkage; preserve immutable originals. Forbidden terminal correction returns existing UI error and no ledger change. No new partial/refund forms. Approved new policy would require separate scope.
- **Approval / gate:** FIN-03; blocks correction acceptance.

### PAR-07 / AT-07 - Invoice claims and approved versus current estimate

- **Status:** PARTIAL IMPLEMENTATION / PARITY UNVERIFIED.
- **Difference / risk:** Backend immutable approved-estimate snapshot/active claims differs from local selected service/material lines and invoiced-row linkage.
- **Evidence:** invoice-math.buildInvoiceDraft; finance.issue_invoice; TX-03.
- **Migration acceptance test:** Create invoice from same eligible job, service lines and issued unbilled material rows; warn/exclude unissued rows exactly as local. Concurrent invoice creation cannot claim material twice. Void/replacement follows approved history and actor rules.
- **Approval / gate:** ADR-07; blocks invoice command.

### PAR-08 / AT-08 - Document/request numbering

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local number conventions and existing PO numbers versus backend fiscal sequences and supplier-suffixed request-derived POs.
- **Evidence:** finance._allocate_number; procurement.approve; 15A PO tests.
- **Migration acceptance test:** Import leaves all displayed numbers intact. Next PO after00001/00002 is approved next number, not forced00001. Concurrent new documents allocate unique approved-format numbers; replay returns same number. Specify fiscal rollover and acceptable gaps.
- **Approval / gate:** FIN-04; blocks numbering sign-off.

### PAR-09 / AT-09 - Material request versus reservation/shortage

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local draft/request/re-request can express shortages; candidate reservation requires approved job and available stock, separate shortage endpoint.
- **Evidence:** materials.create_reservation/create_material_shortage; local material contracts.
- **Migration acceptance test:** Request quantity exceeding stock through existing form must preserve local warning, draft/request status and procurement handoff; no premature reservation rejection. Map demand/reservation explicitly without extra user steps. Test empty stock/new item/re-request/cancel.
- **Approval / gate:** ADR-03/07; blocks materials.

### PAR-10 / AT-10 - Issue, consume, return, waste and reapproval

- **Status:** PARTIAL IMPLEMENTATION / PARITY UNVERIFIED.
- **Difference / risk:** Candidate ledger commands and active-job gates do not prove equivalence to local issued/edit/reapproval/invoiced-row rules.
- **Evidence:** materials.material_command; local material helpers; TX-06/07.
- **Migration acceptance test:** Replay all local quantity bounds, zero-return acknowledgement, required note and invoice locks. Two issuers cannot overdraw; return/waste/reversal never duplicate stock or exceed issued quantity. Preserve state badges and existing edit navigation.
- **Approval / gate:** ADR-07; blocks stock integrity.

### PAR-11 / AT-11 - Supplier quote prerequisite and request approval

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local approval needs active supplier and positive pre-GST price, quotations optional; candidate approve requires matching saved quote.
- **Evidence:** db.approvePurchaseRequestForActor; procurement.approve:121-146.
- **Migration acceptance test:** Approve an eligible existing/new-item request without saved quotation using valid supplier/price: same approved outcome as local. New SKU starts at zero; duplicate SKU/invalid price rejects atomically. A matching quote remains supported but not mandatory unless separately approved.
- **Approval / gate:** ADR-07; no silent stricter validation.

### PAR-12 / AT-12 - PO split, issue and visible status mapping

- **Status:** KNOWN REPRESENTATION DIFFERENCE.
- **Difference / risk:** Local PO Request/Approved/Issued workflow retains/splits orders; backend separate REQUESTED/APPROVED/ISSUED request plus DRAFT/SENT orders and request-number supplier suffix.
- **Evidence:** local approval/issue contracts; procurement.approve/command.
- **Migration acceptance test:** Multi-supplier approval preserves local grouping, parent/source links, visible statuses, Supplier Basket and numbering. Issue only eligible approved lines; Store cannot approve. Failed split creates no partial SKU/order/request status.
- **Approval / gate:** ADR-02/03/07; blocks procurement.

### PAR-13 / AT-13 - Delivery receipt, confirmation and stock on closure

- **Status:** OLDER CHECKOUT GAP; CANDIDATE PARTIALLY ALIGNED.
- **Difference / risk:** Candidate now locks receipts/confirmations and posts accepted stock on close; older109-route backend lacked this. Direct inward and no-delivery close paths remain separate risks.
- **Evidence:** inventory:333-449; migrations0024/0025; db.closePurchaseOrder.
- **Migration acceptance test:** Order10: receive6 then4; confirm accepted8/rejected2 with reason; stock stays unchanged until close then rises8 once. Incomplete/overdelivery/duplicate lines fail. Repeat close/receipt/confirmation does not repost. Prove Store cannot bypass via direct inward or close an ineligible order.
- **Approval / gate:** ADR-07; blocks stock cutover.

### PAR-14 / AT-14 - Job lifecycle and actor/status checks

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Backend manager/advisor ownership and completion prerequisites differ from local owner/linked-service rules; start-work may require branch approval.
- **Evidence:** jobs._assert_job_actor/_completion_prerequisites/command_job; 04.
- **Migration acceptance test:** For every local transition edge and forbidden edge test all seven roles, linked/unlinked actors, note requirements and statuses. Same actions visible and same acceptance/error. Two concurrent transitions cannot overwrite stale status. Do not adopt extra completion gates by default.
- **Approval / gate:** ADR-04/07; affected contract clarification.

### PAR-15 / AT-15 - Task/QC/rework semantics

- **Status:** PARTIAL IMPLEMENTATION / PARITY UNVERIFIED.
- **Difference / risk:** Candidate QC failure creates a Rework task and pass checks outstanding Rework tasks; local checklist cycles/status transitions need exact mapping.
- **Evidence:** execution.record_remote_qc_result; checklists; 03; 15A gaps.
- **Migration acceptance test:** Assigned technician completes task, records work, fails QC, performs approved rework then passes. Verify cycle/task/status history and permissions match local, including optional/required checks; rollback leaves no half-created cycle/task.
- **Approval / gate:** ADR-03/07; no navigation-only acceptance.

### PAR-16 / AT-16 - Booking range/capacity/check-in

- **Status:** KNOWN TEST DRIFT; BACKEND PARITY UNVERIFIED.
- **Difference / risk:** Local tomorrow through current month+3 versus stale two-complete-month test; candidate booking services not browser-certified.
- **Evidence:** advanceBookingRange; candidate intake booking handlers; 15A.
- **Migration acceptance test:** Pin local2026-10-21: minOct22,maxJan31, initialOct. Test complete booking/confirm/reschedule/cancel/no-show/check-in, service-type capacity and Admin override. Competing final-slot/check-in requests yield no excess booking or duplicate job.
- **Approval / gate:** ADR-02/07; preserve current provisional range.

### PAR-17 / AT-17 - Intake/entity identity and duplicate rules

- **Status:** PARITY UNVERIFIED.
- **Difference / risk:** Remote tenant/branch entities and numeric IDs versus local linked customer/vehicle/visit/job commands; fixture customer absent caused timeout.
- **Evidence:** intake handlers; WF intake; 15A VFA-004.
- **Migration acceptance test:** Use approved deterministic existing/new customer and vehicle fixtures. Save once produces linked records, survives reload and Search; duplicate/invalid fields reject atomically with current messages. Repeating request creates no second visit/job.
- **Approval / gate:** ADR-03/05; blocks intake acceptance.

### PAR-18 / AT-18 - Follow-ups, search and date/visibility filters

- **Status:** PARITY UNVERIFIED / TEST PRECONDITION DRIFT.
- **Difference / risk:** Remote views exist; local assigned-job search/filter defaults and contact resolution must remain. First-page fixed identity assertions failed.
- **Evidence:** remote-followups; local service-advisor; 15A.
- **Migration acceptance test:** Search target stable ID before assertions; compare scope, ordering, totals and pagination in all categories. Add unresolved contact then resolve it and verify earlier open contact behavior, local date/month defaults and permissions after reload.
- **Approval / gate:** ADR-03/04; no role visibility drift.

### PAR-19 / AT-19 - Media content validation and persistence

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local verifies decoded signatures/size but strips persisted uploads; candidate durable data URL regex/character bound is weaker and different.
- **Evidence:** job-media.validateMediaDataUrl; db.exportPersistableDatabase; media.create_media.
- **Migration acceptance test:** Reject corrupt signature/oversize/unsupported content with matching UX; valid compressed image previews/edits/archives and reloads per approved durability policy. Restore bytes and metadata; staged-upload failure leaves no visible broken reference.
- **Approval / gate:** ADR-08 retention approval.

### PAR-20 / AT-20 - Media job ownership and phase authorization

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Candidate page.media grants lack local owner/linked advisor and NEW before-work versus IN_PROGRESS/COMPLETED after-work restrictions.
- **Evidence:** db.assertJobMediaMutationAccess; media._require/create/update/archive.
- **Migration acceptance test:** For seven roles and linked/unlinked actors test Before Work atNEW and After Work atIN_PROGRESS/COMPLETED; deny all forbidden status/ownership edits at API even with page grant. Read-only views remain available per local contract.
- **Approval / gate:** ADR-04; blocks media integration.

### PAR-21 / AT-21 - Frozen document rendering/download/print

- **Status:** KNOWN DIFFERENCE.
- **Difference / risk:** Local templated HTML/assets/snapshot history versus finance generic escaped JSON HTML; backend snapshots do not reproduce layout.
- **Evidence:** document-snapshots; report-templates; finance._render_html.
- **Migration acceptance test:** Approve estimate, invoice, receipt and gatepass; compare rendered output/layout/content against approved template. Change company/template afterward: historic output unchanged. Test PDF, print, blocked popup and void watermark/history without recreating UI.
- **Approval / gate:** ADR-08; blocks document acceptance.

### PAR-22 / AT-22 - Templates, theme, settings and active defaults

- **Status:** KNOWN STORAGE DIFFERENCE / TEST DRIFT.
- **Difference / risk:** SessionStorage settings/8 defaults versus partial tenant settings/theme endpoints; three tests expect6.
- **Evidence:** admin-demo-state; main tenant/theme routes;14.
- **Migration acceptance test:** Eight template identities, six active categories, two inactive quotation variants; add =>9 and original unchanged. Hydration, activation, per-tenant settings and restored assets preserve defaults/current customization across sessions.
- **Approval / gate:** ADR-02/08; future test-only correction.

### PAR-23 / AT-23 - Authentication, identity and RBAC

- **Status:** KNOWN MODE/IDENTITY DIFFERENCE.
- **Difference / risk:** Local login/users versus candidate database cookies/tenant memberships or Cognito; manager and support behavior not equivalent.
- **Evidence:** database_auth/auth;04;16.
- **Migration acceptance test:** Same approved login/navigation; verify expiry/logout/revocation/CSRF, owner/advisor/manager/tech/store/accounts/reception grants, custom grants, read-only suspension and cross-tenant denial. No real provider invitations in test.
- **Approval / gate:** ADR-04 explicit auth choice.

### PAR-24 / AT-24 - Import archive-only history and live browser data

- **Status:** KNOWN MAPPING GAP / UNKNOWN DATA.
- **Difference / risk:** Candidate rehearsal archives16 rows rather than operational mapping; browser-only records/settings/images unknown; alternative copies conflict.
- **Evidence:** 16 REC-07;10/11; importer rehearsal.
- **Migration acceptance test:** All60 source tables reconciled by stable mapping, hashes and approved historical queries. Archived movements/quotes/events remain accessible where approved UI reads them. Browser exports reconciled separately; no conflicting ID auto-merge; repeat import no-op.
- **Approval / gate:** ADR-05/06; blocks preservation claim.

### PAR-25 / AT-25 - Transaction retries, concurrency and stale writes

- **Status:** KNOWN RISK; NOT LOAD-TESTED.
- **Difference / risk:** Browser whole-snapshot last writer versus server locks/unique keys; payment/handover/job stale-read races identified.
- **Evidence:** 13 CONCUR-01; candidate services.
- **Migration acceptance test:** Inject response loss after commit then retry same key, competing actors and failure at every write boundary. Exactly-once business effect, deterministic replay, no lost status/stock/money; changed request payload with reused key has explicit behavior.
- **Approval / gate:** ADR-07/09; blocks multi-user acceptance.

### PAR-26 / AT-26 - Dates, sorting, pagination and exports

- **Status:** KNOWN TEST/FIXTURE DRIFT; PARITY UNVERIFIED.
- **Difference / risk:** Default month filters hide fixed fixture rows; DOM count assertions differ from source/control counts; remote serialization may shift date boundaries.
- **Evidence:** 05;15A; list-utils and API projections.
- **Migration acceptance test:** Pin clock/timezone; compare date-only and instant fields across local midnight/month/year. Existing Clear/filter/search/page/view state and export current rows/columns remain identical; absent rows are not fabricated to satisfy counts.
- **Approval / gate:** ADR-02/03/09.

### PAR-27 / AT-27 - Notifications and developer/support simulation

- **Status:** SCOPE DIFFERENCE / UNVERIFIED.
- **Difference / risk:** Local notifications/developer billing are simulations; backend platform operations and database-mode support restrictions are real/different.
- **Evidence:** 08; developer-control-plane; auth tenant_scope.
- **Migration acceptance test:** Preserve approved simulated behavior unless real integrations separately approved. No unintended email/billing sends. Read-only support cannot mutate; platform controls cannot confer workshop access implicitly.
- **Approval / gate:** ADR-04 and separate external-service scope.

### PAR-28 / AT-28 - Deployment, stale assets and offline boundaries

- **Status:** KNOWN CONFIG DIFFERENCE.
- **Difference / risk:** Checkout static auth/frontend-only versus candidate privateAPI/proxy; service worker caches assets not complete fresh demo/API offline state.
- **Evidence:** public/sw.js; candidate deploy config;16.
- **Migration acceptance test:** Verify pinned frontend hits expected API/auth version; stale assets cannot create false success or wrong contract calls. Rehearse API outage with approved error state, backup+restore of data/bytes and write-preserving rollback. Do not promise offline backend writes without approval.
- **Approval / gate:** ADR-10; blocks release.

## Existing test classification

Classification is remediation triage, not a new test result or a verdict that the application is defective. For the 37 unsuccessful cases, exact failure/role/locator/root-cause confidence remains in [15A](15A-VERIFICATION-FAILURE-ANALYSIS.md). A primary class is assigned once per test so counts reconcile; secondary investigation needs do not inflate the denominator. A historical pass is a **reliable baseline candidate within its observed scope**, not proof of live API integration or complete workflow coverage. Fixtures/clock/origin must still be pinned before reuse.

Class meanings:

- **Reliable baseline:** recorded pass with no identified failing assertion; retain test intent, verify fixture/environment before reuse.
- **Requires fixture update:** current row identities/counts, pagination, filters, status or numbering differ from assumptions; do not alter approved demo data to satisfy the test.
- **Requires locator correction:** test targets wrong element representation/scope or potentially stale control name; preserve UI and confirm eligible state before correction.
- **Requires behavior clarification:** expectation contradicts or does not establish current approved conditional rules; confirm provisional source contract before updating test.
- **Requires timeout/environment investigation:** unavailable target/auth/selection needs isolated diagnosis; not permission to increase deadlines blindly. Most timeouts are missing/disabled controls, not proven host slowness.

| Primary class | Browser cases |
|---|---:|
| Reliable baseline | 50 |
| Requires timeout/environment investigation | 6 |
| Requires fixture update | 25 |
| Requires behavior clarification | 2 |
| Requires locator correction | 4 |

Total **87**: **50 passed, 20 failed, 17 timed out**, zero retries/skips/flaky. Detailed original command: `UI_TEST_PORT=5187 npx playwright test --workers=2 --reporter=json`, with the server-identity qualification in 15A. This stage ran none of these tests.

| Test source / case | Original result | Primary class | Evidence |
|---|---|---|---|
| `tests/global-users.spec.ts:49` Cognito login uses authorization-code PKCE and never renders the demo selector | passed | Reliable baseline | Recorded historical pass |
| `tests/global-users.spec.ts:62` global User Management invites without passwords, persists, polls, edits, resends, and archives | failed | Requires timeout/environment investigation | VFA-001 |
| `tests/remote-followups.spec.ts:14` authenticated Service Advisor uses API-backed Follow-ups and Search | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:49` reception@example.com can open every role screen | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:49` service@example.com can open every role screen | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:49` store@example.com can open every role screen | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:49` tech@example.com can open every role screen | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:49` accounts@example.com can open every role screen | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:49` admin@example.com can open every role screen | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:58` service Job Cards uses a one-row table toolbar without customer, advisor, or view controls | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:86` service My Queue is a responsive active-job table with direct record actions | failed | Requires fixture update | VFA-002 |
| `tests/workshopos.spec.ts:127` advance bookings are limited to the next two complete months | failed | Requires behavior clarification | VFA-003 |
| `tests/workshopos.spec.ts:165` Accounts Ready To Invoice lists only active pending invoices and is read only | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:183` desktop main content scrolls without moving the navigation rail | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:205` desktop navigation scrolls independently in a short viewport | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:221` admin hides customer and vehicle pages from its navigation rail | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:229` saved Store page access immediately removes Purchase Orders from its inventory navigation | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:244` admin dashboard presents live metrics in an accessible command-center grid | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:354` reception creates a linked customer vehicle visit and job searchable after reload | timedOut | Requires fixture update | VFA-004 |
| `tests/workshopos.spec.ts:448` admin can open the management hub and create a user | failed | Requires fixture update | VFA-005 |
| `tests/workshopos.spec.ts:462` list filters expose Clear but no Search submit action | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:473` Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:527` admin service task subtabs and role filters stay compact on desktop and stack on mobile | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:599` Management Hub Job Cards filters estimated delivery dates, months, archived records, and clears | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:639` direct Job Cards uses one clear two-row filter toolbar | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:711` Job Card entry defaults to a local month with no jobs and Clear shows all months | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:738` search shows an explicit empty state without an unrelated job | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:747` service Search retains its four record categories without the underlying page grants | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:776` search combines entity and lifecycle filters and clears predictably | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:850` admin Search exposes operational workspaces without restoring hidden rail entries | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:878` Search gives delegated categories the shared filter grid without changing their filters | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:926` non-admin Search keeps its existing category availability | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:935` admin loads the deterministic large dataset and paginates core lists | failed | Requires fixture update | VFA-006 |
| `tests/workshopos.spec.ts:969` core entity lists switch views and expose deterministic totals | failed | Requires fixture update | VFA-007 |
| `tests/workshopos.spec.ts:999` media filters use the linked job received date and scope job cards to the advisor | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1032` mobile lists use cards, compact pagination and no horizontal overflow | failed | Requires fixture update | VFA-008 |
| `tests/workshopos.spec.ts:1047` opening a paginated record and returning preserves list state | timedOut | Requires fixture update | VFA-009 |
| `tests/workshopos.spec.ts:1062` job dialogs expose distinct modes, documents, focus return and shared search entry | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1084` Job Cards grid uses direct, permission-aware view, edit and archive actions | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1114` job card document actions stack editors, replace creation actions after save, and download financial PDFs | timedOut | Requires locator correction | VFA-010 |
| `tests/workshopos.spec.ts:1193` customer and vehicle records use distinct view and edit dialogs on every list surface | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1232` Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states | timedOut | Requires timeout/environment investigation | VFA-011 |
| `tests/workshopos.spec.ts:1288` Data Flow filters and suggestions stay within a mobile viewport | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1303` admin management domains expose contextual creation paths | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1318` Accounts billing lists include records received outside today and print colored documents | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1349` Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1445` Manage Job Cards uses view and edit dialogs with documents and confirmed archive | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1478` admin receives readable duplicate user validation | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1494` contextual create actions remain visible on mobile role screens | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1506` store stock and material requests combine search with domain filters | failed | Requires fixture update | VFA-012 |
| `tests/workshopos.spec.ts:1535` stock filter toolbars use no more than two rows above mobile | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1556` Store cannot bypass the Purchase Order workflow with direct Stock Inward | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1567` Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1582` issue and reconcile lists filter by item and reconciliation state | timedOut | Requires fixture update | VFA-013 |
| `tests/workshopos.spec.ts:1597` material record queues use compact rows and issue actions do not open their row | failed | Requires fixture update | VFA-014 |
| `tests/workshopos.spec.ts:1620` store reconciliation states use status pills and shared table actions | failed | Requires fixture update | VFA-015 |
| `tests/workshopos.spec.ts:1629` reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation | timedOut | Requires timeout/environment investigation | VFA-016 |
| `tests/workshopos.spec.ts:1670` store material queues default to today and keep record filters, exports and workflows in sync | timedOut | Requires fixture update | VFA-017 |
| `tests/workshopos.spec.ts:1732` PDF and Excel downloads use the current filtered rows and visible columns | failed | Requires fixture update | VFA-018 |
| `tests/workshopos.spec.ts:1764` store pagination resets after filtering | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1778` admin user CRUD persists and protects the signed-in admin | timedOut | Requires fixture update | VFA-019 |
| `tests/workshopos.spec.ts:1800` Team Structure creates departments and manages appointed manager advisor teams responsively | failed | Requires fixture update | VFA-020 |
| `tests/workshopos.spec.ts:1858` company settings validate, preview, reset and persist report assets | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1894` App Theme previews, saves live UI tokens, and restores the default | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:1920` tax and billing settings validate, normalize, persist, audit and drive invoice print | timedOut | Requires fixture update | VFA-021 |
| `tests/workshopos.spec.ts:1977` report templates preview safely, validate, activate and persist | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:2025` job documents download financial PDFs, print other templated reports and explain blocked popups | failed | Requires locator correction | VFA-022 |
| `tests/workshopos.spec.ts:2058` job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note | failed | Requires behavior clarification | VFA-023 |
| `tests/workshopos.spec.ts:2085` lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment | timedOut | Requires timeout/environment investigation | VFA-024 |
| `tests/workshopos.spec.ts:2162` estimate dialog stages item CRUD and persists only on Save | timedOut | Requires locator correction | VFA-025 |
| `tests/workshopos.spec.ts:2191` service advisor Job Card defaults to the current delivery month | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:2217` service follow-ups show all assigned jobs and resolve the earlier open contact | failed | Requires fixture update | VFA-026 |
| `tests/workshopos.spec.ts:2254` job card media validates, compresses, edits, archives, stays session-only, and responds on mobile | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:2344` Developer Console manages demo tenants, messages, billing and writable role emulation | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:2381` linked advisor can change job media while other authorized job viewers are read only | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:2410` fresh demo data provides a multi-supplier price review before PO approval | failed | Requires fixture update | VFA-027 |
| `tests/workshopos.spec.ts:2430` Store creates a Purchase Request without supplier access or later-stage actions | failed | Requires fixture update | VFA-028 |
| `tests/workshopos.spec.ts:2461` Admin can create a Purchase Request | failed | Requires fixture update | VFA-029 |
| `tests/workshopos.spec.ts:2474` Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form | passed | Reliable baseline | Recorded historical pass |
| `tests/workshopos.spec.ts:2489` Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request | timedOut | Requires fixture update | VFA-030 |
| `tests/workshopos.spec.ts:2517` Admin approves a New Item Request with a supplier, price, and zero-stock SKU | timedOut | Requires fixture update | VFA-031 |
| `tests/workshopos.spec.ts:2550` Admin issues an approved Purchase Order and both roles can see its Supplier Basket context | timedOut | Requires fixture update | VFA-032 |
| `tests/workshopos.spec.ts:2707` job sheet intake fields and damage marks persist through the Job Card edit dialog | failed | Requires locator correction | VFA-033 |
| `tests/workshopos.spec.ts:2752` owner adds, requests and cancels a material row with an over-stock warning | timedOut | Requires timeout/environment investigation | VFA-034 |
| `tests/workshopos.spec.ts:2775` Store releases a requested row, then Admin edits it as Issued with a note | timedOut | Requires timeout/environment investigation | VFA-035 |
| `tests/workshopos.spec.ts:2815` estimate approval and invoice creation enable Completed with per-line GST totals | failed | Requires fixture update | VFA-036 |
| `tests/workshopos.spec.ts:2842` searchable pickers dismiss outside interactions and still select options | timedOut | Requires fixture update | VFA-037 |

### Separate unit and backend baselines

| Suite | Existing evidence | Classification / next action |
|---|---|---|
| Frontend unit tests | 244 total; 241 pass, three report-template count failures | 241 reliable baseline candidates for their tested lower-layer scope. Three require fixture/expectation update: eight defaults, six active categories, addition =>9. Preserve template identities and validation; separate from the 37 browser results. |
| Checkout backend tests |40 source functions:26 unit/14 integration; not executed in audit | Requires timeout/environment investigation in the broad sense of establishing isolated runnable environment, then parity review. No claim of current failure or timeout. |
| Candidate backend tests |65 source test functions:37 unit/28 integration, counted from pinned Git AST; not executed | Requires isolated-environment and behavior-clarification review; candidate test assertions may encode incompatible backend rules. Reconcile runtime/branch test_database_email_login.py discrepancy before treating image tests as source-identical. |

Static function counts are not collected pytest case counts: parametrization may expand them. Candidate tests are an alternative revision, not65 additional independent tests to add to40. The old successful template browser case does not fix the three unit assertions; default-count unit fixes do not resolve browser failures.

## Safe executable regression plan, proposed only

1. Approve ADR-09 disposable resources and fixture scope; verify target host/database/project/profile identity before any test. No production/current-demo credentials or mounted existing volumes. Never allow storage-clearing hooks into client profiles.
2. Pin approved frontend revision plus candidate backend revision and lockfiles; identify served bundle/API version. Use a unique port/origin, dedicated browser profile and no reuseExistingServer. Freeze date/timezone/viewport and create explicit eligible records in disposable state, not first-row/index guesses.
3. Establish clean candidate migration replay, tenant/RLS/auth tests and pure financial parity probes. Reconcile history bridges separately before testing upgrades. A source function being present is not passing evidence.
4. Repair tests only in a later authorized task, preserving current UI. Fix fixture/filter assumptions, stable identity selection and locators; clarify conditional rules. Rerun targeted unsuccessful cases first. Capture traces/screenshots at the stopping action and expected successful state without changing approved baseline images automatically.
5. Fill browser gaps: service-manager command permissions; local lead/quotation lifecycle; booking capacity/check-in transitions; technician task/QC/rework; full payment/receipt/gatepass/closure; PO receipt/confirmation/closure. Existing lower-layer domain tests complement, not replace, these flows.
6. Run the full regression suite on isolated data; compare the same source/role/state/viewport images and artifacts. Add rollback/concurrency/retry tests for financial, stock, capacity and claims. Export a report with revision, fixture hash, schema head, clock, browser, attempted steps, actual result and evidence links.
7. Reset or destroy only identified disposable resources under the later test authorization; retain failure artifacts and verify no operational/browser source hash changed. No cleanup or provisioning occurs in this stage.

## Acceptance and readiness

The94 source screenshots remain provisional visual references; 6,920 repeated captured DOM controls and 1,122 source declaration sites are different counting units, neither a passing action coverage count. Static/source freeze can be maintained now. Complete behavioral regression acceptance remains incomplete.

PAR-02/03/04/05/06/08 require financial policy/example approval as specified in ADR-07. Candidate backend provenance is substantially resolved, but its adoption/auth/schema history and data/media ownership remain proposed. PostgreSQL design can proceed after approval of these decisions; backend integration, migration and deployment are not authorized. Do not expose backend-only workflows or alter the approved UI to make tests pass.

## PAR-23 / AT-23 - Final user-approved authentication requirements

The final authentication instruction supersedes provisional auth-mode alternatives. One login/session system handles dropdown-prefilled and arbitrary valid manual credentials in both environments. Preserve the eight development choices; test all seven roles, including manual manager accounts. Require backend hash verification, persistent/revocable HttpOnly cookies, restart/refresh persistence, CSRF, /login valid-session redirect, protected-route denial and logout without deleting business data. Production excludes development credential material. Detailed executable acceptance specifications are AUTH-AT-01..18 in29; unresolved exact Dashboard/role routing and user-editor credential behavior are recorded in26. No tests were run or changed by this update.
