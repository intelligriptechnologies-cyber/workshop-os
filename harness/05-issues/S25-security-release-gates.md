# S25 — Security and invariant release gates

Status: Approved  
Implements: R-005, R-006, R-007, R-008, R-016, R-017, R-018, R-035, R-048, R-092, R-105, R-106, R-107

## Outcome
Make isolation, authorization, concurrency, replay, media, public-token, and domain invariants blocking release tests.

## Acceptance criteria
- [ ] Automated matrices deny cross-tenant/branch/role/shared-device/public-token/object/cache/queue/export/report/log access at API and database layers.
- [ ] Stale writes, duplicate commands/webhooks, replayed customer/QR tokens, offline ledger attempts, malicious media, and concurrent invariant races fail safely without duplicate effects.
- [ ] All maker-checker, re-authentication, immutable-ledger, inventory-conservation, QC, billing, closure, and gate invariants have negative tests.

