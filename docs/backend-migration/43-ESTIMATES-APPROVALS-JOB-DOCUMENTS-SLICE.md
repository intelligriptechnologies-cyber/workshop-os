# 43 ? Estimates, Approvals and Job Documents PostgreSQL slice

Date: 2026-10-22. Branch: `Prem-dev-fbb-Go21`. Reviewed HEAD: `ac687e81e984b81e67b27c05f0329e65fba7b886`. Approved frontend reference: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`.

## Outcome and authorization

Integrated existing Estimates, estimate confirmation, material Approvals, job document rendering/snapshots, and job media with the existing isolated FastAPI/PostgreSQL slice. No replacement screens, commit, push, production/staging deployment, original SQLite modification, or local-persistence retirement occurred. Existing uncommitted scratch files and database volumes were retained.

The user clarified that rejection means the existing **material Approvals** workflow; the approved estimate workflow has approval with a note and no separate rejection action. No estimate rejection screen or operation was invented. The user also explicitly approved the narrow secure-storage help text and ?Original media unavailable? state. Those are the only intended visible changes; existing layouts, controls and templates remain in place.

AGENTS.md, the migration README, reports 40?42, workflow/permission contracts and the Graft graph were consulted. The initial scope was the existing slice service/router, versioned migrations, dedicated frontend adapter and minimal existing-handler changes. Regression risks included financial rounding, approved-estimate snapshots, asynchronous save/refresh ordering, role checks, status/checklist updates, browser projection writes and print assets. Verification used disposable PostgreSQL and isolated browser contexts.

## Records and preservation

No repeat import or replacement seed was needed. The API now projects the already imported records:

| Development entity | Preserved records |
|---|---:|
| Customers | 121 |
| Vehicles | 132 |
| Jobs | 145 |
| Estimates | 144 |
| Estimate lines | 144 |
| Historical media metadata | 289 |
| Invoices (read-only projection) | 52 |
| Payments / receipts / gate passes (each) | 27 |

All 103 original development business/custody tables compare identically with the preserved import source. In the disposable test database, 86 unmodified tables, including financial and custody records, compare identically. Original job identifiers and parent relationships remain valid; no missing estimate/job parents were found. All eight original SQLite copies and 94 baseline screenshots retain their hashes. Test-created records and explicit historical-edit tests exist only in `slice_test`.

Pre-migration PostgreSQL backups are retained under ignored `backend/customer-slice/artifacts/pre-estimates-20261022-074315/` (`dev.dump`, `test.dump`). No volume was reset. Rollback must restore a checkpoint into a separate database and reconcile later audited writes; the migrations intentionally do not destructively downgrade. A restore rehearsal was not performed in this batch.

## Backend and database implementation

`estimate_documents.py` implements scoped, authenticated commands using the existing transactional/idempotent command boundary. Server authorization, optimistic versions, job access, validation and audit history protect changes.

- Estimate create/edit replaces active lines by archiving previous lines, preserves numbering (`EST-` plus job number), and retains PostgreSQL relationships. Explicit editing of an approved estimate remains allowed because the approved local editor allows it; its previous approval decision and frozen document remain immutable. No historical financial values are corrected automatically. There is no newly invented hard-delete workflow.
- Calculations preserve local proportional discounts, capped discounts, mixed GST, No GST and two-decimal rounding. `src/invoice-math.ts` is unchanged.
- Estimate confirmation atomically saves approval state, native approval values, the original renderer?s document snapshot, checklist reconciliation and history. It does not automatically advance the main job status.
- Store submission places the job on HOLD. Admin rejection requires a reason and retains HOLD; the linked advisor can resubmit retained eligible requests. Admin approval resumes IN_PROGRESS. Approval, job updates and immutable event history share one transaction. Manual resume cannot bypass pending/rejected approval.
- Media uploads store compressed bytes in PostgreSQL `bytea`, with metadata, hash, creator and same-job foreign keys. Authenticated branch-scoped retrieval uses private/no-store headers. Size, image signature, dimensions, phase, role and version checks are enforced. Archive retains metadata/audit and denies subsequent file retrieval; photo-evidence reset preserves the local checklist timing/N/A behavior.
- Existing templates still generate document HTML/PDF. Approval HTML is validated and frozen server-side; the browser receives a read-only snapshot cache. No historical PDF or missing original image is fabricated.
- Task-list estimate prefill reads PostgreSQL tasks and prevents duplicate task lines. Approved-estimate prefill is rejected. Nonempty task prefill has not received an end-to-end browser test in this batch because task editing remains outside the integrated write scope.

Migrations `20261022_0043_estimates_media` and `20261022_0044_media_relationship` are applied to dev/test. They narrowly extend audited operational edit permissions, preserve imported identity/provenance, create immutable media-byte storage with RLS, grant material approval/event operations and read-only linked projections, and enforce media/job consistency. Current slice head is 0044. `migrate_slice.py` applies existing-volume migrations without restoring or seeding data.

## Frontend integration and changed files

Protected frontend files changed in this batch:

| File | Necessary integration change |
|---|---|
| `src/App.tsx` | Existing save/approve/material/media/prefill handlers call the adapter; await refreshed projection before closing; approved media text/unavailable state only. |
| `src/db.ts` | Read-only projections for integrated/linked data; new cache key excludes projected business rows; retain all prior storage keys. Reinstall temporary write guards after SQL.js export, which otherwise discards those guards. |
| `src/document-snapshots.ts` | Hydrate server snapshots in memory and prevent browser snapshot writes in API mode; original local behavior retained. |

`src/estimate-documents-api.ts` is the new dedicated adapter. `src/operations-api.ts` maps versions, snapshots and media availability into existing shapes. No styling or template files changed. Compared with the approved commit, 110 of 115 protected files are identical; `src/job-sheet-ui.tsx` and `vite.config.ts` are pre-existing differences from earlier work and were not changed in this batch.

Other implementation files: `backend/customer-slice/api.py`, `operations.py`, `operational-mapping.json`, new `estimate_documents.py`, `migrate_slice.py`, and the two migrations above.

New verification files in `backend/customer-slice/`: `calculation_reference.ts`, `test_calculation_parity.py`, `test_estimate_documents.py`, `test_material_approvals.py`, `test_estimate_browser.mjs`, `test_approval_browser.mjs`, `test_document_restart.mjs`, `test_estimate_storage.mjs`, `test_estimate_visual.mjs`, `compare_estimate_visual.py`, `verify_estimate_preservation.py`. Existing customer/vehicle browser tests only change their cache-key lookup to the new integration key; behavioral assertions remain intact. Documentation changes are this report, both migration/slice READMEs and the evidence appendix. Graft metadata is refreshed after implementation.

The new cache key is `workshopos.sqlite.estimates-api.v1`. Previous operations/customer/original snapshots are retained and used only for compatible unintegrated state. Integrated records are memory projections, excluded from newly serialized caches. Seven legacy integrated write paths are denied after serialization, not just immediately after hydration. No silent SQLite fallback or dual write is permitted for integrated commands.

## Verification results

Completed-module regression was run before integration and repeated after changes. All API/browser suites target `slice_test`, not preserved development/source data.

| Verification | Final result |
|---|---|
| Authentication/customer API | 42 passed |
| Vehicle API | 13 passed |
| Reception/jobs API | 24 passed |
| Lifecycle API | 5 passed |
| Estimate/document/media API | 53 passed |
| Material approval API | 19 passed |
| Calculation parity | 503 exact matches, 0 failures |
| Customer browser regression | 25 passed |
| Vehicle browser regression | 8 passed |
| Reception/jobs browser regression | 14 passed |
| Role browser regression | 8 passed |
| Estimate/document/media browser | 19 passed |
| Material approval browser | 7 passed |
| API restart/session/document/media persistence | 4 passed |
| Original cache preservation / no integrated local writes | 17 passed |
| TypeScript and production build | Passed; existing bundle-size/dynamic-import warnings |
| Existing unit suite | 241 passed, **3 failed**, unchanged baseline template-count assertions (expected 6, actual 8) |
| Diff whitespace / preservation checks | Passed |

The 42 API assertions are imported by several feature suites; they are counted once above. The three original unit failures were reproduced before this batch and remain unresolved rather than modifying expectations to obtain a green result.

API checks cover mixed line kinds/taxes, capped discount, stale writes, invalid inputs, roles, idempotency, imported identity, approved editing with frozen output, approval checklist atomicity, immutable snapshots, media bytes and RLS, cross-job foreign-key rejection, metadata/archive and cross-session visibility. Material approval tests exercise submission, rejection, resubmission, approval, permissions, versions, event history and HOLD transitions.

Browser checks exercise existing estimate add/edit/remove-line/approval controls, generated PDF signature, print popup/output, valid canvas-image upload/render, metadata/archive controls, independent sessions and original snapshot/byte persistence across API restart. Material rejection/approval controls are exercised; Store submission and advisor resubmission are also verified through their API contract, not claimed as full click-through coverage of every role/control. The development login dropdown remains available and regression-tested.

## Document/media and visual parity

Ten captured states match the approved baseline with **zero differing pixels**: estimate list, editor, approval dialog, Documents panel, empty material Approvals view, and Job Card / Estimate / Invoice / Payment Receipt / Gate Pass output. The media state has 104,816 differing pixels within the expected approved text/unavailable-content area; it is recorded separately, not accepted as an unexplained baseline update.

Document HTML from the original print actions matches byte-for-byte. For stable screenshot comparison, captured unchanged HTML is rendered in a fresh same-origin test page after fonts/images load; raw headless print popups had inconsistent asset timing. Product templates and print code were not changed to accommodate the test. Separate functional browser tests invoke the actual print/download actions. Existing screenshot baselines were not overwritten.

All 289 historical media records retain original reference/metadata. Missing bytes display ?Original media unavailable?; historical files return no fabricated content. New media is stored with the job and survives API restart and independent sessions. Newly rendered documents from preserved records are not represented as recovered original archival PDFs.

Raw ignored artifacts are under `backend/customer-slice/artifacts/`, including generated HTML/PDF, screenshots/diffs, JSON checks, build and unit logs. A credential-free summary is checked in as [Stage 6 estimates evidence](stage6-estimates-evidence.json.md).

## Remaining limits and next action

- The three pre-existing template-count unit failures remain; the overall unit suite is not green.
- Original historical image/PDF bytes are unavailable. Metadata is preserved; recovery requires the actual source files.
- The prior 67 quarantined import records (including 52 checklist records) remain quarantined; this batch does not synthesize or repair historical data. Existing 51 invoice calculation discrepancies are preserved, not silently corrected.
- Invoice/payment/receipt/gate-pass/material/task data used by linked views is read-only where its write module has not been integrated. New material requests, issuing/stock changes, task editing and other unrelated writes remain blocked when they would cross PostgreSQL identities. Material resubmission operates on retained eligible rows; request correction in an unintegrated module remains outside this batch.
- Actual pre-existing user browser profiles were not opened or rewritten. Isolated profiles test storage preservation. Full responsive/all-role/all-control visual and workflow coverage is not claimed. Nonempty task prefill browser coverage remains unverified.
- This is a local development integration, not production readiness or deployment approval. Authentication lifetime/provisioning and unrelated module migration remain prior limitations.

The requested integration batch stops here. Review this report and the explicit limits before authorizing another module; no persistence retirement or deployment is implied.
