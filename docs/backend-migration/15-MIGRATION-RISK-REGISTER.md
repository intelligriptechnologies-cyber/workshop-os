# 15 — Migration risk register and review decisions

Audit date: 2026-10-21. Stage 1.5 supersedes the unresolved-question summaries in 08/09 where new evidence is given below. It does not replace the approved UI baseline or authorize implementation.

**Assessment:** sufficient evidence now exists to identify the main design constraints, but not to approve a final architecture or begin integration. Reconcile the backend source/runtime baseline and decide dataset scope first. Existing backend infrastructure is worth extending; existing business handlers are not uniformly compatible with the approved frontend.

## Final decision table

“Design block” means blocks final architecture approval, not read-only analysis of options. “Implementation block” means blocks the affected integration/import or acceptance, not documentation. User approval entries identify future decisions/actions; none was executed here.

| ID / finding | Evidence | Severity | Recommended action | User approval required? | Design block? | Implementation block? |
|---|---|---|---|---|---|---|
| RISK-01 — Eight SQLite copies have different authority | [10](10-SQLITE-DATA-AUTHORITY.md), all-table/key comparison | High | Adopt DB-01 as raw shipped demo source; retain DB-07 as initialized comparison; preserve all alternatives | Yes: dataset adoption/import scope | Conditional: ownership/import assumptions | Yes: data import |
| RISK-02 — Actual browser records unavailable | [11](11-BROWSER-PERSISTENCE-AUDIT.md), blank browser inventory | Critical for preservation | Approve existing-profile export and reconciliation; distinguish session settings/snapshots/live images | Yes: export scope and conflict decisions | Conditional: data/media ownership | Yes: preservation claim/cutover |
| RISK-03 — Running backend is ahead of checkout | [12](12-EXISTING-BACKEND-ASSESSMENT.md): 152 vs 109 routes, migration head 0033 vs 0017, database auth | Critical | Identify maintained revision and reconcile image/source/migrations before selecting extension baseline | Yes: maintained backend baseline | **Yes** | **Yes** |
| RISK-04 — Financial arithmetic differs | [13](13-TRANSACTION-INTEGRITY.md), executed ₹109 vs ₹100 probe | Critical | Preserve approved proportional discount/rounding; add future parity tests and adapt backend calculation | Existing freeze already establishes intended rule; approval for later code task | No: required behavior known | **Yes: invoicing** |
| RISK-05 — Payment/closure and purchase posting boundaries differ | TX-04/TX-09; separate payment/handover endpoints, immediate checkout inward stock | Critical | Implement equivalent atomic commands after baseline review; preserve receipt/confirmation/closure semantics | Later implementation approval; separate approval only for proposed rule changes | No: atomicity requirement known | **Yes** |
| RISK-06 — Role and status gates differ | TX-11, local lifecycle policy vs backend manager/completion gates | High | Map each actor/action/status combination; preserve approved grants and errors | Approval only if changing approved policy; later implementation task | Conditional: identity/tenancy model | Yes |
| RISK-07 — Auth mode selects alternate remote screens | App RoleWorkspace, API callers | Critical for UI freeze | Integrate existing approved components through compatible read/command contracts | Later implementation approval | No: UI freeze is fixed | Yes |
| RISK-08 — Document snapshots/media not fully durable remotely | STORE-03/04/08; JSON backend HTML; stripped image exports | High | Define ownership, frozen rendering, media retention and failure atomicity; export live-only data if required | Yes: retention/scope decisions | **Yes: document/media ownership** | Yes |
| RISK-09 — SQLite lacks declared FKs; concurrency assumptions differ | REL-01, CONCUR-01 | High | Validate relationships across approved dataset, specify ownership/uniqueness and command concurrency | Later architecture/implementation review; no cleanup authorized | Conditional: nullable/history exceptions | Yes: integrity acceptance |
| RISK-10 — Three template tests assume six defaults | [14](14-TEST-BASELINE-ISSUES.md), source history and pure probe | Medium | Preserve eight defaults; update count/identity/active invariants in future test-only task | Yes: later test edit | No | Acceptance baseline only |
| RISK-11 — Conditional actions lack full runtime verification | Coverage matrix below; action candidate mappings | High | Complete exact callback/command mapping and isolated scenario testing before affected integration acceptance | Later mutating test environment approval | Conditional: any unresolved material contract | Yes for affected workflows |
| RISK-12 — Deployment/auth/isolation not proven end to end | Checkout staging frontend-only config; privileged DB connection; 40 backend test functions not run | High | Reconcile deployment topology, restricted runtime context and auth; test in approved isolated environment | Yes: deployment/environment choices | **Yes: deployment/auth boundary** | Yes |

## Requirements evidence coverage — Task F

| Coverage item | Status | What is established | What is not established / closure |
|---|---|---|---|
| 32 page keys and source component mapping | VERIFIED (source) | 01/02 plus UI contract evidence enumerate keys/components; login/developer surfaces counted separately | Does not imply every conditional render is browser-verified |
| 52 forms, 1,122 control declarations, 533 fields | VERIFIED (source inventory); PARTIALLY VERIFIED (behavior) | Stable declaration locations and field/control registers; duplicates and conditional declarations distinguished | Component-scoped candidate operation dependencies are not exact action callback maps; trace callbacks for critical commands |
| 46 workflow families | PARTIALLY VERIFIED | Source operations, guards and persistence contracts documented in 03 and appendices | Not all success/failure branches exercised; family count is not test coverage |
| Browser screenshots | VERIFIED for captured states only | Stage-1 manifest contains 94 current-source captures and one pre-existing-build diagnostic | This stage added no UI captures; screenshots do not prove saves, concurrency, persistence or all validation states |
| Seven roles | VERIFIED (source roles and earlier role renders); PARTIALLY VERIFIED (authorization) | 04 differentiates built-in, custom, developer/support concepts | Cross-product of role × actor ownership × status × branch × action remains untested; remote identity mapping differs |
| Legacy/unreachable components | PARTIALLY VERIFIED | Duplicate/legacy declarations and the non-menu receive-vehicle key are labeled separately; LegacyInwardPurchasesWorkspace is not evidence of a current navigation feature | Do not add backend/front-end scope merely because unused source exists; conditional reachability needs explicit tracing |
| SQLite copies and record differences | VERIFIED | All eight hashes, schemas, counts and record comparisons; identical-copy groups | User authority decision and actual browser reconciliation pending |
| Browser persistence implementation | VERIFIED (source); UNVERIFIED (current contents) | Keys, precedence, initialization writes and image stripping documented | No active client origin/profile/tab available; approved export needed |
| Checkout and container backend surfaces | VERIFIED (source/metadata); PARTIALLY VERIFIED (runtime capability) | AST route registries and migration graph; read-only runtime metadata | No business endpoint/auth/isolation mutation tests; image source provenance and approved revision unresolved |
| Financial tax-discount parity | VERIFIED mismatch | Pure-function comparison reproduces different totals | Full calculation matrix and downstream documents still need tests |
| Three template failures | VERIFIED diagnosis | Reproduction, source commit and deterministic pure probe | No test changes; client sign-off specifically on default count unavailable |
| Backend tests | VERIFIED inventory; UNVERIFIED execution | 40 source test functions classified in test evidence | Not run against the active database; isolated environment required |
| Live remote staging / offline behavior | UNVERIFIED | Repository deployment/service-worker rules inspected | No live staging validation or current-profile offline test |

## Critical integration gaps to close

1. **Identity and tenancy:** local integer users, role grants and linked advisors must map to server membership/branch ownership without losing visibility or permitting cross-tenant references. Choose auth baseline before mapping session behavior.
2. **Exact actions:** replace component-level candidate dependencies with exact handler → command → input/output → error/status/navigation traces for financial, stock, booking, QC and approval actions. Retain existing stable screen/action/workflow IDs; use the TX IDs as risk cross-references, not replacement workflow counts.
3. **Asynchronous failures:** specify pending/double-click/retry/stale-edit behavior for currently synchronous commands without redesigning forms. Ensure no false success after partial HTTP chains or storage failures.
4. **Historical documents:** include templates, company assets, frozen snapshots, numbers, void history and live-only photos in ownership/export scope. SQLite counts alone omit these business artifacts.
5. **Conditional tests:** verify empty/loading/invalid/permission-denied/archived/status-specific controls, failed saves, competing commands and retry rollback in an approved disposable environment. Existing screenshots must remain the visual reference.
6. **Source freshness:** graph context was useful for discovery but some cards differed from checkout. Bind future evidence to actual revision and file hashes. Separate prior `data-migration/` artifacts from this audit; their presence is not proof of current behavior or approval.

## Audit boundaries and change accounting

Only documentation was intentionally written under `docs/backend-migration/`. No frontend/backend/test/configuration/dependency/database changes, migration, merge, commit or push were performed. Existing containers were inspected, not started/rebuilt/restarted. Database access for this stage used immutable SQLite connections and an explicit PostgreSQL read-only metadata transaction; business records were not changed. Template and arithmetic probes used disposable in-memory values.

One tooling side effect is disclosed: the initial required `graft map` auto-refreshed generated graph index metadata (reported 11 files). This was not an intentional application edit; subsequent graph calls used `--no-refresh`. Existing worktree modifications were not reverted. See [final integrity verification](stage15-final-verification.md) for database hash rechecks and Git state. This exception must not be hidden under an unqualified claim that absolutely no filesystem state outside documentation changed.

## Review outcome requested

Review the six documents, choose the maintained backend revision and dataset scope, and approve any browser export and future test correction separately. No automatic selection, data merging, frontend change or backend development is authorized by this report. Work stops at documentation.
