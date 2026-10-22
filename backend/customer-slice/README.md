# Local authentication and Customers slice

This is the isolated Stage 6 slice, not a production deployment. It reuses the Stage 4A candidate image/password hashing and the verified import rehearsal. Authentication, Customers, Vehicles, Reception intake and core Jobs operations now use PostgreSQL. See `../../docs/backend-migration/42-VEHICLES-RECEPTION-JOBS-SLICE.md` for current scope, verification and blocked boundaries. The original Customers-only verification below remains historical evidence.

## Run

From repository root, with Docker running and the existing rehearsal container/image available:

```powershell
python backend/customer-slice/prepare.py
$env:WORKSHOPOS_SLICE='dev'
npx vite --host localhost
```

Open https://localhost:18443/login. The generated localhost certificate is self-signed; use a dedicated development browser profile. Existing dropdown credentials and manual credentials use the same server login. Admin: Manage > Customers. Reception: Customers.

For isolated browser tests, start another Vite terminal with `WORKSHOPOS_SLICE='test'` (https://localhost:18444). Never point tests at the development database. PostgreSQL has no published port. API ports are loopback 18284/18285; secure cookies require the HTTPS frontend proxy.

`prepare.py` only restores empty named databases. It reads the previous rehearsal using pg_dump, verifies the source SQLite hash, applies Alembic 0038/0039 and provisions original fixture accounts with salted hashes. Credentials, certificates, dumps, browser profiles and artifacts are ignored. Keep the generated files private. Eight-hour absolute expiry is a configurable local test setting, not a finalized production policy.

## Verification

```powershell
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml exec -T api-test python /slice/test_api.py
node backend/customer-slice/test_browser.mjs
node backend/customer-slice/test_roles.mjs
python backend/customer-slice/verify_preservation.py
npx tsc --noEmit
```

Visual verification uses the existing approved baseline build served read-only at http://127.0.0.1:18445:

```powershell
python -m http.server 18445 --bind 127.0.0.1 --directory .scratch/restoration-reference-build
node backend/customer-slice/test_visual.mjs
python backend/customer-slice/compare_visual.py
```

Comparison requires Pillow; browser checks use the existing Playwright dependency. Tests create records only in slice-test, retain audit history, and archive completed test customers. Failed-run test records may remain in that disposable database. Development keeps all 121 imported customers unchanged.

## Boundary

No browser token storage or silent business-data fallback. Memory-only PostgreSQL projections support existing linked views. New snapshots use `workshopos.sqlite.operations-api.v1` and omit integrated rows; prior storage keys and original SQLite files are retained. Receive Vehicle now uses an atomic backend transaction. Unintegrated linked writes fail closed, including booking check-in and financial/media workflows. Local user edits do not update server accounts.

Migrations preserve import custody, identity, financial values and all other imported historical rows. Customer edits are versioned and audited; archive is supported, hard delete is not. Membership version changes invalidate sessions. Runtime uses limited auth grants and a separate non-owner RLS business role.

Production packaging/readiness, finalized lifetime policy, remaining 67 quarantined historical records and unrelated modules remain outside this slice. Do not deploy this local fixture environment.
