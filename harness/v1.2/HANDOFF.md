# WorkshopOS v1.2 handoff

Updated: 2026-09-13
Completed slice: V12-01
Next slice: V12-02

## Requirement IDs implemented

V12-R001 and V12-R002 are implemented for the representative Work Item tracer. V12-00 continues to provide governance coverage only for the complete register.

## Changed paths

`production/db/migrations/030_work_item_mutation_contract.sql`, `production/local/database.ts`, `production/local/server.ts`, `production/src/http-errors.ts`, `production/tests/http-errors.test.ts`, `production/tests/work-items-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/main.tsx`, `src/ProductionWorkItemsApp.tsx`, `src/work-items-api.ts`, `tests/production-work-items.spec.ts`, `unit-tests/work-items-api.test.ts`, and the v1.2 checklist/issue/handoff.

## Focused and regression evidence

- `npm run build` — passed; the existing bundle-size warning remains non-blocking.
- `npm run test:unit` — 9/9 passed.
- `npm run test:production` — 215/217 passed; two isolated PostgreSQL suites skipped only because their opt-in URLs were absent.
- `npm run test:production:typecheck` — passed.
- Fresh isolated PostgreSQL focused test — 1/1 passed after all 30 migrations.
- `npm run local:up`; `npm run local:test`; `npm run local:down` — passed; nine named HTTP/RLS/idempotency/version/trace checks.
- Focused Playwright against the container — 4/4 passed, including browser → HTTP → PostgreSQL persistence across reload.
- `npm run test:harness`; `node scripts/verify-ui-enhancement-v1.2.mjs`; `git diff --check` — passed.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` were not modified or included in V12-01.

## Risks and blockers

- Rich PWA screens remain `sql.js`-authoritative except Admin Users and the isolated Work Item tracer; production contract modules outside these paths are not wired screens.
- The Work Item tracer is a proof path, not a substitute for the domain screens assigned to V12-04 and V12-07–V12-14.
- Existing global identity/email semantics and the bundle-size warning remain known risks for their owning slices.
- External deployment, provider, security, finance/tax, recovery, device/accessibility, migration, and pilot evidence remains unavailable and release-blocking.

## Next-slice dependencies

V12-02 builds shared accessible create/edit, reason-command, and dirty-close dialog primitives and demonstrates them on the production Work Item tracer without importing `sql.js`. It depends on the V12-01 route, API client, and optimistic update behavior now committed.
