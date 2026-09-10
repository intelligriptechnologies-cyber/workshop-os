# S04 — Atomic lifecycle, approvals, concurrency, and override engine

Status: Complete
Implements: R-007, R-008, R-011, R-017, R-018

## Outcome
Centralize version-checked, idempotent lifecycle commands, blockers, approval thresholds, re-authentication, and override evidence.

## Acceptance criteria
- [x] Every allowed/denied lifecycle transition and blocker is covered by state-table tests; no endpoint bypasses the engine.
- [x] Stale versions return a conflict and concurrent duplicate idempotency keys produce one committed effect/version/audit reference.
- [x] Threshold actions require a distinct authorized checker and recent authentication; cancellations, reopenings, and overrides preserve reason/evidence.

## Evidence

- `production/src/lifecycle-command-engine.ts` is the single local `/api/v1` transition surface. It classifies every stage pair, reports fact-specific blockers, restores cancelled resources only to their prior operational stage, and leaves stale, invalid, or blocked commands unchanged.
- Commands require tenant-scoped idempotency keys and `If-Match`; successful replay returns the original version/audit reference. Sensitive cancellation, reopening, and closure overrides require reason/evidence and recent authentication, with configurable distinct maker-checker approval.
- `production/db/migrations/004_lifecycle_command_engine.sql` forces tenant/branch RLS, versions resources, uniquely scopes idempotency keys, separates approval actors, and prevents update/delete of history and audit ledgers.
- `production/tests/lifecycle-command-engine.test.ts` covers atomic transition/replay, the complete state table and blockers, maker/checker and stale-auth denial, cancellation evidence, stale/invalid no-ops, constrained reopening, and the PostgreSQL contract.
- Verified 2026-09-10: production tests 25/25, production typecheck, harness (119 requirements/29 slices/5 contiguous complete/no orphans), demo build, and Playwright 7/7 passed. No external call, deployment, push, or production action occurred.
