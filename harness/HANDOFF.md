# WorkshopOS implementation handoff

Updated: 2026-09-12
Current branch: `prem-dev`
Completed slice: S22<br>
Next slice: S23 — Tenant suspension, support, export, retention, and purge

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S22 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S22 consumes tenant-scoped operational and ledger projections without mutating them, and owns permission-guided boards, curated metric definitions, protected drill-through, and private asynchronous export evidence.

## S22 evidence

- `production/src/management-reporting.ts` filters live board items and capacity by membership tenant, branch, role, and required action permission, uses non-ERP responsibility/delay/blocker/next-action wording, and never returns protected financial board fields.
- The catalog contains only the defined operational, inventory, profitability, finance, customer, staff, QC/rework, and audit families. Metrics reconcile to immutable source references at an explicit as-of snapshot using exact fixed-decimal aggregation; drill-through redacts protected finance fields unless separately authorized.
- Export requests are permissioned, branch-filtered, idempotent, versioned, and asynchronous. The inert worker emits one private watermarked CSV/JSON artifact and source manifest with independent SHA-256 digests and expiry; status/download reauthorize scope, validate both digests, audit access, and honor reasoned revocation.
- `022_management_reporting.sql` persists versioned definitions, exact append-only facts, export/artifact/audit state, fingerprinted commands, unique worker effects, safe worker claims, and forced tenant/branch RLS.
- Eight focused tests pass. No live export, object write, message, deployment, or provider action occurred. Production metric sign-off, representative ledger reconciliation, reporting scale/load validation, object-storage delivery, file/watermark review, and role usability remain external prerequisites.

## Verification

- `npm run test:production`: 157/157 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 23 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S23 first action

Read S23, R-100 through R-104, D-004/D-005/D-017/D-018/D-025/D-029, and S02/S17/S22 platform, legal-hold, and export boundaries. Start with one failing platform-interface test proving suspension blocks configured tenant commands while preserving data and narrowly authorized platform recovery operations.

## Guardrails

- Preserve unrelated user changes and demo behavior; derive tenant/branch authority from membership and force PostgreSQL RLS.
- Tenant lifecycle commands must use the separately authorized platform surface; support access remains explicit, scoped, expiring, re-authenticated, and audited.
- Suspension preserves data. Export respects retention/legal holds. Purge requires expiry eligibility, a dry-run inventory, maker-checker approval, evidence, and tenant-scoped deletion across every named storage surface.
- Representative platform credentials, privacy/legal review, production storage inventory, restore/recovery validation, and authorized deployment remain external prerequisites. Use local substitutes only; do not suspend/purge a live tenant, export live data, deploy, or push GitHub.
