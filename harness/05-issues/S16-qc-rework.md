# S16 — Independent QC and rework

Status: Complete
Implements: R-064, R-065, R-066, R-067, R-068

## Outcome
Separate technician completion from evidence-rich QC, rework, reinspection, and emergency override.

## Acceptance criteria
- [x] A technician's task completion cannot pass QC; an authorized independent actor applies the snapshotted checklist and evidence.
- [x] Failure creates blocking linked rework and reinspection without erasing any prior result.
- [x] Emergency override needs recent auth, configured checker, reason/evidence and customer/release visibility, and remains auditable.

## Evidence

- `production/src/qc-rework.ts` requires both immutable S12 task-completion and exact S15 reconciliation signals, exposes a pending-QC action, and records every snapshotted item with result, reading, notes, clean private evidence, actor, time, and audit reference under tenant/branch permission boundaries.
- Failed inspections create blocking evidence-linked rework. Assignment, technician execution, and independent reinspection use versioned idempotent commands while retaining prior inspections and append-only transition history.
- Emergency override is a separate evidenced request and configured maker-checker decision with recent authentication, distinct identities, immutable failed inspection history, and explicit customer/release-visible event payload.
- `production/db/migrations/016_qc_rework.sql` persists consumed readiness signals, QC items/evidence, rework history, override approval, unique release effects, fingerprinted command receipts, row locking, append-only history, and forced tenant/branch RLS.
- Six focused S16 behavior/contract tests pass, including concurrency and safe retry. The full production suite passes 111/111 with production typecheck.
