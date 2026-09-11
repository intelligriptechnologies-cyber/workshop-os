# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S20<br>
Next slice: S21 — Closure controls, delivery evidence, and independent gate verification

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S20 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S18 owns native invoicing, S19 owns Tally-authoritative exchange, and S20 consumes either finalized authority through exact append-only payment, credit, correction, and settlement records without changing invoice authority.

## S20 evidence

- `production/src/payments-settlements.ts` posts exact immutable advances and partial/split cash, UPI, card, bank, credit, and manual payments with scoped evidence, unique references, retry receipts, and over-allocation prevention.
- Inert Cashfree links are tenant/customer/invoice/amount scoped and expiring. Redirects never post payment; only raw-body-preserved, signature-verified provider events post once, safely across invalid, duplicate, and reordered delivery.
- Formal credit retains limit, terms, approving identity, exposure, maker-checker exceptions, and explicit delivery eligibility. Advance/payment reversals, refunds, disputes, and chargebacks append linked compensating events without changing the original.
- Settlement reconciliation exposes exact gross, fees, tax, refunds, chargebacks, expected net, bank net, duplicate entries, unmatched financial references, and net mismatches.
- `020_payments_settlements.sql` persists exact ledgers/evidence, unique provider and command effects, serialized posting, durable worker claims, append-only guards, and forced tenant/branch RLS. Eight focused tests pass, including reordered manual/Cashfree over-allocation prevention.
- No provider call, money movement, bank import, external file write, or deployment occurred. Cashfree credentials/enrollment/webhook registration, representative bank settlement data, qualified India finance review, and authorized deployment remain external prerequisites.

## Verification

- `npm run test:production`: 141/141 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 21 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S21 first action

Read S21, R-089 through R-096, D-005/D-013/D-019/D-023/D-025, and the S16/S17/S18-S20 readiness evidence. Start with one failing public-interface test proving closure reports every plain-language work, QC, material, billing, payment/credit, incident, delivery-evidence, and gate blocker without permitting a gate pass or release.

## Guardrails

- Preserve unrelated user changes and demo behavior; derive tenant/branch authority from membership and force PostgreSQL RLS.
- Delivery requires complete work, independent QC release, reconciled material, finalized billing, satisfied payment or formally eligible credit, resolved blocking incidents, configured evidence, and a current numbered gate pass.
- Closure overrides require separate permission, recent re-authentication, maker-checker approval, reason/evidence, and retained audit visibility. Gate/Security independently verifies vehicle identity and current pass validity and cannot bypass blockers.
- Cashfree/provider credentials, bank data, India finance review, operational hardware/device validation, and deployment remain external prerequisites. Use local substitutes only; do not release vehicles, message customers, move money, deploy, or push GitHub.
