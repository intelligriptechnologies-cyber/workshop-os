# 10 ? SQLite data authority

Audit: 2026-10-21. Baseline checkout: `a315448ce8c3f8f86026b58c18a2231bb3e5e9a7`. Status: **VERIFIED file comparison; authority recommendation awaits approval.** IDs DB-01?DB-08 are stable for this audit.

All eight databases were opened with SQLite read-only immutable connections. No WAL, SHM or journal sidecars were present. Each contains 60 tables; integrity checks returned `ok`. `user_version=0` and `application_id=0` in every copy: neither identifies an application migration version. The schema cookie below is SQLite metadata, not a product version. Comparison covers DDL fingerprints, all table row multisets, primary-key additions/deletions and changed fields. Credential/contact differences are redacted in the evidence; their field-level changes remain counted.

## Files and fingerprints

| ID | Path | Rows | Schema cookie | SHA-256 |
|---|---|---:|---:|---|
| DB-01 | `public/workshopos-demo.sqlite` | 3241 | 1151 | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |
| DB-02 | `.scratch/chrome-profile1-workshopos-original.sqlite` | 3241 | 1151 | `6b5159435242db0d87246a883f0b46f27ebc519f7b78f61f3fee23323075e4c1` |
| DB-03 | `.scratch/codex-leads-source.sqlite` | 3447 | 1453 | `b61f8fa1c815141bd196a5c7b06199a480ae3c8af52209dc49d8ded58f8e3b70` |
| DB-04 | `.scratch/codex-decoy.sqlite` | 3447 | 1453 | `b5c253b2d7a821ac0324f2d21193d5eaa79af01446bed2bc6443faa2fbc44c48` |
| DB-05 | `.scratch/restoration-reference-build/workshopos-demo.sqlite` | 3241 | 1151 | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |
| DB-06 | `data-migration/demo-data/shipped.sqlite` | 3241 | 1151 | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |
| DB-07 | `data-migration/demo-data/runtime-initial.sqlite` | 3241 | 1156 | `5da9c6b40b32429c2520fb6f3cbf274c60a7b3a94b55bc317692398e2131d3a5` |
| DB-08 | `.scratch/reference-a315448/public/workshopos-demo.sqlite` | 3241 | 1151 | `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae` |

## Relationship and provenance assessment

| ID | Evidence and distinctive content | Classification / authority |
|---|---|---|
| DB-01 | Tracked public fixture; hash matches the file at HEAD; fetched by `openWorkshopDb` when browser storage is absent. | Recommended raw shipped demo source. |
| DB-02 | Same schema/counts; exactly 91 `job_cards.estimated_delivery` fields are null where shipped values are populated. | Filename suggests browser preservation; actual profile/export provenance UNVERIFIED. Not interchangeable with DB-01. |
| DB-03 | Different DDL; 3,447 rows but missing multiple shipped records, with many existing records changed. Lead 2 exists; lead 1 has NEW/WARM rather than shipped QUOTATION_SENT/HOT. | Scratch alternative dataset; producer and intended authority UNVERIFIED. Not a superset. |
| DB-04 | Same broad divergence as DB-03. The only DB-03/04 content difference is lead 1 display name: DB-04 uses `Browser Only Decoy`. | Deliberate diagnostic fixture is strongly indicated; do not promote to source. Creation history UNVERIFIED. |
| DB-05 | Byte-identical to DB-01 in restoration build directory. | Generated build copy; not independent authority. |
| DB-06 | Byte-identical to DB-01 in data-migration preservation directory. | Preserved fixture copy; not independent authority. |
| DB-07 | Same rows/DDL as DB-01; exactly 52 `invoices.updated_at` values differ. Capture script imports `openWorkshopDb` before exporting. | Runtime-initialized artifact; useful for initialization comparison, not raw fixture authority. |
| DB-08 | Byte-identical to DB-01 in reference checkout snapshot. | Reference fixture copy. |

DB-01/02/05/06/07/08 DDL SHA-256: `ae80adaf4013124da359be9e62c6ab89b7b59fdd4c868632b1e372c8051720bb`. DB-03/04: `7709daf17b35bffbd17a9e06d0a414c58bea3b6b2c6e6a41ff87e23960472bbd`.

DB-03/04 have 253 extra invoice-item IDs but also lose shipped bookings, a customer, visit, job, invoice, task, photo, purchase receipt/confirmation/quote records and a quotation. Existing invoices, checklist items and users also differ. Larger row count therefore supplies no evidence of greater completeness. The exhaustive per-key and per-field difference report is [the comparison evidence](stage15-database-comparison.json.md).

DB-07's changed invoice timestamps include `2026-10-20 21:40:45`; the producer is `data-migration/scripts/capture.mjs:22?36`. Startup schema migration/recalculation can write timestamps (`src/db.ts:5748?5766`, `7178?7489`). Cookie 1156 versus 1151 does not establish a different final schema. No inference is made from filesystem modification time.

## Counts for every table and copy

| Table | DB-01 | DB-02 | DB-03 | DB-04 | DB-05 | DB-06 | DB-07 | DB-08 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `advisor_attendance` | 2 | 2 | 0 | 0 | 2 | 2 | 2 | 2 |
| `approvals` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `booking_call_logs` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `booking_capacity_limits` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `booking_capacity_overrides` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `booking_events` | 2 | 2 | 0 | 0 | 2 | 2 | 2 | 2 |
| `bookings` | 2 | 2 | 0 | 0 | 2 | 2 | 2 | 2 |
| `car_segments` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `checklist_cycles` | 145 | 145 | 144 | 144 | 145 | 145 | 145 | 145 |
| `checklist_items` | 711 | 711 | 708 | 708 | 711 | 711 | 711 | 711 |
| `customers` | 121 | 121 | 120 | 120 | 121 | 121 | 121 | 121 |
| `estimate_items` | 144 | 144 | 144 | 144 | 144 | 144 | 144 | 144 |
| `estimates` | 144 | 144 | 144 | 144 | 144 | 144 | 144 | 144 |
| `followups` | 119 | 119 | 117 | 117 | 119 | 119 | 119 | 119 |
| `gate_passes` | 27 | 27 | 27 | 27 | 27 | 27 | 27 | 27 |
| `inventory` | 4 | 4 | 3 | 3 | 4 | 4 | 4 | 4 |
| `invoice_events` | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 1 |
| `invoice_items` | 105 | 105 | 358 | 358 | 105 | 105 | 105 | 105 |
| `invoices` | 52 | 52 | 51 | 51 | 52 | 52 | 52 | 52 |
| `inward_purchase_attachments` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inward_purchase_events` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inward_purchase_lines` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inward_purchase_revision_lines` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inward_purchase_revisions` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inward_purchases` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `job_cards` | 145 | 145 | 144 | 144 | 145 | 145 | 145 | 145 |
| `job_task_list_items` | 4 | 4 | 0 | 0 | 4 | 4 | 4 | 4 |
| `local_purchases` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `material_approval_events` | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 |
| `material_approvals` | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 |
| `material_events` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| `material_movements` | 3 | 3 | 1 | 1 | 3 | 3 | 3 | 3 |
| `material_purchase_requests` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `material_requests` | 117 | 117 | 117 | 117 | 117 | 117 | 117 | 117 |
| `payments` | 27 | 27 | 27 | 27 | 27 | 27 | 27 | 27 |
| `photos` | 289 | 289 | 288 | 288 | 289 | 289 | 289 | 289 |
| `purchase_order_confirmations` | 3 | 3 | 0 | 0 | 3 | 3 | 3 | 3 |
| `purchase_order_lines` | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 3 |
| `purchase_order_quotations` | 3 | 3 | 0 | 0 | 3 | 3 | 3 | 3 |
| `purchase_order_receipt_lines` | 3 | 3 | 0 | 0 | 3 | 3 | 3 | 3 |
| `purchase_order_receipts` | 2 | 2 | 0 | 0 | 2 | 2 | 2 | 2 |
| `purchase_orders` | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| `qc_checks` | 435 | 435 | 432 | 432 | 435 | 435 | 435 | 435 |
| `receipts` | 27 | 27 | 27 | 27 | 27 | 27 | 27 | 27 |
| `sales_leads` | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 |
| `sales_quotation_lines` | 2 | 2 | 0 | 0 | 2 | 2 | 2 | 2 |
| `sales_quotations` | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 1 |
| `service_advisor_teams` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `service_brands` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `service_catalog_items` | 3 | 3 | 0 | 0 | 3 | 3 | 3 | 3 |
| `service_department_managers` | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| `service_departments` | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| `status_history` | 146 | 146 | 146 | 146 | 146 | 146 | 146 | 146 |
| `stock_inwards` | 3 | 3 | 0 | 0 | 3 | 3 | 3 | 3 |
| `stock_ledger` | 4 | 4 | 3 | 3 | 4 | 4 | 4 | 4 |
| `suppliers` | 2 | 2 | 1 | 1 | 2 | 2 | 2 | 2 |
| `tasks` | 145 | 145 | 144 | 144 | 145 | 145 | 145 | 145 |
| `users` | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 |
| `vehicles` | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 |
| `visits` | 145 | 145 | 144 | 144 | 145 | 145 | 145 | 145 |

## Record-difference coverage

Counts below compare each nonidentical copy against DB-01. Changed means an existing primary-key record with differing fields; no-primary-key rows use canonical row identity. Full IDs and changed values are in the evidence.

| Copy | Table | Added identities | Missing identities | Changed records |
|---|---|---:|---:|---:|
| DB-02 | job_cards | 0 | 0 | 91 |
| DB-03 | advisor_attendance | 0 | 2 | 0 |
| DB-03 | booking_events | 0 | 2 | 0 |
| DB-03 | bookings | 0 | 2 | 0 |
| DB-03 | checklist_cycles | 0 | 1 | 0 |
| DB-03 | checklist_items | 0 | 3 | 125 |
| DB-03 | customers | 0 | 1 | 1 |
| DB-03 | followups | 0 | 2 | 1 |
| DB-03 | inventory | 0 | 1 | 0 |
| DB-03 | invoice_events | 0 | 1 | 0 |
| DB-03 | invoice_items | 253 | 0 | 105 |
| DB-03 | invoices | 0 | 1 | 51 |
| DB-03 | job_cards | 0 | 1 | 3 |
| DB-03 | job_task_list_items | 0 | 4 | 0 |
| DB-03 | material_approval_events | 2 | 0 | 0 |
| DB-03 | material_approvals | 2 | 0 | 0 |
| DB-03 | material_events | 0 | 0 | 1 |
| DB-03 | material_movements | 0 | 2 | 1 |
| DB-03 | material_requests | 0 | 0 | 5 |
| DB-03 | photos | 0 | 1 | 0 |
| DB-03 | purchase_order_confirmations | 0 | 3 | 0 |
| DB-03 | purchase_order_lines | 0 | 1 | 2 |
| DB-03 | purchase_order_quotations | 0 | 3 | 0 |
| DB-03 | purchase_order_receipt_lines | 0 | 3 | 0 |
| DB-03 | purchase_order_receipts | 0 | 2 | 0 |
| DB-03 | purchase_orders | 0 | 0 | 2 |
| DB-03 | qc_checks | 0 | 3 | 0 |
| DB-03 | sales_leads | 1 | 0 | 1 |
| DB-03 | sales_quotation_lines | 0 | 2 | 0 |
| DB-03 | sales_quotations | 0 | 1 | 0 |
| DB-03 | service_catalog_items | 0 | 3 | 0 |
| DB-03 | service_departments | 0 | 0 | 2 |
| DB-03 | status_history | 0 | 0 | 2 |
| DB-03 | stock_inwards | 0 | 3 | 0 |
| DB-03 | stock_ledger | 0 | 1 | 3 |
| DB-03 | suppliers | 0 | 1 | 1 |
| DB-03 | tasks | 0 | 1 | 0 |
| DB-03 | users | 0 | 0 | 10 |
| DB-03 | vehicles | 0 | 0 | 1 |
| DB-03 | visits | 0 | 1 | 0 |
| DB-04 | advisor_attendance | 0 | 2 | 0 |
| DB-04 | booking_events | 0 | 2 | 0 |
| DB-04 | bookings | 0 | 2 | 0 |
| DB-04 | checklist_cycles | 0 | 1 | 0 |
| DB-04 | checklist_items | 0 | 3 | 125 |
| DB-04 | customers | 0 | 1 | 1 |
| DB-04 | followups | 0 | 2 | 1 |
| DB-04 | inventory | 0 | 1 | 0 |
| DB-04 | invoice_events | 0 | 1 | 0 |
| DB-04 | invoice_items | 253 | 0 | 105 |
| DB-04 | invoices | 0 | 1 | 51 |
| DB-04 | job_cards | 0 | 1 | 3 |
| DB-04 | job_task_list_items | 0 | 4 | 0 |
| DB-04 | material_approval_events | 2 | 0 | 0 |
| DB-04 | material_approvals | 2 | 0 | 0 |
| DB-04 | material_events | 0 | 0 | 1 |
| DB-04 | material_movements | 0 | 2 | 1 |
| DB-04 | material_requests | 0 | 0 | 5 |
| DB-04 | photos | 0 | 1 | 0 |
| DB-04 | purchase_order_confirmations | 0 | 3 | 0 |
| DB-04 | purchase_order_lines | 0 | 1 | 2 |
| DB-04 | purchase_order_quotations | 0 | 3 | 0 |
| DB-04 | purchase_order_receipt_lines | 0 | 3 | 0 |
| DB-04 | purchase_order_receipts | 0 | 2 | 0 |
| DB-04 | purchase_orders | 0 | 0 | 2 |
| DB-04 | qc_checks | 0 | 3 | 0 |
| DB-04 | sales_leads | 1 | 0 | 1 |
| DB-04 | sales_quotation_lines | 0 | 2 | 0 |
| DB-04 | sales_quotations | 0 | 1 | 0 |
| DB-04 | service_catalog_items | 0 | 3 | 0 |
| DB-04 | service_departments | 0 | 0 | 2 |
| DB-04 | status_history | 0 | 0 | 2 |
| DB-04 | stock_inwards | 0 | 3 | 0 |
| DB-04 | stock_ledger | 0 | 1 | 3 |
| DB-04 | suppliers | 0 | 1 | 1 |
| DB-04 | tasks | 0 | 1 | 0 |
| DB-04 | users | 0 | 0 | 10 |
| DB-04 | vehicles | 0 | 0 | 1 |
| DB-04 | visits | 0 | 1 | 0 |
| DB-07 | invoices | 0 | 0 | 52 |

## Decision DATA-AUTH-01

Recommend DB-01 as the authoritative **raw shipped demo dataset**, preserving its identifiers, relationships and document numbers. This is based on the application load path, Git identity and corroborating identical copies, not size or recency. DB-07 is a separate initialized-runtime comparison baseline. Do not import both as independent datasets.

Approval is required before adopting this recommendation for a future import. The scope must explicitly say whether existing browser-only records must be preserved. That question remains open: no actual active browser dataset was available in this stage. Retain all eight files; do not merge, delete or label alternatives safe to discard. An approved browser export and reconciliation must precede any import that claims to preserve users' current records. See [browser audit](11-BROWSER-PERSISTENCE-AUDIT.md).

## Schema difference detail

[Exact CREATE statement comparison](stage15-schema-differences.json.md) identifies 16 tables with DDL text differences between DB-01 and DB-03/04. Some differences are column ordering; the following PRAGMA field metadata differences are substantive (tuple: type, not-null flag, default, primary-key flag).

| Table | Field | DB-01 metadata | DB-03/04 metadata |
|---|---|---|---|
| booking_capacity_limits | capacity | `('INTEGER', 1, None, 0)` | `None` |
| booking_capacity_limits | general_checkup_followup_capacity | `('INTEGER', 0, None, 0)` | `('INTEGER', 1, '4', 0)` |
| booking_capacity_limits | service_work_capacity | `('INTEGER', 0, None, 0)` | `('INTEGER', 1, '8', 0)` |
