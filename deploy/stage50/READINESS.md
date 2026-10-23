# Stage 50 - activation gates and hostname cutover proposal

Preparation only. No remote changes, DNS updates, image transfers or activation are authorized by this stage. The approved target is the existing Hetzner host, not Vercel hosting. This document supersedes the hostname/cutover sections of the Stage 49 runbook; its isolated Docker, initialization and recovery design still applies.

## DNS authority and exact proposed record

Read-only queries on 23 October 2026 confirmed `ns1.vercel-dns.com` and `ns2.vercel-dns.com` are authoritative for `nexiohyper.com`. Both return Vercel A answers for `workshopos.nexiohyper.com`: observed answers vary among `64.29.17.1`, `64.29.17.65`, `216.198.79.1`, `216.198.79.65`, TTL 1800. Neither returned a hostname AAAA or CNAME answer. Apex CAA permits letsencrypt.org, pki.goog and sectigo.com. A deliberately nonexistent subdomain returned similar A answers: wildcard synthesis is possible. DNS alone cannot establish whether an explicit Workshop OS record or Vercel project domain association exists. The Vercel zone UI/API must be reviewed before mutation; there is no connected Vercel administration tool in this session.

After readiness passes and explicit cutover approval, in Vercel DNS for `nexiohyper.com`, prepare:

| Field | Value |
|---|---|
| Type | A |
| Name | workshopos |
| Value | 89.167.40.86 |
| Proposed TTL | 300 seconds, if accepted by the zone UI |

Create an explicit record if the current answer is inherited from a wildcard. If explicit `workshopos` A/CNAME records exist, replace only those conflicting records after recording their exact prior values. Do not delete wildcard, apex, mail, other subdomain or unrelated project records. No AAAA is proposed because this target's IPv6 routing has not been validated. If an AAAA appears at cutover, review it before proceeding. Preserve the old DNS values and zone metadata for rollback. Existing caches may retain the prior answer for its 1800-second TTL even after lowering TTL.

Vercel remains DNS management only. No Vercel application deployment or unrelated project change is proposed. See [Vercel DNS management](https://vercel.com/docs/domains/managing-dns-records).

## HTTPS, API and secrets

The existing shared Caddy owns ports 80/443 and has persistent `/data` and `/config` volumes. The old `workshopos-staging.nexiohyper.com` route remains untouched. Its publicly verified TLS 1.3 certificate is from Let's Encrypt, valid September 22-December 21, 2026; this does not certify the NEW hostname on Hetzner.

The proposed independent site block is in [Caddyfile.workshopos.proposed](Caddyfile.workshopos.proposed):

```caddyfile
workshopos.nexiohyper.com {
    reverse_proxy workshopos-stage49-frontend:8080
}
```

This site block passed local Caddy adaptation/validation with networking disabled. The final combined shared configuration must still be validated before an authorized reload. Existing blocks, mounts, network membership and TLS storage must be preserved. No restart/recreation of shared Caddy is permitted. With the new A record resolving to Hetzner, public 80/443 reachable and persistent certificate storage, Caddy can obtain/renew the new hostname certificate using ACME. Root CAA permits Let's Encrypt. Certificate issuance/renewal cannot be proved for this new host before the approved cutover; do not request a certificate against the current Vercel route. See [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https).

Set `WORKSHOPOS_STAGING_ORIGIN=https://workshopos.nexiohyper.com`. Compose passes this as exact `SLICE_ORIGIN`; keep `SLICE_STAGE=staging`, `SLICE_PREFILL=false` and `SLICE_DATABASE_URL_FILE=/run/secrets/runtime_url`. No wildcard Origin or cookie Domain is needed. Existing Secure/HttpOnly/SameSite=Lax sessions, host-only cookies and Origin/CSRF checks remain. Manual login and the private HTTPS access gate use new credentials; local development prefill is unchanged. No host ports are added by the candidate.

Required deployment setting names: `WORKSHOPOS_API_IMAGE`, `WORKSHOPOS_FRONTEND_IMAGE`, `WORKSHOPOS_STAGING_ORIGIN`, `WORKSHOPOS_PROXY_NETWORK`, `WORKSHOPOS_SECRETS_DIR`, `WORKSHOPOS_SOURCE_SQLITE`. Secret file names: `owner_password`, `runtime_password`, `runtime_url`, `accounts.json`, `access_htpasswd`. Backup setting names: `WORKSHOPOS_BACKUP_RECIPIENT`, `WORKSHOPOS_BACKUP_DIR`; destination credentials depend on the unapproved provider and must not be invented.

Remote `/opt/workshop/stage49` and its secret paths were absent or inaccessible to the authorized operator. Therefore secret ownership/readability on Hetzner is NOT verified. After explicit provisioning approval, use an operator-only 0700 parent, individually mounted read-only files readable by the appropriate container UID (API/init 10001, Nginx 101, PostgreSQL image user). Verify modes/ownership without printing contents, then prove readability under those UIDs. Do not transfer the local rehearsal credentials as public staging credentials.

## Capacity and backup gates

Current capacity is suitable for a limited private candidate: four CPUs, ~5195 MiB available RAM, 36 GiB free disk. Historical samples October 15-23 show minimum idle CPU 79.06% and minimum available memory 5,264,236 KiB. The configured candidate ceiling is 2 CPUs and 1664 MiB, leaving approximately 3.4 GiB of sampled available memory at that ceiling. Ten-minute samples do not bound short spikes or future tenant growth. Existing services mostly lack limits; retain monitoring and do not build images on the host. Budget at least 10 GiB free beyond existing use for candidate images, small demo database/WAL, local backup and independent restore copy; measure actual data growth and reserve more for media. Do not prune or reclaim other apps' storage.

Off-host backups are a blocking gate. No Workshop OS destination, access policy, encryption recipient, retention or recovery owner has been approved/verified. The visible backup timer is the OS dpkg metadata backup, not a database backup. No destination write/read test or transfer occurred. Do not treat local Docker volumes or a local dump as off-host recovery.

Exact approval needed: choose a destination outside this server and its region/account ownership; authorize a Workshop OS-only repository/bucket/prefix and least-privilege writer/restore access; supply an encryption public recipient and assign custody of its private recovery key through an approved secret channel; approve retention, alerts, recovery owner and restore drill; authorize credentials installation, scheduled encrypted uploads and a restore test. Proposed policy for review only: nightly backups, 7 daily/4 weekly/3 monthly retention, pre-migration checkpoints, failure alerting, monthly restore rehearsal. No retention policy is currently accepted or implemented.

A consistent database backup includes durable media bytes, documents, provenance and custody tables. Preserve scoped role/grant definitions and secret recovery separately. The Stage 49 backup pipeline and fresh-volume restore procedure remain applicable; do not use cluster-wide dumps of other applications. A later off-host restore test must retrieve/decrypt the actual encrypted object and reconcile tables, sequences and media; local restore success is only one part of this gate.

## Exact candidate activation sequence - future authorization only

Prerequisites: all report blockers closed, approved off-host recovery destination verified, final immutable images reviewed, new secrets provisioned and permissions tested, clean release manifest recorded, original source hash matched, shared proxy diff reviewed, and DNS zone state exported. No commands below were run remotely.

1. Transfer the reviewed Stage 49 image archive, source manifest and deployment files into a new `/opt/workshop/stage49/` release directory using the authorized channel. Verify the archive SHA256 and image IDs against the report. Do not overwrite the old `/opt/workshop/staging/source` deployment.
2. Populate `staging.env` from this directory's example with the NEW origin and immutable image IDs; provision new secret files outside the release/build context. From the new release root:

```sh
docker load -i workshopos-stage49-images.tar
python3 deploy/stage49/validate_release.py --env-file staging.env
docker network inspect workshopos-staging-proxy >/dev/null
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml up -d --wait db
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml -f deploy/stage49/compose.initialize.yaml run --rm -T initialize
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml up -d --wait api frontend
docker compose --env-file staging.env -p workshopos-stage49 -f deploy/stage49/compose.yaml ps
```

3. Verify head 53, all 67 quarantines, all 51 discrepancies, counts, restricted runtime role, private access gate, health, PostgreSQL persistence and a recoverable database/media checkpoint. Prove the approved off-host upload/retrieval/restore process before public cutover.
4. Record existing container lifecycle identities, Caddy/DNS snapshots and previous image IDs. Under separate cutover authorization, add ONLY the proposed new Caddy site block, validate the complete configuration, and use the existing operator's graceful reload procedure. Do not restart/recreate the shared proxy. The old Workshop OS hostname and all other sites remain unchanged.
5. Apply ONLY the reviewed Vercel `workshopos` record change. Verify authoritative answers on both nameservers and public resolution. Caddy may retry ACME until DNS propagation; plan a maintenance window rather than promise zero TLS downtime.
6. Require a valid publicly trusted certificate for the new hostname, HTTP-to-HTTPS redirect, private access denial without credentials, secure sessions, wrong-Origin/missing-CSRF rejection, seven-role login/logout, documents/media and cross-session writes. Recheck unrelated service identities and routing blocks.

## Rollback and stopping condition

Retain the old frontend, prior image IDs, Caddy/DNS snapshots, source manifest, database/media checkpoint and recovery credentials. On cutover failure, restore only the exact Workshop OS DNS/site-block state under rollback authorization; DNS caches may delay recovery. Existing `workshopos-staging` is not repurposed. Never downgrade/reset a database to match an older image. Use compatible older code only with verified schema compatibility; otherwise restore a checkpoint into new isolated storage, reconcile later writes and switch only Workshop OS configuration. Do not discard writes made after the checkpoint. Downtime must be measured; the small local demo rehearsal does not establish an RTO.

Overall recommendation remains NO-GO until the unresolved report gates are closed and the user authorizes activation. No remote mutation is part of Stage 50.
