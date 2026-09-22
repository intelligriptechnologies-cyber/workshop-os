import type { Role } from "./types";

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
      { key: "jobs", label: "Jobs" },
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
    gstin: string;
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
    gstin: "21ABCDE1234F1Z5",
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
  return {
    profile: { ...base.profile, ...saved.profile },
    branch: { ...base.branch, ...saved.branch },
    jobs: { ...base.jobs, ...saved.jobs },
    pricing: { ...base.pricing, ...saved.pricing },
    billing: { ...base.billing, ...saved.billing },
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
  return {
    version: ADMIN_DEMO_STATE_VERSION,
    roles: saved.roles,
    rolePageAccess: access,
    businessSettings: mergeSettings(saved.businessSettings),
    logs: saved.logs,
    importBatches: Array.isArray(saved.importBatches) ? saved.importBatches : base.importBatches,
    sessionInventory: Array.isArray(saved.sessionInventory) ? saved.sessionInventory : base.sessionInventory,
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
  return { ...state, businessSettings: mergeSettings(updates, state.businessSettings) };
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
