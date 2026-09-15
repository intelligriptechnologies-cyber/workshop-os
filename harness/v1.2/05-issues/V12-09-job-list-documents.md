# Migrate the Job List and document discovery

Status: Complete
Implements: V12-R017, V12-R018  
Blocked by: V12-03, V12-05, V12-07

## Outcome

Deliver the production Job List with Visit-date operations, consistent status presentation, Job Card PDF, and conditional linked-document downloads.

## Acceptance criteria

- [x] Opening Job List defaults to the branch-local current date and labels it as Visit/check-in date; Clear returns to that default.
- [x] Date, status, and search filters use server paging/sort; `In Progress` is orange in grid, table, and detail contexts.
- [x] Authorized users download the same Job Card PDF from card, row, and details.
- [x] Estimate, invoice, receipt, and gate-pass links appear only when the immutable artifact exists and direct unauthorized downloads fail.

## Evidence

RED: focused query/export, client, PostgreSQL, and browser coverage was added for invalid dates, complete exports, branch-local Visit filtering, canonical lifecycle presentation, immutable settings capture, document eligibility, authorization, and UI consistency.

GREEN: a fresh database applied migrations 001–038 and the V12-09 PostgreSQL integration passed 1/1. Repeatable Docker smoke passed twice at 38 migrations. Focused Playwright passed 2/2 with the intended local-stack skip and 3/3 against the real HTTP/PostgreSQL runtime.

REFACTOR: Job query normalization, export generation, API error handling, navigation permissions, and document discovery are separated into reusable production modules. Final regressions passed: build; unit 19/19; production 233/241 with eight expected opt-in PostgreSQL skips; typecheck; full Playwright 45/53 with eight expected real-stack skips; both harness verifiers; and `git diff --check`.
