# WorkshopOS decision ledger

Status: FROZEN through S10. S01 through S10 introduced no decision amendments. Amendments require requirement, slice, acceptance, traceability, checklist, and handoff updates.

D-001 | Build an India-first multi-tenant workshop SaaS spanning appointment through delivery | Single-workshop custom app; inventory-only tool | The operational failure is broken end-to-end reconciliation.

D-002 | Keep the existing React/sql.js application as a behavioral demo only | Evolve browser-local SQLite into production | Browser-local state cannot satisfy tenancy, isolation, concurrency, audit, or recovery controls.

D-003 | Use a React/TypeScript PWA, TypeScript modular-monolith API, PostgreSQL, private object storage, durable queues, Cognito, and AWS Mumbai | Native mobile first; microservices first; alternate production stack | This is the approved production architecture and minimizes early distributed-system overhead.

D-004 | Use individual identities, granular permissions, optional combined roles, registered shared-device PIN switching, mandatory platform-admin MFA, configurable staff MFA, and recent re-auth for sensitive actions | Shared staff accounts; fixed roles only | Accountability and workshop usability are both required.

D-005 | Use configurable maker-checker thresholds for sensitive commercial, inventory, job, and financial actions | Uncontrolled admin override; hard-coded thresholds | Tenants need proportional control with auditability.

D-006 | A reception check-in atomically creates a Visit and linked draft Job Card; approved scope activates work | Create Job Card only after estimate | Custody and accountability begin at reception.

D-007 | Keep lifecycle stages stable while versioning tenant-configurable services, recipes, checklists, workflows, prices, taxes, documents, and reasons | Fully tenant-defined lifecycle | Cross-tenant operability requires stable core semantics.

D-008 | Approved estimates are immutable versions and added work uses supplementary approval | Edit an approved estimate in place | Customer scope evidence must remain defensible.

D-009 | Enforce `Issued = Consumed + Verified Return + Wastage + Approved Variance` and require Job/task or authorized reason for every issue | Periodic aggregate-only stock reconciliation | Per-job control closes the primary leakage gap.

D-010 | Technician records consumption/waste, Store verifies returns, and Manager approves variance | A single role controls all stock outcomes | Separation of duties reduces error and misuse.

D-011 | QC is independent of task completion; emergency bypass needs audited authorization | Task completion implies QC pass | Completion and acceptance are different controls.

D-012 | Posted inventory and finance records are corrected only with compensating entries | Destructive edits | Ledger history must remain reconcilable.

D-013 | Delivery requires complete work, passed QC, reconciled material, finalized billing, satisfied payment/credit policy, delivery evidence, and a valid independently verified gate pass | Advisor-only release | Vehicle release is the final cross-domain control.

D-014 | Warranty/comeback creates a linked new Job and preserves the original financial record | Reopen the original job/invoice | History and financial finality must remain intact.

D-015 | Vehicle-custody incidents have dedicated evidence, escalation, resolution, and legal hold | Store incident notes on Job Card only | Custody disputes need a defensible case record.

D-016 | Internal APIs are versioned JSON REST under `/api/v1`; platform operations use a separately authorized surface | GraphQL-first; unversioned API | The approved contract favors explicit, stable command surfaces.

D-017 | Derive tenant/branch authority from authenticated membership; enforce tenant keys and PostgreSQL RLS | Trust tenant IDs from clients | Tenant isolation must be defense in depth.

D-018 | Mutable writes use version tokens; authoritative commands use idempotency keys and return resource version plus audit reference | Last-write-wins; client-only deduplication | Concurrent workshop activity must be safely retryable.

D-019 | Public customer actions use opaque expiring single-purpose replay-protected tokens and capture evidence | Customer accounts in V1; reusable links | Customers need low-friction, narrow access.

D-020 | Preserve raw webhook bodies for signature verification and process with transactional outbox/durable workers | Inline provider side effects | Reliability requires idempotent asynchronous boundaries.

D-021 | Store money in minor units; store quantities as fixed decimals with explicit UOM conversion | Floating-point amounts/quantities | Financial and material reconciliation must be exact.

D-022 | One base currency/timezone per tenant; full India GST; configurable non-certified tax profiles elsewhere | Multi-currency jobs in V1; global tax certification | India is the certified first market.

D-023 | Allocate immutable document numbers atomically by tenant, branch, type, and financial year; never reuse numbers | Global sequences; number recycling | Branch/statutory control and concurrency require scoped atomic sequences.

D-024 | Snapshot applicable configuration versions when scope becomes approved/active | Resolve live masters every time | Later configuration changes must not rewrite active history.

D-025 | Keep media private, allow-listed, quota-controlled, checksum-verified, malware-scanned, and tenant-scoped | Public object URLs; unrestricted uploads | Vehicle/customer evidence is sensitive and untrusted.

D-026 | Support either WorkshopOS-native or Tally-authoritative invoicing per tenant, including current plus two prior TallyPrime releases and file fallback | Force one accounting authority | Tenants have different accounting operating models.

D-027 | Use Cashfree for payment links while supporting manual/split payments, advances, refunds, chargebacks, settlements, and formal credit | Online-only payments; informal outstanding balance | Workshop payment reality needs multiple rails and explicit liability state.

D-028 | Use in-app actions, push, WhatsApp, and SMS fallback with consent/status/retry controls | Email-only or fire-and-forget messaging | Staff and customers need actionable, evidenced communication.

D-029 | Default statutory finance/audit/linked-job retention to eight years and photos to three years after closure, extended by warranty/legal hold | Indefinite retention; immediate deletion | Balances evidence, compliance review, and storage/privacy costs.

D-030 | Release gates are 99.9% monthly availability, p95 2s routine/3s posting, RPO 15m, RTO 2h, stated scale, WCAG 2.2 AA, and 90% critical-scenario success after at most two training hours | Qualitative performance/usability goals | Measurable criteria are required for production acceptance.

D-031 | Pilot with two weeks parallel reconciliation, controlled cutover/rollback, four weeks hypercare, and repeatable second-tenant onboarding | Big-bang launch | Reconciliation risk warrants an observable transition.

D-032 | External AWS/provider/DNS/Tally inputs use local/test substitutes until genuinely blocking; deployments, customer messages, enrollment, and production actions need explicit authority | Stop all work pending credentials; silently act externally | Implementation can progress safely without widening authority.

D-033 | Finance/tax production certification requires qualified India finance review | Treat engineering tests as statutory advice | Domain certification lies outside software verification.

D-034 | Any BRD change updates the ledger, requirements, slices, acceptance criteria, traceability, checklist, and handoff before implementation continues | Informal scope drift | The plan remains auditable across contexts.

D-035 | S00 mechanically verifies 119 requirements, 29 slices, bidirectional mapping, required artifacts, checklist baseline, and next handoff | Manual document inspection only | Executable continuity prevents context drift.
