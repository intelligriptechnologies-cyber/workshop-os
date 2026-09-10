# WorkshopOS implementation handoff

Updated: 2026-09-10  
Current branch: `prem-dev`  
Completed slice: S02
Next slice: S03 — Versioned tenant configuration and master CRUD

## Durable state

- The approved product contract remains canonical in `harness/03-prd.md` (R-001 through R-119); decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01 established the tenant-aware PWA/API/RLS/private-object/outbox production seams without deployment.

## S02 evidence

- `production/src/identity-access.ts` provides a Cognito-compatible identity-provider port and deterministic local adapter; no external identity or AWS service was contacted.
- Idempotent MFA-protected provisioning creates nine role templates, owner membership, branch, configuration template, plan, entitlements, quotas, currency/timezone, and audit evidence.
- Individual memberships combine role and granular permissions under authenticated tenant/branch scope. Registered shared devices use digest-only PINs, lock after three failures for fifteen minutes, and issue attributable employee sessions.
- Tenant staff MFA, configurable 1–120 minute recent-auth windows, controlled maker-checker thresholds, independent checker enforcement, expiring tenant-approved support access, and tenant-visible audit evidence are enforced server-side.
- `002_identity_access.sql` persists the identity/control model with mandatory tenant keys, FORCE RLS, support-grant guards, and expanded audit context.
- Production tests pass 14/14; production typecheck, harness verification, demo build, and Playwright regression pass.

## S03 first action

Read S03, R-011 through R-014 and R-019 through R-020, D-007/D-022/D-024, and the S01/S02 seams. Start with one failing public-interface test proving an effective-dated master version becomes immutable after use and that publishing a replacement does not alter the snapshot used by active work.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and maintain PostgreSQL RLS.
- Do not weaken individual identity, kiosk attribution, MFA/re-auth, maker-checker, support-access, or audit controls while adding configuration administration.
- Keep authoritative commands idempotent/version checked, and keep AWS/Cognito/provider activity local until explicitly authorized.
- After S03 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S03 and do not push.
