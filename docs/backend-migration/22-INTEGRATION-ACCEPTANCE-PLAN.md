# 22 - Integration acceptance plan

Stage 2, 2026-10-21. Proposed checks only; no backend functionality, automated guard, test correction or deployment is implemented. The approved presentation remains unchanged. Backend candidate is prem-dev-fbb-backend at 50c8aab1766b61c914e2829b460bfd1697723ec2; frontend reference is a315448ce8c3f8f86026b58c18a2231bb3e5e9a7. The shipped public SQLite is the provisional demo source and PostgreSQL the future business authority. Historical discrepancies may not be silently corrected.

## Gates and evidence requirements

G0 means required before integrating backend behavior into the protected frontend. G1 means required before a PostgreSQL-backed feature is accepted; tests needing PostgreSQL cannot be passed before that implementation exists. G2 means required before production release. A scenario can have preparation at G0 and execution at G1/G2. Priority P0/P1/P2 orders work, not permission to omit enabled features.

Every run must record frontend/backend full revisions, lockfiles, served bundle identity, migration head, fixture hash, explicit actor/tenant/branch and record IDs, clock/timezone, browser/viewport, steps/assertions, outcome and trace/image/data evidence. A skipped/unreachable/blocked condition remains UNVERIFIED. Existing tests and all 46 workflow families must map to stable WF/ACT/FORM/ROLE/entity IDs from the prior contracts; endpoint existence is not passing workflow evidence.

| Check | Gate | Proposed automated assertion | Failure evidence / disposition |
|---|---|---|---|
| PRO-01 Source protection | G0 and every change | Compare 70 protected files plus 45 guards against 19's manifest; detect additions/deletions/renames and dependency drift | Exact diff/hash; reject unintended change. Reviewed adapter changes require a narrow explicit exception and parity evidence, never an entire App.tsx exemption |
| PRO-02 Visual equivalence | G0 reference; G1/G2 comparisons | Same role/record/state/viewport; compare 94 immutable originals where reproducible, plus separately approved missing states | Original/actual/diff and environment metadata; no auto-blessing, money/permission masking or unapproved replacement |
| PRO-03 Form behavior | G0 contracts; G1/G2 execution | Required/default/type/options, validation, disabled controls, cancel, retained draft on failure, navigation after committed success, double-submit | Scoped DOM/trace and persistence effects; cover 52 form sites and their conditional reachability, not just default screenshot |
| PRO-04 Roles and ownership | G0 expected matrix; G1/G2 | All seven roles, manager ownership/team, custom-role configuration where enabled; permitted action succeeds and denied action leaves data unchanged | UI controls plus API authorization results and before/after rows; hiding buttons alone insufficient |
| PRO-05 Financial preservation | G0 golden data/policy; G1/G2 | All 52 headers/105 lines/payment relationships unchanged by import; 51 exceptions explicitly preserved; approved new arithmetic examples | Per-field reconciliation and owner-approved policy; no silent historical normalization |
| PRO-06 CRUD and async integration | G0 command contracts; G1/G2 | Existing add/view/edit/archive/delete semantics through PostgreSQL, reload and fresh profile; success only after commit; errors preserve approved UI | Requests, DB effects and UI state; prove no local fallback masks missing remote data; no invented delete behavior |
| PRO-07 Atomicity and concurrency | G0 boundaries; G1/G2 | Inject failure after each financial/stock/booking write; duplicate requests, retries and concurrent actors produce one valid outcome | Committed rows, lock/conflict results and rollback checks; no duplicate numbers/payments/issues/claims |
| PRO-08 No loss/duplication | G0 mapping; G1/G2 rehearsal | Source-to-target key map, per-entity counts and normalized field/relationship checksums, archive/history/media references | Exception ledger with approved reasons; 60 source tables need not become 60 target tables; total counts alone insufficient |
| PRO-09 Documents and media | G0 contract/storage decision; G1/G2 | Existing templates, print/export fields, durable blobs and role/phase access; reload/restart retains links | Rendered document, content hashes and ownership failures; no historical regeneration with changed totals |
| PRO-10 Operational rollback | G0 design; G2 rehearsal | Restore database plus objects, deploy pinned compatible versions, handle post-cutover writes under approved RPO/RTO | Restore reconciliation and rollback runbook; reverting app code alone is not data rollback |

## All 28 parity scenarios assigned

Detailed inputs and assertions remain in [18](18-BACKEND-PARITY-MATRIX.md). This table adds execution priority and protection gates; it does not weaken those assertions.

| Scenario | Scope | Priority | G0 preparation | Required execution |
|---|---|---|---|---|
| PAR-01 / AT-01 | Async save/error/navigation | P0 | Command/UI contract | G1 all integrated commands; G2 full suite |
| PAR-02 / AT-02 | Discounts/rounding | P0 | Approve golden financial examples | G1 pure + API parity; G2 persisted/document totals |
| PAR-03 / AT-03 | Historical 51 discrepancies | P0 | FIN-01 policy and immutable report | G1 import rehearsal; G2 full reconciliation |
| PAR-04 / AT-04 | GST/currency/precision | P0 | Approve local examples/types | G1 arithmetic/persistence; G2 document consistency |
| PAR-05 / AT-05 | Payment/receipt/handover closure | P0 | Preserve one-action local contract | G1 atomic workflow; G2 retry/concurrency |
| PAR-06 / AT-06 | Voids/corrections | P0 | Allowed/forbidden state policy | G1 permitted and denied cases; G2 history audit |
| PAR-07 / AT-07 | Invoice claims/estimate snapshot | P0 | Eligible-line and history contract | G1 claims/voids; G2 concurrent claims |
| PAR-08 / AT-08 | Number generation | P0 | Preserve old numbers; approve future convention | G1 sequence/retry; G2 concurrency/rollover |
| PAR-09 / AT-09 | Requests/reservation/shortage | P0 | Stock ownership and quantities | G1 reservation/conflicts; G2 concurrency |
| PAR-10 / AT-10 | Issue/consumption | P0 | Atomic stock ledger effects | G1 issue/reverse restrictions; G2 no double-consumption |
| PAR-11 / AT-11 | Quote prerequisites | P1 | Eligibility/approval rules | G1 valid/invalid workflows; G2 end-to-end |
| PAR-12 / AT-12 | Purchase splitting/status | P1 | Preserve existing PO semantics | G1 split/status; G2 full purchase chain |
| PAR-13 / AT-13 | Receipt/confirmation/closure | P0 | Receipt atomicity | G1 stock and closure; G2 repeated/partial receipt |
| PAR-14 / AT-14 | Job transitions/actor | P0 | Status/role transition table | G1 allowed/denied; G2 all actors |
| PAR-15 / AT-15 | Tasks/QC/rework | P1 | Status and ownership examples | G1 task/QC flow; G2 complete rework chain |
| PAR-16 / AT-16 | Booking/check-in/capacity | P1 | Clock/slot fixture contract | G1 lifecycle; G2 concurrent capacity |
| PAR-17 / AT-17 | Intake/customer/vehicle identity | P0 | Identity/dedup/validation | G1 CRUD + duplicate prevention; G2 cross-module linkage |
| PAR-18 / AT-18 | Follow-up/search | P1 | Filter/ownership/reminder rules | G1 reads/writes; G2 local/remote equivalence |
| PAR-19 / AT-19 | Media validation/durability | P1 | Durable object ownership design | G1 upload/reload/failure; G2 restart/restore |
| PAR-20 / AT-20 | Media role/phase | P1 | Actor/state permissions | G1 permit/deny; G2 full permission matrix |
| PAR-21 / AT-21 | Document rendering | P1 | Templates/number/totals contract | G1 render/download; G2 print/PDF history |
| PAR-22 / AT-22 | Template/settings | P1 | Eight-default fixture expectation | G1 defaults/edit/activation; G2 persistence |
| PAR-23 / AT-23 | Authentication/RBAC | P0 | Identity/session/tenant decision | G1 login/expiry/denial; G2 isolation/security |
| PAR-24 / AT-24 | Import/archive/browser preservation | P0 | Export and conflict policy; actual data unknown | G1 disposable import; G2 approved real-data reconciliation |
| PAR-25 / AT-25 | Concurrency/retries | P0 | Idempotency/transaction contracts | G1 fault injection; G2 multi-actor stress |
| PAR-26 / AT-26 | Dates/filter/pagination/export | P1 | Fixed clock and result-set contracts | G1 boundary/empty/page cases; G2 export parity |
| PAR-27 / AT-27 | Notification/developer simulation | P2 | Enabled scope and non-production isolation | G1 enabled features; G2 notification failures/no leakage |
| PAR-28 / AT-28 | Deployment/offline | P0 | Authoritative DB/offline/rollback policy | G1 no hidden local fallback; G2 deployment/restore rehearsal |

## Safe isolated test strategy

Use disposable PostgreSQL databases, dedicated backend instance and dedicated browser profiles with no operational mounts, credentials or existing storage. Verify target identity before any write/cleanup. Pin frontend source and backend candidate, disable server reuse, establish clean migration replay separately from upgrade history tests. Seed explicit actors and eligible records under frozen time. Preserve a raw fixture copy and its SHA; create test-only scenarios in disposable state. Storage-clearing hooks may run only in those dedicated profiles. Do not run the historical suite against current client/demo records.

First establish corrected fixture/locator/environment behavior for the 37 unsuccessful historical cases, then rerun all 87 and the independent unit suite. Preserve eight shipped report defaults; update only the three stale count expectations in a later authorized task. Add missing manager, sales, booking, QC, payment/closure and PO browser scenarios. Backend candidate source tests require their own isolated execution; previous counts of test functions are not a passing backend baseline. See [20](20-UI-REGRESSION-PROTECTION.md) for classifications and visual capture gaps.

## Approval register and remaining blockers

| Decision / uncertainty | Approval needed | UI freeze | Architecture design | Implementation / release |
|---|---|---|---|---|
| Confirm proposed frontend SHA and protection package | User review; no signed client SHA artifact available | Source freeze provisional until confirmation | Can proceed with explicit reference | Required before accepting UI changes/integration |
| New/regenerated screenshots and deterministic reference environment | Explicit approval before capture replacement | Existing 94 retained; missing states incomplete | Does not block schema design | Required for complete visual acceptance |
| FIN-01 historical headers/lines/status treatment | Financial owner | Record discrepancy, preserve originals | Preservation design can proceed; final mapping conditional | Blocks financial acceptance |
| New arithmetic/tax/payment/correction/number examples | Financial/business owner per ADR-07 | Existing local behavior remains reference | Model alternatives now, finalize after decision | Blocks affected commands |
| Auth/RBAC, tenancy and session integration | Product/security owner per ADR-04 | Role contracts retained | Requires decision for final security design | Blocks authenticated integration acceptance |
| Actual browser data scope/export/retention/conflicts | Data owner; safe export remains unperformed | Does not invalidate shipped-fixture source baseline | Design preservation path now; actual volumes unknown | Blocks real-data migration/cutover |
| Disposable test environment, test corrections, media and rollout policy | Later task authorization and ADR-08/09/10 approval | No present code/config change | Design can proceed | Execution and release gates remain unmet |

The user provisionally adopted backend candidate, public demo source, PostgreSQL authority and frontend preservation. Those directions are no longer wholly undecided. They do not approve migration, financial normalization, security policy details, test modifications or deployment.

## Stage 3 recommendation

Proceed to PostgreSQL architecture design after review of this protection package, retaining explicit unresolved decisions. There is sufficient source/data/contract evidence to design preservation, transaction and adapter boundaries. Full UI baseline certification and backend implementation acceptance are not ready: missing visual states, 37 unsuccessful historical browser cases, three stale unit assertions, incomplete end-to-end coverage, browser records and financial policy remain open. Stop here for review; no backend development is authorized by this document.

## Approved authentication requirements update

AUTH-DEC-01 in26 now settles one authentication/session architecture, development dropdown/manual equivalence, persistent backend sessions, CSRF, redirects/logout and production fixture exclusion. The frontend SHA is user-confirmed. The auth row above now applies only to remaining tenant/multi-role/support, session-duration and exact role-safe Dashboard routing details; development dropdown retention is not awaiting approval. AUTH-AT-01..18 in29 are required at G1 for auth integration and G2 for production packaging. User editing remains a separate approval gate.
