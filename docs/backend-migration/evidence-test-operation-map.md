# Tests to requirement operations

Exact test titles and called contract symbols, parsed without executing E2E mutations. Unit execution status is in evidence-unit-test-run.md. Existing tests are evidence of intent even when not run.

| Test | Title | Contract symbols |
|---|---|---|
| unit-tests/admin-demo-state.test.ts:51 | "defaults represent all seven WorkshopOS roles and current menu pages" | OP-admin-demo-state-resolveRoleMenuPageKeys, OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-resolvePermittedPages |
| unit-tests/admin-demo-state.test.ts:72 | "page catalogue is the source of truth for role menus and Inventory access" |  |
| unit-tests/admin-demo-state.test.ts:84 | "role menus retain supported boundaries while honoring page access grants" | OP-admin-demo-state-resolveRoleMenuPageKeys, OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-updateRolePageAccess, OP-admin-demo-state-resolvePermittedPages |
| unit-tests/admin-demo-state.test.ts:102 | "app theme defaults, updates, persists and hydrates legacy sessions" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState, OP-admin-demo-state-saveAdminDemoState, OP-admin-demo-state-updateAppTheme |
| unit-tests/admin-demo-state.test.ts:124 | "session persistence is versioned, recoverable and resettable" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState, OP-admin-demo-state-saveAdminDemoState, OP-admin-demo-state-resetAdminDemoState, OP-admin-demo-state-updateBusinessSettings |
| unit-tests/admin-demo-state.test.ts:137 | "fresh billing settings contain valid tax and payment instructions" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-validateBusinessSettings |
| unit-tests/admin-demo-state.test.ts:146 | "older session GSTIN migrates to billing without replacing custom state" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState |
| unit-tests/admin-demo-state.test.ts:164 | "business settings normalization trims values, preserves account zeros and uppercases identifiers" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-normalizeBusinessSettings |
| unit-tests/admin-demo-state.test.ts:177 | "billing validation reports GSTIN, IFSC and UPI errors independently" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-validateBusinessSettings |
| unit-tests/admin-demo-state.test.ts:186 | "custom role helpers are immutable and preserve role mappings" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-addDemoRole, OP-admin-demo-state-updateDemoRole, OP-admin-demo-state-archiveDemoRole, OP-admin-demo-state-resolvePermittedPages |
| unit-tests/admin-demo-state.test.ts:203 | "Owner/Admin always keeps Admin Console access" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-updateRolePageAccess, OP-admin-demo-state-resolvePermittedPages |
| unit-tests/admin-demo-state.test.ts:210 | "version 1 sessions migrate Sales CRM into Owner/Admin page access" | OP-admin-demo-state-resolveRoleMenuPageKeys, OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState, OP-admin-demo-state-resolvePermittedPages |
| unit-tests/admin-demo-state.test.ts:225 | "unsupported persisted session versions reset to defaults" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState |
| unit-tests/admin-demo-state.test.ts:235 | "business settings deep updates retain sibling values" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-updateBusinessSettings |
| unit-tests/admin-demo-state.test.ts:244 | "logs append, filter, clear and enforce per-stream retention" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-updateBusinessSettings, OP-admin-demo-state-appendDemoLog, OP-admin-demo-state-filterDemoLogs, OP-admin-demo-state-clearDemoLogs, OP-admin-demo-state-enforceLogRetention |
| unit-tests/admin-demo-state.test.ts:273 | "confirmInventoryImport merges valid rows into session inventory only" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-confirmInventoryImport |
| unit-tests/advance-booking-range.test.ts:10 | "advance bookings run from tomorrow through the next three calendar months" | OP-advance-booking-range-advanceBookingRange, OP-advance-booking-range-isAdvanceBookingDate |
| unit-tests/advance-booking-range.test.ts:19 | "advance bookings span a year boundary and begin tomorrow" | OP-advance-booking-range-advanceBookingRange, OP-advance-booking-range-isAdvanceBookingDate |
| unit-tests/advance-booking-range.test.ts:27 | "calendar month navigation is date-only and spans year boundaries" | OP-advance-booking-range-shiftCalendarMonth, OP-advance-booking-range-datesForCalendarMonth |
| unit-tests/billing-domain.test.ts:40 | "invoice copies estimate items exactly once and then remains independent" | OP-db-readState, OP-db-createInvoiceFromEstimate |
| unit-tests/billing-domain.test.ts:60 | "custom invoice creation persists finalized lines and totals and rejects invalid drafts without partial writes" | OP-db-readState, OP-db-createInvoiceFromEstimate |
| unit-tests/billing-domain.test.ts:85 | "post-payment invoice is fully locked once Cleared" | OP-db-readState, OP-db-updateInvoiceFields, OP-db-createInvoiceForActor, OP-db-saveInvoiceForActor, OP-db-recordPayment |
| unit-tests/billing-domain.test.ts:99 | "invoice fields and items recalculate subtotal, overall discount, GST, total, and document availability" | OP-db-readState, OP-db-updateInvoiceFields, OP-db-createInvoiceItem, OP-db-updateInvoiceItem, OP-db-archiveInvoiceItem, OP-db-createInvoiceFromEstimate |
| unit-tests/billing-domain.test.ts:118 | "Record Payment validates mode, is a single full payment, and needs an active invoice" | OP-db-readState, OP-db-createInvoiceFromEstimate, OP-db-recordPayment |
| unit-tests/billing-domain.test.ts:134 | "payment requires the Google review/feedback reminder and the reminder cannot be N/A" | OP-db-createInvoiceFromEstimate, OP-db-recordPayment, OP-db-setChecklistItemNotApplicable |
| unit-tests/billing-domain.test.ts:148 | "Record Payment atomically creates payment, receipt, gate pass and delivery acknowledgement, then closes" | OP-db-readState, OP-db-createInvoiceFromEstimate, OP-db-recordPayment |
| unit-tests/billing-domain.test.ts:163 | "direct manual Close remains forbidden after a payment" | OP-db-readState, OP-db-createInvoiceFromEstimate, OP-db-recordPayment, OP-db-transitionJobStatus |
| unit-tests/billing-domain.test.ts:174 | "payment is rejected during rework and closes only after the job is completed again" | OP-db-readState, OP-db-createInvoiceFromEstimate, OP-db-recordPayment, OP-db-transitionJobStatus |
| unit-tests/billing-domain.test.ts:196 | "Record Payment rolls back payment, receipt and invoice status when a step fails" | OP-db-readState, OP-db-createInvoiceFromEstimate, OP-db-recordPayment |
| unit-tests/billing-domain.test.ts:210 | "a payment-created closure is immutable" | OP-db-readState, OP-db-createInvoiceFromEstimate, OP-db-recordPayment, OP-db-voidPayment |
| unit-tests/billing-domain.test.ts:222 | "a closed job's payment can no longer be voided or recorded" | OP-db-createInvoiceFromEstimate, OP-db-recordPayment, OP-db-voidPayment |
| unit-tests/billing-domain.test.ts:230 | "billing actor boundary allows Owner/Admin and Accounts while rejecting every other role" | OP-db-readState, OP-db-createInvoiceForActor, OP-db-voidInvoiceForActor, OP-db-recordPaymentForActor, OP-db-voidPaymentForActor |
| unit-tests/billing-domain.test.ts:245 | "Accounts payment records delivery details as part of the handover" | OP-db-readState, OP-db-createInvoiceForActor, OP-db-recordPaymentForActor |
| unit-tests/billing-domain.test.ts:260 | "payments mixed list orders unpaid, received, then void and gates void/record actions" | OP-invoice-math-mixedPaymentRows, OP-invoice-math-canRecordOrVoidPayment, OP-invoice-math-canVoidCurrentInvoice |
| unit-tests/billing-reconciliation.test.ts:15 | "reconciliation requires current invoice, payment, receipt, gate pass and delivery acknowledgement" | OP-invoice-math-billingReconciliation |
| unit-tests/body-mark.test.ts:5 | "body-mark PNG header includes the recorded timestamp or historical fallback" |  |
| unit-tests/booking-followup.test.ts:8 | "Expected Today includes only operational arrival states for the selected date and exposes follow-up filters" | OP-booking-followup-expectedBookingsForDate |
| unit-tests/bookings.test.ts:22 | "creating a Booking persists an independent future-arrival snapshot without creating a Visit or Job Card" | OP-db-readState, OP-db-createBooking |
| unit-tests/bookings.test.ts:37 | "an operational Booking can be edited, confirmed and rescheduled with an auditable reason" | OP-db-createBooking, OP-db-updateBooking, OP-db-confirmBooking, OP-db-rescheduleBooking |
| unit-tests/bookings.test.ts:48 | "follow-up calls have their own timestamped history and terminal bookings cannot be changed" | OP-db-createBooking, OP-db-updateBooking, OP-db-markBookingNoShow, OP-db-recordBookingCall |
| unit-tests/bookings.test.ts:60 | "cancellation and lifecycle validation require meaningful reasons and legal transitions" | OP-db-createBooking, OP-db-confirmBooking, OP-db-rescheduleBooking, OP-db-cancelBooking |
| unit-tests/bookings.test.ts:72 | "a daily capacity blocks Reception and records an Admin's reasoned over-capacity exception" | OP-db-readState, OP-db-bookingCapacityForDate, OP-db-setBookingCapacityForDate, OP-db-createBooking |
| unit-tests/bookings.test.ts:92 | "service types have independent default and configured capacity" | OP-db-bookingCapacityForDate, OP-db-setBookingCapacityForDate, OP-db-createBooking |
| unit-tests/bookings.test.ts:107 | "migration backfills legacy bookings and carries a legacy daily capacity into Service Work" | OP-db-migrateSchema |
| unit-tests/bookings.test.ts:118 | "checking in a Booking atomically creates an unassigned Visit and Job Card with an auditable link" | OP-db-createBooking, OP-db-checkInBooking |
| unit-tests/bookings.test.ts:137 | "a failed Booking check-in leaves the Booking and workshop intake untouched" | OP-db-createBooking, OP-db-checkInBooking |
| unit-tests/checklists.test.ts:33 | "items are flagged required or optional and N/A carries its own timestamp and actor" | OP-db-setChecklistItemNotApplicableForActor |
| unit-tests/checklists.test.ts:48 | "optional items do not block completion of the status checklist, required ones do" | OP-db-transitionJobStatusForActor, OP-db-setChecklistItemCheckedForActor |
| unit-tests/checklists.test.ts:58 | "a checklist is editable only while the card is in that status" | OP-db-transitionJobStatusForActor, OP-db-setChecklistItemCheckedForActor, OP-db-setChecklistItemNotApplicableForActor |
| unit-tests/checklists.test.ts:72 | "Estimate and Invoice ticks refuse without a saved document, and ticks need no note" | OP-db-saveEstimateForActor, OP-db-setChecklistItemCheckedForActor, OP-db-setChecklistItemNotApplicableForActor |
| unit-tests/checklists.test.ts:85 | "Close is blocked until the COMPLETED checklist is fully ticked" | OP-db-transitionJobStatusForActor |
| unit-tests/dashboard-metrics.test.ts:16 | "dashboard collections include only current-month payments linked to non-voided cleared invoices" | OP-dashboard-metrics-dashboardFacts |
| unit-tests/dashboard-metrics.test.ts:30 | "dashboard projection follows the current calendar month's elapsed days and length" | OP-dashboard-metrics-dashboardFacts |
| unit-tests/dashboard-metrics.test.ts:42 | "dashboard cashflow can report a completed historical month without changing operational periods" | OP-dashboard-metrics-dashboardFacts |
| unit-tests/data-flow.test.ts:19 | "Data Flow derives distinct visit months and dates newest first" | OP-data-flow-dataFlowMonths, OP-data-flow-dataFlowDates |
| unit-tests/data-flow.test.ts:25 | "Data Flow combines normalized text, month, and exact-date filters" | OP-data-flow-filterDataFlowJobs |
| unit-tests/data-flow.test.ts:31 | "chronological Data Flow combines lifecycle, financial, document and media audit events" | OP-data-flow-buildDataFlowTimeline |
| unit-tests/data-flow.test.ts:61 | "terminal audit events suppress same-timestamp edits and retain invoice generation after availability changes" | OP-data-flow-buildDataFlowTimeline |
| unit-tests/data-flow.test.ts:84 | "lifecycle summary reports the active cycle and ordered remaining steps" | OP-data-flow-summarizeJobLifecycle |
| unit-tests/data-flow.test.ts:99 | "ghost steps list remaining checklist items then uncreated documents with reasons" | OP-data-flow-buildGhostSteps |
| unit-tests/data-flow.test.ts:118 | "document-creating events carry a document reference; void ones are flagged" | OP-data-flow-buildDataFlowTimeline |
| unit-tests/data-flow.test.ts:131 | "cancelled jobs emit no ghost steps at all" | OP-data-flow-buildGhostSteps |
| unit-tests/developer-control-plane.test.ts:30 | "seeds one selected active tenant and persists safely in session storage" | OP-developer-control-plane-createDefaultDeveloperControlPlane, OP-developer-control-plane-loadDeveloperControlPlane, OP-developer-control-plane-saveDeveloperControlPlane, OP-developer-control-plane-selectedTenant |
| unit-tests/developer-control-plane.test.ts:40 | "creates, selects, disables, restores and updates a tenant profile" | OP-developer-control-plane-createDefaultDeveloperControlPlane, OP-developer-control-plane-selectedTenant, OP-developer-control-plane-createTenant, OP-developer-control-plane-setTenantLifecycle, OP-developer-control-plane-updateTenantProfile |
| unit-tests/developer-control-plane.test.ts:50 | "simulated communication logs outcomes without provider calls" | OP-developer-control-plane-createDefaultDeveloperControlPlane, OP-developer-control-plane-setTenantLifecycle, OP-developer-control-plane-simulateCommunicationTest |
| unit-tests/developer-control-plane.test.ts:58 | "charges allow partial and full payment histories" | OP-developer-control-plane-createDefaultDeveloperControlPlane, OP-developer-control-plane-createPlatformCharge, OP-developer-control-plane-recordPlatformPayment, OP-developer-control-plane-chargeStatus |
| unit-tests/developer-control-plane.test.ts:68 | "reset restores the seeded browser-session state" | OP-developer-control-plane-createDefaultDeveloperControlPlane, OP-developer-control-plane-loadDeveloperControlPlane, OP-developer-control-plane-saveDeveloperControlPlane, OP-developer-control-plane-resetDeveloperControlPlane, OP-developer-control-plane-createTenant |
| unit-tests/document-snapshots.test.ts:24 | "approved estimate freezes on first sight; open invoice does not" | OP-admin-demo-state-loadAdminDemoState, OP-document-snapshots-planSnapshots |
| unit-tests/document-snapshots.test.ts:29 | "Cleared invoice and receipt freeze, and later template and settings edits do not change them" | OP-admin-demo-state-loadAdminDemoState, OP-admin-demo-state-updateBusinessSettings, OP-admin-demo-state-updateReportTemplate, OP-document-snapshots-planSnapshots, OP-job-documents-renderJobDocument |
| unit-tests/document-snapshots.test.ts:44 | "voiding keeps the document listed from its frozen copy; reopened invoice unfreezes" | OP-admin-demo-state-loadAdminDemoState, OP-document-snapshots-planSnapshots, OP-job-documents-resolveJobDocuments |
| unit-tests/document-snapshots.test.ts:60 | "a different job with the same id after a dataset swap does not produce void documents" | OP-admin-demo-state-loadAdminDemoState, OP-document-snapshots-planSnapshots |
| unit-tests/finance-ui.test.ts:5 | "online finance exposes a void only for an unpaid immutable invoice" | OP-finance-ui-canVoidRemoteInvoice |
| unit-tests/finance-ui.test.ts:11 | "replacement is a new document only after a void and without an active invoice" | OP-finance-ui-isActiveRemoteInvoice, OP-finance-ui-requiresInvoiceReplacement, OP-finance-ui-canReplaceRemoteInvoice, OP-finance-ui-remoteDocumentFilename |
| unit-tests/followup-completion.test.ts:32 | "a resolved new contact closes prior open follow-ups while preserving their history" | OP-db-readState, OP-db-createFollowup, OP-db-createResolvedFollowup, OP-service-advisor-serviceFollowupStatus |
| unit-tests/inventory-import.test.ts:15 | "parses CSV buffers and suggests canonical mappings" | OP-inventory-import-parseInventoryWorkbook, OP-inventory-import-suggestInventoryColumnMapping |
| unit-tests/inventory-import.test.ts:31 | "parses XLSX buffers and gives duplicate headers stable names" | OP-inventory-import-parseInventoryWorkbook |
| unit-tests/inventory-import.test.ts:46 | "normalizes valid rows and assigns deterministic session IDs" | OP-inventory-import-buildInventoryImportPreview |
| unit-tests/inventory-import.test.ts:68 | "rejects missing values, invalid quantities, negative quantities and duplicate SKUs" | OP-inventory-import-buildInventoryImportPreview |
| unit-tests/inventory-import.test.ts:86 | "reports incomplete or stale explicit mappings before validating rows" | OP-inventory-import-buildInventoryImportPreview |
| unit-tests/inventory-import.test.ts:99 | "inventory template is a parseable workbook with auto-mappable headers" | OP-inventory-import-parseInventoryWorkbook, OP-inventory-import-suggestInventoryColumnMapping, OP-inventory-import-buildInventoryTemplateBuffer |
| unit-tests/inventory-import.test.ts:106 | "sheet-per-category workbooks without SKU/unit columns import with derived values" | OP-inventory-import-parseInventoryWorkbook, OP-inventory-import-suggestInventoryColumnMapping, OP-inventory-import-buildInventoryImportPreview |
| unit-tests/inventory.test.ts:12 | "selling prices migrate to zero and persist through stock operations" | OP-db-persist, OP-db-readState, OP-db-createInventoryItem, OP-db-updateInventoryItem, OP-db-stockIn, OP-db-createSchema, OP-db-migrateSchema |
| unit-tests/invoice.test.ts:56 | "flat discount is spread proportionally and GST is computed per line on the reduced value" | OP-invoice-math-invoiceTotals |
| unit-tests/invoice.test.ts:63 | "discount rounding remainder lands on the last line and a discount never exceeds the subtotal" | OP-invoice-math-invoiceTotals |
| unit-tests/invoice.test.ts:69 | "line GST accepts only the supported rates, normalizes No GST, and totals mixed treatments" | OP-db-saveEstimateForActor, OP-invoice-math-invoiceTotals |
| unit-tests/invoice.test.ts:87 | "migration assigns legacy zero-rate rows to No GST and preserves other tax amounts" | OP-db-migrateSchema |
| unit-tests/invoice.test.ts:99 | "migration makes active legacy invoices available and records document generation" | OP-db-migrateSchema |
| unit-tests/invoice.test.ts:106 | "invoice persistence ignores a legacy unavailable value on create and edit" | OP-db-approveEstimateForActor, OP-db-createInvoiceForActor, OP-db-saveInvoiceForActor |
| unit-tests/invoice.test.ts:121 | "legacy invoice availability does not block closure readiness" | OP-db-approveEstimateForActor, OP-db-createInvoiceForActor, OP-db-closureBlockers |
| unit-tests/invoice.test.ts:131 | "estimate-to-invoice conversion transfers every line's GST treatment" | OP-db-saveEstimateForActor, OP-db-approveEstimateForActor, OP-db-createInvoiceForActor |
| unit-tests/invoice.test.ts:143 | "estimate is generated explicitly, approved by Owner or linked Advisor with a note" | OP-db-approveEstimateForActor |
| unit-tests/invoice.test.ts:155 | "invoice pre-fills Service lines from the estimate and Issued rows; unissued rows only warn" | OP-db-addMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-db-createInvoiceForActor, OP-invoice-math-buildInvoiceDraft |
| unit-tests/invoice.test.ts:168 | "creating an invoice locks picked-up rows with the invoice id and needs Owner or Advisor in IN_PROGRESS" | OP-db-approveEstimateForActor, OP-db-editIssuedMaterialRowForActor, OP-db-createInvoiceForActor, OP-invoice-math-buildInvoiceDraft, OP-materials-materialRowActionsFor |
| unit-tests/invoice.test.ts:185 | "Accounts may create invoices only for completed jobs" | OP-db-approveEstimateForActor, OP-db-createInvoiceForActor, OP-invoice-math-canCreateInvoice |
| unit-tests/invoice.test.ts:204 | "Completed is enabled only once an invoice exists, and voiding it disables Completed again" | OP-db-transitionJobStatusForActor, OP-db-approveEstimateForActor, OP-db-createInvoiceForActor, OP-db-voidInvoiceForActor, OP-invoice-math-canCompleteWithInvoice |
| unit-tests/invoice.test.ts:221 | "unpaid invoice edits are audited, add late materials and lock them; removing a line or voiding unlocks rows" | OP-data-flow-buildDataFlowTimeline, OP-db-readState, OP-db-approveEstimateForActor, OP-db-materialStockOnHand, OP-db-createInvoiceForActor, OP-db-saveInvoiceForActor, OP-db-voidInvoiceForActor, OP-invoice-math-buildInvoiceDraft |
| unit-tests/invoice.test.ts:248 | "a paid invoice rejects line edits" | OP-db-approveEstimateForActor, OP-db-createInvoiceForActor, OP-db-saveInvoiceForActor |
| unit-tests/invoice.test.ts:273 | "ticking Payment Received creates the payment, receipt and gate pass, then closes the job" | OP-db-setChecklistItemCheckedForActor |
| unit-tests/invoice.test.ts:290 | "ticking Payment Received requires a current invoice" | OP-db-voidInvoiceForActor, OP-db-setChecklistItemCheckedForActor |
| unit-tests/invoice.test.ts:297 | "voiding needs Owner/Accounts and a reason; a paid invoice cannot be voided; a re-created invoice gets a new number" | OP-db-createInvoiceForActor, OP-db-voidInvoiceForActor, OP-db-recordPaymentForActor, OP-db-setChecklistItemCheckedForActor |
| unit-tests/inward-purchases.test.ts:42 | "Store creates editable Purchase Requests with permanent auto-generated PO numbers" | OP-db-createPurchaseRequestForActor, OP-db-updatePurchaseRequestForActor, OP-db-cancelPurchaseRequestForActor |
| unit-tests/inward-purchases.test.ts:85 | "Store cannot bypass Purchase Requests with a supplier-priced PO or later-stage command" | OP-db-createSupplierForActor, OP-db-createPurchaseOrderForActor, OP-db-setPurchaseOrderStatusForActor |
| unit-tests/inward-purchases.test.ts:94 | "PO request numbering rolls over after 99,999 and never reuses a cancelled number" | OP-db-createPurchaseRequestForActor |
| unit-tests/inward-purchases.test.ts:104 | "Admin reviews only the three newest completed purchases for a requested SKU across suppliers" | OP-db-createSupplierForActor, OP-db-previousPurchaseHistoryForItem, OP-db-createPurchaseOrderForActor |
| unit-tests/inward-purchases.test.ts:122 | "Admin can optionally save a manual quotation only for a requested PO line" | OP-db-savePurchaseOrderQuotationForActor, OP-db-createPurchaseRequestForActor |
| unit-tests/inward-purchases.test.ts:134 | "only Admin can commercially approve a request, enriching new items at zero stock and splitting suppliers" | OP-db-createSupplierForActor, OP-db-createPurchaseRequestForActor, OP-db-approvePurchaseRequestForActor |
| unit-tests/inward-purchases.test.ts:168 | "only an Admin can issue a fully approved Purchase Order to its assigned supplier" | OP-db-createSupplierForActor, OP-db-createPurchaseRequestForActor, OP-db-approvePurchaseRequestForActor, OP-db-issuePurchaseOrderForActor |
| unit-tests/inward-purchases.test.ts:190 | "migration preserves legacy submitted receipts as read-only received history" | OP-db-createSchema, OP-db-migrateSchema |
| unit-tests/inward-purchases.test.ts:200 | "Store submits an invoice receipt once and its signed ledger increases the shared stock balance" | OP-db-createSupplierForActor, OP-db-createInwardPurchaseDraft, OP-db-updateInwardPurchaseDraftForActor, OP-db-submitInwardPurchaseForActor, OP-db-materialStockOnHand |
| unit-tests/inward-purchases.test.ts:212 | "submission validates the supplier invoice and document requirements" | OP-db-createSupplierForActor, OP-db-createInwardPurchaseDraft, OP-db-submitInwardPurchaseForActor |
| unit-tests/inward-purchases.test.ts:224 | "an Admin revision retains the original receipt and applies only the quantity delta" | OP-db-createSupplierForActor, OP-db-createInwardPurchaseDraft, OP-db-submitInwardPurchaseForActor, OP-db-reviseInwardPurchaseForActor, OP-db-materialStockOnHand |
| unit-tests/inward-purchases.test.ts:236 | "purchase orders reconcile linked stock inwards without creating a second receipt movement" | OP-db-createSupplierForActor, OP-db-createPurchaseOrderForActor, OP-db-setPurchaseOrderStatusForActor, OP-db-recordStockInwardForActor, OP-db-materialStockOnHand |
| unit-tests/inward-purchases.test.ts:253 | "PO links reject mismatches and terminal orders while manual inward remains independent" | OP-db-createSupplierForActor, OP-db-createPurchaseOrderForActor, OP-db-setPurchaseOrderStatusForActor, OP-db-recordStockInwardForActor, OP-db-materialStockOnHand |
| unit-tests/inward-purchases.test.ts:271 | "a draft creates one approved PO snapshot and posts its receipt only once" | OP-db-createSupplierForActor, OP-db-createInwardPurchaseDraft, OP-db-sendInwardPurchaseForPoApprovalForActor, OP-db-approveInwardPurchaseForActor, OP-db-receiveAndPostInwardPurchaseForActor, OP-db-materialStockOnHand |
| unit-tests/inward-purchases.test.ts:289 | "receipt posting rejects mismatched linked PO rows atomically" | OP-db-createSupplierForActor, OP-db-createInwardPurchaseDraft, OP-db-sendInwardPurchaseForPoApprovalForActor, OP-db-approveInwardPurchaseForActor, OP-db-receiveAndPostInwardPurchaseForActor, OP-db-materialStockOnHand |
| unit-tests/job-card-layout.test.ts:11 | "tab set and order match the dialog layout" |  |
| unit-tests/job-card-layout.test.ts:15 | "unbuilt tabs are stubs, built tabs are not" | OP-job-card-layout-isStubTab |
| unit-tests/job-card-layout.test.ts:19 | "footer offers Create Estimate to the owner and lists Job Card download" | OP-job-card-layout-resolveJobCardFooter |
| unit-tests/job-card-layout.test.ts:29 | "footer gives read-only roles no actions" | OP-job-card-layout-resolveJobCardFooter |
| unit-tests/job-card-notifications.test.ts:38 | "job-card notification templates interpolate the saved workshop profile" | OP-admin-demo-state-createDefaultAdminDemoState, OP-job-card-notifications-renderJobCardNotification |
| unit-tests/job-card-notifications.test.ts:61 | "notification template settings trim, validate, and retain defaults for legacy settings" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState, OP-admin-demo-state-normalizeBusinessSettings, OP-admin-demo-state-validateBusinessSettings |
| unit-tests/job-card-notifications.test.ts:96 | "interim delivery stub only reports its native confirmation" | OP-job-card-notifications-deliverJobCardNotificationStub |
| unit-tests/job-card-ui-domain.test.ts:26 | "job card edit and archive wrappers reject unlinked actors" | OP-db-updateJobCardForActor, OP-db-archiveJobCardForActor |
| unit-tests/job-card-ui-domain.test.ts:42 | "only owner and linked service advisor can mutate lifecycle and checklist" | OP-db-transitionJobStatusForActor, OP-db-setChecklistItemCheckedForActor |
| unit-tests/job-card-ui-domain.test.ts:60 | "Cancel is Owner/Advisor only, direct Close is forbidden, and terminal jobs are read-only" | OP-db-transitionJobStatusForActor, OP-db-setChecklistItemCheckedForActor |
| unit-tests/job-card-ui-domain.test.ts:73 | "Cancel is Owner/Advisor only, direct Close is forbidden, and terminal jobs are read-only" | OP-db-transitionJobStatusForActor, OP-db-setChecklistItemCheckedForActor |
| unit-tests/job-card-ui-domain.test.ts:85 | "estimate save validates, persists items and completes Create Estimate only after save" | OP-db-saveEstimateForActor |
| unit-tests/job-delivery-highlight.test.ts:13 | "estimated delivery highlights local calendar boundaries" | OP-job-delivery-highlight-jobDeliveryTone, OP-job-delivery-highlight-jobDeliveryClass |
| unit-tests/job-delivery-highlight.test.ts:21 | "invalid or missing delivery dates have no highlight" | OP-job-delivery-highlight-jobDeliveryTone |
| unit-tests/job-delivery-highlight.test.ts:27 | "only active unarchived jobs receive delivery highlights" | OP-job-delivery-highlight-jobDeliveryTone |
| unit-tests/job-documents.test.ts:26 | "Job Card sheet is always available and the four slots follow the creation rules" | OP-job-documents-resolveJobDocuments |
| unit-tests/job-documents.test.ts:38 | "Approved estimate, Cleared invoice, receipt and gate pass are frozen; Open invoice is ready" | OP-job-documents-documentInfo |
| unit-tests/job-documents.test.ts:47 | "void documents stay listed from their snapshots; cancelled jobs are read-only" | OP-job-documents-resolveJobDocumentActions, OP-job-documents-resolveJobDocuments |
| unit-tests/job-documents.test.ts:58 | "live rendering uses the Active template and company branding, Gate Pass shows Cleared not amounts, Job Card embeds the recorded damage diagram" | OP-admin-demo-state-loadAdminDemoState, OP-job-documents-renderJobDocument |
| unit-tests/job-documents.test.ts:75 | "current document actions reject voided or mismatched financial records" | OP-job-documents-resolveJobDocuments |
| unit-tests/job-documents.test.ts:90 | "document actions reflect record availability, lifecycle, assignment and billing permissions" | OP-job-documents-resolveJobDocumentActions |
| unit-tests/job-documents.test.ts:116 | "job card renders the damage diagram even when a stored template lacks the placeholder" | OP-admin-demo-state-loadAdminDemoState, OP-job-documents-renderJobDocument |
| unit-tests/job-media.test.ts:38 | "media validation accepts bounded raster data URLs and rejects unsafe or mismatched content" | OP-job-media-validateMediaDataUrl |
| unit-tests/job-media.test.ts:46 | "file validation enforces declared MIME, magic bytes, and the 10 MB input bound" | OP-job-media-validateMediaFile |
| unit-tests/job-media.test.ts:54 | "owner and linked advisor can save metadata while other roles cannot mutate media" | OP-db-readState, OP-db-saveJobPhotoForActor, OP-db-updateJobPhotoForActor, OP-db-archiveJobPhotoForActor |
| unit-tests/job-media.test.ts:83 | "media stays in the live SQL.js session but is stripped from the localStorage snapshot" | OP-db-exportPersistableDatabase, OP-db-readState, OP-db-saveJobPhotoForActor |
| unit-tests/job-media.test.ts:95 | "readState keeps archived jobs separate while retaining their photo audit history" | OP-db-readState, OP-db-archiveJobCardForActor, OP-db-saveJobPhotoForActor, OP-db-archiveJobPhotoForActor |
| unit-tests/job-picker.test.ts:8 | "job picker derives its current Month-Year from the local calendar" |  |
| unit-tests/job-picker.test.ts:14 | "period changes invalidate a selected job instead of choosing a replacement" |  |
| unit-tests/job-picker.test.ts:20 | "jobs match one Month-Year or the unfiltered all-months option" |  |
| unit-tests/job-sheet.test.ts:19 | "intake fields are saved on job card, vehicle and customer" | OP-db-receiveVehicle |
| unit-tests/job-sheet.test.ts:29 | "Details edits persist and a re-intake without new fields keeps them" | OP-db-persist, OP-db-receiveVehicle, OP-db-updateJobSheetForActor |
| unit-tests/job-sheet.test.ts:41 | "one job-details save updates the job card and job sheet records together" | OP-db-receiveVehicle, OP-db-saveJobDetailsForActor |
| unit-tests/job-sheet.test.ts:54 | "job-details saves preserve the assigned service advisor" | OP-db-receiveVehicle, OP-db-saveJobDetailsForActor |
| unit-tests/job-sheet.test.ts:61 | "Owner and assigned advisor can save or clear only the delivery date in every editable status" | OP-db-readState, OP-db-receiveVehicle, OP-db-updateEstimatedDeliveryForActor |
| unit-tests/job-sheet.test.ts:80 | "other users, archived records and terminal jobs cannot change the delivery date" | OP-db-receiveVehicle, OP-db-updateEstimatedDeliveryForActor |
| unit-tests/job-sheet.test.ts:97 | "before and after photo mutation gates follow the job status" | OP-db-receiveVehicle, OP-db-saveJobPhotoForActor, OP-db-archiveJobPhotoForActor |
| unit-tests/job-sheet.test.ts:114 | "damage marks add, remove and persist with the job card; technician cannot edit" | OP-db-persist, OP-db-receiveVehicle, OP-db-setDamageMarksForActor, OP-job-sheet-parseDamageMarks, OP-job-sheet-addDamageMark, OP-job-sheet-removeDamageMark |
| unit-tests/job-sheet.test.ts:133 | "migration adds the body-mark record timestamp without changing legacy marks" | OP-db-createSchema, OP-db-migrateSchema |
| unit-tests/job-sheet.test.ts:146 | "pure helpers clamp, tolerate bad JSON, and never reuse ids" | OP-job-sheet-parseDamageMarks, OP-job-sheet-addDamageMark, OP-job-sheet-removeDamageMark |
| unit-tests/job-sheet.test.ts:153 | "legacy four-panel damage marks map into the unified illustration" | OP-job-sheet-parseDamageMarks |
| unit-tests/job-sheet.test.ts:158 | "dropped paper fields (D.O.B., tyres, road test) are not in the schema" |  |
| unit-tests/lifecycle-model.test.ts:33 | "lifecycle model exposes exactly six main statuses and ordered stage templates" | OP-db-deriveChecklistSubStatus |
| unit-tests/lifecycle-model.test.ts:42 | "migration keeps HOLD as a real status, preserves audit evidence, and creates lifecycle storage" | OP-db-migrateLifecycleStorage |
| unit-tests/lifecycle-model.test.ts:62 | "migration backfills one required Google review reminder into active unpaid Completed cycles only" | OP-db-migrateLifecycleStorage |
| unit-tests/lifecycle-model.test.ts:81 | "checklist changes derive the compatibility sub-status and actor timestamps" | OP-db-migrateLifecycleStorage, OP-db-setChecklistItemChecked |
| unit-tests/lifecycle-model.test.ts:93 | "legacy job edits cannot override the checklist-derived compatibility summary" | OP-db-updateJobCard, OP-db-migrateLifecycleStorage |
| unit-tests/lifecycle-model.test.ts:103 | "large demo lifecycle seeds are deterministic and contain no HOLD status" | OP-db-loadLargeDemoDataset |
| unit-tests/lifecycle-model.test.ts:115 | "every CLOSED large-demo job has a complete billing handover" | OP-db-readState, OP-db-loadLargeDemoDataset, OP-invoice-math-billingReconciliation |
| unit-tests/lifecycle-transition.test.ts:57 | "central transition API enforces the complete allowed-transition table" | OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:86 | "checklists enforce ordering and gate forward transitions without partial writes" | OP-db-setChecklistItemChecked, OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:102 | "every transition requires a note, cancellation bypasses gates, and CLOSED is terminal" | OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:112 | "direct closure is rejected, including through the central transition API" | OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:122 | "an Admin cannot manually close a completed job" | OP-db-transitionJobStatusForActor |
| unit-tests/lifecycle-transition.test.ts:129 | "HOLD pauses without a checklist gate and resumes the same IN_PROGRESS cycle" | OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:142 | "transition failure rolls back status, new cycle, and audit history atomically" | OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:154 | "completed-job rework creates fresh stage cycles and preserves prior history" | OP-db-transitionJobStatus |
| unit-tests/lifecycle-transition.test.ts:173 | "non-billing artifacts never advance main status; valid payment closes and creates handover artifacts" | OP-db-approveEstimate, OP-db-issueMaterial, OP-db-createTask, OP-db-updateTask, OP-db-markWashingNeeded, OP-db-passQc, OP-db-generateInvoice, OP-db-recordPayment, OP-db-createFollowup, OP-db-createPhoto, OP-db-transitionJobStatus |
| unit-tests/list-utils.test.ts:6 | "pagination calculates ranges and only returns the active page" | OP-list-utils-paginate |
| unit-tests/list-utils.test.ts:12 | "pagination clamps pages, handles empty results and page-size changes" | OP-list-utils-clampPage, OP-list-utils-paginate |
| unit-tests/list-utils.test.ts:20 | "search normalization and adaptive page numbers are deterministic" | OP-list-utils-normalizeSearch, OP-list-utils-pageNumbers |
| unit-tests/list-utils.test.ts:28 | "active filters omit defaults and retain their labels" | OP-list-utils-activeFilterSummary |
| unit-tests/list-utils.test.ts:32 | "exports contain exactly the supplied filtered rows and visible columns" | OP-export-utils-buildExportMatrix |
| unit-tests/list-utils.test.ts:45 | "draft filters apply explicitly and clear resets both copies and page" | OP-list-utils-applyFilterDraft, OP-list-utils-clearFilterDraft |
| unit-tests/materials.test.ts:52 | "rows go Draft, Requested, Re-requested and Cancel only from requested states" | OP-db-addMaterialRowForActor, OP-db-updateMaterialRowForActor, OP-db-deleteMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-db-reRequestMaterialRowForActor, OP-db-cancelMaterialRowForActor |
| unit-tests/materials.test.ts:70 | "Draft rows delete freely" | OP-db-addMaterialRowForActor, OP-db-deleteMaterialRowForActor |
| unit-tests/materials.test.ts:77 | "rows change only while IN_PROGRESS and only for Owner or the linked Advisor" | OP-db-addMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-materials-canManageMaterialRows |
| unit-tests/materials.test.ts:89 | "requesting over stock warns but succeeds; stock is seed minus ledger" | OP-db-readState, OP-db-addMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-materials-overStockWarning |
| unit-tests/materials.test.ts:101 | "material demand triage sends shortages to procurement and leaves available SKUs issuable" | OP-materials-triageMaterialDemand |
| unit-tests/materials.test.ts:107 | "material demand triage allocates projected availability across outstanding requests for the same SKU" | OP-materials-triageMaterialDemands, OP-materials-allocateMaterialDemands |
| unit-tests/materials.test.ts:134 | "Materials Requested auto-ticks on the first Requested row and stays ticked when cancelled" | OP-db-addMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-db-cancelMaterialRowForActor |
| unit-tests/materials.test.ts:144 | "Materials Issued unticks when a new request is made" | OP-db-addMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-db-reconcileArtifactChecklist |
| unit-tests/materials.test.ts:155 | "N/A on the materials items is refused once rows exist" | OP-db-addMaterialRowForActor, OP-db-setChecklistItemNotApplicableForActor |
| unit-tests/materials.test.ts:165 | "permitted actions per row state" | OP-materials-materialRowActions |
| unit-tests/materials.test.ts:180 | "Store release writes a signed ledger record, decrements stock and ticks Materials Issued" | OP-db-readState, OP-db-materialStockOnHand, OP-db-releaseMaterialRowForActor |
| unit-tests/materials.test.ts:192 | "reconciliation corrections keep on-hand stock, movement history, and audit history aligned" | OP-db-reconcileMaterialQty, OP-db-materialStockOnHand, OP-db-releaseMaterialRowForActor |
| unit-tests/materials.test.ts:217 | "release over stock is blocked and writes nothing" | OP-db-releaseMaterialRowForActor |
| unit-tests/materials.test.ts:224 | "release requires IN_PROGRESS and is unavailable on ordinary HOLD or COMPLETED" | OP-db-releaseMaterialRowForActor |
| unit-tests/materials.test.ts:233 | "Store material approval holds a job, freezes it, then approval restores retained issue eligibility" | OP-db-submitMaterialApprovalForActor, OP-db-decideMaterialApprovalForActor, OP-db-updateMaterialRowForActor, OP-db-releaseMaterialRowForActor |
| unit-tests/materials.test.ts:249 | "rejection requires a reason and only the linked advisor can correct and resubmit" | OP-db-submitMaterialApprovalForActor, OP-db-decideMaterialApprovalForActor, OP-db-resubmitMaterialApprovalForActor, OP-db-reRequestMaterialRowForActor, OP-db-releaseMaterialRowForActor |
| unit-tests/materials.test.ts:263 | "Materials Issued needs every non-cancelled row Issued and unticks on a new request" | OP-db-addMaterialRowForActor, OP-db-requestMaterialRowForActor, OP-db-releaseMaterialRowForActor, OP-db-cancelMaterialRowForActor, OP-db-reconcileArtifactChecklist |
| unit-tests/materials.test.ts:276 | "Issued edit needs a note, stays Issued, adjusts stock by the difference and logs old/new" | OP-db-readState, OP-db-materialStockOnHand, OP-db-releaseMaterialRowForActor, OP-db-editIssuedMaterialRowForActor |
| unit-tests/materials.test.ts:294 | "Issued edit can switch item and is blocked once invoiced" | OP-db-materialStockOnHand, OP-db-releaseMaterialRowForActor, OP-db-editIssuedMaterialRowForActor |
| unit-tests/materials.test.ts:304 | "local purchases persist with a job, can be edited and archived, and never affect stock or material rows" | OP-db-persist, OP-db-readState, OP-db-createLocalPurchase, OP-db-updateLocalPurchase, OP-db-archiveLocalPurchase, OP-db-materialStockOnHand |
| unit-tests/materials.test.ts:329 | "local purchases require a selected job and vendor/bill details" | OP-db-createLocalPurchase |
| unit-tests/materials.test.ts:336 | "legacy direct purchase, stock and issue is denied without posting inventory or issuing material" | OP-db-createMaterialPurchaseRequestForActor, OP-db-purchaseStockAndIssueForActor |
| unit-tests/purchase-order-receipt-confirmation.test.ts:46 | "Admin records multiple partial PO deliveries without changing stock" | OP-db-recordPurchaseOrderReceiptForActor |
| unit-tests/purchase-order-receipt-confirmation.test.ts:70 | "closing a confirmed PO posts accepted stock once and locks its audit record" | OP-db-readState, OP-db-recordPurchaseOrderReceiptForActor, OP-db-confirmPurchaseOrderForActor, OP-db-closePurchaseOrderForActor, OP-db-recordStockInwardForActor |
| unit-tests/purchase-order-receipt-confirmation.test.ts:103 | "Admin confirms a partial delivery when every delivered unit is accounted for" | OP-db-recordPurchaseOrderReceiptForActor, OP-db-confirmPurchaseOrderForActor |
| unit-tests/purchase-order-supplier-display.test.ts:5 | "purchase-order grid resolves a string-serialized supplier ID" | OP-purchase-order-supplier-display-supplierNameForPurchaseOrder |
| unit-tests/report-template-layout.test.ts:6 | "every default template uses the modern accent band (prototype layout B) with company header, stamp and signature" | OP-report-templates-seedReportTemplates |
| unit-tests/report-template-layout.test.ts:22 | "quotation seeds include reddish Marron and orangish Yellow template variants" | OP-report-templates-seedReportTemplates |
| unit-tests/report-template-layout.test.ts:30 | "amount in words uses Indian grouping" | OP-report-templates-rupeesInWords |
| unit-tests/report-template-layout.test.ts:36 | "stale unedited seeded defaults upgrade; edited templates are kept" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState |
| unit-tests/report-templates.test.ts:16 | "print documents preserve template background colors" | OP-report-templates-buildPrintDocument |
| unit-tests/report-templates.test.ts:22 | "active invoices remain report-available despite a legacy unavailable flag" | OP-report-templates-reportAvailable |
| unit-tests/report-templates.test.ts:42 | "defaults seed exactly one active template for every report category" | OP-admin-demo-state-createDefaultAdminDemoState |
| unit-tests/report-templates.test.ts:53 | "older session JSON hydrates new defaults and repairs active-template invariants" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-loadAdminDemoState |
| unit-tests/report-templates.test.ts:66 | "template creation validates names/placeholders and active transfer is immutable" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-createReportTemplate, OP-admin-demo-state-updateReportTemplate, OP-admin-demo-state-activateReportTemplate |
| unit-tests/report-templates.test.ts:82 | "company identity saves name and assets atomically" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-saveCompanyIdentity |
| unit-tests/report-templates.test.ts:92 | "placeholder validation and rendering escape scalar values while preserving generated blocks" | OP-report-templates-findUnsupportedPlaceholders, OP-report-templates-sampleReportValues, OP-report-templates-renderReportTemplate |
| unit-tests/report-templates.test.ts:99 | "report availability and values aggregate every payment and balance" | OP-admin-demo-state-createDefaultAdminDemoState, OP-report-templates-reportAvailable, OP-report-templates-buildReportValues |
| unit-tests/report-templates.test.ts:113 | "invoice values expose saved billing placeholders and sanitize the configured payment block" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-updateBusinessSettings, OP-report-templates-buildReportValues, OP-report-templates-renderReportTemplate |
| unit-tests/report-templates.test.ts:131 | "invoice payment block omits blank rows and disappears when nothing is configured" | OP-admin-demo-state-createDefaultAdminDemoState, OP-report-templates-buildReportValues |
| unit-tests/report-templates.test.ts:142 | "estimate is a seeded category with a default that uses the lines loop" | OP-admin-demo-state-createDefaultAdminDemoState, OP-report-templates-reportAvailable |
| unit-tests/report-templates.test.ts:151 | "{{#lines}} loops merge one row per line with escaped values; line keys only work inside the loop" | OP-admin-demo-state-createDefaultAdminDemoState, OP-report-templates-findUnsupportedPlaceholders, OP-report-templates-buildReportValues, OP-report-templates-buildReportLines, OP-report-templates-renderReportTemplate |
| unit-tests/report-templates.test.ts:164 | "company settings singleton saves contact details, GSTIN and footer atomically and exposes them as merge keys" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-saveCompanyIdentity, OP-report-templates-buildReportValues |
| unit-tests/report-templates.test.ts:174 | "images merge only when they are PNG/JPEG data URLs" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-saveCompanyIdentity, OP-report-templates-buildReportValues |
| unit-tests/report-templates.test.ts:183 | "a template can be deleted unless it is the active one" | OP-admin-demo-state-createDefaultAdminDemoState, OP-admin-demo-state-createReportTemplate, OP-admin-demo-state-deleteReportTemplate |
| unit-tests/sales-crm.test.ts:17 | "updating a sales lead preserves its ID and normalizes every editable field" | OP-db-readState, OP-db-createSalesLead, OP-db-updateSalesLead |
| unit-tests/sales-crm.test.ts:27 | "updating a sales lead requires a name and phone" | OP-db-createSalesLead, OP-db-updateSalesLead |
| unit-tests/sales-crm.test.ts:35 | "sales lead not-entered flags default to false and round-trip through updates" | OP-db-readState, OP-db-createSalesLead, OP-db-updateSalesLead |
| unit-tests/sales-crm.test.ts:48 | "lead register filters locally and resets to all statuses" |  |
| unit-tests/sales-crm.test.ts:58 | "inline lead saves preserve the complete draft and live filters include query and stage" |  |
| unit-tests/sales-crm.test.ts:66 | "draft quotations replace their saved lines and template snapshot without changing terminal documents" | OP-db-readState, OP-db-createSalesLead, OP-db-createSalesQuotation, OP-db-updateSalesQuotation, OP-db-setSalesQuotationStatus |
| unit-tests/service-advisor.test.ts:5 | "service follow-up status includes counts for empty and pending histories" | OP-service-advisor-serviceFollowupStatus |
| unit-tests/service-advisor.test.ts:10 | "service follow-up status is Done with the exact completed count only when every saved record is complete" | OP-service-advisor-serviceFollowupStatus |
| unit-tests/service-advisor.test.ts:14 | "only operational follow-up statuses permit new contacts" | OP-service-advisor-canAddServiceFollowup |
| unit-tests/service-task-catalog-assignments.test.ts:24 | "catalog assignments require an active department, allow unassigned brand and segment, and retain archived master labels" | OP-db-readState, OP-db-createServiceCatalogItemForActor, OP-db-updateServiceCatalogItemForActor, OP-db-createServiceDepartment, OP-db-createServiceCatalogMaster, OP-db-updateServiceCatalogMaster |
| unit-tests/service-task-catalog-gst.test.ts:38 | "catalog GST is validated and snapshots through tasks into estimate lines" | OP-db-createServiceCatalogItemForActor, OP-db-updateServiceCatalogItemForActor, OP-db-addJobTaskListItemForActor, OP-db-prefillEstimateFromTaskListForActor |
| unit-tests/service-task-catalog-gst.test.ts:92 | "migration gives legacy catalog and job task rows the 18% GST default" | OP-db-createSchema, OP-db-migrateSchema |
| unit-tests/service-task-catalog.test.ts:17 | "catalog snapshots active services into repeatable task-list rows and preserves the snapshot after archive" | OP-db-createServiceCatalogItemForActor, OP-db-archiveServiceCatalogItemForActor, OP-db-addJobTaskListItemForActor |
| unit-tests/service-task-catalog.test.ts:26 | "task-list mutations enforce advisor ownership and active lifecycle, and estimate prefill is idempotent" | OP-db-addJobTaskListItemForActor, OP-db-updateJobTaskListItemForActor, OP-db-archiveJobTaskListItemForActor, OP-db-prefillEstimateFromTaskListForActor |
| unit-tests/service-worker.test.ts:41 | "page navigations use the network before the offline shell" |  |
| unit-tests/service-worker.test.ts:58 | "page navigations fall back to the cached shell when offline" |  |
| unit-tests/team-structure.test.ts:30 | "departments retain manager appointments and expose advisors under their assigned manager" | OP-db-readState, OP-db-createServiceDepartment, OP-db-appointServiceDepartmentManager, OP-db-assignServiceAdvisorTeam |
| unit-tests/team-structure.test.ts:51 | "advisor reassignment is exclusive and removing a manager cascades only that manager's team" | OP-db-readState, OP-db-createServiceDepartment, OP-db-appointServiceDepartmentManager, OP-db-removeServiceDepartmentManager, OP-db-assignServiceAdvisorTeam, OP-db-removeServiceAdvisorTeam |
| unit-tests/team-structure.test.ts:70 | "only active role-qualified users can be appointed or assigned" | OP-db-createServiceDepartment, OP-db-appointServiceDepartmentManager, OP-db-assignServiceAdvisorTeam |
| unit-tests/team-structure.test.ts:81 | "preloads the two service departments and maps one manager to each" | OP-db-readState, OP-db-ensureDemoTeamStructure, OP-db-updateUser, OP-db-archiveUser |
| tests/global-users.spec.ts:49 | "Cognito login uses authorization-code PKCE and never renders the demo selector" | OP-db-login |
| tests/global-users.spec.ts:62 | "global User Management invites without passwords, persists, polls, edits, resends, and archives" |  |
| tests/remote-followups.spec.ts:14 | "authenticated Service Advisor uses API-backed Follow-ups and Search" |  |
| tests/workshopos.spec.ts:49 | `${email} can open every role screen` |  |
| tests/workshopos.spec.ts:58 | "service Job Cards uses a one-row table toolbar without customer, advisor, or view controls" |  |
| tests/workshopos.spec.ts:86 | "service My Queue is a responsive active-job table with direct record actions" |  |
| tests/workshopos.spec.ts:127 | "advance bookings are limited to the next two complete months" |  |
| tests/workshopos.spec.ts:165 | "Accounts Ready To Invoice lists only active pending invoices and is read only" |  |
| tests/workshopos.spec.ts:183 | "desktop main content scrolls without moving the navigation rail" |  |
| tests/workshopos.spec.ts:205 | "desktop navigation scrolls independently in a short viewport" |  |
| tests/workshopos.spec.ts:221 | "admin hides customer and vehicle pages from its navigation rail" |  |
| tests/workshopos.spec.ts:229 | "saved Store page access immediately removes Purchase Orders from its inventory navigation" |  |
| tests/workshopos.spec.ts:244 | "admin dashboard presents live metrics in an accessible command-center grid" |  |
| tests/workshopos.spec.ts:354 | "reception creates a linked customer vehicle visit and job searchable after reload" |  |
| tests/workshopos.spec.ts:448 | "admin can open the management hub and create a user" |  |
| tests/workshopos.spec.ts:462 | "list filters expose Clear but no Search submit action" |  |
| tests/workshopos.spec.ts:473 | "Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe" |  |
| tests/workshopos.spec.ts:527 | "admin service task subtabs and role filters stay compact on desktop and stack on mobile" |  |
| tests/workshopos.spec.ts:599 | "Management Hub Job Cards filters estimated delivery dates, months, archived records, and clears" |  |
| tests/workshopos.spec.ts:639 | "direct Job Cards uses one clear two-row filter toolbar" |  |
| tests/workshopos.spec.ts:711 | "Job Card entry defaults to a local month with no jobs and Clear shows all months" |  |
| tests/workshopos.spec.ts:738 | "search shows an explicit empty state without an unrelated job" |  |
| tests/workshopos.spec.ts:747 | "service Search retains its four record categories without the underlying page grants" |  |
| tests/workshopos.spec.ts:776 | "search combines entity and lifecycle filters and clears predictably" |  |
| tests/workshopos.spec.ts:850 | "admin Search exposes operational workspaces without restoring hidden rail entries" |  |
| tests/workshopos.spec.ts:878 | "Search gives delegated categories the shared filter grid without changing their filters" |  |
| tests/workshopos.spec.ts:926 | "non-admin Search keeps its existing category availability" |  |
| tests/workshopos.spec.ts:935 | "admin loads the deterministic large dataset and paginates core lists" |  |
| tests/workshopos.spec.ts:969 | "core entity lists switch views and expose deterministic totals" |  |
| tests/workshopos.spec.ts:999 | "media filters use the linked job received date and scope job cards to the advisor" |  |
| tests/workshopos.spec.ts:1032 | "mobile lists use cards, compact pagination and no horizontal overflow" |  |
| tests/workshopos.spec.ts:1047 | "opening a paginated record and returning preserves list state" |  |
| tests/workshopos.spec.ts:1062 | "job dialogs expose distinct modes, documents, focus return and shared search entry" |  |
| tests/workshopos.spec.ts:1084 | "Job Cards grid uses direct, permission-aware view, edit and archive actions" |  |
| tests/workshopos.spec.ts:1114 | "job card document actions stack editors, replace creation actions after save, and download financial PDFs" | OP-db-voidPayment |
| tests/workshopos.spec.ts:1193 | "customer and vehicle records use distinct view and edit dialogs on every list surface" |  |
| tests/workshopos.spec.ts:1232 | "Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states" |  |
| tests/workshopos.spec.ts:1288 | "Data Flow filters and suggestions stay within a mobile viewport" |  |
| tests/workshopos.spec.ts:1303 | "admin management domains expose contextual creation paths" |  |
| tests/workshopos.spec.ts:1318 | "Accounts billing lists include records received outside today and print colored documents" |  |
| tests/workshopos.spec.ts:1349 | "Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination" |  |
| tests/workshopos.spec.ts:1445 | "Manage Job Cards uses view and edit dialogs with documents and confirmed archive" |  |
| tests/workshopos.spec.ts:1478 | "admin receives readable duplicate user validation" |  |
| tests/workshopos.spec.ts:1494 | "contextual create actions remain visible on mobile role screens" |  |
| tests/workshopos.spec.ts:1506 | "store stock and material requests combine search with domain filters" |  |
| tests/workshopos.spec.ts:1535 | "stock filter toolbars use no more than two rows above mobile" |  |
| tests/workshopos.spec.ts:1556 | "Store cannot bypass the Purchase Order workflow with direct Stock Inward" |  |
| tests/workshopos.spec.ts:1567 | "Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests" |  |
| tests/workshopos.spec.ts:1582 | "issue and reconcile lists filter by item and reconciliation state" |  |
| tests/workshopos.spec.ts:1597 | "material record queues use compact rows and issue actions do not open their row" |  |
| tests/workshopos.spec.ts:1620 | "store reconciliation states use status pills and shared table actions" |  |
| tests/workshopos.spec.ts:1629 | "reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation" |  |
| tests/workshopos.spec.ts:1670 | "store material queues default to today and keep record filters, exports and workflows in sync" |  |
| tests/workshopos.spec.ts:1732 | "PDF and Excel downloads use the current filtered rows and visible columns" |  |
| tests/workshopos.spec.ts:1764 | "store pagination resets after filtering" |  |
| tests/workshopos.spec.ts:1778 | "admin user CRUD persists and protects the signed-in admin" |  |
| tests/workshopos.spec.ts:1800 | "Team Structure creates departments and manages appointed manager advisor teams responsively" |  |
| tests/workshopos.spec.ts:1858 | "company settings validate, preview, reset and persist report assets" | OP-db-persist |
| tests/workshopos.spec.ts:1894 | "App Theme previews, saves live UI tokens, and restores the default" |  |
| tests/workshopos.spec.ts:1920 | "tax and billing settings validate, normalize, persist, audit and drive invoice print" | OP-db-persist |
| tests/workshopos.spec.ts:1977 | "report templates preview safely, validate, activate and persist" | OP-db-persist |
| tests/workshopos.spec.ts:2025 | "job documents download financial PDFs, print other templated reports and explain blocked popups" |  |
| tests/workshopos.spec.ts:2058 | "job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note" |  |
| tests/workshopos.spec.ts:2085 | "lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment" |  |
| tests/workshopos.spec.ts:2162 | "estimate dialog stages item CRUD and persists only on Save" |  |
| tests/workshopos.spec.ts:2191 | "service advisor Job Card defaults to the current delivery month" |  |
| tests/workshopos.spec.ts:2217 | "service follow-ups show all assigned jobs and resolve the earlier open contact" |  |
| tests/workshopos.spec.ts:2254 | "job card media validates, compresses, edits, archives, stays session-only, and responds on mobile" |  |
| tests/workshopos.spec.ts:2344 | "Developer Console manages demo tenants, messages, billing and writable role emulation" |  |
| tests/workshopos.spec.ts:2381 | "linked advisor can change job media while other authorized job viewers are read only" |  |
| tests/workshopos.spec.ts:2410 | "fresh demo data provides a multi-supplier price review before PO approval" |  |
| tests/workshopos.spec.ts:2430 | "Store creates a Purchase Request without supplier access or later-stage actions" |  |
| tests/workshopos.spec.ts:2461 | "Admin can create a Purchase Request" |  |
| tests/workshopos.spec.ts:2474 | "Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form" |  |
| tests/workshopos.spec.ts:2489 | "Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request" |  |
| tests/workshopos.spec.ts:2517 | "Admin approves a New Item Request with a supplier, price, and zero-stock SKU" |  |
| tests/workshopos.spec.ts:2550 | "Admin issues an approved Purchase Order and both roles can see its Supplier Basket context" |  |
| tests/workshopos.spec.ts:2707 | "job sheet intake fields and damage marks persist through the Job Card edit dialog" | OP-db-persist |
| tests/workshopos.spec.ts:2752 | "owner adds, requests and cancels a material row with an over-stock warning" |  |
| tests/workshopos.spec.ts:2775 | "Store releases a requested row, then Admin edits it as Issued with a note" |  |
| tests/workshopos.spec.ts:2815 | "estimate approval and invoice creation enable Completed with per-line GST totals" |  |
| tests/workshopos.spec.ts:2842 | "searchable pickers dismiss outside interactions and still select options" |  |