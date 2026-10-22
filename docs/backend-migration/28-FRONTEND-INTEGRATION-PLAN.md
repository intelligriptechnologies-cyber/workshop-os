# 28 - Frontend integration plan

Design only; no frontend file changed. Preserve all 70 protected runtime/source/asset/build files and 45 test guards from 19 until their narrowly scoped integration package is explicitly approved. The final authentication instruction explicitly approves baseline a315448ce8c3f8f86026b58c18a2231bb3e5e9a7. No new page, form, navigation, icon, style or alternative remote workspace is proposed.

## INT-01 - Data-access boundary

Introduce a small typed API-backed repository/adapter (proposed src/workshop-api-adapter.ts and src/workshop-data-contracts.ts) in a later integration stage. It produces the current WorkshopState/JobView/AdminDemoState interfaces and typed business-command results. Reuse existing transport concepts from auth.ts and the five *-api.ts objects after session/CSRF fixes; no new state framework is necessary. Keep local arithmetic/presentation helpers as the golden reference while server validation independently enforces the same rule.

Local readState/openWorkshopDb/persist/export and session-owned settings/snapshots are separate persistence seams. A function callback accepting SQL.js Database cannot transparently become a remote request. Do not implement a fake browser SQL database, serialize arbitrary closures, or execute a local mutation then dual-write remotely. Replace each persistence-bearing callback with an explicit allowlisted command mapped in 25. Pure filters, pagination, previews, formatting, body marks and layout helpers continue using the same data shape.

## INT-02 - Minimal async change

App.tsx mutate at 840?891 currently executes synchronously, persists, rereads state and returns boolean; callers use that boolean to close forms. Introduce an explicitly async command callback, await server commit, then update the coherent projection and return true. Rejections map to the existing local error callback/alert and return false. Do not use `if (promise)` or close before await. Cancellation must not submit; a failed save retains draft, selected record, tab, filter and validation messages. Pending uses existing disabled/loading affordances; if no suitable approved affordance exists, seek UI approval instead of adding a new screen/spinner layout.

Track one stable idempotency key per submission until its outcome is known. Do not retry payment/stock/intake under a new key after network failure. Invalidate/refetch relevant projections after success. Discard superseded read responses using request generation and aggregate versions so an older network response cannot overwrite a newer committed state. Component callbacks must not capture stale user/record identity. Refresh on session/role change before accepting further writes.

The API revision token identifies a consistent projection; aggregate versions provide optimistic concurrency. It is not an unspecified global integer counter. On 409 retain draft and use existing error channel; never silently overwrite or introduce a new conflict-resolution page. In-memory read caching may remain, but no persistent local business authority or successful-offline-write illusion. API outage must not fall back to shipped demo records as if they were current business data.

## INT-03 - Scoped integration sequence

Stage 4 builds/tests backend only. Stage 5 imports only after approval. Stage 6 integrates one module at a time, starting authenticated reads and identity, then master/intake/bookings, jobs/estimates/execution, materials/procurement, finance/documents and admin/sales. A financially coupled aggregate must switch as a whole: do not leave payment local and invoice remote or issue stock locally against server inventory. Cross-module dependencies require a tested coherent API state before switching a module. The immutable local data reference stays isolated for golden comparison, never simultaneous dual-writing. It is not a second application authentication mode.

Do not route RoleWorkspace to remote-* components based on auth mode. Keep approved components and page/menu decisions. Resolve backend UUID memberships through the audited source-compatible profile mapping; avoid id=-1 ownership shortcuts. Seven-role presentation and per-record controls stay unchanged while the server supplies authoritative permissions and denial results.

## INT-04 - Complete protected file impact register

The following 70-file inventory identifies planned seams versus protected reference files. 'Potential edit' means future authorization is required; it is not an edit performed now. Every changed line needs an exact diff review and relevant PAR tests. The 45 test guards remain unchanged until separately authorized corrections; all hashes are in 19's manifest.

| Protected file | Future impact | Regression requirement |
|---|---|---|
| index.html | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| package-lock.json | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| package.json | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/body-mark-vehicle.svg | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/car-damage-diagram.png | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/icon.svg | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/manifest.webmanifest | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/media-placeholder.svg | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/sw.js | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| public/workshopos-demo.sqlite | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| src/App.tsx | Potential edit: initialization, state adapter, awaited command callbacks, identity/session plumbing only | All menus/forms/dialogs/layout and async save/cancel/error outcomes; PAR-01/23/26 |
| src/admin-console.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/admin-demo-state.ts | Potential edit: persistence callers moved to API; preserve pure defaults/render/validation contracts | Eight templates, role grants, assets and frozen-history semantics |
| src/admin-users-api.ts | Potential edit: shared cookie/CSRF transport, typed errors and response mapping | No mode-triggered remote UI switch; no privileged client actor fields |
| src/advance-booking-range.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/auth.ts | Potential edit: shared cookie/CSRF transport, typed errors and response mapping | No mode-triggered remote UI switch; no privileged client actor fields |
| src/billing-manager.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/body-mark.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/booking-calendar.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/booking-check-in.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/booking-expected-today.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/booking-followup.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/dashboard-metrics.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/data-flow.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/db.ts | Immutable local reference during integration; production imports/callers redirected, no rule rewrite | No startup seed/browser writes in API mode; golden local behavior retained |
| src/demo-delivery-dates.json | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/developer-console.tsx | Protected simulation; production adoption out of scope | No real billing/invitation/support side effects |
| src/developer-control-plane.ts | Protected simulation; production adoption out of scope | No real billing/invitation/support side effects |
| src/document-download.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/document-snapshots.ts | Potential edit: persistence callers moved to API; preserve pure defaults/render/validation contracts | Eight templates, role grants, assets and frozen-history semantics |
| src/export-utils.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/finance-api.ts | Potential edit: shared cookie/CSRF transport, typed errors and response mapping | No mode-triggered remote UI switch; no privileged client actor fields |
| src/finance-ui.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/followups-api.ts | Potential edit: shared cookie/CSRF transport, typed errors and response mapping | No mode-triggered remote UI switch; no privileged client actor fields |
| src/inventory-import.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/inventory-seed.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/invoice-math.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/job-card-layout.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/job-card-notifications.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/job-delivery-highlight.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/job-documents.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/job-media.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/job-picker.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/job-sheet-ui.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/job-sheet.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/jobs-api.ts | Potential edit: shared cookie/CSRF transport, typed errors and response mapping | No mode-triggered remote UI switch; no privileged client actor fields |
| src/list-utils.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/local-sales.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/main.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/materials-ui.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/materials.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/pagination-toolbar.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/pdf-render.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/purchase-order-supplier-display.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/quotation-dialog.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/quotation-filter-bar.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/remote-finance.tsx | Protected; not selected as replacement interface | No accidental route/mode activation |
| src/remote-followups.tsx | Protected; not selected as replacement interface | No accidental route/mode activation |
| src/remote-sales.tsx | Protected; not selected as replacement interface | No accidental route/mode activation |
| src/report-templates.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/sales-api.ts | Potential edit: shared cookie/CSRF transport, typed errors and response mapping | No mode-triggered remote UI switch; no privileged client actor fields |
| src/sales-lead-dialog.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/sales-lead-register.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/service-advisor.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/styles.css | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| src/types.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| src/ui-kit.tsx | Potential edit only to data props/awaited event handlers where traced to an OP command | JSX hierarchy, labels, styles, fields, validation and success navigation unchanged |
| src/vite-env.d.ts | Protected pure/domain reference; no edit unless a specific integration dependency is evidenced | Exact behavior and golden unit/visual output |
| tsconfig.json | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |
| vite.config.ts | No integration edit planned | Exact hash; assets, build/dependencies, service worker and shipped fixture remain protected |

No blanket exception for App.tsx or components is permitted. Exact source spans for 197 components/52 forms and direct caller mappings are in the component/action/command ledgers. Generated impact categories do not certify every closure caller has been migrated; the later change package must list concrete handlers and replaced OP IDs before edits.

## INT-05 - Browser ownership and removal conditions

SQL business data, tab-specific admin settings, import state and frozen documents move to server authority only after approved preservation/reconciliation. Non-sensitive UI preferences and static asset caching may remain local. Do not clear existing profiles or remove v1/v2 storage keys in integration code. Uploaded live image bytes need a separate preservation decision. Retirement of db.ts/SQL.js/storage imports/service-worker behavior is a later Stage 7 package requiring all conditions in AGENTS.md; no dependency removal or lockfile change is authorized here.

## INT-06 - Acceptance per changed file/module

Compare protected diff, component/field/control behavior, seven-role and owner/status conditions, all CRUD commands including cancel/error/retry, cross-session refresh, selected-state preservation, exports/print and matching screenshots. Complete record-to-API trace for every changed caller. Demonstrate no SQL/browser business writes in API mode and no local fallback. Full 94-image preservation and additional approved conditional/mobile captures remain gates; a successful typecheck alone is insufficient.

## INT-AUTH - Approved unified login/session integration

Future smallest changes: auth.ts/shared transport handles persistent cookie credentials, CSRF and safe401/403 errors; App.tsx bootstrap/navigation/login/logout handlers validate GET /api/v1/session and use an explicit auth state machine. Preserve LoginScreen JSX/layout and existing form submission. Its dropdown event obtains both fields from the development-only fixture and resets both on selection; manual inputs remain editable and unrestricted to listed accounts. Do not switch to Cognito/remote workspaces or local SQL password matching by environment.

Use one normal POST login for either entry method, no auto-submit or login bypass. Retain eight existing dropdown choices; exercise service_manager manually with the existing manager accounts. Explicit build/deployment flags gate the convenience, not hostname inference. Production assembly excludes fixture modules/literals/source maps and credential-bearing public demo assets; runtime hiding alone fails acceptance. This is future packaging work under a separately authorized readiness scope, not permission to remove development behavior or change source now.

On app entry/refresh/restart/direct protected URL and login-route navigation, validate backend session before exposing protected state. Valid session at /login must replace history to the existing Dashboard destination once its exact role-safe mapping is resolved; invalid/expired/revoked session shows the same login screen. No invented page, role elevation, repeated redirect, or401-as-403 handling. Use existing pending/error affordances; UNKNOWN auth must not flash protected content. A navigation/network failure must not clear browser business records.

Logout awaits server revocation/cookie clearing, clears in-memory auth and redirects to login. If revocation fails, do not claim successful server logout; handle via existing error channel. Expiry/logout does not delete SQL/browser business data or replay uncertain commands; preserve request IDs and reconcile commits. Credential prefill may not silently reauthenticate after expiry. UserManager password-prefill/default/required behavior stays blocked pending its separate approval, with layout frozen.
