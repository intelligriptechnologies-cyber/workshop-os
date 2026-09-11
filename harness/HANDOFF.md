# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S11<br>
Next slice: S12 — Technician PWA, evidence, scanning, and synchronization

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S01-S10 establish the tenant-aware journey through approval and actionable notification. S11 converts only approved scope into controlled work planning and exposes the shared operational chronology; task execution remains owned by S12.

## S11 evidence

- `production/src/job-planning-timeline.ts` consumes the enriched S09 `APPROVED_SCOPE_WORK_PLANNING` contract exactly once and resolves only its snapshotted workflow, recipe, and checklist versions. It creates dependency-safe tasks carrying required skills, bay type, exact effort, checklist/material references, priority, resource warnings, and promised-delivery risk.
- Multi-technician assignment enforces a unique set and exactly one responsible technician. Branch, active state, and skills are eligibility gates; insufficient capacity is retained as a warning and requires explicit acknowledgement. `If-Match`, idempotency fingerprints, actor/prior/new history, audit references, and versioned outbox uniqueness control concurrent retry/reassignment.
- Shared Job events are ordered by occurrence time then stable source ID. Reception, Advisor, Technician, Store, QC, Accounts, Gate, and Manager see their permitted chronology while internal detail, private evidence, and actions are independently redacted.
- S11 emits only `S12_TASK_ASSIGNMENT_READY`; no start/pause/resume/block/handoff/complete behavior, evidence capture, material posting, or other S12 execution was implemented.
- `011_job_planning_timeline.sql` forces tenant/branch RLS on eight tables and provides scoped FKs, exact activation/command/outbox uniqueness, responsible-technician constraints, deferred cycle rejection, and append-only ledgers.
- Production tests passed 74/74 and production typecheck passed. Harness verified 119 requirements, 29 slices, 12 contiguous complete, and no orphans. Demo build and Playwright 7/7 passed. No provider, customer message, deployment, enrollment, push, or external production action occurred.

## S12 first action

Read S12, R-043/R-044/R-046-R-049, D-005/D-011/D-017/D-018/D-025/D-030, and the S11 `S12_TASK_ASSIGNMENT_READY` boundary. Start with a failing mobile `My Tasks` test proving an eligible signed-in technician sees only assigned branch tasks with plain blockers and a guided next action. Then add versioned start/pause/resume/block/handoff/complete transitions and enforce snapshotted checklist/private-evidence completion gates before scanner and conflict-safe draft behavior.

## Guardrails

- Preserve unrelated user changes and demo behavior.
- Derive tenant/branch/role authority from verified membership; never trust client context.
- Consume each S11 task-assignment outbox version once; never infer assignment from mutable configuration.
- Do not equate technician completion with independent QC, issue material offline, or bypass required checklist/evidence without the configured audited override.
- Camera/hardware/manual scanning must validate tenant, target, state, and permission; manual fallback needs reason and audit evidence.
- After S12 passes, update its evidence, checklist, traceability, decision ledger if affected, and this handoff; commit locally with S12 and do not push.
