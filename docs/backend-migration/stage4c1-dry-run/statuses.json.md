[
  {
    "table": "bookings",
    "column": "status",
    "target_table": "bookings",
    "target_column": "ui_status",
    "values": {
      "\"Booked\"": 2
    },
    "native_projection": {
      "Booked": "BOOKED"
    },
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "car_segments",
    "column": "status",
    "target_table": "car_segments",
    "target_column": "status",
    "values": {},
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "checklist_cycles",
    "column": "stage",
    "target_table": "job_checklist_cycles",
    "target_column": "stage",
    "values": {
      "\"NEW\"": 28,
      "\"IN_PROGRESS\"": 63,
      "\"COMPLETED\"": 27,
      "\"CLOSED\"": 27
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "checklist_items",
    "column": "stage",
    "target_table": "job_checklist_items",
    "target_column": "stage",
    "values": {
      "\"NEW\"": 84,
      "\"IN_PROGRESS\"": 441,
      "\"COMPLETED\"": 105,
      "\"CLOSED\"": 81
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "estimates",
    "column": "status",
    "target_table": "estimates",
    "target_column": "status",
    "values": {
      "\"Draft\"": 18,
      "\"Approved\"": 126
    },
    "native_projection": {
      "Draft": "DRAFT",
      "Approved": "APPROVED"
    },
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "invoices",
    "column": "status",
    "target_table": "invoices",
    "target_column": "status",
    "values": {
      "\"Pending\"": 25,
      "\"Cleared\"": 27
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "inward_purchases",
    "column": "status",
    "target_table": "inward_purchases",
    "target_column": "status",
    "values": {},
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "job_cards",
    "column": "main_status",
    "target_table": "job_cards",
    "target_column": "status",
    "values": {
      "\"NEW\"": 28,
      "\"IN_PROGRESS\"": 63,
      "\"COMPLETED\"": 24,
      "\"CANCELLED\"": 3,
      "\"CLOSED\"": 27
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "job_cards",
    "column": "sub_status",
    "target_table": "job_cards",
    "target_column": "sub_status",
    "values": {
      "\"Gather Requirements\"": 8,
      "\"Create Estimate\"": 10,
      "\"Get Confirmation\"": 10,
      "\"Material Requested\"": 8,
      "\"Material Issued\"": 9,
      "\"Washing Needed\"": 10,
      "\"Work Started\"": 9,
      "\"Follow-up Needed\"": 9,
      "\"Photos Shared\"": 9,
      "\"QC Pending\"": 9,
      "\"Remind Customer for Sharing Google Review/Feedback\"": 24,
      "\"Invoice Ready\"": 3,
      "\"Delivered\"": 27
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "job_cards",
    "column": "qc_status",
    "target_table": "job_cards",
    "target_column": "qc_status",
    "values": {
      "\"Pending\"": 91,
      "\"Pass\"": 54
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "material_approvals",
    "column": "status",
    "target_table": "material_approvals",
    "target_column": "status",
    "values": {},
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "material_movements",
    "column": "direction",
    "target_table": "legacy_material_movements",
    "target_column": "direction",
    "values": {
      "\"STOCK_IN\"": 3
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "material_purchase_requests",
    "column": "status",
    "target_table": "material_purchase_requests",
    "target_column": "status",
    "values": {},
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "material_requests",
    "column": "status",
    "target_table": "material_requests",
    "target_column": "status",
    "values": {
      "\"Requested\"": 8,
      "\"Issued\"": 109
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "payments",
    "column": "mode",
    "target_table": "payments",
    "target_column": "mode",
    "values": {
      "\"UPI\"": 27
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "purchase_orders",
    "column": "status",
    "target_table": "purchase_orders",
    "target_column": "ui_status",
    "values": {
      "\"Closed\"": 2
    },
    "native_projection": {
      "Closed": "CLOSED"
    },
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "sales_leads",
    "column": "stage",
    "target_table": "sales_leads",
    "target_column": "stage",
    "values": {
      "\"QUOTATION_SENT\"": 1
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "sales_quotations",
    "column": "status",
    "target_table": "quotations",
    "target_column": "status",
    "values": {
      "\"DRAFT\"": 1
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "service_brands",
    "column": "status",
    "target_table": "service_brands",
    "target_column": "status",
    "values": {},
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "service_departments",
    "column": "status",
    "target_table": "service_departments",
    "target_column": "status",
    "values": {
      "\"ACTIVE\"": 2
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "status_history",
    "column": "main_status",
    "target_table": "legacy_job_status_history",
    "target_column": "main_status",
    "values": {
      "\"NEW\"": 29,
      "\"IN_PROGRESS\"": 63,
      "\"COMPLETED\"": 24,
      "\"CANCELLED\"": 3,
      "\"CLOSED\"": 27
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "status_history",
    "column": "sub_status",
    "target_table": "legacy_job_status_history",
    "target_column": "sub_status",
    "values": {
      "\"Gather Requirements\"": 10,
      "\"Create Estimate\"": 10,
      "\"Get Confirmation\"": 9,
      "\"Material Requested\"": 9,
      "\"Material Issued\"": 9,
      "\"Washing Needed\"": 9,
      "\"Work Started\"": 9,
      "\"Follow-up Needed\"": 9,
      "\"Photos Shared\"": 9,
      "\"QC Pending\"": 9,
      "\"Customer Verification\"": 9,
      "\"Invoice Ready\"": 9,
      "\"Payment Received\"": 9,
      "\"Receipt Generated\"": 9,
      "\"Gate Pass Generated\"": 9,
      "\"Delivered\"": 9
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "suppliers",
    "column": "status",
    "target_table": "suppliers",
    "target_column": "status",
    "values": {
      "\"Active\"": 2
    },
    "native_projection": {},
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  },
  {
    "table": "tasks",
    "column": "status",
    "target_table": "technician_tasks",
    "target_column": "ui_status",
    "values": {
      "\"Pending\"": 28,
      "\"Started\"": 63,
      "\"Completed\"": 54
    },
    "native_projection": {
      "Pending": "PENDING",
      "Started": "IN_PROGRESS",
      "Completed": "COMPLETED"
    },
    "rule": "Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated."
  }
]
