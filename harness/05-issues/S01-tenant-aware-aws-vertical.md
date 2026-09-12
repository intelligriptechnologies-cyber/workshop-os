# S01 — Tenant-aware AWS vertical

Status: Complete
Implements: R-001, R-015, R-016, R-105, R-106, R-108, R-112

## Outcome
Ship a local/test-to-AWS vertical through PWA, `/api/v1`, PostgreSQL RLS, private objects, outbox/worker, and tenant-safe observability.

## Acceptance criteria
- [x] Two seeded tenants can use the vertical while API, database, object, queue, cache, export, and log probes deny cross-tenant/unauthorized-branch access.
- [x] Client tenant IDs cannot override authenticated membership and platform endpoints reject tenant credentials.
- [x] One committed command produces an idempotent worker effect with correlated tenant-safe logs and audit reference.

## Implementation evidence

- RED: `npm run test:production` failed because `production/src/local-production-vertical.ts` did not exist; later tracer-bullet cycles failed on non-idempotent retries, absent isolation probes, platform access returning 404 instead of an explicit denial, and the missing same-tenant/other-branch identity.
- GREEN: `npm run test:production` passes 6/6 integration and deployment-contract tests through the PWA adapter and versioned API surface.
- Static safety: `npm run test:production:typecheck` passes. PostgreSQL migration `001_tenant_vertical.sql` forces RLS on tenant tables and scopes branch rows; the AWS SAM template declares a private bucket and durable queue/DLQ without performing a deployment.
- Regression: `npm run test:harness`, `npm run build`, and `npm run test:e2e` pass.
- Local runtime follow-up: `compose.yaml`, `Dockerfile.local`, and `production/local/*` now run PostgreSQL 17 plus the built PWA/API. A clean database applies all 28 ordered checksum-tracked migrations; `npm run local:test` exercises a committed work-item/audit/outbox transaction, idempotent replay, client tenant spoof resistance, and database-enforced cross-tenant/cross-branch denial through the non-owner `workshopos_app` role.
- Real migration execution found and corrected S10's `text` tenant/branch columns being compared directly with UUID RLS helpers in `010_action_inbox_notifications.sql`.
- External state: no AWS resources or providers were contacted. AWS account, networking, database secret, Cognito integration, and authorized Mumbai deployment remain later external prerequisites; S02 owns production identity/provisioning.
