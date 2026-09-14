# Deliver custom roles and aligned authorization

Status: Complete
Implements: V12-R010, V12-R011  
Blocked by: V12-04

## Outcome

Deliver versioned custom roles, a permission catalog/tree, protected templates, and one permission vocabulary shared by navigation and API enforcement.

## Acceptance criteria

- [x] Authorized admins can search the permission tree and create/version/archive custom roles with page and action grants.
- [x] Protected templates cannot be weakened, renamed, archived, or deleted through UI or direct API calls.
- [x] Changing a role produces the expected navigation/control visibility after policy refresh and the API enforces the same keys.
- [x] Global search and exports omit denied records, identifiers, snippets, and counts.

## Evidence

RED: domain, API-client, PostgreSQL, browser, and local-stack tests captured searchable page/action grants, protected templates, tenant isolation, version conflicts, exact endpoint permissions, hidden navigation/controls, denied search leakage, and loss of the final effective administrator through a custom-role edit.

GREEN: migration `034_roles_permissions.sql` persists versioned custom roles, append-only role history, protected templates, and idempotent role commands. `/production/roles` and `/production/search` use authenticated `/api/v1` endpoints and PostgreSQL; shared explicit keys drive navigation, controls, exports, search, and server authorization.

REFACTOR: the permission catalog and role service are isolated from the PostgreSQL repository, production navigation is a single permission-filtered definition, inactive roles no longer resolve into sessions, and final-admin serialization covers both membership and role changes.

Passing evidence (2026-09-14):

- Role service and migration contracts passed within `npm run test:production`; full result 223/227 with four opt-in PostgreSQL suites skipped only when their URLs were absent.
- V12-05 PostgreSQL integration passed 1/1, including tenant/branch RLS, refreshed effective permissions, append-only versions, protected-template SQL rejection, denied search leakage, role assignment, and final-effective-admin protection.
- `npm run local:up` and `npm run local:test` passed at 34 migrations with 21 HTTP/PostgreSQL checks; focused Playwright passed 9/9, including real persisted role, global-search, and user-management flows.
- `npm run test:unit` passed 14/14; `npm run test:production:typecheck`, `npm run build`, both harness verifiers, and `git diff --check` passed.
