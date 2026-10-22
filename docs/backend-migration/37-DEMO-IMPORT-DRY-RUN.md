# 37 ? Demo import dry run

Stage 4C-1, 2026-10-21. **No import performed. Readiness is BLOCKED.**

## Tooling and reproducibility

New tooling is confined to [backend/import-planner](../../backend/import-planner/README.md): `planner.py`, `probe.py`, `check_constraints.py`, `test_planner.py`, README and a bytecode ignore file. No existing application, schema, migration, frontend or test files were changed. The pre-existing tracked AGENTS.md change remains untouched.

Run from the repository root:

```powershell
python backend/import-planner/planner.py
python backend/import-planner/test_planner.py
```

The linked operator README supplies the exact guarded Docker commands for refreshing target evidence and evaluating CHECK constraints. Always override `migrate-test` with the specified probe/check command; its default command is a different stage's schema test runner. This stage used the isolated Stage 4B test database only, with no public database port, no staging/production URL and no schema changes.

The planner requires the pinned source SHA-256, rejects source journals/WAL files, opens SQLite with `mode=ro&immutable=1` and query-only enabled, and rechecks the file hash after reading. Outputs are limited to this documentation directory. It has no apply mode or PostgreSQL connection capability. The two separate PostgreSQL probes use the existing guarded environment, explicitly read-only transactions, SELECT statements and rollback. CHECK evaluation compares the live schema catalog with the captured catalog and binds its report to the manifest hash.

The manifest is ordered by source table and primary key. Its policy and input-evidence hashes make repeated runs comparable; tests compare two complete plans. Each row contains source identity, redacted source payload, original SQLite REAL hexadecimal values, proposed target values, issues and disposition. Passwords are excluded, not recoverable from this report. The whole-file hash binds the original source; per-row payload hashes cover the redacted payload, not a complete credential-bearing original row.

## Executed validation

| Check | Result | Limits |
|---|---|---|
| Source hash and integrity | PASS; 60 tables / 3,241 records | Pinned shipped candidate only; browser records unknown |
| Complete manifest | 3,241 records | Projections are proposals, not executable inserts |
| Deterministic content candidates | 486 | Still blocked by scope, identity and dependency gates |
| Rows requiring review | 2,755 | Issues overlap; not a count of distinct defects |
| Source relationship scan | 125 relationship definitions; 5,001 non-null references | 4,940 resolve source parents; 61 zero references need explicit disposition |
| Duplicate source keys | 0 | Does not establish semantic uniqueness |
| Repeated non-key payloads | 53 | Review only; no deduplication |
| Target key/unique comparison | 0 conflicts in available projections | Assumes one future tenant/branch; incomplete projections and partial/expression indexes not certified |
| PostgreSQL CHECK evaluation | 4,787 PASS; 5,841 UNVERIFIED_INCOMPLETE_INPUT; 0 observed violations | SELECT evaluation only; not full insert/FK/trigger validation |
| PostgreSQL business rows | 0 before and after | Schema head 20261021_0035; 106 tables |
| Planner unit tests | 12 passing | New planner tests only; previous foundation/schema/browser suites not rerun |
| Historical financial comparison | All 52 invoice snapshots match prior reconciliation; 51 discrepancies retained | No recalculation or payment/status correction |
| Protection | 115 files, 94 screenshots, 8 SQLite copies and 34 historical revisions unchanged | Compared with recorded baseline hashes |

The tests cover source-hash rejection, timestamps without guessed offsets, date-only treatment, zero preservation, UUID non-fabrication, exact decimals and paise conversion, explicit status projections, unchanged financial source rows, deterministic complete manifests, redaction and comparison against the previous 52-invoice baseline.

## Outstanding validation findings

Issue counts are occurrences and overlap within records:

| Issue | Occurrences |
|---|---:|
| `REQUIRED_NULL` | 998 |
| `TARGET_COLUMN_MISSING` | 1474 |
| `UUID_IDENTITY_MAPPING_REQUIRED` | 659 |
| `NATIVE_REQUIRED_VALUE_MISSING` | 3793 |
| `UNRESOLVED_SOURCE_PARENT` | 61 |
| `TIMESTAMP_INTERPRETATION_REQUIRED` | 205 |

`TIMESTAMP_INTERPRETATION_REQUIRED` includes 145 relative promise labels and 60 other target instant mappings; it is not the full date inventory. The latter separately records 153 naive timestamps. Raw fields remaining text do not necessarily require an instant conversion. REQUIRED_NULL and native missing-value findings must not be repaired with arbitrary defaults.

## Evidence

- [Summary and input hashes](stage4c1-dry-run/summary.json.md), [complete manifest](stage4c1-dry-run/manifest.json.md).
- [Compatibility columns](stage4c1-dry-run/compatibility.json.md), [references](stage4c1-dry-run/references.json.md), [all sentinel occurrences](stage4c1-dry-run/sentinels.json.md).
- [Financial reconciliation](stage4c1-dry-run/financial.json.md), [statuses](stage4c1-dry-run/statuses.json.md), [dates](stage4c1-dry-run/dates.json.md), [duplicates](stage4c1-dry-run/duplicates.json.md).
- [Static CHECK checks](stage4c1-dry-run/target_checks.json.md), [unique checks](stage4c1-dry-run/target_unique_checks.json.md), [read-only target catalog/counts](stage4c1-target-readonly.json.md), [PostgreSQL CHECK evaluation](stage4c1-check-evaluation.json.md).
- [Test execution](stage4c1-tests.md), [protection verification](stage4c1-protection.json.md).

No full insert constraint validation, import, sequence update, browser export, schema correction or production connection occurred. No deployment, commit or push was performed. See [38](38-IMPORT-READINESS-GATE.md) before authorizing any subsequent import work.
