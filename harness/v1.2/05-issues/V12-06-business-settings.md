# Publish versioned inherited Business Settings

Status: Complete
Implements: V12-R012, V12-R013  
Blocked by: V12-05

## Outcome

Deliver validated tabbed tenant settings, branch inheritance/override/reset, controlled publication, and stable effective snapshots for active work.

## Acceptance criteria

- [x] Authorized users edit a draft across tabs, see validation and inherited/effective values, override a branch value, and reset it to inherited.
- [x] Publishing creates an immutable version; a stale publication is rejected and the prior version remains available.
- [x] A Job started under one settings version continues to use its immutable snapshot after a later publication.
- [x] Unauthorized branches and users cannot view or mutate settings outside their scope.

## Evidence

RED: domain, client, PostgreSQL, browser, and local-stack tests captured tabbed editing, invalid values, tenant inheritance, branch override/reset, stale publication, permission and branch denial, immutable history, and a governed work item retaining its effective values after later publication.

GREEN: migration `035_business_settings.sql` persists tenant and branch drafts, immutable published versions, idempotent commands, and immutable effective-settings snapshots. `/production/settings` uses authenticated `/api/v1` endpoints and PostgreSQL for read, save, reset, and publish behavior.

REFACTOR: validation and authorization live in the Business Settings service; the repository composes tenant defaults and branch overrides; snapshot rows have a composite tenant/branch/work-item foreign key in addition to forced RLS.

Passing evidence (2026-09-14):

- Business Settings domain tests passed 2/2; full production suite passed 225/230 with five opt-in PostgreSQL suites skipped only when their URLs were absent.
- A fresh database applied migrations 001–035 and the V12-06 PostgreSQL integration passed 1/1, including stale publication, immutable version/snapshot triggers, tenant and branch scope, effective inheritance, non-retroactivity, and cross-scope foreign-key rejection.
- `npm run local:up` and `npm run local:test` passed at 35 migrations with settings publication and non-retroactive HTTP snapshot evidence.
- Focused Playwright passed 3/3, including the real browser-to-HTTP-to-PostgreSQL flow; unit tests passed 16/16.
- `npm run build`, `npm run test:production:typecheck`, both harness verifiers, and `git diff --check` passed.

Remaining dependency: the production governed-work tracer proves snapshot immutability now; V12-09/V12-10 must invoke the same contract from the canonical Job-start lifecycle when that flow is migrated.
