# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S19<br>
Next slice: S20 — Payments, advances, credit, refunds, and settlement

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S19 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S17 establish the operational journey. S18 owns WorkshopOS-native GST documents; S19 now provides the alternative Tally-authoritative exchange and controlled-file paths without silently changing authority.

## S19 evidence

- `production/src/tally-connector.ts` supports `CURRENT`, `PRIOR_1`, and `PRIOR_2` representative release contracts. Direct export/acknowledgement remains idempotent under retry and reordered delivery, deduplicates Tally vouchers, and never creates a WorkshopOS-native final invoice.
- Controlled file fallback emits an in-memory export plus schema/release/record-count/checksum manifest, validates import manifest/content before effect, and shares the same unique acknowledgement/reconciliation path.
- Tally identifiers, posting status/errors, and amount/tax/payer/posting mismatches remain immutable and visible while invoice authority stays `TALLY_AUTHORITATIVE`. Delivery retries reach durable dead letter and require reasoned authorized replay of the same effect key.
- `019_tally_connector.sql` persists exact exchanges/acks, file artifacts, mismatch details, delivery/replay/audit evidence, worker claims, unique effects, append-only records, idempotency fingerprints, and forced tenant/branch RLS.
- Seven focused S19 tests pass. No connector call or external file write occurred. Real current-plus-two-prior TallyPrime installations, credentials, and vendor-version certification remain external prerequisites.

## Verification

- `npm run test:production`: 133/133 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 20 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S20 first action

Read S20, R-082 through R-088, D-005/D-012/D-019/D-020/D-027, and S18/S19 immutable invoice-authority boundaries. Start with one failing public-interface test proving that exact advance and split/manual payment events allocate to the correct tenant/customer/Visit/Job/invoice, reject duplicate references, never over-allocate, and use approved compensating entries for correction.

## Guardrails

- Preserve unrelated user changes and demo behavior; derive tenant/branch authority from membership and force PostgreSQL RLS.
- All money remains exact minor units. Posted payments, advances, refunds, chargebacks, and settlement entries are append-only or compensated; never destructively edited.
- Cashfree redirects are never payment proof. Only raw-body-preserved, signature-verified, idempotent authoritative webhook evidence may post provider payment, with reordered/duplicate delivery handled safely.
- Formal credit exposure controls delivery eligibility. Settlement reconciliation exposes unmatched/duplicate gross, fee, tax, refund, chargeback, and net-bank entries.
- Cashfree/provider credentials, enrollment, webhooks, bank data, India finance review, and deployment remain external prerequisites. Use inert adapters only; do not create live links, move money, message customers, or push GitHub.
