# S10 — Action inbox and notification delivery

Status: Complete
Implements: R-039, R-040

## Outcome
Deliver role queues and reliable in-app/push/WhatsApp/SMS communication.

## Acceptance criteria
- [x] Each role sees only its prioritized actions with owner, due state, plain blocker, and guided next action.
- [x] Consent/opt-out, versioned templates, WhatsApp-to-SMS fallback, retries, duplicate events, provider status, and terminal failures are tested without duplicate customer effects.

## Evidence

- `production/src/action-notifications.ts` exposes the membership-authorized `/api/v1/actions` and in-app notification reads. Actions are tenant/branch/role/owner scoped, priority ordered, filterable, and include due state, a plain-language blocker, and a guided next action; team-wide ownership requires separate permission.
- A tenant-scoped domain-event boundary fingerprints and ingests each event once, atomically plans action and notification effects, resolves an exact template version, and rejects missing recipients, templates, variables, or fallback templates before committing any effect.
- The durable local worker applies latest consent and opt-out before dispatch; writes in-app effects once; uses inert deterministic push, WhatsApp, and SMS adapters; retains attempts/provider status/failure; exponentially retries transient failures; dead-letters terminal failures; creates at most one separately templated SMS fallback; and supports reasoned dead-letter replay without re-dispatching successful work.
- `production/db/migrations/010_action_inbox_notifications.sql` provides tenant/branch keys, forced RLS, immutable domain/preference/attempt/provider/replay/audit evidence, encrypted-destination/body seams, unique event/channel effects, scheduled retries, and `FOR UPDATE SKIP LOCKED` durable claiming.
- Verified 2026-09-11: production tests 68/68, production typecheck, harness (119 requirements/29 slices/11 contiguous complete/no orphans), demo build, and Playwright 7/7 passed. Provider adapters remained inert; no customer message, push, SMS, WhatsApp, deployment, enrollment, or production action occurred.
