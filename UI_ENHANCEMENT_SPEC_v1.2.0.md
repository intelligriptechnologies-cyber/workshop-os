# WorkshopOS UI Enhancement Specification v1.2.0

Status: Approved for local implementation  
Programme: V12-00 through V12-16  
Canonical requirements: `harness/v1.2/03-prd.md`

## Purpose

WorkshopOS v1.2 turns the existing rich browser-local demonstration into production-backed operational screens. Every rich production screen must use authenticated `/api/v1` HTTP operations backed by PostgreSQL; `sql.js` may remain only in clearly isolated demo/reference code until its final removal. The release preserves the established workshop domain and canonical lifecycle while adding consistent dialogs, server-side lists and exports, lifecycle controls, media, administration, platform operations, accessibility, and auditable verification.

## Product-wide interaction contract

- Create and edit operations use accessible dialogs with labelled fields, validation summaries, initial focus, focus trapping, Escape/Cancel behavior, focus restoration, and dirty-close confirmation.
- Destructive, exceptional, or state-changing commands that require accountability use a reason-command dialog. Ordinary saves do not invent a reason requirement.
- Lists use one server query contract for search, filters, stable sorting, and 25/50/100-row pagination. Filter state is URL-addressable; Refresh reloads authority; Clear returns to the screen default; empty results explain how to recover.
- Users can switch between supported grid and table presentations. The preference is persisted per tenant, user, and screen without changing authoritative business data.
- PDF and XLSX exports are private asynchronous jobs and contain the complete filtered and sorted result, never only the displayed page.
- Mutation requests use authenticated tenant/branch context, idempotency keys where repeat submission is possible, and optimistic resource versions. Errors are readable while retaining a trace identifier.

## Job and lifecycle contract

- The Job List defaults to the current local calendar date using Visit/check-in date and clearly labels that field. `In Progress` is orange in every presentation.
- A Job Card PDF is available from job cards, table rows, and job details. Estimate, invoice, receipt, and gate-pass links appear only when the corresponding immutable document exists and the user is authorized.
- Canonical lifecycle stages remain unchanged. `Hold` is a pause overlay and resume returns to the same underlying stage.
- Estimate Approved, Work Accepted, and Payment Cleared are separate facts. Valid next actions and blockers are projected by the server and enforced again on commands.
- Cancelled Jobs can be reopened or archived but never hard-deleted. Gate passes are created before vehicle release and closure.
- Data Flow always identifies the selected Job and explains the Visit, estimate, work, QC, financial, custody, and status-history facts shown for that record.

## Media contract

- Every media object is linked to a valid Job. The Media screen selects a date first and cascades only Jobs whose Visit/check-in date matches it; the selector is searchable.
- Categories are `Before/Inspection`, `Progress`, and `After`. Before/Inspection closes when active work begins; Progress is accepted during active work and QC; After begins after work completion/QC.
- Originals live in private object storage. PostgreSQL stores metadata and thumbnails. Uploads are scanned before availability and support authorized view, download, and archive without hard deletion.

## Administration and platform contract

- Tenant User Management supports invitation, editing, status commands, archive, filters, exports, optimistic concurrency, and protection against removal or disabling of the final effective administrator.
- Custom roles use a catalog of page and action permissions. Protected templates cannot be weakened or deleted. Navigation visibility and API authorization evaluate the same permission keys.
- Business Settings are versioned, tabbed, validated, and publishable, with tenant defaults, branch overrides, reset-to-inherited behavior, and immutable snapshots for active work so publication is non-retroactive.
- Inventory exposes production analytics and controlled staged import with validation, dry run, explicit commit, reconciliation, and downloadable error manifests.
- Platform Super Admin is a separate workspace. Tenant-user emulation requires reason, MFA/re-authentication, a different approver, exact tenant/user/branch scope, dual actor attribution, ordinary approval rules, and automatic expiry after 15 minutes.
- Daily logs are retained online for at least 30 days and recoverably for 90 days, with protected downloads and documented recovery controls.

## Security, accessibility, and operations

- Permission-filtered global search returns only records visible to the effective tenant user and never leaks counts, snippets, or identifiers from denied records.
- Responsive layouts support phone, tablet, and desktop without hidden required actions. Keyboard and screen-reader operation, visible focus, error identification, contrast, target size, and reduced motion meet WCAG 2.2 AA automated and manual gates.
- Final invoices, posted payments, stock ledgers, lifecycle history, audit records, and logs are immutable. Corrections use explicit maker-checker commands and compensating records.
- External deployment, security review, finance/tax certification, device/assistive-technology review, real recovery exercises, and pilot evidence are never represented by fixtures or local automated results. Outstanding evidence remains explicitly release-blocking.

## Verification

Each slice records requirement IDs, changed paths, focused tests, regression results, preserved pre-existing changes, risks, and exactly one next slice. `scripts/verify-ui-enhancement-v1.2.mjs` enforces requirement and slice coverage, contiguous progress, acceptance/checklist consistency, clean traceability, and a current handoff.

