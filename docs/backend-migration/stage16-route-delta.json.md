[
  {
    "method": "DELETE",
    "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "name": "remove_service_advisor_team",
      "file": "backend/app/tenant_admin.py",
      "line": 475,
      "end": 486,
      "signature": "department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_advisor_teams",
        "service_departments"
      ]
    },
    "candidate": {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "remove_service_advisor_team",
      "line": 494
    }
  },
  {
    "method": "DELETE",
    "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "name": "remove_service_department_manager",
      "file": "backend/app/tenant_admin.py",
      "line": 435,
      "end": 447,
      "signature": "department_id: UUID, membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_advisor_teams",
        "service_department_managers",
        "service_departments"
      ]
    },
    "candidate": {
      "method": "DELETE",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "remove_service_department_manager",
      "line": 454
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/admin/demo-import/rows",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/admin/demo-import/rows",
      "file": "/app/app/tenant_admin.py",
      "name": "list_demo_import_rows",
      "line": 26
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/admin/roles",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/admin/roles",
      "name": "list_roles",
      "file": "backend/app/tenant_admin.py",
      "line": 576,
      "end": 579,
      "signature": "scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.read\")"
      ],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/admin/roles",
      "file": "/app/app/tenant_admin.py",
      "name": "list_roles",
      "line": 607
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/admin/service-departments",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/admin/service-departments",
      "name": "list_service_departments",
      "file": "backend/app/tenant_admin.py",
      "line": 366,
      "end": 369,
      "signature": "scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.read\")"
      ],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/admin/service-departments",
      "file": "/app/app/tenant_admin.py",
      "name": "list_service_departments",
      "line": 385
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/admin/users",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/admin/users",
      "name": "list_users",
      "file": "backend/app/tenant_admin.py",
      "line": 359,
      "end": 362,
      "signature": "scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.read\")"
      ],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/admin/users",
      "file": "/app/app/tenant_admin.py",
      "name": "list_users",
      "line": 378
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/attachments/{attachment_id}/content",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/attachments/{attachment_id}/content",
      "name": "read_attachment",
      "file": "backend/app/execution.py",
      "line": 115,
      "end": 123,
      "signature": "attachment_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/attachments/{attachment_id}/content",
      "file": "/app/app/execution.py",
      "name": "read_attachment",
      "line": 166
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/auth/config",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/auth/config",
      "name": "auth_config",
      "file": "backend/app/main.py",
      "line": 88,
      "end": 114,
      "signature": "",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/auth/config",
      "file": "/app/app/main.py",
      "name": "auth_config",
      "line": 103
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/auth/tenants/{code}/users",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/auth/tenants/{code}/users",
      "file": "/app/app/database_auth.py",
      "name": "list_login_users",
      "line": 93
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/auth/workshops",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/auth/workshops",
      "file": "/app/app/database_auth.py",
      "name": "list_login_workshops",
      "line": 78
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/bookings",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/bookings",
      "file": "/app/app/intake.py",
      "name": "list_bookings",
      "line": 225
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/bookings/{booking_id}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/bookings/{booking_id}",
      "file": "/app/app/intake.py",
      "name": "get_booking",
      "line": 264
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/branches/{branch_id}/settings",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/branches/{branch_id}/settings",
      "name": "read_branch_settings",
      "file": "backend/app/main.py",
      "line": 158,
      "end": 170,
      "signature": "branch_id: UUID, scope: ScopedTenant",
      "guards": [
        "require_permission(scope, \"branch.settings.read\")"
      ],
      "lock": false,
      "tables": [
        "branch_settings"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/branches/{branch_id}/settings",
      "file": "/app/app/main.py",
      "name": "read_branch_settings",
      "line": 198
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/catalogue-items",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/catalogue-items",
      "name": "list_catalogue",
      "file": "backend/app/inventory.py",
      "line": 177,
      "end": 184,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items",
        "stock_ledger"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/catalogue-items",
      "file": "/app/app/inventory.py",
      "name": "list_catalogue",
      "line": 231
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/checklists",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/checklists",
      "file": "/app/app/checklists.py",
      "name": "list_checklists",
      "line": 70
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/customers",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/customers",
      "name": "list_customers",
      "file": "backend/app/intake.py",
      "line": 169,
      "end": 181,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/customers",
      "file": "/app/app/intake.py",
      "name": "list_customers",
      "line": 335
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/customers/{customer_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/customers/{customer_id}",
      "name": "get_customer",
      "file": "backend/app/intake.py",
      "line": 197,
      "end": 199,
      "signature": "customer_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/customers/{customer_id}",
      "file": "/app/app/intake.py",
      "name": "get_customer",
      "line": 363
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/financial-documents/{document_id}/content",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/financial-documents/{document_id}/content",
      "name": "get_document_content",
      "file": "backend/app/finance.py",
      "line": 534,
      "end": 544,
      "signature": "document_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "financial_documents"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/financial-documents/{document_id}/content",
      "file": "/app/app/finance.py",
      "name": "get_document_content",
      "line": 534
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/follow-ups",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/follow-ups",
      "name": "list_followups",
      "file": "backend/app/followups.py",
      "line": 90,
      "end": 112,
      "signature": "scope: ScopedTenant, job_id: int | None=Query(default=None, alias='jobId', gt=0), branch_id: UUID | None=Query(default=None, alias='branchId'), archived: bool=False",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "followups",
        "job_cards",
        "vehicles",
        "visits"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/follow-ups",
      "file": "/app/app/followups.py",
      "name": "list_followups",
      "line": 90
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/follow-ups/jobs",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/follow-ups/jobs",
      "name": "followup_jobs",
      "file": "backend/app/followups.py",
      "line": 116,
      "end": 129,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "job_cards",
        "vehicles",
        "visits"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/follow-ups/jobs",
      "file": "/app/app/followups.py",
      "name": "followup_jobs",
      "line": 122
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/health",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/health",
      "name": "api_health",
      "file": "backend/app/main.py",
      "line": 82,
      "end": 84,
      "signature": "session: Session=Depends(get_session)",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/health",
      "file": "/app/app/main.py",
      "name": "api_health",
      "line": 97
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/invoices/{invoice_id}/payments",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "name": "list_payments",
      "file": "backend/app/finance.py",
      "line": 476,
      "end": 480,
      "signature": "invoice_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "payments"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "file": "/app/app/finance.py",
      "name": "list_payments",
      "line": 476
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/jobs",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/jobs",
      "name": "list_jobs",
      "file": "backend/app/jobs.py",
      "line": 214,
      "end": 225,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/jobs",
      "file": "/app/app/jobs.py",
      "name": "list_jobs",
      "line": 226
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/jobs/{job_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}",
      "name": "get_job",
      "file": "backend/app/jobs.py",
      "line": 229,
      "end": 234,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}",
      "file": "/app/app/jobs.py",
      "name": "get_job",
      "line": 241
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/jobs/{job_id}/delivery",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/delivery",
      "name": "get_delivery",
      "file": "backend/app/finance.py",
      "line": 525,
      "end": 530,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "delivery_acknowledgements"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/delivery",
      "file": "/app/app/finance.py",
      "name": "get_delivery",
      "line": 525
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/jobs/{job_id}/execution",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/execution",
      "file": "/app/app/execution.py",
      "name": "get_remote_execution",
      "line": 300
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/jobs/{job_id}/invoices",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "name": "list_job_invoices",
      "file": "backend/app/finance.py",
      "line": 270,
      "end": 275,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "invoices"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "file": "/app/app/finance.py",
      "name": "list_job_invoices",
      "line": 270
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/jobs/{job_id}/material-reservations",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/material-reservations",
      "name": "list_job_reservations",
      "file": "backend/app/materials.py",
      "line": 166,
      "end": 167,
      "signature": "job_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/jobs/{job_id}/material-reservations",
      "file": "/app/app/materials.py",
      "name": "list_job_reservations",
      "line": 177
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/material-ledger",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/material-ledger",
      "name": "list_material_ledger",
      "file": "backend/app/materials.py",
      "line": 171,
      "end": 179,
      "signature": "scope: ScopedTenant, reservation_id: int | None=Query(default=None, alias='reservationId'), job_id: int | None=Query(default=None, alias='jobId'), branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "material_ledger"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/material-ledger",
      "file": "/app/app/materials.py",
      "name": "list_material_ledger",
      "line": 182
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/material-reservations",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/material-reservations",
      "name": "list_reservations",
      "file": "backend/app/materials.py",
      "line": 154,
      "end": 162,
      "signature": "scope: ScopedTenant, job_id: int | None=Query(default=None, alias='jobId'), branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "material_reservations"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/material-reservations",
      "file": "/app/app/materials.py",
      "name": "list_reservations",
      "line": 161
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/media",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/media",
      "file": "/app/app/media.py",
      "name": "list_media",
      "line": 64
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/payments/{payment_id}/supporting-attachment",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/payments/{payment_id}/supporting-attachment",
      "name": "get_supporting_attachment",
      "file": "backend/app/finance.py",
      "line": 548,
      "end": 557,
      "signature": "payment_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "payments"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/payments/{payment_id}/supporting-attachment",
      "file": "/app/app/finance.py",
      "name": "get_supporting_attachment",
      "line": 548
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/purchase-orders",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/purchase-orders",
      "name": "list_purchase_orders",
      "file": "backend/app/inventory.py",
      "line": 247,
      "end": 251,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/purchase-orders",
      "file": "/app/app/inventory.py",
      "name": "list_purchase_orders",
      "line": 308
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/purchase-requests",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/purchase-requests",
      "file": "/app/app/procurement.py",
      "name": "list_requests",
      "line": 78
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/purchase-requests/{request_id}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/purchase-requests/{request_id}",
      "file": "/app/app/procurement.py",
      "name": "get_request",
      "line": 84
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/purchase-requests/{request_id}/supplier-comparison",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/purchase-requests/{request_id}/supplier-comparison",
      "file": "/app/app/procurement.py",
      "name": "comparison",
      "line": 113
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/sales/leads",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/sales/leads",
      "name": "list_leads",
      "file": "backend/app/sales_crm.py",
      "line": 83,
      "end": 86,
      "signature": "scope: ScopedTenant, q: str='', stage: LeadStage | None=None, temperature: Temperature | None=None, exact_date: date | None=Query(None, alias='exactDate'), month: str | None=None, branch_id: UUID | None=Query(None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/sales/leads",
      "file": "/app/app/sales_crm.py",
      "name": "list_leads",
      "line": 93
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/sales/quotations",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/sales/quotations",
      "name": "list_quotations",
      "file": "backend/app/sales_crm.py",
      "line": 99,
      "end": 101,
      "signature": "scope: ScopedTenant, q: str='', quotation_status: QuotationStatus | None=Query(None, alias='status'), exact_date: date | None=Query(None, alias='exactDate'), month: str | None=None, branch_id: UUID | None=Query(None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "quotations",
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/sales/quotations",
      "file": "/app/app/sales_crm.py",
      "name": "list_quotations",
      "line": 109
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/sales/quotations/{quotation_id}/document",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/sales/quotations/{quotation_id}/document",
      "name": "quotation_document",
      "file": "backend/app/sales_crm.py",
      "line": 148,
      "end": 152,
      "signature": "quotation_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotations"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/sales/quotations/{quotation_id}/document",
      "file": "/app/app/sales_crm.py",
      "name": "quotation_document",
      "line": 165
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/sales/service-tasks",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/sales/service-tasks",
      "name": "list_service_tasks",
      "file": "backend/app/sales_crm.py",
      "line": 104,
      "end": 114,
      "signature": "scope: ScopedTenant, q: str='', branch_id: UUID | None=Query(None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "service_task_catalog"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/sales/service-tasks",
      "file": "/app/app/sales_crm.py",
      "name": "list_service_tasks",
      "line": 114
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/search",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/search",
      "name": "search",
      "file": "backend/app/followups.py",
      "line": 199,
      "end": 237,
      "signature": "scope: ScopedTenant, q: Annotated[str, Query(min_length=2, max_length=200)], branch_id: UUID | None=Query(default=None, alias='branchId'), limit: Annotated[int, Query(ge=1, le=100)]=30, entities: list[SearchEntity] | None=Query(default=None)",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "financial_document_events",
        "financial_documents",
        "invoices",
        "job_cards",
        "vehicles",
        "visits"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/search",
      "file": "/app/app/followups.py",
      "name": "search",
      "line": 205
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/service-catalog",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/service-catalog",
      "file": "/app/app/service_catalog.py",
      "name": "list_catalogue",
      "line": 61
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/service-catalog/job-tasks",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/service-catalog/job-tasks",
      "file": "/app/app/service_catalog.py",
      "name": "list_job_tasks",
      "line": 119
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/session",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/session",
      "name": "session",
      "file": "backend/app/main.py",
      "line": 118,
      "end": 121,
      "signature": "scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/session",
      "file": "/app/app/main.py",
      "name": "session",
      "line": 135
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/stock-inwards",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/stock-inwards",
      "name": "list_stock_inwards",
      "file": "backend/app/inventory.py",
      "line": 282,
      "end": 286,
      "signature": "scope: ScopedTenant, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_inwards"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/stock-inwards",
      "file": "/app/app/inventory.py",
      "name": "list_stock_inwards",
      "line": 424
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/stock-ledger",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/stock-ledger",
      "name": "list_stock_ledger",
      "file": "backend/app/inventory.py",
      "line": 318,
      "end": 322,
      "signature": "scope: ScopedTenant, item_id: int | None=Query(default=None, alias='itemId'), branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_ledger"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/stock-ledger",
      "file": "/app/app/inventory.py",
      "name": "list_stock_ledger",
      "line": 462
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/superadmin/tenants",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants",
      "name": "list_tenants",
      "file": "backend/app/superadmin.py",
      "line": 237,
      "end": 251,
      "signature": "scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "branches",
        "platform_billing",
        "tenants"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants",
      "file": "/app/app/superadmin.py",
      "name": "list_tenants",
      "line": 237
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/superadmin/tenants/{tenant_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}",
      "name": "get_tenant",
      "file": "backend/app/superadmin.py",
      "line": 285,
      "end": 287,
      "signature": "tenant_id: UUID, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}",
      "file": "/app/app/superadmin.py",
      "name": "get_tenant",
      "line": 285
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/superadmin/tenants/{tenant_id}/audit-events",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/audit-events",
      "name": "list_audit_events",
      "file": "backend/app/superadmin.py",
      "line": 343,
      "end": 347,
      "signature": "tenant_id: UUID, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "tenant_audit_events"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/audit-events",
      "file": "/app/app/superadmin.py",
      "name": "list_audit_events",
      "line": 343
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/suppliers",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/suppliers",
      "name": "list_suppliers",
      "file": "backend/app/inventory.py",
      "line": 214,
      "end": 218,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "suppliers"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/suppliers",
      "file": "/app/app/inventory.py",
      "name": "list_suppliers",
      "line": 275
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/technician-tasks",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/technician-tasks",
      "name": "list_my_tasks",
      "file": "backend/app/execution.py",
      "line": 60,
      "end": 63,
      "signature": "scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "technician_tasks"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/technician-tasks",
      "file": "/app/app/execution.py",
      "name": "list_my_tasks",
      "line": 111
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/technician-tasks/mine",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/technician-tasks/mine",
      "file": "/app/app/execution.py",
      "name": "list_remote_tasks",
      "line": 216
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/tenant/settings",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/tenant/settings",
      "name": "read_tenant_settings",
      "file": "backend/app/main.py",
      "line": 125,
      "end": 133,
      "signature": "scope: ScopedTenant",
      "guards": [
        "require_permission(scope, \"tenant.settings.read\")"
      ],
      "lock": false,
      "tables": [
        "tenant_settings"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/tenant/settings",
      "file": "/app/app/main.py",
      "name": "read_tenant_settings",
      "line": 142
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/tenant/theme",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "GET",
      "path": "/api/v1/tenant/theme",
      "file": "/app/app/main.py",
      "name": "read_tenant_theme",
      "line": 154
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/vehicles",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/vehicles",
      "name": "list_vehicles",
      "file": "backend/app/intake.py",
      "line": 225,
      "end": 229,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/vehicles",
      "file": "/app/app/intake.py",
      "name": "list_vehicles",
      "line": 391
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/vehicles/{vehicle_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "name": "get_vehicle",
      "file": "backend/app/intake.py",
      "line": 242,
      "end": 244,
      "signature": "vehicle_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "file": "/app/app/intake.py",
      "name": "get_vehicle",
      "line": 408
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/visits",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/visits",
      "name": "list_visits",
      "file": "backend/app/intake.py",
      "line": 268,
      "end": 272,
      "signature": "scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID | None=Query(default=None, alias='branchId')",
      "guards": [],
      "lock": false,
      "tables": [
        "customers",
        "vehicles",
        "visits"
      ]
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/visits",
      "file": "/app/app/intake.py",
      "name": "list_visits",
      "line": 434
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/visits/{visit_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/api/v1/visits/{visit_id}",
      "name": "get_visit",
      "file": "backend/app/intake.py",
      "line": 285,
      "end": 287,
      "signature": "visit_id: int, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/api/v1/visits/{visit_id}",
      "file": "/app/app/intake.py",
      "name": "get_visit",
      "line": 451
    }
  },
  {
    "method": "GET",
    "path": "/health",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "GET",
      "path": "/health",
      "name": "health",
      "file": "backend/app/main.py",
      "line": 69,
      "end": 78,
      "signature": "session: Session=Depends(get_session)",
      "guards": [],
      "lock": false,
      "tables": []
    },
    "candidate": {
      "method": "GET",
      "path": "/health",
      "file": "/app/app/main.py",
      "name": "health",
      "line": 84
    }
  },
  {
    "method": "PATCH",
    "path": "/api/v1/admin/roles/{role_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PATCH",
      "path": "/api/v1/admin/roles/{role_id}",
      "name": "update_role",
      "file": "backend/app/tenant_admin.py",
      "line": 602,
      "end": 634,
      "signature": "role_id: UUID, input: RoleUpdate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "role_permissions",
        "tenant_roles"
      ]
    },
    "candidate": {
      "method": "PATCH",
      "path": "/api/v1/admin/roles/{role_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "update_role",
      "line": 633
    }
  },
  {
    "method": "PATCH",
    "path": "/api/v1/admin/service-departments/{department_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PATCH",
      "path": "/api/v1/admin/service-departments/{department_id}",
      "name": "update_service_department",
      "file": "backend/app/tenant_admin.py",
      "line": 393,
      "end": 414,
      "signature": "department_id: UUID, input: ServiceDepartmentUpdate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_departments"
      ]
    },
    "candidate": {
      "method": "PATCH",
      "path": "/api/v1/admin/service-departments/{department_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "update_service_department",
      "line": 412
    }
  },
  {
    "method": "PATCH",
    "path": "/api/v1/admin/users/{membership_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PATCH",
      "path": "/api/v1/admin/users/{membership_id}",
      "name": "update_user",
      "file": "backend/app/tenant_admin.py",
      "line": 514,
      "end": 536,
      "signature": "membership_id: UUID, input: UserUpdate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "platform_users",
        "tenant_memberships"
      ]
    },
    "candidate": {
      "method": "PATCH",
      "path": "/api/v1/admin/users/{membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "update_user",
      "line": 545
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/admin/roles",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/admin/roles",
      "name": "create_role",
      "file": "backend/app/tenant_admin.py",
      "line": 583,
      "end": 598,
      "signature": "input: RoleCreate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "role_permissions",
        "tenant_roles"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/admin/roles",
      "file": "/app/app/tenant_admin.py",
      "name": "create_role",
      "line": 614
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/admin/roles/{role_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/admin/roles/{role_id}/archive",
      "name": "archive_role",
      "file": "backend/app/tenant_admin.py",
      "line": 638,
      "end": 655,
      "signature": "role_id: UUID, input: ArchiveUser, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "membership_roles",
        "tenant_roles"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/admin/roles/{role_id}/archive",
      "file": "/app/app/tenant_admin.py",
      "name": "archive_role",
      "line": 669
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/admin/service-departments",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/admin/service-departments",
      "name": "create_service_department",
      "file": "backend/app/tenant_admin.py",
      "line": 373,
      "end": 389,
      "signature": "input: ServiceDepartmentCreate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "branches",
        "service_departments"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/admin/service-departments",
      "file": "/app/app/tenant_admin.py",
      "name": "create_service_department",
      "line": 392
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/admin/users",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/admin/users",
      "name": "create_user",
      "file": "backend/app/tenant_admin.py",
      "line": 490,
      "end": 510,
      "signature": "input: UserCreate, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "platform_users",
        "tenant_admin_invitations",
        "tenant_memberships"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/admin/users",
      "file": "/app/app/tenant_admin.py",
      "name": "create_user",
      "line": 509
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/admin/users/{membership_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/archive",
      "name": "archive_user",
      "file": "backend/app/tenant_admin.py",
      "line": 540,
      "end": 556,
      "signature": "membership_id: UUID, input: ArchiveUser, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "platform_users",
        "tenant_memberships"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/archive",
      "file": "/app/app/tenant_admin.py",
      "name": "archive_user",
      "line": 571
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/admin/users/{membership_id}/resend-invite",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/resend-invite",
      "name": "resend_invite",
      "file": "backend/app/tenant_admin.py",
      "line": 560,
      "end": 572,
      "signature": "membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "tenant_admin_invitations"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/admin/users/{membership_id}/resend-invite",
      "file": "/app/app/tenant_admin.py",
      "name": "resend_invite",
      "line": 591
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/auth/login",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/auth/login",
      "file": "/app/app/database_auth.py",
      "name": "login",
      "line": 108
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/auth/logout",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/auth/logout",
      "file": "/app/app/database_auth.py",
      "name": "logout",
      "line": 172
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/bookings",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/bookings",
      "file": "/app/app/intake.py",
      "name": "create_booking",
      "line": 243
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/bookings/{booking_id}/check-in",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/bookings/{booking_id}/check-in",
      "file": "/app/app/intake.py",
      "name": "check_in_booking",
      "line": 274
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/catalogue-items",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/catalogue-items",
      "name": "create_catalogue",
      "file": "backend/app/inventory.py",
      "line": 188,
      "end": 192,
      "signature": "input: CatalogueItemInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/catalogue-items",
      "file": "/app/app/inventory.py",
      "name": "create_catalogue",
      "line": 249
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/catalogue-items/{item_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/catalogue-items/{item_id}/archive",
      "name": "archive_catalogue",
      "file": "backend/app/inventory.py",
      "line": 204,
      "end": 210,
      "signature": "item_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items",
        "purchase_order_lines"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/catalogue-items/{item_id}/archive",
      "file": "/app/app/inventory.py",
      "name": "archive_catalogue",
      "line": 265
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/checklists",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/checklists",
      "file": "/app/app/checklists.py",
      "name": "create_cycle",
      "line": 76
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/credit-notes/{credit_note_id}/refunds",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/credit-notes/{credit_note_id}/refunds",
      "name": "record_refund",
      "file": "backend/app/finance.py",
      "line": 412,
      "end": 429,
      "signature": "credit_note_id: int, input: RefundRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "credit_notes",
        "refunds"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/credit-notes/{credit_note_id}/refunds",
      "file": "/app/app/finance.py",
      "name": "record_refund",
      "line": 412
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/customers",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/customers",
      "name": "create_customer",
      "file": "backend/app/intake.py",
      "line": 185,
      "end": 193,
      "signature": "input: CustomerInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/customers",
      "file": "/app/app/intake.py",
      "name": "create_customer",
      "line": 351
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/customers/{customer_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/customers/{customer_id}/archive",
      "name": "archive_customer",
      "file": "backend/app/intake.py",
      "line": 214,
      "end": 221,
      "signature": "customer_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/customers/{customer_id}/archive",
      "file": "/app/app/intake.py",
      "name": "archive_customer",
      "line": 380
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/estimates/{estimate_id}/decision",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/estimates/{estimate_id}/decision",
      "name": "record_estimate_decision",
      "file": "backend/app/jobs.py",
      "line": 353,
      "end": 377,
      "signature": "estimate_id: int, input: EstimateDecision, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "estimate_decisions",
        "estimates"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/estimates/{estimate_id}/decision",
      "file": "/app/app/jobs.py",
      "name": "record_estimate_decision",
      "line": 390
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/follow-ups",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/follow-ups",
      "name": "create_followup",
      "file": "backend/app/followups.py",
      "line": 133,
      "end": 146,
      "signature": "input: FollowupCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/follow-ups",
      "file": "/app/app/followups.py",
      "name": "create_followup",
      "line": 139
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/follow-ups/{followup_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/archive",
      "name": "archive_followup",
      "file": "backend/app/followups.py",
      "line": 183,
      "end": 195,
      "signature": "followup_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/archive",
      "file": "/app/app/followups.py",
      "name": "archive_followup",
      "line": 189
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/follow-ups/{followup_id}/commands/complete",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/commands/complete",
      "name": "complete_followup",
      "file": "backend/app/followups.py",
      "line": 167,
      "end": 179,
      "signature": "followup_id: int, input: FollowupComplete, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/follow-ups/{followup_id}/commands/complete",
      "file": "/app/app/followups.py",
      "name": "complete_followup",
      "line": 173
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/invoices/{invoice_id}/credit-notes",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/credit-notes",
      "name": "issue_credit_note",
      "file": "backend/app/finance.py",
      "line": 380,
      "end": 408,
      "signature": "invoice_id: int, input: CreditNoteIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "active_invoice_claims",
        "credit_notes",
        "financial_document_events",
        "invoices",
        "payments"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/credit-notes",
      "file": "/app/app/finance.py",
      "name": "issue_credit_note",
      "line": 380
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/invoices/{invoice_id}/payments",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "name": "record_payment",
      "file": "backend/app/finance.py",
      "line": 433,
      "end": 461,
      "signature": "invoice_id: int, input: PaymentRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "invoices",
        "payments"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/payments",
      "file": "/app/app/finance.py",
      "name": "record_payment",
      "line": 433
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/invoices/{invoice_id}/void",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/void",
      "name": "void_invoice",
      "file": "backend/app/finance.py",
      "line": 348,
      "end": 364,
      "signature": "invoice_id: int, input: VoidInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "active_invoice_claims",
        "financial_document_events",
        "invoices",
        "payments"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/invoices/{invoice_id}/void",
      "file": "/app/app/finance.py",
      "name": "void_invoice",
      "line": 348
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/jobs",
      "name": "create_job",
      "file": "backend/app/jobs.py",
      "line": 238,
      "end": 259,
      "signature": "input: JobCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs",
      "file": "/app/app/jobs.py",
      "name": "create_job",
      "line": 275
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/attachments",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/attachments",
      "file": "/app/app/execution.py",
      "name": "create_remote_attachment",
      "line": 283
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/commands/{command}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/commands/{command}",
      "name": "command_job",
      "file": "backend/app/jobs.py",
      "line": 445,
      "end": 479,
      "signature": "job_id: int, command: Literal['start-work', 'hold-job', 'resume-work', 'cancel-job', 'start-rework', 'complete-work'], input: JobCommand, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": false,
      "tables": [
        "estimates",
        "job_cards",
        "job_events"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/commands/{command}",
      "file": "/app/app/jobs.py",
      "name": "command_job",
      "line": 482
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/complete-handover",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/complete-handover",
      "name": "complete_handover",
      "file": "backend/app/finance.py",
      "line": 484,
      "end": 514,
      "signature": "job_id: int, input: HandoverInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": false,
      "tables": [
        "delivery_acknowledgements",
        "job_cards",
        "job_events",
        "payments"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/complete-handover",
      "file": "/app/app/finance.py",
      "name": "complete_handover",
      "line": 484
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/estimates",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/estimates",
      "name": "create_estimate",
      "file": "backend/app/jobs.py",
      "line": 323,
      "end": 349,
      "signature": "job_id: int, input: EstimateCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "estimate_lines",
        "estimates"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/estimates",
      "file": "/app/app/jobs.py",
      "name": "create_estimate",
      "line": 360
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/invoices",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "name": "issue_invoice",
      "file": "backend/app/finance.py",
      "line": 279,
      "end": 344,
      "signature": "job_id: int, input: InvoiceIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias='Idempotency-Key')]=None",
      "guards": [],
      "lock": true,
      "tables": [
        "active_invoice_claims",
        "credit_notes",
        "financial_document_events",
        "invoice_lines",
        "invoices",
        "job_cards"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/invoices",
      "file": "/app/app/finance.py",
      "name": "issue_invoice",
      "line": 279
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/qc-checks",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/qc-checks",
      "file": "/app/app/execution.py",
      "name": "create_remote_qc_check",
      "line": 312
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/technician-tasks",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/technician-tasks",
      "file": "/app/app/execution.py",
      "name": "assign_remote_task",
      "line": 224
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/jobs/{job_id}/work-updates",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/jobs/{job_id}/work-updates",
      "file": "/app/app/execution.py",
      "name": "create_remote_work_update",
      "line": 267
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/material-reservations",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/material-reservations",
      "name": "create_reservation",
      "file": "backend/app/materials.py",
      "line": 183,
      "end": 204,
      "signature": "input: MaterialReservationInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "material_ledger",
        "material_reservations"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/material-reservations",
      "file": "/app/app/materials.py",
      "name": "create_reservation",
      "line": 197
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/material-reservations/{reservation_id}/commands/{command}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/material-reservations/{reservation_id}/commands/{command}",
      "name": "material_command",
      "file": "backend/app/materials.py",
      "line": 208,
      "end": 236,
      "signature": "reservation_id: int, command: MaterialCommandName, input: MaterialCommand, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "material_ledger"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/material-reservations/{reservation_id}/commands/{command}",
      "file": "/app/app/materials.py",
      "name": "material_command",
      "line": 242
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/material-shortages",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/material-shortages",
      "file": "/app/app/materials.py",
      "name": "create_material_shortage",
      "line": 226
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/media",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/media",
      "file": "/app/app/media.py",
      "name": "create_media",
      "line": 75
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/media/{media_id}/archive",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/media/{media_id}/archive",
      "file": "/app/app/media.py",
      "name": "archive_media",
      "line": 105
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-orders",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/purchase-orders",
      "name": "create_purchase_order",
      "file": "backend/app/inventory.py",
      "line": 255,
      "end": 259,
      "signature": "input: PurchaseOrderInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-orders",
      "file": "/app/app/inventory.py",
      "name": "create_purchase_order",
      "line": 316
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-orders/{purchase_id}/commands/{command}",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/commands/{command}",
      "name": "purchase_order_command",
      "file": "backend/app/inventory.py",
      "line": 272,
      "end": 278,
      "signature": "purchase_id: int, command: Literal['send', 'cancel', 'close'], input: PurchaseOrderCommand, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/commands/{command}",
      "file": "/app/app/inventory.py",
      "name": "purchase_order_command",
      "line": 333
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-orders/{purchase_id}/delivery-confirmations",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/delivery-confirmations",
      "file": "/app/app/inventory.py",
      "name": "confirm_delivery",
      "line": 394
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-orders/{purchase_id}/delivery-receipts",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-orders/{purchase_id}/delivery-receipts",
      "file": "/app/app/inventory.py",
      "name": "record_delivery_receipt",
      "line": 362
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-requests",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-requests",
      "file": "/app/app/procurement.py",
      "name": "create_request",
      "line": 87
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-requests/{request_id}/approve",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-requests/{request_id}/approve",
      "file": "/app/app/procurement.py",
      "name": "approve",
      "line": 121
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-requests/{request_id}/commands/{command}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-requests/{request_id}/commands/{command}",
      "file": "/app/app/procurement.py",
      "name": "command",
      "line": 148
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/purchase-requests/{request_id}/supplier-quotes",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/purchase-requests/{request_id}/supplier-quotes",
      "file": "/app/app/procurement.py",
      "name": "add_quote",
      "line": 104
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/qc-checks",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/qc-checks",
      "name": "create_qc_check",
      "file": "backend/app/execution.py",
      "line": 127,
      "end": 133,
      "signature": "input: QcCheckCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "qc_checks"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/qc-checks",
      "file": "/app/app/execution.py",
      "name": "create_qc_check",
      "line": 178
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/qc-checks/{check_id}/legacy-result",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/qc-checks/{check_id}/legacy-result",
      "file": "/app/app/execution.py",
      "name": "record_qc_result",
      "line": 188
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/qc-checks/{check_id}/result",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/qc-checks/{check_id}/result",
      "name": "record_qc_result",
      "file": "backend/app/execution.py",
      "line": 137,
      "end": 149,
      "signature": "check_id: int, input: QcResult, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "qc_checks",
        "qc_results",
        "technician_tasks"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/qc-checks/{check_id}/result",
      "file": "/app/app/execution.py",
      "name": "record_remote_qc_result",
      "line": 325
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/sales/leads",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/sales/leads",
      "name": "create_lead",
      "file": "backend/app/sales_crm.py",
      "line": 88,
      "end": 91,
      "signature": "input: LeadInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/sales/leads",
      "file": "/app/app/sales_crm.py",
      "name": "create_lead",
      "line": 98
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/sales/quotations",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/sales/quotations",
      "name": "create_quotation",
      "file": "backend/app/sales_crm.py",
      "line": 116,
      "end": 124,
      "signature": "input: QuotationInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotation_lines",
        "quotations",
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/sales/quotations",
      "file": "/app/app/sales_crm.py",
      "name": "create_quotation",
      "line": 126
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/sales/quotations/{quotation_id}/status",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/sales/quotations/{quotation_id}/status",
      "name": "change_status",
      "file": "backend/app/sales_crm.py",
      "line": 140,
      "end": 146,
      "signature": "quotation_id: int, input: StatusInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotations",
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/sales/quotations/{quotation_id}/status",
      "file": "/app/app/sales_crm.py",
      "name": "change_status",
      "line": 150
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/service-catalog",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/service-catalog",
      "file": "/app/app/service_catalog.py",
      "name": "create_catalogue",
      "line": 68
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/service-catalog/job-tasks",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/service-catalog/job-tasks",
      "file": "/app/app/service_catalog.py",
      "name": "create_job_task",
      "line": 127
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/stock-adjustments",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/stock-adjustments",
      "name": "adjust_stock",
      "file": "backend/app/inventory.py",
      "line": 309,
      "end": 314,
      "signature": "input: StockAdjustmentInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_ledger"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/stock-adjustments",
      "file": "/app/app/inventory.py",
      "name": "adjust_stock",
      "line": 453
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/stock-inwards",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/stock-inwards",
      "name": "record_stock_inward",
      "file": "backend/app/inventory.py",
      "line": 290,
      "end": 305,
      "signature": "input: StockInwardInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "stock_inwards",
        "stock_ledger"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/stock-inwards",
      "file": "/app/app/inventory.py",
      "name": "record_stock_inward",
      "line": 432
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/superadmin/emulations/{emulation_id}/end",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/superadmin/emulations/{emulation_id}/end",
      "name": "end_emulation",
      "file": "backend/app/superadmin.py",
      "line": 330,
      "end": 339,
      "signature": "emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "support_emulations"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/superadmin/emulations/{emulation_id}/end",
      "file": "/app/app/superadmin.py",
      "name": "end_emulation",
      "line": 330
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/superadmin/tenants",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants",
      "name": "provision_tenant",
      "file": "backend/app/superadmin.py",
      "line": 255,
      "end": 281,
      "signature": "input: ProvisionTenant, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "branches",
        "membership_branches",
        "membership_roles",
        "platform_billing",
        "platform_users",
        "role_permissions",
        "tenant_admin_invitations",
        "tenant_memberships",
        "tenant_roles",
        "tenants"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants",
      "file": "/app/app/superadmin.py",
      "name": "provision_tenant",
      "line": 255
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/superadmin/tenants/{tenant_id}/emulations",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/emulations",
      "name": "start_emulation",
      "file": "backend/app/superadmin.py",
      "line": 314,
      "end": 326,
      "signature": "tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "support_emulations"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/emulations",
      "file": "/app/app/superadmin.py",
      "name": "start_emulation",
      "line": 314
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/superadmin/tenants/{tenant_id}/lifecycle",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/lifecycle",
      "name": "update_lifecycle",
      "file": "backend/app/superadmin.py",
      "line": 301,
      "end": 310,
      "signature": "tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "tenants"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/lifecycle",
      "file": "/app/app/superadmin.py",
      "name": "update_lifecycle",
      "line": 301
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/suppliers",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/suppliers",
      "name": "create_supplier",
      "file": "backend/app/inventory.py",
      "line": 222,
      "end": 225,
      "signature": "input: SupplierInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "suppliers"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/suppliers",
      "file": "/app/app/inventory.py",
      "name": "create_supplier",
      "line": 283
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/suppliers/{supplier_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/suppliers/{supplier_id}/archive",
      "name": "archive_supplier",
      "file": "backend/app/inventory.py",
      "line": 237,
      "end": 243,
      "signature": "supplier_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders",
        "suppliers"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/suppliers/{supplier_id}/archive",
      "file": "/app/app/inventory.py",
      "name": "archive_supplier",
      "line": 298
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/technician-tasks",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/technician-tasks",
      "name": "assign_task",
      "file": "backend/app/execution.py",
      "line": 67,
      "end": 83,
      "signature": "input: TaskCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "membership_branches",
        "membership_roles",
        "role_permissions",
        "technician_tasks",
        "tenant_memberships"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/technician-tasks",
      "file": "/app/app/execution.py",
      "name": "assign_task",
      "line": 118
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/technician-tasks/{task_id}/commands/{command}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "POST",
      "path": "/api/v1/technician-tasks/{task_id}/commands/{command}",
      "file": "/app/app/execution.py",
      "name": "command_remote_task",
      "line": 248
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/technician-tasks/{task_id}/update",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/technician-tasks/{task_id}/update",
      "name": "update_task",
      "file": "backend/app/execution.py",
      "line": 87,
      "end": 96,
      "signature": "task_id: int, input: TaskUpdate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "technician_tasks",
        "work_updates"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/technician-tasks/{task_id}/update",
      "file": "/app/app/execution.py",
      "name": "update_task",
      "line": 138
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/vehicles",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/vehicles",
      "name": "create_vehicle",
      "file": "backend/app/intake.py",
      "line": 233,
      "end": 238,
      "signature": "input: VehicleInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/vehicles",
      "file": "/app/app/intake.py",
      "name": "create_vehicle",
      "line": 399
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/vehicles/{vehicle_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/vehicles/{vehicle_id}/archive",
      "name": "archive_vehicle",
      "file": "backend/app/intake.py",
      "line": 259,
      "end": 264,
      "signature": "vehicle_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/vehicles/{vehicle_id}/archive",
      "file": "/app/app/intake.py",
      "name": "archive_vehicle",
      "line": 425
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/visits",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/visits",
      "name": "create_visit",
      "file": "backend/app/intake.py",
      "line": 276,
      "end": 281,
      "signature": "input: VisitCreate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "visits"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/visits",
      "file": "/app/app/intake.py",
      "name": "create_visit",
      "line": 442
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/visits/{visit_id}/archive",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/visits/{visit_id}/archive",
      "name": "archive_visit",
      "file": "backend/app/intake.py",
      "line": 300,
      "end": 305,
      "signature": "visit_id: int, input: ArchiveInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "visits"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/visits/{visit_id}/archive",
      "file": "/app/app/intake.py",
      "name": "archive_visit",
      "line": 466
    }
  },
  {
    "method": "POST",
    "path": "/api/v1/work-updates/{update_id}/attachments",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "POST",
      "path": "/api/v1/work-updates/{update_id}/attachments",
      "name": "upload_attachment",
      "file": "backend/app/execution.py",
      "line": 100,
      "end": 111,
      "signature": "update_id: int, scope: ScopedTenant, file: UploadFile=File(...), label: Annotated[str, Form(max_length=1000)]=''",
      "guards": [],
      "lock": false,
      "tables": [
        "evidence_attachments"
      ]
    },
    "candidate": {
      "method": "POST",
      "path": "/api/v1/work-updates/{update_id}/attachments",
      "file": "/app/app/execution.py",
      "name": "upload_attachment",
      "line": 151
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "name": "assign_service_advisor_team",
      "file": "backend/app/tenant_admin.py",
      "line": 451,
      "end": 471,
      "signature": "department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_advisor_teams",
        "service_department_managers",
        "service_departments"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "assign_service_advisor_team",
      "line": 470
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "name": "appoint_service_department_manager",
      "file": "backend/app/tenant_admin.py",
      "line": 418,
      "end": 431,
      "signature": "department_id: UUID, membership_id: UUID, scope: ScopedTenant",
      "guards": [
        "_require(scope, \"tenant.users.manage\", mutation=True)"
      ],
      "lock": false,
      "tables": [
        "service_department_managers",
        "service_departments"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/admin/service-departments/{department_id}/managers/{membership_id}",
      "file": "/app/app/tenant_admin.py",
      "name": "appoint_service_department_manager",
      "line": 437
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/catalogue-items/{item_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/catalogue-items/{item_id}",
      "name": "update_catalogue",
      "file": "backend/app/inventory.py",
      "line": 196,
      "end": 200,
      "signature": "item_id: int, input: CatalogueItemInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "catalogue_items"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/catalogue-items/{item_id}",
      "file": "/app/app/inventory.py",
      "name": "update_catalogue",
      "line": 257
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/checklists/items/{item_id}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/checklists/items/{item_id}",
      "file": "/app/app/checklists.py",
      "name": "decide_item",
      "line": 102
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/customers/{customer_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/customers/{customer_id}",
      "name": "update_customer",
      "file": "backend/app/intake.py",
      "line": 203,
      "end": 210,
      "signature": "customer_id: int, input: CustomerInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "customers"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/customers/{customer_id}",
      "file": "/app/app/intake.py",
      "name": "update_customer",
      "line": 369
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/follow-ups/{followup_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/follow-ups/{followup_id}",
      "name": "update_followup",
      "file": "backend/app/followups.py",
      "line": 150,
      "end": 163,
      "signature": "followup_id: int, input: FollowupUpdate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "followups"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/follow-ups/{followup_id}",
      "file": "/app/app/followups.py",
      "name": "update_followup",
      "line": 156
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/jobs/{job_id}/advisor",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/advisor",
      "name": "assign_job_advisor",
      "file": "backend/app/jobs.py",
      "line": 263,
      "end": 296,
      "signature": "job_id: int, input: AdvisorAssignment, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards",
        "membership_branches",
        "membership_roles",
        "service_advisor_teams",
        "tenant_memberships",
        "tenant_roles"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/advisor",
      "file": "/app/app/jobs.py",
      "name": "assign_job_advisor",
      "line": 300
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/jobs/{job_id}/estimated-delivery",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/estimated-delivery",
      "file": "/app/app/jobs.py",
      "name": "update_estimated_delivery",
      "line": 250
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/jobs/{job_id}/manager",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/manager",
      "name": "transfer_job_manager",
      "file": "backend/app/jobs.py",
      "line": 300,
      "end": 319,
      "signature": "job_id: int, input: ManagerTransfer, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "job_cards"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/jobs/{job_id}/manager",
      "file": "/app/app/jobs.py",
      "name": "transfer_job_manager",
      "line": 337
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/media/{media_id}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/media/{media_id}",
      "file": "/app/app/media.py",
      "name": "update_media",
      "line": 93
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/purchase-orders/{purchase_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/purchase-orders/{purchase_id}",
      "name": "update_purchase_order",
      "file": "backend/app/inventory.py",
      "line": 263,
      "end": 268,
      "signature": "purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "purchase_orders"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/purchase-orders/{purchase_id}",
      "file": "/app/app/inventory.py",
      "name": "update_purchase_order",
      "line": 324
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/sales/leads/{lead_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/sales/leads/{lead_id}",
      "name": "update_lead",
      "file": "backend/app/sales_crm.py",
      "line": 93,
      "end": 96,
      "signature": "lead_id: int, input: LeadInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/sales/leads/{lead_id}",
      "file": "/app/app/sales_crm.py",
      "name": "update_lead",
      "line": 103
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/sales/quotations/{quotation_id}",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/sales/quotations/{quotation_id}",
      "name": "update_quotation",
      "file": "backend/app/sales_crm.py",
      "line": 126,
      "end": 138,
      "signature": "quotation_id: int, input: QuotationInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "quotation_lines",
        "quotations",
        "sales_leads"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/sales/quotations/{quotation_id}",
      "file": "/app/app/sales_crm.py",
      "name": "update_quotation",
      "line": 136
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/service-catalog/job-tasks/{task_id}/done",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/service-catalog/job-tasks/{task_id}/done",
      "file": "/app/app/service_catalog.py",
      "name": "set_job_task_done",
      "line": 149
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/service-catalog/{item_id}",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/service-catalog/{item_id}",
      "file": "/app/app/service_catalog.py",
      "name": "update_catalogue",
      "line": 90
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/superadmin/tenants/{tenant_id}/billing",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/billing",
      "name": "update_billing",
      "file": "backend/app/superadmin.py",
      "line": 291,
      "end": 297,
      "signature": "tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin",
      "guards": [],
      "lock": false,
      "tables": [
        "platform_billing"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/superadmin/tenants/{tenant_id}/billing",
      "file": "/app/app/superadmin.py",
      "name": "update_billing",
      "line": 291
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/suppliers/{supplier_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/suppliers/{supplier_id}",
      "name": "update_supplier",
      "file": "backend/app/inventory.py",
      "line": 229,
      "end": 233,
      "signature": "supplier_id: int, input: SupplierInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "suppliers"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/suppliers/{supplier_id}",
      "file": "/app/app/inventory.py",
      "name": "update_supplier",
      "line": 290
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/tenant/settings",
    "change": "HANDLER_CHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/tenant/settings",
      "name": "write_tenant_settings",
      "file": "backend/app/main.py",
      "line": 137,
      "end": 154,
      "signature": "input: SettingsUpdate, scope: ScopedTenant",
      "guards": [
        "require_permission(scope, \"tenant.settings.write\")"
      ],
      "lock": false,
      "tables": [
        "tenant_settings"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/tenant/settings",
      "file": "/app/app/main.py",
      "name": "write_tenant_settings",
      "line": 176
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/tenant/theme",
    "change": "ADDED",
    "checkout": null,
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/tenant/theme",
      "file": "/app/app/main.py",
      "name": "write_tenant_theme",
      "line": 162
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/vehicles/{vehicle_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "name": "update_vehicle",
      "file": "backend/app/intake.py",
      "line": 248,
      "end": 255,
      "signature": "vehicle_id: int, input: VehicleInput, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "vehicles"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/vehicles/{vehicle_id}",
      "file": "/app/app/intake.py",
      "name": "update_vehicle",
      "line": 414
    }
  },
  {
    "method": "PUT",
    "path": "/api/v1/visits/{visit_id}",
    "change": "HANDLER_UNCHANGED",
    "checkout": {
      "method": "PUT",
      "path": "/api/v1/visits/{visit_id}",
      "name": "update_visit",
      "file": "backend/app/intake.py",
      "line": 291,
      "end": 296,
      "signature": "visit_id: int, input: VisitUpdate, scope: ScopedTenant",
      "guards": [],
      "lock": false,
      "tables": [
        "visits"
      ]
    },
    "candidate": {
      "method": "PUT",
      "path": "/api/v1/visits/{visit_id}",
      "file": "/app/app/intake.py",
      "name": "update_visit",
      "line": 457
    }
  }
]
