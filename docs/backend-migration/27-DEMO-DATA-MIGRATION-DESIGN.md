# 27 - Demo-data migration design

Design only. No import, merge, mutation, startup initialization or migration was run. Source candidate public/workshopos-demo.sqlite has SHA-256 04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae, 60 tables and 3,241 records. All eight copies remain independently preserved; DB-03/04 additions are not automatically merged. Actual browser records remain UNKNOWN.

## IMP-01 - Source/target mapping

The following table covers all source entities. Every column and conversion target is specified in [24](24-POSTGRESQL-SCHEMA-DESIGN.md) and the [mapping manifest](stage3-schema-mapping.json.md). Existing native-only required fields need the explicit mapping rules below; copying source rows directly into candidate tables is not supported.

| Source table | Rows | Proposed operational target | ID and relationship policy |
|---|---:|---|---|
| advisor_attendance | 2 | advisor_attendance | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| approvals | 0 | approvals | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| booking_call_logs | 0 | booking_call_logs | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| booking_capacity_limits | 0 | booking_capacity_limits | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| booking_capacity_overrides | 0 | booking_capacity_overrides | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| booking_events | 2 | booking_events | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| bookings | 2 | bookings | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| car_segments | 0 | car_segments | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| checklist_cycles | 145 | job_checklist_cycles | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| checklist_items | 711 | job_checklist_items | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| customers | 121 | customers | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| estimate_items | 144 | estimate_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| estimates | 144 | estimates | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| followups | 119 | followups | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| gate_passes | 27 | legacy_gate_passes | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inventory | 4 | catalogue_items | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| invoice_events | 1 | legacy_invoice_events | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| invoice_items | 105 | invoice_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| invoices | 52 | invoices | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inward_purchase_attachments | 0 | inward_purchase_attachments | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inward_purchase_events | 0 | inward_purchase_events | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inward_purchase_lines | 0 | inward_purchase_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inward_purchase_revision_lines | 0 | inward_purchase_revision_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inward_purchase_revisions | 0 | inward_purchase_revisions | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| inward_purchases | 0 | inward_purchases | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| job_cards | 145 | job_cards | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| job_task_list_items | 4 | job_service_tasks | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| local_purchases | 0 | local_purchases | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| material_approval_events | 0 | material_approval_events | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| material_approvals | 0 | material_approvals | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| material_events | 1 | material_events | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| material_movements | 3 | legacy_material_movements | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| material_purchase_requests | 0 | material_purchase_requests | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| material_requests | 117 | material_requests | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| payments | 27 | payments | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| photos | 289 | job_media | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| purchase_order_confirmations | 3 | purchase_order_delivery_confirmations | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| purchase_order_lines | 3 | purchase_order_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| purchase_order_quotations | 3 | purchase_order_quotations | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| purchase_order_receipt_lines | 3 | purchase_order_delivery_receipt_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| purchase_order_receipts | 2 | purchase_order_delivery_receipts | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| purchase_orders | 2 | purchase_orders | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| qc_checks | 435 | qc_checks | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| receipts | 27 | legacy_receipts | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| sales_leads | 1 | sales_leads | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| sales_quotation_lines | 2 | quotation_lines | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| sales_quotations | 1 | quotations | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| service_advisor_teams | 0 | service_advisor_teams | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| service_brands | 0 | service_brands | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| service_catalog_items | 3 | service_task_catalog | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| service_department_managers | 2 | service_department_managers | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| service_departments | 2 | service_departments | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| status_history | 146 | legacy_job_status_history | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| stock_inwards | 3 | stock_inwards | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| stock_ledger | 4 | stock_ledger | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| suppliers | 2 | suppliers | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| tasks | 145 | technician_tasks | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| users | 10 | workshop_user_profiles | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| vehicles | 132 | vehicles | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |
| visits | 145 | visits | Preserve collision-free integer/composite key; UUID/native membership targets use recorded map; scoped FK rules in 24 |

## IMP-02 - Immutable input and preflight

An approved import must identify target environment/tenant/branch, schema head, import-version, source hash and source custody owner. Open source SQLite with mode=ro&immutable=1, hash before/after, and never call application initialization. Preserve raw bytes and a separate initialized-comparison artifact where approved; their row/timestamp changes are not source authority. Export ordered table rows and stable canonical row hashes with decimal/text/null distinctions. Credentials are redacted from operational manifests and retained only in the controlled original source; demo plaintext passwords are not production credentials.

Preflight does no target business writes. Validate source schema/row counts and all mapped FKs/uniques/types/statuses/checks; record every exception by source table/key/field/raw value/proposed disposition. At minimum, 61 zero-sentinel references across 58 records from 24 and all 51 financial exceptions must be present. Earlier zero-excluding checks are not acceptance evidence for strict FKs. Detect native fields absent from source: actor UUIDs, issued artifacts, tax allocations, status projections and source-ID collisions. Do not invent these values to pass NOT NULL. Source statuses map through an explicit reviewed table: Booked -> BOOKED; Started -> IN_PROGRESS; Pending -> PENDING for technician tasks; Completed -> COMPLETED; Closed -> CLOSED for purchase orders. Preserve original text in ui_status; do not reuse mappings across unrelated entities. Demand Requested/Issued is not a native reservation mapping.

Date-only values map only to dates; local timestamp strings without offsets require an approved workshop timezone interpretation. Preserve original text in provenance and compare round trips. Numeric import uses decimal text, no float-to-paise rounding. Fill paise only where exact; imported-unresolved native-only fields remain nullable under 24's origin policy. Actor metadata absent from source uses a distinct importer audit actor only for the import event, not as fabricated historical approval/user evidence.

## IMP-03 - Identity, sequencing and idempotency

Preserve source integer IDs in an empty collision-free target where feasible. Candidate UUID tenants/users/departments/memberships require stable mapping. Record tenant+source SHA+table+source PK -> target table/key in import_source_records; composite keys use canonical ordered JSON. A new import source cannot overwrite an existing target row merely because its integer ID matches. On shared-target collisions, allocate a new native ID and retain the original as the source identity, with explicit approval and adapter resolution. Displayed job/invoice/PO/quotation/receipt numbers remain byte-for-byte unchanged.

Use a per-target/import-source lock. Repeat of a committed identical source hash+import version verifies target mapping/row digests and returns no-op; it must not reseed, recalculate, update timestamps or reinsert. Same run key with different source/counts/version or changed target mapped rows yields an explicit conflict requiring review, not ON CONFLICT DO UPDATE across business rows. The existing demo_import_runs/demo_import_rows are reused for run accounting, extended by import_source_records to distinguish multiple browser sources and preserve row hashes/dispositions.

Synchronize bigint identity sequences after explicit ID insertion to the maximum existing value across the entire native table, not only the demo tenant. For empty sequences preserve first-use semantics; inspect actual identity/owned sequence definitions rather than assuming names. UUID keys need no sequence. Printed number allocator document_sequences is separate: parse approved historical formats and set per-scope next values above imported occupied numbers; unparseable/fiscal ambiguity becomes FIN-04 exception. PostgreSQL sequences are not transactional counters, so aborted/retried imports may consume unused identity numbers; no promise of gapless business numbering is made.

## IMP-04 - Load dependency order and atomic publication

1. Approve source/target/exception policy and complete clean schema replay. Lock isolated import scope and create a run proposal; verify target has no unexpected operational writes.
2. Resolve tenant/branch and identity/role/team mappings; load customers, vehicles, catalog masters, suppliers and profile references. Never import plaintext credentials. Resolve UUID membership references explicitly.
3. Load bookings/visits/jobs using deferred nullable cycle references, then status/task/checklist/estimate histories. Reattach booking job/visit links in a second pass.
4. Load demand, procurement headers/lines/quotes/receipts/confirmations, inward revisions and inventory histories. Preserve source stock snapshot and ledger without double-posting; do not invoke ordinary business commands during import.
5. Load invoices/lines/payments/receipts/gate passes with original stored amounts/status/void fields, then material invoice links. Preserve legacy artifacts as unavailable where bytes are absent. No new invoices, receipts or notifications are generated by migration.
6. Load sales, follow-ups, media metadata and all history rows, then separately approved browser configuration/templates/snapshots/assets. Raw shipped fixture does not contain those browser settings; do not claim default seeding is user-data preservation.
7. Validate scoped relationships and all exceptions, synchronize sequences, compare source-to-target projections, store reconciliation and mark run committed. Publish the scope only after complete acceptance.

For this small fixture, prefer one target transaction for mapped rows/provenance/run completion after preflight, with deferred constraints checked before commit. If object upload or larger browser datasets require staging, keep target scope hidden/read-only until final atomic publication; external bytes are staged before references. An aborted run rolls back target rows, retains diagnostics, leaves original files untouched and may leave staged objects for approved delayed cleanup. Do not partially publish table batches.

## IMP-05 - Required reconciliation

- All 60 tables and 3,241 source rows have exactly one explicit disposition: operational mapping, queryable preserved history, credential exception or blocked. Multiple target rows from one source (identity/membership) are counted separately; target row count is not expected to equal 3,241.
- Compare every mapped field after reverse projection: strings/nulls/decimals/date representations, archived/void/status fields, IDs/numbers, parent references and source order semantics. Row hashes must use the same canonicalization, not raw SQLite versus PostgreSQL binary bytes.
- Verify customers/vehicles/jobs, all 52 invoice headers, 105 invoice items and linked payments/documents. The 51 exception report must match 21 exactly. Store header and line values without equality repair. Cleared 27 must not silently reopen; Pending 24 must not be repriced. Financial acceptance is blocked until FIN-01 approves display/operational treatment.
- Inventory reconciliation separately checks source stock snapshot, opening movements and subsequent ledger effects. No stock is increased by replaying history on top of current stock. Confirm receipt/confirmation/stock-inward lineage and duplicate prevention.
- Query every historical collection used by UI, including the candidate importer's previously archive-only rows. An archive JSON checksum alone cannot pass operational history acceptance.
- Every relationship violation/conflict must have an approved transformation retaining the original or block the run. No skip-and-count-as-success, invented row0, silently NULLed reference or merged identity.

## IMP-06 - Browser-only preservation

Follow EXPORT-01 in 11 only after approval of profile/origin/tab/destination/access. Do not reload/init the app, clear storage or export auth tokens. Capture SQL.js bytes, v2/v1 precedence and migration markers, tab-specific admin settings/templates/company assets, frozen documents and recoverable memory-only images. Session inventory/import logs and developer simulation are distinct datasets. Hash each source with capture time/profile/origin; retain original snapshots encrypted/access controlled.

Treat browser SQL as a distinct source, not an incremental superset of public SQLite. Match source identity and row hash first; same ID with different content is a conflict. Owner chooses preservation/merge/discard per conflict, with no automatic latest-wins. Unsaved drafts/live bytes/unavailable profiles remain explicit unknowns. Browser business persistence is retired only after approved export/reconciliation, durable API persistence, restore test and explicit later authorization.

## IMP-07 - Retry/rollback gates

Rehearse identical import twice, failed mid-import, process death before commit, response loss after commit, changed input under same run key, target ID collision and target edited after import. Expected: no duplicate business effects, no silent overwrite and explicit diagnostics. Rollback before publication can remove only the dedicated disposable target under later authorization; after operational writes, never delete imported rows indiscriminately. Use compatible app rollback/forward repair, or restore with approved handling of post-cutover writes. Retain source, mappings, backups and both database/object recovery evidence.

Approval required: exact source scope, target, ID collision policy, sentinel mapping, financial treatment, timestamp interpretation, credential provisioning, browser conflict handling and cutover. This design executes none of them.
