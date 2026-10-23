# Stage 51 private Hetzner testing

This is a limited private-testing exception. Object Storage/off-host recovery is deferred. Public activation is NOT approved. Do not change DNS, shared Caddy, unrelated services or existing volumes.

## Candidate and isolation

Checkpoint: `Prem-dev-fbb-Go21`, `158f092d90b229e0148d0216b91d3f4f0d426079`, with pre-existing Stage 49/50 work preserved. HEAD alone does not identify the packaged release; use the immutable images and source manifests.

- API: `sha256:8de208f43c9ef04838749ef8140610707ba0cafdfe6a3379dcbef9edb90317e4`
- Frontend: `sha256:0372e0d9bb883590e51d48e1159f401e417e1c6eb1ea2051976bf8bb0acdcae2`
- PostgreSQL and private gateway pinned in Compose.
- Project `workshopos-stage51`, release `/opt/workshop/stage49/stage51-release`.
- Secrets `/home/prem/.workshopos-stage51/secrets`, parent directories mode 0700. Individual read-only Docker mounts permit the required container UIDs; host traversal remains restricted. Docker administrators retain privileged access.
- Dedicated database volume and internal database/app/proxy networks. Only the gateway joins the separate ingress bridge. Only `127.0.0.1:18551` is published. No connection to shared Caddy.
- Combined memory limits approximately 1.75 GiB. The official gateway binary requires the NET_BIND_SERVICE bounding capability even on the unprivileged port.

## Private access

Keep this tunnel running on the authorized workstation:

```powershell
ssh -N -i "C:\Users\PREMDEEP\.ssh\id_ed25519" -o BatchMode=yes -o StrictHostKeyChecking=yes -o ExitOnForwardFailure=yes -L 127.0.0.1:18551:127.0.0.1:18551 prem@89.167.40.86
```

URL: `https://localhost:18551`. Secure cookies and CSRF remain enabled with this explicit Origin. Do not use the final public hostname. The private certificate expires after 30 days and must be renewed before testing beyond that date.

The public certificate and SPKI pin are `.scratch/stage51/private.crt` and `tls-spki.txt`, fetched over verified SSH. Automation trusts this exact key. Python/Node use the explicit certificate trust file. For manual testing, launch Chrome/Chromium with a NEW private-testing profile and `--ignore-certificate-errors-spki-list=<verified public SPKI pin>`. Do not disable certificate validation globally or disable application security.

The authorized operator can retrieve the private gate and generated account credentials securely from `/home/prem/.workshopos-stage51/secrets/test-access.json` (0400). Do not paste them into reports or logs. The test helper captures them over SSH in memory. Credential prefill is disabled; manual login remains available.

## Operator checks

```sh
cd /opt/workshop/stage49/stage51-release
docker compose --env-file private.env -p workshopos-stage51 -f deploy/stage49/compose.yaml -f deploy/stage51/compose.private.yaml ps
docker compose --env-file private.env -p workshopos-stage51 -f deploy/stage49/compose.yaml -f deploy/stage51/compose.private.yaml config --quiet
docker exec workshopos-stage51-api-1 python -c 'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:8000/api/v1/health/ready").status)'
```

Initialization ran once after its empty-state guard passed. Never reinitialize occupied storage or rerun secret provisioning over existing secrets. Updates to the gateway use only the exact project/files above and `up -d --no-deps private-https`.

Local verification with the tunnel open:

```powershell
$env:NODE_EXTRA_CA_CERTS=(Resolve-Path .scratch/stage51/private.crt).Path
node .scratch/stage51/runners/auth.mjs
python deploy/stage51/verify_remote.py data
# Refuses to overwrite an existing restore target or volume:
python deploy/stage51/verify_remote.py restore
```

Generate workflow runners using `python deploy/stage51/prepare_runners.py`. They deliberately create staging test records and must not be pointed at production.

## Recovery and withdrawal

Local pre-deployment recovery artifacts: `.scratch/stage51/source-checkpoint.zip`, `source-manifest.json`, `working.patch`, `predeploy-local.dump`, and `checkpoint.json`. Original SQLite sources and previous images remain intact.

Remote pre-test checkpoint: `/home/prem/.workshopos-stage51/recovery/initialized.dump` and `.toc`, SHA256 `747deac89018f5df6cf2805ce7b33c18773fcb08c183181f4f5014a8bde9e338`. Previous Workshop configuration is retained beside it. The dump covers durable media bytes and historical custody; database roles/credentials require the initialization scripts and separately protected secrets.

To withdraw the candidate while retaining volumes and images, stop ONLY this project:

```sh
cd /opt/workshop/stage49/stage51-release
docker compose --env-file private.env -p workshopos-stage51 -f deploy/stage49/compose.yaml -f deploy/stage51/compose.private.yaml stop
```

No shared proxy rollback is needed. Database rollback requires restoring a checkpoint into a NEW volume and verifying rows, sequences, media and permissions before selecting it. Image rollback alone does not undo migrations. Never delete volumes or overwrite the running database.

No scheduled retention/deletion is enabled. Manual recovery artifacts do not establish approved off-host backup readiness. Public activation remains gated on encrypted off-host restore proof, hostname/DNS/TLS cutover approval, credential/certificate review and current capacity checks.
