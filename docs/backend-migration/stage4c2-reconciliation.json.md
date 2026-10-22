{
  "source_records": 3241,
  "business_records": 3174,
  "quarantined_records": 67,
  "failed_records": 0,
  "duplicate_records": 0,
  "idempotent_replay": false,
  "source_sha": "04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae",
  "policy_sha": "b28c0dfdcb1eb11334f47ae4de59c8697e3b3cced354dbfe2cf125de862467fc",
  "by_table": [
    {
      "source_table": "advisor_attendance",
      "target_table": "advisor_attendance",
      "disposition": "BUSINESS",
      "records": 2
    },
    {
      "source_table": "booking_events",
      "target_table": "booking_events",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "bookings",
      "target_table": "bookings",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "checklist_cycles",
      "target_table": "job_checklist_cycles",
      "disposition": "BUSINESS",
      "records": 145
    },
    {
      "source_table": "checklist_items",
      "target_table": "job_checklist_items",
      "disposition": "BUSINESS",
      "records": 659
    },
    {
      "source_table": "checklist_items",
      "target_table": "job_checklist_items",
      "disposition": "QUARANTINE",
      "records": 52
    },
    {
      "source_table": "customers",
      "target_table": "customers",
      "disposition": "BUSINESS",
      "records": 121
    },
    {
      "source_table": "estimate_items",
      "target_table": "estimate_lines",
      "disposition": "BUSINESS",
      "records": 144
    },
    {
      "source_table": "estimates",
      "target_table": "estimates",
      "disposition": "BUSINESS",
      "records": 144
    },
    {
      "source_table": "followups",
      "target_table": "followups",
      "disposition": "BUSINESS",
      "records": 119
    },
    {
      "source_table": "gate_passes",
      "target_table": "legacy_gate_passes",
      "disposition": "BUSINESS",
      "records": 27
    },
    {
      "source_table": "inventory",
      "target_table": "catalogue_items",
      "disposition": "BUSINESS",
      "records": 4
    },
    {
      "source_table": "invoice_events",
      "target_table": "legacy_invoice_events",
      "disposition": "BUSINESS",
      "records": 1
    },
    {
      "source_table": "invoice_items",
      "target_table": "invoice_lines",
      "disposition": "BUSINESS",
      "records": 105
    },
    {
      "source_table": "invoices",
      "target_table": "invoices",
      "disposition": "BUSINESS",
      "records": 52
    },
    {
      "source_table": "job_cards",
      "target_table": "job_cards",
      "disposition": "BUSINESS",
      "records": 145
    },
    {
      "source_table": "job_task_list_items",
      "target_table": "job_service_tasks",
      "disposition": "BUSINESS",
      "records": 4
    },
    {
      "source_table": "material_events",
      "target_table": "material_events",
      "disposition": "BUSINESS",
      "records": 1
    },
    {
      "source_table": "material_movements",
      "target_table": "legacy_material_movements",
      "disposition": "BUSINESS",
      "records": 3
    },
    {
      "source_table": "material_requests",
      "target_table": "material_requests",
      "disposition": "BUSINESS",
      "records": 117
    },
    {
      "source_table": "payments",
      "target_table": "payments",
      "disposition": "BUSINESS",
      "records": 27
    },
    {
      "source_table": "photos",
      "target_table": "job_media",
      "disposition": "BUSINESS",
      "records": 289
    },
    {
      "source_table": "purchase_order_confirmations",
      "target_table": "purchase_order_delivery_confirmations",
      "disposition": "BUSINESS",
      "records": 3
    },
    {
      "source_table": "purchase_order_lines",
      "target_table": "purchase_order_lines",
      "disposition": "BUSINESS",
      "records": 3
    },
    {
      "source_table": "purchase_order_quotations",
      "target_table": "purchase_order_quotations",
      "disposition": "BUSINESS",
      "records": 3
    },
    {
      "source_table": "purchase_order_receipt_lines",
      "target_table": "purchase_order_delivery_receipt_lines",
      "disposition": "BUSINESS",
      "records": 3
    },
    {
      "source_table": "purchase_order_receipts",
      "target_table": "purchase_order_delivery_receipts",
      "disposition": "BUSINESS",
      "records": 2
    },
    {
      "source_table": "purchase_orders",
      "target_table": "purchase_orders",
      "disposition": "BUSINESS",
      "records": 2
    },
    {
      "source_table": "qc_checks",
      "target_table": "qc_checks",
      "disposition": "BUSINESS",
      "records": 435
    },
    {
      "source_table": "receipts",
      "target_table": "legacy_receipts",
      "disposition": "BUSINESS",
      "records": 27
    },
    {
      "source_table": "sales_leads",
      "target_table": "sales_leads",
      "disposition": "BUSINESS",
      "records": 1
    },
    {
      "source_table": "sales_quotation_lines",
      "target_table": "quotation_lines",
      "disposition": "BUSINESS",
      "records": 2
    },
    {
      "source_table": "sales_quotations",
      "target_table": "quotations",
      "disposition": "BUSINESS",
      "records": 1
    },
    {
      "source_table": "service_catalog_items",
      "target_table": "service_task_catalog",
      "disposition": "BUSINESS",
      "records": 3
    },
    {
      "source_table": "service_department_managers",
      "target_table": "service_department_managers",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "service_departments",
      "target_table": "service_departments",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "status_history",
      "target_table": "legacy_job_status_history",
      "disposition": "BUSINESS",
      "records": 146
    },
    {
      "source_table": "stock_inwards",
      "target_table": "stock_inwards",
      "disposition": "QUARANTINE",
      "records": 3
    },
    {
      "source_table": "stock_ledger",
      "target_table": "stock_ledger",
      "disposition": "QUARANTINE",
      "records": 4
    },
    {
      "source_table": "suppliers",
      "target_table": "suppliers",
      "disposition": "BUSINESS",
      "records": 2
    },
    {
      "source_table": "tasks",
      "target_table": "technician_tasks",
      "disposition": "BUSINESS",
      "records": 145
    },
    {
      "source_table": "users",
      "target_table": "workshop_user_profiles",
      "disposition": "BUSINESS",
      "records": 10
    },
    {
      "source_table": "vehicles",
      "target_table": "vehicles",
      "disposition": "BUSINESS",
      "records": 132
    },
    {
      "source_table": "visits",
      "target_table": "visits",
      "disposition": "BUSINESS",
      "records": 145
    }
  ],
  "reasons": [
    {
      "reason": "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "occurrences": 4
    },
    {
      "reason": "MISSING_REQUIRED:actor_id",
      "occurrences": 4
    },
    {
      "reason": "MISSING_REQUIRED:appointed_by",
      "occurrences": 2
    },
    {
      "reason": "MISSING_REQUIRED:created_by",
      "occurrences": 2
    },
    {
      "reason": "MISSING_REQUIRED:entry_type",
      "occurrences": 4
    },
    {
      "reason": "MISSING_REQUIRED:quantity",
      "occurrences": 4
    },
    {
      "reason": "MISSING_REQUIRED:reason",
      "occurrences": 4
    },
    {
      "reason": "MISSING_REQUIRED:updated_by",
      "occurrences": 4
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_booking_events_tenant_id_branch_id_booking_id",
      "occurrences": 2
    },
    {
      "reason": "REQUIRED_NULL:created_by",
      "occurrences": 2
    },
    {
      "reason": "REQUIRED_NULL:customer_id",
      "occurrences": 2
    },
    {
      "reason": "REQUIRED_NULL:department_id",
      "occurrences": 2
    },
    {
      "reason": "REQUIRED_NULL:id",
      "occurrences": 2
    },
    {
      "reason": "REQUIRED_NULL:manager_membership_id",
      "occurrences": 2
    },
    {
      "reason": "REQUIRED_NULL:received_by",
      "occurrences": 3
    },
    {
      "reason": "REQUIRED_NULL:vehicle_id",
      "occurrences": 2
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "occurrences": 2
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "occurrences": 3
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "occurrences": 2
    },
    {
      "reason": "UNRESOLVED_SOURCE_PARENT:checked_by",
      "occurrences": 52
    },
    {
      "reason": "UNRESOLVED_SOURCE_PARENT:job_card_id",
      "occurrences": 3
    },
    {
      "reason": "UNRESOLVED_SOURCE_PARENT:material_row_id",
      "occurrences": 3
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:checked_by",
      "occurrences": 52
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:created_by",
      "occurrences": 2
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:department_id",
      "occurrences": 2
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:id",
      "occurrences": 2
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:manager_membership_id",
      "occurrences": 2
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:received_by",
      "occurrences": 3
    }
  ],
  "scope_metadata_rows": 2,
  "public_tables": 106,
  "custody_tables": 2,
  "populated_business_tables": {
    "advisor_attendance": 2,
    "catalogue_items": 4,
    "customers": 121,
    "estimate_lines": 144,
    "estimates": 144,
    "followups": 119,
    "invoice_lines": 105,
    "invoices": 52,
    "job_cards": 145,
    "job_checklist_cycles": 145,
    "job_checklist_items": 659,
    "job_media": 289,
    "job_service_tasks": 4,
    "legacy_gate_passes": 27,
    "legacy_invoice_events": 1,
    "legacy_job_status_history": 146,
    "legacy_material_movements": 3,
    "legacy_receipts": 27,
    "material_events": 1,
    "material_requests": 117,
    "payments": 27,
    "purchase_order_delivery_confirmations": 3,
    "purchase_order_delivery_receipt_lines": 3,
    "purchase_order_delivery_receipts": 2,
    "purchase_order_lines": 3,
    "purchase_order_quotations": 3,
    "purchase_orders": 2,
    "qc_checks": 435,
    "quotation_lines": 2,
    "quotations": 1,
    "sales_leads": 1,
    "service_task_catalog": 3,
    "suppliers": 2,
    "technician_tasks": 145,
    "vehicles": 132,
    "visits": 145,
    "workshop_user_profiles": 10
  },
  "migration_replay_from_empty": true,
  "migration_head": "20261021_0037",
  "migration_revisions": 38,
  "idempotency_verified": true
}