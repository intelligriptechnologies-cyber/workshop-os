{
  "revisions": [
    {
      "file": "20260929_0001_foundation.py",
      "created_tables": [],
      "downgrade": "no-op"
    },
    {
      "file": "20260929_0002_tenant_session.py",
      "created_tables": [
        "tenants",
        "branches",
        "platform_users",
        "tenant_memberships",
        "membership_branches",
        "tenant_roles",
        "membership_roles",
        "role_permissions",
        "tenant_settings",
        "branch_settings"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0003_superadmin.py",
      "created_tables": [
        "superadmins",
        "platform_billing",
        "tenant_admin_invitations",
        "support_emulations",
        "tenant_audit_events"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0004_tenant_administration.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0005_intake.py",
      "created_tables": [
        "customers",
        "vehicles",
        "visits"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0006_jobs_estimates.py",
      "created_tables": [
        "job_cards",
        "estimates",
        "estimate_lines",
        "estimate_decisions",
        "job_events"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0007_catalogue_stock.py",
      "created_tables": [
        "catalogue_items",
        "suppliers",
        "purchase_orders",
        "purchase_order_lines",
        "stock_inwards",
        "stock_ledger"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0008_job_material_ledger.py",
      "created_tables": [
        "material_reservations",
        "material_ledger"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20260929_0009_purchase_order_line_delete.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261001_0002_execution_qc.py",
      "created_tables": [
        "technician_tasks",
        "work_updates",
        "evidence_attachments",
        "qc_checks",
        "qc_results"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261001_0003_merge_purchase_order_execution_heads.py",
      "created_tables": [],
      "downgrade": "no-op"
    },
    {
      "file": "20261001_0004_finance_delivery.py",
      "created_tables": [
        "document_sequences",
        "financial_documents",
        "invoices",
        "invoice_lines",
        "payments",
        "delivery_acknowledgements",
        "financial_document_events"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261001_0005_followups_search.py",
      "created_tables": [
        "followups"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261001_0006_finance_corrections_and_invoice_claims.py",
      "created_tables": [
        "active_invoice_claims",
        "credit_notes",
        "refunds"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261002_0014_service_department_routing.py",
      "created_tables": [
        "service_departments",
        "service_department_managers",
        "service_advisor_teams",
        "job_assignment_history"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261002_0015_sales_crm.py",
      "created_tables": [
        "sales_leads",
        "quotations",
        "quotation_lines"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261002_0016_service_task_catalog.py",
      "created_tables": [
        "service_task_catalog"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0017_lead_not_entered_flags.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0018_booking_checkin.py",
      "created_tables": [
        "booking_capacity_limits",
        "bookings"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0019_execution_api_contract.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0020_material_reservation_idempotency.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0021_finance_claim_lock_grant.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0022_purchase_requests.py",
      "created_tables": [
        "purchase_requests",
        "purchase_request_lines",
        "purchase_request_quotes",
        "purchase_request_events",
        "purchase_request_purchase_orders"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261006_0023_material_shortages.py",
      "created_tables": [
        "material_shortages"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261008_0024_purchase_delivery_confirmation.py",
      "created_tables": [
        "purchase_order_delivery_receipts",
        "purchase_order_delivery_receipt_lines",
        "purchase_order_delivery_confirmations"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261008_0025_delivery_confirmation_inward_idempotency.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261011_0026_job_estimated_delivery.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261017_0027_database_auth.py",
      "created_tables": [
        "database_sessions"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261017_0028_demo_import.py",
      "created_tables": [
        "demo_import_runs",
        "demo_import_rows"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261017_0029_tenant_invitation_runtime_grant.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261018_0030_job_media.py",
      "created_tables": [
        "job_media"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261018_0031_job_checklists.py",
      "created_tables": [
        "job_checklist_cycles",
        "job_checklist_items"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261018_0032_service_catalog.py",
      "created_tables": [
        "job_service_tasks"
      ],
      "downgrade": "implemented, not certified reversible"
    },
    {
      "file": "20261018_0033_import_archive_scope.py",
      "created_tables": [],
      "downgrade": "implemented, not certified reversible"
    }
  ],
  "duplicate_literal_table_definitions": {},
  "literal_created_table_count": 73,
  "limitation": "Static declarations corroborated with clean replay catalog; dynamic statements require runtime catalog verification."
}