{
  "financial-api-tests": {
    "passed": 49,
    "checks": [
      "invoice create and mixed tax proportional discount",
      "approved numbering",
      "invoice create retry",
      "duplicate invoice denied",
      "conflicting retry denied",
      "login accounts",
      "login tech",
      "login service",
      "edit requires note",
      "linked advisor edit persisted",
      "stale edit denied",
      "accounts edit denied",
      "technician edit denied",
      "negative discount rejected",
      "empty lines rejected",
      "foreign line rejected",
      "invalid GST rejected",
      "capped discount and no GST parity",
      "removed line archived",
      "payment before completed denied",
      "review reminder gate",
      "existing payment N/A remains nonfinancial",
      "existing payment N/A undo",
      "arbitrary partial amount rejected",
      "other detail required",
      "advisor payment denied",
      "document validation rollback",
      "failed payment left no rows",
      "concurrent same-key payment one result",
      "one full payment allocation",
      "invoice cleared and job closed",
      "receipt gate pass and acknowledgement atomic",
      "three durable snapshots",
      "duplicate different-key payment blocked",
      "payment payload-key conflict",
      "closed job payment void denied",
      "closed invoice edit denied",
      "independent accounts session sees settlement",
      "void retains original invoice",
      "void document persisted",
      "replacement numbering unique",
      "competing payment identities one winner",
      "historical invoices exact preservation",
      "historical invoice_items exact preservation",
      "historical payments exact preservation",
      "historical receipts exact preservation",
      "historical gate_passes exact preservation",
      "historical financial mutation denied",
      "historical payment denied"
    ],
    "settled_job": 201,
    "invoice_id": 67
  },
  "financial-material-tests": {
    "passed": 10,
    "checks": [
      "foreign job material denied",
      "unissued material denied",
      "duplicate material claim denied",
      "failed claims roll back invoice and claim",
      "issued material claimed by invoice",
      "invoicing never consumes stock twice",
      "invoiced material stock edit denied",
      "line removal unlocks material without stock replay",
      "late material pickup",
      "material linkage is immutable on line edit"
    ]
  },
  "financial-database-tests": {
    "passed": 11,
    "checks": [
      "database protects imported invoices",
      "database protects imported invoice_lines",
      "database protects imported payments",
      "database protects imported legacy_receipts",
      "database protects imported legacy_gate_passes",
      "financial deletes prohibited",
      "invoice provenance immutable",
      "invoice events immutable",
      "database rejects partial posting",
      "database rejects duplicate settled posting",
      "branch RLS hides invoices payments and snapshots"
    ]
  },
  "financial-browser-tests": {
    "passed": 18,
    "checks": [
      "approved estimate prefill",
      "visible mixed GST discount parity",
      "existing create dialog saves {\"id\":66,\"version\":1,\"totals\":{\"lines\":[{\"amount\":1000.0,\"discount\":66.67,\"taxable\":933.33,\"gst\":168.0,\"total\":1101.33},{\"amount\":500.0,\"discount\":33.33,\"taxable\":466.67,\"gst\":0.0,\"total\":466.67}],\"subtotal\":1500.0,\"discount\":100.0,\"taxable\":1400.0,\"gst\":168.0,\"total\":1568.0}}",
      "existing editor saves {\"id\":66,\"version\":2}",
      "PostgreSQL total equals preview",
      "payment amount remains read-only",
      "full payment committed {\"closed\":true,\"id\":35,\"invoice_id\":66,\"job_id\":199,\"receipt_id\":35,\"gate_pass_id\":35}",
      "settlement and closure persisted",
      "receipt gate and full allocation",
      "three approved-renderer snapshots",
      "Invoice prints frozen template",
      "Invoice PDF download",
      "Payment Receipt prints frozen template",
      "Payment Receipt PDF download",
      "Gate Pass prints frozen template",
      "Gate Pass PDF download",
      "independent accounts session settlement",
      "no browser exceptions"
    ],
    "job": {
      "id": 199,
      "job_no": "JC-2026-001446",
      "visit_id": 199,
      "customer_id": 261,
      "vehicle_id": 202
    },
    "invoiceId": 66
  },
  "financial-browser-edges": {
    "passed": 5,
    "checks": [
      "active-job invoice void through approved dialog {\"id\":74}",
      "void keeps invoice and immutable document",
      "payment checklist uses atomic financial command {\"closed\":true,\"id\":41,\"invoice_id\":75,\"job_id\":208,\"receipt_id\":39,\"gate_pass_id\":39}",
      "checklist default Cash and closure",
      "checklist generates all frozen documents"
    ]
  },
  "financial-storage-tests": {
    "passed": 32,
    "checks": [
      "prior stock browser source preserved byte-for-byte",
      "prior operations browser source preserved byte-for-byte",
      "prior estimates browser source preserved byte-for-byte",
      "prior browser document snapshots preserved",
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
      "all eleven integrated local write paths fail closed after serialization"
    ],
    "source_sha256": "04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae"
  },
  "financial-preservation": {
    "head": "26adbd91b9c6b4376f69cc22c354812a7613a804",
    "baseline": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
    "unchanged_protected_files": 108,
    "modified_protected_files": [
      "src/App.tsx",
      "src/billing-manager.tsx",
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
    "test_immutable_tables_identical": 60,
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
  "financial-visual-results": {
    "financial-accounts-Delivery.png": {
      "different_pixels": 10,
      "bounds": [
        1410,
        105,
        1418,
        113
      ],
      "max_channel_difference": 1
    },
    "financial-accounts-Invoice.png": {
      "different_pixels": 19,
      "bounds": [
        24,
        105,
        1418,
        231
      ],
      "max_channel_difference": 1
    },
    "financial-accounts-Payment.png": {
      "different_pixels": 12,
      "bounds": [
        272,
        105,
        280,
        113
      ],
      "max_channel_difference": 1
    },
    "financial-delivery-list.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-invoice-detail.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-invoice-editor.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-invoice-list.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-invoice-search.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-invoice-view.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-payment-dialog.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-payment-other.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-payments-list.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-print-Gate-Pass.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-print-Invoice.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "financial-print-Payment-Receipt.png": {
      "different_pixels": 0,
      "bounds": null,
      "max_channel_difference": 0
    },
    "Invoice HTML": {
      "identical": true
    },
    "Payment-Receipt HTML": {
      "identical": true
    },
    "Gate-Pass HTML": {
      "identical": true
    }
  },
  "calculation-parity": {
    "passed": 503,
    "failed": 0,
    "reference": "src/invoice-math.ts invoiceTotals, unchanged from a315448"
  },
  "document-restart-tests": {
    "passed": 4,
    "checks": [
      "persistent session survives API process restart",
      "durable uploaded bytes survive restart",
      "frozen snapshots survive restart",
      "existing session returns to authorized UI after restart"
    ],
    "media_id": 311,
    "sha256": "06249728ebfccdc88b28f0776a4481189fb2f636013b804e9c9b41236893637f"
  },
  "historical_reconciliation": {
    "discrepancies": 51,
    "action": "preserved; no corrections",
    "report": "backend/customer-slice/artifacts/financial-reconciliation.json"
  },
  "limitations": [
    "Imported finance remains read-only",
    "Approved workflow is one full payment, no partial or write-off entry",
    "241 unit tests pass; 3 pre-existing report-template failures",
    "12/15 screenshots pixel-identical; Accounts screens have 10/19/12 pixels differing by at most one channel level",
    "No production deployment, persistence retirement or restore rehearsal"
  ]
}
