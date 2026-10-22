# 29 - Test and deployment architecture

Design only. No environment provisioned, tests rerun, dependency installed, migration applied or deployment performed.

## TEST-01 - Disposable environment and fixture contract

Use a separate uniquely named PostgreSQL cluster/database/volume, API process, port/origin and dedicated browser profiles. Do not reuse workshopos-db-1, workshopos-api-1, current volumes, current browser storage or operational credentials. Harness must assert a disposable run marker/database identity and host allowlist before any write or teardown. Separate workers by database or isolated tenant/branch plus profile; financial concurrency tests deliberately share only their own fixture aggregate. Disable real email/payment/provider integrations; no real invitation sends.

Pin full frontend/backend candidate commits, dependencies already recorded in lockfiles, PostgreSQL major/environment, browser build/OS/fonts, timezone/locale and fixture checksum. Source demo hash is 04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae. Original SQLite is read-only; imports and scenario creation occur only in disposable targets after approval. Fix future test clock to 2026-10-21T06:30:00Z, Asia/Kolkata; this does not claim the old captures used that exact clock. Use explicit role/owner/status record IDs, not first row or today's month assumptions.

## TEST-02 - Layers and exit evidence

| Layer | Specification | Required proof |
|---|---|---|
| Static protection | 70 frontend files + 45 guards; additions/deletions/renames and lockfiles | Exact approved diff, baseline hashes and no unexplained replacement screenshots |
| Pure parity | invoiceTotals, GST/discount/quantity/rounding, date ranges, validators/status predicates | Golden local outputs versus server functions; ambiguous examples signed off |
| Migration | Clean candidate replay; separate prior-head bridge; all proposed schema constraints | Schema heads, FK/unique/check results; no stamping around history conflicts |
| Import | 60-table/3,241-row source projection; sentinel/financial exceptions; duplicate and failed import | Full row/relationship/number/stock reconciliation, original hashes unchanged |
| API contract | All allowlisted commands/read schemas, native routes sharing guards | Valid/invalid payloads, unknown fields, status/error meaning, response projection and version/idempotency tests |
| Security | Seven roles, record ownership, tenant/branch, session/CSRF/revocation and RLS | Direct API negative tests and connection-pool isolation, not only hidden buttons |
| Transactions | SVC-01..12 in 23 plus PAR-01..28 in 18/22 | Rollback after each write, simultaneous actors, response-loss replay, no duplicate numbers/claims/stock/payment |
| UI workflow | Corrected historical 87 cases plus missing manager/sales/booking/QC/payment/PO chains | Trace tied to source/schema/fixture/role; no destructive tests on original data |
| Visual/document | Existing 94 originals plus separately approved missing states | Before/actual/diff, document values/layout/history and media bytes; no automatic golden updates |
| Recovery | Backup/restore DB and bytes; old compatible app rollback; outage/stale assets | Reconciliation after recovery and explicit handling of post-cutover writes |

Historical 87: 50 passed,20 failed,17 timed out. Reuse classes from 18:50 reliable candidates,25 fixture updates,4 locator corrections,2 behavior clarification,6 environment/timeout investigation. These classifications sum to87 but are not new execution outcomes. Separate unit baseline244=241passed+3 template failures; eight defaults/six active categories remain unchanged. Candidate backend has65 source test functions (not a collected parametrized-case count), unexecuted in this audit; reconcile its one runtime test-file difference before trusting reproducibility.

## TEST-03 - CI design

1. Read-only source/schema/contract lint: verify approved revisions, protected diff and all OP/entity mappings, no secrets, architecture approval records and schema/fixture checksums.
2. Pure unit/type/schema tests; three template expectation corrections only in separately approved test package. Fail on unexplained failures; do not mark existing failures as silently allowed.
3. Create disposable DB using candidate lineage plus approved new migrations. Verify restricted runtime identity and tenant policies. Import fixture under run identity, reconcile twice for idempotency.
4. API/security/transaction tests. Run write/fault/concurrency cases only after disposable target assertion. Preserve failing traces/SQL effects without dumping credentials.
5. Build approved frontend with adapter in isolated origin, no reuseExistingServer; run workflow and visual suites at pinned viewport. Original goldens immutable; manual approval required for additional references.
6. Store reports with commits, image/build/fixture hashes, schema head, attempts/pass/fail/timeout counts, coverage IDs, changed files and exceptions. Destroy only verified disposable resources under the later execution authorization.

G0 before integration: protection harness, schema/contract/financial/auth decisions, reliable fixtures and corrected regression plan. G1 before each module acceptance: API/parity/transaction/security tests and UI behavior. G2 before production: complete enabled workflows, responsive/conditional references, import/restore rehearsal, performance/security and cutover approval. See all28 scenario assignments in22; lower priority does not mean optional at release.

## DEP-01 - Staging topology and release sequence

Use the existing same-origin reverse proxy/API/PostgreSQL topology, privately network the API/database, and separate runtime/migration/auth principals. Keep secrets outside repository/image logs. Approve durable object storage and backup scope before uploads are relied on. No new hosting vendor/framework is selected. Production migrations run as an explicitly gated release job, not automatic API startup.

First deploy into a new disposable/staging scope with synthetic/demo data and disabled outbound providers. Verify clean migrations, source identity, login/CSRF, seven-role negative tests and all parity cases. Staging promotion must identify frontend, backend, API contract and schema versions together. Service-worker/cache version compatibility must prevent a stale frontend from reporting successful incompatible writes. An API outage cannot turn the shipped fixture into a fallback current database.

## DEP-02 - Backup, cutover and rollback

Take and verify database plus object/template/document backups BEFORE migration/cutover. Restore to a disposable environment and run full referential/count/hash/financial reconciliation; a backup command succeeding is not a restore test. Record application/schema/auth versions and required decryption/access material under controlled custody. RPO/RTO, retention, restore owner and maintenance window require approval.

At cutover, establish an approved write boundary, capture final source/browser exports, import/reconcile and run smoke checks before releasing writes. Do not dual-write browser and PostgreSQL. Keep immutable source backups. Roll back code only to a version compatible with the expanded schema. Prefer forward repair if writes have occurred. A database restore must preserve/reconcile post-cutover writes or require explicit accepted loss; never restore an old snapshot blindly or switch back to stale localStorage. Rehearse rollback of auth/proxy/assets as well as business data and document bytes.

Release blockers: unexplained test failure/timeout, unresolved financial/sentinel/auth mapping, missing browser preservation decision, failed tenant isolation, changed approved visual/behavior contract, incomplete migration lineage, missing artifact recovery or unapproved outage/rollback policy. No deployment is authorized by this plan.

## AUTH-AT - Required unified authentication acceptance specifications

Approved requirements from26. Prepare these tests for the later authorized disposable environment; no tests are implemented or executed now. Use the confirmed frontend SHA, candidate backend, isolated hashed credential fixtures, two tenants where relevant, dedicated persistent browser profile, fixed clock and HTTPS test origin. Never use existing client/demo profiles. Both environments exercise the same backend endpoints and validation/session code; only the explicit prefill setting and fixture packaging differ. Record traces without passwords, hashes, session or CSRF tokens.

| ID | Setup and actions | Expected acceptance |
|---|---|---|
| AUTH-AT-01 | Development/test explicitly enabled; enumerate dropdown and select each of its eight original options | Same order/options/role mappings and login layout. Both email and exact development password prefill. Selection creates no authenticated session and does not submit. |
| AUTH-AT-02 | Manually change both inputs, then select a different option; then edit inputs again before submitting | Selection resets both fields from fixture; subsequent manual edits remain effective. Backend receives submitted values, not a hidden dropdown identity. |
| AUTH-AT-03 | Manually enter a valid disposable account not listed in dropdown, in development and production-shaped builds | Both use POST /api/v1/auth/login and identical hash verification/session/permission behavior. No dropdown membership restriction. |
| AUTH-AT-04 | Valid versus invalid email/password, unknown account, archived/revoked membership; submit both via dropdown-derived and manual input | Valid active account establishes server session; invalid credentials do not. Existing error channel used, no credential/hash leakage, no special demo bypass. |
| AUTH-AT-05 | Login, navigate through existing permitted pages and tabs | Same session/actor survives navigation; backend independently authorizes each request. No localStorage identity proof. |
| AUTH-AT-06 | Login and refresh an existing protected view | Persistent cookie sent; backend session validated before protected rendering; authorized UI/data restored without fixture auto-login. |
| AUTH-AT-07 | Login, completely close browser process and reopen SAME dedicated persistent profile before expiry | Still authenticated after backend validation. No fresh login request, injected cookie/storageState or password fixture used to fake restart persistence. Repeat after expiry: login displayed. |
| AUTH-AT-08 | Valid session navigates directly to /login, refreshes it, uses back/forward and normal routing | Exactly one history-replacing redirect to existing Dashboard binding, no login flash/redirect loop. All-role cases remain blocked until role-safe destination is resolved; never grant Admin Dashboard to pass. |
| AUTH-AT-09 | Visit /login with no cookie, expired cookie, or a retained cookie whose server session was revoked | Same existing LoginScreen shown; cached user/localStorage cannot authorize. Expired/revoked cookie cannot make session endpoint succeed. |
| AUTH-AT-10 | Direct protected URL without session; attempt protected API outside UI | No protected content/data. UI uses existing login destination; backend401. Role-forbidden authenticated access returns403/appropriately scoped404, not endless login redirect. |
| AUTH-AT-11 | Expire/revoke session while protected form is open; issue a business command and simulate a request already committed before expiry | Rejected command causes no write; an already committed command is not duplicated/reversed. Existing draft/error handling preserves records and original request key; no automatic repost after login. |
| AUTH-AT-12 | Logout successfully, refresh/back/direct protected URL, replay old session cookie to protected API | Server session revoked, matching cookies expired, auth memory cleared, login displayed and old cookie denied. Unrelated browser SQL/settings/history unchanged. |
| AUTH-AT-13 | Logout network failure; session-check network503; slow responses and overlapping navigation | No false successful server revocation, no protected-content flash, no redirect loop, no business-storage deletion. Existing error/retry mechanism; auth UNKNOWN is not treated as a valid session. |
| AUTH-AT-14 | Exercise admin,service,service_manager,reception,accounts,store,tech; use manual manager accounts absent from dropdown | All seven roles testable with unchanged navigation/record/command grants. Linked/unlinked actors and cross-tenant/branch access denied appropriately, including direct native API calls. |
| AUTH-AT-15 | Unsafe requests with missing/wrong CSRF, foreign origin, valid CSRF; repeat after restart/logout; test login-CSRF | Invalid requests have no side effects; valid scoped requests succeed. Backend checks CSRF/origin, including logout and login bootstrap rules; cookie alone cannot authorize cross-site mutation. |
| AUTH-AT-16 | Inspect HTTPS response cookies and expiry; tamper token, revoke session, change role/credential while token remains | HttpOnly session cookie, appropriate Secure/SameSite/path, persistent Max-Age/Expires matching server policy; backend rejects invalid/revoked sessions and enforces latest grants. Hash/token secrets absent from response bodies/logs. |
| AUTH-AT-17 | Build production with prefill disabled; deliberately attempt enabling it; inspect HTML/JS/chunks/maps/static SQLite/fixture assets and public config/API responses | Production fails closed on forbidden flag; no dropdown/prefill or usable demo credentials/credential-bearing fixture assets in artifacts/endpoints. Manual login/session path unchanged. Test development build separately retains original convenience. |
| AUTH-AT-18 | Enable prefill in explicitly public development configuration with/without approved gateway/VPN/equivalent protection | No credential fixture/prefill exposure without additional restriction. Authorized restricted access retains normal backend login. Hostname-only changes cannot enable demo mode. |

User-management password editing is a separate test package pending approval of new-versus-unchanged password semantics. AUTH-AT-01/02 do not authorize that change. Compare login screenshots to the original development baseline; production fixture omission is its explicit readiness exception, not permission to restyle the form.

G1 auth acceptance requires01?16 and development isolation; G2 production readiness additionally requires17?18, with17 also run as an early build-leakage check. All are required where applicable; timing/lifetime and route-binding decisions must be pinned in fixtures before asserting exact outcomes. Preserve original screenshots; approval remains required for any new golden images. No backend/frontend/test/config work is authorized by these test specifications.
