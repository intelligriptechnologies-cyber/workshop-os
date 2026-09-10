# S03 — Versioned tenant configuration and masters

Status: Complete
Implements: R-011, R-012, R-013, R-014, R-019, R-020

## Outcome
Provide tenant master CRUD/publication with stable lifecycle semantics, exact units/money, immutable effective versions, snapshots, and fiscal sequences.

## Acceptance criteria
- [x] Draft masters can change; a used published version cannot, and a replacement has explicit effective dates.
- [x] Activating scope snapshots price, tax, workflow, recipe, checklist, and policy so later publication does not alter it.
- [x] Concurrent sequence allocation yields unique non-reused numbers per tenant/branch/type/financial year and exact minor-unit/fixed-decimal results.

## Evidence

- `production/src/versioned-configuration.ts` supplies the authenticated, tenant/branch-scoped local `/api/v1` contract for master CRUD, optimistic draft edits, ordered effective publication, immutable activation snapshots, fixed-decimal rational conversions, and idempotent fiscal number allocation.
- `production/db/migrations/003_versioned_configuration.sql` forces RLS on every S03 table, blocks published-version and snapshot mutation, validates minor-unit values and exact numeric conversion ratios, and allocates each scoped sequence with an atomic upsert.
- `production/tests/versioned-configuration.test.ts` covers non-retroactivity, all required snapshot classes, stale-write rejection, lifecycle stability, tenant/branch isolation, values beyond floating-point precision, fractional UOM conversion, 64 concurrent allocations, safe replay, scope independence, and the PostgreSQL contract.
- Production tests and typecheck, harness verification, demo build, and Playwright regression passed locally on 2026-09-10. No AWS/provider call, deployment, or GitHub push was performed.
