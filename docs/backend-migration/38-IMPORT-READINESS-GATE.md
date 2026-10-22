# 38 ? Import readiness gate

Stage 4C-1, 2026-10-21. **NOT READY FOR ACTUAL IMPORT.** The dry-run preparation is complete, but mandatory mappings remain unresolved. No business records were written into PostgreSQL.

## Gate totals

| Measure | Result |
|---|---:|
| Source tables / rows | 60 / 3,241 |
| Deterministic content candidates | 486 |
| Records requiring review | 2,755 |
| Records cleared for import after all gates | 0 |
| Compatibility column contracts investigated | 26 |
| Columns with observed source values / empty-table contracts | 24 / 2 |
| Required compatibility columns still absent in target | 26 |
| Unresolved source-parent occurrences / affected records | 61 / 58 |
| Stored historical invoice discrepancies preserved | 51 |
| PostgreSQL CHECK passes / incomplete inputs | 4,787 / 5,841 |
| Actual imported rows | 0 |

?Deterministic content? is a row-level classification, not import approval. Native identity, schema, scope and dependency gates apply even to those 486 rows. Resolved source-parent references also do not imply resolved native UUID identities.

## Decisions and blockers

| ID | Finding and evidence | Recommended action | Approval requirement | Blocks import |
|---|---|---|---|---|
| IMP-01 | All 26 deferred columns remain absent; source contracts now fully enumerated in 36 | Approve compatibility storage and native/legacy writer ownership; add reviewed migration later | Schema/writer policy approval | Yes |
| IMP-02 | Integer historical users cannot populate native UUID actors or memberships | Approve stable source-system/tenant/key identity map; preserve legacy IDs separately; do not derive IDs from changing file hashes | Scope and identity policy | Yes |
| IMP-03 | 52 historical actor-zero references lack an identified human | Keep original zero in provenance and legacy projection; resolved actor nullable/unavailable only under explicit historical policy | Historical actor exception | Yes |
| IMP-04 | Nine optional job/invoice references across six stock records are source-zero conventions | Preserve original zero; explicit nullable resolved relationship per occurrence, not blanket conversion | Mapping policy | Yes |
| IMP-05 | Native artifact/actor/financial prerequisites lack source equivalents | Approve conditional historical representation; never fabricate PDFs, users or allocations | Schema and historical representation | Yes |
| IMP-06 | 145 promise labels are not instants; 153 timestamps lack offsets | Preserve original text and distinguish date-only/instant/relative labels; add historical text projection as needed | Timestamp interpretation and schema policy; no guessed timezone | Yes |
| IMP-07 | visits.odo_reading has 144 source NULLs against native required values | Preserve unknown reading via approved historical nullable policy | Schema policy | Yes |
| IMP-08 | 51 invoice discrepancies; original financial values are explicitly required to remain unchanged | Preserve stored amounts, payments and statuses; retain reports. Resolve native requirements without inferred line allocations or financial corrections | Preservation already required; alternative native representation requires approval | Yes, until representation complete |
| IMP-09 | 289 photo metadata rows: 288 placeholder paths, one empty path; generated artifact bytes unverified | Preserve metadata/source path; mark unavailable bytes, do not invent media/documents | Historical unavailable-artifact policy | Yes for affected records |
| IMP-10 | Explicit enum projections preserve raw status; native workflow behavior not proven | Approve reversible enum adapter and test lifecycle parity without triggering transitions | Parity/schema acceptance | Yes |
| IMP-11 | Browser-only data remains unknown | Approved read-only export and conflict/custody review before cutover; never clear storage | Export and conflict resolution approval | Cutover; must remain explicit even for shipped-only import |
| IMP-12 | 5,841 CHECK inputs incomplete; full insert/FK/trigger/partial uniqueness validation not performed | Complete all projections, validate in a separately approved disposable import rehearsal | Later import authorization | Yes |

See [36](36-DATA-COMPATIBILITY-RESOLUTION.md) for field-level proposals and all 61 occurrences. No schema changes were made in this stage. Additional native compatibility requirements may need conditional constraints or legacy projections beyond adding the 26 columns; a blanket relaxation of live business constraints is not recommended.

## Proposed import order

This is a dependency plan, not an executable import command:

1. Establish approved tenant/branch, import run identity and stable identity mappings; provision authentication only through the unified approved security design.
2. Load master/profile, customer, vehicle and catalogue identities.
3. Load bookings, visits and jobs; resolve circular links in a specifically reviewed second pass where schema nullability/deferral permits.
4. Load job tasks, checklists, estimates and historical state records.
5. Load procurement/material references and historical stock records without invoking stock-posting services or replaying movements.
6. Load preserved invoices, lines, payments and legacy receipt/gate-pass relationships without recalculation or regeneration.
7. Load sales/follow-up/media metadata and remaining relationship records; finalize provenance and reconciliation.
8. Verify constraints, scope isolation, row counts, source-key uniqueness, financial snapshots and sequence state before publishing the imported scope.

The eventual planner must derive a concrete order from the completed FK graph. Cycles need explicit nullable/deferrable handling; not all current constraints are deferrable. Do not disable foreign keys to force an import.

## Expected target counts

These are direct source-preservation projections, **not approved insert counts**. They total 3,241 rows across 60 target names, plus a proposed 3,241 provenance rows. Additional approved tenant, authentication, membership and import-run metadata counts are not yet known. Do not fabricate document or media rows to inflate completeness. The final total across the 106-table schema cannot yet be certified.

| Source | Proposed target | Rows |
|---|---|---:|
| `advisor_attendance` | `advisor_attendance` | 2 |
| `approvals` | `approvals` | 0 |
| `booking_call_logs` | `booking_call_logs` | 0 |
| `booking_capacity_limits` | `booking_capacity_limits` | 0 |
| `booking_capacity_overrides` | `booking_capacity_overrides` | 0 |
| `booking_events` | `booking_events` | 2 |
| `bookings` | `bookings` | 2 |
| `car_segments` | `car_segments` | 0 |
| `checklist_cycles` | `job_checklist_cycles` | 145 |
| `checklist_items` | `job_checklist_items` | 711 |
| `customers` | `customers` | 121 |
| `estimate_items` | `estimate_lines` | 144 |
| `estimates` | `estimates` | 144 |
| `followups` | `followups` | 119 |
| `gate_passes` | `legacy_gate_passes` | 27 |
| `inventory` | `catalogue_items` | 4 |
| `invoice_events` | `legacy_invoice_events` | 1 |
| `invoice_items` | `invoice_lines` | 105 |
| `invoices` | `invoices` | 52 |
| `inward_purchase_attachments` | `inward_purchase_attachments` | 0 |
| `inward_purchase_events` | `inward_purchase_events` | 0 |
| `inward_purchase_lines` | `inward_purchase_lines` | 0 |
| `inward_purchase_revision_lines` | `inward_purchase_revision_lines` | 0 |
| `inward_purchase_revisions` | `inward_purchase_revisions` | 0 |
| `inward_purchases` | `inward_purchases` | 0 |
| `job_cards` | `job_cards` | 145 |
| `job_task_list_items` | `job_service_tasks` | 4 |
| `local_purchases` | `local_purchases` | 0 |
| `material_approval_events` | `material_approval_events` | 0 |
| `material_approvals` | `material_approvals` | 0 |
| `material_events` | `material_events` | 1 |
| `material_movements` | `legacy_material_movements` | 3 |
| `material_purchase_requests` | `material_purchase_requests` | 0 |
| `material_requests` | `material_requests` | 117 |
| `payments` | `payments` | 27 |
| `photos` | `job_media` | 289 |
| `purchase_order_confirmations` | `purchase_order_delivery_confirmations` | 3 |
| `purchase_order_lines` | `purchase_order_lines` | 3 |
| `purchase_order_quotations` | `purchase_order_quotations` | 3 |
| `purchase_order_receipt_lines` | `purchase_order_delivery_receipt_lines` | 3 |
| `purchase_order_receipts` | `purchase_order_delivery_receipts` | 2 |
| `purchase_orders` | `purchase_orders` | 2 |
| `qc_checks` | `qc_checks` | 435 |
| `receipts` | `legacy_receipts` | 27 |
| `sales_leads` | `sales_leads` | 1 |
| `sales_quotation_lines` | `quotation_lines` | 2 |
| `sales_quotations` | `quotations` | 1 |
| `service_advisor_teams` | `service_advisor_teams` | 0 |
| `service_brands` | `service_brands` | 0 |
| `service_catalog_items` | `service_task_catalog` | 3 |
| `service_department_managers` | `service_department_managers` | 2 |
| `service_departments` | `service_departments` | 2 |
| `status_history` | `legacy_job_status_history` | 146 |
| `stock_inwards` | `stock_inwards` | 3 |
| `stock_ledger` | `stock_ledger` | 4 |
| `suppliers` | `suppliers` | 2 |
| `tasks` | `technician_tasks` | 145 |
| `users` | `workshop_user_profiles` | 10 |
| `vehicles` | `vehicles` | 132 |
| `visits` | `visits` | 145 |

## Rollback, retry and custody design

No import runner or rollback operation was executed. Before a later approved rehearsal, refresh source hash, policy digest, target catalog and migration head; reject any drift from the reviewed manifest. Bind import identity to stable source scope and source keys, with the source file hash and row payload evidence recorded separately. Acquire a scope-specific advisory lock and use a transaction covering mapped rows and provenance; abort on any unresolved row, constraint violation or count mismatch. Avoid partial success.

A retry must verify an existing run's source/policy digests and recorded identities. Identical completed rows are verified, not reinserted; changed payloads are conflicts requiring review, not blind upserts. Rollback on pre-commit failure leaves no business writes; sequence gaps are acceptable and sequence synchronization belongs only in the approved import operation. Preserve identifiers; synchronize each actual integer sequence against imported maxima, not record counts. Do not guess sequence names or UUID mappings.

After publication, rollback must use a verified backup/restore or reviewed compensating plan with scope ownership and downstream-use checks; never delete rows blindly by source key. Disposable rehearsal resources can be recreated only under their guarded environment. Keep browser-only records separately preserved until conflict policy is approved.

## Protection and next stage

[Hash verification](stage4c1-protection.json.md) confirms all 115 protected files, 94 screenshots, eight SQLite copies and 34 historical migrations unchanged. Active branch and commit remain the approved frontend baseline. Only the pre-existing AGENTS.md tracked diff remains. This stage added planner code, tests and documentation; no frontend/schema/deployment configuration changes, production/staging connections, imports, commits or pushes.

Recommendation: review the compatibility and historical representation decisions first, then authorize narrowly scoped schema/projection work and a disposable import rehearsal. **Do not authorize actual demo import on the present manifest.** Financial correction remains a separate explicitly approved operation and is not a prerequisite for preserving this history.
