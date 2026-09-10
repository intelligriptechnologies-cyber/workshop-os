# WorkshopOS production vertical

This directory is the production architecture seam. It does not replace or import the browser-local demo.

- `src/local-production-vertical.ts` is the deterministic local/test adapter for PWA → `/api/v1` → tenant store/outbox → worker/private object → safe logs.
- `src/identity-access.ts` is the deterministic Cognito-compatible identity/provisioning adapter used to verify individual membership, branch/granular permission scope, kiosk sessions, MFA/re-authentication, maker-checker, support grants, and audit evidence without contacting Cognito.
- `src/versioned-configuration.ts` exposes the deterministic local `/api/v1` contract for tenant/branch-scoped master drafts, effective publication, immutable active-scope snapshots, exact money/UOM values, and fiscal document allocation.
- `db/migrations/001_tenant_vertical.sql` is the PostgreSQL contract. A request transaction must set `app.tenant_id` and `app.branch_ids` from verified membership before querying; client tenant fields are never used for session context.
- `db/migrations/002_identity_access.sql` adds the tenant-keyed identity and control model, forces RLS, stores only kiosk PIN digests, and expands critical-action audit context.
- `db/migrations/003_versioned_configuration.sql` persists immutable effective master versions and scope snapshots, exact conversion ratios, and atomic tenant/branch/type/financial-year sequences under forced RLS.
- `infra/template.yaml` declares the private object bucket, durable queue/dead-letter queue, API, and worker boundaries. It is an un-deployed deployment artifact; credentials and an explicitly authorized AWS deployment remain external prerequisites.

Run `npm run test:production` and `npm run test:production:typecheck` from the repository root.
