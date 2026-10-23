# 52 ? Hostname activation preparation (approval pending)

**No DNS change or shared Caddy reload performed.** Security/recovery preparation is complete; public activation remains pending explicit approval and an authorized administrator.

See [reviewed activation and rollback runbook](../../deploy/stage52/READINESS.md).

## Existing Vercel zone

Authenticated scope: NH (`nh-1809`). Both nameservers are Vercel. Complete zone snapshot: 13 records, no further page. No explicit `workshopos` record; no Workshop OS alias found in this authorized scope. The only visible project is `nexiohyper-website`, with apex, www and its vercel.app hostname. This does not assert ownership in inaccessible accounts.

| Name | Type | Value | Configured TTL |
|---|---|---|---|
| auth.billing | A | `89.167.40.86` | 60 |
| auth.billing-staging | A | `89.167.40.86` | 60 |
| billing-staging | A | `89.167.40.86` | 60 |
| billing | A | `89.167.40.86` | 60 |
| workshopos-staging | A | `89.167.40.86` | 60 |
| bstock | A | `89.167.40.86` | 14400 |
| www.stock | A | `89.167.40.86` | 14400 |
| stock | A | `89.167.40.86` | 14400 |
| @ | CAA | `0 issue "pki.goog"` | 60 |
| @ | CAA | `0 issue "sectigo.com"` | 60 |
| @ | CAA | `0 issue "letsencrypt.org"` | 60 |
| * | ALIAS | `cname.vercel-dns-017.com.` | 60 |
| @ | ALIAS | `9f724e647f355d52.vercel-dns-017.com` | 60 |

`workshopos` currently inherits the wildcard. Proposed addition only: **A workshopos ? 89.167.40.86, TTL 300**. No conflicting explicit record requires deletion. Observed public flattened A TTL was 1800 seconds; cached Vercel answers can outlive a new TTL. Preserve wildcard/apex/mail/unrelated records and project associations.

## Completed gates

- Rotated all 11 existing staging application passwords and the private gate credential; retained identities/roles/statuses. Revoked all 28 existing sessions. Old gate, old admin credential and old session rejected. No secret values or credential hashes printed. New secrets remain under restricted operator custody.
- Seven-role authentication, disabled hosted prefill, Secure/HttpOnly cookies, Origin/CSRF rejection, logout, RBAC and cross-session customer/media persistence passed with new credentials.
- Workshop containers healthy; all 21 current container identities/images/start times/restart counts unchanged, including the original 17. Shared Caddy files unchanged. Original proxy network memberships preserved; only candidate frontend gained the intended shared Workshop network membership.
- Full appended Caddy candidate validated with the exact proxy image in an isolated, network-disabled validation container. Alias connectivity verified from live proxy; health 200, anonymous access 401. Candidate not loaded.
- Post-test preservation: 3241 exact custody records, 67 quarantines, 242 exact historical financial records, seven original stock rows and original balances unchanged. Stage 51 initialization verified 51 discrepancies; exact historical invoice values remain preserved. All eight original SQLite sources and 94 baseline images unchanged.
- Protected pre/post-rotation dumps retained. Fresh network-disabled local restore matched all 120 table fingerprints, sequences and media/document contents. Runtime/table/routine/schema and effective database grants verified.
- Found and corrected a recovery-only gap: a non-create pg_dump restore leaves new-database default PUBLIC CONNECT/TEMP grants. The Stage 52 restore helper now reinstates the established restricted database ACL and compares it to the live source. Live PostgreSQL permissions were already correct and were not changed.

## Pending approval and operator action

`prem` cannot write the shared Caddy configuration and has no noninteractive sudo access. An authorized administrator (for example amlan) must apply the reviewed candidate after approval. No permission bypass was attempted. The default Caddy admin endpoint is enabled; use the documented graceful reload, never restart/recreate shared Caddy.

The API still uses the private exact Origin. At approved cutover, the reviewed overlay changes only the Workshop API Origin and persists the frontend network alias. No public TLS or new-host functional success is claimed. Off-host backups remain deferred/unverified. Existing Stage 50 visual limitations remain; no new full visual suite was run.

Approval must cover: (1) Workshop-only API Origin switch, (2) administrator applying the reviewed Caddy addition and graceful reload, and (3) saving the single new Vercel A record. Recheck drift first, then verify publicly trusted TLS, gate, login, business/media persistence and preservation.

Rollback removes only the new DNS record/site addition and restores private Origin; preserve all current data and later writes. Never re-enable exposed credentials or restore the database just to undo routing.

## Files and evidence

New: `deploy/stage52/rotate_private.py`, `verify_remote.py`, `compose.hostname.yaml`, `READINESS.md`, and this report. Protected evidence: `.scratch/stage52/`. Branch `Prem-dev-fbb-Go21`, HEAD `158f092d90b229e0148d0216b91d3f4f0d426079`. No frontend/backend/schema code modified; no commit or push. Previous uncommitted work preserved.
