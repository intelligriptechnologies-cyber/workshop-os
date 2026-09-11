import { createLocalInventoryApi } from "./inventory-ledger.js";

export type ProcurementMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  warehouseIds: string[];
  permissions: string[];
};

type ApiBody = Record<string, any>;
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string };
type Evidence = { privateObjectRef: string; checksum: string; scanStatus: "CLEAN"; capturedAt: string; kind?: string };
type Supplier = {
  id: string; tenantId: string; branchId: string; legalName: string; tradeName?: string; gstin?: string; pan?: string;
  taxTreatment: "REGISTERED" | "COMPOSITION" | "UNREGISTERED" | "OVERSEAS"; currency: string; paymentTermsDays: number;
  contacts: ApiBody[]; addresses: ApiBody[]; itemRelations: ApiBody[]; status: "ACTIVE" | "ON_HOLD" | "INACTIVE";
  resourceVersion: number; createdByMembershipId: string;
};
type QuantityLine = { id: string; itemId: string; quantity: bigint; uom: string; cancelledQuantity: bigint; receivedQuantity: bigint; resourceVersion: number; [key: string]: any };
type Requisition = {
  id: string; tenantId: string; branchId: string; purpose: string; lines: QuantityLine[];
  status: "DRAFT" | "APPROVAL_PENDING" | "APPROVED" | "PARTIALLY_ORDERED" | "ORDERED" | "PARTIALLY_CANCELLED" | "CANCELLED" | "REJECTED";
  makerMembershipId: string; resourceVersion: number;
};
type PoLine = QuantityLine & {
  requisitionLineId?: string; unitPriceMinor: bigint; discountMinor: bigint; gstRateBps: number;
  taxableMinor: bigint; gstMinor: bigint; landedCostMinor: bigint; inventoryValueMinor: bigint;
};
type PurchaseOrder = {
  id: string; tenantId: string; branchId: string; supplierId: string; requisitionId?: string; currency: string; terms: string;
  lines: PoLine[]; landedCostInputs: Array<{ id: string; kind: string; amountMinor: bigint; recoverableTaxMinor: bigint }>;
  totals: { taxableMinor: bigint; gstMinor: bigint; landedCostMinor: bigint; recoverableTaxMinor: bigint; payableMinor: bigint; inventoryValueMinor: bigint };
  status: "DRAFT" | "APPROVAL_PENDING" | "APPROVED" | "PARTIALLY_FULFILLED" | "FULFILLED" | "PARTIALLY_CANCELLED" | "CANCELLED" | "REJECTED";
  makerMembershipId: string; resourceVersion: number;
};
type GrnLine = {
  id: string; purchaseOrderLineId: string; itemId: string; receivedQuantity: bigint; rejectedQuantity: bigint; acceptedQuantity: bigint;
  uom: string; warehouseId: string; binId: string | null; lot?: ApiBody; roll?: ApiBody; inspection: ApiBody;
  discrepancy?: { status: "OPEN" | "RESOLVED"; reason: string; resolution?: string; resolvedByMembershipId?: string; auditReference?: string };
  taxableMinor: bigint; gstMinor: bigint; landedCostMinor: bigint; inventoryValueMinor: bigint;
};
type Grn = {
  id: string; tenantId: string; branchId: string; purchaseOrderId: string; supplierDocumentNumber: string; supplierDocumentDate: string;
  documents: Evidence[]; lines: GrnLine[]; totals: { acceptedTaxableMinor: bigint; gstMinor: bigint; landedCostMinor: bigint; inventoryValueMinor: bigint };
  status: "POSTED" | "POSTED_WITH_DISCREPANCY" | "DISCREPANCY_RESOLVED"; resourceVersion: number; actorMembershipId: string;
};
type PurchaseReturnLine = {
  id: string; grnLineId: string; itemId: string; quantity: bigint; uom: string; warehouseId: string; binId: string | null;
  lotId: string | null; remnantId: string | null; taxableMinor: bigint; gstMinor: bigint; landedCostMinor: bigint; inventoryValueMinor: bigint;
};
type PurchaseReturn = {
  id: string; tenantId: string; branchId: string; purchaseOrderId: string; supplierId: string; reason: string; lines: PurchaseReturnLine[];
  shipmentEvidence: Evidence[]; status: "APPROVAL_PENDING" | "APPROVED_POSTED" | "REJECTED"; makerMembershipId: string; resourceVersion: number;
};
type HistoryEntry = { entityType: string; entityId: string; action: string; resourceVersion: number; actorMembershipId: string; reason: string; auditReference: string; occurredAt: string; snapshot: ApiBody };
type ApprovalEntry = { entityType: "REQUISITION" | "PURCHASE_ORDER" | "PURCHASE_RETURN"; entityId: string; makerMembershipId: string; checkerMembershipId: string; decision: "APPROVE" | "REJECT"; thresholdMinor?: string; reason: string; auditReference: string; occurredAt: string };
type FinancialEvent = { type: "GRN_VALUE_POSTED" | "PURCHASE_RETURN_CREDIT_EXPECTED"; sourceId: string; amountMinor: string; gstMinor: string; compensating: boolean; auditReference: string; occurredAt: string };

const SCALE = 1_000_000n;
const clone = <T>(value: T): T => structuredClone(value);
const validId = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const validDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`));
const validInstant = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
const parseMinor = (value: unknown): bigint | undefined => typeof value === "string" && /^(0|[1-9]\d*)$/.test(value) ? BigInt(value) : undefined;
function parseQuantity(value: unknown): bigint | undefined {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(value)) return undefined;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(6, "0"));
}
function formatQuantity(value: bigint): string {
  const whole = value / SCALE;
  const fraction = (value % SCALE).toString().padStart(6, "0").replace(/0+$/, "");
  return `${whole}${fraction ? `.${fraction}` : ""}`;
}
const roundRatio = (value: bigint, numerator: bigint, denominator: bigint) => (value * numerator + denominator / 2n) / denominator;
const response = (status: number, code: string): ApiResponse => ({ status, body: { code } });
function stableJson(value: unknown): string {
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, nested]) => `${JSON.stringify(key)}:${stableJson(nested)}`).join(",")}}`;
  return JSON.stringify(value);
}

export function createLocalProcurementApi(input: {
  memberships: Record<string, ProcurementMembership>;
  inventory: ReturnType<typeof createLocalInventoryApi>;
  approvalThresholds?: { purchaseOrderMinor?: string; purchaseReturnMinor?: string; requisitionRequiresApproval?: boolean };
}) {
  const suppliers = new Map<string, Supplier>();
  const requisitions = new Map<string, Requisition>();
  const purchaseOrders = new Map<string, PurchaseOrder>();
  const grns = new Map<string, Grn>();
  const returns = new Map<string, PurchaseReturn>();
  const history: HistoryEntry[] = [];
  const approvals: ApprovalEntry[] = [];
  const financialEvents: FinancialEvent[] = [];
  const receipts = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const inFlight = new Map<string, { fingerprint: string; result: Promise<ApiResponse> }>();
  const pendingGrnQuantity = new Map<string, bigint>();
  const approvingReturns = new Set<string>();
  let auditSequence = 0;
  const poThreshold = parseMinor(input.approvalThresholds?.purchaseOrderMinor ?? "0") ?? 0n;
  const returnThreshold = parseMinor(input.approvalThresholds?.purchaseReturnMinor ?? "0") ?? 0n;
  const requisitionRequiresApproval = input.approvalThresholds?.requisitionRequiresApproval !== false;

  const auth = (token: string, branchId: unknown, permission: string, warehouseIds: unknown[] = []) => {
    const membership = input.memberships[token];
    if (!membership) return { error: response(401, "AUTHENTICATION_REQUIRED") };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) return { error: response(403, "BRANCH_FORBIDDEN") };
    if (!membership.permissions.includes(permission)) return { error: response(403, "PERMISSION_DENIED") };
    if (warehouseIds.some((id) => typeof id !== "string" || !membership.warehouseIds.includes(id))) return { error: response(403, "WAREHOUSE_FORBIDDEN") };
    return { membership };
  };
  const tenantKey = (membership: ProcurementMembership, branchId: string, id: string) => `${membership.tenantId}:${branchId}:${id}`;
  const command = async (membership: ProcurementMembership, options: CommandOptions, body: ApiBody, action: (audit: string, now: string) => Promise<ApiResponse> | ApiResponse): Promise<ApiResponse> => {
    if (!options.idempotencyKey?.trim()) return response(400, "IDEMPOTENCY_KEY_REQUIRED");
    const key = `${membership.tenantId}:${options.idempotencyKey}`;
    const fingerprint = stableJson(body);
    const replay = receipts.get(key);
    if (replay) return replay.fingerprint === fingerprint ? { status: 200, body: clone(replay.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
    const pending = inFlight.get(key);
    if (pending) {
      if (pending.fingerprint !== fingerprint) return response(409, "IDEMPOTENCY_KEY_REUSED");
      const replayResult = await pending.result;
      return replayResult.status >= 200 && replayResult.status < 300 ? { status: 200, body: clone(replayResult.body) } : clone(replayResult);
    }
    const audit = `audit-${membership.tenantId}-${++auditSequence}`;
    const resultPromise = Promise.resolve().then(() => action(audit, options.now ?? new Date().toISOString()));
    inFlight.set(key, { fingerprint, result: resultPromise });
    try {
      const result = await resultPromise;
      if (result.status >= 200 && result.status < 300) {
        result.body.auditReference ??= audit;
        receipts.set(key, { fingerprint, response: clone(result) });
      }
      return clone(result);
    } finally {
      inFlight.delete(key);
    }
  };
  const record = (entityType: string, entity: { id: string; resourceVersion: number }, action: string, membership: ProcurementMembership, reason: string, audit: string, now: string, snapshot: ApiBody) => {
    history.push({ entityType, entityId: entity.id, action, resourceVersion: entity.resourceVersion, actorMembershipId: membership.membershipId, reason, auditReference: audit, occurredAt: now, snapshot: clone(snapshot) });
  };
  const versionError = (entity: { resourceVersion: number }, options: CommandOptions) => options.ifMatch === undefined ? response(428, "IF_MATCH_REQUIRED") : options.ifMatch !== entity.resourceVersion ? response(412, "VERSION_CONFLICT") : undefined;

  class Session {
    constructor(private readonly token: string) {}
    async post(path: string, body: ApiBody, options: CommandOptions = {}): Promise<ApiResponse> {
      if (path === "/api/v1/procurement/suppliers") return createSupplier(this.token, body, options);
      if (path === "/api/v1/procurement/requisitions") return createRequisition(this.token, body, options);
      if (path === "/api/v1/procurement/purchase-orders") return createPurchaseOrder(this.token, body, options);
      if (path === "/api/v1/procurement/grns") return createGrn(this.token, body, options);
      if (path === "/api/v1/procurement/purchase-returns") return createPurchaseReturn(this.token, body, options);
      let match = path.match(/^\/api\/v1\/procurement\/requisitions\/([^/]+)\/(submit|approval|cancel)$/);
      if (match) return requisitionCommand(this.token, match[1], match[2], body, options);
      match = path.match(/^\/api\/v1\/procurement\/purchase-orders\/([^/]+)\/(submit|approval|cancel)$/);
      if (match) return purchaseOrderCommand(this.token, match[1], match[2], body, options);
      match = path.match(/^\/api\/v1\/procurement\/grns\/([^/]+)\/discrepancy-resolution$/);
      if (match) return resolveGrnDiscrepancy(this.token, match[1], body, options);
      match = path.match(/^\/api\/v1\/procurement\/purchase-returns\/([^/]+)\/approval$/);
      if (match) return approvePurchaseReturn(this.token, match[1], body, options);
      return response(404, "NOT_FOUND");
    }
    async patch(path: string, body: ApiBody, options: CommandOptions = {}): Promise<ApiResponse> {
      let match = path.match(/^\/api\/v1\/procurement\/suppliers\/([^/]+)$/);
      if (match) return updateSupplier(this.token, match[1], body, options);
      match = path.match(/^\/api\/v1\/procurement\/requisitions\/([^/]+)$/);
      if (match) return updateRequisition(this.token, match[1], body, options);
      match = path.match(/^\/api\/v1\/procurement\/purchase-orders\/([^/]+)$/);
      if (match) return updatePurchaseOrder(this.token, match[1], body, options);
      return response(404, "NOT_FOUND");
    }
    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "https://local.invalid");
      const branchId = url.searchParams.get("branchId");
      const authorization = auth(this.token, branchId, "procurement.view");
      if (authorization.error) return authorization.error;
      const membership = authorization.membership!;
      const collection = url.pathname === "/api/v1/procurement/suppliers" ? suppliers : url.pathname === "/api/v1/procurement/requisitions" ? requisitions : url.pathname === "/api/v1/procurement/purchase-orders" ? purchaseOrders : url.pathname === "/api/v1/procurement/grns" ? grns : url.pathname === "/api/v1/procurement/purchase-returns" ? returns : undefined;
      if (!collection) return response(404, "NOT_FOUND");
      const values = [...collection.values()].filter((entry) => entry.tenantId === membership.tenantId && entry.branchId === branchId).map(serializeEntity);
      return { status: 200, body: { items: values } };
    }
  }

  async function createSupplier(token: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "supplier.manage");
    if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const validation = validateSupplier(body, membership);
      if (validation) return validation;
      const key = tenantKey(membership, body.branchId, body.id);
      if (suppliers.has(key)) return response(409, "SUPPLIER_EXISTS");
      const duplicate = [...suppliers.values()].find((supplier) => supplier.tenantId === membership.tenantId && (body.gstin && supplier.gstin === body.gstin || normalize(supplier.legalName) === normalize(body.legalName) || body.pan && supplier.pan === body.pan));
      if (duplicate) return { status: 409, body: { code: "SUPPLIER_DUPLICATE", duplicateSupplierId: duplicate.id } };
      const supplier: Supplier = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, legalName: body.legalName.trim(), tradeName: body.tradeName?.trim(), gstin: body.gstin, pan: body.pan,
        taxTreatment: body.taxTreatment, currency: body.currency, paymentTermsDays: body.paymentTermsDays, contacts: clone(body.contacts), addresses: clone(body.addresses), itemRelations: clone(body.itemRelations), status: body.status, resourceVersion: 1, createdByMembershipId: membership.membershipId };
      suppliers.set(key, supplier);
      record("SUPPLIER", supplier, "CREATED", membership, "Supplier master created", audit, now, serializeSupplier(supplier));
      return { status: 201, body: { supplier: serializeSupplier(supplier), resourceVersion: 1 } };
    });
  }

  async function updateSupplier(token: string, id: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "supplier.manage");
    if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const supplier = suppliers.get(tenantKey(membership, body.branchId, id));
      if (!supplier) return response(404, "SUPPLIER_NOT_FOUND");
      const stale = versionError(supplier, options); if (stale) return stale;
      if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
      const candidate: ApiBody = { ...serializeSupplier(supplier), ...body, id: supplier.id, branchId: supplier.branchId };
      const validation = validateSupplier(candidate, membership); if (validation) return validation;
      const duplicate = [...suppliers.values()].find((entry) => entry !== supplier && entry.tenantId === membership.tenantId && (candidate.gstin && entry.gstin === candidate.gstin || normalize(entry.legalName) === normalize(candidate.legalName)));
      if (duplicate) return { status: 409, body: { code: "SUPPLIER_DUPLICATE", duplicateSupplierId: duplicate.id } };
      Object.assign(supplier, { legalName: candidate.legalName, tradeName: candidate.tradeName, gstin: candidate.gstin, pan: candidate.pan, taxTreatment: candidate.taxTreatment, currency: candidate.currency,
        paymentTermsDays: candidate.paymentTermsDays, contacts: clone(candidate.contacts), addresses: clone(candidate.addresses), itemRelations: clone(candidate.itemRelations), status: candidate.status });
      supplier.resourceVersion += 1;
      record("SUPPLIER", supplier, "UPDATED", membership, body.reason, audit, now, serializeSupplier(supplier));
      return { status: 200, body: { supplier: serializeSupplier(supplier), resourceVersion: supplier.resourceVersion } };
    });
  }

  async function createRequisition(token: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "procurement.request"); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      if (!validId(body.id) || !validId(body.purpose) || !Array.isArray(body.lines) || body.lines.length === 0) return response(422, "INVALID_REQUISITION");
      const lines = parseQuantityLines(body.lines); if (!lines) return response(422, "INVALID_REQUISITION_LINES");
      if (new Set(lines.map((line) => line.id)).size !== lines.length) return response(422, "DUPLICATE_LINE_ID");
      const key = tenantKey(membership, body.branchId, body.id); if (requisitions.has(key)) return response(409, "REQUISITION_EXISTS");
      const requisition: Requisition = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, purpose: body.purpose, lines, status: "DRAFT", makerMembershipId: membership.membershipId, resourceVersion: 1 };
      requisitions.set(key, requisition); record("REQUISITION", requisition, "CREATED", membership, body.purpose, audit, now, serializeRequisition(requisition));
      return { status: 201, body: { requisition: serializeRequisition(requisition), resourceVersion: 1 } };
    });
  }

  async function updateRequisition(token: string, id: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "procurement.request"); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const requisition = requisitions.get(tenantKey(membership, body.branchId, id)); if (!requisition) return response(404, "REQUISITION_NOT_FOUND");
      const stale = versionError(requisition, options); if (stale) return stale;
      if (requisition.status !== "DRAFT") return response(409, "REQUISITION_IMMUTABLE");
      if (!validId(body.reason) || !validId(body.purpose) || !Array.isArray(body.lines) || body.lines.length === 0) return response(422, "INVALID_REQUISITION");
      const lines = parseQuantityLines(body.lines); if (!lines || new Set(lines.map((line) => line.id)).size !== lines.length) return response(422, "INVALID_REQUISITION_LINES");
      requisition.purpose = body.purpose; requisition.lines = lines; requisition.resourceVersion += 1;
      record("REQUISITION", requisition, "DRAFT_REVISED", membership, body.reason, audit, now, serializeRequisition(requisition));
      return { status: 200, body: { requisition: serializeRequisition(requisition), resourceVersion: requisition.resourceVersion } };
    });
  }

  async function requisitionCommand(token: string, id: string, action: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const permission = action === "approval" ? "procurement.approve" : "procurement.request";
    const authorization = auth(token, body.branchId, permission); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const requisition = requisitions.get(tenantKey(membership, body.branchId, id)); if (!requisition) return response(404, "REQUISITION_NOT_FOUND");
      const stale = versionError(requisition, options); if (stale) return stale;
      if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
      if (action === "submit") {
        if (requisition.status !== "DRAFT") return response(409, "REQUISITION_NOT_DRAFT");
        requisition.status = requisitionRequiresApproval ? "APPROVAL_PENDING" : "APPROVED";
      } else if (action === "approval") {
        if (requisition.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
        if (membership.membershipId === requisition.makerMembershipId) return response(403, "MAKER_CANNOT_CHECK");
        if (!(body.decision === "APPROVE" || body.decision === "REJECT")) return response(422, "INVALID_APPROVAL_DECISION");
        requisition.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
        approvals.push({ entityType: "REQUISITION", entityId: requisition.id, makerMembershipId: requisition.makerMembershipId, checkerMembershipId: membership.membershipId, decision: body.decision, reason: body.reason, auditReference: audit, occurredAt: now });
      } else {
        if (!["DRAFT", "APPROVAL_PENDING", "APPROVED", "PARTIALLY_ORDERED"].includes(requisition.status)) return response(409, "REQUISITION_NOT_CANCELLABLE");
        for (const line of requisition.lines) line.cancelledQuantity = line.quantity - line.receivedQuantity;
        requisition.status = requisition.lines.some((line) => line.receivedQuantity > 0n) ? "PARTIALLY_CANCELLED" : "CANCELLED";
      }
      requisition.resourceVersion += 1; record("REQUISITION", requisition, action.toUpperCase(), membership, body.reason, audit, now, serializeRequisition(requisition));
      return { status: action === "submit" && requisition.status === "APPROVAL_PENDING" ? 202 : 200, body: { requisition: serializeRequisition(requisition), resourceVersion: requisition.resourceVersion } };
    });
  }

  async function createPurchaseOrder(token: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "procurement.order"); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const supplier = suppliers.get(tenantKey(membership, body.branchId, body.supplierId));
      if (!supplier) return response(422, "SUPPLIER_NOT_FOUND"); if (supplier.status !== "ACTIVE") return response(422, "SUPPLIER_NOT_ACTIVE");
      const requisition = body.requisitionId ? requisitions.get(tenantKey(membership, body.branchId, body.requisitionId)) : undefined;
      if (body.requisitionId && (!requisition || !["APPROVED", "PARTIALLY_ORDERED"].includes(requisition.status))) return response(422, "REQUISITION_NOT_APPROVED");
      if (!validId(body.id) || body.currency !== supplier.currency || !validId(body.terms) || !Array.isArray(body.lines) || body.lines.length === 0 || !Array.isArray(body.landedCostInputs)) return response(422, "INVALID_PURCHASE_ORDER");
      const parsed = calculatePo(body, requisition); if ("status" in parsed) return parsed;
      const key = tenantKey(membership, body.branchId, body.id); if (purchaseOrders.has(key)) return response(409, "PURCHASE_ORDER_EXISTS");
      const po: PurchaseOrder = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, supplierId: body.supplierId, requisitionId: body.requisitionId, currency: body.currency, terms: body.terms,
        lines: parsed.lines, landedCostInputs: parsed.landed, totals: parsed.totals, status: "DRAFT", makerMembershipId: membership.membershipId, resourceVersion: 1 };
      purchaseOrders.set(key, po); record("PURCHASE_ORDER", po, "CREATED", membership, "Purchase order draft created", audit, now, serializePo(po));
      return { status: 201, body: { purchaseOrder: serializePo(po), resourceVersion: 1 } };
    });
  }

  async function updatePurchaseOrder(token: string, id: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "procurement.order"); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const po = purchaseOrders.get(tenantKey(membership, body.branchId, id)); if (!po) return response(404, "PURCHASE_ORDER_NOT_FOUND");
      const stale = versionError(po, options); if (stale) return stale;
      if (po.status !== "DRAFT") return response(409, "PURCHASE_ORDER_IMMUTABLE");
      if (!validId(body.reason) || !validId(body.terms) || !Array.isArray(body.lines) || body.lines.length === 0 || !Array.isArray(body.landedCostInputs)) return response(422, "INVALID_PURCHASE_ORDER");
      const requisition = po.requisitionId ? requisitions.get(tenantKey(membership, po.branchId, po.requisitionId)) : undefined;
      const parsed = calculatePo(body, requisition); if ("status" in parsed) return parsed;
      po.terms = body.terms; po.lines = parsed.lines; po.landedCostInputs = parsed.landed; po.totals = parsed.totals; po.resourceVersion += 1;
      record("PURCHASE_ORDER", po, "DRAFT_REVISED", membership, body.reason, audit, now, serializePo(po));
      return { status: 200, body: { purchaseOrder: serializePo(po), resourceVersion: po.resourceVersion } };
    });
  }

  async function purchaseOrderCommand(token: string, id: string, action: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const permission = action === "approval" ? "procurement.approve" : "procurement.order";
    const authorization = auth(token, body.branchId, permission); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const po = purchaseOrders.get(tenantKey(membership, body.branchId, id)); if (!po) return response(404, "PURCHASE_ORDER_NOT_FOUND");
      const stale = versionError(po, options); if (stale) return stale;
      if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
      if (action === "submit") {
        if (po.status !== "DRAFT") return response(409, "PURCHASE_ORDER_NOT_DRAFT");
        po.status = po.totals.payableMinor >= poThreshold ? "APPROVAL_PENDING" : "APPROVED";
      } else if (action === "approval") {
        if (po.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
        if (membership.membershipId === po.makerMembershipId) return response(403, "MAKER_CANNOT_CHECK");
        if (!(body.decision === "APPROVE" || body.decision === "REJECT")) return response(422, "INVALID_APPROVAL_DECISION");
        po.status = body.decision === "APPROVE" ? "APPROVED" : "REJECTED";
        approvals.push({ entityType: "PURCHASE_ORDER", entityId: po.id, makerMembershipId: po.makerMembershipId, checkerMembershipId: membership.membershipId, decision: body.decision, thresholdMinor: poThreshold.toString(), reason: body.reason, auditReference: audit, occurredAt: now });
      } else {
        if (!["DRAFT", "APPROVAL_PENDING", "APPROVED", "PARTIALLY_FULFILLED"].includes(po.status)) return response(409, "PURCHASE_ORDER_NOT_CANCELLABLE");
        const requested = Array.isArray(body.lines) ? body.lines : po.lines.map((line) => ({ lineId: line.id, quantity: formatQuantity(line.quantity - line.receivedQuantity - line.cancelledQuantity) }));
        for (const request of requested) {
          const line = po.lines.find((candidate) => candidate.id === request.lineId); const quantity = parseQuantity(request.quantity);
          if (!line || quantity === undefined || quantity <= 0n || line.receivedQuantity + line.cancelledQuantity + quantity > line.quantity) return response(422, "INVALID_CANCELLATION_QUANTITY");
        }
        for (const request of requested) po.lines.find((candidate) => candidate.id === request.lineId)!.cancelledQuantity += parseQuantity(request.quantity)!;
        const allClosed = po.lines.every((line) => line.receivedQuantity + line.cancelledQuantity === line.quantity);
        po.status = allClosed && po.lines.every((line) => line.receivedQuantity === 0n) ? "CANCELLED" : "PARTIALLY_CANCELLED";
      }
      po.resourceVersion += 1; record("PURCHASE_ORDER", po, action.toUpperCase(), membership, body.reason, audit, now, serializePo(po));
      return { status: action === "submit" && po.status === "APPROVAL_PENDING" ? 202 : 200, body: { purchaseOrder: serializePo(po), resourceVersion: po.resourceVersion } };
    });
  }

  async function createGrn(token: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const warehouseIds = Array.isArray(body.lines) ? body.lines.map((line: ApiBody) => line.warehouseId) : [];
    const authorization = auth(token, body.branchId, "procurement.receive", warehouseIds); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, async (audit, now) => {
      const po = purchaseOrders.get(tenantKey(membership, body.branchId, body.purchaseOrderId));
      if (!po) return response(404, "PURCHASE_ORDER_NOT_FOUND");
      if (!["APPROVED", "PARTIALLY_FULFILLED", "PARTIALLY_CANCELLED"].includes(po.status)) return response(409, "PURCHASE_ORDER_NOT_RECEIVABLE");
      if (!validId(body.id) || !validId(body.supplierDocumentNumber) || !validDate(body.supplierDocumentDate) || !Array.isArray(body.documents) || body.documents.length === 0 || !Array.isArray(body.lines) || body.lines.length === 0) return response(422, "INVALID_GRN");
      const evidenceError = validateEvidenceList(body.documents, membership, body.branchId, `procurement/grn/${body.id}`); if (evidenceError) return evidenceError;
      const key = tenantKey(membership, body.branchId, body.id); if (grns.has(key)) return response(409, "GRN_EXISTS");
      if ([...grns.values()].some((grn) => grn.tenantId === membership.tenantId && grn.purchaseOrderId === po.id && grn.supplierDocumentNumber === body.supplierDocumentNumber)) return response(409, "SUPPLIER_DOCUMENT_ALREADY_RECEIVED");
      const parsedLines: GrnLine[] = [];
      for (const raw of body.lines) {
        const poLine = po.lines.find((line) => line.id === raw.purchaseOrderLineId);
        const received = parseQuantity(raw.receivedQuantity); const rejected = parseQuantity(raw.rejectedQuantity);
        if (!validId(raw.id) || !poLine || received === undefined || rejected === undefined || received <= 0n || rejected < 0n || rejected > received || raw.uom !== poLine.uom || !validInspection(raw.inspection, membership) || (rejected > 0n && !validId(raw.discrepancyReason))) return response(422, "INVALID_GRN_LINE");
        const accepted = received - rejected;
        if (accepted <= 0n) return response(422, "GRN_ACCEPTED_QUANTITY_REQUIRED");
        const reservationKey = `${po.tenantId}:${po.branchId}:${po.id}:${poLine.id}`;
        if (poLine.receivedQuantity + poLine.cancelledQuantity + (pendingGrnQuantity.get(reservationKey) ?? 0n) + accepted > poLine.quantity) return response(409, "OVER_RECEIPT");
        const taxable = prorate(poLine.taxableMinor, accepted, poLine.quantity);
        const gst = prorate(poLine.gstMinor, accepted, poLine.quantity);
        const landed = prorate(poLine.landedCostMinor, accepted, poLine.quantity);
        parsedLines.push({ id: raw.id, purchaseOrderLineId: poLine.id, itemId: poLine.itemId, receivedQuantity: received, rejectedQuantity: rejected, acceptedQuantity: accepted, uom: raw.uom,
          warehouseId: raw.warehouseId, binId: raw.binId ?? null, lot: clone(raw.lot), roll: clone(raw.roll), inspection: clone(raw.inspection),
          discrepancy: rejected > 0n ? { status: "OPEN", reason: raw.discrepancyReason } : undefined,
          taxableMinor: taxable, gstMinor: gst, landedCostMinor: landed, inventoryValueMinor: taxable + landed });
      }
      if (new Set(parsedLines.map((line) => line.id)).size !== parsedLines.length || new Set(parsedLines.map((line) => line.purchaseOrderLineId)).size !== parsedLines.length) return response(422, "DUPLICATE_GRN_LINE");

      const reservations = parsedLines.map((line) => ({ key: `${po.tenantId}:${po.branchId}:${po.id}:${line.purchaseOrderLineId}`, quantity: line.acceptedQuantity }));
      for (const reservation of reservations) pendingGrnQuantity.set(reservation.key, (pendingGrnQuantity.get(reservation.key) ?? 0n) + reservation.quantity);

      // The procurement command receipt and the inventory command key share the same stable GRN line identity.
      // All commercial validation is complete before this authoritative S13 boundary is invoked.
      try {
        const inventorySession = input.inventory.signIn(token);
        for (let index = 0; index < parsedLines.length; index += 1) {
          const line = parsedLines[index];
          const inventoryResult = await inventorySession.post("/api/v1/inventory/receipts", {
            branchId: body.branchId, sourceType: "PURCHASE_GRN", sourceId: `${body.id}:${line.id}`, itemId: line.itemId,
            warehouseId: line.warehouseId, binId: line.binId, lot: line.lot, roll: line.roll,
            quantity: formatQuantity(line.acceptedQuantity), uom: line.uom, valueMinor: line.inventoryValueMinor.toString(), reason: `Accepted against PO ${po.id}`,
          }, { idempotencyKey: `procurement-grn:${body.id}:${line.id}`, now });
          if (inventoryResult.status !== 201 && inventoryResult.status !== 200) return { status: inventoryResult.status, body: { code: "INVENTORY_POSTING_REJECTED", cause: inventoryResult.body.code, failedLineId: line.id } };
        }
        const totals = parsedLines.reduce((sum, line) => ({ acceptedTaxableMinor: sum.acceptedTaxableMinor + line.taxableMinor, gstMinor: sum.gstMinor + line.gstMinor, landedCostMinor: sum.landedCostMinor + line.landedCostMinor, inventoryValueMinor: sum.inventoryValueMinor + line.inventoryValueMinor }), { acceptedTaxableMinor: 0n, gstMinor: 0n, landedCostMinor: 0n, inventoryValueMinor: 0n });
        const grn: Grn = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, purchaseOrderId: po.id, supplierDocumentNumber: body.supplierDocumentNumber,
          supplierDocumentDate: body.supplierDocumentDate, documents: clone(body.documents), lines: parsedLines, totals,
          status: parsedLines.some((line) => line.discrepancy) ? "POSTED_WITH_DISCREPANCY" : "POSTED", resourceVersion: 1, actorMembershipId: membership.membershipId };
        grns.set(key, grn);
        for (const line of parsedLines) po.lines.find((candidate) => candidate.id === line.purchaseOrderLineId)!.receivedQuantity += line.acceptedQuantity;
        po.status = po.lines.every((line) => line.receivedQuantity + line.cancelledQuantity === line.quantity) && po.lines.every((line) => line.cancelledQuantity === 0n) ? "FULFILLED" : po.lines.some((line) => line.cancelledQuantity > 0n) ? "PARTIALLY_CANCELLED" : "PARTIALLY_FULFILLED";
        po.resourceVersion += 1;
        if (po.requisitionId) updateRequisitionOrdered(membership, po);
        record("GRN", grn, "POSTED", membership, `Received supplier document ${body.supplierDocumentNumber}`, audit, now, serializeGrn(grn));
        record("PURCHASE_ORDER", po, "PARTIAL_FULFILMENT", membership, `GRN ${grn.id} posted`, audit, now, serializePo(po));
        financialEvents.push({ type: "GRN_VALUE_POSTED", sourceId: grn.id, amountMinor: (grn.totals.inventoryValueMinor + grn.totals.gstMinor).toString(), gstMinor: grn.totals.gstMinor.toString(), compensating: false, auditReference: audit, occurredAt: now });
        return { status: 201, body: { grn: serializeGrn(grn), purchaseOrder: serializePo(po), resourceVersion: grn.resourceVersion } };
      } finally {
        for (const reservation of reservations) {
          const remaining = (pendingGrnQuantity.get(reservation.key) ?? 0n) - reservation.quantity;
          if (remaining === 0n) pendingGrnQuantity.delete(reservation.key); else pendingGrnQuantity.set(reservation.key, remaining);
        }
      }
    });
  }

  async function resolveGrnDiscrepancy(token: string, id: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "procurement.approve"); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      const grn = grns.get(tenantKey(membership, body.branchId, id)); if (!grn) return response(404, "GRN_NOT_FOUND");
      const stale = versionError(grn, options); if (stale) return stale;
      const line = grn.lines.find((candidate) => candidate.id === body.lineId);
      if (!line?.discrepancy || line.discrepancy.status !== "OPEN") return response(409, "DISCREPANCY_NOT_OPEN");
      if (membership.membershipId === grn.actorMembershipId) return response(403, "MAKER_CANNOT_CHECK");
      if (!validId(body.resolution) || !validId(body.reason)) return response(422, "RESOLUTION_AND_REASON_REQUIRED");
      line.discrepancy = { ...line.discrepancy, status: "RESOLVED", resolution: `${body.resolution}: ${body.reason}`, resolvedByMembershipId: membership.membershipId, auditReference: audit };
      grn.status = grn.lines.some((candidate) => candidate.discrepancy?.status === "OPEN") ? "POSTED_WITH_DISCREPANCY" : "DISCREPANCY_RESOLVED";
      grn.resourceVersion += 1; record("GRN", grn, "DISCREPANCY_RESOLVED", membership, body.reason, audit, now, serializeGrn(grn));
      return { status: 200, body: { grn: serializeGrn(grn), resourceVersion: grn.resourceVersion } };
    });
  }

  async function createPurchaseReturn(token: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const warehouseIds = Array.isArray(body.lines) ? body.lines.map((line: ApiBody) => line.warehouseId) : [];
    const authorization = auth(token, body.branchId, "procurement.return", warehouseIds); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, (audit, now) => {
      if (!validId(body.id) || !validId(body.purchaseOrderId) || !validId(body.reason) || !Array.isArray(body.lines) || body.lines.length === 0 || !Array.isArray(body.shipmentEvidence) || body.shipmentEvidence.length === 0) return response(422, "INVALID_PURCHASE_RETURN");
      const po = purchaseOrders.get(tenantKey(membership, body.branchId, body.purchaseOrderId)); if (!po) return response(404, "PURCHASE_ORDER_NOT_FOUND");
      const evidenceError = validateEvidenceList(body.shipmentEvidence, membership, body.branchId, `procurement/returns/${body.id}`); if (evidenceError) return evidenceError;
      const key = tenantKey(membership, body.branchId, body.id); if (returns.has(key)) return response(409, "PURCHASE_RETURN_EXISTS");
      const parsed: PurchaseReturnLine[] = [];
      for (const raw of body.lines) {
        const source = [...grns.values()].flatMap((grn) => grn.tenantId === membership.tenantId && grn.branchId === body.branchId && grn.purchaseOrderId === po.id ? grn.lines : []).find((line) => line.id === raw.grnLineId);
        const quantity = parseQuantity(raw.quantity);
        if (!source || quantity === undefined || quantity <= 0n || raw.uom !== source.uom || raw.itemId !== source.itemId || raw.warehouseId !== source.warehouseId || (raw.lotId ?? null) !== (source.lot?.id ?? null)) return response(422, "RETURN_NOT_ELIGIBLE_RECEIPT_STOCK");
        const alreadyReturned = [...returns.values()].filter((entry) => entry.tenantId === membership.tenantId && entry.branchId === body.branchId && entry.status !== "REJECTED").flatMap((entry) => entry.lines).filter((line) => line.grnLineId === source.id).reduce((sum, line) => sum + line.quantity, 0n);
        if (alreadyReturned + quantity > source.acceptedQuantity) return response(409, "RETURN_EXCEEDS_RECEIVED");
        const taxable = prorate(source.taxableMinor, quantity, source.acceptedQuantity); const gst = prorate(source.gstMinor, quantity, source.acceptedQuantity); const landed = prorate(source.landedCostMinor, quantity, source.acceptedQuantity);
        parsed.push({ id: raw.id, grnLineId: raw.grnLineId, itemId: raw.itemId, quantity, uom: raw.uom, warehouseId: raw.warehouseId, binId: raw.binId ?? null, lotId: raw.lotId ?? null,
          remnantId: raw.remnantId ?? null, taxableMinor: taxable, gstMinor: gst, landedCostMinor: landed, inventoryValueMinor: taxable + landed });
      }
      if (new Set(parsed.map((line) => line.id)).size !== parsed.length) return response(422, "DUPLICATE_RETURN_LINE");
      const purchaseReturn: PurchaseReturn = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, purchaseOrderId: po.id, supplierId: po.supplierId, reason: body.reason, lines: parsed,
        shipmentEvidence: clone(body.shipmentEvidence), status: "APPROVAL_PENDING", makerMembershipId: membership.membershipId, resourceVersion: 1 };
      returns.set(key, purchaseReturn); record("PURCHASE_RETURN", purchaseReturn, "SUBMITTED", membership, body.reason, audit, now, serializeReturn(purchaseReturn));
      return { status: 202, body: { purchaseReturn: serializeReturn(purchaseReturn), resourceVersion: 1, approvalRequired: returnValue(purchaseReturn) >= returnThreshold } };
    });
  }

  async function approvePurchaseReturn(token: string, id: string, body: ApiBody, options: CommandOptions): Promise<ApiResponse> {
    const authorization = auth(token, body.branchId, "procurement.return.approve"); if (authorization.error) return authorization.error;
    const membership = authorization.membership!;
    return command(membership, options, body, async (audit, now) => {
      const purchaseReturn = returns.get(tenantKey(membership, body.branchId, id)); if (!purchaseReturn) return response(404, "PURCHASE_RETURN_NOT_FOUND");
      const stale = versionError(purchaseReturn, options); if (stale) return stale;
      if (purchaseReturn.status !== "APPROVAL_PENDING") return response(409, "APPROVAL_NOT_PENDING");
      if (membership.membershipId === purchaseReturn.makerMembershipId) return response(403, "MAKER_CANNOT_CHECK");
      if (!(body.decision === "APPROVE" || body.decision === "REJECT") || !validId(body.reason)) return response(422, "INVALID_APPROVAL_DECISION");
      const approvalKey = `${purchaseReturn.tenantId}:${purchaseReturn.branchId}:${purchaseReturn.id}`;
      if (approvingReturns.has(approvalKey)) return response(409, "COMMAND_IN_PROGRESS");
      if (body.decision === "APPROVE") {
        approvingReturns.add(approvalKey);
        try {
          const inventorySession = input.inventory.signIn(thisTokenForMembership(membership));
          for (const line of purchaseReturn.lines) {
            const result = await inventorySession.post("/api/v1/inventory/withdrawals", { branchId: purchaseReturn.branchId, sourceType: "PURCHASE_RETURN", sourceId: `${purchaseReturn.id}:${line.id}`,
              itemId: line.itemId, warehouseId: line.warehouseId, binId: line.binId, lotId: line.lotId, remnantId: line.remnantId,
              quantity: formatQuantity(line.quantity), uom: line.uom, valueMinor: line.inventoryValueMinor.toString(), reason: `Return to supplier ${purchaseReturn.supplierId}: ${purchaseReturn.reason}`,
            }, { idempotencyKey: `procurement-return:${purchaseReturn.id}:${line.id}`, now });
            if (result.status !== 201 && result.status !== 200) return { status: result.status, body: { code: "INVENTORY_POSTING_REJECTED", cause: result.body.code, failedLineId: line.id } };
          }
        } finally {
          approvingReturns.delete(approvalKey);
        }
        purchaseReturn.status = "APPROVED_POSTED";
      } else purchaseReturn.status = "REJECTED";
      approvals.push({ entityType: "PURCHASE_RETURN", entityId: purchaseReturn.id, makerMembershipId: purchaseReturn.makerMembershipId, checkerMembershipId: membership.membershipId, decision: body.decision, thresholdMinor: returnThreshold.toString(), reason: body.reason, auditReference: audit, occurredAt: now });
      if (body.decision === "APPROVE") financialEvents.push({ type: "PURCHASE_RETURN_CREDIT_EXPECTED", sourceId: purchaseReturn.id, amountMinor: returnValue(purchaseReturn).toString(), gstMinor: purchaseReturn.lines.reduce((sum, line) => sum + line.gstMinor, 0n).toString(), compensating: true, auditReference: audit, occurredAt: now });
      purchaseReturn.resourceVersion += 1; record("PURCHASE_RETURN", purchaseReturn, body.decision === "APPROVE" ? "APPROVED_AND_POSTED" : "REJECTED", membership, body.reason, audit, now, serializeReturn(purchaseReturn));
      return { status: 200, body: { purchaseReturn: serializeReturn(purchaseReturn), financialEvent: body.decision === "APPROVE" ? { type: "PURCHASE_RETURN_CREDIT_EXPECTED", amountMinor: returnValue(purchaseReturn).toString(), gstMinor: purchaseReturn.lines.reduce((sum, line) => sum + line.gstMinor, 0n).toString(), sourceId: purchaseReturn.id, compensating: true } : undefined, resourceVersion: purchaseReturn.resourceVersion } };
    });
  }

  function thisTokenForMembership(membership: ProcurementMembership): string {
    return Object.entries(input.memberships).find(([, candidate]) => candidate === membership || candidate.membershipId === membership.membershipId && candidate.tenantId === membership.tenantId)?.[0] ?? "";
  }
  function updateRequisitionOrdered(membership: ProcurementMembership, po: PurchaseOrder) {
    const requisition = requisitions.get(tenantKey(membership, po.branchId, po.requisitionId!)); if (!requisition) return;
    for (const poLine of po.lines) {
      const reqLine = requisition.lines.find((line) => line.id === poLine.requisitionLineId); if (reqLine) reqLine.receivedQuantity = poLine.receivedQuantity + poLine.cancelledQuantity;
    }
    requisition.status = requisition.lines.every((line) => line.receivedQuantity >= line.quantity) ? "ORDERED" : "PARTIALLY_ORDERED";
    requisition.resourceVersion += 1;
  }

  return { signIn: (token: string) => new Session(token), testing: {
    history: () => clone(history), suppliers: () => [...suppliers.values()].map(serializeSupplier), requisitions: () => [...requisitions.values()].map(serializeRequisition),
    purchaseOrders: () => [...purchaseOrders.values()].map(serializePo), grns: () => [...grns.values()].map(serializeGrn), returns: () => [...returns.values()].map(serializeReturn),
    approvals: () => clone(approvals), financialEvents: () => clone(financialEvents),
  } };
}

function normalize(value: string): string { return value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]/g, ""); }
function validateSupplier(body: ApiBody, membership: ProcurementMembership): ApiResponse | undefined {
  if (![body.id, body.legalName, body.currency].every(validId) || !/^[A-Z]{3}$/.test(body.currency) || !["REGISTERED", "COMPOSITION", "UNREGISTERED", "OVERSEAS"].includes(body.taxTreatment) || !["ACTIVE", "ON_HOLD", "INACTIVE"].includes(body.status)) return response(422, "INVALID_SUPPLIER");
  if (!Number.isInteger(body.paymentTermsDays) || body.paymentTermsDays < 0 || body.paymentTermsDays > 3650 || !Array.isArray(body.contacts) || body.contacts.length === 0 || !Array.isArray(body.addresses) || body.addresses.length === 0 || !Array.isArray(body.itemRelations)) return response(422, "INVALID_SUPPLIER_DETAILS");
  if (["REGISTERED", "COMPOSITION"].includes(body.taxTreatment) && (typeof body.gstin !== "string" || !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/.test(body.gstin))) return response(422, "VALID_GSTIN_REQUIRED");
  if (body.pan !== undefined && !/^[A-Z]{5}\d{4}[A-Z]$/.test(body.pan)) return response(422, "INVALID_PAN");
  if (new Set(body.contacts.map((entry: ApiBody) => entry.id)).size !== body.contacts.length || body.contacts.filter((entry: ApiBody) => entry.primary).length !== 1 || body.contacts.some((entry: ApiBody) => !validId(entry.id) || !validId(entry.name) || !validId(entry.phone) && !validId(entry.email))) return response(422, "INVALID_SUPPLIER_CONTACTS");
  if (body.addresses.some((entry: ApiBody) => !validId(entry.id) || !["BILLING", "SHIPPING", "REGISTERED", "OTHER"].includes(entry.type) || !validId(entry.line1) || !validId(entry.city) || !validId(entry.countryCode))) return response(422, "INVALID_SUPPLIER_ADDRESSES");
  if (body.itemRelations.some((entry: ApiBody) => !validId(entry.itemId) || !validId(entry.supplierSku) || !Number.isInteger(entry.leadTimeDays) || entry.leadTimeDays < 0 || parseQuantity(entry.minimumOrderQuantity) === undefined || !validId(entry.purchaseUom))) return response(422, "INVALID_SUPPLIER_ITEM_RELATIONS");
  if (body.contacts.some((entry: ApiBody) => typeof entry.privateObjectRef === "string" && !entry.privateObjectRef.startsWith(`${membership.tenantId}/`))) return response(422, "CROSS_TENANT_REFERENCE");
}
function parseQuantityLines(lines: ApiBody[]): QuantityLine[] | undefined {
  const parsed: QuantityLine[] = [];
  for (const line of lines) {
    const quantity = parseQuantity(line.quantity);
    if (!validId(line.id) || !validId(line.itemId) || quantity === undefined || quantity <= 0n || !validId(line.uom) || !validDate(line.requiredBy)) return undefined;
    parsed.push({ ...clone(line), id: line.id, itemId: line.itemId, uom: line.uom, quantity, cancelledQuantity: 0n, receivedQuantity: 0n, resourceVersion: 1 });
  }
  return parsed;
}
function calculatePo(body: ApiBody, requisition?: Requisition): { lines: PoLine[]; landed: PurchaseOrder["landedCostInputs"]; totals: PurchaseOrder["totals"] } | ApiResponse {
  const landed: PurchaseOrder["landedCostInputs"] = [];
  for (const entry of body.landedCostInputs) {
    const amount = parseMinor(entry.amountMinor); const tax = parseMinor(entry.recoverableTaxMinor);
    if (!validId(entry.id) || !validId(entry.kind) || amount === undefined || tax === undefined) return response(422, "INVALID_LANDED_COST");
    landed.push({ id: entry.id, kind: entry.kind, amountMinor: amount, recoverableTaxMinor: tax });
  }
  const rawLines: PoLine[] = [];
  for (const raw of body.lines) {
    const quantity = parseQuantity(raw.quantity); const unit = parseMinor(raw.unitPriceMinor); const discount = parseMinor(raw.discountMinor);
    if (!validId(raw.id) || !validId(raw.itemId) || quantity === undefined || quantity <= 0n || !validId(raw.uom) || unit === undefined || discount === undefined || !Number.isInteger(raw.gstRateBps) || raw.gstRateBps < 0 || raw.gstRateBps > 4000) return response(422, "INVALID_PURCHASE_ORDER_LINE");
    if (quantity % SCALE !== 0n) return response(422, "UNIT_PRICE_REQUIRES_WHOLE_PURCHASE_UOM");
    const gross = unit * (quantity / SCALE); if (discount > gross) return response(422, "DISCOUNT_EXCEEDS_LINE_VALUE");
    if (requisition) {
      const reqLine = requisition.lines.find((line) => line.id === raw.requisitionLineId);
      if (!reqLine || reqLine.itemId !== raw.itemId || reqLine.uom !== raw.uom || quantity > reqLine.quantity - reqLine.cancelledQuantity - reqLine.receivedQuantity) return response(422, "PO_EXCEEDS_REQUISITION");
    }
    const taxable = gross - discount; const gst = roundRatio(taxable, BigInt(raw.gstRateBps), 10000n);
    rawLines.push({ ...clone(raw), id: raw.id, itemId: raw.itemId, uom: raw.uom, quantity, cancelledQuantity: 0n, receivedQuantity: 0n, resourceVersion: 1, unitPriceMinor: unit, discountMinor: discount, taxableMinor: taxable, gstMinor: gst, gstRateBps: raw.gstRateBps, landedCostMinor: 0n, inventoryValueMinor: taxable });
  }
  if (new Set(rawLines.map((line) => line.id)).size !== rawLines.length) return response(422, "DUPLICATE_LINE_ID");
  const taxableTotal = rawLines.reduce((sum, line) => sum + line.taxableMinor, 0n); const landedTotal = landed.reduce((sum, entry) => sum + entry.amountMinor, 0n);
  let allocated = 0n;
  const lines: PoLine[] = rawLines.map((line, index) => {
    const allocation = index === rawLines.length - 1 ? landedTotal - allocated : taxableTotal === 0n ? 0n : line.taxableMinor * landedTotal / taxableTotal;
    allocated += allocation; return { ...line, landedCostMinor: allocation, inventoryValueMinor: line.taxableMinor + allocation };
  });
  const gstMinor = lines.reduce((sum, line) => sum + line.gstMinor, 0n); const recoverableTaxMinor = landed.reduce((sum, entry) => sum + entry.recoverableTaxMinor, 0n);
  return { lines, landed, totals: { taxableMinor: taxableTotal, gstMinor, landedCostMinor: landedTotal, recoverableTaxMinor, payableMinor: taxableTotal + gstMinor + landedTotal + recoverableTaxMinor, inventoryValueMinor: taxableTotal + landedTotal } };
}
function prorate(total: bigint, quantity: bigint, ordered: bigint): bigint { return roundRatio(total, quantity, ordered); }
function validInspection(value: unknown, membership: ProcurementMembership): boolean {
  if (typeof value !== "object" || value === null) return false; const inspection = value as ApiBody;
  return ["ACCEPTED", "PARTIALLY_ACCEPTED"].includes(inspection.result) && validId(inspection.checklistVersion) && validId(inspection.notes) && inspection.inspectedByMembershipId === membership.membershipId;
}
function validateEvidenceList(values: unknown[], membership: ProcurementMembership, branchId: string, scope: string): ApiResponse | undefined {
  const prefix = `${membership.tenantId}/${branchId}/private/${scope}`;
  if (values.some((value) => typeof value !== "object" || value === null || typeof (value as ApiBody).privateObjectRef !== "string" || !(value as ApiBody).privateObjectRef.startsWith(prefix) || !/^[0-9a-f]{64}$/.test((value as ApiBody).checksum) || (value as ApiBody).scanStatus !== "CLEAN" || !validInstant((value as ApiBody).capturedAt))) return response(422, "INVALID_PRIVATE_EVIDENCE");
}
function serializeSupplier(value: Supplier): ApiBody { return clone(value); }
function serializeQuantityLine(value: QuantityLine): ApiBody { return { ...clone(value), quantity: formatQuantity(value.quantity), cancelledQuantity: formatQuantity(value.cancelledQuantity), receivedQuantity: formatQuantity(value.receivedQuantity) }; }
function serializeRequisition(value: Requisition): ApiBody { return { ...clone(value), lines: value.lines.map(serializeQuantityLine) }; }
function serializePoLine(value: PoLine): ApiBody { return { ...serializeQuantityLine(value), unitPriceMinor: value.unitPriceMinor.toString(), discountMinor: value.discountMinor.toString(), taxableMinor: value.taxableMinor.toString(), gstMinor: value.gstMinor.toString(), landedCostMinor: value.landedCostMinor.toString(), inventoryValueMinor: value.inventoryValueMinor.toString() }; }
function serializePo(value: PurchaseOrder): ApiBody { return { ...clone(value), lines: value.lines.map(serializePoLine), landedCostInputs: value.landedCostInputs.map((entry) => ({ ...entry, amountMinor: entry.amountMinor.toString(), recoverableTaxMinor: entry.recoverableTaxMinor.toString() })), totals: Object.fromEntries(Object.entries(value.totals).map(([key, amount]) => [key, amount.toString()])) }; }
function serializeGrnLine(value: GrnLine): ApiBody { return { ...clone(value), receivedQuantity: formatQuantity(value.receivedQuantity), rejectedQuantity: formatQuantity(value.rejectedQuantity), acceptedQuantity: formatQuantity(value.acceptedQuantity), taxableMinor: value.taxableMinor.toString(), gstMinor: value.gstMinor.toString(), landedCostMinor: value.landedCostMinor.toString(), inventoryValueMinor: value.inventoryValueMinor.toString() }; }
function serializeGrn(value: Grn): ApiBody { return { ...clone(value), lines: value.lines.map(serializeGrnLine), totals: Object.fromEntries(Object.entries(value.totals).map(([key, amount]) => [key, amount.toString()])) }; }
function returnValue(value: PurchaseReturn): bigint { return value.lines.reduce((sum, line) => sum + line.taxableMinor + line.gstMinor + line.landedCostMinor, 0n); }
function serializeReturn(value: PurchaseReturn): ApiBody { return { ...clone(value), lines: value.lines.map((line) => ({ ...line, quantity: formatQuantity(line.quantity), taxableMinor: line.taxableMinor.toString(), gstMinor: line.gstMinor.toString(), landedCostMinor: line.landedCostMinor.toString(), inventoryValueMinor: line.inventoryValueMinor.toString() })), totals: { taxableMinor: value.lines.reduce((sum, line) => sum + line.taxableMinor, 0n).toString(), gstMinor: value.lines.reduce((sum, line) => sum + line.gstMinor, 0n).toString(), landedCostMinor: value.lines.reduce((sum, line) => sum + line.landedCostMinor, 0n).toString(), expectedCreditMinor: returnValue(value).toString() } }; }
function serializeEntity(value: any): ApiBody {
  if ("supplierDocumentNumber" in value) return serializeGrn(value);
  if ("shipmentEvidence" in value) return serializeReturn(value);
  if ("landedCostInputs" in value) return serializePo(value);
  if ("purpose" in value) return serializeRequisition(value);
  return serializeSupplier(value);
}
