# S21 — Closure, delivery evidence, and gate verification

Status: Approved  
Implements: R-089, R-090, R-091, R-092, R-093, R-094, R-095, R-096

## Outcome
Render controlled documents and release vehicles only through evidenced closure and independent valid gate verification.

## Acceptance criteria
- [ ] Plain-language closure blockers cover work, QC, material, billing, payment/credit, incident, evidence, and gate; any permitted override satisfies full maker-checker/re-auth evidence.
- [ ] Versioned PDF/A4/thermal/QR documents render correctly and QR responses expose minimum authorized expiring/revocable data.
- [ ] Delivery evidence and numbered gate pass are complete; Gate independently verifies live vehicle/pass state, cannot bypass blockers, and release closes atomically without reopening later.

