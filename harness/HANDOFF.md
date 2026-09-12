# WorkshopOS implementation handoff

Updated: 2026-09-12
Current branch: `prem-dev`
Completed slice: S24<br>
Next slice: S25 — Security, tenant-isolation, authorization, concurrency, and invariant release gates

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain unchanged and traceability is CLEAN through S24.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only, never a production migration source.
- S24 owns the inert tenant/branch-scoped import contract, not real migration execution. S28 still owns supervised real-tenant rehearsal, parallel reconciliation, cutover/rollback, hypercare, and repeatable second-tenant acceptance.

## S24 evidence

- `production/src/onboarding-import.ts` stages SHA-256-verified, schema/versioned local extracts through explicit mappings across customers, contacts, vehicles, ownership, items, lots, exact opening stock/value, advances, payments, credit, and open documents. Authenticated membership determines tenant/branch scope; row-supplied scope is ignored and demo/browser SQLite is explicitly rejected.
- Every dry-run row is accepted, rejected, or warned with a normalized stable key, actionable code, deterministic intended target/effect, and resolved references. Dry run has no operational effect; probable existing-target duplicates remain visible for review.
- Commit verifies the dry-run checksum and immutable batch fingerprint, rejects altered payload/key/manifest reuse, uses optimistic version and membership-scoped idempotency, and records each tenant/branch/entity/source effect once. Retries and safe reruns do not duplicate effects.
- Exact reconciliation covers entity/duplicate counts, fixed-decimal opening quantity by UOM and value, advances, payments, credit, and open-document balances. Acceptance is blocked until comparisons match or a distinct authorized checker approves every evidenced difference.
- `024_onboarding_import.sql` persists the import, staging, mapping, manifest, reconciliation, command, effect, and acceptance contract with exact numeric/minor units, forced RLS, append-only evidence, uniqueness, and row locking. The versioned representative fixture completes an automated local dry-run/commit/reconciliation rehearsal without claiming real-tenant evidence.
- Thirteen focused tests and the 179-test production regression suite pass. No live import, provider, storage, deployment, customer communication, or production tenant was touched.
- Real tenant extracts, mapping/source-key approval, duplicate-master resolution, stock freeze/count/value evidence, qualified India finance sign-off, and S28 controlled rehearsal remain external prerequisites.

## Verification

- `npm run test:production`: 179/179 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 25 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S25 first action

Read S25, R-005-R-008, R-016-R-018, R-035, R-048, R-092, R-105-R-107, and the cross-slice invariants. Begin with one failing release-gate test that attempts the same protected resource through API, PostgreSQL, object, queue/cache/export/report/log, shared-device, and public-token contexts, and proves every unauthorized tenant/branch/role path fails closed without an effect.

## Guardrails

- S25 must exercise real public contracts across completed slices and expose missing controls; do not replace broad isolation/invariant claims with static source searches alone.
- Preserve append-only correction, exact inventory/finance, independent QC/gate, private media/token, idempotency/concurrency, and offline-posting boundaries. Do not deploy, import live data, contact providers, message customers, push GitHub, or commit without the parent agent's review.
