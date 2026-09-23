# WorkshopOS

WorkshopOS currently contains two local surfaces:

- The existing React PWA demonstrates the complete role-based workshop journey with browser-local `sql.js` data.
- Login and user management are wired to a real Frappe backend (a `workshop_os` app forked from `hyperflow_forge`, running on the same Frappe bench). See `docs/adr/0001-frappe-replaces-custom-backend.md` for why Frappe replaced the earlier custom Postgres/Node backend.

## Run the Frappe backend (WSL2 + Docker Desktop)

Prerequisite: Docker Desktop with WSL2 integration enabled for your Ubuntu distro, and the `hyperflow-forge/frappe_docker` bench already cloned inside WSL (`~/hyperflow-forge/frappe_docker`).

Bring up the bench containers and start the dev webserver scoped to the `workshop_os.localhost` site:

```bash
wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker && docker compose -f docker-compose.dev.yml up -d'

wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker && docker compose -f docker-compose.dev.yml exec -d -e FRAPPE_SITE=workshop_os.localhost frappe bash -lc "cd /workspace/development/frappe-bench && nohup bench start > /tmp/bench-start.log 2>&1 &"'
```

Wait ~10-15s for `bench start` to finish booting, then verify:

```bash
curl -i -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d "usr=Administrator&pwd=<admin password>" http://localhost:8000/api/method/login
```

A `200 OK` with a `Set-Cookie: sid=...` header confirms the site is up and reachable at `http://localhost:8000`.

**Important**: this webserver is a backgrounded process with no supervisor — it does not survive a container restart, `docker compose down`, or a Docker Desktop restart. Re-run the start command above whenever the bench comes back up. The bench's dev server can only serve one site's HTTP traffic at a time (`FRAPPE_SITE` picks it); restarting without that variable falls back to `development.localhost` (`hyperflow_forge`'s own site) instead of `workshop_os.localhost`.

To stop the webserver:

```bash
wsl -d Ubuntu -- bash -lc 'cd ~/hyperflow-forge/frappe_docker && docker compose -f docker-compose.dev.yml exec frappe bash -lc "pkill -f honcho"'
```

## Run the frontend dev server

```powershell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend talks to the Frappe site over `http://localhost:8000` (see `src/auth.ts`'s `frappeFetch`), using cookie-based sessions — the Frappe site's `allow_cors` config must include `http://localhost:5173` (already configured on `workshop_os.localhost`; see Task 1's setup and `docs/adr/0004-session-cookie-auth.md` for why session cookies over Cognito).

`npm run dev` builds against Frappe (`mode: "frappe"`) by default and needs the bench above running. To run the browser-local demo PWA instead (`sql.js` data, no bench required — see "Current PWA management and search" below), build with `VITE_AUTH_MODE=local` set (it's read at build time, not serve time):

```powershell
$env:VITE_AUTH_MODE = "local"
npm run build
npm run preview
```

Other useful commands:

```powershell
npm run build      # typecheck + production build
npm run preview    # serve the built bundle
npm run test:e2e   # Playwright suite (excludes tests/frappe-auth.spec.ts by default — see below)
npm run test:unit  # unit tests
```

To run the real-Frappe auth/role suite against a live bench (all six roles' menus), start the bench per the section above, then:

```powershell
$env:FRAPPE_TEST=1
npx playwright test tests/frappe-auth.spec.ts
```

## Current PWA management and search

The browser-local PWA now includes an Admin **Manage** hub for users, customers, vehicles, visits/jobs, estimates, tasks/QC, inventory/materials, and billing/delivery. Admin creation uses the same lifecycle operations as the role desks, including the atomic Reception intake path; records are archived or financially voided instead of hard-deleted.

Shared Jobs, Customers, Vehicles, and Media list pages provide search, filters, grid/table views, result ranges, and responsive pagination. The global Search screen supports entity category and job-status filters, a result count, Clear, and an explicit no-results state.

The rich screens and their new management/search features still persist only in browser-local `sql.js`. Only login and user management are backed by Frappe today; migrating the remaining modules is incremental application-runtime work.

UI programme details and verification evidence are recorded in `UI_ENHANCEMENT_PLAN_v1.0.0.md` and `UI_ENHANCEMENT_CHECKLIST_v1.0.0.md`.

## Deployment

There is no decided Frappe-backed deployment target yet — the bench above is a local dev environment only. The earlier Railway/Postgres deployment (`RAILWAY_DEPLOYMENT.md`) is retired along with the backend it deployed; see that file's historical note and `docs/adr/0001-frappe-replaces-custom-backend.md`.
