# WorkshopOS isolated staging stack

This Compose project is intentionally separate from other applications on the
shared VM. Caddy remains the only public owner of ports 80 and 443. It connects
to `frontend:80` through the pre-existing external
`workshopos-staging-proxy` network. The FastAPI and PostgreSQL containers have
no `ports` entries and are reachable only on `workshopos-staging-private`.
That private Docker network intentionally retains outbound access so FastAPI can
validate Cognito tokens and fetch JWKS; it does not create public host ports.

## One-time operator setup

The operator must create the external proxy network (if it is not already
present) and two root-readable secret files **outside this repository**:

```sh
docker network inspect workshopos-staging-proxy >/dev/null
install -d -m 700 /opt/workshop/staging/secrets
install -m 600 deploy/staging.api.env.example /opt/workshop/staging/secrets/workshopos-api.env
install -m 600 deploy/staging.db.env.example /opt/workshop/staging/secrets/workshopos-db.env
editor /opt/workshop/staging/secrets/workshopos-api.env
editor /opt/workshop/staging/secrets/workshopos-db.env
```

Replace every `REPLACE_WITH_*` value. `POSTGRES_PASSWORD` and the password in
`WORKSHOPOS_DATABASE_URL` must be identical. Use a Cognito app client without a
client secret and configure its callback/logout URLs exactly as in the file.
`WORKSHOPOS_ENVIRONMENT=staging`, `WORKSHOPOS_AUTH_MODE=cognito`, and
`WORKSHOPOS_ALLOW_DEMO_AUTH=false` are forced by Compose and cannot be weakened
by this file.

## Validate and deploy

Run from the repository root on the target host:

```sh
WORKSHOPOS_STAGING_API_ENV_FILE=/opt/workshop/staging/secrets/workshopos-api.env \
WORKSHOPOS_STAGING_DB_ENV_FILE=/opt/workshop/staging/secrets/workshopos-db.env \
  docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging config --quiet
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging up -d --build
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging ps
```

The first API startup applies Alembic migrations before it becomes healthy. Do
not use `down -v`: `workshopos-staging-postgres-data` is the persistent staging
database volume. The GitHub deploy workflow uses this same Compose definition;
the secured file must already exist on the host.

## Required deployment verification

After an authorized deployment, verify that Caddy owns public ingress and that
only the frontend is attached to the proxy network:

```sh
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging ps
docker network inspect workshopos-staging-proxy
curl -fsS https://workshopos-staging.nexiohyper.com/health
```

The authorized VM operator must separately validate the Caddy route, DNS/TLS,
Cognito login, migrations, and that no WorkshopOS API/PostgreSQL host ports are
published. This repository configuration does not authorize or perform those
external actions.
