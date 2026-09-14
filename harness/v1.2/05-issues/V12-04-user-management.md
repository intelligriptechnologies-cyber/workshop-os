# Migrate tenant User Management

Status: Complete
Implements: V12-R008, V12-R009  
Blocked by: V12-03

## Outcome

Make tenant User Management a complete production list/dialog/command flow with invitations, status and archive controls, concurrency, filters, and exports.

## Acceptance criteria

- [x] Authorized admins list, filter, invite, edit, resend, activate/suspend, and archive users through `/api/v1` and PostgreSQL.
- [x] Stale user edits fail with a conflict that can be refreshed without losing the intended change.
- [x] A user cannot remove prohibited self-access or disable/archive the final effective administrator, including concurrent attempts.
- [x] Permission-denied controls are absent and direct API attempts are denied; complete filtered exports follow V12-03.

## Evidence

RED: service, client, migration, PostgreSQL, and browser tests captured server-side list behavior, versioned/idempotent commands, status rules, inaccessible controls, stale-edit recovery, and final-admin races.

GREEN: `/production/users` now uses authenticated `/api/v1` calls and PostgreSQL for list, filters, invite/edit, resend, activate/suspend, archive, preferences, and asynchronous full-result PDF/XLSX exports. Migration `033_tenant_user_management.sql` adds suspended status and actor-attributed administration evidence.

REFACTOR: list parsing and export rendering are separated into reusable contracts; local Docker uses an explicit demo-only identity gateway and idempotent seed while Cognito remains the production identity provider.

Passing evidence (2026-09-14):

- User service/list/export/migration contract tests - 9/9 passed.
- Production Users API client tests - 2/2 passed; full unit suite - 11/11 passed.
- Fresh 33-migration PostgreSQL integration - 1/1 passed, including idempotent invitations, filtering, RLS, assignment rules, concurrent final-admin serialization, suspended-session denial, and append-only audit enforcement.
- `npm run local:up`; `npm run local:test`; `npm run local:down` - passed with the production tenant-admin session and direct permission denial included in the smoke evidence.
- Focused Playwright - 3/3 passed, including real browser to HTTP to PostgreSQL persistence and private XLSX download.
- `npm run test:e2e` - 36/36 passed.
- `npm run build` - passed with the existing non-blocking bundle-size warning.
- `npm run test:production` - 221/224 passed; three suites skipped only because their opt-in PostgreSQL URLs were absent, while the V12-04 PostgreSQL suite passed separately against a fresh database.
- `npm run test:production:typecheck`, `npm run test:harness`, `npm run test:ui:v1.2`, and `git diff --check` - passed.
