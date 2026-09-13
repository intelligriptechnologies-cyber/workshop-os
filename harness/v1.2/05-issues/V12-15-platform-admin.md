# Deliver the Platform Super Admin workspace

Status: Planned  
Implements: V12-R011, V12-R031, V12-R032, V12-R033  
Blocked by: V12-05, V12-14

## Outcome

Deliver a separate platform workspace for tenant selection, protected logs/recovery, support grants, and approved time-bounded tenant-user emulation.

## Acceptance criteria

- [ ] Platform operators enter a separate workspace with no ambient tenant navigation/access and select explicit tenant scope for allowed platform operations.
- [ ] Protected daily logs support authorized download with immutable audit, at least 30 days online and 90 days recoverable, plus an exercised recovery contract.
- [ ] Emulation cannot start without reason, MFA/re-authentication, a different approver, and exact tenant/user/branch scope; it expires after 15 minutes.
- [ ] Emulation cannot exceed effective-user permissions or bypass approvals, and every action records both platform actor and effective user.

## Evidence

Pending.

