# S08 — Advisor inspection and ownership

Status: Complete
Implements: R-030, R-031

## Outcome
Give advisors accountable queues, structured inspection/evidence, follow-ups, reassignment, and promised-delivery management.

## Acceptance criteria
- [x] Every Job has exactly one accountable advisor and audited reassignment updates the appropriate action queues.
- [x] Required inspection findings/evidence and promised delivery are validated; follow-ups surface by due state and ownership.

## Implementation evidence

- `production/src/advisor-inspection.ts` accepts S07 draft Jobs through an explicit port, refuses missing/ineligible ownership, and exposes tenant/branch/permission-scoped `/api/v1` job and action queues. Reassignment requires an idempotency key, matching resource version, eligible new advisor, and reason; it atomically changes both current ownership and action ownership while retaining actor/membership/request audit and old/new ownership history.
- Configured inspection submission snapshots typed structured findings and the selected configuration version, requires free-text findings, accepts only checksum-valid `CLEAN` media below the authenticated tenant/branch private prefix, validates recommended scope back to findings, and enforces separate customer/internal-note write plus internal-note/evidence read permissions.
- Each committed inspection produces one durable `ADVISOR_SCOPE_RECOMMENDED` handoff event containing recommended scope for S09. It does not create, price, send, or approve an estimate.
- Follow-ups retain an owner, due timestamp, visible `OVERDUE`/`DUE_TODAY`/`UPCOMING`/`COMPLETED` state, versioned completion, and required outcome. Promised-delivery changes require a reason and projected-ready time, preserve append-only history, and surface `ON_TRACK`, `AT_RISK`, or time-derived `OVERDUE` queue signals.
- `production/db/migrations/008_advisor_inspection.sql` backfills S07 Jobs and installs an insert trigger so every future Job gets exactly one accountability/action row. All 13 S08 tables use tenant/branch keys and forced RLS; ownership changes use an atomic version-guarded function; inspection/evidence/scope/outbox/follow-up/promised-delivery/audit histories are append-only.

## Verification

- TDD red evidence: the tracer test first failed because the S08 module did not exist; subsequent public API tests failed on missing inspection, follow-up, promised-delivery, and dynamic-risk behavior; the persistence test failed until migration 008 existed.
- S08 acceptance: 7/7 tests passed in `production/tests/advisor-inspection.test.ts`.
- Regression: 52/52 production tests, production typecheck, harness verification, demo production build, Playwright 7/7, and `git diff --check` passed.
- No provider call, customer message, upload, deployment, push, or production action occurred.
