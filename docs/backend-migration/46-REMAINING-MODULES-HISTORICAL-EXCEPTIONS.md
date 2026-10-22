# 46 ? Remaining Modules and Historical Exceptions

Implementation and verification checkpoint, 2026-10-22. This continues reports 40?45; it does not replace their implementation or authorize deployment, historical financial editing, or source-persistence retirement.

Branch: `Prem-dev-fbb-Go21`. Unchanged HEAD: `06bbce9a2119f60388a9a14c52c78e1e1c4b36ec`. Approved UI: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Existing scratch files and the previously untracked financial evidence file were preserved. No commit/push/reset/deployment was performed.

Read AGENTS.md, the migration index, reports 40?45, existing page/action/API inventories and relevant source workflows. Graft map/ask/grep/skeleton/callers supplied repository context before implementation. Existing local dev/test databases were backed up to `backend/customer-slice/artifacts/pre-remaining-20261022-131338/{dev,test}.dump`; mutations for acceptance tests used only the isolated test service and fresh Playwright contexts.

## Remaining-work matrix and delivered behavior

| Area found | Integration delivered | Verification / retained boundary |
|---|---|---|
| Booking calendar, capacity, calls and lifecycle | PostgreSQL create/edit/confirm/reschedule/cancel/no-show/call/capacity commands; snapshot fields preserve approved forms | 49 API assertions; 8 browser checks including independent reception session and check-in. Historical two bookings remain read-only |
| Booking check-in | One transaction creates customer/vehicle where required, visit, job, initial checklist/task/QC/media and arrival links | API replay and linkage; existing check-in dialog; no partial arrival |
| Tasks, QC, washing and follow-ups | Versioned scoped commands, assigned-technician/owner/advisor checks, audited archive and rework | 37 API assertions; 7 technician/QC browser checks |
| Checklist lifecycle | Existing PostgreSQL checklist gates retained; task/QC/follow-up actions now feed them | Prior lifecycle/financial regressions pass; 52 historical checked-by=0 records remain quarantined |
| Historical vehicle ownership | Existing customer selector changes current owner; visit/customer and historical financial associations remain untouched | 9 API and 3 browser checks; PostgreSQL before/after audit records include actor. Test restores prior current owner with an audited write |
| User administration | Create actual password-hashed accounts, membership/profile/branch links; update/archive; invalidate sessions on role/password changes | 32 API and 5 browser checks; no browser password authority; existing-password mask does not overwrite password |
| Roles and page permissions | Persist existing configuration; server checks configured page grants in addition to existing module RBAC | 48 configuration API assertions; all seven roles retain manual login and authorized navigation/session behavior |
| Teams/departments/catalog/masters | Typed scoped compatibility departments and manager links, advisor teams, catalog, brands/segments, audit and FK checks | 44 API and 3 browser checks; original four department/manager custody records retained |
| Job Task List / estimate prefill | Existing add/edit/done/archive controls call PostgreSQL; queued inline edits retain versions; rate snapshots preserved | 6 browser checks with a nonempty task list, prefill and reload |
| Settings/theme/assets/templates/import staging/logs | Existing administration state stored in scoped PostgreSQL JSON with validation/version checks and operational audit | 5 browser checks including a second session; existing forms unchanged. Import wizard still stages records as approved; it does not silently post stock |
| CRM leads/quotations | PostgreSQL lead create/edit/site-visit fields; quotation create/edit/status and durable lines/template HTML | 35 API and 5 browser checks, including PDF download and reload. Source create/edit GST difference preserved; imported quotation remains read-only |
| Dashboard / reports / exports | Existing calculations/renderers consume the PostgreSQL projection and persisted configuration | 6 dashboard/report checks: counts agree with PostgreSQL and Excel/PDF downloads work |
| Dormant stock/inward declarations | Existing stock/inward API integration retained; duplicate stock editor callbacks now also call existing audited commands | Stock API/edge/storage regressions pass. Unmounted forms were not added to navigation; their browser reachability remains unverified |
| Documents/media | Existing durable content and document snapshot integration retained; new persisted template/assets configuration feeds existing renderers | 53 estimate/document/media API assertions and financial document/browser regressions pass. Missing historical bytes cannot be recovered from metadata |

The shipped SQLite has 60 business tables: 59 are supplied through the PostgreSQL projection (customers use their explicit projection path). The remaining `approvals` table is empty and belongs to the superseded legacy declaration; current material approvals use the already integrated material-approval tables. This is source-table coverage, not a claim that every historical record is native or every dormant declaration has runtime coverage.

## Historical exceptions and financial preservation

Original import custody remains **3,241 records**, including **67 QUARANTINE dispositions**. No custody disposition or original payload was rewritten, and **zero records were silently promoted to the constrained native schema**.

| Original exceptions | Treatment | User-visible consequence |
|---|---|---|
| 52 checklist items | Original `checked_by=0` has no evidence-backed human identity; preserve custody and constraints | Some historical checklist evidence/transitions remain unavailable or gated. No fabricated completion/actor |
| 2 bookings + 2 events | Immutable compatibility projection retains original snapshot fields/events and IDs; no fabricated customer/vehicle/creator | History is visible, but commands/check-in on those imported bookings remain read-only. New bookings/check-in work |
| 2 departments + 2 manager links | Exact integer department/profile relationships mapped into typed, scoped compatibility tables with custody FKs; original timestamps retained as source text | Existing Team Structure works without inventing audit actors or timezone interpretations. Later edits are separately audited |
| 7 stock records | Existing immutable stock compatibility bridge retained exactly; included in balance calculations | Historical ledger drill-down remains compatibility history, not invented native movements |

Read-only reconciliation confirms all 103 compared development tables equal the preserved import after excluding documented additive schema fields. Test immutable tables and original imported financial rows also match. Original invoice headers/lines/payments/receipts/gate passes/events and the imported quotation/lines remain unchanged. All **51 invoice discrepancies** retain their original values, statuses and allocations. All seven stock compatibility rows and all four source on-hand balances match. Eight original SQLite files and 94 approved screenshots retain their hashes.

The current-owner vehicle edit does not migrate historical visits to the new owner. Existing visits preserve their customer FK, and the existing operational audit captures previous/new owner and real authenticated actor. No ownership dates are inferred for older records.

## Schema/backend and frontend scope

New slice migrations **48?53**, applied additively to local dev/test:

- 48: native booking snapshot support and immutable historical booking bridge, scoped grants/guards.
- 49: narrow audited execution/QC/follow-up edits.
- 50: constrained user-management function; hashed credentials and session invalidation without broad runtime credential writes.
- 51: scoped versioned administration configuration and audit.
- 52: typed historical department/manager compatibility, advisor teams, catalog/master/task-list edits.
- 53: native CRM commands and audited quotation-line replacement/archive; historical financial guards retained.

New backend modules: `bookings.py`, `execution_workflows.py`, `administration.py`, `configuration.py`, `catalog_workflows.py`, `sales_workflows.py`. `api.py`, `operations.py` and `operational-mapping.json` mount/serve them. Reception creation was extracted into a shared transaction helper for booking check-in. Six frontend adapters isolate API calls.

Frontend files modified: `App.tsx` (existing handlers, task edit drafts, configuration hydration), `admin-console.tsx` (async commands), `admin-demo-state.ts` (server hydration/disable local authority), the three booking components, `local-sales.tsx`, `operations-api.ts`, and `db.ts` (projection guards/cache stripping). No CSS, layouts, routing, labels, document-renderer templates or component libraries were replaced. Existing business calculation differences were preserved explicitly.

The complete changed/new file inventory and test evidence are in [stage6-remaining-evidence.json.md](stage6-remaining-evidence.json.md). New source-backed default export fixtures and verification scripts are under `backend/customer-slice/`. Existing test edits only update the current cache-key lookup, supply a URL to the authorization request stub, or wait for asynchronously loaded data before assertions/capture; historical keys, assertions and baselines are retained.

## Verification results

- New feature suites report **254 assertions**, plus the shared 42 authentication/customer assertions. All passed. Ownership audit was also inspected directly in PostgreSQL.
- Prior vehicle, reception/jobs, estimates/documents/media, approvals, purchase/stock, financial workflows/materials and independent financial database-guard suites passed. The estimate suite initially exposed an outdated `SimpleNamespace` request without `url`; adding the real request shape made its unchanged integrity assertions pass (53).
- Browser runs passed for booking/check-in, task list/prefill, execution/QC, users, configuration, teams/catalog, CRM, ownership, customers, vehicles, financial settlement/edge flows, and seven-role session/navigation. The CRM test initially used a wrong selector and then an insufficient fixed wait; it passes with the observed selector and response/render waits.
- Comprehensive storage test: **51 checks passed**. Integrated business rows are absent from the new persisted SQL.js snapshot; sampled direct local writes are rejected; earlier source keys/document snapshots remain intact.
- Dashboard/export test: **6 checks passed**, including real XLSX content and PDF file output. CRM PDF output also passed.
- TypeScript and production build passed. Build retains the existing large-chunk advisory. `git diff --check` passed.
- Unit suite: **241 passed, 3 failed**, the same existing report-template expectations for six templates versus eight actual defaults. Tests were not changed to accept this mismatch.
- Strict visual comparisons: **33 of 37 states pixel-identical** at 1440?900. Three Accounts states retain tiny differences (10/19/12 pixels); configuration template preview differed by 2 pixels. These remain strict-comparison failures, not approved replacement baselines. Customer view initially captured before its API response; waiting for loaded job detail restores exact parity. No exhaustive responsive/all-dialog parity claim is made.

Tests and artifacts live under `backend/customer-slice/artifacts/`; the committed-document-style evidence summary contains sanitized results, not credentials. Fresh test rows and audited failed-attempt fixtures remain in the disposable test database; no reset was used.

## Outstanding boundaries before full regression/signoff

1. Resolve the missing historical actor/provenance policy for the 52 checklist records and imported booking/stock native promotion. Do not invent users, timestamps or movements. Historical financial editing remains separately approval-gated.
2. Recover actual historical media bytes from an authentic source if available; metadata alone cannot supply them.
3. The explicitly labelled Developer Console remains a browser simulation (tenant/communication/subscription demo state), not real tenant provisioning, billing or message delivery. Superseded unmounted duplicate editors and empty legacy approvals still contain local declarations; they are not added to approved navigation and are not certified as runtime workflows.
4. The original browser profiles' potentially user-created records were not silently imported or overwritten. Their earlier keys and original SQLite copies remain recovery assets; a user-specific reconciliation/import step is still required if such records exist.
5. Shared SQL.js remains a memory projection/query engine and recovery mechanism. There is no silent SQLite fallback or dual write for newly integrated business modules. Local-mode infrastructure and the demo-reset control remain; API-mode projection guards reject local business reset. Retirement requires its separate acceptance/approval process.
6. Fix or explicitly adjudicate the three existing unit failures and four strict visual differences; run full approved responsive/workflow regression, including currently unmounted screens only if their intended reachability is confirmed. No baseline was updated.
7. This is the established local FastAPI slice, not staging/production packaging or deployment readiness. Rollback means restoring a checkpoint into a separate database and reconciling subsequent audited writes, never overwriting preserved volumes.

**Outcome:** supported remaining workshop integrations implemented and verified without intended UI/workflow redesign. Full migration/signoff is not claimed because historical and simulated/dormant boundaries remain. No original SQLite modification, automatic financial correction, commit, push or deployment occurred.
