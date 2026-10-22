{
  "checkout": [
    {
      "file": "backend/alembic/versions/20260929_0002_tenant_session.py",
      "revision": "20260929_0002",
      "down_revision": "20260929_0001"
    },
    {
      "file": "backend/alembic/versions/20260929_0003_superadmin.py",
      "revision": "20260929_0003",
      "down_revision": "20260929_0002"
    },
    {
      "file": "backend/alembic/versions/20260929_0004_tenant_administration.py",
      "revision": "20260929_0004",
      "down_revision": "20260929_0003"
    },
    {
      "file": "backend/alembic/versions/20260929_0005_intake.py",
      "revision": "20260929_0005",
      "down_revision": "20260929_0004"
    },
    {
      "file": "backend/alembic/versions/20260929_0006_jobs_estimates.py",
      "revision": "20260929_0006",
      "down_revision": "20260929_0005"
    },
    {
      "file": "backend/alembic/versions/20260929_0007_catalogue_stock.py",
      "revision": "20260929_0007",
      "down_revision": "20260929_0006"
    },
    {
      "file": "backend/alembic/versions/20260929_0008_job_material_ledger.py",
      "revision": "20260929_0008",
      "down_revision": "20260929_0007"
    },
    {
      "file": "backend/alembic/versions/20260929_0009_purchase_order_line_delete.py",
      "revision": "20260929_0009",
      "down_revision": "20260929_0008"
    },
    {
      "file": "backend/alembic/versions/20261001_0001_foundation.py",
      "revision": "20260929_0001",
      "down_revision": null
    },
    {
      "file": "backend/alembic/versions/20261001_0002_execution_qc.py",
      "revision": "20261001_0002",
      "down_revision": "20260929_0008"
    },
    {
      "file": "backend/alembic/versions/20261001_0003_merge_purchase_order_execution_heads.py",
      "revision": "20261001_0003",
      "down_revision": [
        "20260929_0009",
        "20261001_0002"
      ]
    },
    {
      "file": "backend/alembic/versions/20261001_0004_finance_delivery.py",
      "revision": "20261001_0004",
      "down_revision": "20261001_0003"
    },
    {
      "file": "backend/alembic/versions/20261001_0005_followups_search.py",
      "revision": "20261001_0005",
      "down_revision": "20261001_0004"
    },
    {
      "file": "backend/alembic/versions/20261001_0006_finance_corrections_and_invoice_claims.py",
      "revision": "20261001_0006",
      "down_revision": "20261001_0005"
    },
    {
      "file": "backend/alembic/versions/20261002_0013_finance_corrections.py",
      "revision": "20261002_0013",
      "down_revision": "20261001_0006"
    },
    {
      "file": "backend/alembic/versions/20261002_0014_service_department_routing.py",
      "revision": "20261002_0014",
      "down_revision": "20261002_0013"
    },
    {
      "file": "backend/alembic/versions/20261002_0015_sales_crm.py",
      "revision": "20261002_0015",
      "down_revision": "20261002_0014"
    },
    {
      "file": "backend/alembic/versions/20261002_0016_service_task_catalog.py",
      "revision": "20261002_0016",
      "down_revision": "20261002_0015"
    },
    {
      "file": "backend/alembic/versions/20261006_0017_lead_not_entered_flags.py",
      "revision": "20261006_0017",
      "down_revision": "20261002_0016"
    }
  ],
  "checkout_heads": [
    "20261006_0017"
  ],
  "running": [
    {
      "file": "/app/alembic/versions/20260929_0001_foundation.py",
      "revision": "20260929_0001",
      "down_revision": null
    },
    {
      "file": "/app/alembic/versions/20260929_0002_tenant_session.py",
      "revision": "20260929_0002",
      "down_revision": "20260929_0001"
    },
    {
      "file": "/app/alembic/versions/20260929_0003_superadmin.py",
      "revision": "20260929_0003",
      "down_revision": "20260929_0002"
    },
    {
      "file": "/app/alembic/versions/20260929_0004_tenant_administration.py",
      "revision": "20260929_0004",
      "down_revision": "20260929_0003"
    },
    {
      "file": "/app/alembic/versions/20260929_0005_intake.py",
      "revision": "20260929_0005",
      "down_revision": "20260929_0004"
    },
    {
      "file": "/app/alembic/versions/20260929_0006_jobs_estimates.py",
      "revision": "20260929_0006",
      "down_revision": "20260929_0005"
    },
    {
      "file": "/app/alembic/versions/20260929_0007_catalogue_stock.py",
      "revision": "20260929_0007",
      "down_revision": "20260929_0006"
    },
    {
      "file": "/app/alembic/versions/20260929_0008_job_material_ledger.py",
      "revision": "20260929_0008",
      "down_revision": "20260929_0007"
    },
    {
      "file": "/app/alembic/versions/20260929_0009_purchase_order_line_delete.py",
      "revision": "20260929_0009",
      "down_revision": "20260929_0008"
    },
    {
      "file": "/app/alembic/versions/20261001_0002_execution_qc.py",
      "revision": "20261001_0002",
      "down_revision": "20260929_0008"
    },
    {
      "file": "/app/alembic/versions/20261001_0003_merge_purchase_order_execution_heads.py",
      "revision": "20261001_0003",
      "down_revision": [
        "20260929_0009",
        "20261001_0002"
      ]
    },
    {
      "file": "/app/alembic/versions/20261001_0004_finance_delivery.py",
      "revision": "20261001_0004",
      "down_revision": "20261001_0003"
    },
    {
      "file": "/app/alembic/versions/20261001_0005_followups_search.py",
      "revision": "20261001_0005",
      "down_revision": "20261001_0004"
    },
    {
      "file": "/app/alembic/versions/20261001_0006_finance_corrections_and_invoice_claims.py",
      "revision": "20261001_0006",
      "down_revision": "20261001_0005"
    },
    {
      "file": "/app/alembic/versions/20261002_0014_service_department_routing.py",
      "revision": "20261002_0014",
      "down_revision": "20261001_0006"
    },
    {
      "file": "/app/alembic/versions/20261002_0015_sales_crm.py",
      "revision": "20261002_0015",
      "down_revision": "20261002_0014"
    },
    {
      "file": "/app/alembic/versions/20261002_0016_service_task_catalog.py",
      "revision": "20261002_0016",
      "down_revision": "20261002_0015"
    },
    {
      "file": "/app/alembic/versions/20261006_0017_lead_not_entered_flags.py",
      "revision": "20261006_0017",
      "down_revision": "20261002_0016"
    },
    {
      "file": "/app/alembic/versions/20261006_0018_booking_checkin.py",
      "revision": "20261006_0018",
      "down_revision": "20261006_0017"
    },
    {
      "file": "/app/alembic/versions/20261006_0019_execution_api_contract.py",
      "revision": "20261006_0019",
      "down_revision": "20261006_0018"
    },
    {
      "file": "/app/alembic/versions/20261006_0020_material_reservation_idempotency.py",
      "revision": "20261006_0020",
      "down_revision": "20261006_0019"
    },
    {
      "file": "/app/alembic/versions/20261006_0021_finance_claim_lock_grant.py",
      "revision": "20261006_0021",
      "down_revision": "20261006_0020"
    },
    {
      "file": "/app/alembic/versions/20261006_0022_purchase_requests.py",
      "revision": "20261006_0022",
      "down_revision": "20261006_0021"
    },
    {
      "file": "/app/alembic/versions/20261006_0023_material_shortages.py",
      "revision": "20261006_0023",
      "down_revision": "20261006_0022"
    },
    {
      "file": "/app/alembic/versions/20261008_0024_purchase_delivery_confirmation.py",
      "revision": "20261008_0024",
      "down_revision": "20261006_0023"
    },
    {
      "file": "/app/alembic/versions/20261008_0025_delivery_confirmation_inward_idempotency.py",
      "revision": "20261008_0025",
      "down_revision": "20261008_0024"
    },
    {
      "file": "/app/alembic/versions/20261011_0026_job_estimated_delivery.py",
      "revision": "20261011_0026",
      "down_revision": "20261008_0025"
    },
    {
      "file": "/app/alembic/versions/20261017_0027_database_auth.py",
      "revision": "20261017_0027",
      "down_revision": "20261011_0026"
    },
    {
      "file": "/app/alembic/versions/20261017_0028_demo_import.py",
      "revision": "20261017_0028",
      "down_revision": "20261017_0027"
    },
    {
      "file": "/app/alembic/versions/20261017_0029_tenant_invitation_runtime_grant.py",
      "revision": "20261017_0029",
      "down_revision": "20261017_0028"
    },
    {
      "file": "/app/alembic/versions/20261018_0030_job_media.py",
      "revision": "20261018_0030",
      "down_revision": "20261017_0029"
    },
    {
      "file": "/app/alembic/versions/20261018_0031_job_checklists.py",
      "revision": "20261018_0031",
      "down_revision": "20261018_0030"
    },
    {
      "file": "/app/alembic/versions/20261018_0032_service_catalog.py",
      "revision": "20261018_0032",
      "down_revision": "20261018_0031"
    },
    {
      "file": "/app/alembic/versions/20261018_0033_import_archive_scope.py",
      "revision": "20261018_0033",
      "down_revision": "20261018_0032"
    }
  ],
  "running_heads": [
    "20261018_0033"
  ]
}