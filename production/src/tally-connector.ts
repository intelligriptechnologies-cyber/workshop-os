import { createHash } from "node:crypto";

export const SUPPORTED_TALLY_RELEASES = [
  { generation: "CURRENT", id: "TALLYPRIME_CURRENT_REPRESENTATIVE", schemaVersion: "workshopos.tally.current.v1" },
  { generation: "PRIOR_1", id: "TALLYPRIME_PRIOR_1_REPRESENTATIVE", schemaVersion: "workshopos.tally.prior1.v1" },
  { generation: "PRIOR_2", id: "TALLYPRIME_PRIOR_2_REPRESENTATIVE", schemaVersion: "workshopos.tally.prior2.v1" },
] as const;

type Membership = { identityId: string; membershipId: string; tenantId: string; branchIds: string[]; permissions: string[] };
type Configuration = { tenantId: string; invoiceAuthority: "WORKSHOPOS_NATIVE" | "TALLY_AUTHORITATIVE"; tallyCompanyId: string };
type BillingCandidate = {
  tenantId: string; branchId: string; jobId: string; payerId: string; billingSnapshotId: string; currency: string;
  amountMinor: string; taxableMinor: string; cgstMinor: string; sgstMinor: string; igstMinor: string;
  lines: Array<{ sourceLineId: string; description: string; hsnSac: string; taxableMinor: string; gstRateBps: number }>;
};
type ApiResponse = { status: number; body: Record<string, any> };
type Options = { idempotencyKey?: string; ifMatch?: number; now?: string };
type Exchange = {
  id: string; tenantId: string; branchId: string; jobId: string; payerId: string; billingSnapshotId: string;
  authority: "TALLY_AUTHORITATIVE"; releaseId: string; releaseGeneration: string; transport: "DIRECT" | "CONTROLLED_FILE";
  tallyCompanyId: string; status: "PENDING_ACK" | "RECONCILED" | "MISMATCH"; resourceVersion: number; createdAt: string;
};
type Acknowledgement = Record<string, any> & { exchangeId: string; tenantId: string; branchId: string };
type Delivery = { id: string; tenantId: string; branchId: string; exchangeId: string; effectKey: string; status: "PENDING" | "RETRY_WAIT" | "DELIVERED" | "DEAD_LETTER"; attemptCount: number; resourceVersion: number; lastError?: string; nextAttemptAt?: string; deliveredAt?: string };

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const exactMinor = (value: unknown) => typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value);

export function createLocalTallyConnectorApi(input: {
  memberships: Record<string, Membership>;
  tenantConfigurations: Configuration[];
  billingCandidates: BillingCandidate[];
  maxDeliveryAttempts?: number;
}) {
  const exchanges: Exchange[] = [];
  const acknowledgements: Acknowledgement[] = [];
  const reconciliations: Array<Record<string, any>> = [];
  const fileArtifacts: Array<Record<string, any>> = [];
  const deliveries: Delivery[] = [];
  const replayEvidence: Array<Record<string, any>> = [];
  const receipts = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const audits: Array<Record<string, any>> = [];
  const nativeInvoices: never[] = [];
  const maximumAttempts = input.maxDeliveryAttempts ?? 5;

  const authorize = (token: string, branchId: string, permission: string): Membership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership || !membership.branchIds.includes(branchId) || !membership.permissions.includes(permission)) {
      return { status: 403, body: { code: "FORBIDDEN" } };
    }
    return membership;
  };
  const releaseFor = (releaseId: unknown) => SUPPORTED_TALLY_RELEASES.find((candidate) => candidate.id === releaseId);
  const receiptContext = (auth: Membership, path: string, body: Record<string, any>, options: Options) => {
    if (!options.idempotencyKey) return { error: { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } } };
    const key = `${auth.tenantId}:${options.idempotencyKey}`;
    const fingerprint = sha256(JSON.stringify({ path, body, ifMatch: options.ifMatch }));
    const prior = receipts.get(key);
    if (prior) return prior.fingerprint === fingerprint ? { replay: structuredClone(prior.response) } : { error: { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } } };
    return { key, fingerprint };
  };
  const commit = (context: { key?: string; fingerprint?: string }, response: ApiResponse) => {
    receipts.set(context.key!, { fingerprint: context.fingerprint!, response: structuredClone(response) });
    return response;
  };
  const candidateFor = (tenantId: string, branchId: string, jobId: unknown, payerId: unknown) =>
    input.billingCandidates.find((candidate) => candidate.tenantId === tenantId && candidate.branchId === branchId && candidate.jobId === jobId && candidate.payerId === payerId);

  const reconcile = (exchange: Exchange, source: BillingCandidate, ack: Record<string, any>) => {
    const mismatches: Array<Record<string, any>> = [];
    const amountFields = ["amountMinor", "taxableMinor"] as const;
    if (amountFields.some((field) => ack[field] !== source[field])) {
      mismatches.push({ kind: "AMOUNT", expected: { amountMinor: source.amountMinor, taxableMinor: source.taxableMinor }, actual: { amountMinor: ack.amountMinor, taxableMinor: ack.taxableMinor } });
    }
    const taxFields = ["cgstMinor", "sgstMinor", "igstMinor"] as const;
    if (taxFields.some((field) => ack[field] !== source[field])) {
      mismatches.push({ kind: "TAX", expected: Object.fromEntries(taxFields.map((field) => [field, source[field]])), actual: Object.fromEntries(taxFields.map((field) => [field, ack[field]])) });
    }
    if (ack.payerId !== source.payerId) mismatches.push({ kind: "PAYER", expected: source.payerId, actual: ack.payerId });
    if (ack.postingStatus !== "POSTED") mismatches.push({ kind: "POSTING", expected: "POSTED", actual: ack.postingStatus, errorCode: ack.errorCode, errorMessage: ack.errorMessage });
    const result = { id: `tally-reconciliation-${reconciliations.length + 1}`, tenantId: exchange.tenantId, branchId: exchange.branchId,
      exchangeId: exchange.id, status: mismatches.length ? "UNRESOLVED" : "MATCHED", authority: "TALLY_AUTHORITATIVE", mismatches, reconciledAt: ack.acknowledgedAt };
    reconciliations.push(result);
    exchange.status = mismatches.length ? "MISMATCH" : "RECONCILED";
    exchange.resourceVersion += 1;
    return result;
  };

  const importAcknowledgement = (auth: Membership, exchangeId: string, body: Record<string, any>, options: Options, path: string): ApiResponse => {
    const context = receiptContext(auth, path, body, options);
    if (context.error) return context.error;
    if (context.replay) return context.replay;
    const exchange = exchanges.find((candidate) => candidate.id === exchangeId && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
    if (!exchange) return { status: 404, body: { code: "TALLY_EXCHANGE_NOT_FOUND" } };
    if (options.ifMatch !== undefined && options.ifMatch !== exchange.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: exchange.resourceVersion } };
    if (body.releaseId !== exchange.releaseId) return { status: 422, body: { code: "TALLY_RELEASE_MISMATCH" } };
    if (body.tallyCompanyId !== exchange.tallyCompanyId) return { status: 422, body: { code: "TALLY_COMPANY_MISMATCH" } };
    if (!["POSTED", "REJECTED", "PENDING"].includes(body.postingStatus) || !["amountMinor", "taxableMinor", "cgstMinor", "sgstMinor", "igstMinor"].every((field) => exactMinor(body[field])) || typeof body.payerId !== "string" || typeof body.tallyVoucherId !== "string" || !body.tallyVoucherId.trim()) {
      return { status: 422, body: { code: "INVALID_TALLY_ACKNOWLEDGEMENT" } };
    }
    const duplicate = acknowledgements.find((candidate) => candidate.tenantId === auth.tenantId && candidate.tallyCompanyId === body.tallyCompanyId && candidate.tallyVoucherId === body.tallyVoucherId);
    if (duplicate) return { status: 409, body: { code: "TALLY_VOUCHER_ALREADY_IMPORTED", exchangeId: duplicate.exchangeId } };
    if (acknowledgements.some((candidate) => candidate.exchangeId === exchange.id)) return { status: 409, body: { code: "TALLY_EXCHANGE_ALREADY_ACKNOWLEDGED" } };
    const ack: Acknowledgement = { id: `tally-ack-${acknowledgements.length + 1}`, tenantId: auth.tenantId, branchId: exchange.branchId, exchangeId: exchange.id,
      releaseId: body.releaseId, tallyCompanyId: body.tallyCompanyId, tallyVoucherId: body.tallyVoucherId, postingStatus: body.postingStatus,
      errorCode: body.errorCode, errorMessage: body.errorMessage, payerId: body.payerId, amountMinor: body.amountMinor, taxableMinor: body.taxableMinor,
      cgstMinor: body.cgstMinor, sgstMinor: body.sgstMinor, igstMinor: body.igstMinor, acknowledgedAt: body.acknowledgedAt ?? options.now ?? new Date().toISOString() };
    const source = candidateFor(auth.tenantId, exchange.branchId, exchange.jobId, exchange.payerId)!;
    acknowledgements.push(ack);
    const reconciliation = reconcile(exchange, source, ack);
    const auditReference = `audit-tally-ack-${ack.id}`;
    audits.push({ auditReference, tenantId: auth.tenantId, branchId: exchange.branchId, actorMembershipId: auth.membershipId, action: "TALLY_ACKNOWLEDGEMENT_IMPORTED", entityId: exchange.id });
    return commit(context, { status: 200, body: { exchange: structuredClone(exchange), acknowledgement: structuredClone(ack), reconciliation: structuredClone(reconciliation), resourceVersion: exchange.resourceVersion, auditReference } });
  };

  return {
    signIn(token: string) {
      return {
        async get(rawPath: string): Promise<ApiResponse> {
          const url = new URL(rawPath, "https://local.workshopos.invalid");
          const match = url.pathname.match(/^\/api\/v1\/tally\/exchanges\/([^/]+)$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          const branchId = url.searchParams.get("branchId") ?? "";
          const auth = authorize(token, branchId, "tally.read"); if ("status" in auth) return auth;
          const exchange = exchanges.find((candidate) => candidate.id === match[1] && candidate.tenantId === auth.tenantId && candidate.branchId === branchId);
          if (!exchange) return { status: 404, body: { code: "TALLY_EXCHANGE_NOT_FOUND" } };
          return { status: 200, body: { exchange: structuredClone(exchange), acknowledgement: structuredClone(acknowledgements.find((candidate) => candidate.exchangeId === exchange.id)), reconciliation: structuredClone(reconciliations.find((candidate) => candidate.exchangeId === exchange.id)) } };
        },
        async post(rawPath: string, body: Record<string, any>, options: Options = {}): Promise<ApiResponse> {
          const acknowledgementMatch = rawPath.match(/^\/api\/v1\/tally\/exchanges\/([^/]+)\/acknowledgements$/);
          if (acknowledgementMatch) {
            const auth = authorize(token, body.branchId, "tally.exchange"); if ("status" in auth) return auth;
            return importAcknowledgement(auth, acknowledgementMatch[1], body, options, rawPath);
          }
          if (rawPath === "/api/v1/tally/files/imports") {
            const auth = authorize(token, body.branchId, "tally.file"); if ("status" in auth) return auth;
            const context = receiptContext(auth, rawPath, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const release = releaseFor(body.releaseId); if (!release) return { status: 422, body: { code: "UNSUPPORTED_TALLY_RELEASE" } };
            if (!body.manifest || body.manifest.direction !== "IMPORT" || body.manifest.releaseId !== release.id || body.manifest.schemaVersion !== release.schemaVersion) return { status: 422, body: { code: "INVALID_FILE_MANIFEST" } };
            if (sha256(String(body.content)) !== body.manifest.contentSha256) return { status: 422, body: { code: "FILE_CHECKSUM_MISMATCH" } };
            let parsed: Record<string, any>; try { parsed = JSON.parse(body.content); } catch { return { status: 422, body: { code: "INVALID_FILE_CONTENT" } }; }
            if (parsed.schemaVersion !== release.schemaVersion) return { status: 422, body: { code: "FILE_SCHEMA_MISMATCH" } };
            if (body.manifest.exchangeId && body.manifest.exchangeId !== parsed.exchangeId) return { status: 422, body: { code: "FILE_MANIFEST_CONTENT_MISMATCH" } };
            // Share the outer file idempotency receipt with the atomic acknowledgement effect.
            const response = importAcknowledgement(auth, parsed.exchangeId, { ...parsed, branchId: body.branchId, releaseId: body.releaseId }, { ...options, idempotencyKey: `${options.idempotencyKey}:ack`, ifMatch: undefined }, `${rawPath}:ack`);
            if (response.status !== 200) return response;
            const artifact = { id: `tally-file-${fileArtifacts.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, exchangeId: parsed.exchangeId,
              direction: "IMPORT", releaseId: release.id, schemaVersion: release.schemaVersion, contentSha256: body.manifest.contentSha256, validatedAt: options.now ?? new Date().toISOString() };
            fileArtifacts.push(artifact);
            return commit(context, { status: 200, body: { ...response.body, fileArtifact: structuredClone(artifact) } });
          }
          const deliveryMatch = rawPath.match(/^\/api\/v1\/tally\/deliveries\/([^/]+)\/(fail|deliver|replay)$/);
          if (deliveryMatch) {
            const permission = deliveryMatch[2] === "replay" ? "tally.replay" : "tally.exchange";
            const auth = authorize(token, body.branchId, permission); if ("status" in auth) return auth;
            const context = receiptContext(auth, rawPath, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const delivery = deliveries.find((candidate) => candidate.id === deliveryMatch[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!delivery) return { status: 404, body: { code: "TALLY_DELIVERY_NOT_FOUND" } };
            if (options.ifMatch !== delivery.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: delivery.resourceVersion } };
            if (deliveryMatch[2] === "fail") {
              if (delivery.status === "DEAD_LETTER" || typeof body.error !== "string" || !body.error.trim()) return { status: 409, body: { code: "DELIVERY_FAILURE_NOT_ALLOWED" } };
              delivery.attemptCount += 1; delivery.resourceVersion += 1; delivery.lastError = body.error.trim();
              delivery.status = delivery.attemptCount >= maximumAttempts ? "DEAD_LETTER" : "RETRY_WAIT";
              if (delivery.status === "RETRY_WAIT") delivery.nextAttemptAt = new Date(new Date(options.now ?? new Date().toISOString()).getTime() + delivery.attemptCount * 60_000).toISOString();
            } else if (deliveryMatch[2] === "deliver") {
              if (!["PENDING", "RETRY_WAIT"].includes(delivery.status)) return { status: 409, body: { code: "DELIVERY_NOT_PENDING" } };
              delivery.status = "DELIVERED"; delivery.resourceVersion += 1; delivery.deliveredAt = options.now ?? new Date().toISOString(); delivery.nextAttemptAt = undefined;
            } else {
              if (delivery.status !== "DEAD_LETTER" || typeof body.reason !== "string" || !body.reason.trim()) return { status: 409, body: { code: "DELIVERY_NOT_REPLAYABLE" } };
              delivery.status = "PENDING"; delivery.resourceVersion += 1; delivery.nextAttemptAt = undefined;
              replayEvidence.push({ id: `tally-replay-${replayEvidence.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, deliveryId: delivery.id,
                effectKey: delivery.effectKey, reason: body.reason.trim(), actorMembershipId: auth.membershipId, replayedAt: options.now ?? new Date().toISOString() });
            }
            return commit(context, { status: 200, body: { delivery: structuredClone(delivery), resourceVersion: delivery.resourceVersion, auditReference: `audit-${deliveryMatch[2]}-${delivery.id}-${delivery.resourceVersion}` } });
          }
          if (rawPath === "/api/v1/tally/exchanges") {
            const auth = authorize(token, body.branchId, "tally.exchange"); if ("status" in auth) return auth;
            const context = receiptContext(auth, rawPath, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const config = input.tenantConfigurations.find((candidate) => candidate.tenantId === auth.tenantId);
            if (config?.invoiceAuthority !== "TALLY_AUTHORITATIVE") return { status: 409, body: { code: "INVOICE_AUTHORITY_NOT_TALLY", authority: config?.invoiceAuthority ?? "UNCONFIGURED" } };
            const release = releaseFor(body.releaseId); if (!release) return { status: 422, body: { code: "UNSUPPORTED_TALLY_RELEASE" } };
            if (!["DIRECT", "CONTROLLED_FILE"].includes(body.transport)) return { status: 422, body: { code: "INVALID_TALLY_TRANSPORT" } };
            const source = candidateFor(auth.tenantId, body.branchId, body.jobId, body.payerId);
            if (!source) return { status: 404, body: { code: "BILLING_CANDIDATE_NOT_FOUND" } };
            const existing = exchanges.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.jobId === body.jobId && candidate.payerId === body.payerId);
            if (existing) return { status: 409, body: { code: "TALLY_EXCHANGE_ALREADY_EXISTS", exchangeId: existing.id } };
            const createdAt = options.now ?? new Date().toISOString();
            const exchange: Exchange = { id: `tally-exchange-${exchanges.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, jobId: source.jobId,
              payerId: source.payerId, billingSnapshotId: source.billingSnapshotId, authority: "TALLY_AUTHORITATIVE", releaseId: release.id,
              releaseGeneration: release.generation, transport: body.transport, tallyCompanyId: config.tallyCompanyId, status: "PENDING_ACK", resourceVersion: 1, createdAt };
            const delivery: Delivery = { id: `tally-delivery-${deliveries.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, exchangeId: exchange.id,
              effectKey: `TALLY_EXPORT:${exchange.id}:${source.billingSnapshotId}`, status: "PENDING", attemptCount: 0, resourceVersion: 1 };
            exchanges.push(exchange); deliveries.push(delivery);
            let fileArtifact: Record<string, any> | undefined;
            if (body.transport === "CONTROLLED_FILE") {
              const content = JSON.stringify({ schemaVersion: release.schemaVersion, exchangeId: exchange.id, tallyCompanyId: config.tallyCompanyId,
                jobId: source.jobId, payerId: source.payerId, currency: source.currency, amountMinor: source.amountMinor, taxableMinor: source.taxableMinor,
                cgstMinor: source.cgstMinor, sgstMinor: source.sgstMinor, igstMinor: source.igstMinor, lines: source.lines });
              fileArtifact = { id: `tally-file-${fileArtifacts.length + 1}`, persistedExternally: false, content,
                manifest: { direction: "EXPORT", releaseId: release.id, schemaVersion: release.schemaVersion, exchangeId: exchange.id, recordCount: 1, contentSha256: sha256(content), createdAt } };
              fileArtifacts.push({ ...fileArtifact, tenantId: auth.tenantId, branchId: body.branchId, exchangeId: exchange.id });
            }
            const auditReference = `audit-tally-export-${exchange.id}`;
            audits.push({ auditReference, tenantId: auth.tenantId, branchId: body.branchId, actorMembershipId: auth.membershipId, action: "TALLY_EXCHANGE_CREATED", entityId: exchange.id });
            return commit(context, { status: 201, body: { exchange: structuredClone(exchange), delivery: structuredClone(delivery), fileArtifact: structuredClone(fileArtifact), nativeInvoiceCreated: false, resourceVersion: 1, auditReference } });
          }
          return { status: 404, body: { code: "NOT_FOUND" } };
        },
      };
    },
    inspect() { return structuredClone({ exchanges, acknowledgements, reconciliations, fileArtifacts, deliveries, replayEvidence, audits, nativeInvoices }); },
  };
}
