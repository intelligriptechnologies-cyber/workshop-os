# Deliver the Platform Super Admin workspace

Status: Complete
Implements: V12-R011, V12-R031, V12-R032, V12-R033  
Blocked by: V12-05, V12-14

## Outcome

Deliver a separate platform workspace for tenant selection, protected logs/recovery, support grants, and approved time-bounded tenant-user emulation.

## Acceptance criteria

- [x] Platform operators enter a separate workspace with no ambient tenant navigation/access and select explicit tenant scope for allowed platform operations.
- [x] Protected daily logs support authorized download with immutable audit, at least 30 days online and 90 days recoverable, plus an exercised recovery contract.
- [x] Emulation cannot start without reason, MFA/re-authentication, a different approver, and exact tenant/user/branch scope; it expires after 15 minutes.
- [x] Emulation cannot exceed effective-user permissions or bypass approvals, and every action records both platform actor and effective user.

## Evidence

- `/platform` is a separate React workspace with a distinct local/platform-Cognito credential path, no tenant navigation, no tenant credential fallback, explicit tenant selection, and tenant-scoped grant/emulation queries. Platform permissions are independent from tenant roles.
- Migrations 044–045 add least-privilege platform identities, 30-day-online/90-day-recoverable daily logs, checksum-verified protected downloads, immutable access/recovery evidence, scoped support grants, exact tenant/membership/branch emulations, and append-only request/result attribution. Existing legacy grants migrate fail-closed when independent approval cannot be proven.
- Support grants and emulations require accountable reasons, recent MFA/re-authentication, an active exact scope, and a different approver. PostgreSQL enforces scope-consistent tenant/member/branch references and exact 15-minute active expiry.
- The same-tab emulation bridge adds only the approved platform credential and emulation identifier to ordinary `/api/v1` requests. The server resolves the effective user's live roles, direct denies, branch, and warehouses, then reuses normal handlers and approval rules without unioning platform permissions. A durable dual-attribution REQUEST record is written before dispatch and a RESULT record follows every response, including denials.
- Protected logs verify SHA-256 before download/recovery, audit allowed and denied access, preserve append-only recovery evidence, and exercise recovery from the offline tier. Local seeding creates repeatable online/recoverable fixtures without rewriting prior evidence.
- A fresh database applied all 45 migrations and the focused PostgreSQL acceptance passed 1/1. Rebuilt Docker smoke passed 63 named HTTP/PostgreSQL checks, including separate auth, independent approval, exact expiry, effective-user ceilings, denied-action attribution, protected download, and recovery.
- `npm run build`, unit 30/30, production 241/255 with 14 expected opt-in PostgreSQL skips, production typecheck, the production-authority gate, and `git diff --check` pass. Focused Playwright passes 2/2 against the real stack and mock-controlled full emulation bridge; full real-stack Playwright passes 72/72. Both harness verifiers pass and identify V12-16 next.
