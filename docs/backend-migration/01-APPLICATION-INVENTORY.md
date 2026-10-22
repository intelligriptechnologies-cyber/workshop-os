# Application inventory

Baseline: current working-tree application source at Git HEAD `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`, inspected 2026-10-21. The client approval of this exact revision is supplied as task context, not independently proven by a signed artifact. No application changes are part of this audit.

## Counting and identifiers

There are **32 declared page keys**, including the legacy `receive-vehicle` key, plus the login screen and separate developer console. A page key is not a URL route: the main application switches `activeMenuItem` within `/`. Authentication also handles a callback URL. Shared pages appear under multiple roles. Dialogs, tabs, and shared components must not be added together as if they were distinct pages.

Static TypeScript AST inventory found **197 named JSX component declarations, 52 native form declaration sites, 1,122 interactive control declaration sites and 174 dialog/tab/alert/status declaration sites**. These are declaration counts, including legacy and duplicate code, not an assertion that all declarations are reachable. Dynamic row controls and mapped fields instantiate multiple elements from one declaration. Semantic form-like editors using buttons without a native form are included in the component/control ledger, not the 52 count.

Stable IDs: `SCR-<page-key>`, `ROLE-<role-key>`, `WF-01` onward for workflow families, `OP-<module>-<exported-symbol>`, `CMP-<file>-<component>`, `FORM-<file>-<baseline-line>-C<column>`, `ACT-<file>-<baseline-line>-C<column>`, `STATE-<file>-<baseline-line>-C<column>`, `DATA-<table>`, `SHOT-<role>-<screen>-<state>`, and `GAP-xx`. Line-based IDs are frozen to this baseline; retain them when code moves and update their evidence spans separately.

## Page and workspace register

| Screen | Label / entry | Source component | Notes |
|---|---|---|---|
| SCR-login | Sign in to your workshop desk | App.tsx LoginScreen | Local demo credentials or Cognito entry; configuration error alternative |
| SCR-receive-vehicle | Receive Vehicle | CreateVisitDialog / Reception | Declared permission key; absent from default role menus; reachable intake entry is Today Queue |
| SCR-today-queue | Today Queue | Reception, AdvisorAttendancePanel, ReceptionQueueRows | Attendance, advisor assignment, receive vehicle |
| SCR-advance-bookings | Advance Bookings | BookingOperations, BookingCalendar | Calendar, booking records, capacity; BookingExpectedToday/BookingCheckIn secondary surfaces |
| SCR-customers | Customers | EntityList kind=customers | Grid/table, records, linked vehicles/jobs |
| SCR-vehicles | Vehicles | EntityList kind=vehicles | Customer-linked vehicle records |
| SCR-search | Search | SearchPortal | Role-dependent categories; Cognito path uses RemoteFollowupsWorkspace |
| SCR-my-queue | My Queue | ServiceAdvisor; EntityList for manager branch | Role branch differs; do not equate manager with advisor |
| SCR-job-card | Job Card | ServiceAdvisor, ServiceAdvisorList, JobRecordDialog | Details, body marks, task list, checklist, materials, documents |
| SCR-estimate | Estimate | ServiceAdvisorList, ServiceEstimateDialog | Also admin Search operational workspace |
| SCR-follow-ups | Follow-ups | ServiceAdvisorList, ServiceFollowupDialog | RemoteFollowupsWorkspace in Cognito mode |
| SCR-media | Media | EntityList kind=media, PhotoEditor | Before/After Work, preview/upload/edit/archive |
| SCR-material-requests | Material Requests | StoreDesk, MaterialProcurementTriage | Available stock allocation versus procurement |
| SCR-issue-material | Issue Material | StoreDesk, material issue dialogs | Request rows and quantity release |
| SCR-reconcile | Reconcile | StoreDesk, ReconcileEditor | Used/returned/wasted accounting |
| SCR-stock | Stock | StoreDesk, InventoryEditor, QuickAddStock | Inventory, low stock, movements and suppliers |
| SCR-approvals | Approvals | Admin | Material and purchasing approvals |
| SCR-inward-purchases | Purchase Orders | PurchaseOrdersWorkspace | Key retains old name; current navigation selects purchase request/PO lifecycle |
| SCR-my-tasks | My Tasks | Technician | Job-linked technician task queue |
| SCR-work-update | Work Update | Technician | Task status/notes and washing |
| SCR-qc-prep | QC Prep | Technician, QcEditor | Checks, pass/fail, rework |
| SCR-ready-to-invoice | Ready To Invoice | Accounts, ReadyToInvoiceRows | RemoteFinanceWorkspace in Cognito mode |
| SCR-invoice | Invoice | Accounts, billing-manager.tsx | Draft from approved estimate, edits, void and document |
| SCR-payment | Payment | Accounts, billing-manager.tsx | Pending/received/void history, full payment and handover |
| SCR-delivery | Delivery | Accounts | Delivery reconciliation and artifacts; remote variant exists |
| SCR-dashboard | Dashboard | Admin | Workshop flow, cashflow, customer reach, inventory watch and drilldowns |
| SCR-data-flow | Data Flow | DataFlowWorkspace, DataFlowLine | Chronological lifecycle/document/finance/media evidence |
| SCR-jobs | Job Cards | EntityList kind=jobs | Admin record list; filters, archive, downloads |
| SCR-manage | Manage | Admin | Master-data workspaces; exact child components in component ledger |
| SCR-admin-console | Admin Console | admin-console.tsx AdminConsole | Ten named tabs below |
| SCR-sales-leads | Leads | LocalSalesWorkspace / RemoteSalesWorkspace | Lead register and lead dialog |
| SCR-quotations | Quotations | LocalSalesWorkspace / RemoteSalesWorkspace | Quotation dialog and filters |
| SCR-quotation-settings | Quotation Settings | AdminConsole | Report Templates tab initially scoped to quotation |
| SCR-developer | Developer console | developer-console.tsx DeveloperConsole | Separate demo control plane and emulation; not an eighth workshop role |

App navigation evidence: `src/App.tsx:353-403`, `src/App.tsx:1459-1761`; permission and menu catalog: `src/admin-demo-state.ts:20-164`. Full component spans are in [component index](evidence-component-index.md). Backend APIs are not additional frontend pages.

## Tabs, dialogs, forms and controls

Admin Console tabs: Users; Team Structure; Service Task Catalog (visible label **Service Task**); Roles & Page Access; Business Settings; App Theme; Company Settings; Report Templates; Inventory Import; Support & Logs (`src/admin-console.tsx:102-118`). Developer tabs, booking/calendar controls, job-record tabs, PO dialogs, stock subtabs, and conditional document editors are enumerated by exact JSX declaration in [control ledger](evidence-ui-controls.md), with complete enclosing component state and handlers in [component contracts](evidence-ui-component-contracts.md).

The ledgers are normative companion appendices, not optional examples. They record every syntactically declared native button/input/select/textarea/link, form, event-bearing custom control, and dialog/tab state detected across `src/*.tsx`, including disabled conditions and handler expressions. They retain legacy `Duplicate*` and `LegacyInwardPurchasesWorkspace` declarations to expose migration ambiguity instead of silently dropping them. DOM-discovered controls and mapped instances are separately recorded in [browser evidence](evidence-browser.json.md).

## Completeness qualification

All 32 page keys are reconciled above. Default menu accessibility is separately enumerated in 04. Static declaration coverage is VERIFIED; reachability of every legacy component and every conditional form is PARTIALLY VERIFIED. Non-JSX controls constructed imperatively (print windows, downloads, Canvas interactions, generated HTML) are addressed in workflow and dependency appendices. Cross-role browser coverage and missing states are in 07–08.
