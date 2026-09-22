# WorkshopOS Demo UI Business Requirements v1.2

Status: Approved implementation baseline  
Updated: 2026-09-22  
Applies to: WorkshopOS rich PWA demo only

## 1. Purpose

WorkshopOS needs a presentation-quality administration and operations demo based on the information hierarchy and interaction flow shown in the supplied reference screenshots. The references are used only to understand screen organization, tabs, filters, management flows, and actions. WorkshopOS keeps its own branding, palette, terminology, entities, permissions, and sample data.

This version is UI-only. New configuration, access mappings, imports, and operational logs are prefilled and retained for the current browser session. The existing browser-local `sql.js` business data remains available, but this programme does not add or change a database schema, production API, or Cognito authorization contract.

## 2. Business Goal and Success Criteria

The demo must let an Owner/Admin demonstrate, from one coherent interface:

- user, role, and page-access management;
- WorkshopOS-specific business configuration;
- client-side inventory import with validation and preview;
- daily operational and feature activity logs with retention controls;
- consistent tabs, filters, actions, exports, stock views, and history views throughout the app.

The demo is successful when these flows are usable on desktop and mobile, use realistic WorkshopOS data, survive reloads in the same browser session, and reset cleanly when that browser session ends. Existing role journeys and browser-local business records must continue to work.

## 3. Users and Access

The built-in WorkshopOS roles remain:

| Role | Current navigation context |
| --- | --- |
| Owner/Admin | Dashboard, Data Flow, Jobs, Customers, Vehicles, Media, Masters, Manage, Search |
| Reception | Receive Vehicle, Today Queue, Customers, Vehicles, Search |
| Service Advisor | My Queue, Job Card, Estimate, Follow-ups, Media, Search |
| Technician | My Tasks, Work Update, QC Prep, Search |
| Store | Material Requests, Issue Material, Reconcile, Stock, Search |
| Accounts | Ready To Invoice, Invoice, Payment, Delivery, Search |

Only Owner/Admin can open the new Admin Console. Owner/Admin access to that console is protected so a demo configuration cannot lock out the administrator. Custom roles and modified mappings exist only in the current browser session and are not production authorization.

## 4. Shared Application Experience

### 4.1 Master layout and tabs

- Retain the current WorkshopOS sidebar, header, responsive navigation, typography, role accents, and design language.
- Use one reusable tab pattern for pages with multiple logical views; keep single-purpose pages untabbed.
- Tabs provide active, hover, keyboard-focus, disabled, overflow, and responsive stacked or horizontally scrollable states.
- Preserve the selected tab, filter state, pagination, and view mode during the browser session.
- Standardize page headers with title, optional description, and contextual actions such as `+ Add New`, Refresh, and Download.
- Show actions only when meaningful and permitted for the current role.

### 4.2 Shared filter and action toolbar

Applicable lists, reports, histories, logs, and management tables use the same toolbar structure. Context determines which controls appear:

- quick text search;
- Date From and Date To;
- Month-Year selector;
- status or domain-state selector;
- role, category, unit, severity, user, or other relevant selectors;
- explicit Search and Clear Filters actions;
- contextual `+ Add New` action;
- Download menu for PDF and Excel.

The UI must not show irrelevant filters merely for visual consistency. A filter change resets pagination. Empty results explain that no records match and offer Clear Filters. Controls wrap or stack on smaller screens without creating page-level horizontal overflow.

PDF and Excel exports use the complete filtered result set, not only the visible page. They include the active filter summary and the columns visible in the originating view. Existing WorkshopOS export utilities should be reused.

## 5. Admin Console

Add `Admin Console` to Owner/Admin navigation. The console uses five primary tabs: Users, Roles & Page Access, Business Settings, Inventory Import, and Support & Logs.

### 5.1 Users

- Reuse the established WorkshopOS user-management behavior and existing user data.
- List name, email, assigned role, status, and permitted row actions.
- Provide quick search, role and status filters, Add User, Edit, activate/deactivate or archive, PDF, and Excel actions.
- Allow a user to be assigned a built-in role or a session-defined custom role.
- Protect the signed-in administrator and the final active Owner/Admin from archive/deactivation.
- Keep the existing Management Hub available; shared components and state must prevent two conflicting user-management implementations.

### 5.2 Roles & Page Access

- Seed Owner/Admin, Reception, Service Advisor, Technician, Store, and Accounts from current WorkshopOS role/menu definitions.
- Support Add Role, rename/update, archive, search, and status filtering.
- Selecting a role opens grouped page-access cards derived from the actual WorkshopOS navigation catalogue.
- Each page has an access checkbox. Group checkboxes show checked, unchecked, or indeterminate state derived from their child pages.
- Provide page search, Select All, Clear All, Reset to Saved, Save Changes, and a navigation preview.
- Keep protected Owner/Admin access to Admin Console.
- Saving a mapping updates the visible menu immediately when that role or an assigned user is being emulated.
- If the current page becomes inaccessible, redirect to the first permitted page and explain the redirect in a notice.
- Custom roles and access mappings are demo configuration only and remain in session storage.

### 5.3 Business Settings

Present settings in secondary tabs with Save Settings and Reset to Saved actions:

| Tab | WorkshopOS settings |
| --- | --- |
| Workshop Profile | Business identity, contact details, address, GSTIN, timezone, currency |
| Branch & Working Hours | Selected branch, opening hours, working days, holiday behavior |
| Jobs & Workflow | Job-number prefix, promised-time defaults, QC/washing requirements, closure defaults |
| Estimates & Pricing | Estimate validity, default labour rate, discount threshold, approval defaults |
| Tax & Billing | GST defaults, invoice/receipt prefixes, payment modes, gate-pass defaults |
| Inventory | Default unit, low-stock behavior, stock-adjustment reason requirement |
| Notifications & Documents | Customer update channels, document headers, template selections |

Use realistic, prefilled WorkshopOS demo values rather than values copied from the references. Show required-field and format validation, unsaved-change state, save confirmation, and reset confirmation. Saved values survive reload in the current session only.

### 5.4 Inventory Import

Implement a client-side wizard with these steps:

1. Upload a CSV/XLSX file or download the WorkshopOS import template.
2. Map source columns to WorkshopOS inventory fields.
3. Validate the uploaded rows.
4. Preview valid and rejected rows.
5. Confirm the session-only import and display the result summary.

Required mappings are SKU, item name, category, unit, opening quantity, and low-stock threshold. Validation detects missing required values or mappings, duplicate SKU values, invalid numeric values, and negative quantities. Only valid confirmed rows are merged into Stock presentation data for the remainder of the session. Rejected rows and the import result can be downloaded. The existing SQLite schema and persisted inventory are not modified by this import flow.

### 5.5 Support & Logs

Use secondary tabs for Daily Operational Logs, Feature Activity, and Retention Settings.

- Seed realistic WorkshopOS demo logs and append current-session events for login/logout, UI create/update/archive actions, role changes, setting changes, imports, exports, and client errors.
- Daily logs support date/month, level, feature/source, user, and text filtering.
- The log table shows timestamp, level, area, feature, message, user, and reference ID. Selecting a row opens full details.
- Feature Activity provides a date-wise history of important demo actions.
- Retention Settings configure operational/error and feature-activity retention separately, both defaulting to 30 days.
- Provide Refresh, Download PDF, Download Excel, and Clear Logs.
- Clear Logs requires confirmation and affects only the current session.
- Label this area as demo operational visibility, not production observability or a compliant audit trail.

## 6. Stock and Record History

### 6.1 Store Stock

- Add tabs for Inventory List, Low Stock, and Stock Movements.
- Show KPI cards for total SKUs, total units, low-stock items, and out-of-stock items.
- Provide search, category, stock status, unit, pagination, PDF/Excel exports, and contextual Add Item.
- Merge confirmed session-imported rows with existing inventory only in the presentation layer.
- Do not show inventory valuation because the current inventory model has no cost field.

### 6.2 Job and material history

- Use date-wise History tabs where chronological records already exist, especially job-card status history and material movements.
- Organize the selected Job Card workspace into Overview, Work & Materials, Media, Billing, and History tabs.
- History entries show timestamp, actor where available, action or status, note, and related reference.
- Do not fabricate audit evidence when an existing record has no actor or reference; show an explicit unavailable value instead.

## 7. UI State and Interfaces

Introduce a versioned, session-only admin presentation model with interfaces equivalent to:

- `DemoRole` for built-in and custom role definitions;
- `AdminPageKey` plus a grouped page catalogue derived from current menus;
- `RolePageAccess` for saved role-to-page mappings;
- `BusinessSettings` for the seven settings groups;
- `DemoOperationalLog` for seeded and session-generated log events;
- `DemoImportBatch` for upload, mapping, validation, preview, and result state;
- session-imported inventory rows for presentation-layer merging.

Initialize access mappings from the current `roleMenus` configuration. Store new demo state under a versioned `sessionStorage` key with deterministic defaults and safe recovery from missing or malformed stored data. No public production API or SQL contract changes are part of v1.2.

## 8. Quality and Acceptance Requirements

- Admin Console and its five primary tabs are accessible only to Owner/Admin.
- Built-in and custom roles can be created, edited, archived, mapped, and assigned for the current session.
- Saved page access immediately changes an emulated user’s navigation and guards direct page rendering.
- Business settings validate, save, reset, and survive same-session reloads.
- CSV/XLSX import maps, validates, previews, reports rejected rows, and adds only valid confirmed rows to session inventory.
- Operational logs capture the specified UI actions, filter correctly, display details, simulate retention, export, and clear with confirmation.
- PDF and Excel downloads contain active filters, visible columns, and every filtered row.
- Shared tabs, toolbars, dialogs, tables, empty states, and actions are keyboard usable and responsive.
- Existing role journeys, management behavior, browser-local `sql.js` data, and production tests remain unaffected.
- Unit coverage includes session initialization/recovery, access resolution, import validation, retention, and log filtering.
- Playwright coverage includes Admin Console navigation, live role mapping, settings, import, logs, downloads, guards, and mobile overflow.

## 9. Explicit Exclusions

The following are outside this UI demo programme:

- backend services or new API endpoints;
- changes to the browser-local SQLite/`sql.js` schema;
- PostgreSQL schema, migration, or production data changes;
- Cognito groups, claims, policies, invitations, or production authorization changes;
- production-grade audit logging, log shipping, alerting, compliance, or observability;
- production import persistence or background processing;
- deployment, tenant provisioning, or data migration;
- copying reference-screen branding, colors, wording, business data, or domain entities;
- modification of the frozen canonical BRD under `harness/` or the root `BRD.md` pointer.

## 10. Demo Data and Reset Behavior

Use deterministic WorkshopOS-specific seed values for roles, access, business settings, logs, and import examples. New v1.2 demo state persists across reloads in the same tab via versioned `sessionStorage` and is discarded when the browser session ends. The UI should offer targeted reset actions for settings, mappings, and logs without deleting existing `sql.js` business records.
