# Stage 52 — reviewed hostname change, awaiting approval

**Do not save DNS changes or reload shared Caddy without the user's next explicit approval.** The authorized preparation rotated application/gate credentials, revoked sessions, validated the full proposed proxy configuration and verified recovery. No public hostname activation has occurred.

## Exact DNS change

Authorized Vercel identity: `intelligriptechnologies-1092`, scope `nh-1809` (NH). The complete 13-record zone was retrieved with no remaining pagination. There is no explicit `workshopos` A, AAAA or CNAME record. It inherits `* ALIAS cname.vercel-dns-017.com.` (configured TTL 60; observed public A TTL 1800).

Prepare exactly one new record:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | workshopos | 89.167.40.86 | 300, if accepted |

No wildcard deletion or replacement is needed. Preserve `workshopos-staging`, all other records and all Vercel projects. The accessible NH project is `nexiohyper-website`; its domains are `nexiohyper.com`, `www.nexiohyper.com`, and `nexiohyper-website.vercel.app`. The Workshop OS alias lookup returned 404 in this scope. This is not a claim about inaccessible Vercel accounts. No project-domain association is being removed.

Before saving, re-read the zone and compare with `.scratch/stage52/dns-before.json`; stop on a new conflicting `workshopos` record. After approval, the reviewed CLI operation is:

```powershell
vercel api /v2/domains/nexiohyper.com/records --method POST --scope nh-1809 -f name=workshopos -f type=A -f value=89.167.40.86 -F ttl=300
```

The explicit TTL uses the [documented Vercel record API](https://vercel.com/docs/rest-api/dns/create-a-dns-record); `vercel dns add --help` does not expose a TTL flag. This POST has NOT been executed.

Record the returned new record ID for narrow rollback. Validate accepted TTL and authoritative answers on both Vercel nameservers. Previously cached answers may remain for 1800 seconds; do not promise instant propagation.

## Security and private verification

All 11 existing application passwords and the private gate password were replaced with new random values. Account identities, roles and archived status were preserved. All 28 existing sessions were revoked. Old gate authentication, an old admin password and a pre-rotation session were rejected. New values are under `/home/prem/.workshopos-stage51/secrets`, protected by mode-0700 parents; operator credential metadata is mode 0400. Individually mounted secret files remain readable only through their required container mounts. No credential values/hashes are included here.

The mounted gate file was updated in place so Nginx sees the new credential without recreating the container. The brief rewrite fails closed. No service reload was needed for rotation. The rotated account file includes the additional staging-test account; all seven operational roles authenticated successfully. Prefill remains disabled. Secure cookies, Origin/CSRF rejection, logout, role checks, media and cross-session PostgreSQL writes passed the private smoke suite.

The current Origin remains `https://localhost:18551`. At approved activation, apply `compose.hostname.yaml` to set the single exact Origin to `https://workshopos.nexiohyper.com`; do not accept arbitrary/both Origins to conceal a test failure. This recreates only the Workshop OS API. Existing private-origin writes will then correctly fail Origin checks; use the public hostname once trusted TLS is available.

## Caddy candidate and operator requirement

Candidate directory on Hetzner: `/opt/workshop/stage49/stage52-candidate`.

- `Caddyfile.before`: unchanged shared configuration snapshot.
- `Caddyfile.candidate`: the entire prior file plus only the site below.
- `cbs.shared-host.caddy`: unchanged imported configuration.
- `compose.hostname.yaml`: planned Workshop-only Origin/network overlay.

```caddyfile
workshopos.nexiohyper.com {
    reverse_proxy workshopos-stage49-frontend:8080
}
```

The complete candidate passed `caddy validate` using the exact shared-proxy image in a disposable network-disabled container with temporary storage. The live proxy and its TLS storage were not involved in that validation. `prem` cannot write `/opt/barstock/deploy/Caddyfile.production` and noninteractive sudo is unavailable. **An authorized administrator such as amlan must apply the reviewed file after approval. Do not bypass these filesystem permissions through Docker.**

Only the Workshop frontend was connected to `workshopos-staging-proxy`, with alias `workshopos-stage49-frontend`. Existing memberships remain intact. The current proxy can resolve/reach that alias: `/health` returns 200; anonymous `/` returns 401. No route to it has been loaded. The overlay persists the added frontend membership for subsequent Compose operations.

## Approved-activation sequence — NOT executed

1. Obtain explicit user approval for DNS save, the administrator's shared-Caddy edit/graceful reload, and the Workshop-only Origin switch. Confirm administrator availability before starting. Recheck secrets, health, capacity, checkpoints and zone/config drift.
2. From the release directory, change only Workshop API Origin with the reviewed overlay:

```sh
cd /opt/workshop/stage49/stage51-release
docker compose --env-file private.env -p workshopos-stage51 -f deploy/stage49/compose.yaml -f deploy/stage51/compose.private.yaml -f /opt/workshop/stage49/stage52-candidate/compose.hostname.yaml up -d --no-deps api
```

3. Administrator verifies the live shared file still matches the preserved snapshot and the candidate matches the reviewed manifest. Retain the original file, ownership and permissions. Write the reviewed contents into the existing mounted file (preserve its inode), then gracefully reload; no proxy restart/recreation:

```sh
cmp /opt/barstock/deploy/Caddyfile.production /opt/workshop/stage49/stage52-candidate/Caddyfile.before
sudo tee /opt/barstock/deploy/Caddyfile.production < /opt/workshop/stage49/stage52-candidate/Caddyfile.candidate > /dev/null
docker exec barstock-production-proxy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

4. Save only the reviewed explicit A record. Observe authoritative propagation, public HTTPS issuance/chain/hostname validity, HTTP redirect and private-gate rejection. Certificate issuance may retry while old DNS is cached. Do not claim successful activation before trusted public HTTPS works.
5. Verify new-credential login, seven roles, secure sessions, CSRF/Origin, PostgreSQL business writes/cross-session reads and media/documents. Recheck original service identities, health, routing and network memberships. Save the exact record ID and activation evidence.

## Recovery and rollback

Remote protected checkpoints: `/home/prem/.workshopos-stage51/recovery/stage52/pre-rotation.dump` and `post-rotation.dump`, with TOC validation. Local `.scratch/stage52/restore-verified/database.dump` was restored into new network-disabled container/volume `workshopos-stage52-restore-verified`. All 120 table fingerprints, sequences and media/document contents matched. Runtime/table/routine/schema permissions were compared.

An additional database ACL check found that pg_dump without database creation does not restore database-level grants. Stage 52 recovery now explicitly restores the established policy on the **disposable local target only**:

```sql
REVOKE CONNECT,TEMPORARY ON DATABASE workshopos_staging FROM PUBLIC;
GRANT CONNECT ON DATABASE workshopos_staging TO slice_auth;
```

Then compare effective database grants with the source. The live database was already correctly restricted and was not changed by this correction. Database-role passwords require separate protected custody; pg_dump does not back up them. Never reinstate exposed passwords/sessions from the pre-rotation checkpoint.

On hostname failure, retain all current Workshop data/media and writes. Restore only the newly added site block and new DNS record (using its recorded ID), subject to config-drift checks; preserve every unrelated route/record. The administrator gracefully reloads the preserved configuration. Restore private Origin using the prior Compose files and recreate only the Workshop API. Do not restore an older database merely to reverse DNS/routing, reset volumes, or re-enable exposed credentials. Account for DNS caches.

Off-host Object Storage remains deferred and unverified; local checkpoints are not an off-host backup claim. No retention deletion is enabled.

## Evidence and changes

`.scratch/stage52/` contains protected zone/project snapshots, rotation metadata, auth results, data reconciliation, configuration validation, manifests, pre/post service snapshots and restore results. No application/frontend/schema code changed. Original source SQLite and all prior uncommitted work remain preserved. No commit/push. Public activation and trusted-new-host TLS verification remain pending explicit approval and administrator execution.
