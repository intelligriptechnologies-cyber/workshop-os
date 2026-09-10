# S07 — Reception check-in, custody evidence, and offline drafts

Status: Complete
Implements: R-028, R-029, R-071

## Outcome
Create a Visit plus draft Job Card atomically with custody evidence, advisor handoff, incident capture, and recoverable reception drafts.

## Acceptance criteria
- [x] One idempotent online check-in creates exactly one linked Visit/draft Job with KM, fuel, keys, accessories, request, advisor, and required acknowledgements/photos.
- [x] Offline work is visibly a draft, survives restart/conflict, and cannot post custody, approval, inventory, finance, or release ledgers.
- [x] A custody incident records severity, evidence, notification, owner/actions, and vehicle/job links independently of Job notes.

## Evidence

- `production/src/reception-custody-offline.ts` exposes tenant/branch-authorized `/api/v1` appointment-event and walk-in check-in, independent custody-incident intake, and a namespaced restart-safe reception draft adapter.
- Check-in safe replay returns the same Visit/draft Job; a different key cannot consume the same S06 event twice. Validation occurs before the atomic pair is committed and snapshots the active reception configuration.
- Reception and incident evidence is represented only by tenant/branch-private object keys, SHA-256 checksums, and malware-scan status. This slice performs no upload or provider action.
- Offline drafts are explicitly non-authoritative, show uncommitted/conflict status, and support explicit rebase/discard recovery. Lifecycle, custody, approval, inventory, finance, QC override, closure, and gate postings fail with `ONLINE_REQUIRED` and are never queued.
- `production/db/migrations/007_reception_custody_offline.sql` defines one atomic check-in function, single-consumer source-event and one-Job-per-Visit constraints, forced tenant/branch RLS, private media metadata, durable custody notification outbox, tenant idempotency, and append-only evidence/acknowledgement/consumption/audit ledgers.
- S07 acceptance and PostgreSQL contract tests pass with the full production regression suite; production typecheck, harness verification, demo build, Playwright regression, and clean-diff verification are recorded in `harness/HANDOFF.md`.
