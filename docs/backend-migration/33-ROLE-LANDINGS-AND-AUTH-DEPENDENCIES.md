# Stage 4A — role landings and authentication dependencies

## LAND-01: preserve existing authorized first-menu behavior

Source evidence: approved `src/admin-demo-state.ts:147–156` (`ROLE_MENU_PAGE_KEYS`), `src/App.tsx:393–403` (`menuItemsForRole`), and `src/App.tsx:893–917` (`handleLogin`). Login resolves permitted pages and selects the first permitted menu item's label. These are existing application page keys within the current shell, not evidence of separate URL paths.

| Role | Default first authorized page key | Existing screen |
|---|---|---|
| admin | dashboard | Dashboard |
| reception | today-queue | Today Queue |
| service | my-queue | My Queue |
| service_manager | my-queue | My Queue |
| store | material-requests | Material Requests |
| tech | my-tasks | My Tasks |
| accounts | ready-to-invoice | Ready to Invoice |

The table describes built-in menu ordering with the corresponding default grants. Runtime custom permissions can remove the first page: preserve the first remaining authorized menu entry. Empty grants yield no menu item in existing code; the secure no-access handling requires approval, without granting Dashboard access or inventing a new page. Exact URL binding for `/login` and post-session navigation remains an integration decision. The latest Stage 4A role-specific instruction qualifies the earlier generic “Dashboard” redirect: never force a role onto the Admin Dashboard. These results are source-verified, not newly browser-tested.

## AUTH-FND-01: one authentication system

The frozen UI and its development dropdown/prefill remain untouched. Manual and dropdown-entered credentials must submit the same backend endpoint and use the same session/RBAC enforcement. Production excludes demo credential fixtures and disables the convenience via explicit environment configuration. Public development still needs the approved additional access restriction. No password/hash retrieval for prefill is permitted.

The Stage 4A wrapper selects the candidate's `database` authentication mode and disables its legacy identity-header/demo authorization bypass. This is API-only infrastructure configuration; it does not remove the approved dropdown or implement a second development authentication architecture. No frontend is connected and no accounts are provisioned.

Candidate `app/database_auth.py:108–151` already validates a password hash, creates server-side token/CSRF hashes and sets persistent cookies with Max-Age, HttpOnly session cookie, SameSite=Lax, and Secure outside `local`. Its identity function revalidates session expiry, membership/user status and tenant context; mutating requests require CSRF. Registration/source presence is not proof of complete approved authentication behavior. Candidate business/auth code remains unchanged.

## Dependencies and approval gates

| ID | Dependency | Stage 4A evidence / next requirement |
|---|---|---|
| AUTH-FND-02 | Database/session tables and deployment tenant configuration | Schema intentionally absent; validate candidate migrations before isolated account provisioning. Do not import shipped demo records. |
| AUTH-FND-03 | Persistent sessions, expiry, revocation, renewal | Password-hash primitive and missing-session denial tested. Successful login, restart persistence, CSRF with valid session, revocation and renewal remain unverified end-to-end; execute all 18 specifications in document 29 on disposable fixtures. Approve duration/renewal policy. |
| AUTH-FND-04 | Cookie transport | Current harness is loopback HTTP and has no functioning login accounts. Candidate uses Secure cookies in `stage4a`; authenticated browser testing requires isolated HTTPS/same-origin setup, not weakening production cookie policy. |
| AUTH-FND-05 | Seven roles and landing behavior | Source table above; eight existing dropdown accounts cover six roles, manager accounts require manual fixture provisioning. Preserve all seven roles and record-level enforcement. |
| AUTH-FND-06 | Development credential fixture | Separate explicit build fixture, no API password/hash exposure; production bundle exclusion test and public-development access restriction required. No fixture implemented in 4A. |
| AUTH-FND-07 | User-editor password field | Existing layout frozen. Secure handling of current stored-password prefill still requires explicit approval; never return stored hashes. |
| AUTH-FND-08 | API contract alignment | Preserve candidate routes in 4A. Reconcile planned logout response/status and login/session response contracts before adapter implementation; no silent compatibility change. |
| AUTH-FND-09 | Session expiry in UI | Minimal adapter must validate server session, prevent redirect loops, preserve unsaved/business records, revoke on logout and retain unrelated browser data. Deferred; frozen frontend has no edits. |
| AUTH-FND-10 | Dependency warnings | Test run reports Starlette/AnyIO deprecation plus Pydantic alias warnings for tenantCode/userId. Add successful manual-email and legacy payload contract tests after fixture provisioning before declaring compatibility. |

The 26 foundation checks do not replace the 18 authentication acceptance specifications and do not certify production authentication readiness.
