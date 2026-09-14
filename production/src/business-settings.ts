import { ApiError, type AuthenticatedMembership } from "./admin-users.js";

export type BusinessSettings = {
  defaultLaborRateMinor: number;
  defaultJobDurationMinutes: number;
  customerUpdatesEnabled: boolean;
  invoiceFooter: string;
};
export type BusinessSettingsOverrides = Partial<BusinessSettings>;
export type SettingsWorkspace = {
  scope: { kind: "TENANT" } | { kind: "BRANCH"; branchId: string; branchName: string };
  draftVersion: number;
  publishedVersion: number;
  inherited: BusinessSettings;
  overrides: BusinessSettingsOverrides;
  effective: BusinessSettings;
  updatedAt: string;
};
export type SettingsSnapshot = { workItemId: string; tenantVersion: number; branchVersion?: number; values: BusinessSettings; capturedAt: string };

export interface BusinessSettingsRepository {
  workspace(actor: AuthenticatedMembership, branchId?: string): Promise<SettingsWorkspace>;
  saveDraft(actor: AuthenticatedMembership, branchId: string | undefined, input: { version: number; values: BusinessSettingsOverrides }): Promise<SettingsWorkspace>;
  publish(actor: AuthenticatedMembership, branchId: string | undefined, input: { version: number }, idempotencyKey: string): Promise<SettingsWorkspace>;
  snapshotWorkItem(actor: AuthenticatedMembership, workItemId: string, branchId: string, idempotencyKey: string): Promise<SettingsSnapshot>;
}

const allowedKeys = new Set<keyof BusinessSettings>(["defaultLaborRateMinor", "defaultJobDurationMinutes", "customerUpdatesEnabled", "invoiceFooter"]);

function authorizeBranch(actor: AuthenticatedMembership, branchId?: string) {
  if (branchId && !actor.branchIds.includes(branchId)) throw new ApiError(403, "BRANCH_FORBIDDEN");
}
function requirePermission(actor: AuthenticatedMembership, key: string) {
  if (!actor.permissions.includes(key)) throw new ApiError(403, "PERMISSION_DENIED");
}
function validateValues(raw: unknown): BusinessSettingsOverrides {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new ApiError(400, "SETTINGS_INVALID");
  const values = raw as Record<string, unknown>;
  if (Object.keys(values).some((key) => !allowedKeys.has(key as keyof BusinessSettings))) throw new ApiError(400, "SETTINGS_INVALID");
  if (values.defaultLaborRateMinor !== undefined && (!Number.isSafeInteger(values.defaultLaborRateMinor) || Number(values.defaultLaborRateMinor) < 0 || Number(values.defaultLaborRateMinor) > 100_000_000)) throw new ApiError(400, "SETTINGS_INVALID");
  if (values.defaultJobDurationMinutes !== undefined && (!Number.isSafeInteger(values.defaultJobDurationMinutes) || Number(values.defaultJobDurationMinutes) < 15 || Number(values.defaultJobDurationMinutes) > 1440)) throw new ApiError(400, "SETTINGS_INVALID");
  if (values.customerUpdatesEnabled !== undefined && typeof values.customerUpdatesEnabled !== "boolean") throw new ApiError(400, "SETTINGS_INVALID");
  if (values.invoiceFooter !== undefined && (typeof values.invoiceFooter !== "string" || values.invoiceFooter.trim().length > 240)) throw new ApiError(400, "SETTINGS_INVALID");
  return { ...values } as BusinessSettingsOverrides;
}
function version(raw: unknown) {
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) throw new ApiError(400, "VERSION_REQUIRED");
  return value;
}

export class BusinessSettingsService {
  constructor(private readonly repository: BusinessSettingsRepository) {}
  async get(actor: AuthenticatedMembership, branchId?: string) {
    requirePermission(actor, "business-settings.page"); authorizeBranch(actor, branchId);
    return this.repository.workspace(actor, branchId);
  }
  async save(actor: AuthenticatedMembership, branchId: string | undefined, raw: Record<string, unknown>) {
    requirePermission(actor, "business-settings.manage"); authorizeBranch(actor, branchId);
    return this.repository.saveDraft(actor, branchId, { version: version(raw.version), values: validateValues(raw.values) });
  }
  async publish(actor: AuthenticatedMembership, branchId: string | undefined, raw: Record<string, unknown>, idempotencyKey: string) {
    requirePermission(actor, "business-settings.manage"); authorizeBranch(actor, branchId);
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    return this.repository.publish(actor, branchId, { version: version(raw.version) }, idempotencyKey);
  }
  async snapshot(actor: AuthenticatedMembership, workItemId: string, branchId: string, idempotencyKey: string) {
    requirePermission(actor, "work-item.manage"); authorizeBranch(actor, branchId);
    if (!idempotencyKey.trim()) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    return this.repository.snapshotWorkItem(actor, workItemId, branchId, idempotencyKey);
  }
}
