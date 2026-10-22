# Stage 4B disposable schema validation

This is a migration harness, not an API deployment or demo importer. It preserves the Stage 4A services and uses two additional private PostgreSQL clusters in Compose project `workshopos-stage4b`. No port is published, neither cluster joins an existing application network, and development/test credentials and volumes are separate. Local generated credentials are ignored and excluded from runner mounts.

Prerequisite: the Stage 4A `workshopos-stage4a-api:50c8aab` image built using [foundation instructions](../foundation/README.md). Before any connection, the runner verifies all 63 candidate source files against the image's manifest and pinned backend SHA. It permits only `schema-dev/stage4b_dev/stage4b_dev_owner` or the equivalent test tuple, port 5432, psycopg driver, no URL query overrides and environment `stage4b`. Do not substitute other credentials, URLs or networks.

From the repository root:

```powershell
python backend/schema-validation/prepare.py
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml config --quiet
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm migrate-dev
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm migrate-test
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml stop
```

`migrate-dev` upgrades to the reviewed head, writes a schema-only catalog and leaves business tables empty. `migrate-test` verifies the test database identity, refuses unknown tables or pre-existing business records, recreates only its disposable test schema, replays all migrations, tests repeatability and the supported rollback, runs synthetic integrity/concurrency tests, and verifies no synthetic records remain. Test artifacts are under ignored `artifacts/`. Never point this suite at an application database. `stop` preserves volumes; `down` removes project containers/networks without deleting volumes. No automatic volume deletion is provided.

To exercise the supported empty-data rollback only:

```powershell
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm migrate-dev python /schema/run.py rollback-addition
docker compose --env-file backend/schema-validation/.local.env -f backend/schema-validation/compose.yaml run --rm migrate-dev
```

The new chain is `20261018_0033 -> 20261021_0034 -> 20261021_0035`. Revision 0034 adds the preservation schema; 0035 adds nine same-job reference constraints. The original 34 migrations are loaded unchanged from the candidate image through Alembic `version_locations`. No historical revision is rewritten or stamped. Downgrade of the new revisions refuses populated affected tables before any contraction. Full historical downgrade is not certified; new test-schema recreation is not evidence of historical reversibility. No old-checkout lineage bridge is attempted.

`build_schema.py` is an offline authoring tool that generates frozen `0034_expand.sql`, `0034_contract.sql` and `schema-contract.json` from Stage 3 manifests. It never opens SQLite or connects to PostgreSQL. Migration execution reads only these frozen files, not repository documentation. Do not regenerate/rewrite an already adopted revision; future changes require new revisions. The current SQL is additive apart from lossless numeric widening; it performs no data conversion or import.

The 106-table total consists of 74 candidate tables (including Alembic), 26 source business tables and six documented support tables. It is **not complete demo-import readiness**. Twenty-six mandatory compatibility columns and other native identity, financial, date and status transformations remain gated; see [Stage 4B results](../../docs/backend-migration/34-STAGE4B-SCHEMA-VALIDATION.md) and [differences/import gates](../../docs/backend-migration/35-SCHEMA-DIFFERENCES-AND-IMPORT-GATES.md). Existing business services and frontend have not been integrated with the new schema.

Owner credentials are used only by these disposable migration/test processes because historical migrations create/grant the restricted `workshopos_runtime` role. Tests explicitly switch to that non-login role for RLS checks. This is not permission to run an application as the migration owner. No real tenant, user, credential or source record is provisioned.
