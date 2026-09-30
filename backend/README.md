# WorkshopOS local API foundation

The React demo remains a separate Vite application. This directory provides the
production-boundary API and PostgreSQL runtime that later vertical slices adopt.

## Start

From the repository root:

```sh
docker compose up --build
```

The API is available only on `http://127.0.0.1:8000`; PostgreSQL is available
only on `127.0.0.1:5432`. Containers communicate over the private Compose
network. `GET /health` and `GET /api/v1/health` report ready only after a
PostgreSQL query succeeds.

## Migrations and integration test

The API container applies Alembic migrations before it starts. To run the
migration and PostgreSQL-backed API smoke test explicitly:

```sh
docker compose exec api alembic upgrade head
docker compose exec api pytest -m integration
```

## Tenant session boundary

`GET /api/v1/auth/config` returns either the browser-safe Cognito settings or
the local-only emulator configuration. `GET /api/v1/session` accepts a Cognito
access token in production and returns the Tenant, role, permission, and Branch
scope resolved by FastAPI from PostgreSQL. The React app already uses this
contract when Cognito mode is configured.

The `x-workshopos-identity` adapter is permitted only when
`WORKSHOPOS_ENVIRONMENT=local`, `WORKSHOPOS_AUTH_MODE=local`, and
`WORKSHOPOS_ALLOW_DEMO_AUTH=true`. It resolves a pre-existing server-side
identity; it cannot provide a Tenant, Branch, role, or permission.

## Initial Superadmin

Set `WORKSHOPOS_SUPERADMIN_BOOTSTRAP_SUBJECTS` to a comma-separated allow-list
of exact Cognito subjects (or local demo subjects) for the initial platform
operator. The first authenticated request from an allow-listed subject creates
its `platform_users` and `superadmins` records transactionally. Remove the
setting after that operator is established; subsequent Superadmin authorization
is database-backed. This is a platform bootstrap control, not Tenant access.

Tenant-owned settings tables use forced PostgreSQL RLS. Protected requests set
a transaction-local Tenant and Branch scope only after membership resolution,
then switch to the non-owner `workshopos_runtime` role. The PostgreSQL
integration tests cover no-context denial, cross-Tenant invisibility, and
cross-Branch invisibility. They require the Docker database and remain deferred
until Docker is available locally.

Stop local services while retaining the development volume with
`docker compose down`. Use `docker compose down --volumes` only when you
intentionally want to discard local database data.
