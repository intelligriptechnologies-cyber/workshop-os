# WorkshopOS isolated staging stack

This Compose project is intentionally separate from other applications on the
shared VM. Caddy remains the only public owner of ports 80 and 443. It connects
to `frontend:80` through the pre-existing external `workshopos-staging-proxy`
network.

At this stage the app runs fully standalone: in-browser SQLite and a
client-side demo login, no FastAPI/PostgreSQL backend, no Cognito, and no
deployment secrets beyond the existing SSH credentials. The `api`/`db` stack
described in `staging.api.env.example` / `staging.db.env.example` is not part
of this Compose file; those templates are kept for when a real backend is
reintroduced.

## One-time operator setup

The operator must create the external proxy network (if it is not already
present) and create the protected GitHub **Environment** named `staging`,
restricted to the `Prem-dev-fbb` branch, holding `HETZNER_HOST`,
`HETZNER_USER`, `HETZNER_DEPLOY_KEY`, and `HETZNER_KNOWN_HOSTS`.

```sh
docker network inspect workshopos-staging-proxy >/dev/null
```

## Validate and deploy

Run from the repository root on the target host:

```sh
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging config --quiet
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging up -d --build --remove-orphans
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging ps
```

The GitHub deploy workflow runs these commands automatically on push to
`Prem-dev-fbb`.

## Required deployment verification

After a deployment, verify that Caddy owns public ingress and that only the
frontend is attached to the proxy network:

```sh
docker compose -f deploy/compose.staging.yaml --project-name workshopos-staging ps
docker network inspect workshopos-staging-proxy
curl -fsS https://workshopos-staging.nexiohyper.com/health
```
