# Phase 1 local implementation and verification

Date: 2026-10-24. Branch: `Prem-dev-fbb-Go21`.
Existing HEAD: `74c9aaf9872a6817ddbdad8a465ade872689d5b9`.
Legacy branch/approved UI baseline: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`.
Read AGENTS.md, the migration/deployment requirements and Graft context; refreshed
the graph after implementation. Existing untracked user artifacts were preserved.

**Historical Phase 1 report; see the final-blocker follow-up below for current status.** No deployment, registry push,
GitHub setting change, commit or Git push was performed.

## Files added

- `.github/workflows/postgres-ci.yml`: branch-scoped push/PR checks, tested-image
  publication, immutable paired release artifact.
- `.github/workflows/postgres-deploy.yml`: manual dispatch, successful-run/commit
  verification, protected Environment, concurrency, pinned SSH host trust.
- `deploy/ci/prepare.py`, `publish.py`, `verify_frontend.py`: existing allowlisted
  packaging, tested-image publication and production artifact inspection.
- `deploy/ci/test_backend.py`, `tenant_isolation.py`, `financial_fixture.py`:
  isolated PostgreSQL runner and CI-only fixtures/security checks.
- `deploy/ci/deploy.py`, `test_guards.py`: host-reviewed same-schema deployment,
  recovery prerequisites, service-only replacement/rollback and guard tests.
- `deploy/ci/README.md`, `VALIDATION.md`, `.gitignore`: runbook, results and local
  Python cache exclusion.

No existing tracked file changed. In particular, no application backend/frontend,
schema, lockfile, existing test, approved workflow, demonstration dataset, logging
or Developer Console implementation was modified. No UI/workflow behavior change
was implemented. UI appearance and browser interactions remain **unverified** by
this task; unit tests and builds are not visual regression proof.

## Results

| Check | Result |
|---|---|
| Legacy workflow comparison against Prem-dev-fbb | All three byte-identical; git diff exit 0 |
| Tracked working-tree diff | Empty; pre-existing untracked work preserved |
| Git whitespace check | Passed |
| actionlint 1.7.12, pinned image digest | Both new workflows passed |
| YAML parse and Python compilation | Passed |
| TypeScript + existing frontend unit suite | 248 passed, 0 failed/skipped |
| Linux amd64 frontend Docker build | Passed; existing digest-pinned Dockerfile and npm lockfile |
| Linux amd64 backend Docker build | Passed; existing digest-pinned Dockerfile and Python lockfile |
| Production frontend image inspection | PostgreSQL manifest; no SQLite/WASM/database/map/env assets or demo password literals |
| Deployment guard tests | 6 passed, including malformed/mutable/untrusted image references, extra services, non-SHA commits, recovery age/hash/release binding and non-target container inventory |
| Clean PostgreSQL initialization/migration bridge and import replay | Passed in fresh isolated clusters; head 20261022_0053 |
| Import preservation | 3,241 source/custody records; 67 quarantines; 242 exact historical financial rows; 7 historical stock rows; 51 original invoice discrepancies; duplicate import idempotent |
| Restricted runtime and cross-tenant RLS | Passed for customers, vehicles, jobs, invoices, payments and documents |
| Existing API/auth/CSRF/session/seven-role tests | 42 assertions passed on each importing suite |
| Backend test groups (combined final evidence) | 16 passed, 1 failed; details below |
| Cleanup | All run-created PostgreSQL containers/networks removed; original databases were never used |
| Remote deployment, GHCR publish, host smoke/rollback | Not executed, as requested |
| UI screenshot/browser comparisons | Not executed; unverified |

Local image references (not published registry digests):

- API: `sha256:9c17151490abb98db12d972cb07b2c749494c824f248168fcf4892233557f00d`
- Frontend: `sha256:e26515944b2448728edae1e60cd369c6837979b8ae0347b3b40cf3808cc5b905`

These local builds omitted CI's commit label. Actual CI builds add that label and
transfer the same tested image bytes to the publication job; they are not rebuilt
there. GHCR digests will be recorded only after a successful authorized push run.

Passing groups: tenant isolation, API/auth, operations, vehicles, ownership,
purchase/stock, stock edges, finance, financial materials, bookings, execution,
material approvals, catalog/team, sales, administration and configuration.

Finance initially failed its independent database test because a fresh isolated
fixture had no unpaid native invoice: the workflow suite settles/voids all its
invoices, so the negative INSERT...SELECT inserted zero rows. The CI-only
`financial_fixture.py` now creates the required unpaid invoice through the existing
API. A separate fresh-cluster rerun passed **49 financial workflow assertions and
11 database boundary assertions**. No existing test was changed or skipped.

The remaining failed group is `test_estimate_documents.py:101`. An attempted
frozen-document update is rejected by `s4b_protect_snapshot` with SQLSTATE **23514**
(`Document snapshots are append-only`); the existing test insists on **42501**.
The update was rejected, but the test's error-contract assertion fails. This is
recorded without changing application permissions, triggers or the test. It keeps
CI red, so `publish` cannot run and no eligible deployment release can be produced.

Evidence retained locally:

- `.scratch/pipeline-unit.txt`
- `.scratch/pipeline-backend-final.txt` (full run before the finance fixture fix)
- `.scratch/pipeline-financial-final.txt` (fresh finance rerun after the fix)
- `.scratch/backend-ci-results.json` (latest selected run summary)
- `.scratch/pipeline-context/manifest.json` (allowlisted build inputs)

The results above combine the full run with the focused finance rerun; a second
full run was not performed because the other test groups and application were
unchanged. No complete green pipeline or full regression coverage is claimed.

## Requirements and next action

Implemented automatic branch CI, disposable PostgreSQL, migration/security/business
checks, reproducible locked builds, immutable image publication, manual protected
deployment, concurrency, backup/rollback gates, post-deployment read-only smoke,
and exact Workshop-only service selection. Normal deployments never initialize,
re-import or migrate data. The deployer blocks schema changes and missing/stale
recovery evidence. Shared Caddy/DNS and unrelated containers are never operated on.

Resolve the frozen-document error-contract mismatch through a separately approved
test/requirements review, then rerun CI. Configure GitHub reviewers/secrets and
host policy only under the [activation runbook](README.md). Outstanding external
gates include the repository's still-pending hostname activation, off-host restore
evidence, visual acceptance and current host inventory. No infrastructure or
remote approval state was assumed from historical documentation.

## Final-blocker follow-up — 2026-10-24

The user authorized investigation and correction of the frozen-document security
test, with no deployment, commit or push. The focused failure was reproduced with
`python deploy/ci/test_backend.py --suite estimate_documents` before editing.

### Root cause and security contract

The failing operation was `UPDATE document_snapshots SET html=:h WHERE
job_card_id=:j` in `test_estimate_documents.py`, originally at lines 98–101. It
expected SQLSTATE 42501. This assumption came from a different fixture ACL:

| Environment | Effective document privileges | Result for UPDATE |
|---|---|---|
| Older local slice fixture | SELECT, INSERT | Privilege rejection, 42501 |
| Fresh CI migration replay | SELECT, INSERT, UPDATE | Append-only trigger rejection, 23514 |
| Actual deployed Stage 51 API/database, read-only inspection | SELECT, INSERT, UPDATE | Same enabled append-only trigger; no remote mutation attempted |

`backend/customer-slice/prepare.py` restores with `pg_restore --no-acl`; its setup
re-grants SELECT/INSERT. Read-only inspection of the existing local slice database
confirmed those narrower privileges. The current CI initializer replays the full
schema, including `0034_expand.sql:1529`, which explicitly grants UPDATE. Migration
0043's later SELECT/INSERT grant does not revoke that earlier UPDATE privilege.
The older local databases were inspected read-only and were not re-granted or
rebuilt. Use the disposable CI runner to exercise the deployed ACL contract.

`0034_metadata.sql:18–23` defines `s4b_protect_snapshot()` and the enabled row-level
`s4b_snapshot_immutable` BEFORE UPDATE OR DELETE trigger. It unconditionally raises
`Document snapshots are append-only` using SQLSTATE **23514**. This is an explicit
immutability exception, not failure of a malformed HTML value or unrelated CHECK.
The original schema test also expects an IntegrityError on snapshot rewriting.

The approved contract requires versioned immutable snapshots (architecture §SVC-02
and document storage; financial migration report §snapshot behavior), scoped RLS
and restricted non-owner roles (authentication design §database isolation). It
does not specify that every UPDATE must fail at the privilege layer. The existing
enforcement combines **trigger immutability for UPDATE** with **privilege denial
for DELETE/TRUNCATE**, plus forced tenant/branch RLS. No broader write grant is
needed and no trigger, privilege, schema or application change was made.

Read-only inspection through the actual deployed API's configured engine confirmed:

- Session/login principal `slice_auth`; effective business role `workshopos_runtime`.
- Neither role is superuser, INHERIT or BYPASSRLS; business role is NOLOGIN.
- Schema head `20261022_0053`; snapshot SELECT/INSERT/UPDATE allowed;
  DELETE/TRUNCATE/TRIGGER denied; append-only trigger enabled and bound correctly.
- CI uses the same Stage 49 initializer and same `business()` SET LOCAL ROLE path.
- No credentials were printed; no live mutation, grant change or deployment ran.

### Changes and stronger regression coverage

Files changed in this follow-up:

- `backend/customer-slice/test_estimate_documents.py`: replace the single stale
  SQLSTATE assertion with the shared security contract checks in the actual
  authenticated business context.
- `backend/customer-slice/test_financial_database.py`: apply those checks to all
  four document kinds produced through authorized estimate/payment APIs.
- `backend/customer-slice/document_security_test_support.py` (new): verify login,
  effective role, role flags, exact deployed ACLs, non-ownership, forced RLS and
  enabled trigger binding. For each real target, test a valid no-op update,
  valid non-null HTML rewrite, valid JSON rewrite, and DELETE. Assert the exact
  trigger message/function context for 23514 and table privilege denial for 42501.
  Check all snapshot rows/bytes after each attempt; test TRUNCATE and attempted
  trigger disable. Savepoints roll back even an unexpected successful mutation.
- `deploy/ci/financial_history.py` (new), `deploy/ci/test_backend.py`: reconcile all
  eight imported financial tables against custody and compare complete row
  fingerprints with the untouched template after every backend group.
- `deploy/ci/README.md`, `deploy/ci/VALIDATION.md`: update blocker and activation status.

This is not a relaxed SQLSTATE whitelist. A missing trigger, wrong role, empty
target, unrelated constraint error, broader destructive grants, or any changed
snapshot bytes causes failure. Authorized API creation must succeed first and
produce estimate/invoice/payment-receipt/gate-pass rows before the negative tests.

No frontend or application runtime files changed. No schema migration, broader
financial permission, demo-data modification, logging or Developer Console change.
The original UI/workflow implementation is untouched; visual UI remains unverified.
Frontend unit tests are unaffected and were not rerun for this test-only correction
(the earlier 248-test result above is historical, not a new run).

### Follow-up results

- Focused estimate/document group: **74 passed**, including the formerly failing case.
- Focused finance: **49 workflow + 69 database-security checks passed**; authorized
  creation, idempotency, frozen snapshots, void history and financial boundaries retained.
- Deployment safety: **6 tests passed**. Both workflow files passed pinned actionlint;
  Python compilation and Git whitespace checks passed.
- Full backend CI run: **17/17 groups passed, zero failures**, exit code 0. Each
  group retained all 242 historical financial records, matching custody values
  and complete pre-test row fingerprints. All disposable containers/networks were
  removed and test credentials cleaned up.
- Final read-only hosted reconciliation: **242/242 custody matches**, with all
  eight historical financial table fingerprints identical before/after investigation.
- Frontend unit tests: not rerun because no frontend/application behavior changed.
  No visual/UI regression verification was performed in this follow-up.

**No local CI test blocker remains.** The pipeline is ready for reviewed GitHub CI
activation after authorized commit/push; no GitHub-hosted run or package publication
has been performed. Manual CD remains fail-closed until its required reviewers,
secrets, host helper/policy, fresh recovery/rollback evidence and independently
approved hostname/visual gates are satisfied. This task does not authorize those
operations. No deployment, commit, push, DNS or Caddy modification occurred.

Evidence: `.scratch/frozen-red.txt`, `frozen-focused.txt`, `frozen-all-backend.txt`,
`frozen-host-security.json`, `frozen-host-history-before.txt`,
`frozen-host-history-after.txt`, and the CI JSON summary.
Hosted security evidence contains role/grant/trigger metadata only. Hosted financial
evidence contains counts/fingerprints only; it exposes no business records or credentials.
