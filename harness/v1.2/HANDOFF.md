# WorkshopOS v1.2 handoff

Updated: 2026-09-21
Completed slice: V12-15
Next slice: V12-16

## Requirement IDs implemented

V12-R001 through V12-R033 are implemented on authenticated production routes backed by PostgreSQL. V12-15 completes V12-R011 and V12-R031 through V12-R033 with a distinct platform identity boundary, explicit tenant scope, protected log retention/recovery, scoped support grants, and approved dual-attributed tenant-user emulation. V12-00 continues to provide governance coverage for the complete requirement register.

## Changed paths

`production/db/migrations/044_platform_admin_workspace.sql`, `production/db/migrations/045_platform_action_audit_hardening.sql`, `production/local/cognito.ts`, `production/local/platform-database.ts`, `production/local/seed-demo.ts`, `production/local/server.ts`, `production/src/platform-admin.ts`, `production/tests/platform-admin-postgres.integration.test.ts`, `scripts/test-local.mjs`, `src/main.tsx`, `src/PlatformAdminApp.tsx`, `src/platform-admin-api.ts`, `src/platform-admin.css`, `src/platform-emulation-fetch.ts`, `tests/platform-admin.spec.ts`, `unit-tests/platform-admin.test.ts`, and the v1.2 checklist/issue/traceability/handoff.

## Focused and regression evidence

- A fresh database applied all 45 migrations and focused platform PostgreSQL acceptance passed 1/1. It covers recent MFA, distinct approval, exact scope, branch/warehouse/effective-permission resolution, exact expiry, immutable log recovery, and request/result dual attribution.
- `npm run local:up` rebuilt the final image and `npm run local:test` passed 63 checks against the 45-migration HTTP/PostgreSQL runtime, including independent grant/emulation approval, denied effective-user action audit, protected log download, and exercised offline recovery.
- Focused Playwright passed 2/2 against the real runtime and proves the complete platform-to-ordinary-workspace emulation bridge. Full real-stack Playwright passed 72/72; the user-owned historical demo test remains unchanged and executes through the isolated wrapper.
- `npm run build` passed with the existing non-blocking bundle-size warning; unit passed 30/30; production passed 241/255 with 14 expected opt-in PostgreSQL skips; production typecheck, the locked production-authority gate, and `git diff --check` passed.
- Both harness verifiers pass and identify V12-16 as the next contiguous slice.

## Preserved pre-existing changes

Unstaged user-owned changes in `src/App.tsx`, `src/styles.css`, `tests/workshopos.spec.ts`, and untracked `spec v2 UI cahnges prompt.txt` remain excluded from v1.2 slice commits. `tests/workshopos-demo.spec.ts` loads the protected historical test file unchanged and redirects only its test Page root navigations to `/demo`.

## Risks and blockers

- V12-16 owns final automated accessibility/responsive/security cleanup, release documentation, traceability closure, and the complete release-command matrix.
- Production object storage, trusted malware scanning, Cognito/MFA, deployed log/archive services, payment-provider/tax certification, deployment, and manual certification remain external evidence; local Docker proves only the in-scope runtime boundaries.
- The legacy sql.js reference app remains available only by direct `/demo` URL as a separately generated dynamic chunk. It is not a production authority, route fallback, production link, or navigation item.
- The existing production bundle-size warning remains for V12-16 cleanup; the demo chunk is separate from the production entry graph.
- The non-sensitive local test directory `%TEMP%\WorkshopOS-v1211-private-agent` may remain because the earlier session's destructive-action policy rejected removal after its exact path was verified.

## Next-slice dependencies

V12-16 implements V12-R034 through V12-R036. Audit every migrated screen at phone/tablet/desktop breakpoints and automated keyboard/focus/contrast/error/target-size/reduced-motion/screen-reader-oriented checks; clean security and migration residue; make traceability/checklist/handoff release-complete; run the entire release gate; and explicitly preserve the distinction between locally verified implementation and outstanding deployment/provider/penetration/finance-tax/manual-device/accessibility/recovery-migration/pilot certification.
