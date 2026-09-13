# Persist the v1.2 programme contract

Status: Complete  
Implements: V12-R001, V12-R002, V12-R003, V12-R004, V12-R005, V12-R006, V12-R007, V12-R008, V12-R009, V12-R010, V12-R011, V12-R012, V12-R013, V12-R014, V12-R015, V12-R016, V12-R017, V12-R018, V12-R019, V12-R020, V12-R021, V12-R022, V12-R023, V12-R024, V12-R025, V12-R026, V12-R027, V12-R028, V12-R029, V12-R030, V12-R031, V12-R032, V12-R033, V12-R034, V12-R035, V12-R036  
Blocked by: None — approved programme intake.

## Outcome

Persist the approved specification, decisions, 36-requirement PRD, absence audit, 17 vertical slices, clean traceability, living checklist, durable handoff, and an executable drift gate. These mappings are governance coverage only; product delivery belongs to V12-01–V12-16.

## Acceptance criteria

- [x] `node scripts/verify-ui-enhancement-v1.2.mjs` finds exactly 36 contiguous requirements and 17 contiguous slice files.
- [x] Every requirement maps to at least one product slice, every product slice maps to a real requirement, and traceability is CLEAN.
- [x] Completed slices form a contiguous prefix; checklist state, checked acceptance criteria, evidence, and the single-next-slice handoff agree.
- [x] The historical S00–S28 programme and the user's existing Data Flow changes remain unmodified.

## Evidence

RED: the verifier was absent and Node returned `MODULE_NOT_FOUND`. GREEN: the persisted programme passes the v1.2 verifier, historical harness, unit suite, production typecheck, and diff check on 2026-09-13.

