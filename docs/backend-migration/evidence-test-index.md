# Test declaration index

Existing test assertions are source evidence, not proof of execution in this audit. Multiline test names are resolved in the source, not inferred from this declaration list.

| ID | Source | Declaration |
|---|---|---|
| TEST-unit-tests-admin-demo-state-test-ts-51 | unit-tests/admin-demo-state.test.ts:51 | test("defaults represent all seven WorkshopOS roles and current menu pages", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-72 | unit-tests/admin-demo-state.test.ts:72 | test("page catalogue is the source of truth for role menus and Inventory access", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-84 | unit-tests/admin-demo-state.test.ts:84 | test("role menus retain supported boundaries while honoring page access grants", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-102 | unit-tests/admin-demo-state.test.ts:102 | test("app theme defaults, updates, persists and hydrates legacy sessions", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-124 | unit-tests/admin-demo-state.test.ts:124 | test("session persistence is versioned, recoverable and resettable", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-137 | unit-tests/admin-demo-state.test.ts:137 | test("fresh billing settings contain valid tax and payment instructions", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-146 | unit-tests/admin-demo-state.test.ts:146 | test("older session GSTIN migrates to billing without replacing custom state", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-164 | unit-tests/admin-demo-state.test.ts:164 | test("business settings normalization trims values, preserves account zeros and uppercases identifiers", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-177 | unit-tests/admin-demo-state.test.ts:177 | test("billing validation reports GSTIN, IFSC and UPI errors independently", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-186 | unit-tests/admin-demo-state.test.ts:186 | test("custom role helpers are immutable and preserve role mappings", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-203 | unit-tests/admin-demo-state.test.ts:203 | test("Owner/Admin always keeps Admin Console access", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-210 | unit-tests/admin-demo-state.test.ts:210 | test("version 1 sessions migrate Sales CRM into Owner/Admin page access", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-225 | unit-tests/admin-demo-state.test.ts:225 | test("unsupported persisted session versions reset to defaults", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-235 | unit-tests/admin-demo-state.test.ts:235 | test("business settings deep updates retain sibling values", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-244 | unit-tests/admin-demo-state.test.ts:244 | test("logs append, filter, clear and enforce per-stream retention", () => { |
| TEST-unit-tests-admin-demo-state-test-ts-273 | unit-tests/admin-demo-state.test.ts:273 | test("confirmInventoryImport merges valid rows into session inventory only", () => { |
| TEST-unit-tests-advance-booking-range-test-ts-10 | unit-tests/advance-booking-range.test.ts:10 | test("advance bookings run from tomorrow through the next three calendar months", () => { |
| TEST-unit-tests-advance-booking-range-test-ts-19 | unit-tests/advance-booking-range.test.ts:19 | test("advance bookings span a year boundary and begin tomorrow", () => { |
| TEST-unit-tests-advance-booking-range-test-ts-27 | unit-tests/advance-booking-range.test.ts:27 | test("calendar month navigation is date-only and spans year boundaries", () => { |
| TEST-unit-tests-billing-domain-test-ts-40 | unit-tests/billing-domain.test.ts:40 | test("invoice copies estimate items exactly once and then remains independent", async () => { |
| TEST-unit-tests-billing-domain-test-ts-60 | unit-tests/billing-domain.test.ts:60 | test("custom invoice creation persists finalized lines and totals and rejects invalid drafts without partial writes", async () => { |
| TEST-unit-tests-billing-domain-test-ts-85 | unit-tests/billing-domain.test.ts:85 | test("post-payment invoice is fully locked once Cleared", async () => { |
| TEST-unit-tests-billing-domain-test-ts-99 | unit-tests/billing-domain.test.ts:99 | test("invoice fields and items recalculate subtotal, overall discount, GST, total, and document availability", async () => { |
| TEST-unit-tests-billing-domain-test-ts-118 | unit-tests/billing-domain.test.ts:118 | test("Record Payment validates mode, is a single full payment, and needs an active invoice", async () => { |
| TEST-unit-tests-billing-domain-test-ts-134 | unit-tests/billing-domain.test.ts:134 | test("payment requires the Google review/feedback reminder and the reminder cannot be N/A", async () => { |
| TEST-unit-tests-billing-domain-test-ts-148 | unit-tests/billing-domain.test.ts:148 | test("Record Payment atomically creates payment, receipt, gate pass and delivery acknowledgement, then closes", async () => { |
| TEST-unit-tests-billing-domain-test-ts-163 | unit-tests/billing-domain.test.ts:163 | test("direct manual Close remains forbidden after a payment", async () => { |
| TEST-unit-tests-billing-domain-test-ts-174 | unit-tests/billing-domain.test.ts:174 | test("payment is rejected during rework and closes only after the job is completed again", async () => { |
| TEST-unit-tests-billing-domain-test-ts-196 | unit-tests/billing-domain.test.ts:196 | test("Record Payment rolls back payment, receipt and invoice status when a step fails", async () => { |
| TEST-unit-tests-billing-domain-test-ts-210 | unit-tests/billing-domain.test.ts:210 | test("a payment-created closure is immutable", async () => { |
| TEST-unit-tests-billing-domain-test-ts-222 | unit-tests/billing-domain.test.ts:222 | test("a closed job's payment can no longer be voided or recorded", async () => { |
| TEST-unit-tests-billing-domain-test-ts-230 | unit-tests/billing-domain.test.ts:230 | test("billing actor boundary allows Owner/Admin and Accounts while rejecting every other role", async () => { |
| TEST-unit-tests-billing-domain-test-ts-245 | unit-tests/billing-domain.test.ts:245 | test("Accounts payment records delivery details as part of the handover", async () => { |
| TEST-unit-tests-billing-domain-test-ts-260 | unit-tests/billing-domain.test.ts:260 | test("payments mixed list orders unpaid, received, then void and gates void/record actions", async () => { |
| TEST-unit-tests-billing-reconciliation-test-ts-15 | unit-tests/billing-reconciliation.test.ts:15 | test("reconciliation requires current invoice, payment, receipt, gate pass and delivery acknowledgement", () => { |
| TEST-unit-tests-body-mark-test-ts-5 | unit-tests/body-mark.test.ts:5 | test("body-mark PNG header includes the recorded timestamp or historical fallback", async () => { |
| TEST-unit-tests-booking-followup-test-ts-8 | unit-tests/booking-followup.test.ts:8 | test("Expected Today includes only operational arrival states for the selected date and exposes follow-up filters", () => { |
| TEST-unit-tests-bookings-test-ts-22 | unit-tests/bookings.test.ts:22 | test("creating a Booking persists an independent future-arrival snapshot without creating a Visit or Job Card", async () => { |
| TEST-unit-tests-bookings-test-ts-37 | unit-tests/bookings.test.ts:37 | test("an operational Booking can be edited, confirmed and rescheduled with an auditable reason", async () => { |
| TEST-unit-tests-bookings-test-ts-48 | unit-tests/bookings.test.ts:48 | test("follow-up calls have their own timestamped history and terminal bookings cannot be changed", async () => { |
| TEST-unit-tests-bookings-test-ts-60 | unit-tests/bookings.test.ts:60 | test("cancellation and lifecycle validation require meaningful reasons and legal transitions", async () => { |
| TEST-unit-tests-bookings-test-ts-72 | unit-tests/bookings.test.ts:72 | test("a daily capacity blocks Reception and records an Admin's reasoned over-capacity exception", async () => { |
| TEST-unit-tests-bookings-test-ts-92 | unit-tests/bookings.test.ts:92 | test("service types have independent default and configured capacity", async () => { |
| TEST-unit-tests-bookings-test-ts-107 | unit-tests/bookings.test.ts:107 | test("migration backfills legacy bookings and carries a legacy daily capacity into Service Work", async () => { |
| TEST-unit-tests-bookings-test-ts-118 | unit-tests/bookings.test.ts:118 | test("checking in a Booking atomically creates an unassigned Visit and Job Card with an auditable link", async () => { |
| TEST-unit-tests-bookings-test-ts-137 | unit-tests/bookings.test.ts:137 | test("a failed Booking check-in leaves the Booking and workshop intake untouched", async () => { |
| TEST-unit-tests-checklists-test-ts-33 | unit-tests/checklists.test.ts:33 | test("items are flagged required or optional and N/A carries its own timestamp and actor", async () => { |
| TEST-unit-tests-checklists-test-ts-48 | unit-tests/checklists.test.ts:48 | test("optional items do not block completion of the status checklist, required ones do", async () => { |
| TEST-unit-tests-checklists-test-ts-58 | unit-tests/checklists.test.ts:58 | test("a checklist is editable only while the card is in that status", async () => { |
| TEST-unit-tests-checklists-test-ts-72 | unit-tests/checklists.test.ts:72 | test("Estimate and Invoice ticks refuse without a saved document, and ticks need no note", async () => { |
| TEST-unit-tests-checklists-test-ts-85 | unit-tests/checklists.test.ts:85 | test("Close is blocked until the COMPLETED checklist is fully ticked", async () => { |
| TEST-unit-tests-dashboard-metrics-test-ts-16 | unit-tests/dashboard-metrics.test.ts:16 | test("dashboard collections include only current-month payments linked to non-voided cleared invoices", () => { |
| TEST-unit-tests-dashboard-metrics-test-ts-30 | unit-tests/dashboard-metrics.test.ts:30 | test("dashboard projection follows the current calendar month's elapsed days and length", () => { |
| TEST-unit-tests-dashboard-metrics-test-ts-42 | unit-tests/dashboard-metrics.test.ts:42 | test("dashboard cashflow can report a completed historical month without changing operational periods", () => { |
| TEST-unit-tests-data-flow-test-ts-19 | unit-tests/data-flow.test.ts:19 | test("Data Flow derives distinct visit months and dates newest first", () => { |
| TEST-unit-tests-data-flow-test-ts-25 | unit-tests/data-flow.test.ts:25 | test("Data Flow combines normalized text, month, and exact-date filters", () => { |
| TEST-unit-tests-data-flow-test-ts-31 | unit-tests/data-flow.test.ts:31 | test("chronological Data Flow combines lifecycle, financial, document and media audit events", () => { |
| TEST-unit-tests-data-flow-test-ts-61 | unit-tests/data-flow.test.ts:61 | test("terminal audit events suppress same-timestamp edits and retain invoice generation after availability changes", () => { |
| TEST-unit-tests-data-flow-test-ts-84 | unit-tests/data-flow.test.ts:84 | test("lifecycle summary reports the active cycle and ordered remaining steps", () => { |
| TEST-unit-tests-data-flow-test-ts-99 | unit-tests/data-flow.test.ts:99 | test("ghost steps list remaining checklist items then uncreated documents with reasons", () => { |
| TEST-unit-tests-data-flow-test-ts-118 | unit-tests/data-flow.test.ts:118 | test("document-creating events carry a document reference; void ones are flagged", () => { |
| TEST-unit-tests-data-flow-test-ts-131 | unit-tests/data-flow.test.ts:131 | test("cancelled jobs emit no ghost steps at all", () => { |
| TEST-unit-tests-developer-control-plane-test-ts-30 | unit-tests/developer-control-plane.test.ts:30 | test("seeds one selected active tenant and persists safely in session storage", () => { |
| TEST-unit-tests-developer-control-plane-test-ts-40 | unit-tests/developer-control-plane.test.ts:40 | test("creates, selects, disables, restores and updates a tenant profile", () => { |
| TEST-unit-tests-developer-control-plane-test-ts-50 | unit-tests/developer-control-plane.test.ts:50 | test("simulated communication logs outcomes without provider calls", () => { |
| TEST-unit-tests-developer-control-plane-test-ts-58 | unit-tests/developer-control-plane.test.ts:58 | test("charges allow partial and full payment histories", () => { |
| TEST-unit-tests-developer-control-plane-test-ts-68 | unit-tests/developer-control-plane.test.ts:68 | test("reset restores the seeded browser-session state", () => { |
| TEST-unit-tests-document-snapshots-test-ts-24 | unit-tests/document-snapshots.test.ts:24 | test("approved estimate freezes on first sight; open invoice does not", () => { |
| TEST-unit-tests-document-snapshots-test-ts-29 | unit-tests/document-snapshots.test.ts:29 | test("Cleared invoice and receipt freeze, and later template and settings edits do not change them", () => { |
| TEST-unit-tests-document-snapshots-test-ts-44 | unit-tests/document-snapshots.test.ts:44 | test("voiding keeps the document listed from its frozen copy; reopened invoice unfreezes", () => { |
| TEST-unit-tests-document-snapshots-test-ts-60 | unit-tests/document-snapshots.test.ts:60 | test("a different job with the same id after a dataset swap does not produce void documents", () => { |
| TEST-unit-tests-finance-ui-test-ts-5 | unit-tests/finance-ui.test.ts:5 | test("online finance exposes a void only for an unpaid immutable invoice", () => { |
| TEST-unit-tests-finance-ui-test-ts-11 | unit-tests/finance-ui.test.ts:11 | test("replacement is a new document only after a void and without an active invoice", () => { |
| TEST-unit-tests-followup-completion-test-ts-32 | unit-tests/followup-completion.test.ts:32 | test("a resolved new contact closes prior open follow-ups while preserving their history", async () => { |
| TEST-unit-tests-inventory-import-test-ts-15 | unit-tests/inventory-import.test.ts:15 | test("parses CSV buffers and suggests canonical mappings", () => { |
| TEST-unit-tests-inventory-import-test-ts-31 | unit-tests/inventory-import.test.ts:31 | test("parses XLSX buffers and gives duplicate headers stable names", () => { |
| TEST-unit-tests-inventory-import-test-ts-46 | unit-tests/inventory-import.test.ts:46 | test("normalizes valid rows and assigns deterministic session IDs", () => { |
| TEST-unit-tests-inventory-import-test-ts-68 | unit-tests/inventory-import.test.ts:68 | test("rejects missing values, invalid quantities, negative quantities and duplicate SKUs", () => { |
| TEST-unit-tests-inventory-import-test-ts-86 | unit-tests/inventory-import.test.ts:86 | test("reports incomplete or stale explicit mappings before validating rows", () => { |
| TEST-unit-tests-inventory-import-test-ts-99 | unit-tests/inventory-import.test.ts:99 | test("inventory template is a parseable workbook with auto-mappable headers", () => { |
| TEST-unit-tests-inventory-import-test-ts-106 | unit-tests/inventory-import.test.ts:106 | test("sheet-per-category workbooks without SKU/unit columns import with derived values", () => { |
| TEST-unit-tests-inventory-test-ts-12 | unit-tests/inventory.test.ts:12 | test("selling prices migrate to zero and persist through stock operations", async () => { |
| TEST-unit-tests-invoice-test-ts-56 | unit-tests/invoice.test.ts:56 | test("flat discount is spread proportionally and GST is computed per line on the reduced value", () => { |
| TEST-unit-tests-invoice-test-ts-63 | unit-tests/invoice.test.ts:63 | test("discount rounding remainder lands on the last line and a discount never exceeds the subtotal", () => { |
| TEST-unit-tests-invoice-test-ts-69 | unit-tests/invoice.test.ts:69 | test("line GST accepts only the supported rates, normalizes No GST, and totals mixed treatments", async () => { |
| TEST-unit-tests-invoice-test-ts-87 | unit-tests/invoice.test.ts:87 | test("migration assigns legacy zero-rate rows to No GST and preserves other tax amounts", async () => { |
| TEST-unit-tests-invoice-test-ts-99 | unit-tests/invoice.test.ts:99 | test("migration makes active legacy invoices available and records document generation", async () => { |
| TEST-unit-tests-invoice-test-ts-106 | unit-tests/invoice.test.ts:106 | test("invoice persistence ignores a legacy unavailable value on create and edit", async () => { |
| TEST-unit-tests-invoice-test-ts-121 | unit-tests/invoice.test.ts:121 | test("legacy invoice availability does not block closure readiness", async () => { |
| TEST-unit-tests-invoice-test-ts-131 | unit-tests/invoice.test.ts:131 | test("estimate-to-invoice conversion transfers every line's GST treatment", async () => { |
| TEST-unit-tests-invoice-test-ts-143 | unit-tests/invoice.test.ts:143 | test("estimate is generated explicitly, approved by Owner or linked Advisor with a note", async () => { |
| TEST-unit-tests-invoice-test-ts-155 | unit-tests/invoice.test.ts:155 | test("invoice pre-fills Service lines from the estimate and Issued rows; unissued rows only warn", async () => { |
| TEST-unit-tests-invoice-test-ts-168 | unit-tests/invoice.test.ts:168 | test("creating an invoice locks picked-up rows with the invoice id and needs Owner or Advisor in IN_PROGRESS", async () => { |
| TEST-unit-tests-invoice-test-ts-185 | unit-tests/invoice.test.ts:185 | test("Accounts may create invoices only for completed jobs", async () => { |
| TEST-unit-tests-invoice-test-ts-204 | unit-tests/invoice.test.ts:204 | test("Completed is enabled only once an invoice exists, and voiding it disables Completed again", async () => { |
| TEST-unit-tests-invoice-test-ts-221 | unit-tests/invoice.test.ts:221 | test("unpaid invoice edits are audited, add late materials and lock them; removing a line or voiding unlocks rows", async () => { |
| TEST-unit-tests-invoice-test-ts-248 | unit-tests/invoice.test.ts:248 | test("a paid invoice rejects line edits", async () => { |
| TEST-unit-tests-invoice-test-ts-273 | unit-tests/invoice.test.ts:273 | test("ticking Payment Received creates the payment, receipt and gate pass, then closes the job", async () => { |
| TEST-unit-tests-invoice-test-ts-290 | unit-tests/invoice.test.ts:290 | test("ticking Payment Received requires a current invoice", async () => { |
| TEST-unit-tests-invoice-test-ts-297 | unit-tests/invoice.test.ts:297 | test("voiding needs Owner/Accounts and a reason; a paid invoice cannot be voided; a re-created invoice gets a new number", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-42 | unit-tests/inward-purchases.test.ts:42 | test("Store creates editable Purchase Requests with permanent auto-generated PO numbers", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-85 | unit-tests/inward-purchases.test.ts:85 | test("Store cannot bypass Purchase Requests with a supplier-priced PO or later-stage command", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-94 | unit-tests/inward-purchases.test.ts:94 | test("PO request numbering rolls over after 99,999 and never reuses a cancelled number", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-104 | unit-tests/inward-purchases.test.ts:104 | test("Admin reviews only the three newest completed purchases for a requested SKU across suppliers", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-122 | unit-tests/inward-purchases.test.ts:122 | test("Admin can optionally save a manual quotation only for a requested PO line", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-134 | unit-tests/inward-purchases.test.ts:134 | test("only Admin can commercially approve a request, enriching new items at zero stock and splitting suppliers", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-168 | unit-tests/inward-purchases.test.ts:168 | test("only an Admin can issue a fully approved Purchase Order to its assigned supplier", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-190 | unit-tests/inward-purchases.test.ts:190 | test("migration preserves legacy submitted receipts as read-only received history", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-200 | unit-tests/inward-purchases.test.ts:200 | test("Store submits an invoice receipt once and its signed ledger increases the shared stock balance", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-212 | unit-tests/inward-purchases.test.ts:212 | test("submission validates the supplier invoice and document requirements", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-224 | unit-tests/inward-purchases.test.ts:224 | test("an Admin revision retains the original receipt and applies only the quantity delta", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-236 | unit-tests/inward-purchases.test.ts:236 | test("purchase orders reconcile linked stock inwards without creating a second receipt movement", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-253 | unit-tests/inward-purchases.test.ts:253 | test("PO links reject mismatches and terminal orders while manual inward remains independent", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-271 | unit-tests/inward-purchases.test.ts:271 | test("a draft creates one approved PO snapshot and posts its receipt only once", async () => { |
| TEST-unit-tests-inward-purchases-test-ts-289 | unit-tests/inward-purchases.test.ts:289 | test("receipt posting rejects mismatched linked PO rows atomically", async () => { |
| TEST-unit-tests-job-card-layout-test-ts-11 | unit-tests/job-card-layout.test.ts:11 | test("tab set and order match the dialog layout", () => { |
| TEST-unit-tests-job-card-layout-test-ts-15 | unit-tests/job-card-layout.test.ts:15 | test("unbuilt tabs are stubs, built tabs are not", () => { |
| TEST-unit-tests-job-card-layout-test-ts-19 | unit-tests/job-card-layout.test.ts:19 | test("footer offers Create Estimate to the owner and lists Job Card download", () => { |
| TEST-unit-tests-job-card-layout-test-ts-29 | unit-tests/job-card-layout.test.ts:29 | test("footer gives read-only roles no actions", () => { |
| TEST-unit-tests-job-card-notifications-test-ts-38 | unit-tests/job-card-notifications.test.ts:38 | test("job-card notification templates interpolate the saved workshop profile", () => { |
| TEST-unit-tests-job-card-notifications-test-ts-61 | unit-tests/job-card-notifications.test.ts:61 | test("notification template settings trim, validate, and retain defaults for legacy settings", () => { |
| TEST-unit-tests-job-card-notifications-test-ts-96 | unit-tests/job-card-notifications.test.ts:96 | test("interim delivery stub only reports its native confirmation", () => { |
| TEST-unit-tests-job-card-ui-domain-test-ts-26 | unit-tests/job-card-ui-domain.test.ts:26 | test("job card edit and archive wrappers reject unlinked actors", async () => { |
| TEST-unit-tests-job-card-ui-domain-test-ts-42 | unit-tests/job-card-ui-domain.test.ts:42 | test("only owner and linked service advisor can mutate lifecycle and checklist", async () => { |
| TEST-unit-tests-job-card-ui-domain-test-ts-60 | unit-tests/job-card-ui-domain.test.ts:60 | test("Cancel is Owner/Advisor only, direct Close is forbidden, and terminal jobs are read-only", async () => { |
| TEST-unit-tests-job-card-ui-domain-test-ts-73 | unit-tests/job-card-ui-domain.test.ts:73 | test("Cancel is Owner/Advisor only, direct Close is forbidden, and terminal jobs are read-only", async () => { |
| TEST-unit-tests-job-card-ui-domain-test-ts-85 | unit-tests/job-card-ui-domain.test.ts:85 | test("estimate save validates, persists items and completes Create Estimate only after save", async () => { |
| TEST-unit-tests-job-delivery-highlight-test-ts-13 | unit-tests/job-delivery-highlight.test.ts:13 | test("estimated delivery highlights local calendar boundaries", () => { |
| TEST-unit-tests-job-delivery-highlight-test-ts-21 | unit-tests/job-delivery-highlight.test.ts:21 | test("invalid or missing delivery dates have no highlight", () => { |
| TEST-unit-tests-job-delivery-highlight-test-ts-27 | unit-tests/job-delivery-highlight.test.ts:27 | test("only active unarchived jobs receive delivery highlights", () => { |
| TEST-unit-tests-job-documents-test-ts-26 | unit-tests/job-documents.test.ts:26 | test("Job Card sheet is always available and the four slots follow the creation rules", () => { |
| TEST-unit-tests-job-documents-test-ts-38 | unit-tests/job-documents.test.ts:38 | test("Approved estimate, Cleared invoice, receipt and gate pass are frozen; Open invoice is ready", () => { |
| TEST-unit-tests-job-documents-test-ts-47 | unit-tests/job-documents.test.ts:47 | test("void documents stay listed from their snapshots; cancelled jobs are read-only", () => { |
| TEST-unit-tests-job-documents-test-ts-58 | unit-tests/job-documents.test.ts:58 | test("live rendering uses the Active template and company branding, Gate Pass shows Cleared not amounts, Job Card embeds the recorded damage diagram", () => { |
| TEST-unit-tests-job-documents-test-ts-75 | unit-tests/job-documents.test.ts:75 | test("current document actions reject voided or mismatched financial records", () => { |
| TEST-unit-tests-job-documents-test-ts-90 | unit-tests/job-documents.test.ts:90 | test("document actions reflect record availability, lifecycle, assignment and billing permissions", () => { |
| TEST-unit-tests-job-documents-test-ts-116 | unit-tests/job-documents.test.ts:116 | test("job card renders the damage diagram even when a stored template lacks the placeholder", () => { |
| TEST-unit-tests-job-media-test-ts-38 | unit-tests/job-media.test.ts:38 | test("media validation accepts bounded raster data URLs and rejects unsafe or mismatched content", () => { |
| TEST-unit-tests-job-media-test-ts-46 | unit-tests/job-media.test.ts:46 | test("file validation enforces declared MIME, magic bytes, and the 10 MB input bound", async () => { |
| TEST-unit-tests-job-media-test-ts-54 | unit-tests/job-media.test.ts:54 | test("owner and linked advisor can save metadata while other roles cannot mutate media", async () => { |
| TEST-unit-tests-job-media-test-ts-83 | unit-tests/job-media.test.ts:83 | test("media stays in the live SQL.js session but is stripped from the localStorage snapshot", async () => { |
| TEST-unit-tests-job-media-test-ts-95 | unit-tests/job-media.test.ts:95 | test("readState keeps archived jobs separate while retaining their photo audit history", async () => { |
| TEST-unit-tests-job-picker-test-ts-8 | unit-tests/job-picker.test.ts:8 | test("job picker derives its current Month-Year from the local calendar", () => { |
| TEST-unit-tests-job-picker-test-ts-14 | unit-tests/job-picker.test.ts:14 | test("period changes invalidate a selected job instead of choosing a replacement", () => { |
| TEST-unit-tests-job-picker-test-ts-20 | unit-tests/job-picker.test.ts:20 | test("jobs match one Month-Year or the unfiltered all-months option", () => { |
| TEST-unit-tests-job-sheet-test-ts-19 | unit-tests/job-sheet.test.ts:19 | test("intake fields are saved on job card, vehicle and customer", async () => { |
| TEST-unit-tests-job-sheet-test-ts-29 | unit-tests/job-sheet.test.ts:29 | test("Details edits persist and a re-intake without new fields keeps them", async () => { |
| TEST-unit-tests-job-sheet-test-ts-41 | unit-tests/job-sheet.test.ts:41 | test("one job-details save updates the job card and job sheet records together", async () => { |
| TEST-unit-tests-job-sheet-test-ts-54 | unit-tests/job-sheet.test.ts:54 | test("job-details saves preserve the assigned service advisor", async () => { |
| TEST-unit-tests-job-sheet-test-ts-61 | unit-tests/job-sheet.test.ts:61 | test("Owner and assigned advisor can save or clear only the delivery date in every editable status", async () => { |
| TEST-unit-tests-job-sheet-test-ts-80 | unit-tests/job-sheet.test.ts:80 | test("other users, archived records and terminal jobs cannot change the delivery date", async () => { |
| TEST-unit-tests-job-sheet-test-ts-97 | unit-tests/job-sheet.test.ts:97 | test("before and after photo mutation gates follow the job status", async () => { |
| TEST-unit-tests-job-sheet-test-ts-114 | unit-tests/job-sheet.test.ts:114 | test("damage marks add, remove and persist with the job card; technician cannot edit", async () => { |
| TEST-unit-tests-job-sheet-test-ts-133 | unit-tests/job-sheet.test.ts:133 | test("migration adds the body-mark record timestamp without changing legacy marks", async () => { |
| TEST-unit-tests-job-sheet-test-ts-146 | unit-tests/job-sheet.test.ts:146 | test("pure helpers clamp, tolerate bad JSON, and never reuse ids", () => { |
| TEST-unit-tests-job-sheet-test-ts-153 | unit-tests/job-sheet.test.ts:153 | test("legacy four-panel damage marks map into the unified illustration", () => { |
| TEST-unit-tests-job-sheet-test-ts-158 | unit-tests/job-sheet.test.ts:158 | test("dropped paper fields (D.O.B., tyres, road test) are not in the schema", async () => { |
| TEST-unit-tests-lifecycle-model-test-ts-33 | unit-tests/lifecycle-model.test.ts:33 | test("lifecycle model exposes exactly six main statuses and ordered stage templates", () => { |
| TEST-unit-tests-lifecycle-model-test-ts-42 | unit-tests/lifecycle-model.test.ts:42 | test("migration keeps HOLD as a real status, preserves audit evidence, and creates lifecycle storage", async () => { |
| TEST-unit-tests-lifecycle-model-test-ts-62 | unit-tests/lifecycle-model.test.ts:62 | test("migration backfills one required Google review reminder into active unpaid Completed cycles only", async () => { |
| TEST-unit-tests-lifecycle-model-test-ts-81 | unit-tests/lifecycle-model.test.ts:81 | test("checklist changes derive the compatibility sub-status and actor timestamps", async () => { |
| TEST-unit-tests-lifecycle-model-test-ts-93 | unit-tests/lifecycle-model.test.ts:93 | test("legacy job edits cannot override the checklist-derived compatibility summary", async () => { |
| TEST-unit-tests-lifecycle-model-test-ts-103 | unit-tests/lifecycle-model.test.ts:103 | test("large demo lifecycle seeds are deterministic and contain no HOLD status", async () => { |
| TEST-unit-tests-lifecycle-model-test-ts-115 | unit-tests/lifecycle-model.test.ts:115 | test("every CLOSED large-demo job has a complete billing handover", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-57 | unit-tests/lifecycle-transition.test.ts:57 | test("central transition API enforces the complete allowed-transition table", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-86 | unit-tests/lifecycle-transition.test.ts:86 | test("checklists enforce ordering and gate forward transitions without partial writes", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-102 | unit-tests/lifecycle-transition.test.ts:102 | test("every transition requires a note, cancellation bypasses gates, and CLOSED is terminal", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-112 | unit-tests/lifecycle-transition.test.ts:112 | test("direct closure is rejected, including through the central transition API", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-122 | unit-tests/lifecycle-transition.test.ts:122 | test("an Admin cannot manually close a completed job", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-129 | unit-tests/lifecycle-transition.test.ts:129 | test("HOLD pauses without a checklist gate and resumes the same IN_PROGRESS cycle", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-142 | unit-tests/lifecycle-transition.test.ts:142 | test("transition failure rolls back status, new cycle, and audit history atomically", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-154 | unit-tests/lifecycle-transition.test.ts:154 | test("completed-job rework creates fresh stage cycles and preserves prior history", async () => { |
| TEST-unit-tests-lifecycle-transition-test-ts-173 | unit-tests/lifecycle-transition.test.ts:173 | test("non-billing artifacts never advance main status; valid payment closes and creates handover artifacts", async () => { |
| TEST-unit-tests-list-utils-test-ts-6 | unit-tests/list-utils.test.ts:6 | test("pagination calculates ranges and only returns the active page", () => { |
| TEST-unit-tests-list-utils-test-ts-12 | unit-tests/list-utils.test.ts:12 | test("pagination clamps pages, handles empty results and page-size changes", () => { |
| TEST-unit-tests-list-utils-test-ts-20 | unit-tests/list-utils.test.ts:20 | test("search normalization and adaptive page numbers are deterministic", () => { |
| TEST-unit-tests-list-utils-test-ts-28 | unit-tests/list-utils.test.ts:28 | test("active filters omit defaults and retain their labels", () => { |
| TEST-unit-tests-list-utils-test-ts-32 | unit-tests/list-utils.test.ts:32 | test("exports contain exactly the supplied filtered rows and visible columns", () => { |
| TEST-unit-tests-list-utils-test-ts-45 | unit-tests/list-utils.test.ts:45 | test("draft filters apply explicitly and clear resets both copies and page", () => { |
| TEST-unit-tests-materials-test-ts-52 | unit-tests/materials.test.ts:52 | test("rows go Draft, Requested, Re-requested and Cancel only from requested states", async () => { |
| TEST-unit-tests-materials-test-ts-70 | unit-tests/materials.test.ts:70 | test("Draft rows delete freely", async () => { |
| TEST-unit-tests-materials-test-ts-77 | unit-tests/materials.test.ts:77 | test("rows change only while IN_PROGRESS and only for Owner or the linked Advisor", async () => { |
| TEST-unit-tests-materials-test-ts-89 | unit-tests/materials.test.ts:89 | test("requesting over stock warns but succeeds; stock is seed minus ledger", async () => { |
| TEST-unit-tests-materials-test-ts-101 | unit-tests/materials.test.ts:101 | test("material demand triage sends shortages to procurement and leaves available SKUs issuable", () => { |
| TEST-unit-tests-materials-test-ts-107 | unit-tests/materials.test.ts:107 | test("material demand triage allocates projected availability across outstanding requests for the same SKU", () => { |
| TEST-unit-tests-materials-test-ts-134 | unit-tests/materials.test.ts:134 | test("Materials Requested auto-ticks on the first Requested row and stays ticked when cancelled", async () => { |
| TEST-unit-tests-materials-test-ts-144 | unit-tests/materials.test.ts:144 | test("Materials Issued unticks when a new request is made", async () => { |
| TEST-unit-tests-materials-test-ts-155 | unit-tests/materials.test.ts:155 | test("N/A on the materials items is refused once rows exist", async () => { |
| TEST-unit-tests-materials-test-ts-165 | unit-tests/materials.test.ts:165 | test("permitted actions per row state", () => { |
| TEST-unit-tests-materials-test-ts-180 | unit-tests/materials.test.ts:180 | test("Store release writes a signed ledger record, decrements stock and ticks Materials Issued", async () => { |
| TEST-unit-tests-materials-test-ts-192 | unit-tests/materials.test.ts:192 | test("reconciliation corrections keep on-hand stock, movement history, and audit history aligned", async () => { |
| TEST-unit-tests-materials-test-ts-217 | unit-tests/materials.test.ts:217 | test("release over stock is blocked and writes nothing", async () => { |
| TEST-unit-tests-materials-test-ts-224 | unit-tests/materials.test.ts:224 | test("release requires IN_PROGRESS and is unavailable on ordinary HOLD or COMPLETED", async () => { |
| TEST-unit-tests-materials-test-ts-233 | unit-tests/materials.test.ts:233 | test("Store material approval holds a job, freezes it, then approval restores retained issue eligibility", async () => { |
| TEST-unit-tests-materials-test-ts-249 | unit-tests/materials.test.ts:249 | test("rejection requires a reason and only the linked advisor can correct and resubmit", async () => { |
| TEST-unit-tests-materials-test-ts-263 | unit-tests/materials.test.ts:263 | test("Materials Issued needs every non-cancelled row Issued and unticks on a new request", async () => { |
| TEST-unit-tests-materials-test-ts-276 | unit-tests/materials.test.ts:276 | test("Issued edit needs a note, stays Issued, adjusts stock by the difference and logs old/new", async () => { |
| TEST-unit-tests-materials-test-ts-294 | unit-tests/materials.test.ts:294 | test("Issued edit can switch item and is blocked once invoiced", async () => { |
| TEST-unit-tests-materials-test-ts-304 | unit-tests/materials.test.ts:304 | test("local purchases persist with a job, can be edited and archived, and never affect stock or material rows", async () => { |
| TEST-unit-tests-materials-test-ts-329 | unit-tests/materials.test.ts:329 | test("local purchases require a selected job and vendor/bill details", async () => { |
| TEST-unit-tests-materials-test-ts-336 | unit-tests/materials.test.ts:336 | test("legacy direct purchase, stock and issue is denied without posting inventory or issuing material", async () => { |
| TEST-unit-tests-purchase-order-receipt-confirmation-test-ts-46 | unit-tests/purchase-order-receipt-confirmation.test.ts:46 | test("Admin records multiple partial PO deliveries without changing stock", async () => { |
| TEST-unit-tests-purchase-order-receipt-confirmation-test-ts-70 | unit-tests/purchase-order-receipt-confirmation.test.ts:70 | test("closing a confirmed PO posts accepted stock once and locks its audit record", async () => { |
| TEST-unit-tests-purchase-order-receipt-confirmation-test-ts-103 | unit-tests/purchase-order-receipt-confirmation.test.ts:103 | test("Admin confirms a partial delivery when every delivered unit is accounted for", async () => { |
| TEST-unit-tests-purchase-order-supplier-display-test-ts-5 | unit-tests/purchase-order-supplier-display.test.ts:5 | test("purchase-order grid resolves a string-serialized supplier ID", () => { |
| TEST-unit-tests-report-template-layout-test-ts-6 | unit-tests/report-template-layout.test.ts:6 | test("every default template uses the modern accent band (prototype layout B) with company header, stamp and signature", () => { |
| TEST-unit-tests-report-template-layout-test-ts-22 | unit-tests/report-template-layout.test.ts:22 | test("quotation seeds include reddish Marron and orangish Yellow template variants", () => { |
| TEST-unit-tests-report-template-layout-test-ts-30 | unit-tests/report-template-layout.test.ts:30 | test("amount in words uses Indian grouping", () => { |
| TEST-unit-tests-report-template-layout-test-ts-36 | unit-tests/report-template-layout.test.ts:36 | test("stale unedited seeded defaults upgrade; edited templates are kept", () => { |
| TEST-unit-tests-report-templates-test-ts-16 | unit-tests/report-templates.test.ts:16 | test("print documents preserve template background colors", () => { |
| TEST-unit-tests-report-templates-test-ts-22 | unit-tests/report-templates.test.ts:22 | test("active invoices remain report-available despite a legacy unavailable flag", () => { |
| TEST-unit-tests-report-templates-test-ts-42 | unit-tests/report-templates.test.ts:42 | test("defaults seed exactly one active template for every report category", () => { |
| TEST-unit-tests-report-templates-test-ts-53 | unit-tests/report-templates.test.ts:53 | test("older session JSON hydrates new defaults and repairs active-template invariants", () => { |
| TEST-unit-tests-report-templates-test-ts-66 | unit-tests/report-templates.test.ts:66 | test("template creation validates names/placeholders and active transfer is immutable", () => { |
| TEST-unit-tests-report-templates-test-ts-82 | unit-tests/report-templates.test.ts:82 | test("company identity saves name and assets atomically", () => { |
| TEST-unit-tests-report-templates-test-ts-92 | unit-tests/report-templates.test.ts:92 | test("placeholder validation and rendering escape scalar values while preserving generated blocks", () => { |
| TEST-unit-tests-report-templates-test-ts-99 | unit-tests/report-templates.test.ts:99 | test("report availability and values aggregate every payment and balance", () => { |
| TEST-unit-tests-report-templates-test-ts-113 | unit-tests/report-templates.test.ts:113 | test("invoice values expose saved billing placeholders and sanitize the configured payment block", () => { |
| TEST-unit-tests-report-templates-test-ts-131 | unit-tests/report-templates.test.ts:131 | test("invoice payment block omits blank rows and disappears when nothing is configured", () => { |
| TEST-unit-tests-report-templates-test-ts-142 | unit-tests/report-templates.test.ts:142 | test("estimate is a seeded category with a default that uses the lines loop", () => { |
| TEST-unit-tests-report-templates-test-ts-151 | unit-tests/report-templates.test.ts:151 | test("{{#lines}} loops merge one row per line with escaped values; line keys only work inside the loop", () => { |
| TEST-unit-tests-report-templates-test-ts-164 | unit-tests/report-templates.test.ts:164 | test("company settings singleton saves contact details, GSTIN and footer atomically and exposes them as merge keys", () => { |
| TEST-unit-tests-report-templates-test-ts-174 | unit-tests/report-templates.test.ts:174 | test("images merge only when they are PNG/JPEG data URLs", () => { |
| TEST-unit-tests-report-templates-test-ts-183 | unit-tests/report-templates.test.ts:183 | test("a template can be deleted unless it is the active one", () => { |
| TEST-unit-tests-sales-crm-test-ts-17 | unit-tests/sales-crm.test.ts:17 | test("updating a sales lead preserves its ID and normalizes every editable field", async () => { |
| TEST-unit-tests-sales-crm-test-ts-27 | unit-tests/sales-crm.test.ts:27 | test("updating a sales lead requires a name and phone", async () => { |
| TEST-unit-tests-sales-crm-test-ts-35 | unit-tests/sales-crm.test.ts:35 | test("sales lead not-entered flags default to false and round-trip through updates", async () => { |
| TEST-unit-tests-sales-crm-test-ts-48 | unit-tests/sales-crm.test.ts:48 | test("lead register filters locally and resets to all statuses", () => { |
| TEST-unit-tests-sales-crm-test-ts-58 | unit-tests/sales-crm.test.ts:58 | test("inline lead saves preserve the complete draft and live filters include query and stage", () => { |
| TEST-unit-tests-sales-crm-test-ts-66 | unit-tests/sales-crm.test.ts:66 | test("draft quotations replace their saved lines and template snapshot without changing terminal documents", async () => { |
| TEST-unit-tests-service-advisor-test-ts-5 | unit-tests/service-advisor.test.ts:5 | test("service follow-up status includes counts for empty and pending histories", () => { |
| TEST-unit-tests-service-advisor-test-ts-10 | unit-tests/service-advisor.test.ts:10 | test("service follow-up status is Done with the exact completed count only when every saved record is complete", () => { |
| TEST-unit-tests-service-advisor-test-ts-14 | unit-tests/service-advisor.test.ts:14 | test("only operational follow-up statuses permit new contacts", () => { |
| TEST-unit-tests-service-task-catalog-assignments-test-ts-24 | unit-tests/service-task-catalog-assignments.test.ts:24 | test("catalog assignments require an active department, allow unassigned brand and segment, and retain archived master labels", async () => { |
| TEST-unit-tests-service-task-catalog-gst-test-ts-38 | unit-tests/service-task-catalog-gst.test.ts:38 | test("catalog GST is validated and snapshots through tasks into estimate lines", async () => { |
| TEST-unit-tests-service-task-catalog-gst-test-ts-92 | unit-tests/service-task-catalog-gst.test.ts:92 | test("migration gives legacy catalog and job task rows the 18% GST default", async () => { |
| TEST-unit-tests-service-task-catalog-test-ts-17 | unit-tests/service-task-catalog.test.ts:17 | test("catalog snapshots active services into repeatable task-list rows and preserves the snapshot after archive", async () => { |
| TEST-unit-tests-service-task-catalog-test-ts-26 | unit-tests/service-task-catalog.test.ts:26 | test("task-list mutations enforce advisor ownership and active lifecycle, and estimate prefill is idempotent", async () => { |
| TEST-unit-tests-service-worker-test-ts-41 | unit-tests/service-worker.test.ts:41 | test("page navigations use the network before the offline shell", async () => { |
| TEST-unit-tests-service-worker-test-ts-58 | unit-tests/service-worker.test.ts:58 | test("page navigations fall back to the cached shell when offline", async () => { |
| TEST-unit-tests-team-structure-test-ts-30 | unit-tests/team-structure.test.ts:30 | test("departments retain manager appointments and expose advisors under their assigned manager", async () => { |
| TEST-unit-tests-team-structure-test-ts-51 | unit-tests/team-structure.test.ts:51 | test("advisor reassignment is exclusive and removing a manager cascades only that manager's team", async () => { |
| TEST-unit-tests-team-structure-test-ts-70 | unit-tests/team-structure.test.ts:70 | test("only active role-qualified users can be appointed or assigned", async () => { |
| TEST-unit-tests-team-structure-test-ts-81 | unit-tests/team-structure.test.ts:81 | test("preloads the two service departments and maps one manager to each", async () => { |
| TEST-tests-global-users-spec-ts-49 | tests/global-users.spec.ts:49 | test("Cognito login uses authorization-code PKCE and never renders the demo selector", async ({ page }) => { |
| TEST-tests-global-users-spec-ts-62 | tests/global-users.spec.ts:62 | test("global User Management invites without passwords, persists, polls, edits, resends, and archives", async ({ page }) => { |
| TEST-tests-remote-followups-spec-ts-14 | tests/remote-followups.spec.ts:14 | test("authenticated Service Advisor uses API-backed Follow-ups and Search", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-49 | tests/workshopos.spec.ts:49 |  test(`${email} can open every role screen`, async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-58 | tests/workshopos.spec.ts:58 | test("service Job Cards uses a one-row table toolbar without customer, advisor, or view controls", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-86 | tests/workshopos.spec.ts:86 | test("service My Queue is a responsive active-job table with direct record actions", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-127 | tests/workshopos.spec.ts:127 | test("advance bookings are limited to the next two complete months", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-165 | tests/workshopos.spec.ts:165 | test("Accounts Ready To Invoice lists only active pending invoices and is read only", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-183 | tests/workshopos.spec.ts:183 | test("desktop main content scrolls without moving the navigation rail", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-205 | tests/workshopos.spec.ts:205 | test("desktop navigation scrolls independently in a short viewport", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-221 | tests/workshopos.spec.ts:221 | test("admin hides customer and vehicle pages from its navigation rail", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-229 | tests/workshopos.spec.ts:229 | test("saved Store page access immediately removes Purchase Orders from its inventory navigation", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-244 | tests/workshopos.spec.ts:244 | test("admin dashboard presents live metrics in an accessible command-center grid", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-354 | tests/workshopos.spec.ts:354 | test("reception creates a linked customer vehicle visit and job searchable after reload", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-448 | tests/workshopos.spec.ts:448 | test("admin can open the management hub and create a user", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-462 | tests/workshopos.spec.ts:462 | test("list filters expose Clear but no Search submit action", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-473 | tests/workshopos.spec.ts:473 | test("Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-527 | tests/workshopos.spec.ts:527 | test("admin service task subtabs and role filters stay compact on desktop and stack on mobile", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-599 | tests/workshopos.spec.ts:599 | test("Management Hub Job Cards filters estimated delivery dates, months, archived records, and clears", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-639 | tests/workshopos.spec.ts:639 | test("direct Job Cards uses one clear two-row filter toolbar", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-711 | tests/workshopos.spec.ts:711 | test("Job Card entry defaults to a local month with no jobs and Clear shows all months", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-738 | tests/workshopos.spec.ts:738 | test("search shows an explicit empty state without an unrelated job", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-747 | tests/workshopos.spec.ts:747 | test("service Search retains its four record categories without the underlying page grants", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-776 | tests/workshopos.spec.ts:776 | test("search combines entity and lifecycle filters and clears predictably", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-850 | tests/workshopos.spec.ts:850 | test("admin Search exposes operational workspaces without restoring hidden rail entries", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-878 | tests/workshopos.spec.ts:878 | test("Search gives delegated categories the shared filter grid without changing their filters", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-926 | tests/workshopos.spec.ts:926 | test("non-admin Search keeps its existing category availability", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-935 | tests/workshopos.spec.ts:935 | test("admin loads the deterministic large dataset and paginates core lists", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-969 | tests/workshopos.spec.ts:969 | test("core entity lists switch views and expose deterministic totals", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-999 | tests/workshopos.spec.ts:999 | test("media filters use the linked job received date and scope job cards to the advisor", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1032 | tests/workshopos.spec.ts:1032 | test("mobile lists use cards, compact pagination and no horizontal overflow", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1047 | tests/workshopos.spec.ts:1047 | test("opening a paginated record and returning preserves list state", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1062 | tests/workshopos.spec.ts:1062 | test("job dialogs expose distinct modes, documents, focus return and shared search entry", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1084 | tests/workshopos.spec.ts:1084 | test("Job Cards grid uses direct, permission-aware view, edit and archive actions", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1114 | tests/workshopos.spec.ts:1114 | test("job card document actions stack editors, replace creation actions after save, and download financial PDFs", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1193 | tests/workshopos.spec.ts:1193 | test("customer and vehicle records use distinct view and edit dialogs on every list surface", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1232 | tests/workshopos.spec.ts:1232 | test("Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1288 | tests/workshopos.spec.ts:1288 | test("Data Flow filters and suggestions stay within a mobile viewport", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1303 | tests/workshopos.spec.ts:1303 | test("admin management domains expose contextual creation paths", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1318 | tests/workshopos.spec.ts:1318 | test("Accounts billing lists include records received outside today and print colored documents", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1349 | tests/workshopos.spec.ts:1349 | test("Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1445 | tests/workshopos.spec.ts:1445 | test("Manage Job Cards uses view and edit dialogs with documents and confirmed archive", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1478 | tests/workshopos.spec.ts:1478 | test("admin receives readable duplicate user validation", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1494 | tests/workshopos.spec.ts:1494 | test("contextual create actions remain visible on mobile role screens", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1506 | tests/workshopos.spec.ts:1506 | test("store stock and material requests combine search with domain filters", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1535 | tests/workshopos.spec.ts:1535 | test("stock filter toolbars use no more than two rows above mobile", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1556 | tests/workshopos.spec.ts:1556 | test("Store cannot bypass the Purchase Order workflow with direct Stock Inward", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1567 | tests/workshopos.spec.ts:1567 | test("Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1582 | tests/workshopos.spec.ts:1582 | test("issue and reconcile lists filter by item and reconciliation state", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1597 | tests/workshopos.spec.ts:1597 | test("material record queues use compact rows and issue actions do not open their row", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1620 | tests/workshopos.spec.ts:1620 | test("store reconciliation states use status pills and shared table actions", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1629 | tests/workshopos.spec.ts:1629 | test("reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1670 | tests/workshopos.spec.ts:1670 | test("store material queues default to today and keep record filters, exports and workflows in sync", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1732 | tests/workshopos.spec.ts:1732 | test("PDF and Excel downloads use the current filtered rows and visible columns", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1764 | tests/workshopos.spec.ts:1764 | test("store pagination resets after filtering", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1778 | tests/workshopos.spec.ts:1778 | test("admin user CRUD persists and protects the signed-in admin", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1800 | tests/workshopos.spec.ts:1800 | test("Team Structure creates departments and manages appointed manager advisor teams responsively", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1858 | tests/workshopos.spec.ts:1858 | test("company settings validate, preview, reset and persist report assets", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1894 | tests/workshopos.spec.ts:1894 | test("App Theme previews, saves live UI tokens, and restores the default", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1920 | tests/workshopos.spec.ts:1920 | test("tax and billing settings validate, normalize, persist, audit and drive invoice print", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-1977 | tests/workshopos.spec.ts:1977 | test("report templates preview safely, validate, activate and persist", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2025 | tests/workshopos.spec.ts:2025 | test("job documents download financial PDFs, print other templated reports and explain blocked popups", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2058 | tests/workshopos.spec.ts:2058 | test("job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2085 | tests/workshopos.spec.ts:2085 | test("lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2162 | tests/workshopos.spec.ts:2162 | test("estimate dialog stages item CRUD and persists only on Save", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2191 | tests/workshopos.spec.ts:2191 | test("service advisor Job Card defaults to the current delivery month", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2217 | tests/workshopos.spec.ts:2217 | test("service follow-ups show all assigned jobs and resolve the earlier open contact", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2254 | tests/workshopos.spec.ts:2254 | test("job card media validates, compresses, edits, archives, stays session-only, and responds on mobile", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2344 | tests/workshopos.spec.ts:2344 | test("Developer Console manages demo tenants, messages, billing and writable role emulation", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2381 | tests/workshopos.spec.ts:2381 | test("linked advisor can change job media while other authorized job viewers are read only", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2410 | tests/workshopos.spec.ts:2410 | test("fresh demo data provides a multi-supplier price review before PO approval", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2430 | tests/workshopos.spec.ts:2430 | test("Store creates a Purchase Request without supplier access or later-stage actions", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2461 | tests/workshopos.spec.ts:2461 | test("Admin can create a Purchase Request", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2474 | tests/workshopos.spec.ts:2474 | test("Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2489 | tests/workshopos.spec.ts:2489 | test("Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2517 | tests/workshopos.spec.ts:2517 | test("Admin approves a New Item Request with a supplier, price, and zero-stock SKU", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2550 | tests/workshopos.spec.ts:2550 | test("Admin issues an approved Purchase Order and both roles can see its Supplier Basket context", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2707 | tests/workshopos.spec.ts:2707 | test("job sheet intake fields and damage marks persist through the Job Card edit dialog", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2752 | tests/workshopos.spec.ts:2752 | test("owner adds, requests and cancels a material row with an over-stock warning", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2775 | tests/workshopos.spec.ts:2775 | test("Store releases a requested row, then Admin edits it as Issued with a note", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2815 | tests/workshopos.spec.ts:2815 | test("estimate approval and invoice creation enable Completed with per-line GST totals", async ({ page }) => { |
| TEST-tests-workshopos-spec-ts-2842 | tests/workshopos.spec.ts:2842 | test("searchable pickers dismiss outside interactions and still select options", async ({ page }) => { |
| TEST-backend-tests-integration-test_finance-py-54 | backend/tests/integration/test_finance.py:54 | def test_issued_invoice_payment_receipt_void_and_handover_are_scoped_and_immutable() -> None: |
| TEST-backend-tests-integration-test_finance-py-93 | backend/tests/integration/test_finance.py:93 | def test_pre_payment_void_keeps_number_and_allows_numbered_replacement() -> None: |
| TEST-backend-tests-integration-test_finance-py-109 | backend/tests/integration/test_finance.py:109 | def test_invoice_uses_approved_snapshot_and_paid_correction_is_credit_note_then_refund() -> None: |
| TEST-backend-tests-integration-test_followups_search-py-56 | backend/tests/integration/test_followups_search.py:56 | def test_followups_and_search_are_routed_by_permissions_tenant_and_branch() -> None: |
| TEST-backend-tests-integration-test_health-py-8 | backend/tests/integration/test_health.py:8 | def test_versioned_health_endpoint_uses_postgresql() -> None: |
| TEST-backend-tests-integration-test_intake-py-36 | backend/tests/integration/test_intake.py:36 | def test_intake_records_are_created_searched_archived_and_hidden_from_another_tenant() -> None: |
| TEST-backend-tests-integration-test_inventory-py-43 | backend/tests/integration/test_inventory.py:43 | def test_catalogue_purchase_inward_and_ledger_are_branch_scoped_and_audited() -> None: |
| TEST-backend-tests-integration-test_jobs-py-64 | backend/tests/integration/test_jobs.py:64 | def test_job_estimate_decision_and_lifecycle_are_scoped_and_audited() -> None: |
| TEST-backend-tests-integration-test_materials-py-58 | backend/tests/integration/test_materials.py:58 | def test_reservation_issue_return_waste_are_scoped_and_never_overdraw_stock() -> None: |
| TEST-backend-tests-integration-test_sales_crm-py-42 | backend/tests/integration/test_sales_crm.py:42 | def test_lead_not_entered_flags_round_trip_and_are_audited() -> None: |
| TEST-backend-tests-integration-test_sales_crm-py-70 | backend/tests/integration/test_sales_crm.py:70 | def test_quotation_created_date_filters_ignore_valid_until() -> None: |
| TEST-backend-tests-integration-test_superadmin-py-93 | backend/tests/integration/test_superadmin.py:93 | def test_superadmin_provisions_audited_read_only_tenant_control_plane() -> None: |
| TEST-backend-tests-integration-test_tenant_admin-py-42 | backend/tests/integration/test_tenant_admin.py:42 | def test_tenant_admin_manages_only_own_directory_and_browser_bypass_is_rejected() -> None: |
| TEST-backend-tests-integration-test_tenant_isolation-py-43 | backend/tests/integration/test_tenant_isolation.py:43 | def test_rls_fails_closed_and_blocks_cross_tenant_and_cross_branch_rows() -> None: |
| TEST-backend-tests-unit-test_auth_config-py-17 | backend/tests/unit/test_auth_config.py:17 | def test_local_demo_header_is_explicitly_development_only() -> None: |
| TEST-backend-tests-unit-test_auth_config-py-23 | backend/tests/unit/test_auth_config.py:23 | def test_auth_config_returns_local_contract_only_for_local_mode(monkeypatch: pytest.MonkeyPatch) -> None: |
| TEST-backend-tests-unit-test_auth_config-py-30 | backend/tests/unit/test_auth_config.py:30 | def test_auth_config_rejects_local_emulator_outside_local_environment(monkeypatch: pytest.MonkeyPatch) -> None: |
| TEST-backend-tests-unit-test_finance-py-6 | backend/tests/unit/test_finance.py:6 | def test_fiscal_year_rolls_over_on_indian_financial_year_boundary() -> None: |
| TEST-backend-tests-unit-test_finance-py-11 | backend/tests/unit/test_finance.py:11 | def test_rendered_snapshot_is_deterministic_and_contains_document_identity() -> None: |
| TEST-backend-tests-unit-test_finance-py-17 | backend/tests/unit/test_finance.py:17 | def test_issued_document_html_escapes_untrusted_snapshot_content() -> None: |
| TEST-backend-tests-unit-test_intake-py-26 | backend/tests/unit/test_intake.py:26 | def test_single_branch_is_selected_only_when_server_scope_is_unambiguous() -> None: |
| TEST-backend-tests-unit-test_intake-py-33 | backend/tests/unit/test_intake.py:33 | def test_caller_cannot_select_branch_outside_membership() -> None: |
| TEST-backend-tests-unit-test_intake-py-39 | backend/tests/unit/test_intake.py:39 | def test_existing_service_queue_permission_allows_intake_but_not_unrelated_roles() -> None: |
| TEST-backend-tests-unit-test_intake-py-46 | backend/tests/unit/test_intake.py:46 | def test_support_emulation_can_read_but_never_mutate() -> None: |
| TEST-backend-tests-unit-test_intake-py-53 | backend/tests/unit/test_intake.py:53 | def test_blank_input_has_a_stable_client_safe_error() -> None: |
| TEST-backend-tests-unit-test_inventory-py-21 | backend/tests/unit/test_inventory.py:21 | def test_inventory_authority_is_explicit_and_support_is_read_only() -> None: |
| TEST-backend-tests-unit-test_inventory-py-32 | backend/tests/unit/test_inventory.py:32 | def test_stock_adjustment_input_requires_a_nonzero_quantity_at_command_boundary() -> None: |
| TEST-backend-tests-unit-test_inventory-py-40 | backend/tests/unit/test_inventory.py:40 | def test_runtime_role_has_only_the_po_line_delete_grant_needed_for_draft_replacement() -> None: |
| TEST-backend-tests-unit-test_materials-py-9 | backend/tests/unit/test_materials.py:9 | def test_material_command_requires_a_positive_quantity() -> None: |
| TEST-backend-tests-unit-test_materials-py-15 | backend/tests/unit/test_materials.py:15 | def test_reservation_projection_keeps_reservation_and_on_job_quantities_distinct() -> None: |
| TEST-backend-tests-unit-test_materials-py-26 | backend/tests/unit/test_materials.py:26 | def test_reservation_input_uses_camel_case_wire_fields() -> None: |
| TEST-backend-tests-unit-test_tenancy-py-29 | backend/tests/unit/test_tenancy.py:29 | def test_session_payload_contains_only_server_resolved_scope() -> None: |
| TEST-backend-tests-unit-test_tenancy-py-43 | backend/tests/unit/test_tenancy.py:43 | def test_branch_scope_is_postgresql_safe_and_rejects_unassigned_branch() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-18 | backend/tests/unit/test_tenant_admin.py:18 | def test_assignments_require_a_role_and_branch() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-29 | backend/tests/unit/test_tenant_admin.py:29 | def test_only_declared_operational_permissions_can_be_assigned() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-39 | backend/tests/unit/test_tenant_admin.py:39 | def test_assignment_rejects_duplicate_ids() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-49 | backend/tests/unit/test_tenant_admin.py:49 | def test_bootstrap_roles_match_the_existing_operational_role_labels() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-60 | backend/tests/unit/test_tenant_admin.py:60 | def test_self_archive_and_final_tenant_admin_guards_fail_closed() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-70 | backend/tests/unit/test_tenant_admin.py:70 | def test_owner_role_update_cannot_drop_tenant_admin_capabilities() -> None: |
| TEST-backend-tests-unit-test_tenant_admin-py-76 | backend/tests/unit/test_tenant_admin.py:76 | def test_service_manager_role_keeps_the_service_job_permissions() -> None: |