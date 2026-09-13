# Standardize server lists and complete exports

Status: Complete
Implements: V12-R005, V12-R006, V12-R007, V12-R011  
Blocked by: V12-01, V12-02

## Outcome

Deliver one reusable server list/query contract, URL state, persisted presentation preference, and authorization-protected asynchronous PDF/XLSX export path.

## Acceptance criteria

- [x] Search, filters, and stable sort are server-applied; URLs reproduce state; page size accepts exactly 25, 50, or 100.
- [x] Refresh reloads authority, Clear restores the documented screen default, and empty states offer a relevant recovery action.
- [x] Grid/table preference persists per tenant, user, and screen and never changes business data.
- [x] PDF/XLSX jobs include every authorized filtered/sorted row across pages, remain private, and reveal no denied rows or counts.

## Evidence

RED: focused contract and browser tests established normalized URL state, exact page sizes, private preferences, asynchronous export polling, and complete filtered-result downloads.

GREEN: migration `032_server_lists_exports.sql`, `server-list-contract.ts`, `work-item-export.ts`, the PostgreSQL repository/API routes, and the production Work Items UI implement the contract with forced RLS and matching API permissions.

REFACTOR: stable sort keys are allow-listed, list query parsing is shared, export generation is format-specific, and persisted presentation preference is isolated from business records.

Passing evidence (2026-09-14):

- `node --import tsx --test production/tests/server-list-contract.test.ts` - 2/2 passed, covering XLSX and PDF artifacts.
- Fresh 32-migration PostgreSQL run of both Work Item integration suites - 2/2 passed.
- `npm run local:up`; `npm run local:test`; `npm run local:down` - passed, including query, private preference, asynchronous export, and permission checks.
- Focused Playwright against the production stack - 8/8 passed.
- `npm run test:e2e` - 33/33 passed.
- `npm run build` - passed with the existing non-blocking bundle-size warning.
- `npm run test:unit` - 9/9 passed.
- `npm run test:production` - 217/220 passed; three isolated PostgreSQL suites skipped only because their opt-in URLs were absent from that general command, and both affected Work Item suites passed separately against fresh PostgreSQL.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` - passed.
