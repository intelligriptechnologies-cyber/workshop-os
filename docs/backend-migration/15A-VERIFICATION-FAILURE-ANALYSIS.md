# 15A ? Verification failure analysis

Audit date: 2026-10-21. Documentation-only follow-up. **The reported 20 failed and 17 timed-out checks belong to an earlier 87-test Playwright run, not the Stage 1.5 template probe and not 37 proven application defects.** This report upgrades review of the previously unreviewed `data-migration/` test artifacts; it does not represent a new browser run or change the approved frontend.

## Original command and execution context

The producer is Playwright Test executing `tests/global-users.spec.ts`, `tests/remote-followups.spec.ts` and `tests/workshopos.spec.ts`, not `verify-browser-restore.mjs` or `scripts/verify-harness.mjs`.

Recorded command: `UI_TEST_PORT=5187 npx playwright test --workers=2 --reporter=json`. This environment-prefix notation is quoted from the original report; PowerShell equivalent would set `$env:UI_TEST_PORT='5187'` before the command. It was **not rerun** here.

Primary evidence: [original JSON results](../../data-migration/evidence/playwright-results.json) and [original audit](../../data-migration/Current%20App%20clone%20info%20file.md). JSON argv confirms `test --workers=2 --reporter=json`; resolved webServer port confirms 5187. Workspace/config: repository root and `playwright.config.ts`; Playwright 1.63.0, two workers, one unnamed project, repeatEach 1, retries 0, no skipped tests. Default test timeout 30 seconds; lifecycle accessibility test overrides to 60 seconds. Many assertion failures have a five-second assertion deadline: these remain `failed`, not `timedOut` test results.

Run began **2026-10-20 21:38:25.503 UTC** (2026-10-21 03:08:25.503 IST), wall duration **940.202997 seconds** (~15m40s). The original report says it targeted a current-source Vite server. Config requests `npm run preview -- --port 5187` with `reuseExistingServer: true`: therefore the config alone cannot prove whether an existing dev server or a newly launched dist preview served that execution. Preserve this qualification. Source manifest comparison now matches all **61/61 recorded source/config hashes**; this establishes recorded source continuity, not browser-served bundle identity or full test-file provenance.

`tests/workshopos.spec.ts:15?19` navigates, calls `localStorage.clear()`, then reloads before **every test**. Individual tests load large demo datasets, save users/jobs, void invoices and create purchase requests. These are not read-only audit checks. Auth tests use mocked endpoints/tokens; they are not live Cognito/backend integration certification. The preserved results cannot establish that any pre-existing user browser profile was touched; Playwright uses test contexts, but no assertion of historical profile preservation is inferred.

## Exact results and counting unit

| Measure | Result |
|---|---:|
| Test cases / result attempts | 87 / 87 |
| Passed | 50 |
| Failed (including assertion deadlines) | 20 |
| Timed out at test deadline | 17 |
| Total unexpected | 37 |
| Skipped / flaky / retries | 0 / 0 / 0 |

Counts were recomputed recursively from the raw JSON result records and agree with reporter stats (`expected=50`, `unexpected=37`). ?Checks? here means test cases, not individual assertions, controls, pages or unique defects. There is no count of every assertion executed. A test can stop before most workflows named in its title; do not classify all its later steps as failed.

## Classification and safe repeat decision

* **Established test/fixture differences:** obsolete booking-window expectation, absent seeded customer/item/order identities, hardcoded purchase numbering, existing invoice versus an assumed blank invoice, and value-versus-text lookup for the delivery date.
* **Supported automation/precondition causes:** pagination hides created users, default month filters hide jobs, empty material queues have no populated table, and visible rows differ from small-fixture expectations. Some persistence/selection details still need isolated replay.
* **Unresolved application-versus-automation cases:** mocked user manager, missing eligible invoice/estimate/lifecycle controls and specific job selection. They are not exonerated, but current artifacts do not prove application defects.
* **Authentication:** one failed test uses mocked Cognito/admin endpoints; login/PKCE and remote follow-up tests passed. No real provider outage, rejected actual credentials or backend permission failure is established.
* **Environment/timeouts:** all 17 timeout call logs identify missing or disabled target controls. None is a recorded browser-launch failure. Host load/network contribution remains UNVERIFIED; increasing timeout alone is not an evidenced remedy.

No failed browser test was rerun. All 36 affected workshop tests inherit storage clearing; the remaining global-users test injects session auth state and intends invite/edit/archive mutations. Even fresh app startup writes initialization/persistence data. Removing setup/actions would create a different test, and modifying tests is prohibited. The same server/bundle identity is also not proven. This decision follows the user's non-destructive constraints, not a request to change the baseline.

Safe checks actually repeated in this follow-up: raw-report count reconciliation; all 61 source-manifest hash comparisons; immutable read-only SQLite fixture queries; screenshot-file/DOM ledger reconciliation; and the existing pure `advanceBookingRange` function at fixed local noon 2026-10-21. Its output is `min=2026-10-22`, `max=2027-01-31`, `firstMonth=2026-10`, `lastMonth=2027-01`. SQLite confirms 145 jobs, 121 customers, four inventory rows, zero Rahul Sharma customers, zero Nano Ceramic item matches, and two orders numbered 00001/00002. No storage or records were changed.

## Per-issue failure register

IDs VFA-001?037 are stable in original report order. Each linked source location is a test declaration; error evidence gives the exact stopping locator. ?Related screenshot? means a visual surface only, **not coverage of the failed transaction**. All issue rows use gate G1 below unless explicitly G2 for unresolved semantics. Role lists distinguish planned later roles from roles reached before failure.

**G1:** does not block taking reference screenshots or preliminary architecture design; blocks claiming complete regression coverage and acceptance of the affected backend integration until the test/precondition is corrected and safely verified. **G2:** same capture rule, but unresolved behavior also blocks finalizing the affected API/permission/state contract. Neither gate licenses changing approved UI to satisfy a test.

### VFA-001 ? global User Management invites without passwords, persists, polls, edits, resends, and archives

| Attribute | Finding |
|---|---|
| Test / result | `tests/global-users.spec.ts:62` ? **failed**, 9.967s |
| Role / page / workflow | Admin (mock Cognito) ? Manage / global Users |
| Stopping control | `locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' })` |
| Classification / confidence | AUTH/LOCATOR ? unresolved |
| Cause and remediation | Mock authenticated API test reaches Manage but cannot find the admin row under .management-table. No real Cognito outage or rejected credentials is demonstrated; mock/UI contract or table selection requires isolated replay. |
| Screenshot coverage | [Related surface](SHOT-admin-manage-tab-users.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/global-users-global-User-M-3ab87--edits-resends-and-archives.md) |

### VFA-002 ? service My Queue is a responsive active-job table with direct record actions

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:86` ? **failed**, 8.056s |
| Role / page / workflow | Service Advisor ? My Queue / active-job table; View/Edit |
| Stopping control | `locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr')` |
| Classification / confidence | FIXTURE ? established mismatch |
| Cause and remediation | Expected one row; ten rendered. Source test assumes a small fixture; shipped database has 145 jobs. Correct fixture/filter preconditions before asserting count; subsequent View/Edit/mobile assertions were not reached. |
| Screenshot coverage | [Related surface](SHOT-service-my-queue-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-service-My-Queu-39c24--with-direct-record-actions.md) |

### VFA-003 ? advance bookings are limited to the next two complete months

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:127` ? **failed**, 10.647s |
| Role / page / workflow | Reception ? Advance Bookings / month navigation, date bounds |
| Stopping control | `getByLabel('Booking month calendar').getByRole('heading', { level: 3 })` |
| Classification / confidence | TEST CONTRACT ? established |
| Cause and remediation | Test expects next two complete months. Current advanceBookingRange starts in the current month, tomorrow minimum, through current month + 3. Fixed-date pure-function probe confirms this; preserve current baseline and reconcile test. |
| Screenshot coverage | [Related surface](SHOT-reception-advance-bookings-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-advance-booking-1dd93-he-next-two-complete-months.md) |

### VFA-004 ? reception creates a linked customer vehicle visit and job searchable after reload

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:354` ? **timedOut**, 30.207s |
| Role / page / workflow | Reception ? Today Queue / Create New Visit / customer picker |
| Stopping control | `getByRole('dialog', { name: 'Create New Visit' }).getByRole('option', { name: 'Rahul Sharma Â· 9876543210' })` |
| Classification / confidence | FIXTURE ? established |
| Cause and remediation | Waits for Rahul Sharma option, absent from shipped customers. Linked creation/save/reload steps are not reached. Use a sanctioned deterministic fixture later. |
| Screenshot coverage | [Related surface](SHOT-reception-today-queue-new-visit-dialog.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-reception-creat-ce7de-job-searchable-after-reload.md) |

### VFA-005 ? admin can open the management hub and create a user

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:448` ? **failed**, 7.772s |
| Role / page / workflow | Admin ? Manage / Users / Add User, Save User |
| Stopping control | `getByText('e2e.manager@example.com')` |
| Classification / confidence | PAGINATION ? supported, persistence unverified |
| Cause and remediation | Failure snapshot shows 11 users and page 1 of 10 rows after creation. Test searches unfiltered visible email. Search/page to created identity and verify persistence before diagnosing save defect. |
| Screenshot coverage | [Related surface](SHOT-admin-manage-tab-users.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-admin-can-open--56275-ement-hub-and-create-a-user.md) |

### VFA-006 ? admin loads the deterministic large dataset and paginates core lists

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:935` ? **failed**, 9.927s |
| Role / page / workflow | Admin ? Manage / Load Large Demo Dataset; Job Cards pagination |
| Stopping control | `getByText('Showing 1 to 10 of 144')` |
| Classification / confidence | FILTER PRECONDITION ? established |
| Cause and remediation | Failure snapshot shows zero visible results under estimated-delivery month filter, not an unpaginated 144-row list. Test does not clear the default date filter. Loader also mutates records; do not rerun here. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-admin-loads-the-5bc4b-et-and-paginates-core-lists.md) |

### VFA-007 ? core entity lists switch views and expose deterministic totals

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:969` ? **failed**, 9.943s |
| Role / page / workflow | Admin ? Job Cards then entity lists / Table/Grid and totals |
| Stopping control | `getByText('Showing 1 to 10 of 144')` |
| Classification / confidence | FILTER PRECONDITION ? supported |
| Cause and remediation | Stops at first 144-row visibility assertion. Cannot infer later entity views failed. Normalize date/filter fixture before checking totals. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-core-entity-lis-af8ee-expose-deterministic-totals.md) |

### VFA-008 ? mobile lists use cards, compact pagination and no horizontal overflow

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1032` ? **failed**, 8.045s |
| Role / page / workflow | Admin ? Mobile Job Cards / pagination and overflow |
| Stopping control | `getByText('Page 1 of 15').first()` |
| Classification / confidence | FILTER PRECONDITION ? supported |
| Cause and remediation | Expected Page 1 of 15 absent. Failure precedes full responsive assertions; same loader/default-filter assumptions as 935. Mobile workflow remains unverified. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-mobile-lists-us-c5e06--and-no-horizontal-overflow.md) |

### VFA-009 ? opening a paginated record and returning preserves list state

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1047` ? **timedOut**, 30.111s |
| Role / page / workflow | Admin ? Job Cards / status filter, Next page, View/Go Back |
| Stopping control | `getByRole('button', { name: 'Next page', exact: true }).first()` |
| Classification / confidence | DISABLED CONTROL ? established |
| Cause and remediation | Next page exists but is disabled; Playwright retries until deadline. More time cannot create another page. Establish multiple filtered pages first. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-opening-a-pagin-d3f15-urning-preserves-list-state.md) |

### VFA-010 ? job card document actions stack editors, replace creation actions after save, and download financial PDFs

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1114` ? **timedOut**, 30.072s |
| Role / page / workflow | Admin ? Manage / Invoices; job documents, payment, PDFs |
| Stopping control | `getByRole('table', { name: 'Invoices manager' }).getByRole('button', { name: 'Void Invoice' })` |
| Classification / confidence | LOCATOR/STATE ? unresolved |
| Cause and remediation | Waits for Void Invoice scoped inside Invoices manager table. Could be wrong scope or invoice eligibility. No PDF/payment action was reached. Also later comment assumes payment does not close job, contradicting current atomic payment contract. |
| Screenshot coverage | [Related surface](SHOT-admin-manage-tab-invoices.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-job-card-docume-c987b-and-download-financial-PDFs.md) |

### VFA-011 ? Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1232` ? **timedOut**, 30.064s |
| Role / page / workflow | Admin ? Data Flow / job picker, filtered timeline and PDF |
| Stopping control | `getByRole('option', { name: /JC-2026-001245/ })` |
| Classification / confidence | FIXTURE/SELECTION ? unresolved |
| Cause and remediation | Cannot select JC-2026-001245 after vehicle search. Verify linked vehicle/job data and active filters; timeout is before PDF download. |
| Screenshot coverage | [Related surface](SHOT-admin-data-flow-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Data-Flow-casca-c354a--empty-clear-and-PDF-states.md) |

### VFA-012 ? store stock and material requests combine search with domain filters

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1506` ? **failed**, 7.116s |
| Role / page / workflow | Store ? Stock then Material Requests / search/domain filters |
| Stopping control | `getByText('Showing 1 to 10 of 61')` |
| Classification / confidence | FIXTURE ? established mismatch |
| Cause and remediation | Expects 61 stock rows; shipped inventory has four. Later material filter assertions are not reached. Do not add demo records to make test pass. |
| Screenshot coverage | [Related surface](SHOT-store-stock-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-store-stock-and-6aa28--search-with-domain-filters.md) |

### VFA-013 ? issue and reconcile lists filter by item and reconciliation state

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1582` ? **timedOut**, 30.048s |
| Role / page / workflow | Store ? Issue Material / item picker; Reconcile states |
| Stopping control | `getByRole('option', { name: /70%VLT Nano Ceramic Film/ })` |
| Classification / confidence | FIXTURE ? established |
| Cause and remediation | 70%VLT Nano Ceramic Film target is absent from shipped inventory. Timeout occurs before reconciliation assertions. |
| Screenshot coverage | [Related surface](SHOT-store-issue-material-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-issue-and-recon-fad5f-em-and-reconciliation-state.md) |

### VFA-014 ? material record queues use compact rows and issue actions do not open their row

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1597` ? **failed**, 7.323s |
| Role / page / workflow | Store ? Material Requests / compact table and row actions |
| Stopping control | `getByRole('table', { name: 'Material Requests results' })` |
| Classification / confidence | EMPTY STATE/PRECONDITION ? supported |
| Cause and remediation | Snapshot shows zero results; expected Material Requests results table is absent. Distinguish correct empty-state rendering from a layout regression. |
| Screenshot coverage | [Related surface](SHOT-store-material-requests-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-material-record-5dfd1-tions-do-not-open-their-row.md) |

### VFA-015 ? store reconciliation states use status pills and shared table actions

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1620` ? **failed**, 7.521s |
| Role / page / workflow | Store ? Reconcile / matched pills and Edit Reconciliation |
| Stopping control | `getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched')` |
| Classification / confidence | FIXTURE ? established count mismatch |
| Cause and remediation | Expected two matched pills, received three. Exact underlying record selection is unverified; do not change approved reconciliation states to satisfy fixed count. |
| Screenshot coverage | [Related surface](SHOT-store-reconcile-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-store-reconcili-6b7f0-ls-and-shared-table-actions.md) |

### VFA-016 ? reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1629` ? **timedOut**, 30.049s |
| Role / page / workflow | Store ? Issue Material then Reconcile / zero-return acknowledgement |
| Stopping control | `getByRole('table', { name: 'Issue Material results' }).getByRole('button', { name: 'Issue Material', exact: true }).first()` |
| Classification / confidence | ELIGIBILITY/LOCATOR ? unresolved |
| Cause and remediation | Waits for Issue Material action inside results table; downstream zero-return validation and navigation never reached. Inspect issueable row/filter prerequisites in isolated replay. |
| Screenshot coverage | [Related surface](SHOT-store-issue-material-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-reconciliation--654a0-nd-preserves-row-navigation.md) |

### VFA-017 ? store material queues default to today and keep record filters, exports and workflows in sync

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1670` ? **timedOut**, 30.058s |
| Role / page / workflow | Store ? Material queues / date filters, exports, issue/reconcile |
| Stopping control | `getByRole('option', { name: /70%VLT Nano Ceramic Film/ })` |
| Classification / confidence | FIXTURE ? established |
| Cause and remediation | Waits for absent Nano Ceramic item. Entire advertised queue/export workflow is not verified by reaching its initial screen. |
| Screenshot coverage | [Related surface](SHOT-store-material-requests-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-store-material--1d611-ports-and-workflows-in-sync.md) |

### VFA-018 ? PDF and Excel downloads use the current filtered rows and visible columns

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1732` ? **failed**, 2.973s |
| Role / page / workflow | Store ? Stock / PDF and Excel filtered export |
| Stopping control | `Error: expect(received).toHaveLength(expected)` |
| Classification / confidence | FIXTURE/EXPECTED ROWS ? supported |
| Cause and remediation | Export parsed successfully but contained one PPF-ROLL row versus expected 61. This is not evidence of download failure; verify requested filter and four-item shipped fixture. |
| Screenshot coverage | [Related surface](SHOT-store-stock-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-PDF-and-Excel-d-7203a-ed-rows-and-visible-columns.md) |

### VFA-019 ? admin user CRUD persists and protects the signed-in admin

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1778` ? **timedOut**, 30.075s |
| Role / page / workflow | Admin ? Manage / user creation, Edit and self-archive protection |
| Stopping control | `locator('.management-table tbody tr').filter({ hasText: 'persistent@example.com' }).getByRole('button', { name: 'Edit' })` |
| Classification / confidence | PAGINATION/LOCATOR ? unresolved |
| Cause and remediation | Waits for persistent test user Edit under .management-table. Creation visibility/page and table class must be checked; persistence and self-protection assertions unverified. |
| Screenshot coverage | [Related surface](SHOT-admin-manage-tab-users.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-admin-user-CRUD-6127c-rotects-the-signed-in-admin.md) |

### VFA-020 ? Team Structure creates departments and manages appointed manager advisor teams responsively

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1800` ? **failed**, 10.201s |
| Role / page / workflow | Admin ? Admin Console / Team Structure; Users manager assignment |
| Stopping control | `locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' })` |
| Classification / confidence | PAGINATION/LOCATOR ? supported |
| Cause and remediation | Snapshot has 12 users, first 10 displayed. Target new manager absent from page; .management-table scope is also suspect. Department/assignment mutation occurred earlier but final visible-row claim not established. |
| Screenshot coverage | [Related surface](SHOT-admin-admin-console-tab-team-structure.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Team-Structure--3261c--advisor-teams-responsively.md) |

### VFA-021 ? tax and billing settings validate, normalize, persist, audit and drive invoice print

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:1920` ? **timedOut**, 30.059s |
| Role / page / workflow | Admin ? Tax/billing settings then Job Cards invoice print |
| Stopping control | `locator('.record-card').first().getByRole('button', { name: 'View', exact: true })` |
| Classification / confidence | FILTER/LOCATOR ? unresolved |
| Cause and remediation | Waits for first record-card View; print stage not reached. Settings steps may already have run. Check current-month list availability before print assertion. |
| Screenshot coverage | [Related surface](SHOT-admin-admin-console-tab-business-settings.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-tax-and-billing-2883f-dit-and-drive-invoice-print.md) |

### VFA-022 ? job documents download financial PDFs, print other templated reports and explain blocked popups

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2025` ? **failed**, 9.203s |
| Role / page / workflow | Admin ? Job Cards / document chips, PDF/print/popups |
| Stopping control | `locator('.record-card').first().locator('.doc-chip')` |
| Classification / confidence | LOCATOR/STATE ? unresolved |
| Cause and remediation | First card has zero .doc-chip elements versus four expected. Card-order/document availability or UI locator drift; does not prove PDF renderer or popup handling failed. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-job-documents-d-0f51d--and-explain-blocked-popups.md) |

### VFA-023 ? job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2058` ? **failed**, 7.536s |
| Role / page / workflow | Admin ? Edit Job / Start Rework and confirmation note |
| Stopping control | `getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' })` |
| Classification / confidence | STATUS PRECONDITION ? unresolved |
| Cause and remediation | Start Rework absent in chosen dialog. Establish exact selected job/status and approved transition before treating conditional absence as defect. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-view-dialog.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-job-lifecycle-e-c5c5e-equires-a-confirmation-note.md) |

### VFA-024 ? lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2085` ? **timedOut**, 60.063s |
| Role / page / workflow | Admin ? Job lifecycle / tabs, stacked dialogs, keyboard/mobile |
| Stopping control | `locator('.record-card').filter({ hasText: 'JC-2026-001247' }).getByRole('button', { name: 'Edit', exact: true })` |
| Classification / confidence | FIXTURE/FILTER ? unresolved |
| Cause and remediation | 60-second timeout waiting for Edit on JC-2026-001247. Accessibility and mobile assertions after selection remain unverified. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-lifecycle-surfa-3cb2c-ames-and-mobile-containment.md) |

### VFA-025 ? estimate dialog stages item CRUD and persists only on Save

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2162` ? **timedOut**, 30.066s |
| Role / page / workflow | Admin ? Manage / Estimates / Edit Estimate, staged Save/Cancel |
| Stopping control | `getByRole('button', { name: 'Edit Estimate' })` |
| Classification / confidence | LOCATOR/STATE ? unresolved |
| Cause and remediation | After selecting job index 1, Edit Estimate never becomes available. Fixed index does not guarantee editable estimate; assert stable eligible job first. |
| Screenshot coverage | [Related surface](SHOT-admin-manage-tab-estimates.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-estimate-dialog-1c756-D-and-persists-only-on-Save.md) |

### VFA-026 ? service follow-ups show all assigned jobs and resolve the earlier open contact

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2217` ? **failed**, 7.167s |
| Role / page / workflow | Service Advisor ? Follow-ups / assigned-job list and contact resolution |
| Stopping control | `locator('.service-advisor-list')` |
| Classification / confidence | PAGINATION/FIXTURE ? established visibility mismatch |
| Cause and remediation | Snapshot displays page 1 of 48 assigned records, newer job IDs. Test expects JC-2026-001247 before searching. No follow-up save/resolution verified. |
| Screenshot coverage | [Related surface](SHOT-service-follow-ups-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-service-follow--c7292-ve-the-earlier-open-contact.md) |

### VFA-027 ? fresh demo data provides a multi-supplier price review before PO approval

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2410` ? **failed**, 7.952s |
| Role / page / workflow | Admin ? Purchase Orders / DEMO-PR-0001 supplier review |
| Stopping control | `getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ })` |
| Classification / confidence | FIXTURE ? established |
| Cause and remediation | Shipped orders are PO-WOS-A-00001 and 00002; expected DEMO-PR-0001 absent. Supplier review assertions not reached. |
| Screenshot coverage | [Related surface](SHOT-admin-purchase-orders-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-fresh-demo-data-0f1da-e-review-before-PO-approval.md) |

### VFA-028 ? Store creates a Purchase Request without supplier access or later-stage actions

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2430` ? **failed**, 7.504s |
| Role / page / workflow | Store ? New Purchase Request / PO number and restricted fields |
| Stopping control | `getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number')` |
| Classification / confidence | NUMBER PRECONDITION ? established |
| Cause and remediation | Expected 00001; actual 00003 is consistent with existing orders 00001/00002. Do not reset numbering or data. |
| Screenshot coverage | [Related surface](SHOT-store-purchase-orders-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Store-creates-a-6ac38-cess-or-later-stage-actions.md) |

### VFA-029 ? Admin can create a Purchase Request

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2461` ? **failed**, 7.204s |
| Role / page / workflow | Admin ? New Purchase Request / PO number and Create request |
| Stopping control | `getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number')` |
| Classification / confidence | NUMBER PRECONDITION ? established |
| Cause and remediation | Same expected 00001 versus actual 00003 mismatch as Store; stops before request creation. |
| Screenshot coverage | [Related surface](SHOT-admin-purchase-orders-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Admin-can-create-a-Purchase-Request.md) |

### VFA-030 ? Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2489` ? **timedOut**, 30.082s |
| Role / page / workflow | Store; planned Admin later ? Purchase request creation then supplier quotations |
| Stopping control | `getByRole('dialog', { name: 'PO-WOS-A-00001' }).getByRole('button', { name: 'Go Back' })` |
| Classification / confidence | NUMBER/LOCATOR ? established |
| Cause and remediation | Request created; snapshot shows dialog PO-WOS-A-00003. Test waits for Go Back in hardcoded 00001 dialog, before Admin review. |
| Screenshot coverage | [Related surface](SHOT-store-purchase-orders-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Admin-records-o-4d202-view-for-a-New-Item-Request.md) |

### VFA-031 ? Admin approves a New Item Request with a supplier, price, and zero-stock SKU

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2517` ? **timedOut**, 30.066s |
| Role / page / workflow | Store; planned Admin later ? New item request then supplier approval/zero-stock SKU |
| Stopping control | `getByRole('dialog', { name: 'PO-WOS-A-00001' }).getByRole('button', { name: 'Go Back' })` |
| Classification / confidence | NUMBER/LOCATOR ? supported |
| Cause and remediation | Same hardcoded 00001 dialog wait after creation; approval and SKU checks not reached. |
| Screenshot coverage | [Related surface](SHOT-store-purchase-orders-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Admin-approves--56ae8-er-price-and-zero-stock-SKU.md) |

### VFA-032 ? Admin issues an approved Purchase Order and both roles can see its Supplier Basket context

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2550` ? **timedOut**, 30.069s |
| Role / page / workflow | Store; planned Admin later ? Purchase request then issue PO / Supplier Basket |
| Stopping control | `getByRole('dialog', { name: 'PO-WOS-A-00001' }).getByRole('button', { name: 'Go Back' })` |
| Classification / confidence | NUMBER/LOCATOR ? supported |
| Cause and remediation | Same hardcoded 00001 dialog wait; issuing and Supplier Basket checks not reached. |
| Screenshot coverage | [Related surface](SHOT-store-purchase-orders-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Admin-issues-an-a7542-its-Supplier-Basket-context.md) |

### VFA-033 ? job sheet intake fields and damage marks persist through the Job Card edit dialog

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2707` ? **failed**, 10.364s |
| Role / page / workflow | Admin ? Job sheet / delivery date, damage marks, Save/View |
| Stopping control | `getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true })` |
| Classification / confidence | LOCATOR ? established |
| Cause and remediation | Snapshot shows Estimated Delivery Date textbox value 2026-10-15 in Job sheet. Test uses getByText exact rather than input value. Absence of a text node is not data loss; other fields/body-mark lifecycle needs separate evidence. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-view-dialog.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-job-sheet-intak-ab820-gh-the-Job-Card-edit-dialog.md) |

### VFA-034 ? owner adds, requests and cancels a material row with an over-stock warning

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2752` ? **timedOut**, 30.123s |
| Role / page / workflow | Admin (owner) ? Job Cards / material add/request/cancel |
| Stopping control | `locator('.record-card').filter({ hasText: 'JC-2026-001246' }).getByRole('button', { name: 'Edit', exact: true })` |
| Classification / confidence | FIXTURE/FILTER ? unresolved |
| Cause and remediation | Waits for Edit on JC-2026-001246 before adding material. No over-stock warning or request cancellation result established. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-owner-adds-requ-78411--with-an-over-stock-warning.md) |

### VFA-035 ? Store releases a requested row, then Admin edits it as Issued with a note

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2775` ? **timedOut**, 30.066s |
| Role / page / workflow | Admin; planned Store then Admin ? Job Cards / material request, release, issued edit |
| Stopping control | `locator('.record-card').filter({ hasText: 'JC-2026-001246' }).getByRole('button', { name: 'Edit', exact: true })` |
| Classification / confidence | FIXTURE/FILTER ? unresolved |
| Cause and remediation | Same initial job Edit wait; no release or issued-edit behavior exercised. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-default.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G2: complete behavior-baseline sign-off blocked; static capture allowed; affected contract design unresolved; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-Store-releases--0d075-ts-it-as-Issued-with-a-note.md) |

### VFA-036 ? estimate approval and invoice creation enable Completed with per-line GST totals

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2815` ? **failed**, 7.378s |
| Role / page / workflow | Admin ? Edit Job / estimate approval, invoice, Complete Work |
| Stopping control | `getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.')` |
| Classification / confidence | INVOICE PRECONDITION ? established |
| Cause and remediation | Snapshot already shows invoice lines, Edit Invoice and Void Invoice. Test assumes No invoice yet. GST/create/completion assertions not reached. |
| Screenshot coverage | [Related surface](SHOT-admin-job-cards-view-dialog.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-estimate-approv-e6ff1-ed-with-per-line-GST-totals.md) |

### VFA-037 ? searchable pickers dismiss outside interactions and still select options

| Attribute | Finding |
|---|---|
| Test / result | `tests/workshopos.spec.ts:2842` ? **timedOut**, 30.196s |
| Role / page / workflow | Reception; planned Admin later ? Intake, material and Data Flow searchable pickers |
| Stopping control | `getByRole('dialog', { name: 'Create New Visit' }).getByRole('listbox').getByRole('option', { name: /Rahul Sharma/ })` |
| Classification / confidence | FIXTURE ? established |
| Cause and remediation | Waits for absent Rahul Sharma option. Initial outside-dismiss may execute; subsequent material and Data Flow picker checks are not reached. |
| Screenshot coverage | [Related surface](SHOT-reception-today-queue-new-visit-dialog.png); exact failed/post-save state **UNVERIFIED** |
| Blocks capture / design / implementation | G1: complete behavior-baseline sign-off blocked; static capture allowed; no independent architecture blocker; affected integration acceptance blocked |
| Original evidence | [Failure context](../../data-migration/evidence/browser-test-failures/workshopos-searchable-pick-254cf-ns-and-still-select-options.md) |

## Relationship to the three report-template unit failures

There is **no demonstrated causal relationship**. The 244-unit-test run had 241 passes and three default-count failures; [14](14-TEST-BASELINE-ISSUES.md) established eight unique templates, six active categories and stale six-template expectations. The 87 browser cases are a separate runner/report. Its `report templates preview safely, validate, activate and persist` case passed. Browser document tests stop at missing invoice controls, unavailable cards or document chips before the relevant downstream rendering. Do not subtract the three unit failures from 37 browser failures or claim fixing default counts resolves this suite.

## Screenshot and control-count reconciliation

The [screen manifest](evidence-screenshots.md) contains **94 current-source images**: 93 file-bearing role/state entries in `evidence-browser.json.md` plus `screen-source-login.png`. JSON contains 96 entries because three failed Sales CRM navigation attempts were retained as metadata and later resolved by captures. The separate `screen-login.png` compiled-build diagnostic is not an approved-source image. All 93 file references exist. The three capture-harness locator errors are not the 17 Playwright test timeouts.

There are **6,920 recorded DOM control occurrences** across the 93 file-bearing capture entries. These include repeated navigation, filters and controls across states; they are not unique verified actions. The source inventory's **1,122 control declaration sites**, **52 form sites**, **533 field declarations**, **32 page keys** and **46 workflow families** use different units. A declaration can render many repeated row controls or no control under a condition; screenshots can repeat the same declaration. No numerical coverage percentage such as 87/1,122 or 6,920/1,122 is meaningful. The action ledger records component-scoped candidate dependencies, not proven handler-level execution coverage.

The 94 screenshots cover related default surfaces for the failures, as linked per issue, but do **not** adequately cover the failed/unreached workflows: saved record persistence, partial receipts/approvals, zero-return acknowledgement, invoice/payment rollback, downloaded content, popup fallback, keyboard focus restoration and multi-role handoffs. Most captures are desktop; one mobile dashboard cannot establish mobile lists/dialogs. Admin View Job is only a related reference for Edit/rework, not equivalent role/state coverage. No additional screenshots were invented or captured here.

## Important executable regression gaps

Existing executable tests must be distinguished from a passing complete workflow test. Source/unit tests exist for billing atomicity, bookings, inventory, receipt confirmation, materials, snapshots, sales CRM and lifecycle. It would be false to say these domains have no tests at all. However, the 87 browser case catalog below demonstrates gaps:

| Approved capability | Existing evidence | Missing executable browser coverage / acceptance gap |
|---|---|---|
| Service Department Manager permissions/ownership | Source and six role screenshots; team-structure unit tests; Admin creates manager in browser test | Six-role navigation loop omits service_manager login. No independent manager-role command regression case in this run. |
| Sales CRM lead/quotation lifecycle | Source and screenshots; sales-crm unit tests | No browser case for local lead conversion/quotation save/status/print in the 87-case catalog. |
| Booking confirm/reschedule/cancel/no-show/check-in and capacity override | Booking domain unit tests; failed calendar-range case | No end-to-end booking lifecycle/capacity multi-role browser case identified in this suite. |
| Technician task/work update/QC and rework handoff | Technician navigation smoke test; domain tests | No dedicated browser task-completion/QC-rework transaction case; navigation passing is insufficient. |
| Full approved payment ? receipt ? gate pass ? delivery closure | Billing-domain unit tests include atomic success and rollback | Browser document/payment case times out earlier and contains outdated non-closing-payment assumption. No demonstrated passing browser regression of current complete closure. |
| PO receipt/confirmation/accepted stock at closure | Receipt-confirmation/inward/inventory unit tests | Purchase browser cases focus on request/approval/issue and stop early; no complete receipt-confirmation-close stock-posting browser case in catalog. |
| Estimate staged edits, material release/reapproval, follow-up resolution | Browser tests exist | Tests abort before important steps; these are unusable current end-to-end acceptance evidence, not absent test files. |
| Network retry/idempotency, two-tab/actor concurrency and backend parity | Requirements and transaction risk review | No full approved-frontend-to-selected-backend regression; maintained backend/auth baseline is unresolved in 12. |

These are browser-level gaps, not an exhaustive assertion that every lower-layer test is absent. Future work should preserve approved UI, fix fixture/selector/precondition drift in a separately authorized test task, use stable record identities instead of first-row/index assumptions, pin time, and provide an isolated disposable dataset. Then rerun only affected scenarios and restore a full acceptance run once they pass. Do not change demo records, numbering, labels, controls or business rules to satisfy obsolete assertions.

## All 87 original cases

This catalog is the authoritative denominator for this investigation. ?Passed? is the recorded historical result, not a fresh replay or certification of live services.

| Test source | Test case | Result |
|---|---|---|
| `tests/global-users.spec.ts:49` | Cognito login uses authorization-code PKCE and never renders the demo selector | passed |
| `tests/global-users.spec.ts:62` | global User Management invites without passwords, persists, polls, edits, resends, and archives | failed |
| `tests/remote-followups.spec.ts:14` | authenticated Service Advisor uses API-backed Follow-ups and Search | passed |
| `tests/workshopos.spec.ts:49` | reception@example.com can open every role screen | passed |
| `tests/workshopos.spec.ts:49` | service@example.com can open every role screen | passed |
| `tests/workshopos.spec.ts:49` | store@example.com can open every role screen | passed |
| `tests/workshopos.spec.ts:49` | tech@example.com can open every role screen | passed |
| `tests/workshopos.spec.ts:49` | accounts@example.com can open every role screen | passed |
| `tests/workshopos.spec.ts:49` | admin@example.com can open every role screen | passed |
| `tests/workshopos.spec.ts:58` | service Job Cards uses a one-row table toolbar without customer, advisor, or view controls | passed |
| `tests/workshopos.spec.ts:86` | service My Queue is a responsive active-job table with direct record actions | failed |
| `tests/workshopos.spec.ts:127` | advance bookings are limited to the next two complete months | failed |
| `tests/workshopos.spec.ts:165` | Accounts Ready To Invoice lists only active pending invoices and is read only | passed |
| `tests/workshopos.spec.ts:183` | desktop main content scrolls without moving the navigation rail | passed |
| `tests/workshopos.spec.ts:205` | desktop navigation scrolls independently in a short viewport | passed |
| `tests/workshopos.spec.ts:221` | admin hides customer and vehicle pages from its navigation rail | passed |
| `tests/workshopos.spec.ts:229` | saved Store page access immediately removes Purchase Orders from its inventory navigation | passed |
| `tests/workshopos.spec.ts:244` | admin dashboard presents live metrics in an accessible command-center grid | passed |
| `tests/workshopos.spec.ts:354` | reception creates a linked customer vehicle visit and job searchable after reload | timedOut |
| `tests/workshopos.spec.ts:448` | admin can open the management hub and create a user | failed |
| `tests/workshopos.spec.ts:462` | list filters expose Clear but no Search submit action | passed |
| `tests/workshopos.spec.ts:473` | Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe | passed |
| `tests/workshopos.spec.ts:527` | admin service task subtabs and role filters stay compact on desktop and stack on mobile | passed |
| `tests/workshopos.spec.ts:599` | Management Hub Job Cards filters estimated delivery dates, months, archived records, and clears | passed |
| `tests/workshopos.spec.ts:639` | direct Job Cards uses one clear two-row filter toolbar | passed |
| `tests/workshopos.spec.ts:711` | Job Card entry defaults to a local month with no jobs and Clear shows all months | passed |
| `tests/workshopos.spec.ts:738` | search shows an explicit empty state without an unrelated job | passed |
| `tests/workshopos.spec.ts:747` | service Search retains its four record categories without the underlying page grants | passed |
| `tests/workshopos.spec.ts:776` | search combines entity and lifecycle filters and clears predictably | passed |
| `tests/workshopos.spec.ts:850` | admin Search exposes operational workspaces without restoring hidden rail entries | passed |
| `tests/workshopos.spec.ts:878` | Search gives delegated categories the shared filter grid without changing their filters | passed |
| `tests/workshopos.spec.ts:926` | non-admin Search keeps its existing category availability | passed |
| `tests/workshopos.spec.ts:935` | admin loads the deterministic large dataset and paginates core lists | failed |
| `tests/workshopos.spec.ts:969` | core entity lists switch views and expose deterministic totals | failed |
| `tests/workshopos.spec.ts:999` | media filters use the linked job received date and scope job cards to the advisor | passed |
| `tests/workshopos.spec.ts:1032` | mobile lists use cards, compact pagination and no horizontal overflow | failed |
| `tests/workshopos.spec.ts:1047` | opening a paginated record and returning preserves list state | timedOut |
| `tests/workshopos.spec.ts:1062` | job dialogs expose distinct modes, documents, focus return and shared search entry | passed |
| `tests/workshopos.spec.ts:1084` | Job Cards grid uses direct, permission-aware view, edit and archive actions | passed |
| `tests/workshopos.spec.ts:1114` | job card document actions stack editors, replace creation actions after save, and download financial PDFs | timedOut |
| `tests/workshopos.spec.ts:1193` | customer and vehicle records use distinct view and edit dialogs on every list surface | passed |
| `tests/workshopos.spec.ts:1232` | Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states | timedOut |
| `tests/workshopos.spec.ts:1288` | Data Flow filters and suggestions stay within a mobile viewport | passed |
| `tests/workshopos.spec.ts:1303` | admin management domains expose contextual creation paths | passed |
| `tests/workshopos.spec.ts:1318` | Accounts billing lists include records received outside today and print colored documents | passed |
| `tests/workshopos.spec.ts:1349` | Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination | passed |
| `tests/workshopos.spec.ts:1445` | Manage Job Cards uses view and edit dialogs with documents and confirmed archive | passed |
| `tests/workshopos.spec.ts:1478` | admin receives readable duplicate user validation | passed |
| `tests/workshopos.spec.ts:1494` | contextual create actions remain visible on mobile role screens | passed |
| `tests/workshopos.spec.ts:1506` | store stock and material requests combine search with domain filters | failed |
| `tests/workshopos.spec.ts:1535` | stock filter toolbars use no more than two rows above mobile | passed |
| `tests/workshopos.spec.ts:1556` | Store cannot bypass the Purchase Order workflow with direct Stock Inward | passed |
| `tests/workshopos.spec.ts:1567` | Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests | passed |
| `tests/workshopos.spec.ts:1582` | issue and reconcile lists filter by item and reconciliation state | timedOut |
| `tests/workshopos.spec.ts:1597` | material record queues use compact rows and issue actions do not open their row | failed |
| `tests/workshopos.spec.ts:1620` | store reconciliation states use status pills and shared table actions | failed |
| `tests/workshopos.spec.ts:1629` | reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation | timedOut |
| `tests/workshopos.spec.ts:1670` | store material queues default to today and keep record filters, exports and workflows in sync | timedOut |
| `tests/workshopos.spec.ts:1732` | PDF and Excel downloads use the current filtered rows and visible columns | failed |
| `tests/workshopos.spec.ts:1764` | store pagination resets after filtering | passed |
| `tests/workshopos.spec.ts:1778` | admin user CRUD persists and protects the signed-in admin | timedOut |
| `tests/workshopos.spec.ts:1800` | Team Structure creates departments and manages appointed manager advisor teams responsively | failed |
| `tests/workshopos.spec.ts:1858` | company settings validate, preview, reset and persist report assets | passed |
| `tests/workshopos.spec.ts:1894` | App Theme previews, saves live UI tokens, and restores the default | passed |
| `tests/workshopos.spec.ts:1920` | tax and billing settings validate, normalize, persist, audit and drive invoice print | timedOut |
| `tests/workshopos.spec.ts:1977` | report templates preview safely, validate, activate and persist | passed |
| `tests/workshopos.spec.ts:2025` | job documents download financial PDFs, print other templated reports and explain blocked popups | failed |
| `tests/workshopos.spec.ts:2058` | job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note | failed |
| `tests/workshopos.spec.ts:2085` | lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment | timedOut |
| `tests/workshopos.spec.ts:2162` | estimate dialog stages item CRUD and persists only on Save | timedOut |
| `tests/workshopos.spec.ts:2191` | service advisor Job Card defaults to the current delivery month | passed |
| `tests/workshopos.spec.ts:2217` | service follow-ups show all assigned jobs and resolve the earlier open contact | failed |
| `tests/workshopos.spec.ts:2254` | job card media validates, compresses, edits, archives, stays session-only, and responds on mobile | passed |
| `tests/workshopos.spec.ts:2344` | Developer Console manages demo tenants, messages, billing and writable role emulation | passed |
| `tests/workshopos.spec.ts:2381` | linked advisor can change job media while other authorized job viewers are read only | passed |
| `tests/workshopos.spec.ts:2410` | fresh demo data provides a multi-supplier price review before PO approval | failed |
| `tests/workshopos.spec.ts:2430` | Store creates a Purchase Request without supplier access or later-stage actions | failed |
| `tests/workshopos.spec.ts:2461` | Admin can create a Purchase Request | failed |
| `tests/workshopos.spec.ts:2474` | Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form | passed |
| `tests/workshopos.spec.ts:2489` | Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request | timedOut |
| `tests/workshopos.spec.ts:2517` | Admin approves a New Item Request with a supplier, price, and zero-stock SKU | timedOut |
| `tests/workshopos.spec.ts:2550` | Admin issues an approved Purchase Order and both roles can see its Supplier Basket context | timedOut |
| `tests/workshopos.spec.ts:2707` | job sheet intake fields and damage marks persist through the Job Card edit dialog | failed |
| `tests/workshopos.spec.ts:2752` | owner adds, requests and cancels a material row with an over-stock warning | timedOut |
| `tests/workshopos.spec.ts:2775` | Store releases a requested row, then Admin edits it as Issued with a note | timedOut |
| `tests/workshopos.spec.ts:2815` | estimate approval and invoice creation enable Completed with per-line GST totals | failed |
| `tests/workshopos.spec.ts:2842` | searchable pickers dismiss outside interactions and still select options | timedOut |

## Decision and remaining uncertainty

Final read-only verification: all eight SQLite file hashes still match Stage 1.5; every relative document/screenshot/failure-context link in this report resolves. Tracked `git diff --name-only` still lists only the pre-existing `AGENTS.md` change. The 61-file source manifest contains no test files, so its successful comparison must not be represented as a hash verification of the historical test source. Original error contexts preserve the failing snippets; exact served bundle and full historical test revision remain qualified above. All Graft calls in this follow-up used `--no-refresh`.

The failed run does not invalidate the approved visual baseline, but it **does invalidate any claim that the approved workflows have a clean, complete browser regression baseline**. Preserve current screenshots as observed references; do not call unexecuted steps verified. Most established causes concern test/data contracts, while unresolved cases retain application-defect possibility. No application defect was conclusively established by this follow-up's safe probes.

Final architecture remains subject to the backend/data-ownership blockers in [15](15-MIGRATION-RISK-REGISTER.md). This test report adds conditional blockers for unresolved actor/status/action contracts; it does not justify redesign. Backend implementation acceptance for affected financial, inventory, intake, approval and role workflows requires executable parity coverage. No source, test, database, configuration or dependency changes were made; no server was launched, browser storage cleared, records altered, commit or push performed. Stop for review.
