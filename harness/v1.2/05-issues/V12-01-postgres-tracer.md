# Prove the production screen vertical

Status: Planned  
Implements: V12-R001, V12-R002  
Blocked by: V12-00

## Outcome

Migrate one representative rich resource all the way from React through authenticated `/api/v1` HTTP to PostgreSQL, proving the reusable production request and mutation contract before broader migration.

## Acceptance criteria

- [ ] A signed-in permitted user lists and creates the representative resource through the UI and the result survives a browser restart because PostgreSQL is authoritative.
- [ ] Cross-tenant and cross-branch access is denied by API authorization and PostgreSQL RLS without leaking the record.
- [ ] Retrying the same mutation idempotency key does not duplicate work; a stale resource version returns a readable conflict.
- [ ] Failures show a safe human-readable message and trace identifier; focused PostgreSQL integration plus unit/typecheck gates pass.

## Evidence

Pending. Start with a failing browser/API/PostgreSQL acceptance path.

