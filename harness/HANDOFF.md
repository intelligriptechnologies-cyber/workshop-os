# WorkshopOS implementation handoff

Updated: 2026-09-11
Current branch: `prem-dev`
Completed slice: S21<br>
Next slice: S22 — Guided boards, curated reports, drill-through, and protected exports

## Durable state

- The canonical BRD contains R-001 through R-119; decisions D-001 through D-035 remain frozen through S21 and traceability is CLEAN.
- S00-S28 specifications live in `harness/05-issues/`. `BRD.md` remains a pointer and the React/sql.js demo remains a behavioral reference only.
- S21 consumes immutable readiness projections owned by S16-S20 and owns delivery evidence, controlled closure exceptions, document/QR verification, gate-pass issuance, independent release, and final operational closure without changing closed finance.

## S21 evidence

- `production/src/delivery-gate.ts` returns all eight closure blocker categories with guided next actions and recognizes only configured, evidenced, independently approved overrides with recent checker authentication.
- Six operational document families use snapshotted template versions and inert private PDF/A4/thermal artifacts. Opaque QR tokens are stored as digests and disclose only type, public reference, validity, and status before expiry/revocation.
- Complete identity, odometer, acknowledgement, signature/photo, and exception evidence precedes a tenant/branch/type/financial-year numbered pass. Gate/Security rechecks live pass time, all controls, and vehicle identity; the issuer cannot verify their own pass.
- Successful release atomically appends one immutable release/closure record, marks the pass released and Job delivered, and preserves the original closed financial status. Warranty/comeback remains the separately linked S17 route.
- `021_delivery_gate.sql` supplies forced tenant/branch RLS, private/digest-only controls, locked never-reused allocation, append-only evidence and command receipts, optimistic versions, and an atomic gate-release function.
- Eight focused tests pass, including duplicate active-pass rejection and expired-pass replacement with a new non-reused number. No release, document transmission, provider call, deployment, hardware use, or customer message occurred. Representative PDF/A4/thermal renderer certification, scanner/camera/device validation, qualified India finance/document review, operational release rehearsal, and authorized deployment remain external prerequisites.

## Verification

- `npm run test:production`: 149/149 passed.
- `npm run test:production:typecheck`: passed.
- `npm run test:harness`: passed — 119 requirements, 29 slices, 22 contiguous complete, no orphans.
- `npm run build`: passed (TypeScript plus Vite production build).
- `npm run test:e2e`: 7/7 passed.
- `git diff --check`: passed.

## S22 first action

Read S22, R-097 through R-101, D-001/D-012/D-017/D-018/D-028/D-030, and the role/action/audit contracts from S02, S10, and S21. Start with one failing public-interface test proving a role-scoped guided board explains live ownership, urgency, blocker, capacity/delay context, and the permitted next action in plain language without leaking other tenants, branches, roles, or protected financial fields.

## Guardrails

- Preserve unrelated user changes and demo behavior; derive tenant/branch authority from membership and force PostgreSQL RLS.
- Reports and drill-through must use defined metric semantics, permission-filtered tenant/branch scope, reproducible as-of state, and protected export evidence; do not create an unrestricted query builder.
- Representative production reporting scale, operational role usability, finance metric review, export watermark/file controls, and authorized deployment remain external prerequisites. Use local substitutes only; do not export live data, release vehicles, message customers, deploy, or push GitHub.
