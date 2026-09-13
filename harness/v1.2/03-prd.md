# WorkshopOS v1.2 product requirements

Status: FROZEN  
Specification: `UI_ENHANCEMENT_SPEC_v1.2.0.md`

## Problem and goals

Migrate the rich WorkshopOS experience from browser-local authority to the production HTTP/PostgreSQL runtime and deliver coherent, accessible, secure behavior across resource editing, lists, exports, Jobs, media, administration, and platform support. Preserve established lifecycle and immutability rules, make all permissions enforceable at the API, and maintain executable evidence for every increment.

## Non-goals

No lifecycle replacement, hard deletion of auditable records, direct object/database access from the browser, external deployment, live-data import, provider contact, or false certification through local fixtures.

## Requirements

### V12-R001 — Production authority
Every rich production screen shall read and mutate authenticated `/api/v1` resources backed by PostgreSQL; `sql.js` may exist only in isolated demo/reference paths and shall fail the release authority gate if imported by production screen code. (D-001, D-022)

### V12-R002 — Secure mutation contract
Production mutations shall enforce tenant/branch context, PostgreSQL RLS, idempotency where retries can duplicate work, optimistic resource versions, and readable errors containing a trace identifier. (D-001)

### V12-R003 — Accessible resource dialogs
Create and edit flows shall use reusable accessible dialogs with labelled fields, validation, predictable initial focus, focus trap, Escape/Cancel behavior, and focus restoration. (D-016)

### V12-R004 — Dirty close and accountable commands
Unsaved dialog changes shall require confirmation before discard; destructive or exceptional commands shall capture a required reason where domain policy requires it. (D-016)

### V12-R005 — Server list query contract
Rich lists shall use server-side search, filters, stable sorting, and 25/50/100 pagination with URL-addressable query state. (D-017)

### V12-R006 — List recovery and presentation
Rich lists shall provide Refresh, Clear-to-screen-default, actionable empty states, grid/table modes where useful, and per-tenant/user/screen persisted presentation preferences. (D-017)

### V12-R007 — Complete private exports
PDF/XLSX export shall run asynchronously, remain authorization-protected, and contain the complete filtered/sorted result rather than only the displayed page. (D-011, D-018)

### V12-R008 — Production tenant users
Authorized tenant administrators shall list, search, filter, invite, edit, change status, and archive tenant users through production APIs and accessible dialogs. (D-001, D-016)

### V12-R009 — User safety and concurrency
User administration shall enforce optimistic concurrency, invitation/status rules, self-protection, and prevention of disabling or archiving the final effective tenant administrator. (D-009)

### V12-R010 — Custom roles and catalog
Authorized administrators shall create and version custom roles using a searchable hierarchical page/action permission catalog; protected role templates cannot be weakened, renamed, archived, or deleted. (D-009)

### V12-R011 — Unified authorization
Navigation, controls, global search, exports, downloads, and API endpoints shall evaluate matching permission keys and reveal no denied record identifiers, snippets, or counts. (D-001)

### V12-R012 — Versioned inherited settings
Business Settings shall be tabbed, validated, versioned, publishable, and support tenant defaults, branch overrides, inherited-value display, and reset to inherited. (D-019)

### V12-R013 — Non-retroactive settings
Active Jobs and other governed work shall reference an immutable effective-settings snapshot so later publication does not retroactively change them. (D-019)

### V12-R014 — Production customers and vehicles
Customer and Vehicle list/detail/create/edit flows shall use production APIs with duplicate controls, ownership/association rules, filters, exports, concurrency handling, and responsive grid/table presentation. (D-001, D-016)

### V12-R015 — Inventory operations and analytics
Inventory screens shall use production lists and analytics for stock position, movement, ageing/reorder indicators, and authorized operational actions without mutating immutable ledger history. (D-009)

### V12-R016 — Controlled inventory import
Inventory import shall stage and validate input, produce a dry-run summary and downloadable error manifest, require explicit authorized commit, and reconcile committed results idempotently. (D-009)

### V12-R017 — Operational Job List
The production Job List shall default to the current local date by Visit/check-in date, expose explicit date/status/search filters and pagination, and render `In Progress` consistently in orange. (D-010, D-017)

### V12-R018 — Job documents
Authorized users shall download a Job Card PDF from grid, table, and detail views and discover/download estimate, invoice, receipt, and gate-pass documents only when each immutable artifact exists. (D-009, D-012)

### V12-R019 — Canonical lifecycle projection
The server shall project the canonical stage, valid next actions, reasons, blockers, and history for each Job and shall reject stale, unauthorized, or invalid lifecycle commands. (D-002, D-009)

### V12-R020 — Hold, cancellation, and archive
Hold shall pause and resume the same underlying stage; cancelled Jobs may be reopened or archived but never hard-deleted. (D-003, D-008)

### V12-R021 — Distinct acceptance and payment facts
Estimate Approved, Work Accepted, and Payment Cleared shall be distinct attributed facts with ordinary approval rules and explicit blockers before release/closure. (D-004, D-012)

### V12-R022 — Explained Job Data Flow
Data Flow shall require or clearly show the selected Job and explain the record-specific Visit, estimate, work, QC, billing, payment, custody, linked artifacts, and status-history relevance. (D-002, D-004)

### V12-R023 — Job-linked media selection
Every media item shall require a valid Job; the Media screen shall filter by Visit/check-in date and provide a searchable selector limited to matching Jobs. (D-006, D-010)

### V12-R024 — Private scanned media
Media originals shall use private object storage while PostgreSQL stores metadata and thumbnails; uploads shall be scanned before authorized view/download and may be archived without hard deletion. (D-007, D-009)

### V12-R025 — Media category gates
Before/Inspection uploads shall close when active work begins, Progress shall apply during active work and QC, and After shall begin after work completion/QC, with server enforcement on both Media and Job details. (D-005)

### V12-R026 — Production estimates
Estimates shall use production lists and dialogs while retaining immutable versions, approval evidence, expiry/supersession rules, and complete authorized documents. (D-001, D-004, D-009)

### V12-R027 — Production tasks and QC
Tasks and QC shall use production APIs and dialogs while retaining assignment, evidence, checklists, independent decisions, failed-item rework, and lifecycle blockers. (D-001, D-009)

### V12-R028 — Immutable billing corrections
Billing and final invoicing shall use production authority, preserve immutable final documents, and perform corrections through authorized maker-checker and compensating records. (D-009)

### V12-R029 — Payment-to-closure flow
Payments, receipts, pre-release gate passes, vehicle release, delivery acknowledgement, and closure shall use production APIs with Payment Cleared and required-artifact blockers enforced in order. (D-004, D-009, D-012)

### V12-R030 — Remaining-screen migration
Appointments, follow-ups, action inbox, material issue/reconciliation, reports, remaining masters, and every other rich list/grid shall adopt the v1.2 production list/dialog/export contracts; an inventory and static gate shall prevent omissions. (D-001, D-016, D-022)

### V12-R031 — Separate platform workspace
Platform Super Admin shall use a separate authorized workspace for tenant selection and platform-only operations, without inheriting tenant navigation or ambient tenant access. (D-001)

### V12-R032 — Logs and recovery
Platform operators shall access protected daily logs and downloads with at least 30-day online and 90-day recoverable retention, immutable audit, and documented recovery controls. (D-009, D-020)

### V12-R033 — Controlled tenant-user emulation
Emulation shall require reason, MFA/re-authentication, a different approver, exact tenant/user/branch scope, no permission/approval bypass, dual actor attribution, and automatic expiry after 15 minutes. (D-013, D-014, D-015)

### V12-R034 — Responsive WCAG 2.2 AA
All migrated experiences shall preserve required actions across phone/tablet/desktop and meet WCAG 2.2 AA keyboard, screen-reader, focus, contrast, error, target-size, and reduced-motion gates. (D-016)

### V12-R035 — Executable traceability and handoff
Every requirement shall map bidirectionally to an implementation slice and passing evidence; contiguous checklist state and a current single-next-slice handoff shall be enforced automatically. (D-021, D-022)

### V12-R036 — Truthful release evidence
Build, unit, production, typecheck, PostgreSQL integration, Playwright, historical harness, v1.2 verifier, and diff gates shall pass locally, while deployment, security, finance/tax, device/accessibility, recovery, migration, pilot, and other external evidence remains explicitly blocking until genuinely obtained. (D-021)

## Deferred items and defaults

Any v1.2 detail not explicitly changed above inherits the frozen v1.1 PRD, decisions, limits, policies, and vocabulary. This is a recorded default, not permission to invent new business rules. (D-023)

## Decisions appendix

The canonical verbatim ledger is `harness/v1.2/02-ledger.md`; it is incorporated by reference to prevent duplicate mutable copies.

