# WorkshopOS branch map

Status: COMPLETE

This map records domain coverage, not design decisions. Resolutions are in `02-ledger.md`.

| Branch | Coverage | Remaining question |
| --- | --- | --- |
| Product boundary | India-first operational workshop SaaS; explicit non-goals | None |
| Tenancy | Tenant, branch, membership, entitlement, support access, suspension/purge | Provider account details are external prerequisites |
| Identity and access | Individual identities, combined roles, granular permissions, kiosk PIN switching, MFA, re-auth | Exact Cognito pool/identity-provider configuration is environment-specific |
| Configuration | Versioned service, package, recipe, pricing, tax, workflow, QC, document and reason masters | Initial tenant templates require pilot sign-off |
| Customer and vehicle | Multiple contacts, duplicate detection/merge, ownership history, search | Match weights require production-data tuning |
| Appointment/capacity | Resources, slots, arrival, conversion, exceptions | Pilot capacity rules require tenant configuration |
| Reception/custody | Visit plus draft Job Card, KM/fuel/keys/accessories/photos, acknowledgement, incidents, offline drafts | Mandatory photo sets are configurable |
| Advisor/estimate | Inspection, responsibility, promised delivery, immutable estimate versions, supplementary approval | Customer-facing wording requires tenant branding |
| Work execution | Planning, multi-technician assignment, tasks, evidence, scanning, mobile drafts | Exact service workflows come from versioned configuration |
| Materials | Warehouse, lot/batch/roll, UOM, remnant, transfer, count, request/issue/use/return/waste/variance | Item-specific tolerances are configurable |
| Procurement | Suppliers, requisitions, PO, GRN, landed cost, returns | Approval thresholds are configurable |
| Quality and recovery | Independent QC, rework, emergency override, comeback/warranty, custody incident | Emergency approver set is configurable |
| Finance | Native or Tally authority, tax, immutable documents, advances, split payments, credit, refunds, settlements | Qualified India finance certification is external |
| Delivery | Closure blockers, evidence, gate pass, independent gate verification | Branch delivery evidence policy is configurable |
| Communications | Action inbox, push, WhatsApp, SMS fallback, consent, retry and status | Provider credentials/templates are external |
| Documents/scanning | PDF/A4/thermal/QR, camera and hardware scanners, manual fallback | Printer/scanner device matrix needs pilot hardware |
| Reporting | Curated operational, stock, finance, profitability, staff, QC, audit reports; protected exports | Exact initial report catalogue can be trimmed only through a BRD change |
| Data/integration | REST v1, platform surface, optimistic concurrency, idempotency, outbox, webhooks, workers | Provider sandbox availability is external |
| Security/privacy | RLS, tenant-scoped storage/queues/cache/logs, private scanned media, retention/legal hold | Formal legal/privacy review is external |
| Reliability/scale | Latency, capacity, availability, observability, backups, DR, recovery/replay | Load environment sizing follows measured tests |
| Migration/rollout | Idempotent import, dry runs, reconciliation, parallel pilot, rollback, hypercare, second tenant | Production source extracts and pilot users are external |
| Accessibility/usability | WCAG 2.2 AA, mobile/desktop clients, two-hour training and 90% unaided success | Representative-user sessions are external |

