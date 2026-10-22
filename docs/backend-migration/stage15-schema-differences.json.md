[
  {
    "type": "table",
    "name": "booking_capacity_limits",
    "shipped": "CREATE TABLE booking_capacity_limits(booking_date text primary key, capacity integer not null, set_by integer not null, updated_at text not null, service_work_capacity integer, general_checkup_followup_capacity integer)",
    "alternate": "CREATE TABLE booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null)"
  },
  {
    "type": "table",
    "name": "bookings",
    "shipped": "CREATE TABLE bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null, mobile text not null, customer_type text not null default 'Individual', vehicle_no text not null, make text not null, model text not null, color text not null default '', requested_work text not null, booking_date text not null, arrival_window text not null default '', status text not null default 'Booked', created_by integer not null, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, created_at text not null, updated_at text not null, visit_id integer, job_card_id integer, service_type text not null default 'Service Work')",
    "alternate": "CREATE TABLE bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null, mobile text not null, customer_type text not null default 'Individual', vehicle_no text not null, make text not null, model text not null, color text not null default '', requested_work text not null, service_type text not null default 'Service Work', booking_date text not null, arrival_window text not null default '', status text not null default 'Booked', created_by integer not null, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null, updated_at text not null)"
  },
  {
    "type": "table",
    "name": "customers",
    "shipped": "CREATE TABLE customers(id integer primary key, name text, mobile text unique, type text, address text, archived_at text, archived_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE customers(id integer primary key, name text, mobile text unique, type text, archived_at text, archived_reason text, created_at text, updated_at text, address text)"
  },
  {
    "type": "table",
    "name": "estimate_items",
    "shipped": "CREATE TABLE estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real, archived_at text, archived_reason text, created_at text, updated_at text, task_list_item_id integer)",
    "alternate": "CREATE TABLE estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real, archived_at text, archived_reason text, created_at text, updated_at text, gst_type text, gst_rate real, task_list_item_id integer)"
  },
  {
    "type": "table",
    "name": "gate_passes",
    "shipped": "CREATE TABLE gate_passes(id integer primary key, job_card_id integer, invoice_id integer, gate_pass_no text, voided_at text, void_reason text, created_at text)",
    "alternate": "CREATE TABLE gate_passes(id integer primary key, job_card_id integer, gate_pass_no text, invoice_id integer, voided_at text, void_reason text, created_at text)"
  },
  {
    "type": "table",
    "name": "inventory",
    "shipped": "CREATE TABLE inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real, selling_price real default 0, archived_at text, archived_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real, archived_at text, archived_reason text, created_at text, updated_at text, selling_price real default 0)"
  },
  {
    "type": "table",
    "name": "invoice_items",
    "shipped": "CREATE TABLE invoice_items(id integer primary key, invoice_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real, material_row_id integer, archived_at text, archived_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE invoice_items(id integer primary key, invoice_id integer, kind text, description text, qty real, rate real, archived_at text, archived_reason text, created_at text, updated_at text, gst_rate real, material_row_id integer, gst_type text)"
  },
  {
    "type": "table",
    "name": "invoices",
    "shipped": "CREATE TABLE invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, discount real default 0, gst_rate real default 18, subtotal real default 0, gst_amount real default 0, total real, status text, notes text default '', document_available integer default 1, document_generated_at text, voided_at text, void_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, total real, status text, voided_at text, void_reason text, created_at text, updated_at text, discount real default 0, gst_rate real default 18, subtotal real default 0, gst_amount real default 0, notes text default '', document_available integer default 1, document_generated_at text)"
  },
  {
    "type": "table",
    "name": "job_cards",
    "shipped": "CREATE TABLE job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text, service_type text, pickup_drop text, estimated_delivery text, damage_marks text, damage_marks_recorded_at text, archived_at text, archived_reason text, created_at text, updated_at text, advisor_notes text, customer_instructions text, internal_instructions text, delivery_by text, final_km real, acknowledgement text)",
    "alternate": "CREATE TABLE job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text, archived_at text, archived_reason text, created_at text, updated_at text, advisor_notes text, customer_instructions text, internal_instructions text, delivery_by text, final_km real, acknowledgement text, service_type text, pickup_drop text, estimated_delivery text, damage_marks text, damage_marks_recorded_at text)"
  },
  {
    "type": "table",
    "name": "job_task_list_items",
    "shipped": "CREATE TABLE job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text, gst_rate real not null default 18)",
    "alternate": "CREATE TABLE job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text)"
  },
  {
    "type": "table",
    "name": "material_requests",
    "shipped": "CREATE TABLE material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real, status text not null default 'Requested', invoiced_in integer, note text, archived_at text, archived_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real, archived_at text, archived_reason text, created_at text, updated_at text, status text not null default 'Requested', invoiced_in integer, note text)"
  },
  {
    "type": "table",
    "name": "payments",
    "shipped": "CREATE TABLE payments(id integer primary key, job_card_id integer, invoice_id integer, amount real, mode text, other_detail text default '', reference text, notes text default '', voided_at text, void_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE payments(id integer primary key, job_card_id integer, amount real, mode text, reference text, voided_at text, void_reason text, created_at text, updated_at text, invoice_id integer, other_detail text default '', notes text default '')"
  },
  {
    "type": "table",
    "name": "receipts",
    "shipped": "CREATE TABLE receipts(id integer primary key, job_card_id integer, invoice_id integer, receipt_no text, voided_at text, void_reason text, created_at text)",
    "alternate": "CREATE TABLE receipts(id integer primary key, job_card_id integer, receipt_no text, invoice_id integer, voided_at text, void_reason text, created_at text)"
  },
  {
    "type": "table",
    "name": "service_catalog_items",
    "shipped": "CREATE TABLE service_catalog_items(id integer primary key, name text not null, base_rate real not null, archived_at text, archived_reason text, created_at text, updated_at text, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer)",
    "alternate": "CREATE TABLE service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text)"
  },
  {
    "type": "table",
    "name": "vehicles",
    "shipped": "CREATE TABLE vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer, engine_no text, archived_at text, archived_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer, archived_at text, archived_reason text, created_at text, updated_at text, engine_no text)"
  },
  {
    "type": "table",
    "name": "visits",
    "shipped": "CREATE TABLE visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, odo_reading real, fuel_level_value text, fuel_level_unit text, keys text, accessories text, requested_work text, photos_note text, archived_at text, archived_reason text, created_at text, updated_at text)",
    "alternate": "CREATE TABLE visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, keys text, accessories text, requested_work text, photos_note text, archived_at text, archived_reason text, created_at text, updated_at text, odo_reading real, fuel_level_value text, fuel_level_unit text)"
  }
]
