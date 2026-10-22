[
  {
    "file": "backend/tests/unit/test_auth_config.py",
    "tests": [
      {
        "name": "test_local_demo_header_is_explicitly_development_only",
        "line": 17,
        "calls": [
          "local_settings",
          "local_settings().model_copy"
        ]
      },
      {
        "name": "test_auth_config_returns_local_contract_only_for_local_mode",
        "line": 23,
        "calls": [
          "main.auth_config",
          "monkeypatch.setattr"
        ]
      },
      {
        "name": "test_auth_config_rejects_local_emulator_outside_local_environment",
        "line": 30,
        "calls": [
          "getattr",
          "local_settings",
          "local_settings().model_copy",
          "main.auth_config",
          "monkeypatch.setattr",
          "pytest.raises"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/unit/test_finance.py",
    "tests": [
      {
        "name": "test_fiscal_year_rolls_over_on_indian_financial_year_boundary",
        "line": 6,
        "calls": [
          "_fiscal_year",
          "datetime"
        ]
      },
      {
        "name": "test_rendered_snapshot_is_deterministic_and_contains_document_identity",
        "line": 11,
        "calls": [
          "_render_html"
        ]
      },
      {
        "name": "test_issued_document_html_escapes_untrusted_snapshot_content",
        "line": 17,
        "calls": [
          "_render_html"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/unit/test_intake.py",
    "tests": [
      {
        "name": "test_single_branch_is_selected_only_when_server_scope_is_unambiguous",
        "line": 26,
        "calls": [
          "_branch",
          "_scope",
          "pytest.raises"
        ]
      },
      {
        "name": "test_caller_cannot_select_branch_outside_membership",
        "line": 33,
        "calls": [
          "_branch",
          "_scope",
          "pytest.raises"
        ]
      },
      {
        "name": "test_existing_service_queue_permission_allows_intake_but_not_unrelated_roles",
        "line": 39,
        "calls": [
          "_require_any",
          "_scope",
          "pytest.raises"
        ]
      },
      {
        "name": "test_support_emulation_can_read_but_never_mutate",
        "line": 46,
        "calls": [
          "_require_any",
          "_scope",
          "pytest.raises"
        ]
      },
      {
        "name": "test_blank_input_has_a_stable_client_safe_error",
        "line": 53,
        "calls": [
          "_clean",
          "pytest.raises"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/unit/test_inventory.py",
    "tests": [
      {
        "name": "test_inventory_authority_is_explicit_and_support_is_read_only",
        "line": 21,
        "calls": [
          "_permission",
          "_scope",
          "pytest.raises"
        ]
      },
      {
        "name": "test_stock_adjustment_input_requires_a_nonzero_quantity_at_command_boundary",
        "line": 32,
        "calls": [
          "StockAdjustmentInput",
          "_adjustment_quantity",
          "pytest.raises"
        ]
      },
      {
        "name": "test_runtime_role_has_only_the_po_line_delete_grant_needed_for_draft_replacement",
        "line": 40,
        "calls": [
          "Path",
          "migration.read_text"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/unit/test_materials.py",
    "tests": [
      {
        "name": "test_material_command_requires_a_positive_quantity",
        "line": 9,
        "calls": [
          "MaterialCommand",
          "pytest.raises"
        ]
      },
      {
        "name": "test_reservation_projection_keeps_reservation_and_on_job_quantities_distinct",
        "line": 15,
        "calls": [
          "UUID",
          "_reservation"
        ]
      },
      {
        "name": "test_reservation_input_uses_camel_case_wire_fields",
        "line": 26,
        "calls": [
          "MaterialReservationInput"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/unit/test_tenancy.py",
    "tests": [
      {
        "name": "test_session_payload_contains_only_server_resolved_scope",
        "line": 29,
        "calls": [
          "scope",
          "session_payload"
        ]
      },
      {
        "name": "test_branch_scope_is_postgresql_safe_and_rejects_unassigned_branch",
        "line": 43,
        "calls": [
          "UUID",
          "branch_array_literal",
          "pytest.raises",
          "require_branch",
          "scope"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/unit/test_tenant_admin.py",
    "tests": [
      {
        "name": "test_assignments_require_a_role_and_branch",
        "line": 18,
        "calls": [
          "UUID",
          "pytest.raises",
          "validate_assignment"
        ]
      },
      {
        "name": "test_only_declared_operational_permissions_can_be_assigned",
        "line": 29,
        "calls": [
          "pytest.raises",
          "validate_permissions"
        ]
      },
      {
        "name": "test_assignment_rejects_duplicate_ids",
        "line": 39,
        "calls": [
          "UUID",
          "pytest.raises",
          "validate_assignment"
        ]
      },
      {
        "name": "test_bootstrap_roles_match_the_existing_operational_role_labels",
        "line": 49,
        "calls": [
          "set"
        ]
      },
      {
        "name": "test_self_archive_and_final_tenant_admin_guards_fail_closed",
        "line": 60,
        "calls": [
          "UUID",
          "pytest.raises",
          "require_distinct_membership",
          "require_manager_remaining"
        ]
      },
      {
        "name": "test_owner_role_update_cannot_drop_tenant_admin_capabilities",
        "line": 70,
        "calls": [
          "pytest.raises",
          "require_owner_permissions"
        ]
      },
      {
        "name": "test_service_manager_role_keeps_the_service_job_permissions",
        "line": 76,
        "calls": [
          "pytest.raises",
          "require_service_manager_permissions"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_finance.py",
    "tests": [
      {
        "name": "test_issued_invoice_payment_receipt_void_and_handover_are_scoped_and_immutable",
        "line": 54,
        "calls": [
          "TestClient",
          "_activate_owner",
          "_approved_job",
          "_provision",
          "_reset_database",
          "client.get",
          "client.get(f'/api/v1/jobs/{job_id}/invoices', headers={'x-workshopos-identity': 'south-finance-user'}).json",
          "client.post",
          "client.post(f'/api/v1/jobs/{job_id}/invoices', headers={**headers, 'Idempotency-Key': 'issue-1'}, json={}).json",
          "connection.execute",
          "content.headers['content-disposition'].startswith",
          "get_engine",
          "get_engine().begin",
          "handover.json",
          "invoice.json",
          "pytest.raises",
          "str",
          "text"
        ]
      },
      {
        "name": "test_pre_payment_void_keeps_number_and_allows_numbered_replacement",
        "line": 93,
        "calls": [
          "TestClient",
          "_activate_owner",
          "_approved_job",
          "_provision",
          "_reset_database",
          "client.post",
          "client.post(f\"/api/v1/invoices/{first['id']}/void\", headers=headers, json={'reason': 'typo'}).json",
          "client.post(f'/api/v1/jobs/{job_id}/invoices', headers=headers, json={'replacesInvoiceId': first['id']}).json",
          "client.post(f'/api/v1/jobs/{job_id}/invoices', headers=headers, json={}).json",
          "str"
        ]
      },
      {
        "name": "test_invoice_uses_approved_snapshot_and_paid_correction_is_credit_note_then_refund",
        "line": 109,
        "calls": [
          "TestClient",
          "_activate_owner",
          "_approved_job",
          "_provision",
          "_reset_database",
          "client.post",
          "connection.execute",
          "connection.execute(text(\"SELECT related_document_id FROM financial_document_events WHERE document_id=:document_id AND event_type='CREDITED'\"), {'document_id': invoice['documentId']}).scalar_one",
          "credit.json",
          "get_engine",
          "get_engine().begin",
          "issued.json",
          "replacement.json",
          "str",
          "text"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_followups_search.py",
    "tests": [
      {
        "name": "test_followups_and_search_are_routed_by_permissions_tenant_and_branch",
        "line": 56,
        "calls": [
          "TestClient",
          "_activate_owner",
          "_job_and_invoice",
          "_provision",
          "_reset_database",
          "archived.json",
          "client.get",
          "client.get('/api/v1/follow-ups', headers=headers).json",
          "client.get('/api/v1/follow-ups', headers={'x-workshopos-identity': 'south-user'}).json",
          "client.get('/api/v1/follow-ups?archived=true', headers=headers).json",
          "client.get('/api/v1/search?q=Asha', headers={'x-workshopos-identity': 'south-user'}).json",
          "client.post",
          "client.put",
          "completed.json",
          "connection.execute",
          "connection.execute(text('SELECT action FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at'), {'tenant_id': str(north['id'])}).scalars",
          "connection.execute(text('SELECT action FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at'), {'tenant_id': str(north['id'])}).scalars().all",
          "created.json",
          "denied_branch.json",
          "get_engine",
          "get_engine().begin",
          "len",
          "search.json",
          "set",
          "str",
          "text",
          "updated.json"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_health.py",
    "tests": [
      {
        "name": "test_versioned_health_endpoint_uses_postgresql",
        "line": 8,
        "calls": [
          "TestClient",
          "client.get",
          "os.environ.get",
          "os.environ.get('WORKSHOPOS_DATABASE_URL', '').startswith",
          "response.json"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_intake.py",
    "tests": [
      {
        "name": "test_intake_records_are_created_searched_archived_and_hidden_from_another_tenant",
        "line": 36,
        "calls": [
          "TestClient",
          "_activate_reception",
          "_provision",
          "_reset_database",
          "client.get",
          "client.get('/api/v1/customers?q=Anika', headers={'x-workshopos-identity': 'south-user'}).json",
          "client.get('/api/v1/visits', headers=headers).json",
          "client.get('/api/v1/visits?q=Anika', headers=headers).json",
          "client.post",
          "customer.json",
          "str",
          "vehicle.json",
          "visit.json"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_inventory.py",
    "tests": [
      {
        "name": "test_catalogue_purchase_inward_and_ledger_are_branch_scoped_and_audited",
        "line": 43,
        "calls": [
          "TestClient",
          "_activate",
          "_provision",
          "_reset_database",
          "client.get",
          "client.get('/api/v1/catalogue-items', headers=headers).json",
          "client.get('/api/v1/catalogue-items', headers={'x-workshopos-identity': 'south-stock-user'}).json",
          "client.get('/api/v1/stock-ledger', headers=headers).json",
          "client.post",
          "client.put",
          "item.json",
          "len",
          "po.json",
          "str",
          "supplier.json"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_jobs.py",
    "tests": [
      {
        "name": "test_job_estimate_decision_and_lifecycle_are_scoped_and_audited",
        "line": 64,
        "calls": [
          "TestClient",
          "_activate_owner",
          "_intake",
          "_provision",
          "_reset_database",
          "blocked.json",
          "client.get",
          "client.get('/api/v1/jobs', headers={'x-workshopos-identity': 'south-user'}).json",
          "client.post",
          "completion.json",
          "connection.execute",
          "connection.execute(text('SELECT primary_branch_id FROM tenants WHERE id=:tenant_id'), {'tenant_id': str(north['id'])}).scalar_one",
          "connection.execute(text('SELECT user_id FROM tenant_memberships WHERE tenant_id=:tenant_id'), {'tenant_id': str(north['id'])}).scalar_one",
          "decision.json",
          "estimate.json",
          "get_engine",
          "get_engine().begin",
          "held.json",
          "job.json",
          "started.json",
          "str",
          "text"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_materials.py",
    "tests": [
      {
        "name": "test_reservation_issue_return_waste_are_scoped_and_never_overdraw_stock",
        "line": 58,
        "calls": [
          "TestClient",
          "_activate",
          "_approved_job",
          "_provision",
          "_reset_database",
          "all",
          "client.get",
          "client.get('/api/v1/catalogue-items', headers=headers).json",
          "client.get('/api/v1/material-ledger', headers=headers).json",
          "client.get('/api/v1/material-reservations', headers={'x-workshopos-identity': 'south-material-user'}).json",
          "client.get('/api/v1/stock-ledger', headers=headers).json",
          "client.post",
          "issue.json",
          "item.json",
          "reservation.json",
          "str"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_sales_crm.py",
    "tests": [
      {
        "name": "test_lead_not_entered_flags_round_trip_and_are_audited",
        "line": 42,
        "calls": [
          "TestClient",
          "_activate",
          "_provision",
          "_reset_database",
          "client.post",
          "client.put",
          "connection.execute",
          "connection.execute(text(\"SELECT after_value FROM tenant_audit_events WHERE action='SALES_LEAD_UPDATED'\")).scalar_one",
          "created.json",
          "get_engine",
          "get_engine().begin",
          "str",
          "text",
          "updated.json"
        ]
      },
      {
        "name": "test_quotation_created_date_filters_ignore_valid_until",
        "line": 70,
        "calls": [
          "TestClient",
          "_activate",
          "_provision",
          "_reset_database",
          "client.get",
          "client.post",
          "connection.execute",
          "exact.json",
          "first.json",
          "get_engine",
          "get_engine().begin",
          "lead.json",
          "monthly.json",
          "second.json",
          "str",
          "text"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_superadmin.py",
    "tests": [
      {
        "name": "test_superadmin_provisions_audited_read_only_tenant_control_plane",
        "line": 93,
        "calls": [
          "TestClient",
          "_provision",
          "_read_only_scope",
          "_reset_database",
          "apply_rls_context",
          "audit.json",
          "billing.json",
          "client.get",
          "client.post",
          "client.put",
          "connection.begin",
          "connection.execute",
          "connection.execute(text(\"SELECT count(*) FROM membership_roles AS mr JOIN tenant_roles AS tr ON tr.id=mr.role_id WHERE mr.tenant_id=:tenant_id AND tr.system_key='owner_admin'\"), {'tenant_id': tenant_id}).scalar_one",
          "connection.execute(text(\"SELECT count(*) FROM tenant_admin_invitations WHERE tenant_id=:tenant_id AND status='PENDING'\"), {'tenant_id': tenant_id}).scalar_one",
          "connection.execute(text(\"SELECT settings->>'templateVersion' FROM tenant_settings WHERE tenant_id=:tenant_id\"), {'tenant_id': tenant_id}).scalar_one",
          "connection.execute(text('SELECT count(*) FROM branches WHERE tenant_id=:tenant_id AND is_primary'), {'tenant_id': tenant_id}).scalar_one",
          "connection.execute(text('SELECT count(*) FROM branches WHERE tenant_id=:tenant_id'), {'tenant_id': tenant_id}).scalar_one",
          "connection.execute(text('SELECT count(*) FROM job_cards WHERE tenant_id=:tenant_id'), {'tenant_id': tenant_id}).scalar_one",
          "connection.execute(text('SELECT count(*) FROM stock_ledger WHERE tenant_id=:tenant_id'), {'tenant_id': tenant_id}).scalar_one",
          "emulation.json",
          "get_engine",
          "get_engine().connect",
          "pytest.raises",
          "session.json",
          "str",
          "suspended.json",
          "text",
          "transaction.rollback",
          "write.json"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_tenant_admin.py",
    "tests": [
      {
        "name": "test_tenant_admin_manages_only_own_directory_and_browser_bypass_is_rejected",
        "line": 42,
        "calls": [
          "TestClient",
          "_activate_invited_membership",
          "_provision",
          "_reset_database",
          "bypass.json",
          "client.get",
          "client.patch",
          "client.post",
          "connection.execute",
          "connection.execute(text('SELECT user_id FROM tenant_memberships WHERE id = :id'), {'id': invited['id']}).scalar_one",
          "created.json",
          "directory.json",
          "forbidden_assignment.json",
          "get_engine",
          "get_engine().begin",
          "last_manager.json",
          "next",
          "owner.get",
          "owner_guard.json",
          "self_archive.json",
          "str",
          "text"
        ]
      }
    ]
  },
  {
    "file": "backend/tests/integration/test_tenant_isolation.py",
    "tests": [
      {
        "name": "test_rls_fails_closed_and_blocks_cross_tenant_and_cross_branch_rows",
        "line": 43,
        "calls": [
          "TestClient",
          "apply_rls_context",
          "client.get",
          "client.put",
          "connection.begin",
          "connection.execute",
          "connection.execute(text('SELECT branch_id FROM branch_settings ORDER BY branch_id')).scalars",
          "connection.execute(text('SELECT branch_id FROM branch_settings ORDER BY branch_id')).scalars().all",
          "connection.execute(text('SELECT count(*) FROM tenant_settings')).scalar_one",
          "connection.execute(text('SELECT tenant_id FROM tenant_settings ORDER BY tenant_id')).scalars",
          "connection.execute(text('SELECT tenant_id FROM tenant_settings ORDER BY tenant_id')).scalars().all",
          "engine.begin",
          "engine.connect",
          "get_engine",
          "jaipur.json",
          "pytest.raises",
          "session.json",
          "str",
          "tenant_scope",
          "text",
          "transaction.rollback",
          "write.json"
        ]
      }
    ]
  }
]