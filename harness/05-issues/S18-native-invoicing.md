# S18 — Native GST invoicing and adjustments

Status: Complete
Implements: R-073, R-074, R-075, R-076, R-077, R-078

## Outcome
Enforce billing readiness and exact India GST invoices per payer with immutable documents, notes, cancellation rules, and fiscal rollover.

## Acceptance criteria
- [x] Work/QC/material/supplement blockers prevent billing and tenant invoice authority is explicit.
- [x] GST, discounts, rounding, payer allocation, and totals are exact from snapshots; one final invoice per payer cannot duplicate/omit lines.
- [x] Final documents/numbers cannot be edited or reused; approved credit/debit/cancel-reissue paths work across financial-year rollover and concurrency.

## Evidence

- `production/src/native-invoicing.ts` exposes tenant/branch-authorized readiness, draft, finalization, immutable-update rejection, and maker-checker correction contracts. It consumes S15/S16 readiness signals, snapshots authority/tax/template configuration, performs exact minor-unit intra/interstate GST, fixes every approved line to one payer, and emits one private-document/downstream event.
- `production/db/migrations/018_native_invoicing.sql` persists readiness projections, payer registers, exact immutable invoice lines/documents, approved compensating adjustments, fingerprinted commands, serialized atomic fiscal allocation, unique effects, and forced tenant/branch RLS.
- Nine focused public-interface/static-contract tests cover exact rational odd-basis-point GST splitting, India-timezone FY rollover, concurrent numbering, idempotent retry, stale/cross-tenant rejection, finalized immutability, and approved credit/debit/cancel-reissue paths. Full gate evidence is recorded in `harness/HANDOFF.md`.
- Qualified India finance/tax review remains an external prerequisite for production certification; this engineering slice did not allocate real numbers, post/send invoices, or claim statutory approval.
