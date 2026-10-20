# Database login cutover

The staging frontend already proxies `/api/` to FastAPI on the same origin.
`compose.staging.yaml` continues to use Cognito. This overlay is an explicit
cutover choice and does not change an existing deployment on its own.
Database authentication applies to the entire API instance. Before selecting
the overlay, assign codes and password hashes to every existing tenant/user
who must retain login access. Cognito users without hashes cannot use database
login. Keep the original Compose mode if that preparation is incomplete.

Before switching, deploy the code, let Alembic reach `head`, and retain a
database backup. Run these commands on the selected host with its configured
staging environment files. Restrict the backup directory to the operator.

```sh
set -eu
export WORKSHOPOS_STAGING_API_ENV_FILE=/opt/workshop/staging/secrets/workshopos-api.env
export WORKSHOPOS_STAGING_DB_ENV_FILE=/opt/workshop/staging/secrets/workshopos-db.env
install -d -m 700 /opt/workshop/staging/backups
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging up -d --build
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging exec -T db \
  sh -c 'pg_dump -Fc -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
  > /opt/workshop/staging/backups/before-database-auth.dump
chmod 600 /opt/workshop/staging/backups/before-database-auth.dump
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging run --rm --no-deps -T \
  -v "$PWD/public/workshopos-demo.sqlite:/app/public/workshopos-demo.sqlite:ro" api \
  python scripts/import_bundled_demo.py
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging run --rm --no-deps -T \
  -v "$PWD/public/workshopos-demo.sqlite:/app/public/workshopos-demo.sqlite:ro" api \
  python scripts/import_bundled_demo.py --apply
docker compose -f deploy/compose.staging.yaml -f deploy/compose.database-auth.yaml \
  --project-name workshopos-staging up -d --build
```

The importer refuses to merge into an existing `demo` tenant with a different
checksum, and a repeat import of the same bundled file changes nothing. Check
the dry-run relationship errors, archive-only counts, and legacy invoice
discrepancies before applying. Other tenants are never imported into. The
SQLite source is mounted read-only only for these one-off commands; it is not
included in the API image.

The 2026-10-19 rehearsal used source SHA-256
`04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`
in a separate PostgreSQL database. The [reconciliation report](reports/bundled-demo-rehearsal-20261019.json)
checks all 60 source tables, 16 losslessly archived rows, mapped operational
records, representative key fields, stock balances, and relationships. It
passed. The source has 51 legacy invoice subtotal/line discrepancies; review
their immutable imported document snapshots before any production cutover.

The local development database currently contains an older `demo` import with
a different source checksum. The importer deliberately leaves it untouched.
Replacing it needs a tenant-scoped transactional replacement after UI parity
and a fresh backup; do not use a whole-database truncate because other tenants
may exist.

After cutover, verify `/api/v1/auth/config` reports `database`, list the
`demo` users, sign in, create and refresh a lead in two browsers, and verify
logout ends API access. Keep the backup until operational data is reconciled.

To switch authentication back to Cognito, start only the original Compose
file. This changes the API mode without restoring the database. If a database
restore is needed, take a separate backup of post-cutover writes first and
restore the earlier dump during a maintenance window; restoring it discards
those writes.
