export type NativeInvoiceMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
  recentReauthenticatedAt?: string;
};

type InvoiceAuthority = "WORKSHOPOS_NATIVE" | "TALLY_AUTHORITATIVE";
type TenantConfiguration = {
  tenantId: string; invoiceAuthority: InvoiceAuthority; baseCurrency: string; timezone: string;
  supplierStateCode: string; gstin: string; taxSnapshotId: string; documentTemplateSnapshotId: string;
  allowCancellationReissue?: boolean;
};
type ApprovedLine = {
  id: string; description: string; hsnSac: string; supplyType: "GOOD" | "SERVICE";
  grossAmountMinor: string; discountMinor: string; gstRateBps: number; payerId: string;
};
type BillingJob = {
  tenantId: string; branchId: string; jobId: string; resourceVersion: number; customerId: string;
  expectedTaskIds: string[]; approvedLines: ApprovedLine[]; pendingSupplementaryScopeIds: string[];
};
type TaskEvent = { tenantId: string; branchId: string; jobId: string; taskId: string; type: "S16_TASK_COMPLETION_READY" };
type MaterialEvent = { tenantId: string; branchId: string; jobId: string; taskId: string; type: "S15_MATERIAL_RECONCILED"; consumers: readonly string[]; difference: string };
type QcEvent = { tenantId: string; branchId: string; jobId: string; taskId: string; type: "S16_QC_PASSED" | "S16_QC_OVERRIDDEN" };
type ApiResponse = { status: number; body: Record<string, any> };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string };

type Invoice = {
  id: string; tenantId: string; branchId: string; jobId: string; payerId: string; authority: "WORKSHOPOS_NATIVE";
  status: "DRAFT" | "FINALIZED"; currency: string; placeOfSupplyStateCode: string; taxTreatment: "INTRASTATE" | "INTERSTATE";
  taxSnapshotId: string; documentTemplateSnapshotId: string; lines: Array<ApprovedLine & { amounts: Record<string, string> }>;
  totals: Record<string, string>; resourceVersion: number; documentNumber?: string; financialYear?: string; finalizedAt?: string;
  correctionStatus?: "CANCELLED_BY_NOTE"; replacesInvoiceNumber?: string;
};
type Adjustment = {
  id: string; tenantId: string; branchId: string; invoiceId: string; linkedInvoiceNumber: string;
  type: "CREDIT_NOTE" | "DEBIT_NOTE" | "CANCEL_REISSUE"; reason: string; status: "APPROVAL_PENDING" | "FINALIZED";
  lines: Array<{ sourceLineId: string; taxableAdjustmentMinor: string; gstRateBps: number }>;
  totals: { taxableMinor: string; taxMinor: string; totalMinor: string }; makerMembershipId: string;
  resourceVersion: number; documentNumber?: string; financialYear?: string; finalizedAt?: string;
};

export function createLocalNativeInvoiceApi(input: {
  memberships: Record<string, NativeInvoiceMembership>;
  tenantConfigurations: TenantConfiguration[];
  jobs: BillingJob[];
  taskCompletionEvents?: TaskEvent[];
  materialReconciliationEvents?: MaterialEvent[];
  qcReleaseEvents?: QcEvent[];
}) {
  const configurations = structuredClone(input.tenantConfigurations);
  const jobs = structuredClone(input.jobs);
  const completions = structuredClone(input.taskCompletionEvents ?? []);
  const reconciliations = structuredClone(input.materialReconciliationEvents ?? []);
  const qcReleases = structuredClone(input.qcReleaseEvents ?? []);
  const invoices: Invoice[] = [];
  const documentSequences = new Map<string, bigint>();
  const commandReceipts = new Map<string, { fingerprint: string; response: ApiResponse }>();
  const adjustments: Adjustment[] = [];
  const outboxEvents: Array<Record<string, any>> = [];

  const authorize = (token: string, branchId: string, permission: string): NativeInvoiceMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership || !membership.branchIds.includes(branchId) || !membership.permissions.includes(permission)) {
      return { status: 403, body: { code: "FORBIDDEN" } };
    }
    return membership;
  };

  const blockersFor = (auth: NativeInvoiceMembership, branchId: string, job: BillingJob) => {
    const config = configurations.find((candidate) => candidate.tenantId === auth.tenantId);
    const incomplete = job.expectedTaskIds.filter((taskId) => !completions.some((event) => event.tenantId === auth.tenantId && event.branchId === branchId && event.jobId === job.jobId && event.taskId === taskId));
    const unreconciled = job.expectedTaskIds.filter((taskId) => !reconciliations.some((event) => event.tenantId === auth.tenantId && event.branchId === branchId && event.jobId === job.jobId && event.taskId === taskId && event.consumers.includes("S18_BILLING") && event.difference === "0"));
    const unpassed = job.expectedTaskIds.filter((taskId) => !qcReleases.some((event) => event.tenantId === auth.tenantId && event.branchId === branchId && event.jobId === job.jobId && event.taskId === taskId));
    const blockers: Record<string, unknown>[] = [];
    if (incomplete.length) blockers.push({ code: "WORK_INCOMPLETE", taskIds: incomplete });
    if (job.pendingSupplementaryScopeIds.length) blockers.push({ code: "SUPPLEMENTARY_SCOPE_PENDING", scopeIds: job.pendingSupplementaryScopeIds });
    if (unreconciled.length) blockers.push({ code: "MATERIAL_NOT_RECONCILED", taskIds: unreconciled });
    if (unpassed.length) blockers.push({ code: "INDEPENDENT_QC_NOT_RELEASED", taskIds: unpassed });
    if (config?.invoiceAuthority !== "WORKSHOPOS_NATIVE") blockers.push({ code: "INVOICE_AUTHORITY_NOT_NATIVE", authority: config?.invoiceAuthority ?? "UNCONFIGURED" });
    return { config, blockers };
  };

  const roundRate = (amount: bigint, rateBps: number, denominator = 10_000n) =>
    (amount * BigInt(rateBps) + denominator / 2n) / denominator;
  const createAmounts = (approved: ApprovedLine, intrastate: boolean) => {
    const gross = BigInt(approved.grossAmountMinor);
    const discount = BigInt(approved.discountMinor);
    const taxable = gross - discount;
    const cgst = intrastate ? roundRate(taxable, approved.gstRateBps, 20_000n) : 0n;
    const sgst = intrastate ? roundRate(taxable, approved.gstRateBps, 20_000n) : 0n;
    const igst = intrastate ? 0n : roundRate(taxable, approved.gstRateBps);
    return { grossMinor: gross.toString(), discountMinor: discount.toString(), taxableMinor: taxable.toString(),
      cgstMinor: cgst.toString(), sgstMinor: sgst.toString(), igstMinor: igst.toString(), totalMinor: (taxable + cgst + sgst + igst).toString() };
  };
  const financialYearAt = (instant: string, timezone: string) => {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date(instant));
    const year = Number(parts.find((part) => part.type === "year")?.value);
    const month = Number(parts.find((part) => part.type === "month")?.value);
    const start = month <= 3 ? year - 1 : year;
    return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
  };
  const recentlyReauthenticated = (membership: NativeInvoiceMembership, now: string) => {
    if (!membership.recentReauthenticatedAt) return false;
    const age = new Date(now).getTime() - new Date(membership.recentReauthenticatedAt).getTime();
    return age >= 0 && age <= 10 * 60 * 1000;
  };

  return {
    signIn(token: string) {
      return {
        async get(rawPath: string): Promise<ApiResponse> {
          const url = new URL(rawPath, "https://local.workshopos.invalid");
          const match = url.pathname.match(/^\/api\/v1\/jobs\/([^/]+)\/billing-readiness$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          const branchId = url.searchParams.get("branchId") ?? "";
          const auth = authorize(token, branchId, "billing.read");
          if ("status" in auth) return auth;
          const job = jobs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === branchId && candidate.jobId === match[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          const config = configurations.find((candidate) => candidate.tenantId === auth.tenantId);
          const { blockers } = blockersFor(auth, branchId, job);
          return { status: 200, body: { ready: blockers.length === 0, authority: config?.invoiceAuthority ?? "UNCONFIGURED", blockers } };
        },
        async post(rawPath: string, body: Record<string, any>, options: CommandOptions = {}): Promise<ApiResponse> {
          const approveAdjustment = rawPath.match(/^\/api\/v1\/invoice-adjustments\/([^/]+)\/approve$/);
          if (approveAdjustment) {
            const auth = authorize(token, body.branchId, "invoice.adjust.approve");
            if ("status" in auth) return auth;
            if (!options.idempotencyKey) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const receiptKey = `${auth.tenantId}:${options.idempotencyKey}`;
            const fingerprint = JSON.stringify({ rawPath, body, ifMatch: options.ifMatch });
            const prior = commandReceipts.get(receiptKey);
            if (prior) return prior.fingerprint === fingerprint ? structuredClone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            const adjustment = adjustments.find((candidate) => candidate.id === approveAdjustment[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!adjustment) return { status: 404, body: { code: "ADJUSTMENT_NOT_FOUND" } };
            if (options.ifMatch !== adjustment.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: adjustment.resourceVersion } };
            const now = options.now ?? new Date().toISOString();
            if (adjustment.makerMembershipId === auth.membershipId) return { status: 409, body: { code: "MAKER_CHECKER_SEPARATION_REQUIRED" } };
            if (!recentlyReauthenticated(auth, now)) return { status: 401, body: { code: "RECENT_REAUTHENTICATION_REQUIRED" } };
            if (adjustment.status !== "APPROVAL_PENDING") return { status: 409, body: { code: "ADJUSTMENT_NOT_PENDING" } };
            const config = configurations.find((candidate) => candidate.tenantId === auth.tenantId)!;
            const financialYear = financialYearAt(now, config.timezone);
            const documentType = adjustment.type === "CREDIT_NOTE" ? "CREDIT_NOTE" : adjustment.type === "DEBIT_NOTE" ? "DEBIT_NOTE" : "CANCELLATION_NOTE";
            const prefix = adjustment.type === "CREDIT_NOTE" ? "CRN" : adjustment.type === "DEBIT_NOTE" ? "DBN" : "CAN";
            const sequenceKey = `${auth.tenantId}:${adjustment.branchId}:${documentType}:${financialYear}`;
            const sequence = (documentSequences.get(sequenceKey) ?? 0n) + 1n;
            documentSequences.set(sequenceKey, sequence);
            adjustment.status = "FINALIZED";
            adjustment.financialYear = financialYear;
            adjustment.documentNumber = `${prefix}/${financialYear}/${sequence.toString().padStart(6, "0")}`;
            adjustment.finalizedAt = now;
            adjustment.resourceVersion += 1;
            const responseBody: Record<string, any> = { adjustment: structuredClone(adjustment), resourceVersion: adjustment.resourceVersion, auditReference: `audit-adjust-${adjustment.id}` };
            if (adjustment.type === "CANCEL_REISSUE") {
              const original = invoices.find((candidate) => candidate.id === adjustment.invoiceId)!;
              const reissue: Invoice = { ...structuredClone(original), id: `invoice-${invoices.length + 1}`, status: "DRAFT", resourceVersion: 1,
                replacesInvoiceNumber: original.documentNumber, correctionStatus: undefined, documentNumber: undefined, financialYear: undefined, finalizedAt: undefined };
              invoices.push(reissue);
              responseBody.originalInvoice = { ...structuredClone(original), correctionStatus: "CANCELLED_BY_NOTE" };
              responseBody.reissueInvoice = structuredClone(reissue);
            }
            outboxEvents.push({ id: `invoice-adjusted-${outboxEvents.length + 1}`, type: "S18_INVOICE_ADJUSTED", tenantId: auth.tenantId,
              branchId: adjustment.branchId, aggregateId: adjustment.id, aggregateVersion: adjustment.resourceVersion,
              payload: { invoiceId: adjustment.invoiceId, adjustmentType: adjustment.type, documentNumber: adjustment.documentNumber,
                totalMinor: adjustment.totals.totalMinor, consumers: ["S20_PAYMENTS", "S21_DELIVERY", "DOCUMENT_WORKER"], documentVisibility: "PRIVATE" } });
            const committed = { status: 200, body: responseBody };
            commandReceipts.set(receiptKey, { fingerprint, response: structuredClone(committed) });
            return committed;
          }
          const adjustmentRequest = rawPath.match(/^\/api\/v1\/invoices\/([^/]+)\/adjustment-requests$/);
          if (adjustmentRequest) {
            const auth = authorize(token, body.branchId, "invoice.adjust.request");
            if ("status" in auth) return auth;
            if (!options.idempotencyKey) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const receiptKey = `${auth.tenantId}:${options.idempotencyKey}`;
            const fingerprint = JSON.stringify({ rawPath, body, ifMatch: options.ifMatch });
            const prior = commandReceipts.get(receiptKey);
            if (prior) return prior.fingerprint === fingerprint ? structuredClone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            const invoice = invoices.find((candidate) => candidate.id === adjustmentRequest[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!invoice || invoice.status !== "FINALIZED" || !invoice.documentNumber) return { status: 404, body: { code: "FINALIZED_INVOICE_NOT_FOUND" } };
            if (options.ifMatch !== invoice.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: invoice.resourceVersion } };
            if (!["CREDIT_NOTE", "DEBIT_NOTE", "CANCEL_REISSUE"].includes(body.type) || typeof body.reason !== "string" || !body.reason.trim() || !Array.isArray(body.lines) || !body.lines.length) {
              return { status: 422, body: { code: "INVALID_ADJUSTMENT_REQUEST" } };
            }
            let taxable = 0n; let tax = 0n;
            for (const candidate of body.lines) {
              if (!invoice.lines.some((source) => source.id === candidate.sourceLineId) || !/^[1-9][0-9]*$/.test(candidate.taxableAdjustmentMinor) || !Number.isInteger(candidate.gstRateBps)) {
                return { status: 422, body: { code: "INVALID_ADJUSTMENT_LINE" } };
              }
              const value = BigInt(candidate.taxableAdjustmentMinor); taxable += value; tax += roundRate(value, candidate.gstRateBps);
            }
            if (body.type === "CREDIT_NOTE" && taxable + tax > BigInt(invoice.totals.payableMinor)) return { status: 422, body: { code: "CREDIT_EXCEEDS_INVOICE" } };
            const config = configurations.find((candidate) => candidate.tenantId === auth.tenantId)!;
            if (body.type === "CANCEL_REISSUE" && (!config.allowCancellationReissue || taxable + tax !== BigInt(invoice.totals.payableMinor))) {
              return { status: 422, body: { code: "CANCELLATION_REISSUE_NOT_ALLOWED" } };
            }
            const adjustment: Adjustment = { id: `adjustment-${adjustments.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId,
              invoiceId: invoice.id, linkedInvoiceNumber: invoice.documentNumber, type: body.type, reason: body.reason.trim(), status: "APPROVAL_PENDING",
              lines: structuredClone(body.lines), totals: { taxableMinor: taxable.toString(), taxMinor: tax.toString(), totalMinor: (taxable + tax).toString() },
              makerMembershipId: auth.membershipId, resourceVersion: 1 };
            adjustments.push(adjustment);
            const committed = { status: 201, body: { adjustment: structuredClone(adjustment), resourceVersion: 1, auditReference: `audit-request-${adjustment.id}` } };
            commandReceipts.set(receiptKey, { fingerprint, response: structuredClone(committed) });
            return committed;
          }
          const finalize = rawPath.match(/^\/api\/v1\/invoices\/([^/]+)\/finalize$/);
          if (finalize) {
            const auth = authorize(token, body.branchId, "invoice.finalize");
            if ("status" in auth) return auth;
            if (!options.idempotencyKey) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const receiptKey = `${auth.tenantId}:${options.idempotencyKey}`;
            const fingerprint = JSON.stringify({ rawPath, body, ifMatch: options.ifMatch });
            const prior = commandReceipts.get(receiptKey);
            if (prior) return prior.fingerprint === fingerprint ? structuredClone(prior.response) : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            const invoice = invoices.find((candidate) => candidate.id === finalize[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
            if (!invoice) return { status: 404, body: { code: "INVOICE_NOT_FOUND" } };
            if (options.ifMatch !== invoice.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: invoice.resourceVersion } };
            if (invoice.status !== "DRAFT") return { status: 409, body: { code: "INVOICE_NOT_DRAFT" } };
            const job = jobs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === invoice.branchId && candidate.jobId === invoice.jobId)!;
            const allocated = job.approvedLines.filter((line) => line.payerId === invoice.payerId).map((line) => line.id);
            if (new Set(job.approvedLines.map((line) => line.id)).size !== job.approvedLines.length ||
                allocated.length !== invoice.lines.length || invoice.lines.some((line) => !allocated.includes(line.id))) {
              return { status: 409, body: { code: "INVALID_PAYER_ALLOCATION" } };
            }
            if (invoices.some((candidate) => candidate !== invoice && candidate.tenantId === auth.tenantId && candidate.jobId === invoice.jobId && candidate.payerId === invoice.payerId && candidate.status === "FINALIZED" &&
                !adjustments.some((adjustment) => adjustment.invoiceId === candidate.id && adjustment.type === "CANCEL_REISSUE" && adjustment.status === "FINALIZED"))) {
              return { status: 409, body: { code: "PAYER_INVOICE_ALREADY_FINALIZED" } };
            }
            const config = configurations.find((candidate) => candidate.tenantId === auth.tenantId)!;
            const finalizedAt = options.now ?? new Date().toISOString();
            const financialYear = financialYearAt(finalizedAt, config.timezone);
            const sequenceKey = `${auth.tenantId}:${invoice.branchId}:TAX_INVOICE:${financialYear}`;
            const sequence = (documentSequences.get(sequenceKey) ?? 0n) + 1n;
            documentSequences.set(sequenceKey, sequence);
            invoice.status = "FINALIZED";
            invoice.financialYear = financialYear;
            invoice.documentNumber = `TAXINV/${financialYear}/${sequence.toString().padStart(6, "0")}`;
            invoice.finalizedAt = finalizedAt;
            invoice.resourceVersion += 1;
            outboxEvents.push({ id: `invoice-finalized-${outboxEvents.filter((event) => event.type === "S18_INVOICE_FINALIZED").length + 1}`,
              type: "S18_INVOICE_FINALIZED", tenantId: auth.tenantId, branchId: invoice.branchId, aggregateId: invoice.id,
              aggregateVersion: invoice.resourceVersion, payload: { jobId: invoice.jobId, payerId: invoice.payerId, authority: invoice.authority,
                documentNumber: invoice.documentNumber, payableMinor: invoice.totals.payableMinor, currency: invoice.currency,
                consumers: ["S20_PAYMENTS", "S21_DELIVERY", "DOCUMENT_WORKER"], documentVisibility: "PRIVATE" } });
            const committed = { status: 200, body: { invoice: structuredClone(invoice), resourceVersion: invoice.resourceVersion, auditReference: `audit-final-${invoice.id}` } };
            commandReceipts.set(receiptKey, { fingerprint, response: structuredClone(committed) });
            return committed;
          }
          const match = rawPath.match(/^\/api\/v1\/jobs\/([^/]+)\/invoices\/drafts$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          const auth = authorize(token, body.branchId, "invoice.create");
          if ("status" in auth) return auth;
          if (!options.idempotencyKey) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
          const receiptKey = `${auth.tenantId}:${options.idempotencyKey}`;
          const fingerprint = JSON.stringify({ rawPath, body, ifMatch: options.ifMatch });
          const prior = commandReceipts.get(receiptKey);
          if (prior) return prior.fingerprint === fingerprint ? { ...structuredClone(prior.response), status: 200 } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
          const job = jobs.find((candidate) => candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId && candidate.jobId === match[1]);
          if (!job) return { status: 404, body: { code: "JOB_NOT_FOUND" } };
          if (options.ifMatch !== job.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: job.resourceVersion } };
          const { config, blockers } = blockersFor(auth, body.branchId, job);
          if (blockers.length || !config) return { status: 409, body: { code: "BILLING_NOT_READY", blockers } };
          if (!/^[0-9]{2}$/.test(body.placeOfSupplyStateCode) || typeof body.payerId !== "string") return { status: 422, body: { code: "INVALID_INVOICE_DRAFT" } };
          const lineIds = job.approvedLines.map((candidate) => candidate.id);
          if (config.baseCurrency !== "INR" || new Set(lineIds).size !== lineIds.length || job.approvedLines.some((candidate) =>
            !candidate.id || !candidate.payerId || !candidate.hsnSac || !/^(0|[1-9][0-9]*)$/.test(candidate.grossAmountMinor) ||
            !/^(0|[1-9][0-9]*)$/.test(candidate.discountMinor) || BigInt(candidate.discountMinor) > BigInt(candidate.grossAmountMinor) ||
            !Number.isInteger(candidate.gstRateBps) || candidate.gstRateBps < 0 || candidate.gstRateBps > 10_000)) {
            return { status: 422, body: { code: "INVALID_APPROVED_FINANCIAL_SNAPSHOT" } };
          }
          const approved = job.approvedLines.filter((candidate) => candidate.payerId === body.payerId);
          if (!approved.length) return { status: 422, body: { code: "PAYER_HAS_NO_APPROVED_LINES" } };
          const intrastate = config.supplierStateCode === body.placeOfSupplyStateCode;
          const lines = approved.map((candidate) => ({ ...candidate, amounts: createAmounts(candidate, intrastate) }));
          const sum = (key: keyof ReturnType<typeof createAmounts>) => lines.reduce((total, candidate) => total + BigInt(candidate.amounts[key]), 0n);
          const totals = { grossMinor: sum("grossMinor").toString(), discountMinor: sum("discountMinor").toString(), taxableMinor: sum("taxableMinor").toString(),
            cgstMinor: sum("cgstMinor").toString(), sgstMinor: sum("sgstMinor").toString(), igstMinor: sum("igstMinor").toString(),
            taxMinor: (sum("cgstMinor") + sum("sgstMinor") + sum("igstMinor")).toString(), roundingAdjustmentMinor: "0", payableMinor: sum("totalMinor").toString() };
          const invoice: Invoice = { id: `invoice-${invoices.length + 1}`, tenantId: auth.tenantId, branchId: body.branchId, jobId: job.jobId,
            payerId: body.payerId, authority: "WORKSHOPOS_NATIVE", status: "DRAFT", currency: config.baseCurrency,
            placeOfSupplyStateCode: body.placeOfSupplyStateCode, taxTreatment: intrastate ? "INTRASTATE" : "INTERSTATE",
            taxSnapshotId: config.taxSnapshotId, documentTemplateSnapshotId: config.documentTemplateSnapshotId, lines, totals, resourceVersion: 1 };
          invoices.push(invoice);
          const committed = { status: 201, body: { invoice: structuredClone(invoice), auditReference: `audit-${invoice.id}` } };
          commandReceipts.set(receiptKey, { fingerprint, response: structuredClone(committed) });
          return committed;
        },
        async patch(rawPath: string, body: Record<string, any>, options: CommandOptions = {}): Promise<ApiResponse> {
          const match = rawPath.match(/^\/api\/v1\/invoices\/([^/]+)$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          const auth = authorize(token, body.branchId, "invoice.create");
          if ("status" in auth) return auth;
          const invoice = invoices.find((candidate) => candidate.id === match[1] && candidate.tenantId === auth.tenantId && candidate.branchId === body.branchId);
          if (!invoice) return { status: 404, body: { code: "INVOICE_NOT_FOUND" } };
          if (invoice.status === "FINALIZED") return { status: 409, body: { code: "FINALIZED_INVOICE_IMMUTABLE" } };
          if (options.ifMatch !== invoice.resourceVersion) return { status: 412, body: { code: "VERSION_MISMATCH", currentVersion: invoice.resourceVersion } };
          return { status: 422, body: { code: "DRAFT_RECALCULATION_REQUIRED" } };
        },
      };
    },
    testing: { invoices: () => structuredClone(invoices), adjustments: () => structuredClone(adjustments), outboxEvents: () => structuredClone(outboxEvents) },
  };
}
