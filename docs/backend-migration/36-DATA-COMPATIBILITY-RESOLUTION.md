# 36 - Data compatibility resolution

Stage 4C-1: dry-run preparation only. No schema migration, business INSERT, source mutation, UI integration or import was performed. Source SHA-256: `04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae`. Target evidence is the disposable Stage 4B test database at `20261021_0035`, captured in an explicitly read-only transaction.

## COMP-01 - All 26 deferred columns

All 26 have named source fields and deterministic value-copy contracts. Twenty-four have observed values; capacity and set_by have no shipped rows and remain contract-only. None requires an invented default. All 26 target columns remain absent: no DDL is performed in this stage. The remaining schema decision is how native writers represent unavailable compatibility values, not permission to overwrite imported values.

For imported rows, supply the exact source value and retain source null/empty distinctions. For native rows, prefer nullable compatibility fields with an explicit origin/import-validation contract until service writers supply them; do not add mandatory/defaulted compatibility values that fabricate history. This policy and any conditional NOT NULL migration require technical/business-owner approval. Design defaults below are documented schema defaults, not substitute imported values.

| Target | SQLite source | Type | Required / design default | Evidence | Deterministic mapping | Schema / approval |
|---|---|---|---|---|---|---|
| booking_capacity_limits.capacity | booking_capacity_limits.capacity | bigint | YES / `none` | 0 rows; 0 NULL | EXACT_SOURCE_COPY; CONTRACT_ONLY_EMPTY_TABLE | ADD needed; native nullability/required policy approval; no value invention |
| booking_capacity_limits.set_by | booking_capacity_limits.set_by | bigint | YES / `none` | 0 rows; 0 NULL | EXACT_SOURCE_COPY; CONTRACT_ONLY_EMPTY_TABLE | ADD needed; native nullability/required policy approval; no value invention |
| bookings.customer_name | bookings.customer_name | text | YES / `none` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.mobile | bookings.mobile | text | YES / `none` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.customer_type | bookings.customer_type | text | YES / `'Individual'` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.vehicle_no | bookings.vehicle_no | text | YES / `none` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.make | bookings.make | text | YES / `none` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.model | bookings.model | text | YES / `none` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.color | bookings.color | text | YES / `''` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| bookings.ui_status | bookings.status | text | YES / `'Booked'` | 2 rows; 0 NULL | PRESERVE_SOURCE_STATUS_SEPARATELY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| job_checklist_items.stage | checklist_items.stage | text | YES / `none` | 711 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| job_checklist_items.cycle_number | checklist_items.cycle_number | bigint | YES / `none` | 711 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_delivery_confirmations.returned_qty | purchase_order_confirmations.returned_qty | numeric | YES / `none` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_delivery_confirmations.damaged_qty | purchase_order_confirmations.damaged_qty | numeric | YES / `none` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_delivery_confirmations.wasted_qty | purchase_order_confirmations.wasted_qty | numeric | YES / `none` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_lines.subtotal | purchase_order_lines.subtotal | numeric | YES / `none` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_lines.gst_amount | purchase_order_lines.gst_amount | numeric | YES / `none` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_lines.total | purchase_order_lines.total | numeric | YES / `none` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_lines.item_name | purchase_order_lines.item_name | text | YES / `''` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_order_lines.unit | purchase_order_lines.unit | text | YES / `''` | 3 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_orders.ui_status | purchase_orders.status | text | YES / `'Draft'` | 2 rows; 0 NULL | PRESERVE_SOURCE_STATUS_SEPARATELY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_orders.subtotal | purchase_orders.subtotal | numeric | YES / `0` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_orders.discount_total | purchase_orders.discount_total | numeric | YES / `0` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_orders.gst_total | purchase_orders.gst_total | numeric | YES / `0` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| purchase_orders.total | purchase_orders.total | numeric | YES / `0` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |
| suppliers.status | suppliers.status | text | YES / `'Active'` | 2 rows; 0 NULL | EXACT_SOURCE_COPY; OBSERVED | ADD needed; native nullability/required policy approval; no value invention |

Exact machine-readable mapping: [compatibility matrix](stage4c1-dry-run/compatibility.json.md). Booking/PO ui_status receives the original spelling, while a separately named native status projection uses the explicit map below. No field default is used to manufacture customer, vehicle, actor or financial data.

## COMP-02 - Historical references

All 125 documented source relationship definitions were rescanned. Non-NULL reference occurrences: 5001; resolved source-parent occurrences: 4940; unresolved occurrences: 61, all matching the existing zero register. A resolved SQLite parent is not a resolved PostgreSQL UUID or proof of server authorization.

| Entity/reference | Resolution / representation | Remaining gate |
|---|---|---|
| Users and actors | Preserve ten source user IDs and role codes in profiles; credentials excluded from reports/operational projections. Nonzero actor refs resolve to source users. | Provision real corresponding platform users/memberships through approved identity map. Do not infer historical actor from role, current login or delivery label. 52 actor-zero rows need review. |
| Customer/vehicle/job IDs | Preserve integer source IDs and original parent references in one approved empty scope. No source PK duplicates found. | Confirm tenant/branch; native UUID actors, source NULL odometers and missing native fields still block many rows. |
| Estimates | Preserve IDs, lines, original status and amounts; Draft->DRAFT and Approved->APPROVED are exact native vocabulary projections. | Native approval actors/history and compatibility projection must preserve the original case for UI/history; no recalculation. |
| Invoices/payments | Preserve invoice/payment IDs, invoice links, headers, statuses and original allocations. Exact stored-value paise conversion only when integral. | Native issued/receipt documents and received/created actors are not in source; conditional import representation required. Do not invent line tax allocations or payment actors. |
| Photos | 289 source records: 288 `/media-placeholder.svg`, one empty source. Preserve metadata/path as placeholder or UNAVAILABLE evidence. | These are not verified image bytes. Do not fabricate object_assets, hashes, media events or photographic evidence. The placeholder is an existing UI asset. |
| Attachments | Shipped inward_purchase_attachments has zero rows. | Empty data cannot certify upload/download mapping; browser-only bytes remain unknown. |
| Generated documents | 27 receipts and 27 gate passes have source IDs/numbers/relationships; native file artifacts and frozen snapshots are not established by these rows. | Preserve queryable legacy records and UNAVAILABLE provenance. Do not render new PDFs and label them historical originals. |
| Audit/history | Preserve checklist, status, invoice, material and booking history as their named operational/history targets plus row provenance. | Missing UUID actors/timestamps cannot be replaced with importer identity. Import-event actor is a separate future audit concern. |
| Inventory | Preserve four stock-ledger rows, three PO closure movements and source stock snapshots with original signs. | No historical reposting. Native entry_type/quantity/unit-cost semantics and snapshot-versus-ledger authority require review. |

Identity proposal: record an immutable source-system/table/key to target-ID map. For UUIDs, use an approved fixed namespace plus tenant/source-system/key (or persist allocated UUIDs once); never derive identity from a mutable row hash or choose a same-name user. Preserve source IDs in profile/provenance. Namespace, scope, collision policy and account provisioning remain decisions; no UUIDs or users were generated.

## COMP-03 - Financial preservation

The explicit instruction to preserve stored financial values is accepted, not pending approval. Any correction is a separate operation. All 52 headers and 105 lines were read without mutation. The 51 known discrepancies match the prior baseline: 24 Pending and 27 Cleared. There are 25 Pending invoices overall; one has no subtotal discrepancy. All 27 payments remain associated with their original invoice IDs.

The planner calculates only an analytical line subtotal and signed stored-total-minus-payments report. It does not replace stored subtotal, tax, total, status or allocations. Paise candidates are exact unit conversions of stored values (never newly calculated invoice totals); any non-integral conversion is blocked rather than rounded. No line-level tax/discount allocation is invented. Original REAL binary values are retained as hexadecimal evidence alongside untouched source-file custody.

[All 52 reconciliation rows](stage4c1-dry-run/financial.json.md) contain stored subtotal, calculated active-line subtotal, signed difference, stored discount/tax/total/status, payment IDs and totals. The following mismatches require preservation, not correction:

| Invoice ID / number | Stored subtotal | Line subtotal | Stored minus lines | Stored tax | Stored total | Status |
|---|---:|---:|---:|---:|---:|---|
| 1 / INV-2026-00011 | 11750.0 | 33669.00 | -21919.00 | 2115.0 | 13865.0 | Pending |
| 2 / INV-2026-00013 | 4250.0 | 8500.00 | -4250.00 | 765.0 | 5015.0 | Pending |
| 3 / INV-2026-00014 | 5000.0 | 10000.00 | -5000.00 | 900.0 | 5900.0 | Cleared |
| 4 / INV-2026-00015 | 5750.0 | 11500.00 | -5750.00 | 1035.0 | 6785.0 | Cleared |
| 5 / INV-2026-00016 | 6500.0 | 13000.00 | -6500.00 | 1080.0 | 7080.0 | Cleared |
| 6 / INV-2026-00027 | 5750.0 | 11500.00 | -5750.00 | 1035.0 | 6785.0 | Pending |
| 7 / INV-2026-00028 | 6500.0 | 13000.00 | -6500.00 | 1080.0 | 7080.0 | Pending |
| 8 / INV-2026-00029 | 7250.0 | 14500.00 | -7250.00 | 1305.0 | 8555.0 | Pending |
| 9 / INV-2026-00030 | 8000.0 | 16000.00 | -8000.00 | 1440.0 | 9440.0 | Cleared |
| 10 / INV-2026-00031 | 8750.0 | 17500.00 | -8750.00 | 1575.0 | 10325.0 | Cleared |
| 11 / INV-2026-00032 | 9500.0 | 19000.00 | -9500.00 | 1620.0 | 10620.0 | Cleared |
| 12 / INV-2026-00043 | 8750.0 | 17500.00 | -8750.00 | 1575.0 | 10325.0 | Pending |
| 13 / INV-2026-00044 | 9500.0 | 19000.00 | -9500.00 | 1620.0 | 10620.0 | Pending |
| 14 / INV-2026-00045 | 10250.0 | 20500.00 | -10250.00 | 1845.0 | 12095.0 | Pending |
| 15 / INV-2026-00046 | 11000.0 | 22000.00 | -11000.00 | 1980.0 | 12980.0 | Cleared |
| 16 / INV-2026-00047 | 11750.0 | 23500.00 | -11750.00 | 2115.0 | 13865.0 | Cleared |
| 17 / INV-2026-00048 | 3500.0 | 7000.00 | -3500.00 | 540.0 | 3540.0 | Cleared |
| 18 / INV-2026-00059 | 11750.0 | 23500.00 | -11750.00 | 2115.0 | 13865.0 | Pending |
| 19 / INV-2026-00061 | 4250.0 | 8500.00 | -4250.00 | 765.0 | 5015.0 | Pending |
| 20 / INV-2026-00062 | 5000.0 | 10000.00 | -5000.00 | 900.0 | 5900.0 | Cleared |
| 21 / INV-2026-00063 | 5750.0 | 11500.00 | -5750.00 | 1035.0 | 6785.0 | Cleared |
| 22 / INV-2026-00064 | 6500.0 | 13000.00 | -6500.00 | 1080.0 | 7080.0 | Cleared |
| 23 / INV-2026-00075 | 5750.0 | 11500.00 | -5750.00 | 1035.0 | 6785.0 | Pending |
| 24 / INV-2026-00076 | 6500.0 | 13000.00 | -6500.00 | 1080.0 | 7080.0 | Pending |
| 25 / INV-2026-00077 | 7250.0 | 14500.00 | -7250.00 | 1305.0 | 8555.0 | Pending |
| 26 / INV-2026-00078 | 8000.0 | 16000.00 | -8000.00 | 1440.0 | 9440.0 | Cleared |
| 27 / INV-2026-00079 | 8750.0 | 17500.00 | -8750.00 | 1575.0 | 10325.0 | Cleared |
| 28 / INV-2026-00080 | 9500.0 | 19000.00 | -9500.00 | 1620.0 | 10620.0 | Cleared |
| 29 / INV-2026-00091 | 8750.0 | 17500.00 | -8750.00 | 1575.0 | 10325.0 | Pending |
| 30 / INV-2026-00092 | 9500.0 | 19000.00 | -9500.00 | 1620.0 | 10620.0 | Pending |
| 31 / INV-2026-00093 | 10250.0 | 20500.00 | -10250.00 | 1845.0 | 12095.0 | Pending |
| 32 / INV-2026-00094 | 11000.0 | 22000.00 | -11000.00 | 1980.0 | 12980.0 | Cleared |
| 33 / INV-2026-00095 | 11750.0 | 23500.00 | -11750.00 | 2115.0 | 13865.0 | Cleared |
| 34 / INV-2026-00096 | 3500.0 | 7000.00 | -3500.00 | 540.0 | 3540.0 | Cleared |
| 35 / INV-2026-00107 | 11750.0 | 23500.00 | -11750.00 | 2115.0 | 13865.0 | Pending |
| 36 / INV-2026-00109 | 4250.0 | 8500.00 | -4250.00 | 765.0 | 5015.0 | Pending |
| 37 / INV-2026-00110 | 5000.0 | 10000.00 | -5000.00 | 900.0 | 5900.0 | Cleared |
| 38 / INV-2026-00111 | 5750.0 | 11500.00 | -5750.00 | 1035.0 | 6785.0 | Cleared |
| 39 / INV-2026-00112 | 6500.0 | 13000.00 | -6500.00 | 1080.0 | 7080.0 | Cleared |
| 40 / INV-2026-00123 | 5750.0 | 11500.00 | -5750.00 | 1035.0 | 6785.0 | Pending |
| 41 / INV-2026-00124 | 6500.0 | 13000.00 | -6500.00 | 1080.0 | 7080.0 | Pending |
| 42 / INV-2026-00125 | 7250.0 | 14500.00 | -7250.00 | 1305.0 | 8555.0 | Pending |
| 43 / INV-2026-00126 | 8000.0 | 16000.00 | -8000.00 | 1440.0 | 9440.0 | Cleared |
| 44 / INV-2026-00127 | 8750.0 | 17500.00 | -8750.00 | 1575.0 | 10325.0 | Cleared |
| 45 / INV-2026-00128 | 9500.0 | 19000.00 | -9500.00 | 1620.0 | 10620.0 | Cleared |
| 46 / INV-2026-00139 | 8750.0 | 17500.00 | -8750.00 | 1575.0 | 10325.0 | Pending |
| 47 / INV-2026-00140 | 9500.0 | 19000.00 | -9500.00 | 1620.0 | 10620.0 | Pending |
| 48 / INV-2026-00141 | 10250.0 | 20500.00 | -10250.00 | 1845.0 | 12095.0 | Pending |
| 49 / INV-2026-00142 | 11000.0 | 22000.00 | -11000.00 | 1980.0 | 12980.0 | Cleared |
| 50 / INV-2026-00143 | 11750.0 | 23500.00 | -11750.00 | 2115.0 | 13865.0 | Cleared |
| 51 / INV-2026-00144 | 3500.0 | 7000.00 | -3500.00 | 540.0 | 3540.0 | Cleared |

## COMP-04 - Exact status mapping

These are proposed field representations only; no transition executes and no record is updated. Raw original status always remains in source provenance (and compatibility fields when available). No blanket uppercase conversion is allowed. Unobserved statuses require additional contract review.

| Source | Observed original values | Target representation |
|---|---|---|
| bookings.status | Booked (2) | Booked -> BOOKED |
| checklist_cycles.stage | NEW (28), IN_PROGRESS (63), COMPLETED (27), CLOSED (27) | Identity text preservation; no workflow change |
| checklist_items.stage | NEW (84), IN_PROGRESS (441), COMPLETED (105), CLOSED (81) | Identity text preservation; no workflow change |
| estimates.status | Draft (18), Approved (126) | Draft -> DRAFT; Approved -> APPROVED |
| invoices.status | Pending (25), Cleared (27) | Identity text preservation; no workflow change |
| job_cards.main_status | NEW (28), IN_PROGRESS (63), COMPLETED (24), CANCELLED (3), CLOSED (27) | Identity text preservation; no workflow change |
| job_cards.sub_status | Gather Requirements (8), Create Estimate (10), Get Confirmation (10), Material Requested (8), Material Issued (9), Washing Needed (10), Work Started (9), Follow-up Needed (9), Photos Shared (9), QC Pending (9), Remind Customer for Sharing Google Review/Feedback (24), Invoice Ready (3), Delivered (27) | Identity text preservation; no workflow change |
| job_cards.qc_status | Pending (91), Pass (54) | Identity text preservation; no workflow change |
| material_movements.direction | STOCK_IN (3) | Identity text preservation; no workflow change |
| material_requests.status | Requested (8), Issued (109) | Identity text preservation; no workflow change |
| payments.mode | UPI (27) | mode UPI -> preserved mode UPI and native method UPI; no new payment status |
| purchase_orders.status | Closed (2) | Closed -> CLOSED |
| sales_leads.stage | QUOTATION_SENT (1) | Identity text preservation; no workflow change |
| sales_quotations.status | DRAFT (1) | Identity text preservation; no workflow change |
| service_departments.status | ACTIVE (2) | Identity text preservation; no workflow change |
| status_history.main_status | NEW (29), IN_PROGRESS (63), COMPLETED (24), CANCELLED (3), CLOSED (27) | Identity text preservation; no workflow change |
| status_history.sub_status | Gather Requirements (10), Create Estimate (10), Get Confirmation (9), Material Requested (9), Material Issued (9), Washing Needed (9), Work Started (9), Follow-up Needed (9), Photos Shared (9), QC Pending (9), Customer Verification (9), Invoice Ready (9), Payment Received (9), Receipt Generated (9), Gate Pass Generated (9), Delivered (9) | Identity text preservation; no workflow change |
| suppliers.status | Active (2) | Active -> compatibility status Active; native lifecycle projection requires writer contract |
| tasks.status | Pending (28), Started (63), Completed (54) | Pending -> PENDING; Started -> IN_PROGRESS; Completed -> COMPLETED |

Material Requested/Issued are demand states and do not map to reservation states. STOCK_IN and po-closure-inward evidence must not be converted into new stock postings. Pending/Cleared invoice status remains byte-for-byte source text and is never inferred from this report's balance arithmetic.

## COMP-05 - Dates and timezone

Offset-bearing ISO instants retain their explicit instant and original text. Date-only values remain calendar dates and receive no offset. Naive timestamps remain raw text pending evidence/approval of the generating timezone; the workstation Asia/Kolkata setting is not proof of stored timezone. NULL and empty string remain distinct; neither becomes now(). Source-only text columns preserve raw text directly. Native date/timestamptz targets require proven conversion and round-trip checks.

153 observed naive timestamp values remain unresolved for instant interpretation. The 145 job_cards.promised_at values are relative display text such as Next business day/Tomorrow 6:00 PM, not instants: the proposed timestamp reuse is incompatible. Add a preserved promise-text projection or equivalent reviewed schema field; do not compute a date relative to import time. job_cards.delivery_by contains an actor/display label, not a timestamp. It is excluded from date conversion.

Every field and observed date classification is in [date inventory](stage4c1-dry-run/dates.json.md). Counts describe values across columns, not distinct records. The manifest identifies the exact row/value for every required type or nullability blocker.

## COMP-06 - Every zero occurrence

All 61 original values were confirmed against the pinned source. Nine occurrences across six PO history records are legitimate absent job/material allocations; 52 checklist actor occurrences have a system/unattributed convention but no proven historical human. Preserve source zero in provenance; never create parent ID 0. Nullable resolved links are a proposed representation requiring row-disposition approval before any import. None is applied in this stage.

| Source record | Field | Meaning / target representation | Approval |
|---|---|---|
| checklist_items / 59 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 60 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 68 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 69 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 72 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 135 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 136 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 139 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 144 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 145 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 148 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 211 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 212 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 215 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 220 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 221 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 224 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 287 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 288 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 296 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 297 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 300 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 363 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 364 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 367 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 372 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 373 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 376 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 439 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 440 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 443 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 448 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 449 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 452 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 515 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 516 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 524 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 525 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 528 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 591 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 592 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 595 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 600 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 601 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 604 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 667 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 668 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 671 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 676 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 677 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 680 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| checklist_items / 685 | checked_by | UNATTRIBUTED_ACTOR_REVIEW_REQUIRED; job_checklist_items.legacy_checked_by=0; checked_by unresolved/NULL proposal | Historical actor review; no fabricated user |
| material_movements / 1 | job_card_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; legacy_material_movements.legacy_job_card_id=0; job_card_id optional NULL proposal | Approve explicit non-job PO-history representation |
| material_movements / 2 | job_card_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; legacy_material_movements.legacy_job_card_id=0; job_card_id optional NULL proposal | Approve explicit non-job PO-history representation |
| material_movements / 3 | job_card_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; legacy_material_movements.legacy_job_card_id=0; job_card_id optional NULL proposal | Approve explicit non-job PO-history representation |
| stock_ledger / 1 | job_card_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; stock_ledger.legacy_job_card_id=0; job_card_id optional NULL proposal | Approve explicit non-job PO-history representation |
| stock_ledger / 1 | material_row_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; stock_ledger.legacy_material_row_id=0; material_row_id optional NULL proposal | Approve explicit non-job PO-history representation |
| stock_ledger / 2 | job_card_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; stock_ledger.legacy_job_card_id=0; job_card_id optional NULL proposal | Approve explicit non-job PO-history representation |
| stock_ledger / 2 | material_row_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; stock_ledger.legacy_material_row_id=0; material_row_id optional NULL proposal | Approve explicit non-job PO-history representation |
| stock_ledger / 4 | job_card_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; stock_ledger.legacy_job_card_id=0; job_card_id optional NULL proposal | Approve explicit non-job PO-history representation |
| stock_ledger / 4 | material_row_id | OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL; stock_ledger.legacy_material_row_id=0; material_row_id optional NULL proposal | Approve explicit non-job PO-history representation |

[Occurrence evidence and original source references](stage4c1-dry-run/sentinels.json.md); [complete source-parent ledger](stage4c1-dry-run/references.json.md). Ambiguous records stay blocked; no partial import that skips them is proposed.
