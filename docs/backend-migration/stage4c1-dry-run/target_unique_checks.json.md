[
  {
    "table": "active_invoice_claims",
    "constraint": "active_invoice_claims_invoice_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "active_invoice_claims",
    "constraint": "active_invoice_claims_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "advisor_attendance",
    "constraint": "advisor_attendance_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "alembic_version",
    "constraint": "alembic_version_pkc",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "approvals",
    "constraint": "approvals_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "approvals",
    "constraint": "s4b_uk_approvals_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_call_logs",
    "constraint": "booking_call_logs_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_call_logs",
    "constraint": "s4b_uk_booking_call_logs_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_capacity_limits",
    "constraint": "booking_capacity_limits_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_capacity_overrides",
    "constraint": "booking_capacity_overrides_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_capacity_overrides",
    "constraint": "s4b_uk_booking_capacity_overrides_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_events",
    "constraint": "booking_events_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "booking_events",
    "constraint": "s4b_uk_booking_events_tenant_id_branch_id_id",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "bookings",
    "constraint": "bookings_job_card_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 2,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "bookings",
    "constraint": "bookings_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "bookings",
    "constraint": "bookings_visit_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 2,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "bookings",
    "constraint": "s4b_uk_bookings_tenant_id_branch_id_id",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "branch_settings",
    "constraint": "branch_settings_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "branches",
    "constraint": "branches_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "branches",
    "constraint": "branches_tenant_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "branches",
    "constraint": "branches_tenant_id_name_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "car_segments",
    "constraint": "car_segments_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "car_segments",
    "constraint": "s4b_uk_car_segments_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "catalogue_items",
    "constraint": "catalogue_items_pkey",
    "checked": 4,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "catalogue_items",
    "constraint": "catalogue_items_tenant_id_branch_id_id_key",
    "checked": 4,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "command_receipts",
    "constraint": "command_receipts_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "credit_notes",
    "constraint": "credit_notes_invoice_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "credit_notes",
    "constraint": "credit_notes_issued_document_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "credit_notes",
    "constraint": "credit_notes_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "credit_notes",
    "constraint": "credit_notes_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "customers",
    "constraint": "customers_pkey",
    "checked": 121,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "customers",
    "constraint": "customers_tenant_id_branch_id_id_key",
    "checked": 121,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "database_sessions",
    "constraint": "database_sessions_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "delivery_acknowledgements",
    "constraint": "delivery_acknowledgements_gate_pass_document_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "delivery_acknowledgements",
    "constraint": "delivery_acknowledgements_job_card_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "delivery_acknowledgements",
    "constraint": "delivery_acknowledgements_job_card_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "delivery_acknowledgements",
    "constraint": "delivery_acknowledgements_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "delivery_acknowledgements",
    "constraint": "delivery_acknowledgements_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "demo_import_rows",
    "constraint": "demo_import_rows_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "demo_import_runs",
    "constraint": "demo_import_runs_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "document_sequences",
    "constraint": "document_sequences_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "document_snapshots",
    "constraint": "document_snapshots_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "document_snapshots",
    "constraint": "s4b_uk_document_snapshots_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "estimate_decisions",
    "constraint": "estimate_decisions_estimate_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "estimate_decisions",
    "constraint": "estimate_decisions_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "estimate_lines",
    "constraint": "estimate_lines_estimate_id_line_no_key",
    "checked": 0,
    "skipped_incomplete_or_null": 144,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "estimate_lines",
    "constraint": "estimate_lines_pkey",
    "checked": 144,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "estimates",
    "constraint": "estimates_job_card_id_revision_key",
    "checked": 0,
    "skipped_incomplete_or_null": 144,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "estimates",
    "constraint": "estimates_pkey",
    "checked": 144,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "evidence_attachments",
    "constraint": "evidence_attachments_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_document_events",
    "constraint": "financial_document_events_correction_link_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_document_events",
    "constraint": "financial_document_events_document_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_document_events",
    "constraint": "financial_document_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_document_events",
    "constraint": "financial_document_events_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_documents",
    "constraint": "financial_documents_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_documents",
    "constraint": "financial_documents_tenant_id_branch_id_document_no_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_documents",
    "constraint": "financial_documents_tenant_id_branch_id_document_type_fisca_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "financial_documents",
    "constraint": "financial_documents_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "followups",
    "constraint": "followups_pkey",
    "checked": 119,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "followups",
    "constraint": "followups_tenant_id_branch_id_id_key",
    "checked": 119,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "import_source_records",
    "constraint": "import_source_records_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoice_lines",
    "constraint": "invoice_lines_invoice_id_line_no_key",
    "checked": 0,
    "skipped_incomplete_or_null": 105,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoice_lines",
    "constraint": "invoice_lines_pkey",
    "checked": 105,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoices",
    "constraint": "invoices_issued_document_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 52,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoices",
    "constraint": "invoices_job_card_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 52,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoices",
    "constraint": "invoices_pkey",
    "checked": 52,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoices",
    "constraint": "invoices_tenant_id_branch_id_id_key",
    "checked": 52,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "invoices",
    "constraint": "s4b_job_bdd14661fb224cb8cc0a",
    "checked": 52,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_attachments",
    "constraint": "inward_purchase_attachments_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_attachments",
    "constraint": "s4b_uk_inward_purchase_attachments_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_events",
    "constraint": "inward_purchase_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_events",
    "constraint": "s4b_uk_inward_purchase_events_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_lines",
    "constraint": "inward_purchase_lines_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_lines",
    "constraint": "s4b_uk_inward_purchase_lines_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_revision_lines",
    "constraint": "inward_purchase_revision_lines_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_revision_lines",
    "constraint": "s4b_uk_inward_purchase_revision_lines_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_revisions",
    "constraint": "inward_purchase_revisions_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchase_revisions",
    "constraint": "s4b_uk_inward_purchase_revisions_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchases",
    "constraint": "inward_purchases_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "inward_purchases",
    "constraint": "s4b_uk_inward_purchases_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_assignment_history",
    "constraint": "job_assignment_history_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_cards",
    "constraint": "job_cards_pkey",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_cards",
    "constraint": "job_cards_tenant_id_branch_id_id_key",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_cards",
    "constraint": "job_cards_tenant_id_job_no_key",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_cards",
    "constraint": "job_cards_visit_id_key",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_checklist_cycles",
    "constraint": "job_checklist_cycles_pkey",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_checklist_cycles",
    "constraint": "job_checklist_cycles_tenant_id_branch_id_id_key",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_checklist_cycles",
    "constraint": "job_checklist_cycles_tenant_id_branch_id_job_card_id_stage__key",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_checklist_items",
    "constraint": "job_checklist_items_cycle_id_item_key_key",
    "checked": 711,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_checklist_items",
    "constraint": "job_checklist_items_pkey",
    "checked": 711,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_events",
    "constraint": "job_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_media",
    "constraint": "job_media_pkey",
    "checked": 289,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_service_tasks",
    "constraint": "job_service_tasks_pkey",
    "checked": 4,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "job_service_tasks",
    "constraint": "s4b_uk_job_service_tasks_tenant_id_branch_id_id",
    "checked": 4,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_gate_passes",
    "constraint": "legacy_gate_passes_pkey",
    "checked": 27,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_gate_passes",
    "constraint": "s4b_uk_legacy_gate_passes_tenant_id_branch_id_id",
    "checked": 27,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_invoice_events",
    "constraint": "legacy_invoice_events_pkey",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_invoice_events",
    "constraint": "s4b_uk_legacy_invoice_events_tenant_id_branch_id_id",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_job_status_history",
    "constraint": "legacy_job_status_history_pkey",
    "checked": 146,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_job_status_history",
    "constraint": "s4b_uk_legacy_job_status_history_tenant_id_branch_id_id",
    "checked": 146,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_material_movements",
    "constraint": "legacy_material_movements_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_material_movements",
    "constraint": "s4b_uk_legacy_material_movements_tenant_id_branch_id_id",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_receipts",
    "constraint": "legacy_receipts_pkey",
    "checked": 27,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "legacy_receipts",
    "constraint": "s4b_uk_legacy_receipts_tenant_id_branch_id_id",
    "checked": 27,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "local_purchases",
    "constraint": "local_purchases_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "local_purchases",
    "constraint": "s4b_job_f7830977d826e9a8f94f",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "local_purchases",
    "constraint": "s4b_uk_local_purchases_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_approval_events",
    "constraint": "material_approval_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_approval_events",
    "constraint": "s4b_uk_material_approval_events_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_approvals",
    "constraint": "material_approvals_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_approvals",
    "constraint": "s4b_job_c6ca7e3c9f00ed5449bf",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_approvals",
    "constraint": "s4b_uk_material_approvals_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_events",
    "constraint": "material_events_pkey",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_events",
    "constraint": "s4b_uk_material_events_tenant_id_branch_id_id",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_ledger",
    "constraint": "material_ledger_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_ledger",
    "constraint": "material_ledger_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_purchase_requests",
    "constraint": "material_purchase_requests_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_purchase_requests",
    "constraint": "s4b_uk_material_purchase_requests_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_requests",
    "constraint": "material_requests_pkey",
    "checked": 117,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_requests",
    "constraint": "s4b_job_1965087bc3f1a6683300",
    "checked": 117,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_requests",
    "constraint": "s4b_uk_material_requests_tenant_id_branch_id_id",
    "checked": 117,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_reservations",
    "constraint": "material_reservations_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_reservations",
    "constraint": "material_reservations_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_shortages",
    "constraint": "material_shortages_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "material_shortages",
    "constraint": "material_shortages_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "membership_branches",
    "constraint": "membership_branches_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "membership_roles",
    "constraint": "membership_roles_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "object_assets",
    "constraint": "object_assets_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "object_assets",
    "constraint": "s4b_uk_object_assets_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "outbox_events",
    "constraint": "outbox_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "outbox_events",
    "constraint": "s4b_uk_outbox_events_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "payments",
    "constraint": "payments_invoice_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 27,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "payments",
    "constraint": "payments_pkey",
    "checked": 27,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "payments",
    "constraint": "payments_receipt_document_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 27,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "payments",
    "constraint": "payments_tenant_id_branch_id_id_key",
    "checked": 27,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "platform_billing",
    "constraint": "platform_billing_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "platform_users",
    "constraint": "platform_users_cognito_subject_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "platform_users",
    "constraint": "platform_users_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_confirmations",
    "constraint": "purchase_order_delivery_confi_purchase_order_id_purchase_or_key",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_confirmations",
    "constraint": "purchase_order_delivery_confirmation_tenant_id_branch_id_id_key",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_confirmations",
    "constraint": "purchase_order_delivery_confirmations_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_receipt_lines",
    "constraint": "purchase_order_delivery_recei_receipt_id_purchase_order_lin_key",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_receipt_lines",
    "constraint": "purchase_order_delivery_receipt_line_tenant_id_branch_id_id_key",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_receipt_lines",
    "constraint": "purchase_order_delivery_receipt_lines_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_receipts",
    "constraint": "purchase_order_delivery_recei_purchase_order_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 2,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_receipts",
    "constraint": "purchase_order_delivery_receipts_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_delivery_receipts",
    "constraint": "purchase_order_delivery_receipts_tenant_id_branch_id_id_key",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_lines",
    "constraint": "purchase_order_lines_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_lines",
    "constraint": "purchase_order_lines_purchase_order_id_line_no_key",
    "checked": 0,
    "skipped_incomplete_or_null": 3,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_lines",
    "constraint": "purchase_order_lines_tenant_id_branch_id_id_key",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_quotations",
    "constraint": "purchase_order_quotations_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_order_quotations",
    "constraint": "s4b_uk_purchase_order_quotations_tenant_id_branch_id_id",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_orders",
    "constraint": "purchase_orders_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_orders",
    "constraint": "purchase_orders_tenant_id_branch_id_id_key",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_orders",
    "constraint": "purchase_orders_tenant_id_branch_id_po_number_key",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_events",
    "constraint": "purchase_request_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_events",
    "constraint": "purchase_request_events_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_lines",
    "constraint": "purchase_request_lines_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_lines",
    "constraint": "purchase_request_lines_purchase_request_id_line_no_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_lines",
    "constraint": "purchase_request_lines_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_purchase_orders",
    "constraint": "purchase_request_purchase_orders_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_quotes",
    "constraint": "purchase_request_quotes_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_quotes",
    "constraint": "purchase_request_quotes_purchase_request_line_id_supplier_i_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_request_quotes",
    "constraint": "purchase_request_quotes_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_requests",
    "constraint": "purchase_requests_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_requests",
    "constraint": "purchase_requests_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "purchase_requests",
    "constraint": "purchase_requests_tenant_id_branch_id_request_number_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "qc_checks",
    "constraint": "qc_checks_pkey",
    "checked": 435,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "qc_results",
    "constraint": "qc_results_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "quotation_lines",
    "constraint": "quotation_lines_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "quotation_lines",
    "constraint": "quotation_lines_quotation_id_line_no_key",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "quotations",
    "constraint": "quotations_pkey",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "quotations",
    "constraint": "quotations_tenant_id_quotation_no_key",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "refunds",
    "constraint": "refunds_credit_note_id_request_key_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "refunds",
    "constraint": "refunds_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "refunds",
    "constraint": "refunds_tenant_id_branch_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "report_template_versions",
    "constraint": "report_template_versions_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "report_template_versions",
    "constraint": "s4b_uk_report_template_versions_tenant_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "role_permissions",
    "constraint": "role_permissions_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "sales_leads",
    "constraint": "sales_leads_pkey",
    "checked": 1,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_advisor_teams",
    "constraint": "service_advisor_teams_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_brands",
    "constraint": "s4b_uk_service_brands_tenant_id_branch_id_id",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_brands",
    "constraint": "service_brands_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_department_managers",
    "constraint": "service_department_managers_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 2,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_departments",
    "constraint": "service_departments_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 2,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_departments",
    "constraint": "service_departments_tenant_id_branch_id_name_key",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "service_task_catalog",
    "constraint": "service_task_catalog_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "stock_inwards",
    "constraint": "stock_inwards_delivery_confirmation_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 3,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "stock_inwards",
    "constraint": "stock_inwards_pkey",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "stock_inwards",
    "constraint": "stock_inwards_tenant_id_branch_id_id_key",
    "checked": 3,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "stock_ledger",
    "constraint": "stock_ledger_material_ledger_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 4,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "stock_ledger",
    "constraint": "stock_ledger_pkey",
    "checked": 4,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "stock_ledger",
    "constraint": "stock_ledger_tenant_id_branch_id_id_key",
    "checked": 4,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "superadmins",
    "constraint": "superadmins_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "suppliers",
    "constraint": "suppliers_pkey",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "suppliers",
    "constraint": "suppliers_tenant_id_branch_id_id_key",
    "checked": 2,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "support_emulations",
    "constraint": "support_emulations_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "technician_tasks",
    "constraint": "technician_tasks_pkey",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_admin_invitations",
    "constraint": "tenant_admin_invitations_membership_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_admin_invitations",
    "constraint": "tenant_admin_invitations_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_audit_events",
    "constraint": "tenant_audit_events_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_memberships",
    "constraint": "tenant_memberships_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_memberships",
    "constraint": "tenant_memberships_tenant_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_memberships",
    "constraint": "tenant_memberships_tenant_id_user_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_roles",
    "constraint": "tenant_roles_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_roles",
    "constraint": "tenant_roles_tenant_id_id_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_roles",
    "constraint": "tenant_roles_tenant_id_name_key",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenant_settings",
    "constraint": "tenant_settings_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "tenants",
    "constraint": "tenants_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "vehicles",
    "constraint": "vehicles_pkey",
    "checked": 132,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "vehicles",
    "constraint": "vehicles_tenant_id_branch_id_id_key",
    "checked": 132,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "visits",
    "constraint": "visits_pkey",
    "checked": 145,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "work_updates",
    "constraint": "work_updates_pkey",
    "checked": 0,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "workshop_user_profiles",
    "constraint": "s4b_uk_workshop_user_profiles_tenant_id_branch_id_id",
    "checked": 10,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "workshop_user_profiles",
    "constraint": "s4b_uk_workshop_user_profiles_tenant_id_id",
    "checked": 10,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  },
  {
    "table": "workshop_user_profiles",
    "constraint": "workshop_user_profiles_pkey",
    "checked": 10,
    "skipped_incomplete_or_null": 0,
    "scope_assumption": "All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED"
  }
]
