# 34 — Stage 4B PostgreSQL schema validation

Implemented the supported additive schema on disposable PostgreSQL only. The final schema has **106 public tables including alembic_version**. This is partial acceptance of the full Stage 3 contract: the unresolved fields and transformations in [35](35-SCHEMA-DIFFERENCES-AND-IMPORT-GATES.md) remain blocked. No demo import, frontend integration, business-service implementation, deployment, commit or push occurred.

## S4B-01 — Preservation and environment

Branch/HEAD remain `Prem-dev-fbb-Go21` / `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. All 115 protected files, 94 screenshots and eight SQLite copies match their recorded hashes before and after work. The 51 historical invoice discrepancies are preserved by unchanged SQLite bytes; no invoice recalculation was run. Existing uncommitted `AGENTS.md`, Stage 4A foundation, documentation, scratch and data-migration work were retained.

Project `workshopos-stage4b` has separate `stage4b_dev` and `stage4b_test` clusters, owner credentials, volumes and internal networks, with no published ports. No production/staging host, credentials or network is configured. Existing application and Stage 4A services are not migration targets. The runner rejects any mismatched host/database/user/scope tuple and query-string host override before connecting, verifies the connected database/user, and verifies all 63 candidate files against the pinned source manifest. Local credential files are ignored and not mounted into runners.

The owner role is used for disposable DDL and synthetic test setup only. Runtime enforcement is tested using the restricted `workshopos_runtime` role. This does not approve superuser application execution or establish full authentication/RBAC acceptance.

## S4B-02 — Lineage and schema

- Original root: `20260929_0001`; original head: `20261018_0033`.
- Original 34 revisions include a branch at `20260929_0008`: `20260929_0009` and `20261001_0002`, merged by `20261001_0003`. No extra dependency/branch labels were found.
- New append-only chain: `20261018_0033 -> 20261021_0034 -> 20261021_0035`. Final history: **36 revisions, one head**.
- Clean original replay produces 74 tables, including Alembic. Static upgrade inspection identifies 73 literal application table definitions and no duplicate table definitions; runtime catalog corroborates the table set.
- Revision 0034 adds the 26 documented source business entities and six support tables, optional compatibility fields, optimistic versions, exact numeric storage, source evidence fields, scoped keys/FKs/indexes, checks, RLS and metadata integrity triggers. Original scoped unique keys are reused where already present.
- Revision 0035 adds nine same-job FKs and four parent composite unique keys. This prevents known job references from linking to another job's invoice/material/approval/local-purchase record within the same tenant and branch. Nullable absent links retain their documented semantics.
- No historical file was edited, squashed, reparented or stamped. The older checkout lineage bridge remains unimplemented. The new migrations use Alembic `version_locations` alongside the pinned candidate history; they do not overwrite `backend/alembic` in the frontend checkout.

The [baseline catalog](stage4b-baseline-catalog.json.md) and [final catalog](stage4b-test-catalog.json.md) enumerate every actual column/type/default/nullability/identity, constraint and index. [Lineage analysis](stage4b-lineage-analysis.json.md) lists each historical revision's created tables and downgrade disposition. The [0034 contract](stage4b-schema-contract.json.md) records 522 column assertions, 252 added constraints and 173 explicit indexes; 0035 contributes its nine additional FKs/indexes and four parent keys. See the final catalog for total counts including inherited constraints and implicit PK/unique indexes.

## S4B-03 — Replay and integrity verification

The test suite resets only its guarded, known, empty disposable test schema; it refuses unexpected tables or pre-existing business rows. It applies the 34 historical migrations, captures the baseline, upgrades through the two additions, repeats upgrade as a no-op, rolls back both additions to the exact baseline catalog, and upgrades again to the identical expanded catalog. The separate development cluster independently reaches the same schema. Schema catalogs agree between development and test.

Coverage includes:

- Expected table set/head and revision tracking; every specified added/widened column's type, nullability, default and identity; declared constraint/index existence and FK parent/column targets.
- Foreign-key rejection of nonexistent actors, cross-tenant branches and same-branch cross-job links; parent deletion restrictions; case-sensitive scoped uniqueness.
- Check constraints, unconstrained decimal preservation, raw zero provenance with a separate nullable resolved link, ordinary numeric zero preservation, and BLOCKED disposition requiring review metadata.
- Immutable source payload/hash/key custody and append-only snapshots; rejection of STAGED assets for READY snapshots; protection against retiring an asset supporting an immutable READY snapshot.
- Atomic transaction rollback; simultaneous record creation with one duplicate-key rejection and unique identity values; no promise of gapless identities or approved printed-document numbering.
- Enabled/forced RLS on all 32 added tables, missing-context denial, scoped reads and cross-tenant write denial using the restricted role.
- Environment rejection cases; populated-table downgrade refusal without changing head or losing the synthetic record.

Final execution: **27 passed, zero failed, 24.89 seconds**, with results in [test evidence](stage4b-test-results.md). Both clusters are at `20261021_0035`; catalogs agree on 106 tables, 1,259 columns, 460 FKs, 110 unique constraints, 106 primary keys, 227 CHECKs and 443 indexes. All synthetic records are rolled back or removed in the dedicated test database, and suite teardown verifies zero business records. No existing browser tests or frontend unit tests were run. Their historical failures are not reclassified by these backend results. No new visual capture was performed; frontend protection is hash-based, not a claim of new browser acceptance.

## S4B-04 — Failures encountered and disposition

| Finding | Resolution | Final limitation |
|---|---|---|
| First additive attempt duplicated a template-version CHECK name | Removed redundant new declaration; generator rejects duplicate names; transaction rolled back | No historical migration changed |
| Rollback catalog check caught integer odometer restored as numeric plus a retained numeric CHECK cast | Corrected original-type restoration and exact CHECK restoration in new guarded downgrade | Narrowing is permitted only when affected tables are empty |
| Two provenance tests treated literal JSON `:0` as a SQLAlchemy parameter | Bound JSON as an explicit parameter in new tests | Test construction issue, not source-data corruption |
| Redundant parent scoped unique definitions identified during review | Reused ten existing parent keys | No duplicate table definitions remain |

The original baseline/merge revisions contain no-op downgrades; other historical downgrade functions exist but have **not** been certified reversible. The tested rollback boundary is the two new revisions back to `20261018_0033`, with empty affected tables. Full historical rollback, populated-data restore, old-checkout upgrade and production rollout remain unverified.

## S4B-05 — Changed files and reproduction

All implementation additions are under `backend/schema-validation/`: `.gitignore`, `prepare.py`, `compose.yaml`, `run.py`, `build_schema.py`, `schema-contract.json`, `README.md`, `tests/__init__.py`, `tests/test_schema.py`, and six files in `versions/` (two Python revisions and four SQL artifacts). Local `.local.env` and `artifacts/` are ignored generated files. No frontend, existing application backend, historical migration, dependency lock or deployment configuration was modified. Graft's ignored local context cache was refreshed.

Documentation additions: this report, document 35, preflight/lineage/schema/runtime/test/protection evidence; README index updated. Exact commands, guarded rollback and shutdown are in [the operator README](../../backend/schema-validation/README.md).

## S4B-06 — Stage 4C decision

**Demo import is not ready.** Resolve the 26 deferred mandatory compatibility fields, native actor/artifact/paise mappings, source status/date/identity policies, historical financial treatment, and source/browser custody decisions first. Do not interpret the table count as complete import acceptance. Zero-sentinel schema support preserves evidence but does not approve or perform any source-row transformation. See [35](35-SCHEMA-DIFFERENCES-AND-IMPORT-GATES.md) for exact blocked portions.

Stage 4B stops here for review. A next package should close the listed schema/mapping decisions and run a non-importing preflight before separately authorizing any Stage 4C demo import.

Evidence: [preflight](stage4b-preflight.json.md), [final protected hashes](stage4b-final-protection.json.md), [isolated runtime verification](stage4b-runtime-verification.json.md), [test execution](stage4b-test-results.md).
