# WorkshopOS local API foundation

The frontend remains a separate Vite application. This directory provides the API and PostgreSQL runtime.

## Start

From the repository root, run `docker compose up --build`. The API is available only on `http://127.0.0.1:8000`; PostgreSQL is available only on `127.0.0.1:5432`. `GET /health` and `GET /api/v1/health` report ready only after PostgreSQL accepts a query.

## Migrations and integration test

The API container applies Alembic migrations before it starts. To run the migration and PostgreSQL-backed API smoke test explicitly:

```sh
docker compose exec api alembic upgrade head
docker compose exec api pytest -m integration
```
