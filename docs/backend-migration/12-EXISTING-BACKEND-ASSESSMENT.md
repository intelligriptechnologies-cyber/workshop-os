# 12 — Existing backend assessment

Audit date: 2026-10-21. **Recommendation: extend the existing backend foundation after reconciling its source/runtime baseline and approved-workflow differences. Do not begin a replacement backend or switch the frontend to alternate remote screens.**

## BACKEND-01 — Two materially different implementations

| Evidence | Checkout | Running local API container |
|---|---|---|
| Identity | Git `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7` plus working tree | `workshopos-api-1`, image `workshopos-api`, image ID `sha256:7ade676243e2681bbb1ba53f463362520f20d0bc6e0e54a4d877031c79ca4cca` |
| HTTP route declarations | 109 | 152 |
| Migration files / head | 19 / `20261006_0017` | 34 / `20261018_0033` |
| Authentication modes | local, cognito | Running environment selects `database`, unsupported by checkout |
| App module comparison | Reference files | 16 differing or additional modules; no source bind mounts |
| PostgreSQL connection | Required `WORKSHOPOS_DATABASE_URL`, PostgreSQL DSN | `postgresql+psycopg`, host `db`, database `workshopos`, user `workshopos_admin`; password excluded |

Read-only PostgreSQL metadata confirms PostgreSQL **17.9**, **74 public base tables** (not a claim of 74 business entities), and applied Alembic version `20261018_0033`. The admin role is superuser/BYPASSRLS; `workshopos_runtime` is neither. Business table contents and request-level tenant isolation were not tested. API and database containers were already healthy, with host bindings `127.0.0.1:8000` and `127.0.0.1:5432`; PostgreSQL uses a named persistent volume.

The 16 divergent modules are `service_catalog.py`, `config.py`, `materials.py`, `inventory.py`, `procurement.py`, `auth.py`, `followups.py`, `checklists.py`, `tenant_admin.py`, `sales_crm.py`, `jobs.py`, `media.py`, `database_auth.py`, `main.py`, `execution.py`, `intake.py`. Some are container-only. `finance.py` matches the checkout, so the financial mismatch findings apply to both inspected source copies.

Evidence: [runtime metadata and hashes](stage15-runtime-metadata.json.md), [migration graphs](stage15-migration-graph.json.md), [checkout AST](stage15-backend-analysis.json.md), [container AST](stage15-runtime-backend.json.md). Route counts describe declarations, not successful runtime endpoint tests. Some Graft cards described newer auth/theme behavior absent from the checkout; exact file extraction takes precedence over graph summaries.

**Decision BACKEND-AUTHORITY-01 requires user approval:** identify the intended maintained source revision for the running image and reconcile the additional migrations before architecture is finalized. Do not rebuild the image, run checkout migrations against this database, or treat the image as disposable. The provenance/approval status of container-only behavior is UNVERIFIED.

## Framework and request architecture

Checkout uses FastAPI 0.115.12, SQLAlchemy 2.0.41 with explicit SQL/text and sessions, psycopg 3.2.9, Pydantic settings 2.9.1, Alembic 1.15.2 and Uvicorn. Settings use the `WORKSHOPOS_` prefix and `.env`. Frontend clients use asynchronous HTTP; the SQL.js commands are predominantly synchronous after asynchronous initialization. HTTP timeout/retry/errors must preserve the existing form and command lifecycle.

`backend/app/auth.py:178–187` provides a request-scoped `session.begin()` transaction. Membership/branch resolution and `apply_rls_context:45–65` set the restricted runtime role plus trusted tenant, actor, branch and read-only context. Handlers use scoped queries and permission checks; superadmin has separate bootstrap/transaction paths. This foundation is reusable but is not proof of deployed security. The database connects as a privileged administrator, making correct role/context application on every business access critical. `backend/app/database.py:10–12` creates engines through the session path without an obvious process-level cache; pooling/lifecycle should be reviewed in later implementation.

Checkout local demo identity headers are allowed only by configured local/demo conditions. Cognito verifies JWT signature/issuer/audience and access-token type. Real provider claim compatibility and deployed login behavior remain UNVERIFIED. Page grants, membership/branch assignments, suspension and support read-only mode exist server-side; frontend role names alone must never confer tenant access. Container database authentication needs its own approved credential/session review after source reconciliation.

## Capability classification

The full method/path/input/guard registry is [109 checkout routes](stage15-endpoints.md). Its 109 declarations are partitioned below. Input model fields and all handler bodies are preserved in [checkout analysis](stage15-backend-analysis.json.md). Classification applies to compatibility with the approved application, not code style.

| Capability / module | Routes | Classification | Assessment and required boundary |
|---|---:|---|---|
| Health, auth configuration/session, tenant/branch settings (`main`) | 7 | REQUIRES MODIFICATION | Health/config framework reusable; checkout auth modes differ from running image. Settings do not establish parity with all session-admin state. |
| Customer/vehicle/visit/intake (`intake`) | 15 | REQUIRES MODIFICATION | CRUD/intake foundation exists; map duplicate detection, booking check-in, identity relationships and approved form validations. |
| Jobs / transitions / estimates (`jobs`) | 8 | REQUIRES MODIFICATION | Job queries and commands exist; actor policy and completion prerequisites differ from local workflow. |
| Task execution / QC (`execution`) | 7 | REQUIRES MODIFICATION | Assignment, task and QC operations exist; prove rework, required checks and technician visibility parity. |
| Invoices, payments, handover, credits/refunds (`finance`) | 11 | REQUIRES MODIFICATION | Locks, immutable snapshots and sequences useful; tax allocation, payment/handover boundaries and HTML output differ. Credit/refund features are not automatically approved frontend scope. |
| Suppliers, purchase orders, inward and adjustments (`inventory`) | 16 | REQUIRES MODIFICATION | Stock ledger foundation reusable; checkout inward posting and PO lifecycle differ from local receipt/confirmation/closure. |
| Material reservations/commands (`materials`) | 5 | REQUIRES MODIFICATION | Reserving only available stock does not reproduce shortage/request/re-request/consumption flows. |
| Leads/quotations (`sales_crm`) | 9 | REQUIRES MODIFICATION | Lead/quotation operations exist; validate status, calculation, template and linked-job semantics. |
| Follow-up/search (`followups`) | 7 | REQUIRES MODIFICATION | Read/write operations and remote client exist; scheduling, calling, booking dependencies and scope need parity checks. |
| Membership/users/roles (`tenant_admin`) | 16 | REQUIRES MODIFICATION | Server-side grants valuable; workshop role/employee/advisor identities and custom local grants need exact mapping. |
| Tenant/support administration (`superadmin`) | 8 | UNVERIFIED | Source exists; developer demo console is not evidence of equivalent live provisioning/billing. Live authorization and end-to-end behavior not exercised. |
| Session-admin templates, company assets and frozen approved document rendering | — | INCOMPLETE | No proven complete replacement for browser settings/snapshots and approved rendered documents. |
| Request transactions, RLS context and migration framework | — | REUSABLE | Retain as foundation subject to baseline reconciliation and isolation tests. This does not certify every handler. |
| Container-only / revised capabilities | 43 additional route declarations | UNVERIFIED | Source-inspected but revision/approval and frontend parity unresolved; see below. |

No entire component is proven **OBSOLETE** or safe to remove. A legacy-looking route is not sufficient evidence for deletion.

The container adds database login/logout and workshop/user selection; bookings/check-in; checklist CRUD; task/work-update/execution/QC routes; purchase requests, supplier quotes/comparison/approval; PO delivery receipt/confirmation; estimated delivery; theme; shortages; media; service catalog/job tasks; and demo-import row inspection. Exact paths and source spans: [152 runtime declarations](stage15-runtime-endpoints.md). Revised same-path behavior must also be reviewed; counting the 43 additional routes alone understates drift. No login, import or business mutation endpoint was called.

## Frontend integration and compatibility

`src/App.ts` RoleWorkspace (around 1536 onward) selects separate remote sales, follow-up/search and finance components under Cognito configuration. Quotation settings remain the local admin report-template section. Admin user/team integrations use `adminUsersApi`; much of role/settings/template state stays in sessionStorage. `jobsApi` supports remote views but does not replace all local operational workflows. Intake, bookings, stock, materials, QC and other paths still depend on SQL.js/browser state in the inspected checkout.

The API clients and their callers are enumerated in [integration evidence](stage15-integration-source.md). Switching authentication mode is therefore not a persistence-only migration: it selects alternate UI components and leaves mixed ownership. Preserve the approved existing components, labels, defaults, validation messages, role visibility and navigation; later integration needs an explicit command/read adapter contract, not automatic adoption of remote workspaces.

Backend UUID tenant/membership identities and operational numeric IDs must be related to local user/advisor/record IDs without changing displayed numbers. Remote error payloads must map to existing errors; network pending/retry states are currently not equivalent to synchronous SQL commands. Do not silently introduce stricter gates or new partial-payment/refund forms.

## Tests and deployment

There are **40 checkout backend test functions**, statically inspected: 26 unit and 14 integration across auth/config, tenancy/admin, finance, intake, inventory, materials and other operations. Exact test names/calls: [test analysis](stage15-backend-tests.json.md). These tests were not run: integration fixtures can mutate a PostgreSQL database and the active schema is ahead of checkout. Their existence is source evidence, not a passing deployment test. A future isolated database test run needs a reconciled revision and approved disposable environment.

Root Docker Compose provisions PostgreSQL 17 and an API whose local Docker startup applies `alembic upgrade head` before Uvicorn. Starting/rebuilding it is not read-only. Checked-in staging Compose/Dockerfile build and serve the frontend with Nginx, with Caddy ingress. Staging Nginx serves a static local/demo auth-config response and has no demonstrated API proxy. The checked-in GitHub staging deployment uses the `Prem-dev-fbb` branch or manual dispatch, Node 20 build and SSH deployment of the frontend Compose configuration. The frontend Docker build uses Node 24. No live remote staging deployment was inspected; repository config does not prove deployed runtime behavior.

## Recommendation

Retain and extend existing transaction, tenancy, migration and API infrastructure. First reconcile checkout/container revision, migrations and authentication ownership; then specify each approved local command's atomic backend equivalent and test parity while retaining the frontend. Known financial and stock divergences make direct reuse of business handlers unsafe without modification. Approval to choose a baseline and future implementation is still pending; no backend changes were made.
