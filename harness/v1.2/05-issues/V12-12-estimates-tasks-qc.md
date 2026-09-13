# Migrate Estimates, Tasks, and QC

Status: Planned  
Implements: V12-R026, V12-R027  
Blocked by: V12-03, V12-05, V12-10, V12-11

## Outcome

Migrate Estimates, technician Tasks, and QC experiences to production lists/dialogs while preserving version, evidence, approval, rework, and lifecycle controls.

## Acceptance criteria

- [ ] Estimate list/edit/version/submit/approve flows survive reload and preserve superseded versions and approval evidence.
- [ ] Authorized estimate documents contain the intended immutable version and obey permission filtering.
- [ ] Task assignment and evidence commands are PostgreSQL-backed and respect lifecycle and role constraints.
- [ ] QC checklists, independent decisions, failed-item rework, evidence, and blockers are enforced through UI and direct API.

## Evidence

Pending.

