# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S09<br>
Next slice: S10 — Action inbox and notification delivery

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S08 establish the tenant-aware operational journey through advisor inspection. S09 consumes recommended scope and emits only approved work/material activation events.

## S09 evidence

- `production/src/estimate-approval.ts` implements exact configured lines/tax/discount/payer totals, optimistic drafts, immutable numbered sent/approved revisions, and linked supplementary estimates.
- Opaque public links store only digests, expire, expose minimal data, and accept exactly one evidenced full/allowed-partial/reject/clarify action. Replays and unknown tokens fail without effects.
- Manual fallback requires customer/channel/private-attachment evidence and recent re-authentication; above the configured exact threshold, a different authorized checker must approve.
- Approval snapshots all six configuration classes and creates exactly one work and one material handoff containing only approved lines; supplementary approval never mutates/re-emits base scope.
- `009_estimate_approval.sql` provides forced tenant/branch RLS, exact values, immutable final evidence/activation, digest-only tokens, maker-checker separation, and unique activation outbox effects.
- Production tests passed 59/59; production typecheck, harness (119 requirements/29 slices/10 contiguous complete/no orphans), demo build, and Playwright 7/7 passed. No customer message, upload, provider call, deployment, push, or production action occurred.

## S10 first action

Read S10, R-039/R-040, D-020, and D-028. Start with a failing `/api/v1/actions` test proving each role sees only its prioritized tenant/branch-owned actions with due state, plain-language blocker, and guided next action. Then connect one eligible domain event through durable consent-aware in-app/push/WhatsApp/SMS-fallback delivery without duplicate effects.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Derive tenant/branch/role authority from verified membership; never trust client context.
- Consume durable domain events and use outbox workers; never send providers inline or expose secrets/customer data in logs.
- Consent, opt-out, template version, retry, fallback, provider status, and terminal failure must be explicit and idempotent.
- Use inert local provider adapters until external authority and credentials exist.
- After S10 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S10 and do not push.
