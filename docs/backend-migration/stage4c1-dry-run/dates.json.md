[
  {
    "table": "advisor_attendance",
    "column": "date",
    "classification": {
      "DATE_ONLY": 2
    }
  },
  {
    "table": "approvals",
    "column": "created_at",
    "classification": {}
  },
  {
    "table": "booking_call_logs",
    "column": "called_at",
    "classification": {}
  },
  {
    "table": "booking_capacity_limits",
    "column": "booking_date",
    "classification": {}
  },
  {
    "table": "booking_capacity_limits",
    "column": "updated_at",
    "classification": {}
  },
  {
    "table": "booking_capacity_overrides",
    "column": "booking_date",
    "classification": {}
  },
  {
    "table": "booking_capacity_overrides",
    "column": "approved_at",
    "classification": {}
  },
  {
    "table": "booking_events",
    "column": "previous_booking_date",
    "classification": {
      "NULL": 2
    }
  },
  {
    "table": "booking_events",
    "column": "booking_date",
    "classification": {
      "DATE_ONLY": 2
    }
  },
  {
    "table": "bookings",
    "column": "booking_date",
    "classification": {
      "DATE_ONLY": 2
    }
  },
  {
    "table": "bookings",
    "column": "confirmed_at",
    "classification": {
      "NULL": 2
    }
  },
  {
    "table": "bookings",
    "column": "arrived_at",
    "classification": {
      "NULL": 2
    }
  },
  {
    "table": "bookings",
    "column": "rescheduled_at",
    "classification": {
      "NULL": 2
    }
  },
  {
    "table": "bookings",
    "column": "cancelled_at",
    "classification": {
      "NULL": 2
    }
  },
  {
    "table": "bookings",
    "column": "no_show_at",
    "classification": {
      "NULL": 2
    }
  },
  {
    "table": "bookings",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 2
    }
  },
  {
    "table": "bookings",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 2
    }
  },
  {
    "table": "car_segments",
    "column": "created_at",
    "classification": {}
  },
  {
    "table": "car_segments",
    "column": "updated_at",
    "classification": {}
  },
  {
    "table": "checklist_cycles",
    "column": "started_at",
    "classification": {
      "OFFSET_INSTANT": 145
    }
  },
  {
    "table": "checklist_cycles",
    "column": "completed_at",
    "classification": {
      "NULL": 136,
      "OFFSET_INSTANT": 9
    }
  },
  {
    "table": "checklist_items",
    "column": "checked_at",
    "classification": {
      "NULL": 373,
      "OFFSET_INSTANT": 338
    }
  },
  {
    "table": "checklist_items",
    "column": "started_at",
    "classification": {
      "OFFSET_INSTANT": 475,
      "NULL": 236
    }
  },
  {
    "table": "checklist_items",
    "column": "completed_at",
    "classification": {
      "NULL": 373,
      "OFFSET_INSTANT": 338
    }
  },
  {
    "table": "checklist_items",
    "column": "na_at",
    "classification": {
      "NULL": 711
    }
  },
  {
    "table": "customers",
    "column": "archived_at",
    "classification": {
      "NULL": 121
    }
  },
  {
    "table": "customers",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 120,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "customers",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 119,
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "estimate_items",
    "column": "archived_at",
    "classification": {
      "NULL": 144
    }
  },
  {
    "table": "estimate_items",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 144
    }
  },
  {
    "table": "estimate_items",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 144
    }
  },
  {
    "table": "estimates",
    "column": "archived_at",
    "classification": {
      "NULL": 144
    }
  },
  {
    "table": "estimates",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 144
    }
  },
  {
    "table": "estimates",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 144
    }
  },
  {
    "table": "followups",
    "column": "due_at",
    "classification": {
      "DATE_ONLY": 119
    }
  },
  {
    "table": "followups",
    "column": "archived_at",
    "classification": {
      "NULL": 119
    }
  },
  {
    "table": "followups",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 117,
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "followups",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 116,
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "gate_passes",
    "column": "voided_at",
    "classification": {
      "NULL": 27
    }
  },
  {
    "table": "gate_passes",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 27
    }
  },
  {
    "table": "inventory",
    "column": "archived_at",
    "classification": {
      "NULL": 4
    }
  },
  {
    "table": "inventory",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 3,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "inventory",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 3,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "invoice_items",
    "column": "archived_at",
    "classification": {
      "NULL": 105
    }
  },
  {
    "table": "invoice_items",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3,
      "OFFSET_INSTANT": 102
    }
  },
  {
    "table": "invoice_items",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3,
      "OFFSET_INSTANT": 102
    }
  },
  {
    "table": "invoices",
    "column": "document_generated_at",
    "classification": {
      "OFFSET_INSTANT": 51,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "invoices",
    "column": "voided_at",
    "classification": {
      "NULL": 52
    }
  },
  {
    "table": "invoices",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 51,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "invoices",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 52
    }
  },
  {
    "table": "inward_purchase_attachments",
    "column": "uploaded_at",
    "classification": {}
  },
  {
    "table": "inward_purchase_revisions",
    "column": "revised_at",
    "classification": {}
  },
  {
    "table": "inward_purchases",
    "column": "invoice_date",
    "classification": {}
  },
  {
    "table": "inward_purchases",
    "column": "submitted_at",
    "classification": {}
  },
  {
    "table": "inward_purchases",
    "column": "created_at",
    "classification": {}
  },
  {
    "table": "inward_purchases",
    "column": "updated_at",
    "classification": {}
  },
  {
    "table": "inward_purchases",
    "column": "approved_at",
    "classification": {}
  },
  {
    "table": "job_cards",
    "column": "promised_at",
    "classification": {
      "RELATIVE_PROMISE_TEXT": 145
    },
    "rule": "Preserve free text; never resolve Tomorrow relative to import time. A separate text projection is required."
  },
  {
    "table": "job_cards",
    "column": "closed_at",
    "classification": {
      "EMPTY": 118,
      "OFFSET_INSTANT": 27
    }
  },
  {
    "table": "job_cards",
    "column": "damage_marks_recorded_at",
    "classification": {
      "NULL": 144,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "job_cards",
    "column": "archived_at",
    "classification": {
      "NULL": 145
    }
  },
  {
    "table": "job_cards",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "job_cards",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 143,
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "job_task_list_items",
    "column": "archived_at",
    "classification": {
      "NULL": 4
    }
  },
  {
    "table": "job_task_list_items",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 4
    }
  },
  {
    "table": "job_task_list_items",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 4
    }
  },
  {
    "table": "local_purchases",
    "column": "archived_at",
    "classification": {}
  },
  {
    "table": "local_purchases",
    "column": "created_at",
    "classification": {}
  },
  {
    "table": "local_purchases",
    "column": "updated_at",
    "classification": {}
  },
  {
    "table": "material_approvals",
    "column": "submitted_at",
    "classification": {}
  },
  {
    "table": "material_approvals",
    "column": "reviewed_at",
    "classification": {}
  },
  {
    "table": "material_movements",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "material_purchase_requests",
    "column": "completed_at",
    "classification": {}
  },
  {
    "table": "material_purchase_requests",
    "column": "created_at",
    "classification": {}
  },
  {
    "table": "material_purchase_requests",
    "column": "updated_at",
    "classification": {}
  },
  {
    "table": "material_requests",
    "column": "archived_at",
    "classification": {
      "NULL": 117
    }
  },
  {
    "table": "material_requests",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 117
    }
  },
  {
    "table": "material_requests",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 115,
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "payments",
    "column": "voided_at",
    "classification": {
      "NULL": 27
    }
  },
  {
    "table": "payments",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 27
    }
  },
  {
    "table": "payments",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 27
    }
  },
  {
    "table": "photos",
    "column": "archived_at",
    "classification": {
      "NULL": 289
    }
  },
  {
    "table": "photos",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 288,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "photos",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 288,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "purchase_order_confirmations",
    "column": "confirmed_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "purchase_order_quotations",
    "column": "quote_date",
    "classification": {
      "DATE_ONLY": 3
    }
  },
  {
    "table": "purchase_order_quotations",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "purchase_order_quotations",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "purchase_order_receipts",
    "column": "received_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "purchase_orders",
    "column": "order_date",
    "classification": {
      "DATE_ONLY": 2
    }
  },
  {
    "table": "purchase_orders",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "purchase_orders",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "qc_checks",
    "column": "archived_at",
    "classification": {
      "NULL": 435
    }
  },
  {
    "table": "receipts",
    "column": "voided_at",
    "classification": {
      "NULL": 27
    }
  },
  {
    "table": "receipts",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 27
    }
  },
  {
    "table": "sales_leads",
    "column": "follow_up_due",
    "classification": {
      "DATE_ONLY": 1
    }
  },
  {
    "table": "sales_leads",
    "column": "site_visit_date",
    "classification": {
      "NULL": 1
    }
  },
  {
    "table": "sales_leads",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "sales_leads",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "sales_quotations",
    "column": "valid_until",
    "classification": {
      "NULL": 1
    }
  },
  {
    "table": "sales_quotations",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "sales_quotations",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "service_brands",
    "column": "created_at",
    "classification": {}
  },
  {
    "table": "service_brands",
    "column": "updated_at",
    "classification": {}
  },
  {
    "table": "service_catalog_items",
    "column": "archived_at",
    "classification": {
      "NULL": 3
    }
  },
  {
    "table": "service_catalog_items",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "service_catalog_items",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "service_departments",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "service_departments",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "status_history",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "stock_inwards",
    "column": "received_at",
    "classification": {
      "NAIVE_TIMESTAMP": 3
    }
  },
  {
    "table": "suppliers",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "suppliers",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 2
    }
  },
  {
    "table": "tasks",
    "column": "archived_at",
    "classification": {
      "NULL": 145
    }
  },
  {
    "table": "tasks",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "tasks",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "tasks",
    "column": "started_at",
    "classification": {
      "NULL": 28,
      "OFFSET_INSTANT": 117
    }
  },
  {
    "table": "tasks",
    "column": "paused_at",
    "classification": {
      "NULL": 145
    }
  },
  {
    "table": "tasks",
    "column": "completed_at",
    "classification": {
      "NULL": 94,
      "OFFSET_INSTANT": 51
    }
  },
  {
    "table": "users",
    "column": "archived_at",
    "classification": {
      "NULL": 10
    }
  },
  {
    "table": "users",
    "column": "created_at",
    "classification": {
      "NAIVE_TIMESTAMP": 10
    }
  },
  {
    "table": "users",
    "column": "updated_at",
    "classification": {
      "NAIVE_TIMESTAMP": 10
    }
  },
  {
    "table": "vehicles",
    "column": "archived_at",
    "classification": {
      "NULL": 132
    }
  },
  {
    "table": "vehicles",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 132
    }
  },
  {
    "table": "vehicles",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 131,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "visits",
    "column": "received_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "visits",
    "column": "archived_at",
    "classification": {
      "NULL": 145
    }
  },
  {
    "table": "visits",
    "column": "created_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 1
    }
  },
  {
    "table": "visits",
    "column": "updated_at",
    "classification": {
      "OFFSET_INSTANT": 144,
      "NAIVE_TIMESTAMP": 1
    }
  }
]
