# 41 — First PostgreSQL-backed application slice

Implemented authentication and the existing Customers module on isolated local resources. No commit, push, deployment, source-database modification or frontend redesign.

- App: https://localhost:18443/login (self-signed local HTTPS).
- Test app: https://localhost:18444/login, separate database and dedicated profiles.
- API: same-origin `/api/v1/auth/config`, `/auth/login`, `/session`, `/auth/logout`, `/customers`, `/customers/{id}`, `/customers/{id}/archive` under `/api/v1`.
- Development data: all 121 imported customers, 132 vehicles and 145 linked jobs remain in the clone. Other frontend modules remain local. The previous 3,174 imported / 67 quarantined record reconciliation is unchanged.

## Implementation and protected files

| File | Necessary integration change |
| --- | --- |
| `src/App.tsx` | Server-validated login/session bootstrap, existing dropdown prefill, role landing, logout, refresh/expiry handling; existing customer form/list/archive/view handlers use typed adapter. No layout, styling, labels, field order or modal structure changed. |
| `src/db.ts` | Memory-only customer projection; new browser persistence excludes customer rows while keeping unrelated local modules and old storage untouched. Local customer writes fail closed. |
| `vite.config.ts` | Explicit local slice flag, HTTPS proxy and development-only generated credential fixture. |
| `src/customer-api.ts`, `src/customer-api-env.d.ts` | New typed transport, CSRF, session handling, customer versions and idempotency keys. |
| `backend/customer-slice/` | Scoped FastAPI API, separate dev/test Compose resources, setup, two Alembic migrations and repeatable API/browser/visual/preservation checks. |

Alembic 0038 permits only audited customer field edits/archive, retaining immutable identity and import provenance, and adds command deduplication and audit tables. 0039 binds sessions to membership versions. Revocable persistent HttpOnly/Secure/SameSite cookies, session-bound CSRF and login nonce/origin checks apply to both manual and dropdown login. Seven roles use server authorization; customer writes permit Admin/Reception. Session/directory responses contain no stored password or hash.

## Results

- 42 backend assertions passed: real PostgreSQL CRUD, imported-row audit/edit, required fields, duplicate mobile, idempotency, stale edit, role restrictions, CSRF/origin/login failure, cookie protections, logout and revoked replay.
- 24 browser assertions passed: dropdown/manual login, search, existing Add/Edit/View/Archive, archive filter, refresh, true persistent-profile restart, cross-session customer visibility in the Reception UI, expiry and logout. New browser SQLite serialization has zero customer rows and retains 132 unrelated vehicles.
- 8 additional role/session assertions passed: all seven roles manually authenticate and return from `/login` to their authorized existing landing; non-Admins have no Admin Dashboard. Membership version changes invalidate sessions.
- TypeScript and integrated Vite build passed (existing bundle-size/dynamic-import warnings).
- Full unit suite: 241 passed, 3 failed. All three are report-template expectations of 6 categories against 8 current categories. The same three failures reproduce on the untouched approved baseline; no tests were changed to mask them.
- Six affected UI states (login, list, search, Add, Edit, View) are pixel-identical to the approved baseline build at 1440x900. No baseline screenshot was replaced.
- Of 115 protected files, 112 are byte-identical; the only three changed files are documented above. All 94 screenshots and all eight original SQLite copies are byte-identical. HEAD remains a315448ce8c3f8f86026b58c18a2231bb3e5e9a7 on Prem-dev-fbb-Go21.
- All 102 original tables outside the intentional auth/customer/migration set match the original rehearsal in both clones, including financial and immutable import-custody tables. Development retains 121 customers. Imported customer changes were audited in the test clone.

Evidence: `backend/customer-slice/artifacts/{backend-tests,browser-tests,roles-tests,visual-results,protection-data}.json`, paired screenshots and diff images. Setup/run/test instructions: `backend/customer-slice/README.md`.

## Remaining boundaries

This completes the tested local authentication/Customers slice, not the migration or production readiness. The 67 historical quarantined records remain preserved. Unrelated modules, user provisioning/editing and Receive Vehicle customer writes are not migrated; those legacy customer-write paths fail closed rather than write a competing local customer store. Exact production session timing and production fixture/SQLite packaging require their separate readiness work. Local TLS uses a generated self-signed certificate. No broader workflow or all-page visual regression is claimed.

STOP at this slice. Review the local application and choose the next module only with explicit authorization.
