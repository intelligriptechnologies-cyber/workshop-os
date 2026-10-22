
# AGENTS.md — Project Development Rules

## 1. Project Context

This application has an existing frontend that has been reviewed and approved by the client.

The approved application includes:
- UI/UX design, layouts, styling, and navigation
- Dashboard, pages, tabs, forms, and dialogs
- Add/Edit/View/Delete interactions
- Buttons, checkboxes, dropdowns, and action menus
- Business workflows, validations, and calculations
- Role-specific screens and functionality
- Existing demonstration data

The application currently uses SQLite and/or browser-based persistence.

The next development objective is to implement a backend with PostgreSQL as the authoritative database.

**THIS IS A BACKEND MIGRATION, NOT A FRONTEND REDESIGN.**

The existing application is the reference implementation for expected functionality.

---

## 2. Non-Negotiable Frontend Freeze

The existing client-approved frontend is FROZEN.

Unless explicitly authorized by the user, agents MUST NOT:

- Redesign or restyle existing pages
- Change colors, fonts, spacing, positioning, or layouts
- Modify existing forms or field arrangements
- Change labels, buttons, icons, or action menus
- Replace existing modals, drawers, or dialogs
- Change navigation or routing behavior
- Create alternative frontend pages
- Introduce new UI component libraries
- Simplify or remove approved functionality
- Modify business workflow sequences
- Change existing validations or calculations
- Replace working frontend components unnecessarily

### Permitted Changes

Minimal frontend integration changes are permitted when required to:

- Replace SQLite access with backend API calls
- Connect existing forms to backend endpoints
- Load PostgreSQL-backed data through APIs
- Persist existing operations through the backend
- Handle authentication and authorization
- Handle asynchronous loading and errors

These changes MUST preserve the existing visual appearance, controls, and approved functional behavior.

If an unavoidable UI change is identified, STOP and request explicit approval before implementing it.

---

## 3. Requirements Are the Source of Truth

Before implementing backend functionality, read the approved requirements documentation under:

`docs/backend-migration/`

The documentation should describe:

- Every page and screen
- Every form and interactive control
- Every business workflow
- Every user role and permission
- Every business rule and validation
- Every existing data entity
- Every Add/Edit/View/Delete operation
- Existing demo data and relationships
- Current persistence mechanisms
- Expected backend behavior

Do not invent undocumented functionality.

If the documentation is missing, incomplete, or contradictory, inspect the existing application and report the gap.

Do not silently reinterpret requirements.

The approved frontend behavior and confirmed requirements together define the migration acceptance criteria.

---

## 4. Mandatory Repository Analysis

Before modifying code:

1. Read the relevant requirements.
2. Consult the Graft repository context graph.
3. Identify affected modules and source files.
4. Trace existing workflows and dependencies.
5. Identify relevant business rules.
6. Identify existing tests.
7. Assess potential UI regression risks.
8. Define the smallest safe implementation scope.

Prefer modifying existing data-access and service layers over rewriting frontend components.

Avoid unrelated refactoring.

Do not replace working functionality merely because an alternative implementation appears cleaner.

---

## 5. Backend Architecture Principles

The backend must support the existing frontend rather than forcing a redesign of the frontend.

Required principles:

- PostgreSQL is the authoritative business database.
- Frontend business data must be accessed through backend APIs.
- Server-side validation must protect data integrity.
- Authorization must be enforced on the server.
- Business logic must be centralized and testable.
- Database changes must use versioned migrations.
- Related operations must use appropriate transactions.
- API contracts must preserve existing frontend behavior.
- Existing calculations, status transitions, and numbering rules must remain consistent.
- Backend errors must be handled safely without exposing secrets.

Prefer a dedicated API/data-access adapter layer between frontend components and backend services.

Do not introduce unnecessary frameworks or architectural complexity.

Do not introduce new frontend pages to compensate for incomplete backend functionality.

---

## 6. PostgreSQL and Demo Data Preservation

The current demonstration dataset is a required migration asset.

All existing demo data must be inventoried before migration.

Inspect relevant sources, including:

- SQLite databases
- IndexedDB
- localStorage
- sessionStorage
- Hardcoded frontend fixtures
- Seed files
- Existing master data
- Other browser-persisted business records

For each dataset, identify:

- Source location
- Entity/table
- Fields and data types
- Primary and foreign keys
- Record counts
- Relationships
- Default values
- Business constraints
- Identifier and numbering behavior

### Migration Requirements

- Preserve existing records and relationships.
- Preserve identifiers where feasible.
- Document required identifier transformations.
- Preserve meaningful dates, amounts, statuses, and calculations.
- Use repeatable, idempotent import/seed processes.
- Prevent duplicate imports.
- Verify record counts and referential integrity.
- Distinguish demo data from real user-created data.
- Never overwrite production data with demo fixtures.
- Never delete original data before successful verification.

Demo records must ultimately be loaded from PostgreSQL through the backend API.

---

## 7. Browser Storage and SQLite Retirement

The final application must not depend on SQLite or persistent browser storage as the authoritative source for business records.

Business records such as customers, jobs, invoices, purchases, inventory, and related transactions must be stored in PostgreSQL.

Browser storage may still be used for appropriate purposes such as:

- Temporary UI state
- Non-sensitive user preferences
- Safe performance caching
- Static asset caching

Do not indiscriminately remove all browser caching.

### Retirement Conditions

SQLite and browser-based business persistence may only be removed after:

1. PostgreSQL schema is implemented.
2. Existing data is migrated and reconciled.
3. Backend APIs are implemented.
4. Frontend integration is completed.
5. Relevant workflows pass regression tests.
6. Cross-session persistence is verified.
7. A recoverable backup and rollback plan exists.
8. Explicit approval is obtained.

Do not remove the original persistence mechanism prematurely.

---

## 8. Authentication, Roles, and Security

Preserve existing approved role-specific workflows.

Backend implementation must enforce:

- Authentication
- Role-based authorization
- Record-level access where required
- Server-side input validation
- Secure password handling where applicable
- Appropriate session/token management
- Secure API access
- Protection against unauthorized data modification
- Audit logging where required

Never rely solely on frontend controls for authorization.

Never commit passwords, tokens, database credentials, or other secrets.

Use environment-based configuration and approved secret-management mechanisms.

Do not introduce demo authentication or authentication bypasses into production.

---

## 9. Mandatory Development Stages

Backend migration must proceed in controlled stages.

### Stage 1 — Application Discovery

Document all existing pages, workflows, controls, roles, business rules, and data.

Documentation only.

### Stage 2 — Approved UI Baseline

Identify the approved Git revision.

Establish regression tests and visual baselines.

Do not modify approved UI behavior.

### Stage 3 — Backend Architecture

Design PostgreSQL schema, API contracts, authentication, authorization, and data migration.

Architecture approval required before implementation.

### Stage 4 — Backend Implementation

Implement database migrations, backend services, business rules, and APIs.

Prefer backend-only changes wherever possible.

### Stage 5 — Demo Data Migration

Import existing approved demo data into PostgreSQL.

Verify records, relationships, and data integrity.

### Stage 6 — Controlled Frontend Integration

Connect existing frontend components to backend APIs.

Do not redesign pages or replace forms.

Integrate one module at a time.

### Stage 7 — Local Persistence Retirement

Remove obsolete SQLite/browser business persistence only after successful verification and approval.

### Stage 8 — Final Regression and Deployment

Verify UI, workflows, data persistence, security, and deployment readiness.

**Do not advance to the next major stage without explicit user approval.**

---

## 10. Module-by-Module Implementation

Do not rewrite or integrate the entire application in one operation.

For each module:

1. Review approved requirements.
2. Identify existing frontend behavior.
3. Identify relevant data entities.
4. Implement required backend operations.
5. Write backend tests.
6. Integrate the existing frontend.
7. Verify Add/Edit/View/Delete operations.
8. Verify validations and calculations.
9. Verify role-specific behavior.
10. Compare UI against the approved baseline.
11. Report results and remaining gaps.

Proceed to another module only after the current module meets its acceptance criteria.

---

## 11. UI Regression Protection

Every backend-related change must be checked for unintended frontend effects.

Verify:

- Page layouts and styling
- Existing form structure
- Labels and field ordering
- Buttons and actions
- Modal and drawer behavior
- Navigation
- Search, sorting, and filtering
- Business validations
- Calculations
- Status transitions
- Role-based visibility and permissions
- Print/export behavior where applicable

Use automated tests and screenshot comparisons wherever practical.

Do not automatically update screenshot baselines to accept changed UI.

Do not modify existing tests merely to make a failing implementation pass.

A successful build does not prove that existing workflows are preserved.

---

## 12. Change Scope and Approval

Before substantial implementation, provide:

- Task objective
- Requirements covered
- Files expected to change
- Backend changes required
- Frontend integration changes required
- Database changes required
- Potential regression risks
- Verification plan

Do not make unrelated improvements.

Do not redesign approved features.

Do not silently expand task scope.

If a requested change conflicts with the UI freeze or approved requirements, explain the conflict and request approval.

Approval for one exception does not authorize unrelated changes.

---

## 13. Git and Data Safety

Before major migration operations:

- Confirm the active branch.
- Identify the approved frontend baseline revision.
- Inspect working-tree status.
- Preserve existing uncommitted changes.
- Avoid destructive Git commands.
- Do not reset, clean, force-push, or delete branches without approval.
- Do not overwrite existing databases.
- Do not run destructive migrations without an approved backup and rollback plan.
- Do not commit or push unless authorized.

Never discard user changes to simplify implementation.

---

## 14. Testing and Acceptance Criteria

A backend module is complete only when:

- Required API operations work.
- PostgreSQL persistence is verified.
- Existing business rules are preserved.
- Existing validations work.
- Role permissions are enforced.
- Relevant automated tests pass.
- Existing frontend interactions remain functional.
- Approved visual behavior is preserved.
- Errors are handled appropriately.
- No unexplained data loss occurs.

Where relevant, verify that records created in one browser session are available in another authorized session.

Report unverified functionality explicitly.

Never claim complete regression coverage without supporting evidence.

---

## 15. Mandatory Completion Report

After each development task, report:

1. Task completed
2. Requirements implemented
3. Files changed
4. Backend changes
5. Frontend files modified and reasons
6. Database/schema changes
7. Demo data impact
8. Tests executed
9. Test results
10. UI regression status
11. Remaining issues or risks
12. Recommended next action

Explicitly state whether any approved UI or workflow behavior changed.

If no UI verification was performed, state that the UI remains unverified rather than claiming it is unchanged.

---

## 16. Agent Operating Principle

**PRESERVE THE APPROVED APPLICATION. CHANGE THE DATA SOURCE AND BACKEND, NOT THE USER EXPERIENCE.**

When choosing between a broad rewrite and a narrow integration, prefer the narrow integration.

When uncertain about an existing workflow, inspect and document it before changing it.

When a change risks altering approved UI behavior, stop and request approval.

The primary success criterion is a PostgreSQL-backed application that behaves and looks like the client-approved frontend.

---

<!-- graft:start -->
## Graft — repo context graph

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `graft map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `graft ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `graft grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `graft skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `graft callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `graft/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `graft ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `graft build` (deterministic,
no API key, $0).
<!-- graft:end -->
