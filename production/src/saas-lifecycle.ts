import { createHash } from "node:crypto";

type PlatformSession = { identityId: string; permissions: string[]; authenticatedAt: string; mfa: boolean };
type TenantMembership = { identityId: string; membershipId: string; tenantId: string; branchIds: string[]; permissions: string[]; active?: boolean };
type TenantStatus = "ACTIVE" | "SUSPENDED" | "PURGE_PENDING" | "PURGED";
type TenantRecord = {
  id: string; legalName: string; planId: string; entitlements: string[]; baseCurrency: string; timezone: string;
  branches: Array<{ id: string; name: string }>; ownerMembershipId: string; configurationTemplateId: string;
  quotas: Record<string, number>; status: TenantStatus; version: number; blockedCapabilities?: Array<"ACCESS" | "COMMAND">; purgeEligibleAt?: string;
};
export type TenantSurface = "database" | "objects" | "caches" | "queues" | "exports" | "search" | "logs" | "audit";
type TenantDataRecord = { tenantId: string; surface: TenantSurface; recordId: string; kind: "STATUTORY" | "FINANCE" | "AUDIT" | "LINKED_JOB" | "PHOTO" | "GENERAL"; closedAt?: string; warrantyUntil?: string; legalHoldId?: string; purgeEligibleAt?: string; checksum?: string };
type SupportGrant = { id: string; tenantId: string; supportIdentityId: string; branchIds: string[]; permissions: string[]; reason: string; requestedBy: string; approvedBy?: string; requestedAt: string; expiresAt: string; status: "PENDING" | "ACTIVE" | "EXPIRED"; version: number };
type TenantExport = { id: string; tenantId: string; requestedBy: string; requestedAt: string; reason: string; snapshotAt: string; status: "PENDING" | "READY"; version: number; objectRef?: string; contentSha256?: string; manifestSha256?: string; expiresAt?: string };
type PurgeDryRun = { id: string; tenantId: string; requestedBy: string; reason: string; asOf: string; tenantVersion: number; surfaceInventory: Array<{ surface: TenantSurface; eligibleCount: number; blockedCount: number }>; eligibleRecordIds: string[]; blockers: Array<{ recordId?: string; code: string }>; recordInventoryFingerprint: string; sha256: string };
type PurgeRecord = { id: string; tenantId: string; dryRunId: string; dryRunSha256: string; requestedBy: string; approvedBy?: string; reason: string; status: "PENDING_APPROVAL" | "SIMULATED_COMPLETE"; version: number; deletedCount: number };
type CommandOptions = { idempotencyKey: string; ifMatch: number; now: string };
type ApiResponse = { status: number; body: Record<string, any> };

const clone = <T>(value: T): T => structuredClone(value);
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const SURFACES: TenantSurface[] = ["database", "objects", "caches", "queues", "exports", "search", "logs", "audit"];
const retentionUntil = (record: TenantDataRecord) => {
  const years = record.kind === "PHOTO" ? 3 : (["STATUTORY", "FINANCE", "AUDIT", "LINKED_JOB"].includes(record.kind) ? 8 : undefined);
  if (years === undefined) return record.purgeEligibleAt;
  if (!record.closedAt) return undefined;
  const date = new Date(record.closedAt); date.setUTCFullYear(date.getUTCFullYear() + years); return date.toISOString();
};

export function createLocalSaasLifecycleApi(input: {
  platformSessions: Record<string, PlatformSession>;
  memberships: Record<string, TenantMembership>;
  tenants: TenantRecord[];
  records: TenantDataRecord[];
}) {
  const tenants = clone(input.tenants);
  const memberships = clone(Object.values(input.memberships));
  const records = clone(input.records);
  const entitlementHistory = tenants.map((tenant) => ({ tenantId: tenant.id, version: tenant.version, planId: tenant.planId, entitlements: [...tenant.entitlements], quotas: clone(tenant.quotas), changedAt: "INITIAL" }));
  const audits: Array<Record<string, unknown>> = [];
  const commands = new Map<string, { digest: string; response: ApiResponse }>();
  const supportGrants: SupportGrant[] = [];
  const tenantExports: TenantExport[] = [];
  const exportArtifacts: Array<{ exportId: string; tenantId: string; objectRef: string; content: string; manifest: string }> = [];
  const purgeDryRuns: PurgeDryRun[] = [];
  const purges: PurgeRecord[] = [];
  const purgeEvidence: Array<Record<string, unknown>> = [];
  const retentionEffects = new Map<string, string>();
  let auditSequence = 0;
  const audit = (tenantId: string, actorIdentityId: string, action: string, reason: string, occurredAt: string) => {
    const auditRef = `audit-${tenantId}-${++auditSequence}`;
    audits.push({ auditRef, tenantId, actorIdentityId, action, reason, occurredAt });
    return auditRef;
  };
  const recordInventoryFingerprint = (tenantId: string) => hash(JSON.stringify(records.filter((record) => record.tenantId === tenantId).map((record) => ({ surface: record.surface, recordId: record.recordId, kind: record.kind, closedAt: record.closedAt, warrantyUntil: record.warrantyUntil, legalHoldId: record.legalHoldId, purgeEligibleAt: record.purgeEligibleAt, checksum: record.checksum })).sort((left, right) => `${left.surface}:${left.recordId}`.localeCompare(`${right.surface}:${right.recordId}`))));

  return {
    platform(token: string) {
      return {
        async get(path: string): Promise<ApiResponse> {
          const session = input.platformSessions[token];
          if (!session) return { status: 401, body: { code: "PLATFORM_AUTHENTICATION_REQUIRED" } };
          const url = new URL(path, "https://local.workshopos.test");
          const exportMatch = url.pathname.match(/^\/api\/v1\/platform\/tenant-exports\/([^/]+)\/download$/);
          if (exportMatch) {
            if (!session.permissions.includes("platform.tenant.export")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            const now = url.searchParams.get("now") ?? new Date().toISOString();
            if (!session.mfa || Date.parse(now) - Date.parse(session.authenticatedAt) > 30 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            const record = tenantExports.find((candidate) => candidate.id === exportMatch[1]); if (!record) return { status: 404, body: { code: "TENANT_EXPORT_NOT_FOUND" } };
            if (record.status !== "READY") return { status: 409, body: { code: "TENANT_EXPORT_NOT_READY" } };
            if (!record.expiresAt || Date.parse(now) >= Date.parse(record.expiresAt)) return { status: 410, body: { code: "TENANT_EXPORT_EXPIRED" } };
            const artifact = exportArtifacts.find((candidate) => candidate.exportId === record.id && candidate.tenantId === record.tenantId);
            if (!artifact || hash(artifact.content) !== record.contentSha256 || hash(artifact.manifest) !== record.manifestSha256) return { status: 409, body: { code: "TENANT_EXPORT_INTEGRITY_FAILED" } };
            const auditRef = audit(record.tenantId, session.identityId, "tenant-export.downloaded", record.reason, now);
            return { status: 200, body: { objectRef: artifact.objectRef, content: artifact.content, manifest: artifact.manifest, contentSha256: record.contentSha256, manifestSha256: record.manifestSha256, auditRef } };
          }
          if (!session.permissions.includes("platform.support.use")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
          const match = url.pathname.match(/^\/api\/v1\/platform\/support\/tenants\/([^/]+)$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          const now = url.searchParams.get("now") ?? new Date().toISOString();
          if (!session.mfa || Date.parse(now) - Date.parse(session.authenticatedAt) > 30 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
          const grant = supportGrants.find((candidate) => candidate.id === url.searchParams.get("grantId") && candidate.tenantId === match[1] && candidate.supportIdentityId === session.identityId);
          if (!grant || grant.status !== "ACTIVE") return { status: 403, body: { code: "SUPPORT_GRANT_REQUIRED" } };
          if (Date.parse(now) >= Date.parse(grant.expiresAt)) { grant.status = "EXPIRED"; grant.version += 1; audit(grant.tenantId, session.identityId, "support.expired", grant.reason, now); return { status: 410, body: { code: "SUPPORT_GRANT_EXPIRED" } }; }
          const branchId = url.searchParams.get("branchId") ?? ""; const permission = url.searchParams.get("permission") ?? "";
          if (!grant.branchIds.includes(branchId) || !grant.permissions.includes(permission)) return { status: 403, body: { code: "SUPPORT_SCOPE_FORBIDDEN" } };
          const auditRef = audit(grant.tenantId, session.identityId, "support.accessed", grant.reason, now);
          return { status: 200, body: { tenantId: grant.tenantId, branchId, permission, auditRef } };
        },
        async post(path: string, body: Record<string, any>, options: CommandOptions): Promise<ApiResponse> {
          const session = input.platformSessions[token];
          if (!session) return { status: 401, body: { code: "PLATFORM_AUTHENTICATION_REQUIRED" } };
          const dryRunMatch = path.match(/^\/api\/v1\/platform\/tenants\/([^/]+)\/purge-dry-runs$/);
          if (dryRunMatch) {
            if (!session.permissions.includes("platform.purge.request")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa || Date.parse(options.now) - Date.parse(session.authenticatedAt) > 30 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            const tenant = tenants.find((candidate) => candidate.id === dryRunMatch[1]); if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (tenant.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: tenant.version } };
            if (tenant.status !== "SUSPENDED") return { status: 409, body: { code: "TENANT_MUST_BE_SUSPENDED" } };
            if (!tenant.purgeEligibleAt || Date.parse(options.now) < Date.parse(tenant.purgeEligibleAt)) return { status: 409, body: { code: "TENANT_RETENTION_NOT_EXPIRED" } };
            if (!body.reason?.trim()) return { status: 422, body: { code: "REASON_REQUIRED" } };
            const scoped = records.filter((record) => record.tenantId === tenant.id); const blockers: PurgeDryRun["blockers"] = []; const eligibleRecordIds: string[] = [];
            for (const record of scoped) {
              if (record.legalHoldId) blockers.push({ recordId: record.recordId, code: "LEGAL_HOLD_ACTIVE" });
              else if (record.warrantyUntil && Date.parse(record.warrantyUntil) > Date.parse(options.now)) blockers.push({ recordId: record.recordId, code: "WARRANTY_ACTIVE" });
              else { const until = retentionUntil(record); if (!until || Date.parse(until) > Date.parse(options.now)) blockers.push({ recordId: record.recordId, code: "RETENTION_NOT_EXPIRED" }); else eligibleRecordIds.push(record.recordId); }
            }
            const surfaceInventory = SURFACES.map((surface) => ({ surface, eligibleCount: scoped.filter((record) => record.surface === surface && eligibleRecordIds.includes(record.recordId)).length, blockedCount: scoped.filter((record) => record.surface === surface && blockers.some((blocker) => blocker.recordId === record.recordId)).length }));
            const base = { id: `purge-dry-run-${purgeDryRuns.length + 1}`, tenantId: tenant.id, requestedBy: session.identityId, reason: body.reason.trim(), asOf: options.now, tenantVersion: tenant.version, surfaceInventory, eligibleRecordIds, blockers, recordInventoryFingerprint: recordInventoryFingerprint(tenant.id) };
            const dryRun: PurgeDryRun = { ...base, sha256: hash(JSON.stringify(base)) }; purgeDryRuns.push(dryRun);
            const auditRef = audit(tenant.id, session.identityId, "purge.dry-run.completed", dryRun.reason, options.now); purgeEvidence.push({ tenantId: tenant.id, action: "DRY_RUN", dryRunId: dryRun.id, sha256: dryRun.sha256, auditRef, at: options.now });
            const response = { status: 200, body: { dryRun: clone(dryRun), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          if (path === "/api/v1/platform/purges") {
            if (!session.permissions.includes("platform.purge.request")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa || Date.parse(options.now) - Date.parse(session.authenticatedAt) > 30 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            const dryRun = purgeDryRuns.find((candidate) => candidate.id === body.dryRunId && candidate.tenantId === body.tenantId);
            if (!dryRun || dryRun.sha256 !== body.dryRunSha256) return { status: 409, body: { code: "PURGE_DRY_RUN_MISMATCH" } };
            if (dryRun.blockers.length) return { status: 409, body: { code: "PURGE_BLOCKED", blockers: clone(dryRun.blockers) } };
            if (!body.reason?.trim()) return { status: 422, body: { code: "REASON_REQUIRED" } };
            const purge: PurgeRecord = { id: `purge-${purges.length + 1}`, tenantId: body.tenantId, dryRunId: dryRun.id, dryRunSha256: dryRun.sha256, requestedBy: session.identityId, reason: body.reason.trim(), status: "PENDING_APPROVAL", version: 1, deletedCount: 0 };
            purges.push(purge); const auditRef = audit(purge.tenantId, session.identityId, "purge.requested", purge.reason, options.now); purgeEvidence.push({ tenantId: purge.tenantId, action: "REQUESTED", purgeId: purge.id, dryRunSha256: purge.dryRunSha256, auditRef, at: options.now });
            const response = { status: 202, body: { purge: clone(purge), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          const purgeApprovalMatch = path.match(/^\/api\/v1\/platform\/purges\/([^/]+)\/approve$/);
          if (purgeApprovalMatch) {
            if (!session.permissions.includes("platform.purge.approve")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa || Date.parse(options.now) - Date.parse(session.authenticatedAt) > 30 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            const purge = purges.find((candidate) => candidate.id === purgeApprovalMatch[1]); if (!purge) return { status: 404, body: { code: "PURGE_NOT_FOUND" } };
            if (purge.requestedBy === session.identityId) return { status: 403, body: { code: "MAKER_CANNOT_CHECK" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (purge.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: purge.version } };
            if (!body.reason?.trim()) return { status: 422, body: { code: "REASON_REQUIRED" } };
            const dryRun = purgeDryRuns.find((candidate) => candidate.id === purge.dryRunId)!;
            if (recordInventoryFingerprint(purge.tenantId) !== dryRun.recordInventoryFingerprint) return { status: 409, body: { code: "PURGE_INVENTORY_CHANGED" } };
            let deletedCount = 0; for (let index = records.length - 1; index >= 0; index -= 1) if (records[index].tenantId === purge.tenantId) { records.splice(index, 1); deletedCount += 1; }
            purge.status = "SIMULATED_COMPLETE"; purge.approvedBy = session.identityId; purge.version += 1; purge.deletedCount = deletedCount;
            const tenant = tenants.find((candidate) => candidate.id === purge.tenantId)!; tenant.status = "PURGED"; tenant.version += 1;
            const auditRef = audit(purge.tenantId, session.identityId, "purge.simulated-complete", body.reason, options.now); purgeEvidence.push({ tenantId: purge.tenantId, action: "SIMULATED_COMPLETE", purgeId: purge.id, deletedCount, surfaces: [...SURFACES], dryRunSha256: purge.dryRunSha256, auditRef, at: options.now });
            const response = { status: 200, body: { purge: clone(purge), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          if (path === "/api/v1/platform/tenant-exports") {
            if (!session.permissions.includes("platform.tenant.export")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa || Date.parse(options.now) - Date.parse(session.authenticatedAt) > 30 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (options.ifMatch !== 0) return { status: 412, body: { code: "VERSION_MISMATCH", version: 0 } };
            if (!tenants.some((tenant) => tenant.id === body.tenantId)) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
            if (!body.reason?.trim() || body.includeRetainedAndHeld !== true) return { status: 422, body: { code: "COMPLETE_EXPORT_REQUIRED" } };
            const record: TenantExport = { id: `tenant-export-${tenantExports.length + 1}`, tenantId: body.tenantId, requestedBy: session.identityId, requestedAt: options.now, snapshotAt: options.now, reason: body.reason.trim(), status: "PENDING", version: 1 };
            tenantExports.push(record); const auditRef = audit(record.tenantId, session.identityId, "tenant-export.requested", record.reason, options.now);
            const response = { status: 202, body: { export: clone(record), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          if (path === "/api/v1/platform/support-grants") {
            if (!session.permissions.includes("platform.support.grant")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa || Date.parse(options.now) - Date.parse(session.authenticatedAt) > 15 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            const tenant = tenants.find((candidate) => candidate.id === body.tenantId);
            if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
            if (!body.supportIdentityId || !Array.isArray(body.branchIds) || body.branchIds.some((branchId: string) => !tenant.branches.some((branch) => branch.id === branchId)) || !Array.isArray(body.permissions) || !body.permissions.length || !body.reason?.trim() || !Number.isFinite(Date.parse(body.expiresAt)) || Date.parse(body.expiresAt) <= Date.parse(options.now)) return { status: 422, body: { code: "SUPPORT_GRANT_INVALID" } };
            const grant: SupportGrant = { id: `support-grant-${supportGrants.length + 1}`, tenantId: tenant.id, supportIdentityId: body.supportIdentityId, branchIds: [...body.branchIds], permissions: [...body.permissions], reason: body.reason.trim(), requestedBy: session.identityId, requestedAt: options.now, expiresAt: body.expiresAt, status: "PENDING", version: 1 };
            supportGrants.push(grant); const auditRef = audit(tenant.id, session.identityId, "support.requested", grant.reason, options.now);
            const response = { status: 202, body: { grant: clone(grant), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          const supportApprovalMatch = path.match(/^\/api\/v1\/platform\/support-grants\/([^/]+)\/approve$/);
          if (supportApprovalMatch) {
            if (!session.permissions.includes("platform.support.approve")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa || Date.parse(options.now) - Date.parse(session.authenticatedAt) > 15 * 60_000) return { status: 403, body: { code: "RECENT_AUTHENTICATION_REQUIRED" } };
            const grant = supportGrants.find((candidate) => candidate.id === supportApprovalMatch[1]); if (!grant) return { status: 404, body: { code: "SUPPORT_GRANT_NOT_FOUND" } };
            if (grant.requestedBy === session.identityId) return { status: 403, body: { code: "MAKER_CANNOT_CHECK" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (grant.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: grant.version } };
            if (!body.reason?.trim()) return { status: 422, body: { code: "REASON_REQUIRED" } };
            if (Date.parse(options.now) >= Date.parse(grant.expiresAt)) return { status: 409, body: { code: "SUPPORT_GRANT_ALREADY_EXPIRED" } };
            grant.status = "ACTIVE"; grant.approvedBy = session.identityId; grant.version += 1;
            const auditRef = audit(grant.tenantId, session.identityId, "support.approved", body.reason, options.now);
            const response = { status: 200, body: { grant: clone(grant), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          if (path === "/api/v1/platform/tenants") {
            if (!session.permissions.includes("platform.tenant.provision")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa) return { status: 403, body: { code: "MFA_REQUIRED" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`;
            const digest = hash(JSON.stringify({ path, body }));
            const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (options.ifMatch !== 0) return { status: 412, body: { code: "VERSION_MISMATCH", version: 0 } };
            if (tenants.some((tenant) => tenant.id === body.tenantId)) return { status: 409, body: { code: "TENANT_ALREADY_EXISTS" } };
            if (!body.tenantId || !body.legalName || !body.planId || !Array.isArray(body.entitlements) || !body.baseCurrency || !body.timezone || !Array.isArray(body.branches) || !body.branches.length || !body.owner?.identityId || !body.owner?.membershipId || !body.configurationTemplateId || !body.quotas) return { status: 422, body: { code: "PROVISIONING_CONTRACT_INCOMPLETE" } };
            const tenant: TenantRecord = { id: body.tenantId, legalName: body.legalName, planId: body.planId, entitlements: [...body.entitlements], baseCurrency: body.baseCurrency, timezone: body.timezone, branches: clone(body.branches), ownerMembershipId: body.owner.membershipId, configurationTemplateId: body.configurationTemplateId, quotas: clone(body.quotas), status: "ACTIVE", version: 1 };
            tenants.push(tenant);
            memberships.push({ identityId: body.owner.identityId, membershipId: body.owner.membershipId, tenantId: tenant.id, branchIds: tenant.branches.map((branch) => branch.id), permissions: ["tenant.manage"], active: true });
            const auditRef = audit(tenant.id, session.identityId, "tenant.provisioned", "Platform tenant provisioning", options.now);
            const response = { status: 201, body: { tenant: clone(tenant), auditRef } };
            commands.set(key, { digest, response: clone(response) });
            return response;
          }
          const entitlementMatch = path.match(/^\/api\/v1\/platform\/tenants\/([^/]+)\/entitlements$/);
          if (entitlementMatch) {
            if (!session.permissions.includes("platform.tenant.lifecycle")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa) return { status: 403, body: { code: "MFA_REQUIRED" } };
            const tenant = tenants.find((candidate) => candidate.id === entitlementMatch[1]);
            if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (tenant.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: tenant.version } };
            if (!body.reason?.trim() || !body.planId || !Array.isArray(body.entitlements) || !body.quotas) return { status: 422, body: { code: "ENTITLEMENT_CHANGE_INCOMPLETE" } };
            tenant.planId = body.planId; tenant.entitlements = [...new Set(body.entitlements)]; tenant.quotas = clone(body.quotas); tenant.version += 1;
            entitlementHistory.push({ tenantId: tenant.id, version: tenant.version, planId: tenant.planId, entitlements: [...tenant.entitlements], quotas: clone(tenant.quotas), changedAt: options.now });
            const auditRef = audit(tenant.id, session.identityId, "tenant.entitlements.changed", body.reason, options.now);
            const response = { status: 200, body: { tenant: clone(tenant), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          const reactivateMatch = path.match(/^\/api\/v1\/platform\/tenants\/([^/]+)\/reactivate$/);
          if (reactivateMatch) {
            if (!session.permissions.includes("platform.tenant.lifecycle")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
            if (!session.mfa) return { status: 403, body: { code: "MFA_REQUIRED" } };
            const tenant = tenants.find((candidate) => candidate.id === reactivateMatch[1]);
            if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
            if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
            const key = `${session.identityId}:${options.idempotencyKey}`; const digest = hash(JSON.stringify({ path, body })); const prior = commands.get(key);
            if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
            if (tenant.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: tenant.version } };
            const reason = typeof body.reason === "string" ? body.reason.trim() : ""; if (!reason) return { status: 422, body: { code: "REASON_REQUIRED" } };
            if (tenant.status !== "SUSPENDED") return { status: 409, body: { code: "TENANT_NOT_SUSPENDED" } };
            tenant.status = "ACTIVE"; tenant.blockedCapabilities = undefined; tenant.version += 1;
            const auditRef = audit(tenant.id, session.identityId, "tenant.reactivated", reason, options.now);
            const response = { status: 200, body: { tenant: clone(tenant), auditRef } }; commands.set(key, { digest, response: clone(response) }); return response;
          }
          const match = path.match(/^\/api\/v1\/platform\/tenants\/([^/]+)\/suspend$/);
          if (!match) return { status: 404, body: { code: "NOT_FOUND" } };
          if (!session.permissions.includes("platform.tenant.lifecycle")) return { status: 403, body: { code: "PLATFORM_PERMISSION_DENIED" } };
          if (!session.mfa) return { status: 403, body: { code: "MFA_REQUIRED" } };
          const tenant = tenants.find((candidate) => candidate.id === match[1]);
          if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
          if (!options.idempotencyKey) return { status: 422, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
          const key = `${session.identityId}:${options.idempotencyKey}`;
          const digest = hash(JSON.stringify({ path, body }));
          const prior = commands.get(key);
          if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
          if (tenant.version !== options.ifMatch) return { status: 412, body: { code: "VERSION_MISMATCH", version: tenant.version } };
          const reason = typeof body.reason === "string" ? body.reason.trim() : "";
          if (!reason) return { status: 422, body: { code: "REASON_REQUIRED" } };
          tenant.status = "SUSPENDED";
          tenant.blockedCapabilities = Array.isArray(body.blockedCapabilities) ? body.blockedCapabilities.filter((value: unknown) => value === "ACCESS" || value === "COMMAND") : ["ACCESS", "COMMAND"];
          tenant.version += 1;
          const auditRef = audit(tenant.id, session.identityId, "tenant.suspended", reason, options.now);
          const response = { status: 200, body: { tenant: clone(tenant), auditRef } };
          commands.set(key, { digest, response: clone(response) });
          return response;
        },
      };
    },
    tenant(token: string) {
      const membership = input.memberships[token];
      return {
        async get(path: string): Promise<ApiResponse> {
          if (!membership || membership.active === false) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const tenant = tenants.find((candidate) => candidate.id === membership.tenantId);
          if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
          if (path === "/api/v1/tenant/recovery" && membership.permissions.includes("tenant.recovery.read")) {
            return { status: 200, body: { tenantId: tenant.id, status: tenant.status, preservedRecordCount: records.filter((record) => record.tenantId === tenant.id).length } };
          }
          if (path === "/api/v1/tenant/support-access") return { status: 200, body: { grants: clone(supportGrants.filter((grant) => grant.tenantId === tenant.id)) } };
          if (tenant.status === "SUSPENDED" && tenant.blockedCapabilities?.includes("ACCESS")) return { status: 423, body: { code: "TENANT_SUSPENDED" } };
          return { status: 200, body: { tenantId: tenant.id, status: tenant.status } };
        },
        async post(_path: string, body: Record<string, unknown>, _options: CommandOptions): Promise<ApiResponse> {
          if (!membership || membership.active === false) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const tenant = tenants.find((candidate) => candidate.id === membership.tenantId);
          if (!tenant) return { status: 404, body: { code: "TENANT_NOT_FOUND" } };
          if (tenant.status === "SUSPENDED" && tenant.blockedCapabilities?.includes("COMMAND")) return { status: 423, body: { code: "TENANT_SUSPENDED" } };
          if (typeof body.requiredEntitlement === "string" && !tenant.entitlements.includes(body.requiredEntitlement)) return { status: 403, body: { code: "ENTITLEMENT_REQUIRED", entitlement: body.requiredEntitlement } };
          return { status: 202, body: { accepted: true } };
        },
      };
    },
    retention: {
      consume(event: { effectKey: string; tenantId: string; recordId: string; legalHoldId?: string; warrantyUntil?: string; closedAt?: string; purgeEligibleAt?: string }) {
        const digest = hash(JSON.stringify(event)); const prior = retentionEffects.get(event.effectKey);
        if (prior) { if (prior !== digest) throw new Error("RETENTION_EFFECT_KEY_REUSED"); return { consumed: false }; }
        const record = records.find((candidate) => candidate.tenantId === event.tenantId && candidate.recordId === event.recordId);
        if (!record) throw new Error("RETENTION_RECORD_NOT_FOUND");
        if (Object.hasOwn(event, "legalHoldId")) record.legalHoldId = event.legalHoldId;
        if (event.warrantyUntil) record.warrantyUntil = event.warrantyUntil;
        if (event.closedAt) record.closedAt = event.closedAt;
        if (event.purgeEligibleAt) record.purgeEligibleAt = event.purgeEligibleAt;
        retentionEffects.set(event.effectKey, digest); return { consumed: true };
      },
    },
    worker: {
      async drain(now: string) {
        let processed = 0; let artifactsCreated = 0;
        for (const record of tenantExports.filter((candidate) => candidate.status === "PENDING")) {
          processed += 1;
          const scoped = records.filter((candidate) => candidate.tenantId === record.tenantId);
          const withRetention = scoped.map((item) => {
            return { ...item, retentionUntil: retentionUntil(item), retainedBecause: [...(item.legalHoldId ? ["LEGAL_HOLD"] : []), ...(item.warrantyUntil && Date.parse(item.warrantyUntil) > Date.parse(record.snapshotAt) ? ["WARRANTY"] : [])] };
          });
          const surfaceInventory = SURFACES.map((surface) => ({ surface, recordCount: withRetention.filter((item) => item.surface === surface).length }));
          const manifest = JSON.stringify({ schemaVersion: "workshopos-tenant-export-v1", tenantId: record.tenantId, snapshotAt: record.snapshotAt, generatedAt: now, recordCount: withRetention.length, surfaceInventory, records: withRetention });
          const content = JSON.stringify({ tenantId: record.tenantId, snapshotAt: record.snapshotAt, records: scoped });
          const objectRef = `private/${record.tenantId}/tenant-exports/${record.id}.json`;
          exportArtifacts.push({ exportId: record.id, tenantId: record.tenantId, objectRef, content, manifest }); artifactsCreated += 1;
          record.status = "READY"; record.version += 1; record.objectRef = objectRef; record.contentSha256 = hash(content); record.manifestSha256 = hash(manifest); record.expiresAt = new Date(Date.parse(now) + 24 * 60 * 60_000).toISOString();
          audit(record.tenantId, "local-export-worker", "tenant-export.generated", record.reason, now);
        }
        return { processed, artifactsCreated };
      },
    },
    testing: { records: () => clone(records), tenants: () => clone(tenants), memberships: () => clone(memberships), entitlementHistory: () => clone(entitlementHistory), audits: () => clone(audits), purgeEvidence: () => clone(purgeEvidence), externalDeletes: () => 0 },
  };
}
