export type ConfigurationMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

export const MASTER_TYPES = [
  "SERVICE", "CATEGORY", "PACKAGE", "RECIPE", "PRICE", "TAX", "WORKFLOW",
  "CHECKLIST", "REASON", "DOCUMENT_TEMPLATE", "POLICY",
] as const;
export type MasterType = typeof MASTER_TYPES[number];

const SNAPSHOT_TYPES = ["PRICE", "TAX", "WORKFLOW", "RECIPE", "CHECKLIST", "POLICY"] as const;
const STABLE_LIFECYCLE_STAGES = [
  "APPOINTMENT", "CHECK_IN", "INSPECTION", "ESTIMATE", "APPROVED", "ACTIVE",
  "QC", "BILLING", "GATE_VERIFICATION", "DELIVERED", "CLOSED", "CANCELLED",
] as const;

type JsonValue = null | boolean | string | number | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };

type MasterVersion = {
  version: number;
  resourceVersion: number;
  status: "DRAFT" | "PUBLISHED";
  effectiveFrom?: string;
  value: JsonObject;
  used: boolean;
};

type Master = {
  id: string;
  tenantId: string;
  branchId: string;
  type: MasterType;
  key: string;
  versions: MasterVersion[];
};

type Snapshot = {
  masterId: string;
  type: typeof SNAPSHOT_TYPES[number];
  key: string;
  version: number;
  effectiveFrom: string;
  value: JsonObject;
};

type Scope = {
  id: string;
  tenantId: string;
  branchId: string;
  lifecycleStage: typeof STABLE_LIFECYCLE_STAGES[number];
  activatedAt: string;
  snapshots: Record<typeof SNAPSHOT_TYPES[number], Snapshot>;
};

type ApiBody = {
  code?: string;
  master?: Master;
  masterVersion?: MasterVersion;
  masters?: Master[];
  scope?: Scope;
  resourceVersion?: number;
  auditReference?: string;
  [key: string]: unknown;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number };

const clone = <T>(value: T): T => structuredClone(value);
const isMasterType = (value: unknown): value is MasterType => MASTER_TYPES.includes(value as MasterType);
const isLifecycleStage = (value: unknown): value is Scope["lifecycleStage"] =>
  STABLE_LIFECYCLE_STAGES.includes(value as Scope["lifecycleStage"]);
const validInstant = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;

export function createLocalConfigurationApi(input: { memberships: Record<string, ConfigurationMembership> }) {
  const masters = new Map<string, Master>();
  const scopes = new Map<string, Scope>();
  const uomConversions = new Map<string, { tenantId: string; branchId: string; fromUom: string; toUom: string; numerator: string; denominator: string }>();
  const documentSequences = new Map<string, bigint>();
  const commandResults = new Map<string, ApiResponse>();
  let masterSequence = 0;
  let auditSequence = 0;

  const authorize = (token: string, branchId: unknown, permission = "tenant.manage") => {
    const membership = input.memberships[token];
    if (!membership) return { error: { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } } as ApiResponse };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) {
      return { error: { status: 403, body: { code: "BRANCH_FORBIDDEN" } } as ApiResponse };
    }
    if (!membership.permissions.includes(permission)) {
      return { error: { status: 403, body: { code: "PERMISSION_DENIED" } } as ApiResponse };
    }
    return { membership };
  };

  const command = (
    membership: ConfigurationMembership,
    options: CommandOptions,
    action: () => ApiResponse,
  ): ApiResponse => {
    if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const key = `${membership.tenantId}:${options.idempotencyKey}`;
    const replay = commandResults.get(key);
    if (replay) return { status: 200, body: clone(replay.body) };
    const result = action();
    if (result.status >= 200 && result.status < 300) {
      result.body.auditReference = `audit-${membership.tenantId}-${++auditSequence}`;
      commandResults.set(key, clone(result));
    }
    return clone(result);
  };

  const visibleMaster = (membership: ConfigurationMembership, id: string, branchId: string) => {
    const master = masters.get(id);
    return master?.tenantId === membership.tenantId && master.branchId === branchId ? master : undefined;
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const auth = authorize(this.token, body.branchId);
      if (auth.error) return auth.error;
      const membership = auth.membership!;

      if (path === "/api/v1/document-numbers/allocate") {
        return command(membership, options, () => {
          if (typeof body.documentType !== "string" || !/^[A-Z][A-Z0-9_]{1,31}$/.test(body.documentType) ||
              typeof body.financialYear !== "string" || !validFinancialYear(body.financialYear)) {
            return { status: 422, body: { code: "INVALID_DOCUMENT_SEQUENCE_SCOPE" } };
          }
          const sequenceKey = `${membership.tenantId}:${body.branchId}:${body.documentType}:${body.financialYear}`;
          const allocated = (documentSequences.get(sequenceKey) ?? 0n) + 1n;
          documentSequences.set(sequenceKey, allocated);
          const prefix = DOCUMENT_PREFIXES[body.documentType] ?? body.documentType;
          const documentNumber = `${prefix}/${body.financialYear}/${allocated.toString().padStart(6, "0")}`;
          return { status: 201, body: { documentNumber, sequence: allocated.toString(), documentType: body.documentType, financialYear: body.financialYear } };
        });
      }

      if (path === "/api/v1/configuration/uom-conversions") {
        return command(membership, options, () => {
          if (!validUom(body.fromUom) || !validUom(body.toUom) || body.fromUom === body.toUom ||
              !positiveInteger(body.numerator) || !positiveInteger(body.denominator)) {
            return { status: 422, body: { code: "INVALID_UOM_CONVERSION" } };
          }
          const key = `${membership.tenantId}:${body.branchId}:${body.fromUom}:${body.toUom}`;
          if (uomConversions.has(key)) return { status: 409, body: { code: "UOM_CONVERSION_EXISTS" } };
          const conversion = {
            tenantId: membership.tenantId, branchId: String(body.branchId), fromUom: body.fromUom,
            toUom: body.toUom, numerator: body.numerator, denominator: body.denominator,
          };
          uomConversions.set(key, conversion);
          return { status: 201, body: { conversion } };
        });
      }

      if (path === "/api/v1/configuration/uom-conversions/convert") {
        return command(membership, options, () => {
          if (!validUom(body.fromUom) || !validUom(body.toUom) || typeof body.quantity !== "string") {
            return { status: 422, body: { code: "INVALID_QUANTITY" } };
          }
          const key = `${membership.tenantId}:${body.branchId}:${body.fromUom}:${body.toUom}`;
          const conversion = uomConversions.get(key);
          if (!conversion) return { status: 404, body: { code: "UOM_CONVERSION_NOT_FOUND" } };
          const value = convertDecimal(body.quantity, BigInt(conversion.numerator), BigInt(conversion.denominator));
          if (!value) return { status: 422, body: { code: "QUANTITY_NOT_EXACT_AT_DECLARED_PRECISION" } };
          return { status: 200, body: { quantity: { value, uom: conversion.toUom } } };
        });
      }

      if (path === "/api/v1/configuration/masters") {
        return command(membership, options, () => {
          if (!isMasterType(body.type) || typeof body.key !== "string" || !body.key.trim() || !isJsonObject(body.value)) {
            return { status: 400, body: { code: "INVALID_MASTER" } };
          }
          if (body.type === "WORKFLOW" && definesCoreLifecycle(body.value)) {
            return { status: 422, body: { code: "CORE_LIFECYCLE_IS_PLATFORM_DEFINED" } };
          }
          if (body.type === "PRICE") {
            const invalid = validateMoney(body.value);
            if (invalid) return invalid;
          }
          const duplicate = [...masters.values()].some((item) =>
            item.tenantId === membership.tenantId && item.branchId === body.branchId && item.type === body.type && item.key === body.key,
          );
          if (duplicate) return { status: 409, body: { code: "MASTER_KEY_EXISTS" } };
          const version: MasterVersion = { version: 1, resourceVersion: 1, status: "DRAFT", value: clone(body.value), used: false };
          const master: Master = {
            id: `master-${++masterSequence}`, tenantId: membership.tenantId, branchId: String(body.branchId),
            type: body.type, key: body.key.trim(), versions: [version],
          };
          masters.set(master.id, master);
          return { status: 201, body: { master: clone(master), masterVersion: clone(version), resourceVersion: 1 } };
        });
      }

      const addVersion = path.match(/^\/api\/v1\/configuration\/masters\/([^/]+)\/versions$/);
      if (addVersion) {
        const master = visibleMaster(membership, addVersion[1], String(body.branchId));
        if (!master) return { status: 404, body: { code: "MASTER_NOT_FOUND" } };
        return command(membership, options, () => {
          if (!isJsonObject(body.value)) return { status: 400, body: { code: "INVALID_MASTER_VALUE" } };
          if (master.type === "WORKFLOW" && definesCoreLifecycle(body.value)) return { status: 422, body: { code: "CORE_LIFECYCLE_IS_PLATFORM_DEFINED" } };
          if (master.type === "PRICE") {
            const invalid = validateMoney(body.value);
            if (invalid) return invalid;
          }
          const latest = master.versions.at(-1)!;
          if (latest.status === "DRAFT") return { status: 409, body: { code: "DRAFT_VERSION_EXISTS" } };
          const version: MasterVersion = {
            version: latest.version + 1, resourceVersion: 1, status: "DRAFT", value: clone(body.value), used: false,
          };
          master.versions.push(version);
          return { status: 201, body: { masterVersion: clone(version), resourceVersion: version.resourceVersion } };
        });
      }

      const publish = path.match(/^\/api\/v1\/configuration\/masters\/([^/]+)\/versions\/(\d+)\/publish$/);
      if (publish) {
        const master = visibleMaster(membership, publish[1], String(body.branchId));
        if (!master) return { status: 404, body: { code: "MASTER_NOT_FOUND" } };
        return command(membership, options, () => {
          const version = master.versions.find((item) => item.version === Number(publish[2]));
          if (!version) return { status: 404, body: { code: "MASTER_VERSION_NOT_FOUND" } };
          if (version.status !== "DRAFT") return { status: 409, body: { code: "PUBLISHED_VERSION_IMMUTABLE" } };
          if (!validInstant(body.effectiveFrom)) return { status: 400, body: { code: "INVALID_EFFECTIVE_FROM" } };
          const latestEffective = master.versions.filter((item) => item.effectiveFrom).at(-1)?.effectiveFrom;
          if (latestEffective && Date.parse(body.effectiveFrom) <= Date.parse(latestEffective)) {
            return { status: 409, body: { code: "EFFECTIVE_DATE_MUST_ADVANCE" } };
          }
          version.status = "PUBLISHED";
          version.effectiveFrom = body.effectiveFrom;
          version.resourceVersion += 1;
          return { status: 200, body: { masterVersion: clone(version), resourceVersion: version.resourceVersion } };
        });
      }

      const activate = path.match(/^\/api\/v1\/scopes\/([^/]+)\/activate$/);
      if (activate) {
        return command(membership, options, () => {
          if (scopes.has(`${membership.tenantId}:${activate[1]}`)) return { status: 409, body: { code: "SCOPE_ALREADY_ACTIVE" } };
          if (!isLifecycleStage(body.lifecycleStage) || !["APPROVED", "ACTIVE"].includes(body.lifecycleStage)) {
            return { status: 422, body: { code: "SCOPE_REQUIRES_APPROVED_OR_ACTIVE_STAGE" } };
          }
          if (!validInstant(body.effectiveAt) || !isJsonObject(body.configuration)) {
            return { status: 400, body: { code: "INVALID_SCOPE_CONFIGURATION" } };
          }
          const effectiveAt = body.effectiveAt;
          const snapshots = {} as Scope["snapshots"];
          const selectedVersions: MasterVersion[] = [];
          for (const type of SNAPSHOT_TYPES) {
            const masterId = body.configuration[type];
            if (typeof masterId !== "string") return { status: 422, body: { code: `MISSING_${type}_CONFIGURATION` } };
            const master = visibleMaster(membership, masterId, String(body.branchId));
            if (!master || master.type !== type) return { status: 422, body: { code: `INVALID_${type}_CONFIGURATION` } };
            const selected = master.versions
              .filter((version) => version.status === "PUBLISHED" && Date.parse(version.effectiveFrom!) <= Date.parse(effectiveAt))
              .sort((a, b) => Date.parse(b.effectiveFrom!) - Date.parse(a.effectiveFrom!))[0];
            if (!selected) return { status: 422, body: { code: `NO_EFFECTIVE_${type}_CONFIGURATION` } };
            selectedVersions.push(selected);
            snapshots[type] = {
              masterId: master.id, type, key: master.key, version: selected.version,
              effectiveFrom: selected.effectiveFrom!, value: clone(selected.value),
            };
          }
          selectedVersions.forEach((version) => { version.used = true; });
          const scope: Scope = {
            id: activate[1], tenantId: membership.tenantId, branchId: String(body.branchId),
            lifecycleStage: body.lifecycleStage, activatedAt: effectiveAt, snapshots,
          };
          scopes.set(`${membership.tenantId}:${scope.id}`, scope);
          return { status: 201, body: { scope: clone(scope), resourceVersion: 1 } };
        });
      }

      return { status: 404, body: { code: "NOT_FOUND" } };
    }

    async patch(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const auth = authorize(this.token, body.branchId);
      if (auth.error) return auth.error;
      const match = path.match(/^\/api\/v1\/configuration\/masters\/([^/]+)\/versions\/(\d+)$/);
      if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
      const master = visibleMaster(auth.membership!, match[1], String(body.branchId));
      const version = master?.versions.find((item) => item.version === Number(match[2]));
      if (!master || !version) return { status: 404, body: { code: "MASTER_VERSION_NOT_FOUND" } };
      if (version.status !== "DRAFT") return { status: 409, body: { code: "PUBLISHED_VERSION_IMMUTABLE" } };
      if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
      if (options.ifMatch !== version.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT" } };
      if (!isJsonObject(body.value)) return { status: 400, body: { code: "INVALID_MASTER_VALUE" } };
      if (master.type === "WORKFLOW" && definesCoreLifecycle(body.value)) return { status: 422, body: { code: "CORE_LIFECYCLE_IS_PLATFORM_DEFINED" } };
      if (master.type === "PRICE") {
        const invalid = validateMoney(body.value);
        if (invalid) return invalid;
      }
      version.value = clone(body.value);
      version.resourceVersion += 1;
      return { status: 200, body: { masterVersion: clone(version), resourceVersion: version.resourceVersion, auditReference: `audit-${auth.membership!.tenantId}-${++auditSequence}` } };
    }

    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "https://local.workshopos.test");
      const branchId = url.searchParams.get("branchId");
      const auth = authorize(this.token, branchId);
      if (auth.error) return auth.error;
      const scopeMatch = url.pathname.match(/^\/api\/v1\/scopes\/([^/]+)$/);
      if (scopeMatch) {
        const scope = scopes.get(`${auth.membership!.tenantId}:${scopeMatch[1]}`);
        if (!scope || scope.branchId !== branchId) return { status: 404, body: { code: "SCOPE_NOT_FOUND" } };
        return { status: 200, body: { scope: clone(scope) } };
      }
      if (url.pathname === "/api/v1/configuration/masters") {
        return { status: 200, body: { masters: [...masters.values()].filter((item) => item.tenantId === auth.membership!.tenantId && item.branchId === branchId).map(clone) } };
      }
      return { status: 404, body: { code: "NOT_FOUND" } };
    }

    async delete(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const auth = authorize(this.token, body.branchId);
      if (auth.error) return auth.error;
      const match = path.match(/^\/api\/v1\/configuration\/masters\/([^/]+)\/versions\/(\d+)$/);
      if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
      const membership = auth.membership!;
      const master = visibleMaster(membership, match[1], String(body.branchId));
      const version = master?.versions.find((item) => item.version === Number(match[2]));
      if (!master || !version) return { status: 404, body: { code: "MASTER_VERSION_NOT_FOUND" } };
      if (version.status !== "DRAFT" || version.used) return { status: 409, body: { code: "PUBLISHED_VERSION_IMMUTABLE" } };
      if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
      if (options.ifMatch !== version.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT" } };
      return command(membership, options, () => {
        master.versions.splice(master.versions.indexOf(version), 1);
        if (master.versions.length === 0) masters.delete(master.id);
        return { status: 204, body: { resourceVersion: version.resourceVersion } };
      });
    }
  }

  return { signIn: (token: string) => new Session(token), stableLifecycleStages: [...STABLE_LIFECYCLE_STAGES] };
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function definesCoreLifecycle(value: JsonObject): boolean {
  return "coreLifecycle" in value || "lifecycleStages" in value || "coreStages" in value;
}

function validateMoney(value: JsonObject): ApiResponse | undefined {
  if (typeof value.amountMinor !== "string" || !/^-?(0|[1-9]\d*)$/.test(value.amountMinor)) {
    return { status: 422, body: { code: "MONEY_MINOR_UNITS_REQUIRED" } };
  }
  if (typeof value.currency !== "string" || !/^[A-Z]{3}$/.test(value.currency)) {
    return { status: 422, body: { code: "INVALID_CURRENCY" } };
  }
}

function validUom(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z][A-Z0-9_-]{0,15}$/.test(value);
}

function positiveInteger(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d*$/.test(value);
}

function convertDecimal(value: string, numerator: bigint, denominator: bigint): string | undefined {
  const match = value.match(/^(-?)(0|[1-9]\d*)(?:\.(\d+))?$/);
  if (!match) return undefined;
  const inputScale = match[3]?.length ?? 0;
  let coefficient = BigInt(`${match[1]}${match[2]}${match[3] ?? ""}`) * numerator;
  let divisor = (10n ** BigInt(inputScale)) * denominator;
  const common = gcd(coefficient < 0n ? -coefficient : coefficient, divisor);
  coefficient /= common;
  divisor /= common;
  let twos = 0;
  let fives = 0;
  while (divisor % 2n === 0n) { divisor /= 2n; twos += 1; }
  while (divisor % 5n === 0n) { divisor /= 5n; fives += 1; }
  if (divisor !== 1n) return undefined;
  const scale = Math.max(inputScale, twos, fives);
  const converted = coefficient * (10n ** BigInt(scale)) /
    ((2n ** BigInt(twos)) * (5n ** BigInt(fives)));
  const sign = converted < 0n ? "-" : "";
  const digits = (converted < 0n ? -converted : converted).toString().padStart(scale + 1, "0");
  if (scale === 0) return `${sign}${digits}`;
  return `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function gcd(left: bigint, right: bigint): bigint {
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

const DOCUMENT_PREFIXES: Record<string, string> = {
  INVOICE: "INV", ESTIMATE: "EST", JOB_CARD: "JOB", GATE_PASS: "GATE",
  PURCHASE_ORDER: "PO", GOODS_RECEIPT: "GRN", CREDIT_NOTE: "CN", DEBIT_NOTE: "DN",
};

function validFinancialYear(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  return Boolean(match && (Number(match[1]) + 1) % 100 === Number(match[2]));
}
