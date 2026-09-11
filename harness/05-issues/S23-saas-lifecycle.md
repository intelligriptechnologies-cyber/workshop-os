# S23 — SaaS tenant lifecycle, export, retention, and purge

Status: Complete
Implements: R-009, R-100, R-101, R-102, R-103, R-104

## Outcome
Operate tenant provisioning, entitlements, suspension/reactivation, support, complete export, retention, legal hold, and purge.

## Acceptance criteria
- [x] Idempotent provisioning and entitlement changes are server-enforced, versioned, audited, and never corrupt history.
- [x] Suspension blocks configured tenant use but preserves allowed platform/recovery paths; reactivation restores only current authorization.
- [x] Export is complete and checksum-manifested; purge dry-run and maker-checker respect eight-year statutory defaults, three-year photo defaults, warranty/legal holds, and all tenant-scoped stores.

## Local evidence

- `production/src/saas-lifecycle.ts` exposes only the separately authenticated `/api/v1/platform` boundary for tenant provisioning and lifecycle commands. Provisioning includes plan, entitlements, INR/timezone policy, branches, owner membership, configuration template, quotas, version, and audit evidence; fingerprinted idempotency and optimistic versions reject unsafe retries and stale writes.
- Entitlement/plan changes append immutable snapshots and tenant commands enforce the current entitlement server-side. Configured suspension blocks ordinary access and commands without removing data; recovery and authorized platform export remain available, while reactivation keeps only current memberships and entitlements.
- Support access requires a reason, bounded tenant/branch/permission scope, expiry, MFA/recent authentication, and a different approver. Access and expiry are audited and the grant remains visible to the tenant.
- Complete tenant export snapshots database, objects, caches, queues, exports, search, logs, and audit records. Its private artifact and manifest carry independent SHA-256 checksums, expiry, surface counts, source checksums, eight-year statutory/finance/audit/linked-Job retention, three-year photo retention, and warranty/legal-hold evidence.
- Purge first creates a checksum-bound tenant/version/surface dry run. Active warranty or legal hold, unexpired/default-unknown retention, changed inventory, stale versions, missing recent authentication, or maker/checker identity collision blocks execution. The approved adapter performs only tenant-scoped in-memory deletion simulation, retains platform purge evidence, and proves other-tenant records remain untouched; it performs no external deletion.
- `023_saas_lifecycle.sql` adds separately authorized platform-session seams, forced RLS, append-only lifecycle/entitlement/export/purge evidence, exact retention defaults and hold fields, fingerprinted idempotency, unique worker effects, and `FOR UPDATE SKIP LOCKED` claiming.
- Nine focused tests pass; the full production suite passes 166/166, along with type checking, the 119-requirement harness, production build, and 7/7 browser tests. No live tenant was provisioned, suspended, exported, reactivated, or purged; no object, cache, queue, search, log, database, or external provider was mutated.

## External prerequisites

- Representative production platform credentials and MFA/re-authentication policy, privacy/legal retention and purge review, qualified India finance/statutory retention confirmation, authoritative storage-surface inventory, export/object-store security review, restore/recovery validation, and controlled deployment approval remain required.
- A production purge requires an independently approved run against a verified dry-run manifest and supervised evidence capture. This local slice neither authorizes nor performs it.
