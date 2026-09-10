# WorkshopOS production business requirements document

Version: 1.0  
Status: FROZEN  
Approved source: production BRD and implementation plan supplied on 2026-09-10

## Problem

Workshop businesses cannot reliably reconcile what a customer requested, what was approved, what work occurred, what material physically moved, what passed quality control, what was billed/paid, and whether a vehicle was safely released. WorkshopOS provides one tenant-isolated, evidence-backed operational record while presenting simple next actions to each role.

## Goals

- Cover the complete appointment-to-delivery journey and its controlled recovery paths.
- Make daily work usable for non-technical staff through role-specific queues and plain language.
- Make custody, scope, stock, quality, finance, and release decisions independently auditable.
- Serve multiple businesses and branches without cross-tenant leakage or configuration drift.
- Integrate safely with India-first tax, Tally, Cashfree, messaging, scanning, and document workflows.

## Non-goals

Payroll/attendance, a full general ledger, GST-return filing, sales CRM/campaigns, insurance-claim workflows, loyalty/membership, vendor self-service, a full customer application, a public marketplace, multi-country statutory certification, self-service SaaS checkout, and predictive AI.

## Requirements

### Tenancy, identity, authorization, and audit

### R-001 Tenant boundary
Every operational record and side effect belongs to one tenant; branch-scoped records also belong to an authorized tenant branch. [D-001, D-017]

### R-002 Default roles
New tenants receive Platform Super Admin, Business Owner/Admin, Workshop/Branch Manager, Reception, Service Advisor, Technician, Store, Accounts/Cashier, and Gate/Security role templates. [D-004]

### R-003 Granular permissions
Tenants may combine roles through granular permissions without losing individual accountability. [D-004]

### R-004 Individual identity
Every employee uses an individual identity; shared generic employee accounts are prohibited. [D-004]

### R-005 Shared-device switching
Registered shared devices support short PIN user switching, lockout, and attributable sessions. [D-004]

### R-006 MFA policy
MFA is mandatory for Platform Super Admin and configurable by tenants for staff. [D-004]

### R-007 Sensitive re-authentication
Sensitive actions require a configurable recent-authentication window and record the authentication context. [D-004, D-005]

### R-008 Maker-checker policy
Discounts, procurement, stock adjustments, excess use/waste, invoice/payment reversals, credit exceptions, cancellations, reopening, and closure overrides use configurable maker-checker thresholds. [D-005]

### R-009 Support access
Platform support access is time-bound, reasoned, tenant-visible, separately authorized, and fully audited. [D-017]

### R-010 Audit evidence
Critical actions preserve actor, membership, branch, timestamp, reason, old/new state or ledger references, approval chain, request identity, and audit reference. [D-012, D-018]

### Configuration, API, and shared data rules

### R-011 Stable core lifecycle
The core Visit and Job lifecycle has stable platform semantics even when tenant workflow steps are configured. [D-006, D-007]

### R-012 Versioned masters
Services, categories, packages, recipes, prices, taxes, workflows, QC/photo checklists, reasons, and document templates are effective-dated immutable versions after use. [D-007]

### R-013 Snapshot configuration
Approved/active job scope snapshots every applicable price, tax, workflow, recipe, checklist, and policy version. [D-024]

### R-014 Configuration non-retroactivity
Published configuration changes never alter approved or active work retroactively. [D-024]

### R-015 Versioned REST API
Internal clients use versioned JSON REST under `/api/v1`; platform operations use a separately authorized surface. [D-016]

### R-016 Trusted context
Tenant and branch authorization derives from authenticated membership, never solely from a client-supplied identifier. [D-017]

### R-017 Optimistic concurrency
Mutable resources expose version tokens and reject stale writes using `If-Match` or an equivalent contract. [D-018]

### R-018 Idempotent commands
Authoritative commands require idempotency keys and return the committed resource version and audit reference on original and safe replay responses. [D-018]

### R-019 Exact money and quantity
Money uses currency minor units; quantities use fixed decimal precision and explicit, validated UOM conversions. [D-021]

### R-020 Document sequences
Document numbers are atomically allocated by tenant, branch, document type, and financial year and are never reused. [D-023]

### Customer, vehicle, appointment, and reception

### R-021 Customer contacts
A customer supports multiple named contacts, typed communication details, consent, preferred contact, and payer relationships. [D-001]

### R-022 Vehicle identity
Vehicles preserve registration/VIN identity, attributes, odometer history, and tenant-visible service history. [D-001]

### R-023 Ownership history
Vehicle ownership changes are effective-dated and never rewrite prior customer/job history. [D-012]

### R-024 Duplicate detection
Customer and vehicle create/update/search surfaces detect configurable exact and probable duplicates. [D-001]

### R-025 Controlled merge
Authorized merges choose canonical records, preserve aliases/history, reject unsafe conflicts, and are reversible only through an audited compensating operation. [D-012]

### R-026 Appointment management
Staff can create, reschedule, cancel, mark no-show, arrive, and convert appointments with reasoned status history. [D-001]

### R-027 Capacity planning
Appointment availability accounts for configurable branch resources, skills, bays, staff, duration, buffers, overbooking authority, and closures. [D-007]

### R-028 Reception check-in
Check-in atomically creates a Visit and linked draft Job Card with customer, vehicle, advisor, custody, request, and promised-handoff data. [D-006]

### R-029 Reception evidence and offline draft
Configurable reception evidence includes KM, fuel, keys, accessories, condition photos, acknowledgement, and safe offline drafts; authoritative ledger actions remain blocked offline. [D-006, D-025]

### Inspection, estimates, approvals, and communication

### R-030 Advisor ownership
Every Job has one accountable advisor, with audited reassignment and visible queues. [D-006]

### R-031 Advisor inspection
Advisors record structured and free-text inspection findings, recommended scope, evidence, follow-up, and promised delivery. [D-007, D-025]

### R-032 Estimate composition
Estimates support configured service/package/material/labour lines, payer allocation, quantity, price, discounts, tax, notes, validity, and totals. [D-007, D-021]

### R-033 Estimate versions
Each sent/approved estimate is an immutable numbered version linked to prior versions and evidence. [D-008]

### R-034 Approval choices
Customers can approve all, approve an allowed subset, reject, or request clarification; outcomes preserve line-level scope and evidence. [D-008, D-019]

### R-035 Secure customer actions
Customer actions use opaque, expiring, single-purpose, replay-protected public tokens and capture identity/evidence without exposing tenant data. [D-019]

### R-036 Manual approval fallback
Authorized staff can record evidenced manual approval/rejection with channel, customer identity, reason, attachment, and maker-checker policy where configured. [D-005, D-008]

### R-037 Supplementary work
Added work after initial approval is a new supplementary estimate and cannot activate until separately approved. [D-008]

### R-038 Scope activation
Only approved scope activates planned work/material and the activation atomically snapshots configuration versions. [D-006, D-024]

### R-039 Action inbox
Each staff role receives a prioritized, filterable in-app action inbox with plain-language blockers, owner, due state, and guided next action. [D-028]

### R-040 Notification delivery
Events can produce in-app, push, WhatsApp, and SMS-fallback delivery with consent, template version, retry, provider status, failure reason, and opt-out. [D-028]

### Work planning and technician execution

### R-041 Work plan
Approved scope becomes a plan of tasks, dependencies, skills, bays, estimated effort, checklists, materials, priorities, and promised delivery risk. [D-007, D-024]

### R-042 Multi-technician assignment
Tasks support multiple technicians, a responsible technician, audited reassignment, capacity warnings, and concurrent-safe updates. [D-017, D-018]

### R-043 Task progression
Authorized technicians start, pause with reason, resume, block, hand off, and complete tasks while preserving elapsed and status history. [D-011]

### R-044 Task completion evidence
Configured checklist and photo/evidence requirements block task completion until satisfied or explicitly overridden. [D-005, D-025]

### R-045 Shared job timeline
Reception, advisors, technicians, Store, QC, accounts, and gate roles see a permission-filtered chronological job timeline. [D-010]

### R-046 Technician mobile workflow
The Android Chrome PWA prioritizes My Tasks, large controls, camera/scanner capture, material actions, checklist steps, blockers, and next actions. [D-030]

### R-047 Draft synchronization
Non-ledger technician drafts survive interruption, retry idempotently, expose conflicts, and permit user-controlled recovery. [D-018]

### R-048 Offline safety
Offline mode clearly distinguishes drafts from committed state and blocks stock, approval, financial, QC override, closure, and gate postings. [D-018]

### R-049 Scanning
Camera and hardware barcode/QR scanning validate tenant, item/document, state, and authorization with an audited manual fallback. [D-017]

### Inventory and procurement

### R-050 Warehouse and bin
Inventory is held by tenant, branch, warehouse, and optional bin with authorization scoped to those locations. [D-017]

### R-051 Item and UOM
Items define category, SKU/barcodes, stock/base/purchase/issue UOMs, exact conversions, costing/tax metadata, reorder policy, and active state. [D-021]

### R-052 Lot and expiry
Stock can be tracked by lot/batch/serial, manufacture/expiry dates, status, and FEFO policy with reasoned exceptions. [D-012]

### R-053 Roll and remnant
Length/area materials support rolls, cuts, usable remnants, minimum-use rules, scrap, and traceability from receipt through job use/return. [D-009, D-021]

### R-054 Stock ledger
Every posted movement creates append-only, balanced quantity/value ledger entries with source, location, lot/remnant, actor, time, reason, and audit reference. [D-009, D-012]

### R-055 Stock transfer
Transfers use dispatch/in-transit/receipt states, dual-location evidence, discrepancy handling, and no double counting. [D-010, D-012]

### R-056 Blind count
Cycle/physical counts support frozen scope, blind entry, recounts, investigation, maker-checker adjustment, and reconciliation evidence. [D-005, D-012]

### R-057 Suppliers
Tenants maintain suppliers, contacts, tax details, terms, addresses, item relationships, status, and duplicate controls. [D-007]

### R-058 Requisition and PO
Purchase requisitions and purchase orders support versioned lines, approvals, partial fulfillment, cancellation, tax, landed-cost inputs, and immutable posting history. [D-005, D-012]

### R-059 GRN
GRNs record received/rejected quantities, lots/rolls, documents, inspection, tax/value, discrepancy, and stock posting idempotently. [D-018]

### R-060 Purchase return
Purchase returns reference received stock, authorization, quantities/lots/value, shipment evidence, and compensating stock/financial effects. [D-012]

### R-061 Material request and issue
Materials are requested for an approved Job/task and Store issues only authorized available stock against that demand or a separately approved stock reason. [D-009]

### R-062 Consumption, return, and waste
Technicians record consumption and waste; Store verifies physical returns; each outcome retains quantity, UOM, lot/remnant, reason, and evidence. [D-010]

### R-063 Material reconciliation
A Job/task cannot reconcile unless `Issued = Consumed + Verified Return + Wastage + Approved Variance`; Manager approval is required for variance/excess thresholds. [D-005, D-009, D-010]

### Quality, rework, warranty, and incidents

### R-064 Independent QC
Task completion never implies QC pass; an authorized independent QC actor performs the applicable snapshotted checklist. [D-011, D-024]

### R-065 QC evidence
QC records item-level pass/fail/not-applicable, readings, notes, photos, actor, time, checklist version, and result. [D-011, D-025]

### R-066 QC failure
A failed QC item creates reasoned rework linked to the failed evidence and prevents completion/release. [D-011]

### R-067 Rework loop
Rework is assigned, executed, evidenced, and independently re-inspected without erasing prior task or QC history. [D-011, D-012]

### R-068 Emergency QC override
An emergency QC override requires re-authentication, configured approval, reason/evidence, customer/release visibility, and audit history. [D-005, D-011]

### R-069 Warranty policy
Configured service/item warranty terms are snapshotted on the original delivered Job and visible during claim intake. [D-014, D-024]

### R-070 Comeback job
A warranty/comeback creates a linked new Visit/Job with classification, diagnosis, responsibility, scope, cost ownership, and outcome; the original finance record stays closed. [D-014]

### R-071 Custody incident
Damage/loss/safety incidents during custody have independent severity, evidence, notifications, owner, actions, and vehicle/job links. [D-015]

### R-072 Incident resolution and legal hold
Incident resolution requires authorized evidence and acknowledgement; legal hold prevents applicable purge/expiry until separately released. [D-015, D-029]

### Billing, Tally, payments, and settlement

### R-073 Billing readiness
Billing is blocked until configured completion, QC, material reconciliation, and supplementary-scope requirements pass. [D-013]

### R-074 Invoice authority
Each tenant selects WorkshopOS-native or Tally-authoritative invoicing; the authority is explicit on every billing record. [D-026]

### R-075 Native GST invoice
Native invoices calculate India GST supply/place/tax treatment, taxable values, discounts, rounding, and payer totals using snapshotted rules and exact minor units. [D-021, D-022, D-024]

### R-076 Invoice payer allocation
A Job supports one finalized invoice per payer, with line allocation preventing omission or duplicate billing. [D-012]

### R-077 Immutable invoice
Finalized invoices and their numbers are immutable; corrections use linked credit/debit notes or cancellation/reissue where legally allowed and approved. [D-005, D-012, D-023]

### R-078 Financial-year rollover
Document allocation and tax reporting handle tenant timezone and India financial-year rollover without collisions or number reuse. [D-022, D-023]

### R-079 Tally connector
The connector exports/imports the agreed invoice lifecycle idempotently for the current and two prior supported TallyPrime releases. [D-018, D-026]

### R-080 Tally file fallback
When direct integration is unavailable, authorized users can generate/import controlled files with validation, reconciliation, and duplicate prevention. [D-026]

### R-081 Tally reconciliation
WorkshopOS records Tally identifiers/status/errors and exposes unresolved amount, tax, payer, and posting mismatches without silently changing authority. [D-012, D-026]

### R-082 Advances
Advances are immutable receipt/liability transactions allocated to a customer/Visit/Job/invoice and corrected by approved compensating entries. [D-012, D-027]

### R-083 Split and manual payments
Invoices support partial and split cash, UPI, card, bank, credit, and configured manual modes with reference/evidence and duplicate controls. [D-027]

### R-084 Cashfree links
Authorized staff create expiring Cashfree payment links for the correct tenant/customer/amount and surface provider status without treating redirects as payment proof. [D-019, D-027]

### R-085 Payment webhooks
Cashfree webhooks preserve raw bodies, verify signatures, process idempotently, tolerate reordering, and post payment only from authoritative provider evidence. [D-020, D-027]

### R-086 Credit policy
Formal customer credit records approved limits, terms, approvers, outstanding exposure, exceptions, and delivery eligibility. [D-005, D-027]

### R-087 Refunds and chargebacks
Refunds, reversals, disputes, and chargebacks link to original payments and use approved append-only financial events. [D-005, D-012, D-027]

### R-088 Settlement reconciliation
Provider settlements reconcile gross payments, fees, taxes, refunds, chargebacks, and net bank amounts, exposing unmatched or duplicate entries. [D-027]

### Closure, documents, delivery, and gate

### R-089 Closure readiness
Closure evaluates work, QC, material, billing, payment/credit, incident, delivery-evidence, and gate blockers and explains each in plain language. [D-013]

### R-090 Closure override
Any allowed closure override is separately permissioned, recently authenticated, maker-checker approved, reasoned, evidenced, and audited. [D-005, D-013]

### R-091 Operational documents
The system renders versioned PDF/A4/thermal documents and QR references for estimates, Job Cards, material documents, invoices, receipts, and gate passes. [D-007]

### R-092 QR authorization
A scanned document QR reveals only the minimum authorized verification response, expires/revokes where applicable, and cannot grant broader record access. [D-019]

### R-093 Delivery evidence
Delivery records date/time, final odometer, delivered-by/to identity, acknowledgement, configured signature/photo evidence, and any exceptions. [D-013, D-025]

### R-094 Gate pass issuance
A valid numbered gate pass is issued only after closure-readiness policy succeeds and records vehicle, Job, branch, validity, and release conditions. [D-013, D-023]

### R-095 Independent gate verification
Gate/Security independently scans or enters a gate pass, verifies current validity and vehicle identity, records the release, and cannot bypass blockers. [D-013]

### R-096 Delivered closure
Successful release atomically closes the operational journey; later warranty/comeback activity creates linked new records rather than reopening finance. [D-014]

### Management, SaaS operations, and platform data

### R-097 Guided operational boards
Role boards show live queues, capacity, delays, blockers, responsibility, and guided next actions using non-ERP language. [D-001, D-030]

### R-098 Curated reports
Authorized users receive operational, inventory, profitability, finance, customer, staff, QC/rework, and audit reports with defined metrics and drill-through. [D-001]

### R-099 Protected exports
Report/data exports are permissioned, tenant/branch filtered, watermarked or manifest-backed where appropriate, asynchronous, expiring, and audited. [D-017, D-020, D-025]

### R-100 Tenant provisioning
Platform staff provision tenant, plan, entitlements, base currency/timezone, branches, owner membership, configuration template, quotas, and audit state idempotently. [D-018, D-022]

### R-101 Entitlement enforcement
Plans and entitlements are enforced server-side and changes are versioned/audited without corrupting historical data. [D-017]

### R-102 Suspension/reactivation
Suspension blocks configured access/commands while preserving data and necessary platform operations; reactivation safely restores authorized use. [D-017]

### R-103 Tenant export and retention
Authorized tenant export is complete, manifest/checksum backed, tenant-scoped, protected, and consistent with retention/legal holds. [D-025, D-029]

### R-104 Controlled purge
Purge requires expiry eligibility, legal-hold checks, maker-checker approval, dry-run inventory, evidence, and tenant-scoped deletion across database, objects, caches, queues, and exports. [D-005, D-017, D-029]

### Security, reliability, migration, usability, and rollout

### R-105 Database isolation
Shared PostgreSQL tables carry mandatory tenant keys and RLS policies; automated negative tests deny cross-tenant and unauthorized-branch access. [D-017]

### R-106 Side-channel isolation
Object paths, signed access, queues, caches, exports, search/report data, metrics, and logs are tenant-scoped and tested against leakage. [D-017, D-025]

### R-107 Media security
Uploads remain private and are allow-listed, quota-limited, checksum-verified, malware-scanned, status-gated, and access-audited. [D-025]

### R-108 Async reliability
Transactional outbox and durable workers provide idempotent notifications, documents, reports, Tally, Cashfree, retry/dead-letter, replay, and observable recovery. [D-020]

### R-109 Performance
At target load, routine requests meet p95 2 seconds and authoritative postings p95 3 seconds excluding provider completion. [D-030]

### R-110 Capacity
The release supports 500 tenants; 25 branches, 500 users, 150 concurrent users per tenant; 300 visits/branch/day; and ten years of history. [D-030]

### R-111 Availability and recovery
Production achieves 99.9% monthly availability, RPO at most 15 minutes, and RTO at most 2 hours with tested restoration. [D-030]

### R-112 Observability
Structured tenant-safe logs, metrics, traces, audit correlation, provider/queue health, SLOs, and actionable alerts support incident diagnosis without exposing sensitive data. [D-017, D-030]

### R-113 Idempotent onboarding import
Imports stage tenant-scoped source data, validate/map rows, support dry runs, reject explicitly, commit idempotently, and produce source-to-target manifests. [D-018, D-031]

### R-114 Migration reconciliation
Migration acceptance reconciles entity counts, duplicates, opening stock/value, outstanding advances/payments/credit, and document balances with repeatable reruns. [D-031]

### R-115 Accessibility
Staff and customer surfaces meet WCAG 2.2 AA, including keyboard, focus, contrast, labels, errors, target size, reflow, and assistive technology checks. [D-030]

### R-116 Supported clients
Production supports current Android Chrome PWA and desktop Chrome/Edge, with functional core flows on current iOS Safari and safe camera/scanner/manual fallbacks. [D-030]

### R-117 Staff usability
After at most two hours training, at least 90% of representative staff complete critical role scenarios unaided with zero critical-control errors. [D-030]

### R-118 Pilot and cutover
Two weeks of parallel reconciliation precede controlled cutover with rehearsed rollback, followed by four weeks of measured hypercare. [D-031]

### R-119 Repeatable second tenant
A second tenant is onboarded using the same provisioning, configuration, import, training, cutover, isolation, and acceptance playbook without code forks. [D-001, D-031]

## Explicit deferred defaults

- Provider, AWS, DNS, Tally, finance-review, pilot-user, and pilot-device inputs are external prerequisites. Local/test substitutes remain valid until an acceptance step genuinely requires them. [D-032, D-033]
- Tenant-specific templates, thresholds, evidence sets, capacity rules, tolerances, and wording use versioned configuration. The safest simplest default denies sensitive exceptions. [D-005, D-007]
- The demo SQLite dataset is not a production migration source. [D-002]
- Non-India tax profiles are configurable but not certified. [D-022]

## Decision ledger appendix

The canonical verbatim decision ledger is [`02-ledger.md`](02-ledger.md). It is incorporated by reference to avoid maintaining a second mutable copy; its entries D-001 through D-035 are part of this frozen BRD.
