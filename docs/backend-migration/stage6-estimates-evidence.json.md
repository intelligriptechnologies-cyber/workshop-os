{
  "date": "2026-10-22",
  "report": "43-ESTIMATES-APPROVALS-JOB-DOCUMENTS-SLICE.md",
  "suites": {
    "backend-tests": {
      "passed": 42
    },
    "vehicle-api-tests": {
      "passed": 13
    },
    "intake-job-api-tests": {
      "passed": 24
    },
    "lifecycle-api-tests": {
      "passed": 5
    },
    "estimate-api-tests": {
      "passed": 53
    },
    "material-approval-tests": {
      "passed": 19
    },
    "estimate-browser-tests": {
      "passed": 19
    },
    "approval-browser-tests": {
      "passed": 7
    },
    "document-restart-tests": {
      "passed": 4
    },
    "estimate-storage-tests": {
      "passed": 17
    },
    "operations-customer-regression": {
      "passed": 25
    },
    "vehicle-browser-tests": {
      "passed": 8
    },
    "intake-job-browser-tests": {
      "passed": 14
    },
    "roles-tests": {
      "passed": 8
    },
    "calculation-parity": {
      "passed": 503,
      "failed": 0
    }
  },
  "unit_suite": {
    "passed": 241,
    "failed": 3,
    "reason": "Pre-existing template count assertions: expected 6, actual 8"
  },
  "build": "passed",
  "typecheck": "passed",
  "visual_capture": "Unchanged captured document HTML rendered with loaded fonts/images; actual print/download separately exercised.",
  "estimate-preservation": {
    "head": "ac687e81e984b81e67b27c05f0329e65fba7b886",
    "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
    "unchanged_protected_files": 110,
    "modified_protected_files": [
      "src/App.tsx",
      "src/db.ts",
      "src/document-snapshots.ts",
      "src/job-sheet-ui.tsx",
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
      "legacy_gate_passes": 27
    },
    "development_original_tables_identical": 103,
    "test_immutable_tables_identical": 86,
    "financial_and_custody_unchanged": true,
    "missing_estimate_or_job_parents": 0
  },
  "estimate-visual-results": {
    "estimate-approval-dialog.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-approvals-empty.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-documents.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-editor.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-list.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-media-authorized-difference.png": {
      "different_pixels": 104816,
      "bounds": [
        78,
        523,
        1361,
        779
      ],
      "max_channel_difference": 212,
      "authorized_media_change": true
    },
    "estimate-print-Estimate.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-print-Gate-Pass.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-print-Invoice.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-print-Job-Card.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    },
    "estimate-print-Payment-Receipt.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0,
      "authorized_media_change": false
    }
  }
}
