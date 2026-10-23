# 51 — Private Hetzner deployment and testing

**GO for continued private staging testing. NO-GO for public hostname activation.** The user explicitly authorized this limited deployment while deferring Hetzner Object Storage/off-host backups. Four isolated containers are running. No DNS, shared Caddy, unrelated application, original database volume or approved frontend was changed. No commit or push was performed.

Use the [private access and recovery runbook](../../deploy/stage51/READINESS.md). Evidence is retained under `.scratch/stage51/`; it contains protected recovery artifacts and must not be published wholesale.

## Preflight and release

Read AGENTS.md and Stage 49/50 documentation; consulted Graft. Branch `Prem-dev-fbb-Go21`, HEAD `158f092d90b229e0148d0216b91d3f4f0d426079`. Approved frontend baseline `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7` exists. All 1,233 checkpointed source/configuration files remain byte-identical to the Stage 51 preflight, including pre-existing uncommitted changes. HEAD alone does not describe the release: immutable images contain the previously verified Stage 49/50 work.

`prem` access to `/opt/workshop/stage49` was verified through its existing scoped ACL. Secrets are outside that shared writable directory, under `/home/prem/.workshopos-stage51/secrets`, with parent mode 0700. New owner/runtime passwords, application account passwords and private-gate credentials were generated on the server; no rehearsal credentials were installed remotely. Individual Docker secret mounts were checked for the required container UIDs. The operator credential file is mode 0400. No secret values are in this report or Git.

Application image IDs match the verified artifacts:

- API: `sha256:8de208f43c9ef04838749ef8140610707ba0cafdfe6a3379dcbef9edb90317e4`
- Frontend: `sha256:0372e0d9bb883590e51d48e1159f401e417e1c6eb1ea2051976bf8bb0acdcae2`

The transferred image archive SHA256 was verified before loading. No host image build, cleanup or pruning occurred. PostgreSQL 17 and the private Caddy gateway are also digest-pinned.

## Deployment and initialization

Project `workshopos-stage51` runs:

| Container | Result |
|---|---|
| `workshopos-stage51-db-1` | Healthy; new dedicated PostgreSQL volume; no published port |
| `workshopos-stage51-api-1` | Healthy; readiness HTTP 200; restricted runtime role |
| `workshopos-stage51-frontend-1` | Healthy; private access gate; no published port |
| `workshopos-stage51-private-https-1` | Running; verified TLS; only `127.0.0.1:18551` published |

The database/app/proxy networks are dedicated and internal. Only the private gateway joins its additional ingress bridge. None joins shared Caddy's networks. The final Compose configuration validates. An external connection attempt to the public IP on port 18551 failed, consistent with the verified loopback-only Docker binding.

Initialization checked an empty target, applied migration head `20261022_0053`, imported 3,241 source records, retained 67 quarantines, seven historical stock records, 242 historical financial records and 51 invoice discrepancies, verified replay/idempotency, and configured ten approved account identities with new passwords. Source SHA256: `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`.

Initial startup issues were resolved within new Stage 51 resources only: the importer required read permission on the copied read-only SQLite; the target was confirmed empty before retry. The official Caddy executable required its file-capability bounding bit. Docker did not publish a port for the gateway on an internal-only network, so a dedicated ingress bridge was added for that gateway. No volume was reset and no unrelated container was recreated.

## Private access and functional results

Private URL: **https://localhost:18551**, through the documented SSH tunnel. The final public hostname remains unused by this candidate. The certificate is trusted explicitly by certificate file/SPKI pin; HTTPS, Secure/HttpOnly/SameSite cookies, exact Origin checks and CSRF were not disabled. Anonymous access returns 401. Private TLS certificate lifetime is 30 days.

**16 suites passed; zero final suite failures:** authentication/seven roles, suppliers/purchases/stock, invoices/payments, estimates/documents/media, bookings/check-in, reception/job intake, vehicles, historical ownership, approvals, financial edge cases, catalog, checklists, sales, administration, settings, and dashboards/reports.

Tests exercise real FastAPI/PostgreSQL mutations and independent browser sessions. Coverage includes manual login/logout, session persistence, CSRF/Origin rejection, role-specific authorization, idempotent customer and inventory operations, settlement/closure, invoice/receipt/gate-pass PDFs, document snapshots, media upload/edit/archive and cross-session reads. Normal application mode was used; SQL.js/SQLite requests and browser business fallback are rejected by the authentication smoke assertions.

Two initial browser failures were test synchronization issues across SSH: supplier edit ran before dialog values initialized, and media rendering was checked before image decoding. Stage 51 adapters now wait for those conditions, preserve the original business assertions and add supplier-value checks. Successful retry evidence and initial failure logs are retained. No application code or baseline screenshots were changed. Test records, including failed-attempt records, remain in this isolated staging database.

Type/syntax checks for the new Python/JavaScript deployment helpers passed. Existing application build/unit/backend evidence was reused for the exact unchanged images; those entire suites were not falsely reported as rerun remotely. Stage 50 visual evidence also remains applicable only to its documented coverage and rasterization/date differences. Stage 51 did not perform a new full pixel-baseline comparison; all 94 preserved baseline images are unchanged. Public visual acceptance remains conditional as documented in Stage 50.

## Integrity and recovery

Post-test reconciliation verified:

- All 3,241 custody records exact; all 67 quarantines intact.
- All 242 imported financial records exact; original invoice values/discrepancies retained and historical read-only protections exercised.
- Seven original stock records exact; original item balances remain 500, 79, 60 and 3.
- All eight original SQLite files unchanged.

A consistent new dump was restored into **new local** container/volume `workshopos-stage51-restore-verified`, with network disabled. All **120 table fingerprints**, sequence values, durable media/document contents and restricted runtime role attributes matched. Table/routine grants and effective schema grants matched. The first raw ACL comparison differed only because an explicit owner grant was represented by PostgreSQL's equivalent default ACL after restore; effective-grant comparison resolved this without changing database permissions.

Verified local dump SHA256: `cb5b5d70a4de028692c00eb3caac4beecd9a92c5688f8203f7dc23041bfd8370` (1,443,398 bytes). Recovery artifacts are in the restricted local `.scratch/stage51` directory. The remote pre-test initialization dump and a post-test dump/TOC are retained under `/home/prem/.workshopos-stage51/recovery` with restrictive permissions. Post-test remote dump SHA256: `690f9ffbddee5df5adfed0d25c0a599ea18ee7a1b117a07d32a6ec24b1550f2a`. This separately generated archive was TOC-validated; the local archive above is the one used for full restore verification.

Previous image/configuration references and the pre-deployment source/data checkpoint are preserved. Withdrawal stops only this exact Compose project and retains volumes/images. Database rollback requires a fresh-volume restore; image rollback alone is insufficient. No recovery operation overwrote the running database. No off-host backup service, encryption custody, scheduling or retention deletion is claimed or enabled.

## Existing-service preservation and capacity

Final checks matched all 17 original container IDs, image IDs, start times and restart counts. Both shared Caddy file hashes are unchanged. Existing containers remain running and configured health checks report healthy; applications without health checks were not certified through new end-to-end testing. No production database contents were queried.

Final snapshot: 4 CPUs; 7,746 MiB total RAM, 4,983 MiB available; 35 GiB disk free; load 0.64/0.42/0.35. Candidate memory limits total approximately 1.75 GiB. This supports limited private functional testing, not a guaranteed production peak-capacity assessment.

## Files and next action

New files only for this stage:

- `deploy/stage51/compose.private.yaml`, `Caddyfile.private`
- `deploy/stage51/provision_private.py`, `browser-support.mjs`, `prepare_runners.py`, `verify_remote.py`
- `deploy/stage51/release.json`, `READINESS.md`
- This report and local `.scratch/stage51/` checkpoints/test evidence

No backend, frontend, database schema or approved workflow implementation changed. Existing uncommitted work remains preserved. Graft generated context may refresh as deployment files are indexed.

Continue private testing through the tunnel. **Do not activate the public hostname yet.** Remaining public gates are approved encrypted off-host backup/retrieval/restore and custody, final visual acceptance, a separately approved DNS/shared-proxy cutover, public TLS validation, and current capacity/credential review. DNS, Vercel deployment and shared Caddy were left untouched.
