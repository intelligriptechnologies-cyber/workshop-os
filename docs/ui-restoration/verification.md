# Verification results — 2026-10-20

| Check | Result |
| --- | --- |
| Production build | Passed |
| Frontend unit suite | 257 passed |
| Focused login/session browser suite | 7 passed |
| Real API/PostgreSQL login in two browser contexts | 1 passed |
| Dedicated PostgreSQL email/session integration and password unit tests | 3 passed |
| Expanded visual suite | 2 login tests passed; 2 shell tests fail at header comparison; sidebar comparisons pass |
| Broader browser suite, stop after six failures | 27 passed, 6 failed, 1 skipped, 75 not run; interrupted worker error reported |
| Backend unit/integration suite on disposable clone | 69 passed, 1 failed |
| Demo account repair dry run on clone | Aborted on import provenance mismatch; no repair applied |
| Git whitespace check | Passed |

Browser failures:

1. `global-users.spec.ts`: user-management test times out.
2. `remote-job-delivery.spec.ts`: expected rejection alert locator matches
   three alerts, including missing checklist/service-task fixture responses.
3. `ui-restoration.spec.ts`, desktop: header image differs at bottom edge.
4. `ui-restoration.spec.ts`, mobile: header image differs at bottom edge.
5. `workshopos.spec.ts`, responsive My Queue: expects one row, receives ten.
6. `workshopos.spec.ts`, advance booking month range: expects November 2026,
   receives October 2026.

Backend failure:

`test_tenant_isolation.py::test_rls_fails_closed_and_blocks_cross_tenant_and_cross_branch_rows`
fails a settings equality assertion: the returned settings retain a `name`
field in addition to the expected `theme`. This does not establish that the
isolation acceptance gate passes; the remainder of that test did not complete.

Raw broader-run outputs are preserved at
`.scratch/restoration-browser-results.txt` and
`.scratch/restoration-backend-results.txt`. No expectations were loosened to
make these failures pass. No operational page or full-regression gate is
marked complete.
