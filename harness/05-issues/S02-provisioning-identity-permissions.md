# S02 — Provisioning, identity, permissions, kiosk, and audit

Status: Approved  
Implements: R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-009, R-010, R-100

## Outcome
Provision tenants and branches with Cognito-backed individual memberships, role templates, granular permissions, secure shared-device switching, approval policy, support access, and audit.

## Acceptance criteria
- [ ] Idempotent provisioning creates all nine default roles, owner membership, branch/config template, currency/timezone, entitlements, quotas, and audit evidence.
- [ ] Combined permissions authorize only allowed branch actions; kiosk PIN sessions attribute the employee, lock out abuse, and never create shared identities.
- [ ] Platform-admin MFA, configured staff MFA, recent re-auth, maker-checker, and time-bound tenant-visible support access are enforced server-side and audited.

