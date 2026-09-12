import { createHash } from "node:crypto";

export type CriticalFlow = "RECEPTION_CHECK_IN" | "TECHNICIAN_TASK" | "CUSTOMER_APPROVAL" | "GATE_VERIFICATION";
type DocumentType = "ESTIMATE" | "JOB_CARD" | "MATERIAL_DOCUMENT" | "INVOICE" | "RECEIPT" | "GATE_PASS";
type SupportedClient = "ANDROID_CHROME_PWA" | "DESKTOP_CHROME" | "DESKTOP_EDGE" | "IOS_SAFARI";
type StaffRole = "RECEPTION" | "SERVICE_ADVISOR" | "TECHNICIAN" | "STORE" | "ACCOUNTS" | "GATE";
type ExternalEvidence = { evidenceClass: "AUTOMATED" | "AUTHORIZED_EXTERNAL"; artifactReference: string; authorizedBy?: string };

type AccessibilityObservation = {
  flow: CriticalFlow;
  keyboard: boolean;
  visibleFocus: boolean;
  labelledControls: boolean;
  linkedErrors: boolean;
  minimumTargetPx: number;
  reflowsAtCssPixels: number;
  contrastTextRatio: number;
  contrastLargeTextRatio: number;
};

const REQUIRED_FLOWS: CriticalFlow[] = ["RECEPTION_CHECK_IN", "TECHNICIAN_TASK", "CUSTOMER_APPROVAL", "GATE_VERIFICATION"];

export function createLocalExperienceAssuranceHarness() {
  const documents = new Map<string, {
    tenantId: string; branchId: string; documentType: DocumentType; documentNumber: string; sourceVersion: number;
    state: string; qrExpiresAt: string; revoked: boolean; consumed: boolean;
  }>();
  let documentSequence = 0;
  return {
    accessibility: {
      evaluate(observations: AccessibilityObservation[]) {
        const failures: string[] = [];
        for (const flow of REQUIRED_FLOWS) {
          const observation = observations.find((candidate) => candidate.flow === flow);
          if (!observation) { failures.push(`${flow}:MISSING`); continue; }
          if (!observation.keyboard) failures.push(`${flow}:KEYBOARD`);
          if (!observation.visibleFocus) failures.push(`${flow}:FOCUS`);
          if (!observation.labelledControls) failures.push(`${flow}:LABELS`);
          if (!observation.linkedErrors) failures.push(`${flow}:ERRORS`);
          if (observation.minimumTargetPx < 44) failures.push(`${flow}:TARGET_SIZE`);
          if (observation.reflowsAtCssPixels > 320) failures.push(`${flow}:REFLOW`);
          if (observation.contrastTextRatio < 4.5 || observation.contrastLargeTextRatio < 3) failures.push(`${flow}:CONTRAST`);
        }
        return {
          status: failures.length ? "AUTOMATED_CONTRACT_FAILED" as const : "AUTOMATED_CONTRACT_PASSED" as const,
          checkedFlows: observations.map((observation) => observation.flow), failures,
          evidenceClass: "LOCAL_DETERMINISTIC_BROWSER_CONTRACT" as const,
          provesWcag22Aa: false,
        };
      },
    },
    documents: {
      issue(input: { tenantId: string; branchId: string; documentType: DocumentType; documentId: string;
        documentNumber: string; sourceVersion: number; state: string; customerName: string; amountMinor: string;
        issuedAt: string; qrExpiresAt: string }) {
        const qrToken = createHash("sha256").update(`${input.tenantId}:${input.documentId}:${input.sourceVersion}:${++documentSequence}`).digest("hex");
        documents.set(qrToken, { tenantId: input.tenantId, branchId: input.branchId, documentType: input.documentType,
          documentNumber: input.documentNumber, sourceVersion: input.sourceVersion, state: input.state,
          qrExpiresAt: input.qrExpiresAt, revoked: false, consumed: false });
        return { formats: ["PDF", "A4", "THERMAL"] as const, sourceVersion: input.sourceVersion, qrToken };
      },
      verifyQr(qrToken: string, context: { tenantId: string; branchId: string; permission: string; purpose: string; now: string }) {
        const document = documents.get(qrToken);
        if (!document || document.tenantId !== context.tenantId || document.branchId !== context.branchId) {
          return { status: 404 as const, body: { code: "QR_NOT_FOUND" } };
        }
        if (context.permission !== "gate_pass.verify") return { status: 403 as const, body: { code: "QR_VERIFICATION_FORBIDDEN" } };
        if (document.revoked) return { status: 410 as const, body: { code: "QR_REVOKED" } };
        if (context.purpose !== "DOCUMENT_VERIFICATION") return { status: 409 as const, body: { code: "QR_PURPOSE_MISMATCH" } };
        if (Date.parse(context.now) >= Date.parse(document.qrExpiresAt)) return { status: 410 as const, body: { code: "QR_EXPIRED" } };
        if (document.consumed) return { status: 409 as const, body: { code: "QR_REPLAYED" } };
        document.consumed = true;
        return { status: 200 as const, body: { valid: true as const, documentType: document.documentType,
          documentNumber: document.documentNumber, state: document.state } };
      },
      revokeQr(qrToken: string, context: { tenantId: string; branchId: string; permission: string; reason: string }) {
        const document = documents.get(qrToken);
        if (!document || document.tenantId !== context.tenantId || document.branchId !== context.branchId) {
          return { status: 404 as const, body: { code: "QR_NOT_FOUND" } };
        }
        if (context.permission !== "document.qr.revoke") return { status: 403 as const, body: { code: "QR_REVOCATION_FORBIDDEN" } };
        if (!context.reason.trim()) return { status: 422 as const, body: { code: "REVOCATION_REASON_REQUIRED" } };
        document.revoked = true;
        return { status: 200 as const, body: { status: "REVOKED" as const } };
      },
    },
    clients: {
      evaluate(observations: Array<{ client: SupportedClient; release: "CURRENT"; coreFlowsPassed: boolean;
        camera: boolean; hardwareScanner: boolean; manualFallback: boolean }>) {
        const failures: string[] = [];
        for (const client of (["ANDROID_CHROME_PWA", "DESKTOP_CHROME", "DESKTOP_EDGE", "IOS_SAFARI"] as SupportedClient[])) {
          const observation = observations.find((candidate) => candidate.client === client);
          if (!observation) { failures.push(`${client}:MISSING`); continue; }
          if (!observation.coreFlowsPassed) failures.push(`${client}:CORE_FLOWS`);
          if (!observation.manualFallback || (!observation.camera && !observation.hardwareScanner)) failures.push(`${client}:NO_SAFE_SCAN_PATH`);
          if (client !== "IOS_SAFARI" && !observation.camera) failures.push(`${client}:CAMERA`);
          if (client !== "IOS_SAFARI" && !observation.hardwareScanner) failures.push(`${client}:HARDWARE_SCANNER`);
        }
        return { status: failures.length ? "AUTOMATED_MATRIX_FAILED" as const : "AUTOMATED_MATRIX_PASSED" as const,
          failures, evidenceClass: "LOCAL_DETERMINISTIC_CLIENT_CONTRACT" as const, provesCurrentRealDevices: false };
      },
    },
    usability: {
      evaluate(results: Array<{ participantId: string; role: StaffRole; trainingMinutes: number;
        criticalScenarioCompletedUnaided: boolean; criticalControlErrors: number }>) {
        const requiredRoles: StaffRole[] = ["RECEPTION", "SERVICE_ADVISOR", "TECHNICIAN", "STORE", "ACCOUNTS", "GATE"];
        const missingRoles = requiredRoles.filter((role) => !results.some((result) => result.role === role));
        const participantCount = results.length;
        const successPercent = participantCount === 0 ? 0 : Number(((results.filter((result) => result.criticalScenarioCompletedUnaided).length / participantCount) * 100).toFixed(2));
        const criticalControlErrors = results.reduce((total, result) => total + result.criticalControlErrors, 0);
        const failures: string[] = [];
        if (results.some((result) => result.trainingMinutes > 120)) failures.push("TRAINING_EXCEEDS_120_MINUTES");
        if (successPercent < 90) failures.push("UNAIDED_SUCCESS_BELOW_90_PERCENT");
        if (criticalControlErrors > 0) failures.push("CRITICAL_CONTROL_ERRORS_PRESENT");
        if (missingRoles.length > 0) failures.push("REPRESENTATIVE_ROLES_MISSING");
        const common = { participantCount, successPercent, criticalControlErrors, missingRoles,
          evidenceClass: "LOCAL_DETERMINISTIC_USABILITY_CALCULATION" as const, provesRepresentativeStaffResults: false };
        return failures.length > 0
          ? { status: "LOCAL_METHOD_FAILED" as const, ...common, failures }
          : { status: "LOCAL_METHOD_PASSED" as const, ...common };
      },
    },
    release: {
      evaluate(input: { automatedAccessibilityPassed: boolean; automatedClientMatrixPassed: boolean;
        automatedDocumentAndScanPassed: boolean; localUsabilityMethodPassed: boolean;
        manualAssistiveTechnologyEvidence: ExternalEvidence | null; realCurrentDeviceBrowserEvidence: ExternalEvidence | null;
        renderedPrinterEvidence: ExternalEvidence | null; representativeStaffUsabilityEvidence: ExternalEvidence | null }) {
        const missing: string[] = [];
        const validExternal = (evidence: ExternalEvidence | null) => evidence?.evidenceClass === "AUTHORIZED_EXTERNAL"
          && Boolean(evidence.artifactReference.trim()) && Boolean(evidence.authorizedBy?.trim());
        if (!input.automatedAccessibilityPassed) missing.push("AUTOMATED_ACCESSIBILITY_CONTRACT");
        if (!input.automatedClientMatrixPassed) missing.push("AUTOMATED_CLIENT_MATRIX");
        if (!input.automatedDocumentAndScanPassed) missing.push("AUTOMATED_DOCUMENT_AND_SCAN_CONTRACT");
        if (!input.localUsabilityMethodPassed) missing.push("LOCAL_USABILITY_METHOD");
        if (!validExternal(input.manualAssistiveTechnologyEvidence)) missing.push("AUTHORIZED_MANUAL_ASSISTIVE_TECH_REVIEW");
        if (!validExternal(input.realCurrentDeviceBrowserEvidence)) missing.push("REAL_CURRENT_DEVICE_BROWSER_TESTS");
        if (!validExternal(input.renderedPrinterEvidence)) missing.push("RENDERED_A4_THERMAL_PRINTER_VERIFICATION");
        if (!validExternal(input.representativeStaffUsabilityEvidence)) missing.push("REPRESENTATIVE_TRAINED_STAFF_USABILITY_RESULTS");
        return missing.length ? { status: "BLOCKED" as const, missing } : { status: "EVIDENCE_COMPLETE" as const, missing };
      },
    },
  };
}
