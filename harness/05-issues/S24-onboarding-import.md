# S24 — Idempotent onboarding import and reconciliation

Status: Complete
Implements: R-113, R-114

## Outcome
Stage, validate, map, dry-run, commit, rerun, and reconcile real tenant migration extracts without treating demo SQLite as source.

## Acceptance criteria
- [x] Source-to-target manifest identifies every accepted/rejected row; repeated dry-run/commit cannot duplicate effects and remains tenant-scoped.
- [x] Counts, duplicates, stock quantity/value, advances/payments/credit, and document balances reconcile or block acceptance with actionable differences.

## Local evidence

- `production/src/onboarding-import.ts` exposes an authenticated tenant/branch import workspace for versioned, SHA-256-verified non-demo extracts. Explicit per-entity field mappings stage customers, contacts, vehicles, ownership, items, lots, exact opening stock/value, advances, payments, credit, and open documents; row-supplied tenant/branch fields are discarded.
- Dry runs normalize stable source keys and identify every row as accepted, rejected, or warning with an actionable code, deterministic intended target ID/effect, and resolved source references. Unsupported types, missing fields/references, duplicate source keys, probable existing-target duplicates, and non-string exact quantities/minor units are visible without an operational effect.
- The dry-run manifest is bound to the immutable source checksum, schema/version, mappings, staged rows, batch fingerprint, tenant, and branch. A commit verifies the manifest and fingerprint, uses optimistic versions and membership-scoped idempotency, and creates one unique source effect. Same-command retries return the original audit evidence; safe reruns add zero effects; changed payloads, source keys, mappings, or committed manifests are rejected.
- Reconciliation compares imported entity and duplicate counts, fixed-decimal opening quantities by UOM, opening value, advances, payments, credit, and open-document balances using exact arithmetic. Differences name expected, actual, exact delta, and a corrective action; acceptance remains blocked until every configured comparison matches or every difference has reasoned evidence from a separately authorized checker.
- `production/fixtures/onboarding-import/representative-v1.json` is a deliberately inert, versioned local extract. Its automated rehearsal stages, dry-runs, commits, and exactly reconciles representative customer, item, opening-stock, advance, payment, credit, and open-document data. It is not evidence of a real tenant migration or finance approval.
- `production/db/migrations/024_onboarding_import.sql` persists source batches, mappings, staged rows, row results, manifests, exact reconciliations/differences, fingerprinted commands, unique operational effects, and acceptance evidence under forced tenant/branch RLS. Source/effect constraints, append-only evidence triggers, exact `numeric(24,6)`/minor units, and a `FOR UPDATE` batch lock provide database enforcement and concurrency seams.
- Thirteen focused tests pass; the full production suite passes 179/179 with type checking. No live import, demo SQLite migration, tenant data, provider, storage surface, deployment, or customer communication was contacted or changed.

## External prerequisites

- An authorized real tenant extract, approved field mappings and source-key rules, target-master duplicate review, opening-stock freeze/count/value evidence, and qualified India finance sign-off of advances, payments, credit, tax/document balances remain required before any production migration acceptance.
- S28 owns supervised real-tenant dry runs, the two-week parallel reconciliation, controlled cutover/rollback, hypercare, and repeatable second-tenant acceptance. This slice provides the inert contract and rehearsal fixture only.
