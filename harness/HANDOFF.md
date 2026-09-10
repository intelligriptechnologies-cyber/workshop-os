# WorkshopOS implementation handoff

Updated: 2026-09-10  
Current branch: `prem-dev`  
Completed slice: S03
Next slice: S04 — Atomic lifecycle, approvals, concurrency, and override engine

## Durable state

- The approved product contract remains canonical in `harness/03-prd.md` (R-001 through R-119); decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01 established the tenant-aware PWA/API/RLS/private-object/outbox production seams without deployment; S02 established provisioning, identity, permissions, kiosk, control, and audit seams.

## S03 evidence

- `production/src/versioned-configuration.ts` exposes an authenticated local `/api/v1` surface for all approved master classes, mutable drafts with version tokens, ordered effective publication, and tenant/branch isolation. Configured workflows cannot redefine the platform lifecycle.
- Approved/active scope activation atomically snapshots price, tax, workflow, recipe, checklist, and policy. Published versions and snapshots are immutable, so later effective publications do not rewrite active work.
- Money uses validated integer minor-unit strings. UOM conversions use validated integer ratios and BigInt fixed-decimal arithmetic, including exact values beyond JavaScript's safe-number range and exact fractional expansion.
- Document numbers are allocated idempotently and monotonically per tenant, branch, type, and financial year. The local concurrency test allocates 64 unique numbers; PostgreSQL uses an atomic `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` contract and does not recycle committed allocations.
- `003_versioned_configuration.sql` adds forced-RLS persistence plus database immutability guards. Production tests pass 20/20; production typecheck, harness verification, demo build, and Playwright regression pass.
- No AWS/provider service was contacted, no deployment occurred, and no GitHub push was performed.

## S04 first action

Read S04, R-011 and R-017 through R-018, the stable lifecycle exposed by S03, and the S01-S03 command/authentication seams. Start with one failing public-interface test proving a valid lifecycle transition commits atomically once, while stale, invalid, or blocked transitions make no state change and return actionable blocker details.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and maintain PostgreSQL RLS.
- Build lifecycle commands on the stable S03 stages; tenant workflow configuration may add steps and checklists but cannot redefine core stage semantics.
- Keep authoritative commands idempotent/version checked and preserve S03 snapshots and fiscal allocations without destructive mutation.
- Keep AWS/Cognito/provider activity local until explicitly authorized.
- After S04 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S04 and do not push.
