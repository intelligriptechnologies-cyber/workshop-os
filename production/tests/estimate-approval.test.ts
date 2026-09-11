import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalEstimateApprovalApi } from "../src/estimate-approval.js";

const memberships = {
  advisor: {
    identityId: "advisor-1", membershipId: "membership-advisor-1", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["estimate.manage", "estimate.read", "estimate.send", "estimate.manual-outcome"],
  },
  manager: {
    identityId: "manager-1", membershipId: "membership-manager-1", tenantId: "tenant-north",
    branchIds: ["branch-delhi"], permissions: ["estimate.read", "estimate.manual-review"],
  },
};

const primaryHandoff = {
  id: "scope-handoff-1", tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42",
  inspectionId: "inspection-1", jobVersion: 2, eventType: "ADVISOR_SCOPE_RECOMMENDED" as const,
  recommendedScope: [
    { code: "SERVICE", description: "Periodic service", sourceFieldIds: ["service-due"] },
    { code: "BRAKE", description: "Replace brake pads", sourceFieldIds: ["brake-pad-mm"] },
  ],
  occurredAt: "2026-09-11T05:30:00.000Z", auditReference: "audit-advisor-1",
};

const configuration = {
  tenantId: "tenant-north", branchId: "branch-delhi", versionId: "estimate-policy-v4", currency: "INR",
  validityDays: 7, manualMakerCheckerThresholdMinor: "100000", allowPartialApproval: true,
  snapshot: {
    PRICE: { masterId: "price-1", version: 4 }, TAX: { masterId: "tax-1", version: 3 },
    WORKFLOW: { masterId: "workflow-1", version: 2 }, RECIPE: { masterId: "recipe-1", version: 5 },
    CHECKLIST: { masterId: "checklist-1", version: 6 }, POLICY: { masterId: "policy-1", version: 4 },
  },
  lines: [
    { id: "svc", scopeCode: "SERVICE", kind: "SERVICE" as const, description: "Periodic service", uom: "EA", unitPriceMinor: "100000", taxRateBps: "1800", maximumDiscountMinor: "10000", partialApprovalAllowed: true },
    { id: "lab", scopeCode: "SERVICE", kind: "LABOUR" as const, description: "Service labour", uom: "HOUR", unitPriceMinor: "50000", taxRateBps: "1800", maximumDiscountMinor: "5000", partialApprovalAllowed: true },
    { id: "pad", scopeCode: "BRAKE", kind: "MATERIAL" as const, description: "Front brake pad set", uom: "SET", unitPriceMinor: "80000", taxRateBps: "1800", maximumDiscountMinor: "0", partialApprovalAllowed: true },
    { id: "pkg", scopeCode: "BRAKE", kind: "PACKAGE" as const, description: "Brake installation package", uom: "EA", unitPriceMinor: "20000", taxRateBps: "1800", maximumDiscountMinor: "2000", partialApprovalAllowed: false },
  ],
};

const makeApi = () => createLocalEstimateApprovalApi({
  memberships, scopeHandoffs: [primaryHandoff], configurations: [configuration],
  jobs: [{ id: "job-42", tenantId: "tenant-north", branchId: "branch-delhi", customerId: "customer-42", payerIds: ["payer-customer", "payer-fleet"] }],
});

async function createAndSend(api: ReturnType<typeof makeApi>, key: string, lines: Record<string, unknown>[]) {
  const draft = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: "scope-handoff-1", configurationVersionId: "estimate-policy-v4", kind: "PRIMARY", lines,
  }, { idempotencyKey: `${key}-draft`, now: "2026-09-11T06:00:00.000Z" });
  const sent = await api.signIn("advisor").post(`/api/v1/estimates/${draft.body.estimate?.id}/send`, {
    branchId: "branch-delhi", financialYear: "2026-27",
  }, { idempotencyKey: `${key}-send`, ifMatch: 1, now: "2026-09-11T06:10:00.000Z" });
  return { draft, sent, token: String(sent.body.publicToken) };
}

test("configured service/package/material/labour lines produce exact payer-aware minor-unit totals and one immutable numbered sent version", async () => {
  const api = makeApi();
  const created = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: "scope-handoff-1", configurationVersionId: "estimate-policy-v4", kind: "PRIMARY",
    notes: "Prices valid for seven days",
    lines: [
      { configurationLineId: "svc", quantity: "1", discountMinor: "10000", payerAllocations: [{ payerId: "payer-customer", amountMinor: "106200" }] },
      { configurationLineId: "lab", quantity: "1.5", discountMinor: "5000", payerAllocations: [{ payerId: "payer-fleet", amountMinor: "82600" }] },
      { configurationLineId: "pad", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-fleet", amountMinor: "94400" }] },
      { configurationLineId: "pkg", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "23600" }] },
    ],
  }, { idempotencyKey: "estimate-draft-1", now: "2026-09-11T06:00:00.000Z" });
  assert.equal(created.status, 201);
  assert.deepEqual(created.body.estimate?.totals, {
    subtotalMinor: "275000", discountMinor: "15000", taxableMinor: "260000", taxMinor: "46800", grandTotalMinor: "306800", currency: "INR",
  });
  assert.deepEqual(created.body.estimate?.payerTotals, [
    { payerId: "payer-customer", amountMinor: "129800" }, { payerId: "payer-fleet", amountMinor: "177000" },
  ]);

  const sent = await api.signIn("advisor").post(`/api/v1/estimates/${created.body.estimate?.id}/send`, {
    branchId: "branch-delhi", financialYear: "2026-27",
  }, { idempotencyKey: "send-estimate-1", ifMatch: 1, now: "2026-09-11T06:10:00.000Z" });
  assert.equal(sent.status, 200);
  assert.equal(sent.body.estimate?.number, "EST/2026-27/000001");
  assert.equal(sent.body.estimate?.status, "SENT");
  assert.equal(sent.body.estimate?.validUntil, "2026-09-18T06:10:00.000Z");
  assert.match(String(sent.body.publicToken), /^[A-Za-z0-9_-]{32,}$/);

  const immutable = await api.signIn("advisor").patch(`/api/v1/estimates/${created.body.estimate?.id}`, {
    branchId: "branch-delhi", notes: "Attempted mutation",
  }, { idempotencyKey: "mutate-sent", ifMatch: 2 });
  assert.equal(immutable.status, 409);
  assert.equal(immutable.body.code, "ESTIMATE_VERSION_IMMUTABLE");

  const replay = await api.signIn("advisor").post(`/api/v1/estimates/${created.body.estimate?.id}/send`, {
    branchId: "branch-delhi", financialYear: "2026-27",
  }, { idempotencyKey: "send-estimate-1", ifMatch: 1, now: "2026-09-11T06:11:00.000Z" });
  assert.equal(replay.body.estimate?.number, "EST/2026-27/000001");
  assert.equal(replay.body.publicToken, sent.body.publicToken);
});

test("draft edits use optimistic concurrency and sent revisions remain linked without re-consuming the S08 handoff", async () => {
  const api = makeApi();
  const draft = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: "scope-handoff-1", configurationVersionId: "estimate-policy-v4", kind: "PRIMARY",
    lines: [{ configurationLineId: "svc", quantity: "1", discountMinor: "0", unitPriceMinor: "1", payerAllocations: [{ payerId: "payer-customer", amountMinor: "118000" }] }],
  }, { idempotencyKey: "draft-edit-create", now: "2026-09-11T06:00:00.000Z" });
  assert.equal(draft.body.estimate?.lines[0].unitPriceMinor, "100000", "client prices never replace configured prices");

  const stale = await api.signIn("advisor").patch(`/api/v1/estimates/${draft.body.estimate?.id}`, {
    branchId: "branch-delhi", notes: "stale", lines: draft.body.estimate?.lines,
  }, { idempotencyKey: "draft-edit-stale", ifMatch: 8 });
  assert.equal(stale.status, 412);

  const edited = await api.signIn("advisor").patch(`/api/v1/estimates/${draft.body.estimate?.id}`, {
    branchId: "branch-delhi", notes: "Customer requested a labour breakdown",
    lines: [
      { configurationLineId: "svc", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "118000" }] },
      { configurationLineId: "lab", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "59000" }] },
    ],
  }, { idempotencyKey: "draft-edit-valid", ifMatch: 1 });
  assert.equal(edited.status, 200);
  assert.equal(edited.body.resourceVersion, 2);
  assert.equal(edited.body.estimate?.totals.grandTotalMinor, "177000");

  const sent = await api.signIn("advisor").post(`/api/v1/estimates/${draft.body.estimate?.id}/send`, {
    branchId: "branch-delhi", financialYear: "2026-27",
  }, { idempotencyKey: "draft-edit-send", ifMatch: 2, now: "2026-09-11T06:10:00.000Z" });
  const revision = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: "scope-handoff-1", configurationVersionId: "estimate-policy-v4", kind: "PRIMARY",
    priorVersionId: sent.body.estimate?.id,
    lines: [{ configurationLineId: "svc", quantity: "1", discountMinor: "10000", payerAllocations: [{ payerId: "payer-customer", amountMinor: "106200" }] }],
  }, { idempotencyKey: "estimate-revision-2", now: "2026-09-11T06:20:00.000Z" });
  assert.equal(revision.status, 201);
  assert.equal(revision.body.estimate?.priorVersionId, sent.body.estimate?.id);
  assert.equal(revision.body.estimate?.revision, 2);
  assert.equal(revision.body.estimate?.status, "DRAFT");

  const mismatched = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: "scope-handoff-1", configurationVersionId: "estimate-policy-v4", kind: "PRIMARY",
    lines: [{ configurationLineId: "svc", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "117999" }] }],
  }, { idempotencyKey: "bad-allocation" });
  assert.equal(mismatched.status, 409);
  assert.equal(mismatched.body.code, "SCOPE_HANDOFF_ALREADY_CONSUMED");
});

test("an opaque public token exposes a minimal tenant-safe view and an allowed partial approval atomically activates only selected scope once", async () => {
  const api = makeApi();
  const draft = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: "scope-handoff-1", configurationVersionId: "estimate-policy-v4", kind: "PRIMARY",
    lines: [
      { configurationLineId: "svc", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "118000" }] },
      { configurationLineId: "pad", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-fleet", amountMinor: "94400" }] },
    ],
  }, { idempotencyKey: "public-partial-draft", now: "2026-09-11T06:00:00.000Z" });
  const sent = await api.signIn("advisor").post(`/api/v1/estimates/${draft.body.estimate?.id}/send`, {
    branchId: "branch-delhi", financialYear: "2026-27",
  }, { idempotencyKey: "public-partial-send", ifMatch: 1, now: "2026-09-11T06:10:00.000Z" });
  const token = String(sent.body.publicToken);

  const publicView = await api.public.get(`/api/v1/public/estimate-actions/${token}`, { now: "2026-09-11T06:20:00.000Z" });
  assert.equal(publicView.status, 200);
  assert.deepEqual(Object.keys(publicView.body).sort(), ["allowedOutcomes", "currency", "estimateNumber", "lines", "totalMinor", "validUntil"]);
  assert.equal(publicView.body.estimateNumber, "EST/2026-27/000001");
  assert.equal(JSON.stringify(publicView.body).includes("tenant-north"), false);
  assert.equal(JSON.stringify(publicView.body).includes("branch-delhi"), false);

  const lineId = String(draft.body.estimate?.lines[0].id);
  const approved = await api.public.post(`/api/v1/public/estimate-actions/${token}`, {
    outcome: "APPROVE_PARTIAL", selectedLineIds: [lineId], customerName: "Asha Rao", contactLast4: "7788",
    acknowledgement: "I approve only the selected work and price.",
  }, { now: "2026-09-11T06:25:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });
  assert.equal(approved.status, 200);
  assert.deepEqual(Object.keys(approved.body).sort(), ["outcome", "receiptReference", "recordedAt"]);
  assert.equal(approved.body.outcome, "APPROVE_PARTIAL");

  const detail = await api.signIn("advisor").get(`/api/v1/estimates/${draft.body.estimate?.id}?branchId=branch-delhi`);
  assert.equal(detail.body.estimate?.status, "PARTIALLY_APPROVED");
  assert.deepEqual(detail.body.approvalOutcomes?.[0].selectedLineIds, [lineId]);
  assert.equal(detail.body.approvalOutcomes?.[0].evidence.ipAddress, "203.0.113.7");
  assert.deepEqual(Object.keys(detail.body.activation!.snapshot).sort(), ["CHECKLIST", "POLICY", "PRICE", "RECIPE", "TAX", "WORKFLOW"]);
  assert.deepEqual(detail.body.activation?.approvedLineIds, [lineId]);
  assert.equal(detail.body.workPlanningHandoffs?.length, 1);
  assert.deepEqual({
    tenantId: detail.body.workPlanningHandoffs?.[0].tenantId,
    branchId: detail.body.workPlanningHandoffs?.[0].branchId,
    jobId: detail.body.workPlanningHandoffs?.[0].jobId,
    snapshot: detail.body.workPlanningHandoffs?.[0].snapshot,
  }, { tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", snapshot: detail.body.activation!.snapshot });
  assert.equal(detail.body.materialControlHandoffs?.length, 1);
  assert.deepEqual(detail.body.workPlanningHandoffs?.[0].lines.map((line: { id: string }) => line.id), [lineId]);
  assert.deepEqual(detail.body.materialControlHandoffs?.[0].lines, []);

  const replay = await api.public.post(`/api/v1/public/estimate-actions/${token}`, {
    outcome: "APPROVE_PARTIAL", selectedLineIds: [lineId], customerName: "Asha Rao", contactLast4: "7788",
    acknowledgement: "I approve only the selected work and price.",
  }, { now: "2026-09-11T06:26:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });
  assert.equal(replay.status, 410);
  assert.equal(replay.body.code, "ACTION_LINK_UNAVAILABLE");
  const afterReplay = await api.signIn("advisor").get(`/api/v1/estimates/${draft.body.estimate?.id}?branchId=branch-delhi`);
  assert.equal(afterReplay.body.workPlanningHandoffs?.length, 1);
  assert.equal(afterReplay.body.materialControlHandoffs?.length, 1);
});

test("public decisions preserve full, reject, and clarify evidence while expiry and partial policy fail without effects", async () => {
  const baseLine = { configurationLineId: "svc", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "118000" }] };
  const fullApi = makeApi();
  const full = await createAndSend(fullApi, "full", [baseLine]);
  const approved = await fullApi.public.post(`/api/v1/public/estimate-actions/${full.token}`, {
    outcome: "APPROVE_ALL", customerName: "Asha Rao", contactLast4: "7788", acknowledgement: "I approve all work and charges.",
  }, { now: "2026-09-11T06:30:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });
  assert.equal(approved.body.outcome, "APPROVE_ALL");
  assert.equal((await fullApi.signIn("advisor").get(`/api/v1/estimates/${full.draft.body.estimate?.id}?branchId=branch-delhi`)).body.estimate?.status, "APPROVED");

  const rejectApi = makeApi();
  const rejectedEstimate = await createAndSend(rejectApi, "reject", [baseLine]);
  const rejected = await rejectApi.public.post(`/api/v1/public/estimate-actions/${rejectedEstimate.token}`, {
    outcome: "REJECT", customerName: "Asha Rao", contactLast4: "7788", acknowledgement: "I understand no work will begin.",
    message: "Price is above my budget",
  }, { now: "2026-09-11T06:30:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });
  assert.equal(rejected.body.outcome, "REJECT");
  const rejectedDetail = await rejectApi.signIn("advisor").get(`/api/v1/estimates/${rejectedEstimate.draft.body.estimate?.id}?branchId=branch-delhi`);
  assert.equal(rejectedDetail.body.estimate?.status, "REJECTED");
  assert.equal(rejectedDetail.body.approvalOutcomes?.[0].evidence.message, "Price is above my budget");
  assert.equal(rejectedDetail.body.activation, undefined);

  const clarifyApi = makeApi();
  const clarificationEstimate = await createAndSend(clarifyApi, "clarify", [baseLine]);
  const clarified = await clarifyApi.public.post(`/api/v1/public/estimate-actions/${clarificationEstimate.token}`, {
    outcome: "CLARIFY", customerName: "Asha Rao", contactLast4: "7788", acknowledgement: "Please contact me before work begins.",
    message: "Does this include wheel alignment?",
  }, { now: "2026-09-11T06:30:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });
  assert.equal(clarified.body.outcome, "CLARIFY");

  const expiryApi = makeApi();
  const expiring = await createAndSend(expiryApi, "expired", [baseLine]);
  assert.equal((await expiryApi.public.get(`/api/v1/public/estimate-actions/${expiring.token}`, { now: "2026-09-18T06:10:00.001Z" })).status, 410);
  assert.equal((await expiryApi.public.get("/api/v1/public/estimate-actions/not-a-real-token", { now: "2026-09-11T06:20:00.000Z" })).body.code, "ACTION_LINK_UNAVAILABLE");

  const partialApi = makeApi();
  const partial = await createAndSend(partialApi, "partial-policy", [
    baseLine,
    { configurationLineId: "pkg", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "23600" }] },
  ]);
  const forbidden = await partialApi.public.post(`/api/v1/public/estimate-actions/${partial.token}`, {
    outcome: "APPROVE_PARTIAL", selectedLineIds: [partial.draft.body.estimate?.lines[1].id], customerName: "Asha Rao", contactLast4: "7788",
    acknowledgement: "I approve only this line.",
  }, { now: "2026-09-11T06:30:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });
  assert.equal(forbidden.status, 422);
  assert.equal(forbidden.body.code, "PARTIAL_APPROVAL_NOT_ALLOWED");
  assert.equal((await partialApi.public.get(`/api/v1/public/estimate-actions/${partial.token}`, { now: "2026-09-11T06:31:00.000Z" })).status, 200);
});

test("evidenced manual approval requires recent re-authentication and a distinct authorized checker above threshold", async () => {
  const api = makeApi();
  const { draft, sent } = await createAndSend(api, "manual", [
    { configurationLineId: "svc", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "118000" }] },
  ]);
  const estimateId = String(draft.body.estimate?.id);

  const missingEvidence = await api.signIn("advisor").post(`/api/v1/estimates/${estimateId}/manual-outcome-requests`, {
    branchId: "branch-delhi", outcome: "APPROVE_ALL", channel: "WHATSAPP", customerName: "Asha Rao",
    contactLast4: "7788", acknowledgement: "Approved on WhatsApp", reason: "Customer cannot open link",
  }, { idempotencyKey: "manual-missing-evidence", now: "2026-09-11T06:30:00.000Z", reauthenticatedAt: "2026-09-11T06:29:00.000Z" });
  assert.equal(missingEvidence.status, 422);
  assert.equal(missingEvidence.body.code, "MANUAL_EVIDENCE_REQUIRED");

  const stale = await api.signIn("advisor").post(`/api/v1/estimates/${estimateId}/manual-outcome-requests`, {
    branchId: "branch-delhi", outcome: "APPROVE_ALL", channel: "WHATSAPP", customerName: "Asha Rao",
    contactLast4: "7788", acknowledgement: "Approved on WhatsApp", attachmentRef: "private-media-approval-1", reason: "Customer cannot open link",
  }, { idempotencyKey: "manual-stale", now: "2026-09-11T06:30:00.000Z", reauthenticatedAt: "2026-09-11T05:00:00.000Z" });
  assert.equal(stale.status, 403);
  assert.equal(stale.body.code, "RECENT_AUTHENTICATION_REQUIRED");

  const requested = await api.signIn("advisor").post(`/api/v1/estimates/${estimateId}/manual-outcome-requests`, {
    branchId: "branch-delhi", outcome: "APPROVE_ALL", channel: "WHATSAPP", customerName: "Asha Rao",
    contactLast4: "7788", acknowledgement: "Approved on WhatsApp", attachmentRef: "private-media-approval-1", reason: "Customer cannot open link",
  }, { idempotencyKey: "manual-request", now: "2026-09-11T06:30:00.000Z", reauthenticatedAt: "2026-09-11T06:29:00.000Z" });
  assert.equal(requested.status, 202);
  assert.equal(requested.body.manualOutcomeRequest?.status, "PENDING_CHECK");
  const requestId = String(requested.body.manualOutcomeRequest?.id);

  const selfCheck = await api.signIn("advisor").post(`/api/v1/manual-outcome-requests/${requestId}/decisions`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "self check",
  }, { idempotencyKey: "manual-self-check", now: "2026-09-11T06:31:00.000Z", reauthenticatedAt: "2026-09-11T06:30:00.000Z" });
  assert.equal(selfCheck.status, 403);
  assert.equal(selfCheck.body.code, "MAKER_CANNOT_CHECK");

  const checked = await api.signIn("manager").post(`/api/v1/manual-outcome-requests/${requestId}/decisions`, {
    branchId: "branch-delhi", decision: "APPROVE", reason: "Verified attached customer message",
  }, { idempotencyKey: "manual-check", now: "2026-09-11T06:32:00.000Z", reauthenticatedAt: "2026-09-11T06:31:00.000Z" });
  assert.equal(checked.status, 200);
  assert.equal(checked.body.outcome, "APPROVE_ALL");

  const detail = await api.signIn("advisor").get(`/api/v1/estimates/${estimateId}?branchId=branch-delhi`);
  assert.equal(detail.body.estimate?.status, "APPROVED");
  assert.equal(detail.body.approvalOutcomes?.[0].source, "MANUAL");
  assert.equal(detail.body.approvalOutcomes?.[0].evidence.attachmentRef, "private-media-approval-1");
  assert.equal(detail.body.approvalOutcomes?.[0].checkerMembershipId, memberships.manager.membershipId);
  assert.equal(detail.body.workPlanningHandoffs?.length, 1);
  assert.equal(sent.body.estimate?.status, "SENT");
});

test("supplementary approval activates only added scope and leaves the approved base estimate immutable", async () => {
  const supplementaryHandoff = {
    ...primaryHandoff, id: "scope-handoff-supplement-1", inspectionId: "inspection-supplement-1",
    recommendedScope: [{ code: "BRAKE", description: "Additional brake work", sourceFieldIds: ["technician-finding-1"] }],
    occurredAt: "2026-09-11T07:00:00.000Z", auditReference: "audit-supplement-1",
  };
  const api = createLocalEstimateApprovalApi({
    memberships, scopeHandoffs: [primaryHandoff, supplementaryHandoff], configurations: [configuration],
    jobs: [{ id: "job-42", tenantId: "tenant-north", branchId: "branch-delhi", customerId: "customer-42", payerIds: ["payer-customer", "payer-fleet"] }],
  });
  const primary = await createAndSend(api, "supplement-base", [
    { configurationLineId: "svc", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-customer", amountMinor: "118000" }] },
  ]);
  await api.public.post(`/api/v1/public/estimate-actions/${primary.token}`, {
    outcome: "APPROVE_ALL", customerName: "Asha Rao", contactLast4: "7788", acknowledgement: "Approve original scope",
  }, { now: "2026-09-11T06:30:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });

  const supplement = await api.signIn("advisor").post("/api/v1/jobs/job-42/estimates", {
    branchId: "branch-delhi", scopeHandoffId: supplementaryHandoff.id, configurationVersionId: "estimate-policy-v4",
    kind: "SUPPLEMENTARY", baseApprovedEstimateVersionId: primary.draft.body.estimate?.id,
    lines: [{ configurationLineId: "pad", quantity: "1", discountMinor: "0", payerAllocations: [{ payerId: "payer-fleet", amountMinor: "94400" }] }],
  }, { idempotencyKey: "supplement-draft", now: "2026-09-11T07:05:00.000Z" });
  assert.equal(supplement.status, 201);
  assert.equal(supplement.body.estimate?.baseApprovedEstimateVersionId, primary.draft.body.estimate?.id);
  const sent = await api.signIn("advisor").post(`/api/v1/estimates/${supplement.body.estimate?.id}/send`, {
    branchId: "branch-delhi", financialYear: "2026-27",
  }, { idempotencyKey: "supplement-send", ifMatch: 1, now: "2026-09-11T07:10:00.000Z" });
  assert.equal(sent.body.estimate?.number, "EST/2026-27/000002");
  await api.public.post(`/api/v1/public/estimate-actions/${sent.body.publicToken}`, {
    outcome: "APPROVE_ALL", customerName: "Asha Rao", contactLast4: "7788", acknowledgement: "Approve added brake work",
  }, { now: "2026-09-11T07:15:00.000Z", ipAddress: "203.0.113.7", userAgent: "Customer Browser" });

  const baseDetail = await api.signIn("advisor").get(`/api/v1/estimates/${primary.draft.body.estimate?.id}?branchId=branch-delhi`);
  const supplementDetail = await api.signIn("advisor").get(`/api/v1/estimates/${supplement.body.estimate?.id}?branchId=branch-delhi`);
  assert.equal(baseDetail.body.estimate?.status, "APPROVED");
  assert.equal(baseDetail.body.workPlanningHandoffs?.length, 1);
  assert.equal(supplementDetail.body.estimate?.status, "APPROVED");
  assert.equal(supplementDetail.body.materialControlHandoffs?.length, 1);
  assert.deepEqual(supplementDetail.body.materialControlHandoffs?.[0].lines.map((line: { configurationLineId: string }) => line.configurationLineId), ["pad"]);
});

test("PostgreSQL estimate contract forces tenant RLS, immutable evidence, token digests, and exactly-once activation", async () => {
  const migration = await readFile(new URL("../db/migrations/009_estimate_approval.sql", import.meta.url), "utf8");
  for (const table of [
    "estimate_stream", "estimate_version", "estimate_line", "estimate_payer_allocation", "estimate_action_token",
    "estimate_approval_outcome", "estimate_scope_activation", "estimate_manual_outcome_request", "estimate_outbox", "estimate_idempotency",
  ]) {
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /token_digest text NOT NULL UNIQUE/i);
  assert.doesNotMatch(migration, /raw_token/i);
  assert.match(migration, /UNIQUE \(tenant_id, estimate_version_id\)/i);
  assert.match(migration, /UNIQUE \(tenant_id, activation_id, event_type\)/i);
  assert.match(migration, /CREATE OR REPLACE FUNCTION workshopos\.reject_estimate_evidence_mutation/i);
  assert.match(migration, /BEFORE UPDATE OR DELETE ON workshopos\.estimate_approval_outcome/i);
  assert.match(migration, /BEFORE UPDATE OR DELETE ON workshopos\.estimate_scope_activation/i);
  assert.match(migration, /CHECK \(checker_membership_id IS NULL OR checker_membership_id <> maker_membership_id\)/i);
});
