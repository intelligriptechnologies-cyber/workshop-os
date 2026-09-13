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
- [x] S24 — Complete locally — Tenant/branch-scoped source staging, explicit mapping, row-level manifests, fingerprinted idempotent commit, exact reconciliation, and acceptance blocking with an inert representative rehearsal.
- [x] S25 — Complete locally — Cross-layer tenant/branch/role isolation, shared-device and public-token controls, offline/replay/concurrency negatives, trusted-scanner private media, and cross-domain invariant release gates.
- [x] S26 — Complete locally — Exactly-once async recovery, tenant-safe correlated telemetry, deterministic target-shape p95 and restore rehearsals, SLO/health alerts, and fail-closed external evidence gates; deployed load, availability, backup restore, and regional DR exercises remain external.
- [x] S27 — Complete locally — Deterministic accessibility/client/document/scan/usability contracts and append-only evidence storage; manual assistive-tech, real-device/browser, printer, and representative-staff proof remain external.
- [x] S28 — Complete locally — Immutable no-fork playbook, exact 14-day parallel reconciliation, prerequisite and maker-checker go/no-go, cutover/rollback evidence, 28-day hypercare thresholds, and same-release second-tenant comparison; real pilot execution remains external.

## Per-slice completion gate

- [x] Acceptance tests and applicable regression suite pass through S28.
- [x] Requirement mappings and traceability remain clean through S28.
- [x] Checklist, decision ledger (if affected), owning issue evidence, and final handoff are updated through S28.
- [x] External prerequisites/blockers and evidence are recorded through S28.
- [x] Slice is committed locally with its ID; no GitHub push is performed.

## Executable local stack

- [x] Docker Compose runs PostgreSQL 17 and the built PWA/API with health-ordered startup.
- [x] All 28 SQL migrations execute on a clean real database and are checksum tracked.
- [x] The API connects as a non-superuser, non-`BYPASSRLS` application role.
- [x] A real HTTP/database smoke test proves tenant spoof resistance, idempotency, audit/outbox persistence, and cross-tenant/cross-branch RLS denial.
- [ ] Replace the browser-local `sql.js` repositories behind every rich PWA journey screen with PostgreSQL-backed `/api/v1` repositories. Only the S01 work-item tracer bullet is connected today.

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
- [x] Admin management hub with validated user CRUD, contextual business creation paths, and archive/void semantics.
- [x] Typed cross-entity/status search with count, Clear, stable selection, and explicit no-results behavior.
- [x] Responsive searchable/paginated Jobs, Customers, Vehicles, and Media list views.
- [x] Role-specific desktop/mobile visual redesign.
- [x] PWA manifest/service worker/offline shell and local persistence.
- [x] Demo build, login, reception persistence, linked-workflow, and screenshot verification.
