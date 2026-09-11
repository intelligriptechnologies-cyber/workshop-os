# S22 — Guided boards, reports, and protected exports

Status: Complete
Implements: R-097, R-098, R-099

## Outcome
Provide role-guided operations plus defined reports, drill-through, and protected asynchronous exports.

## Acceptance criteria
- [x] Boards show only permitted live queues/capacity/delay/blocker/owner/next-action data in plain language.
- [x] Defined operational, inventory, profitability, finance, customer, staff, QC/rework, and audit metrics reconcile to source ledgers and drill through safely.
- [x] Exports remain tenant/branch filtered, audited, manifest/checksum protected, expiring, and inaccessible across tenants.

## Evidence

- `production/src/management-reporting.ts` derives tenant/branch/role/permission scope from membership, returns plain-language responsibility and capacity cues, suppresses unauthorized actions and financial fields, and exposes only eight defined report families with reproducible as-of drill-through.
- Metrics reconcile to immutable source-ledger references using exact integer or fixed-decimal aggregation. Export commands are idempotent and optimistic, execute asynchronously through an inert worker, and produce one private watermarked artifact plus snapshot/source manifest, SHA-256 digests, expiry, download audit, and reasoned revocation.
- `production/db/migrations/022_management_reporting.sql` persists versioned definitions, exact immutable facts, export state/artifacts/audit, fingerprinted commands, and unique durable worker effects with safe claims, append-only controls, and forced tenant/branch RLS.
- Eight focused public/storage tests pass. No live data was exported and no object, provider, deployment, or customer/staff side effect occurred. Production metric sign-off, scale/load validation, object-storage delivery, watermark/file review, and representative role usability remain external release prerequisites.
