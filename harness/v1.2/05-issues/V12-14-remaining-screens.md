# Migrate every remaining rich screen

Status: Complete
Implements: V12-R001, V12-R030  
Blocked by: V12-03, V12-05, V12-07, V12-08, V12-09, V12-12, V12-13

## Outcome

Inventory and migrate appointments, follow-ups, action inbox, material issue/reconciliation, reports, remaining masters, and every other rich list/grid, then enforce production-authority completeness statically.

## Acceptance criteria

- [x] A checked screen inventory maps every rich route to its production list/dialog/export contract and PostgreSQL-backed acceptance evidence.
- [x] Appointments, follow-ups, action inbox, material issue/reconciliation, reports, and remaining masters no longer use browser-local authority.
- [x] A static production import/route gate fails when a rich production screen imports `sql.js`, `src/db.ts`, or an equivalent demo authority.
- [x] Isolated demo/reference code may remain only when it cannot be reached or imported by production routes and is explicitly documented.

## Evidence

- `production/remaining-screen-inventory.json` locks 22 production routes and maps all 34 historical role-menu surfaces. The verifier rejects missing routes, missing surface mappings, missing list/dialog/view/export contracts, missing PostgreSQL evidence, production links to `/demo`, or static `sql.js`/`src/db.ts` reachability.
- Appointments, follow-ups, action inbox, material issue/reconciliation, reports, and operational masters use authenticated `/api/v1/operations/*` PostgreSQL queries with RLS scope, server filtering/sorting, 25/50/100 pagination, URL state, grid/table preferences, accessible detail dialogs, private full-result PDF/XLSX exports, and explicit empty/clear/refresh behavior. Follow-up and action-inbox completion is versioned, idempotent, reasoned, and receipt-backed.
- A fresh database applied all 43 migrations and focused PostgreSQL acceptance passed 1/1, including RLS scope, both reasoned commands and replay, persisted preferences, and a complete private export. The rebuilt Docker runtime passed 54 HTTP/PostgreSQL smoke checks.
- `npm run build` passed with the existing non-blocking chunk-size warning; unit passed 28/28; production passed 241/254 with 13 expected opt-in PostgreSQL skips; production typecheck and `git diff --check` passed.
- Focused Playwright passed 3/3 against the real runtime. Full Playwright passed 60/70 with ten configured real-stack skips; the historical user-owned demo suite ran unchanged through the isolated `/demo` wrapper.
- `npm run test:production-authority`, `npm run test:harness`, and `node scripts/verify-ui-enhancement-v1.2.mjs` pass. The legacy sql.js app is a dynamic-only `/demo` chunk, absent from production navigation/links and unreachable from the static production graph.
