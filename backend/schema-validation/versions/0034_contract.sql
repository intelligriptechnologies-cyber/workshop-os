ALTER TABLE visits DROP CONSTRAINT visits_odo_reading_check;

REVOKE SELECT, INSERT, UPDATE ON "import_source_records" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "import_source_records";

ALTER TABLE "import_source_records" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "import_source_records" DISABLE ROW LEVEL SECURITY;

REVOKE SELECT, INSERT, UPDATE ON "outbox_events" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "outbox_events";

ALTER TABLE "outbox_events" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "outbox_events" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "document_snapshots_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "document_snapshots" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "document_snapshots";

ALTER TABLE "document_snapshots" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "document_snapshots" DISABLE ROW LEVEL SECURITY;

REVOKE SELECT, INSERT, UPDATE ON "object_assets" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "object_assets";

ALTER TABLE "object_assets" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "object_assets" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "report_template_versions_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "report_template_versions" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "report_template_versions";

ALTER TABLE "report_template_versions" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "report_template_versions" DISABLE ROW LEVEL SECURITY;

REVOKE SELECT, INSERT, UPDATE ON "command_receipts" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "command_receipts";

ALTER TABLE "command_receipts" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "command_receipts" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "workshop_user_profiles_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "workshop_user_profiles" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "workshop_user_profiles";

ALTER TABLE "workshop_user_profiles" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "workshop_user_profiles" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "legacy_job_status_history_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "legacy_job_status_history" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "legacy_job_status_history";

ALTER TABLE "legacy_job_status_history" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "legacy_job_status_history" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "service_brands_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "service_brands" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "service_brands";

ALTER TABLE "service_brands" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "service_brands" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "legacy_receipts_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "legacy_receipts" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "legacy_receipts";

ALTER TABLE "legacy_receipts" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "legacy_receipts" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "purchase_order_quotations_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "purchase_order_quotations" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "purchase_order_quotations";

ALTER TABLE "purchase_order_quotations" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "purchase_order_quotations" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "material_requests_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "material_requests" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "material_requests";

ALTER TABLE "material_requests" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "material_requests" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "material_purchase_requests_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "material_purchase_requests" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "material_purchase_requests";

ALTER TABLE "material_purchase_requests" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "material_purchase_requests" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "legacy_material_movements_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "legacy_material_movements" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "legacy_material_movements";

ALTER TABLE "legacy_material_movements" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "legacy_material_movements" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "material_events_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "material_events" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "material_events";

ALTER TABLE "material_events" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "material_events" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "material_approvals_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "material_approvals" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "material_approvals";

ALTER TABLE "material_approvals" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "material_approvals" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "material_approval_events_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "material_approval_events" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "material_approval_events";

ALTER TABLE "material_approval_events" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "material_approval_events" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "local_purchases_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "local_purchases" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "local_purchases";

ALTER TABLE "local_purchases" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "local_purchases" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "inward_purchases_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "inward_purchases" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "inward_purchases";

ALTER TABLE "inward_purchases" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "inward_purchases" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "inward_purchase_revisions_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "inward_purchase_revisions" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "inward_purchase_revisions";

ALTER TABLE "inward_purchase_revisions" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "inward_purchase_revisions" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "inward_purchase_revision_lines_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "inward_purchase_revision_lines" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "inward_purchase_revision_lines";

ALTER TABLE "inward_purchase_revision_lines" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "inward_purchase_revision_lines" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "inward_purchase_lines_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "inward_purchase_lines" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "inward_purchase_lines";

ALTER TABLE "inward_purchase_lines" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "inward_purchase_lines" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "inward_purchase_events_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "inward_purchase_events" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "inward_purchase_events";

ALTER TABLE "inward_purchase_events" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "inward_purchase_events" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "inward_purchase_attachments_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "inward_purchase_attachments" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "inward_purchase_attachments";

ALTER TABLE "inward_purchase_attachments" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "inward_purchase_attachments" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "legacy_invoice_events_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "legacy_invoice_events" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "legacy_invoice_events";

ALTER TABLE "legacy_invoice_events" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "legacy_invoice_events" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "legacy_gate_passes_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "legacy_gate_passes" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "legacy_gate_passes";

ALTER TABLE "legacy_gate_passes" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "legacy_gate_passes" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "car_segments_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "car_segments" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "car_segments";

ALTER TABLE "car_segments" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "car_segments" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "booking_events_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "booking_events" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "booking_events";

ALTER TABLE "booking_events" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "booking_events" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "booking_capacity_overrides_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "booking_capacity_overrides" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "booking_capacity_overrides";

ALTER TABLE "booking_capacity_overrides" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "booking_capacity_overrides" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "booking_call_logs_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "booking_call_logs" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "booking_call_logs";

ALTER TABLE "booking_call_logs" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "booking_call_logs" DISABLE ROW LEVEL SECURITY;

REVOKE USAGE, SELECT ON SEQUENCE "approvals_id_seq" FROM workshopos_runtime;

REVOKE SELECT, INSERT, UPDATE ON "approvals" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "approvals";

ALTER TABLE "approvals" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "approvals" DISABLE ROW LEVEL SECURITY;

REVOKE SELECT, INSERT, UPDATE ON "advisor_attendance" FROM workshopos_runtime;

DROP POLICY s4b_scope ON "advisor_attendance";

ALTER TABLE "advisor_attendance" NO FORCE ROW LEVEL SECURITY;

ALTER TABLE "advisor_attendance" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "visits" DROP CONSTRAINT "s4b_ck_visits_version";

ALTER TABLE "vehicles" DROP CONSTRAINT "s4b_ck_vehicles_version";

ALTER TABLE "technician_tasks" DROP CONSTRAINT "s4b_ck_technician_tasks_version";

ALTER TABLE "suppliers" DROP CONSTRAINT "s4b_ck_suppliers_version";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_ck_stock_ledger_version";

ALTER TABLE "stock_inwards" DROP CONSTRAINT "s4b_ck_stock_inwards_version";

ALTER TABLE "service_departments" DROP CONSTRAINT "s4b_ck_service_departments_version";

ALTER TABLE "service_department_managers" DROP CONSTRAINT "s4b_ck_service_department_managers_version";

ALTER TABLE "service_task_catalog" DROP CONSTRAINT "s4b_ck_service_task_catalog_version";

ALTER TABLE "service_advisor_teams" DROP CONSTRAINT "s4b_ck_service_advisor_teams_version";

ALTER TABLE "quotations" DROP CONSTRAINT "s4b_ck_quotations_version";

ALTER TABLE "quotation_lines" DROP CONSTRAINT "s4b_ck_quotation_lines_version";

ALTER TABLE "sales_leads" DROP CONSTRAINT "s4b_ck_sales_leads_version";

ALTER TABLE "qc_checks" DROP CONSTRAINT "s4b_ck_qc_checks_version";

ALTER TABLE "purchase_orders" DROP CONSTRAINT "s4b_ck_purchase_orders_version";

ALTER TABLE "purchase_order_delivery_receipts" DROP CONSTRAINT "s4b_ck_purchase_order_delivery_receipts_version";

ALTER TABLE "purchase_order_delivery_receipt_lines" DROP CONSTRAINT "s4b_ck_purchase_order_delivery_receipt_lines_version";

ALTER TABLE "purchase_order_lines" DROP CONSTRAINT "s4b_ck_purchase_order_lines_version";

ALTER TABLE "purchase_order_delivery_confirmations" DROP CONSTRAINT "s4b_ck_purchase_order_delivery_confirmations_version";

ALTER TABLE "job_media" DROP CONSTRAINT "s4b_ck_job_media_version";

ALTER TABLE "payments" DROP CONSTRAINT "s4b_ck_payments_version";

ALTER TABLE "job_service_tasks" DROP CONSTRAINT "s4b_ck_job_service_tasks_version";

ALTER TABLE "job_cards" DROP CONSTRAINT "s4b_ck_job_cards_version";

ALTER TABLE "invoices" DROP CONSTRAINT "s4b_ck_invoices_version";

ALTER TABLE "invoice_lines" DROP CONSTRAINT "s4b_ck_invoice_lines_version";

ALTER TABLE "catalogue_items" DROP CONSTRAINT "s4b_ck_catalogue_items_version";

ALTER TABLE "estimates" DROP CONSTRAINT "s4b_ck_estimates_version";

ALTER TABLE "estimate_lines" DROP CONSTRAINT "s4b_ck_estimate_lines_version";

ALTER TABLE "customers" DROP CONSTRAINT "s4b_ck_customers_version";

ALTER TABLE "job_checklist_items" DROP CONSTRAINT "s4b_ck_job_checklist_items_version";

ALTER TABLE "job_checklist_cycles" DROP CONSTRAINT "s4b_ck_job_checklist_cycles_version";

ALTER TABLE "bookings" DROP CONSTRAINT "s4b_ck_bookings_version";

ALTER TABLE "booking_capacity_limits" DROP CONSTRAINT "s4b_ck_booking_capacity_limits_version";

ALTER TABLE "qc_checks" DROP CONSTRAINT "s4b_ck_qc_checks_passed";

ALTER TABLE "job_cards" DROP CONSTRAINT "s4b_ck_job_cards_washing_needed";

ALTER TABLE "invoices" DROP CONSTRAINT "s4b_ck_invoices_document_available";

ALTER TABLE "followups" DROP CONSTRAINT "s4b_ck_followups_done";

ALTER TABLE "command_receipts" DROP CONSTRAINT "s4b_ck_command_receipts_hash";

ALTER TABLE "import_source_records" DROP CONSTRAINT "s4b_ck_import_source_records_hashes";

ALTER TABLE "import_source_records" DROP CONSTRAINT "s4b_ck_import_source_records_disposition";

ALTER TABLE "outbox_events" DROP CONSTRAINT "s4b_ck_outbox_events_status";

ALTER TABLE "outbox_events" DROP CONSTRAINT "s4b_ck_outbox_events_attempts";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_ck_document_snapshots_version";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_ck_document_snapshots_availability";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_ck_object_assets_state";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_ck_object_assets_sha";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_ck_object_assets_size";

ALTER TABLE "advisor_attendance" DROP CONSTRAINT "s4b_ck_advisor_attendance_present";

DROP INDEX "s4b_ix_import_source_records_target_table_target_key";

DROP INDEX "s4b_ix_command_receipts_created_at";

DROP INDEX "s4b_ix_outbox_events_status_next_attempt_at";

DROP INDEX "s4b_ux_outbox_events_tenant_id_event_key";

DROP INDEX "s4b_ux_document_snapshots_tenant_id_branch_id__57274a825232";

DROP INDEX "s4b_ix_object_assets_state_created_at";

DROP INDEX "s4b_ux_object_assets_tenant_id_storage_key";

DROP INDEX "s4b_ux_report_template_versions_tenant_id_category";

DROP INDEX "s4b_ux_report_template_versions_tenant_id_temp_a3c6bf79b9ff";

DROP INDEX "s4b_ix_document_snapshots_tenant_id_branch_id_asset_id";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_fk_document_snapshots_tenant_id_branch_id_asset_id";

DROP INDEX "s4b_ix_document_snapshots_tenant_id_template_version_id";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_fk_document_snapshots_tenant_id_template_version_id";

DROP INDEX "s4b_ix_document_snapshots_tenant_id_branch_id_job_card_id";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_fk_document_snapshots_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_object_assets_created_by";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_fk_object_assets_created_by";

DROP INDEX "s4b_ix_command_receipts_actor_id";

ALTER TABLE "command_receipts" DROP CONSTRAINT "s4b_fk_command_receipts_actor_id";

DROP INDEX "s4b_ux_material_requests_tenant_id_branch_id_reservation_id";

DROP INDEX "s4b_ix_material_requests_tenant_id_branch_id_reservation_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_fk_material_requests_tenant_id_branch_id_reservation_id";

DROP INDEX "s4b_ux_legacy_gate_passes_tenant_id_branch_id__caba1c6dcc94";

DROP INDEX "s4b_ix_legacy_gate_passes_tenant_id_branch_id__7f21e123b232";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_fk_legacy_gate_passes_tenant_id_branch_id__a057c7573eb4";

DROP INDEX "s4b_ux_legacy_receipts_tenant_id_branch_id_nat_d0dab92c9bc5";

DROP INDEX "s4b_ix_legacy_receipts_tenant_id_branch_id_nat_f6cb08e2c6ca";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_fk_legacy_receipts_tenant_id_branch_id_nat_ed7918bc4f3e";

DROP INDEX "s4b_ux_workshop_user_profiles_tenant_id_platform_user_id";

ALTER TABLE "workshop_user_profiles" DROP CONSTRAINT "s4b_uk_workshop_user_profiles_tenant_id_id";

DROP INDEX "s4b_ix_workshop_user_profiles_platform_user_id";

ALTER TABLE "workshop_user_profiles" DROP CONSTRAINT "s4b_fk_workshop_user_profiles_platform_user_id";

DROP INDEX "s4b_ix_workshop_user_profiles_tenant_id_branch_9ca683450510";

DROP INDEX "s4b_ux_workshop_user_profiles_tenant_id_branch_id_email";

DROP INDEX "s4b_ix_stock_ledger_tenant_id_branch_id_inward_a918e679e28d";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_fk_stock_ledger_tenant_id_branch_id_inward_f70fe8ed7e32";

DROP INDEX "s4b_ix_stock_ledger_tenant_id_branch_id_by_user";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_fk_stock_ledger_tenant_id_branch_id_by_user";

DROP INDEX "s4b_ix_stock_ledger_tenant_id_branch_id_material_row_id";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_fk_stock_ledger_tenant_id_branch_id_material_row_id";

DROP INDEX "s4b_ix_stock_ledger_tenant_id_branch_id_job_card_id";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_fk_stock_ledger_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_stock_inwards_tenant_id_branch_id_ledger_id";

ALTER TABLE "stock_inwards" DROP CONSTRAINT "s4b_fk_stock_inwards_tenant_id_branch_id_ledger_id";

DROP INDEX "s4b_ix_legacy_job_status_history_tenant_id_bra_cf2e352f69d0";

DROP INDEX "s4b_ix_legacy_job_status_history_tenant_id_bra_d1c0f1dadba5";

ALTER TABLE "legacy_job_status_history" DROP CONSTRAINT "s4b_fk_legacy_job_status_history_tenant_id_bra_7bb9d27a06e8";

DROP INDEX "s4b_ix_service_task_catalog_tenant_id_branch_i_7d05220c3103";

ALTER TABLE "service_task_catalog" DROP CONSTRAINT "s4b_fk_service_task_catalog_tenant_id_branch_i_9a95c10c0d25";

DROP INDEX "s4b_ix_service_task_catalog_tenant_id_branch_id_brand_id";

ALTER TABLE "service_task_catalog" DROP CONSTRAINT "s4b_fk_service_task_catalog_tenant_id_branch_id_brand_id";

DROP INDEX "s4b_ix_service_brands_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ux_service_brands_tenant_id_branch_id_name";

DROP INDEX "s4b_ix_legacy_receipts_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ix_legacy_receipts_tenant_id_branch_id_invoice_id";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_fk_legacy_receipts_tenant_id_branch_id_invoice_id";

DROP INDEX "s4b_ix_legacy_receipts_tenant_id_branch_id_job_card_id";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_fk_legacy_receipts_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_purchase_orders_tenant_id_branch_id_sou_573693b01f59";

ALTER TABLE "purchase_orders" DROP CONSTRAINT "s4b_fk_purchase_orders_tenant_id_branch_id_sou_9b4b8e162d57";

DROP INDEX "s4b_ix_purchase_order_quotations_tenant_id_bra_5e4ee9088896";

DROP INDEX "s4b_ix_purchase_order_quotations_tenant_id_bra_e1c84b503328";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_fk_purchase_order_quotations_tenant_id_bra_ff7eedb6879d";

DROP INDEX "s4b_ix_purchase_order_quotations_tenant_id_bra_33268beaad28";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_fk_purchase_order_quotations_tenant_id_bra_bd8eaf344e0e";

DROP INDEX "s4b_ix_purchase_order_quotations_tenant_id_bra_1f502bda7be8";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_fk_purchase_order_quotations_tenant_id_bra_75ba933f3b60";

DROP INDEX "s4b_ix_purchase_order_lines_tenant_id_branch_i_7d55ede9343d";

ALTER TABLE "purchase_order_lines" DROP CONSTRAINT "s4b_fk_purchase_order_lines_tenant_id_branch_i_27f0eb5d3dee";

DROP INDEX "s4b_ix_payments_tenant_id_branch_id_job_card_id";

ALTER TABLE "payments" DROP CONSTRAINT "s4b_fk_payments_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_material_requests_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ix_material_requests_tenant_id_branch_id_invoiced_in";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_fk_material_requests_tenant_id_branch_id_invoiced_in";

DROP INDEX "s4b_ix_material_requests_tenant_id_branch_id_item_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_fk_material_requests_tenant_id_branch_id_item_id";

DROP INDEX "s4b_ix_material_requests_tenant_id_branch_id_job_card_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_fk_material_requests_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_br_168d58e28d64";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_br_4ea9943ee60d";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id_br_1e5cc5a56a23";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_br_b73e85ac112c";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id_br_9372efbd1a63";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_br_f92bf756e7fc";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id_br_6534aca8d4e5";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_br_abf09b8e9b35";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id_br_b653fc940da3";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_br_e9cae1b3ce38";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id_br_f3daf2bced3a";

DROP INDEX "s4b_ix_legacy_material_movements_tenant_id_bra_72e8d077064e";

DROP INDEX "s4b_ix_legacy_material_movements_tenant_id_branch_id_item_id";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_fk_legacy_material_movements_tenant_id_branch_id_item_id";

DROP INDEX "s4b_ix_legacy_material_movements_tenant_id_bra_883e64166174";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_fk_legacy_material_movements_tenant_id_bra_9d1a70e62bdb";

DROP INDEX "s4b_ix_material_events_tenant_id_branch_id_new_item_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id_branch_id_new_item_id";

DROP INDEX "s4b_ix_material_events_tenant_id_branch_id_old_item_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id_branch_id_old_item_id";

DROP INDEX "s4b_ix_material_events_tenant_id_branch_id_by_user";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id_branch_id_by_user";

DROP INDEX "s4b_ix_material_events_tenant_id_branch_id_material_row_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id_branch_id_material_row_id";

DROP INDEX "s4b_ix_material_events_tenant_id_branch_id_job_card_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ux_material_approvals_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_material_approvals_tenant_id_branch_id_reviewed_by";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_fk_material_approvals_tenant_id_branch_id_reviewed_by";

DROP INDEX "s4b_ix_material_approvals_tenant_id_branch_id_submitted_by";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_fk_material_approvals_tenant_id_branch_id_submitted_by";

DROP INDEX "s4b_ix_material_approvals_tenant_id_branch_id_job_card_id";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_fk_material_approvals_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_material_approval_events_tenant_id_branch_id_actor_id";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_fk_material_approval_events_tenant_id_branch_id_actor_id";

DROP INDEX "s4b_ix_material_approval_events_tenant_id_bran_2d5d21555b07";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_fk_material_approval_events_tenant_id_bran_594dba6809fa";

DROP INDEX "s4b_ix_material_approval_events_tenant_id_bran_8ae3ed0127e2";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_fk_material_approval_events_tenant_id_bran_bf18e81a4ac1";

DROP INDEX "s4b_ix_local_purchases_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ix_local_purchases_tenant_id_branch_id_job_card_id";

ALTER TABLE "local_purchases" DROP CONSTRAINT "s4b_fk_local_purchases_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_job_cards_tenant_id_branch_id_technician_id";

ALTER TABLE "job_cards" DROP CONSTRAINT "s4b_fk_job_cards_tenant_id_branch_id_technician_id";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ux_inward_purchases_tenant_id_branch_id_su_0311b1c1f499";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id_approved_by";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id_branch_id_approved_by";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id_pu_d4ee35d79986";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id_branch_id_pu_1cc450220c1c";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id_submitted_by";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id_branch_id_submitted_by";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id_created_by";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id_branch_id_created_by";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id_supplier_id";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id_branch_id_supplier_id";

DROP INDEX "s4b_ux_inward_purchase_revisions_tenant_id_bra_14594d8920af";

DROP INDEX "s4b_ix_inward_purchase_revisions_tenant_id_bra_63bf06c8fa44";

ALTER TABLE "inward_purchase_revisions" DROP CONSTRAINT "s4b_fk_inward_purchase_revisions_tenant_id_bra_943066d0781f";

DROP INDEX "s4b_ix_inward_purchase_revisions_tenant_id_bra_18e3233ab6c2";

ALTER TABLE "inward_purchase_revisions" DROP CONSTRAINT "s4b_fk_inward_purchase_revisions_tenant_id_bra_895044419875";

DROP INDEX "s4b_ix_inward_purchase_revision_lines_tenant_i_5d9148740513";

ALTER TABLE "inward_purchase_revision_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_revision_lines_tenant_i_1fafd4260b9f";

DROP INDEX "s4b_ix_inward_purchase_revision_lines_tenant_i_f88a8f10180b";

ALTER TABLE "inward_purchase_revision_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_revision_lines_tenant_i_2687b76ebf0c";

DROP INDEX "s4b_ix_inward_purchase_lines_tenant_id_branch__14ed52bb2625";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_lines_tenant_id_branch__711173c6bff0";

DROP INDEX "s4b_ix_inward_purchase_lines_tenant_id_branch_id_item_id";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_lines_tenant_id_branch_id_item_id";

DROP INDEX "s4b_ix_inward_purchase_lines_tenant_id_branch_id_purchase_id";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_lines_tenant_id_branch_id_purchase_id";

DROP INDEX "s4b_ix_inward_purchase_events_tenant_id_branch_id_actor_id";

ALTER TABLE "inward_purchase_events" DROP CONSTRAINT "s4b_fk_inward_purchase_events_tenant_id_branch_id_actor_id";

DROP INDEX "s4b_ix_inward_purchase_events_tenant_id_branch_77b229b4f21c";

ALTER TABLE "inward_purchase_events" DROP CONSTRAINT "s4b_fk_inward_purchase_events_tenant_id_branch_501ec864b0bb";

DROP INDEX "s4b_ix_inward_purchase_attachments_tenant_id_b_e7a948cedfa7";

ALTER TABLE "inward_purchase_attachments" DROP CONSTRAINT "s4b_fk_inward_purchase_attachments_tenant_id_b_63722988f392";

DROP INDEX "s4b_ix_inward_purchase_attachments_tenant_id_b_487197459cda";

ALTER TABLE "inward_purchase_attachments" DROP CONSTRAINT "s4b_fk_inward_purchase_attachments_tenant_id_b_501211b52490";

DROP INDEX "s4b_ix_invoice_lines_tenant_id_branch_id_material_row_id";

ALTER TABLE "invoice_lines" DROP CONSTRAINT "s4b_fk_invoice_lines_tenant_id_branch_id_material_row_id";

DROP INDEX "s4b_ix_legacy_invoice_events_tenant_id_branch_id_by_user";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_fk_legacy_invoice_events_tenant_id_branch_id_by_user";

DROP INDEX "s4b_ix_legacy_invoice_events_tenant_id_branch_id_invoice_id";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_fk_legacy_invoice_events_tenant_id_branch_id_invoice_id";

DROP INDEX "s4b_ix_legacy_invoice_events_tenant_id_branch_id_job_card_id";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_fk_legacy_invoice_events_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_legacy_gate_passes_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ix_legacy_gate_passes_tenant_id_branch_id_invoice_id";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_fk_legacy_gate_passes_tenant_id_branch_id_invoice_id";

DROP INDEX "s4b_ix_legacy_gate_passes_tenant_id_branch_id_job_card_id";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_fk_legacy_gate_passes_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_estimate_lines_tenant_id_branch_id_task_list_item_id";

ALTER TABLE "estimate_lines" DROP CONSTRAINT "s4b_fk_estimate_lines_tenant_id_branch_id_task_list_item_id";

ALTER TABLE "job_service_tasks" DROP CONSTRAINT "s4b_uk_job_service_tasks_tenant_id_branch_id_id";

DROP INDEX "s4b_ix_car_segments_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ux_car_segments_tenant_id_branch_id_name";

DROP INDEX "s4b_ix_booking_events_tenant_id_branch_id_actor_id";

ALTER TABLE "booking_events" DROP CONSTRAINT "s4b_fk_booking_events_tenant_id_branch_id_actor_id";

DROP INDEX "s4b_ix_booking_events_tenant_id_branch_id_booking_id";

ALTER TABLE "booking_events" DROP CONSTRAINT "s4b_fk_booking_events_tenant_id_branch_id_booking_id";

DROP INDEX "s4b_ix_booking_capacity_overrides_tenant_id_br_c8e3626bf0f9";

ALTER TABLE "booking_capacity_overrides" DROP CONSTRAINT "s4b_fk_booking_capacity_overrides_tenant_id_br_3f67f151c34f";

DROP INDEX "s4b_ix_booking_capacity_overrides_tenant_id_br_c5ba6e745151";

ALTER TABLE "booking_capacity_overrides" DROP CONSTRAINT "s4b_fk_booking_capacity_overrides_tenant_id_br_814822f65a6f";

DROP INDEX "s4b_ix_booking_call_logs_tenant_id_branch_id_called_by";

ALTER TABLE "booking_call_logs" DROP CONSTRAINT "s4b_fk_booking_call_logs_tenant_id_branch_id_called_by";

DROP INDEX "s4b_ix_booking_call_logs_tenant_id_branch_id_booking_id";

ALTER TABLE "booking_call_logs" DROP CONSTRAINT "s4b_fk_booking_call_logs_tenant_id_branch_id_booking_id";

ALTER TABLE "bookings" DROP CONSTRAINT "s4b_uk_bookings_tenant_id_branch_id_id";

DROP INDEX "s4b_ix_approvals_tenant_id_branch_id_created_at_id";

DROP INDEX "s4b_ix_approvals_tenant_id_branch_id_job_card_id";

ALTER TABLE "approvals" DROP CONSTRAINT "s4b_fk_approvals_tenant_id_branch_id_job_card_id";

DROP INDEX "s4b_ix_advisor_attendance_tenant_id_branch_id_user_id";

ALTER TABLE "advisor_attendance" DROP CONSTRAINT "s4b_fk_advisor_attendance_tenant_id_branch_id_user_id";

DROP INDEX "s4b_ix_import_source_records_tenant_id";

ALTER TABLE "import_source_records" DROP CONSTRAINT "s4b_fk_import_source_records_tenant_id";

ALTER TABLE "outbox_events" DROP CONSTRAINT "s4b_uk_outbox_events_tenant_id_branch_id_id";

DROP INDEX "s4b_ix_outbox_events_tenant_id_branch_id";

ALTER TABLE "outbox_events" DROP CONSTRAINT "s4b_fk_outbox_events_tenant_id_branch_id";

DROP INDEX "s4b_ix_outbox_events_tenant_id";

ALTER TABLE "outbox_events" DROP CONSTRAINT "s4b_fk_outbox_events_tenant_id";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_uk_document_snapshots_tenant_id_branch_id_id";

DROP INDEX "s4b_ix_document_snapshots_tenant_id_branch_id";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_fk_document_snapshots_tenant_id_branch_id";

DROP INDEX "s4b_ix_document_snapshots_tenant_id";

ALTER TABLE "document_snapshots" DROP CONSTRAINT "s4b_fk_document_snapshots_tenant_id";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_uk_object_assets_tenant_id_branch_id_id";

DROP INDEX "s4b_ix_object_assets_tenant_id_branch_id";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_fk_object_assets_tenant_id_branch_id";

DROP INDEX "s4b_ix_object_assets_tenant_id";

ALTER TABLE "object_assets" DROP CONSTRAINT "s4b_fk_object_assets_tenant_id";

ALTER TABLE "report_template_versions" DROP CONSTRAINT "s4b_uk_report_template_versions_tenant_id_id";

ALTER TABLE "report_template_versions" DROP CONSTRAINT "s4b_ck_report_template_versions_version";

DROP INDEX "s4b_ix_report_template_versions_tenant_id";

ALTER TABLE "report_template_versions" DROP CONSTRAINT "s4b_fk_report_template_versions_tenant_id";

DROP INDEX "s4b_ix_command_receipts_tenant_id_branch_id";

ALTER TABLE "command_receipts" DROP CONSTRAINT "s4b_fk_command_receipts_tenant_id_branch_id";

DROP INDEX "s4b_ix_command_receipts_tenant_id";

ALTER TABLE "command_receipts" DROP CONSTRAINT "s4b_fk_command_receipts_tenant_id";

ALTER TABLE "workshop_user_profiles" DROP CONSTRAINT "s4b_uk_workshop_user_profiles_tenant_id_branch_id_id";

ALTER TABLE "workshop_user_profiles" DROP CONSTRAINT "s4b_ck_workshop_user_profiles_version";

DROP INDEX "s4b_ix_workshop_user_profiles_tenant_id_branch_id";

ALTER TABLE "workshop_user_profiles" DROP CONSTRAINT "s4b_fk_workshop_user_profiles_tenant_id_branch_id";

DROP INDEX "s4b_ix_workshop_user_profiles_tenant_id";

ALTER TABLE "workshop_user_profiles" DROP CONSTRAINT "s4b_fk_workshop_user_profiles_tenant_id";

ALTER TABLE "legacy_job_status_history" DROP CONSTRAINT "s4b_uk_legacy_job_status_history_tenant_id_branch_id_id";

ALTER TABLE "legacy_job_status_history" DROP CONSTRAINT "s4b_ck_legacy_job_status_history_version";

DROP INDEX "s4b_ix_legacy_job_status_history_tenant_id_branch_id";

ALTER TABLE "legacy_job_status_history" DROP CONSTRAINT "s4b_fk_legacy_job_status_history_tenant_id_branch_id";

DROP INDEX "s4b_ix_legacy_job_status_history_tenant_id";

ALTER TABLE "legacy_job_status_history" DROP CONSTRAINT "s4b_fk_legacy_job_status_history_tenant_id";

ALTER TABLE "service_brands" DROP CONSTRAINT "s4b_uk_service_brands_tenant_id_branch_id_id";

ALTER TABLE "service_brands" DROP CONSTRAINT "s4b_ck_service_brands_version";

DROP INDEX "s4b_ix_service_brands_tenant_id_branch_id";

ALTER TABLE "service_brands" DROP CONSTRAINT "s4b_fk_service_brands_tenant_id_branch_id";

DROP INDEX "s4b_ix_service_brands_tenant_id";

ALTER TABLE "service_brands" DROP CONSTRAINT "s4b_fk_service_brands_tenant_id";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_uk_legacy_receipts_tenant_id_branch_id_id";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_ck_legacy_receipts_version";

DROP INDEX "s4b_ix_legacy_receipts_tenant_id_branch_id";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_fk_legacy_receipts_tenant_id_branch_id";

DROP INDEX "s4b_ix_legacy_receipts_tenant_id";

ALTER TABLE "legacy_receipts" DROP CONSTRAINT "s4b_fk_legacy_receipts_tenant_id";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_uk_purchase_order_quotations_tenant_id_branch_id_id";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_ck_purchase_order_quotations_version";

DROP INDEX "s4b_ix_purchase_order_quotations_tenant_id_branch_id";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_fk_purchase_order_quotations_tenant_id_branch_id";

DROP INDEX "s4b_ix_purchase_order_quotations_tenant_id";

ALTER TABLE "purchase_order_quotations" DROP CONSTRAINT "s4b_fk_purchase_order_quotations_tenant_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_uk_material_requests_tenant_id_branch_id_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_ck_material_requests_version";

DROP INDEX "s4b_ix_material_requests_tenant_id_branch_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_fk_material_requests_tenant_id_branch_id";

DROP INDEX "s4b_ix_material_requests_tenant_id";

ALTER TABLE "material_requests" DROP CONSTRAINT "s4b_fk_material_requests_tenant_id";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_uk_material_purchase_requests_tenant_id_branch_id_id";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_ck_material_purchase_requests_version";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id_branch_id";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id_branch_id";

DROP INDEX "s4b_ix_material_purchase_requests_tenant_id";

ALTER TABLE "material_purchase_requests" DROP CONSTRAINT "s4b_fk_material_purchase_requests_tenant_id";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_uk_legacy_material_movements_tenant_id_branch_id_id";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_ck_legacy_material_movements_version";

DROP INDEX "s4b_ix_legacy_material_movements_tenant_id_branch_id";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_fk_legacy_material_movements_tenant_id_branch_id";

DROP INDEX "s4b_ix_legacy_material_movements_tenant_id";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_fk_legacy_material_movements_tenant_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_uk_material_events_tenant_id_branch_id_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_ck_material_events_version";

DROP INDEX "s4b_ix_material_events_tenant_id_branch_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id_branch_id";

DROP INDEX "s4b_ix_material_events_tenant_id";

ALTER TABLE "material_events" DROP CONSTRAINT "s4b_fk_material_events_tenant_id";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_uk_material_approvals_tenant_id_branch_id_id";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_ck_material_approvals_version";

DROP INDEX "s4b_ix_material_approvals_tenant_id_branch_id";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_fk_material_approvals_tenant_id_branch_id";

DROP INDEX "s4b_ix_material_approvals_tenant_id";

ALTER TABLE "material_approvals" DROP CONSTRAINT "s4b_fk_material_approvals_tenant_id";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_uk_material_approval_events_tenant_id_branch_id_id";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_ck_material_approval_events_version";

DROP INDEX "s4b_ix_material_approval_events_tenant_id_branch_id";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_fk_material_approval_events_tenant_id_branch_id";

DROP INDEX "s4b_ix_material_approval_events_tenant_id";

ALTER TABLE "material_approval_events" DROP CONSTRAINT "s4b_fk_material_approval_events_tenant_id";

ALTER TABLE "local_purchases" DROP CONSTRAINT "s4b_uk_local_purchases_tenant_id_branch_id_id";

ALTER TABLE "local_purchases" DROP CONSTRAINT "s4b_ck_local_purchases_version";

DROP INDEX "s4b_ix_local_purchases_tenant_id_branch_id";

ALTER TABLE "local_purchases" DROP CONSTRAINT "s4b_fk_local_purchases_tenant_id_branch_id";

DROP INDEX "s4b_ix_local_purchases_tenant_id";

ALTER TABLE "local_purchases" DROP CONSTRAINT "s4b_fk_local_purchases_tenant_id";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_uk_inward_purchases_tenant_id_branch_id_id";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_ck_inward_purchases_version";

DROP INDEX "s4b_ix_inward_purchases_tenant_id_branch_id";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id_branch_id";

DROP INDEX "s4b_ix_inward_purchases_tenant_id";

ALTER TABLE "inward_purchases" DROP CONSTRAINT "s4b_fk_inward_purchases_tenant_id";

ALTER TABLE "inward_purchase_revisions" DROP CONSTRAINT "s4b_uk_inward_purchase_revisions_tenant_id_branch_id_id";

ALTER TABLE "inward_purchase_revisions" DROP CONSTRAINT "s4b_ck_inward_purchase_revisions_version";

DROP INDEX "s4b_ix_inward_purchase_revisions_tenant_id_branch_id";

ALTER TABLE "inward_purchase_revisions" DROP CONSTRAINT "s4b_fk_inward_purchase_revisions_tenant_id_branch_id";

DROP INDEX "s4b_ix_inward_purchase_revisions_tenant_id";

ALTER TABLE "inward_purchase_revisions" DROP CONSTRAINT "s4b_fk_inward_purchase_revisions_tenant_id";

ALTER TABLE "inward_purchase_revision_lines" DROP CONSTRAINT "s4b_uk_inward_purchase_revision_lines_tenant_id_branch_id_id";

ALTER TABLE "inward_purchase_revision_lines" DROP CONSTRAINT "s4b_ck_inward_purchase_revision_lines_version";

DROP INDEX "s4b_ix_inward_purchase_revision_lines_tenant_id_branch_id";

ALTER TABLE "inward_purchase_revision_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_revision_lines_tenant_id_branch_id";

DROP INDEX "s4b_ix_inward_purchase_revision_lines_tenant_id";

ALTER TABLE "inward_purchase_revision_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_revision_lines_tenant_id";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_uk_inward_purchase_lines_tenant_id_branch_id_id";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_ck_inward_purchase_lines_version";

DROP INDEX "s4b_ix_inward_purchase_lines_tenant_id_branch_id";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_lines_tenant_id_branch_id";

DROP INDEX "s4b_ix_inward_purchase_lines_tenant_id";

ALTER TABLE "inward_purchase_lines" DROP CONSTRAINT "s4b_fk_inward_purchase_lines_tenant_id";

ALTER TABLE "inward_purchase_events" DROP CONSTRAINT "s4b_uk_inward_purchase_events_tenant_id_branch_id_id";

ALTER TABLE "inward_purchase_events" DROP CONSTRAINT "s4b_ck_inward_purchase_events_version";

DROP INDEX "s4b_ix_inward_purchase_events_tenant_id_branch_id";

ALTER TABLE "inward_purchase_events" DROP CONSTRAINT "s4b_fk_inward_purchase_events_tenant_id_branch_id";

DROP INDEX "s4b_ix_inward_purchase_events_tenant_id";

ALTER TABLE "inward_purchase_events" DROP CONSTRAINT "s4b_fk_inward_purchase_events_tenant_id";

ALTER TABLE "inward_purchase_attachments" DROP CONSTRAINT "s4b_uk_inward_purchase_attachments_tenant_id_branch_id_id";

ALTER TABLE "inward_purchase_attachments" DROP CONSTRAINT "s4b_ck_inward_purchase_attachments_version";

DROP INDEX "s4b_ix_inward_purchase_attachments_tenant_id_branch_id";

ALTER TABLE "inward_purchase_attachments" DROP CONSTRAINT "s4b_fk_inward_purchase_attachments_tenant_id_branch_id";

DROP INDEX "s4b_ix_inward_purchase_attachments_tenant_id";

ALTER TABLE "inward_purchase_attachments" DROP CONSTRAINT "s4b_fk_inward_purchase_attachments_tenant_id";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_uk_legacy_invoice_events_tenant_id_branch_id_id";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_ck_legacy_invoice_events_version";

DROP INDEX "s4b_ix_legacy_invoice_events_tenant_id_branch_id";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_fk_legacy_invoice_events_tenant_id_branch_id";

DROP INDEX "s4b_ix_legacy_invoice_events_tenant_id";

ALTER TABLE "legacy_invoice_events" DROP CONSTRAINT "s4b_fk_legacy_invoice_events_tenant_id";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_uk_legacy_gate_passes_tenant_id_branch_id_id";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_ck_legacy_gate_passes_version";

DROP INDEX "s4b_ix_legacy_gate_passes_tenant_id_branch_id";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_fk_legacy_gate_passes_tenant_id_branch_id";

DROP INDEX "s4b_ix_legacy_gate_passes_tenant_id";

ALTER TABLE "legacy_gate_passes" DROP CONSTRAINT "s4b_fk_legacy_gate_passes_tenant_id";

ALTER TABLE "car_segments" DROP CONSTRAINT "s4b_uk_car_segments_tenant_id_branch_id_id";

ALTER TABLE "car_segments" DROP CONSTRAINT "s4b_ck_car_segments_version";

DROP INDEX "s4b_ix_car_segments_tenant_id_branch_id";

ALTER TABLE "car_segments" DROP CONSTRAINT "s4b_fk_car_segments_tenant_id_branch_id";

DROP INDEX "s4b_ix_car_segments_tenant_id";

ALTER TABLE "car_segments" DROP CONSTRAINT "s4b_fk_car_segments_tenant_id";

ALTER TABLE "booking_events" DROP CONSTRAINT "s4b_uk_booking_events_tenant_id_branch_id_id";

ALTER TABLE "booking_events" DROP CONSTRAINT "s4b_ck_booking_events_version";

DROP INDEX "s4b_ix_booking_events_tenant_id_branch_id";

ALTER TABLE "booking_events" DROP CONSTRAINT "s4b_fk_booking_events_tenant_id_branch_id";

DROP INDEX "s4b_ix_booking_events_tenant_id";

ALTER TABLE "booking_events" DROP CONSTRAINT "s4b_fk_booking_events_tenant_id";

ALTER TABLE "booking_capacity_overrides" DROP CONSTRAINT "s4b_uk_booking_capacity_overrides_tenant_id_branch_id_id";

ALTER TABLE "booking_capacity_overrides" DROP CONSTRAINT "s4b_ck_booking_capacity_overrides_version";

DROP INDEX "s4b_ix_booking_capacity_overrides_tenant_id_branch_id";

ALTER TABLE "booking_capacity_overrides" DROP CONSTRAINT "s4b_fk_booking_capacity_overrides_tenant_id_branch_id";

DROP INDEX "s4b_ix_booking_capacity_overrides_tenant_id";

ALTER TABLE "booking_capacity_overrides" DROP CONSTRAINT "s4b_fk_booking_capacity_overrides_tenant_id";

ALTER TABLE "booking_call_logs" DROP CONSTRAINT "s4b_uk_booking_call_logs_tenant_id_branch_id_id";

ALTER TABLE "booking_call_logs" DROP CONSTRAINT "s4b_ck_booking_call_logs_version";

DROP INDEX "s4b_ix_booking_call_logs_tenant_id_branch_id";

ALTER TABLE "booking_call_logs" DROP CONSTRAINT "s4b_fk_booking_call_logs_tenant_id_branch_id";

DROP INDEX "s4b_ix_booking_call_logs_tenant_id";

ALTER TABLE "booking_call_logs" DROP CONSTRAINT "s4b_fk_booking_call_logs_tenant_id";

ALTER TABLE "approvals" DROP CONSTRAINT "s4b_uk_approvals_tenant_id_branch_id_id";

ALTER TABLE "approvals" DROP CONSTRAINT "s4b_ck_approvals_version";

DROP INDEX "s4b_ix_approvals_tenant_id_branch_id";

ALTER TABLE "approvals" DROP CONSTRAINT "s4b_fk_approvals_tenant_id_branch_id";

DROP INDEX "s4b_ix_approvals_tenant_id";

ALTER TABLE "approvals" DROP CONSTRAINT "s4b_fk_approvals_tenant_id";

ALTER TABLE "advisor_attendance" DROP CONSTRAINT "s4b_ck_advisor_attendance_version";

DROP INDEX "s4b_ix_advisor_attendance_tenant_id_branch_id";

ALTER TABLE "advisor_attendance" DROP CONSTRAINT "s4b_fk_advisor_attendance_tenant_id_branch_id";

DROP INDEX "s4b_ix_advisor_attendance_tenant_id";

ALTER TABLE "advisor_attendance" DROP CONSTRAINT "s4b_fk_advisor_attendance_tenant_id";

ALTER TABLE "visits" DROP COLUMN "version";

ALTER TABLE "vehicles" DROP COLUMN "version";

ALTER TABLE "technician_tasks" DROP COLUMN "version";

ALTER TABLE "suppliers" DROP COLUMN "version";

ALTER TABLE "stock_ledger" DROP COLUMN "version";

ALTER TABLE "stock_inwards" DROP COLUMN "version";

ALTER TABLE "service_departments" DROP COLUMN "version";

ALTER TABLE "service_department_managers" DROP COLUMN "version";

ALTER TABLE "service_task_catalog" DROP COLUMN "version";

ALTER TABLE "service_advisor_teams" DROP COLUMN "version";

ALTER TABLE "quotations" DROP COLUMN "version";

ALTER TABLE "quotation_lines" DROP COLUMN "version";

ALTER TABLE "sales_leads" DROP COLUMN "version";

ALTER TABLE "qc_checks" DROP COLUMN "version";

ALTER TABLE "purchase_orders" DROP COLUMN "version";

ALTER TABLE "purchase_order_delivery_receipts" DROP COLUMN "version";

ALTER TABLE "purchase_order_delivery_receipt_lines" DROP COLUMN "version";

ALTER TABLE "purchase_order_lines" DROP COLUMN "version";

ALTER TABLE "purchase_order_delivery_confirmations" DROP COLUMN "version";

ALTER TABLE "job_media" DROP COLUMN "version";

ALTER TABLE "payments" DROP COLUMN "version";

ALTER TABLE "job_service_tasks" DROP COLUMN "version";

ALTER TABLE "job_cards" DROP COLUMN "version";

ALTER TABLE "invoices" DROP COLUMN "version";

ALTER TABLE "invoice_lines" DROP COLUMN "version";

ALTER TABLE "catalogue_items" DROP COLUMN "version";

ALTER TABLE "estimates" DROP COLUMN "version";

ALTER TABLE "estimate_lines" DROP COLUMN "version";

ALTER TABLE "customers" DROP COLUMN "version";

ALTER TABLE "job_checklist_items" DROP COLUMN "version";

ALTER TABLE "job_checklist_cycles" DROP COLUMN "version";

ALTER TABLE "bookings" DROP COLUMN "version";

ALTER TABLE "booking_capacity_limits" DROP COLUMN "version";

ALTER TABLE "job_checklist_items" DROP CONSTRAINT "s4b_ck_job_checklist_items_legacy_checked_by";

ALTER TABLE "job_checklist_items" DROP COLUMN "legacy_checked_by";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_ck_stock_ledger_legacy_material_row_id";

ALTER TABLE "stock_ledger" DROP COLUMN "legacy_material_row_id";

ALTER TABLE "stock_ledger" DROP CONSTRAINT "s4b_ck_stock_ledger_legacy_job_card_id";

ALTER TABLE "stock_ledger" DROP COLUMN "legacy_job_card_id";

ALTER TABLE "legacy_material_movements" DROP CONSTRAINT "s4b_ck_legacy_material_movements_legacy_job_card_id";

ALTER TABLE "legacy_material_movements" DROP COLUMN "legacy_job_card_id";

ALTER TABLE "material_requests" DROP COLUMN "reservation_id";

ALTER TABLE "legacy_gate_passes" DROP COLUMN "native_document_id";

ALTER TABLE "legacy_receipts" DROP COLUMN "native_document_id";

ALTER TABLE "workshop_user_profiles" DROP COLUMN "platform_user_id";

ALTER TABLE "visits" ALTER COLUMN "odo_reading" TYPE integer;

ALTER TABLE "technician_tasks" DROP COLUMN "paused_at";

ALTER TABLE "technician_tasks" DROP COLUMN "started_at";

ALTER TABLE "technician_tasks" DROP COLUMN "archived_reason";

ALTER TABLE "technician_tasks" DROP COLUMN "archived_at";

ALTER TABLE "technician_tasks" DROP COLUMN "ui_status";

ALTER TABLE "suppliers" DROP COLUMN "gstin";

ALTER TABLE "suppliers" DROP COLUMN "phone";

ALTER TABLE "suppliers" DROP COLUMN "contact_name";

ALTER TABLE "stock_ledger" DROP COLUMN "inward_purchase_line_id";

ALTER TABLE "stock_ledger" DROP COLUMN "note";

ALTER TABLE "stock_ledger" DROP COLUMN "at";

ALTER TABLE "stock_ledger" DROP COLUMN "by_user";

ALTER TABLE "stock_ledger" DROP COLUMN "type";

ALTER TABLE "stock_ledger" DROP COLUMN "qty";

ALTER TABLE "stock_ledger" DROP COLUMN "material_row_id";

ALTER TABLE "stock_ledger" DROP COLUMN "job_card_id";

ALTER TABLE "stock_inwards" DROP COLUMN "ledger_id";

ALTER TABLE "stock_inwards" ALTER COLUMN "qty" TYPE numeric(14,3);

ALTER TABLE "service_task_catalog" DROP COLUMN "car_segment_id";

ALTER TABLE "service_task_catalog" DROP COLUMN "brand_id";

ALTER TABLE "service_task_catalog" ALTER COLUMN "gst_rate" TYPE numeric(5,2);

ALTER TABLE "service_task_catalog" ALTER COLUMN "rate" TYPE numeric(14,2);

ALTER TABLE "quotations" ALTER COLUMN "total" TYPE numeric(14,2);

ALTER TABLE "quotations" ALTER COLUMN "gst_amount" TYPE numeric(14,2);

ALTER TABLE "quotations" ALTER COLUMN "subtotal" TYPE numeric(14,2);

ALTER TABLE "quotations" ALTER COLUMN "discount" TYPE numeric(14,2);

ALTER TABLE "quotation_lines" ALTER COLUMN "gst_rate" TYPE numeric(5,2);

ALTER TABLE "quotation_lines" ALTER COLUMN "rate" TYPE numeric(14,2);

ALTER TABLE "quotation_lines" ALTER COLUMN "quantity" TYPE numeric(14,3);

ALTER TABLE "qc_checks" DROP COLUMN "archived_at";

ALTER TABLE "qc_checks" DROP COLUMN "fail_reason";

ALTER TABLE "qc_checks" DROP COLUMN "passed";

ALTER TABLE "purchase_orders" DROP COLUMN "source_purchase_order_id";

ALTER TABLE "purchase_order_delivery_receipt_lines" ALTER COLUMN "delivered_qty" TYPE numeric(14,3);

ALTER TABLE "purchase_order_lines" DROP COLUMN "source_purchase_order_line_id";

ALTER TABLE "purchase_order_lines" ALTER COLUMN "gst_rate" TYPE numeric(5,2);

ALTER TABLE "purchase_order_lines" ALTER COLUMN "discount" TYPE numeric(14,2);

ALTER TABLE "purchase_order_lines" ALTER COLUMN "unit_cost" TYPE numeric(14,2);

ALTER TABLE "purchase_order_lines" ALTER COLUMN "ordered_qty" TYPE numeric(14,3);

ALTER TABLE "purchase_order_delivery_confirmations" ALTER COLUMN "accepted_qty" TYPE numeric(14,3);

ALTER TABLE "job_media" DROP COLUMN "height";

ALTER TABLE "job_media" DROP COLUMN "width";

ALTER TABLE "job_media" DROP COLUMN "original_name";

ALTER TABLE "job_media" DROP COLUMN "byte_size";

ALTER TABLE "job_media" DROP COLUMN "mime_type";

ALTER TABLE "payments" DROP COLUMN "updated_at";

ALTER TABLE "payments" DROP COLUMN "void_reason";

ALTER TABLE "payments" DROP COLUMN "voided_at";

ALTER TABLE "payments" DROP COLUMN "notes";

ALTER TABLE "payments" DROP COLUMN "other_detail";

ALTER TABLE "payments" DROP COLUMN "mode";

ALTER TABLE "payments" DROP COLUMN "amount";

ALTER TABLE "payments" DROP COLUMN "job_card_id";

ALTER TABLE "job_service_tasks" ALTER COLUMN "gst_rate" TYPE numeric(5,2);

ALTER TABLE "job_service_tasks" ALTER COLUMN "base_rate" TYPE numeric(14,2);

ALTER TABLE "job_cards" DROP COLUMN "acknowledgement";

ALTER TABLE "job_cards" DROP COLUMN "final_km";

ALTER TABLE "job_cards" DROP COLUMN "delivery_by";

ALTER TABLE "job_cards" DROP COLUMN "internal_instructions";

ALTER TABLE "job_cards" DROP COLUMN "customer_instructions";

ALTER TABLE "job_cards" DROP COLUMN "advisor_notes";

ALTER TABLE "job_cards" DROP COLUMN "archived_reason";

ALTER TABLE "job_cards" DROP COLUMN "damage_marks_recorded_at";

ALTER TABLE "job_cards" DROP COLUMN "damage_marks";

ALTER TABLE "job_cards" DROP COLUMN "pickup_drop";

ALTER TABLE "job_cards" DROP COLUMN "service_type";

ALTER TABLE "job_cards" DROP COLUMN "closed_at";

ALTER TABLE "job_cards" DROP COLUMN "washing_needed";

ALTER TABLE "job_cards" DROP COLUMN "qc_status";

ALTER TABLE "job_cards" DROP COLUMN "sub_status";

ALTER TABLE "job_cards" DROP COLUMN "technician_id";

ALTER TABLE "invoices" DROP COLUMN "updated_at";

ALTER TABLE "invoices" DROP COLUMN "void_reason";

ALTER TABLE "invoices" DROP COLUMN "voided_at";

ALTER TABLE "invoices" DROP COLUMN "document_generated_at";

ALTER TABLE "invoices" DROP COLUMN "document_available";

ALTER TABLE "invoices" DROP COLUMN "notes";

ALTER TABLE "invoices" DROP COLUMN "status";

ALTER TABLE "invoices" DROP COLUMN "total";

ALTER TABLE "invoices" DROP COLUMN "gst_amount";

ALTER TABLE "invoices" DROP COLUMN "subtotal";

ALTER TABLE "invoices" DROP COLUMN "gst_rate";

ALTER TABLE "invoices" DROP COLUMN "discount";

ALTER TABLE "invoices" DROP COLUMN "tally_invoice_no";

ALTER TABLE "invoices" DROP COLUMN "invoice_no";

ALTER TABLE "invoice_lines" DROP COLUMN "updated_at";

ALTER TABLE "invoice_lines" DROP COLUMN "created_at";

ALTER TABLE "invoice_lines" DROP COLUMN "archived_reason";

ALTER TABLE "invoice_lines" DROP COLUMN "archived_at";

ALTER TABLE "invoice_lines" DROP COLUMN "material_row_id";

ALTER TABLE "invoice_lines" DROP COLUMN "gst_rate";

ALTER TABLE "invoice_lines" DROP COLUMN "gst_type";

ALTER TABLE "invoice_lines" DROP COLUMN "rate";

ALTER TABLE "invoice_lines" ALTER COLUMN "quantity" TYPE numeric(14,3);

ALTER TABLE "invoice_lines" DROP COLUMN "kind";

ALTER TABLE "catalogue_items" ALTER COLUMN "selling_price" TYPE numeric(14,2);

ALTER TABLE "catalogue_items" ALTER COLUMN "low_stock_qty" TYPE numeric(14,3);

ALTER TABLE "catalogue_items" DROP COLUMN "stock_qty";

ALTER TABLE "followups" DROP COLUMN "done";

ALTER TABLE "estimates" DROP COLUMN "archived_reason";

ALTER TABLE "estimates" DROP COLUMN "archived_at";

ALTER TABLE "estimates" DROP COLUMN "approval_note";

ALTER TABLE "estimates" ALTER COLUMN "gst_rate" TYPE numeric(5,2);

ALTER TABLE "estimates" ALTER COLUMN "discount" TYPE numeric(14,2);

ALTER TABLE "estimate_lines" DROP COLUMN "task_list_item_id";

ALTER TABLE "estimate_lines" DROP COLUMN "updated_at";

ALTER TABLE "estimate_lines" DROP COLUMN "created_at";

ALTER TABLE "estimate_lines" DROP COLUMN "archived_reason";

ALTER TABLE "estimate_lines" DROP COLUMN "archived_at";

ALTER TABLE "estimate_lines" ALTER COLUMN "gst_rate" TYPE numeric(5,2);

ALTER TABLE "estimate_lines" DROP COLUMN "gst_type";

ALTER TABLE "estimate_lines" ALTER COLUMN "rate" TYPE numeric(14,2);

ALTER TABLE "estimate_lines" ALTER COLUMN "quantity" TYPE numeric(14,3);

ALTER TABLE "bookings" DROP COLUMN "no_show_reason";

ALTER TABLE "bookings" DROP COLUMN "cancellation_reason";

ALTER TABLE "bookings" DROP COLUMN "reschedule_reason";

ALTER TABLE "bookings" DROP COLUMN "no_show_at";

ALTER TABLE "bookings" DROP COLUMN "cancelled_at";

ALTER TABLE "bookings" DROP COLUMN "rescheduled_at";

ALTER TABLE "bookings" DROP COLUMN "confirmed_at";

DROP TABLE "import_source_records";

DROP TABLE "outbox_events";

DROP TABLE "document_snapshots";

DROP TABLE "object_assets";

DROP TABLE "report_template_versions";

DROP TABLE "command_receipts";

DROP TABLE "workshop_user_profiles";

DROP TABLE "legacy_job_status_history";

DROP TABLE "service_brands";

DROP TABLE "legacy_receipts";

DROP TABLE "purchase_order_quotations";

DROP TABLE "material_requests";

DROP TABLE "material_purchase_requests";

DROP TABLE "legacy_material_movements";

DROP TABLE "material_events";

DROP TABLE "material_approvals";

DROP TABLE "material_approval_events";

DROP TABLE "local_purchases";

DROP TABLE "inward_purchases";

DROP TABLE "inward_purchase_revisions";

DROP TABLE "inward_purchase_revision_lines";

DROP TABLE "inward_purchase_lines";

DROP TABLE "inward_purchase_events";

DROP TABLE "inward_purchase_attachments";

DROP TABLE "legacy_invoice_events";

DROP TABLE "legacy_gate_passes";

DROP TABLE "car_segments";

DROP TABLE "booking_events";

DROP TABLE "booking_capacity_overrides";

DROP TABLE "booking_call_logs";

DROP TABLE "approvals";

DROP TABLE "advisor_attendance";

ALTER TABLE visits ADD CONSTRAINT visits_odo_reading_check CHECK ((odo_reading >= 0));
