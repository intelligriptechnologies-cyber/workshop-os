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

For Cognito-backed production authentication and global User Management, also set:

- `IDENTITY_MODE=cognito`
- `AWS_REGION=<user-pool-region>`
- `COGNITO_USER_POOL_ID=<pool-id>`
- `COGNITO_APP_CLIENT_ID=<public-app-client-id>`
- `COGNITO_DOMAIN=https://<prefix>.auth.<region>.amazoncognito.com`
- `COGNITO_CALLBACK_URL=https://workshopos-prem-dev.up.railway.app/`
- `COGNITO_LOGOUT_URL=https://workshopos-prem-dev.up.railway.app/`
- AWS runtime credentials with only `cognito-idp:AdminCreateUser`, `AdminGetUser`, and `AdminDisableUser` on this pool (prefer a Railway workload identity when available).

The browser receives only the public pool domain and app-client ID. Never add AWS access keys, the database URL, or a Cognito app-client secret to a `VITE_` variable. Configure the app client without a secret and with authorization-code/PKCE flow. The pool must define `custom:tenant_id` as immutable, readable by the app client, and not writable by it. Disable self-registration and ensure the invitation template contains both `{username}` and `{####}`.

Before enabling Cognito mode, create/invite the first Business Owner/Admin in Cognito and link its `sub` to an active PostgreSQL membership. Assign at least one `membership_role` whose role template grants `membership.manage`, and populate `membership_branch` for every branch the Admin may manage. PostgreSQL membership and RLS remain authoritative; `custom:tenant_id` is only a defense-in-depth check during invitation recovery.

Roll out with `IDENTITY_MODE=local` in a temporary environment first, apply migration `029_global_user_management.sql`, link the first Admin, and then switch that environment to `IDENTITY_MODE=cognito`. Validate invitation, first-password change, cross-browser visibility, edit, resend, and archive before switching the production environment.

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
$accessToken = "<Cognito access token>"
Invoke-RestMethod https://workshopos-prem-dev.up.railway.app/api/v1/session -Headers @{Authorization="Bearer $accessToken"}
```

To inspect the environment and services:

```powershell
railway status
railway service list --json
railway variable list --service WorkshopOS --environment Prem-Dev --json
```

## Important notes

- `Prem-Dev` was created by duplicating the existing `production` environment, then a dedicated Railway Postgres service was added.
- Rich workshop modules remain browser-local in this phase. Authentication and User Management are PostgreSQL/Cognito-backed; migrate the remaining modules incrementally.
- Do not expose or commit Railway-generated database passwords. Use Railway variable references and the private `postgres.railway.internal` hostname.
