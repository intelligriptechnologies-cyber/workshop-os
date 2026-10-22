# 39 ? PostgreSQL import rehearsal results

Executed 2026-10-21 under the explicit disposable-import authorization. **The real PostgreSQL rehearsal completed; business migration is incomplete.** No frontend integration or deployment occurred.

## Exact accounting

| Outcome | Source records |
|---|---:|
| Source | 3,241 |
| Successfully promoted business records | 12 |
| Quarantined records | 3,229 |
| Failed/unaccounted records | 0 |
| Duplicate source identities | 0 |
| Reconciled | 12 + 3,229 = 3,241 |

Business tables populated: `workshop_user_profiles` (10), `advisor_attendance` (2). User profiles are not provisioned authentication users. Two additional disposable tenant/branch scope rows are metadata, excluded from the source totals. All 3,241 source rows also have complete provenance/custody records, including the 12 promoted rows; do not count that provenance as additional migrated business records. The prior 53 repeated non-key payload observations are retained distinct records, not duplicate identities to discard.

## Implementation and migration

Added `backend/import-rehearsal/`:

- `versions/20261021_0036_import_compatibility.py`: all 26 documented compatibility columns, strictly NOT NULL with no invented defaults; isolated custody schema and two tables.
- `importer.py`: pinned read-only SQLite input, lossless typed custody, deterministic projections, constrained promotion, ID mapping, source relationships, dependency retries, quarantine reasons, transaction/advisory locking, identity sequence synchronization and verified idempotent replay.
- `run.py`: guarded migration replay, rehearsal, report exports and tests.
- `test_rehearsal.py`: 24 passing tests, including parametrized API reads.
- `compose.yaml`, `prepare.py`, `.gitignore`, `README.md`: internal disposable network, separate new volume, generated ignored credentials, reproducible operation and shutdown.

No original migration was rewritten. Lineage is the original 34 revisions plus 0034, 0035 and new 0036: **37 revisions, one head `20261021_0036`**. Public tables remain 106; `import_custody.runs` and `import_custody.records` add two isolated custody tables. All original named constraints remain byte-for-byte identical in PostgreSQL definitions. Compatibility migration refuses occupied affected tables, rather than backfilling invented values. Current native writers may require later compatibility-field support; this is not an occupied-deployment migration approval.

The verified project is `workshopos-import-rehearsal-verified`, database `stage4c_rehearsal`. It was freshly created with its own volume/network. The runner uses the pinned Stage 4A image, verifies candidate file hashes, and rejects other host/database/user/environment tuples before connection. Network is internal, published PostgreSQL ports are empty. Production, staging and existing application databases were not contacted.

## Execution and tests

[Operator commands](../../backend/import-rehearsal/README.md). Final invocation:

```powershell
docker compose -p workshopos-import-rehearsal-verified --env-file backend/import-rehearsal/.local.env -f backend/import-rehearsal/compose.yaml run --rm runner
```

Clean migration replay, empty 0036 downgrade to 0035/re-upgrade, repeated head upgrade, first real import and repeated import succeeded. The final test suite: **24 passed, 0 failed, 0 errors, 0 skipped**. A dependency emits one Starlette/AnyIO deprecation warning; it does not affect results. Existing frontend/browser tests were not run.

Tests cover all 26 columns/types/required/default behavior, table count/head, original constraint preservation, complete lossless custody, idempotency, source-hash rejection, environment rejection, exact financial history, all source relationships, enforced FK/unique failures inside rollback transactions, rollback integrity, custody access restrictions, six isolated API reads, promoted relationship integrity, validated foreign keys, business-drift detection, all 61 zero sentinels and synchronized identity sequence state.

Two initial execution issues were fixed before the verified fresh run: planner mount depth prevented an import-module load; explicit original IDs required PostgreSQL `OVERRIDING SYSTEM VALUE` for GENERATED ALWAYS identities. The latter attempt rolled back the entire data transaction. Neither represents a lost source record. The first development rehearsal project is separate from the final verified fresh project; its results are not added to the 3,241-record totals.

## Preservation and API results

All source fields are stored as type-tagged JSON in owner-only isolated custody. SQLite REAL values use `float.hex()` and round-trip exactly; integers are exact decimal strings, text is unchanged, NULL remains NULL, blobs use base64. Verification compares every stored field against the immutable source, not only counts. Complete custody includes original development credentials, but no custody payload is exposed by APIs or exported reports, and no password is imported into business authentication. PUBLIC has no custody access.

The 52 invoices, 105 invoice lines and 27 payments are **quarantined**, not promoted financial business records. All original financial fields and allocations remain exact, and reconciliation still finds the same 51 subtotal discrepancies. Reconciliation calculates a comparison only; no stored subtotal, tax, total, status or payment allocation is changed. All 61 zero occurrences remain original zeros in custody; no blanket conversion occurred.

| Isolated PostgreSQL API query | HTTP status | Business records returned |
|---|---:|---:|
| customers | 200 | 0 |
| vehicles | 200 | 0 |
| job_cards | 200 | 0 |
| invoices | 200 | 0 |
| workshop_user_profiles | 200 | 10 |
| advisor_attendance | 200 | 2 |

These are test-only in-process FastAPI queries against the real PostgreSQL tables and explicit tenant/branch, with database identity asserted. No SQLite reads serve these endpoints. Custody never substitutes for business records. Positive customer/vehicle/job/invoice application reads remain **BLOCKED**, since their records could not be promoted without fabricating required actors/artifacts or weakening constraints. Existing production application endpoints/authentication were not integrated or certified by this fixture.

Promoted attendance links resolve to promoted profiles under the same tenant/branch. Original customer/vehicle/job/invoice relationships are preserved in custody but are not claimed as final business FK relationships.

## Remaining blockers

- Required creator/updater/approval UUID actors lack evidence-backed historical identities.
- Native document, receipt and financial-line prerequisites lack complete source mappings; no artifacts or allocations fabricated.
- Source unknown timestamps, free-text promised dates and nullable values conflict with native types/requirements.
- Parent quarantine blocks dependent records; each record retains its actual reason. All records were evaluated, and projections with complete inputs were attempted against the real constraints with rollback savepoints.
- Compatibility columns now exist, but they alone cannot resolve the native prerequisites. Runtime native writers and positive module API reads need later work.
- Browser-only records remain unknown and untouched.

No constraints were weakened to increase the promotion count. Recommendation: use the per-record ledger to resolve the next narrow historical mapping policy, then run a new disposable rehearsal. Do not treat this result as production or full business-data migration readiness.

## Evidence and protection

- [Reconciliation/counts/reasons by table](stage4c-rehearsal-reconciliation.json.md)
- [Every source record: disposition, target identity and reasons](stage4c-rehearsal-record-ledger.json.md)
- [Financial comparison reconstructed from PostgreSQL custody](stage4c-rehearsal-financial-preservation.json.md)
- [API results](stage4c-rehearsal-api-reads.json.md), [JUnit results](stage4c-rehearsal-tests.xml.md)
- [Preflight](stage4c-rehearsal-preflight.json.md), [final protection and network checks](stage4c-rehearsal-protection.json.md)

All 115 protected files, 94 screenshots, eight SQLite copies and 34 historical migration files match baseline hashes. Active frontend commit remains `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`; the only tracked diff is pre-existing AGENTS.md. No approved frontend files or workflows were changed. Runtime visual behavior was not retested. No dependency installation, commit, push or deployment occurred. Referenced `docs/agents/issue-tracker.md` and `docs/agents/domain.md` are absent; root AGENTS.md, Graft and migration evidence were used.
