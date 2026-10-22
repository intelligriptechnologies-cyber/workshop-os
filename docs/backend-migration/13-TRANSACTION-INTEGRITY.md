# 13 — Financial and inventory transaction integrity

Audit date: 2026-10-21. These are compatibility requirements, not changes to approved business rules or a PostgreSQL schema design. TX IDs below link source command contracts in [03](03-WORKFLOW-AND-BUSINESS-RULES.md), [exported operations](evidence-operation-contracts.md), [private helpers](evidence-private-data-contracts.md) and [transaction source](stage15-transaction-source.md). Source behavior is VERIFIED; concurrent execution and failure recovery are UNVERIFIED unless stated otherwise.

## Transaction boundaries and hazards

| ID | Workflow / local contract | Required indivisible business operation | Concurrency / remote parity risk |
|---|---|---|---|
| TX-01 | Intake, customer/vehicle/visit/job creation; booking check-in | Validate relationships, capacity and duplicate/check-in conditions; create/link records and events together | Duplicate registration/check-in and capacity oversubscription; an HTTP sequence of independent inserts can leave orphan visits or jobs. |
| TX-02 | Estimates / quotation header, lines, totals and approval | Header/lines/discount/tax/status and approved immutable values must agree; approval snapshot uses the approved template/settings | Concurrent line edits versus approval; stale totals and lost edits. Separate sales quotations and job estimates must retain distinct workflows. |
| TX-03 | Invoice creation/recalculation/clear/void, billed material linkage | Eligible job and actor checks, selected unbilled lines, totals, document number, invoice state and material claims together | Two invoices claim the same material; changes after approval; duplicate numbers; immutable cleared document history cannot be regenerated from later settings. |
| TX-04 | Payment and delivery closure (`src/db.ts:6384–6530`, `record_payment` savepoint) | Check completed job, Google review reminder, no active payment and positive pending invoice; record full payment, receipt, invoice state, CLOSED job, gate pass and delivery acknowledgement atomically | Local operation must not become partial payment followed by a separately fallible handover request. Retried clicks must not duplicate payment/documents. |
| TX-05 | Payment void/adjustments and financial corrections | Preserve existing terminal-state restrictions and audit relationships | Local void restrictions do not authorize exposing backend credit/refund workflows. Correction policy needs an explicit decision; no silent deletion/recalculation of issued documents. |
| TX-06 | Material draft/request/re-request, issue/reapproval, cancel | Request state, approved quantity, stock eligibility, issued quantity, movement history and status must agree | Two issue commands overspend stock; stale approval; shortage requests must remain possible where local behavior permits them. |
| TX-07 | Consumption, return, waste and reverse issue | Validate quantities and invoice locks; update request balance and corresponding inventory/movement records together | Double return/reversal; consuming more than issued; changing already-billed material. Preserve exact existing quantity rules. |
| TX-08 | Purchase request/quotes/approval/order creation | Approved source quantities, supplier quote selection, order/header/lines and source allocations together | Multiple orders over-allocate the same demand; late quote changes or stale approval. |
| TX-09 | PO partial receipts, confirmation and closure (`closePurchaseOrder`, `src/db.ts:4297–4370`) | Track receipt/accepted/rejected quantities and confirmations; post accepted stock at approved local closure point exactly once | Concurrent receipts exceed ordered amount; close/retry posts twice; checkout backend posts stock at inward instead of local closure. |
| TX-10 | Direct inward and stock adjustments | Item balances, quantity validation, reason/actor and movement ledger together | Lost balance updates, negative stock and unattributed adjustments; distinguish direct inward from PO receipt confirmation. |
| TX-11 | Job transitions, QC, rework, technician updates | Recheck current status/actor, write transition and associated cycle/tasks/events together where the local command does | Stale status overwrites, completion versus unfinished work. Do not add stricter completion rules merely because backend has them. |
| TX-12 | Document numbers and snapshots | Allocate once within the operation creating the document; enforce uniqueness at correct business scope; freeze HTML/values/template/version with record state | Local max/next-number schemes race; sequence gaps may be legitimate but displayed historical identifiers must not change. |
| TX-13 | Active template/company settings and generated reports | Preserve one active template per category; frozen document output remains historical when templates/settings change | Concurrent activation produces two active templates; settings read midway through generation changes output. SQL transaction alone cannot make current sessionStorage snapshots atomic. |
| TX-14 | Archive/cancel and linked historical records | Preserve approved visibility and dependent history; do not physically cascade-delete financial/stock evidence | Concurrent dependent creation versus archive; confusing archive with deletion damages report and audit parity. |

## FIN-PARITY-01 — Reproduced discount/tax divergence

The existing pure local function `src/invoice-math.ts:23–45` spreads a flat discount proportionally over line amounts, with final-line rounding adjustment, then calculates GST per line. Backend `finance._estimate_calculations:239–266` consumes the discount against earlier lines first and rounds unit rates into paise before multiplying quantity.

| Input / result | Approved local calculation | Existing backend calculation |
|---|---:|---:|
| Line A: quantity 1, rate ₹100, GST 18% | Discount ₹50; tax ₹9 | Discount ₹100; tax ₹0 |
| Line B: quantity 1, rate ₹100, GST 0% | Discount ₹50; tax ₹0 | Discount ₹0; tax ₹0 |
| Flat discount ₹100; total | **₹109** | **₹100** |

This was executed using the existing local pure function and the exact AST-extracted backend pure function; no application database or server handler was invoked. [Probe results](stage15-financial-parity-probe.json.md). Backend `finance.py` matches the running image. This is a demonstrated compatibility defect, not a legal/tax opinion. Preserve local approved arithmetic, including per-line rounding and mixed-rate allocation. Fractional quantities/rates, GST splits, zero/excess discounts and material billing still need parity tests; this probe is not exhaustive.

## Other demonstrated source differences

* `finance.record_payment:433–461` accepts positive arbitrary amounts and allows multiple/partial payments. Local `recordPayment` collects the full invoice and closes delivery in one savepoint. `complete_handover:484–514` is a separate backend request/transaction. Two HTTP requests do not reproduce local atomicity.
* `finance.issue_invoice:279–344` locks the job, claims an approved estimate and freezes financial values. `_render_html:146–157` produces a heading and escaped JSON in a preformatted block; it is not the approved report-template HTML/PDF. Backend immutability is useful, but output must preserve the existing template, company assets, document layout and print/export behavior.
* `_allocate_number:132–143` uses transactional `doc_sequences` upsert by tenant/branch/document type/fiscal year. Its prefix/year/five-digit display format differs from local numbers, including receipt conventions. Reuse safe allocation mechanics only after preserving historical numbers and specifying approved future display rules.
* Checkout `materials.create_reservation:183–204` locks stock and requires available quantity. Local requests can represent shortages before release/issue. Reservation/issue/return/waste/release/reverse-issue backend commands cannot be assumed equivalent to local draft/requested/re-requested/issued/cancelled rows and reapproval/invoice locks.
* Checkout `inventory.purchase_order_command:272–278` uses send/cancel/close transitions; `record_stock_inward:290–305` immediately posts INWARD ledger entries. Local purchase receipt/confirmation/closure semantics differ. Container procurement additions require reconciliation; they do not invalidate the demonstrated checkout mismatch.
* `jobs._completion_prerequisites:390–441` adds approved-estimate, work-update, task, required-QC, material and invoice gates. Local manual completion has different gates. Backend `_assert_job_actor:155–163` recognizes responsible manager/advisor ownership; local lifecycle permissions must be mapped exactly, including the service-manager distinction documented in 04.

## CONCUR-01 — Locking and retry review

Backend request-scoped transactions and stock/document ledger mechanisms are useful existing foundations. They do not make every command safe automatically. Source review identifies these potential races, not reproduced concurrency failures:

* Payment idempotency lookup occurs before invoice locking without a demonstrated post-lock replay lookup. Competing identical keys may reach a uniqueness error instead of returning the original result.
* Handover checks existing acknowledgement before the invoice lock; competing commands may both pass initial checks and contend on insertion. Recheck authoritative state under the operation's lock.
* Job status command reads a job without a lock and updates by ID without the old status in the update predicate. A concurrent transition can overwrite a state validated earlier.
* Current browser whole-database writes have no optimistic version check, multi-tab serialization or durable server acknowledgement. A successful in-memory command can fail later at browser persistence or snapshot export.

Later implementation should establish command-level transaction, idempotency/replay and stale-edit semantics without changing visible workflows. Lock order, deadlock retry, rollback after every write step and competing-command tests remain required. Do not call individual SQL CRUD operations equivalent to approved business commands.

## REL-01 — Relational constraints to carry into design

All shipped SQLite tables declare **zero foreign keys**. The earlier [data integrity check](evidence-data-integrity.md) found no invalid non-null/nonzero references in 20 conventional relationships tested; it does not prove all inferred relationships or every alternative database are valid.

The future design must explicitly model and validate customer→vehicle→visit→job links; actors/advisors/department assignments; job→estimate/items, invoice/items, payments/receipts/gate-pass/delivery, tasks/QC/cycles and documents; inventory→material requests/movements; supplier→purchase orders/lines/receipts/confirmations/quotes/source requests; bookings→check-in/visit links; and lead→quotation/items/job relationships. Recover exact columns/types from 05 and the operation contracts rather than inventing FK columns from names alone.

Require ownership-safe tenant/branch relationships and uniqueness scopes once tenancy is approved. Preserve optional/null/sentinel historical references explicitly; do not blindly cast legacy zero IDs into mandatory foreign keys. Decide archival restrictions and historical retention before defining cascades. Validate unique document numbers, one successful booking check-in, billed-material claims and active-document/payment invariants against the actual local rules. Do not prohibit historical voided versions just because an active version must be unique.

Quantity, money and status constraints should enforce the existing validators: finite values, allowed ranges, issued/used/returned/wasted balance, receipt/accepted/rejected limits and valid transition edges. Aggregate stock/receipt/claim invariants need serialized commands or equivalent transactional enforcement, not only row CHECK constraints. Exact nullable/historical exceptions and all eight databases must be reconciled before adding constraints; this stage does not authorize cleaning records.

## Exit criteria

Before integration: approve dataset and maintained backend baseline; establish command-level parity for TX-01–14; preserve document rendering and numbering; map roles/ownership; run financial and inventory scenarios on an approved isolated database, including rollback/retry/concurrency. No business-rule, source, test or database changes were made in this stage.
