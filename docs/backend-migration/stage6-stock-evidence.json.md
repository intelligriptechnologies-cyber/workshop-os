# Stock integration verification evidence

See [implementation report 44](44-PURCHASES-INVENTORY-STOCK-SLICE.md) for scope, file changes, regression results and limitations. Raw local artifacts remain under `backend/customer-slice/artifacts/`; this summary contains no credentials.

```json
{
  "date": "2026-10-22",
  "test_environment": "Disposable slice_test and isolated browser contexts",
  "suites": {
    "purchase-stock-tests.json": {
      "passed": 41
    },
    "purchase-stock-edge-tests.json": {
      "passed": 20
    },
    "stock-browser-tests.json": {
      "passed": 13
    },
    "stock-job-browser-tests.json": {
      "passed": 3
    },
    "stock-storage-tests.json": {
      "passed": 30
    }
  },
  "preservation": {
    "head": "ac687e81e984b81e67b27c05f0329e65fba7b886",
    "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
    "unchanged_protected_files": 109,
    "modified_protected_files": [
      "src/App.tsx",
      "src/db.ts",
      "src/document-snapshots.ts",
      "src/job-sheet-ui.tsx",
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
    "test_immutable_tables_identical": 66,
    "financial_and_custody_unchanged": true,
    "missing_estimate_or_job_parents": 0,
    "historical_rows_exact": 7,
    "source_stock_on_hand": {
      "1": 500.0,
      "2": 79.0,
      "3": 60.0,
      "4": 3.0
    },
    "quarantine_custody_unchanged": true
  },
  "visual_comparison": {
    "inventory.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "low-stock.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "movement-history.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "purchase-list.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "request-add.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "sku-edit.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "store-inventory.png": {
      "different_pixels": 59,
      "bounds": [
        272,
        56,
        1418,
        870
      ],
      "max_channel_difference": 1
    },
    "supplier-add.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "supplier-edit.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "suppliers.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    }
  },
  "checks": {
    "typescript": "passed",
    "production_build": "passed",
    "unit_suite": {
      "passed": 241,
      "failed": 3,
      "failures": "Pre-existing report-template count assertions: expected 6, actual 8"
    }
  },
  "limits": [
    "Seven historical rows remain in original custody quarantine; exact immutable compatibility projection supplies stock history and balances.",
    "Dormant standalone inward-purchase and inventory-adjustment screens are not newly routed; those paths have API coverage only.",
    "No deployment, commit, push or original persistence retirement."
  ]
}
```
