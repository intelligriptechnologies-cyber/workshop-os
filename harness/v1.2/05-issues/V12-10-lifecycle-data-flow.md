# Project and command the canonical Job lifecycle

Status: Planned  
Implements: V12-R019, V12-R020, V12-R021, V12-R022  
Blocked by: V12-09

## Outcome

Make lifecycle state, valid commands, blockers, hold/resume, cancellation/reopening/archive, acceptance/payment facts, history, and Data Flow a server-authoritative Job experience.

## Acceptance criteria

- [ ] Job details show the canonical stage, valid next actions, required reasons, blockers, and immutable attributed history; stale/invalid commands are rejected.
- [ ] Hold pauses and resumes the same underlying stage; cancelled Jobs can reopen or archive but expose no hard-delete path.
- [ ] Estimate Approved, Work Accepted, and Payment Cleared are distinct facts and release/closure blockers evaluate them correctly.
- [ ] Data Flow clearly identifies one selected Job and explains its actual Visit, estimate, work, QC, billing, payment, custody, documents, and history.

## Evidence

Pending.

