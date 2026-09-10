# WorkshopOS production implementation checklist

Canonical scope: [`harness/03-prd.md`](harness/03-prd.md)<br>
Current handoff: [`harness/HANDOFF.md`](harness/HANDOFF.md)

Update this file, the owning slice, requirement coverage, decisions (when changed), and handoff after every completed slice.

## Foundation

- [x] S00 — Complete — Persist BRD, decisions, slice files, traceability, checklist, executable harness gate, and handoff.
- [x] S01 — Complete locally — Tenant-aware PWA/API/PostgreSQL-RLS/private-object/outbox vertical and deployable AWS boundary contract; authorized AWS deployment remains external.
- [x] S02 — Complete locally — Idempotent tenant provisioning, Cognito-compatible identity port, individual/combined permissions, branch scope, kiosk switching, MFA/re-auth, maker-checker, support access, and audit.
- [x] S03 — Complete locally — Versioned master CRUD/publication, immutable effective scope snapshots, exact minor-unit/UOM contracts, and atomic fiscal sequences.
- [x] S04 — Complete locally — Atomic lifecycle state table/blockers, optimistic/idempotent commands, maker-checker, reasoned cancellation/reopening/overrides, and append-only forced-RLS ledgers.

## Customer and workshop operations

- [ ] S05 — Not started — Customer/vehicle search, duplicate merge, and ownership history.
- [ ] S06 — Not started — Appointment and capacity management.
- [ ] S07 — Not started — Reception check-in, evidence, custody incidents, and offline drafts.
- [ ] S08 — Not started — Advisor inspection, ownership, follow-ups, and promised delivery.
- [ ] S09 — Not started — Versioned estimates, supplementary work, and customer approval.
- [ ] S10 — Not started — Action inbox, push, and WhatsApp/SMS delivery.
- [ ] S11 — Not started — Job planning, technician assignment, checklists, and shared timeline.
- [ ] S12 — Not started — Technician Android workflow, evidence, scanning, and draft synchronization.

## Procurement, inventory, and quality

- [ ] S13 — Not started — Warehouse, item, lot/roll, UOM, remnant, transfer, and stock-count ledger.
- [ ] S14 — Not started — Supplier, requisition, PO, GRN, and purchase-return workflow.
- [ ] S15 — Not started — Material request, issue, consumption, return, waste, and reconciliation.
- [ ] S16 — Not started — Manager QC and rework loop.
- [ ] S17 — Not started — Warranty/comeback Jobs and incident resolution.

## Finance and delivery

- [ ] S18 — Not started — Native tax invoice, payer allocation, immutable documents, and adjustments.
- [ ] S19 — Not started — Tally connector and file fallback for current plus two prior TallyPrime releases.
- [ ] S20 — Not started — Cashfree/manual payments, advances, credit, refunds, and settlement reconciliation.
- [ ] S21 — Not started — Closure controls, delivery evidence, and independent gate verification.

## Management and SaaS operations

- [ ] S22 — Not started — Guided boards, curated reports, drill-through, and protected exports.
- [ ] S23 — Not started — Tenant suspension, support access, export, retention, and purge.
- [ ] S24 — Not started — Idempotent onboarding import and reconciliation.
- [ ] S25 — Not started — Security, tenant-isolation, authorization, concurrency, and invariant release gates.
- [ ] S26 — Not started — Scale, latency, integration recovery, observability, backup, and disaster recovery.
- [ ] S27 — Not started — Accessibility, device, document, scanning, training, and staff-usability gates.
- [ ] S28 — Not started — Parallel pilot, cutover, rollback, hypercare, and repeatable second-tenant onboarding.

## Per-slice completion gate

- [x] Acceptance tests and applicable regression suite pass through S03.
- [x] Requirement mappings and traceability remain clean through S03.
- [x] Checklist, decision ledger (if affected), owning issue evidence, and handoff are updated through S03.
- [x] External prerequisites/blockers and evidence are recorded through S03.
- [x] Slice is committed locally with its ID; no GitHub push is performed.

## Demo baseline (completed before production programme)

This appendix is historical evidence only. It does not satisfy a production slice.

- [x] Browser-local sql.js persistence and seeded demo data.
- [x] Demo logins for admin, service advisor, reception, accounts, Store, and technician.
- [x] Common linked search by job/customer/vehicle/invoice.
- [x] Reception intake creating a linked `NEW` Job Card.
- [x] Advisor estimate/confirmation/follow-up/photo-placeholder flow.
- [x] Store material request/issue view and simplified reconciliation display.
- [x] Technician start/pause/complete, wash/photo placeholder, and simplified QC progression.
- [x] Accounts invoice/payment/receipt/gate-pass/closure demonstration.
- [x] Owner KPIs, funnel, blockers, revenue, inventory alerts, and data-flow view.
- [x] Role-specific desktop/mobile visual redesign.
- [x] PWA manifest/service worker/offline shell and local persistence.
- [x] Demo build, login, reception persistence, linked-workflow, and screenshot verification.
