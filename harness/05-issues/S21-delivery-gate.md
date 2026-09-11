# S21 — Closure, delivery evidence, and gate verification

Status: Complete
Implements: R-089, R-090, R-091, R-092, R-093, R-094, R-095, R-096

## Outcome
Render controlled documents and release vehicles only through evidenced closure and independent valid gate verification.

## Acceptance criteria
- [x] Plain-language closure blockers cover work, QC, material, billing, payment/credit, incident, evidence, and gate; any permitted override satisfies full maker-checker/re-auth evidence.
- [x] Versioned PDF/A4/thermal/QR documents render correctly and QR responses expose minimum authorized expiring/revocable data.
- [x] Delivery evidence and numbered gate pass are complete; Gate independently verifies live vehicle/pass state, cannot bypass blockers, and release closes atomically without reopening later.

## Evidence

- `production/src/delivery-gate.ts` exposes membership-scoped readiness, evidenced maker-checker overrides, complete private delivery evidence, versioned inert document rendering, digest-only expiring/revocable QR verification, fiscal gate-pass allocation, and independent atomic release.
- `production/db/migrations/021_delivery_gate.sql` persists private document/evidence controls, digest-only QR tokens, never-reused scoped sequences, append-only delivery/release/command evidence, an atomic locked release function, optimistic versions, and forced tenant/branch RLS.
- `production/tests/delivery-gate.test.ts` proves eight public/storage behaviors through vertical RED/GREEN cycles, including every blocker, override separation/re-auth, all six document families, minimum QR disclosure, issue-before-ready and duplicate-active-pass denial, expired-pass replacement without number reuse, identity mismatch, issuer/verifier separation, and immutable delivered closure.
- Focused tests and production typecheck pass locally. No vehicle release, document transmission, provider call, deployment, external hardware access, or customer message occurred. Representative A4/thermal/PDF render certification, scanner/camera/device validation, qualified India finance/document review, and authorized deployment remain external prerequisites.
