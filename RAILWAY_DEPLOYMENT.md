# Railway deployment notes

## Current deployment

- Project: `WorkshopOS`
- Environment: `Prem-Dev`
- App service: `WorkshopOS`
- Database service: `Postgres`
- Branch deployed: `prem-dev`
- App URL: https://workshopos-prem-dev.up.railway.app

## Runtime shape

The app service is the full stack: `npm start` runs `npm run local:container`, which applies PostgreSQL migrations and starts the Node API/static frontend server. The Railway Postgres service supplies the database.

The app service variables are:

- `DATABASE_ADMIN_URL=${{Postgres.DATABASE_URL}}`
- `DATABASE_URL=postgresql://workshopos_app:workshopos_app_local@postgres.railway.internal:5432/railway`
- `HOST=0.0.0.0`

The migration intentionally does not grant `CONNECT` on a hard-coded database name; Railway's Postgres template uses `railway` while local Compose uses `workshopos`.

The migration creates the restricted `workshopos_app` role and grants the runtime permissions. `DATABASE_ADMIN_URL` must remain the Postgres admin connection for migrations; `DATABASE_URL` must remain the app-role connection for runtime row-level-security behavior.

## Repeat deployment

From the repository root, with Railway CLI authenticated and the project linked:

```powershell
railway environment link Prem-Dev
railway up --service WorkshopOS --environment Prem-Dev --detach
railway service status --service WorkshopOS --environment Prem-Dev --json
railway logs --service WorkshopOS --environment Prem-Dev --lines 100
```

Verify the deployment:

```powershell
Invoke-RestMethod https://workshopos-prem-dev.up.railway.app/health
Invoke-RestMethod https://workshopos-prem-dev.up.railway.app/api/v1/session -Headers @{"x-workshopos-identity"="north-reception"}
```

To inspect the environment and services:

```powershell
railway status
railway service list --json
railway variable list --service WorkshopOS --environment Prem-Dev --json
```

## Important notes

- `Prem-Dev` was created by duplicating the existing `production` environment, then a dedicated Railway Postgres service was added.
- The frontend still contains its browser-local demo database for rich screens; the deployed backend/API is the PostgreSQL-backed production vertical documented in `README.md`.
- Do not expose or commit Railway-generated database passwords. Use Railway variable references and the private `postgres.railway.internal` hostname.
