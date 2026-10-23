# WorkshopOS backend migration baseline

Audit date: 2026-10-21. Source baseline: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7` plus the existing working tree. **Documentation only; no backend development or data migration.**

## Primary documents

1. [Application inventory](01-APPLICATION-INVENTORY.md)
2. [Page and UI contracts](02-PAGE-AND-UI-CONTRACTS.md)
3. [Workflows and business rules](03-WORKFLOW-AND-BUSINESS-RULES.md)
4. [Roles and permissions](04-ROLES-AND-PERMISSIONS.md)
5. [Current and demo data](05-CURRENT-DATA-AND-DEMO-DATA.md)
6. [Frontend-to-backend mapping](06-FRONTEND-TO-BACKEND-MAPPING.md)
7. [UI freeze and regression baseline](07-UI-FREEZE-AND-REGRESSION-BASELINE.md)
8. [Coverage matrix and unverified behavior](08-GAPS-AND-UNVERIFIED-BEHAVIOR.md)
9. [Migration readiness](09-BACKEND-MIGRATION-READINESS.md)

## Stage 1.5 — migration risk resolution

Completed documentation-only investigation on 2026-10-21. These findings supersede earlier uncertainty summaries where supported by new evidence; they do not authorize implementation.

10. [SQLite data authority](10-SQLITE-DATA-AUTHORITY.md) — all eight file hashes, all-table counts, record differences and dataset recommendation.
11. [Browser persistence audit](11-BROWSER-PERSISTENCE-AUDIT.md) — precedence, business storage, live-data limitations and proposed safe export.
12. [Existing backend assessment](12-EXISTING-BACKEND-ASSESSMENT.md) — 109 checkout routes versus 152 container routes, migration/auth drift, reuse classification and deployment.
13. [Transaction integrity](13-TRANSACTION-INTEGRITY.md) — financial/stock atomicity, constraints, concurrency and reproduced calculation mismatch.
14. [Test baseline issues](14-TEST-BASELINE-ISSUES.md) — three stale count assertions; eight intentional defaults with six active categories.
15. [Risk register and review decisions](15-MIGRATION-RISK-REGISTER.md) — severity, evidence, approvals, design/implementation blockers and coverage matrix.

15A. [Verification failure analysis](15A-VERIFICATION-FAILURE-ANALYSIS.md) — traces the separate 87-case Playwright run: 50 passed, 20 failed, 17 timed out; all 37 unsuccessful cases classified with stopping controls, roles, screenshots and gates. Distinguishes stale fixture/locator assumptions from unresolved defects, reconciles 94 images and 6,920 repeated DOM control occurrences with source counts, and records browser regression gaps. No mutating browser tests were repeated.

**Stage 1.5 assessment (updated by Stage 1.6 below):** recommend the tracked public SQLite file as raw shipped demo authority, subject to dataset-scope approval. Actual client browser records remain unverified. Known arithmetic, payment, stock and UI-mode differences require parity work before implementation acceptance.

## Stage 1.6 - backend foundation and architecture decisions

16. [Backend baseline reconciliation](16-BACKEND-BASELINE-RECONCILIATION.md) - identifies `prem-dev-fbb-backend` at `50c8aab1766b61c914e2829b460bfd1697723ec2` as the matching version-controlled backend candidate: all 21 runtime app modules match; 94/95 inspected source/config/test files match. Reconciles 43 added routes, 26 changed common handlers, 83 unchanged common handlers, migrations, authentication, services and deployment.
17. [Architecture decision register](17-ARCHITECTURE-DECISION-REGISTER.md) - ten proposed decisions covering foundation, schema, API, auth/RBAC, demo/browser data, transactions, media/documents, isolated tests and rollout/rollback. Every decision includes alternatives, risks, evidence and approval requirements.
18. [Backend parity matrix](18-BACKEND-PARITY-MATRIX.md) - 28 proposed acceptance scenarios and all 87 browser-test classifications; separately accounts for three template unit failures and unexecuted backend tests.

**Current recommendation:** selectively extend the pinned matching backend while retaining the approved `a315448` frontend. Adopt the public SQLite fixture (60 tables / 3,241 records, SHA-256 `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`) provisionally, pending data-scope approval. Candidate PO closure is more complete than the older checkout; financial arithmetic/payment/document mismatches remain. Read-only inspection confirmed 51 raw invoice subtotal/line discrepancies requiring explicit historical financial treatment. Browser data is still unknown.

**Readiness:** retain source/screenshots as the provisional UI freeze; complete executable workflow coverage remains incomplete. Ready for an approval-led PostgreSQL design phase, with final architecture sign-off conditional on the decision register. No implementation, migration or deployment approval is implied.

Stage 1.6 evidence: [source provenance](stage16-source-provenance.json.md), [exact route delta](stage16-route-delta.json.md), [candidate source/configuration excerpts](stage16-candidate-source.md), [legacy invoice discrepancies](stage16-legacy-invoice-discrepancies.json.md), [final verification](stage16-final-verification.md).

Stage 1.5 evidence: [SQLite comparison](stage15-database-comparison.json.md), [storage matches](stage15-storage-source.md), [checkout source analysis](stage15-backend-analysis.json.md), [checkout endpoints](stage15-endpoints.md), [runtime metadata](stage15-runtime-metadata.json.md), [runtime source analysis](stage15-runtime-backend.json.md), [runtime endpoints](stage15-runtime-endpoints.md), [migration graph](stage15-migration-graph.json.md), [integration callers](stage15-integration-source.md), [backend tests](stage15-backend-tests.json.md), [transaction source](stage15-transaction-source.md), [finance symbols](stage15-finance-symbols.md), [inventory symbols](stage15-inventory-symbols.md), [financial probe](stage15-financial-parity-probe.json.md), [template reproduction](stage15-template-test-run.md), [template probe](stage15-template-probe.json.md), [final integrity check](stage15-final-verification.md).

## Stage 2 - approved frontend baseline protection

19. [Approved frontend baseline](19-APPROVED-FRONTEND-BASELINE.md) - proposed full SHA, current branch/worktree, 70 protected runtime/source/asset/build files and 45 test guards, component contracts and API seams.
20. [UI regression protection](20-UI-REGRESSION-PROTECTION.md) - review of all 94 original screenshots, role/state/responsive gaps, reproducible future capture protocol and classification of all 87 historical browser tests.
21. [Financial reconciliation](21-FINANCIAL-DATA-RECONCILIATION.md) - every one of 51 discrepant invoices, stored versus line subtotal, tax/total/payment/balance sensitivity and explicit review status: 24 Pending, 27 Cleared. No historical correction is approved.
22. [Integration acceptance plan](22-INTEGRATION-ACCEPTANCE-PLAN.md) - proposed automated protections and all 28 parity scenarios, prioritized with pre-integration, feature-acceptance and production gates.

**Latest direction:** the user provisionally adopted backend candidate 50c8aab, public/workshopos-demo.sqlite and PostgreSQL business authority while preserving the frontend. Proposed frontend reference remains a315448ce8c3f8f86026b58c18a2231bb3e5e9a7. All 115 protected/guard files match that revision. Existing screenshots are retained; full conditional/mobile/workflow regression remains incomplete. Stage 3 architecture design is recommended after package review, with financial/auth/browser-data/media/rollout decisions explicit. Implementation is not authorized.

Stage 2 evidence: [file hashes](stage2-protected-file-manifest.json.md), [94-image manifest](stage2-screenshot-manifest.json.md), [full financial comparison](stage2-financial-reconciliation.json.md), [final integrity verification](stage2-final-verification.md). Eight derived review sheets are linked in 20; they do not replace original screenshots.

## Stage 3 - PostgreSQL architecture and API design

23. [Backend architecture](23-BACKEND-ARCHITECTURE.md) - candidate reuse, domain service changes, transaction/locking boundaries,12 critical service test specifications, documents/media and observability.
24. [PostgreSQL schema design](24-POSTGRESQL-SCHEMA-DESIGN.md) -106-table preservation-first proposal (105 application/support plus Alembic), all60 source tables/columns, all74 existing table definitions/constraints/indexes, additions and constraint exceptions.
25. [API contracts](25-API-CONTRACTS.md) -344 named operation dispositions,44 existing adapter methods,152 existing routes and148 proposed allowlisted command contracts with five read projections.
26. [Authentication and RBAC](26-AUTHENTICATION-RBAC-DESIGN.md) - proposed sessions, seven-role capabilities, record/tenant/branch enforcement, credential/support and approval gates.
27. [Demo-data migration design](27-DEMO-DATA-MIGRATION-DESIGN.md) - all-table mapping, idempotency, IDs/sequences,51 financial exceptions, browser preservation and rollback.
28. [Frontend integration plan](28-FRONTEND-INTEGRATION-PLAN.md) - minimum adapter/async changes, complete70-file impact register and unchanged UI contracts.
29. [Test and deployment architecture](29-TEST-AND-DEPLOYMENT-ARCHITECTURE.md) - disposable PostgreSQL/browser tests, CI, staging, restore and cutover design.
30. [Implementation work packages](30-IMPLEMENTATION-WORK-PACKAGES.md) - ordered packages, explicit decisions/blockers and conditional Stage4 recommendation.

**Latest approval status:** the user names frontend/backend/demo sources as baseline candidates. All unresolved approvals remain pending; earlier provisional adoption does not grant architecture, implementation, import, frontend change or deployment approval. Stage3 is documentation only. Recommend review followed by a separately authorized, bounded backend foundation package.

New strict source-reference audit found61 zero-sentinel reference values across58source records, in addition to51known invoice discrepancies; originals remain unchanged. Supporting evidence: [existing PostgreSQL schema metadata](stage3-existing-pg-schema.json.md), [complete schema/record mapping](stage3-schema-mapping.json.md), [operation/API map](stage3-operation-api-map.json.md), [148 structural command schemas](stage3-command-schemas.json.md), [existing44adapter methods](stage3-existing-api-adapters.json.md), [final verification](stage3-final-verification.md).

## Final authentication decision - approved requirements

The user explicitly confirms frontend a315448ce8c3f8f86026b58c18a2231bb3e5e9a7 and ONE shared backend authentication/session system for development and production. Existing development dropdown and credentials remain, using an explicitly gated fixture; dropdown/manual entry submit the same login endpoint. Backend persistent sessions, refresh/restart validation, CSRF, protected routes, valid-session login redirect and revoking logout are required. Production excludes fixture credentials and disables the convenience without a separate authentication architecture.

Canonical [authentication design](26-AUTHENTICATION-RBAC-DESIGN.md), [updated ADR-04](17-ARCHITECTURE-DECISION-REGISTER.md), [API contract](25-API-CONTRACTS.md), [frontend plan](28-FRONTEND-INTEGRATION-PLAN.md), [18 acceptance specifications](29-TEST-AND-DEPLOYMENT-ARCHITECTURE.md) and [work packages](30-IMPLEMENTATION-WORK-PACKAGES.md) supersede prior pending/separate-mode suggestions. [Documentation integrity check](auth-decision-verification.md).

Remaining narrow decisions: user-editor password behavior; exact existing Dashboard destination for non-Admin roles and /login route binding; session duration/renewal; public-development access restriction and provisioning/tenant/support details. Eight existing dropdown accounts cover six roles; manager accounts remain testable manually. No code, test, data, configuration or production change is authorized by this documentation update.

## Stage 4A — controlled foundation implementation

The latest status is [31 — Foundation results](31-STAGE4A-FOUNDATION-RESULTS.md): isolated pinned FastAPI candidate, separate disposable PostgreSQL services, 26 passing foundation tests, Alembic lineage/offline SQL verified, and unchanged frontend/data hashes. Earlier statements that no implementation has started describe their historical documentation stages. No business schema or demo data was imported; no frontend integration or deployment occurred.

See [32 — All 61 zero-sentinel references](32-ZERO-SENTINEL-CLASSIFICATION.md) for occurrence-level classification and approval gates, and [33 — Role landings and authentication dependencies](33-ROLE-LANDINGS-AND-AUTH-DEPENDENCIES.md) for existing authorized page keys and remaining session work. Document 32 corrects earlier generic opening-stock wording: affected stock records are purchase-order closure inwards. Document 33 qualifies the earlier generic Dashboard redirect with existing role-authorized first-menu behavior.

Stage 4A is complete within its infrastructure scope. Full migration replay, authenticated workflow acceptance and business compatibility remain unverified. Stage 4B requires review/approval. Operator instructions: [foundation README](../../backend/foundation/README.md).

## Stage 4B — disposable PostgreSQL schema validation

[34 — Schema validation results](34-STAGE4B-SCHEMA-VALIDATION.md) records two additive revisions after the unchanged 34-revision candidate history, final head `20261021_0035`, 106 tables, matching independent development/test catalogs, and 27 passing migration/integrity tests. All 115 protected files, 94 screenshots and eight SQLite copies remain unchanged. No demo data was imported and no frontend integration occurred.

[35 — Differences and import gates](35-SCHEMA-DIFFERENCES-AND-IMPORT-GATES.md) lists the 26 deferred mandatory compatibility columns and remaining financial/identity/status/date/sentinel decisions. **The table count is not full Stage 3 contract acceptance; Stage 4C demo import remains blocked.** Startup, test and guarded rollback commands are in the [schema-validation README](../../backend/schema-validation/README.md).

## Stage 4C-1 ? data compatibility and dry-run readiness

- [36 ? Data compatibility resolution](36-DATA-COMPATIBILITY-RESOLUTION.md): all 26 compatibility columns, historical references, statuses/dates, 61 zero references and preserved financial reconciliation.
- [37 ? Demo import dry run](37-DEMO-IMPORT-DRY-RUN.md): tooling, reproducible commands, executed validation and limitations.
- [38 ? Import readiness gate](38-IMPORT-READINESS-GATE.md): blocking decisions, target count projections, import order and rollback/retry design.

The dry run accounts for all 3,241 source records: 486 deterministic content candidates and 2,755 requiring review; **zero records cleared for actual import**. Twelve planner tests pass. Read-only PostgreSQL evaluation passes 4,787 CHECK expressions and leaves 5,841 incomplete inputs unverified. All 26 deferred columns remain schema gates; 51 historical invoice discrepancies are preserved. No import or schema changes occurred. [Protection evidence](stage4c1-protection.json.md) confirms 115 files, 94 screenshots and eight SQLite copies unchanged.

## Disposable import rehearsal ? executed

[39 ? Import rehearsal results](39-IMPORT-REHEARSAL-RESULTS.md) records the authorized real PostgreSQL rehearsal: 26 strict compatibility columns implemented, 12 source business records promoted, 3,229 quarantined with complete custody, zero failed/unaccounted records, and 24 passing tests. All 3,241 source rows reconcile; all 51 invoice discrepancies remain unchanged. Customer/vehicle/job/invoice business reads remain empty and blocked by unresolved historical mappings. This is not complete business migration. Earlier no-import statements describe their historical stages; document 39 records the later authorization and execution.

## Business import unblocking ? implemented and tested

[40 ? Business import unblocking](40-BUSINESS-IMPORT-UNBLOCKING.md) records the later fresh disposable rehearsal: **3,174 business records imported, 67 quarantined, zero unaccounted**, and **36 passing tests**. All customers, vehicles, visits, jobs, estimates, invoices, invoice lines, payments and photo metadata rows are promoted. Test-only PostgreSQL APIs return 121 customers, 132 vehicles, 145 jobs and 52 invoices. All 51 financial discrepancies and protected assets remain preserved. Historical exceptions are custody-bound; native requirements and essential foreign keys remain enforced. No frontend integration or deployment occurred. Remaining quarantine and unavailable artifacts mean migration is still incomplete.

## Coverage summary

| Measure | Result / definition |
|---|---|
| Page catalog | 32 page keys, including a legacy non-menu key; login and developer console separately inventoried |
| UI source | 197 named JSX components; 52 native form sites; 1,122 interactive declaration sites; 174 dialog/tab/alert/status sites |
| Workflows | 46 families, supported by 344 exported non-JSX function contracts (helpers are not counted as user workflows) |
| Roles | 7 built-in workshop roles; separate developer/support concepts and custom-role configuration |
| Shipped SQLite | 60 tables, 3,241 rows; all schema fields and records inventoried read-only |
| Other defaults | 7 configured roles, 5 initial logs, 8 templates; developer fixture has 1 tenant |
| Screenshots | 94 current-source images plus 1 diagnostic image from the pre-existing build |
| Verification | TypeScript passes; unit tests 241 pass / 3 fail of 244; protected browser captures across all seven roles |
| Important limitation | Actual existing browser records, live backend records, exhaustive action runtime parity and some legacy reachability are UNVERIFIED |

Counts of source declarations, rendered instances, route keys and workflow families are deliberately distinct. This prevents inflated completeness claims from duplicated/legacy code.

## Evidence appendices

| Evidence | Contents |
|---|---|
| [Screenshots](evidence-screenshots.md) / [rendered browser data](evidence-browser.json.md) | Actual route/role/state images and visible controls |
| [Component index](evidence-component-index.md) / [complete component contracts](evidence-ui-component-contracts.md) | Exact source spans, hierarchy, defaults, fields and event handlers |
| [Control ledger](evidence-ui-controls.md) / [per-action mapping](evidence-action-mapping.md) | Stable control/form/state IDs and qualified backend relations |
| [Operations](evidence-operation-contracts.md) / [private validators](evidence-private-data-contracts.md) / [command mapping](evidence-command-mapping.md) | Inputs, return behavior, validation, SQL, dependencies, callers and transaction evidence |
| [Type/master constants](evidence-types-and-constants.md) / [evaluated defaults](evidence-default-fixtures.json.md) | Types, statuses, enums, configuration and default records |
| [SQLite schema/counts](evidence-sqlite-schema.md) / [demo records](evidence-demo-records.md) | DDL, columns/keys/relationships, integrity, hashes and every shipped row; credentials redacted |
| [Existing backend](evidence-existing-backend.md) / [API calls](evidence-api-calls.md) | Existing endpoint and migration declarations; deployed behavior unverified |
| [Storage](evidence-storage-extra.md) / [browser dependencies](evidence-browser-dependencies.md) / [CSS](evidence-css-responsive.md) | Persistence and runtime dependencies, responsive breakpoints |
| [Test declarations](evidence-test-index.md) / [test-operation map](evidence-test-operation-map.md) | Existing test coverage versus requirements |
| [Typecheck](evidence-typecheck.md) / [unit execution](evidence-unit-test-run.md) | Raw verification results, including failures |

The `.json.md` files contain machine-readable JSON evidence while remaining documentation artifacts. Audit extraction/capture recipes are kept as `.mjs.md` documentation, not application code. Large source appendices preserve exact implementation contracts; human-readable requirements and uncertainty decisions live in the numbered documents.

Readiness is **conditional**, not full signoff. Review the gap register before approving architecture. The original discovery did not implement or import data. Subsequent foundation/schema implementation and dry-run preparation are documented above; the later disposable partial import is recorded in document 39; no deployment has occurred.

Additional evidence: [field register](evidence-field-register.md), [all SQLite copies](evidence-all-databases.md), [record differences](evidence-database-differences.md), [relationship/index checks](evidence-data-integrity.md).

Final checks: [documentation validation](evidence-final-verification.md) and [baseline hashes](evidence-baseline-hashes.md). All primary-document and screenshot links resolve; control IDs are unique; the shipped SQLite hash is unchanged.

## Current implemented slices (2026-10-22)

The initial audit above is historical. See [41 ? Customers/authentication](41-FIRST-POSTGRESQL-CUSTOMERS-SLICE.md), [42 ? Vehicles, Reception and Jobs](42-VEHICLES-RECEPTION-JOBS-SLICE.md), and [43 ? Estimates, Approvals and Job Documents](43-ESTIMATES-APPROVALS-JOB-DOCUMENTS-SLICE.md) for implemented local slices and their limitations. No production/staging deployment or original persistence retirement has occurred.

Latest implementation: [44 - Purchases, Inventory and Stock](44-PURCHASES-INVENTORY-STOCK-SLICE.md). Existing screens use the PostgreSQL slice; report 44 records concurrency, stock reconciliation, visual results and the retained historical-native-ledger/dormant-screen limits. No deployment or persistence retirement occurred.


Latest financial integration: [45 ? Invoices, Payments and Financial Workflows](45-INVOICES-PAYMENTS-FINANCIAL-WORKFLOWS.md). Existing invoice edits, full-payment settlement, closure and financial documents now use the PostgreSQL slice. Imported financial records remain immutable, all 51 discrepancies are preserved, and partial-payment/write-off workflows were explicitly excluded to retain approved behavior. See the report for tests, document/visual comparisons and remaining boundaries. No deployment or persistence retirement occurred.


Latest remaining-module integration: [46 - Remaining Modules and Historical Exceptions](46-REMAINING-MODULES-HISTORICAL-EXCEPTIONS.md). Bookings/check-in, execution/QC/follow-ups, users, configuration, teams/catalog/task lists, CRM and current vehicle ownership edits use PostgreSQL. Dashboard/export checks read PostgreSQL projections. Original source records and all 51 financial discrepancies remain preserved. Historical quarantine, explicitly simulated developer state and strict visual/unit-test limitations remain documented; this is not full migration signoff or persistence retirement.


Latest verification: [47 - PostgreSQL-only verification and retirement preparation](47-POSTGRESQL-ONLY-VERIFICATION.md). A reversible test-only direct API projection passes active workflow regressions without SQLite initialization or browser business storage. Normal-mode SQL.js and recovery/developer paths remain; no persistence retirement or deployment occurred. See the report for historical exceptions, corrected stale unit expectations, strict visual differences and file-level retirement gates.

Latest implementation: [48 - SQLite retirement and final regression](48-SQLITE-RETIREMENT-FINAL-REGRESSION.md). Normal startup now requires FastAPI/PostgreSQL without a special test mode. SQL.js is development-only for preserved recovery/fixture tests; original SQLite files remain unchanged. Verification passed 248 unit tests, 16 API invocations, 20 normal workflow browser suites, targeted administration concurrency checks and seven-role compiled-bundle login/session checks. Visual results remain 33/37 exact with the four tiny differences identical to Stage 47. Historical restrictions, rollback evidence and conditional staging readiness are recorded in the report. No commit, push or deployment occurred.

Latest deployment preparation: [49 - Existing Hetzner staging preparation](49-STAGING-DEPLOYMENT-PREPARATION.md). An isolated candidate with pinned images, restricted PostgreSQL credentials, private HTTPS access and independent backup/restore has been prepared and tested locally. Read-only host inventory supports a separate PostgreSQL container on the existing server. No remote changes or deployment occurred. See the [runbook](../../deploy/stage49/READINESS.md) for prerequisites, exact future commands, rollback and outstanding activation gates.

Latest readiness gates: [50 - Final staging deployment gates](50-FINAL-STAGING-DEPLOYMENT-GATES.md). Sixteen functional packaged suites passed on fresh local resources, with data preservation and full restore verified. The proposed hostname is now `workshopos.nexiohyper.com`; the [Stage 50 runbook](../../deploy/stage50/READINESS.md) supersedes Stage 49 hostname/cutover instructions. Remote activation remains NO-GO pending off-host backup, secret provisioning, DNS zone review and acceptance gates. No remote changes occurred.
