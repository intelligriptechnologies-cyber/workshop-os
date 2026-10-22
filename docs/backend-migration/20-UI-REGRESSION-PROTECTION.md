# 20 - UI regression protection

Stage 2, 2026-10-21. Documentation-only plan; no tests changed or executed, and no original screenshot replaced. Reference revision and file protection are in [19](19-APPROVED-FRONTEND-BASELINE.md).

## VIS-01 - Existing visual evidence

All 94 source-baseline screenshots were reviewed through eight derived contact sheets. Their individual filenames, roles, screens, states, dimensions and SHA-256 values are recorded in the [screenshot manifest](stage2-screenshot-manifest.json.md). Exact source/route/control associations remain in [screen inventory](evidence-screenshots.md), [browser evidence](evidence-browser.json.md) and [UI contracts](02-PAGE-AND-UI-CONTRACTS.md). Contact-sheet review identifies coverage; it does not certify every pixel or every control's behavior.

| Role | Images | What is represented | Important gaps |
|---|---:|---|---|
| Admin | 54 | Dashboard, module lists, console/settings, searches, sales, intake/job dialogs and job tabs | Successful finance/stock transitions; nested forms; populated conditional job tabs |
| Store | 9 | Requests, issue, reconciliation, stock/moves and PO lists | Actual issue/reservation outcomes, receipt confirmation and PO closure |
| Reception | 8 | Queue, bookings, customer/vehicle lists, search, New Visit details/body marking | Complete booking/check-in, invalid/save/cancel outcomes |
| Service | 6 | Queue, jobs, estimates, follow-ups, media and search | Eligible estimate editing/approval, task/material lifecycle |
| Service manager | 6 | Queue and module entry states | Manager actions with owned eligible records; cross-team denial |
| Accounts | 5 | Ready-to-invoice, invoices, payments, delivery and search | Payment dialog, partial/repeated payment, receipt and completed handover |
| Technician | 4 | Navigation/tasks/work update/QC preparation | Task completion, failed QC, rework and final success |
| Anonymous | 2 | Login and invalid-credentials error | Session expiry, remote authentication and recovery conditions |
| Total | 94 | All seven built-in roles represented | Representation is not workflow completion |

There are 93 images of width 1440 and one of width 390. Recorded desktop viewport is 1440x1000, mobile 390x844; full-page image height can exceed viewport height. The initial source login image has no explicit viewport metadata although its image width is 1440. Only the dashboard has mobile coverage. There is no demonstrated tablet, mobile form/dialog/table or touch workflow baseline.

The browser ledger has 96 entries: 93 successful file-bearing captures and three failed Sales CRM navigation attempts, subsequently resolved. The additional source-login image makes 94. The diagnostic stale-build screen-login.png is excluded. No stale-build or unrelated root/scratch image is promoted to an approved reference.

### VIS-02 - State limitations observed

The selected admin job is NEW. Its task list is empty, materials are locked/empty, documents are not created, photos have no uploaded images, and invoice/payment tabs have no invoice. Those tab images do not cover invoice editing, paid restrictions or terminal states. Accounts images are lists, not payment-posting evidence. Store request/issue screens include date-filtered empty states; PO screenshots show closed orders, not receipt steps. Media largely shows placeholders. Sales screenshots show lead/quotation lists and settings, not Add/Edit forms. Developer console is not represented among these 94 images.

Missing states include loading and API failures, validation on most forms, save success, cancel with a draft, keyboard/focus behavior, role/owner/status-dependent controls, populated and truly empty results versus filtered-empty results, actual generated PDFs/print pagination, upload failure/success and custom roles. None is inferred from source or fabricated as a screenshot.

Review sheets (derived from originals, not new goldens): [1](stage2-review-contact-01.png), [2](stage2-review-contact-02.png), [3](stage2-review-contact-03.png), [4](stage2-review-contact-04.png), [5](stage2-review-contact-05.png), [6](stage2-review-contact-06.png), [7](stage2-review-contact-07.png), [8](stage2-review-contact-08.png).

## VIS-03 - Proposed reproducible capture protocol

The [original capture recipe](browser-audit.mjs.md) served the approved source through an in-memory build on a dedicated loopback origin, blocked service workers/API requests, used isolated browser contexts and suppressed browser storage writes. This protects existing records but does not test persisted CRUD. Its clock/browser/font versions were not fully pinned and some waits were fixed delays. Exact historical pixel reproduction is therefore UNVERIFIED.

For a later approved capture run:

1. Pin full frontend SHA from 19, lockfile, browser build, OS/fonts, device scale factor 1 and fixture SHA from 21. Record the served bundle identity. Use a unique origin with no reuseExistingServer and a dedicated profile, never an existing client profile.
2. Use the raw shipped fixture in isolated memory for read-only views. Record runtime initialization/migrations/defaults separately from raw counts. Use explicit user/record IDs for each role, ownership and status; do not choose the first visible row. Record selections without credentials.
3. Pin Asia/Kolkata, locale, and a proposed future clock of 2026-10-21T06:30:00Z. This is a new deterministic reference setting, not a claim about the original capture clock. Match desktop 1440x1000 and mobile 390x844; propose additional 1280/1024/768/360-width cases against existing CSS without changing layout.
4. Await database readiness, fonts, selected record and stable DOM state. Disable animations/caret consistently. Preserve money, statuses, validation and permissions in comparisons; never mask those values to make a comparison pass.
5. Capture full-page and important dialog/viewport states with route/page key, actor, fixture, clock, source component, expected controls, console/network errors and storage-write suppression metadata. Use writable disposable state only in separately authorized workflow tests.
6. Write to a unique new evidence directory. Keep all 94 original images immutable. Review diffs and approve new/changed reference images explicitly; neither a failed comparison nor a fixture correction authorizes overwriting a golden.

## REG-01 - Existing test readiness

[15A](15A-VERIFICATION-FAILURE-ANALYSIS.md) identifies the original command, every unsuccessful case and stopping action. [18](18-BACKEND-PARITY-MATRIX.md) classifies all 87 tests. The historical command was UI_TEST_PORT=5187 npx playwright test --workers=2 --reporter=json: 50 passed, 20 failed, 17 timed out. A successful historical test is a reuse candidate, not a fresh certification of a pinned application bundle.

| Classification from Stage 1.6 | Cases | Reuse decision |
|---|---:|---|
| Reliable baseline | 50 | Retain assertions; rerun later only on disposable fixtures with pinned bundle/actor |
| Requires fixture update | 25 | Correct eligibility/date/filter/identity setup; preserve approved business rule |
| Requires locator correction | 4 | Scope to actual accessible control/dialog; do not change UI to fit selector |
| Requires behavior clarification | 2 | Obtain expected outcome before editing assertion |
| Requires timeout/environment investigation | 6 | Trace readiness, auth and server identity; do not simply raise all timeouts |

These five categories total 87 and are not the pass/fail/timeout categories. The latter describe execution outcome; the former describe reuse work. Exact case-level assignments and VFA identifiers remain authoritative in 15A/18.

The separate unit run had 244 tests: 241 passed and three report-template count failures. Eight shipped defaults with six active categories are intentional in source; two inactive quotation variants explain the count mismatch. Future expectation/fixture correction should preserve identities, active categories and validation. These three failures did not produce the 20/17 browser counts.

The browser suite comprises 84 workshop tests, two global-user tests and one remote-follow-up test. Navigation checks cover six workshop roles, omitting service manager from that loop. Existing storage-clearing hooks and business writes make the suite unsafe against existing records. No browser tests were rerun in Stage 2.

## REG-02 - Prioritized corrections and missing coverage

P0 before integration: source/data guards, deterministic isolated fixtures, resolve 37 unsuccessful cases, historical finance preservation and arithmetic examples, seven-role permissions, invoice/payment/closure and stock atomicity. P1: booking lifecycle, local leads/quotations, manager ownership, technician QC/rework, PO receipt/closure, documents/media and all form validation/cancel/error paths. P2: responsive expansion, keyboard/focus and less frequent administrative/developer states; these remain release obligations where enabled.

Important client workflows currently lack a demonstrated complete executable browser regression: local sales lifecycle, booking capacity through check-in, manager command permissions, technician QC/rework, full payment/receipt/gatepass/handover and PO receipt-confirmation-close. Lower-layer unit tests and screenshots do not close these gaps. All 28 proposed acceptance scenarios are assigned gates in [22](22-INTEGRATION-ACCEPTANCE-PLAN.md).

Counts are deliberately distinct: 1,122 source control declaration sites, 533 field sites, 52 forms, 174 dialog/tab/alert/status sites, 197 named components, 6,920 repeated rendered DOM control occurrences and 87 tests. A declaration can render repeatedly or be unreachable; a captured control may never have been activated. No percentage of controls successfully tested can be derived from these totals. Use stable action/form/workflow IDs in the existing ledgers, with an explicit executable-test or UNVERIFIED entry per condition.

## Readiness

Source/assets and existing images can be protected now. Full visual and behavioral acceptance is PARTIALLY VERIFIED. Test corrections and missing captures require a later authorized task; this document installs no guards and changes no tests. Architecture design can use this baseline with explicit gaps, but integration acceptance cannot rely on the historical 50 passing cases alone.
