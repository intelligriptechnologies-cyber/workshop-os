import { createHash } from "node:crypto";

export type ReportingMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  roles: string[];
  permissions: string[];
};

export type BoardItemInput = {
  id: string;
  tenantId: string;
  branchId: string;
  roles: string[];
  queue: string;
  responsibilityMembershipId: string;
  urgency: "URGENT" | "HIGH" | "NORMAL" | "LOW";
  dueAt?: string;
  blocker?: string;
  nextAction: string;
  requiredPermission?: string;
  protectedFinancialMinor?: string;
};

export type CapacityInput = {
  tenantId: string;
  branchId: string;
  role: string;
  available: number;
  planned: number;
  delayed: number;
};

export type ReportCategory = "OPERATIONAL" | "INVENTORY" | "PROFITABILITY" | "FINANCE" | "CUSTOMER" | "STAFF" | "QC_REWORK" | "AUDIT";
export type ReportFactInput = {
  id: string;
  tenantId: string;
  branchId: string;
  category: ReportCategory;
  metric: string;
  value: string;
  occurredAt: string;
  sourceLedgerRef: string;
  drillRecord: Record<string, unknown>;
};
type ApiResponse = { status: number; body: Record<string, any> };
type ExportRecord = {
  id: string; tenantId: string; branchId: string; requestedByMembershipId: string; reportKey: string;
  definitionVersion: string; asOf: string; format: "CSV" | "JSON"; filters: Record<string, string>;
  status: "PENDING" | "PROCESSING" | "READY" | "RETRY_SCHEDULED" | "DEAD_LETTER" | "REVOKED" | "EXPIRED";
  version: number; requestedAt: string; auditRef: string; attemptCount: number;
  objectRef?: string; sha256?: string; manifestSha256?: string; watermark?: string; expiresAt?: string; failureReason?: string;
};
type ExportArtifact = { exportId: string; tenantId: string; branchId: string; objectRef: string; content: string; manifest: string; sha256: string; manifestSha256: string };
type CommandOptions = { idempotencyKey: string; ifMatch: number; now: string };
type ExportAudit = { auditRef: string; exportId: string; tenantId: string; branchId: string; membershipId: string; action: "REQUESTED" | "GENERATED" | "DOWNLOADED" | "REVOKED" | "REPLAYED"; occurredAt: string; reason?: string };
const clone = <T>(value: T): T => structuredClone(value);
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const sumExactDecimals = (values: string[]) => {
  if (!values.length) return "0";
  if (values.some((value) => !/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(value))) throw new Error("Report fact is not an exact decimal");
  const scale = Math.max(...values.map((value) => value.split(".")[1]?.length ?? 0));
  const total = values.reduce((sum, value) => {
    const negative = value.startsWith("-");
    const [whole, fraction = ""] = (negative ? value.slice(1) : value).split(".");
    const scaled = BigInt(`${whole}${fraction.padEnd(scale, "0")}`);
    return sum + (negative ? -scaled : scaled);
  }, 0n);
  if (scale === 0) return total.toString();
  const negative = total < 0n; const digits = (negative ? -total : total).toString().padStart(scale + 1, "0");
  const fraction = digits.slice(-scale).replace(/0+$/, "");
  const rendered = fraction ? `${digits.slice(0, -scale)}.${fraction}` : digits.slice(0, -scale);
  return negative ? `-${rendered}` : rendered;
};

export function createLocalManagementReportingApi(input: {
  memberships: Record<string, ReportingMembership>;
  boardItems: BoardItemInput[];
  capacities: CapacityInput[];
  reportFacts: ReportFactInput[];
}) {
  const reportFacts = clone(input.reportFacts);
  const exports: ExportRecord[] = [];
  const artifacts: ExportArtifact[] = [];
  const audits: ExportAudit[] = [];
  const commands = new Map<string, { digest: string; response: ApiResponse }>();
  let exportSequence = 0;
  let auditSequence = 0;
  const definitions: Record<string, { category: ReportCategory; version: string; metrics: Record<string, { label: string; unit: "COUNT" | "MINOR_UNITS" | "QUANTITY" }> }> = {
    operational: { category: "OPERATIONAL", version: "operational-v1", metrics: { jobs_completed: { label: "Jobs completed", unit: "COUNT" } } },
    inventory: { category: "INVENTORY", version: "inventory-v1", metrics: { stock_value_minor: { label: "Stock value", unit: "MINOR_UNITS" }, stock_quantity: { label: "Stock quantity", unit: "QUANTITY" } } },
    profitability: { category: "PROFITABILITY", version: "profitability-v1", metrics: { contribution_minor: { label: "Contribution", unit: "MINOR_UNITS" } } },
    finance: { category: "FINANCE", version: "finance-v1", metrics: { outstanding_minor: { label: "Outstanding", unit: "MINOR_UNITS" } } },
    customer: { category: "CUSTOMER", version: "customer-v1", metrics: { returning_customers: { label: "Returning customers", unit: "COUNT" } } },
    staff: { category: "STAFF", version: "staff-v1", metrics: { completed_tasks: { label: "Completed tasks", unit: "COUNT" } } },
    "qc-rework": { category: "QC_REWORK", version: "qc-rework-v1", metrics: { rework_jobs: { label: "Jobs needing rework", unit: "COUNT" } } },
    audit: { category: "AUDIT", version: "audit-v1", metrics: { critical_actions: { label: "Critical actions", unit: "COUNT" } } },
  };
  const scopedFacts = (membership: ReportingMembership, branchId: string, definition: (typeof definitions)[string], asOf: string, metric?: string) =>
    reportFacts.filter((fact) => fact.tenantId === membership.tenantId && fact.branchId === branchId && fact.category === definition.category && Date.parse(fact.occurredAt) <= Date.parse(asOf) && (!metric || fact.metric === metric));
  return {
    signIn(token: string) {
      return {
        async get(path: string): Promise<ApiResponse> {
          const membership = input.memberships[token];
          if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const url = new URL(path, "https://local.workshopos.test");
          const branchId = url.searchParams.get("branchId");
          if (!branchId || !membership.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const exportMatch = url.pathname.match(/^\/api\/v1\/report-exports\/([^/]+)(\/download)?$/);
          if (exportMatch) {
            if (!membership.permissions.includes("report.export")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            const record = exports.find((candidate) => candidate.id === exportMatch[1] && candidate.tenantId === membership.tenantId && candidate.branchId === branchId);
            if (!record) return { status: 404, body: { code: "EXPORT_NOT_FOUND" } };
            const definition = definitions[record.reportKey];
            if ((definition.category === "FINANCE" || definition.category === "PROFITABILITY") && !membership.permissions.includes("report.financial.read")) return { status: 403, body: { code: "FINANCIAL_REPORT_FORBIDDEN" } };
            if (!exportMatch[2]) return { status: 200, body: { export: clone(record) } };
            const now = url.searchParams.get("now") ?? new Date().toISOString();
            if (record.status === "REVOKED" || record.status === "EXPIRED") return { status: 410, body: { code: "EXPORT_UNAVAILABLE" } };
            if (record.status !== "READY") return { status: 409, body: { code: "EXPORT_NOT_READY" } };
            if (!record.expiresAt || Date.parse(now) >= Date.parse(record.expiresAt)) { record.status = "EXPIRED"; record.version += 1; return { status: 410, body: { code: "EXPORT_EXPIRED" } }; }
            const artifact = artifacts.find((candidate) => candidate.exportId === record.id && candidate.tenantId === membership.tenantId && candidate.branchId === branchId);
            if (!artifact || hash(artifact.content) !== record.sha256 || hash(artifact.manifest) !== record.manifestSha256) return { status: 409, body: { code: "EXPORT_INTEGRITY_FAILED" } };
            const auditRef = `audit-${++auditSequence}`; audits.push({ auditRef, exportId: record.id, tenantId: record.tenantId, branchId, membershipId: membership.membershipId, action: "DOWNLOADED", occurredAt: now });
            return { status: 200, body: { content: artifact.content, manifest: artifact.manifest, sha256: artifact.sha256, manifestSha256: artifact.manifestSha256, auditRef } };
          }
          if (url.pathname === "/api/v1/reports") {
            if (!membership.permissions.includes("report.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            return { status: 200, body: { reports: Object.entries(definitions).map(([key, definition]) => ({ key, definitionVersion: definition.version, available: !(["FINANCE", "PROFITABILITY"] as ReportCategory[]).includes(definition.category) || membership.permissions.includes("report.financial.read") })) } };
          }
          const reportMatch = url.pathname.match(/^\/api\/v1\/reports\/([^/]+)(\/drill-through)?$/);
          if (reportMatch) {
            if (!membership.permissions.includes("report.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            const definition = definitions[reportMatch[1]];
            if (!definition) return { status: 404, body: { code: "REPORT_NOT_FOUND" } };
            if ((definition.category === "FINANCE" || definition.category === "PROFITABILITY") && !membership.permissions.includes("report.financial.read")) return { status: 403, body: { code: "FINANCIAL_REPORT_FORBIDDEN" } };
            const asOf = url.searchParams.get("asOf") ?? new Date().toISOString();
            if (reportMatch[2]) {
              const metric = url.searchParams.get("metric") ?? "";
              if (!definition.metrics[metric]) return { status: 422, body: { code: "METRIC_NOT_DEFINED" } };
              const records = scopedFacts(membership, branchId, definition, asOf, metric).map((fact) => {
                const record = clone(fact.drillRecord);
                if (!membership.permissions.includes("report.financial.read")) {
                  for (const field of ["payerName", "amountMinor", "costMinor", "taxMinor", "profitMinor"]) delete record[field];
                }
                return { factId: fact.id, sourceLedgerRef: fact.sourceLedgerRef, occurredAt: fact.occurredAt, ...record };
              });
              return { status: 200, body: { definitionVersion: definition.version, asOf, records } };
            }
            const facts = scopedFacts(membership, branchId, definition, asOf);
            const metrics = Object.entries(definition.metrics).map(([key, metadata]) => {
              const sources = facts.filter((fact) => fact.metric === key);
              return { key, ...metadata, value: sumExactDecimals(sources.map((fact) => fact.value)), sourceCount: sources.length };
            });
            return { status: 200, body: { definitionVersion: definition.version, asOf, metrics } };
          }
          if (url.pathname !== "/api/v1/boards/my-work") return { status: 404, body: { code: "NOT_FOUND" } };
          if (!membership.permissions.includes("board.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const asOf = url.searchParams.get("asOf") ?? new Date().toISOString();
          const capacities = input.capacities.filter((item) => item.tenantId === membership.tenantId && item.branchId === branchId && membership.roles.includes(item.role));
          const capacity = capacities.reduce((sum, item) => ({ available: sum.available + item.available, planned: sum.planned + item.planned, delayed: sum.delayed + item.delayed }), { available: 0, planned: 0, delayed: 0 });
          const items = input.boardItems
            .filter((item) => item.tenantId === membership.tenantId && item.branchId === branchId && item.roles.some((role) => membership.roles.includes(role)) && (!item.requiredPermission || membership.permissions.includes(item.requiredPermission)))
            .map((item) => ({ id: item.id, queue: item.queue, responsibility: item.responsibilityMembershipId === membership.membershipId ? "You" : "A colleague", urgency: item.urgency, delay: item.dueAt && Date.parse(item.dueAt) < Date.parse(asOf) ? "Overdue" : "On time", blocker: item.blocker, nextAction: item.nextAction }));
          return { status: 200, body: { capacity: { ...capacity, message: `${capacity.delayed} ${capacity.delayed === 1 ? "job needs" : "jobs need"} attention because ${capacity.delayed === 1 ? "it is" : "they are"} delayed.` }, items: clone(items) } };
        },
        async post(path: string, body: Record<string, unknown>, options: CommandOptions): Promise<ApiResponse> {
          const membership = input.memberships[token];
          if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const url = new URL(path, "https://local.workshopos.test");
          if (!membership.permissions.includes("report.export")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const branchId = typeof body.branchId === "string" ? body.branchId : "";
          if (!membership.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const revokeMatch = url.pathname.match(/^\/api\/v1\/report-exports\/([^/]+)\/revoke$/);
          if (revokeMatch) {
            const record = exports.find((candidate) => candidate.id === revokeMatch[1] && candidate.tenantId === membership.tenantId && candidate.branchId === branchId);
            if (!record) return { status: 404, body: { code: "EXPORT_NOT_FOUND" } };
            if (!options?.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const commandKey = `${membership.tenantId}:${membership.membershipId}:${options.idempotencyKey}`;
            const digest = hash(JSON.stringify({ path: url.pathname, body })); const prior = commands.get(commandKey);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (record.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: record.version } };
            const reason = typeof body.reason === "string" ? body.reason.trim() : ""; if (!reason) return { status: 422, body: { code: "REASON_REQUIRED" } };
            if (record.status !== "READY") return { status: 409, body: { code: "EXPORT_NOT_REVOCABLE" } };
            record.status = "REVOKED"; record.version += 1; const auditRef = `audit-${++auditSequence}`;
            audits.push({ auditRef, exportId: record.id, tenantId: record.tenantId, branchId, membershipId: membership.membershipId, action: "REVOKED", occurredAt: options.now, reason });
            const response: ApiResponse = { status: 200, body: { export: clone(record), auditRef } }; commands.set(commandKey, { digest, response: clone(response) }); return response;
          }
          if (url.pathname !== "/api/v1/report-exports") return { status: 404, body: { code: "NOT_FOUND" } };
          const reportKey = typeof body.reportKey === "string" ? body.reportKey : "";
          const definition = definitions[reportKey];
          if (!definition) return { status: 422, body: { code: "REPORT_NOT_DEFINED" } };
          if ((definition.category === "FINANCE" || definition.category === "PROFITABILITY") && !membership.permissions.includes("report.financial.read")) return { status: 403, body: { code: "FINANCIAL_REPORT_FORBIDDEN" } };
          if (!options?.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
          const commandKey = `${membership.tenantId}:${membership.membershipId}:${options.idempotencyKey}`;
          const digest = hash(JSON.stringify({ path: url.pathname, body }));
          const prior = commands.get(commandKey);
          if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
          if (options.ifMatch !== 0) return { status: 412, body: { code: "VERSION_MISMATCH" } };
          const asOf = typeof body.asOf === "string" && Number.isFinite(Date.parse(body.asOf)) ? body.asOf : "";
          if (!asOf || Date.parse(asOf) > Date.parse(options.now)) return { status: 422, body: { code: "INVALID_AS_OF" } };
          const format = body.format === "CSV" || body.format === "JSON" ? body.format : undefined;
          if (!format) return { status: 422, body: { code: "FORMAT_NOT_SUPPORTED" } };
          const filters = body.filters && typeof body.filters === "object" && !Array.isArray(body.filters) ? body.filters as Record<string, string> : {};
          if (Object.keys(filters).some((key) => key !== "metric") || (filters.metric && !definition.metrics[filters.metric])) return { status: 422, body: { code: "FILTER_NOT_ALLOWED" } };
          const record: ExportRecord = { id: `export-${++exportSequence}`, tenantId: membership.tenantId, branchId, requestedByMembershipId: membership.membershipId, reportKey, definitionVersion: definition.version, asOf, format, filters: clone(filters), status: "PENDING", version: 1, requestedAt: options.now, auditRef: `audit-${++auditSequence}`, attemptCount: 0 };
          exports.push(record);
          audits.push({ auditRef: record.auditRef, exportId: record.id, tenantId: record.tenantId, branchId, membershipId: membership.membershipId, action: "REQUESTED", occurredAt: options.now });
          const response: ApiResponse = { status: 202, body: { export: clone(record), auditRef: record.auditRef } };
          commands.set(commandKey, { digest, response: clone(response) });
          return response;
        },
      };
    },
    worker: {
      async drain(now: string) {
        let processed = 0; let artifactsCreated = 0;
        for (const record of exports) {
          if (record.status !== "PENDING" && record.status !== "RETRY_SCHEDULED") continue;
          processed += 1;
          record.status = "PROCESSING";
          record.attemptCount += 1;
          const definition = definitions[record.reportKey];
          const membership = input.memberships[Object.keys(input.memberships).find((token) => input.memberships[token].membershipId === record.requestedByMembershipId && input.memberships[token].tenantId === record.tenantId)!];
          const facts = scopedFacts(membership, record.branchId, definition, record.asOf, record.filters.metric);
          const watermark = `WorkshopOS • ${record.tenantId} • ${record.branchId} • ${record.requestedByMembershipId} • ${record.asOf}`;
          const rows = facts.map((fact) => ({ factId: fact.id, metric: fact.metric, value: fact.value, occurredAt: fact.occurredAt, sourceLedgerRef: fact.sourceLedgerRef }));
          const content = record.format === "JSON" ? JSON.stringify({ watermark, rows }) : [watermark, "fact_id,metric,value,occurred_at,source_ledger_ref", ...rows.map((row) => `${row.factId},${row.metric},${row.value},${row.occurredAt},${row.sourceLedgerRef}`)].join("\n");
          const objectRef = `private/${record.tenantId}/${record.branchId}/report-exports/${record.id}.${record.format.toLowerCase()}`;
          const expiresAt = new Date(Date.parse(now) + 86_400_000).toISOString();
          const manifest = JSON.stringify({ exportId: record.id, tenantId: record.tenantId, branchId: record.branchId, reportKey: record.reportKey, definitionVersion: record.definitionVersion, asOf: record.asOf, filters: record.filters, format: record.format, watermark, objectRef, sourceFacts: rows.map((row) => ({ factId: row.factId, sourceLedgerRef: row.sourceLedgerRef })), expiresAt });
          const artifact: ExportArtifact = { exportId: record.id, tenantId: record.tenantId, branchId: record.branchId, objectRef, content, manifest, sha256: hash(content), manifestSha256: hash(manifest) };
          artifacts.push(artifact);
          Object.assign(record, { status: "READY", version: record.version + 1, objectRef, sha256: artifact.sha256, manifestSha256: artifact.manifestSha256, watermark, expiresAt });
          audits.push({ auditRef: `audit-${++auditSequence}`, exportId: record.id, tenantId: record.tenantId, branchId: record.branchId, membershipId: record.requestedByMembershipId, action: "GENERATED", occurredAt: now });
          artifactsCreated += 1;
        }
        return { processed, artifactsCreated };
      },
    },
    testing: { exports: () => clone(exports), artifacts: () => clone(artifacts), audits: () => clone(audits) },
  };
}
