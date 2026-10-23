# 47 — PostgreSQL-only verification and retirement preparation

**Result:** the 20 exercised active-workflow browser suites pass without initializing SQLite or accessing persistent browser business records. SQLite retirement is **not approved or complete**: the normal application still uses SQL.js for its read projection, and local/developer modes remain. No persistence infrastructure was removed.

## Scope and protection

- Branch: `Prem-dev-fbb-Go21`; starting HEAD: `adb37f2f49b7201aaa5ed57b726db9d39426d349`. Tracked files were clean; existing untracked `.scratch/` work was preserved.
- Approved frontend: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Read AGENTS.md, migration index and reports 40–46; consulted Graft and traced affected persistence paths before editing.
- Tests used the existing disposable `slice_test` database and separate browser contexts/profiles. Local dev/import databases were read for reconciliation and visual fixtures only (authentication creates local sessions). No staging/production access, source SQLite writes, volume resets, commit or push.
- Pre-test `pg_dump -Fc` backups of local dev/test are in ignored `backend/customer-slice/artifacts/pgonly-preflight/`. Restore only into a separate disposable database; never overwrite an existing volume. Earlier SQLite copies and custody remain recovery sources.
- No backend service or schema changes. Migration head remains `20261022_0053`.

## Reversible verification mode

Run the existing local test API, then start Vite with PowerShell:

```powershell
$env:WORKSHOPOS_SLICE = 'test'
$env:WORKSHOPOS_POSTGRES_ONLY = 'true'
npx vite --host localhost
```

The flag requires the test slice and is rejected for a deployment build. Restart without the flag to restore the normal path; it is not a browser preference or URL switch.

`src/postgres-state.ts` composes the existing view model directly from FastAPI arrays. The static JSON contract contains column/default definitions, not business records. Ordering, archive filters, relationships, signed stock arithmetic and view composition match the SQL.js reader. Exact recursive comparisons passed on both a populated disposable-test projection and the preserved source projection.

In strict mode, `db.ts` never initializes SQL.js, loads a SQLite source, reads a saved database or writes a snapshot. Its compatibility handle rejects SQL methods; missing API projections fail. The mutation boundary visibly rejects remaining local operations, including the existing demo-reset control. Inventoried business-storage keys and SQLite/WASM fetches are guarded. Temporary UI preferences and static caching remain available. This is a verification mechanism, not a security sandbox against arbitrary injected JavaScript.

No layouts, forms, labels, navigation, styling, calculations or document templates were intentionally changed. The existing error handling displays unsupported-operation failures. Broader responsive and every-dialog parity remains unverified.

## Workflow results

| Workflows | Evidence |
|---|---|
| Authentication, seven roles, dropdown/prefill, manual login, logout, expiry and browser restart | Customer regression and seven-role suite; independent profiles and server session invalidation |
| Customers, vehicles and current-owner changes | Existing create/edit/view/archive/search flows; independent-session reads; ownership retains historical visit customer links |
| Bookings and reception | Booking CRUD, check-in and intake; native PostgreSQL relationships |
| Jobs, checklists, tasks and QC | Intake/checklist API gates; task transitions, rework and pass-all QC browser flows; reload persistence |
| Estimates, approvals, documents and media | Create/edit/approval, material reject/resubmit/approve, frozen HTML, PDF/print, upload/edit/archive and independent-session media access |
| Suppliers, purchasing, inventory and stock | Stock and job-material browser flows plus transaction/idempotency/edge API suites |
| Invoices and payments | Settlement, document and financial edge browser suites; independent database guards and idempotency API tests |
| Administration, settings, teams/catalog and CRM | User/role/configuration/catalog/quotation workflows and independent-session persistence |
| Dashboard and exports | Counts compared with PostgreSQL projection; XLSX contents and PDF output verified |

All **16 backend regression invocations** passed, including their shared authentication/customer checks. All **20 strict browser suites** passed: 40 verified application-page observations across 40 contexts, 1,387 API responses and 111 successful non-authentication mutations. No forbidden SQLite requests, unexpected local-storage attempts or missing-mode observations were recorded. Counters describe this run, not unique endpoint coverage.

Direct SQL independently confirmed the browser-created invoice/job/payment links and archived media/job relationship. Audit queries since the pre-test backup show customer changes and changes across 48 operational entity types. These counts include API fixture/regression setup as well as browser actions; they are not attributed solely to UI clicks.

Eleven adversarial checks passed: original decoy browser data survives; SQL reads/writes/export, persistence, bootstrap fallback and business storage reads/writes fail; temporary preferences work; demo reset fails visibly; unavailable API data cannot fall back locally. With a service worker active in a dedicated test browser, cache inspection found no API entries and offline API fetch failed. The test browser accepts the local self-signed certificate; application transport settings were not changed.

## Remaining persistence and file-level retirement matrix

| File(s) | Classification and removal readiness |
|---|---|
| `src/db.ts` | **Active normal-mode dependency.** SQL.js initialization, SQLite bootstrap, local-key migrations, persistence and SQL CRUD remain. Strict mode bypasses these. Pure view/calculation/formatting helpers are still shared: do not delete this file. Isolate SQL portions after promoting and verifying the direct adapter in the normal configuration. |
| `src/App.tsx` | API-mode business handlers are exercised. Local-mode callbacks and demo reset still exist. Five non-exported declarations have no identifier references outside their own declarations: `LegacyInwardPurchasesWorkspace`, `InwardPurchasesWorkspace`, `InventoryMaterialsManager`, `DuplicateInventoryEditor`, `DuplicateVisitEditor`. These bodies are removal candidates after approval, not new required navigation destinations. AST inventory supplements Graft's no-caller evidence. |
| `src/admin-demo-state.ts` | Active server-hydrated configuration plus local-mode session persistence. Remove only the local storage/migration branches after local-mode isolation; preserve defaults, validation and pure reducers. |
| `src/document-snapshots.ts` | API mode uses durable server snapshots/in-memory hydration. Local session snapshot branches remain recovery/local-mode code. Preserve rendering and snapshot contracts. |
| `src/developer-control-plane.ts`, `src/developer-console.tsx` | **Development-only simulation**, reachable through local developer login; not real tenant provisioning, billing or messaging. API login returns before that branch. Strict mode suppresses startup storage access. Retain as explicitly isolated tooling until its separate disposition is approved. |
| `src/auth.ts` and Cognito/sales adapters | Alternate authentication/configuration path. Session tokens/OAuth state are authentication state, not workshop business records. Not proven globally unreachable; do not delete as part of SQLite retirement. |
| `src/booking-calendar.tsx`, `src/booking-check-in.tsx`, `src/booking-expected-today.tsx`, `src/billing-manager.tsx`, `src/materials-ui.tsx` | Shared approved components retain local branches and/or SQL.js types. Keep components; remove obsolete branches/types only after their callers are isolated. |
| `src/main.tsx`, `public/sw.js` | Keep. Worker registers on load, including development; `/api/` is excluded, navigation is network-first and `/assets/` is cached. Old installed shells remain an upgrade concern: verify worker/cache upgrade during later deployment qualification. No business-cache fallback was observed. |
| `package.json`, lockfile, SQL.js/WASM dependency | Not yet safe to remove: normal/local mode and legacy tests still require it. WASM is executable static code, not a business dataset. |
| `public/workshopos-demo.sqlite`, other source copies, `data-migration/` | Preserve as recovery/import evidence even after runtime retirement; do not delete original data. |
| `tests/workshopos.spec.ts`, SQL-backed `unit-tests/*.test.ts`, slice `test_*_storage.mjs` | Legacy fixtures assume SQLite/local business storage. Keep until tests are separated into recovery/local-mode tests versus PostgreSQL acceptance tests. New strict wrappers replace only cache-serialization assertions with absence checks; workflow assertions remain. |
| `src/postgres-only.ts`, `src/postgres-state.ts`, `src/postgres-projection-defaults.json` | New verification guard and direct read adapter. Keep for the next normal-mode integration decision; guard is explicitly test-only. |

The exhaustive source inventory found no IndexedDB business-persistence calls. Browser business records are concentrated in the SQLite keys and administration/developer/document session keys above. No whole shared runtime file is certified for immediate deletion. No dependencies were removed.

## Historical and financial integrity

Custody remains **3,241 source records**, including **67 quarantined records**; no native promotion or fabricated identity occurred.

| Records | Impact |
|---|---|
| 52 checklist items | `checked_by=0` has no supported human mapping. Some historical checklist evidence/transitions remain gated; new native jobs and transitions work. |
| 2 bookings + 2 events | Immutable compatibility history remains visible. These imported bookings cannot be edited/checked in without resolving identity/provenance; new bookings are unaffected. |
| 2 departments + 2 manager links | Existing typed compatibility mapping supports administration; original custody is retained. |
| 7 stock rows | Exact immutable compatibility history contributes to balances. It is not fabricated native ledger history and does not block tested new stock operations. |

All 103 compared development tables remain equal to the preserved import under the established additive-field exclusions. Protected test tables and original financial rows match. All **51 invoice discrepancies**, original totals/statuses/payment allocations, imported quotations, seven stock rows and four original on-hand balances remain unchanged. Eight SQLite copies and 94 baseline screenshots retain their hashes. Payment/stock transaction and idempotency regressions pass. Historical financial editing remains disabled.

Missing historical media bytes still require an authentic source. Original user browser profiles were not mined or overwritten; any user-created legacy records need a separate reconciliation process.

## Unit, build and visual baseline

- **244 unit tests passed; zero failed.** Three old failures expected six total templates, despite the approved seed having six active defaults and two inactive quotation variants. Only expectations changed: eight defaults, named inactive variants, nine after adding one. Product templates were not changed.
- TypeScript and the normal production build passed; the existing large-chunk advisory remains. A strict-mode deployment build was correctly rejected. `git diff --check` passed.
- **37 visual states captured; 33 exact; four strict pixel comparisons differ.** Accounts Delivery/Invoice/Payment retain 10/19/12 pixels. Roles configuration differs by 22 pixels; CRM leads is exact in the final completed capture. Every difference has maximum channel delta **1** and is confined to rounded/anti-aliased edges. The prior two-pixel template-preview difference is now zero. This is evidence of rendering noise, not a reason to change approved UI or accept replacement baselines. Strict equality remains failed for those four states.
- Visual captures use read-only preserved local PostgreSQL GET fixtures to compare the same source dataset against the approved baseline. They are presentation checks, not substitutes for the live disposable-database mutation suites. Neither approved screenshots nor UI styles were updated.

## Changed files, evidence and next boundary

Product/integration changes: `src/App.tsx`, `src/db.ts`, `src/developer-control-plane.ts`, `vite.config.ts`, and the three new `src/postgres-*` files. Test correction: `unit-tests/report-templates.test.ts`. New verification scripts live in `backend/customer-slice/`; the complete file inventory and sanitized results are in [stage6-postgres-only-evidence.json.md](stage6-postgres-only-evidence.json.md). Raw ignored artifacts use the `pgonly-` prefix.

Verification entry points: `run_postgres_only_browsers.py`, `run_postgres_only_extra.py` (after `prepare_postgres_only_execution.py` inside api-test), `test_postgres_only_guards.mjs`, `test_postgres_projection_parity.mjs` (normal local dev reference), `run_postgres_only_visuals.py`, `compare_postgres_only_visuals.py`, `verify_postgres_only_writes.py`, and `verify_postgres_only_preservation.py`. The browser runner creates fresh approval fixtures through APIs; no reset is required.

**Retirement/staging blockers:** promote the direct adapter into the intended normal runtime under a separate approved change; isolate local/developer paths and update their tests; reconcile any real legacy browser records; retain/approve historical exceptions and media limitations; adjudicate strict rasterization differences and finish broader responsive/dialog/worker-upgrade coverage; qualify deployment configuration separately. The established local slice is not staging packaging. No full-migration or staging-readiness claim is made.
