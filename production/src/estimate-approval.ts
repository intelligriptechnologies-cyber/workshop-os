import { createHash, randomBytes } from "node:crypto";

export type EstimateMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

export type EstimateScopeHandoff = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  inspectionId: string;
  jobVersion: number;
  eventType: "ADVISOR_SCOPE_RECOMMENDED";
  recommendedScope: { code: string; description: string; sourceFieldIds: string[] }[];
  occurredAt: string;
  auditReference: string;
};

type SnapshotType = "PRICE" | "TAX" | "WORKFLOW" | "RECIPE" | "CHECKLIST" | "POLICY";
type SnapshotReference = { masterId: string; version: number };
type EstimateLineKind = "SERVICE" | "PACKAGE" | "MATERIAL" | "LABOUR";

export type EstimateConfiguration = {
  tenantId: string;
  branchId: string;
  versionId: string;
  currency: string;
  validityDays: number;
  manualMakerCheckerThresholdMinor: string;
  allowPartialApproval: boolean;
  snapshot: Record<SnapshotType, SnapshotReference>;
  lines: {
    id: string;
    scopeCode: string;
    kind: EstimateLineKind;
    description: string;
    uom: string;
    unitPriceMinor: string;
    taxRateBps: string;
    maximumDiscountMinor: string;
    partialApprovalAllowed: boolean;
  }[];
};

type EstimateJob = {
  id: string;
  tenantId: string;
  branchId: string;
  customerId: string;
  payerIds: string[];
};

type EstimateLine = {
  id: string;
  configurationLineId: string;
  scopeCode: string;
  kind: EstimateLineKind;
  description: string;
  uom: string;
  quantity: string;
  unitPriceMinor: string;
  subtotalMinor: string;
  discountMinor: string;
  taxableMinor: string;
  taxRateBps: string;
  taxMinor: string;
  totalMinor: string;
  partialApprovalAllowed: boolean;
  payerAllocations: { payerId: string; amountMinor: string }[];
};

type Estimate = {
  id: string;
  tenantId: string;
  branchId: string;
  jobId: string;
  kind: "PRIMARY" | "SUPPLEMENTARY";
  scopeHandoffId: string;
  configurationVersionId: string;
  priorVersionId?: string;
  baseApprovedEstimateVersionId?: string;
  revision: number;
  number?: string;
  status: "DRAFT" | "SENT" | "APPROVED" | "PARTIALLY_APPROVED" | "REJECTED" | "CLARIFICATION_REQUESTED";
  notes?: string;
  lines: EstimateLine[];
  totals: { subtotalMinor: string; discountMinor: string; taxableMinor: string; taxMinor: string; grandTotalMinor: string; currency: string };
  payerTotals: { payerId: string; amountMinor: string }[];
  validUntil?: string;
  resourceVersion: number;
  createdAt: string;
  sentAt?: string;
};

type ApprovalOutcome = {
  id: string;
  estimateId: string;
  outcome: "APPROVE_ALL" | "APPROVE_PARTIAL" | "REJECT" | "CLARIFY";
  selectedLineIds: string[];
  source: "PUBLIC_LINK" | "MANUAL";
  evidence: { customerName: string; contactLast4: string; acknowledgement: string; message?: string; channel?: string; attachmentRef?: string; reason?: string; ipAddress?: string; userAgent?: string };
  checkerMembershipId?: string;
  recordedAt: string;
  receiptReference: string;
};
type ManualOutcomeRequest = {
  id: string;
  estimateId: string;
  tenantId: string;
  branchId: string;
  outcome: ApprovalOutcome["outcome"];
  selectedLineIds: string[];
  evidence: ApprovalOutcome["evidence"];
  makerMembershipId: string;
  status: "PENDING_CHECK" | "APPROVED" | "REJECTED";
  createdAt: string;
  checkerMembershipId?: string;
  decisionReason?: string;
  decidedAt?: string;
};
type ScopeActivation = {
  id: string;
  estimateId: string;
  jobId: string;
  approvedLineIds: string[];
  snapshot: Record<SnapshotType, SnapshotReference>;
  activatedAt: string;
  outcomeId: string;
};
type PlanningHandoff = { id: string; activationId: string; eventType: "APPROVED_SCOPE_WORK_PLANNING"; lines: EstimateLine[]; occurredAt: string };
type MaterialHandoff = { id: string; activationId: string; eventType: "APPROVED_SCOPE_MATERIAL_CONTROL"; lines: EstimateLine[]; occurredAt: string };

type ApiBody = {
  code?: string;
  estimate?: Estimate;
  estimates?: Estimate[];
  publicToken?: string;
  estimateNumber?: string;
  currency?: string;
  totalMinor?: string;
  validUntil?: string;
  lines?: unknown[];
  allowedOutcomes?: string[];
  outcome?: string;
  recordedAt?: string;
  receiptReference?: string;
  approvalOutcomes?: ApprovalOutcome[];
  activation?: ScopeActivation;
  workPlanningHandoffs?: PlanningHandoff[];
  materialControlHandoffs?: MaterialHandoff[];
  manualOutcomeRequest?: ManualOutcomeRequest;
  resourceVersion?: number;
  auditReference?: string;
  [key: string]: unknown;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; requestId?: string; ipAddress?: string; userAgent?: string; reauthenticatedAt?: string };

const clone = <T>(value: T): T => structuredClone(value);
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const fingerprint = (value: unknown) => hash(JSON.stringify(value));
const INTEGER = /^(0|[1-9]\d*)$/;
const DECIMAL = /^(0|[1-9]\d*)(\.\d+)?$/;
const SNAPSHOT_TYPES: SnapshotType[] = ["PRICE", "TAX", "WORKFLOW", "RECIPE", "CHECKLIST", "POLICY"];

const parseMinor = (value: unknown): bigint | undefined =>
  typeof value === "string" && INTEGER.test(value) ? BigInt(value) : undefined;

const parseDecimal = (value: unknown): { numerator: bigint; denominator: bigint } | undefined => {
  if (typeof value !== "string" || !DECIMAL.test(value) || BigInt(value.replace(".", "")) === 0n) return undefined;
  const [whole, fraction = ""] = value.split(".");
  return { numerator: BigInt(`${whole}${fraction}`), denominator: 10n ** BigInt(fraction.length) };
};

const roundedRatio = (numerator: bigint, denominator: bigint) =>
  (numerator + denominator / 2n) / denominator;

export function createLocalEstimateApprovalApi(input: {
  memberships: Record<string, EstimateMembership>;
  scopeHandoffs: EstimateScopeHandoff[];
  configurations: EstimateConfiguration[];
  jobs: EstimateJob[];
}) {
  const estimates = new Map<string, Estimate>();
  const consumedHandoffs = new Map<string, string>();
  const commands = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const documentSequences = new Map<string, bigint>();
  const publicTokenDigests = new Map<string, { estimateId: string; tenantId: string; expiresAt: string; usedAt?: string }>();
  const approvalOutcomes: ApprovalOutcome[] = [];
  const activations = new Map<string, ScopeActivation>();
  const workPlanningHandoffs: PlanningHandoff[] = [];
  const materialControlHandoffs: MaterialHandoff[] = [];
  const manualOutcomeRequests = new Map<string, ManualOutcomeRequest>();
  let estimateSequence = 0;
  let auditSequence = 0;

  const authorize = (token: string, branchId: unknown, permission: string): EstimateMembership | ApiResponse => {
    const member = input.memberships[token];
    if (!member) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
    if (typeof branchId !== "string" || !member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
    if (permission && !member.permissions.includes(permission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
    return member;
  };
  const visibleEstimate = (member: EstimateMembership, branchId: string, id: string) => {
    const estimate = estimates.get(`${member.tenantId}:${id}`);
    return estimate?.branchId === branchId ? estimate : undefined;
  };
  const execute = (member: EstimateMembership, path: string, body: Record<string, unknown>, options: CommandOptions, work: () => ApiResponse): ApiResponse => {
    if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const key = `${member.tenantId}:${options.idempotencyKey}`;
    const digest = fingerprint({ path, body, ifMatch: options.ifMatch });
    const prior = commands.get(key);
    if (prior) return prior.fingerprint === digest ? clone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
    const response = work();
    if (response.status >= 200 && response.status < 300) commands.set(key, { fingerprint: digest, response: clone(response) });
    return clone(response);
  };
  const audit = () => `audit-estimate-${++auditSequence}`;

  const composeLines = (rawLines: unknown, configuration: EstimateConfiguration, job: EstimateJob, handoff: EstimateScopeHandoff):
    { lines: EstimateLine[]; totals: Estimate["totals"]; payerTotals: Estimate["payerTotals"] } | ApiResponse => {
    if (!Array.isArray(rawLines) || rawLines.length === 0) return { status: 422, body: { code: "ESTIMATE_LINES_REQUIRED" } };
    const scopeCodes = new Set(handoff.recommendedScope.map((scope) => scope.code));
    const seen = new Set<string>();
    const lines: EstimateLine[] = [];
    let subtotal = 0n, discount = 0n, taxable = 0n, tax = 0n, grandTotal = 0n;
    const payerTotals = new Map<string, bigint>();
    for (let index = 0; index < rawLines.length; index += 1) {
      const raw = rawLines[index];
      if (!raw || typeof raw !== "object") return { status: 422, body: { code: "INVALID_ESTIMATE_LINE" } };
      const item = raw as Record<string, unknown>;
      const configurationLineId = String(item.configurationLineId ?? "");
      const configured = configuration.lines.find((line) => line.id === configurationLineId);
      if (!configured || seen.has(configured.id) || !scopeCodes.has(configured.scopeCode)) {
        return { status: 422, body: { code: "LINE_NOT_IN_CONFIGURED_SCOPE" } };
      }
      seen.add(configured.id);
      const quantity = parseDecimal(item.quantity);
      const unitPrice = parseMinor(configured.unitPriceMinor);
      const lineDiscount = parseMinor(item.discountMinor);
      const maximumDiscount = parseMinor(configured.maximumDiscountMinor);
      const taxRate = parseMinor(configured.taxRateBps);
      if (!quantity || unitPrice === undefined || lineDiscount === undefined || maximumDiscount === undefined || taxRate === undefined || taxRate > 10000n) {
        return { status: 422, body: { code: "INVALID_EXACT_LINE_VALUE" } };
      }
      const priceProduct = unitPrice * quantity.numerator;
      if (priceProduct % quantity.denominator !== 0n) return { status: 422, body: { code: "FRACTIONAL_MINOR_UNIT" } };
      const lineSubtotal = priceProduct / quantity.denominator;
      if (lineDiscount > maximumDiscount || lineDiscount > lineSubtotal) return { status: 422, body: { code: "DISCOUNT_OUTSIDE_CONFIGURATION" } };
      const lineTaxable = lineSubtotal - lineDiscount;
      const lineTax = roundedRatio(lineTaxable * taxRate, 10000n);
      const lineTotal = lineTaxable + lineTax;
      if (!Array.isArray(item.payerAllocations) || item.payerAllocations.length === 0) return { status: 422, body: { code: "PAYER_ALLOCATION_REQUIRED" } };
      const allocations: { payerId: string; amountMinor: string }[] = [];
      let allocated = 0n;
      const linePayers = new Set<string>();
      for (const rawAllocation of item.payerAllocations) {
        if (!rawAllocation || typeof rawAllocation !== "object") return { status: 422, body: { code: "INVALID_PAYER_ALLOCATION" } };
        const allocation = rawAllocation as Record<string, unknown>;
        const payerId = String(allocation.payerId ?? "");
        const amount = parseMinor(allocation.amountMinor);
        if (!job.payerIds.includes(payerId) || linePayers.has(payerId) || amount === undefined || amount === 0n) {
          return { status: 422, body: { code: "INVALID_PAYER_ALLOCATION" } };
        }
        linePayers.add(payerId);
        allocated += amount;
        payerTotals.set(payerId, (payerTotals.get(payerId) ?? 0n) + amount);
        allocations.push({ payerId, amountMinor: amount.toString() });
      }
      if (allocated !== lineTotal) return { status: 422, body: { code: "PAYER_ALLOCATION_MISMATCH" } };
      lines.push({
        id: `estimate-line-${index + 1}`, configurationLineId: configured.id, scopeCode: configured.scopeCode,
        kind: configured.kind, description: configured.description, uom: configured.uom, quantity: String(item.quantity),
        unitPriceMinor: unitPrice.toString(), subtotalMinor: lineSubtotal.toString(), discountMinor: lineDiscount.toString(),
        taxableMinor: lineTaxable.toString(), taxRateBps: taxRate.toString(), taxMinor: lineTax.toString(), totalMinor: lineTotal.toString(),
        partialApprovalAllowed: configured.partialApprovalAllowed, payerAllocations: allocations,
      });
      subtotal += lineSubtotal; discount += lineDiscount; taxable += lineTaxable; tax += lineTax; grandTotal += lineTotal;
    }
    return {
      lines,
      totals: { subtotalMinor: subtotal.toString(), discountMinor: discount.toString(), taxableMinor: taxable.toString(), taxMinor: tax.toString(), grandTotalMinor: grandTotal.toString(), currency: configuration.currency },
      payerTotals: [...payerTotals].map(([payerId, amount]) => ({ payerId, amountMinor: amount.toString() })).sort((a, b) => a.payerId.localeCompare(b.payerId)),
    };
  };

  const commitOutcome = (inputOutcome: {
    estimate: Estimate;
    outcome: ApprovalOutcome["outcome"];
    selectedLineIds: string[];
    source: ApprovalOutcome["source"];
    evidence: ApprovalOutcome["evidence"];
    now: string;
    checkerMembershipId?: string;
  }): ApiResponse => {
    const { estimate, outcome, selectedLineIds, source, evidence, now, checkerMembershipId } = inputOutcome;
    const configuration = input.configurations.find((candidate) => candidate.tenantId === estimate.tenantId && candidate.branchId === estimate.branchId && candidate.versionId === estimate.configurationVersionId)!;
    const activates = outcome === "APPROVE_ALL" || outcome === "APPROVE_PARTIAL";
    if (activates && activations.has(`${estimate.tenantId}:${estimate.id}`)) return { status: 409, body: { code: "SCOPE_ALREADY_ACTIVATED" } };
    if (activates && SNAPSHOT_TYPES.some((type) => !configuration.snapshot[type]?.masterId || !Number.isInteger(configuration.snapshot[type]?.version))) {
      return { status: 422, body: { code: "COMPLETE_CONFIGURATION_SNAPSHOT_REQUIRED" } };
    }
    const outcomeId = `estimate-outcome-${approvalOutcomes.length + 1}`;
    const receiptReference = `estimate-receipt-${approvalOutcomes.length + 1}`;
    const record: ApprovalOutcome = {
      id: outcomeId, estimateId: estimate.id, outcome, selectedLineIds: clone(selectedLineIds), source,
      evidence: clone(evidence), ...(checkerMembershipId ? { checkerMembershipId } : {}), recordedAt: now, receiptReference,
    };
    if (activates) {
      const activation: ScopeActivation = {
        id: `scope-activation-${activations.size + 1}`, estimateId: estimate.id, jobId: estimate.jobId,
        approvedLineIds: clone(selectedLineIds), snapshot: clone(configuration.snapshot), activatedAt: now, outcomeId,
      };
      const approvedLines = estimate.lines.filter((line) => selectedLineIds.includes(line.id));
      activations.set(`${estimate.tenantId}:${estimate.id}`, activation);
      workPlanningHandoffs.push({ id: `work-handoff-${workPlanningHandoffs.length + 1}`, activationId: activation.id,
        eventType: "APPROVED_SCOPE_WORK_PLANNING", lines: clone(approvedLines.filter((line) => line.kind !== "MATERIAL")), occurredAt: now });
      materialControlHandoffs.push({ id: `material-handoff-${materialControlHandoffs.length + 1}`, activationId: activation.id,
        eventType: "APPROVED_SCOPE_MATERIAL_CONTROL", lines: clone(approvedLines.filter((line) => line.kind === "MATERIAL")), occurredAt: now });
    }
    const status: Estimate["status"] = outcome === "APPROVE_ALL" ? "APPROVED" : outcome === "APPROVE_PARTIAL" ? "PARTIALLY_APPROVED" : outcome === "REJECT" ? "REJECTED" : "CLARIFICATION_REQUESTED";
    estimates.set(`${estimate.tenantId}:${estimate.id}`, { ...estimate, status, resourceVersion: estimate.resourceVersion + 1 });
    approvalOutcomes.push(record);
    return { status: 200, body: { outcome, recordedAt: now, receiptReference, auditReference: audit() } };
  };

  const recentlyReauthenticated = (options: CommandOptions) => {
    const now = Date.parse(options.now ?? new Date().toISOString());
    const reauthenticatedAt = Date.parse(options.reauthenticatedAt ?? "");
    return Number.isFinite(now) && Number.isFinite(reauthenticatedAt) && reauthenticatedAt <= now && now - reauthenticatedAt <= 15 * 60_000;
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const manualDecision = path.match(/^\/api\/v1\/manual-outcome-requests\/([^/]+)\/decisions$/);
      if (manualDecision) {
        const auth = authorize(this.token, body.branchId, "");
        if ("status" in auth) return auth;
        const request = manualOutcomeRequests.get(`${auth.tenantId}:${manualDecision[1]}`);
        if (!request || request.branchId !== body.branchId) return { status: 404, body: { code: "MANUAL_OUTCOME_REQUEST_NOT_FOUND" } };
        if (request.makerMembershipId === auth.membershipId) return { status: 403, body: { code: "MAKER_CANNOT_CHECK" } };
        if (!auth.permissions.includes("estimate.manual-review")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
        if (!recentlyReauthenticated(options)) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
        return execute(auth, path, body, options, () => {
          if (request.status !== "PENDING_CHECK") return { status: 409, body: { code: "MANUAL_OUTCOME_ALREADY_DECIDED" } };
          if ((body.decision !== "APPROVE" && body.decision !== "REJECT") || typeof body.reason !== "string" || !body.reason.trim()) {
            return { status: 422, body: { code: "MANUAL_DECISION_REASON_REQUIRED" } };
          }
          const now = options.now ?? new Date().toISOString();
          request.checkerMembershipId = auth.membershipId;
          request.decisionReason = body.reason.trim();
          request.decidedAt = now;
          if (body.decision === "REJECT") {
            request.status = "REJECTED";
            return { status: 200, body: { manualOutcomeRequest: clone(request), auditReference: audit() } };
          }
          const estimate = estimates.get(`${auth.tenantId}:${request.estimateId}`);
          if (!estimate || estimate.status !== "SENT") return { status: 409, body: { code: "ESTIMATE_NOT_ACTIONABLE" } };
          const outcome = commitOutcome({ estimate, outcome: request.outcome, selectedLineIds: request.selectedLineIds,
            source: "MANUAL", evidence: request.evidence, now, checkerMembershipId: auth.membershipId });
          if (outcome.status === 200) request.status = "APPROVED";
          return outcome;
        });
      }

      const manualRequest = path.match(/^\/api\/v1\/estimates\/([^/]+)\/manual-outcome-requests$/);
      if (manualRequest) {
        const auth = authorize(this.token, body.branchId, "estimate.manual-outcome");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const estimate = visibleEstimate(auth, branchId, manualRequest[1]);
        if (!estimate) return { status: 404, body: { code: "ESTIMATE_NOT_FOUND" } };
        if (estimate.status !== "SENT") return { status: 409, body: { code: "ESTIMATE_NOT_ACTIONABLE" } };
        if (!recentlyReauthenticated(options)) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
        return execute(auth, path, body, options, () => {
          const customerName = String(body.customerName ?? "").trim();
          const contactLast4 = String(body.contactLast4 ?? "").trim();
          const acknowledgement = String(body.acknowledgement ?? "").trim();
          const channel = String(body.channel ?? "").trim();
          const attachmentRef = String(body.attachmentRef ?? "").trim();
          const reason = String(body.reason ?? "").trim();
          if (!customerName || !/^\d{4}$/.test(contactLast4) || !acknowledgement || !channel || !attachmentRef || !reason) {
            return { status: 422, body: { code: "MANUAL_EVIDENCE_REQUIRED" } };
          }
          const outcome = body.outcome as ApprovalOutcome["outcome"];
          if (!["APPROVE_ALL", "APPROVE_PARTIAL", "REJECT", "CLARIFY"].includes(outcome)) {
            return { status: 422, body: { code: "INVALID_APPROVAL_OUTCOME" } };
          }
          const configuration = input.configurations.find((candidate) => candidate.tenantId === estimate.tenantId && candidate.branchId === estimate.branchId && candidate.versionId === estimate.configurationVersionId)!;
          let selectedLineIds: string[] = [];
          if (outcome === "APPROVE_ALL") selectedLineIds = estimate.lines.map((line) => line.id);
          if (outcome === "APPROVE_PARTIAL") {
            selectedLineIds = [...new Set(Array.isArray(body.selectedLineIds) ? body.selectedLineIds.map(String) : [])];
            if (!configuration.allowPartialApproval || selectedLineIds.length === 0 || selectedLineIds.length >= estimate.lines.length ||
                selectedLineIds.some((id) => !estimate.lines.some((line) => line.id === id && line.partialApprovalAllowed))) {
              return { status: 422, body: { code: "PARTIAL_APPROVAL_NOT_ALLOWED" } };
            }
          }
          const now = options.now ?? new Date().toISOString();
          const request: ManualOutcomeRequest = {
            id: `manual-outcome-${manualOutcomeRequests.size + 1}`, estimateId: estimate.id, tenantId: auth.tenantId,
            branchId, outcome, selectedLineIds, evidence: { customerName, contactLast4, acknowledgement, channel, attachmentRef, reason },
            makerMembershipId: auth.membershipId, status: "PENDING_CHECK", createdAt: now,
          };
          manualOutcomeRequests.set(`${auth.tenantId}:${request.id}`, request);
          const threshold = parseMinor(configuration.manualMakerCheckerThresholdMinor);
          const total = parseMinor(estimate.totals.grandTotalMinor)!;
          if (threshold !== undefined && total < threshold) {
            const committed = commitOutcome({ estimate, outcome, selectedLineIds, source: "MANUAL", evidence: request.evidence, now });
            if (committed.status === 200) request.status = "APPROVED";
            return committed;
          }
          return { status: 202, body: { manualOutcomeRequest: clone(request), auditReference: audit() } };
        });
      }

      const create = path.match(/^\/api\/v1\/jobs\/([^/]+)\/estimates$/);
      if (create) {
        const auth = authorize(this.token, body.branchId, "estimate.manage");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const job = input.jobs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === branchId && candidate.id === create[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          const handoff = input.scopeHandoffs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === branchId && candidate.jobId === job.id && candidate.id === body.scopeHandoffId);
          if (!handoff) return { status: 422, body: { code: "SCOPE_HANDOFF_NOT_FOUND" } };
          if (body.kind !== "PRIMARY" && body.kind !== "SUPPLEMENTARY") return { status: 422, body: { code: "INVALID_ESTIMATE_KIND" } };
          const streamEstimateId = consumedHandoffs.get(`${auth.tenantId}:${handoff.id}`);
          const prior = typeof body.priorVersionId === "string" ? visibleEstimate(auth, branchId, body.priorVersionId) : undefined;
          if (streamEstimateId && !prior) return { status: 409, body: { code: "SCOPE_HANDOFF_ALREADY_CONSUMED" } };
          if (prior && (prior.jobId !== job.id || prior.scopeHandoffId !== handoff.id || prior.kind !== body.kind || prior.status === "DRAFT" ||
            [...estimates.values()].some((candidate) => candidate.tenantId === auth.tenantId && candidate.priorVersionId === prior.id))) {
            return { status: 409, body: { code: "INVALID_PRIOR_ESTIMATE_VERSION" } };
          }
          const baseApproved = typeof body.baseApprovedEstimateVersionId === "string"
            ? visibleEstimate(auth, branchId, body.baseApprovedEstimateVersionId)
            : undefined;
          if (body.kind === "SUPPLEMENTARY" && (!baseApproved || baseApproved.jobId !== job.id ||
              !["APPROVED", "PARTIALLY_APPROVED"].includes(baseApproved.status) ||
              (prior && prior.baseApprovedEstimateVersionId !== baseApproved.id))) {
            return { status: 422, body: { code: "APPROVED_BASE_ESTIMATE_REQUIRED" } };
          }
          if (body.kind === "PRIMARY" && body.baseApprovedEstimateVersionId !== undefined) {
            return { status: 422, body: { code: "PRIMARY_ESTIMATE_CANNOT_HAVE_BASE" } };
          }
          const configuration = input.configurations.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === branchId && candidate.versionId === body.configurationVersionId);
          if (!configuration) return { status: 422, body: { code: "ESTIMATE_CONFIGURATION_NOT_FOUND" } };
          const composed = composeLines(body.lines, configuration, job, handoff);
          if ("status" in composed) return composed;
          const now = options.now ?? new Date().toISOString();
          const id = `estimate-${++estimateSequence}`;
          const estimate: Estimate = {
            id, tenantId: auth.tenantId, branchId, jobId: job.id, kind: body.kind,
            scopeHandoffId: handoff.id, configurationVersionId: configuration.versionId,
            ...(prior ? { priorVersionId: prior.id } : {}), revision: prior ? prior.revision + 1 : 1,
            ...(baseApproved ? { baseApprovedEstimateVersionId: baseApproved.id } : {}),
            status: "DRAFT", ...(typeof body.notes === "string" && body.notes.trim() ? { notes: body.notes.trim() } : {}),
            lines: composed.lines, totals: composed.totals, payerTotals: composed.payerTotals, resourceVersion: 1, createdAt: now,
          };
          estimates.set(`${auth.tenantId}:${id}`, estimate);
          if (!streamEstimateId) consumedHandoffs.set(`${auth.tenantId}:${handoff.id}`, id);
          return { status: 201, body: { estimate: clone(estimate), resourceVersion: 1, auditReference: audit() } };
        });
      }

      const send = path.match(/^\/api\/v1\/estimates\/([^/]+)\/send$/);
      if (send) {
        const auth = authorize(this.token, body.branchId, "estimate.send");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        return execute(auth, path, body, options, () => {
          const estimate = visibleEstimate(auth, branchId, send[1]);
          if (!estimate) return { status: 404, body: { code: "ESTIMATE_NOT_FOUND" } };
          if (estimate.status !== "DRAFT") return { status: 409, body: { code: "ESTIMATE_VERSION_IMMUTABLE" } };
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== estimate.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: estimate.resourceVersion } };
          if (typeof body.financialYear !== "string" || !/^\d{4}-\d{2}$/.test(body.financialYear)) return { status: 422, body: { code: "INVALID_FINANCIAL_YEAR" } };
          const now = options.now ?? new Date().toISOString();
          const configuration = input.configurations.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === branchId && candidate.versionId === estimate.configurationVersionId)!;
          const sequenceKey = `${auth.tenantId}:${branchId}:${body.financialYear}`;
          const sequence = (documentSequences.get(sequenceKey) ?? 0n) + 1n;
          documentSequences.set(sequenceKey, sequence);
          const rawToken = randomBytes(32).toString("base64url");
          const validUntil = new Date(Date.parse(now) + configuration.validityDays * 86_400_000).toISOString();
          const next: Estimate = { ...estimate, number: `EST/${body.financialYear}/${sequence.toString().padStart(6, "0")}`, status: "SENT", sentAt: now, validUntil, resourceVersion: estimate.resourceVersion + 1 };
          estimates.set(`${auth.tenantId}:${estimate.id}`, next);
          publicTokenDigests.set(hash(rawToken), { estimateId: estimate.id, tenantId: auth.tenantId, expiresAt: validUntil });
          return { status: 200, body: { estimate: clone(next), publicToken: rawToken, resourceVersion: next.resourceVersion, auditReference: audit() } };
        });
      }
      return { status: 404, body: { code: "NOT_FOUND" } };
    }

    async get(path: string): Promise<ApiResponse> {
      const match = path.match(/^\/api\/v1\/estimates\/([^/?]+)\?branchId=([^&]+)$/);
      if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
      const branchId = decodeURIComponent(match[2]);
      const auth = authorize(this.token, branchId, "estimate.read");
      if ("status" in auth) return auth;
      const estimate = visibleEstimate(auth, branchId, match[1]);
      if (!estimate) return { status: 404, body: { code: "ESTIMATE_NOT_FOUND" } };
      const activation = activations.get(`${auth.tenantId}:${estimate.id}`);
      return { status: 200, body: {
        estimate: clone(estimate),
        approvalOutcomes: clone(approvalOutcomes.filter((item) => item.estimateId === estimate.id)),
        ...(activation ? {
          activation: clone(activation),
          workPlanningHandoffs: clone(workPlanningHandoffs.filter((item) => item.activationId === activation.id)),
          materialControlHandoffs: clone(materialControlHandoffs.filter((item) => item.activationId === activation.id)),
        } : { workPlanningHandoffs: [], materialControlHandoffs: [] }),
      } };
    }

    async patch(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const match = path.match(/^\/api\/v1\/estimates\/([^/]+)$/);
      if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
      const auth = authorize(this.token, body.branchId, "estimate.manage");
      if ("status" in auth) return auth;
      const estimate = visibleEstimate(auth, String(body.branchId), match[1]);
      if (!estimate) return { status: 404, body: { code: "ESTIMATE_NOT_FOUND" } };
      if (estimate.status !== "DRAFT") return { status: 409, body: { code: "ESTIMATE_VERSION_IMMUTABLE" } };
      return execute(auth, path, body, options, () => {
        if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
        if (options.ifMatch !== estimate.resourceVersion) return { status: 412, body: { code: "RESOURCE_VERSION_MISMATCH", resourceVersion: estimate.resourceVersion } };
        const configuration = input.configurations.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === estimate.branchId && candidate.versionId === estimate.configurationVersionId)!;
        const job = input.jobs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === estimate.branchId && candidate.id === estimate.jobId)!;
        const handoff = input.scopeHandoffs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === estimate.branchId && candidate.id === estimate.scopeHandoffId)!;
        const composed = composeLines(body.lines, configuration, job, handoff);
        if ("status" in composed) return composed;
        const next: Estimate = {
          ...estimate, ...(typeof body.notes === "string" && body.notes.trim() ? { notes: body.notes.trim() } : {}),
          lines: composed.lines, totals: composed.totals, payerTotals: composed.payerTotals, resourceVersion: estimate.resourceVersion + 1,
        };
        estimates.set(`${auth.tenantId}:${estimate.id}`, next);
        return { status: 200, body: { estimate: clone(next), resourceVersion: next.resourceVersion, auditReference: audit() } };
      });
    }
  }

  const findPublicAction = (rawToken: string, now: string) => {
    const token = publicTokenDigests.get(hash(rawToken));
    if (!token) return { error: { status: 404, body: { code: "ACTION_LINK_UNAVAILABLE" } } as ApiResponse };
    if (token.usedAt || Date.parse(now) > Date.parse(token.expiresAt)) return { error: { status: 410, body: { code: "ACTION_LINK_UNAVAILABLE" } } as ApiResponse };
    const estimate = estimates.get(`${token.tenantId}:${token.estimateId}`);
    if (!estimate || estimate.status !== "SENT") return { error: { status: 410, body: { code: "ACTION_LINK_UNAVAILABLE" } } as ApiResponse };
    return { token, estimate };
  };

  const publicApi = {
    async get(path: string, options: Pick<CommandOptions, "now"> = {}): Promise<ApiResponse> {
      const match = path.match(/^\/api\/v1\/public\/estimate-actions\/([^/?]+)$/);
      if (!match) return { status: 404, body: { code: "ACTION_LINK_UNAVAILABLE" } };
      const found = findPublicAction(match[1], options.now ?? new Date().toISOString());
      if (found.error) return found.error;
      const estimate = found.estimate!;
      const configuration = input.configurations.find((candidate) => candidate.tenantId === estimate.tenantId && candidate.branchId === estimate.branchId && candidate.versionId === estimate.configurationVersionId)!;
      return { status: 200, body: {
        estimateNumber: estimate.number, currency: estimate.totals.currency, totalMinor: estimate.totals.grandTotalMinor,
        validUntil: estimate.validUntil,
        lines: estimate.lines.map((line) => ({ id: line.id, description: line.description, quantity: line.quantity, uom: line.uom, totalMinor: line.totalMinor, partialApprovalAllowed: line.partialApprovalAllowed })),
        allowedOutcomes: configuration.allowPartialApproval ? ["APPROVE_ALL", "APPROVE_PARTIAL", "REJECT", "CLARIFY"] : ["APPROVE_ALL", "REJECT", "CLARIFY"],
      } };
    },
    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const match = path.match(/^\/api\/v1\/public\/estimate-actions\/([^/?]+)$/);
      if (!match) return { status: 404, body: { code: "ACTION_LINK_UNAVAILABLE" } };
      const now = options.now ?? new Date().toISOString();
      const found = findPublicAction(match[1], now);
      if (found.error) return found.error;
      const estimate = found.estimate!;
      const token = found.token!;
      const outcome = body.outcome as ApprovalOutcome["outcome"];
      if (!(["APPROVE_ALL", "APPROVE_PARTIAL", "REJECT", "CLARIFY"] as unknown[]).includes(outcome)) return { status: 422, body: { code: "INVALID_APPROVAL_OUTCOME" } };
      const customerName = String(body.customerName ?? "").trim();
      const contactLast4 = String(body.contactLast4 ?? "").trim();
      const acknowledgement = String(body.acknowledgement ?? "").trim();
      const message = typeof body.message === "string" && body.message.trim() ? body.message.trim() : undefined;
      if (!customerName || !/^\d{4}$/.test(contactLast4) || !acknowledgement || !options.ipAddress?.trim() || !options.userAgent?.trim()) {
        return { status: 422, body: { code: "CUSTOMER_ACTION_EVIDENCE_REQUIRED" } };
      }
      const configuration = input.configurations.find((candidate) => candidate.tenantId === estimate.tenantId && candidate.branchId === estimate.branchId && candidate.versionId === estimate.configurationVersionId)!;
      let selectedLineIds: string[] = [];
      if (outcome === "APPROVE_ALL") selectedLineIds = estimate.lines.map((line) => line.id);
      if (outcome === "APPROVE_PARTIAL") {
        const selected = Array.isArray(body.selectedLineIds) ? body.selectedLineIds.map(String) : [];
        const unique = [...new Set(selected)];
        if (!configuration.allowPartialApproval || unique.length === 0 || unique.length >= estimate.lines.length ||
          unique.some((id) => !estimate.lines.some((line) => line.id === id && line.partialApprovalAllowed))) {
          return { status: 422, body: { code: "PARTIAL_APPROVAL_NOT_ALLOWED" } };
        }
        selectedLineIds = unique;
      }
      if ((outcome === "REJECT" || outcome === "CLARIFY") && Array.isArray(body.selectedLineIds) && body.selectedLineIds.length) {
        return { status: 422, body: { code: "LINE_SCOPE_NOT_ALLOWED_FOR_OUTCOME" } };
      }
      const committed = commitOutcome({ estimate, outcome, selectedLineIds, source: "PUBLIC_LINK",
        evidence: { customerName, contactLast4, acknowledgement, ...(message ? { message } : {}), ipAddress: options.ipAddress, userAgent: options.userAgent }, now });
      if (committed.status !== 200) return committed;
      token.usedAt = now;
      return { status: 200, body: { outcome: committed.body.outcome, recordedAt: committed.body.recordedAt, receiptReference: committed.body.receiptReference } };
    },
  };

  return { signIn: (token: string) => new Session(token), public: publicApi };
}
