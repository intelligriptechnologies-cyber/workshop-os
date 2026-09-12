# S28 — Pilot, cutover, rollback, hypercare, and second tenant

Status: Complete
Implements: R-118, R-119

## Outcome
Run measurable parallel reconciliation, controlled launch, recovery, hypercare, and repeatable no-fork onboarding.

## Acceptance criteria
- [x] The local coordinator requires 14 distinct, valid operation dates with exact operational, stock, invoice, payment, and custody reconciliation within the immutable configured tolerances before go/no-go. Authorized real-tenant daily evidence remains pending.
- [x] Go/no-go requires all prior release evidence plus independently authorized, evidenced cutover and rollback rehearsals, communications, and data reconciliation; exit requires 28 distinct hypercare dates meeting incident and SLO thresholds. The live windows remain pending.
- [x] The no-fork comparison requires both tenants to complete the same ordered provisioning, configuration, import, training, isolation, parallel, cutover, and acceptance playbook version/checksum on the identical application release. Authorized second-tenant execution remains pending.

## Local evidence

- `production/src/pilot-cutover.ts` implements an immutable, maker-checker-published rollout playbook. It rejects shortened parallel/hypercare windows, missing mandatory stages, negative or inexact tolerances, checksum collisions, stale versions, changed idempotency replays, invalid dates, duplicate daily evidence, and cross-scope pilot access.
- Parallel evaluation uses fixed-decimal arithmetic and blocks a one-unit tolerance excess. Go/no-go remains blocked until the 14-day evidence, S01/S18/S19/S20/S25/S26/S27 external prerequisites, and passed, data-reconciled cutover and rollback rehearsals with distinct authorities and communication artifacts are present.
- Controlled cutover begins a 28-distinct-day hypercare contract. Availability, routine/authoritative p95, and open-critical-incident thresholds block exit. Automated evidence cannot be recorded as pilot, hypercare, prerequisite, or onboarding acceptance evidence.
- The second-tenant comparator requires identical playbook version/checksum, ordered stage completion, and application release checksum; any difference reports a code fork or playbook divergence. All test artifact references are inert fixtures and explicitly return that they do not prove a real pilot or second-tenant acceptance.
- `production/db/migrations/028_pilot_cutover.sql` persists composite tenant/branch playbook and pilot links, exact daily reconciliation, prerequisite evidence, rehearsals, cutover authority, hypercare, onboarding stages, optimistic commands, and append-only evidence under forced RLS.
- Seven focused tests pass. The authoritative full-suite counts and final build/browser/harness evidence are recorded in `harness/HANDOFF.md` after the parent gate.

## External acceptance still required

- Authorized first-tenant deployment and 14 real parallel-operation days with signed operational, stock, invoice, payment, and custody reconciliation.
- Qualified India finance approval plus AWS/IAM/security, Tally/Cashfree/messaging, deployed load/recovery/SLO, accessibility/device/printer, and representative-staff evidence recorded by their owners.
- Named cutover/rollback maker-checker rehearsal, controlled cutover and communications, followed by 28 real measured hypercare days meeting exit thresholds.
- Authorized second tenant completing the identical playbook and application release without a code fork. Until these references exist, the overall production goal and pilot acceptance remain incomplete.
