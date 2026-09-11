# S19 — Tally connector and file fallback

Status: Complete
Implements: R-079, R-080, R-081

## Outcome
Support Tally-authoritative invoice exchange, reconciliation, and controlled fallback for current plus two prior TallyPrime releases.

## Acceptance criteria
- [x] Contract suites for all three supported release generations export/import without duplicate invoices under retry/reorder.
- [x] File fallback validates, manifests, reconciles, and prevents duplicates.
- [x] Tally IDs/status/errors and amount/tax/payer mismatches remain visible and never silently switch accounting authority.

## Evidence

- `production/src/tally-connector.ts` exposes a tenant/branch/permission-authorized `/api/v1` exchange boundary for the documented `CURRENT`, `PRIOR_1`, and `PRIOR_2` representative generations. It refuses non-Tally invoice authority, snapshots each payer/Job billing candidate into one exchange, retains a stable export effect, and creates no WorkshopOS-native invoice.
- Direct acknowledgements and controlled in-memory file imports tolerate retry and reordered delivery, validate release/schema/manifest/SHA-256, reject duplicate Tally vouchers, retain Tally status/identifier/error evidence, and append visible amount/tax/payer/posting reconciliation mismatches without changing authority.
- `production/db/migrations/019_tally_connector.sql` persists exact-money exchanges, unique acknowledgements/voucher identities, immutable reconciliation/file/replay evidence, fingerprinted commands, serialized acknowledgement acceptance, durable bounded retry/dead-letter/replay state, unique effects, and forced tenant/branch RLS.
- Seven focused integration/static-contract tests pass. Representative Tally installations/credentials, mapping against exact vendor releases, vendor-version certification, and qualified India finance review remain external prerequisites; the slice contacted no provider and wrote no external exchange files or invoices.
