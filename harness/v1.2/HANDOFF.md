# WorkshopOS v1.2 handoff

Updated: 2026-09-21
Completed slice: V12-14
Next slice: V12-15

## Requirement IDs implemented

V12-R001 through V12-R030 are implemented on authenticated production routes backed by PostgreSQL. V12-14 completes V12-R030 and reinforces V12-R001 with a locked production route/surface inventory and a transitive no-sql.js authority gate. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`package.json`, `playwright.config.ts`, `production/db/migrations/043_remaining_screen_production.sql`, `production/local/database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/remaining-screen-inventory.json`, `production/src/remaining-screens.ts`, `production/src/role-permissions.ts`, `production/tests/remaining-screens-postgres.integration.test.ts`, `production/tests/role-permissions.test.ts`, `scripts/test-local.mjs`, `scripts/verify-production-authority.mjs`, `src/main.tsx`, `src/ProductionHomeApp.tsx`, `src/ProductionRemainingScreensApp.tsx`, `src/production-navigation.tsx`, `src/production-remaining-screens-api.ts`, `tests/global-users.spec.ts`, `tests/production-remaining-screens.spec.ts`, `tests/workshopos-demo.spec.ts`, `unit-tests/production-authority.test.ts`, `unit-tests/production-remaining-screens-api.test.ts`, and the v1.2 checklist/issue/traceability/handoff.

## Focused and regression evidence

- `npm run test:production-authority` passes with 26 static production modules, 22 locked routes, all 34 historical role-menu surfaces mapped, and the dynamic-only `/demo` authority isolated from production imports, links, and navigation.
- A fresh database applied all 43 migrations; focused PostgreSQL acceptance passed 1/1. Coverage includes tenant/branch/warehouse RLS, six list sources, follow-up and action-inbox reasoned commands and idempotent replay, persisted presentation preferences, complete filtered export, and private artifact download.
- `npm run local:up` rebuilt the final image and `npm run local:test` passed 54 checks against the 43-migration HTTP/PostgreSQL runtime. The additive protected-template migration is versioned and grants the new operational permissions only to the Business Owner/Admin, not the User Administrator.
- Focused Playwright passed 3/3 against the real HTTP/PostgreSQL stack. Full Playwright passed 60/70 with ten configured real-stack skips. The user-owned historical demo test remains unchanged and runs through the test-only `/demo` wrapper.
- `npm run build` passed with the existing non-blocking bundle-size warning; unit passed 28/28; production passed 241/254 with 13 expected opt-in PostgreSQL skips; production typecheck and `git diff --check` passed.
- Both harness verifiers pass and identify V12-15 as the next contiguous slice.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits. `tests/workshopos-demo.spec.ts` loads the protected historical test file unchanged and redirects only its test Page root navigations to `/demo`.

## Risks and blockers

- V12-15 owns the separate Platform Super Admin workspace, platform-only authorization, tenant selection, daily log retention/download/recovery controls, support grants, and 15-minute approved tenant-user emulation with dual attribution.
- Production object storage, trusted malware scanning, Cognito/MFA, deployed log/archive services, payment-provider/tax certification, deployment, and manual certification remain external evidence; local Docker proves only the in-scope runtime boundaries.
- The legacy sql.js reference app remains available only by direct `/demo` URL as a separately generated dynamic chunk. It is not a production authority, route fallback, production link, or navigation item.
- The existing production bundle-size warning remains for V12-16 cleanup; the demo chunk is separate from the production entry graph.
- The non-sensitive local test directory `%TEMP%\WorkshopOS-v1211-private-agent` may remain because the earlier session's destructive-action policy rejected removal after its exact path was verified.

## Next-slice dependencies

V12-15 implements V12-R011 and V12-R031 through V12-R033. Start from the historical platform lifecycle, observability, and identity contracts, but expose them through a separate platform-authenticated workspace and PostgreSQL repositories. Tenant users must never acquire ambient platform access; support grants and emulation must preserve exact scope, distinct approval, recent MFA/re-authentication, 15-minute expiry, ordinary user permissions/approval rules, and both platform-actor and effective-user attribution.
