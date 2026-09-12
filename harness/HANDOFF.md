# WorkshopOS implementation handoff

Updated: 2026-09-12
Current branch: `prem-dev`
Completed slice: S25<br>
Next slice: S26 — Scale, recovery, observability, backup, and DR

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain unchanged and traceability is CLEAN through S25.
- S00–S25 are complete locally. S25 is a blocking application-contract gate, not evidence of a deployed penetration test, cloud IAM review, or production provider certification.
- S24 remains an inert migration contract. S28 still owns authorized real-tenant rehearsal, parallel reconciliation, cutover/rollback, hypercare, and repeatable second-tenant acceptance.

## S25 evidence

- `production/tests/security-release-gates.test.ts` executes seven focused negatives spanning cross-tenant and unauthorized-branch API/database/object/queue/cache/export/search/report/metric/log views, shared-device lockout and attributable recovery, every offline authoritative posting class, invalid/duplicate signed webhooks, and secure media.
- `production/src/local-production-vertical.ts` now scopes search, report, and metric projections alongside the existing API, store, object, queue, cache, export, and safe-log surfaces.
- `production/src/security-release-gates.ts` keeps uploaded evidence private and quarantined until an authenticated trusted scanner confirms the exact checksum. MIME allow-list, tenant quota, cross-tenant/branch/permission read denial, and access audits fail closed; uploaders and invalid scanner credentials cannot release quarantine.
- `production/db/migrations/025_security_release_gates.sql` adds forced-RLS private media, locked tenant quota reservation, server-generated tenant/branch object keys, and append-only access evidence, with a security-invoker application view limited to `CLEAN` objects.
- The full suite continues to execute the owning public contracts for stale writes, idempotency fingerprint misuse, concurrent winners, single-use estimate tokens, narrow expiring/revocable QR, maker-checker and re-authentication, immutable inventory/finance compensation, exact material conservation, independent QC/rework, one-invoice/correction rules, closure blockers, and independent Gate verification.
- No AWS deployment, PostgreSQL penetration run, provider call, file upload, customer communication, or live tenant action occurred.

## Verification

- `npm run test:production`: 186/186 passed.
- `npm run test:production:typecheck`: passed.
- S25 focused suite: 7/7 passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 26 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S26 first action

Read S26 and R-108–R-112. Begin with one failing deterministic recovery scenario that injects a provider/worker failure, follows its tenant-safe audit correlation through retry/dead-letter/replay, and proves exactly one committed effect. Then add representative scale/latency, backup/restore, RPO/RTO, availability, and regional-recovery harnesses without claiming deployed evidence that has not been exercised.

## Guardrails

- S26 local simulations must clearly distinguish measured deterministic contract evidence from production-scale AWS load, backup restoration, availability, and regional DR exercises.
- Authorized infrastructure penetration testing, IAM/object policy review, malware-scanner integration certification, secret rotation, AWS/provider/DNS/Tally credentials, finance review, and pilot inputs remain external prerequisites.
- Do not deploy, contact providers, upload live data, message customers, push GitHub, or commit without the parent agent's review.
