{
  "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
  "branch": "Prem-dev-fbb-Go21",
  "head": "adb37f2f49b7201aaa5ed57b726db9d39426d349",
  "changed_tracked_files": [
    "docs/backend-migration/README.md",
    "src/App.tsx",
    "src/db.ts",
    "src/developer-control-plane.ts",
    "unit-tests/report-templates.test.ts",
    "vite.config.ts"
  ],
  "new_task_files": [
    "backend/customer-slice/compare_postgres_only_visuals.py",
    "backend/customer-slice/inventory_postgres_only.mjs",
    "backend/customer-slice/postgres_only_browser_guard.mjs",
    "backend/customer-slice/postgres_only_visual_fixture.mjs",
    "backend/customer-slice/prepare_postgres_only_execution.py",
    "backend/customer-slice/run_postgres_only_browsers.py",
    "backend/customer-slice/run_postgres_only_extra.py",
    "backend/customer-slice/run_postgres_only_visuals.py",
    "backend/customer-slice/test_postgres_only_checklist.mjs",
    "backend/customer-slice/test_postgres_only_guards.mjs",
    "backend/customer-slice/test_postgres_projection_parity.mjs",
    "backend/customer-slice/verify_postgres_only_preservation.py",
    "backend/customer-slice/verify_postgres_only_writes.py",
    "docs/backend-migration/47-POSTGRESQL-ONLY-VERIFICATION.md",
    "src/postgres-only.ts",
    "src/postgres-projection-defaults.json",
    "src/postgres-state.ts",
    "docs/backend-migration/stage6-postgres-only-evidence.json.md"
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
  "strict_browser_regressions": [
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
      "suite": "test_execution_browser.mjs",
      "exit": 0
    },
    {
      "suite": "test_dashboard_reports.mjs",
      "exit": 0
    },
    {
      "suite": "test_postgres_only_checklist.mjs",
      "exit": 0
    }
  ],
  "strict_traffic": {
    "suites": 20,
    "contexts": 40,
    "verifiedAppPages": 40,
    "api_responses": 1387,
    "successful_non_auth_mutations": 111,
    "forbidden_requests": 0,
    "unexpected_local_attempts": 0,
    "missing_mode": 0
  },
  "adversarial_checks": [
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
  "checklist_checks": [
    "first ordered checklist action enabled",
    "checkbox writes through FastAPI",
    "checked state survives independent session",
    "PostgreSQL checklist records real actor and time"
  ],
  "projection_parity": {
    "populated_test_differences": [],
    "preserved_source_differences": []
  },
  "database_writes": {
    "since_utc": "2026-10-22T10:32:32+00:00",
    "customer_audit_writes": 115,
    "operational_audit_counts": {
      "booking_call_logs": 1,
      "booking_capacity_overrides": 2,
      "booking_events": 11,
      "bookings": 12,
      "car_segments": 1,
      "catalogue_items": 26,
      "estimate_lines": 32,
      "estimates": 36,
      "followups": 6,
      "invoice_lines": 23,
      "invoices": 19,
      "inward_purchase_attachments": 1,
      "inward_purchase_events": 4,
      "inward_purchase_lines": 3,
      "inward_purchase_revision_lines": 1,
      "inward_purchase_revisions": 1,
      "inward_purchases": 6,
      "job_cards": 188,
      "job_checklist_cycles": 168,
      "job_checklist_items": 411,
      "job_media": 31,
      "job_service_tasks": 8,
      "legacy_gate_passes": 4,
      "legacy_invoice_events": 15,
      "legacy_material_movements": 10,
      "legacy_receipts": 4,
      "material_approvals": 12,
      "material_events": 5,
      "material_requests": 34,
      "payments": 4,
      "purchase_order_lines": 13,
      "purchase_order_quotations": 1,
      "purchase_orders": 32,
      "qc_checks": 83,
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
      "technician_tasks": 36,
      "vehicles": 35,
      "visits": 29,
      "workshop_user_profiles": 7
    },
    "strict_browser_invoice_job_link": {
      "invoice": 93,
      "job": 252
    },
    "strict_browser_payment_rows_persisted": true,
    "strict_browser_media_job_link_and_archive": {
      "media": 426,
      "job": 249
    },
    "migration_head": "20261022_0053"
  },
  "preservation": {
    "head": "adb37f2f49b7201aaa5ed57b726db9d39426d349",
    "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
    "unchanged_protected_files": 100,
    "modified_protected_files": [
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
      "unit-tests/report-templates.test.ts"
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
  "visual_runs": [
    {
      "suite": "test_configuration_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_financial_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_booking_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_execution_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_users_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_catalog_visual.mjs",
      "exit": 0
    },
    {
      "suite": "test_sales_visual.mjs",
      "exit": 0
    }
  ],
  "visual_comparison": [
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
  "unit": {
    "passed": 244,
    "failed": 0,
    "stale_expectations_corrected": 3
  },
  "build": {
    "normal": "PASS with existing chunk advisory",
    "strict_deployment_build": "EXPECTED REJECTION"
  },
  "unreferenced_declarations": {
    "LegacyInwardPurchasesWorkspace": [
      {
        "file": "src/App.tsx",
        "line": 6226,
        "kind": "FunctionDeclaration"
      }
    ],
    "InwardPurchasesWorkspace": [
      {
        "file": "src/App.tsx",
        "line": 6927,
        "kind": "FunctionDeclaration"
      }
    ],
    "InventoryMaterialsManager": [
      {
        "file": "src/App.tsx",
        "line": 10954,
        "kind": "FunctionDeclaration"
      }
    ],
    "DuplicateInventoryEditor": [
      {
        "file": "src/App.tsx",
        "line": 17505,
        "kind": "FunctionDeclaration"
      }
    ],
    "DuplicateVisitEditor": [
      {
        "file": "src/App.tsx",
        "line": 12075,
        "kind": "FunctionDeclaration"
      }
    ],
    "DeveloperConsole": [
      {
        "file": "src/App.tsx",
        "line": 271,
        "kind": "ImportSpecifier"
      },
      {
        "file": "src/App.tsx",
        "line": 1107,
        "kind": "JsxSelfClosingElement"
      },
      {
        "file": "src/developer-console.tsx",
        "line": 5,
        "kind": "FunctionDeclaration"
      }
    ]
  },
  "retirement": "NOT PERFORMED; normal runtime still requires SQL.js",
  "staging_ready": false,
  "schema_changes": false,
  "committed_or_pushed": false,
  "final_diff_check": "PASS"
}