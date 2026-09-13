# Use accessible production resource dialogs

Status: Complete
Implements: V12-R003, V12-R004  
Blocked by: V12-01

## Outcome

Create shared accessible create/edit and reason-command dialogs and demonstrate them on the production-backed tracer resource.

## Acceptance criteria

- [x] Keyboard and screen-reader users can open, complete, validate, cancel, and save create/edit dialogs with focus trapped and restored.
- [x] Attempting to close a dirty dialog requires an explicit discard decision; a clean dialog closes directly.
- [x] A policy-marked exceptional command cannot submit without a valid reason and records that reason; ordinary save does not request one.
- [x] Automated accessibility/component and end-to-end tests exercise the public dialog behavior.

## Evidence

RED: focused Playwright and API tests failed because the tracer used inline forms, had no dialog focus/validation/dirty-close contract, and had no reasoned command. GREEN: reusable native-modal primitives now provide accessible names, initial focus, containment, Escape/Cancel behavior, restoration, validation summaries, and discard confirmation; Work Item create/edit use them, while archive requires a reason and persists an attributed immutable audit detail through PostgreSQL. REFACTOR: dialog styling is isolated from the user-owned stylesheet, local authentication remains fail-closed, archive replay is idempotent, and cross-branch archive returns a non-leaking 404.

Verified 2026-09-13: `npm run build`; `npm run test:unit` (9/9); `npm run test:production` (215 passed, two expected env-gated skips); `npm run test:production:typecheck`; focused Playwright against the real stack (6/6); `npm run local:up`; `npm run local:test` (31 migrations, reason/archive checks included); fresh temporary PostgreSQL migration plus focused integration (1/1, audit reason/actor asserted); `npm run local:down`; `npm run test:harness`; `git diff --check`.
