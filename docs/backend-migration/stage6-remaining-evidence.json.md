{
  "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
  "branch": "Prem-dev-fbb-Go21",
  "head": "06bbce9a2119f60388a9a14c52c78e1e1c4b36ec",
  "migration_head": "20261022_0053",
  "changed_tracked_files": [
    "backend/customer-slice/README.md",
    "backend/customer-slice/api.py",
    "backend/customer-slice/operational-mapping.json",
    "backend/customer-slice/operations.py",
    "backend/customer-slice/test_customer_regression.mjs",
    "backend/customer-slice/test_estimate_documents.py",
    "backend/customer-slice/test_estimate_storage.mjs",
    "backend/customer-slice/test_financial_storage.mjs",
    "backend/customer-slice/test_stock_storage.mjs",
    "backend/customer-slice/test_vehicle_browser.mjs",
    "backend/customer-slice/test_visual.mjs",
    "docs/backend-migration/README.md",
    "src/App.tsx",
    "src/admin-console.tsx",
    "src/admin-demo-state.ts",
    "src/booking-calendar.tsx",
    "src/booking-check-in.tsx",
    "src/booking-expected-today.tsx",
    "src/db.ts",
    "src/local-sales.tsx",
    "src/operations-api.ts"
  ],
  "new_implementation_and_test_files": [
    "backend/customer-slice/admin-defaults.json",
    "backend/customer-slice/admin-options.json",
    "backend/customer-slice/administration.py",
    "backend/customer-slice/bookings.py",
    "backend/customer-slice/catalog_workflows.py",
    "backend/customer-slice/configuration.py",
    "backend/customer-slice/execution_workflows.py",
    "backend/customer-slice/export_admin_defaults.ts",
    "backend/customer-slice/run_remaining_browser_regressions.py",
    "backend/customer-slice/run_remaining_regressions.py",
    "backend/customer-slice/sales_workflows.py",
    "backend/customer-slice/test_administration.py",
    "backend/customer-slice/test_administration_browser.mjs",
    "backend/customer-slice/test_booking_browser.mjs",
    "backend/customer-slice/test_booking_visual.mjs",
    "backend/customer-slice/test_bookings.py",
    "backend/customer-slice/test_catalog_browser.mjs",
    "backend/customer-slice/test_catalog_visual.mjs",
    "backend/customer-slice/test_catalog_workflows.py",
    "backend/customer-slice/test_configuration.py",
    "backend/customer-slice/test_configuration_browser.mjs",
    "backend/customer-slice/test_configuration_visual.mjs",
    "backend/customer-slice/test_dashboard_reports.mjs",
    "backend/customer-slice/test_execution_browser.mjs",
    "backend/customer-slice/test_execution_visual.mjs",
    "backend/customer-slice/test_execution_workflows.py",
    "backend/customer-slice/test_ownership.py",
    "backend/customer-slice/test_ownership_browser.mjs",
    "backend/customer-slice/test_remaining_storage.mjs",
    "backend/customer-slice/test_sales_browser.mjs",
    "backend/customer-slice/test_sales_visual.mjs",
    "backend/customer-slice/test_sales_workflows.py",
    "backend/customer-slice/test_tasklist_browser.mjs",
    "backend/customer-slice/test_users_visual.mjs",
    "backend/customer-slice/verify_remaining_preservation.py",
    "backend/customer-slice/versions/20261022_0048_bookings.py",
    "backend/customer-slice/versions/20261022_0049_execution.py",
    "backend/customer-slice/versions/20261022_0050_users.py",
    "backend/customer-slice/versions/20261022_0051_configuration.py",
    "backend/customer-slice/versions/20261022_0052_teams_catalog.py",
    "backend/customer-slice/versions/20261022_0053_sales.py",
    "src/administration-api.ts",
    "src/booking-api.ts",
    "src/catalog-api.ts",
    "src/configuration-api.ts",
    "src/execution-api.ts",
    "src/sales-integration-api.ts"
  ],
  "api_regressions": [
    {
      "suite": "test_vehicles.py",
      "exit": 0
    },
    {
      "suite": "test_operations.py",
      "exit": 0
    },
    {
      "suite": "test_estimate_documents.py",
      "exit": 0,
      "initial_exit": 1,
      "retest": "Passed after request-stub/async-wait correction; assertion semantics unchanged"
    },
    {
      "suite": "financial_test_support.py",
      "exit": 0
    },
    {
      "suite": "test_material_approvals.py",
      "exit": 0
    },
    {
      "suite": "test_purchase_stock.py",
      "exit": 0
    },
    {
      "suite": "test_purchase_stock_edges.py",
      "exit": 0
    },
    {
      "suite": "test_financial_workflows.py",
      "exit": 0
    },
    {
      "suite": "test_financial_materials.py",
      "exit": 0
    },
    {
      "suite": "test_financial_database.py",
      "exit": 0
    },
    {
      "suite": "test_bookings.py",
      "exit": 0
    },
    {
      "suite": "test_execution_workflows.py",
      "exit": 0
    },
    {
      "suite": "test_administration.py",
      "exit": 0
    },
    {
      "suite": "test_configuration.py",
      "exit": 0
    },
    {
      "suite": "test_catalog_workflows.py",
      "exit": 0
    },
    {
      "suite": "test_sales_workflows.py",
      "exit": 0
    }
  ],
  "browser_regressions": [
    {
      "suite": "test_sales_browser.mjs",
      "exit": 0,
      "initial_exit": 1,
      "retest": "Passed after request-stub/async-wait correction; assertion semantics unchanged"
    },
    {
      "suite": "test_tasklist_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_booking_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_administration_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_configuration_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_catalog_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_customer_regression.mjs",
      "exit": 0
    },
    {
      "suite": "test_vehicle_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_financial_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_financial_edges_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_stock_storage.mjs",
      "exit": 0
    },
    {
      "suite": "test_financial_storage.mjs",
      "exit": 0
    },
    {
      "suite": "test_roles.mjs",
      "exit": 0
    }
  ],
  "visual": [
    {
      "state": "login",
      "different_pixels": 0
    },
    {
      "state": "list",
      "different_pixels": 0
    },
    {
      "state": "add",
      "different_pixels": 0
    },
    {
      "state": "edit",
      "different_pixels": 0
    },
    {
      "state": "view",
      "different_pixels": 0
    },
    {
      "state": "search",
      "different_pixels": 0
    },
    {
      "state": "booking-calendar",
      "different_pixels": 0
    },
    {
      "state": "booking-capacity",
      "different_pixels": 0
    },
    {
      "state": "booking-create",
      "different_pixels": 0
    },
    {
      "state": "execution-qc",
      "different_pixels": 0
    },
    {
      "state": "execution-tasks",
      "different_pixels": 0
    },
    {
      "state": "users-add",
      "different_pixels": 0
    },
    {
      "state": "users-list",
      "different_pixels": 0
    },
    {
      "state": "configuration-company",
      "different_pixels": 0
    },
    {
      "state": "configuration-roles",
      "different_pixels": 0
    },
    {
      "state": "configuration-settings",
      "different_pixels": 0
    },
    {
      "state": "configuration-templates",
      "different_pixels": 2
    },
    {
      "state": "configuration-theme",
      "different_pixels": 0
    },
    {
      "state": "catalog-catalog",
      "different_pixels": 0
    },
    {
      "state": "catalog-team",
      "different_pixels": 0
    },
    {
      "state": "sales-leads",
      "different_pixels": 0
    },
    {
      "state": "sales-quotations",
      "different_pixels": 0
    },
    {
      "state": "financial-accounts-Delivery",
      "different_pixels": 10
    },
    {
      "state": "financial-accounts-Invoice",
      "different_pixels": 19
    },
    {
      "state": "financial-accounts-Payment",
      "different_pixels": 12
    },
    {
      "state": "financial-delivery-list",
      "different_pixels": 0
    },
    {
      "state": "financial-invoice-detail",
      "different_pixels": 0
    },
    {
      "state": "financial-invoice-editor",
      "different_pixels": 0
    },
    {
      "state": "financial-invoice-list",
      "different_pixels": 0
    },
    {
      "state": "financial-invoice-search",
      "different_pixels": 0
    },
    {
      "state": "financial-invoice-view",
      "different_pixels": 0
    },
    {
      "state": "financial-payment-dialog",
      "different_pixels": 0
    },
    {
      "state": "financial-payment-other",
      "different_pixels": 0
    },
    {
      "state": "financial-payments-list",
      "different_pixels": 0
    },
    {
      "state": "financial-print-Gate-Pass",
      "different_pixels": 0
    },
    {
      "state": "financial-print-Invoice",
      "different_pixels": 0
    },
    {
      "state": "financial-print-Payment-Receipt",
      "different_pixels": 0
    }
  ],
  "preservation": {
    "head": "06bbce9a2119f60388a9a14c52c78e1e1c4b36ec",
    "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
    "unchanged_protected_files": 102,
    "modified_protected_files": [
      "src/App.tsx",
      "src/admin-console.tsx",
      "src/admin-demo-state.ts",
      "src/billing-manager.tsx",
      "src/booking-calendar.tsx",
      "src/booking-check-in.tsx",
      "src/booking-expected-today.tsx",
      "src/db.ts",
      "src/document-snapshots.ts",
      "src/job-sheet-ui.tsx",
      "src/local-sales.tsx",
      "src/materials-ui.tsx",
      "vite.config.ts"
    ],
    "screenshots_unchanged": 94,
    "sqlite_copies_unchanged": 8,
    "development_counts": {
      "customers": 121,
      "vehicles": 132,
      "job_cards": 145,
      "estimates": 144,
      "estimate_lines": 144,
      "job_media": 289,
      "invoices": 52,
      "invoice_lines": 105,
      "payments": 27,
      "legacy_receipts": 27,
      "legacy_gate_passes": 27,
      "suppliers": 2,
      "catalogue_items": 4,
      "purchase_orders": 2,
      "purchase_order_lines": 3,
      "material_requests": 117,
      "inward_purchases": 0
    },
    "development_original_tables_identical": 103,
    "test_immutable_tables_identical": 46,
    "financial_and_custody_unchanged": true,
    "missing_estimate_or_job_parents": 0,
    "historical_rows_exact": 7,
    "source_stock_on_hand": {
      "1": 500.0,
      "2": 79.0,
      "3": 60.0,
      "4": 3.0
    },
    "quarantine_custody_unchanged": true,
    "historical_quotations_unchanged": true,
    "invoice_discrepancies_preserved": 51
  },
  "source_table_projection_inventory": [
    {
      "table": "users",
      "count": 10,
      "projected": true
    },
    {
      "table": "customers",
      "count": 121,
      "projected": true
    },
    {
      "table": "vehicles",
      "count": 132,
      "projected": true
    },
    {
      "table": "visits",
      "count": 145,
      "projected": true
    },
    {
      "table": "job_cards",
      "count": 145,
      "projected": true
    },
    {
      "table": "status_history",
      "count": 146,
      "projected": true
    },
    {
      "table": "checklist_cycles",
      "count": 145,
      "projected": true
    },
    {
      "table": "checklist_items",
      "count": 711,
      "projected": true
    },
    {
      "table": "estimates",
      "count": 144,
      "projected": true
    },
    {
      "table": "estimate_items",
      "count": 144,
      "projected": true
    },
    {
      "table": "approvals",
      "count": 0,
      "projected": false
    },
    {
      "table": "tasks",
      "count": 145,
      "projected": true
    },
    {
      "table": "qc_checks",
      "count": 435,
      "projected": true
    },
    {
      "table": "invoices",
      "count": 52,
      "projected": true
    },
    {
      "table": "invoice_items",
      "count": 105,
      "projected": true
    },
    {
      "table": "payments",
      "count": 27,
      "projected": true
    },
    {
      "table": "receipts",
      "count": 27,
      "projected": true
    },
    {
      "table": "gate_passes",
      "count": 27,
      "projected": true
    },
    {
      "table": "inventory",
      "count": 4,
      "projected": true
    },
    {
      "table": "material_requests",
      "count": 117,
      "projected": true
    },
    {
      "table": "local_purchases",
      "count": 0,
      "projected": true
    },
    {
      "table": "material_purchase_requests",
      "count": 0,
      "projected": true
    },
    {
      "table": "material_movements",
      "count": 3,
      "projected": true
    },
    {
      "table": "suppliers",
      "count": 2,
      "projected": true
    },
    {
      "table": "inward_purchases",
      "count": 0,
      "projected": true
    },
    {
      "table": "inward_purchase_lines",
      "count": 0,
      "projected": true
    },
    {
      "table": "inward_purchase_attachments",
      "count": 0,
      "projected": true
    },
    {
      "table": "inward_purchase_revisions",
      "count": 0,
      "projected": true
    },
    {
      "table": "inward_purchase_revision_lines",
      "count": 0,
      "projected": true
    },
    {
      "table": "inward_purchase_events",
      "count": 0,
      "projected": true
    },
    {
      "table": "photos",
      "count": 289,
      "projected": true
    },
    {
      "table": "followups",
      "count": 119,
      "projected": true
    },
    {
      "table": "advisor_attendance",
      "count": 2,
      "projected": true
    },
    {
      "table": "material_events",
      "count": 1,
      "projected": true
    },
    {
      "table": "stock_ledger",
      "count": 4,
      "projected": true
    },
    {
      "table": "invoice_events",
      "count": 1,
      "projected": true
    },
    {
      "table": "material_approvals",
      "count": 0,
      "projected": true
    },
    {
      "table": "material_approval_events",
      "count": 0,
      "projected": true
    },
    {
      "table": "purchase_orders",
      "count": 2,
      "projected": true
    },
    {
      "table": "purchase_order_lines",
      "count": 3,
      "projected": true
    },
    {
      "table": "stock_inwards",
      "count": 3,
      "projected": true
    },
    {
      "table": "bookings",
      "count": 2,
      "projected": true
    },
    {
      "table": "booking_call_logs",
      "count": 0,
      "projected": true
    },
    {
      "table": "booking_events",
      "count": 2,
      "projected": true
    },
    {
      "table": "service_catalog_items",
      "count": 3,
      "projected": true
    },
    {
      "table": "job_task_list_items",
      "count": 4,
      "projected": true
    },
    {
      "table": "booking_capacity_limits",
      "count": 0,
      "projected": true
    },
    {
      "table": "booking_capacity_overrides",
      "count": 0,
      "projected": true
    },
    {
      "table": "purchase_order_quotations",
      "count": 3,
      "projected": true
    },
    {
      "table": "purchase_order_receipts",
      "count": 2,
      "projected": true
    },
    {
      "table": "purchase_order_receipt_lines",
      "count": 3,
      "projected": true
    },
    {
      "table": "purchase_order_confirmations",
      "count": 3,
      "projected": true
    },
    {
      "table": "service_brands",
      "count": 0,
      "projected": true
    },
    {
      "table": "car_segments",
      "count": 0,
      "projected": true
    },
    {
      "table": "service_departments",
      "count": 2,
      "projected": true
    },
    {
      "table": "service_department_managers",
      "count": 2,
      "projected": true
    },
    {
      "table": "service_advisor_teams",
      "count": 0,
      "projected": true
    },
    {
      "table": "sales_leads",
      "count": 1,
      "projected": true
    },
    {
      "table": "sales_quotations",
      "count": 1,
      "projected": true
    },
    {
      "table": "sales_quotation_lines",
      "count": 2,
      "projected": true
    }
  ],
  "unit": {
    "passed": 241,
    "failed": 3,
    "known_failures": "Existing report-template counts expect six; source defaults contain eight"
  },
  "build": "PASS",
  "typecheck": "PASS",
  "quarantine": {
    "custody_total": 67,
    "native_promotions": 0,
    "checklists_unresolved_actor_zero": 52,
    "bookings_and_events_readonly_compatibility": 4,
    "department_manager_operational_compatibility": 4,
    "stock_immutable_compatibility": 7
  },
  "additional_checks": {
    "booking-api-tests": {
      "passed": 49,
      "checks": [
        "historical booking snapshots exposed exactly",
        "historical booking immutable",
        "reception cannot change limits",
        "negative capacity denied",
        "set capacity",
        "create snapshot booking {\"id\":13}",
        "idempotent booking create",
        "key conflict denied",
        "booking does not create masters or job",
        "cross-session booking visibility",
        "capacity denies reception",
        "admin override requires reason",
        "admin override",
        "override audit retained",
        "login service",
        "service booking writes denied",
        "login service_manager",
        "service_manager booking writes denied",
        "login accounts",
        "accounts booking writes denied",
        "login store",
        "store booking writes denied",
        "login tech",
        "tech booking writes denied",
        "blank input rejected",
        "bad date rejected",
        "unknown field rejected",
        "confirm booking",
        "stale version denied",
        "empty call denied",
        "call audit",
        "call visible",
        "reschedule reason required",
        "reschedule",
        "bad intake rolls back",
        "atomic check-in {\"id\":224,\"job_no\":\"JC-2026-001471\",\"visit_id\":224,\"customer_id\":314,\"vehicle_id\":228,\"jobId\":224,\"v",
        "check-in retry same job",
        "arrived links",
        "advisor remains unassigned",
        "duplicate check-in denied",
        "terminal booking cannot change",
        "created job cross session",
        "intake artifacts present",
        "race capacity setup",
        "login reception",
        "login reception",
        "one winner for last slot",
        "cancel reason required",
        "cancel frees capacity"
      ]
    },
    "execution-api-tests": {
      "passed": 37,
      "checks": [
        "execution test job created",
        "technician creates task {\"id\":230}",
        "idempotent task create",
        "empty task rejected",
        "advisor cannot update technician task",
        "invalid task state rejected",
        "task Started",
        "task Paused",
        "task Completed",
        "stale task denied",
        "task timestamps persist across sessions",
        "QC rework transaction {\"id\":673}",
        "QC and rework atomic",
        "QC all passes",
        "washing flag",
        "technician cannot create followup",
        "advisor followup create {\"id\":122}",
        "followup empty denied",
        "followup bad date denied",
        "resolve prior contacts",
        "earlier followup closed",
        "followup edit",
        "followup complete",
        "followup archive",
        "archived followup edit denied",
        "login reception",
        "reception execution denied",
        "login accounts",
        "accounts execution denied",
        "login store",
        "store execution denied",
        "login service_manager",
        "service_manager execution denied",
        "task archive",
        "cancel test job",
        "terminal task creation denied",
        "terminal followup creation denied"
      ]
    },
    "administration-api-tests": {
      "passed": 32,
      "checks": [
        "create account {\"id\":14}",
        "idempotent account creation",
        "password never projected",
        "new account manual login",
        "duplicate email denied",
        "short password denied",
        "invalid role denied",
        "update preserves password when omitted",
        "old session revoked on role edit",
        "same password new role",
        "password rotation",
        "old password rejected",
        "new password accepted",
        "stale user edit denied",
        "cannot archive self",
        "login reception",
        "reception user administration denied",
        "login service",
        "service user administration denied",
        "login service_manager",
        "service_manager user administration denied",
        "login accounts",
        "accounts user administration denied",
        "login store",
        "store user administration denied",
        "login tech",
        "tech user administration denied",
        "preloaded manager locked",
        "archive account",
        "archive revokes session",
        "archived account login denied",
        "archived history retained"
      ]
    },
    "configuration-api-tests": {
      "passed": 48,
      "checks": [
        "configuration authenticated read",
        "configuration save {\"state\":{\"logs\":[{\"id\":\"log-default-1\",\"area\":\"Jobs\",\"level\":\"info\",\"stream\":\"operational\",\"userId\":\"service\",\"feature\":\"Job Card\",\"message\":\"Job car",
        "idempotent settings save",
        "login reception",
        "configuration authenticated read",
        "cross-session settings",
        "stale settings conflict",
        "configuration authenticated read",
        "business validation",
        "configuration authenticated read",
        "GST validation",
        "configuration authenticated read",
        "template placeholders validated",
        "configuration authenticated read",
        "invalid image content rejected",
        "configuration authenticated read",
        "owner role protected",
        "configuration authenticated read",
        "owner admin access protected",
        "configuration authenticated read",
        "system role escalation rejected",
        "login reception",
        "configuration authenticated read",
        "reception settings writes denied",
        "login service",
        "configuration authenticated read",
        "service settings writes denied",
        "login service_manager",
        "configuration authenticated read",
        "service_manager settings writes denied",
        "login accounts",
        "configuration authenticated read",
        "accounts settings writes denied",
        "login store",
        "configuration authenticated read",
        "store settings writes denied",
        "login tech",
        "configuration authenticated read",
        "tech settings writes denied",
        "configuration authenticated read",
        "custom role metadata persisted",
        "configuration authenticated read",
        "role page grant save",
        "login reception",
        "server enforces revoked page",
        "configuration authenticated read",
        "configuration authenticated read",
        "test configuration restored"
      ]
    },
    "catalog-api-tests": {
      "passed": 44,
      "checks": [
        "historical departments exact identities",
        "historical manager links preserved",
        "API command {\"id\":6,\"version\":1}",
        "duplicate department rejected",
        "API command {\"id\":6,\"version\":2}",
        "stale department rejected",
        "invalid manager role rejected",
        "API command {\"id\":6,\"version\":3}",
        "API command {\"id\":6,\"version\":4}",
        "advisor link visible cross-session",
        "API command {\"id\":6,\"version\":5}",
        "remove manager also unassigns team",
        "API command {\"id\":2,\"version\":1}",
        "API command {\"id\":2,\"version\":1}",
        "API command {\"id\":6,\"version\":1}",
        "invalid GST rejected",
        "missing department rejected",
        "API command {\"id\":6,\"version\":2}",
        "API command {\"id\":226,\"job_no\":\"JC-2026-001473\",\"visit_id\":226,\"customer_id\":320,\"vehicle_id\":230}",
        "API command {\"id\":7,\"version\":1}",
        "catalog snapshot preserves rate and GST",
        "API command {\"id\":7,\"version\":2}",
        "API command {\"id\":8,\"version\":1}",
        "login reception",
        "reception catalog writes denied",
        "reception task list writes denied",
        "login accounts",
        "accounts catalog writes denied",
        "accounts task list writes denied",
        "login store",
        "store catalog writes denied",
        "store task list writes denied",
        "login tech",
        "tech catalog writes denied",
        "tech task list writes denied",
        "login service_manager",
        "service_manager catalog writes denied",
        "service_manager task list writes denied",
        "API command {\"id\":7,\"version\":3}",
        "task archived",
        "API command {\"id\":6,\"version\":3}",
        "catalog archived",
        "API command {\"id\":6,\"version\":6}",
        "archived department appointment denied"
      ]
    },
    "sales-api-tests": {
      "passed": 35,
      "checks": [
        "lead create {\"id\":4,\"version\":1}",
        "lead retry deduplicated",
        "blank lead rejected",
        "bad lead stage rejected",
        "lead edit and site visit",
        "login admin",
        "lead independent session",
        "quotation create {\"id\":3,\"version\":1}",
        "quotation retry deduplicated",
        "approved create arithmetic",
        "source quotation numbering",
        "create moves lead to quotation sent",
        "draft edit",
        "approved edit arithmetic",
        "replacement lines projected once",
        "invalid quantity denied",
        "untrusted template denied",
        "historical quotation immutable",
        "mark sent",
        "sent draft edit denied",
        "accept",
        "accepted lead won",
        "terminal status immutable",
        "login service",
        "service sales write denied",
        "login service_manager",
        "service_manager sales write denied",
        "login reception",
        "reception sales write denied",
        "login accounts",
        "accounts sales write denied",
        "login store",
        "store sales write denied",
        "login tech",
        "tech sales write denied"
      ]
    },
    "ownership-api-tests": {
      "passed": 9,
      "checks": [
        "fixture has historical visits",
        "historical vehicle current owner changes {\"id\":1,\"customer_id\":294,\"number\":\"OD02DM1001\",\"make\":\"Hyundai\",\"model\":\"Creta\",\"color\":\"White\",\"km",
        "retry deduplicated",
        "historical visits unmodified",
        "login reception",
        "new owner cross session",
        "old customer retains job history",
        "stale transfer rejected",
        "restore owner with audited write"
      ]
    },
    "sales-browser-tests": {
      "passed": 5,
      "checks": [
        "lead saves from approved dialog",
        "quotation shown with create total",
        "quotation edit uses approved discount tax",
        "quotation produces a PDF download",
        "CRM lifecycle persists reload"
      ]
    },
    "tasklist-browser-tests": {
      "passed": 6,
      "checks": [
        "fixture",
        "manual task persisted",
        "done persists",
        "nonempty prefill",
        "estimate includes source task and rate",
        "task survives reload"
      ]
    },
    "ownership-browser-tests": {
      "passed": 3,
      "checks": [
        "existing editor changes owner despite historical visits",
        "historical customer associations unchanged",
        "ownership persists reload"
      ]
    },
    "dashboard-report-tests": {
      "passed": 6,
      "checks": [
        "dashboard total visits from PostgreSQL",
        "dashboard active count from PostgreSQL",
        "dashboard closed count",
        "Excel contains PostgreSQL lead",
        "PDF export is valid PDF",
        "settings and documents not stored in browser"
      ]
    },
    "remaining-storage-tests": {
      "passed": 51,
      "checks": [
        "prior stock browser source preserved byte-for-byte",
        "prior operations browser source preserved byte-for-byte",
        "prior estimates browser source preserved byte-for-byte",
        "prior browser document snapshots preserved",
        "no persisted users business rows",
        "no persisted bookings business rows",
        "no persisted booking_events business rows",
        "no persisted booking_call_logs business rows",
        "no persisted booking_capacity_limits business rows",
        "no persisted booking_capacity_overrides business rows",
        "no persisted tasks business rows",
        "no persisted qc_checks business rows",
        "no persisted followups business rows",
        "no persisted service_departments business rows",
        "no persisted service_department_managers business rows",
        "no persisted service_advisor_teams business rows",
        "no persisted service_catalog_items business rows",
        "no persisted service_brands business rows",
        "no persisted car_segments business rows",
        "no persisted job_task_list_items business rows",
        "no persisted sales_leads business rows",
        "no persisted sales_quotations business rows",
        "no persisted sales_quotation_lines business rows",
        "no persisted customers business rows",
        "no persisted vehicles business rows",
        "no persisted visits business rows",
        "no persisted job_cards business rows",
        "no persisted estimates business rows",
        "no persisted estimate_items business rows",
        "no persisted material_approvals business rows",
        "no persisted material_approval_events business rows",
        "no persisted photos business rows",
        "no persisted invoice_events business rows",
        "no persisted invoices business rows",
        "no persisted invoice_items business rows",
        "no persisted payments business rows",
        "no persisted receipts business rows",
        "no persisted gate_passes business rows",
        "no persisted inventory business rows",
        "no persisted suppliers business rows",
        "no persisted stock_ledger business rows",
        "no persisted stock_inwards business rows",
        "no persisted purchase_orders business rows",
        "no persisted purchase_order_lines business rows",
        "no persisted purchase_order_receipts business rows",
        "no persisted purchase_order_receipt_lines business rows",
        "no persisted purchase_order_confirmations business rows",
        "no persisted material_requests business rows",
        "no persisted inward_purchases business rows",
        "no persisted inward_purchase_lines business rows",
        "all sampled integrated local write paths fail closed after serialization"
      ],
      "source_sha256": "04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae"
    },
    "roles-tests": {
      "passed": 8,
      "results": [
        "membership version invalidates session",
        "admin manual login, authorized navigation, login-route redirect",
        "reception manual login, authorized navigation, login-route redirect",
        "service manual login, authorized navigation, login-route redirect",
        "service_manager manual login, authorized navigation, login-route redirect",
        "accounts manual login, authorized navigation, login-route redirect",
        "store manual login, authorized navigation, login-route redirect",
        "tech manual login, authorized navigation, login-route redirect"
      ]
    }
  },
  "new_documentation_files": [
    "docs/backend-migration/46-REMAINING-MODULES-HISTORICAL-EXCEPTIONS.md",
    "docs/backend-migration/stage6-remaining-evidence.json.md"
  ],
  "final_git_diff_check": "PASS",
  "final_database_head": "20261022_0053"
}