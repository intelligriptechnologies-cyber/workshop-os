{
  "stage": 49,
  "scope": "Local staging preparation only; remote inventory read-only",
  "branch": "Prem-dev-fbb-Go21",
  "initial_head": "adb37f2f49b7201aaa5ed57b726db9d39426d349",
  "final_observed_head": "158f092d90b229e0148d0216b91d3f4f0d426079",
  "approved_frontend": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
  "agent_commit_or_push": false,
  "final_index_empty": true,
  "files_changed": [
    "backend/customer-slice/api.py",
    "backend/customer-slice/runtime_config.py",
    "deploy/stage49/Caddyfile.local",
    "deploy/stage49/Dockerfile.api",
    "deploy/stage49/Dockerfile.frontend",
    "deploy/stage49/READINESS.md",
    "deploy/stage49/compose.initialize.yaml",
    "deploy/stage49/compose.local.yaml",
    "deploy/stage49/compose.yaml",
    "deploy/stage49/initialize.py",
    "deploy/stage49/inventory-host.sh",
    "deploy/stage49/inventory-postgres.sql",
    "deploy/stage49/nginx.conf",
    "deploy/stage49/prepare_context.py",
    "deploy/stage49/staging.env.example",
    "deploy/stage49/test_local_browser.mjs",
    "deploy/stage49/test_runtime_config.py",
    "deploy/stage49/validate_package.py",
    "deploy/stage49/validate_release.py",
    "deploy/stage49/verify_data_local.py",
    "deploy/stage49/verify_restore_local.py",
    "docs/backend-migration/49-STAGING-DEPLOYMENT-PREPARATION.md",
    "docs/backend-migration/README.md",
    "docs/backend-migration/stage8-staging-preparation-evidence.json.md",
    "src/db.ts",
    "src/developer-control-plane.ts"
  ],
  "checkpoint_tracked_files": 1203,
  "checkpoint_files_now_different": [
    "backend/customer-slice/api.py",
    "docs/backend-migration/README.md",
    "src/db.ts",
    "src/developer-control-plane.ts"
  ],
  "remote_state_unchanged": true,
  "remote_state_sha256": "95b5a606229cbc1067eb3026773ebfaadff622d680582482a3b6d7594ef5581a",
  "package": {
    "compose_no_published_ports": true,
    "isolated_database": true,
    "no_legacy_proxy_alias": true,
    "resource_limits": true,
    "production_demo_literals_absent": true,
    "production_sqlite_wasm_absent": true,
    "sqljs_dev_only": true,
    "runtime_manifest": {
      "backend": "postgresql",
      "sqliteRuntimeModules": [],
      "testMode": false
    },
    "images": {
      "workshopos-stage49-api:local": "sha256:8de208f43c9ef04838749ef8140610707ba0cafdfe6a3379dcbef9edb90317e4",
      "workshopos-stage49-frontend:local": "sha256:0372e0d9bb883590e51d48e1159f401e417e1c6eb1ea2051976bf8bb0acdcae2"
    },
    "source_sqlite_sha256": "04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae"
  },
  "data_preservation": {
    "custody_rows_exact": 3241,
    "quarantine_rows": 67,
    "financial_rows_exact": 242,
    "historical_stock_rows_exact": 7,
    "stock_balances": {
      "1": 500.0,
      "2": 79.0,
      "3": 60.0,
      "4": 3.0
    },
    "source_sqlite_files_unchanged": 8,
    "baseline_screenshots_unchanged": 94
  },
  "browser": {
    "results": [
      {
        "role": "admin",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": false
      },
      {
        "role": "reception",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": false
      },
      {
        "role": "service",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": true
      },
      {
        "role": "service_manager",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": true
      },
      {
        "role": "accounts",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": true
      },
      {
        "role": "store",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": true
      },
      {
        "role": "tech",
        "manualLogin": true,
        "reloadSession": true,
        "secureCookie": true,
        "csrfDenied": true,
        "logout": true,
        "customerMutationDenied": true
      }
    ],
    "forbidden": [],
    "customerId": 125,
    "mediaId": 292,
    "crossSession": true,
    "accessGate": true
  },
  "restore": {
    "tables_exact": 120,
    "all_row_hashes_exact": true,
    "sequence_values_exact": true,
    "media_and_document_tables_included": true,
    "restricted_runtime_role": true,
    "dump_bytes": 1359758,
    "dump_sha256": "30832ebba507b49e7a4dcc05214f591498cde0f6ebd18dd9bbd8f843a8da1092",
    "target": "workshopos-stage49-restore-verified",
    "remote_changes": false
  },
  "tests": {
    "unit_passed": 248,
    "unit_failed": 0,
    "runtime_test_methods_passed": 2,
    "production_images_built": true,
    "nonempty_initialization_refused": true,
    "historical_invoice_discrepancies": 51,
    "full_packaged_workflow_matrix_rerun": false,
    "new_visual_comparison_run": false,
    "prior_stage48_only": {
      "api_invocations": 16,
      "browser_workflow_suites": 20,
      "visual_exact": 33,
      "visual_total": 37,
      "tiny_rasterization_differences": 4
    }
  },
  "activation_gates": [
    "Explicit remote activation and proxy cutover authorization",
    "Peak capacity and disk/backup headroom",
    "Unique secret provisioning and Linux mount permissions",
    "Real-host HTTPS certificate/session/routing verification",
    "Encrypted off-host backup retention, alerts and restore operator",
    "Full packaged workflow/visual acceptance and historical exception acceptance"
  ]
}
