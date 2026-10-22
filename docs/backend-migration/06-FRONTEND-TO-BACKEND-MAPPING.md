# Frontend-to-backend mapping

This is a requirement mapping, not backend implementation or an approved endpoint design. Existing Python backend code and frontend API adapters must be assessed for parity with the approved local path; their presence is not evidence that migration is complete.

## Mapping granularity

Every discovered control is indexed by component and handler in [control ledger](evidence-ui-controls.md). Every data operation has a stable `OP-*` ID, exact input signature, complete implementation, return behavior and dependencies in [operation contracts](evidence-operation-contracts.md). [Command mapping](evidence-command-mapping.md) joins persistence-bearing operations to source callers and affected tables where statically resolvable. Calls through dynamic aliases and helper SQL require the linked full implementation; a missing literal table match is not a claim of no persistence. Purely presentational controls require no backend mutation.

| Frontend feature / workflow | Required operation and response | Ownership / validation | Required atomic boundary |
|---|---|---|---|
| Login/session, WF-01 | Authenticate, obtain role/membership/page/record scope, refresh/logout | Authenticated session; never trust supplied actorId or demo password logic | Session lifecycle, independent of business transaction |
| Lists/search/dashboard, WF-02/38 | Read authorized projections, filtered/sorted pages, counts and aggregates matching local semantics | Tenant/branch/record scope before filters; preserve historical/archived distinctions | Consistent read snapshot; pagination/order deterministic |
| Customer/vehicle/intake, WF-04–06 | Create/update/archive masters; receive visit and return selected job identity plus refreshed relationships | Ownership, duplicate registration/contact rules, active advisor | New customer/vehicle/visit/job/checklist/history as one intake |
| Bookings/capacity, WF-07–10 | Query date/type counts; create/edit/state commands/call log/check-in | Capacity and override reason; actor; date; duplicate check-in | Booking event with state; intake plus booking conversion; serialize capacity admission |
| Jobs/task list/lifecycle, WF-11–15 | Job detail command, task commands, checklist tick/N/A, transition with audit | Linked actor, terminal guard, current cycle and artifact requirements | Job status + cycles/items/history; preserve rollback |
| Estimate, WF-16 | Save version/lines/totals and approve with note | Actor/linkage, GST/rates/discount and approval constraints | Estimate and lines, approval/audit/checklist projection |
| Materials/stock, WF-17–21 | Request/re-request/release/reconcile/approve commands and stock query | Role separation; invoiced/approval locks; valid quantities and stock | Request + stock delta + movements + approval/evidence updates |
| Suppliers/procurement, WF-22–27 | Supplier CRUD, request/quotation/approval/issue/receipt/confirmation/close/revision commands | Current status, supplier/SKU validity, per-line quantity and actor authority | Approval splits with line provenance; close/receive stock posting exactly once; revision deltas/history |
| Technician/QC, WF-28–29 | Task state/notes and QC result commands | Assignment, valid task state and failure reason | QC failure + rework task + lifecycle evidence |
| Invoice, WF-30–31 | Create/save/void current invoice and immutable audit history | Approved estimate; active material claims; permission; payment financial lock | Invoice/lines/totals/material claims/events/checklist |
| Payment/delivery, WF-32–34 | Full payment + handover command; eligible void command; delivery read/detail | Server-derived total, reminder, completed job and active invoice; reason/terminal rules | Payment/receipt/invoice/closed job/gate pass/acknowledgement/checklist in one transaction |
| Follow-up, WF-35 | Create/update/resolve/archive and filtered due views | Actor/job scope, due/status/type/material linkage | Follow-up plus resolution evidence if applicable |
| Media, WF-36 | Validate/store media metadata and content; authorize read/edit/archive | Signature/MIME/size, job actor/terminal scope | Content reference + metadata/evidence; define failure cleanup; lifetime decision GAP-05 |
| Documents, WF-37 | Read rendering payload/current template and frozen snapshots | Same job/document visibility; immutable historical rendering | Freeze snapshot with underlying artifact state, not a later unrelated write |
| Users/roles/team, WF-39–40 | Directory/roles/page grants/team relationships CRUD and archive | Tenant admin, active-role membership, protected owner, manager discrepancy | Relationship updates with audit; preserve referential history |
| Settings/templates/import/logs, WF-41–43 | Read/write typed settings, template lifecycle, import batch/rows/rejections and logs | Role authority, schema/placeholder validation, duplicates/quantity constraints | Template activation invariant; accepted import batch with idempotent retry |
| Sales, WF-44 | Lead and quotation/line/status CRUD, document projection | Contact/flags, lead linkage, status/rate/discount rules | Quotation header/lines/totals/template snapshot |
| Developer demo, WF-45 | Distinguish platform operations from demo simulation | Separate platform authority and read-only support emulation | Tenant lifecycle/billing/audit only if confirmed as backend scope |

## Contracts that must survive asynchronous integration

Local `mutate` returns boolean synchronously and handlers use it to decide whether to close/reset editors. Replacing it with a Promise without updating that contract would close forms early or hide failures. Backend integration must preserve input state on failure, keep the same success destination, prevent duplicate submission, and apply a coherent refreshed projection after success. Exact loading/error presentation remains the approved component contract; do not add replacement screens.

Server validation must repeat all integrity/authorization constraints even when the client validates them. Preserve current error meaning and field association; do not expose SQL errors. Use typed inputs from the contract ledger, server-owned IDs/timestamps/actor, and outputs sufficient to refresh existing `WorkshopState`/`JobView` consumers or equivalent adapter projections. Required outputs are the current function return plus every state projection currently reread after mutation, not simply HTTP success.

Reads are currently predominantly whole-state synchronous projections in local mode. Async network adapters exist for auth, user administration, jobs, finance, follow-ups and sales. Their method signatures and URLs are catalogued in [API evidence](evidence-api-calls.md). Local and remote variants must be compared at field/action level before choosing an API as authoritative.

## Concurrency and recovery requirements

Backend commands must atomically enforce scarce stock, booking capacity, one current invoice/payment, material billing claims and unique document/request numbers. Preserve existing savepoint boundaries and expand incomplete local multi-write operations where needed for server integrity without altering user steps. Explicitly define request retry/idempotency for payment, intake, receipts, PO closure, approval and import. Reject stale edits or safely serialize them; current single-browser SQLite behavior does not specify a multi-user conflict UI.

No endpoint paths, PostgreSQL types, storage vendor, queue service or deployment topology are approved here. Those are architecture decisions after review. Existing backend schema, UUID tenancy, RLS and migrations are inputs to that design, not permission to run migrations.
