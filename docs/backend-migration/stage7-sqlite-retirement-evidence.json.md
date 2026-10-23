# Stage 48 — SQLite retirement evidence

```json
{
  "stage": 48,
  "branch": "Prem-dev-fbb-Go21",
  "head": "adb37f2f49b7201aaa5ed57b726db9d39426d349",
  "approved_baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
  "stage48_files": [
    {
      "file": "backend/customer-slice/compare_retirement_visuals.py",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/prepare_retirement_execution.py",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/retirement_browser_guard.mjs",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/retirement_visual_fixture.mjs",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/run_retirement_browsers.py",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/run_retirement_extra.py",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/run_retirement_visuals.py",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/test_retirement_administration.mjs",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/test_retirement_guards.mjs",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/test_retirement_production.mjs",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/test_retirement_worker.mjs",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/verify_retirement_preservation.py",
      "status": "added"
    },
    {
      "file": "backend/customer-slice/verify_retirement_writes.py",
      "status": "added"
    },
    {
      "file": "docs/backend-migration/48-SQLITE-RETIREMENT-FINAL-REGRESSION.md",
      "status": "added"
    },
    {
      "file": "docs/backend-migration/README.md",
      "status": "modified"
    },
    {
      "file": "docs/backend-migration/stage7-sqlite-retirement-evidence.json.md",
      "status": "added"
    },
    {
      "file": "package-lock.json",
      "status": "modified"
    },
    {
      "file": "package.json",
      "status": "modified"
    },
    {
      "file": "public/sw.js",
      "status": "modified"
    },
    {
      "file": "src/App.tsx",
      "status": "modified"
    },
    {
      "file": "src/admin-demo-state.ts",
      "status": "modified"
    },
    {
      "file": "src/administration-api.ts",
      "status": "modified"
    },
    {
      "file": "src/customer-api.ts",
      "status": "modified"
    },
    {
      "file": "src/db.ts",
      "status": "modified"
    },
    {
      "file": "src/developer-control-plane.ts",
      "status": "modified"
    },
    {
      "file": "src/document-snapshots.ts",
      "status": "modified"
    },
    {
      "file": "src/postgres-only.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/billing-domain.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/bookings.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/followup-completion.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/inventory.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/invoice.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/job-media.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/job-sheet.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/lifecycle-model.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/materials.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/postgres-runtime.test.ts",
      "status": "added"
    },
    {
      "file": "unit-tests/purchase-order-receipt-confirmation.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/sales-crm.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/service-task-catalog-assignments.test.ts",
      "status": "modified"
    },
    {
      "file": "unit-tests/team-structure.test.ts",
      "status": "modified"
    },
    {
      "file": "vite.config.ts",
      "status": "modified"
    }
  ],
  "scope_note": "Delta from preserved uncommitted Stage 47 checkpoint; excludes scratch outputs and ignored generated artifacts.",
  "unit": {
    "passed": 248,
    "failed": 0,
    "stage47_passed": 244,
    "new_tests": 4
  },
  "build": {
    "backend": "postgresql",
    "sqliteRuntimeModules": [],
    "testMode": false
  },
  "api": [
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
      "exit": 0
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
  "normal_browser": [
    {
      "suite": "test_customer_regression.mjs",
      "exit": 0
    },
    {
      "suite": "test_vehicle_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_booking_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_intake_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_tasklist_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_estimate_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_approval_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_stock_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_stock_job_browser.mjs",
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
      "suite": "test_configuration_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_catalog_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_sales_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_ownership_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_roles.mjs",
      "exit": 0
    },
    {
      "suite": "test_postgres_only_checklist.mjs",
      "exit": 0
    },
    {
      "suite": "test_administration_browser.mjs",
      "exit": 0,
      "previous_exit": 1
    },
    {
      "suite": "test_execution_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_dashboard_reports.mjs",
      "exit": 0
    }
  ],
  "normal_browser_traffic": [
    {
      "suite": "test_customer_regression.mjs",
      "contexts": 3,
      "verifiedAppPages": 3,
      "api_requests": 99,
      "successful_mutation_requests": 7,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_vehicle_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 59,
      "successful_mutation_requests": 5,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_booking_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 81,
      "successful_mutation_requests": 7,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_intake_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 80,
      "successful_mutation_requests": 9,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_tasklist_browser.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 51,
      "successful_mutation_requests": 5,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_estimate_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 76,
      "successful_mutation_requests": 9,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_approval_browser.mjs",
      "contexts": 3,
      "verifiedAppPages": 3,
      "api_requests": 76,
      "successful_mutation_requests": 7,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_stock_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 120,
      "successful_mutation_requests": 12,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_stock_job_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 60,
      "successful_mutation_requests": 6,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_financial_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 119,
      "successful_mutation_requests": 20,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_financial_edges_browser.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 95,
      "successful_mutation_requests": 24,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_configuration_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 53,
      "successful_mutation_requests": 5,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_catalog_browser.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 36,
      "successful_mutation_requests": 3,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_sales_browser.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 50,
      "successful_mutation_requests": 6,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_ownership_browser.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 37,
      "successful_mutation_requests": 3,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_roles.mjs",
      "contexts": 7,
      "verifiedAppPages": 7,
      "api_requests": 139,
      "successful_mutation_requests": 7,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_postgres_only_checklist.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 49,
      "successful_mutation_requests": 4,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_administration_browser.mjs",
      "contexts": 2,
      "verifiedAppPages": 2,
      "api_requests": 46,
      "successful_mutation_requests": 5,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_execution_browser.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 50,
      "successful_mutation_requests": 7,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    },
    {
      "suite": "test_dashboard_reports.mjs",
      "contexts": 1,
      "verifiedAppPages": 1,
      "api_requests": 17,
      "successful_mutation_requests": 1,
      "forbiddenRequests": [],
      "localAttempts": [],
      "missingMode": []
    }
  ],
  "targeted_administration": {
    "passed": 5,
    "checks": [
      "create user through approved form",
      "created user manual login",
      "edit without password replacement",
      "edited account session revoked",
      "archive through approved action"
    ]
  },
  "production_bundle": {
    "results": [
      {
        "role": "admin",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      },
      {
        "role": "reception",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      },
      {
        "role": "service",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      },
      {
        "role": "service_manager",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      },
      {
        "role": "accounts",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      },
      {
        "role": "store",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      },
      {
        "role": "tech",
        "manualLogin": true,
        "reloadSession": true,
        "apiReads": 1
      }
    ],
    "forbidden": []
  },
  "adversarial": {
    "checks": [
      "normal runtime, no test mode",
      "no SQLite or wasm network initialization",
      "normal startup does not attempt business storage",
      "all ten fallback/read/write attempts rejected",
      "temporary UI preference remains usable",
      "original browser records unchanged",
      "unsupported demo reset fails visibly",
      "service worker never caches API business responses",
      "offline API cannot return cached business data",
      "failed API cannot use decoy SQLite",
      "failed API displays error",
      "no source fetch on failure"
    ],
    "result": {
      "denied": [
        "read",
        "write",
        "export",
        "persist",
        "fallback",
        "localRead",
        "localWrite",
        "sessionRead",
        "sessionWrite",
        "source"
      ],
      "temporary": "jobs",
      "original": {
        "local": "DECOY ORIGINAL DO NOT CHANGE",
        "session": "DECOY ORIGINAL DO NOT CHANGE"
      }
    },
    "dialogs": [
      "Load Large Demo Dataset? Current local demo records will be replaced. This cannot be undone from this screen.",
      "PostgreSQL required: this operation requires a FastAPI integration; SQLite and browser business persistence are disabled."
    ],
    "requests": []
  },
  "worker_upgrade": {
    "oldCacheRemoved": true,
    "keys": [
      "workshopos-static-v4-postgresql"
    ],
    "offlineApiRejected": true
  },
  "database_writes": {
    "since_utc": "2026-10-22T16:47:28+00:00",
    "customer_audit_writes": 112,
    "operational_audit_counts": {
      "booking_call_logs": 1,
      "booking_capacity_overrides": 2,
      "booking_events": 11,
      "bookings": 12,
      "car_segments": 1,
      "catalogue_items": 26,
      "estimate_lines": 31,
      "estimates": 34,
      "followups": 6,
      "invoice_lines": 23,
      "invoices": 19,
      "inward_purchase_attachments": 1,
      "inward_purchase_events": 4,
      "inward_purchase_lines": 3,
      "inward_purchase_revision_lines": 1,
      "inward_purchase_revisions": 1,
      "inward_purchases": 6,
      "job_cards": 178,
      "job_checklist_cycles": 160,
      "job_checklist_items": 392,
      "job_media": 28,
      "job_service_tasks": 6,
      "legacy_gate_passes": 4,
      "legacy_invoice_events": 15,
      "legacy_material_movements": 10,
      "legacy_receipts": 4,
      "material_approvals": 8,
      "material_events": 5,
      "material_requests": 34,
      "payments": 4,
      "purchase_order_lines": 13,
      "purchase_order_quotations": 1,
      "purchase_orders": 32,
      "qc_checks": 74,
      "quotation_lines": 6,
      "quotations": 8,
      "sales_leads": 9,
      "service_brands": 1,
      "service_task_catalog": 4,
      "slice_admin_configuration": 7,
      "slice_advisor_teams": 2,
      "slice_department_managers": 2,
      "slice_departments": 7,
      "suppliers": 8,
      "technician_tasks": 33,
      "vehicles": 32,
      "visits": 26,
      "workshop_user_profiles": 15
    },
    "strict_browser_invoice_job_link": {
      "invoice": 103,
      "job": 276
    },
    "strict_browser_payment_rows_persisted": true,
    "strict_browser_media_job_link_and_archive": {
      "media": 453,
      "job": 273
    },
    "migration_head": "20261022_0053"
  },
  "preservation": {
    "head": "adb37f2f49b7201aaa5ed57b726db9d39426d349",
    "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
    "unchanged_protected_files": 84,
    "modified_protected_files": [
      "package-lock.json",
      "package.json",
      "public/sw.js",
      "src/App.tsx",
      "src/admin-console.tsx",
      "src/admin-demo-state.ts",
      "src/billing-manager.tsx",
      "src/booking-calendar.tsx",
      "src/booking-check-in.tsx",
      "src/booking-expected-today.tsx",
      "src/db.ts",
      "src/developer-control-plane.ts",
      "src/document-snapshots.ts",
      "src/job-sheet-ui.tsx",
      "src/local-sales.tsx",
      "src/materials-ui.tsx",
      "vite.config.ts",
      "unit-tests/billing-domain.test.ts",
      "unit-tests/bookings.test.ts",
      "unit-tests/followup-completion.test.ts",
      "unit-tests/inventory.test.ts",
      "unit-tests/invoice.test.ts",
      "unit-tests/job-media.test.ts",
      "unit-tests/job-sheet.test.ts",
      "unit-tests/lifecycle-model.test.ts",
      "unit-tests/materials.test.ts",
      "unit-tests/purchase-order-receipt-confirmation.test.ts",
      "unit-tests/report-templates.test.ts",
      "unit-tests/sales-crm.test.ts",
      "unit-tests/service-task-catalog-assignments.test.ts",
      "unit-tests/team-structure.test.ts"
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
  "visual": [
    {
      "state": "add",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "booking-calendar",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "booking-capacity",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "booking-create",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "catalog-catalog",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "catalog-team",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "configuration-company",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "configuration-roles",
      "different_pixels": 22,
      "max_channel_difference": 1,
      "bbox": [
        272,
        105,
        1418,
        113
      ]
    },
    {
      "state": "configuration-settings",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "configuration-templates",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "configuration-theme",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "edit",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "execution-qc",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "execution-tasks",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-accounts-Delivery",
      "different_pixels": 10,
      "max_channel_difference": 1,
      "bbox": [
        1410,
        105,
        1418,
        113
      ]
    },
    {
      "state": "financial-accounts-Invoice",
      "different_pixels": 19,
      "max_channel_difference": 1,
      "bbox": [
        24,
        105,
        1418,
        231
      ]
    },
    {
      "state": "financial-accounts-Payment",
      "different_pixels": 12,
      "max_channel_difference": 1,
      "bbox": [
        272,
        105,
        280,
        113
      ]
    },
    {
      "state": "financial-delivery-list",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-invoice-detail",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-invoice-editor",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-invoice-list",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-invoice-search",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-invoice-view",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-payment-dialog",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-payment-other",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-payments-list",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-print-Gate-Pass",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-print-Invoice",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "financial-print-Payment-Receipt",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "list",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "login",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "sales-leads",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "sales-quotations",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "search",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "users-add",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "users-list",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    },
    {
      "state": "view",
      "different_pixels": 0,
      "max_channel_difference": 0,
      "bbox": null
    }
  ],
  "visual_vs_stage47": [
    {
      "state": "configuration-roles",
      "stage47_to_stage48_pixels": 0,
      "max_channel": 0
    },
    {
      "state": "financial-accounts-Delivery",
      "stage47_to_stage48_pixels": 0,
      "max_channel": 0
    },
    {
      "state": "financial-accounts-Invoice",
      "stage47_to_stage48_pixels": 0,
      "max_channel": 0
    },
    {
      "state": "financial-accounts-Payment",
      "stage47_to_stage48_pixels": 0,
      "max_channel": 0
    }
  ],
  "unit_import_changes": {
    "files": [
      "unit-tests/billing-domain.test.ts",
      "unit-tests/bookings.test.ts",
      "unit-tests/followup-completion.test.ts",
      "unit-tests/inventory.test.ts",
      "unit-tests/invoice.test.ts",
      "unit-tests/job-media.test.ts",
      "unit-tests/job-sheet.test.ts",
      "unit-tests/lifecycle-model.test.ts",
      "unit-tests/materials.test.ts",
      "unit-tests/purchase-order-receipt-confirmation.test.ts",
      "unit-tests/sales-crm.test.ts",
      "unit-tests/service-task-catalog-assignments.test.ts",
      "unit-tests/team-structure.test.ts"
    ],
    "all_assertions_unchanged": true,
    "stage47_template_expectations_unchanged": true
  },
  "unchanged_contracts": {
    "src/styles.css": true,
    "src/report-templates.ts": true,
    "src/invoice-math.ts": true,
    "src/materials.ts": true
  },
  "recovery": {
    "working-tree.zip": {
      "sha256": "a6e8d5dcc71c60df0b077f7f52858d294fe289f76d9e19e0809d6601878666fb",
      "bytes": 40487237
    },
    "stage47-evidence.zip": {
      "sha256": "0ff4d6f47e0ca5c635077739d717bc8a67ef68d57cde7afbfaad36377ec28853",
      "bytes": 26093914
    },
    "dev.dump": {
      "sha256": "de5c1a360dd99814e85fcd2192162d053cae25ed7e0f7eb7bea9fec1a16d2d2f",
      "bytes": 1329389
    },
    "test.dump": {
      "sha256": "9a74b715cc0066880ed0016f5074e52b2c32c5e94093a4e3634adb6e00cfb850",
      "bytes": 2419375
    }
  },
  "limitations": [
    "Four strict visual comparisons differ from approved baseline; all four equal Stage 47.",
    "67 historical exceptions retained; 51 invoice discrepancies retained.",
    "SQL.js remains dev-only for recovery and fixture tests.",
    "Full database restore rehearsal and staging qualification not performed.",
    "Original browser profiles not reconciled; missing historical media requires authentic source."
  ],
  "failure_history": [
    "Administration missing-version 409 reproduced and fixed; normal retry and targeted regression passed.",
    "Sales visual route shutdown failure resolved in test fixture; recapture passed.",
    "Initial production smoke timeout; two subsequent full seven-role runs passed."
  ]
}
```
