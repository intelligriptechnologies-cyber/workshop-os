import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalExperienceAssuranceHarness } from "../src/experience-assurance.js";

test("critical role flows pass deterministic WCAG browser-contract checks only when every required control is present", () => {
  const harness = createLocalExperienceAssuranceHarness();
  const report = harness.accessibility.evaluate([
    { flow: "RECEPTION_CHECK_IN", keyboard: true, visibleFocus: true, labelledControls: true, linkedErrors: true,
      minimumTargetPx: 44, reflowsAtCssPixels: 320, contrastTextRatio: 4.5, contrastLargeTextRatio: 3 },
    { flow: "TECHNICIAN_TASK", keyboard: true, visibleFocus: true, labelledControls: true, linkedErrors: true,
      minimumTargetPx: 48, reflowsAtCssPixels: 320, contrastTextRatio: 7, contrastLargeTextRatio: 4.5 },
    { flow: "CUSTOMER_APPROVAL", keyboard: true, visibleFocus: true, labelledControls: true, linkedErrors: true,
      minimumTargetPx: 44, reflowsAtCssPixels: 320, contrastTextRatio: 4.5, contrastLargeTextRatio: 3 },
    { flow: "GATE_VERIFICATION", keyboard: true, visibleFocus: true, labelledControls: true, linkedErrors: true,
      minimumTargetPx: 44, reflowsAtCssPixels: 320, contrastTextRatio: 4.5, contrastLargeTextRatio: 3 },
  ]);

  assert.deepEqual(report, {
    status: "AUTOMATED_CONTRACT_PASSED",
    checkedFlows: ["RECEPTION_CHECK_IN", "TECHNICIAN_TASK", "CUSTOMER_APPROVAL", "GATE_VERIFICATION"],
    failures: [], evidenceClass: "LOCAL_DETERMINISTIC_BROWSER_CONTRACT", provesWcag22Aa: false,
  });
});

test("accessibility automation identifies missing flows and each deterministic AA control failure", () => {
  const harness = createLocalExperienceAssuranceHarness();
  const report = harness.accessibility.evaluate([{ flow: "TECHNICIAN_TASK", keyboard: false, visibleFocus: false,
    labelledControls: false, linkedErrors: false, minimumTargetPx: 43, reflowsAtCssPixels: 321,
    contrastTextRatio: 4.49, contrastLargeTextRatio: 2.99 }]);

  assert.deepEqual(report.failures, [
    "RECEPTION_CHECK_IN:MISSING", "TECHNICIAN_TASK:KEYBOARD", "TECHNICIAN_TASK:FOCUS", "TECHNICIAN_TASK:LABELS",
    "TECHNICIAN_TASK:ERRORS", "TECHNICIAN_TASK:TARGET_SIZE", "TECHNICIAN_TASK:REFLOW", "TECHNICIAN_TASK:CONTRAST",
    "CUSTOMER_APPROVAL:MISSING", "GATE_VERIFICATION:MISSING",
  ]);
  assert.equal(report.status, "AUTOMATED_CONTRACT_FAILED");
  assert.equal(report.provesWcag22Aa, false);
});

test("versioned operational documents render A4, thermal and PDF snapshots with narrow expiring QR verification", () => {
  const harness = createLocalExperienceAssuranceHarness();
  const issued = harness.documents.issue({ tenantId: "tenant-a", branchId: "branch-a", documentType: "GATE_PASS",
    documentId: "gate-42", documentNumber: "GP/26/42", sourceVersion: 3, state: "ISSUED",
    customerName: "Sensitive Customer", amountMinor: "250000", issuedAt: "2026-09-12T10:00:00.000Z",
    qrExpiresAt: "2026-09-12T10:15:00.000Z" });

  assert.deepEqual(issued.formats, ["PDF", "A4", "THERMAL"]);
  assert.equal(issued.sourceVersion, 3);
  assert.ok(!issued.qrToken.includes("gate-42"));
  assert.deepEqual(harness.documents.verifyQr(issued.qrToken, {
    tenantId: "tenant-b", branchId: "branch-a", permission: "gate_pass.verify", purpose: "DOCUMENT_VERIFICATION", now: "2026-09-12T10:10:00.000Z",
  }), { status: 404, body: { code: "QR_NOT_FOUND" } });
  assert.deepEqual(harness.documents.verifyQr(issued.qrToken, {
    tenantId: "tenant-a", branchId: "branch-a", permission: "job.read", purpose: "DOCUMENT_VERIFICATION", now: "2026-09-12T10:10:00.000Z",
  }), { status: 403, body: { code: "QR_VERIFICATION_FORBIDDEN" } });
  assert.deepEqual(harness.documents.verifyQr(issued.qrToken, {
    tenantId: "tenant-a", branchId: "branch-a", permission: "gate_pass.verify", purpose: "CUSTOMER_APPROVAL", now: "2026-09-12T10:10:00.000Z",
  }), { status: 409, body: { code: "QR_PURPOSE_MISMATCH" } });
  assert.deepEqual(harness.documents.verifyQr(issued.qrToken, {
    tenantId: "tenant-a", branchId: "branch-a", permission: "gate_pass.verify", purpose: "DOCUMENT_VERIFICATION", now: "2026-09-12T10:10:00.000Z",
  }), { status: 200, body: { valid: true, documentType: "GATE_PASS", documentNumber: "GP/26/42", state: "ISSUED" } });
  assert.deepEqual(harness.documents.verifyQr(issued.qrToken, {
    tenantId: "tenant-a", branchId: "branch-a", permission: "gate_pass.verify", purpose: "DOCUMENT_VERIFICATION", now: "2026-09-12T10:11:00.000Z",
  }), { status: 409, body: { code: "QR_REPLAYED" } });

  const expired = harness.documents.issue({ tenantId: "tenant-a", branchId: "branch-a", documentType: "GATE_PASS",
    documentId: "gate-expired", documentNumber: "GP/26/OLD", sourceVersion: 1, state: "ISSUED", customerName: "Hidden",
    amountMinor: "0", issuedAt: "2026-09-12T09:00:00.000Z", qrExpiresAt: "2026-09-12T09:15:00.000Z" });
  assert.deepEqual(harness.documents.verifyQr(expired.qrToken, {
    tenantId: "tenant-a", branchId: "branch-a", permission: "gate_pass.verify", purpose: "DOCUMENT_VERIFICATION", now: "2026-09-12T10:16:00.000Z",
  }), { status: 410, body: { code: "QR_EXPIRED" } });

  assert.deepEqual(harness.documents.revokeQr(issued.qrToken, { tenantId: "tenant-a", branchId: "branch-a",
    permission: "document.qr.revoke", reason: "Gate pass replaced" }), { status: 200, body: { status: "REVOKED" } });
  assert.deepEqual(harness.documents.verifyQr(issued.qrToken, {
    tenantId: "tenant-a", branchId: "branch-a", permission: "gate_pass.verify", purpose: "DOCUMENT_VERIFICATION", now: "2026-09-12T10:11:00.000Z",
  }), { status: 410, body: { code: "QR_REVOKED" } });
});

test("supported client matrix requires core flows and a safe scan path with camera, hardware and manual fallbacks", () => {
  const harness = createLocalExperienceAssuranceHarness();
  const report = harness.clients.evaluate([
    { client: "ANDROID_CHROME_PWA", release: "CURRENT", coreFlowsPassed: true, camera: true, hardwareScanner: true, manualFallback: true },
    { client: "DESKTOP_CHROME", release: "CURRENT", coreFlowsPassed: true, camera: true, hardwareScanner: true, manualFallback: true },
    { client: "DESKTOP_EDGE", release: "CURRENT", coreFlowsPassed: true, camera: true, hardwareScanner: true, manualFallback: true },
    { client: "IOS_SAFARI", release: "CURRENT", coreFlowsPassed: true, camera: true, hardwareScanner: false, manualFallback: true },
  ]);

  assert.deepEqual(report, { status: "AUTOMATED_MATRIX_PASSED", failures: [],
    evidenceClass: "LOCAL_DETERMINISTIC_CLIENT_CONTRACT", provesCurrentRealDevices: false });

  const unsafe = harness.clients.evaluate([
    { client: "ANDROID_CHROME_PWA", release: "CURRENT", coreFlowsPassed: true, camera: false, hardwareScanner: false, manualFallback: false },
  ]);
  assert.ok(unsafe.failures.includes("ANDROID_CHROME_PWA:NO_SAFE_SCAN_PATH"));
  assert.ok(unsafe.failures.includes("DESKTOP_CHROME:MISSING"));
  assert.equal(unsafe.status, "AUTOMATED_MATRIX_FAILED");
});

test("staff-usability evaluation enforces representative roles, two-hour training cap, 90 percent unaided success and zero critical errors", () => {
  const harness = createLocalExperienceAssuranceHarness();
  const roles = ["RECEPTION", "SERVICE_ADVISOR", "TECHNICIAN", "STORE", "ACCOUNTS", "GATE"] as const;
  const passing = harness.usability.evaluate(Array.from({ length: 10 }, (_, index) => ({
    participantId: `participant-${index + 1}`, role: roles[index % roles.length], trainingMinutes: 120,
    criticalScenarioCompletedUnaided: index < 9, criticalControlErrors: 0,
  })));
  assert.deepEqual(passing, { status: "LOCAL_METHOD_PASSED", participantCount: 10, successPercent: 90,
    criticalControlErrors: 0, missingRoles: [], evidenceClass: "LOCAL_DETERMINISTIC_USABILITY_CALCULATION",
    provesRepresentativeStaffResults: false });

  const failed = harness.usability.evaluate([{ participantId: "one", role: "TECHNICIAN", trainingMinutes: 121,
    criticalScenarioCompletedUnaided: true, criticalControlErrors: 1 }]);
  assert.equal(failed.status, "LOCAL_METHOD_FAILED");
  assert.ok(failed.failures.includes("TRAINING_EXCEEDS_120_MINUTES"));
  assert.ok(failed.failures.includes("CRITICAL_CONTROL_ERRORS_PRESENT"));
  assert.ok(failed.missingRoles.includes("RECEPTION"));
});

test("release remains blocked without authorized manual accessibility, real-device, rendered-printer and representative-staff evidence", () => {
  const harness = createLocalExperienceAssuranceHarness();
  const decision = harness.release.evaluate({ automatedAccessibilityPassed: true, automatedClientMatrixPassed: true,
    automatedDocumentAndScanPassed: true, localUsabilityMethodPassed: true,
    manualAssistiveTechnologyEvidence: null, realCurrentDeviceBrowserEvidence: null,
    renderedPrinterEvidence: null, representativeStaffUsabilityEvidence: null });

  assert.deepEqual(decision, { status: "BLOCKED", missing: [
    "AUTHORIZED_MANUAL_ASSISTIVE_TECH_REVIEW", "REAL_CURRENT_DEVICE_BROWSER_TESTS",
    "RENDERED_A4_THERMAL_PRINTER_VERIFICATION", "REPRESENTATIVE_TRAINED_STAFF_USABILITY_RESULTS",
  ] });

  const automatedCannotSubstitute = harness.release.evaluate({ automatedAccessibilityPassed: true,
    automatedClientMatrixPassed: true, automatedDocumentAndScanPassed: true, localUsabilityMethodPassed: true,
    manualAssistiveTechnologyEvidence: { evidenceClass: "AUTOMATED", artifactReference: "local:a11y" },
    realCurrentDeviceBrowserEvidence: { evidenceClass: "AUTOMATED", artifactReference: "local:browser" },
    renderedPrinterEvidence: { evidenceClass: "AUTOMATED", artifactReference: "local:printer" },
    representativeStaffUsabilityEvidence: { evidenceClass: "AUTOMATED", artifactReference: "local:usability" },
  });
  assert.deepEqual(automatedCannotSubstitute, decision);
});

test("experience evidence storage is tenant scoped, append only and distinguishes automated from authorized external evidence", async () => {
  const migration = await readFile(new URL("../db/migrations/027_experience_assurance.sql", import.meta.url), "utf8");
  for (const table of ["accessibility_evidence", "client_device_evidence", "rendered_document_evidence", "usability_study", "usability_result", "experience_release_evaluation"]) {
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(migration, /evidence_class[^;]+AUTOMATED[^;]+AUTHORIZED_EXTERNAL/is);
  assert.match(migration, /training_minutes BETWEEN 0 AND 120/i);
  assert.match(migration, /critical_control_errors >= 0/i);
  assert.match(migration, /FOREIGN KEY \(tenant_id, branch_id, study_id\) REFERENCES workshopos\.usability_study \(tenant_id, branch_id, id\)/i);
  assert.match(migration, /prevent_experience_evidence_mutation/i);
  assert.match(migration, /BEFORE UPDATE OR DELETE ON workshopos\.usability_result/i);
});
