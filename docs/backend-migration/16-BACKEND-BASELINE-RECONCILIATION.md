# 16 - Backend baseline reconciliation

Stage 1.6, 2026-10-21. **Recommendation, pending approval:** extend backend source at `prem-dev-fbb-backend`, pinned to `50c8aab1766b61c914e2829b460bfd1697723ec2`, while retaining the approved frontend at `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Do not merge the whole backend branch into the approved UI. No checkout, migration, build, deployment or data mutation was performed.

## Evidence reviewed and precedence

Reviewed the screen/UI/workflow/role/data/integration/freeze/gap/readiness contracts in 01-09, SQLite/browser/backend/transaction/test/risk reports 10-15, the 37-case register and 87-case results in 15A, and their source, endpoint, database and test evidence. Actual source and file hashes take precedence over stale Graft summaries. `CONTEXT.md` is available; the AGENTS-referenced `docs/agents/domain.md` is absent in this checkout. No missing instruction file was invented or recreated.

## REC-01 - Source provenance resolution

The backend is not merely an unexplained container-only implementation. Read-only `git show` comparisons locate its source in the local branch `prem-dev-fbb-backend`; its locally stored remote-tracking ref points to the same commit. No fetch was performed, so remote freshness, team ownership and formal maintenance approval remain UNVERIFIED.

| Candidate | Matching runtime application modules | Assessment |
|---|---:|---|
| Current checkout HEAD a315448 | 5 of 21 | Approved frontend reference, older backend; do not extend blindly over a newer database. |
| prem-dev-fbb-backend / 50c8aab | **21 of 21** | Best evidenced backend foundation; all application module bytes match. |
| preservation/ui-restoration-20261020 / 21af3e1 | 18 of 21 | Earlier preserved work; config, database_auth and main differ. |
| codex/integrate-68-72 / 5bd3749 | 5 of 21 | Not the matching runtime backend. |
| prem-dev-fbb-check-17cdbe9 / 17cdbe9 | 0 of 21 | Not a matching foundation. |

A fresh read-only Docker hash pass examined 95 `.py/.ini/.txt/.toml` files under `/app`, excluding bytecode caches: **94 match the candidate branch**. This includes all 21 app modules and active migration files. The sole differing file is `tests/integration/test_database_email_login.py`. Its parity must be reconciled before claiming reproducible tests. These results do not hash every binary, dependency, environment value or deployed frontend asset. Full hashes: [source provenance](stage16-source-provenance.json.md).

Candidate history records preservation at 21af3e1, database email authentication at e544e91, guarded account reconciliation at 2fe44f8 and a restoration checkpoint at 50c8aab. This identifies a version-controlled lineage, not client approval of its frontend or backend behavior. The safest extension is a future reviewed integration branch/worktree that selects backend infrastructure from the pinned candidate and preserves approved UI files. That operation is proposed, not executed.

## REC-02 - Route and service reconciliation

Checkout has **109** route declarations; candidate/runtime has **152**. Exact method/path comparison finds **43 added, zero removed, 26 common handlers changed and 83 common handlers unchanged**. Handler equality uses normalized AST function bodies; it does not certify equal dependencies, Pydantic models, permissions, migration effects or environment behavior. Full old/new location registry: [route delta](stage16-route-delta.json.md), [checkout routes](stage15-endpoints.md), [runtime routes](stage15-runtime-endpoints.md).

| Area | Current checkout | Candidate/runtime | Reuse recommendation |
|---|---|---|---|
| Framework | FastAPI, SQLAlchemy/psycopg, Alembic, scoped SQL | Same foundation with more domain modules | Reuse framework and transaction/tenancy structure; review engine lifecycle and privileged connection boundary. |
| Auth | local demo / Cognito | Adds database credentials and revocable cookies; configured runtime selects database | Adopt only after ADR-04 auth decision and security tests. |
| Intake/bookings | Intake CRUD | Adds booking list/create/detail/check-in | Useful service coverage; local date-window, duplicate, capacity and actor parity still required. |
| Execution/QC | Earlier task/check APIs | Additional client-facing task commands, work updates, attachments, execution and QC routes | Preserve approved task/rework/status behavior; remote automatic rework task creation is not blanket parity proof. |
| Materials/procurement | Reservation ledger and basic orders | Shortages, requests, quotes/comparison, approval, issue, delivery receipts and confirmations | Extend candidate, with optional-quote, request/status and numbering differences corrected later. |
| Inventory closure | Immediate inward handler; no delivery confirmation lifecycle | Accepted-delivery stock inward on close, lock and replay mechanisms; direct inward path also remains | Candidate is materially closer; do not repeat older-checkout-only findings as if candidate lacked closure. |
| Finance | Paise calculations, snapshots, payments and handover | finance.py is byte-identical | Known discount/payment/document differences remain; not fixed by candidate selection. |
| Media/checklists/service catalog | No equivalent full route families | Adds media, checklist CRUD, service catalog and job tasks | Media ownership/status/content rules differ; review catalog/checklist parity before reuse. |
| Admin/theme/import | Membership/admin endpoints, browser settings elsewhere | Theme endpoints, import-row inspection, import scripts and archive mapping | Import archive is evidence preservation, not necessarily operational UI support. Never run scripts automatically. |

### Every added or directly changed route

Source locations refer to candidate `/app/app/` files, whose bytes match the pinned Git branch. All 83 common unchanged handlers remain listed in the linked delta; they are not omitted from the assessment denominator.

| Change | Method | Path | Candidate source |
|---|---|---|---|
| ADDED | GET | `/api/v1/admin/demo-import/rows` | `backend/app/tenant_admin.py:26` list_demo_import_rows |
| HANDLER_CHANGED | GET | `/api/v1/auth/config` | `backend/app/main.py:103` auth_config |
| ADDED | GET | `/api/v1/auth/tenants/{code}/users` | `backend/app/database_auth.py:93` list_login_users |
| ADDED | GET | `/api/v1/auth/workshops` | `backend/app/database_auth.py:78` list_login_workshops |
| ADDED | GET | `/api/v1/bookings` | `backend/app/intake.py:225` list_bookings |
| ADDED | GET | `/api/v1/bookings/{booking_id}` | `backend/app/intake.py:264` get_booking |
| HANDLER_CHANGED | GET | `/api/v1/catalogue-items` | `backend/app/inventory.py:231` list_catalogue |
| ADDED | GET | `/api/v1/checklists` | `backend/app/checklists.py:70` list_checklists |
| HANDLER_CHANGED | GET | `/api/v1/customers` | `backend/app/intake.py:335` list_customers |
| HANDLER_CHANGED | GET | `/api/v1/follow-ups` | `backend/app/followups.py:90` list_followups |
| HANDLER_CHANGED | GET | `/api/v1/follow-ups/jobs` | `backend/app/followups.py:122` followup_jobs |
| HANDLER_CHANGED | GET | `/api/v1/jobs` | `backend/app/jobs.py:226` list_jobs |
| ADDED | GET | `/api/v1/jobs/{job_id}/execution` | `backend/app/execution.py:300` get_remote_execution |
| HANDLER_CHANGED | GET | `/api/v1/material-ledger` | `backend/app/materials.py:182` list_material_ledger |
| HANDLER_CHANGED | GET | `/api/v1/material-reservations` | `backend/app/materials.py:161` list_reservations |
| ADDED | GET | `/api/v1/media` | `backend/app/media.py:64` list_media |
| HANDLER_CHANGED | GET | `/api/v1/purchase-orders` | `backend/app/inventory.py:308` list_purchase_orders |
| ADDED | GET | `/api/v1/purchase-requests` | `backend/app/procurement.py:78` list_requests |
| ADDED | GET | `/api/v1/purchase-requests/{request_id}` | `backend/app/procurement.py:84` get_request |
| ADDED | GET | `/api/v1/purchase-requests/{request_id}/supplier-comparison` | `backend/app/procurement.py:113` comparison |
| HANDLER_CHANGED | GET | `/api/v1/sales/leads` | `backend/app/sales_crm.py:93` list_leads |
| HANDLER_CHANGED | GET | `/api/v1/sales/quotations` | `backend/app/sales_crm.py:109` list_quotations |
| HANDLER_CHANGED | GET | `/api/v1/search` | `backend/app/followups.py:205` search |
| ADDED | GET | `/api/v1/service-catalog` | `backend/app/service_catalog.py:61` list_catalogue |
| ADDED | GET | `/api/v1/service-catalog/job-tasks` | `backend/app/service_catalog.py:119` list_job_tasks |
| HANDLER_CHANGED | GET | `/api/v1/stock-inwards` | `backend/app/inventory.py:424` list_stock_inwards |
| HANDLER_CHANGED | GET | `/api/v1/stock-ledger` | `backend/app/inventory.py:462` list_stock_ledger |
| HANDLER_CHANGED | GET | `/api/v1/suppliers` | `backend/app/inventory.py:275` list_suppliers |
| ADDED | GET | `/api/v1/technician-tasks/mine` | `backend/app/execution.py:216` list_remote_tasks |
| ADDED | GET | `/api/v1/tenant/theme` | `backend/app/main.py:154` read_tenant_theme |
| HANDLER_CHANGED | GET | `/api/v1/vehicles` | `backend/app/intake.py:391` list_vehicles |
| HANDLER_CHANGED | GET | `/api/v1/visits` | `backend/app/intake.py:434` list_visits |
| HANDLER_CHANGED | POST | `/api/v1/admin/users` | `backend/app/tenant_admin.py:509` create_user |
| ADDED | POST | `/api/v1/auth/login` | `backend/app/database_auth.py:108` login |
| ADDED | POST | `/api/v1/auth/logout` | `backend/app/database_auth.py:172` logout |
| ADDED | POST | `/api/v1/bookings` | `backend/app/intake.py:243` create_booking |
| ADDED | POST | `/api/v1/bookings/{booking_id}/check-in` | `backend/app/intake.py:274` check_in_booking |
| ADDED | POST | `/api/v1/checklists` | `backend/app/checklists.py:76` create_cycle |
| ADDED | POST | `/api/v1/jobs/{job_id}/attachments` | `backend/app/execution.py:283` create_remote_attachment |
| ADDED | POST | `/api/v1/jobs/{job_id}/qc-checks` | `backend/app/execution.py:312` create_remote_qc_check |
| ADDED | POST | `/api/v1/jobs/{job_id}/technician-tasks` | `backend/app/execution.py:224` assign_remote_task |
| ADDED | POST | `/api/v1/jobs/{job_id}/work-updates` | `backend/app/execution.py:267` create_remote_work_update |
| HANDLER_CHANGED | POST | `/api/v1/material-reservations` | `backend/app/materials.py:197` create_reservation |
| ADDED | POST | `/api/v1/material-shortages` | `backend/app/materials.py:226` create_material_shortage |
| ADDED | POST | `/api/v1/media` | `backend/app/media.py:75` create_media |
| ADDED | POST | `/api/v1/media/{media_id}/archive` | `backend/app/media.py:105` archive_media |
| HANDLER_CHANGED | POST | `/api/v1/purchase-orders/{purchase_id}/commands/{command}` | `backend/app/inventory.py:333` purchase_order_command |
| ADDED | POST | `/api/v1/purchase-orders/{purchase_id}/delivery-confirmations` | `backend/app/inventory.py:394` confirm_delivery |
| ADDED | POST | `/api/v1/purchase-orders/{purchase_id}/delivery-receipts` | `backend/app/inventory.py:362` record_delivery_receipt |
| ADDED | POST | `/api/v1/purchase-requests` | `backend/app/procurement.py:87` create_request |
| ADDED | POST | `/api/v1/purchase-requests/{request_id}/approve` | `backend/app/procurement.py:121` approve |
| ADDED | POST | `/api/v1/purchase-requests/{request_id}/commands/{command}` | `backend/app/procurement.py:148` command |
| ADDED | POST | `/api/v1/purchase-requests/{request_id}/supplier-quotes` | `backend/app/procurement.py:104` add_quote |
| ADDED | POST | `/api/v1/qc-checks/{check_id}/legacy-result` | `backend/app/execution.py:188` record_qc_result |
| HANDLER_CHANGED | POST | `/api/v1/qc-checks/{check_id}/result` | `backend/app/execution.py:325` record_remote_qc_result |
| HANDLER_CHANGED | POST | `/api/v1/sales/quotations` | `backend/app/sales_crm.py:126` create_quotation |
| HANDLER_CHANGED | POST | `/api/v1/sales/quotations/{quotation_id}/status` | `backend/app/sales_crm.py:150` change_status |
| ADDED | POST | `/api/v1/service-catalog` | `backend/app/service_catalog.py:68` create_catalogue |
| ADDED | POST | `/api/v1/service-catalog/job-tasks` | `backend/app/service_catalog.py:127` create_job_task |
| HANDLER_CHANGED | POST | `/api/v1/stock-inwards` | `backend/app/inventory.py:432` record_stock_inward |
| ADDED | POST | `/api/v1/technician-tasks/{task_id}/commands/{command}` | `backend/app/execution.py:248` command_remote_task |
| ADDED | PUT | `/api/v1/checklists/items/{item_id}` | `backend/app/checklists.py:102` decide_item |
| ADDED | PUT | `/api/v1/jobs/{job_id}/estimated-delivery` | `backend/app/jobs.py:250` update_estimated_delivery |
| ADDED | PUT | `/api/v1/media/{media_id}` | `backend/app/media.py:93` update_media |
| HANDLER_CHANGED | PUT | `/api/v1/sales/quotations/{quotation_id}` | `backend/app/sales_crm.py:136` update_quotation |
| ADDED | PUT | `/api/v1/service-catalog/job-tasks/{task_id}/done` | `backend/app/service_catalog.py:149` set_job_task_done |
| ADDED | PUT | `/api/v1/service-catalog/{item_id}` | `backend/app/service_catalog.py:90` update_catalogue |
| HANDLER_CHANGED | PUT | `/api/v1/tenant/settings` | `backend/app/main.py:176` write_tenant_settings |
| ADDED | PUT | `/api/v1/tenant/theme` | `backend/app/main.py:162` write_tenant_theme |

## REC-03 - Authentication and authorization

Candidate `database_auth.py:27-41` hashes passwords with salted PBKDF2-SHA256 (600,000 rounds) and constant-time comparisons. Login at 108-145 supports either email or user ID, exactly one. Email login is deployment-tenant-scoped and rejects a conflicting tenant code and ambiguous matching accounts. It stores only token/CSRF digests in database sessions, uses an eight-hour session, HttpOnly session cookie, SameSite=Lax, Secure outside local mode, and CSRF header verification on unsafe methods. Logout revokes the session. Database mode rejects support-emulation headers in `auth.tenant_scope:186-203`.

Read-only source inspection is not a security certification. Public workshop/user selection routes expose identity metadata; decide whether this is required under the approved email form. Rate limiting, password reset, account lifecycle, cookie/proxy behavior, session revocation and CSRF failure UX need isolated verification. Do not import demo plaintext passwords as production credentials. Cognito remains an alternative requiring provider/claim/session and approved-login UX decisions.

Tenant request scope retains `session.begin()`, trusted membership/branch context and restricted RLS role switching. The earlier inspected PostgreSQL metadata identifies the connection principal as superuser/BYPASSRLS while the runtime role is restricted. Proposed architecture must separate migration/admin and runtime credentials and test every path; do not assume RLS is effective merely because a role exists. Page grants do not replace job actor/status checks. Candidate media routes currently check page grants and archived job existence, without local owner/linked-advisor and before/after work-phase gates. This is a concrete authorization parity gap.

## REC-04 - Migrations are not an append-only upgrade from checkout

Checkout has 19 active migration files/head `20261006_0017`; candidate/runtime has 34/head `20261018_0033`. The active candidate files match container hashes. Earlier read-only database metadata reported this head and PostgreSQL 17.9 / 74 public base tables; live business rows were not audited.

Candidate revisions 0018-0033 cover booking check-in, execution API, reservation idempotency, finance claim locking grants, purchase requests/shortages, receipt confirmation/stock inward idempotency, estimated delivery, database auth/import, runtime invitation grant, media, checklists/catalog and import archive scoping. However, candidate also archives conflicting historical lineages, replaces the foundation file location and reparents `20261002_0014` from `20261002_0013` to `20261001_0006`. `20260929_0006` adds a composite job uniqueness constraint in an existing revision. Merely seeing the same revision string does not prove identical applied DDL.

The candidate archive README explicitly assumes a fresh disposable staging database; archived stamps need separately planned reconciliation. Therefore: approve a clean disposable replay first; inventory actual revision/DDL checksums per target; design a bridge for any already-applied differing history; do not stamp, downgrade, replace old migrations or run checkout startup against the current database. [Migration graphs](stage15-migration-graph.json.md) and [candidate lineage/deployment source](stage16-candidate-source.md).

## REC-05 - Transactions, finance, media and documents

Candidate PO receipt/confirmation handlers lock the order and return idempotent replays; close serializes order access and posts accepted quantities once. A closed-order call returns existing state. Direct inward still exists and only rejects a delivery-managed order after delivery receipts exist; endpoint permission/bypass behavior needs parity tests. Material reservation creation has a post-item-lock idempotency lookup, but still requires available stock and approved-job gates unlike local shortage requests. Procurement approval requires a stored quote matching supplier/cost while local `approvePurchaseRequestForActor` accepts supplier/pre-GST price without that prerequisite. These differences appear in PAR-09 through PAR-13 of 18.

Finance remains identical to checkout: discount first-line allocation differs from proportional local arithmetic; partial payments and a separate handover request differ from atomic local full payment/closure; generated HTML is not the approved template output. New inspection also confirms **51/52 raw shipped invoice subtotals differ from sum(qty * rate)** by more than 0.01. Example invoice 1: stored subtotal 11,750 versus line sum 33,669. This is a source-data inconsistency, not proof of which figure is commercially correct. [Immutable discrepancy evidence](stage16-legacy-invoice-discrepancies.json.md). Preserve raw values/lines/documents, separate future arithmetic from historical treatment, and obtain explicit financial approval before import acceptance or recalculation.

Candidate media stores data URLs in PostgreSQL `job_media.src`, accepts a regex plus up to 14,000,000 characters, and has page-level CRUD grants. Local code validates decoded byte signatures/size and enforces owner/linked advisor and phase rules, but strips uploaded bytes from persisted SQLite. Durable storage is desirable for migration but is an explicit retention/ownership decision, not permission to broaden media editing. Execution attachments are another storage path; neither is a complete approved frozen-document service. Document templates, company assets, void history and session snapshots need their own ownership mapping.

## REC-06 - Deployment differences and rollback implications

Checkout staging deploys frontend with a static local/demo auth-config response and no API proxy. Candidate staging adds private API/PostgreSQL services, frontend `/api/` proxy and health routing, external Caddy ingress, and operator-owned environment files. Default staging auth remains Cognito; a separate database-auth overlay is an explicit cutover choice. Local current runtime database mode does not prove staging uses it. Candidate deployment/CI files differ from checkout; no remote staging runtime was contacted.

Candidate startup still applies Alembic before Uvicorn. Its cutover guide includes build/upgrade before a backup command: **do not adopt that ordering** for existing data. The proposed rollout requires verified backup/restore and write capture before schema-changing startup, explicit migration phase, compatible versioned API/frontend artifacts and rehearsed rollback. Auth rollback alone changes mode, not data; restoring a backup loses later writes unless separately preserved and reconciled. No deployment command in the candidate guide was executed.

## REC-07 - Data authority review

Recommend **DB-01 `public/workshopos-demo.sqlite`**, 60 tables / 3,241 rows, SHA-256 `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`. It matches Git HEAD, is fetched by `src/db.ts:156-186` when browser bytes are absent, and is byte-identical to DB-05/06/08. Schema user_version is zero, not a semantic migration version. Full hashes, paths, schema cookies/DDL differences and all-table counts remain in [10](10-SQLITE-DATA-AUTHORITY.md); all eight file hashes were rechecked unchanged in Stage 1.6.

| Copy | Rows | Difference / additional identities versus DB-01 |
|---|---:|---|
| DB-01 | 3,241 | Recommended raw shipped source; not a current-browser export. |
| DB-02 | 3,241 | 91 delivery-date field changes; no additional row identities. |
| DB-03 | 3,447 | 253 invoice_items, two material_approvals, two material_approval_events and sales_leads ID 2 added; also deletes/changes shipped records. Not a superset. |
| DB-04 | 3,447 | Same additional identities as DB-03; lead 1 is explicitly named Browser Only Decoy; differs from DB-03 only at that name. |
| DB-05 / DB-06 / DB-08 | 3,241 each | Identical copies, no additional records. |
| DB-07 | 3,241 | Initialized artifact; 52 invoice updated_at changes, no additional row identities. |

DB-03/04 differ in DDL for 16 tables (mostly order), with substantive booking-capacity field/default/nullability changes. Their 258 added identities per copy are not 258 additional valid migration records; missing/changed rows must be reconciled, not merged. See the per-ID evidence in 10. Actual browser data remains unknown until EXPORT-01 is approved and performed.

The candidate includes an importer and a historical rehearsal report for the same DB-01 hash. The report claims mapped records plus **16 archive-only rows**: material movements 3, advisor attendance 2, material event 1, stock ledger 4, invoice event 1, booking events 2 and PO quotations 3. Archival preservation does not guarantee those histories/quotes are available to approved frontend queries. The report is prior evidence, not a rehearsal run in this stage. Importer/restore/reconcile scripts must remain disabled until scope, legacy financial treatment and functional history mappings are approved. Their existence does not authorize merging an older demo tenant or overwriting current data.

## Recommendation and remaining approvals

REC-01 resolves the source-provenance uncertainty substantially: use pinned candidate backend source, preserve pinned approved frontend, and verify the one divergent test file and migration lineage in a disposable environment. Maintainer ownership/sign-off, actual browser export, authentication selection, financial legacy handling and document/media retention are still decisions. Proceed only to approved design work after review of [17](17-ARCHITECTURE-DECISION-REGISTER.md); [18](18-BACKEND-PARITY-MATRIX.md) supplies the acceptance conditions. No architecture choice in this document is marked accepted.
