# Vehicles, Reception and Jobs — isolated Stage 6 implementation

Working application: https://localhost:18443/login (local development certificate). Isolated browser tests use https://localhost:18444. No deployment, commit or push.

The existing UI now reads 121 customers, 132 vehicles and 145 jobs from PostgreSQL. Vehicle Add/Edit/View/Archive, reception intake, advisor assignment/attendance, job Add/Edit/View/Archive and permitted checklist/status actions use backend transactions. Intake creates linked customer/vehicle/visit/job and initial task, QC, checklist and media metadata atomically. Existing identifiers remain unchanged. New numbering follows the source visit-based rule. Optimistic versions, idempotency, session/CSRF validation, role checks and audit triggers protect writes.

## Files and database changes

- `src/App.tsx`: existing handlers and loading paths use the API; atomic in-memory projection refresh; local operations roll back on an unsafe boundary. Existing forms, navigation, labels and styling retained.
- `src/db.ts`: memory-only projections and write guards; new serialized snapshots exclude integrated tables. The previous browser snapshot remains preserved under its original key.
- `src/job-sheet-ui.tsx`: existing job-detail and delivery saves use the API. No markup or styling changes.
- `src/customer-api.ts`: exports the existing authenticated request helper and accepts customers from the atomic projection.
- New `src/operations-api.ts`: typed vehicle/operation adapter, versions and retry identities.
- `backend/customer-slice/api.py`: mounts operations routes and supports a repeatable-read projection transaction.
- New `operations.py`, `operational-mapping.json`: backend commands and explicit source-shaped read mappings.
- New Alembic revisions `20261022_0040_vehicles`, `20261022_0041_intake_jobs`, `20261022_0042_visit_archive`: scoped write grants, audited editable-field guards, free-text promised delivery preservation and atomic visit archive support. Original custody and immutable fields remain protected.
- New API/browser/visual/preservation test scripts in `backend/customer-slice/`; README updated. Artifacts and database backups remain ignored.

Protected-file comparison against `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`: 111/115 files unchanged; the four exceptions are App.tsx, db.ts, job-sheet-ui.tsx and vite.config.ts. Vite configuration is preserved from the preceding HTTPS/API-proxy slice, with no new milestone edit. Pre-existing AGENTS.md and other local changes were retained.

## Verification

- Backend: existing 42 authentication/Customers assertions, 13 vehicle assertions, 24 intake/job assertions and 5 lifecycle assertions passed (84 distinct assertions).
- Browser: 25 authentication/Customers regressions, 8 vehicle, 14 reception/job and 8 seven-role assertions passed (55). Includes refresh, independent sessions, dropdown/manual login, expiry/logout, vehicle customer association, intake notification, advisor reassignment, editing, cancellation and atomic job/visit archive.
- TypeScript checking and integrated Vite build passed. Existing bundle-size/dynamic-import warnings remain.
- Unit suite: 241 passed, 3 failed in existing report-template tests (expected six categories, actual eight). These pre-existing failures were not rewritten to pass.
- Visual comparison: 20/21 states pixel-identical to the approved build. Reception queue differs at 37 pixels, maximum one RGB level, confined to rounded card edges. Strict zero-difference comparison therefore fails; baseline images were not updated. Screens were visually inspected; no layout/form/style change observed. Full pixel-identical visual acceptance is not claimed.
- All 94 approved screenshot files and eight SQLite copies retain their hashes.
- Development has all 103 compared original business/custody tables unchanged. Test clone has all 92 non-operational compared tables unchanged, including financial and custody data. All original job identifiers remain unchanged; no job lacks its visit/customer/vehicle parents. Test-created records and audited edits exist only in the disposable test clone.

Evidence: `backend/customer-slice/artifacts/operations-preservation.json`, `operational-visual-results.json`, `operations-unit-results.txt`, `backend-tests.json`, `vehicle-api-tests.json`, `intake-job-api-tests.json`, `lifecycle-api-tests.json`, `operations-customer-regression.json`, `vehicle-browser-tests.json`, `intake-job-browser-tests.json`, `roles-tests.json`.

## Remaining boundaries — not full milestone acceptance

- Historical vehicle customer reassignment fails closed when visit history exists; an explicit ownership-transfer rule is still needed to preserve historical relationships.
- Advance Booking check-in remains blocked at the local-to-PostgreSQL boundary. The booking module was not migrated.
- Linked estimate, material, task, financial handover/payment and media-upload writes remain unintegrated and cannot dual-write to local SQLite. Existing imported references and read projections remain available. Required artifact/checklist gates cannot be bypassed to advance a job.
- The existing 67 quarantined historical records remain preserved, including 52 missing checklist records. Gated transitions on incomplete historical cycles fail closed; missing history is not fabricated.
- Strict reception-queue pixel comparison and the three pre-existing unit failures remain unresolved.

Core operational integration is implemented and tested, but these limitations prevent claiming every completion criterion is satisfied. Stop here for review; do not migrate another module or deploy.

## Re-run checks

Use the existing isolated compose environment. Run Python API scripts inside `api-test` (`test_api.py`, `test_vehicles.py`, `test_operations.py`, `test_lifecycle.py`); browser scripts use dedicated contexts/profiles and test port 18444. Visual scripts compare the read-only baseline at port 18445 against development port 18443. Run `verify_operations_preservation.py` and `compare_operational_visual.py` on the host. Lifecycle tests intentionally mutate an eligible historical job only in the disposable test clone; prepare a fresh clone when no eligible job remains.
