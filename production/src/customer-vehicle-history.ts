import { createHash } from "node:crypto";

export type CustomerVehicleMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
  authenticatedAt?: string;
  mfa?: boolean;
};

type ContactType = "MOBILE" | "PHONE" | "EMAIL" | "WHATSAPP" | "ADDRESS";
type Consent = "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";
type Contact = { id: string; name: string; type: ContactType; value: string; consent: Consent; preferred: boolean };
type PayerRelation = { payerCustomerId: string; relationship: string; effectiveFrom: string; effectiveTo?: string };
type Customer = {
  id: string;
  tenantId: string;
  branchId: string;
  displayName: string;
  contacts: Contact[];
  payerRelations: PayerRelation[];
  aliases: string[];
  status: "ACTIVE" | "MERGED";
  canonicalId?: string;
  resourceVersion: number;
};
type DuplicateMatch = { entityId: string; confidence: "EXACT" | "PROBABLE"; reasons: string[] };
type AuditEntry = { auditReference: string; tenantId: string; branchId: string; actorIdentityId: string; membershipId: string; action: string; resourceIds: string[]; reason?: string; evidence: string[]; occurredAt: string };
type Ownership = { id: string; customerId: string; effectiveFrom: string; effectiveTo?: string; recordedAt: string; auditReference: string };
type OdometerReading = { id: string; readingKm: number; recordedAt: string; source: string; correctionOfId?: string; reason?: string; auditReference: string };
type ServiceHistoryEntry = { id: string; jobId: string; servicedAt: string; odometerKm: number; summary: string; ownerCustomerId: string; payerCustomerId: string; auditReference: string };
type Vehicle = {
  id: string;
  tenantId: string;
  branchId: string;
  registration: string;
  vin: string;
  attributes: Record<string, unknown>;
  ownershipHistory: Ownership[];
  odometerHistory: OdometerReading[];
  serviceHistory: ServiceHistoryEntry[];
  aliases: string[];
  status: "ACTIVE" | "MERGED";
  canonicalId?: string;
  resourceVersion: number;
};
type MergeRecord = {
  id: string;
  tenantId: string;
  branchId: string;
  entityType: "CUSTOMER" | "VEHICLE";
  canonicalId: string;
  duplicateIds: string[];
  status: "APPLIED" | "COMPENSATED";
  reason: string;
  evidence: string[];
  resourceVersion: number;
  auditReference: string;
  compensationAuditReference?: string;
};
type StoredMerge = MergeRecord & { beforeCanonical: Customer | Vehicle; beforeDuplicates: Array<Customer | Vehicle> };

type ApiBody = {
  code?: string;
  customer?: Customer;
  customers?: Customer[];
  duplicateMatches?: DuplicateMatch[];
  vehicle?: Vehicle;
  vehicles?: Vehicle[];
  merge?: MergeRecord;
  auditEntries?: AuditEntry[];
  resourceVersion?: number;
  auditReference?: string;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string };

const clone = <T>(value: T): T => structuredClone(value);
const normalizeText = (value: unknown) => String(value ?? "").trim().toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, "");
const normalizeContact = (type: ContactType, value: string) => type === "EMAIL" ? value.trim().toLowerCase() : value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

function similarity(left: string, right: string): number {
  if (!left || !right) return 0;
  if (left === right) return 1;
  const grams = (text: string) => new Set(Array.from({ length: Math.max(0, text.length - 1) }, (_, index) => text.slice(index, index + 2)));
  const a = grams(left);
  const b = grams(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((gram) => b.has(gram)).length;
  return (2 * intersection) / (a.size + b.size);
}

function validateCustomerInput(body: Record<string, unknown>): { displayName: string; contacts: Contact[]; payerRelations: PayerRelation[] } | string {
  const displayName = String(body.displayName ?? "").trim();
  if (!displayName) return "CUSTOMER_NAME_REQUIRED";
  if (!Array.isArray(body.contacts) || body.contacts.length === 0) return "CUSTOMER_CONTACT_REQUIRED";
  const contacts: Contact[] = [];
  for (const raw of body.contacts) {
    if (!raw || typeof raw !== "object") return "INVALID_CONTACT";
    const item = raw as Record<string, unknown>;
    const type = String(item.type ?? "") as ContactType;
    const consent = String(item.consent ?? "") as Consent;
    if (!["MOBILE", "PHONE", "EMAIL", "WHATSAPP", "ADDRESS"].includes(type) || !["OPTED_IN", "OPTED_OUT", "UNKNOWN"].includes(consent)) return "INVALID_CONTACT";
    const contact = { id: String(item.id ?? "").trim(), name: String(item.name ?? "").trim(), type, value: String(item.value ?? "").trim(), consent, preferred: item.preferred === true };
    if (!contact.id || !contact.name || !contact.value) return "INVALID_CONTACT";
    contacts.push(contact);
  }
  if (contacts.filter((contact) => contact.preferred).length !== 1) return "ONE_PREFERRED_CONTACT_REQUIRED";
  const payerRelations = Array.isArray(body.payerRelations) ? body.payerRelations.map((raw) => {
    const item = raw as Record<string, unknown>;
    return { payerCustomerId: String(item.payerCustomerId ?? ""), relationship: String(item.relationship ?? ""), effectiveFrom: String(item.effectiveFrom ?? ""), ...(item.effectiveTo ? { effectiveTo: String(item.effectiveTo) } : {}) };
  }) : [];
  return { displayName, contacts, payerRelations };
}

export function createLocalCustomerVehicleApi(input: {
  memberships: Record<string, CustomerVehicleMembership>;
  duplicatePolicy?: { probableNameThreshold?: number };
  recentAuthenticationMinutes?: number;
}) {
  const customers = new Map<string, Customer>();
  const vehicles = new Map<string, Vehicle>();
  const audits: AuditEntry[] = [];
  const commandResults = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const merges = new Map<string, StoredMerge>();
  let customerSequence = 0;
  let auditSequence = 0;
  let vehicleSequence = 0;
  let mergeSequence = 0;
  const probableNameThreshold = input.duplicatePolicy?.probableNameThreshold ?? 0.78;

  const authorize = (token: string, branchId: string, permission: string): CustomerVehicleMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return { status: 401, body: { code: "UNAUTHENTICATED" } };
    if (!membership.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
    if (!membership.permissions.includes(permission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
    return membership;
  };
  const visibleCustomers = (membership: CustomerVehicleMembership, branchId: string) => [...customers.values()].filter((item) => item.tenantId === membership.tenantId && item.branchId === branchId);
  const visibleVehicles = (membership: CustomerVehicleMembership, branchId: string) => [...vehicles.values()].filter((item) => item.tenantId === membership.tenantId && item.branchId === branchId);
  const customerMatches = (membership: CustomerVehicleMembership, branchId: string, candidate: { displayName: string; contacts?: Contact[] }, excludingId?: string): DuplicateMatch[] => {
    const result: DuplicateMatch[] = [];
    for (const customer of visibleCustomers(membership, branchId)) {
      if (customer.id === excludingId) continue;
      const exactReasons = new Set<string>();
      for (const candidateContact of candidate.contacts ?? []) {
        for (const contact of customer.contacts) {
          if (candidateContact.type === contact.type && normalizeContact(contact.type, candidateContact.value) === normalizeContact(contact.type, contact.value)) exactReasons.add(contact.type);
        }
      }
      if (exactReasons.size) result.push({ entityId: customer.id, confidence: "EXACT", reasons: [...exactReasons].sort() });
      else if (similarity(normalizeText(candidate.displayName), normalizeText(customer.displayName)) >= probableNameThreshold) result.push({ entityId: customer.id, confidence: "PROBABLE", reasons: ["NAME_SIMILARITY"] });
    }
    return result;
  };
  const vehicleMatches = (membership: CustomerVehicleMembership, branchId: string, candidate: Pick<Vehicle, "registration" | "vin" | "attributes">, excludingId?: string): DuplicateMatch[] => {
    const result: DuplicateMatch[] = [];
    for (const vehicle of visibleVehicles(membership, branchId)) {
      if (vehicle.id === excludingId) continue;
      const reasons: string[] = [];
      if (normalizeText(candidate.registration) && normalizeText(candidate.registration) === normalizeText(vehicle.registration)) reasons.push("REGISTRATION");
      if (normalizeText(candidate.vin) && normalizeText(candidate.vin) === normalizeText(vehicle.vin)) reasons.push("VIN");
      if (reasons.length) result.push({ entityId: vehicle.id, confidence: "EXACT", reasons: reasons.sort() });
      else {
        const candidateMakeModel = normalizeText(`${candidate.attributes.make ?? ""}${candidate.attributes.model ?? ""}`);
        const makeModel = normalizeText(`${vehicle.attributes.make ?? ""}${vehicle.attributes.model ?? ""}`);
        if (candidateMakeModel && similarity(candidateMakeModel, makeModel) >= probableNameThreshold && (normalizeText(candidate.registration).slice(-4) === normalizeText(vehicle.registration).slice(-4))) {
          result.push({ entityId: vehicle.id, confidence: "PROBABLE", reasons: ["MAKE_MODEL_AND_REGISTRATION_SUFFIX"] });
        }
      }
    }
    return result;
  };
  const audit = (membership: CustomerVehicleMembership, branchId: string, action: string, resourceIds: string[], now?: string, reason?: string, evidence: string[] = []) => {
    const auditReference = `audit-customer-${++auditSequence}`;
    audits.push({ auditReference, tenantId: membership.tenantId, branchId, actorIdentityId: membership.identityId, membershipId: membership.membershipId, action, resourceIds, reason, evidence: [...evidence], occurredAt: now ?? new Date().toISOString() });
    return auditReference;
  };
  const execute = (membership: CustomerVehicleMembership, key: string | undefined, request: unknown, work: () => ApiResponse): ApiResponse => {
    if (!key?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const commandKey = `${membership.tenantId}:${key}`;
    const hash = fingerprint(request);
    const prior = commandResults.get(commandKey);
    if (prior) return prior.fingerprint === hash ? clone({ ...prior.response, status: prior.response.status === 201 ? 200 : prior.response.status }) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
    const response = work();
    if (response.status >= 200 && response.status < 300) commandResults.set(commandKey, { fingerprint: hash, response: clone(response) });
    return response;
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      if (path === "/api/v1/identity/merges") {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "identity.merge");
        if ("status" in decision) return decision;
        const entityType = String(body.entityType ?? "") as "CUSTOMER" | "VEHICLE";
        const canonicalId = String(body.canonicalId ?? "");
        const duplicateIds = Array.isArray(body.duplicateIds) ? body.duplicateIds.map(String) : [];
        const sourceVersions = body.sourceVersions && typeof body.sourceVersions === "object" ? body.sourceVersions as Record<string, unknown> : {};
        const reason = String(body.reason ?? "").trim();
        const evidence = Array.isArray(body.evidence) && body.evidence.every((item) => typeof item === "string" && item.trim()) ? body.evidence as string[] : [];
        if (!(["CUSTOMER", "VEHICLE"] as string[]).includes(entityType) || !canonicalId || duplicateIds.length === 0 || new Set([canonicalId, ...duplicateIds]).size !== duplicateIds.length + 1) return { status: 422, body: { code: "INVALID_MERGE_SET" } };
        if (!reason || evidence.length === 0) return { status: 422, body: { code: "MERGE_EVIDENCE_REQUIRED" } };
        const collection = entityType === "CUSTOMER" ? customers : vehicles;
        const records = [canonicalId, ...duplicateIds].map((id) => collection.get(id));
        if (records.some((record) => !record || record.tenantId !== decision.tenantId || record.branchId !== branchId)) return { status: 404, body: { code: "NOT_FOUND" } };
        if (records.some((record) => record?.status !== "ACTIVE")) return { status: 409, body: { code: "MERGE_RECORD_NOT_ACTIVE" } };
        if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
        if (options.ifMatch !== records[0]!.resourceVersion || records.some((record) => Number(sourceVersions[record!.id]) !== record!.resourceVersion)) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: records[0]!.resourceVersion } };
        if (entityType === "VEHICLE") {
          const identityValues = (record: Vehicle) => ({ registration: normalizeText(record.registration), vin: normalizeText(record.vin) });
          const canonicalIdentity = identityValues(records[0] as Vehicle);
          const unsafe = records.slice(1).some((raw) => {
            const source = identityValues(raw as Vehicle);
            return (canonicalIdentity.vin && source.vin && canonicalIdentity.vin !== source.vin) || (canonicalIdentity.registration && source.registration && canonicalIdentity.registration !== source.registration);
          });
          if (unsafe) return { status: 409, body: { code: "UNSAFE_IDENTITY_CONFLICT" } };
        }
        return execute(decision, options.idempotencyKey, { path, body, ifMatch: options.ifMatch }, () => {
          const canonical = records[0]!;
          const beforeCanonical = clone(canonical);
          const beforeDuplicates = records.slice(1).map((record) => clone(record!));
          if (entityType === "CUSTOMER") {
            const target = canonical as Customer;
            for (const raw of records.slice(1)) {
              const source = raw as Customer;
              target.aliases.push(source.id, ...source.aliases.filter((alias) => !target.aliases.includes(alias)));
              for (const contact of source.contacts) {
                if (!target.contacts.some((existing) => existing.id === contact.id)) target.contacts.push({ ...clone(contact), preferred: false });
              }
              for (const payerRelation of source.payerRelations) if (!target.payerRelations.some((existing) => JSON.stringify(existing) === JSON.stringify(payerRelation))) target.payerRelations.push(clone(payerRelation));
              source.status = "MERGED"; source.canonicalId = target.id; source.resourceVersion += 1;
            }
          } else {
            const target = canonical as Vehicle;
            for (const raw of records.slice(1)) {
              const source = raw as Vehicle;
              target.aliases.push(source.id, ...source.aliases.filter((alias) => !target.aliases.includes(alias)));
              target.ownershipHistory.push(...clone(source.ownershipHistory));
              target.odometerHistory.push(...clone(source.odometerHistory));
              target.serviceHistory.push(...clone(source.serviceHistory));
              source.status = "MERGED"; source.canonicalId = target.id; source.resourceVersion += 1;
            }
          }
          canonical.resourceVersion += 1;
          const mergeId = `merge-${++mergeSequence}`;
          const auditReference = audit(decision, branchId, `identity.${entityType.toLowerCase()}-merged`, [canonicalId, ...duplicateIds], options.now, reason, evidence);
          const stored: StoredMerge = { id: mergeId, tenantId: decision.tenantId, branchId, entityType, canonicalId, duplicateIds, status: "APPLIED", reason, evidence: [...evidence], resourceVersion: 1, auditReference, beforeCanonical, beforeDuplicates };
          merges.set(mergeId, stored);
          const response: ApiBody = { merge: publicMerge(stored), resourceVersion: canonical.resourceVersion, auditReference };
          if (entityType === "CUSTOMER") response.customer = clone(canonical as Customer); else response.vehicle = clone(canonical as Vehicle);
          return { status: 201, body: response };
        });
      }
      const compensationMatch = path.match(/^\/api\/v1\/identity\/merges\/([^/]+)\/compensations$/);
      if (compensationMatch) {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "identity.merge.compensate");
        if ("status" in decision) return decision;
        const merge = merges.get(compensationMatch[1]);
        if (!merge || merge.tenantId !== decision.tenantId || merge.branchId !== branchId) return { status: 404, body: { code: "NOT_FOUND" } };
        if (merge.status !== "APPLIED") return { status: 409, body: { code: "MERGE_ALREADY_COMPENSATED" } };
        if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
        if (options.ifMatch !== merge.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: merge.resourceVersion } };
        if (!recentlyAuthenticated(decision, options.now, input.recentAuthenticationMinutes ?? 15)) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
        const reason = String(body.reason ?? "").trim();
        const evidence = Array.isArray(body.evidence) && body.evidence.every((item) => typeof item === "string" && item.trim()) ? body.evidence as string[] : [];
        if (!reason || evidence.length === 0) return { status: 422, body: { code: "COMPENSATION_EVIDENCE_REQUIRED" } };
        return execute(decision, options.idempotencyKey, { path, body, ifMatch: options.ifMatch }, () => {
          const collection = merge.entityType === "CUSTOMER" ? customers : vehicles;
          const currentCanonical = collection.get(merge.canonicalId)!;
          const restoredCanonical = { ...clone(merge.beforeCanonical), resourceVersion: currentCanonical.resourceVersion + 1 } as Customer & Vehicle;
          collection.set(merge.canonicalId, restoredCanonical);
          merge.beforeDuplicates.forEach((snapshot) => {
            const current = collection.get(snapshot.id)!;
            collection.set(snapshot.id, { ...clone(snapshot), resourceVersion: current.resourceVersion + 1 } as Customer & Vehicle);
          });
          merge.status = "COMPENSATED";
          merge.resourceVersion += 1;
          merge.compensationAuditReference = audit(decision, branchId, "identity.merge-compensated", [merge.id, merge.canonicalId, ...merge.duplicateIds], options.now, reason, evidence);
          const response: ApiBody = { merge: publicMerge(merge), resourceVersion: restoredCanonical.resourceVersion, auditReference: merge.compensationAuditReference };
          if (merge.entityType === "CUSTOMER") response.customer = clone(restoredCanonical); else response.vehicle = clone(restoredCanonical);
          return { status: 201, body: response };
        });
      }
      if (path === "/api/v1/vehicles") {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "vehicle.manage");
        if ("status" in decision) return decision;
        const registration = String(body.registration ?? "").trim();
        const vin = String(body.vin ?? "").trim().toUpperCase();
        const ownerCustomerId = String(body.ownerCustomerId ?? "");
        const effectiveFrom = String(body.ownershipEffectiveFrom ?? "");
        if (!registration && !vin) return { status: 422, body: { code: "VEHICLE_IDENTITY_REQUIRED" } };
        if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return { status: 422, body: { code: "INVALID_VIN" } };
        const owner = customers.get(ownerCustomerId);
        if (!owner || owner.tenantId !== decision.tenantId || owner.branchId !== branchId || owner.status !== "ACTIVE") return { status: 422, body: { code: "OWNER_NOT_FOUND" } };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)) return { status: 422, body: { code: "OWNERSHIP_DATE_REQUIRED" } };
        const attributes = body.attributes && typeof body.attributes === "object" && !Array.isArray(body.attributes) ? clone(body.attributes as Record<string, unknown>) : {};
        return execute(decision, options.idempotencyKey, { path, body }, () => {
          const id = `vehicle-${++vehicleSequence}`;
          const auditReference = audit(decision, branchId, "vehicle.created", [id], options.now);
          const vehicle: Vehicle = { id, tenantId: decision.tenantId, branchId, registration, vin, attributes, ownershipHistory: [{ id: `ownership-${id}-1`, customerId: ownerCustomerId, effectiveFrom, recordedAt: options.now ?? new Date().toISOString(), auditReference }], odometerHistory: [], serviceHistory: [], aliases: [], status: "ACTIVE", resourceVersion: 1 };
          const duplicateMatches = vehicleMatches(decision, branchId, vehicle);
          vehicles.set(id, vehicle);
          return { status: 201, body: { vehicle: clone(vehicle), duplicateMatches, resourceVersion: 1, auditReference } };
        });
      }
      const odometerMatch = path.match(/^\/api\/v1\/vehicles\/([^/]+)\/odometer-readings$/);
      if (odometerMatch) {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "vehicle.manage");
        if ("status" in decision) return decision;
        const vehicle = vehicles.get(odometerMatch[1]);
        if (!vehicle || vehicle.tenantId !== decision.tenantId || vehicle.branchId !== branchId) return { status: 404, body: { code: "NOT_FOUND" } };
        const readingKm = Number(body.readingKm);
        const recordedAt = String(body.recordedAt ?? "");
        if (!Number.isSafeInteger(readingKm) || readingKm < 0 || !Number.isFinite(Date.parse(recordedAt))) return { status: 422, body: { code: "INVALID_ODOMETER_READING" } };
        const last = [...vehicle.odometerHistory].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)).at(-1);
        if (last && recordedAt >= last.recordedAt && readingKm < last.readingKm && !body.correctionOfId) return { status: 409, body: { code: "ODOMETER_ROLLBACK_REQUIRES_CORRECTION" } };
        return execute(decision, options.idempotencyKey, { path, body }, () => {
          const auditReference = audit(decision, branchId, "vehicle.odometer-recorded", [vehicle.id], options.now, body.reason ? String(body.reason) : undefined);
          vehicle.odometerHistory.push({ id: `odometer-${vehicle.id}-${vehicle.odometerHistory.length + 1}`, readingKm, recordedAt, source: String(body.source ?? "MANUAL"), ...(body.correctionOfId ? { correctionOfId: String(body.correctionOfId) } : {}), ...(body.reason ? { reason: String(body.reason) } : {}), auditReference });
          vehicle.resourceVersion += 1;
          return { status: 201, body: { vehicle: clone(vehicle), resourceVersion: vehicle.resourceVersion, auditReference } };
        });
      }
      const ownershipMatch = path.match(/^\/api\/v1\/vehicles\/([^/]+)\/ownerships$/);
      if (ownershipMatch) {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "vehicle.manage");
        if ("status" in decision) return decision;
        const vehicle = vehicles.get(ownershipMatch[1]);
        if (!vehicle || vehicle.tenantId !== decision.tenantId || vehicle.branchId !== branchId || vehicle.status !== "ACTIVE") return { status: 404, body: { code: "NOT_FOUND" } };
        if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
        if (options.ifMatch !== vehicle.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: vehicle.resourceVersion } };
        const customerId = String(body.customerId ?? "");
        const nextOwner = customers.get(customerId);
        const effectiveFrom = String(body.effectiveFrom ?? "");
        const reason = String(body.reason ?? "").trim();
        const evidence = Array.isArray(body.evidence) && body.evidence.every((item) => typeof item === "string" && item.trim()) ? body.evidence as string[] : [];
        if (!nextOwner || nextOwner.tenantId !== decision.tenantId || nextOwner.branchId !== branchId || nextOwner.status !== "ACTIVE") return { status: 422, body: { code: "OWNER_NOT_FOUND" } };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom) || !reason || evidence.length === 0) return { status: 422, body: { code: "OWNERSHIP_EVIDENCE_REQUIRED" } };
        const current = [...vehicle.ownershipHistory].sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom)).at(-1);
        if (!current || effectiveFrom <= current.effectiveFrom) return { status: 409, body: { code: "OWNERSHIP_PERIOD_CONFLICT" } };
        return execute(decision, options.idempotencyKey, { path, body, ifMatch: options.ifMatch }, () => {
          const auditReference = audit(decision, branchId, "vehicle.ownership-transferred", [vehicle.id, current.customerId, customerId], options.now, reason, evidence);
          current.effectiveTo = effectiveFrom;
          vehicle.ownershipHistory.push({ id: `ownership-${vehicle.id}-${vehicle.ownershipHistory.length + 1}`, customerId, effectiveFrom, recordedAt: options.now ?? new Date().toISOString(), auditReference });
          vehicle.resourceVersion += 1;
          return { status: 201, body: { vehicle: clone(vehicle), resourceVersion: vehicle.resourceVersion, auditReference } };
        });
      }
      const serviceMatch = path.match(/^\/api\/v1\/vehicles\/([^/]+)\/service-history$/);
      if (serviceMatch) {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "vehicle.manage");
        if ("status" in decision) return decision;
        const vehicle = vehicles.get(serviceMatch[1]);
        if (!vehicle || vehicle.tenantId !== decision.tenantId || vehicle.branchId !== branchId) return { status: 404, body: { code: "NOT_FOUND" } };
        const servicedAt = String(body.servicedAt ?? "");
        const payerCustomerId = String(body.payerCustomerId ?? "");
        const owner = ownerAt(vehicle, servicedAt);
        const payer = customers.get(payerCustomerId);
        if (!owner || !payer || payer.tenantId !== decision.tenantId || payer.branchId !== branchId) return { status: 422, body: { code: "OWNER_OR_PAYER_NOT_FOUND" } };
        return execute(decision, options.idempotencyKey, { path, body }, () => {
          const auditReference = audit(decision, branchId, "vehicle.service-recorded", [vehicle.id, String(body.jobId ?? "")], options.now);
          vehicle.serviceHistory.push({ id: `service-${vehicle.id}-${vehicle.serviceHistory.length + 1}`, jobId: String(body.jobId ?? ""), servicedAt, odometerKm: Number(body.odometerKm), summary: String(body.summary ?? ""), ownerCustomerId: owner.customerId, payerCustomerId, auditReference });
          vehicle.resourceVersion += 1;
          return { status: 201, body: { vehicle: clone(vehicle), resourceVersion: vehicle.resourceVersion, auditReference } };
        });
      }
      if (path !== "/api/v1/customers") return { status: 404, body: { code: "NOT_FOUND" } };
      const branchId = String(body.branchId ?? "");
      const decision = authorize(this.token, branchId, "customer.manage");
      if ("status" in decision) return decision;
      const validated = validateCustomerInput(body);
      if (typeof validated === "string") return { status: 422, body: { code: validated } };
      return execute(decision, options.idempotencyKey, { path, body }, () => {
          const id = `customer-${++customerSequence}`;
          const customer: Customer = { id, tenantId: decision.tenantId, branchId, ...validated, payerRelations: validated.payerRelations.map((relation) => relation.payerCustomerId === "self" ? { ...relation, payerCustomerId: id } : relation), aliases: [], status: "ACTIVE", resourceVersion: 1 };
        const duplicateMatches = customerMatches(decision, branchId, customer);
        customers.set(customer.id, customer);
        const auditReference = audit(decision, branchId, "customer.created", [customer.id], options.now);
        return { status: 201, body: { customer: clone(customer), duplicateMatches, resourceVersion: 1, auditReference } };
      });
    }

    async patch(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const customerMatch = path.match(/^\/api\/v1\/customers\/([^/]+)$/);
      if (customerMatch) {
        const branchId = String(body.branchId ?? "");
        const decision = authorize(this.token, branchId, "customer.manage");
        if ("status" in decision) return decision;
        const customer = customers.get(customerMatch[1]);
        if (!customer || customer.tenantId !== decision.tenantId || customer.branchId !== branchId || customer.status !== "ACTIVE") return { status: 404, body: { code: "NOT_FOUND" } };
        if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
        if (options.ifMatch !== customer.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: customer.resourceVersion } };
        const validated = validateCustomerInput({ displayName: body.displayName ?? customer.displayName, contacts: body.contacts ?? customer.contacts, payerRelations: body.payerRelations ?? customer.payerRelations });
        if (typeof validated === "string") return { status: 422, body: { code: validated } };
        customer.displayName = validated.displayName;
        customer.contacts = clone(validated.contacts);
        customer.payerRelations = clone(validated.payerRelations.map((relation) => relation.payerCustomerId === "self" ? { ...relation, payerCustomerId: customer.id } : relation));
        customer.resourceVersion += 1;
        const auditReference = audit(decision, branchId, "customer.updated", [customer.id]);
        return { status: 200, body: { customer: clone(customer), duplicateMatches: customerMatches(decision, branchId, customer, customer.id), resourceVersion: customer.resourceVersion, auditReference } };
      }
      const vehicleMatch = path.match(/^\/api\/v1\/vehicles\/([^/]+)$/);
      if (!vehicleMatch) return { status: 404, body: { code: "NOT_FOUND" } };
      const branchId = String(body.branchId ?? "");
      const decision = authorize(this.token, branchId, "vehicle.manage");
      if ("status" in decision) return decision;
      const vehicle = vehicles.get(vehicleMatch[1]);
      if (!vehicle || vehicle.tenantId !== decision.tenantId || vehicle.branchId !== branchId) return { status: 404, body: { code: "NOT_FOUND" } };
      if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
      if (options.ifMatch !== vehicle.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: vehicle.resourceVersion } };
      const before = clone(vehicle);
      if (body.registration !== undefined) vehicle.registration = String(body.registration).trim();
      if (body.vin !== undefined) vehicle.vin = String(body.vin).trim().toUpperCase();
      if (body.attributes && typeof body.attributes === "object" && !Array.isArray(body.attributes)) vehicle.attributes = { ...vehicle.attributes, ...clone(body.attributes as Record<string, unknown>) };
      vehicle.resourceVersion += 1;
      const duplicateMatches = vehicleMatches(decision, branchId, vehicle, vehicle.id);
      const auditReference = audit(decision, branchId, "vehicle.updated", [vehicle.id]);
      if ((!vehicle.registration && !vehicle.vin) || (vehicle.vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(vehicle.vin))) {
        vehicles.set(vehicle.id, before);
        audits.pop();
        return { status: 422, body: { code: "INVALID_VEHICLE_IDENTITY" } };
      }
      return { status: 200, body: { vehicle: clone(vehicle), duplicateMatches, resourceVersion: vehicle.resourceVersion, auditReference } };
    }

    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "http://local");
      const vehicleOne = url.pathname.match(/^\/api\/v1\/vehicles\/([^/]+)$/);
      if (vehicleOne) {
        const branchId = url.searchParams.get("branchId") ?? "";
        const decision = authorize(this.token, branchId, "vehicle.manage");
        if ("status" in decision) return decision;
        const vehicle = vehicles.get(vehicleOne[1]);
        return vehicle && vehicle.tenantId === decision.tenantId && vehicle.branchId === branchId ? { status: 200, body: { vehicle: clone(vehicle), resourceVersion: vehicle.resourceVersion } } : { status: 404, body: { code: "NOT_FOUND" } };
      }
      if (url.pathname === "/api/v1/vehicles") {
        const branchId = url.searchParams.get("branchId") ?? "";
        const decision = authorize(this.token, branchId, "vehicle.manage");
        if ("status" in decision) return decision;
        const query = url.searchParams.get("query") ?? "";
        const normalizedQuery = normalizeText(query);
        const items = visibleVehicles(decision, branchId).filter((vehicle) => !normalizedQuery || normalizeText(vehicle.registration).includes(normalizedQuery) || normalizeText(vehicle.vin).includes(normalizedQuery) || normalizeText(`${vehicle.attributes.make ?? ""}${vehicle.attributes.model ?? ""}`).includes(normalizedQuery));
        return { status: 200, body: { vehicles: clone(items), duplicateMatches: query ? vehicleMatches(decision, branchId, { registration: query, vin: query.length === 17 ? query : "", attributes: {} }) : [] } };
      }
      if (url.pathname === "/api/v1/identity/audit") {
        const branchId = url.searchParams.get("branchId") ?? "";
        const decision = authorize(this.token, branchId, "identity.merge");
        if ("status" in decision) return decision;
        return { status: 200, body: { auditEntries: clone(audits.filter((entry) => entry.tenantId === decision.tenantId && entry.branchId === branchId)) } };
      }
      if (url.pathname !== "/api/v1/customers") return { status: 404, body: { code: "NOT_FOUND" } };
      const branchId = url.searchParams.get("branchId") ?? "";
      const decision = authorize(this.token, branchId, "customer.manage");
      if ("status" in decision) return decision;
      const query = url.searchParams.get("query") ?? "";
      const normalizedQuery = normalizeText(query);
      const items = visibleCustomers(decision, branchId).filter((customer) => !normalizedQuery || normalizeText(customer.displayName).includes(normalizedQuery) || customer.contacts.some((contact) => normalizeContact(contact.type, contact.value).includes(normalizeContact(contact.type, query))));
      const searchContacts = (["MOBILE", "PHONE", "EMAIL", "WHATSAPP", "ADDRESS"] as ContactType[]).map((type) => ({ id: "search", name: "search", type, value: query, consent: "UNKNOWN" as Consent, preferred: true }));
      return { status: 200, body: { customers: clone(items), duplicateMatches: query ? customerMatches(decision, branchId, { displayName: query, contacts: searchContacts }) : [] } };
    }
  }

  return { signIn: (token: string) => new Session(token) };
}

function publicMerge(merge: StoredMerge): MergeRecord {
  const { beforeCanonical: _beforeCanonical, beforeDuplicates: _beforeDuplicates, ...visible } = merge;
  return clone(visible);
}

function recentlyAuthenticated(membership: CustomerVehicleMembership, now: string | undefined, minutes: number): boolean {
  if (!membership.authenticatedAt || !now) return false;
  return Date.parse(now) - Date.parse(membership.authenticatedAt) <= minutes * 60_000 && Date.parse(now) >= Date.parse(membership.authenticatedAt);
}

function ownerAt(vehicle: Vehicle, at: string): Ownership | undefined {
  return vehicle.ownershipHistory.find((ownership) => ownership.effectiveFrom <= at.slice(0, 10) && (!ownership.effectiveTo || ownership.effectiveTo > at.slice(0, 10)));
}
