{
  "source_records": 3241,
  "business_records": 12,
  "quarantined_records": 3229,
  "failed_records": 0,
  "duplicate_records": 0,
  "idempotent_replay": false,
  "source_sha": "04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae",
  "policy_sha": "4376aa6960c02b14b94b03a1fffc819555f7f9089af857eec2b397a7e88c24e9",
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
      "disposition": "QUARANTINE",
      "records": 145
    },
    {
      "source_table": "checklist_items",
      "target_table": "job_checklist_items",
      "disposition": "QUARANTINE",
      "records": 711
    },
    {
      "source_table": "customers",
      "target_table": "customers",
      "disposition": "QUARANTINE",
      "records": 121
    },
    {
      "source_table": "estimate_items",
      "target_table": "estimate_lines",
      "disposition": "QUARANTINE",
      "records": 144
    },
    {
      "source_table": "estimates",
      "target_table": "estimates",
      "disposition": "QUARANTINE",
      "records": 144
    },
    {
      "source_table": "followups",
      "target_table": "followups",
      "disposition": "QUARANTINE",
      "records": 119
    },
    {
      "source_table": "gate_passes",
      "target_table": "legacy_gate_passes",
      "disposition": "QUARANTINE",
      "records": 27
    },
    {
      "source_table": "inventory",
      "target_table": "catalogue_items",
      "disposition": "QUARANTINE",
      "records": 4
    },
    {
      "source_table": "invoice_events",
      "target_table": "legacy_invoice_events",
      "disposition": "QUARANTINE",
      "records": 1
    },
    {
      "source_table": "invoice_items",
      "target_table": "invoice_lines",
      "disposition": "QUARANTINE",
      "records": 105
    },
    {
      "source_table": "invoices",
      "target_table": "invoices",
      "disposition": "QUARANTINE",
      "records": 52
    },
    {
      "source_table": "job_cards",
      "target_table": "job_cards",
      "disposition": "QUARANTINE",
      "records": 145
    },
    {
      "source_table": "job_task_list_items",
      "target_table": "job_service_tasks",
      "disposition": "QUARANTINE",
      "records": 4
    },
    {
      "source_table": "material_events",
      "target_table": "material_events",
      "disposition": "QUARANTINE",
      "records": 1
    },
    {
      "source_table": "material_movements",
      "target_table": "legacy_material_movements",
      "disposition": "QUARANTINE",
      "records": 3
    },
    {
      "source_table": "material_requests",
      "target_table": "material_requests",
      "disposition": "QUARANTINE",
      "records": 117
    },
    {
      "source_table": "payments",
      "target_table": "payments",
      "disposition": "QUARANTINE",
      "records": 27
    },
    {
      "source_table": "photos",
      "target_table": "job_media",
      "disposition": "QUARANTINE",
      "records": 289
    },
    {
      "source_table": "purchase_order_confirmations",
      "target_table": "purchase_order_delivery_confirmations",
      "disposition": "QUARANTINE",
      "records": 3
    },
    {
      "source_table": "purchase_order_lines",
      "target_table": "purchase_order_lines",
      "disposition": "QUARANTINE",
      "records": 3
    },
    {
      "source_table": "purchase_order_quotations",
      "target_table": "purchase_order_quotations",
      "disposition": "QUARANTINE",
      "records": 3
    },
    {
      "source_table": "purchase_order_receipt_lines",
      "target_table": "purchase_order_delivery_receipt_lines",
      "disposition": "QUARANTINE",
      "records": 3
    },
    {
      "source_table": "purchase_order_receipts",
      "target_table": "purchase_order_delivery_receipts",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "purchase_orders",
      "target_table": "purchase_orders",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "qc_checks",
      "target_table": "qc_checks",
      "disposition": "QUARANTINE",
      "records": 435
    },
    {
      "source_table": "receipts",
      "target_table": "legacy_receipts",
      "disposition": "QUARANTINE",
      "records": 27
    },
    {
      "source_table": "sales_leads",
      "target_table": "sales_leads",
      "disposition": "QUARANTINE",
      "records": 1
    },
    {
      "source_table": "sales_quotation_lines",
      "target_table": "quotation_lines",
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "sales_quotations",
      "target_table": "quotations",
      "disposition": "QUARANTINE",
      "records": 1
    },
    {
      "source_table": "service_catalog_items",
      "target_table": "service_task_catalog",
      "disposition": "QUARANTINE",
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
      "disposition": "QUARANTINE",
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
      "disposition": "QUARANTINE",
      "records": 2
    },
    {
      "source_table": "tasks",
      "target_table": "technician_tasks",
      "disposition": "QUARANTINE",
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
      "disposition": "QUARANTINE",
      "records": 132
    },
    {
      "source_table": "visits",
      "target_table": "visits",
      "disposition": "QUARANTINE",
      "records": 145
    }
  ],
  "reasons": [
    {
      "reason": "MISSING_HISTORICAL_TIMESTAMP:created_at",
      "occurrences": 439
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
      "occurrences": 1597
    },
    {
      "reason": "MISSING_REQUIRED:entry_type",
      "occurrences": 4
    },
    {
      "reason": "MISSING_REQUIRED:gst_rate_bps",
      "occurrences": 105
    },
    {
      "reason": "MISSING_REQUIRED:issued_document_id",
      "occurrences": 52
    },
    {
      "reason": "MISSING_REQUIRED:line_no",
      "occurrences": 252
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
      "reason": "MISSING_REQUIRED:receipt_document_id",
      "occurrences": 27
    },
    {
      "reason": "MISSING_REQUIRED:received_at",
      "occurrences": 27
    },
    {
      "reason": "MISSING_REQUIRED:received_by",
      "occurrences": 27
    },
    {
      "reason": "MISSING_REQUIRED:rejected_qty",
      "occurrences": 3
    },
    {
      "reason": "MISSING_REQUIRED:request_key",
      "occurrences": 5
    },
    {
      "reason": "MISSING_REQUIRED:revision",
      "occurrences": 144
    },
    {
      "reason": "MISSING_REQUIRED:tax_paise",
      "occurrences": 105
    },
    {
      "reason": "MISSING_REQUIRED:taxable_paise",
      "occurrences": 105
    },
    {
      "reason": "MISSING_REQUIRED:total_paise",
      "occurrences": 105
    },
    {
      "reason": "MISSING_REQUIRED:unit_amount_paise",
      "occurrences": 105
    },
    {
      "reason": "MISSING_REQUIRED:updated_by",
      "occurrences": 1116
    },
    {
      "reason": "POSTGRES_23503:job_checklist_cycles_job_card_id_fkey",
      "occurrences": 145
    },
    {
      "reason": "POSTGRES_23503:job_checklist_items_job_card_id_fkey",
      "occurrences": 652
    },
    {
      "reason": "POSTGRES_23503:purchase_order_delivery_recei_tenant_id_branch_id_receipt__fkey",
      "occurrences": 3
    },
    {
      "reason": "POSTGRES_23503:quotation_lines_quotation_id_fkey",
      "occurrences": 2
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_booking_events_tenant_id_branch_id_booking_id",
      "occurrences": 2
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id",
      "occurrences": 27
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_legacy_invoice_events_tenant_id_branch_id_job_card_id",
      "occurrences": 1
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8",
      "occurrences": 146
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id",
      "occurrences": 27
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_material_events_tenant_id_branch_id_job_card_id",
      "occurrences": 1
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_material_requests_tenant_id_branch_id_job_card_id",
      "occurrences": 117
    },
    {
      "reason": "POSTGRES_23503:s4b_fk_purchase_order_quotations_tenant_id_bra_75ba933f3b60",
      "occurrences": 3
    },
    {
      "reason": "REQUIRED_NULL:address",
      "occurrences": 120
    },
    {
      "reason": "REQUIRED_NULL:assigned_to",
      "occurrences": 145
    },
    {
      "reason": "REQUIRED_NULL:confirmed_by",
      "occurrences": 3
    },
    {
      "reason": "REQUIRED_NULL:created_by",
      "occurrences": 6
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
      "reason": "REQUIRED_NULL:engine_no",
      "occurrences": 132
    },
    {
      "reason": "REQUIRED_NULL:fuel_level_unit",
      "occurrences": 144
    },
    {
      "reason": "REQUIRED_NULL:fuel_level_value",
      "occurrences": 144
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
      "reason": "REQUIRED_NULL:odo_reading",
      "occurrences": 144
    },
    {
      "reason": "REQUIRED_NULL:received_by",
      "occurrences": 150
    },
    {
      "reason": "REQUIRED_NULL:vehicle_id",
      "occurrences": 2
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:confirmed_at",
      "occurrences": 3
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:created_at",
      "occurrences": 24
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:promised_at",
      "occurrences": 145
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:received_at",
      "occurrences": 6
    },
    {
      "reason": "TIMESTAMP_INTERPRETATION_REQUIRED:updated_at",
      "occurrences": 27
    },
    {
      "reason": "UNRESOLVED_SOURCE_PARENT:checked_by",
      "occurrences": 52
    },
    {
      "reason": "UNRESOLVED_SOURCE_PARENT:job_card_id",
      "occurrences": 6
    },
    {
      "reason": "UNRESOLVED_SOURCE_PARENT:material_row_id",
      "occurrences": 3
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:advisor_id",
      "occurrences": 290
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:assigned_to",
      "occurrences": 145
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:checked_by",
      "occurrences": 59
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:confirmed_by",
      "occurrences": 3
    },
    {
      "reason": "UUID_IDENTITY_MAPPING_REQUIRED:created_by",
      "occurrences": 6
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
      "occurrences": 150
    }
  ],
  "scope_metadata_rows": 2,
  "public_tables": 106,
  "custody_tables": 2,
  "populated_business_tables": {
    "advisor_attendance": 2,
    "workshop_user_profiles": 10
  },
  "migration_replay_from_empty": true,
  "migration_head": "20261021_0036",
  "migration_revisions": 37,
  "idempotency_verified": true
}
