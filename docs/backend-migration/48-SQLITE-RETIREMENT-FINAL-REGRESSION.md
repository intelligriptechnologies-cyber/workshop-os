# 48 — SQLite retirement and final regression

Normal Workshop OS operation now requires FastAPI/PostgreSQL. SQL.js initialization, implicit browser business persistence and local fallback have been retired without deleting recovery data or changing approved layouts. This implements the Stage 47 retirement decision; it is not deployment approval or permission to edit historical financial records.

## Checkpoint and scope

Branch: `Prem-dev-fbb-Go21`. HEAD remains `adb37f2f49b7201aaa5ed57b726db9d39426d349`. Approved frontend: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Stage 47 was present as uncommitted implementation and evidence; it was preserved rather than reset or recreated. AGENTS.md, reports 40–47, the Stage 47 retirement matrix and Graft informed this change. Graft was refreshed afterward.

Before implementation, `.scratch/stage48-checkpoint/` captured 1,187 tracked/task files in `working-tree.zip`, their SHA256 manifest, Stage 47 ignored evidence/screenshots in `stage47-evidence.zip`, and local `dev.dump`/`test.dump`. Both custom-format dumps passed `pg_restore --list`. `recovery-checks.json` records archive/dump hashes. No database restore, volume reset, schema migration, commit, push or deployment occurred. Migration head remains `20261022_0053`.

Testing used the existing disposable local slice test database/API, dedicated browser contexts, and fresh native fixtures. Local development/import databases were read for preservation and visual fixtures, not mutated. Production and staging were not accessed.

## Runtime changes and protected files

The following is the Stage 48 product delta, not the cumulative Git diff containing Stage 47 work. The complete file inventory is in [sanitized evidence](stage7-sqlite-retirement-evidence.json.md).

| File | Change and justification |
|---|---|
| `src/db.ts` | Removed SQL.js/WASM runtime initialization, localStorage bootstrap/save and SQL projection hydration. Startup requires API customers and projection. The opaque handle rejects SQL calls; reads use the in-memory API projection. Missing projection tables fail visibly. `persist` rejects local writes. Explicit `readLegacyState` and fixture helpers remain isolated for recovery tests. |
| `src/customer-api.ts` | API integration is unconditional; an environment switch cannot select local business persistence. |
| `src/postgres-only.ts` | Promoted the Stage 47 guard to permanent policy. No special test mode is required; metadata explicitly reports `testMode:false`. Inventoried business storage and SQL/WASM requests are denied. Temporary UI preferences remain usable. The historical filename is retained. |
| `src/App.tsx` | Removed local database startup and local/developer login fallback. Retired local mutations display the existing error mechanism. User archive passes the displayed record/version to the adapter. No markup, forms, styling or navigation redesign. |
| `src/administration-api.ts` | Update/archive use the displayed record's version before falling back to the projection version index, preserving optimistic concurrency when a late projection omits a newly created user. |
| `src/admin-demo-state.ts` | Configuration uses the API-hydrated state; default browser session persistence is unavailable. Explicit injected stores remain for fixture tests. |
| `src/document-snapshots.ts` | Document state comes from API hydration; implicit browser persistence is unavailable. Pure planning and explicit injected stores remain for tests. |
| `src/developer-control-plane.ts` | Implicit browser persistence is unavailable. Simulation source remains for explicit isolated tooling. |
| `vite.config.ts` | Normal development selects the API slice; production no longer depends on local proxy certificates. A build assertion rejects SQL.js runtime modules and emits `.verification/postgres-runtime.json`. Production contains no development credential prefill data. |
| `public/sw.js` | Advances the static cache to `workshopos-static-v4-postgresql` to evict old installed shells. API exclusion and legitimate static caching remain. |
| `package.json`, `package-lock.json` | Moves `sql.js` out of production dependencies into devDependencies for retained recovery/fixture tests. It is not removed from the development installation. |

The only changed page component in this stage is `src/App.tsx`, for startup/authentication/mutation dispatch and the archive handler described above. Other modified frontend modules are data adapters or persistence policy. Styles, report templates, invoice calculations and material calculation source retain Stage 47 hashes. No approved UI or business workflow was redesigned. Local developer simulation/reset is disabled in normal operation under the explicit Stage 48 authorization.

## Remaining legacy references and isolation

| Retained source | Why retained / normal reachability |
|---|---|
| SQL helpers and `readLegacyState` in `src/db.ts` | Legacy unit fixtures supply their own in-memory engine. Normal `openWorkshopDb` never supplies an engine, and `readState` reads only API projections. Shared pure types/calculations remain required. |
| SQL.js type imports in shared components | Compile-time only; no engine in production bundle. Do not delete shared components simply because they retain types or old branches. |
| Local mutation callbacks in approved components | The normal mutation dispatcher rejects them; integrated actions use their API adapters. Retained source is not evidence of an active SQLite backend. |
| Developer Console and simulation helpers | The local login entry was removed. Developer mode starts false; the return-to-developer action requires emulation entered from that console, leaving no normal entry path. No implicit browser store is supplied. Adaptation to PostgreSQL simulation is not implemented. |
| Administration/document/developer injected-store interfaces | Explicit memory-store fixtures/recovery tooling only; no default browser business store. |
| Legacy Cognito `src/auth.ts` session storage | Authentication state, not authoritative business records. Current slice sessions use FastAPI. |
| `tests/workshopos.spec.ts`, old storage-specific slice tests | Historical local fixtures are not the normal PostgreSQL acceptance gate. The new runners preserve workflow assertions and replace only obsolete cache-serialization assertions with absence checks. Future cleanup must distinguish fixture tests from active acceptance tests. |
| `public/workshopos-demo.sqlite`, other SQLite copies and import tooling | Preserved recovery/provenance assets, never requested by tested normal startup. Their presence does not enable fallback. |
| `sql.js` development dependency and types | Required by explicit legacy fixture/recovery tests. No runtime dependency or production WASM initialization remains. |

The Stage 47 exhaustive inventory found no IndexedDB business persistence. Stage 48 source checks found no `initSqlJs` or localStorage access in `src`; retained store interfaces require explicit injection. No whole shared module was deleted on an assumption of unreachability. Original browser profiles were not mined or overwritten.

## Verification results

| Check | Final result |
|---|---|
| TypeScript and production build | Passed. Build manifest: PostgreSQL, `testMode:false`, empty SQL.js runtime module list. Existing chunk-size advisory remains. |
| Unit tests | **248 passed, 0 failed**. Four new runtime/persistence tests added to the Stage 47 total of 244. |
| Backend API regression runner | **16 invocations passed**, including authentication/customer checks, bookings, execution, administration/configuration, documents/media, calculations, payment idempotency, inventory concurrency and database guards. |
| Ordinary normal-mode browser workflows | **20 suites passed**: 18 main suites plus execution and dashboard/reports. No PostgreSQL-only application flag was set. |
| Administration late-projection regression | **5 checks passed** in an additional targeted fault-injection suite, with actual PostgreSQL mutation requests. |
| Compiled production bundle | All **seven roles** manually logged in, read API projections and retained sessions on reload. No SQLite/WASM requests. |
| Adversarial fallback/storage | **12 checks passed**: SQL reads/writes/serialization, storage fallback and source fetch attempts rejected; API failure visible; decoy original records unchanged; temporary UI preference usable. |
| Service-worker upgrade | Old v3 cache removed; only v4 static cache remains; stale API cache cannot supply offline business responses. |
| Cross-session and database evidence | Native browser writes survive new authorized sessions. Independent SQL evidence confirms invoice/job/payment/media links and audits across the integrated entities. |
| Approved visual comparisons | **33/37 exact**. Four strict comparisons still fail for maximum channel delta 1; details below. Baselines unchanged. |

Covered active workflows include authentication/logout/role access; customers and vehicle ownership; bookings/check-in/reception; jobs/checklists/execution/QC; estimates/approvals; documents/media; suppliers/purchases; inward/inventory/stock; invoices/payment/closure; configuration/users/roles; CRM; dashboards/reports/exports and cross-module links. This is coverage of the established suites, not an assertion that every possible responsive state or interaction was exhaustively tested.

The runtime browser guard records API paths/statuses, rejects SQL/WASM requests and unexpected local persistence attempts, and verifies normal-mode metadata. Main workflow suites use live local test APIs. Visual captures use immutable GET fixtures from preserved local PostgreSQL for equivalent presentation data; they are not counted as proof of database writes. The targeted administration suite alone intentionally injects an older projection to reproduce the race.

### Failures investigated

The initial ordinary administration suite exposed a real adapter race: a newly created displayed user had version 1, but a late projection omitted it from the global version map. Edit sent no version and correctly received HTTP 409. The adapter now prefers the displayed version; a deterministic regression recreates that late projection before both edit and archive. Edit sends version 1 and archive version 2; both pass. Backend stale-version protection is unchanged. The ordinary administration suite also passed on rerun; its result retains `previous_exit:1`.

One sales visual capture failed during route shutdown in the inherited fixture helper. The new immutable GET fixture preloads configuration/projection and tolerates only already-closed/handled route errors during shutdown. Sales recapture passed. An initial compiled-bundle smoke attempt timed out; the full seven-role rerun and final post-fix run passed. No product cause is claimed for that timeout.

The three pre-Stage 47 unit failures were stale template-count expectations: the approved seed has six active defaults plus two inactive Marron/Yellow quotation variants. Stage 47 changed expectations from six to eight defaults and nine after adding one. Stage 48 did not change those assertions or product templates. Thirteen SQL-fixture test edits only alias `readLegacyState` as their existing `readState` import; assertions remain byte-identical to the checkpoint. Four new tests produce **244 + 4 = 248**.

Visual differences: roles configuration 22 pixels; Accounts Delivery 10, Invoice 19 and Payment 12. All have maximum channel difference 1 at anti-aliased edges. Each of those four Stage 48 screenshots is **pixel-identical to Stage 47**. This supports rendering noise rather than a new regression; strict equality still fails and no baseline was replaced. Final users capture also passed after the archive-handler change.

## Financial, inventory and historical integrity

Preservation verification passed: 103 original development tables match under the established additive-field comparison rules; 46 immutable test tables match; imported financial rows match the preserved import; all **51 invoice discrepancies**, original totals/taxes/statuses/allocations and historical financial read-only restrictions remain. All seven historical stock rows and four original on-hand balances match the untouched SQLite source. No historical correction, fabricated stock movement or schema change occurred.

All **3,241 custody source records**, including **67 quarantined records**, retain provenance; no native promotion occurred:

| Exceptions | User-visible impact |
|---|---|
| 52 checklist records | Missing supported human identity (`checked_by=0`) continues to gate some historical evidence/transitions. New native checklists work. |
| 2 bookings + 2 events | Imported compatibility history remains immutable; these bookings cannot be edited/checked in without evidence-backed identity resolution. New bookings work. |
| 2 departments + 2 manager links | Existing typed compatibility mapping supports administration while original custody remains. |
| 7 stock records | Immutable compatibility history contributes to balances; it is not fabricated native ledger history. Tested new stock operations work. |

Eight SQLite copies and 94 approved baseline screenshots retain their hashes. Missing historical media bytes still require authentic source material. Unreconciled records in users' original browser profiles require a separately controlled reconciliation process; they were not automatically imported or erased.

## Evidence, rollback and staging assessment

[Sanitized evidence](stage7-sqlite-retirement-evidence.json.md) contains the exact Stage 48 file inventory, suite results, database reconciliation, visual comparisons and recovery hashes. Raw local evidence is under `backend/customer-slice/artifacts/retirement-*` and `.scratch/stage48-*`.

Reproduction entry points in `backend/customer-slice/`: `run_retirement_browsers.py`, `prepare_retirement_execution.py` / `run_retirement_extra.py`, `test_retirement_administration.mjs`, `test_retirement_guards.mjs`, `test_retirement_production.mjs`, `test_retirement_worker.mjs`, `run_retirement_visuals.py`, `compare_retirement_visuals.py`, `verify_retirement_preservation.py`, `verify_retirement_writes.py`. Existing `run_remaining_regressions.py` supplies the API coverage. Run fixture creation only against the guarded local test slice. The production smoke serves compiled assets in an isolated browser while API traffic uses the local test FastAPI service.

Rollback is file-level recovery from the pre-Stage 48 archive, preserving Stage 47 uncommitted work; no destructive Git reset is needed. Review the inventory and restore only Stage 48 changes if rollback is requested. Keep current files separately before any future restoration. Database snapshots are available for restoration into a **new isolated database**, never over an original volume. Dump structure was validated; a full restore rehearsal was not performed in this stage. Application rollback requires no schema downgrade. Retain these local archives securely; they contain source/data, not publishable artifacts.

Normal-mode SQLite retirement is verified for the active suites. Staging readiness remains **conditional**: qualify deployment secrets, origins, API routing, authentication configuration and packaging separately; adjudicate the four strict visual differences and broader responsive/dialog coverage; retain the approved historical financial restriction and resolve/reconcile legacy evidence only with authentic sources. No production/staging deployment was attempted. This report does not claim unrestricted historical editing, complete recovery of missing media, or full migration of unknown user-browser records.
