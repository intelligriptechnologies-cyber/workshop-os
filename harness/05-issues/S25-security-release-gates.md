# S25 — Security and invariant release gates

Status: Complete
Implements: R-005, R-006, R-007, R-008, R-016, R-017, R-018, R-035, R-048, R-092, R-105, R-106, R-107

## Outcome
Make isolation, authorization, concurrency, replay, media, public-token, and domain invariants blocking release tests.

## Acceptance criteria
- [x] Automated matrices deny cross-tenant/branch/role/shared-device/public-token/object/cache/queue/export/report/log access at API and database layers.
- [x] Stale writes, duplicate commands/webhooks, replayed customer/QR tokens, offline ledger attempts, malicious media, and concurrent invariant races fail safely without duplicate effects.
- [x] All maker-checker, re-authentication, immutable-ledger, inventory-conservation, QC, billing, closure, and gate invariants have negative tests.

## Local evidence

- `production/tests/security-release-gates.test.ts` adds seven blocking release-gate scenarios. The same protected work item is probed through API, local PostgreSQL-equivalent store, object, queue, cache, export, search, report, metric, and log boundaries; a different tenant and an unauthorized same-tenant branch receive no view while spoofed request scope is ignored.
- Shared-device PIN abuse locks the registered device session and a recovered switch remains attributable to one employee membership. Every offline authoritative posting category (lifecycle, custody, approval, inventory, finance, QC override, closure, and gate) returns `ONLINE_REQUIRED` without a committed effect.
- Signed Cashfree webhook tests prove invalid signatures and duplicate event IDs cannot create finance or evidence duplicates. Existing executable public API suites remain release-blocking for stale versions/idempotency fingerprints, estimate-token one-time minimum views, QR expiry/revocation minimum views, and durable queue replay.
- `production/src/security-release-gates.ts` supplies the deterministic private media boundary. MIME allow-list, exact content checksum, tenant quota, private tenant/branch object keys, authenticated trusted-scanner status, cross-scope read denial, and access audit are enforced. An uploader cannot self-declare `CLEAN`; an invalid scanner credential cannot change quarantine state.
- `production/db/migrations/025_security_release_gates.sql` persists tenant/branch-keyed private media, transactionally locked tenant quota, and append-only access evidence under forced RLS. Object keys are generated from authenticated tenant and authorized branch context rather than accepted from the caller; its security-invoker application view includes only `CLEAN` objects.

## Executable invariant matrix

| Negative control | Release-blocking public behavior evidence |
| --- | --- |
| Tenant, branch, role and side-channel isolation | `security-release-gates.test.ts`, `tenant-vertical.test.ts`, `boards-reports-exports.test.ts` |
| Shared device, MFA, re-authentication and maker-checker | `security-release-gates.test.ts`, `identity-access.test.ts`, `lifecycle-command-engine.test.ts` |
| Stale version, idempotency fingerprint and concurrent winner | lifecycle, appointment, planning, inventory, procurement, QC, invoice, Tally, warranty, and import public API suites |
| Single-use customer token and narrow expiring/revocable QR | `estimate-approval.test.ts`, `delivery-gate.test.ts` |
| Offline sensitive postings and untrusted media | `security-release-gates.test.ts`, reception and technician public draft-store suites |
| Immutable inventory/finance and exact material conservation | inventory, material-control, procurement, native-invoice, and payments public API suites |
| Independent QC/rework, billing readiness, closure and Gate | QC, native-invoice, and delivery-gate public API suites, including issuer/verifier separation |

Seven S25-focused tests and the full 186-test production regression suite pass with type checking. This is deterministic local/application-contract evidence, not a live PostgreSQL penetration test, AWS storage policy audit, provider certification, or production security review.

## External prerequisites

- S26 still must exercise deployed queue/provider recovery, tenant-safe telemetry, backup/restore, capacity, availability, and disaster recovery.
- Authorized infrastructure penetration testing, IAM/object-store policy review, malware-scanner/provider integration certification, secret rotation, and production operational review remain release prerequisites; no deployment, provider, customer, or live tenant was touched.
