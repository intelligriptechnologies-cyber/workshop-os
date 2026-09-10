# S02 — Provisioning, identity, permissions, kiosk, and audit

Status: Complete
Implements: R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-009, R-010, R-100

## Outcome
Provision tenants and branches with Cognito-backed individual memberships, role templates, granular permissions, secure shared-device switching, approval policy, support access, and audit.

## Acceptance criteria
- [x] Idempotent provisioning creates all nine default roles, owner membership, branch/config template, currency/timezone, entitlements, quotas, and audit evidence.
- [x] Combined permissions authorize only allowed branch actions; kiosk PIN sessions attribute the employee, lock out abuse, and never create shared identities.
- [x] Platform-admin MFA, configured staff MFA, recent re-auth, maker-checker, and time-bound tenant-visible support access are enforced server-side and audited.

## Implementation evidence

- RED/GREEN: eight public-interface tracer bullets in `production/tests/identity-access.test.ts` first failed on each missing behavior, then passed incrementally: membership/branch permission checks; complete idempotent provisioning; individual combined roles; kiosk switching/lockout; MFA and recent re-auth; maker-checker; support access/audit; and persistence/RLS.
- Identity boundary: `production/src/identity-access.ts` exposes a Cognito-compatible port with a deterministic local adapter. It derives authority from verified individual membership and supports granular combined permissions without shared identities.
- Controls: platform MFA, tenant staff-MFA policy, sensitive recent-auth windows, the full controlled-action category set, independent maker/checker decisions, registered-device PIN switching with digest-only credentials and timed lockout, and tenant-approved expiring support grants fail closed.
- Persistence/audit: `production/db/migrations/002_identity_access.sql` adds tenant-keyed identity/control tables with forced RLS and extends audit evidence with membership, request, reason, state, ledger, approval, and authentication context.
- Verification: `npm run test:production`, `npm run test:production:typecheck`, `npm run test:harness`, `npm run build`, and `npm run test:e2e` pass. No Cognito/AWS service was contacted and no deployment was performed.
