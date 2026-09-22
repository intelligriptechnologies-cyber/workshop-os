# WorkshopOS Hetzner Staging Design

## Goal

Deploy the current WorkshopOS React PWA as a staging-only site at
`workshopos-staging.nexiohyper.com` on the existing Hetzner host. The initial
release is a browser-local demo: it deliberately includes neither PostgreSQL
nor the incomplete `/api/v1` backend runtime.

## Scope

Included:

- a production static build of the current Vite/React PWA;
- an isolated Docker Compose project named `workshopos-staging`;
- HTTPS routing through the existing Caddy container;
- automatic staging deployment for every push to `Prem-dev-fbb`;
- manual GitHub Actions controls to start or stop the staging frontend;
- health and browser verification instructions.

Excluded:

- Railway, Vercel, a database container, database volumes, and data migration;
- the PostgreSQL-backed API, Cognito production configuration, and the rich
  screens' browser-local-to-server data migration.

## Existing Host Constraints

The Hetzner server `nexiolabs` already hosts Barstock. Its public Caddy proxy
runs in Docker as `barstock-production-proxy-1`, with ports 80 and 443 bound
on the host. Its configuration is mounted from
`/opt/barstock/deploy/Caddyfile.production`.

WorkshopOS must never bind 80 or 443. It will instead be reachable only from
Caddy on an internal Docker network.

## Architecture

```text
Browser
  -> https://workshopos-staging.nexiohyper.com
  -> existing Caddy container (TLS termination)
  -> workshopos-staging-frontend container (static PWA)
```

Create an external Docker network named `workshopos-staging-proxy`. Attach the
existing Caddy service and the WorkshopOS frontend service to it. The
frontend's Compose service name and network alias will be `workshopos-frontend`.
Caddy will reverse proxy the staging hostname to `workshopos-frontend:80`.

The frontend container is a multi-stage image: Node builds `dist/` with
`npm ci` and `npm run build`; Nginx serves the resulting files. Nginx must
fall back to `index.html` for client-side routes and serve `/sw.js` and other
PWA assets normally. It exposes only port 80 inside Docker.

## Server Layout

```text
/opt/workshop/
  staging/
    source/                 # WorkshopOS checkout
    deploy/                 # Dockerfile, Compose file, Nginx config
    .env                    # non-secret deployment settings, mode 0600
```

No application secrets are required for this demo-only release. The workflow
still uses repository secrets for the server host, SSH user, and deploy key.

## Caddy Change

The existing Caddyfile receives one route:

```caddy
workshopos-staging.nexiohyper.com {
    reverse_proxy workshopos-frontend:80
}
```

The Barstock Compose configuration is updated to declare the external
`workshopos-staging-proxy` network for Caddy, so the attachment persists after
Barstock is recreated. Caddy is reloaded only after validating the edited
configuration; this does not replace Barstock's app or database containers.

## CI/CD and Operational Control

Use three workflows, matching the established Nexio Stock pattern:

- `deploy-staging.yml` runs automatically on every push to `Prem-dev-fbb` and
  can also be started manually. It checks out that exact revision, runs the
  frontend verification and build, SSHes to the server with the deployment
  key, fast-forwards `/opt/workshop/staging/source`, then runs
  `docker compose --project-name workshopos-staging up -d --build`.
- `start-staging.yml` is manual only. It runs `docker compose start` for the
  WorkshopOS staging project without rebuilding it.
- `stop-staging.yml` is manual only. It runs `docker compose stop` for only
  the WorkshopOS staging project. Caddy and every Barstock container remain
  running; requests to the staging hostname receive an upstream-unavailable
  response until the frontend is started again.

All three workflows use the same `HETZNER_HOST`, `HETZNER_USER`, and
`HETZNER_DEPLOY_KEY` repository secrets, enforce SSH host-key verification,
and use the same concurrency group (`workshopos-staging`) so a deploy cannot
race a start or stop operation.

Stopping staging is a runtime control, not a permanent deployment lock: the
next push to `Prem-dev-fbb` will deploy and start it again. To suspend automatic
updates, disable `deploy-staging.yml` in the GitHub Actions UI; re-enable it
when automatic deployment should resume.

## Verification and Rollback

Before DNS cutover, validate through a local SSH tunnel or a temporary host
mapping. After DNS is pointed to the Hetzner server, confirm TLS, the PWA
loads, and a client-side route resolves after a direct page refresh.

For rollback, select `stop` in the manual workflow or check out the last
known-good commit in `/opt/workshop/staging/source`, rebuild, and run the
`deploy` operation. No database rollback is involved because this release
holds no server-side application data.

## Known Limitation

The deployed application remains a browser-local demo. Data is stored per
browser in `sql.js`/local storage and is not shared between users or devices.
Moving to the PostgreSQL-backed API is a later, separately designed release.
