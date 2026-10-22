# Existing endpoint register

Static AST-derived routes including APIRouter prefixes; no server was started and no endpoint was invoked. Classification by family is in 12. Direct guard/lock absence may mean a helper performs it; consult full function and request scope.

| Method/path | Function/source | Scope/input | Direct guards |
|---|---|---|---|
| GET /api/v1/technician-tasks | list_my_tasks; backend/app/execution.py:60-63 | scope: ScopedTenant |  |
| POST /api/v1/technician-tasks | assign_task; backend/app/execution.py:67-83 | input: TaskCreate, scope: ScopedTenant |  |
| POST /api/v1/technician-tasks/{task_id}/update | update_task; backend/app/execution.py:87-96 | task_id: int, input: TaskUpdate, scope: ScopedTenant |  |
| POST /api/v1/work-updates/{update_id}/attachments | upload_attachment; backend/app/execution.py:100-111 | update_id: int, scope: ScopedTenant, file: UploadFile=File(...), label: Annotated[str, Form(max_length=1000)]='' |  |
| GET /api/v1/attachments/{attachment_id}/content | read_attachment; backend/app/execution.py:115-123 | attachment_id: int, scope: ScopedTenant |  |
| POST /api/v1/qc-checks | create_qc_check; backend/app/execution.py:127-133 | input: QcCheckCreate, scope: ScopedTenant |  |
| POST /api/v1/qc-checks/{check_id}/result | record_qc_result; backend/app/execution.py:137-149 | check_id: int, input: QcResult, scope: ScopedTenant |  |
| GET /api/v1/jobs/{job_id}/invoices | list_job_invoices; backend/app/finance.py:270-275 | job_id: int, scope: ScopedTenant |  |
| POST /api/v1/jobs/{job_id}/invoices | issue_invoice; backend/app/finance.py:279-344 | job_id: int, input: InvoiceIssue, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| POST /api/v1/invoices/{invoice_id}/void | void_invoice; backend/app/finance.py:348-364 | invoice_id: int, input: VoidInput, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| POST /api/v1/invoices/{invoice_id}/credit-notes | issue_credit_note; backend/app/finance.py:380-408 | invoice_id: int, input: CreditNoteIssue, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| POST /api/v1/credit-notes/{credit_note_id}/refunds | record_refund; backend/app/finance.py:412-429 | credit_note_id: int, input: RefundRecord, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| POST /api/v1/invoices/{invoice_id}/payments | record_payment; backend/app/finance.py:433-461 | invoice_id: int, input: PaymentRecord, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| GET /api/v1/invoices/{invoice_id}/payments | list_payments; backend/app/finance.py:476-480 | invoice_id: int, scope: ScopedTenant |  |
| POST /api/v1/jobs/{job_id}/complete-handover | complete_handover; backend/app/finance.py:484-514 | job_id: int, input: HandoverInput, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| GET /api/v1/jobs/{job_id}/delivery | get_delivery; backend/app/finance.py:525-530 | job_id: int, scope: ScopedTenant |  |
| GET /api/v1/financial-documents/{document_id}/content | get_document_content; backend/app/finance.py:534-544 | document_id: int, scope: ScopedTenant |  |
| GET /api/v1/payments/{payment_id}/supporting-attachment | get_supporting_attachment; backend/app/finance.py:548-557 | payment_id: int, scope: ScopedTenant |  |
| GET /api/v1/follow-ups | list_followups; backend/app/followups.py:90-112 | scope: ScopedTenant, job_id: int / None=Query(default=None, alias='jobId', gt=0), branch_id: UUID / None=Query(default=None, alias='branchId'), archived: bool=False |  |
| GET /api/v1/follow-ups/jobs | followup_jobs; backend/app/followups.py:116-129 | scope: ScopedTenant, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/follow-ups | create_followup; backend/app/followups.py:133-146 | input: FollowupCreate, scope: ScopedTenant |  |
| PUT /api/v1/follow-ups/{followup_id} | update_followup; backend/app/followups.py:150-163 | followup_id: int, input: FollowupUpdate, scope: ScopedTenant |  |
| POST /api/v1/follow-ups/{followup_id}/commands/complete | complete_followup; backend/app/followups.py:167-179 | followup_id: int, input: FollowupComplete, scope: ScopedTenant |  |
| POST /api/v1/follow-ups/{followup_id}/archive | archive_followup; backend/app/followups.py:183-195 | followup_id: int, input: ArchiveInput, scope: ScopedTenant |  |
| GET /api/v1/search | search; backend/app/followups.py:199-237 | scope: ScopedTenant, q: Annotated[str, Query(min_length=2, max_length=200)], branch_id: UUID / None=Query(default=None, alias='branchId'), limit: Annotated[int, Query(ge=1, le=100)]=30, entities: list[SearchEntity] / None=Query(default=None) |  |
| GET /api/v1/customers | list_customers; backend/app/intake.py:169-181 | scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/customers | create_customer; backend/app/intake.py:185-193 | input: CustomerInput, scope: ScopedTenant |  |
| GET /api/v1/customers/{customer_id} | get_customer; backend/app/intake.py:197-199 | customer_id: int, scope: ScopedTenant |  |
| PUT /api/v1/customers/{customer_id} | update_customer; backend/app/intake.py:203-210 | customer_id: int, input: CustomerInput, scope: ScopedTenant |  |
| POST /api/v1/customers/{customer_id}/archive | archive_customer; backend/app/intake.py:214-221 | customer_id: int, input: ArchiveInput, scope: ScopedTenant |  |
| GET /api/v1/vehicles | list_vehicles; backend/app/intake.py:225-229 | scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/vehicles | create_vehicle; backend/app/intake.py:233-238 | input: VehicleInput, scope: ScopedTenant |  |
| GET /api/v1/vehicles/{vehicle_id} | get_vehicle; backend/app/intake.py:242-244 | vehicle_id: int, scope: ScopedTenant |  |
| PUT /api/v1/vehicles/{vehicle_id} | update_vehicle; backend/app/intake.py:248-255 | vehicle_id: int, input: VehicleInput, scope: ScopedTenant |  |
| POST /api/v1/vehicles/{vehicle_id}/archive | archive_vehicle; backend/app/intake.py:259-264 | vehicle_id: int, input: ArchiveInput, scope: ScopedTenant |  |
| GET /api/v1/visits | list_visits; backend/app/intake.py:268-272 | scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/visits | create_visit; backend/app/intake.py:276-281 | input: VisitCreate, scope: ScopedTenant |  |
| GET /api/v1/visits/{visit_id} | get_visit; backend/app/intake.py:285-287 | visit_id: int, scope: ScopedTenant |  |
| PUT /api/v1/visits/{visit_id} | update_visit; backend/app/intake.py:291-296 | visit_id: int, input: VisitUpdate, scope: ScopedTenant |  |
| POST /api/v1/visits/{visit_id}/archive | archive_visit; backend/app/intake.py:300-305 | visit_id: int, input: ArchiveInput, scope: ScopedTenant |  |
| GET /api/v1/catalogue-items | list_catalogue; backend/app/inventory.py:177-184 | scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/catalogue-items | create_catalogue; backend/app/inventory.py:188-192 | input: CatalogueItemInput, scope: ScopedTenant |  |
| PUT /api/v1/catalogue-items/{item_id} | update_catalogue; backend/app/inventory.py:196-200 | item_id: int, input: CatalogueItemInput, scope: ScopedTenant |  |
| POST /api/v1/catalogue-items/{item_id}/archive | archive_catalogue; backend/app/inventory.py:204-210 | item_id: int, input: ArchiveInput, scope: ScopedTenant |  |
| GET /api/v1/suppliers | list_suppliers; backend/app/inventory.py:214-218 | scope: ScopedTenant, q: str='', archived: bool=False, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/suppliers | create_supplier; backend/app/inventory.py:222-225 | input: SupplierInput, scope: ScopedTenant |  |
| PUT /api/v1/suppliers/{supplier_id} | update_supplier; backend/app/inventory.py:229-233 | supplier_id: int, input: SupplierInput, scope: ScopedTenant |  |
| POST /api/v1/suppliers/{supplier_id}/archive | archive_supplier; backend/app/inventory.py:237-243 | supplier_id: int, input: ArchiveInput, scope: ScopedTenant |  |
| GET /api/v1/purchase-orders | list_purchase_orders; backend/app/inventory.py:247-251 | scope: ScopedTenant, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/purchase-orders | create_purchase_order; backend/app/inventory.py:255-259 | input: PurchaseOrderInput, scope: ScopedTenant |  |
| PUT /api/v1/purchase-orders/{purchase_id} | update_purchase_order; backend/app/inventory.py:263-268 | purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant |  |
| POST /api/v1/purchase-orders/{purchase_id}/commands/{command} | purchase_order_command; backend/app/inventory.py:272-278 | purchase_id: int, command: Literal['send', 'cancel', 'close'], input: PurchaseOrderCommand, scope: ScopedTenant |  |
| GET /api/v1/stock-inwards | list_stock_inwards; backend/app/inventory.py:282-286 | scope: ScopedTenant, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/stock-inwards | record_stock_inward; backend/app/inventory.py:290-305 | input: StockInwardInput, scope: ScopedTenant |  |
| POST /api/v1/stock-adjustments | adjust_stock; backend/app/inventory.py:309-314 | input: StockAdjustmentInput, scope: ScopedTenant |  |
| GET /api/v1/stock-ledger | list_stock_ledger; backend/app/inventory.py:318-322 | scope: ScopedTenant, item_id: int / None=Query(default=None, alias='itemId'), branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| GET /api/v1/jobs | list_jobs; backend/app/jobs.py:214-225 | scope: ScopedTenant, branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| GET /api/v1/jobs/{job_id} | get_job; backend/app/jobs.py:229-234 | job_id: int, scope: ScopedTenant |  |
| POST /api/v1/jobs | create_job; backend/app/jobs.py:238-259 | input: JobCreate, scope: ScopedTenant |  |
| PUT /api/v1/jobs/{job_id}/advisor | assign_job_advisor; backend/app/jobs.py:263-296 | job_id: int, input: AdvisorAssignment, scope: ScopedTenant |  |
| PUT /api/v1/jobs/{job_id}/manager | transfer_job_manager; backend/app/jobs.py:300-319 | job_id: int, input: ManagerTransfer, scope: ScopedTenant |  |
| POST /api/v1/jobs/{job_id}/estimates | create_estimate; backend/app/jobs.py:323-349 | job_id: int, input: EstimateCreate, scope: ScopedTenant |  |
| POST /api/v1/estimates/{estimate_id}/decision | record_estimate_decision; backend/app/jobs.py:353-377 | estimate_id: int, input: EstimateDecision, scope: ScopedTenant |  |
| POST /api/v1/jobs/{job_id}/commands/{command} | command_job; backend/app/jobs.py:445-479 | job_id: int, command: Literal['start-work', 'hold-job', 'resume-work', 'cancel-job', 'start-rework', 'complete-work'], input: JobCommand, scope: ScopedTenant, request_key: Annotated[str / None, Header(alias='Idempotency-Key')]=None |  |
| GET /health | health; backend/app/main.py:69-78 | session: Session=Depends(get_session) |  |
| GET /api/v1/health | api_health; backend/app/main.py:82-84 | session: Session=Depends(get_session) |  |
| GET /api/v1/auth/config | auth_config; backend/app/main.py:88-114 |  |  |
| GET /api/v1/session | session; backend/app/main.py:118-121 | scope: ScopedTenant |  |
| GET /api/v1/tenant/settings | read_tenant_settings; backend/app/main.py:125-133 | scope: ScopedTenant | require_permission(scope, "tenant.settings.read") |
| PUT /api/v1/tenant/settings | write_tenant_settings; backend/app/main.py:137-154 | input: SettingsUpdate, scope: ScopedTenant | require_permission(scope, "tenant.settings.write") |
| GET /api/v1/branches/{branch_id}/settings | read_branch_settings; backend/app/main.py:158-170 | branch_id: UUID, scope: ScopedTenant | require_permission(scope, "branch.settings.read") |
| GET /api/v1/material-reservations | list_reservations; backend/app/materials.py:154-162 | scope: ScopedTenant, job_id: int / None=Query(default=None, alias='jobId'), branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| GET /api/v1/jobs/{job_id}/material-reservations | list_job_reservations; backend/app/materials.py:166-167 | job_id: int, scope: ScopedTenant |  |
| GET /api/v1/material-ledger | list_material_ledger; backend/app/materials.py:171-179 | scope: ScopedTenant, reservation_id: int / None=Query(default=None, alias='reservationId'), job_id: int / None=Query(default=None, alias='jobId'), branch_id: UUID / None=Query(default=None, alias='branchId') |  |
| POST /api/v1/material-reservations | create_reservation; backend/app/materials.py:183-204 | input: MaterialReservationInput, scope: ScopedTenant |  |
| POST /api/v1/material-reservations/{reservation_id}/commands/{command} | material_command; backend/app/materials.py:208-236 | reservation_id: int, command: MaterialCommandName, input: MaterialCommand, scope: ScopedTenant |  |
| GET /api/v1/sales/leads | list_leads; backend/app/sales_crm.py:83-86 | scope: ScopedTenant, q: str='', stage: LeadStage / None=None, temperature: Temperature / None=None, exact_date: date / None=Query(None, alias='exactDate'), month: str / None=None, branch_id: UUID / None=Query(None, alias='branchId') |  |
| POST /api/v1/sales/leads | create_lead; backend/app/sales_crm.py:88-91 | input: LeadInput, scope: ScopedTenant |  |
| PUT /api/v1/sales/leads/{lead_id} | update_lead; backend/app/sales_crm.py:93-96 | lead_id: int, input: LeadInput, scope: ScopedTenant |  |
| GET /api/v1/sales/quotations | list_quotations; backend/app/sales_crm.py:99-101 | scope: ScopedTenant, q: str='', quotation_status: QuotationStatus / None=Query(None, alias='status'), exact_date: date / None=Query(None, alias='exactDate'), month: str / None=None, branch_id: UUID / None=Query(None, alias='branchId') |  |
| GET /api/v1/sales/service-tasks | list_service_tasks; backend/app/sales_crm.py:104-114 | scope: ScopedTenant, q: str='', branch_id: UUID / None=Query(None, alias='branchId') |  |
| POST /api/v1/sales/quotations | create_quotation; backend/app/sales_crm.py:116-124 | input: QuotationInput, scope: ScopedTenant |  |
| PUT /api/v1/sales/quotations/{quotation_id} | update_quotation; backend/app/sales_crm.py:126-138 | quotation_id: int, input: QuotationInput, scope: ScopedTenant |  |
| POST /api/v1/sales/quotations/{quotation_id}/status | change_status; backend/app/sales_crm.py:140-146 | quotation_id: int, input: StatusInput, scope: ScopedTenant |  |
| GET /api/v1/sales/quotations/{quotation_id}/document | quotation_document; backend/app/sales_crm.py:148-152 | quotation_id: int, scope: ScopedTenant |  |
| GET /api/v1/superadmin/tenants | list_tenants; backend/app/superadmin.py:237-251 | scope: ScopedSuperadmin |  |
| POST /api/v1/superadmin/tenants | provision_tenant; backend/app/superadmin.py:255-281 | input: ProvisionTenant, scope: ScopedSuperadmin |  |
| GET /api/v1/superadmin/tenants/{tenant_id} | get_tenant; backend/app/superadmin.py:285-287 | tenant_id: UUID, scope: ScopedSuperadmin |  |
| PUT /api/v1/superadmin/tenants/{tenant_id}/billing | update_billing; backend/app/superadmin.py:291-297 | tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin |  |
| POST /api/v1/superadmin/tenants/{tenant_id}/lifecycle | update_lifecycle; backend/app/superadmin.py:301-310 | tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin |  |
| POST /api/v1/superadmin/tenants/{tenant_id}/emulations | start_emulation; backend/app/superadmin.py:314-326 | tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin |  |
| POST /api/v1/superadmin/emulations/{emulation_id}/end | end_emulation; backend/app/superadmin.py:330-339 | emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin |  |
| GET /api/v1/superadmin/tenants/{tenant_id}/audit-events | list_audit_events; backend/app/superadmin.py:343-347 | tenant_id: UUID, scope: ScopedSuperadmin |  |
| GET /api/v1/admin/users | list_users; backend/app/tenant_admin.py:359-362 | scope: ScopedTenant | _require(scope, "tenant.users.read") |
| GET /api/v1/admin/service-departments | list_service_departments; backend/app/tenant_admin.py:366-369 | scope: ScopedTenant | _require(scope, "tenant.users.read") |
| POST /api/v1/admin/service-departments | create_service_department; backend/app/tenant_admin.py:373-389 | input: ServiceDepartmentCreate, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| PATCH /api/v1/admin/service-departments/{department_id} | update_service_department; backend/app/tenant_admin.py:393-414 | department_id: UUID, input: ServiceDepartmentUpdate, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| PUT /api/v1/admin/service-departments/{department_id}/managers/{membership_id} | appoint_service_department_manager; backend/app/tenant_admin.py:418-431 | department_id: UUID, membership_id: UUID, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| DELETE /api/v1/admin/service-departments/{department_id}/managers/{membership_id} | remove_service_department_manager; backend/app/tenant_admin.py:435-447 | department_id: UUID, membership_id: UUID, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| PUT /api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id} | assign_service_advisor_team; backend/app/tenant_admin.py:451-471 | department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| DELETE /api/v1/admin/service-departments/{department_id}/managers/{manager_membership_id}/advisors/{advisor_membership_id} | remove_service_advisor_team; backend/app/tenant_admin.py:475-486 | department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| POST /api/v1/admin/users | create_user; backend/app/tenant_admin.py:490-510 | input: UserCreate, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| PATCH /api/v1/admin/users/{membership_id} | update_user; backend/app/tenant_admin.py:514-536 | membership_id: UUID, input: UserUpdate, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| POST /api/v1/admin/users/{membership_id}/archive | archive_user; backend/app/tenant_admin.py:540-556 | membership_id: UUID, input: ArchiveUser, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| POST /api/v1/admin/users/{membership_id}/resend-invite | resend_invite; backend/app/tenant_admin.py:560-572 | membership_id: UUID, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| GET /api/v1/admin/roles | list_roles; backend/app/tenant_admin.py:576-579 | scope: ScopedTenant | _require(scope, "tenant.users.read") |
| POST /api/v1/admin/roles | create_role; backend/app/tenant_admin.py:583-598 | input: RoleCreate, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| PATCH /api/v1/admin/roles/{role_id} | update_role; backend/app/tenant_admin.py:602-634 | role_id: UUID, input: RoleUpdate, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |
| POST /api/v1/admin/roles/{role_id}/archive | archive_role; backend/app/tenant_admin.py:638-655 | role_id: UUID, input: ArchiveUser, scope: ScopedTenant | _require(scope, "tenant.users.manage", mutation=True) |