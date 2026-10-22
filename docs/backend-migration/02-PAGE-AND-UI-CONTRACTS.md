# Page and UI contracts

The existing application is the UI contract. This document does not authorize redesign, changed labels, reordered fields, new forms, or altered validation. Source evidence is frozen to the revision identified in 01.

## Exact contracts and how to use them

For each screen in 01, follow its component into [component index](evidence-component-index.md), then [full component contracts](evidence-ui-component-contracts.md). The latter records component hierarchy, JSX field ordering and labels, state initializer defaults, required flags, input types, selected options, conditional branches, action handlers, table headers, nested panels and resulting dialog/navigation state. Every extracted form/control also has a stable ID in [control ledger](evidence-ui-controls.md). Controlled values such as `form.mobile` are expressions, not invented literal defaults: resolve their initializer in the enclosing component. An absent HTML `required` flag does not imply the business operation accepts an empty value.

Rendered labels, current values, dropdown options and visible disabled controls are captured per role/state in [browser evidence](evidence-browser.json.md). [Screen inventory](evidence-screenshots.md) links actual screenshots. Static source presence and a screenshot are different evidence levels. No screenshot represents a state that was not visited.

## Shared shell and list behavior

`App` renders persistent role-aware navigation and workspace header, account identity and Logout. Sidebar collapse/rail drag affects layout; Sales CRM expands its submenu. Workspace navigation is React state within `/`, not separate REST routes. Preserve search-to-record selection, dashboard drilldown filters, selected job and return behavior (`App.tsx:974-1121`). Authentication and initial database loading are asynchronous; ordinary local SQL mutations are synchronous.

List defaults are ten records per page with 10/20/50 choices. Search is trimmed and locale-lowercased. Page indices clamp to available pages; empty results show from/to zero and at least one logical page. Page number ellipses follow `src/list-utils.ts:1-51`. Some filter toolbars have draft/apply state rather than filtering immediately; preserve the actual component handler. Grid/table modes, active filters, date/month selectors, archive-only toggles and sort keys must remain those in `EntityList`, `ServiceAdvisorList`, `FilterableJobRows`, and stock workspaces, not a newly unified design.

## Important editor contracts

| Editor | Contract and source |
|---|---|
| LoginScreen | Email and password; local defaults are demo credentials; Login; Emulate User selection changes email. Cognito branch has Continue with Cognito; non-demo deployment without auth has a configuration message. App.tsx:1365-1452 |
| CreateVisitDialog | Customer/vehicle selection or inline new details; ownership-linked selection reset; intake values, advisor, requested work; details/body-mark tabs; submit builds receiveVehicle payload. Exact field types/defaults and errors: App.tsx:3056-3565 |
| BookingCalendar / BookingCheckIn | Date/service type/arrival window and contact/vehicle data; capacity and reason dialogs; check-in uses existing booking identity. Component contracts under booking-calendar.tsx and booking-check-in.tsx |
| AddJobCardDialog / JobRecordDialog | Linked customer/vehicle/advisor context; job details, media/body marks, tasks, checklist and document controls. View/edit/historical state controls authority. App.tsx:15635-16258 |
| Estimate and invoice editors | Line kind, description, quantity, rate, GST type/rate; flat discount; approval/edit notes and current-document context; totals from shared math. ServiceEstimateDialog and billing-manager.tsx |
| ServiceFollowupDialog | Add/view modes, editable open follow-up, due/type/note and optional related material; Save and keep-open behavior; completion uses its own command. App.tsx:4161-4551 |
| PurchaseOrdersWorkspace | New request vs view/edit/approval/receipt/confirmation modes, per-line quantities and supplier/cost/SKU details; previous purchase/quotation review and closed-audit download. App.tsx:5110-6060 |
| ReconcileEditor | Issued/used/returned/wasted quantities; recalculated constraints and error text; App.tsx:13984-14174 |
| PhotoEditor | Job association, Before Work/After Work category, label/file and preview; conditional edit/archive by actor and terminal state; job-media.ts validation |
| RolesPageAccessTab | Role search/status/pagination; create/edit; page-group checkbox and individual checkbox; unsaved page grants; protected owner access. admin-console.tsx:729-1208 |
| InventoryImportTab | Workbook upload, mapping, preview/rejected rows, import results and error download; session inventory is distinct from SQL stock |
| ReportTemplatesTab | Category/template selection, name, HTML editor, active state, placeholder validation, preview and save. Active-template conflict is GAP-03 |
| SalesLeadDialog / QuotationDialog | Lead contact/company/email not-entered flags and stage/temperature; quotation lines/template/validity/notes/discount and status. Preserve actual shared dialogs used by local and remote screens |

Exact labels and fields for editors not summarized here remain in the exhaustive ledgers; no generic CRUD fields should be substituted for them.

## Dialogs, errors and transient states

`ui-kit.tsx Dialog` supplies focus handling, Escape behavior and close controls. Some App dialogs implement their own behavior. Maintain each handler rather than assuming every dialog dismisses on backdrop click. Native confirm/prompt/alert calls are part of the current interaction contract. `mutate` catches command errors, invokes an editor error callback where supplied, otherwise alerts; then persists and re-reads state only after a successful action. Persistence errors occur outside that command catch (`App.tsx:840-891`): storage-quota failure behavior is UNVERIFIED.

Empty states, loading states, success banners and validation messages are preserved literally in source. Captured empty lists are evidence only for the data/filter combination shown. Destructive confirms, successful saves, permission-denied and upload errors were not all executed in the browser. Their exact source and passing/failing tests must be used until approved runtime validation is available.

## Responsive contract

Desktop captures use 1440×1000; a separate dashboard capture uses 390×844. `src/styles.css` has component-specific breakpoints rather than one universal mobile conversion. Booking layout collapses at 860px; reception has 1181px desktop and 900/760px reductions; expected-booking rows collapse at 900px; quotation form at 620px; developer layouts at 760px. Reduced-motion rules also exist. See [responsive source evidence](evidence-css-responsive.md). All-screen mobile/tablet, touch, keyboard, focus and print-layout behavior remain PARTIALLY VERIFIED or UNVERIFIED as recorded in 08.

## Normalized field register

[Field-by-field register](evidence-field-register.md) inventories 533 native/custom field declaration sites with label expression, owning form/component, type, controlled/default expression, required flag and min/max/step/pattern/file/disabled/read-only constraints. Dynamic values are not guessed. Complete state initializers in the component appendix resolve literal defaults.
