# Stage 49 ? existing Hetzner staging runbook

**Preparation only. No remote deployment, DNS change, service restart, database mutation or proxy reload is authorized or performed.** Use report [49](../../docs/backend-migration/49-STAGING-DEPLOYMENT-PREPARATION.md) for local test evidence and remaining gates.

## Observed host, 23 October 2026

Read-only SSH as `prem` verified `nexiolabs` at the user-supplied host. Ubuntu 26.04, x86-64, Docker 29.8.0, Compose 5.5.1. Snapshot: 4 CPUs, 7,746 MiB RAM, approximately 5,191 MiB available, no swap; root disk 75 GiB total, 36 GiB available. Load was 1.04/0.35/0.23. This is not peak-capacity evidence.

| Project | Observed services / isolation |
|---|---|
| `barstock-production` | Caddy, frontend, backend, PostgreSQL 18 image; public Caddy owns 80/443 |
| `barstock-staging` | Frontend loopback 8080, backend loopback 8000, PostgreSQL 18.6 |
| `client-billing` | Separate production/staging apps and PostgreSQL 16 containers; staging is 16.15; separate DB/edge networks |
| `cowork-erp-staging` | Frontend loopback 8088, backend, PostgreSQL 18.6; app/database/trial networks |
| `cowork-trial-access` | Caddy gateway on loopback/bridge 18088 and Authelia on loopback/bridge 19091 |
| `workshopos-staging` | Existing frontend-only container, no host ports |

There are 17 running containers across these six projects. Other observed listeners include SSH 22 and desktop access 3389; this task does not change them. PostgreSQL ports are not published on the host. Existing apps mostly have no resource limit; Cowork has explicit limits. Do not infer spare peak capacity from idle container statistics.

Current public proxy: `barstock-production-proxy-1`, mounting `/opt/barstock/deploy/Caddyfile.production` and an additional client-billing route file. The existing Workshop OS block proxies `workshopos-staging.nexiohyper.com` to `workshopos-frontend:80`. Network `workshopos-staging-proxy` currently contains only that proxy and the old Workshop OS frontend. Barstock, billing and Cowork routes must remain unchanged.

Read-only metadata queries in the three non-production database containers found no `workshopos*` or `slice_auth` roles. Barstock staging has ~11 MB of app data/max_connections 100; billing staging ~9 MB/100; Cowork staging/trial ~12 MB/~59 MB/40. Archive mode is off in these three instances. Existing backup scheduling, I/O peaks and off-host recoverability remain unverified. Production database contents were not queried.

## Recommended topology and database decision

Use the **same Hetzner host**, a new `workshopos-stage49` Compose project, and a **separate PostgreSQL 17 container**. No new server. Reuse of an existing instance was considered but is not recommended now: inspected instances are application-owned and run different major versions from the tested Workshop OS stack; migration roles are cluster-global, and sharing would couple maintenance, grants and recovery with another application. This is an isolation/validation decision, not a claim that PostgreSQL 18 is inherently incompatible.

Only candidate Nginx joins the already-existing proxy network, under the unique alias `workshopos-stage49-frontend:8080`. Its private `app` network reaches FastAPI; only FastAPI and PostgreSQL share the internal `database` network. There are **no published ports** in the deployment Compose. The database has a dedicated project volume. No other application/network/volume is reused for business storage.

Limits: frontend 0.25 CPU/128 MiB/64 PIDs; API 0.75 CPU/512 MiB/128 PIDs; database 1 CPU/1 GiB/128 PIDs, 30 connections and 128 MB shared buffers. API pool is 2 with overflow 3; runtime role connection limit is 8. Combined memory ceiling ~1.625 GiB. Current free memory suggests this is plausible, but activation still needs peak monitoring/headroom and growth estimates. Build off-host. Disk planning must include PostgreSQL/media/WAL growth, retained images, encrypted off-host backups and an independent restore copy. Do not reclaim space using Docker prune.

A future shared-database alternative requires explicit DBA approval, major-version regression, database/role/ACL isolation and independent recovery. Never modify another database's PUBLIC grants or reuse another app's login just to make Workshop OS fit.

## Packaging and secrets

`prepare_context.py` creates allowlisted contexts under `.scratch/stage49-context`, refusing to merge into an existing directory. It pins the established backend base revision, includes the complete migration chain and current slice, and excludes original SQLite/recovery/credential files from images. The initialization service receives the original SQLite only as a read-only bind mount. Base images use digests; npm uses the lockfile, Python uses exact versions from the existing lock. Release images must be pinned by digest/image ID and pass `validate_release.py`.

Protected frontend changes are limited to production omission of legacy recovery password literals in `src/db.ts` and `src/developer-control-plane.ts`. No screen, CSS, form, dialog, navigation or calculation changed. Local development dropdown/prefill remains available. Staging sets `SLICE_PREFILL=false`; manual login uses new per-user credentials. API `allowDemo=false` suppresses the existing dropdown without a replacement login screen.

The candidate Nginx adds a separate private-staging Basic authentication gate, backed by a secret htpasswd file, over HTTPS. Use a unique high-entropy access password and share only with authorized reviewers; retain any organizational VPN/SSO requirement as an activation prerequisite. Login is rate-limited. The API requires exact HTTPS Origin and CSRF checks, Secure/HttpOnly session cookies, no API caching, and an explicit staging database secret-file target. It will not accept a production or arbitrary shared database URL. API health checks verify migration head 53.

Names only (no values in this repository):

- Deployment settings: `WORKSHOPOS_API_IMAGE`, `WORKSHOPOS_FRONTEND_IMAGE`, `WORKSHOPOS_STAGING_ORIGIN`, `WORKSHOPOS_PROXY_NETWORK`, `WORKSHOPOS_SECRETS_DIR`, `WORKSHOPOS_SOURCE_SQLITE`.
- Runtime settings: `SLICE_STAGE`, `SLICE_PREFILL`, `SLICE_ORIGIN`, `SLICE_DATABASE_URL_FILE`, `SLICE_SESSION_SECONDS`.
- Secret files: `owner_password`, `runtime_password`, `runtime_url`, `accounts.json`, `access_htpasswd`. `runtime_url` is a SQLAlchemy URL for login `slice_auth`, host `workshopos-db`, database `workshopos_staging`; URL-encode its password. `accounts.json` maps every approved source email to a distinct new password, minimum 24 characters. Demo passwords are rejected.
- Operator/backup settings: `WORKSHOPOS_SSH_ALIAS`, `WORKSHOPOS_BACKUP_RECIPIENT`, `WORKSHOPOS_BACKUP_DIR`; existing CI SSH secret names remain `HETZNER_HOST`, `HETZNER_USER`, `HETZNER_DEPLOY_KEY`, `HETZNER_KNOWN_HOSTS` but the old workflows must not deploy this candidate.

Keep the secret directory mode 0700. Compose file-backed secrets are bind mounts: ensure files are readable by their container users (API/init UID 10001, frontend UID 101, PostgreSQL's image user), not just by the host operator. One supported arrangement is read-only 0444 files beneath the operator-only 0700 parent, mounted individually; never place them beneath a publicly traversable parent or in the build context. Verify permissions on Linux before activation. A secret manager with appropriate mounted ownership is preferable when already available.

The database bootstrap/migration owner has the historical name `stage4c_rehearsal_owner` because existing import constraints require that exact identity. It has a **new staging password in the new isolated cluster**. It is never given to the API. `slice_auth` is a restricted NOINHERIT/NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOBYPASSRLS login and explicitly assumes the established `workshopos_runtime` role inside transactions.

## Build and initialization commands

The following are preparation/local build commands, executed from a fresh workspace containing the reviewed changes:

```sh
python deploy/stage49/prepare_context.py
docker build -t workshopos-stage49-api:release .scratch/stage49-context/api
docker build -t workshopos-stage49-frontend:release .scratch/stage49-context/frontend
docker image inspect --format '{{.Id}}' workshopos-stage49-api:release
docker image inspect --format '{{.Id}}' workshopos-stage49-frontend:release
docker save -o workshopos-stage49-images.tar workshopos-stage49-api:release workshopos-stage49-frontend:release
sha256sum workshopos-stage49-images.tar
```

Record image IDs/archive hash and the source/context manifest. No image push occurred. Transfer/loading the archive onto Hetzner is a future remote action requiring authorization. Do not build from a dirty unreviewed checkout on the shared host.

After separate authorization, provision a **new** release directory and secret directory under `/opt/workshop/stage49/`, verify archive/source hashes, load the images, and fill `staging.env` from the example with the immutable image IDs. Do not overwrite `/opt/workshop/staging/source` or its existing deployment. From the new release repository root, the exact candidate-only sequence is:

```sh
# FUTURE AUTHORIZED ACTIVATION ONLY ? not executed remotely in Stage 49.
docker load -i workshopos-stage49-images.tar
python3 deploy/stage49/validate_release.py --env-file staging.env
docker network inspect workshopos-staging-proxy >/dev/null
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml up -d --wait db
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml -f deploy/stage49/compose.initialize.yaml run --rm -T initialize
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml up -d --wait api frontend
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml ps
```

There is no `--remove-orphans`, `down`, volume reset, pull-latest, DNS action or proxy reload in this sequence. It creates only the candidate services and does **not** change public routing. `compose.local.yaml` and `Caddyfile.local` are exclusively for the local rehearsal and must never be included on Hetzner.

Initialization refuses a nonempty database. It applies migrations through 37, imports the approved read-only source with original custody, verifies idempotent replay, then applies migrations through 53. It provisions all ten source users with unique new hashed passwords and audited profile links, grants narrow permissions, verifies no copied sessions, and reconciles historical financial rows, 51 discrepancies and 67 quarantines. The original importer synchronizes imported identity sequences. Failed partial attempts are preserved; retry into a new reviewed isolated target, never reset an original volume.

The source hash must be `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`. This is not a dump of the mutable regression database. Historical financial editing remains prohibited; missing historical media is not fabricated. Unknown user-browser records remain a separate reconciliation boundary.

## Proxy cutover and isolation verification

No DNS change is needed for the existing hostname. After independent candidate verification and explicit cutover approval, the operator would change **only** the Workshop OS upstream from `workshopos-frontend:80` to `workshopos-stage49-frontend:8080`. Keep all other Caddy blocks, mounts, network memberships and TLS state byte-identical. Review a minimal diff, validate the candidate Caddy configuration, then use the established shared-proxy reload procedure under separate approval. Do not restart or recreate the shared proxy. No proxy-edit/reload script is supplied or executed by this stage.

Verify the private access gate, certificate chain, secure cookies, Origin/CSRF errors, health, API routing, login/logout and seven-role sessions over the real hostname. Compare container IDs/start times, route hashes and port bindings for unrelated apps before/after. The existing frontend alias is never reused by the candidate, so current traffic remains on the old app until that separately approved cutover.

## Backups, media and rollback

Actual durable media/document content is in PostgreSQL (`slice_media_content`, purchase attachment content and snapshots). The dedicated PostgreSQL volume persists those bytes; the API filesystem is read-only. A consistent database dump includes metadata, bytes and provenance. Missing historical image bytes remain missing. No unnecessary media-filesystem migration was introduced.

Schedule independent encrypted off-host database backups and alerts after approval. Before any later migration, drain **Workshop OS writes only**, take a consistent custom-format dump, record migration/image/configuration versions and media checksums, and verify backup completion. Do not restart other apps or back up their databases. Example operator pipeline, requiring a preinstalled approved `age` tool and configured backup destination:

```sh
# FUTURE AUTHORIZED BACKUP ONLY. Run with bash and protected output directory.
set -euo pipefail
umask 077
backup_stamp=$(date -u +%Y%m%dT%H%M%SZ)
set -o noclobber
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml exec -T db   pg_dump -U stage4c_rehearsal_owner -d workshopos_staging -Fc   | age -r "$WORKSHOPOS_BACKUP_RECIPIENT" -o "$WORKSHOPOS_BACKUP_DIR/workshopos-staging-$backup_stamp.dump.age"
sha256sum "$WORKSHOPOS_BACKUP_DIR/workshopos-staging-$backup_stamp.dump.age"
```

Use a **new timestamped destination** each time; do not overwrite a prior backup. Retain scoped role/ACL definitions and independent secret-manager recovery. `pg_dump` does not include cluster-global roles. Never use a shared-cluster `pg_dumpall` containing other applications' credentials. Restore into a new isolated PostgreSQL 17 database/volume, recreate only Workshop OS roles, restore with `--no-owner --exit-on-error`, compare all table/sequence/media hashes, then verify fresh login and business reads before changing Workshop OS configuration. No `--clean` against a current database.

`verify_restore_local.py` implements a real isolated local restore and never deletes existing resources. It intentionally rejects non-local Docker endpoints, existing target containers and existing target volumes. Rehearsal dumps are local protected recovery artifacts, not publishable files. Production backups need off-host encryption/retention and scheduled restore drills in addition to this local proof.

Retain previous image digests, original frontend deployment, configuration, database checkpoint, and media/custody manifests. A code rollback alone cannot reverse schema or subsequent writes. Use compatible older code only if schema compatibility is established; otherwise restore to a new database, reconcile later audited writes and switch only Workshop OS configuration. No automatic Alembic downgrade is provided. Estimate downtime from a timed full-size drain/backup/restore/verification rehearsal; no safe duration is promised from this small demo dataset.

## Acceptance boundary

Prepared executable checks: `test_runtime_config.py`, `validate_package.py`, `validate_release.py`, `test_local_browser.mjs`, `verify_restore_local.py`; read-only host/DB inventory scripts are included. Browser tests are explicitly local-only and use dedicated accounts/contexts. Stage 48's financial/inventory concurrency, dashboard/export, cross-module and 37-state visual suites remain the detailed regression reference; do not retarget their mutation scripts to a shared remote database or bypass their guards. Extend a separately disposable deployment clone before running the complete acceptance matrix.

Activation prerequisites: approval of this isolated topology; measured peak resource/disk headroom; immutable artifact transfer verification; private access credentials and unique account secrets; Linux secret permissions; reviewed candidate-only cutover; real-host TLS/session/health checks; approved backup retention/location and restore operator; historical exception acceptance; adjudication of four retained rasterization differences and broader responsive coverage. No remote activation recommendation overrides these gates.

References: [Docker network isolation](https://docs.docker.com/reference/compose-file/networks/), [Compose secret mounts](https://docs.docker.com/compose/how-tos/use-secrets/), [PostgreSQL backup/restore](https://www.postgresql.org/docs/17/backup.html), [cluster-global role backup](https://www.postgresql.org/docs/17/app-pg-dumpall.html).
