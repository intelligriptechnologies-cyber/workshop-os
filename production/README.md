# WorkshopOS production vertical

This directory is the production architecture seam. It does not replace or import the browser-local demo.

- `src/local-production-vertical.ts` is the deterministic local/test adapter for PWA → `/api/v1` → tenant store/outbox → worker/private object → safe logs.
- `db/migrations/001_tenant_vertical.sql` is the PostgreSQL contract. A request transaction must set `app.tenant_id` and `app.branch_ids` from verified membership before querying; client tenant fields are never used for session context.
- `infra/template.yaml` declares the private object bucket, durable queue/dead-letter queue, API, and worker boundaries. It is an un-deployed deployment artifact; credentials and an explicitly authorized AWS deployment remain external prerequisites.

Run `npm run test:production` and `npm run test:production:typecheck` from the repository root.
