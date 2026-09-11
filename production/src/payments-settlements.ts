import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type PaymentsMembership = { identityId: string; membershipId: string; tenantId: string; branchIds: string[]; permissions: string[]; recentReauthenticatedAt?: string };
type ApiResponse = { status: number; body: Record<string, any> };
type Options = { idempotencyKey?: string; ifMatch?: number; now?: string; rawBody?: string; signature?: string };
type Invoice = { tenantId: string; branchId: string; invoiceId: string; customerId: string; visitId: string; jobId: string; payerId: string; currency: string; payableMinor: string };
type Event = Record<string, any> & { id: string; tenantId: string; branchId: string; kind: string; amountMinor: string; currency: string; externalReference: string; resourceVersion: number };

const exactPositiveMinor = (value: unknown) => typeof value === "string" && /^[1-9][0-9]*$/.test(value);
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const cashfreeTestSignature = (secret: string, rawBody: string) => createHmac("sha256", secret).update(rawBody).digest("hex");

export function createLocalPaymentsApi(input: { memberships: Record<string, PaymentsMembership>; invoices: Invoice[]; cashfreeWebhookSecret: string }) {
  const financialEvents: Event[] = [];
  const paymentLinks: Array<Record<string, any>> = [];
  const webhookEvidence: Array<Record<string, any>> = [];
  const creditPolicies: Array<Record<string, any>> = [];
  const creditExceptions: Array<Record<string, any>> = [];
  const paymentCorrections: Array<Record<string, any>> = [];
  const settlements: Array<Record<string, any>> = [];
  const receipts = new Map<string, { fingerprint: string; response: ApiResponse }>();

  const authorize = (token: string, branchId: string, permission: string): PaymentsMembership | ApiResponse => {
    const membership = input.memberships[token];
    return membership && membership.branchIds.includes(branchId) && membership.permissions.includes(permission)
      ? membership : { status: 403, body: { code: "FORBIDDEN" } };
  };
  const command = (auth: PaymentsMembership, path: string, body: Record<string, any>, options: Options) => {
    if (!options.idempotencyKey) return { error: { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } } as ApiResponse };
    const key = `${auth.tenantId}:${options.idempotencyKey}`;
    const fingerprint = digest(JSON.stringify({ path, body, ifMatch: options.ifMatch, rawBodySha256: options.rawBody ? digest(options.rawBody) : undefined, signature: options.signature }));
    const prior = receipts.get(key);
    if (prior) return prior.fingerprint === fingerprint ? { replay: structuredClone(prior.response) } : { error: { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } } as ApiResponse };
    return { key, fingerprint };
  };
  const commit = (context: { key?: string; fingerprint?: string }, response: ApiResponse) => {
    receipts.set(context.key!, { fingerprint: context.fingerprint!, response: structuredClone(response) }); return response;
  };

  return {
    signIn(token: string) {
      return {
        async get(_path: string): Promise<ApiResponse> { return { status: 404, body: { code: "NOT_FOUND" } }; },
        async post(path: string, body: Record<string, any>, options: Options = {}): Promise<ApiResponse> {
          if (path === "/api/v1/payment-settlements") {
            const auth = authorize(token, body.branchId, "settlement.reconcile"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const types = ["PAYMENT", "FEE", "TAX", "REFUND", "CHARGEBACK", "BANK_CREDIT"];
            if (body.currency !== "INR" || typeof body.provider !== "string" || typeof body.settlementReference !== "string" || !body.settlementReference.trim() || !Array.isArray(body.entries) || !body.entries.length || body.entries.some((entry: any) => typeof entry.providerEntryId !== "string" || !types.includes(entry.type) || !exactPositiveMinor(entry.amountMinor))) return { status: 422, body: { code: "INVALID_SETTLEMENT" } };
            if (settlements.some((candidate) => candidate.tenantId === auth.tenantId && candidate.provider === body.provider && candidate.settlementReference === body.settlementReference)) return { status: 409, body: { code: "SETTLEMENT_ALREADY_RECONCILED" } };
            const sum = (type: string) => body.entries.filter((entry: any) => entry.type === type).reduce((total: bigint, entry: any) => total + BigInt(entry.amountMinor), 0n);
            const gross = sum("PAYMENT"), fees = sum("FEE"), tax = sum("TAX"), refunds = sum("REFUND"), chargebacks = sum("CHARGEBACK"), bank = sum("BANK_CREDIT");
            const expectedNet = gross - fees - tax - refunds - chargebacks; const issues: Array<Record<string, any>> = [];
            const seen = new Set<string>();
            for (const entry of body.entries) {
              if (seen.has(entry.providerEntryId)) issues.push({ kind: "DUPLICATE_ENTRY", providerEntryId: entry.providerEntryId }); else seen.add(entry.providerEntryId);
              if (["PAYMENT", "REFUND", "CHARGEBACK"].includes(entry.type)) {
                const expectedKind = entry.type === "PAYMENT" ? "PAYMENT_RECEIPT" : entry.type;
                if (!financialEvents.some((event) => event.tenantId === auth.tenantId && event.externalReference === entry.financialReference && event.kind === expectedKind && event.amountMinor === entry.amountMinor)) issues.push({ kind: "UNMATCHED_ENTRY", providerEntryId: entry.providerEntryId, financialReference: entry.financialReference });
              }
            }
            if (expectedNet !== bank) issues.push({ kind: "NET_BANK_MISMATCH", expectedNetMinor: expectedNet.toString(), bankNetMinor: bank.toString() });
            const reconciliation = { id: `settlement-${settlements.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, provider: body.provider, settlementReference: body.settlementReference.trim(), currency: body.currency, status: issues.length ? "UNRESOLVED" : "MATCHED", totals: { grossMinor: gross.toString(), feesMinor: fees.toString(), taxMinor: tax.toString(), refundsMinor: refunds.toString(), chargebacksMinor: chargebacks.toString(), expectedNetMinor: expectedNet.toString(), bankNetMinor: bank.toString() }, issues, entries: structuredClone(body.entries), reconciledAt: options.now ?? new Date().toISOString(), resourceVersion: 1 };
            settlements.push(reconciliation);
            return commit(context, { status: 201, body: { reconciliation: structuredClone(reconciliation), resourceVersion: 1, auditReference: `audit-${reconciliation.id}` } });
          }
          const approveCorrection = path.match(/^\/api\/v1\/payment-corrections\/([^/]+)\/approve$/);
          if (approveCorrection) {
            const auth = authorize(token, body.branchId, "payment.correct.approve"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const correction = paymentCorrections.find((candidate) => candidate.id === approveCorrection[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!correction) return { status: 404, body: { code: "PAYMENT_CORRECTION_NOT_FOUND" } };
            if (options.ifMatch !== correction.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: correction.resourceVersion } };
            if (correction.makerMembershipId === auth.membershipId) return { status: 409, body: { code: "MAKER_CHECKER_SEPARATION_REQUIRED" } };
            const at = options.now ?? new Date().toISOString(); const age = auth.recentReauthenticatedAt ? new Date(at).getTime() - new Date(auth.recentReauthenticatedAt).getTime() : Infinity;
            if (age < 0 || age > 10 * 60 * 1000) return { status: 401, body: { code: "RECENT_REAUTHENTICATION_REQUIRED" } };
            const original = financialEvents.find((candidate) => candidate.id === correction.originalFinancialEventId)!;
            correction.status = "APPROVED"; correction.checkerMembershipId = auth.membershipId; correction.resourceVersion += 1;
            const compensatingEvent: Event = { id: `finance-event-${financialEvents.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, kind: correction.type, originalFinancialEventId: original.id, invoiceId: original.invoiceId, customerId: original.customerId, visitId: original.visitId, jobId: original.jobId, payerId: original.payerId, amountMinor: correction.amountMinor, currency: original.currency, externalReference: `correction:${correction.id}`, reason: correction.reason, evidenceRef: correction.evidenceRef, occurredAt: at, resourceVersion: 1 };
            financialEvents.push(compensatingEvent);
            return commit(context, { status: 200, body: { correction: structuredClone(correction), compensatingEvent: structuredClone(compensatingEvent), resourceVersion: correction.resourceVersion, auditReference: `audit-correction-approve-${correction.id}` } });
          }
          const correctionRequest = path.match(/^\/api\/v1\/financial-events\/([^/]+)\/corrections$/);
          if (correctionRequest) {
            const auth = authorize(token, body.branchId, "payment.correct.request"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const original = financialEvents.find((candidate) => candidate.id === correctionRequest[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            const types = ["ADVANCE_REVERSAL", "PAYMENT_REVERSAL", "REFUND", "DISPUTE", "CHARGEBACK"];
            if (!original || !types.includes(body.type) || !exactPositiveMinor(body.amountMinor) || BigInt(body.amountMinor) > BigInt(original.amountMinor) || typeof body.reason !== "string" || !body.reason.trim() || typeof body.evidenceRef !== "string" || !body.evidenceRef.startsWith(`private/${auth.tenantId}/payments/`)) return { status: 422, body: { code: "INVALID_PAYMENT_CORRECTION" } };
            const corrected = paymentCorrections.filter((candidate) => candidate.originalFinancialEventId === original.id && candidate.status === "APPROVED").reduce((sum, candidate) => sum + BigInt(candidate.amountMinor), 0n);
            if (corrected + BigInt(body.amountMinor) > BigInt(original.amountMinor)) return { status: 422, body: { code: "CORRECTION_EXCEEDS_ORIGINAL" } };
            const correction = { id: `payment-correction-${paymentCorrections.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, originalFinancialEventId: original.id, type: body.type, amountMinor: body.amountMinor, reason: body.reason.trim(), evidenceRef: body.evidenceRef, status: "APPROVAL_PENDING", makerMembershipId: auth.membershipId, resourceVersion: 1 };
            paymentCorrections.push(correction);
            return commit(context, { status: 201, body: { correction: structuredClone(correction), resourceVersion: 1, auditReference: `audit-correction-request-${correction.id}` } });
          }
          const approveCredit = path.match(/^\/api\/v1\/credit-exceptions\/([^/]+)\/approve$/);
          if (approveCredit) {
            const auth = authorize(token, body.branchId, "credit.exception.approve"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const exception = creditExceptions.find((candidate) => candidate.id === approveCredit[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!exception) return { status: 404, body: { code: "CREDIT_EXCEPTION_NOT_FOUND" } };
            if (options.ifMatch !== exception.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: exception.resourceVersion } };
            if (exception.makerMembershipId === auth.membershipId) return { status: 409, body: { code: "MAKER_CHECKER_SEPARATION_REQUIRED" } };
            const at = options.now ?? new Date().toISOString(); const age = auth.recentReauthenticatedAt ? new Date(at).getTime() - new Date(auth.recentReauthenticatedAt).getTime() : Infinity;
            if (age < 0 || age > 10 * 60 * 1000) return { status: 401, body: { code: "RECENT_REAUTHENTICATION_REQUIRED" } };
            const policy = creditPolicies.find((candidate) => candidate.tenantId === auth.tenantId && candidate.customerId === exception.customerId)!;
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.invoiceId === exception.invoiceId)!;
            exception.status = "APPROVED"; exception.checkerMembershipId = auth.membershipId; exception.resourceVersion += 1;
            policy.approvedExceptionMinor = (BigInt(policy.approvedExceptionMinor) + BigInt(exception.amountMinor)).toString(); policy.resourceVersion += 1;
            const available = BigInt(policy.limitMinor) - BigInt(policy.outstandingExposureMinor) + BigInt(policy.approvedExceptionMinor);
            policy.deliveryEligible = available >= BigInt(invoice.payableMinor);
            return commit(context, { status: 200, body: { exception: structuredClone(exception), credit: structuredClone(policy), resourceVersion: exception.resourceVersion, auditReference: `audit-credit-approve-${exception.id}` } });
          }
          const creditException = path.match(/^\/api\/v1\/invoices\/([^/]+)\/credit-exceptions$/);
          if (creditException) {
            const auth = authorize(token, body.branchId, "credit.manage"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.invoiceId === creditException[1]);
            const policy = creditPolicies.find((candidate) => candidate.tenantId === auth.tenantId && candidate.customerId === invoice?.customerId);
            if (!invoice || !policy || !exactPositiveMinor(body.amountMinor) || typeof body.reason !== "string" || !body.reason.trim()) return { status: 422, body: { code: "INVALID_CREDIT_EXCEPTION" } };
            const exception = { id: `credit-exception-${creditExceptions.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, invoiceId: invoice.invoiceId, customerId: invoice.customerId, amountMinor: body.amountMinor, reason: body.reason.trim(), status: "APPROVAL_PENDING", makerMembershipId: auth.membershipId, resourceVersion: 1 };
            creditExceptions.push(exception);
            return commit(context, { status: 201, body: { exception: structuredClone(exception), resourceVersion: 1, auditReference: `audit-credit-request-${exception.id}` } });
          }
          const customerCredit = path.match(/^\/api\/v1\/customers\/([^/]+)\/credit$/);
          if (customerCredit) {
            const auth = authorize(token, body.branchId, "credit.manage"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            if (!exactPositiveMinor(body.limitMinor) || !/^(0|[1-9][0-9]*)$/.test(body.outstandingExposureMinor) || BigInt(body.outstandingExposureMinor) > BigInt(body.limitMinor) || body.currency !== "INR" || !Number.isInteger(body.termsDays) || body.termsDays < 0 || typeof body.approvedByMembershipId !== "string") return { status: 422, body: { code: "INVALID_CREDIT_POLICY" } };
            if (creditPolicies.some((candidate) => candidate.tenantId === auth.tenantId && candidate.customerId === customerCredit[1])) return { status: 409, body: { code: "CREDIT_POLICY_ALREADY_EXISTS" } };
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.customerId === customerCredit[1]);
            const available = BigInt(body.limitMinor) - BigInt(body.outstandingExposureMinor);
            const credit = { id: `credit-policy-${creditPolicies.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, customerId: customerCredit[1], limitMinor: body.limitMinor, outstandingExposureMinor: body.outstandingExposureMinor, approvedExceptionMinor: "0", currency: body.currency, termsDays: body.termsDays, approvedByMembershipId: body.approvedByMembershipId, deliveryEligible: !!invoice && available >= BigInt(invoice.payableMinor), resourceVersion: 1 };
            creditPolicies.push(credit);
            return commit(context, { status: 201, body: { credit: structuredClone(credit), resourceVersion: 1, auditReference: `audit-${credit.id}` } });
          }
          if (path === "/api/v1/cashfree/webhooks") {
            const auth = authorize(token, body.branchId, "payment.webhook"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            if (!options.rawBody || !options.signature) return { status: 400, body: { code: "RAW_SIGNED_BODY_REQUIRED" } };
            const expected = cashfreeTestSignature(input.cashfreeWebhookSecret, options.rawBody);
            const supplied = Buffer.from(options.signature); const calculated = Buffer.from(expected);
            if (supplied.length !== calculated.length || !timingSafeEqual(supplied, calculated)) return { status: 401, body: { code: "INVALID_WEBHOOK_SIGNATURE" } };
            let event: Record<string, any>; try { event = JSON.parse(options.rawBody); } catch { return { status: 422, body: { code: "INVALID_WEBHOOK_BODY" } }; }
            if (webhookEvidence.some((candidate) => candidate.tenantId === auth.tenantId && candidate.eventId === event.eventId)) return { status: 409, body: { code: "WEBHOOK_EVENT_ALREADY_PROCESSED" } };
            const link = paymentLinks.find((candidate) => candidate.id === event.linkId && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!link || event.status !== "SUCCESS" || event.amountMinor !== link.amountMinor || event.currency !== link.currency || !event.providerPaymentId) return { status: 422, body: { code: "WEBHOOK_PAYMENT_NOT_AUTHORITATIVE" } };
            if (financialEvents.some((candidate) => candidate.tenantId === auth.tenantId && candidate.externalReference === event.providerPaymentId)) return { status: 409, body: { code: "PAYMENT_REFERENCE_ALREADY_USED" } };
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.invoiceId === link.invoiceId)!;
            const paid = financialEvents.filter((candidate) => candidate.tenantId === auth.tenantId && candidate.invoiceId === link.invoiceId && candidate.kind === "PAYMENT_RECEIPT").reduce((sum, candidate) => sum + BigInt(candidate.amountMinor), 0n);
            if (paid + BigInt(event.amountMinor) > BigInt(invoice.payableMinor)) return { status: 422, body: { code: "PAYMENT_EXCEEDS_OUTSTANDING", outstandingMinor: (BigInt(invoice.payableMinor) - paid).toString() } };
            const payment: Event = { id: `finance-event-${financialEvents.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, kind: "PAYMENT_RECEIPT", invoiceId: link.invoiceId, customerId: link.customerId, visitId: link.visitId, jobId: link.jobId, payerId: link.payerId, amountMinor: event.amountMinor, currency: event.currency, mode: "CASHFREE", externalReference: event.providerPaymentId, evidenceRef: `cashfree-webhook:${event.eventId}`, occurredAt: event.occurredAt, resourceVersion: 1 };
            const evidence = { id: `webhook-${webhookEvidence.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, eventId: event.eventId, rawBody: options.rawBody, rawBodySha256: digest(options.rawBody), signature: options.signature, verifiedAt: options.now ?? new Date().toISOString() };
            webhookEvidence.push(evidence); financialEvents.push(payment); link.providerStatus = "PAID"; link.resourceVersion += 1;
            return commit(context, { status: 200, body: { payment: structuredClone(payment), rawBodySha256: evidence.rawBodySha256, resourceVersion: link.resourceVersion, auditReference: `audit-${evidence.id}` } });
          }
          const redirect = path.match(/^\/api\/v1\/cashfree\/payment-links\/([^/]+)\/redirects$/);
          if (redirect) {
            const auth = authorize(token, body.branchId, "payment.link"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const link = paymentLinks.find((candidate) => candidate.id === redirect[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!link) return { status: 404, body: { code: "PAYMENT_LINK_NOT_FOUND" } };
            return commit(context, { status: 202, body: { paymentPosted: false, providerStatus: link.providerStatus, message: "Redirect recorded as non-authoritative evidence only", resourceVersion: link.resourceVersion, auditReference: `audit-redirect-${link.id}` } });
          }
          if (path === "/api/v1/cashfree/payment-links") {
            const auth = authorize(token, body.branchId, "payment.link"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.invoiceId === body.invoiceId && candidate.customerId === body.customerId);
            const createdAt = options.now ?? new Date().toISOString();
            if (!invoice || invoice.currency !== body.currency || !exactPositiveMinor(body.amountMinor) || BigInt(body.amountMinor) > BigInt(invoice.payableMinor) || !(new Date(body.expiresAt).getTime() > new Date(createdAt).getTime())) return { status: 422, body: { code: "INVALID_PAYMENT_LINK_SCOPE" } };
            const link = { id: `cashfree-link-${paymentLinks.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, invoiceId: invoice.invoiceId, customerId: invoice.customerId, visitId: invoice.visitId, jobId: invoice.jobId, payerId: invoice.payerId, amountMinor: body.amountMinor, currency: body.currency, expiresAt: body.expiresAt, providerStatus: "NOT_CREATED", providerCalled: false, resourceVersion: 1, createdAt };
            paymentLinks.push(link);
            return commit(context, { status: 201, body: { link: structuredClone(link), resourceVersion: 1, auditReference: `audit-${link.id}` } });
          }
          const invoicePayment = path.match(/^\/api\/v1\/invoices\/([^/]+)\/payments$/);
          if (invoicePayment) {
            const auth = authorize(token, body.branchId, "payment.post"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.invoiceId === invoicePayment[1]);
            const allowedModes = ["CASH", "UPI", "CARD", "BANK", "CREDIT", "MANUAL"];
            if (!invoice || invoice.currency !== body.currency || !exactPositiveMinor(body.amountMinor) || !allowedModes.includes(body.mode) || typeof body.externalReference !== "string" || !body.externalReference.trim() || typeof body.evidenceRef !== "string" || !body.evidenceRef.startsWith(`private/${auth.tenantId}/payments/`)) return { status: 422, body: { code: "INVALID_PAYMENT" } };
            if (financialEvents.some((event) => event.tenantId === auth.tenantId && event.externalReference === body.externalReference)) return { status: 409, body: { code: "PAYMENT_REFERENCE_ALREADY_USED" } };
            const paid = financialEvents.filter((event) => event.tenantId === auth.tenantId && event.invoiceId === invoice.invoiceId && event.kind === "PAYMENT_RECEIPT").reduce((sum, event) => sum + BigInt(event.amountMinor), 0n);
            const amount = BigInt(body.amountMinor); const payable = BigInt(invoice.payableMinor);
            if (paid + amount > payable) return { status: 422, body: { code: "PAYMENT_EXCEEDS_OUTSTANDING", outstandingMinor: (payable - paid).toString() } };
            const event: Event = { id: `finance-event-${financialEvents.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, kind: "PAYMENT_RECEIPT", invoiceId: invoice.invoiceId, customerId: invoice.customerId, visitId: invoice.visitId, jobId: invoice.jobId, payerId: invoice.payerId, amountMinor: body.amountMinor, currency: body.currency, mode: body.mode, externalReference: body.externalReference.trim(), evidenceRef: body.evidenceRef, occurredAt: options.now ?? new Date().toISOString(), resourceVersion: 1 };
            financialEvents.push(event);
            return commit(context, { status: 201, body: { payment: structuredClone(event), invoicePayment: { paidMinor: (paid + amount).toString(), outstandingMinor: (payable - paid - amount).toString() }, resourceVersion: 1, auditReference: `audit-${event.id}` } });
          }
          if (path === "/api/v1/advances") {
            const auth = authorize(token, body.branchId, "payment.post"); if ("status" in auth) return auth;
            const context = command(auth, path, body, options); if (context.error) return context.error; if (context.replay) return context.replay;
            const invoice = input.invoices.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.invoiceId === body.invoiceId && candidate.customerId === body.customerId && candidate.visitId === body.visitId && candidate.jobId === body.jobId);
            if (!invoice || invoice.currency !== body.currency || !exactPositiveMinor(body.amountMinor) || typeof body.externalReference !== "string" || !body.externalReference.trim() || typeof body.evidenceRef !== "string" || !body.evidenceRef.startsWith(`private/${auth.tenantId}/payments/`)) return { status: 422, body: { code: "INVALID_ADVANCE" } };
            if (financialEvents.some((event) => event.tenantId === auth.tenantId && event.externalReference === body.externalReference)) return { status: 409, body: { code: "PAYMENT_REFERENCE_ALREADY_USED" } };
            const advanceReceipts = financialEvents.filter((event) => event.tenantId === auth.tenantId && event.invoiceId === invoice.invoiceId && event.kind === "ADVANCE_RECEIPT");
            const allocated = advanceReceipts.reduce((sum, event) => sum + BigInt(event.amountMinor), 0n) - financialEvents.filter((event) => event.tenantId === auth.tenantId && event.invoiceId === invoice.invoiceId && event.kind === "ADVANCE_REVERSAL").reduce((sum, event) => sum + BigInt(event.amountMinor), 0n);
            if (allocated + BigInt(body.amountMinor) > BigInt(invoice.payableMinor)) return { status: 422, body: { code: "ADVANCE_EXCEEDS_ALLOCATION", allocatableMinor: (BigInt(invoice.payableMinor) - allocated).toString() } };
            const advance: Event = { id: `finance-event-${financialEvents.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, kind: "ADVANCE_RECEIPT", customerId: body.customerId, visitId: body.visitId, jobId: body.jobId, invoiceId: body.invoiceId, payerId: invoice.payerId, mode: body.mode, amountMinor: body.amountMinor, liabilityMinor: body.amountMinor, currency: body.currency, externalReference: body.externalReference.trim(), evidenceRef: body.evidenceRef, occurredAt: options.now ?? new Date().toISOString(), resourceVersion: 1 };
            financialEvents.push(advance);
            return commit(context, { status: 201, body: { advance: structuredClone(advance), resourceVersion: 1, auditReference: `audit-${advance.id}` } });
          }
          return { status: 404, body: { code: "NOT_FOUND" } };
        },
      };
    },
    inspect() { return structuredClone({ financialEvents, paymentLinks, webhookEvidence, creditPolicies, creditExceptions, paymentCorrections, settlements }); },
  };
}
