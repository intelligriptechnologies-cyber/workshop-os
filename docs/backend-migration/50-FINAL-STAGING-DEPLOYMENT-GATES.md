# 50 - Final staging deployment gates

**Recommendation: NO-GO for remote activation.** Read-only server/DNS inspection and isolated packaged regression are complete. Capacity supports a limited private candidate; off-host backups and remote secret provisioning remain blocked. The newly selected hostname is prepared but its Hetzner certificate/routing can only be verified during an explicitly authorized cutover. No remote services, databases, proxy routes or DNS records were changed. No commit or push was performed.

See the [Stage 50 runbook](../../deploy/stage50/READINESS.md) for the exact DNS record, proposed Caddy site block, secret names, candidate activation sequence and rollback. [Sanitized evidence](stage8-final-staging-gates-evidence.json.md) distinguishes initial failures, successful retries and remaining gates.

## Preflight and scope

Read AGENTS.md, report 49 and its runbook; consulted Graft before inspecting tests and deployment code. Branch `Prem-dev-fbb-Go21`, HEAD `158f092d90b229e0148d0216b91d3f4f0d426079`; approved frontend `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Existing Stage 49 tracked/untracked work was preserved. Stage 50 made no application/backend/schema/frontend changes. Original tests and approved screenshots were not edited. Verification scripts and documentation are the only additions; the migration README gains a link.

Tests ran on a newly created local `workshopos-stage50-local` project with independent database volume/networks, local-only HTTPS port 18550, and immutable Stage 49 images:

- API: `sha256:8de208f43c9ef04838749ef8140610707ba0cafdfe6a3379dcbef9edb90317e4`
- Frontend: `sha256:0372e0d9bb883590e51d48e1159f401e417e1c6eb1ea2051976bf8bb0acdcae2`

Only local rehearsal account/access secrets were reused; they are not approved remote staging credentials. The shipped SQLite was mounted read-only for fresh initialization. Existing PostgreSQL volumes, Stage 49 candidate and recovery resources were not reset/replaced. Local test resources remain available for inspection.

## Gate assessment

| Gate | Evidence | Result |
|---|---|---|
| Capacity | 4 CPUs; 7746 MiB RAM, 5195 MiB available; 36 GiB free disk; 17 running containers; existing configured health checks healthy | Conditional PASS for limited private staging |
| TLS/routing | Vercel nameservers and current A/AAAA/CNAME/CAA inspected; new Caddy block locally validated; exact new Origin accepted by immutable API; no candidate host ports | Prepared; actual new-host TLS/routing remains cutover validation |
| Secrets | Remote proposed directory/files absent or inaccessible; local secure-cookie/Origin/CSRF tests pass | BLOCKED on approved provisioning and Linux ownership/readability verification |
| Off-host backup | No approved destination, encryption/access/retention/owner evidence; no data transfer | BLOCKED |
| Packaged regression | 16 functional suites passed; real PostgreSQL writes, cross-session reads and restored data verified | Functional PASS for listed coverage; visual acceptance conditional |

### Capacity and service health

At 06:43 UTC, load was 0.08/0.31/0.28. Short vmstat samples were 94-99% idle, with no observed I/O wait or swap. Sysstat history October 15-23 supplied 1193 ten-minute samples: the least idle sample was 79.06%, and minimum available memory was 5,264,236 KiB (~5.02 GiB). These samples do not capture every transient peak.

Existing PostgreSQL containers used roughly 29-94 MiB each in the snapshot with near-zero instantaneous CPU. All 17 services were running; those with health checks reported healthy. Services without a health check were not falsely certified at application level. Production database contents were not queried. No existing services were stopped, restarted or recreated.

Candidate limits total 2 CPU and 1664 MiB memory, leaving ~3.4 GiB relative to minimum sampled available memory. Fifteen local resource samples during packaged tests recorded API peak ~95.36 MiB, DB ~91.71 MiB, frontend ~2.74 MiB; sampled CPU maxima were ~82.85%, 57.51%, 12.42% of one core respectively. These are small-demo functional-test observations, not a concurrent-user load benchmark or guaranteed peak requirements. Use the configured limits as the initial planning ceiling, build off-host, monitor contention and retain disk reserve for media/WAL/backups/restore copies. Existing applications can still grow and mostly have no resource limits.

### New hostname decision

The user selected **workshopos.nexiohyper.com**, replacing the proposed Stage 49 hostname for the new candidate. DNS is managed by authoritative `ns1.vercel-dns.com` / `ns2.vercel-dns.com`. Queries currently return Vercel addresses with TTL 1800, no hostname AAAA/CNAME answer; apex CAA permits Let's Encrypt. Similar answers for a nonexistent name suggest wildcard coverage. Whether an explicit record or Vercel project association exists requires zone UI/API review; it cannot be proven from DNS answers alone.

The runbook proposes only `A workshopos -> 89.167.40.86` (TTL 300 if supported) and a new independent Caddy site block pointing to the candidate alias. Preserve all wildcard/apex/unrelated records and the old `workshopos-staging` route. Vercel remains DNS management only. No DNS change or Vercel deployment occurred.

The old staging hostname's publicly trusted Let's Encrypt certificate was verified over TLS 1.3, valid until December 21, 2026. This is not evidence of a certificate for the new hostname on Hetzner. New certificate issuance, real-host cookies and routing remain required after authorized DNS/proxy cutover. Staging keeps exact HTTPS Origin, prefill disabled, host-only Secure/HttpOnly/SameSite=Lax sessions, CSRF checks and the private access gate. No secret values appear in this report.

### Backup readiness and required approval

No Workshop OS off-host destination or retention/recovery owner was supplied. Read-only discovery found no Workshop OS backup timer/configuration in inspected accessible locations; the dpkg backup timer is unrelated. This does not prove that every privileged or external backup system is absent, but none is verified for Workshop OS.

Required approval is concrete: choose an external destination and ownership/region, approve a dedicated Workshop OS prefix/repository and scoped credentials, approve encryption-recipient/key custody, retention, failure alerts and recovery owner, then authorize credential installation, scheduling and an encrypted upload/retrieval/decryption/restore rehearsal. No sensitive data was sent to an unapproved destination. A local dump is not an off-host backup.

## Packaged regression results

Final successful functional suites:

- Authentication for all seven roles: manual login, reload/session persistence, secure cookie flags, logout, role denial, wrong-Origin/missing-CSRF rejection, private gate and no local fallback.
- Suppliers/purchases/stock: approved creation/editing/approval/receipt/return/close controls, accepted quantity posted once, inventory editing and independent-session visibility.
- Financial workflows: mixed-GST/discount preview and PostgreSQL totals, invoice creation/editing, full settlement and job closure, receipts/gate passes, frozen document HTML/PDF and Accounts-session visibility.
- Financial edge workflows: approved invoice void and payment-checklist settlement/document generation.
- Estimates/media: existing estimate controls, durable document HTML, image upload/render, metadata edit/archive and independent-session bytes.
- Bookings/check-in: capacity save, booking create/reload, independent Reception visibility, check-in and linked visit/job.
- Reception/jobs: attendance, intake, linked edits, cancellation/archive and cross-session state.
- Vehicles and historical ownership: CRUD/archive/filter, cross-session visibility and preserved historical visit associations.
- Approvals, catalogue/team administration, task lists, sales CRM and user administration: existing UI actions and backend persistence.
- Configuration: business settings, custom role and templates with independent-session persistence; restore of test configuration through the API.
- Dashboard/reports: dashboard counts matched PostgreSQL projection, Excel included PostgreSQL lead data and PDF export was valid.

This is 16 functional suite executions after investigated retries, not a claim that every possible interaction or all prior 20 Stage 48 suites was rerun. The dedicated execution/QC suite and separate high-contention inventory benchmark were not rerun; job checklist transitions were exercised through the financial workflow. Both immutable application containers were healthy/read-only with no OOM flag; readiness checked database migration head 53. New hostname exact-Origin configuration was accepted by the running immutable API's configuration loader.

Initial harness failures were investigated: one visual runner started before the new local gateway listened; retry after health succeeded. Older test assumptions used demo prefill, source-module imports or direct reads of retired browser business-cache keys. The packaged application correctly disables prefill and rejects those reads. Local adapters now use manual credentials, public API restoration and storage-key absence assertions; no production guard was weakened, original source tests were not changed, and original business workflow assertions remain. All initial failure logs are retained.

## Visual results

Captured 18 approved states: booking (3), configuration (5), stock/purchases (10). Original screenshots were preserved. Raw comparison found seven differences. Three booking differences were caused by October 23 versus the baseline October 22 clock; a separate browser-clock-controlled capture matched all three exactly without image masking or baseline edits.

After that diagnostic, 14/18 states are exact. Remaining differences:

| State | Difference | Assessment |
|---|---|---|
| Configuration roles | 22 pixels, maximum channel delta 1 | Tiny rasterization |
| Configuration templates | 2 pixels, maximum delta 2 | Tiny rasterization; not relabelled as delta 1 |
| Store inventory | 65 pixels, maximum delta 1 | Tiny rasterization |
| Purchase request | 33 pixels confined to day field | Actual date 23 versus baseline 22, verified by image inspection |

No layout/form/style/navigation changes were made to satisfy comparisons. These 18 states are not a new 37-state certification; strict visual acceptance remains conditional on the documented differences and remaining coverage. Stage 48's four prior tiny differences remain historical evidence, not a replacement for this run.

## Financial/data preservation and recovery

Fresh import and final reconciliation preserved **3241 custody records, all 67 quarantines, 242 imported financial snapshots, all 51 invoice discrepancies, seven historical stock rows and original balances 500/79/60/3**. New test stock items are checked separately from the unchanged source item balances. Historical financial read-only policy was not changed; no identities, relationships, values or missing media were fabricated.

Eight original SQLite copies and 94 baseline screenshots remain hash-identical. Post-regression custom-format dump was restored into a NEW network-isolated local PostgreSQL 17 volume: all **120 table fingerprints**, sequence values, media/document bytes and runtime-role restrictions matched. Dump size 1,449,900 bytes; SHA256 `94aaa2696f4aaf2f616f6bc6e0dd5ffad0691c52646555db50fec2b91c448176`. This proves local database/media restore, not off-host transfer/encryption recovery or a production RTO.

Final remote comparison confirmed all 17 container identities/images/start times/restart counters and both shared proxy configuration hashes unchanged. The existing source checkpoint files were unchanged before the documentation-only README append. Recovery artifacts and local credentials remain local and must not be published.

## Files changed and final disposition

New files under `deploy/stage50/`: `browser-support.mjs`, `prepare_runners.py`, `run_regression.py`, `verify_data_local.py`, `verify_restore_local.py`, `Caddyfile.workshopos.proposed`, `staging.env.example`, `READINESS.md`. New migration report/evidence plus one appended README link. Generated local runners, logs, screenshots and dumps are under `.scratch/stage50/`, not production assets. No backend, frontend or schema file was changed by Stage 50; earlier Stage 49 changes remain preserved and uncommitted.

Activation sequence and rollback are in the runbook. Preserve old images, DNS/Caddy snapshots, database/media checkpoint and recovery credentials. Code rollback alone cannot undo schema/data changes; restore only into new isolated storage and reconcile later writes. DNS rollback is subject to caching. Do not run any candidate/DNS/proxy commands until the user explicitly authorizes them.

**STOP: remote activation is NO-GO pending off-host recovery approval/configuration, secret provisioning/readability, DNS zone review, visual acceptance and an approved cutover with new-host HTTPS verification.**
