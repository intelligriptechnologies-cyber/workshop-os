# 49 — Staging deployment preparation on existing Hetzner

Prepared and locally verified an isolated FastAPI/PostgreSQL staging candidate for the **existing** Hetzner server. **No remote deployment, DNS change, database mutation, service restart or proxy reload occurred. The agent did not commit or push.** Activation remains a separate authorization boundary.

The [deployment runbook](../../deploy/stage49/READINESS.md) contains the infrastructure inventory, topology, secrets inventory, exact candidate deployment commands, proxy cutover prerequisites and backup/rollback procedure. [Sanitized evidence](stage8-staging-preparation-evidence.json.md) records the file inventory and local results.

## Preflight and preservation

Branch `Prem-dev-fbb-Go21`; initial HEAD `adb37f2f49b7201aaa5ed57b726db9d39426d349`; final observed HEAD `158f092d90b229e0148d0216b91d3f4f0d426079`; approved frontend `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Read AGENTS.md, the migration index and reports 45–48; consulted and refreshed Graft.

Stages 47/48 were already staged but uncommitted at task start. The agent did not change their index or create a commit. During the task, HEAD advanced to `158f092` (the Stage 47/48 retirement checkpoint); the final index is empty and Stage 49 changes remain unstaged/untracked. `.scratch/stage49-checkpoint/` preserves 1,203 tracked files, SHA256 manifest, status and the original staged binary patch. Stage 48 test evidence and all Stage 48 recovery archive/dump hashes were verified. No original source database or recovery archive was modified; eight SQLite copies and 94 approved screenshots still match their preservation hashes. Do not identify this uncommitted candidate solely by HEAD: retain its source/context manifest and immutable image identifiers as well.

## Existing host and recommendation

Authorized read-only SSH verified host `nexiolabs`, Ubuntu 26.04/x86-64, Docker 29.8.0 and Compose 5.5.1. It runs 17 containers across Barstock production/staging, client billing production/staging, Cowork ERP staging/trial access and the old Workshop OS frontend. The full inventory is in the runbook.

The shared Caddy container owns public 80/443 and already routes the Workshop OS hostname to `workshopos-frontend:80` over `workshopos-staging-proxy`. Other routes and applications remain untouched. Read-only queries inspected only metadata in three non-production PostgreSQL containers: Barstock staging 18.6, billing staging 16.15 and Cowork 18.6. No Workshop OS roles existed there. Production database contents were not queried.

Recommend a **separate PostgreSQL 17 container on this same server**, using an independent volume, internal network and credentials. Existing instances are application-owned, differ from Workshop OS's validated PostgreSQL major version, and would couple role/migration/backup maintenance with other applications. Reuse is not ruled out forever, but requires a separate compatibility and DBA isolation review; it is not safe to assume today.

Capacity snapshot: 4 CPUs, 7,746 MiB RAM/~5,191 MiB available, no swap, ~36 GiB free disk. Candidate limits total 2 CPU and 1.625 GiB memory. This is plausible for private staging, **not peak-capacity approval**: many existing containers are unlimited, and historical CPU/I/O peaks and backup growth remain unverified. Build off-host and reserve headroom before activation.

## Configuration and implementation

`deploy/stage49/compose.yaml` defines only candidate frontend, API and database services. No host ports are published. The frontend uses the unique alias `workshopos-stage49-frontend:8080`; it cannot accidentally replace the live route. API/database networks are internal. PostgreSQL is persistent; API/frontend filesystems are read-only with bounded tmpfs, dropped capabilities and resource limits. There is no shared Docker socket or privileged container.

`Dockerfile.api`, `Dockerfile.frontend` and `prepare_context.py` create allowlisted build contexts with digest-pinned base images, npm lockfile installation, exact Python dependency versions and the full established migration chain. Original SQLite, generated credential fixtures and recovery artifacts are excluded from images. SQL.js remains development-only, with no runtime module/WASM in the frontend build. `validate_release.py` rejects unpinned images and published/privileged services; the unresolved example intentionally fails this gate.

`nginx.conf` proxies all API operations to FastAPI and never returns static local-login configuration or SPA HTML for missing API routes. It protects staging with an independent HTTP Basic access gate over HTTPS and rate-limits login. Source database/env/dump paths are denied. Secure sessions, exact Origin and CSRF protections remain in FastAPI. Staging explicitly disables demo prefill; local development login dropdown/prefill is preserved.

Backend changes are limited to `backend/customer-slice/api.py` and new `runtime_config.py`: explicit fixed staging target and secret-file support, bounded connection pool/timeouts, and a database/migration readiness endpoint. Existing local dev/test target restrictions remain. No new schema migration or business workflow was introduced.

Two protected frontend data modules changed: `src/db.ts` and `src/developer-control-plane.ts`. A production bundle scan found a legacy recovery password literal retained despite the dormant local path. Production builds now omit it while local recovery fixtures retain their behavior. No page component, layout, CSS, form, label, dialog, navigation, document template or calculation changed. The private infrastructure access gate is separate from the approved application screen.

## Database initialization and media

`compose.initialize.yaml` and `initialize.py` perform an explicit **empty dedicated staging target only** initialization. They do not run on API startup and refuse a nonempty target. The approved SQLite is mounted read-only and verified by hash. Alembic applies through 37, the established importer preserves custody and verifies idempotent replay, then the remaining slice migrations apply through 53. Identity sequences are synchronized by the importer. All ten approved source users receive unique new hashed staging passwords; demo passwords are rejected and no sessions are copied. Provisioning links are audited against the provisioned administrator, without rewriting historical custody actors.

The required historical migration-owner role name is confined to the new dedicated cluster with a new secret. The API receives only restricted `slice_auth` credentials, with explicit `workshopos_runtime` role assumption; it receives no owner password. Secret names, file mounts and Linux ownership/readability requirements are documented in the runbook. Credentials are not committed or embedded in frontend assets.

Media/document bytes currently reside transactionally in PostgreSQL, including `slice_media_content`, purchase attachment content and document snapshots. The PostgreSQL volume and database backups therefore preserve both bytes and provenance. No unsupported filesystem/object-store migration was added.

Fresh initialization and post-browser reconciliation preserve:

- **3,241 custody records, byte-equivalent to the preserved import, including all 67 quarantines**;
- **242 imported financial rows compared against their custody snapshots**, with all 51 invoice discrepancies retained;
- **all seven historical stock rows** and original on-hand balances **500, 79, 60 and 3**;
- historical financial read-only restrictions and original source identifiers/provenance.

Historical checklist identity gaps, two imported bookings plus two booking events, department/manager custody, stock compatibility history, missing original media bytes and unknown user-browser records remain the documented Stage 48 boundaries. No fabricated relationships or financial corrections occurred.

## Local verification

| Check | Result |
|---|---|
| Stage 48 checkpoint | Recorded 248 unit, 16 API invocations, 20 workflow suites and seven-role production smoke verified as prior evidence; not relabelled as Stage 49 execution |
| Production image builds and TypeScript | Both images built successfully from pinned bases/allowlisted contexts |
| Unit regression after protected-module changes | **248 passed, 0 failed** |
| Runtime configuration | **2 test methods passed**, including multiple rejected stage/origin/target/credential configuration cases |
| Package inspection | No SQL.js production dependency, SQLite/WASM artifacts or known demo-password literals; normal-mode manifest verified |
| Deployment configuration | No published ports; isolated database; resource limits; unique candidate alias; immutable-image gate passes and rejects unresolved tags |
| Fresh initialization | Migrations through `20261022_0053`; import/replay/reconciliation passed; nonempty rerun refused before writes |
| Packaged local HTTPS | Frontend/API/database healthy through a disposable local Caddy gateway; private access gate enforced |
| Seven-role browser smoke | Manual login, Secure/HttpOnly cookies, reload/session persistence, API projections, logout, Origin/CSRF rejection and role-specific customer mutation denial passed |
| Real persistence | Browser customer create/replay and independent Reception-session read passed; media upload and independent-session byte download passed |
| Routing/fallback | Missing API route returns JSON 404; source SQLite route is denied; no SQLite/WASM requests or browser business-storage attempts observed |
| Full database restore | **120 table fingerprints and sequence values exact**, including newly uploaded media/document tables; restored runtime role remains restricted |
| Host safety | Final remote container IDs/images/start times/restart counters and proxy/old-deployment file hashes equal the recorded read-only checkpoint |
| Shell inventory collector | ShellCheck passed |

The local gateway uses a local CA and browser test contexts accept that test certificate. Public certificate-chain validation and real-host cookie/routing behavior remain activation checks. The local-only gateway is explicitly excluded from Hetzner configuration.

The complete financial/inventory concurrency, dashboard/export, cross-module and visual suites remain available from Stage 48, with execution gates listed in the runbook. This stage did **not** rerun all 20 workflow suites or all 37 visual comparisons against the new packaged stack. The new smoke verifies the deployment boundary, selected real writes and seven-role access; it is not exhaustive module acceptance. Do not bypass existing test guards to aim mutation runners at shared staging.

### Issues found and resolved during rehearsal

Local packaging exposed and corrected tmpfs YAML quoting, a secret target filename mismatch, a PostgreSQL format-parameter cast, missing migration SQL assets, the required provisioning audit actor, and Nginx temp paths under a read-only filesystem. Failed local initialization resources were preserved; subsequent initialization used new volumes, never a reset.

A browser test initially expected a flat customer response instead of the documented nested response; the assertion was corrected to that contract. Additional wrong-Origin probes initially exercised the rate-limited login endpoint and correctly received 429; they now test the authenticated customer endpoint without flooding login. The first restore probe raced PostgreSQL's temporary Unix-socket bootstrap server; readiness now checks the final TCP listener. The final runs passed. These are recorded as investigated failures, not hidden by replacement baselines or source-data edits.

## Visual status, backup and rollback

No Stage 49 screenshot comparison was performed. Stage 48 remains **33/37 exact**, with four maximum-channel-1 rasterization differences identical to Stage 47. Its 94 baseline images remain unchanged. Layout equivalence is not newly certified by build/smoke success; complete visual adjudication remains a release gate.

Unlike Stage 48's dump-list check, this stage performed a **real full restore into new isolated local storage**, comparing all 120 tables and sequence values, including media bytes. Original volumes were not restored over. Local dumps, manifests and test credentials stay under protected local scratch paths and are not publication artifacts. Remote encrypted off-host scheduling, retention, backup alerts and full-size restore timing still require operator configuration/approval.

Rollback retains previous immutable frontend/API images, source/configuration manifests, the old frontend deployment and a database/media checkpoint. Code rollback is permitted only across compatible schema; otherwise restore into a new database, reconcile later audited writes and switch only Workshop OS configuration. There is no destructive downgrade/reset procedure. Expected downtime depends on the measured drain, backup/restore, verification and candidate-only cutover; the small local demo restore does not establish a production recovery objective.

## Activation recommendation and stopping point

Recommend this **isolated private staging candidate**, subject to explicit authorization and the runbook gates: peak capacity/backup headroom, immutable artifact transfer, unique secrets/Linux file permissions, protected reviewer access, candidate health checks, minimal Workshop OS-only Caddy upstream diff, real-host TLS/session verification and historical/visual exception acceptance. No new server or DNS change is required by the proposal.

The existing CI deploy/start/stop workflows still describe the old frontend deployment and were not modified or invoked. They must not be used as the activation mechanism for this candidate. The documented future candidate commands never stop/recreate unrelated services or reuse the existing live frontend alias. A shared-proxy route edit/reload remains outside this task and needs separate authorization.

**Stage 49 preparation stops here. Remote activation has not occurred.**
