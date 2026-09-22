# WorkshopOS Hetzner Staging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the current WorkshopOS browser-local React PWA to Hetzner staging and automatically refresh it on every push to `Prem-dev-fbb`, with manual app-only start and stop controls.

**Architecture:** Build the Vite PWA in a multi-stage Docker image and serve it from an internal Nginx container named `workshopos-frontend`. The existing Barstock Caddy container remains the sole public TLS proxy and reaches that container through a persistent external Docker network. GitHub Actions deploys, starts, or stops only the `workshopos-staging` Compose project.

**Tech Stack:** React 19, Vite 7, Node 24, Nginx Alpine, Docker Compose, Caddy 2, GitHub Actions, Ubuntu, Hetzner Cloud.

**Spec:** `docs/superpowers/specs/2026-09-22-workshopos-hetzner-staging-design.md`

## Global Constraints

- Deploy only the current PWA; do not add PostgreSQL, `/api/v1`, Cognito configuration, Railway, or Vercel.
- The deployment hostname is `workshopos-staging.nexiohyper.com` and the deploy branch is `Prem-dev-fbb`.
- Only the existing Caddy proxy may bind host ports 80 and 443.
- The app Compose project must be named `workshopos-staging`; start and stop must never affect Caddy, Barstock, or the Hetzner server.
- Keep real secrets out of Git. The GitHub deployment workflow uses `HETZNER_HOST`, `HETZNER_USER`, and `HETZNER_DEPLOY_KEY` repository secrets.
- Preserve the existing dirty worktree changes; stage only files created for this plan when committing.

---

## File Structure

| Path | Responsibility |
|---|---|
| `deploy/Dockerfile.staging` | Multi-stage production PWA build and static Nginx image. |
| `deploy/nginx.staging.conf` | SPA fallback, PWA asset serving, and internal HTTP listener. |
| `deploy/compose.staging.yaml` | Isolated `workshopos-staging` frontend service joined to the external proxy network. |
| `.github/workflows/deploy-staging.yml` | Push-triggered and manual deployment workflow. |
| `.github/workflows/start-staging.yml` | Manual app-only start workflow. |
| `.github/workflows/stop-staging.yml` | Manual app-only stop workflow. |
| `/opt/barstock/deploy/compose.production.yaml` | Existing Caddy service's persistent attachment to `workshopos-staging-proxy`. |
| `/opt/barstock/deploy/Caddyfile.production` | New HTTPS route to `workshopos-frontend:80`. |

### Task 1: Add the static PWA container

**Files:**
- Create: `deploy/Dockerfile.staging`
- Create: `deploy/nginx.staging.conf`
- Test: Docker image build and HTTP SPA fallback on the local Docker daemon

**Interfaces:**
- Consumes: `package.json` `build` script and Vite output at `dist/`.
- Produces: Image exposing internal TCP port `80`, with all client routes returning `index.html`.

- [ ] **Step 1: Write the Nginx configuration.**

Create `deploy/nginx.staging.conf` with this exact server block:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location = /sw.js {
        add_header Cache-Control "no-cache";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- [ ] **Step 2: Create the failing build check.**

Run:

```powershell
docker build -f deploy/Dockerfile.staging -t workshopos-staging:local .
```

Expected: it fails because `deploy/Dockerfile.staging` does not yet exist.

- [ ] **Step 3: Create the multi-stage Dockerfile.**

Create `deploy/Dockerfile.staging`:

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/nginx.staging.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

- [ ] **Step 4: Build and verify the container.**

Run:

```powershell
docker build -f deploy/Dockerfile.staging -t workshopos-staging:local .
docker run --rm -d --name workshopos-staging-smoke -p 127.0.0.1:18080:80 workshopos-staging:local
Invoke-WebRequest http://127.0.0.1:18080/ -UseBasicParsing
Invoke-WebRequest http://127.0.0.1:18080/nonexistent-client-route -UseBasicParsing
docker rm -f workshopos-staging-smoke
```

Expected: both HTTP requests return 200 and the route response contains the PWA HTML shell.

- [ ] **Step 5: Commit the container assets.**

```powershell
git add deploy/Dockerfile.staging deploy/nginx.staging.conf
git commit -m "feat: add WorkshopOS staging frontend image"
```

### Task 2: Define the isolated staging Compose project

**Files:**
- Create: `deploy/compose.staging.yaml`
- Test: `docker compose config`

**Interfaces:**
- Consumes: `deploy/Dockerfile.staging` and the pre-created external Docker network `workshopos-staging-proxy`.
- Produces: Service `frontend` with alias `workshopos-frontend` and no host-port mapping.

- [ ] **Step 1: Write the failing Compose validation.**

Run:

```powershell
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml config
```

Expected: it fails because `deploy/compose.staging.yaml` does not yet exist.

- [ ] **Step 2: Create the Compose file.**

Create `deploy/compose.staging.yaml`:

```yaml
name: workshopos-staging

services:
  frontend:
    build:
      context: ..
      dockerfile: deploy/Dockerfile.staging
    restart: unless-stopped
    networks:
      proxy:
        aliases: [workshopos-frontend]

networks:
  proxy:
    name: workshopos-staging-proxy
    external: true
```

- [ ] **Step 3: Validate the rendered Compose configuration.**

Run:

```powershell
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml config
```

Expected: Compose renders one frontend service, no `ports:` key, and external network name `workshopos-staging-proxy`. The external network is created on Hetzner in Task 3, not on the local workstation.

- [ ] **Step 4: Commit the Compose definition.**

```powershell
git add deploy/compose.staging.yaml
git commit -m "feat: add WorkshopOS staging Compose project"
```

### Task 3: Attach existing Caddy and route the staging hostname

**Files:**
- Modify on Hetzner: `/opt/barstock/deploy/compose.production.yaml`
- Modify on Hetzner: `/opt/barstock/deploy/Caddyfile.production`
- Test: Caddy validation, network attachment, and HTTPS response

**Interfaces:**
- Consumes: existing `barstock-production-proxy-1` Caddy service and `workshopos-staging-proxy` network.
- Produces: TLS traffic for `workshopos-staging.nexiohyper.com` forwarding to `workshopos-frontend:80`.

- [ ] **Step 1: Back up the two Barstock proxy files on the server.**

From the administrator SSH session:

```bash
cp /opt/barstock/deploy/compose.production.yaml /opt/barstock/deploy/compose.production.yaml.bak.$(date +%Y%m%d%H%M%S)
cp /opt/barstock/deploy/Caddyfile.production /opt/barstock/deploy/Caddyfile.production.bak.$(date +%Y%m%d%H%M%S)
```

- [ ] **Step 2: Create the shared external network.**

```bash
docker network inspect workshopos-staging-proxy >/dev/null 2>&1 || docker network create workshopos-staging-proxy
```

- [ ] **Step 3: Make Caddy's network membership persistent.**

In `/opt/barstock/deploy/compose.production.yaml`, add this top-level block:

```yaml
networks:
  workshopos-staging-proxy:
    external: true
```

Under the existing `proxy` service, add:

```yaml
    networks:
      - default
      - workshopos-staging-proxy
```

Do not modify `db`, `backend`, `frontend`, volumes, environment values, or port mappings.

- [ ] **Step 4: Add the WorkshopOS Caddy site block.**

Append to `/opt/barstock/deploy/Caddyfile.production`:

```caddy
workshopos-staging.nexiohyper.com {
    reverse_proxy workshopos-frontend:80
}
```

- [ ] **Step 5: Recreate only the Caddy proxy and validate it.**

```bash
cd /opt/barstock
docker compose --env-file .env.production -f deploy/compose.production.yaml up -d proxy
docker exec barstock-production-proxy-1 caddy validate --config /etc/caddy/Caddyfile
docker network inspect workshopos-staging-proxy --format '{{range .Containers}}{{println .Name}}{{end}}'
```

Expected: Caddy validation succeeds and `barstock-production-proxy-1` appears on the external network. Verify that `barstock-production-db-1` and `barstock-production-backend-1` remain running with `docker ps`.

### Task 4: Add automatic deploy and manual app lifecycle workflows

**Files:**
- Create: `.github/workflows/deploy-staging.yml`
- Create: `.github/workflows/start-staging.yml`
- Create: `.github/workflows/stop-staging.yml`
- Test: GitHub Actions syntax inspection and a manual workflow run

**Interfaces:**
- Consumes: GitHub secrets `HETZNER_HOST`, `HETZNER_USER`, `HETZNER_DEPLOY_KEY`; server checkout at `/opt/workshop/staging/source`; Compose file from Task 2.
- Produces: Deployment on each `Prem-dev-fbb` push, and app-only manual start/stop operations.

- [ ] **Step 1: Add the deployment workflow trigger and concurrency policy.**

At the top of `deploy-staging.yml`, use:

```yaml
name: Deploy WorkshopOS staging

on:
  push:
    branches: [Prem-dev-fbb]
  workflow_dispatch:

concurrency:
  group: workshopos-staging
  cancel-in-progress: false
```

- [ ] **Step 2: Implement the deploy job.**

Use `actions/checkout@v4`, run `npm ci` then `npm run build`, write
`HETZNER_DEPLOY_KEY` to `~/.ssh/workshopos_deploy` with mode 600, add the
server host key with `ssh-keyscan -H`, and execute this exact remote payload:

```bash
ssh -i ~/.ssh/workshopos_deploy \
  -o IdentitiesOnly=yes \
  -o StrictHostKeyChecking=yes \
  "$HETZNER_USER@$HETZNER_HOST" \
  "GITHUB_SHA='${{ github.sha }}' bash -s" <<'REMOTE'
set -euo pipefail
cd /opt/workshop/staging/source
git fetch origin Prem-dev-fbb
git checkout --detach "$GITHUB_SHA"
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml up -d --build
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml ps
REMOTE
```

Use `StrictHostKeyChecking=yes` after populating `~/.ssh/known_hosts`. The
workflow checks out the commit supplied by GitHub rather than interpolating
branch text into the remote shell.

- [ ] **Step 3: Add manual start and stop workflows.**

Both files use `on: workflow_dispatch`, the same concurrency group, key setup,
and host verification as the deploy workflow. Their remote commands are:

```bash
# start-staging.yml
cd /opt/workshop/staging/source
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml start
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml ps

# stop-staging.yml
cd /opt/workshop/staging/source
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml stop
docker compose --project-name workshopos-staging -f deploy/compose.staging.yaml ps
```

- [ ] **Step 4: Validate the workflow files before push.**

Run:

```powershell
git diff --check
gh workflow list --repo intelligriptechnologies-cyber/workshop-os
```

Expected: no whitespace errors. After the workflow files are pushed, the three
workflow names appear in the Actions list.

- [ ] **Step 5: Commit the workflow files.**

```powershell
git add .github/workflows/deploy-staging.yml .github/workflows/start-staging.yml .github/workflows/stop-staging.yml
git commit -m "ci: deploy WorkshopOS staging from Prem-dev-fbb"
```

### Task 5: Bootstrap the staging checkout and verify public deployment

**Files:**
- Create on Hetzner: `/opt/workshop/staging/source/` checked out from `https://github.com/intelligriptechnologies-cyber/workshop-os.git`
- Test: GitHub Actions deploy run, HTTPS PWA request, direct client route request, and app-only stop/start

**Interfaces:**
- Consumes: generated Compose assets, Caddy route, GitHub workflow secrets, and the `Prem-dev-fbb` branch.
- Produces: reachable staging PWA and validated operator controls.

- [ ] **Step 1: Bootstrap the server checkout.**

On the Hetzner server:

```bash
mkdir -p /opt/workshop/staging
git clone --branch Prem-dev-fbb https://github.com/intelligriptechnologies-cyber/workshop-os.git /opt/workshop/staging/source
cd /opt/workshop/staging/source
git rev-parse --verify HEAD
```

If the repository is private, clone using a server-side read-only deploy key or a GitHub fine-grained read-only token stored outside the repository; do not place either credential in the URL or GitHub Actions logs.

- [ ] **Step 2: Configure the three GitHub repository secrets.**

From the deployment operator workstation:

```powershell
gh secret set HETZNER_HOST --repo intelligriptechnologies-cyber/workshop-os
gh secret set HETZNER_USER --repo intelligriptechnologies-cyber/workshop-os
gh secret set HETZNER_DEPLOY_KEY --repo intelligriptechnologies-cyber/workshop-os
gh secret list --repo intelligriptechnologies-cyber/workshop-os
```

Enter the values interactively. Never echo or paste the values into a terminal transcript, source file, or chat.

- [ ] **Step 3: Add and verify the DNS record.**

Create an `A` record:

```text
workshopos-staging.nexiohyper.com -> 89.167.40.86
```

Then run:

```powershell
Resolve-DnsName workshopos-staging.nexiohyper.com
```

Expected: the A record resolves to the Hetzner server's public IP.

- [ ] **Step 4: Trigger and observe the first deployment.**

Push the workflow commit to `Prem-dev-fbb`, then run:

```powershell
gh run list --repo intelligriptechnologies-cyber/workshop-os --workflow 'Deploy WorkshopOS staging' --limit 1
gh run watch --repo intelligriptechnologies-cyber/workshop-os
```

Expected: the workflow succeeds and the server reports the `frontend` service as running.

- [ ] **Step 5: Verify public routing and app-only lifecycle controls.**

Run:

```powershell
Invoke-WebRequest https://workshopos-staging.nexiohyper.com -UseBasicParsing
Invoke-WebRequest https://workshopos-staging.nexiohyper.com/a-client-route -UseBasicParsing
gh workflow run 'Stop WorkshopOS staging' --repo intelligriptechnologies-cyber/workshop-os
gh workflow run 'Start WorkshopOS staging' --repo intelligriptechnologies-cyber/workshop-os
```

Expected: the first two responses return 200 and contain the PWA HTML shell; stopping makes only the WorkshopOS staging route unavailable; starting restores it. Confirm `https://stock.nexiohyper.com` still returns 200 after each action.

- [ ] **Step 6: Commit any only-in-repo deployment bootstrap documentation.**

```powershell
git add README.md
git commit -m "docs: document WorkshopOS staging deployment"
```

Do not commit server `.env` files, deployment keys, host-key material, or Caddy's Barstock-owned configuration.
