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

- [x] S05 — Complete locally — Tenant/branch-scoped customer contacts/payers and vehicle identity/history, duplicate detection, effective ownership, controlled canonical merge, and audited compensating recovery.
- [x] S06 — Complete locally — Versioned/idempotent appointment lifecycle, reasoned history, closure/bay/staff/skill/buffer capacity, serialized reservations, permissioned overbooking, and durable reception handoff event.
- [x] S07 — Complete locally — Atomic appointment/walk-in Visit plus draft Job, configured private custody evidence and acknowledgement, independent incident notification/case intake, and visible conflict-aware offline drafts with authoritative postings blocked.
- [x] S08 — Complete locally — Accountable advisor queues/reassignment, configured evidenced inspection, scoped notes, recommended-scope handoff, owned follow-ups, and reasoned promised-delivery risk.
- [x] S09 — Complete locally — Exact payer-aware estimate versions, secure evidenced public/manual decisions, supplementary approval, immutable snapshots, and exactly-once work/material activation.
- [x] S10 — Complete locally — Membership/role-scoped prioritized actions and durable consent-aware in-app/push/WhatsApp/SMS-fallback delivery with retry, status, dead-letter, and replay controls.
- [x] S11 — Complete locally — Exact-snapshot DAG work planning, skill/bay/capacity risk, concurrency-safe multi-technician responsibility, audited reassignment, permission-filtered shared timeline, and S12-only outbox.
- [x] S12 — Complete locally — Assignee-scoped large-touch My Tasks, reasoned elapsed progression/handoff, snapshotted clean private evidence gates, independent override, validated scanning/manual fallback, and conflict-safe durable drafts with offline posting blocks.

## Procurement, inventory, and quality

- [x] S13 — Complete locally — Scoped warehouse/bin and item/UOM/lot/roll masters, exact balanced stock ledger, FEFO/remnants/scrap, in-transit discrepancy-controlled transfers, and blind maker-checker counts.
- [x] S14 — Complete locally — Controlled supplier masters, versioned requisition/PO approvals and partials, exact evidenced GRNs through S13, and authorized compensating purchase returns.
- [x] S15 — Complete locally — Approved task demand, partial Store issue, independently approved substitution/non-Job reason, technician consumption/waste, Store-verified exact-lot return, threshold variance, and exact reconciliation.
- [x] S16 — Complete locally — Independent snapshotted QC, clean item evidence, blocking rework execution/reinspection, and controlled emergency override with explicit release visibility.
- [x] S17 — Complete locally — Immutable delivered warranty terms, separately linked classified comeback Visit/Job records, evidenced incident escalation/resolution, and independently releasable record/media legal holds.

## Finance and delivery

- [x] S18 — Complete locally — Readiness-gated native India GST, exact payer allocation, immutable fiscal documents/numbers, private render boundary, and approved compensating credit/debit/cancel-reissue records.
- [x] S19 — Complete locally — Explicit Tally authority, duplicate-safe direct and controlled-file exchange across three representative release generations, visible reconciliation, and durable retry/dead-letter/replay evidence.
- [x] S20 — Complete locally — Exact advances and split/manual payments, inert scoped Cashfree links, authoritative signed webhooks, formal credit eligibility, maker-checker corrections, and visible settlement reconciliation.
- [x] S21 — Complete locally — Plain-language readiness and controlled override, private versioned documents/QR, complete delivery evidence, scoped fiscal gate passes, and independent atomic release.

## Management and SaaS operations

- [x] S22 — Complete locally — Permission-guided role boards, defined exact curated metrics, protected as-of drill-through, and private manifest-backed asynchronous exports.
- [x] S23 — Complete locally — Separately authorized tenant lifecycle, versioned entitlements, scoped support, complete protected export, hold-aware retention, and maker-checker purge simulation.
- [ ] S24 — Not started — Idempotent onboarding import and reconciliation.
- [ ] S25 — Not started — Security, tenant-isolation, authorization, concurrency, and invariant release gates.
- [ ] S26 — Not started — Scale, latency, integration recovery, observability, backup, and disaster recovery.
- [ ] S27 — Not started — Accessibility, device, document, scanning, training, and staff-usability gates.
- [ ] S28 — Not started — Parallel pilot, cutover, rollback, hypercare, and repeatable second-tenant onboarding.

## Per-slice completion gate

- [x] Acceptance tests and applicable regression suite pass through S23.
- [x] Requirement mappings and traceability remain clean through S23.
- [x] Checklist, decision ledger (if affected), owning issue evidence, and handoff are updated through S23.
- [x] External prerequisites/blockers and evidence are recorded through S23.
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
