export type InventoryMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  warehouseIds: string[];
  permissions: string[];
};

export type InventoryWarehouse = {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  binIds: string[];
};

type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string };
type ApiBody = Record<string, any>;
type ApiResponse = { status: number; body: ApiBody };
type Item = {
  id: string; tenantId: string; branchId: string; categoryId: string; sku: string; barcodes: string[];
  baseUom: string; stockUom: string; purchaseUom: string; issueUom: string;
  conversions: Array<{ fromUom: string; toUom: string; numerator: string; denominator: string }>;
  costingMethod: "MOVING_AVERAGE" | "FIFO" | "STANDARD"; taxCode: string; reorderPoint: string;
  active: boolean; tracking: "NONE" | "LOT" | "BATCH" | "SERIAL" | "ROLL"; fefoRequired: boolean; resourceVersion: number;
};
type Lot = {
  id: string; tenantId: string; branchId: string; itemId: string; code: string; serialNumber?: string;
  manufacturedAt?: string; expiresAt?: string; status: "AVAILABLE" | "QUARANTINED" | "BLOCKED" | "RECALLED";
};
type Balance = {
  tenantId: string; branchId: string; warehouseId: string; binId: string | null; itemId: string;
  lotId: string | null; remnantId: string | null; quantityBase: bigint; valueMinor: bigint;
};
type LedgerEntry = {
  id: string; tenantId: string; branchId: string; account: "INVENTORY_CONTROL" | "LOCATION_STOCK" | "IN_TRANSIT";
  warehouseId: string | null; binId: string | null; itemId: string; lotId: string | null; remnantId: string | null;
  quantityBase: string; valueMinor: string; sourceType: string; sourceId: string; actorMembershipId: string;
  occurredAt: string; reason: string; auditReference: string;
};
type RollPiece = {
  id: string; tenantId: string; branchId: string; itemId: string; lotId: string; warehouseId: string; binId: string | null;
  parentRollId: string | null; parentRemnantId: string | null; rootRollId: string; length: bigint; width: bigint;
  minimumUseLength: bigint; quantityBase: bigint; valueMinor: bigint; usable: boolean; status: "AVAILABLE" | "CUT" | "SCRAPPED";
  resourceVersion: number;
};
type TransferEvidence = { privateObjectRef: string; checksum: string; scanStatus: "CLEAN"; capturedAt: string };
type Transfer = {
  id: string; tenantId: string; branchId: string; sourceWarehouseId: string; sourceBinId: string | null;
  destinationWarehouseId: string; destinationBinId: string | null; itemId: string; lotId: string | null; remnantId: string | null;
  quantityBase: bigint; valueMinor: bigint; inTransitQuantityBase: bigint; inTransitValueMinor: bigint;
  status: "READY" | "IN_TRANSIT" | "RECEIVED" | "RECEIPT_DISCREPANCY" | "COMPLETED_WITH_DISCREPANCY";
  reason: string; makerMembershipId: string; dispatchEvidence?: TransferEvidence; receiptEvidence?: TransferEvidence;
  resolutionEvidence?: TransferEvidence; discrepancy?: { quantityBase: bigint; valueMinor: bigint; status: "OPEN" | "RESOLVED"; reason: string };
  resourceVersion: number;
};
type CountLine = {
  itemId: string; lotId: string | null; remnantId: string | null; expectedQuantityBase: bigint; expectedValueMinor: bigint;
  entries: Array<{ round: number; quantityBase: bigint; actorMembershipId: string; auditReference: string; occurredAt: string }>;
};
type StockCount = {
  id: string; tenantId: string; branchId: string; warehouseId: string; binId: string | null; frozenAt: string; reason: string;
  lines: CountLine[]; round: number; status: "COUNTING" | "RECOUNT_REQUIRED" | "RECOUNTING" | "INVESTIGATION_REQUIRED" | "ADJUSTMENT_PENDING" | "RECONCILED" | "ADJUSTMENT_REJECTED";
  makerMembershipId: string; investigation?: { reason: string; evidence: TransferEvidence; actorMembershipId: string; auditReference: string };
  varianceQuantityBase?: bigint; varianceValueMinor?: bigint; approval?: { decision: "APPROVE" | "REJECT"; checkerMembershipId: string; reason: string; auditReference: string };
  resourceVersion: number;
};

const SCALE = 1_000_000n;
const clone = <T>(value: T): T => structuredClone(value);
const validId = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const validUom = (value: unknown): value is string => typeof value === "string" && /^[A-Z][A-Z0-9_-]{0,15}$/.test(value);
const validInstant = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
const parseMinor = (value: unknown): bigint | undefined => typeof value === "string" && /^-?(0|[1-9]\d*)$/.test(value) ? BigInt(value) : undefined;
function parseQuantity(value: unknown): bigint | undefined {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(value)) return undefined;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(6, "0"));
}
function formatQuantity(value: bigint): string {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  const whole = absolute / SCALE;
  const fraction = (absolute % SCALE).toString().padStart(6, "0").replace(/0+$/, "");
  return `${sign}${whole}${fraction ? `.${fraction}` : ""}`;
}

export function createLocalInventoryApi(input: { memberships: Record<string, InventoryMembership>; warehouses: InventoryWarehouse[] }) {
  const warehouses = new Map(input.warehouses.map((warehouse) => [warehouse.id, clone(warehouse)]));
  const items = new Map<string, Item>();
  const lots = new Map<string, Lot>();
  const balances = new Map<string, Balance>();
  const rolls = new Map<string, RollPiece>();
  const transfers = new Map<string, Transfer>();
  const counts = new Map<string, StockCount>();
  const ledger: LedgerEntry[] = [];
  const receipts = new Map<string, { fingerprint: string; response: ApiResponse }>();
  let auditSequence = 0;
  let ledgerSequence = 0;

  const auth = (token: string, branchId: unknown, permission: string, warehouseIds: unknown[] = []) => {
    const membership = input.memberships[token];
    if (!membership) return { error: response(401, "AUTHENTICATION_REQUIRED") };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) return { error: response(403, "BRANCH_FORBIDDEN") };
    if (!membership.permissions.includes(permission)) return { error: response(403, "PERMISSION_DENIED") };
    for (const candidate of warehouseIds) {
      if (typeof candidate !== "string" || !membership.warehouseIds.includes(candidate)) return { error: response(403, "WAREHOUSE_FORBIDDEN") };
      const warehouse = warehouses.get(candidate);
      if (!warehouse || warehouse.tenantId !== membership.tenantId || warehouse.branchId !== branchId) return { error: response(404, "WAREHOUSE_NOT_FOUND") };
    }
    return { membership };
  };
  const itemVisible = (membership: InventoryMembership, branchId: string, id: unknown) => {
    const item = typeof id === "string" ? items.get(`${membership.tenantId}:${branchId}:${id}`) : undefined;
    return item;
  };
  const command = (membership: InventoryMembership, options: CommandOptions, body: ApiBody, action: (audit: string, now: string) => ApiResponse): ApiResponse => {
    if (!options.idempotencyKey?.trim()) return response(400, "IDEMPOTENCY_KEY_REQUIRED");
    const key = `${membership.tenantId}:${options.idempotencyKey}`;
    const fingerprint = stableJson(body);
    const replay = receipts.get(key);
    if (replay) return replay.fingerprint === fingerprint ? { status: 200, body: clone(replay.response.body) } : response(409, "IDEMPOTENCY_KEY_REUSED");
    const audit = `audit-${membership.tenantId}-${++auditSequence}`;
    const result = action(audit, options.now ?? new Date().toISOString());
    if (result.status >= 200 && result.status < 300) {
      result.body.auditReference ??= audit;
      receipts.set(key, { fingerprint, response: clone(result) });
    }
    return clone(result);
  };

  class Session {
    constructor(private readonly token: string) {}
    async post(path: string, body: ApiBody, options: CommandOptions = {}): Promise<ApiResponse> {
      if (path === "/api/v1/inventory/items") {
        const authorization = auth(this.token, body.branchId, "inventory.master.manage");
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        return command(membership, options, body, () => {
          const validation = validateItem(body);
          if (validation) return validation;
          const key = `${membership.tenantId}:${body.branchId}:${body.id}`;
          if (items.has(key)) return response(409, "ITEM_EXISTS");
          if ([...items.values()].some((item) => item.tenantId === membership.tenantId && item.branchId === body.branchId && (item.sku === body.sku || item.barcodes.some((barcode) => body.barcodes.includes(barcode))))) {
            return response(409, "ITEM_IDENTITY_CONFLICT");
          }
          const item: Item = {
            id: body.id, tenantId: membership.tenantId, branchId: body.branchId, categoryId: body.categoryId, sku: body.sku,
            barcodes: [...body.barcodes], baseUom: body.baseUom, stockUom: body.stockUom, purchaseUom: body.purchaseUom,
            issueUom: body.issueUom, conversions: clone(body.conversions), costingMethod: body.costingMethod,
            taxCode: body.taxCode, reorderPoint: body.reorderPoint, active: body.active, tracking: body.tracking,
            fefoRequired: body.fefoRequired === true, resourceVersion: 1,
          };
          items.set(key, item);
          return { status: 201, body: { item: clone(item), resourceVersion: 1 } };
        });
      }
      if (path === "/api/v1/inventory/receipts") {
        const authorization = auth(this.token, body.branchId, "inventory.receive", [body.warehouseId]);
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        return command(membership, options, body, (audit, now) => {
          const item = itemVisible(membership, body.branchId, body.itemId);
          if (!item || !item.active) return response(422, !item ? "ITEM_NOT_FOUND" : "ITEM_INACTIVE");
          const locationError = validateLocation(warehouses.get(body.warehouseId)!, body.binId);
          if (locationError) return locationError;
          const quantity = convertToBase(item, body.quantity, body.uom);
          const value = parseMinor(body.valueMinor);
          if (quantity === undefined || quantity <= 0n) return response(422, "INVALID_UOM_CONVERSION");
          if (value === undefined || value < 0n) return response(422, "INVALID_VALUE_MINOR");
          if (!validId(body.sourceType) || !validId(body.sourceId) || !validId(body.reason)) return response(422, "SOURCE_AND_REASON_REQUIRED");
          const lotResult = resolveReceiptLot(membership, item, body.lot, now);
          if (lotResult.error) return lotResult.error;
          const lotId = lotResult.lot?.id ?? null;
          if (isCountScopeFrozen(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, item.id, lotId, body.roll?.id ?? null)) return response(409, "COUNT_SCOPE_FROZEN");
          const rollResult = resolveReceiptRoll(membership, item, lotId, body, quantity, value);
          if (rollResult.error) return rollResult.error;
          const lotKey = `${membership.tenantId}:${body.branchId}:${lotId}`;
          const existingLot = lotId ? lots.get(lotKey) : undefined;
          if (existingLot && stableJson(existingLot) !== stableJson(lotResult.lot)) return response(409, "LOT_IDENTITY_CONFLICT");
          if (rollResult.roll && rolls.has(`${membership.tenantId}:${body.branchId}:${rollResult.roll.id}`)) return response(409, "ROLL_EXISTS");
          if (lotResult.lot && !existingLot) lots.set(lotKey, lotResult.lot);
          if (rollResult.roll) rolls.set(`${membership.tenantId}:${body.branchId}:${rollResult.roll.id}`, rollResult.roll);
          const remnantId = rollResult.roll?.id ?? null;
          const balance = getBalance(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, item.id, lotId, remnantId);
          balance.quantityBase += quantity;
          balance.valueMinor += value;
          postPair({ membership, branchId: body.branchId, warehouseId: body.warehouseId, binId: body.binId ?? null, itemId: item.id, lotId,
            remnantId, quantity, value, sourceType: body.sourceType, sourceId: body.sourceId, reason: body.reason, audit, now });
          return { status: 201, body: { quantityBase: formatQuantity(quantity), valueMinor: value.toString(), resourceVersion: 1 } };
        });
      }
      if (path === "/api/v1/inventory/withdrawals") {
        const authorization = auth(this.token, body.branchId, "inventory.move", [body.warehouseId]);
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        return command(membership, options, body, (audit, now) => {
          const item = itemVisible(membership, body.branchId, body.itemId);
          if (!item || !item.active) return response(422, !item ? "ITEM_NOT_FOUND" : "ITEM_INACTIVE");
          const locationError = validateLocation(warehouses.get(body.warehouseId)!, body.binId);
          if (locationError) return locationError;
          const quantity = convertToBase(item, body.quantity, body.uom);
          if (quantity === undefined || quantity <= 0n) return response(422, "INVALID_UOM_CONVERSION");
          if (!validId(body.sourceType) || !validId(body.sourceId) || !validId(body.reason)) return response(422, "SOURCE_AND_REASON_REQUIRED");
          const lot = item.tracking === "NONE" ? undefined : lots.get(`${membership.tenantId}:${body.branchId}:${body.lotId}`);
          if (item.tracking !== "NONE" && (!lot || lot.itemId !== item.id)) return response(422, "LOT_NOT_FOUND");
          if (lot?.status !== undefined && lot.status !== "AVAILABLE") return response(422, "LOT_STATUS_BLOCKED");
          if (lot?.expiresAt && Date.parse(lot.expiresAt) <= Date.parse(now)) return response(422, "LOT_EXPIRED");
          if (isCountScopeFrozen(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, item.id, lot?.id ?? null, body.remnantId ?? null)) return response(409, "COUNT_SCOPE_FROZEN");
          if (item.fefoRequired && lot) {
            const earlier = [...balances.values()].some((balance) => {
              const candidate = balance.lotId ? lots.get(`${membership.tenantId}:${body.branchId}:${balance.lotId}`) : undefined;
              return balance.tenantId === membership.tenantId && balance.branchId === body.branchId && balance.itemId === item.id &&
                balance.warehouseId === body.warehouseId && balance.quantityBase > 0n && candidate?.status === "AVAILABLE" &&
                candidate.expiresAt && lot.expiresAt && Date.parse(candidate.expiresAt) < Date.parse(lot.expiresAt) && Date.parse(candidate.expiresAt) > Date.parse(now);
            });
            if (earlier && !validId(body.fefoExceptionReason)) return response(422, "FEFO_EXCEPTION_REASON_REQUIRED");
          }
          const balance = getBalance(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, item.id, lot?.id ?? null, body.remnantId ?? null);
          if (balance.quantityBase < quantity) return response(409, "INSUFFICIENT_STOCK");
          const value = quantity === balance.quantityBase ? balance.valueMinor : balance.valueMinor * quantity / balance.quantityBase;
          balance.quantityBase -= quantity;
          balance.valueMinor -= value;
          const reason = validId(body.fefoExceptionReason) ? `${body.reason}; FEFO exception: ${body.fefoExceptionReason.trim()}` : body.reason;
          postPair({ membership, branchId: body.branchId, warehouseId: body.warehouseId, binId: body.binId ?? null, itemId: item.id,
            lotId: lot?.id ?? null, remnantId: body.remnantId ?? null, quantity: -quantity, value: -value, sourceType: body.sourceType,
            sourceId: body.sourceId, reason, audit, now });
          return { status: 201, body: { quantityBase: formatQuantity(-quantity), valueMinor: (-value).toString(), resourceVersion: 1 } };
        });
      }
      if (path === "/api/v1/inventory/job-returns") {
        const authorization = auth(this.token, body.branchId, "inventory.receive", [body.warehouseId]);
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        return command(membership, options, body, (audit, now) => {
          const item = itemVisible(membership, body.branchId, body.itemId);
          if (!item || !item.active) return response(422, !item ? "ITEM_NOT_FOUND" : "ITEM_INACTIVE");
          const locationError = validateLocation(warehouses.get(body.warehouseId)!, body.binId);
          if (locationError) return locationError;
          const quantity = convertToBase(item, body.quantity, body.uom);
          if (quantity === undefined || quantity <= 0n) return response(422, "INVALID_UOM_CONVERSION");
          if (body.sourceType !== "JOB_MATERIAL_RETURN" || !validId(body.sourceId) || !validId(body.reason)) return response(422, "SOURCE_AND_REASON_REQUIRED");
          const lot = item.tracking === "NONE" ? undefined : lots.get(`${membership.tenantId}:${body.branchId}:${body.lotId}`);
          if (item.tracking !== "NONE" && (!lot || lot.itemId !== item.id)) return response(422, "LOT_NOT_FOUND");
          if (lot?.status !== undefined && lot.status !== "AVAILABLE") return response(422, "LOT_STATUS_BLOCKED");
          if (isCountScopeFrozen(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, item.id, lot?.id ?? null, body.remnantId ?? null)) return response(409, "COUNT_SCOPE_FROZEN");
          const balance = getBalance(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, item.id, lot?.id ?? null, body.remnantId ?? null);
          const unitValue = parseMinor(body.valueMinor);
          if (unitValue === undefined || unitValue < 0n) return response(422, "INVALID_VALUE_MINOR");
          balance.quantityBase += quantity;
          balance.valueMinor += unitValue;
          postPair({ membership, branchId: body.branchId, warehouseId: body.warehouseId, binId: body.binId ?? null, itemId: item.id,
            lotId: lot?.id ?? null, remnantId: body.remnantId ?? null, quantity, value: unitValue, sourceType: body.sourceType,
            sourceId: body.sourceId, reason: body.reason, audit, now });
          return { status: 201, body: { quantityBase: formatQuantity(quantity), valueMinor: unitValue.toString(), resourceVersion: 1 } };
        });
      }
      if (path === "/api/v1/inventory/transfers") {
        const authorization = auth(this.token, body.branchId, "inventory.move", [body.sourceWarehouseId, body.destinationWarehouseId]);
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        return command(membership, options, body, () => {
          if (![body.id, body.itemId, body.reason].every(validId) || body.sourceWarehouseId === body.destinationWarehouseId && (body.sourceBinId ?? null) === (body.destinationBinId ?? null)) return response(422, "INVALID_TRANSFER");
          const sourceLocation = validateLocation(warehouses.get(body.sourceWarehouseId)!, body.sourceBinId);
          const destinationLocation = validateLocation(warehouses.get(body.destinationWarehouseId)!, body.destinationBinId);
          if (sourceLocation || destinationLocation) return sourceLocation ?? destinationLocation!;
          const item = itemVisible(membership, body.branchId, body.itemId);
          if (!item?.active) return response(422, item ? "ITEM_INACTIVE" : "ITEM_NOT_FOUND");
          const quantity = convertToBase(item, body.quantity, body.uom);
          if (quantity === undefined || quantity <= 0n) return response(422, "INVALID_UOM_CONVERSION");
          const lot = item.tracking === "NONE" ? undefined : lots.get(`${membership.tenantId}:${body.branchId}:${body.lotId}`);
          if (item.tracking !== "NONE" && !lot) return response(422, "LOT_NOT_FOUND");
          const key = `${membership.tenantId}:${body.branchId}:${body.id}`;
          if (transfers.has(key)) return response(409, "TRANSFER_EXISTS");
          const transfer: Transfer = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId,
            sourceWarehouseId: body.sourceWarehouseId, sourceBinId: body.sourceBinId ?? null,
            destinationWarehouseId: body.destinationWarehouseId, destinationBinId: body.destinationBinId ?? null,
            itemId: item.id, lotId: lot?.id ?? null, remnantId: body.remnantId ?? null, quantityBase: quantity, valueMinor: 0n,
            inTransitQuantityBase: 0n, inTransitValueMinor: 0n, status: "READY", reason: body.reason,
            makerMembershipId: membership.membershipId, resourceVersion: 1 };
          transfers.set(key, transfer);
          return { status: 201, body: { transfer: serializeTransfer(transfer), resourceVersion: 1 } };
        });
      }
      const transferCommand = path.match(/^\/api\/v1\/inventory\/transfers\/([^/]+)\/(dispatch|receive|discrepancy-resolution)$/);
      if (transferCommand) {
        const permission = transferCommand[2] === "discrepancy-resolution" ? "inventory.adjust.approve" : "inventory.move";
        const membership = input.memberships[this.token];
        const transfer = membership ? transfers.get(`${membership.tenantId}:${body.branchId}:${transferCommand[1]}`) : undefined;
        const warehouseScope = transfer ? [transfer.sourceWarehouseId, transfer.destinationWarehouseId] : [];
        const authorization = auth(this.token, body.branchId, permission, warehouseScope);
        if (authorization.error) return authorization.error;
        if (!transfer) return response(404, "TRANSFER_NOT_FOUND");
        if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
        return command(authorization.membership!, options, body, (audit, now) => {
          if (options.ifMatch !== transfer.resourceVersion) return response(412, "VERSION_CONFLICT");
          if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
          const evidenceError = validateTransferEvidence(authorization.membership!, transfer.branchId, body.evidence);
          if (evidenceError) return evidenceError;
          if (transferCommand[2] === "dispatch") return dispatchTransfer(authorization.membership!, transfer, body.evidence, body.reason, audit, now);
          if (transferCommand[2] === "receive") return receiveTransfer(authorization.membership!, transfer, body, audit, now);
          return resolveTransferDiscrepancy(authorization.membership!, transfer, body, audit, now);
        });
      }
      if (path === "/api/v1/inventory/counts") {
        const authorization = auth(this.token, body.branchId, "inventory.count", [body.warehouseId]);
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        return command(membership, options, body, (audit, now) => {
          if (!validId(body.id) || !validId(body.reason) || !Array.isArray(body.scope) || body.scope.length === 0) return response(422, "INVALID_COUNT_SCOPE");
          const locationError = validateLocation(warehouses.get(body.warehouseId)!, body.binId);
          if (locationError) return locationError;
          const key = `${membership.tenantId}:${body.branchId}:${body.id}`;
          if (counts.has(key)) return response(409, "COUNT_EXISTS");
          const lines: CountLine[] = [];
          for (const scoped of body.scope) {
            if (!validId(scoped?.itemId)) return response(422, "INVALID_COUNT_SCOPE");
            const item = itemVisible(membership, body.branchId, scoped.itemId);
            if (!item) return response(422, "ITEM_NOT_FOUND");
            if (isCountScopeFrozen(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, scoped.itemId, scoped.lotId ?? null, scoped.remnantId ?? null)) return response(409, "COUNT_SCOPE_ALREADY_FROZEN");
            const balance = getBalance(membership.tenantId, body.branchId, body.warehouseId, body.binId ?? null, scoped.itemId, scoped.lotId ?? null, scoped.remnantId ?? null);
            lines.push({ itemId: scoped.itemId, lotId: scoped.lotId ?? null, remnantId: scoped.remnantId ?? null,
              expectedQuantityBase: balance.quantityBase, expectedValueMinor: balance.valueMinor, entries: [] });
          }
          const count: StockCount = { id: body.id, tenantId: membership.tenantId, branchId: body.branchId, warehouseId: body.warehouseId,
            binId: body.binId ?? null, frozenAt: now, reason: body.reason, lines, round: 1, status: "COUNTING",
            makerMembershipId: membership.membershipId, resourceVersion: 1 };
          counts.set(key, count);
          return { status: 201, body: { count: serializeCount(count), resourceVersion: 1, auditReference: audit } };
        });
      }
      const countCommand = path.match(/^\/api\/v1\/inventory\/counts\/([^/]+)\/(entries|submit|recounts|investigation|adjustment-approval)$/);
      if (countCommand) {
        const requestedPermission = countCommand[2] === "adjustment-approval" ? "inventory.adjust.approve" : "inventory.count";
        const membership = input.memberships[this.token];
        const count = membership ? counts.get(`${membership.tenantId}:${body.branchId}:${countCommand[1]}`) : undefined;
        const authorization = auth(this.token, body.branchId, requestedPermission, count ? [count.warehouseId] : []);
        if (authorization.error) return authorization.error;
        if (!count) return response(404, "COUNT_NOT_FOUND");
        if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
        return command(authorization.membership!, options, body, (audit, now) => {
          if (options.ifMatch !== count.resourceVersion) return response(412, "VERSION_CONFLICT");
          if (countCommand[2] === "entries") return recordCountEntry(authorization.membership!, count, body, audit, now);
          if (countCommand[2] === "submit") return submitCount(count, body);
          if (countCommand[2] === "recounts") return beginRecount(count, body);
          if (countCommand[2] === "investigation") return investigateCount(authorization.membership!, count, body, audit);
          return approveCountAdjustment(authorization.membership!, count, body, audit, now);
        });
      }
      const cutMatch = path.match(/^\/api\/v1\/inventory\/rolls\/([^/]+)\/cuts$/);
      if (cutMatch) {
        const authorization = auth(this.token, body.branchId, "inventory.move", [body.warehouseId]);
        if (authorization.error) return authorization.error;
        const membership = authorization.membership!;
        const piece = rolls.get(`${membership.tenantId}:${body.branchId}:${cutMatch[1]}`);
        if (!piece || piece.warehouseId !== body.warehouseId || piece.binId !== (body.binId ?? null)) return response(404, "ROLL_OR_REMNANT_NOT_FOUND");
        if (options.ifMatch === undefined) return response(428, "IF_MATCH_REQUIRED");
        if (piece.resourceVersion !== options.ifMatch) return response(412, "VERSION_CONFLICT");
        return command(membership, options, body, (audit, now) => {
          if (piece.status !== "AVAILABLE" || !piece.usable) return response(409, "REMNANT_NOT_USABLE");
          if (isCountScopeFrozen(piece.tenantId, piece.branchId, piece.warehouseId, piece.binId, piece.itemId, piece.lotId, piece.id)) return response(409, "COUNT_SCOPE_FROZEN");
          const cutLength = parseQuantity(body.cutLength);
          if (cutLength === undefined || cutLength <= 0n || cutLength > piece.length) return response(422, "INVALID_CUT_LENGTH");
          if (![body.sourceType, body.sourceId, body.reason].every(validId)) return response(422, "SOURCE_AND_REASON_REQUIRED");
          const cutQuantity = cutLength * piece.width / SCALE;
          const remainingLength = piece.length - cutLength;
          const remainingQuantity = remainingLength * piece.width / SCALE;
          if (cutLength * piece.width % SCALE !== 0n) return response(422, "CUT_AREA_NOT_EXACT");
          const cutValue = cutQuantity === piece.quantityBase ? piece.valueMinor : piece.valueMinor * cutQuantity / piece.quantityBase;
          const remainingValue = piece.valueMinor - cutValue;
          if (remainingLength > 0n && remainingLength < piece.minimumUseLength && !validId(body.scrapRemainderReason)) return response(422, "SCRAP_REMAINDER_REASON_REQUIRED");
          if (remainingLength >= piece.minimumUseLength && !validId(body.remnantId)) return response(422, "REMNANT_ID_REQUIRED");
          const remnantKey = remainingLength >= piece.minimumUseLength ? `${membership.tenantId}:${body.branchId}:${body.remnantId}` : undefined;
          if (remnantKey && rolls.has(remnantKey)) return response(409, "REMNANT_EXISTS");
          const sourceBalance = getBalance(piece.tenantId, piece.branchId, piece.warehouseId, piece.binId, piece.itemId, piece.lotId, piece.id);
          if (sourceBalance.quantityBase !== piece.quantityBase || sourceBalance.valueMinor !== piece.valueMinor) return response(409, "ROLL_BALANCE_CONFLICT");
          sourceBalance.quantityBase = 0n;
          sourceBalance.valueMinor = 0n;
          piece.status = "CUT";
          piece.resourceVersion += 1;
          postPair({ membership, branchId: piece.branchId, warehouseId: piece.warehouseId, binId: piece.binId, itemId: piece.itemId,
            lotId: piece.lotId, remnantId: piece.id, quantity: -cutQuantity, value: -cutValue, sourceType: body.sourceType,
            sourceId: body.sourceId, reason: body.reason, audit, now });
          let remnant: RollPiece | undefined;
          let scrap: ApiBody | null = null;
          if (remainingLength >= piece.minimumUseLength) {
            remnant = {
              id: body.remnantId, tenantId: piece.tenantId, branchId: piece.branchId, itemId: piece.itemId, lotId: piece.lotId,
              warehouseId: piece.warehouseId, binId: piece.binId, parentRollId: piece.rootRollId,
              parentRemnantId: piece.parentRollId === null ? null : piece.id, rootRollId: piece.rootRollId, length: remainingLength,
              width: piece.width, minimumUseLength: piece.minimumUseLength, quantityBase: remainingQuantity, valueMinor: remainingValue,
              usable: true, status: "AVAILABLE", resourceVersion: 1,
            };
            rolls.set(remnantKey!, remnant);
            const remnantBalance = getBalance(piece.tenantId, piece.branchId, piece.warehouseId, piece.binId, piece.itemId, piece.lotId, remnant.id);
            remnantBalance.quantityBase += remainingQuantity;
            remnantBalance.valueMinor += remainingValue;
            postLocationTransfer(membership, piece, remnant.id, remainingQuantity, remainingValue, body.sourceId, "Usable remnant retained", audit, now);
          } else if (remainingQuantity > 0n) {
            postPair({ membership, branchId: piece.branchId, warehouseId: piece.warehouseId, binId: piece.binId, itemId: piece.itemId,
              lotId: piece.lotId, remnantId: piece.id, quantity: -remainingQuantity, value: -remainingValue, sourceType: "ROLL_SCRAP",
              sourceId: body.sourceId, reason: body.scrapRemainderReason, audit, now });
            scrap = { quantityBase: formatQuantity(remainingQuantity), valueMinor: remainingValue.toString(), reason: body.scrapRemainderReason };
          }
          return { status: 201, body: {
            cut: { quantityBase: formatQuantity(cutQuantity), valueMinor: cutValue.toString() },
            remnant: remnant ? serializeRoll(remnant) : null, scrap, resourceVersion: piece.resourceVersion,
          } };
        });
      }
      return response(404, "NOT_FOUND");
    }
    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "https://local.workshopos.test");
      if (url.pathname === "/api/v1/inventory/balances") {
        const branchId = url.searchParams.get("branchId");
        const warehouseId = url.searchParams.get("warehouseId");
        const authorization = auth(this.token, branchId, input.memberships[this.token]?.permissions.includes("inventory.view") ? "inventory.view" : "inventory.receive", [warehouseId]);
        if (authorization.error) return authorization.error;
        return { status: 200, body: { balances: [...balances.values()].filter((balance) => balance.tenantId === authorization.membership!.tenantId && balance.branchId === branchId && balance.warehouseId === warehouseId && (!url.searchParams.get("itemId") || balance.itemId === url.searchParams.get("itemId")) && balance.quantityBase !== 0n).map(serializeBalance) } };
      }
      return response(404, "NOT_FOUND");
    }
  }

  function getBalance(tenantId: string, branchId: string, warehouseId: string, binId: string | null, itemId: string, lotId: string | null, remnantId: string | null) {
    const key = [tenantId, branchId, warehouseId, binId ?? "", itemId, lotId ?? "", remnantId ?? ""].join(":");
    let balance = balances.get(key);
    if (!balance) {
      balance = { tenantId, branchId, warehouseId, binId, itemId, lotId, remnantId, quantityBase: 0n, valueMinor: 0n };
      balances.set(key, balance);
    }
    return balance;
  }
  function postPair(input: { membership: InventoryMembership; branchId: string; warehouseId: string; binId: string | null; itemId: string; lotId: string | null; remnantId: string | null; quantity: bigint; value: bigint; sourceType: string; sourceId: string; reason: string; audit: string; now: string }) {
    const common = { tenantId: input.membership.tenantId, branchId: input.branchId, itemId: input.itemId, lotId: input.lotId, remnantId: input.remnantId, sourceType: input.sourceType, sourceId: input.sourceId, actorMembershipId: input.membership.membershipId, occurredAt: input.now, reason: input.reason, auditReference: input.audit };
    ledger.push({ id: `ledger-${++ledgerSequence}`, ...common, account: "INVENTORY_CONTROL", warehouseId: null, binId: null, quantityBase: formatQuantity(-input.quantity), valueMinor: (-input.value).toString() });
    ledger.push({ id: `ledger-${++ledgerSequence}`, ...common, account: "LOCATION_STOCK", warehouseId: input.warehouseId, binId: input.binId, quantityBase: formatQuantity(input.quantity), valueMinor: input.value.toString() });
  }
  function postLocationTransfer(membership: InventoryMembership, piece: RollPiece, destinationRemnantId: string, quantity: bigint, value: bigint, sourceId: string, reason: string, audit: string, now: string) {
    const common = { tenantId: membership.tenantId, branchId: piece.branchId, account: "LOCATION_STOCK" as const, warehouseId: piece.warehouseId,
      binId: piece.binId, itemId: piece.itemId, lotId: piece.lotId, sourceType: "ROLL_REMNANT", sourceId,
      actorMembershipId: membership.membershipId, occurredAt: now, reason, auditReference: audit };
    ledger.push({ id: `ledger-${++ledgerSequence}`, ...common, remnantId: piece.id, quantityBase: formatQuantity(-quantity), valueMinor: (-value).toString() });
    ledger.push({ id: `ledger-${++ledgerSequence}`, ...common, remnantId: destinationRemnantId, quantityBase: formatQuantity(quantity), valueMinor: value.toString() });
  }
  function postTransferEntries(membership: InventoryMembership, transfer: Transfer, from: "LOCATION_STOCK" | "IN_TRANSIT", to: "LOCATION_STOCK" | "IN_TRANSIT", quantity: bigint, value: bigint, sourceType: string, reason: string, audit: string, now: string, destinationLocation = true) {
    const common = { tenantId: transfer.tenantId, branchId: transfer.branchId, itemId: transfer.itemId, lotId: transfer.lotId,
      remnantId: transfer.remnantId, sourceType, sourceId: transfer.id, actorMembershipId: membership.membershipId, occurredAt: now,
      reason, auditReference: audit };
    const location = (account: "LOCATION_STOCK" | "IN_TRANSIT", destination: boolean) => account === "IN_TRANSIT"
      ? { warehouseId: null, binId: null }
      : destination ? { warehouseId: transfer.destinationWarehouseId, binId: transfer.destinationBinId }
        : { warehouseId: transfer.sourceWarehouseId, binId: transfer.sourceBinId };
    ledger.push({ id: `ledger-${++ledgerSequence}`, ...common, account: from, ...location(from, false), quantityBase: formatQuantity(-quantity), valueMinor: (-value).toString() });
    ledger.push({ id: `ledger-${++ledgerSequence}`, ...common, account: to, ...location(to, destinationLocation), quantityBase: formatQuantity(quantity), valueMinor: value.toString() });
  }
  function dispatchTransfer(membership: InventoryMembership, transfer: Transfer, evidence: TransferEvidence, reason: string, audit: string, now: string): ApiResponse {
    if (transfer.status !== "READY") return response(409, "TRANSFER_NOT_DISPATCHABLE");
    if (isCountScopeFrozen(transfer.tenantId, transfer.branchId, transfer.sourceWarehouseId, transfer.sourceBinId, transfer.itemId, transfer.lotId, transfer.remnantId)) return response(409, "COUNT_SCOPE_FROZEN");
    const balance = getBalance(transfer.tenantId, transfer.branchId, transfer.sourceWarehouseId, transfer.sourceBinId, transfer.itemId, transfer.lotId, transfer.remnantId);
    if (balance.quantityBase < transfer.quantityBase) return response(409, "INSUFFICIENT_STOCK");
    const value = transfer.quantityBase === balance.quantityBase ? balance.valueMinor : balance.valueMinor * transfer.quantityBase / balance.quantityBase;
    balance.quantityBase -= transfer.quantityBase;
    balance.valueMinor -= value;
    transfer.valueMinor = value;
    transfer.inTransitQuantityBase = transfer.quantityBase;
    transfer.inTransitValueMinor = value;
    transfer.dispatchEvidence = clone(evidence);
    transfer.status = "IN_TRANSIT";
    transfer.resourceVersion += 1;
    postTransferEntries(membership, transfer, "LOCATION_STOCK", "IN_TRANSIT", transfer.quantityBase, value, "STOCK_TRANSFER_DISPATCH", reason, audit, now);
    return { status: 200, body: { transfer: serializeTransfer(transfer), resourceVersion: transfer.resourceVersion } };
  }
  function receiveTransfer(membership: InventoryMembership, transfer: Transfer, body: ApiBody, audit: string, now: string): ApiResponse {
    if (transfer.status !== "IN_TRANSIT") return response(409, "TRANSFER_NOT_RECEIVABLE");
    if (isCountScopeFrozen(transfer.tenantId, transfer.branchId, transfer.destinationWarehouseId, transfer.destinationBinId, transfer.itemId, transfer.lotId, transfer.remnantId)) return response(409, "COUNT_SCOPE_FROZEN");
    const item = itemVisible(membership, transfer.branchId, transfer.itemId)!;
    const received = convertToBase(item, body.receivedQuantity, body.uom);
    if (received === undefined || received < 0n || received > transfer.inTransitQuantityBase) return response(422, "INVALID_RECEIVED_QUANTITY");
    const receivedValue = received === transfer.inTransitQuantityBase ? transfer.inTransitValueMinor : transfer.inTransitValueMinor * received / transfer.inTransitQuantityBase;
    const destination = getBalance(transfer.tenantId, transfer.branchId, transfer.destinationWarehouseId, transfer.destinationBinId, transfer.itemId, transfer.lotId, transfer.remnantId);
    destination.quantityBase += received;
    destination.valueMinor += receivedValue;
    transfer.inTransitQuantityBase -= received;
    transfer.inTransitValueMinor -= receivedValue;
    transfer.receiptEvidence = clone(body.evidence);
    postTransferEntries(membership, transfer, "IN_TRANSIT", "LOCATION_STOCK", received, receivedValue, "STOCK_TRANSFER_RECEIPT", body.reason, audit, now);
    transfer.resourceVersion += 1;
    if (transfer.inTransitQuantityBase === 0n) transfer.status = "RECEIVED";
    else {
      transfer.status = "RECEIPT_DISCREPANCY";
      transfer.discrepancy = { quantityBase: transfer.inTransitQuantityBase, valueMinor: transfer.inTransitValueMinor, status: "OPEN", reason: body.reason };
    }
    return { status: transfer.status === "RECEIVED" ? 200 : 202, body: { transfer: serializeTransfer(transfer), resourceVersion: transfer.resourceVersion } };
  }
  function resolveTransferDiscrepancy(membership: InventoryMembership, transfer: Transfer, body: ApiBody, audit: string, now: string): ApiResponse {
    if (transfer.status !== "RECEIPT_DISCREPANCY" || !transfer.discrepancy || transfer.discrepancy.status !== "OPEN") return response(409, "TRANSFER_DISCREPANCY_NOT_OPEN");
    if (membership.membershipId === transfer.makerMembershipId) return response(403, "MAKER_CANNOT_CHECK");
    if (body.action !== "RETURN_TO_SOURCE") return response(422, "INVALID_DISCREPANCY_RESOLUTION");
    if (isCountScopeFrozen(transfer.tenantId, transfer.branchId, transfer.sourceWarehouseId, transfer.sourceBinId, transfer.itemId, transfer.lotId, transfer.remnantId)) return response(409, "COUNT_SCOPE_FROZEN");
    const returned = getBalance(transfer.tenantId, transfer.branchId, transfer.sourceWarehouseId, transfer.sourceBinId, transfer.itemId, transfer.lotId, transfer.remnantId);
    returned.quantityBase += transfer.inTransitQuantityBase;
    returned.valueMinor += transfer.inTransitValueMinor;
    postTransferEntries(membership, transfer, "IN_TRANSIT", "LOCATION_STOCK", transfer.inTransitQuantityBase, transfer.inTransitValueMinor, "STOCK_TRANSFER_DISCREPANCY_RETURN", body.reason, audit, now, false);
    transfer.inTransitQuantityBase = 0n;
    transfer.inTransitValueMinor = 0n;
    transfer.discrepancy.status = "RESOLVED";
    transfer.resolutionEvidence = clone(body.evidence);
    transfer.status = "COMPLETED_WITH_DISCREPANCY";
    transfer.resourceVersion += 1;
    return { status: 200, body: { transfer: serializeTransfer(transfer), resourceVersion: transfer.resourceVersion } };
  }
  function isCountScopeFrozen(tenantId: string, branchId: string, warehouseId: string, binId: string | null, itemId: string, lotId: string | null, remnantId: string | null) {
    return [...counts.values()].some((count) => count.tenantId === tenantId && count.branchId === branchId && count.warehouseId === warehouseId &&
      count.binId === binId && !["RECONCILED", "ADJUSTMENT_REJECTED"].includes(count.status) && count.lines.some((line) =>
        line.itemId === itemId && line.lotId === lotId && line.remnantId === remnantId));
  }
  function recordCountEntry(membership: InventoryMembership, count: StockCount, body: ApiBody, audit: string, now: string): ApiResponse {
    if (!(["COUNTING", "RECOUNTING"] as unknown[]).includes(count.status)) return response(409, "COUNT_NOT_OPEN");
    const line = count.lines.find((candidate) => candidate.itemId === body.itemId && candidate.lotId === (body.lotId ?? null) && candidate.remnantId === (body.remnantId ?? null));
    if (!line) return response(422, "COUNT_LINE_NOT_IN_FROZEN_SCOPE");
    if (line.entries.some((entry) => entry.round === count.round)) return response(409, "COUNT_LINE_ALREADY_ENTERED");
    const item = itemVisible(membership, count.branchId, line.itemId)!;
    const quantity = convertToBase(item, body.quantity, body.uom);
    if (quantity === undefined || quantity < 0n) return response(422, "INVALID_UOM_CONVERSION");
    line.entries.push({ round: count.round, quantityBase: quantity, actorMembershipId: membership.membershipId, auditReference: audit, occurredAt: now });
    count.resourceVersion += 1;
    return { status: 201, body: { entry: { itemId: line.itemId, lotId: line.lotId, remnantId: line.remnantId,
      round: count.round, quantityBase: formatQuantity(quantity), actorMembershipId: membership.membershipId, auditReference: audit }, resourceVersion: count.resourceVersion } };
  }
  function submitCount(count: StockCount, body: ApiBody): ApiResponse {
    if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
    if (!(["COUNTING", "RECOUNTING"] as unknown[]).includes(count.status)) return response(409, "COUNT_NOT_OPEN");
    if (count.lines.some((line) => !line.entries.some((entry) => entry.round === count.round))) return response(422, "COUNT_LINES_INCOMPLETE");
    const matches = count.lines.every((line) => line.entries.find((entry) => entry.round === count.round)!.quantityBase === line.expectedQuantityBase);
    count.resourceVersion += 1;
    if (matches) count.status = "RECONCILED";
    else count.status = count.round === 1 ? "RECOUNT_REQUIRED" : "INVESTIGATION_REQUIRED";
    return { status: 200, body: { count: serializeCount(count), resourceVersion: count.resourceVersion } };
  }
  function beginRecount(count: StockCount, body: ApiBody): ApiResponse {
    if (count.status !== "RECOUNT_REQUIRED") return response(409, "RECOUNT_NOT_REQUIRED");
    if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
    count.round += 1;
    count.status = "RECOUNTING";
    count.resourceVersion += 1;
    return { status: 201, body: { count: serializeCount(count), resourceVersion: count.resourceVersion } };
  }
  function investigateCount(membership: InventoryMembership, count: StockCount, body: ApiBody, audit: string): ApiResponse {
    if (count.status !== "INVESTIGATION_REQUIRED") return response(409, "INVESTIGATION_NOT_REQUIRED");
    if (!validId(body.reason)) return response(422, "REASON_REQUIRED");
    const evidenceError = validateCountEvidence(membership, count.branchId, body.evidence);
    if (evidenceError) return evidenceError;
    let quantityVariance = 0n;
    let valueVariance = 0n;
    for (const line of count.lines) {
      const counted = line.entries.find((entry) => entry.round === count.round)!.quantityBase;
      const targetValue = line.expectedQuantityBase === 0n ? 0n : line.expectedValueMinor * counted / line.expectedQuantityBase;
      quantityVariance += counted - line.expectedQuantityBase;
      valueVariance += targetValue - line.expectedValueMinor;
    }
    count.varianceQuantityBase = quantityVariance;
    count.varianceValueMinor = valueVariance;
    count.investigation = { reason: body.reason, evidence: clone(body.evidence), actorMembershipId: membership.membershipId, auditReference: audit };
    count.status = "ADJUSTMENT_PENDING";
    count.resourceVersion += 1;
    return { status: 202, body: { count: serializeCount(count), resourceVersion: count.resourceVersion } };
  }
  function approveCountAdjustment(membership: InventoryMembership, count: StockCount, body: ApiBody, audit: string, now: string): ApiResponse {
    if (count.status !== "ADJUSTMENT_PENDING") return response(409, "ADJUSTMENT_NOT_PENDING");
    if (membership.membershipId === count.makerMembershipId) return response(403, "MAKER_CANNOT_CHECK");
    if (!(body.decision === "APPROVE" || body.decision === "REJECT") || !validId(body.reason)) return response(422, "INVALID_APPROVAL_DECISION");
    count.approval = { decision: body.decision, checkerMembershipId: membership.membershipId, reason: body.reason, auditReference: audit };
    if (body.decision === "REJECT") {
      count.status = "ADJUSTMENT_REJECTED";
    } else {
      for (const line of count.lines) {
        const balance = getBalance(count.tenantId, count.branchId, count.warehouseId, count.binId, line.itemId, line.lotId, line.remnantId);
        const counted = line.entries.find((entry) => entry.round === count.round)!.quantityBase;
        const targetValue = line.expectedQuantityBase === 0n ? 0n : line.expectedValueMinor * counted / line.expectedQuantityBase;
        const quantityVariance = counted - balance.quantityBase;
        const valueVariance = targetValue - balance.valueMinor;
        balance.quantityBase = counted;
        balance.valueMinor = targetValue;
        if (quantityVariance !== 0n || valueVariance !== 0n) postPair({ membership, branchId: count.branchId,
          warehouseId: count.warehouseId, binId: count.binId, itemId: line.itemId, lotId: line.lotId, remnantId: line.remnantId,
          quantity: quantityVariance, value: valueVariance, sourceType: "STOCK_COUNT_ADJUSTMENT", sourceId: count.id,
          reason: body.reason, audit, now });
      }
      count.status = "RECONCILED";
    }
    count.resourceVersion += 1;
    return { status: 200, body: { count: serializeCount(count), resourceVersion: count.resourceVersion } };
  }
  return { signIn: (token: string) => new Session(token), testing: {
    ledger: () => clone(ledger), rolls: () => [...rolls.values()].map(serializeRollTesting), transfers: () => [...transfers.values()].map(serializeTransfer),
    position: (itemId: string) => {
      const locationQuantity = [...balances.values()].filter((balance) => balance.itemId === itemId).reduce((sum, balance) => sum + balance.quantityBase, 0n);
      const locationValue = [...balances.values()].filter((balance) => balance.itemId === itemId).reduce((sum, balance) => sum + balance.valueMinor, 0n);
      const inTransitQuantity = [...transfers.values()].filter((transfer) => transfer.itemId === itemId).reduce((sum, transfer) => sum + transfer.inTransitQuantityBase, 0n);
      const inTransitValue = [...transfers.values()].filter((transfer) => transfer.itemId === itemId).reduce((sum, transfer) => sum + transfer.inTransitValueMinor, 0n);
      return { locationQuantityBase: formatQuantity(locationQuantity), inTransitQuantityBase: formatQuantity(inTransitQuantity),
        totalQuantityBase: formatQuantity(locationQuantity + inTransitQuantity), totalValueMinor: (locationValue + inTransitValue).toString() };
    }, counts: () => [...counts.values()].map(serializeCountTesting),
  } };
}

function response(status: number, code: string): ApiResponse { return { status, body: { code } }; }
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, nested]) => `${JSON.stringify(key)}:${stableJson(nested)}`).join(",")}}`;
  return JSON.stringify(value);
}
function validateLocation(warehouse: InventoryWarehouse, binId: unknown): ApiResponse | undefined {
  if (binId !== undefined && binId !== null && (typeof binId !== "string" || !warehouse.binIds.includes(binId))) return response(422, "BIN_NOT_FOUND");
}
function validateItem(body: ApiBody): ApiResponse | undefined {
  if (![body.id, body.categoryId, body.sku, body.taxCode].every(validId) || !Array.isArray(body.barcodes) || !body.barcodes.every(validId)) return response(422, "INVALID_ITEM");
  if (![body.baseUom, body.stockUom, body.purchaseUom, body.issueUom].every(validUom) || !Array.isArray(body.conversions)) return response(422, "INVALID_ITEM_UOM");
  if (!(["MOVING_AVERAGE", "FIFO", "STANDARD"] as unknown[]).includes(body.costingMethod) || !(["NONE", "LOT", "BATCH", "SERIAL", "ROLL"] as unknown[]).includes(body.tracking)) return response(422, "INVALID_ITEM_POLICY");
  if (parseQuantity(body.reorderPoint) === undefined || typeof body.active !== "boolean") return response(422, "INVALID_ITEM_POLICY");
  for (const conversion of body.conversions) {
    if (!validUom(conversion?.fromUom) || !validUom(conversion?.toUom) || !/^[1-9]\d*$/.test(conversion?.numerator) || !/^[1-9]\d*$/.test(conversion?.denominator)) return response(422, "INVALID_ITEM_UOM");
  }
  const recognized = new Set([body.baseUom, ...body.conversions.flatMap((conversion: any) => [conversion.fromUom, conversion.toUom])]);
  if (![body.stockUom, body.purchaseUom, body.issueUom].every((uom) => recognized.has(uom))) return response(422, "INVALID_ITEM_UOM");
}
function convertToBase(item: Item, value: unknown, uom: unknown): bigint | undefined {
  const quantity = parseQuantity(value);
  if (quantity === undefined || !validUom(uom)) return undefined;
  if (uom === item.baseUom) return quantity;
  const conversion = item.conversions.find((entry) => entry.fromUom === uom && entry.toUom === item.baseUom);
  if (!conversion) return undefined;
  const numerator = BigInt(conversion.numerator);
  const denominator = BigInt(conversion.denominator);
  const converted = quantity * numerator;
  return converted % denominator === 0n ? converted / denominator : undefined;
}
function resolveReceiptLot(membership: InventoryMembership, item: Item, input: unknown, now: string): { lot?: Lot; error?: ApiResponse } {
  if (item.tracking === "NONE") return input == null ? {} : { error: response(422, "LOT_NOT_ALLOWED") };
  if (typeof input !== "object" || input === null) return { error: response(422, "LOT_REQUIRED") };
  const value = input as ApiBody;
  if (![value.id, value.code].every(validId) || !(["AVAILABLE", "QUARANTINED", "BLOCKED", "RECALLED"] as unknown[]).includes(value.status)) return { error: response(422, "INVALID_LOT") };
  if (value.manufacturedAt !== undefined && !validInstant(value.manufacturedAt) || value.expiresAt !== undefined && !validInstant(value.expiresAt)) return { error: response(422, "INVALID_LOT_DATES") };
  if (value.manufacturedAt && value.expiresAt && Date.parse(value.manufacturedAt) >= Date.parse(value.expiresAt)) return { error: response(422, "INVALID_LOT_DATES") };
  if (value.status !== "AVAILABLE") return { error: response(422, "LOT_STATUS_BLOCKED") };
  if (value.expiresAt && Date.parse(value.expiresAt) <= Date.parse(now)) return { error: response(422, "LOT_EXPIRED") };
  if (item.tracking === "SERIAL" && !validId(value.serialNumber)) return { error: response(422, "SERIAL_REQUIRED") };
  return { lot: { id: value.id, tenantId: membership.tenantId, branchId: item.branchId, itemId: item.id, code: value.code, serialNumber: value.serialNumber, manufacturedAt: value.manufacturedAt, expiresAt: value.expiresAt, status: value.status } };
}
function resolveReceiptRoll(membership: InventoryMembership, item: Item, lotId: string | null, body: ApiBody, quantity: bigint, valueMinor: bigint): { roll?: RollPiece; error?: ApiResponse } {
  if (item.tracking !== "ROLL") return body.roll === undefined ? {} : { error: response(422, "ROLL_NOT_ALLOWED") };
  if (!lotId || typeof body.roll !== "object" || body.roll === null) return { error: response(422, "ROLL_REQUIRED") };
  const roll = body.roll as ApiBody;
  const length = parseQuantity(roll.length);
  const width = parseQuantity(roll.width);
  const minimumUseLength = parseQuantity(roll.minimumUseLength);
  if (!validId(roll.id) || length === undefined || width === undefined || minimumUseLength === undefined || length <= 0n || width <= 0n || minimumUseLength <= 0n || minimumUseLength > length) return { error: response(422, "INVALID_ROLL_DIMENSIONS") };
  if (length * width % SCALE !== 0n || length * width / SCALE !== quantity) return { error: response(422, "ROLL_AREA_MISMATCH") };
  return { roll: { id: roll.id, tenantId: membership.tenantId, branchId: item.branchId, itemId: item.id, lotId,
    warehouseId: body.warehouseId, binId: body.binId ?? null, parentRollId: null, parentRemnantId: null, rootRollId: roll.id,
    length, width, minimumUseLength, quantityBase: quantity, valueMinor, usable: true, status: "AVAILABLE", resourceVersion: 1 } };
}
function serializeRoll(piece: RollPiece) {
  return { id: piece.id, parentRollId: piece.parentRollId, parentRemnantId: piece.parentRemnantId, length: formatQuantity(piece.length),
    width: formatQuantity(piece.width), quantityBase: formatQuantity(piece.quantityBase), valueMinor: piece.valueMinor.toString(), usable: piece.usable,
    resourceVersion: piece.resourceVersion };
}
function serializeRollTesting(piece: RollPiece) { return { ...serializeRoll(piece), status: piece.status, rootRollId: piece.rootRollId }; }
function validateTransferEvidence(membership: InventoryMembership, branchId: string, input: unknown): ApiResponse | undefined {
  if (typeof input !== "object" || input === null) return response(422, "TRANSFER_EVIDENCE_REQUIRED");
  const evidence = input as ApiBody;
  const prefix = `${membership.tenantId}/${branchId}/private/inventory/transfers/`;
  if (typeof evidence.privateObjectRef !== "string" || !evidence.privateObjectRef.startsWith(prefix) ||
      typeof evidence.checksum !== "string" || !/^[0-9a-f]{64}$/.test(evidence.checksum) || evidence.scanStatus !== "CLEAN" ||
      !validInstant(evidence.capturedAt)) return response(422, "INVALID_PRIVATE_TRANSFER_EVIDENCE");
}
function serializeTransfer(transfer: Transfer) {
  return {
    id: transfer.id, sourceWarehouseId: transfer.sourceWarehouseId, sourceBinId: transfer.sourceBinId,
    destinationWarehouseId: transfer.destinationWarehouseId, destinationBinId: transfer.destinationBinId,
    itemId: transfer.itemId, lotId: transfer.lotId, remnantId: transfer.remnantId, quantityBase: formatQuantity(transfer.quantityBase),
    valueMinor: transfer.valueMinor.toString(), inTransitQuantityBase: formatQuantity(transfer.inTransitQuantityBase),
    inTransitValueMinor: transfer.inTransitValueMinor.toString(), status: transfer.status, reason: transfer.reason,
    dispatchEvidence: clone(transfer.dispatchEvidence), receiptEvidence: clone(transfer.receiptEvidence),
    resolutionEvidence: clone(transfer.resolutionEvidence), discrepancy: transfer.discrepancy ? {
      quantityBase: formatQuantity(transfer.discrepancy.quantityBase), valueMinor: transfer.discrepancy.valueMinor.toString(),
      status: transfer.discrepancy.status, reason: transfer.discrepancy.reason,
    } : undefined, resourceVersion: transfer.resourceVersion,
  };
}
function validateCountEvidence(membership: InventoryMembership, branchId: string, input: unknown): ApiResponse | undefined {
  if (typeof input !== "object" || input === null) return response(422, "COUNT_INVESTIGATION_EVIDENCE_REQUIRED");
  const evidence = input as ApiBody;
  const prefix = `${membership.tenantId}/${branchId}/private/inventory/counts/`;
  if (typeof evidence.privateObjectRef !== "string" || !evidence.privateObjectRef.startsWith(prefix) ||
      typeof evidence.checksum !== "string" || !/^[0-9a-f]{64}$/.test(evidence.checksum) || evidence.scanStatus !== "CLEAN" ||
      !validInstant(evidence.capturedAt)) return response(422, "INVALID_PRIVATE_COUNT_EVIDENCE");
}
function serializeCount(count: StockCount) {
  return {
    id: count.id, warehouseId: count.warehouseId, binId: count.binId, frozenAt: count.frozenAt, reason: count.reason,
    lines: count.lines.map((line) => ({ itemId: line.itemId, lotId: line.lotId, remnantId: line.remnantId,
      enteredRounds: line.entries.map((entry) => entry.round) })), round: count.round, status: count.status,
    investigation: clone(count.investigation), variance: count.varianceQuantityBase === undefined ? undefined : {
      quantityBase: formatQuantity(count.varianceQuantityBase), valueMinor: count.varianceValueMinor!.toString(),
    }, approval: clone(count.approval), resourceVersion: count.resourceVersion,
  };
}
function serializeCountTesting(count: StockCount) {
  return { ...serializeCount(count), lines: count.lines.map((line) => ({ itemId: line.itemId, lotId: line.lotId,
    remnantId: line.remnantId, expectedQuantityBase: formatQuantity(line.expectedQuantityBase), expectedValueMinor: line.expectedValueMinor.toString(),
    entries: line.entries.map((entry) => ({ ...entry, quantityBase: formatQuantity(entry.quantityBase) })) })) };
}
function serializeBalance(balance: Balance) {
  return { ...balance, quantityBase: formatQuantity(balance.quantityBase), valueMinor: balance.valueMinor.toString() };
}
