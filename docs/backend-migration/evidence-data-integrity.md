# Indexes and relationship reconciliation

Read-only inspection. Declared constraints and inferred application links are distinguished. A foreign_key_check with no declared FKs cannot establish integrity of every application relationship.

## inward_supplier_invoice_received

{"table": "inward_purchases", "sql": "CREATE UNIQUE INDEX inward_supplier_invoice_received on inward_purchases(supplier_id, supplier_invoice_no) where status in ('Received','Submitted')", "index_info": [[0, 1, "supplier_id"], [1, 2, "supplier_invoice_no"]]}

## purchase_orders_number_unique

{"table": "purchase_orders", "sql": "CREATE UNIQUE INDEX purchase_orders_number_unique on purchase_orders(po_number)", "index_info": [[0, 2, "po_number"]]}

## sqlite_autoindex_advisor_attendance_1

{"table": "advisor_attendance", "sql": null, "index_info": [[0, 0, "user_id"], [1, 1, "date"]]}

## sqlite_autoindex_booking_capacity_limits_1

{"table": "booking_capacity_limits", "sql": null, "index_info": [[0, 0, "booking_date"]]}

## sqlite_autoindex_car_segments_1

{"table": "car_segments", "sql": null, "index_info": [[0, 1, "name"]]}

## sqlite_autoindex_checklist_cycles_1

{"table": "checklist_cycles", "sql": null, "index_info": [[0, 1, "job_card_id"], [1, 2, "stage"], [2, 3, "cycle_number"]]}

## sqlite_autoindex_checklist_items_1

{"table": "checklist_items", "sql": null, "index_info": [[0, 1, "checklist_cycle_id"], [1, 5, "item_key"]]}

## sqlite_autoindex_customers_1

{"table": "customers", "sql": null, "index_info": [[0, 2, "mobile"]]}

## sqlite_autoindex_inward_purchase_revisions_1

{"table": "inward_purchase_revisions", "sql": null, "index_info": [[0, 1, "purchase_id"], [1, 2, "revision_no"]]}

## sqlite_autoindex_job_cards_1

{"table": "job_cards", "sql": null, "index_info": [[0, 1, "job_no"]]}

## sqlite_autoindex_material_approvals_1

{"table": "material_approvals", "sql": null, "index_info": [[0, 1, "job_card_id"]]}

## sqlite_autoindex_purchase_order_confirmations_1

{"table": "purchase_order_confirmations", "sql": null, "index_info": [[0, 2, "purchase_order_line_id"]]}

## sqlite_autoindex_sales_quotations_1

{"table": "sales_quotations", "sql": null, "index_info": [[0, 2, "quotation_no"]]}

## sqlite_autoindex_service_advisor_teams_1

{"table": "service_advisor_teams", "sql": null, "index_info": [[0, 2, "advisor_id"]]}

## sqlite_autoindex_service_advisor_teams_2

{"table": "service_advisor_teams", "sql": null, "index_info": [[0, 0, "department_id"], [1, 2, "advisor_id"]]}

## sqlite_autoindex_service_brands_1

{"table": "service_brands", "sql": null, "index_info": [[0, 1, "name"]]}

## sqlite_autoindex_service_department_managers_1

{"table": "service_department_managers", "sql": null, "index_info": [[0, 0, "department_id"], [1, 1, "manager_id"]]}

## sqlite_autoindex_service_departments_1

{"table": "service_departments", "sql": null, "index_info": [[0, 1, "name"]]}

## sqlite_autoindex_users_1

{"table": "users", "sql": null, "index_info": [[0, 1, "email"]]}

## sqlite_autoindex_vehicles_1

{"table": "vehicles", "sql": null, "index_info": [[0, 2, "number"]]}

## Application-linked orphan checks

| Child | Field | Parent | Non-null/nonzero values without parent |
|---|---|---|---:|
| vehicles | customer_id | customers | 0 |
| visits | customer_id | customers | 0 |
| visits | vehicle_id | vehicles | 0 |
| job_cards | visit_id | visits | 0 |
| job_cards | advisor_id | users | 0 |
| job_cards | technician_id | users | 0 |
| estimates | job_card_id | job_cards | 0 |
| estimate_items | estimate_id | estimates | 0 |
| invoices | job_card_id | job_cards | 0 |
| invoice_items | invoice_id | invoices | 0 |
| payments | invoice_id | invoices | 0 |
| receipts | invoice_id | invoices | 0 |
| gate_passes | job_card_id | job_cards | 0 |
| photos | job_card_id | job_cards | 0 |
| tasks | job_card_id | job_cards | 0 |
| qc_checks | job_card_id | job_cards | 0 |
| material_requests | job_card_id | job_cards | 0 |
| material_requests | item_id | inventory | 0 |
| sales_quotation_lines | quotation_id | sales_quotations | 0 |
| sales_quotations | lead_id | sales_leads | 0 |

Declared foreign-key rows across shipped schema: 0. Checks above ignore zero/null sentinel values and are not exhaustive semantic reconciliation.