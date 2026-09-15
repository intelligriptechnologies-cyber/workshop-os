# Project and command the canonical Job lifecycle

Status: Complete
Implements: V12-R019, V12-R020, V12-R021, V12-R022  
Blocked by: V12-09

## Outcome

Make lifecycle state, valid commands, blockers, hold/resume, cancellation/reopening/archive, acceptance/payment facts, history, and Data Flow a server-authoritative Job experience.

## Acceptance criteria

- [x] Job details show the canonical stage, valid next actions, required reasons, blockers, and immutable attributed history; stale/invalid commands are rejected.
- [x] Hold pauses and resumes the same underlying stage; cancelled Jobs can reopen or archive but expose no hard-delete path.
- [x] Estimate Approved, Work Accepted, and Payment Cleared are distinct facts and release/closure blockers evaluate them correctly.
- [x] Data Flow clearly identifies one selected Job and explains its actual Visit, estimate, work, QC, billing, payment, custody, documents, and history.

## Evidence

RED: focused projection, client, PostgreSQL, local-smoke, and browser tests were added for canonical actions and blockers, stale commands, Hold/resume, cancel/reopen/archive, separate evidenced facts and permissions, immutable history, and record-specific Data Flow. Integration review added coverage for the dedicated historical Job selector without hidden Job List authority.

GREEN: a fresh database applied migrations 001–039 and the focused PostgreSQL integration passed 1/1. Docker smoke passed repeatedly at 39 migrations. Focused Playwright passed 6/6 with the intended live-stack skip and 7/7 against the real HTTP/PostgreSQL runtime.

REFACTOR: lifecycle projection is a pure reusable module; command persistence remains versioned, idempotent, RLS-scoped, and append-only. Data Flow uses its own exact-permission selector and explains nine record-specific domains. Final regressions passed: build; unit 20/20; production 236/244 with eight expected opt-in PostgreSQL skips; typecheck; full Playwright 49/57 with eight expected real-stack skips; both harness verifiers; and `git diff --check`.
