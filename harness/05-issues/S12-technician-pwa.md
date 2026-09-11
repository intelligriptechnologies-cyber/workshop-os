# S12 — Technician PWA, evidence, scanning, and synchronization

Status: Complete
Implements: R-043, R-044, R-046, R-047, R-048, R-049

## Outcome
Ship My Tasks on Android with progression, required evidence, scanner/manual fallback, and conflict-safe drafts.

## Acceptance criteria
- [x] Technicians start/pause/resume/block/handoff/complete with reason/history; required evidence/checklists block completion.
- [x] Drafts survive interruption and expose recoverable conflicts, while offline authoritative operations remain visibly blocked.
- [x] Camera/hardware scanning validates tenant, object, state, and permission; manual fallback is reasoned/audited and critical controls are usable with large touch targets.

## Evidence

- `production/src/technician-execution.ts` consumes the versioned S11 `S12_TASK_ASSIGNMENT_READY` boundary exactly once, validates every assigned technician, and exposes a tenant/branch/assignee-filtered `My Tasks` view with plain blockers, guided next actions, 48px controls, snapshotted checklist/material context, camera capture, and online-only material actions.
- Start, pause with reason, resume, block with reason, handoff, and completion use explicit state transitions, `If-Match`, tenant-scoped idempotency, exact accumulated active seconds, and append-only actor/prior/new audit history. Handoff changes visibility to an eligible active branch technician without erasing prior work.
- Required snapshotted checklist steps and clean, checksum-verified, allow-listed private photo evidence block completion. An independent authorized manager may explicitly override remaining blockers only with a reason and immutable evidence. Both normal and override completion emit one `S16_TASK_COMPLETION_READY` event with `PENDING_INDEPENDENT_QC`; technician completion never passes QC.
- Camera and hardware codes resolve only authorized tenant/branch objects in an allowed live state. Manual entry traverses the same validation and additionally requires a retained reason; scan audit stores a code digest rather than the raw code.
- The durable local draft state machine retains tenant/branch/technician-scoped non-ledger drafts across restart, preserves an idempotency key across transient retries, makes uncommitted/retry/conflict/committed state explicit, and requires `KEEP_MINE`, `USE_SERVER`, or `DISCARD` recovery after a version conflict. It categorically rejects offline stock, approval, finance, QC override, closure, and gate postings.
- `012_technician_execution.sql` defines nine tenant/branch-keyed tables with forced RLS, scoped FKs, unique source/idempotency/outbox effects, clean private evidence and reasoned manual-scan constraints, independent completion override evidence, pending-QC handoff, and append-only histories/audits/outbox/receipts.
- Focused acceptance tests pass 8/8. Full production regression passes 82/82 with production typecheck; harness, demo build, and Playwright results are recorded in the handoff.
