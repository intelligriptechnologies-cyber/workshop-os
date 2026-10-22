# 26 - Unified authentication and RBAC design

**AUTH-DEC-01: APPROVED REQUIREMENTS**, from the user's final authentication instruction. One authentication/session-management system serves development and production. The development dropdown is credential-entry convenience only; it is not an authentication mode, bypass or separate workflow. This supersedes earlier suggestions of local/demo authentication versus production authentication and the earlier pending decision about retaining the development dropdown. Documentation only: no implementation is authorized by this update.

The user explicitly identifies approved frontend baseline a315448ce8c3f8f86026b58c18a2231bb3e5e9a7. Preserve existing login, user-management layout and all role-specific screens. This approval does not approve unrelated backend/data/financial decisions or production deployment.

## AUTH-01 - Shared login and development fixture

Both dropdown-prefilled and manually entered credentials submit the same POST /api/v1/auth/login, use the same credential validation/password hashing, establish the same sessions, and undergo the same server-enforced authorization. Manual login accepts any valid active account in the authorized deployment scope, including accounts absent from the dropdown, identically in development and production. No account-email whitelist derived from the dropdown. Successful dropdown selection alone never authenticates or auto-submits.

The development fixture preserves these exact existing options and role mappings, in their existing order:

| Email | Role |
|---|---|
| admin@example.com | admin |
| service@example.com | service |
| advisor.aa@example.com | service |
| advisor.bb1@example.com | service |
| reception@example.com | reception |
| accounts@example.com | accounts |
| store@example.com | store |
| tech@example.com | tech |

Source: src/App.tsx:405-414, LoginScreen:1365-1452, immutable shipped users email/role inspection. The eight options represent six role codes. Shipped general.service.manager@example.com and ppf.paint.manager@example.com provide service_manager coverage through manual login. Preserve existing dropdown choices; do not silently add or remove options to obtain seven-role coverage.

Selecting a dropdown option MUST prefill both email and its existing development password, including resetting a manually edited password. Users can then edit either field and submit normally. Source nuance: the pinned select handler only sets email, while initial password state is preset (1377). The latest explicit requirement to fill both fields governs the future integration; do not misreport that edge case as already implemented or tested.

Use a development/test-only fixture with the existing demo email/password/role records, never a password or hash retrieved from PostgreSQL. Fixture provisioning hashes those credentials into backend accounts in an approved isolated development scope; submitted credentials still undergo normal backend verification. Retain secure salted password hashes, never plaintext passwords, in operational authentication tables. Never expose hashes in session/directory/business API responses. Do not introduce demo-identity headers, local SQL password checks or a special success branch for fixture credentials.

Use explicit proposed settings such as deploymentStage and enableDemoCredentialPrefill; exact configuration names are implementation details. The feature is allowed only when the deployment is explicitly development/test, prefill is explicitly enabled, and approved access restrictions are in place for any publicly reachable environment. Hostname alone is not a development detector. A VPN, authenticated gateway or equivalent approved restriction must protect BOTH the application/fixture assets and relevant demo-access API surface before prefill is enabled publicly. A hidden URL is not a restriction.

Production has the same login form, endpoint, session and authorization system, with dropdown and credential-prefill mechanism disabled/absent. Enforce omission at build/package time as well as runtime configuration: do not merely hide a bundled fixture behind a flag. Exclude fixture chunks/source maps, preset demo password literals, credential-bearing seed assets and public fixture endpoints from production artifacts. The currently public SQLite fixture contains credential data; a production bundle audit must cover that asset too. Production packaging changes require a separately authorized readiness package and must not remove development/test behavior during backend implementation. A misconfigured production prefill setting must fail closed. Fixture exclusion does not authorize deleting source/demo records.

## AUTH-SESSION - Backend-managed persistent sessions

Reuse/extend the candidate database email/password session implementation as the recommended mechanism for BOTH environments; provider choice must not create divergent login flows. Candidate inspection records PBKDF2-SHA256 hashing, session/CSRF digests, revocation and an eight-hour lifetime. These are reuse evidence, not proof that all requirements below already pass. Eight hours remains a proposed lifetime, not user-approved timing policy.

On valid login rotate/create an unpredictable server session bound to active account/membership/scope, storing only the session token digest and relevant expiry/revocation state. Return safe profile/role/permission information and expiry. Session cookie must be HttpOnly, Path=/, appropriately SameSite (proposed Lax), Secure over HTTPS, narrowly scoped without an unnecessarily broad Domain, and **persistent** with Max-Age/Expires aligned to remaining server lifetime. A browser-session-only cookie does not satisfy restart persistence. Do not use localStorage/sessionStorage tokens or UI state as authentication proof.

Navigation, refresh and a true browser restart reuse the unexpired cookie but validate it against backend session state. No hidden auto-login using fixture credentials is allowed to make restart tests pass. Server expiry/revocation/account changes always win over cookie presence. Browser privacy settings/private mode/user-cleared cookies may prevent persistence and must not be circumvented; test the requirement using a normal dedicated persistent profile.

Use production-like HTTPS in tests. Any explicit loopback HTTP cookie relaxation, if needed, is transport configuration only and must not enable fixture behavior by hostname inference. CSRF credentials must also remain available/restorable after restart without exposing session secrets. Validate a session-bound CSRF token plus origin policy on all authenticated unsafe requests, including logout. Protect login against login-CSRF with same-origin validation and a pre-authentication CSRF nonce supplied through the existing config/bootstrap flow; do not use the demo fixture as a CSRF token. Verify this contract before implementation acceptance.

No automatic sliding renewal is approved. Exact absolute lifetime, idle timeout and renewal/rotation policy remain explicit decisions. If renewal is later adopted, it must be server-validated and shared between environments. Backend checks membership version, archive/suspension and tenant/branch scope on requests; a cached role or stale cookie must not confer access.

## AUTH-ROUTES - Login and protected-route state machine

Use auth states UNKNOWN, AUTHENTICATED and UNAUTHENTICATED. On initial load, direct URL entry, refresh and relevant browser navigation, resolve GET /api/v1/session before rendering protected content or redirecting based on cached state. A valid server session at /login must redirect with history replacement to the existing Dashboard destination. Missing, expired or revoked sessions display the existing LoginScreen. The latest requirement adds an explicit /login entry contract; no new login component/page design is permitted.

For protected destinations, UNKNOWN never renders sensitive content; valid session proceeds subject to existing roles; confirmed 401 displays/redirects to login. A network/503 error is not proof of logout: do not create a login/protected redirect loop or discard business data. Use existing error affordances and retry/session validation. A protected API 401 invalidates in-memory authenticated state and triggers a single login transition. A 403 remains an authorization error, not forced logout. Avoid automatic replay of mutations after reauthentication; resolve uncertain commands using original idempotency keys.

**Routing binding still needs clarification:** discovery documents32 page keys within the existing root shell, not an established separate /dashboard URL. The dashboard page key belongs to Admin; other roles have existing role-specific landing/navigation. The mandated valid-session /login -> existing Dashboard redirect remains the acceptance requirement, but exact URL/page-key binding and non-Admin destination must be resolved before route integration. Do not invent a /dashboard page, broaden Dashboard permission to all seven roles, or silently substitute a different destination. Keep this a narrow routing decision, not a separate authentication architecture.

## AUTH-LOGOUT - Revocation and business-data preservation

POST /api/v1/auth/logout uses the same authenticated CSRF-protected endpoint in both environments. Revoke the active server session, expire the cookie using matching path/domain, clear related CSRF cookie and in-memory authentication/user caches, then replace navigation with the existing login destination. Subsequent direct protected API use of the old token must fail. Other tabs discover revocation through session/API validation; any cross-tab notification is only a hint, never proof of authorization.

Do not clear SQLite, localStorage business records, session-owned historical documents/settings or unrelated browser data. In-flight writes may have committed before revocation; logout/expiry cannot undo them. Preserve/reconcile their request IDs rather than duplicate submissions. If logout cannot reach the backend, clear sensitive in-memory presentation but do not claim server revocation succeeded; surface the existing error channel and retry safely. Final logout acceptance requires confirmed revocation/cookie clearing and access denial.

## AUTH-02 - Default seven-role contract

The exact page grants/menu intersection in [04](04-ROLES-AND-PERMISSIONS.md) and default fixtures remain authoritative. Server permissions are capability+record+state decisions, not menu visibility. Proposed command grants are ui.command.<canonical-name> from 25, assigned via these groups and narrowed by each source predicate. No wildcard arbitrary-command execution.

| Command/read group | Admin | Service | Service manager | Reception | Accounts | Store | Tech |
|---|---|---|---|---|---|---|---|
| Dashboard/configuration/users/roles/team/catalog administration | Source grants | No | No | No | No | No | No |
| Customers/vehicles/intake/bookings | Allowed with source guards | Only existing scoped entry points | Only existing scoped entry points | Allowed with source guards | Read as needed | Read as needed | Read as needed |
| Booking capacity override | Explicit actor/reason predicate | No default elevation | No default elevation | Ordinary booking only | No | No | No |
| Job details/lifecycle/estimate | Owner predicate | Linked advisor predicate | **No inherited lifecycle mutation**; source canMutateJobLifecycle excludes manager | Intake-only effect | Billing/delivery-specific effect | Material-only effect | Assigned task/QC-specific effect |
| Invoice create/edit | canCreateInvoice/canEditInvoice | Only where exact predicate permits linked advisor | No inferred extra grant | No | Exact billing predicate | No | No |
| Payment/void/delivery | Billing guards | No | No | No | Billing guards | No | No |
| Material demand/approval | Source actor predicates | canManageMaterialRows/approval predicate | Exact material manager predicate only | No | No | Separate release/issue/reconcile predicates | Assigned usage only where existing control/predicate allows |
| Purchase requests/quotes/receipt | Source purchase predicate | No added purchase powers | No added purchase powers | No | No added purchase powers | Request/issue/receipt permitted states | No |
| Purchase approval/close | Owner/status predicate | No | No | No | No | Not inferred from visible PO page; exact command guard | No |
| Technician tasks/work/QC | Source guard | Exact existing assign/QC guard | No assumed new manager mutation | No | No | No | Assigned record/task-state predicate |
| Follow-ups/search/media/documents | Authorized categories/records | Linked/visible records and media phase | Existing visible records; no actor bypass | Existing category grants | Finance categories | Stock/purchase categories | Assigned/category grants |
| Sales/settings/templates/import/logs | Existing admin grants | No implicit grant | No implicit grant | No implicit grant | No implicit grant | No implicit grant | No implicit grant |

This is a source-preserving capability matrix, not a broad role-only allowlist. Exact predicate functions (canMutateJobLifecycle, assertBillingMutationAccess, assertPurchaseActor, canManageMaterialRows, canReleaseMaterialRows, canEditIssuedMaterialRows, assertJobMediaMutationAccess, canCreateInvoice/canEditInvoice) and branches remain the normative per-command conditions in the operation/private contracts. For old lower-level functions without actors, use the corresponding guarded wrapper; if no equivalent exists, deny until the UI caller/role rule is reviewed. Do not infer permission merely because a function is exported. That unresolved case blocks its endpoint implementation.

Custom page grants continue intersecting the fixed built-in menu; adding a grant must not invent a navigation entry or bypass command/record rules. Custom role definitions cannot become arbitrary new dispatch role strings without approval of the fixed Role union behavior. Protected owner access and last-admin/archive safeguards remain. Multiple native roles map to one approved presentation role by an explicit owner-selected rule, not arbitrary first-role ordering; multi-role ambiguity is an approval gate.

## AUTH-03 - Scope and record-level enforcement

TenantScope is resolved from authenticated membership, never JSON/header actorId/tenantId. Branch selection must be an authorized membership branch; default only where deployment has one unambiguous branch. Jobs, invoices, child lines, media and documents must belong to the same allowed tenant/branch and expected parent. Reject cross-parent IDs even if both parents are otherwise visible. Actor ownership/assignment and terminal state are rechecked under lock on mutation.

Use separate migration owner, limited authentication principal and non-owner business runtime role without superuser/BYPASSRLS. Auth session resolution has narrowly granted tables/functions; it must not grant unrestricted business access. SET LOCAL trusted scope inside each transaction; pooled connections must not retain another request's scope. ENABLE/FORCE RLS and default-deny policies on tenant tables, with scoped composite FKs and service checks. Superuser/BYPASSRLS principals bypass RLS, so the currently observed privileged connection cannot be treated as a production security boundary. See [PostgreSQL row security](https://www.postgresql.org/docs/17/ddl-rowsecurity.html).

Native and compatibility endpoints share the same guards. Support/platform access is separate, disabled by default in database mode. Read-only support cannot mutate through alternate routes; privileged platform identity does not imply workshop membership. A tenant suspension follows existing read-only/lifecycle contract rather than deleting data. Out-of-scope reads return non-enumerating 404; authorized-but-forbidden action uses 403 and existing UI error handling.


## AUTH-04 - Audit and acceptance

Audit redacted authentication failures/success, session creation/expiry/revocation/logout, role/branch changes and authorization denial with request/actor/scope/time. Never log entered passwords, fixture secrets, password hashes, raw session/CSRF tokens or credential request bodies. Existing business audit/tenant rules remain. All AUTH-AT tests in29 are mandatory; none was executed in this documentation update.

## AUTH-USER-EDIT - Separate unresolved user-management behavior

Login prefill is APPROVED as a development-only input fixture. It does NOT authorize password retrieval for user editing. The source UserManager sets draft from the stored user (src/App.tsx:11159-11168), and its required minLength=6 password field binds draft.password (11024-11035). This stored-password prefill is source-verified and incompatible with a credential-free API projection.

Preserve the form layout. Proposed behavior for approval: creation accepts a new password; editing leaves password blank, means unchanged unless explicitly supplied, hashes any accepted replacement and revokes affected sessions under policy. This changes field default/required semantics and is NOT approved or implemented. Do not prefill a hash, fake masked sentinel or database password. Keep this caller blocked pending approval; do not conflate it with the now-approved login dropdown. A development login fixture is not a general user-password lookup service.

## Remaining decisions

Resolved: one authentication architecture, dropdown/manual endpoint equivalence, preserved development options/credentials, seven-role testability, backend persistent/revocable sessions, required redirects/logout/CSRF, explicit fixture gating and production non-exposure; frontend SHA is explicitly approved by the user.

Open: user-edit password semantics; exact /login and Dashboard/role routing binding; session lifetime/idle/renewal policy; public-development access-restriction choice; account provisioning/recovery, tenant/multi-role presentation/support details not settled by this instruction. No new UI or implementation starts while these documents are updated. Production feature-removal packaging remains a separately authorized readiness task, not automatic removal during development.
