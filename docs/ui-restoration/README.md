# WorkshopOS reference restoration — incomplete

Reference: `Prem-dev-fbb` commit `a315448`. Work branch:
`prem-dev-fbb-backend`. No hosted deployment was performed.

## Implemented

- Restored the reference email/password form and local demo quick-user control.
- Added email authentication with the server-owned
  `WORKSHOPOS_DATABASE_TENANT_CODE`; the local Compose configuration selects
  `demo`. Existing `tenantCode`/`userId` callers remain supported.
- Preserved cookie sessions, CSRF checks, logout, expiry, and authorization.
  Email login rejects conflicting tenant input, ambiguous identities, and
  missing deployment configuration.
- Restored reference sidebar logout, mobile logout, header markup, and shared
  CSS. Offline data-access safeguards remain in place.
- Added reference captures, browser checks, an initial review matrix, and a
  dry-run-first account-repair script with provenance and relationship guards.

## Evidence and remaining gates

[review-matrix.csv](review-matrix.csv) contains 1,361 initial-state review rows.
[reference-pages.json](reference-pages.json) covers all ten users, including
both managers. [reference-controls.json](reference-controls.json) records the
visible controls for those pages and all ten Admin Console tabs.

The matrix is **not a complete action/state inventory**. Nested tabs, dialog
states, validation, confirmation, saved/cancelled states, and persistence
checks still require expansion. No operational page is marked complete.

Reference page/tab captures are under
`.scratch/restoration-inventory-a315448/`, at 1440×900 and 390×844 with a fixed
2026-10-20 clock. The tracked login and shell images are in
`tests/reference-a315448/`. The reference source was built separately into
`.scratch/restoration-reference-build/`; the reference checkout was not edited.
An older `.build-check` bundle proved stale and its rejected captures were
preserved in `.scratch/rejected-stale-reference-captures/`.

Login comparisons pass exactly at both viewport sizes. Sidebar comparisons
pass at both sizes. Header comparisons remain failing: the element screenshot
includes a bottom-edge difference where the reference page has a panel border
and the replacement page does not. Expected captures have not been changed to
hide that difference.

## Account migration blocker

The reference SQLite SHA-256 is:

`04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`

The live demo tenant's recorded import SHA-256 is:

`57b451fcf35ad05238f44cb57620ff7298daa697b007209994fac30c39facb54`

The old rehearsal report records the reference checksum, but it does not prove
the provenance of the current database. The new repair script aborted on the
disposable clone with:

`Import provenance does not establish reference identity mappings`

No demo accounts, passwords, memberships, assignments, or operational records
were changed by the repair. The source/anonymization lineage for the live
checksum is needed before reconciling the placeholder accounts. Matching
numeric IDs alone is insufficient. The whole-demo checksum guard remains
unchanged.

The ten-user credentials/permissions/assignment acceptance gate is therefore
still open. The quick-user control shows the reference choices, but nine
reference identities do not yet correspond to the live placeholder emails.

## Verification

- `npm run build`: passed; existing bundle-size/jsPDF warnings remain.
- `npm run test:unit`: 257 passed.
- Focused login/session browser checks: 7 passed before adding the two shell
  comparisons; both login image checks remain passing.
- `WORKSHOPOS_LIVE_LOGIN=1` browser test against the real local API/PostgreSQL:
  passed, including reload, independent browser sign-in, and logout.
- PostgreSQL clone email/session integration plus password unit tests:
  3 passed. Tests cover wrong password, tenant mismatch, normalized email,
  cookie session restoration/revocation, UUID compatibility, ambiguous request
  rejection, and missing tenant configuration.
- Full regression results are recorded separately in `verification.md`.

## Preservation and continuation

Pre-edit tracked and untracked application files were copied to the sibling
`WorkshopOS-preserved-20261020-192630` directory, with a binary Git patch and
HEAD identifier. The database backup is `database-before.dump` in that
directory. Dependency/build caches were not part of the application snapshot.
The original worktree contained extensive uncommitted backend changes.
Those application changes are preserved in checkpoint commit `21af3e1` and
branch `preservation/ui-restoration-20261020`. Subsequent focused commits are
`5747e27` (reference harness/inventory), `e544e91` (login/navigation), and
`2fe44f8` (guarded account-repair command).

The local API image was rebuilt and restarted with the email-login support.
The production/hosted environment was untouched.

The next implementation stages remain: complete comparison coverage; resolve
account provenance; restore every Admin Console implementation and remove its
operational Imported Data tab; then restore Job Cards, Approvals, Advance
Bookings, Dashboard, and all remaining role workspaces through typed server
adapters. The replacement `Remote*` presentations still exist. No missing
backend behavior has been substituted with browser-local persistence.

## Reproducing reference captures

Build `a315448` outside its checkout, serve that output on port 5176, and run
`scripts/capture-restoration-reference.mjs`,
`scripts/capture-restoration-shell.mjs`, or
`scripts/inventory-restoration-reference.mjs` as appropriate.
Login/shell capture scripts refuse to overwrite existing expected images.
Do not update expected images from the implementation under test.

Run focused tests with `UI_TEST_PORT` pointing to the restored app. The live
login test additionally requires `WORKSHOPOS_LIVE_LOGIN=1` and the local API.
The database-email integration test requires a disposable demo clone named
`workshopos_restoration_test`. The other backend integration tests reset data;
never run them against the operational database.
