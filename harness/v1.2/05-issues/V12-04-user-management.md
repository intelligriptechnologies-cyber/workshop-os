# Migrate tenant User Management

Status: Planned  
Implements: V12-R008, V12-R009  
Blocked by: V12-03

## Outcome

Make tenant User Management a complete production list/dialog/command flow with invitations, status and archive controls, concurrency, filters, and exports.

## Acceptance criteria

- [ ] Authorized admins list, filter, invite, edit, resend, activate/suspend, and archive users through `/api/v1` and PostgreSQL.
- [ ] Stale user edits fail with a conflict that can be refreshed without losing the intended change.
- [ ] A user cannot remove prohibited self-access or disable/archive the final effective administrator, including concurrent attempts.
- [ ] Permission-denied controls are absent and direct API attempts are denied; complete filtered exports follow V12-03.

## Evidence

Pending.

