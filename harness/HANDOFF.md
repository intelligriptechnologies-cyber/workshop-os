# WorkshopOS implementation handoff

Updated: 2026-09-10  
Current branch: `prem-dev`  
Completed slice: S00  
Next slice: S01 — Tenant-aware AWS vertical

## Durable state

- The approved product contract is canonical in `harness/03-prd.md` (R-001 through R-119).
- Decisions D-001 through D-035 are frozen in `harness/02-ledger.md`.
- S00-S28 specifications live in `harness/05-issues/`; traceability is CLEAN.
- `BRD.md` is intentionally only a pointer. Do not create a second BRD copy.
- The React/sql.js demo is a behavioral reference; its checklist is a historical baseline appendix.

## S00 evidence

- RED: `npm run test:harness` failed with missing `harness/00-intake.md`.
- GREEN: `npm run test:harness` passed with 119 requirements, 29 slices, and no orphans.
- Regression: `npm run build` passed and `npm run test:e2e` passed 7/7 tests.

## S01 first action

Read S01, the BRD, ledger, and traceability report. Write one failing tenant-isolation vertical test before introducing the production workspace. Use local/test substitutes for external dependencies; do not deploy or enroll providers without explicit authority.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; enforce membership plus PostgreSQL RLS.
- Keep authoritative commands idempotent and version checked.
- After S01 passes, update its evidence, checklist, traceability, and this handoff; commit locally with S01.
