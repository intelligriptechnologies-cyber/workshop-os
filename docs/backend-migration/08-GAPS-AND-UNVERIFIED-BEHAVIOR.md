# Gaps and unverified behavior

VERIFIED means supported by the evidence type stated in the row; source verification is not runtime verification. PARTIALLY VERIFIED means at least one relevant layer was inspected but a required layer/state remains missing. UNVERIFIED means no adequate observation supports the claim. Failed tests are explicit failures, not verification of the intended behavior.

## Coverage matrix

| Scope | Source / data evidence | Runtime evidence | Overall status |
|---|---|---|---|
| 32 declared page keys | All reconciled to 01; includes legacy receive-vehicle | Default role navigation captured; legacy standalone entry not observed | PARTIALLY VERIFIED |
| 7 built-in workshop roles | Role/menu/grant definitions and guards | All seven visited in local demo mode | VERIFIED for default menu rendering; PARTIALLY VERIFIED for every record/action permission |
| 197 component / 52 form / 1,122 control declarations | AST ledger, full components, handlers and conditional expressions | Rendered controls for captured states only | PARTIALLY VERIFIED; dynamic/legacy reachability unresolved |
| 46 workflow families | Commands, validators, data effects and tests mapped | 241 passing unit tests, read-only browser navigation; no full browser save sequences | PARTIALLY VERIFIED |
| Shipped SQLite schema and rows | Immutable read: 60 tables, 3,241 rows, schema/records/hash/integrity | No writes performed | VERIFIED for shipped file only |
| Existing browser localStorage/sessionStorage/IndexedDB | Storage code and keys traced | User profile inaccessible; isolated profile intentionally empty | UNVERIFIED actual stored records/counts |
| Default admin/developer fixtures | Evaluated pure defaults with explicit timestamp | Settings tabs observed; writes disabled | VERIFIED default fixture values; UNVERIFIED user-customized values |
| Uploaded media lifecycle | Export strips payload; unit tests and validators | No new uploaded record or reload exercised | PARTIALLY VERIFIED |
| Reports/templates/frozen docs | Source, ADR, default fixtures | Template UI observed; three unit failures | PARTIALLY VERIFIED, known failure |
| Existing backend/API/migrations | Endpoint functions and migration source catalogued | No live backend data/RLS/Cognito tests | PARTIALLY VERIFIED source; UNVERIFIED deployed behavior |
| Print/PDF/export/import | Source handlers and relevant unit assertions | No exhaustive file-output/device verification | PARTIALLY VERIFIED |
| Responsive/accessibility | CSS and dialog behavior | Desktop all roles; one mobile dashboard | PARTIALLY VERIFIED |
| Notifications/communications | Local notification stub and developer simulation | No real delivery attempted | VERIFIED stub existence; UNVERIFIED external delivery |
| Approval artifact/current compiled build | Git/source baseline identified | Existing dist rendered error; source build works | PARTIALLY VERIFIED; signed visual reference unavailable |

## Gap register

| ID | Gap / consequence | Required disposition before relying on it |
|---|---|---|
| GAP-01 | Existing browser profile inaccessible: browser connector reported profile already in use. User-created SQLite/session state may override fixtures. | Read-only export/inspection of the intended browser origin/profile; count/hash/classify before migration |
| GAP-02 | Backend already exists and Cognito mode swaps selected workspaces to remote variants, while local SQL startup still occurs. | Confirm target runtime and reconcile local/remote fields, permissions, schemas and actions before selecting architecture contracts |
| GAP-03 | Three report-template tests fail because defaults produce 8 templates while assertions expect 6. | Review intended categories/template counts; do not silently change tests or remove templates |
| GAP-04 | Service manager shares advisor pages but lifecycle helper accepts Owner or linked `service` only. | Confirm intended manager mutation scope; preserve current behavior pending decision |
| GAP-05 | Uploaded photo bytes are intentionally stripped from persisted SQLite; snapshots/assets/imports live in session storage. | Decide required durable media/document/config migration scope while preserving visible workflows; inventory existing session-only content before loss |
| GAP-06 | Multiple pre-existing scratch databases/restoration snapshots have unresolved provenance; live PostgreSQL data was not queried. | Identify authoritative sources and duplicate/conflicting records; no automatic union/import |
| GAP-07 | Legacy/Duplicate components and low-level commands coexist with actor-aware/current PO flows. | Complete runtime reachability classification; do not implement every dead helper as a public endpoint |
| GAP-08 | Not every conditional dialog, role-record combination, empty/loading/error/success state or dynamic control was exercised. | Targeted regression pass on disposable approved test data; retain action ledger as the checklist |
| GAP-09 | Existing dist showed an error; current source build is the audit reference. | Reconcile intended shipped build and client-approved revision before visual signoff |
| GAP-10 | Single-browser synchronous persistence does not define concurrent edits, retries, numbering or stock/capacity contention. | Architecture must define integrity/idempotency while retaining current user-visible sequence |
| GAP-11 | Standard payment closes jobs, while voidPayment rejects terminal jobs. Historical eligible records may still expose void. | Confirm correction policy; do not invent reopening/partial payment workflows |
| GAP-12 | `docs/agents/issue-tracker.md` and `docs/agents/domain.md` referenced by instructions are absent. Root CONTEXT.md contains older design guidance, not migration acceptance evidence. | Keep current approved source as reference; restore/clarify documentation separately |
| GAP-13 | Graph output for some files has stale spans (e.g. admin-console). | AST/source baseline spans take precedence; no graph rebuild performed because it writes outside authorized docs directory |
| GAP-14 | Storage errors, offline/service-worker caches, cross-session persistence and quota limits not tested. | Verify in a disposable environment with explicit storage-test scope |
| GAP-15 | Real Cognito, branch/tenant isolation, support emulation, RLS and production authorization not exercised. | Security and integration validation before backend acceptance |
| GAP-16 | Field/control-to-backend mapping includes component-scoped candidate calls, not a fully proven callback trace for every declaration. | Resolve remaining aliases/dynamic callbacks and mark exact action-operation pairs during contract review |

The baseline is deliberately not described as exhaustively runtime-verified. No guessed success, screenshot, live record count or backend parity result is promoted to VERIFIED.
