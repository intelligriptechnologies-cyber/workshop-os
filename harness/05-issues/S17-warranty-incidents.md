# S17 — Warranty, comeback, and incident resolution

Status: Complete
Implements: R-069, R-070, R-071, R-072

## Outcome
Handle warranty/comeback as linked new work and resolve custody incidents with legal holds.

## Acceptance criteria
- [x] Delivered work exposes snapshotted warranty terms; a comeback creates a classified linked Visit/Job with diagnosis, responsibility, cost ownership, and outcome while original finance stays closed.
- [x] Incident resolution requires authorized evidence/acknowledgement and legal hold blocks media/record expiry and purge until independently released.

## Evidence

- `production/src/warranty-incidents.ts` exposes the delivered original Job and its immutable service/item warranty snapshot, then atomically creates a separately identified classified Visit/draft comeback Job with diagnosis, responsibility, payer, cost owner, scope, and outcome. It returns the original lifecycle, finalized invoice, and finance as closed and never mutates them.
- S07 custody incidents progress through authorized evidence-rich escalation and resolution. Resolution requires clean tenant-private evidence plus explicit acknowledgement and emits one `S17_INCIDENT_RESOLVED` boundary for S21 without erasing intake or escalation history.
- A reasoned legal hold protects selected record/media classes from retention processing. Release requires clean evidence, recent authentication, release authority, optimistic concurrency, and an actor distinct from the hold maker.
- `production/db/migrations/017_warranty_incidents.sql` persists immutable warranty snapshots, linked work, incident escalation/resolution/acknowledgement and notification evidence, unique events and command receipts, a hold-aware retention guard, append-only history, serialized claim intake, and forced tenant/branch RLS.
- Six focused S17 behavior/contract tests pass through public interfaces, including immutable configuration snapshots, scope/auth/idempotency/concurrency failure, independent hold release, and PostgreSQL controls. The full production suite passes 117/117 with production typecheck.
