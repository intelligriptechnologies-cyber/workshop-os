# PostgreSQL pipeline — Phase 1

Scope: CI/CD only for `Prem-dev-fbb-Go21`. No deployment, GitHub setting change,
commit, push, DNS or shared Caddy operation is authorized by this implementation.
Approved frontend baseline: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`.

## Workflow comparison

| Concern | Existing frontend pipeline | New PostgreSQL pipeline |
|---|---|---|
| Files | deploy-staging.yml, start-staging.yml, stop-staging.yml | postgres-ci.yml, postgres-deploy.yml |
| Branch | Prem-dev-fbb | Prem-dev-fbb-Go21 |
| Automatic action | Build and deploy on push | Verify on push/PR; publish on successful push only |
| Build | Node 20, npm ci/build, host Compose build | Digest-pinned Node/Python/nginx; npm lockfile; exact Python lockfile; allowlisted contexts |
| Tests | Frontend build | TypeScript, 248 existing unit tests, disposable PostgreSQL migrations/import replay, API/auth/seven roles, RLS and business suites |
| Release | Host source checkout | Tested image bytes transferred between jobs; paired GHCR digest references bound to commit and run |
| Deployment | staging environment, workshopos-staging group | Manual only; workshopos-postgres approval; separate global concurrency and host flock |
| Service scope | Legacy workshopos-staging Compose | Existing workshopos-stage51 api/frontend only, --no-deps; no build/import/migration/prune |

All three legacy files are byte-identical to `Prem-dev-fbb`. Their existing manual
dispatch behavior is retained, including the absence of branch guards in those
legacy dispatch workflows. Do not use them to operate the PostgreSQL stack.

## CI and local verification

From a clean checkout with Docker Linux containers and Python 3:

```sh
python3 deploy/ci/prepare.py
docker build --platform linux/amd64 -t workshopos-ci-api .scratch/pipeline-context/api
docker build --platform linux/amd64 -t workshopos-ci-frontend .scratch/pipeline-context/frontend
python3 deploy/ci/verify_frontend.py
npm ci
npm run test:unit
python3 deploy/ci/test_backend.py
python3 -m unittest discover -s deploy/ci -p 'test_guards.py' -v
```

Preparation refuses an existing `.scratch/pipeline-context`; preserve evidence and
use a new checkout for another full build. Local runs do not publish images.
CI builds add the full commit OCI label. Publishing loads the tested tar archive,
tags with commit/run/attempt for discovery, then records **repository@sha256**
references in `postgres-release.json`. Deployments never resolve mutable tags.
PR runs have no registry-write permission or deployment secrets.

The backend image intentionally reuses the approved Stage 49 packager: foundation
revision `50c8aab1766b61c914e2829b460bfd1697723ec2` plus current slice modules and
versioned migrations. Full history is fetched so that pinned revision is available.
Do not substitute the unrelated root backend implementation. Dependencies are
locked via `package-lock.json` and `backend/foundation/requirements.lock`; base
images and Actions are digest/SHA pinned. Runner tooling is GitHub-managed, so this
is reproducible dependency/source selection, not a claim of bit-identical OCI
archives across arbitrary builder versions.

Tests create a randomly named internal Docker network and PostgreSQL container
with tmpfs data and no host ports. They import the read-only approved fixture only
into this fresh CI cluster, then clone it for each suite. The existing initializer
checks migration head `20261022_0053`, 3,241 custody records, 67 quarantines, 242
exact financial rows, seven historical stock rows, 51 preserved invoice
discrepancies and duplicate-import idempotency. No local rehearsal container is
used. Credentials are generated per run and deleted after teardown. CI reports
contain no credential files, backups, browser state or source SQLite exports.

Suites include customers/auth/CSRF/session revocation/seven-role authorization,
tenant RLS, operations, vehicles/ownership, estimates/documents, purchase/stock
and edge cases, financial workflows/materials/database boundaries, bookings,
execution/approvals, catalog, sales, administration and configuration. Each
suite uses its own fresh database clone; financial database checks run after the
financial workflow suite. `financial_fixture.py` creates one additional unpaid
invoice through the existing API because the workflow suite settles/voids all its
invoices and the database suite requires an unpaid row for its INSERT...SELECT
negative case. Existing tests and application code remain unchanged.
The existing frontend unit suite includes calculations.
Full screenshot/browser regression is not part of this Phase 1 pipeline and
remains a release acceptance gate; no visual baselines are updated.

## GitHub configuration (not performed)

Create Environment **workshopos-postgres**, restrict deployment branches to exactly
`Prem-dev-fbb-Go21`, add required reviewers, prevent self-review, and disallow
administrator bypass where supported. Verify the repository plan supports these
protections before enabling. An `environment:` declaration alone does not create
required reviewers. See [GitHub environment documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).

Environment secrets (new names, separate from frontend staging):

| Secret | Value |
|---|---|
| WORKSHOPOS_PG_DEPLOY_KEY | Dedicated SSH private key for the narrowly authorized host deploy account |
| WORKSHOPOS_PG_KNOWN_HOSTS | Independently verified host key line; never runtime ssh-keyscan trust |
| WORKSHOPOS_PG_HOST | Existing Hetzner host/IP |
| WORKSHOPOS_PG_USER | Authorized deployment account |

Environment variable `WORKSHOPOS_DEPLOY_ENABLED`: leave unset/false until every
activation prerequisite below passes, then set exactly `true`.
`GITHUB_TOKEN` is supplied by GitHub; CI publish requests packages:write, deployment
requests actions:read. Allow the repository to publish its private GHCR packages.
Install a read-only GHCR credential in the host deploy account's Docker credential
store separately; do not put it in policy files or Git. Database credentials and
smoke credentials stay on the host. No application database secret belongs in CI.

## Host policy and recovery contract

Install the reviewed `deploy.py` as `/opt/workshop/cicd/deploy.py` using the existing
authorized administrator, with Python 3 and Docker Compose v2 supporting `--wait`.
The deployment account must not be able to edit the script, policy or recovery
attestations. Keep `/opt/workshop/cicd` administrator-owned and non-writable by that
account; create `/opt/workshop/cicd/state` owned by the deployment account, mode 0700,
for the lock, active-release pointer and release output directories. The installed
helper's SHA256 must match the CI release manifest. Docker access itself is privileged: review account/key
scope and prefer a forced-command SSH key for this script. Never grant access by
bypassing the existing host permissions. No host installation was performed here.

Create `/opt/workshop/cicd/policy.json` after read-only drift inspection. This is a
schema example, not an executable configuration (all paths/hashes must be real):

```json
{
  "enabled": false,
  "repository": "OWNER/REPOSITORY",
  "origin": "https://workshopos.nexiohyper.com",
  "env_file": "/opt/workshop/stage49/stage51-release/private.env",
  "compose_files": [
    "/opt/workshop/stage49/stage51-release/deploy/stage49/compose.yaml",
    "/opt/workshop/stage49/stage51-release/deploy/stage51/compose.private.yaml"
  ],
  "protected_files": {
    "ABSOLUTE_PATH_OF_EACH_COMPOSE_ENV_AND_SHARED_CADDY_FILE": "SHA256"
  },
  "checkpoint": "/PROTECTED_RECOVERY_PATH/checkpoint.json",
  "smoke_credentials": "/PROTECTED_SECRET_PATH/smoke.json"
}
```

Include the **already activated** hostname overlay in compose_files if applicable,
plus every current image overlay needed to reproduce the live service settings.
Hash every listed Compose file, env file and shared Caddy configuration/import.
Do not activate the hostname or change its Origin merely to satisfy this pipeline.
The script requires the running configuration's exact public Origin and healthy
existing api/frontend/db containers. It checks all other container identities,
images, start times/restart counts before/after. It never runs Compose down,
remove-orphans, start/stop for the whole project, or a shared proxy command.

The protected checkpoint JSON must be produced by an authorized recovery operator
after a real fresh restore/retrieval and rollback rehearsal:

```json
{
  "verified_at": 0,
  "candidate_commit": "FULL_TESTED_COMMIT_SHA",
  "schema": "20261022_0053",
  "previous_images": {"api": "sha256:IMAGE_ID", "frontend": "sha256:IMAGE_ID"},
  "restore_verified": true,
  "offhost_retrieval_verified": true,
  "rollback_same_schema_verified": true,
  "database_backup": {"path": "/PROTECTED_PATH/database.dump", "sha256": "SHA256"},
  "restore_report": {"path": "/PROTECTED_PATH/restore.json", "sha256": "SHA256"},
  "rollback_report": {"path": "/PROTECTED_PATH/rollback.json", "sha256": "SHA256"}
}
```

`verified_at` is UTC Unix seconds, at most one hour old. Reports must cover table
fingerprints/counts, financial history, sequences, document/media bytes, grants,
tenant isolation, retrieval/decryption custody, and old-image compatibility. A
boolean or pg_restore --list alone is not evidence: reviewers must inspect the
hashed reports. The helper verifies their presence/hash/freshness and release
binding; it does **not** perform the full off-host restore rehearsal itself.
An additional fresh pg_dump is taken immediately before replacing application
containers. Neither backup is automatically restored. All current document/media
storage is database-backed; re-evaluate backup scope if that changes.

`smoke.json` contains `gate_user`, `gate_password`, `email`, `password` for the
existing private HTTP gate and an authorized read-capable app account. Protect it
with host ACLs. Smoke uses trusted public TLS, health/readiness, anonymous denial,
normal CSRF login, authenticated session/customer read and logout/revocation.
It creates no business records and does not log secrets.

## Exact activation sequence

1. Review these files and local results. Obtain approval before commit/push.
2. Configure branch protection for `Prem-dev-fbb-Go21`: require the PostgreSQL CI
   `verify` check, reviews, and no bypass. Protect changes to these workflow/helper
   files. Keep legacy pipeline files unchanged.
3. After approval, commit only intended files and push this branch. Observe a
   successful CI verify/publish run and inspect its paired digest release artifact.
4. Make the manual workflow available on the repository default branch through a
   separately approved change, preserving the legacy workflows. GitHub requires
   dispatch workflows on the default branch; see [workflow triggers](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
5. Configure the protected Environment/secrets above. Complete the independently
   approved public hostname activation, current host inventory, off-host recovery,
   visual acceptance and same-schema rollback rehearsal. This task performs none
   of those operations.
6. Have the operator install/review the host helper and policy, configure GHCR pull
   access, prepare fresh protected checkpoint evidence and smoke credentials.
7. Enable host policy and Environment variable only when the gates are satisfied.
8. Dispatch `postgres-deploy.yml` using branch `Prem-dev-fbb-Go21` and the successful
   CI run ID. Dispatch only while that branch HEAD equals the tested commit:
   `gh workflow run postgres-deploy.yml --ref Prem-dev-fbb-Go21 -f ci_run_id=RUN_ID`.
9. The reviewer checks commit, run, digests, checkpoint reports and target before
   approving the Environment. Deployment is serialized; the host lock also rejects
   overlapping manual runs. Review smoke results and the host active-release record.

## Rollback and migration boundaries

Only same-schema application releases are supported in Phase 1. The helper checks
both the live Alembic head and candidate image head. A changed head stops before
service mutation. No automatic migrations, downgrades or demo re-imports occur.
Schema-changing releases require a separately approved expand/contract migration,
backup, reconciliation and rollback plan; do not change the expected head simply
to bypass the guard.

If update or smoke fails, the helper restores only api/frontend to the retained
previous local image IDs and reruns smoke. It retains the fresh dump, release
manifest and rollback overlay in the printed recovery directory. If rollback also
fails, the workflow stays failed: inspect only the Workshop services and escalate.
No database writes are lost by an image rollback. Before a later manual rollback,
take a fresh checkpoint, verify schema compatibility, acquire the same host lock,
and run the exact approved Compose file list with that release's `rollback.json`:
`up -d --no-deps --no-build --pull never --wait api frontend`. Re-run the same smoke
checks. Never use `down -v`, global prune/restart, or overwrite a live database.

For database recovery, restore into a new isolated volume, verify all records,
financial totals, tenant policies and document bytes, and reconcile writes made
after the checkpoint before any separately approved cutover. Do not blindly restore
an older dump to undo an application release.

## Remaining activation blockers

- The frozen-document blocker has been corrected with explicit real-role,
  trigger-origin, valid-mutation, destructive-privilege and byte-preservation tests.
  No database grants or enforcement changed. See the final-blocker section of
  [local validation](VALIDATION.md) for current verification results.
- GitHub workflows/registry publication/Environment approvals have not run remotely.
- No host installation, current drift inventory or target health check was performed.
- Latest repository records still mark hostname activation pending and off-host
  backups deferred. Fresh authorized evidence is required; no DNS/Caddy change here.
- Required reviewers, repository plan support, secrets, GHCR pull access and protected
  recovery evidence must be configured externally.
- UI/browser visual acceptance remains unverified in this task.
- Schema-changing deployments are deliberately blocked pending their separate plan.

No application features, frontend files, schema migrations, original demo records,
financial history, legacy workflows, logging or Developer Console were modified.
