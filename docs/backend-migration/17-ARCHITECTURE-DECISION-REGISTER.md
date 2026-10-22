# 17 - Architecture decision register

Stage 1.6, 2026-10-21. **Historical proposals, updated by explicit user decisions below. ADR-04 unified authentication requirements and the frontend SHA are now approved; other unresolved decisions remain pending.** This is decision preparation, not an accepted architecture, implementation plan execution or authorization to migrate. The approved local application is the provisional behavior reference. Preserve its pages, labels, fields, validation, navigation, document layout and role workflows.

Evidence priority: pinned local source and verified records; observed browser states; executable unit/probe results; preserved historical browser reports; candidate backend source; unverified assumptions. A backend feature or failed stale test does not override the frontend contract. Cross-references: [16](16-BACKEND-BASELINE-RECONCILIATION.md), [18](18-BACKEND-PARITY-MATRIX.md), and [15A](15A-VERIFICATION-FAILURE-ANALYSIS.md).

## ADR-01 - Backend source to extend

**Recommend:** pin `prem-dev-fbb-backend` at `50c8aab1766b61c914e2829b460bfd1697723ec2` for backend infrastructure and preserve frontend baseline `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Future integration should selectively reconcile backend files, not merge candidate frontend changes. Record a source manifest and image provenance for the accepted foundation.

**Evidence:** 21/21 runtime app modules match; 94/95 inspected container source/config/test files match, with one integration-test difference. Candidate has all 152 routes and newer receipt/confirmation/auth capabilities. Current checkout has 109 routes. **Alternatives:** extend older checkout and port features individually (higher omission/migration risk); rebuild from scratch (duplicates existing tenancy/transaction infrastructure); adopt running image only (not reproducible source governance).

**Risks:** local refs do not establish remote freshness or maintainer approval; candidate business logic still differs; historical migration edits complicate upgrades. **Approval:** user names maintained backend owner/revision and approves selective foundation. **Exit evidence:** source/test discrepancy reconciled; candidate clean disposable migration replay and parity review. Blocks final foundation selection and implementation until approved.

## ADR-02 - PostgreSQL schema strategy

**Recommend:** evolve the candidate's tenant/branch-aware relational schema with explicit domain ownership and versioned Alembic migrations. Use relational entities for operational records, source-ID mapping/provenance for imports, and immutable document snapshots where historical rendering requires them. Do not treat SQLite's 60 tables as a mechanical one-to-one target schema or use JSON archival rows as a substitute for operational queries.

Retain legacy IDs/document numbers through mapping, distinguish date-only business fields from instants, preserve explicit timezone behavior, and use exact decimal/integer money representations that reproduce approved rounding. Determine quantity precision from current valid values. Define tenant-safe relationships, active-document uniqueness, request idempotency and archival retention. Validate zero/null legacy references before tightening FKs. Read models must retain current filters, sorting, counts and pagination semantics.

**Evidence:** zero SQLite FKs; existing backend tenant/branch relationships; 51 subtotal/line discrepancies; candidate migration reparenting and changed historical DDL. **Alternatives:** literal SQLite clone (fast but weak tenancy/integrity); generalized JSON storage (preserves bytes but loses relational enforcement); redesign domain schema (unnecessary workflow drift).

**Risks:** a revision stamp is not a DDL checksum; already-applied older revisions will not rerun. **Approval:** tenant/branch scope, nullable/historical exceptions, exact money/quantity conventions and migration lineage policy. **Exit:** clean replay plus separately designed compatibility bridge for any existing schema; all source records mapped or explicitly retained with approved read behavior. No destructive migration or stamping is authorized.

## ADR-03 - API integration approach

**Recommend:** integrate the existing approved components through a compatibility layer for reads and business commands. Map existing OP/WF/ACT contracts to backend requests; preserve form state on error and refresh a coherent state projection only after committed success. Pure presentation controls need no API. A command such as Record Payment must be one atomic server operation, even if it updates multiple tables.

Do not select alternate `remote-*` workspaces merely by changing auth mode. Existing synchronous `mutate` returns a boolean used for dialog closure; a Promise must not be treated as success. Future internal async adaptation must preserve the approved success destination, error display, disabled controls and retry behavior. Keep protocol versioning explicit while preserving current UI labels/types.

**Evidence:** App RoleWorkspace mode switching, mixed SQL/browser ownership, 06 async contract, 15A conditional-test gaps. **Alternatives:** switch to remote workspaces (UI drift); expose table CRUD and chain requests (partial commits); dual-write browser and backend (conflict and split authority).

**Risks:** partial screen integration, stale projection, duplicate submission and missing permission error mapping. **Approval:** API command boundaries, authority switch per domain and protocol/error contract; no new pages/forms implied. **Exit:** exact callback-to-command trace and PAR-01/25/26 acceptance. Interface freeze remains binding.

## ADR-04 - Unified authentication and sessions (approved requirements)

**Updated by explicit final user instruction:** one backend credential-validation/session/authorization system for development and production. Dropdown convenience and arbitrary valid manual credentials submit to the same endpoint. Retain development dropdown, exact options/role mappings and credential prefill; use an explicitly gated development fixture, never PostgreSQL password/hash retrieval. Production excludes fixture credentials and disables the dropdown through a separately authorized readiness package; no automatic removal during migration.

Persistent HttpOnly cookies, backend expiry/revocation, CSRF, refresh/restart persistence, /login valid-session redirect, protected-route checks and server logout are required. Recommended implementation reuses candidate database sessions; no separate local authentication branch or alternative provider UI is selected. Canonical details, source differences and open decisions: [26](26-AUTHENTICATION-RBAC-DESIGN.md). User-management stored-password prefill remains separately unapproved. Lifetime/renewal, exact Dashboard binding for non-Admin roles and public-development access controls remain to resolve. This decision approves requirements, not code changes or deployment.

## ADR-05 - Demo-data migration authority and process

**Recommend:** adopt DB-01 public fixture hash `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` as raw shipped demo authority, separately preserve an initialized comparison snapshot, and retain all other copies unchanged. Do not merge DB-03/04 additions automatically. Import only into an approved empty/disposable demo scope first with source checksum, import version, stable source-to-target ID mapping, all-table reconciliation and replay protection.

**Evidence:** 60 tables/3,241 records, identical tracked/reference copies, application fixture load path; DB-03/04 add 258 identities each but also remove/change rows. Existing candidate importer and rehearsal are useful inputs, not approval. Its 16 archive-only rows require functional history/quote review.

**Alternatives:** largest/newest copy (unsupported authority); current browser export (unknown until collected); combine everything (duplicate/conflicting identities). **Risks:** raw versus startup-transformed records, archived history unavailable to UI, existing demo tenant checksum conflict, historical financial inconsistencies. **Approval:** dataset scope, all conflicting records, import target and financial treatment. **Exit:** row/relationship/number/document/stock reconciliation, explicit exception report, repeated import has no duplicate effect. No importer runs in this stage.

## ADR-06 - Browser-only data preservation

**Recommend:** execute EXPORT-01 in document 11 only after approval, using existing client tabs/profile without app reinitialization. Capture SQL storage, markers, per-tab settings/templates/frozen documents and any recoverable live image bytes separately; exclude authentication tokens. Hash and preserve originals, then reconcile source identities without merging automatically.

**Evidence:** v2/v1 precedence overrides public fixture; session-owned business settings and documents; uploaded image bytes stripped from persistence. **Alternatives:** discard browser data (only with explicit owner sign-off); infer from scratch export names (insufficient); reload and export via startup (can transform records and lose live state).

**Risks:** unsaved drafts/live bytes, multiple tabs/profiles, collisions, encrypted/private data handling and stale exports. **Approval:** profile/origin/tab scope, export destination/access, preservation versus discard policy, conflict decisions. **Exit:** provenance and counts for every approved source, with unrecoverable data explicitly accepted. Browser contents remain UNKNOWN now; neither SQL nor PostgreSQL records are assumed complete.

## ADR-07 - Financial and inventory transactions

**Recommend:** preserve local command outcomes and calculations provisionally, with server transaction/locking/idempotency boundaries around payment closure, invoice/material claims, PO receipts/confirmations/closure, intake/check-in and approvals. Use immutable financial/stock audit history. Recheck status and permissions under locks, return deterministic replay results, and define stale-edit handling without new workflows.

**Evidence:** reproduced 109-versus-100 total difference; full-payment local closure versus split remote requests; newer candidate stock-close improvements; partial idempotency and stale-transition risks; quote prerequisite mismatch. **Alternatives:** reuse backend rules unchanged (breaks approved behavior); client-computed totals trusted as authority (unsafe conflicts); independently committed table requests (partial state).

**Financial approvals required:**

| ID | Ambiguity | Proposed default pending explicit approval |
|---|---|---|
| FIN-01 | 51 raw invoice subtotals disagree with lines; raw/startup/issued document may represent different historical states | Preserve original header, lines and documents with provenance; do not silently recalculate. Decide authoritative display/ledger values and treatment of unpaid versus issued/settled records. |
| FIN-02 | Future arithmetic, line GST selection versus backend address-derived GST kind, sub-paise/unit precision and odd tax splits | Reproduce local provisional calculation and per-line GST; approve representative mixed-tax/fractional examples before accepting financial parity. |
| FIN-03 | Partial payment, void/refund/credit policy differs from local full-payment closure | Preserve local full-payment and terminal restrictions; do not expose extra correction workflows. Owner explicitly approves any policy change separately. |
| FIN-04 | Future numbering scope, fiscal reset and imported sequence advancement | Preserve all displayed historical identifiers; approve tenant/branch/year allocation rules and accepted gaps before cutover. |

**Risks:** financial reinterpretation, duplicate postings, quantity overuse, orphan documents and silent rule tightening. **Exit:** PAR financial/inventory probes, rollback at each step, concurrent/retry cases and signed examples. Infrastructure design can proceed conditionally; financial import/posting implementation acceptance waits for these decisions.

## ADR-08 - Media and document storage

**Recommend:** PostgreSQL owns metadata, permissions, template versions, immutable snapshot references and business links. Durable private object storage is the provisional target for image/document bytes, with content hashes and scoped retrieval; preserve approved preview/download/print layout. A transactional outbox or staged-upload finalization must prevent a committed document reference from pointing to missing bytes. Freeze the selected template/company/assets/values at the approved lifecycle event.

**Evidence:** candidate data URLs in `job_media.src`; execution attachment storage; local decoded-content and phase guards; browser-only snapshots and stripped uploaded images; backend generic JSON HTML. **Alternatives:** DB bytea/data URLs (simpler atomicity but size/performance costs); browser-only storage (loss/multi-user gaps); regenerate documents on read (destroys history).

**Risks:** privacy/retention, object orphan cleanup, unavailable assets changing historical rendering, oversized/malformed uploads, permission bypass and unverified retention intent. **Approval:** storage service/region, retention/versioning/backup scope, durable image behavior and historical-document authority. No vendor selection or installation is made. **Exit:** unauthorized access denied, signature/size/phase parity, byte/render checks, snapshot stability after settings changes and restoration of both metadata and bytes.

## ADR-09 - Test isolation and acceptance baseline

**Recommend:** an explicitly disposable PostgreSQL cluster/volume and dedicated API service, unique project/run IDs, and dedicated browser contexts/profiles on a unique origin. Do not reuse current containers, existing volumes, user profiles or ports. Pin backend/frontend revisions, dependency lockfiles, clock/timezone, fixture hashes and viewport. Verify server build identity and disable existing-server reuse in the future harness. Separate role tests, pure unit tests, mocked auth/API tests and real local integration tests.

Provisioning and harness changes require a later approved task. The proposed harness should assert disposable database identity before any writes/cleanup, prevent connections to operational hosts, and disable real email/payment/provider side effects. Restore test data from approved immutable fixtures per scenario; parallel workers need separate databases/scopes and browser storage. Tests needing localhost cookies must use correct origin semantics. Production-like HTTPS/CSRF behavior gets its own isolated profile.

**Evidence:** 15A's 87 cases: 50 pass, 20 fail, 17 timeout; shared localStorage.clear and record mutations; 244 unit baseline: 241 pass plus three separate template failures. Candidate integration test mismatch and migration history need reconciliation. **Alternatives:** run current suite against existing data (prohibited); only mock APIs (misses persistence/RLS); only unit tests (misses controls/navigation).

**Risks:** fixture drift, fixed IDs/order, clock-sensitive month filters, false positives from stale preview, parallel contamination. **Approval:** disposable environment scope/resources, future test updates and precise baseline acceptance. **Exit:** classifications in 18 resolved, approved-domain E2E gaps filled, test reports tied to source/image/fixture hashes, no unexplained baseline-image regeneration. A timeout increase alone is not remediation.

## ADR-10 - Deployment and rollback

**Recommend:** adopt the candidate's same-origin frontend/API proxy and private API/database topology after approved revisions/auth are chosen. Keep migration execution as an explicit gated stage. Before changes, capture verified database/object backups, restore them into a disposable target and record current schema/image/frontend/auth versions. Use backward-compatible expand/contract changes where possible and retain a compatible prior application image.

Cutover needs a controlled write boundary and reconciliation; switching back to localStorage after backend writes is not a safe rollback. Prefer compatible application rollback/forward repair. A database restore requires separately preserving post-cutover writes and an approved recovery-loss decision. Auth-mode rollback does not undo data/schema changes. Service-worker/static asset versioning must prevent old frontend code from calling incompatible APIs.

**Evidence:** current staging is frontend-only; candidate adds API/DB/proxy and auth overlay; startup auto-migrates; archived lineage warning; guide backup ordering is unsuitable for protecting pre-upgrade data. **Alternatives:** immediate replacement of active stack (high rollback risk); dual-write local and remote (conflicting authorities); restore old backup without reconciling new writes (data loss).

**Risks:** untested upgrades, incomplete object backup, stale assets, auth lockout, RLS role misconfiguration and irreversible historical cleanup. **Approval:** environment/topology, RPO/RTO and maintenance window, backup/restore owner, cutover/rollback criteria and release approval. **Exit:** fresh and existing-schema rehearsals, smoke/parity/tenant checks, explicit rollback drill and data reconciliation. No deployment is authorized now.

## Review order and readiness

1. Approve ADR-01 foundation and ADR-05 raw dataset scope; the source-provenance uncertainty is now substantially resolved by hashes.
2. Resolve ADR-04 identity/tenancy, FIN-01 through FIN-04 and ADR-06/08 preservation/retention ownership.
3. Approve the conditional schema/API/transaction design and isolated verification environment; then review detailed schemas/contracts in a later design task.
4. Approve implementation separately only after contracts, acceptance tests and rollout safeguards are reviewable.

**UI freeze:** ready to retain the existing source and 94 captures as the provisional immutable reference, with the client-approved workflow constraint binding. Not ready to claim every conditional/role/mobile workflow is executable-regression verified. Freeze means no redesign, not ignoring the coverage gaps in 15A.

**PostgreSQL architecture design:** ready for an approval-led design phase using the identified backend candidate and explicit decisions. Final schema/auth/import/financial architecture sign-off remains conditional on the pending choices. **Backend implementation, migration and deployment: not approved.** Stop after documentation for review.
