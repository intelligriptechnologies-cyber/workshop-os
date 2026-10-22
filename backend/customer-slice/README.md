# Local authentication and Customers slice

This is the isolated Stage 6 slice, not a production deployment. It reuses the Stage 4A candidate image/password hashing and the verified import rehearsal. Authentication, Customers, Vehicles, Reception intake and core Jobs, Estimates, material Approvals and job documents/media now use PostgreSQL. See `../../docs/backend-migration/44-PURCHASES-INVENTORY-STOCK-SLICE.md` for current scope, verification and blocked boundaries. The original Customers-only verification below remains historical evidence.

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

No browser token storage or silent business-data fallback. Memory-only PostgreSQL projections support existing linked views. New snapshots use `workshopos.sqlite.stock-api.v1` and omit integrated rows; prior storage keys and original SQLite files are retained. Receive Vehicle now uses an atomic backend transaction. Unintegrated linked writes fail closed, including booking check-in, financial writes and task editing. Local user edits do not update server accounts.

Migrations preserve import custody, identity, financial values and all other imported historical rows. Customer edits are versioned and audited; archive is supported, hard delete is not. Membership version changes invalidate sessions. Runtime uses limited auth grants and a separate non-owner RLS business role.

Production packaging/readiness, finalized lifetime policy, remaining 67 quarantined historical records and unrelated modules remain outside this slice. Do not deploy this local fixture environment.


## Estimates / approvals / documents batch

Current Alembic head: `20261022_0046` (purchase/stock precision). For existing slice volumes, apply migrations without restoring data:

```powershell
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml run --rm setup python /slice/migrate_slice.py test
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml run --rm setup python /slice/migrate_slice.py dev
```

Do not use development data for destructive acceptance tests. With the isolated test frontend running, feature verification commands are:

```powershell
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml exec -T api-test python /slice/test_estimate_documents.py
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml exec -T api-test python /slice/test_material_approvals.py
node backend/customer-slice/test_estimate_browser.mjs
node backend/customer-slice/test_approval_browser.mjs
node backend/customer-slice/test_document_restart.mjs
node backend/customer-slice/test_estimate_storage.mjs
python backend/customer-slice/verify_estimate_preservation.py
```

Approval tests consume eligible disposable historical requests, so repeated runs require remaining eligible test fixtures. No automatic reset is performed. Restart verification restarts only the test API. New business media bytes live in PostgreSQL with scoped authenticated retrieval; historical missing media retains its metadata and unavailable state. Native browser snapshots do not become authoritative. See report 43 for full results, exact calculation/visual evidence and known failures.


## Purchases / inventory / stock verification

Existing supplier, PO, receipt, stock and material commands are mounted under `/api/v1/stock/command`. Scoped PostgreSQL projections include historical stock through the immutable compatibility bridge; do not use a native-ledger-only SUM as the total balance. Receipt scans are durable authenticated PostgreSQL files. See report 44 for retained quarantine and dormant-form limits.

```powershell
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml exec -T api-test python /slice/test_purchase_stock.py
docker compose --env-file backend/customer-slice/.local.env -f backend/customer-slice/compose.yaml exec -T api-test python /slice/test_purchase_stock_edges.py
node backend/customer-slice/test_stock_browser.mjs
node backend/customer-slice/test_stock_job_browser.mjs
node backend/customer-slice/test_stock_storage.mjs
node backend/customer-slice/test_stock_visual.mjs
python backend/customer-slice/compare_stock_visual.py
python backend/customer-slice/verify_stock_preservation.py
```

Mutating suites use only the disposable test database. Visual comparison uses preserved development records and the read-only approved build on port 18445. Existing records, volumes, browser source keys and backup dumps are retained. No commit or deployment is part of this batch.
