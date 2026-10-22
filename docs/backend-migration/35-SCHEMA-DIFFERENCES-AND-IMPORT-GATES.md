# 35 ? Schema differences and import gates

The Stage 4B request authorizes supported schema work in disposable databases. It does not authorize demo import, fabricated historical values, financial correction, or unresolved production decisions. This register describes the remaining differences from the Stage 3 proposal, not permission to ignore them.

## S4B-DIFF-01 ? Implemented composition

106 public tables = 74 candidate tables (including Alembic) + 26 source entities + six support tables. All named proposed tables exist. No extra business table was invented. New entity tables preserve source integer IDs, composite keys, source text dates and exact decimal columns; credential password columns are explicitly excluded.

Added source tables: `advisor_attendance`, `approvals`, `booking_call_logs`, `booking_capacity_overrides`, `booking_events`, `car_segments`, `legacy_gate_passes`, `legacy_invoice_events`, `inward_purchase_attachments`, `inward_purchase_events`, `inward_purchase_lines`, `inward_purchase_revision_lines`, `inward_purchase_revisions`, `inward_purchases`, `local_purchases`, `material_approval_events`, `material_approvals`, `material_events`, `legacy_material_movements`, `material_purchase_requests`, `material_requests`, `purchase_order_quotations`, `legacy_receipts`, `service_brands`, `legacy_job_status_history`, `workshop_user_profiles`.

Support tables: `command_receipts`, `report_template_versions`, `object_assets`, `document_snapshots`, `outbox_events`, `import_source_records`.

27 numeric column projections are widened without rounding; this includes source fractional odometer representation replacing an integer target. Historical data is not imported or modified. Future service/wire adapters must explicitly validate decimal and JavaScript safe-integer conversion. Existing mandatory native constraints remain enforced.

## S4B-DIFF-02 ? Deferred mandatory compatibility columns

These 26 ADD declarations are intentionally not executed. Adding a required value without a source-backed projection would break current native inserts; applying a seemingly convenient default could fabricate status, customer or financial meaning. A future reviewed service/schema package must define the writer, original-value projection and existing-row policy. This is a scoped implementation blocker, not a proposed UI change.

| Table | Deferred columns |
|---|---|
| booking_capacity_limits | capacity, set_by |
| bookings | customer_name, mobile, customer_type, vehicle_no, make, model, color, ui_status |
| job_checklist_items | stage, cycle_number |
| purchase_order_delivery_confirmations | returned_qty, damaged_qty, wasted_qty |
| purchase_order_lines | subtotal, gst_amount, total, item_name, unit |
| purchase_orders | ui_status, subtotal, discount_total, gst_total, total |
| suppliers | status |

## S4B-DIFF-03 ? Other contract gates

| Gate | Current state | Required resolution before import |
|---|---|---|
| Native actors and identity types | UUID actors/memberships retained; profiles support a nullable platform-user link | Approve stable source-ID/membership mapping. Do not substitute a synthetic historical actor. |
| Financial artifact and paise requirements | Native NOT NULL/CHECKs retained; no origin_kind bypass implemented | Resolve import-only nullability and native-service compatibility for missing issued documents, receipt documents and line tax allocation. Preserve all 51 discrepancies and stored amounts. |
| Status projection | No source status values converted; mandatory booking/PO ui_status is deferred; optional technician ui_status exists | Implement approved local/native projection before writes or import. Demand states must not become reservation states. |
| Timestamps/nullability | Source-only new text dates preserved; reused native timestamp/date/mandatory fields unchanged | Approve timezone/empty/null handling and round-trip projection, including source null odometer readings. |
| Existing delete policies | Six inherited CASCADE definitions remain unchanged; all newly added FKs use RESTRICT/NO ACTION | Review each inherited cascade against business history/security join semantics before changing it. |
| Scope and same-job references | New scoped FKs and nine same-job FKs implemented; native existing constraints retained | Full mapped-data validation, global identity membership checks and service authorization still required. Nullable absent references remain absent; no inferred parent links. |
| Native actor access | New UUID actor links prove existence only | Server must validate trusted tenant membership; schema existence is not authorization. |
| Existing numeric and status CHECKs | Retained; no invoice-header-equals-lines CHECK added | Exhaustive source-to-target constraint preflight is required after mappings, not blanket relaxation. |
| Source numeric flags | Added integer boolean columns use 0/1 checks; existing native booleans retained | Explicit adapter conversion and NULL preservation remain necessary. |
| Document snapshots/media | Immutable snapshots, asset readiness and provenance integrity enforced | Storage custody, unavailable bytes, template rendering and transactional business integration remain unimplemented. |
| Financial/printed numbering | Identity concurrency tested; existing document_sequences retained | FIN-04 printed-number scope/fiscal/gap convention is not approved by an identity test. No counters synchronized from demo data. |
| Existing records/old lineage | Only clean disposable replay and empty-data additive rollback tested | Existing-head bridge and populated-data migration/restore require a separate package. |

## S4B-ZERO-01 ? Zero-sentinel disposition

No SQL UPDATE, NULLIF, importer or global zero-to-NULL conversion is implemented. The original 61 values across 58 records remain in the eight unchanged SQLite files. The detailed record register in [32](32-ZERO-SENTINEL-CLASSIFICATION.md) remains authoritative.

| Occurrences | Schema provision | Mapping/import disposition |
|---|---|---|
| 52 checklist checked_by=0 | Nullable legacy_checked_by evidence field on job_checklist_items; existing nullable UUID checked_by preserved | System/unattributed convention known, exact historical actor unknown. Preserve zero in provenance, flag BLOCKED with review metadata; do not invent actor 0 or import ambiguous rows. |
| 3 material_movements.job_card_id=0 | legacy_material_movements.legacy_job_card_id; nullable scoped resolved job FK | Documented non-job PO closure inward can be represented without a fabricated job. No actual row transformed/imported. |
| 3 stock_ledger.job_card_id=0 | stock_ledger.legacy_job_card_id; nullable scoped job FK | Non-job PO closure evidence retained separately. No original sign, quantity or PO linkage changed. |
| 3 stock_ledger.material_row_id=0 | stock_ledger.legacy_material_row_id; nullable scoped material request FK | No job material allocation for those PO closure inwards. Do not create request 0 or repost stock. |

Legacy sentinel fields allow NULL or the documented zero only; ordinary quantities may remain zero. The schema does not claim to know a historical actor. import_source_records supports BLOCKED plus mandatory review metadata, immutable original payload/key/hash, and separate target mapping. Synthetic tests verify raw zero and numeric zero preservation; these are not imports of the 58 original records. Before Stage 4C, the owner must approve actual row dispositions and any nullable resolved-link mapping. Schema support alone is not approval to convert records.

## S4B-C ? Readiness decision

**Not ready for demo-data import.** Required next decisions: the 26 columns above and their writers; financial historical-value authority and native accommodations; source identity/timezone/nullability; row-level sentinel dispositions; authoritative shipped source approval and browser-only preservation. Implement the agreed schema follow-ups, then perform a read-only mapped-source preflight and review its exceptions before requesting import authorization.

No frontend integration or data import is authorized by this register.
