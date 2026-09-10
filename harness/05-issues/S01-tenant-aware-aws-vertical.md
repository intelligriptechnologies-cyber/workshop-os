# S01 — Tenant-aware AWS vertical

Status: Approved  
Implements: R-001, R-015, R-016, R-105, R-106, R-108, R-112

## Outcome
Ship a local/test-to-AWS vertical through PWA, `/api/v1`, PostgreSQL RLS, private objects, outbox/worker, and tenant-safe observability.

## Acceptance criteria
- [ ] Two seeded tenants can use the vertical while API, database, object, queue, cache, export, and log probes deny cross-tenant/unauthorized-branch access.
- [ ] Client tenant IDs cannot override authenticated membership and platform endpoints reject tenant credentials.
- [ ] One committed command produces an idempotent worker effect with correlated tenant-safe logs and audit reference.

