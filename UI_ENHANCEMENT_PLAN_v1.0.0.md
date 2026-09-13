# WorkshopOS UI Enhancement Programme v1.0.0

## Scope and decisions

This programme completes the current React/sql.js PWA user experience. It does not convert the PWA to the production PostgreSQL `/api/v1` runtime.

- Admin is the master role and can perform every business action supported by the current PWA.
- Creation is exposed through contextual `Add` or `Create` actions in each applicable management area and role screen.
- Destructive business records use soft `Archive`; immutable invoices and payments use reasoned `Void` operations.
- Admin overrides are visibly labelled, require a reason where supported, and leave lifecycle history evidence.
- Admin visit/job creation reuses the atomic Reception intake operation.

## Public interfaces

- `SearchCriteria` contains `query`, `category`, and `status`.
- `SearchCategory` supports `all`, `job`, `customer`, `vehicle`, and `invoice`.
- Search results include match metadata suitable for count and category display.
- User persistence exposes create, update, and archive operations with validation.

## Acceptance criteria

1. Admin can create, read, update, and archive users, customers, vehicles, visits/jobs, estimates, tasks/QC, inventory/materials, and billing/delivery records where the current domain supports those actions.
2. Required fields, valid roles, and unique email/mobile/vehicle identifiers produce readable errors.
3. The signed-in Admin cannot archive themself and the final active Admin cannot be archived.
4. Every applicable management tab has a visible contextual creation action on desktop and mobile.
5. Search is trimmed and case-insensitive, supports entity and lifecycle filters, reports the result count, can be cleared, and displays an explicit zero-result state without unrelated details.
6. Filter changes keep a valid selected result, select the first valid result when required, and clear selection when no results remain.
7. Existing role permissions and all seven baseline Playwright journeys remain intact.
8. Changes persist after reload in the browser-local sql.js database.

## Verification gate

Completion requires build, the full Playwright suite, production tests and typecheck, harness verification, and `node scripts/verify-ui-enhancement.mjs` to pass. External deployment and PostgreSQL-backed rich-PWA verification remain outside this programme.

