# S09 — Versioned estimates and customer approval

Status: Complete
Implements: R-032, R-033, R-034, R-035, R-036, R-037, R-038

## Outcome
Support exact payer-aware estimates, immutable versions, partial/rejected/manual approval, supplementary scope, secure tokens, and atomic activation.

## Acceptance criteria
- [x] Totals and payer allocations are exact; sent/approved versions are immutable and linked to revisions.
- [x] Expiring single-use tokens safely record full/allowed-partial/reject/clarify outcomes and resist replay/tenant discovery; manual fallback requires complete evidence and policy.
- [x] Additional work cannot activate without supplementary approval; activation snapshots configuration and creates no duplicate work/material under retries.

## Evidence

- `production/src/estimate-approval.ts` consumes S08 scope into exact configured SERVICE/PACKAGE/MATERIAL/LABOUR lines, payer allocations, draft revisions, immutable numbered sends, and tenant-scoped idempotent commands.
- Public links store only SHA-256 token digests and expose a minimal view. Full, allowed-partial, reject, and clarify outcomes capture evidence, expire, and become unavailable after one action without duplicate activation.
- Evidenced manual fallback requires a private attachment, channel, customer acknowledgement, recent re-authentication, and a distinct authorized checker above the configured exact minor-unit threshold.
- Primary and supplementary estimates are linked but independently immutable/approvable. Approval snapshots PRICE/TAX/WORKFLOW/RECIPE/CHECKLIST/POLICY and emits one work-planning plus one material-control event for only the approved lines.
- `production/db/migrations/009_estimate_approval.sql` forces tenant/branch RLS, exact values, token digests, immutable approval/activation ledgers, maker-checker separation, and unique activation outbox effects.
- Verified 2026-09-11: production tests 59/59, production typecheck, harness (119 requirements/29 slices/10 contiguous complete/no orphans), demo build, and Playwright 7/7 passed. No external action occurred.
