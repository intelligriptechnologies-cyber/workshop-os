import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createLocalDeliveryGateApi, type DeliveryMembership } from "../src/delivery-gate.js";

const memberships: Record<string, DeliveryMembership> = {
  advisor: { identityId: "identity-advisor", membershipId: "membership-advisor", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["SERVICE_ADVISOR"], permissions: ["closure.view", "delivery.record", "gatepass.issue", "document.render", "document.qr.revoke", "closure.override.request"] },
  manager: { identityId: "identity-manager", membershipId: "membership-manager", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["MANAGER"], permissions: ["closure.view", "closure.override.approve"], recentReauthenticatedAt: "2026-09-11T11:58:00.000Z" },
  gate: { identityId: "identity-gate", membershipId: "membership-gate", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["GATE_SECURITY"], permissions: ["gate.verify", "closure.view"] },
  combined: { identityId: "identity-combined", membershipId: "membership-combined", tenantId: "tenant-north", branchIds: ["branch-delhi"], roles: ["SERVICE_ADVISOR", "GATE_SECURITY"], permissions: ["delivery.record", "gatepass.issue", "gate.verify"] },
};

const ready = {
  workComplete: true, qcPassed: true, materialReconciled: true, billingFinalized: true,
  paymentOrCreditSatisfied: true, incidentsResolved: true,
};

function makeApi(readiness: Partial<typeof ready> = ready) {
  return createLocalDeliveryGateApi({
    memberships,
    jobs: [{ tenantId: "tenant-north", branchId: "branch-delhi", jobId: "job-42", visitId: "visit-42", vehicleId: "vehicle-42", registrationNumber: "DL01AB1234", financialRecordStatus: "CLOSED", resourceVersion: 7, readiness: { ...ready, ...readiness } }],
    documentTemplates: [
      { tenantId: "tenant-north", documentType: "ESTIMATE", version: 2 },
      { tenantId: "tenant-north", documentType: "JOB_CARD", version: 4 },
      { tenantId: "tenant-north", documentType: "MATERIAL_DOCUMENT", version: 3 },
      { tenantId: "tenant-north", documentType: "GATE_PASS", version: 3 },
      { tenantId: "tenant-north", documentType: "INVOICE", version: 5 },
      { tenantId: "tenant-north", documentType: "RECEIPT", version: 6 },
    ],
    timezoneByTenant: { "tenant-north": "Asia/Kolkata" },
    overridePolicy: { allowedBlockerCodes: ["QC_NOT_PASSED", "INCIDENT_UNRESOLVED"], recentAuthenticationSeconds: 300 },
  });
}

test("closure readiness explains every unresolved control in plain language", async () => {
  const api = makeApi({ workComplete: false, qcPassed: false, materialReconciled: false, billingFinalized: false, paymentOrCreditSatisfied: false, incidentsResolved: false });
  const result = await api.signIn("advisor").get("/api/v1/jobs/job-42/closure-readiness?branchId=branch-delhi");
  assert.equal(result.status, 200);
  assert.equal(result.body.ready, false);
  assert.deepEqual(result.body.blockers.map((item: any) => item.code), ["WORK_INCOMPLETE", "QC_NOT_PASSED", "MATERIAL_NOT_RECONCILED", "BILLING_NOT_FINALIZED", "PAYMENT_OR_CREDIT_NOT_SATISFIED", "INCIDENT_UNRESOLVED", "DELIVERY_EVIDENCE_MISSING", "GATE_PASS_MISSING"]);
  assert.ok(result.body.blockers.every((item: any) => typeof item.message === "string" && item.message.length > 10));
  assert.ok(result.body.blockers.every((item: any) => typeof item.nextAction === "string"));
});

test("a permitted closure override requires evidenced maker-checker approval and recent authentication", async () => {
  const api = makeApi({ ...ready, qcPassed: false }); const advisor = api.signIn("advisor");
  const requested = await advisor.post("/api/v1/jobs/job-42/closure-overrides", {
    branchId: "branch-delhi", blockerCodes: ["QC_NOT_PASSED"], reason: "Emergency medical evacuation requested by customer",
    evidenceRef: "private/tenant-north/branch-delhi/closure/emergency-authority.pdf",
  }, { idempotencyKey: "override-request", ifMatch: 7, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(requested.status, 201);
  assert.equal(requested.body.override.status, "APPROVAL_PENDING");

  const makerCannotCheck = await advisor.post(`/api/v1/closure-overrides/${requested.body.override.id}/approve`, { branchId: "branch-delhi" }, { idempotencyKey: "override-self", ifMatch: 1, now: "2026-09-11T12:01:00.000Z" });
  assert.equal(makerCannotCheck.status, 403);

  const approved = await api.signIn("manager").post(`/api/v1/closure-overrides/${requested.body.override.id}/approve`, { branchId: "branch-delhi" }, { idempotencyKey: "override-approve", ifMatch: 1, now: "2026-09-11T12:01:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.override.makerMembershipId, "membership-advisor");
  assert.equal(approved.body.override.checkerMembershipId, "membership-manager");
  assert.equal(approved.body.override.authenticationContext.recentReauthenticatedAt, "2026-09-11T11:58:00.000Z");
  assert.match(approved.body.auditReference, /^audit-/);

  const readiness = await advisor.get("/api/v1/jobs/job-42/closure-readiness?branchId=branch-delhi");
  assert.equal(readiness.body.blockers.some((item: any) => item.code === "QC_NOT_PASSED"), false);
  assert.deepEqual(readiness.body.overrides[0].blockerCodes, ["QC_NOT_PASSED"]);
});

test("versioned private document artifacts provide narrow expiring and revocable QR verification", async () => {
  const api = makeApi();
  const advisor = api.signIn("advisor");
  for (const documentType of ["ESTIMATE", "JOB_CARD", "MATERIAL_DOCUMENT", "INVOICE", "RECEIPT", "GATE_PASS"]) {
    const rendered = await advisor.post("/api/v1/documents/render", {
      branchId: "branch-delhi", documentType, sourceId: `${documentType.toLowerCase()}-42`,
      formats: ["PDF_A4", "THERMAL"], qrExpiresAt: "2026-09-12T12:00:00.000Z",
    }, { idempotencyKey: `render-${documentType}`, now: "2026-09-11T12:00:00.000Z" });
    assert.equal(rendered.status, 201);
    assert.equal(rendered.body.document.templateVersion > 0, true);
    assert.deepEqual(rendered.body.document.artifacts.map((item: any) => item.format), ["PDF_A4", "THERMAL"]);
    assert.ok(rendered.body.document.artifacts.every((item: any) => item.privateObjectRef.startsWith("private/tenant-north/branch-delhi/documents/")));
    assert.equal(rendered.body.document.renderer, "INERT_LOCAL_RENDER_BOUNDARY");
    assert.equal(rendered.body.document.externalSideEffect, false);
  }

  const rendered = await advisor.post("/api/v1/documents/render", { branchId: "branch-delhi", documentType: "INVOICE", sourceId: "invoice-42", formats: ["PDF_A4"], qrExpiresAt: "2026-09-12T12:00:00.000Z" }, { idempotencyKey: "render-invoice-verification", now: "2026-09-11T12:00:00.000Z" });
  const token = rendered.body.qrToken;
  assert.ok(token.length >= 32);
  const verified = await api.public.get(`/api/v1/public/document-verification/${token}`, { now: "2026-09-11T13:00:00.000Z" });
  assert.deepEqual(verified, { status: 200, body: { documentType: "INVOICE", reference: rendered.body.document.reference, status: "VALID", validUntil: "2026-09-12T12:00:00.000Z" } });
  assert.equal(JSON.stringify(verified.body).includes("tenant-north"), false);
  assert.equal(JSON.stringify(verified.body).includes("invoice-42"), false);

  const revoked = await advisor.post(`/api/v1/documents/${rendered.body.document.id}/qr/revoke`, { branchId: "branch-delhi", reason: "Superseded verification reference" }, { idempotencyKey: "revoke-qr", ifMatch: 1, now: "2026-09-11T13:05:00.000Z" });
  assert.equal(revoked.status, 200);
  const afterRevoke = await api.public.get(`/api/v1/public/document-verification/${token}`, { now: "2026-09-11T13:06:00.000Z" });
  assert.deepEqual(afterRevoke, { status: 410, body: { code: "VERIFICATION_UNAVAILABLE" } });
});

const deliveryBody = {
  branchId: "branch-delhi", finalOdometerKm: 45890, deliveredByMembershipId: "membership-advisor",
  deliveredTo: { name: "Asha Singh", identityType: "DRIVING_LICENCE", identityLast4: "7742" },
  acknowledgement: "Vehicle condition and documents accepted",
  evidence: [
    { kind: "SIGNATURE", privateObjectRef: "private/tenant-north/branch-delhi/delivery/signature.png", checksum: "a".repeat(64), scanStatus: "CLEAN" },
    { kind: "PHOTO", privateObjectRef: "private/tenant-north/branch-delhi/delivery/handover.jpg", checksum: "b".repeat(64), scanStatus: "CLEAN" },
  ],
  exceptions: [],
};

test("complete private delivery evidence permits an atomically numbered, time-bounded gate pass only when upstream controls are ready", async () => {
  const api = makeApi();
  const advisor = api.signIn("advisor");
  const premature = await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:00:00.000Z" }, { idempotencyKey: "gate-too-soon", ifMatch: 7, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(premature.status, 409);
  assert.equal(premature.body.code, "CLOSURE_NOT_READY");
  assert.deepEqual(premature.body.blockers.map((item: any) => item.code), ["DELIVERY_EVIDENCE_MISSING"]);

  const delivery = await advisor.post("/api/v1/jobs/job-42/delivery-evidence", deliveryBody, { idempotencyKey: "delivery-42", ifMatch: 7, now: "2026-09-11T12:00:00.000Z" });
  assert.equal(delivery.status, 201);
  assert.equal(delivery.body.delivery.deliveredTo.identityLast4, "7742");
  assert.equal(delivery.body.delivery.evidence.length, 2);
  assert.equal(delivery.body.resourceVersion, 8);

  const issued = await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:00:00.000Z", releaseConditions: ["Match registration and vehicle"] }, { idempotencyKey: "gate-42", ifMatch: 8, now: "2026-09-11T12:05:00.000Z" });
  assert.equal(issued.status, 201);
  assert.match(issued.body.gatePass.documentNumber, /^GP\/2026-27\/\d{6}$/);
  assert.equal(issued.body.gatePass.registrationNumber, "DL01AB1234");
  assert.equal(issued.body.gatePass.status, "ISSUED");
  assert.equal(issued.body.resourceVersion, 9);

  const replay = await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:00:00.000Z", releaseConditions: ["Match registration and vehicle"] }, { idempotencyKey: "gate-42", ifMatch: 8, now: "2026-09-11T12:05:00.000Z" });
  assert.equal(replay.status, 201);
  assert.equal(replay.body.gatePass.documentNumber, issued.body.gatePass.documentNumber);

  const duplicate = await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:30:00.000Z", releaseConditions: ["Match registration and vehicle"] }, { idempotencyKey: "gate-42-duplicate", ifMatch: 9, now: "2026-09-11T12:06:00.000Z" });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.code, "GATE_PASS_ALREADY_ISSUED");
  assert.equal(api.inspect().gatePasses.length, 1);
});

test("Gate independently verifies live pass and vehicle identity, then atomically closes the journey without reopening finance", async () => {
  const api = makeApi(); const advisor = api.signIn("advisor");
  await advisor.post("/api/v1/jobs/job-42/delivery-evidence", deliveryBody, { idempotencyKey: "delivery-release", ifMatch: 7, now: "2026-09-11T12:00:00.000Z" });
  const issued = await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:00:00.000Z", releaseConditions: ["Match registration and vehicle"] }, { idempotencyKey: "gate-release", ifMatch: 8, now: "2026-09-11T12:05:00.000Z" });
  const pass = issued.body.gatePass;

  const advisorBypass = await advisor.post(`/api/v1/gate-passes/${pass.id}/release`, { branchId: "branch-delhi", registrationNumber: "DL01AB1234", vehicleId: "vehicle-42", verificationMode: "MANUAL", reason: "Looks correct" }, { idempotencyKey: "advisor-release", ifMatch: 1, now: "2026-09-11T12:10:00.000Z" });
  assert.equal(advisorBypass.status, 403);

  const mismatch = await api.signIn("gate").post(`/api/v1/gate-passes/${pass.id}/release`, { branchId: "branch-delhi", registrationNumber: "DL01ZZ9999", vehicleId: "vehicle-42", verificationMode: "HARDWARE_SCANNER", scanEvidence: "scanner:gate-1" }, { idempotencyKey: "mismatch-release", ifMatch: 1, now: "2026-09-11T12:10:00.000Z" });
  assert.equal(mismatch.status, 409);
  assert.equal(mismatch.body.code, "VEHICLE_IDENTITY_MISMATCH");

  const released = await api.signIn("gate").post(`/api/v1/gate-passes/${pass.id}/release`, { branchId: "branch-delhi", registrationNumber: "DL01AB1234", vehicleId: "vehicle-42", verificationMode: "HARDWARE_SCANNER", scanEvidence: "scanner:gate-1" }, { idempotencyKey: "valid-release", ifMatch: 1, now: "2026-09-11T12:10:00.000Z" });
  assert.equal(released.status, 200);
  assert.equal(released.body.gatePass.status, "RELEASED");
  assert.equal(released.body.job.operationalStatus, "DELIVERED");
  assert.equal(released.body.job.financialRecordStatus, "CLOSED");
  assert.equal(released.body.release.verifiedByMembershipId, "membership-gate");
  assert.equal(released.body.release.issuedByMembershipId, "membership-advisor");

  const again = await api.signIn("gate").post(`/api/v1/gate-passes/${pass.id}/release`, { branchId: "branch-delhi", registrationNumber: "DL01AB1234", vehicleId: "vehicle-42", verificationMode: "HARDWARE_SCANNER", scanEvidence: "scanner:gate-1" }, { idempotencyKey: "second-release", ifMatch: 2, now: "2026-09-11T12:11:00.000Z" });
  assert.equal(again.status, 409);
  assert.equal(again.body.code, "JOURNEY_ALREADY_DELIVERED");
  assert.equal(api.inspect().closureHistory.length, 1);
});

test("closure readiness reports an expired gate pass instead of treating it as valid", async () => {
  const api = makeApi(); const advisor = api.signIn("advisor");
  await advisor.post("/api/v1/jobs/job-42/delivery-evidence", deliveryBody, { idempotencyKey: "delivery-expiry", ifMatch: 7, now: "2026-09-11T12:00:00.000Z" });
  await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T12:10:00.000Z", releaseConditions: ["Match registration and vehicle"] }, { idempotencyKey: "gate-expiry", ifMatch: 8, now: "2026-09-11T12:05:00.000Z" });
  const readiness = await advisor.get("/api/v1/jobs/job-42/closure-readiness?branchId=branch-delhi", { now: "2026-09-11T12:11:00.000Z" });
  assert.equal(readiness.body.ready, false);
  assert.deepEqual(readiness.body.blockers.map((item: any) => item.code), ["GATE_PASS_EXPIRED"]);

  const replacement = await advisor.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:00:00.000Z", releaseConditions: ["Match registration and vehicle"] }, { idempotencyKey: "gate-expiry-replacement", ifMatch: 9, now: "2026-09-11T12:11:00.000Z" });
  assert.equal(replacement.status, 201);
  assert.equal(replacement.body.gatePass.documentNumber, "GP/2026-27/000002");
  assert.deepEqual(api.inspect().gatePasses.map((pass: any) => pass.status), ["EXPIRED", "ISSUED"]);
});

test("migration 021 enforces scoped RLS, append-only release evidence, atomic fiscal numbering, and private QR controls", async () => {
  const sql = await readFile(new URL("../db/migrations/021_delivery_gate.sql", import.meta.url), "utf8");
  for (const table of ["delivery_evidence", "closure_override", "rendered_document", "document_qr_token", "gate_pass", "gate_release", "delivery_command_receipt"]) {
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(sql, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(sql, /tenant_id = workshopos\.current_tenant_id\(\)/i);
  assert.match(sql, /branch_id = ANY\(workshopos\.authorized_branch_ids\(\)\)/i);
  assert.match(sql, /allocate_gate_pass_number/i);
  assert.match(sql, /release_gate_pass_atomically/i);
  assert.match(sql, /FOR UPDATE/i);
  assert.match(sql, /UNIQUE \(tenant_id, branch_id, document_type, financial_year, allocated_number\)/i);
  assert.match(sql, /CREATE UNIQUE INDEX one_issued_gate_pass_per_job[\s\S]*WHERE status = 'ISSUED'/i);
  assert.match(sql, /token_digest char\(64\)/i);
  assert.doesNotMatch(sql, /\bqr_token\s+text/i);
  assert.match(sql, /private_object_ref/i);
  assert.match(sql, /append-only/i);
  assert.match(sql, /payload_fingerprint/i);
  assert.match(sql, /resource_version/i);
});

test("combined permissions never allow a gate-pass issuer to verify their own release", async () => {
  const api = makeApi(); const combined = api.signIn("combined");
  await combined.post("/api/v1/jobs/job-42/delivery-evidence", { ...deliveryBody, deliveredByMembershipId: "membership-combined" }, { idempotencyKey: "combined-delivery", ifMatch: 7, now: "2026-09-11T12:00:00.000Z" });
  const issued = await combined.post("/api/v1/jobs/job-42/gate-passes", { branchId: "branch-delhi", validUntil: "2026-09-11T13:00:00.000Z", releaseConditions: ["Independent verification"] }, { idempotencyKey: "combined-pass", ifMatch: 8, now: "2026-09-11T12:05:00.000Z" });
  const selfRelease = await combined.post(`/api/v1/gate-passes/${issued.body.gatePass.id}/release`, { branchId: "branch-delhi", registrationNumber: "DL01AB1234", vehicleId: "vehicle-42", verificationMode: "HARDWARE_SCANNER", scanEvidence: "scanner:combined" }, { idempotencyKey: "combined-self-release", ifMatch: 1, now: "2026-09-11T12:10:00.000Z" });
  assert.equal(selfRelease.status, 409);
  assert.equal(selfRelease.body.code, "INDEPENDENT_GATE_VERIFICATION_REQUIRED");
});
