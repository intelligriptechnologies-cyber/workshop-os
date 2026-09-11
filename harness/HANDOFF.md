# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S18<br>
Next slice: S19 — Tally connector and file fallback

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S18 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S17 establish the tenant-aware operational journey through warranty/comeback and incident resolution. S18 now owns readiness-gated WorkshopOS-native GST invoice creation, payer allocation, immutable fiscal documents, and compensating correction records.

## S18 evidence

- `production/src/native-invoicing.ts` derives tenant/branch authority from membership, requires S12 completion plus exact S15 material and S16 independent-QC signals, rejects pending supplementary scope, and exposes the configured invoice authority explicitly.
- Native drafts snapshot tax/template configuration and calculate discount, taxable value, CGST/SGST/IGST, and payer totals entirely in minor-unit integer arithmetic. Rational half-rate calculation covers odd basis-point slabs without fractional conversion or floating-point failure.
- Every approved line belongs to one payer; finalization checks payer completeness, permits one live finalized invoice per payer/Job, and allocates collision-free branch/type/India-financial-year numbers in tenant timezone. Retried commands retain one number and one private document/downstream event.
- Finalized invoices and numbers reject mutation. Distinct recently authenticated approval finalizes linked credit/debit notes or configured cancellation/reissue records; the original remains intact and replacement numbering never reuses it.
- `018_native_invoicing.sql` persists readiness, exact invoice/payer/line/document data, approved adjustments, unique outbox effects, command fingerprints, atomic fiscal allocation, append-only controls, and forced tenant/branch RLS.
- Nine focused S18 tests pass. No real number was allocated and no invoice was posted, rendered, sent, or certified; qualified India finance/tax review remains required before production certification.

## Verification

- `npm run test:production`: 126/126 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 19 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S19 first action

Read S19, R-079 through R-081, D-012/D-018/D-026, and S18’s explicit invoice-authority and immutable fiscal-event boundaries. Start with one failing contract test across the current and two prior representative TallyPrime release generations proving that a Tally-authoritative tenant exports and imports the agreed invoice lifecycle exactly once under retry and reordered acknowledgements without creating a WorkshopOS-native invoice.

## Guardrails

- Preserve unrelated user changes and demo behavior; do not evolve browser-local SQLite into the production source.
- Keep invoice authority explicit and unchanged by connector status. Tally identifiers, errors, and amount/tax/payer/posting mismatches remain visible and never silently switch authority.
- Direct and controlled-file paths require tenant/branch permission, manifests/checksums, version/idempotency controls, duplicate prevention, and append-only reconciliation evidence across all three supported release generations.
- Representative Tally credentials/installations, exact vendor release certification, qualified India finance review, and any deployment remain external prerequisites. Use inert local adapters only; do not contact Tally, post/send invoices, or push GitHub.
