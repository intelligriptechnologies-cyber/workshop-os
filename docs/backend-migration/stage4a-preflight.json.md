{
  "branch": "Prem-dev-fbb-Go21",
  "head": "a315448ce8c3f8f86026b58c18a2231bb3e5e9a7",
  "status": " M AGENTS.md\n?? .scratch/capture-reference.mjs\n?? .scratch/codex-decoy.sqlite\n?? .scratch/codex-leads-source.sqlite\n?? .scratch/codex-snappy/\n?? .scratch/codex-ticket89-pg/\n?? .scratch/pre-integration-20261019-080154/\n?? .scratch/reference-a315448/\n?? .scratch/reference-capture-a315448/\n?? .scratch/rejected-stale-reference-captures/\n?? .scratch/restoration-backend-results.txt\n?? .scratch/restoration-browser-results.txt\n?? .scratch/restoration-checkpoint-paths\n?? .scratch/restoration-checkpoint.index\n?? .scratch/restoration-inventory-a315448/\n?? .scratch/restoration-reference-build/\n?? .scratch/restoration-visual-results.txt\n?? data-migration/\n?? docs/backend-migration/\n",
  "protected_checked": 115,
  "mismatches": [],
  "backend_candidate": "50c8aab1766b61c914e2829b460bfd1697723ec2",
  "modules": [
    {
      "file": "backend/app/__init__.py",
      "sha256": "8a2601bbafbb06f55d7bd86dd47d10862a8acff611639101776a7db0f760275a"
    },
    {
      "file": "backend/app/auth.py",
      "sha256": "84178336a04ade37eaa9a37b3f4db9c116d6be9ae6a9914e82e7f90b32c8171d"
    },
    {
      "file": "backend/app/checklists.py",
      "sha256": "d23cb3ec9acaa611b05de644225834d0e45d670e9ea425821a014e2718b93ec6"
    },
    {
      "file": "backend/app/config.py",
      "sha256": "524c12762879ce19628bc346800f80268d4a8682460898aba7f3c46d099e252d"
    },
    {
      "file": "backend/app/database.py",
      "sha256": "8168c0c3cc50119e8c58d46f2cd7ff9273bf45a283e1a2e47be44f623c92e1ee"
    },
    {
      "file": "backend/app/database_auth.py",
      "sha256": "ae17290e61420f738e3a4aaea73b57b9bb0d227cd6ec66486d0901a09d598354"
    },
    {
      "file": "backend/app/execution.py",
      "sha256": "1eeb30cf35ec3d0bfedd66e39be0a4e5008345860a3fc0adb6f357be93d0123c"
    },
    {
      "file": "backend/app/finance.py",
      "sha256": "7141bd92e75027fd7a20edc7b5983ec70ba04702e4ec106b3eaa8981bcb828ad"
    },
    {
      "file": "backend/app/followups.py",
      "sha256": "0894522c7b95bca88ee76b2149136a048f5f07ff9fcb76ce7de88df0478c873e"
    },
    {
      "file": "backend/app/intake.py",
      "sha256": "c7aa394d6c7411a277bf5db6a54b728328e24542d77493118baf7002628aeaa2"
    },
    {
      "file": "backend/app/inventory.py",
      "sha256": "37b93269d8bd42ef55e2ed9a08627b95c5ed6103ed7ee0ca1a0554b1be050411"
    },
    {
      "file": "backend/app/jobs.py",
      "sha256": "8fd102a43c89c5c70c3127d9b0d80939da7c6b7088896e9d6d8fbf60315eaacf"
    },
    {
      "file": "backend/app/main.py",
      "sha256": "243d014bf9901ebc943cdfa2b37ceb365d2a0c51f26159fd1cd2d3c261963199"
    },
    {
      "file": "backend/app/materials.py",
      "sha256": "cc8e65b6598a50f25f144a9e79a78217c40f8518fbfafde2c27a29fb92feb3cd"
    },
    {
      "file": "backend/app/media.py",
      "sha256": "a2cf2c3490731d3bce25ab2c6f16afab0d2bfd3a56aed0be733929c68aa30361"
    },
    {
      "file": "backend/app/procurement.py",
      "sha256": "ec6841745c2c1c0f5f143372f774b644558c6545f51d726933b7659b9f76f078"
    },
    {
      "file": "backend/app/sales_crm.py",
      "sha256": "bc5aa81383a5c5b592f26fef4f7fcc8f81119bd4a0885068f95f998fc169e9e5"
    },
    {
      "file": "backend/app/service_catalog.py",
      "sha256": "7dee3ad843389c43ed12cb850d702e49e7f66b4c991c0fe4ddf6a9559d431712"
    },
    {
      "file": "backend/app/superadmin.py",
      "sha256": "d4a5dedc5087d476c2d7ce411cb796e3f28084fefa679c319737339cc57b3596"
    },
    {
      "file": "backend/app/tenancy.py",
      "sha256": "0a45f7343712a9c9d93adf54c5f8f76b1ef9310784ab760b29bcb11ef52d084f"
    },
    {
      "file": "backend/app/tenant_admin.py",
      "sha256": "f59f10343315291138f7ec9774441dae6cd4ae878cf2c3fc359a06b284fe82f8"
    }
  ],
  "revisions": [
    {
      "file": "backend/alembic/versions/20260929_0001_foundation.py",
      "revision": "20260929_0001",
      "down_revision": null
    },
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
      "file": "backend/alembic/versions/20261002_0014_service_department_routing.py",
      "revision": "20261002_0014",
      "down_revision": "20261001_0006"
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
    },
    {
      "file": "backend/alembic/versions/20261006_0018_booking_checkin.py",
      "revision": "20261006_0018",
      "down_revision": "20261006_0017"
    },
    {
      "file": "backend/alembic/versions/20261006_0019_execution_api_contract.py",
      "revision": "20261006_0019",
      "down_revision": "20261006_0018"
    },
    {
      "file": "backend/alembic/versions/20261006_0020_material_reservation_idempotency.py",
      "revision": "20261006_0020",
      "down_revision": "20261006_0019"
    },
    {
      "file": "backend/alembic/versions/20261006_0021_finance_claim_lock_grant.py",
      "revision": "20261006_0021",
      "down_revision": "20261006_0020"
    },
    {
      "file": "backend/alembic/versions/20261006_0022_purchase_requests.py",
      "revision": "20261006_0022",
      "down_revision": "20261006_0021"
    },
    {
      "file": "backend/alembic/versions/20261006_0023_material_shortages.py",
      "revision": "20261006_0023",
      "down_revision": "20261006_0022"
    },
    {
      "file": "backend/alembic/versions/20261008_0024_purchase_delivery_confirmation.py",
      "revision": "20261008_0024",
      "down_revision": "20261006_0023"
    },
    {
      "file": "backend/alembic/versions/20261008_0025_delivery_confirmation_inward_idempotency.py",
      "revision": "20261008_0025",
      "down_revision": "20261008_0024"
    },
    {
      "file": "backend/alembic/versions/20261011_0026_job_estimated_delivery.py",
      "revision": "20261011_0026",
      "down_revision": "20261008_0025"
    },
    {
      "file": "backend/alembic/versions/20261017_0027_database_auth.py",
      "revision": "20261017_0027",
      "down_revision": "20261011_0026"
    },
    {
      "file": "backend/alembic/versions/20261017_0028_demo_import.py",
      "revision": "20261017_0028",
      "down_revision": "20261017_0027"
    },
    {
      "file": "backend/alembic/versions/20261017_0029_tenant_invitation_runtime_grant.py",
      "revision": "20261017_0029",
      "down_revision": "20261017_0028"
    },
    {
      "file": "backend/alembic/versions/20261018_0030_job_media.py",
      "revision": "20261018_0030",
      "down_revision": "20261017_0029"
    },
    {
      "file": "backend/alembic/versions/20261018_0031_job_checklists.py",
      "revision": "20261018_0031",
      "down_revision": "20261018_0030"
    },
    {
      "file": "backend/alembic/versions/20261018_0032_service_catalog.py",
      "revision": "20261018_0032",
      "down_revision": "20261018_0031"
    },
    {
      "file": "backend/alembic/versions/20261018_0033_import_archive_scope.py",
      "revision": "20261018_0033",
      "down_revision": "20261018_0032"
    }
  ],
  "heads": [
    "20261018_0033"
  ]
}