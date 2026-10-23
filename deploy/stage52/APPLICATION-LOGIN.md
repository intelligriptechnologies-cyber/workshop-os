# Workshop OS — Basic gate removed

The user explicitly approved removing only the extra HTTP Basic gate. Normal Workshop OS authentication remains mandatory. This supersedes earlier runbook requirements to keep the Basic gate enabled; no DNS or shared Caddy change is part of this operation.

## Exact changes

The immutable frontend image originally contains these server-level directives in `/etc/nginx/nginx.conf`:

```nginx
auth_basic "Workshop OS private staging";
auth_basic_user_file /run/secrets/access_htpasswd;
```

`nginx.application-login.conf` replaces those two lines with `auth_basic off;`. All other Nginx directives, including login rate limiting, API forwarding and response headers, are retained. `compose.application-login.yaml` mounts that configuration read-only. The existing gate credential file remains preserved for rollback but is no longer referenced by Nginx.

Inspection also found FastAPI still configured for `https://localhost:18551`, although the public hostname and www redirect had been configured by the operator. Applied the previously approved `compose.hostname.yaml` setting `SLICE_ORIGIN=https://workshopos.nexiohyper.com`. This fixes public login without relaxing Origin or CSRF checks. Hosted prefill remains disabled.

Only the Workshop frontend and API containers were recreated. Their immutable images, resource/security settings, networks and secret references are preserved. PostgreSQL and the private HTTPS gateway were not restarted. No frontend assets, forms, application code, accounts, passwords or schema changed. The original frontend image remains available for rollback:

`sha256:0372e0d9bb883590e51d48e1159f401e417e1c6eb1ea2051976bf8bb0acdcae2`

## Deployment files and persistence

Remote configuration lives under `/opt/workshop/stage49/stage52-candidate/`. Keep the new Nginx file mode 0444: inherited host ACLs initially prevented container UID 101 from reading the copied file. Deployment began before that validation failure was handled, causing a brief Workshop frontend startup failure. Correcting only the new file's permissions made validation pass and allowed the frontend to recover. No unrelated service was affected by a restart or recreation.

The active configuration must include BOTH hostname and gate-removal overlays:

```sh
cd /opt/workshop/stage49/stage51-release
docker compose --env-file private.env -p workshopos-stage51 \
  -f deploy/stage49/compose.yaml \
  -f deploy/stage51/compose.private.yaml \
  -f /opt/workshop/stage49/stage52-candidate/compose.hostname.yaml \
  -f /opt/workshop/stage49/stage52-candidate/compose.application-login.yaml \
  ps
```

Omitting the final overlay from a future frontend deployment restores the old image's Basic gate. Do not accidentally revert the public API Origin to the private tunnel Origin. The tunnel remains useful for read-only access; application writes require the configured public Origin.

## Verification evidence

Evidence is under `.scratch/gate-removal/`; the before-service snapshot is `.scratch/gate-removal-before.txt`.

- Nginx syntax/configuration validation passed after correcting file permissions.
- Both public HTTPS hostnames were checked with normal certificate verification. Main `/login` returns 200 without `WWW-Authenticate`; www retains its existing redirect to the main hostname.
- Anonymous session/customer/projection/document API requests return 401 without a Basic challenge.
- Seven-role browser checks use public HTTPS, no Basic credentials and no certificate-validation bypass. All seven roles passed manual login, reload/session persistence, secure cookies, CSRF/Origin rejection, logout, RBAC and cross-session customer/media persistence. Results are recorded in `auth.json` and `auth.log`.
- Account-table fingerprint comparison proves application account records and rotated password hashes unchanged.
- Before/after checks preserve the other 19 container identities/start times/restart counts, including all original 17 services, and both shared Caddy configuration hashes.
- Historical reconciliation passed: 3,241 exact custody rows, 67 quarantines, 242 exact imported financial rows (preserving the existing invoice discrepancies), seven historical stock rows and original balances. Eight SQLite files and 94 baseline screenshots are unchanged. Results are in `data.json`.

## Narrow rollback

To restore the old Basic gate if explicitly required, recreate only the frontend using the prior image and the hostname overlay, omitting the gate-removal overlay:

```sh
cd /opt/workshop/stage49/stage51-release
docker compose --env-file private.env -p workshopos-stage51 \
  -f deploy/stage49/compose.yaml \
  -f deploy/stage51/compose.private.yaml \
  -f /opt/workshop/stage49/stage52-candidate/compose.hostname.yaml \
  up -d --no-deps --wait frontend
```

This preserves the public Origin, newly rotated credentials, database and all later writes. No shared Caddy reload, DNS rollback, image rebuild or database restore is needed. No commit/push was performed. Off-host backup readiness is not claimed.
