[
  {
    "table_name": "advisor_attendance",
    "conname": "s4b_ck_advisor_attendance_present",
    "contype": "c",
    "definition": "CHECK ((present = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
    "convalidated": true
  },
  {
    "table_name": "advisor_attendance",
    "conname": "s4b_ck_advisor_attendance_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "approvals",
    "conname": "s4b_ck_approvals_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "booking_call_logs",
    "conname": "s4b_ck_booking_call_logs_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "booking_capacity_limits",
    "conname": "booking_capacity_limits_general_checkup_followup_capacity_check",
    "contype": "c",
    "definition": "CHECK ((general_checkup_followup_capacity >= 0))",
    "convalidated": true
  },
  {
    "table_name": "booking_capacity_limits",
    "conname": "booking_capacity_limits_service_work_capacity_check",
    "contype": "c",
    "definition": "CHECK ((service_work_capacity >= 0))",
    "convalidated": true
  },
  {
    "table_name": "booking_capacity_limits",
    "conname": "s4b_ck_booking_capacity_limits_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "booking_capacity_overrides",
    "conname": "s4b_ck_booking_capacity_overrides_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "booking_events",
    "conname": "s4b_ck_booking_events_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "bookings",
    "conname": "bookings_requested_work_check",
    "contype": "c",
    "definition": "CHECK ((btrim(requested_work) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "bookings",
    "conname": "bookings_service_type_check",
    "contype": "c",
    "definition": "CHECK ((service_type = ANY (ARRAY['Service Work'::text, 'General Checkup / Follow-up'::text])))",
    "convalidated": true
  },
  {
    "table_name": "bookings",
    "conname": "bookings_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['BOOKED'::text, 'CONFIRMED'::text, 'RESCHEDULED'::text, 'ARRIVED'::text, 'CANCELLED'::text, 'NO_SHOW'::text])))",
    "convalidated": true
  },
  {
    "table_name": "bookings",
    "conname": "s4b_ck_bookings_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "car_segments",
    "conname": "s4b_ck_car_segments_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "catalogue_items",
    "conname": "catalogue_items_low_stock_qty_check",
    "contype": "c",
    "definition": "CHECK ((low_stock_qty >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "catalogue_items",
    "conname": "catalogue_items_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "catalogue_items",
    "conname": "catalogue_items_selling_price_check",
    "contype": "c",
    "definition": "CHECK ((selling_price >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "catalogue_items",
    "conname": "catalogue_items_sku_check",
    "contype": "c",
    "definition": "CHECK ((btrim(sku) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "catalogue_items",
    "conname": "catalogue_items_unit_check",
    "contype": "c",
    "definition": "CHECK ((btrim(unit) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "catalogue_items",
    "conname": "s4b_ck_catalogue_items_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "command_receipts",
    "conname": "s4b_ck_command_receipts_hash",
    "contype": "c",
    "definition": "CHECK ((payload_sha256 ~ '^[0-9a-f]{64}$'::text))",
    "convalidated": true
  },
  {
    "table_name": "credit_notes",
    "conname": "credit_notes_amount_paise_check",
    "contype": "c",
    "definition": "CHECK ((amount_paise > 0))",
    "convalidated": true
  },
  {
    "table_name": "credit_notes",
    "conname": "credit_notes_reason_check",
    "contype": "c",
    "definition": "CHECK ((btrim(reason) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "customers",
    "conname": "customers_mobile_check",
    "contype": "c",
    "definition": "CHECK ((btrim(mobile) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "customers",
    "conname": "customers_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "customers",
    "conname": "customers_type_check",
    "contype": "c",
    "definition": "CHECK ((btrim(type) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "customers",
    "conname": "s4b_ck_customers_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "delivery_acknowledgements",
    "conname": "delivery_acknowledgements_acknowledgement_check",
    "contype": "c",
    "definition": "CHECK ((length(btrim(acknowledgement)) > 0))",
    "convalidated": true
  },
  {
    "table_name": "delivery_acknowledgements",
    "conname": "delivery_acknowledgements_delivered_by_check",
    "contype": "c",
    "definition": "CHECK ((length(btrim(delivered_by)) > 0))",
    "convalidated": true
  },
  {
    "table_name": "delivery_acknowledgements",
    "conname": "delivery_acknowledgements_final_odometer_check",
    "contype": "c",
    "definition": "CHECK ((final_odometer >= 0))",
    "convalidated": true
  },
  {
    "table_name": "document_sequences",
    "conname": "document_sequences_document_type_check",
    "contype": "c",
    "definition": "CHECK ((document_type = ANY (ARRAY['INVOICE'::text, 'RECEIPT'::text, 'GATE_PASS'::text, 'CREDIT_NOTE'::text])))",
    "convalidated": true
  },
  {
    "table_name": "document_sequences",
    "conname": "document_sequences_fiscal_year_check",
    "contype": "c",
    "definition": "CHECK ((fiscal_year ~ '^FY[0-9]{4}-[0-9]{2}$'::text))",
    "convalidated": true
  },
  {
    "table_name": "document_sequences",
    "conname": "document_sequences_next_value_check",
    "contype": "c",
    "definition": "CHECK ((next_value > 0))",
    "convalidated": true
  },
  {
    "table_name": "document_snapshots",
    "conname": "s4b_ck_document_snapshots_availability",
    "contype": "c",
    "definition": "CHECK (((availability = ANY (ARRAY['UNAVAILABLE'::text, 'READY'::text])) AND ((availability <> 'READY'::text) OR (html IS NOT NULL) OR (asset_id IS NOT NULL))))",
    "convalidated": true
  },
  {
    "table_name": "document_snapshots",
    "conname": "s4b_ck_document_snapshots_version",
    "contype": "c",
    "definition": "CHECK ((snapshot_version > 0))",
    "convalidated": true
  },
  {
    "table_name": "estimate_decisions",
    "conname": "estimate_decisions_channel_check",
    "contype": "c",
    "definition": "CHECK ((channel = ANY (ARRAY['in_person'::text, 'phone'::text, 'whatsapp'::text, 'email'::text, 'other'::text])))",
    "convalidated": true
  },
  {
    "table_name": "estimate_decisions",
    "conname": "estimate_decisions_outcome_check",
    "contype": "c",
    "definition": "CHECK ((outcome = ANY (ARRAY['approved'::text, 'declined'::text])))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "estimate_lines_description_check",
    "contype": "c",
    "definition": "CHECK ((btrim(description) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "estimate_lines_gst_rate_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "estimate_lines_kind_check",
    "contype": "c",
    "definition": "CHECK ((btrim(kind) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "estimate_lines_line_no_check",
    "contype": "c",
    "definition": "CHECK ((line_no > 0))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "estimate_lines_quantity_check",
    "contype": "c",
    "definition": "CHECK ((quantity > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "estimate_lines_rate_check",
    "contype": "c",
    "definition": "CHECK ((rate >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "estimate_lines",
    "conname": "s4b_ck_estimate_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "estimates",
    "conname": "estimates_discount_check",
    "contype": "c",
    "definition": "CHECK ((discount >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "estimates",
    "conname": "estimates_gst_rate_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
    "convalidated": true
  },
  {
    "table_name": "estimates",
    "conname": "estimates_revision_check",
    "contype": "c",
    "definition": "CHECK ((revision > 0))",
    "convalidated": true
  },
  {
    "table_name": "estimates",
    "conname": "estimates_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['DRAFT'::text, 'APPROVED'::text, 'DECLINED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "estimates",
    "conname": "s4b_ck_estimates_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "evidence_attachments",
    "conname": "evidence_attachments_category_check",
    "contype": "c",
    "definition": "CHECK ((category = ANY (ARRAY['before_work'::text, 'after_work'::text, 'work_evidence'::text, 'qc_evidence'::text])))",
    "convalidated": true
  },
  {
    "table_name": "evidence_attachments",
    "conname": "evidence_attachments_sha256_check",
    "contype": "c",
    "definition": "CHECK ((length(sha256) = 64))",
    "convalidated": true
  },
  {
    "table_name": "evidence_attachments",
    "conname": "evidence_attachments_size_bytes_check",
    "contype": "c",
    "definition": "CHECK (((size_bytes > 0) AND (size_bytes <= 10485760)))",
    "convalidated": true
  },
  {
    "table_name": "financial_document_events",
    "conname": "financial_document_events_event_type_check",
    "contype": "c",
    "definition": "CHECK ((event_type = ANY (ARRAY['VOID'::text, 'REPLACED'::text, 'CREDITED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "financial_document_events",
    "conname": "financial_document_events_reason_check",
    "contype": "c",
    "definition": "CHECK ((length(btrim(reason)) > 0))",
    "convalidated": true
  },
  {
    "table_name": "financial_documents",
    "conname": "financial_documents_artifact_check",
    "contype": "c",
    "definition": "CHECK (((octet_length(artifact) > 0) AND (octet_length(artifact) <= 10485760)))",
    "convalidated": true
  },
  {
    "table_name": "financial_documents",
    "conname": "financial_documents_content_type_check",
    "contype": "c",
    "definition": "CHECK ((content_type = ANY (ARRAY['text/html'::text, 'application/pdf'::text])))",
    "convalidated": true
  },
  {
    "table_name": "financial_documents",
    "conname": "financial_documents_document_type_check",
    "contype": "c",
    "definition": "CHECK ((document_type = ANY (ARRAY['INVOICE'::text, 'RECEIPT'::text, 'GATE_PASS'::text, 'CREDIT_NOTE'::text])))",
    "convalidated": true
  },
  {
    "table_name": "financial_documents",
    "conname": "financial_documents_sequence_value_check",
    "contype": "c",
    "definition": "CHECK ((sequence_value > 0))",
    "convalidated": true
  },
  {
    "table_name": "financial_documents",
    "conname": "financial_documents_sha256_check",
    "contype": "c",
    "definition": "CHECK ((length(sha256) = 64))",
    "convalidated": true
  },
  {
    "table_name": "followups",
    "conname": "followups_note_check",
    "contype": "c",
    "definition": "CHECK ((btrim(note) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "followups",
    "conname": "followups_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['OPEN'::text, 'COMPLETED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "followups",
    "conname": "followups_version_check",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "followups",
    "conname": "s4b_ck_followups_done",
    "contype": "c",
    "definition": "CHECK ((done = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
    "convalidated": true
  },
  {
    "table_name": "import_source_records",
    "conname": "s4b_ck_import_source_records_disposition",
    "contype": "c",
    "definition": "CHECK (((disposition = ANY (ARRAY['MAPPED'::text, 'PRESERVED_HISTORY'::text, 'CREDENTIAL_EXCLUDED'::text, 'BLOCKED'::text])) AND ((disposition <> 'BLOCKED'::text) OR (exception IS NOT NULL))))",
    "convalidated": true
  },
  {
    "table_name": "import_source_records",
    "conname": "s4b_ck_import_source_records_hashes",
    "contype": "c",
    "definition": "CHECK (((source_sha256 ~ '^[0-9a-f]{64}$'::text) AND (row_sha256 ~ '^[0-9a-f]{64}$'::text)))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_description_check",
    "contype": "c",
    "definition": "CHECK ((length(btrim(description)) > 0))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_gst_rate_bps_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate_bps >= 0) AND (gst_rate_bps <= 10000)))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_line_no_check",
    "contype": "c",
    "definition": "CHECK ((line_no > 0))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_quantity_check",
    "contype": "c",
    "definition": "CHECK ((quantity > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_tax_paise_check",
    "contype": "c",
    "definition": "CHECK ((tax_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_taxable_paise_check",
    "contype": "c",
    "definition": "CHECK ((taxable_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_total_paise_check",
    "contype": "c",
    "definition": "CHECK ((total_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "invoice_lines_unit_amount_paise_check",
    "contype": "c",
    "definition": "CHECK ((unit_amount_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoice_lines",
    "conname": "s4b_ck_invoice_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "invoices",
    "conname": "invoices_discount_paise_check",
    "contype": "c",
    "definition": "CHECK ((discount_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoices",
    "conname": "invoices_subtotal_paise_check",
    "contype": "c",
    "definition": "CHECK ((subtotal_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoices",
    "conname": "invoices_tax_paise_check",
    "contype": "c",
    "definition": "CHECK ((tax_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoices",
    "conname": "invoices_total_paise_check",
    "contype": "c",
    "definition": "CHECK ((total_paise >= 0))",
    "convalidated": true
  },
  {
    "table_name": "invoices",
    "conname": "s4b_ck_invoices_document_available",
    "contype": "c",
    "definition": "CHECK ((document_available = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
    "convalidated": true
  },
  {
    "table_name": "invoices",
    "conname": "s4b_ck_invoices_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "inward_purchase_attachments",
    "conname": "s4b_ck_inward_purchase_attachments_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "inward_purchase_events",
    "conname": "s4b_ck_inward_purchase_events_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "inward_purchase_lines",
    "conname": "s4b_ck_inward_purchase_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "inward_purchase_revision_lines",
    "conname": "s4b_ck_inward_purchase_revision_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "inward_purchase_revisions",
    "conname": "s4b_ck_inward_purchase_revisions_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "inward_purchases",
    "conname": "s4b_ck_inward_purchases_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "job_assignment_history",
    "conname": "job_assignment_history_action_check",
    "contype": "c",
    "definition": "CHECK ((action = ANY (ARRAY['ROUTED_TO_MANAGER'::text, 'ADVISOR_ASSIGNED'::text, 'MANAGER_TRANSFERRED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "job_cards",
    "conname": "job_cards_assignment_state_check",
    "contype": "c",
    "definition": "CHECK ((assignment_state = ANY (ARRAY['LEGACY'::text, 'AWAITING_ADVISOR_ASSIGNMENT'::text, 'ASSIGNED_TO_ADVISOR'::text])))",
    "convalidated": true
  },
  {
    "table_name": "job_cards",
    "conname": "job_cards_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['NEW'::text, 'IN_PROGRESS'::text, 'HOLD'::text, 'COMPLETED'::text, 'CANCELLED'::text, 'CLOSED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "job_cards",
    "conname": "s4b_ck_job_cards_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "job_cards",
    "conname": "s4b_ck_job_cards_washing_needed",
    "contype": "c",
    "definition": "CHECK ((washing_needed = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
    "convalidated": true
  },
  {
    "table_name": "job_checklist_cycles",
    "conname": "job_checklist_cycles_cycle_number_check",
    "contype": "c",
    "definition": "CHECK ((cycle_number > 0))",
    "convalidated": true
  },
  {
    "table_name": "job_checklist_cycles",
    "conname": "s4b_ck_job_checklist_cycles_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "job_checklist_items",
    "conname": "s4b_ck_job_checklist_items_legacy_checked_by",
    "contype": "c",
    "definition": "CHECK (((legacy_checked_by IS NULL) OR (legacy_checked_by = 0)))",
    "convalidated": true
  },
  {
    "table_name": "job_checklist_items",
    "conname": "s4b_ck_job_checklist_items_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "job_media",
    "conname": "s4b_ck_job_media_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "job_service_tasks",
    "conname": "job_service_tasks_base_rate_check",
    "contype": "c",
    "definition": "CHECK ((base_rate >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "job_service_tasks",
    "conname": "job_service_tasks_gst_rate_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
    "convalidated": true
  },
  {
    "table_name": "job_service_tasks",
    "conname": "job_service_tasks_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "job_service_tasks",
    "conname": "s4b_ck_job_service_tasks_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "legacy_gate_passes",
    "conname": "s4b_ck_legacy_gate_passes_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "legacy_invoice_events",
    "conname": "s4b_ck_legacy_invoice_events_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "legacy_job_status_history",
    "conname": "s4b_ck_legacy_job_status_history_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "legacy_material_movements",
    "conname": "s4b_ck_legacy_material_movements_legacy_job_card_id",
    "contype": "c",
    "definition": "CHECK (((legacy_job_card_id IS NULL) OR (legacy_job_card_id = 0)))",
    "convalidated": true
  },
  {
    "table_name": "legacy_material_movements",
    "conname": "s4b_ck_legacy_material_movements_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "legacy_receipts",
    "conname": "s4b_ck_legacy_receipts_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "local_purchases",
    "conname": "s4b_ck_local_purchases_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "material_approval_events",
    "conname": "s4b_ck_material_approval_events_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "material_approvals",
    "conname": "s4b_ck_material_approvals_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "material_events",
    "conname": "s4b_ck_material_events_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "material_ledger",
    "conname": "material_ledger_entry_type_check",
    "contype": "c",
    "definition": "CHECK ((entry_type = ANY (ARRAY['RESERVE'::text, 'ISSUE'::text, 'RETURN'::text, 'WASTE'::text, 'RELEASE'::text, 'ISSUE_REVERSAL'::text])))",
    "convalidated": true
  },
  {
    "table_name": "material_ledger",
    "conname": "material_ledger_quantity_check",
    "contype": "c",
    "definition": "CHECK ((quantity > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "material_purchase_requests",
    "conname": "s4b_ck_material_purchase_requests_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "material_requests",
    "conname": "s4b_ck_material_requests_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "material_reservations",
    "conname": "material_reservations_reserved_qty_check",
    "contype": "c",
    "definition": "CHECK ((reserved_qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "material_reservations",
    "conname": "material_reservations_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['RESERVED'::text, 'PARTIALLY_ISSUED'::text, 'ISSUED'::text, 'RELEASED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "material_shortages",
    "conname": "material_shortages_requested_qty_check",
    "contype": "c",
    "definition": "CHECK ((requested_qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "material_shortages",
    "conname": "material_shortages_shortage_qty_check",
    "contype": "c",
    "definition": "CHECK ((shortage_qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "material_shortages",
    "conname": "material_shortages_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['OPEN'::text, 'PROCURED'::text, 'CANCELLED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "object_assets",
    "conname": "s4b_ck_object_assets_sha",
    "contype": "c",
    "definition": "CHECK ((sha256 ~ '^[0-9a-f]{64}$'::text))",
    "convalidated": true
  },
  {
    "table_name": "object_assets",
    "conname": "s4b_ck_object_assets_size",
    "contype": "c",
    "definition": "CHECK ((byte_size >= 0))",
    "convalidated": true
  },
  {
    "table_name": "object_assets",
    "conname": "s4b_ck_object_assets_state",
    "contype": "c",
    "definition": "CHECK ((state = ANY (ARRAY['STAGED'::text, 'READY'::text, 'RETIRED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "outbox_events",
    "conname": "s4b_ck_outbox_events_attempts",
    "contype": "c",
    "definition": "CHECK ((attempts >= 0))",
    "convalidated": true
  },
  {
    "table_name": "outbox_events",
    "conname": "s4b_ck_outbox_events_status",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'PROCESSING'::text, 'DONE'::text, 'FAILED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "payments",
    "conname": "payments_amount_paise_check",
    "contype": "c",
    "definition": "CHECK ((amount_paise > 0))",
    "convalidated": true
  },
  {
    "table_name": "payments",
    "conname": "payments_method_check",
    "contype": "c",
    "definition": "CHECK ((method = ANY (ARRAY['CASH'::text, 'CARD'::text, 'UPI'::text, 'BANK_TRANSFER'::text, 'OTHER'::text])))",
    "convalidated": true
  },
  {
    "table_name": "payments",
    "conname": "payments_supporting_artifact_check",
    "contype": "c",
    "definition": "CHECK (((supporting_artifact IS NULL) OR (octet_length(supporting_artifact) <= 10485760)))",
    "convalidated": true
  },
  {
    "table_name": "payments",
    "conname": "payments_supporting_content_type_check",
    "contype": "c",
    "definition": "CHECK (((supporting_content_type IS NULL) OR (supporting_content_type = ANY (ARRAY['image/jpeg'::text, 'image/png'::text, 'application/pdf'::text]))))",
    "convalidated": true
  },
  {
    "table_name": "payments",
    "conname": "payments_supporting_sha256_check",
    "contype": "c",
    "definition": "CHECK (((supporting_sha256 IS NULL) OR (length(supporting_sha256) = 64)))",
    "convalidated": true
  },
  {
    "table_name": "payments",
    "conname": "s4b_ck_payments_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "platform_billing",
    "conname": "platform_billing_agreed_price_check",
    "contype": "c",
    "definition": "CHECK ((agreed_price >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "platform_billing",
    "conname": "platform_billing_billing_cycle_check",
    "contype": "c",
    "definition": "CHECK ((billing_cycle = ANY (ARRAY['monthly'::text, 'quarterly'::text, 'annual'::text])))",
    "convalidated": true
  },
  {
    "table_name": "platform_billing",
    "conname": "platform_billing_payment_status_check",
    "contype": "c",
    "definition": "CHECK ((payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'overdue'::text, 'waived'::text])))",
    "convalidated": true
  },
  {
    "table_name": "platform_users",
    "conname": "platform_users_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_confirmations",
    "conname": "purchase_order_delivery_confirmations_accepted_qty_check",
    "contype": "c",
    "definition": "CHECK ((accepted_qty >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_confirmations",
    "conname": "purchase_order_delivery_confirmations_check",
    "contype": "c",
    "definition": "CHECK (((accepted_qty + rejected_qty) > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_confirmations",
    "conname": "purchase_order_delivery_confirmations_rejected_qty_check",
    "contype": "c",
    "definition": "CHECK ((rejected_qty >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_confirmations",
    "conname": "purchase_order_delivery_confirmations_request_key_check",
    "contype": "c",
    "definition": "CHECK ((btrim(request_key) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_confirmations",
    "conname": "s4b_ck_purchase_order_delivery_confirmations_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_receipt_lines",
    "conname": "purchase_order_delivery_receipt_lines_delivered_qty_check",
    "contype": "c",
    "definition": "CHECK ((delivered_qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_receipt_lines",
    "conname": "s4b_ck_purchase_order_delivery_receipt_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_receipts",
    "conname": "purchase_order_delivery_receipts_request_key_check",
    "contype": "c",
    "definition": "CHECK ((btrim(request_key) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_delivery_receipts",
    "conname": "s4b_ck_purchase_order_delivery_receipts_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_lines",
    "conname": "purchase_order_lines_discount_check",
    "contype": "c",
    "definition": "CHECK ((discount >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_lines",
    "conname": "purchase_order_lines_gst_rate_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_lines",
    "conname": "purchase_order_lines_line_no_check",
    "contype": "c",
    "definition": "CHECK ((line_no > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_lines",
    "conname": "purchase_order_lines_ordered_qty_check",
    "contype": "c",
    "definition": "CHECK ((ordered_qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_lines",
    "conname": "purchase_order_lines_unit_cost_check",
    "contype": "c",
    "definition": "CHECK ((unit_cost >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_lines",
    "conname": "s4b_ck_purchase_order_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_order_quotations",
    "conname": "s4b_ck_purchase_order_quotations_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_orders",
    "conname": "purchase_orders_po_number_check",
    "contype": "c",
    "definition": "CHECK ((btrim(po_number) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "purchase_orders",
    "conname": "purchase_orders_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'PARTIALLY_RECEIVED'::text, 'READY_TO_CLOSE'::text, 'CLOSED'::text, 'CANCELLED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "purchase_orders",
    "conname": "s4b_ck_purchase_orders_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_request_lines",
    "conname": "purchase_request_lines_check",
    "contype": "c",
    "definition": "CHECK ((((item_id IS NOT NULL) AND (new_item_name IS NULL)) OR ((item_id IS NULL) AND (btrim(new_item_name) <> ''::text))))",
    "convalidated": true
  },
  {
    "table_name": "purchase_request_lines",
    "conname": "purchase_request_lines_line_no_check",
    "contype": "c",
    "definition": "CHECK ((line_no > 0))",
    "convalidated": true
  },
  {
    "table_name": "purchase_request_lines",
    "conname": "purchase_request_lines_ordered_qty_check",
    "contype": "c",
    "definition": "CHECK ((ordered_qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_request_lines",
    "conname": "purchase_request_lines_unit_check",
    "contype": "c",
    "definition": "CHECK ((btrim(unit) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "purchase_request_quotes",
    "conname": "purchase_request_quotes_unit_cost_check",
    "contype": "c",
    "definition": "CHECK ((unit_cost >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "purchase_requests",
    "conname": "purchase_requests_request_number_check",
    "contype": "c",
    "definition": "CHECK ((btrim(request_number) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "purchase_requests",
    "conname": "purchase_requests_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['REQUESTED'::text, 'APPROVED'::text, 'ISSUED'::text, 'CANCELLED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "qc_checks",
    "conname": "qc_checks_label_check",
    "contype": "c",
    "definition": "CHECK ((btrim(label) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "qc_checks",
    "conname": "qc_checks_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'FAILED'::text, 'PASSED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "qc_checks",
    "conname": "s4b_ck_qc_checks_passed",
    "contype": "c",
    "definition": "CHECK ((passed = ANY (ARRAY[(0)::bigint, (1)::bigint])))",
    "convalidated": true
  },
  {
    "table_name": "qc_checks",
    "conname": "s4b_ck_qc_checks_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "qc_results",
    "conname": "qc_results_outcome_check",
    "contype": "c",
    "definition": "CHECK ((outcome = ANY (ARRAY['FAILED'::text, 'PASSED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "quotation_lines",
    "conname": "quotation_lines_description_check",
    "contype": "c",
    "definition": "CHECK ((btrim(description) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "quotation_lines",
    "conname": "quotation_lines_gst_rate_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
    "convalidated": true
  },
  {
    "table_name": "quotation_lines",
    "conname": "quotation_lines_line_no_check",
    "contype": "c",
    "definition": "CHECK ((line_no > 0))",
    "convalidated": true
  },
  {
    "table_name": "quotation_lines",
    "conname": "quotation_lines_quantity_check",
    "contype": "c",
    "definition": "CHECK ((quantity > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "quotation_lines",
    "conname": "quotation_lines_rate_check",
    "contype": "c",
    "definition": "CHECK ((rate >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "quotation_lines",
    "conname": "s4b_ck_quotation_lines_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "quotations",
    "conname": "quotations_discount_check",
    "contype": "c",
    "definition": "CHECK ((discount >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "quotations",
    "conname": "quotations_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'ACCEPTED'::text, 'REJECTED'::text, 'EXPIRED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "quotations",
    "conname": "s4b_ck_quotations_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "refunds",
    "conname": "refunds_amount_paise_check",
    "contype": "c",
    "definition": "CHECK ((amount_paise > 0))",
    "convalidated": true
  },
  {
    "table_name": "refunds",
    "conname": "refunds_method_check",
    "contype": "c",
    "definition": "CHECK ((method = ANY (ARRAY['CASH'::text, 'CARD'::text, 'UPI'::text, 'BANK_TRANSFER'::text, 'OTHER'::text])))",
    "convalidated": true
  },
  {
    "table_name": "report_template_versions",
    "conname": "s4b_ck_report_template_versions_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "sales_leads",
    "conname": "s4b_ck_sales_leads_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "sales_leads",
    "conname": "sales_leads_display_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(display_name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "sales_leads",
    "conname": "sales_leads_phone_check",
    "contype": "c",
    "definition": "CHECK ((btrim(phone) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "sales_leads",
    "conname": "sales_leads_stage_check",
    "contype": "c",
    "definition": "CHECK ((stage = ANY (ARRAY['NEW'::text, 'QUALIFIED'::text, 'QUOTATION_SENT'::text, 'WON'::text, 'LOST'::text])))",
    "convalidated": true
  },
  {
    "table_name": "sales_leads",
    "conname": "sales_leads_temperature_check",
    "contype": "c",
    "definition": "CHECK ((temperature = ANY (ARRAY['HOT'::text, 'WARM'::text, 'COLD'::text])))",
    "convalidated": true
  },
  {
    "table_name": "service_advisor_teams",
    "conname": "s4b_ck_service_advisor_teams_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "service_brands",
    "conname": "s4b_ck_service_brands_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "service_department_managers",
    "conname": "s4b_ck_service_department_managers_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "service_departments",
    "conname": "s4b_ck_service_departments_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "service_departments",
    "conname": "service_departments_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "service_departments",
    "conname": "service_departments_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "service_task_catalog",
    "conname": "s4b_ck_service_task_catalog_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "service_task_catalog",
    "conname": "service_task_catalog_gst_rate_check",
    "contype": "c",
    "definition": "CHECK (((gst_rate >= (0)::numeric) AND (gst_rate <= (100)::numeric)))",
    "convalidated": true
  },
  {
    "table_name": "service_task_catalog",
    "conname": "service_task_catalog_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "service_task_catalog",
    "conname": "service_task_catalog_rate_check",
    "contype": "c",
    "definition": "CHECK ((rate >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "service_task_catalog",
    "conname": "service_task_catalog_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "stock_inwards",
    "conname": "s4b_ck_stock_inwards_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "stock_inwards",
    "conname": "stock_inwards_qty_check",
    "contype": "c",
    "definition": "CHECK ((qty > (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "stock_inwards",
    "conname": "stock_inwards_unit_cost_check",
    "contype": "c",
    "definition": "CHECK ((unit_cost >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "s4b_ck_stock_ledger_legacy_job_card_id",
    "contype": "c",
    "definition": "CHECK (((legacy_job_card_id IS NULL) OR (legacy_job_card_id = 0)))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "s4b_ck_stock_ledger_legacy_material_row_id",
    "contype": "c",
    "definition": "CHECK (((legacy_material_row_id IS NULL) OR (legacy_material_row_id = 0)))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "s4b_ck_stock_ledger_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "stock_ledger_entry_type_check",
    "contype": "c",
    "definition": "CHECK ((entry_type = ANY (ARRAY['INWARD'::text, 'ADJUSTMENT'::text, 'ISSUE'::text, 'RETURN'::text, 'WASTE'::text, 'ISSUE_REVERSAL'::text])))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "stock_ledger_quantity_check",
    "contype": "c",
    "definition": "CHECK ((quantity <> (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "stock_ledger_reason_check",
    "contype": "c",
    "definition": "CHECK ((btrim(reason) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "stock_ledger",
    "conname": "stock_ledger_unit_cost_check",
    "contype": "c",
    "definition": "CHECK ((unit_cost >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "suppliers",
    "conname": "s4b_ck_suppliers_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "suppliers",
    "conname": "suppliers_name_check",
    "contype": "c",
    "definition": "CHECK ((btrim(name) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "support_emulations",
    "conname": "support_emulations_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ENDED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "technician_tasks",
    "conname": "s4b_ck_technician_tasks_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "technician_tasks",
    "conname": "technician_tasks_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'IN_PROGRESS'::text, 'PAUSED'::text, 'COMPLETED'::text, 'CANCELLED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "technician_tasks",
    "conname": "technician_tasks_title_check",
    "contype": "c",
    "definition": "CHECK ((btrim(title) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "tenant_admin_invitations",
    "conname": "tenant_admin_invitations_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['PENDING'::text, 'ACCEPTED'::text, 'CANCELLED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "tenant_memberships",
    "conname": "tenant_memberships_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['INVITED'::text, 'ACTIVE'::text, 'ARCHIVED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "tenant_memberships",
    "conname": "tenant_memberships_version_check",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "tenant_roles",
    "conname": "tenant_roles_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'ARCHIVED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "tenant_roles",
    "conname": "tenant_roles_version_check",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "tenants",
    "conname": "tenants_lifecycle_state_check",
    "contype": "c",
    "definition": "CHECK ((lifecycle_state = ANY (ARRAY['trial'::text, 'active'::text, 'payment_due'::text, 'suspended'::text, 'closed'::text])))",
    "convalidated": true
  },
  {
    "table_name": "vehicles",
    "conname": "s4b_ck_vehicles_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "vehicles",
    "conname": "vehicles_km_check",
    "contype": "c",
    "definition": "CHECK ((km >= 0))",
    "convalidated": true
  },
  {
    "table_name": "vehicles",
    "conname": "vehicles_make_check",
    "contype": "c",
    "definition": "CHECK ((btrim(make) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "vehicles",
    "conname": "vehicles_model_check",
    "contype": "c",
    "definition": "CHECK ((btrim(model) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "vehicles",
    "conname": "vehicles_number_check",
    "contype": "c",
    "definition": "CHECK ((btrim(number) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "visits",
    "conname": "s4b_ck_visits_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  },
  {
    "table_name": "visits",
    "conname": "visits_fuel_check",
    "contype": "c",
    "definition": "CHECK ((btrim(fuel) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "visits",
    "conname": "visits_odo_reading_check",
    "contype": "c",
    "definition": "CHECK ((odo_reading >= (0)::numeric))",
    "convalidated": true
  },
  {
    "table_name": "visits",
    "conname": "visits_requested_work_check",
    "contype": "c",
    "definition": "CHECK ((btrim(requested_work) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "work_updates",
    "conname": "work_updates_body_check",
    "contype": "c",
    "definition": "CHECK ((btrim(body) <> ''::text))",
    "convalidated": true
  },
  {
    "table_name": "work_updates",
    "conname": "work_updates_status_check",
    "contype": "c",
    "definition": "CHECK ((status = ANY (ARRAY['IN_PROGRESS'::text, 'PAUSED'::text, 'COMPLETED'::text])))",
    "convalidated": true
  },
  {
    "table_name": "workshop_user_profiles",
    "conname": "s4b_ck_workshop_user_profiles_version",
    "contype": "c",
    "definition": "CHECK ((version > 0))",
    "convalidated": true
  }
]
