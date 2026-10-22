# Disposable PostgreSQL import rehearsal

This package extends the pinned Stage 4A backend image and Stage 4B migrations. It is not application startup, frontend integration or a production importer. The current verified result is **3,174 business records and 67 quarantined**, with 36 passing tests. See [report 40](../../docs/backend-migration/40-BUSINESS-IMPORT-UNBLOCKING.md).

From the repository root:

```powershell
python backend/import-rehearsal/prepare.py
docker compose -p workshopos-import-unblock-03 --env-file backend/import-rehearsal/.local.env -f backend/import-rehearsal/compose.yaml run --rm runner
```

The verified project was created fresh. Repeating the same command verifies existing custody and business snapshots without inserting duplicates. A fresh separately named Compose project creates its own empty volume; do not repoint the connection at existing databases. No PostgreSQL port is published and the only network is internal. The runner rejects all other database host/user/name/environment tuples and verifies the original backend image's source hashes before connecting. The SQLite mount is read-only; its pinned SHA-256 is checked before and after reading.

The runner applies 38 revisions through `20261021_0037`; on a fresh database it also tests downgrade to 0035 and re-upgrade before importing. The 26 compatibility columns remain NOT NULL with **no defaults**. Revision 0037 replaces selected native NOT NULL declarations with custody-bound historical exceptions and equivalent native CHECK requirements. All pre-existing named CHECK, unique and foreign-key constraints remain intact. A closed-run guard makes imported history immutable. Approved estimate-line inserts have an exception only during the owner-run, custody-verified import transaction. Upgrade refuses existing custody; this is not an occupied-deployment migration. Downgrade refuses populated affected tables.

The previous `workshopos-import-rehearsal-verified` project and its original 12-record result are retained. Do not run the revised importer against it: policy/schema drift is intentionally refused. For a new policy, choose a fresh project name and preserve existing volumes.

`importer.py` evaluates all 3,241 source rows. It inserts complete type-tagged source payloads and original relationship values into isolated `import_custody.records`, then promotes constraint-compatible projections. `history_policy.py` explicitly enumerates historical exceptions; the migration freezes its own contract. Known source actors reference preserved profiles through scoped historical foreign keys, without creating login accounts. Unknown audit values and offset-free timestamps remain NULL in native fields with raw source evidence retained. Relative promises are preserved verbatim. Missing artifacts and line allocations are unavailable, never fabricated. The two seeded tenant/branch rows are disposable scope metadata, excluded from source business counts. No passwords are copied into business tables.

Custody includes **complete original fields, including original development credentials**. Schema and table access is revoked from PUBLIC; it is available only to the local owner, has no HTTP route and is not exported in reports. Do not grant application roles access or distribute volume snapshots. Reports omit payloads and credentials. JSON type tags preserve SQL NULL, integers as decimal strings, REAL values as hexadecimal IEEE-754 values, text verbatim and blobs as base64. Therefore every original SQLite field can be reconstructed exactly. No financial correction occurs.

Promotion preserves original IDs, using explicit `OVERRIDING SYSTEM VALUE` where necessary. Existing foreign keys determine dependency readiness; retry passes occur only after successful promotions. Constraint rejection becomes a quarantine reason. Unexpected errors abort the entire import transaction, including custody; they are not disguised as successful records. No constraints or triggers are disabled. Original IDs, target IDs and complete source provenance are recorded per row. Identity sequences are synchronized for populated tables.

The import uses a transaction and advisory lock. A completed source hash is unique; retries reject policy drift and verify all original payloads and promoted business snapshots. New policy versions need a fresh disposable rehearsal, not blind overwrites of this run. A failed pre-commit attempt rolls back; sequence gaps are harmless. No automatic post-commit deletion or repair occurs.

Artifacts under ignored `artifacts/` include reconciliation, per-record disposition/reason ledger, financial preservation report, API-read results and JUnit tests. The durable redacted evidence copy and actual results are in [the execution report](../../docs/backend-migration/39-IMPORT-REHEARSAL-RESULTS.md).

The API tests use an isolated in-process FastAPI fixture that selects from PostgreSQL business tables. It exposes no custody payloads and is never mounted into the application. Customer/vehicle/job/invoice reads return **121 / 132 / 145 / 52** IDs. This proves PostgreSQL reads, not application-route/authentication parity. Native services and future frontend adapters must explicitly support historical availability and immutable imported rows before integration.

Stop the verified disposable database without deleting custody:

```powershell
docker compose -p workshopos-import-unblock-03 --env-file backend/import-rehearsal/.local.env -f backend/import-rehearsal/compose.yaml stop
```

Do not use populated-schema downgrade as data rollback. Preserve this evidence until review; any eventual resource deletion must target this explicit disposable project only.
