# Deliver Inventory analytics and controlled import

Status: Complete
Implements: V12-R015, V12-R016  
Blocked by: V12-03, V12-05

## Outcome

Migrate Inventory views and operational commands, then add a staged dry-run/commit import that reconciles without rewriting ledger history.

## Acceptance criteria

- [x] Production analytics and lists expose authorized stock position, movement, ageing/reorder indicators, search, paging, and exports.
- [x] Operational commands append valid ledger effects and cannot edit or delete prior stock-ledger entries.
- [x] An import can be staged and dry-run without stock mutation; invalid rows appear in a downloadable error manifest.
- [x] Explicit authorized commit is idempotent and its reconciliation totals equal the committed ledger effects.

## Evidence

RED: import normalization, exact-decimal, export, PostgreSQL, API-client, browser, and Docker smoke tests captured full-filter analytics, warehouse scope, non-mutating dry runs, actionable manifests, immutable ledger evidence, version conflicts, and retry behavior.

GREEN: migration `037_inventory_operations_import.sql` adds warehouse assignments, protected inventory import evidence, RLS, permission grants, and append-only reconciliation. `/production/inventory` now uses authenticated `/api/v1` and PostgreSQL for stock analytics, search/sort/paging, responsive table/grid modes, preferences, complete private exports, reasoned receipts, and controlled imports.

REFACTOR: full-filter analytics are independent of the displayed page, movement age is correlated by tenant and branch, all stock arithmetic uses fixed-decimal/BigInt validation, error responses are readable, and table/grid modes expose the same authorized receipt action.

Passing evidence (2026-09-14):

- `npm run build`, `npm run test:unit` (18/18), `npm run test:production:typecheck`, and `git diff --check` passed.
- The full production suite passed 231/238 with seven opt-in PostgreSQL suites skipped only when isolated URLs were absent; five focused inventory contracts passed with the isolated PostgreSQL test run separately.
- A fresh database applied migrations 001-037 and the focused PostgreSQL integration passed 1/1, covering complete analytics beyond page one, warehouse RLS, non-mutating validation, private manifests, idempotent commit, exact reconciliation, and append-only ledger rejection.
- Rebuilt Docker `npm run local:test` passed repeatedly at 37 migrations with inventory and all preceding smoke checks.
- Focused Playwright passed 2/2, including browser-to-HTTP-to-PostgreSQL receipt persistence after reload; the full suite passed 43/50 with seven real-stack tests intentionally environment-gated.
