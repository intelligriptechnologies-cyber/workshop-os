# WorkshopOS implementation handoff

Updated: 2026-09-12
Current branch: `prem-dev`
Completed slice: S23<br>
Next slice: S24 — Idempotent onboarding import and reconciliation

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S23 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only, never a production migration source.
- S23 owns separately authorized tenant provisioning/lifecycle, current entitlement enforcement, scoped support, complete tenant export, retention/hold evaluation, and purge control. It does not mutate external infrastructure or authorize a production purge.

## S23 evidence

- `production/src/saas-lifecycle.ts` models idempotent, optimistic, audited provisioning plus versioned entitlement/plan history. Current entitlements are server-enforced; configured suspension blocks ordinary access/commands while preserving data and narrow recovery/export paths, and reactivation restores only current membership/entitlement state.
- Support grants are tenant/branch/permission scoped, reasoned, expiring, tenant-visible, MFA/re-authenticated, independently approved, and access-audited.
- The inert export worker snapshots database, objects, caches, queues, exports, search, logs, and audit into a private expiring artifact and independent checksum manifest including per-record checksum, retention, warranty, and legal-hold evidence.
- Purge requires a checksum-bound dry-run at the exact tenant version, expired eligibility, clear eight-year statutory/finance/audit/linked-Job and three-year photo retention, no warranty/legal hold, recent re-authentication, and a separate checker. Approval rechecks inventory and runs only an in-memory tenant-scoped deletion simulation while retaining purge evidence and other-tenant data.
- `023_saas_lifecycle.sql` provides platform-authorization session seams, forced RLS, append-only lifecycle/entitlement/export/purge evidence, retention defaults/hold fields, fingerprinted commands, unique effects, and safe worker claiming.
- Nine focused tests and the 166-test production regression suite pass. No live platform, tenant, export, storage surface, deployment, purge, or external provider was contacted or changed.
- Production platform credentials, privacy/legal and India finance retention review, authoritative storage inventory, export/object security, restore/recovery validation, and controlled deployment/purge approval remain external prerequisites.

## Verification

- `npm run test:production`: 166/166 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 24 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S24 first action

Read S24, R-113/R-114, D-018/D-031/D-032, and the tenant/configuration/customer/inventory/finance ownership boundaries. Start with one failing public import test proving a tenant-scoped staged row becomes either an explicitly mapped accepted row or an actionable rejected row in a source-to-target dry-run manifest, with no committed operational effect.

## Guardrails

- Stage only authorized tenant extracts; never use the demo SQLite dataset as production source and never trust tenant/branch identifiers from a row over authenticated import scope.
- Dry-run and commit must be fingerprinted/idempotent, repeatable without duplicates, and reconcile entity counts, duplicates, stock quantity/value, advances/payments/credit, and document balances before acceptance.
- Preserve S23 suspension, export, retention, legal-hold, and purge boundaries. Do not import live data, deploy, message users, contact providers, push GitHub, or commit without the parent agent's review.
