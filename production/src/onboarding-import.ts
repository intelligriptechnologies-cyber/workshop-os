import { createHash } from "node:crypto";

type Membership = { identityId: string; membershipId: string; tenantId: string; branchIds: string[]; permissions: string[] };
type CommandOptions = { idempotencyKey: string; ifMatch: number; now: string };
type ApiResponse = { status: number; body: Record<string, any> };
type EntityType = "CUSTOMER" | "CONTACT" | "VEHICLE" | "OWNERSHIP" | "ITEM" | "LOT" | "OPENING_STOCK" | "ADVANCE" | "PAYMENT" | "CREDIT" | "OPEN_DOCUMENT";
type SourceRow = { rowNumber: number; entityType: EntityType; sourceKey: string; values: Record<string, unknown> };
type Batch = {
  id: string; tenantId: string; branchId: string; source: { system: string; extractId: string; schema: string; version: string; rawExtract: string; sha256: string };
  mappings: Partial<Record<EntityType, Record<string, string>>>; rows: SourceRow[]; version: number; fingerprint: string; status: "STAGED" | "COMMITTED" | "RECONCILIATION_BLOCKED" | "RECONCILED" | "ACCEPTED"; createdByMembershipId: string; committedManifestId?: string;
};

const clone = <T>(value: T): T => structuredClone(value);
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const stable = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  return JSON.stringify(value);
};
const normalizeKey = (value: string) => value.trim().toLocaleLowerCase("en-IN");
const exactMinor = (value: unknown) => typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value);
const exactQuantity = (value: unknown) => typeof value === "string" && /^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/.test(value);
const quantityScale = (value: string) => { const [whole, fraction = ""] = value.split("."); return BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, "0")); };
const quantityText = (value: bigint) => { const sign = value < 0n ? "-" : ""; const magnitude = value < 0n ? -value : value; const whole = magnitude / 1_000_000n; const fraction = (magnitude % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, ""); return `${sign}${fraction ? `${whole}.${fraction}` : whole.toString()}`; };
const requiredFields: Record<EntityType, string[]> = {
  CUSTOMER: ["name"], CONTACT: ["customerSourceKey", "name"], VEHICLE: ["registration"], OWNERSHIP: ["vehicleSourceKey", "customerSourceKey", "effectiveFrom"],
  ITEM: ["sku", "name", "baseUom"], LOT: ["itemSourceKey", "lotNumber"], OPENING_STOCK: ["itemSourceKey", "quantity", "uom", "valueMinor"],
  ADVANCE: ["customerSourceKey", "amountMinor", "currency"], PAYMENT: ["documentSourceKey", "amountMinor", "currency"], CREDIT: ["customerSourceKey", "amountMinor", "currency"],
  OPEN_DOCUMENT: ["documentNumber", "payerSourceKey", "balanceMinor", "currency"],
};
const referenceFields: Partial<Record<EntityType, Array<{ sourceField: string; targetField: string; targetType: EntityType; optional?: boolean }>>> = {
  CONTACT: [{ sourceField: "customerSourceKey", targetField: "customerId", targetType: "CUSTOMER" }],
  OWNERSHIP: [{ sourceField: "vehicleSourceKey", targetField: "vehicleId", targetType: "VEHICLE" }, { sourceField: "customerSourceKey", targetField: "customerId", targetType: "CUSTOMER" }],
  LOT: [{ sourceField: "itemSourceKey", targetField: "itemId", targetType: "ITEM" }],
  OPENING_STOCK: [{ sourceField: "itemSourceKey", targetField: "itemId", targetType: "ITEM" }, { sourceField: "lotSourceKey", targetField: "lotId", targetType: "LOT", optional: true }],
  ADVANCE: [{ sourceField: "customerSourceKey", targetField: "customerId", targetType: "CUSTOMER" }],
  PAYMENT: [{ sourceField: "documentSourceKey", targetField: "documentId", targetType: "OPEN_DOCUMENT" }],
  CREDIT: [{ sourceField: "customerSourceKey", targetField: "customerId", targetType: "CUSTOMER" }],
  OPEN_DOCUMENT: [{ sourceField: "payerSourceKey", targetField: "payerId", targetType: "CUSTOMER" }],
};

export function createLocalOnboardingImportApi(input: { memberships: Record<string, Membership>; branches: Array<{ tenantId: string; branchId: string }>; existingTargets?: Array<{ tenantId: string; branchId: string; entityType: EntityType; targetId: string; matchField: string; matchValue: string }> }) {
  const batches: Batch[] = [];
  const manifests: Array<Record<string, any>> = [];
  const operationalEffects: Array<Record<string, any>> = [];
  const reconciliations: Array<Record<string, any>> = [];
  const commands = new Map<string, { digest: string; response: ApiResponse }>();
  let batchSequence = 0;

  const authorize = (token: string, branchId: string): Membership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
    if (!membership.permissions.includes("onboarding.import")) return { status: 403, body: { code: "IMPORT_PERMISSION_DENIED" } };
    if (!membership.branchIds.includes(branchId) || !input.branches.some((branch) => branch.tenantId === membership.tenantId && branch.branchId === branchId)) return { status: 403, body: { code: "BRANCH_SCOPE_FORBIDDEN" } };
    return membership;
  };

  return {
    client(token: string) {
      return {
        async post(path: string, body: Record<string, any>, options: CommandOptions): Promise<ApiResponse> {
          const branchId = String(body.branchId ?? "");
          const auth = authorize(token, branchId); if ("status" in auth) return auth;
          if (!options.idempotencyKey?.trim()) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
          const commandKey = `${auth.tenantId}:${auth.membershipId}:${options.idempotencyKey}`;
          const commandDigest = sha256(stable({ path, body }));
          const previous = commands.get(commandKey);
          if (previous) return previous.digest === commandDigest ? { status: 200, body: clone(previous.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD" } };
          const remember = (response: ApiResponse) => { commands.set(commandKey, { digest: commandDigest, response: clone(response) }); return response; };
          if (path === "/api/v1/onboarding-imports") {
            if (options.ifMatch !== 0) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: 0 } };
            if (body.source?.system === "DEMO_SQLITE" || body.source?.system === "BROWSER_LOCAL_SQLITE") return { status: 422, body: { code: "DEMO_SQLITE_SOURCE_PROHIBITED" } };
            if (body.source?.schema !== "workshopos-onboarding" || body.source?.version !== "1.0" || typeof body.source?.rawExtract !== "string" || typeof body.source?.sha256 !== "string") return { status: 422, body: { code: "UNSUPPORTED_SOURCE_SCHEMA" } };
            if (sha256(body.source.rawExtract) !== body.source.sha256) return { status: 422, body: { code: "SOURCE_CHECKSUM_MISMATCH" } };
            if (typeof body.source.system !== "string" || !body.source.system.trim() || typeof body.source.extractId !== "string" || !body.source.extractId.trim() || !body.mappings || typeof body.mappings !== "object" || Array.isArray(body.mappings) || !Array.isArray(body.rows) || body.rows.length === 0 || body.rows.some((row: unknown) => !row || typeof row !== "object" || !Number.isInteger((row as SourceRow).rowNumber) || (row as SourceRow).rowNumber <= 0 || typeof (row as SourceRow).entityType !== "string" || typeof (row as SourceRow).sourceKey !== "string" || !(row as SourceRow).values || typeof (row as SourceRow).values !== "object" || Array.isArray((row as SourceRow).values))) return { status: 422, body: { code: "INVALID_IMPORT_ENVELOPE" } };
            const rows = (body.rows as SourceRow[]).map((row) => ({ rowNumber: row.rowNumber, entityType: row.entityType, sourceKey: row.sourceKey, values: clone(row.values) }));
            const fingerprint = sha256(stable({ source: body.source, mappings: body.mappings, rows }));
            const existingBatch = batches.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === branchId && candidate.source.system === body.source.system && candidate.source.extractId === body.source.extractId);
            if (existingBatch) {
              if (existingBatch.fingerprint !== fingerprint) return { status: 409, body: { code: "SOURCE_EXTRACT_PAYLOAD_CHANGED", existingBatchId: existingBatch.id } };
              return remember({ status: 200, body: { batch: clone(existingBatch), resourceVersion: existingBatch.version, auditReference: `audit-${existingBatch.id}` } });
            }
            const batch: Batch = { id: `import-batch-${++batchSequence}`, tenantId: auth.tenantId, branchId, source: clone(body.source), mappings: clone(body.mappings), rows, version: 1, fingerprint, status: "STAGED", createdByMembershipId: auth.membershipId };
            batches.push(batch);
            return remember({ status: 201, body: { batch: clone(batch), resourceVersion: 1, auditReference: `audit-${batch.id}` } });
          }
          const dryRunMatch = path.match(/^\/api\/v1\/onboarding-imports\/([^/]+)\/dry-runs$/);
          if (dryRunMatch) {
            const batch = batches.find((candidate) => candidate.id === dryRunMatch[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
            if (!batch) return { status: 404, body: { code: "IMPORT_BATCH_NOT_FOUND" } };
            if (options.ifMatch !== batch.version) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: batch.version } };
            const seenSourceKeys = new Set<string>();
            const targetIdFor = (entityType: string, sourceKey: string) => `${entityType.toLocaleLowerCase("en-IN").replace("opening_", "opening-").replace("open_", "open-")}-${sha256(`${auth.tenantId}:${batch.source.system}:${batch.source.extractId}:${entityType}:${sourceKey}`).slice(0, 20)}`;
            const sourceTargets = new Map(batch.rows.filter((row) => Object.hasOwn(requiredFields, row.entityType) && typeof row.sourceKey === "string" && normalizeKey(row.sourceKey)).map((row) => [`${row.entityType}:${normalizeKey(row.sourceKey)}`, targetIdFor(row.entityType, normalizeKey(row.sourceKey))]));
            const rows = batch.rows.map((row) => {
              const sourceKey = typeof row.sourceKey === "string" ? normalizeKey(row.sourceKey) : "";
              const scopedSourceKey = `${row.entityType}:${sourceKey}`;
              const supported = Object.hasOwn(requiredFields, row.entityType);
              const mapping = supported ? (batch.mappings[row.entityType] ?? {}) : {};
              const mapped = Object.fromEntries(Object.entries(mapping).filter(([sourceField]) => row.values[sourceField] !== undefined).map(([sourceField, targetField]) => [targetField, row.values[sourceField]]));
              const missing = supported ? requiredFields[row.entityType].find((field) => mapped[field] === undefined || mapped[field] === "") : undefined;
              const targetId = targetIdFor(row.entityType, sourceKey);
              const duplicate = seenSourceKeys.has(scopedSourceKey); seenSourceKeys.add(scopedSourceKey);
              let invalidExact: string | undefined;
              if (row.entityType === "OPENING_STOCK" && !exactQuantity(mapped.quantity)) invalidExact = "EXACT_QUANTITY_STRING_REQUIRED:quantity";
              else if (row.entityType === "OPENING_STOCK" && !exactMinor(mapped.valueMinor)) invalidExact = "EXACT_MINOR_UNIT_STRING_REQUIRED:valueMinor";
              else if (["ADVANCE", "PAYMENT", "CREDIT"].includes(row.entityType) && !exactMinor(mapped.amountMinor)) invalidExact = "EXACT_MINOR_UNIT_STRING_REQUIRED:amountMinor";
              else if (row.entityType === "OPEN_DOCUMENT" && !exactMinor(mapped.balanceMinor)) invalidExact = "EXACT_MINOR_UNIT_STRING_REQUIRED:balanceMinor";
              const references: Record<string, string> = {};
              let missingReference: string | undefined;
              for (const reference of referenceFields[row.entityType] ?? []) {
                const rawKey = mapped[reference.sourceField];
                if ((rawKey === undefined || rawKey === "") && reference.optional) continue;
                const normalizedReference = typeof rawKey === "string" ? normalizeKey(rawKey) : "";
                const resolved = sourceTargets.get(`${reference.targetType}:${normalizedReference}`);
                if (!resolved) { missingReference = `REFERENCE_NOT_FOUND:${reference.sourceField}:${normalizedReference}`; break; }
                references[reference.targetField] = resolved;
              }
              const rejection = !supported ? `UNSUPPORTED_ENTITY_TYPE:${row.entityType}` : (!sourceKey ? "SOURCE_KEY_REQUIRED" : (duplicate ? `DUPLICATE_SOURCE_KEY:${scopedSourceKey}` : (missing ? `REQUIRED_FIELD_MISSING:${missing}` : (invalidExact ?? missingReference))));
              const existing = rejection ? undefined : input.existingTargets?.find((target) => target.tenantId === auth.tenantId && target.branchId === branchId && target.entityType === row.entityType && mapped[target.matchField] !== undefined && String(mapped[target.matchField]).trim().toLocaleLowerCase("en-IN") === target.matchValue.trim().toLocaleLowerCase("en-IN"));
              return { rowNumber: row.rowNumber, entityType: row.entityType, sourceKey, result: rejection ? "REJECTED" : (existing ? "WARNING" : "ACCEPTED"), code: rejection ?? (existing ? `POSSIBLE_DUPLICATE:${row.entityType}:${existing.targetId}` : "READY_TO_CREATE"), ...(rejection ? {} : { targetId: existing?.targetId ?? targetId, intendedEffect: { operation: existing ? "REVIEW_EXISTING" : "CREATE", values: mapped, references } }) };
            });
            const manifest = { id: `dry-run-${manifests.length + 1}`, tenantId: auth.tenantId, branchId, batchId: batch.id, batchFingerprint: batch.fingerprint, rows, createdAt: options.now, sha256: "" };
            manifest.sha256 = sha256(stable(manifest)); manifests.push(manifest);
            return remember({ status: 200, body: { manifest: clone(manifest), resourceVersion: batch.version, auditReference: `audit-${manifest.id}` } });
          }
          const commitMatch = path.match(/^\/api\/v1\/onboarding-imports\/([^/]+)\/commit$/);
          if (commitMatch) {
            const batch = batches.find((candidate) => candidate.id === commitMatch[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
            if (!batch) return { status: 404, body: { code: "IMPORT_BATCH_NOT_FOUND" } };
            if (options.ifMatch !== batch.version) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: batch.version } };
            const manifest = manifests.find((candidate) => candidate.id === body.dryRunId && candidate.batchId === batch.id && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
            if (!manifest || manifest.sha256 !== body.manifestSha256 || batch.fingerprint !== body.batchFingerprint || manifest.batchFingerprint !== batch.fingerprint) return { status: 409, body: { code: "DRY_RUN_FINGERPRINT_MISMATCH" } };
            if (batch.committedManifestId && batch.committedManifestId !== manifest.id) return { status: 409, body: { code: "BATCH_ALREADY_COMMITTED_FROM_DIFFERENT_MANIFEST" } };
            const firstCommit = !batch.committedManifestId;
            let committedCount = 0;
            for (const row of manifest.rows.filter((candidate: Record<string, any>) => candidate.result === "ACCEPTED")) {
              const effectKey = `${auth.tenantId}:${branchId}:${row.entityType}:${row.sourceKey}`;
              if (operationalEffects.some((effect) => effect.effectKey === effectKey)) continue;
              operationalEffects.push({ effectKey, tenantId: auth.tenantId, branchId, batchId: batch.id, manifestId: manifest.id, entityType: row.entityType, sourceKey: row.sourceKey, targetId: row.targetId, operation: row.intendedEffect.operation, values: clone(row.intendedEffect.values), committedAt: options.now });
              committedCount += 1;
            }
            if (firstCommit) { batch.version += 1; batch.status = "COMMITTED"; batch.committedManifestId = manifest.id; }
            const response = { status: 200, body: { batchId: batch.id, manifestId: manifest.id, committedCount, resourceVersion: batch.version, auditReference: `audit-commit-${batch.id}-${batch.version}` } };
            return remember(response);
          }
          const reconciliationMatch = path.match(/^\/api\/v1\/onboarding-imports\/([^/]+)\/reconciliations$/);
          if (reconciliationMatch) {
            const batch = batches.find((candidate) => candidate.id === reconciliationMatch[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
            if (!batch) return { status: 404, body: { code: "IMPORT_BATCH_NOT_FOUND" } };
            if (options.ifMatch !== batch.version) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: batch.version } };
            if (!batch.committedManifestId || !body.expected?.entityCounts || !body.expected?.duplicateCounts || !body.expected?.openingStock?.quantitiesByUom || !exactMinor(body.expected.openingStock.valueMinor) || body.expected?.financial?.currency !== "INR" || !["advancesMinor", "paymentsMinor", "creditMinor", "documentBalanceMinor"].every((field) => exactMinor(body.expected.financial[field]))) return { status: 422, body: { code: "INVALID_RECONCILIATION_EXPECTATION" } };
            const effects = operationalEffects.filter((effect) => effect.tenantId === auth.tenantId && effect.branchId === branchId && effect.batchId === batch.id);
            const committedManifest = manifests.find((manifest) => manifest.id === batch.committedManifestId)!;
            const actualEntityCounts: Record<string, number> = {}; for (const effect of effects) actualEntityCounts[effect.entityType] = (actualEntityCounts[effect.entityType] ?? 0) + 1;
            const actualDuplicateCounts: Record<string, number> = {}; for (const row of committedManifest.rows.filter((row: Record<string, any>) => String(row.code).startsWith("DUPLICATE_SOURCE_KEY:") || String(row.code).startsWith("POSSIBLE_DUPLICATE:"))) actualDuplicateCounts[row.entityType] = (actualDuplicateCounts[row.entityType] ?? 0) + 1;
            const stockEffects = effects.filter((effect) => effect.entityType === "OPENING_STOCK");
            const actualQuantitiesByUom: Record<string, bigint> = {}; let actualStockValue = 0n;
            for (const effect of stockEffects) { const uom = String(effect.values.uom); actualQuantitiesByUom[uom] = (actualQuantitiesByUom[uom] ?? 0n) + quantityScale(effect.values.quantity); actualStockValue += BigInt(effect.values.valueMinor); }
            const sumMoney = (entityType: EntityType, field: string) => effects.filter((effect) => effect.entityType === entityType).reduce((sum, effect) => sum + BigInt(effect.values[field]), 0n);
            const differences: Array<{ code: string; expected: string; actual: string; difference: string; resolution: string }> = [];
            const addIntegerDifference = (code: string, expected: string, actual: string) => { const difference = BigInt(actual) - BigInt(expected); if (difference !== 0n) differences.push({ code, expected, actual, difference: difference.toString(), resolution: "CORRECT_SOURCE_MAPPING_OR_RECORD_APPROVAL" }); };
            for (const [entityType, expected] of Object.entries(body.expected.entityCounts)) addIntegerDifference(`ENTITY_COUNT:${entityType}`, String(expected), String(actualEntityCounts[entityType] ?? 0));
            for (const [entityType, expected] of Object.entries(body.expected.duplicateCounts)) addIntegerDifference(`DUPLICATE_COUNT:${entityType}`, String(expected), String(actualDuplicateCounts[entityType] ?? 0));
            for (const [uom, expected] of Object.entries(body.expected.openingStock.quantitiesByUom)) { if (!exactQuantity(expected)) return { status: 422, body: { code: "INVALID_RECONCILIATION_EXPECTATION" } }; const expectedScaled = quantityScale(expected as string); const actualScaled = actualQuantitiesByUom[uom] ?? 0n; if (expectedScaled !== actualScaled) differences.push({ code: `OPENING_STOCK_QUANTITY:${uom}`, expected: expected as string, actual: quantityText(actualScaled), difference: quantityText(actualScaled - expectedScaled), resolution: "CORRECT_SOURCE_MAPPING_OR_RECORD_APPROVAL" }); }
            addIntegerDifference("OPENING_STOCK_VALUE", body.expected.openingStock.valueMinor, actualStockValue.toString());
            addIntegerDifference("ADVANCE_BALANCE", body.expected.financial.advancesMinor, sumMoney("ADVANCE", "amountMinor").toString());
            addIntegerDifference("PAYMENT_BALANCE", body.expected.financial.paymentsMinor, sumMoney("PAYMENT", "amountMinor").toString());
            addIntegerDifference("CREDIT_BALANCE", body.expected.financial.creditMinor, sumMoney("CREDIT", "amountMinor").toString());
            addIntegerDifference("DOCUMENT_BALANCE", body.expected.financial.documentBalanceMinor, sumMoney("OPEN_DOCUMENT", "balanceMinor").toString());
            const base = { id: `reconciliation-${reconciliations.length + 1}`, tenantId: auth.tenantId, branchId, batchId: batch.id, batchFingerprint: batch.fingerprint, manifestSha256: committedManifest.sha256, expected: clone(body.expected), actual: { entityCounts: actualEntityCounts, duplicateCounts: actualDuplicateCounts, openingStock: { quantitiesByUom: Object.fromEntries(Object.entries(actualQuantitiesByUom).map(([uom, quantity]) => [uom, quantityText(quantity)])), valueMinor: actualStockValue.toString() }, financial: { currency: "INR", advancesMinor: sumMoney("ADVANCE", "amountMinor").toString(), paymentsMinor: sumMoney("PAYMENT", "amountMinor").toString(), creditMinor: sumMoney("CREDIT", "amountMinor").toString(), documentBalanceMinor: sumMoney("OPEN_DOCUMENT", "balanceMinor").toString() } }, differences, status: differences.length ? "BLOCKED" : "MATCHED", createdAt: options.now };
            const reconciliation = { ...base, sha256: sha256(stable(base)) }; reconciliations.push(reconciliation); batch.status = differences.length ? "RECONCILIATION_BLOCKED" : "RECONCILED"; batch.version += 1;
            return remember({ status: 200, body: { reconciliation: clone(reconciliation), resourceVersion: batch.version, auditReference: `audit-${reconciliation.id}` } });
          }
          const differenceApprovalMatch = path.match(/^\/api\/v1\/onboarding-imports\/([^/]+)\/reconciliations\/([^/]+)\/approve-differences$/);
          if (differenceApprovalMatch) {
            const batch = batches.find((candidate) => candidate.id === differenceApprovalMatch[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
            if (!batch) return { status: 404, body: { code: "IMPORT_BATCH_NOT_FOUND" } };
            if (!auth.permissions.includes("onboarding.reconciliation.approve") || batch.createdByMembershipId === auth.membershipId) return { status: 403, body: { code: "RECONCILIATION_APPROVER_REQUIRED" } };
            if (options.ifMatch !== batch.version) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: batch.version } };
            const reconciliation = reconciliations.find((candidate) => candidate.id === differenceApprovalMatch[2] && candidate.batchId === batch.id && candidate.tenantId === auth.tenantId);
            if (!reconciliation) return { status: 404, body: { code: "RECONCILIATION_NOT_FOUND" } };
            const actualCodes = reconciliation.differences.map((difference: Record<string, string>) => difference.code).sort();
            const requestedCodes = Array.isArray(body.differenceCodes) ? [...new Set(body.differenceCodes as string[])].sort() : [];
            if (!body.reason?.trim() || stable(actualCodes) !== stable(requestedCodes) || actualCodes.length === 0) return { status: 422, body: { code: "COMPLETE_DIFFERENCE_APPROVAL_REQUIRED", differenceCodes: actualCodes } };
            reconciliation.approvedDifferences = actualCodes.map((code: string) => ({ code, approvedByMembershipId: auth.membershipId, reason: body.reason.trim(), approvedAt: options.now }));
            reconciliation.status = "APPROVED_DIFFERENCES";
            const { sha256: ignoredSha256, ...unsigned } = reconciliation; void ignoredSha256; reconciliation.sha256 = sha256(stable(unsigned));
            batch.status = "RECONCILED"; batch.version += 1;
            return remember({ status: 200, body: { reconciliation: clone(reconciliation), resourceVersion: batch.version, auditReference: `audit-approve-${reconciliation.id}` } });
          }
          const acceptMatch = path.match(/^\/api\/v1\/onboarding-imports\/([^/]+)\/accept$/);
          if (acceptMatch) {
            const batch = batches.find((candidate) => candidate.id === acceptMatch[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
            if (!batch) return { status: 404, body: { code: "IMPORT_BATCH_NOT_FOUND" } };
            if (options.ifMatch !== batch.version) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: batch.version } };
            if (batch.status === "ACCEPTED") return { status: 409, body: { code: "IMPORT_ALREADY_ACCEPTED" } };
            const reconciliation = reconciliations.find((candidate) => candidate.id === body.reconciliationId && candidate.batchId === batch.id && candidate.tenantId === auth.tenantId && candidate.sha256 === body.reconciliationSha256);
            if (!reconciliation) return { status: 409, body: { code: "RECONCILIATION_FINGERPRINT_MISMATCH" } };
            const approvedCodes = new Set((reconciliation.approvedDifferences ?? []).map((approval: Record<string, string>) => approval.code));
            const unresolved = reconciliation.differences.filter((difference: Record<string, string>) => !approvedCodes.has(difference.code));
            if (unresolved.length) return { status: 409, body: { code: "RECONCILIATION_DIFFERENCES_UNRESOLVED", differenceCodes: unresolved.map((difference: Record<string, string>) => difference.code) } };
            batch.status = "ACCEPTED"; batch.version += 1;
            return remember({ status: 200, body: { batchId: batch.id, accepted: true, acceptedAt: options.now, resourceVersion: batch.version, auditReference: `audit-accept-${batch.id}` } });
          }
          return { status: 404, body: { code: "NOT_FOUND" } };
        },
      };
    },
    inspect() { return clone({ batches, manifests, operationalEffects, reconciliations }); },
  };
}
