# WorkshopOS Demo UI Implementation Checklist v1.2

Updated: 2026-09-22  
Status: In progress  
Goal: Deliver and verify every UI-only requirement in `UI_BRD_v1.2.md`  
Current task: V12-01 — session model and access catalogue  
Next handoff: Start implementation from the foundation section below

## Working and Context-Handoff Rules

- Treat this file as the living source of implementation status. Update it with evidence immediately after each completed task.
- Work in the listed dependency order unless a task explicitly states that it can run in parallel.
- At completion of a checklist item, hand the next item to a fresh agent/thread when one is available; do not wait for user confirmation.
- When remaining conversation context approaches 30%, stop at a safe boundary, record changed files, verification results, decisions, risks, and the exact next action in the Progress and Handoff Log, then continue in a fresh thread.
- A task is complete only after its focused checks pass. Do not mark implementation tasks complete based on code presence alone.
- Preserve unrelated worktree changes and never modify the frozen production BRD, root `BRD.md`, or production contracts for this programme.

## Foundation and Context Handoff

- [x] V12-00A — Persist the UI-only business requirements.
  - Evidence: `UI_BRD_v1.2.md` defines goals, behavior, acceptance criteria, session boundaries, and explicit exclusions.
- [x] V12-00B — Create the living implementation checklist and context-handoff protocol.
  - Evidence: this file contains task groups, completion gates, exclusions, and a handoff log.
- [x] V12-00C — Map requirements to the current WorkshopOS context.
  - Evidence: BRD uses the six current roles, actual role-menu vocabulary, established `sql.js` boundary, and existing export behavior.
- [ ] V12-01 — Add typed, deterministic v1.2 session state.
  - Define the versioned storage key, seed data, safe parsing/migration fallback, reset helpers, and same-tab reload behavior.
  - Include roles, grouped page catalogue, role mappings, business settings, logs, import batches, and session inventory rows.
- [ ] V12-02 — Add the session action/event layer.
  - Centralize save/reset operations and log generation so features do not write `sessionStorage` independently.
  - Confirm corrupt or obsolete session payloads recover to deterministic defaults.
- [ ] V12-03 — Establish navigation authorization resolution.
  - Seed access from current role menus, protect Owner/Admin Admin Console access, resolve custom-role access, and select the first permitted page after access changes.

## Shared UI Primitives

- [ ] V12-04 — Implement reusable page header and contextual action area.
  - Support title, description, `+ Add New`, Refresh, and Download without rendering irrelevant actions.
- [ ] V12-05 — Implement the shared tab component.
  - Cover selected, hover, focus, disabled, overflow, keyboard navigation, responsive, and session-restored states.
- [ ] V12-06 — Implement the shared filter/action toolbar.
  - Support text, date range, month-year, status, domain filters, Search, Clear Filters, contextual creation, and downloads.
- [ ] V12-07 — Standardize list feedback and data actions.
  - Reuse pagination, active-filter summaries, empty/reset states, confirmation dialogs, and complete-filtered-set PDF/Excel exports.

## Admin Console Information Architecture

- [ ] V12-08 — Add Owner/Admin-only Admin Console navigation and route/view guard.
- [ ] V12-09 — Build the five-tab Admin Console shell.
  - Users, Roles & Page Access, Business Settings, Inventory Import, and Support & Logs.
- [ ] V12-10 — Preserve or safely redirect active views after access changes.
  - Show an explanatory notice when the current page is removed and prevent unauthorized direct rendering.

## Users

- [ ] V12-11 — Adapt existing user management to the shared list/header/filter patterns.
- [ ] V12-12 — Support built-in and session-defined role assignment in user create/edit flows.
- [ ] V12-13 — Preserve signed-in and final-Owner/Admin protection.
- [ ] V12-14 — Add user PDF/Excel exports and responsive list behavior.
- [ ] V12-15 — Reuse user components/state between Admin Console and Management Hub so behavior cannot diverge.

## Roles and Page Access

- [ ] V12-16 — Build role list management.
  - Seed six roles; support search, status, add, rename/update, and archive.
- [ ] V12-17 — Build grouped page-access cards from the real navigation catalogue.
  - Include child checkboxes and derived checked/unchecked/indeterminate group state.
- [ ] V12-18 — Add page search and bulk mapping actions.
  - Select All, Clear All, Reset to Saved, Save Changes.
- [ ] V12-19 — Add navigation preview and immediate emulated-role updates.
- [ ] V12-20 — Enforce protected Admin Console access and safe mapping fallback behavior.

## Business Settings

- [ ] V12-21 — Build the seven settings tabs and prefilled WorkshopOS demo values.
- [ ] V12-22 — Implement field validation and accessible error summaries.
- [ ] V12-23 — Implement dirty-state detection, Save Settings, Reset to Saved, and confirmations.
- [ ] V12-24 — Verify same-session persistence and targeted reset without changing business records.

## Inventory Import

- [ ] V12-25 — Add template download and CSV/XLSX file intake.
- [ ] V12-26 — Build source-to-WorkshopOS column mapping.
- [ ] V12-27 — Validate required mappings/values, duplicate SKUs, numeric fields, and negative quantities.
- [ ] V12-28 — Build valid/rejected preview and rejected-row download.
- [ ] V12-29 — Confirm valid rows into session-only inventory and show an import summary.
- [ ] V12-30 — Verify imports never write to or alter the `sql.js` schema/persisted inventory.

## Support and Logs

- [ ] V12-31 — Seed deterministic daily operational and feature-activity logs.
- [ ] V12-32 — Capture specified current-session UI events and client errors through the shared event layer.
- [ ] V12-33 — Build Daily Operational Logs filters, table, and detail view.
- [ ] V12-34 — Build date-wise Feature Activity history.
- [ ] V12-35 — Build separate operational/error and activity retention settings with 30-day defaults.
- [ ] V12-36 — Add retention simulation, Refresh, PDF/Excel downloads, and confirmed Clear Logs.
- [ ] V12-37 — Label demo visibility accurately; do not imply production audit or observability guarantees.

## Stock and History

- [ ] V12-38 — Add Inventory List, Low Stock, and Stock Movements tabs to Store Stock.
- [ ] V12-39 — Add total-SKU, total-unit, low-stock, and out-of-stock KPI cards.
- [ ] V12-40 — Apply shared filters, pagination, exports, and contextual Add Item to stock views.
- [ ] V12-41 — Merge confirmed imported rows in the presentation layer only and omit unsupported valuation.
- [ ] V12-42 — Organize Job Card workspace into Overview, Work & Materials, Media, Billing, and History.
- [ ] V12-43 — Present job-status and material-movement history date-wise without fabricating missing audit fields.

## Responsive and Accessibility

- [ ] V12-44 — Verify desktop, tablet, and mobile tab/toolbar/list layouts without page-level horizontal overflow.
- [ ] V12-45 — Verify keyboard operation and visible focus for tabs, dialogs, menus, tables, mapping cards, and wizard steps.
- [ ] V12-46 — Add accessible names, status announcements, validation associations, and confirmation focus handling.
- [ ] V12-47 — Verify semantic state is not conveyed by color alone and tap targets remain usable on mobile.

## Unit, E2E, and Regression Verification

- [ ] V12-48 — Add unit tests for session initialization, corrupt-state recovery, and targeted reset.
- [ ] V12-49 — Add unit tests for access resolution, protected access, group selection, and redirect fallback.
- [ ] V12-50 — Add unit tests for import mapping/validation, inventory merging, log filtering, and retention.
- [ ] V12-51 — Add Playwright coverage for Admin Console visibility and five-tab navigation.
- [ ] V12-52 — Add Playwright coverage for role CRUD, mapping, assignment, emulation, guards, and redirects.
- [ ] V12-53 — Add Playwright coverage for settings save/reset and same-session reload.
- [ ] V12-54 — Add Playwright coverage for CSV/XLSX import, rejection handling, session stock, and downloads.
- [ ] V12-55 — Add Playwright coverage for logs, detail, retention, exports, and confirmed clear.
- [ ] V12-56 — Add Playwright coverage for stock/history tabs and mobile overflow/keyboard behavior.
- [ ] V12-57 — Run full completion gates.
  - Build, unit tests, complete Playwright suite, production tests/typecheck, harness verification, and `git diff --check` must pass.
- [ ] V12-58 — Complete documentation and final handoff.
  - Record delivered locations, verification counts, known limitations, and remaining out-of-scope production work.

## Explicit Exclusions and Guardrails

- No new backend service or API endpoint.
- No SQLite/`sql.js` schema change or migration.
- No PostgreSQL schema, migration, or production data change.
- No Cognito group, claim, policy, invitation, or production authorization change.
- No production-grade audit logging, observability, log retention, or compliance claim.
- No production inventory-import persistence or background processing.
- No deployment, tenant provisioning, or data migration.
- Do not copy branding, colors, content, sample data, or domain entities from the reference application.
- Do not alter `harness/03-prd.md`, other frozen harness requirements, or root `BRD.md`.

## Progress and Handoff Log

Use this format for each handoff: date/time, completed task IDs, changed files, checks run/results, decisions, risks/blockers, and exact next action.

- 2026-09-22 — Documentation/setup handoff
  - Completed: V12-00A, V12-00B, V12-00C.
  - Changed: `UI_BRD_v1.2.md`, `IMPLEMENTATION_CHECKLIST_v1.2.md`.
  - Checks: requirements cross-checked against current role labels, `roleMenus`, inventory model, and existing PDF/Excel utilities; `git diff --check -- UI_BRD_v1.2.md IMPLEMENTATION_CHECKLIST_v1.2.md` passed.
  - Decisions: new administration/import/log state is versioned `sessionStorage`; existing `sql.js` business records remain untouched; Admin Console is Owner/Admin-only; unsupported inventory valuation is excluded.
  - Risks/blockers: none for V12-01. Multiple agents must coordinate edits to shared files such as `src/App.tsx` and `src/styles.css`.
  - Exact next action: implement V12-01 by defining the typed v1.2 session model, deterministic defaults, safe load/save helpers, and focused unit tests without modifying persistence schemas.
