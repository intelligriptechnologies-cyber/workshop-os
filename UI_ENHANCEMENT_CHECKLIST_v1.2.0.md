# WorkshopOS v1.2 implementation checklist

Status: In progress  
Canonical PRD: `harness/v1.2/03-prd.md`  
Traceability: `harness/v1.2/06-traceability.md`

- [x] V12-00 — Persist the approved programme contract, traceability baseline, slices, handoff, and executable verifier. Complete; evidence: `node scripts/verify-ui-enhancement-v1.2.mjs`, `npm run test:harness`, `npm run test:unit`, `npm run test:production:typecheck`, `npm run build`, `git diff --check` (2026-09-13).
- [x] V12-01 — Deliver the authenticated React → HTTP → PostgreSQL tracer with RLS, idempotency, versions, and readable errors. Complete; evidence: build, 9/9 unit, 215/217 production with two expected environment-gated skips, production typecheck, isolated PostgreSQL integration 1/1, Docker 30-migration smoke, focused Playwright 4/4, and diff check (2026-09-13).
- [x] V12-02 — Deliver reusable accessible resource and reason-command dialogs with dirty-close protection. Complete; evidence: build, 9/9 unit, 215/217 production with two expected env-gated skips, production typecheck, 6/6 focused Playwright, fresh 31-migration PostgreSQL integration 1/1, Docker HTTP smoke, and diff check (2026-09-13).
- [ ] V12-03 — Deliver the server list/query, URL state, preferences, and private full-result export contract.
- [ ] V12-04 — Migrate tenant User Management to production authority and enforce final-admin protections.
- [ ] V12-05 — Deliver custom roles, the permission catalog/tree, protected templates, and aligned UI/API authorization.
- [ ] V12-06 — Deliver versioned Business Settings, inheritance, publication, and non-retroactive work snapshots.
- [ ] V12-07 — Migrate Customer and Vehicle lists and CRUD to production APIs.
- [ ] V12-08 — Deliver production Inventory analytics and controlled staged import.
- [ ] V12-09 — Deliver the production Job List, visit-date default, orange status, Job PDF, and linked downloads.
- [ ] V12-10 — Deliver lifecycle projection, commands, blockers, hold, facts, history, and explained Data Flow.
- [ ] V12-11 — Deliver strictly Job-linked, scanned, private lifecycle-gated Media.
- [ ] V12-12 — Migrate Estimates, Tasks, and QC to production authority without losing controls.
- [ ] V12-13 — Migrate Billing, payments, receipts, gate passes, delivery, and closure with immutability.
- [ ] V12-14 — Migrate every remaining rich list/grid and enforce the no-sql.js production-authority gate.
- [ ] V12-15 — Deliver the separate Platform Super Admin workspace, logs, support grants, and controlled emulation.
- [ ] V12-16 — Complete accessibility, responsive, security, cleanup, documentation, traceability, and release verification.

## Completion rule

A checked slice must have `Status: Complete`, no unchecked acceptance criterion, recorded focused and regression evidence, and a handoff naming the immediately following slice. V12-16 may be checked only when all prior slices are checked, traceability is clean, every local release command passes, and remaining external/manual evidence is explicitly recorded.
