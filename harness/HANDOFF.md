# WorkshopOS implementation handoff

Updated: 2026-09-10  
Current branch: `prem-dev`  
Completed slice: S04<br>
Next slice: S05 — Customer and vehicle identity

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S03 established the tenant-aware vertical, identity/access controls, and versioned configuration. S04 adds the only lifecycle transition engine and its forced-RLS persistence contract.

## S04 evidence

- `production/src/lifecycle-command-engine.ts` owns stable stage changes, fact-specific blockers, `If-Match`, tenant-scoped idempotency replay, cancellation/reopening, and closure-override controls.
- The complete stage-pair table is tested. Stale, invalid, blocked, or wrong-target reopening commands leave resource state/history/audit unchanged.
- Sensitive actions preserve reason/evidence/authentication and require a distinct recently authenticated checker at configured thresholds.
- `production/db/migrations/004_lifecycle_command_engine.sql` forces tenant/branch RLS and append-only history/audit while uniquely recording idempotency results.
- Production tests passed 25/25; production typecheck, harness (119 requirements/29 slices/5 contiguous complete/no orphans), demo build, Playwright 7/7, and diff check passed. No external call, deployment, push, or production action occurred.

## S05 first action

Read S05 and R-021 through R-025. Start with a failing public `/api/v1` test that creates/searches tenant-scoped customers with multiple contacts and flags exact/probable duplicates, then extend vertically to vehicle identity, odometer/service history, effective-dated ownership, and controlled merge/compensation.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Never trust client tenant/branch input; derive authority from verified membership and maintain PostgreSQL RLS.
- Reuse S01 authorization/idempotency and S04 optimistic command patterns; do not create a bypassing CRUD surface.
- Ownership/merge changes must preserve prior jobs, payers, aliases, and history without destructive mutation.
- Keep AWS/Cognito/provider activity local until explicitly authorized.
- After S05 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S05 and do not push.
