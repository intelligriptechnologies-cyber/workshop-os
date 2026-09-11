import type { InventoryMembership } from "./inventory-ledger.js";
import { createLocalInventoryApi } from "./inventory-ledger.js";

export type JobMaterialMembership = {
  identityId: string;
  membershipId: string;
  technicianId?: string;
  tenantId: string;
  branchIds: string[];
  warehouseIds: string[];
  roles: string[];
  permissions: string[];
};

type InventoryApi = ReturnType<typeof createLocalInventoryApi>;
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; reauthenticatedAt?: string };
type ApiBody = Record<string, any>;
type ApiResponse = { status: number; body: ApiBody };
type ExactLine = { id: string; itemId: string; quantity: bigint; uom: string; issued: bigint };
type MaterialRequest = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; reason: string;
  lines: ExactLine[]; status: "APPROVED" | "APPROVAL_PENDING" | "REJECTED"; makerMembershipId: string;
  approval?: ApprovalEvidence; resourceVersion: number;
  excessEvidence?: Evidence[];
};
type MaterialIssue = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; requestId: string; requestLineId: string;
  itemId: string; quantity: bigint; uom: string; quantityBase: string; warehouseId: string; binId: string | null;
  lotId: string | null; remnantId: string | null; reason: string; evidence: Evidence[]; actorMembershipId: string;
  auditReference: string; occurredAt: string;
  originalDemandItemId?: string; substitutionId?: string;
};
type Evidence = { privateObjectRef: string; checksum: string; scanStatus: "CLEAN"; capturedAt: string; kind?: string };
type Outcome = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; issueId: string; itemId: string;
  type: "CONSUMED" | "WASTAGE" | "RETURN"; quantity: bigint; uom: string; lotId: string | null; remnantId: string | null;
  reason: string; evidence: Evidence[]; makerMembershipId: string; status: "POSTED" | "APPROVAL_PENDING" | "RETURN_PENDING" | "REJECTED";
  approval?: ApprovalEvidence; verification?: { membershipId: string; evidence: Evidence[]; auditReference: string; occurredAt: string };
  auditReference: string; occurredAt: string; resourceVersion: number;
};
type ApprovalEvidence = { checkerMembershipId: string; decision: "APPROVE" | "REJECT"; reason: string; auditReference: string; occurredAt: string };
type Variance = {
  id: string; tenantId: string; branchId: string; jobId: string; taskId: string; itemId: string; uom: string; quantity: bigint;
  reason: string; evidence: Evidence[]; makerMembershipId: string; status: "APPROVAL_PENDING" | "APPROVED" | "REJECTED";
  approval?: ApprovalEvidence; auditReference: string; occurredAt: string; resourceVersion: number;
};
type Substitution = {
  id: string; tenantId: string; branchId: string; requestId: string; requestLineId: string; originalItemId: string;
  substituteItemId: string; quantity: bigint; issued: bigint; uom: string; reason: string; evidence: Evidence[];
  makerMembershipId: string; status: "APPROVAL_PENDING" | "APPROVED" | "REJECTED"; approval?: ApprovalEvidence;
  auditReference: string; occurredAt: string; resourceVersion: number;
};
type AuthorizedStockReason = {
  id: string; tenantId: string; branchId: string; itemId: string; quantity: bigint; uom: string;
  warehouseId: string; binId: string | null; lotId: string | null; remnantId: string | null;
  reason: string; evidence: Evidence[]; makerMembershipId: string;
  status: "APPROVAL_PENDING" | "APPROVED" | "REJECTED" | "ISSUED";
  approval?: ApprovalEvidence; issue?: { actorMembershipId: string; reason: string; evidence: Evidence[]; auditReference: string; occurredAt: string };
  auditReference: string; occurredAt: string; resourceVersion: number;
};
type ReconciliationEvent = {
  id: string; type: "S15_MATERIAL_RECONCILED"; tenantId: string; branchId: string; aggregateId: string;
  aggregateVersion: number; occurredAt: string; payload: { jobId: string; taskId: string; consumers: ["S16_QC", "S18_BILLING"]; totals: ReturnType<typeof serializeTotals> };
};

const SCALE = 1_000_000n;
const clone = <T>(value: T): T => structuredClone(value);
const validId = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
function parseQuantity(value: unknown): bigint | undefined {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(value)) return undefined;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(6, "0"));
}
function formatQuantity(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  const fraction = (absolute % SCALE).toString().padStart(6, "0").replace(/0+$/, "");
  return `${sign}${absolute / SCALE}${fraction ? `.${fraction}` : ""}`;
}
function response(status: number, code: string, extra: ApiBody = {}): ApiResponse { return { status, body: { code, ...extra } }; }
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, nested]) => `${JSON.stringify(key)}:${stableJson(nested)}`).join(",")}}`;
  return JSON.stringify(value);
}
function validEvidence(membership: JobMaterialMembership, branchId: string, value: unknown): value is Evidence[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const prefix = `${membership.tenantId}/${branchId}/private/material/`;
  return value.every((entry) => entry && typeof entry.privateObjectRef === "string" && entry.privateObjectRef.startsWith(prefix) &&
    typeof entry.checksum === "string" && /^[0-9a-f]{64}$/.test(entry.checksum) && entry.scanStatus === "CLEAN" &&
    typeof entry.capturedAt === "string" && Number.isFinite(Date.parse(entry.capturedAt)));
}
function serializeTotals(totals: { issued: bigint; consumed: bigint; verifiedReturn: bigint; wastage: bigint; approvedVariance: bigint; uom: string }) {
  const accounted = totals.consumed + totals.verifiedReturn + totals.wastage + totals.approvedVariance;
  return { issued: formatQuantity(totals.issued), consumed: formatQuantity(totals.consumed), verifiedReturn: formatQuantity(totals.verifiedReturn),
    wastage: formatQuantity(totals.wastage), approvedVariance: formatQuantity(totals.approvedVariance), difference: formatQuantity(totals.issued - accounted), uom: totals.uom };
}

export function createLocalJobMaterialControlApi(input: {
  memberships: Record<string, JobMaterialMembership & InventoryMembership>;
  inventory: InventoryApi;
  approvedScopeEvents: Array<{ id: string; activationId: string; eventType: "APPROVED_SCOPE_MATERIAL_CONTROL"; tenantId: string; branchId: string; jobId: string; jobState: "ACTIVE"; snapshot: Record<string, { masterId: string; version: number }>; lines: Array<{ id: string; itemId: string; quantity: string; uom: string }>; occurredAt: string }>;
  taskAssignmentEvents: Array<{ id: string; type: "S12_TASK_ASSIGNMENT_READY"; tenantId: string; branchId: string; aggregateId: string; aggregateVersion: number; occurredAt: string; payload: { jobId: string; taskId: string; taskVersion: number; technicianIds: string[]; responsibleTechnicianId: string; checklist: unknown[]; dependencies: unknown[]; materials: Array<{ itemId: string; quantity: string; uom: string; recipeVersion: number }> } }>;
  policies: Array<{ tenantId: string; branchId: string; policyVersion: number; excessThresholdBps: number; wasteThresholdBps: number; varianceThresholdQuantity: string; recentAuthenticationMinutes?: number }>;
}) {
  const requests = new Map<string, MaterialRequest>();
  const issues = new Map<string, MaterialIssue>();
  const outcomes = new Map<string, Outcome>();
  const variances = new Map<string, Variance>();
  const substitutions = new Map<string, Substitution>();
  const stockReasons = new Map<string, AuthorizedStockReason>();
  const receipts = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const reconciliationEvents: ReconciliationEvent[] = [];
  const issuingLines = new Set<string>();
  let auditSequence = 0;

  const authorize = (token: string, branchId: unknown, permission: string) => {
    const membership = input.memberships[token];
    if (!membership) return { error: response(401, "AUTHENTICATION_REQUIRED") };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) return { error: response(403, "BRANCH_FORBIDDEN") };
    if (!membership.permissions.includes(permission)) return { error: response(403, "PERMISSION_DENIED") };
    return { membership };
  };
  const execute = async (membership: JobMaterialMembership, body: ApiBody, options: CommandOptions, action: (audit: string, now: string) => Promise<ApiResponse> | ApiResponse) => {
    if (!options.idempotencyKey?.trim()) return response(400, "IDEMPOTENCY_KEY_REQUIRED");
    const key = `${membership.tenantId}:${options.idempotencyKey}`;
    const fingerprint = stableJson(body);
    const replay = receipts.get(key);
    if (replay) return replay.fingerprint === fingerprint ? { status: 200, body: clone(replay.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
    const result = await action(`audit-${membership.tenantId}-${++auditSequence}`, options.now ?? new Date().toISOString());
    if (result.status >= 200 && result.status < 300) receipts.set(key, { fingerprint, response: clone(result) });
    return clone(result);
  };
  const taskContext = (membership: JobMaterialMembership, branchId: string, taskId: string, jobId?: string) => {
    const task = input.taskAssignmentEvents.find((event) => event.tenantId === membership.tenantId && event.branchId === branchId && event.aggregateId === taskId && (!jobId || event.payload.jobId === jobId));
    const scope = task && input.approvedScopeEvents.find((event) => event.tenantId === membership.tenantId && event.branchId === branchId && event.jobId === task.payload.jobId && event.jobState === "ACTIVE");
    return task && scope ? { task, scope } : undefined;
  };
  const totalsFor = (tenantId: string, taskId: string, itemId?: string) => {
    const taskIssues = [...issues.values()].filter((entry) => entry.tenantId === tenantId && entry.taskId === taskId && (!itemId || entry.itemId === itemId));
    const taskOutcomes = [...outcomes.values()].filter((entry) => entry.tenantId === tenantId && entry.taskId === taskId && (!itemId || entry.itemId === itemId));
    const taskVariances = [...variances.values()].filter((entry) => entry.tenantId === tenantId && entry.taskId === taskId && entry.status === "APPROVED" && (!itemId || entry.itemId === itemId));
    return { issued: taskIssues.reduce((sum, entry) => sum + entry.quantity, 0n),
      consumed: taskOutcomes.filter((entry) => entry.type === "CONSUMED" && entry.status === "POSTED").reduce((sum, entry) => sum + entry.quantity, 0n),
      verifiedReturn: taskOutcomes.filter((entry) => entry.type === "RETURN" && entry.status === "POSTED").reduce((sum, entry) => sum + entry.quantity, 0n),
      wastage: taskOutcomes.filter((entry) => entry.type === "WASTAGE" && entry.status === "POSTED").reduce((sum, entry) => sum + entry.quantity, 0n),
      approvedVariance: taskVariances.reduce((sum, entry) => sum + entry.quantity, 0n), uom: taskIssues[0]?.uom ?? taskOutcomes[0]?.uom ?? "EA" };
  };
  const policyFor = (tenantId: string, branchId: string) => input.policies.find((policy) => policy.tenantId === tenantId && policy.branchId === branchId);
  const recentlyAuthenticated = (options: CommandOptions, policy: ReturnType<typeof policyFor>) => {
    if (!options.reauthenticatedAt || !options.now || !Number.isFinite(Date.parse(options.reauthenticatedAt)) || !Number.isFinite(Date.parse(options.now))) return false;
    const age = Date.parse(options.now) - Date.parse(options.reauthenticatedAt);
    return age >= 0 && age <= (policy?.recentAuthenticationMinutes ?? 15) * 60_000;
  };
  const taskResourceVersion = (tenantId: string, taskId: string, base: number) => base +
    [...outcomes.values()].filter((entry) => entry.tenantId === tenantId && entry.taskId === taskId).reduce((sum, entry) => sum + 1 + (entry.approval || entry.verification ? 1 : 0), 0) +
    [...variances.values()].filter((entry) => entry.tenantId === tenantId && entry.taskId === taskId).reduce((sum, entry) => sum + 1 + (entry.approval ? 1 : 0), 0);

  class Session {
    constructor(private readonly token: string) {}
    async post(path: string, body: ApiBody, options: CommandOptions = {}): Promise<ApiResponse> {
      if (path === "/api/v1/material-stock-reasons") {
        const auth = authorize(this.token, body.branchId, "material.issue"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const quantity = parseQuantity(body.quantity);
          if (!validId(body.id) || !validId(body.itemId) || quantity === undefined || quantity <= 0n || !validId(body.uom) ||
              !validId(body.warehouseId) || !membership.warehouseIds.includes(body.warehouseId) || !validId(body.reason) ||
              !validEvidence(membership, body.branchId, body.evidence)) return response(422, "INVALID_STOCK_REASON");
          if (stockReasons.has(`${membership.tenantId}:${body.id}`)) return response(409, "STOCK_REASON_EXISTS");
          const stockReason: AuthorizedStockReason = {
            id: body.id, tenantId: membership.tenantId, branchId: body.branchId, itemId: body.itemId, quantity, uom: body.uom,
            warehouseId: body.warehouseId, binId: body.binId ?? null, lotId: body.lotId ?? null, remnantId: body.remnantId ?? null,
            reason: body.reason.trim(), evidence: clone(body.evidence), makerMembershipId: membership.membershipId,
            status: "APPROVAL_PENDING", auditReference: audit, occurredAt: now, resourceVersion: 1,
          };
          stockReasons.set(`${membership.tenantId}:${stockReason.id}`, stockReason);
          return { status: 202, body: { stockReason: serializeStockReason(stockReason), resourceVersion: 1, auditReference: audit } };
        });
      }
      const stockReasonApproval = path.match(/^\/api\/v1\/material-stock-reasons\/([^/]+)\/approval$/);
      if (stockReasonApproval) {
        const auth = authorize(this.token, body.branchId, "material.approve"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const stockReason = stockReasons.get(`${membership.tenantId}:${stockReasonApproval[1]}`);
          if (!stockReason || stockReason.branchId !== body.branchId) return response(404, "STOCK_REASON_NOT_FOUND");
          if (stockReason.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
          if (stockReason.makerMembershipId === membership.membershipId) return response(403, "MAKER_CANNOT_CHECK");
          if (!recentlyAuthenticated(options, policyFor(membership.tenantId, stockReason.branchId))) return response(403, "RECENT_AUTHENTICATION_REQUIRED");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== stockReason.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: stockReason.resourceVersion });
          if (!["APPROVE", "REJECT"].includes(body.decision) || !validId(body.reason)) return response(422, "APPROVAL_DECISION_REQUIRED");
          stockReason.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
          stockReason.resourceVersion += 1;
          stockReason.approval = { checkerMembershipId: membership.membershipId, decision: body.decision, reason: body.reason.trim(), auditReference: audit, occurredAt: now };
          return { status: 200, body: { stockReason: serializeStockReason(stockReason), resourceVersion: stockReason.resourceVersion, auditReference: audit } };
        });
      }
      const stockReasonIssue = path.match(/^\/api\/v1\/material-stock-reasons\/([^/]+)\/issue$/);
      if (stockReasonIssue) {
        const auth = authorize(this.token, body.branchId, "material.issue"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, async (audit, now) => {
          const stockReason = stockReasons.get(`${membership.tenantId}:${stockReasonIssue[1]}`);
          if (!stockReason || stockReason.branchId !== body.branchId) return response(404, "STOCK_REASON_NOT_FOUND");
          if (stockReason.status !== "APPROVED") return response(409, "APPROVED_STOCK_REASON_REQUIRED");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== stockReason.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: stockReason.resourceVersion });
          if (!validId(body.reason) || !validEvidence(membership, body.branchId, body.evidence)) return response(422, "STOCK_REASON_ISSUE_EVIDENCE_REQUIRED");
          if (body.scan?.objectType !== "ITEM" || body.scan.objectId !== stockReason.itemId || body.scan.state !== "AVAILABLE" ||
              (body.scan.source === "MANUAL" && !validId(body.scan.fallbackReason))) return response(422, "VALID_ITEM_SCAN_REQUIRED");
          const posted = await input.inventory.signIn(this.token).post("/api/v1/inventory/withdrawals", {
            branchId: stockReason.branchId, warehouseId: stockReason.warehouseId, binId: stockReason.binId,
            itemId: stockReason.itemId, quantity: formatQuantity(stockReason.quantity), uom: stockReason.uom,
            lotId: stockReason.lotId, remnantId: stockReason.remnantId, sourceType: "AUTHORIZED_STOCK_REASON",
            sourceId: stockReason.id, reason: body.reason.trim(),
          }, { idempotencyKey: `s15:${options.idempotencyKey}`, now });
          if (posted.status >= 400) return posted;
          stockReason.status = "ISSUED";
          stockReason.resourceVersion += 1;
          stockReason.issue = { actorMembershipId: membership.membershipId, reason: body.reason.trim(), evidence: clone(body.evidence), auditReference: audit, occurredAt: now };
          return { status: 201, body: { stockReason: serializeStockReason(stockReason), resourceVersion: stockReason.resourceVersion, auditReference: audit } };
        });
      }
      const requestMatch = path.match(/^\/api\/v1\/jobs\/([^/]+)\/material-requests$/);
      if (requestMatch) {
        const auth = authorize(this.token, body.branchId, "material.request"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const context = taskContext(membership, body.branchId, body.taskId, requestMatch[1]);
          if (!context) return response(422, "APPROVED_JOB_TASK_DEMAND_REQUIRED");
          if (!Array.isArray(body.lines) || body.lines.length === 0 || !validId(body.id) || !validId(body.reason)) return response(422, "INVALID_MATERIAL_REQUEST");
          if (requests.has(`${membership.tenantId}:${body.id}`)) return response(409, "MATERIAL_REQUEST_EXISTS");
          const lines: ExactLine[] = [];
          let approvalRequired = false;
          for (const line of body.lines) {
            const quantity = parseQuantity(line.quantity);
            const demand = context.task.payload.materials.find((candidate) => candidate.itemId === line.itemId && candidate.uom === line.uom);
            const approved = context.scope.lines.find((candidate) => candidate.itemId === line.itemId && candidate.uom === line.uom);
            if (!validId(line.id) || quantity === undefined || quantity <= 0n || !demand || !approved) return response(422, "MATERIAL_OUTSIDE_APPROVED_DEMAND");
            const max = [parseQuantity(demand.quantity), parseQuantity(approved.quantity)].filter((candidate): candidate is bigint => candidate !== undefined).reduce((a, b) => a < b ? a : b);
            const reserved = [...requests.values()].filter((entry) => entry.tenantId === membership.tenantId && entry.taskId === body.taskId && entry.status !== "REJECTED").flatMap((entry) => entry.lines).filter((entry) => entry.itemId === line.itemId && entry.uom === line.uom).reduce((sum, entry) => sum + entry.quantity, 0n);
            if (reserved + quantity > max) {
              if (!validEvidence(membership, body.branchId, body.excessEvidence)) return response(422, "EXCESS_DEMAND_EVIDENCE_REQUIRED");
              const excess = reserved + quantity - max;
              const policy = policyFor(membership.tenantId, body.branchId);
              approvalRequired ||= !policy || excess * 10_000n > max * BigInt(policy.excessThresholdBps);
            }
            lines.push({ id: line.id, itemId: line.itemId, quantity, uom: line.uom, issued: 0n });
          }
          const request: MaterialRequest = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, jobId: requestMatch[1], taskId: body.taskId,
            reason: body.reason.trim(), lines, status: approvalRequired ? "APPROVAL_PENDING" : "APPROVED", makerMembershipId: membership.membershipId,
            ...(approvalRequired ? { excessEvidence: clone(body.excessEvidence) } : {}), resourceVersion: 1 };
          requests.set(`${membership.tenantId}:${request.id}`, request);
          return { status: approvalRequired ? 202 : 201, body: { request: serializeRequest(request), resourceVersion: 1, auditReference: audit, occurredAt: now } };
        });
      }
      const requestApproval = path.match(/^\/api\/v1\/material-requests\/([^/]+)\/approval$/);
      if (requestApproval) {
        const auth = authorize(this.token, body.branchId, "material.approve"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const request = requests.get(`${membership.tenantId}:${requestApproval[1]}`);
          if (!request || request.branchId !== body.branchId) return response(404, "MATERIAL_REQUEST_NOT_FOUND");
          if (request.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
          if (request.makerMembershipId === membership.membershipId) return response(403, "MAKER_CANNOT_CHECK");
          if (!recentlyAuthenticated(options, policyFor(membership.tenantId, request.branchId))) return response(403, "RECENT_AUTHENTICATION_REQUIRED");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== request.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: request.resourceVersion });
          if (!["APPROVE", "REJECT"].includes(body.decision) || !validId(body.reason)) return response(422, "APPROVAL_DECISION_REQUIRED");
          request.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
          request.resourceVersion += 1;
          request.approval = { checkerMembershipId: membership.membershipId, decision: body.decision, reason: body.reason.trim(), auditReference: audit, occurredAt: now };
          return { status: 200, body: { request: serializeRequest(request), resourceVersion: request.resourceVersion, auditReference: audit } };
        });
      }
      const substitutionRequest = path.match(/^\/api\/v1\/material-requests\/([^/]+)\/substitutions$/);
      if (substitutionRequest) {
        const auth = authorize(this.token, body.branchId, "material.issue"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const request = requests.get(`${membership.tenantId}:${substitutionRequest[1]}`);
          const line = request?.lines.find((candidate) => candidate.id === body.requestLineId);
          const quantity = parseQuantity(body.quantity);
          if (!request || request.branchId !== body.branchId || request.status !== "APPROVED" || !line) return response(422, "AUTHORIZED_MATERIAL_DEMAND_REQUIRED");
          if (!validId(body.id) || !validId(body.substituteItemId) || body.substituteItemId === line.itemId || body.uom !== line.uom || quantity === undefined || quantity <= 0n ||
              !validId(body.reason) || !validEvidence(membership, body.branchId, body.evidence)) return response(422, "INVALID_SUBSTITUTION_REQUEST");
          const reserved = [...substitutions.values()].filter((entry) => entry.tenantId === membership.tenantId && entry.requestId === request.id &&
            entry.requestLineId === line.id && entry.status !== "REJECTED").reduce((sum, entry) => sum + entry.quantity, 0n);
          if (line.issued + reserved + quantity > line.quantity) return response(409, "SUBSTITUTION_EXCEEDS_REMAINING_DEMAND");
          const substitution: Substitution = { id: body.id, tenantId: membership.tenantId, branchId: request.branchId, requestId: request.id,
            requestLineId: line.id, originalItemId: line.itemId, substituteItemId: body.substituteItemId, quantity, issued: 0n, uom: line.uom,
            reason: body.reason.trim(), evidence: clone(body.evidence), makerMembershipId: membership.membershipId, status: "APPROVAL_PENDING",
            auditReference: audit, occurredAt: now, resourceVersion: 1 };
          substitutions.set(`${membership.tenantId}:${substitution.id}`, substitution);
          return { status: 202, body: { substitution: serializeSubstitution(substitution), resourceVersion: 1, auditReference: audit } };
        });
      }
      const substitutionApproval = path.match(/^\/api\/v1\/material-substitutions\/([^/]+)\/approval$/);
      if (substitutionApproval) {
        const auth = authorize(this.token, body.branchId, "material.approve"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const substitution = substitutions.get(`${membership.tenantId}:${substitutionApproval[1]}`);
          if (!substitution || substitution.branchId !== body.branchId) return response(404, "SUBSTITUTION_NOT_FOUND");
          if (substitution.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
          if (substitution.makerMembershipId === membership.membershipId) return response(403, "MAKER_CANNOT_CHECK");
          if (!recentlyAuthenticated(options, policyFor(membership.tenantId, substitution.branchId))) return response(403, "RECENT_AUTHENTICATION_REQUIRED");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== substitution.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: substitution.resourceVersion });
          if (!["APPROVE", "REJECT"].includes(body.decision) || !validId(body.reason)) return response(422, "APPROVAL_DECISION_REQUIRED");
          substitution.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
          substitution.resourceVersion += 1;
          substitution.approval = { checkerMembershipId: membership.membershipId, decision: body.decision, reason: body.reason.trim(), auditReference: audit, occurredAt: now };
          return { status: 200, body: { substitution: serializeSubstitution(substitution), resourceVersion: substitution.resourceVersion, auditReference: audit } };
        });
      }
      if (path === "/api/v1/material-issues") {
        const auth = authorize(this.token, body.branchId, "material.issue"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, async (audit, now) => {
          const request = requests.get(`${membership.tenantId}:${body.requestId}`);
          const line = request?.lines.find((candidate) => candidate.id === body.requestLineId);
          const substitution = typeof body.substitutionId === "string" ? substitutions.get(`${membership.tenantId}:${body.substitutionId}`) : undefined;
          const quantity = parseQuantity(body.quantity);
          if (!request || request.branchId !== body.branchId || request.taskId !== body.taskId || request.status !== "APPROVED" || !line) return response(422, "AUTHORIZED_MATERIAL_DEMAND_REQUIRED");
          const authorizedItem = substitution?.substituteItemId ?? line.itemId;
          if (substitution && (substitution.status !== "APPROVED" || substitution.requestId !== request.id || substitution.requestLineId !== line.id || substitution.uom !== line.uom)) return response(422, "APPROVED_SUBSTITUTION_REQUIRED");
          if (body.itemId !== authorizedItem || body.uom !== line.uom || quantity === undefined || quantity <= 0n || line.issued + quantity > line.quantity ||
              (substitution && substitution.issued + quantity > substitution.quantity)) return response(409, "ISSUE_EXCEEDS_AUTHORIZED_DEMAND");
          if (!validId(body.id) || !validId(body.reason) || !validEvidence(membership, body.branchId, body.evidence)) return response(422, "ISSUE_EVIDENCE_REQUIRED");
          if (!membership.warehouseIds.includes(body.warehouseId)) return response(403, "WAREHOUSE_FORBIDDEN");
          if (body.scan?.objectType !== "ITEM" || body.scan.objectId !== body.itemId || body.scan.state !== "AVAILABLE") return response(422, "VALID_ITEM_SCAN_REQUIRED");
          const lineKey = `${membership.tenantId}:${request.id}:${line.id}`;
          if (issuingLines.has(lineKey)) return response(409, "COMMAND_IN_PROGRESS");
          issuingLines.add(lineKey);
          try {
            const stock = await input.inventory.signIn(this.token).post("/api/v1/inventory/withdrawals", {
              branchId: body.branchId, warehouseId: body.warehouseId, binId: body.binId, itemId: body.itemId, quantity: body.quantity,
              uom: body.uom, lotId: body.lotId, remnantId: body.remnantId, sourceType: "JOB_MATERIAL_ISSUE", sourceId: body.id, reason: body.reason,
              ...(body.fefoExceptionReason ? { fefoExceptionReason: body.fefoExceptionReason } : {}),
            }, { idempotencyKey: `s15:${options.idempotencyKey}`, now });
            if (stock.status >= 400) return stock;
            line.issued += quantity;
            if (substitution) substitution.issued += quantity;
            const issue: MaterialIssue = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, jobId: request.jobId, taskId: request.taskId,
              requestId: request.id, requestLineId: line.id, itemId: body.itemId, quantity, uom: body.uom,
              quantityBase: String(stock.body.quantityBase).replace(/^-/, ""), warehouseId: body.warehouseId, binId: body.binId ?? null,
              lotId: body.lotId ?? null, remnantId: body.remnantId ?? null, reason: body.reason.trim(), evidence: clone(body.evidence),
              actorMembershipId: membership.membershipId, auditReference: audit, occurredAt: now,
              ...(substitution ? { originalDemandItemId: line.itemId, substitutionId: substitution.id } : {}) };
            issues.set(`${membership.tenantId}:${issue.id}`, issue);
            return { status: 201, body: { issue: serializeIssue(issue), resourceVersion: 1, auditReference: audit } };
          } finally {
            issuingLines.delete(lineKey);
          }
        });
      }
      if (path === "/api/v1/material-outcomes") {
        const auth = authorize(this.token, body.branchId, "material.outcome.record"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const issue = issues.get(`${membership.tenantId}:${body.issueId}`);
          const quantity = parseQuantity(body.quantity);
          if (!issue || issue.branchId !== body.branchId || issue.taskId !== body.taskId || issue.itemId !== body.itemId || issue.uom !== body.uom || issue.lotId !== (body.lotId ?? null) || issue.remnantId !== (body.remnantId ?? null)) return response(422, "ISSUE_OUTCOME_MISMATCH");
          const context = taskContext(membership, issue.branchId, issue.taskId, issue.jobId);
          if (!context || (membership.technicianId && !context.task.payload.technicianIds.includes(membership.technicianId))) return response(403, "TASK_TECHNICIAN_REQUIRED");
          if (!validId(body.id) || !["CONSUMED", "WASTAGE", "RETURN"].includes(body.type) || quantity === undefined || quantity <= 0n || !validId(body.reason) || !validEvidence(membership, body.branchId, body.evidence)) return response(422, "OUTCOME_EVIDENCE_REQUIRED");
          const prior = [...outcomes.values()].filter((entry) => entry.tenantId === membership.tenantId && entry.issueId === issue.id && entry.status !== "REJECTED").reduce((sum, entry) => sum + entry.quantity, 0n);
          if (prior + quantity > issue.quantity) return response(409, "OUTCOME_EXCEEDS_ISSUE");
          const outcome: Outcome = { id: body.id, tenantId: membership.tenantId, branchId: issue.branchId, jobId: issue.jobId, taskId: issue.taskId,
            issueId: issue.id, itemId: issue.itemId, type: body.type, quantity, uom: issue.uom, lotId: issue.lotId, remnantId: issue.remnantId,
            reason: body.reason.trim(), evidence: clone(body.evidence), makerMembershipId: membership.membershipId,
            status: body.type === "RETURN" ? "RETURN_PENDING" : "POSTED", auditReference: audit, occurredAt: now, resourceVersion: 1 };
          if (body.type === "WASTAGE") {
            const policy = policyFor(membership.tenantId, issue.branchId);
            const requiresApproval = policy ? quantity * 10_000n > issue.quantity * BigInt(policy.wasteThresholdBps) : true;
            if (requiresApproval) outcome.status = "APPROVAL_PENDING";
          }
          outcomes.set(`${membership.tenantId}:${outcome.id}`, outcome);
          return { status: outcome.status === "APPROVAL_PENDING" ? 202 : 201, body: { outcome: serializeOutcome(outcome), resourceVersion: context.task.aggregateVersion + [...outcomes.values()].filter((entry) => entry.tenantId === membership.tenantId && entry.taskId === issue.taskId).length, auditReference: audit } };
        });
      }
      const outcomeApproval = path.match(/^\/api\/v1\/material-outcomes\/([^/]+)\/approval$/);
      if (outcomeApproval) {
        const auth = authorize(this.token, body.branchId, "material.approve"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const outcome = outcomes.get(`${membership.tenantId}:${outcomeApproval[1]}`);
          if (!outcome || outcome.branchId !== body.branchId) return response(404, "OUTCOME_NOT_FOUND");
          if (outcome.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
          if (outcome.makerMembershipId === membership.membershipId) return response(403, "MAKER_CANNOT_CHECK");
          if (!recentlyAuthenticated(options, policyFor(membership.tenantId, outcome.branchId))) return response(403, "RECENT_AUTHENTICATION_REQUIRED");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== outcome.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: outcome.resourceVersion });
          if (!["APPROVE", "REJECT"].includes(body.decision) || !validId(body.reason)) return response(422, "APPROVAL_DECISION_REQUIRED");
          outcome.status = body.decision === "APPROVE" ? "POSTED" : "REJECTED";
          outcome.resourceVersion += 1;
          outcome.approval = { checkerMembershipId: membership.membershipId, decision: body.decision, reason: body.reason.trim(), auditReference: audit, occurredAt: now };
          return { status: 200, body: { outcome: serializeOutcome(outcome), resourceVersion: outcome.resourceVersion, auditReference: audit } };
        });
      }
      const returnVerification = path.match(/^\/api\/v1\/material-outcomes\/([^/]+)\/return-verification$/);
      if (returnVerification) {
        const auth = authorize(this.token, body.branchId, "material.return.verify"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, async (audit, now) => {
          const outcome = outcomes.get(`${membership.tenantId}:${returnVerification[1]}`);
          if (!outcome || outcome.branchId !== body.branchId || outcome.type !== "RETURN") return response(404, "RETURN_NOT_FOUND");
          if (outcome.status !== "RETURN_PENDING") return response(409, "RETURN_NOT_PENDING");
          if (outcome.makerMembershipId === membership.membershipId) return response(403, "MAKER_CANNOT_VERIFY_RETURN");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== outcome.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: outcome.resourceVersion });
          if (!validId(body.reason) || !validEvidence(membership, body.branchId, body.evidence)) return response(422, "RETURN_VERIFICATION_EVIDENCE_REQUIRED");
          const issue = issues.get(`${membership.tenantId}:${outcome.issueId}`)!;
          const ledger = input.inventory.testing.ledger().filter((entry: ApiBody) => entry.sourceType === "JOB_MATERIAL_ISSUE" && entry.sourceId === issue.id && entry.account === "LOCATION_STOCK");
          const issueValue = ledger.length ? -BigInt(ledger[0].valueMinor) : 0n;
          const valueMinor = issue.quantity === outcome.quantity ? issueValue : issueValue * outcome.quantity / issue.quantity;
          const posted = await input.inventory.signIn(this.token).post("/api/v1/inventory/job-returns", {
            branchId: outcome.branchId, warehouseId: issue.warehouseId, binId: issue.binId, itemId: outcome.itemId,
            quantity: formatQuantity(outcome.quantity), uom: outcome.uom, lotId: outcome.lotId, remnantId: outcome.remnantId,
            valueMinor: valueMinor.toString(), sourceType: "JOB_MATERIAL_RETURN", sourceId: outcome.id, reason: body.reason,
          }, { idempotencyKey: `s15:${options.idempotencyKey}`, now });
          if (posted.status >= 400) return posted;
          outcome.status = "POSTED";
          outcome.resourceVersion += 1;
          outcome.verification = { membershipId: membership.membershipId, evidence: clone(body.evidence), auditReference: audit, occurredAt: now };
          return { status: 200, body: { outcome: serializeOutcome(outcome), resourceVersion: outcome.resourceVersion, auditReference: audit } };
        });
      }
      const varianceRequest = path.match(/^\/api\/v1\/tasks\/([^/]+)\/material-variance-requests$/);
      if (varianceRequest) {
        const auth = authorize(this.token, body.branchId, "material.reconcile"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const context = taskContext(membership, body.branchId, varianceRequest[1]);
          if (!context) return response(404, "TASK_NOT_FOUND");
          if (variances.has(`${membership.tenantId}:${body.id}`)) return response(409, "VARIANCE_EXISTS");
          const quantity = parseQuantity(body.quantity);
          const totals = totalsFor(membership.tenantId, varianceRequest[1], body.itemId);
          const difference = totals.issued - totals.consumed - totals.verifiedReturn - totals.wastage - totals.approvedVariance;
          if (!validId(body.id) || quantity === undefined || quantity <= 0n || quantity > difference || body.uom !== totals.uom || !validId(body.itemId) ||
              !validId(body.reason) || !validEvidence(membership, body.branchId, body.evidence)) return response(422, "INVALID_VARIANCE_REQUEST");
          const policy = policyFor(membership.tenantId, body.branchId);
          const threshold = parseQuantity(policy?.varianceThresholdQuantity ?? "0") ?? 0n;
          const status: Variance["status"] = quantity > threshold ? "APPROVAL_PENDING" : "APPROVED";
          const variance: Variance = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, jobId: context.task.payload.jobId,
            taskId: varianceRequest[1], itemId: body.itemId, uom: body.uom, quantity, reason: body.reason.trim(), evidence: clone(body.evidence),
            makerMembershipId: membership.membershipId, status, auditReference: audit, occurredAt: now, resourceVersion: 1 };
          variances.set(`${membership.tenantId}:${variance.id}`, variance);
          return { status: status === "APPROVAL_PENDING" ? 202 : 201, body: { variance: serializeVariance(variance), resourceVersion: 1,
            taskResourceVersion: taskResourceVersion(membership.tenantId, variance.taskId, context.task.aggregateVersion), auditReference: audit } };
        });
      }
      const varianceApproval = path.match(/^\/api\/v1\/material-variances\/([^/]+)\/approval$/);
      if (varianceApproval) {
        const auth = authorize(this.token, body.branchId, "material.approve"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const variance = variances.get(`${membership.tenantId}:${varianceApproval[1]}`);
          if (!variance || variance.branchId !== body.branchId) return response(404, "VARIANCE_NOT_FOUND");
          if (variance.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
          if (variance.makerMembershipId === membership.membershipId) return response(403, "MAKER_CANNOT_CHECK");
          if (!recentlyAuthenticated(options, policyFor(membership.tenantId, variance.branchId))) return response(403, "RECENT_AUTHENTICATION_REQUIRED");
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== variance.resourceVersion) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: variance.resourceVersion });
          if (!["APPROVE", "REJECT"].includes(body.decision) || !validId(body.reason)) return response(422, "APPROVAL_DECISION_REQUIRED");
          variance.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
          variance.resourceVersion += 1;
          variance.approval = { checkerMembershipId: membership.membershipId, decision: body.decision, reason: body.reason.trim(), auditReference: audit, occurredAt: now };
          const context = taskContext(membership, variance.branchId, variance.taskId, variance.jobId)!;
          return { status: 200, body: { variance: serializeVariance(variance), resourceVersion: variance.resourceVersion,
            taskResourceVersion: taskResourceVersion(membership.tenantId, variance.taskId, context.task.aggregateVersion), auditReference: audit } };
        });
      }
      const reconcile = path.match(/^\/api\/v1\/tasks\/([^/]+)\/material-reconciliation$/);
      if (reconcile) {
        const auth = authorize(this.token, body.branchId, "material.reconcile"); if (auth.error) return auth.error;
        const membership = auth.membership!;
        return execute(membership, body, options, (audit, now) => {
          const context = taskContext(membership, body.branchId, reconcile[1]);
          if (!context) return response(404, "TASK_NOT_FOUND");
          const version = taskResourceVersion(membership.tenantId, reconcile[1], context.task.aggregateVersion);
          if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
          if (options.ifMatch !== version) return response(412, "RESOURCE_VERSION_MISMATCH", { resourceVersion: version });
          const totals = totalsFor(membership.tenantId, reconcile[1]);
          const serialized = serializeTotals(totals);
          if (serialized.difference !== "0") return response(409, "MATERIAL_NOT_BALANCED", { totals: serialized });
          if (!validId(body.reason)) return response(422, "RECONCILIATION_REASON_REQUIRED");
          if (reconciliationEvents.some((event) => event.tenantId === membership.tenantId && event.aggregateId === reconcile[1])) return response(409, "MATERIAL_ALREADY_RECONCILED");
          const event: ReconciliationEvent = { id: `material-reconciled-${reconciliationEvents.length + 1}`, type: "S15_MATERIAL_RECONCILED",
            tenantId: membership.tenantId, branchId: body.branchId, aggregateId: reconcile[1], aggregateVersion: version + 1, occurredAt: now,
            payload: { jobId: context.task.payload.jobId, taskId: reconcile[1], consumers: ["S16_QC", "S18_BILLING"], totals: serialized } };
          reconciliationEvents.push(event);
          return { status: 200, body: { reconciliation: { id: event.id, status: "RECONCILED", taskId: reconcile[1], totals: serialized, reason: body.reason, auditReference: audit, occurredAt: now }, resourceVersion: event.aggregateVersion, auditReference: audit } };
        });
      }
      return response(404, "NOT_FOUND");
    }
  }
  return { signIn: (token: string) => new Session(token), testing: {
    requests: () => [...requests.values()].map(serializeRequest), issues: () => [...issues.values()].map(serializeIssue),
    substitutions: () => [...substitutions.values()].map(serializeSubstitution), outcomes: () => [...outcomes.values()].map(serializeOutcome),
    variances: () => [...variances.values()].map(serializeVariance), stockReasons: () => [...stockReasons.values()].map(serializeStockReason),
    reconciliationEvents: () => clone(reconciliationEvents),
  } };
}

function serializeRequest(value: MaterialRequest) { return { ...clone(value), lines: value.lines.map((line) => ({ ...line, quantity: formatQuantity(line.quantity), issued: formatQuantity(line.issued) })) }; }
function serializeIssue(value: MaterialIssue) { return { ...clone(value), quantity: formatQuantity(value.quantity) }; }
function serializeOutcome(value: Outcome) { return { ...clone(value), quantity: formatQuantity(value.quantity) }; }
function serializeVariance(value: Variance) { return { ...clone(value), quantity: formatQuantity(value.quantity) }; }
function serializeSubstitution(value: Substitution) { return { ...clone(value), quantity: formatQuantity(value.quantity), issued: formatQuantity(value.issued) }; }
function serializeStockReason(value: AuthorizedStockReason) { return { ...clone(value), quantity: formatQuantity(value.quantity) }; }
