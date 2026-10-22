# 30 - Implementation work packages and approval register

Stage 3 design deliverable only. No package is authorized to execute by this document. User approval of architecture is required before Stage 4; later import, frontend integration, retirement and deployment stages require their own explicit approval under AGENTS.md. The user-confirmed frontend baseline is a315448ce8c3f8f86026b58c18a2231bb3e5e9a7. Backend50c8aab1766b61c914e2829b460bfd1697723ec2 and public SQLite hash04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae remain separate foundation/data candidates.

## WP register

| Package / stage | Dependencies | Concrete scope and expected files | Acceptance / approval gate |
|---|---|---|---|
| WP-00 / review | None | Approve candidate SHAs, schema/API design and decisions below; no implementation | Signed package scope, exact unresolved decisions and owners; no implicit blanket approval |
| WP-01 / Stage4 foundation | WP-00 | Selectively extend backend candidate in later isolated branch/worktree; backend/app/database.py/config.py and Alembic lineage; no frontend branch merge | Clean replay and separate prior-head bridge, limited runtime principal, exact source provenance; old migration/test mismatch resolved |
| WP-02 / Stage4 contracts/tests | WP-01 | Backend contract schemas, service transaction/idempotency helpers, disposable harness; proposed facade module in backend/app; approved tests only | 148 canonical schemas/wire conversions resolved, actor stripping, error/version/replay tests; no current-profile writes |
| WP-03 / Stage4 schema/provenance | WP-01/02 plus sentinel/identity decisions | New Alembic revisions M3-02..07, source map/import preflight only; no real import | 106-table proposal reviewed, every column/FK/index/default, preservation/constraints/precision tests and RLS |
| WP-04 / Stage4 auth/admin | WP-03 and AUTH decisions | database_auth.py/auth.py/tenancy.py/tenant_admin.py; seven-role grants and profile bridge | Login/session/CSRF/revocation, seven-role/owner/tenant denial, no demo credentials or real invitations |
| WP-05 / Stage4 intake/jobs | WP-03/04 | intake.py/jobs.py/execution.py/checklists.py/service_catalog.py and tests | PAR-14..17; booking/check-in atomicity, local lifecycle/manager/task/QC/estimate parity |
| WP-06 / Stage4 inventory/procurement | WP-05 | materials.py/inventory.py/procurement.py and tests | PAR-09..13/25; demand/reservation distinction, no overdraw/duplicate posting, optional quote, PO receipt/close |
| WP-07 / Stage4 finance/documents | WP-05/06 + FIN decisions | finance.py, rendering/snapshot service, relevant migrations/tests | PAR-02..08/21; exact arithmetic, historical preservation, atomic full-payment closure, no unapproved correction UI |
| WP-08 / Stage4 settings/sales/media | WP-04/07 and retention/storage approval | followups.py/sales_crm.py/media.py plus settings/template/asset/outbox service | PAR-18..24/27; durable media/immutable documents, local filters/settings/eight templates, no live outbound side effects |
| WP-09 / Stage5 import rehearsal | Stage4 acceptance plus separate Stage5 approval | Approved importer and disposable source/target manifests | All60tables/3241rows,51financial exceptions,61sentinel references, browser source disposition; repeat/rollback checks; no operational import yet |
| WP-10 / Stage6 frontend integration | WP-09 plus separate Stage6 approval | Only exact adapter/auth/handler files in28; module-by-module reviewed diffs | Same approved components/forms/navigation, await semantics, all relevant PAR/visual tests, no dual writes/fallback |
| WP-11 / Stage7 retirement | WP-10 plus explicit retirement approval | Remove obsolete production persistence only after preservation/restore | No loss of browser-only records/assets/history, cross-session API authority, recoverable reference retained |
| WP-12 / Stage8 staging/release | WP-10/11 and release approval | Approved deployment/CI/backup procedures from29 | Complete enabled workflow/security/visual/migration/restore checks and approved cutover/RPO/RTO |

Each package must enumerate exact touched files, OP/WF/PAR coverage, planned DB changes, validation and rollback before implementation. Module acceptance precedes integration of the next module. Backend-only tests may be added during approved Stage4; current demo/browser data is never the destructive test target.

## Decisions requiring explicit approval

| ID | Recommendation / alternatives | Risk / approval owner | Blocks |
|---|---|---|---|
| DEC-01 | Frontend SHA explicitly approved by final authentication instruction; backend/raw fixture adoption remain separate | No broader implementation approval implied | Remaining foundation/data sign-off |
| DEC-02 | Retain74candidate tables +26 source entities +6support =106; alternative consolidate history only after query parity proof | Schema size/legacy columns versus loss of source relationships; user/technical owner | Final DDL and import mapping |
| DEC-03 | Thin compatibility facade with148 allowlisted commands +5reads; alternative individual REST routes with same aggregate semantics | Full-state projection scalability and adapter coupling; technical/product owner | API implementation sign-off |
| DEC-04 | APPROVED: one shared credential/session system; dev dropdown/manual equivalence, persistent sessions, CSRF and production fixture exclusion | Remaining: duration/renewal, exact Dashboard role routing, tenant/recovery/support and user-editor semantics | Only unresolved subdecisions block their affected implementation |
| DEC-05 / FIN-01 | Preserve all stored historical values and discrepancy provenance; no normalization | 51 invoices:24Pending/27Cleared; operational/display authority needs financial owner | Financial import/posting acceptance |
| DEC-06 / FIN-02..04 | Local proportional discount/GST and full-payment closure; preserve old numbers | Fractional rounding/tax kind, correction policy, numbering scope/gaps; financial owner | Financial service behavior and final constraints |
| DEC-07 | Preserve raw sentinel values; nullable resolved links only with explicit system/opening interpretation | 61 references across58records; never fabricate row0; data/business owner | Strict FK validation and import |
| DEC-08 | Stable ID maps, exact decimals, approved timezone mapping and collision policy | Global native IDs/UUIDs and missing historical actors/artifacts; data/technical owner | Migration acceptance |
| DEC-09 | Safe approved browser export/conflict handling; do not assume shipped data is complete | Unknown current tabs/profiles/live bytes; data owner | Real-data cutover and retirement |
| DEC-10 | Durable private assets and versioned snapshots; DB bytes/private filesystem alternative | Region, retention, unavailable historic bytes, restore; data/security owner | Durable media/documents and release |
| DEC-11 | Disposable DB/browser CI and separately authorized test corrections/captures | Historical37 unsuccessful browser cases,3unit assertions, conditional/mobile gaps | Reliable integration acceptance |
| DEC-12 | Gated same-origin deployment, restricted principals, restore-tested backups | Candidate migration lineage, RPO/RTO/post-cutover writes; operations owner | Deployment/production |

## Critical unresolved implementation details

- The architecture is reviewable, not approved. Database/auth/financial/sentinel decisions above cannot be inferred from a baseline candidate list.
- Candidate lineage is not an append-only upgrade from checkout. Fresh replay and actual existing-head bridge must be proven; no stamping or executing current import scripts now.
- The schema specification preserves all source columns, but native-only required-field mappings, exact timestamp/identity and constraint preflight remain conditional. Source FK scan is not a complete executable validation of all proposed CHECKs and cross-job semantics.
- All344 named return types are statically resolved and148 canonical structural command schemas supplied. Wire decimal conversion, alias argument translation and13 admin-state metadata dictionaries need concrete schema validation; no runtime parity is claimed. Old helpers without an actor guard need a reviewed guarded caller, not automatic endpoint exposure.
- Actual browser records remain unknown; source/media/history custody decisions precede migration or local retirement.
- Full UI runtime acceptance remains incomplete:94 images cover roles but not every form/status/mobile state;87 historical tests include20failed/17timed out. No test or screenshot was rerun/replaced here.

## Stage4 recommendation

Review/approve this architecture and named decisions first. Then authorize a bounded backend-only WP-01/WP-02 foundation package with disposable test resources; proceed to schema/domain packages only as their gates resolve. Do not authorize broad implementation, data import, frontend switching or deployment merely because design documents exist. Financial and strict-import paths remain blocked pending owner decisions. Stage3 stops here for review.

Additional AUTH implementation gate: inspect any user editor that reads the stored password. A production credential-free projection may conflict with a prefilled approved field; obtain explicit secure account-management contract approval before integrating it. No plaintext credential projection or silent visible-field change is approved.

**Source follow-up VERIFIED:** UserManager initializes an empty password for new users (src/App.tsx:10920?10929), binds the required minLength=6 password input to draft.password (11024?11035), and Edit uses setDraft(item) (11159?11168). Thus editing currently prefills the stored credential. This is a concrete account-management compatibility conflict, not merely a hypothetical. Secure update-only password handling needs explicit approval of that behavior before user-editor integration; no UI/source change is made in Stage3. Login also has a preset demo password and demo error messaging (1377 and907), so production demo-control treatment must be decided without silently altering the approved screen.

## AUTH-DEC-01 work-package update

WP-00 records the approved frontend SHA and unified authentication requirements; it must not ask to approve preserving the development dropdown again. WP-02 specifies common login/session/logout wire contracts, persistent cookie behavior, CSRF and fixture non-exposure tests. WP-04 implements the SAME backend hash verification/session/revocation/authorization services for both environments when separately authorized. WP-10 changes only necessary auth transport/bootstrap/handlers and fixture-backed prefill; it must not select a replacement login or remote workspace. WP-12 excludes development credentials and disables the convenience in production packaging without altering manual-login/session architecture.

Publicly accessible development cannot enable prefill until an approved additional access restriction protects app assets and demo access. Exact login/Dashboard URL and non-Admin binding, session duration/renewal and user-management password semantics are unresolved; preserve source/layout now. Do not split development/production into separate authentication implementations while resolving those details. Required exit evidence is AUTH-AT-01..18 in29. No package starts in this documentation task.
