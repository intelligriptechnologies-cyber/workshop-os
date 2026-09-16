# Migrate Estimates, Tasks, and QC

Status: Complete
Implements: V12-R026, V12-R027  
Blocked by: V12-03, V12-05, V12-10, V12-11

## Outcome

Migrate Estimates, technician Tasks, and QC experiences to production lists/dialogs while preserving version, evidence, approval, rework, and lifecycle controls.

## Acceptance criteria

- [x] Estimate list/edit/version/submit/approve flows survive reload and preserve superseded versions and approval evidence.
- [x] Authorized estimate documents contain the intended immutable version and obey permission filtering.
- [x] Task assignment and evidence commands are PostgreSQL-backed and respect lifecycle and role constraints.
- [x] QC checklists, independent decisions, failed-item rework, evidence, and blockers are enforced through UI and direct API.

## Evidence

- Migration 041 passed on a fresh PostgreSQL database; focused Estimates/Tasks/QC PostgreSQL integration passed 2/2. After final integration hardening, the Estimate test passed 1/1 with an immutable PDF discoverable and downloadable from its Job, two downstream approval outbox events, RLS, lifecycle facts, idempotency, concurrency, assignment audit, clean evidence, independent QC, and blocking rework.
- `npm run local:up` and `npm run local:test` passed against the rebuilt Docker runtime with all 41 migrations and 48 smoke checks, including Estimate create/edit/submit/document/approve authority.
- Focused Playwright passed 4/4; the full mocked suite passed 55/64 with nine configured real-stack skips, and the full real HTTP/PostgreSQL suite passed 64/64 serially.
- `npm run build` passed with the existing bundle-size warning; `npm run test:unit` passed 24/24; `npm run test:production` passed 241/252 with 11 expected opt-in PostgreSQL skips; production typecheck and `git diff --check` passed.
- Submitted Estimate documents are persisted atomically with immutable metadata/content. Approval atomically activates scope, records the canonical lifecycle fact, and emits work-planning and material-control outbox events.
