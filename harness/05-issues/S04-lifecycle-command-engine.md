# S04 — Atomic lifecycle, approvals, concurrency, and override engine

Status: Approved  
Implements: R-007, R-008, R-011, R-017, R-018

## Outcome
Centralize version-checked, idempotent lifecycle commands, blockers, approval thresholds, re-authentication, and override evidence.

## Acceptance criteria
- [ ] Every allowed/denied lifecycle transition and blocker is covered by state-table tests; no endpoint bypasses the engine.
- [ ] Stale versions return a conflict and concurrent duplicate idempotency keys produce one committed effect/version/audit reference.
- [ ] Threshold actions require a distinct authorized checker and recent authentication; cancellations, reopenings, and overrides preserve reason/evidence.

