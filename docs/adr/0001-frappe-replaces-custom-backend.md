# Frappe replaces the custom Postgres/Node production backend

WorkshopOS had a `production/` foundation underway: a PostgreSQL-backed Node `/api/v1` with tenant/branch row-level security, idempotency, audit, and outbox persistence, using Cognito auth — but only login/user-management were wired to it, with the rest of the app still running on browser-local `sql.js`. We decided to retire this track entirely rather than keep it running alongside a new backend, and adopt Frappe (forked from the existing hyperflow_forge app) as the one real backend going forward. Reason: hyperflow_forge already implements most of this domain (job-card state machine, approval gating, parts/stock flow, QC, TAT tracking) in a working, tested Frappe app, so building a second bespoke backend in parallel would duplicate months of already-solved plumbing for no benefit — Frappe absorbs auth, persistence, and the API surface that `production/` was reinventing piece by piece.

## Consequences

- The Cognito auth path, `aws-jwt-verify` token verification, and the outbox/idempotency machinery in `production/` are deleted, not migrated — Frappe's own session and permission systems replace them.
- `RAILWAY_DEPLOYMENT.md` and the Postgres-specific deployment instructions in `README.md` become stale once `production/` is removed and need rewriting for the Frappe-backed deployment.
