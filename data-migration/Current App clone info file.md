# WorkshopOS — Current App clone info file

## Scope and evidence rules

This is the single main clone requirements and inspection document for the current local checkout. Preserve the approved appearance, labels, controls, navigation, calculations, roles and workflow sequences. This task documents the current application; it does not approve a new backend architecture, redesign, production deployment, or retirement of existing storage.

**Status: source inventory and local runtime evidence captured; full acceptance remains open for the explicit gaps below.** A source declaration proves an implemented branch exists, not that it is reachable or correct. A screenshot proves the captured state, not all actions on that screen. Passing named tests prove only their assertions. Failed baseline tests are findings, not desired behavior to silently reproduce or repair.

The initial 32 page keys and seven roles are confirmed against the current source. Login, developer utilities, nested tabs, record dialogs, conditional remote screens and legacy declarations are additional surfaces, not extra page keys. The declaration ledger at the end accounts for all extracted controls, forms and explicit dialog/tab/status declarations, including conditional expressions and handler attributes.

- Inspected revision: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`; branch `Prem-dev-fbb-Go21`. This identifies the checkout, not independent evidence of client sign-off.
- Existing working-tree changes were preserved: [evidence/initial-working-tree.txt](evidence/initial-working-tree.txt).
- Inspected local URL: `http://127.0.0.1:5187`; isolated Playwright Chromium `153.0.8010.12`. Capture began `2026-10-20T21:40:42.824Z` UTC. Dates/month filters depend on the runtime clock; do not replace historical record dates with today.
- Connected browser inventory returned no browsers or apps. The user’s existing browser and URL were requested but not supplied during this audit. Personal session data has **not** been captured or compared.
- Prior `docs/backend-migration/` contained supporting extraction evidence rather than a signed-off main requirements specification. This document regenerates source evidence from the current checkout.
- Graft was consulted before source inspection; ranked results were supplemented by exhaustive storage discovery and component/source ledgers.

## Reading and verification map

1. Page and role matrices below define destinations and access.
2. Workflow contracts define handoffs and invariants.
3. The data inventory and restoration procedure define the preserved demo baseline.
4. Runtime evidence links show actual screenshots, visible controls, defaults and options.
5. The component and control ledger defines exact field bindings, required/disabled rules, handlers and conditional visibility. Full handler implementations and operation contracts are linked to avoid guessing validations from labels.

Verification terms: **SOURCE** = inspected/extracted implementation; **CAPTURED** = rendered in an isolated browser; **TEST PASS/FAIL** = named automated result; **UNVERIFIED** = not exercised or dependent on unavailable services/session. These terms are not interchangeable.

## Page inventory — all 32 keys

Every entry must preserve its existing layout and interactions. Some labels deliberately differ from their key. The Receive Vehicle key is in the catalogue but absent from default rails; the intake action is a dialog reached from the reception workflow. No new standalone route is required.


### Front Desk

#### `receive-vehicle` — Receive Vehicle

Intake: existing/new customer and vehicle, advisor, ODO, fuel/battery, keys, accessories, requested work and body marks; Details/body-mark tabs, create/cancel and notification handoff. Catalogue key is not a default sidebar entry.

Default rail roles: none; catalogue/action only. Source components: [src/App.tsx:3056-3565](../src/App.tsx) (`CreateVisitDialog`).
Rendered evidence: **UNVERIFIED as a standalone page**; see intake/dialog evidence.

#### `today-queue` — Today Queue

Receive vehicle action, today/older queues, advisor attendance and assigned queues, select job, filters/reset; links intake to service advisor.

Default rail roles: Reception. Source components: [src/App.tsx:2570-2715](../src/App.tsx) (`Reception`); [src/App.tsx:2748-2881](../src/App.tsx) (`AdvisorAttendancePanel`); [src/App.tsx:2883-3042](../src/App.tsx) (`ReceptionQueueRows`).
Rendered evidence: [reception](screenshots/reception-today-queue.png).

#### `advance-bookings` — Advance Bookings

Calendar/register, date/service/status filters, capacity configuration and overrides, booking create/edit, call logs, confirmation, reschedule/cancel/no-show reasons and arrival check-in to visit/job.

Default rail roles: Reception, Owner/Admin. Source components: [src/App.tsx:2718-2746](../src/App.tsx) (`BookingOperations`); [src/booking-calendar.tsx:28-46](../src/booking-calendar.tsx) (`BookingCalendar`); [src/booking-check-in.tsx:12-50](../src/booking-check-in.tsx) (`BookingCheckInDialog`).
Rendered evidence: [reception](screenshots/reception-advance-bookings.png); [admin](screenshots/admin-advance-bookings.png).

#### `customers` — Customers

Customer registry with search/filter/sort/page/export/view modes, linked vehicles/jobs, add/view/edit/archive and validation.

Default rail roles: Reception. Source components: [src/App.tsx:11651-11739](../src/App.tsx) (`CustomerEditor`); [src/App.tsx:16490-16558](../src/App.tsx) (`CustomerRecordDialog`); [src/App.tsx:17595-18618](../src/App.tsx) (`EntityList`).
Rendered evidence: [reception](screenshots/reception-customers.png).

#### `vehicles` — Vehicles

Vehicle registry and customer relationship; registration/make/model/color/ODO, add/view/edit/archive, linked history and list controls.

Default rail roles: Reception. Source components: [src/App.tsx:11741-11885](../src/App.tsx) (`VehicleMasterPanel`); [src/App.tsx:16560-16634](../src/App.tsx) (`VehicleRecordDialog`); [src/App.tsx:17595-18618](../src/App.tsx) (`EntityList`).
Rendered evidence: [reception](screenshots/reception-vehicles.png).

#### `search` — Search

Role-filtered category selector; query/status/date/month/payment-mode/low-stock filters, clear, paging, export and record navigation. Admin categories embed inventory/estimate/follow-up workflows. Remote mode substitutes RemoteFollowupsWorkspace.

Default rail roles: Reception, Service Advisor, Service Department Manager, Store, Technician, Accounts, Owner/Admin. Source components: [src/App.tsx:1772-2203](../src/App.tsx) (`SearchPortal`); [src/App.tsx:2205-2259](../src/App.tsx) (`AdminSearchOperationalWorkspace`).
Rendered evidence: [reception](screenshots/reception-search.png); [service](screenshots/service-search.png); [service_manager](screenshots/service-manager-search.png); [store](screenshots/store-search.png); [tech](screenshots/tech-search.png); [accounts](screenshots/accounts-search.png); [admin](screenshots/admin-search.png).

### Workshop

#### `my-queue` — My Queue

Advisor assigned active jobs with direct record actions. Service manager dispatches through EntityList because the role is not service; do not assume identical advisor filtering or edit permissions.

Default rail roles: Service Advisor, Service Department Manager. Source components: [src/App.tsx:3567-3637](../src/App.tsx) (`ServiceAdvisor`); [src/App.tsx:3641-4110](../src/App.tsx) (`ServiceAdvisorList`); [src/App.tsx:17595-18618](../src/App.tsx) (`EntityList`).
Rendered evidence: [service](screenshots/service-my-queue.png); [service_manager](screenshots/service-manager-my-queue.png).

#### `job-card` — Job Card

Job list and detail/edit views, job sheet/body marks, lifecycle checklist, estimates/materials/tasks/QC, notes, media and linked documents.

Default rail roles: Service Advisor, Service Department Manager. Source components: [src/App.tsx:3641-4110](../src/App.tsx) (`ServiceAdvisorList`); [src/App.tsx:12010-12281](../src/App.tsx) (`JobEditor`); [src/App.tsx:16016-16258](../src/App.tsx) (`JobRecordDialog`).
Rendered evidence: [service](screenshots/service-job-card.png); [service_manager](screenshots/service-manager-job-card.png).

#### `estimate` — Estimate

Estimate list and item editor, quantity/rate/GST/discount totals, draft/save/view/approve, customer confirmation and document output.

Default rail roles: Service Advisor, Service Department Manager. Source components: [src/App.tsx:3641-4110](../src/App.tsx) (`ServiceAdvisorList`); [src/App.tsx:4112-4159](../src/App.tsx) (`ServiceEstimateDialog`); [src/App.tsx:12740-12960](../src/App.tsx) (`EstimateDialog`).
Rendered evidence: [service](screenshots/service-estimate.png); [service_manager](screenshots/service-manager-estimate.png).

#### `follow-ups` — Follow-ups

Follow-up list, add/view/edit, due date/type/status/note, resolution and material-related records; remote conditional workspace has separate API/loading/error behavior.

Default rail roles: Service Advisor, Service Department Manager. Source components: [src/App.tsx:3641-4110](../src/App.tsx) (`ServiceAdvisorList`); [src/App.tsx:4161-4551](../src/App.tsx) (`ServiceFollowupDialog`).
Rendered evidence: [service](screenshots/service-follow-ups.png); [service_manager](screenshots/service-manager-follow-ups.png).

#### `media` — Media

Job-associated before/after/evidence images, category filters, file uploads, metadata edit, preview and archive; payload persistence limitation below.

Default rail roles: Service Advisor, Service Department Manager, Owner/Admin. Source components: [src/App.tsx:13060-13383](../src/App.tsx) (`JobMediaPanel`); [src/App.tsx:13385-13461](../src/App.tsx) (`MediaMetadataDialog`); [src/App.tsx:17595-18618](../src/App.tsx) (`EntityList`).
Rendered evidence: [service](screenshots/service-media.png); [service_manager](screenshots/service-manager-media.png); [admin](screenshots/admin-media.png).

#### `my-tasks` — My Tasks

Assigned tasks and job selection, task status and notes; preserve assignment-specific task visibility.

Default rail roles: Technician. Source components: [src/App.tsx:8985-9088](../src/App.tsx) (`Technician`); [src/App.tsx:14831-14885](../src/App.tsx) (`TaskCreator`).
Rendered evidence: [tech](screenshots/tech-my-tasks.png).

#### `work-update` — Work Update

Task work updates, Pending/Started/Paused/Completed statuses and notes; no implied advisor lifecycle authority.

Default rail roles: Technician. Source components: [src/App.tsx:8985-9088](../src/App.tsx) (`Technician`).
Rendered evidence: [tech](screenshots/tech-work-update.png).

#### `qc-prep` — QC Prep

QC checklist preparation/pass/fail state and related work evidence; preserve per-actor controls and blocked states.

Default rail roles: Technician. Source components: [src/App.tsx:8985-9088](../src/App.tsx) (`Technician`); [src/App.tsx:14887-14940](../src/App.tsx) (`QcEditor`).
Rendered evidence: [tech](screenshots/tech-qc-prep.png).

### Inventory

#### `material-requests` — Material Requests

Pending material requirements, availability, job selection and procurement triage, create purchase request or issue available stock.

Default rail roles: Store. Source components: [src/App.tsx:4553-4634](../src/App.tsx) (`MaterialProcurementTriage`); [src/App.tsx:4636-4926](../src/App.tsx) (`StoreDesk`); [src/App.tsx:8167-8983](../src/App.tsx) (`StoreList`).
Rendered evidence: [store](screenshots/store-material-requests.png).

#### `issue-material` — Issue Material

Issue/release material quantities for a job; enforce available stock and actor/approval checks; record stock movement.

Default rail roles: Store. Source components: [src/App.tsx:4636-4926](../src/App.tsx) (`StoreDesk`); [src/App.tsx:13847-13861](../src/App.tsx) (`IssueMaterialEditor`); [src/App.tsx:13863-13931](../src/App.tsx) (`ReleaseMaterialDialog`).
Rendered evidence: [store](screenshots/store-issue-material.png).

#### `reconcile` — Reconcile

Issued/used/returned/wasted quantities, reconciliation reasons and inventory effects; unresolved balance blocks completion/closure where enforced.

Default rail roles: Store. Source components: [src/App.tsx:4636-4926](../src/App.tsx) (`StoreDesk`); [src/App.tsx:13984-14174](../src/App.tsx) (`ReconcileEditor`).
Rendered evidence: [store](screenshots/store-reconcile.png).

#### `stock` — Stock

Inventory list, low stock and stock movement tabs; item search/filter, supplier/category/unit/price/threshold fields, stock additions/adjustments and exports.

Default rail roles: Store. Source components: [src/App.tsx:4636-4926](../src/App.tsx) (`StoreDesk`); [src/App.tsx:7929-8121](../src/App.tsx) (`StockMovementHistory`); [src/App.tsx:8167-8983](../src/App.tsx) (`StoreList`); [src/App.tsx:14187-14467](../src/App.tsx) (`QuickAddStock`); [src/App.tsx:14469-14610](../src/App.tsx) (`EditStockDetailsDialog`).
Rendered evidence: [store](screenshots/store-stock.png).

#### `approvals` — Approvals

Admin material approval queue with pending badge; inspect submission, approve/reject with reasons, handoff back to operational jobs.

Default rail roles: Owner/Admin. Source components: [src/App.tsx:9127-9312](../src/App.tsx) (`MaterialApprovalQueue`).
Rendered evidence: [admin](screenshots/admin-approvals-0.png).

#### `inward-purchases` — Purchase Orders

Sidebar label is Purchase Orders. Purchase request draft/edit/submit, approval, supplier/line/previous-price review, quotations, PO issue/confirmation/receipts/close/cancel; older inward workspace declarations are not proof of current routing.

Default rail roles: Store, Owner/Admin. Source components: [src/App.tsx:5110-5964](../src/App.tsx) (`PurchaseOrdersWorkspace`).
Rendered evidence: [store](screenshots/store-purchase-orders.png); [admin](screenshots/admin-purchase-orders.png).

### Finance

#### `ready-to-invoice` — Ready To Invoice

Completed job invoice readiness, pending invoices, linked job selection and draft creation; remote mode uses invoice workspace.

Default rail roles: Accounts. Source components: [src/App.tsx:9090-9125](../src/App.tsx) (`Accounts`); [src/billing-manager.tsx:117-195](../src/billing-manager.tsx) (`BillingManager`).
Rendered evidence: [accounts](screenshots/accounts-ready-to-invoice.png).

#### `invoice` — Invoice

Create/view/edit invoice, line-item totals and GST, Tally reference, document output and void reason; archived/voided rules and audit trail.

Default rail roles: Accounts. Source components: [src/billing-manager.tsx:117-195](../src/billing-manager.tsx) (`BillingManager`); [src/billing-manager.tsx:280-328](../src/billing-manager.tsx) (`InvoiceDialog`); [src/billing-manager.tsx:341-363](../src/billing-manager.tsx) (`JobInvoicePanel`).
Rendered evidence: [accounts](screenshots/accounts-invoice.png).

#### `payment` — Payment

Payment amount/mode/reference, remaining balance, receipt creation, partial/full payment, void reason and invoice/payment status synchronization.

Default rail roles: Accounts. Source components: [src/billing-manager.tsx:117-195](../src/billing-manager.tsx) (`BillingManager`); [src/billing-manager.tsx:252-268](../src/billing-manager.tsx) (`RecordPaymentForm`); [src/billing-manager.tsx:331-338](../src/billing-manager.tsx) (`PaymentDialog`); [src/billing-manager.tsx:381-398](../src/billing-manager.tsx) (`JobPaymentPanel`).
Rendered evidence: [accounts](screenshots/accounts-payment.png).

#### `delivery` — Delivery

Delivery readiness/closure blockers, delivered-by/final-ODO/acknowledgement, receipt and gate pass, final delivery handoff; remote version is conditional.

Default rail roles: Accounts. Source components: [src/billing-manager.tsx:117-195](../src/billing-manager.tsx) (`BillingManager`).
Rendered evidence: [accounts](screenshots/accounts-delivery.png).

### Sales CRM

#### `sales-leads` — Leads

Admin Sales CRM disclosure -> Leads; create/view/edit lead, name/phone/company/email/address/service interest/notes, stage/temperature/follow-up/site-visit fields, not-entered checkboxes and lead actions.

Default rail roles: Owner/Admin. Source components: [src/local-sales.tsx:21-32](../src/local-sales.tsx) (`LocalSalesWorkspace`); [src/sales-lead-dialog.tsx:26-55](../src/sales-lead-dialog.tsx) (`SalesLeadDialog`); [src/sales-lead-register.tsx:96-126](../src/sales-lead-register.tsx) (`SalesLeadRegister`).
Rendered evidence: [admin](screenshots/admin-leads.png).

#### `quotations` — Quotations

Admin Sales CRM -> Quotations; lead-linked quotation lines, catalogue selection, tax/discount/totals, validity/notes/template, status actions and output preview/download.

Default rail roles: Owner/Admin. Source components: [src/local-sales.tsx:21-32](../src/local-sales.tsx) (`LocalSalesWorkspace`); [src/quotation-dialog.tsx:31-47](../src/quotation-dialog.tsx) (`QuotationEditorDialog`); [src/quotation-dialog.tsx:53-53](../src/quotation-dialog.tsx) (`QuotationDetailsDialog`).
Rendered evidence: [admin](screenshots/admin-quotations.png).

#### `quotation-settings` — Quotation Settings

Admin Sales CRM -> Quotation Settings opens Report Templates with quotation category selected; not an independent settings data model.

Default rail roles: Owner/Admin. Source components: [src/admin-console.tsx:116-288](../src/admin-console.tsx) (`AdminConsole`); [src/admin-console.tsx:2462-2787](../src/admin-console.tsx) (`ReportTemplatesTab`).
Rendered evidence: [admin](screenshots/admin-quotation-settings.png).

### Administration

#### `dashboard` — Dashboard

KPI cards, date/month controls, cashflow/operational summaries and filtered destination drilldowns. Retain drilldown filter semantics and responsive layout.

Default rail roles: Owner/Admin. Source components: [src/App.tsx:9461-9848](../src/App.tsx) (`OperationalDashboard`).
Rendered evidence: [admin](screenshots/admin-dashboard.png).

#### `data-flow` — Data Flow

Linked workflow and document chain, status/blocker evidence, snapshot/print/download actions and job context.

Default rail roles: Owner/Admin. Source components: [src/App.tsx:15038-15234](../src/App.tsx) (`DataFlowWorkspace`); [src/App.tsx:15345-15487](../src/App.tsx) (`DataFlowLine`); [src/App.tsx:15491-15633](../src/App.tsx) (`JobDocuments`).
Rendered evidence: [admin](screenshots/admin-data-flow.png).

#### `jobs` — Job Cards

Admin Job Cards grid/table with multi-row filters, add/view/edit/archive, list export/paging, selected record and all nested job panels.

Default rail roles: Owner/Admin. Source components: [src/App.tsx:15635-15947](../src/App.tsx) (`AddJobCardDialog`); [src/App.tsx:16016-16258](../src/App.tsx) (`JobRecordDialog`); [src/App.tsx:17595-18618](../src/App.tsx) (`EntityList`).
Rendered evidence: [admin](screenshots/admin-job-cards.png).

#### `manage` — Manage

Users, Customers, Vehicles, Suppliers, Job Cards, Estimates, Invoices, Payments, Delivery tabs. Load Large Demo Dataset replaces demo records in that isolated context; it is not the shipped snapshot or a production import.

Default rail roles: Owner/Admin. Source components: [src/App.tsx:9863-9998](../src/App.tsx) (`ManagementHub`).
Rendered evidence: [admin](screenshots/admin-manage.png).

#### `admin-console` — Admin Console

Users; Team Structure; Service Task; Roles & Page Access; Business Settings; App Theme; Company Settings; Report Templates; Inventory Import; Support & Logs. Preserve nested editors, imports, previews, validation and save/cancel behavior.

Default rail roles: Owner/Admin. Source components: [src/admin-console.tsx:116-288](../src/admin-console.tsx) (`AdminConsole`).
Rendered evidence: [admin](screenshots/admin-admin-console.png).

## Role access and action permissions

The sidebar is the intersection of ROLE_MENU_PAGE_KEYS and saved rolePageAccess. Grants do not automatically add arbitrary pages to a role-owned rail. Owner/Admin retains Admin Console protection. Admin Search additionally grants Material Requests, Issue Material, Reconcile, Stock, Estimate and Follow-ups. Custom role/page configuration is local demo configuration; production server enforcement is a separate implementation concern.

| Role | Default sidebar keys | Additional default granted keys |
|---|---|---|

|Owner/Admin|dashboard, advance-bookings, approvals, data-flow, jobs, media, inward-purchases, manage, search, sales-leads, quotations, quotation-settings, admin-console|material-requests, issue-material, reconcile, stock, estimate, follow-ups|
|Service Advisor|my-queue, job-card, estimate, follow-ups, media, search|—|
|Service Department Manager|my-queue, job-card, estimate, follow-ups, media, search|—|
|Reception|today-queue, advance-bookings, customers, vehicles, search|—|
|Accounts|ready-to-invoice, invoice, payment, delivery, search|—|
|Store|material-requests, issue-material, reconcile, stock, inward-purchases, search|—|
|Technician|my-tasks, work-update, qc-prep, search|—|

Permission checks must be preserved per action, not inferred from page access. In the local implementation, canMutateJobLifecycle permits Owner/Admin or the assigned Service Advisor; canMutateBilling permits Owner/Admin or Accounts. Service Department Manager has an advisor-like rail but is not included in those two local guards. Record-level restrictions, archived/terminal jobs and material/media checks further narrow actions. This is a documented role asymmetry, not authorization to broaden manager access.

Reception receives/assigns work; service advisor prepares requirements, estimate and execution checklist; store sources/issues/reconciles stock; technician updates tasks and QC preparation; accounts handles invoice/payment/delivery; owner manages approvals/master data/settings. Exact allowed mutations and denied-action errors are defined by the linked actor-aware operation implementations below. Developer emulation lists five roles (admin, service, reception, accounts, tech), independently of the seven operational roles.

## Login, shell, developer and conditional screens

- Local login defaults to the seeded admin account, has Email/Password/Login and Emulate User selector. Invalid credentials show the implemented demo-login error. The selector changes the email; it does not itself submit login. Demo authentication is limited by loadAuthConfig/local host behavior.
- Cognito-configured deployments show Continue with Cognito, PKCE callback/token/session flow and membership/tenant branches. Non-local deployments without allowed demo auth show the configuration error. Real Cognito, invitation/password setup, expired-session and server-unavailable flows are **UNVERIFIED against live services**. Remote component declarations are retained in the component ledger.
- Shell: role rail, collapsible/movable rail handle, Sales CRM disclosure, logout/Return to Developer, role heading, Search category controls. Current pages are selected in React state; do not invent per-page URL routes.
- Developer Console: Tenants, Communications and Billing tabs. Tenant creation/profile/edit/lifecycle, role emulation, disabled-tenant guard, channel active/sender settings, simulated delivery log, platform charge/payment forms and Reset demo. Communication test is simulated; no real email/WhatsApp delivery is implied. Developer state persists in sessionStorage.
- Conditional surfaces include no-pages-assigned, empty lists, disabled/archived records, loading/error text, confirmation/void/archive dialogs, notification dialogs, upload previews, print/download menus and mobile-specific layouts. Exact JSX visibility guards are recorded for each declaration below.
- LegacyInwardPurchasesWorkspace and Duplicate* components are retained as SOURCE evidence; their names or presence do not make them required new destinations. Current RoleWorkspace routing is authoritative. Components without runtime evidence remain source-only until reachability is demonstrated.


## Workflow and calculation contracts

### Intake and booking

Preserve customer/vehicle lookup versus new-record paths, duplicate checks, advisor assignment, ODO/fuel/battery/body marks and save/cancel behavior. Intake creates linked customer/vehicle/visit/job records as applicable and emits the existing notification prompt. Booking statuses are Booked, Confirmed, Arrived, Rescheduled, Cancelled and No-show. Preserve capacity/service-type rules, reason requirements and check-in links; do not create duplicate jobs by repeating check-in. Required/default fields and exact submit handlers appear in CreateVisitDialog, AddJobCardDialog, BookingCheckInDialog and the operation ledger.

### Job lifecycle and handoff

| Current state | Manual next-state candidates before actor/artifact checks |
|---|---|
| NEW | IN_PROGRESS, CANCELLED |
| IN_PROGRESS | COMPLETED, HOLD, CANCELLED |
| HOLD | IN_PROGRESS, CANCELLED |
| COMPLETED | IN_PROGRESS |
| CLOSED | none |
| CANCELLED | none |

CLOSED is not a generic manual transition candidate: payment/delivery closure has dedicated paths. Checklist order, cycle timestamps, checked/not-applicable flags, actor IDs and artifact-driven resolution must survive cloning. Preserve required confirmation notes and HOLD/terminal edit restrictions. Do not treat sub-status as an independent free-text field; it is derived from checklist progress. Reopening may create a new cycle and must retain historical evidence.

Stages cover gathering requirements, creating estimate, confirmation, material request/issue, washing, started work, follow-up, photo sharing, QC, customer verification, invoice, Google review reminder, payment, receipt, gate pass and delivery. Exact stage arrays and compatibility rules are in the type/constants and operation evidence.

### Estimates, invoices and payments

Keep per-line quantity/rate/GST normalization and existing discount/tax rounding helpers; do not substitute a simplified percentage formula. Estimate approval and invoice creation/edit/void retain actor checks and audit entries. Existing record numbers/prefixes and collision avoidance in nextDocumentNumber must remain consistent. Payment status is Pending for no active payment, Partial below total, Paid at full amount. Preserve overpayment/invalid amount guards, payment mode/reference fields, receipt and gate-pass effects, payment void synchronization and duplicate/idempotency behavior where implemented.

closureBlockers reports QC pass required; material reconciliation required when |issued-used-returned-wasted| exceeds 0.001; available non-void Tally invoice required; full payment required; receipt required; gate pass required. Delivery also has actor/final-ODO/acknowledgement checks. These blockers are exact existing behavior, not a new generalized rule for every screen.

### Inventory, procurement and media

Maintain stock issue/return/waste arithmetic and movement history, request approvals and purchasing lifecycle, supplier pricing/history, line-level receipts, attachment metadata and cancellation reasons. Related records must retain job/item/order/supplier links. Do not treat the old inward-purchase components as an alternative current PO page. Media add/edit/archive gates depend on actor, category and job status; archived/terminal restrictions and missing-evidence reconciliation are significant.

### Lists, dialogs, exports and settings

Preserve each list’s own filters, date/month defaults, sorting, grid/table availability, per-page choices and pagination state when returning from a record. There is no universal toolbar: the advisor Job Card page deliberately differs from admin Job Cards. Save success, validation error and cancellation must retain the existing draft/close behavior. Archive/void reason requirements are distinct from hard deletion. Use the existing CSV/XLSX/PDF/print/document menus and template placeholder/sanitization rules; available formats differ by control. Screenshot captures do not verify the bytes of every export.

Settings include business profile/branch/hours/calendar, job numbering/defaults, pricing, GST/banking/payment modes, stock settings, notifications, log retention, theme, company logo/stamp/signature, roles/page access, team/department assignments, service task/brand/segment masters, report templates and inventory import batch records. Preserve current field names, validation messages and defaults, including apparent inconsistencies. Runtime default JSON is the exact value reference; eight report templates exist in this baseline, while three unit assertions still expect six.

## Demo data, schema and preservation

Shipped file: [demo-data/shipped.sqlite](demo-data/shipped.sqlite); SHA-256 `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`. Fresh-start post-initialization file: [demo-data/runtime-initial.sqlite](demo-data/runtime-initial.sqlite); SHA-256 `5da9c6b40b32429c2520fb6f3cbf274c60a7b3a94b55bc317692398e2131d3a5`. Both are immutable evidence copies; the original `public/workshopos-demo.sqlite` was not modified. No identifiers were transformed.

Exact schema/columns/types/PK/defaults/FKs/DDL/row hashes: [demo-data/shipped-inventory.json](demo-data/shipped-inventory.json) and [demo-data/runtime-initial-inventory.json](demo-data/runtime-initial-inventory.json). Full row values: [demo-data/shipped-records.json](demo-data/shipped-records.json) and [demo-data/runtime-initial-records.json](demo-data/runtime-initial-records.json). These are copies of shipped demo fixtures, not certified real customer data. Preserve even odd fixture values; do not silently normalize them.

| Table | Shipped rows | Runtime rows | Rows identical |
|---|---:|---:|---|
| `advisor_attendance` | 2 | 2 | True |
| `approvals` | 0 | 0 | True |
| `booking_call_logs` | 0 | 0 | True |
| `booking_capacity_limits` | 0 | 0 | True |
| `booking_capacity_overrides` | 0 | 0 | True |
| `booking_events` | 2 | 2 | True |
| `bookings` | 2 | 2 | True |
| `car_segments` | 0 | 0 | True |
| `checklist_cycles` | 145 | 145 | True |
| `checklist_items` | 711 | 711 | True |
| `customers` | 121 | 121 | True |
| `estimate_items` | 144 | 144 | True |
| `estimates` | 144 | 144 | True |
| `followups` | 119 | 119 | True |
| `gate_passes` | 27 | 27 | True |
| `inventory` | 4 | 4 | True |
| `invoice_events` | 1 | 1 | True |
| `invoice_items` | 105 | 105 | True |
| `invoices` | 52 | 52 | False |
| `inward_purchase_attachments` | 0 | 0 | True |
| `inward_purchase_events` | 0 | 0 | True |
| `inward_purchase_lines` | 0 | 0 | True |
| `inward_purchase_revision_lines` | 0 | 0 | True |
| `inward_purchase_revisions` | 0 | 0 | True |
| `inward_purchases` | 0 | 0 | True |
| `job_cards` | 145 | 145 | True |
| `job_task_list_items` | 4 | 4 | True |
| `local_purchases` | 0 | 0 | True |
| `material_approval_events` | 0 | 0 | True |
| `material_approvals` | 0 | 0 | True |
| `material_events` | 1 | 1 | True |
| `material_movements` | 3 | 3 | True |
| `material_purchase_requests` | 0 | 0 | True |
| `material_requests` | 117 | 117 | True |
| `payments` | 27 | 27 | True |
| `photos` | 289 | 289 | True |
| `purchase_order_confirmations` | 3 | 3 | True |
| `purchase_order_lines` | 3 | 3 | True |
| `purchase_order_quotations` | 3 | 3 | True |
| `purchase_order_receipt_lines` | 3 | 3 | True |
| `purchase_order_receipts` | 2 | 2 | True |
| `purchase_orders` | 2 | 2 | True |
| `qc_checks` | 435 | 435 | True |
| `receipts` | 27 | 27 | True |
| `sales_leads` | 1 | 1 | True |
| `sales_quotation_lines` | 2 | 2 | True |
| `sales_quotations` | 1 | 1 | True |
| `service_advisor_teams` | 0 | 0 | True |
| `service_brands` | 0 | 0 | True |
| `service_catalog_items` | 3 | 3 | True |
| `service_department_managers` | 2 | 2 | True |
| `service_departments` | 2 | 2 | True |
| `status_history` | 146 | 146 | True |
| `stock_inwards` | 3 | 3 | True |
| `stock_ledger` | 4 | 4 | True |
| `suppliers` | 2 | 2 | True |
| `tasks` | 145 | 145 | True |
| `users` | 10 | 10 | True |
| `vehicles` | 132 | 132 | True |
| `visits` | 145 | 145 | True |

All 52 invoice rows receive a changed updated_at timestamp during initialization; amounts, identifiers and other captured fields are unchanged. Exact field comparison is in [invoice initialization changes](demo-data/invoice-initialization-changes.json). This occurs again after normal browser restoration, so byte-for-byte runtime equality is not achieved after startup even though the SQLite backup restore is exact. The preserved runtime baseline must not be conflated with the raw shipped database. Schema migration/normalization runs on open, seeds only when users are absent, and ensures demo advisors/team structure. The separate “Load Large Demo Dataset” generator is not assumed equal to the shipped database.

Core relationships: customers -> vehicles and visits; visits -> job_cards; jobs -> estimates/items, material requests/movements/approvals, tasks/QC, lifecycle cycles/items/status history, photos, followups, invoices/items/payments/receipts/gate passes; users -> advisor/technician/actor assignments; suppliers/items -> purchase orders/lines/receipts; leads -> quotations/lines; departments -> managers/advisor teams. **This SQLite baseline declares zero foreign keys**, so foreign_key_check alone provides no relationship assurance. A separate [explicit relationship audit](evidence/relationship-verification.json) checks 100 inferred column-to-parent mappings and finds no missing nonempty references. Null/zero/empty sentinels are counted separately, not certified valid. Quotation template_id refers outside SQLite to templates and is listed unmapped; broader business semantics and actor fields without _id suffix remain review items.

### Storage and runtime-only assets

- localStorage `workshopos.sqlite.v2` contains base64 SQLite; v1 is a fallback. A delivery-date migration marker affects first-open handling. The original shipped database is fetched only when no saved database exists.
- sessionStorage admin-demo v2 (v1 migration fallback) holds role grants, business settings, theme, logs, import batches/session inventory, templates and company assets. Capture/restore it separately from SQLite.
- Developer control-plane state and document snapshots use separate sessionStorage stores. Cognito token/OAuth state is authentication data and must not be copied into demo restoration. This audit’s isolated local defaults contain no live Cognito session.
- Uploaded image payload rows are intentionally removed from durable SQLite export, and missing-photo checklist evidence is reset. Active in-memory uploaded media cannot be recovered from localStorage alone. The shipped placeholder/static media is preserved; the inaccessible personal session may contain additional unrecoverable-in-export media.
- No IndexedDB business-store use was found in the indexed source discovery. Browser/service-worker static caching is distinct from business persistence; this audit did not clear the user’s caches or inspect unconnected profiles.

Defaults, templates, role grants, company assets and developer defaults: [demo-data/runtime-defaults.json](demo-data/runtime-defaults.json). Preserved static assets: [body-mark-vehicle.svg](demo-data/assets/body-mark-vehicle.svg), [car-damage-diagram.png](demo-data/assets/car-damage-diagram.png), [icon.svg](demo-data/assets/icon.svg), [manifest.webmanifest](demo-data/assets/manifest.webmanifest), [media-placeholder.svg](demo-data/assets/media-placeholder.svg), [sw.js](demo-data/assets/sw.js).
Fresh loader settings are separately preserved in [demo-data/runtime-loaded-settings.json](demo-data/runtime-loaded-settings.json). The zero-argument createDefaultAdminDemoState factory uses a fixed September timestamp, whereas loadAdminDemoState uses the current clock when no saved settings exist. Their generated log/template timestamps therefore differ; preserve the selected snapshot explicitly rather than assuming those defaults are identical.

### Restore procedure and reconciliation

1. Use a disposable local checkout/browser profile at the inspected revision. Preserve any target browser’s original storage before restoration. Do not run against a production origin or existing user session.
2. For raw shipped startup, use the preserved shipped.sqlite as the isolated server’s `public/workshopos-demo.sqlite`, with empty local business storage. For the captured post-initialization state, load the saved localStorage and sessionStorage maps from runtime-defaults.json **before** application startup, on the same local origin. This includes the SQLite base64 and migration marker. It replaces only the disposable context, not real records.
3. Runtime default admin/developer objects are included separately because some defaults are computed without storage writes. Use the application’s normal load/save helpers if explicitly restoring those settings; do not merge token/OAuth state.
4. Reopen the application and compare every table/record, primary keys, related IDs, meaningful dates, statuses and amounts against runtime-initial-records.json. Verify schema integrity and declared foreign keys. Compare settings/templates and media separately.
5. The repeatable inventory script opens source SQLite in read-only immutable mode. Its restore check backs up into a separate in-memory database and compares all rows. The browser dialog capture script also restores the captured stores into a new browser context and compares all table rows after normal startup.
6. Rerunning collection overwrites this audit’s generated evidence files only; it is not an import into PostgreSQL and does not append or duplicate application records. PostgreSQL migration, production rollback and business-store retirement remain outside this documentation task. Keep the original and both preserved snapshots until separately approved migration reconciliation succeeds.

[evidence/restore-verification.json](evidence/restore-verification.json): `{"restore": "SQLite backup to independent in-memory database", "all_rows_equal": true, "integrity": "ok", "declared_fk_violations": [], "original_shipped_hash_equal": true}`
[evidence/browser-restore-verification.json](evidence/browser-restore-verification.json): `{"at": "2026-10-20T21:47:58.063Z", "newContext": true, "allTablesEqual": false, "onlyInvoiceUpdatedAtDiffers": true, "changed_rows": 52}`
## Runtime screenshots and controls

All screenshots use isolated local demo contexts. JSON evidence records rendered text, visible/default field values, options and disabled/required state. Some DOM inventories include hidden option/button elements; screenshots establish visibility. These are new inspection captures, not a client-approved visual regression baseline.

| Role | Page / tab / category | Screenshot | Rendered control evidence |
|---|---|---|---|
|public|login|[image](screenshots/public-login.png)|[controls](evidence/runtime-public-login.json)|
|reception|Today Queue|[image](screenshots/reception-today-queue.png)|[controls](evidence/runtime-reception-today-queue.json)|
|reception|Advance Bookings|[image](screenshots/reception-advance-bookings.png)|[controls](evidence/runtime-reception-advance-bookings.json)|
|reception|Customers|[image](screenshots/reception-customers.png)|[controls](evidence/runtime-reception-customers.json)|
|reception|Vehicles|[image](screenshots/reception-vehicles.png)|[controls](evidence/runtime-reception-vehicles.json)|
|reception|Search|[image](screenshots/reception-search.png)|[controls](evidence/runtime-reception-search.json)|
|reception|Search-category-Job Card|[image](screenshots/reception-search-category-job-card.png)|[controls](evidence/runtime-reception-search-category-job-card.json)|
|reception|Search-category-Customer|[image](screenshots/reception-search-category-customer.png)|[controls](evidence/runtime-reception-search-category-customer.json)|
|reception|Search-category-Vehicle|[image](screenshots/reception-search-category-vehicle.png)|[controls](evidence/runtime-reception-search-category-vehicle.json)|
|service|My Queue|[image](screenshots/service-my-queue.png)|[controls](evidence/runtime-service-my-queue.json)|
|service|Job Card|[image](screenshots/service-job-card.png)|[controls](evidence/runtime-service-job-card.json)|
|service|Estimate|[image](screenshots/service-estimate.png)|[controls](evidence/runtime-service-estimate.json)|
|service|Follow-ups|[image](screenshots/service-follow-ups.png)|[controls](evidence/runtime-service-follow-ups.json)|
|service|Media|[image](screenshots/service-media.png)|[controls](evidence/runtime-service-media.json)|
|service|Search|[image](screenshots/service-search.png)|[controls](evidence/runtime-service-search.json)|
|service|Search-category-Job Card|[image](screenshots/service-search-category-job-card.png)|[controls](evidence/runtime-service-search-category-job-card.json)|
|service|Search-category-Customer|[image](screenshots/service-search-category-customer.png)|[controls](evidence/runtime-service-search-category-customer.json)|
|service|Search-category-Vehicle|[image](screenshots/service-search-category-vehicle.png)|[controls](evidence/runtime-service-search-category-vehicle.json)|
|service|Search-category-Invoice|[image](screenshots/service-search-category-invoice.png)|[controls](evidence/runtime-service-search-category-invoice.json)|
|service_manager|My Queue|[image](screenshots/service-manager-my-queue.png)|[controls](evidence/runtime-service-manager-my-queue.json)|
|service_manager|Job Card|[image](screenshots/service-manager-job-card.png)|[controls](evidence/runtime-service-manager-job-card.json)|
|service_manager|Estimate|[image](screenshots/service-manager-estimate.png)|[controls](evidence/runtime-service-manager-estimate.json)|
|service_manager|Follow-ups|[image](screenshots/service-manager-follow-ups.png)|[controls](evidence/runtime-service-manager-follow-ups.json)|
|service_manager|Media|[image](screenshots/service-manager-media.png)|[controls](evidence/runtime-service-manager-media.json)|
|service_manager|Search|[image](screenshots/service-manager-search.png)|[controls](evidence/runtime-service-manager-search.json)|
|service_manager|Search-category-Job Card|[image](screenshots/service-manager-search-category-job-card.png)|[controls](evidence/runtime-service-manager-search-category-job-card.json)|
|service_manager|Search-category-Invoice|[image](screenshots/service-manager-search-category-invoice.png)|[controls](evidence/runtime-service-manager-search-category-invoice.json)|
|store|Material Requests|[image](screenshots/store-material-requests.png)|[controls](evidence/runtime-store-material-requests.json)|
|store|Issue Material|[image](screenshots/store-issue-material.png)|[controls](evidence/runtime-store-issue-material.json)|
|store|Reconcile|[image](screenshots/store-reconcile.png)|[controls](evidence/runtime-store-reconcile.json)|
|store|Stock|[image](screenshots/store-stock.png)|[controls](evidence/runtime-store-stock.json)|
|store|Stock-tab-Inventory List|[image](screenshots/store-stock-tab-inventory-list.png)|[controls](evidence/runtime-store-stock-tab-inventory-list.json)|
|store|Stock-tab-Low Stock|[image](screenshots/store-stock-tab-low-stock.png)|[controls](evidence/runtime-store-stock-tab-low-stock.json)|
|store|Stock-tab-Stock Movements|[image](screenshots/store-stock-tab-stock-movements.png)|[controls](evidence/runtime-store-stock-tab-stock-movements.json)|
|store|Purchase Orders|[image](screenshots/store-purchase-orders.png)|[controls](evidence/runtime-store-purchase-orders.json)|
|store|Search|[image](screenshots/store-search.png)|[controls](evidence/runtime-store-search.json)|
|store|Search-category-Job Card|[image](screenshots/store-search-category-job-card.png)|[controls](evidence/runtime-store-search-category-job-card.json)|
|store|Search-category-Stock|[image](screenshots/store-search-category-stock.png)|[controls](evidence/runtime-store-search-category-stock.json)|
|tech|My Tasks|[image](screenshots/tech-my-tasks.png)|[controls](evidence/runtime-tech-my-tasks.json)|
|tech|Work Update|[image](screenshots/tech-work-update.png)|[controls](evidence/runtime-tech-work-update.json)|
|tech|QC Prep|[image](screenshots/tech-qc-prep.png)|[controls](evidence/runtime-tech-qc-prep.json)|
|tech|Search|[image](screenshots/tech-search.png)|[controls](evidence/runtime-tech-search.json)|
|tech|Search-category-Job Card|[image](screenshots/tech-search-category-job-card.png)|[controls](evidence/runtime-tech-search-category-job-card.json)|
|accounts|Ready To Invoice|[image](screenshots/accounts-ready-to-invoice.png)|[controls](evidence/runtime-accounts-ready-to-invoice.json)|
|accounts|Invoice|[image](screenshots/accounts-invoice.png)|[controls](evidence/runtime-accounts-invoice.json)|
|accounts|Payment|[image](screenshots/accounts-payment.png)|[controls](evidence/runtime-accounts-payment.json)|
|accounts|Delivery|[image](screenshots/accounts-delivery.png)|[controls](evidence/runtime-accounts-delivery.json)|
|accounts|Search|[image](screenshots/accounts-search.png)|[controls](evidence/runtime-accounts-search.json)|
|accounts|Search-category-Job Card|[image](screenshots/accounts-search-category-job-card.png)|[controls](evidence/runtime-accounts-search-category-job-card.json)|
|accounts|Search-category-Invoice|[image](screenshots/accounts-search-category-invoice.png)|[controls](evidence/runtime-accounts-search-category-invoice.json)|
|admin|Dashboard|[image](screenshots/admin-dashboard.png)|[controls](evidence/runtime-admin-dashboard.json)|
|admin|Advance Bookings|[image](screenshots/admin-advance-bookings.png)|[controls](evidence/runtime-admin-advance-bookings.json)|
|admin|Approvals (0)|[image](screenshots/admin-approvals-0.png)|[controls](evidence/runtime-admin-approvals-0.json)|
|admin|Data Flow|[image](screenshots/admin-data-flow.png)|[controls](evidence/runtime-admin-data-flow.json)|
|admin|Job Cards|[image](screenshots/admin-job-cards.png)|[controls](evidence/runtime-admin-job-cards.json)|
|admin|Media|[image](screenshots/admin-media.png)|[controls](evidence/runtime-admin-media.json)|
|admin|Purchase Orders|[image](screenshots/admin-purchase-orders.png)|[controls](evidence/runtime-admin-purchase-orders.json)|
|admin|Manage|[image](screenshots/admin-manage.png)|[controls](evidence/runtime-admin-manage.json)|
|admin|Manage-tab-Users|[image](screenshots/admin-manage-tab-users.png)|[controls](evidence/runtime-admin-manage-tab-users.json)|
|admin|Manage-tab-Customers|[image](screenshots/admin-manage-tab-customers.png)|[controls](evidence/runtime-admin-manage-tab-customers.json)|
|admin|Manage-tab-Vehicles|[image](screenshots/admin-manage-tab-vehicles.png)|[controls](evidence/runtime-admin-manage-tab-vehicles.json)|
|admin|Manage-tab-Suppliers|[image](screenshots/admin-manage-tab-suppliers.png)|[controls](evidence/runtime-admin-manage-tab-suppliers.json)|
|admin|Manage-tab-Job Cards|[image](screenshots/admin-manage-tab-job-cards.png)|[controls](evidence/runtime-admin-manage-tab-job-cards.json)|
|admin|Manage-tab-Estimates|[image](screenshots/admin-manage-tab-estimates.png)|[controls](evidence/runtime-admin-manage-tab-estimates.json)|
|admin|Manage-tab-Invoices|[image](screenshots/admin-manage-tab-invoices.png)|[controls](evidence/runtime-admin-manage-tab-invoices.json)|
|admin|Manage-tab-Payments|[image](screenshots/admin-manage-tab-payments.png)|[controls](evidence/runtime-admin-manage-tab-payments.json)|
|admin|Manage-tab-Delivery|[image](screenshots/admin-manage-tab-delivery.png)|[controls](evidence/runtime-admin-manage-tab-delivery.json)|
|admin|Search|[image](screenshots/admin-search.png)|[controls](evidence/runtime-admin-search.json)|
|admin|Search-category-Job Card|[image](screenshots/admin-search-category-job-card.png)|[controls](evidence/runtime-admin-search-category-job-card.json)|
|admin|Search-category-Invoice|[image](screenshots/admin-search-category-invoice.png)|[controls](evidence/runtime-admin-search-category-invoice.json)|
|admin|Search-category-Customer|[image](screenshots/admin-search-category-customer.png)|[controls](evidence/runtime-admin-search-category-customer.json)|
|admin|Search-category-Vehicle|[image](screenshots/admin-search-category-vehicle.png)|[controls](evidence/runtime-admin-search-category-vehicle.json)|
|admin|Search-category-Payments|[image](screenshots/admin-search-category-payments.png)|[controls](evidence/runtime-admin-search-category-payments.json)|
|admin|Search-category-Material Requests|[image](screenshots/admin-search-category-material-requests.png)|[controls](evidence/runtime-admin-search-category-material-requests.json)|
|admin|Search-category-Issue Material|[image](screenshots/admin-search-category-issue-material.png)|[controls](evidence/runtime-admin-search-category-issue-material.json)|
|admin|Search-category-Reconcile Stock|[image](screenshots/admin-search-category-reconcile-stock.png)|[controls](evidence/runtime-admin-search-category-reconcile-stock.json)|
|admin|Search-category-Stock|[image](screenshots/admin-search-category-stock.png)|[controls](evidence/runtime-admin-search-category-stock.json)|
|admin|Search-category-Estimate|[image](screenshots/admin-search-category-estimate.png)|[controls](evidence/runtime-admin-search-category-estimate.json)|
|admin|Search-category-Follow-ups|[image](screenshots/admin-search-category-follow-ups.png)|[controls](evidence/runtime-admin-search-category-follow-ups.json)|
|admin|Admin Console|[image](screenshots/admin-admin-console.png)|[controls](evidence/runtime-admin-admin-console.json)|
|admin|Admin Console-tab-Users|[image](screenshots/admin-admin-console-tab-users.png)|[controls](evidence/runtime-admin-admin-console-tab-users.json)|
|admin|Admin Console-tab-Team Structure|[image](screenshots/admin-admin-console-tab-team-structure.png)|[controls](evidence/runtime-admin-admin-console-tab-team-structure.json)|
|admin|Admin Console-tab-Service Task|[image](screenshots/admin-admin-console-tab-service-task.png)|[controls](evidence/runtime-admin-admin-console-tab-service-task.json)|
|admin|Admin Console-tab-Roles & Page Access|[image](screenshots/admin-admin-console-tab-roles-page-access.png)|[controls](evidence/runtime-admin-admin-console-tab-roles-page-access.json)|
|admin|Admin Console-tab-Business Settings|[image](screenshots/admin-admin-console-tab-business-settings.png)|[controls](evidence/runtime-admin-admin-console-tab-business-settings.json)|
|admin|Admin Console-tab-App Theme|[image](screenshots/admin-admin-console-tab-app-theme.png)|[controls](evidence/runtime-admin-admin-console-tab-app-theme.json)|
|admin|Admin Console-tab-Company Settings|[image](screenshots/admin-admin-console-tab-company-settings.png)|[controls](evidence/runtime-admin-admin-console-tab-company-settings.json)|
|admin|Admin Console-tab-Report Templates|[image](screenshots/admin-admin-console-tab-report-templates.png)|[controls](evidence/runtime-admin-admin-console-tab-report-templates.json)|
|admin|Admin Console-tab-Inventory Import|[image](screenshots/admin-admin-console-tab-inventory-import.png)|[controls](evidence/runtime-admin-admin-console-tab-inventory-import.json)|
|admin|Admin Console-tab-Support & Logs|[image](screenshots/admin-admin-console-tab-support-logs.png)|[controls](evidence/runtime-admin-admin-console-tab-support-logs.json)|
|admin|Leads|[image](screenshots/admin-leads.png)|[controls](evidence/runtime-admin-leads.json)|
|admin|Quotations|[image](screenshots/admin-quotations.png)|[controls](evidence/runtime-admin-quotations.json)|
|admin|Quotation Settings|[image](screenshots/admin-quotation-settings.png)|[controls](evidence/runtime-admin-quotation-settings.json)|
|admin|Quotation Settings-tab-Users|[image](screenshots/admin-quotation-settings-tab-users.png)|[controls](evidence/runtime-admin-quotation-settings-tab-users.json)|
|admin|Quotation Settings-tab-Team Structure|[image](screenshots/admin-quotation-settings-tab-team-structure.png)|[controls](evidence/runtime-admin-quotation-settings-tab-team-structure.json)|
|admin|Quotation Settings-tab-Service Task|[image](screenshots/admin-quotation-settings-tab-service-task.png)|[controls](evidence/runtime-admin-quotation-settings-tab-service-task.json)|
|admin|Quotation Settings-tab-Roles & Page Access|[image](screenshots/admin-quotation-settings-tab-roles-page-access.png)|[controls](evidence/runtime-admin-quotation-settings-tab-roles-page-access.json)|
|admin|Quotation Settings-tab-Business Settings|[image](screenshots/admin-quotation-settings-tab-business-settings.png)|[controls](evidence/runtime-admin-quotation-settings-tab-business-settings.json)|
|admin|Quotation Settings-tab-App Theme|[image](screenshots/admin-quotation-settings-tab-app-theme.png)|[controls](evidence/runtime-admin-quotation-settings-tab-app-theme.json)|
|admin|Quotation Settings-tab-Company Settings|[image](screenshots/admin-quotation-settings-tab-company-settings.png)|[controls](evidence/runtime-admin-quotation-settings-tab-company-settings.json)|
|admin|Quotation Settings-tab-Report Templates|[image](screenshots/admin-quotation-settings-tab-report-templates.png)|[controls](evidence/runtime-admin-quotation-settings-tab-report-templates.json)|
|admin|Quotation Settings-tab-Inventory Import|[image](screenshots/admin-quotation-settings-tab-inventory-import.png)|[controls](evidence/runtime-admin-quotation-settings-tab-inventory-import.json)|
|admin|Quotation Settings-tab-Support & Logs|[image](screenshots/admin-quotation-settings-tab-support-logs.png)|[controls](evidence/runtime-admin-quotation-settings-tab-support-logs.json)|
|developer|Tenants|[image](screenshots/developer-tenants.png)|[controls](evidence/runtime-developer-tenants.json)|
|developer|Communications|[image](screenshots/developer-communications.png)|[controls](evidence/runtime-developer-communications.json)|
|developer|Billing|[image](screenshots/developer-billing.png)|[controls](evidence/runtime-developer-billing.json)|

### Dialog inspection

Opened representative add/view/edit dialogs and their cancel/back/close paths in isolated contexts. Full create/update/validation workflows are covered only where named test results demonstrate them. Repeated rows and every role/status/input combination were not exhaustively exercised.

- reception / Today Queue / None / Create New Visit: [image](screenshots/dialog-reception-today-queue-default-create-new-visit.png); [fields](evidence/dialog-reception-today-queue-default-create-new-visit.json)
- reception / Advance Bookings / None /  Create Booking: [image](screenshots/dialog-reception-advance-bookings-default-create-booking.png); [fields](evidence/dialog-reception-advance-bookings-default-create-booking.json)
- reception / Customers / None / Add Customer: [image](screenshots/dialog-reception-customers-default-add-customer.png); [fields](evidence/dialog-reception-customers-default-add-customer.json)
- reception / Customers / None / View: [image](screenshots/dialog-reception-customers-default-view.png); [fields](evidence/dialog-reception-customers-default-view.json)
- reception / Customers / None / Edit: [image](screenshots/dialog-reception-customers-default-edit.png); [fields](evidence/dialog-reception-customers-default-edit.json)
- reception / Vehicles / None / Add Vehicle: [image](screenshots/dialog-reception-vehicles-default-add-vehicle.png); [fields](evidence/dialog-reception-vehicles-default-add-vehicle.json)
- reception / Vehicles / None / View: [image](screenshots/dialog-reception-vehicles-default-view.png); [fields](evidence/dialog-reception-vehicles-default-view.json)
- reception / Vehicles / None / Edit: [image](screenshots/dialog-reception-vehicles-default-edit.png); [fields](evidence/dialog-reception-vehicles-default-edit.json)
- service / My Queue / None / View: [image](screenshots/dialog-service-my-queue-default-view.png); [fields](evidence/dialog-service-my-queue-default-view.json)
- service / My Queue / None / Edit: [image](screenshots/dialog-service-my-queue-default-edit.png); [fields](evidence/dialog-service-my-queue-default-edit.json)
- service / Job Card / None / View: [image](screenshots/dialog-service-job-card-default-view.png); [fields](evidence/dialog-service-job-card-default-view.json)
- service / Job Card / None / Edit: [image](screenshots/dialog-service-job-card-default-edit.png); [fields](evidence/dialog-service-job-card-default-edit.json)
- service / Follow-ups / None / View: [image](screenshots/dialog-service-follow-ups-default-view.png); [fields](evidence/dialog-service-follow-ups-default-view.json)
- service / Follow-ups / None / Add Follow-up: [image](screenshots/dialog-service-follow-ups-default-add-follow-up.png); [fields](evidence/dialog-service-follow-ups-default-add-follow-up.json)
- store / Material Requests / None / Create New Item Request: [image](screenshots/dialog-store-material-requests-default-create-new-item-request.png); [fields](evidence/dialog-store-material-requests-default-create-new-item-request.json)
- store / Stock / None / Edit: [image](screenshots/dialog-store-stock-default-edit.png); [fields](evidence/dialog-store-stock-default-edit.json)
- store / Stock / Inventory List / Edit: [image](screenshots/dialog-store-stock-inventory-list-edit.png); [fields](evidence/dialog-store-stock-inventory-list-edit.json)
- store / Purchase Orders / None /  New Purchase Request: [image](screenshots/dialog-store-purchase-orders-default-new-purchase-request.png); [fields](evidence/dialog-store-purchase-orders-default-new-purchase-request.json)
- accounts / Ready To Invoice / None / View: [image](screenshots/dialog-accounts-ready-to-invoice-default-view.png); [fields](evidence/dialog-accounts-ready-to-invoice-default-view.json)
- accounts / Invoice / None / View: [image](screenshots/dialog-accounts-invoice-default-view.png); [fields](evidence/dialog-accounts-invoice-default-view.json)
- admin / Advance Bookings / None /  Create Booking: [image](screenshots/dialog-admin-advance-bookings-default-create-booking.png); [fields](evidence/dialog-admin-advance-bookings-default-create-booking.json)
- admin / Job Cards / None / Add Job Card: [image](screenshots/dialog-admin-job-cards-default-add-job-card.png); [fields](evidence/dialog-admin-job-cards-default-add-job-card.json)
- admin / Job Cards / None / View: [image](screenshots/dialog-admin-job-cards-default-view.png); [fields](evidence/dialog-admin-job-cards-default-view.json)
- admin / Job Cards / None / Edit: [image](screenshots/dialog-admin-job-cards-default-edit.png); [fields](evidence/dialog-admin-job-cards-default-edit.json)
- admin / Purchase Orders / None /  New Purchase Request: [image](screenshots/dialog-admin-purchase-orders-default-new-purchase-request.png); [fields](evidence/dialog-admin-purchase-orders-default-new-purchase-request.json)
- admin / Manage / None / Add User: [image](screenshots/dialog-admin-manage-default-add-user.png); [fields](evidence/dialog-admin-manage-default-add-user.json)
- admin / Manage / None / Edit: [image](screenshots/dialog-admin-manage-default-edit.png); [fields](evidence/dialog-admin-manage-default-edit.json)
- admin / Manage / Users / Add User: [image](screenshots/dialog-admin-manage-users-add-user.png); [fields](evidence/dialog-admin-manage-users-add-user.json)
- admin / Manage / Users / Edit: [image](screenshots/dialog-admin-manage-users-edit.png); [fields](evidence/dialog-admin-manage-users-edit.json)
- admin / Manage / Customers / Add Customer: [image](screenshots/dialog-admin-manage-customers-add-customer.png); [fields](evidence/dialog-admin-manage-customers-add-customer.json)
- admin / Manage / Customers / View: [image](screenshots/dialog-admin-manage-customers-view.png); [fields](evidence/dialog-admin-manage-customers-view.json)
- admin / Manage / Customers / Edit: [image](screenshots/dialog-admin-manage-customers-edit.png); [fields](evidence/dialog-admin-manage-customers-edit.json)
- admin / Manage / Vehicles / Add Vehicle: [image](screenshots/dialog-admin-manage-vehicles-add-vehicle.png); [fields](evidence/dialog-admin-manage-vehicles-add-vehicle.json)
- admin / Manage / Vehicles / View: [image](screenshots/dialog-admin-manage-vehicles-view.png); [fields](evidence/dialog-admin-manage-vehicles-view.json)
- admin / Manage / Vehicles / Edit: [image](screenshots/dialog-admin-manage-vehicles-edit.png); [fields](evidence/dialog-admin-manage-vehicles-edit.json)
- admin / Manage / Suppliers / Add new supplier: [image](screenshots/dialog-admin-manage-suppliers-add-new-supplier.png); [fields](evidence/dialog-admin-manage-suppliers-add-new-supplier.json)
- admin / Manage / Suppliers / Edit: [image](screenshots/dialog-admin-manage-suppliers-edit.png); [fields](evidence/dialog-admin-manage-suppliers-edit.json)
- admin / Manage / Job Cards / Add Job Card: [image](screenshots/dialog-admin-manage-job-cards-add-job-card.png); [fields](evidence/dialog-admin-manage-job-cards-add-job-card.json)
- admin / Manage / Job Cards / View: [image](screenshots/dialog-admin-manage-job-cards-view.png); [fields](evidence/dialog-admin-manage-job-cards-view.json)
- admin / Manage / Job Cards / Edit: [image](screenshots/dialog-admin-manage-job-cards-edit.png); [fields](evidence/dialog-admin-manage-job-cards-edit.json)
- admin / Manage / Invoices / View: [image](screenshots/dialog-admin-manage-invoices-view.png); [fields](evidence/dialog-admin-manage-invoices-view.json)
- admin / Admin Console / None / Add User: [image](screenshots/dialog-admin-admin-console-default-add-user.png); [fields](evidence/dialog-admin-admin-console-default-add-user.json)
- admin / Admin Console / None / Edit: [image](screenshots/dialog-admin-admin-console-default-edit.png); [fields](evidence/dialog-admin-admin-console-default-edit.json)
- admin / Admin Console / Users / Add User: [image](screenshots/dialog-admin-admin-console-users-add-user.png); [fields](evidence/dialog-admin-admin-console-users-add-user.json)
- admin / Admin Console / Users / Edit: [image](screenshots/dialog-admin-admin-console-users-edit.png); [fields](evidence/dialog-admin-admin-console-users-edit.json)
- admin / Admin Console / Service Task / Add Service Task: [image](screenshots/dialog-admin-admin-console-service-task-add-service-task.png); [fields](evidence/dialog-admin-admin-console-service-task-add-service-task.json)
- admin / Admin Console / Service Task / Edit: [image](screenshots/dialog-admin-admin-console-service-task-edit.png); [fields](evidence/dialog-admin-admin-console-service-task-edit.json)
- admin / Admin Console / Roles & Page Access / Add Role: [image](screenshots/dialog-admin-admin-console-roles-page-access-add-role.png); [fields](evidence/dialog-admin-admin-console-roles-page-access-add-role.json)
- admin / Leads / None / Add Lead: [image](screenshots/dialog-admin-leads-default-add-lead.png); [fields](evidence/dialog-admin-leads-default-add-lead.json)
- admin / Leads / None / Edit: [image](screenshots/dialog-admin-leads-default-edit.png); [fields](evidence/dialog-admin-leads-default-edit.json)
- admin / Quotations / None / New Quotation: [image](screenshots/dialog-admin-quotations-default-new-quotation.png); [fields](evidence/dialog-admin-quotations-default-new-quotation.json)
- admin / Quotations / None / Edit: [image](screenshots/dialog-admin-quotations-default-edit.png); [fields](evidence/dialog-admin-quotations-default-edit.json)
- admin / Quotation Settings / Users / Add User: [image](screenshots/dialog-admin-quotation-settings-users-add-user.png); [fields](evidence/dialog-admin-quotation-settings-users-add-user.json)
- admin / Quotation Settings / Users / Edit: [image](screenshots/dialog-admin-quotation-settings-users-edit.png); [fields](evidence/dialog-admin-quotation-settings-users-edit.json)
- admin / Quotation Settings / Service Task / Add Service Task: [image](screenshots/dialog-admin-quotation-settings-service-task-add-service-task.png); [fields](evidence/dialog-admin-quotation-settings-service-task-add-service-task.json)
- admin / Quotation Settings / Service Task / Edit: [image](screenshots/dialog-admin-quotation-settings-service-task-edit.png); [fields](evidence/dialog-admin-quotation-settings-service-task-edit.json)
- admin / Quotation Settings / Roles & Page Access / Add Role: [image](screenshots/dialog-admin-quotation-settings-roles-page-access-add-role.png); [fields](evidence/dialog-admin-quotation-settings-roles-page-access-add-role.json)

Skipped/disabled/inline actions and capture errors: [evidence/dialog-capture.json](evidence/dialog-capture.json).
## Tests, failures and explicit gaps

Command `npm run test:unit` runs TypeScript checking then the unit suite. ℹ tests 244 / ℹ pass 241 / ℹ fail 3 / ℹ skipped 0 / ℹ duration_ms 15990.1206. Full output: [evidence/unit-results.txt](evidence/unit-results.txt).

- Baseline failure: ✖ defaults seed exactly one active template for every report category
- Baseline failure: ✖ older session JSON hydrates new defaults and repairs active-template invariants
- Baseline failure: ✖ template creation validates names/placeholders and active transfer is immutable


Command `UI_TEST_PORT=5187 npx playwright test --workers=2 --reporter=json` targets the current-source Vite server (not a stale dist build). Results: `{"startTime": "2026-10-20T21:38:25.503Z", "duration": 940202.997, "expected": 50, "skipped": 0, "unexpected": 37, "flaky": 0}`. Full report: [evidence/playwright-results.json](evidence/playwright-results.json).

The 87 browser tests produced **50 passed, 20 failed assertions and 17 timed-out tests**. No retries were marked flaky and no tests were skipped. Failures include My Queue expecting one row but seeing ten, a booking-calendar month mismatch, missing expected pagination/user elements, and workflow timeouts. These observations do not by themselves establish whether the application or test assumptions are wrong.


| Browser test | Actual result |
|---|---|
|Cognito login uses authorization-code PKCE and never renders the demo selector|passed|
|global User Management invites without passwords, persists, polls, edits, resends, and archives|failed|
|authenticated Service Advisor uses API-backed Follow-ups and Search|passed|
|reception@example.com can open every role screen|passed|
|service@example.com can open every role screen|passed|
|store@example.com can open every role screen|passed|
|tech@example.com can open every role screen|passed|
|accounts@example.com can open every role screen|passed|
|admin@example.com can open every role screen|passed|
|service Job Cards uses a one-row table toolbar without customer, advisor, or view controls|passed|
|service My Queue is a responsive active-job table with direct record actions|failed|
|advance bookings are limited to the next two complete months|failed|
|Accounts Ready To Invoice lists only active pending invoices and is read only|passed|
|desktop main content scrolls without moving the navigation rail|passed|
|desktop navigation scrolls independently in a short viewport|passed|
|admin hides customer and vehicle pages from its navigation rail|passed|
|saved Store page access immediately removes Purchase Orders from its inventory navigation|passed|
|admin dashboard presents live metrics in an accessible command-center grid|passed|
|reception creates a linked customer vehicle visit and job searchable after reload|timedOut|
|admin can open the management hub and create a user|failed|
|list filters expose Clear but no Search submit action|passed|
|Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe|passed|
|admin service task subtabs and role filters stay compact on desktop and stack on mobile|passed|
|Management Hub Job Cards filters estimated delivery dates, months, archived records, and clears|passed|
|direct Job Cards uses one clear two-row filter toolbar|passed|
|Job Card entry defaults to a local month with no jobs and Clear shows all months|passed|
|search shows an explicit empty state without an unrelated job|passed|
|service Search retains its four record categories without the underlying page grants|passed|
|search combines entity and lifecycle filters and clears predictably|passed|
|admin Search exposes operational workspaces without restoring hidden rail entries|passed|
|Search gives delegated categories the shared filter grid without changing their filters|passed|
|non-admin Search keeps its existing category availability|passed|
|admin loads the deterministic large dataset and paginates core lists|failed|
|core entity lists switch views and expose deterministic totals|failed|
|media filters use the linked job received date and scope job cards to the advisor|passed|
|mobile lists use cards, compact pagination and no horizontal overflow|failed|
|opening a paginated record and returning preserves list state|timedOut|
|job dialogs expose distinct modes, documents, focus return and shared search entry|passed|
|Job Cards grid uses direct, permission-aware view, edit and archive actions|passed|
|job card document actions stack editors, replace creation actions after save, and download financial PDFs|timedOut|
|customer and vehicle records use distinct view and edit dialogs on every list surface|passed|
|Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states|timedOut|
|Data Flow filters and suggestions stay within a mobile viewport|passed|
|admin management domains expose contextual creation paths|passed|
|Accounts billing lists include records received outside today and print colored documents|passed|
|Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination|passed|
|Manage Job Cards uses view and edit dialogs with documents and confirmed archive|passed|
|admin receives readable duplicate user validation|passed|
|contextual create actions remain visible on mobile role screens|passed|
|store stock and material requests combine search with domain filters|failed|
|stock filter toolbars use no more than two rows above mobile|passed|
|Store cannot bypass the Purchase Order workflow with direct Stock Inward|passed|
|Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests|passed|
|issue and reconcile lists filter by item and reconciliation state|timedOut|
|material record queues use compact rows and issue actions do not open their row|failed|
|store reconciliation states use status pills and shared table actions|failed|
|reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation|timedOut|
|store material queues default to today and keep record filters, exports and workflows in sync|timedOut|
|PDF and Excel downloads use the current filtered rows and visible columns|failed|
|store pagination resets after filtering|passed|
|admin user CRUD persists and protects the signed-in admin|timedOut|
|Team Structure creates departments and manages appointed manager advisor teams responsively|failed|
|company settings validate, preview, reset and persist report assets|passed|
|App Theme previews, saves live UI tokens, and restores the default|passed|
|tax and billing settings validate, normalize, persist, audit and drive invoice print|timedOut|
|report templates preview safely, validate, activate and persist|passed|
|job documents download financial PDFs, print other templated reports and explain blocked popups|failed|
|job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note|failed|
|lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment|timedOut|
|estimate dialog stages item CRUD and persists only on Save|timedOut|
|service advisor Job Card defaults to the current delivery month|passed|
|service follow-ups show all assigned jobs and resolve the earlier open contact|failed|
|job card media validates, compresses, edits, archives, stays session-only, and responds on mobile|passed|
|Developer Console manages demo tenants, messages, billing and writable role emulation|passed|
|linked advisor can change job media while other authorized job viewers are read only|passed|
|fresh demo data provides a multi-supplier price review before PO approval|failed|
|Store creates a Purchase Request without supplier access or later-stage actions|failed|
|Admin can create a Purchase Request|failed|
|Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form|passed|
|Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request|timedOut|
|Admin approves a New Item Request with a supplier, price, and zero-stock SKU|timedOut|
|Admin issues an approved Purchase Order and both roles can see its Supplier Basket context|timedOut|
|job sheet intake fields and damage marks persist through the Job Card edit dialog|failed|
|owner adds, requests and cancels a material row with an over-stock warning|timedOut|
|Store releases a requested row, then Admin edits it as Issued with a note|timedOut|
|estimate approval and invoice creation enable Completed with per-line GST totals|failed|
|searchable pickers dismiss outside interactions and still select options|timedOut|

### Browser failure observations

Raw assertion messages below are inspection findings, not approved clone behavior. Captured browser error contexts are preserved in the linked files following this list.


#### global User Management invites without passwords, persists, polls, edits, resends, and archives

[tests/global-users.spec.ts:62](../tests/global-users.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' }) with timeout 5000ms
  - waiting for locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' })

```


#### service My Queue is a responsive active-job table with direct record actions

[tests/workshopos.spec.ts:86](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr')
Expected: 1
Received: 10
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr') with timeout 5000ms
  - waiting for locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr')
    14 × locator resolved to 10 elements
       - unexpected value "10"

```


#### advance bookings are limited to the next two complete months

[tests/workshopos.spec.ts:127](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveText(expected) failed

Locator:  getByLabel('Booking month calendar').getByRole('heading', { level: 3 })
Expected: "November 2026"
Received: "October 2026"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByLabel('Booking month calendar').getByRole('heading', { level: 3 }) with timeout 5000ms
  - waiting for getByLabel('Booking month calendar').getByRole('heading', { level: 3 })
    13 × locator resolved to <h3>October 2026</h3>
       - unexpected value "October 2026"

```


#### reception creates a linked customer vehicle visit and job searchable after reload

[tests/workshopos.spec.ts:354](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### admin can open the management hub and create a user

[tests/workshopos.spec.ts:448](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByText('e2e.manager@example.com')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('e2e.manager@example.com') with timeout 5000ms
  - waiting for getByText('e2e.manager@example.com')

```


#### admin loads the deterministic large dataset and paginates core lists

[tests/workshopos.spec.ts:935](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByText('Showing 1 to 10 of 144')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Showing 1 to 10 of 144') with timeout 5000ms
  - waiting for getByText('Showing 1 to 10 of 144')

```


#### core entity lists switch views and expose deterministic totals

[tests/workshopos.spec.ts:969](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByText('Showing 1 to 10 of 144')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Showing 1 to 10 of 144') with timeout 5000ms
  - waiting for getByText('Showing 1 to 10 of 144')

```


#### mobile lists use cards, compact pagination and no horizontal overflow

[tests/workshopos.spec.ts:1032](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByText('Page 1 of 15').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Page 1 of 15').first() with timeout 5000ms
  - waiting for getByText('Page 1 of 15').first()

```


#### opening a paginated record and returning preserves list state

[tests/workshopos.spec.ts:1047](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### job card document actions stack editors, replace creation actions after save, and download financial PDFs

[tests/workshopos.spec.ts:1114](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states

[tests/workshopos.spec.ts:1232](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### store stock and material requests combine search with domain filters

[tests/workshopos.spec.ts:1506](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByText('Showing 1 to 10 of 61')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Showing 1 to 10 of 61') with timeout 5000ms
  - waiting for getByText('Showing 1 to 10 of 61')

```


#### issue and reconcile lists filter by item and reconciliation state

[tests/workshopos.spec.ts:1582](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### material record queues use compact rows and issue actions do not open their row

[tests/workshopos.spec.ts:1597](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveClass(expected) failed

Locator: getByRole('table', { name: 'Material Requests results' })
Expected pattern: /store-material-record-table/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" getByRole('table', { name: 'Material Requests results' }) with timeout 5000ms
  - waiting for getByRole('table', { name: 'Material Requests results' })

```


#### store reconciliation states use status pills and shared table actions

[tests/workshopos.spec.ts:1620](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched')
Expected: 2
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched') with timeout 5000ms
  - waiting for getByRole('table', { name: 'Reconcile results' }).locator('.store-material-status-matched')
    14 × locator resolved to 3 elements
       - unexpected value "3"

```


#### reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation

[tests/workshopos.spec.ts:1629](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### store material queues default to today and keep record filters, exports and workflows in sync

[tests/workshopos.spec.ts:1670](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### PDF and Excel downloads use the current filtered rows and visible columns

[tests/workshopos.spec.ts:1732](../tests/workshopos.spec.ts)

```text
Error: expect(received).toHaveLength(expected)

Expected length: 61
Received length: 1
Received array:  [["PPF-ROLL", "Gloss PPF roll", "PPF", 500, "metre", 40, "Rs 0", "In stock"]]
```


#### admin user CRUD persists and protects the signed-in admin

[tests/workshopos.spec.ts:1778](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### Team Structure creates departments and manages appointed manager advisor teams responsively

[tests/workshopos.spec.ts:1800](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toContainText(expected) failed

Locator: locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' })
Expected substring: "Manager · Collision Repair East"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' }) with timeout 5000ms
  - waiting for locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' })

```


#### tax and billing settings validate, normalize, persist, audit and drive invoice print

[tests/workshopos.spec.ts:1920](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### job documents download financial PDFs, print other templated reports and explain blocked popups

[tests/workshopos.spec.ts:2025](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.record-card').first().locator('.doc-chip')
Expected: 4
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.record-card').first().locator('.doc-chip') with timeout 5000ms
  - waiting for locator('.record-card').first().locator('.doc-chip')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```


#### job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note

[tests/workshopos.spec.ts:2058](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' }) with timeout 5000ms
  - waiting for getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' })

```


#### lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment

[tests/workshopos.spec.ts:2085](../tests/workshopos.spec.ts)

```text
Test timeout of 60000ms exceeded.
```


#### estimate dialog stages item CRUD and persists only on Save

[tests/workshopos.spec.ts:2162](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### service follow-ups show all assigned jobs and resolve the earlier open contact

[tests/workshopos.spec.ts:2217](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toContainText(expected) failed

Locator: locator('.service-advisor-list')
Expected substring: "JC-2026-001247"
Received string:    "Follow-upsJobs assigned to youSearchReceived dateMonth-YearAll monthsAugust 2026July 2026June 2026May 2026April 2026March 2026February 2026January 2026Clear DownloadShowing 1 to 10 of 48Per page102050Page 1 of 512345Job CardVehicleCustomerEstimate StatusFollow-up StatusActionsJC-2026-002144OD13DM1012Demo Customer 012ApprovedDone(1)ViewJC-2026-002141OD10DM1009Demo Customer 009ApprovedPending (0/1)Add Follow-upJC-2026-002138OD07DM1006Demo Customer 006ApprovedPending (0/1)Add Follow-upJC-2026-002135OD04DM1003Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002132OD13DM1132Demo Customer 012ApprovedPending (0/1)Add Follow-upJC-2026-002129OD10DM1129Demo Customer 009DraftPending (0/0)Add Follow-upJC-2026-002126OD07DM1126Demo Customer 006ApprovedDone(1)ViewJC-2026-002123OD04DM1123Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002120OD01DM1120Demo Customer 120ApprovedPending (0/1)Add Follow-upJC-2026-002117OD28DM1117Demo Customer 117ApprovedPending (0/1)Add Follow-upPage 1 of 512345"
Timeout: 5000ms

Call log:
  - Expect "toContainText" locator('.service-advisor-list') with timeout 5000ms
  - waiting for locator('.service-advisor-list')
    14 × locator resolved to <section class="entity-list-page service-advisor-list">…</section>
       - unexpected value "Follow-upsJobs assigned to youSearchReceived dateMonth-YearAll monthsAugust 2026July 2026June 2026May 2026April 2026March 2026February 2026January 2026Clear DownloadShowing 1 to 10 of 48Per page102050Page 1 of 512345Job CardVehicleCustomerEstimate StatusFollow-up StatusActionsJC-2026-002144OD13DM1012Demo Customer 012ApprovedDone(1)ViewJC-2026-002141OD10DM1009Demo Customer 009ApprovedPending (0/1)Add Follow-upJC-2026-002138OD07DM1006Demo Customer 006ApprovedPending (0/1)Add Follow-upJC-2026-002135OD04DM1003Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002132OD13DM1132Demo Customer 012ApprovedPending (0/1)Add Follow-upJC-2026-002129OD10DM1129Demo Customer 009DraftPending (0/0)Add Follow-upJC-2026-002126OD07DM1126Demo Customer 006ApprovedDone(1)ViewJC-2026-002123OD04DM1123Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002120OD01DM1120Demo Customer 120ApprovedPending (0/1)Add Follow-upJC-2026-002117OD28DM1117Demo Customer 117ApprovedPending (0/1)Add Follow-upPage 1 of 512345"

```


#### fresh demo data provides a multi-supplier price review before PO approval

[tests/workshopos.spec.ts:2410](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ })
Expected substring: "PO Request"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ }) with timeout 5000ms
  - waiting for getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ })

```


#### Store creates a Purchase Request without supplier access or later-stage actions

[tests/workshopos.spec.ts:2430](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number')
Expected: "PO-WOS-A-00001"
Received: "PO-WOS-A-00003"
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number') with timeout 5000ms
  - waiting for getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number')
    14 × locator resolved to <input disabled readonly aria-label="PO number" value="PO-WOS-A-00003"/>
       - unexpected value "PO-WOS-A-00003"

```


#### Admin can create a Purchase Request

[tests/workshopos.spec.ts:2461](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number')
Expected: "PO-WOS-A-00001"
Received: "PO-WOS-A-00003"
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number') with timeout 5000ms
  - waiting for getByRole('dialog', { name: 'New Purchase Request' }).getByLabel('PO number')
    14 × locator resolved to <input disabled readonly aria-label="PO number" value="PO-WOS-A-00003"/>
       - unexpected value "PO-WOS-A-00003"

```


#### Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request

[tests/workshopos.spec.ts:2489](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### Admin approves a New Item Request with a supplier, price, and zero-stock SKU

[tests/workshopos.spec.ts:2517](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### Admin issues an approved Purchase Order and both roles can see its Supplier Basket context

[tests/workshopos.spec.ts:2550](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### job sheet intake fields and damage marks persist through the Job Card edit dialog

[tests/workshopos.spec.ts:2707](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true }) with timeout 5000ms
  - waiting for getByRole('region', { name: 'Job sheet' }).getByText('2026-10-15', { exact: true })

```


#### owner adds, requests and cancels a material row with an over-stock warning

[tests/workshopos.spec.ts:2752](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### Store releases a requested row, then Admin edits it as Issued with a note

[tests/workshopos.spec.ts:2775](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```


#### estimate approval and invoice creation enable Completed with per-line GST totals

[tests/workshopos.spec.ts:2815](../tests/workshopos.spec.ts)

```text
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.') with timeout 5000ms
  - waiting for getByRole('dialog', { name: /Edit Job/ }).getByText('No invoice yet.')

```


#### searchable pickers dismiss outside interactions and still select options

[tests/workshopos.spec.ts:2842](../tests/workshopos.spec.ts)

```text
Test timeout of 30000ms exceeded.
```

- [global-users-global-User-M-3ab87--edits-resends-and-archives](evidence/browser-test-failures/global-users-global-User-M-3ab87--edits-resends-and-archives.md)
- [workshopos-Admin-approves--56ae8-er-price-and-zero-stock-SKU](evidence/browser-test-failures/workshopos-Admin-approves--56ae8-er-price-and-zero-stock-SKU.md)
- [workshopos-Admin-can-create-a-Purchase-Request](evidence/browser-test-failures/workshopos-Admin-can-create-a-Purchase-Request.md)
- [workshopos-admin-can-open--56275-ement-hub-and-create-a-user](evidence/browser-test-failures/workshopos-admin-can-open--56275-ement-hub-and-create-a-user.md)
- [workshopos-Admin-issues-an-a7542-its-Supplier-Basket-context](evidence/browser-test-failures/workshopos-Admin-issues-an-a7542-its-Supplier-Basket-context.md)
- [workshopos-admin-loads-the-5bc4b-et-and-paginates-core-lists](evidence/browser-test-failures/workshopos-admin-loads-the-5bc4b-et-and-paginates-core-lists.md)
- [workshopos-Admin-records-o-4d202-view-for-a-New-Item-Request](evidence/browser-test-failures/workshopos-Admin-records-o-4d202-view-for-a-New-Item-Request.md)
- [workshopos-admin-user-CRUD-6127c-rotects-the-signed-in-admin](evidence/browser-test-failures/workshopos-admin-user-CRUD-6127c-rotects-the-signed-in-admin.md)
- [workshopos-advance-booking-1dd93-he-next-two-complete-months](evidence/browser-test-failures/workshopos-advance-booking-1dd93-he-next-two-complete-months.md)
- [workshopos-core-entity-lis-af8ee-expose-deterministic-totals](evidence/browser-test-failures/workshopos-core-entity-lis-af8ee-expose-deterministic-totals.md)
- [workshopos-Data-Flow-casca-c354a--empty-clear-and-PDF-states](evidence/browser-test-failures/workshopos-Data-Flow-casca-c354a--empty-clear-and-PDF-states.md)
- [workshopos-estimate-approv-e6ff1-ed-with-per-line-GST-totals](evidence/browser-test-failures/workshopos-estimate-approv-e6ff1-ed-with-per-line-GST-totals.md)
- [workshopos-estimate-dialog-1c756-D-and-persists-only-on-Save](evidence/browser-test-failures/workshopos-estimate-dialog-1c756-D-and-persists-only-on-Save.md)
- [workshopos-fresh-demo-data-0f1da-e-review-before-PO-approval](evidence/browser-test-failures/workshopos-fresh-demo-data-0f1da-e-review-before-PO-approval.md)
- [workshopos-issue-and-recon-fad5f-em-and-reconciliation-state](evidence/browser-test-failures/workshopos-issue-and-recon-fad5f-em-and-reconciliation-state.md)
- [workshopos-job-card-docume-c987b-and-download-financial-PDFs](evidence/browser-test-failures/workshopos-job-card-docume-c987b-and-download-financial-PDFs.md)
- [workshopos-job-documents-d-0f51d--and-explain-blocked-popups](evidence/browser-test-failures/workshopos-job-documents-d-0f51d--and-explain-blocked-popups.md)
- [workshopos-job-lifecycle-e-c5c5e-equires-a-confirmation-note](evidence/browser-test-failures/workshopos-job-lifecycle-e-c5c5e-equires-a-confirmation-note.md)
- [workshopos-job-sheet-intak-ab820-gh-the-Job-Card-edit-dialog](evidence/browser-test-failures/workshopos-job-sheet-intak-ab820-gh-the-Job-Card-edit-dialog.md)
- [workshopos-lifecycle-surfa-3cb2c-ames-and-mobile-containment](evidence/browser-test-failures/workshopos-lifecycle-surfa-3cb2c-ames-and-mobile-containment.md)
- [workshopos-material-record-5dfd1-tions-do-not-open-their-row](evidence/browser-test-failures/workshopos-material-record-5dfd1-tions-do-not-open-their-row.md)
- [workshopos-mobile-lists-us-c5e06--and-no-horizontal-overflow](evidence/browser-test-failures/workshopos-mobile-lists-us-c5e06--and-no-horizontal-overflow.md)
- [workshopos-opening-a-pagin-d3f15-urning-preserves-list-state](evidence/browser-test-failures/workshopos-opening-a-pagin-d3f15-urning-preserves-list-state.md)
- [workshopos-owner-adds-requ-78411--with-an-over-stock-warning](evidence/browser-test-failures/workshopos-owner-adds-requ-78411--with-an-over-stock-warning.md)
- [workshopos-PDF-and-Excel-d-7203a-ed-rows-and-visible-columns](evidence/browser-test-failures/workshopos-PDF-and-Excel-d-7203a-ed-rows-and-visible-columns.md)
- [workshopos-reception-creat-ce7de-job-searchable-after-reload](evidence/browser-test-failures/workshopos-reception-creat-ce7de-job-searchable-after-reload.md)
- [workshopos-reconciliation--654a0-nd-preserves-row-navigation](evidence/browser-test-failures/workshopos-reconciliation--654a0-nd-preserves-row-navigation.md)
- [workshopos-searchable-pick-254cf-ns-and-still-select-options](evidence/browser-test-failures/workshopos-searchable-pick-254cf-ns-and-still-select-options.md)
- [workshopos-service-follow--c7292-ve-the-earlier-open-contact](evidence/browser-test-failures/workshopos-service-follow--c7292-ve-the-earlier-open-contact.md)
- [workshopos-service-My-Queu-39c24--with-direct-record-actions](evidence/browser-test-failures/workshopos-service-My-Queu-39c24--with-direct-record-actions.md)
- [workshopos-Store-creates-a-6ac38-cess-or-later-stage-actions](evidence/browser-test-failures/workshopos-Store-creates-a-6ac38-cess-or-later-stage-actions.md)
- [workshopos-store-material--1d611-ports-and-workflows-in-sync](evidence/browser-test-failures/workshopos-store-material--1d611-ports-and-workflows-in-sync.md)
- [workshopos-store-reconcili-6b7f0-ls-and-shared-table-actions](evidence/browser-test-failures/workshopos-store-reconcili-6b7f0-ls-and-shared-table-actions.md)
- [workshopos-Store-releases--0d075-ts-it-as-Issued-with-a-note](evidence/browser-test-failures/workshopos-Store-releases--0d075-ts-it-as-Issued-with-a-note.md)
- [workshopos-store-stock-and-6aa28--search-with-domain-filters](evidence/browser-test-failures/workshopos-store-stock-and-6aa28--search-with-domain-filters.md)
- [workshopos-tax-and-billing-2883f-dit-and-drive-invoice-print](evidence/browser-test-failures/workshopos-tax-and-billing-2883f-dit-and-drive-invoice-print.md)
- [workshopos-Team-Structure--3261c--advisor-teams-responsively](evidence/browser-test-failures/workshopos-Team-Structure--3261c--advisor-teams-responsively.md)

Explicit remaining gaps / risks:

- Existing personal browser session: browser and exact URL unidentified; no capture/export, no comparison with shipped/runtime defaults. Do not label fixture restoration as personal-data recovery.
- Full combinatorial coverage: every extracted declaration is accounted for below, but every instantiated control, input error, archive/void status, role grant, handoff and dialog combination has not been exercised. Controls lacking named runtime/test evidence remain SOURCE/UNVERIFIED. Static extraction may not discover UI dynamically generated outside the matched JSX/control patterns; all component implementations are preserved for review.
- Backend/Cognito/PostgreSQL: no live authenticated server integration, tenant isolation, real communications, cross-device persistence or production deployment was verified. Mocked browser tests are not live server verification. Remote-only fields and errors are source-backed requirements candidates requiring confirmation against the intended deployed mode.
- Screenshots establish this local checkout’s appearance. No approved pixel baseline was replaced, and no complete visual-diff comparison was performed. UI regression status is **unverified as a full regression claim**.
- Uploaded in-memory media from the inaccessible personal browser remains unavailable.
- Exact backup restore equality is verified. Normal application startup changes updated_at on 52 invoices again; all other captured fields match in the new-context restoration check. No FK constraints are declared; the separate 100-mapping audit is the relationship evidence, with sentinel and semantic limitations above.
- Existing unit/browser failures must be triaged as stale tests, fixture dependence, date sensitivity or application defects before clone acceptance. Do not silently turn failed behavior into a desired requirement.
- Documentation-only scope: no application source, backend, schema, migration or approved workflow implementation was intentionally changed; no commit/push or production data operation was performed. Next action is to review this inventory, resolve the blocked session and baseline discrepancies, and approve the next migration stage separately.

## Source evidence and reproducibility

- [Source hashes](evidence/source-hashes.json)
- [Exact component bodies including private event handlers/defaults](evidence/component-implementations.md)
- [344 exported operation implementations and dependencies](evidence/evidence-operation-contracts.md)
- [Types, statuses, default constants and enumerations](evidence/evidence-types-and-constants.md)
- [Test declaration inventory](evidence/evidence-test-index.md)
- [Storage discovery](evidence/clone-storage-graft.txt)
- [Routing discovery](evidence/clone-routing-graft.txt)
- [Workflow discovery](evidence/workflow-graft.txt)
- [Developer discovery](evidence/developer-graft.txt)
- [Private validation/calculation helpers and callbacks](evidence/private-helper-contracts.md)
- [Preserved CSS baseline](evidence/styles-baseline.css); source [src/styles.css](../src/styles.css). Source hashes also cover package/lockfile and Vite/Playwright configuration; use those pinned dependencies when reproducing layout.

Reproduce from repository root with the existing dependencies: start `npx vite --host 127.0.0.1 --port 5187 --strictPort`; run `node data-migration/scripts/extract-source.mjs`, `node data-migration/scripts/extract-contracts.mjs`, `node data-migration/scripts/capture.mjs`, `node data-migration/scripts/capture-loaded-settings.mjs`, `python data-migration/scripts/inventory.py`, `python data-migration/scripts/check-relationships.py`, `node data-migration/scripts/capture-dialogs.mjs`, the unit/browser commands above, then `python data-migration/scripts/build-document.py`. `verify-browser-restore.mjs` repeats just the browser restoration check. Capture scripts launch isolated headless browsers and do not attach to personal profiles. Review changed source hashes before treating regenerated evidence as the same baseline.

## Component / conditional-screen inventory

This includes nested dialogs, shared controls, remote-only surfaces and legacy declarations. The exact implementation link includes private handlers and component state defaults. A component listing is SOURCE evidence; runtime status is established only by the screenshot/test indexes above.

| Component | Source span | Extracted controls | Forms | Explicit state declarations |
|---|---|---:|---:|---:|

|`AdminConsole`|[src/admin-console.tsx:116-288](../src/admin-console.tsx)|3|0|3|
|`TeamStructureTab`|[src/admin-console.tsx:290-301](../src/admin-console.tsx)|1|0|1|
|`TeamStructureHeader`|[src/admin-console.tsx:303-305](../src/admin-console.tsx)|1|0|0|
|`LocalTeamStructure`|[src/admin-console.tsx:307-336](../src/admin-console.tsx)|6|1|0|
|`DepartmentRenameDialog`|[src/admin-console.tsx:338-341](../src/admin-console.tsx)|5|1|1|
|`DepartmentTable`|[src/admin-console.tsx:343-346](../src/admin-console.tsx)|3|0|0|
|`DepartmentTeamPanel`|[src/admin-console.tsx:349-352](../src/admin-console.tsx)|7|0|0|
|`RemoteTeamStructure`|[src/admin-console.tsx:354-364](../src/admin-console.tsx)|8|1|1|
|`RemoteDepartmentTeamPanel`|[src/admin-console.tsx:366-370](../src/admin-console.tsx)|7|0|0|
|`ServiceTaskCatalog`|[src/admin-console.tsx:380-527](../src/admin-console.tsx)|10|0|6|
|`CatalogRow`|[src/admin-console.tsx:529-576](../src/admin-console.tsx)|2|0|0|
|`CatalogServiceTaskDialog`|[src/admin-console.tsx:583-715](../src/admin-console.tsx)|12|1|2|
|`CatalogMasterList`|[src/admin-console.tsx:717-720](../src/admin-console.tsx)|4|0|0|
|`CatalogMasterDialog`|[src/admin-console.tsx:722-727](../src/admin-console.tsx)|4|1|2|
|`RolesPageAccessTab`|[src/admin-console.tsx:729-1208](../src/admin-console.tsx)|28|2|2|
|`GroupFieldset`|[src/admin-console.tsx:1210-1268](../src/admin-console.tsx)|2|0|0|
|`AppThemeTab`|[src/admin-console.tsx:1272-1449](../src/admin-console.tsx)|8|0|1|
|`BusinessSettingsTab`|[src/admin-console.tsx:1476-2166](../src/admin-console.tsx)|47|0|4|
|`CompanyImageField`|[src/admin-console.tsx:2202-2271](../src/admin-console.tsx)|2|0|0|
|`CompanySettingsTab`|[src/admin-console.tsx:2273-2454](../src/admin-console.tsx)|11|0|2|
|`ReportTemplatesTab`|[src/admin-console.tsx:2462-2787](../src/admin-console.tsx)|8|0|4|
|`InventoryImportTab`|[src/admin-console.tsx:2806-3151](../src/admin-console.tsx)|10|0|1|
|`LogTable`|[src/admin-console.tsx:3163-3212](../src/admin-console.tsx)|1|0|0|
|`LogsPanel`|[src/admin-console.tsx:3214-3424](../src/admin-console.tsx)|12|0|2|
|`RetentionSettingsPanel`|[src/admin-console.tsx:3426-3521](../src/admin-console.tsx)|4|0|1|
|`SupportLogsTab`|[src/admin-console.tsx:3523-3580](../src/admin-console.tsx)|2|0|3|
|`App`|[src/App.tsx:578-1320](../src/App.tsx)|13|0|0|
|`JobCardNotificationDialog`|[src/App.tsx:1322-1363](../src/App.tsx)|2|0|1|
|`LoginScreen`|[src/App.tsx:1365-1452](../src/App.tsx)|6|1|0|
|`RoleWorkspace`|[src/App.tsx:1459-1761](../src/App.tsx)|9|0|0|
|`SearchPortal`|[src/App.tsx:1772-2203](../src/App.tsx)|16|0|1|
|`AdminSearchOperationalWorkspace`|[src/App.tsx:2205-2259](../src/App.tsx)|0|0|0|
|`SearchResultsTable`|[src/App.tsx:2261-2369](../src/App.tsx)|2|0|0|
|`PaymentSearchResultsTable`|[src/App.tsx:2371-2423](../src/App.tsx)|2|0|0|
|`StockSearchResultsTable`|[src/App.tsx:2425-2504](../src/App.tsx)|2|0|0|
|`Kpis`|[src/App.tsx:2506-2550](../src/App.tsx)|0|0|0|
|`Kpi`|[src/App.tsx:2552-2568](../src/App.tsx)|0|0|0|
|`Reception`|[src/App.tsx:2570-2715](../src/App.tsx)|6|0|1|
|`BookingOperations`|[src/App.tsx:2718-2746](../src/App.tsx)|1|0|0|
|`AdvisorAttendancePanel`|[src/App.tsx:2748-2881](../src/App.tsx)|5|0|0|
|`ReceptionQueueRows`|[src/App.tsx:2883-3042](../src/App.tsx)|5|0|1|
|`CreateVisitDialog`|[src/App.tsx:3056-3565](../src/App.tsx)|27|1|8|
|`ServiceAdvisor`|[src/App.tsx:3567-3637](../src/App.tsx)|0|0|0|
|`ServiceAdvisorList`|[src/App.tsx:3641-4110](../src/App.tsx)|21|0|1|
|`ServiceEstimateDialog`|[src/App.tsx:4112-4159](../src/App.tsx)|2|0|1|
|`ServiceFollowupDialog`|[src/App.tsx:4161-4551](../src/App.tsx)|21|2|2|
|`MaterialProcurementTriage`|[src/App.tsx:4553-4634](../src/App.tsx)|4|0|0|
|`StoreDesk`|[src/App.tsx:4636-4926](../src/App.tsx)|19|0|3|
|`PurchaseStockIssueEditor`|[src/App.tsx:4928-5084](../src/App.tsx)|10|1|1|
|`PurchaseOrdersWorkspace`|[src/App.tsx:5110-5964](../src/App.tsx)|52|0|5|
|`PurchaseOrderLifecycle`|[src/App.tsx:5966-5997](../src/App.tsx)|0|0|0|
|`SupplierBasket`|[src/App.tsx:5999-6028](../src/App.tsx)|0|0|0|
|`PreviousPriceReview`|[src/App.tsx:6030-6060](../src/App.tsx)|7|0|0|
|`LegacyInwardPurchasesWorkspace`|[src/App.tsx:6062-6761](../src/App.tsx)|25|1|0|
|`InwardPurchasesWorkspace`|[src/App.tsx:6763-7475](../src/App.tsx)|26|0|2|
|`ReceiptLines`|[src/App.tsx:7477-7602](../src/App.tsx)|6|0|0|
|`PurchaseSnapshot`|[src/App.tsx:7604-7672](../src/App.tsx)|0|0|0|
|`AttachmentItem`|[src/App.tsx:7674-7708](../src/App.tsx)|2|0|0|
|`SupplierMasterWorkspace`|[src/App.tsx:7710-7927](../src/App.tsx)|12|1|1|
|`StockMovementHistory`|[src/App.tsx:7929-8121](../src/App.tsx)|8|0|1|
|`StoreList`|[src/App.tsx:8167-8983](../src/App.tsx)|21|0|0|
|`Technician`|[src/App.tsx:8985-9088](../src/App.tsx)|4|0|0|
|`Accounts`|[src/App.tsx:9090-9125](../src/App.tsx)|0|0|0|
|`MaterialApprovalQueue`|[src/App.tsx:9127-9312](../src/App.tsx)|7|0|2|
|`Admin`|[src/App.tsx:9314-9442](../src/App.tsx)|5|0|0|
|`OperationalDashboard`|[src/App.tsx:9461-9848](../src/App.tsx)|4|0|0|
|`ManagementHub`|[src/App.tsx:9863-9998](../src/App.tsx)|4|0|3|
|`CustomerManager`|[src/App.tsx:10000-10212](../src/App.tsx)|12|0|2|
|`VehicleManager`|[src/App.tsx:10214-10435](../src/App.tsx)|12|0|2|
|`VisitJobManager`|[src/App.tsx:10437-10708](../src/App.tsx)|14|0|1|
|`EstimateManager`|[src/App.tsx:10710-10731](../src/App.tsx)|0|0|1|
|`TaskQcManager`|[src/App.tsx:10733-10780](../src/App.tsx)|3|0|2|
|`InventoryMaterialsManager`|[src/App.tsx:10782-10899](../src/App.tsx)|9|0|3|
|`UserManager`|[src/App.tsx:10901-11221](../src/App.tsx)|19|1|2|
|`RemoteUserManager`|[src/App.tsx:11228-11604](../src/App.tsx)|17|1|2|
|`DuplicateJobSnapshot`|[src/App.tsx:11606-11626](../src/App.tsx)|0|0|0|
|`LinkedRecords`|[src/App.tsx:11628-11649](../src/App.tsx)|0|0|0|
|`CustomerEditor`|[src/App.tsx:11651-11739](../src/App.tsx)|7|1|0|
|`VehicleMasterPanel`|[src/App.tsx:11741-11885](../src/App.tsx)|10|1|0|
|`DuplicateVisitEditor`|[src/App.tsx:11887-11976](../src/App.tsx)|8|1|0|
|`AdminJobEditor`|[src/App.tsx:12000-12008](../src/App.tsx)|1|0|0|
|`JobEditor`|[src/App.tsx:12010-12281](../src/App.tsx)|17|1|2|
|`JobLifecyclePanel`|[src/App.tsx:12283-12583](../src/App.tsx)|8|1|3|
|`ApproveEstimateDialog`|[src/App.tsx:12585-12641](../src/App.tsx)|4|1|2|
|`EstimateEditor`|[src/App.tsx:12660-12724](../src/App.tsx)|2|0|0|
|`EstimateDialog`|[src/App.tsx:12740-12960](../src/App.tsx)|13|1|2|
|`FollowupEditor`|[src/App.tsx:12962-13058](../src/App.tsx)|8|1|0|
|`JobMediaPanel`|[src/App.tsx:13060-13383](../src/App.tsx)|14|2|6|
|`MediaMetadataDialog`|[src/App.tsx:13385-13461](../src/App.tsx)|5|1|2|
|`MaterialRequestEditor`|[src/App.tsx:13463-13845](../src/App.tsx)|20|1|1|
|`IssueMaterialEditor`|[src/App.tsx:13847-13861](../src/App.tsx)|0|0|0|
|`ReleaseMaterialDialog`|[src/App.tsx:13863-13931](../src/App.tsx)|3|0|3|
|`MaterialApprovalSubmitDialog`|[src/App.tsx:13933-13982](../src/App.tsx)|3|0|2|
|`ReconcileEditor`|[src/App.tsx:13984-14174](../src/App.tsx)|8|1|2|
|`QuickAddStock`|[src/App.tsx:14187-14467](../src/App.tsx)|16|1|1|
|`EditStockDetailsDialog`|[src/App.tsx:14469-14610](../src/App.tsx)|10|1|2|
|`InventoryEditor`|[src/App.tsx:14612-14829](../src/App.tsx)|14|1|0|
|`TaskCreator`|[src/App.tsx:14831-14885](../src/App.tsx)|4|1|0|
|`QcEditor`|[src/App.tsx:14887-14940](../src/App.tsx)|5|0|0|
|`ReadyToInvoiceDraft`|[src/App.tsx:14942-15036](../src/App.tsx)|1|0|1|
|`DataFlowWorkspace`|[src/App.tsx:15038-15234](../src/App.tsx)|5|0|1|
|`DocumentDownloadButton`|[src/App.tsx:15236-15339](../src/App.tsx)|2|0|1|
|`DataFlow`|[src/App.tsx:15341-15343](../src/App.tsx)|0|0|0|
|`DataFlowLine`|[src/App.tsx:15345-15487](../src/App.tsx)|2|0|0|
|`JobDocuments`|[src/App.tsx:15491-15633](../src/App.tsx)|9|0|0|
|`AddJobCardDialog`|[src/App.tsx:15635-15947](../src/App.tsx)|18|1|4|
|`JobBodyMarkPanel`|[src/App.tsx:15949-16014](../src/App.tsx)|2|0|1|
|`JobRecordDialog`|[src/App.tsx:16016-16258](../src/App.tsx)|10|0|5|
|`JobTaskListPanel`|[src/App.tsx:16260-16488](../src/App.tsx)|10|0|1|
|`CustomerRecordDialog`|[src/App.tsx:16490-16558](../src/App.tsx)|2|0|1|
|`VehicleRecordDialog`|[src/App.tsx:16560-16634](../src/App.tsx)|2|0|1|
|`Timeline`|[src/App.tsx:16636-16671](../src/App.tsx)|0|0|0|
|`JobSnapshot`|[src/App.tsx:16673-16691](../src/App.tsx)|0|0|0|
|`VisitEditor`|[src/App.tsx:16693-16756](../src/App.tsx)|2|0|0|
|`DuplicateCustomerEditor`|[src/App.tsx:16758-16826](../src/App.tsx)|5|0|0|
|`DuplicateVehicleMasterPanel`|[src/App.tsx:16828-16937](../src/App.tsx)|8|0|0|
|`DuplicateEstimateEditor`|[src/App.tsx:16939-17017](../src/App.tsx)|5|0|0|
|`DuplicateFollowupEditor`|[src/App.tsx:17019-17081](../src/App.tsx)|4|0|0|
|`DuplicateTimeline`|[src/App.tsx:17083-17094](../src/App.tsx)|0|0|0|
|`DuplicateJobEditor`|[src/App.tsx:17096-17195](../src/App.tsx)|6|0|0|
|`DuplicateLinkedRecords`|[src/App.tsx:17197-17207](../src/App.tsx)|0|0|0|
|`DuplicateInventoryEditor`|[src/App.tsx:17209-17316](../src/App.tsx)|8|0|0|
|`DuplicateMaterialRequestEditor`|[src/App.tsx:17318-17326](../src/App.tsx)|0|0|0|
|`DuplicateReconcileEditor`|[src/App.tsx:17328-17395](../src/App.tsx)|5|0|0|
|`DuplicateTaskCreator`|[src/App.tsx:17397-17435](../src/App.tsx)|2|0|0|
|`DuplicateQcEditor`|[src/App.tsx:17437-17490](../src/App.tsx)|4|0|0|
|`DuplicateInvoiceSummary`|[src/App.tsx:17492-17509](../src/App.tsx)|0|0|0|
|`DuplicateDataFlow`|[src/App.tsx:17511-17534](../src/App.tsx)|0|0|0|
|`JobCardFilterFields`|[src/App.tsx:17558-17593](../src/App.tsx)|9|0|0|
|`EntityList`|[src/App.tsx:17595-18618](../src/App.tsx)|33|0|1|
|`ViewModeToggle`|[src/App.tsx:18642-18667](../src/App.tsx)|2|0|0|
|`ListExportControls`|[src/App.tsx:18669-18680](../src/App.tsx)|1|0|0|
|`MediaKpis`|[src/App.tsx:18682-18702](../src/App.tsx)|0|0|0|
|`EntityResults`|[src/App.tsx:18704-18900](../src/App.tsx)|4|0|0|
|`RecordActions`|[src/App.tsx:18902-18956](../src/App.tsx)|3|0|0|
|`CustomerDetail`|[src/App.tsx:18957-18966](../src/App.tsx)|0|0|0|
|`EntityTableRow`|[src/App.tsx:18983-19083](../src/App.tsx)|1|0|0|
|`DocumentChips`|[src/App.tsx:19093-19135](../src/App.tsx)|0|0|0|
|`JobRows`|[src/App.tsx:19137-19168](../src/App.tsx)|1|0|0|
|`FilterableJobRows`|[src/App.tsx:19170-19451](../src/App.tsx)|13|0|0|
|`ReadyToInvoiceRows`|[src/App.tsx:19453-19498](../src/App.tsx)|1|0|0|
|`PanelTitle`|[src/App.tsx:19500-19518](../src/App.tsx)|0|0|0|
|`Info`|[src/App.tsx:19520-19533](../src/App.tsx)|0|0|0|
|`Status`|[src/App.tsx:19535-19552](../src/App.tsx)|0|0|0|
|`BillingManager`|[src/billing-manager.tsx:117-195](../src/billing-manager.tsx)|19|0|1|
|`AccountsReconciliationQueues`|[src/billing-manager.tsx:197-208](../src/billing-manager.tsx)|0|0|0|
|`BillingDetail`|[src/billing-manager.tsx:211-230](../src/billing-manager.tsx)|2|0|0|
|`InlineVoid`|[src/billing-manager.tsx:232-249](../src/billing-manager.tsx)|5|1|1|
|`RecordPaymentForm`|[src/billing-manager.tsx:252-268](../src/billing-manager.tsx)|7|1|1|
|`InvoiceDialog`|[src/billing-manager.tsx:280-328](../src/billing-manager.tsx)|17|1|3|
|`PaymentDialog`|[src/billing-manager.tsx:331-338](../src/billing-manager.tsx)|1|0|1|
|`JobInvoicePanel`|[src/billing-manager.tsx:341-363](../src/billing-manager.tsx)|5|0|2|
|`VoidReasonDialog`|[src/billing-manager.tsx:365-378](../src/billing-manager.tsx)|4|1|2|
|`JobPaymentPanel`|[src/billing-manager.tsx:381-398](../src/billing-manager.tsx)|2|0|0|
|`BodyMarkDiagram`|[src/body-mark.tsx:60-79](../src/body-mark.tsx)|3|0|1|
|`BookingCalendar`|[src/booking-calendar.tsx:28-46](../src/booking-calendar.tsx)|26|2|5|
|`BookingCheckInDialog`|[src/booking-check-in.tsx:12-50](../src/booking-check-in.tsx)|15|1|2|
|`ExpectedTodayBookings`|[src/booking-expected-today.tsx:25-104](../src/booking-expected-today.tsx)|15|1|2|
|`DeveloperConsole`|[src/developer-console.tsx:5-19](../src/developer-console.tsx)|11|0|2|
|`TenantCreate`|[src/developer-console.tsx:21-21](../src/developer-console.tsx)|3|1|0|
|`TenantProfileForm`|[src/developer-console.tsx:22-22](../src/developer-console.tsx)|3|1|0|
|`Billing`|[src/developer-console.tsx:23-23](../src/developer-console.tsx)|7|1|0|
|`DocumentDownloadButton`|[src/document-download.tsx:9-27](../src/document-download.tsx)|2|0|1|
|`JobPicker`|[src/job-picker.tsx:14-23](../src/job-picker.tsx)|4|0|1|
|`Row`|[src/job-sheet-ui.tsx:7-9](../src/job-sheet-ui.tsx)|0|0|0|
|`EstimatedDeliveryRow`|[src/job-sheet-ui.tsx:11-32](../src/job-sheet-ui.tsx)|3|1|1|
|`DamageDiagram`|[src/job-sheet-ui.tsx:34-55](../src/job-sheet-ui.tsx)|2|0|0|
|`JobSheetSection`|[src/job-sheet-ui.tsx:57-103](../src/job-sheet-ui.tsx)|9|1|1|
|`LocalSalesWorkspace`|[src/local-sales.tsx:21-32](../src/local-sales.tsx)|14|0|2|
|`InventoryPicker`|[src/materials-ui.tsx:9-23](../src/materials-ui.tsx)|2|0|0|
|`MaterialRow`|[src/materials-ui.tsx:25-30](../src/materials-ui.tsx)|9|0|2|
|`PurchaseRequestTable`|[src/materials-ui.tsx:32-35](../src/materials-ui.tsx)|0|0|0|
|`JobMaterialsPanel`|[src/materials-ui.tsx:37-42](../src/materials-ui.tsx)|8|1|1|
|`PaginationToolbar`|[src/pagination-toolbar.tsx:19-28](../src/pagination-toolbar.tsx)|2|0|0|
|`ResultPagination`|[src/pagination-toolbar.tsx:30-46](../src/pagination-toolbar.tsx)|5|0|0|
|`QuotationTotals`|[src/quotation-dialog.tsx:16-19](../src/quotation-dialog.tsx)|0|0|0|
|`CatalogDescriptionCombobox`|[src/quotation-dialog.tsx:21-29](../src/quotation-dialog.tsx)|2|0|1|
|`QuotationEditorDialog`|[src/quotation-dialog.tsx:31-47](../src/quotation-dialog.tsx)|14|1|2|
|`QuotationOutputControls`|[src/quotation-dialog.tsx:51-51](../src/quotation-dialog.tsx)|2|0|0|
|`QuotationDownloadButton`|[src/quotation-dialog.tsx:52-52](../src/quotation-dialog.tsx)|1|0|0|
|`QuotationDetailsDialog`|[src/quotation-dialog.tsx:53-53](../src/quotation-dialog.tsx)|2|0|2|
|`QuotationFilterBar`|[src/quotation-filter-bar.tsx:3-5](../src/quotation-filter-bar.tsx)|4|0|0|
|`RemoteFinanceWorkspace`|[src/remote-finance.tsx:12-81](../src/remote-finance.tsx)|17|0|1|
|`InvoiceRows`|[src/remote-finance.tsx:83-86](../src/remote-finance.tsx)|4|0|0|
|`RemoteFollowupsWorkspace`|[src/remote-followups.tsx:9-75](../src/remote-followups.tsx)|14|2|2|
|`RemoteSalesWorkspace`|[src/remote-sales.tsx:18-30](../src/remote-sales.tsx)|6|0|1|
|`QuotationWorkspace`|[src/remote-sales.tsx:32-41](../src/remote-sales.tsx)|9|0|1|
|`SalesLeadDialog`|[src/sales-lead-dialog.tsx:26-55](../src/sales-lead-dialog.tsx)|17|1|1|
|`SalesLeadFilterBar`|[src/sales-lead-register.tsx:69-94](../src/sales-lead-register.tsx)|4|0|0|
|`SalesLeadRegister`|[src/sales-lead-register.tsx:96-126](../src/sales-lead-register.tsx)|7|0|0|
|`FilterClearButton`|[src/ui-kit.tsx:6-8](../src/ui-kit.tsx)|1|0|0|
|`ListSearchActions`|[src/ui-kit.tsx:10-12](../src/ui-kit.tsx)|1|0|0|
|`Switch`|[src/ui-kit.tsx:14-18](../src/ui-kit.tsx)|1|0|0|
|`PageSizeSelect`|[src/ui-kit.tsx:20-22](../src/ui-kit.tsx)|1|0|0|
|`DownloadMenu`|[src/ui-kit.tsx:24-40](../src/ui-kit.tsx)|3|0|0|
|`Dialog`|[src/ui-kit.tsx:57-84](../src/ui-kit.tsx)|2|0|1|
|`SearchSelect`|[src/ui-kit.tsx:106-114](../src/ui-kit.tsx)|2|0|0|

## Full declaration ledger — fields, actions, forms and conditional states

This ledger intentionally preserves exact JSX expressions rather than guessing resolved values. `value`, `checked`, `required`, `disabled`, `min`, `max`, `step`, `accept`, event handlers and conditional visibility are part of the clone contract. For a state variable’s initial value and private submit validation, follow the owning component in the exact implementation evidence. For handler functions that persist data, follow the operation contracts. Dynamic `.map()` declarations instantiate one control per runtime option/record; the rendered evidence captures concrete default options. Presence here alone does not assert successful execution or required reachability.

All entries below are SOURCE; runtime/action verification is limited to the named capture/test evidence. Identifiers use source line plus a suffix when multiple declarations occupy a minified source line.


### src/App.tsx

#### ACT-App-tsx-983-1

Owner `App`; [src/App.tsx:983](../src/App.tsx); tag `DeveloperConsole`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={developerState} commit={(action) => { const next = saveDeveloperControlPlane(action(developerState)); setDeveloperState(next); }} onEmulate={(role) => { const tenant = selectedDeveloperTenant(developerState); if (tenant.lifecycle !== "active") return; setDeveloperEmulation({ tenantId: tenant.id, role }); setUser({ id: -100, name: `Developer emulating ${tenant.profile.name}`, email: `developer+${role}@demo.local`, password: "", role: roleForEmulation(role), }); setDeveloperMode(false); }} onReset={() => setDeveloperState(resetDeveloperControlPlane())}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1009-1

Owner `App`; [src/App.tsx:1009](../src/App.tsx); tag `LoginScreen`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onLogin={handleLogin} onCognitoLogin={() => authConfig?.mode === "cognito" && beginCognitoLogin(authConfig) } config={authConfig} error={loginError}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1135-1

Owner `App`; [src/App.tsx:1135](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="rail-toggle" onPointerDown={handleRailTogglePointerDown} onPointerMove={handleRailTogglePointerMove} onPointerUp={handleRailTogglePointerUp} onMouseDown={handleRailToggleMouseDown} aria-label={sidebarCollapsed ? "Show left menu" : "Hide left menu"} title={sidebarCollapsed ? "Show left menu" : "Hide left menu"} style={{ top: railToggleTop }}
```

Label/content expression:

```tsx
 {sidebarCollapsed ? ( <PanelLeftOpen size={18} /> ) : ( <PanelLeftClose size={18} /> )} 
```

#### ACT-App-tsx-1158-1

Owner `App`; [src/App.tsx:1158](../src/App.tsx); tag `button`.

Visibility: menuItems.length === 0

```tsx
key={item.label} className={activeMenuItem === item.label ? "active" : ""} onClick={() => { if (activeMenuItem === "Search" && item.label !== "Search") { setQuery(""); setSearchCategory(""); setSearchStatus("ALL"); setSearchDateFilter(""); setSearchMonthFilter(""); setSearchPaymentMode("ALL"); } setDashboardDrilldown(undefined); setActiveMenuItem(item.label); }} title={item.label}
```

Label/content expression:

```tsx
 {item.icon} <span> {item.label === "Approvals" ? `Approvals (${state.jobs.filter((view) => view.material_approval?.status === "Pending").length})` : item.label} </span> 
```

#### ACT-App-tsx-1183-1

Owner `App`; [src/App.tsx:1183](../src/App.tsx); tag `summary`.

Visibility: user.role === "admin"; menuItems.length === 0

```tsx

```

Label/content expression:

```tsx
Sales CRM
```

#### ACT-App-tsx-1183-2

Owner `App`; [src/App.tsx:1183](../src/App.tsx); tag `button`.

Visibility: user.role === "admin"; menuItems.length === 0

```tsx
key={item.label} className={activeMenuItem === item.label ? "active" : ""} onClick={() => setActiveMenuItem(item.label)} title={item.label}
```

Label/content expression:

```tsx
{item.icon} <span>{item.label}</span>
```

#### ACT-App-tsx-1187-1

Owner `App`; [src/App.tsx:1187](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="logout" onClick={developerEmulation ? returnToDeveloper : handleLogout}
```

Label/content expression:

```tsx
 <LogOut size={18} /> <span>{developerEmulation ? "Return to Developer" : "Logout"}</span> 
```

#### ACT-App-tsx-1203-1

Owner `App`; [src/App.tsx:1203](../src/App.tsx); tag `select`.

Visibility: activeMenuItem === "Search"

```tsx
aria-label="Search category" value={searchCategory} onChange={(event) => { const nextCategory = event.target.value as \| SearchCategorySelection \| ""; setSearchCategory(nextCategory); if (nextCategory === "job" && searchCategory !== "job") { setSearchDateFilter(""); setSearchMonthFilter(localCalendarDate().slice(0, 7)); } if (nextCategory !== "job") setSearchStatus("ALL"); if (nextCategory !== "payment") setSearchPaymentMode("ALL"); if (nextCategory !== "stock") { setSearchLowStockOnly(false); } }}
```

Label/content expression:

```tsx
 <option value="">Select a category</option> {searchCategoriesFor(user, permittedPages).map((item) => ( <option key={item} value={item}> {item in ADMIN_OPERATIONAL_SEARCH_LABELS ? ADMIN_OPERATIONAL_SEARCH_LABELS[ item as AdminOperationalSearchCategory ] : SEARCH_CATEGORY_LABELS[item as SearchTableCategory]} </option> ))} 
```

#### ACT-App-tsx-1234-1

Owner `App`; [src/App.tsx:1234](../src/App.tsx); tag `FilterClearButton`.

Visibility: activeMenuItem === "Search"

```tsx
label="Clear category" disabled={!searchCategory} onClick={() => setSearchCategory("")}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1246-1

Owner `App`; [src/App.tsx:1246](../src/App.tsx); tag `button`.

Visibility: developerEmulation

```tsx
className="secondary-action" onClick={returnToDeveloper}
```

Label/content expression:

```tsx
Return to Developer 
```

#### ACT-App-tsx-1250-1

Owner `App`; [src/App.tsx:1250](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="mobile-logout" onClick={developerEmulation ? returnToDeveloper : handleLogout} aria-label={developerEmulation ? "Return to Developer" : "Logout"}
```

Label/content expression:

```tsx
 <LogOut size={18} /> {developerEmulation ? "Return" : "Logout"} 
```

#### ACT-App-tsx-1271-1

Owner `App`; [src/App.tsx:1271](../src/App.tsx); tag `RoleWorkspace`.

Visibility: menuItems.length === 0

```tsx
activeMenuItem={activeMenuItem} jobs={jobs} mutate={mutate} query={query} searchCategory={searchCategory} searchStatus={searchStatus} searchDateFilter={searchDateFilter} searchMonthFilter={searchMonthFilter} searchPaymentMode={searchPaymentMode} searchLowStockOnly={searchLowStockOnly} paymentRows={paymentRows} searchNavigate={searchNavigate} permittedPages={permittedPages} selected={selected} selectedJobId={selectedJobId} setQuery={setQuery} setSearchCategory={setSearchCategory} setSearchStatus={setSearchStatus} setSearchDateFilter={setSearchDateFilter} setSearchMonthFilter={setSearchMonthFilter} setSearchPaymentMode={setSearchPaymentMode} setSearchLowStockOnly={setSearchLowStockOnly} setSelectedJobId={setSelectedJobId} onOpenSearchRecord={openSearchRecord} onOpenStockSearchRecord={openStockSearchRecord} onSearchNavigateConsumed={() => setSearchNavigate(undefined)} stockSearchNavigate={stockSearchNavigate} dashboardDrilldown={dashboardDrilldown} state={state} user={user} cognitoConfig={ authConfig?.mode === "cognito" ? authConfig : undefined } onNavigate={setActiveMenuItem} onDashboardNavigate={openDashboardDrilldown} onThemeSaved={setAppTheme} onAdminStateSaved={() => setAdminStateVersion((value) => value + 1)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1313-1

Owner `App`; [src/App.tsx:1313](../src/App.tsx); tag `JobCardNotificationDialog`.

Visibility: jobCardNotification

```tsx
notification={jobCardNotification} onClose={() => setJobCardNotification(undefined)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-1335-1

Owner `JobCardNotificationDialog`; [src/App.tsx:1335](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title={`Job card ${eventLabel}`} subtitle={deliveryMessage} onClose={onClose} footer={ <button type="button" className="primary-action" data-dialog-initial-focus onClick={onClose} > Done </button> }
```

Label/content expression:

```tsx
 <p className="permission-note"> The customer notification details are shown below. </p> <section className="notification-message" aria-label="WhatsApp message"> <strong>WhatsApp</strong> <p>{payload.whatsapp}</p> </section> <section className="notification-message" aria-label="Email message"> <strong>Email</strong> <p>{payload.email}</p> </section> 
```

#### ACT-App-tsx-1340-1

Owner `JobCardNotificationDialog`; [src/App.tsx:1340](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" data-dialog-initial-focus onClick={onClose}
```

Label/content expression:

```tsx
Done 
```

#### ACT-App-tsx-1396-1

Owner `LoginScreen`; [src/App.tsx:1396](../src/App.tsx); tag `button`.

Visibility: config?.mode === "cognito"

```tsx
className="primary-action" onClick={onCognitoLogin}
```

Label/content expression:

```tsx
Continue with Cognito 
```

#### FORM-App-tsx-1408-1

Owner `LoginScreen`; [src/App.tsx:1408](../src/App.tsx); tag `form`.

Visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
onSubmit={(event) => { event.preventDefault(); onLogin(email, password); }}
```

Label/content expression:

```tsx
 <label> Email <input value={email} onChange={(event) => setEmail(event.target.value)} /> </label> <label> Password <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /> </label> {error && <p className="error-text">{error}</p>} <button className="primary-action">Login</button> 
```

#### ACT-App-tsx-1416-1

Owner `LoginScreen`; [src/App.tsx:1416](../src/App.tsx); tag `input`.

Visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
value={email} onChange={(event) => setEmail(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1423-1

Owner `LoginScreen`; [src/App.tsx:1423](../src/App.tsx); tag `input`.

Visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
type="password" value={password} onChange={(event) => setPassword(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1430-1

Owner `LoginScreen`; [src/App.tsx:1430](../src/App.tsx); tag `button`.

Visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Login
```

#### ACT-App-tsx-1436-1

Owner `LoginScreen`; [src/App.tsx:1436](../src/App.tsx); tag `select`.

Visibility: config?.mode === "local" && config.allowDemo

```tsx
value={email} onChange={(event) => setEmail(event.target.value)}
```

Label/content expression:

```tsx
 {demoLogins.map((item) => ( <option key={item} value={item}> {item} </option> ))} 
```

#### ACT-App-tsx-1538-1

Owner `RoleWorkspace`; [src/App.tsx:1538](../src/App.tsx); tag `AdminConsole`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} mutate={mutate} actingUser={user} cognitoConfig={cognitoConfig} onThemeSaved={onThemeSaved} onStateSaved={onAdminStateSaved} initialTab="Report Templates" initialReportCategory="quotation"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1554-1

Owner `RoleWorkspace`; [src/App.tsx:1554](../src/App.tsx); tag `SearchPortal`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
jobs={jobs} state={state} mutate={mutate} query={query} category={searchCategory} status={searchStatus} dateFilter={searchDateFilter} monthFilter={searchMonthFilter} paymentMode={searchPaymentMode} lowStockOnly={searchLowStockOnly} initialLowStockOnly={ dashboardDrilldown?.destination === "Search" && dashboardDrilldown.category === "stock" && Boolean(dashboardDrilldown.lowStockOnly) } paymentRows={paymentRows} permittedPages={permittedPages} actor={user} setQuery={setQuery} setCategory={setSearchCategory} setStatus={setSearchStatus} setDateFilter={setSearchDateFilter} setMonthFilter={setSearchMonthFilter} setPaymentMode={setSearchPaymentMode} setLowStockOnly={setSearchLowStockOnly} onOpenRecord={onOpenSearchRecord} onOpenStockRecord={onOpenStockSearchRecord}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1591-1

Owner `RoleWorkspace`; [src/App.tsx:1591](../src/App.tsx); tag `EntityList`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={`jobs-${dashboardDrilldown?.month ?? ""}-${dashboardDrilldown?.date ?? ""}-${dashboardDrilldown?.status ?? ""}`} kind="jobs" state={state} mutate={mutate} actor={user} initialFilters={ dashboardDrilldown?.destination === activeMenuItem ? { month: dashboardDrilldown.month, date: dashboardDrilldown.date, primary: dashboardDrilldown.status, } : undefined } initialSelectedId={ searchNavigate?.kind === "jobs" ? searchNavigate.id : undefined } onInitialSelectionConsumed={onSearchNavigateConsumed}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1614-1

Owner `RoleWorkspace`; [src/App.tsx:1614](../src/App.tsx); tag `EntityList`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={`customers-${dashboardDrilldown?.month ?? ""}`} kind="customers" state={state} mutate={mutate} actor={user} initialFilters={ dashboardDrilldown?.served === "customers" ? { month: dashboardDrilldown.month } : undefined } initialSelectedId={ searchNavigate?.kind === "customers" ? searchNavigate.id : undefined } onInitialSelectionConsumed={onSearchNavigateConsumed}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1633-1

Owner `RoleWorkspace`; [src/App.tsx:1633](../src/App.tsx); tag `EntityList`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={`vehicles-${dashboardDrilldown?.month ?? ""}`} kind="vehicles" state={state} mutate={mutate} actor={user} initialFilters={ dashboardDrilldown?.served === "vehicles" ? { month: dashboardDrilldown.month } : undefined } initialSelectedId={ searchNavigate?.kind === "vehicles" ? searchNavigate.id : undefined } onInitialSelectionConsumed={onSearchNavigateConsumed}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1659-1

Owner `RoleWorkspace`; [src/App.tsx:1659](../src/App.tsx); tag `PurchaseOrdersWorkspace`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} actor={user} mutate={mutate} procurementDraft={procurementDraft} onProcurementDraftConsumed={() => setProcurementDraft(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1695-1

Owner `RoleWorkspace`; [src/App.tsx:1695](../src/App.tsx); tag `StoreDesk`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
activeMenuItem={activeMenuItem} state={state} actor={user} mutate={mutate} setSelectedJobId={setSelectedJobId} onNavigate={onNavigate} onCreatePurchaseRequest={(draft) => { setProcurementDraft(draft); onNavigate("Purchase Orders"); }} initialStockSearch={stockSearchNavigate} initialDrilldown={dashboardDrilldown}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1712-1

Owner `RoleWorkspace`; [src/App.tsx:1712](../src/App.tsx); tag `StoreDesk`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
activeMenuItem={activeMenuItem} state={state} actor={user} mutate={mutate} setSelectedJobId={setSelectedJobId} onNavigate={onNavigate} onCreatePurchaseRequest={(draft) => { setProcurementDraft(draft); onNavigate("Purchase Orders"); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1746-1

Owner `RoleWorkspace`; [src/App.tsx:1746](../src/App.tsx); tag `Admin`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
activeMenuItem={activeMenuItem} state={state} selected={selected} mutate={mutate} setSelectedJobId={setSelectedJobId} user={user} cognitoConfig={cognitoConfig} onNavigate={onNavigate} onDashboardNavigate={onDashboardNavigate} dashboardDrilldown={dashboardDrilldown} onThemeSaved={onThemeSaved} onAdminStateSaved={onAdminStateSaved}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1948-1

Owner `SearchPortal`; [src/App.tsx:1948](../src/App.tsx); tag `JobRecordDialog`.

Visibility: record?.category === "job"

```tsx
view={record.view} state={state} mutate={mutate} actor={actor} mode={record.mode} onClose={() => setRecord(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1958-1

Owner `SearchPortal`; [src/App.tsx:1958](../src/App.tsx); tag `InvoiceDialog`.

Visibility: record?.category === "invoice"

```tsx
fixedJob action={record.mode} view={record.view} actor={actor} mutate={mutate} onClose={() => setRecord(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1968-1

Owner `SearchPortal`; [src/App.tsx:1968](../src/App.tsx); tag `InvoiceDialog`.

Visibility: record?.category === "payment"

```tsx
fixedJob action="view" view={record.view} actor={actor} mutate={mutate} onClose={() => setRecord(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1981-1

Owner `SearchPortal`; [src/App.tsx:1981](../src/App.tsx); tag `input`.

Visibility: !operationalCategory && category !== "job" && !entityListKind; !operationalCategory && !entityListKind

```tsx
aria-label="Search records" value={query} placeholder="Search vehicle, mobile, customer, job card, invoice" onChange={(event) => changeFilters(() => setQuery(event.target.value)) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-1992-1

Owner `SearchPortal`; [src/App.tsx:1992](../src/App.tsx); tag `JobCardFilterFields`.

Visibility: category === "job"; !operationalCategory && !entityListKind

```tsx
jobs={jobArchivedOnly && actor.role === "admin" ? state.archived_jobs : state.jobs} values={{ search: query, primary: status, secondary: jobWorkflow, date: dateFilter, month: monthFilter, customer: "", advisor: jobAdvisor, sort: jobSort, archivedOnly: jobArchivedOnly }} onChange={(patch) => changeFilters(() => { if (patch.search !== undefined) setQuery(patch.search); if (patch.primary !== undefined) setStatus(patch.primary as SearchCriteria["status"]); if (patch.secondary !== undefined) setJobWorkflow(patch.secondary); if (patch.date !== undefined) { setDateFilter(patch.date); if (patch.date) setMonthFilter(""); } if (patch.month !== undefined) { setMonthFilter(patch.month); if (patch.month) setDateFilter(""); } if (patch.advisor !== undefined) setJobAdvisor(patch.advisor); if (patch.sort !== undefined) setJobSort(patch.sort); if (patch.archivedOnly !== undefined) setJobArchivedOnly(patch.archivedOnly); })} onClear={clearJobCardFilters} showArchive={actor.role === "admin"} searchLabel="Search records" variant="search"
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-2013-1

Owner `SearchPortal`; [src/App.tsx:2013](../src/App.tsx); tag `span`.

Visibility: category === "stock" && activeLowStockOnly; !operationalCategory && !entityListKind

```tsx
className="search-scope" role="status"
```

Label/content expression:

```tsx
Low stock only 
```

#### ACT-App-tsx-2025-1

Owner `SearchPortal`; [src/App.tsx:2025](../src/App.tsx); tag `select`.

Visibility: false && category === "job"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
aria-label="Job status" value={status} onChange={(event) => changeFilters(() => setStatus( event.target.value as SearchCriteria["status"], ), ) }
```

Label/content expression:

```tsx
 {SEARCH_STATUS_OPTIONS.map((item) => ( <option key={item} value={item}> {item === "ALL" ? "All statuses" : item} </option> ))} 
```

#### ACT-App-tsx-2047-1

Owner `SearchPortal`; [src/App.tsx:2047](../src/App.tsx); tag `select`.

Visibility: category === "payment"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
aria-label="Payment mode filter" value={paymentMode} onChange={(event) => changeFilters(() => setPaymentMode( event.target.value as "ALL" \| PaymentMode, ), ) }
```

Label/content expression:

```tsx
 <option value="ALL">All</option> {( [ "UPI", "Cash", "Card", "Bank transfer", "Other", ] as PaymentMode[] ).map((mode) => ( <option key={mode} value={mode}> {mode} </option> ))} 
```

#### ACT-App-tsx-2077-1

Owner `SearchPortal`; [src/App.tsx:2077](../src/App.tsx); tag `input`.

Visibility: category !== "job"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
aria-label="Search date" type="date" value={dateFilter} onChange={(event) => changeFilters(() => { setDateFilter(event.target.value); if (category === "payment") setMonthFilter(""); }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2091-1

Owner `SearchPortal`; [src/App.tsx:2091](../src/App.tsx); tag `select`.

Visibility: category !== "job"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
aria-label="Search month-year" value={monthFilter} onChange={(event) => changeFilters(() => { setMonthFilter(event.target.value); if (category === "payment") setDateFilter(""); }) }
```

Label/content expression:

```tsx
 <option value="">All months</option> {availableMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} 
```

#### ACT-App-tsx-2132-1

Owner `SearchPortal`; [src/App.tsx:2132](../src/App.tsx); tag `EntityList`.

Visibility: entityListKind; !category; operationalCategory

```tsx
key={`search-${entityListKind}`} kind={entityListKind} state={state} mutate={mutate} actor={actor} externalSearch={query} onExternalSearchChange={(value) => changeFilters(() => setQuery(value)) } filterLayout="search"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2146-1

Owner `SearchPortal`; [src/App.tsx:2146](../src/App.tsx); tag `PaginationToolbar`.

Visibility: entityListKind; !category; operationalCategory

```tsx
from={resultPage.from} to={resultPage.to} totalCount={resultPage.totalCount} page={resultPage.page} pageCount={resultPage.pageCount} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2163-1

Owner `SearchPortal`; [src/App.tsx:2163](../src/App.tsx); tag `FilterClearButton`.

Visibility: resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
onClick={clearFilters} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2166-1

Owner `SearchPortal`; [src/App.tsx:2166](../src/App.tsx); tag `StockSearchResultsTable`.

Visibility: isStock; resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
rows={pagedStock.items} onOpenRecord={onOpenStockRecord}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2171-1

Owner `SearchPortal`; [src/App.tsx:2171](../src/App.tsx); tag `PaymentSearchResultsTable`.

Visibility: isPayment; isStock; resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
rows={pagedPayments.items} onOpenRecord={(view) => setRecord({ view, category: "payment", mode: "view" }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2178-1

Owner `SearchPortal`; [src/App.tsx:2178](../src/App.tsx); tag `SearchResultsTable`.

Visibility: isPayment; isStock; resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
category={ category as Exclude< SearchTableCategory, "stock" \| "customer" \| "vehicle" \| "payment" > } rows={paged.items} actor={actor} onOpenRecord={(view, itemCategory, mode) => { if (actor.role === "service" \|\| itemCategory !== "invoice") setRecord({ view, category: itemCategory, mode }); else onOpenRecord(view, itemCategory); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2194-1

Owner `SearchPortal`; [src/App.tsx:2194](../src/App.tsx); tag `ResultPagination`.

Visibility: entityListKind; !category; operationalCategory

```tsx
page={resultPage.page} pageCount={resultPage.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2316-1

Owner `SearchResultsTable`; [src/App.tsx:2316](../src/App.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={view.job.id} className={`clickable-row ${category === "job" ? jobDeliveryClass(view.job, today) : ""}`} onClick={() => onOpenRecord(view, category, "view")}
```

Label/content expression:

```tsx
 {category === "job" && ( <> <td>{view.job.job_no}</td> <td> {view.vehicle.number} · {view.vehicle.make}{" "} {view.vehicle.model} </td> <td>{view.customer.name}</td> <td>{view.job.estimated_delivery \|\| "—"}</td> <td> <Status status={view.job.main_status} sub={view.job.sub_status} /> </td> <td>{money(jobTotal(view))}</td> </> )} {category === "invoice" && ( <> <td>{view.invoice?.invoice_no \|\| "Not generated"}</td> <td>{view.job.job_no}</td> <td>{view.customer.name}</td> <td>{money(view.invoice?.total ?? jobTotal(view))}</td> <td>{view.invoice?.status ?? "Not generated"}</td> </> )} <td> <RecordActions inGrid onView={() => onOpenRecord(view, category, "view")} onEdit={ editable ? () => onOpenRecord(view, category, "edit") : undefined } editLabel={ category === "invoice" ? "Edit Invoice" : undefined } /> </td> 
```

#### ACT-App-tsx-2349-1

Owner `SearchResultsTable`; [src/App.tsx:2349](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
inGrid onView={() => onOpenRecord(view, category, "view")} onEdit={ editable ? () => onOpenRecord(view, category, "edit") : undefined } editLabel={ category === "invoice" ? "Edit Invoice" : undefined }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2400-1

Owner `PaymentSearchResultsTable`; [src/App.tsx:2400](../src/App.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={payment.id} className={`clickable-row ${paymentRowHighlight(payment.mode)}`} onClick={() => onOpenRecord(view)}
```

Label/content expression:

```tsx
 <td> {payment.created_at ? formatTimestamp(payment.created_at) : "—"} </td> <td>{view.job.job_no}</td> <td>{view.invoice?.invoice_no ?? "Not generated"}</td> <td>{view.customer.name}</td> <td>{money(payment.amount)}</td> <td>{payment.mode}</td> <td>Paid</td> <td> <RecordActions inGrid onView={() => onOpenRecord(view)} /> </td> 
```

#### ACT-App-tsx-2415-1

Owner `PaymentSearchResultsTable`; [src/App.tsx:2415](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
inGrid onView={() => onOpenRecord(view)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2467-1

Owner `StockSearchResultsTable`; [src/App.tsx:2467](../src/App.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={item.id} className="clickable-row" onClick={() => onOpenRecord(item)}
```

Label/content expression:

```tsx
 <td>{item.sku}</td> <td>{item.name}</td> <td>{item.category}</td> <td>{item.stock_qty}</td> <td>{item.unit}</td> <td>{item.low_stock_qty}</td> <td> <span className={`status stock-status stock-status-${stockStatus}`} > {statusLabel} </span> </td> <td> <button type="button" className="secondary-action" onClick={(event) => { event.stopPropagation(); onOpenRecord(item); }} > View </button> </td> 
```

#### ACT-App-tsx-2486-1

Owner `StockSearchResultsTable`; [src/App.tsx:2486](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={(event) => { event.stopPropagation(); onOpenRecord(item); }}
```

Label/content expression:

```tsx
View 
```

#### ACT-App-tsx-2605-1

Owner `Reception`; [src/App.tsx:2605](../src/App.tsx); tag `BookingOperations`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} actor={user} mutate={mutate} onCheckedIn={(jobId) => setSelectedJobId(jobId)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2623-1

Owner `Reception`; [src/App.tsx:2623](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => setCreating(true)}
```

Label/content expression:

```tsx
 <Plus size={18} /> Create New Visit 
```

#### STATE-App-tsx-2640-1

Owner `Reception`; [src/App.tsx:2640](../src/App.tsx); tag `p`.

Visibility: createdJobNo

```tsx
className="permission-note" role="status"
```

Label/content expression:

```tsx
Visit created: {createdJobNo} is now selected. 
```

#### ACT-App-tsx-2644-1

Owner `Reception`; [src/App.tsx:2644](../src/App.tsx); tag `AdvisorAttendancePanel`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} jobs={openQueue} today={today} selectedAdvisorId={selectedAdvisorId} onSelectAdvisor={setSelectedAdvisorId} mutate={mutate}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2652-1

Owner `Reception`; [src/App.tsx:2652](../src/App.tsx); tag `ReceptionQueueRows`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
jobs={openQueue} users={state.users} today={today} selectedAdvisorId={selectedAdvisorId} selectedJobId={selected?.job.id} onSelect={setSelectedJobId}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2679-1

Owner `Reception`; [src/App.tsx:2679](../src/App.tsx); tag `button`.

Visibility: selected

```tsx
className="danger-action" onClick={() => mutate((db) => cancelJobCard( db, selected.job.id, "Cancelled at reception", ), ) }
```

Label/content expression:

```tsx
Archive Visit/Job 
```

#### ACT-App-tsx-2700-1

Owner `Reception`; [src/App.tsx:2700](../src/App.tsx); tag `CreateVisitDialog`.

Visibility: creating

```tsx
state={state} mutate={mutate} actor={user} onClose={() => setCreating(false)} onCreated={(jobId, jobNo) => { setSelectedJobId(jobId); setCreatedJobNo(jobNo); setCreating(false); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2735-1

Owner `BookingOperations`; [src/App.tsx:2735](../src/App.tsx); tag `ExpectedTodayBookings`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} actor={actor} mutate={mutate} operationalDate={today} onCheckedIn={onCheckedIn}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2793-1

Owner `AdvisorAttendancePanel`; [src/App.tsx:2793](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={ selectedAdvisorId === undefined ? "advisor-reset active" : "advisor-reset" } onClick={() => onSelectAdvisor(undefined)}
```

Label/content expression:

```tsx
All advisors 
```

#### ACT-App-tsx-2806-1

Owner `AdvisorAttendancePanel`; [src/App.tsx:2806](../src/App.tsx); tag `button`.

Visibility: pageCount > 1

```tsx
type="button" aria-label="Previous advisors" title="Previous advisors" disabled={page === 0} onClick={() => setPage((current) => current - 1)}
```

Label/content expression:

```tsx
 <ChevronLeft aria-hidden="true" size={16} /> 
```

#### ACT-App-tsx-2818-1

Owner `AdvisorAttendancePanel`; [src/App.tsx:2818](../src/App.tsx); tag `button`.

Visibility: pageCount > 1

```tsx
type="button" aria-label="Next advisors" title="Next advisors" disabled={page === pageCount - 1} onClick={() => setPage((current) => current + 1)}
```

Label/content expression:

```tsx
 <ChevronRight aria-hidden="true" size={16} /> 
```

#### ACT-App-tsx-2842-1

Owner `AdvisorAttendancePanel`; [src/App.tsx:2842](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="advisor-card-select" aria-pressed={selectedAdvisorId === advisor.id} onClick={() => onSelectAdvisor( selectedAdvisorId === advisor.id ? undefined : advisor.id, ) }
```

Label/content expression:

```tsx
 <strong>{advisor.name}</strong> <span> {isPresent ? "Present" : "Away"} · {activeJobs} open </span> 
```

#### ACT-App-tsx-2857-1

Owner `AdvisorAttendancePanel`; [src/App.tsx:2857](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={ isPresent ? "advisor-availability-toggle present" : "advisor-availability-toggle away" } aria-label={`Mark ${advisor.name} ${isPresent ? "away" : "present"}`} aria-pressed={isPresent} onClick={() => mutate((db) => setAdvisorPresent(db, advisor.id, !isPresent, today), ) }
```

Label/content expression:

```tsx
 <span aria-hidden="true" /> {isPresent ? "Present" : "Away"} 
```

#### ACT-App-tsx-2931-1

Owner `ReceptionQueueRows`; [src/App.tsx:2931](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search reception queue" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Job, vehicle, customer or requested work"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-2940-1

Owner `ReceptionQueueRows`; [src/App.tsx:2940](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Reception queue status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}
```

Label/content expression:

```tsx
 <option value="ALL">All open</option> <option value="NEW">New</option> <option value="IN_PROGRESS">In Progress</option> <option value="COMPLETED">Completed</option> <option value="UNASSIGNED">Unassigned</option> 
```

#### ACT-App-tsx-2952-1

Owner `ReceptionQueueRows`; [src/App.tsx:2952](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={reset} disabled={!search && status === "ALL"}
```

Label/content expression:

```tsx
Clear 
```

#### STATE-App-tsx-2961-1

Owner `ReceptionQueueRows`; [src/App.tsx:2961](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="reception-list-summary" role="status"
```

Label/content expression:

```tsx
 {filtered.length} of {jobs.length} open jobs {selectedAdvisorId !== undefined ? " for selected advisor" : ""} 
```

#### ACT-App-tsx-2975-1

Owner `ReceptionQueueRows`; [src/App.tsx:2975](../src/App.tsx); tag `button`.

Visibility: filtered.length

```tsx
type="button" key={row.job.id} className={`reception-visit-row ${statusClass}${selectedJobId === row.job.id ? " active" : ""}`} onClick={() => onSelect(row.job.id)}
```

Label/content expression:

```tsx
 <div className="reception-job-identity"> <strong>{row.job.job_no}</strong> <span> {row.vehicle.number} · {row.customer.name} </span> </div> <div className="reception-job-meta"> <span className={ advisor ? "advisor-name" : "advisor-name unassigned" } > {advisor?.name ?? "Unassigned"} </span> <Status status={row.job.main_status} sub={row.job.sub_status} /> </div> <div className="reception-job-received"> <strong className={ isCarryForward ? "carry-forward" : "today-marker" } > {isCarryForward ? "Carry-forward" : "Today"} </strong> <span> {isCarryForward ? receptionAgeLabel(receivedDate, today) : "Received today"}{" "} · {receivedDate} </span> </div> <p title={row.visit.requested_work}> {row.visit.requested_work} </p> 
```

#### ACT-App-tsx-3025-1

Owner `ReceptionQueueRows`; [src/App.tsx:3025](../src/App.tsx); tag `button`.

Visibility: filtered.length

```tsx
type="button" onClick={reset}
```

Label/content expression:

```tsx
Clear filters 
```

#### STATE-App-tsx-3272-1

Owner `CreateVisitDialog`; [src/App.tsx:3272](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title="Create New Visit" subtitle="Link an existing customer and vehicle, or enter new details" onClose={onClose} footer={ <button className="primary-action" form="create-visit-form"> Create Visit </button> }
```

Label/content expression:

```tsx
 <form id="create-visit-form" onSubmit={submit}> <div className="sub-tabs create-visit-tabs" role="tablist" aria-label="Create visit sections" onKeyDown={handleTabListKeyDown} > {(["details", "body-mark"] as const).map((item) => ( <button type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} > {item === "details" ? "Details" : "Body Mark"} </button> ))} </div> {tab === "details" ? ( <div id={panelId("details")} role="tabpanel" aria-labelledby={tabId("details")} className="create-visit-tab-panel" > <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > Add New Customer </button> </div> <div className="field-with-action"> <SearchSelect label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model" /> <button type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")} > Add New Vehicle </button> </div> <label> Customer Name <input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) } /> </label> <label> Mobile <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) } /> </label> <label> Vehicle Number <input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) } /> </label> <label> Make <input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) } /> </label> <label> Model <input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) } /> </label> <label> Color <input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) } /> </label> <label> ODO meter reading (km) <input required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel / battery level <div className="field-pair"> <input required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> <label> Advisor <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) } > <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} </select> </label> </div> <label> Requested Work <textarea required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> </div> ) : ( <div id={panelId("body-mark")} role="tabpanel" aria-labelledby={tabId("body-mark")} className="create-visit-tab-panel create-visit-body-mark-panel" > <div className="damage-capture"> <strong>Body mark</strong> <BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }} /> </div> </div> )} {error && ( <p role="alert" className="form-error"> {error} </p> )} </form> {quickAdd === "customer" && ( <Dialog title="Add New Customer" onClose={() => setQuickAdd(undefined)}> <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> </Dialog> )} {quickAdd === "vehicle" && form.customerId > 0 && ( <Dialog title="Add New Vehicle" onClose={() => setQuickAdd(undefined)}> <VehicleMasterPanel key={form.customerId} embedded state={state} value={{ id: 0, customer_id: form.customerId, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => setQuickAdd(undefined)} /> </Dialog> )} 
```

#### ACT-App-tsx-3278-1

Owner `CreateVisitDialog`; [src/App.tsx:3278](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" form="create-visit-form"
```

Label/content expression:

```tsx
Create Visit 
```

#### FORM-App-tsx-3283-1

Owner `CreateVisitDialog`; [src/App.tsx:3283](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="create-visit-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <div className="sub-tabs create-visit-tabs" role="tablist" aria-label="Create visit sections" onKeyDown={handleTabListKeyDown} > {(["details", "body-mark"] as const).map((item) => ( <button type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} > {item === "details" ? "Details" : "Body Mark"} </button> ))} </div> {tab === "details" ? ( <div id={panelId("details")} role="tabpanel" aria-labelledby={tabId("details")} className="create-visit-tab-panel" > <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > Add New Customer </button> </div> <div className="field-with-action"> <SearchSelect label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model" /> <button type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")} > Add New Vehicle </button> </div> <label> Customer Name <input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) } /> </label> <label> Mobile <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) } /> </label> <label> Vehicle Number <input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) } /> </label> <label> Make <input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) } /> </label> <label> Model <input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) } /> </label> <label> Color <input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) } /> </label> <label> ODO meter reading (km) <input required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel / battery level <div className="field-pair"> <input required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> <label> Advisor <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) } > <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} </select> </label> </div> <label> Requested Work <textarea required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> </div> ) : ( <div id={panelId("body-mark")} role="tabpanel" aria-labelledby={tabId("body-mark")} className="create-visit-tab-panel create-visit-body-mark-panel" > <div className="damage-capture"> <strong>Body mark</strong> <BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }} /> </div> </div> )} {error && ( <p role="alert" className="form-error"> {error} </p> )} 
```

#### STATE-App-tsx-3284-1

Owner `CreateVisitDialog`; [src/App.tsx:3284](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs create-visit-tabs" role="tablist" aria-label="Create visit sections" onKeyDown={handleTabListKeyDown}
```

Label/content expression:

```tsx
 {(["details", "body-mark"] as const).map((item) => ( <button type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} > {item === "details" ? "Details" : "Body Mark"} </button> ))} 
```

#### STATE-App-tsx-3291-1

Owner `CreateVisitDialog`; [src/App.tsx:3291](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}
```

Label/content expression:

```tsx
 {item === "details" ? "Details" : "Body Mark"} 
```

#### STATE-App-tsx-3307-1

Owner `CreateVisitDialog`; [src/App.tsx:3307](../src/App.tsx); tag `div`.

Visibility: tab === "details"

```tsx
id={panelId("details")} role="tabpanel" aria-labelledby={tabId("details")} className="create-visit-tab-panel"
```

Label/content expression:

```tsx
 <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > Add New Customer </button> </div> <div className="field-with-action"> <SearchSelect label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model" /> <button type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")} > Add New Vehicle </button> </div> <label> Customer Name <input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) } /> </label> <label> Mobile <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) } /> </label> <label> Vehicle Number <input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) } /> </label> <label> Make <input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) } /> </label> <label> Model <input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) } /> </label> <label> Color <input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) } /> </label> <label> ODO meter reading (km) <input required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel / battery level <div className="field-pair"> <input required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> <label> Advisor <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) } > <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} </select> </label> </div> <label> Requested Work <textarea required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> 
```

#### ACT-App-tsx-3315-1

Owner `CreateVisitDialog`; [src/App.tsx:3315](../src/App.tsx); tag `SearchSelect`.

Visibility: tab === "details"

```tsx
label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3322-1

Owner `CreateVisitDialog`; [src/App.tsx:3322](../src/App.tsx); tag `button`.

Visibility: tab === "details"

```tsx
type="button" className="link-action" onClick={() => setQuickAdd("customer")}
```

Label/content expression:

```tsx
Add New Customer 
```

#### ACT-App-tsx-3331-1

Owner `CreateVisitDialog`; [src/App.tsx:3331](../src/App.tsx); tag `SearchSelect`.

Visibility: tab === "details"

```tsx
label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3338-1

Owner `CreateVisitDialog`; [src/App.tsx:3338](../src/App.tsx); tag `button`.

Visibility: tab === "details"

```tsx
type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")}
```

Label/content expression:

```tsx
Add New Vehicle 
```

#### ACT-App-tsx-3349-1

Owner `CreateVisitDialog`; [src/App.tsx:3349](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3359-1

Owner `CreateVisitDialog`; [src/App.tsx:3359](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3369-1

Owner `CreateVisitDialog`; [src/App.tsx:3369](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3379-1

Owner `CreateVisitDialog`; [src/App.tsx:3379](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3389-1

Owner `CreateVisitDialog`; [src/App.tsx:3389](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3399-1

Owner `CreateVisitDialog`; [src/App.tsx:3399](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3408-1

Owner `CreateVisitDialog`; [src/App.tsx:3408](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3421-1

Owner `CreateVisitDialog`; [src/App.tsx:3421](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3428-1

Owner `CreateVisitDialog`; [src/App.tsx:3428](../src/App.tsx); tag `select`.

Visibility: tab === "details"

```tsx
value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) }
```

Label/content expression:

```tsx
 <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> 
```

#### ACT-App-tsx-3447-1

Owner `CreateVisitDialog`; [src/App.tsx:3447](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3456-1

Owner `CreateVisitDialog`; [src/App.tsx:3456](../src/App.tsx); tag `input`.

Visibility: tab === "details"

```tsx
value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3465-1

Owner `CreateVisitDialog`; [src/App.tsx:3465](../src/App.tsx); tag `select`.

Visibility: tab === "details"

```tsx
value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) }
```

Label/content expression:

```tsx
 <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} 
```

#### ACT-App-tsx-3485-1

Owner `CreateVisitDialog`; [src/App.tsx:3485](../src/App.tsx); tag `textarea`.

Visibility: tab === "details"

```tsx
required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-3496-1

Owner `CreateVisitDialog`; [src/App.tsx:3496](../src/App.tsx); tag `div`.

Visibility: tab === "details"

```tsx
id={panelId("body-mark")} role="tabpanel" aria-labelledby={tabId("body-mark")} className="create-visit-tab-panel create-visit-body-mark-panel"
```

Label/content expression:

```tsx
 <div className="damage-capture"> <strong>Body mark</strong> <BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }} /> </div> 
```

#### ACT-App-tsx-3504-1

Owner `CreateVisitDialog`; [src/App.tsx:3504](../src/App.tsx); tag `BodyMarkDiagram`.

Visibility: tab === "details"

```tsx
marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-3518-1

Owner `CreateVisitDialog`; [src/App.tsx:3518](../src/App.tsx); tag `p`.

Visibility: error

```tsx
role="alert" className="form-error"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-3524-1

Owner `CreateVisitDialog`; [src/App.tsx:3524](../src/App.tsx); tag `Dialog`.

Visibility: quickAdd === "customer"

```tsx
title="Add New Customer" onClose={() => setQuickAdd(undefined)}
```

Label/content expression:

```tsx
 <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> 
```

#### ACT-App-tsx-3525-1

Owner `CreateVisitDialog`; [src/App.tsx:3525](../src/App.tsx); tag `CustomerEditor`.

Visibility: quickAdd === "customer"

```tsx
embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-3543-1

Owner `CreateVisitDialog`; [src/App.tsx:3543](../src/App.tsx); tag `Dialog`.

Visibility: quickAdd === "vehicle" && form.customerId > 0

```tsx
title="Add New Vehicle" onClose={() => setQuickAdd(undefined)}
```

Label/content expression:

```tsx
 <VehicleMasterPanel key={form.customerId} embedded state={state} value={{ id: 0, customer_id: form.customerId, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => setQuickAdd(undefined)} /> 
```

#### ACT-App-tsx-3544-1

Owner `CreateVisitDialog`; [src/App.tsx:3544](../src/App.tsx); tag `VehicleMasterPanel`.

Visibility: quickAdd === "vehicle" && form.customerId > 0

```tsx
key={form.customerId} embedded state={state} value={{ id: 0, customer_id: form.customerId, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => setQuickAdd(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3782-1

Owner `ServiceAdvisorList`; [src/App.tsx:3782](../src/App.tsx); tag `JobRecordDialog`.

Visibility: selected && dialog === "job"

```tsx
view={selected} state={state} mutate={mutate} actor={actor} mode="view" onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3792-1

Owner `ServiceAdvisorList`; [src/App.tsx:3792](../src/App.tsx); tag `JobRecordDialog`.

Visibility: selected && dialog === "edit"

```tsx
view={selected} state={state} mutate={mutate} actor={actor} mode="edit" onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3802-1

Owner `ServiceAdvisorList`; [src/App.tsx:3802](../src/App.tsx); tag `ServiceEstimateDialog`.

Visibility: selected && dialog === "estimate"

```tsx
view={selected} actor={actor} mutate={mutate} onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3810-1

Owner `ServiceAdvisorList`; [src/App.tsx:3810](../src/App.tsx); tag `ServiceFollowupDialog`.

Visibility: selected && dialog === "followup"

```tsx
view={selected} mode="add" mutate={mutate} onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3818-1

Owner `ServiceAdvisorList`; [src/App.tsx:3818](../src/App.tsx); tag `ServiceFollowupDialog`.

Visibility: selected && dialog === "followup-view"

```tsx
view={selected} mode="view" mutate={mutate} onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3837-1

Owner `ServiceAdvisorList`; [src/App.tsx:3837](../src/App.tsx); tag `JobCardFilterFields`.

Visibility: kind === "job-cards"

```tsx
jobs={listedJobs} values={{ search, primary: mainStatus, secondary: workflow, date, month, customer, advisor, sort, archivedOnly: false }} onChange={(patch) => { if (patch.search !== undefined) setSearch(patch.search); if (patch.primary !== undefined) setMainStatus(patch.primary); if (patch.secondary !== undefined) setWorkflow(patch.secondary); if (patch.date !== undefined) { setDate(patch.date); if (patch.date) setMonth(""); } if (patch.month !== undefined) { setMonth(patch.month); if (patch.month) setDate(""); } if (patch.customer !== undefined) setCustomer(patch.customer); if (patch.advisor !== undefined) setAdvisor(patch.advisor); if (patch.sort !== undefined) setSort(patch.sort); setPage(1); }} onClear={clear} searchLabel={`Search ${title.toLowerCase()}`} variant="service"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3858-1

Owner `ServiceAdvisorList`; [src/App.tsx:3858](../src/App.tsx); tag `input`.

Visibility: kind === "job-cards"

```tsx
aria-label={`Search ${title.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, vehicle or customer"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3871-1

Owner `ServiceAdvisorList`; [src/App.tsx:3871](../src/App.tsx); tag `input`.

Visibility: kind === "job-cards"

```tsx
aria-label={`${title} received date`} type="date" value={date} onChange={(event) => { setDate(event.target.value); setMonth(""); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3884-1

Owner `ServiceAdvisorList`; [src/App.tsx:3884](../src/App.tsx); tag `select`.

Visibility: kind === "job-cards"

```tsx
aria-label={`${title} month-year`} value={month} onChange={(event) => { setMonth(event.target.value); setDate(""); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="">All months</option> {months.map((value) => ( <option key={value} value={value}> {monthYearLabel(value)} </option> ))} 
```

#### ACT-App-tsx-3901-1

Owner `ServiceAdvisorList`; [src/App.tsx:3901](../src/App.tsx); tag `ListSearchActions`.

Visibility: kind === "job-cards"

```tsx
onClear={clear}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3905-1

Owner `ServiceAdvisorList`; [src/App.tsx:3905](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <><ListExportControls report={{ title, filters: activeFilterSummary({ Search: search.trim(), [kind === "job-cards" ? "Estimated Delivery Date" : "Received date"]: date, [kind === "job-cards" ? "Estimated Delivery Month-Year" : "Received month"]: month, ...(kind === "job-cards" ? { "Main status": mainStatus, Workflow: workflow, Customer: customer, "Service advisor": advisor, Sort: sort } : {}), }), columns, rows: filtered, }} /> </> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${title} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-3952-1

Owner `ServiceAdvisorList`; [src/App.tsx:3952](../src/App.tsx); tag `button`.

Visibility: isGridView && kind === "job-cards"; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => open(row, "job")}
```

Label/content expression:

```tsx
View
```

#### ACT-App-tsx-3954-1

Owner `ServiceAdvisorList`; [src/App.tsx:3954](../src/App.tsx); tag `button`.

Visibility: actor.role === "service" && actor.id === row.job.advisor_id; isGridView && kind === "job-cards"; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => open(row, "edit")}
```

Label/content expression:

```tsx
Edit
```

#### STATE-App-tsx-4005-1

Owner `ServiceAdvisorList`; [src/App.tsx:4005](../src/App.tsx); tag `span`.

Visibility: kind === "followups"; kind === "job-cards"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
className={`service-followup-status service-followup-status-${tone}`} role="status"
```

Label/content expression:

```tsx
 {status} 
```

#### ACT-App-tsx-4019-1

Owner `ServiceAdvisorList`; [src/App.tsx:4019](../src/App.tsx); tag `button`.

Visibility: kind === "job-cards"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => open(row, "job")}
```

Label/content expression:

```tsx
View 
```

#### ACT-App-tsx-4028-1

Owner `ServiceAdvisorList`; [src/App.tsx:4028](../src/App.tsx); tag `button`.

Visibility: actor.role === "service" && actor.id === row.job.advisor_id; kind === "job-cards"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => open(row, "edit")}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-App-tsx-4041-1

Owner `ServiceAdvisorList`; [src/App.tsx:4041](../src/App.tsx); tag `button`.

Visibility: isServiceActiveJob(row); kind === "estimates"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
type="button" className={`workflow-action ${row.estimate ? "action-secondary" : "action-primary"}`} onClick={() => open(row, "estimate")}
```

Label/content expression:

```tsx
 {row.estimate ? ( <> <Pencil size={15} /> Edit Estimate </> ) : ( <> <Plus size={15} /> Create Estimate </> )} 
```

#### ACT-App-tsx-4060-1

Owner `ServiceAdvisorList`; [src/App.tsx:4060](../src/App.tsx); tag `DocumentDownloadButton`.

Visibility: row.estimate; kind === "estimates"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
kind="estimate" view={row}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4069-1

Owner `ServiceAdvisorList`; [src/App.tsx:4069](../src/App.tsx); tag `button`.

Visibility: canAddServiceFollowup(row); kind === "followups"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
className="grid-action" onClick={() => open(row, "followup")}
```

Label/content expression:

```tsx
Add Follow-up 
```

#### ACT-App-tsx-4076-1

Owner `ServiceAdvisorList`; [src/App.tsx:4076](../src/App.tsx); tag `button`.

Visibility: canAddServiceFollowup(row); kind === "followups"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => { setSelected(row); setDialog("followup-view"); }}
```

Label/content expression:

```tsx
View 
```

#### ACT-App-tsx-4100-1

Owner `ServiceAdvisorList`; [src/App.tsx:4100](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount

```tsx
onClick={clear} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4103-1

Owner `ServiceAdvisorList`; [src/App.tsx:4103](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4125-1

Owner `ServiceEstimateDialog`; [src/App.tsx:4125](../src/App.tsx); tag `EstimateDialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
view={view} actor={actor} mutate={mutate} onClose={onClose}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-4133-1

Owner `ServiceEstimateDialog`; [src/App.tsx:4133](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="View Estimate" subtitle={`${view.job.job_no} · ${view.estimate?.status ?? "Not created"}`} onClose={onClose}
```

Label/content expression:

```tsx
 {view.estimate ? ( <div className="record-view"> {view.estimate_items.map((item) => ( <Info key={item.id} label={item.description} value={money(item.qty * item.rate)} /> ))} <Info label="Total" value={money(invoiceItemsTotal(view.estimate_items, view.estimate))} /> </div> ) : ( <p className="empty-state"> No estimate has been created for this job. </p> )} 
```

#### STATE-App-tsx-4261-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4261](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide className="service-followup-dialog" title={mode === "view" ? "Follow-up History" : "Follow-ups"} subtitle="Customer contact and service coordination" onClose={onClose}
```

Label/content expression:

```tsx
 <div className="followup-job-card"> <div> <span>Job card</span> <strong>{view.job.job_no}</strong> </div> <div> <span>Customer</span> <strong>{view.customer.name}</strong> <a href={`tel:${view.customer.mobile}`}>{view.customer.mobile}</a> </div> <div> <span>Vehicle</span> <strong>{view.vehicle.number}</strong> <small> {view.vehicle.make} {view.vehicle.model} </small> </div> <div> <span>Current job status</span> <Status status={view.job.main_status} sub={view.job.sub_status} /> </div> </div> <div className="followup-details"> <details> <summary>Vehicle details</summary> <div> <span>Registration: {view.vehicle.number}</span> <span> Model: {view.vehicle.make} {view.vehicle.model} </span> <span>Odometer: {view.vehicle.km.toLocaleString("en-IN")} km</span> <span>Requested work: {view.visit.requested_work \|\| "—"}</span> </div> </details> <details> <summary> Requested materials ( {view.material_requests.length + view.material_purchase_requests.length} ) </summary> <div> {view.material_requests.length \|\| view.material_purchase_requests.length ? ( <> {view.material_requests.map((item) => ( <span key={`material-${item.id}`}> {materialName(item.item_id)} · {item.requested_qty} ·{" "} {item.status ?? "Requested"} </span> ))} {view.material_purchase_requests.map((item) => ( <span key={`purchase-${item.id}`}> {item.item_name} · {item.quantity} {item.unit} ·{" "} {item.status} </span> ))} </> ) : ( <span>No materials requested.</span> )} </div> </details> <details> <summary> Estimate{" "} {view.estimate ? `· ${view.estimate.status}` : "· Not created"} </summary> <div> <span>Status: {view.estimate?.status ?? "Not created"}</span> <span>Items: {view.estimate_items.length}</span> <span> Total:{" "} {money(invoiceItemsTotal(view.estimate_items, view.estimate))} </span> </div> </details> </div> <section className="followup-history" aria-label="Follow-up history"> <div className="followup-section-heading"> <h3>History</h3> <span>{history.length} saved</span> </div> {history.length ? ( history.map((item) => ( <article className={`followup-history-card ${item.done ? "done" : "open"}`} key={item.id} > <div> <span className="followup-state"> {item.done ? "Done" : "Open"} </span> <strong>{item.note}</strong> {item.outcome && <p>Outcome: {item.outcome}</p>} </div> <div className="followup-timestamps"> <span> Created {formatTimestamp(item.created_at \|\| item.due_at)} </span> {item.done && ( <span> Completed{" "} {formatTimestamp( item.updated_at \|\| item.created_at \|\| item.due_at, )} </span> )} {editable && !item.done && ( <button type="button" className="link-action" onClick={() => editOpen(item)} > Edit </button> )} {item.done && <small>Completed entries are read-only.</small>} </div> </article> )) ) : ( <p className="empty-state">No saved follow-ups.</p> )} </section> {editable && ( <form id="service-followup-form" className="followup-composer" onSubmit={(event) => save(event, false)} > <div className="followup-section-heading"> <h3>{editingId ? "Edit open follow-up" : "Add follow-up"}</h3> {editingId && ( <button type="button" className="link-action" onClick={resetComposer} > Cancel edit </button> )} </div> <label> Note <textarea data-dialog-initial-focus rows={3} required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a concise follow-up note" /> </label> <label> Outcome <small>Optional</small> <input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="Customer response or next step" /> </label> <button type="button" className={`followup-done-toggle ${done ? "checked" : ""}`} role="checkbox" aria-checked={done} onClick={() => setDone((value) => !value)} > <Check size={16} aria-hidden="true" /> Mark this follow-up done </button> <div className="followup-composer-actions"> <button type="submit" className="secondary-action"> Save Follow-up </button> <button type="button" className="primary-action" onClick={(event) => save(event as unknown as FormEvent, true)} > Save & Add Another </button> </div> </form> )} 
```

#### ACT-App-tsx-4276-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4276](../src/App.tsx); tag `a`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
href={`tel:${view.customer.mobile}`}
```

Label/content expression:

```tsx
{view.customer.mobile}
```

#### ACT-App-tsx-4292-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4292](../src/App.tsx); tag `summary`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
Vehicle details
```

#### ACT-App-tsx-4303-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4303](../src/App.tsx); tag `summary`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
Requested materials ( {view.material_requests.length + view.material_purchase_requests.length} ) 
```

#### ACT-App-tsx-4332-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4332](../src/App.tsx); tag `summary`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
Estimate {" "} {view.estimate ? `· ${view.estimate.status}` : "· Not created"} 
```

#### ACT-App-tsx-4377-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4377](../src/App.tsx); tag `button`.

Visibility: editable && !item.done; history.length

```tsx
type="button" className="link-action" onClick={() => editOpen(item)}
```

Label/content expression:

```tsx
Edit 
```

#### FORM-App-tsx-4394-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4394](../src/App.tsx); tag `form`.

Visibility: editable

```tsx
id="service-followup-form" className="followup-composer" onSubmit={(event) => save(event, false)}
```

Label/content expression:

```tsx
 <div className="followup-section-heading"> <h3>{editingId ? "Edit open follow-up" : "Add follow-up"}</h3> {editingId && ( <button type="button" className="link-action" onClick={resetComposer} > Cancel edit </button> )} </div> <label> Note <textarea data-dialog-initial-focus rows={3} required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a concise follow-up note" /> </label> <label> Outcome <small>Optional</small> <input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="Customer response or next step" /> </label> <button type="button" className={`followup-done-toggle ${done ? "checked" : ""}`} role="checkbox" aria-checked={done} onClick={() => setDone((value) => !value)} > <Check size={16} aria-hidden="true" /> Mark this follow-up done </button> <div className="followup-composer-actions"> <button type="submit" className="secondary-action"> Save Follow-up </button> <button type="button" className="primary-action" onClick={(event) => save(event as unknown as FormEvent, true)} > Save & Add Another </button> </div> 
```

#### ACT-App-tsx-4402-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4402](../src/App.tsx); tag `button`.

Visibility: editingId; editable

```tsx
type="button" className="link-action" onClick={resetComposer}
```

Label/content expression:

```tsx
Cancel edit 
```

#### ACT-App-tsx-4413-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4413](../src/App.tsx); tag `textarea`.

Visibility: editable

```tsx
data-dialog-initial-focus rows={3} required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a concise follow-up note"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4424-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4424](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="Customer response or next step"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4430-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4430](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
type="button" className={`followup-done-toggle ${done ? "checked" : ""}`} role="checkbox" aria-checked={done} onClick={() => setDone((value) => !value)}
```

Label/content expression:

```tsx
 <Check size={16} aria-hidden="true" /> Mark this follow-up done 
```

#### ACT-App-tsx-4440-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4440](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
type="submit" className="secondary-action"
```

Label/content expression:

```tsx
Save Follow-up 
```

#### ACT-App-tsx-4443-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4443](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
type="button" className="primary-action" onClick={(event) => save(event as unknown as FormEvent, true)}
```

Label/content expression:

```tsx
Save & Add Another 
```

#### STATE-App-tsx-4456-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4456](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title={mode === "view" ? "Follow-up History" : "Follow-ups"} subtitle={`${view.job.job_no} · ${view.vehicle.number}`} onClose={onClose} footer={ editable ? ( <button form="service-followup-form" className="primary-action"> Save Follow-up </button> ) : undefined }
```

Label/content expression:

```tsx
 <div className="followup-history"> {view.followups.length ? ( view.followups.map((item) => ( <div className="row" key={item.id}> <strong>{item.note}</strong> <span> {item.done ? "Done" : "Open"} {item.outcome ? ` · ${item.outcome}` : ""} </span> <span> {formatTimestamp( item.created_at \|\| item.updated_at \|\| item.due_at, )} </span> {editable && !item.done && ( <label className="followup-completion"> <input type="checkbox" checked={completions[item.id]?.selected ?? false} onChange={(event) => setCompletions((current) => ({ ...current, [item.id]: { selected: event.target.checked, outcome: current[item.id]?.outcome ?? "", }, })) } />{" "} Mark Done{" "} <input aria-label={`Outcome for ${item.note}`} value={completions[item.id]?.outcome ?? ""} disabled={!completions[item.id]?.selected} onChange={(event) => setCompletions((current) => ({ ...current, [item.id]: { selected: current[item.id]?.selected ?? false, outcome: event.target.value, }, })) } placeholder="Outcome" /> </label> )} </div> )) ) : ( <p className="empty-state">No saved follow-ups.</p> )} </div> {editable && ( <form id="service-followup-form" onSubmit={save}> <label> Note <input data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a follow-up note" /> </label> <label> Outcome <input value={outcome} onChange={(event) => setOutcome(event.target.value)} /> </label> <label className="checkbox-line"> <input type="checkbox" checked={done} onChange={(event) => setDone(event.target.checked)} />{" "} Mark new follow-up Done </label> </form> )} 
```

#### ACT-App-tsx-4462-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4462](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
form="service-followup-form" className="primary-action"
```

Label/content expression:

```tsx
Save Follow-up 
```

#### ACT-App-tsx-4484-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4484](../src/App.tsx); tag `input`.

Visibility: editable && !item.done; view.followups.length

```tsx
type="checkbox" checked={completions[item.id]?.selected ?? false} onChange={(event) => setCompletions((current) => ({ ...current, [item.id]: { selected: event.target.checked, outcome: current[item.id]?.outcome ?? "", }, })) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4498-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4498](../src/App.tsx); tag `input`.

Visibility: editable && !item.done; view.followups.length

```tsx
aria-label={`Outcome for ${item.note}`} value={completions[item.id]?.outcome ?? ""} disabled={!completions[item.id]?.selected} onChange={(event) => setCompletions((current) => ({ ...current, [item.id]: { selected: current[item.id]?.selected ?? false, outcome: event.target.value, }, })) } placeholder="Outcome"
```

Label/content expression:

```tsx

```

#### FORM-App-tsx-4522-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4522](../src/App.tsx); tag `form`.

Visibility: editable

```tsx
id="service-followup-form" onSubmit={save}
```

Label/content expression:

```tsx
 <label> Note <input data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a follow-up note" /> </label> <label> Outcome <input value={outcome} onChange={(event) => setOutcome(event.target.value)} /> </label> <label className="checkbox-line"> <input type="checkbox" checked={done} onChange={(event) => setDone(event.target.checked)} />{" "} Mark new follow-up Done </label> 
```

#### ACT-App-tsx-4525-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4525](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a follow-up note"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4534-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4534](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
value={outcome} onChange={(event) => setOutcome(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4540-1

Owner `ServiceFollowupDialog`; [src/App.tsx:4540](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
type="checkbox" checked={done} onChange={(event) => setDone(event.target.checked)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4599-1

Owner `MaterialProcurementTriage`; [src/App.tsx:4599](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={onOpenIssueMaterial}
```

Label/content expression:

```tsx
Open Issue Material
```

#### ACT-App-tsx-4608-1

Owner `MaterialProcurementTriage`; [src/App.tsx:4608](../src/App.tsx); tag `select`.

Visibility: procurement.length > 1

```tsx
aria-label="Procurement material request" value={selectedProcurement?.request.id ?? ""} onChange={(event) => setSelectedProcurementRequestId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {procurement.map(({ view, request, item }) => <option key={request.id} value={request.id}>{view.job.job_no} · {item?.sku ?? "SKU"} · {Math.max(0, request.requested_qty - request.issued_qty)} {item?.unit ?? "units"}</option>)} 
```

#### ACT-App-tsx-4613-1

Owner `MaterialProcurementTriage`; [src/App.tsx:4613](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" disabled={!procurement.length} onClick={() => { const selectedIndex = activeRequests.findIndex( ({ request }) => request.id === selectedProcurement?.request.id, ); const selected = selectedProcurement?.request; if (!selected) return; onCreatePurchaseRequest({ source: `Material Request #${selected.id}`, lines: [{ item_id: selected.item_id, ordered_qty: allocations[selectedIndex].procurementQty }], }); }}
```

Label/content expression:

```tsx
Create Purchase Request
```

#### ACT-App-tsx-4629-1

Owner `MaterialProcurementTriage`; [src/App.tsx:4629](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" onClick={() => onCreatePurchaseRequest({ source: "New Item Request", lines: [{ item_name: "", unit: "piece", ordered_qty: 1 }] })}
```

Label/content expression:

```tsx
Create New Item Request
```

#### STATE-App-tsx-4702-1

Owner `StoreDesk`; [src/App.tsx:4702](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs" role="tablist" aria-label="Stock views"
```

Label/content expression:

```tsx
 {(["Inventory List", "Low Stock", "Stock Movements"] as const).map( (tab) => ( <button key={tab} role="tab" aria-selected={stockTab === tab} className={stockTab === tab ? "active" : ""} onClick={() => setStockTab(tab)} > {tab} </button> ), )} 
```

#### STATE-App-tsx-4705-1

Owner `StoreDesk`; [src/App.tsx:4705](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={tab} role="tab" aria-selected={stockTab === tab} className={stockTab === tab ? "active" : ""} onClick={() => setStockTab(tab)}
```

Label/content expression:

```tsx
 {tab} 
```

#### ACT-App-tsx-4743-1

Owner `StoreDesk`; [src/App.tsx:4743](../src/App.tsx); tag `StoreList`.

Visibility: stockTab === "Inventory List"

```tsx
key={`stock-${initialStockSearch ?? "all"}`} kind="stock" inventory={state.inventory} requests={requests} onOpenJob={openJob} onEditStock={setEditingStock} initialSearch={initialStockSearch} initialPrimary={initialDrilldown?.status} filterLayout={filterLayout} headerAction={actor.role === "admin" ? ( <button type="button" className="primary-action" aria-haspopup="dialog" onClick={() => setQuickAddStockOpen(true)} > <Plus size={16} /> Quick Add Stock </button> ) : undefined}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4754-1

Owner `StoreDesk`; [src/App.tsx:4754](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin"; stockTab === "Inventory List"

```tsx
type="button" className="primary-action" aria-haspopup="dialog" onClick={() => setQuickAddStockOpen(true)}
```

Label/content expression:

```tsx
 <Plus size={16} /> Quick Add Stock 
```

#### ACT-App-tsx-4766-1

Owner `StoreDesk`; [src/App.tsx:4766](../src/App.tsx); tag `StoreList`.

Visibility: stockTab === "Low Stock"

```tsx
key="low-stock" kind="stock" inventory={lowStock} requests={requests} onOpenJob={openJob} filterLayout={filterLayout}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-4779-1

Owner `StoreDesk`; [src/App.tsx:4779](../src/App.tsx); tag `Dialog`.

Visibility: actor.role === "admin" && quickAddStockOpen

```tsx
title="Quick Add Stock" subtitle="Record an inward against an existing SKU or create a new SKU" onClose={() => setQuickAddStockOpen(false)}
```

Label/content expression:

```tsx
 <QuickAddStock inventory={state.inventory} actor={actor} purchaseOrders={state.purchase_orders} purchaseOrderLines={state.purchase_order_lines} mutate={mutate} onSaved={() => setQuickAddStockOpen(false)} /> 
```

#### ACT-App-tsx-4784-1

Owner `StoreDesk`; [src/App.tsx:4784](../src/App.tsx); tag `QuickAddStock`.

Visibility: actor.role === "admin" && quickAddStockOpen

```tsx
inventory={state.inventory} actor={actor} purchaseOrders={state.purchase_orders} purchaseOrderLines={state.purchase_order_lines} mutate={mutate} onSaved={() => setQuickAddStockOpen(false)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4795-1

Owner `StoreDesk`; [src/App.tsx:4795](../src/App.tsx); tag `EditStockDetailsDialog`.

Visibility: editingStock

```tsx
item={editingStock} mutate={mutate} onClose={() => setEditingStock(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4807-1

Owner `StoreDesk`; [src/App.tsx:4807](../src/App.tsx); tag `MaterialProcurementTriage`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
requests={requests} purchaseOrders={state.purchase_orders} purchaseOrderLines={state.purchase_order_lines} inventory={state.inventory} onOpenIssueMaterial={() => onNavigate?.("Issue Material")} onCreatePurchaseRequest={(draft) => onCreatePurchaseRequest?.(draft)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4815-1

Owner `StoreDesk`; [src/App.tsx:4815](../src/App.tsx); tag `StoreList`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={`requests-${initialDrilldown?.month ?? ""}`} kind="requests" inventory={state.inventory} requests={requests} purchases={localPurchases} purchaseRequests={purchaseRequests} onOpenJob={openJob} onNeedsApproval={setApprovalCandidate} initialMonth={initialDrilldown?.month} filterLayout={filterLayout}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4828-1

Owner `StoreDesk`; [src/App.tsx:4828](../src/App.tsx); tag `summary`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
Procurement and issue workflow
```

#### ACT-App-tsx-4832-1

Owner `StoreDesk`; [src/App.tsx:4832](../src/App.tsx); tag `MaterialApprovalSubmitDialog`.

Visibility: approvalCandidate

```tsx
row={approvalCandidate} actor={actor} mutate={mutate} onClose={() => setApprovalCandidate(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4840-1

Owner `StoreDesk`; [src/App.tsx:4840](../src/App.tsx); tag `JobRecordDialog`.

Visibility: viewJob

```tsx
view={viewJob} state={state} mutate={mutate} actor={actor} mode="view" onClose={() => setViewJobId(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4858-1

Owner `StoreDesk`; [src/App.tsx:4858](../src/App.tsx); tag `StoreList`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={`${activeMenuItem}-${initialDrilldown?.month ?? ""}`} kind="issue" inventory={state.inventory} requests={eligibleRequests} onOpenJob={openJob} onRelease={setReleaseCandidate} onNeedsApproval={setApprovalCandidate} initialMonth={initialDrilldown?.month} initialPrimary={initialDrilldown?.status} filterLayout={filterLayout}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4871-1

Owner `StoreDesk`; [src/App.tsx:4871](../src/App.tsx); tag `summary`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
Issue workflow
```

#### ACT-App-tsx-4875-1

Owner `StoreDesk`; [src/App.tsx:4875](../src/App.tsx); tag `ReleaseMaterialDialog`.

Visibility: releaseCandidate

```tsx
row={releaseCandidate} actor={actor} mutate={mutate} onClose={() => setReleaseCandidate(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4883-1

Owner `StoreDesk`; [src/App.tsx:4883](../src/App.tsx); tag `MaterialApprovalSubmitDialog`.

Visibility: approvalCandidate

```tsx
row={approvalCandidate} actor={actor} mutate={mutate} onClose={() => setApprovalCandidate(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4891-1

Owner `StoreDesk`; [src/App.tsx:4891](../src/App.tsx); tag `JobRecordDialog`.

Visibility: viewJob

```tsx
view={viewJob} state={state} mutate={mutate} actor={actor} mode="view" onClose={() => setViewJobId(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4908-1

Owner `StoreDesk`; [src/App.tsx:4908](../src/App.tsx); tag `StoreList`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={activeMenuItem} kind="reconcile" inventory={state.inventory} requests={reconcileRequests} onOpenJob={openJob} onReconcile={setReconcileCandidate} filterLayout={filterLayout}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-4918-1

Owner `StoreDesk`; [src/App.tsx:4918](../src/App.tsx); tag `ReconcileEditor`.

Visibility: reconcileCandidate

```tsx
row={reconcileCandidate} mutate={mutate} onClose={() => setReconcileCandidate(undefined)}
```

Label/content expression:

```tsx

```

#### FORM-App-tsx-4979-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:4979](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="desk-panel" onSubmit={save}
```

Label/content expression:

```tsx
 <PanelTitle icon={<PackageCheck />} title="Purchase, Stock & Issue" subtitle="Complete a requested new item in one audited operation" /> {!pending.length ? ( <p className="empty-state">No pending new-item requests.</p> ) : ( <> <label> Pending request <select value={requestId} onChange={(event) => setRequestId(Number(event.target.value))} > {pending.map(({ view, purchaseRequest }) => ( <option key={purchaseRequest.id} value={purchaseRequest.id}> {view.job.job_no} · {purchaseRequest.item_name} ·{" "} {purchaseRequest.quantity} {purchaseRequest.unit} </option> ))} </select> </label> <label> Map to inventory item (optional) <select value={itemId} onChange={(event) => setItemId(Number(event.target.value))} > <option value={0}>Create inventory item</option> {state.inventory .filter((item) => item.unit === selected?.purchaseRequest.unit) .map((item) => ( <option key={item.id} value={item.id}> {item.name} · {item.sku} </option> ))} </select> </label> {!itemId && ( <div className="form-grid"> <label> SKU <input value={sku} onChange={(event) => setSku(event.target.value)} placeholder={`LOCAL-${requestId}`} /> </label> <label> Category <input value={category} onChange={(event) => setCategory(event.target.value)} /> </label> </div> )} <div className="form-grid"> <label> Unit cost <input required type="number" min="0" step="0.01" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))} /> </label> <label> Vendor / shop <input required value={vendor} onChange={(event) => setVendor(event.target.value)} /> </label> <label> Bill / reference <input required value={billReference} onChange={(event) => setBillReference(event.target.value)} /> </label> </div> <label> Note (optional) <textarea value={note} onChange={(event) => setNote(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} <button className="primary-action">Purchase, Stock & Issue</button> </> )} 
```

#### ACT-App-tsx-4991-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:4991](../src/App.tsx); tag `select`.

Visibility: !pending.length

```tsx
value={requestId} onChange={(event) => setRequestId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {pending.map(({ view, purchaseRequest }) => ( <option key={purchaseRequest.id} value={purchaseRequest.id}> {view.job.job_no} · {purchaseRequest.item_name} ·{" "} {purchaseRequest.quantity} {purchaseRequest.unit} </option> ))} 
```

#### ACT-App-tsx-5005-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5005](../src/App.tsx); tag `select`.

Visibility: !pending.length

```tsx
value={itemId} onChange={(event) => setItemId(Number(event.target.value))}
```

Label/content expression:

```tsx
 <option value={0}>Create inventory item</option> {state.inventory .filter((item) => item.unit === selected?.purchaseRequest.unit) .map((item) => ( <option key={item.id} value={item.id}> {item.name} · {item.sku} </option> ))} 
```

#### ACT-App-tsx-5023-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5023](../src/App.tsx); tag `input`.

Visibility: !itemId; !pending.length

```tsx
value={sku} onChange={(event) => setSku(event.target.value)} placeholder={`LOCAL-${requestId}`}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5031-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5031](../src/App.tsx); tag `input`.

Visibility: !itemId; !pending.length

```tsx
value={category} onChange={(event) => setCategory(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5041-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5041](../src/App.tsx); tag `input`.

Visibility: !pending.length

```tsx
required type="number" min="0" step="0.01" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5052-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5052](../src/App.tsx); tag `input`.

Visibility: !pending.length

```tsx
required value={vendor} onChange={(event) => setVendor(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5060-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5060](../src/App.tsx); tag `input`.

Visibility: !pending.length

```tsx
required value={billReference} onChange={(event) => setBillReference(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5069-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5069](../src/App.tsx); tag `textarea`.

Visibility: !pending.length

```tsx
value={note} onChange={(event) => setNote(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-5075-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5075](../src/App.tsx); tag `p`.

Visibility: error; !pending.length

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-5079-1

Owner `PurchaseStockIssueEditor`; [src/App.tsx:5079](../src/App.tsx); tag `button`.

Visibility: !pending.length

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Purchase, Stock & Issue
```

#### ACT-App-tsx-5358-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5358](../src/App.tsx); tag `button`.

Visibility: (actor.role === "admin" \|\| actor.role === "store")

```tsx
className="primary-action" onClick={openNew}
```

Label/content expression:

```tsx
 <Plus size={16} /> New Purchase Request 
```

#### ACT-App-tsx-5366-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5366](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search purchase orders" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="PO number or supplier"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5375-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5375](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Purchase order status" value={status} onChange={(event) => setStatus(event.target.value)}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> {[ "PO Request", "PO Request Approved", "PO Issued", "PO Received", "PO Confirmation", "Draft", "Sent", "Partially Received", "Ready to Close", "Closed", "Cancelled", ].map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-5398-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5398](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setStatus("ALL"); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5429-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5429](../src/App.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={order.id} className="clickable-row" onClick={() => openView(order)}
```

Label/content expression:

```tsx
 <td>{order.po_number}</td> <td>{order.order_date}</td> <td>{supplierName(order.supplier_id)}</td> <td> {orderLines.reduce( (sum, line) => sum + line.ordered_qty, 0, )} </td> <td>{received}</td> <td>{money(order.total)}</td> <td> <span className="status-badge">{order.status}</span> </td> <td> <div className="grid-actions purchase-order-actions"> {order.status === "PO Request" && (actor.role === "admin" \|\| order.created_by === actor.id) && ( <button type="button" className="workflow-action action-secondary purchase-order-action" onClick={(event) => { event.stopPropagation(); openEdit(order); }} > <Pencil size={15} /> Edit </button> )} <button type="button" className="workflow-action action-document purchase-order-action" onClick={(event) => { event.stopPropagation(); openView(order); }} > <Workflow size={15} /> Process </button> </div> </td> 
```

#### ACT-App-tsx-5452-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5452](../src/App.tsx); tag `button`.

Visibility: order.status === "PO Request" && (actor.role === "admin" \|\| order.created_by === actor.id)

```tsx
type="button" className="workflow-action action-secondary purchase-order-action" onClick={(event) => { event.stopPropagation(); openEdit(order); }}
```

Label/content expression:

```tsx
 <Pencil size={15} /> Edit 
```

#### ACT-App-tsx-5464-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5464](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="workflow-action action-document purchase-order-action" onClick={(event) => { event.stopPropagation(); openView(order); }}
```

Label/content expression:

```tsx
 <Workflow size={15} /> Process 
```

#### STATE-App-tsx-5485-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5485](../src/App.tsx); tag `Dialog`.

Visibility: dialog === "form"

```tsx
wide className="purchase-request-dialog" title={selectedId ? `Edit ${selected?.po_number ?? "Purchase Request"}` : "New Purchase Request"} subtitle="PO number is assigned automatically. Supplier and pricing are completed by Admin after review." onClose={close} footer={ <button type="button" className="primary-action" disabled={!valid} onClick={save} > {selectedId ? "Save request" : "Create request"} </button> }
```

Label/content expression:

```tsx
 <div className="inward-dialog-content"> <div className="form-grid"> <label> PO number <input aria-label="PO number" value={selected?.po_number ?? nextPurchaseRequestNumber} disabled readOnly /> </label> <label> Order date <input aria-label="PO order date" type="date" value={orderDate} onChange={(event) => setOrderDate(event.target.value)} /> </label> <label> Notes <input aria-label="PO notes" value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <label> Supplier <input aria-label="PO supplier" value="Assigned by Admin after request" disabled readOnly /> </label> </div> <section> <div className="receipt-lines-heading"> <h4>Order lines</h4> <button type="button" onClick={() => state.inventory[0] && setLines((current) => [ ...current, { key: crypto.randomUUID(), item_id: state.inventory[0].id, new_item: false, ordered_qty: 1, }, ]) } > Add line </button> </div> {lines.map((line, index) => ( <div className={`receipt-line-row purchase-request-line-row${line.new_item ? " purchase-request-line-row--new" : ""}`} key={line.key} > <label> Item type <select value={line.new_item ? "new" : "inventory"} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, new_item: event.target.value === "new", item_id: event.target.value === "new" ? undefined : state.inventory[0]?.id, item_name: "", unit: "" } : candidate))}> <option value="inventory">Existing inventory SKU</option> <option value="new">New item request</option> </select> </label> {line.new_item ? ( <> <label>New item name<input aria-label={`PO line ${index + 1} new item name`} value={line.item_name ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_name: event.target.value } : candidate))} /></label> <label>Unit<input aria-label={`PO line ${index + 1} unit`} value={line.unit ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, unit: event.target.value } : candidate))} /></label> </> ) : <InventoryPicker inventory={state.inventory} value={line.item_id ?? 0} onChange={(item_id) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_id } : candidate))} label={`PO line ${index + 1} item`} />} <label> Qty <input aria-label={`PO line ${index + 1} quantity`} type="number" min="0.01" value={line.ordered_qty} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, ordered_qty: Number(event.target.value), } : candidate, ), ) } /> </label> <button type="button" className="danger-action" onClick={() => setLines((current) => current.filter( (candidate) => candidate.key !== line.key, ), ) } > Remove </button> </div> ))} </section> </div> 
```

#### ACT-App-tsx-5492-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5492](../src/App.tsx); tag `button`.

Visibility: dialog === "form"

```tsx
type="button" className="primary-action" disabled={!valid} onClick={save}
```

Label/content expression:

```tsx
 {selectedId ? "Save request" : "Create request"} 
```

#### ACT-App-tsx-5506-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5506](../src/App.tsx); tag `input`.

Visibility: dialog === "form"

```tsx
aria-label="PO number" value={selected?.po_number ?? nextPurchaseRequestNumber} disabled readOnly
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5515-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5515](../src/App.tsx); tag `input`.

Visibility: dialog === "form"

```tsx
aria-label="PO order date" type="date" value={orderDate} onChange={(event) => setOrderDate(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5524-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5524](../src/App.tsx); tag `input`.

Visibility: dialog === "form"

```tsx
aria-label="PO notes" value={notes} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5532-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5532](../src/App.tsx); tag `input`.

Visibility: dialog === "form"

```tsx
aria-label="PO supplier" value="Assigned by Admin after request" disabled readOnly
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5543-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5543](../src/App.tsx); tag `button`.

Visibility: dialog === "form"

```tsx
type="button" onClick={() => state.inventory[0] && setLines((current) => [ ...current, { key: crypto.randomUUID(), item_id: state.inventory[0].id, new_item: false, ordered_qty: 1, }, ]) }
```

Label/content expression:

```tsx
Add line 
```

#### ACT-App-tsx-5568-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5568](../src/App.tsx); tag `select`.

Visibility: dialog === "form"

```tsx
value={line.new_item ? "new" : "inventory"} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, new_item: event.target.value === "new", item_id: event.target.value === "new" ? undefined : state.inventory[0]?.id, item_name: "", unit: "" } : candidate))}
```

Label/content expression:

```tsx
 <option value="inventory">Existing inventory SKU</option> <option value="new">New item request</option> 
```

#### ACT-App-tsx-5575-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5575](../src/App.tsx); tag `input`.

Visibility: line.new_item; dialog === "form"

```tsx
aria-label={`PO line ${index + 1} new item name`} value={line.item_name ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_name: event.target.value } : candidate))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5576-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5576](../src/App.tsx); tag `input`.

Visibility: line.new_item; dialog === "form"

```tsx
aria-label={`PO line ${index + 1} unit`} value={line.unit ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, unit: event.target.value } : candidate))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5578-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5578](../src/App.tsx); tag `InventoryPicker`.

Visibility: line.new_item; dialog === "form"

```tsx
inventory={state.inventory} value={line.item_id ?? 0} onChange={(item_id) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_id } : candidate))} label={`PO line ${index + 1} item`}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5581-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5581](../src/App.tsx); tag `input`.

Visibility: dialog === "form"

```tsx
aria-label={`PO line ${index + 1} quantity`} type="number" min="0.01" value={line.ordered_qty} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, ordered_qty: Number(event.target.value), } : candidate, ), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5600-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5600](../src/App.tsx); tag `button`.

Visibility: dialog === "form"

```tsx
type="button" className="danger-action" onClick={() => setLines((current) => current.filter( (candidate) => candidate.key !== line.key, ), ) }
```

Label/content expression:

```tsx
Remove 
```

#### STATE-App-tsx-5620-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5620](../src/App.tsx); tag `Dialog`.

Visibility: dialog === "view" && selected

```tsx
wide title={selected.po_number} subtitle={`${supplierName(selected.supplier_id)} · ${selected.status}`} onClose={close} footer={ <> {selected.status === "Draft" && actor.role === "admin" && ( <> <button type="button" className="primary-action" onClick={() => openEdit(selected)} > Edit draft </button> <button type="button" onClick={() => mutate((db) => setPurchaseOrderStatusForActor( db, selected.id, actor.id, "send", ), ) } > Send saved PO </button> </> )} {selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id) && ( <> {actor.role === "admin" && ( <button type="button" className="primary-action" onClick={() => beginApproval(selected)} > Review & approve request </button> )} <button type="button" className="primary-action" onClick={() => openEdit(selected)} > Edit request </button> <button type="button" className="danger-action" onClick={() => mutate((db) => cancelPurchaseRequestForActor(db, selected.id, actor.id), ) } > Cancel request </button> </> )} {selected.status === "PO Request Approved" && actor.role === "admin" && ( <button type="button" className="primary-action" onClick={() => mutate((db) => issuePurchaseOrderForActor(db, selected.id, actor.id), ) } > Issue Purchase Order </button> )} {actor.role === "admin" && ["PO Issued", "PO Received"].includes(selected.status) && ( <button type="button" className="primary-action" onClick={() => beginReceipt(selected)}> Record delivery </button> )} {actor.role === "admin" && selected.status === "PO Received" && ( <button type="button" onClick={() => beginConfirmation(selected)}> Confirm quantities </button> )} {actor.role === "admin" && selected.status === "PO Confirmation" && ( <button type="button" className="primary-action" onClick={() => mutate((db) => closePurchaseOrderForActor(db, selected.id, actor.id), ) } > Close PO & post Stock Inward </button> )} {actor.role === "admin" && [ "Draft", "Sent", "Partially Received", "Ready to Close", ].includes(selected.status) && ( <button type="button" className="danger-action" onClick={() => mutate((db) => setPurchaseOrderStatusForActor( db, selected.id, actor.id, "cancel", ), ) } > Cancel PO </button> )} {actor.role === "admin" && ["Sent", "Partially Received", "Ready to Close"].includes( selected.status, ) && ( <button type="button" onClick={() => mutate((db) => setPurchaseOrderStatusForActor( db, selected.id, actor.id, "close", ), ) } > Close PO </button> )} </> }
```

Label/content expression:

```tsx
 <div className="inward-dialog-content"> <PurchaseOrderLifecycle status={selected.status} /> {selected.status === "Closed" && ( <section className="purchase-order-stage-context" aria-label="Closed Purchase Order audit"> <strong>PO Closed — view only</strong> <p> Accepted quantities were posted to Stock Inward at closure. This commercial record is locked for audit. </p> <button type="button" className="workflow-action action-document" onClick={() => downloadClosedAudit(selected, selectedLines)} > <Download size={15} /> Download closed PO audit </button> </section> )} {selected.status === "PO Request Approved" && ( <p className="purchase-order-stage-context"> {actor.role === "admin" ? "This Purchase Order is fully approved. Issue it to its assigned supplier when you are ready to request delivery." : "This Purchase Order is fully approved and awaiting Admin issue to its assigned supplier."} </p> )} {[ "PO Issued", "PO Received", "PO Confirmation", "Closed", "Partially Received", "Ready to Close", ].includes(selected.status) && ( <SupplierBasket supplier={state.suppliers.find( (supplier) => supplier.id === selected.supplier_id, )} lines={selectedLines} /> )} <p> <strong>Order vs received:</strong> {totalOrdered} ordered ·{" "} {totalReceived} received · {totalOrdered - totalReceived}{" "} remaining · {money(receivedValue)} received value </p> <p className="muted"> Delivery does not update inventory. Admin confirms every delivered unit as accepted, returned, damaged, or wasted before the PO can close. </p> <div className="table-wrap"> <table aria-label="Purchase order reconciliation"> <thead> <tr> <th>Item</th> <th>Ordered</th> <th>Delivered</th> <th>Outstanding</th> <th>Accepted</th> <th>Exceptions</th> </tr> </thead> <tbody> {selectedLines.map((line) => { const received = deliveredFor(line); const confirmation = confirmationFor(line); const item = state.inventory.find( (candidate) => candidate.id === line.item_id, ); return ( <tr key={line.id}> <td> {item?.sku} · {item?.name} </td> <td>{line.ordered_qty}</td> <td>{received}</td> <td>{Math.max(0, line.ordered_qty - received)}</td> <td>{confirmation?.accepted_qty ?? "—"}</td> <td>{confirmation ? `${confirmation.returned_qty} returned / ${confirmation.damaged_qty} damaged / ${confirmation.wasted_qty} wasted` : "—"}</td> </tr> ); })} </tbody> </table> </div> {actor.role === "admin" && selected.status === "PO Request" && <PreviousPriceReview state={state} order={selected} lines={selectedLines} actor={actor} mutate={mutate} />} <h4>Linked stock inward history</h4> {state.stock_inwards.filter( (inward) => inward.purchase_order_id === selected.id, ).length ? ( <ul> {state.stock_inwards .filter((inward) => inward.purchase_order_id === selected.id) .map((inward) => ( <li key={inward.id}> {inward.received_at}: {inward.qty}{" "} { state.inventory.find( (item) => item.id === inward.item_id, )?.unit }{" "} · {inward.note} </li> ))} </ul> ) : ( <p className="empty-state">No linked receipts yet.</p> )} {selected.status === "Cancelled" && totalReceived < totalOrdered && ( <p className="error-text"> Outstanding balance cancelled: {totalOrdered - totalReceived}{" "} not received. </p> )} </div> 
```

#### ACT-App-tsx-5629-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5629](../src/App.tsx); tag `button`.

Visibility: selected.status === "Draft" && actor.role === "admin"; dialog === "view" && selected

```tsx
type="button" className="primary-action" onClick={() => openEdit(selected)}
```

Label/content expression:

```tsx
Edit draft 
```

#### ACT-App-tsx-5636-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5636](../src/App.tsx); tag `button`.

Visibility: selected.status === "Draft" && actor.role === "admin"; dialog === "view" && selected

```tsx
type="button" onClick={() => mutate((db) => setPurchaseOrderStatusForActor( db, selected.id, actor.id, "send", ), ) }
```

Label/content expression:

```tsx
Send saved PO 
```

#### ACT-App-tsx-5657-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5657](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin"; selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id); dialog === "view" && selected

```tsx
type="button" className="primary-action" onClick={() => beginApproval(selected)}
```

Label/content expression:

```tsx
Review & approve request 
```

#### ACT-App-tsx-5665-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5665](../src/App.tsx); tag `button`.

Visibility: selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id); dialog === "view" && selected

```tsx
type="button" className="primary-action" onClick={() => openEdit(selected)}
```

Label/content expression:

```tsx
Edit request 
```

#### ACT-App-tsx-5672-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5672](../src/App.tsx); tag `button`.

Visibility: selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id); dialog === "view" && selected

```tsx
type="button" className="danger-action" onClick={() => mutate((db) => cancelPurchaseRequestForActor(db, selected.id, actor.id), ) }
```

Label/content expression:

```tsx
Cancel request 
```

#### ACT-App-tsx-5686-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5686](../src/App.tsx); tag `button`.

Visibility: selected.status === "PO Request Approved" && actor.role === "admin"; dialog === "view" && selected

```tsx
type="button" className="primary-action" onClick={() => mutate((db) => issuePurchaseOrderForActor(db, selected.id, actor.id), ) }
```

Label/content expression:

```tsx
Issue Purchase Order 
```

#### ACT-App-tsx-5699-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5699](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin" && ["PO Issued", "PO Received"].includes(selected.status); dialog === "view" && selected

```tsx
type="button" className="primary-action" onClick={() => beginReceipt(selected)}
```

Label/content expression:

```tsx
Record delivery 
```

#### ACT-App-tsx-5704-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5704](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin" && selected.status === "PO Received"; dialog === "view" && selected

```tsx
type="button" onClick={() => beginConfirmation(selected)}
```

Label/content expression:

```tsx
Confirm quantities 
```

#### ACT-App-tsx-5709-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5709](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin" && selected.status === "PO Confirmation"; dialog === "view" && selected

```tsx
type="button" className="primary-action" onClick={() => mutate((db) => closePurchaseOrderForActor(db, selected.id, actor.id), ) }
```

Label/content expression:

```tsx
Close PO & post Stock Inward 
```

#### ACT-App-tsx-5727-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5727](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin" && [ "Draft", "Sent", "Partially Received", "Ready to Close", ].includes(selected.status); dialog === "view" && selected

```tsx
type="button" className="danger-action" onClick={() => mutate((db) => setPurchaseOrderStatusForActor( db, selected.id, actor.id, "cancel", ), ) }
```

Label/content expression:

```tsx
Cancel PO 
```

#### ACT-App-tsx-5747-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5747](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin" && ["Sent", "Partially Received", "Ready to Close"].includes( selected.status, ); dialog === "view" && selected

```tsx
type="button" onClick={() => mutate((db) => setPurchaseOrderStatusForActor( db, selected.id, actor.id, "close", ), ) }
```

Label/content expression:

```tsx
Close PO 
```

#### ACT-App-tsx-5774-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5774](../src/App.tsx); tag `button`.

Visibility: selected.status === "Closed"; dialog === "view" && selected

```tsx
type="button" className="workflow-action action-document" onClick={() => downloadClosedAudit(selected, selectedLines)}
```

Label/content expression:

```tsx
 <Download size={15} /> Download closed PO audit 
```

#### STATE-App-tsx-5883-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5883](../src/App.tsx); tag `Dialog`.

Visibility: dialog === "receipt" && selected

```tsx
title={`Record delivery — ${selected.po_number}`} subtitle="Enter this supplier delivery only. Inventory will not change until the confirmed PO is closed." onClose={close} footer={<button type="button" className="primary-action" onClick={() => { const lines = receiptLines.filter((line) => line.delivered_qty > 0); if (mutate((db) => recordPurchaseOrderReceiptForActor(db, selected.id, actor.id, { lines }))) setDialog("view"); }}>Save delivery</button>}
```

Label/content expression:

```tsx
 <div className="inward-dialog-content" aria-label="Purchase Order delivery receipt"> {selectedLines.map((line, index) => { const item = state.inventory.find((candidate) => candidate.id === line.item_id); const delivered = deliveredFor(line); const formLine = receiptLines.find((candidate) => candidate.purchase_order_line_id === line.id); return <label key={line.id} className="receipt-line-row"> {item?.sku} · {item?.name ?? line.item_name} — ordered {line.ordered_qty}, delivered {delivered}, outstanding {line.ordered_qty - delivered} <input aria-label={`Delivered quantity for PO line ${index + 1}`} type="number" min="0" max={Math.max(0, line.ordered_qty - delivered)} step="0.01" value={formLine?.delivered_qty \|\| ""} onChange={(event) => setReceiptLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, delivered_qty: Number(event.target.value) } : candidate))} /> </label>; })} </div> 
```

#### ACT-App-tsx-5887-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5887](../src/App.tsx); tag `button`.

Visibility: dialog === "receipt" && selected

```tsx
type="button" className="primary-action" onClick={() => { const lines = receiptLines.filter((line) => line.delivered_qty > 0); if (mutate((db) => recordPurchaseOrderReceiptForActor(db, selected.id, actor.id, { lines }))) setDialog("view"); }}
```

Label/content expression:

```tsx
Save delivery
```

#### ACT-App-tsx-5899-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5899](../src/App.tsx); tag `input`.

Visibility: dialog === "receipt" && selected

```tsx
aria-label={`Delivered quantity for PO line ${index + 1}`} type="number" min="0" max={Math.max(0, line.ordered_qty - delivered)} step="0.01" value={formLine?.delivered_qty \|\| ""} onChange={(event) => setReceiptLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, delivered_qty: Number(event.target.value) } : candidate))}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-5906-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5906](../src/App.tsx); tag `Dialog`.

Visibility: dialog === "confirm" && selected

```tsx
wide title={`Confirm quantities — ${selected.po_number}`} subtitle="Every delivered unit must be accepted, returned, damaged, or wasted before this PO can move to confirmation." onClose={close} footer={<button type="button" className="primary-action" onClick={() => { if (mutate((db) => confirmPurchaseOrderForActor(db, selected.id, actor.id, { lines: confirmationLines }))) setDialog("view"); }}>Confirm quantities</button>}
```

Label/content expression:

```tsx
 <div className="inward-dialog-content" aria-label="Purchase Order quality confirmation"> {selectedLines.map((line, index) => { const item = state.inventory.find((candidate) => candidate.id === line.item_id); const delivered = deliveredFor(line); const formLine = confirmationLines.find((candidate) => candidate.purchase_order_line_id === line.id); if (!formLine) return null; const update = (patch: Partial<typeof formLine>) => setConfirmationLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, ...patch } : candidate)); return <section className="approval-line" key={line.id}> <h4>{index + 1}. {item?.sku} · {item?.name ?? line.item_name} <span className="muted">Delivered {delivered} / ordered {line.ordered_qty}</span></h4> <div className="form-grid"> <label>Accepted<input aria-label={`Accepted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.accepted_qty} onChange={(event) => update({ accepted_qty: Number(event.target.value) })} /></label> <label>Returned<input aria-label={`Returned quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.returned_qty} onChange={(event) => update({ returned_qty: Number(event.target.value) })} /></label> <label>Damaged<input aria-label={`Damaged quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.damaged_qty} onChange={(event) => update({ damaged_qty: Number(event.target.value) })} /></label> <label>Wasted<input aria-label={`Wasted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.wasted_qty} onChange={(event) => update({ wasted_qty: Number(event.target.value) })} /></label> </div> </section>; })} </div> 
```

#### ACT-App-tsx-5911-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5911](../src/App.tsx); tag `button`.

Visibility: dialog === "confirm" && selected

```tsx
type="button" className="primary-action" onClick={() => { if (mutate((db) => confirmPurchaseOrderForActor(db, selected.id, actor.id, { lines: confirmationLines }))) setDialog("view"); }}
```

Label/content expression:

```tsx
Confirm quantities
```

#### ACT-App-tsx-5925-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5925](../src/App.tsx); tag `input`.

Visibility: dialog === "confirm" && selected

```tsx
aria-label={`Accepted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.accepted_qty} onChange={(event) => update({ accepted_qty: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5926-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5926](../src/App.tsx); tag `input`.

Visibility: dialog === "confirm" && selected

```tsx
aria-label={`Returned quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.returned_qty} onChange={(event) => update({ returned_qty: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5927-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5927](../src/App.tsx); tag `input`.

Visibility: dialog === "confirm" && selected

```tsx
aria-label={`Damaged quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.damaged_qty} onChange={(event) => update({ damaged_qty: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5928-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5928](../src/App.tsx); tag `input`.

Visibility: dialog === "confirm" && selected

```tsx
aria-label={`Wasted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.wasted_qty} onChange={(event) => update({ wasted_qty: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-5936-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5936](../src/App.tsx); tag `Dialog`.

Visibility: dialog === "approve" && selected

```tsx
wide title={`Approve ${selected.po_number}`} subtitle="Assign each line to an active supplier and enter its pre-GST price. Different suppliers create traceable supplier-specific Purchase Orders." onClose={close} footer={<button type="button" className="primary-action" onClick={approveRequest}>Approve Purchase Request</button>}
```

Label/content expression:

```tsx
 <div className="inward-dialog-content" aria-label="Purchase Request commercial approval"> <p className="muted">New Item Requests need catalogue details now. Their SKU is created with zero stock and will not become issuable until later receipt and closure steps.</p> {selectedLines.map((requestLine, index) => { const formLine = approvalLines.find((line) => line.purchase_order_line_id === requestLine.id); if (!formLine) return null; const item = state.inventory.find((candidate) => candidate.id === requestLine.item_id); const update = (patch: Partial<PurchaseRequestApprovalFormLine>) => setApprovalLines((current) => current.map((line) => line.purchase_order_line_id === requestLine.id ? { ...line, ...patch } : line)); return <section className="approval-line" key={requestLine.id}> <h4>{index + 1}. {item ? `${item.sku} · ${item.name}` : requestLine.item_name} <span className="muted">× {requestLine.ordered_qty} {item?.unit ?? requestLine.unit}</span></h4> <div className="form-grid"> <label>Supplier<select aria-label={`Supplier for PO line ${index + 1}`} value={formLine.supplier_id} onChange={(event) => update({ supplier_id: Number(event.target.value) })}><option value={0}>Select active supplier</option>{state.suppliers.filter((supplier) => supplier.status === "Active").map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label> <label>Pre-GST unit cost<input aria-label={`Pre-GST price for PO line ${index + 1}`} type="number" min="0.01" step="0.01" value={formLine.unit_cost \|\| ""} onChange={(event) => update({ unit_cost: Number(event.target.value) })} /></label> </div> {!item && <div className="form-grid approval-new-item"><label>SKU<input aria-label={`SKU for PO line ${index + 1}`} value={formLine.sku} onChange={(event) => update({ sku: event.target.value })} /></label><label>Category<input aria-label={`Category for PO line ${index + 1}`} value={formLine.category} onChange={(event) => update({ category: event.target.value })} /></label><label>Name<input aria-label={`Catalogue name for PO line ${index + 1}`} value={formLine.name} onChange={(event) => update({ name: event.target.value })} /></label><label>Unit<input aria-label={`Catalogue unit for PO line ${index + 1}`} value={formLine.unit} onChange={(event) => update({ unit: event.target.value })} /></label><label>Low-stock threshold<input aria-label={`Low stock threshold for PO line ${index + 1}`} type="number" min="0" value={formLine.low_stock_qty} onChange={(event) => update({ low_stock_qty: Number(event.target.value) })} /></label><label>Selling price<input aria-label={`Selling price for PO line ${index + 1}`} type="number" min="0" value={formLine.selling_price} onChange={(event) => update({ selling_price: Number(event.target.value) })} /></label></div>} </section>; })} </div> 
```

#### ACT-App-tsx-5941-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5941](../src/App.tsx); tag `button`.

Visibility: dialog === "approve" && selected

```tsx
type="button" className="primary-action" onClick={approveRequest}
```

Label/content expression:

```tsx
Approve Purchase Request
```

#### ACT-App-tsx-5953-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5953](../src/App.tsx); tag `select`.

Visibility: dialog === "approve" && selected

```tsx
aria-label={`Supplier for PO line ${index + 1}`} value={formLine.supplier_id} onChange={(event) => update({ supplier_id: Number(event.target.value) })}
```

Label/content expression:

```tsx
<option value={0}>Select active supplier</option> {state.suppliers.filter((supplier) => supplier.status === "Active").map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
```

#### ACT-App-tsx-5954-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5954](../src/App.tsx); tag `input`.

Visibility: dialog === "approve" && selected

```tsx
aria-label={`Pre-GST price for PO line ${index + 1}`} type="number" min="0.01" step="0.01" value={formLine.unit_cost \|\| ""} onChange={(event) => update({ unit_cost: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5956-1

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5956](../src/App.tsx); tag `input`.

Visibility: !item; dialog === "approve" && selected

```tsx
aria-label={`SKU for PO line ${index + 1}`} value={formLine.sku} onChange={(event) => update({ sku: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5956-2

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5956](../src/App.tsx); tag `input`.

Visibility: !item; dialog === "approve" && selected

```tsx
aria-label={`Category for PO line ${index + 1}`} value={formLine.category} onChange={(event) => update({ category: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5956-3

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5956](../src/App.tsx); tag `input`.

Visibility: !item; dialog === "approve" && selected

```tsx
aria-label={`Catalogue name for PO line ${index + 1}`} value={formLine.name} onChange={(event) => update({ name: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5956-4

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5956](../src/App.tsx); tag `input`.

Visibility: !item; dialog === "approve" && selected

```tsx
aria-label={`Catalogue unit for PO line ${index + 1}`} value={formLine.unit} onChange={(event) => update({ unit: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5956-5

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5956](../src/App.tsx); tag `input`.

Visibility: !item; dialog === "approve" && selected

```tsx
aria-label={`Low stock threshold for PO line ${index + 1}`} type="number" min="0" value={formLine.low_stock_qty} onChange={(event) => update({ low_stock_qty: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-5956-6

Owner `PurchaseOrdersWorkspace`; [src/App.tsx:5956](../src/App.tsx); tag `input`.

Visibility: !item; dialog === "approve" && selected

```tsx
aria-label={`Selling price for PO line ${index + 1}`} type="number" min="0" value={formLine.selling_price} onChange={(event) => update({ selling_price: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6052-1

Owner `PreviousPriceReview`; [src/App.tsx:6052](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={() => quotationLineId === line.id ? setQuotationLineId(undefined) : beginQuotation(line)}
```

Label/content expression:

```tsx
{quotationLineId === line.id ? "Cancel quotation" : "Add quotation"}
```

#### ACT-App-tsx-6053-1

Owner `PreviousPriceReview`; [src/App.tsx:6053](../src/App.tsx); tag `input`.

Visibility: quotationLineId === line.id

```tsx
aria-label={`Quotation supplier for ${line.id}`} value={supplierName} onChange={(event) => setSupplierName(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6053-2

Owner `PreviousPriceReview`; [src/App.tsx:6053](../src/App.tsx); tag `input`.

Visibility: quotationLineId === line.id

```tsx
aria-label={`Quotation date for ${line.id}`} type="date" value={quoteDate} onChange={(event) => setQuoteDate(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6053-3

Owner `PreviousPriceReview`; [src/App.tsx:6053](../src/App.tsx); tag `input`.

Visibility: quotationLineId === line.id

```tsx
aria-label={`Quotation quantity for ${line.id}`} type="number" min="0.01" value={quotedQty} onChange={(event) => setQuotedQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6053-4

Owner `PreviousPriceReview`; [src/App.tsx:6053](../src/App.tsx); tag `input`.

Visibility: quotationLineId === line.id

```tsx
aria-label={`Quotation price for ${line.id}`} type="number" min="0" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6053-5

Owner `PreviousPriceReview`; [src/App.tsx:6053](../src/App.tsx); tag `input`.

Visibility: quotationLineId === line.id

```tsx
aria-label={`Quotation notes for ${line.id}`} value={notes} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6053-6

Owner `PreviousPriceReview`; [src/App.tsx:6053](../src/App.tsx); tag `button`.

Visibility: quotationLineId === line.id

```tsx
type="button" className="primary-action" onClick={() => mutate((db) => { savePurchaseOrderQuotationForActor(db, order.id, actor.id, { purchase_order_line_id: line.id, supplier_name: supplierName, quote_date: quoteDate, quoted_qty: quotedQty, unit_cost: unitCost, notes }); setQuotationLineId(undefined); })}
```

Label/content expression:

```tsx
Save quotation
```

#### ACT-App-tsx-6295-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6295](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search inward purchases" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Supplier, invoice or PO"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6304-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6304](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Inward purchase status" value={status} onChange={(event) => setStatus(event.target.value)}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> <option>Draft</option> <option>Submitted</option> 
```

#### ACT-App-tsx-6314-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6314](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setStatus("ALL"); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6322-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6322](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={reset}
```

Label/content expression:

```tsx
 <Plus size={16} /> New inward purchase 
```

#### ACT-App-tsx-6375-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6375](../src/App.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={purchase.id} className={`clickable-row${purchase.id === selectedId ? " selected-register-row" : ""}`} aria-selected={purchase.id === selectedId} onClick={() => { setSelectedId(purchase.id); setComposerOpen(true); }}
```

Label/content expression:

```tsx
 <td>{purchase.invoice_date \|\| "—"}</td> <td>{supplierName(purchase.supplier_id)}</td> <td>{purchase.supplier_invoice_no \|\| "—"}</td> <td>{purchase.po_number \|\| "—"}</td> <td>{money(purchase.total)}</td> <td> <span className="status-badge">{purchase.status}</span> </td> <td>{lineCount}</td> <td> {attachment ? ( <a href={attachment.document_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} > Open </a> ) : ( "—" )} </td> 
```

#### ACT-App-tsx-6395-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6395](../src/App.tsx); tag `a`.

Visibility: attachment

```tsx
href={attachment.document_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}
```

Label/content expression:

```tsx
Open 
```

#### FORM-App-tsx-6414-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6414](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="desk-panel inward-composer" onSubmit={(event) => { event.preventDefault(); saveDraft(); }}
```

Label/content expression:

```tsx
 <button type="button" className="inward-back" onClick={() => setComposerOpen(false)} > ← Back to register </button> <PanelTitle icon={<PackageCheck />} title={selected ? `Receipt #${selected.id}` : "New receipt draft"} subtitle={ selected?.status === "Submitted" ? "Posted receipt is immutable; Admin corrections append a revision." : "Save a draft, attach the supplier invoice, then submit." } /> {selected?.status === "Submitted" ? ( <div className="submitted-receipt"> <section> <h4>Receipt details</h4> <dl> <div> <dt>Supplier</dt> <dd>{supplierName(supplierId)}</dd> </div> <div> <dt>Invoice</dt> <dd>{invoiceNo}</dd> </div> <div> <dt>Invoice date</dt> <dd>{invoiceDate}</dd> </div> <div> <dt>PO</dt> <dd>{poNumber \|\| "—"}</dd> </div> <div> <dt>Posting status</dt> <dd> <span className="status-badge">Submitted</span> </dd> </div> </dl> </section> <section> <h4>Posted lines</h4> <div className="receipt-line-grid readonly"> {lines.map((line) => { const item = state.inventory.find( (candidate) => candidate.id === line.item_id, ); return ( <div className="receipt-line-row" key={line.key}> <span> {item?.sku} · {item?.name} </span> <span> {line.received_qty} {item?.unit} </span> <span>{money(line.unit_cost)}</span> <strong>{money(lineTotal(line))}</strong> </div> ); })} </div> <p className="receipt-total">Posted total: {money(total)}</p> </section> <section> <h4>Invoice scans</h4> {selectedAttachments.map((attachment) => ( <AttachmentItem key={attachment.id} attachment={attachment} /> ))} </section> </div> ) : ( <> <section className="receipt-header"> <h4>Receipt header</h4> <div className="form-grid"> <label> Supplier <select aria-label="Purchase supplier" required value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) } > <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} {supplier.status === "On hold" ? " (On hold)" : ""} </option> ))} </select> </label> <label> Supplier invoice no. <input aria-label="Supplier invoice number" value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)} /> </label> <label> Invoice date <input aria-label="Invoice date" type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /> </label> <label> PO number (optional) <input aria-label="PO number" value={poNumber} onChange={(event) => setPoNumber(event.target.value)} /> </label> </div> </section> <section> <div className="receipt-lines-heading"> <h4>Receipt lines</h4> <button type="button" onClick={addLine}> Add line </button> </div> <div className="receipt-line-grid"> {lines.map((line, index) => { const item = state.inventory.find( (candidate) => candidate.id === line.item_id, ); return ( <div className="receipt-line-row" key={line.key}> <InventoryPicker inventory={state.inventory} value={line.item_id} onChange={(item_id) => updateLine(line.key, { item_id }) } label={`Receipt line ${index + 1} item`} /> <small> {item?.sku} · {item?.unit} · stock {item?.stock_qty} →{" "} {projectedQuantity(line.item_id)} {item?.unit} </small> <label> Qty <input aria-label={`Receipt line ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={line.received_qty} onChange={(event) => updateLine(line.key, { received_qty: Number(event.target.value), }) } /> </label> <label> Pre-GST cost <input aria-label={`Receipt line ${index + 1} unit cost`} type="number" min="0" step="0.01" value={line.unit_cost} onChange={(event) => updateLine(line.key, { unit_cost: Number(event.target.value), }) } /> </label> <label> Discount <input aria-label={`Receipt line ${index + 1} discount`} type="number" min="0" step="0.01" value={line.discount} onChange={(event) => updateLine(line.key, { discount: Number(event.target.value), }) } /> </label> <label> GST % <input aria-label={`Receipt line ${index + 1} GST`} type="number" min="0" max="100" step="0.01" value={line.gst_rate} onChange={(event) => updateLine(line.key, { gst_rate: Number(event.target.value), }) } /> </label> <strong>{money(lineTotal(line))}</strong> <button type="button" className="danger-action" aria-label={`Remove receipt line ${index + 1}`} onClick={() => setLines((current) => current.filter((item) => item.key !== line.key), ) } > Remove </button> </div> ); })} </div> </section> <section className="receipt-attachments"> <h4>Invoice scan</h4> <label className="file-upload-button"> Attach invoice scan (PDF/JPG, max 10 MB) <input aria-label="Invoice scan" type="file" accept="application/pdf,image/jpeg" onChange={(event) => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} hidden /> </label> {selectedAttachments.map((attachment) => ( <AttachmentItem key={attachment.id} attachment={attachment} /> ))} {attachments.map((attachment, index) => ( <AttachmentItem key={`${attachment.original_name}-${index}`} attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index), ) } /> ))} </section> </> )} {selected?.status === "Submitted" && actor.role === "admin" && ( <section className="receipt-correction"> <h4>Admin correction</h4> <p> Post only the revised receipt quantities; WorkshopOS records the delta and reason. </p> <label> Correction reason <input aria-label="Correction reason" value={revisionReason} onChange={(event) => setRevisionReason(event.target.value)} placeholder="Required reason for stock delta" /> </label> <button type="button" onClick={() => mutate((db) => reviseInwardPurchaseForActor(db, selected.id, actor.id, { reason: revisionReason, lines: lines.map(({ key: _key, ...line }) => line), }), ) } > Post revision delta </button> </section> )} {editable && ( <div className="receipt-status-bar" aria-label="Receipt readiness"> <div> <strong>{money(total)}</strong> <span> {lines.length} line{lines.length === 1 ? "" : "s"} ·{" "} {hasScan ? "scan attached" : "scan needed"} </span> </div> <ul> <li className={activeSupplier ? "ready" : ""}>Active supplier</li> <li className={invoiceNo.trim() ? "ready" : ""}> Invoice number </li> <li className={validDate ? "ready" : ""}>Valid date</li> <li className={validLines ? "ready" : ""}>Valid lines</li> <li className={hasScan ? "ready" : ""}>Invoice scan</li> </ul> <div className="action-row"> <button className="primary-action">Save draft</button> {selected && ( <button type="button" className="primary-action" disabled={!ready} onClick={() => mutate((db) => submitInwardPurchaseForActor(db, selected.id, actor.id), ) } > Submit receipt </button> )} </div> </div> )} 
```

#### ACT-App-tsx-6421-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6421](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="inward-back" onClick={() => setComposerOpen(false)}
```

Label/content expression:

```tsx
← Back to register 
```

#### ACT-App-tsx-6503-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6503](../src/App.tsx); tag `select`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label="Purchase supplier" required value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) }
```

Label/content expression:

```tsx
 <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} {supplier.status === "On hold" ? " (On hold)" : ""} </option> ))} 
```

#### ACT-App-tsx-6528-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6528](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label="Supplier invoice number" value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6536-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6536](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label="Invoice date" type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6545-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6545](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label="PO number" value={poNumber} onChange={(event) => setPoNumber(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6556-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6556](../src/App.tsx); tag `button`.

Visibility: selected?.status === "Submitted"

```tsx
type="button" onClick={addLine}
```

Label/content expression:

```tsx
Add line 
```

#### ACT-App-tsx-6567-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6567](../src/App.tsx); tag `InventoryPicker`.

Visibility: selected?.status === "Submitted"

```tsx
inventory={state.inventory} value={line.item_id} onChange={(item_id) => updateLine(line.key, { item_id }) } label={`Receipt line ${index + 1} item`}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6581-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6581](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label={`Receipt line ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={line.received_qty} onChange={(event) => updateLine(line.key, { received_qty: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6596-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6596](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label={`Receipt line ${index + 1} unit cost`} type="number" min="0" step="0.01" value={line.unit_cost} onChange={(event) => updateLine(line.key, { unit_cost: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6611-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6611](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label={`Receipt line ${index + 1} discount`} type="number" min="0" step="0.01" value={line.discount} onChange={(event) => updateLine(line.key, { discount: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6626-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6626](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label={`Receipt line ${index + 1} GST`} type="number" min="0" max="100" step="0.01" value={line.gst_rate} onChange={(event) => updateLine(line.key, { gst_rate: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6641-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6641](../src/App.tsx); tag `button`.

Visibility: selected?.status === "Submitted"

```tsx
type="button" className="danger-action" aria-label={`Remove receipt line ${index + 1}`} onClick={() => setLines((current) => current.filter((item) => item.key !== line.key), ) }
```

Label/content expression:

```tsx
Remove 
```

#### ACT-App-tsx-6662-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6662](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted"

```tsx
aria-label="Invoice scan" type="file" accept="application/pdf,image/jpeg" onChange={(event) => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} hidden
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6677-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6677](../src/App.tsx); tag `AttachmentItem`.

Visibility: selected?.status === "Submitted"

```tsx
key={`${attachment.original_name}-${index}`} attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6699-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6699](../src/App.tsx); tag `input`.

Visibility: selected?.status === "Submitted" && actor.role === "admin"

```tsx
aria-label="Correction reason" value={revisionReason} onChange={(event) => setRevisionReason(event.target.value)} placeholder="Required reason for stock delta"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-6706-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6706](../src/App.tsx); tag `button`.

Visibility: selected?.status === "Submitted" && actor.role === "admin"

```tsx
type="button" onClick={() => mutate((db) => reviseInwardPurchaseForActor(db, selected.id, actor.id, { reason: revisionReason, lines: lines.map(({ key: _key, ...line }) => line), }), ) }
```

Label/content expression:

```tsx
Post revision delta 
```

#### ACT-App-tsx-6740-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6740](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save draft
```

#### ACT-App-tsx-6742-1

Owner `LegacyInwardPurchasesWorkspace`; [src/App.tsx:6742](../src/App.tsx); tag `button`.

Visibility: selected; editable

```tsx
type="button" className="primary-action" disabled={!ready} onClick={() => mutate((db) => submitInwardPurchaseForActor(db, selected.id, actor.id), ) }
```

Label/content expression:

```tsx
Submit receipt 
```

#### ACT-App-tsx-7016-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7016](../src/App.tsx); tag `button`.

Visibility: actor.role === "admin"; dialog === "approve"

```tsx
type="button" className="primary-action" onClick={approve}
```

Label/content expression:

```tsx
Approve PO 
```

#### ACT-App-tsx-7022-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7022](../src/App.tsx); tag `button`.

Visibility: editorMode; dialog === "approve"

```tsx
type="button" className="secondary-action" onClick={saveDraft}
```

Label/content expression:

```tsx
Save Draft 
```

#### ACT-App-tsx-7026-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7026](../src/App.tsx); tag `button`.

Visibility: record; editorMode; dialog === "approve"

```tsx
type="button" className="primary-action" onClick={sendForApproval}
```

Label/content expression:

```tsx
Send for PO 
```

#### ACT-App-tsx-7036-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7036](../src/App.tsx); tag `button`.

Visibility: receiveMode; editorMode; dialog === "approve"

```tsx
type="button" className="primary-action" onClick={receive}
```

Label/content expression:

```tsx
Receive & Post 
```

#### ACT-App-tsx-7040-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7040](../src/App.tsx); tag `button`.

Visibility: receivedMode && actor.role === "admin"; receiveMode; editorMode; dialog === "approve"

```tsx
type="button" className="danger-action" onClick={revise}
```

Label/content expression:

```tsx
Post revision delta 
```

#### ACT-App-tsx-7054-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7054](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" onClick={() => open("create")}
```

Label/content expression:

```tsx
 <Plus size={16} /> Add purchase record 
```

#### ACT-App-tsx-7065-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7065](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search inward purchases" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Supplier, invoice or PO"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7074-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7074](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Inward purchase status" value={status} onChange={(event) => setStatus(event.target.value)}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> <option>Draft</option> <option>Awaiting PO Approval</option> <option>Approved</option> <option>Received</option> 
```

#### ACT-App-tsx-7086-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7086](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setStatus("ALL"); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7153-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7153](../src/App.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={purchase.id} className="clickable-row" onClick={() => open( purchase.status === "Awaiting PO Approval" ? "approve" : "view", purchase.id, ) }
```

Label/content expression:

```tsx
 <td> <strong>#{purchase.id}</strong> <br /> <small>{purchase.po_number \|\| "—"}</small> </td> <td>{purchase.invoice_date \|\| "—"}</td> <td>{supplierName(purchase.supplier_id)}</td> <td>{purchase.supplier_invoice_no \|\| "—"}</td> <td>{count}</td> <td>{money(purchase.total)}</td> <td> <span className="status-badge"> {purchase.status === "Submitted" ? "Received" : purchase.status} </span> </td> <td> {attachment ? ( <a href={attachment.document_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} > Open </a> ) : ( "—" )} </td> <td> <div className="grid-actions"> <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open(reviewMode, purchase.id); }} > {purchase.status === "Draft" ? "Edit" : purchase.status === "Awaiting PO Approval" ? "Review" : "View"} </button> {purchase.status === "Draft" && ( <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("edit", purchase.id); }} > Send for PO </button> )} {purchase.status === "Awaiting PO Approval" && actor.role === "admin" && ( <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("approve", purchase.id); }} > Approve </button> )} {purchase.status === "Approved" && ( <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("receive", purchase.id); }} > Receive & Post </button> )} </div> </td> 
```

#### ACT-App-tsx-7184-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7184](../src/App.tsx); tag `a`.

Visibility: attachment

```tsx
href={attachment.document_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}
```

Label/content expression:

```tsx
Open 
```

#### ACT-App-tsx-7198-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7198](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open(reviewMode, purchase.id); }}
```

Label/content expression:

```tsx
 {purchase.status === "Draft" ? "Edit" : purchase.status === "Awaiting PO Approval" ? "Review" : "View"} 
```

#### ACT-App-tsx-7213-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7213](../src/App.tsx); tag `button`.

Visibility: purchase.status === "Draft"

```tsx
type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("edit", purchase.id); }}
```

Label/content expression:

```tsx
Send for PO 
```

#### ACT-App-tsx-7226-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7226](../src/App.tsx); tag `button`.

Visibility: purchase.status === "Awaiting PO Approval" && actor.role === "admin"

```tsx
type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("approve", purchase.id); }}
```

Label/content expression:

```tsx
Approve 
```

#### ACT-App-tsx-7238-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7238](../src/App.tsx); tag `button`.

Visibility: purchase.status === "Approved"

```tsx
type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("receive", purchase.id); }}
```

Label/content expression:

```tsx
Receive & Post 
```

#### STATE-App-tsx-7259-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7259](../src/App.tsx); tag `Dialog`.

Visibility: dialog

```tsx
wide title={dialogTitle} subtitle={ dialog === "approve" ? "Review the immutable PO snapshot before authorizing it." : receivedMode ? "Posted receipt is read-only; Admin corrections append a revision." : receiveMode ? "Record the actual received quantities, invoice details, and scan." : "Save a draft, then submit its immutable PO snapshot for approval." } onClose={close} footer={dialogFooter}
```

Label/content expression:

```tsx
 <div className="inward-dialog-content"> {dialog === "approve" ? ( <PurchaseSnapshot record={record!} lines={lines} inventory={state.inventory} supplierName={supplierName} /> ) : receivedMode && !receiveMode ? ( <> <PurchaseSnapshot record={record!} lines={lines} inventory={state.inventory} supplierName={supplierName} attachments={recordAttachments} /> {actor.role === "admin" && ( <section className="receipt-correction"> <h4>Admin correction</h4> <p> Enter the corrected receipt quantities, then provide the audit reason. </p> <ReceiptLines lines={lines} inventory={state.inventory} editableQuantity updateLine={updateLine} lineTotal={lineTotal} /> <label> Correction reason <input data-dialog-initial-focus aria-label="Correction reason" value={revisionReason} onChange={(event) => setRevisionReason(event.target.value) } required /> </label> </section> )} </> ) : ( <> <section className="receipt-header"> <h4>{receiveMode ? "Receipt header" : "Purchase header"}</h4> <div className="form-grid"> <label> Supplier {editorMode ? ( <select data-dialog-initial-focus aria-label="Purchase supplier" value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) } > <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} </option> ))} </select> ) : ( <input readOnly value={supplierName(supplierId)} /> )} </label> <label> Supplier invoice no. <input aria-label="Supplier invoice number" value={invoiceNo} readOnly={!editorMode && !receiveMode} onChange={(event) => setInvoiceNo(event.target.value)} /> </label> <label> Invoice date <input aria-label="Invoice date" type="date" value={invoiceDate} readOnly={!editorMode && !receiveMode} onChange={(event) => setInvoiceDate(event.target.value)} /> </label> {editorMode && ( <label> PO number (optional) <input aria-label="PO number" value={poNumber} onChange={(event) => setPoNumber(event.target.value)} /> </label> )} </div> </section> <section> <div className="receipt-lines-heading"> <h4> {receiveMode ? "Actual received quantities" : "Purchase lines"} </h4> {editorMode && ( <button type="button" onClick={() => { const line = freshLine(); if (line) setLines((current) => [...current, line]); }} > Add line </button> )} </div> <ReceiptLines lines={lines} inventory={state.inventory} editable={editorMode} editableQuantity={receiveMode} updateLine={updateLine} lineTotal={lineTotal} onRemove={(key) => setLines((current) => current.filter((line) => line.key !== key), ) } /> </section> {receiveMode && ( <section className="receipt-attachments"> <h4>Invoice scan</h4> <label className="file-upload-button"> Attach invoice scan (PDF/JPG, max 10 MB) <input aria-label="Invoice scan" type="file" accept="application/pdf,image/jpeg" onChange={(event) => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} hidden /> </label> {recordAttachments.map((attachment) => ( <AttachmentItem key={attachment.id} attachment={attachment} /> ))} {attachments.map((attachment, index) => ( <AttachmentItem key={`${attachment.original_name}-${index}`} attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, item) => item !== index), ) } /> ))} </section> )} <div className="receipt-status-bar" aria-label="Purchase readiness" > <strong>{money(total)}</strong> <span> {editorMode ? `${activeSupplier ? "Active supplier" : "Supplier needed"} · ${validLines ? "valid lines" : "valid lines needed"}` : `${invoiceNo.trim() && validDate && validLines && hasScan ? "Ready to post" : "Invoice, date, quantities and scan are required"}`} </span> </div> </> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} </div> 
```

#### ACT-App-tsx-7307-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7307](../src/App.tsx); tag `input`.

Visibility: actor.role === "admin"; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
data-dialog-initial-focus aria-label="Correction reason" value={revisionReason} onChange={(event) => setRevisionReason(event.target.value) } required
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7328-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7328](../src/App.tsx); tag `select`.

Visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
data-dialog-initial-focus aria-label="Purchase supplier" value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) }
```

Label/content expression:

```tsx
 <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} </option> ))} 
```

#### ACT-App-tsx-7350-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7350](../src/App.tsx); tag `input`.

Visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
readOnly value={supplierName(supplierId)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7355-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7355](../src/App.tsx); tag `input`.

Visibility: receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
aria-label="Supplier invoice number" value={invoiceNo} readOnly={!editorMode && !receiveMode} onChange={(event) => setInvoiceNo(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7364-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7364](../src/App.tsx); tag `input`.

Visibility: receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
aria-label="Invoice date" type="date" value={invoiceDate} readOnly={!editorMode && !receiveMode} onChange={(event) => setInvoiceDate(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7375-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7375](../src/App.tsx); tag `input`.

Visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
aria-label="PO number" value={poNumber} onChange={(event) => setPoNumber(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7392-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7392](../src/App.tsx); tag `button`.

Visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
type="button" onClick={() => { const line = freshLine(); if (line) setLines((current) => [...current, line]); }}
```

Label/content expression:

```tsx
Add line 
```

#### ACT-App-tsx-7403-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7403](../src/App.tsx); tag `ReceiptLines`.

Visibility: receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
lines={lines} inventory={state.inventory} editable={editorMode} editableQuantity={receiveMode} updateLine={updateLine} lineTotal={lineTotal} onRemove={(key) => setLines((current) => current.filter((line) => line.key !== key), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7422-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7422](../src/App.tsx); tag `input`.

Visibility: receiveMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
aria-label="Invoice scan" type="file" accept="application/pdf,image/jpeg" onChange={(event) => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} hidden
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7440-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7440](../src/App.tsx); tag `AttachmentItem`.

Visibility: receiveMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
key={`${attachment.original_name}-${index}`} attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, item) => item !== index), ) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-7466-1

Owner `InwardPurchasesWorkspace`; [src/App.tsx:7466](../src/App.tsx); tag `p`.

Visibility: error; dialog

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-7503-1

Owner `ReceiptLines`; [src/App.tsx:7503](../src/App.tsx); tag `InventoryPicker`.

Visibility: editable

```tsx
inventory={inventory} value={line.item_id} onChange={(item_id) => updateLine(line.key, { item_id })} label={`Receipt line ${index + 1} item`}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7517-1

Owner `ReceiptLines`; [src/App.tsx:7517](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Receipt line ${index + 1} quantity`} readOnly={!editable && !editableQuantity} type="number" min="0.01" step="0.01" value={line.received_qty} onChange={(event) => updateLine(line.key, { received_qty: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7535-1

Owner `ReceiptLines`; [src/App.tsx:7535](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label={`Receipt line ${index + 1} unit cost`} type="number" min="0" step="0.01" value={line.unit_cost} onChange={(event) => updateLine(line.key, { unit_cost: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7550-1

Owner `ReceiptLines`; [src/App.tsx:7550](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label={`Receipt line ${index + 1} discount`} type="number" min="0" step="0.01" value={line.discount} onChange={(event) => updateLine(line.key, { discount: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7565-1

Owner `ReceiptLines`; [src/App.tsx:7565](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label={`Receipt line ${index + 1} GST`} type="number" min="0" max="100" step="0.01" value={line.gst_rate} onChange={(event) => updateLine(line.key, { gst_rate: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7588-1

Owner `ReceiptLines`; [src/App.tsx:7588](../src/App.tsx); tag `button`.

Visibility: editable && onRemove

```tsx
type="button" className="danger-action" aria-label={`Remove receipt line ${index + 1}`} onClick={() => onRemove(line.key)}
```

Label/content expression:

```tsx
Remove 
```

#### ACT-App-tsx-7698-1

Owner `AttachmentItem`; [src/App.tsx:7698](../src/App.tsx); tag `a`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
href={attachment.document_url} target="_blank" rel="noreferrer"
```

Label/content expression:

```tsx
Open 
```

#### ACT-App-tsx-7702-1

Owner `AttachmentItem`; [src/App.tsx:7702](../src/App.tsx); tag `button`.

Visibility: onRemove

```tsx
type="button" className="danger-action" onClick={onRemove}
```

Label/content expression:

```tsx
Remove 
```

#### ACT-App-tsx-7784-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7784](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" onClick={openNew}
```

Label/content expression:

```tsx
 <Plus size={16} /> Add new supplier 
```

#### ACT-App-tsx-7809-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7809](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={() => openEdit(supplier)}
```

Label/content expression:

```tsx
 <Pencil size={15} /> Edit 
```

#### STATE-App-tsx-7826-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7826](../src/App.tsx); tag `Dialog`.

Visibility: dialogOpen

```tsx
title={selected ? "Edit supplier" : "Add supplier"} subtitle="Hold and archive preserve purchase history." onClose={closeDialog} footer={ <> {selected && ( <button type="button" className="danger-action" onClick={() => { if ( mutate((db) => archiveSupplierForActor(db, selected.id, actor.id), ) ) closeDialog(); }} > Archive supplier </button> )} <button type="submit" form="supplier-form" className="primary-action" > Save supplier </button> </> }
```

Label/content expression:

```tsx
 <form id="supplier-form" onSubmit={save}> <label> Name <input required data-dialog-initial-focus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Contact name <input value={draft.contact_name} onChange={(event) => setDraft({ ...draft, contact_name: event.target.value }) } /> </label> <label> Phone <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value }) } /> </label> <label> Email <input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> GSTIN <input value={draft.gstin} onChange={(event) => setDraft({ ...draft, gstin: event.target.value }) } /> </label> <label> Status <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Supplier["status"], }) } > <option>Active</option> <option>On hold</option> </select> </label> </form> 
```

#### ACT-App-tsx-7833-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7833](../src/App.tsx); tag `button`.

Visibility: selected; dialogOpen

```tsx
type="button" className="danger-action" onClick={() => { if ( mutate((db) => archiveSupplierForActor(db, selected.id, actor.id), ) ) closeDialog(); }}
```

Label/content expression:

```tsx
Archive supplier 
```

#### ACT-App-tsx-7848-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7848](../src/App.tsx); tag `button`.

Visibility: dialogOpen

```tsx
type="submit" form="supplier-form" className="primary-action"
```

Label/content expression:

```tsx
Save supplier 
```

#### FORM-App-tsx-7858-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7858](../src/App.tsx); tag `form`.

Visibility: dialogOpen

```tsx
id="supplier-form" onSubmit={save}
```

Label/content expression:

```tsx
 <label> Name <input required data-dialog-initial-focus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Contact name <input value={draft.contact_name} onChange={(event) => setDraft({ ...draft, contact_name: event.target.value }) } /> </label> <label> Phone <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value }) } /> </label> <label> Email <input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> GSTIN <input value={draft.gstin} onChange={(event) => setDraft({ ...draft, gstin: event.target.value }) } /> </label> <label> Status <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Supplier["status"], }) } > <option>Active</option> <option>On hold</option> </select> </label> 
```

#### ACT-App-tsx-7861-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7861](../src/App.tsx); tag `input`.

Visibility: dialogOpen

```tsx
required data-dialog-initial-focus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7872-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7872](../src/App.tsx); tag `input`.

Visibility: dialogOpen

```tsx
value={draft.contact_name} onChange={(event) => setDraft({ ...draft, contact_name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7881-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7881](../src/App.tsx); tag `input`.

Visibility: dialogOpen

```tsx
value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7890-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7890](../src/App.tsx); tag `input`.

Visibility: dialogOpen

```tsx
type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7900-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7900](../src/App.tsx); tag `input`.

Visibility: dialogOpen

```tsx
value={draft.gstin} onChange={(event) => setDraft({ ...draft, gstin: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-7909-1

Owner `SupplierMasterWorkspace`; [src/App.tsx:7909](../src/App.tsx); tag `select`.

Visibility: dialogOpen

```tsx
value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Supplier["status"], }) }
```

Label/content expression:

```tsx
 <option>Active</option> <option>On hold</option> 
```

#### STATE-App-tsx-7992-1

Owner `StockMovementHistory`; [src/App.tsx:7992](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="desk-panel store-list-page" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="store-filter-grid stock-filter-grid contextual-filter-bar"> <label className="list-search"> Quick search <input aria-label="Search stock movements" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Item, SKU, job or note" /> </label> <label> Date <input aria-label="Stock movement date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setPage(1); }} /> </label> <label> Month-Year <select aria-label="Stock movement month" value={month} onChange={(event) => { setMonth(event.target.value); setPage(1); }} > <option value="">All months</option> {movementMonths.map((value) => ( <option key={value} value={value}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${value}-01T00:00:00Z`), )} </option> ))} </select> </label> <label> Direction <select aria-label="Stock movement direction" value={direction} onChange={(event) => { setDirection(event.target.value); setPage(1); }} > <option value="ALL">All movements</option> {Array.from(new Set(uniqueMovements.map((row) => row.direction))) .sort() .map((value) => ( <option key={value}>{value}</option> ))} </select> </label> <ListSearchActions onClear={clearFilters} /> </div> <PaginationToolbar controls={ <ListExportControls report={{ title: "Stock Movements", filters: activeFilterSummary({ Search: search.trim(), Date: date, Month: month, Direction: direction, }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Stock movement records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {filtered.length ? ( <div className="table-wrap"> <table aria-label="Stock movement results"> <thead> <tr> {columns.map((column) => ( <th key={column.header}>{column.header}</th> ))} </tr> </thead> <tbody> {paged.items.map((row) => ( <tr key={row.id}> {columns.map((column) => ( <td key={column.header}>{column.value(row)}</td> ))} </tr> ))} </tbody> </table> </div> ) : ( <div className="list-empty"> <h3>No matching movements</h3> <FilterClearButton onClick={clearFilters} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-7996-1

Owner `StockMovementHistory`; [src/App.tsx:7996](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search stock movements" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Item, SKU, job or note"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8008-1

Owner `StockMovementHistory`; [src/App.tsx:8008](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Stock movement date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8020-1

Owner `StockMovementHistory`; [src/App.tsx:8020](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Stock movement month" value={month} onChange={(event) => { setMonth(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="">All months</option> {movementMonths.map((value) => ( <option key={value} value={value}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${value}-01T00:00:00Z`), )} </option> ))} 
```

#### ACT-App-tsx-8040-1

Owner `StockMovementHistory`; [src/App.tsx:8040](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Stock movement direction" value={direction} onChange={(event) => { setDirection(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All movements</option> {Array.from(new Set(uniqueMovements.map((row) => row.direction))) .sort() .map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-8056-1

Owner `StockMovementHistory`; [src/App.tsx:8056](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8058-1

Owner `StockMovementHistory`; [src/App.tsx:8058](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <ListExportControls report={{ title: "Stock Movements", filters: activeFilterSummary({ Search: search.trim(), Date: date, Month: month, Direction: direction, }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Stock movement records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8111-1

Owner `StockMovementHistory`; [src/App.tsx:8111](../src/App.tsx); tag `FilterClearButton`.

Visibility: filtered.length

```tsx
onClick={clearFilters} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8114-1

Owner `StockMovementHistory`; [src/App.tsx:8114](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8548-1

Owner `StoreList`; [src/App.tsx:8548](../src/App.tsx); tag `tr`.

Visibility: kind === "requests" && purchaseRequests.length > 0

```tsx
key={purchaseRequest.id} className="clickable-row" onClick={() => onOpenJob(view.job.id)}
```

Label/content expression:

```tsx
 <td>{view.job.job_no}</td> <td>{purchaseRequest.item_name}</td> <td> {purchaseRequest.quantity} {purchaseRequest.unit} </td> <td>{purchaseRequest.status}</td> <td> {purchaseRequest.status === "Completed" ? `Inventory #${purchaseRequest.mapped_inventory_item_id} · issued row #${purchaseRequest.material_request_id}` : "Awaiting purchase"} </td> 
```

#### ACT-App-tsx-8584-1

Owner `StoreList`; [src/App.tsx:8584](../src/App.tsx); tag `input`.

Visibility: !isMaterialRecordList

```tsx
aria-label={`Search ${title.toLocaleLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={ kind === "stock" ? "SKU, item, category or unit" : "Job, vehicle or item" }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8603-1

Owner `StoreList`; [src/App.tsx:8603](../src/App.tsx); tag `select`.

Visibility: kind === "stock"

```tsx
aria-label="Stock category" value={primary} onChange={(event) => { setPrimary(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All categories</option> {categories.map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-8619-1

Owner `StoreList`; [src/App.tsx:8619](../src/App.tsx); tag `select`.

Visibility: kind === "stock"

```tsx
aria-label="Stock status" value={job} onChange={(event) => { setJob(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All stock</option> <option value="LOW">Low stock</option> <option value="OK">In stock</option> 
```

#### ACT-App-tsx-8634-1

Owner `StoreList`; [src/App.tsx:8634](../src/App.tsx); tag `select`.

Visibility: kind === "stock"

```tsx
aria-label="Stock unit" value={unit} onChange={(event) => { setUnit(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All units</option> {units.map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-8655-1

Owner `StoreList`; [src/App.tsx:8655](../src/App.tsx); tag `input`.

Visibility: isMaterialRecordList; kind === "stock"

```tsx
aria-label={`${title} record date`} type="date" value={recordDate} onChange={(event) => { setRecordDate(event.target.value); setRecordMonth(""); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8668-1

Owner `StoreList`; [src/App.tsx:8668](../src/App.tsx); tag `select`.

Visibility: isMaterialRecordList; kind === "stock"

```tsx
aria-label={`${title} record month`} value={recordMonth} onChange={(event) => { setRecordMonth(event.target.value); setRecordDate(""); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="">All months</option> {Array.from( new Set( [ ...history.map((row) => (isLocalPurchase(row) ? row.purchase.created_at : row.request.created_at )?.slice(0, 7), ), ...purchaseRequests.map(({ purchaseRequest }) => purchaseRequest.created_at?.slice(0, 7), ), ].filter((value): value is string => Boolean(value && /^\d{4}-\d{2}$/.test(value)), ), ), ) .sort((left, right) => right.localeCompare(left)) .map((value) => ( <option key={value} value={value}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${value}-01T00:00:00Z`), )} </option> ))} 
```

#### ACT-App-tsx-8709-1

Owner `StoreList`; [src/App.tsx:8709](../src/App.tsx); tag `select`.

Visibility: kind === "stock"

```tsx
aria-label={ kind === "reconcile" ? "Reconciliation state" : "Status" } value={primary} onChange={(event) => { setPrimary(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All states</option> {(kind === "reconcile" ? ["Matched", "Open"] : [ "Pending", "Partially issued", "Issued", "Reconciled", ...(purchases.length ? ["Local purchase"] : []), ...(purchaseRequests.length ? ["New item request", "Completed"] : []), ] ).map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-8740-1

Owner `StoreList`; [src/App.tsx:8740](../src/App.tsx); tag `select`.

Visibility: !isMaterialRecordList; kind === "stock"

```tsx
aria-label={`${title} job`} value={job} onChange={(event) => { setJob(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All jobs</option> {uniqueJobs.map((row) => ( <option key={row.job.id} value={row.job.id}> {row.job.job_no} · {row.vehicle.number} ·{" "} {row.customer.name} </option> ))} 
```

#### ACT-App-tsx-8761-1

Owner `StoreList`; [src/App.tsx:8761](../src/App.tsx); tag `InventoryPicker`.

Visibility: isMaterialRecordList; kind === "stock"

```tsx
inventory={inventory} value={item === "ALL" ? undefined : Number(item)} onChange={(id) => { setItem(String(id)); setPage(1); }} label="Item" allOptionLabel="All items" onSelectAll={() => { setItem("ALL"); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8779-1

Owner `StoreList`; [src/App.tsx:8779](../src/App.tsx); tag `select`.

Visibility: isMaterialRecordList; kind === "stock"

```tsx
aria-label={`${title} item`} value={item} onChange={(event) => { setItem(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All items</option> {inventory.map((row) => ( <option key={row.id} value={row.id}> {row.name} </option> ))} 
```

#### ACT-App-tsx-8798-1

Owner `StoreList`; [src/App.tsx:8798](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8800-1

Owner `StoreList`; [src/App.tsx:8800](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={<ListExportControls report={exportReport} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${title} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8819-1

Owner `StoreList`; [src/App.tsx:8819](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={clearFilters} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-8849-1

Owner `StoreList`; [src/App.tsx:8849](../src/App.tsx); tag `button`.

Visibility: onEditStock; kind === "stock"; paged.totalCount === 0

```tsx
type="button" className="secondary-action" onClick={() => onEditStock(row)}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-App-tsx-8868-1

Owner `StoreList`; [src/App.tsx:8868](../src/App.tsx); tag `tr`.

Visibility: kind === "stock"; paged.totalCount === 0

```tsx
key={ isLocalPurchase(row) ? `purchase-${row.purchase.id}` : `request-${row.request.id}` } className="clickable-row" onClick={() => onOpenJob(row.view.job.id)}
```

Label/content expression:

```tsx
 {requestColumns.map((column) => ( <td key={column.header} className={ column.header === "Status" \|\| column.header === "State" ? `store-material-status-cell store-material-status-cell-${storeMaterialStatusClass(status)}` : undefined } > {column.header === "Job Card" ? ( <button type="button" className="link-action" onClick={(event) => { event.stopPropagation(); onOpenJob(row.view.job.id); }} > {String(column.value(row))} </button> ) : column.header === "Status" \|\| column.header === "State" ? ( <span className={`store-material-status store-material-status-${storeMaterialStatusClass(status)}`} > {status} </span> ) : ( column.value(row) )} </td> ))} {(kind === "issue" \|\| kind === "reconcile") && ( <td className={ kind === "issue" ? "store-material-action-cell" : undefined } > {!isLocalPurchase(row) && ( <div className="grid-actions store-material-actions"> {kind === "issue" && onRelease && ( <button type="button" className="workflow-action action-primary" onClick={(event) => { event.stopPropagation(); onRelease(row); }} > <Package size={15} /> Issue Material </button> )} {kind === "issue" && onNeedsApproval && ["Requested", "Re-requested"].includes( row.request.status ?? "Requested", ) && !row.request.invoiced_in && ( <button type="button" className="workflow-action action-secondary" onClick={(event) => { event.stopPropagation(); onNeedsApproval(row); }} > <ShieldCheck size={15} /> Needs Approval </button> )} {kind === "reconcile" && onReconcile && ( <button type="button" className="store-material-action" onClick={(event) => { event.stopPropagation(); onReconcile(row); }} > {reconciliationState(row) === "Matched" ? "Edit Reconciliation" : "Reconcile"} </button> )} </div> )} </td> )} 
```

#### ACT-App-tsx-8888-1

Owner `StoreList`; [src/App.tsx:8888](../src/App.tsx); tag `button`.

Visibility: column.header === "Job Card"; kind === "stock"; paged.totalCount === 0

```tsx
type="button" className="link-action" onClick={(event) => { event.stopPropagation(); onOpenJob(row.view.job.id); }}
```

Label/content expression:

```tsx
 {String(column.value(row))} 
```

#### ACT-App-tsx-8921-1

Owner `StoreList`; [src/App.tsx:8921](../src/App.tsx); tag `button`.

Visibility: kind === "issue" && onRelease; !isLocalPurchase(row); (kind === "issue" \|\| kind === "reconcile"); kind === "stock"; paged.totalCount === 0

```tsx
type="button" className="workflow-action action-primary" onClick={(event) => { event.stopPropagation(); onRelease(row); }}
```

Label/content expression:

```tsx
 <Package size={15} /> Issue Material 
```

#### ACT-App-tsx-8939-1

Owner `StoreList`; [src/App.tsx:8939](../src/App.tsx); tag `button`.

Visibility: kind === "issue" && onNeedsApproval && ["Requested", "Re-requested"].includes( row.request.status ?? "Requested", ) && !row.request.invoiced_in; !isLocalPurchase(row); (kind === "issue" \|\| kind === "reconcile"); kind === "stock"; paged.totalCount === 0

```tsx
type="button" className="workflow-action action-secondary" onClick={(event) => { event.stopPropagation(); onNeedsApproval(row); }}
```

Label/content expression:

```tsx
 <ShieldCheck size={15} /> Needs Approval 
```

#### ACT-App-tsx-8952-1

Owner `StoreList`; [src/App.tsx:8952](../src/App.tsx); tag `button`.

Visibility: kind === "reconcile" && onReconcile; !isLocalPurchase(row); (kind === "issue" \|\| kind === "reconcile"); kind === "stock"; paged.totalCount === 0

```tsx
type="button" className="store-material-action" onClick={(event) => { event.stopPropagation(); onReconcile(row); }}
```

Label/content expression:

```tsx
 {reconciliationState(row) === "Matched" ? "Edit Reconciliation" : "Reconcile"} 
```

#### ACT-App-tsx-8976-1

Owner `StoreList`; [src/App.tsx:8976](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-9010-1

Owner `Technician`; [src/App.tsx:9010](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="desk-panel task-column" key={view.job.id} onFocus={() => setSelectedJobId(view.job.id)}
```

Label/content expression:

```tsx
 <PanelTitle icon={<Wrench />} title={view.vehicle.number} subtitle={view.job.job_no} /> {view.tasks.map((task) => ( <div className="task-card" key={task.id}> <strong>{task.title}</strong> <p>{task.notes}</p> <Info label="Started" value={task.started_at \|\| "Not started"} /> <Info label="Paused" value={task.paused_at \|\| "Not paused"} /> <Info label="Completed" value={task.completed_at \|\| "Not completed"} /> <Status status={view.job.main_status} sub={view.job.sub_status} /> <label> Work notes <input defaultValue={task.notes} onBlur={(event) => mutate((db) => updateTask(db, task.id, task.status, event.target.value), ) } /> </label> <div className="segmented"> {statuses.map((status) => ( <button key={status} className={task.status === status ? "active" : ""} onClick={() => mutate((db) => updateTask( db, task.id, status, `${status} from technician board`, ), ) } > {status} </button> ))} </div> <button className="danger-action" onClick={() => mutate((db) => archiveTask(db, task.id, "Removed from technician board"), ) } > Archive Task </button> </div> ))} <TaskCreator view={view} users={state.users} mutate={mutate} /> {activeMenuItem === "QC Prep" && ( <QcEditor view={view} technicianId={ state.users.find((item) => item.role === "tech")?.id ?? 6 } mutate={mutate} /> )} 
```

#### ACT-App-tsx-9033-1

Owner `Technician`; [src/App.tsx:9033](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
defaultValue={task.notes} onBlur={(event) => mutate((db) => updateTask(db, task.id, task.status, event.target.value), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-9044-1

Owner `Technician`; [src/App.tsx:9044](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={status} className={task.status === status ? "active" : ""} onClick={() => mutate((db) => updateTask( db, task.id, status, `${status} from technician board`, ), ) }
```

Label/content expression:

```tsx
 {status} 
```

#### ACT-App-tsx-9062-1

Owner `Technician`; [src/App.tsx:9062](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" onClick={() => mutate((db) => archiveTask(db, task.id, "Removed from technician board"), ) }
```

Label/content expression:

```tsx
Archive Task 
```

#### ACT-App-tsx-9213-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9213](../src/App.tsx); tag `button`.

Visibility: pending.length

```tsx
className="link-action" onClick={() => { setSelectedJobId(view.job.id); setViewing(view); }}
```

Label/content expression:

```tsx
 {view.job.job_no} 
```

#### ACT-App-tsx-9236-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9236](../src/App.tsx); tag `button`.

Visibility: pending.length

```tsx
className="primary-action" onClick={() => setReviewing(view)}
```

Label/content expression:

```tsx
Review 
```

#### ACT-App-tsx-9257-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9257](../src/App.tsx); tag `JobRecordDialog`.

Visibility: viewing

```tsx
view={viewing} state={state} mutate={mutate} actor={actor} mode="view" onClose={() => setViewing(undefined)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-9267-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9267](../src/App.tsx); tag `Dialog`.

Visibility: reviewing

```tsx
title="Review material approval" subtitle={`${reviewing.job.job_no} · decision controls`} onClose={() => setReviewing(undefined)} footer={ <> <button type="button" className="secondary-action" onClick={() => decide("Approved")} > Approve </button> <button type="button" className="danger-action" onClick={() => decide("Rejected")} > Reject </button> </> }
```

Label/content expression:

```tsx
 <p> Approve restores the retained requested rows for Store issue. Reject keeps the job on HOLD for the linked Service Advisor to correct. </p> <label> Rejection reason <textarea value={reason} onChange={(event) => setReason(event.target.value)} required placeholder="Required when rejecting" /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-9273-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9273](../src/App.tsx); tag `button`.

Visibility: reviewing

```tsx
type="button" className="secondary-action" onClick={() => decide("Approved")}
```

Label/content expression:

```tsx
Approve 
```

#### ACT-App-tsx-9280-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9280](../src/App.tsx); tag `button`.

Visibility: reviewing

```tsx
type="button" className="danger-action" onClick={() => decide("Rejected")}
```

Label/content expression:

```tsx
Reject 
```

#### ACT-App-tsx-9296-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9296](../src/App.tsx); tag `textarea`.

Visibility: reviewing

```tsx
value={reason} onChange={(event) => setReason(event.target.value)} required placeholder="Required when rejecting"
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-9304-1

Owner `MaterialApprovalQueue`; [src/App.tsx:9304](../src/App.tsx); tag `p`.

Visibility: error; reviewing

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-9343-1

Owner `Admin`; [src/App.tsx:9343](../src/App.tsx); tag `BookingOperations`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} actor={user} mutate={mutate} onCheckedIn={(jobId) => setSelectedJobId(jobId)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-9373-1

Owner `Admin`; [src/App.tsx:9373](../src/App.tsx); tag `FilterableJobRows`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Job Cards" jobs={state.jobs} selectedJobId={selected?.job.id} onSelect={setSelectedJobId} showStatusFilter
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-9397-1

Owner `Admin`; [src/App.tsx:9397](../src/App.tsx); tag `button`.

Visibility: selected

```tsx
className="danger-action" onClick={() => mutate((db) => cancelJobCard(db, selected.job.id, "Cancelled by admin"), ) }
```

Label/content expression:

```tsx
Archive Job 
```

#### ACT-App-tsx-9429-1

Owner `Admin`; [src/App.tsx:9429](../src/App.tsx); tag `AdminConsole`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} mutate={mutate} actingUser={user} cognitoConfig={cognitoConfig} onThemeSaved={onThemeSaved} onStateSaved={onAdminStateSaved}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-9440-1

Owner `Admin`; [src/App.tsx:9440](../src/App.tsx); tag `OperationalDashboard`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
state={state} onNavigate={onDashboardNavigate}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-9702-1

Owner `OperationalDashboard`; [src/App.tsx:9702](../src/App.tsx); tag `article`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={card.title} data-dashboard-card={card.tone} className={`command-card command-${card.tone}`} tabIndex={0} onClick={() => onNavigate(card.drilldown)} onKeyDown={(event) => { if ( event.target === event.currentTarget && (event.key === "Enter" \|\| event.key === " ") ) { event.preventDefault(); onNavigate(card.drilldown); } }}
```

Label/content expression:

```tsx
 <div className="command-card-heading"> <span className="command-icon-tile" aria-hidden="true"> {icon} </span> <div> <h2>{card.title}</h2> <p>{card.subtitle}</p> </div> {card.tone === "cashflow" && ( <label className="cashflow-month"> Cashflow month <select aria-label="Cashflow month" value={cashflowMonth} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onChange={(event) => { event.stopPropagation(); setCashflowMonth(event.target.value); }} > {cashflowMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} </select> </label> )} </div> <div className={`command-metrics${card.tone === "cashflow" ? " command-cashflow-metrics" : ""}`} > {card.metrics.map((metric) => ( <button type="button" key={metric.label} className={`command-metric metric-${metric.tone}${metric.layout ? ` command-metric-${metric.layout}` : ""}`} aria-label={`Open ${metric.label}: ${metric.value}`} onClick={(event) => { event.stopPropagation(); onNavigate(metric.drilldown); }} > <span>{metric.label}</span> <strong>{metric.value}</strong> {metric.context && <small>{metric.context}</small>} </button> ))} </div> {card.tone === "cashflow" && (facts.cashflowMonthComplete ? ( <div className="collection-pace collection-complete" aria-label={`${facts.cashflowMonthLabel} collection complete`} > <div className="collection-pace-label"> <span>Collection period</span> <strong>Month complete</strong> </div> </div> ) : ( <div className="collection-pace" aria-label={`${collectionPace}% of calendar month elapsed`} > <div className="collection-pace-label"> <span>Collection runway</span> <strong>{collectionPace}% elapsed</strong> </div> <div className="collection-pace-track"> <span style={{ width: `${collectionPace}%` }} /> </div> <div className="collection-bars" aria-hidden="true"> <i /> <i /> <i /> <i /> <i /> <i /> <i /> </div> </div> ))} {card.tone === "reach" && ( <svg className="customer-trend" viewBox="0 0 260 62" role="img" aria-label="Decorative customer reach trend" > <path d="M2 52C28 48 31 36 53 42S83 51 103 29s33 5 54-8 29-1 46-17 30-1 55-3" fill="none" pathLength="1" /> <path d="M2 59H258" /> </svg> )} {card.tone === "inventory" && ( <div className="inventory-signal" aria-hidden="true"> <Sparkles size={15} /> <span>Attention queue</span> <i /> <i /> <i /> </div> )} <div className="command-card-footer"> <button type="button" className="command-card-open" aria-label={card.action} onClick={(event) => { event.stopPropagation(); onNavigate(card.drilldown); }} > {card.action} <ChevronRight size={14} /> </button> </div> 
```

#### ACT-App-tsx-9729-1

Owner `OperationalDashboard`; [src/App.tsx:9729](../src/App.tsx); tag `select`.

Visibility: card.tone === "cashflow"

```tsx
aria-label="Cashflow month" value={cashflowMonth} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onChange={(event) => { event.stopPropagation(); setCashflowMonth(event.target.value); }}
```

Label/content expression:

```tsx
 {cashflowMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} 
```

#### ACT-App-tsx-9755-1

Owner `OperationalDashboard`; [src/App.tsx:9755](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" key={metric.label} className={`command-metric metric-${metric.tone}${metric.layout ? ` command-metric-${metric.layout}` : ""}`} aria-label={`Open ${metric.label}: ${metric.value}`} onClick={(event) => { event.stopPropagation(); onNavigate(metric.drilldown); }}
```

Label/content expression:

```tsx
 <span>{metric.label}</span> <strong>{metric.value}</strong> {metric.context && <small>{metric.context}</small>} 
```

#### ACT-App-tsx-9830-1

Owner `OperationalDashboard`; [src/App.tsx:9830](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="command-card-open" aria-label={card.action} onClick={(event) => { event.stopPropagation(); onNavigate(card.drilldown); }}
```

Label/content expression:

```tsx
 {card.action} <ChevronRight size={14} /> 
```

#### ACT-App-tsx-9897-1

Owner `ManagementHub`; [src/App.tsx:9897](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => { if ( window.confirm( "Load Large Demo Dataset? Current local demo records will be replaced. This cannot be undone from this screen.", ) ) mutate(loadLargeDemoDataset); }}
```

Label/content expression:

```tsx
Load Large Demo Dataset 
```

#### STATE-App-tsx-9911-1

Owner `ManagementHub`; [src/App.tsx:9911](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="management-tabs" role="tablist" aria-label="Management areas" onKeyDown={handleTabListKeyDown}
```

Label/content expression:

```tsx
 {managementAreas.map((item) => ( <button id={`management-tab-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`} aria-controls="management-active-panel" tabIndex={area === item ? 0 : -1} key={item} role="tab" aria-selected={area === item} className={area === item ? "active" : ""} onClick={() => setArea(item)} > {item} </button> ))} 
```

#### STATE-App-tsx-9918-1

Owner `ManagementHub`; [src/App.tsx:9918](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id={`management-tab-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`} aria-controls="management-active-panel" tabIndex={area === item ? 0 : -1} key={item} role="tab" aria-selected={area === item} className={area === item ? "active" : ""} onClick={() => setArea(item)}
```

Label/content expression:

```tsx
 {item} 
```

#### STATE-App-tsx-9932-1

Owner `ManagementHub`; [src/App.tsx:9932](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="management-active-panel" role="tabpanel" aria-labelledby={`management-tab-${area.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
```

Label/content expression:

```tsx
 {area === "Estimates" && ( <JobPicker jobs={state.jobs} selectedJobId={managedJob?.job.id} onSelect={setManagedJobId} label={`Job for ${area}`} /> )} {area === "Users" && ( <UserManager users={state.users} mutate={mutate} actingUser={actingUser} cognitoConfig={cognitoConfig} /> )} {area === "Customers" && ( <CustomerManager state={state} mutate={mutate} actor={actingUser} /> )} {area === "Vehicles" && ( <VehicleManager state={state} mutate={mutate} actor={actingUser} /> )} {area === "Suppliers" && ( <SupplierMasterWorkspace state={state} actor={actingUser} mutate={mutate} /> )} {area === "Job Cards" && ( <VisitJobManager state={state} mutate={mutate} actingUser={actingUser} selected={selected} setSelectedJobId={setSelectedJobId} /> )} {area === "Estimates" && ( <EstimateManager view={managedJob} mutate={mutate} actor={actingUser} /> )} {(area === "Invoices" \|\| area === "Payments" \|\| area === "Delivery") && ( <BillingManager key={area} mode={area} state={state} actor={actingUser} mutate={mutate} panel={false} /> )} 
```

#### ACT-App-tsx-9938-1

Owner `ManagementHub`; [src/App.tsx:9938](../src/App.tsx); tag `JobPicker`.

Visibility: area === "Estimates"

```tsx
jobs={state.jobs} selectedJobId={managedJob?.job.id} onSelect={setManagedJobId} label={`Job for ${area}`}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-10046-1

Owner `CustomerManager`; [src/App.tsx:10046](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Customers</h3> {!archivedOnly && ( <button className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }} > Add Customer </button> )} </div> {creating && ( <Dialog title="Add Customer" onClose={() => setCreating(false)}> <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> </Dialog> )} {record && ( <CustomerRecordDialog customer={record.customer} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} /> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search customers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, mobile or type" /> </label> {actor.role === "admin" && ( <Switch label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }} /> )} <ListSearchActions onClear={() => { setSearch(""); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Customers", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Customer records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="Customer manager"> <thead> <tr> {[ "Customer", "Mobile", "Type", "Vehicles", "Open Jobs", "Actions", ].map((header) => ( <th key={header}>{header}</th> ))} </tr> </thead> <tbody> {paged.items.map((customer) => ( <tr key={customer.id}> <td>{customer.name}</td> <td>{customer.mobile}</td> <td>{customer.type}</td> <td>{vehicleCount(customer)}</td> <td>{openJobCount(customer)}</td> <td> <RecordActions inGrid onView={() => setRecord({ customer, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ customer, mode: "edit" }) : undefined } onArchive={ !archivedOnly ? () => mutate((db) => archiveCustomer( db, customer.id, "Archived by Admin", ), ) : undefined } /> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-10050-1

Owner `CustomerManager`; [src/App.tsx:10050](../src/App.tsx); tag `button`.

Visibility: !archivedOnly

```tsx
className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }}
```

Label/content expression:

```tsx
Add Customer 
```

#### STATE-App-tsx-10062-1

Owner `CustomerManager`; [src/App.tsx:10062](../src/App.tsx); tag `Dialog`.

Visibility: creating

```tsx
title="Add Customer" onClose={() => setCreating(false)}
```

Label/content expression:

```tsx
 <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> 
```

#### ACT-App-tsx-10063-1

Owner `CustomerManager`; [src/App.tsx:10063](../src/App.tsx); tag `CustomerEditor`.

Visibility: creating

```tsx
embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10073-1

Owner `CustomerManager`; [src/App.tsx:10073](../src/App.tsx); tag `CustomerRecordDialog`.

Visibility: record

```tsx
customer={record.customer} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10084-1

Owner `CustomerManager`; [src/App.tsx:10084](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search customers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, mobile or type"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10095-1

Owner `CustomerManager`; [src/App.tsx:10095](../src/App.tsx); tag `Switch`.

Visibility: actor.role === "admin"

```tsx
label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10105-1

Owner `CustomerManager`; [src/App.tsx:10105](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10112-1

Owner `CustomerManager`; [src/App.tsx:10112](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <DownloadMenu report={{ title: "Customers", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Customer records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10114-1

Owner `CustomerManager`; [src/App.tsx:10114](../src/App.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: "Customers", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10165-1

Owner `CustomerManager`; [src/App.tsx:10165](../src/App.tsx); tag `RecordActions`.

Visibility: paged.totalCount > 0

```tsx
inGrid onView={() => setRecord({ customer, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ customer, mode: "edit" }) : undefined } onArchive={ !archivedOnly ? () => mutate((db) => archiveCustomer( db, customer.id, "Archived by Admin", ), ) : undefined }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10196-1

Owner `CustomerManager`; [src/App.tsx:10196](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={() => { setSearch(""); setPage(1); }} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10205-1

Owner `CustomerManager`; [src/App.tsx:10205](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-10265-1

Owner `VehicleManager`; [src/App.tsx:10265](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Vehicles</h3> {!archivedOnly && ( <button className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }} > Add Vehicle </button> )} </div> {creating && ( <Dialog title="Add Vehicle" onClose={() => setCreating(false)}> <VehicleMasterPanel embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> </Dialog> )} {record && ( <VehicleRecordDialog vehicle={vehicles.find((vehicle) => vehicle.id === record.id)!} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} /> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search vehicles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Registration, make, model or customer" /> </label> {actor.role === "admin" && ( <Switch label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }} /> )} <ListSearchActions onClear={() => { setSearch(""); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Vehicles", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Vehicle records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="Vehicle manager"> <thead> <tr> {[ "Registration", "Make / Model", "Color", "Customer", "KM", "Actions", ].map((header) => ( <th key={header}>{header}</th> ))} </tr> </thead> <tbody> {paged.items.map((vehicle) => ( <tr key={vehicle.id}> <td>{vehicle.number}</td> <td> {vehicle.make} {vehicle.model} </td> <td>{vehicle.color}</td> <td>{ownerName(vehicle)}</td> <td>{vehicle.km.toLocaleString("en-IN")}</td> <td> <RecordActions inGrid onView={() => setRecord({ id: vehicle.id, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ id: vehicle.id, mode: "edit" }) : undefined } onArchive={ !archivedOnly ? () => mutate((db) => archiveVehicle( db, vehicle.id, "Archived by Admin", ), ) : undefined } /> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-10269-1

Owner `VehicleManager`; [src/App.tsx:10269](../src/App.tsx); tag `button`.

Visibility: !archivedOnly

```tsx
className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }}
```

Label/content expression:

```tsx
Add Vehicle 
```

#### STATE-App-tsx-10281-1

Owner `VehicleManager`; [src/App.tsx:10281](../src/App.tsx); tag `Dialog`.

Visibility: creating

```tsx
title="Add Vehicle" onClose={() => setCreating(false)}
```

Label/content expression:

```tsx
 <VehicleMasterPanel embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> 
```

#### ACT-App-tsx-10282-1

Owner `VehicleManager`; [src/App.tsx:10282](../src/App.tsx); tag `VehicleMasterPanel`.

Visibility: creating

```tsx
embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10294-1

Owner `VehicleManager`; [src/App.tsx:10294](../src/App.tsx); tag `VehicleRecordDialog`.

Visibility: record

```tsx
vehicle={vehicles.find((vehicle) => vehicle.id === record.id)!} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10305-1

Owner `VehicleManager`; [src/App.tsx:10305](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search vehicles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Registration, make, model or customer"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10316-1

Owner `VehicleManager`; [src/App.tsx:10316](../src/App.tsx); tag `Switch`.

Visibility: actor.role === "admin"

```tsx
label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10326-1

Owner `VehicleManager`; [src/App.tsx:10326](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10333-1

Owner `VehicleManager`; [src/App.tsx:10333](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <DownloadMenu report={{ title: "Vehicles", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Vehicle records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10335-1

Owner `VehicleManager`; [src/App.tsx:10335](../src/App.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: "Vehicles", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10388-1

Owner `VehicleManager`; [src/App.tsx:10388](../src/App.tsx); tag `RecordActions`.

Visibility: paged.totalCount > 0

```tsx
inGrid onView={() => setRecord({ id: vehicle.id, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ id: vehicle.id, mode: "edit" }) : undefined } onArchive={ !archivedOnly ? () => mutate((db) => archiveVehicle( db, vehicle.id, "Archived by Admin", ), ) : undefined }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10419-1

Owner `VehicleManager`; [src/App.tsx:10419](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={() => { setSearch(""); setPage(1); }} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10428-1

Owner `VehicleManager`; [src/App.tsx:10428](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-10489-1

Owner `VisitJobManager`; [src/App.tsx:10489](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Job Cards</h3> {!archivedOnly && ( <button className="add-action" onClick={() => setCreating(true)}> <Plus size={17} /> Add Job Card </button> )} </div> {creating && ( <AddJobCardDialog state={state} mutate={mutate} actor={actingUser} onClose={() => setCreating(false)} /> )} {dialogJob && ( <JobRecordDialog view={dialogJob} state={state} mutate={mutate} actor={actingUser} mode={archivedOnly ? "view" : (record?.mode ?? "view")} historical={archivedOnly} onClose={() => setRecord(undefined)} onAdminArchive={ !archivedOnly ? () => mutate((db) => cancelJobCard( db, dialogJob.job.id, "Admin override: archived from Management Hub", ), ) : undefined } /> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search job cards" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job card, vehicle or customer" /> </label> <label> Status <select aria-label="Job status filter" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} > <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map( (value) => ( <option key={value}>{value}</option> ), )} </select> </label> <label> Estimated Delivery Date <input aria-label="Estimated delivery date" type="date" value={deliveryDate} onChange={(event) => { setDeliveryDate(event.target.value); setPage(1); }} /> </label> <label> Estimated Delivery Month <input aria-label="Estimated delivery month" type="month" value={deliveryMonth} onChange={(event) => { setDeliveryMonth(event.target.value); setPage(1); }} /> </label> {actingUser.role === "admin" && ( <Switch label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }} /> )} <ListSearchActions onClear={() => { setSearch(""); setStatus("ALL"); setDeliveryDate(""); setDeliveryMonth(""); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Job Cards", filters: activeFilterSummary({ Search: search.trim(), Status: status, "Estimated Delivery Date": deliveryDate, "Estimated Delivery Month": deliveryDate ? "" : deliveryMonth, "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Job card records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap manage-job-table"> <table aria-label="Managed job cards"> <thead> <tr> {[ "Job Card", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Actions", ].map( (header) => ( <th key={header}>{header}</th> ), )} </tr> </thead> <tbody> {paged.items.map((row) => ( <tr key={row.job.id} className={jobDeliveryClass(row.job, today)}> <td>{row.job.job_no}</td> <td> {row.vehicle.number} · {row.vehicle.make}{" "} {row.vehicle.model} </td> <td>{row.customer.name}</td> <td>{row.job.estimated_delivery \|\| "—"}</td> <td> <Status status={row.job.main_status} sub={row.job.sub_status} /> </td> <td> <RecordActions inGrid onView={() => setRecord({ id: row.job.id, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ id: row.job.id, mode: "edit" }) : undefined } /> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setStatus("ALL"); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-10493-1

Owner `VisitJobManager`; [src/App.tsx:10493](../src/App.tsx); tag `button`.

Visibility: !archivedOnly

```tsx
className="add-action" onClick={() => setCreating(true)}
```

Label/content expression:

```tsx
 <Plus size={17} /> Add Job Card 
```

#### ACT-App-tsx-10500-1

Owner `VisitJobManager`; [src/App.tsx:10500](../src/App.tsx); tag `AddJobCardDialog`.

Visibility: creating

```tsx
state={state} mutate={mutate} actor={actingUser} onClose={() => setCreating(false)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10508-1

Owner `VisitJobManager`; [src/App.tsx:10508](../src/App.tsx); tag `JobRecordDialog`.

Visibility: dialogJob

```tsx
view={dialogJob} state={state} mutate={mutate} actor={actingUser} mode={archivedOnly ? "view" : (record?.mode ?? "view")} historical={archivedOnly} onClose={() => setRecord(undefined)} onAdminArchive={ !archivedOnly ? () => mutate((db) => cancelJobCard( db, dialogJob.job.id, "Admin override: archived from Management Hub", ), ) : undefined }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10533-1

Owner `VisitJobManager`; [src/App.tsx:10533](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search job cards" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job card, vehicle or customer"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10545-1

Owner `VisitJobManager`; [src/App.tsx:10545](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Job status filter" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map( (value) => ( <option key={value}>{value}</option> ), )} 
```

#### ACT-App-tsx-10563-1

Owner `VisitJobManager`; [src/App.tsx:10563](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Estimated delivery date" type="date" value={deliveryDate} onChange={(event) => { setDeliveryDate(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10575-1

Owner `VisitJobManager`; [src/App.tsx:10575](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Estimated delivery month" type="month" value={deliveryMonth} onChange={(event) => { setDeliveryMonth(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10586-1

Owner `VisitJobManager`; [src/App.tsx:10586](../src/App.tsx); tag `Switch`.

Visibility: actingUser.role === "admin"

```tsx
label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10596-1

Owner `VisitJobManager`; [src/App.tsx:10596](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setStatus("ALL"); setDeliveryDate(""); setDeliveryMonth(""); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10606-1

Owner `VisitJobManager`; [src/App.tsx:10606](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <DownloadMenu report={{ title: "Job Cards", filters: activeFilterSummary({ Search: search.trim(), Status: status, "Estimated Delivery Date": deliveryDate, "Estimated Delivery Month": deliveryDate ? "" : deliveryMonth, "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Job card records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10608-1

Owner `VisitJobManager`; [src/App.tsx:10608](../src/App.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: "Job Cards", filters: activeFilterSummary({ Search: search.trim(), Status: status, "Estimated Delivery Date": deliveryDate, "Estimated Delivery Month": deliveryDate ? "" : deliveryMonth, "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10672-1

Owner `VisitJobManager`; [src/App.tsx:10672](../src/App.tsx); tag `RecordActions`.

Visibility: paged.totalCount > 0

```tsx
inGrid onView={() => setRecord({ id: row.job.id, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ id: row.job.id, mode: "edit" }) : undefined }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10691-1

Owner `VisitJobManager`; [src/App.tsx:10691](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={() => { setSearch(""); setStatus("ALL"); setPage(1); }} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10701-1

Owner `VisitJobManager`; [src/App.tsx:10701](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-10720-1

Owner `EstimateManager`; [src/App.tsx:10720](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Estimates</h3> </div> {view ? ( <EstimateEditor view={view} mutate={mutate} actor={actor} /> ) : ( <p className="empty-state">Select a job first.</p> )} 
```

#### STATE-App-tsx-10744-1

Owner `TaskQcManager`; [src/App.tsx:10744](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Tasks / QC</h3> <div className="action-row"> <button className="primary-action" disabled={!view} onClick={() => setAddingTask(true)} > Add Task </button> <span className="override-badge">Admin override controls</span> </div> </div> {addingTask && view && ( <Dialog title="Add Task" onClose={() => setAddingTask(false)}> <TaskCreator embedded view={view} users={users} mutate={mutate} onCreated={() => setAddingTask(false)} /> </Dialog> )} {view ? ( <QcEditor view={view} technicianId={view.job.technician_id} mutate={mutate} /> ) : ( <p className="empty-state">Select a job first.</p> )} 
```

#### ACT-App-tsx-10748-1

Owner `TaskQcManager`; [src/App.tsx:10748](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" disabled={!view} onClick={() => setAddingTask(true)}
```

Label/content expression:

```tsx
Add Task 
```

#### STATE-App-tsx-10759-1

Owner `TaskQcManager`; [src/App.tsx:10759](../src/App.tsx); tag `Dialog`.

Visibility: addingTask && view

```tsx
title="Add Task" onClose={() => setAddingTask(false)}
```

Label/content expression:

```tsx
 <TaskCreator embedded view={view} users={users} mutate={mutate} onCreated={() => setAddingTask(false)} /> 
```

#### ACT-App-tsx-10760-1

Owner `TaskQcManager`; [src/App.tsx:10760](../src/App.tsx); tag `TaskCreator`.

Visibility: addingTask && view

```tsx
embedded view={view} users={users} mutate={mutate} onCreated={() => setAddingTask(false)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-10808-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10808](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Inventory / Materials</h3> <div className="action-row"> <button className="primary-action" onClick={() => setAddingItem(true)} > Add / Edit Inventory Item </button> <button className="primary-action" onClick={() => setAddingRequest(true)} > Add / Edit Material Request </button> </div> </div> {addingItem && ( <Dialog title="Inventory Item" subtitle="Master, stock-in and adjustment" onClose={() => setAddingItem(false)} > <InventoryEditor embedded state={state} mutate={mutate} /> </Dialog> )} {addingRequest && ( <Dialog title="Material Request" subtitle="Job-linked material request" onClose={() => setAddingRequest(false)} > <MaterialRequestEditor embedded state={state} mutate={mutate} /> </Dialog> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search inventory / materials" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="SKU, name, category or unit" /> </label> <ListSearchActions onClear={clearSearch} /> </div> <PaginationToolbar from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Inventory records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <div className="record-list"> {paged.items.map((item) => ( <div className="managed-record" key={item.id}> <div> <strong>{item.name}</strong> <span> {item.sku} · {item.category} · Stock {item.stock_qty}{" "} {item.unit} </span> </div> </div> ))} </div> {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={clearSearch} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-10812-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10812](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => setAddingItem(true)}
```

Label/content expression:

```tsx
Add / Edit Inventory Item 
```

#### ACT-App-tsx-10818-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10818](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => setAddingRequest(true)}
```

Label/content expression:

```tsx
Add / Edit Material Request 
```

#### STATE-App-tsx-10827-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10827](../src/App.tsx); tag `Dialog`.

Visibility: addingItem

```tsx
title="Inventory Item" subtitle="Master, stock-in and adjustment" onClose={() => setAddingItem(false)}
```

Label/content expression:

```tsx
 <InventoryEditor embedded state={state} mutate={mutate} /> 
```

#### STATE-App-tsx-10836-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10836](../src/App.tsx); tag `Dialog`.

Visibility: addingRequest

```tsx
title="Material Request" subtitle="Job-linked material request" onClose={() => setAddingRequest(false)}
```

Label/content expression:

```tsx
 <MaterialRequestEditor embedded state={state} mutate={mutate} /> 
```

#### ACT-App-tsx-10847-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10847](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search inventory / materials" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="SKU, name, category or unit"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10857-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10857](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clearSearch}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10859-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10859](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Inventory records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10889-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10889](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={clearSearch} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-10892-1

Owner `InventoryMaterialsManager`; [src/App.tsx:10892](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-10956-1

Owner `UserManager`; [src/App.tsx:10956](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Users</h3> <button className="primary-action" onClick={() => { setDraft(empty); setEditing(true); }} > Add User </button> </div> {editing && ( <Dialog title={draft.id ? "Edit User" : "Add User"} onClose={() => setEditing(false)} > <form onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft), ) ) setEditing(false); }} > <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> User role <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) } > {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> User password <input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save User</button> <button type="button" onClick={() => setEditing(false)}> Cancel </button> </div> </form> </Dialog> )} <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search <input aria-label="Search users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email or role" /> </label> <label> Role <select aria-label="Filter users by role" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} > <option value="ALL">All roles</option> {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> Status <select aria-label="Filter users by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} > <option value="ALL">All statuses</option> <option value="ACTIVE">Active</option> <option value="ARCHIVED">Archived</option> </select> </label> <ListSearchActions onClear={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Users", filters: activeFilterSummary({ Search: search.trim(), Role: roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role], Status: statusFilter, }), columns: userColumns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="User records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="User manager"> <thead> <tr> {["Name", "Email", "Role", "Status", "Actions"].map( (header) => ( <th key={header}>{header}</th> ), )} </tr> </thead> <tbody> {paged.items.map((item) => ( <tr key={item.id}> <td> <div className="user-name-with-appointments"> <span>{item.name}</span> {managerDepartments[item.id]?.map((department) => ( <span className="manager-appointment-badge" key={department}> Manager · {department} </span> ))} </div> </td> <td>{item.email}</td> <td>{roleLabels[item.role]}</td> <td>Active</td> <td> <div className="grid-actions"> <button type="button" className="grid-action" onClick={() => { setDraft(item); setEditing(true); }} > Edit </button> <button type="button" className="grid-action grid-action-danger" disabled={item.id === actingUser.id} title={ item.id === actingUser.id ? "You cannot archive your own signed-in account" : undefined } onClick={() => mutate((db) => archiveUser( db, item.id, "Archived by Admin", actingUser.id, ), ) } > Archive </button> </div> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-10959-1

Owner `UserManager`; [src/App.tsx:10959](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => { setDraft(empty); setEditing(true); }}
```

Label/content expression:

```tsx
Add User 
```

#### STATE-App-tsx-10970-1

Owner `UserManager`; [src/App.tsx:10970](../src/App.tsx); tag `Dialog`.

Visibility: editing

```tsx
title={draft.id ? "Edit User" : "Add User"} onClose={() => setEditing(false)}
```

Label/content expression:

```tsx
 <form onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft), ) ) setEditing(false); }} > <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> User role <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) } > {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> User password <input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save User</button> <button type="button" onClick={() => setEditing(false)}> Cancel </button> </div> </form> 
```

#### FORM-App-tsx-10974-1

Owner `UserManager`; [src/App.tsx:10974](../src/App.tsx); tag `form`.

Visibility: editing

```tsx
onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft), ) ) setEditing(false); }}
```

Label/content expression:

```tsx
 <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> User role <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) } > {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> User password <input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save User</button> <button type="button" onClick={() => setEditing(false)}> Cancel </button> </div> 
```

#### ACT-App-tsx-10990-1

Owner `UserManager`; [src/App.tsx:10990](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11000-1

Owner `UserManager`; [src/App.tsx:11000](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11011-1

Owner `UserManager`; [src/App.tsx:11011](../src/App.tsx); tag `select`.

Visibility: editing

```tsx
value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) }
```

Label/content expression:

```tsx
 {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} 
```

#### ACT-App-tsx-11026-1

Owner `UserManager`; [src/App.tsx:11026](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11038-1

Owner `UserManager`; [src/App.tsx:11038](../src/App.tsx); tag `button`.

Visibility: editing

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save User
```

#### ACT-App-tsx-11039-1

Owner `UserManager`; [src/App.tsx:11039](../src/App.tsx); tag `button`.

Visibility: editing

```tsx
type="button" onClick={() => setEditing(false)}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-App-tsx-11049-1

Owner `UserManager`; [src/App.tsx:11049](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email or role"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11061-1

Owner `UserManager`; [src/App.tsx:11061](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Filter users by role" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All roles</option> {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} 
```

#### ACT-App-tsx-11079-1

Owner `UserManager`; [src/App.tsx:11079](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Filter users by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> <option value="ACTIVE">Active</option> <option value="ARCHIVED">Archived</option> 
```

#### ACT-App-tsx-11092-1

Owner `UserManager`; [src/App.tsx:11092](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11101-1

Owner `UserManager`; [src/App.tsx:11101](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <DownloadMenu report={{ title: "Users", filters: activeFilterSummary({ Search: search.trim(), Role: roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role], Status: statusFilter, }), columns: userColumns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="User records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11103-1

Owner `UserManager`; [src/App.tsx:11103](../src/App.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: "Users", filters: activeFilterSummary({ Search: search.trim(), Role: roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role], Status: statusFilter, }), columns: userColumns, rows: filtered, }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11160-1

Owner `UserManager`; [src/App.tsx:11160](../src/App.tsx); tag `button`.

Visibility: paged.totalCount > 0

```tsx
type="button" className="grid-action" onClick={() => { setDraft(item); setEditing(true); }}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-App-tsx-11170-1

Owner `UserManager`; [src/App.tsx:11170](../src/App.tsx); tag `button`.

Visibility: paged.totalCount > 0

```tsx
type="button" className="grid-action grid-action-danger" disabled={item.id === actingUser.id} title={ item.id === actingUser.id ? "You cannot archive your own signed-in account" : undefined } onClick={() => mutate((db) => archiveUser( db, item.id, "Archived by Admin", actingUser.id, ), ) }
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-11203-1

Owner `UserManager`; [src/App.tsx:11203](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11214-1

Owner `UserManager`; [src/App.tsx:11214](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-11339-1

Owner `RemoteUserManager`; [src/App.tsx:11339](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <div> <h3>Users</h3> <span> Accounts are tenant-scoped and invitations are sent by Cognito. </span> </div> <button className="primary-action" onClick={startNew}> Add User </button> </div> {error && ( <div className="api-error" role="alert"> {error} <button onClick={() => void refresh()}>Retry</button> </div> )} {editing && ( <form onSubmit={(event) => { event.preventDefault(); if (draft.id) void run( () => adminUsersApi.update(config, draft as AdminUser), true, ); else void run( () => adminUsersApi.create(config, { name: draft.name, email: draft.email, roleIds: draft.roleIds, branchIds: draft.branchIds, }), true, ); }} > <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> <small> {draft.id ? "Email cannot be changed after invitation." : "Cognito will email a temporary password."} </small> </label> </div> <fieldset className="assignment-fieldset"> <legend>Roles</legend> {directory.roles.map((role) => ( <label key={role.id}> <input type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)} /> {role.name} </label> ))} </fieldset> <fieldset className="assignment-fieldset"> <legend>Permitted branches</legend> {directory.branches.map((branch) => ( <label key={branch.id}> <input type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)} /> {branch.name} </label> ))} </fieldset> <div className="action-row"> <button className="primary-action" disabled={busy}> {draft.id ? "Save Changes" : "Invite User"} </button> <button type="button" disabled={busy} onClick={() => setEditing(false)} > Cancel </button> </div> </form> )} <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search <input aria-label="Search remote users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email, role, branch or status" /> </label> <ListSearchActions onClear={clearSearch} /> </div> <PaginationToolbar from={pagedUsers.from} to={pagedUsers.to} totalCount={pagedUsers.totalCount} page={pagedUsers.page} pageCount={pagedUsers.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Remote user records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {loading ? ( <p className="empty-state">Loading users…</p> ) : ( pagedUsers.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="User manager"> <thead> <tr> {[ "Name", "Email", "Roles", "Branches", "Status", "Actions", ].map((header) => ( <th key={header}>{header}</th> ))} </tr> </thead> <tbody> {pagedUsers.items.map((item) => ( <tr key={item.id}> <td> <div className="user-name-with-appointments"> <span>{item.name}</span> {managerDepartments(item.id).map((department) => ( <span className="manager-appointment-badge" key={department}> Manager · {department} </span> ))} </div> </td> <td>{item.email}</td> <td> {item.roles.map((role) => role.name).join(", ") \|\| "—"} </td> <td> {item.branches.map((branch) => branch.name).join(", ") \|\| "—"} </td> <td> <b className={`membership-status ${item.status.toLowerCase()}`} > {item.status === "INVITED" ? "Invitation pending" : item.status} </b> </td> <td> <div className="grid-actions"> {item.status === "INVITED" && ( <button type="button" className="grid-action" disabled={busy} onClick={() => void run(() => adminUsersApi.resend(config, item.id), ) } > Resend invite </button> )} <button type="button" className="grid-action" disabled={busy} onClick={() => { setDraft({ id: item.id, name: item.name, email: item.email, roleIds: item.roleIds, branchIds: item.branchIds, version: item.version, }); setEditing(true); }} > Edit </button> <button type="button" className="grid-action grid-action-danger" disabled={busy \|\| item.id === actorId} title={ item.id === actorId ? "You cannot archive your own signed-in account" : undefined } onClick={() => { const reason = window.prompt( "Why is this user being archived?", ); if (reason?.trim()) void run(() => adminUsersApi.archive(config, item.id, reason), ); }} > Archive </button> </div> </td> </tr> ))} </tbody> </table> </div> ) )} {!loading && pagedUsers.totalCount === 0 && ( <div className="list-empty"> <h3>No matching users</h3> <FilterClearButton onClick={clearSearch} label="Clear filters" /> </div> )} <ResultPagination page={pagedUsers.page} pageCount={pagedUsers.pageCount} onChange={setPage} /> 
```

#### ACT-App-tsx-11347-1

Owner `RemoteUserManager`; [src/App.tsx:11347](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={startNew}
```

Label/content expression:

```tsx
Add User 
```

#### STATE-App-tsx-11352-1

Owner `RemoteUserManager`; [src/App.tsx:11352](../src/App.tsx); tag `div`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 {error} <button onClick={() => void refresh()}>Retry</button> 
```

#### ACT-App-tsx-11354-1

Owner `RemoteUserManager`; [src/App.tsx:11354](../src/App.tsx); tag `button`.

Visibility: error

```tsx
onClick={() => void refresh()}
```

Label/content expression:

```tsx
Retry
```

#### FORM-App-tsx-11358-1

Owner `RemoteUserManager`; [src/App.tsx:11358](../src/App.tsx); tag `form`.

Visibility: editing

```tsx
onSubmit={(event) => { event.preventDefault(); if (draft.id) void run( () => adminUsersApi.update(config, draft as AdminUser), true, ); else void run( () => adminUsersApi.create(config, { name: draft.name, email: draft.email, roleIds: draft.roleIds, branchIds: draft.branchIds, }), true, ); }}
```

Label/content expression:

```tsx
 <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> <small> {draft.id ? "Email cannot be changed after invitation." : "Cognito will email a temporary password."} </small> </label> </div> <fieldset className="assignment-fieldset"> <legend>Roles</legend> {directory.roles.map((role) => ( <label key={role.id}> <input type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)} /> {role.name} </label> ))} </fieldset> <fieldset className="assignment-fieldset"> <legend>Permitted branches</legend> {directory.branches.map((branch) => ( <label key={branch.id}> <input type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)} /> {branch.name} </label> ))} </fieldset> <div className="action-row"> <button className="primary-action" disabled={busy}> {draft.id ? "Save Changes" : "Invite User"} </button> <button type="button" disabled={busy} onClick={() => setEditing(false)} > Cancel </button> </div> 
```

#### ACT-App-tsx-11382-1

Owner `RemoteUserManager`; [src/App.tsx:11382](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11392-1

Owner `RemoteUserManager`; [src/App.tsx:11392](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11412-1

Owner `RemoteUserManager`; [src/App.tsx:11412](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11425-1

Owner `RemoteUserManager`; [src/App.tsx:11425](../src/App.tsx); tag `input`.

Visibility: editing

```tsx
type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11435-1

Owner `RemoteUserManager`; [src/App.tsx:11435](../src/App.tsx); tag `button`.

Visibility: editing

```tsx
className="primary-action" disabled={busy}
```

Label/content expression:

```tsx
 {draft.id ? "Save Changes" : "Invite User"} 
```

#### ACT-App-tsx-11438-1

Owner `RemoteUserManager`; [src/App.tsx:11438](../src/App.tsx); tag `button`.

Visibility: editing

```tsx
type="button" disabled={busy} onClick={() => setEditing(false)}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-App-tsx-11451-1

Owner `RemoteUserManager`; [src/App.tsx:11451](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search remote users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email, role, branch or status"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11461-1

Owner `RemoteUserManager`; [src/App.tsx:11461](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clearSearch}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11463-1

Owner `RemoteUserManager`; [src/App.tsx:11463](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
from={pagedUsers.from} to={pagedUsers.to} totalCount={pagedUsers.totalCount} page={pagedUsers.page} pageCount={pagedUsers.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Remote user records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11530-1

Owner `RemoteUserManager`; [src/App.tsx:11530](../src/App.tsx); tag `button`.

Visibility: item.status === "INVITED"; pagedUsers.totalCount > 0; loading

```tsx
type="button" className="grid-action" disabled={busy} onClick={() => void run(() => adminUsersApi.resend(config, item.id), ) }
```

Label/content expression:

```tsx
Resend invite 
```

#### ACT-App-tsx-11543-1

Owner `RemoteUserManager`; [src/App.tsx:11543](../src/App.tsx); tag `button`.

Visibility: pagedUsers.totalCount > 0; loading

```tsx
type="button" className="grid-action" disabled={busy} onClick={() => { setDraft({ id: item.id, name: item.name, email: item.email, roleIds: item.roleIds, branchIds: item.branchIds, version: item.version, }); setEditing(true); }}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-App-tsx-11561-1

Owner `RemoteUserManager`; [src/App.tsx:11561](../src/App.tsx); tag `button`.

Visibility: pagedUsers.totalCount > 0; loading

```tsx
type="button" className="grid-action grid-action-danger" disabled={busy \|\| item.id === actorId} title={ item.id === actorId ? "You cannot archive your own signed-in account" : undefined } onClick={() => { const reason = window.prompt( "Why is this user being archived?", ); if (reason?.trim()) void run(() => adminUsersApi.archive(config, item.id, reason), ); }}
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-11594-1

Owner `RemoteUserManager`; [src/App.tsx:11594](../src/App.tsx); tag `FilterClearButton`.

Visibility: !loading && pagedUsers.totalCount === 0

```tsx
onClick={clearSearch} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11597-1

Owner `RemoteUserManager`; [src/App.tsx:11597](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={pagedUsers.page} pageCount={pagedUsers.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### FORM-App-tsx-11665-1

Owner `CustomerEditor`; [src/App.tsx:11665](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={embedded ? "" : "desk-panel"} onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => value.id ? updateCustomer(db, value.id, value) : createCustomer(db, value), ) ) onSaved?.(); }}
```

Label/content expression:

```tsx
 {!embedded && ( <PanelTitle icon={<UserRound />} title="Customer Form" subtitle={value.id ? "Edit selected customer" : "Add customer"} /> )} <label> Customer name <input aria-label="Customer name" required value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /> </label> <label> Mobile <input required value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value }) } /> </label> <label> Type <input required value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })} /> </label> <div className="action-row"> <button className="primary-action">Save Customer</button> <button type="button" onClick={() => setValue({ id: 0, name: "", mobile: "", type: "Individual" }) } > New </button> {value.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer master"), ) } > Archive </button> )} </div> 
```

#### ACT-App-tsx-11688-1

Owner `CustomerEditor`; [src/App.tsx:11688](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Customer name" required value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11697-1

Owner `CustomerEditor`; [src/App.tsx:11697](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11707-1

Owner `CustomerEditor`; [src/App.tsx:11707](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11714-1

Owner `CustomerEditor`; [src/App.tsx:11714](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Customer
```

#### ACT-App-tsx-11715-1

Owner `CustomerEditor`; [src/App.tsx:11715](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={() => setValue({ id: 0, name: "", mobile: "", type: "Individual" }) }
```

Label/content expression:

```tsx
New 
```

#### ACT-App-tsx-11724-1

Owner `CustomerEditor`; [src/App.tsx:11724](../src/App.tsx); tag `button`.

Visibility: value.id > 0

```tsx
type="button" className="danger-action" onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer master"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### FORM-App-tsx-11758-1

Owner `VehicleMasterPanel`; [src/App.tsx:11758](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={embedded ? "" : "desk-panel"} onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => draft.id ? updateVehicle(db, draft.id, draft) : createVehicle(db, draft), ) ) onSaved?.(); }}
```

Label/content expression:

```tsx
 {!embedded && ( <PanelTitle icon={<Car />} title="Vehicle Form" subtitle="Vehicle master CRUD" /> )} <select value={draft.id} onChange={(event) => { const next = state.vehicles.find( (item) => item.id === Number(event.target.value), ) ?? { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0, }; setDraft(next); setValue(next); }} > <option value={0}>New vehicle</option> {state.vehicles.map((vehicle) => ( <option key={vehicle.id} value={vehicle.id}> {vehicle.number} </option> ))} </select> <label> Customer <select value={draft.customer_id} onChange={(event) => setDraft({ ...draft, customer_id: Number(event.target.value) }) } > {state.customers.map((customer) => ( <option key={customer.id} value={customer.id}> {customer.name} </option> ))} </select> </label> <div className="form-grid"> <label> Number <input value={draft.number} onChange={(event) => setDraft({ ...draft, number: event.target.value }) } /> </label> <label> Make <input value={draft.make} onChange={(event) => setDraft({ ...draft, make: event.target.value }) } /> </label> <label> Model <input value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value }) } /> </label> <label> Color <input value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value }) } /> </label> <label> KM <input type="number" value={draft.km} onChange={(event) => setDraft({ ...draft, km: Number(event.target.value) }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save Vehicle</button> {draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveVehicle(db, draft.id, "Archived from vehicle master"), ) } > Archive </button> )} </div> 
```

#### ACT-App-tsx-11779-1

Owner `VehicleMasterPanel`; [src/App.tsx:11779](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.id} onChange={(event) => { const next = state.vehicles.find( (item) => item.id === Number(event.target.value), ) ?? { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0, }; setDraft(next); setValue(next); }}
```

Label/content expression:

```tsx
 <option value={0}>New vehicle</option> {state.vehicles.map((vehicle) => ( <option key={vehicle.id} value={vehicle.id}> {vehicle.number} </option> ))} 
```

#### ACT-App-tsx-11806-1

Owner `VehicleMasterPanel`; [src/App.tsx:11806](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.customer_id} onChange={(event) => setDraft({ ...draft, customer_id: Number(event.target.value) }) }
```

Label/content expression:

```tsx
 {state.customers.map((customer) => ( <option key={customer.id} value={customer.id}> {customer.name} </option> ))} 
```

#### ACT-App-tsx-11822-1

Owner `VehicleMasterPanel`; [src/App.tsx:11822](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.number} onChange={(event) => setDraft({ ...draft, number: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11831-1

Owner `VehicleMasterPanel`; [src/App.tsx:11831](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.make} onChange={(event) => setDraft({ ...draft, make: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11840-1

Owner `VehicleMasterPanel`; [src/App.tsx:11840](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11849-1

Owner `VehicleMasterPanel`; [src/App.tsx:11849](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11858-1

Owner `VehicleMasterPanel`; [src/App.tsx:11858](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={draft.km} onChange={(event) => setDraft({ ...draft, km: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11868-1

Owner `VehicleMasterPanel`; [src/App.tsx:11868](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Vehicle
```

#### ACT-App-tsx-11870-1

Owner `VehicleMasterPanel`; [src/App.tsx:11870](../src/App.tsx); tag `button`.

Visibility: draft.id > 0

```tsx
type="button" className="danger-action" onClick={() => mutate((db) => archiveVehicle(db, draft.id, "Archived from vehicle master"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### FORM-App-tsx-11905-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11905](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onSubmit={(event) => { event.preventDefault(); mutate((db) => updateVisit(db, view.visit.id, draft)); }}
```

Label/content expression:

```tsx
 <label> Advisor <select value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) }) } > {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} </select> </label> <div className="form-grid"> <label> Fuel <input value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value }) } /> </label> <label> Keys <input value={draft.keys} onChange={(event) => setDraft({ ...draft, keys: event.target.value }) } /> </label> <label> Accessories <input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value }) } /> </label> <label> Photo Note <input value={draft.photos_note} onChange={(event) => setDraft({ ...draft, photos_note: event.target.value }) } /> </label> </div> <label> Requested Work <input value={draft.requested_work} onChange={(event) => setDraft({ ...draft, requested_work: event.target.value }) } /> </label> <button className="primary-action">Save Visit</button> 
```

#### ACT-App-tsx-11913-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11913](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) }) }
```

Label/content expression:

```tsx
 {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} 
```

#### ACT-App-tsx-11929-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11929](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11938-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11938](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.keys} onChange={(event) => setDraft({ ...draft, keys: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11947-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11947](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11956-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11956](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.photos_note} onChange={(event) => setDraft({ ...draft, photos_note: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11966-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11966](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.requested_work} onChange={(event) => setDraft({ ...draft, requested_work: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-11973-1

Owner `DuplicateVisitEditor`; [src/App.tsx:11973](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Visit
```

#### ACT-App-tsx-12007-1

Owner `AdminJobEditor`; [src/App.tsx:12007](../src/App.tsx); tag `JobEditor`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
{...props} saved={saved} onSaveResult={onSaveResult}
```

Label/content expression:

```tsx

```

#### FORM-App-tsx-12046-1

Owner `JobEditor`; [src/App.tsx:12046](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onSubmit={(event) => { event.preventDefault(); setError(""); const ok = mutate( (db) => saveJobDetailsForActor(db, view.job.id, actor.id, draft), setError, ); onSaveResult(ok); }}
```

Label/content expression:

```tsx
 <div className="form-grid"> <label className="locked-assignment-field"> Service advisor <select aria-label="Service advisor (locked)" value={draft.advisor_id} disabled > {users .filter((item) => item.role === "service") .map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} </select> <small>This assignment is locked and cannot be changed here.</small> </label> <label> Technician <select value={draft.technician_id} onChange={(event) => setDraft({ ...draft, technician_id: Number(event.target.value), }) } > {users .filter((item) => item.role === "tech") .map((tech) => ( <option key={tech.id} value={tech.id}> {tech.name} </option> ))} </select> </label> <label> Main Status <select aria-label="Main Status" disabled value={view.job.main_status} > <option>{view.job.main_status}</option> </select> </label> <label> Promised <input value={draft.promised_at} onChange={(event) => setDraft({ ...draft, promised_at: event.target.value }) } /> </label> </div> <label> Work List <input value={draft.work_list} onChange={(event) => setDraft({ ...draft, work_list: event.target.value }) } /> </label> <label> Customer Instructions <input value={draft.customer_instructions} onChange={(event) => setDraft({ ...draft, customer_instructions: event.target.value }) } /> </label> <label> Internal Instructions <input value={draft.internal_instructions} onChange={(event) => setDraft({ ...draft, internal_instructions: event.target.value }) } /> </label> <label> Advisor Notes <input value={draft.advisor_notes} onChange={(event) => setDraft({ ...draft, advisor_notes: event.target.value }) } /> </label> <h4>Job Sheet</h4> <div className="form-grid"> <label> Service Type <select value={draft.service_type} onChange={(event) => setDraft({ ...draft, service_type: event.target.value }) } > <option value="">—</option> {SERVICE_TYPES.map((item) => ( <option key={item}>{item}</option> ))} </select> </label> <label> Pickup / Drop <select value={draft.pickup_drop} onChange={(event) => setDraft({ ...draft, pickup_drop: event.target.value }) } > <option value="">—</option> {PICKUP_DROP_OPTIONS.map((item) => ( <option key={item}>{item}</option> ))} </select> </label> <label> Estimated Delivery Date <input type="date" value={draft.estimated_delivery} onChange={(event) => setDraft({ ...draft, estimated_delivery: event.target.value }) } /> </label> <label> Fuel <select value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value }) } > {[...new Set([draft.fuel, ...FUEL_LEVELS])] .filter(Boolean) .map((item) => ( <option key={item}>{item}</option> ))} </select> </label> <label> Accessories <input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value }) } /> </label> <label> Engine Number <input value={draft.engine_no} onChange={(event) => setDraft({ ...draft, engine_no: event.target.value }) } /> </label> </div> <label> Address <input value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value }) } /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} <div className="job-details-save-row"> <button className="primary-action">Save Job Details</button> {saved && ( <span className="job-details-saved" role="status"> <Check size={15} aria-hidden="true" /> Job details saved </span> )} </div> 
```

#### ACT-App-tsx-12060-1

Owner `JobEditor`; [src/App.tsx:12060](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Service advisor (locked)" value={draft.advisor_id} disabled
```

Label/content expression:

```tsx
 {users .filter((item) => item.role === "service") .map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} 
```

#### ACT-App-tsx-12077-1

Owner `JobEditor`; [src/App.tsx:12077](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.technician_id} onChange={(event) => setDraft({ ...draft, technician_id: Number(event.target.value), }) }
```

Label/content expression:

```tsx
 {users .filter((item) => item.role === "tech") .map((tech) => ( <option key={tech.id} value={tech.id}> {tech.name} </option> ))} 
```

#### ACT-App-tsx-12097-1

Owner `JobEditor`; [src/App.tsx:12097](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Main Status" disabled value={view.job.main_status}
```

Label/content expression:

```tsx
 <option>{view.job.main_status}</option> 
```

#### ACT-App-tsx-12107-1

Owner `JobEditor`; [src/App.tsx:12107](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.promised_at} onChange={(event) => setDraft({ ...draft, promised_at: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12117-1

Owner `JobEditor`; [src/App.tsx:12117](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.work_list} onChange={(event) => setDraft({ ...draft, work_list: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12126-1

Owner `JobEditor`; [src/App.tsx:12126](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.customer_instructions} onChange={(event) => setDraft({ ...draft, customer_instructions: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12135-1

Owner `JobEditor`; [src/App.tsx:12135](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.internal_instructions} onChange={(event) => setDraft({ ...draft, internal_instructions: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12144-1

Owner `JobEditor`; [src/App.tsx:12144](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.advisor_notes} onChange={(event) => setDraft({ ...draft, advisor_notes: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12155-1

Owner `JobEditor`; [src/App.tsx:12155](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.service_type} onChange={(event) => setDraft({ ...draft, service_type: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="">—</option> {SERVICE_TYPES.map((item) => ( <option key={item}>{item}</option> ))} 
```

#### ACT-App-tsx-12169-1

Owner `JobEditor`; [src/App.tsx:12169](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.pickup_drop} onChange={(event) => setDraft({ ...draft, pickup_drop: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="">—</option> {PICKUP_DROP_OPTIONS.map((item) => ( <option key={item}>{item}</option> ))} 
```

#### ACT-App-tsx-12183-1

Owner `JobEditor`; [src/App.tsx:12183](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={draft.estimated_delivery} onChange={(event) => setDraft({ ...draft, estimated_delivery: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12193-1

Owner `JobEditor`; [src/App.tsx:12193](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value }) }
```

Label/content expression:

```tsx
 {[...new Set([draft.fuel, ...FUEL_LEVELS])] .filter(Boolean) .map((item) => ( <option key={item}>{item}</option> ))} 
```

#### ACT-App-tsx-12208-1

Owner `JobEditor`; [src/App.tsx:12208](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12217-1

Owner `JobEditor`; [src/App.tsx:12217](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.engine_no} onChange={(event) => setDraft({ ...draft, engine_no: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12227-1

Owner `JobEditor`; [src/App.tsx:12227](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value }) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-12235-1

Owner `JobEditor`; [src/App.tsx:12235](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-12240-1

Owner `JobEditor`; [src/App.tsx:12240](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Job Details
```

#### STATE-App-tsx-12242-1

Owner `JobEditor`; [src/App.tsx:12242](../src/App.tsx); tag `span`.

Visibility: saved

```tsx
className="job-details-saved" role="status"
```

Label/content expression:

```tsx
 <Check size={15} aria-hidden="true" /> Job details saved 
```

#### ACT-App-tsx-12376-1

Owner `JobLifecyclePanel`; [src/App.tsx:12376](../src/App.tsx); tag `button`.

Visibility: view.material_approval?.status === "Rejected" && actor.role === "service" && actor.id === view.job.advisor_id

```tsx
type="button" className="primary-action" onClick={() => mutate( (db) => resubmitMaterialApprovalForActor(db, view.job.id, actor.id), setError, ) }
```

Label/content expression:

```tsx
Resubmit for Approval 
```

#### ACT-App-tsx-12394-1

Owner `JobLifecyclePanel`; [src/App.tsx:12394](../src/App.tsx); tag `button`.

Visibility: allowed.length > 0

```tsx
type="button" key={status} className={ status === "CANCELLED" ? "danger-action" : "primary-action" } disabled={status === "COMPLETED" && !canCompleteWithInvoice(view)} title={ status === "COMPLETED" && !canCompleteWithInvoice(view) ? "Create an Invoice before completing the job." : undefined } onClick={() => { setTarget(status); setNote(""); setError(""); }}
```

Label/content expression:

```tsx
 {lifecycleActionLabel(view.job.main_status, status)} 
```

#### STATE-App-tsx-12418-1

Owner `JobLifecyclePanel`; [src/App.tsx:12418](../src/App.tsx); tag `p`.

Visibility: error && !target

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-12491-1

Owner `JobLifecyclePanel`; [src/App.tsx:12491](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="checkbox" checked={Boolean(item.checked_at)} disabled={!enabled} onChange={(event) => toggle(item, event.target.checked)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12518-1

Owner `JobLifecyclePanel`; [src/App.tsx:12518](../src/App.tsx); tag `button`.

Visibility: canMutate && !isGoogleReviewReminder && !artifactLocked && (notApplicable \|\| !item.checked_at) && !( !notApplicable && (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes( item.label, ) && view.material_requests.length > 0 )

```tsx
type="button" className="link-action" disabled={notApplicable && laterChecked} onClick={() => toggleNotApplicable(item, !notApplicable)}
```

Label/content expression:

```tsx
 {notApplicable ? "Undo N/A" : "Mark N/A"} 
```

#### STATE-App-tsx-12543-1

Owner `JobLifecyclePanel`; [src/App.tsx:12543](../src/App.tsx); tag `Dialog`.

Visibility: target

```tsx
title={`${lifecycleActionLabel(view.job.main_status, target)}?`} subtitle={`${view.job.job_no}: ${view.job.main_status} → ${target}`} onClose={() => { setTarget(undefined); setError(""); }} footer={ <button className="primary-action" type="submit" form="lifecycle-confirm-form" > Confirm status change </button> }
```

Label/content expression:

```tsx
 <form id="lifecycle-confirm-form" onSubmit={confirm}> <label> Confirmation note <textarea data-dialog-initial-focus aria-describedby="lifecycle-note-help" value={note} onChange={(event) => setNote(event.target.value)} /> </label> <p id="lifecycle-note-help" className="field-help"> Required. This note is recorded in status history. </p> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 
```

#### ACT-App-tsx-12551-1

Owner `JobLifecyclePanel`; [src/App.tsx:12551](../src/App.tsx); tag `button`.

Visibility: target

```tsx
className="primary-action" type="submit" form="lifecycle-confirm-form"
```

Label/content expression:

```tsx
Confirm status change 
```

#### FORM-App-tsx-12560-1

Owner `JobLifecyclePanel`; [src/App.tsx:12560](../src/App.tsx); tag `form`.

Visibility: target

```tsx
id="lifecycle-confirm-form" onSubmit={confirm}
```

Label/content expression:

```tsx
 <label> Confirmation note <textarea data-dialog-initial-focus aria-describedby="lifecycle-note-help" value={note} onChange={(event) => setNote(event.target.value)} /> </label> <p id="lifecycle-note-help" className="field-help"> Required. This note is recorded in status history. </p> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-12563-1

Owner `JobLifecyclePanel`; [src/App.tsx:12563](../src/App.tsx); tag `textarea`.

Visibility: target

```tsx
data-dialog-initial-focus aria-describedby="lifecycle-note-help" value={note} onChange={(event) => setNote(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-12574-1

Owner `JobLifecyclePanel`; [src/App.tsx:12574](../src/App.tsx); tag `p`.

Visibility: error; target

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-12610-1

Owner `ApproveEstimateDialog`; [src/App.tsx:12610](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Approve Estimate?" subtitle={`${view.job.job_no} · Approval records the customer confirmation`} onClose={onClose} footer={ <button className="primary-action" type="submit" form="approve-estimate-form" > Approve Estimate </button> }
```

Label/content expression:

```tsx
 <form id="approve-estimate-form" onSubmit={submit}> <label> Approval note <textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 
```

#### ACT-App-tsx-12615-1

Owner `ApproveEstimateDialog`; [src/App.tsx:12615](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="approve-estimate-form"
```

Label/content expression:

```tsx
Approve Estimate 
```

#### FORM-App-tsx-12624-1

Owner `ApproveEstimateDialog`; [src/App.tsx:12624](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="approve-estimate-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <label> Approval note <textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-12627-1

Owner `ApproveEstimateDialog`; [src/App.tsx:12627](../src/App.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-12634-1

Owner `ApproveEstimateDialog`; [src/App.tsx:12634](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-12705-1

Owner `EstimateEditor`; [src/App.tsx:12705](../src/App.tsx); tag `button`.

Visibility: canMutate

```tsx
className="primary-action" onClick={() => setOpen(true)}
```

Label/content expression:

```tsx
 {view.estimate ? "Edit Estimate" : "Create Estimate"} 
```

#### ACT-App-tsx-12715-1

Owner `EstimateEditor`; [src/App.tsx:12715](../src/App.tsx); tag `EstimateDialog`.

Visibility: open

```tsx
view={view} actor={actor} mutate={mutate} onClose={() => setOpen(false)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-12788-1

Owner `EstimateDialog`; [src/App.tsx:12788](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide className="dialog-document-editor estimate-dialog" title={`${view.estimate ? "Edit" : "Create"} Estimate`} subtitle={`${view.job.job_no} · Changes apply only when saved`} onClose={onClose} footer={ <button className="primary-action" type="submit" form="estimate-dialog-form" > Save Estimate </button> }
```

Label/content expression:

```tsx
 <form id="estimate-dialog-form" onSubmit={save} className="estimate-dialog-form" > <div className="estimate-items"> <div className="line-items-header"> <strong>Estimate items</strong> <button type="button" className="add-line-item" onClick={() => setItems((rows) => [ ...rows, { key: `new-${Date.now()}-${rows.length}`, kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18, }, ]) } > + Add Item </button> </div> <div className="estimate-item estimate-item-heading"> <span>Kind</span> <span>Description</span> <span>Quantity</span> <span>Rate</span> <span>GST type</span> <span>GST rate</span> <span>Action</span> </div> {items.map((item, index) => ( <div className="estimate-item" key={item.key}> <select aria-label={`Item ${index + 1} kind`} value={item.kind} onChange={(event) => updateItem(item.key, { kind: event.target.value as EstimateDraftRow["kind"], }) } > <option>Service</option> <option>Material</option> </select> <input data-dialog-initial-focus={index === 0 ? true : undefined} aria-label={`Item ${index + 1} description`} value={item.description} onChange={(event) => updateItem(item.key, { description: event.target.value }) } /> <input aria-label={`Item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.key, { qty: Number(event.target.value) }) } /> <input aria-label={`Item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.key, { rate: Number(event.target.value) }) } /> <select aria-label={`Item ${index + 1} GST type`} value={item.gst_type} onChange={(event) => updateItem(item.key, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }), }) } > <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option> </select> {item.gst_type === "No GST" ? ( <span className="gst-no-rate">0%</span> ) : ( <SearchSelect label={`Item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} onChange={(value) => updateItem(item.key, { gst_rate: Number(value) }) } placeholder="GST rate" hideLabel /> )} <button type="button" className="link-action line-remove" aria-label={`Remove item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key)) } > Remove </button> </div> ))} </div> <div className="form-grid estimate-form-grid"> <label className="estimate-discount"> Discount <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /> </label> </div> <label className="estimate-notes"> Notes <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <div className="estimate-total"> <span>Subtotal {money(totals.subtotal)}</span> <span>GST {money(totals.gst)}</span> <strong>Total {money(totals.total)}</strong> </div> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 
```

#### ACT-App-tsx-12795-1

Owner `EstimateDialog`; [src/App.tsx:12795](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="estimate-dialog-form"
```

Label/content expression:

```tsx
Save Estimate 
```

#### FORM-App-tsx-12804-1

Owner `EstimateDialog`; [src/App.tsx:12804](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="estimate-dialog-form" onSubmit={save} className="estimate-dialog-form"
```

Label/content expression:

```tsx
 <div className="estimate-items"> <div className="line-items-header"> <strong>Estimate items</strong> <button type="button" className="add-line-item" onClick={() => setItems((rows) => [ ...rows, { key: `new-${Date.now()}-${rows.length}`, kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18, }, ]) } > + Add Item </button> </div> <div className="estimate-item estimate-item-heading"> <span>Kind</span> <span>Description</span> <span>Quantity</span> <span>Rate</span> <span>GST type</span> <span>GST rate</span> <span>Action</span> </div> {items.map((item, index) => ( <div className="estimate-item" key={item.key}> <select aria-label={`Item ${index + 1} kind`} value={item.kind} onChange={(event) => updateItem(item.key, { kind: event.target.value as EstimateDraftRow["kind"], }) } > <option>Service</option> <option>Material</option> </select> <input data-dialog-initial-focus={index === 0 ? true : undefined} aria-label={`Item ${index + 1} description`} value={item.description} onChange={(event) => updateItem(item.key, { description: event.target.value }) } /> <input aria-label={`Item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.key, { qty: Number(event.target.value) }) } /> <input aria-label={`Item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.key, { rate: Number(event.target.value) }) } /> <select aria-label={`Item ${index + 1} GST type`} value={item.gst_type} onChange={(event) => updateItem(item.key, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }), }) } > <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option> </select> {item.gst_type === "No GST" ? ( <span className="gst-no-rate">0%</span> ) : ( <SearchSelect label={`Item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} onChange={(value) => updateItem(item.key, { gst_rate: Number(value) }) } placeholder="GST rate" hideLabel /> )} <button type="button" className="link-action line-remove" aria-label={`Remove item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key)) } > Remove </button> </div> ))} </div> <div className="form-grid estimate-form-grid"> <label className="estimate-discount"> Discount <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /> </label> </div> <label className="estimate-notes"> Notes <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <div className="estimate-total"> <span>Subtotal {money(totals.subtotal)}</span> <span>GST {money(totals.gst)}</span> <strong>Total {money(totals.total)}</strong> </div> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-12812-1

Owner `EstimateDialog`; [src/App.tsx:12812](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="add-line-item" onClick={() => setItems((rows) => [ ...rows, { key: `new-${Date.now()}-${rows.length}`, kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18, }, ]) }
```

Label/content expression:

```tsx
+ Add Item 
```

#### ACT-App-tsx-12844-1

Owner `EstimateDialog`; [src/App.tsx:12844](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Item ${index + 1} kind`} value={item.kind} onChange={(event) => updateItem(item.key, { kind: event.target.value as EstimateDraftRow["kind"], }) }
```

Label/content expression:

```tsx
 <option>Service</option> <option>Material</option> 
```

#### ACT-App-tsx-12856-1

Owner `EstimateDialog`; [src/App.tsx:12856](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus={index === 0 ? true : undefined} aria-label={`Item ${index + 1} description`} value={item.description} onChange={(event) => updateItem(item.key, { description: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12864-1

Owner `EstimateDialog`; [src/App.tsx:12864](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.key, { qty: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12874-1

Owner `EstimateDialog`; [src/App.tsx:12874](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.key, { rate: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12884-1

Owner `EstimateDialog`; [src/App.tsx:12884](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Item ${index + 1} GST type`} value={item.gst_type} onChange={(event) => updateItem(item.key, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }), }) }
```

Label/content expression:

```tsx
 <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option> 
```

#### ACT-App-tsx-12903-1

Owner `EstimateDialog`; [src/App.tsx:12903](../src/App.tsx); tag `SearchSelect`.

Visibility: item.gst_type === "No GST"

```tsx
label={`Item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} onChange={(value) => updateItem(item.key, { gst_rate: Number(value) }) } placeholder="GST rate" hideLabel
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12914-1

Owner `EstimateDialog`; [src/App.tsx:12914](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="link-action line-remove" aria-label={`Remove item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key)) }
```

Label/content expression:

```tsx
Remove 
```

#### ACT-App-tsx-12930-1

Owner `EstimateDialog`; [src/App.tsx:12930](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-12941-1

Owner `EstimateDialog`; [src/App.tsx:12941](../src/App.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
rows={3} value={notes} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-12953-1

Owner `EstimateDialog`; [src/App.tsx:12953](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### FORM-App-tsx-12972-1

Owner `FollowupEditor`; [src/App.tsx:12972](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="desk-panel" onSubmit={(event) => { event.preventDefault(); mutate((db) => draft.id ? updateFollowup(db, draft.id, draft) : createFollowup(db, draft), ); }}
```

Label/content expression:

```tsx
 <PanelTitle icon={<ClipboardCheck />} title="Follow-ups" subtitle="Due date, outcome and completion" /> {view.followups.map((followup) => ( <button type="button" className={draft.id === followup.id ? "row active" : "row"} key={followup.id} onClick={() => setDraft(followup)} > <strong>{followup.due_at}</strong> <span>{followup.done ? "Done" : "Open"}</span> <span>{followup.note}</span> </button> ))} <label> Note <input value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /> </label> <div className="form-grid"> <label> Due <input type="date" value={draft.due_at} onChange={(event) => setDraft({ ...draft, due_at: event.target.value }) } /> </label> <label> Outcome <input value={draft.outcome ?? ""} onChange={(event) => setDraft({ ...draft, outcome: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save Follow-up</button> {draft.id > 0 && ( <button type="button" onClick={() => mutate((db) => markFollowupDone(db, draft.id, draft.outcome \|\| "Done"), ) } > Mark Done </button> )} {draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveFollowup(db, draft.id, "Archived follow-up"), ) } > Archive </button> )} </div> 
```

#### ACT-App-tsx-12989-1

Owner `FollowupEditor`; [src/App.tsx:12989](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={draft.id === followup.id ? "row active" : "row"} key={followup.id} onClick={() => setDraft(followup)}
```

Label/content expression:

```tsx
 <strong>{followup.due_at}</strong> <span>{followup.done ? "Done" : "Open"}</span> <span>{followup.note}</span> 
```

#### ACT-App-tsx-13002-1

Owner `FollowupEditor`; [src/App.tsx:13002](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13010-1

Owner `FollowupEditor`; [src/App.tsx:13010](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={draft.due_at} onChange={(event) => setDraft({ ...draft, due_at: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13020-1

Owner `FollowupEditor`; [src/App.tsx:13020](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.outcome ?? ""} onChange={(event) => setDraft({ ...draft, outcome: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13029-1

Owner `FollowupEditor`; [src/App.tsx:13029](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Follow-up
```

#### ACT-App-tsx-13031-1

Owner `FollowupEditor`; [src/App.tsx:13031](../src/App.tsx); tag `button`.

Visibility: draft.id > 0

```tsx
type="button" onClick={() => mutate((db) => markFollowupDone(db, draft.id, draft.outcome \|\| "Done"), ) }
```

Label/content expression:

```tsx
Mark Done 
```

#### ACT-App-tsx-13043-1

Owner `FollowupEditor`; [src/App.tsx:13043](../src/App.tsx); tag `button`.

Visibility: draft.id > 0

```tsx
type="button" className="danger-action" onClick={() => mutate((db) => archiveFollowup(db, draft.id, "Archived follow-up"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### STATE-App-tsx-13172-1

Owner `JobMediaPanel`; [src/App.tsx:13172](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs media-phase-tabs" role="tablist" aria-label="Photo gallery filter" onKeyDown={handleTabListKeyDown}
```

Label/content expression:

```tsx
 {(["All Photos", "Before Work", "After Work"] as const).map( (filter) => { const id = filter === "All Photos" ? "all" : filter === "Before Work" ? "before" : "after"; return ( <button type="button" id={`media-tab-${view.job.id}-${id}`} role="tab" aria-selected={galleryFilter === filter} aria-controls={`media-panel-${view.job.id}-${id}`} tabIndex={galleryFilter === filter ? 0 : -1} className={galleryFilter === filter ? "active" : ""} key={filter} onClick={() => setGalleryFilter(filter)} > {filter} </button> ); }, )} 
```

#### STATE-App-tsx-13187-1

Owner `JobMediaPanel`; [src/App.tsx:13187](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" id={`media-tab-${view.job.id}-${id}`} role="tab" aria-selected={galleryFilter === filter} aria-controls={`media-panel-${view.job.id}-${id}`} tabIndex={galleryFilter === filter ? 0 : -1} className={galleryFilter === filter ? "active" : ""} key={filter} onClick={() => setGalleryFilter(filter)}
```

Label/content expression:

```tsx
 {filter} 
```

#### STATE-App-tsx-13204-1

Owner `JobMediaPanel`; [src/App.tsx:13204](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id={`media-panel-${view.job.id}-${galleryFilterId}`} role="tabpanel" aria-labelledby={`media-tab-${view.job.id}-${galleryFilterId}`}
```

Label/content expression:

```tsx
 <section className="media-upload" aria-label="Upload photo"> <label> Upload phase <select value={uploadPhase} onChange={(event) => setUploadPhase(event.target.value as JobMediaCategory) } > <option>Before Work</option> <option>After Work</option> </select> </label> {canUpload ? ( <form onSubmit={upload}> <div className="form-grid"> <label> Photo label <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={`${uploadPhase} photo`} /> </label> <label> Image file <input id={`job-media-file-${view.job.id}`} aria-describedby={`job-media-help-${view.job.id}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseFile(event.target.files?.[0]) } /> </label> </div> <p className="field-help" id={`job-media-help-${view.job.id}`}> JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed below 1 MB and are not stored outside this session. </p> {prepared && ( <p className="media-ready" aria-live="polite"> Ready: {prepared.width} × {prepared.height} ·{" "} {Math.ceil(prepared.byteSize / 1024)} KB </p> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} <button className="primary-action" disabled={busy}> {busy ? "Compressing…" : `Upload to ${uploadPhase}`} </button> </form> ) : ( <p className="permission-note"> {canMutateJobLifecycle(actor, view.job) ? mediaLockMessage(uploadPhase) : "Read only. Media changes are limited to the Owner and the linked Service Advisor."} </p> )} </section> {rows.length ? ( <div className="job-media-gallery" data-testid="job-media-gallery"> {rows.map((photo) => ( <article className="job-media-card" key={photo.id}> <img src={photo.src} alt={photo.label} /> <div> <strong>{photo.label}</strong> <span> {photo.category === "Before Work" \|\| photo.category === "After Work" ? photo.category : "General"} </span> <span> {photo.original_name \|\| photo.mime_type \|\| "Image"} {photo.byte_size ? ` · ${Math.ceil(photo.byte_size / 1024)} KB` : ""} </span> </div> {canMutatePhoto(photo) && ( <div className="record-actions"> <button type="button" onClick={() => setEditing(photo)}> Edit </button> <button type="button" className="danger-action" onClick={() => { setArchiveTarget(photo); setArchiveReason(""); }} > Archive </button> </div> )} </article> ))} </div> ) : ( <p className="empty-state"> {galleryFilter === "All Photos" ? "No images yet." : `No ${galleryFilter.toLocaleLowerCase()} images yet.`} </p> )} {editing && ( <MediaMetadataDialog photo={editing} actor={actor} mutate={mutate} onClose={() => setEditing(undefined)} /> )} {archiveTarget && ( <Dialog title="Archive photo?" subtitle={archiveTarget.label} onClose={() => setArchiveTarget(undefined)} footer={ <button className="danger-action" type="submit" form="archive-photo-form" > Archive photo </button> } > <form id="archive-photo-form" onSubmit={(event) => { event.preventDefault(); setError(""); if ( mutate( (db) => archiveJobPhotoForActor( db, archiveTarget.id, actor.id, archiveReason, ), setError, ) ) setArchiveTarget(undefined); }} > <label> Archive reason <textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> </Dialog> )} 
```

#### ACT-App-tsx-13212-1

Owner `JobMediaPanel`; [src/App.tsx:13212](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={uploadPhase} onChange={(event) => setUploadPhase(event.target.value as JobMediaCategory) }
```

Label/content expression:

```tsx
 <option>Before Work</option> <option>After Work</option> 
```

#### FORM-App-tsx-13223-1

Owner `JobMediaPanel`; [src/App.tsx:13223](../src/App.tsx); tag `form`.

Visibility: canUpload

```tsx
onSubmit={upload}
```

Label/content expression:

```tsx
 <div className="form-grid"> <label> Photo label <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={`${uploadPhase} photo`} /> </label> <label> Image file <input id={`job-media-file-${view.job.id}`} aria-describedby={`job-media-help-${view.job.id}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseFile(event.target.files?.[0]) } /> </label> </div> <p className="field-help" id={`job-media-help-${view.job.id}`}> JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed below 1 MB and are not stored outside this session. </p> {prepared && ( <p className="media-ready" aria-live="polite"> Ready: {prepared.width} × {prepared.height} ·{" "} {Math.ceil(prepared.byteSize / 1024)} KB </p> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} <button className="primary-action" disabled={busy}> {busy ? "Compressing…" : `Upload to ${uploadPhase}`} </button> 
```

#### ACT-App-tsx-13227-1

Owner `JobMediaPanel`; [src/App.tsx:13227](../src/App.tsx); tag `input`.

Visibility: canUpload

```tsx
value={label} onChange={(event) => setLabel(event.target.value)} placeholder={`${uploadPhase} photo`}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13235-1

Owner `JobMediaPanel`; [src/App.tsx:13235](../src/App.tsx); tag `input`.

Visibility: canUpload

```tsx
id={`job-media-file-${view.job.id}`} aria-describedby={`job-media-help-${view.job.id}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseFile(event.target.files?.[0]) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-13257-1

Owner `JobMediaPanel`; [src/App.tsx:13257](../src/App.tsx); tag `p`.

Visibility: error; canUpload

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-13261-1

Owner `JobMediaPanel`; [src/App.tsx:13261](../src/App.tsx); tag `button`.

Visibility: canUpload

```tsx
className="primary-action" disabled={busy}
```

Label/content expression:

```tsx
 {busy ? "Compressing…" : `Upload to ${uploadPhase}`} 
```

#### ACT-App-tsx-13295-1

Owner `JobMediaPanel`; [src/App.tsx:13295](../src/App.tsx); tag `button`.

Visibility: canMutatePhoto(photo); rows.length

```tsx
type="button" onClick={() => setEditing(photo)}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-App-tsx-13298-1

Owner `JobMediaPanel`; [src/App.tsx:13298](../src/App.tsx); tag `button`.

Visibility: canMutatePhoto(photo); rows.length

```tsx
type="button" className="danger-action" onClick={() => { setArchiveTarget(photo); setArchiveReason(""); }}
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-13321-1

Owner `JobMediaPanel`; [src/App.tsx:13321](../src/App.tsx); tag `MediaMetadataDialog`.

Visibility: editing

```tsx
photo={editing} actor={actor} mutate={mutate} onClose={() => setEditing(undefined)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-13329-1

Owner `JobMediaPanel`; [src/App.tsx:13329](../src/App.tsx); tag `Dialog`.

Visibility: archiveTarget

```tsx
title="Archive photo?" subtitle={archiveTarget.label} onClose={() => setArchiveTarget(undefined)} footer={ <button className="danger-action" type="submit" form="archive-photo-form" > Archive photo </button> }
```

Label/content expression:

```tsx
 <form id="archive-photo-form" onSubmit={(event) => { event.preventDefault(); setError(""); if ( mutate( (db) => archiveJobPhotoForActor( db, archiveTarget.id, actor.id, archiveReason, ), setError, ) ) setArchiveTarget(undefined); }} > <label> Archive reason <textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 
```

#### ACT-App-tsx-13334-1

Owner `JobMediaPanel`; [src/App.tsx:13334](../src/App.tsx); tag `button`.

Visibility: archiveTarget

```tsx
className="danger-action" type="submit" form="archive-photo-form"
```

Label/content expression:

```tsx
Archive photo 
```

#### FORM-App-tsx-13343-1

Owner `JobMediaPanel`; [src/App.tsx:13343](../src/App.tsx); tag `form`.

Visibility: archiveTarget

```tsx
id="archive-photo-form" onSubmit={(event) => { event.preventDefault(); setError(""); if ( mutate( (db) => archiveJobPhotoForActor( db, archiveTarget.id, actor.id, archiveReason, ), setError, ) ) setArchiveTarget(undefined); }}
```

Label/content expression:

```tsx
 <label> Archive reason <textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-13365-1

Owner `JobMediaPanel`; [src/App.tsx:13365](../src/App.tsx); tag `textarea`.

Visibility: archiveTarget

```tsx
data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-13373-1

Owner `JobMediaPanel`; [src/App.tsx:13373](../src/App.tsx); tag `p`.

Visibility: error; archiveTarget

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-13402-1

Owner `MediaMetadataDialog`; [src/App.tsx:13402](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Edit photo metadata" subtitle={photo.original_name \|\| photo.label} onClose={onClose} footer={ <button className="primary-action" type="submit" form="media-metadata-form" > Save metadata </button> }
```

Label/content expression:

```tsx
 <form id="media-metadata-form" onSubmit={(event) => { event.preventDefault(); if ( mutate( (db) => updateJobPhotoForActor(db, photo.id, actor.id, { label, category, }), setError, ) ) onClose(); }} > <label> Photo label <input data-dialog-initial-focus value={label} onChange={(event) => setLabel(event.target.value)} /> </label> <label> Work phase <select value={category} onChange={(event) => setCategory(event.target.value as JobMediaCategory) } > <option>Before Work</option> <option>After Work</option> </select> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 
```

#### ACT-App-tsx-13407-1

Owner `MediaMetadataDialog`; [src/App.tsx:13407](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="media-metadata-form"
```

Label/content expression:

```tsx
Save metadata 
```

#### FORM-App-tsx-13416-1

Owner `MediaMetadataDialog`; [src/App.tsx:13416](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="media-metadata-form" onSubmit={(event) => { event.preventDefault(); if ( mutate( (db) => updateJobPhotoForActor(db, photo.id, actor.id, { label, category, }), setError, ) ) onClose(); }}
```

Label/content expression:

```tsx
 <label> Photo label <input data-dialog-initial-focus value={label} onChange={(event) => setLabel(event.target.value)} /> </label> <label> Work phase <select value={category} onChange={(event) => setCategory(event.target.value as JobMediaCategory) } > <option>Before Work</option> <option>After Work</option> </select> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-13435-1

Owner `MediaMetadataDialog`; [src/App.tsx:13435](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus value={label} onChange={(event) => setLabel(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13443-1

Owner `MediaMetadataDialog`; [src/App.tsx:13443](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={category} onChange={(event) => setCategory(event.target.value as JobMediaCategory) }
```

Label/content expression:

```tsx
 <option>Before Work</option> <option>After Work</option> 
```

#### STATE-App-tsx-13454-1

Owner `MediaMetadataDialog`; [src/App.tsx:13454](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### FORM-App-tsx-13559-1

Owner `MaterialRequestEditor`; [src/App.tsx:13559](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={embedded ? "" : "desk-panel"} onSubmit={(event) => { event.preventDefault(); save(); }}
```

Label/content expression:

```tsx
 {!embedded && ( <PanelTitle icon={<PackageCheck />} title="Request Form" subtitle={ store ? "Inventory request or tracking-only local purchase" : "Job-linked material request" } /> )} {store && ( <fieldset className="source-toggle"> <legend>Source</legend> <label> <input type="radio" checked={source === "inventory"} onChange={() => { setSource("inventory"); setError(""); }} /> Inventory </label> <label> <input type="radio" checked={source === "local"} onChange={() => { setSource("local"); setError(""); }} /> Local purchase </label> </fieldset> )} {source === "inventory" ? ( <> <label> Request <select value={draft.id} onChange={(event) => selectRequest(Number(event.target.value))} > <option value={0}>New request</option> {requests.map((request) => ( <option key={request.id} value={request.id}> Request #{request.id} </option> ))} </select> </label> {store ? ( <JobPicker jobs={state.jobs} selectedJobId={draft.job_card_id \|\| undefined} onSelect={setJob} label="Material request job" period={period} onPeriodChange={setPeriod} /> ) : ( <label> Job <select value={draft.job_card_id} onChange={(event) => setDraft({ ...draft, job_card_id: Number(event.target.value), }) } > {state.jobs.map((job) => ( <option key={job.job.id} value={job.job.id}> {job.job.job_no} </option> ))} </select> </label> )} <label> Item <select value={draft.item_id} onChange={(event) => setDraft({ ...draft, item_id: Number(event.target.value) }) } > {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} </select> </label> <label> Requested Qty <input type="number" min="0.01" step="0.01" value={draft.requested_qty} onChange={(event) => setDraft({ ...draft, requested_qty: Number(event.target.value), }) } /> </label> </> ) : ( <> <label> Local purchase <select value={purchase.id} onChange={(event) => selectPurchase(Number(event.target.value))} > <option value={0}>New local purchase</option> {purchases.map((item) => ( <option key={item.id} value={item.id}> {item.item_description} · {item.bill_reference} </option> ))} </select> </label> <JobPicker jobs={state.jobs} selectedJobId={purchase.job_card_id \|\| undefined} onSelect={setJob} label="Local purchase job" period={period} onPeriodChange={setPeriod} /> <div className="form-grid"> <label> Item description <input required value={purchase.item_description} onChange={(event) => setPurchase({ ...purchase, item_description: event.target.value, }) } /> </label> <label> Quantity <input required type="number" min="0.01" step="0.01" value={purchase.quantity} onChange={(event) => setPurchase({ ...purchase, quantity: Number(event.target.value), }) } /> </label> <label> Unit <input required value={purchase.unit} onChange={(event) => setPurchase({ ...purchase, unit: event.target.value }) } /> </label> <label> Unit cost <input required type="number" min="0" step="0.01" value={purchase.unit_cost} onChange={(event) => setPurchase({ ...purchase, unit_cost: Number(event.target.value), }) } /> </label> <label> Vendor / shop <input required value={purchase.vendor} onChange={(event) => setPurchase({ ...purchase, vendor: event.target.value }) } /> </label> <label> Bill / reference <input required value={purchase.bill_reference} onChange={(event) => setPurchase({ ...purchase, bill_reference: event.target.value, }) } /> </label> </div> <label> Note (optional) <textarea value={purchase.note ?? ""} onChange={(event) => setPurchase({ ...purchase, note: event.target.value }) } /> </label> </> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} <div className="action-row"> <button className="primary-action"> {source === "local" ? "Save Local Purchase" : "Save Request"} </button> {source === "inventory" && draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate( (db) => archiveMaterialRequest( db, draft.id, "Archived material request", ), setError, ) } > Archive </button> )} {source === "local" && purchase.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate( (db) => archiveLocalPurchase( db, purchase.id, "Archived local purchase", ), setError, ) } > Archive </button> )} </div> 
```

#### ACT-App-tsx-13581-1

Owner `MaterialRequestEditor`; [src/App.tsx:13581](../src/App.tsx); tag `input`.

Visibility: store

```tsx
type="radio" checked={source === "inventory"} onChange={() => { setSource("inventory"); setError(""); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13592-1

Owner `MaterialRequestEditor`; [src/App.tsx:13592](../src/App.tsx); tag `input`.

Visibility: store

```tsx
type="radio" checked={source === "local"} onChange={() => { setSource("local"); setError(""); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13608-1

Owner `MaterialRequestEditor`; [src/App.tsx:13608](../src/App.tsx); tag `select`.

Visibility: source === "inventory"

```tsx
value={draft.id} onChange={(event) => selectRequest(Number(event.target.value))}
```

Label/content expression:

```tsx
 <option value={0}>New request</option> {requests.map((request) => ( <option key={request.id} value={request.id}> Request #{request.id} </option> ))} 
```

#### ACT-App-tsx-13621-1

Owner `MaterialRequestEditor`; [src/App.tsx:13621](../src/App.tsx); tag `JobPicker`.

Visibility: store; source === "inventory"

```tsx
jobs={state.jobs} selectedJobId={draft.job_card_id \|\| undefined} onSelect={setJob} label="Material request job" period={period} onPeriodChange={setPeriod}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13632-1

Owner `MaterialRequestEditor`; [src/App.tsx:13632](../src/App.tsx); tag `select`.

Visibility: store; source === "inventory"

```tsx
value={draft.job_card_id} onChange={(event) => setDraft({ ...draft, job_card_id: Number(event.target.value), }) }
```

Label/content expression:

```tsx
 {state.jobs.map((job) => ( <option key={job.job.id} value={job.job.id}> {job.job.job_no} </option> ))} 
```

#### ACT-App-tsx-13651-1

Owner `MaterialRequestEditor`; [src/App.tsx:13651](../src/App.tsx); tag `select`.

Visibility: source === "inventory"

```tsx
value={draft.item_id} onChange={(event) => setDraft({ ...draft, item_id: Number(event.target.value) }) }
```

Label/content expression:

```tsx
 {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 
```

#### ACT-App-tsx-13666-1

Owner `MaterialRequestEditor`; [src/App.tsx:13666](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
type="number" min="0.01" step="0.01" value={draft.requested_qty} onChange={(event) => setDraft({ ...draft, requested_qty: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13684-1

Owner `MaterialRequestEditor`; [src/App.tsx:13684](../src/App.tsx); tag `select`.

Visibility: source === "inventory"

```tsx
value={purchase.id} onChange={(event) => selectPurchase(Number(event.target.value))}
```

Label/content expression:

```tsx
 <option value={0}>New local purchase</option> {purchases.map((item) => ( <option key={item.id} value={item.id}> {item.item_description} · {item.bill_reference} </option> ))} 
```

#### ACT-App-tsx-13696-1

Owner `MaterialRequestEditor`; [src/App.tsx:13696](../src/App.tsx); tag `JobPicker`.

Visibility: source === "inventory"

```tsx
jobs={state.jobs} selectedJobId={purchase.job_card_id \|\| undefined} onSelect={setJob} label="Local purchase job" period={period} onPeriodChange={setPeriod}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13707-1

Owner `MaterialRequestEditor`; [src/App.tsx:13707](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
required value={purchase.item_description} onChange={(event) => setPurchase({ ...purchase, item_description: event.target.value, }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13720-1

Owner `MaterialRequestEditor`; [src/App.tsx:13720](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
required type="number" min="0.01" step="0.01" value={purchase.quantity} onChange={(event) => setPurchase({ ...purchase, quantity: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13736-1

Owner `MaterialRequestEditor`; [src/App.tsx:13736](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
required value={purchase.unit} onChange={(event) => setPurchase({ ...purchase, unit: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13746-1

Owner `MaterialRequestEditor`; [src/App.tsx:13746](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
required type="number" min="0" step="0.01" value={purchase.unit_cost} onChange={(event) => setPurchase({ ...purchase, unit_cost: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13762-1

Owner `MaterialRequestEditor`; [src/App.tsx:13762](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
required value={purchase.vendor} onChange={(event) => setPurchase({ ...purchase, vendor: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13772-1

Owner `MaterialRequestEditor`; [src/App.tsx:13772](../src/App.tsx); tag `input`.

Visibility: source === "inventory"

```tsx
required value={purchase.bill_reference} onChange={(event) => setPurchase({ ...purchase, bill_reference: event.target.value, }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-13786-1

Owner `MaterialRequestEditor`; [src/App.tsx:13786](../src/App.tsx); tag `textarea`.

Visibility: source === "inventory"

```tsx
value={purchase.note ?? ""} onChange={(event) => setPurchase({ ...purchase, note: event.target.value }) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-13796-1

Owner `MaterialRequestEditor`; [src/App.tsx:13796](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-13801-1

Owner `MaterialRequestEditor`; [src/App.tsx:13801](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
 {source === "local" ? "Save Local Purchase" : "Save Request"} 
```

#### ACT-App-tsx-13805-1

Owner `MaterialRequestEditor`; [src/App.tsx:13805](../src/App.tsx); tag `button`.

Visibility: source === "inventory" && draft.id > 0

```tsx
type="button" className="danger-action" onClick={() => mutate( (db) => archiveMaterialRequest( db, draft.id, "Archived material request", ), setError, ) }
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-13824-1

Owner `MaterialRequestEditor`; [src/App.tsx:13824](../src/App.tsx); tag `button`.

Visibility: source === "local" && purchase.id > 0

```tsx
type="button" className="danger-action" onClick={() => mutate( (db) => archiveLocalPurchase( db, purchase.id, "Archived local purchase", ), setError, ) }
```

Label/content expression:

```tsx
Archive 
```

#### STATE-App-tsx-13888-1

Owner `ReleaseMaterialDialog`; [src/App.tsx:13888](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Confirm material release" subtitle={`${row.view.job.job_no} · ${row.view.vehicle.number}`} onClose={onClose} footer={ <> <button type="button" className="secondary-action" onClick={onClose}> Cancel </button> <button type="button" className="primary-action" onClick={confirm}> Confirm release </button> </> }
```

Label/content expression:

```tsx
 <div className="record-view"> <Info label="Job" value={row.view.job.job_no} /> <Info label="Item" value={item?.name ?? `Item ${row.request.item_id}`} /> <Info label="Requested quantity" value={`${row.request.requested_qty} ${item?.unit ?? ""}`} /> <Info label="Available stock" value={`${available} ${item?.unit ?? ""}`} /> </div> {row.request.requested_qty > available && ( <p className="error-text" role="alert"> Insufficient stock: this release needs {row.request.requested_qty}{" "} {item?.unit ?? "units"}, but only {available} is available. </p> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-13894-1

Owner `ReleaseMaterialDialog`; [src/App.tsx:13894](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={onClose}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-App-tsx-13897-1

Owner `ReleaseMaterialDialog`; [src/App.tsx:13897](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" onClick={confirm}
```

Label/content expression:

```tsx
Confirm release 
```

#### STATE-App-tsx-13919-1

Owner `ReleaseMaterialDialog`; [src/App.tsx:13919](../src/App.tsx); tag `p`.

Visibility: row.request.requested_qty > available

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
Insufficient stock: this release needs {row.request.requested_qty} {" "} {item?.unit ?? "units"} , but only {available} is available. 
```

#### STATE-App-tsx-13925-1

Owner `ReleaseMaterialDialog`; [src/App.tsx:13925](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-13956-1

Owner `MaterialApprovalSubmitDialog`; [src/App.tsx:13956](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Send job for material approval" subtitle={`${row.view.job.job_no} · all outstanding requested materials`} onClose={onClose} footer={ <> <button type="button" className="secondary-action" onClick={onClose}> Cancel </button> <button type="button" className="primary-action" onClick={submit}> Needs Approval </button> </> }
```

Label/content expression:

```tsx
 <p> This holds the job and sends one consolidated material request to Admin. Store cannot issue or change materials until a decision is made. </p> {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-13962-1

Owner `MaterialApprovalSubmitDialog`; [src/App.tsx:13962](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={onClose}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-App-tsx-13965-1

Owner `MaterialApprovalSubmitDialog`; [src/App.tsx:13965](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" onClick={submit}
```

Label/content expression:

```tsx
Needs Approval 
```

#### STATE-App-tsx-13976-1

Owner `MaterialApprovalSubmitDialog`; [src/App.tsx:13976](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-14050-1

Owner `ReconcileEditor`; [src/App.tsx:14050](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title="Reconcile Material" subtitle={`${view.job.job_no} · ${view.vehicle.number}`} onClose={onClose} footer={ <> <button type="button" className="secondary-action" onClick={onClose}> Cancel </button> <button type="submit" form="reconcile-material-form" className="primary-action" disabled={!canSave} > Save Reconciliation </button> </> }
```

Label/content expression:

```tsx
 <form id="reconcile-material-form" className="reconcile-dialog-form" onSubmit={submit} > <dl className="reconciliation-context"> <div> <dt>Job card</dt> <dd>{view.job.job_no}</dd> </div> <div> <dt>Vehicle</dt> <dd>{view.vehicle.number}</dd> </div> <div> <dt>Customer</dt> <dd>{view.customer.name}</dd> </div> <div> <dt>Item</dt> <dd>{item?.name ?? "Unknown"}</dd> </div> <div> <dt>SKU</dt> <dd>{item?.sku ?? "No SKU"}</dd> </div> <div> <dt>Issued</dt> <dd> {request.issued_qty} {item?.unit ?? ""} </dd> </div> </dl> <div className="form-grid"> <label> Used <input data-dialog-initial-focus aria-label="Used quantity" type="number" min="0" step="any" value={used} onChange={changeQuantity(setUsed)} /> </label> <label> Returned <input aria-label="Returned quantity" type="number" min="0" step="any" value={returned} onChange={changeQuantity(setReturned)} /> </label> <label> Wasted <input aria-label="Wasted quantity" type="number" min="0" step="any" value={wasted} onChange={changeQuantity(setWasted)} /> </label> </div> <p className="reconciliation-equation"> {request.issued_qty} issued ={" "} {Number.isFinite(usedQty) ? usedQty : "—"} used +{" "} {Number.isFinite(returnedQty) ? returnedQty : "—"} returned +{" "} {Number.isFinite(wastedQty) ? wastedQty : "—"} wasted +{" "} {Number.isFinite(variance) ? variance : "—"} variance </p> <p className={`reconciliation-state ${state.toLowerCase()}`}> State: {state} · Variance:{" "} {Number.isFinite(variance) ? variance : "—"} </p> {needsZeroAcknowledgement && ( <label className="checkbox-line"> <input aria-label="Confirm no return or wastage" type="checkbox" checked={zeroRecordedAcknowledged} onChange={(event) => { setZeroRecordedAcknowledged(event.target.checked); setError(""); }} />{" "} I confirm that neither returned material nor wastage is being recorded. </label> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 
```

#### ACT-App-tsx-14057-1

Owner `ReconcileEditor`; [src/App.tsx:14057](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={onClose}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-App-tsx-14060-1

Owner `ReconcileEditor`; [src/App.tsx:14060](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="submit" form="reconcile-material-form" className="primary-action" disabled={!canSave}
```

Label/content expression:

```tsx
Save Reconciliation 
```

#### FORM-App-tsx-14071-1

Owner `ReconcileEditor`; [src/App.tsx:14071](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="reconcile-material-form" className="reconcile-dialog-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <dl className="reconciliation-context"> <div> <dt>Job card</dt> <dd>{view.job.job_no}</dd> </div> <div> <dt>Vehicle</dt> <dd>{view.vehicle.number}</dd> </div> <div> <dt>Customer</dt> <dd>{view.customer.name}</dd> </div> <div> <dt>Item</dt> <dd>{item?.name ?? "Unknown"}</dd> </div> <div> <dt>SKU</dt> <dd>{item?.sku ?? "No SKU"}</dd> </div> <div> <dt>Issued</dt> <dd> {request.issued_qty} {item?.unit ?? ""} </dd> </div> </dl> <div className="form-grid"> <label> Used <input data-dialog-initial-focus aria-label="Used quantity" type="number" min="0" step="any" value={used} onChange={changeQuantity(setUsed)} /> </label> <label> Returned <input aria-label="Returned quantity" type="number" min="0" step="any" value={returned} onChange={changeQuantity(setReturned)} /> </label> <label> Wasted <input aria-label="Wasted quantity" type="number" min="0" step="any" value={wasted} onChange={changeQuantity(setWasted)} /> </label> </div> <p className="reconciliation-equation"> {request.issued_qty} issued ={" "} {Number.isFinite(usedQty) ? usedQty : "—"} used +{" "} {Number.isFinite(returnedQty) ? returnedQty : "—"} returned +{" "} {Number.isFinite(wastedQty) ? wastedQty : "—"} wasted +{" "} {Number.isFinite(variance) ? variance : "—"} variance </p> <p className={`reconciliation-state ${state.toLowerCase()}`}> State: {state} · Variance:{" "} {Number.isFinite(variance) ? variance : "—"} </p> {needsZeroAcknowledgement && ( <label className="checkbox-line"> <input aria-label="Confirm no return or wastage" type="checkbox" checked={zeroRecordedAcknowledged} onChange={(event) => { setZeroRecordedAcknowledged(event.target.checked); setError(""); }} />{" "} I confirm that neither returned material nor wastage is being recorded. </label> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-14107-1

Owner `ReconcileEditor`; [src/App.tsx:14107](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus aria-label="Used quantity" type="number" min="0" step="any" value={used} onChange={changeQuantity(setUsed)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14119-1

Owner `ReconcileEditor`; [src/App.tsx:14119](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Returned quantity" type="number" min="0" step="any" value={returned} onChange={changeQuantity(setReturned)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14130-1

Owner `ReconcileEditor`; [src/App.tsx:14130](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Wasted quantity" type="number" min="0" step="any" value={wasted} onChange={changeQuantity(setWasted)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14153-1

Owner `ReconcileEditor`; [src/App.tsx:14153](../src/App.tsx); tag `input`.

Visibility: needsZeroAcknowledgement

```tsx
aria-label="Confirm no return or wastage" type="checkbox" checked={zeroRecordedAcknowledged} onChange={(event) => { setZeroRecordedAcknowledged(event.target.checked); setError(""); }}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-14167-1

Owner `ReconcileEditor`; [src/App.tsx:14167](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### FORM-App-tsx-14246-1

Owner `QuickAddStock`; [src/App.tsx:14246](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="quick-add-stock" onSubmit={submit}
```

Label/content expression:

```tsx
 {!addingNew ? ( <> <SearchSelect label="Existing SKU" options={inventory.map((item) => ({ value: item.id, label: `${item.sku} · ${item.name}`, }))} value={selectedId \|\| undefined} onChange={(value) => setSelectedId(Number(value))} placeholder="Search SKU or material" openOnFocus={false} /> {selected && ( <p className="quick-add-selected"> {selected.name} · {selected.stock_qty} {selected.unit} on hand </p> )} <label> Inward quantity <input aria-label="Inward quantity" type="number" min="0.01" step="0.01" required value={inwardQty} onChange={(event) => setInwardQty(Number(event.target.value))} /> </label> <label> Purchase order (optional) <select aria-label="Purchase order" value={purchaseOrderId} onChange={(event) => { setPurchaseOrderId(Number(event.target.value)); setPurchaseOrderLineId(0); }} > <option value={0}>Unlinked/manual receipt</option> {purchaseOrders .filter((order) => ["Sent", "Partially Received", "Ready to Close"].includes( order.status, ), ) .map((order) => ( <option key={order.id} value={order.id}> {order.po_number} </option> ))} </select> </label> {purchaseOrderId > 0 && ( <label> Purchase order line <select aria-label="Purchase order line" value={purchaseOrderLineId} onChange={(event) => setPurchaseOrderLineId(Number(event.target.value)) } > <option value={0}>Select compatible line</option> {purchaseOrderLines .filter( (line) => line.purchase_order_id === purchaseOrderId && line.item_id === selectedId, ) .map((line) => ( <option key={line.id} value={line.id}> { purchaseOrders.find( (order) => order.id === purchaseOrderId, )?.po_number }{" "} ·{" "} {inventory.find((item) => item.id === line.item_id)?.name}{" "} · ordered {line.ordered_qty} </option> ))} </select> </label> )} <div className="quick-add-actions"> <button type="button" data-dialog-initial-focus className="link-action" onClick={() => setAddingNew(true)} > Add new SKU </button> <button className="primary-action" disabled={ !selectedId \|\| (purchaseOrderId > 0 && !purchaseOrderLineId) } > Record Inward </button> </div> </> ) : ( <> <div className="form-grid"> <label> SKU <input aria-label="New SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Material name <input aria-label="New material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Category <input aria-label="New SKU category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Unit <input aria-label="New SKU unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Low-stock threshold <input aria-label="New SKU low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) } /> </label> <label> Default selling price (₹) <input aria-label="New SKU selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) } /> </label> <label> Initial inward quantity <input aria-label="Initial inward quantity" type="number" min="0" step="0.01" required value={inwardQty} onChange={(event) => setInwardQty(Number(event.target.value))} /> </label> </div> <div className="quick-add-actions"> <button type="button" className="link-action" onClick={() => setAddingNew(false)} > Choose existing SKU </button> <button className="primary-action"> Create SKU &amp; Record Inward </button> </div> </> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} 
```

#### ACT-App-tsx-14249-1

Owner `QuickAddStock`; [src/App.tsx:14249](../src/App.tsx); tag `SearchSelect`.

Visibility: !addingNew

```tsx
label="Existing SKU" options={inventory.map((item) => ({ value: item.id, label: `${item.sku} · ${item.name}`, }))} value={selectedId \|\| undefined} onChange={(value) => setSelectedId(Number(value))} placeholder="Search SKU or material" openOnFocus={false}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14267-1

Owner `QuickAddStock`; [src/App.tsx:14267](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="Inward quantity" type="number" min="0.01" step="0.01" required value={inwardQty} onChange={(event) => setInwardQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14279-1

Owner `QuickAddStock`; [src/App.tsx:14279](../src/App.tsx); tag `select`.

Visibility: !addingNew

```tsx
aria-label="Purchase order" value={purchaseOrderId} onChange={(event) => { setPurchaseOrderId(Number(event.target.value)); setPurchaseOrderLineId(0); }}
```

Label/content expression:

```tsx
 <option value={0}>Unlinked/manual receipt</option> {purchaseOrders .filter((order) => ["Sent", "Partially Received", "Ready to Close"].includes( order.status, ), ) .map((order) => ( <option key={order.id} value={order.id}> {order.po_number} </option> ))} 
```

#### ACT-App-tsx-14304-1

Owner `QuickAddStock`; [src/App.tsx:14304](../src/App.tsx); tag `select`.

Visibility: purchaseOrderId > 0; !addingNew

```tsx
aria-label="Purchase order line" value={purchaseOrderLineId} onChange={(event) => setPurchaseOrderLineId(Number(event.target.value)) }
```

Label/content expression:

```tsx
 <option value={0}>Select compatible line</option> {purchaseOrderLines .filter( (line) => line.purchase_order_id === purchaseOrderId && line.item_id === selectedId, ) .map((line) => ( <option key={line.id} value={line.id}> { purchaseOrders.find( (order) => order.id === purchaseOrderId, )?.po_number }{" "} ·{" "} {inventory.find((item) => item.id === line.item_id)?.name}{" "} · ordered {line.ordered_qty} </option> ))} 
```

#### ACT-App-tsx-14334-1

Owner `QuickAddStock`; [src/App.tsx:14334](../src/App.tsx); tag `button`.

Visibility: !addingNew

```tsx
type="button" data-dialog-initial-focus className="link-action" onClick={() => setAddingNew(true)}
```

Label/content expression:

```tsx
Add new SKU 
```

#### ACT-App-tsx-14342-1

Owner `QuickAddStock`; [src/App.tsx:14342](../src/App.tsx); tag `button`.

Visibility: !addingNew

```tsx
className="primary-action" disabled={ !selectedId \|\| (purchaseOrderId > 0 && !purchaseOrderLineId) }
```

Label/content expression:

```tsx
Record Inward 
```

#### ACT-App-tsx-14357-1

Owner `QuickAddStock`; [src/App.tsx:14357](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="New SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14368-1

Owner `QuickAddStock`; [src/App.tsx:14368](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="New material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14379-1

Owner `QuickAddStock`; [src/App.tsx:14379](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="New SKU category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14390-1

Owner `QuickAddStock`; [src/App.tsx:14390](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="New SKU unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14401-1

Owner `QuickAddStock`; [src/App.tsx:14401](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="New SKU low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14418-1

Owner `QuickAddStock`; [src/App.tsx:14418](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="New SKU selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14435-1

Owner `QuickAddStock`; [src/App.tsx:14435](../src/App.tsx); tag `input`.

Visibility: !addingNew

```tsx
aria-label="Initial inward quantity" type="number" min="0" step="0.01" required value={inwardQty} onChange={(event) => setInwardQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14447-1

Owner `QuickAddStock`; [src/App.tsx:14447](../src/App.tsx); tag `button`.

Visibility: !addingNew

```tsx
type="button" className="link-action" onClick={() => setAddingNew(false)}
```

Label/content expression:

```tsx
Choose existing SKU 
```

#### ACT-App-tsx-14454-1

Owner `QuickAddStock`; [src/App.tsx:14454](../src/App.tsx); tag `button`.

Visibility: !addingNew

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Create SKU &amp; Record Inward 
```

#### STATE-App-tsx-14461-1

Owner `QuickAddStock`; [src/App.tsx:14461](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-14497-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14497](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Edit stock details" subtitle={`${item.sku} · ${item.stock_qty} ${item.unit} on hand`} onClose={onClose} footer={ <> <button type="button" className="danger-action" onClick={archive}> {confirmingArchive ? "Confirm archive" : "Archive"} </button> <button className="primary-action" type="submit" form="edit-stock-details" > Save changes </button> </> }
```

Label/content expression:

```tsx
 <form id="edit-stock-details" className="stock-edit-form" onSubmit={save}> <p className="muted"> Stock quantity is changed only by an inward or stock movement. </p> <div className="form-grid"> <label> SKU <input data-dialog-initial-focus aria-label="Edit SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Material name <input aria-label="Edit material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Category <input aria-label="Edit category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Unit <input aria-label="Edit unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Low-stock threshold <input aria-label="Edit low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) } /> </label> <label> Default selling price (₹) <input aria-label="Edit selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) } /> </label> </div> {confirmingArchive && ( <p className="error-text" role="alert"> Archive this SKU? It will no longer be available for new material requests. </p> )} </form> 
```

#### ACT-App-tsx-14503-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14503](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="danger-action" onClick={archive}
```

Label/content expression:

```tsx
 {confirmingArchive ? "Confirm archive" : "Archive"} 
```

#### ACT-App-tsx-14506-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14506](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="edit-stock-details"
```

Label/content expression:

```tsx
Save changes 
```

#### FORM-App-tsx-14516-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14516](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="edit-stock-details" className="stock-edit-form" onSubmit={save}
```

Label/content expression:

```tsx
 <p className="muted"> Stock quantity is changed only by an inward or stock movement. </p> <div className="form-grid"> <label> SKU <input data-dialog-initial-focus aria-label="Edit SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Material name <input aria-label="Edit material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Category <input aria-label="Edit category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Unit <input aria-label="Edit unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Low-stock threshold <input aria-label="Edit low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) } /> </label> <label> Default selling price (₹) <input aria-label="Edit selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) } /> </label> </div> {confirmingArchive && ( <p className="error-text" role="alert"> Archive this SKU? It will no longer be available for new material requests. </p> )} 
```

#### ACT-App-tsx-14523-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14523](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus aria-label="Edit SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14535-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14535](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Edit material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14546-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14546](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Edit category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14557-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14557](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Edit unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14568-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14568](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Edit low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14585-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14585](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Edit selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-14602-1

Owner `EditStockDetailsDialog`; [src/App.tsx:14602](../src/App.tsx); tag `p`.

Visibility: confirmingArchive

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
Archive this SKU? It will no longer be available for new material requests. 
```

#### FORM-App-tsx-14637-1

Owner `InventoryEditor`; [src/App.tsx:14637](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={embedded ? "" : "desk-panel"} onSubmit={(event) => { event.preventDefault(); mutate((db) => draft.id ? updateInventoryItem(db, draft.id, draft) : createInventoryItem(db, draft), ); }}
```

Label/content expression:

```tsx
 {!embedded && ( <PanelTitle icon={<Boxes />} title="Stock Form" subtitle="Master, stock-in and adjustment" /> )} <select value={draft.id} onChange={(event) => setDraft( state.inventory.find( (item) => item.id === Number(event.target.value), ) ?? emptyInventoryItem(), ) } > <option value={0}>New item</option> {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.sku} </option> ))} </select> <div className="form-grid"> <label> SKU <input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Category <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Name <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Unit <input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Stock <input type="number" value={draft.stock_qty} onChange={(event) => setDraft({ ...draft, stock_qty: Number(event.target.value) }) } /> </label> <label> Low Stock <input type="number" value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value) }) } /> </label> <label> Selling Price <input type="number" min="0" step="0.01" value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value) }) } /> </label> </div> <label> Movement Qty <input type="number" value={movementQty} onChange={(event) => setMovementQty(Number(event.target.value))} /> </label> <div className="action-row"> <button className="primary-action">Save Item</button> {draft.id > 0 && ( <button type="button" onClick={() => mutate((db) => stockIn(db, draft.id, movementQty, "Manual stock-in"), ) } > Stock In </button> )} {draft.id > 0 && ( <button type="button" onClick={() => mutate((db) => adjustStock(db, draft.id, movementQty, "Manual adjustment"), ) } > Set Stock </button> )} {draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveInventoryItem(db, draft.id, "Archived inventory item"), ) } > Archive </button> )} </div> {draft.id > 0 && ( <section className="local-purchase-records" aria-label="Item purchase history" > <h4>Item purchase history</h4> {purchaseHistory.length === 0 ? ( <p className="empty-state"> No inward purchase receipts for this item. </p> ) : ( <ul className="material-rows"> {purchaseHistory.map(({ line, purchase }) => ( <li key={line.id} className="material-row"> <div className="material-row-main"> <strong> {purchase.invoice_date} ·{" "} {state.suppliers.find( (supplier) => supplier.id === purchase.supplier_id, )?.name ?? "Archived supplier"} </strong> <span> {line.received_qty} {draft.unit} · {money(line.unit_cost)}{" "} pre-GST · GST {line.gst_rate}% </span> <small> Invoice {purchase.supplier_invoice_no} ·{" "} {purchase.po_number ? `PO ${purchase.po_number} · ` : ""} {purchase.status} </small> </div> </li> ))} </ul> )} </section> )} 
```

#### ACT-App-tsx-14655-1

Owner `InventoryEditor`; [src/App.tsx:14655](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.id} onChange={(event) => setDraft( state.inventory.find( (item) => item.id === Number(event.target.value), ) ?? emptyInventoryItem(), ) }
```

Label/content expression:

```tsx
 <option value={0}>New item</option> {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.sku} </option> ))} 
```

#### ACT-App-tsx-14675-1

Owner `InventoryEditor`; [src/App.tsx:14675](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14684-1

Owner `InventoryEditor`; [src/App.tsx:14684](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14693-1

Owner `InventoryEditor`; [src/App.tsx:14693](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14702-1

Owner `InventoryEditor`; [src/App.tsx:14702](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14711-1

Owner `InventoryEditor`; [src/App.tsx:14711](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={draft.stock_qty} onChange={(event) => setDraft({ ...draft, stock_qty: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14721-1

Owner `InventoryEditor`; [src/App.tsx:14721](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14731-1

Owner `InventoryEditor`; [src/App.tsx:14731](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" min="0" step="0.01" value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14744-1

Owner `InventoryEditor`; [src/App.tsx:14744](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={movementQty} onChange={(event) => setMovementQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14751-1

Owner `InventoryEditor`; [src/App.tsx:14751](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Item
```

#### ACT-App-tsx-14753-1

Owner `InventoryEditor`; [src/App.tsx:14753](../src/App.tsx); tag `button`.

Visibility: draft.id > 0

```tsx
type="button" onClick={() => mutate((db) => stockIn(db, draft.id, movementQty, "Manual stock-in"), ) }
```

Label/content expression:

```tsx
Stock In 
```

#### ACT-App-tsx-14765-1

Owner `InventoryEditor`; [src/App.tsx:14765](../src/App.tsx); tag `button`.

Visibility: draft.id > 0

```tsx
type="button" onClick={() => mutate((db) => adjustStock(db, draft.id, movementQty, "Manual adjustment"), ) }
```

Label/content expression:

```tsx
Set Stock 
```

#### ACT-App-tsx-14777-1

Owner `InventoryEditor`; [src/App.tsx:14777](../src/App.tsx); tag `button`.

Visibility: draft.id > 0

```tsx
type="button" className="danger-action" onClick={() => mutate((db) => archiveInventoryItem(db, draft.id, "Archived inventory item"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### FORM-App-tsx-14848-1

Owner `TaskCreator`; [src/App.tsx:14848](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => createTask(db, { job_card_id: view.job.id, technician_id: technicianId, title, status: "Pending", notes, }), ) ) { setTitle(""); setNotes(""); onCreated?.(); } }}
```

Label/content expression:

```tsx
 <label> New Task <input value={title} onChange={(event) => setTitle(event.target.value)} /> </label> <label> Notes <input value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <button>Add Task</button> 
```

#### ACT-App-tsx-14870-1

Owner `TaskCreator`; [src/App.tsx:14870](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={title} onChange={(event) => setTitle(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14877-1

Owner `TaskCreator`; [src/App.tsx:14877](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={notes} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14882-1

Owner `TaskCreator`; [src/App.tsx:14882](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
Add Task
```

#### ACT-App-tsx-14904-1

Owner `QcEditor`; [src/App.tsx:14904](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
```

Label/content expression:

```tsx
Pass 
```

#### ACT-App-tsx-14909-1

Owner `QcEditor`; [src/App.tsx:14909](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => failQcWithRework(db, check.id, technicianId, reason), ) }
```

Label/content expression:

```tsx
Fail + Rework 
```

#### ACT-App-tsx-14923-1

Owner `QcEditor`; [src/App.tsx:14923](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={reason} onChange={(event) => setReason(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-14929-1

Owner `QcEditor`; [src/App.tsx:14929](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => markWashingNeeded(db, view.job.id))}
```

Label/content expression:

```tsx
Washing Needed 
```

#### ACT-App-tsx-14934-1

Owner `QcEditor`; [src/App.tsx:14934](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => passQc(db, view.job.id))}
```

Label/content expression:

```tsx
Pass All QC 
```

#### ACT-App-tsx-14970-1

Owner `ReadyToInvoiceDraft`; [src/App.tsx:14970](../src/App.tsx); tag `button`.

Visibility: canCreate

```tsx
type="button" className="primary-action" onClick={onCreate}
```

Label/content expression:

```tsx
Create Invoice 
```

#### STATE-App-tsx-14982-1

Owner `ReadyToInvoiceDraft`; [src/App.tsx:14982](../src/App.tsx); tag `p`.

Visibility: warning

```tsx
className="permission-note" role="status"
```

Label/content expression:

```tsx
 {warning} 
```

#### ACT-App-tsx-15114-1

Owner `DataFlowWorkspace`; [src/App.tsx:15114](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Visit month" value={month} onChange={(event) => { setMonth(event.target.value); setDate(""); setQuery(""); setSelectedId(undefined); setOpen(false); }}
```

Label/content expression:

```tsx
 <option value="">All months</option> {months.map((value) => ( <option key={value} value={value}> {new Date(`${value}-01T00:00:00`).toLocaleDateString( "en-IN", { month: "long", year: "numeric" }, )} </option> ))} 
```

#### ACT-App-tsx-15138-1

Owner `DataFlowWorkspace`; [src/App.tsx:15138](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Visit date" value={date} onChange={(event) => { const next = event.target.value; setDate(next); if (next) setMonth(next.slice(0, 7)); setQuery(""); setSelectedId(undefined); setOpen(false); }}
```

Label/content expression:

```tsx
 <option value="">All dates</option> {dates.map((value) => ( <option key={value} value={value}> {new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", })} </option> ))} 
```

#### ACT-App-tsx-15164-1

Owner `DataFlowWorkspace`; [src/App.tsx:15164](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="data-flow-job-search" type="search" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="data-flow-job-options" aria-activedescendant={ open && options[activeIndex] ? `data-flow-job-${options[activeIndex].job.id}` : undefined } autoComplete="off" value={query} placeholder="Job, vehicle, customer or mobile" onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setSelectedId(undefined); setOpen(true); setActiveIndex(-1); }} onKeyDown={onKeyDown}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15197-1

Owner `DataFlowWorkspace`; [src/App.tsx:15197](../src/App.tsx); tag `button`.

Visibility: options.length; open

```tsx
id={`data-flow-job-${view.job.id}`} type="button" role="option" aria-selected={selectedId === view.job.id} className={index === activeIndex ? "highlighted" : ""} key={view.job.id} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(view)}
```

Label/content expression:

```tsx
 <strong>{view.job.job_no}</strong> <span> {view.vehicle.number} · {view.customer.name} </span> 
```

#### STATE-App-tsx-15215-1

Owner `DataFlowWorkspace`; [src/App.tsx:15215](../src/App.tsx); tag `p`.

Visibility: options.length; open

```tsx
className="data-flow-no-matches" role="status"
```

Label/content expression:

```tsx
No matching jobs 
```

#### ACT-App-tsx-15222-1

Owner `DataFlowWorkspace`; [src/App.tsx:15222](../src/App.tsx); tag `FilterClearButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={clear}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15308-1

Owner `DocumentDownloadButton`; [src/App.tsx:15308](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={className} disabled={status === "preparing"} aria-busy={status === "preparing"} onClick={download}
```

Label/content expression:

```tsx
 <Download size={15} /> {status === "preparing" ? "Preparing…" : status === "done" ? "Downloaded ✓" : (label ?? "Download PDF")} 
```

#### ACT-App-tsx-15323-1

Owner `DocumentDownloadButton`; [src/App.tsx:15323](../src/App.tsx); tag `button`.

Visibility: showPrint

```tsx
type="button" className="workflow-action action-secondary document-print" onClick={print}
```

Label/content expression:

```tsx
 <Printer size={15} /> Print 
```

#### STATE-App-tsx-15333-1

Owner `DocumentDownloadButton`; [src/App.tsx:15333](../src/App.tsx); tag `span`.

Visibility: status === "error"

```tsx
className="document-error" role="alert"
```

Label/content expression:

```tsx
 {errorMessage} 
```

#### ACT-App-tsx-15362-1

Owner `DataFlowLine`; [src/App.tsx:15362](../src/App.tsx); tag `DocumentDownloadButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
kind={event.document.kind} view={view} snapshotId={snap?.id} label="PDF" showPrint={false} className="workflow-action action-document document-download data-flow-document-action"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15409-1

Owner `DataFlowLine`; [src/App.tsx:15409](../src/App.tsx); tag `DocumentDownloadButton`.

Visibility: row.document && row.done

```tsx
kind={row.document} view={view} className="workflow-action action-document document-download data-flow-document-action"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15538-1

Owner `JobDocuments`; [src/App.tsx:15538](../src/App.tsx); tag `button`.

Visibility: actions.includes("create-estimate"); documents.length

```tsx
type="button" className="workflow-action action-primary" onClick={() => setEditor("estimate")}
```

Label/content expression:

```tsx
 <Plus size={15} /> Create Estimate 
```

#### ACT-App-tsx-15548-1

Owner `JobDocuments`; [src/App.tsx:15548](../src/App.tsx); tag `button`.

Visibility: actions.includes("edit-estimate"); documents.length

```tsx
type="button" className="workflow-action action-secondary" onClick={() => setEditor("estimate")}
```

Label/content expression:

```tsx
 <Pencil size={15} /> Edit 
```

#### ACT-App-tsx-15558-1

Owner `JobDocuments`; [src/App.tsx:15558](../src/App.tsx); tag `button`.

Visibility: actions.includes("approve-estimate"); documents.length

```tsx
type="button" className="workflow-action action-primary" onClick={() => setEditor("approve-estimate")}
```

Label/content expression:

```tsx
 <Check size={15} /> Approve Estimate 
```

#### ACT-App-tsx-15568-1

Owner `JobDocuments`; [src/App.tsx:15568](../src/App.tsx); tag `button`.

Visibility: actions.includes("create-invoice"); documents.length

```tsx
type="button" className="workflow-action action-primary" onClick={() => setEditor("invoice")}
```

Label/content expression:

```tsx
 <Plus size={15} /> Create Invoice 
```

#### ACT-App-tsx-15578-1

Owner `JobDocuments`; [src/App.tsx:15578](../src/App.tsx); tag `button`.

Visibility: actions.includes("edit-invoice"); documents.length

```tsx
type="button" className="workflow-action action-secondary" onClick={() => setEditor("invoice")}
```

Label/content expression:

```tsx
 <Pencil size={15} /> Edit 
```

#### ACT-App-tsx-15588-1

Owner `JobDocuments`; [src/App.tsx:15588](../src/App.tsx); tag `DocumentDownloadButton`.

Visibility: actions.includes("download"); documents.length

```tsx
kind={document.kind} view={view} snapshotId={document.snapshotId} className="workflow-action action-document document-download"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15606-1

Owner `JobDocuments`; [src/App.tsx:15606](../src/App.tsx); tag `EstimateDialog`.

Visibility: editor === "estimate"

```tsx
view={view} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15614-1

Owner `JobDocuments`; [src/App.tsx:15614](../src/App.tsx); tag `ApproveEstimateDialog`.

Visibility: editor === "approve-estimate"

```tsx
view={view} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15622-1

Owner `JobDocuments`; [src/App.tsx:15622](../src/App.tsx); tag `InvoiceDialog`.

Visibility: editor === "invoice"

```tsx
fixedJob action={view.invoice ? "edit" : "create"} view={view} actor={actor} mutate={mutate} onClose={() => setEditor(undefined)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-15756-1

Owner `AddJobCardDialog`; [src/App.tsx:15756](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title="Add Job Card" subtitle="Check in a vehicle with its ODO and fuel or battery level" onClose={onClose} footer={ <button form="add-job-card-form" className="primary-action"> Create Job Card </button> }
```

Label/content expression:

```tsx
 <form id="add-job-card-form" onSubmit={submit}> <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Customer" options={state.customers.map((item) => ({ value: item.id, label: `${item.name} / ${item.mobile}`, }))} value={customerId \|\| undefined} onChange={(value) => { setCustomerId(Number(value)); setVehicleId(0); }} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > + Add new customer </button> </div> <div className="field-with-action"> <SearchSelect label="Vehicle" options={vehicleOptions.map((item) => ({ value: item.id, label: `${item.number} / ${item.make} ${item.model}`, }))} value={vehicleId \|\| undefined} onChange={(value) => setVehicleId(Number(value))} placeholder="Search registration or model" /> <button type="button" className="link-action" onClick={() => setQuickAdd("vehicle")} > + Add new vehicle </button> </div> <label> Service advisor <select value={advisorId} disabled={actor.role === "service"} onChange={(event) => setAdvisorId(Number(event.target.value))} > {advisors.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} </select> </label> <label> ODO Meter Reading (km) <input required min="0" type="number" inputMode="numeric" placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`} value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel/Battery Level <div className="field-pair"> <input required placeholder="Value" value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select aria-label="Fuel or battery unit" value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> </div> <label> Requested work <input required value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> {error && ( <p role="alert" className="form-error"> {error} </p> )} </form> {quickAdd === "customer" && ( <Dialog title="Add Customer" onClose={() => setQuickAdd(undefined)}> <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setAwaiting("customer"); setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> </Dialog> )} {quickAdd === "vehicle" && ( <Dialog title="Add Vehicle" onClose={() => setQuickAdd(undefined)}> <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: customerId \|\| state.customers[0]?.id \|\| 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => { setAwaiting("vehicle"); setQuickAdd(undefined); }} /> </Dialog> )} 
```

#### ACT-App-tsx-15762-1

Owner `AddJobCardDialog`; [src/App.tsx:15762](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
form="add-job-card-form" className="primary-action"
```

Label/content expression:

```tsx
Create Job Card 
```

#### FORM-App-tsx-15767-1

Owner `AddJobCardDialog`; [src/App.tsx:15767](../src/App.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="add-job-card-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Customer" options={state.customers.map((item) => ({ value: item.id, label: `${item.name} / ${item.mobile}`, }))} value={customerId \|\| undefined} onChange={(value) => { setCustomerId(Number(value)); setVehicleId(0); }} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > + Add new customer </button> </div> <div className="field-with-action"> <SearchSelect label="Vehicle" options={vehicleOptions.map((item) => ({ value: item.id, label: `${item.number} / ${item.make} ${item.model}`, }))} value={vehicleId \|\| undefined} onChange={(value) => setVehicleId(Number(value))} placeholder="Search registration or model" /> <button type="button" className="link-action" onClick={() => setQuickAdd("vehicle")} > + Add new vehicle </button> </div> <label> Service advisor <select value={advisorId} disabled={actor.role === "service"} onChange={(event) => setAdvisorId(Number(event.target.value))} > {advisors.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} </select> </label> <label> ODO Meter Reading (km) <input required min="0" type="number" inputMode="numeric" placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`} value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel/Battery Level <div className="field-pair"> <input required placeholder="Value" value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select aria-label="Fuel or battery unit" value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> </div> <label> Requested work <input required value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> {error && ( <p role="alert" className="form-error"> {error} </p> )} 
```

#### ACT-App-tsx-15770-1

Owner `AddJobCardDialog`; [src/App.tsx:15770](../src/App.tsx); tag `SearchSelect`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Customer" options={state.customers.map((item) => ({ value: item.id, label: `${item.name} / ${item.mobile}`, }))} value={customerId \|\| undefined} onChange={(value) => { setCustomerId(Number(value)); setVehicleId(0); }} placeholder="Search customer or mobile"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15783-1

Owner `AddJobCardDialog`; [src/App.tsx:15783](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="link-action" onClick={() => setQuickAdd("customer")}
```

Label/content expression:

```tsx
+ Add new customer 
```

#### ACT-App-tsx-15792-1

Owner `AddJobCardDialog`; [src/App.tsx:15792](../src/App.tsx); tag `SearchSelect`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Vehicle" options={vehicleOptions.map((item) => ({ value: item.id, label: `${item.number} / ${item.make} ${item.model}`, }))} value={vehicleId \|\| undefined} onChange={(value) => setVehicleId(Number(value))} placeholder="Search registration or model"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15802-1

Owner `AddJobCardDialog`; [src/App.tsx:15802](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="link-action" onClick={() => setQuickAdd("vehicle")}
```

Label/content expression:

```tsx
+ Add new vehicle 
```

#### ACT-App-tsx-15812-1

Owner `AddJobCardDialog`; [src/App.tsx:15812](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={advisorId} disabled={actor.role === "service"} onChange={(event) => setAdvisorId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {advisors.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 
```

#### ACT-App-tsx-15826-1

Owner `AddJobCardDialog`; [src/App.tsx:15826](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required min="0" type="number" inputMode="numeric" placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`} value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15841-1

Owner `AddJobCardDialog`; [src/App.tsx:15841](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required placeholder="Value" value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15849-1

Owner `AddJobCardDialog`; [src/App.tsx:15849](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Fuel or battery unit" value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) }
```

Label/content expression:

```tsx
 <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> 
```

#### ACT-App-tsx-15869-1

Owner `AddJobCardDialog`; [src/App.tsx:15869](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15878-1

Owner `AddJobCardDialog`; [src/App.tsx:15878](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15888-1

Owner `AddJobCardDialog`; [src/App.tsx:15888](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) }
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-15897-1

Owner `AddJobCardDialog`; [src/App.tsx:15897](../src/App.tsx); tag `p`.

Visibility: error

```tsx
role="alert" className="form-error"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-15903-1

Owner `AddJobCardDialog`; [src/App.tsx:15903](../src/App.tsx); tag `Dialog`.

Visibility: quickAdd === "customer"

```tsx
title="Add Customer" onClose={() => setQuickAdd(undefined)}
```

Label/content expression:

```tsx
 <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setAwaiting("customer"); setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> 
```

#### ACT-App-tsx-15904-1

Owner `AddJobCardDialog`; [src/App.tsx:15904](../src/App.tsx); tag `CustomerEditor`.

Visibility: quickAdd === "customer"

```tsx
embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setAwaiting("customer"); setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-15923-1

Owner `AddJobCardDialog`; [src/App.tsx:15923](../src/App.tsx); tag `Dialog`.

Visibility: quickAdd === "vehicle"

```tsx
title="Add Vehicle" onClose={() => setQuickAdd(undefined)}
```

Label/content expression:

```tsx
 <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: customerId \|\| state.customers[0]?.id \|\| 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => { setAwaiting("vehicle"); setQuickAdd(undefined); }} /> 
```

#### ACT-App-tsx-15924-1

Owner `AddJobCardDialog`; [src/App.tsx:15924](../src/App.tsx); tag `VehicleMasterPanel`.

Visibility: quickAdd === "vehicle"

```tsx
embedded state={state} value={{ id: 0, customer_id: customerId \|\| state.customers[0]?.id \|\| 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => { setAwaiting("vehicle"); setQuickAdd(undefined); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15977-1

Owner `JobBodyMarkPanel`; [src/App.tsx:15977](../src/App.tsx); tag `BodyMarkDiagram`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
marks={marks} onChange={ editable ? (next) => { setMarks(next); setSaved(false); } : undefined } meta={{ jobNo: view.job.job_no, vehicleName: `${view.vehicle.make} ${view.vehicle.model}`.trim(), color: view.vehicle.color, regNo: view.vehicle.number, recordedAt: view.job.damage_marks_recorded_at, }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-15997-1

Owner `JobBodyMarkPanel`; [src/App.tsx:15997](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
type="button" className="primary-action" disabled={saved} onClick={save}
```

Label/content expression:

```tsx
 {saved ? "Marks saved" : "Save Body Marks"} 
```

#### STATE-App-tsx-16008-1

Owner `JobBodyMarkPanel`; [src/App.tsx:16008](../src/App.tsx); tag `p`.

Visibility: error

```tsx
role="alert" className="form-error"
```

Label/content expression:

```tsx
 {error} 
```

#### STATE-App-tsx-16051-1

Owner `JobRecordDialog`; [src/App.tsx:16051](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide className="dialog-job" title={`Archived Job ${view.job.job_no}`} subtitle={`${view.vehicle.number} · ${view.customer.name}`} onClose={onClose}
```

Label/content expression:

```tsx
 <div className="record-view"> <p className="permission-note">Read-only historical record.</p> <Info label="Archived on" value={view.job.archived_at ?? "—"} /> <Info label="Archive reason" value={view.job.archived_reason ?? "—"} /> <JobSnapshot view={view} /> <Info label="Requested work" value={view.visit.requested_work} /> <Info label="Advisor" value={view.advisor.name} /> <Info label="Technician" value={view.technician.name} /> </div> 
```

#### STATE-App-tsx-16073-1

Owner `JobRecordDialog`; [src/App.tsx:16073](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide className="dialog-job" title={`${mode === "view" ? "View" : "Edit"} Job ${view.job.job_no}`} subtitle={`${view.vehicle.number} · ${view.customer.name}`} onClose={onClose}
```

Label/content expression:

```tsx
 {mode === "edit" && ( <JobLifecyclePanel view={view} users={state.users} actor={actor} mutate={mutate} visible /> )} <div className="sub-tabs" role="tablist" aria-label="Job record sections" onKeyDown={handleTabListKeyDown} > {JOB_CARD_TABS.map((item) => ( <button id={`job-record-tab-${view.job.id}-${item.key}`} aria-controls={`job-record-${view.job.id}-${item.key}`} tabIndex={tab === item.key ? 0 : -1} key={item.key} role="tab" aria-selected={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)} > {item.label} </button> ))} </div> <div id={panelId} role="tabpanel" aria-labelledby={`job-record-tab-${view.job.id}-${tab}`} > {tab === "task-list" ? ( <JobTaskListPanel view={view} catalog={state.service_catalog} actor={actor} mutate={mutate} /> ) : tab === "documents" ? ( <section className="editor-block job-card-documents" aria-label="Current job documents" > <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> ) : tab === "bodymark" ? ( <JobBodyMarkPanel view={view} actor={actor} mutate={mutate} editable={mode === "edit"} /> ) : tab === "media" ? ( <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} /> ) : tab === "materials" ? ( <JobMaterialsPanel view={view} inventory={state.inventory} actor={actor} mutate={mutate} /> ) : tab === "payment" ? ( <JobPaymentPanel view={view} actor={actor} mutate={mutate} /> ) : tab === "invoice" ? ( <JobInvoicePanel view={view} actor={actor} mutate={mutate} onOpen={() => setDocumentEditor("invoice")} onEstimate={() => setDocumentEditor("approve-estimate")} /> ) : isStubTab(tab) ? ( <p className="empty-state job-card-stub"> {JOB_CARD_TABS.find((item) => item.key === tab)?.label} is coming soon. </p> ) : mode === "edit" ? ( <> <JobEditor embedded key={view.job.updated_at} view={view} users={state.users} mutate={mutate} actor={actor} saved={saved} onSaveResult={onSaveResult} /> <JobSheetSection key={`sheet-${view.job.updated_at}`} view={view} actor={actor} mutate={mutate} editable /> {onAdminArchive && ( <div className="admin-archive-action"> <button type="button" className="danger-action" onClick={archive} > Archive Job </button> </div> )} </> ) : ( <div className="record-view"> <JobSnapshot view={view} /> <Info label="Requested work" value={view.visit.requested_work} /> <Info label="Work completed" value={view.job.work_list \|\| "—"} /> <Info label="Advisor" value={view.advisor.name} /> <Info label="Technician" value={view.technician.name} /> <JobSheetSection view={view} actor={actor} mutate={mutate} /> </div> )} {tab === "details" && ( <section className="editor-block job-card-documents job-documents-block" aria-label="Current job documents" > <h4>Current Documents</h4> <p className="muted">Only active records are available</p> <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> )} </div> {tab !== "documents" && tab !== "details" && documentEditor === "estimate" && ( <EstimateDialog view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)} /> )} {tab !== "documents" && tab !== "details" && documentEditor === "approve-estimate" && ( <ApproveEstimateDialog view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)} /> )} {tab !== "documents" && tab !== "details" && documentEditor === "invoice" && ( <InvoiceDialog fixedJob action={view.invoice ? "edit" : "create"} view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)} /> )} 
```

#### STATE-App-tsx-16089-1

Owner `JobRecordDialog`; [src/App.tsx:16089](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs" role="tablist" aria-label="Job record sections" onKeyDown={handleTabListKeyDown}
```

Label/content expression:

```tsx
 {JOB_CARD_TABS.map((item) => ( <button id={`job-record-tab-${view.job.id}-${item.key}`} aria-controls={`job-record-${view.job.id}-${item.key}`} tabIndex={tab === item.key ? 0 : -1} key={item.key} role="tab" aria-selected={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)} > {item.label} </button> ))} 
```

#### STATE-App-tsx-16096-1

Owner `JobRecordDialog`; [src/App.tsx:16096](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id={`job-record-tab-${view.job.id}-${item.key}`} aria-controls={`job-record-${view.job.id}-${item.key}`} tabIndex={tab === item.key ? 0 : -1} key={item.key} role="tab" aria-selected={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)}
```

Label/content expression:

```tsx
 {item.label} 
```

#### STATE-App-tsx-16110-1

Owner `JobRecordDialog`; [src/App.tsx:16110](../src/App.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id={panelId} role="tabpanel" aria-labelledby={`job-record-tab-${view.job.id}-${tab}`}
```

Label/content expression:

```tsx
 {tab === "task-list" ? ( <JobTaskListPanel view={view} catalog={state.service_catalog} actor={actor} mutate={mutate} /> ) : tab === "documents" ? ( <section className="editor-block job-card-documents" aria-label="Current job documents" > <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> ) : tab === "bodymark" ? ( <JobBodyMarkPanel view={view} actor={actor} mutate={mutate} editable={mode === "edit"} /> ) : tab === "media" ? ( <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} /> ) : tab === "materials" ? ( <JobMaterialsPanel view={view} inventory={state.inventory} actor={actor} mutate={mutate} /> ) : tab === "payment" ? ( <JobPaymentPanel view={view} actor={actor} mutate={mutate} /> ) : tab === "invoice" ? ( <JobInvoicePanel view={view} actor={actor} mutate={mutate} onOpen={() => setDocumentEditor("invoice")} onEstimate={() => setDocumentEditor("approve-estimate")} /> ) : isStubTab(tab) ? ( <p className="empty-state job-card-stub"> {JOB_CARD_TABS.find((item) => item.key === tab)?.label} is coming soon. </p> ) : mode === "edit" ? ( <> <JobEditor embedded key={view.job.updated_at} view={view} users={state.users} mutate={mutate} actor={actor} saved={saved} onSaveResult={onSaveResult} /> <JobSheetSection key={`sheet-${view.job.updated_at}`} view={view} actor={actor} mutate={mutate} editable /> {onAdminArchive && ( <div className="admin-archive-action"> <button type="button" className="danger-action" onClick={archive} > Archive Job </button> </div> )} </> ) : ( <div className="record-view"> <JobSnapshot view={view} /> <Info label="Requested work" value={view.visit.requested_work} /> <Info label="Work completed" value={view.job.work_list \|\| "—"} /> <Info label="Advisor" value={view.advisor.name} /> <Info label="Technician" value={view.technician.name} /> <JobSheetSection view={view} actor={actor} mutate={mutate} /> </div> )} {tab === "details" && ( <section className="editor-block job-card-documents job-documents-block" aria-label="Current job documents" > <h4>Current Documents</h4> <p className="muted">Only active records are available</p> <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> )} 
```

#### ACT-App-tsx-16154-1

Owner `JobRecordDialog`; [src/App.tsx:16154](../src/App.tsx); tag `JobInvoicePanel`.

Visibility: tab === "invoice"; tab === "payment"; tab === "materials"; tab === "media"; tab === "bodymark"; tab === "documents"; tab === "task-list"

```tsx
view={view} actor={actor} mutate={mutate} onOpen={() => setDocumentEditor("invoice")} onEstimate={() => setDocumentEditor("approve-estimate")}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16168-1

Owner `JobRecordDialog`; [src/App.tsx:16168](../src/App.tsx); tag `JobEditor`.

Visibility: mode === "edit"; isStubTab(tab); tab === "invoice"; tab === "payment"; tab === "materials"; tab === "media"; tab === "bodymark"; tab === "documents"; tab === "task-list"

```tsx
embedded key={view.job.updated_at} view={view} users={state.users} mutate={mutate} actor={actor} saved={saved} onSaveResult={onSaveResult}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16187-1

Owner `JobRecordDialog`; [src/App.tsx:16187](../src/App.tsx); tag `button`.

Visibility: onAdminArchive; mode === "edit"; isStubTab(tab); tab === "invoice"; tab === "payment"; tab === "materials"; tab === "media"; tab === "bodymark"; tab === "documents"; tab === "task-list"

```tsx
type="button" className="danger-action" onClick={archive}
```

Label/content expression:

```tsx
Archive Job 
```

#### ACT-App-tsx-16227-1

Owner `JobRecordDialog`; [src/App.tsx:16227](../src/App.tsx); tag `EstimateDialog`.

Visibility: tab !== "documents" && tab !== "details" && documentEditor === "estimate"

```tsx
view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16237-1

Owner `JobRecordDialog`; [src/App.tsx:16237](../src/App.tsx); tag `ApproveEstimateDialog`.

Visibility: tab !== "documents" && tab !== "details" && documentEditor === "approve-estimate"

```tsx
view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16247-1

Owner `JobRecordDialog`; [src/App.tsx:16247](../src/App.tsx); tag `InvoiceDialog`.

Visibility: tab !== "documents" && tab !== "details" && documentEditor === "invoice"

```tsx
fixedJob action={view.invoice ? "edit" : "create"} view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16292-1

Owner `JobTaskListPanel`; [src/App.tsx:16292](../src/App.tsx); tag `button`.

Visibility: editable && view.estimate?.status !== "Approved"

```tsx
type="button" className="primary-action" onClick={() => run((db) => prefillEstimateFromTaskListForActor(db, view.job.id, actor.id), ) }
```

Label/content expression:

```tsx
Prefill Estimate 
```

#### ACT-App-tsx-16314-1

Owner `JobTaskListPanel`; [src/App.tsx:16314](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label="Search service catalog" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search service"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16324-1

Owner `JobTaskListPanel`; [src/App.tsx:16324](../src/App.tsx); tag `button`.

Visibility: query; editable

```tsx
type="button" className="secondary-action" key={item.id} onClick={() => run((db) => addJobTaskListItemForActor(db, view.job.id, actor.id, { service_catalog_item_id: item.id, }), ) }
```

Label/content expression:

```tsx
Add {item.name} · {money(item.base_rate)} 
```

#### ACT-App-tsx-16343-1

Owner `JobTaskListPanel`; [src/App.tsx:16343](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label="Manual task name" value={manual} onChange={(event) => setManual(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16351-1

Owner `JobTaskListPanel`; [src/App.tsx:16351](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label="Manual task rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16360-1

Owner `JobTaskListPanel`; [src/App.tsx:16360](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
type="button" className="secondary-action" onClick={() => { if ( run((db) => addJobTaskListItemForActor(db, view.job.id, actor.id, { name: manual, base_rate: rate, }), ) ) { setManual(""); setRate(0); } }}
```

Label/content expression:

```tsx
Add manual task 
```

#### STATE-App-tsx-16382-1

Owner `JobTaskListPanel`; [src/App.tsx:16382](../src/App.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-App-tsx-16400-1

Owner `JobTaskListPanel`; [src/App.tsx:16400](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`${item.name} done`} type="checkbox" checked={Boolean(item.done)} disabled={!editable} onChange={(event) => run((db) => updateJobTaskListItemForActor(db, item.id, actor.id, { name: item.name, base_rate: item.base_rate, done: event.target.checked ? 1 : 0, }), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16418-1

Owner `JobTaskListPanel`; [src/App.tsx:16418](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label={`${item.name} name`} value={item.name} onChange={(event) => run((db) => updateJobTaskListItemForActor(db, item.id, actor.id, { name: event.target.value, base_rate: item.base_rate, done: item.done, }), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16437-1

Owner `JobTaskListPanel`; [src/App.tsx:16437](../src/App.tsx); tag `input`.

Visibility: editable

```tsx
aria-label={`${item.name} rate`} type="number" min="0" step="0.01" value={item.base_rate} onChange={(event) => run((db) => updateJobTaskListItemForActor(db, item.id, actor.id, { name: item.name, base_rate: Number(event.target.value), done: item.done, }), ) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16459-1

Owner `JobTaskListPanel`; [src/App.tsx:16459](../src/App.tsx); tag `button`.

Visibility: editable

```tsx
type="button" className="danger-action" onClick={() => run((db) => archiveJobTaskListItemForActor(db, item.id, actor.id), ) }
```

Label/content expression:

```tsx
Remove 
```

#### STATE-App-tsx-16511-1

Owner `CustomerRecordDialog`; [src/App.tsx:16511](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title={`${mode === "view" ? "View" : "Edit"} Customer`} subtitle={`${customer.name} · ${customer.mobile}`} onClose={onClose}
```

Label/content expression:

```tsx
 {mode === "edit" ? ( <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose} /> ) : ( <div className="record-view"> {customer.archived_at && ( <> <p className="permission-note">Read-only archived record.</p> <Info label="Archived on" value={customer.archived_at} /> <Info label="Archive reason" value={customer.archived_reason ?? "—"} /> </> )} <Info label="Customer type" value={customer.type} /> <Info label="Vehicles" value={vehicles.length} /> {vehicles.map((vehicle) => ( <Info key={vehicle.id} label={vehicle.number} value={`${vehicle.make} ${vehicle.model}`} /> ))} <Info label="Jobs" value={jobs.length} /> {jobs.map((view) => ( <Info key={view.job.id} label={view.job.job_no} value={`${view.vehicle.number} · ${view.job.main_status}`} /> ))} </div> )} 
```

#### ACT-App-tsx-16518-1

Owner `CustomerRecordDialog`; [src/App.tsx:16518](../src/App.tsx); tag `CustomerEditor`.

Visibility: mode === "edit"

```tsx
embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-16581-1

Owner `VehicleRecordDialog`; [src/App.tsx:16581](../src/App.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title={`${mode === "view" ? "View" : "Edit"} Vehicle`} subtitle={`${vehicle.number} · ${vehicle.make} ${vehicle.model}`} onClose={onClose}
```

Label/content expression:

```tsx
 {mode === "edit" ? ( <VehicleMasterPanel embedded state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose} /> ) : ( <div className="record-view"> {vehicle.archived_at && ( <> <p className="permission-note">Read-only archived record.</p> <Info label="Archived on" value={vehicle.archived_at} /> <Info label="Archive reason" value={vehicle.archived_reason ?? "—"} /> </> )} <Info label="Registration" value={vehicle.number} /> <Info label="Make / model" value={`${vehicle.make} ${vehicle.model}`} /> <Info label="Color" value={vehicle.color} /> <Info label="Odometer" value={`${vehicle.km.toLocaleString("en-IN")} km`} /> <Info label="Owner" value={owner ? `${owner.name} · ${owner.mobile}` : "—"} /> <Info label="Linked jobs" value={jobs.length} /> {jobs.map((view) => ( <Info key={view.job.id} label={view.job.job_no} value={`${view.job.main_status} · ${view.visit.received_at.slice(0, 10)}`} /> ))} </div> )} 
```

#### ACT-App-tsx-16588-1

Owner `VehicleRecordDialog`; [src/App.tsx:16588](../src/App.tsx); tag `VehicleMasterPanel`.

Visibility: mode === "edit"

```tsx
embedded state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16724-1

Owner `VisitEditor`; [src/App.tsx:16724](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={advisorId} onChange={(event) => setAdvisorId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {advisorId === 0 && <option value={0}>Not mapped</option>} {ordered.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} 
```

#### ACT-App-tsx-16739-1

Owner `VisitEditor`; [src/App.tsx:16739](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" disabled={!advisorId \|\| advisorId === view.job.advisor_id} onClick={() => mutate((db) => assignAdvisor(db, view.job.id, advisorId)) }
```

Label/content expression:

```tsx
 {view.job.advisor_id ? "Update Advisor" : "Assign Advisor"} 
```

#### ACT-App-tsx-16776-1

Owner `DuplicateCustomerEditor`; [src/App.tsx:16776](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16783-1

Owner `DuplicateCustomerEditor`; [src/App.tsx:16783](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16792-1

Owner `DuplicateCustomerEditor`; [src/App.tsx:16792](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16798-1

Owner `DuplicateCustomerEditor`; [src/App.tsx:16798](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={!value.id} onClick={() => mutate((db) => updateCustomer(db, value.id, { name: value.name, mobile: value.mobile, type: value.type, }), ) }
```

Label/content expression:

```tsx
Save Customer 
```

#### ACT-App-tsx-16812-1

Owner `DuplicateCustomerEditor`; [src/App.tsx:16812](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" disabled={!value.id} onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer desk"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-16848-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16848](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.customer_id} onChange={(event) => setValue({ ...value, customer_id: Number(event.target.value) }) }
```

Label/content expression:

```tsx
 {state.customers.map((customer) => ( <option key={customer.id} value={customer.id}> {customer.name} </option> ))} 
```

#### ACT-App-tsx-16863-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16863](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.number} onChange={(event) => setValue({ ...value, number: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16872-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16872](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.make} onChange={(event) => setValue({ ...value, make: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16879-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16879](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.model} onChange={(event) => setValue({ ...value, model: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16888-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16888](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={value.color} onChange={(event) => setValue({ ...value, color: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16897-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16897](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={value.km} onChange={(event) => setValue({ ...value, km: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16906-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16906](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={!value.id} onClick={() => mutate((db) => updateVehicle(db, value.id, { customer_id: value.customer_id, number: value.number, make: value.make, model: value.model, color: value.color, km: value.km, }), ) }
```

Label/content expression:

```tsx
Save Vehicle 
```

#### ACT-App-tsx-16923-1

Owner `DuplicateVehicleMasterPanel`; [src/App.tsx:16923](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" disabled={!value.id} onClick={() => mutate((db) => archiveVehicle(db, value.id, "Archived from vehicle desk"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-16963-1

Owner `DuplicateEstimateEditor`; [src/App.tsx:16963](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" onClick={() => mutate((db) => archiveEstimateItem(db, item.id, "Removed from estimate"), ) }
```

Label/content expression:

```tsx
Archive Item 
```

#### ACT-App-tsx-16977-1

Owner `DuplicateEstimateEditor`; [src/App.tsx:16977](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16986-1

Owner `DuplicateEstimateEditor`; [src/App.tsx:16986](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={draft.qty} onChange={(event) => setDraft({ ...draft, qty: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-16996-1

Owner `DuplicateEstimateEditor`; [src/App.tsx:16996](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={draft.rate} onChange={(event) => setDraft({ ...draft, rate: Number(event.target.value) }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17004-1

Owner `DuplicateEstimateEditor`; [src/App.tsx:17004](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={!estimateId} onClick={() => estimateId && mutate((db) => createEstimateItem(db, { estimate_id: estimateId, ...draft }), ) }
```

Label/content expression:

```tsx
Add Item 
```

#### ACT-App-tsx-17038-1

Owner `DuplicateFollowupEditor`; [src/App.tsx:17038](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => markFollowupDone(db, followup.id, followup.outcome \|\| "Done"), ) }
```

Label/content expression:

```tsx
Done 
```

#### ACT-App-tsx-17047-1

Owner `DuplicateFollowupEditor`; [src/App.tsx:17047](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" onClick={() => mutate((db) => archiveFollowup(db, followup.id, "Removed follow-up"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-17062-1

Owner `DuplicateFollowupEditor`; [src/App.tsx:17062](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={note} onChange={(event) => setNote(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17064-1

Owner `DuplicateFollowupEditor`; [src/App.tsx:17064](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => createFollowup(db, { job_card_id: view.job.id, note, due_at: new Date().toISOString().slice(0, 10), done: 0, outcome: "", }), ) }
```

Label/content expression:

```tsx
Add Follow-up 
```

#### ACT-App-tsx-17118-1

Owner `DuplicateJobEditor`; [src/App.tsx:17118](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={workList} onChange={(event) => setWorkList(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17125-1

Owner `DuplicateJobEditor`; [src/App.tsx:17125](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={advisorId} onChange={(event) => setAdvisorId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {users .filter((item) => item.role === "service") .map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 
```

#### ACT-App-tsx-17140-1

Owner `DuplicateJobEditor`; [src/App.tsx:17140](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={technicianId} onChange={(event) => setTechnicianId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {users .filter((item) => item.role === "tech") .map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 
```

#### ACT-App-tsx-17156-1

Owner `DuplicateJobEditor`; [src/App.tsx:17156](../src/App.tsx); tag `select`.

Visibility: allowStatus

```tsx
value={mainStatus} onChange={(event) => setMainStatus(event.target.value as MainStatus) }
```

Label/content expression:

```tsx
 <option>NEW</option> <option>IN_PROGRESS</option> <option>COMPLETED</option> <option>CLOSED</option> 
```

#### ACT-App-tsx-17172-1

Owner `DuplicateJobEditor`; [src/App.tsx:17172](../src/App.tsx); tag `input`.

Visibility: allowStatus

```tsx
value={subStatus} onChange={(event) => setSubStatus(event.target.value as SubStatus)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17178-1

Owner `DuplicateJobEditor`; [src/App.tsx:17178](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => updateJobCard(db, view.job.id, { advisor_id: advisorId, technician_id: technicianId, main_status: mainStatus, sub_status: subStatus, work_list: workList, }), ) }
```

Label/content expression:

```tsx
Save Job Card 
```

#### ACT-App-tsx-17234-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17234](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={item.id} onChange={(event) => setItem( state.inventory.find( (next) => next.id === Number(event.target.value), ) ?? item, ) }
```

Label/content expression:

```tsx
 {state.inventory.map((next) => ( <option key={next.id} value={next.id}> {next.name} </option> ))} 
```

#### ACT-App-tsx-17253-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17253](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={item.name} onChange={(event) => setItem({ ...item, name: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17260-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17260](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17267-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17267](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => updateInventoryItem(db, item.id, item))}
```

Label/content expression:

```tsx
Save Item 
```

#### ACT-App-tsx-17272-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17272](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => stockIn(db, item.id, qty, "Manual stock-in")) }
```

Label/content expression:

```tsx
Stock In 
```

#### ACT-App-tsx-17279-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17279](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => adjustStock(db, item.id, qty, "Manual adjustment")) }
```

Label/content expression:

```tsx
Adjust 
```

#### ACT-App-tsx-17286-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17286](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => createInventoryItem(db, { sku: `${item.sku}-NEW`, category: item.category, name: item.name, unit: item.unit, stock_qty: qty, low_stock_qty: item.low_stock_qty, selling_price: item.selling_price, }), ) }
```

Label/content expression:

```tsx
Duplicate New 
```

#### ACT-App-tsx-17303-1

Owner `DuplicateInventoryEditor`; [src/App.tsx:17303](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" onClick={() => mutate((db) => archiveInventoryItem(db, item.id, "Archived from stock desk"), ) }
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-17349-1

Owner `DuplicateReconcileEditor`; [src/App.tsx:17349](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={requestId} onChange={(event) => setRequestId(Number(event.target.value))}
```

Label/content expression:

```tsx
 {requests.map(({ request, item }) => ( <option key={request.id} value={request.id}> {item?.name ?? request.id} </option> ))} 
```

#### ACT-App-tsx-17362-1

Owner `DuplicateReconcileEditor`; [src/App.tsx:17362](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={used} onChange={(event) => setUsed(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17370-1

Owner `DuplicateReconcileEditor`; [src/App.tsx:17370](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={returned} onChange={(event) => setReturned(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17378-1

Owner `DuplicateReconcileEditor`; [src/App.tsx:17378](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" value={wasted} onChange={(event) => setWasted(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17384-1

Owner `DuplicateReconcileEditor`; [src/App.tsx:17384](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => reconcileMaterialQty(db, requestId, used, returned, wasted), ) }
```

Label/content expression:

```tsx
Save Reconcile 
```

#### ACT-App-tsx-17413-1

Owner `DuplicateTaskCreator`; [src/App.tsx:17413](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={title} onChange={(event) => setTitle(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17418-1

Owner `DuplicateTaskCreator`; [src/App.tsx:17418](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => createTask(db, { job_card_id: view.job.id, technician_id: techId, title, status: "Pending", notes: "", }), ) }
```

Label/content expression:

```tsx
Add Task 
```

#### ACT-App-tsx-17456-1

Owner `DuplicateQcEditor`; [src/App.tsx:17456](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
```

Label/content expression:

```tsx
Pass 
```

#### ACT-App-tsx-17461-1

Owner `DuplicateQcEditor`; [src/App.tsx:17461](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => updateQcCheck( db, check.id, false, reason \|\| `Rework: ${technicianId}`, ), ) }
```

Label/content expression:

```tsx
Fail 
```

#### ACT-App-tsx-17480-1

Owner `DuplicateQcEditor`; [src/App.tsx:17480](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={reason} onChange={(event) => setReason(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17485-1

Owner `DuplicateQcEditor`; [src/App.tsx:17485](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => mutate((db) => passQc(db, view.job.id))}
```

Label/content expression:

```tsx
Pass All QC 
```

#### ACT-App-tsx-17577-1

Owner `JobCardFilterFields`; [src/App.tsx:17577](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={searchLabel} value={values.search} placeholder="Job, vehicle, customer or mobile" onChange={(event) => onChange({ search: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17578-1

Owner `JobCardFilterFields`; [src/App.tsx:17578](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Main status" value={values.primary} onChange={(event) => onChange({ primary: event.target.value })}
```

Label/content expression:

```tsx
<option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}
```

#### ACT-App-tsx-17579-1

Owner `JobCardFilterFields`; [src/App.tsx:17579](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Workflow status" value={values.secondary} onChange={(event) => onChange({ secondary: event.target.value })}
```

Label/content expression:

```tsx
<option value="ALL">All workflows</option> {workflows.map((value) => <option key={value}>{value}</option>)}
```

#### ACT-App-tsx-17580-1

Owner `JobCardFilterFields`; [src/App.tsx:17580](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Estimated delivery date" type="date" value={values.date} onChange={(event) => onChange({ date: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17581-1

Owner `JobCardFilterFields`; [src/App.tsx:17581](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Estimated delivery month-year" value={values.month} onChange={(event) => onChange({ month: event.target.value })}
```

Label/content expression:

```tsx
<option value="">All months</option> {jobDeliveryMonths(jobs, values.month).map((value) => <option key={value} value={value}>{new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</option>)}
```

#### ACT-App-tsx-17582-1

Owner `JobCardFilterFields`; [src/App.tsx:17582](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Service advisor filter" value={values.advisor} onChange={(event) => onChange({ advisor: event.target.value })}
```

Label/content expression:

```tsx
<option value="ALL">All advisors</option> {advisors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
```

#### ACT-App-tsx-17583-1

Owner `JobCardFilterFields`; [src/App.tsx:17583](../src/App.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Sort results" value={values.sort} onChange={(event) => onChange({ sort: event.target.value })}
```

Label/content expression:

```tsx
<option value="newest">Newest</option> <option value="oldest">Oldest</option> <option value="delivery-soonest">Estimated delivery (soonest)</option> <option value="delivery-latest">Estimated delivery (latest)</option> <option value="amount-high">Amount (high to low)</option> <option value="amount-low">Amount (low to high)</option>
```

#### ACT-App-tsx-17584-1

Owner `JobCardFilterFields`; [src/App.tsx:17584](../src/App.tsx); tag `Switch`.

Visibility: showArchive

```tsx
className="job-card-archive-switch" label="Show archived only" checked={values.archivedOnly} onCheckedChange={(archivedOnly) => onChange({ archivedOnly })}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17585-1

Owner `JobCardFilterFields`; [src/App.tsx:17585](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={onClear}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-17930-1

Owner `EntityList`; [src/App.tsx:17930](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="back-button" onClick={closeRecord}
```

Label/content expression:

```tsx
← Back to {entityTitle(kind)} 
```

#### ACT-App-tsx-18170-1

Owner `EntityList`; [src/App.tsx:18170](../src/App.tsx); tag `JobRecordDialog`.

Visibility: dialogJob

```tsx
view={dialogJob} state={state} mutate={mutate} actor={actor} mode={archivedOnly ? "view" : recordMode} historical={archivedOnly} onClose={closeRecord}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18181-1

Owner `EntityList`; [src/App.tsx:18181](../src/App.tsx); tag `CustomerRecordDialog`.

Visibility: dialogCustomer

```tsx
customer={dialogCustomer} state={state} mutate={mutate} mode={recordMode} onClose={closeRecord}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18190-1

Owner `EntityList`; [src/App.tsx:18190](../src/App.tsx); tag `VehicleRecordDialog`.

Visibility: dialogVehicle

```tsx
vehicle={dialogVehicle} state={state} mutate={mutate} mode={recordMode} onClose={closeRecord}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18210-1

Owner `EntityList`; [src/App.tsx:18210](../src/App.tsx); tag `button`.

Visibility: canCreate

```tsx
className="primary-action" onClick={() => setCreating(true)}
```

Label/content expression:

```tsx
 {createLabel} 
```

#### ACT-App-tsx-18215-1

Owner `EntityList`; [src/App.tsx:18215](../src/App.tsx); tag `button`.

Visibility: canAddJob

```tsx
className="primary-action" onClick={() => setAddingJob(true)}
```

Label/content expression:

```tsx
Add Job Card 
```

#### ACT-App-tsx-18221-1

Owner `EntityList`; [src/App.tsx:18221](../src/App.tsx); tag `AddJobCardDialog`.

Visibility: addingJob

```tsx
state={state} mutate={mutate} actor={actor} onClose={() => setAddingJob(false)}
```

Label/content expression:

```tsx

```

#### STATE-App-tsx-18229-1

Owner `EntityList`; [src/App.tsx:18229](../src/App.tsx); tag `Dialog`.

Visibility: creating

```tsx
title={createLabel} onClose={() => setCreating(false)}
```

Label/content expression:

```tsx
 {kind === "customers" && ( <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} /> )} {kind === "vehicles" && ( <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} /> )} 
```

#### ACT-App-tsx-18261-1

Owner `EntityList`; [src/App.tsx:18261](../src/App.tsx); tag `input`.

Visibility: !hideSearch && kind !== "jobs" && filterLayout !== "search"

```tsx
aria-label={`Search ${title.toLocaleLowerCase()}`} value={effectiveSearch} placeholder={searchPlaceholder(kind)} onChange={(event) => updateSearch(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18269-1

Owner `EntityList`; [src/App.tsx:18269](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="mobile-filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}
```

Label/content expression:

```tsx
 {filtersOpen ? "Hide filters" : "Show filters"} 
```

#### ACT-App-tsx-18282-1

Owner `EntityList`; [src/App.tsx:18282](../src/App.tsx); tag `input`.

Visibility: !hideSearch && kind !== "jobs" && filterLayout === "search"

```tsx
aria-label="Search records" value={effectiveSearch} placeholder={searchPlaceholder(kind)} onChange={(event) => updateSearch(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18291-1

Owner `EntityList`; [src/App.tsx:18291](../src/App.tsx); tag `JobCardFilterFields`.

Visibility: kind === "jobs"

```tsx
jobs={archivedOnly && role === "admin" ? state.archived_jobs : state.jobs} values={{ search: effectiveSearch, primary: filter, secondary: secondaryFilter, date: dateFilter, month: monthFilter, customer: customerFilter, advisor: advisorFilter, sort, archivedOnly }} onChange={(patch) => { if (patch.search !== undefined && onExternalSearchChange) onExternalSearchChange(patch.search); else updateFilters(patch); if (patch.archivedOnly !== undefined) setSelectedId(undefined); }} onClear={clearFilters} showArchive={role === "admin"} variant="admin"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18305-1

Owner `EntityList`; [src/App.tsx:18305](../src/App.tsx); tag `Switch`.

Visibility: role === "admin" && kind !== "jobs"

```tsx
label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { updateFilters({ archivedOnly: checked }); setSelectedId(undefined); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18318-1

Owner `EntityList`; [src/App.tsx:18318](../src/App.tsx); tag `select`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Main status" value={filters.primary} onChange={(event) => updateFilters({ primary: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> {[ "NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED", ].map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-18339-1

Owner `EntityList`; [src/App.tsx:18339](../src/App.tsx); tag `select`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Workflow status" value={filters.secondary} onChange={(event) => updateFilters({ secondary: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All workflows</option> {Array.from( new Set(state.jobs.map((item) => item.job.sub_status)), ).map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-18356-1

Owner `EntityList`; [src/App.tsx:18356](../src/App.tsx); tag `input`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Estimated delivery date" type="date" value={filters.date} onChange={(event) => updateFilters({ date: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18367-1

Owner `EntityList`; [src/App.tsx:18367](../src/App.tsx); tag `input`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Estimated delivery month" type="month" value={filters.month} onChange={(event) => updateFilters({ month: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18378-1

Owner `EntityList`; [src/App.tsx:18378](../src/App.tsx); tag `select`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Customer filter" value={filters.customer} onChange={(event) => updateFilters({ customer: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All customers</option> {jobCustomerOptions.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 
```

#### ACT-App-tsx-18395-1

Owner `EntityList`; [src/App.tsx:18395](../src/App.tsx); tag `select`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Vehicle filter" value={filters.vehicle} onChange={(event) => updateFilters({ vehicle: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All vehicles</option> {jobVehicleOptions.map((item) => ( <option key={item.id} value={item.id}> {item.number} </option> ))} 
```

#### ACT-App-tsx-18412-1

Owner `EntityList`; [src/App.tsx:18412](../src/App.tsx); tag `select`.

Visibility: false && kind === "jobs"

```tsx
aria-label="Service advisor filter" value={filters.advisor} onChange={(event) => updateFilters({ advisor: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All advisors</option> {jobAdvisorOptions.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 
```

#### ACT-App-tsx-18433-1

Owner `EntityList`; [src/App.tsx:18433](../src/App.tsx); tag `select`.

Visibility: kind === "customers"

```tsx
aria-label="Customer type" value={filters.primary} onChange={(event) => updateFilters({ primary: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All types</option> {customerTypes.map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-18448-1

Owner `EntityList`; [src/App.tsx:18448](../src/App.tsx); tag `select`.

Visibility: kind === "customers"

```tsx
aria-label="Customer served month" value={filters.month} onChange={(event) => updateFilters({ month: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="">All months</option> {servedMonths.map((value) => ( <option key={value} value={value}> {value} </option> ))} 
```

#### ACT-App-tsx-18468-1

Owner `EntityList`; [src/App.tsx:18468](../src/App.tsx); tag `select`.

Visibility: kind === "vehicles"

```tsx
aria-label="Vehicle served month" value={filters.month} onChange={(event) => updateFilters({ month: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="">All months</option> {servedMonths.map((value) => ( <option key={value} value={value}> {value} </option> ))} 
```

#### ACT-App-tsx-18488-1

Owner `EntityList`; [src/App.tsx:18488](../src/App.tsx); tag `select`.

Visibility: kind === "media"

```tsx
aria-label="Job card filter" value={filters.primary} onChange={(event) => updateFilters({ primary: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All job cards</option> {mediaJobs.map((item) => ( <option value={item.job.id} key={item.job.id}> {item.job.job_no} </option> ))} 
```

#### ACT-App-tsx-18505-1

Owner `EntityList`; [src/App.tsx:18505](../src/App.tsx); tag `select`.

Visibility: kind === "media"

```tsx
aria-label="Media category" value={filters.secondary} onChange={(event) => updateFilters({ secondary: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="ALL">All categories</option> {categories.map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-18520-1

Owner `EntityList`; [src/App.tsx:18520](../src/App.tsx); tag `input`.

Visibility: kind === "media"

```tsx
aria-label="Media received date" type="date" value={filters.date} onChange={(event) => updateFilters({ date: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18531-1

Owner `EntityList`; [src/App.tsx:18531](../src/App.tsx); tag `select`.

Visibility: kind === "media"

```tsx
aria-label="Media month-year" value={filters.month} onChange={(event) => updateFilters({ month: event.target.value }) }
```

Label/content expression:

```tsx
 <option value="">All months</option> {mediaMonths.map((value) => ( <option key={value} value={value}> {value} </option> ))} 
```

#### ACT-App-tsx-18551-1

Owner `EntityList`; [src/App.tsx:18551](../src/App.tsx); tag `select`.

Visibility: kind !== "media" && kind !== "jobs"

```tsx
aria-label="Sort results" value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value }) }
```

Label/content expression:

```tsx
 <><option value="alphabetical">Alphabetical</option><option value="recent">Recent</option></> 
```

#### ACT-App-tsx-18562-1

Owner `EntityList`; [src/App.tsx:18562](../src/App.tsx); tag `ListSearchActions`.

Visibility: kind !== "jobs"

```tsx
onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18566-1

Owner `EntityList`; [src/App.tsx:18566](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <> <ListExportControls report={{ title, filters: exportFilters, columns: exportColumns, rows: filtered, }} /> <ViewModeToggle value={viewMode} onChange={setViewMode} /> </> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={changePage} pageSize={pageSize} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18577-1

Owner `EntityList`; [src/App.tsx:18577](../src/App.tsx); tag `ViewModeToggle`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={viewMode} onChange={setViewMode}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18596-1

Owner `EntityList`; [src/App.tsx:18596](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={clearFilters} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18611-1

Owner `EntityList`; [src/App.tsx:18611](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={changePage}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18651-1

Owner `ViewModeToggle`; [src/App.tsx:18651](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-pressed={value === "grid"} className={value === "grid" ? "active" : ""} onClick={() => onChange("grid")}
```

Label/content expression:

```tsx
Grid 
```

#### ACT-App-tsx-18658-1

Owner `ViewModeToggle`; [src/App.tsx:18658](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-pressed={value === "table"} className={value === "table" ? "active" : ""} onClick={() => onChange("table")}
```

Label/content expression:

```tsx
Table 
```

#### ACT-App-tsx-18679-1

Owner `ListExportControls`; [src/App.tsx:18679](../src/App.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={report}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18778-1

Owner `EntityResults`; [src/App.tsx:18778](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onView={() => openRecord(row.job.id, "view")} onEdit={ manageable ? () => openRecord(row.job.id, "edit") : undefined } onArchive={manageable ? () => archive(row.job.id) : undefined}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18812-1

Owner `EntityResults`; [src/App.tsx:18812](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onView={() => openRecord(row.id, "view")} onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined} onArchive={canArchive ? () => archive(row.id) : undefined}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18839-1

Owner `EntityResults`; [src/App.tsx:18839](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onView={() => openRecord(row.id, "view")} onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined} onArchive={canArchive ? () => archive(row.id) : undefined}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18858-1

Owner `EntityResults`; [src/App.tsx:18858](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onView={() => openRecord(photo.id)} onArchive={canArchive ? () => archive(photo.id) : undefined}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-18918-1

Owner `RecordActions`; [src/App.tsx:18918](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={actionClass} onClick={(event) => { event.stopPropagation(); onView(); }}
```

Label/content expression:

```tsx
View 
```

#### ACT-App-tsx-18929-1

Owner `RecordActions`; [src/App.tsx:18929](../src/App.tsx); tag `button`.

Visibility: onEdit

```tsx
type="button" className={actionClass} onClick={(event) => { event.stopPropagation(); onEdit(); }}
```

Label/content expression:

```tsx
 {editLabel} 
```

#### ACT-App-tsx-18941-1

Owner `RecordActions`; [src/App.tsx:18941](../src/App.tsx); tag `button`.

Visibility: onArchive

```tsx
type="button" className={ inGrid ? "grid-action grid-action-danger" : "danger-action" } onClick={(event) => { event.stopPropagation(); onArchive(); }}
```

Label/content expression:

```tsx
Archive 
```

#### ACT-App-tsx-19058-1

Owner `EntityTableRow`; [src/App.tsx:19058](../src/App.tsx); tag `RecordActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
inGrid onView={() => openRecord(id, "view")} onEdit={ kind === "jobs" ? canManageJob ? () => openRecord(id, "edit") : undefined : (kind === "customers" \|\| kind === "vehicles") && canArchive ? () => openRecord(id, "edit") : undefined } onArchive={ kind === "jobs" ? canManageJob ? () => archive(id) : undefined : canArchive ? () => archive(id) : undefined }
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19149-1

Owner `JobRows`; [src/App.tsx:19149](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={selectedJobId === view.job.id ? "row active" : "row"} key={view.job.id} onClick={() => onSelect?.(view.job.id)}
```

Label/content expression:

```tsx
 <strong>{view.job.job_no}</strong> <span>{view.vehicle.number}</span> <Status status={view.job.main_status} sub={view.job.sub_status} unmapped={ view.job.advisor_id === 0 && view.job.main_status === "NEW" } /> <DocumentChips view={view} /> 
```

#### ACT-App-tsx-19249-1

Owner `FilterableJobRows`; [src/App.tsx:19249](../src/App.tsx); tag `JobRecordDialog`.

Visibility: selected && dialog && queueActions

```tsx
view={selected} state={queueActions.state} mutate={queueActions.mutate} actor={queueActions.actor} mode={dialog} onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19269-1

Owner `FilterableJobRows`; [src/App.tsx:19269](../src/App.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Search ${title.toLocaleLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, vehicle or customer"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19283-1

Owner `FilterableJobRows`; [src/App.tsx:19283](../src/App.tsx); tag `input`.

Visibility: readyToInvoiceFilters

```tsx
aria-label="Ready To Invoice received date" type="date" value={receivedDate} onChange={(event) => { setReceivedDate(event.target.value); setReceivedMonth(""); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19296-1

Owner `FilterableJobRows`; [src/App.tsx:19296](../src/App.tsx); tag `select`.

Visibility: readyToInvoiceFilters

```tsx
aria-label="Ready To Invoice month-year" value={receivedMonth} onChange={(event) => { setReceivedMonth(event.target.value); setReceivedDate(""); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="">All months</option> {availableReceivedMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} 
```

#### ACT-App-tsx-19320-1

Owner `FilterableJobRows`; [src/App.tsx:19320](../src/App.tsx); tag `select`.

Visibility: showStatusFilter

```tsx
aria-label={`${title} status`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((value) => ( <option key={value}>{value}</option> ))} 
```

#### ACT-App-tsx-19335-1

Owner `FilterableJobRows`; [src/App.tsx:19335](../src/App.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19337-1

Owner `FilterableJobRows`; [src/App.tsx:19337](../src/App.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <ListExportControls report={{ title, filters: activeFilterSummary({ Search: search.trim(), Status: status, "Received date": readyToInvoiceFilters ? receivedDate : "", "Received month": readyToInvoiceFilters ? receivedMonth : "", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${title} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19368-1

Owner `FilterableJobRows`; [src/App.tsx:19368](../src/App.tsx); tag `ReadyToInvoiceRows`.

Visibility: readyToInvoiceFilters; paged.totalCount

```tsx
jobs={paged.items} selectedJobId={selectedJobId} onSelect={onSelect ?? (() => {})}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19401-1

Owner `FilterableJobRows`; [src/App.tsx:19401](../src/App.tsx); tag `button`.

Visibility: queueActions; readyToInvoiceFilters; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => { setSelected(row); setDialog("view"); }}
```

Label/content expression:

```tsx
View 
```

#### ACT-App-tsx-19413-1

Owner `FilterableJobRows`; [src/App.tsx:19413](../src/App.tsx); tag `button`.

Visibility: queueActions.actor.role === "service" && queueActions.actor.id === row.job.advisor_id; queueActions; readyToInvoiceFilters; paged.totalCount

```tsx
type="button" className="grid-action" onClick={() => { setSelected(row); setDialog("edit"); }}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-App-tsx-19432-1

Owner `FilterableJobRows`; [src/App.tsx:19432](../src/App.tsx); tag `JobRows`.

Visibility: queueActions; readyToInvoiceFilters; paged.totalCount

```tsx
jobs={paged.items} selectedJobId={selectedJobId} onSelect={onSelect}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19441-1

Owner `FilterableJobRows`; [src/App.tsx:19441](../src/App.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount

```tsx
onClick={clearFilters} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19444-1

Owner `FilterableJobRows`; [src/App.tsx:19444](../src/App.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-App-tsx-19471-1

Owner `ReadyToInvoiceRows`; [src/App.tsx:19471](../src/App.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" key={view.job.id} className={`ready-to-invoice-row${selectedJobId === view.job.id ? " active" : ""}`} onClick={() => onSelect(view.job.id)}
```

Label/content expression:

```tsx
 <strong>{view.job.job_no}</strong> <span> {view.customer.name} · {view.vehicle.number} </span> <span>Received {view.visit.received_at.slice(0, 10)}</span> <span> {draft.lines.length} billable item {draft.lines.length === 1 ? "" : "s"} </span> <strong>{money(totals.total)}</strong> <span className={ready && !warning ? "ready-state" : "warning-state"} > {warning ?? (ready ? "Ready to invoice" : "Estimate approval required")} </span> 
```

### src/admin-console.tsx

#### STATE-admin-console-tsx-179-1

Owner `AdminConsole`; [src/admin-console.tsx:179](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="management-tabs" role="tablist" aria-label="Admin Console tabs"
```

Label/content expression:

```tsx
 {ADMIN_TABS.map((item) => ( <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => { if (item === tab) return; if ( tab === "Report Templates" && templateDirty && !window.confirm("Discard unsaved template changes?") ) return; setTemplateDirty(false); setTab(item); }} > {ADMIN_TAB_LABELS[item] ?? item} </button> ))} 
```

#### STATE-admin-console-tsx-185-1

Owner `AdminConsole`; [src/admin-console.tsx:185](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => { if (item === tab) return; if ( tab === "Report Templates" && templateDirty && !window.confirm("Discard unsaved template changes?") ) return; setTemplateDirty(false); setTab(item); }}
```

Label/content expression:

```tsx
 {ADMIN_TAB_LABELS[item] ?? item} 
```

#### STATE-admin-console-tsx-207-1

Owner `AdminConsole`; [src/admin-console.tsx:207](../src/admin-console.tsx); tag `div`.

Visibility: storageError

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 <p>{storageError}</p> 
```

#### ACT-admin-console-tsx-246-1

Owner `AdminConsole`; [src/admin-console.tsx:246](../src/admin-console.tsx); tag `AppThemeTab`.

Visibility: tab === "App Theme"

```tsx
adminState={adminState} commit={commit} actingUser={actingUser} onThemeSaved={onThemeSaved}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-261-1

Owner `AdminConsole`; [src/admin-console.tsx:261](../src/admin-console.tsx); tag `ReportTemplatesTab`.

Visibility: tab === "Report Templates"

```tsx
adminState={adminState} commit={commit} actingUser={actingUser} onDirtyChange={setTemplateDirty} initialCategory={initialReportCategory}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-299-1

Owner `TeamStructureTab`; [src/admin-console.tsx:299](../src/admin-console.tsx); tag `RemoteTeamStructure`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
directory={remote} config={cognitoConfig} onChanged={refreshRemote}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-299-1

Owner `TeamStructureTab`; [src/admin-console.tsx:299](../src/admin-console.tsx); tag `p`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-admin-console-tsx-304-1

Owner `TeamStructureHeader`; [src/admin-console.tsx:304](../src/admin-console.tsx); tag `button`.

Visibility: refresh

```tsx
type="button" className="secondary-action team-icon-action" onClick={refresh}
```

Label/content expression:

```tsx
<RefreshCw size={16} /> Refresh
```

#### FORM-admin-console-tsx-331-1

Owner `LocalTeamStructure`; [src/admin-console.tsx:331](../src/admin-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="team-create-form" onSubmit={create}
```

Label/content expression:

```tsx
<label>New department<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" /></label> <button className="primary-action" type="submit"><Plus size={17} />Create department</button>
```

#### ACT-admin-console-tsx-331-1

Owner `LocalTeamStructure`; [src/admin-console.tsx:331](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-331-2

Owner `LocalTeamStructure`; [src/admin-console.tsx:331](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit"
```

Label/content expression:

```tsx
<Plus size={17} /> Create department
```

#### ACT-admin-console-tsx-332-1

Owner `LocalTeamStructure`; [src/admin-console.tsx:332](../src/admin-console.tsx); tag `DepartmentTable`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
departments={state.service_departments} selectedId={selectedId} users={state.users} onManage={setSelectedId} onRename={setRenameDepartment} onArchive={(department) => mutate((db) => updateServiceDepartment(db, department.id, department.name, "ARCHIVED"))}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-333-1

Owner `LocalTeamStructure`; [src/admin-console.tsx:333](../src/admin-console.tsx); tag `DepartmentTeamPanel`.

Visibility: selected

```tsx
departmentName={selected.name} managers={selected.manager_ids.map((id) => state.users.find((user) => user.id === id)).filter((user): user is User => Boolean(user))} advisorTeams={selected.advisor_teams.map((team) => ({ managerId: team.manager_id, advisor: state.users.find((user) => user.id === team.advisor_id) })).filter((team): team is { managerId: number; advisor: User } => Boolean(team.advisor))} appointmentManagerId={appointmentManagerId} teamManagerId={teamManagerId} advisorId={advisorId} eligibleManagers={managers.filter((user) => !selected.manager_ids.includes(user.id))} eligibleAdvisors={advisors} onAppointmentManagerChange={setAppointmentManagerId} onTeamManagerChange={setTeamManagerId} onAdvisorChange={setAdvisorId} onAppoint={() => { if (mutate((db) => appointServiceDepartmentManager(db, selected.id, appointmentManagerId))) { setTeamManagerId(appointmentManagerId); setAppointmentManagerId(0); } }} onRemoveManager={(managerId) => { if (mutate((db) => removeServiceDepartmentManager(db, selected.id, managerId)) && teamManagerId === managerId) setTeamManagerId(0); }} onAssignAdvisor={() => { if (mutate((db) => assignServiceAdvisorTeam(db, selected.id, teamManagerId, advisorId))) setAdvisorId(0); }} onRemoveAdvisor={(managerId, nextAdvisorId) => mutate((db) => removeServiceAdvisorTeam(db, selected.id, managerId, nextAdvisorId))}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-334-1

Owner `LocalTeamStructure`; [src/admin-console.tsx:334](../src/admin-console.tsx); tag `DepartmentRenameDialog`.

Visibility: renameDepartment

```tsx
key={renameDepartment.id} departmentName={renameDepartment.name} onClose={() => setRenameDepartment(undefined)} onSave={(name) => { if (mutate((db) => updateServiceDepartment(db, renameDepartment.id, name, renameDepartment.status))) setRenameDepartment(undefined); }}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-340-1

Owner `DepartmentRenameDialog`; [src/admin-console.tsx:340](../src/admin-console.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Rename department" onClose={onClose}
```

Label/content expression:

```tsx
<form onSubmit={(event) => { event.preventDefault(); onSave(name); }}><label>Department name<input aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)} /></label><div className="action-row"><button className="primary-action" type="submit"><Pencil size={17} />Save department</button><button type="button" onClick={onClose}>Cancel</button></div></form>
```

#### FORM-admin-console-tsx-340-1

Owner `DepartmentRenameDialog`; [src/admin-console.tsx:340](../src/admin-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onSubmit={(event) => { event.preventDefault(); onSave(name); }}
```

Label/content expression:

```tsx
<label>Department name<input aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)} /></label> <div className="action-row"><button className="primary-action" type="submit"><Pencil size={17} />Save department</button><button type="button" onClick={onClose}>Cancel</button></div>
```

#### ACT-admin-console-tsx-340-1

Owner `DepartmentRenameDialog`; [src/admin-console.tsx:340](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-340-2

Owner `DepartmentRenameDialog`; [src/admin-console.tsx:340](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit"
```

Label/content expression:

```tsx
<Pencil size={17} /> Save department
```

#### ACT-admin-console-tsx-340-3

Owner `DepartmentRenameDialog`; [src/admin-console.tsx:340](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={onClose}
```

Label/content expression:

```tsx
Cancel
```

#### ACT-admin-console-tsx-345-1

Owner `DepartmentTable`; [src/admin-console.tsx:345](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={() => onManage(department.id)}
```

Label/content expression:

```tsx
<UsersRound size={15} /> Manage team
```

#### ACT-admin-console-tsx-345-2

Owner `DepartmentTable`; [src/admin-console.tsx:345](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={() => onRename(department)}
```

Label/content expression:

```tsx
<Pencil size={15} /> Rename
```

#### ACT-admin-console-tsx-345-3

Owner `DepartmentTable`; [src/admin-console.tsx:345](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action grid-action-danger" onClick={() => onArchive(department)} disabled={department.status === "ARCHIVED"}
```

Label/content expression:

```tsx
<Archive size={15} /> Archive
```

#### ACT-admin-console-tsx-351-1

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Eligible manager" value={appointmentManagerId} onChange={(event) => onAppointmentManagerChange(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>Select eligible manager</option> {eligibleManagers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}
```

#### ACT-admin-console-tsx-351-2

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" disabled={!appointmentManagerId} onClick={onAppoint}
```

Label/content expression:

```tsx
<UserPlus size={17} /> Appoint manager
```

#### ACT-admin-console-tsx-351-3

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `button`.

Visibility: managers.length

```tsx
type="button" className="secondary-action" onClick={() => onRemoveManager(manager.id)}
```

Label/content expression:

```tsx
<UserMinus size={16} /> Remove
```

#### ACT-admin-console-tsx-351-4

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Appointed manager" value={teamManagerId} onChange={(event) => onTeamManagerChange(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>Select appointed manager</option> {managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}
```

#### ACT-admin-console-tsx-351-5

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Eligible advisor" value={advisorId} disabled={!selectedManager} onChange={(event) => onAdvisorChange(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>{selectedManager ? "Select eligible advisor" : "Choose a manager first"}</option> {eligibleAdvisors.map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}
```

#### ACT-admin-console-tsx-351-6

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action team-assign-action" disabled={!selectedManager \|\| !advisorId} onClick={onAssignAdvisor}
```

Label/content expression:

```tsx
<UserPlus size={17} /> Assign advisor
```

#### ACT-admin-console-tsx-351-7

Owner `DepartmentTeamPanel`; [src/admin-console.tsx:351](../src/admin-console.tsx); tag `button`.

Visibility: !selectedManager

```tsx
type="button" className="secondary-action" onClick={() => onRemoveAdvisor(team.managerId, team.advisor.id)}
```

Label/content expression:

```tsx
<UserMinus size={16} /> Remove
```

#### FORM-admin-console-tsx-363-1

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="team-create-form" onSubmit={(event) => { event.preventDefault(); if (branchId) void run(async () => { const result = await adminUsersApi.createServiceDepartment(config, { branchId, name }); setName(""); setDepartmentId(result.serviceDepartment.id); }); }}
```

Label/content expression:

```tsx
<label>New department<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" /></label> <button className="primary-action" type="submit"><Plus size={17} />Create department</button>
```

#### ACT-admin-console-tsx-363-1

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-363-2

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit"
```

Label/content expression:

```tsx
<Plus size={17} /> Create department
```

#### ACT-admin-console-tsx-363-3

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={() => setDepartmentId(item.id)}
```

Label/content expression:

```tsx
<UsersRound size={15} /> Manage team
```

#### ACT-admin-console-tsx-363-4

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={() => setRenameDepartment(item)}
```

Label/content expression:

```tsx
<Pencil size={15} /> Rename
```

#### ACT-admin-console-tsx-363-5

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action grid-action-danger" disabled={item.status === "ARCHIVED"} onClick={() => void run(() => adminUsersApi.updateServiceDepartment(config, item.id, { name: item.name, status: "ARCHIVED" }))}
```

Label/content expression:

```tsx
<Archive size={15} /> Archive
```

#### ACT-admin-console-tsx-363-6

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `RemoteDepartmentTeamPanel`.

Visibility: department

```tsx
department={department} appointmentManagerId={appointmentManagerId} teamManagerId={teamManagerId} advisorId={advisorId} managerUsers={managerUsers} advisorUsers={advisorUsers} onAppointmentManagerChange={setAppointmentManagerId} onTeamManagerChange={setTeamManagerId} onAdvisorChange={setAdvisorId} onAppoint={() => void run(async () => { await adminUsersApi.appointManager(config, department.id, appointmentManagerId); setTeamManagerId(appointmentManagerId); setAppointmentManagerId(""); })} onRemoveManager={(managerId) => void run(() => adminUsersApi.removeManager(config, department.id, managerId))} onAssignAdvisor={() => void run(async () => { await adminUsersApi.assignAdvisorTeam(config, department.id, teamManagerId, advisorId); setAdvisorId(""); })} onRemoveAdvisor={(managerId, nextAdvisorId) => void run(() => adminUsersApi.removeAdvisorTeam(config, department.id, managerId, nextAdvisorId))}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-363-7

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `DepartmentRenameDialog`.

Visibility: renameDepartment

```tsx
key={renameDepartment.id} departmentName={renameDepartment.name} onClose={() => setRenameDepartment(undefined)} onSave={(nextName) => void run(async () => { await adminUsersApi.updateServiceDepartment(config, renameDepartment.id, { name: nextName, status: renameDepartment.status }); setRenameDepartment(undefined); })}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-363-1

Owner `RemoteTeamStructure`; [src/admin-console.tsx:363](../src/admin-console.tsx); tag `p`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-admin-console-tsx-369-1

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Eligible manager" value={appointmentManagerId} onChange={(event) => onAppointmentManagerChange(event.target.value)}
```

Label/content expression:

```tsx
<option value="">Select eligible manager</option> {managerUsers.filter((user) => !managers.some((manager) => manager.membershipId === user.id)).map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
```

#### ACT-admin-console-tsx-369-2

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" disabled={!appointmentManagerId} onClick={onAppoint}
```

Label/content expression:

```tsx
<UserPlus size={17} /> Appoint manager
```

#### ACT-admin-console-tsx-369-3

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `button`.

Visibility: managers.length

```tsx
type="button" className="secondary-action" onClick={() => onRemoveManager(manager.membershipId)}
```

Label/content expression:

```tsx
<UserMinus size={16} /> Remove
```

#### ACT-admin-console-tsx-369-4

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Appointed manager" value={teamManagerId} onChange={(event) => onTeamManagerChange(event.target.value)}
```

Label/content expression:

```tsx
<option value="">Select appointed manager</option> {managers.map((manager) => <option key={manager.membershipId} value={manager.membershipId}>{manager.name}</option>)}
```

#### ACT-admin-console-tsx-369-5

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Eligible advisor" value={advisorId} disabled={!selectedManager} onChange={(event) => onAdvisorChange(event.target.value)}
```

Label/content expression:

```tsx
<option value="">{selectedManager ? "Select eligible advisor" : "Choose a manager first"}</option> {advisorUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
```

#### ACT-admin-console-tsx-369-6

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action team-assign-action" disabled={!selectedManager \|\| !advisorId} onClick={onAssignAdvisor}
```

Label/content expression:

```tsx
<UserPlus size={17} /> Assign advisor
```

#### ACT-admin-console-tsx-369-7

Owner `RemoteDepartmentTeamPanel`; [src/admin-console.tsx:369](../src/admin-console.tsx); tag `button`.

Visibility: !selectedManager

```tsx
type="button" className="secondary-action" onClick={() => onRemoveAdvisor(team.managerMembershipId, team.advisorMembershipId)}
```

Label/content expression:

```tsx
<UserMinus size={16} /> Remove
```

#### STATE-admin-console-tsx-417-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:417](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs" role="tablist" aria-label="Service task sections"
```

Label/content expression:

```tsx
 <button id="service-tasks-tab" type="button" role="tab" aria-selected={subTab === "tasks"} aria-controls="service-tasks-panel" className={subTab === "tasks" ? "active" : ""} onClick={() => setSubTab("tasks")} > Service Tasks </button> <button id="catalogs-tab" type="button" role="tab" aria-selected={subTab === "catalogs"} aria-controls="catalogs-panel" className={subTab === "catalogs" ? "active" : ""} onClick={() => setSubTab("catalogs")} > Catalogs </button> 
```

#### STATE-admin-console-tsx-418-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:418](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="service-tasks-tab" type="button" role="tab" aria-selected={subTab === "tasks"} aria-controls="service-tasks-panel" className={subTab === "tasks" ? "active" : ""} onClick={() => setSubTab("tasks")}
```

Label/content expression:

```tsx
Service Tasks 
```

#### STATE-admin-console-tsx-429-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:429](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="catalogs-tab" type="button" role="tab" aria-selected={subTab === "catalogs"} aria-controls="catalogs-panel" className={subTab === "catalogs" ? "active" : ""} onClick={() => setSubTab("catalogs")}
```

Label/content expression:

```tsx
Catalogs 
```

#### STATE-admin-console-tsx-441-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:441](../src/admin-console.tsx); tag `div`.

Visibility: subTab === "tasks"

```tsx
id="service-tasks-panel" className="service-task-panel" role="tabpanel" aria-labelledby="service-tasks-tab" aria-label="Service Tasks"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <div> <h3>Service Tasks</h3> <p>Service tasks by department, brand, and car segment.</p> </div> <button type="button" className="primary-action" onClick={() => setDialog({})} > Add Service Task </button> </div> <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search catalog <input type="search" aria-label="Search catalog services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search service tasks" /> </label> <label>Department<select aria-label="Filter department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}><option value={0}>All departments</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label> <label>Brand name<select aria-label="Filter brand name" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}><option value={0}>All brands</option><option value={-1}>- NA -</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label> <label>Car segment<select aria-label="Filter car segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}><option value={0}>All segments</option><option value={-1}>- NA -</option>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}</select></label> <ListSearchActions onClear={clearFilters} /> </div> {error && ( <p className="error-text" role="alert"> {error} </p> )} <div className="table-wrap"> <table aria-label="Service task catalog"> <thead> <tr> <th>Department</th> <th>Brand name</th> <th>Car Segment</th> <th>Service task</th> <th>Pre-GST base rate</th> <th>Applicable GST</th> <th>Actions</th> </tr> </thead> <tbody> {visible.map((item) => ( <CatalogRow key={item.id} item={item} actor={actor} mutate={mutate} setError={setError} onEdit={() => setDialog({ item })} /> ))} </tbody> </table> </div> {!visible.length && ( <p className="empty-state">No active catalog services.</p> )} 
```

#### ACT-admin-console-tsx-447-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:447](../src/admin-console.tsx); tag `button`.

Visibility: subTab === "tasks"

```tsx
type="button" className="primary-action" onClick={() => setDialog({})}
```

Label/content expression:

```tsx
Add Service Task 
```

#### ACT-admin-console-tsx-458-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:458](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "tasks"

```tsx
type="search" aria-label="Search catalog services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search service tasks"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-466-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:466](../src/admin-console.tsx); tag `select`.

Visibility: subTab === "tasks"

```tsx
aria-label="Filter department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>All departments</option> {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
```

#### ACT-admin-console-tsx-467-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:467](../src/admin-console.tsx); tag `select`.

Visibility: subTab === "tasks"

```tsx
aria-label="Filter brand name" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>All brands</option> <option value={-1}>- NA -</option> {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
```

#### ACT-admin-console-tsx-468-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:468](../src/admin-console.tsx); tag `select`.

Visibility: subTab === "tasks"

```tsx
aria-label="Filter car segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>All segments</option> <option value={-1}>- NA -</option> {segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
```

#### ACT-admin-console-tsx-469-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:469](../src/admin-console.tsx); tag `ListSearchActions`.

Visibility: subTab === "tasks"

```tsx
onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-472-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:472](../src/admin-console.tsx); tag `p`.

Visibility: error; subTab === "tasks"

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
 {error} 
```

#### ACT-admin-console-tsx-491-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:491](../src/admin-console.tsx); tag `CatalogRow`.

Visibility: subTab === "tasks"

```tsx
key={item.id} item={item} actor={actor} mutate={mutate} setError={setError} onEdit={() => setDialog({ item })}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-507-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:507](../src/admin-console.tsx); tag `div`.

Visibility: subTab === "catalogs"

```tsx
id="catalogs-panel" className="service-task-catalogs-panel" role="tabpanel" aria-labelledby="catalogs-tab" aria-label="Catalogs"
```

Label/content expression:

```tsx
 <div className="team-details-grid"> <CatalogMasterList title="Brand names" table="service_brands" items={brands} mutate={mutate} /> <CatalogMasterList title="Car segments" table="car_segments" items={segments} mutate={mutate} /> </div> 
```

#### ACT-admin-console-tsx-514-1

Owner `ServiceTaskCatalog`; [src/admin-console.tsx:514](../src/admin-console.tsx); tag `CatalogServiceTaskDialog`.

Visibility: dialog

```tsx
key={dialog.item?.id ?? "new"} item={dialog.item} departments={departments} brands={brands} segments={segments} actor={actor} mutate={mutate} onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-552-1

Owner `CatalogRow`; [src/admin-console.tsx:552](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={onEdit}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-admin-console-tsx-559-1

Owner `CatalogRow`; [src/admin-console.tsx:559](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action grid-action-danger" onClick={() => mutate( (db) => archiveServiceCatalogItemForActor(db, actor.id, item.id), setError, ) }
```

Label/content expression:

```tsx
Archive 
```

#### STATE-admin-console-tsx-635-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:635](../src/admin-console.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title={item ? "Edit Service Task" : "Add Service Task"} subtitle="Changes apply to future task-list selections only." onClose={onClose} footer={ <button className="primary-action" type="submit" form="service-task-dialog-form"> {item ? "Save changes" : "Add service task"} </button> }
```

Label/content expression:

```tsx
 <form id="service-task-dialog-form" className="service-task-dialog-form" onSubmit={save} > <div className="service-task-form-row"> <label> Department <select data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}> <option value={0}>Select department</option> {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)} </select> </label> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-brand">Brand name</label> <button type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}>Quick add new Brand</button> </div> <select id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}> <option value={0}>- NA -</option> {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)} </select> </div> </div> <div className="service-task-form-row"> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-car-segment">Car segment</label> <button type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}>Quick add new Car Segment</button> </div> <select id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}> <option value={0}>- NA -</option> {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)} </select> </div> <label> Service name <input aria-label="Catalog service name" value={name} onChange={(event) => setName(event.target.value)} /> </label> </div> <div className="service-task-rate-grid"> <label> Pre-GST base rate <input aria-label="Catalog base rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} /> </label> <SearchSelect label="Applicable GST" options={CATALOG_GST_OPTIONS} value={gstRate} onChange={(value) => setGstRate(Number(value))} placeholder="Select GST rate" /> </div> {error && <p className="error-text" role="alert">{error}</p>} </form> {quickAdd && <CatalogMasterDialog table={quickAdd} title={quickAdd === "service_brands" ? "Add Brand name" : "Add Car Segment"} mutate={mutate} onClose={() => setQuickAdd(undefined)} onCreated={(id) => { if (quickAdd === "service_brands") setBrandId(id); else setSegmentId(id); setQuickAdd(undefined); }} />} 
```

#### ACT-admin-console-tsx-641-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:641](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="service-task-dialog-form"
```

Label/content expression:

```tsx
 {item ? "Save changes" : "Add service task"} 
```

#### FORM-admin-console-tsx-646-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:646](../src/admin-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="service-task-dialog-form" className="service-task-dialog-form" onSubmit={save}
```

Label/content expression:

```tsx
 <div className="service-task-form-row"> <label> Department <select data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}> <option value={0}>Select department</option> {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)} </select> </label> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-brand">Brand name</label> <button type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}>Quick add new Brand</button> </div> <select id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}> <option value={0}>- NA -</option> {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)} </select> </div> </div> <div className="service-task-form-row"> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-car-segment">Car segment</label> <button type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}>Quick add new Car Segment</button> </div> <select id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}> <option value={0}>- NA -</option> {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)} </select> </div> <label> Service name <input aria-label="Catalog service name" value={name} onChange={(event) => setName(event.target.value)} /> </label> </div> <div className="service-task-rate-grid"> <label> Pre-GST base rate <input aria-label="Catalog base rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} /> </label> <SearchSelect label="Applicable GST" options={CATALOG_GST_OPTIONS} value={gstRate} onChange={(value) => setGstRate(Number(value))} placeholder="Select GST rate" /> </div> {error && <p className="error-text" role="alert">{error}</p>} 
```

#### ACT-admin-console-tsx-654-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:654](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}
```

Label/content expression:

```tsx
 <option value={0}>Select department</option> {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)} 
```

#### ACT-admin-console-tsx-662-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:662](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}
```

Label/content expression:

```tsx
Quick add new Brand
```

#### ACT-admin-console-tsx-664-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:664](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}
```

Label/content expression:

```tsx
 <option value={0}>- NA -</option> {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)} 
```

#### ACT-admin-console-tsx-674-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:674](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}
```

Label/content expression:

```tsx
Quick add new Car Segment
```

#### ACT-admin-console-tsx-676-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:676](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}
```

Label/content expression:

```tsx
 <option value={0}>- NA -</option> {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)} 
```

#### ACT-admin-console-tsx-683-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:683](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Catalog service name" value={name} onChange={(event) => setName(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-693-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:693](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Catalog base rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-702-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:702](../src/admin-console.tsx); tag `SearchSelect`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Applicable GST" options={CATALOG_GST_OPTIONS} value={gstRate} onChange={(value) => setGstRate(Number(value))} placeholder="Select GST rate"
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-710-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:710](../src/admin-console.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-admin-console-tsx-712-1

Owner `CatalogServiceTaskDialog`; [src/admin-console.tsx:712](../src/admin-console.tsx); tag `CatalogMasterDialog`.

Visibility: quickAdd

```tsx
table={quickAdd} title={quickAdd === "service_brands" ? "Add Brand name" : "Add Car Segment"} mutate={mutate} onClose={() => setQuickAdd(undefined)} onCreated={(id) => { if (quickAdd === "service_brands") setBrandId(id); else setSegmentId(id); setQuickAdd(undefined); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-719-1

Owner `CatalogMasterList`; [src/admin-console.tsx:719](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={() => setDialog({ id: 0, name: "", status: "ACTIVE", created_at: "", updated_at: "" })}
```

Label/content expression:

```tsx
<Plus size={16} /> Add
```

#### ACT-admin-console-tsx-719-2

Owner `CatalogMasterList`; [src/admin-console.tsx:719](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action" onClick={() => setDialog(item)}
```

Label/content expression:

```tsx
Rename
```

#### ACT-admin-console-tsx-719-3

Owner `CatalogMasterList`; [src/admin-console.tsx:719](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="grid-action grid-action-danger" disabled={item.status === "ARCHIVED"} onClick={() => mutate((db) => updateServiceCatalogMaster(db, table, item.id, item.name, "ARCHIVED"))}
```

Label/content expression:

```tsx
Archive
```

#### ACT-admin-console-tsx-719-4

Owner `CatalogMasterList`; [src/admin-console.tsx:719](../src/admin-console.tsx); tag `CatalogMasterDialog`.

Visibility: dialog

```tsx
table={table} title={dialog.id ? `Rename ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`} item={dialog.id ? dialog : undefined} mutate={mutate} onClose={() => setDialog(undefined)}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-726-1

Owner `CatalogMasterDialog`; [src/admin-console.tsx:726](../src/admin-console.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title={title} onClose={onClose} footer={<button className="primary-action" type="submit" form="catalog-master-dialog-form">Save</button>}
```

Label/content expression:

```tsx
<form id="catalog-master-dialog-form" onSubmit={save}><label>Name<input data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)} /></label>{error && <p className="error-text" role="alert">{error}</p>}</form>
```

#### ACT-admin-console-tsx-726-1

Owner `CatalogMasterDialog`; [src/admin-console.tsx:726](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="catalog-master-dialog-form"
```

Label/content expression:

```tsx
Save
```

#### FORM-admin-console-tsx-726-1

Owner `CatalogMasterDialog`; [src/admin-console.tsx:726](../src/admin-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="catalog-master-dialog-form" onSubmit={save}
```

Label/content expression:

```tsx
<label>Name<input data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>}
```

#### ACT-admin-console-tsx-726-2

Owner `CatalogMasterDialog`; [src/admin-console.tsx:726](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-726-2

Owner `CatalogMasterDialog`; [src/admin-console.tsx:726](../src/admin-console.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### STATE-admin-console-tsx-824-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:824](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Roles &amp; Page Access</h3> <button className="primary-action" onClick={() => { setNewRole({ label: "", description: "" }); setFormError(""); setCreating(true); }} > Add Role </button> </div> {creating && ( <Dialog title="Add Role" subtitle="Session-only demo role" onClose={() => setCreating(false)} > <form onSubmit={(event) => { event.preventDefault(); try { commit((current) => addDemoRole(current, newRole), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${newRole.label.trim()}" created`, userId: String(actingUser.id), userName: actingUser.name, }); setCreating(false); } catch (error) { setFormError( error instanceof Error ? error.message : "Could not create role.", ); } }} > <label> Role name <input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) } /> </label> <label> Description <input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) } /> </label> {formError && <p className="error-text">{formError}</p>} <div className="action-row"> <button className="primary-action">Save Role</button> <button type="button" onClick={() => setCreating(false)}> Cancel </button> </div> </form> </Dialog> )} <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search <input aria-label="Search roles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Role name or description" /> </label> <label> Status <select aria-label="Filter roles by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as typeof statusFilter); setPage(1); }} > <option value="ALL">All statuses</option> <option value="active">Active</option> <option value="archived">Archived</option> </select> </label> <ListSearchActions onClear={() => { setSearch(""); setStatusFilter("ALL"); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Roles", filters: activeFilterSummary({ Search: search.trim(), Status: statusFilter, }), columns: roleColumns, rows: roles, }} /> } from={pagedRoles.from} to={pagedRoles.to} totalCount={pagedRoles.totalCount} page={pagedRoles.page} pageCount={pagedRoles.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Role records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <div className="role-access-layout"> <div className="record-list role-list"> {pagedRoles.items.map((role) => ( <div className={`managed-record${selectedRoleId === role.id ? " active-record" : ""}`} key={role.id} > {editingRoleId === role.id ? ( <form className="inline-edit" onSubmit={(event) => { event.preventDefault(); try { commit( (current) => updateDemoRole(current, role.id, editDraft), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${role.label}" updated`, userId: String(actingUser.id), userName: actingUser.name, }, ); setEditingRoleId(undefined); } catch (error) { window.alert( error instanceof Error ? error.message : "Could not update role.", ); } }} > <input required value={editDraft.label} onChange={(event) => setEditDraft({ ...editDraft, label: event.target.value }) } /> <input value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value, }) } placeholder="Description" /> <div className="action-row"> <button className="primary-action">Save</button> <button type="button" onClick={() => setEditingRoleId(undefined)} > Cancel </button> </div> </form> ) : ( <button className="record-select" onClick={() => setSelectedRoleId(role.id)} > <strong>{role.label}</strong> <span> {role.description \|\| "No description"} · {role.status} {role.isBuiltIn ? " · built-in" : ""} </span> </button> )} {editingRoleId !== role.id && ( <div className="action-row"> <button onClick={() => { setEditingRoleId(role.id); setEditDraft({ label: role.label, description: role.description, }); }} > Edit </button> <button className="danger-action" disabled={role.id === "admin" \|\| role.status === "archived"} title={ role.id === "admin" ? "Owner/Admin cannot be archived" : undefined } onClick={() => { if (!window.confirm(`Archive role "${role.label}"?`)) return; commit((current) => archiveDemoRole(current, role.id), { stream: "feature", level: "warning", area: "Administration", feature: "Roles & Page Access", message: `Role "${role.label}" archived`, userId: String(actingUser.id), userName: actingUser.name, }); if (selectedRoleId === role.id) setSelectedRoleId(undefined); }} > Archive </button> </div> )} </div> ))} {roles.length === 0 && ( <div className="list-empty"> <h3>No matching roles</h3> <FilterClearButton onClick={() => { setSearch(""); setStatusFilter("ALL"); setPage(1); }} label="Clear filters" /> </div> )} </div> <div className="desk-panel page-access-panel"> {!selectedRole ? ( <p className="empty-state">Select a role to manage page access.</p> ) : ( <> <PanelTitle icon={<Sliders />} title={`Page Access · ${selectedRole.label}`} subtitle={ isOwnerRole ? "Admin Console access is always protected for Owner/Admin" : "Grouped by navigation area" } /> <div className="store-filter-grid"> <label className="list-search"> Search pages <input value={pageSearch} onChange={(event) => setPageSearch(event.target.value)} placeholder="Page name" /> </label> <div className="action-row"> <button onClick={() => setDraftPages( isOwnerRole ? [...ALL_PAGE_KEYS] : [...ALL_PAGE_KEYS], ) } > Select All </button> <button onClick={() => setDraftPages(isOwnerRole ? ["admin-console"] : []) } > Clear All </button> <button onClick={() => setDraftPages(savedPages)} disabled={!dirty} > Reset to Saved </button> <button className="primary-action" disabled={!dirty} onClick={() => { commit( (current) => updateRolePageAccess( current, selectedRole.id, draftPages, ), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Page access saved for "${selectedRole.label}"`, userId: String(actingUser.id), userName: actingUser.name, referenceId: selectedRole.id, }, ); }} > Save Changes </button> </div> </div> <div className="page-access-groups"> {filteredGroups.map((group) => ( <GroupFieldset key={group.key} group={group} draftPages={draftPages} isOwnerRole={isOwnerRole} onToggleGroup={toggleGroup} onTogglePage={togglePage} /> ))} </div> <div className="nav-preview"> <strong>Navigation preview</strong> <div className="nav-preview-pills"> {draftPages.length === 0 ? ( <span className="empty-state">No pages granted.</span> ) : ( ADMIN_PAGE_GROUPS.flatMap((group) => group.pages) .filter((page) => draftPages.includes(page.key)) .map((page) => ( <span className="category-badge" key={page.key}> {page.label} </span> )) )} </div> </div> </> )} </div> </div> <ResultPagination page={pagedRoles.page} pageCount={pagedRoles.pageCount} onChange={setPage} /> 
```

#### ACT-admin-console-tsx-827-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:827](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => { setNewRole({ label: "", description: "" }); setFormError(""); setCreating(true); }}
```

Label/content expression:

```tsx
Add Role 
```

#### STATE-admin-console-tsx-840-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:840](../src/admin-console.tsx); tag `Dialog`.

Visibility: creating

```tsx
title="Add Role" subtitle="Session-only demo role" onClose={() => setCreating(false)}
```

Label/content expression:

```tsx
 <form onSubmit={(event) => { event.preventDefault(); try { commit((current) => addDemoRole(current, newRole), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${newRole.label.trim()}" created`, userId: String(actingUser.id), userName: actingUser.name, }); setCreating(false); } catch (error) { setFormError( error instanceof Error ? error.message : "Could not create role.", ); } }} > <label> Role name <input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) } /> </label> <label> Description <input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) } /> </label> {formError && <p className="error-text">{formError}</p>} <div className="action-row"> <button className="primary-action">Save Role</button> <button type="button" onClick={() => setCreating(false)}> Cancel </button> </div> </form> 
```

#### FORM-admin-console-tsx-845-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:845](../src/admin-console.tsx); tag `form`.

Visibility: creating

```tsx
onSubmit={(event) => { event.preventDefault(); try { commit((current) => addDemoRole(current, newRole), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${newRole.label.trim()}" created`, userId: String(actingUser.id), userName: actingUser.name, }); setCreating(false); } catch (error) { setFormError( error instanceof Error ? error.message : "Could not create role.", ); } }}
```

Label/content expression:

```tsx
 <label> Role name <input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) } /> </label> <label> Description <input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) } /> </label> {formError && <p className="error-text">{formError}</p>} <div className="action-row"> <button className="primary-action">Save Role</button> <button type="button" onClick={() => setCreating(false)}> Cancel </button> </div> 
```

#### ACT-admin-console-tsx-870-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:870](../src/admin-console.tsx); tag `input`.

Visibility: creating

```tsx
required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-880-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:880](../src/admin-console.tsx); tag `input`.

Visibility: creating

```tsx
value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-889-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:889](../src/admin-console.tsx); tag `button`.

Visibility: creating

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Role
```

#### ACT-admin-console-tsx-890-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:890](../src/admin-console.tsx); tag `button`.

Visibility: creating

```tsx
type="button" onClick={() => setCreating(false)}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-admin-console-tsx-901-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:901](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search roles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Role name or description"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-913-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:913](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Filter roles by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as typeof statusFilter); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All statuses</option> <option value="active">Active</option> <option value="archived">Archived</option> 
```

#### ACT-admin-console-tsx-926-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:926](../src/admin-console.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={() => { setSearch(""); setStatusFilter("ALL"); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-934-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:934](../src/admin-console.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <DownloadMenu report={{ title: "Roles", filters: activeFilterSummary({ Search: search.trim(), Status: statusFilter, }), columns: roleColumns, rows: roles, }} /> } from={pagedRoles.from} to={pagedRoles.to} totalCount={pagedRoles.totalCount} page={pagedRoles.page} pageCount={pagedRoles.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Role records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-936-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:936](../src/admin-console.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: "Roles", filters: activeFilterSummary({ Search: search.trim(), Status: statusFilter, }), columns: roleColumns, rows: roles, }}
```

Label/content expression:

```tsx

```

#### FORM-admin-console-tsx-970-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:970](../src/admin-console.tsx); tag `form`.

Visibility: editingRoleId === role.id

```tsx
className="inline-edit" onSubmit={(event) => { event.preventDefault(); try { commit( (current) => updateDemoRole(current, role.id, editDraft), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${role.label}" updated`, userId: String(actingUser.id), userName: actingUser.name, }, ); setEditingRoleId(undefined); } catch (error) { window.alert( error instanceof Error ? error.message : "Could not update role.", ); } }}
```

Label/content expression:

```tsx
 <input required value={editDraft.label} onChange={(event) => setEditDraft({ ...editDraft, label: event.target.value }) } /> <input value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value, }) } placeholder="Description" /> <div className="action-row"> <button className="primary-action">Save</button> <button type="button" onClick={() => setEditingRoleId(undefined)} > Cancel </button> </div> 
```

#### ACT-admin-console-tsx-998-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:998](../src/admin-console.tsx); tag `input`.

Visibility: editingRoleId === role.id

```tsx
required value={editDraft.label} onChange={(event) => setEditDraft({ ...editDraft, label: event.target.value }) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1005-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1005](../src/admin-console.tsx); tag `input`.

Visibility: editingRoleId === role.id

```tsx
value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value, }) } placeholder="Description"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1016-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1016](../src/admin-console.tsx); tag `button`.

Visibility: editingRoleId === role.id

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save
```

#### ACT-admin-console-tsx-1017-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1017](../src/admin-console.tsx); tag `button`.

Visibility: editingRoleId === role.id

```tsx
type="button" onClick={() => setEditingRoleId(undefined)}
```

Label/content expression:

```tsx
Cancel 
```

#### ACT-admin-console-tsx-1026-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1026](../src/admin-console.tsx); tag `button`.

Visibility: editingRoleId === role.id

```tsx
className="record-select" onClick={() => setSelectedRoleId(role.id)}
```

Label/content expression:

```tsx
 <strong>{role.label}</strong> <span> {role.description \|\| "No description"} · {role.status} {role.isBuiltIn ? " · built-in" : ""} </span> 
```

#### ACT-admin-console-tsx-1039-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1039](../src/admin-console.tsx); tag `button`.

Visibility: editingRoleId !== role.id

```tsx
onClick={() => { setEditingRoleId(role.id); setEditDraft({ label: role.label, description: role.description, }); }}
```

Label/content expression:

```tsx
Edit 
```

#### ACT-admin-console-tsx-1050-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1050](../src/admin-console.tsx); tag `button`.

Visibility: editingRoleId !== role.id

```tsx
className="danger-action" disabled={role.id === "admin" \|\| role.status === "archived"} title={ role.id === "admin" ? "Owner/Admin cannot be archived" : undefined } onClick={() => { if (!window.confirm(`Archive role "${role.label}"?`)) return; commit((current) => archiveDemoRole(current, role.id), { stream: "feature", level: "warning", area: "Administration", feature: "Roles & Page Access", message: `Role "${role.label}" archived`, userId: String(actingUser.id), userName: actingUser.name, }); if (selectedRoleId === role.id) setSelectedRoleId(undefined); }}
```

Label/content expression:

```tsx
Archive 
```

#### ACT-admin-console-tsx-1083-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1083](../src/admin-console.tsx); tag `FilterClearButton`.

Visibility: roles.length === 0

```tsx
onClick={() => { setSearch(""); setStatusFilter("ALL"); setPage(1); }} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1112-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1112](../src/admin-console.tsx); tag `input`.

Visibility: !selectedRole

```tsx
value={pageSearch} onChange={(event) => setPageSearch(event.target.value)} placeholder="Page name"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1119-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1119](../src/admin-console.tsx); tag `button`.

Visibility: !selectedRole

```tsx
onClick={() => setDraftPages( isOwnerRole ? [...ALL_PAGE_KEYS] : [...ALL_PAGE_KEYS], ) }
```

Label/content expression:

```tsx
Select All 
```

#### ACT-admin-console-tsx-1128-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1128](../src/admin-console.tsx); tag `button`.

Visibility: !selectedRole

```tsx
onClick={() => setDraftPages(isOwnerRole ? ["admin-console"] : []) }
```

Label/content expression:

```tsx
Clear All 
```

#### ACT-admin-console-tsx-1135-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1135](../src/admin-console.tsx); tag `button`.

Visibility: !selectedRole

```tsx
onClick={() => setDraftPages(savedPages)} disabled={!dirty}
```

Label/content expression:

```tsx
Reset to Saved 
```

#### ACT-admin-console-tsx-1141-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1141](../src/admin-console.tsx); tag `button`.

Visibility: !selectedRole

```tsx
className="primary-action" disabled={!dirty} onClick={() => { commit( (current) => updateRolePageAccess( current, selectedRole.id, draftPages, ), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Page access saved for "${selectedRole.label}"`, userId: String(actingUser.id), userName: actingUser.name, referenceId: selectedRole.id, }, ); }}
```

Label/content expression:

```tsx
Save Changes 
```

#### ACT-admin-console-tsx-1171-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1171](../src/admin-console.tsx); tag `GroupFieldset`.

Visibility: !selectedRole

```tsx
key={group.key} group={group} draftPages={draftPages} isOwnerRole={isOwnerRole} onToggleGroup={toggleGroup} onTogglePage={togglePage}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1201-1

Owner `RolesPageAccessTab`; [src/admin-console.tsx:1201](../src/admin-console.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={pagedRoles.page} pageCount={pagedRoles.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1236-1

Owner `GroupFieldset`; [src/admin-console.tsx:1236](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
ref={groupRef} type="checkbox" checked={allChecked} onChange={() => onToggleGroup(keys, !allChecked)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1256-1

Owner `GroupFieldset`; [src/admin-console.tsx:1256](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="checkbox" checked={draftPages.includes(page.key)} disabled={locked} onChange={() => onTogglePage(page.key)}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-1313-1

Owner `AppThemeTab`; [src/admin-console.tsx:1313](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel app-theme-tab" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <div> <h3>App Theme</h3> <p> Changes apply to the live application after saving; generated documents keep their own template styling. </p> </div> <div className="action-row"> <button onClick={() => { setDraft(adminState.appTheme); setJustSaved(false); }} disabled={!dirty} > Reset to Saved </button> <button onClick={() => { setDraft({ ...DEFAULT_APP_THEME }); setJustSaved(false); }} > Set to Default </button> <button className="primary-action" onClick={save} disabled={!dirty}> Save App Theme </button> </div> </div> {justSaved && !dirty && ( <p className="save-confirmation">App theme saved for this session.</p> )} {dirty && ( <p className="unsaved-note"> Previewing unsaved changes. Save App Theme to apply them globally. </p> )} <div className="app-theme-layout"> <div className="app-theme-controls"> <SearchSelect label="Application font" options={APP_THEME_FONTS.map((item) => ({ value: item.id, label: item.label, }))} value={draft.fontId} onChange={(fontId) => { setDraft((current) => ({ ...current, fontId: fontId as AppTheme["fontId"], })); setJustSaved(false); }} placeholder="Search fonts..." /> <fieldset className="palette-picker"> <legend>Color palette</legend> <div className="palette-options"> {APP_THEME_PALETTES.map((item) => ( <button type="button" key={item.id} className={`palette-option${draft.paletteId === item.id ? " selected" : ""}`} aria-pressed={draft.paletteId === item.id} onClick={() => { setDraft((current) => ({ ...current, paletteId: item.id })); setJustSaved(false); }} > <span className="palette-swatch" style={{ background: item.tokens.sidebar, borderColor: item.tokens.sidebarBorder, }} > <i style={{ background: item.tokens.active }} /> <i style={{ background: item.tokens.tableHeader }} /> <i style={{ background: item.tokens.accent }} /> </span> <span>{item.label}</span> </button> ))} </div> </fieldset> </div> <section className="app-theme-preview" style={{ fontFamily: font.cssFamily, background: palette.tokens.background, ["--preview-sidebar" as string]: palette.tokens.sidebar, ["--preview-active" as string]: palette.tokens.active, ["--preview-accent" as string]: palette.tokens.accent, ["--preview-header" as string]: palette.tokens.tableHeader, }} aria-label="App theme preview" > <aside> <strong>WorkshopOS</strong> <span className="preview-menu-active">Dashboard</span> <span>Job Cards</span> </aside> <div> <h2>Theme preview</h2> <label> Customer name <input value="Aarav Motors" readOnly /> </label> <div className="preview-tabs"> <button className="active">Overview</button> <button>History</button> </div> <div className="preview-selected-row">Selected job row</div> <table> <thead> <tr> <th>Job Card</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td>JC-2026-002144</td> <td>In progress</td> </tr> </tbody> </table> </div> </section> </div> 
```

#### ACT-admin-console-tsx-1323-1

Owner `AppThemeTab`; [src/admin-console.tsx:1323](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => { setDraft(adminState.appTheme); setJustSaved(false); }} disabled={!dirty}
```

Label/content expression:

```tsx
Reset to Saved 
```

#### ACT-admin-console-tsx-1332-1

Owner `AppThemeTab`; [src/admin-console.tsx:1332](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={() => { setDraft({ ...DEFAULT_APP_THEME }); setJustSaved(false); }}
```

Label/content expression:

```tsx
Set to Default 
```

#### ACT-admin-console-tsx-1340-1

Owner `AppThemeTab`; [src/admin-console.tsx:1340](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={save} disabled={!dirty}
```

Label/content expression:

```tsx
Save App Theme 
```

#### ACT-admin-console-tsx-1355-1

Owner `AppThemeTab`; [src/admin-console.tsx:1355](../src/admin-console.tsx); tag `SearchSelect`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Application font" options={APP_THEME_FONTS.map((item) => ({ value: item.id, label: item.label, }))} value={draft.fontId} onChange={(fontId) => { setDraft((current) => ({ ...current, fontId: fontId as AppTheme["fontId"], })); setJustSaved(false); }} placeholder="Search fonts..."
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1375-1

Owner `AppThemeTab`; [src/admin-console.tsx:1375](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" key={item.id} className={`palette-option${draft.paletteId === item.id ? " selected" : ""}`} aria-pressed={draft.paletteId === item.id} onClick={() => { setDraft((current) => ({ ...current, paletteId: item.id })); setJustSaved(false); }}
```

Label/content expression:

```tsx
 <span className="palette-swatch" style={{ background: item.tokens.sidebar, borderColor: item.tokens.sidebarBorder, }} > <i style={{ background: item.tokens.active }} /> <i style={{ background: item.tokens.tableHeader }} /> <i style={{ background: item.tokens.accent }} /> </span> <span>{item.label}</span> 
```

#### ACT-admin-console-tsx-1423-1

Owner `AppThemeTab`; [src/admin-console.tsx:1423](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value="Aarav Motors" readOnly
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1426-1

Owner `AppThemeTab`; [src/admin-console.tsx:1426](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="active"
```

Label/content expression:

```tsx
Overview
```

#### ACT-admin-console-tsx-1427-1

Owner `AppThemeTab`; [src/admin-console.tsx:1427](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx

```

Label/content expression:

```tsx
History
```

#### STATE-admin-console-tsx-1564-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1564](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Business Settings</h3> <div className="action-row"> <button onClick={reset} disabled={!dirty}> Reset to Saved </button> <button className="primary-action" onClick={save} disabled={!dirty}> Save Settings </button> </div> </div> {errors.length > 0 && ( <div className="api-error" role="alert"> {errors.map((message) => ( <p key={message}>{message}</p> ))} </div> )} {justSaved && !dirty && ( <p className="save-confirmation">Settings saved for this session.</p> )} {dirty && <p className="unsaved-note">Unsaved changes.</p>} <div className="sub-tabs" role="tablist" aria-label="Business settings sections" > {SETTINGS_GROUPS.map((group) => ( <button key={group.key} role="tab" aria-selected={subTab === group.key} className={subTab === group.key ? "active" : ""} onClick={() => setSubTab(group.key)} > {group.label} </button> ))} </div> {subTab === "profile" && ( <div className="form-grid"> <label> Business name <input value={draft.profile.businessName} onChange={(event) => setField("profile", "businessName", event.target.value) } /> </label> <label> Legal name <input value={draft.profile.legalName} onChange={(event) => setField("profile", "legalName", event.target.value) } /> </label> <label> Phone <input value={draft.profile.phone} onChange={(event) => setField("profile", "phone", event.target.value) } /> </label> <label> Email <input type="email" value={draft.profile.email} onChange={(event) => setField("profile", "email", event.target.value) } /> </label> <label> Address <input value={draft.profile.address} onChange={(event) => setField("profile", "address", event.target.value) } /> </label> <label> Timezone <input value={draft.profile.timezone} onChange={(event) => setField("profile", "timezone", event.target.value) } /> </label> <label> Currency <input value={draft.profile.currency} onChange={(event) => setField("profile", "currency", event.target.value) } /> </label> </div> )} {subTab === "branch" && ( <> <div className="form-grid"> <label> Branch name <input value={draft.branch.name} onChange={(event) => setField("branch", "name", event.target.value) } /> </label> <label> Opening time <input type="time" value={draft.branch.openingTime} onChange={(event) => setField("branch", "openingTime", event.target.value) } /> </label> <label> Closing time <input type="time" value={draft.branch.closingTime} onChange={(event) => setField("branch", "closingTime", event.target.value) } /> </label> <label> Holiday behavior <select value={draft.branch.holidayBehavior} onChange={(event) => setField( "branch", "holidayBehavior", event.target .value as WorkshopBusinessSettings["branch"]["holidayBehavior"], ) } > <option value="closed">Closed</option> <option value="appointment-only">Appointment only</option> </select> </label> </div> <fieldset className="assignment-fieldset"> <legend>Working days</legend> {WEEKDAYS.map((day) => ( <label key={day}> <input type="checkbox" checked={draft.branch.workingDays.includes(day)} onChange={() => toggleListValue("branch", "workingDays", day)} /> {day} </label> ))} </fieldset> </> )} {subTab === "jobs" && ( <div className="form-grid"> <label> Job number prefix <input value={draft.jobs.jobNumberPrefix} onChange={(event) => setField("jobs", "jobNumberPrefix", event.target.value) } /> </label> <label> Default promised hours <input type="number" min={1} value={draft.jobs.defaultPromisedHours} onChange={(event) => setField( "jobs", "defaultPromisedHours", Number(event.target.value), ) } /> </label> <label> <input type="checkbox" checked={draft.jobs.requireQc} onChange={(event) => setField("jobs", "requireQc", event.target.checked) } />{" "} Require QC before closure </label> <label> <input type="checkbox" checked={draft.jobs.washingDefault} onChange={(event) => setField("jobs", "washingDefault", event.target.checked) } />{" "} Washing needed by default </label> <label> <input type="checkbox" checked={draft.jobs.autoCloseAfterDelivery} onChange={(event) => setField("jobs", "autoCloseAfterDelivery", event.target.checked) } />{" "} Auto-close after delivery </label> </div> )} {subTab === "pricing" && ( <div className="form-grid"> <label> Estimate validity (days) <input type="number" min={1} value={draft.pricing.estimateValidityDays} onChange={(event) => setField( "pricing", "estimateValidityDays", Number(event.target.value), ) } /> </label> <label> Default labour rate <input type="number" min={0} value={draft.pricing.defaultLabourRate} onChange={(event) => setField( "pricing", "defaultLabourRate", Number(event.target.value), ) } /> </label> <label> Discount approval threshold (%) <input type="number" min={0} max={100} value={draft.pricing.discountApprovalPercent} onChange={(event) => setField( "pricing", "discountApprovalPercent", Number(event.target.value), ) } /> </label> <label> <input type="checkbox" checked={draft.pricing.requireEstimateApproval} onChange={(event) => setField( "pricing", "requireEstimateApproval", event.target.checked, ) } />{" "} Require estimate approval </label> </div> )} {subTab === "billing" && ( <> <div className="form-grid"> <label> GSTIN <input aria-label="GSTIN" value={draft.billing.gstin} onChange={(event) => setField("billing", "gstin", event.target.value) } /> </label> <label> Account holder <input aria-label="Account holder" value={draft.billing.bankAccountHolder} onChange={(event) => setField("billing", "bankAccountHolder", event.target.value) } /> </label> <label> Bank name <input aria-label="Bank name" value={draft.billing.bankName} onChange={(event) => setField("billing", "bankName", event.target.value) } /> </label> <label> Account number <input aria-label="Account number" inputMode="numeric" value={draft.billing.bankAccountNumber} onChange={(event) => setField("billing", "bankAccountNumber", event.target.value) } /> </label> <label> IFSC <input aria-label="IFSC" value={draft.billing.bankIfsc} onChange={(event) => setField("billing", "bankIfsc", event.target.value) } /> </label> <label> Branch <input aria-label="Bank branch" value={draft.billing.bankBranch} onChange={(event) => setField("billing", "bankBranch", event.target.value) } /> </label> <label> UPI ID <input aria-label="UPI ID" value={draft.billing.upiId} onChange={(event) => setField("billing", "upiId", event.target.value) } /> </label> <label> Default GST % <input type="number" min={0} max={100} value={draft.billing.defaultGstPercent} onChange={(event) => setField( "billing", "defaultGstPercent", Number(event.target.value), ) } /> </label> <label> Invoice prefix <input value={draft.billing.invoicePrefix} onChange={(event) => setField("billing", "invoicePrefix", event.target.value) } /> </label> <label> Receipt prefix <input value={draft.billing.receiptPrefix} onChange={(event) => setField("billing", "receiptPrefix", event.target.value) } /> </label> <label> Gate pass prefix <input value={draft.billing.gatePassPrefix} onChange={(event) => setField("billing", "gatePassPrefix", event.target.value) } /> </label> </div> <fieldset className="assignment-fieldset"> <legend>Accepted payment modes</legend> {PAYMENT_MODE_OPTIONS.map((mode) => ( <label key={mode}> <input type="checkbox" checked={draft.billing.paymentModes.includes(mode)} onChange={() => toggleListValue("billing", "paymentModes", mode) } /> {mode} </label> ))} </fieldset> </> )} {subTab === "inventory" && ( <div className="form-grid"> <label> Default unit <input value={draft.inventory.defaultUnit} onChange={(event) => setField("inventory", "defaultUnit", event.target.value) } /> </label> <label> <input type="checkbox" checked={draft.inventory.lowStockNotifications} onChange={(event) => setField( "inventory", "lowStockNotifications", event.target.checked, ) } />{" "} Low-stock notifications </label> <label> <input type="checkbox" checked={draft.inventory.requireAdjustmentReason} onChange={(event) => setField( "inventory", "requireAdjustmentReason", event.target.checked, ) } />{" "} Require a reason for stock adjustments </label> </div> )} {subTab === "notifications" && ( <> <fieldset className="assignment-fieldset"> <legend>Customer update channels</legend> {NOTIFICATION_CHANNEL_OPTIONS.map((channel) => ( <label key={channel}> <input type="checkbox" checked={draft.notifications.customerChannels.includes( channel, )} onChange={() => toggleListValue( "notifications", "customerChannels", channel, ) } /> {channel} </label> ))} </fieldset> <div className="form-grid"> <label> Document header <input value={draft.notifications.documentHeader} onChange={(event) => setField( "notifications", "documentHeader", event.target.value, ) } /> </label> <label> Estimate template <input value={draft.notifications.estimateTemplate} onChange={(event) => setField( "notifications", "estimateTemplate", event.target.value, ) } /> </label> <label> Invoice template <input value={draft.notifications.invoiceTemplate} onChange={(event) => setField( "notifications", "invoiceTemplate", event.target.value, ) } /> </label> </div> <p className="field-help"> Available placeholders: {"{{jobCardNo}}"}, {"{{vehicleRegistrationNo}}"}, {"{{serviceAdvisorName}}"}, and {"{{workshopName}}"}. </p> <div className="form-grid"> <label> Job-card creation WhatsApp template <textarea rows={3} value={draft.notifications.jobCardCreatedWhatsAppTemplate} onChange={(event) => setField( "notifications", "jobCardCreatedWhatsAppTemplate", event.target.value, ) } /> </label> <label> Job-card creation email template <textarea rows={3} value={draft.notifications.jobCardCreatedEmailTemplate} onChange={(event) => setField( "notifications", "jobCardCreatedEmailTemplate", event.target.value, ) } /> </label> <label> Job-card closure WhatsApp template <textarea rows={3} value={draft.notifications.jobCardClosedWhatsAppTemplate} onChange={(event) => setField( "notifications", "jobCardClosedWhatsAppTemplate", event.target.value, ) } /> </label> <label> Job-card closure email template <textarea rows={3} value={draft.notifications.jobCardClosedEmailTemplate} onChange={(event) => setField( "notifications", "jobCardClosedEmailTemplate", event.target.value, ) } /> </label> </div> </> )} 
```

#### ACT-admin-console-tsx-1568-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1568](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={reset} disabled={!dirty}
```

Label/content expression:

```tsx
Reset to Saved 
```

#### ACT-admin-console-tsx-1571-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1571](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={save} disabled={!dirty}
```

Label/content expression:

```tsx
Save Settings 
```

#### STATE-admin-console-tsx-1577-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1577](../src/admin-console.tsx); tag `div`.

Visibility: errors.length > 0

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 {errors.map((message) => ( <p key={message}>{message}</p> ))} 
```

#### STATE-admin-console-tsx-1587-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1587](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs" role="tablist" aria-label="Business settings sections"
```

Label/content expression:

```tsx
 {SETTINGS_GROUPS.map((group) => ( <button key={group.key} role="tab" aria-selected={subTab === group.key} className={subTab === group.key ? "active" : ""} onClick={() => setSubTab(group.key)} > {group.label} </button> ))} 
```

#### STATE-admin-console-tsx-1593-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1593](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={group.key} role="tab" aria-selected={subTab === group.key} className={subTab === group.key ? "active" : ""} onClick={() => setSubTab(group.key)}
```

Label/content expression:

```tsx
 {group.label} 
```

#### ACT-admin-console-tsx-1609-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1609](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
value={draft.profile.businessName} onChange={(event) => setField("profile", "businessName", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1618-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1618](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
value={draft.profile.legalName} onChange={(event) => setField("profile", "legalName", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1627-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1627](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
value={draft.profile.phone} onChange={(event) => setField("profile", "phone", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1636-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1636](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
type="email" value={draft.profile.email} onChange={(event) => setField("profile", "email", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1646-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1646](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
value={draft.profile.address} onChange={(event) => setField("profile", "address", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1655-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1655](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
value={draft.profile.timezone} onChange={(event) => setField("profile", "timezone", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1664-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1664](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "profile"

```tsx
value={draft.profile.currency} onChange={(event) => setField("profile", "currency", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1678-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1678](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "branch"

```tsx
value={draft.branch.name} onChange={(event) => setField("branch", "name", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1687-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1687](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "branch"

```tsx
type="time" value={draft.branch.openingTime} onChange={(event) => setField("branch", "openingTime", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1697-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1697](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "branch"

```tsx
type="time" value={draft.branch.closingTime} onChange={(event) => setField("branch", "closingTime", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1707-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1707](../src/admin-console.tsx); tag `select`.

Visibility: subTab === "branch"

```tsx
value={draft.branch.holidayBehavior} onChange={(event) => setField( "branch", "holidayBehavior", event.target .value as WorkshopBusinessSettings["branch"]["holidayBehavior"], ) }
```

Label/content expression:

```tsx
 <option value="closed">Closed</option> <option value="appointment-only">Appointment only</option> 
```

#### ACT-admin-console-tsx-1727-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1727](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "branch"

```tsx
type="checkbox" checked={draft.branch.workingDays.includes(day)} onChange={() => toggleListValue("branch", "workingDays", day)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1742-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1742](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "jobs"

```tsx
value={draft.jobs.jobNumberPrefix} onChange={(event) => setField("jobs", "jobNumberPrefix", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1751-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1751](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "jobs"

```tsx
type="number" min={1} value={draft.jobs.defaultPromisedHours} onChange={(event) => setField( "jobs", "defaultPromisedHours", Number(event.target.value), ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1765-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1765](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "jobs"

```tsx
type="checkbox" checked={draft.jobs.requireQc} onChange={(event) => setField("jobs", "requireQc", event.target.checked) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1775-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1775](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "jobs"

```tsx
type="checkbox" checked={draft.jobs.washingDefault} onChange={(event) => setField("jobs", "washingDefault", event.target.checked) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1785-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1785](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "jobs"

```tsx
type="checkbox" checked={draft.jobs.autoCloseAfterDelivery} onChange={(event) => setField("jobs", "autoCloseAfterDelivery", event.target.checked) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1800-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1800](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "pricing"

```tsx
type="number" min={1} value={draft.pricing.estimateValidityDays} onChange={(event) => setField( "pricing", "estimateValidityDays", Number(event.target.value), ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1815-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1815](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "pricing"

```tsx
type="number" min={0} value={draft.pricing.defaultLabourRate} onChange={(event) => setField( "pricing", "defaultLabourRate", Number(event.target.value), ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1830-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1830](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "pricing"

```tsx
type="number" min={0} max={100} value={draft.pricing.discountApprovalPercent} onChange={(event) => setField( "pricing", "discountApprovalPercent", Number(event.target.value), ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1845-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1845](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "pricing"

```tsx
type="checkbox" checked={draft.pricing.requireEstimateApproval} onChange={(event) => setField( "pricing", "requireEstimateApproval", event.target.checked, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1865-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1865](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="GSTIN" value={draft.billing.gstin} onChange={(event) => setField("billing", "gstin", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1875-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1875](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="Account holder" value={draft.billing.bankAccountHolder} onChange={(event) => setField("billing", "bankAccountHolder", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1885-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1885](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="Bank name" value={draft.billing.bankName} onChange={(event) => setField("billing", "bankName", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1895-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1895](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="Account number" inputMode="numeric" value={draft.billing.bankAccountNumber} onChange={(event) => setField("billing", "bankAccountNumber", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1906-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1906](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="IFSC" value={draft.billing.bankIfsc} onChange={(event) => setField("billing", "bankIfsc", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1916-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1916](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="Bank branch" value={draft.billing.bankBranch} onChange={(event) => setField("billing", "bankBranch", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1926-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1926](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
aria-label="UPI ID" value={draft.billing.upiId} onChange={(event) => setField("billing", "upiId", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1936-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1936](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
type="number" min={0} max={100} value={draft.billing.defaultGstPercent} onChange={(event) => setField( "billing", "defaultGstPercent", Number(event.target.value), ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1952-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1952](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
value={draft.billing.invoicePrefix} onChange={(event) => setField("billing", "invoicePrefix", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1961-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1961](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
value={draft.billing.receiptPrefix} onChange={(event) => setField("billing", "receiptPrefix", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1970-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1970](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
value={draft.billing.gatePassPrefix} onChange={(event) => setField("billing", "gatePassPrefix", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1982-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1982](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "billing"

```tsx
type="checkbox" checked={draft.billing.paymentModes.includes(mode)} onChange={() => toggleListValue("billing", "paymentModes", mode) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-1999-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:1999](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "inventory"

```tsx
value={draft.inventory.defaultUnit} onChange={(event) => setField("inventory", "defaultUnit", event.target.value) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2007-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2007](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "inventory"

```tsx
type="checkbox" checked={draft.inventory.lowStockNotifications} onChange={(event) => setField( "inventory", "lowStockNotifications", event.target.checked, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2021-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2021](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "inventory"

```tsx
type="checkbox" checked={draft.inventory.requireAdjustmentReason} onChange={(event) => setField( "inventory", "requireAdjustmentReason", event.target.checked, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2042-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2042](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "notifications"

```tsx
type="checkbox" checked={draft.notifications.customerChannels.includes( channel, )} onChange={() => toggleListValue( "notifications", "customerChannels", channel, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2062-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2062](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "notifications"

```tsx
value={draft.notifications.documentHeader} onChange={(event) => setField( "notifications", "documentHeader", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2075-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2075](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "notifications"

```tsx
value={draft.notifications.estimateTemplate} onChange={(event) => setField( "notifications", "estimateTemplate", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2088-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2088](../src/admin-console.tsx); tag `input`.

Visibility: subTab === "notifications"

```tsx
value={draft.notifications.invoiceTemplate} onChange={(event) => setField( "notifications", "invoiceTemplate", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2107-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2107](../src/admin-console.tsx); tag `textarea`.

Visibility: subTab === "notifications"

```tsx
rows={3} value={draft.notifications.jobCardCreatedWhatsAppTemplate} onChange={(event) => setField( "notifications", "jobCardCreatedWhatsAppTemplate", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2121-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2121](../src/admin-console.tsx); tag `textarea`.

Visibility: subTab === "notifications"

```tsx
rows={3} value={draft.notifications.jobCardCreatedEmailTemplate} onChange={(event) => setField( "notifications", "jobCardCreatedEmailTemplate", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2135-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2135](../src/admin-console.tsx); tag `textarea`.

Visibility: subTab === "notifications"

```tsx
rows={3} value={draft.notifications.jobCardClosedWhatsAppTemplate} onChange={(event) => setField( "notifications", "jobCardClosedWhatsAppTemplate", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2149-1

Owner `BusinessSettingsTab`; [src/admin-console.tsx:2149](../src/admin-console.tsx); tag `textarea`.

Visibility: subTab === "notifications"

```tsx
rows={3} value={draft.notifications.jobCardClosedEmailTemplate} onChange={(event) => setField( "notifications", "jobCardClosedEmailTemplate", event.target.value, ) }
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2248-1

Owner `CompanyImageField`; [src/admin-console.tsx:2248](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
ref={inputRef} className="visually-hidden" type="file" accept="image/png,image/jpeg" onChange={(event) => choose(event.target.files?.[0])}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2256-1

Owner `CompanyImageField`; [src/admin-console.tsx:2256](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" disabled={!value} onClick={() => { onError(""); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
```

Label/content expression:

```tsx
Clear 
```

#### STATE-admin-console-tsx-2352-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2352](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <div> <h3>Company Settings</h3> <p> Single company profile and images merged into every report template. </p> </div> <div className="action-row"> <button type="button" disabled={!dirty} onClick={reset}> Reset to Saved </button> <button type="button" className="primary-action" disabled={!dirty} onClick={save} > Save Company Settings </button> </div> </div> {error && ( <div className="api-error" role="alert"> <p>{error}</p> </div> )} {savedMessage && !dirty && ( <p className="save-confirmation"> Company settings saved for this session. </p> )} {dirty && <p className="unsaved-note">Unsaved changes.</p>} <label> Company name <input value={companyName} onChange={(event) => { setCompanyName(event.target.value); setSavedMessage(false); }} /> </label> <div className="form-grid"> <label> Address <input value={details.address} onChange={(event) => setDetail("address", event.target.value)} /> </label> <label> Phone <input value={details.phone} onChange={(event) => setDetail("phone", event.target.value)} /> </label> <label> Email <input value={details.email} onChange={(event) => setDetail("email", event.target.value)} /> </label> <label> GSTIN <input value={details.gstin} onChange={(event) => setDetail("gstin", event.target.value)} /> </label> <label> Terms / footer <textarea value={details.footer} onChange={(event) => setDetail("footer", event.target.value)} /> </label> </div> <div className="company-assets-grid"> <CompanyImageField label="Company logo" value={assets.logo} onChange={(next) => changeAsset("logo", next)} onError={setError} /> <CompanyImageField label="Company stamp" value={assets.stamp} onChange={(next) => changeAsset("stamp", next)} onError={setError} /> <CompanyImageField label="Authorized signature" value={assets.authorizedSignature} onChange={(next) => changeAsset("authorizedSignature", next)} onError={setError} /> </div> 
```

#### ACT-admin-console-tsx-2361-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2361](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" disabled={!dirty} onClick={reset}
```

Label/content expression:

```tsx
Reset to Saved 
```

#### ACT-admin-console-tsx-2364-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2364](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" disabled={!dirty} onClick={save}
```

Label/content expression:

```tsx
Save Company Settings 
```

#### STATE-admin-console-tsx-2375-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2375](../src/admin-console.tsx); tag `div`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 <p>{error}</p> 
```

#### ACT-admin-console-tsx-2387-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2387](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={companyName} onChange={(event) => { setCompanyName(event.target.value); setSavedMessage(false); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2398-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2398](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={details.address} onChange={(event) => setDetail("address", event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2405-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2405](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={details.phone} onChange={(event) => setDetail("phone", event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2412-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2412](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={details.email} onChange={(event) => setDetail("email", event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2419-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2419](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={details.gstin} onChange={(event) => setDetail("gstin", event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2426-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2426](../src/admin-console.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={details.footer} onChange={(event) => setDetail("footer", event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2433-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2433](../src/admin-console.tsx); tag `CompanyImageField`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Company logo" value={assets.logo} onChange={(next) => changeAsset("logo", next)} onError={setError}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2439-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2439](../src/admin-console.tsx); tag `CompanyImageField`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Company stamp" value={assets.stamp} onChange={(next) => changeAsset("stamp", next)} onError={setError}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2445-1

Owner `CompanySettingsTab`; [src/admin-console.tsx:2445](../src/admin-console.tsx); tag `CompanyImageField`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Authorized signature" value={assets.authorizedSignature} onChange={(next) => changeAsset("authorizedSignature", next)} onError={setError}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-2617-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2617](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel report-template-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <div> <h3>Report Templates</h3> <p> Design sanitized print layouts using the supported placeholders. </p> </div> <div className="action-row"> <button type="button" onClick={() => { if (confirmDiscard()) load(null); }} > New Template </button> <button type="button" disabled={!selectedId} onClick={remove}> Delete Template </button> <button type="button" className="primary-action" disabled={!dirty} onClick={save} > {selectedId ? "Update Template" : "Create Template"} </button> </div> </div> {errors.length > 0 && ( <div className="api-error" role="alert"> {errors.map((message) => ( <p key={message}>{message}</p> ))} </div> )} {justSaved && !dirty && ( <p className="save-confirmation">Template saved for this session.</p> )} {dirty && <p className="unsaved-note">Unsaved changes.</p>} <div className="template-selectors form-grid"> <label> Report category <select aria-label="Report category" value={category} onChange={(event) => changeCategory(event.target.value as ReportCategory) } > {REPORT_CATEGORIES.map((item) => ( <option key={item} value={item}> {REPORT_CATEGORY_LABELS[item]} </option> ))} </select> </label> <label> Template <select aria-label="Report template" value={selectedId ?? ""} onChange={(event) => { if (confirmDiscard()) load(event.target.value \|\| null); }} > <option value="">New unsaved template</option> {categoryTemplates.map((template) => ( <option key={template.id} value={template.id}> {template.name} {template.active ? " (Active)" : ""} </option> ))} </select> </label> <label> Template name <input aria-label="Template name" value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }); setJustSaved(false); }} /> </label> <label className="template-active"> <input type="checkbox" checked={draft.active} onChange={(event) => { if (draft.active && !event.target.checked) { setErrors([ "Activate another template before deactivating the current template.", ]); return; } setDraft({ ...draft, active: event.target.checked }); setErrors([]); setJustSaved(false); }} />{" "} Active template </label> </div> <div className="template-workspace"> <div className="template-editor-column"> <strong>Template HTML</strong> <CodeMirror className="template-html-editor" value={draft.html} height="460px" basicSetup={{ lineNumbers: true, foldGutter: false }} extensions={[ htmlLanguage(), EditorView.lineWrapping, EditorView.contentAttributes.of({ "aria-label": "Template HTML", }), ]} onChange={(next) => { setDraft((current) => ({ ...current, html: next })); setJustSaved(false); }} /> </div> <div className="template-preview-column"> <strong>Live preview (sandboxed)</strong> {unsupported.length ? ( <div className="api-error" role="alert"> <p> Preview unavailable until unsupported placeholders are removed. </p> </div> ) : ( <iframe className="template-preview" title={`${REPORT_CATEGORY_LABELS[category]} template preview`} sandbox="" srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}*{box-sizing:border-box}</style></head><body>${preview}</body></html>`} /> )} </div> <aside className="placeholder-registry"> <h4>Allowed placeholders</h4> <p> Insert a placeholder exactly as shown. Blocks generate safe report tables or configured images. </p> {REPORT_PLACEHOLDERS[category].map((name) => ( <code key={name}>{`{{${name}}}`}</code> ))} <h4>Line loop</h4> <code>{"{{#lines}} ... {{/lines}}"}</code> {LINE_PLACEHOLDERS.map((name) => ( <code key={name}>{`{{${name}}}`}</code> ))} {unsupported.length > 0 && ( <div className="api-error" role="alert"> <strong>Unsupported</strong> {unsupported.map((name) => ( <p key={name}>{name}</p> ))} </div> )} </aside> </div> 
```

#### ACT-admin-console-tsx-2626-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2626](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={() => { if (confirmDiscard()) load(null); }}
```

Label/content expression:

```tsx
New Template 
```

#### ACT-admin-console-tsx-2634-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2634](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" disabled={!selectedId} onClick={remove}
```

Label/content expression:

```tsx
Delete Template 
```

#### ACT-admin-console-tsx-2637-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2637](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" disabled={!dirty} onClick={save}
```

Label/content expression:

```tsx
 {selectedId ? "Update Template" : "Create Template"} 
```

#### STATE-admin-console-tsx-2648-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2648](../src/admin-console.tsx); tag `div`.

Visibility: errors.length > 0

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 {errors.map((message) => ( <p key={message}>{message}</p> ))} 
```

#### ACT-admin-console-tsx-2661-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2661](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Report category" value={category} onChange={(event) => changeCategory(event.target.value as ReportCategory) }
```

Label/content expression:

```tsx
 {REPORT_CATEGORIES.map((item) => ( <option key={item} value={item}> {REPORT_CATEGORY_LABELS[item]} </option> ))} 
```

#### ACT-admin-console-tsx-2677-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2677](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Report template" value={selectedId ?? ""} onChange={(event) => { if (confirmDiscard()) load(event.target.value \|\| null); }}
```

Label/content expression:

```tsx
 <option value="">New unsaved template</option> {categoryTemplates.map((template) => ( <option key={template.id} value={template.id}> {template.name} {template.active ? " (Active)" : ""} </option> ))} 
```

#### ACT-admin-console-tsx-2695-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2695](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Template name" value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }); setJustSaved(false); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2705-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2705](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="checkbox" checked={draft.active} onChange={(event) => { if (draft.active && !event.target.checked) { setErrors([ "Activate another template before deactivating the current template.", ]); return; } setDraft({ ...draft, active: event.target.checked }); setErrors([]); setJustSaved(false); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2726-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2726](../src/admin-console.tsx); tag `CodeMirror`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="template-html-editor" value={draft.html} height="460px" basicSetup={{ lineNumbers: true, foldGutter: false }} extensions={[ htmlLanguage(), EditorView.lineWrapping, EditorView.contentAttributes.of({ "aria-label": "Template HTML", }), ]} onChange={(next) => { setDraft((current) => ({ ...current, html: next })); setJustSaved(false); }}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-2747-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2747](../src/admin-console.tsx); tag `div`.

Visibility: unsupported.length

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 <p> Preview unavailable until unsupported placeholders are removed. </p> 
```

#### STATE-admin-console-tsx-2776-1

Owner `ReportTemplatesTab`; [src/admin-console.tsx:2776](../src/admin-console.tsx); tag `div`.

Visibility: unsupported.length > 0

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
 <strong>Unsupported</strong> {unsupported.map((name) => ( <p key={name}>{name}</p> ))} 
```

#### STATE-admin-console-tsx-2937-1

Owner `InventoryImportTab`; [src/admin-console.tsx:2937](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Inventory Import</h3> <span> Step {step} of 4 · session-only, never touches the persisted inventory </span> </div> <div className="wizard-steps"> {["Upload", "Map Columns", "Validate & Preview", "Confirm"].map( (label, index) => ( <span key={label} className={`wizard-step${step === index + 1 ? " active" : ""}${step > index + 1 ? " done" : ""}`} > {index + 1}. {label} </span> ), )} </div> {step === 1 && ( <div className="desk-panel"> <p> Upload a CSV or XLSX file with your opening inventory, or start from the WorkshopOS template. </p> <div className="action-row"> <label className="primary-action file-upload-button"> Choose File <input type="file" accept=".csv,.xlsx,.xls" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFileChosen(file); event.target.value = ""; }} hidden /> </label> <button onClick={downloadTemplate}>Download Template</button> </div> {uploadError && <p className="error-text">{uploadError}</p>} </div> )} {step === 2 && parsed && ( <div className="desk-panel"> <p> Mapped from <strong>{fileName}</strong> ({parsed.rows.length} rows). Adjust any column below. </p> <div className="form-grid"> {INVENTORY_IMPORT_FIELDS.map((field: InventoryImportField) => ( <label key={field}> {INVENTORY_TEMPLATE_HEADERS[field]} <select value={mapping[field] ?? ""} onChange={(event) => setMapping((prev) => ({ ...prev, [field]: event.target.value \|\| undefined, })) } > <option value="">Not mapped</option> {parsed.headers.map((header) => ( <option key={header} value={header}> {header} </option> ))} </select> </label> ))} </div> <div className="action-row"> <button onClick={() => setStep(1)}>Back</button> <button className="primary-action" onClick={runValidation}> Validate &amp; Preview </button> </div> </div> )} {step === 3 && preview && ( <div className="desk-panel"> {preview.mappingIssues.length > 0 ? ( <> <p className="error-text"> Fix the column mapping before continuing: </p> <ul> {preview.mappingIssues.map((issue) => ( <li key={`${issue.field}-${issue.code}`}>{issue.message}</li> ))} </ul> <button onClick={() => setStep(2)}>Back to Mapping</button> </> ) : ( <> <div className="linked-grid"> <Info label="Total rows" value={preview.totalRows} /> <Info label="Valid rows" value={preview.validRows.length} /> <Info label="Rejected rows" value={preview.rejectedRows.length} /> </div> <h4>Valid rows (first 10)</h4> <div className="table-wrap"> <table> <thead> <tr> <th>SKU</th> <th>Name</th> <th>Category</th> <th>Unit</th> <th>Opening Qty</th> <th>Low-stock</th> </tr> </thead> <tbody> {preview.validRows.slice(0, 10).map((row) => ( <tr key={row.sourceRowNumber}> <td>{row.item.sku}</td> <td>{row.item.name}</td> <td>{row.item.category}</td> <td>{row.item.unit}</td> <td>{row.item.stock_qty}</td> <td>{row.item.low_stock_qty}</td> </tr> ))} </tbody> </table> </div> {preview.rejectedRows.length > 0 && ( <> <div className="panel-actions"> <h4>Rejected rows</h4> <DownloadMenu report={{ title: "Rejected Inventory Import Rows", filters: [`File: ${fileName}`], columns: rejectedColumns, rows: preview.rejectedRows, }} /> </div> <div className="table-wrap"> <table> <thead> <tr> <th>Row</th> <th>SKU</th> <th>Name</th> <th>Issues</th> </tr> </thead> <tbody> {preview.rejectedRows.slice(0, 20).map((row) => ( <tr key={row.sourceRowNumber}> <td>{row.sourceRowNumber}</td> <td>{row.normalized.sku}</td> <td>{row.normalized.name}</td> <td> {row.issues .map((issue) => issue.message) .join("; ")} </td> </tr> ))} </tbody> </table> </div> </> )} <div className="action-row"> <button onClick={() => setStep(2)}>Back</button> <button className="primary-action" disabled={preview.validRows.length === 0} onClick={confirmImport} > Confirm Import </button> </div> </> )} </div> )} {step === 4 && result && ( <div className="desk-panel"> <PanelTitle icon={<FileSpreadsheet />} title="Import complete" subtitle={`Batch ${result.batchId}`} /> <div className="linked-grid"> <Info label="Total rows" value={result.total} /> <Info label="Imported" value={result.accepted} /> <Info label="Rejected" value={result.rejected} /> </div> <p> Imported rows are merged into Stock presentation data for this session only. </p> <button className="primary-action" onClick={resetWizard}> Start New Import </button> </div> )} 
```

#### ACT-admin-console-tsx-2966-1

Owner `InventoryImportTab`; [src/admin-console.tsx:2966](../src/admin-console.tsx); tag `input`.

Visibility: step === 1

```tsx
type="file" accept=".csv,.xlsx,.xls" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFileChosen(file); event.target.value = ""; }} hidden
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-2977-1

Owner `InventoryImportTab`; [src/admin-console.tsx:2977](../src/admin-console.tsx); tag `button`.

Visibility: step === 1

```tsx
onClick={downloadTemplate}
```

Label/content expression:

```tsx
Download Template
```

#### ACT-admin-console-tsx-2993-1

Owner `InventoryImportTab`; [src/admin-console.tsx:2993](../src/admin-console.tsx); tag `select`.

Visibility: step === 2 && parsed

```tsx
value={mapping[field] ?? ""} onChange={(event) => setMapping((prev) => ({ ...prev, [field]: event.target.value \|\| undefined, })) }
```

Label/content expression:

```tsx
 <option value="">Not mapped</option> {parsed.headers.map((header) => ( <option key={header} value={header}> {header} </option> ))} 
```

#### ACT-admin-console-tsx-3013-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3013](../src/admin-console.tsx); tag `button`.

Visibility: step === 2 && parsed

```tsx
onClick={() => setStep(1)}
```

Label/content expression:

```tsx
Back
```

#### ACT-admin-console-tsx-3014-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3014](../src/admin-console.tsx); tag `button`.

Visibility: step === 2 && parsed

```tsx
className="primary-action" onClick={runValidation}
```

Label/content expression:

```tsx
Validate &amp; Preview 
```

#### ACT-admin-console-tsx-3033-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3033](../src/admin-console.tsx); tag `button`.

Visibility: preview.mappingIssues.length > 0; step === 3 && preview

```tsx
onClick={() => setStep(2)}
```

Label/content expression:

```tsx
Back to Mapping
```

#### ACT-admin-console-tsx-3076-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3076](../src/admin-console.tsx); tag `DownloadMenu`.

Visibility: preview.rejectedRows.length > 0; preview.mappingIssues.length > 0; step === 3 && preview

```tsx
report={{ title: "Rejected Inventory Import Rows", filters: [`File: ${fileName}`], columns: rejectedColumns, rows: preview.rejectedRows, }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3114-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3114](../src/admin-console.tsx); tag `button`.

Visibility: preview.mappingIssues.length > 0; step === 3 && preview

```tsx
onClick={() => setStep(2)}
```

Label/content expression:

```tsx
Back
```

#### ACT-admin-console-tsx-3115-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3115](../src/admin-console.tsx); tag `button`.

Visibility: preview.mappingIssues.length > 0; step === 3 && preview

```tsx
className="primary-action" disabled={preview.validRows.length === 0} onClick={confirmImport}
```

Label/content expression:

```tsx
Confirm Import 
```

#### ACT-admin-console-tsx-3144-1

Owner `InventoryImportTab`; [src/admin-console.tsx:3144](../src/admin-console.tsx); tag `button`.

Visibility: step === 4 && result

```tsx
className="primary-action" onClick={resetWizard}
```

Label/content expression:

```tsx
Start New Import 
```

#### ACT-admin-console-tsx-3192-1

Owner `LogTable`; [src/admin-console.tsx:3192](../src/admin-console.tsx); tag `tr`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={log.id} className="clickable-row" onClick={() => onSelect(log)}
```

Label/content expression:

```tsx
 <td>{new Date(log.timestamp).toLocaleString("en-IN")}</td> <td> <span className={`status ${log.level}`}>{log.level}</span> </td> <td>{log.area}</td> <td>{log.feature}</td> <td>{log.message}</td> <td>{log.userName ?? "Unavailable"}</td> <td>{log.referenceId ?? "Unavailable"}</td> 
```

#### STATE-admin-console-tsx-3278-1

Owner `LogsPanel`; [src/admin-console.tsx:3278](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search logs" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Message, area, feature, user or reference" /> </label> <label> Date from <input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} /> </label> <label> Date to <input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} /> </label> <label> Level <select value={level} onChange={(event) => { setLevel(event.target.value); setPage(1); }} > <option value="ALL">All levels</option> {LOG_LEVELS.map((item) => ( <option key={item} value={item}> {item} </option> ))} </select> </label> <label> Area <select value={area} onChange={(event) => { setArea(event.target.value); setPage(1); }} > <option value="ALL">All areas</option> {areas.map((item) => ( <option key={item} value={item}> {item} </option> ))} </select> </label> <ListSearchActions onClear={clearFilters} /> </div> <PaginationToolbar controls={ <> <DownloadMenu report={{ title: stream === "operational" ? "Daily Operational Logs" : "Feature Activity", filters: activeFilterSummary({ Search: search.trim(), Level: level, Area: area, "Date from": dateFrom, "Date to": dateTo, }), columns, rows: filtered, }} /> <button className="danger-action" onClick={clear} disabled={streamLogs.length === 0} > Clear Logs </button> </> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Log records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <LogTable logs={paged.items} onSelect={setSelected} /> <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> {selected && ( <Dialog title="Log detail" subtitle={new Date(selected.timestamp).toLocaleString("en-IN")} onClose={() => setSelected(undefined)} > <div className="linked-grid"> <Info label="Level" value={selected.level} /> <Info label="Area" value={selected.area} /> <Info label="Feature" value={selected.feature} /> <Info label="User" value={selected.userName ?? "Unavailable"} /> <Info label="Reference" value={selected.referenceId ?? "Unavailable"} /> </div> <p>{selected.message}</p> {selected.details && ( <pre className="log-details"> {JSON.stringify(selected.details, null, 2)} </pre> )} </Dialog> )} 
```

#### ACT-admin-console-tsx-3282-1

Owner `LogsPanel`; [src/admin-console.tsx:3282](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search logs" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Message, area, feature, user or reference"
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3294-1

Owner `LogsPanel`; [src/admin-console.tsx:3294](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3305-1

Owner `LogsPanel`; [src/admin-console.tsx:3305](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3316-1

Owner `LogsPanel`; [src/admin-console.tsx:3316](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={level} onChange={(event) => { setLevel(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All levels</option> {LOG_LEVELS.map((item) => ( <option key={item} value={item}> {item} </option> ))} 
```

#### ACT-admin-console-tsx-3333-1

Owner `LogsPanel`; [src/admin-console.tsx:3333](../src/admin-console.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={area} onChange={(event) => { setArea(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
 <option value="ALL">All areas</option> {areas.map((item) => ( <option key={item} value={item}> {item} </option> ))} 
```

#### ACT-admin-console-tsx-3348-1

Owner `LogsPanel`; [src/admin-console.tsx:3348](../src/admin-console.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3350-1

Owner `LogsPanel`; [src/admin-console.tsx:3350](../src/admin-console.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={ <> <DownloadMenu report={{ title: stream === "operational" ? "Daily Operational Logs" : "Feature Activity", filters: activeFilterSummary({ Search: search.trim(), Level: level, Area: area, "Date from": dateFrom, "Date to": dateTo, }), columns, rows: filtered, }} /> <button className="danger-action" onClick={clear} disabled={streamLogs.length === 0} > Clear Logs </button> </> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Log records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3353-1

Owner `LogsPanel`; [src/admin-console.tsx:3353](../src/admin-console.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: stream === "operational" ? "Daily Operational Logs" : "Feature Activity", filters: activeFilterSummary({ Search: search.trim(), Level: level, Area: area, "Date from": dateFrom, "Date to": dateTo, }), columns, rows: filtered, }}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3370-1

Owner `LogsPanel`; [src/admin-console.tsx:3370](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" onClick={clear} disabled={streamLogs.length === 0}
```

Label/content expression:

```tsx
Clear Logs 
```

#### ACT-admin-console-tsx-3392-1

Owner `LogsPanel`; [src/admin-console.tsx:3392](../src/admin-console.tsx); tag `LogTable`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
logs={paged.items} onSelect={setSelected}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3393-1

Owner `LogsPanel`; [src/admin-console.tsx:3393](../src/admin-console.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### STATE-admin-console-tsx-3399-1

Owner `LogsPanel`; [src/admin-console.tsx:3399](../src/admin-console.tsx); tag `Dialog`.

Visibility: selected

```tsx
title="Log detail" subtitle={new Date(selected.timestamp).toLocaleString("en-IN")} onClose={() => setSelected(undefined)}
```

Label/content expression:

```tsx
 <div className="linked-grid"> <Info label="Level" value={selected.level} /> <Info label="Area" value={selected.area} /> <Info label="Feature" value={selected.feature} /> <Info label="User" value={selected.userName ?? "Unavailable"} /> <Info label="Reference" value={selected.referenceId ?? "Unavailable"} /> </div> <p>{selected.message}</p> {selected.details && ( <pre className="log-details"> {JSON.stringify(selected.details, null, 2)} </pre> )} 
```

#### STATE-admin-console-tsx-3456-1

Owner `RetentionSettingsPanel`; [src/admin-console.tsx:3456](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <p> This is demo operational visibility, not a production observability or compliance audit trail. </p> <div className="form-grid"> <label> Operational / error log retention (days) <input type="number" min={1} value={operationalDays} onChange={(event) => setOperationalDays(Number(event.target.value))} /> </label> <label> Feature activity retention (days) <input type="number" min={1} value={featureDays} onChange={(event) => setFeatureDays(Number(event.target.value))} /> </label> </div> <div className="action-row"> <button disabled={!dirty} onClick={() => { setOperationalDays( adminState.businessSettings.logRetention.operationalDays, ); setFeatureDays( adminState.businessSettings.logRetention.featureDays, ); }} > Reset to Saved </button> <button className="primary-action" disabled={!dirty \|\| operationalDays < 1 \|\| featureDays < 1} onClick={() => commit( (current) => updateBusinessSettings(current, { logRetention: { operationalDays, featureDays }, }), { stream: "feature", level: "info", area: "Administration", feature: "Support & Logs", message: "Log retention settings updated", userId: String(actingUser.id), userName: actingUser.name, }, ) } > Save Retention Settings </button> </div> 
```

#### ACT-admin-console-tsx-3464-1

Owner `RetentionSettingsPanel`; [src/admin-console.tsx:3464](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" min={1} value={operationalDays} onChange={(event) => setOperationalDays(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3473-1

Owner `RetentionSettingsPanel`; [src/admin-console.tsx:3473](../src/admin-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" min={1} value={featureDays} onChange={(event) => setFeatureDays(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-admin-console-tsx-3482-1

Owner `RetentionSettingsPanel`; [src/admin-console.tsx:3482](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={!dirty} onClick={() => { setOperationalDays( adminState.businessSettings.logRetention.operationalDays, ); setFeatureDays( adminState.businessSettings.logRetention.featureDays, ); }}
```

Label/content expression:

```tsx
Reset to Saved 
```

#### ACT-admin-console-tsx-3495-1

Owner `RetentionSettingsPanel`; [src/admin-console.tsx:3495](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" disabled={!dirty \|\| operationalDays < 1 \|\| featureDays < 1} onClick={() => commit( (current) => updateBusinessSettings(current, { logRetention: { operationalDays, featureDays }, }), { stream: "feature", level: "info", area: "Administration", feature: "Support & Logs", message: "Log retention settings updated", userId: String(actingUser.id), userName: actingUser.name, }, ) }
```

Label/content expression:

```tsx
Save Retention Settings 
```

#### STATE-admin-console-tsx-3539-1

Owner `SupportLogsTab`; [src/admin-console.tsx:3539](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="manager-panel" role="tabpanel"
```

Label/content expression:

```tsx
 <div className="panel-actions"> <h3>Support &amp; Logs</h3> <button onClick={refresh}>Refresh</button> </div> <div className="sub-tabs" role="tablist" aria-label="Support and logs sections" > {SUPPORT_SUB_TABS.map((item) => ( <button key={item} role="tab" aria-selected={subTab === item} className={subTab === item ? "active" : ""} onClick={() => setSubTab(item)} > {item} </button> ))} </div> {subTab === "Daily Operational Logs" && ( <LogsPanel adminState={adminState} stream="operational" commit={commit} /> )} {subTab === "Feature Activity" && ( <LogsPanel adminState={adminState} stream="feature" commit={commit} /> )} {subTab === "Retention Settings" && ( <RetentionSettingsPanel adminState={adminState} commit={commit} actingUser={actingUser} /> )} 
```

#### ACT-admin-console-tsx-3542-1

Owner `SupportLogsTab`; [src/admin-console.tsx:3542](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={refresh}
```

Label/content expression:

```tsx
Refresh
```

#### STATE-admin-console-tsx-3544-1

Owner `SupportLogsTab`; [src/admin-console.tsx:3544](../src/admin-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="sub-tabs" role="tablist" aria-label="Support and logs sections"
```

Label/content expression:

```tsx
 {SUPPORT_SUB_TABS.map((item) => ( <button key={item} role="tab" aria-selected={subTab === item} className={subTab === item ? "active" : ""} onClick={() => setSubTab(item)} > {item} </button> ))} 
```

#### STATE-admin-console-tsx-3550-1

Owner `SupportLogsTab`; [src/admin-console.tsx:3550](../src/admin-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={item} role="tab" aria-selected={subTab === item} className={subTab === item ? "active" : ""} onClick={() => setSubTab(item)}
```

Label/content expression:

```tsx
 {item} 
```

### src/billing-manager.tsx

#### STATE-billing-manager-tsx-154-1

Owner `BillingManager`; [src/billing-manager.tsx:154](../src/billing-manager.tsx); tag `section`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={panel ? "workspace single-panel" : "billing-manager"} data-billing-manager={mode} role="tabpanel"
```

Label/content expression:

```tsx
 <div className={panel ? "desk-panel" : "manager-panel"} role={panel ? undefined : "tabpanel"}> {pendingInvoicesOnly && <div className="panel-actions"><div><h2>Ready To Invoice</h2><p>Active invoices awaiting payment. View or download invoices from this read-only queue.</p></div></div>} {panel && !compactAccountsPanel && <> <div className="panel-actions"><div><h2>{mode}</h2><p>{mode === "Payments" ? "Paid invoices with downloadable receipts" : "All workshop jobs"}</p></div></div> {actor.role === "accounts" && <p className="permission-note">Invoices are view/download-only. Use Quick Mark Paid to complete the handover.</p>} {actor.role === "accounts" && <AccountsReconciliationQueues jobs={state.jobs} />} {!editable && actor.role !== "accounts" && <p className="permission-note">Read-only billing access.</p>} {inline && <p className="permission-note" role="note">Click a row for lines, GST and totals.{manage ? "" : " Create or edit invoices from the Job Card."}</p>} </>} {manage && <> {pickedJob && <div className="action-row"><span className="result-summary">{pickedJob.invoice ? `${pickedJob.invoice.invoice_no} · ${invoiceStatus(pickedJob)}` : "No invoice yet"}</span> {pickedJob.invoice ? <><button onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}>View Invoice</button>{canEditInvoice(actor, pickedJob.job) && pickedJob.invoice.status === "Pending" && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}>Edit Invoice</button>}</> : canCreateInvoice(actor, pickedJob.job) && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}>Create Invoice</button>}</div>}</>} <div className="store-filter-grid billing-panel-filter-grid"> <label className="list-search">Search<input aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, invoice, customer, vehicle or reference" /></label> <label>Month-Year<select aria-label={`${mode} Month-Year filter`} value={eventMonth} onChange={(event) => { setEventMonth(event.target.value); setPage(1); }}><option value="ALL">All months</option>{availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}</select></label> {showStatusFilter && <label>Status<select aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All</option>{statusOptions.map((value) => <option key={value}>{value}</option>)}</select></label>} {showPaymentModeFilter && <label>Payment mode<select aria-label="Payment mode filter" value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value as "ALL" \| PaymentMode); setPage(1); }}><option value="ALL">All</option>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as PaymentMode[]).map((value) => <option key={value}>{value}</option>)}</select></label>} <ListSearchActions onClear={clear} /> </div> <PaginationToolbar controls={<DownloadMenu report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${mode} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <div className="table-wrap"><table aria-label={`${mode} manager`}><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}<th>Actions</th></tr></thead><tbody>{paged.items.map((record) => { const open = expanded === record.key; const quickPay = !pendingInvoicesOnly && mode === "Invoices" && record.view.invoice?.status === "Pending" && canRecordOrVoidPayment(actor, record.view.job); const highlightClass = accountsRowHighlight(mode, record, compactAccountsPanel); return <Fragment key={record.key}> <tr className={[record.kind === "void" ? "billing-row-void" : "", highlightClass, inline ? "billing-row-click" : ""].filter(Boolean).join(" ") \|\| undefined} {...(inline ? { tabIndex: 0, "aria-expanded": open, "aria-controls": `billing-detail-${record.key}`, onClick: () => toggle(record.key), onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => { if (event.target === event.currentTarget && (event.key === "Enter" \|\| event.key === " ")) { event.preventDefault(); toggle(record.key); } } } : {})}>{columns.map((column) => <td key={column.header}>{String(column.value(record))}</td>)}<td><div className="grid-actions billing-table-actions"> {mode === "Invoices" && <><button type="button" className="billing-table-action" onClick={(event) => { event.stopPropagation(); setInvoiceDialog({ action: "view", view: record.view }); }}><Eye size={15} />View</button><DocumentDownloadButton kind="invoice" view={record.view} label="Download" className="billing-table-action" />{quickPay && <button type="button" className="billing-table-action billing-table-action-primary" onClick={(event) => { event.stopPropagation(); setPaymentDialog(record.view); }}><Check size={15} />Quick Mark Paid</button>}</>} {mode === "Payments" && record.payment && <DocumentDownloadButton kind="payment-receipt" view={record.view} label="Receipt" className="billing-table-action" />} {mode === "Delivery" && <DocumentDownloadButton kind="gate-pass" view={record.view} label="Gate pass" className="billing-table-action" />} </div></td></tr> {inline && open && <tr className="billing-detail-row"><td colSpan={columns.length + 1} id={`billing-detail-${record.key}`}><BillingDetail record={record} actor={actor} mutate={mutate} readOnly={pendingInvoicesOnly} /></td></tr>} </Fragment>; })}</tbody></table></div> {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><FilterClearButton onClick={clear} label="Clear filters" /></div>} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> {invoiceDialog && <InvoiceDialog action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)} />} {paymentDialog?.invoice && <PaymentDialog view={paymentDialog} actor={actor} mutate={mutate} onClose={() => setPaymentDialog(undefined)} />} </div> 
```

#### ACT-billing-manager-tsx-166-1

Owner `BillingManager`; [src/billing-manager.tsx:166](../src/billing-manager.tsx); tag `button`.

Visibility: pickedJob.invoice; pickedJob; manage

```tsx
onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}
```

Label/content expression:

```tsx
View Invoice
```

#### ACT-billing-manager-tsx-166-2

Owner `BillingManager`; [src/billing-manager.tsx:166](../src/billing-manager.tsx); tag `button`.

Visibility: canEditInvoice(actor, pickedJob.job) && pickedJob.invoice.status === "Pending"; pickedJob.invoice; pickedJob; manage

```tsx
className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}
```

Label/content expression:

```tsx
Edit Invoice
```

#### ACT-billing-manager-tsx-166-3

Owner `BillingManager`; [src/billing-manager.tsx:166](../src/billing-manager.tsx); tag `button`.

Visibility: canCreateInvoice(actor, pickedJob.job); pickedJob.invoice; pickedJob; manage

```tsx
className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}
```

Label/content expression:

```tsx
Create Invoice
```

#### ACT-billing-manager-tsx-168-1

Owner `BillingManager`; [src/billing-manager.tsx:168](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, invoice, customer, vehicle or reference"
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-169-1

Owner `BillingManager`; [src/billing-manager.tsx:169](../src/billing-manager.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`${mode} Month-Year filter`} value={eventMonth} onChange={(event) => { setEventMonth(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
<option value="ALL">All months</option> {availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}
```

#### ACT-billing-manager-tsx-170-1

Owner `BillingManager`; [src/billing-manager.tsx:170](../src/billing-manager.tsx); tag `select`.

Visibility: showStatusFilter

```tsx
aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}
```

Label/content expression:

```tsx
<option value="ALL">All</option> {statusOptions.map((value) => <option key={value}>{value}</option>)}
```

#### ACT-billing-manager-tsx-171-1

Owner `BillingManager`; [src/billing-manager.tsx:171](../src/billing-manager.tsx); tag `select`.

Visibility: showPaymentModeFilter

```tsx
aria-label="Payment mode filter" value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value as "ALL" \| PaymentMode); setPage(1); }}
```

Label/content expression:

```tsx
<option value="ALL">All</option> {(["UPI", "Cash", "Card", "Bank transfer", "Other"] as PaymentMode[]).map((value) => <option key={value}>{value}</option>)}
```

#### ACT-billing-manager-tsx-172-1

Owner `BillingManager`; [src/billing-manager.tsx:172](../src/billing-manager.tsx); tag `ListSearchActions`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClear={clear}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-174-1

Owner `BillingManager`; [src/billing-manager.tsx:174](../src/billing-manager.tsx); tag `PaginationToolbar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
controls={<DownloadMenu report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${mode} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-174-2

Owner `BillingManager`; [src/billing-manager.tsx:174](../src/billing-manager.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-181-1

Owner `BillingManager`; [src/billing-manager.tsx:181](../src/billing-manager.tsx); tag `button`.

Visibility: mode === "Invoices"

```tsx
type="button" className="billing-table-action" onClick={(event) => { event.stopPropagation(); setInvoiceDialog({ action: "view", view: record.view }); }}
```

Label/content expression:

```tsx
<Eye size={15} /> View
```

#### ACT-billing-manager-tsx-181-2

Owner `BillingManager`; [src/billing-manager.tsx:181](../src/billing-manager.tsx); tag `DocumentDownloadButton`.

Visibility: mode === "Invoices"

```tsx
kind="invoice" view={record.view} label="Download" className="billing-table-action"
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-181-3

Owner `BillingManager`; [src/billing-manager.tsx:181](../src/billing-manager.tsx); tag `button`.

Visibility: quickPay; mode === "Invoices"

```tsx
type="button" className="billing-table-action billing-table-action-primary" onClick={(event) => { event.stopPropagation(); setPaymentDialog(record.view); }}
```

Label/content expression:

```tsx
<Check size={15} /> Quick Mark Paid
```

#### ACT-billing-manager-tsx-182-1

Owner `BillingManager`; [src/billing-manager.tsx:182](../src/billing-manager.tsx); tag `DocumentDownloadButton`.

Visibility: mode === "Payments" && record.payment

```tsx
kind="payment-receipt" view={record.view} label="Receipt" className="billing-table-action"
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-183-1

Owner `BillingManager`; [src/billing-manager.tsx:183](../src/billing-manager.tsx); tag `DocumentDownloadButton`.

Visibility: mode === "Delivery"

```tsx
kind="gate-pass" view={record.view} label="Gate pass" className="billing-table-action"
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-188-1

Owner `BillingManager`; [src/billing-manager.tsx:188](../src/billing-manager.tsx); tag `FilterClearButton`.

Visibility: paged.totalCount === 0

```tsx
onClick={clear} label="Clear filters"
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-189-1

Owner `BillingManager`; [src/billing-manager.tsx:189](../src/billing-manager.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={paged.page} pageCount={paged.pageCount} onChange={setPage}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-190-1

Owner `BillingManager`; [src/billing-manager.tsx:190](../src/billing-manager.tsx); tag `InvoiceDialog`.

Visibility: invoiceDialog

```tsx
action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-191-1

Owner `BillingManager`; [src/billing-manager.tsx:191](../src/billing-manager.tsx); tag `PaymentDialog`.

Visibility: paymentDialog?.invoice

```tsx
view={paymentDialog} actor={actor} mutate={mutate} onClose={() => setPaymentDialog(undefined)}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-227-1

Owner `BillingDetail`; [src/billing-manager.tsx:227](../src/billing-manager.tsx); tag `InlineVoid`.

Visibility: !readOnly && payment && !payment.voided_at && actor.role === "admin"

```tsx
label="Void Payment" hint="Voiding reopens the Invoice and voids the Receipt." onVoid={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} mutate={mutate}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-228-1

Owner `BillingDetail`; [src/billing-manager.tsx:228](../src/billing-manager.tsx); tag `InlineVoid`.

Visibility: !readOnly && !payment && invoice && actor.role === "admin" && canVoidCurrentInvoice(actor, view)

```tsx
label="Void Invoice" hint="Voiding unlocks the material rows this invoice billed." onVoid={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} mutate={mutate}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-236-1

Owner `InlineVoid`; [src/billing-manager.tsx:236](../src/billing-manager.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="danger-action" onClick={() => setOpen(true)}
```

Label/content expression:

```tsx
{label}
```

#### FORM-billing-manager-tsx-243-1

Owner `InlineVoid`; [src/billing-manager.tsx:243](../src/billing-manager.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="billing-dialog-form" onSubmit={submit} aria-label={label}
```

Label/content expression:

```tsx
 <p className="permission-note">{hint}</p> <label>Void reason<textarea aria-label={`${label} reason`} required value={reason} onChange={(event) => setReason(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} <div className="action-row"><button type="button" onClick={() => { setOpen(false); setReason(""); setError(""); }}>Cancel</button><button type="submit" className="danger-action">Confirm {label}</button></div> 
```

#### ACT-billing-manager-tsx-245-1

Owner `InlineVoid`; [src/billing-manager.tsx:245](../src/billing-manager.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`${label} reason`} required value={reason} onChange={(event) => setReason(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-billing-manager-tsx-246-1

Owner `InlineVoid`; [src/billing-manager.tsx:246](../src/billing-manager.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-billing-manager-tsx-247-1

Owner `InlineVoid`; [src/billing-manager.tsx:247](../src/billing-manager.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={() => { setOpen(false); setReason(""); setError(""); }}
```

Label/content expression:

```tsx
Cancel
```

#### ACT-billing-manager-tsx-247-2

Owner `InlineVoid`; [src/billing-manager.tsx:247](../src/billing-manager.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="submit" className="danger-action"
```

Label/content expression:

```tsx
Confirm {label}
```

#### FORM-billing-manager-tsx-263-1

Owner `RecordPaymentForm`; [src/billing-manager.tsx:263](../src/billing-manager.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="billing-dialog-form" onSubmit={record} aria-label="Quick mark paid"
```

Label/content expression:

```tsx
 <div className="form-grid"><label>Amount<input aria-label="Payment amount" value={money(invoice.total)} disabled readOnly /></label><label>Mode<select aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>{mode === "Other" && <label>Other detail<input aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)} /></label>}<label>Reference (optional)<input aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)} /></label></div> <label>Notes (optional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} <div className="action-row"><button type="submit" className="primary-action">Confirm Payment</button></div> 
```

#### ACT-billing-manager-tsx-264-1

Owner `RecordPaymentForm`; [src/billing-manager.tsx:264](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Payment amount" value={money(invoice.total)} disabled readOnly
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-264-2

Owner `RecordPaymentForm`; [src/billing-manager.tsx:264](../src/billing-manager.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}
```

Label/content expression:

```tsx
{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}
```

#### ACT-billing-manager-tsx-264-3

Owner `RecordPaymentForm`; [src/billing-manager.tsx:264](../src/billing-manager.tsx); tag `input`.

Visibility: mode === "Other"

```tsx
aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-264-4

Owner `RecordPaymentForm`; [src/billing-manager.tsx:264](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-264-5

Owner `RecordPaymentForm`; [src/billing-manager.tsx:264](../src/billing-manager.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={notes} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-billing-manager-tsx-265-1

Owner `RecordPaymentForm`; [src/billing-manager.tsx:265](../src/billing-manager.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-billing-manager-tsx-266-1

Owner `RecordPaymentForm`; [src/billing-manager.tsx:266](../src/billing-manager.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="submit" className="primary-action"
```

Label/content expression:

```tsx
Confirm Payment
```

#### STATE-billing-manager-tsx-317-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:317](../src/billing-manager.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title={`${action[0].toUpperCase() + action.slice(1)} Invoice`} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide className="dialog-document-editor" footer={!readOnly && <button className="primary-action" type="submit" form="invoice-dialog-form">{action === "edit" ? "Update Invoice" : "Save Invoice"}</button>}
```

Label/content expression:

```tsx
<form id="invoice-dialog-form" className="billing-dialog-form" onSubmit={submit}> {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>} {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>} <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div> <div className="estimate-items"><div className="line-items-header"><strong>Invoice items</strong>{!lockFinancials && <button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}><Plus size={16} />Add Item</button>}</div><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST type</span><span>GST rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }) })}><option>CGST+SGST</option><option>IGST</option><option>No GST</option></select>{item.gst_type === "No GST" ? <span className="gst-no-rate">0%</span> : <SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />} {!lockFinancials && <button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div> <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div> <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label> {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>} {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference and notes can still be updated.</p>} {error && <p className="error-text" role="alert">{error}</p>} </form>
```

#### ACT-billing-manager-tsx-317-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:317](../src/billing-manager.tsx); tag `button`.

Visibility: !readOnly

```tsx
className="primary-action" type="submit" form="invoice-dialog-form"
```

Label/content expression:

```tsx
{action === "edit" ? "Update Invoice" : "Save Invoice"}
```

#### FORM-billing-manager-tsx-317-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:317](../src/billing-manager.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="invoice-dialog-form" className="billing-dialog-form" onSubmit={submit}
```

Label/content expression:

```tsx
 {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>} {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>} <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div> <div className="estimate-items"><div className="line-items-header"><strong>Invoice items</strong>{!lockFinancials && <button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}><Plus size={16} />Add Item</button>}</div><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST type</span><span>GST rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }) })}><option>CGST+SGST</option><option>IGST</option><option>No GST</option></select>{item.gst_type === "No GST" ? <span className="gst-no-rate">0%</span> : <SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />} {!lockFinancials && <button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div> <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div> <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label> {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>} {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference and notes can still be updated.</p>} {error && <p className="error-text" role="alert">{error}</p>} 
```

#### ACT-billing-manager-tsx-318-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:318](../src/billing-manager.tsx); tag `select`.

Visibility: action === "create" && !fixedJob && candidates.length > 1

```tsx
aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}
```

Label/content expression:

```tsx
{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}
```

#### STATE-billing-manager-tsx-319-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:319](../src/billing-manager.tsx); tag `p`.

Visibility: warning && !readOnly

```tsx
className="permission-note" role="status"
```

Label/content expression:

```tsx
{warning}
```

#### ACT-billing-manager-tsx-320-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:320](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-320-2

Owner `InvoiceDialog`; [src/billing-manager.tsx:320](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-321-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `button`.

Visibility: !lockFinancials

```tsx
type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}
```

Label/content expression:

```tsx
<Plus size={16} /> Add Item
```

#### ACT-billing-manager-tsx-321-2

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}
```

Label/content expression:

```tsx
<option>Service</option> <option>Material</option>
```

#### ACT-billing-manager-tsx-321-3

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-321-4

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-321-5

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-321-6

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }) })}
```

Label/content expression:

```tsx
<option>CGST+SGST</option> <option>IGST</option> <option>No GST</option>
```

#### ACT-billing-manager-tsx-321-7

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `SearchSelect`.

Visibility: item.gst_type === "No GST"

```tsx
label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-321-8

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `button`.

Visibility: !lockFinancials

```tsx
type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}
```

Label/content expression:

```tsx
Remove
```

#### ACT-billing-manager-tsx-321-9

Owner `InvoiceDialog`; [src/billing-manager.tsx:321](../src/billing-manager.tsx); tag `button`.

Visibility: !lockFinancials

```tsx
type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}
```

Label/content expression:

```tsx
Add late material: {line.description} x {line.qty}
```

#### ACT-billing-manager-tsx-323-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:323](../src/billing-manager.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-billing-manager-tsx-324-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:324](../src/billing-manager.tsx); tag `textarea`.

Visibility: action === "edit" && !lockFinancials

```tsx
aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow."
```

Label/content expression:

```tsx

```

#### STATE-billing-manager-tsx-326-1

Owner `InvoiceDialog`; [src/billing-manager.tsx:326](../src/billing-manager.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### STATE-billing-manager-tsx-333-1

Owner `PaymentDialog`; [src/billing-manager.tsx:333](../src/billing-manager.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title="Quick Mark Paid" subtitle={`${view.job.job_no} · ${invoice.invoice_no}`} onClose={onClose} footer={null}
```

Label/content expression:

```tsx
<RecordPaymentForm invoice={invoice} actor={actor} mutate={(action, onError) => { const ok = mutate(action, onError); if (ok) onClose(); return ok; }} />
```

#### STATE-billing-manager-tsx-351-1

Owner `JobInvoicePanel`; [src/billing-manager.tsx:351](../src/billing-manager.tsx); tag `p`.

Visibility: warning

```tsx
className="permission-note" role="status"
```

Label/content expression:

```tsx
{warning}
```

#### ACT-billing-manager-tsx-352-1

Owner `JobInvoicePanel`; [src/billing-manager.tsx:352](../src/billing-manager.tsx); tag `button`.

Visibility: estimateActions.includes("approve-estimate")

```tsx
type="button" className="primary-action" onClick={onEstimate}
```

Label/content expression:

```tsx
Approve Estimate
```

#### ACT-billing-manager-tsx-352-2

Owner `JobInvoicePanel`; [src/billing-manager.tsx:352](../src/billing-manager.tsx); tag `button`.

Visibility: actions.includes("create-invoice")

```tsx
type="button" className="primary-action" onClick={onOpen}
```

Label/content expression:

```tsx
Create Invoice
```

#### ACT-billing-manager-tsx-357-1

Owner `JobInvoicePanel`; [src/billing-manager.tsx:357](../src/billing-manager.tsx); tag `button`.

Visibility: actions.includes("edit-invoice")

```tsx
type="button" className="primary-action" onClick={onOpen}
```

Label/content expression:

```tsx
Edit Invoice
```

#### ACT-billing-manager-tsx-357-2

Owner `JobInvoicePanel`; [src/billing-manager.tsx:357](../src/billing-manager.tsx); tag `button`.

Visibility: canVoidInvoice

```tsx
type="button" className="danger-action" onClick={() => setVoiding(true)}
```

Label/content expression:

```tsx
Void Invoice
```

#### STATE-billing-manager-tsx-359-1

Owner `JobInvoicePanel`; [src/billing-manager.tsx:359](../src/billing-manager.tsx); tag `p`.

Visibility: warning

```tsx
className="permission-note" role="status"
```

Label/content expression:

```tsx
{warning}
```

#### ACT-billing-manager-tsx-361-1

Owner `JobInvoicePanel`; [src/billing-manager.tsx:361](../src/billing-manager.tsx); tag `VoidReasonDialog`.

Visibility: voiding

```tsx
title="Void Invoice?" subtitle={`${view.job.job_no} · Unlocks the material rows it billed`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)}
```

Label/content expression:

```tsx

```

#### STATE-billing-manager-tsx-374-1

Owner `VoidReasonDialog`; [src/billing-manager.tsx:374](../src/billing-manager.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
title={title} subtitle={subtitle} onClose={onClose} footer={<button className="danger-action" type="submit" form="void-reason-dialog-form">Void</button>}
```

Label/content expression:

```tsx
<form id="void-reason-dialog-form" className="billing-dialog-form" onSubmit={submit}> <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} </form>
```

#### ACT-billing-manager-tsx-374-1

Owner `VoidReasonDialog`; [src/billing-manager.tsx:374](../src/billing-manager.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" type="submit" form="void-reason-dialog-form"
```

Label/content expression:

```tsx
Void
```

#### FORM-billing-manager-tsx-374-1

Owner `VoidReasonDialog`; [src/billing-manager.tsx:374](../src/billing-manager.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="void-reason-dialog-form" className="billing-dialog-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} 
```

#### ACT-billing-manager-tsx-375-1

Owner `VoidReasonDialog`; [src/billing-manager.tsx:375](../src/billing-manager.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)}
```

Label/content expression:

```tsx

```

#### STATE-billing-manager-tsx-376-1

Owner `VoidReasonDialog`; [src/billing-manager.tsx:376](../src/billing-manager.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-billing-manager-tsx-391-1

Owner `JobPaymentPanel`; [src/billing-manager.tsx:391](../src/billing-manager.tsx); tag `button`.

Visibility: payment && actor.role === "admin"

```tsx
type="button" className="danger-action" onClick={() => setVoiding(true)}
```

Label/content expression:

```tsx
Void Payment
```

#### ACT-billing-manager-tsx-396-1

Owner `JobPaymentPanel`; [src/billing-manager.tsx:396](../src/billing-manager.tsx); tag `VoidReasonDialog`.

Visibility: voiding && payment

```tsx
title="Void Payment?" subtitle={`${view.job.job_no} · Reopens the Invoice and voids the Receipt`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)}
```

Label/content expression:

```tsx

```

### src/body-mark.tsx

#### ACT-body-mark-tsx-65-1

Owner `BodyMarkDiagram`; [src/body-mark.tsx:65](../src/body-mark.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={`body-mark-canvas${onChange ? " editable" : ""}`} role="group" aria-label="Combined vehicle body-mark illustration" onClick={onChange ? (event) => { const rect = event.currentTarget.getBoundingClientRect(); onChange(addDamageMark(marks, ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100)); } : undefined}
```

Label/content expression:

```tsx
 <img src={DAMAGE_DIAGRAM_ASSET} alt="Vehicle body illustration" /> {marks.map((mark) => <button key={mark.id} type="button" className="damage-marker" data-testid="damage-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} aria-label={`Remove damage mark ${mark.id}`} title={`Remove damage mark ${mark.id}`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }} disabled={!onChange}>{mark.id}<X size={10} aria-hidden="true" /></button>)} 
```

#### ACT-body-mark-tsx-70-1

Owner `BodyMarkDiagram`; [src/body-mark.tsx:70](../src/body-mark.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={mark.id} type="button" className="damage-marker" data-testid="damage-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} aria-label={`Remove damage mark ${mark.id}`} title={`Remove damage mark ${mark.id}`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }} disabled={!onChange}
```

Label/content expression:

```tsx
{mark.id} <X size={10} aria-hidden="true" />
```

#### ACT-body-mark-tsx-74-1

Owner `BodyMarkDiagram`; [src/body-mark.tsx:74](../src/body-mark.tsx); tag `button`.

Visibility: !hideDownload

```tsx
type="button" className="workflow-action action-document document-download" onClick={download}
```

Label/content expression:

```tsx
<Download size={15} /> Download image
```

#### STATE-body-mark-tsx-76-1

Owner `BodyMarkDiagram`; [src/body-mark.tsx:76](../src/body-mark.tsx); tag `p`.

Visibility: error

```tsx
role="alert" className="form-error"
```

Label/content expression:

```tsx
{error}
```

### src/booking-calendar.tsx

#### ACT-booking-calendar-tsx-40-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:40](../src/booking-calendar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => { setForm(draftFor(selectedDate)); setError(""); setCreating(true); }} disabled={!canOverride && !capacity.serviceWork.remaining && !capacity.generalCheckupFollowup.remaining}
```

Label/content expression:

```tsx
<Plus size={16} /> Create Booking
```

#### ACT-booking-calendar-tsx-41-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:41](../src/booking-calendar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" aria-label="Previous month" disabled={month === range.firstMonth} onClick={() => changeMonth(-1)}
```

Label/content expression:

```tsx
<ChevronLeft size={18} />
```

#### ACT-booking-calendar-tsx-41-2

Owner `BookingCalendar`; [src/booking-calendar.tsx:41](../src/booking-calendar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" aria-label="Next month" disabled={month === range.lastMonth} onClick={() => changeMonth(1)}
```

Label/content expression:

```tsx
<ChevronRight size={18} />
```

#### ACT-booking-calendar-tsx-41-3

Owner `BookingCalendar`; [src/booking-calendar.tsx:41](../src/booking-calendar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" key={date} role="gridcell" disabled={!isAdvanceBookingDate(date, range)} onClick={() => selectDate(date)} className={`booking-calendar-day${!date.startsWith(month) ? " outside-month" : ""}${date === selectedDate ? " selected" : ""}${full ? " full" : ""}`} aria-pressed={date === selectedDate}
```

Label/content expression:

```tsx
<span>{Number(date.slice(-2))}</span> <small>SW {c.serviceWork.count}/{c.serviceWork.limit} · C {c.generalCheckupFollowup.count}/{c.generalCheckupFollowup.limit}</small>
```

#### ACT-booking-calendar-tsx-42-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:42](../src/booking-calendar.tsx); tag `button`.

Visibility: canOverride

```tsx
type="button" aria-label="Admin control: set daily booking limits" onClick={() => { setCapacityDraft(draftCapacity(selectedDate)); setError(""); setEditingCapacity(true); }}
```

Label/content expression:

```tsx
Admin: Set limits
```

#### STATE-booking-calendar-tsx-42-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:42](../src/booking-calendar.tsx); tag `p`.

Visibility: (!capacity.serviceWork.remaining \|\| !capacity.generalCheckupFollowup.remaining)

```tsx
className="booking-capacity-alert" role="status"
```

Label/content expression:

```tsx
{!capacity.serviceWork.remaining ? "Service Work is full. " : ""} {!capacity.generalCheckupFollowup.remaining ? "General Checkup / Follow-up is full. " : ""} Reception cannot select a full type. {canOverride ? " Admin may add one with an override reason." : ""}
```

#### STATE-booking-calendar-tsx-43-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `Dialog`.

Visibility: creating

```tsx
title="Create advance booking" subtitle={`Booking for ${dateLabel(selectedDate)}`} onClose={() => setCreating(false)}
```

Label/content expression:

```tsx
<form className="booking-form" onSubmit={submit}><label>Customer name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label><label>Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label><label>Vehicle number<input required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })} /></label><label>Make<input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /></label><label>Model<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label><label>Color<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label><label>Booking date<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} /></label><label>Service type<select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}>{serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}</select></label><label>Arrival window<select value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}>{windows.map((w) => <option key={w} value={w}>{w \|\| "Not set"}</option>)}</select></label><label className="booking-form-wide">Requested work<textarea required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })} /></label>{formQuota.remaining === 0 && canOverride && <label className="booking-form-wide">Admin override reason (recorded in the booking audit trail)<textarea required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })} /></label>}{error && <p className="error-text booking-form-wide" role="alert">{error}</p>}<div className="action-row booking-form-wide"><button className="primary-action">Save Booking</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div></form>
```

#### FORM-booking-calendar-tsx-43-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `form`.

Visibility: creating

```tsx
className="booking-form" onSubmit={submit}
```

Label/content expression:

```tsx
<label>Customer name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label> <label>Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label> <label>Vehicle number<input required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })} /></label> <label>Make<input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /></label> <label>Model<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label> <label>Color<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label> <label>Booking date<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} /></label> <label>Service type<select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}>{serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}</select></label> <label>Arrival window<select value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}>{windows.map((w) => <option key={w} value={w}>{w \|\| "Not set"}</option>)}</select></label> <label className="booking-form-wide">Requested work<textarea required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })} /></label> {formQuota.remaining === 0 && canOverride && <label className="booking-form-wide">Admin override reason (recorded in the booking audit trail)<textarea required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })} /></label>} {error && <p className="error-text booking-form-wide" role="alert">{error}</p>} <div className="action-row booking-form-wide"><button className="primary-action">Save Booking</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div>
```

#### ACT-booking-calendar-tsx-43-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-2

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-3

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-4

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-5

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-6

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-7

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `input`.

Visibility: creating

```tsx
required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-8

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `select`.

Visibility: creating

```tsx
required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}
```

Label/content expression:

```tsx
{serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}
```

#### ACT-booking-calendar-tsx-43-9

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `select`.

Visibility: creating

```tsx
value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}
```

Label/content expression:

```tsx
{windows.map((w) => <option key={w} value={w}>{w \|\| "Not set"}</option>)}
```

#### ACT-booking-calendar-tsx-43-10

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `textarea`.

Visibility: creating

```tsx
required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-11

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `textarea`.

Visibility: formQuota.remaining === 0 && canOverride; creating

```tsx
required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-43-12

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `button`.

Visibility: creating

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Booking
```

#### ACT-booking-calendar-tsx-43-13

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `button`.

Visibility: creating

```tsx
type="button" onClick={() => setCreating(false)}
```

Label/content expression:

```tsx
Cancel
```

#### STATE-booking-calendar-tsx-43-2

Owner `BookingCalendar`; [src/booking-calendar.tsx:43](../src/booking-calendar.tsx); tag `p`.

Visibility: error; creating

```tsx
className="error-text booking-form-wide" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### STATE-booking-calendar-tsx-44-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `Dialog`.

Visibility: editingCapacity

```tsx
title="Set daily booking limits" subtitle={dateLabel(selectedDate)} onClose={() => setEditingCapacity(false)}
```

Label/content expression:

```tsx
<form onSubmit={saveLimits}><label>Service Work bookings allowed<input aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })} /></label><label>General Checkup / Follow-up bookings allowed<input aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })} /></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="action-row"><button className="primary-action">Save limits</button><button type="button" onClick={() => setEditingCapacity(false)}>Cancel</button></div></form>
```

#### FORM-booking-calendar-tsx-44-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `form`.

Visibility: editingCapacity

```tsx
onSubmit={saveLimits}
```

Label/content expression:

```tsx
<label>Service Work bookings allowed<input aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })} /></label> <label>General Checkup / Follow-up bookings allowed<input aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })} /></label> {error && <p className="error-text" role="alert">{error}</p>} <div className="action-row"><button className="primary-action">Save limits</button><button type="button" onClick={() => setEditingCapacity(false)}>Cancel</button></div>
```

#### ACT-booking-calendar-tsx-44-1

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `input`.

Visibility: editingCapacity

```tsx
aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-44-2

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `input`.

Visibility: editingCapacity

```tsx
aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-booking-calendar-tsx-44-3

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `button`.

Visibility: editingCapacity

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save limits
```

#### ACT-booking-calendar-tsx-44-4

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `button`.

Visibility: editingCapacity

```tsx
type="button" onClick={() => setEditingCapacity(false)}
```

Label/content expression:

```tsx
Cancel
```

#### STATE-booking-calendar-tsx-44-2

Owner `BookingCalendar`; [src/booking-calendar.tsx:44](../src/booking-calendar.tsx); tag `p`.

Visibility: error; editingCapacity

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

### src/booking-check-in.tsx

#### STATE-booking-check-in-tsx-35-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:35](../src/booking-check-in.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title="Check in advance booking" subtitle={`${booking.customer_name} · ${booking.vehicle_no}`} onClose={onClose} footer={<button className="primary-action" type="submit" form="booking-check-in-form">Create Visit and Job Card</button>}
```

Label/content expression:

```tsx
 <form id="booking-check-in-form" onSubmit={submit}> <p className="permission-note">Booking details are prefilled below. Capture actual arrival condition; advisor assignment happens after check-in.</p> <div className="form-grid"> <label>Customer name<input value={booking.customer_name} readOnly /></label><label>Mobile<input value={booking.mobile} readOnly /></label> <label>Vehicle number<input value={booking.vehicle_no} readOnly /></label><label>Vehicle<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly /></label><label>Booked service type<input value={booking.service_type} readOnly /></label> <label>ODO meter reading (km)<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} /></label> <label>Fuel / battery level<div className="field-pair"><input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} /><select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}><option value="bars">bars</option><option value="%">%</option><option value="litres">litres</option><option value="Other">Other</option></select></div></label> <label>Keys<input value={keys} onChange={(event) => setKeys(event.target.value)} /></label><label>Accessories<input value={accessories} onChange={(event) => setAccessories(event.target.value)} /></label> </div> <label>Requested work<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} /></label> <div className="damage-capture"><strong>Arrival body marks (optional)</strong><BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} /></div> {error && <p className="form-error" role="alert">{error}</p>} </form> 
```

#### ACT-booking-check-in-tsx-35-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:35](../src/booking-check-in.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="booking-check-in-form"
```

Label/content expression:

```tsx
Create Visit and Job Card
```

#### FORM-booking-check-in-tsx-36-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:36](../src/booking-check-in.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="booking-check-in-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <p className="permission-note">Booking details are prefilled below. Capture actual arrival condition; advisor assignment happens after check-in.</p> <div className="form-grid"> <label>Customer name<input value={booking.customer_name} readOnly /></label><label>Mobile<input value={booking.mobile} readOnly /></label> <label>Vehicle number<input value={booking.vehicle_no} readOnly /></label><label>Vehicle<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly /></label><label>Booked service type<input value={booking.service_type} readOnly /></label> <label>ODO meter reading (km)<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} /></label> <label>Fuel / battery level<div className="field-pair"><input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} /><select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}><option value="bars">bars</option><option value="%">%</option><option value="litres">litres</option><option value="Other">Other</option></select></div></label> <label>Keys<input value={keys} onChange={(event) => setKeys(event.target.value)} /></label><label>Accessories<input value={accessories} onChange={(event) => setAccessories(event.target.value)} /></label> </div> <label>Requested work<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} /></label> <div className="damage-capture"><strong>Arrival body marks (optional)</strong><BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} /></div> {error && <p className="form-error" role="alert">{error}</p>} 
```

#### ACT-booking-check-in-tsx-39-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:39](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={booking.customer_name} readOnly
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-39-2

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:39](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={booking.mobile} readOnly
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-40-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:40](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={booking.vehicle_no} readOnly
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-40-2

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:40](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-40-3

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:40](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={booking.service_type} readOnly
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-41-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:41](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-42-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:42](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-42-2

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:42](../src/booking-check-in.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}
```

Label/content expression:

```tsx
<option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option>
```

#### ACT-booking-check-in-tsx-43-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:43](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={keys} onChange={(event) => setKeys(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-43-2

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:43](../src/booking-check-in.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={accessories} onChange={(event) => setAccessories(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-45-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:45](../src/booking-check-in.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-booking-check-in-tsx-46-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:46](../src/booking-check-in.tsx); tag `BodyMarkDiagram`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }}
```

Label/content expression:

```tsx

```

#### STATE-booking-check-in-tsx-47-1

Owner `BookingCheckInDialog`; [src/booking-check-in.tsx:47](../src/booking-check-in.tsx); tag `p`.

Visibility: error

```tsx
className="form-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

### src/booking-expected-today.tsx

#### ACT-booking-expected-today-tsx-71-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:71](../src/booking-expected-today.tsx); tag `BookingCheckInDialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
booking={selected.booking} actor={actor} mutate={mutate} onClose={closeAction} onCreated={(jobId, jobNo) => { closeAction(); onCheckedIn?.(jobId, jobNo); }}
```

Label/content expression:

```tsx

```

#### ACT-booking-expected-today-tsx-82-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:82](../src/booking-expected-today.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Expected today follow-up status" value={filter} onChange={(event) => setFilter(event.target.value as ExpectedTodayFilter)}
```

Label/content expression:

```tsx
 <option value="ALL">All expected</option> <option value="NEEDS_FOLLOW_UP">Needs follow-up</option> <option value="CALLED">Call logged</option> 
```

#### ACT-booking-expected-today-tsx-91-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:91](../src/booking-expected-today.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="primary-action" onClick={() => openAction(booking, "check-in")}
```

Label/content expression:

```tsx
Check in
```

#### ACT-booking-expected-today-tsx-91-2

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:91](../src/booking-expected-today.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={() => openAction(booking, "call")}
```

Label/content expression:

```tsx
Log call {calls.length ? ` (${calls.length})` : ""}
```

#### ACT-booking-expected-today-tsx-91-3

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:91](../src/booking-expected-today.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" onClick={() => openAction(booking, "reschedule")}
```

Label/content expression:

```tsx
Reschedule
```

#### ACT-booking-expected-today-tsx-91-4

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:91](../src/booking-expected-today.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="danger-action" onClick={() => openAction(booking, "cancel")}
```

Label/content expression:

```tsx
Cancel
```

#### ACT-booking-expected-today-tsx-91-5

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:91](../src/booking-expected-today.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="secondary-action" onClick={() => openAction(booking, "no-show")}
```

Label/content expression:

```tsx
No-show
```

#### STATE-booking-expected-today-tsx-95-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:95](../src/booking-expected-today.tsx); tag `Dialog`.

Visibility: selected

```tsx
title={title} subtitle={`${selected.booking.customer_name} · ${selected.booking.vehicle_no}`} onClose={closeAction} footer={<button type="submit" form="booking-follow-up-form" className={selected.action === "cancel" ? "danger-action" : "primary-action"}>{selected.action === "call" ? "Save call note" : selected.action === "reschedule" ? "Save reschedule" : selected.action === "cancel" ? "Cancel booking" : "Mark no-show"}</button>}
```

Label/content expression:

```tsx
 <form id="booking-follow-up-form" className="booking-follow-up-form" onSubmit={submit}> {selected.action === "reschedule" && <><label>New booking date<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required /></label><label>Booked service type<input value={selected.booking.service_type} readOnly /></label><label>Arrival window<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>{windowOptions.map((window) => <option key={window} value={window}>{window \|\| "Not set"}</option>)}</select></label>{rescheduleQuotaFull && actor.role === "admin" && <label>Admin override reason (recorded in the booking audit trail)<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} /></label>}</>} <label>{selected.action === "call" ? "Call note" : selected.action === "reschedule" ? "Reschedule reason" : selected.action === "cancel" ? "Cancellation reason" : "No-show reason"}<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required /></label> {selected.action === "no-show" && <p className="permission-note">Use this only after day-end follow-up. This is a manual status and cannot be undone from Expected Today.</p>} {error && <p className="form-error" role="alert">{error}</p>} </form> 
```

#### ACT-booking-expected-today-tsx-95-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:95](../src/booking-expected-today.tsx); tag `button`.

Visibility: selected

```tsx
type="submit" form="booking-follow-up-form" className={selected.action === "cancel" ? "danger-action" : "primary-action"}
```

Label/content expression:

```tsx
{selected.action === "call" ? "Save call note" : selected.action === "reschedule" ? "Save reschedule" : selected.action === "cancel" ? "Cancel booking" : "Mark no-show"}
```

#### FORM-booking-expected-today-tsx-96-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:96](../src/booking-expected-today.tsx); tag `form`.

Visibility: selected

```tsx
id="booking-follow-up-form" className="booking-follow-up-form" onSubmit={submit}
```

Label/content expression:

```tsx
 {selected.action === "reschedule" && <><label>New booking date<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required /></label><label>Booked service type<input value={selected.booking.service_type} readOnly /></label><label>Arrival window<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>{windowOptions.map((window) => <option key={window} value={window}>{window \|\| "Not set"}</option>)}</select></label>{rescheduleQuotaFull && actor.role === "admin" && <label>Admin override reason (recorded in the booking audit trail)<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} /></label>}</>} <label>{selected.action === "call" ? "Call note" : selected.action === "reschedule" ? "Reschedule reason" : selected.action === "cancel" ? "Cancellation reason" : "No-show reason"}<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required /></label> {selected.action === "no-show" && <p className="permission-note">Use this only after day-end follow-up. This is a manual status and cannot be undone from Expected Today.</p>} {error && <p className="form-error" role="alert">{error}</p>} 
```

#### ACT-booking-expected-today-tsx-97-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:97](../src/booking-expected-today.tsx); tag `input`.

Visibility: selected.action === "reschedule"; selected

```tsx
data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required
```

Label/content expression:

```tsx

```

#### ACT-booking-expected-today-tsx-97-2

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:97](../src/booking-expected-today.tsx); tag `input`.

Visibility: selected.action === "reschedule"; selected

```tsx
value={selected.booking.service_type} readOnly
```

Label/content expression:

```tsx

```

#### ACT-booking-expected-today-tsx-97-3

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:97](../src/booking-expected-today.tsx); tag `select`.

Visibility: selected.action === "reschedule"; selected

```tsx
value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}
```

Label/content expression:

```tsx
{windowOptions.map((window) => <option key={window} value={window}>{window \|\| "Not set"}</option>)}
```

#### ACT-booking-expected-today-tsx-97-4

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:97](../src/booking-expected-today.tsx); tag `textarea`.

Visibility: rescheduleQuotaFull && actor.role === "admin"; selected.action === "reschedule"; selected

```tsx
required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-booking-expected-today-tsx-98-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:98](../src/booking-expected-today.tsx); tag `textarea`.

Visibility: selected

```tsx
data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required
```

Label/content expression:

```tsx

```

#### STATE-booking-expected-today-tsx-100-1

Owner `ExpectedTodayBookings`; [src/booking-expected-today.tsx:100](../src/booking-expected-today.tsx); tag `p`.

Visibility: error; selected

```tsx
className="form-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

### src/developer-console.tsx

#### ACT-developer-console-tsx-12-1

Owner `DeveloperConsole`; [src/developer-console.tsx:12](../src/developer-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="danger-action" onClick={onReset}
```

Label/content expression:

```tsx
<RotateCcw size={16} /> Reset demo
```

#### STATE-developer-console-tsx-13-1

Owner `DeveloperConsole`; [src/developer-console.tsx:13](../src/developer-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}
```

Label/content expression:

```tsx
{item}
```

#### STATE-developer-console-tsx-13-2

Owner `DeveloperConsole`; [src/developer-console.tsx:13](../src/developer-console.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="management-tabs" role="tablist" aria-label="Developer Console tabs"
```

Label/content expression:

```tsx
{(["Tenants", "Communications", "Billing"] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}
```

#### ACT-developer-console-tsx-15-1

Owner `DeveloperConsole`; [src/developer-console.tsx:15](../src/developer-console.tsx); tag `button`.

Visibility: tab === "Tenants"

```tsx
className={`tenant-row ${item.id === tenant.id ? "selected" : ""}`} key={item.id} onClick={() => commit((current) => ({ ...current, selectedTenantId: item.id }))}
```

Label/content expression:

```tsx
<Building2 size={18}/> <span><strong>{item.profile.name}</strong><small>{item.lifecycle}</small></span>
```

#### ACT-developer-console-tsx-15-2

Owner `DeveloperConsole`; [src/developer-console.tsx:15](../src/developer-console.tsx); tag `TenantCreate`.

Visibility: tab === "Tenants"

```tsx
onCreate={(profile) => commit((current) => createTenant(current, profile))}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-15-3

Owner `DeveloperConsole`; [src/developer-console.tsx:15](../src/developer-console.tsx); tag `TenantProfileForm`.

Visibility: tab === "Tenants"

```tsx
profile={tenant.profile} onSave={(profile) => commit((current) => updateTenantProfile(current, tenant.id, profile))}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-15-4

Owner `DeveloperConsole`; [src/developer-console.tsx:15](../src/developer-console.tsx); tag `button`.

Visibility: tab === "Tenants"

```tsx
className={tenant.lifecycle === "active" ? "danger-action" : "primary-action"} onClick={() => commit((current) => setTenantLifecycle(current, tenant.id, tenant.lifecycle === "active" ? "disabled" : "active"))}
```

Label/content expression:

```tsx
{tenant.lifecycle === "active" ? "Disable tenant" : "Restore tenant"}
```

#### ACT-developer-console-tsx-15-5

Owner `DeveloperConsole`; [src/developer-console.tsx:15](../src/developer-console.tsx); tag `select`.

Visibility: tab === "Tenants"

```tsx
aria-label="Emulate role" value={role} onChange={(event) => setRole(event.target.value as EmulationRole)}
```

Label/content expression:

```tsx
{Object.entries(EMULATION_ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
```

#### ACT-developer-console-tsx-15-6

Owner `DeveloperConsole`; [src/developer-console.tsx:15](../src/developer-console.tsx); tag `button`.

Visibility: tab === "Tenants"

```tsx
className="primary-action" disabled={tenant.lifecycle !== "active"} onClick={() => onEmulate(role)}
```

Label/content expression:

```tsx
<Play size={16}/> Emulate tenant
```

#### ACT-developer-console-tsx-16-1

Owner `DeveloperConsole`; [src/developer-console.tsx:16](../src/developer-console.tsx); tag `input`.

Visibility: tab === "Communications"

```tsx
type="checkbox" checked={state.communications[channel].active} onChange={(event) => commit((current) => updateCommunication(current, channel, { active: event.target.checked }))}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-16-2

Owner `DeveloperConsole`; [src/developer-console.tsx:16](../src/developer-console.tsx); tag `input`.

Visibility: tab === "Communications"

```tsx
value={state.communications[channel].sender} onChange={(event) => commit((current) => updateCommunication(current, channel, { sender: event.target.value }))}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-16-3

Owner `DeveloperConsole`; [src/developer-console.tsx:16](../src/developer-console.tsx); tag `button`.

Visibility: tab === "Communications"

```tsx
className="primary-action" onClick={() => test(channel)}
```

Label/content expression:

```tsx
Send simulated test
```

#### FORM-developer-console-tsx-21-1

Owner `TenantCreate`; [src/developer-console.tsx:21](../src/developer-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="inline-form" onSubmit={submit}
```

Label/content expression:

```tsx
<input aria-label="New tenant name" value={name} onChange={(event) => setName(event.target.value)} placeholder="New workshop name"/> <button className="primary-action"><Plus size={16}/> Create tenant</button>
```

#### ACT-developer-console-tsx-21-1

Owner `TenantCreate`; [src/developer-console.tsx:21](../src/developer-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="New tenant name" value={name} onChange={(event) => setName(event.target.value)} placeholder="New workshop name"
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-21-2

Owner `TenantCreate`; [src/developer-console.tsx:21](../src/developer-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
<Plus size={16}/> Create tenant
```

#### FORM-developer-console-tsx-22-1

Owner `TenantProfileForm`; [src/developer-console.tsx:22](../src/developer-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="developer-form" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}
```

Label/content expression:

```tsx
<div className="developer-form-grid">{(["name", "brandName", "address", "contactName", "email", "phone", "gstin", "timezone", "currency", "invoicePrefix"] as const).map((key) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<input value={draft[key]} onChange={(event) => change(key, event.target.value)}/></label>)}</div> <button className="primary-action">Save company profile</button>
```

#### ACT-developer-console-tsx-22-1

Owner `TenantProfileForm`; [src/developer-console.tsx:22](../src/developer-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft[key]} onChange={(event) => change(key, event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-22-2

Owner `TenantProfileForm`; [src/developer-console.tsx:22](../src/developer-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save company profile
```

#### FORM-developer-console-tsx-23-1

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="desk-panel developer-form" onSubmit={(event) => { event.preventDefault(); commit((current) => createPlatformCharge(current, { tenantId, description, amount: Number(amount), dueDate })); setDescription(""); setAmount(""); setDueDate(""); }}
```

Label/content expression:

```tsx
<h2>Quick platform charge</h2> <label>Description<input value={description} onChange={(event) => setDescription(event.target.value)}/></label> <label>Amount<input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)}/></label> <label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)}/></label> <button className="primary-action">Create charge</button>
```

#### ACT-developer-console-tsx-23-1

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={description} onChange={(event) => setDescription(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-23-2

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-23-3

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-23-4

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Create charge
```

#### ACT-developer-console-tsx-23-5

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `input`.

Visibility: charges.length

```tsx
aria-label={`Payment for ${charge.description}`} type="number" min="1" placeholder="Payment amount" value={payment[charge.id] ?? ""} onChange={(event) => setPayment({ ...payment, [charge.id]: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-developer-console-tsx-23-6

Owner `Billing`; [src/developer-console.tsx:23](../src/developer-console.tsx); tag `button`.

Visibility: charges.length

```tsx
onClick={() => { const value = Number(payment[charge.id]); if (value > 0) { commit((current) => recordPlatformPayment(current, charge.id, value)); setPayment({ ...payment, [charge.id]: "" }); } }}
```

Label/content expression:

```tsx
Record payment
```

### src/document-download.tsx

#### ACT-document-download-tsx-26-1

Owner `DocumentDownloadButton`; [src/document-download.tsx:26](../src/document-download.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={className} disabled={status === "preparing"} aria-busy={status === "preparing"} onClick={(event) => { event.stopPropagation(); void download(); }}
```

Label/content expression:

```tsx
<Download size={15} /> {status === "preparing" ? "Preparing…" : status === "done" ? "Downloaded ✓" : label ?? "Download PDF"}
```

#### ACT-document-download-tsx-26-2

Owner `DocumentDownloadButton`; [src/document-download.tsx:26](../src/document-download.tsx); tag `button`.

Visibility: showPrint

```tsx
type="button" className="workflow-action action-secondary document-print" onClick={(event) => { event.stopPropagation(); print(); }}
```

Label/content expression:

```tsx
<Printer size={15} /> Print
```

#### STATE-document-download-tsx-26-1

Owner `DocumentDownloadButton`; [src/document-download.tsx:26](../src/document-download.tsx); tag `span`.

Visibility: status === "error"

```tsx
className="document-error" role="alert"
```

Label/content expression:

```tsx
{errorMessage}
```

### src/job-picker.tsx

#### ACT-job-picker-tsx-22-1

Owner `JobPicker`; [src/job-picker.tsx:22](../src/job-picker.tsx); tag `input`.

Visibility: showJobResults

```tsx
type="search" aria-label={`${label} search`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job, vehicle, customer or mobile"
```

Label/content expression:

```tsx

```

#### ACT-job-picker-tsx-22-2

Owner `JobPicker`; [src/job-picker.tsx:22](../src/job-picker.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`${label} Month-Year filter`} value={period.monthYear} onChange={(event) => setPeriod({ monthYear: event.target.value })}
```

Label/content expression:

```tsx
<option value="ALL">All months</option> {availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}
```

#### ACT-job-picker-tsx-22-3

Owner `JobPicker`; [src/job-picker.tsx:22](../src/job-picker.tsx); tag `select`.

Visibility: showJobResults

```tsx
aria-label="Job results" value={selectedJobId ?? ""} onChange={(event) => onSelect(event.target.value ? Number(event.target.value) : undefined)}
```

Label/content expression:

```tsx
<option value="">Choose a job</option> {options.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}</option>)}
```

#### ACT-job-picker-tsx-22-4

Owner `JobPicker`; [src/job-picker.tsx:22](../src/job-picker.tsx); tag `FilterClearButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={reset} label="Clear filters"
```

Label/content expression:

```tsx

```

#### STATE-job-picker-tsx-22-1

Owner `JobPicker`; [src/job-picker.tsx:22](../src/job-picker.tsx); tag `p`.

Visibility: showJobResults && query && options.length === 0

```tsx
className="job-picker-empty" role="status"
```

Label/content expression:

```tsx
No matching jobs
```

### src/job-sheet-ui.tsx

#### FORM-job-sheet-ui-tsx-18-1

Owner `EstimatedDeliveryRow`; [src/job-sheet-ui.tsx:18](../src/job-sheet-ui.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="info-row" onSubmit={(event) => { event.preventDefault(); setError(""); mutate((db) => updateEstimatedDeliveryForActor(db, view.job.id, actor.id, date), setError); }}
```

Label/content expression:

```tsx
 <label htmlFor={`job-delivery-date-${view.job.id}`}>Estimated Delivery Date</label> <div className="job-sheet-delivery-actions"> <input id={`job-delivery-date-${view.job.id}`} type="date" value={date} onChange={(event) => setDate(event.target.value)} /> <button type="submit" className="primary-action">Save</button> </div> 
```

#### ACT-job-sheet-ui-tsx-25-1

Owner `EstimatedDeliveryRow`; [src/job-sheet-ui.tsx:25](../src/job-sheet-ui.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id={`job-delivery-date-${view.job.id}`} type="date" value={date} onChange={(event) => setDate(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-job-sheet-ui-tsx-26-1

Owner `EstimatedDeliveryRow`; [src/job-sheet-ui.tsx:26](../src/job-sheet-ui.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="submit" className="primary-action"
```

Label/content expression:

```tsx
Save
```

#### STATE-job-sheet-ui-tsx-29-1

Owner `EstimatedDeliveryRow`; [src/job-sheet-ui.tsx:29](../src/job-sheet-ui.tsx); tag `p`.

Visibility: error

```tsx
role="alert" className="form-error"
```

Label/content expression:

```tsx
{error}
```

#### ACT-job-sheet-ui-tsx-37-1

Owner `DamageDiagram`; [src/job-sheet-ui.tsx:37](../src/job-sheet-ui.tsx); tag `svg`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
viewBox="0 0 100 200" role="img" aria-label="Vehicle damage diagram, top view" onClick={onAdd ? (event) => { const rect = event.currentTarget.getBoundingClientRect(); onAdd(((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100); } : undefined}
```

Label/content expression:

```tsx
 <rect x="18" y="8" width="64" height="184" rx="26" className="damage-body" /> <rect x="26" y="40" width="48" height="34" rx="6" className="damage-glass" /> <rect x="26" y="128" width="48" height="26" rx="6" className="damage-glass" /> <line x1="18" y1="100" x2="82" y2="100" className="damage-body-line" /> {marks.filter((mark) => !mark.view).map((mark) => ( <g key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x} ${mark.y * 2})`} onClick={(event) => { event.stopPropagation(); onRemove?.(mark.id); }}> <circle r="5" /> <text textAnchor="middle" dy="2.5">{mark.id}</text> </g> ))} 
```

#### ACT-job-sheet-ui-tsx-46-1

Owner `DamageDiagram`; [src/job-sheet-ui.tsx:46](../src/job-sheet-ui.tsx); tag `g`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x} ${mark.y * 2})`} onClick={(event) => { event.stopPropagation(); onRemove?.(mark.id); }}
```

Label/content expression:

```tsx
 <circle r="5" /> <text textAnchor="middle" dy="2.5">{mark.id}</text> 
```

#### FORM-job-sheet-ui-tsx-88-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:88](../src/job-sheet-ui.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onSubmit={(event) => { event.preventDefault(); setError(""); mutate((db) => updateJobSheetForActor(db, view.job.id, actor.id, draft), setError); }}
```

Label/content expression:

```tsx
 <div className="form-grid"> <label>Service Type<select value={draft.service_type} onChange={set("service_type")}><option value="">—</option>{SERVICE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label> <label>Pickup / Drop<select value={draft.pickup_drop} onChange={set("pickup_drop")}><option value="">—</option>{PICKUP_DROP_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label> <label>Estimated Delivery Date<input type="date" value={draft.estimated_delivery} onChange={set("estimated_delivery")} /></label> <label>Fuel<select value={draft.fuel} onChange={set("fuel")}>{[...new Set([draft.fuel, ...FUEL_LEVELS])].filter(Boolean).map((item) => <option key={item}>{item}</option>)}</select></label> <label>Accessories<input value={draft.accessories} onChange={set("accessories")} /></label> <label>Engine Number<input value={draft.engine_no} onChange={set("engine_no")} /></label> </div> <label>Address<input value={draft.address} onChange={set("address")} /></label> <button className="primary-action">Save Job Sheet</button> {error && <p role="alert" className="form-error">{error}</p>} 
```

#### ACT-job-sheet-ui-tsx-90-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:90](../src/job-sheet-ui.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.service_type} onChange={set("service_type")}
```

Label/content expression:

```tsx
<option value="">—</option> {SERVICE_TYPES.map((item) => <option key={item}>{item}</option>)}
```

#### ACT-job-sheet-ui-tsx-91-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:91](../src/job-sheet-ui.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.pickup_drop} onChange={set("pickup_drop")}
```

Label/content expression:

```tsx
<option value="">—</option> {PICKUP_DROP_OPTIONS.map((item) => <option key={item}>{item}</option>)}
```

#### ACT-job-sheet-ui-tsx-92-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:92](../src/job-sheet-ui.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={draft.estimated_delivery} onChange={set("estimated_delivery")}
```

Label/content expression:

```tsx

```

#### ACT-job-sheet-ui-tsx-93-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:93](../src/job-sheet-ui.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.fuel} onChange={set("fuel")}
```

Label/content expression:

```tsx
{[...new Set([draft.fuel, ...FUEL_LEVELS])].filter(Boolean).map((item) => <option key={item}>{item}</option>)}
```

#### ACT-job-sheet-ui-tsx-94-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:94](../src/job-sheet-ui.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.accessories} onChange={set("accessories")}
```

Label/content expression:

```tsx

```

#### ACT-job-sheet-ui-tsx-95-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:95](../src/job-sheet-ui.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.engine_no} onChange={set("engine_no")}
```

Label/content expression:

```tsx

```

#### ACT-job-sheet-ui-tsx-97-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:97](../src/job-sheet-ui.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.address} onChange={set("address")}
```

Label/content expression:

```tsx

```

#### ACT-job-sheet-ui-tsx-98-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:98](../src/job-sheet-ui.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action"
```

Label/content expression:

```tsx
Save Job Sheet
```

#### STATE-job-sheet-ui-tsx-99-1

Owner `JobSheetSection`; [src/job-sheet-ui.tsx:99](../src/job-sheet-ui.tsx); tag `p`.

Visibility: error

```tsx
role="alert" className="form-error"
```

Label/content expression:

```tsx
{error}
```

### src/local-sales.tsx

#### ACT-local-sales-tsx-28-1

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:28](../src/local-sales.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={salesLeadsReport(filteredLeads, leadCreatedMonth, leadQuery, leadStage)}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-28-2

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:28](../src/local-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => { setSelectedLead(null); setLeadDialog("add"); }}
```

Label/content expression:

```tsx
Add Lead
```

#### ACT-local-sales-tsx-28-3

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:28](../src/local-sales.tsx); tag `SalesLeadFilterBar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
query={leadQuery} stage={leadStage} createdMonth={leadCreatedMonth} onQueryChange={setLeadQuery} onStageChange={setLeadStage} onCreatedMonthChange={setLeadCreatedMonth} onClear={() => { setLeadQuery(""); setLeadStage(""); setLeadCreatedMonth(""); }}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-28-4

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:28](../src/local-sales.tsx); tag `SalesLeadDialog`.

Visibility: leadDialog

```tsx
lead={selectedLead ? leadDraft(remoteLead(selectedLead)) : blankLeadDraft} editing={leadDialog === "edit"} onSave={saveLead} onClose={closeLeadDialog}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-28-5

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:28](../src/local-sales.tsx); tag `SalesLeadRegister`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
leads={filteredLeads} onEdit={(lead) => { const localLead = state.sales_leads.find((item) => item.id === lead.id); if (localLead) { setSelectedLead(localLead); setLeadDialog("edit"); } }} onSave={saveInlineLead}
```

Label/content expression:

```tsx

```

#### STATE-local-sales-tsx-28-1

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:28](../src/local-sales.tsx); tag `p`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-local-sales-tsx-31-1

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => setEditor("new")}
```

Label/content expression:

```tsx
New Quotation
```

#### ACT-local-sales-tsx-31-2

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `QuotationEditorDialog`.

Visibility: editor

```tsx
leads={leads} templates={templates} tasks={tasks} quotation={editor === "new" ? undefined : editor} busy={false} onClose={() => setEditor(null)} onSave={saveQuotation}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-31-3

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `QuotationDetailsDialog`.

Visibility: details

```tsx
quotation={details} lead={leads.find((lead) => lead.id === details.leadId)} templateName={templates.find((template) => template.id === details.templateId)?.name ?? details.templateId} loadDocument={() => Promise.resolve(localDocument(details, leads.find((lead) => lead.id === details.leadId)))} onClose={() => setDetails(null)}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-31-4

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `QuotationFilterBar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
query={query} status={quotationStatus} createdDate={createdDate} createdMonth={createdMonth} onQueryChange={setQuery} onStatusChange={setQuotationStatus} onCreatedDateChange={setCreatedDate} onCreatedMonthChange={setCreatedMonth} onClear={() => { setQuery(""); setQuotationStatus(""); setCreatedDate(""); setCreatedMonth(""); }}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-31-5

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="billing-table-action" onClick={() => setDetails(item)}
```

Label/content expression:

```tsx
<Eye size={15} /> View details
```

#### ACT-local-sales-tsx-31-6

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `button`.

Visibility: item.status === "DRAFT"

```tsx
type="button" className="billing-table-action" onClick={() => setEditor(item)}
```

Label/content expression:

```tsx
<Pencil size={15} /> Edit
```

#### ACT-local-sales-tsx-31-7

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `QuotationOutputControls`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="quotation-document-actions" buttonClassName="billing-table-action" loadDocument={() => Promise.resolve(localDocument(item, lead))} onError={setError}
```

Label/content expression:

```tsx

```

#### ACT-local-sales-tsx-31-8

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="billing-table-action billing-table-action-primary" disabled={["ACCEPTED", "REJECTED", "EXPIRED"].includes(item.status)} onClick={() => mutate((db) => setSalesQuotationStatus(db, item.id, "SENT"), setError)}
```

Label/content expression:

```tsx
<Send size={15} /> Mark sent
```

#### ACT-local-sales-tsx-31-9

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="billing-table-action" disabled={item.status !== "SENT"} onClick={() => mutate((db) => setSalesQuotationStatus(db, item.id, "ACCEPTED"), setError)}
```

Label/content expression:

```tsx
<Check size={15} /> Accept
```

#### STATE-local-sales-tsx-31-1

Owner `LocalSalesWorkspace`; [src/local-sales.tsx:31](../src/local-sales.tsx); tag `p`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

### src/materials-ui.tsx

#### ACT-materials-ui-tsx-20-1

Owner `InventoryPicker`; [src/materials-ui.tsx:20](../src/materials-ui.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={label} role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && options[activeIndex] ? `${listId}-${options[activeIndex]!.id}` : open && allOptionLabel ? `${listId}-all` : undefined} aria-autocomplete="list" disabled={disabled} value={query} placeholder="Type to search inventory" onFocus={() => { setOpen(true); setActiveIndex(0); }} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.min(index + 1, Math.max(options.length - 1, 0))); } else if (event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.max(index - 1, 0)); } else if (event.key === "Enter" && open && options[activeIndex] !== undefined) { event.preventDefault(); chooseOption(options[activeIndex]); } else if (event.key === "Enter" && open && allOptionLabel && activeIndex === 0) { event.preventDefault(); chooseOption(undefined); } else if (event.key === "Escape") setOpen(false); }}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-21-1

Owner `InventoryPicker`; [src/materials-ui.tsx:21](../src/materials-ui.tsx); tag `button`.

Visibility: open

```tsx
type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseOption(option)}
```

Label/content expression:

```tsx
{option ? pickerLabel(option) : allOptionLabel}
```

#### ACT-materials-ui-tsx-29-1

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `InventoryPicker`.

Visibility: editing

```tsx
inventory={inventory} value={itemId} onChange={setItemId} label="Item"
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-29-2

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `input`.

Visibility: editing

```tsx
aria-label="Qty" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-29-3

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `input`.

Visibility: issued; editing

```tsx
aria-label="Edit request note" placeholder="Note required" value={note} onChange={(event) => setNote(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-29-4

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `button`.

Visibility: editing

```tsx
type="button" className="grid-action" onClick={() => { const ok = run((db) => issued ? editIssuedMaterialRowForActor(db, row.id, actor.id, itemId, qty, note) : draft ? updateMaterialRowForActor(db, row.id, actor.id, itemId, qty) : reRequestMaterialRowForActor(db, row.id, actor.id, itemId, qty)); if (ok) setEditing(false); }}
```

Label/content expression:

```tsx
Save
```

#### ACT-materials-ui-tsx-29-5

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `button`.

Visibility: editing

```tsx
type="button" className="grid-action" onClick={() => setEditing(false)}
```

Label/content expression:

```tsx
Cancel
```

#### ACT-materials-ui-tsx-29-6

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `button`.

Visibility: actions.includes("request"); editing

```tsx
type="button" className="grid-action" onClick={() => run((db) => requestMaterialRowForActor(db, row.id, actor.id))}
```

Label/content expression:

```tsx
Request Item
```

#### ACT-materials-ui-tsx-29-7

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `button`.

Visibility: (actions.includes("edit") \|\| actions.includes("re-request") \|\| issued); editing

```tsx
type="button" className="grid-action" onClick={() => setEditing(true)}
```

Label/content expression:

```tsx
Edit Request
```

#### ACT-materials-ui-tsx-29-8

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `button`.

Visibility: actions.includes("cancel"); editing

```tsx
type="button" className="grid-action grid-action-danger" onClick={() => run((db) => cancelMaterialRowForActor(db, row.id, actor.id))}
```

Label/content expression:

```tsx
Cancel Request
```

#### ACT-materials-ui-tsx-29-9

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `button`.

Visibility: actions.includes("delete"); editing

```tsx
type="button" className="grid-action grid-action-danger" onClick={() => run((db) => deleteMaterialRowForActor(db, row.id, actor.id))}
```

Label/content expression:

```tsx
Delete
```

#### STATE-materials-ui-tsx-29-1

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `p`.

Visibility: warning

```tsx
className="permission-note" role="status"
```

Label/content expression:

```tsx
{warning}
```

#### STATE-materials-ui-tsx-29-2

Owner `MaterialRow`; [src/materials-ui.tsx:29](../src/materials-ui.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-materials-ui-tsx-41-1

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `InventoryPicker`.

Visibility: !editable

```tsx
inventory={inventory} value={itemId} onChange={setItemId} label="Item"
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-41-2

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `input`.

Visibility: !editable

```tsx
aria-label="Qty" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-41-3

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `button`.

Visibility: !editable

```tsx
type="button" className="primary-action" onClick={add}
```

Label/content expression:

```tsx
Add Row
```

#### FORM-materials-ui-tsx-41-1

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `form`.

Visibility: !editable

```tsx
className="material-new-item" onSubmit={(event) => { event.preventDefault(); requestNew(); }}
```

Label/content expression:

```tsx
<h5>Request New Item</h5> <label>Item name<input required value={newItem.item_name} onChange={(event) => setNewItem({ ...newItem, item_name: event.target.value })} /></label> <label>Quantity<input required type="number" min="0.01" step="0.01" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: Number(event.target.value) })} /></label> <label>Unit<input required value={newItem.unit} onChange={(event) => setNewItem({ ...newItem, unit: event.target.value })} /></label> <button className="secondary-action">Request New Item</button>
```

#### ACT-materials-ui-tsx-41-4

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `input`.

Visibility: !editable

```tsx
required value={newItem.item_name} onChange={(event) => setNewItem({ ...newItem, item_name: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-41-5

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `input`.

Visibility: !editable

```tsx
required type="number" min="0.01" step="0.01" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-41-6

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `input`.

Visibility: !editable

```tsx
required value={newItem.unit} onChange={(event) => setNewItem({ ...newItem, unit: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-materials-ui-tsx-41-7

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `button`.

Visibility: !editable

```tsx
className="secondary-action"
```

Label/content expression:

```tsx
Request New Item
```

#### STATE-materials-ui-tsx-41-1

Owner `JobMaterialsPanel`; [src/materials-ui.tsx:41](../src/materials-ui.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

### src/pagination-toolbar.tsx

#### ACT-pagination-toolbar-tsx-24-1

Owner `PaginationToolbar`; [src/pagination-toolbar.tsx:24](../src/pagination-toolbar.tsx); tag `PageSizeSelect`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
ariaLabel={pageSizeAriaLabel} value={pageSize} onChange={onPageSizeChange}
```

Label/content expression:

```tsx

```

#### ACT-pagination-toolbar-tsx-25-1

Owner `PaginationToolbar`; [src/pagination-toolbar.tsx:25](../src/pagination-toolbar.tsx); tag `ResultPagination`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
page={page} pageCount={pageCount} onChange={onPageChange}
```

Label/content expression:

```tsx

```

#### ACT-pagination-toolbar-tsx-35-1

Owner `ResultPagination`; [src/pagination-toolbar.tsx:35](../src/pagination-toolbar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" aria-label="First page" title="First page" disabled={atFirstPage} onClick={() => onChange(1)}
```

Label/content expression:

```tsx
<ChevronFirst aria-hidden="true" size={18} />
```

#### ACT-pagination-toolbar-tsx-36-1

Owner `ResultPagination`; [src/pagination-toolbar.tsx:36](../src/pagination-toolbar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" aria-label="Previous page" title="Previous page" disabled={atFirstPage} onClick={() => onChange(page - 1)}
```

Label/content expression:

```tsx
<ChevronLeft aria-hidden="true" size={18} />
```

#### ACT-pagination-toolbar-tsx-41-1

Owner `ResultPagination`; [src/pagination-toolbar.tsx:41](../src/pagination-toolbar.tsx); tag `button`.

Visibility: token === "ellipsis"

```tsx
type="button" key={token} aria-label={`Page ${token}`} aria-current={page === token ? "page" : undefined} className={page === token ? "active" : ""} onClick={() => onChange(token)}
```

Label/content expression:

```tsx
{token}
```

#### ACT-pagination-toolbar-tsx-43-1

Owner `ResultPagination`; [src/pagination-toolbar.tsx:43](../src/pagination-toolbar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" aria-label="Next page" title="Next page" disabled={atLastPage} onClick={() => onChange(page + 1)}
```

Label/content expression:

```tsx
<ChevronRight aria-hidden="true" size={18} />
```

#### ACT-pagination-toolbar-tsx-44-1

Owner `ResultPagination`; [src/pagination-toolbar.tsx:44](../src/pagination-toolbar.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" aria-label="Last page" title="Last page" disabled={atLastPage} onClick={() => onChange(pageCount)}
```

Label/content expression:

```tsx
<ChevronLast aria-hidden="true" size={18} />
```

### src/quotation-dialog.tsx

#### ACT-quotation-dialog-tsx-26-1

Owner `CatalogDescriptionCombobox`; [src/quotation-dialog.tsx:26](../src/quotation-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required role="combobox" aria-label={`Catalog description for line ${lineNumber}`} aria-expanded={open} aria-controls={listId} aria-activedescendant={open && matches[activeIndex] ? `${listId}-${matches[activeIndex].id}` : undefined} aria-autocomplete="list" placeholder="Type a description or search catalog" value={value} onFocus={openOptions} onClick={() => !open && openOptions()} onChange={(event) => { onChange(event.target.value); openOptions(); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={(event) => { if (event.key === "ArrowDown" \|\| event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActiveIndex((index) => event.key === "ArrowDown" ? Math.min(index + 1, Math.max(matches.length - 1, 0)) : Math.max(index - 1, 0)); } else if (event.key === "Enter" && open && matches[activeIndex]) { event.preventDefault(); choose(matches[activeIndex]); } else if (event.key === "Escape") { event.preventDefault(); setOpen(false); } }}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-27-1

Owner `CatalogDescriptionCombobox`; [src/quotation-dialog.tsx:27](../src/quotation-dialog.tsx); tag `button`.

Visibility: matches.length; open

```tsx
type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(task)}
```

Label/content expression:

```tsx
{task.name} · {money(task.rate)} · GST {task.gstRate} %
```

#### STATE-quotation-dialog-tsx-27-1

Owner `CatalogDescriptionCombobox`; [src/quotation-dialog.tsx:27](../src/quotation-dialog.tsx); tag `li`.

Visibility: matches.length; open

```tsx
className="picker-stock" role="status"
```

Label/content expression:

```tsx
No catalog matches — your description will be saved as entered.
```

#### STATE-quotation-dialog-tsx-41-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:41](../src/quotation-dialog.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title={quotation ? "Edit quotation" : "New quotation"} subtitle={quotation ? `${quotation.quotationNo} · Draft` : "Create a frozen quotation document"} onClose={onClose} className="dialog-document-editor quotation-dialog" footer={<button className="primary-action" type="submit" form="quotation-editor-form" disabled={busy}>{quotation ? "Save quotation" : "Create quotation"}</button>}
```

Label/content expression:

```tsx
<form id="quotation-editor-form" className="billing-dialog-form quotation-editor-form" onSubmit={submit}> <div className="form-grid"><label>Lead<select data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}><option value={0}>Select lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}</select></label><label>Valid until<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} /></label><label>Template<select required value={templateId} onChange={(event) => selectTemplate(event.target.value)}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}</select></label><label>Discount<input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label></div> <label className="quotation-notes">Customer notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label> <div className="estimate-items"><div className="line-items-header"><strong>Line items</strong><button type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus size={16} />Add Item</button></div>{catalogError && <p className="error-text" role="alert">Service catalog unavailable: {catalogError}</p>}<div className="estimate-item estimate-item-heading quotation-item-heading"><span>Catalog description</span><span>Quantity</span><span>Rate</span><span>GST rate</span><span>Action</span></div>{lines.map((line, index) => <div className="estimate-item quotation-item" key={line.id ?? index}><CatalogDescriptionCombobox lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)} /><input aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })} /><input aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })} /><input aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })} /><button type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}>Remove</button></div>)}</div> <QuotationTotals subtotal={amount.subtotal} discount={Number(discount) \|\| 0} gst={amount.gst} total={amount.total} /> </form>
```

#### ACT-quotation-dialog-tsx-41-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:41](../src/quotation-dialog.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form="quotation-editor-form" disabled={busy}
```

Label/content expression:

```tsx
{quotation ? "Save quotation" : "Create quotation"}
```

#### FORM-quotation-dialog-tsx-41-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:41](../src/quotation-dialog.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id="quotation-editor-form" className="billing-dialog-form quotation-editor-form" onSubmit={submit}
```

Label/content expression:

```tsx
 <div className="form-grid"><label>Lead<select data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}><option value={0}>Select lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}</select></label><label>Valid until<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} /></label><label>Template<select required value={templateId} onChange={(event) => selectTemplate(event.target.value)}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}</select></label><label>Discount<input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label></div> <label className="quotation-notes">Customer notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label> <div className="estimate-items"><div className="line-items-header"><strong>Line items</strong><button type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus size={16} />Add Item</button></div>{catalogError && <p className="error-text" role="alert">Service catalog unavailable: {catalogError}</p>}<div className="estimate-item estimate-item-heading quotation-item-heading"><span>Catalog description</span><span>Quantity</span><span>Rate</span><span>GST rate</span><span>Action</span></div>{lines.map((line, index) => <div className="estimate-item quotation-item" key={line.id ?? index}><CatalogDescriptionCombobox lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)} /><input aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })} /><input aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })} /><input aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })} /><button type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}>Remove</button></div>)}</div> <QuotationTotals subtotal={amount.subtotal} discount={Number(discount) \|\| 0} gst={amount.gst} total={amount.total} /> 
```

#### ACT-quotation-dialog-tsx-42-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:42](../src/quotation-dialog.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>Select lead</option> {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}
```

#### ACT-quotation-dialog-tsx-42-2

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:42](../src/quotation-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-42-3

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:42](../src/quotation-dialog.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required value={templateId} onChange={(event) => selectTemplate(event.target.value)}
```

Label/content expression:

```tsx
{templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}
```

#### ACT-quotation-dialog-tsx-42-4

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:42](../src/quotation-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-43-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:43](../src/quotation-dialog.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={notes} onChange={(event) => setNotes(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-44-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}
```

Label/content expression:

```tsx
<Plus size={16} /> Add Item
```

#### ACT-quotation-dialog-tsx-44-2

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `CatalogDescriptionCombobox`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-44-3

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-44-4

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-44-5

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })}
```

Label/content expression:

```tsx

```

#### ACT-quotation-dialog-tsx-44-6

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}
```

Label/content expression:

```tsx
Remove
```

#### STATE-quotation-dialog-tsx-44-1

Owner `QuotationEditorDialog`; [src/quotation-dialog.tsx:44](../src/quotation-dialog.tsx); tag `p`.

Visibility: catalogError

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
Service catalog unavailable: {catalogError}
```

#### ACT-quotation-dialog-tsx-51-1

Owner `QuotationOutputControls`; [src/quotation-dialog.tsx:51](../src/quotation-dialog.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={buttonClassName} disabled={Boolean(busy)} aria-busy={Boolean(busy)} onClick={() => void run("download")}
```

Label/content expression:

```tsx
<Download size={15} /> {busy === "download" ? "Generating PDF…" : "Download PDF"}
```

#### ACT-quotation-dialog-tsx-51-2

Owner `QuotationOutputControls`; [src/quotation-dialog.tsx:51](../src/quotation-dialog.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className={buttonClassName} disabled={Boolean(busy)} aria-busy={Boolean(busy)} onClick={() => void run("print")}
```

Label/content expression:

```tsx
<Printer size={15} /> {busy === "print" ? "Preparing print…" : "Print"}
```

#### ACT-quotation-dialog-tsx-52-1

Owner `QuotationDownloadButton`; [src/quotation-dialog.tsx:52](../src/quotation-dialog.tsx); tag `QuotationOutputControls`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className={className} buttonClassName={buttonClassName} loadDocument={() => salesApi.document(config, quotationId)} onError={onError}
```

Label/content expression:

```tsx

```

#### STATE-quotation-dialog-tsx-53-1

Owner `QuotationDetailsDialog`; [src/quotation-dialog.tsx:53](../src/quotation-dialog.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title={`Quotation ${quotation.quotationNo}`} subtitle="Read-only frozen quotation" onClose={onClose} className="dialog-document-editor quotation-dialog" footer={<QuotationOutputControls loadDocument={document} onError={setError} className="quotation-output-controls" buttonClassName="billing-table-action" />}
```

Label/content expression:

```tsx
<div className="quotation-details-content">{error && <p className="error-text" role="alert">{error}</p>}<div className="form-grid"><p><strong>Customer</strong><br />{lead?.displayName ?? quotation.leadId}<br />{lead?.phone}</p><p><strong>Status</strong><br />{quotation.status}</p><p><strong>Valid until</strong><br />{quotation.validUntil ?? "—"}</p><p><strong>Template</strong><br />{templateName}</p></div><div className="table-wrap"><table aria-label="Quotation details"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>GST</th><th>Amount</th></tr></thead><tbody>{quotation.lines.map((line, index) => <tr key={line.id ?? index}><td>{line.description}</td><td>{line.quantity}</td><td>{money(line.rate)}</td><td>{line.gstRate}%</td><td>{money(line.quantity * line.rate)}</td></tr>)}</tbody></table></div>{quotation.customerNotes && <section className="quotation-notes"><strong>Notes</strong><p>{quotation.customerNotes}</p></section>}<QuotationTotals subtotal={quotation.subtotal} discount={quotation.discount} gst={quotation.gstAmount} total={quotation.total} /></div>
```

#### ACT-quotation-dialog-tsx-53-1

Owner `QuotationDetailsDialog`; [src/quotation-dialog.tsx:53](../src/quotation-dialog.tsx); tag `QuotationOutputControls`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
loadDocument={document} onError={setError} className="quotation-output-controls" buttonClassName="billing-table-action"
```

Label/content expression:

```tsx

```

#### STATE-quotation-dialog-tsx-53-2

Owner `QuotationDetailsDialog`; [src/quotation-dialog.tsx:53](../src/quotation-dialog.tsx); tag `p`.

Visibility: error

```tsx
className="error-text" role="alert"
```

Label/content expression:

```tsx
{error}
```

### src/quotation-filter-bar.tsx

#### ACT-quotation-filter-bar-tsx-4-1

Owner `QuotationFilterBar`; [src/quotation-filter-bar.tsx:4](../src/quotation-filter-bar.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search quotations" value={query} disabled={busy} onChange={(event) => onQueryChange(event.target.value)} placeholder="Quotation number or lead"
```

Label/content expression:

```tsx

```

#### ACT-quotation-filter-bar-tsx-4-2

Owner `QuotationFilterBar`; [src/quotation-filter-bar.tsx:4](../src/quotation-filter-bar.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Quotation created date" type="date" value={createdDate} disabled={busy} onChange={(event) => onCreatedDateChange(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-quotation-filter-bar-tsx-4-3

Owner `QuotationFilterBar`; [src/quotation-filter-bar.tsx:4](../src/quotation-filter-bar.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Quotation created month/year" type="month" value={createdMonth} disabled={busy} onChange={(event) => onCreatedMonthChange(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-quotation-filter-bar-tsx-4-4

Owner `QuotationFilterBar`; [src/quotation-filter-bar.tsx:4](../src/quotation-filter-bar.tsx); tag `FilterClearButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={onClear} disabled={busy}
```

Label/content expression:

```tsx

```

### src/remote-finance.tsx

#### ACT-remote-finance-tsx-75-1

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:75](../src/remote-finance.tsx); tag `button`.

Visibility: error

```tsx
onClick={() => void refresh()}
```

Label/content expression:

```tsx
Retry
```

#### STATE-remote-finance-tsx-75-1

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:75](../src/remote-finance.tsx); tag `div`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error} <button onClick={() => void refresh()}>Retry</button>
```

#### ACT-remote-finance-tsx-76-1

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:76](../src/remote-finance.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={selected?.id ?? 0} onChange={(event) => setSelectedId(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>Select job</option> {jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.status}</option>)}
```

#### ACT-remote-finance-tsx-77-1

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:77](../src/remote-finance.tsx); tag `button`.

Visibility: mode === "invoice"

```tsx
className="primary-action" disabled={busy \|\| Boolean(active) \|\| (requiresInvoiceReplacement(invoices) && !replacesInvoiceId)} onClick={issue}
```

Label/content expression:

```tsx
{replacesInvoiceId ? "Issue replacement invoice" : "Issue approved estimate"}
```

#### ACT-remote-finance-tsx-77-2

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:77](../src/remote-finance.tsx); tag `button`.

Visibility: replacesInvoiceId; mode === "invoice"

```tsx
disabled={busy} onClick={() => setReplacesInvoiceId(undefined)}
```

Label/content expression:

```tsx
Cancel replacement
```

#### ACT-remote-finance-tsx-77-3

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:77](../src/remote-finance.tsx); tag `InvoiceRows`.

Visibility: mode === "invoice"

```tsx
invoices={invoices} busy={busy} onDownload={download} onVoid={voidInvoice} onReplace={prepareReplacement} onCreditRefund={creditAndRefund}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-78-1

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:78](../src/remote-finance.tsx); tag `InvoiceRows`.

Visibility: mode === "payment"

```tsx
invoices={invoices} busy={busy} onDownload={download}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-78-2

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:78](../src/remote-finance.tsx); tag `input`.

Visibility: active; mode === "payment"

```tsx
min="0.01" type="number" value={payAmount} onChange={(event) => setPayAmount(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-78-3

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:78](../src/remote-finance.tsx); tag `select`.

Visibility: active; mode === "payment"

```tsx
value={method} onChange={(event) => setMethod(event.target.value as typeof method)}
```

Label/content expression:

```tsx
{["upi", "cash", "card", "bank_transfer", "other"].map((value) => <option key={value}>{value}</option>)}
```

#### ACT-remote-finance-tsx-78-4

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:78](../src/remote-finance.tsx); tag `input`.

Visibility: active; mode === "payment"

```tsx
value={reference} onChange={(event) => setReference(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-78-5

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:78](../src/remote-finance.tsx); tag `button`.

Visibility: active; mode === "payment"

```tsx
className="primary-action" disabled={busy \|\| active.status === "SETTLED"} onClick={pay}
```

Label/content expression:

```tsx
Record payment
```

#### ACT-remote-finance-tsx-78-6

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:78](../src/remote-finance.tsx); tag `button`.

Visibility: mode === "payment"

```tsx
disabled={busy} onClick={() => void download(payment.contentPath, payment.receiptNumber)}
```

Label/content expression:

```tsx
Download
```

#### ACT-remote-finance-tsx-79-1

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:79](../src/remote-finance.tsx); tag `button`.

Visibility: delivery; mode === "delivery"

```tsx
disabled={busy} onClick={() => void download(delivery.contentPath, delivery.gatePassNumber)}
```

Label/content expression:

```tsx
Download gate pass
```

#### ACT-remote-finance-tsx-79-2

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:79](../src/remote-finance.tsx); tag `InvoiceRows`.

Visibility: delivery; mode === "delivery"

```tsx
invoices={invoices} busy={busy} onDownload={download}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-79-3

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:79](../src/remote-finance.tsx); tag `input`.

Visibility: delivery; mode === "delivery"

```tsx
value={deliveredBy} onChange={(event) => setDeliveredBy(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-79-4

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:79](../src/remote-finance.tsx); tag `input`.

Visibility: delivery; mode === "delivery"

```tsx
min="0" type="number" value={finalOdometer} onChange={(event) => setFinalOdometer(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-79-5

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:79](../src/remote-finance.tsx); tag `input`.

Visibility: delivery; mode === "delivery"

```tsx
value={acknowledgement} onChange={(event) => setAcknowledgement(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-finance-tsx-79-6

Owner `RemoteFinanceWorkspace`; [src/remote-finance.tsx:79](../src/remote-finance.tsx); tag `button`.

Visibility: delivery; mode === "delivery"

```tsx
className="primary-action" disabled={busy \|\| active?.status !== "SETTLED" \|\| selected?.status !== "COMPLETED"} onClick={handover}
```

Label/content expression:

```tsx
Issue gate pass & hand over
```

#### ACT-remote-finance-tsx-85-1

Owner `InvoiceRows`; [src/remote-finance.tsx:85](../src/remote-finance.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={busy} onClick={() => void onDownload(invoice.contentPath, invoice.number)}
```

Label/content expression:

```tsx
Download
```

#### ACT-remote-finance-tsx-85-2

Owner `InvoiceRows`; [src/remote-finance.tsx:85](../src/remote-finance.tsx); tag `button`.

Visibility: onVoid && canVoidRemoteInvoice(invoice); (onVoid \|\| onReplace \|\| onCreditRefund)

```tsx
className="danger-action" disabled={busy} onClick={() => onVoid(invoice)}
```

Label/content expression:

```tsx
Void with reason
```

#### ACT-remote-finance-tsx-85-3

Owner `InvoiceRows`; [src/remote-finance.tsx:85](../src/remote-finance.tsx); tag `button`.

Visibility: onCreditRefund && (invoice.status === "PARTIAL" \|\| invoice.status === "SETTLED"); (onVoid \|\| onReplace \|\| onCreditRefund)

```tsx
className="danger-action" disabled={busy} onClick={() => onCreditRefund(invoice)}
```

Label/content expression:

```tsx
Credit & refund
```

#### ACT-remote-finance-tsx-85-4

Owner `InvoiceRows`; [src/remote-finance.tsx:85](../src/remote-finance.tsx); tag `button`.

Visibility: onReplace && canReplaceRemoteInvoice(invoice, activeExists); (onVoid \|\| onReplace \|\| onCreditRefund)

```tsx
disabled={busy} onClick={() => onReplace(invoice)}
```

Label/content expression:

```tsx
Issue replacement
```

### src/remote-followups.tsx

#### STATE-remote-followups-tsx-55-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:55](../src/remote-followups.tsx); tag `div`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### FORM-remote-followups-tsx-56-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:56](../src/remote-followups.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="store-filter-grid" onSubmit={search}
```

Label/content expression:

```tsx
<label className="list-search">Search all records<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, registration, job card, or invoice" /></label> <button className="primary-action" disabled={busy}>Search</button>
```

#### ACT-remote-followups-tsx-56-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:56](../src/remote-followups.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, registration, job card, or invoice"
```

Label/content expression:

```tsx

```

#### ACT-remote-followups-tsx-56-2

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:56](../src/remote-followups.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" disabled={busy}
```

Label/content expression:

```tsx
Search
```

#### ACT-remote-followups-tsx-64-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:64](../src/remote-followups.tsx); tag `button`.

Visibility: error

```tsx
onClick={() => void refresh()}
```

Label/content expression:

```tsx
Retry
```

#### STATE-remote-followups-tsx-64-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:64](../src/remote-followups.tsx); tag `div`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error} <button onClick={() => void refresh()}>Retry</button>
```

#### FORM-remote-followups-tsx-65-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:65](../src/remote-followups.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="form-grid" onSubmit={editing ? saveEdit : create}
```

Label/content expression:

```tsx
<h3>{formTitle}</h3> {!editing && <label>Job<select required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.vehicleNo} · {job.customerName}</option>)}</select></label>} <label>Due date<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label> <label>Note<textarea required rows={2} value={note} onChange={(event) => setNote(event.target.value)} /></label> {editing && <label>Outcome<textarea rows={2} value={outcome} onChange={(event) => setOutcome(event.target.value)} /></label>} <div className="action-row"><button className="primary-action" disabled={busy}>{editing ? "Save Follow-up" : "Create Follow-up"}</button>{editing && <button type="button" disabled={busy} onClick={() => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); }}>Cancel</button>}</div> 
```

#### ACT-remote-followups-tsx-66-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:66](../src/remote-followups.tsx); tag `select`.

Visibility: !editing

```tsx
required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}
```

Label/content expression:

```tsx
<option value={0}>Select job</option> {jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.vehicleNo} · {job.customerName}</option>)}
```

#### ACT-remote-followups-tsx-67-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:67](../src/remote-followups.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-followups-tsx-68-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:68](../src/remote-followups.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required rows={2} value={note} onChange={(event) => setNote(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-followups-tsx-69-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:69](../src/remote-followups.tsx); tag `textarea`.

Visibility: editing

```tsx
rows={2} value={outcome} onChange={(event) => setOutcome(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-remote-followups-tsx-70-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:70](../src/remote-followups.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" disabled={busy}
```

Label/content expression:

```tsx
{editing ? "Save Follow-up" : "Create Follow-up"}
```

#### ACT-remote-followups-tsx-70-2

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:70](../src/remote-followups.tsx); tag `button`.

Visibility: editing

```tsx
type="button" disabled={busy} onClick={() => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); }}
```

Label/content expression:

```tsx
Cancel
```

#### ACT-remote-followups-tsx-72-1

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:72](../src/remote-followups.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={busy} onClick={() => beginEdit(item)}
```

Label/content expression:

```tsx
Edit
```

#### ACT-remote-followups-tsx-72-2

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:72](../src/remote-followups.tsx); tag `button`.

Visibility: item.status === "OPEN"

```tsx
disabled={busy} onClick={() => complete(item)}
```

Label/content expression:

```tsx
Complete
```

#### ACT-remote-followups-tsx-72-3

Owner `RemoteFollowupsWorkspace`; [src/remote-followups.tsx:72](../src/remote-followups.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="grid-action-danger" disabled={busy} onClick={() => archive(item)}
```

Label/content expression:

```tsx
Archive
```

### src/remote-sales.tsx

#### ACT-remote-sales-tsx-28-1

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:28](../src/remote-sales.tsx); tag `DownloadMenu`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
report={salesLeadsReport(leads, createdMonth, query, stage)}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-28-2

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:28](../src/remote-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => { setSelectedLead(null); setLeadDialog("add"); }}
```

Label/content expression:

```tsx
Add Lead
```

#### ACT-remote-sales-tsx-28-3

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:28](../src/remote-sales.tsx); tag `SalesLeadFilterBar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
query={query} stage={stage} createdMonth={createdMonth} busy={busy} onQueryChange={setQuery} onStageChange={setStage} onCreatedMonthChange={setCreatedMonth} onClear={() => { setQuery(""); setStage(""); setCreatedMonth(""); }}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-28-4

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:28](../src/remote-sales.tsx); tag `SalesLeadDialog`.

Visibility: leadDialog

```tsx
lead={selectedLead ? leadDraft(selectedLead) : blankLeadDraft} editing={leadDialog === "edit"} busy={busy} onSave={saveLead} onClose={closeLeadDialog}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-28-5

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:28](../src/remote-sales.tsx); tag `SalesLeadRegister`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
leads={leads} busy={busy} onEdit={(lead) => { setSelectedLead(lead); setLeadDialog("edit"); }} onSave={saveInlineLead}
```

Label/content expression:

```tsx

```

#### STATE-remote-sales-tsx-28-1

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:28](../src/remote-sales.tsx); tag `p`.

Visibility: error

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error}
```

#### ACT-remote-sales-tsx-29-1

Owner `RemoteSalesWorkspace`; [src/remote-sales.tsx:29](../src/remote-sales.tsx); tag `QuotationWorkspace`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
config={config} leads={leads} quotations={quotations} templates={templates} error={error} busy={busy} query={query} onQueryChange={setQuery} createdDate={createdDate} onCreatedDateChange={setCreatedDate} createdMonth={createdMonth} onCreatedMonthChange={setCreatedMonth} run={run}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-40-1

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" onClick={() => setEditor("new")}
```

Label/content expression:

```tsx
New Quotation
```

#### ACT-remote-sales-tsx-40-2

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `QuotationEditorDialog`.

Visibility: editor

```tsx
config={config} leads={leads} templates={templates} quotation={editor === "new" ? undefined : editor} busy={busy} onClose={() => setEditor(null)} onSave={(input) => run(() => editor !== "new" ? salesApi.updateQuotation(config, editor.id, input) : salesApi.createQuotation(config, input), () => setEditor(null))}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-40-3

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `QuotationDetailsDialog`.

Visibility: details

```tsx
config={config} quotation={details} lead={leads.find((lead) => lead.id === details.leadId)} templateName={templates.find((template) => template.id === details.templateId)?.name ?? details.templateId} onClose={() => setDetails(null)}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-40-4

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `QuotationFilterBar`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
query={query} status={status} createdDate={createdDate} createdMonth={createdMonth} busy={busy} onQueryChange={onQueryChange} onStatusChange={onStatusChange} onCreatedDateChange={onCreatedDateChange} onCreatedMonthChange={onCreatedMonthChange} onClear={clearFilters}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-40-5

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="billing-table-action" onClick={() => setDetails(item)}
```

Label/content expression:

```tsx
<Eye size={15} /> View details
```

#### ACT-remote-sales-tsx-40-6

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `button`.

Visibility: item.status === "DRAFT"

```tsx
type="button" className="billing-table-action" disabled={busy} onClick={() => setEditor(item)}
```

Label/content expression:

```tsx
<Pencil size={15} /> Edit
```

#### ACT-remote-sales-tsx-40-7

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `QuotationDownloadButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
config={config} quotationId={item.id} className="quotation-document-actions" buttonClassName="billing-table-action" onError={setDocumentError}
```

Label/content expression:

```tsx

```

#### ACT-remote-sales-tsx-40-8

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="billing-table-action billing-table-action-primary" disabled={busy \|\| ["ACCEPTED", "REJECTED", "EXPIRED"].includes(item.status)} onClick={() => run(() => salesApi.status(config, item.id, "SENT"))}
```

Label/content expression:

```tsx
<Send size={15} /> Mark sent
```

#### ACT-remote-sales-tsx-40-9

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="billing-table-action" disabled={busy \|\| item.status !== "SENT"} onClick={() => run(() => salesApi.status(config, item.id, "ACCEPTED"))}
```

Label/content expression:

```tsx
<Check size={15} /> Accept
```

#### STATE-remote-sales-tsx-40-1

Owner `QuotationWorkspace`; [src/remote-sales.tsx:40](../src/remote-sales.tsx); tag `p`.

Visibility: (error \|\| documentError)

```tsx
className="api-error" role="alert"
```

Label/content expression:

```tsx
{error \|\| documentError}
```

### src/sales-lead-dialog.tsx

#### STATE-sales-lead-dialog-tsx-37-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:37](../src/sales-lead-dialog.tsx); tag `Dialog`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
wide title={editing ? "Edit Lead" : "Add Lead"} onClose={onClose} footer={<button className="primary-action" type="submit" form={formId} disabled={busy}>{editing ? "Save Changes" : "Save Lead"}</button>}
```

Label/content expression:

```tsx
 <form id={formId} className="form-grid" onSubmit={save}> <label>Name<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} /></label> <label>Phone<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} /></label> <label>Company<input disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })} /></label> <Switch label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })} /> <label>Email<input type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })} /></label> <Switch label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })} /> <label>Address<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} /></label> <label>Service interest<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} /></label> <label>Stage<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}><option value="NEW">New</option><option value="QUALIFIED">Qualified</option><option value="QUOTATION_SENT">Quotation sent</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label> <label>Temperature<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></label> <label>Follow-up date<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value \|\| null })} /></label> <Switch label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })} /> <label>Site visit date<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value \|\| null })} /></label> <label>Notes<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} /></label> </form> 
```

#### ACT-sales-lead-dialog-tsx-37-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:37](../src/sales-lead-dialog.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="primary-action" type="submit" form={formId} disabled={busy}
```

Label/content expression:

```tsx
{editing ? "Save Changes" : "Save Lead"}
```

#### FORM-sales-lead-dialog-tsx-38-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:38](../src/sales-lead-dialog.tsx); tag `form`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
id={formId} className="form-grid" onSubmit={save}
```

Label/content expression:

```tsx
 <label>Name<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} /></label> <label>Phone<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} /></label> <label>Company<input disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })} /></label> <Switch label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })} /> <label>Email<input type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })} /></label> <Switch label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })} /> <label>Address<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} /></label> <label>Service interest<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} /></label> <label>Stage<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}><option value="NEW">New</option><option value="QUALIFIED">Qualified</option><option value="QUOTATION_SENT">Quotation sent</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label> <label>Temperature<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></label> <label>Follow-up date<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value \|\| null })} /></label> <Switch label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })} /> <label>Site visit date<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value \|\| null })} /></label> <label>Notes<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} /></label> 
```

#### ACT-sales-lead-dialog-tsx-39-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:39](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-40-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:40](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
required value={draft.phone} onChange={(event) => update({ phone: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-41-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:41](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-42-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:42](../src/sales-lead-dialog.tsx); tag `Switch`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-43-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:43](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-44-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:44](../src/sales-lead-dialog.tsx); tag `Switch`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-45-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:45](../src/sales-lead-dialog.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.address} onChange={(event) => update({ address: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-46-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:46](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-47-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:47](../src/sales-lead-dialog.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}
```

Label/content expression:

```tsx
<option value="NEW">New</option> <option value="QUALIFIED">Qualified</option> <option value="QUOTATION_SENT">Quotation sent</option> <option value="WON">Won</option> <option value="LOST">Lost</option>
```

#### ACT-sales-lead-dialog-tsx-48-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:48](../src/sales-lead-dialog.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}
```

Label/content expression:

```tsx
<option value="HOT">Hot</option> <option value="WARM">Warm</option> <option value="COLD">Cold</option>
```

#### ACT-sales-lead-dialog-tsx-49-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:49](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value \|\| null })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-50-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:50](../src/sales-lead-dialog.tsx); tag `Switch`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-51-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:51](../src/sales-lead-dialog.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value \|\| null })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-dialog-tsx-52-1

Owner `SalesLeadDialog`; [src/sales-lead-dialog.tsx:52](../src/sales-lead-dialog.tsx); tag `textarea`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
value={draft.notes} onChange={(event) => update({ notes: event.target.value })}
```

Label/content expression:

```tsx

```

### src/sales-lead-register.tsx

#### ACT-sales-lead-register-tsx-81-1

Owner `SalesLeadFilterBar`; [src/sales-lead-register.tsx:81](../src/sales-lead-register.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Search leads" value={query} disabled={busy} onChange={(event) => onQueryChange(event.target.value)} placeholder="Name, company, or phone"
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-register-tsx-84-1

Owner `SalesLeadFilterBar`; [src/sales-lead-register.tsx:84](../src/sales-lead-register.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Lead status filter" value={stage} disabled={busy} onChange={(event) => onStageChange(event.target.value as LeadStage \| "")}
```

Label/content expression:

```tsx
 <option value="">All statuses</option> {leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)} 
```

#### ACT-sales-lead-register-tsx-90-1

Owner `SalesLeadFilterBar`; [src/sales-lead-register.tsx:90](../src/sales-lead-register.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label="Lead created month/year" type="month" value={createdMonth} disabled={busy} onChange={(event) => onCreatedMonthChange(event.target.value)}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-register-tsx-92-1

Owner `SalesLeadFilterBar`; [src/sales-lead-register.tsx:92](../src/sales-lead-register.tsx); tag `FilterClearButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={onClear} disabled={busy}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-register-tsx-124-1

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Stage for ${item.displayName}`} disabled={disabled} value={draft.stage} onChange={(event) => update(item, { stage: event.target.value as LeadFormDraft["stage"] })}
```

Label/content expression:

```tsx
{leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
```

#### ACT-sales-lead-register-tsx-124-2

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Temperature for ${item.displayName}`} disabled={disabled} value={draft.temperature} onChange={(event) => update(item, { temperature: event.target.value as LeadFormDraft["temperature"] })}
```

Label/content expression:

```tsx
<option value="HOT">Hot</option> <option value="WARM">Warm</option> <option value="COLD">Cold</option>
```

#### ACT-sales-lead-register-tsx-124-3

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Follow-up for ${item.displayName}`} disabled={disabled} type="date" value={draft.followUpDue ?? ""} onChange={(event) => update(item, { followUpDue: event.target.value \|\| null })}
```

Label/content expression:

```tsx

```

#### ACT-sales-lead-register-tsx-124-4

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={`Site visit for ${item.displayName}`} disabled={disabled} value={draft.siteVisitCompleted ? "yes" : "no"} onChange={(event) => update(item, { siteVisitCompleted: event.target.value === "yes", siteVisitDate: event.target.value === "yes" ? draft.siteVisitDate : null })}
```

Label/content expression:

```tsx
<option value="yes">Yes</option> <option value="no">No</option>
```

#### ACT-sales-lead-register-tsx-124-5

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="sales-lead-action sales-lead-action-secondary" disabled={disabled} onClick={() => onEdit(item)}
```

Label/content expression:

```tsx
Edit
```

#### ACT-sales-lead-register-tsx-124-6

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `button`.

Visibility: dirty

```tsx
type="button" className="primary-action sales-lead-action sales-lead-action-save" disabled={disabled} onClick={() => void save(item)}
```

Label/content expression:

```tsx
Save
```

#### ACT-sales-lead-register-tsx-124-7

Owner `SalesLeadRegister`; [src/sales-lead-register.tsx:124](../src/sales-lead-register.tsx); tag `button`.

Visibility: dirty

```tsx
type="button" className="sales-lead-action sales-lead-action-secondary" disabled={disabled} onClick={() => cancel(item.id)}
```

Label/content expression:

```tsx
Cancel
```

### src/ui-kit.tsx

#### ACT-ui-kit-tsx-7-1

Owner `FilterClearButton`; [src/ui-kit.tsx:7](../src/ui-kit.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="filter-clear-action" onClick={onClick} disabled={disabled}
```

Label/content expression:

```tsx
{label}
```

#### ACT-ui-kit-tsx-11-1

Owner `ListSearchActions`; [src/ui-kit.tsx:11](../src/ui-kit.tsx); tag `FilterClearButton`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
onClick={onClear}
```

Label/content expression:

```tsx

```

#### ACT-ui-kit-tsx-15-1

Owner `Switch`; [src/ui-kit.tsx:15](../src/ui-kit.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" role="switch" aria-label={label} aria-checked={checked} className={`ui-switch ${className}`.trim()} onClick={() => onCheckedChange(!checked)}
```

Label/content expression:

```tsx
 <span className="ui-switch-control" aria-hidden="true"><span /></span> <span className="ui-switch-label">{label}</span> <span className="ui-switch-state" aria-hidden="true">{checked ? "On" : "Off"}</span> 
```

#### ACT-ui-kit-tsx-21-1

Owner `PageSizeSelect`; [src/ui-kit.tsx:21](../src/ui-kit.tsx); tag `select`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
aria-label={ariaLabel} value={value} onChange={(event) => onChange(Number(event.target.value))}
```

Label/content expression:

```tsx
{PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
```

#### ACT-ui-kit-tsx-37-1

Owner `DownloadMenu`; [src/ui-kit.tsx:37](../src/ui-kit.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="download-menu-trigger" disabled={disabled} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}
```

Label/content expression:

```tsx
<Download size={16} /> Download
```

#### ACT-ui-kit-tsx-38-1

Owner `DownloadMenu`; [src/ui-kit.tsx:38](../src/ui-kit.tsx); tag `button`.

Visibility: open

```tsx
type="button" role="menuitem" onClick={() => run(downloadExcel)}
```

Label/content expression:

```tsx
Excel (.xlsx)
```

#### ACT-ui-kit-tsx-38-2

Owner `DownloadMenu`; [src/ui-kit.tsx:38](../src/ui-kit.tsx); tag `button`.

Visibility: open

```tsx
type="button" role="menuitem" onClick={() => run(downloadPdf)}
```

Label/content expression:

```tsx
PDF
```

#### ACT-ui-kit-tsx-77-1

Owner `Dialog`; [src/ui-kit.tsx:77](../src/ui-kit.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
```

Label/content expression:

```tsx
 <div ref={panelRef} tabIndex={-1} className={`${wide ? 'dialog-panel dialog-wide' : 'dialog-panel'}${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}> <div className="dialog-header"><div><h2 id={titleId}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div> <div className="dialog-body">{children}</div> <div className="dialog-footer"><div className="dialog-footer-actions">{footer}</div><button type="button" className="back-action" onClick={onClose}>Go Back</button></div> </div> 
```

#### STATE-ui-kit-tsx-78-1

Owner `Dialog`; [src/ui-kit.tsx:78](../src/ui-kit.tsx); tag `div`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
ref={panelRef} tabIndex={-1} className={`${wide ? 'dialog-panel dialog-wide' : 'dialog-panel'}${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}
```

Label/content expression:

```tsx
 <div className="dialog-header"><div><h2 id={titleId}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div> <div className="dialog-body">{children}</div> <div className="dialog-footer"><div className="dialog-footer-actions">{footer}</div><button type="button" className="back-action" onClick={onClose}>Go Back</button></div> 
```

#### ACT-ui-kit-tsx-81-1

Owner `Dialog`; [src/ui-kit.tsx:81](../src/ui-kit.tsx); tag `button`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
type="button" className="back-action" onClick={onClose}
```

Label/content expression:

```tsx
Go Back
```

#### ACT-ui-kit-tsx-111-1

Owner `SearchSelect`; [src/ui-kit.tsx:111](../src/ui-kit.tsx); tag `input`.

Visibility: No enclosing JSX condition captured; owning component/parent routing may still guard it.

```tsx
role="combobox" aria-label={label} aria-expanded={open} aria-controls={listId} aria-autocomplete="list" disabled={disabled} placeholder={placeholder} value={open ? query : selected?.label ?? ''} onFocus={() => { if (openOnFocus) { setQuery(''); setOpen(true); } }} onClick={() => { if (!open) { setQuery(''); setOpen(true); } }} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={(event) => { if (event.key === 'Enter' && open) { event.preventDefault(); if (shown[0]) { onChange(shown[0].value); setOpen(false); } } else if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); } }}
```

Label/content expression:

```tsx

```

#### ACT-ui-kit-tsx-112-1

Owner `SearchSelect`; [src/ui-kit.tsx:112](../src/ui-kit.tsx); tag `button`.

Visibility: shown.length; open

```tsx
type="button" role="option" aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option.value); setOpen(false); }}
```

Label/content expression:

```tsx
{option.label}
```

## Operation index — persistence, validation and errors

Exact implementations are in [operation contracts](evidence/evidence-operation-contracts.md). This index covers exports across database, auth, data adapters, helpers, settings and rendering/output modules; it is not a proposed REST API list.

| Operation | Source |
|---|---|
|`resolveRoleMenuPageKeys`|[src/admin-demo-state.ts:158-161](../src/admin-demo-state.ts)|
|`createDefaultAdminDemoState`|[src/admin-demo-state.ts:469-483](../src/admin-demo-state.ts)|
|`normalizeAppTheme`|[src/admin-demo-state.ts:485-489](../src/admin-demo-state.ts)|
|`loadAdminDemoState`|[src/admin-demo-state.ts:564-574](../src/admin-demo-state.ts)|
|`saveAdminDemoState`|[src/admin-demo-state.ts:576-580](../src/admin-demo-state.ts)|
|`resetAdminDemoState`|[src/admin-demo-state.ts:582-585](../src/admin-demo-state.ts)|
|`addDemoRole`|[src/admin-demo-state.ts:599-625](../src/admin-demo-state.ts)|
|`updateDemoRole`|[src/admin-demo-state.ts:627-646](../src/admin-demo-state.ts)|
|`archiveDemoRole`|[src/admin-demo-state.ts:648-656](../src/admin-demo-state.ts)|
|`updateRolePageAccess`|[src/admin-demo-state.ts:667-671](../src/admin-demo-state.ts)|
|`resolvePermittedPages`|[src/admin-demo-state.ts:673-678](../src/admin-demo-state.ts)|
|`updateBusinessSettings`|[src/admin-demo-state.ts:680-682](../src/admin-demo-state.ts)|
|`updateAppTheme`|[src/admin-demo-state.ts:684-686](../src/admin-demo-state.ts)|
|`normalizeBusinessSettings`|[src/admin-demo-state.ts:688-740](../src/admin-demo-state.ts)|
|`validateBusinessSettings`|[src/admin-demo-state.ts:742-763](../src/admin-demo-state.ts)|
|`createReportTemplate`|[src/admin-demo-state.ts:786-796](../src/admin-demo-state.ts)|
|`updateReportTemplate`|[src/admin-demo-state.ts:798-818](../src/admin-demo-state.ts)|
|`activateReportTemplate`|[src/admin-demo-state.ts:820-822](../src/admin-demo-state.ts)|
|`deleteReportTemplate`|[src/admin-demo-state.ts:824-829](../src/admin-demo-state.ts)|
|`saveCompanyIdentity`|[src/admin-demo-state.ts:834-843](../src/admin-demo-state.ts)|
|`appendDemoLog`|[src/admin-demo-state.ts:853-864](../src/admin-demo-state.ts)|
|`filterDemoLogs`|[src/admin-demo-state.ts:866-885](../src/admin-demo-state.ts)|
|`clearDemoLogs`|[src/admin-demo-state.ts:887-889](../src/admin-demo-state.ts)|
|`confirmInventoryImport`|[src/admin-demo-state.ts:921-967](../src/admin-demo-state.ts)|
|`enforceLogRetention`|[src/admin-demo-state.ts:969-980](../src/admin-demo-state.ts)|
|`shiftCalendarMonth`|[src/advance-booking-range.ts:11-15](../src/advance-booking-range.ts)|
|`localDateOnly`|[src/advance-booking-range.ts:23-25](../src/advance-booking-range.ts)|
|`advanceBookingRange`|[src/advance-booking-range.ts:31-38](../src/advance-booking-range.ts)|
|`isAdvanceBookingDate`|[src/advance-booking-range.ts:40-42](../src/advance-booking-range.ts)|
|`clampAdvanceBookingDate`|[src/advance-booking-range.ts:44-48](../src/advance-booking-range.ts)|
|`datesForCalendarMonth`|[src/advance-booking-range.ts:50-59](../src/advance-booking-range.ts)|
|`loadAuthConfig`|[src/auth.ts:46-55](../src/auth.ts)|
|`beginCognitoLogin`|[src/auth.ts:57-72](../src/auth.ts)|
|`completeCognitoCallback`|[src/auth.ts:99-113](../src/auth.ts)|
|`authenticatedFetch`|[src/auth.ts:115-119](../src/auth.ts)|
|`loadWorkshopSession`|[src/auth.ts:121-129](../src/auth.ts)|
|`endCognitoSession`|[src/auth.ts:131-136](../src/auth.ts)|
|`expectedBookingsForDate`|[src/booking-followup.ts:12-56](../src/booking-followup.ts)|
|`cashflowFacts`|[src/dashboard-metrics.ts:43-73](../src/dashboard-metrics.ts)|
|`dashboardFacts`|[src/dashboard-metrics.ts:79-111](../src/dashboard-metrics.ts)|
|`dataFlowMonths`|[src/data-flow.ts:15-17](../src/data-flow.ts)|
|`dataFlowDates`|[src/data-flow.ts:19-21](../src/data-flow.ts)|
|`dataFlowSearchText`|[src/data-flow.ts:23-25](../src/data-flow.ts)|
|`filterDataFlowJobs`|[src/data-flow.ts:27-34](../src/data-flow.ts)|
|`summarizeJobLifecycle`|[src/data-flow.ts:62-75](../src/data-flow.ts)|
|`buildDataFlowTimeline`|[src/data-flow.ts:88-160](../src/data-flow.ts)|
|`buildGhostSteps`|[src/data-flow.ts:170-186](../src/data-flow.ts)|
|`buildStageRows`|[src/data-flow.ts:197-213](../src/data-flow.ts)|
|`deriveChecklistSubStatus`|[src/db.ts:133-141](../src/db.ts)|
|`openWorkshopDb`|[src/db.ts:156-186](../src/db.ts)|
|`persist`|[src/db.ts:188-199](../src/db.ts)|
|`exportPersistableDatabase`|[src/db.ts:201-217](../src/db.ts)|
|`readState`|[src/db.ts:219-603](../src/db.ts)|
|`presentAdvisors`|[src/db.ts:617-628](../src/db.ts)|
|`setAdvisorPresent`|[src/db.ts:630-640](../src/db.ts)|
|`assignAdvisor`|[src/db.ts:643-666](../src/db.ts)|
|`ensureDemoAdvisors`|[src/db.ts:669-723](../src/db.ts)|
|`ensureDemoTeamStructure`|[src/db.ts:731-763](../src/db.ts)|
|`loadLargeDemoDataset`|[src/db.ts:769-1083](../src/db.ts)|
|`login`|[src/db.ts:1134-1140](../src/db.ts)|
|`createUser`|[src/db.ts:1152-1167](../src/db.ts)|
|`updateUser`|[src/db.ts:1169-1187](../src/db.ts)|
|`archiveUser`|[src/db.ts:1189-1215](../src/db.ts)|
|`createCustomer`|[src/db.ts:1237-1252](../src/db.ts)|
|`updateCustomer`|[src/db.ts:1254-1270](../src/db.ts)|
|`archiveCustomer`|[src/db.ts:1272-1274](../src/db.ts)|
|`createVehicle`|[src/db.ts:1276-1291](../src/db.ts)|
|`updateVehicle`|[src/db.ts:1293-1312](../src/db.ts)|
|`archiveVehicle`|[src/db.ts:1314-1316](../src/db.ts)|
|`updateVisit`|[src/db.ts:1318-1346](../src/db.ts)|
|`bookingCapacityForDate`|[src/db.ts:1394-1417](../src/db.ts)|
|`setBookingCapacityForDate`|[src/db.ts:1420-1438](../src/db.ts)|
|`createBooking`|[src/db.ts:1546-1601](../src/db.ts)|
|`updateBooking`|[src/db.ts:1604-1651](../src/db.ts)|
|`confirmBooking`|[src/db.ts:1653-1667](../src/db.ts)|
|`rescheduleBooking`|[src/db.ts:1669-1739](../src/db.ts)|
|`cancelBooking`|[src/db.ts:1741-1755](../src/db.ts)|
|`markBookingNoShow`|[src/db.ts:1757-1771](../src/db.ts)|
|`recordBookingCall`|[src/db.ts:1773-1787](../src/db.ts)|
|`checkInBooking`|[src/db.ts:1795-1852](../src/db.ts)|
|`receiveVehicle`|[src/db.ts:1854-2035](../src/db.ts)|
|`isTerminalMainStatus`|[src/db.ts:2052-2054](../src/db.ts)|
|`canMutateJobLifecycle`|[src/db.ts:2056-2064](../src/db.ts)|
|`canTransitionJobStatus`|[src/db.ts:2068-2076](../src/db.ts)|
|`assertJobLifecycleMutationAccess`|[src/db.ts:2078-2100](../src/db.ts)|
|`createServiceCatalogItemForActor`|[src/db.ts:2125-2156](../src/db.ts)|
|`updateServiceCatalogItemForActor`|[src/db.ts:2158-2190](../src/db.ts)|
|`archiveServiceCatalogItemForActor`|[src/db.ts:2199-2209](../src/db.ts)|
|`addJobTaskListItemForActor`|[src/db.ts:2211-2247](../src/db.ts)|
|`updateJobTaskListItemForActor`|[src/db.ts:2249-2269](../src/db.ts)|
|`archiveJobTaskListItemForActor`|[src/db.ts:2271-2286](../src/db.ts)|
|`prefillEstimateFromTaskListForActor`|[src/db.ts:2289-2346](../src/db.ts)|
|`transitionJobStatusForActor`|[src/db.ts:2348-2389](../src/db.ts)|
|`saveEstimateForActor`|[src/db.ts:2423-2492](../src/db.ts)|
|`updateJobCard`|[src/db.ts:2501-2548](../src/db.ts)|
|`updateJobCardForActor`|[src/db.ts:2550-2569](../src/db.ts)|
|`saveJobDetailsForActor`|[src/db.ts:2592-2641](../src/db.ts)|
|`updateJobSheetForActor`|[src/db.ts:2644-2651](../src/db.ts)|
|`updateEstimatedDeliveryForActor`|[src/db.ts:2654-2665](../src/db.ts)|
|`setDamageMarksForActor`|[src/db.ts:2668-2679](../src/db.ts)|
|`cancelJobCard`|[src/db.ts:2684-2695](../src/db.ts)|
|`archiveJobCardForActor`|[src/db.ts:2697-2706](../src/db.ts)|
|`cancelJobCardStatus`|[src/db.ts:2712-2714](../src/db.ts)|
|`createEstimate`|[src/db.ts:2716-2746](../src/db.ts)|
|`updateEstimate`|[src/db.ts:2748-2769](../src/db.ts)|
|`createEstimateItem`|[src/db.ts:2771-2793](../src/db.ts)|
|`updateEstimateItem`|[src/db.ts:2795-2817](../src/db.ts)|
|`archiveEstimateItem`|[src/db.ts:2819-2821](../src/db.ts)|
|`approveEstimateForActor`|[src/db.ts:2824-2845](../src/db.ts)|
|`approveEstimate`|[src/db.ts:2847-2872](../src/db.ts)|
|`createMaterialRequest`|[src/db.ts:2874-2901](../src/db.ts)|
|`updateMaterialRequest`|[src/db.ts:2903-2933](../src/db.ts)|
|`archiveMaterialRequest`|[src/db.ts:2935-2954](../src/db.ts)|
|`createLocalPurchase`|[src/db.ts:2983-2999](../src/db.ts)|
|`updateLocalPurchase`|[src/db.ts:3002-3022](../src/db.ts)|
|`archiveLocalPurchase`|[src/db.ts:3024-3026](../src/db.ts)|
|`createMaterialPurchaseRequestForActor`|[src/db.ts:3045-3061](../src/db.ts)|
|`purchaseStockAndIssueForActor`|[src/db.ts:3068-3081](../src/db.ts)|
|`createSupplierForActor`|[src/db.ts:3145-3165](../src/db.ts)|
|`updateSupplierForActor`|[src/db.ts:3167-3188](../src/db.ts)|
|`archiveSupplierForActor`|[src/db.ts:3190-3200](../src/db.ts)|
|`createInwardPurchaseDraft`|[src/db.ts:3321-3342](../src/db.ts)|
|`updateInwardPurchaseDraftForActor`|[src/db.ts:3344-3378](../src/db.ts)|
|`sendInwardPurchaseForPoApprovalForActor`|[src/db.ts:3447-3531](../src/db.ts)|
|`approveInwardPurchaseForActor`|[src/db.ts:3533-3571](../src/db.ts)|
|`receiveAndPostInwardPurchaseForActor`|[src/db.ts:3573-3725](../src/db.ts)|
|`submitInwardPurchaseForActor`|[src/db.ts:3728-3783](../src/db.ts)|
|`previousPurchaseHistoryForItem`|[src/db.ts:3854-3872](../src/db.ts)|
|`savePurchaseOrderQuotationForActor`|[src/db.ts:3874-3903](../src/db.ts)|
|`purchaseRequestNumberForOrdinal`|[src/db.ts:3905-3914](../src/db.ts)|
|`purchaseRequestOrdinal`|[src/db.ts:3916-3925](../src/db.ts)|
|`nextPurchaseRequestNumberForOrders`|[src/db.ts:3927-3935](../src/db.ts)|
|`createPurchaseRequestForActor`|[src/db.ts:4009-4030](../src/db.ts)|
|`updatePurchaseRequestForActor`|[src/db.ts:4033-4053](../src/db.ts)|
|`cancelPurchaseRequestForActor`|[src/db.ts:4055-4065](../src/db.ts)|
|`approvePurchaseRequestForActor`|[src/db.ts:4073-4165](../src/db.ts)|
|`issuePurchaseOrderForActor`|[src/db.ts:4171-4206](../src/db.ts)|
|`recordPurchaseOrderReceiptForActor`|[src/db.ts:4214-4250](../src/db.ts)|
|`confirmPurchaseOrderForActor`|[src/db.ts:4257-4290](../src/db.ts)|
|`closePurchaseOrderForActor`|[src/db.ts:4297-4370](../src/db.ts)|
|`createPurchaseOrderForActor`|[src/db.ts:4428-4448](../src/db.ts)|
|`updatePurchaseOrderForActor`|[src/db.ts:4449-4475](../src/db.ts)|
|`setPurchaseOrderStatusForActor`|[src/db.ts:4476-4512](../src/db.ts)|
|`recordStockInwardForActor`|[src/db.ts:4553-4624](../src/db.ts)|
|`reviseInwardPurchaseForActor`|[src/db.ts:4627-4737](../src/db.ts)|
|`issueMaterialQty`|[src/db.ts:4739-4781](../src/db.ts)|
|`issueMaterial`|[src/db.ts:4783-4794](../src/db.ts)|
|`reconcileMaterialQty`|[src/db.ts:4796-4853](../src/db.ts)|
|`reconcileMaterial`|[src/db.ts:4855-4863](../src/db.ts)|
|`approvalBlocksMaterialOperations`|[src/db.ts:4884-4888](../src/db.ts)|
|`submitMaterialApprovalForActor`|[src/db.ts:4921-4970](../src/db.ts)|
|`decideMaterialApprovalForActor`|[src/db.ts:4972-5039](../src/db.ts)|
|`resubmitMaterialApprovalForActor`|[src/db.ts:5041-5094](../src/db.ts)|
|`materialStockOnHand`|[src/db.ts:5154-5160](../src/db.ts)|
|`addMaterialRowForActor`|[src/db.ts:5162-5176](../src/db.ts)|
|`updateMaterialRowForActor`|[src/db.ts:5178-5191](../src/db.ts)|
|`deleteMaterialRowForActor`|[src/db.ts:5193-5200](../src/db.ts)|
|`requestMaterialRowForActor`|[src/db.ts:5231-5242](../src/db.ts)|
|`reRequestMaterialRowForActor`|[src/db.ts:5245-5265](../src/db.ts)|
|`releaseMaterialRowForActor`|[src/db.ts:5303-5357](../src/db.ts)|
|`editIssuedMaterialRowForActor`|[src/db.ts:5360-5423](../src/db.ts)|
|`cancelMaterialRowForActor`|[src/db.ts:5426-5437](../src/db.ts)|
|`createInventoryItem`|[src/db.ts:5439-5456](../src/db.ts)|
|`updateInventoryItem`|[src/db.ts:5458-5475](../src/db.ts)|
|`archiveInventoryItem`|[src/db.ts:5477-5479](../src/db.ts)|
|`stockIn`|[src/db.ts:5482-5500](../src/db.ts)|
|`adjustStock`|[src/db.ts:5502-5525](../src/db.ts)|
|`createTask`|[src/db.ts:5527-5539](../src/db.ts)|
|`updateTask`|[src/db.ts:5541-5562](../src/db.ts)|
|`archiveTask`|[src/db.ts:5564-5566](../src/db.ts)|
|`markWashingNeeded`|[src/db.ts:5568-5574](../src/db.ts)|
|`updateQcCheck`|[src/db.ts:5576-5600](../src/db.ts)|
|`failQcWithRework`|[src/db.ts:5602-5619](../src/db.ts)|
|`passQc`|[src/db.ts:5621-5631](../src/db.ts)|
|`generateInvoice`|[src/db.ts:5633-5652](../src/db.ts)|
|`canMutateBilling`|[src/db.ts:5677-5679](../src/db.ts)|
|`updateInvoiceFields`|[src/db.ts:5817-5850](../src/db.ts)|
|`createInvoiceItem`|[src/db.ts:5852-5890](../src/db.ts)|
|`updateInvoiceItem`|[src/db.ts:5892-5922](../src/db.ts)|
|`archiveInvoiceItem`|[src/db.ts:5925-5953](../src/db.ts)|
|`createInvoiceFromEstimate`|[src/db.ts:5955-6064](../src/db.ts)|
|`createInvoiceForActor`|[src/db.ts:6066-6094](../src/db.ts)|
|`updateInvoiceForActor`|[src/db.ts:6096-6120](../src/db.ts)|
|`saveInvoiceForActor`|[src/db.ts:6164-6251](../src/db.ts)|
|`voidInvoice`|[src/db.ts:6254-6291](../src/db.ts)|
|`voidInvoiceForActor`|[src/db.ts:6293-6301](../src/db.ts)|
|`recordPayment`|[src/db.ts:6388-6515](../src/db.ts)|
|`recordPaymentForActor`|[src/db.ts:6517-6525](../src/db.ts)|
|`voidPayment`|[src/db.ts:6528-6574](../src/db.ts)|
|`voidPaymentForActor`|[src/db.ts:6576-6584](../src/db.ts)|
|`updateDeliveryDetails`|[src/db.ts:6620-6631](../src/db.ts)|
|`updateDeliveryForActor`|[src/db.ts:6633-6652](../src/db.ts)|
|`markJobDeliveredForActor`|[src/db.ts:6654-6702](../src/db.ts)|
|`closeJob`|[src/db.ts:6704-6708](../src/db.ts)|
|`createFollowup`|[src/db.ts:6710-6724](../src/db.ts)|
|`createResolvedFollowup`|[src/db.ts:6730-6761](../src/db.ts)|
|`updateFollowup`|[src/db.ts:6763-6772](../src/db.ts)|
|`archiveFollowup`|[src/db.ts:6774-6776](../src/db.ts)|
|`markFollowupDone`|[src/db.ts:6778-6783](../src/db.ts)|
|`addFollowup`|[src/db.ts:6785-6793](../src/db.ts)|
|`createPhoto`|[src/db.ts:6795-6808](../src/db.ts)|
|`updatePhoto`|[src/db.ts:6810-6819](../src/db.ts)|
|`archivePhoto`|[src/db.ts:6821-6825](../src/db.ts)|
|`saveJobPhotoForActor`|[src/db.ts:6877-6910](../src/db.ts)|
|`updateJobPhotoForActor`|[src/db.ts:6912-6935](../src/db.ts)|
|`archiveJobPhotoForActor`|[src/db.ts:6937-6956](../src/db.ts)|
|`addPhoto`|[src/db.ts:6958-6960](../src/db.ts)|
|`searchJobs`|[src/db.ts:6962-7030](../src/db.ts)|
|`closureBlockers`|[src/db.ts:7071-7095](../src/db.ts)|
|`paymentStatus`|[src/db.ts:7097-7105](../src/db.ts)|
|`invoiceItemsTotal`|[src/db.ts:7107-7120](../src/db.ts)|
|`createSchema`|[src/db.ts:7122-7176](../src/db.ts)|
|`migrateSchema`|[src/db.ts:7178-7489](../src/db.ts)|
|`migrateLifecycleStorage`|[src/db.ts:7491-7521](../src/db.ts)|
|`ensureLifecycleChecklist`|[src/db.ts:7571-7598](../src/db.ts)|
|`syncSubStatusFromChecklist`|[src/db.ts:7648-7665](../src/db.ts)|
|`setChecklistItemChecked`|[src/db.ts:7687-7720](../src/db.ts)|
|`setChecklistItemNotApplicable`|[src/db.ts:7723-7775](../src/db.ts)|
|`setChecklistItemCheckedForActor`|[src/db.ts:7903-7928](../src/db.ts)|
|`setChecklistItemNotApplicableForActor`|[src/db.ts:7930-7949](../src/db.ts)|
|`transitionJobStatus`|[src/db.ts:8201-8209](../src/db.ts)|
|`reconcileArtifactChecklist`|[src/db.ts:8280-8305](../src/db.ts)|
|`createSalesLead`|[src/db.ts:8560-8565](../src/db.ts)|
|`updateSalesLead`|[src/db.ts:8567-8572](../src/db.ts)|
|`createSalesQuotation`|[src/db.ts:8574-8590](../src/db.ts)|
|`updateSalesQuotation`|[src/db.ts:8593-8610](../src/db.ts)|
|`setSalesQuotationStatus`|[src/db.ts:8612-8618](../src/db.ts)|
|`createServiceDepartment`|[src/db.ts:8620-8625](../src/db.ts)|
|`updateServiceDepartment`|[src/db.ts:8627-8631](../src/db.ts)|
|`createServiceCatalogMaster`|[src/db.ts:8633-8639](../src/db.ts)|
|`updateServiceCatalogMaster`|[src/db.ts:8641-8647](../src/db.ts)|
|`appointServiceDepartmentManager`|[src/db.ts:8649-8655](../src/db.ts)|
|`removeServiceDepartmentManager`|[src/db.ts:8657-8660](../src/db.ts)|
|`assignServiceAdvisorTeam`|[src/db.ts:8662-8667](../src/db.ts)|
|`removeServiceAdvisorTeam`|[src/db.ts:8669-8672](../src/db.ts)|
|`createDefaultDeveloperControlPlane`|[src/developer-control-plane.ts:73-80](../src/developer-control-plane.ts)|
|`loadDeveloperControlPlane`|[src/developer-control-plane.ts:85-87](../src/developer-control-plane.ts)|
|`saveDeveloperControlPlane`|[src/developer-control-plane.ts:88-90](../src/developer-control-plane.ts)|
|`resetDeveloperControlPlane`|[src/developer-control-plane.ts:91-93](../src/developer-control-plane.ts)|
|`selectedTenant`|[src/developer-control-plane.ts:94-96](../src/developer-control-plane.ts)|
|`createTenant`|[src/developer-control-plane.ts:97-101](../src/developer-control-plane.ts)|
|`selectTenant`|[src/developer-control-plane.ts:102-105](../src/developer-control-plane.ts)|
|`setTenantLifecycle`|[src/developer-control-plane.ts:106-108](../src/developer-control-plane.ts)|
|`updateTenantProfile`|[src/developer-control-plane.ts:109-111](../src/developer-control-plane.ts)|
|`updateCommunication`|[src/developer-control-plane.ts:112-114](../src/developer-control-plane.ts)|
|`simulateCommunicationTest`|[src/developer-control-plane.ts:115-121](../src/developer-control-plane.ts)|
|`createPlatformCharge`|[src/developer-control-plane.ts:122-126](../src/developer-control-plane.ts)|
|`recordPlatformPayment`|[src/developer-control-plane.ts:127-130](../src/developer-control-plane.ts)|
|`chargeStatus`|[src/developer-control-plane.ts:131-131](../src/developer-control-plane.ts)|
|`roleForEmulation`|[src/developer-control-plane.ts:132-132](../src/developer-control-plane.ts)|
|`loadDocumentSnapshots`|[src/document-snapshots.ts:33-39](../src/document-snapshots.ts)|
|`saveDocumentSnapshots`|[src/document-snapshots.ts:41-44](../src/document-snapshots.ts)|
|`clearDocumentSnapshots`|[src/document-snapshots.ts:46-46](../src/document-snapshots.ts)|
|`planSnapshots`|[src/document-snapshots.ts:63-89](../src/document-snapshots.ts)|
|`syncDocumentSnapshots`|[src/document-snapshots.ts:92-98](../src/document-snapshots.ts)|
|`buildExportMatrix`|[src/export-utils.ts:17-26](../src/export-utils.ts)|
|`downloadExcel`|[src/export-utils.ts:32-41](../src/export-utils.ts)|
|`downloadPdf`|[src/export-utils.ts:43-84](../src/export-utils.ts)|
|`canVoidRemoteInvoice`|[src/finance-ui.ts:4-6](../src/finance-ui.ts)|
|`isActiveRemoteInvoice`|[src/finance-ui.ts:9-11](../src/finance-ui.ts)|
|`requiresInvoiceReplacement`|[src/finance-ui.ts:13-15](../src/finance-ui.ts)|
|`canReplaceRemoteInvoice`|[src/finance-ui.ts:18-20](../src/finance-ui.ts)|
|`remoteDocumentFilename`|[src/finance-ui.ts:22-24](../src/finance-ui.ts)|
|`parseInventoryWorkbook`|[src/inventory-import.ts:145-166](../src/inventory-import.ts)|
|`suggestInventoryColumnMapping`|[src/inventory-import.ts:169-182](../src/inventory-import.ts)|
|`buildInventoryImportPreview`|[src/inventory-import.ts:228-291](../src/inventory-import.ts)|
|`buildInventoryTemplateBuffer`|[src/inventory-import.ts:303-313](../src/inventory-import.ts)|
|`normalizeGstLine`|[src/invoice-math.ts:12-15](../src/invoice-math.ts)|
|`invoiceTotals`|[src/invoice-math.ts:29-45](../src/invoice-math.ts)|
|`buildInvoiceDraft`|[src/invoice-math.ts:52-64](../src/invoice-math.ts)|
|`pickableMaterialLines`|[src/invoice-math.ts:67-69](../src/invoice-math.ts)|
|`unissuedWarning`|[src/invoice-math.ts:71-73](../src/invoice-math.ts)|
|`canCreateInvoice`|[src/invoice-math.ts:79-86](../src/invoice-math.ts)|
|`canEditInvoice`|[src/invoice-math.ts:89-92](../src/invoice-math.ts)|
|`canCompleteWithInvoice`|[src/invoice-math.ts:95-97](../src/invoice-math.ts)|
|`billingReconciliation`|[src/invoice-math.ts:100-114](../src/invoice-math.ts)|
|`mixedPaymentRows`|[src/invoice-math.ts:123-133](../src/invoice-math.ts)|
|`canRecordOrVoidPayment`|[src/invoice-math.ts:136-138](../src/invoice-math.ts)|
|`canVoidCurrentInvoice`|[src/invoice-math.ts:141-144](../src/invoice-math.ts)|
|`isStubTab`|[src/job-card-layout.ts:25-27](../src/job-card-layout.ts)|
|`resolveJobCardFooter`|[src/job-card-layout.ts:52-73](../src/job-card-layout.ts)|
|`renderJobCardNotificationTemplate`|[src/job-card-notifications.ts:20-28](../src/job-card-notifications.ts)|
|`renderJobCardNotification`|[src/job-card-notifications.ts:30-57](../src/job-card-notifications.ts)|
|`deliverJobCardNotificationStub`|[src/job-card-notifications.ts:60-65](../src/job-card-notifications.ts)|
|`localDeliveryDate`|[src/job-delivery-highlight.ts:15-20](../src/job-delivery-highlight.ts)|
|`jobDeliveryTone`|[src/job-delivery-highlight.ts:22-34](../src/job-delivery-highlight.ts)|
|`jobDeliveryClass`|[src/job-delivery-highlight.ts:36-39](../src/job-delivery-highlight.ts)|
|`useLocalDeliveryDate`|[src/job-delivery-highlight.ts:41-65](../src/job-delivery-highlight.ts)|
|`resolveJobDocumentActions`|[src/job-documents.ts:12-25](../src/job-documents.ts)|
|`documentInfo`|[src/job-documents.ts:39-46](../src/job-documents.ts)|
|`resolveJobDocuments`|[src/job-documents.ts:71-83](../src/job-documents.ts)|
|`documentFilename`|[src/job-documents.ts:85-88](../src/job-documents.ts)|
|`withDamageDiagram`|[src/job-documents.ts:95-102](../src/job-documents.ts)|
|`renderLive`|[src/job-documents.ts:104-113](../src/job-documents.ts)|
|`renderJobDocument`|[src/job-documents.ts:116-123](../src/job-documents.ts)|
|`renderSnapshotDocument`|[src/job-documents.ts:125-128](../src/job-documents.ts)|
|`printRenderedDocument`|[src/job-documents.ts:133-148](../src/job-documents.ts)|
|`validateMediaDataUrl`|[src/job-media.ts:20-29](../src/job-media.ts)|
|`validateMediaFile`|[src/job-media.ts:31-37](../src/job-media.ts)|
|`compressMediaFile`|[src/job-media.ts:48-80](../src/job-media.ts)|
|`parseDamageMarks`|[src/job-sheet.ts:27-38](../src/job-sheet.ts)|
|`serializeDamageMarks`|[src/job-sheet.ts:40-44](../src/job-sheet.ts)|
|`legacyMarkToUnified`|[src/job-sheet.ts:47-52](../src/job-sheet.ts)|
|`addDamageMark`|[src/job-sheet.ts:54-57](../src/job-sheet.ts)|
|`removeDamageMark`|[src/job-sheet.ts:59-61](../src/job-sheet.ts)|
|`bodyPanelShapes`|[src/job-sheet.ts:69-86](../src/job-sheet.ts)|
|`staticBodyMarksSvg`|[src/job-sheet.ts:89-95](../src/job-sheet.ts)|
|`staticDamageDiagramHtml`|[src/job-sheet.ts:98-102](../src/job-sheet.ts)|
|`normalizeSearch`|[src/list-utils.ts:6-8](../src/list-utils.ts)|
|`clampPage`|[src/list-utils.ts:10-13](../src/list-utils.ts)|
|`paginate`|[src/list-utils.ts:15-28](../src/list-utils.ts)|
|`pageNumbers`|[src/list-utils.ts:30-47](../src/list-utils.ts)|
|`activeFilterSummary`|[src/list-utils.ts:49-53](../src/list-utils.ts)|
|`applyFilterDraft`|[src/list-utils.ts:61-63](../src/list-utils.ts)|
|`clearFilterDraft`|[src/list-utils.ts:65-67](../src/list-utils.ts)|
|`canManageMaterialRows`|[src/materials.ts:10-13](../src/materials.ts)|
|`materialRowStatus`|[src/materials.ts:15-17](../src/materials.ts)|
|`materialRowActions`|[src/materials.ts:20-28](../src/materials.ts)|
|`stockOnHand`|[src/materials.ts:30-32](../src/materials.ts)|
|`overStockWarning`|[src/materials.ts:35-37](../src/materials.ts)|
|`triageMaterialDemand`|[src/materials.ts:57-66](../src/materials.ts)|
|`triageMaterialDemands`|[src/materials.ts:73-78](../src/materials.ts)|
|`allocateMaterialDemands`|[src/materials.ts:84-101](../src/materials.ts)|
|`filterInventory`|[src/materials.ts:103-106](../src/materials.ts)|
|`pickerLabel`|[src/materials.ts:108-110](../src/materials.ts)|
|`canReleaseMaterialRows`|[src/materials.ts:116-118](../src/materials.ts)|
|`canEditIssuedMaterialRows`|[src/materials.ts:121-124](../src/materials.ts)|
|`materialRowActionsFor`|[src/materials.ts:127-134](../src/materials.ts)|
|`renderHtmlToPdf`|[src/pdf-render.ts:11-42](../src/pdf-render.ts)|
|`supplierNameForPurchaseOrder`|[src/purchase-order-supplier-display.ts:8-15](../src/purchase-order-supplier-display.ts)|
|`seedReportTemplates`|[src/report-templates.ts:106-130](../src/report-templates.ts)|
|`findUnsupportedPlaceholders`|[src/report-templates.ts:136-143](../src/report-templates.ts)|
|`rupeesInWords`|[src/report-templates.ts:147-162](../src/report-templates.ts)|
|`reportAvailable`|[src/report-templates.ts:191-197](../src/report-templates.ts)|
|`buildReportValues`|[src/report-templates.ts:199-232](../src/report-templates.ts)|
|`buildReportLines`|[src/report-templates.ts:235-238](../src/report-templates.ts)|
|`sampleReportLines`|[src/report-templates.ts:240-245](../src/report-templates.ts)|
|`sampleReportValues`|[src/report-templates.ts:247-266](../src/report-templates.ts)|
|`sanitizeReportHtml`|[src/report-templates.ts:271-293](../src/report-templates.ts)|
|`renderReportTemplate`|[src/report-templates.ts:296-309](../src/report-templates.ts)|
|`buildPrintDocument`|[src/report-templates.ts:313-315](../src/report-templates.ts)|
|`isServiceActiveJob`|[src/service-advisor.ts:6-8](../src/service-advisor.ts)|
|`canAddServiceFollowup`|[src/service-advisor.ts:10-12](../src/service-advisor.ts)|
|`serviceFollowupStatus`|[src/service-advisor.ts:14-19](../src/service-advisor.ts)|

## Completion report

Task delivered: clone requirements main file, supporting screenshots, static/runtime evidence, preserved demo files and repeatable audit scripts. Requirements covered: pages/roles/controls/dialogs/conditional branches, source workflow contracts, settings/templates/media/persistence, data counts/schema/relationships and restore instructions. Files created are under `data-migration/`; original working-tree changes were preserved. Backend/frontend/schema changes: none. Demo impact: isolated test contexts only; original shipped hash preserved. Tests and failures: listed above with raw reports. Approved UI/workflow behavior intentionally changed: none; full UI regression remains unverified. Remaining issues and recommended next action are listed in the explicit gaps section.
