# S11 — Job planning and shared timeline

Status: Complete
Implements: R-041, R-042, R-045

## Outcome
Plan snapshotted approved scope into dependency/material/checklist-aware multi-technician tasks and a permission-filtered timeline.

## Acceptance criteria
- [x] Planning represents skills, bays, effort, dependencies, materials, checklists, priority, and delivery risk from the approved snapshot.
- [x] Multi-technician responsibility/reassignment is concurrency-safe and capacity-aware.
- [x] Each role sees the same chronology filtered to permitted evidence and actions.

## Evidence

- `production/src/job-planning-timeline.ts` consumes only fingerprinted `APPROVED_SCOPE_WORK_PLANNING` events, resolves the exact six-part S09 snapshot, validates the task DAG atomically, exposes bay/skill/capacity risk, and preserves checklist/material version references.
- Assignment commands require authenticated tenant/branch permission, one responsible member of a unique eligible technician set, `If-Match`, and an idempotency key. Capacity overrun is a visible warning that must be explicitly acknowledged; every accepted assignment/reassignment retains actor, prior/new responsibility, warning, version, and audit evidence.
- The shared Job timeline is deterministically ordered and available to Reception, Service Advisor, Technician, Store, QC, Accounts, Gate, and Manager roles; audience, internal detail, private evidence, and actions are filtered independently by permission.
- The only execution handoff is the durable `S12_TASK_ASSIGNMENT_READY` outbox event. S11 does not implement technician task progression or evidence capture.
- `011_job_planning_timeline.sql` supplies forced tenant/branch RLS, scoped keys/FKs, responsibility and no-self-dependency constraints, deferred DAG cycle rejection, unique activation/idempotency/outbox effects, and append-only planning, assignment, timeline, outbox, and command evidence.
- Focused tests pass 6/6. Full production regression passes 74/74 with production typecheck; harness, demo build, and Playwright evidence are recorded in the handoff.
