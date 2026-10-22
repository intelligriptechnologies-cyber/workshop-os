[
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "list",
    "source": "list: (config: CognitoConfig) => request<AdminDirectory>(config, \"/api/v1/admin/users\")"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "create",
    "source": "create: (config: CognitoConfig, input: { name: string; email: string; roleIds: string[]; branchIds: string[] }) =>\n    request<{ user: AdminUser }>(config, \"/api/v1/admin/users\", {\n      method: \"POST\", headers: { \"content-type\": \"application/json\", \"idempotency-key\": crypto.randomUUID() }, body: JSON.stringify(input),\n    })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "update",
    "source": "update: (config: CognitoConfig, user: AdminUser) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${user.id}`, {\n    method: \"PATCH\", headers: { \"content-type\": \"application/json\" },\n    body: JSON.stringify({ name: user.name, roleIds: user.roleIds, branchIds: user.branchIds, version: user.version }),\n  })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "archive",
    "source": "archive: (config: CognitoConfig, id: string, reason: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/archive`, {\n    method: \"POST\", headers: { \"content-type\": \"application/json\" }, body: JSON.stringify({ reason }),\n  })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "resend",
    "source": "resend: (config: CognitoConfig, id: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/resend-invite`, { method: \"POST\" })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "listServiceDepartments",
    "source": "listServiceDepartments: (config: CognitoConfig) => request<{ serviceDepartments: ServiceDepartment[] }>(config, \"/api/v1/admin/service-departments\")"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "createServiceDepartment",
    "source": "createServiceDepartment: (config: CognitoConfig, input: { branchId: string; name: string }) => request<{ serviceDepartment: ServiceDepartment }>(config, \"/api/v1/admin/service-departments\", { method: \"POST\", headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(input) })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "updateServiceDepartment",
    "source": "updateServiceDepartment: (config: CognitoConfig, id: string, input: { name: string; status: \"ACTIVE\" | \"ARCHIVED\" }) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${id}`, { method: \"PATCH\", headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(input) })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "appointManager",
    "source": "appointManager: (config: CognitoConfig, departmentId: string, membershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${membershipId}`, { method: \"PUT\" })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "removeManager",
    "source": "removeManager: (config: CognitoConfig, departmentId: string, membershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${membershipId}`, { method: \"DELETE\" })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "assignAdvisorTeam",
    "source": "assignAdvisorTeam: (config: CognitoConfig, departmentId: string, managerMembershipId: string, advisorMembershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${managerMembershipId}/advisors/${advisorMembershipId}`, { method: \"PUT\" })"
  },
  {
    "file": "src/admin-users-api.ts",
    "object": "adminUsersApi",
    "name": "removeAdvisorTeam",
    "source": "removeAdvisorTeam: (config: CognitoConfig, departmentId: string, managerMembershipId: string, advisorMembershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${managerMembershipId}/advisors/${advisorMembershipId}`, { method: \"DELETE\" })"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "invoices",
    "source": "invoices: (config: CognitoConfig, jobId: number) => request<RemoteInvoice[]>(config, `/api/v1/jobs/${jobId}/invoices`)"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "issueInvoice",
    "source": "issueInvoice: (config: CognitoConfig, jobId: number, input: { customerState?: string; replacesInvoiceId?: number } = {}, requestKey?: string) => request<RemoteInvoice>(config, `/api/v1/jobs/${jobId}/invoices`, json(input, requestKey))"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "voidInvoice",
    "source": "voidInvoice: (config: CognitoConfig, invoiceId: number, reason: string, requestKey?: string) => request<RemoteInvoice>(config, `/api/v1/invoices/${invoiceId}/void`, json({ reason }, requestKey))"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "issueCreditNote",
    "source": "issueCreditNote: (config: CognitoConfig, invoiceId: number, input: { amountPaise: number; reason: string }, requestKey?: string) => request<RemoteCreditNote>(config, `/api/v1/invoices/${invoiceId}/credit-notes`, json(input, requestKey))"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "recordRefund",
    "source": "recordRefund: (config: CognitoConfig, creditNoteId: number, input: { amountPaise: number; method: \"cash\" | \"card\" | \"upi\" | \"bank_transfer\" | \"other\"; reference?: string }, requestKey?: string) => request<{ id: number; creditNoteId: number }>(config, `/api/v1/credit-notes/${creditNoteId}/refunds`, json(input, requestKey))"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "payments",
    "source": "payments: (config: CognitoConfig, invoiceId: number) => request<RemotePayment[]>(config, `/api/v1/invoices/${invoiceId}/payments`)"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "recordPayment",
    "source": "recordPayment: (config: CognitoConfig, invoiceId: number, input: { amountPaise: number; method: \"cash\" | \"card\" | \"upi\" | \"bank_transfer\" | \"other\"; reference?: string; payer?: string; receivedAt?: string; supportingAttachment?: { filename: string; contentType: \"image/jpeg\" | \"image/png\" | \"application/pdf\"; dataBase64: string } }, requestKey?: string) => request<RemotePayment>(config, `/api/v1/invoices/${invoiceId}/payments`, json(input, requestKey))"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "delivery",
    "source": "delivery: (config: CognitoConfig, jobId: number) => request<RemoteHandover | null>(config, `/api/v1/jobs/${jobId}/delivery`)"
  },
  {
    "file": "src/finance-api.ts",
    "object": "financeApi",
    "name": "completeHandover",
    "source": "completeHandover: (config: CognitoConfig, jobId: number, input: { deliveredBy: string; finalOdometer: number; acknowledgement: string }, requestKey?: string) => request<RemoteHandover>(config, `/api/v1/jobs/${jobId}/complete-handover`, json(input, requestKey))"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "list",
    "source": "list: (config: CognitoConfig, options: { archived?: boolean; jobId?: number } = {}) => request<RemoteFollowup[]>(config, `/api/v1/follow-ups?archived=${options.archived ? \"true\" : \"false\"}${options.jobId ? `&jobId=${options.jobId}` : \"\"}`)"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "jobs",
    "source": "jobs: (config: CognitoConfig) => request<FollowupJob[]>(config, \"/api/v1/follow-ups/jobs\")"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "create",
    "source": "create: (config: CognitoConfig, input: { jobId: number; note: string; dueAt?: string }) => request<RemoteFollowup>(config, \"/api/v1/follow-ups\", json(\"POST\", input))"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "update",
    "source": "update: (config: CognitoConfig, id: number, input: { note: string; dueAt?: string; outcome?: string }) => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}`, json(\"PUT\", input))"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "complete",
    "source": "complete: (config: CognitoConfig, id: number, outcome = \"\") => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}/commands/complete`, json(\"POST\", { outcome }))"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "archive",
    "source": "archive: (config: CognitoConfig, id: number, reason: string) => request<RemoteFollowup>(config, `/api/v1/follow-ups/${id}/archive`, json(\"POST\", { reason }))"
  },
  {
    "file": "src/followups-api.ts",
    "object": "followupsApi",
    "name": "search",
    "source": "search: (config: CognitoConfig, q: string) => request<{ query: string; results: SearchResult[] }>(config, `/api/v1/search?q=${encodeURIComponent(q)}`)"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "list",
    "source": "list: (config: CognitoConfig) => request<RemoteJob[]>(config, \"/api/v1/jobs\")"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "create",
    "source": "create: (config: CognitoConfig, input: { visitId: number; departmentId: string; responsibleManagerId: string; workList?: string; promisedAt?: string }) => request<RemoteJob>(config, \"/api/v1/jobs\", json(input))"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "assignAdvisor",
    "source": "assignAdvisor: (config: CognitoConfig, jobId: number, input: { advisorId: string; reason?: string }) => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/advisor`, { method: \"PUT\", headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(input) })"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "transferManager",
    "source": "transferManager: (config: CognitoConfig, jobId: number, input: { departmentId: string; responsibleManagerId: string; reason?: string }) => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/manager`, { method: \"PUT\", headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(input) })"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "createEstimate",
    "source": "createEstimate: (config: CognitoConfig, jobId: number, input: { discount?: number; gstRate?: number; note?: string; lines: RemoteEstimateLine[] }) => request<RemoteEstimate>(config, `/api/v1/jobs/${jobId}/estimates`, json(input))"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "decideEstimate",
    "source": "decideEstimate: (config: CognitoConfig, estimateId: number, input: { outcome: \"approved\" | \"declined\"; channel: \"in_person\" | \"phone\" | \"whatsapp\" | \"email\" | \"other\"; decidedAt: string; note?: string }) => request<{ estimate: RemoteEstimate }>(config, `/api/v1/estimates/${estimateId}/decision`, json(input))"
  },
  {
    "file": "src/jobs-api.ts",
    "object": "jobsApi",
    "name": "command",
    "source": "command: (config: CognitoConfig, jobId: number, command: \"start-work\" | \"hold-job\" | \"resume-work\" | \"cancel-job\" | \"start-rework\" | \"complete-work\", reason = \"\") => request<RemoteJob>(config, `/api/v1/jobs/${jobId}/commands/${command}`, json({ reason }))"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "leads",
    "source": "leads: (config: CognitoConfig, filters = \"\") => request<Lead[]>(config, `/api/v1/sales/leads${filters}`)"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "createLead",
    "source": "createLead: (config: CognitoConfig, input: Omit<Lead, \"id\" | \"branchId\" | \"createdAt\" | \"updatedAt\">) => request<Lead>(config, \"/api/v1/sales/leads\", json(\"POST\", input))"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "updateLead",
    "source": "updateLead: (config: CognitoConfig, id: number, input: Omit<Lead, \"id\" | \"branchId\" | \"createdAt\" | \"updatedAt\">) => request<Lead>(config, `/api/v1/sales/leads/${id}`, json(\"PUT\", input))"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "quotations",
    "source": "quotations: (config: CognitoConfig, filters = \"\") => request<Quotation[]>(config, `/api/v1/sales/quotations${filters}`)"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "createQuotation",
    "source": "createQuotation: (config: CognitoConfig, input: { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] }) => request<Quotation>(config, \"/api/v1/sales/quotations\", json(\"POST\", input))"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "updateQuotation",
    "source": "updateQuotation: (config: CognitoConfig, id: number, input: { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] }) => request<Quotation>(config, `/api/v1/sales/quotations/${id}`, json(\"PUT\", input))"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "status",
    "source": "status: (config: CognitoConfig, id: number, quotationStatus: QuotationStatus) => request<Quotation>(config, `/api/v1/sales/quotations/${id}/status`, json(\"POST\", { status: quotationStatus }))"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "serviceTasks",
    "source": "serviceTasks: (config: CognitoConfig, filters = \"\") => request<ServiceTask[]>(config, `/api/v1/sales/service-tasks${filters}`)"
  },
  {
    "file": "src/sales-api.ts",
    "object": "salesApi",
    "name": "document",
    "source": "document: (config: CognitoConfig, id: number) => request<QuotationDocument>(config, `/api/v1/sales/quotations/${id}/document`)"
  }
]