import type { Role } from "./types";
import { DEFAULT_TEMPLATE_VERSION, findUnsupportedPlaceholders, seedReportTemplates, type CompanyAssets, type ReportCategory, type ReportTemplate } from "./report-templates";

export type { CompanyAssets, ReportCategory, ReportTemplate } from "./report-templates";

export const ADMIN_DEMO_STATE_VERSION = 1;
export const ADMIN_DEMO_STORAGE_KEY = `workshopos.admin-demo.v${ADMIN_DEMO_STATE_VERSION}`;

export const BUILT_IN_ROLE_LABELS: Record<Role, string> = {
  admin: "Owner/Admin",
  service: "Service Advisor",
  reception: "Reception",
  accounts: "Accounts",
  store: "Store",
  tech: "Technician",
};

export type AdminPageKey =
  | "receive-vehicle"
  | "today-queue"
  | "customers"
  | "vehicles"
  | "search"
  | "my-queue"
  | "job-card"
  | "estimate"
  | "follow-ups"
  | "media"
  | "material-requests"
  | "issue-material"
  | "reconcile"
  | "stock"
  | "my-tasks"
  | "work-update"
  | "qc-prep"
  | "ready-to-invoice"
  | "invoice"
  | "payment"
  | "delivery"
  | "dashboard"
  | "data-flow"
  | "jobs"
  | "masters"
  | "manage"
  | "admin-console";

export interface AdminPageDefinition {
  key: AdminPageKey;
  label: string;
}

export interface AdminPageGroup {
  key: "front-desk" | "workshop" | "inventory" | "finance" | "administration";
  label: string;
  pages: readonly AdminPageDefinition[];
}

export const ADMIN_PAGE_GROUPS: readonly AdminPageGroup[] = [
  {
    key: "front-desk",
    label: "Front Desk",
    pages: [
      { key: "receive-vehicle", label: "Receive Vehicle" },
      { key: "today-queue", label: "Today Queue" },
      { key: "customers", label: "Customers" },
      { key: "vehicles", label: "Vehicles" },
      { key: "search", label: "Search" },
    ],
  },
  {
    key: "workshop",
    label: "Workshop",
    pages: [
      { key: "my-queue", label: "My Queue" },
      { key: "job-card", label: "Job Card" },
      { key: "estimate", label: "Estimate" },
      { key: "follow-ups", label: "Follow-ups" },
      { key: "media", label: "Media" },
      { key: "my-tasks", label: "My Tasks" },
      { key: "work-update", label: "Work Update" },
      { key: "qc-prep", label: "QC Prep" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    pages: [
      { key: "material-requests", label: "Material Requests" },
      { key: "issue-material", label: "Issue Material" },
      { key: "reconcile", label: "Reconcile" },
      { key: "stock", label: "Stock" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    pages: [
      { key: "ready-to-invoice", label: "Ready To Invoice" },
      { key: "invoice", label: "Invoice" },
      { key: "payment", label: "Payment" },
      { key: "delivery", label: "Delivery" },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    pages: [
      { key: "dashboard", label: "Dashboard" },
      { key: "data-flow", label: "Data Flow" },
      { key: "jobs", label: "Job Cards" },
      { key: "masters", label: "Masters" },
      { key: "manage", label: "Manage" },
      { key: "admin-console", label: "Admin Console" },
    ],
  },
] as const;

export const PAGE_KEY_BY_MENU_LABEL: Readonly<Record<string, AdminPageKey>> = Object.fromEntries(
  ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.map((page) => [page.label, page.key])),
) as Record<string, AdminPageKey>;

export interface DemoRole {
  id: string;
  label: string;
  description: string;
  systemRole?: Role;
  isBuiltIn: boolean;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export type RolePageAccess = Record<string, AdminPageKey[]>;

export interface WorkshopBusinessSettings {
  profile: {
    businessName: string;
    legalName: string;
    phone: string;
    email: string;
    address: string;
    footer: string;
    timezone: string;
    currency: string;
  };
  branch: {
    name: string;
    openingTime: string;
    closingTime: string;
    workingDays: string[];
    holidayBehavior: "closed" | "appointment-only";
  };
  jobs: {
    jobNumberPrefix: string;
    defaultPromisedHours: number;
    requireQc: boolean;
    washingDefault: boolean;
    autoCloseAfterDelivery: boolean;
  };
  pricing: {
    estimateValidityDays: number;
    defaultLabourRate: number;
    discountApprovalPercent: number;
    requireEstimateApproval: boolean;
  };
  billing: {
    gstin: string;
    bankAccountHolder: string;
    bankName: string;
    bankAccountNumber: string;
    bankIfsc: string;
    bankBranch: string;
    upiId: string;
    defaultGstPercent: number;
    invoicePrefix: string;
    receiptPrefix: string;
    gatePassPrefix: string;
    paymentModes: string[];
  };
  inventory: {
    defaultUnit: string;
    lowStockNotifications: boolean;
    requireAdjustmentReason: boolean;
  };
  notifications: {
    customerChannels: Array<"sms" | "email" | "whatsapp">;
    documentHeader: string;
    estimateTemplate: string;
    invoiceTemplate: string;
  };
  logRetention: {
    operationalDays: number;
    featureDays: number;
  };
}

export type DemoLogStream = "operational" | "feature";
export type DemoLogLevel = "info" | "warning" | "error";

export interface DemoLogEntry {
  id: string;
  stream: DemoLogStream;
  timestamp: string;
  level: DemoLogLevel;
  area: string;
  feature: string;
  message: string;
  userId?: string;
  userName?: string;
  referenceId?: string;
  details?: Record<string, unknown>;
}

export interface DemoLogFilter {
  stream?: DemoLogStream | "all";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  levels?: DemoLogLevel[];
  area?: string;
  feature?: string;
  userId?: string;
}

export interface SessionInventoryItem {
  id: string;
  importBatchId: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  stockQty: number;
  lowStockQty: number;
  importedAt: string;
}

export interface DemoImportError {
  row: number;
  field?: string;
  message: string;
}

export interface DemoImportBatch {
  id: string;
  fileName: string;
  status: "mapping" | "validated" | "imported" | "failed";
  createdAt: string;
  importedAt?: string;
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  columnMapping: Record<string, string>;
  errors: DemoImportError[];
}

export interface AdminDemoState {
  version: typeof ADMIN_DEMO_STATE_VERSION;
  roles: DemoRole[];
  rolePageAccess: RolePageAccess;
  businessSettings: WorkshopBusinessSettings;
  logs: DemoLogEntry[];
  importBatches: DemoImportBatch[];
  sessionInventory: SessionInventoryItem[];
  reportTemplates: ReportTemplate[];
  companyAssets: CompanyAssets;
}

export interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<unknown> ? T[P] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const ALL_PAGE_KEYS = new Set<AdminPageKey>(ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.map((page) => page.key)));
const OWNER_ROLE_ID: Role = "admin";
const PROTECTED_OWNER_PAGE: AdminPageKey = "admin-console";

export const DEFAULT_ROLE_PAGE_ACCESS: Readonly<RolePageAccess> = {
  reception: ["receive-vehicle", "today-queue", "customers", "vehicles", "search"],
  service: ["my-queue", "job-card", "estimate", "follow-ups", "media", "search"],
  store: ["material-requests", "issue-material", "reconcile", "stock", "search"],
  tech: ["my-tasks", "work-update", "qc-prep", "search"],
  accounts: ["ready-to-invoice", "invoice", "payment", "delivery", "search"],
  admin: ["dashboard", "data-flow", "jobs", "customers", "vehicles", "media", "masters", "manage", "search", "admin-console"],
};

const DEFAULT_SETTINGS: WorkshopBusinessSettings = {
  profile: {
    businessName: "WorkshopOS Demo Studio",
    legalName: "WorkshopOS Automotive Services",
    phone: "+91 98765 43210",
    email: "hello@workshopos.demo",
    address: "Bhubaneswar, Odisha",
    footer: "Thank you for choosing WorkshopOS Demo Studio.",
    timezone: "Asia/Kolkata",
    currency: "INR",
  },
  branch: {
    name: "Main Workshop",
    openingTime: "09:00",
    closingTime: "19:00",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    holidayBehavior: "appointment-only",
  },
  jobs: {
    jobNumberPrefix: "JC",
    defaultPromisedHours: 48,
    requireQc: true,
    washingDefault: false,
    autoCloseAfterDelivery: true,
  },
  pricing: {
    estimateValidityDays: 7,
    defaultLabourRate: 850,
    discountApprovalPercent: 10,
    requireEstimateApproval: true,
  },
  billing: {
    gstin: "21ABCDE1234F1Z5",
    bankAccountHolder: "WorkshopOS Automotive Services",
    bankName: "State Bank of India",
    bankAccountNumber: "001234567890",
    bankIfsc: "SBIN0001234",
    bankBranch: "Bhubaneswar Main Branch",
    upiId: "workshopos@sbi",
    defaultGstPercent: 18,
    invoicePrefix: "INV",
    receiptPrefix: "REC",
    gatePassPrefix: "GP",
    paymentModes: ["Cash", "Card", "UPI", "Bank Transfer"],
  },
  inventory: {
    defaultUnit: "piece",
    lowStockNotifications: true,
    requireAdjustmentReason: true,
  },
  notifications: {
    customerChannels: ["whatsapp", "sms"],
    documentHeader: "WorkshopOS Demo Studio",
    estimateTemplate: "Standard Estimate",
    invoiceTemplate: "GST Invoice",
  },
  logRetention: { operationalDays: 30, featureDays: 30 },
};

const DEFAULT_TIMESTAMP = "2026-09-22T09:00:00.000Z";

function builtInRoles(timestamp: string): DemoRole[] {
  return (Object.entries(BUILT_IN_ROLE_LABELS) as Array<[Role, string]>).map(([id, label]) => ({
    id,
    label,
    description: `${label} workspace access`,
    systemRole: id,
    isBuiltIn: true,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function defaultLogs(timestamp: string): DemoLogEntry[] {
  const at = new Date(timestamp).getTime();
  const isoBefore = (minutes: number) => new Date(at - minutes * 60_000).toISOString();
  return [
    { id: "log-default-1", stream: "operational", timestamp: isoBefore(5), level: "info", area: "Jobs", feature: "Job Card", message: "Job card JC-2026-002144 opened", userId: "service", userName: "Service Advisor", referenceId: "JC-2026-002144" },
    { id: "log-default-2", stream: "operational", timestamp: isoBefore(18), level: "warning", area: "Inventory", feature: "Stock", message: "Gloss PPF roll reached its low-stock threshold", userId: "store", userName: "Store", referenceId: "PPF-ROLL" },
    { id: "log-default-3", stream: "operational", timestamp: isoBefore(31), level: "info", area: "Accounts", feature: "Payment", message: "Payment recorded for a completed job", userId: "accounts", userName: "Accounts" },
    { id: "log-default-4", stream: "feature", timestamp: isoBefore(45), level: "info", area: "Administration", feature: "Business Settings", message: "Demo business settings reviewed", userId: "admin", userName: "Owner/Admin" },
    { id: "log-default-5", stream: "feature", timestamp: isoBefore(60), level: "info", area: "Authentication", feature: "Login", message: "Owner/Admin signed in", userId: "admin", userName: "Owner/Admin" },
  ];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createDefaultAdminDemoState(now: Date | string = DEFAULT_TIMESTAMP): AdminDemoState {
  const timestamp = new Date(now).toISOString();
  return {
    version: ADMIN_DEMO_STATE_VERSION,
    roles: builtInRoles(timestamp),
    rolePageAccess: clone(DEFAULT_ROLE_PAGE_ACCESS),
    businessSettings: clone(DEFAULT_SETTINGS),
    logs: defaultLogs(timestamp),
    importBatches: [],
    sessionInventory: [],
    reportTemplates: seedReportTemplates(timestamp),
    companyAssets: { logo: null, stamp: null, authorizedSignature: null },
  };
}

export const DEFAULT_ADMIN_DEMO_STATE: Readonly<AdminDemoState> = createDefaultAdminDemoState();

function browserSessionStorage(): SessionStorageLike | undefined {
  return typeof sessionStorage === "undefined" ? undefined : sessionStorage;
}

function mergeSettings(
  saved?: DeepPartial<WorkshopBusinessSettings>,
  base: WorkshopBusinessSettings = DEFAULT_SETTINGS,
): WorkshopBusinessSettings {
  if (!saved) return clone(base);
  const legacy = saved as DeepPartial<WorkshopBusinessSettings> & { profile?: { gstin?: string } };
  const { gstin: _legacyGstin, ...savedProfile } = legacy.profile ?? {};
  const migratedGstin = saved.billing?.gstin === undefined && legacy.profile?.gstin !== undefined
    ? legacy.profile.gstin
    : saved.billing?.gstin;
  return {
    profile: { ...base.profile, ...savedProfile },
    branch: { ...base.branch, ...saved.branch },
    jobs: { ...base.jobs, ...saved.jobs },
    pricing: { ...base.pricing, ...saved.pricing },
    billing: { ...base.billing, ...saved.billing, ...(migratedGstin === undefined ? {} : { gstin: migratedGstin }) },
    inventory: { ...base.inventory, ...saved.inventory },
    notifications: { ...base.notifications, ...saved.notifications },
    logRetention: { ...base.logRetention, ...saved.logRetention },
  };
}

function hydrateState(value: unknown): AdminDemoState | undefined {
  if (!value || typeof value !== "object") return undefined;
  const saved = value as Partial<AdminDemoState>;
  if (saved.version !== ADMIN_DEMO_STATE_VERSION || !Array.isArray(saved.roles) || !saved.rolePageAccess || !Array.isArray(saved.logs)) return undefined;
  const base = createDefaultAdminDemoState();
  const access = Object.fromEntries(Object.entries(saved.rolePageAccess).map(([roleId, pages]) => [roleId, sanitizePages(pages)]));
  access[OWNER_ROLE_ID] = protectOwnerAccess(access[OWNER_ROLE_ID] ?? []);
  const categories: ReportCategory[] = ["estimate", "invoice", "gate-pass", "job-card", "payment-receipt"];
  const storedTemplates = Array.isArray(saved.reportTemplates) ? saved.reportTemplates : [];
  const reportTemplates = categories.flatMap((category) => {
    const candidates = storedTemplates.filter((template): template is ReportTemplate => Boolean(template && typeof template === "object" && template.category === category && template.id && template.name && template.html));
    const seeded = base.reportTemplates.filter((template) => template.category === category);
    // A stale seeded default (older design, never edited) is replaced by the current one; edited or custom templates are kept.
    const upgraded = candidates.map((template) => {
      const fresh = seeded.find((item) => item.id === template.id);
      const stale = fresh && (template.seedVersion ?? 0) < DEFAULT_TEMPLATE_VERSION && template.createdAt === template.updatedAt;
      return stale ? { ...fresh, active: template.active, createdAt: template.createdAt } : template;
    });
    const templates = upgraded.length ? upgraded : seeded;
    const activeId = templates.find((template) => template.active)?.id ?? templates[0].id;
    return templates.map((template) => ({ ...template, active: template.id === activeId }));
  });
  return {
    version: ADMIN_DEMO_STATE_VERSION,
    roles: saved.roles,
    rolePageAccess: access,
    businessSettings: mergeSettings(saved.businessSettings),
    logs: saved.logs,
    importBatches: Array.isArray(saved.importBatches) ? saved.importBatches : base.importBatches,
    sessionInventory: Array.isArray(saved.sessionInventory) ? saved.sessionInventory : base.sessionInventory,
    reportTemplates,
    companyAssets: saved.companyAssets && typeof saved.companyAssets === "object" ? { ...base.companyAssets, ...saved.companyAssets } : base.companyAssets,
  };
}

export function loadAdminDemoState(storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {
  if (!storage) return createDefaultAdminDemoState(now);
  try {
    const raw = storage.getItem(ADMIN_DEMO_STORAGE_KEY);
    if (!raw) return createDefaultAdminDemoState(now);
    const hydrated = hydrateState(JSON.parse(raw));
    return hydrated ? enforceLogRetention(hydrated, now) : createDefaultAdminDemoState(now);
  } catch {
    return createDefaultAdminDemoState(now);
  }
}

export function saveAdminDemoState(state: AdminDemoState, storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {
  const retained = enforceLogRetention({ ...state, version: ADMIN_DEMO_STATE_VERSION }, now);
  storage?.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(retained));
  return retained;
}

export function resetAdminDemoState(storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {
  storage?.removeItem(ADMIN_DEMO_STORAGE_KEY);
  return createDefaultAdminDemoState(now);
}

function normalizedRoleLabel(label: string): string {
  const normalized = label.trim().replace(/\s+/g, " ");
  if (!normalized) throw new Error("Role name is required.");
  return normalized;
}

function assertUniqueRoleLabel(state: AdminDemoState, label: string, exceptId?: string): void {
  if (state.roles.some((role) => role.id !== exceptId && role.label.toLowerCase() === label.toLowerCase())) {
    throw new Error("A role with this name already exists.");
  }
}

export function addDemoRole(
  state: AdminDemoState,
  input: { label: string; description?: string; pageAccess?: readonly AdminPageKey[] },
  now: Date | string = new Date(),
): AdminDemoState {
  const label = normalizedRoleLabel(input.label);
  assertUniqueRoleLabel(state, label);
  const timestamp = new Date(now).toISOString();
  const nextNumber = state.roles.reduce((max, role) => {
    const match = /^custom-(\d+)$/.exec(role.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  const role: DemoRole = {
    id: `custom-${nextNumber}`,
    label,
    description: input.description?.trim() ?? "",
    isBuiltIn: false,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return {
    ...state,
    roles: [...state.roles, role],
    rolePageAccess: { ...state.rolePageAccess, [role.id]: sanitizePages(input.pageAccess ?? []) },
  };
}

export function updateDemoRole(
  state: AdminDemoState,
  roleId: string,
  updates: { label?: string; description?: string },
  now: Date | string = new Date(),
): AdminDemoState {
  const current = state.roles.find((role) => role.id === roleId);
  if (!current) throw new Error("Role not found.");
  const label = updates.label === undefined ? current.label : normalizedRoleLabel(updates.label);
  assertUniqueRoleLabel(state, label, roleId);
  return {
    ...state,
    roles: state.roles.map((role) => role.id === roleId ? {
      ...role,
      label,
      description: updates.description === undefined ? role.description : updates.description.trim(),
      updatedAt: new Date(now).toISOString(),
    } : role),
  };
}

export function archiveDemoRole(state: AdminDemoState, roleId: string, now: Date | string = new Date()): AdminDemoState {
  if (roleId === OWNER_ROLE_ID) throw new Error("Owner/Admin cannot be archived.");
  if (!state.roles.some((role) => role.id === roleId)) throw new Error("Role not found.");
  const timestamp = new Date(now).toISOString();
  return {
    ...state,
    roles: state.roles.map((role) => role.id === roleId ? { ...role, status: "archived", archivedAt: timestamp, updatedAt: timestamp } : role),
  };
}

function sanitizePages(pages: readonly unknown[]): AdminPageKey[] {
  return [...new Set(pages.filter((page): page is AdminPageKey => typeof page === "string" && ALL_PAGE_KEYS.has(page as AdminPageKey)))];
}

function protectOwnerAccess(pages: readonly AdminPageKey[]): AdminPageKey[] {
  const clean = sanitizePages(pages);
  return clean.includes(PROTECTED_OWNER_PAGE) ? clean : [...clean, PROTECTED_OWNER_PAGE];
}

export function updateRolePageAccess(state: AdminDemoState, roleId: string, pages: readonly AdminPageKey[]): AdminDemoState {
  if (!state.roles.some((role) => role.id === roleId)) throw new Error("Role not found.");
  const nextPages = roleId === OWNER_ROLE_ID ? protectOwnerAccess(pages) : sanitizePages(pages);
  return { ...state, rolePageAccess: { ...state.rolePageAccess, [roleId]: nextPages } };
}

export function resolvePermittedPages(state: AdminDemoState, roleId: string): AdminPageKey[] {
  const role = state.roles.find((candidate) => candidate.id === roleId);
  if (!role || role.status === "archived") return [];
  const pages = sanitizePages(state.rolePageAccess[roleId] ?? []);
  return roleId === OWNER_ROLE_ID ? protectOwnerAccess(pages) : pages;
}

export function updateBusinessSettings(state: AdminDemoState, updates: DeepPartial<WorkshopBusinessSettings>): AdminDemoState {
  return { ...state, businessSettings: normalizeBusinessSettings(mergeSettings(updates, state.businessSettings)) };
}

export function normalizeBusinessSettings(settings: WorkshopBusinessSettings): WorkshopBusinessSettings {
  const trim = (value: string) => value.trim();
  return {
    profile: {
      businessName: trim(settings.profile.businessName),
      legalName: trim(settings.profile.legalName),
      phone: trim(settings.profile.phone),
      email: trim(settings.profile.email),
      address: trim(settings.profile.address),
      footer: trim(settings.profile.footer ?? ""),
      timezone: trim(settings.profile.timezone),
      currency: trim(settings.profile.currency),
    },
    branch: { ...settings.branch, name: trim(settings.branch.name), openingTime: trim(settings.branch.openingTime), closingTime: trim(settings.branch.closingTime), workingDays: settings.branch.workingDays.map(trim) },
    jobs: { ...settings.jobs, jobNumberPrefix: trim(settings.jobs.jobNumberPrefix) },
    pricing: { ...settings.pricing },
    billing: {
      ...settings.billing,
      gstin: trim(settings.billing.gstin).toUpperCase(),
      bankAccountHolder: trim(settings.billing.bankAccountHolder),
      bankName: trim(settings.billing.bankName),
      bankAccountNumber: trim(settings.billing.bankAccountNumber),
      bankIfsc: trim(settings.billing.bankIfsc).toUpperCase(),
      bankBranch: trim(settings.billing.bankBranch),
      upiId: trim(settings.billing.upiId),
      invoicePrefix: trim(settings.billing.invoicePrefix),
      receiptPrefix: trim(settings.billing.receiptPrefix),
      gatePassPrefix: trim(settings.billing.gatePassPrefix),
      paymentModes: settings.billing.paymentModes.map(trim),
    },
    inventory: { ...settings.inventory, defaultUnit: trim(settings.inventory.defaultUnit) },
    notifications: {
      ...settings.notifications,
      customerChannels: [...settings.notifications.customerChannels],
      documentHeader: trim(settings.notifications.documentHeader),
      estimateTemplate: trim(settings.notifications.estimateTemplate),
      invoiceTemplate: trim(settings.notifications.invoiceTemplate),
    },
    logRetention: { ...settings.logRetention },
  };
}

export function validateBusinessSettings(settings: WorkshopBusinessSettings): string[] {
  const errors: string[] = [];
  if (!settings.profile.businessName.trim()) errors.push("Business name is required.");
  if (!/^\S+@\S+\.\S+$/.test(settings.profile.email.trim())) errors.push("Enter a valid business email.");
  if (!settings.branch.name.trim()) errors.push("Branch name is required.");
  if (settings.jobs.defaultPromisedHours <= 0) errors.push("Default promised hours must be greater than zero.");
  if (settings.pricing.estimateValidityDays <= 0) errors.push("Estimate validity must be at least 1 day.");
  if (settings.pricing.defaultLabourRate < 0) errors.push("Default labour rate cannot be negative.");
  if (settings.billing.defaultGstPercent < 0 || settings.billing.defaultGstPercent > 100) errors.push("GST percent must be between 0 and 100.");
  if (settings.billing.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(settings.billing.gstin)) errors.push("GSTIN must be a valid 15-character Indian GSTIN.");
  if (settings.billing.bankIfsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(settings.billing.bankIfsc)) errors.push("IFSC must contain four letters, 0, then six letters or digits.");
  if (settings.billing.upiId && !/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$/.test(settings.billing.upiId)) errors.push("UPI ID must use a valid handle@provider format.");
  return errors;
}

const normalizeTemplateName = (name: string) => name.trim().toLocaleLowerCase();

function assertTemplateInput(state: AdminDemoState, category: ReportCategory, name: string, html: string, exceptId?: string) {
  if (!name.trim()) throw new Error("Template name is required.");
  if (!html.trim()) throw new Error("Template HTML is required.");
  const unsupported = findUnsupportedPlaceholders(html, category);
  if (unsupported.length) throw new Error(`Unsupported placeholders: ${unsupported.join(", ")}`);
  if (state.reportTemplates.some((template) => template.category === category && template.id !== exceptId && normalizeTemplateName(template.name) === normalizeTemplateName(name))) {
    throw new Error("Template names must be unique within a category.");
  }
}

function nextTemplateId(state: AdminDemoState, category: ReportCategory) {
  const prefix = `template-${category}-`;
  const next = state.reportTemplates.reduce((highest, template) => {
    const match = template.id.startsWith(prefix) ? /([0-9]+)$/.exec(template.id) : null;
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0) + 1;
  return `${prefix}${next}`;
}

export function createReportTemplate(
  state: AdminDemoState,
  input: { category: ReportCategory; name: string; html: string; active?: boolean },
  now: Date | string = new Date(),
): AdminDemoState {
  assertTemplateInput(state, input.category, input.name, input.html);
  const timestamp = new Date(now).toISOString();
  const template: ReportTemplate = { id: nextTemplateId(state, input.category), category: input.category, name: input.name.trim(), html: input.html.trim(), active: Boolean(input.active), createdAt: timestamp, updatedAt: timestamp };
  const existing = input.active ? state.reportTemplates.map((item) => item.category === input.category ? { ...item, active: false, updatedAt: timestamp } : item) : state.reportTemplates;
  return { ...state, reportTemplates: [...existing, template] };
}

export function updateReportTemplate(
  state: AdminDemoState,
  templateId: string,
  updates: { name?: string; html?: string; active?: boolean },
  now: Date | string = new Date(),
): AdminDemoState {
  const current = state.reportTemplates.find((template) => template.id === templateId);
  if (!current) throw new Error("Template not found.");
  const name = updates.name ?? current.name;
  const html = updates.html ?? current.html;
  assertTemplateInput(state, current.category, name, html, templateId);
  if (current.active && updates.active === false) throw new Error("Activate another template before deactivating the current template.");
  const timestamp = new Date(now).toISOString();
  return {
    ...state,
    reportTemplates: state.reportTemplates.map((template) => {
      if (updates.active && template.category === current.category && template.id !== templateId) return { ...template, active: false, updatedAt: timestamp };
      return template.id === templateId ? { ...template, name: name.trim(), html: html.trim(), active: updates.active ?? template.active, updatedAt: timestamp } : template;
    }),
  };
}

export function activateReportTemplate(state: AdminDemoState, templateId: string, now: Date | string = new Date()): AdminDemoState {
  return updateReportTemplate(state, templateId, { active: true }, now);
}

export function deleteReportTemplate(state: AdminDemoState, templateId: string): AdminDemoState {
  const current = state.reportTemplates.find((template) => template.id === templateId);
  if (!current) throw new Error("Template not found.");
  if (current.active) throw new Error("Activate another template before deleting the active template.");
  return { ...state, reportTemplates: state.reportTemplates.filter((template) => template.id !== templateId) };
}

export interface CompanyDetails { address: string; phone: string; email: string; gstin: string; footer: string }

/** Company Settings singleton: name, images and (optionally) contact/GSTIN/footer, saved atomically. */
export function saveCompanyIdentity(state: AdminDemoState, companyName: string, assets: CompanyAssets, details?: CompanyDetails): AdminDemoState {
  if (!companyName.trim()) throw new Error("Company name is required.");
  return {
    ...state,
    businessSettings: normalizeBusinessSettings(mergeSettings(details
      ? { profile: { businessName: companyName.trim(), address: details.address, phone: details.phone, email: details.email, footer: details.footer }, billing: { gstin: details.gstin } }
      : { profile: { businessName: companyName.trim() } }, state.businessSettings)),
    companyAssets: { ...assets },
  };
}

function nextLogId(logs: readonly DemoLogEntry[]): string {
  const next = logs.reduce((max, log) => {
    const match = /^log-(\d+)$/.exec(log.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `log-${next}`;
}

export function appendDemoLog(
  state: AdminDemoState,
  entry: Omit<DemoLogEntry, "id" | "timestamp"> & Partial<Pick<DemoLogEntry, "id" | "timestamp">>,
  now: Date | string = new Date(),
): AdminDemoState {
  const log: DemoLogEntry = {
    ...entry,
    id: entry.id ?? nextLogId(state.logs),
    timestamp: new Date(entry.timestamp ?? now).toISOString(),
  };
  return enforceLogRetention({ ...state, logs: [log, ...state.logs] }, now);
}

export function filterDemoLogs(logs: readonly DemoLogEntry[], filter: DemoLogFilter = {}): DemoLogEntry[] {
  const search = filter.search?.trim().toLowerCase();
  const from = filter.dateFrom ? new Date(`${filter.dateFrom}T00:00:00.000`).getTime() : undefined;
  const to = filter.dateTo ? new Date(`${filter.dateTo}T23:59:59.999`).getTime() : undefined;
  return logs.filter((log) => {
    const timestamp = new Date(log.timestamp).getTime();
    if (filter.stream && filter.stream !== "all" && log.stream !== filter.stream) return false;
    if (from !== undefined && timestamp < from) return false;
    if (to !== undefined && timestamp > to) return false;
    if (filter.levels?.length && !filter.levels.includes(log.level)) return false;
    if (filter.area && log.area !== filter.area) return false;
    if (filter.feature && log.feature !== filter.feature) return false;
    if (filter.userId && log.userId !== filter.userId) return false;
    if (search) {
      const haystack = [log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  }).sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}

export function clearDemoLogs(state: AdminDemoState, stream: DemoLogStream | "all" = "all"): AdminDemoState {
  return { ...state, logs: stream === "all" ? [] : state.logs.filter((log) => log.stream !== stream) };
}

export interface InventoryImportRowInput {
  sku: string;
  name: string;
  category: string;
  unit: string;
  stockQty: number;
  lowStockQty: number;
}

function nextImportBatchId(batches: readonly DemoImportBatch[]): string {
  const next = batches.reduce((max, batch) => {
    const match = /^import-(\d+)$/.exec(batch.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `import-${next}`;
}

function nextSessionInventoryId(items: readonly SessionInventoryItem[]): string {
  const next = items.reduce((max, item) => {
    const match = /^session-inv-(\d+)$/.exec(item.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `session-inv-${next}`;
}

/**
 * Merges validated inventory-import rows into the session-only inventory and records the
 * import batch. Never touches the sql.js-backed inventory — session presentation data only.
 */
export function confirmInventoryImport(
  state: AdminDemoState,
  input: {
    fileName: string;
    columnMapping: Record<string, string>;
    totalRows: number;
    validRows: readonly InventoryImportRowInput[];
    rejectedRows: number;
  },
  now: Date | string = new Date(),
): AdminDemoState {
  const timestamp = new Date(now).toISOString();
  const batchId = nextImportBatchId(state.importBatches);
  const created: SessionInventoryItem[] = [];
  for (const row of input.validRows) {
    const id = nextSessionInventoryId([...state.sessionInventory, ...created]);
    created.push({
      id,
      importBatchId: batchId,
      sku: row.sku,
      name: row.name,
      category: row.category,
      unit: row.unit,
      stockQty: row.stockQty,
      lowStockQty: row.lowStockQty,
      importedAt: timestamp,
    });
  }
  const batch: DemoImportBatch = {
    id: batchId,
    fileName: input.fileName,
    status: "imported",
    createdAt: timestamp,
    importedAt: timestamp,
    totalRows: input.totalRows,
    acceptedRows: created.length,
    rejectedRows: input.rejectedRows,
    columnMapping: input.columnMapping,
    errors: [],
  };
  return {
    ...state,
    importBatches: [...state.importBatches, batch],
    sessionInventory: [...state.sessionInventory, ...created],
  };
}

export function enforceLogRetention(state: AdminDemoState, now: Date | string = new Date()): AdminDemoState {
  const nowMs = new Date(now).getTime();
  const { operationalDays, featureDays } = state.businessSettings.logRetention;
  const retentionMs = (stream: DemoLogStream) => Math.max(0, stream === "operational" ? operationalDays : featureDays) * 86_400_000;
  return {
    ...state,
    logs: state.logs.filter((log) => {
      const timestamp = new Date(log.timestamp).getTime();
      return Number.isFinite(timestamp) && timestamp >= nowMs - retentionMs(log.stream) && timestamp <= nowMs;
    }),
  };
}
