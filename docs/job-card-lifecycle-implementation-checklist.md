# Job Card Lifecycle Implementation Checklist

Status: Complete (2026-09-25)
Started: 2026-09-24
Repository: `WorkshopOS`
Baseline commit: `b1d0cd04d648f3615b444bb05e50938e5b7eb87c` (`Prem-dev-fbb`)
Latest handoff: `%TEMP%\workshopos-job-card-lifecycle-wp9-handoff.md`

This file is the authoritative execution record for the Job Card lifecycle, billing, media, documents, and Data Flow implementation. Update it after every work package with the exact files changed, verification results, evidence, and next handoff.

## Baseline protection

The following changes existed before this implementation began and must be preserved. No package may revert, overwrite, or claim ownership of them without first establishing that its edit is required and compatible.

- Modified: `src/App.tsx`, `src/admin-console.tsx`, `src/admin-demo-state.ts`, `src/list-utils.ts`, `src/styles.css`, `src/ui-kit.tsx`, `tests/workshopos.spec.ts`, `unit-tests/admin-demo-state.test.ts`, `unit-tests/list-utils.test.ts`.
- Untracked: `AGENTS.md`, `docs/data-flow-implementation-checklist.md`, `docs/report-templates-implementation-checklist.md`, `src/data-flow.ts`, `src/job-documents.ts`, `src/report-templates.ts`, `unit-tests/data-flow.test.ts`, `unit-tests/job-documents.test.ts`, `unit-tests/report-templates.test.ts`.
- Tracked worktree diff at baseline: 9 files, 1,240 insertions, 227 deletions; binary-patch SHA-1 `1dea450e87e9a4da966f71c88045ef50b4316a70`.
- Staged diff at baseline: empty; SHA-1 `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`.
- Untracked-file content hashes are recorded in the WP1 handoff rather than duplicated here.

## WP1 — Baseline and Graft

Status: Complete (2026-09-24)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Capture the pre-implementation worktree and diff baseline | Complete | None | Commit, branch, modified/untracked paths, diff statistics, patch hash, and untracked hashes captured before repository edits | WP1 handoff |
| Repair the broken Graft CLI shim/package | Complete | Global npm installation only; no repository file | Restored `@nanonets/graft@0.19.0`; `graft --version`, `graft map`, `graft ask ... --source`, and `graft callers setJobStatus --depth 2` succeeded | WP1 handoff |
| Establish passing build baseline | Complete | None | `npm run build`: pass; 1,934 modules transformed; existing >500 kB chunk warning only | WP1 handoff |
| Establish passing unit baseline | Complete | None | `npm run test:unit`: 32 passed, 0 failed | WP1 handoff |
| Establish passing Playwright baseline | Complete | None | `npm run test:e2e`: 33 passed, 0 failed (40.3 s) | WP1 handoff |
| Establish passing requirement-harness baseline | Complete | None | `npm run test:harness`: 119 requirements, 29 slices, 29 contiguous complete, no orphans | WP1 handoff |
| Create the living implementation record | Complete | `docs/job-card-lifecycle-implementation-checklist.md` | This file exists and contains all work packages, verification gates, and the next unchecked item | WP1 handoff |
| Create the redacted temporary handoff | Complete | Windows temporary directory only | `C:\Users\PREMDEEP\AppData\Local\Temp\workshopos-job-card-lifecycle-wp1-handoff.md` | WP1 handoff |

Graft evidence for later work:

- `src/db.ts:977-980` defines the current `setJobStatus` mutation hub.
- `graft callers setJobStatus --depth 2` reports 16 direct domain callers, including estimate, material, task, follow-up, QC, photo, invoice, payment, receipt/gate-pass, hold, cancel, resume, and reopen flows.
- `src/App.tsx:1966-2025` contains the current editable status/sub-status controls and lifecycle actions.
- `src/db.ts:732-740` currently couples receipt/gate-pass generation to a direct CLOSED transition.
- `scripts/verify-harness.mjs:24-75` verifies the 119-requirement/29-slice harness and clean traceability marker.

## WP2 — Lifecycle storage and migrations

Status: Complete (2026-09-24)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Change `MainStatus` to `NEW \| IN_PROGRESS \| COMPLETED \| CLOSED \| CANCELLED` and remove HOLD from types, filters, seeds, and actions | Complete | `src/types.ts`, `src/db.ts`, `src/App.tsx`, `unit-tests/job-documents.test.ts` | Five-key transition table asserted; source grep leaves HOLD only in migration/test evidence; TypeScript/Vite build and 33 Playwright tests pass | WP2 handoff |
| Add checklist-cycle and checklist-item storage with stage, cycle number, order, checked actor/time, started time, and completed time | Complete | `src/types.ts`, `src/db.ts`, `unit-tests/lifecycle-model.test.ts` | Schema/migration test asserts ordered records and all actor/time fields | WP2 handoff |
| Make checklist records authoritative while deriving `job_cards.sub_status` for compatibility | Complete | `src/db.ts`, `unit-tests/lifecycle-model.test.ts` | Derivation, checked-item update, and legacy-edit rejection tests pass | WP2 handoff |
| Normalize existing HOLD jobs to IN_PROGRESS with an audit note | Complete | `src/db.ts`, `unit-tests/lifecycle-model.test.ts` | Repeated migration yields one audit note, no HOLD history/current status, and one checklist cycle | WP2 handoff |
| Add deterministic lifecycle seed data and migration coverage | Complete | `src/db.ts`, `unit-tests/lifecycle-model.test.ts` | Two independent 144-job seed databases produce identical lifecycle snapshots; full unit suite 37/37 passes | WP2 handoff |

WP3 completed the transition-service boundary described below. The next unchecked item is WP4 — replace editable lifecycle fields with the role-aware Job Card lifecycle UI.

## WP3 — Transition service

Status: Complete (2026-09-24)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Add one transaction-safe transition API with allowed transitions, required notes, checklist gates, terminal states, and audit history | Complete | `src/db.ts`, `unit-tests/lifecycle-transition.test.ts` | `transitionJobStatus` uses a savepoint; complete transition matrix, note/gate/terminal validation, exact audit timestamps, and forced-trigger rollback pass in 6 focused tests | WP3 handoff |
| Remove independent main-status advancement from material, task, QC, estimate, photo, and invoice operations | Complete | `src/db.ts`, `unit-tests/lifecycle-transition.test.ts` | Graft caller audit leaves no `setJobStatus` implementation/callers; domain artifact flow proves all named operations leave main status unchanged | WP3 handoff |
| Implement cancellation bypass and artifact-driven checklist completion | Complete | `src/db.ts`, `unit-tests/lifecycle-transition.test.ts` | Sequential check/uncheck guards, cancellation with an incomplete checklist, ordered artifact reconciliation, and explicit forward gates pass | WP3 handoff |
| Implement fresh IN_PROGRESS and COMPLETED cycles on rework while preserving history | Complete | `src/db.ts`, `unit-tests/lifecycle-transition.test.ts` | Completed-to-in-progress-to-completed test retains cycle 1 and audit rows while creating completed cycle 2 | WP3 handoff |

## WP4 — Job Card UI

Status: Complete (2026-09-24)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Replace editable status/sub-status fields with a disabled main-status display | Complete | `src/App.tsx` | Playwright asserts disabled Main Status and no Sub Status editor | WP4 handoff |
| Add ordered checklist, timestamps, sequential unlocking, and remaining-step summary | Complete | `src/App.tsx`, `src/styles.css`, `src/ui-kit.tsx` | Ordered active-cycle UI shows start/completion actor/time; domain ordering plus Playwright checklist/summary coverage pass | WP4 handoff |
| Add lifecycle buttons with confirmation dialogs and mandatory notes | Complete | `src/App.tsx`, `src/ui-kit.tsx`, `tests/workshopos.spec.ts` | Allowed-transition buttons only; dialog initial focus and inline required-note validation pass in Playwright | WP4 handoff |
| Add Create/Edit Estimate dialog with item CRUD, quantity, rate, discount, GST, notes, Save, and Cancel | Complete | `src/App.tsx`, `src/db.ts`, `src/styles.css`, `unit-tests/job-card-ui-domain.test.ts`, `tests/workshopos.spec.ts` | Cancel leaves persisted estimate unchanged; Save atomically replaces active items and reconciles Create Estimate only after persistence | WP4 handoff |
| Restrict lifecycle/checklist/estimate changes to Owner and linked Service Advisor | Complete | `src/App.tsx`, `src/db.ts`, `unit-tests/job-card-ui-domain.test.ts`, `tests/workshopos.spec.ts` | Direct domain denial for unlinked Service Advisor and Accounts; UI reassignment proves unlinked queue exclusion while linked advisor retains actions | WP4 handoff |

## WP5 — Invoice and payment domain

Status: Complete (2026-09-24)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Add independently editable invoice items copied once from the estimate | Complete | `src/types.ts`, `src/db.ts`, `src/job-documents.ts`, `src/report-templates.ts`, `unit-tests/billing-domain.test.ts` | Copy occurs once into invoice-owned rows; later estimate and invoice edits are independent; document/report projections use invoice-owned items | WP5 handoff |
| Add invoice totals, GST, notes, document availability, and Open/Partial/Cleared status | Complete | `src/types.ts`, `src/db.ts`, `src/job-documents.ts`, `src/report-templates.ts`, `unit-tests/billing-domain.test.ts` | Exact subtotal, overall discount/GST, total, fields, document flag, and derived statuses pass focused tests | WP5 handoff |
| Add payments with modes, Other detail, reference, notes, edit, and reasoned void | Complete | `src/types.ts`, `src/db.ts`, `unit-tests/billing-domain.test.ts` | UPI/Cash/Card/Other validation, required Other detail, invoice linkage, edit, notes/reference, blank-reason rejection, and retained void history pass | WP5 handoff |
| Prevent overpayment and lock invoice financials after the first active payment | Complete | `src/db.ts`, `unit-tests/billing-domain.test.ts` | Create/edit overpayment is rejected; item and financial-field mutations lock after the first active payment while non-financial document metadata remains maintainable | WP5 handoff |
| Atomically clear paid invoices, generate receipt/gate pass, complete checklist items, and close jobs | Complete | `src/db.ts`, `unit-tests/billing-domain.test.ts`, `unit-tests/lifecycle-transition.test.ts` | Savepoint-backed cumulative full payment clears the invoice, creates current documents, completes Payment/Receipt/Gate Pass evidence, closes through the transition boundary, leaves Delivered manual, and fully rolls back on a forced gate-pass failure | WP5 handoff |
| Reopen underpaid corrected invoices to COMPLETED and void stale documents with a billing-correction cycle | Complete | `src/db.ts`, `unit-tests/billing-domain.test.ts` | Edit/void correction reopens through the audited system boundary, preserves payment/document history with reasons, clears `closed_at`, and creates COMPLETED cycle 2 carrying verified evidence | WP5 handoff |

## WP6 — Manage and Accounts CRUD

Status: Complete (2026-09-24)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Replace the combined Manage billing area with global Invoices, Payments, and Delivery tabs | Complete | `src/App.tsx`, `src/billing-manager.tsx`, `tests/workshopos.spec.ts` | Manage exposes three independent global tabs; navigation regression and all role-screen tests pass | WP6 handoff |
| Add searchable, filterable, paginated Create/View/Edit/Void workflows across jobs | Complete | `src/billing-manager.tsx`, `src/styles.css`, `tests/workshopos.spec.ts` | Shared lists cover all jobs, status/mode/delivery filters, explicit search, pagination/export, dialogs, reasoned voids, gate-pass state, and manual Delivered action | WP6 handoff |
| Reuse managers on Accounts screens | Complete | `src/App.tsx`, `src/billing-manager.tsx`, `tests/workshopos.spec.ts` | `data-billing-manager` identity and one shared component are exercised through both Manage and Accounts navigation | WP6 handoff |
| Restrict billing mutations to Owner and Accounts while preserving authorized read views | Complete | `src/db.ts`, `src/billing-manager.tsx`, `unit-tests/billing-domain.test.ts`, `tests/workshopos.spec.ts` | Domain wrappers reject Service Advisor, Reception, and Store; Owner/Admin and Accounts succeed; UI derives mutation controls from the same role rule | WP6 handoff |

## WP7 — Photos and media

Status: Complete (2026-09-25)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Add Before Work and After Work media subtabs | Complete | `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts` | Job Card dialog and advisor media surface expose accessible phase tabs; focused and full Playwright suites pass | WP7 handoff |
| Validate and compress accepted images to bounded data URLs in the client session database | Complete | `src/job-media.ts`, `src/db.ts`, `src/types.ts`, `unit-tests/job-media.test.ts`, `tests/workshopos.spec.ts` | JPEG/PNG/WebP MIME and magic-byte checks, 10 MB input limit, canvas resize/quality loop, 1 MB output bound, SQL.js live-session retention, vacuumed durable-snapshot exclusion, and reload removal pass | WP7 handoff |
| Allow Owner/linked Service Advisor mutation and all authorized job viewers read access | Complete | `src/App.tsx`, `src/db.ts`, `unit-tests/job-media.test.ts`, `tests/workshopos.spec.ts` | Actor-authorized create/edit/archive APIs reject unlinked Service Advisor and Accounts; owner and linked advisor succeed; operational job viewers reach a read-only Job Card media tab | WP7 handoff |
| Add responsive media gallery and archive/edit workflows | Complete | `src/App.tsx`, `src/styles.css`, `unit-tests/job-media.test.ts`, `tests/workshopos.spec.ts` | Metadata edit, reasoned archive, focus, labels, live feedback, 390 px gallery containment, session navigation, archive evidence reconciliation, and no implicit main-status transition pass | WP7 handoff |

## WP8 — Documents and Data Flow

Status: Complete (2026-09-25)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Surface current Estimate, Invoice, Payment Receipt, and Gate Pass PDFs while retaining Job Card print | Complete | `src/App.tsx`, `src/job-documents.ts`, `src/report-templates.ts`, `src/styles.css`, `unit-tests/job-documents.test.ts`, `unit-tests/report-templates.test.ts`, `tests/workshopos.spec.ts` | Current document actions are available in Job Card and Data Flow; focused document/report tests and templated-report Playwright coverage pass | WP8 handoff |
| Exclude regenerated or voided financial documents from current-document views | Complete | `src/db.ts`, `src/types.ts`, `src/job-documents.ts`, `src/report-templates.ts`, `unit-tests/billing-domain.test.ts`, `unit-tests/job-documents.test.ts`, `tests/workshopos.spec.ts` | Active projections remain filtered; separate audit histories retain voided rows; invoice/receipt/gate-pass linkage and document-availability guards reject stale actions | WP8 handoff |
| Build one chronological Data Flow timeline for checklist, status, estimates, invoices, payments, documents, and media | Complete | `src/data-flow.ts`, `src/App.tsx`, `src/db.ts`, `src/types.ts`, `src/styles.css`, `unit-tests/data-flow.test.ts`, `tests/workshopos.spec.ts` | Deterministic ascending timeline covers checklist starts/completions with actor/time, status notes, financial events, generated/voided documents, and media upload/edit/archive; unit and Playwright ordering/content assertions pass | WP8 handoff |
| Show active stage and ordered remaining steps | Complete | `src/data-flow.ts`, `src/App.tsx`, `src/styles.css`, `unit-tests/data-flow.test.ts`, `tests/workshopos.spec.ts` | Active cycle/stage, current step, and ordered remaining steps pass focused unit and responsive browser coverage | WP8 handoff |

## WP9 — UI quality and final verification

Status: Complete (2026-09-25)

| Item | Status | Files affected | Tests / evidence | Handoff |
|---|---|---|---|---|
| Complete responsive and accessible styling for all new surfaces | Complete | `src/App.tsx`, `src/billing-manager.tsx`, `src/styles.css`, `src/ui-kit.tsx`, `tests/workshopos.spec.ts` | Topmost-only nested-dialog focus trap/Escape/body lock, focus restoration, labelled dialogs/tabpanels, roving tabs with arrows/Home/End, labelled controls and alerts, 42–44 px actions, teal lifecycle styling, and 390 px page containment pass in Playwright | WP9 handoff |
| Close final lifecycle/data-history quality gaps found by parallel audits | Complete | `src/db.ts`, `src/data-flow.ts`, `src/types.ts`, `src/billing-manager.tsx`, `unit-tests/billing-domain.test.ts`, `unit-tests/data-flow.test.ts`, `unit-tests/job-card-ui-domain.test.ts`, `tests/workshopos.spec.ts` | Actor-authorized job edit/archive; cleared rework auto-closes on COMPLETED; terminal events do not fabricate same-time edits; invoice generation evidence survives availability changes; payment candidate state resets | WP9 handoff |
| Run TypeScript/Vite build and all unit tests | Complete | Verification only | `npm run build`: pass, 1,935 modules; `npm run test:unit`: 70/70 pass | WP9 handoff |
| Run 119-requirement harness and full Playwright suite | Complete | Verification only | `npm run test:harness`: 119 requirements, 29 slices, 29 contiguous complete, no orphans; `npm run test:e2e`: 41/41 pass in 51.6 s | WP9 handoff |
| Perform final requirements-to-checklist audit and remove debug artifacts | Complete | `harness/06-traceability.md` (verified, unchanged) | `TRACEABILITY: CLEAN`; source/debug scan found no source console logging, debugger, TODO, FIXME, or HACK residue; `git diff --check` passes | WP9 handoff |
| Refresh repository context with `graft build` | Complete | `graft/` generated index | Successful build and final WP9 query recorded below | WP9 handoff |
| Mark the registered goal complete only after every gate succeeds | Complete | Goal state and living checklist | Coordinator incorporated the independent standards/spec audits, verified every finding was fixed, then reran build, 70/70 unit tests, the 119-requirement harness, 41/41 Playwright tests, `git diff --check`, and `graft build` successfully | WP9 handoff |

## Verification history

| Date | Package | Command | Result |
|---|---|---|---|
| 2026-09-24 | WP1 | `npm run build` | Pass; Vite 7.3.6, 1,934 modules; existing chunk-size warning |
| 2026-09-24 | WP1 | `npm run test:unit` | Pass; 32/32 |
| 2026-09-24 | WP1 | `npm run test:e2e` | Pass; 33/33 in 40.3 s |
| 2026-09-24 | WP1 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-24 | WP2 | `npx tsx --test unit-tests/lifecycle-model.test.ts` | Pass; 5/5 lifecycle storage/model tests |
| 2026-09-24 | WP2 | `npm run test:unit` | Pass; 37/37 |
| 2026-09-24 | WP2 | `npm run build` | Pass; Vite 7.3.6, 1,933 modules; existing chunk-size warning |
| 2026-09-24 | WP2 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-24 | WP2 | `npm run test:e2e` | Pass; 33/33 in 41.4 s |
| 2026-09-24 | WP2 | `git diff --check` | Pass |
| 2026-09-24 | WP2 | `graft build` and lifecycle query | Pass; 33 files, 549 nodes, 1,255 edges; new storage symbols indexed |
| 2026-09-24 | WP3 | `npx tsx --test unit-tests/lifecycle-transition.test.ts` | Pass; 6/6 transition, ordering, rollback, rework, and artifact tests |
| 2026-09-24 | WP3 | `npm run test:unit` | Pass; 43/43 |
| 2026-09-24 | WP3 | `npm run build` | Pass; Vite 7.3.6, 1,933 modules; existing chunk-size warning only |
| 2026-09-24 | WP3 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-24 | WP3 | `npm run test:e2e` | Pass; 33/33 in 1.0 min |
| 2026-09-24 | WP3 | `git diff --check` | Pass |
| 2026-09-24 | WP3 | `graft build` and transition-service query | Pass; 34 files, 558 nodes, 1,306 edges; `transitionJobStatus` indexed and no `setJobStatus` occurrence remains |
| 2026-09-24 | WP4 | `npx tsx --test unit-tests/job-card-ui-domain.test.ts` | Pass; 2/2 authorization and estimate persistence tests |
| 2026-09-24 | WP4 | `npm run test:unit` | Pass; 51/51 |
| 2026-09-24 | WP4 | `npm run build` | Pass; Vite 7.3.6, 1,933 modules; existing chunk-size warning only |
| 2026-09-24 | WP4 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-24 | WP4 | `npm run test:e2e` | Pass; 36/36 in 1.1 min |
| 2026-09-24 | WP4 | `git diff --check` | Pass |
| 2026-09-24 | WP4 | `graft build`, WP4 query, and `graft grep "saveEstimateForActor"` | Pass; 35 files, 578 nodes, 1,354 edges; lifecycle UI and actor-authorized estimate save indexed |
| 2026-09-24 | WP5 | `npx tsx --test unit-tests/billing-domain.test.ts` | Pass; 7/7 calculation, copy-once independence, validation, payment, rollback, correction, and history tests |
| 2026-09-24 | WP5 | `npm run test:unit` | Pass; 58/58 |
| 2026-09-24 | WP5 | `npm run build` | Pass; Vite 7.3.6, 1,933 modules; existing chunk-size warning only |
| 2026-09-24 | WP5 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-24 | WP5 | `npm run test:e2e` | Pass; 37/37 in 1.2 minutes |
| 2026-09-24 | WP5 | `git diff --check` | Pass |
| 2026-09-24 | WP5 | `graft build`, WP5 query, and `graft grep "transitionJobStatusForBillingCorrection"` | Pass; 36 files, 604 nodes, 1,457 edges; billing correction boundary and invoice-owned document projections indexed |
| 2026-09-24 | WP6 | `npx tsx --test unit-tests/billing-domain.test.ts` | Pass; 9/9 invoice/payment, authorization-boundary, and manual-delivery tests |
| 2026-09-24 | WP6 | `npm run test:unit` | Pass; 60/60 |
| 2026-09-24 | WP6 | `npm run build` | Pass; Vite 7.3.6, 1,934 modules; existing chunk-size warning only |
| 2026-09-24 | WP6 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-24 | WP6 | `npm run test:e2e` | Pass; 38/38 in 1.3 minutes |
| 2026-09-24 | WP6 | `git diff --check` | Pass |
| 2026-09-24 | WP6 | `graft build` and WP6 query | Pass; shared `BillingManager`, actor-authorized billing APIs, and manual Delivered boundary indexed |
| 2026-09-25 | WP7 | `npx tsx --test unit-tests/job-media.test.ts unit-tests/lifecycle-transition.test.ts` | Pass; 10/10 media validation, size, persistence, permissions, archive, checklist-evidence, and no-status-advance tests |
| 2026-09-25 | WP7 | `npx playwright test tests/workshopos.spec.ts -g "job card media\|linked advisor can change job media"` | Pass; 2/2 upload/compression/session/edit/archive/responsive and role-access tests |
| 2026-09-25 | WP7 | `npm run test:unit` | Pass; 64/64 |
| 2026-09-25 | WP7 | `npm run build` | Pass; Vite 7.3.6, 1,935 modules; existing chunk-size warning only |
| 2026-09-25 | WP7 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-25 | WP7 | `npm run test:e2e` | Pass; 40/40 in 1.4 minutes |
| 2026-09-25 | WP7 | `git diff --check` | Pass |
| 2026-09-25 | WP7 | `graft build`, WP7 query, and `graft grep "saveJobPhotoForActor"` | Pass; 39 files, 651 nodes, 1,591 edges; media compression, actor-authorized persistence, session boundary, and UI symbols indexed |
| 2026-09-25 | WP8 | `npx tsx --test unit-tests/data-flow.test.ts unit-tests/job-documents.test.ts unit-tests/report-templates.test.ts unit-tests/billing-domain.test.ts` | Pass; 25/25 timeline, lifecycle-summary, active/stale document, report, and billing-history tests |
| 2026-09-25 | WP8 | `npx playwright test tests/workshopos.spec.ts -g "Data Flow cascades\|Manage and Accounts reuse\|job lifecycle editor"` | Pass; 3/3 chronological Data Flow, void-history, current-document, and lifecycle-summary scenarios |
| 2026-09-25 | WP8 | `npm run test:unit` | Pass; 67/67 |
| 2026-09-25 | WP8 | `npm run build` | Pass; Vite 7.3.6, 1,935 modules; existing chunk-size warning only |
| 2026-09-25 | WP8 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans |
| 2026-09-25 | WP8 | `npm run test:e2e` | Pass; 40/40 in 48.6 seconds |
| 2026-09-25 | WP8 | `git diff --check` | Pass |
| 2026-09-25 | WP8 | `graft build` and WP8 query | Pass; 39 files, 661 nodes, 1,613 edges; current-document resolution, chronological Data Flow, and lifecycle summary indexed |
| 2026-09-25 | WP9 | `npx tsx --test unit-tests/billing-domain.test.ts unit-tests/data-flow.test.ts unit-tests/job-card-ui-domain.test.ts` | Pass; 18/18 focused lifecycle, billing, data-history, and authorization regressions |
| 2026-09-25 | WP9 | `npx playwright test tests/workshopos.spec.ts -g "Manage and Accounts reuse\|lifecycle surfaces provide"` | Pass after billing pagination/search stabilization; 2/2 payment candidate reset, nested focus trap, roving tabs, labels, and mobile containment scenarios |
| 2026-09-25 | WP9 | `npm run build` | Pass; Vite 7.3.6, 1,935 modules; existing >500 kB chunk warning only |
| 2026-09-25 | WP9 | `npm run test:unit` | Pass; 70/70 |
| 2026-09-25 | WP9 | `npm run test:harness` | Pass; 119 requirements, 29 slices, 29 contiguous complete, no orphans; `harness/06-traceability.md` remains `TRACEABILITY: CLEAN` |
| 2026-09-25 | WP9 | `npm run test:e2e` | Pass; 41/41 in 51.6 seconds |
| 2026-09-25 | WP9 | `git diff --check` and debug-residue scan | Pass; no whitespace errors or debug residue; intentional runtime alerts, security fixtures, and verification-script output retained |
| 2026-09-25 | WP9 | `graft build` and final WP9 query | Pass; final counts and query evidence captured in WP9 handoff |
