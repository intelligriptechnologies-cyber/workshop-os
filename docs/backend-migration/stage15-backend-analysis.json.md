{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/technician-tasks",
      "name": "list_my_tasks",
      "file": "backend/app/execution.py",
      "line": 60,
      "end": 63,
      "signature": "scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "technician_tasks"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/technician-tasks",
      "name": "assign_task",
      "file": "backend/app/execution.py",
      "line": 67,
      "end": 83,
      "signature": "input: TaskCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "membership_branches",
        "membership_roles",
        "role_permissions",
        "technician_tasks",
        "tenant_memberships"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/technician-tasks/{task_id}/update",
      "name": "update_task",
      "file": "backend/app/execution.py",
      "line": 87,
      "end": 96,
      "signature": "task_id: int, input: TaskUpdate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "technician_tasks",
        "work_updates"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/work-updates/{update_id}/attachments",
      "name": "upload_attachment",
      "file": "backend/app/execution.py",
      "line": 100,
      "end": 111,
      "signature": "update_id: int, scope: ScopedTenant, file: UploadFile=File(...), label: Annotated[str, Form(max_length=1000)]=''",
      "guards": [],
      "lock": false,
      "tables": [
        "evidence_attachments"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/attachments/{attachment_id}/content",
      "name": "read_attachment",
      "file": "backend/app/execution.py",
      "line": 115,
      "end": 123,
      "signature": "attachment_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "POST",
      "path": "/api/v1/qc-checks",
      "name": "create_qc_check",
      "file": "backend/app/execution.py",
      "line": 127,
      "end": 133,
      "signature": "input: QcCheckCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "qc_checks"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/qc-checks/{check_id}/result",
      "name": "record_qc_result",
      "file": "backend/app/execution.py",
      "line": 137,
      "end": 149,
      "signature": "check_id: int, input: QcResult, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "qc_checks",
        "qc_results",
        "technician_tasks"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "name": "list_job_invoices",
      "file": "backend/app/finance.py",
      "line": 270,
      "end": 275,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "invoices"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "name": "issue_invoice",
      "file": "backend/app/finance.py",
      "line": 279,
      "end": 344,
      "signature": "job_id: int, input: InvoiceIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "active_invoice_claims",
        "credit_notes",
        "financial_document_events",
        "invoice_lines",
        "invoices",
        "job_cards"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/void",
      "name": "void_invoice",
      "file": "backend/app/finance.py",
      "line": 348,
      "end": 364,
      "signature": "invoice_id: int, input: VoidInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "active_invoice_claims",
        "financial_document_events",
        "invoices",
        "payments"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/credit-notes",
      "name": "issue_credit_note",
      "file": "backend/app/finance.py",
      "line": 380,
      "end": 408,
      "signature": "invoice_id: int, input: CreditNoteIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "active_invoice_claims",
        "credit_notes",
        "financial_document_events",
        "invoices",
        "payments"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/credit-notes/{credit_note_id}/refunds",
      "name": "record_refund",
      "file": "backend/app/finance.py",
      "line": 412,
      "end": 429,
      "signature": "credit_note_id: int, input: RefundRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "credit_notes",
        "refunds"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "name": "record_payment",
      "file": "backend/app/finance.py",
      "line": 433,
      "end": 461,
      "signature": "invoice_id: int, input: PaymentRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "invoices",
        "payments"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "name": "list_payments",
      "file": "backend/app/finance.py",
      "line": 476,
      "end": 480,
      "signature": "invoice_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "payments"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/complete-handover",
      "name": "complete_handover",
      "file": "backend/app/finance.py",
      "line": 484,
      "end": 514,
      "signature": "job_id: int, input: HandoverInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": false,
      "tables": [
        "delivery_acknowledgements",
        "job_cards",
        "job_events",
        "payments"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/delivery",
      "name": "get_delivery",
      "file": "backend/app/finance.py",
      "line": 525,
      "end": 530,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "delivery_acknowledgements"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/financial-documents/{document_id}/content",
      "name": "get_document_content",
      "file": "backend/app/finance.py",
      "line": 534,
      "end": 544,
      "signature": "document_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "financial_documents"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/payments/{payment_id}/supporting-attachment",
      "name": "get_supporting_attachment",
      "file": "backend/app/finance.py",
      "line": 548,
      "end": 557,
      "signature": "payment_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "payments"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/follow-ups",
      "name": "list_followups",
      "file": "backend/app/followups.py",
      "line": 90,
      "end": 112,
      "signature": "scope: ScopedTenant, job_id: int | None=Query(default=None, alias='jobId', gt=0), branch_id: UUID | None=Query(default=None, alias='branchId'), archived: bool=False",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "followups",
        "job_cards",
        "vehicles",
        "visits"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/follow-ups/jobs",
      "name": "followup_jobs",
      "file": "backend/app/followups.py",
      "line": 116,
      "end": 129,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "job_cards",
        "vehicles",
        "visits"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/follow-ups",
      "name": "create_followup",
      "file": "backend/app/followups.py",
      "line": 133,
      "end": 146,
      "signature": "input: FollowupCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/follow-ups/{followup_id}",
      "name": "update_followup",
      "file": "backend/app/followups.py",
      "line": 150,
      "end": 163,
      "signature": "followup_id: int, input: FollowupUpdate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/commands/complete",
      "name": "complete_followup",
      "file": "backend/app/followups.py",
      "line": 167,
      "end": 179,
      "signature": "followup_id: int, input: FollowupComplete, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/archive",
      "name": "archive_followup",
      "file": "backend/app/followups.py",
      "line": 183,
      "end": 195,
      "signature": "followup_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/search",
      "name": "search",
      "file": "backend/app/followups.py",
      "line": 199,
      "end": 237,
      "signature": "scope: ScopedTenant, q: Annotated[str, Query(min_length=2, max_length=200)], branch_id: UUID | None=Query(default=None, alias='branchId'), limit: Annotated[int, Query(ge=1, le=100)]=30, entities: list[SearchEntity] | None=Query(default=None)",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "financial_document_events",
        "financial_documents",
        "invoices",
        "job_cards",
        "vehicles",
        "visits"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/customers",
      "name": "list_customers",
      "file": "backend/app/intake.py",
      "line": 169,
      "end": 181,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/customers",
      "name": "create_customer",
      "file": "backend/app/intake.py",
      "line": 185,
      "end": 193,
      "signature": "input: CustomerInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/customers/{customer_id}",
      "name": "get_customer",
      "file": "backend/app/intake.py",
      "line": 197,
      "end": 199,
      "signature": "customer_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "PUT",
      "path": "/api/v1/customers/{customer_id}",
      "name": "update_customer",
      "file": "backend/app/intake.py",
      "line": 203,
      "end": 210,
      "signature": "customer_id: int, input: CustomerInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/customers/{customer_id}/archive",
      "name": "archive_customer",
      "file": "backend/app/intake.py",
      "line": 214,
      "end": 221,
      "signature": "customer_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/vehicles",
      "name": "list_vehicles",
      "file": "backend/app/intake.py",
      "line": 225,
      "end": 229,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/vehicles",
      "name": "create_vehicle",
      "file": "backend/app/intake.py",
      "line": 233,
      "end": 238,
      "signature": "input: VehicleInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "name": "get_vehicle",
      "file": "backend/app/intake.py",
      "line": 242,
      "end": 244,
      "signature": "vehicle_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "PUT",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "name": "update_vehicle",
      "file": "backend/app/intake.py",
      "line": 248,
      "end": 255,
      "signature": "vehicle_id: int, input: VehicleInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/vehicles/{vehicle_id}/archive",
      "name": "archive_vehicle",
      "file": "backend/app/intake.py",
      "line": 259,
      "end": 264,
      "signature": "vehicle_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/visits",
      "name": "list_visits",
      "file": "backend/app/intake.py",
      "line": 268,
      "end": 272,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "vehicles",
        "visits"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/visits",
      "name": "create_visit",
      "file": "backend/app/intake.py",
      "line": 276,
      "end": 281,
      "signature": "input: VisitCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "visits"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/visits/{visit_id}",
      "name": "get_visit",
      "file": "backend/app/intake.py",
      "line": 285,
      "end": 287,
      "signature": "visit_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "PUT",
      "path": "/api/v1/visits/{visit_id}",
      "name": "update_visit",
      "file": "backend/app/intake.py",
      "line": 291,
      "end": 296,
      "signature": "visit_id: int, input: VisitUpdate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "visits"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/visits/{visit_id}/archive",
      "name": "archive_visit",
      "file": "backend/app/intake.py",
      "line": 300,
      "end": 305,
      "signature": "visit_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "visits"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/catalogue-items",
      "name": "list_catalogue",
      "file": "backend/app/inventory.py",
      "line": 177,
      "end": 184,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items",
        "stock_ledger"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/catalogue-items",
      "name": "create_catalogue",
      "file": "backend/app/inventory.py",
      "line": 188,
      "end": 192,
      "signature": "input: CatalogueItemInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/catalogue-items/{item_id}",
      "name": "update_catalogue",
      "file": "backend/app/inventory.py",
      "line": 196,
      "end": 200,
      "signature": "item_id: int, input: CatalogueItemInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/catalogue-items/{item_id}/archive",
      "name": "archive_catalogue",
      "file": "backend/app/inventory.py",
      "line": 204,
      "end": 210,
      "signature": "item_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items",
        "purchase_order_lines"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/suppliers",
      "name": "list_suppliers",
      "file": "backend/app/inventory.py",
      "line": 214,
      "end": 218,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "suppliers"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/suppliers",
      "name": "create_supplier",
      "file": "backend/app/inventory.py",
      "line": 222,
      "end": 225,
      "signature": "input: SupplierInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "suppliers"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/suppliers/{supplier_id}",
      "name": "update_supplier",
      "file": "backend/app/inventory.py",
      "line": 229,
      "end": 233,
      "signature": "supplier_id: int, input: SupplierInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "suppliers"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/suppliers/{supplier_id}/archive",
      "name": "archive_supplier",
      "file": "backend/app/inventory.py",
      "line": 237,
      "end": 243,
      "signature": "supplier_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders",
        "suppliers"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/purchase-orders",
      "name": "list_purchase_orders",
      "file": "backend/app/inventory.py",
      "line": 247,
      "end": 251,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-orders",
      "name": "create_purchase_order",
      "file": "backend/app/inventory.py",
      "line": 255,
      "end": 259,
      "signature": "input: PurchaseOrderInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/purchase-orders/{purchase_id}",
      "name": "update_purchase_order",
      "file": "backend/app/inventory.py",
      "line": 263,
      "end": 268,
      "signature": "purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/commands/{command}",
      "name": "purchase_order_command",
      "file": "backend/app/inventory.py",
      "line": 272,
      "end": 278,
      "signature": "purchase_id: int, command: Literal['send', 'cancel', 'close'], input: PurchaseOrderCommand, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/stock-inwards",
      "name": "list_stock_inwards",
      "file": "backend/app/inventory.py",
      "line": 282,
      "end": 286,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_inwards"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/stock-inwards",
      "name": "record_stock_inward",
      "file": "backend/app/inventory.py",
      "line": 290,
      "end": 305,
      "signature": "input: StockInwardInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_inwards",
        "stock_ledger"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/stock-adjustments",
      "name": "adjust_stock",
      "file": "backend/app/inventory.py",
      "line": 309,
      "end": 314,
      "signature": "input: StockAdjustmentInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_ledger"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/stock-ledger",
      "name": "list_stock_ledger",
      "file": "backend/app/inventory.py",
      "line": 318,
      "end": 322,
      "signature": "scope: ScopedTenant, item_id: int | None=Query(default=None, alias='itemId'), branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_ledger"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs",
      "name": "list_jobs",
      "file": "backend/app/jobs.py",
      "line": 214,
      "end": 225,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}",
      "name": "get_job",
      "file": "backend/app/jobs.py",
      "line": 229,
      "end": 234,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs",
      "name": "create_job",
      "file": "backend/app/jobs.py",
      "line": 238,
      "end": 259,
      "signature": "input: JobCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/advisor",
      "name": "assign_job_advisor",
      "file": "backend/app/jobs.py",
      "line": 263,
      "end": 296,
      "signature": "job_id: int, input: AdvisorAssignment, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards",
        "membership_branches",
        "membership_roles",
        "service_advisor_teams",
        "tenant_memberships",
        "tenant_roles"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/manager",
      "name": "transfer_job_manager",
      "file": "backend/app/jobs.py",
      "line": 300,
      "end": 319,
      "signature": "job_id: int, input: ManagerTransfer, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/estimates",
      "name": "create_estimate",
      "file": "backend/app/jobs.py",
      "line": 323,
      "end": 349,
      "signature": "job_id: int, input: EstimateCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "estimate_lines",
        "estimates"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/estimates/{estimate_id}/decision",
      "name": "record_estimate_decision",
      "file": "backend/app/jobs.py",
      "line": 353,
      "end": 377,
      "signature": "estimate_id: int, input: EstimateDecision, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "estimate_decisions",
        "estimates"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/commands/{command}",
      "name": "command_job",
      "file": "backend/app/jobs.py",
      "line": 445,
      "end": 479,
      "signature": "job_id: int, command: Literal['start-work', 'hold-job', 'resume-work', 'cancel-job', 'start-rework', 'complete-work'], input: JobCommand, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": false,
      "tables": [
        "estimates",
        "job_cards",
        "job_events"
      ]
    },
    {
      "method": "GET",
      "path": "/health",
      "name": "health",
      "file": "backend/app/main.py",
      "line": 69,
      "end": 78,
      "signature": "session: Session=Depends(get_session)",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "GET",
      "path": "/api/v1/health",
      "name": "api_health",
      "file": "backend/app/main.py",
      "line": 82,
      "end": 84,
      "signature": "session: Session=Depends(get_session)",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "GET",
      "path": "/api/v1/auth/config",
      "name": "auth_config",
      "file": "backend/app/main.py",
      "line": 88,
      "end": 114,
      "signature": "",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "GET",
      "path": "/api/v1/session",
      "name": "session",
      "file": "backend/app/main.py",
      "line": 118,
      "end": 121,
      "signature": "scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "GET",
      "path": "/api/v1/tenant/settings",
      "name": "read_tenant_settings",
      "file": "backend/app/main.py",
      "line": 125,
      "end": 133,
      "signature": "scope: ScopedTenant",
      "guards": [
        "require_permission(scope, \"tenant.settings.read\")"
      ],
      "lock": false,
      "tables": [
        "tenant_settings"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/tenant/settings",
      "name": "write_tenant_settings",
      "file": "backend/app/main.py",
      "line": 137,
      "end": 154,
      "signature": "input: SettingsUpdate, scope: ScopedTenant",
      "guards": [
        "require_permission(scope, \"tenant.settings.write\")"
      ],
      "lock": false,
      "tables": [
        "tenant_settings"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/branches/{branch_id}/settings",
      "name": "read_branch_settings",
      "file": "backend/app/main.py",
      "line": 158,
      "end": 170,
      "signature": "branch_id: UUID, scope: ScopedTenant",
      "guards": [
        "require_permission(scope, \"branch.settings.read\")"
      ],
      "lock": false,
      "tables": [
        "branch_settings"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/material-reservations",
      "name": "list_reservations",
      "file": "backend/app/materials.py",
      "line": 154,
      "end": 162,
      "signature": "scope: ScopedTenant, job_id: int | None=Query(default=None, alias='jobId'), branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "material_reservations"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/material-reservations",
      "name": "list_job_reservations",
      "file": "backend/app/materials.py",
      "line": 166,
      "end": 167,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "GET",
      "path": "/api/v1/material-ledger",
      "name": "list_material_ledger",
      "file": "backend/app/materials.py",
      "line": 171,
      "end": 179,
      "signature": "scope: ScopedTenant, reservation_id: int | None=Query(default=None, alias='reservationId'), job_id: int | None=Query(default=None, alias='jobId'), branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "material_ledger"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/material-reservations",
      "name": "create_reservation",
      "file": "backend/app/materials.py",
      "line": 183,
      "end": 204,
      "signature": "input: MaterialReservationInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "material_ledger",
        "material_reservations"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/material-reservations/{reservation_id}/commands/{command}",
      "name": "material_command",
      "file": "backend/app/materials.py",
      "line": 208,
      "end": 236,
      "signature": "reservation_id: int, command: MaterialCommandName, input: MaterialCommand, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "material_ledger"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/leads",
      "name": "list_leads",
      "file": "backend/app/sales_crm.py",
      "line": 83,
      "end": 86,
      "signature": "scope: ScopedTenant, q: str='', stage: LeadStage | None=None, temperature: Temperature | None=None, exact_date: date | None=Query(None, alias='exactDate'), month: str | None=None, branch_id: UUID | None=Query(None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "sales_leads"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/sales/leads",
      "name": "create_lead",
      "file": "backend/app/sales_crm.py",
      "line": 88,
      "end": 91,
      "signature": "input: LeadInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "sales_leads"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/sales/leads/{lead_id}",
      "name": "update_lead",
      "file": "backend/app/sales_crm.py",
      "line": 93,
      "end": 96,
      "signature": "lead_id: int, input: LeadInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "sales_leads"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/quotations",
      "name": "list_quotations",
      "file": "backend/app/sales_crm.py",
      "line": 99,
      "end": 101,
      "signature": "scope: ScopedTenant, q: str='', quotation_status: QuotationStatus | None=Query(None, alias='status'), exact_date: date | None=Query(None, alias='exactDate'), month: str | None=None, branch_id: UUID | None=Query(None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "quotations",
        "sales_leads"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/service-tasks",
      "name": "list_service_tasks",
      "file": "backend/app/sales_crm.py",
      "line": 104,
      "end": 114,
      "signature": "scope: ScopedTenant, q: str='', branch_id: UUID | None=Query(None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "service_task_catalog"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/sales/quotations",
      "name": "create_quotation",
      "file": "backend/app/sales_crm.py",
      "line": 116,
      "end": 124,
      "signature": "input: QuotationInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotation_lines",
        "quotations",
        "sales_leads"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/sales/quotations/{quotation_id}",
      "name": "update_quotation",
      "file": "backend/app/sales_crm.py",
      "line": 126,
      "end": 138,
      "signature": "quotation_id: int, input: QuotationInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotation_lines",
        "quotations",
        "sales_leads"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/sales/quotations/{quotation_id}/status",
      "name": "change_status",
      "file": "backend/app/sales_crm.py",
      "line": 140,
      "end": 146,
      "signature": "quotation_id: int, input: StatusInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotations",
        "sales_leads"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/sales/quotations/{quotation_id}/document",
      "name": "quotation_document",
      "file": "backend/app/sales_crm.py",
      "line": 148,
      "end": 152,
      "signature": "quotation_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotations"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants",
      "name": "list_tenants",
      "file": "backend/app/superadmin.py",
      "line": 237,
      "end": 251,
      "signature": "scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "branches",
        "platform_billing",
        "tenants"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants",
      "name": "provision_tenant",
      "file": "backend/app/superadmin.py",
      "line": 255,
      "end": 281,
      "signature": "input: ProvisionTenant, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "branches",
        "membership_branches",
        "membership_roles",
        "platform_billing",
        "platform_users",
        "role_permissions",
        "tenant_admin_invitations",
        "tenant_memberships",
        "tenant_roles",
        "tenants"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}",
      "name": "get_tenant",
      "file": "backend/app/superadmin.py",
      "line": 285,
      "end": 287,
      "signature": "tenant_id: UUID, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": []
    },
    {
      "method": "PUT",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/billing",
      "name": "update_billing",
      "file": "backend/app/superadmin.py",
      "line": 291,
      "end": 297,
      "signature": "tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "platform_billing"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/lifecycle",
      "name": "update_lifecycle",
      "file": "backend/app/superadmin.py",
      "line": 301,
      "end": 310,
      "signature": "tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "tenants"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/emulations",
      "name": "start_emulation",
      "file": "backend/app/superadmin.py",
      "line": 314,
      "end": 326,
      "signature": "tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "support_emulations"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/superadmin/emulations/{emulation_id}/end",
      "name": "end_emulation",
      "file": "backend/app/superadmin.py",
      "line": 330,
      "end": 339,
      "signature": "emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "support_emulations"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/audit-events",
      "name": "list_audit_events",
      "file": "backend/app/superadmin.py",
      "line": 343,
      "end": 347,
      "signature": "tenant_id: UUID, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "tenant_audit_events"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/users",
      "name": "list_users",
      "file": "backend/app/tenant_admin.py",
      "line": 359,
      "end": 362,
      "signature": "scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.read\")"
      ],
      "lock": false,
      "tables": []
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/service-departments",
      "name": "list_service_departments",
      "file": "backend/app/tenant_admin.py",
      "line": 366,
      "end": 369,
      "signature": "scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.read\")"
      ],
      "lock": false,
      "tables": []
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/service-departments",
      "name": "create_service_department",
      "file": "backend/app/tenant_admin.py",
      "line": 373,
      "end": 389,
      "signature": "input: ServiceDepartmentCreate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "branches",
        "service_departments"
      ]
    },
    {
      "method": "PATCH",
      "path": "/api/v1/admin/service-departments/{department_id}",
      "name": "update_service_department",
      "file": "backend/app/tenant_admin.py",
      "line": 393,
      "end": 414,
      "signature": "department_id: UUID, input: ServiceDepartmentUpdate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_departments"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "name": "appoint_service_department_manager",
      "file": "backend/app/tenant_admin.py",
      "line": 418,
      "end": 431,
      "signature": "department_id: UUID, membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_department_managers",
        "service_departments"
      ]
    },
    {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "name": "remove_service_department_manager",
      "file": "backend/app/tenant_admin.py",
      "line": 435,
      "end": 447,
      "signature": "department_id: UUID, membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_advisor_teams",
        "service_department_managers",
        "service_departments"
      ]
    },
    {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "name": "assign_service_advisor_team",
      "file": "backend/app/tenant_admin.py",
      "line": 451,
      "end": 471,
      "signature": "department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_advisor_teams",
        "service_department_managers",
        "service_departments"
      ]
    },
    {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "name": "remove_service_advisor_team",
      "file": "backend/app/tenant_admin.py",
      "line": 475,
      "end": 486,
      "signature": "department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_advisor_teams",
        "service_departments"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/users",
      "name": "create_user",
      "file": "backend/app/tenant_admin.py",
      "line": 490,
      "end": 510,
      "signature": "input: UserCreate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "platform_users",
        "tenant_admin_invitations",
        "tenant_memberships"
      ]
    },
    {
      "method": "PATCH",
      "path": "/api/v1/admin/users/{membership_id}",
      "name": "update_user",
      "file": "backend/app/tenant_admin.py",
      "line": 514,
      "end": 536,
      "signature": "membership_id: UUID, input: UserUpdate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "platform_users",
        "tenant_memberships"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/archive",
      "name": "archive_user",
      "file": "backend/app/tenant_admin.py",
      "line": 540,
      "end": 556,
      "signature": "membership_id: UUID, input: ArchiveUser, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "platform_users",
        "tenant_memberships"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/resend-invite",
      "name": "resend_invite",
      "file": "backend/app/tenant_admin.py",
      "line": 560,
      "end": 572,
      "signature": "membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "tenant_admin_invitations"
      ]
    },
    {
      "method": "GET",
      "path": "/api/v1/admin/roles",
      "name": "list_roles",
      "file": "backend/app/tenant_admin.py",
      "line": 576,
      "end": 579,
      "signature": "scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.read\")"
      ],
      "lock": false,
      "tables": []
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/roles",
      "name": "create_role",
      "file": "backend/app/tenant_admin.py",
      "line": 583,
      "end": 598,
      "signature": "input: RoleCreate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "role_permissions",
        "tenant_roles"
      ]
    },
    {
      "method": "PATCH",
      "path": "/api/v1/admin/roles/{role_id}",
      "name": "update_role",
      "file": "backend/app/tenant_admin.py",
      "line": 602,
      "end": 634,
      "signature": "role_id: UUID, input: RoleUpdate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "role_permissions",
        "tenant_roles"
      ]
    },
    {
      "method": "POST",
      "path": "/api/v1/admin/roles/{role_id}/archive",
      "name": "archive_role",
      "file": "backend/app/tenant_admin.py",
      "line": 638,
      "end": 655,
      "signature": "role_id: UUID, input: ArchiveUser, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "membership_roles",
        "tenant_roles"
      ]
    }
  ],
  "models": [
    {
      "source": "backend/app/config.py:9-36",
      "name": "Settings",
      "contract": "class Settings(BaseSettings):\n    \"\"\"Runtime configuration loaded from explicit WorkshopOS environment variables.\"\"\"\n\n    model_config = SettingsConfigDict(env_file=\".env\", env_prefix=\"WORKSHOPOS_\")\n\n    database_url: PostgresDsn\n    environment: str = \"local\"\n    auth_mode: Literal[\"local\", \"cognito\"] = \"local\"\n    allow_demo_auth: bool = True\n    superadmin_bootstrap_subjects: str = \"\"\n    cognito_client_id: str | None = None\n    cognito_issuer: AnyHttpUrl | None = None\n    cognito_jwks_url: AnyHttpUrl | None = None\n    cognito_authorization_endpoint: AnyHttpUrl | None = None\n    cognito_token_endpoint: AnyHttpUrl | None = None\n    cognito_logout_endpoint: AnyHttpUrl | None = None\n    cognito_callback_uri: AnyHttpUrl | None = None\n    cognito_logout_uri: AnyHttpUrl | None = None\n\n    @property\n    def demo_auth_enabled(self) -> bool:\n        \"\"\"The header-based emulator is deliberately unavailable outside local development.\"\"\"\n        return self.environment == \"local\" and self.auth_mode == \"local\" and self.allow_demo_auth\n\n    @property\n    def configured_superadmin_subjects(self) -> frozenset[str]:\n        \"\"\"Explicit, deployment-owned one-time Superadmin bootstrap allow-list.\"\"\"\n        return frozenset(value.strip() for value in self.superadmin_bootstrap_subjects.split(\",\") if value.strip())"
    },
    {
      "source": "backend/app/execution.py:24-25",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/execution.py:28-32",
      "name": "TaskCreate",
      "contract": "class TaskCreate(ApiModel):\n    job_id: int = Field(alias=\"jobId\", gt=0)\n    assigned_to: UUID = Field(alias=\"assignedTo\")\n    title: str = Field(min_length=1, max_length=1000)\n    notes: str = Field(default=\"\", max_length=4000)"
    },
    {
      "source": "backend/app/execution.py:35-37",
      "name": "TaskUpdate",
      "contract": "class TaskUpdate(ApiModel):\n    status: TaskStatus\n    note: str = Field(default=\"\", max_length=4000)"
    },
    {
      "source": "backend/app/execution.py:40-43",
      "name": "QcCheckCreate",
      "contract": "class QcCheckCreate(ApiModel):\n    job_id: int = Field(alias=\"jobId\", gt=0)\n    label: str = Field(min_length=1, max_length=1000)\n    required: bool = True"
    },
    {
      "source": "backend/app/execution.py:46-48",
      "name": "QcResult",
      "contract": "class QcResult(ApiModel):\n    outcome: QcOutcome\n    note: str = Field(default=\"\", max_length=4000)"
    },
    {
      "source": "backend/app/finance.py:38-39",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/finance.py:42-44",
      "name": "InvoiceIssue",
      "contract": "class InvoiceIssue(ApiModel):\n    customer_state: Annotated[str, Field(max_length=100)] = Field(default=\"\", alias=\"customerState\")\n    replaces_invoice_id: Annotated[int | None, Field(gt=0)] = Field(default=None, alias=\"replacesInvoiceId\")"
    },
    {
      "source": "backend/app/finance.py:47-50",
      "name": "AttachmentInput",
      "contract": "class AttachmentInput(ApiModel):\n    filename: Annotated[str, Field(min_length=1, max_length=500)]\n    content_type: Literal[\"image/jpeg\", \"image/png\", \"application/pdf\"] = Field(alias=\"contentType\")\n    data_base64: Annotated[str, Field(min_length=1, max_length=14_000_000)] = Field(alias=\"dataBase64\")"
    },
    {
      "source": "backend/app/finance.py:53-59",
      "name": "PaymentRecord",
      "contract": "class PaymentRecord(ApiModel):\n    amount_paise: Annotated[int, Field(gt=0, le=10_000_000_000)] = Field(alias=\"amountPaise\")\n    method: PaymentMethod\n    reference: Annotated[str, Field(max_length=500)] = \"\"\n    payer: Annotated[str, Field(max_length=500)] = \"\"\n    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), alias=\"receivedAt\")\n    supporting_attachment: AttachmentInput | None = Field(default=None, alias=\"supportingAttachment\")"
    },
    {
      "source": "backend/app/finance.py:62-63",
      "name": "VoidInput",
      "contract": "class VoidInput(ApiModel):\n    reason: Annotated[str, Field(min_length=1, max_length=4000)]"
    },
    {
      "source": "backend/app/finance.py:66-68",
      "name": "CreditNoteIssue",
      "contract": "class CreditNoteIssue(ApiModel):\n    amount_paise: Annotated[int, Field(gt=0, le=10_000_000_000)] = Field(alias=\"amountPaise\")\n    reason: Annotated[str, Field(min_length=1, max_length=4000)]"
    },
    {
      "source": "backend/app/finance.py:71-74",
      "name": "RefundRecord",
      "contract": "class RefundRecord(ApiModel):\n    amount_paise: Annotated[int, Field(gt=0, le=10_000_000_000)] = Field(alias=\"amountPaise\")\n    method: PaymentMethod\n    reference: Annotated[str, Field(max_length=500)] = \"\""
    },
    {
      "source": "backend/app/finance.py:77-80",
      "name": "HandoverInput",
      "contract": "class HandoverInput(ApiModel):\n    delivered_by: Annotated[str, Field(min_length=1, max_length=250)] = Field(alias=\"deliveredBy\")\n    final_odometer: Annotated[int, Field(ge=0, le=10_000_000)] = Field(alias=\"finalOdometer\")\n    acknowledgement: Annotated[str, Field(min_length=1, max_length=4000)]"
    },
    {
      "source": "backend/app/followups.py:24-25",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/followups.py:28-31",
      "name": "FollowupCreate",
      "contract": "class FollowupCreate(ApiModel):\n    job_id: Annotated[int, Field(gt=0)] = Field(alias=\"jobId\")\n    note: Annotated[str, Field(min_length=1, max_length=4000)]\n    due_at: date | None = Field(default=None, alias=\"dueAt\")"
    },
    {
      "source": "backend/app/followups.py:34-37",
      "name": "FollowupUpdate",
      "contract": "class FollowupUpdate(ApiModel):\n    note: Annotated[str, Field(min_length=1, max_length=4000)]\n    due_at: date | None = Field(default=None, alias=\"dueAt\")\n    outcome: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/followups.py:40-41",
      "name": "FollowupComplete",
      "contract": "class FollowupComplete(ApiModel):\n    outcome: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/followups.py:44-45",
      "name": "ArchiveInput",
      "contract": "class ArchiveInput(ApiModel):\n    reason: Annotated[str, Field(min_length=1, max_length=4000)]"
    },
    {
      "source": "backend/app/intake.py:24-25",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/intake.py:28-33",
      "name": "CustomerInput",
      "contract": "class CustomerInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    name: Annotated[str, Field(min_length=1, max_length=300)]\n    mobile: Annotated[str, Field(min_length=1, max_length=80)]\n    type: Annotated[str, Field(min_length=1, max_length=80)] = \"Individual\"\n    address: Annotated[str, Field(max_length=2000)] = \"\""
    },
    {
      "source": "backend/app/intake.py:36-44",
      "name": "VehicleInput",
      "contract": "class VehicleInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    customer_id: Annotated[int, Field(gt=0)] = Field(alias=\"customerId\")\n    number: Annotated[str, Field(min_length=1, max_length=100)]\n    make: Annotated[str, Field(min_length=1, max_length=120)]\n    model: Annotated[str, Field(min_length=1, max_length=120)]\n    color: Annotated[str, Field(max_length=100)] = \"\"\n    km: Annotated[int, Field(ge=0)] = 0\n    engine_no: Annotated[str, Field(max_length=160)] = Field(default=\"\", alias=\"engineNo\")"
    },
    {
      "source": "backend/app/intake.py:47-59",
      "name": "VisitCreate",
      "contract": "class VisitCreate(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    customer_id: Annotated[int, Field(gt=0)] = Field(alias=\"customerId\")\n    vehicle_id: Annotated[int, Field(gt=0)] = Field(alias=\"vehicleId\")\n    advisor_id: UUID | None = Field(default=None, alias=\"advisorId\")\n    fuel: Annotated[str, Field(min_length=1, max_length=200)]\n    odo_reading: Annotated[int, Field(ge=0)] = Field(alias=\"odoReading\")\n    fuel_level_value: Annotated[str, Field(max_length=100)] = Field(default=\"\", alias=\"fuelLevelValue\")\n    fuel_level_unit: Annotated[str, Field(max_length=50)] = Field(default=\"\", alias=\"fuelLevelUnit\")\n    keys: Annotated[str, Field(max_length=1000)] = \"\"\n    accessories: Annotated[str, Field(max_length=4000)] = \"\"\n    requested_work: Annotated[str, Field(min_length=1, max_length=8000)] = Field(alias=\"requestedWork\")\n    photos_note: Annotated[str, Field(max_length=4000)] = Field(default=\"\", alias=\"photosNote\")"
    },
    {
      "source": "backend/app/intake.py:62-71",
      "name": "VisitUpdate",
      "contract": "class VisitUpdate(ApiModel):\n    advisor_id: UUID | None = Field(default=None, alias=\"advisorId\")\n    fuel: Annotated[str, Field(min_length=1, max_length=200)]\n    odo_reading: Annotated[int, Field(ge=0)] = Field(alias=\"odoReading\")\n    fuel_level_value: Annotated[str, Field(max_length=100)] = Field(default=\"\", alias=\"fuelLevelValue\")\n    fuel_level_unit: Annotated[str, Field(max_length=50)] = Field(default=\"\", alias=\"fuelLevelUnit\")\n    keys: Annotated[str, Field(max_length=1000)] = \"\"\n    accessories: Annotated[str, Field(max_length=4000)] = \"\"\n    requested_work: Annotated[str, Field(min_length=1, max_length=8000)] = Field(alias=\"requestedWork\")\n    photos_note: Annotated[str, Field(max_length=4000)] = Field(default=\"\", alias=\"photosNote\")"
    },
    {
      "source": "backend/app/intake.py:74-75",
      "name": "ArchiveInput",
      "contract": "class ArchiveInput(ApiModel):\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/inventory.py:28-29",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/inventory.py:32-39",
      "name": "CatalogueItemInput",
      "contract": "class CatalogueItemInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    sku: Annotated[str, Field(min_length=1, max_length=120)]\n    category: Annotated[str, Field(max_length=200)] = \"\"\n    name: Annotated[str, Field(min_length=1, max_length=500)]\n    unit: Annotated[str, Field(min_length=1, max_length=80)]\n    low_stock_qty: Annotated[float, Field(ge=0, le=100000000)] = Field(default=0, alias=\"lowStockQty\")\n    selling_price: Annotated[float, Field(ge=0, le=100000000)] = Field(default=0, alias=\"sellingPrice\")"
    },
    {
      "source": "backend/app/inventory.py:42-47",
      "name": "SupplierInput",
      "contract": "class SupplierInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    name: Annotated[str, Field(min_length=1, max_length=300)]\n    mobile: Annotated[str, Field(max_length=80)] = \"\"\n    email: Annotated[str, Field(max_length=320)] = \"\"\n    address: Annotated[str, Field(max_length=2000)] = \"\""
    },
    {
      "source": "backend/app/inventory.py:50-51",
      "name": "ArchiveInput",
      "contract": "class ArchiveInput(ApiModel):\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/inventory.py:54-59",
      "name": "PurchaseLineInput",
      "contract": "class PurchaseLineInput(ApiModel):\n    item_id: Annotated[int, Field(gt=0)] = Field(alias=\"itemId\")\n    ordered_qty: Annotated[float, Field(gt=0, le=100000000)] = Field(alias=\"orderedQty\")\n    unit_cost: Annotated[float, Field(ge=0, le=100000000)] = Field(alias=\"unitCost\")\n    discount: Annotated[float, Field(ge=0, le=100000000)] = 0\n    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=0, alias=\"gstRate\")"
    },
    {
      "source": "backend/app/inventory.py:62-68",
      "name": "PurchaseOrderInput",
      "contract": "class PurchaseOrderInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    supplier_id: Annotated[int, Field(gt=0)] = Field(alias=\"supplierId\")\n    po_number: Annotated[str, Field(min_length=1, max_length=120)] = Field(alias=\"poNumber\")\n    order_date: date = Field(alias=\"orderDate\")\n    notes: Annotated[str, Field(max_length=4000)] = \"\"\n    lines: Annotated[list[PurchaseLineInput], Field(min_length=1, max_length=250)]"
    },
    {
      "source": "backend/app/inventory.py:71-72",
      "name": "PurchaseOrderCommand",
      "contract": "class PurchaseOrderCommand(ApiModel):\n    reason: Annotated[str, Field(max_length=1000)] = \"\""
    },
    {
      "source": "backend/app/inventory.py:75-81",
      "name": "StockInwardInput",
      "contract": "class StockInwardInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    item_id: Annotated[int, Field(gt=0)] = Field(alias=\"itemId\")\n    qty: Annotated[float, Field(gt=0, le=100000000)]\n    unit_cost: Annotated[float, Field(ge=0, le=100000000)] = Field(default=0, alias=\"unitCost\")\n    note: Annotated[str, Field(max_length=4000)] = \"\"\n    purchase_order_line_id: int | None = Field(default=None, alias=\"purchaseOrderLineId\", gt=0)"
    },
    {
      "source": "backend/app/inventory.py:84-88",
      "name": "StockAdjustmentInput",
      "contract": "class StockAdjustmentInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    item_id: Annotated[int, Field(gt=0)] = Field(alias=\"itemId\")\n    quantity: Annotated[float, Field(ge=-100000000, le=100000000)]\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/jobs.py:32-33",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/jobs.py:36-42",
      "name": "JobCreate",
      "contract": "class JobCreate(ApiModel):\n    visit_id: Annotated[int, Field(gt=0)] = Field(alias=\"visitId\")\n    department_id: UUID = Field(alias=\"departmentId\")\n    responsible_manager_id: UUID = Field(alias=\"responsibleManagerId\")\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    work_list: Annotated[str, Field(max_length=8000)] = Field(default=\"\", alias=\"workList\")\n    promised_at: datetime | None = Field(default=None, alias=\"promisedAt\")"
    },
    {
      "source": "backend/app/jobs.py:45-50",
      "name": "EstimateLine",
      "contract": "class EstimateLine(ApiModel):\n    kind: Annotated[str, Field(min_length=1, max_length=40)] = \"labour\"\n    description: Annotated[str, Field(min_length=1, max_length=1000)]\n    quantity: Annotated[float, Field(gt=0, le=100000)]\n    rate: Annotated[float, Field(ge=0, le=100000000)]\n    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=18, alias=\"gstRate\")"
    },
    {
      "source": "backend/app/jobs.py:53-57",
      "name": "EstimateCreate",
      "contract": "class EstimateCreate(ApiModel):\n    discount: Annotated[float, Field(ge=0, le=100000000)] = 0\n    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=18, alias=\"gstRate\")\n    note: Annotated[str, Field(max_length=4000)] = \"\"\n    lines: Annotated[list[EstimateLine], Field(min_length=1, max_length=250)]"
    },
    {
      "source": "backend/app/jobs.py:60-64",
      "name": "EstimateDecision",
      "contract": "class EstimateDecision(ApiModel):\n    outcome: DecisionOutcome\n    channel: DecisionChannel\n    decided_at: datetime = Field(alias=\"decidedAt\")\n    note: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/jobs.py:67-68",
      "name": "JobCommand",
      "contract": "class JobCommand(ApiModel):\n    reason: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/jobs.py:71-73",
      "name": "AdvisorAssignment",
      "contract": "class AdvisorAssignment(ApiModel):\n    advisor_id: UUID = Field(alias=\"advisorId\")\n    reason: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/jobs.py:76-79",
      "name": "ManagerTransfer",
      "contract": "class ManagerTransfer(ApiModel):\n    department_id: UUID = Field(alias=\"departmentId\")\n    responsible_manager_id: UUID = Field(alias=\"responsibleManagerId\")\n    reason: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/main.py:48-49",
      "name": "SettingsUpdate",
      "contract": "class SettingsUpdate(BaseModel):\n    settings: dict[str, Any]"
    },
    {
      "source": "backend/app/materials.py:27-28",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/materials.py:31-36",
      "name": "MaterialReservationInput",
      "contract": "class MaterialReservationInput(ApiModel):\n    job_id: Annotated[int, Field(gt=0)] = Field(alias=\"jobId\")\n    item_id: Annotated[int, Field(gt=0)] = Field(alias=\"itemId\")\n    quantity: Annotated[float, Field(gt=0, le=100000)]\n    note: Annotated[str, Field(max_length=2000)] = \"\"\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")"
    },
    {
      "source": "backend/app/materials.py:39-41",
      "name": "MaterialCommand",
      "contract": "class MaterialCommand(ApiModel):\n    quantity: Annotated[float, Field(gt=0, le=100000)]\n    reason: Annotated[str, Field(max_length=2000)] = \"\""
    },
    {
      "source": "backend/app/sales_crm.py:24-24",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel): model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/sales_crm.py:25-39",
      "name": "LeadInput",
      "contract": "class LeadInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    display_name: Annotated[str, Field(min_length=1, max_length=300)] = Field(alias=\"displayName\")\n    phone: Annotated[str, Field(min_length=1, max_length=80)]\n    company: Annotated[str, Field(max_length=300)] = \"\"\n    company_not_entered: bool = Field(default=False, alias=\"companyNotEntered\")\n    email: Annotated[str, Field(max_length=320)] = \"\"\n    email_not_entered: bool = Field(default=False, alias=\"emailNotEntered\")\n    address: Annotated[str, Field(max_length=2000)] = \"\"\n    service_interest: Annotated[str, Field(max_length=1000)] = Field(default=\"\", alias=\"serviceInterest\")\n    notes: Annotated[str, Field(max_length=4000)] = \"\"\n    stage: LeadStage = \"NEW\"; temperature: Temperature = \"WARM\"\n    follow_up_due: date | None = Field(default=None, alias=\"followUpDue\")\n    site_visit_completed: bool = Field(default=False, alias=\"siteVisitCompleted\")\n    site_visit_date: date | None = Field(default=None, alias=\"siteVisitDate\")"
    },
    {
      "source": "backend/app/sales_crm.py:40-45",
      "name": "QuotationLine",
      "contract": "class QuotationLine(ApiModel):\n    kind: Annotated[str, Field(min_length=1, max_length=80)] = \"Service\"\n    description: Annotated[str, Field(min_length=1, max_length=1000)]\n    quantity: Annotated[float, Field(gt=0, le=100000)]\n    rate: Annotated[float, Field(ge=0, le=100000000)]\n    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=18, alias=\"gstRate\")"
    },
    {
      "source": "backend/app/sales_crm.py:46-54",
      "name": "QuotationInput",
      "contract": "class QuotationInput(ApiModel):\n    branch_id: UUID | None = Field(default=None, alias=\"branchId\")\n    lead_id: Annotated[int, Field(gt=0)] = Field(alias=\"leadId\")\n    valid_until: date | None = Field(default=None, alias=\"validUntil\")\n    customer_notes: Annotated[str, Field(max_length=4000)] = Field(default=\"\", alias=\"customerNotes\")\n    discount: Annotated[float, Field(ge=0, le=100000000)] = 0\n    template_id: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias=\"templateId\")\n    template_html: Annotated[str, Field(min_length=1, max_length=100000)] = Field(alias=\"templateHtml\")\n    lines: Annotated[list[QuotationLine], Field(min_length=1, max_length=250)]"
    },
    {
      "source": "backend/app/sales_crm.py:55-55",
      "name": "StatusInput",
      "contract": "class StatusInput(ApiModel): status: QuotationStatus"
    },
    {
      "source": "backend/app/superadmin.py:54-57",
      "name": "SuperadminScope",
      "contract": "class SuperadminScope:\n    actor_id: UUID\n    display_name: str\n    email: str"
    },
    {
      "source": "backend/app/superadmin.py:60-68",
      "name": "BillingFields",
      "contract": "class BillingFields(BaseModel):\n    plan: Annotated[str, Field(min_length=1, max_length=100)]\n    agreed_price: Annotated[Decimal, Field(ge=0, max_digits=12, decimal_places=2)]\n    currency: Annotated[str, Field(min_length=3, max_length=3)] = \"INR\"\n    billing_cycle: BillingCycle\n    renewal_date: date\n    due_date: date\n    payment_status: PaymentStatus\n    internal_notes: Annotated[str, Field(max_length=4000)] = \"\""
    },
    {
      "source": "backend/app/superadmin.py:71-76",
      "name": "ProvisionTenant",
      "contract": "class ProvisionTenant(BillingFields):\n    tenant_name: Annotated[str, Field(min_length=1, max_length=200)]\n    primary_branch_name: Annotated[str, Field(min_length=1, max_length=200)]\n    tenant_admin_name: Annotated[str, Field(min_length=1, max_length=200)]\n    tenant_admin_email: Annotated[str, Field(min_length=3, max_length=320)]\n    lifecycle_state: LifecycleState = \"trial\""
    },
    {
      "source": "backend/app/superadmin.py:79-80",
      "name": "UpdateBilling",
      "contract": "class UpdateBilling(BillingFields):\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/superadmin.py:83-85",
      "name": "UpdateLifecycle",
      "contract": "class UpdateLifecycle(BaseModel):\n    lifecycle_state: LifecycleState\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/superadmin.py:88-89",
      "name": "StartEmulation",
      "contract": "class StartEmulation(BaseModel):\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/superadmin.py:92-93",
      "name": "EndEmulation",
      "contract": "class EndEmulation(BaseModel):\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/tenancy.py:15-17",
      "name": "BranchScope",
      "contract": "class BranchScope:\n    id: UUID\n    name: str"
    },
    {
      "source": "backend/app/tenancy.py:21-37",
      "name": "TenantScope",
      "contract": "class TenantScope:\n    actor_id: UUID\n    membership_id: UUID\n    tenant_id: UUID\n    tenant_name: str\n    display_name: str\n    email: str\n    branch_ids: tuple[UUID, ...]\n    branches: tuple[BranchScope, ...]\n    role_ids: tuple[UUID, ...]\n    roles: tuple[tuple[UUID, str, tuple[str, ...]], ...]\n    permissions: tuple[str, ...]\n    version: int\n    lifecycle_state: str = \"active\"\n    actor_type: str = \"tenant_user\"\n    emulation_id: UUID | None = None\n    read_only: bool = False"
    },
    {
      "source": "backend/app/tenant_admin.py:80-81",
      "name": "AssignmentError",
      "contract": "class AssignmentError(ValueError):\n    \"\"\"A stable, client-safe code for invalid role or branch assignment input.\"\"\""
    },
    {
      "source": "backend/app/tenant_admin.py:123-124",
      "name": "ApiModel",
      "contract": "class ApiModel(BaseModel):\n    model_config = ConfigDict(populate_by_name=True)"
    },
    {
      "source": "backend/app/tenant_admin.py:127-131",
      "name": "UserCreate",
      "contract": "class UserCreate(ApiModel):\n    name: Annotated[str, Field(min_length=1, max_length=200)]\n    email: Annotated[str, Field(min_length=3, max_length=320)]\n    role_ids: tuple[UUID, ...] = Field(alias=\"roleIds\")\n    branch_ids: tuple[UUID, ...] = Field(alias=\"branchIds\")"
    },
    {
      "source": "backend/app/tenant_admin.py:134-138",
      "name": "UserUpdate",
      "contract": "class UserUpdate(ApiModel):\n    name: Annotated[str, Field(min_length=1, max_length=200)]\n    role_ids: tuple[UUID, ...] = Field(alias=\"roleIds\")\n    branch_ids: tuple[UUID, ...] = Field(alias=\"branchIds\")\n    version: Annotated[int, Field(ge=1)]"
    },
    {
      "source": "backend/app/tenant_admin.py:141-142",
      "name": "ArchiveUser",
      "contract": "class ArchiveUser(ApiModel):\n    reason: Annotated[str, Field(min_length=1, max_length=1000)]"
    },
    {
      "source": "backend/app/tenant_admin.py:145-148",
      "name": "RoleCreate",
      "contract": "class RoleCreate(ApiModel):\n    name: Annotated[str, Field(min_length=1, max_length=100)]\n    description: Annotated[str, Field(max_length=1000)] = \"\"\n    permissions: tuple[str, ...]"
    },
    {
      "source": "backend/app/tenant_admin.py:151-152",
      "name": "RoleUpdate",
      "contract": "class RoleUpdate(RoleCreate):\n    version: Annotated[int, Field(ge=1)]"
    },
    {
      "source": "backend/app/tenant_admin.py:155-157",
      "name": "ServiceDepartmentCreate",
      "contract": "class ServiceDepartmentCreate(ApiModel):\n    branch_id: UUID = Field(alias=\"branchId\")\n    name: Annotated[str, Field(min_length=1, max_length=200)]"
    },
    {
      "source": "backend/app/tenant_admin.py:160-162",
      "name": "ServiceDepartmentUpdate",
      "contract": "class ServiceDepartmentUpdate(ApiModel):\n    name: Annotated[str, Field(min_length=1, max_length=200)]\n    status: Literal[\"ACTIVE\", \"ARCHIVED\"]"
    }
  ],
  "functions": [
    {
      "file": "backend/app/auth.py",
      "name": "auth_error",
      "start": 19,
      "end": 20,
      "body": "def auth_error(code: str, status_code: int = status.HTTP_401_UNAUTHORIZED) -> HTTPException:\n    return HTTPException(status_code=status_code, detail={\"code\": code})"
    },
    {
      "file": "backend/app/auth.py",
      "name": "_cognito_subject",
      "start": 23,
      "end": 39,
      "body": "def _cognito_subject(token: str, settings: Settings) -> str:\n    if not settings.cognito_issuer or not settings.cognito_client_id or not settings.cognito_jwks_url:\n        raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n    try:\n        key = PyJWKClient(str(settings.cognito_jwks_url)).get_signing_key_from_jwt(token).key\n        claims = jwt.decode(\n            token,\n            key,\n            algorithms=[\"RS256\"],\n            audience=settings.cognito_client_id,\n            issuer=str(settings.cognito_issuer).rstrip(\"/\"),\n        )\n    except (InvalidTokenError, PyJWKClientError) as error:\n        raise auth_error(\"INVALID_ACCESS_TOKEN\") from error\n    if claims.get(\"token_use\") != \"access\" or not isinstance(claims.get(\"sub\"), str):\n        raise auth_error(\"INVALID_ACCESS_TOKEN\")\n    return claims[\"sub\"]"
    },
    {
      "file": "backend/app/auth.py",
      "name": "authenticated_subject",
      "start": 42,
      "end": 56,
      "body": "def authenticated_subject(\n    authorization: Annotated[str | None, Header()] = None,\n    demo_identity: Annotated[str | None, Header(alias=\"x-workshopos-identity\")] = None,\n    settings: Settings = Depends(get_settings),\n) -> str:\n    \"\"\"Return a Cognito subject, or the deliberately local-only demo subject.\"\"\"\n    if settings.auth_mode == \"cognito\":\n        if not authorization or not authorization.startswith(\"Bearer \"):\n            raise auth_error(\"AUTHENTICATION_REQUIRED\")\n        return _cognito_subject(authorization.removeprefix(\"Bearer \").strip(), settings)\n    if not settings.demo_auth_enabled:\n        raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n    if not demo_identity or len(demo_identity) > 255:\n        raise auth_error(\"AUTHENTICATION_REQUIRED\")\n    return demo_identity"
    },
    {
      "file": "backend/app/auth.py",
      "name": "_rows",
      "start": 59,
      "end": 60,
      "body": "def _rows(session: Session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:\n    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]"
    },
    {
      "file": "backend/app/auth.py",
      "name": "resolve_tenant_scope",
      "start": 63,
      "end": 131,
      "body": "def resolve_tenant_scope(session: Session, subject: str) -> TenantScope:\n    \"\"\"Resolve the one server-selected active membership for an authenticated subject.\"\"\"\n    membership = _rows(\n        session,\n        \"\"\"\n        SELECT u.id AS actor_id, u.display_name, u.email, m.id AS membership_id,\n               m.tenant_id, m.version, t.name AS tenant_name, t.lifecycle_state\n        FROM platform_users AS u\n        JOIN tenant_memberships AS m ON m.id = u.active_membership_id AND m.user_id = u.id\n        JOIN tenants AS t ON t.id = m.tenant_id\n        WHERE u.cognito_subject = :subject\n          AND u.status = 'ACTIVE'\n          AND m.status = 'ACTIVE'\n          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')\n        \"\"\",\n        {\"subject\": subject},\n    )\n    if len(membership) != 1:\n        raise auth_error(\"TENANT_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    current = membership[0]\n    membership_id = UUID(str(current[\"membership_id\"]))\n    tenant_id = UUID(str(current[\"tenant_id\"]))\n    branches = _rows(\n        session,\n        \"\"\"\n        SELECT b.id, b.name\n        FROM membership_branches AS mb\n        JOIN branches AS b ON b.id = mb.branch_id AND b.tenant_id = :tenant_id\n        WHERE mb.membership_id = :membership_id\n        ORDER BY b.name, b.id\n        \"\"\",\n        {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)},\n    )\n    if not branches:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    roles = _rows(\n        session,\n        \"\"\"\n        SELECT r.id, r.name, COALESCE(array_agg(rp.permission ORDER BY rp.permission)\n               FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions\n        FROM membership_roles AS mr\n        JOIN tenant_roles AS r ON r.id = mr.role_id AND r.tenant_id = :tenant_id AND r.status = 'ACTIVE'\n        LEFT JOIN role_permissions AS rp ON rp.role_id = r.id\n        WHERE mr.membership_id = :membership_id\n        GROUP BY r.id, r.name\n        ORDER BY r.name, r.id\n        \"\"\",\n        {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)},\n    )\n    parsed_branches = tuple(BranchScope(id=UUID(str(row[\"id\"])), name=str(row[\"name\"])) for row in branches)\n    parsed_roles = tuple(\n        (UUID(str(row[\"id\"])), str(row[\"name\"]), tuple(row[\"permissions\"] or ())) for row in roles\n    )\n    return TenantScope(\n        actor_id=UUID(str(current[\"actor_id\"])),\n        membership_id=membership_id,\n        tenant_id=tenant_id,\n        tenant_name=str(current[\"tenant_name\"]),\n        display_name=str(current[\"display_name\"]),\n        email=str(current[\"email\"]),\n        branch_ids=tuple(branch.id for branch in parsed_branches),\n        branches=parsed_branches,\n        role_ids=tuple(role[0] for role in parsed_roles),\n        roles=parsed_roles,\n        permissions=tuple(sorted({permission for _, _, permissions in parsed_roles for permission in permissions})),\n        version=int(current[\"version\"]),\n        lifecycle_state=str(current[\"lifecycle_state\"]),\n        read_only=str(current[\"lifecycle_state\"]) == \"suspended\",\n    )"
    },
    {
      "file": "backend/app/auth.py",
      "name": "resolve_emulated_tenant_scope",
      "start": 134,
      "end": 175,
      "body": "def resolve_emulated_tenant_scope(session: Session, subject: str, emulation_id: UUID) -> TenantScope:\n    \"\"\"Resolve a Superadmin-owned, active, read-only support emulation.\"\"\"\n    records = _rows(\n        session,\n        \"\"\"\n        SELECT e.id AS emulation_id, e.tenant_id, u.id AS actor_id, u.display_name, u.email,\n               t.name AS tenant_name, t.lifecycle_state, b.id AS branch_id, b.name AS branch_name\n        FROM support_emulations AS e\n        JOIN platform_users AS u ON u.id = e.superadmin_id\n        JOIN superadmins AS sa ON sa.user_id = u.id\n        JOIN tenants AS t ON t.id = e.tenant_id\n        JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary\n        WHERE e.id = :emulation_id\n          AND u.cognito_subject = :subject\n          AND u.status = 'ACTIVE'\n          AND e.status = 'ACTIVE'\n          AND t.lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended')\n        \"\"\",\n        {\"emulation_id\": str(emulation_id), \"subject\": subject},\n    )\n    if len(records) != 1:\n        raise auth_error(\"EMULATION_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    record = records[0]\n    branch = BranchScope(id=UUID(str(record[\"branch_id\"])), name=str(record[\"branch_name\"]))\n    return TenantScope(\n        actor_id=UUID(str(record[\"actor_id\"])),\n        membership_id=UUID(str(record[\"emulation_id\"])),\n        tenant_id=UUID(str(record[\"tenant_id\"])),\n        tenant_name=str(record[\"tenant_name\"]),\n        display_name=str(record[\"display_name\"]),\n        email=str(record[\"email\"]),\n        branch_ids=(branch.id,),\n        branches=(branch,),\n        role_ids=(),\n        roles=(),\n        permissions=(),\n        version=1,\n        lifecycle_state=str(record[\"lifecycle_state\"]),\n        actor_type=\"support_emulation\",\n        emulation_id=UUID(str(record[\"emulation_id\"])),\n        read_only=True,\n    )"
    },
    {
      "file": "backend/app/auth.py",
      "name": "tenant_scope",
      "start": 178,
      "end": 187,
      "body": "def tenant_scope(\n    subject: str = Depends(authenticated_subject),\n    session: Session = Depends(get_session),\n    emulation_id: Annotated[UUID | None, Header(alias=\"x-workshopos-emulation-id\")] = None,\n) -> Generator[tuple[Session, TenantScope], None, None]:\n    \"\"\"Open a transaction after authorization and install the trusted RLS scope.\"\"\"\n    with session.begin():\n        scope = resolve_emulated_tenant_scope(session, subject, emulation_id) if emulation_id else resolve_tenant_scope(session, subject)\n        apply_rls_context(session, scope)\n        yield session, scope"
    },
    {
      "file": "backend/app/auth.py",
      "name": "session_payload",
      "start": 193,
      "end": 213,
      "body": "def session_payload(scope: TenantScope) -> dict[str, object]:\n    return {\n        \"actorType\": scope.actor_type,\n        \"membership\": {\n            \"id\": str(scope.membership_id),\n            \"displayName\": scope.display_name,\n            \"email\": scope.email,\n            \"status\": \"READ_ONLY\" if scope.read_only else \"ACTIVE\",\n            \"roleIds\": [str(role_id) for role_id in scope.role_ids],\n            \"roles\": [\n                {\"id\": str(role_id), \"name\": name, \"permissions\": list(permissions)}\n                for role_id, name, permissions in scope.roles\n            ],\n            \"branchIds\": [str(branch_id) for branch_id in scope.branch_ids],\n            \"branches\": [{\"id\": str(branch.id), \"name\": branch.name} for branch in scope.branches],\n            \"permissions\": list(scope.permissions),\n            \"version\": scope.version,\n        },\n        \"tenant\": {\"id\": str(scope.tenant_id), \"name\": scope.tenant_name, \"lifecycleState\": scope.lifecycle_state},\n        \"emulation\": None if not scope.emulation_id else {\"id\": str(scope.emulation_id), \"readOnly\": True},\n    }"
    },
    {
      "file": "backend/app/config.py",
      "name": "get_settings",
      "start": 40,
      "end": 41,
      "body": "def get_settings() -> Settings:\n    return Settings()"
    },
    {
      "file": "backend/app/database.py",
      "name": "get_engine",
      "start": 10,
      "end": 12,
      "body": "def get_engine() -> Engine:\n    \"\"\"Create a process-local engine from the configured PostgreSQL URL.\"\"\"\n    return create_engine(str(get_settings().database_url), pool_pre_ping=True, connect_args={\"connect_timeout\": 3})"
    },
    {
      "file": "backend/app/database.py",
      "name": "get_session",
      "start": 15,
      "end": 18,
      "body": "def get_session() -> Generator[Session, None, None]:\n    session_factory = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False)\n    with session_factory() as session:\n        yield session"
    },
    {
      "file": "backend/app/execution.py",
      "name": "_permission",
      "start": 51,
      "end": 52,
      "body": "def _permission(scope: ScopedTenant, mutation: bool) -> None:\n    _require_any(scope, ((\"page.my-tasks.write\" if mutation else \"page.my-tasks.read\"), (\"page.work-update.write\" if mutation else \"page.work-update.read\"), (\"page.qc-prep.write\" if mutation else \"page.qc-prep.read\")), mutation=mutation)"
    },
    {
      "file": "backend/app/execution.py",
      "name": "_task",
      "start": 55,
      "end": 56,
      "body": "def _task(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"assignedTo\": str(row[\"assigned_to\"]), \"title\": row[\"title\"], \"notes\": row[\"notes\"], \"status\": row[\"status\"], \"completedAt\": row[\"completed_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/execution.py",
      "name": "list_my_tasks",
      "start": 60,
      "end": 63,
      "body": "def list_my_tasks(scope: ScopedTenant) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, False)\n    rows = session.execute(text(\"SELECT * FROM technician_tasks WHERE assigned_to=:actor ORDER BY updated_at DESC,id DESC\"), {\"actor\": str(current.actor_id)}).mappings().all()\n    return [_task(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/execution.py",
      "name": "assign_task",
      "start": 67,
      "end": 83,
      "body": "def assign_task(input: TaskCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, True)\n    if \"tenant.users.manage\" not in current.permissions:\n        raise auth_error(\"TASK_ASSIGNMENT_FORBIDDEN\", status.HTTP_403_FORBIDDEN)\n    job = _row_or_404(session, \"job_cards\", input.job_id, \"JOB_NOT_FOUND\")\n    if job[\"branch_id\"] not in current.branch_ids: raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    valid_assignee = session.execute(text(\"\"\"SELECT 1 FROM tenant_memberships membership\n        JOIN membership_roles assignment ON assignment.membership_id=membership.id\n        JOIN role_permissions permission ON permission.role_id=assignment.role_id\n        JOIN membership_branches branch_assignment ON branch_assignment.membership_id=membership.id\n        WHERE membership.tenant_id=:tenant AND membership.user_id=:user AND membership.status='ACTIVE'\n          AND branch_assignment.branch_id=:branch\n          AND permission.permission IN ('page.my-tasks.write','page.work-update.write') LIMIT 1\"\"\"), {\"tenant\": str(current.tenant_id), \"user\": str(input.assigned_to), \"branch\": str(job[\"branch_id\"])}).scalar()\n    if not valid_assignee: raise auth_error(\"TECHNICIAN_NOT_IN_TENANT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,created_by,updated_by)\n        VALUES (:tenant,:branch,:job,:assignee,:title,:notes,:actor,:actor) RETURNING *\"\"\"), {\"tenant\":str(current.tenant_id),\"branch\":str(job[\"branch_id\"]),\"job\":input.job_id,\"assignee\":str(input.assigned_to),\"title\":input.title.strip(),\"notes\":input.notes.strip(),\"actor\":str(current.actor_id)}).mappings().one()\n    payload = _task(dict(row)); _audit(session,current,\"TECHNICIAN_TASK_ASSIGNED\",input.title.strip(),{},payload); return payload"
    },
    {
      "file": "backend/app/execution.py",
      "name": "update_task",
      "start": 87,
      "end": 96,
      "body": "def update_task(task_id: int, input: TaskUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, True); before = _row_or_404(session,\"technician_tasks\",task_id,\"TASK_NOT_FOUND\")\n    if before[\"assigned_to\"] != current.actor_id: raise auth_error(\"TASK_NOT_ASSIGNED_TO_ACTOR\", status.HTTP_403_FORBIDDEN)\n    if before[\"status\"] in {\"COMPLETED\",\"CANCELLED\"}: raise auth_error(\"TASK_NOT_EDITABLE\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.status == \"BLOCKED\" and not input.note.strip(): raise auth_error(\"BLOCKER_NOTE_REQUIRED\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"UPDATE technician_tasks SET status=:status,notes=:notes,updated_by=:actor,updated_at=now(),completed_at=CASE WHEN :status='COMPLETED' THEN now() ELSE NULL END WHERE id=:id RETURNING *\"), {\"status\":input.status,\"notes\":input.note.strip() or before[\"notes\"],\"actor\":str(current.actor_id),\"id\":task_id}).mappings().one()\n    update = session.execute(text(\"INSERT INTO work_updates (tenant_id,branch_id,job_card_id,task_id,body,status,actor_id) VALUES (:tenant,:branch,:job,:task,:body,:status,:actor) RETURNING id,created_at\"), {\"tenant\":str(current.tenant_id),\"branch\":str(before[\"branch_id\"]),\"job\":before[\"job_card_id\"],\"task\":task_id,\"body\":input.note.strip() or f\"Task marked {input.status}\",\"status\":input.status,\"actor\":str(current.actor_id)}).mappings().one()\n    payload = {\"task\": _task(dict(row)), \"workUpdate\": {\"id\": update[\"id\"], \"createdAt\": update[\"created_at\"]}}\n    _audit(session, current, \"TECHNICIAN_TASK_UPDATED\", input.note.strip() or input.status, _task(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/execution.py",
      "name": "upload_attachment",
      "start": 100,
      "end": 111,
      "body": "async def upload_attachment(update_id: int, scope: ScopedTenant, file: UploadFile = File(...), label: Annotated[str, Form(max_length=1000)] = \"\") -> dict[str, object]:\n    session, current = scope; _permission(scope, True); update = _row_or_404(session,\"work_updates\",update_id,\"WORK_UPDATE_NOT_FOUND\")\n    if update[\"actor_id\"] != current.actor_id: raise auth_error(\"WORK_UPDATE_NOT_OWNED\",status.HTTP_403_FORBIDDEN)\n    content = await file.read(10_485_761)\n    if not content or len(content)>10_485_760: raise auth_error(\"ATTACHMENT_SIZE_INVALID\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if not file.filename or not file.content_type: raise auth_error(\"ATTACHMENT_METADATA_REQUIRED\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    digest=hashlib.sha256(content).hexdigest()\n    row=session.execute(text(\"\"\"INSERT INTO evidence_attachments (tenant_id,branch_id,job_card_id,work_update_id,filename,content_type,size_bytes,sha256,content,uploaded_by)\n      VALUES (:tenant,:branch,:job,:update,:name,:type,:size,:hash,:content,:actor) RETURNING id,filename,content_type,size_bytes,sha256,created_at\"\"\"),{\"tenant\":str(current.tenant_id),\"branch\":str(update[\"branch_id\"]),\"job\":update[\"job_card_id\"],\"update\":update_id,\"name\":label.strip() or file.filename,\"type\":file.content_type,\"size\":len(content),\"hash\":digest,\"content\":content,\"actor\":str(current.actor_id)}).mappings().one()\n    payload = {\"id\":row[\"id\"],\"filename\":row[\"filename\"],\"contentType\":row[\"content_type\"],\"sizeBytes\":row[\"size_bytes\"],\"sha256\":row[\"sha256\"],\"createdAt\":row[\"created_at\"]}\n    _audit(session, current, \"WORK_EVIDENCE_ATTACHED\", payload[\"filename\"], {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/execution.py",
      "name": "read_attachment",
      "start": 115,
      "end": 123,
      "body": "def read_attachment(attachment_id: int, scope: ScopedTenant) -> Response:\n    \"\"\"Return attachment bytes only after the request's RLS scope has found it.\"\"\"\n    session, _ = scope; _permission(scope, False)\n    row = _row_or_404(session, \"evidence_attachments\", attachment_id, \"ATTACHMENT_NOT_FOUND\")\n    return Response(\n        content=bytes(row[\"content\"]),\n        media_type=str(row[\"content_type\"]),\n        headers={\"Content-Disposition\": f'attachment; filename=\"{str(row[\"filename\"]).replace(chr(34), \"\")}\"'},\n    )"
    },
    {
      "file": "backend/app/execution.py",
      "name": "create_qc_check",
      "start": 127,
      "end": 133,
      "body": "def create_qc_check(input: QcCheckCreate, scope: ScopedTenant) -> dict[str, object]:\n    session,current=scope; _permission(scope,True); job=_row_or_404(session,\"job_cards\",input.job_id,\"JOB_NOT_FOUND\")\n    if job[\"status\"] not in {\"IN_PROGRESS\", \"HOLD\"}: raise auth_error(\"QC_NOT_AVAILABLE_FOR_JOB_STATUS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row=session.execute(text(\"INSERT INTO qc_checks (tenant_id,branch_id,job_card_id,label,required,created_by) VALUES (:tenant,:branch,:job,:label,:required,:actor) RETURNING *\"),{\"tenant\":str(current.tenant_id),\"branch\":str(job[\"branch_id\"]),\"job\":input.job_id,\"label\":input.label.strip(),\"required\":input.required,\"actor\":str(current.actor_id)}).mappings().one()\n    payload = {\"id\":row[\"id\"],\"jobId\":row[\"job_card_id\"],\"label\":row[\"label\"],\"required\":row[\"required\"],\"status\":row[\"status\"]}\n    _audit(session, current, \"QC_CHECK_CREATED\", input.label.strip(), {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/execution.py",
      "name": "record_qc_result",
      "start": 137,
      "end": 149,
      "body": "def record_qc_result(check_id:int,input:QcResult,scope:ScopedTenant)->dict[str,object]:\n    session,current=scope; _permission(scope,True); check=_row_or_404(session,\"qc_checks\",check_id,\"QC_CHECK_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(check[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    if job[\"status\"] not in {\"IN_PROGRESS\", \"HOLD\"}: raise auth_error(\"QC_NOT_AVAILABLE_FOR_JOB_STATUS\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.outcome==\"PASSED\":\n        rework=session.execute(text(\"SELECT 1 FROM technician_tasks WHERE job_card_id=:job AND title LIKE 'Rework:%' AND status<>'COMPLETED'\"),{\"job\":check[\"job_card_id\"]}).scalar()\n        if rework: raise auth_error(\"QC_REWORK_REQUIRED\",status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"INSERT INTO qc_results (tenant_id,branch_id,qc_check_id,outcome,note,actor_id) VALUES (:tenant,:branch,:check,:outcome,:note,:actor)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(check[\"branch_id\"]),\"check\":check_id,\"outcome\":input.outcome,\"note\":input.note.strip(),\"actor\":str(current.actor_id)})\n    if input.outcome==\"FAILED\":\n        session.execute(text(\"INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,status,created_by,updated_by) VALUES (:tenant,:branch,:job,:actor,:title,:note,'PENDING',:actor,:actor)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(check[\"branch_id\"]),\"job\":check[\"job_card_id\"],\"actor\":str(current.actor_id),\"title\":f\"Rework: {check['label']}\",\"note\":input.note.strip()})\n    session.execute(text(\"UPDATE qc_checks SET status=:status WHERE id=:id\"),{\"status\":input.outcome,\"id\":check_id})\n    _audit(session,current,\"QC_RESULT_RECORDED\",input.note.strip() or input.outcome,{}, {\"checkId\":check_id,\"outcome\":input.outcome})\n    return {\"id\":check_id,\"status\":input.outcome}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_is_owner",
      "start": 83,
      "end": 84,
      "body": "def _is_owner(current: TenantScope) -> bool:\n    return any(name == \"Owner/Admin\" for _, name, _ in current.roles)"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_permission",
      "start": 87,
      "end": 98,
      "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    \"\"\"Accounts has the explicit finance pages; Owner/Admin remains an override.\"\"\"\n    _, current = scope\n    if _is_owner(current):\n        if mutation:\n            try:\n                require_mutation_allowed(current)\n            except PermissionError as error:\n                raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n        return current\n    verb = \"write\" if mutation else \"read\"\n    return _require_any(scope, tuple(f\"page.{page}.{verb}\" for page in (\"ready-to-invoice\", \"invoice\", \"payment\", \"delivery\")), mutation=mutation)"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_decode_attachment",
      "start": 101,
      "end": 110,
      "body": "def _decode_attachment(input: AttachmentInput | None) -> tuple[str | None, str | None, bytes | None, str | None]:\n    if input is None:\n        return None, None, None, None\n    try:\n        payload = base64.b64decode(input.data_base64, validate=True)\n    except (binascii.Error, ValueError) as error:\n        raise auth_error(\"INVALID_SUPPORTING_ATTACHMENT\", status.HTTP_422_UNPROCESSABLE_ENTITY) from error\n    if not payload or len(payload) > MAX_ARTIFACT_BYTES:\n        raise auth_error(\"SUPPORTING_ATTACHMENT_SIZE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return input.filename.strip(), input.content_type, payload, hashlib.sha256(payload).hexdigest()"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_fiscal_year",
      "start": 113,
      "end": 115,
      "body": "def _fiscal_year(now: datetime) -> str:\n    year = now.year if now.month >= 4 else now.year - 1\n    return f\"FY{year}-{str(year + 1)[-2:]}\""
    },
    {
      "file": "backend/app/finance.py",
      "name": "_branch_profile",
      "start": 118,
      "end": 120,
      "body": "def _branch_profile(session, branch_id: object) -> dict[str, object]:\n    row = session.execute(text(\"SELECT settings FROM branch_settings WHERE branch_id=:branch_id\"), {\"branch_id\": str(branch_id)}).mappings().one_or_none()\n    return dict(row[\"settings\"]) if row and row[\"settings\"] else {}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_prefix",
      "start": 123,
      "end": 129,
      "body": "def _prefix(profile: dict[str, object], document_type: str) -> str:\n    configured = profile.get(\"documentPrefixes\")\n    if isinstance(configured, dict) and isinstance(configured.get(document_type), str) and configured[document_type].strip():\n        candidate = re.sub(r\"[^A-Z0-9-]\", \"\", configured[document_type].strip().upper())[:24]\n        if candidate:\n            return candidate\n    return {\"INVOICE\": \"INV\", \"RECEIPT\": \"RCP\", \"GATE_PASS\": \"GP\", \"CREDIT_NOTE\": \"CRN\"}[document_type]"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_allocate_number",
      "start": 132,
      "end": 143,
      "body": "def _allocate_number(session, current: TenantScope, branch_id: object, document_type: str, profile: dict[str, object]) -> tuple[str, str, int]:\n    fiscal_year = _fiscal_year(datetime.now(timezone.utc))\n    # The upsert row lock makes duplicate concurrent allocations impossible.\n    sequence = session.execute(text(\"\"\"\n        INSERT INTO document_sequences (tenant_id,branch_id,document_type,fiscal_year,next_value)\n        VALUES (:tenant_id,:branch_id,:document_type,:fiscal_year,2)\n        ON CONFLICT (tenant_id,branch_id,document_type,fiscal_year) DO UPDATE\n            SET next_value=document_sequences.next_value + 1\n        RETURNING next_value - 1 AS value\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"document_type\": document_type, \"fiscal_year\": fiscal_year}).scalar_one()\n    number = f\"{_prefix(profile, document_type)}-{fiscal_year}-{int(sequence):05d}\"\n    return number, fiscal_year, int(sequence)"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_render_html",
      "start": 146,
      "end": 157,
      "body": "def _render_html(document_no: str, document_type: str, snapshot: dict[str, object]) -> str:\n    # Both document metadata and every snapshot field may originate with a user.\n    # This is a stored artifact, so escaping here is a security boundary, not UI\n    # decoration. The JSON remains canonical and the HTML is a safe presentation.\n    title = html.escape(document_no, quote=True)\n    heading = html.escape(document_type.replace(\"_\", \" \").title(), quote=True)\n    body = html.escape(json.dumps(snapshot, default=str, sort_keys=True, separators=(\",\", \":\")), quote=False)\n    return \"\".join((\n        \"<!doctype html><html><meta charset='utf-8'><title>\", title, \"</title><body>\",\n        f\"<h1>{heading} {title}</h1><pre>\", body,\n        \"</pre></body></html>\",\n    ))"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_issue_document",
      "start": 160,
      "end": 179,
      "body": "def _issue_document(session, current: TenantScope, *, job: dict[str, object], document_type: str, snapshot: dict[str, object], predecessor_document_id: int | None = None) -> dict[str, object]:\n    profile = _branch_profile(session, job[\"branch_id\"])\n    document_no, fiscal_year, sequence = _allocate_number(session, current, job[\"branch_id\"], document_type, profile)\n    full_snapshot = {**snapshot, \"documentNo\": document_no, \"documentType\": document_type, \"fiscalYear\": fiscal_year,\n                     \"branchProfile\": profile, \"templateVersion\": str(profile.get(\"documentTemplateVersion\", \"1\"))}\n    rendered_html = _render_html(document_no, document_type, full_snapshot)\n    artifact = rendered_html.encode(\"utf-8\")\n    row = session.execute(text(\"\"\"\n        INSERT INTO financial_documents\n          (tenant_id,branch_id,job_card_id,document_type,fiscal_year,sequence_value,document_no,template_version,snapshot,rendered_html,artifact,sha256,predecessor_document_id,issued_by)\n        VALUES\n          (:tenant_id,:branch_id,:job_id,:document_type,:fiscal_year,:sequence_value,:document_no,:template_version,\n           CAST(:snapshot AS jsonb),:rendered_html,:artifact,:sha256,:predecessor_document_id,:actor_id)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job[\"id\"],\n             \"document_type\": document_type, \"fiscal_year\": fiscal_year, \"sequence_value\": sequence, \"document_no\": document_no,\n             \"template_version\": full_snapshot[\"templateVersion\"], \"snapshot\": json.dumps(full_snapshot, default=str),\n             \"rendered_html\": rendered_html, \"artifact\": artifact, \"sha256\": hashlib.sha256(artifact).hexdigest(),\n             \"predecessor_document_id\": predecessor_document_id, \"actor_id\": str(current.actor_id)}).mappings().one()\n    return dict(row)"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_document",
      "start": 182,
      "end": 185,
      "body": "def _document(row: dict[str, object], *, voided: bool = False) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"type\": row[\"document_type\"], \"number\": row[\"document_no\"],\n            \"fiscalYear\": row[\"fiscal_year\"], \"templateVersion\": row[\"template_version\"], \"issuedAt\": row[\"issued_at\"],\n            \"voided\": voided, \"contentPath\": f\"/api/v1/financial-documents/{row['id']}/content\"}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_download_filename",
      "start": 188,
      "end": 191,
      "body": "def _download_filename(value: object, extension: str = \"\") -> str:\n    \"\"\"Keep Content-Disposition a header, never an injection surface.\"\"\"\n    name = re.sub(r\"[^A-Za-z0-9._-]\", \"_\", str(value)).strip(\"._\")[:180] or \"download\"\n    return f\"{name}{extension}\" if extension and not name.endswith(extension) else name"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_voided",
      "start": 194,
      "end": 195,
      "body": "def _voided(session, document_id: int) -> bool:\n    return bool(session.execute(text(\"SELECT 1 FROM financial_document_events WHERE document_id=:document_id AND event_type='VOID'\"), {\"document_id\": document_id}).scalar())"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_invoice",
      "start": 198,
      "end": 214,
      "body": "def _invoice(session, invoice_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT invoice.*, document.document_no, document.fiscal_year, document.template_version, document.issued_at\n        FROM invoices invoice JOIN financial_documents document ON document.id=invoice.issued_document_id WHERE invoice.id=:invoice_id\"\"\"), {\"invoice_id\": invoice_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"INVOICE_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    data = dict(row)\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    credited = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    voided = _voided(session, int(data[\"issued_document_id\"]))\n    balance = int(data[\"total_paise\"]) - paid\n    lines = [dict(line) for line in session.execute(text(\"SELECT * FROM invoice_lines WHERE invoice_id=:invoice_id ORDER BY line_no\"), {\"invoice_id\": invoice_id}).mappings().all()]\n    return {\"id\": data[\"id\"], \"jobId\": data[\"job_card_id\"], \"documentId\": data[\"issued_document_id\"], \"number\": data[\"document_no\"],\n            \"fiscalYear\": data[\"fiscal_year\"], \"subtotalPaise\": data[\"subtotal_paise\"], \"discountPaise\": data[\"discount_paise\"],\n            \"taxPaise\": data[\"tax_paise\"], \"totalPaise\": data[\"total_paise\"], \"paidPaise\": paid, \"creditedPaise\": credited, \"balancePaise\": balance,\n            \"status\": \"VOID\" if voided else \"CREDITED\" if credited >= int(data[\"total_paise\"]) else \"SETTLED\" if balance == 0 else \"PARTIAL\" if paid else \"UNPAID\", \"voided\": voided,\n            \"issuedAt\": data[\"issued_at\"], \"contentPath\": f\"/api/v1/financial-documents/{data['issued_document_id']}/content\",\n            \"lines\": [{\"lineNo\": line[\"line_no\"], \"description\": line[\"description\"], \"quantity\": line[\"quantity\"], \"unitAmountPaise\": line[\"unit_amount_paise\"], \"gstRateBps\": line[\"gst_rate_bps\"], \"taxablePaise\": line[\"taxable_paise\"], \"taxPaise\": line[\"tax_paise\"], \"totalPaise\": line[\"total_paise\"]} for line in lines]}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_active_invoice",
      "start": 217,
      "end": 224,
      "body": "def _active_invoice(session, job_id: int, *, lock: bool = False) -> dict[str, object] | None:\n    statement = \"\"\"SELECT invoice.* FROM active_invoice_claims claim\n       JOIN invoices invoice ON invoice.id=claim.invoice_id\n       WHERE claim.job_card_id=:job_id\"\"\"\n    if lock:\n        statement += \" FOR UPDATE\"\n    row = session.execute(text(statement), {\"job_id\": job_id}).mappings().one_or_none()\n    return dict(row) if row else None"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_approved_estimate_snapshot",
      "start": 227,
      "end": 236,
      "body": "def _approved_estimate_snapshot(session, job_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT approved_snapshot FROM estimates\n        WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\n        ORDER BY revision DESC LIMIT 1\"\"\"), {\"job_id\": job_id}).mappings().one_or_none()\n    if row is None or not row[\"approved_snapshot\"]:\n        raise auth_error(\"ESTIMATE_APPROVAL_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    snapshot = dict(row[\"approved_snapshot\"])\n    if not isinstance(snapshot.get(\"lines\"), list) or not snapshot[\"lines\"]:\n        raise auth_error(\"APPROVED_ESTIMATE_LINES_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return snapshot"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_estimate_calculations",
      "start": 239,
      "end": 266,
      "body": "def _estimate_calculations(snapshot: dict[str, object], discount_paise: int, gst_kind: str) -> list[dict[str, object]]:\n    calculations: list[dict[str, object]] = []\n    remaining_discount = discount_paise\n    for raw_line in snapshot[\"lines\"]:\n        if not isinstance(raw_line, dict):\n            raise auth_error(\"APPROVED_ESTIMATE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        try:\n            quantity = Decimal(str(raw_line[\"quantity\"]))\n            rate = Decimal(str(raw_line[\"rate\"]))\n            gst_rate = Decimal(str(raw_line[\"gstRate\"]))\n        except (KeyError, ArithmeticError) as error:\n            raise auth_error(\"APPROVED_ESTIMATE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY) from error\n        description = str(raw_line.get(\"description\", \"\")).strip()\n        if not description or quantity <= 0 or rate < 0 or gst_rate < 0 or gst_rate > 100:\n            raise auth_error(\"APPROVED_ESTIMATE_INVALID\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        unit_paise = int((rate * 100).to_integral_value(rounding=ROUND_HALF_UP))\n        raw = int((quantity * Decimal(unit_paise)).to_integral_value(rounding=ROUND_HALF_UP))\n        discount = min(raw, remaining_discount)\n        remaining_discount -= discount\n        taxable = raw - discount\n        gst_rate_bps = int((gst_rate * 100).to_integral_value(rounding=ROUND_HALF_UP))\n        tax = (taxable * gst_rate_bps + 5_000) // 10_000\n        calculations.append({\"description\": description, \"quantity\": float(quantity), \"unitAmountPaise\": unit_paise,\n                             \"gstRateBps\": gst_rate_bps, \"discountPaise\": discount, \"taxablePaise\": taxable, \"taxPaise\": tax,\n                             \"cgstPaise\": tax // 2 if gst_kind == \"CGST_SGST\" else 0,\n                             \"sgstPaise\": tax - tax // 2 if gst_kind == \"CGST_SGST\" else 0,\n                             \"igstPaise\": tax if gst_kind == \"IGST\" else 0, \"totalPaise\": taxable + tax})\n    return calculations"
    },
    {
      "file": "backend/app/finance.py",
      "name": "list_job_invoices",
      "start": 270,
      "end": 275,
      "body": "def list_job_invoices(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    rows = session.execute(text(\"SELECT id FROM invoices WHERE job_card_id=:job_id ORDER BY created_at\"), {\"job_id\": job_id}).mappings().all()\n    return [_invoice(session, int(row[\"id\"])) for row in rows]"
    },
    {
      "file": "backend/app/finance.py",
      "name": "issue_invoice",
      "start": 279,
      "end": 344,
      "body": "def issue_invoice(job_id: int, input: InvoiceIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    # Serialise competing issue commands for this job before checking either\n    # idempotency or the active-invoice claim. The claim table then preserves\n    # the invariant even if a second transaction began before this lock.\n    session.execute(text(\"SELECT id FROM job_cards WHERE id=:job_id FOR UPDATE\"), {\"job_id\": job_id})\n    if request_key:\n        replay = session.execute(text(\"SELECT id FROM invoices WHERE job_card_id=:job_id AND request_key=:request_key\"), {\"job_id\": job_id, \"request_key\": request_key.strip()}).scalar()\n        if replay:\n            return _invoice(session, int(replay))\n    approved = _approved_estimate_snapshot(session, job_id)\n    existing = _active_invoice(session, job_id, lock=True)\n    if existing:\n        raise auth_error(\"ACTIVE_INVOICE_EXISTS\", status.HTTP_409_CONFLICT)\n    has_prior_invoice = bool(session.execute(text(\"SELECT 1 FROM invoices WHERE job_card_id=:job_id\"), {\"job_id\": job_id}).scalar())\n    if has_prior_invoice and input.replaces_invoice_id is None:\n        raise auth_error(\"INVOICE_REPLACEMENT_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    predecessor_document_id = None\n    if input.replaces_invoice_id is not None:\n        replacement = _row_or_404(session, \"invoices\", input.replaces_invoice_id, \"INVOICE_NOT_FOUND\")\n        fully_credited = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id\"), {\"invoice_id\": input.replaces_invoice_id}).scalar_one()) >= int(replacement[\"total_paise\"])\n        if int(replacement[\"job_card_id\"]) != job_id or not (_voided(session, int(replacement[\"issued_document_id\"])) or fully_credited):\n            raise auth_error(\"INVOICE_REPLACEMENT_NOT_ALLOWED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        predecessor_document_id = int(replacement[\"issued_document_id\"])\n    profile = _branch_profile(session, job[\"branch_id\"])\n    branch_state = str(profile.get(\"state\", \"\")).strip().casefold()\n    customer_state = input.customer_state.strip().casefold()\n    gst_kind = \"CGST_SGST\" if branch_state and customer_state and branch_state == customer_state else \"IGST\"\n    estimate_discount = Decimal(str(approved.get(\"discount\", 0)))\n    discount_paise = int((estimate_discount * 100).to_integral_value(rounding=ROUND_HALF_UP))\n    calculations = _estimate_calculations(approved, discount_paise, gst_kind)\n    subtotal = sum(int(line[\"taxablePaise\"]) + int(line[\"discountPaise\"]) for line in calculations)\n    tax_total = sum(int(line[\"taxPaise\"]) for line in calculations)\n    total = subtotal - discount_paise + tax_total\n    snapshot = {\"jobId\": job_id, \"currency\": str(profile.get(\"currency\", \"INR\")), \"gstKind\": gst_kind,\n                \"customerState\": input.customer_state.strip(), \"lines\": calculations, \"subtotalPaise\": subtotal,\n                \"discountPaise\": discount_paise, \"taxPaise\": tax_total, \"totalPaise\": total,\n                \"approvedEstimate\": approved}\n    document = _issue_document(session, current, job=job, document_type=\"INVOICE\", snapshot=snapshot, predecessor_document_id=predecessor_document_id)\n    invoice = session.execute(text(\"\"\"\n        INSERT INTO invoices (tenant_id,branch_id,job_card_id,issued_document_id,replaces_invoice_id,subtotal_paise,discount_paise,tax_paise,total_paise,request_key,created_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:document_id,:replaces_invoice_id,:subtotal,:discount,:tax,:total,:request_key,:actor_id) RETURNING id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"document_id\": document[\"id\"],\n             \"replaces_invoice_id\": input.replaces_invoice_id, \"subtotal\": subtotal, \"discount\": discount_paise, \"tax\": tax_total,\n             \"total\": total, \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    for index, line in enumerate(calculations, start=1):\n        session.execute(text(\"\"\"INSERT INTO invoice_lines (tenant_id,branch_id,invoice_id,line_no,description,quantity,unit_amount_paise,gst_rate_bps,taxable_paise,tax_paise,total_paise)\n            VALUES (:tenant_id,:branch_id,:invoice_id,:line_no,:description,:quantity,:unit_amount_paise,:gst_rate_bps,:taxable_paise,:tax_paise,:total_paise)\"\"\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"invoice_id\": invoice[\"id\"], \"line_no\": index,\n             \"description\": line[\"description\"], \"quantity\": line[\"quantity\"], \"unit_amount_paise\": line[\"unitAmountPaise\"], \"gst_rate_bps\": line[\"gstRateBps\"], \"taxable_paise\": line[\"taxablePaise\"], \"tax_paise\": line[\"taxPaise\"], \"total_paise\": line[\"totalPaise\"]})\n    try:\n        session.execute(text(\"INSERT INTO active_invoice_claims (tenant_id,branch_id,job_card_id,invoice_id) VALUES (:tenant_id,:branch_id,:job_id,:invoice_id)\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"invoice_id\": invoice[\"id\"]})\n    except Exception as error:\n        raise auth_error(\"ACTIVE_INVOICE_EXISTS\", status.HTTP_409_CONFLICT) from error\n    if predecessor_document_id:\n        session.execute(text(\"\"\"INSERT INTO financial_document_events (tenant_id,branch_id,document_id,event_type,reason,related_document_id,actor_id)\n            VALUES (:tenant_id,:branch_id,:document_id,'REPLACED','Replacement invoice issued',:related_document_id,:actor_id)\"\"\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"document_id\": predecessor_document_id, \"related_document_id\": document[\"id\"], \"actor_id\": str(current.actor_id)})\n    payload = _invoice(session, int(invoice[\"id\"]))\n    _audit(session, current, \"INVOICE_ISSUED\", f\"Issued {document['document_no']}\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/finance.py",
      "name": "void_invoice",
      "start": 348,
      "end": 364,
      "body": "def void_invoice(invoice_id: int, input: VoidInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    invoice = _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE\"), {\"invoice_id\": invoice_id})\n    if _voided(session, int(invoice[\"issued_document_id\"])):\n        return _invoice(session, invoice_id)\n    if session.execute(text(\"SELECT 1 FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar():\n        raise auth_error(\"POST_PAYMENT_VOID_REQUIRES_CREDIT_NOTE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"\"\"INSERT INTO financial_document_events (tenant_id,branch_id,document_id,event_type,reason,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:document_id,'VOID',:reason,:request_key,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"document_id\": invoice[\"issued_document_id\"], \"reason\": input.reason.strip(),\n         \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    session.execute(text(\"DELETE FROM active_invoice_claims WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id})\n    payload = _invoice(session, invoice_id)\n    _audit(session, current, \"INVOICE_VOIDED\", input.reason.strip(), {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_credit_note",
      "start": 367,
      "end": 376,
      "body": "def _credit_note(session, credit_note_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT note.*, document.document_no, document.issued_at\n        FROM credit_notes note JOIN financial_documents document ON document.id=note.issued_document_id\n        WHERE note.id=:id\"\"\"), {\"id\": credit_note_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"CREDIT_NOTE_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    refunded = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM refunds WHERE credit_note_id=:id\"), {\"id\": credit_note_id}).scalar_one())\n    return {\"id\": row[\"id\"], \"invoiceId\": row[\"invoice_id\"], \"documentId\": row[\"issued_document_id\"], \"number\": row[\"document_no\"],\n            \"amountPaise\": row[\"amount_paise\"], \"reason\": row[\"reason\"], \"refundedPaise\": refunded, \"issuedAt\": row[\"issued_at\"],\n            \"contentPath\": f\"/api/v1/financial-documents/{row['issued_document_id']}/content\"}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "issue_credit_note",
      "start": 380,
      "end": 408,
      "body": "def issue_credit_note(invoice_id: int, input: CreditNoteIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    invoice = _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE\"), {\"invoice_id\": invoice_id})\n    if request_key:\n        replay = session.execute(text(\"SELECT id FROM credit_notes WHERE invoice_id=:invoice_id AND request_key=:request_key\"), {\"invoice_id\": invoice_id, \"request_key\": request_key.strip()}).scalar()\n        if replay:\n            return _credit_note(session, int(replay))\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    credited = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    if not paid:\n        raise auth_error(\"CREDIT_NOTE_REQUIRES_PAYMENT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if input.amount_paise > paid - credited:\n        raise auth_error(\"CREDIT_EXCEEDS_PAID_AMOUNT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    job = _row_or_404(session, \"job_cards\", int(invoice[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    document = _issue_document(session, current, job=job, document_type=\"CREDIT_NOTE\", snapshot={\"invoiceId\": invoice_id, \"invoiceDocumentId\": invoice[\"issued_document_id\"], \"amountPaise\": input.amount_paise, \"reason\": input.reason.strip() }, predecessor_document_id=int(invoice[\"issued_document_id\"]))\n    row = session.execute(text(\"\"\"INSERT INTO credit_notes (tenant_id,branch_id,invoice_id,issued_document_id,amount_paise,reason,request_key,created_by)\n        VALUES (:tenant_id,:branch_id,:invoice_id,:document_id,:amount,:reason,:request_key,:actor_id) RETURNING id\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"invoice_id\": invoice_id, \"document_id\": document[\"id\"], \"amount\": input.amount_paise, \"reason\": input.reason.strip(), \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"\"\"INSERT INTO financial_document_events\n        (tenant_id,branch_id,document_id,event_type,reason,related_document_id,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:document_id,'CREDITED',:reason,:related_document_id,:request_key,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"document_id\": invoice[\"issued_document_id\"], \"reason\": input.reason.strip(), \"related_document_id\": document[\"id\"], \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    if credited + input.amount_paise >= int(invoice[\"total_paise\"]):\n        session.execute(text(\"DELETE FROM active_invoice_claims WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id})\n    payload = _credit_note(session, int(row[\"id\"]))\n    _audit(session, current, \"CREDIT_NOTE_ISSUED\", input.reason.strip(), {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/finance.py",
      "name": "record_refund",
      "start": 412,
      "end": 429,
      "body": "def record_refund(credit_note_id: int, input: RefundRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    note = _row_or_404(session, \"credit_notes\", credit_note_id, \"CREDIT_NOTE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM credit_notes WHERE id=:id FOR UPDATE\"), {\"id\": credit_note_id})\n    if request_key:\n        replay = session.execute(text(\"SELECT id FROM refunds WHERE credit_note_id=:id AND request_key=:request_key\"), {\"id\": credit_note_id, \"request_key\": request_key.strip()}).scalar()\n        if replay:\n            return {\"id\": replay, \"creditNoteId\": credit_note_id, \"replayed\": True}\n    refunded = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM refunds WHERE credit_note_id=:id\"), {\"id\": credit_note_id}).scalar_one())\n    if refunded + input.amount_paise > int(note[\"amount_paise\"]):\n        raise auth_error(\"REFUND_EXCEEDS_CREDIT_NOTE\", status.HTTP_409_CONFLICT)\n    row = session.execute(text(\"\"\"INSERT INTO refunds (tenant_id,branch_id,credit_note_id,amount_paise,method,reference,request_key,created_by)\n        VALUES (:tenant_id,:branch_id,:credit_note_id,:amount,:method,:reference,:request_key,:actor_id) RETURNING id\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(note[\"branch_id\"]), \"credit_note_id\": credit_note_id, \"amount\": input.amount_paise, \"method\": input.method.upper(), \"reference\": input.reference.strip(), \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = {\"id\": row[\"id\"], \"creditNoteId\": credit_note_id, \"amountPaise\": input.amount_paise, \"method\": input.method.upper(), \"reference\": input.reference.strip()}\n    _audit(session, current, \"REFUND_RECORDED\", f\"Credit note #{credit_note_id}\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/finance.py",
      "name": "record_payment",
      "start": 433,
      "end": 461,
      "body": "def record_payment(invoice_id: int, input: PaymentRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    if request_key:\n        existing = session.execute(text(\"SELECT id FROM payments WHERE invoice_id=:invoice_id AND request_key=:request_key\"), {\"invoice_id\": invoice_id, \"request_key\": request_key.strip()}).scalar()\n        if existing:\n            return _payment(session, int(existing))\n    invoice = _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    session.execute(text(\"SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE\"), {\"invoice_id\": invoice_id})\n    if _voided(session, int(invoice[\"issued_document_id\"])):\n        raise auth_error(\"PAYMENT_ON_VOID_INVOICE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice_id}).scalar_one())\n    if paid + input.amount_paise > int(invoice[\"total_paise\"]):\n        raise auth_error(\"PAYMENT_EXCEEDS_BALANCE\", status.HTTP_409_CONFLICT)\n    job = _row_or_404(session, \"job_cards\", int(invoice[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    receipt_snapshot = {\"invoiceId\": invoice_id, \"invoiceDocumentId\": invoice[\"issued_document_id\"], \"amountPaise\": input.amount_paise,\n                        \"method\": input.method.upper(), \"reference\": input.reference.strip(), \"payer\": input.payer.strip(), \"receivedAt\": input.received_at.isoformat()}\n    receipt = _issue_document(session, current, job=job, document_type=\"RECEIPT\", snapshot=receipt_snapshot, predecessor_document_id=int(invoice[\"issued_document_id\"]))\n    filename, content_type, artifact, checksum = _decode_attachment(input.supporting_attachment)\n    payment = session.execute(text(\"\"\"INSERT INTO payments\n        (tenant_id,branch_id,invoice_id,receipt_document_id,amount_paise,method,reference,payer,supporting_filename,supporting_content_type,supporting_artifact,supporting_sha256,received_at,request_key,received_by)\n        VALUES (:tenant_id,:branch_id,:invoice_id,:receipt_document_id,:amount_paise,:method,:reference,:payer,:filename,:content_type,:artifact,:checksum,:received_at,:request_key,:actor_id) RETURNING id\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(invoice[\"branch_id\"]), \"invoice_id\": invoice_id, \"receipt_document_id\": receipt[\"id\"],\n         \"amount_paise\": input.amount_paise, \"method\": input.method.upper(), \"reference\": input.reference.strip(), \"payer\": input.payer.strip(),\n         \"filename\": filename, \"content_type\": content_type, \"artifact\": artifact, \"checksum\": checksum, \"received_at\": input.received_at,\n         \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _payment(session, int(payment[\"id\"]))\n    _audit(session, current, \"PAYMENT_RECORDED\", f\"Payment receipt {receipt['document_no']}\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_payment",
      "start": 464,
      "end": 472,
      "body": "def _payment(session, payment_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"SELECT payment.*, document.document_no, document.issued_at FROM payments payment\n        JOIN financial_documents document ON document.id=payment.receipt_document_id WHERE payment.id=:payment_id\"\"\"), {\"payment_id\": payment_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"PAYMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return {\"id\": row[\"id\"], \"invoiceId\": row[\"invoice_id\"], \"receiptDocumentId\": row[\"receipt_document_id\"], \"receiptNumber\": row[\"document_no\"],\n            \"amountPaise\": row[\"amount_paise\"], \"method\": row[\"method\"], \"reference\": row[\"reference\"], \"payer\": row[\"payer\"],\n            \"receivedAt\": row[\"received_at\"], \"contentPath\": f\"/api/v1/financial-documents/{row['receipt_document_id']}/content\",\n            \"supportingAttachmentPath\": f\"/api/v1/payments/{row['id']}/supporting-attachment\" if row[\"supporting_artifact\"] else None}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "list_payments",
      "start": 476,
      "end": 480,
      "body": "def list_payments(invoice_id: int, scope: ScopedTenant) -> list[dict[str, object]]:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    _row_or_404(session, \"invoices\", invoice_id, \"INVOICE_NOT_FOUND\")\n    return [_payment(session, int(row[\"id\"])) for row in session.execute(text(\"SELECT id FROM payments WHERE invoice_id=:invoice_id ORDER BY created_at,id\"), {\"invoice_id\": invoice_id}).mappings().all()]"
    },
    {
      "file": "backend/app/finance.py",
      "name": "complete_handover",
      "start": 484,
      "end": 514,
      "body": "def complete_handover(job_id: int, input: HandoverInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    existing = session.execute(text(\"SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id\"), {\"job_id\": job_id}).mappings().one_or_none()\n    if existing:\n        return _handover(session, dict(existing))\n    if job[\"status\"] != \"COMPLETED\":\n        raise auth_error(\"HANDOVER_REQUIRES_COMPLETED_JOB\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    invoice = _active_invoice(session, job_id, lock=True)\n    if invoice is None:\n        raise auth_error(\"HANDOVER_REQUIRES_INVOICE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    paid = int(session.execute(text(\"SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id\"), {\"invoice_id\": invoice[\"id\"]}).scalar_one())\n    if paid != int(invoice[\"total_paise\"]):\n        raise auth_error(\"HANDOVER_REQUIRES_SETTLED_INVOICE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    snapshot = {\"jobId\": job_id, \"invoiceId\": invoice[\"id\"], \"invoiceDocumentId\": invoice[\"issued_document_id\"], \"deliveredBy\": input.delivered_by.strip(),\n                \"finalOdometer\": input.final_odometer, \"acknowledgement\": input.acknowledgement.strip(), \"handoverAt\": datetime.now(timezone.utc).isoformat()}\n    gate_pass = _issue_document(session, current, job=job, document_type=\"GATE_PASS\", snapshot=snapshot, predecessor_document_id=int(invoice[\"issued_document_id\"]))\n    row = session.execute(text(\"\"\"INSERT INTO delivery_acknowledgements\n        (tenant_id,branch_id,job_card_id,invoice_id,gate_pass_document_id,delivered_by,final_odometer,acknowledgement,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:job_id,:invoice_id,:gate_pass_id,:delivered_by,:final_odometer,:acknowledgement,:request_key,:actor_id) RETURNING *\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"invoice_id\": invoice[\"id\"], \"gate_pass_id\": gate_pass[\"id\"],\n         \"delivered_by\": input.delivered_by.strip(), \"final_odometer\": input.final_odometer, \"acknowledgement\": input.acknowledgement.strip(),\n         \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"UPDATE job_cards SET status='CLOSED',updated_by=:actor_id,updated_at=now() WHERE id=:job_id\"), {\"actor_id\": str(current.actor_id), \"job_id\": job_id})\n    session.execute(text(\"\"\"INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:job_id,'complete-handover','COMPLETED','CLOSED','Settled invoice handover',:request_key,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    payload = _handover(session, dict(row))\n    _audit(session, current, \"JOB_HANDOVER_COMPLETED\", f\"Gate pass {gate_pass['document_no']}\", _job(job), payload)\n    return payload"
    },
    {
      "file": "backend/app/finance.py",
      "name": "_handover",
      "start": 517,
      "end": 521,
      "body": "def _handover(session, row: dict[str, object]) -> dict[str, object]:\n    document = _row_or_404(session, \"financial_documents\", int(row[\"gate_pass_document_id\"]), \"GATE_PASS_NOT_FOUND\")\n    return {\"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"invoiceId\": row[\"invoice_id\"], \"gatePassDocumentId\": row[\"gate_pass_document_id\"],\n            \"gatePassNumber\": document[\"document_no\"], \"deliveredBy\": row[\"delivered_by\"], \"finalOdometer\": row[\"final_odometer\"],\n            \"acknowledgement\": row[\"acknowledgement\"], \"handoverAt\": row[\"handover_at\"], \"contentPath\": f\"/api/v1/financial-documents/{document['id']}/content\"}"
    },
    {
      "file": "backend/app/finance.py",
      "name": "get_delivery",
      "start": 525,
      "end": 530,
      "body": "def get_delivery(job_id: int, scope: ScopedTenant) -> dict[str, object] | None:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    row = session.execute(text(\"SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id\"), {\"job_id\": job_id}).mappings().one_or_none()\n    return _handover(session, dict(row)) if row else None"
    },
    {
      "file": "backend/app/finance.py",
      "name": "get_document_content",
      "start": 534,
      "end": 544,
      "body": "def get_document_content(document_id: int, scope: ScopedTenant) -> Response:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    row = session.execute(text(\"SELECT document_no,content_type,artifact FROM financial_documents WHERE id=:document_id\"), {\"document_id\": document_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"FINANCIAL_DOCUMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return Response(content=bytes(row[\"artifact\"]), media_type=row[\"content_type\"], headers={\n        \"Content-Disposition\": f'attachment; filename=\"{_download_filename(row[\"document_no\"], \".html\")}\"',\n        \"Content-Security-Policy\": \"sandbox; default-src 'none'; style-src 'unsafe-inline'\",\n        \"X-Content-Type-Options\": \"nosniff\",\n    })"
    },
    {
      "file": "backend/app/finance.py",
      "name": "get_supporting_attachment",
      "start": 548,
      "end": 557,
      "body": "def get_supporting_attachment(payment_id: int, scope: ScopedTenant) -> Response:\n    session, _ = scope\n    _permission(scope, mutation=False)\n    row = session.execute(text(\"SELECT supporting_filename,supporting_content_type,supporting_artifact FROM payments WHERE id=:payment_id\"), {\"payment_id\": payment_id}).mappings().one_or_none()\n    if row is None or row[\"supporting_artifact\"] is None:\n        raise auth_error(\"SUPPORTING_ATTACHMENT_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return Response(content=bytes(row[\"supporting_artifact\"]), media_type=row[\"supporting_content_type\"], headers={\n        \"Content-Disposition\": f'attachment; filename=\"{_download_filename(row[\"supporting_filename\"])}\"',\n        \"X-Content-Type-Options\": \"nosniff\",\n    })"
    },
    {
      "file": "backend/app/followups.py",
      "name": "_permission",
      "start": 48,
      "end": 49,
      "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (f\"page.follow-ups.{'write' if mutation else 'read'}\",), mutation=mutation)"
    },
    {
      "file": "backend/app/followups.py",
      "name": "_search_permission",
      "start": 52,
      "end": 53,
      "body": "def _search_permission(scope: ScopedTenant) -> TenantScope:\n    return _require_any(scope, (\"page.search.read\",), mutation=False)"
    },
    {
      "file": "backend/app/followups.py",
      "name": "_clean",
      "start": 56,
      "end": 60,
      "body": "def _clean(value: str) -> str:\n    cleaned = value.strip()\n    if not cleaned:\n        raise auth_error(\"BLANK_VALUE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return cleaned"
    },
    {
      "file": "backend/app/followups.py",
      "name": "_followup_row",
      "start": 63,
      "end": 75,
      "body": "def _followup_row(session, followup_id: int) -> dict[str, object]:\n    row = session.execute(text(\"\"\"\n        SELECT f.*, j.job_no, c.name AS customer_name, v.number AS vehicle_no\n        FROM followups f\n        JOIN job_cards j ON j.id=f.job_card_id\n        JOIN visits visit ON visit.id=j.visit_id\n        JOIN customers c ON c.id=visit.customer_id\n        JOIN vehicles v ON v.id=visit.vehicle_id\n        WHERE f.id=:id\n    \"\"\"), {\"id\": followup_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"FOLLOWUP_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return dict(row)"
    },
    {
      "file": "backend/app/followups.py",
      "name": "_payload",
      "start": 78,
      "end": 86,
      "body": "def _payload(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"branchId\": str(row[\"branch_id\"]),\n        \"jobNo\": row[\"job_no\"], \"customerName\": row[\"customer_name\"], \"vehicleNo\": row[\"vehicle_no\"],\n        \"note\": row[\"note\"], \"dueAt\": row[\"due_at\"], \"status\": row[\"status\"], \"outcome\": row[\"outcome\"],\n        \"completedAt\": row[\"completed_at\"], \"archivedAt\": row[\"archived_at\"],\n        \"archiveReason\": row[\"archive_reason\"], \"version\": row[\"version\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
    },
    {
      "file": "backend/app/followups.py",
      "name": "list_followups",
      "start": 90,
      "end": 112,
      "body": "def list_followups(\n    scope: ScopedTenant,\n    job_id: int | None = Query(default=None, alias=\"jobId\", gt=0),\n    branch_id: UUID | None = Query(default=None, alias=\"branchId\"),\n    archived: bool = False,\n) -> list[dict[str, object]]:\n    session, current = scope\n    _permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT f.*, j.job_no, c.name AS customer_name, v.number AS vehicle_no\n        FROM followups f\n        JOIN job_cards j ON j.id=f.job_card_id\n        JOIN visits visit ON visit.id=j.visit_id\n        JOIN customers c ON c.id=visit.customer_id\n        JOIN vehicles v ON v.id=visit.vehicle_id\n        WHERE (:job_id IS NULL OR f.job_card_id=:job_id)\n          AND (:branch_id IS NULL OR f.branch_id=:branch_id)\n          AND (:archived = (f.archived_at IS NOT NULL))\n        ORDER BY (f.status='OPEN') DESC, f.due_at NULLS LAST, f.updated_at DESC, f.id DESC\n    \"\"\"), {\"job_id\": job_id, \"branch_id\": str(branch_id) if branch_id else None, \"archived\": archived}).mappings().all()\n    return [_payload(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/followups.py",
      "name": "followup_jobs",
      "start": 116,
      "end": 129,
      "body": "def followup_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    \"\"\"Minimal job context for Follow-up creation without granting the full job page.\"\"\"\n    session, current = scope\n    _permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT j.id, j.branch_id, j.job_no, j.status, c.name AS customer_name, v.number AS vehicle_no\n        FROM job_cards j JOIN visits visit ON visit.id=j.visit_id\n        JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id\n        WHERE (:branch_id IS NULL OR j.branch_id=:branch_id) AND j.status NOT IN ('CANCELLED','CLOSED')\n        ORDER BY j.created_at DESC, j.id DESC\n    \"\"\"), {\"branch_id\": str(branch_id) if branch_id else None}).mappings().all()\n    return [{\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"jobNo\": row[\"job_no\"], \"status\": row[\"status\"], \"customerName\": row[\"customer_name\"], \"vehicleNo\": row[\"vehicle_no\"]} for row in rows]"
    },
    {
      "file": "backend/app/followups.py",
      "name": "create_followup",
      "start": 133,
      "end": 146,
      "body": "def create_followup(input: FollowupCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", input.job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"\n        INSERT INTO followups (tenant_id,branch_id,job_card_id,note,due_at,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:note,:due_at,:actor_id,:actor_id) RETURNING id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": input.job_id,\n             \"note\": _clean(input.note), \"due_at\": input.due_at, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _payload(_followup_row(session, int(row[\"id\"])))\n    _audit(session, current, \"FOLLOWUP_CREATED\", f\"Created follow-up #{payload['id']}\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/followups.py",
      "name": "update_followup",
      "start": 150,
      "end": 163,
      "body": "def update_followup(followup_id: int, input: FollowupUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    before = _payload(_followup_row(session, followup_id))\n    if before[\"archivedAt\"] is not None:\n        raise auth_error(\"FOLLOWUP_ARCHIVED\", status.HTTP_409_CONFLICT)\n    session.execute(text(\"\"\"\n        UPDATE followups SET note=:note,due_at=:due_at,outcome=:outcome,updated_by=:actor_id,\n          updated_at=now(),version=version+1 WHERE id=:id\n    \"\"\"), {\"id\": followup_id, \"note\": _clean(input.note), \"due_at\": input.due_at,\n             \"outcome\": input.outcome.strip(), \"actor_id\": str(current.actor_id)})\n    payload = _payload(_followup_row(session, followup_id))\n    _audit(session, current, \"FOLLOWUP_UPDATED\", f\"Updated follow-up #{followup_id}\", before, payload)\n    return payload"
    },
    {
      "file": "backend/app/followups.py",
      "name": "complete_followup",
      "start": 167,
      "end": 179,
      "body": "def complete_followup(followup_id: int, input: FollowupComplete, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    before = _payload(_followup_row(session, followup_id))\n    if before[\"archivedAt\"] is not None:\n        raise auth_error(\"FOLLOWUP_ARCHIVED\", status.HTTP_409_CONFLICT)\n    session.execute(text(\"\"\"\n        UPDATE followups SET status='COMPLETED',outcome=:outcome,completed_at=COALESCE(completed_at,now()),\n          completed_by=COALESCE(completed_by,:actor_id),updated_by=:actor_id,updated_at=now(),version=version+1 WHERE id=:id\n    \"\"\"), {\"id\": followup_id, \"outcome\": input.outcome.strip(), \"actor_id\": str(current.actor_id)})\n    payload = _payload(_followup_row(session, followup_id))\n    _audit(session, current, \"FOLLOWUP_COMPLETED\", f\"Completed follow-up #{followup_id}\", before, payload)\n    return payload"
    },
    {
      "file": "backend/app/followups.py",
      "name": "archive_followup",
      "start": 183,
      "end": 195,
      "body": "def archive_followup(followup_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    before = _payload(_followup_row(session, followup_id))\n    if before[\"archivedAt\"] is not None:\n        raise auth_error(\"FOLLOWUP_ARCHIVED\", status.HTTP_409_CONFLICT)\n    session.execute(text(\"\"\"\n        UPDATE followups SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,\n          updated_by=:actor_id,updated_at=now(),version=version+1 WHERE id=:id\n    \"\"\"), {\"id\": followup_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)})\n    payload = _payload(_followup_row(session, followup_id))\n    _audit(session, current, \"FOLLOWUP_ARCHIVED\", f\"Archived follow-up #{followup_id}\", before, payload)\n    return payload"
    },
    {
      "file": "backend/app/followups.py",
      "name": "search",
      "start": 199,
      "end": 237,
      "body": "def search(\n    scope: ScopedTenant,\n    q: Annotated[str, Query(min_length=2, max_length=200)],\n    branch_id: UUID | None = Query(default=None, alias=\"branchId\"),\n    limit: Annotated[int, Query(ge=1, le=100)] = 30,\n    entities: list[SearchEntity] | None = Query(default=None),\n) -> dict[str, object]:\n    session, current = scope\n    _search_permission(scope)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    requested = tuple(dict.fromkeys(entities or (\"customer\", \"vehicle\", \"job\", \"invoice\")))\n    needle = f\"%{q.strip()}%\"\n    prefix = f\"{q.strip()}%\"\n    exact = q.strip()\n    rows = session.execute(text(\"\"\"\n        SELECT * FROM (\n          SELECT 'customer' AS entity, c.id, c.branch_id, c.name AS title, c.mobile AS subtitle,\n            CASE WHEN lower(c.name)=lower(:exact) OR lower(c.mobile)=lower(:exact) THEN 0 WHEN c.name ILIKE :prefix OR c.mobile ILIKE :prefix THEN 1 ELSE 2 END AS rank\n          FROM customers c WHERE c.archived_at IS NULL AND (:branch_id IS NULL OR c.branch_id=:branch_id) AND (c.name ILIKE :needle OR c.mobile ILIKE :needle)\n          UNION ALL\n          SELECT 'vehicle', v.id, v.branch_id, v.number, concat_ws(' \u00c2\u00b7 ',v.make,v.model,c.name),\n            CASE WHEN upper(v.number)=upper(:exact) THEN 0 WHEN v.number ILIKE :prefix THEN 1 ELSE 2 END\n          FROM vehicles v JOIN customers c ON c.id=v.customer_id WHERE v.archived_at IS NULL AND c.archived_at IS NULL AND (:branch_id IS NULL OR v.branch_id=:branch_id) AND (v.number ILIKE :needle OR v.make ILIKE :needle OR v.model ILIKE :needle OR c.name ILIKE :needle)\n          UNION ALL\n          SELECT 'job', j.id, j.branch_id, j.job_no, concat_ws(' \u00c2\u00b7 ',v.number,c.name,j.status),\n            CASE WHEN lower(j.job_no)=lower(:exact) THEN 0 WHEN j.job_no ILIKE :prefix THEN 1 ELSE 2 END\n          FROM job_cards j JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id\n          WHERE (:branch_id IS NULL OR j.branch_id=:branch_id) AND (j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)\n          UNION ALL\n          SELECT 'invoice', i.id, i.branch_id, d.document_no, concat_ws(' \u00c2\u00b7 ',j.job_no,v.number,c.name),\n            CASE WHEN lower(d.document_no)=lower(:exact) THEN 0 WHEN d.document_no ILIKE :prefix THEN 1 ELSE 2 END\n          FROM invoices i JOIN financial_documents d ON d.id=i.issued_document_id JOIN job_cards j ON j.id=i.job_card_id\n            JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id\n          WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=d.id AND event.event_type='VOID')\n            AND (:branch_id IS NULL OR i.branch_id=:branch_id) AND (d.document_no ILIKE :needle OR j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)\n        ) AS searchable WHERE entity = ANY(:entities) ORDER BY rank, entity, title, id LIMIT :limit\n    \"\"\"), {\"needle\": needle, \"prefix\": prefix, \"exact\": exact, \"branch_id\": str(branch_id) if branch_id else None, \"entities\": list(requested), \"limit\": limit}).mappings().all()\n    return {\"query\": q.strip(), \"results\": [{\"entity\": row[\"entity\"], \"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"title\": row[\"title\"], \"subtitle\": row[\"subtitle\"], \"rank\": row[\"rank\"]} for row in rows]}"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_clean",
      "start": 78,
      "end": 82,
      "body": "def _clean(value: str) -> str:\n    cleaned = value.strip()\n    if not cleaned:\n        raise auth_error(\"INVALID_INTAKE_INPUT\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return cleaned"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_require",
      "start": 85,
      "end": 98,
      "body": "def _require(scope: ScopedTenant, permission: str, *, mutation: bool = False) -> TenantScope:\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if permission not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_require_any",
      "start": 101,
      "end": 120,
      "body": "def _require_any(scope: ScopedTenant, permissions: tuple[str, ...], *, mutation: bool = False) -> TenantScope:\n    \"\"\"Allow intake from the existing Reception and Service workspaces.\n\n    Reception has Customer/Vehicle screens while Service works from My Queue.\n    The operation remains deny-by-default: at least one explicit page write or\n    read permission is required, and support emulation never mutates.\n    \"\"\"\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if not any(permission in current.permissions for permission in permissions):\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_branch",
      "start": 123,
      "end": 132,
      "body": "def _branch(current: TenantScope, branch_id: UUID | None) -> UUID:\n    if branch_id is None:\n        if len(current.branch_ids) != 1:\n            raise auth_error(\"BRANCH_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        return current.branch_ids[0]\n    try:\n        require_branch(current, branch_id)\n    except PermissionError as error:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN) from error\n    return branch_id"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_row_or_404",
      "start": 135,
      "end": 139,
      "body": "def _row_or_404(session, table: str, record_id: int) -> dict[str, object]:\n    row = session.execute(text(f\"SELECT * FROM {table} WHERE id = :id\"), {\"id\": record_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"INTAKE_RECORD_NOT_FOUND\", status.HTTP_404_NOT_FOUND)\n    return dict(row)"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_customer",
      "start": 142,
      "end": 143,
      "body": "def _customer(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"name\": row[\"name\"], \"mobile\": row[\"mobile\"], \"type\": row[\"type\"], \"address\": row[\"address\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_vehicle",
      "start": 146,
      "end": 147,
      "body": "def _vehicle(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"customer_id\": row[\"customer_id\"], \"customerId\": row[\"customer_id\"], \"number\": row[\"number\"], \"make\": row[\"make\"], \"model\": row[\"model\"], \"color\": row[\"color\"], \"km\": row[\"km\"], \"engine_no\": row[\"engine_no\"], \"engineNo\": row[\"engine_no\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_visit",
      "start": 150,
      "end": 151,
      "body": "def _visit(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"customerId\": row[\"customer_id\"], \"vehicleId\": row[\"vehicle_id\"], \"advisorId\": str(row[\"advisor_id\"]) if row[\"advisor_id\"] else None, \"receivedBy\": str(row[\"received_by\"]), \"receivedAt\": row[\"received_at\"], \"fuel\": row[\"fuel\"], \"odoReading\": row[\"odo_reading\"], \"fuelLevelValue\": row[\"fuel_level_value\"], \"fuelLevelUnit\": row[\"fuel_level_unit\"], \"keys\": row[\"keys\"], \"accessories\": row[\"accessories\"], \"requestedWork\": row[\"requested_work\"], \"photosNote\": row[\"photos_note\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_assert_active_customer",
      "start": 154,
      "end": 158,
      "body": "def _assert_active_customer(session, customer_id: int, branch_id: UUID) -> dict[str, object]:\n    row = _row_or_404(session, \"customers\", customer_id)\n    if row[\"branch_id\"] != branch_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"CUSTOMER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
    },
    {
      "file": "backend/app/intake.py",
      "name": "_assert_active_vehicle",
      "start": 161,
      "end": 165,
      "body": "def _assert_active_vehicle(session, vehicle_id: int, branch_id: UUID, customer_id: int) -> dict[str, object]:\n    row = _row_or_404(session, \"vehicles\", vehicle_id)\n    if row[\"branch_id\"] != branch_id or row[\"customer_id\"] != customer_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"VEHICLE_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
    },
    {
      "file": "backend/app/intake.py",
      "name": "list_customers",
      "start": 169,
      "end": 181,
      "body": "def list_customers(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _require_any(scope, (\"page.customers.read\", \"page.my-queue.read\"))\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT * FROM customers\n        WHERE (:archived = (archived_at IS NOT NULL))\n          AND (:branch_id IS NULL OR branch_id = :branch_id)\n          AND (:q = '' OR name ILIKE :needle OR mobile ILIKE :needle)\n        ORDER BY name, id\n    \"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_customer(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/intake.py",
      "name": "create_customer",
      "start": 185,
      "end": 193,
      "body": "def create_customer(input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_require_any(scope, (\"page.customers.write\", \"page.my-queue.write\"), mutation=True), input.branch_id)\n    row = session.execute(text(\"\"\"\n        INSERT INTO customers (tenant_id, branch_id, name, mobile, type, address, created_by, updated_by)\n        VALUES (:tenant_id, :branch_id, :name, :mobile, :type, :address, :actor_id, :actor_id) RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"name\": _clean(input.name), \"mobile\": _clean(input.mobile), \"type\": _clean(input.type), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _customer(dict(row)); _audit(session, current, \"CUSTOMER_CREATED\", \"Customer created\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "get_customer",
      "start": 197,
      "end": 199,
      "body": "def get_customer(customer_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _require_any(scope, (\"page.customers.read\", \"page.my-queue.read\"))\n    return _customer(_row_or_404(session, \"customers\", customer_id))"
    },
    {
      "file": "backend/app/intake.py",
      "name": "update_customer",
      "start": 203,
      "end": 210,
      "body": "def update_customer(customer_id: int, input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.customers.write\", \"page.my-queue.write\"), mutation=True)\n    before = _row_or_404(session, \"customers\", customer_id)\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != _branch(current, input.branch_id or before[\"branch_id\"]):\n        raise auth_error(\"CUSTOMER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE customers SET name=:name, mobile=:mobile, type=:type, address=:address, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": customer_id, \"name\": _clean(input.name), \"mobile\": _clean(input.mobile), \"type\": _clean(input.type), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _customer(dict(row)); _audit(session, current, \"CUSTOMER_UPDATED\", \"Customer updated\", _customer(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "archive_customer",
      "start": 214,
      "end": 221,
      "body": "def archive_customer(customer_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.customers.write\", \"page.my-queue.write\"), mutation=True)\n    before = _row_or_404(session, \"customers\", customer_id)\n    if before[\"archived_at\"] is not None:\n        raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE customers SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": customer_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _customer(dict(row)); _audit(session, current, \"CUSTOMER_ARCHIVED\", input.reason.strip(), _customer(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "list_vehicles",
      "start": 225,
      "end": 229,
      "body": "def list_vehicles(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _require_any(scope, (\"page.vehicles.read\", \"page.my-queue.read\"))\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT * FROM vehicles WHERE (:archived = (archived_at IS NOT NULL)) AND (:branch_id IS NULL OR branch_id=:branch_id) AND (:q='' OR number ILIKE :needle OR make ILIKE :needle OR model ILIKE :needle) ORDER BY number, id\"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_vehicle(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/intake.py",
      "name": "create_vehicle",
      "start": 233,
      "end": 238,
      "body": "def create_vehicle(input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_require_any(scope, (\"page.vehicles.write\", \"page.my-queue.write\"), mutation=True), input.branch_id)\n    _assert_active_customer(session, input.customer_id, branch_id)\n    row = session.execute(text(\"\"\"INSERT INTO vehicles (tenant_id, branch_id, customer_id, number, make, model, color, km, engine_no, created_by, updated_by) VALUES (:tenant_id,:branch_id,:customer_id,:number,:make,:model,:color,:km,:engine_no,:actor_id,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"customer_id\": input.customer_id, \"number\": _clean(input.number).upper(), \"make\": _clean(input.make), \"model\": _clean(input.model), \"color\": input.color.strip(), \"km\": input.km, \"engine_no\": input.engine_no.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _vehicle(dict(row)); _audit(session, current, \"VEHICLE_CREATED\", \"Vehicle created\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "get_vehicle",
      "start": 242,
      "end": 244,
      "body": "def get_vehicle(vehicle_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _require_any(scope, (\"page.vehicles.read\", \"page.my-queue.read\"))\n    return _vehicle(_row_or_404(session, \"vehicles\", vehicle_id))"
    },
    {
      "file": "backend/app/intake.py",
      "name": "update_vehicle",
      "start": 248,
      "end": 255,
      "body": "def update_vehicle(vehicle_id: int, input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.vehicles.write\", \"page.my-queue.write\"), mutation=True)\n    before = _row_or_404(session, \"vehicles\", vehicle_id); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != branch_id: raise auth_error(\"VEHICLE_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _assert_active_customer(session, input.customer_id, branch_id)\n    row = session.execute(text(\"\"\"UPDATE vehicles SET customer_id=:customer_id, number=:number, make=:make, model=:model, color=:color, km=:km, engine_no=:engine_no, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": vehicle_id, \"customer_id\": input.customer_id, \"number\": _clean(input.number).upper(), \"make\": _clean(input.make), \"model\": _clean(input.model), \"color\": input.color.strip(), \"km\": input.km, \"engine_no\": input.engine_no.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _vehicle(dict(row)); _audit(session, current, \"VEHICLE_UPDATED\", \"Vehicle updated\", _vehicle(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "archive_vehicle",
      "start": 259,
      "end": 264,
      "body": "def archive_vehicle(vehicle_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.vehicles.write\", \"page.my-queue.write\"), mutation=True); before = _row_or_404(session, \"vehicles\", vehicle_id)\n    if before[\"archived_at\"] is not None: raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE vehicles SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": vehicle_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _vehicle(dict(row)); _audit(session, current, \"VEHICLE_ARCHIVED\", input.reason.strip(), _vehicle(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "list_visits",
      "start": 268,
      "end": 272,
      "body": "def list_visits(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _require_any(scope, (\"page.receive-vehicle.read\", \"page.customers.read\", \"page.my-queue.read\"))\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT v.* FROM visits v JOIN customers c ON c.id=v.customer_id JOIN vehicles h ON h.id=v.vehicle_id WHERE (:archived = (v.archived_at IS NOT NULL)) AND (:branch_id IS NULL OR v.branch_id=:branch_id) AND (:q='' OR c.name ILIKE :needle OR c.mobile ILIKE :needle OR h.number ILIKE :needle OR v.requested_work ILIKE :needle) ORDER BY v.received_at DESC, v.id DESC\"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_visit(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/intake.py",
      "name": "create_visit",
      "start": 276,
      "end": 281,
      "body": "def create_visit(input: VisitCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_require_any(scope, (\"page.receive-vehicle.write\", \"page.customers.write\", \"page.my-queue.write\"), mutation=True), input.branch_id)\n    _assert_active_customer(session, input.customer_id, branch_id); _assert_active_vehicle(session, input.vehicle_id, branch_id, input.customer_id)\n    row = session.execute(text(\"\"\"INSERT INTO visits (tenant_id,branch_id,customer_id,vehicle_id,advisor_id,received_by,fuel,odo_reading,fuel_level_value,fuel_level_unit,keys,accessories,requested_work,photos_note) VALUES (:tenant_id,:branch_id,:customer_id,:vehicle_id,:advisor_id,:actor_id,:fuel,:odo_reading,:fuel_level_value,:fuel_level_unit,:keys,:accessories,:requested_work,:photos_note) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"customer_id\": input.customer_id, \"vehicle_id\": input.vehicle_id, \"advisor_id\": str(input.advisor_id) if input.advisor_id else None, \"actor_id\": str(current.actor_id), \"fuel\": _clean(input.fuel), \"odo_reading\": input.odo_reading, \"fuel_level_value\": input.fuel_level_value.strip(), \"fuel_level_unit\": input.fuel_level_unit.strip(), \"keys\": input.keys.strip(), \"accessories\": input.accessories.strip(), \"requested_work\": _clean(input.requested_work), \"photos_note\": input.photos_note.strip()}).mappings().one()\n    payload = _visit(dict(row)); _audit(session, current, \"VISIT_CREATED\", \"Vehicle received\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "get_visit",
      "start": 285,
      "end": 287,
      "body": "def get_visit(visit_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, _ = scope; _require_any(scope, (\"page.receive-vehicle.read\", \"page.customers.read\", \"page.my-queue.read\"))\n    return _visit(_row_or_404(session, \"visits\", visit_id))"
    },
    {
      "file": "backend/app/intake.py",
      "name": "update_visit",
      "start": 291,
      "end": 296,
      "body": "def update_visit(visit_id: int, input: VisitUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.receive-vehicle.write\", \"page.customers.write\", \"page.my-queue.write\"), mutation=True); before = _row_or_404(session, \"visits\", visit_id)\n    if before[\"archived_at\"] is not None: raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE visits SET advisor_id=:advisor_id,fuel=:fuel,odo_reading=:odo_reading,fuel_level_value=:fuel_level_value,fuel_level_unit=:fuel_level_unit,keys=:keys,accessories=:accessories,requested_work=:requested_work,photos_note=:photos_note,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": visit_id, \"advisor_id\": str(input.advisor_id) if input.advisor_id else None, \"fuel\": _clean(input.fuel), \"odo_reading\": input.odo_reading, \"fuel_level_value\": input.fuel_level_value.strip(), \"fuel_level_unit\": input.fuel_level_unit.strip(), \"keys\": input.keys.strip(), \"accessories\": input.accessories.strip(), \"requested_work\": _clean(input.requested_work), \"photos_note\": input.photos_note.strip()}).mappings().one()\n    payload = _visit(dict(row)); _audit(session, current, \"VISIT_UPDATED\", \"Visit updated\", _visit(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/intake.py",
      "name": "archive_visit",
      "start": 300,
      "end": 305,
      "body": "def archive_visit(visit_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _require_any(scope, (\"page.receive-vehicle.write\", \"page.customers.write\", \"page.my-queue.write\"), mutation=True); before = _row_or_404(session, \"visits\", visit_id)\n    if before[\"archived_at\"] is not None: raise auth_error(\"INTAKE_RECORD_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE visits SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": visit_id, \"reason\": _clean(input.reason), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _visit(dict(row)); _audit(session, current, \"VISIT_ARCHIVED\", input.reason.strip(), _visit(before), payload)\n    return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_permission",
      "start": 91,
      "end": 93,
      "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    verb = \"write\" if mutation else \"read\"\n    return _require_any(scope, (f\"page.stock.{verb}\", f\"page.inward-purchases.{verb}\"), mutation=mutation)"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_adjustment_quantity",
      "start": 96,
      "end": 99,
      "body": "def _adjustment_quantity(quantity: float) -> float:\n    if quantity == 0:\n        raise auth_error(\"STOCK_ADJUSTMENT_ZERO\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return quantity"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_row_or_404",
      "start": 102,
      "end": 106,
      "body": "def _row_or_404(session, table: str, record_id: int, code: str) -> dict[str, object]:\n    row = session.execute(text(f\"SELECT * FROM {table} WHERE id=:id\"), {\"id\": record_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(code, status.HTTP_404_NOT_FOUND)\n    return dict(row)"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_catalogue",
      "start": 109,
      "end": 110,
      "body": "def _catalogue(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"sku\": row[\"sku\"], \"category\": row[\"category\"], \"name\": row[\"name\"], \"unit\": row[\"unit\"], \"lowStockQty\": float(row[\"low_stock_qty\"]), \"sellingPrice\": float(row[\"selling_price\"]), \"onHand\": float(row.get(\"on_hand\") or 0), \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_supplier",
      "start": 113,
      "end": 114,
      "body": "def _supplier(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"name\": row[\"name\"], \"mobile\": row[\"mobile\"], \"email\": row[\"email\"], \"address\": row[\"address\"], \"archivedAt\": row[\"archived_at\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_line",
      "start": 117,
      "end": 118,
      "body": "def _line(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"itemId\": row[\"item_id\"], \"lineNo\": row[\"line_no\"], \"orderedQty\": float(row[\"ordered_qty\"]), \"unitCost\": float(row[\"unit_cost\"]), \"discount\": float(row[\"discount\"]), \"gstRate\": float(row[\"gst_rate\"]), \"receivedQty\": float(row.get(\"received_qty\") or 0)}"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_purchase",
      "start": 121,
      "end": 123,
      "body": "def _purchase(row: dict[str, object], lines: list[dict[str, object]] | None = None) -> dict[str, object]:\n    payload = {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"supplierId\": row[\"supplier_id\"], \"poNumber\": row[\"po_number\"], \"orderDate\": row[\"order_date\"], \"status\": row[\"status\"], \"notes\": row[\"notes\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}\n    return {**payload, **({\"lines\": lines} if lines is not None else {})}"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_inward",
      "start": 126,
      "end": 127,
      "body": "def _inward(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"itemId\": row[\"item_id\"], \"purchaseOrderId\": row[\"purchase_order_id\"], \"purchaseOrderLineId\": row[\"purchase_order_line_id\"], \"qty\": float(row[\"qty\"]), \"unitCost\": float(row[\"unit_cost\"]), \"note\": row[\"note\"], \"receivedBy\": str(row[\"received_by\"]), \"receivedAt\": row[\"received_at\"]}"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_item_available",
      "start": 130,
      "end": 134,
      "body": "def _item_available(session, item_id: int, branch_id: UUID) -> dict[str, object]:\n    row = _row_or_404(session, \"catalogue_items\", item_id, \"CATALOGUE_ITEM_NOT_FOUND\")\n    if row[\"branch_id\"] != branch_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_supplier_available",
      "start": 137,
      "end": 141,
      "body": "def _supplier_available(session, supplier_id: int, branch_id: UUID) -> dict[str, object]:\n    row = _row_or_404(session, \"suppliers\", supplier_id, \"SUPPLIER_NOT_FOUND\")\n    if row[\"branch_id\"] != branch_id or row[\"archived_at\"] is not None:\n        raise auth_error(\"SUPPLIER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return row"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_purchase_with_lines",
      "start": 144,
      "end": 149,
      "body": "def _purchase_with_lines(session, purchase_id: int) -> dict[str, object]:\n    purchase = _row_or_404(session, \"purchase_orders\", purchase_id, \"PURCHASE_ORDER_NOT_FOUND\")\n    rows = session.execute(text(\"\"\"SELECT line.*, COALESCE(SUM(inward.qty), 0) AS received_qty\n        FROM purchase_order_lines line LEFT JOIN stock_inwards inward ON inward.purchase_order_line_id=line.id\n        WHERE line.purchase_order_id=:id GROUP BY line.id ORDER BY line.line_no\"\"\"), {\"id\": purchase_id}).mappings().all()\n    return _purchase(purchase, [_line(dict(row)) for row in rows])"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_replace_lines",
      "start": 152,
      "end": 161,
      "body": "def _replace_lines(session, current: TenantScope, purchase_id: int, branch_id: UUID, lines: list[PurchaseLineInput]) -> None:\n    seen: set[int] = set()\n    for line in lines:\n        if line.item_id in seen:\n            raise auth_error(\"DUPLICATE_PURCHASE_ITEM\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        seen.add(line.item_id); _item_available(session, line.item_id, branch_id)\n    session.execute(text(\"DELETE FROM purchase_order_lines WHERE purchase_order_id=:id\"), {\"id\": purchase_id})\n    for index, line in enumerate(lines, 1):\n        session.execute(text(\"\"\"INSERT INTO purchase_order_lines (tenant_id,branch_id,purchase_order_id,item_id,line_no,ordered_qty,unit_cost,discount,gst_rate)\n            VALUES (:tenant_id,:branch_id,:purchase_order_id,:item_id,:line_no,:ordered_qty,:unit_cost,:discount,:gst_rate)\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"purchase_order_id\": purchase_id, \"item_id\": line.item_id, \"line_no\": index, \"ordered_qty\": line.ordered_qty, \"unit_cost\": line.unit_cost, \"discount\": line.discount, \"gst_rate\": line.gst_rate})"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "_reconcile_purchase",
      "start": 164,
      "end": 173,
      "body": "def _reconcile_purchase(session, purchase_id: int) -> None:\n    rows = session.execute(text(\"\"\"SELECT line.ordered_qty, COALESCE(SUM(inward.qty),0) received\n        FROM purchase_order_lines line LEFT JOIN stock_inwards inward ON inward.purchase_order_line_id=line.id\n        WHERE line.purchase_order_id=:id GROUP BY line.id\"\"\"), {\"id\": purchase_id}).mappings().all()\n    if not rows:\n        return\n    received = [float(row[\"received\"]) for row in rows]\n    ordered = [float(row[\"ordered_qty\"]) for row in rows]\n    next_status = \"READY_TO_CLOSE\" if all(got >= expected for got, expected in zip(received, ordered)) else \"PARTIALLY_RECEIVED\" if any(got > 0 for got in received) else \"SENT\"\n    session.execute(text(\"UPDATE purchase_orders SET status=:status,updated_at=now() WHERE id=:id\"), {\"id\": purchase_id, \"status\": next_status})"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "list_catalogue",
      "start": 177,
      "end": 184,
      "body": "def list_catalogue(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT item.*, COALESCE(SUM(ledger.quantity),0) on_hand FROM catalogue_items item\n        LEFT JOIN stock_ledger ledger ON ledger.item_id=item.id WHERE (:archived=(item.archived_at IS NOT NULL))\n        AND (:branch_id IS NULL OR item.branch_id=:branch_id) AND (:q='' OR item.sku ILIKE :needle OR item.name ILIKE :needle OR item.category ILIKE :needle)\n        GROUP BY item.id ORDER BY item.name,item.id\"\"\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_catalogue(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "create_catalogue",
      "start": 188,
      "end": 192,
      "body": "def create_catalogue(input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)\n    row = session.execute(text(\"\"\"INSERT INTO catalogue_items (tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:sku,:category,:name,:unit,:low_stock_qty,:selling_price,:actor_id,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"sku\": _clean(input.sku).upper(), \"category\": input.category.strip(), \"name\": _clean(input.name), \"unit\": _clean(input.unit), \"low_stock_qty\": input.low_stock_qty, \"selling_price\": input.selling_price, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _catalogue(dict(row)); _audit(session, current, \"CATALOGUE_ITEM_CREATED\", \"Catalogue item created\", {}, payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "update_catalogue",
      "start": 196,
      "end": 200,
      "body": "def update_catalogue(item_id: int, input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"catalogue_items\", item_id, \"CATALOGUE_ITEM_NOT_FOUND\"); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != branch_id: raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"\"\"UPDATE catalogue_items SET sku=:sku,category=:category,name=:name,unit=:unit,low_stock_qty=:low_stock_qty,selling_price=:selling_price,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\": item_id, \"sku\": _clean(input.sku).upper(), \"category\": input.category.strip(), \"name\": _clean(input.name), \"unit\": _clean(input.unit), \"low_stock_qty\": input.low_stock_qty, \"selling_price\": input.selling_price, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _catalogue(dict(row)); _audit(session, current, \"CATALOGUE_ITEM_UPDATED\", \"Catalogue item updated\", _catalogue(before), payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "archive_catalogue",
      "start": 204,
      "end": 210,
      "body": "def archive_catalogue(item_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"catalogue_items\", item_id, \"CATALOGUE_ITEM_NOT_FOUND\")\n    if before[\"archived_at\"] is not None: raise auth_error(\"CATALOGUE_ITEM_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    linked = session.execute(text(\"SELECT 1 FROM purchase_order_lines WHERE item_id=:id LIMIT 1\"), {\"id\": item_id}).scalar()\n    if linked: raise auth_error(\"CATALOGUE_ITEM_HAS_PURCHASE_HISTORY\", status.HTTP_409_CONFLICT)\n    row = session.execute(text(\"UPDATE catalogue_items SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": item_id, \"actor_id\": str(current.actor_id), \"reason\": _clean(input.reason)}).mappings().one()\n    payload = _catalogue(dict(row)); _audit(session, current, \"CATALOGUE_ITEM_ARCHIVED\", input.reason.strip(), _catalogue(before), payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "list_suppliers",
      "start": 214,
      "end": 218,
      "body": "def list_suppliers(scope: ScopedTenant, q: str = \"\", archived: bool = False, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM suppliers WHERE (:archived=(archived_at IS NOT NULL)) AND (:branch_id IS NULL OR branch_id=:branch_id) AND (:q='' OR name ILIKE :needle OR mobile ILIKE :needle) ORDER BY name,id\"), {\"archived\": archived, \"branch_id\": str(branch_id) if branch_id else None, \"q\": q.strip(), \"needle\": f\"%{q.strip()}%\"}).mappings().all()\n    return [_supplier(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "create_supplier",
      "start": 222,
      "end": 225,
      "body": "def create_supplier(input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)\n    row = session.execute(text(\"INSERT INTO suppliers (tenant_id,branch_id,name,mobile,email,address,created_by,updated_by) VALUES (:tenant_id,:branch_id,:name,:mobile,:email,:address,:actor_id,:actor_id) RETURNING *\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"name\": _clean(input.name), \"mobile\": input.mobile.strip(), \"email\": input.email.strip().lower(), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _supplier(dict(row)); _audit(session, current, \"SUPPLIER_CREATED\", \"Supplier created\", {}, payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "update_supplier",
      "start": 229,
      "end": 233,
      "body": "def update_supplier(supplier_id: int, input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"suppliers\", supplier_id, \"SUPPLIER_NOT_FOUND\"); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"archived_at\"] is not None or before[\"branch_id\"] != branch_id: raise auth_error(\"SUPPLIER_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    row = session.execute(text(\"UPDATE suppliers SET name=:name,mobile=:mobile,email=:email,address=:address,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": supplier_id, \"name\": _clean(input.name), \"mobile\": input.mobile.strip(), \"email\": input.email.strip().lower(), \"address\": input.address.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = _supplier(dict(row)); _audit(session, current, \"SUPPLIER_UPDATED\", \"Supplier updated\", _supplier(before), payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "archive_supplier",
      "start": 237,
      "end": 243,
      "body": "def archive_supplier(supplier_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"suppliers\", supplier_id, \"SUPPLIER_NOT_FOUND\")\n    if before[\"archived_at\"] is not None: raise auth_error(\"SUPPLIER_ARCHIVED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    linked = session.execute(text(\"SELECT 1 FROM purchase_orders WHERE supplier_id=:id LIMIT 1\"), {\"id\": supplier_id}).scalar()\n    if linked: raise auth_error(\"SUPPLIER_HAS_PURCHASE_HISTORY\", status.HTTP_409_CONFLICT)\n    row = session.execute(text(\"UPDATE suppliers SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": supplier_id, \"actor_id\": str(current.actor_id), \"reason\": _clean(input.reason)}).mappings().one()\n    payload = _supplier(dict(row)); _audit(session, current, \"SUPPLIER_ARCHIVED\", input.reason.strip(), _supplier(before), payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "list_purchase_orders",
      "start": 247,
      "end": 251,
      "body": "def list_purchase_orders(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM purchase_orders WHERE (:branch_id IS NULL OR branch_id=:branch_id) ORDER BY order_date DESC,id DESC\"), {\"branch_id\": str(branch_id) if branch_id else None}).mappings().all()\n    return [_purchase_with_lines(session, int(row[\"id\"])) for row in rows]"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "create_purchase_order",
      "start": 255,
      "end": 259,
      "body": "def create_purchase_order(input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _supplier_available(session, input.supplier_id, branch_id)\n    row = session.execute(text(\"\"\"INSERT INTO purchase_orders (tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:supplier_id,:po_number,:order_date,'DRAFT',:notes,:actor_id,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"supplier_id\": input.supplier_id, \"po_number\": _clean(input.po_number), \"order_date\": input.order_date, \"notes\": input.notes.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    _replace_lines(session, current, int(row[\"id\"]), branch_id, input.lines); payload = _purchase_with_lines(session, int(row[\"id\"])); _audit(session, current, \"PURCHASE_ORDER_CREATED\", \"Purchase order drafted\", {}, payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "update_purchase_order",
      "start": 263,
      "end": 268,
      "body": "def update_purchase_order(purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"purchase_orders\", purchase_id, \"PURCHASE_ORDER_NOT_FOUND\"); branch_id = _branch(current, input.branch_id or before[\"branch_id\"])\n    if before[\"status\"] != \"DRAFT\" or before[\"branch_id\"] != branch_id: raise auth_error(\"PURCHASE_ORDER_NOT_EDITABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _supplier_available(session, input.supplier_id, branch_id)\n    session.execute(text(\"UPDATE purchase_orders SET supplier_id=:supplier_id,po_number=:po_number,order_date=:order_date,notes=:notes,updated_by=:actor_id,updated_at=now() WHERE id=:id\"), {\"id\": purchase_id, \"supplier_id\": input.supplier_id, \"po_number\": _clean(input.po_number), \"order_date\": input.order_date, \"notes\": input.notes.strip(), \"actor_id\": str(current.actor_id)})\n    _replace_lines(session, current, purchase_id, branch_id, input.lines); payload = _purchase_with_lines(session, purchase_id); _audit(session, current, \"PURCHASE_ORDER_UPDATED\", \"Purchase order draft updated\", _purchase(before), payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "purchase_order_command",
      "start": 272,
      "end": 278,
      "body": "def purchase_order_command(purchase_id: int, command: Literal[\"send\", \"cancel\", \"close\"], input: PurchaseOrderCommand, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, \"purchase_orders\", purchase_id, \"PURCHASE_ORDER_NOT_FOUND\"); transitions = {\"send\": {\"DRAFT\": \"SENT\"}, \"cancel\": {\"DRAFT\": \"CANCELLED\", \"SENT\": \"CANCELLED\", \"PARTIALLY_RECEIVED\": \"CANCELLED\", \"READY_TO_CLOSE\": \"CANCELLED\"}, \"close\": {\"SENT\": \"CLOSED\", \"PARTIALLY_RECEIVED\": \"CLOSED\", \"READY_TO_CLOSE\": \"CLOSED\"}}\n    next_status = transitions[command].get(str(before[\"status\"]))\n    if not next_status: raise auth_error(\"INVALID_PURCHASE_ORDER_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command in {\"cancel\", \"close\"} and not input.reason.strip(): raise auth_error(\"PURCHASE_ORDER_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    session.execute(text(\"UPDATE purchase_orders SET status=:status,updated_by=:actor_id,updated_at=now() WHERE id=:id\"), {\"id\": purchase_id, \"status\": next_status, \"actor_id\": str(current.actor_id)})\n    payload = _purchase_with_lines(session, purchase_id); _audit(session, current, f\"PURCHASE_ORDER_{command.upper()}\", input.reason.strip() or \"Purchase order sent\", _purchase(before), payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "list_stock_inwards",
      "start": 282,
      "end": 286,
      "body": "def list_stock_inwards(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM stock_inwards WHERE (:branch_id IS NULL OR branch_id=:branch_id) ORDER BY received_at DESC,id DESC\"), {\"branch_id\": str(branch_id) if branch_id else None}).mappings().all()\n    return [_inward(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "record_stock_inward",
      "start": 290,
      "end": 305,
      "body": "def record_stock_inward(input: StockInwardInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id)\n    order_id = None\n    if input.purchase_order_line_id is not None:\n        line = _row_or_404(session, \"purchase_order_lines\", input.purchase_order_line_id, \"PURCHASE_ORDER_LINE_NOT_FOUND\")\n        if line[\"branch_id\"] != branch_id or line[\"item_id\"] != input.item_id: raise auth_error(\"PURCHASE_ORDER_LINE_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        order = _row_or_404(session, \"purchase_orders\", int(line[\"purchase_order_id\"]), \"PURCHASE_ORDER_NOT_FOUND\")\n        if order[\"status\"] not in {\"SENT\", \"PARTIALLY_RECEIVED\", \"READY_TO_CLOSE\"}: raise auth_error(\"PURCHASE_ORDER_NOT_RECEIVABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n        order_id = int(order[\"id\"])\n    note = input.note.strip() or \"Stock inward\"\n    inward = session.execute(text(\"\"\"INSERT INTO stock_inwards (tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,qty,unit_cost,note,received_by)\n        VALUES (:tenant_id,:branch_id,:item_id,:purchase_order_id,:line_id,:qty,:unit_cost,:note,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"item_id\": input.item_id, \"purchase_order_id\": order_id, \"line_id\": input.purchase_order_line_id, \"qty\": input.qty, \"unit_cost\": input.unit_cost, \"note\": note, \"actor_id\": str(current.actor_id)}).mappings().one()\n    ledger = session.execute(text(\"\"\"INSERT INTO stock_ledger (tenant_id,branch_id,item_id,inward_id,entry_type,quantity,unit_cost,reason,actor_id)\n        VALUES (:tenant_id,:branch_id,:item_id,:inward_id,'INWARD',:qty,:unit_cost,:reason,:actor_id) RETURNING id\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"item_id\": input.item_id, \"inward_id\": inward[\"id\"], \"qty\": input.qty, \"unit_cost\": input.unit_cost, \"reason\": note, \"actor_id\": str(current.actor_id)}).scalar_one()\n    if order_id is not None: _reconcile_purchase(session, order_id)\n    payload = {**_inward(dict(inward)), \"ledgerId\": ledger}; _audit(session, current, \"STOCK_INWARD_RECORDED\", note, {}, payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "adjust_stock",
      "start": 309,
      "end": 314,
      "body": "def adjust_stock(input: StockAdjustmentInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id); reason = _clean(input.reason)\n    quantity = _adjustment_quantity(input.quantity)\n    row = session.execute(text(\"\"\"INSERT INTO stock_ledger (tenant_id,branch_id,item_id,entry_type,quantity,unit_cost,reason,actor_id)\n        VALUES (:tenant_id,:branch_id,:item_id,'ADJUSTMENT',:quantity,0,:reason,:actor_id) RETURNING *\"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"item_id\": input.item_id, \"quantity\": quantity, \"reason\": reason, \"actor_id\": str(current.actor_id)}).mappings().one()\n    payload = {\"id\": row[\"id\"], \"itemId\": row[\"item_id\"], \"quantity\": float(row[\"quantity\"]), \"reason\": row[\"reason\"], \"entryType\": row[\"entry_type\"], \"createdAt\": row[\"created_at\"]}; _audit(session, current, \"STOCK_ADJUSTED\", reason, {}, payload); return payload"
    },
    {
      "file": "backend/app/inventory.py",
      "name": "list_stock_ledger",
      "start": 318,
      "end": 322,
      "body": "def list_stock_ledger(scope: ScopedTenant, item_id: int | None = Query(default=None, alias=\"itemId\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope; _permission(scope, mutation=False)\n    if branch_id is not None: _branch(current, branch_id)\n    rows = session.execute(text(\"SELECT * FROM stock_ledger WHERE (:branch_id IS NULL OR branch_id=:branch_id) AND (:item_id IS NULL OR item_id=:item_id) ORDER BY created_at DESC,id DESC\"), {\"branch_id\": str(branch_id) if branch_id else None, \"item_id\": item_id}).mappings().all()\n    return [{\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"itemId\": row[\"item_id\"], \"inwardId\": row[\"inward_id\"], \"entryType\": row[\"entry_type\"], \"quantity\": float(row[\"quantity\"]), \"unitCost\": float(row[\"unit_cost\"]), \"reason\": row[\"reason\"], \"actorId\": str(row[\"actor_id\"]), \"createdAt\": row[\"created_at\"]} for row in rows]"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_permission",
      "start": 82,
      "end": 87,
      "body": "def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(\n        scope,\n        (\"page.job-card.write\" if mutation else \"page.job-card.read\", \"page.estimate.write\" if mutation else \"page.estimate.read\", \"page.my-queue.write\" if mutation else \"page.my-queue.read\", \"page.jobs.write\" if mutation else \"page.jobs.read\"),\n        mutation=mutation,\n    )"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_row_or_404",
      "start": 90,
      "end": 94,
      "body": "def _row_or_404(session, table: str, record_id: int, code: str) -> dict[str, object]:\n    row = session.execute(text(f\"SELECT * FROM {table} WHERE id = :id\"), {\"id\": record_id}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(code, status.HTTP_404_NOT_FOUND)\n    return dict(row)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_job",
      "start": 97,
      "end": 106,
      "body": "def _job(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"jobNo\": row[\"job_no\"], \"visitId\": row[\"visit_id\"],\n        \"branchId\": str(row[\"branch_id\"]), \"advisorId\": str(row[\"advisor_id\"]) if row[\"advisor_id\"] else None,\n        \"departmentId\": str(row[\"department_id\"]) if row.get(\"department_id\") else None,\n        \"responsibleManagerId\": str(row[\"responsible_manager_id\"]) if row.get(\"responsible_manager_id\") else None,\n        \"assignmentState\": row.get(\"assignment_state\") or \"LEGACY\",\n        \"status\": row[\"status\"], \"workList\": row[\"work_list\"], \"promisedAt\": row[\"promised_at\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_estimate",
      "start": 109,
      "end": 116,
      "body": "def _estimate(row: dict[str, object], lines: list[dict[str, object]] | None = None) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"revision\": row[\"revision\"], \"status\": row[\"status\"],\n        \"discount\": float(row[\"discount\"]), \"gstRate\": float(row[\"gst_rate\"]), \"note\": row[\"note\"],\n        \"supersededAt\": row[\"superseded_at\"], \"approvedSnapshot\": row[\"approved_snapshot\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n        **({\"lines\": lines} if lines is not None else {}),\n    }"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_line",
      "start": 119,
      "end": 120,
      "body": "def _line(row: dict[str, object]) -> dict[str, object]:\n    return {\"id\": row[\"id\"], \"kind\": row[\"kind\"], \"description\": row[\"description\"], \"quantity\": float(row[\"quantity\"]), \"rate\": float(row[\"rate\"]), \"gstRate\": float(row[\"gst_rate\"])}"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_estimate_with_lines",
      "start": 123,
      "end": 129,
      "body": "def _estimate_with_lines(session, estimate_id: int) -> dict[str, object]:\n    estimate = _row_or_404(session, \"estimates\", estimate_id, \"ESTIMATE_NOT_FOUND\")\n    lines = [\n        _line(dict(row))\n        for row in session.execute(text(\"SELECT * FROM estimate_lines WHERE estimate_id=:estimate_id ORDER BY line_no, id\"), {\"estimate_id\": estimate_id}).mappings().all()\n    ]\n    return _estimate(estimate, lines)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_job_with_estimates",
      "start": 132,
      "end": 152,
      "body": "def _job_with_estimates(session, job_id: int) -> dict[str, object]:\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    estimates = [_estimate_with_lines(session, int(row[\"id\"])) for row in session.execute(text(\"SELECT id FROM estimates WHERE job_card_id=:job_id ORDER BY revision\"), {\"job_id\": job_id}).mappings().all()]\n    events = [\n        {\"id\": row[\"id\"], \"command\": row[\"command\"], \"fromStatus\": row[\"from_status\"], \"toStatus\": row[\"to_status\"], \"reason\": row[\"reason\"], \"requestKey\": row[\"request_key\"], \"at\": row[\"created_at\"]}\n        for row in session.execute(text(\"SELECT * FROM job_events WHERE job_card_id=:job_id ORDER BY id\"), {\"job_id\": job_id}).mappings().all()\n    ]\n    history = [{\n        \"id\": row[\"id\"], \"action\": row[\"action\"], \"reason\": row[\"reason\"], \"at\": row[\"created_at\"],\n        \"actorId\": str(row[\"actor_id\"]), \"departmentId\": str(row[\"department_id\"]) if row[\"department_id\"] else None,\n        \"departmentName\": row[\"department_name\"], \"managerId\": str(row[\"manager_id\"]) if row[\"manager_id\"] else None,\n        \"managerName\": row[\"manager_name\"], \"advisorId\": str(row[\"advisor_id\"]) if row[\"advisor_id\"] else None,\n        \"advisorName\": row[\"advisor_name\"],\n    } for row in session.execute(text(\"SELECT * FROM job_assignment_history WHERE job_card_id=:job_id ORDER BY id\"), {\"job_id\": job_id}).mappings().all()]\n    department = session.execute(text(\"SELECT name FROM service_departments WHERE id=:id\"), {\"id\": str(job[\"department_id\"])}).scalar() if job.get(\"department_id\") else None\n    manager = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(job[\"responsible_manager_id\"])}).scalar() if job.get(\"responsible_manager_id\") else None\n    advisor = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(job[\"advisor_id\"])}).scalar() if job.get(\"advisor_id\") else None\n    return {**_job(job), \"department\": {\"id\": str(job[\"department_id\"]), \"name\": department} if job.get(\"department_id\") else None,\n            \"responsibleManager\": {\"id\": str(job[\"responsible_manager_id\"]), \"name\": manager} if job.get(\"responsible_manager_id\") else None,\n            \"advisor\": {\"id\": str(job[\"advisor_id\"]), \"name\": advisor} if job.get(\"advisor_id\") else None,\n            \"assignmentHistory\": history, \"estimates\": estimates, \"events\": events}"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_assert_job_actor",
      "start": 155,
      "end": 163,
      "body": "def _assert_job_actor(current: TenantScope, job: dict[str, object]) -> None:\n    \"\"\"Tenant Admin has all granted page authority; advisors own assigned jobs.\"\"\"\n    if any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        return\n    if job.get(\"responsible_manager_id\") is not None and str(job[\"responsible_manager_id\"]) == str(current.actor_id):\n        return\n    if job[\"advisor_id\"] is not None and str(job[\"advisor_id\"]) == str(current.actor_id):\n        return\n    raise auth_error(\"JOB_ASSIGNMENT_REQUIRED\", status.HTTP_403_FORBIDDEN)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_assert_active_advisor",
      "start": 166,
      "end": 175,
      "body": "def _assert_active_advisor(session, current: TenantScope, branch_id: UUID, advisor_id: UUID) -> None:\n    \"\"\"An assignment is only valid for an active member of this Tenant/Branch.\"\"\"\n    advisor = session.execute(text(\"\"\"\n        SELECT 1 FROM tenant_memberships AS membership\n        JOIN membership_branches AS assigned ON assigned.membership_id=membership.id\n        WHERE membership.tenant_id=:tenant_id AND membership.user_id=:advisor_id\n          AND membership.status='ACTIVE' AND assigned.branch_id=:branch_id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"advisor_id\": str(advisor_id), \"branch_id\": str(branch_id)}).scalar()\n    if not advisor:\n        raise auth_error(\"ADVISOR_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_routing",
      "start": 178,
      "end": 194,
      "body": "def _routing(session, current: TenantScope, branch_id: UUID, department_id: UUID, manager_id: UUID) -> dict[str, object]:\n    \"\"\"Resolve an active appointed manager; never trust IDs supplied by the browser.\"\"\"\n    row = session.execute(text(\"\"\"\n        SELECT d.id, d.name, manager.id AS manager_membership_id, manager.user_id AS manager_id, user_row.display_name AS manager_name\n        FROM service_departments d\n        JOIN service_department_managers dm ON dm.department_id=d.id\n        JOIN tenant_memberships manager ON manager.id=dm.manager_membership_id AND manager.status='ACTIVE'\n        JOIN membership_branches mb ON mb.membership_id=manager.id AND mb.branch_id=d.branch_id\n        JOIN membership_roles mr ON mr.membership_id=manager.id AND mr.tenant_id=manager.tenant_id\n        JOIN tenant_roles role ON role.id=mr.role_id AND role.system_key='service_manager' AND role.status='ACTIVE'\n        JOIN platform_users user_row ON user_row.id=manager.user_id\n        WHERE d.id=:department_id AND d.tenant_id=:tenant_id AND d.branch_id=:branch_id AND d.status='ACTIVE'\n          AND manager.user_id=:manager_id\n    \"\"\"), {\"department_id\": str(department_id), \"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"manager_id\": str(manager_id)}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"MANAGER_NOT_ELIGIBLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return dict(row)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_record_assignment",
      "start": 197,
      "end": 204,
      "body": "def _record_assignment(session, current: TenantScope, job_id: int, branch_id: object, department_id: object | None, manager_id: object | None, advisor_id: object | None, action: str, reason: str) -> None:\n    department_name = session.execute(text(\"SELECT name FROM service_departments WHERE id=:id\"), {\"id\": str(department_id)}).scalar() if department_id else None\n    manager_name = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(manager_id)}).scalar() if manager_id else None\n    advisor_name = session.execute(text(\"SELECT display_name FROM platform_users WHERE id=:id\"), {\"id\": str(advisor_id)}).scalar() if advisor_id else None\n    session.execute(text(\"\"\"\n        INSERT INTO job_assignment_history (tenant_id,branch_id,job_card_id,department_id,department_name,manager_id,manager_name,advisor_id,advisor_name,actor_id,action,reason)\n        VALUES (:tenant_id,:branch_id,:job_id,:department_id,:department_name,:manager_id,:manager_name,:advisor_id,:advisor_name,:actor_id,:action,:reason)\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"job_id\": job_id, \"department_id\": str(department_id) if department_id else None, \"department_name\": department_name, \"manager_id\": str(manager_id) if manager_id else None, \"manager_name\": manager_name, \"advisor_id\": str(advisor_id) if advisor_id else None, \"advisor_name\": advisor_name, \"actor_id\": str(current.actor_id), \"action\": action, \"reason\": reason})"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_branch_requires_approval",
      "start": 207,
      "end": 210,
      "body": "def _branch_requires_approval(session, branch_id: object) -> bool:\n    row = session.execute(text(\"SELECT settings FROM branch_settings WHERE branch_id=:branch_id\"), {\"branch_id\": str(branch_id)}).mappings().one_or_none()\n    settings = dict(row[\"settings\"]) if row and row[\"settings\"] else {}\n    return bool(settings.get(\"requireEstimateApproval\", False))"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "list_jobs",
      "start": 214,
      "end": 225,
      "body": "def list_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    is_owner = any(name == \"Owner/Admin\" for _, name, _ in current.roles)\n    rows = session.execute(text(\"\"\"\n        SELECT * FROM job_cards WHERE (:branch_id IS NULL OR branch_id=:branch_id)\n          AND (:is_owner OR responsible_manager_id=:actor_id OR advisor_id=:actor_id)\n        ORDER BY created_at DESC, id DESC\n    \"\"\"), {\"branch_id\": str(branch_id) if branch_id else None, \"is_owner\": is_owner, \"actor_id\": str(current.actor_id)}).mappings().all()\n    return [_job_with_estimates(session, int(row[\"id\"])) for row in rows]"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "get_job",
      "start": 229,
      "end": 234,
      "body": "def get_job(job_id: int, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=False)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    return _job_with_estimates(session, job_id)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "create_job",
      "start": 238,
      "end": 259,
      "body": "def create_job(input: JobCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_permission(scope, mutation=True), input.branch_id)\n    visit = _row_or_404(session, \"visits\", input.visit_id, \"VISIT_NOT_FOUND\")\n    if visit[\"branch_id\"] != branch_id or visit[\"archived_at\"] is not None:\n        raise auth_error(\"VISIT_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    existing = session.execute(text(\"SELECT id FROM job_cards WHERE visit_id=:visit_id\"), {\"visit_id\": input.visit_id}).mappings().one_or_none()\n    if existing:\n        raise auth_error(\"VISIT_ALREADY_HAS_JOB\", status.HTTP_409_CONFLICT)\n    _routing(session, current, branch_id, input.department_id, input.responsible_manager_id)\n    row = session.execute(text(\"\"\"\n        INSERT INTO job_cards (tenant_id, branch_id, job_no, visit_id, department_id, responsible_manager_id, assignment_state, status, work_list, promised_at, created_by, updated_by)\n        VALUES (:tenant_id,:branch_id,'PENDING',:visit_id,:department_id,:manager_id,'AWAITING_ADVISOR_ASSIGNMENT','NEW',:work_list,:promised_at,:actor_id,:actor_id)\n        RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"visit_id\": input.visit_id,\n             \"department_id\": str(input.department_id), \"manager_id\": str(input.responsible_manager_id), \"work_list\": input.work_list.strip(),\n             \"promised_at\": input.promised_at, \"actor_id\": str(current.actor_id)}).mappings().one()\n    row = session.execute(text(\"UPDATE job_cards SET job_no=:job_no, updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": row[\"id\"], \"job_no\": f\"JC-{int(row['id']):06d}\"}).mappings().one()\n    _record_assignment(session, current, int(row[\"id\"]), branch_id, input.department_id, input.responsible_manager_id, None, \"ROUTED_TO_MANAGER\", \"Awaiting advisor assignment\")\n    payload = _job_with_estimates(session, int(row[\"id\"]))\n    _audit(session, current, \"JOB_CREATED\", \"Job created from visit\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "assign_job_advisor",
      "start": 263,
      "end": 296,
      "body": "def assign_job_advisor(job_id: int, input: AdvisorAssignment, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if job.get(\"responsible_manager_id\") is None or job.get(\"department_id\") is None:\n        raise auth_error(\"JOB_ROUTING_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    # Only the responsible manager may delegate. Owners have transfer power,\n    # but cannot bypass a manager's branch-local advisor team.\n    if str(job[\"responsible_manager_id\"]) != str(current.actor_id):\n        raise auth_error(\"MANAGER_ASSIGNMENT_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    advisor = session.execute(text(\"\"\"\n        SELECT advisor.user_id FROM service_advisor_teams team\n        JOIN tenant_memberships advisor ON advisor.id=team.advisor_membership_id AND advisor.status='ACTIVE'\n        JOIN membership_branches mb ON mb.membership_id=advisor.id AND mb.branch_id=team.branch_id\n        JOIN membership_roles mr ON mr.membership_id=advisor.id AND mr.tenant_id=advisor.tenant_id\n        JOIN tenant_roles role ON role.id=mr.role_id AND role.system_key='service' AND role.status='ACTIVE'\n        WHERE team.tenant_id=:tenant_id AND team.branch_id=:branch_id AND team.department_id=:department_id\n          AND team.manager_membership_id=(SELECT id FROM tenant_memberships WHERE tenant_id=:tenant_id AND user_id=:manager_id)\n          AND advisor.user_id=:advisor_id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"department_id\": str(job[\"department_id\"]), \"manager_id\": str(current.actor_id), \"advisor_id\": str(input.advisor_id)}).scalar()\n    if not advisor:\n        raise auth_error(\"ADVISOR_NOT_IN_MANAGER_TEAM\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = _job(job)\n    row = session.execute(text(\"\"\"\n        UPDATE job_cards SET advisor_id=:advisor_id, assignment_state='ASSIGNED_TO_ADVISOR', updated_by=:actor_id, updated_at=now()\n        WHERE id=:job_id RETURNING *\n    \"\"\"), {\"advisor_id\": str(input.advisor_id), \"actor_id\": str(current.actor_id), \"job_id\": job_id}).mappings().one()\n    _record_assignment(session, current, job_id, job[\"branch_id\"], job[\"department_id\"], job[\"responsible_manager_id\"], input.advisor_id, \"ADVISOR_ASSIGNED\", input.reason.strip() or \"Advisor delegated by manager\")\n    payload = _job_with_estimates(session, job_id)\n    _audit(session, current, \"JOB_ADVISOR_ASSIGNED\", input.reason.strip() or \"Advisor delegated by manager\", before, payload)\n    return payload"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "transfer_job_manager",
      "start": 300,
      "end": 319,
      "body": "def transfer_job_manager(job_id: int, input: ManagerTransfer, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    if not any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        raise auth_error(\"MANAGER_TRANSFER_FORBIDDEN\", status.HTTP_403_FORBIDDEN)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if str(input.department_id) == str(job.get(\"department_id\")) and str(input.responsible_manager_id) == str(job.get(\"responsible_manager_id\")):\n        raise auth_error(\"MANAGER_TRANSFER_UNCHANGED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _routing(session, current, UUID(str(job[\"branch_id\"])), input.department_id, input.responsible_manager_id)\n    before = _job(job)\n    session.execute(text(\"\"\"\n        UPDATE job_cards SET department_id=:department_id, responsible_manager_id=:manager_id, advisor_id=NULL,\n          assignment_state='AWAITING_ADVISOR_ASSIGNMENT', updated_by=:actor_id, updated_at=now() WHERE id=:job_id\n    \"\"\"), {\"department_id\": str(input.department_id), \"manager_id\": str(input.responsible_manager_id), \"actor_id\": str(current.actor_id), \"job_id\": job_id})\n    _record_assignment(session, current, job_id, job[\"branch_id\"], input.department_id, input.responsible_manager_id, None, \"MANAGER_TRANSFERRED\", input.reason.strip() or \"Transferred by administrator\")\n    payload = _job_with_estimates(session, job_id)\n    _audit(session, current, \"JOB_MANAGER_TRANSFERRED\", input.reason.strip() or \"Transferred by administrator\", before, payload)\n    return payload"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "create_estimate",
      "start": 323,
      "end": 349,
      "body": "def create_estimate(job_id: int, input: EstimateCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    previous = session.execute(text(\"SELECT * FROM estimates WHERE job_card_id=:job_id AND superseded_at IS NULL ORDER BY revision DESC LIMIT 1\"), {\"job_id\": job_id}).mappings().one_or_none()\n    revision = int(previous[\"revision\"]) + 1 if previous else 1\n    if previous and previous[\"status\"] == \"DRAFT\":\n        raise auth_error(\"ESTIMATE_DRAFT_EXISTS\", status.HTTP_409_CONFLICT)\n    if previous:\n        session.execute(text(\"UPDATE estimates SET superseded_at=now(), superseded_by=:actor_id, updated_at=now() WHERE id=:id\"), {\"id\": previous[\"id\"], \"actor_id\": str(current.actor_id)})\n    estimate = session.execute(text(\"\"\"\n        INSERT INTO estimates (tenant_id,branch_id,job_card_id,revision,status,discount,gst_rate,note,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:revision,'DRAFT',:discount,:gst_rate,:note,:actor_id,:actor_id) RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"revision\": revision,\n             \"discount\": input.discount, \"gst_rate\": input.gst_rate, \"note\": input.note.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    for index, line in enumerate(input.lines, start=1):\n        session.execute(text(\"\"\"\n            INSERT INTO estimate_lines (tenant_id,branch_id,estimate_id,line_no,kind,description,quantity,rate,gst_rate)\n            VALUES (:tenant_id,:branch_id,:estimate_id,:line_no,:kind,:description,:quantity,:rate,:gst_rate)\n        \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"estimate_id\": estimate[\"id\"], \"line_no\": index,\n                 \"kind\": _clean(line.kind), \"description\": _clean(line.description), \"quantity\": line.quantity, \"rate\": line.rate, \"gst_rate\": line.gst_rate})\n    payload = _estimate_with_lines(session, int(estimate[\"id\"]))\n    _audit(session, current, \"ESTIMATE_CREATED\", f\"Estimate revision {revision} drafted\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "record_estimate_decision",
      "start": 353,
      "end": 377,
      "body": "def record_estimate_decision(estimate_id: int, input: EstimateDecision, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    estimate = _row_or_404(session, \"estimates\", estimate_id, \"ESTIMATE_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(estimate[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if estimate[\"status\"] != \"DRAFT\" or estimate[\"superseded_at\"] is not None:\n        raise auth_error(\"ESTIMATE_DECISION_NOT_ALLOWED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    payload_before = _estimate_with_lines(session, estimate_id)\n    snapshot = json.dumps(payload_before, default=str)\n    outcome_status = \"APPROVED\" if input.outcome == \"approved\" else \"DECLINED\"\n    row = session.execute(text(\"\"\"\n        UPDATE estimates SET status=:status, approved_snapshot=CASE WHEN :status='APPROVED' THEN CAST(:snapshot AS jsonb) ELSE NULL END,\n          updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\n    \"\"\"), {\"id\": estimate_id, \"status\": outcome_status, \"snapshot\": snapshot, \"actor_id\": str(current.actor_id)}).mappings().one()\n    decision = session.execute(text(\"\"\"\n        INSERT INTO estimate_decisions (tenant_id,branch_id,estimate_id,job_card_id,outcome,channel,decided_at,actor_id,note)\n        VALUES (:tenant_id,:branch_id,:estimate_id,:job_id,:outcome,:channel,:decided_at,:actor_id,:note) RETURNING *\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"estimate_id\": estimate_id, \"job_id\": job[\"id\"],\n             \"outcome\": input.outcome, \"channel\": input.channel, \"decided_at\": input.decided_at, \"actor_id\": str(current.actor_id), \"note\": input.note.strip()}).mappings().one()\n    payload = _estimate_with_lines(session, int(row[\"id\"]))\n    _audit(session, current, \"ESTIMATE_DECISION_RECORDED\", f\"{input.outcome} via {input.channel}\", payload_before, {\"estimate\": payload, \"decision\": dict(decision)})\n    return {\"estimate\": payload, \"decision\": {\"id\": decision[\"id\"], \"outcome\": decision[\"outcome\"], \"channel\": decision[\"channel\"], \"decidedAt\": decision[\"decided_at\"], \"actorId\": str(decision[\"actor_id\"]), \"note\": decision[\"note\"]}}"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "_completion_prerequisites",
      "start": 390,
      "end": 441,
      "body": "def _completion_prerequisites(session, job_id: int) -> tuple[str, ...]:\n    \"\"\"Return authoritative blockers for the final operational transition.\n\n    The Estimate slice owns the first assertion now.  Material issuance, work\n    evidence, QC and invoice records are deliberately not browser-provided\n    flags: their command slices (#65--#68) must write those facts before this\n    transition may be enabled.  Until then the command is safely fail-closed.\n    \"\"\"\n    blockers: list[str] = []\n    approved = session.execute(text(\"\"\"\n        SELECT 1 FROM estimates\n        WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if not approved:\n        blockers.append(\"ESTIMATE_APPROVAL_REQUIRED\")\n    # Work and QC are persisted by the technician execution slice.  Completion\n    # deliberately queries those facts here instead of accepting client flags.\n    work_evidence = session.execute(text(\"SELECT 1 FROM work_updates WHERE job_card_id=:job_id LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    if not work_evidence:\n        blockers.append(\"WORK_EVIDENCE_REQUIRED\")\n    unfinished_tasks = session.execute(text(\"\"\"\n        SELECT 1 FROM technician_tasks\n        WHERE job_card_id=:job_id AND status NOT IN ('COMPLETED','CANCELLED') LIMIT 1\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if unfinished_tasks:\n        blockers.append(\"TECHNICIAN_TASKS_UNRESOLVED\")\n    required_qc = session.execute(text(\"SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    failed_qc = session.execute(text(\"SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required AND status='FAILED' LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    pending_qc = session.execute(text(\"SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required AND status<>'PASSED' LIMIT 1\"), {\"job_id\": job_id}).scalar()\n    if not required_qc or pending_qc:\n        blockers.append(\"QC_REQUIRED\" if not failed_qc else \"QC_REWORK_REQUIRED\")\n    # Materials are resolved only when each reservation has reached its\n    # database-derived final state. The invoice check intentionally queries\n    # the immutable issued-document path rather than a browser status flag.\n    unresolved_materials = session.execute(text(\"\"\"\n        SELECT 1 FROM material_reservations\n        WHERE job_card_id=:job_id AND status NOT IN ('ISSUED','RELEASED') LIMIT 1\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if unresolved_materials:\n        blockers.append(\"MATERIALS_UNRESOLVED\")\n    issued_invoice = session.execute(text(\"\"\"\n        SELECT 1 FROM invoices invoice\n        WHERE invoice.job_card_id=:job_id\n          AND NOT EXISTS (\n              SELECT 1 FROM financial_document_events event\n              WHERE event.document_id=invoice.issued_document_id AND event.event_type='VOID'\n          )\n        LIMIT 1\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if not issued_invoice:\n        blockers.append(\"INVOICE_REQUIRED\")\n    return tuple(blockers)"
    },
    {
      "file": "backend/app/jobs.py",
      "name": "command_job",
      "start": 445,
      "end": 479,
      "body": "def command_job(\n    job_id: int,\n    command: Literal[\"start-work\", \"hold-job\", \"resume-work\", \"cancel-job\", \"start-rework\", \"complete-work\"],\n    input: JobCommand,\n    scope: ScopedTenant,\n    request_key: Annotated[str | None, Header(alias=\"Idempotency-Key\")] = None,\n) -> dict[str, object]:\n    session, current = scope\n    _permission(scope, mutation=True)\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    _assert_job_actor(current, job)\n    if request_key and session.execute(text(\"SELECT 1 FROM job_events WHERE job_card_id=:job_id AND request_key=:request_key\"), {\"job_id\": job_id, \"request_key\": request_key.strip()}).scalar():\n        return _job(_row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\"))\n    allowed, target, reason_required = _COMMANDS[command]\n    reason = input.reason.strip()\n    if reason_required and not reason:\n        raise auth_error(\"COMMAND_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if job[\"status\"] not in allowed:\n        raise auth_error(\"INVALID_JOB_TRANSITION\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command == \"start-work\" and _branch_requires_approval(session, job[\"branch_id\"]):\n        approved = session.execute(text(\"SELECT 1 FROM estimates WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\"), {\"job_id\": job_id}).scalar()\n        if not approved:\n            raise auth_error(\"ESTIMATE_APPROVAL_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command == \"complete-work\" and _completion_prerequisites(session, job_id):\n        raise auth_error(\"COMPLETION_PREREQUISITES_UNMET\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = _job(job)\n    row = session.execute(text(\"UPDATE job_cards SET status=:status, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *\"), {\"id\": job_id, \"status\": target, \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"\"\"\n        INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,request_key,actor_id)\n        VALUES (:tenant_id,:branch_id,:job_id,:command,:from_status,:to_status,:reason,:request_key,:actor_id)\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(job[\"branch_id\"]), \"job_id\": job_id, \"command\": command,\n             \"from_status\": job[\"status\"], \"to_status\": target, \"reason\": reason, \"request_key\": request_key.strip() if request_key else None, \"actor_id\": str(current.actor_id)})\n    payload = _job(dict(row))\n    _audit(session, current, \"JOB_COMMAND\", f\"{command}: {reason or 'No reason required'}\", before, payload)\n    return payload"
    },
    {
      "file": "backend/app/main.py",
      "name": "workshop_http_error",
      "start": 41,
      "end": 45,
      "body": "def workshop_http_error(_, error: HTTPException) -> JSONResponse:\n    \"\"\"Keep stable domain error codes at the JSON top level for the React client.\"\"\"\n    if isinstance(error.detail, dict) and \"code\" in error.detail:\n        return JSONResponse(status_code=error.status_code, content=error.detail, headers=error.headers)\n    return JSONResponse(status_code=error.status_code, content={\"detail\": error.detail}, headers=error.headers)"
    },
    {
      "file": "backend/app/main.py",
      "name": "require_permission",
      "start": 52,
      "end": 57,
      "body": "def require_permission(scope: ScopedTenant, permission: str) -> None:\n    _, current = scope\n    if current.actor_type == \"support_emulation\" and permission.endswith(\".read\"):\n        return\n    if permission not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)"
    },
    {
      "file": "backend/app/main.py",
      "name": "require_tenant_mutation",
      "start": 60,
      "end": 65,
      "body": "def require_tenant_mutation(scope: ScopedTenant) -> None:\n    _, current = scope\n    try:\n        require_mutation_allowed(current)\n    except PermissionError as error:\n        raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error"
    },
    {
      "file": "backend/app/main.py",
      "name": "health",
      "start": 69,
      "end": 78,
      "body": "def health(session: Session = Depends(get_session)) -> dict[str, str]:\n    \"\"\"Report readiness only after PostgreSQL accepts a query.\"\"\"\n    try:\n        session.execute(text(\"SELECT 1\"))\n    except SQLAlchemyError as error:\n        raise HTTPException(\n            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,\n            detail=\"database_unavailable\",\n        ) from error\n    return {\"status\": \"ok\", \"database\": \"postgresql\", \"environment\": get_settings().environment}"
    },
    {
      "file": "backend/app/main.py",
      "name": "api_health",
      "start": 82,
      "end": 84,
      "body": "def api_health(session: Session = Depends(get_session)) -> dict[str, str]:\n    \"\"\"Versioned API health endpoint used by integration clients.\"\"\"\n    return health(session)"
    },
    {
      "file": "backend/app/main.py",
      "name": "auth_config",
      "start": 88,
      "end": 114,
      "body": "def auth_config() -> dict[str, object]:\n    \"\"\"Expose only browser-safe sign-in configuration, never authorization scope.\"\"\"\n    settings = get_settings()\n    if settings.auth_mode == \"local\":\n        if not settings.demo_auth_enabled:\n            raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n        return {\"mode\": \"local\", \"allowDemo\": True}\n    required = (\n        settings.cognito_client_id,\n        settings.cognito_authorization_endpoint,\n        settings.cognito_token_endpoint,\n        settings.cognito_logout_endpoint,\n        settings.cognito_callback_uri,\n        settings.cognito_logout_uri,\n    )\n    if not all(required):\n        raise auth_error(\"AUTH_CONFIGURATION_INVALID\", status.HTTP_503_SERVICE_UNAVAILABLE)\n    return {\n        \"mode\": \"cognito\",\n        \"clientId\": settings.cognito_client_id,\n        \"authorizationEndpoint\": str(settings.cognito_authorization_endpoint),\n        \"tokenEndpoint\": str(settings.cognito_token_endpoint),\n        \"logoutEndpoint\": str(settings.cognito_logout_endpoint),\n        \"callbackUri\": str(settings.cognito_callback_uri),\n        \"logoutUri\": str(settings.cognito_logout_uri),\n        \"scopes\": [\"openid\", \"email\"],\n    }"
    },
    {
      "file": "backend/app/main.py",
      "name": "session",
      "start": 118,
      "end": 121,
      "body": "def session(scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Return the server-resolved Tenant session used by the existing Cognito UI.\"\"\"\n    _, current = scope\n    return session_payload(current)"
    },
    {
      "file": "backend/app/main.py",
      "name": "read_tenant_settings",
      "start": 125,
      "end": 133,
      "body": "def read_tenant_settings(scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"A first Tenant-owned read proves that RLS is part of the API boundary.\"\"\"\n    session, current = scope\n    require_permission(scope, \"tenant.settings.read\")\n    row = session.execute(\n        text(\"SELECT settings, updated_at FROM tenant_settings WHERE tenant_id = :tenant_id\"),\n        {\"tenant_id\": str(current.tenant_id)},\n    ).mappings().one_or_none()\n    return {\"settings\": dict(row[\"settings\"]) if row else {}, \"updatedAt\": row[\"updated_at\"].isoformat() if row else None}"
    },
    {
      "file": "backend/app/main.py",
      "name": "write_tenant_settings",
      "start": 137,
      "end": 154,
      "body": "def write_tenant_settings(input: SettingsUpdate, scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Write through the trusted Tenant context; caller-supplied tenant ids do not exist here.\"\"\"\n    session, current = scope\n    require_permission(scope, \"tenant.settings.write\")\n    require_tenant_mutation(scope)\n    row = session.execute(\n        text(\n            \"\"\"\n            INSERT INTO tenant_settings (tenant_id, settings, updated_by)\n            VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)\n            ON CONFLICT (tenant_id) DO UPDATE\n            SET settings = EXCLUDED.settings, updated_by = EXCLUDED.updated_by, updated_at = now()\n            RETURNING settings, updated_at\n            \"\"\"\n        ),\n        {\"tenant_id\": str(current.tenant_id), \"settings\": __import__(\"json\").dumps(input.settings), \"actor_id\": str(current.actor_id)},\n    ).mappings().one()\n    return {\"settings\": dict(row[\"settings\"]), \"updatedAt\": row[\"updated_at\"].isoformat()}"
    },
    {
      "file": "backend/app/main.py",
      "name": "read_branch_settings",
      "start": 158,
      "end": 170,
      "body": "def read_branch_settings(branch_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    \"\"\"Branch paths are narrowed against the server membership before querying RLS data.\"\"\"\n    session, current = scope\n    require_permission(scope, \"branch.settings.read\")\n    try:\n        require_branch(current, branch_id)\n    except PermissionError as error:\n        raise auth_error(\"BRANCH_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN) from error\n    row = session.execute(\n        text(\"SELECT settings, updated_at FROM branch_settings WHERE tenant_id = :tenant_id AND branch_id = :branch_id\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id)},\n    ).mappings().one_or_none()\n    return {\"settings\": dict(row[\"settings\"]) if row else {}, \"updatedAt\": row[\"updated_at\"].isoformat() if row else None}"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_request_permission",
      "start": 47,
      "end": 52,
      "body": "def _request_permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (\n        \"page.material-requests.write\" if mutation else \"page.material-requests.read\",\n        \"page.job-card.write\" if mutation else \"page.job-card.read\",\n        \"page.my-queue.write\" if mutation else \"page.my-queue.read\",\n    ), mutation=mutation)"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_store_permission",
      "start": 55,
      "end": 60,
      "body": "def _store_permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:\n    return _require_any(scope, (\n        \"page.issue-material.write\" if mutation else \"page.issue-material.read\",\n        \"page.reconcile.write\" if mutation else \"page.reconcile.read\",\n        \"page.stock.write\" if mutation else \"page.stock.read\",\n    ), mutation=mutation)"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_reservation",
      "start": 63,
      "end": 75,
      "body": "def _reservation(row: dict[str, object], totals: dict[str, float]) -> dict[str, object]:\n    reserved = float(row[\"reserved_qty\"])\n    issued = totals[\"issued\"]\n    released = totals[\"released\"]\n    return {\n        \"id\": row[\"id\"], \"jobId\": row[\"job_card_id\"], \"itemId\": row[\"item_id\"], \"branchId\": str(row[\"branch_id\"]),\n        \"reservedQty\": reserved, \"status\": row[\"status\"], \"note\": row[\"note\"],\n        \"issuedQty\": issued, \"returnedQty\": totals[\"returned\"], \"wastedQty\": totals[\"wasted\"],\n        \"releasedQty\": released, \"reversedQty\": totals[\"reversed\"],\n        \"availableToIssue\": max(0.0, reserved - issued - released),\n        \"onJobQty\": max(0.0, issued - totals[\"returned\"] - totals[\"wasted\"] - totals[\"reversed\"]),\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_totals",
      "start": 78,
      "end": 87,
      "body": "def _totals(session, reservation_id: int) -> dict[str, float]:\n    row = session.execute(text(\"\"\"\n        SELECT COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE'),0) issued,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='RETURN'),0) returned,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='WASTE'),0) wasted,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='RELEASE'),0) released,\n               COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE_REVERSAL'),0) reversed\n        FROM material_ledger WHERE reservation_id=:reservation_id\n    \"\"\"), {\"reservation_id\": reservation_id}).mappings().one()\n    return {name: float(row[name]) for name in (\"issued\", \"returned\", \"wasted\", \"released\", \"reversed\")}"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_reservation_with_totals",
      "start": 90,
      "end": 92,
      "body": "def _reservation_with_totals(session, reservation_id: int) -> dict[str, object]:\n    row = _row_or_404(session, \"material_reservations\", reservation_id, \"MATERIAL_RESERVATION_NOT_FOUND\")\n    return _reservation(row, _totals(session, reservation_id))"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_event",
      "start": 95,
      "end": 100,
      "body": "def _event(row: dict[str, object]) -> dict[str, object]:\n    return {\n        \"id\": row[\"id\"], \"reservationId\": row[\"reservation_id\"], \"jobId\": row[\"job_card_id\"], \"itemId\": row[\"item_id\"],\n        \"branchId\": str(row[\"branch_id\"]), \"entryType\": row[\"entry_type\"], \"quantity\": float(row[\"quantity\"]),\n        \"reason\": row[\"reason\"], \"actorId\": str(row[\"actor_id\"]), \"createdAt\": row[\"created_at\"],\n    }"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_approved_job",
      "start": 103,
      "end": 112,
      "body": "def _approved_job(session, job_id: int) -> dict[str, object]:\n    job = _row_or_404(session, \"job_cards\", job_id, \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    approved = session.execute(text(\"\"\"\n        SELECT 1 FROM estimates WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL\n    \"\"\"), {\"job_id\": job_id}).scalar()\n    if not approved:\n        raise auth_error(\"MATERIAL_RESERVATION_REQUIRES_APPROVED_ESTIMATE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return job"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_item_for_update",
      "start": 115,
      "end": 121,
      "body": "def _item_for_update(session, item_id: int, branch_id: UUID) -> dict[str, object]:\n    row = session.execute(text(\"\"\"\n        SELECT * FROM catalogue_items WHERE id=:item_id AND branch_id=:branch_id AND archived_at IS NULL FOR UPDATE\n    \"\"\"), {\"item_id\": item_id, \"branch_id\": str(branch_id)}).mappings().one_or_none()\n    if row is None:\n        raise auth_error(\"CATALOGUE_ITEM_NOT_AVAILABLE\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    return dict(row)"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_available_to_reserve",
      "start": 124,
      "end": 135,
      "body": "def _available_to_reserve(session, item_id: int, branch_id: UUID) -> float:\n    row = session.execute(text(\"\"\"\n        WITH stock AS (\n            SELECT COALESCE(SUM(quantity),0) AS on_hand FROM stock_ledger WHERE item_id=:item_id AND branch_id=:branch_id\n        ), held AS (\n            SELECT COALESCE(SUM(r.reserved_qty\n              - COALESCE((SELECT SUM(entry.quantity) FROM material_ledger entry WHERE entry.reservation_id=r.id AND entry.entry_type='ISSUE'),0)\n              - COALESCE((SELECT SUM(entry.quantity) FROM material_ledger entry WHERE entry.reservation_id=r.id AND entry.entry_type='RELEASE'),0)\n            ),0) AS held FROM material_reservations r WHERE r.item_id=:item_id AND r.branch_id=:branch_id\n        ) SELECT stock.on_hand-held.held AS available FROM stock, held\n    \"\"\"), {\"item_id\": item_id, \"branch_id\": str(branch_id)}).mappings().one()\n    return float(row[\"available\"])"
    },
    {
      "file": "backend/app/materials.py",
      "name": "_reconcile",
      "start": 138,
      "end": 150,
      "body": "def _reconcile(session, reservation_id: int, actor_id: UUID) -> None:\n    row = _row_or_404(session, \"material_reservations\", reservation_id, \"MATERIAL_RESERVATION_NOT_FOUND\")\n    totals = _totals(session, reservation_id)\n    if totals[\"released\"] >= float(row[\"reserved_qty\"]):\n        next_status = \"RELEASED\"\n    elif totals[\"issued\"] >= float(row[\"reserved_qty\"]) - totals[\"released\"]:\n        next_status = \"ISSUED\"\n    elif totals[\"issued\"] > 0:\n        next_status = \"PARTIALLY_ISSUED\"\n    else:\n        next_status = \"RESERVED\"\n    session.execute(text(\"\"\"UPDATE material_reservations SET status=:status,updated_by=:actor_id,updated_at=now()\n        WHERE id=:id\"\"\"), {\"id\": reservation_id, \"status\": next_status, \"actor_id\": str(actor_id)})"
    },
    {
      "file": "backend/app/materials.py",
      "name": "list_reservations",
      "start": 154,
      "end": 162,
      "body": "def list_reservations(scope: ScopedTenant, job_id: int | None = Query(default=None, alias=\"jobId\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _request_permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT id FROM material_reservations\n        WHERE (:job_id IS NULL OR job_card_id=:job_id) AND (:branch_id IS NULL OR branch_id=:branch_id)\n        ORDER BY created_at DESC,id DESC\"\"\"), {\"job_id\": job_id, \"branch_id\": str(branch_id) if branch_id else None}).mappings().all()\n    return [_reservation_with_totals(session, int(row[\"id\"])) for row in rows]"
    },
    {
      "file": "backend/app/materials.py",
      "name": "list_job_reservations",
      "start": 166,
      "end": 167,
      "body": "def list_job_reservations(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:\n    return list_reservations(scope, job_id=job_id)"
    },
    {
      "file": "backend/app/materials.py",
      "name": "list_material_ledger",
      "start": 171,
      "end": 179,
      "body": "def list_material_ledger(scope: ScopedTenant, reservation_id: int | None = Query(default=None, alias=\"reservationId\"), job_id: int | None = Query(default=None, alias=\"jobId\"), branch_id: UUID | None = Query(default=None, alias=\"branchId\")) -> list[dict[str, object]]:\n    session, current = scope\n    _store_permission(scope, mutation=False)\n    if branch_id is not None:\n        _branch(current, branch_id)\n    rows = session.execute(text(\"\"\"SELECT * FROM material_ledger WHERE (:reservation_id IS NULL OR reservation_id=:reservation_id)\n        AND (:job_id IS NULL OR job_card_id=:job_id) AND (:branch_id IS NULL OR branch_id=:branch_id)\n        ORDER BY created_at DESC,id DESC\"\"\"), {\"reservation_id\": reservation_id, \"job_id\": job_id, \"branch_id\": str(branch_id) if branch_id else None}).mappings().all()\n    return [_event(dict(row)) for row in rows]"
    },
    {
      "file": "backend/app/materials.py",
      "name": "create_reservation",
      "start": 183,
      "end": 204,
      "body": "def create_reservation(input: MaterialReservationInput, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    branch_id = _branch(_request_permission(scope, mutation=True), input.branch_id)\n    job = _approved_job(session, input.job_id)\n    if job[\"branch_id\"] != branch_id:\n        raise auth_error(\"JOB_BRANCH_MISMATCH\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _item_for_update(session, input.item_id, branch_id)\n    available = _available_to_reserve(session, input.item_id, branch_id)\n    if input.quantity > available:\n        raise auth_error(\"INSUFFICIENT_AVAILABLE_STOCK_TO_RESERVE\", status.HTTP_409_CONFLICT)\n    reservation = session.execute(text(\"\"\"INSERT INTO material_reservations\n        (tenant_id,branch_id,job_card_id,item_id,reserved_qty,status,note,created_by,updated_by)\n        VALUES (:tenant_id,:branch_id,:job_id,:item_id,:quantity,'RESERVED',:note,:actor_id,:actor_id) RETURNING *\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"job_id\": input.job_id, \"item_id\": input.item_id,\n         \"quantity\": input.quantity, \"note\": input.note.strip(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    session.execute(text(\"\"\"INSERT INTO material_ledger (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)\n        VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,'RESERVE',:quantity,:reason,:actor_id)\"\"\"),\n        {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"reservation_id\": reservation[\"id\"], \"job_id\": input.job_id,\n         \"item_id\": input.item_id, \"quantity\": input.quantity, \"reason\": input.note.strip() or \"Reserved for approved job\", \"actor_id\": str(current.actor_id)})\n    payload = _reservation_with_totals(session, int(reservation[\"id\"]))\n    _audit(session, current, \"MATERIAL_RESERVED\", input.note.strip() or \"Material reserved\", {}, payload)\n    return payload"
    },
    {
      "file": "backend/app/materials.py",
      "name": "material_command",
      "start": 208,
      "end": 236,
      "body": "def material_command(reservation_id: int, command: MaterialCommandName, input: MaterialCommand, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _store_permission(scope, mutation=True)\n    reservation = _row_or_404(session, \"material_reservations\", reservation_id, \"MATERIAL_RESERVATION_NOT_FOUND\")\n    job = _row_or_404(session, \"job_cards\", int(reservation[\"job_card_id\"]), \"JOB_NOT_FOUND\")\n    if job[\"status\"] in (\"CANCELLED\", \"CLOSED\"):\n        raise auth_error(\"JOB_TERMINAL\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    if command == \"issue\" and job[\"status\"] != \"IN_PROGRESS\":\n        raise auth_error(\"MATERIAL_ISSUE_REQUIRES_ACTIVE_JOB\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    _item_for_update(session, int(reservation[\"item_id\"]), reservation[\"branch_id\"])\n    event_type = {\"issue\": \"ISSUE\", \"return\": \"RETURN\", \"waste\": \"WASTE\", \"release\": \"RELEASE\", \"reverse-issue\": \"ISSUE_REVERSAL\"}[command]\n    if command in (\"waste\", \"release\", \"reverse-issue\") and not input.reason.strip():\n        raise auth_error(\"MATERIAL_COMMAND_REASON_REQUIRED\", status.HTTP_422_UNPROCESSABLE_ENTITY)\n    before = _reservation_with_totals(session, reservation_id)\n    try:\n        event = session.execute(text(\"\"\"INSERT INTO material_ledger\n            (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)\n            VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,:entry_type,:quantity,:reason,:actor_id) RETURNING *\"\"\"),\n            {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(reservation[\"branch_id\"]), \"reservation_id\": reservation_id,\n             \"job_id\": reservation[\"job_card_id\"], \"item_id\": reservation[\"item_id\"], \"entry_type\": event_type,\n             \"quantity\": input.quantity, \"reason\": input.reason.strip() or event_type.replace(\"_\", \" \").title(), \"actor_id\": str(current.actor_id)}).mappings().one()\n    except Exception as error:\n        message = str(error.orig) if getattr(error, \"orig\", None) else str(error)\n        code = \"NEGATIVE_STOCK_NOT_ALLOWED\" if \"negative_stock_not_allowed\" in message else \"MATERIAL_QUANTITY_INVARIANT_VIOLATION\"\n        raise auth_error(code, status.HTTP_409_CONFLICT) from error\n    _reconcile(session, reservation_id, current.actor_id)\n    payload = {\"reservation\": _reservation_with_totals(session, reservation_id), \"event\": _event(dict(event))}\n    _audit(session, current, f\"MATERIAL_{event_type}\", input.reason.strip() or event_type.replace(\"_\", \" \").title(), before, payload)\n    return payload"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "_admin",
      "start": 58,
      "end": 68,
      "body": "def _admin(scope: ScopedTenant, mutation: bool = False):\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation: raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if not any(name == \"Owner/Admin\" for _, name, _ in current.roles):\n        raise auth_error(\"SALES_CRM_ADMIN_REQUIRED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try: require_mutation_allowed(current)\n        except PermissionError as error: raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "_lead",
      "start": 70,
      "end": 71,
      "body": "def _lead(row):\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"displayName\": row[\"display_name\"], \"phone\": row[\"phone\"], \"company\": row[\"company\"], \"companyNotEntered\": row[\"company_not_entered\"], \"email\": row[\"email\"], \"emailNotEntered\": row[\"email_not_entered\"], \"address\": row[\"address\"], \"serviceInterest\": row[\"service_interest\"], \"notes\": row[\"notes\"], \"stage\": row[\"stage\"], \"temperature\": row[\"temperature\"], \"followUpDue\": row[\"follow_up_due\"], \"siteVisitCompleted\": row[\"site_visit_completed\"], \"siteVisitDate\": row[\"site_visit_date\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"]}"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "_quotation",
      "start": 72,
      "end": 74,
      "body": "def _quotation(session, row):\n    lines = [{\"id\": x[\"id\"], \"kind\": x[\"kind\"], \"description\": x[\"description\"], \"quantity\": float(x[\"quantity\"]), \"rate\": float(x[\"rate\"]), \"gstRate\": float(x[\"gst_rate\"])} for x in session.execute(text(\"SELECT * FROM quotation_lines WHERE quotation_id=:id ORDER BY line_no\"), {\"id\": row[\"id\"]}).mappings()]\n    return {\"id\": row[\"id\"], \"branchId\": str(row[\"branch_id\"]), \"leadId\": row[\"lead_id\"], \"quotationNo\": row[\"quotation_no\"], \"status\": row[\"status\"], \"validUntil\": row[\"valid_until\"], \"customerNotes\": row[\"customer_notes\"], \"discount\": float(row[\"discount\"]), \"subtotal\": float(row[\"subtotal\"]), \"gstAmount\": float(row[\"gst_amount\"]), \"total\": float(row[\"total\"]), \"templateId\": row[\"template_id\"], \"templateHtml\": row[\"template_html\"], \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"], \"lines\": lines}"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "_totals",
      "start": 75,
      "end": 78,
      "body": "def _totals(lines, discount):\n    subtotal = sum(line.quantity * line.rate for line in lines); net = max(0, subtotal - discount)\n    gst = sum(max(0, line.quantity * line.rate - (discount * (line.quantity * line.rate / subtotal) if subtotal else 0)) * line.gst_rate / 100 for line in lines)\n    return subtotal, gst, net + gst"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "_snapshot",
      "start": 79,
      "end": 80,
      "body": "def _snapshot(input, lead, subtotal, gst, total):\n    return json.dumps({\"templateId\": input.template_id, \"templateHtml\": input.template_html, \"leadName\": lead[\"display_name\"], \"phone\": lead[\"phone\"], \"validUntil\": str(input.valid_until) if input.valid_until else None, \"customerNotes\": input.customer_notes.strip(), \"discount\": input.discount, \"subtotal\": subtotal, \"gstAmount\": gst, \"total\": total, \"lines\": [{\"kind\": line.kind, \"description\": line.description, \"quantity\": line.quantity, \"rate\": line.rate, \"gstRate\": line.gst_rate} for line in input.lines]})"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "list_leads",
      "start": 83,
      "end": 86,
      "body": "def list_leads(scope: ScopedTenant, q: str = \"\", stage: LeadStage | None = None, temperature: Temperature | None = None, exact_date: date | None = Query(None, alias=\"exactDate\"), month: str | None = None, branch_id: UUID | None = Query(None, alias=\"branchId\")):\n    current = _admin(scope); branch = _branch(current, branch_id) if branch_id else None\n    rows = scope[0].execute(text(\"\"\"SELECT * FROM sales_leads WHERE (:branch IS NULL OR branch_id=:branch) AND (:stage IS NULL OR stage=:stage) AND (:temperature IS NULL OR temperature=:temperature) AND (:exact IS NULL OR follow_up_due=:exact) AND (:exact IS NOT NULL OR :month IS NULL OR to_char(follow_up_due,'YYYY-MM')=:month) AND (:q='' OR display_name ILIKE :like OR company ILIKE :like OR phone ILIKE :like) ORDER BY created_at DESC\"\"\"), {\"branch\":str(branch) if branch else None,\"stage\":stage,\"temperature\":temperature,\"exact\":exact_date,\"month\":month,\"q\":q.strip(),\"like\":f\"%{q.strip()}%\"}).mappings()\n    return [_lead(row) for row in rows]"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "create_lead",
      "start": 88,
      "end": 91,
      "body": "def create_lead(input: LeadInput, scope: ScopedTenant):\n    session,current=scope; branch=_branch(_admin(scope, True), input.branch_id)\n    row=session.execute(text(\"\"\"INSERT INTO sales_leads(tenant_id,branch_id,display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_by,updated_by) VALUES (:tenant,:branch,:name,:phone,:company,:company_not_entered,:email,:email_not_entered,:address,:interest,:notes,:stage,:temperature,:due,:visited,:visit_date,:actor,:actor) RETURNING *\"\"\"), {\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"name\":input.display_name.strip(),\"phone\":input.phone.strip(),\"company\":input.company.strip(),\"company_not_entered\":input.company_not_entered,\"email\":input.email.strip(),\"email_not_entered\":input.email_not_entered,\"address\":input.address.strip(),\"interest\":input.service_interest.strip(),\"notes\":input.notes.strip(),\"stage\":input.stage,\"temperature\":input.temperature,\"due\":input.follow_up_due,\"visited\":input.site_visit_completed,\"visit_date\":input.site_visit_date,\"actor\":str(current.actor_id)}).mappings().one()\n    payload=_lead(row); _audit(session,current,\"SALES_LEAD_CREATED\",\"Sales lead created\",{},payload); return payload"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "update_lead",
      "start": 93,
      "end": 96,
      "body": "def update_lead(lead_id:int,input:LeadInput,scope:ScopedTenant):\n    session,current=scope; branch=_branch(_admin(scope, True),input.branch_id); before=session.execute(text(\"SELECT * FROM sales_leads WHERE id=:id\"),{\"id\":lead_id}).mappings().one_or_none()\n    if not before: raise auth_error(\"LEAD_NOT_FOUND\",404)\n    row=session.execute(text(\"\"\"UPDATE sales_leads SET branch_id=:branch,display_name=:name,phone=:phone,company=:company,company_not_entered=:company_not_entered,email=:email,email_not_entered=:email_not_entered,address=:address,service_interest=:interest,notes=:notes,stage=:stage,temperature=:temperature,follow_up_due=:due,site_visit_completed=:visited,site_visit_date=:visit_date,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *\"\"\"), {\"id\":lead_id,\"branch\":str(branch),\"name\":input.display_name.strip(),\"phone\":input.phone.strip(),\"company\":input.company.strip(),\"company_not_entered\":input.company_not_entered,\"email\":input.email.strip(),\"email_not_entered\":input.email_not_entered,\"address\":input.address.strip(),\"interest\":input.service_interest.strip(),\"notes\":input.notes.strip(),\"stage\":input.stage,\"temperature\":input.temperature,\"due\":input.follow_up_due,\"visited\":input.site_visit_completed,\"visit_date\":input.site_visit_date,\"actor\":str(current.actor_id)}).mappings().one(); payload=_lead(row); _audit(session,current,\"SALES_LEAD_UPDATED\",\"Sales lead updated\",_lead(before),payload); return payload"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "list_quotations",
      "start": 99,
      "end": 101,
      "body": "def list_quotations(scope:ScopedTenant,q:str=\"\",quotation_status:QuotationStatus|None=Query(None,alias=\"status\"),exact_date:date|None=Query(None,alias=\"exactDate\"),month:str|None=None,branch_id:UUID|None=Query(None,alias=\"branchId\")):\n    current=_admin(scope); branch=_branch(current,branch_id) if branch_id else None\n    rows=scope[0].execute(text(\"\"\"SELECT q.* FROM quotations q JOIN sales_leads l ON l.id=q.lead_id WHERE (:branch IS NULL OR q.branch_id=:branch) AND (:status IS NULL OR q.status=:status) AND (:exact IS NULL OR q.created_at::date=:exact) AND (:exact IS NOT NULL OR :month IS NULL OR to_char(q.created_at,'YYYY-MM')=:month) AND (:q='' OR q.quotation_no ILIKE :like OR l.display_name ILIKE :like OR l.company ILIKE :like) ORDER BY q.created_at DESC\"\"\"),{\"branch\":str(branch) if branch else None,\"status\":quotation_status,\"exact\":exact_date,\"month\":month,\"q\":q.strip(),\"like\":f\"%{q.strip()}%\"}).mappings(); return [_quotation(scope[0],row) for row in rows]"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "list_service_tasks",
      "start": 104,
      "end": 114,
      "body": "def list_service_tasks(scope: ScopedTenant, q: str = \"\", branch_id: UUID | None = Query(None, alias=\"branchId\")):\n    \"\"\"The quotation picker only exposes active tasks in the selected branch.\"\"\"\n    session, current = scope\n    branch = _branch(_admin(scope), branch_id)\n    rows = session.execute(text(\"\"\"\n        SELECT id, name, description, rate, gst_rate FROM service_task_catalog\n        WHERE branch_id=:branch AND status='ACTIVE'\n          AND (:q='' OR name ILIKE :like OR description ILIKE :like)\n        ORDER BY name, id\n    \"\"\"), {\"branch\": str(branch), \"q\": q.strip(), \"like\": f\"%{q.strip()}%\"}).mappings()\n    return [{\"id\": row[\"id\"], \"name\": row[\"name\"], \"description\": row[\"description\"], \"rate\": float(row[\"rate\"]), \"gstRate\": float(row[\"gst_rate\"])} for row in rows]"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "create_quotation",
      "start": 116,
      "end": 124,
      "body": "def create_quotation(input:QuotationInput,scope:ScopedTenant):\n    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); lead=session.execute(text(\"SELECT * FROM sales_leads WHERE id=:id\"),{\"id\":input.lead_id}).mappings().one_or_none()\n    if not lead or str(lead[\"branch_id\"])!=str(branch): raise auth_error(\"LEAD_NOT_AVAILABLE\",422)\n    subtotal,gst,total=_totals(input.lines,input.discount)\n    row=session.execute(text(\"\"\"INSERT INTO quotations(tenant_id,branch_id,lead_id,quotation_no,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,document_snapshot,created_by,updated_by) VALUES (:tenant,:branch,:lead,'PENDING',:valid,:notes,:discount,:subtotal,:gst,:total,:template_id,:template_html,CAST(:snapshot AS jsonb),:actor,:actor) RETURNING *\"\"\"),{\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"lead\":input.lead_id,\"valid\":input.valid_until,\"notes\":input.customer_notes.strip(),\"discount\":input.discount,\"subtotal\":subtotal,\"gst\":gst,\"total\":total,\"template_id\":input.template_id,\"template_html\":input.template_html,\"snapshot\":_snapshot(input,lead,subtotal,gst,total),\"actor\":str(current.actor_id)}).mappings().one()\n    row=session.execute(text(\"UPDATE quotations SET quotation_no=:number WHERE id=:id RETURNING *\"),{\"id\":row[\"id\"],\"number\":f\"QT-{int(row['id']):06d}\"}).mappings().one()\n    for no,line in enumerate(input.lines,1): session.execute(text(\"INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"quotation\":row[\"id\"],\"no\":no,\"kind\":line.kind.strip(),\"description\":line.description.strip(),\"quantity\":line.quantity,\"rate\":line.rate,\"gst\":line.gst_rate})\n    session.execute(text(\"UPDATE sales_leads SET stage='QUOTATION_SENT',updated_by=:actor,updated_at=now() WHERE id=:id\"),{\"id\":input.lead_id,\"actor\":str(current.actor_id)})\n    payload=_quotation(session,row); _audit(session,current,\"QUOTATION_CREATED\",f\"Quotation {row['quotation_no']} created\",{},payload); return payload"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "update_quotation",
      "start": 126,
      "end": 138,
      "body": "def update_quotation(quotation_id:int,input:QuotationInput,scope:ScopedTenant):\n    \"\"\"Only a draft may be amended; regenerated values remain a fresh frozen snapshot.\"\"\"\n    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); before=session.execute(text(\"SELECT * FROM quotations WHERE id=:id\"),{\"id\":quotation_id}).mappings().one_or_none()\n    if not before: raise auth_error(\"QUOTATION_NOT_FOUND\",404)\n    if before[\"status\"] != \"DRAFT\": raise auth_error(\"QUOTATION_NOT_EDITABLE\",422)\n    before_payload = _quotation(session, before)\n    lead=session.execute(text(\"SELECT * FROM sales_leads WHERE id=:id\"),{\"id\":input.lead_id}).mappings().one_or_none()\n    if not lead or str(lead[\"branch_id\"]) != str(branch): raise auth_error(\"LEAD_NOT_AVAILABLE\",422)\n    subtotal,gst,total=_totals(input.lines,input.discount)\n    row=session.execute(text(\"\"\"UPDATE quotations SET branch_id=:branch,lead_id=:lead,valid_until=:valid,customer_notes=:notes,discount=:discount,subtotal=:subtotal,gst_amount=:gst,total=:total,template_id=:template_id,template_html=:template_html,document_snapshot=CAST(:snapshot AS jsonb),updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *\"\"\"),{\"id\":quotation_id,\"branch\":str(branch),\"lead\":input.lead_id,\"valid\":input.valid_until,\"notes\":input.customer_notes.strip(),\"discount\":input.discount,\"subtotal\":subtotal,\"gst\":gst,\"total\":total,\"template_id\":input.template_id,\"template_html\":input.template_html,\"snapshot\":_snapshot(input,lead,subtotal,gst,total),\"actor\":str(current.actor_id)}).mappings().one()\n    session.execute(text(\"DELETE FROM quotation_lines WHERE quotation_id=:id\"),{\"id\":quotation_id})\n    for no,line in enumerate(input.lines,1): session.execute(text(\"INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)\"),{\"tenant\":str(current.tenant_id),\"branch\":str(branch),\"quotation\":quotation_id,\"no\":no,\"kind\":line.kind.strip(),\"description\":line.description.strip(),\"quantity\":line.quantity,\"rate\":line.rate,\"gst\":line.gst_rate})\n    payload=_quotation(session,row); _audit(session,current,\"QUOTATION_UPDATED\",f\"Quotation {row['quotation_no']} updated\",before_payload,payload); return payload"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "change_status",
      "start": 140,
      "end": 146,
      "body": "def change_status(quotation_id:int,input:StatusInput,scope:ScopedTenant):\n    session,current=scope; _admin(scope,True); row=session.execute(text(\"SELECT * FROM quotations WHERE id=:id\"),{\"id\":quotation_id}).mappings().one_or_none()\n    if not row: raise auth_error(\"QUOTATION_NOT_FOUND\",404)\n    if row[\"status\"] in (\"ACCEPTED\",\"REJECTED\",\"EXPIRED\") and row[\"status\"] != input.status: raise auth_error(\"QUOTATION_FINAL\",422)\n    changed=session.execute(text(\"UPDATE quotations SET status=:status,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *\"),{\"id\":quotation_id,\"status\":input.status,\"actor\":str(current.actor_id)}).mappings().one()\n    if input.status==\"ACCEPTED\": session.execute(text(\"UPDATE sales_leads SET stage='WON',updated_by=:actor,updated_at=now() WHERE id=:id\"),{\"id\":row[\"lead_id\"],\"actor\":str(current.actor_id)})\n    return _quotation(session,changed)"
    },
    {
      "file": "backend/app/sales_crm.py",
      "name": "quotation_document",
      "start": 148,
      "end": 152,
      "body": "def quotation_document(quotation_id:int,scope:ScopedTenant):\n    session, _ = scope; _admin(scope); row=session.execute(text(\"SELECT document_snapshot,quotation_no,template_html,created_at FROM quotations WHERE id=:id\"),{\"id\":quotation_id}).mappings().one_or_none()\n    if not row: raise auth_error(\"QUOTATION_NOT_FOUND\",404)\n    # The template is the saved copy, never the mutable template definition.\n    return {\"quotationNo\":row[\"quotation_no\"],\"createdAt\":row[\"created_at\"],\"templateHtml\":row[\"template_html\"],\"snapshot\":dict(row[\"document_snapshot\"])}"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "_clean",
      "start": 96,
      "end": 100,
      "body": "def _clean(value: str) -> str:\n    value = value.strip()\n    if not value:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=\"blank value\")\n    return value"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "_rows",
      "start": 103,
      "end": 104,
      "body": "def _rows(session: Session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:\n    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "resolve_superadmin_scope",
      "start": 107,
      "end": 130,
      "body": "def resolve_superadmin_scope(session: Session, subject: str) -> SuperadminScope:\n    rows = _rows(\n        session,\n        \"\"\"\n        SELECT u.id, u.display_name, u.email\n        FROM platform_users AS u\n        JOIN superadmins AS sa ON sa.user_id = u.id\n        WHERE u.cognito_subject = :subject AND u.status = 'ACTIVE'\n        \"\"\",\n        {\"subject\": subject},\n    )\n    if not rows and subject in get_settings().configured_superadmin_subjects:\n        actor_id = uuid4()\n        email = f\"bootstrap-{actor_id}@platform.invalid\"\n        session.execute(\n            text(\"INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, :subject, 'Platform Superadmin', :email)\"),\n            {\"id\": str(actor_id), \"subject\": subject, \"email\": email},\n        )\n        session.execute(text(\"INSERT INTO superadmins (user_id) VALUES (:id)\"), {\"id\": str(actor_id)})\n        return SuperadminScope(actor_id, \"Platform Superadmin\", email)\n    if len(rows) != 1:\n        raise auth_error(\"SUPERADMIN_ACCESS_DENIED\", status.HTTP_403_FORBIDDEN)\n    row = rows[0]\n    return SuperadminScope(UUID(str(row[\"id\"])), str(row[\"display_name\"]), str(row[\"email\"]))"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "superadmin_scope",
      "start": 133,
      "end": 138,
      "body": "def superadmin_scope(\n    subject: str = Depends(authenticated_subject), session: Session = Depends(get_session)\n):\n    \"\"\"Open a platform transaction only for a server-resolved Superadmin.\"\"\"\n    with session.begin():\n        yield session, resolve_superadmin_scope(session, subject)"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "can_transition_lifecycle",
      "start": 144,
      "end": 145,
      "body": "def can_transition_lifecycle(current: str, target: str) -> bool:\n    return target in ALLOWED_LIFECYCLE_TRANSITIONS.get(current, frozenset())"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "_audit",
      "start": 148,
      "end": 174,
      "body": "def _audit(\n    session: Session,\n    *,\n    tenant_id: UUID,\n    actor_id: UUID,\n    action: str,\n    reason: str,\n    before: object,\n    after: object,\n) -> None:\n    session.execute(\n        text(\n            \"\"\"\n            INSERT INTO tenant_audit_events (id, tenant_id, actor_id, action, reason, before_value, after_value)\n            VALUES (:id, :tenant_id, :actor_id, :action, :reason, CAST(:before AS jsonb), CAST(:after AS jsonb))\n            \"\"\"\n        ),\n        {\n            \"id\": str(uuid4()),\n            \"tenant_id\": str(tenant_id),\n            \"actor_id\": str(actor_id),\n            \"action\": action,\n            \"reason\": reason,\n            \"before\": __import__(\"json\").dumps(before, default=str),\n            \"after\": __import__(\"json\").dumps(after, default=str),\n        },\n    )"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "_tenant_or_404",
      "start": 177,
      "end": 194,
      "body": "def _tenant_or_404(session: Session, tenant_id: UUID) -> dict[str, object]:\n    rows = _rows(\n        session,\n        \"\"\"\n        SELECT t.id, t.name, t.lifecycle_state, t.created_at,\n               b.id AS primary_branch_id, b.name AS primary_branch_name,\n               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date,\n               pb.due_date, pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at\n        FROM tenants AS t\n        JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary\n        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id\n        WHERE t.id = :tenant_id\n        \"\"\",\n        {\"tenant_id\": str(tenant_id)},\n    )\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"TENANT_NOT_FOUND\"})\n    return rows[0]"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "_tenant_payload",
      "start": 197,
      "end": 211,
      "body": "def _tenant_payload(row: dict[str, object]) -> dict[str, object]:\n    billing = None\n    if row[\"plan\"] is not None:\n        billing = {\n            \"plan\": row[\"plan\"], \"agreedPrice\": row[\"agreed_price\"], \"currency\": row[\"currency\"],\n            \"billingCycle\": row[\"billing_cycle\"], \"renewalDate\": row[\"renewal_date\"], \"dueDate\": row[\"due_date\"],\n            \"paymentStatus\": row[\"payment_status\"], \"internalNotes\": row[\"internal_notes\"],\n            \"updatedAt\": row[\"billing_updated_at\"],\n        }\n    return {\n        \"id\": str(row[\"id\"]), \"name\": row[\"name\"], \"lifecycleState\": row[\"lifecycle_state\"],\n        \"createdAt\": row[\"created_at\"],\n        \"primaryBranch\": {\"id\": str(row[\"primary_branch_id\"]), \"name\": row[\"primary_branch_name\"]},\n        \"platformBilling\": billing,\n    }"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "_create_scoped_defaults",
      "start": 214,
      "end": 233,
      "body": "def _create_scoped_defaults(session: Session, tenant_id: UUID, branch_id: UUID, actor_id: UUID) -> None:\n    \"\"\"Insert baseline configuration through the same forced-RLS role as tenant APIs.\"\"\"\n    session.execute(text(\"SET LOCAL ROLE workshopos_runtime\"))\n    session.execute(\n        text(\n            \"SELECT set_config('workshopos.tenant_id', :tenant_id, true), \"\n            \"set_config('workshopos.branch_ids', :branch_ids, true), \"\n            \"set_config('workshopos.read_only', 'false', true)\"\n        ),\n        {\"tenant_id\": str(tenant_id), \"branch_ids\": \"{\" + str(branch_id) + \"}\"},\n    )\n    session.execute(\n        text(\"INSERT INTO tenant_settings (tenant_id, settings, updated_by) VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)\"),\n        {\"tenant_id\": str(tenant_id), \"settings\": __import__(\"json\").dumps(DEFAULT_TENANT_SETTINGS), \"actor_id\": str(actor_id)},\n    )\n    session.execute(\n        text(\"INSERT INTO branch_settings (tenant_id, branch_id, settings, updated_by) VALUES (:tenant_id, :branch_id, CAST(:settings AS jsonb), :actor_id)\"),\n        {\"tenant_id\": str(tenant_id), \"branch_id\": str(branch_id), \"settings\": __import__(\"json\").dumps(DEFAULT_BRANCH_SETTINGS), \"actor_id\": str(actor_id)},\n    )\n    session.execute(text(\"RESET ROLE\"))"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "list_tenants",
      "start": 237,
      "end": 251,
      "body": "def list_tenants(scope: ScopedSuperadmin) -> dict[str, object]:\n    session, _ = scope\n    rows = _rows(\n        session,\n        \"\"\"\n        SELECT t.id, t.name, t.lifecycle_state, t.created_at, b.id AS primary_branch_id, b.name AS primary_branch_name,\n               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date, pb.due_date,\n               pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at\n        FROM tenants AS t JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary\n        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id\n        ORDER BY t.created_at DESC, t.id DESC\n        \"\"\",\n        {},\n    )\n    return {\"tenants\": [_tenant_payload(row) for row in rows]}"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "provision_tenant",
      "start": 255,
      "end": 281,
      "body": "def provision_tenant(input: ProvisionTenant, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    tenant_id, branch_id, admin_id, membership_id, invitation_id = (uuid4() for _ in range(5))\n    role_ids = {name: uuid4() for name in DEFAULT_ROLE_PERMISSIONS}\n    tenant_name, branch_name = _clean(input.tenant_name), _clean(input.primary_branch_name)\n    admin_name, admin_email = _clean(input.tenant_admin_name), _clean(input.tenant_admin_email).lower()\n    session.execute(text(\"INSERT INTO tenants (id, name, lifecycle_state) VALUES (:id, :name, :state)\"), {\"id\": str(tenant_id), \"name\": tenant_name, \"state\": input.lifecycle_state})\n    session.execute(text(\"INSERT INTO branches (id, tenant_id, name, is_primary) VALUES (:id, :tenant_id, :name, true)\"), {\"id\": str(branch_id), \"tenant_id\": str(tenant_id), \"name\": branch_name})\n    session.execute(text(\"INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)\"), {\"id\": str(admin_id), \"name\": admin_name, \"email\": admin_email})\n    session.execute(text(\"INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')\"), {\"id\": str(membership_id), \"tenant_id\": str(tenant_id), \"user_id\": str(admin_id)})\n    session.execute(text(\"INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"branch_id\": str(branch_id), \"tenant_id\": str(tenant_id)})\n    for role_name, permissions in DEFAULT_ROLE_PERMISSIONS.items():\n        role_id = role_ids[role_name]\n        session.execute(\n            text(\"INSERT INTO tenant_roles (id, tenant_id, name, description, system_key) VALUES (:id, :tenant_id, :name, :description, :system_key)\"),\n            {\"id\": str(role_id), \"tenant_id\": str(tenant_id), \"name\": role_name, \"description\": f\"{role_name} workspace access\", \"system_key\": SYSTEM_ROLE_KEYS[role_name]},\n        )\n        for permission in permissions:\n            session.execute(text(\"INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)\"), {\"role_id\": str(role_id), \"permission\": permission})\n    session.execute(text(\"INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"role_id\": str(role_ids['Owner/Admin']), \"tenant_id\": str(tenant_id)})\n    session.execute(text(\"INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())\"), {\"id\": str(invitation_id), \"tenant_id\": str(tenant_id), \"membership_id\": str(membership_id), \"email\": admin_email})\n    _create_scoped_defaults(session, tenant_id, branch_id, actor.actor_id)\n    session.execute(text(\"INSERT INTO platform_billing (tenant_id, plan, agreed_price, currency, billing_cycle, renewal_date, due_date, payment_status, internal_notes, updated_by) VALUES (:tenant_id, :plan, :agreed_price, :currency, :billing_cycle, :renewal_date, :due_date, :payment_status, :internal_notes, :actor_id)\"), {\"tenant_id\": str(tenant_id), **input.model_dump(include={\"plan\", \"agreed_price\", \"currency\", \"billing_cycle\", \"renewal_date\", \"due_date\", \"payment_status\", \"internal_notes\"}), \"actor_id\": str(actor.actor_id)})\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"TENANT_PROVISIONED\", reason=\"Tenant provisioned\", before={}, after={\"primaryBranchId\": str(branch_id), \"tenantAdminInvitationId\": str(invitation_id), \"defaultsVersion\": 1, \"operationalDataCopied\": False})\n    payload = _tenant_payload(_tenant_or_404(session, tenant_id))\n    payload[\"tenantAdminInvitation\"] = {\"id\": str(invitation_id), \"email\": admin_email, \"status\": \"PENDING\"}\n    return payload"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "get_tenant",
      "start": 285,
      "end": 287,
      "body": "def get_tenant(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, _ = scope\n    return _tenant_payload(_tenant_or_404(session, tenant_id))"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "update_billing",
      "start": 291,
      "end": 297,
      "body": "def update_billing(tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    before = _tenant_or_404(session, tenant_id)\n    session.execute(text(\"UPDATE platform_billing SET plan=:plan, agreed_price=:agreed_price, currency=:currency, billing_cycle=:billing_cycle, renewal_date=:renewal_date, due_date=:due_date, payment_status=:payment_status, internal_notes=:internal_notes, updated_by=:actor_id, updated_at=now() WHERE tenant_id=:tenant_id\"), {\"tenant_id\": str(tenant_id), \"actor_id\": str(actor.actor_id), **input.model_dump(exclude={\"reason\"})})\n    after = _tenant_or_404(session, tenant_id)\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"PLATFORM_BILLING_UPDATED\", reason=_clean(input.reason), before=_tenant_payload(before)[\"platformBilling\"], after=_tenant_payload(after)[\"platformBilling\"])\n    return _tenant_payload(after)"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "update_lifecycle",
      "start": 301,
      "end": 310,
      "body": "def update_lifecycle(tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    before = _tenant_or_404(session, tenant_id)\n    current = str(before[\"lifecycle_state\"])\n    if not can_transition_lifecycle(current, input.lifecycle_state):\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"INVALID_LIFECYCLE_TRANSITION\"})\n    session.execute(text(\"UPDATE tenants SET lifecycle_state = :state WHERE id = :tenant_id\"), {\"state\": input.lifecycle_state, \"tenant_id\": str(tenant_id)})\n    after = _tenant_or_404(session, tenant_id)\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"TENANT_LIFECYCLE_CHANGED\", reason=_clean(input.reason), before={\"lifecycleState\": current}, after={\"lifecycleState\": input.lifecycle_state})\n    return _tenant_payload(after)"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "start_emulation",
      "start": 314,
      "end": 326,
      "body": "def start_emulation(tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    tenant = _tenant_or_404(session, tenant_id)\n    if tenant[\"lifecycle_state\"] == \"closed\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"EMULATION_CLOSED_TENANT\"})\n    existing = _rows(session, \"SELECT id FROM support_emulations WHERE superadmin_id=:actor_id AND tenant_id=:tenant_id AND status='ACTIVE'\", {\"actor_id\": str(actor.actor_id), \"tenant_id\": str(tenant_id)})\n    if existing:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"EMULATION_ALREADY_ACTIVE\"})\n    emulation_id = uuid4()\n    reason = _clean(input.reason)\n    session.execute(text(\"INSERT INTO support_emulations (id, superadmin_id, tenant_id, status, reason) VALUES (:id, :actor_id, :tenant_id, 'ACTIVE', :reason)\"), {\"id\": str(emulation_id), \"actor_id\": str(actor.actor_id), \"tenant_id\": str(tenant_id), \"reason\": reason})\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"SUPPORT_EMULATION_STARTED\", reason=reason, before={}, after={\"emulationId\": str(emulation_id), \"readOnly\": True})\n    return {\"id\": str(emulation_id), \"tenantId\": str(tenant_id), \"status\": \"ACTIVE\", \"readOnly\": True}"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "end_emulation",
      "start": 330,
      "end": 339,
      "body": "def end_emulation(emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, actor = scope\n    rows = _rows(session, \"SELECT tenant_id FROM support_emulations WHERE id=:id AND superadmin_id=:actor_id AND status='ACTIVE'\", {\"id\": str(emulation_id), \"actor_id\": str(actor.actor_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ACTIVE_EMULATION_NOT_FOUND\"})\n    tenant_id = UUID(str(rows[0][\"tenant_id\"]))\n    reason = _clean(input.reason)\n    session.execute(text(\"UPDATE support_emulations SET status='ENDED', ended_at=now(), ended_reason=:reason WHERE id=:id\"), {\"id\": str(emulation_id), \"reason\": reason})\n    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action=\"SUPPORT_EMULATION_ENDED\", reason=reason, before={\"emulationId\": str(emulation_id), \"status\": \"ACTIVE\"}, after={\"emulationId\": str(emulation_id), \"status\": \"ENDED\"})\n    return {\"id\": str(emulation_id), \"status\": \"ENDED\"}"
    },
    {
      "file": "backend/app/superadmin.py",
      "name": "list_audit_events",
      "start": 343,
      "end": 347,
      "body": "def list_audit_events(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:\n    session, _ = scope\n    _tenant_or_404(session, tenant_id)\n    rows = _rows(session, \"SELECT id, action, reason, before_value, after_value, created_at FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at DESC, id DESC\", {\"tenant_id\": str(tenant_id)})\n    return {\"events\": [{\"id\": str(row[\"id\"]), \"action\": row[\"action\"], \"reason\": row[\"reason\"], \"before\": row[\"before_value\"], \"after\": row[\"after_value\"], \"createdAt\": row[\"created_at\"]} for row in rows]}"
    },
    {
      "file": "backend/app/tenancy.py",
      "name": "branch_array_literal",
      "start": 40,
      "end": 42,
      "body": "def branch_array_literal(branch_ids: tuple[UUID, ...]) -> str:\n    \"\"\"Return a PostgreSQL UUID array literal composed only from server UUIDs.\"\"\"\n    return \"{\" + \",\".join(str(branch_id) for branch_id in branch_ids) + \"}\""
    },
    {
      "file": "backend/app/tenancy.py",
      "name": "apply_rls_context",
      "start": 45,
      "end": 65,
      "body": "def apply_rls_context(session: Session, scope: TenantScope) -> None:\n    \"\"\"Set transaction-local, trusted RLS settings before any Tenant query runs.\"\"\"\n    # Migrations use the admin role, but request queries must never run as a\n    # table owner or BYPASSRLS role.  The fixed role is created and granted the\n    # minimum Tenant-table privileges by the tenancy migration.\n    session.execute(text(\"SET LOCAL ROLE workshopos_runtime\"))\n    session.execute(\n        text(\n            \"SELECT \"\n            \"set_config('workshopos.actor_id', :actor_id, true), \"\n            \"set_config('workshopos.tenant_id', :tenant_id, true), \"\n            \"set_config('workshopos.branch_ids', :branch_ids, true), \"\n            \"set_config('workshopos.read_only', :read_only, true)\"\n        ),\n        {\n            \"actor_id\": str(scope.actor_id),\n            \"tenant_id\": str(scope.tenant_id),\n            \"branch_ids\": branch_array_literal(scope.branch_ids),\n            \"read_only\": \"true\" if scope.read_only else \"false\",\n        },\n    )"
    },
    {
      "file": "backend/app/tenancy.py",
      "name": "require_branch",
      "start": 68,
      "end": 70,
      "body": "def require_branch(scope: TenantScope, branch_id: UUID) -> None:\n    if branch_id not in scope.branch_ids:\n        raise PermissionError(\"BRANCH_ACCESS_DENIED\")"
    },
    {
      "file": "backend/app/tenancy.py",
      "name": "require_mutation_allowed",
      "start": 73,
      "end": 76,
      "body": "def require_mutation_allowed(scope: TenantScope) -> None:\n    \"\"\"Reject tenant writes for suspended tenants and support emulation.\"\"\"\n    if scope.read_only:\n        raise PermissionError(\"TENANT_READ_ONLY\")"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_page_permissions",
      "start": 64,
      "end": 68,
      "body": "def _page_permissions(pages: Iterable[PageKey], *, write: bool) -> tuple[str, ...]:\n    permissions = {f\"page.{page}.read\" for page in pages}\n    if write:\n        permissions |= {f\"page.{page}.write\" for page in pages}\n    return tuple(sorted(permissions))"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "validate_assignment",
      "start": 84,
      "end": 93,
      "body": "def validate_assignment(role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> tuple[tuple[UUID, ...], tuple[UUID, ...]]:\n    if not role_ids:\n        raise AssignmentError(\"ROLE_ASSIGNMENT_REQUIRED\")\n    if not branch_ids:\n        raise AssignmentError(\"BRANCH_ASSIGNMENT_REQUIRED\")\n    if len(set(role_ids)) != len(role_ids):\n        raise AssignmentError(\"DUPLICATE_ROLE_ASSIGNMENT\")\n    if len(set(branch_ids)) != len(branch_ids):\n        raise AssignmentError(\"DUPLICATE_BRANCH_ASSIGNMENT\")\n    return tuple(role_ids), tuple(branch_ids)"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "validate_permissions",
      "start": 96,
      "end": 100,
      "body": "def validate_permissions(permissions: tuple[str, ...]) -> tuple[str, ...]:\n    cleaned = tuple(sorted({permission.strip() for permission in permissions if permission.strip()}))\n    if any(permission not in OPERATIONAL_PERMISSION_SET for permission in cleaned):\n        raise AssignmentError(\"INVALID_PERMISSION\")\n    return cleaned"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "require_distinct_membership",
      "start": 103,
      "end": 105,
      "body": "def require_distinct_membership(actor_id: UUID, target_user_id: UUID) -> None:\n    if actor_id == target_user_id:\n        raise AssignmentError(\"CANNOT_ARCHIVE_SELF\")"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "require_manager_remaining",
      "start": 108,
      "end": 110,
      "body": "def require_manager_remaining(manager_count: int) -> None:\n    if manager_count == 0:\n        raise AssignmentError(\"LAST_TENANT_ADMIN\")"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "require_owner_permissions",
      "start": 113,
      "end": 115,
      "body": "def require_owner_permissions(permissions: tuple[str, ...]) -> None:\n    if not set(DEFAULT_TENANT_ADMIN_PERMISSIONS) <= set(permissions):\n        raise AssignmentError(\"SYSTEM_ROLE_PERMISSION_REQUIRED\")"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "require_service_manager_permissions",
      "start": 118,
      "end": 120,
      "body": "def require_service_manager_permissions(permissions: tuple[str, ...]) -> None:\n    if not set(DEFAULT_ROLE_PERMISSIONS[\"Service Department Manager\"]) <= set(permissions):\n        raise AssignmentError(\"SYSTEM_ROLE_PERMISSION_REQUIRED\")"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_clean",
      "start": 165,
      "end": 169,
      "body": "def _clean(value: str) -> str:\n    cleaned = value.strip()\n    if not cleaned:\n        raise AssignmentError(\"BLANK_VALUE\")\n    return cleaned"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_rows",
      "start": 172,
      "end": 173,
      "body": "def _rows(session, statement: str, parameters: dict[str, object]) -> list[dict[str, object]]:\n    return [dict(row) for row in session.execute(text(statement), parameters).mappings().all()]"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_require",
      "start": 176,
      "end": 189,
      "body": "def _require(scope: ScopedTenant, permission: str, *, mutation: bool = False) -> TenantScope:\n    _, current = scope\n    if current.actor_type == \"support_emulation\":\n        if mutation:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN)\n        return current\n    if permission not in current.permissions:\n        raise auth_error(\"PERMISSION_DENIED\", status.HTTP_403_FORBIDDEN)\n    if mutation:\n        try:\n            require_mutation_allowed(current)\n        except PermissionError as error:\n            raise auth_error(\"TENANT_READ_ONLY\", status.HTTP_403_FORBIDDEN) from error\n    return current"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_audit",
      "start": 192,
      "end": 203,
      "body": "def _audit(session, current: TenantScope, action: str, reason: str, before: object, after: object) -> None:\n    session.execute(\n        text(\"\"\"\n            INSERT INTO tenant_audit_events (id, tenant_id, actor_id, action, reason, before_value, after_value)\n            VALUES (:id, :tenant_id, :actor_id, :action, :reason, CAST(:before AS jsonb), CAST(:after AS jsonb))\n        \"\"\"),\n        {\n            \"id\": str(uuid4()), \"tenant_id\": str(current.tenant_id), \"actor_id\": str(current.actor_id),\n            \"action\": action, \"reason\": reason,\n            \"before\": __import__(\"json\").dumps(before, default=str), \"after\": __import__(\"json\").dumps(after, default=str),\n        },\n    )"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_roles",
      "start": 206,
      "end": 217,
      "body": "def _roles(session, tenant_id: UUID) -> list[dict[str, object]]:\n    rows = _rows(session, \"\"\"\n        SELECT r.id, r.name, r.description, r.status, r.version, r.system_key, r.created_at, r.updated_at,\n               COALESCE(array_agg(rp.permission ORDER BY rp.permission) FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions\n        FROM tenant_roles AS r LEFT JOIN role_permissions AS rp ON rp.role_id = r.id\n        WHERE r.tenant_id = :tenant_id GROUP BY r.id ORDER BY r.name, r.id\n    \"\"\", {\"tenant_id\": str(tenant_id)})\n    return [{\n        \"id\": str(row[\"id\"]), \"name\": row[\"name\"], \"description\": row[\"description\"], \"status\": row[\"status\"],\n        \"version\": row[\"version\"], \"systemKey\": row[\"system_key\"], \"permissions\": list(row[\"permissions\"] or ()),\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    } for row in rows]"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_branches",
      "start": 220,
      "end": 223,
      "body": "def _branches(session, tenant_id: UUID) -> list[dict[str, object]]:\n    return [{\"id\": str(row[\"id\"]), \"name\": row[\"name\"]} for row in _rows(\n        session, \"SELECT id, name FROM branches WHERE tenant_id = :tenant_id ORDER BY name, id\", {\"tenant_id\": str(tenant_id)}\n    )]"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_membership_or_404",
      "start": 226,
      "end": 236,
      "body": "def _membership_or_404(session, tenant_id: UUID, membership_id: UUID) -> dict[str, object]:\n    rows = _rows(session, \"\"\"\n        SELECT m.id AS membership_id, m.tenant_id, m.user_id, m.status, m.version, m.created_at, m.updated_at,\n               u.display_name, u.email, i.created_at AS invited_at, i.last_sent_at\n        FROM tenant_memberships AS m JOIN platform_users AS u ON u.id = m.user_id\n        LEFT JOIN tenant_admin_invitations AS i ON i.membership_id = m.id\n        WHERE m.id = :membership_id AND m.tenant_id = :tenant_id\n    \"\"\", {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"USER_NOT_FOUND\"})\n    return rows[0]"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_user_payload",
      "start": 239,
      "end": 260,
      "body": "def _user_payload(session, tenant_id: UUID, row: dict[str, object]) -> dict[str, object]:\n    membership_id = str(row[\"membership_id\"])\n    role_rows = _rows(session, \"\"\"\n        SELECT r.id, r.name, COALESCE(array_agg(rp.permission ORDER BY rp.permission) FILTER (WHERE rp.permission IS NOT NULL), '{}') AS permissions\n        FROM membership_roles AS mr JOIN tenant_roles AS r ON r.id = mr.role_id\n        LEFT JOIN role_permissions AS rp ON rp.role_id = r.id\n        WHERE mr.membership_id = :membership_id AND mr.tenant_id = :tenant_id\n        GROUP BY r.id ORDER BY r.name, r.id\n    \"\"\", {\"membership_id\": membership_id, \"tenant_id\": str(tenant_id)})\n    branch_rows = _rows(session, \"\"\"\n        SELECT b.id, b.name FROM membership_branches AS mb JOIN branches AS b ON b.id = mb.branch_id\n        WHERE mb.membership_id = :membership_id AND mb.tenant_id = :tenant_id ORDER BY b.name, b.id\n    \"\"\", {\"membership_id\": membership_id, \"tenant_id\": str(tenant_id)})\n    roles = [{\"id\": str(item[\"id\"]), \"name\": item[\"name\"], \"permissions\": list(item[\"permissions\"] or ())} for item in role_rows]\n    branches = [{\"id\": str(item[\"id\"]), \"name\": item[\"name\"]} for item in branch_rows]\n    return {\n        \"id\": membership_id, \"name\": row[\"display_name\"], \"email\": row[\"email\"], \"status\": row[\"status\"],\n        \"roleIds\": [item[\"id\"] for item in roles], \"roles\": roles,\n        \"branchIds\": [item[\"id\"] for item in branches], \"branches\": branches,\n        \"version\": row[\"version\"], \"invitedAt\": row[\"invited_at\"], \"lastInvitedAt\": row[\"last_sent_at\"],\n        \"createdAt\": row[\"created_at\"], \"updatedAt\": row[\"updated_at\"],\n    }"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_directory",
      "start": 263,
      "end": 275,
      "body": "def _directory(session, tenant_id: UUID) -> dict[str, object]:\n    memberships = _rows(session, \"\"\"\n        SELECT m.id AS membership_id, m.tenant_id, m.user_id, m.status, m.version, m.created_at, m.updated_at,\n               u.display_name, u.email, i.created_at AS invited_at, i.last_sent_at\n        FROM tenant_memberships AS m JOIN platform_users AS u ON u.id = m.user_id\n        LEFT JOIN tenant_admin_invitations AS i ON i.membership_id = m.id\n        WHERE m.tenant_id = :tenant_id ORDER BY u.display_name, m.id\n    \"\"\", {\"tenant_id\": str(tenant_id)})\n    return {\n        \"users\": [_user_payload(session, tenant_id, row) for row in memberships],\n        \"roles\": _roles(session, tenant_id), \"branches\": _branches(session, tenant_id),\n        \"serviceDepartments\": _service_departments(session, tenant_id),\n    }"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_service_departments",
      "start": 278,
      "end": 312,
      "body": "def _service_departments(session, tenant_id: UUID) -> list[dict[str, object]]:\n    \"\"\"Return the branch-local routing graph, including human-readable teams.\"\"\"\n    departments = _rows(session, \"\"\"\n        SELECT d.id, d.branch_id, b.name AS branch_name, d.name, d.status, d.created_at, d.updated_at\n        FROM service_departments d JOIN branches b ON b.id=d.branch_id\n        WHERE d.tenant_id=:tenant_id ORDER BY b.name, d.name, d.id\n    \"\"\", {\"tenant_id\": str(tenant_id)})\n    result = []\n    for department in departments:\n        managers = _rows(session, \"\"\"\n            SELECT m.id AS membership_id, u.id AS user_id, u.display_name\n            FROM service_department_managers dm\n            JOIN tenant_memberships m ON m.id=dm.manager_membership_id\n            JOIN platform_users u ON u.id=m.user_id\n            WHERE dm.department_id=:department_id ORDER BY u.display_name, m.id\n        \"\"\", {\"department_id\": str(department[\"id\"])})\n        teams = _rows(session, \"\"\"\n            SELECT t.manager_membership_id, t.advisor_membership_id,\n                   manager_user.id AS manager_user_id, manager_user.display_name AS manager_name,\n                   advisor_user.id AS advisor_user_id, advisor_user.display_name AS advisor_name\n            FROM service_advisor_teams t\n            JOIN tenant_memberships manager ON manager.id=t.manager_membership_id\n            JOIN platform_users manager_user ON manager_user.id=manager.user_id\n            JOIN tenant_memberships advisor ON advisor.id=t.advisor_membership_id\n            JOIN platform_users advisor_user ON advisor_user.id=advisor.user_id\n            WHERE t.department_id=:department_id ORDER BY manager_user.display_name, advisor_user.display_name\n        \"\"\", {\"department_id\": str(department[\"id\"])})\n        result.append({\n            \"id\": str(department[\"id\"]), \"branchId\": str(department[\"branch_id\"]),\n            \"branchName\": department[\"branch_name\"], \"name\": department[\"name\"],\n            \"status\": department[\"status\"], \"createdAt\": department[\"created_at\"], \"updatedAt\": department[\"updated_at\"],\n            \"managers\": [{\"membershipId\": str(row[\"membership_id\"]), \"userId\": str(row[\"user_id\"]), \"name\": row[\"display_name\"]} for row in managers],\n            \"advisorTeams\": [{\"managerMembershipId\": str(row[\"manager_membership_id\"]), \"managerUserId\": str(row[\"manager_user_id\"]), \"managerName\": row[\"manager_name\"], \"advisorMembershipId\": str(row[\"advisor_membership_id\"]), \"advisorUserId\": str(row[\"advisor_user_id\"]), \"advisorName\": row[\"advisor_name\"]} for row in teams],\n        })\n    return result"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_active_branch_member",
      "start": 315,
      "end": 324,
      "body": "def _active_branch_member(session, tenant_id: UUID, membership_id: UUID, branch_id: UUID, system_key: str) -> None:\n    valid = session.execute(text(\"\"\"\n        SELECT 1 FROM tenant_memberships m\n        JOIN membership_branches mb ON mb.membership_id=m.id AND mb.branch_id=:branch_id\n        JOIN membership_roles mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id\n        JOIN tenant_roles r ON r.id=mr.role_id AND r.system_key=:system_key AND r.status='ACTIVE'\n        WHERE m.id=:membership_id AND m.tenant_id=:tenant_id AND m.status='ACTIVE'\n    \"\"\"), {\"tenant_id\": str(tenant_id), \"membership_id\": str(membership_id), \"branch_id\": str(branch_id), \"system_key\": system_key}).scalar()\n    if not valid:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"MEMBER_NOT_ELIGIBLE\"})"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_assert_assignments_belong_to_tenant",
      "start": 327,
      "end": 333,
      "body": "def _assert_assignments_belong_to_tenant(session, tenant_id: UUID, role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> None:\n    known_roles = {UUID(str(row[\"id\"])) for row in _rows(session, \"SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND status = 'ACTIVE'\", {\"tenant_id\": str(tenant_id)})}\n    known_branches = {UUID(str(row[\"id\"])) for row in _rows(session, \"SELECT id FROM branches WHERE tenant_id = :tenant_id\", {\"tenant_id\": str(tenant_id)})}\n    if not set(role_ids) <= known_roles:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"ROLE_NOT_IN_TENANT\"})\n    if not set(branch_ids) <= known_branches:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"BRANCH_NOT_IN_TENANT\"})"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_replace_assignments",
      "start": 336,
      "end": 342,
      "body": "def _replace_assignments(session, tenant_id: UUID, membership_id: UUID, role_ids: tuple[UUID, ...], branch_ids: tuple[UUID, ...]) -> None:\n    session.execute(text(\"DELETE FROM membership_roles WHERE membership_id = :membership_id AND tenant_id = :tenant_id\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)})\n    session.execute(text(\"DELETE FROM membership_branches WHERE membership_id = :membership_id AND tenant_id = :tenant_id\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(tenant_id)})\n    for role_id in role_ids:\n        session.execute(text(\"INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"role_id\": str(role_id), \"tenant_id\": str(tenant_id)})\n    for branch_id in branch_ids:\n        session.execute(text(\"INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)\"), {\"membership_id\": str(membership_id), \"branch_id\": str(branch_id), \"tenant_id\": str(tenant_id)})"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "_assert_manager_remains",
      "start": 345,
      "end": 355,
      "body": "def _assert_manager_remains(session, tenant_id: UUID) -> None:\n    count = session.execute(text(\"\"\"\n        SELECT count(DISTINCT m.id) FROM tenant_memberships AS m\n        JOIN membership_roles AS mr ON mr.membership_id = m.id AND mr.tenant_id = m.tenant_id\n        JOIN role_permissions AS rp ON rp.role_id = mr.role_id AND rp.permission = 'tenant.users.manage'\n        WHERE m.tenant_id = :tenant_id AND m.status IN ('ACTIVE', 'INVITED')\n    \"\"\"), {\"tenant_id\": str(tenant_id)}).scalar_one()\n    try:\n        require_manager_remaining(count)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": str(error)}) from error"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "list_users",
      "start": 359,
      "end": 362,
      "body": "def list_users(scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.read\")\n    return _directory(session, current.tenant_id)"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "list_service_departments",
      "start": 366,
      "end": 369,
      "body": "def list_service_departments(scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.read\")\n    return {\"serviceDepartments\": _service_departments(session, current.tenant_id)}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "create_service_department",
      "start": 373,
      "end": 389,
      "body": "def create_service_department(input: ServiceDepartmentCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    if not _rows(session, \"SELECT id FROM branches WHERE id=:branch_id AND tenant_id=:tenant_id\", {\"branch_id\": str(input.branch_id), \"tenant_id\": str(current.tenant_id)}):\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"BRANCH_NOT_IN_TENANT\"})\n    try:\n        name = _clean(input.name)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    exists = session.execute(text(\"SELECT 1 FROM service_departments WHERE tenant_id=:tenant_id AND branch_id=:branch_id AND lower(name)=lower(:name)\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(input.branch_id), \"name\": name}).scalar()\n    if exists:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"DEPARTMENT_NAME_CONFLICT\"})\n    department_id = uuid4()\n    session.execute(text(\"INSERT INTO service_departments (id,tenant_id,branch_id,name,created_by,updated_by) VALUES (:id,:tenant_id,:branch_id,:name,:actor_id,:actor_id)\"), {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id), \"branch_id\": str(input.branch_id), \"name\": name, \"actor_id\": str(current.actor_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_DEPARTMENT_CREATED\", name, {}, payload)\n    return {\"serviceDepartment\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "update_service_department",
      "start": 393,
      "end": 414,
      "body": "def update_service_department(department_id: UUID, input: ServiceDepartmentUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    rows = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    try:\n        name = _clean(input.name)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    duplicate = session.execute(text(\"\"\"\n        SELECT 1 FROM service_departments WHERE tenant_id=:tenant_id AND branch_id=:branch_id\n          AND lower(name)=lower(:name) AND id<>:id\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(rows[0][\"branch_id\"]), \"name\": name, \"id\": str(department_id)}).scalar()\n    if duplicate:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"DEPARTMENT_NAME_CONFLICT\"})\n    session.execute(text(\"\"\"\n        UPDATE service_departments SET name=:name, status=:status, updated_by=:actor_id, updated_at=now() WHERE id=:id\n    \"\"\"), {\"name\": name, \"status\": input.status, \"actor_id\": str(current.actor_id), \"id\": str(department_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_DEPARTMENT_UPDATED\", \"Service department updated\", {\"name\": rows[0][\"name\"], \"status\": rows[0][\"status\"]}, payload)\n    return {\"serviceDepartment\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "appoint_service_department_manager",
      "start": 418,
      "end": 431,
      "body": "def appoint_service_department_manager(department_id: UUID, membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id AND status='ACTIVE'\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    _active_branch_member(session, current.tenant_id, membership_id, UUID(str(department[0][\"branch_id\"])), \"service_manager\")\n    session.execute(text(\"\"\"\n        INSERT INTO service_department_managers (tenant_id,branch_id,department_id,manager_membership_id,appointed_by)\n        VALUES (:tenant_id,:branch_id,:department_id,:membership_id,:actor_id) ON CONFLICT DO NOTHING\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(department[0][\"branch_id\"]), \"department_id\": str(department_id), \"membership_id\": str(membership_id), \"actor_id\": str(current.actor_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_MANAGER_APPOINTED\", \"Service department manager appointed\", {}, {\"departmentId\": str(department_id), \"membershipId\": str(membership_id)})\n    return {\"serviceDepartment\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "remove_service_department_manager",
      "start": 435,
      "end": 447,
      "body": "def remove_service_department_manager(department_id: UUID, membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    removed = session.execute(text(\"DELETE FROM service_department_managers WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:membership_id\"), {\"tenant_id\": str(current.tenant_id), \"department_id\": str(department_id), \"membership_id\": str(membership_id)}).rowcount\n    if not removed:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"MANAGER_NOT_APPOINTED\"})\n    session.execute(text(\"DELETE FROM service_advisor_teams WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:membership_id\"), {\"tenant_id\": str(current.tenant_id), \"department_id\": str(department_id), \"membership_id\": str(membership_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_MANAGER_REMOVED\", \"Service department manager removed\", {}, {\"departmentId\": str(department_id), \"membershipId\": str(membership_id)})\n    return {\"serviceDepartment\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "assign_service_advisor_team",
      "start": 451,
      "end": 471,
      "body": "def assign_service_advisor_team(department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id AND status='ACTIVE'\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    branch_id = UUID(str(department[0][\"branch_id\"]))\n    appointed = session.execute(text(\"SELECT 1 FROM service_department_managers WHERE department_id=:department_id AND manager_membership_id=:membership_id\"), {\"department_id\": str(department_id), \"membership_id\": str(manager_membership_id)}).scalar()\n    if not appointed:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": \"MANAGER_NOT_APPOINTED\"})\n    _active_branch_member(session, current.tenant_id, advisor_membership_id, branch_id, \"service\")\n    session.execute(text(\"\"\"\n        INSERT INTO service_advisor_teams (tenant_id,branch_id,department_id,manager_membership_id,advisor_membership_id,assigned_by)\n        VALUES (:tenant_id,:branch_id,:department_id,:manager_membership_id,:advisor_membership_id,:actor_id)\n        ON CONFLICT (tenant_id,branch_id,advisor_membership_id) DO UPDATE\n        SET department_id=EXCLUDED.department_id, manager_membership_id=EXCLUDED.manager_membership_id,\n            assigned_by=EXCLUDED.assigned_by, assigned_at=now()\n    \"\"\"), {\"tenant_id\": str(current.tenant_id), \"branch_id\": str(branch_id), \"department_id\": str(department_id), \"manager_membership_id\": str(manager_membership_id), \"advisor_membership_id\": str(advisor_membership_id), \"actor_id\": str(current.actor_id)})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_ADVISOR_TEAM_ASSIGNED\", \"Advisor assigned to manager team\", {}, {\"departmentId\": str(department_id), \"managerMembershipId\": str(manager_membership_id), \"advisorMembershipId\": str(advisor_membership_id)})\n    return {\"serviceDepartment\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "remove_service_advisor_team",
      "start": 475,
      "end": 486,
      "body": "def remove_service_advisor_team(department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    department = _rows(session, \"SELECT id FROM service_departments WHERE id=:id AND tenant_id=:tenant_id\", {\"id\": str(department_id), \"tenant_id\": str(current.tenant_id)})\n    if len(department) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"SERVICE_DEPARTMENT_NOT_FOUND\"})\n    removed = session.execute(text(\"DELETE FROM service_advisor_teams WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:manager_membership_id AND advisor_membership_id=:advisor_membership_id\"), {\"tenant_id\": str(current.tenant_id), \"department_id\": str(department_id), \"manager_membership_id\": str(manager_membership_id), \"advisor_membership_id\": str(advisor_membership_id)}).rowcount\n    if not removed:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ADVISOR_TEAM_NOT_FOUND\"})\n    payload = next(item for item in _service_departments(session, current.tenant_id) if item[\"id\"] == str(department_id))\n    _audit(session, current, \"SERVICE_ADVISOR_TEAM_REMOVED\", \"Advisor removed from manager team\", {}, {\"departmentId\": str(department_id), \"managerMembershipId\": str(manager_membership_id), \"advisorMembershipId\": str(advisor_membership_id)})\n    return {\"serviceDepartment\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "create_user",
      "start": 490,
      "end": 510,
      "body": "def create_user(input: UserCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)\n        name, email = _clean(input.name), _clean(input.email).lower()\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)\n    existing = _rows(session, \"SELECT id FROM platform_users WHERE lower(email) = :email\", {\"email\": email})\n    if existing:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"EMAIL_ALREADY_REGISTERED\"})\n    user_id, membership_id, invitation_id = uuid4(), uuid4(), uuid4()\n    session.execute(text(\"INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)\"), {\"id\": str(user_id), \"name\": name, \"email\": email})\n    session.execute(text(\"INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')\"), {\"id\": str(membership_id), \"tenant_id\": str(current.tenant_id), \"user_id\": str(user_id)})\n    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)\n    session.execute(text(\"INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())\"), {\"id\": str(invitation_id), \"tenant_id\": str(current.tenant_id), \"membership_id\": str(membership_id), \"email\": email})\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_INVITED\", \"Tenant user invited\", {}, {\"membershipId\": payload[\"id\"], \"roleIds\": payload[\"roleIds\"], \"branchIds\": payload[\"branchIds\"]})\n    return {\"user\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "update_user",
      "start": 514,
      "end": 536,
      "body": "def update_user(membership_id: UUID, input: UserUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)\n        name = _clean(input.name)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)\n    before = _membership_or_404(session, current.tenant_id, membership_id)\n    updated = session.execute(text(\"\"\"\n        UPDATE tenant_memberships SET version = version + 1, updated_at = now()\n        WHERE id = :membership_id AND tenant_id = :tenant_id AND version = :version\n    \"\"\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(current.tenant_id), \"version\": input.version})\n    if updated.rowcount != 1:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"VERSION_CONFLICT\"})\n    session.execute(text(\"UPDATE platform_users SET display_name = :name, updated_at = now() WHERE id = :user_id\"), {\"name\": name, \"user_id\": str(before[\"user_id\"])})\n    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)\n    _assert_manager_remains(session, current.tenant_id)\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_UPDATED\", \"Tenant user assignments updated\", {\"membershipId\": str(membership_id), \"version\": before[\"version\"]}, {\"roleIds\": payload[\"roleIds\"], \"branchIds\": payload[\"branchIds\"], \"version\": payload[\"version\"]})\n    return {\"user\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "archive_user",
      "start": 540,
      "end": 556,
      "body": "def archive_user(membership_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    before = _membership_or_404(session, current.tenant_id, membership_id)\n    try:\n        require_distinct_membership(current.actor_id, UUID(str(before[\"user_id\"])))\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    if before[\"status\"] == \"ARCHIVED\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"USER_ALREADY_ARCHIVED\"})\n    session.execute(text(\"UPDATE tenant_memberships SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :membership_id AND tenant_id = :tenant_id\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(current.tenant_id)})\n    session.execute(text(\"UPDATE platform_users SET active_membership_id = NULL, updated_at = now() WHERE id = :user_id AND active_membership_id = :membership_id\"), {\"user_id\": str(before[\"user_id\"]), \"membership_id\": str(membership_id)})\n    _assert_manager_remains(session, current.tenant_id)\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_ARCHIVED\", input.reason.strip(), {\"membershipId\": str(membership_id), \"status\": before[\"status\"]}, {\"status\": \"ARCHIVED\"})\n    return {\"user\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "resend_invite",
      "start": 560,
      "end": 572,
      "body": "def resend_invite(membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    before = _membership_or_404(session, current.tenant_id, membership_id)\n    if before[\"status\"] != \"INVITED\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"INVITATION_NOT_PENDING\"})\n    result = session.execute(text(\"UPDATE tenant_admin_invitations SET last_sent_at = now() WHERE membership_id = :membership_id AND tenant_id = :tenant_id AND status = 'PENDING'\"), {\"membership_id\": str(membership_id), \"tenant_id\": str(current.tenant_id)})\n    if result.rowcount != 1:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"INVITATION_NOT_PENDING\"})\n    row = _membership_or_404(session, current.tenant_id, membership_id)\n    payload = _user_payload(session, current.tenant_id, row)\n    _audit(session, current, \"TENANT_USER_INVITATION_RESENT\", \"Tenant user invitation resent\", {\"membershipId\": str(membership_id)}, {\"lastInvitedAt\": payload[\"lastInvitedAt\"]})\n    return {\"user\": payload}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "list_roles",
      "start": 576,
      "end": 579,
      "body": "def list_roles(scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.read\")\n    return {\"roles\": _roles(session, current.tenant_id)}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "create_role",
      "start": 583,
      "end": 598,
      "body": "def create_role(input: RoleCreate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    if _rows(session, \"SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND name = :name\", {\"tenant_id\": str(current.tenant_id), \"name\": name}):\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"ROLE_NAME_CONFLICT\"})\n    role_id = uuid4()\n    session.execute(text(\"INSERT INTO tenant_roles (id, tenant_id, name, description) VALUES (:id, :tenant_id, :name, :description)\"), {\"id\": str(role_id), \"tenant_id\": str(current.tenant_id), \"name\": name, \"description\": description})\n    for permission in permissions:\n        session.execute(text(\"INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)\"), {\"role_id\": str(role_id), \"permission\": permission})\n    role = next(role for role in _roles(session, current.tenant_id) if role[\"id\"] == str(role_id))\n    _audit(session, current, \"TENANT_ROLE_CREATED\", \"Tenant role created\", {}, {\"roleId\": role[\"id\"], \"permissions\": role[\"permissions\"]})\n    return {\"role\": role}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "update_role",
      "start": 602,
      "end": 634,
      "body": "def update_role(role_id: UUID, input: RoleUpdate, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    try:\n        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)\n    except AssignmentError as error:\n        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    rows = _rows(session, \"SELECT id, system_key, version FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id\", {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ROLE_NOT_FOUND\"})\n    if rows[0][\"system_key\"] == \"admin\":\n        try:\n            require_owner_permissions(permissions)\n        except AssignmentError as error:\n            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    if rows[0][\"system_key\"] == \"service_manager\":\n        try:\n            require_service_manager_permissions(permissions)\n        except AssignmentError as error:\n            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={\"code\": str(error)}) from error\n    changed = session.execute(text(\"\"\"\n        UPDATE tenant_roles SET name = :name, description = :description, version = version + 1, updated_at = now()\n        WHERE id = :role_id AND tenant_id = :tenant_id AND version = :version\n    \"\"\"), {\"name\": name, \"description\": description, \"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id), \"version\": input.version})\n    if changed.rowcount != 1:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"VERSION_CONFLICT\"})\n    session.execute(text(\"DELETE FROM role_permissions WHERE role_id = :role_id\"), {\"role_id\": str(role_id)})\n    for permission in permissions:\n        session.execute(text(\"INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)\"), {\"role_id\": str(role_id), \"permission\": permission})\n    _assert_manager_remains(session, current.tenant_id)\n    role = next(role for role in _roles(session, current.tenant_id) if role[\"id\"] == str(role_id))\n    _audit(session, current, \"TENANT_ROLE_UPDATED\", \"Tenant role permissions updated\", {\"roleId\": str(role_id)}, {\"permissions\": role[\"permissions\"], \"version\": role[\"version\"]})\n    return {\"role\": role}"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "name": "archive_role",
      "start": 638,
      "end": 655,
      "body": "def archive_role(role_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:\n    session, current = scope\n    _require(scope, \"tenant.users.manage\", mutation=True)\n    rows = _rows(session, \"SELECT id, name, system_key, status FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id\", {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)})\n    if len(rows) != 1:\n        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={\"code\": \"ROLE_NOT_FOUND\"})\n    role = rows[0]\n    if role[\"system_key\"] in (\"admin\", \"service_manager\"):\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"SYSTEM_ROLE_PROTECTED\"})\n    if role[\"status\"] == \"ARCHIVED\":\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"ROLE_ALREADY_ARCHIVED\"})\n    assigned = session.execute(text(\"SELECT count(*) FROM membership_roles WHERE role_id = :role_id AND tenant_id = :tenant_id\"), {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)}).scalar_one()\n    if assigned:\n        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={\"code\": \"ROLE_IN_USE\"})\n    session.execute(text(\"UPDATE tenant_roles SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :role_id AND tenant_id = :tenant_id\"), {\"role_id\": str(role_id), \"tenant_id\": str(current.tenant_id)})\n    archived = next(item for item in _roles(session, current.tenant_id) if item[\"id\"] == str(role_id))\n    _audit(session, current, \"TENANT_ROLE_ARCHIVED\", input.reason.strip(), {\"roleId\": str(role_id), \"name\": role[\"name\"]}, {\"status\": \"ARCHIVED\"})\n    return {\"role\": archived}"
    }
  ]
}