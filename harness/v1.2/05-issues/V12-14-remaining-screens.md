# Migrate every remaining rich screen

Status: Planned  
Implements: V12-R001, V12-R030  
Blocked by: V12-03, V12-05, V12-07, V12-08, V12-09, V12-12, V12-13

## Outcome

Inventory and migrate appointments, follow-ups, action inbox, material issue/reconciliation, reports, remaining masters, and every other rich list/grid, then enforce production-authority completeness statically.

## Acceptance criteria

- [ ] A checked screen inventory maps every rich route to its production list/dialog/export contract and PostgreSQL-backed acceptance evidence.
- [ ] Appointments, follow-ups, action inbox, material issue/reconciliation, reports, and remaining masters no longer use browser-local authority.
- [ ] A static production import/route gate fails when a rich production screen imports `sql.js`, `src/db.ts`, or an equivalent demo authority.
- [ ] Isolated demo/reference code may remain only when it cannot be reached or imported by production routes and is explicitly documented.

## Evidence

Pending.

