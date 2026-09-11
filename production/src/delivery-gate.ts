import { createHash, randomBytes } from "node:crypto";

export type DeliveryMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  roles: string[];
  permissions: string[];
  recentReauthenticatedAt?: string;
};

type ApiResponse = { status: number; body: Record<string, any> };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string };
type Readiness = {
  workComplete: boolean;
  qcPassed: boolean;
  materialReconciled: boolean;
  billingFinalized: boolean;
  paymentOrCreditSatisfied: boolean;
  incidentsResolved: boolean;
};
type JobInput = {
  tenantId: string; branchId: string; jobId: string; visitId: string; vehicleId: string;
  registrationNumber: string; financialRecordStatus: string; resourceVersion: number; readiness: Readiness;
  operationalStatus?: string; deliveredAt?: string;
};
type TemplateInput = { tenantId: string; documentType: string; version: number };

const blockerDefinitions: Array<[keyof Readiness, string, string, string]> = [
  ["workComplete", "WORK_INCOMPLETE", "Workshop work is not complete.", "Complete all approved work."],
  ["qcPassed", "QC_NOT_PASSED", "Independent quality check has not passed.", "Complete and pass independent QC."],
  ["materialReconciled", "MATERIAL_NOT_RECONCILED", "Job materials are not reconciled.", "Reconcile issued, used, returned, and wasted material."],
  ["billingFinalized", "BILLING_NOT_FINALIZED", "Billing has not been finalized.", "Finalize billing for every payer."],
  ["paymentOrCreditSatisfied", "PAYMENT_OR_CREDIT_NOT_SATISFIED", "Payment or approved credit terms are not satisfied.", "Collect payment or approve formal credit."],
  ["incidentsResolved", "INCIDENT_UNRESOLVED", "A vehicle custody incident remains unresolved.", "Resolve or explicitly control every custody incident."],
];

export function createLocalDeliveryGateApi(input: {
  memberships: Record<string, DeliveryMembership>;
  jobs: JobInput[];
  documentTemplates: TemplateInput[];
  timezoneByTenant: Record<string, string>;
  overridePolicy: { allowedBlockerCodes: string[]; recentAuthenticationSeconds: number };
}) {
  const deliveries: Array<Record<string, any>> = [];
  const gatePasses: Array<Record<string, any>> = [];
  const documents: Array<Record<string, any>> = [];
  const qrVerifications: Array<Record<string, any>> = [];
  const closureHistory: Array<Record<string, any>> = [];
  const closureOverrides: Array<Record<string, any>> = [];
  const auditEvidence: Array<Record<string, any>> = [];
  const sequences = new Map<string, number>();
  const receipts = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const readinessFor = (job: JobInput, at?: string) => {
    const covered = new Set(closureOverrides.filter((item) => item.tenantId === job.tenantId && item.jobId === job.jobId && item.status === "APPROVED").flatMap((item) => item.blockerCodes));
    const blockers = blockerDefinitions.filter(([key, code]) => !job.readiness[key] && !covered.has(code)).map(([, code, message, nextAction]) => ({ code, message, nextAction }));
    if (!deliveries.some((item) => item.tenantId === job.tenantId && item.jobId === job.jobId)) blockers.push({ code: "DELIVERY_EVIDENCE_MISSING", message: "Delivery evidence has not been completed.", nextAction: "Record delivery identity, acknowledgement, odometer, and required evidence." });
    const gatePass = gatePasses.find((item) => item.tenantId === job.tenantId && item.jobId === job.jobId && item.status === "ISSUED");
    if (!gatePass) blockers.push({ code: "GATE_PASS_MISSING", message: "A valid gate pass has not been issued.", nextAction: "Issue a gate pass after all other controls pass." });
    else if (at && new Date(at).getTime() >= new Date(gatePass.validUntil).getTime()) blockers.push({ code: "GATE_PASS_EXPIRED", message: "The issued gate pass has expired.", nextAction: "Escalate for controlled gate-pass recovery; the expired number cannot be reused." });
    return blockers;
  };
  const authorize = (token: string, branchId: string, permission: string): DeliveryMembership | ApiResponse => {
    const membership = input.memberships[token];
    return membership && membership.branchIds.includes(branchId) && membership.permissions.includes(permission) ? membership : { status: 403, body: { code: "FORBIDDEN" } };
  };
  const command = (auth: DeliveryMembership, path: string, body: Record<string, any>, options: CommandOptions) => {
    if (!options.idempotencyKey) return { error: { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } } as ApiResponse };
    const key = `${auth.tenantId}:${options.idempotencyKey}`;
    const fingerprint = createHash("sha256").update(JSON.stringify({ path, body, ifMatch: options.ifMatch })).digest("hex");
    const prior = receipts.get(key);
    if (prior) return prior.fingerprint === fingerprint ? { replay: structuredClone(prior.response) } : { error: { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } } as ApiResponse };
    return { key, fingerprint };
  };
  const commit = (context: { key?: string; fingerprint?: string }, response: ApiResponse) => {
    receipts.set(context.key!, { fingerprint: context.fingerprint!, response: structuredClone(response) });
    return response;
  };
  const financialYearAt = (iso: string, timezone: string) => {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit" }).formatToParts(new Date(iso));
    const year = Number(parts.find((part) => part.type === "year")!.value);
    const month = Number(parts.find((part) => part.type === "month")!.value);
    const start = month >= 4 ? year : year - 1;
    return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
  };
  return {
    public: {
      async get(path: string, options: { now?: string } = {}): Promise<ApiResponse> {
        const match = path.match(/^\/api\/v1\/public\/document-verification\/([^/]+)$/);
        if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
        const tokenDigest = createHash("sha256").update(match[1]).digest("hex");
        const verification = qrVerifications.find((item) => item.tokenDigest === tokenDigest);
        const now = options.now ?? new Date().toISOString();
        if (!verification || verification.revokedAt || new Date(now).getTime() >= new Date(verification.expiresAt).getTime()) return { status: 410, body: { code: "VERIFICATION_UNAVAILABLE" } };
        return { status: 200, body: { documentType: verification.documentType, reference: verification.reference, status: "VALID", validUntil: verification.expiresAt } };
      },
    },
    signIn(token: string) {
      return {
        async get(path: string, options: { now?: string } = {}): Promise<ApiResponse> {
          const match = path.match(/^\/api\/v1\/jobs\/([^/]+)\/closure-readiness\?branchId=([^&]+)$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          const auth = authorize(token, match[2], "closure.view"); if ("status" in auth) return auth;
          const job = input.jobs.find((item) => item.tenantId === auth.tenantId && item.branchId === match[2] && item.jobId === match[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          const blockers = readinessFor(job, options.now ?? new Date().toISOString());
          const overrides = closureOverrides.filter((item) => item.tenantId === auth.tenantId && item.jobId === job.jobId && item.status === "APPROVED").map((item) => ({ id: item.id, blockerCodes: structuredClone(item.blockerCodes), reason: item.reason, evidenceRef: item.evidenceRef, checkerMembershipId: item.checkerMembershipId }));
          return { status: 200, body: { ready: blockers.length === 0, blockers, overrides, resourceVersion: job.resourceVersion } };
        },
        async post(path: string, body: Record<string, any>, options: CommandOptions = {}): Promise<ApiResponse> {
          const approveOverride = path.match(/^\/api\/v1\/closure-overrides\/([^/]+)\/approve$/);
          if (approveOverride) {
            const auth = authorize(token, body.branchId, "closure.override.approve"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const override = closureOverrides.find((item) => item.id === approveOverride[1] && item.tenantId === auth.tenantId && item.branchId === body.branchId);
            if (!override) return { status: 404, body: { code: "CLOSURE_OVERRIDE_NOT_FOUND" } };
            if (options.ifMatch !== override.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: override.resourceVersion } };
            if (override.makerMembershipId === auth.membershipId) return { status: 409, body: { code: "MAKER_CHECKER_SEPARATION_REQUIRED" } };
            if (override.status !== "APPROVAL_PENDING") return { status: 409, body: { code: "CLOSURE_OVERRIDE_NOT_PENDING" } };
            const now = options.now ?? new Date().toISOString();
            const authAge = auth.recentReauthenticatedAt ? new Date(now).getTime() - new Date(auth.recentReauthenticatedAt).getTime() : Infinity;
            if (authAge < 0 || authAge > input.overridePolicy.recentAuthenticationSeconds * 1000) return { status: 401, body: { code: "RECENT_REAUTHENTICATION_REQUIRED" } };
            override.status = "APPROVED"; override.checkerMembershipId = auth.membershipId; override.approvedAt = now; override.authenticationContext = { recentReauthenticatedAt: auth.recentReauthenticatedAt, maximumAgeSeconds: input.overridePolicy.recentAuthenticationSeconds }; override.resourceVersion += 1;
            const auditReference = `audit-closure-override-${override.id}`;
            auditEvidence.push({ auditReference, action: "CLOSURE_OVERRIDE_APPROVED", tenantId: auth.tenantId, branchId: body.branchId, jobId: override.jobId, makerMembershipId: override.makerMembershipId, checkerMembershipId: auth.membershipId, reason: override.reason, evidenceRef: override.evidenceRef, authenticationContext: structuredClone(override.authenticationContext), occurredAt: now });
            return commit(context, { status: 200, body: { override: structuredClone(override), resourceVersion: override.resourceVersion, auditReference } });
          }
          if (path === "/api/v1/documents/render") {
            const auth = authorize(token, body.branchId, "document.render"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const allowedTypes = ["ESTIMATE", "JOB_CARD", "MATERIAL_DOCUMENT", "INVOICE", "RECEIPT", "GATE_PASS"];
            const allowedFormats = ["PDF_A4", "THERMAL"];
            const template = input.documentTemplates.find((item) => item.tenantId === auth.tenantId && item.documentType === body.documentType);
            const now = options.now ?? new Date().toISOString();
            if (!template || !allowedTypes.includes(body.documentType) || typeof body.sourceId !== "string" || !body.sourceId.trim() || !Array.isArray(body.formats) || !body.formats.length || body.formats.some((format: string) => !allowedFormats.includes(format)) || !(new Date(body.qrExpiresAt).getTime() > new Date(now).getTime())) return { status: 422, body: { code: "INVALID_DOCUMENT_RENDER_REQUEST" } };
            const id = `document-${documents.length + 1}`; const reference = `DOC-${String(documents.length + 1).padStart(6, "0")}`;
            const document = { id, tenantId: auth.tenantId, branchId: body.branchId, documentType: body.documentType, sourceId: body.sourceId, reference, templateVersion: template.version, renderer: "INERT_LOCAL_RENDER_BOUNDARY", externalSideEffect: false, artifacts: body.formats.map((format: string) => ({ format, privateObjectRef: `private/${auth.tenantId}/${body.branchId}/documents/${id}/${format.toLowerCase()}.pdf`, checksum: createHash("sha256").update(`${id}:${format}:${template.version}`).digest("hex") })), renderedAt: now, resourceVersion: 1 };
            const qrToken = randomBytes(32).toString("base64url");
            documents.push(document); qrVerifications.push({ documentId: id, tenantId: auth.tenantId, branchId: body.branchId, tokenDigest: createHash("sha256").update(qrToken).digest("hex"), documentType: body.documentType, reference, expiresAt: body.qrExpiresAt });
            return commit(context, { status: 201, body: { document: structuredClone(document), qrToken, resourceVersion: 1, auditReference: `audit-${id}` } });
          }
          const revokeMatch = path.match(/^\/api\/v1\/documents\/([^/]+)\/qr\/revoke$/);
          if (revokeMatch) {
            const auth = authorize(token, body.branchId, "document.qr.revoke"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const document = documents.find((item) => item.id === revokeMatch[1] && item.tenantId === auth.tenantId && item.branchId === body.branchId);
            if (!document) return { status: 404, body: { code: "DOCUMENT_NOT_FOUND" } };
            if (options.ifMatch !== document.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: document.resourceVersion } };
            if (typeof body.reason !== "string" || !body.reason.trim()) return { status: 422, body: { code: "REVOCATION_REASON_REQUIRED" } };
            const verification = qrVerifications.find((item) => item.documentId === document.id)!;
            verification.revokedAt = options.now ?? new Date().toISOString(); verification.revokedByMembershipId = auth.membershipId; verification.reason = body.reason.trim(); document.resourceVersion += 1;
            return commit(context, { status: 200, body: { status: "REVOKED", resourceVersion: document.resourceVersion, auditReference: `audit-revoke-${document.id}` } });
          }
          const releaseMatch = path.match(/^\/api\/v1\/gate-passes\/([^/]+)\/release$/);
          if (releaseMatch) {
            const auth = authorize(token, body.branchId, "gate.verify"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const gatePass = gatePasses.find((item) => item.id === releaseMatch[1] && item.tenantId === auth.tenantId && item.branchId === body.branchId);
            if (!gatePass) return { status: 404, body: { code: "GATE_PASS_NOT_FOUND" } };
            if (options.ifMatch !== gatePass.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: gatePass.resourceVersion } };
            if (gatePass.issuedByMembershipId === auth.membershipId) return { status: 409, body: { code: "INDEPENDENT_GATE_VERIFICATION_REQUIRED" } };
            const job = input.jobs.find((item) => item.tenantId === auth.tenantId && item.branchId === body.branchId && item.jobId === gatePass.jobId)!;
            if (job.operationalStatus === "DELIVERED" || gatePass.status === "RELEASED") return { status: 409, body: { code: "JOURNEY_ALREADY_DELIVERED" } };
            const now = options.now ?? new Date().toISOString();
            if (gatePass.status !== "ISSUED" || new Date(now).getTime() < new Date(gatePass.validFrom).getTime() || new Date(now).getTime() >= new Date(gatePass.validUntil).getTime()) return { status: 409, body: { code: "GATE_PASS_NOT_VALID" } };
            const blockers = readinessFor(job, now);
            if (blockers.length) return { status: 409, body: { code: "CLOSURE_NOT_READY", blockers } };
            if (body.vehicleId !== gatePass.vehicleId || String(body.registrationNumber).toUpperCase() !== gatePass.registrationNumber.toUpperCase()) return { status: 409, body: { code: "VEHICLE_IDENTITY_MISMATCH" } };
            const scanModes = ["CAMERA_SCANNER", "HARDWARE_SCANNER"];
            const manualValid = body.verificationMode === "MANUAL" && typeof body.reason === "string" && body.reason.trim() && typeof body.manualEvidenceRef === "string" && body.manualEvidenceRef.startsWith(`private/${auth.tenantId}/${body.branchId}/gate/`);
            if (!(scanModes.includes(body.verificationMode) && typeof body.scanEvidence === "string" && body.scanEvidence.trim()) && !manualValid) return { status: 422, body: { code: "VERIFICATION_EVIDENCE_REQUIRED" } };
            const release = { id: `gate-release-${closureHistory.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, jobId: job.jobId, gatePassId: gatePass.id, registrationNumber: gatePass.registrationNumber, vehicleId: gatePass.vehicleId, issuedByMembershipId: gatePass.issuedByMembershipId, verifiedByMembershipId: auth.membershipId, verificationMode: body.verificationMode, verificationEvidence: body.scanEvidence ?? body.manualEvidenceRef, reason: body.reason, releasedAt: now };
            gatePass.status = "RELEASED"; gatePass.releasedAt = now; gatePass.resourceVersion += 1;
            job.operationalStatus = "DELIVERED"; job.deliveredAt = now; job.resourceVersion += 1;
            closureHistory.push({ ...structuredClone(release), operationalStatus: "DELIVERED", financialRecordStatus: job.financialRecordStatus, immutable: true });
            return commit(context, { status: 200, body: { gatePass: structuredClone(gatePass), job: structuredClone(job), release: structuredClone(release), resourceVersion: job.resourceVersion, auditReference: `audit-${release.id}` } });
          }
          const requestOverride = path.match(/^\/api\/v1\/jobs\/([^/]+)\/closure-overrides$/);
          if (requestOverride) {
            const auth = authorize(token, body.branchId, "closure.override.request"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const job = input.jobs.find((item) => item.tenantId === auth.tenantId && item.branchId === body.branchId && item.jobId === requestOverride[1]);
            if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
            if (options.ifMatch !== job.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: job.resourceVersion } };
            const activeCodes = new Set(readinessFor(job, options.now ?? new Date().toISOString()).map((item) => item.code));
            const validCodes = Array.isArray(body.blockerCodes) && body.blockerCodes.length > 0 && new Set(body.blockerCodes).size === body.blockerCodes.length && body.blockerCodes.every((code: string) => input.overridePolicy.allowedBlockerCodes.includes(code) && activeCodes.has(code));
            if (!validCodes || typeof body.reason !== "string" || !body.reason.trim() || typeof body.evidenceRef !== "string" || !body.evidenceRef.startsWith(`private/${auth.tenantId}/${body.branchId}/closure/`)) return { status: 422, body: { code: "INVALID_CLOSURE_OVERRIDE" } };
            const override = { id: `closure-override-${closureOverrides.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, jobId: job.jobId, blockerCodes: structuredClone(body.blockerCodes), reason: body.reason.trim(), evidenceRef: body.evidenceRef, makerMembershipId: auth.membershipId, status: "APPROVAL_PENDING", resourceVersion: 1, requestedAt: options.now ?? new Date().toISOString() };
            closureOverrides.push(override);
            return commit(context, { status: 201, body: { override: structuredClone(override), resourceVersion: 1, auditReference: `audit-request-${override.id}` } });
          }
          const deliveryMatch = path.match(/^\/api\/v1\/jobs\/([^/]+)\/delivery-evidence$/);
          const passMatch = path.match(/^\/api\/v1\/jobs\/([^/]+)\/gate-passes$/);
          if (!deliveryMatch && !passMatch) return { status: 404, body: { code: "NOT_FOUND" } };
          const permission = deliveryMatch ? "delivery.record" : "gatepass.issue";
          const auth = authorize(token, body.branchId, permission); if ("status" in auth) return auth;
          const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
          const jobId = (deliveryMatch ?? passMatch)![1];
          const job = input.jobs.find((item) => item.tenantId === auth.tenantId && item.branchId === body.branchId && item.jobId === jobId);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          if (options.ifMatch !== job.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: job.resourceVersion } };
          const now = options.now ?? new Date().toISOString();
          if (deliveryMatch) {
            const validEvidence = Array.isArray(body.evidence) && ["SIGNATURE", "PHOTO"].every((kind) => body.evidence.some((item: any) => item.kind === kind && typeof item.privateObjectRef === "string" && item.privateObjectRef.startsWith(`private/${auth.tenantId}/${body.branchId}/delivery/`) && /^[0-9a-f]{64}$/.test(item.checksum) && item.scanStatus === "CLEAN"));
            if (!Number.isInteger(body.finalOdometerKm) || body.finalOdometerKm < 0 || body.deliveredByMembershipId !== auth.membershipId || !body.deliveredTo?.name?.trim() || !body.deliveredTo?.identityType || !/^.{4}$/.test(body.deliveredTo?.identityLast4 ?? "") || !body.acknowledgement?.trim() || !validEvidence || !Array.isArray(body.exceptions)) return { status: 422, body: { code: "INCOMPLETE_DELIVERY_EVIDENCE" } };
            if (deliveries.some((item) => item.tenantId === auth.tenantId && item.jobId === job.jobId)) return { status: 409, body: { code: "DELIVERY_EVIDENCE_ALREADY_RECORDED" } };
            const delivery = { id: `delivery-${deliveries.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, jobId: job.jobId, visitId: job.visitId, vehicleId: job.vehicleId, finalOdometerKm: body.finalOdometerKm, deliveredByMembershipId: auth.membershipId, deliveredTo: structuredClone(body.deliveredTo), acknowledgement: body.acknowledgement.trim(), evidence: structuredClone(body.evidence), exceptions: structuredClone(body.exceptions), recordedAt: now, resourceVersion: 1 };
            deliveries.push(delivery); job.resourceVersion += 1;
            return commit(context, { status: 201, body: { delivery: structuredClone(delivery), resourceVersion: job.resourceVersion, auditReference: `audit-${delivery.id}` } });
          }
          const existingPass = gatePasses.find((item) => item.tenantId === auth.tenantId && item.branchId === body.branchId && item.jobId === job.jobId && item.status === "ISSUED");
          if (existingPass && new Date(now).getTime() < new Date(existingPass.validUntil).getTime()) return { status: 409, body: { code: "GATE_PASS_ALREADY_ISSUED" } };
          if (existingPass) { existingPass.status = "EXPIRED"; existingPass.resourceVersion += 1; }
          const blockers = readinessFor(job, now).filter((item) => item.code !== "GATE_PASS_MISSING");
          if (blockers.length) return { status: 409, body: { code: "CLOSURE_NOT_READY", blockers } };
          if (!(new Date(body.validUntil).getTime() > new Date(now).getTime()) || !Array.isArray(body.releaseConditions) || !body.releaseConditions.length) return { status: 422, body: { code: "INVALID_GATE_PASS" } };
          const financialYear = financialYearAt(now, input.timezoneByTenant[auth.tenantId]);
          const sequenceKey = `${auth.tenantId}:${body.branchId}:GATE_PASS:${financialYear}`;
          const sequence = (sequences.get(sequenceKey) ?? 0) + 1; sequences.set(sequenceKey, sequence);
          const gatePass = { id: `gate-pass-${gatePasses.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, jobId: job.jobId, visitId: job.visitId, vehicleId: job.vehicleId, registrationNumber: job.registrationNumber, documentNumber: `GP/${financialYear}/${String(sequence).padStart(6, "0")}`, financialYear, validFrom: now, validUntil: body.validUntil, releaseConditions: structuredClone(body.releaseConditions), issuedByMembershipId: auth.membershipId, status: "ISSUED", resourceVersion: 1 };
          gatePasses.push(gatePass); job.resourceVersion += 1;
          return commit(context, { status: 201, body: { gatePass: structuredClone(gatePass), resourceVersion: job.resourceVersion, auditReference: `audit-${gatePass.id}` } });
        },
      };
    },
    inspect() { return structuredClone({ deliveries, gatePasses, documents, qrVerifications, closureOverrides, closureHistory, auditEvidence, jobs: input.jobs }); },
  };
}
