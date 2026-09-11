import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createLocalNativeInvoiceApi,
  type NativeInvoiceMembership,
} from "../src/native-invoicing.js";

const memberships: Record<string, NativeInvoiceMembership> = {
  accounts: {
    identityId: "identity-accounts", membershipId: "membership-accounts", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["billing.read", "invoice.create", "invoice.finalize", "invoice.adjust.request"],
  },
  controller: {
    identityId: "identity-controller", membershipId: "membership-controller", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["invoice.adjust.approve"], recentReauthenticatedAt: "2026-09-11T11:55:00.000Z",
  },
  outsider: {
    identityId: "identity-outsider", membershipId: "membership-outsider", tenantId: "tenant-south",
    branchIds: ["branch-chennai"], permissions: ["billing.read", "invoice.create", "invoice.finalize"],
  },
};

const line = {
  id: "line-oil", description: "Engine oil service", hsnSac: "998729", supplyType: "SERVICE" as const,
  grossAmountMinor: "100000", discountMinor: "10000", gstRateBps: 1800, payerId: "customer-1",
};

const job = {
  tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", resourceVersion: 4,
  customerId: "customer-1", expectedTaskIds: ["task-oil"], approvedLines: [line],
  pendingSupplementaryScopeIds: ["supplement-2"],
};

const nativeConfig = {
  tenantId: "tenant-north", invoiceAuthority: "WORKSHOPOS_NATIVE" as const, baseCurrency: "INR",
  timezone: "Asia/Kolkata", supplierStateCode: "07", gstin: "07AAAAA0000A1Z5",
  taxSnapshotId: "tax-snapshot-v3", documentTemplateSnapshotId: "invoice-template-v2",
};

const readySignals = {
  taskCompletionEvents: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil", type: "S16_TASK_COMPLETION_READY" as const }],
  materialReconciliationEvents: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil", type: "S15_MATERIAL_RECONCILED" as const, consumers: ["S16_QC", "S18_BILLING"] as const, difference: "0" }],
  qcReleaseEvents: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil", type: "S16_QC_PASSED" as const }],
};

test("billing stays blocked until work, supplementary scope, material reconciliation, QC, and explicit native authority are ready", async () => {
  const api = createLocalNativeInvoiceApi({ memberships, tenantConfigurations: [nativeConfig], jobs: [job] });
  const blocked = await api.signIn("accounts").get("/api/v1/jobs/job-42/billing-readiness?branchId=branch-delhi");
  assert.equal(blocked.status, 200);
  assert.equal(blocked.body.ready, false);
  assert.deepEqual(blocked.body.blockers, [
    { code: "WORK_INCOMPLETE", taskIds: ["task-oil"] },
    { code: "SUPPLEMENTARY_SCOPE_PENDING", scopeIds: ["supplement-2"] },
    { code: "MATERIAL_NOT_RECONCILED", taskIds: ["task-oil"] },
    { code: "INDEPENDENT_QC_NOT_RELEASED", taskIds: ["task-oil"] },
  ]);

  const authorityApi = createLocalNativeInvoiceApi({
    memberships,
    tenantConfigurations: [{ ...nativeConfig, invoiceAuthority: "TALLY_AUTHORITATIVE" as const }],
    jobs: [{ ...job, pendingSupplementaryScopeIds: [] }],
    taskCompletionEvents: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil", type: "S16_TASK_COMPLETION_READY" }],
    materialReconciliationEvents: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil", type: "S15_MATERIAL_RECONCILED", consumers: ["S16_QC", "S18_BILLING"], difference: "0" }],
    qcReleaseEvents: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", taskId: "task-oil", type: "S16_QC_PASSED" }],
  });
  const wrongAuthority = await authorityApi.signIn("accounts").get("/api/v1/jobs/job-42/billing-readiness?branchId=branch-delhi");
  assert.equal(wrongAuthority.body.ready, false);
  assert.deepEqual(wrongAuthority.body.blockers, [{ code: "INVOICE_AUTHORITY_NOT_NATIVE", authority: "TALLY_AUTHORITATIVE" }]);
});

test("a native draft snapshots exact approved amounts and applies CGST/SGST or IGST from place of supply", async () => {
  const api = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [nativeConfig], jobs: [{ ...job, pendingSupplementaryScopeIds: [] }], ...readySignals,
  });
  const accounts = api.signIn("accounts");
  const intrastate = await accounts.post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "07",
  }, { idempotencyKey: "draft-intra", ifMatch: 4 });
  assert.equal(intrastate.status, 201);
  assert.equal(intrastate.body.invoice.authority, "WORKSHOPOS_NATIVE");
  assert.equal(intrastate.body.invoice.currency, "INR");
  assert.equal(intrastate.body.invoice.taxSnapshotId, "tax-snapshot-v3");
  assert.equal(intrastate.body.invoice.documentTemplateSnapshotId, "invoice-template-v2");
  assert.deepEqual(intrastate.body.invoice.lines[0].amounts, {
    grossMinor: "100000", discountMinor: "10000", taxableMinor: "90000",
    cgstMinor: "8100", sgstMinor: "8100", igstMinor: "0", totalMinor: "106200",
  });
  assert.deepEqual(intrastate.body.invoice.totals, {
    grossMinor: "100000", discountMinor: "10000", taxableMinor: "90000",
    cgstMinor: "8100", sgstMinor: "8100", igstMinor: "0", taxMinor: "16200", roundingAdjustmentMinor: "0", payableMinor: "106200",
  });

  const interstateApi = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [nativeConfig], jobs: [{ ...job, pendingSupplementaryScopeIds: [] }], ...readySignals,
  });
  const interstate = await interstateApi.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "27",
  }, { idempotencyKey: "draft-inter", ifMatch: 4 });
  assert.deepEqual(interstate.body.invoice.lines[0].amounts, {
    grossMinor: "100000", discountMinor: "10000", taxableMinor: "90000",
    cgstMinor: "0", sgstMinor: "0", igstMinor: "16200", totalMinor: "106200",
  });
});

test("intrastate GST uses exact rational half-rates for odd basis-point slabs without floating-point failure", async () => {
  const api = createLocalNativeInvoiceApi({
    memberships,
    tenantConfigurations: [nativeConfig],
    jobs: [{ ...job, pendingSupplementaryScopeIds: [], approvedLines: [{ ...line, grossAmountMinor: "10000", discountMinor: "0", gstRateBps: 25 }] }],
    ...readySignals,
  });
  const draft = await api.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "07",
  }, { idempotencyKey: "draft-quarter-percent", ifMatch: 4 });
  assert.equal(draft.status, 201);
  assert.deepEqual(draft.body.invoice.lines[0].amounts, {
    grossMinor: "10000", discountMinor: "0", taxableMinor: "10000",
    cgstMinor: "13", sgstMinor: "13", igstMinor: "0", totalMinor: "10026",
  });
});

test("finalization covers each payer's approved lines once and allocates idempotent collision-free numbers by India financial year", async () => {
  const payerJob = {
    ...job, pendingSupplementaryScopeIds: [], approvedLines: [
      line,
      { ...line, id: "line-part", description: "Oil filter", hsnSac: "842123", supplyType: "GOOD" as const, grossAmountMinor: "20000", discountMinor: "0", payerId: "insurer-1" },
      { ...line, id: "line-warranty", description: "Warranty labour", grossAmountMinor: "15000", discountMinor: "0", payerId: "manufacturer-1" },
    ],
  };
  const api = createLocalNativeInvoiceApi({ memberships, tenantConfigurations: [nativeConfig], jobs: [payerJob], ...readySignals });
  const accounts = api.signIn("accounts");
  const draft = async (payerId: string, key: string) => accounts.post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId, placeOfSupplyStateCode: "07",
  }, { idempotencyKey: key, ifMatch: 4 });
  const customerA = await draft("customer-1", "draft-customer-a");
  const customerB = await draft("customer-1", "draft-customer-b");
  const insurer = await draft("insurer-1", "draft-insurer");
  const manufacturer = await draft("manufacturer-1", "draft-manufacturer");
  assert.deepEqual(customerA.body.invoice.lines.map((candidate: any) => candidate.id), ["line-oil"]);

  const oldYear = await accounts.post(`/api/v1/invoices/${customerA.body.invoice.id}/finalize`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "final-customer", ifMatch: 1, now: "2026-03-31T18:29:00.000Z" });
  assert.equal(oldYear.status, 200);
  assert.equal(oldYear.body.invoice.financialYear, "2025-26");
  assert.equal(oldYear.body.invoice.documentNumber, "TAXINV/2025-26/000001");

  const duplicatePayer = await accounts.post(`/api/v1/invoices/${customerB.body.invoice.id}/finalize`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "final-customer-duplicate", ifMatch: 1, now: "2026-04-01T00:00:00.000Z" });
  assert.equal(duplicatePayer.status, 409);
  assert.equal(duplicatePayer.body.code, "PAYER_INVOICE_ALREADY_FINALIZED");

  const [firstNewYear, secondNewYear] = await Promise.all([
    accounts.post(`/api/v1/invoices/${insurer.body.invoice.id}/finalize`, { branchId: "branch-delhi" },
      { idempotencyKey: "final-insurer", ifMatch: 1, now: "2026-04-01T00:00:00.000Z" }),
    accounts.post(`/api/v1/invoices/${manufacturer.body.invoice.id}/finalize`, { branchId: "branch-delhi" },
      { idempotencyKey: "final-manufacturer", ifMatch: 1, now: "2026-04-01T00:00:00.000Z" }),
  ]);
  assert.deepEqual([firstNewYear.body.invoice.documentNumber, secondNewYear.body.invoice.documentNumber].sort(), [
    "TAXINV/2026-27/000001", "TAXINV/2026-27/000002",
  ]);
  const replay = await accounts.post(`/api/v1/invoices/${insurer.body.invoice.id}/finalize`, { branchId: "branch-delhi" },
    { idempotencyKey: "final-insurer", ifMatch: 1, now: "2026-04-01T00:00:00.000Z" });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.invoice.documentNumber, firstNewYear.body.invoice.documentNumber);
  assert.equal(api.testing.invoices().filter((candidate) => candidate.status === "FINALIZED").length, 3);
});

test("a finalized invoice is immutable and exact credit/debit corrections require a distinct recently authenticated approver", async () => {
  const api = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [nativeConfig], jobs: [{ ...job, pendingSupplementaryScopeIds: [] }], ...readySignals,
  });
  const accounts = api.signIn("accounts");
  const draft = await accounts.post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "07",
  }, { idempotencyKey: "adjust-draft", ifMatch: 4 });
  const finalized = await accounts.post(`/api/v1/invoices/${draft.body.invoice.id}/finalize`, { branchId: "branch-delhi" },
    { idempotencyKey: "adjust-final", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });
  const immutable = await accounts.patch(`/api/v1/invoices/${draft.body.invoice.id}`, {
    branchId: "branch-delhi", totals: { payableMinor: "1" },
  }, { ifMatch: 2 });
  assert.equal(immutable.status, 409);
  assert.equal(immutable.body.code, "FINALIZED_INVOICE_IMMUTABLE");

  const request = await accounts.post(`/api/v1/invoices/${draft.body.invoice.id}/adjustment-requests`, {
    branchId: "branch-delhi", type: "CREDIT_NOTE", reason: "Approved goodwill reduction",
    lines: [{ sourceLineId: "line-oil", taxableAdjustmentMinor: "1000", gstRateBps: 1800 }],
  }, { idempotencyKey: "credit-request", ifMatch: 2, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(request.status, 201);
  assert.equal(request.body.adjustment.status, "APPROVAL_PENDING");
  assert.equal((await accounts.post(`/api/v1/invoice-adjustments/${request.body.adjustment.id}/approve`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "self-approve", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" })).status, 403);

  const approved = await api.signIn("controller").post(`/api/v1/invoice-adjustments/${request.body.adjustment.id}/approve`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "credit-approve", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.adjustment.status, "FINALIZED");
  assert.equal(approved.body.adjustment.documentNumber, "CRN/2026-27/000001");
  assert.deepEqual(approved.body.adjustment.totals, { taxableMinor: "1000", taxMinor: "180", totalMinor: "1180" });
  assert.equal(approved.body.adjustment.linkedInvoiceNumber, finalized.body.invoice.documentNumber);
  assert.equal(api.testing.invoices()[0].totals.payableMinor, "106200");
});

test("approved debit notes and configured cancellation/reissue compensate the original without editing or reusing it", async () => {
  const api = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [{ ...nativeConfig, allowCancellationReissue: true }],
    jobs: [{ ...job, pendingSupplementaryScopeIds: [] }], ...readySignals,
  });
  const accounts = api.signIn("accounts");
  const draft = await accounts.post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "07",
  }, { idempotencyKey: "correction-draft", ifMatch: 4 });
  const finalized = await accounts.post(`/api/v1/invoices/${draft.body.invoice.id}/finalize`, { branchId: "branch-delhi" },
    { idempotencyKey: "correction-final", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });

  const debit = await accounts.post(`/api/v1/invoices/${draft.body.invoice.id}/adjustment-requests`, {
    branchId: "branch-delhi", type: "DEBIT_NOTE", reason: "Approved undercharge correction",
    lines: [{ sourceLineId: "line-oil", taxableAdjustmentMinor: "500", gstRateBps: 1800 }],
  }, { idempotencyKey: "debit-request", ifMatch: 2 });
  const debitApproved = await api.signIn("controller").post(`/api/v1/invoice-adjustments/${debit.body.adjustment.id}/approve`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "debit-approve", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(debitApproved.body.adjustment.documentNumber, "DBN/2026-27/000001");
  assert.deepEqual(debitApproved.body.adjustment.totals, { taxableMinor: "500", taxMinor: "90", totalMinor: "590" });

  const cancellation = await accounts.post(`/api/v1/invoices/${draft.body.invoice.id}/adjustment-requests`, {
    branchId: "branch-delhi", type: "CANCEL_REISSUE", reason: "Recipient GSTIN required correction",
    lines: [{ sourceLineId: "line-oil", taxableAdjustmentMinor: "90000", gstRateBps: 1800 }],
  }, { idempotencyKey: "cancel-request", ifMatch: 2 });
  const cancelled = await api.signIn("controller").post(`/api/v1/invoice-adjustments/${cancellation.body.adjustment.id}/approve`, {
    branchId: "branch-delhi",
  }, { idempotencyKey: "cancel-approve", ifMatch: 1, now: "2026-09-11T12:01:00.000Z" });
  assert.equal(cancelled.body.adjustment.documentNumber, "CAN/2026-27/000001");
  assert.equal(cancelled.body.originalInvoice.documentNumber, finalized.body.invoice.documentNumber);
  assert.equal(cancelled.body.originalInvoice.correctionStatus, "CANCELLED_BY_NOTE");
  assert.equal(cancelled.body.reissueInvoice.status, "DRAFT");
  assert.equal(cancelled.body.reissueInvoice.replacesInvoiceNumber, finalized.body.invoice.documentNumber);
  assert.deepEqual(cancelled.body.reissueInvoice.lines, finalized.body.invoice.lines);

  const reissued = await accounts.post(`/api/v1/invoices/${cancelled.body.reissueInvoice.id}/finalize`, { branchId: "branch-delhi" },
    { idempotencyKey: "reissue-final", ifMatch: 1, now: "2026-09-11T12:02:00.000Z" });
  assert.equal(reissued.status, 200);
  assert.equal(reissued.body.invoice.documentNumber, "TAXINV/2026-27/000002");
  assert.equal(api.testing.invoices()[0].totals.payableMinor, "106200");
});

test("authoritative invoice commands fail closed across tenancy, stale writes, invalid exact money, and replay misuse", async () => {
  const api = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [nativeConfig], jobs: [{ ...job, pendingSupplementaryScopeIds: [] }], ...readySignals,
  });
  const body = { branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "07" };
  assert.equal((await api.signIn("outsider").post("/api/v1/jobs/job-42/invoices/drafts", body,
    { idempotencyKey: "cross-tenant", ifMatch: 4 })).status, 403);
  assert.equal((await api.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", body,
    { ifMatch: 4 })).body.code, "IDEMPOTENCY_KEY_REQUIRED");
  assert.equal((await api.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", body,
    { idempotencyKey: "stale-draft", ifMatch: 3 })).status, 412);

  const created = await api.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", body,
    { idempotencyKey: "safe-draft", ifMatch: 4 });
  const replay = await api.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", body,
    { idempotencyKey: "safe-draft", ifMatch: 4 });
  assert.equal(created.status, 201);
  assert.equal(replay.status, 200);
  assert.equal(replay.body.invoice.id, created.body.invoice.id);
  const misuse = await api.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", {
    ...body, placeOfSupplyStateCode: "27",
  }, { idempotencyKey: "safe-draft", ifMatch: 4 });
  assert.equal(misuse.status, 409);
  assert.equal(misuse.body.code, "IDEMPOTENCY_KEY_REUSED");
  assert.equal(api.testing.invoices().length, 1);

  const invalidMoneyApi = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [nativeConfig],
    jobs: [{ ...job, pendingSupplementaryScopeIds: [], approvedLines: [{ ...line, grossAmountMinor: "1000.5" }] }], ...readySignals,
  });
  const invalid = await invalidMoneyApi.signIn("accounts").post("/api/v1/jobs/job-42/invoices/drafts", body,
    { idempotencyKey: "invalid-money", ifMatch: 4 });
  assert.equal(invalid.status, 422);
  assert.equal(invalid.body.code, "INVALID_APPROVED_FINANCIAL_SNAPSHOT");
  assert.equal(invalidMoneyApi.testing.invoices().length, 0);
});

test("finalization emits one durable billing and private-document boundary even when the command is retried", async () => {
  const api = createLocalNativeInvoiceApi({
    memberships, tenantConfigurations: [nativeConfig], jobs: [{ ...job, pendingSupplementaryScopeIds: [] }], ...readySignals,
  });
  const accounts = api.signIn("accounts");
  const draft = await accounts.post("/api/v1/jobs/job-42/invoices/drafts", {
    branchId: "branch-delhi", payerId: "customer-1", placeOfSupplyStateCode: "07",
  }, { idempotencyKey: "event-draft", ifMatch: 4 });
  const command = () => accounts.post(`/api/v1/invoices/${draft.body.invoice.id}/finalize`, { branchId: "branch-delhi" },
    { idempotencyKey: "event-final", ifMatch: 1, now: "2026-09-11T12:00:00.000Z" });
  await command();
  await command();
  assert.deepEqual(api.testing.outboxEvents(), [{
    id: "invoice-finalized-1", type: "S18_INVOICE_FINALIZED", tenantId: "tenant-north", branchId: "branch-delhi",
    aggregateId: draft.body.invoice.id, aggregateVersion: 2,
    payload: {
      jobId: "job-42", payerId: "customer-1", authority: "WORKSHOPOS_NATIVE",
      documentNumber: "TAXINV/2026-27/000001", payableMinor: "106200", currency: "INR",
      consumers: ["S20_PAYMENTS", "S21_DELIVERY", "DOCUMENT_WORKER"], documentVisibility: "PRIVATE",
    },
  }]);
});

test("PostgreSQL native-invoice contract forces scoped RLS, exact immutable finance, compensations, and serialized fiscal allocation", async () => {
  const sql = await readFile(new URL("../db/migrations/018_native_invoicing.sql", import.meta.url), "utf8");
  for (const table of [
    "billing_readiness_projection", "native_invoice", "native_invoice_payer_register", "native_invoice_line", "native_invoice_adjustment",
    "native_invoice_adjustment_line", "native_invoice_document", "native_invoice_event_outbox", "native_invoice_command_receipt",
  ]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
    assert.match(sql, new RegExp(`CREATE POLICY ${table}_isolation`));
  }
  assert.match(sql, /invoice_authority[\s\S]*WORKSHOPOS_NATIVE[\s\S]*TALLY_AUTHORITATIVE/i);
  assert.match(sql, /S16_TASK_COMPLETION_READY/);
  assert.match(sql, /S15_MATERIAL_RECONCILED/);
  assert.match(sql, /S16_QC_PASSED/);
  assert.match(sql, /gross_minor bigint[\s\S]*discount_minor bigint[\s\S]*taxable_minor bigint/i);
  assert.match(sql, /cgst_minor bigint[\s\S]*sgst_minor bigint[\s\S]*igst_minor bigint/i);
  assert.match(sql, /CREATE UNIQUE INDEX native_invoice_one_final_per_job_payer[\s\S]*WHERE status = 'FINALIZED'/i);
  assert.match(sql, /SELECT[\s\S]*FROM workshopos\.native_invoice[\s\S]*FOR UPDATE/i);
  assert.match(sql, /allocate_document_number/i);
  assert.match(sql, /Asia\/Kolkata|tenant_timezone/i);
  assert.match(sql, /EXTRACT\(MONTH[\s\S]*<= 3[\s\S]*financial_year/i);
  assert.match(sql, /maker_membership_id <> checker_membership_id/i);
  assert.match(sql, /CREDIT_NOTE[\s\S]*DEBIT_NOTE[\s\S]*CANCEL_REISSUE/i);
  assert.match(sql, /UNIQUE \(tenant_id, idempotency_key\)/i);
  assert.match(sql, /payload_fingerprint/i);
  for (const table of ["native_invoice_line", "native_invoice_adjustment_line", "native_invoice_document", "native_invoice_event_outbox", "native_invoice_command_receipt"]) {
    assert.match(sql, new RegExp(`CREATE TRIGGER ${table}_append_only`));
  }
  assert.match(sql, /FINALIZED invoice is immutable; append a credit note, debit note, or approved cancellation\/reissue/i);
  assert.doesNotMatch(sql, /ON DELETE CASCADE/i);
});
