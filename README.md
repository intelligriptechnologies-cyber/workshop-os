# WorkshopOS

WorkshopOS currently contains two local surfaces:

- The existing React PWA demonstrates the complete role-based workshop journey with browser-local `sql.js` data.
- The production foundation exposes a real PostgreSQL-backed `/api/v1` vertical with forced tenant/branch row-level security, idempotency, audit, and outbox persistence.

## Run locally with Docker

Prerequisite: Docker Desktop with the Linux engine running.

```powershell
npm install
npm run local:up
npm run local:test
```

Open [http://localhost:4173](http://localhost:4173). The same container serves:

- PWA: `http://localhost:4173/`
- Database health: `http://localhost:4173/health`
- Local API: `http://localhost:4173/api/v1`
- PostgreSQL: `localhost:5432`

The migration runner applies all files in `production/db/migrations` in filename order, records SHA-256 checksums in `public.schema_migrations`, rejects changed applied migrations, and grants runtime access to a non-superuser, non-`BYPASSRLS` role.

Useful commands:

```powershell
npm run local:logs       # follow API/migration logs
npm run local:test       # real DB/API isolation smoke test
npm run test:production  # deterministic production contract suite
npm run test:e2e         # browser journey tests
npm run local:down       # stop containers; preserve DB volume
```

To intentionally delete all local PostgreSQL data and rerun from an empty database:

```powershell
docker compose down -v
npm run local:up
```

The Compose passwords and demo identity header are development-only credentials. They must not be reused outside this local stack.

## Local API example

```powershell
$headers = @{
  "x-workshopos-identity" = "north-reception"
  "idempotency-key" = "intake-001"
  "content-type" = "application/json"
}
$body = '{"branchId":"00000000-0000-4000-8000-000000000011","summary":"Inspect incoming vehicle"}'
Invoke-RestMethod -Method Post -Uri http://localhost:4173/api/v1/work-items -Headers $headers -Body $body
```

The API derives the tenant from the local authenticated-membership fixture; a client-supplied tenant ID is ignored. The current PWA still uses its browser-local demo database for its rich screens. Connecting every journey screen to the PostgreSQL APIs remains application-runtime work; the local DB vertical proves the foundation rather than claiming that conversion is already complete.

## Current PWA management and search

The browser-local PWA now includes an Admin **Manage** hub for users, customers, vehicles, visits/jobs, estimates, tasks/QC, inventory/materials, and billing/delivery. Admin creation uses the same lifecycle operations as the role desks, including the atomic Reception intake path; records are archived or financially voided instead of hard-deleted.

Shared Jobs, Customers, Vehicles, and Media list pages provide search, filters, grid/table views, result ranges, and responsive pagination. The global Search screen supports entity category and job-status filters, a result count, Clear, and an explicit no-results state.

The rich screens and their new management/search features still persist only in browser-local `sql.js`. They are not evidence that the PWA has been migrated to PostgreSQL.

UI programme details and verification evidence are recorded in `UI_ENHANCEMENT_PLAN_v1.0.0.md` and `UI_ENHANCEMENT_CHECKLIST_v1.0.0.md`.
