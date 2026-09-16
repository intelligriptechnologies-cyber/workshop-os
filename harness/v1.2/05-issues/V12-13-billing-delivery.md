# Migrate billing, payment, gate, delivery, and closure

Status: Complete
Implements: V12-R028, V12-R029  
Blocked by: V12-08, V12-10, V12-12

## Outcome

Deliver the production financial and custody path from final invoice through payment, receipt, pre-release gate pass, release, delivery acknowledgement, and closure.

## Acceptance criteria

- [x] Final invoices and posted payments are immutable; authorized corrections use maker-checker approval and compensating records.
- [x] Payment recording creates attributable receipt evidence and Payment Cleared is derived/enforced separately from Work Accepted.
- [x] A gate pass is generated and authorization-checked before vehicle release; required documents/facts block release and closure.
- [x] Delivery acknowledgement and closure append immutable custody/lifecycle history and cannot be reordered by direct API calls.

## Evidence

- A fresh database applied all 42 migrations and focused PostgreSQL acceptance passed 1/1. It proves immutable invoice/payment records, active payer registration, finalization and adjustment outbox events, effective credit-note balances, overpayment rejection, independent invoice/payment correction approval, compensating events, private invoice/credit-note/receipt/gate-pass bytes, RLS, lifecycle ordering, and independent gate verification.
- `npm run local:up` rebuilt the final image and `npm run local:test` passed against the 42-migration HTTP/PostgreSQL runtime with 50 checks, including Billing/custody projection and exact authorization.
- Focused Playwright passed 3/3, including accessible correction dialog behavior and idempotent versioned commands. Full Playwright passed 57/66 with nine configured real-stack skips.
- `npm run build` passed with the existing bundle-size warning; `npm run test:unit` passed 26/26; `npm run test:production` passed 241/253 with 12 expected opt-in PostgreSQL skips; production typecheck and `git diff --check` passed.
- Final finance, Work Accepted, Payment Cleared, delivery acknowledgement, gate issuance, independent release, and closure are distinct ordered records. Direct repository/API tests prove that required steps cannot be skipped.
