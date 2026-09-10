# WorkshopOS intake

Status: CONFIRMED (reconstructed from the approved production plan on 2026-09-10)

## Problem restatement

WorkshopOS must replace disconnected reception, workshop, inventory, billing, and delivery records with an India-first multi-tenant SaaS that follows a vehicle from appointment through delivery. It must preserve strict operational, stock, quality, financial, custody, and audit controls while remaining usable by non-technical workshop staff on shared desktops, tablets, and phones. The existing browser-local React/SQLite application is a behavioral demo, not a production foundation or migration source.

## Confirmed users

Platform operators, business owners/admins, branch managers, reception staff, service advisors, technicians, store staff, accounts/cashiers, and gate/security staff. Customers participate through narrow approval, payment, and acknowledgement links rather than a full customer application.

## Confirmed scale and constraints

- 500 tenants; up to 25 branches, 500 users, and 150 concurrent users per tenant.
- Up to 300 visits per branch per day and ten years of history.
- India GST is first-class. Other tax profiles are configurable but not certified.
- Production is a React/TypeScript PWA, TypeScript modular-monolith API, PostgreSQL, private object storage, background queues, Cognito, and AWS Mumbai.
- Availability 99.9%; RPO at most 15 minutes; RTO at most 2 hours.
- Routine p95 at most 2 seconds; authoritative posting p95 at most 3 seconds excluding provider completion.
- WCAG 2.2 AA and representative staff usability acceptance are release gates.

## Capability decomposition

| Capability | Classification |
| --- | --- |
| Complete vehicle journey | Multiple features: appointment, intake, inspection, approval, execution, QC, billing, gate, delivery |
| Role-specific action queues | Feature |
| Multi-tenant roles and permissions | Multiple features: tenancy, membership, authorization, shared-device access, re-authentication |
| Maker-checker controls | Constraint spanning approvals, stock, finance, and closure |
| Inventory reconciliation | Multiple features: procurement, ledger, requests, issue/use/return/waste, counts, variance |
| Native or Tally-authoritative finance | Multiple features and tenant policy |
| Cashfree and manual payments | Multiple features and external integration |
| Evidence and documents | Multiple features: private media, scanning, PDF/A4/thermal/QR, custody and delivery proof |
| Customer communications | Multiple features: inbox, push, WhatsApp, SMS fallback, public tokens |
| SaaS operations | Multiple features: provisioning, entitlements, suspension, export, retention, purge |
| Production reliability | Constraints: isolation, idempotency, concurrency, recovery, scale, observability |

## Non-goals

Payroll/attendance, full general-ledger accounting, GST-return filing, sales CRM/campaigns, insurance claims, loyalty/membership, vendor self-service, a full customer app, public marketplace, multi-country statutory certification, self-service SaaS checkout, and predictive AI.

## Definition of done

S00-S28 are implemented and their acceptance tests pass; traceability remains clean; security, usability, migration, recovery, pilot, and second-tenant gates pass; finance/tax receives qualified review; and a final handoff records reproducible evidence.

