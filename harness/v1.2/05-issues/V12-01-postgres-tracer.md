# Prove the production screen vertical

Status: Complete
Implements: V12-R001, V12-R002  
Blocked by: V12-00

## Outcome

Migrate one representative rich resource all the way from React through authenticated `/api/v1` HTTP to PostgreSQL, proving the reusable production request and mutation contract before broader migration.

## Acceptance criteria

- [x] A signed-in permitted user lists and creates the representative resource through the UI and the result survives a browser restart because PostgreSQL is authoritative.
- [x] Cross-tenant and cross-branch access is denied by API authorization and PostgreSQL RLS without leaking the record.
- [x] Retrying the same mutation idempotency key does not duplicate work; a stale resource version returns a readable conflict.
- [x] Failures show a safe human-readable message and trace identifier; focused PostgreSQL integration plus unit/typecheck gates pass.

## Evidence

RED: new client, repository, HTTP-error, and production-browser tests failed because update/version, payload-bound replay, trace-safe errors, and the mounted route did not exist. GREEN: `/production/work-items` now lists, creates, edits, and reloads through authenticated HTTP/PostgreSQL; RLS, idempotency fingerprints, optimistic versions, and trace-safe errors are enforced. REFACTOR: local identity is available only when demo login is explicitly enabled, pre-migration replay rows remain compatible, and the tracer imports no `sql.js` authority.

Verified 2026-09-13: `npm run build`; `npm run test:unit` (9/9); `npm run test:production` (215 passed, two expected environment-gated skips); `npm run test:production:typecheck`; isolated fresh-PostgreSQL focused test (1/1); `npm run local:up`; `npm run local:test` (30 migrations and nine named checks); focused production Playwright (4/4, including real browser → HTTP → PostgreSQL persistence); `npm run local:down`; `git diff --check`.
